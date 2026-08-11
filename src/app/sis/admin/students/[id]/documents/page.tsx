'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, Download01Icon as Download, EyeIcon as Eye, Upload01Icon as Upload, Trash as Trash } from '@hugeicons/core-free-icons';
import { getDocumentUrl } from '@/utils/document';
import { uploadStudentDocument } from '@/app/sis/admin/actions';

interface DocumentRecord {
  id: string;
  document_type: string;
  title: string;
  status: string;
  storage_path: string | null;
  issue_date: string | null;
  created_at: string;
}

const documentTypeLabels: Record<string, string> = {
  pal: 'Provincial Attestation Letter (PAL)',
  loa: 'Letter of Acceptance (LOA)',
  tuition_invoice: 'Tuition Invoice',
  tuition_receipt: 'Tuition Receipt',
  enrollment_confirmation: 'Letter of Acceptance (LOA)',
  transcript: 'Transcript',
  application_document: 'Application Document',
  other: 'Document',
};

export default function StudentDocumentsPage() {
  const params = useParams() as { id: string };
  const studentId = params.id as string;
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/sis/admin/students/${studentId}/documents`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load documents');
      setDocuments(data.documents || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [studentId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const documentType = file.name.toLowerCase().includes('pal') ? 'pal' : 'other';
    const title = file.name;

    const result = await uploadStudentDocument(studentId, file, documentType, title);

    if (result.success) {
      setMessage({ type: 'success', text: 'Document uploaded successfully' });
      await fetchDocuments();
    } else {
      setMessage({ type: 'error', text: result.error || 'Upload failed' });
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const res = await fetch(`/api/sis/admin/students/${studentId}/documents`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: docId }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: 'success', text: 'Document deleted' });
      await fetchDocuments();
    } else {
      setMessage({ type: 'error', text: data.error || 'Delete failed' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Student documents" />

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className={`p-4 border text-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-neutral-200">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Official Documents</h3>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition cursor-pointer">
            <HugeiconsIcon icon={Upload} size={14} strokeWidth={2} />
            {uploading ? 'Uploading...' : 'Upload Document'}
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">No documents found</div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{documentTypeLabels[doc.document_type] || doc.title}</p>
                    <p className="text-xs text-neutral-500">
                      {doc.issue_date ? `Issued: ${new Date(doc.issue_date).toLocaleDateString('en-CA')}` : `Uploaded: ${new Date(doc.created_at).toLocaleDateString('en-CA')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  {getDocumentUrl(doc) !== '#' && (
                    <>
                      <a href={getDocumentUrl(doc)} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-neutral-600 transition-colors" title="View">
                        <HugeiconsIcon icon={Eye} size={14} strokeWidth={2} />
                      </a>
                      <a href={getDocumentUrl(doc)} download className="p-1.5 text-slate-400 hover:text-neutral-600 transition-colors" title="Download">
                        <HugeiconsIcon icon={Download} size={14} strokeWidth={2} />
                      </a>
                    </>
                  )}
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                    <HugeiconsIcon icon={Trash} size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
