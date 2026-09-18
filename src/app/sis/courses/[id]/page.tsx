'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon as BackIcon,
    Loading03Icon as SpinnerIcon,
    Calendar01Icon as CalendarIcon,
    MapPinIcon as LocationIcon,
    UserIcon,
} from '@hugeicons/core-free-icons';
import { ExternalLink } from 'lucide-react';
import { getTeamsClassWebUrl } from '@/lib/microsoft/teams';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        async function loadCourseDetails() {
            try {
                // Fetch classes to find matching course or section
                const res = await fetch('/api/sis/education/classes');
                if (res.ok) {
                    const data = await res.json();
                    const enrollment = (data.enrollments || []).find(
                        (e: any) => e.modules?.id === courseId || e.modules?.code === courseId || e.id === courseId
                    );

                    if (enrollment) {
                        setCourse({
                            id: enrollment.modules?.id || courseId,
                            code: enrollment.modules?.code || courseId,
                            title: enrollment.modules?.title || 'Academic Course',
                            credits: enrollment.modules?.credits || 3,
                            semester: enrollment.semesters?.name || 'Current Term',
                            status: enrollment.status || 'Enrolled',
                            officialGrade: enrollment.grade !== null ? enrollment.grade : null,
                            gradeStatus: enrollment.grade_status || 'In Progress',
                            instructor: 'Faculty Member',
                            location: 'Ottawa Campus / Hybrid',
                            schedule: 'Monday & Wednesday',
                            teamId: enrollment.modules?.code?.toLowerCase().replace(/\s+/g, '-'),
                        });
                    } else {
                        // Fallback default course info
                        setCourse({
                            id: courseId,
                            code: courseId.toUpperCase(),
                            title: 'Course Syllabus & Class Information',
                            credits: 3,
                            semester: 'Current Term',
                            status: 'Enrolled',
                            officialGrade: null,
                            gradeStatus: 'In Progress',
                            instructor: 'Assigned Professor',
                            location: 'Room 204, Main Hall',
                            schedule: 'Scheduled Class Times',
                            teamId: courseId.toLowerCase().replace(/\s+/g, '-'),
                        });
                    }
                }

                // Fetch assignments
                const assignRes = await fetch('/api/sis/education/assignments');
                if (assignRes.ok) {
                    const aData = await assignRes.json();
                    setAssignments(aData.assignments || []);
                }
            } catch (err) {
                console.error('Error loading course', err);
            } finally {
                setLoading(false);
            }
        }
        loadCourseDetails();
    }, [courseId]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 13 }}>
                    <HugeiconsIcon icon={SpinnerIcon} size={20} className="animate-spin" />
                    <span>Loading course details & Microsoft Teams integration...</span>
                </div>
            </div>
        );
    }

    const teamsUrl = getTeamsClassWebUrl(course?.teamId || courseId);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Top Bar */}
            <div style={{ background: '#0a151a', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 12 }}>
                <Link href="/sis/courses/" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                    Back to Courses
                </Link>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{course?.code} — {course?.title}</span>
            </div>

            <div style={{ maxWidth: 1050, margin: '0 auto', padding: '32px 24px' }}>
                {/* Course Header Banner */}
                <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ background: '#0a151a', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                                    {course?.code}
                                </span>
                                <span style={{ fontSize: 12, color: '#64748b' }}>
                                    {course?.credits} Credits &bull; {course?.semester}
                                </span>
                            </div>
                            <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                                {course?.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#475569', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <HugeiconsIcon icon={UserIcon} size={15} />
                                    {course?.instructor}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <HugeiconsIcon icon={CalendarIcon} size={15} />
                                    {course?.schedule}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <HugeiconsIcon icon={LocationIcon} size={15} />
                                    {course?.location}
                                </span>
                            </div>
                        </div>

                        {/* Teams Quick Button */}
                        <div>
                            <a
                                href={teamsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: '#464eb8',
                                    color: 'white',
                                    padding: '10px 18px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 8px rgba(70,78,184,0.25)',
                                }}
                            >
                                Open in Microsoft Teams
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                    {/* Left Column: Official Registrar Records */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
                            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                                Official Registrar Status
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                                    <span style={{ color: '#64748b' }}>Enrollment Status:</span>
                                    <span style={{ fontWeight: 700, color: '#166534' }}>{course?.status}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                                    <span style={{ color: '#64748b' }}>Grading Basis:</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Standard Letter Grade (A-F)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                                    <span style={{ color: '#64748b' }}>Official Transcript Grade:</span>
                                    <span style={{ fontWeight: 700, color: course?.officialGrade ? '#0f172a' : '#94a3b8' }}>
                                        {course?.officialGrade || 'Pending End of Term'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                    <span style={{ color: '#64748b' }}>Record Source:</span>
                                    <span style={{ fontWeight: 700, color: '#0369a1' }}>Cannoga College SIS</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                            <h4 style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                                Official Grades vs Teams Coursework
                            </h4>
                            <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.55 }}>
                                Scores received on Microsoft Teams assignments reflect formative coursework. Official transcript grades and GPA calculation are finalized solely by the Cannoga College Office of the Registrar.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Microsoft 365 Learning Layer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                                    Microsoft Class Team
                                </h3>
                                <span style={{ fontSize: 11, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                                    Active Team
                                </span>
                            </div>

                            <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                                Access course lectures, collaborate on group projects, participate in channel discussions, and review lecture notes inside the designated Class Team.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <a
                                    href={teamsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 8,
                                        padding: '12px 16px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span>Class Discussions & General Channel</span>
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </a>

                                <Link
                                    href="/sis/assignments/"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 8,
                                        padding: '12px 16px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span>Course Assignments & Deadlines</span>
                                    <span style={{ fontSize: 12, color: '#2563eb' }}>View in SIS &rarr;</span>
                                </Link>

                                <a
                                    href="https://cannogacollege-my.sharepoint.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 8,
                                        padding: '12px 16px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span>SharePoint Course Files & Handouts</span>
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
