'use server';

import { createClient } from '@/utils/supabase/client';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { ApplicationStatus } from '@/types/database';
import { getTuitionFee, mapSchoolToTuitionField, getProgramYears } from '@/utils/tuition';

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus, requestedDocuments: any = null, documentRequestNote: string | null = null) {
    const supabase = createServiceRoleClient();

    const updateData: any = {
        status,
        updated_at: new Date().toISOString()
    };

    if (requestedDocuments) {
        updateData.requested_documents = requestedDocuments;
    }

    if (documentRequestNote !== null) {
        updateData.document_request_note = documentRequestNote;
    }

    const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating application status:', error);
        throw new Error('Failed to update status');
    }

    // TRIGGER LOGIC: Automatically create admission offer + generate Letter of Offer on approval
    if (status === 'ADMITTED') {
        try {
            const { data: existingOffer } = await supabase
                .from('admission_offers')
                .select('id')
                .eq('application_id', applicationId)
                .maybeSingle();

            if (!existingOffer) {
                const { data: appData } = await supabase
                    .from('applications')
                    .select('course_id, personal_info, Course:course_id(degreeLevel, school:schoolId(slug))')
                    .eq('id', applicationId)
                    .single();

                const courseData = (appData as any)?.Course;
                const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
                const schoolSlug = courseData?.school?.slug || 'technology';
                const tuitionField = mapSchoolToTuitionField(schoolSlug);
                const personal = (appData as any)?.personal_info || {};
                const studentType = personal.studentType;
                const isDomestic = studentType === 'domestic';
                const annualFee = getTuitionFee(degreeLevel, tuitionField, isDomestic);
                const duration = (appData as any)?.Course?.duration || '4 years';
                const years = getProgramYears(duration, degreeLevel as any);
                const totalFee = annualFee * years;

                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 30);

                await supabase
                    .from('admission_offers')
                    .insert({
                        application_id: applicationId,
                        tuition_fee: totalFee,
                        payment_deadline: deadline.toISOString(),
                        offer_type: 'FULL_TUITION',
                        status: 'PENDING'
                    });
            }

            const { generateAndStoreOfferLetter } = await import('./pdf-actions');
            await generateAndStoreOfferLetter(applicationId);

            try {
                await supabase.functions.invoke('send-notification', {
                    body: {
                        applicationId: applicationId,
                        type: 'OFFER_LETTER_READY'
                    }
                });
            } catch (notifyError) {
                console.error('Failed to trigger admission notification:', notifyError);
            }
        } catch (pdfError) {
            console.error('Failed to generate automated Letter of Acceptance (LOA):', pdfError);
        }
    }

    if (status === 'REJECTED') {
        try {
            await supabase.functions.invoke('send-notification', {
                body: {
                    applicationId: applicationId,
                    type: 'APPLICATION_REJECTED'
                }
            });
        } catch (notifyError) {
            console.error('Failed to trigger rejection notification:', notifyError);
        }
    }

    return { success: true };
}

export async function deleteApplication(applicationId: string) {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

    if (error) {
        console.error('Error deleting application:', error);
        throw new Error('Failed to delete application');
    }
    return { success: true };
}

