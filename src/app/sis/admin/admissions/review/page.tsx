'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon as FileText, UserIcon as User, Mail01Icon as Mail, SmartPhone01Icon as Phone, MapPinIcon as MapPin, Calendar01Icon as Calendar, GraduationCapIcon as GraduationCap, Shield01Icon as Shield, Alert01Icon as AlertTriangle, CheckIcon as CheckCircle, CancelCircleIcon as XCircle, ChevronRightIcon as ArrowRight, Edit01Icon as Edit, Download01Icon as Download, PrinterIcon as Printer, Message01Icon as Message, ClockIcon as Clock } from '@hugeicons/core-free-icons';
import Link from 'next/link';

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

const mockApplication: ApplicationDetail = {
  id: '1',
  application_number: 'APP-2026-00123',
  status: 'UNDER_REVIEW',
  submitted_at: '2026-11-10T00:00:00Z',
  intake: 'Fall 2027',
  course: { title: 'Bachelor of Science in Nursing', slug: 'bsc-nursing', degreeLevel: 'BACHELOR' },
  user: { first_name: 'Maria', last_name: 'Santos', email: 'm.santos@cannogacollege.ca', phone: '(613) 555-0199', date_of_birth: '1999-03-22', address: '456 King St, Ottawa, ON K1L 1A1' },
  personal_info: { firstName: 'Maria', lastName: 'Santos', passportNumber: 'AB1234567', nationality: 'Philippines' },
  contact_details: { email: 'm.santos@cannogacollege.ca', phone: '(613) 555-0199', addressLine1: '456 King St', city: 'Ottawa', country: 'Canada' },
  education_history: { highSchool: 'Manila National High School', graduationYear: 2018, gpa: 3.8 },
  motivation: { statement: 'I am passionate about healthcare and want to serve my community.', extracurriculars: 'Volunteer at local clinic' },
  documents: [
    { id: '1', type: 'PASSPORT', name: 'passport_scan.pdf', url: '#', created_at: '2026-11-10' },
    { id: '2', type: 'TRANSCRIPT', name: 'transcript.pdf', url: '#', created_at: '2026-11-10' },
    { id: '3', type: 'MOTIVATION_LETTER', name: 'motivation.pdf', url: '#', created_at: '2026-11-10' },
  ],
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
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review"
        subtitle={`${mockApplication.application_number} — ${mockApplication.course?.title}${mockApplication.course?.degreeLevel ? ` — ${formatDegreeLevel(mockApplication.course.degreeLevel)}` : ''}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Application Information</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Application ID</dt><dd className="font-mono font-medium text-neutral-900 mt-1">{mockApplication.application_number}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Status</dt><dd className="mt-1"><StatusBadge status={mockApplication.status.replace('_', ' ')} /></dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Program</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.course?.title}{mockApplication.course?.degreeLevel ? ` — ${formatDegreeLevel(mockApplication.course.degreeLevel)}` : ''}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Intake</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.intake}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Submitted</dt><dd className="font-medium text-neutral-900 mt-1">{new Date(mockApplication.submitted_at).toLocaleDateString('en-CA')}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Assigned Officer</dt><dd className="font-medium text-neutral-900 mt-1">Admissions Team</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Applicant</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Name</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.user?.first_name} {mockApplication.user?.last_name}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</dt><dd className="font-medium text-neutral-900 mt-1 font-mono text-xs">{mockApplication.user?.email}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.user?.phone}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Date of Birth</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.user?.date_of_birth}</dd></div>
              <div className="col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Address</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.user?.address}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Academic History</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">High School</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.education_history?.highSchool}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Graduation Year</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.education_history?.graduationYear}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">GPA</dt><dd className="font-medium text-neutral-900 mt-1">{mockApplication.education_history?.gpa}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Uploaded Documents</h3>
            <div className="space-y-2">
              {mockApplication.documents?.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={FileText} size={14} strokeWidth={2} className="text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-900">{doc.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{doc.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-bold uppercase tracking-wider text-[#9c27b3] hover:underline">View</button>
                    <button className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-600">Download</button>
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
              <button className="w-full mt-3 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                Submit Decision
              </button>
            )}
          </div>

          <div className="bg-white border border-neutral-200 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">Document Status</h3>
            <div className="space-y-2">
              {mockApplication.documents?.map(doc => (
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
    </div>
  );
}