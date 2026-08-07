'use server';

import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
export async function createApplication(courseId: string) {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized: You must be logged in.');
    }

    // Ensure profile exists (defensive in case trigger failed)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (!profile) {
        console.log('Profile missing for user, creating now:', user.id);
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                email: user.email,
                first_name: user.user_metadata?.first_name || 'Applicant',
                last_name: user.user_metadata?.last_name || '',
                role: (user.user_metadata?.role as any) || 'APPLICANT'
            });

        if (profileError) {
            console.error('Error creating profile fallback:', profileError);
            throw new Error(`Failed to create user profile: ${profileError.message}`);
        }
    }

    // Create the application
    const { data, error } = await supabase
        .from('applications')
        .insert({
            user_id: user.id,
            course_id: courseId,
            status: 'DRAFT'
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating application:', error);
        throw new Error(`Failed to create application: ${error.message} (${error.code})`);
    }
}

export async function updateApplicationStep(id: string, step: string, data: any) {
    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Map step to database column
    const columnMap: Record<string, string> = {
        'personal': 'personal_info',
        'contact': 'contact_details',
        'academic': 'education_history',
        'motivation': 'motivation',
        'language': 'language_proficiency'
    };

    const targetColumn = columnMap[step];
    if (!targetColumn) throw new Error('Invalid step');

    // Update the application
    const { error } = await supabase
        .from('applications')
        .update({
            [targetColumn]: data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error(`Error updating application step ${step}:`, error);
        throw new Error('Failed to save progress');
    }

    // SYNC TO PROCALES TABLE
    // This ensures student list and other admin features have up-to-date names/info
    try {
        if (step === 'personal') {
            await supabase
                .from('profiles')
                .update({
                    first_name: data.firstName,
                    last_name: data.lastName,
                    date_of_birth: data.dateOfBirth
                })
                .eq('id', user.id);
        } else if (step === 'contact') {
            await supabase
                .from('profiles')
                .update({
                    country_of_residence: data.country
                })
                .eq('id', user.id);
        }
    } catch (syncError) {
        console.error('Error syncing to profile:', syncError);
        // Non-blocking for the application flow
    }
    return { success: true };
}

export async function addApplicationDocument(applicationId: string, type: string, url: string, name: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('application_documents')
        .insert({
            application_id: applicationId,
            type,
            url,
            name
        });

    if (error) {
        console.error('Error adding document meta:', error);
        throw new Error('Failed to save document info');
    }
    return { success: true };
}

export async function deleteApplicationDocument(applicationId: string, documentId: string, storagePath: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from('application-documents')
        .remove([storagePath]);

    if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue to DB delete anyway if storage fails (might be already gone)
    }

    // 2. Delete from DB
    const { error } = await supabase
        .from('application_documents')
        .delete()
        .eq('id', documentId)
        .eq('application_id', applicationId);

    if (error) {
        console.error('Error deleting document meta:', error);
        throw new Error('Failed to delete document info');
    }
    return { success: true };
}

export async function submitApplication(applicationId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Basic validation
    const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !app) throw new Error('Application not found');

    if (!app.personal_info || !app.contact_details || !app.education_history) {
        throw new Error('Please complete all required sections before submitting.');
    }

    // 2. Update status
    const { error } = await supabase
        .from('applications')
        .update({
            status: 'SUBMITTED',
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error submitting application:', error);
        throw new Error('Failed to submit application');
    }

    // 3. Trigger Notification via Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                applicationId: applicationId,
                type: 'APPLICATION_SUBMITTED'
            }
        });
    } catch (notifyError) {
        console.error('Failed to trigger submission notification:', notifyError);
        // Non-blocking
    }

    return { success: true };
}

export async function updateApplicationStatus(applicationId: string, status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ADMITTED' | 'OFFER_ACCEPTED' | 'PAYMENT_SUBMITTED' | 'ENROLLED' | 'DRAFT') {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('applications')
        .update({
            status: status,
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating application status:', error);
        throw new Error('Failed to update application status');
    }

    return { success: true };
}

export async function getAdmissionLetterData(applicationId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If we have a user session, we use it for preliminary checks
    const targetUserId = user?.id;

    // Use Admin Client to bypass RLS and fetch full aggregated data
    const adminSupabase = createServiceRoleClient();

    try {
        const { data: applicationRaw, error: appError } = await adminSupabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !applicationRaw) {
            throw new Error('Application not found');
        }

        // Security check: if user session exists, ensure it matches. 
        if (targetUserId && applicationRaw.user_id !== targetUserId) {
            throw new Error('Unauthorized access to application');
        }

        const offer = Array.isArray(applicationRaw.offer) ? applicationRaw.offer[0] : applicationRaw.offer;

        if (!offer) {
            return { success: false, error: 'Offer not found' };
        }

        return {
            success: true,
            data: {
                application: applicationRaw,
                offer: offer
            }
        };
    } catch (e: any) {
        console.error('Error in getAdmissionLetterData:', e);
        return { success: false, error: e.message };
    }
}

