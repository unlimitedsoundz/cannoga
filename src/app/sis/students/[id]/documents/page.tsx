'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { StudentHeader } from '@/components/sis/StudentHeader';
import { DocumentTable } from '@/components/sis/DocumentTable';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { Upload01Icon as Upload } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const mockDocuments = [
  { id: '1', name: 'Official Transcript - Fall 2026', type: 'pdf', category: 'Transcript', status: 'Available', uploadedAt: 'Dec 15, 2026', size: '245 KB', uploadedBy: 'Registrar Office' },
  { id: '2', name: 'Unofficial Transcript - Fall 2026', type: 'pdf', category: 'Transcript', status: 'Available', uploadedAt: 'Dec 10, 2026', size: '189 KB', uploadedBy: 'Student' },
  { id: '3', name: 'Admission Letter', type: 'pdf', category: 'Admissions', status: 'Available', uploadedAt: 'Jul 15, 2024', size: '312 KB', uploadedBy: 'Admissions Office' },
  { id: '4', name: 'Immunization Records', type: 'pdf', category: 'Health', status: 'Verified', uploadedAt: 'Aug 20, 2024', size: '1.2 MB', uploadedBy: 'Health Services' },
  { id: '5', name: 'Study Permit', type: 'pdf', category: 'Immigration', status: 'Verified', uploadedAt: 'Aug 10, 2024', size: '856 KB', uploadedBy: 'International Office' },
  { id: '6', name: 'Course Syllabus - NURS 301', type: 'pdf', category: 'Academic', status: 'Available', uploadedAt: 'Sep 5, 2026', size: '445 KB', uploadedBy: 'Dr. A. Thompson' },
  { id: '7', name: 'Financial Aid Award Letter', type: 'pdf', category: 'Finance', status: 'Available', uploadedAt: 'Aug 1, 2026', size: '278 KB', uploadedBy: 'Financial Aid Office' },
  { id: '8', name: 'Enrollment Verification Letter', type: 'pdf', category: 'Verification', status: 'Available', uploadedAt: 'Sep 1, 2026', size: '134 KB', uploadedBy: 'Registrar Office' },
];

export default function DocumentsPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [page, setPage] = React.useState(1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        subtitle={`Student: CC10231 • Sarah Mitchell`}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
            <HugeiconsIcon icon={Upload} size={14} strokeWidth={2} /> Upload Document
          </button>
        }
      />

      <Tabs tabs={[
        { label: 'All Documents', href: '/sis/students/1/documents' },
        { label: 'Transcripts', href: '/sis/students/1/documents/transcripts' },
        { label: 'Admissions', href: '/sis/students/1/documents/admissions' },
        { label: 'Health', href: '/sis/students/1/documents/health' },
        { label: 'Finance', href: '/sis/students/1/documents/finance' },
      ]} />

      <StudentHeader student={{
        id: '1',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        studentId: 'CC10231',
        email: 's.mitchell@cannogacollege.ca',
        program: 'Bachelor of Science in Nursing',
        school: 'School of Health and Community Services',
        academicLevel: 'Undergraduate',
        startTerm: 'Fall 2024',
        status: 'Active',
        enrollmentStatus: 'Enrolled',
        institutionalEmail: 's.mitchell@student.cannogacollege.ca',
      }} />

      <DocumentTable
        documents={mockDocuments}
        onView={(doc) => alert(`Viewing ${doc.name}`)}
        onDownload={(doc) => alert(`Downloading ${doc.name}`)}
        pagination={{
          page,
          pageSize: 10,
          total: mockDocuments.length,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}