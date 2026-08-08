export function getDocumentUrl(doc: { document_type?: string; storage_path?: string | null; metadata?: Record<string, any> }): string {
    if (doc.document_type === 'tuition_receipt' && doc.metadata?.payment_id) {
        return `/api/portal/receipt/pdf?paymentId=${doc.metadata.payment_id}`;
    }
    return doc.storage_path || '#';
}
