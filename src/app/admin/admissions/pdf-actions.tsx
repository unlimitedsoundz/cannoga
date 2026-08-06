import { createClient } from '@/utils/supabase/client';

export async function generateAndStoreOfferLetter(applicationId: string) {
    const supabase = createClient();
    try {
        const offerLetterUrl = `https://cannogacollege.ca/portal/application/letter?id=${applicationId}`;

        // Find the offer ID first
        const { data: offer } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (!offer) throw new Error('No admission offer found for this application');

        // Update the URL in DB
        const { error } = await supabase
            .from('admission_offers')
            .update({ document_url: offerLetterUrl })
            .eq('id', offer.id);

        if (error) throw error;

        return { success: true, url: offerLetterUrl };
    } catch (e: any) {
        console.error('Error generating offer letter link:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreAdmissionLetter(applicationId: string) {
    const supabase = createClient();
    try {
        // UPDATE: Switch to Dynamic HTML Page (No PDF Storage)
        const admissionLetterUrl = `https://cannogacollege.ca/portal/application/admission-letter?id=${applicationId}`;

        // Find the offer ID first
        const { data: offer } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (!offer) throw new Error('No admission offer found for this application');

        // Update the URL in DB
        const { error } = await supabase
            .from('admission_offers')
            .update({ document_url: admissionLetterUrl })
            .eq('id', offer.id);

        if (error) throw error;

        return { success: true, url: admissionLetterUrl };

    } catch (e: any) {
        console.error('Error generating admission letter link:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreReceipt(applicationId: string) {
    const supabase = createClient();
    try {
        const receiptUrl = `https://cannogacollege.ca/portal/application/receipt?id=${applicationId}`;

        return { success: true, url: receiptUrl };
    } catch (e: any) {
        console.error('Error generating receipt link:', e);
        return { success: false, error: e.message };
    }
}
