'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, UserIcon as User, Mail01Icon as Mail, SmartPhone01Icon as Phone, MapPinIcon as MapPin, Calendar01Icon as Calendar, GraduationCapIcon as GraduationCap, Shield01Icon as Shield, Alert01Icon as AlertTriangle, CheckIcon as CheckCircle, CancelCircleIcon as XCircle, ChevronRightIcon as ArrowRight, Edit01Icon as Edit, Download01Icon as Download, PrinterIcon as Printer, Message01Icon as Message, ClockIcon as Clock, FileTypeIcon as DocumentIcon, Upload01Icon as Upload } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { getAdmissionApplicationDetail, updateApplicationStatus, updateInternalNotes, createAdmissionOffer, regenerateOfferLetter, generateAdmissionLetterAction, issuePal, sendMessage, updateApplication } from '@/app/admin/admissions/actions';
import { pushInvoice } from '@/app/admin/finance/actions';
import { toast } from 'sonner';

interface ApplicationDetail {
  id: string;
  application_number?: string;
  status: string;
  submitted_at: string;
  intake?: string;
  personal_info?: any;
  contact_details?: any;
  education_history?: any;
  motivation?: any;
  language_proficiency?: any;
  course?: { title: string; slug: string; degreeLevel?: string; duration?: string; school?: { name: string; slug: string } };
  user?: { first_name: string; last_name: string; email: string; phone_number?: string; phone_code?: string; date_of_birth?: string; address?: string; city?: string; state_province?: string; zipcode?: string; gender?: string; passport_number?: string; citizenship?: string };
  documents?: { id: string; type: string; name: string; url: string; created_at: string }[];
  offer?: { id: string; tuition_fee: number; payment_deadline: string; offer_type: string; status: string; document_url?: string; created_at: string };
}

interface StudentInfo {
  id: string;
  student_id?: string;
  enrollment_status?: string;
  pal_status?: string;
  pal_required?: boolean;
  study_permit_status?: string;
  current_stage?: string;
}

const formatDegreeLevel = (level: string) => {
    if (!level) return '';
    return level.charAt(0) + level.slice(1).toLowerCase();
};

const tabs = [
  { label: 'Application', href: '#' },
  { label: 'Documents', href: '#documents' },
  { label: 'Review', href: '#review' },
  { label: 'Notes', href: '#notes' },
  { label: 'Audit', href: '#audit' },
];

