'use server';

import { createClient } from '@/utils/supabase/client';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { generateAndStoreLOA } from '@/utils/loa-pdf-generator';

export async function respondToOffer(admissionId: string, decision: 'ACCEPTED' | 'REJECTED') {
    const supabase = createClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. Fetch the admission record to verify ownership and current status
    const { data: admission, error: fetchError } = await supabase
        .from('admissions')
        .select('*')
        .eq('id', admissionId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !admission) throw new Error('Offer not found');

    // 3. Prevent multiple responses
    if (admission.offer_status !== 'PENDING') {
        throw new Error('You have already submitted a response to this offer.');
    }

    // 4. Update the record
    const updateData: any = {
        offer_status: decision
    };

    if (decision === 'ACCEPTED') {
        updateData.accepted_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
        .from('admissions')
        .update(updateData)
        .eq('id', admissionId);

    if (updateError) {
        console.error('Error updating offer response:', updateError);
        throw new Error(`Failed to save your decision: ${updateError.message}`);
    }

    // 5. Trigger next steps / notifications
    if (decision === 'ACCEPTED') {
        await supabase
            .from('applications')
            .update({ status: 'OFFER_ACCEPTED' })
            .eq('user_id', user.id)
            .eq('status', 'ADMITTED');

        try {
            const { data: acceptedApp } = await supabase
                .from('applications')
                .select(`
                    *,
                    course:Course(*, school:School(*)),
                    user:profiles(*),
                    offer:admission_offers(*)
                `)
                .eq('user_id', user.id)
                .eq('status', 'OFFER_ACCEPTED')
                .single();

            if (acceptedApp) {
                await generateAndStoreLOA(acceptedApp.id, acceptedApp);
            }
        } catch (loaError) {
            console.error('Failed to generate LOA on offer response:', loaError);
        }
    } else {
        await supabase
            .from('applications')
            .update({ status: 'OFFER_DECLINED' })
            .eq('user_id', user.id)
            .eq('status', 'ADMITTED');
    }

    return { success: true };
}

export async function acceptApplicationOffer(applicationId: string, userId?: string) {
    const client = createClient();
    const supabase = createServiceRoleClient();

    // If userId not provided, try to get from session
    let currentUserId = userId;
    if (!currentUserId) {
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw new Error('Unauthorized');
        currentUserId = user.id;
    }

    // 2. Verify Application Ownership
    const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('id, user_id, status')
        .eq('id', applicationId)
        .eq('user_id', currentUserId)
        .single();

    if (fetchError || !application) throw new Error('Application not found');

    if (application.status !== 'ADMITTED') {
        if (application.status === 'OFFER_ACCEPTED' || application.status === 'ENROLLED' || application.status === 'DOCS_REQUIRED') {
            return { success: true };
        }
        throw new Error('This application is not in a state to accept an offer.');
    }

    // 3. Update Admission Offer Status
    const { error: offerError, count: offerCount } = await supabase
        .from('admission_offers')
        .update({
            status: 'ACCEPTED',
            accepted_at: new Date().toISOString()
        })
        .eq('application_id', applicationId)
        .select('id');

    if (offerError) {
        console.error('Failed to update offer status:', offerError);
        throw new Error('Failed to update offer status');
    }

    // If no offer was updated, create one
    if (!offerCount || offerCount === 0) {
        const { data: appData } = await supabase
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
        deadline.setDate(deadline.getDate() + 14);

        const { error: createOfferError } = await supabase
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

    // 4. Update Application Status to OFFER_ACCEPTED
    const { error: appError } = await supabase
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

    // Generate and store LOA PDF in document_records
    try {
        const { data: application, error: appFetchError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (!appFetchError && application) {
            await generateAndStoreLOA(applicationId, application);
        }
    } catch (loaError) {
        console.error('Failed to generate LOA on offer acceptance:', loaError);
    }

    // 5. Try updating legacy admissions table
    try {
        const { data: courseData } = await supabase
            .from('applications')
            .select('course(title)')
            .eq('id', applicationId)
            .single();

        const courseTitle = (courseData?.course as any)?.title;

        if (courseTitle) {
            await supabase
                .from('admissions')
                .update({
                    offer_status: 'ACCEPTED',
                    accepted_at: new Date().toISOString()
                })
        .eq('user_id', currentUserId)
                .eq('program', courseTitle);
        }
    } catch (err) {
        console.warn('Legacy admission update failed silently', err);
    }

    return { success: true };
}
