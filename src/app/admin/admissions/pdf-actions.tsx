'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { generateAndStoreLOA } from '@/utils/loa-pdf-generator';

export async function generateAndStoreOfferLetter(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            throw new Error('Application not found');
        }

        const result = await generateAndStoreLOA(applicationId, application);

        if (!result.success) {
            throw new Error(result.error || 'Failed to generate LOA');
        }

        const { data: offerRecord } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (offerRecord) {
            await supabase
                .from('admission_offers')
                .update({ document_url: result.url })
                .eq('id', offerRecord.id);
        }

        return { success: true, url: result.url };
    } catch (e: any) {
        console.error('Error generating offer letter:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreAdmissionLetter(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            throw new Error('Application not found');
        }

        const result = await generateAndStoreLOA(applicationId, application);

        if (!result.success) {
            throw new Error(result.error || 'Failed to generate LOA');
        }

        const { data: offerRecord } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (offerRecord) {
            await supabase
                .from('admission_offers')
                .update({ document_url: result.url })
                .eq('id', offerRecord.id);
        }

        return { success: true, url: result.url };
    } catch (e: any) {
        console.error('Error generating admission letter:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreReceipt(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const receiptUrl = `https://cannogacollege.ca/portal/application/receipt?id=${applicationId}`;

        return { success: true, url: receiptUrl };
    } catch (e: any) {
        console.error('Error generating receipt link:', e);
        return { success: false, error: e.message };
    }
}
