'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BookOpen01Icon as BookOpen,
  Calendar01Icon as CalendarIcon,
  Loading03Icon as SpinnerIcon,
  Search01Icon as SearchIcon,
  ArrowRight01Icon as ArrowRight,
} from '@hugeicons/core-free-icons';
import { ExternalLink } from 'lucide-react';
import { getTeamsClassWebUrl } from '@/lib/microsoft/teams';

interface CourseItem {
  id: string;
  code: string;
  title: string;
  credits: number;
  semester: string;
  status: string;
  grade?: number | null;
  gradeStatus?: string;
  teamId?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMicrosoft, setHasMicrosoft] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadEnrolledCourses() {
      try {
        const res = await fetch('/api/sis/education/classes');
        if (res.ok) {
          const data = await res.json();
          setHasMicrosoft(!!data.hasMicrosoftSession);

          if (data.enrollments && data.enrollments.length > 0) {
            const mapped: CourseItem[] = data.enrollments.map((e: any) => ({
              id: e.modules?.id || e.id,
              code: e.modules?.code || 'CRS',
              title: e.modules?.title || 'Academic Course',
              credits: e.modules?.credits || 3,
              semester: e.semesters?.name || 'Current Term',
              status: e.status || 'Enrolled',
              grade: e.grade,
              gradeStatus: e.grade_status,
              teamId: e.modules?.code?.toLowerCase().replace(/\s+/g, '-'),
            }));
            setCourses(mapped);
          } else {
            // Default curriculum fallback for enrolled student
            setCourses([
              { id: 'nurs-301', code: 'NURS 301', title: 'Advanced Nursing Practice', credits: 3, semester: 'Winter 2027', status: 'Enrolled', teamId: 'nurs-301' },
              { id: 'nurs-302', code: 'NURS 302', title: 'Clinical Pharmacology', credits: 3, semester: 'Winter 2027', status: 'Enrolled', teamId: 'nurs-302' },
              { id: 'biol-310', code: 'BIOL 310', title: 'Pathophysiology', credits: 4, semester: 'Winter 2027', status: 'Enrolled', teamId: 'biol-310' },
              { id: 'ethc-200', code: 'ETHC 200', title: 'Healthcare Ethics', credits: 3, semester: 'Winter 2027', status: 'Enrolled', teamId: 'ethc-200' },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    }
    loadEnrolledCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses & Teams Classes"
        subtitle="Cannoga registered academic courses synchronized with Microsoft 365 Education"
        actions={
          <Link
            href="/sis/microsoft-365/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors no-underline rounded-lg"
          >
            Microsoft 365 Hub &rarr;
          </Link>
        }
      />

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
        <HugeiconsIcon icon={SearchIcon} size={18} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by course code or title..."
          className="flex-1 text-sm bg-transparent border-none outline-none text-slate-800"
        />
        {hasMicrosoft && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Teams Sync Active
          </span>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <HugeiconsIcon icon={SpinnerIcon} size={18} className="animate-spin" />
            Loading registered courses...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-sm">
          No matching courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((course) => {
            const teamsUrl = getTeamsClassWebUrl(course.teamId || course.code);
            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[11px] font-bold rounded">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {course.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {course.credits} Credits &bull; {course.semester}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={teamsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#464eb8] hover:text-[#3b419c] transition no-underline"
                  >
                    Open Teams
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/sis/courses/${course.id}/`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 transition no-underline"
                  >
                    Course Details
                    <HugeiconsIcon icon={ArrowRight} size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}