export default function AdmissionApplicationPage() {
  const params = useParams() as { id: string };
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState('TUITION_DEPOSIT');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAdmissionApplicationDetail(id);
        if (!result.success) throw new Error(result.error);
        const app = (result.data as any)?.application as ApplicationDetail;
        const stu = (result.data as any)?.student as StudentInfo;
        setApplication(app);
        setStudent(stu || null);
        setNotes((app as any)?.internal_notes || '');
        setStatus(app?.status || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setActionLoading('status');
    try {
      const result = await updateApplicationStatus(id, newStatus as any);
      if ((result as any).success) {
        setStatus(newStatus);
        setApplication(prev => prev ? { ...prev, status: newStatus } : prev);
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      } else {
        toast.error((result as any).error || 'Failed to update status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    setActionLoading('notes');
    try {
      const result = await updateInternalNotes(id, notes);
      if ((result as any).success) {
        toast.success('Notes saved successfully');
      } else {
        toast.error((result as any).error || 'Failed to save notes');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save notes');
    } finally {
      setActionLoading(null);
    }
  };

  const handleIssueOffer = async () => {
    setActionLoading('offer');
    try {
      const { getTuitionFee, mapSchoolToTuitionField, getProgramYears } = await import('@/utils/tuition');
      const schoolSlug = application?.course?.school?.slug || 'technology';
      const degreeLevel = application?.course?.degreeLevel || 'BACHELOR';
      const tuitionField = mapSchoolToTuitionField(schoolSlug);
      const personal = application?.personal_info || {};
      const studentType = personal.studentType;
      const isDomestic = studentType === 'domestic';
      const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);
      const duration = application?.course?.duration || '4 years';
      const years = getProgramYears(duration, degreeLevel);
      const tuitionFee = annualFee * years;
      const result = await createAdmissionOffer(id, tuitionFee, new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());
      if ((result as any).success) {
        await updateApplicationStatus(id, 'ADMITTED');
        toast.success('Admission offer issued successfully');
        window.location.reload();
      } else {
        toast.error((result as any).error || 'Failed to issue offer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to issue offer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerateLOA = async () => {
    setActionLoading('loa');
    try {
      const result = await regenerateOfferLetter(id);
      if ((result as any).success) {
        toast.success('Letter of Acceptance regenerated');
      } else {
        toast.error((result as any).error || 'Failed to regenerate LOA');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to regenerate LOA');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateAdmissionLetter = async () => {
    setActionLoading('admission-letter');
    try {
      const result = await generateAdmissionLetterAction(id);
      if ((result as any).success) {
        toast.success('Admission letter generated');
      } else {
        toast.error((result as any).error || 'Failed to generate admission letter');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate admission letter');
    } finally {
      setActionLoading(null);
    }
  };

  const handleIssuePAL = async () => {
    setActionLoading('pal');
    try {
      const result = await issuePal(id);
      if ((result as any).success) {
        toast.success('PAL issued successfully');
        window.location.reload();
      } else {
        toast.error((result as any).error || 'Failed to issue PAL');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to issue PAL');
    } finally {
      setActionLoading(null);
    }
  };

  const handleIssueInvoice = async () => {
    setActionLoading('invoice');
    try {
      const amount = invoiceType === 'TUITION_DEPOSIT' ? 2000 : invoiceType === 'ANCILLARY' ? 700 : 0;
      const result = await pushInvoice(id, amount, invoiceType);
      if ((result as any).success) {
        toast.success('Invoice issued successfully');
        setShowInvoiceModal(false);
        window.location.reload();
      } else {
        toast.error((result as any).error || 'Failed to issue invoice');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to issue invoice');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setActionLoading('message');
    try {
      const result = await sendMessage(id, messageText);
      if ((result as any).success) {
        toast.success('Message sent to student');
        setMessageText('');
        setShowMessageForm(false);
      } else {
        toast.error((result as any).error || 'Failed to send message');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditRecord = () => {
    setEditForm({
      personal_info: application?.personal_info || {},
      contact_details: application?.contact_details || {},
      education_history: application?.education_history || {},
      motivation: application?.motivation || {},
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setActionLoading('edit');
    try {
      const result = await updateApplication(id, editForm);
      if ((result as any).success) {
        toast.success('Record updated successfully');
        setIsEditing(false);
        window.location.reload();
      } else {
        toast.error((result as any).error || 'Failed to update record');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update record');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8">
        <div className="mb-4">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors">
            <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2} />
            Back
          </button>
        </div>
        <PageHeader title="Application Not Found" subtitle="The requested application could not be loaded." />
        <div className="mt-6 p-8 bg-red-50 border border-red-100 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button onClick={() => router.push('/sis/admin/admissions')} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded hover:bg-neutral-800 transition-colors">
            <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2} />
            Back to Admissions
          </button>
        </div>
      </div>
    );
  }

  const personalInfo = application.personal_info || {};
  const contactDetails = application.contact_details || {};
  const educationHistory = application.education_history || {};
  const motivation = application.motivation || {};
  const languageProficiency = application.language_proficiency || {};
  const course = application.course || undefined;
  const user = application.user || undefined;
  const documents = application.documents || [];
  const offer = application.offer || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Details"
        subtitle={`${application.application_number || application.id?.slice(0, 8)} ${course?.title || 'Unknown Program'}${course?.degreeLevel ? ` ${formatDegreeLevel(course?.degreeLevel)}` : ''}`}
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors">
              <HugeiconsIcon icon={Printer} size={14} strokeWidth={2.5} /> Print
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors">
              <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} /> Export
            </button>
          </div>
        }
      />

      <Tabs tabs={tabs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Application Information */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Application Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application ID</dt><dd className="font-mono font-medium text-white mt-1">{application.application_number || application.id?.slice(0, 8)}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</dt><dd className="mt-1"><StatusBadge status={application.status?.replace('_', ' ') || 'DRAFT'} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Program</dt><dd className="font-medium text-white mt-1">{course?.title || '—'}{course?.degreeLevel ? ` ${formatDegreeLevel(course?.degreeLevel)}` : ''}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intake</dt><dd className="font-medium text-white mt-1">{application.intake || '—'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitted</dt><dd className="font-medium text-white mt-1">{application.submitted_at ? new Date(application.submitted_at).toLocaleDateString('en-CA') : '—'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student ID</dt><dd className="font-medium text-white mt-1">{student?.student_id || 'Not yet enrolled'}</dd></div>
            </dl>
          </div>

          {/* Personal Information */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Personal Information</h3>
             <dl className="grid grid-cols-2 gap-4 text-sm">
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</dt><dd className="font-medium text-white mt-1">{personalInfo?.firstName || user?.first_name} {personalInfo?.lastName || user?.last_name}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passport Number</dt><dd className="font-medium text-white mt-1">{personalInfo?.passportNumber || user?.passport_number || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nationality</dt><dd className="font-medium text-white mt-1">{personalInfo?.nationality || user?.citizenship || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</dt><dd className="font-medium text-white mt-1">{personalInfo?.dateOfBirth || user?.date_of_birth || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</dt><dd className="font-medium text-white mt-1">{personalInfo?.gender || user?.gender || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Type</dt><dd className="font-medium text-white mt-1 capitalize">{personalInfo?.studentType || '—'}</dd></div>
             </dl>
          </div>

          {/* Contact Details */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Contact Details</h3>
             <dl className="grid grid-cols-2 gap-4 text-sm">
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</dt><dd className="font-medium text-white mt-1">{contactDetails?.email || user?.email || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</dt><dd className="font-medium text-white mt-1">{contactDetails?.phoneCode && contactDetails?.phone ? `${contactDetails.phoneCode} ${contactDetails.phone}` : contactDetails?.phone || (user?.phone_code && user?.phone_number ? `${user.phone_code} ${user.phone_number}` : user?.phone_number || '—')}</dd></div>
               <div className="col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</dt><dd className="font-medium text-white mt-1">{[contactDetails?.addressLine1, contactDetails?.city, contactDetails?.country, user?.address, user?.city, user?.state_province, user?.zipcode].filter(Boolean).join(', ') || '—'}</dd></div>
             </dl>
          </div>

          {/* Academic History */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Academic History</h3>
            {educationHistory ? (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High School</dt><dd className="font-medium text-white mt-1">{educationHistory?.highSchool || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation Year</dt><dd className="font-medium text-white mt-1">{educationHistory?.graduationYear || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPA</dt><dd className="font-medium text-white mt-1">{educationHistory?.gpa || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree</dt><dd className="font-medium text-white mt-1">{educationHistory?.degree || '—'}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-slate-400">No academic history provided</p>
            )}
          </div>

          {/* Language Proficiency */}
          {languageProficiency && (
            <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Language Proficiency</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Test Type</dt><dd className="font-medium text-white mt-1">{languageProficiency?.testType || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</dt><dd className="font-medium text-white mt-1">{languageProficiency?.score || '—'}</dd></div>
              </dl>
            </div>
          )}

          {/* Motivation */}
          {motivation && motivation?.statement && (
            <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Motivation Statement</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{motivation?.statement}</p>
              {motivation?.extracurriculars && (
                <div className="mt-4">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracurriculars</dt>
                  <dd className="text-sm text-slate-300 mt-1">{motivation?.extracurriculars}</dd>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl" id="documents">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Uploaded Documents</h3>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-slate-400" />
                      <span className="text-xs font-medium text-white">{doc?.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{doc?.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={doc?.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 hover:underline">View</a>
                      <a href={doc?.url} download className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white">Download</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No documents uploaded</p>
            )}
          </div>

          {/* Review Notes */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl" id="notes">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Internal Review Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add review notes..."
              className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none font-sans h-24 resize-none rounded-xl"
            />
            <button onClick={handleSaveNotes} disabled={actionLoading === 'notes'} className="mt-3 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
              {actionLoading === 'notes' ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Update Status</h3>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:outline-none mb-3 rounded-xl [&>option]:bg-[#0a151a] [&>option]:text-white"
            >
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="DOCS_REQUIRED">Documents Required</option>
              <option value="ADMITTED">Admitted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button onClick={() => handleStatusUpdate(status)} disabled={actionLoading === 'status' || !status} className="w-full px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
              {actionLoading === 'status' ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Admission Actions</h3>
            <div className="space-y-2">
              <button onClick={handleIssueOffer} disabled={actionLoading === 'offer'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <HugeiconsIcon icon={GraduationCap} size={14} strokeWidth={2} className="text-sky-400" /> Issue Offer / LOA
              </button>
              <button onClick={handleRegenerateLOA} disabled={actionLoading === 'loa'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <HugeiconsIcon icon={Printer} size={14} strokeWidth={2} className="text-sky-400" /> Regenerate LOA
              </button>
              <button onClick={handleGenerateAdmissionLetter} disabled={actionLoading === 'admission-letter'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-sky-400" /> Generate Admission Letter
              </button>
              <button onClick={handleIssuePAL} disabled={actionLoading === 'pal'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <HugeiconsIcon icon={Shield} size={14} strokeWidth={2} className="text-emerald-400" /> Issue PAL
              </button>
              <button onClick={() => setShowInvoiceModal(true)} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors">
                <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-amber-400" /> Issue Invoice
              </button>
              <button onClick={() => handleStatusUpdate('REJECTED')} disabled={actionLoading === 'status'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Reject Application
              </button>
               <button onClick={() => setShowMessageForm(!showMessageForm)} disabled={actionLoading === 'message'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                 <HugeiconsIcon icon={Message} size={14} strokeWidth={2} className="text-sky-400" /> Send Message
               </button>
               {showMessageForm && (
                 <div className="space-y-2 pt-2">
                   <textarea
                     value={messageText}
                     onChange={e => setMessageText(e.target.value)}
                     placeholder="Type your message to the student..."
                     className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none h-20 resize-none rounded-xl"
                   />
                   <div className="flex gap-2">
                     <button onClick={handleSendMessage} disabled={actionLoading === 'message'} className="flex-1 px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
                       {actionLoading === 'message' ? 'Sending...' : 'Send'}
                     </button>
                     <button onClick={() => setShowMessageForm(false)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-xl">
                       Cancel
                     </button>
                   </div>
                 </div>
               )}
               {!isEditing ? (
                 <button onClick={handleEditRecord} disabled={actionLoading === 'edit'} className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50">
                   <HugeiconsIcon icon={Edit} size={14} strokeWidth={2} className="text-slate-400" /> Edit Record
                 </button>
               ) : (
                 <div className="space-y-2 pt-2">
                   <textarea
                     value={editForm?.personal_info?.statement || ''}
                     onChange={e => setEditForm({ ...editForm, personal_info: { ...editForm.personal_info, statement: e.target.value } })}
                     placeholder="Edit record notes..."
                     className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none h-20 resize-none rounded-xl"
                   />
                   <div className="flex gap-2">
                     <button onClick={handleSaveEdit} disabled={actionLoading === 'edit'} className="flex-1 px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
                       {actionLoading === 'edit' ? 'Saving...' : 'Save'}
                     </button>
                     <button onClick={() => setIsEditing(false)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-xl">
                       Cancel
                     </button>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Student Journey Status */}
          {student && (
            <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Student Journey</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Student ID</span><span className="font-medium text-white">{student?.student_id || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Enrollment</span><StatusBadge status={student?.enrollment_status || '—'} size="sm" /></div>
                <div className="flex justify-between"><span className="text-slate-400">PAL Required</span><span className="font-medium text-white">{student?.pal_required ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">PAL Status</span><span className="font-medium text-white">{student?.pal_status || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Study Permit</span><span className="font-medium text-white">{student?.study_permit_status || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Current Stage</span><span className="font-medium text-white">{student?.current_stage || '—'}</span></div>
              </div>
            </div>
          )}

          {/* Offer Information */}
          {offer && (
            <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Admission Offer</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Offer ID</span><span className="font-medium text-white">{offer?.id?.slice(0, 8)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tuition Fee</span><span className="font-medium text-white">${Number(offer?.tuition_fee).toLocaleString()} CAD</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Payment Deadline</span><span className="font-medium text-white">{offer?.payment_deadline ? new Date(offer?.payment_deadline).toLocaleDateString('en-CA') : '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Offer Type</span><span className="font-medium text-white">{offer?.offer_type || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Offer Status</span><StatusBadge status={offer?.status || 'PENDING'} size="sm" /></div>
                {offer?.document_url && (
                  <div className="mt-3">
                    <a href={offer?.document_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium rounded-xl transition-colors no-underline">
                      <HugeiconsIcon icon={Download} size={12} strokeWidth={2} /> Download Offer Letter
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f2027] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white">
            <h3 className="text-lg font-bold text-white mb-4">Issue Invoice</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Invoice Type</label>
                <select
                  value={invoiceType}
                  onChange={e => setInvoiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:outline-none rounded-xl [&>option]:bg-[#0a151a] [&>option]:text-white"
                >
                  <option value="TUITION_DEPOSIT">Tuition Deposit</option>
                  <option value="TUITION_FULL">Full Tuition</option>
                  <option value="ANCILLARY">Ancillary Fees</option>
                </select>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Amount to Issue</p>
                <p className="text-2xl font-bold text-white">
                  {invoiceType === 'TUITION_DEPOSIT' ? '$2,000' : invoiceType === 'ANCILLARY' ? '$700' : 'Custom'} CAD
                </p>
                {invoiceType === 'TUITION_DEPOSIT' && (
                  <p className="text-xs text-slate-400 mt-1">Standard tuition deposit amount</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleIssueInvoice}
                  disabled={actionLoading === 'invoice'}
                  className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm"
                >
                  {actionLoading === 'invoice' ? 'Issuing...' : 'Issue Invoice'}
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  disabled={actionLoading === 'invoice'}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors disabled:opacity-50 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
