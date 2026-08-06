'use server';

import { createClient } from '@/utils/supabase/client';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { ApplicationStatus } from '@/types/database';

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

    // Email Notification for Document Request is now handled by database 
    // triggers on 'applications' status changes.

    // TRIGGER LOGIC: Automatically create admission offer + generate Letter of Offer on approval
    if (status === 'ADMITTED') {
        try {
            // Auto-create admission_offers record if one doesn't exist yet
            const { data: existingOffer } = await supabase
                .from('admission_offers')
                .select('id')
                .eq('application_id', applicationId)
                .maybeSingle();

            if (!existingOffer) {
                // Fetch application with course + school to compute real tuition
                const { data: appData } = await supabase
                    .from('applications')
                    .select('course_id, personal_info, Course:course_id(degreeLevel, school:schoolId(slug))')
                    .eq('id', applicationId)
                    .single();

                const courseData = (appData as any)?.Course;
                const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
                const schoolSlug = courseData?.school?.slug || 'technology';

                // Use tuition.ts computation (source of truth)
                const { getTuitionFee, mapSchoolToTuitionField, getProgramYears } = await import('@/utils/tuition');
                const tuitionField = mapSchoolToTuitionField(schoolSlug);
                const personal = (appData as any)?.personal_info || {};
                const studentType = personal.studentType;
                const isDomestic = studentType === 'domestic';
                const annualFee = getTuitionFee(degreeLevel, tuitionField, isDomestic);
                
                const duration = (appData as any)?.Course?.duration || '4 years';
                const years = getProgramYears(duration, degreeLevel as any);
                const totalFee = annualFee * years;

                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 30); // 30 day deadline

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

            // Send admission email notification
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


    // NOTE: Admission Letter generation for ENROLLED status has been moved
    // to the payment action (src/app/portal/application/payment/actions.ts).
    // It is auto-triggered only after confirmed payment.



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

    // 1. Get current application status
    const { data: application } = await supabase
        .from('applications')
        .select('status')
        .eq('id', applicationId)
        .single();

    // 2. Upsert the offer (handle re-issuing)
    const { error: offerError } = await supabase
        .from('admission_offers')
        .upsert({
            application_id: applicationId,
            tuition_fee: tuitionFee,
            payment_deadline: deadline,
            offer_type: offerType,
            status: 'PENDING'
        }, { onConflict: 'application_id' });

    if (offerError) {
        console.error('Error creating/updating offer:', offerError);
        throw new Error('Failed to create offer');
    }

    // 3. Status Transition Logic
    // If the application is in a state before ADMITTED, move it to ADMITTED
    // so the student sees the "Accept Offer" button in their dashboard.
    const statusesToAdvance = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REJECTED', 'DOCS_REQUIRED', 'OFFER_ACCEPTED', 'PAYMENT_SUBMITTED'];
    if (application && statusesToAdvance.includes(application.status)) {
        const { error: statusError } = await supabase
            .from('applications')
            .update({
                status: 'ADMITTED',
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (statusError) {
            console.error('Failed to auto-advance status to ADMITTED:', statusError);
        }
    }

    // 4. Trigger PDF Generation & Email
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
