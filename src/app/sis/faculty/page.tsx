'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon as BackIcon,
    UserGroupIcon as UsersIcon,
    Calendar01Icon as CalendarIcon,
    Loading03Icon as SpinnerIcon,
    BookOpen01Icon as BookIcon,
} from '@hugeicons/core-free-icons';
import { ExternalLink } from 'lucide-react';
import { getTeamsClassWebUrl, MICROSOFT_APP_URLS } from '@/lib/microsoft/teams';

export default function FacultyDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        async function loadFacultyData() {
            try {
                const res = await fetch('/api/sis/education/classes');
                if (res.ok) {
                    const data = await res.json();
                    if (data.sections && data.sections.length > 0) {
                        setSections(data.sections);
                    } else {
                        // Fallback teaching classes for faculty view
                        setSections([
                            { id: 'sec-1', code: '01', moduleCode: 'NURS 301', title: 'Advanced Nursing Practice', enrolled: 28, capacity: 30, schedule: 'Mon/Wed 9:00 - 10:30', room: 'HS-201', teamId: 'nurs-301' },
                            { id: 'sec-2', code: '01', moduleCode: 'NURS 302', title: 'Clinical Pharmacology', enrolled: 25, capacity: 25, schedule: 'Tue/Thu 10:00 - 11:30', room: 'HS-205', teamId: 'nurs-302' },
                        ]);
                    }
                }
            } catch (err) {
                console.error('Error loading faculty sections', err);
            } finally {
                setLoading(false);
            }
        }
        loadFacultyData();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ background: '#0a151a', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 12 }}>
                <Link href="/sis/" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                    Back to SIS
                </Link>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Faculty Teaching Portal & Teams</span>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                            Faculty Course Management
                        </h1>
                        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                            Access your assigned academic course sections, student rosters, and Microsoft Class Teams.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <a
                            href={MICROSOFT_APP_URLS.teams}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#464eb8',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: 8,
                                fontSize: 12.5,
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            Open Teams Web App
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {loading ? (
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 13 }}>
                            <HugeiconsIcon icon={SpinnerIcon} size={18} className="animate-spin" />
                            <span>Loading teaching schedule...</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                        {sections.map((sec) => {
                            const teamsUrl = getTeamsClassWebUrl(sec.teamId || sec.moduleCode);
                            return (
                                <div
                                    key={sec.id}
                                    style={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        padding: 24,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ background: '#0a151a', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>
                                                {sec.moduleCode} (Sec {sec.code})
                                            </span>
                                            <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <HugeiconsIcon icon={UsersIcon} size={14} />
                                                {sec.enrolled} / {sec.capacity} Students
                                            </span>
                                        </div>

                                        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                                            {sec.title}
                                        </h3>

                                        <div style={{ fontSize: 12.5, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <span>&bull; Schedule: {sec.schedule}</span>
                                            <span>&bull; Location: {sec.room}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <a
                                            href={teamsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                fontSize: 12.5,
                                                fontWeight: 700,
                                                color: '#464eb8',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Class Team Channel
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>

                                        <Link
                                            href="/sis/faculty/timetable/"
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: '#0f172a',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            View Timetable &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
