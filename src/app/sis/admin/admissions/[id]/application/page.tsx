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
  user?: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    phone_code?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state_province?: string;
    zipcode?: string;
    gender?: string;
    passport_number?: string;
    citizenship?: string;
    country_of_residence?: string;
    local_address?: string;
    local_city?: string;
    local_country?: string;
    local_state_province?: string;
    local_zipcode?: string;
    is_19_or_older?: string;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_phone?: string;
    contact_email?: string;
    has_siblings_at_college?: string;
    completing_form_person?: string;
    housing_required?: string;
    how_did_you_hear?: string;
    questions_comments?: string;
    [key: string]: any;
  };
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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceType, setInvoiceType] = useState('TUITION_DEPOSIT');
  const [customAmount, setCustomAmount] = useState<number | string>(2000);
  const [customDeadline, setCustomDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [availablePurposes, setAvailablePurposes] = useState<any[]>([]);

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
        // Fetch dynamic payment purposes
        fetch('/api/payments/purposes')
          .then(res => res.json())
          .then(data => {
            if (data?.purposes && Array.isArray(data.purposes)) {
              setAvailablePurposes(data.purposes);
            }
          })
          .catch(e => console.warn('Failed to load purposes:', e));
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
      const amount = Number(customAmount) || 0;
      if (amount <= 0) {
        toast.error('Please enter a valid amount greater than 0');
        setActionLoading(null);
        return;
      }
      const result = await pushInvoice(id, amount, invoiceType, customDeadline ? new Date(customDeadline).toISOString() : undefined);
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
               <div>
                 <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</dt>
                 <dd className="font-medium text-white mt-1">
                   {[personalInfo?.firstName || user?.first_name, personalInfo?.middleName, personalInfo?.lastName || user?.last_name].filter(Boolean).join(' ') || '—'}
                 </dd>
               </div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passport Number</dt><dd className="font-medium text-white mt-1">{personalInfo?.passportNumber || user?.passport_number || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nationality</dt><dd className="font-medium text-white mt-1">{personalInfo?.nationality || user?.citizenship || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Birth</dt><dd className="font-medium text-white mt-1">{personalInfo?.dateOfBirth || user?.date_of_birth || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</dt><dd className="font-medium text-white mt-1 capitalize">{personalInfo?.gender || user?.gender || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Type</dt><dd className="font-medium text-white mt-1 capitalize">{personalInfo?.studentType || '—'}</dd></div>
             </dl>
          </div>

          {/* Contact Details & Permanent Address */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Contact & Permanent Address</h3>
             <dl className="grid grid-cols-2 gap-4 text-sm">
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</dt><dd className="font-medium text-white mt-1">{contactDetails?.email || user?.email || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</dt><dd className="font-medium text-white mt-1">{contactDetails?.phoneCode && contactDetails?.phone ? `${contactDetails.phoneCode} ${contactDetails.phone}` : contactDetails?.phone || (user?.phone_code && user?.phone_number ? `${user.phone_code} ${user.phone_number}` : user?.phone_number || '—')}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Street Address</dt><dd className="font-medium text-white mt-1">{[contactDetails?.addressLine1, contactDetails?.addressLine2, user?.address].filter(Boolean).join(', ') || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</dt><dd className="font-medium text-white mt-1">{contactDetails?.city || user?.city || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State / Province</dt><dd className="font-medium text-white mt-1">{user?.state_province || '—'}</dd></div>
               <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Zip / Postal Code</dt><dd className="font-medium text-white mt-1">{contactDetails?.postalCode || user?.zipcode || '—'}</dd></div>
               <div className="col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</dt><dd className="font-medium text-white mt-1">{contactDetails?.country || user?.country_of_residence || user?.citizenship || '—'}</dd></div>
             </dl>
          </div>

          {/* Local / Canadian Address */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Local / Canadian Address</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Local Street Address</dt>
                <dd className="font-medium text-white mt-1">{user?.local_address || 'Same as permanent address'}</dd>
              </div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City</dt><dd className="font-medium text-white mt-1">{user?.local_city || user?.city || '—'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Province / State</dt><dd className="font-medium text-white mt-1">{user?.local_state_province || user?.state_province || '—'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Postal / Zip Code</dt><dd className="font-medium text-white mt-1">{user?.local_zipcode || user?.zipcode || '—'}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Country</dt><dd className="font-medium text-white mt-1">{user?.local_country || user?.country_of_residence || 'Canada'}</dd></div>
            </dl>
          </div>

          {/* Guardian / Emergency Contact */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Guardian / Emergency Contact Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Age Verification</dt>
                <dd className="font-medium text-white mt-1">
                  {user?.is_19_or_older === 'yes' || user?.is_19_or_older === '19_or_older' ? '19 Years Old or Older (Emergency Contact)' : user?.is_19_or_older === 'no' || user?.is_19_or_older === 'under_19' ? 'Under 19 Years Old (Parent / Guardian)' : user?.is_19_or_older || '19 Years Old or Older'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Full Name</dt>
                <dd className="font-medium text-white mt-1">
                  {[user?.contact_first_name, user?.contact_last_name].filter(Boolean).join(' ') || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Phone</dt>
                <dd className="font-medium text-white mt-1">{user?.contact_phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Email</dt>
                <dd className="font-medium text-white mt-1">{user?.contact_email || '—'}</dd>
              </div>
            </dl>
          </div>

          {/* Additional Registration Information */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Additional Registration Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Siblings at Cannoga College?</dt>
                <dd className="font-medium text-white mt-1 capitalize">{user?.has_siblings_at_college || 'No'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Who is completing this form?</dt>
                <dd className="font-medium text-white mt-1 capitalize">{user?.completing_form_person || 'Applicant (Myself)'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Housing Requirements</dt>
                <dd className="font-medium text-white mt-1 capitalize">{user?.housing_required || 'Not required'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">How did you hear about us?</dt>
                <dd className="font-medium text-white mt-1">{user?.how_did_you_hear || motivation?.howDidYouHear || '—'}</dd>
              </div>
              {(user?.questions_comments || (application as any)?.questions_comments) && (
                <div className="col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Questions or Additional Notes</dt>
                  <dd className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 mt-1 whitespace-pre-wrap">
                    {user?.questions_comments || (application as any)?.questions_comments}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Academic History */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Academic History</h3>
            {Array.isArray(educationHistory?.education) && educationHistory.education.length > 0 ? (
              <div className="space-y-4">
                {educationHistory.education.map((edu: any, index: number) => (
                  <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Qualification #{index + 1}</span>
                      {edu.startYear && edu.endYear && (
                        <span className="text-xs text-slate-400 font-mono">{edu.startYear} – {edu.endYear}</span>
                      )}
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-sm pt-1">
                      <div className="col-span-2">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institution</dt>
                        <dd className="font-medium text-white mt-0.5">{edu.institution || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree / Certificate</dt>
                        <dd className="font-medium text-white mt-0.5">{edu.degree || '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPA / Grade</dt>
                        <dd className="font-medium text-white mt-0.5">{edu.grade || '—'}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            ) : educationHistory?.highSchool || educationHistory?.degree ? (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institution</dt><dd className="font-medium text-white mt-1">{educationHistory?.highSchool || educationHistory?.institution || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation Year</dt><dd className="font-medium text-white mt-1">{educationHistory?.graduationYear || educationHistory?.endYear || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GPA</dt><dd className="font-medium text-white mt-1">{educationHistory?.gpa || educationHistory?.grade || '—'}</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree</dt><dd className="font-medium text-white mt-1">{educationHistory?.degree || '—'}</dd></div>
              </dl>
            ) : (
              <p className="text-sm text-slate-400">No academic history provided</p>
            )}
          </div>

          {/* Motivation & Purpose */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Motivation & Purpose</h3>
            <div className="space-y-4 text-sm">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Statement of Purpose</dt>
                <dd className="p-4 bg-white/5 border border-white/10 rounded-xl text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {motivation?.statementOfPurpose || motivation?.statement || motivation?.essay || 'No statement provided.'}
                </dd>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">English Proficiency</dt>
                  <dd className="font-medium text-white mt-1 capitalize">
                    {motivation?.languageProficiency?.englishLevel || languageProficiency?.level || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Language Test Taken</dt>
                  <dd className="font-medium text-white mt-1">
                    {motivation?.languageProficiency?.testTaken || languageProficiency?.testType || 'None / Not specified'}
                    {(motivation?.languageProficiency?.testScore || languageProficiency?.score) && (
                      <span className="text-sky-400 ml-1">({motivation?.languageProficiency?.testScore || languageProficiency?.score})</span>
                    )}
                  </dd>
                </div>
                {motivation?.extracurriculars && (
                  <div className="col-span-2">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Extracurricular Activities</dt>
                    <dd className="font-medium text-white mt-1">{motivation.extracurriculars}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Applicant Declaration</h3>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>Applicant certified that all information provided is accurate and complete in all aspects.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>Applicant acknowledged that falsification or misrepresentation of any information or documents will result in rejection of application or withdrawal of offer.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>Applicant agreed that information submitted will be used for student registration, SIN assignment, program evaluation, and system-level research.</span>
              </p>
            </div>
          </div>

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

          {/* Admission Actions */}
          <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Admission Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleIssueOffer} 
                disabled={actionLoading === 'offer'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-sky-500/30 hover:border-sky-400/60 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                    <HugeiconsIcon icon={GraduationCap} size={15} strokeWidth={2.5} className="text-sky-400" />
                  </div>
                  <span className="text-white font-medium truncate">Issue Offer / LOA</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={handleRegenerateLOA} 
                disabled={actionLoading === 'loa'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <HugeiconsIcon icon={Printer} size={15} strokeWidth={2.5} className="text-slate-300" />
                  </div>
                  <span className="text-white font-medium truncate">Regenerate LOA</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={handleGenerateAdmissionLetter} 
                disabled={actionLoading === 'admission-letter'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <HugeiconsIcon icon={FileText} size={15} strokeWidth={2.5} className="text-slate-300" />
                  </div>
                  <span className="text-white font-medium truncate">Generate Admission Letter</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={handleIssuePAL} 
                disabled={actionLoading === 'pal'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <HugeiconsIcon icon={Shield} size={15} strokeWidth={2.5} className="text-emerald-400" />
                  </div>
                  <span className="text-white font-medium truncate">Issue PAL</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={() => setShowInvoiceModal(true)} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-amber-500/30 hover:border-amber-400/60 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <HugeiconsIcon icon={FileText} size={15} strokeWidth={2.5} className="text-amber-400" />
                  </div>
                  <span className="text-white font-medium truncate">Issue Invoice</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={() => handleStatusUpdate('REJECTED')} 
                disabled={actionLoading === 'status'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#1f1618] hover:bg-[#2b1b1e] border border-red-500/30 hover:border-red-500/60 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                    <HugeiconsIcon icon={XCircle} size={15} strokeWidth={2.5} className="text-red-400" />
                  </div>
                  <span className="text-red-300 font-medium truncate">Reject Application</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-red-500/50 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              <button 
                onClick={() => setShowMessageForm(!showMessageForm)} 
                disabled={actionLoading === 'message'} 
                className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 transition-colors">
                    <HugeiconsIcon icon={Message} size={15} strokeWidth={2.5} className="text-sky-400" />
                  </div>
                  <span className="text-white font-medium truncate">Send Message</span>
                </div>
                <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {showMessageForm && (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type your message to the student..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#16262e] border border-white/15 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none h-20 resize-none rounded-xl"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSendMessage} disabled={actionLoading === 'message'} className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
                      {actionLoading === 'message' ? 'Sending...' : 'Send'}
                    </button>
                    <button onClick={() => setShowMessageForm(false)} className="flex-1 px-4 py-2 bg-[#16262e] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f3b] transition-colors rounded-xl">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isEditing ? (
                <button 
                  onClick={handleEditRecord} 
                  disabled={actionLoading === 'edit'} 
                  className="w-full text-left px-3.5 py-2.5 bg-[#14232c] hover:bg-[#1a2f3b] border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-between text-xs font-bold tracking-wide transition-all disabled:opacity-50 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                      <HugeiconsIcon icon={Edit} size={15} strokeWidth={2.5} className="text-slate-300" />
                    </div>
                    <span className="text-white font-medium truncate">Edit Record</span>
                  </div>
                  <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={editForm?.personal_info?.statement || ''}
                    onChange={e => setEditForm({ ...editForm, personal_info: { ...editForm.personal_info, statement: e.target.value } })}
                    placeholder="Edit record notes..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#16262e] border border-white/15 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none h-20 resize-none rounded-xl"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} disabled={actionLoading === 'edit'} className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm">
                      {actionLoading === 'edit' ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 bg-[#16262e] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f3b] transition-colors rounded-xl">
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
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Issue Student Invoice</h3>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {/* Payment Purpose / Invoice Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Payment Purpose / Invoice Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={invoiceType}
                  onChange={e => {
                    const nextType = e.target.value;
                    setInvoiceType(nextType);
                    const matched = availablePurposes.find(p => p.code === nextType);
                    if (matched?.default_amount) {
                      setCustomAmount(matched.default_amount);
                    } else if (nextType === 'TUITION_DEPOSIT') {
                      setCustomAmount(2000);
                    } else if (nextType === 'ANCILLARY') {
                      setCustomAmount(700);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:outline-none rounded-xl [&>option]:bg-[#0a151a] [&>option]:text-white cursor-pointer"
                >
                  {availablePurposes.length > 0 ? (
                    availablePurposes.map(p => (
                      <option key={p.id || p.code} value={p.code}>
                        {p.name} (Custom Amount)
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="TUITION_DEPOSIT">Tuition Deposit (Custom Amount)</option>
                      <option value="1ST_YEAR_TUITION">1st Year Tuition (Custom Amount)</option>
                      <option value="TUITION_FULL">Full Tuition Fee (Custom Amount)</option>
                      <option value="ANCILLARY">Ancillary Fees (Custom Amount)</option>
                      <option value="RESIDENCE_RENT">Residence / Housing Rent (Custom Amount)</option>
                      <option value="GRADUATION_FEE">Graduation Fee (Custom Amount)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Custom Tuition / Fee Amount (CAD) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="e.g. 2000.00"
                    className="w-full pl-8 pr-16 py-2.5 text-sm font-mono font-bold bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:outline-none rounded-xl"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">CAD</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter the exact authoritative amount the student will be required to settle.
                </p>
              </div>

              {/* Payment Deadline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Payment Deadline Due Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={customDeadline}
                  onChange={e => setCustomDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white focus:border-sky-500 focus:outline-none rounded-xl cursor-pointer"
                />
              </div>

              {/* Summary Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Invoiced to Student</p>
                  <p className="text-xl font-mono font-black text-emerald-400 mt-0.5">
                    ${Number(customAmount || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Due Date</p>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">
                    {customDeadline ? new Date(customDeadline).toLocaleDateString('en-CA') : '30 days'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleIssueInvoice}
                  disabled={actionLoading === 'invoice'}
                  className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-xl shadow-sm cursor-pointer"
                >
                  {actionLoading === 'invoice' ? 'Issuing...' : 'Issue Invoice'}
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  disabled={actionLoading === 'invoice'}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors disabled:opacity-50 rounded-xl cursor-pointer"
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