export async function updateInternalNotes(applicationId: string, notes: string) {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
        .from('applications')
        .update({
            internal_notes: notes,
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

    if (error) {
        console.error('Error updating internal notes:', error);
        throw new Error('Failed to update notes');
    }
    return { success: true };
}

export async function createAdmissionOffer(applicationId: string, tuitionFee: number, deadline: string, offerType: 'DEPOSIT' | 'FULL_TUITION' | '1ST_YEAR_FULL' = 'DEPOSIT') {
    const supabase = createServiceRoleClient();

    const { error: offerError } = await supabase
        .from('admission_offers')
        .upsert({
            application_id: applicationId,
            tuition_fee: tuitionFee,
            payment_deadline: deadline,
            offer_type: offerType,
            status: 'PENDING',
            updated_at: new Date().toISOString()
        }, { onConflict: 'application_id' });

    if (offerError) {
        console.error('Error creating/updating offer:', offerError);
        throw new Error('Failed to create offer');
    }

    try {
        const { generateAndStoreOfferLetter } = await import('./pdf-actions');
        await generateAndStoreOfferLetter(applicationId);
    } catch (pdfError) {
        console.error('Failed to generate Letter of Acceptance (LOA) after manual creation:', pdfError);
    }

    return { success: true };
}

export async function regenerateOfferLetter(applicationId: string) {
    try {
        const { generateAndStoreOfferLetter } = await import('./pdf-actions');
        const result = (await generateAndStoreOfferLetter(applicationId)) as any;
        if (result && result.error) throw new Error(result.error);
        return { success: true };
    } catch (error: any) {
        console.error('Action Error: regenerateOfferLetter:', error);
        return { success: false, error: error.message || 'Failed to regenerate Letter of Acceptance (LOA)' };
    }
}

export async function generateAdmissionLetterAction(applicationId: string) {
    try {
        const { generateAndStoreAdmissionLetter } = await import('./pdf-actions');
        const result = (await generateAndStoreAdmissionLetter(applicationId)) as any;
        if (result && result.error) throw new Error(result.error);
        return { success: true, url: result?.url };
    } catch (error: any) {
        console.error('Action Error: generateAdmissionLetterAction:', error);
        return { success: false, error: error.message || 'Failed to generate admission letter' };
    }
}

export async function getAdmissionApplicationDetail(applicationId: string): Promise<{ success: boolean; data?: { application: any; student: any }; error?: string }> {
    const supabase = createServiceRoleClient();

    try {
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                documents:application_documents(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            return { success: false, error: 'Application not found' };
        }

        const { data: student } = await supabase
            .from('students')
            .select('*')
            .eq('application_id', applicationId)
            .maybeSingle();

        return { success: true, data: { application, student } };
    } catch (error: any) {
        console.error('Action Error: getAdmissionApplicationDetail:', error);
        return { success: false, error: error.message || 'Failed to load application detail' };
    }
}

export async function issuePal(applicationId: string) {
    const supabase = createServiceRoleClient();

    try {
        const { data: student } = await supabase
            .from('students')
            .select('id, pal_status, pal_required, user_id')
            .eq('application_id', applicationId)
            .maybeSingle();

        if (!student) {
            return { success: false, error: 'Student record not found. Enroll the student first.' };
        }

        const now = new Date().toISOString();
        const { error } = await supabase
            .from('students')
            .update({
                pal_status: 'issued',
                pal_issued_at: now,
                pal_updated_at: now,
            })
            .eq('id', student.id);

        if (error) throw error;

        try {
            await supabase.functions.invoke('send-notification', {
                body: {
                    applicationId: applicationId,
                    type: 'OFFER_LETTER_READY'
                }
            });
        } catch (notifyError) {
            console.error('Failed to trigger PAL notification:', notifyError);
        }

        return { success: true };
    } catch (error: any) {
        console.error('Action Error: issuePal:', error);
        return { success: false, error: error.message || 'Failed to issue PAL' };
    }
}

export async function sendMessage(applicationId: string, message: string) {
    const supabase = createServiceRoleClient();

    try {
        const { data: application } = await supabase
            .from('applications')
            .select('user_id')
            .eq('id', applicationId)
            .single();

        if (!application) {
            return { success: false, error: 'Application not found' };
        }

        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', application.user_id)
            .maybeSingle();

        const recipientId = student?.id || application.user_id;

        const { error } = await supabase
            .from('notifications')
            .insert({
                title: 'Message from Admissions',
                message: message,
                category: 'Admissions',
                priority: 'normal',
                recipient_type: 'individual',
                recipient_ids: [recipientId],
                related_id: applicationId,
                related_type: 'application',
            });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Action Error: sendMessage:', error);
        return { success: false, error: error.message || 'Failed to send message' };
    }
}

export async function updateApplication(applicationId: string, data: Record<string, any>) {
    const supabase = createServiceRoleClient();

    try {
        const { error } = await supabase
            .from('applications')
            .update({
                ...data,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Action Error: updateApplication:', error);
        return { success: false, error: error.message || 'Failed to update record' };
    }
}
