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
    return '#';
}
