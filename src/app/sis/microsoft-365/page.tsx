'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon as BackIcon,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as WarningIcon,
    Loading03Icon as SpinnerIcon,
} from '@hugeicons/core-free-icons';
import { ExternalLink } from 'lucide-react';
import { MICROSOFT_APP_URLS } from '@/lib/microsoft/teams';

export default function Microsoft365HubPage() {
    const [loading, setLoading] = useState(true);
    const [statusData, setStatusData] = useState<any>(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                const res = await fetch('/api/sis/education/classes');
                if (res.ok) {
                    const data = await res.json();
                    setStatusData(data);
                }
            } catch (err) {
                console.error('Failed to check M365 status', err);
            } finally {
                setLoading(false);
            }
        }
        checkConnection();
    }, []);

    const isConnected = statusData?.hasMicrosoftSession;

    const M365_APPS = [
        {
            title: 'Microsoft Teams',
            category: 'Classes & Collaboration',
            description: 'Join virtual lectures, chat with course instructors, access class channels and submit assignments.',
            iconBg: '#464eb8',
            url: MICROSOFT_APP_URLS.teams,
            badge: isConnected ? 'Class Teams Active' : 'Sign in to access',
            highlight: true,
        },
        {
            title: 'Outlook Mail',
            category: 'Official Student Email',
            description: 'Access your official @cannogacollege.ca student inbox, college communications, and academic bulletins.',
            iconBg: '#0078d4',
            url: '/sis/mail/',
            internal: true,
            badge: 'Integrated in SIS',
            highlight: false,
        },
        {
            title: 'OneDrive for Business',
            category: 'Cloud Storage & Documents',
            description: '1TB secure cloud storage for coursework, project files, class notes, and academic documents.',
            iconBg: '#0078d4',
            url: MICROSOFT_APP_URLS.onedrive,
            badge: '1 TB Storage',
            highlight: false,
        },
        {
            title: 'OneNote Class Notebook',
            category: 'Lecture Notes & Research',
            description: 'Digital notebook for lecture notes, shared group handouts, assignment drafts, and study guides.',
            iconBg: '#7719aa',
            url: MICROSOFT_APP_URLS.oneNote,
            badge: 'Class Notebook',
            highlight: false,
        },
        {
            title: 'Word, Excel & PowerPoint',
            category: 'Productivity Suite',
            description: 'Full Microsoft 365 web apps included with your Cannoga College student subscription.',
            iconBg: '#d83b01',
            url: MICROSOFT_APP_URLS.officePortal,
            badge: 'M365 Apps',
            highlight: false,
        },
        {
            title: 'Microsoft Forms',
            category: 'Surveys & Course Quizzes',
            description: 'Submit course feedback, institutional surveys, and complete assigned professor quizzes.',
            iconBg: '#008272',
            url: MICROSOFT_APP_URLS.forms,
            badge: 'Forms & Polls',
            highlight: false,
        },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Top Navigation */}
            <div style={{ background: '#0a151a', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 12 }}>
                <Link href="/sis/" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                    Back to SIS
                </Link>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Microsoft 365 Education Hub</span>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
                {/* Header Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #0a151a 0%, #1e293b 100%)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    color: 'white',
                    marginBottom: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8' }}>
                                Cannoga College &bull; Digital Learning Layer
                            </span>
                            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
                                Microsoft 365 Education Suite
                            </h1>
                            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', maxWidth: 640, lineHeight: 1.5 }}>
                                Your official student account provides access to Microsoft Teams class channels, coursework, cloud storage, and productivity software synchronized with the Cannoga Student Information System.
                            </p>
                        </div>
                        <div>
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', padding: '8px 14px', borderRadius: 999, fontSize: 12 }}>
                                    <HugeiconsIcon icon={SpinnerIcon} size={16} className="animate-spin" />
                                    <span>Verifying M365...</span>
                                </div>
                            ) : isConnected ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#064e3b', border: '1px solid #059669', color: '#a7f3d0', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                                    <HugeiconsIcon icon={CheckCircle} size={16} />
                                    <span>Microsoft 365 Connected</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#451a03', border: '1px solid #b45309', color: '#fde68a', padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                                    <HugeiconsIcon icon={WarningIcon} size={16} />
                                    <span>Signed In Locally</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid of Microsoft 365 Applications */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {M365_APPS.map((app) => (
                        <div
                            key={app.title}
                            style={{
                                background: 'white',
                                borderRadius: 12,
                                border: app.highlight ? '1.5px solid #6366f1' : '1px solid #e2e8f0',
                                padding: '22px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <span style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#64748b',
                                    }}>
                                        {app.category}
                                    </span>
                                    <span style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: 999,
                                        background: app.highlight ? '#ede9fe' : '#f1f5f9',
                                        color: app.highlight ? '#6d28d9' : '#475569',
                                    }}>
                                        {app.badge}
                                    </span>
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                                    {app.title}
                                </h3>
                                <p style={{ margin: 0, fontSize: 12.5, color: '#64748b', lineHeight: 1.55 }}>
                                    {app.description}
                                </p>
                            </div>

                            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                                {app.internal ? (
                                    <Link
                                        href={app.url}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Open in SIS &rarr;
                                    </Link>
                                ) : (
                                    <a
                                        href={app.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: '#2563eb',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Launch Web App
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Institutional Note */}
                <div style={{
                    marginTop: 32,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                            Cannoga SIS System of Record
                        </h4>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                            Course registrations, transcripts, official tuition invoices, and graduation records are authoritatively managed in the Cannoga SIS. Teams coursework and assignment scores represent instructional progress and sync with official registrar grading periods.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
