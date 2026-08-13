'use client';

import { useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { addApplicationDocument, deleteApplicationDocument, updateApplicationStep } from '@/app/portal/actions';
import { ApplicationDocument, DocumentType } from '@/types/database';
import { CaretRight as ChevronRight, CircleNotch as Loader2, UploadSimple as Upload, Trash, FileText, CheckCircle, WarningCircle as AlertCircle } from "@phosphor-icons/react";

interface Props {
    applicationId: string;
    existingDocuments: ApplicationDocument[];
    requestedDocuments?: string[];
    documentRequestNote?: string | null;
    onUpdate?: () => Promise<void>;
}

const DOCUMENT_TYPES: { type: DocumentType; label: string; description: string; required: boolean }[] = [
    { type: 'PASSPORT', label: 'Passport', description: 'Copy of your valid passport.', required: true },
    { type: 'TRANSCRIPT', label: 'Academic Transcript', description: 'Official transcript from your previous institution.', required: true },
    { type: 'CERTIFICATE', label: 'Degree Certificate', description: 'Copy of your degree certificate or diploma.', required: true },
    { type: 'CV', label: 'Curriculum Vitae (CV)', description: 'Updated CV detailing your experience and education.', required: true },
    { type: 'MOTIVATION_LETTER', label: 'Motivation Letter / Statement of Purpose', description: 'A brief letter explaining why you chose this programme.', required: true },
    { type: 'LANGUAGE_CERT', label: 'English Proficiency', description: 'IELTS/TOEFL or equivalent.', required: true },
];

export default function DocumentsForm({ applicationId, existingDocuments, requestedDocuments, documentRequestNote, onUpdate }: Props) {
    const [uploading, setUploading] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const requiredTypes = DOCUMENT_TYPES.filter(d => d.required).map(d => d.type);
    const uploadedTypes = existingDocuments.map(d => d.type);
    const allRequiredUploaded = requiredTypes.every(type => uploadedTypes.includes(type));

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Max 5MB.');
            return;
        }

        setUploading(type);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${applicationId}/${type}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('application-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Use public URL since we made it easier, in production we might use signed URLs
            const { data: { publicUrl } } = supabase.storage
                .from('application-documents')
                .getPublicUrl(filePath);

            await addApplicationDocument(applicationId, type, publicUrl, file.name);

            if (onUpdate) await onUpdate();
            // Trigger parent refresh to update progress
            router.refresh();
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error?.message || 'Please try again.'}`);
        } finally {
            setUploading(null);
        }
    };

    const handleDelete = async (docId: string, url: string) => {
        setDeleting(docId);
        try {
            // Extract storage path from public URL
            const path = url.split('application-documents/').pop();
            if (!path) throw new Error('Invalid file URL');

            await deleteApplicationDocument(applicationId, docId, path);
            if (onUpdate) await onUpdate();
            router.refresh();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            {documentRequestNote && (
                <div className="bg-neutral-50 border-2 border-neutral-200 p-6 rounded-sm flex items-start gap-4 shadow-sm">
                    <div className="bg-neutral-600 p-2.5 rounded-sm text-white shrink-0 shadow-lg">
                        <AlertCircle size={22} weight="bold" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-neutral-900 font-black text-[11px] leading-none mb-2">Message from Admissions Office</h4>
                        <p className="text-neutral-800 text-[13px] font-bold leading-relaxed block bg-white/50 p-3 rounded-sm border border-neutral-100">
                            "{documentRequestNote}"
                        </p>
                    </div>
                </div>
            )}

            {requestedDocuments && requestedDocuments.length > 0 && (
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-sm flex items-start gap-4">
                    <div className="bg-neutral-900 p-2 rounded-sm text-white shrink-0">
                        <FileText size={20} weight="bold" />
                    </div>
                    <div>
                        <h4 className="text-neutral-900 font-black text-[13px] leading-none mb-1">Items to be Uploaded</h4>
                        <p className="text-neutral-500 text-[11px] font-bold">The admissions team has specifically flagged the document types highlighted below.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {DOCUMENT_TYPES.map((docType) => {
                    const doc = existingDocuments.find(d => d.type === docType.type);
                    const isUploading = uploading === docType.type;
                    const isRequested = requestedDocuments?.includes(docType.type);

                    return (
                        <div key={docType.type} className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-white gap-4 rounded-sm border transition-all ${isRequested ? 'border-neutral-200 bg-neutral-50/30' : 'border-neutral-100'}`}>
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-[13px] font-semibold text-black flex items-center gap-2">
                                        {docType.label} {docType.required && <span className="text-red-500">*</span>}
                                        {doc && <CheckCircle className="text-black" size={14} weight="bold" />}
                                    </h3>
                                    {isRequested && (
                                        <span className="bg-neutral-600 text-white px-2 py-0.5 rounded-full text-[8px] font-black">Requested</span>
                                    )}
                                </div>
                                <p className="text-[11px] text-black font-medium">{docType.description}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {doc ? (
                                    <div className="flex items-center gap-2 border border-[#0a151a]/20 p-2 px-3 rounded-sm bg-white">
                                        <FileText size={14} weight="regular" className="text-black" />
                                        <span className="text-[13px] font-medium truncate max-w-[120px] text-black">{doc.name}</span>
                                        <button
                                            onClick={() => handleDelete(doc.id, doc.url)}
                                            disabled={!!deleting}
                                            className="text-[#2d2d2d] hover:text-red-500 transition-colors p-1"
                                        >
                                            {deleting === doc.id ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <Trash size={14} weight="regular" />}
                                        </button>
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer border ${isRequested ? 'border-neutral-600 text-neutral-600 bg-white' : 'border-[#0a151a] text-black bg-white'} px-4 py-2 rounded-sm text-[13px] font-semibold flex items-center gap-2 hover:bg-neutral-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {isUploading ? <Loader2 className="animate-spin" size={14} weight="bold" /> : <Upload size={14} weight="bold" />}
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, docType.type)}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!allRequiredUploaded && (
                <div className="border border-amber-200 rounded-sm p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-500 shrink-0" size={16} weight="bold" />
                    <div>
                        <p className="text-[13px] font-semibold text-amber-900 leading-none">Requirements missing</p>
                        <p className="text-[13px] text-amber-700/80 font-medium mt-1 leading-tight">Please upload all mandatory documents marked with * to proceed.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-6 order-2 md:order-1">
                    <Link
                        href={`?id=${applicationId}&step=5`}
                        className="text-black hover:text-black font-bold text-[11px] transition-colors flex items-center gap-2 group"
                    >
                        <ChevronRight size={14} weight="bold" className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.push('/portal/dashboard')}
                        className="text-black hover:text-primary font-bold text-[11px] transition-colors flex items-center gap-2"
                    >
                        Save & Exit
                    </button>
                </div>

                <div className="ml-auto order-1 md:order-2">
                    <button
                        onClick={async () => {
                            setIsSaving(true);
                            router.push(`?id=${applicationId}&step=7`);
                            setIsSaving(false);
                        }}
                        disabled={!allRequiredUploaded || isSaving}
                        className="flex items-center justify-center gap-3 bg-[#0a151a] text-white px-8 py-5 rounded-sm text-[13px] font-black hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg shadow-neutral-100/50 min-w-[200px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" size={18} weight="bold" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Continue to Review
                                <ChevronRight size={18} weight="bold" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}