export async function getPortalDashboardData() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const adminSupabase = createServiceRoleClient();

    try {
        const [profileRes, appsRes, studentRes] = await Promise.all([
            adminSupabase.from('profiles').select('*').eq('id', user.id).single(),
            adminSupabase.from('applications')
                .select('*, course:Course(title, duration), offer:admission_offers(*)')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false }),
            adminSupabase.from('students')
                .select('*, program:Course(*), user:profiles(*)')
                .eq('user_id', user.id)
                .maybeSingle()
        ]);

        return {
            success: true,
            data: {
                profile: profileRes.data,
                applications: appsRes.data || [],
                student: studentRes.data
            }
        };
    } catch (e: any) {
        console.error('Error fetching portal dashboard data:', e);
        return { success: false, error: e.message };
    }
}

export async function getPortalApplicationDetail(applicationId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const adminSupabase = createServiceRoleClient();

    try {
        const { data: applicationRaw, error: appError } = await adminSupabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(email),
                documents:application_documents(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !applicationRaw) throw new Error('Application not found');

        // Security check
        if (applicationRaw.user_id !== user.id) throw new Error('Unauthorized access');

        return {
            success: true,
            data: applicationRaw
        };
    } catch (e: any) {
        console.error('Error fetching application detail:', e);
        return { success: false, error: e.message };
    }
}

