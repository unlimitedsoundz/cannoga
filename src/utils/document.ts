export function getDocumentUrl(doc: { document_type?: string; storage_path?: string | null; metadata?: Record<string, any> }): string {
    if (doc.storage_path) {
        return doc.storage_path;
    }

    if (doc.document_type === 'tuition_receipt') {
        const paymentId = doc.metadata?.payment_id;
        if (paymentId && typeof paymentId === 'string' && paymentId !== 'undefined' && paymentId !== 'null') {
            return `/api/portal/receipt/pdf?paymentId=${paymentId}`;
        }
    }

    if (doc.document_type === 'loa') {
        const applicationId = doc.metadata?.application_id;
        if (applicationId) {
            return `/api/portal/letter/pdf?id=${applicationId}`;
        }
        return `/api/portal/letter/pdf`;
    }

    return '#';
}
