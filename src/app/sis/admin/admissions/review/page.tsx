'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, UserIcon as User, Mail01Icon as Mail, SmartPhone01Icon as Phone, MapPinIcon as MapPin, Calendar01Icon as Calendar, GraduationCapIcon as GraduationCap, Shield01Icon as Shield, Alert01Icon as AlertTriangle, CheckIcon as CheckCircle, CancelCircleIcon as XCircle, ChevronRightIcon as ArrowRight, Edit01Icon as Edit, Download01Icon as Download, PrinterIcon as Printer, Message01Icon as Message, ClockIcon as Clock } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getAdmissionApplicationDetail, updateApplicationStatus, updateInternalNotes, createAdmissionOffer, regenerateOfferLetter, generateAdmissionLetterAction, issuePal, sendMessage } from '@/app/admin/admissions/actions';

interface ApplicationDetail {
  id: string;
  application_number: string;
  status: string;
  submitted_at: string;
  intake?: string;
  course?: { title: string; slug: string; degreeLevel?: string };
  user?: { first_name: string; last_name: string; email: string; phone: string; date_of_birth: string; address: string };
  personal_info?: { firstName: string; lastName: string; passportNumber?: string; nationality?: string };
  contact_details?: { email: string; phone: string; addressLine1?: string; city?: string; country?: string };
  education_history?: any;
  motivation?: any;
  documents?: { id: string; type: string; name: string; url: string; created_at: string }[];
}

const formatDegreeLevel = (level: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
};

const tabs = [
  { label: 'Overview', href: '/sis/admin/admissions/1' },
  { label: 'Application', href: '/sis/admin/admissions/1/application' },
  { label: 'Documents', href: '/sis/admin/admissions/1/documents' },
  { label: 'Review', href: '/sis/admin/admissions/1/review' },
  { label: 'Notes', href: '/sis/admin/admissions/1/notes' },
  { label: 'Audit', href: '/sis/admin/admissions/1/audit' },
];

export default function AdmissionsReviewPage() {
  const params = useParams() as { id: string };
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdmissionApplicationDetail(id);
        if (!result.success) throw new Error(result.error);
        const app = (result.data as any)?.application as ApplicationDetail;
        setApplication(app);
        setNotes((app as any)?.internal_notes || '');
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to load application' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitDecision = async () => {
    if (!decision) return;
    setSubmitting(true);
    setMessage(null);
    try {
      let result;
      if (decision === 'APPROVED') {
        result = await updateApplicationStatus(id, 'ADMITTED');
      } else if (decision === 'REJECTED') {
        result = await updateApplicationStatus(id, 'REJECTED');
      } else if (decision === 'DOCS_REQUIRED') {
        result = await updateApplicationStatus(id, 'DOCS_REQUIRED');
      } else if (decision === 'OFFER_ISSUED') {
        result = await createAdmissionOffer(id, 0, new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());
      }
      if ((result as any).success) {
        setMessage({ type: 'success', text: `Decision submitted: ${decision.replace('_', ' ')}` });
      } else {
        setMessage({ type: 'error', text: (result as any).error || 'Failed to submit decision' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit decision' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review"
        subtitle={application ? `${application.application_number} â€” ${application.course?.title}${application.course?.degreeLevel ? ` â€” ${formatDegreeLevel(application.course.degreeLevel)}` : ''}` : 'Loading...'}
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Printer} size={14} strokeWidth={2.5} /> Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
              <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} /> Export
            </button>
          </div>
        }
      />

      <Tabs tabs={tabs} />

      {message && (
        <div className={`p-4 rounded ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : application ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Application Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application ID</dt><dd className="font-mono font-medium text-neutral-900 mt-1">{application.application_number}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</dt><dd className="mt-1"><StatusBadge status={application.status?.replace('_', ' ') || 'DRAFT'} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Program</dt><dd className="font-medium text-neutral-900 mt-1">{application.course?.title}{application.course?.degreeLevel ? ` â€” ${formatDegreeLevel(application.course.degreeLevel)}` : ''}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intake</dt><dd className="font-medium text-neutral-900 mt-1">{application.intake || 'â€”'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitted</dt><dd className="font-medium text-neutral-900 mt-1">{application.submitted_at ? new Date(application.submitted_at).toLocaleDateString('en-CA') : 'â€”'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Officer</dt><dd className="font-medium text-neutral-900 mt-1">Admissions Team</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Applicant</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</dt><dd className="font-medium text-neutral-900 mt-1">{application.user?.first_name} {application.user?.last_name}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{application.user?.email}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</dt><dd className="font-medium text-neutral-900 mt-1">{application.user?.phone}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</dt><dd className="font-medium text-neutral-900 mt-1">{application.user?.date_of_birth}</dd></div>
              <div className="col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{application.user?.address}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Academic History</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High School</dt><dd className="font-medium text-neutral-900 mt-1">{application.education_history?.highSchool}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation Year</dt><dd className="font-medium text-neutral-900 mt-1">{application.education_history?.graduationYear}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPA</dt><dd className="font-medium text-neutral-900 mt-1">{application.education_history?.gpa}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Uploaded Documents</h3>
            <div className="space-y-2">
              {application.documents?.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-slate-400" />
                    <span className="text-xs font-medium text-neutral-900">{doc.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{doc.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">View</button>
                    <button className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-neutral-600">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Review Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add review notes..."
              className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans h-24 resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Decision</h3>
            <div className="space-y-3">
              <button onClick={() => setDecision('APPROVED')} className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${decision === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-neutral-700 hover:bg-neutral-50 border border-neutral-200'}`}>
                <HugeiconsIcon icon={CheckCircle} size={14} strokeWidth={2} /> Approve
              </button>
              <button onClick={() => setDecision('REJECTED')} className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${decision === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : 'text-neutral-700 hover:bg-neutral-50 border border-neutral-200'}`}>
                <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Reject
              </button>
              <button onClick={() => setDecision('DOCS_REQUIRED')} className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${decision === 'DOCS_REQUIRED' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'text-neutral-700 hover:bg-neutral-50 border border-neutral-200'}`}>
                <HugeiconsIcon icon={AlertTriangle} size={14} strokeWidth={2} /> Request More Info
              </button>
              <button onClick={() => setDecision('OFFER_ISSUED')} className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${decision === 'OFFER_ISSUED' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-neutral-700 hover:bg-neutral-50 border border-neutral-200'}`}>
                <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2} /> Issue Offer
              </button>
            </div>
            {decision && (
              <button onClick={handleSubmitDecision} disabled={submitting} className="w-full mt-3 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Decision'}
              </button>
            )}
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Document Status</h3>
            <div className="space-y-2">
              {application.documents?.map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-900">{doc.type}</span>
                  <StatusBadge status="Verified" size="sm" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={Message} size={14} strokeWidth={2} /> Send Message</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={FileText} size={14} strokeWidth={2} /> View Transcript</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={Shield} size={14} strokeWidth={2} /> Financial Account</button>
              <button className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-colors"><HugeiconsIcon icon={Edit} size={14} strokeWidth={2} /> Edit Record</button>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="p-8 text-center text-neutral-500">Application not found</div>
      )}
    </div>
  );
}