export async function getStudentPortalData() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const adminSupabase = createServiceRoleClient();

    try {
        const { data: studentData, error } = await adminSupabase
            .from('students')
            .select(`
                *,
                program:Course(*),
                user:profiles(*),
                application:applications(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !studentData) throw new Error('Student record not found');

        return {
            success: true,
            data: studentData
        };
    } catch (e: any) {
        console.error('Error fetching student portal data:', e);
        return { success: false, error: e.message };
    }
}

export async function getAllCourses() {
    const adminSupabase = createServiceRoleClient();
    try {
        const { data, error } = await adminSupabase
            .from('Course')
            .select(`
                *,
                school:School(name, slug)
            `)
            .order('title');

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (e: any) {
        console.error('Error fetching courses:', e);
        return { success: false, error: e.message };
    }
}

export async function acceptOffer(applicationId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Verify Application
    const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('id, status, user_id')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !app) throw new Error('Application not found');

    if (app.status !== 'ADMITTED') {
        throw new Error(`Cannot accept offer in current status: ${app.status}`);
    }

    const adminSupabase = createServiceRoleClient();

    // 2. Try to update existing offer, or create one if missing
    const { error: offerError, count: offerCount } = await adminSupabase
        .from('admission_offers')
        .update({
            status: 'ACCEPTED',
            accepted_at: new Date().toISOString()
        })
        .eq('application_id', applicationId)
        .select('id');

    if (offerError) {
        console.error('Failed to update offer status:', offerError);
    }

    // If no offer was updated, create one
    if (!offerCount || offerCount === 0) {
        const { data: appData } = await adminSupabase
            .from('applications')
            .select('course_id, personal_info, Course:course_id(degreeLevel, school:schoolId(slug))')
            .eq('id', applicationId)
            .single();

        const courseData = (appData as any)?.Course;
        const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
        const schoolSlug = courseData?.school?.slug || 'technology';

        const { getTuitionFee, mapSchoolToTuitionField, getProgramYears } = await import('@/utils/tuition');
        const tuitionField = mapSchoolToTuitionField(schoolSlug);
        const personal = (appData as any)?.personal_info || {};
        const studentType = personal.studentType;
        const isDomestic = studentType === 'domestic';
        const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);

        const duration = (appData as any)?.Course?.duration || '4 years';
        const years = getProgramYears(duration, degreeLevel as any);
        const totalFee = annualFee * years;

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);

        const { error: createOfferError } = await adminSupabase
            .from('admission_offers')
            .insert({
                application_id: applicationId,
                tuition_fee: totalFee,
                payment_deadline: deadline.toISOString(),
                offer_type: 'FULL_TUITION',
                status: 'ACCEPTED',
                accepted_at: new Date().toISOString()
            });

        if (createOfferError) {
            console.error('Failed to create offer:', createOfferError);
            throw new Error('Failed to create offer');
        }
    }

    // 3. Update Application Status
    const { error: appError } = await adminSupabase
        .from('applications')
        .update({
            status: 'OFFER_ACCEPTED',
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (appError) {
        console.error('Failed to update application status:', appError);
        throw new Error('Failed to update application status');
    }

    // 4. Trigger Notification via Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                applicationId: applicationId,
                type: 'OFFER_ACCEPTED'
            }
        });
    } catch (notifyError) {
        console.error('Failed to trigger offer acceptance notification:', notifyError);
    }

    return { success: true };
}


import PaymentConfirmationEmail from '@/emails/PaymentConfirmationEmail';

export async function rejectOffer(applicationId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Verify Application
    const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('id, status, user_id')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !app) throw new Error('Application not found');

    if (app.status !== 'ADMITTED') {
        throw new Error(`Cannot decline offer in current status: ${app.status}`);
    }

    const adminSupabase = createServiceRoleClient();

    // 2. Try to update existing offer, or create one if missing
    const { error: offerError, count: offerCount } = await adminSupabase
        .from('admission_offers')
        .update({
            status: 'DECLINED',
            accepted_at: new Date().toISOString()
        })
        .eq('application_id', applicationId)
        .select('id');

    if (offerError) {
        console.error('Failed to update offer status:', offerError);
    }

    // If no offer was updated, create one
    if (!offerCount || offerCount === 0) {
        const { data: appData } = await adminSupabase
            .from('applications')
            .select('course_id, personal_info, Course:course_id(degreeLevel, school:schoolId(slug))')
            .eq('id', applicationId)
            .single();

        const courseData = (appData as any)?.Course;
        const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
        const schoolSlug = courseData?.school?.slug || 'technology';

        const { getTuitionFee, mapSchoolToTuitionField, getProgramYears } = await import('@/utils/tuition');
        const tuitionField = mapSchoolToTuitionField(schoolSlug);
        const personal = (appData as any)?.personal_info || {};
        const studentType = personal.studentType;
        const isDomestic = studentType === 'domestic';
        const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);

        const duration = (appData as any)?.Course?.duration || '4 years';
        const years = getProgramYears(duration, degreeLevel as any);
        const totalFee = annualFee * years;

        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);

        const { error: createOfferError } = await adminSupabase
            .from('admission_offers')
            .insert({
                application_id: applicationId,
                tuition_fee: totalFee,
                payment_deadline: deadline.toISOString(),
                offer_type: 'FULL_TUITION',
                status: 'DECLINED',
                accepted_at: new Date().toISOString()
            });

        if (createOfferError) {
            console.error('Failed to create offer:', createOfferError);
            throw new Error('Failed to create offer');
        }
    }

    // 3. Update Application Status
    const { error: appError } = await adminSupabase
        .from('applications')
        .update({
            status: 'OFFER_DECLINED',
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (appError) {
        console.error('Failed to update application status:', appError);
        throw new Error('Failed to update application status');
    }

    // 4. Send Notification via Supabase Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                applicationId: applicationId,
                type: 'APPLICATION_REJECTED'
            }
        });
    } catch (emailError) {
        console.error('Failed to trigger rejection notification via edge function:', emailError);
    }

    return { success: true };
}

export async function processTuitionPayment(
    offerId: string,
    applicationId: string,
    amount: number,
    method: string = 'SIMULATED_CREDIT_CARD',
    country?: string,
    currency?: string,
    fxMetadata: any = {}
) {
    const supabase = await createServerClient();
    const adminSupabase = createServiceRoleClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // 1. Verify Offer exists and belongs to user (via application)
    const { data: offer, error: fetchError } = await supabase
        .from('admission_offers')
        .select(`
            *, 
            application:applications(
                user_id, 
                status,
                course:Course(title)
            )
        `)
        .eq('id', offerId)
        .single();

    if (fetchError || !offer) throw new Error('Offer not found');

    const app = offer.application as any;
    if (app.user_id !== user.id) throw new Error('Unauthorized access to this offer');

    if (app.status !== 'OFFER_ACCEPTED' && app.status !== 'ADMITTED') {
        if (app.status === 'ENROLLED') throw new Error('Tuition already paid and enrolled.');
    }

    // 2. Create Payment Record
    const reference = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { error: paymentError } = await adminSupabase
        .from('tuition_payments')
        .insert({
            offer_id: offerId,
            amount: amount,
            status: 'COMPLETED',
            payment_method: method,
            transaction_reference: reference,
            country,
            currency,
            fx_metadata: fxMetadata
        });

    if (paymentError) {
        console.error('Payment record error:', paymentError);
        throw new Error(`Failed to record payment: ${paymentError.message}`);
    }

    // 3. Update Application to PAYMENT_SUBMITTED and Offer to ACCEPTED if pending
    const { error: appError } = await adminSupabase
        .from('applications')
        .update({ status: 'PAYMENT_SUBMITTED', updated_at: new Date().toISOString() })
        .eq('id', applicationId);

    if (appError) throw new Error('Failed to finalize enrollment status');

    if (offer.status === 'PENDING') {
        const { error: offerError } = await adminSupabase
            .from('admission_offers')
            .update({ status: 'ACCEPTED' })
            .eq('id', offerId);

        if (offerError) {
            console.error('Failed to update offer status:', offerError);
        }
    }

    // 4. AUTO-TRIGGER ADMISSION LETTER & ENROLLMENT (DISABLED FOR MANUAL ADMIN REVIEW)
    // The flow now stops at PAYMENT_SUBMITTED. An admin must manually approve via the dashboard
    // which triggers the 'enrollStudent' action to finalize status to ENROLLED and generate the letter.
    /*
    try {
        const { generateAndStoreAdmissionLetter } = await import('@/app/admin/admissions/pdf-actions');
        await generateAndStoreAdmissionLetter(applicationId);

        // Also update status to ENROLLED if not already
        await adminSupabase
            .from('applications')
            .update({ status: 'ENROLLED', updated_at: new Date().toISOString() })
            .eq('id', applicationId);

    } catch (pdfError) {
        console.error('Failed to auto-generate admission letter after payment:', pdfError);
        // We still consider the payment successful
    }
    */

    // 4. Audit Log for Compliance
    await adminSupabase.from('audit_logs').insert({
        action: 'PAYMENT_CONCARMED',
        entity_table: 'tuition_payments',
        actor_id: user.id,
        metadata: {
            country,
            currency,
            method,
            reference
        }
    });

    // 5. Send Payment Confirmation Email via Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                applicationId: applicationId,
                type: 'PAYMENT_RECEIVED',
                additionalData: {
                    amount: amount,
                    currency: currency || 'CAD',
                    reference: reference,
                    paymentType: 'TUITION'
                }
            }
        });
    } catch (emailError) {
        console.error('Failed to trigger payment notification:', emailError);
    }

    return { success: true, reference };
}

export async function regenerateLOA(applicationId: string) {
    const supabase = createServiceRoleClient();

    const { data: application, error } = await supabase
        .from('applications')
        .select(`
            *,
            course:Course(*, school:School(*)),
            user:profiles(*),
            offer:admission_offers(*)
        `)
        .eq('id', applicationId)
        .single();

    if (error || !application) {
        return { success: false, error: 'Application not found' };
    }

    const { generateAndStoreLOA } = await import('@/utils/loa-pdf-generator');
    const result = await generateAndStoreLOA(applicationId, application);
    return result;
}

export async function deleteApplication(applicationId: string) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll().map(c => c.name);
    console.log('[deleteApplication] Available Cookies:', allCookies);

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    console.log('[deleteApplication] User check:', user?.id);

    if (!user) {
        console.error('[deleteApplication] Unauthorized: No user found in session');
        throw new Error('Unauthorized');
    }

    // 1. Verify ownership and status
    const { data: app, error: fetchError } = await supabase
        .from('applications')
        .select('id, user_id, status')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !app) throw new Error('Application not found');

    if (app.status === 'ENROLLED') {
        throw new Error('Enrolled applications cannot be deleted. Please contact the registrar.');
    }

    // 2. Delete the application (triggers/cascades should handle related documents/offers)
    // Use Admin Client to bypass RLS "No DELETE policy" restriction
    const adminSupabase = await createServiceRoleClient();
    const { error } = await adminSupabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

    if (error) {
        console.error('Error deleting application:', error);
        throw new Error('Failed to delete application');
    }
    return { success: true };
}
