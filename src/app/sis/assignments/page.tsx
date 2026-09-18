'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon as BackIcon,
    RefreshIcon,
    Loading03Icon as SpinnerIcon,
    CheckmarkCircle01Icon as CheckCircle,
    Clock01Icon as ClockIcon,
    Calendar01Icon as CalendarIcon,
} from '@hugeicons/core-free-icons';
import { ExternalLink } from 'lucide-react';

interface Assignment {
    id: string;
    classId: string;
    title: string;
    dueDateTime?: string;
    assignedDateTime?: string;
    status: string;
    webUrl?: string;
}

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'assigned' | 'submitted'>('all');

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/sis/education/assignments');
            const data = await res.json();
            if (data.ok) {
                setAssignments(data.assignments || []);
            } else {
                setError(data.error || 'Failed to retrieve assignments');
            }
        } catch (err: any) {
            setError('Could not connect to Microsoft 365');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const filtered = assignments.filter((a) => {
        if (filter === 'all') return true;
        if (filter === 'assigned') return a.status === 'assigned' || !a.status;
        if (filter === 'submitted') return a.status === 'submitted' || a.status === 'returned';
        return true;
    });

    const formatDueDate = (dateStr?: string) => {
        if (!dateStr) return 'No due date';
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ background: '#0a151a', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 12 }}>
                <Link href="/sis/" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                    Back to SIS
                </Link>
                <span style={{ color: '#334155' }}>|</span>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Assignments & Coursework</span>
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        onClick={fetchAssignments}
                        style={{
                            background: 'transparent',
                            border: '1px solid #1e3a47',
                            borderRadius: 6,
                            padding: '5px 12px',
                            color: '#94a3b8',
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <HugeiconsIcon icon={RefreshIcon} size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                            Coursework & Class Assignments
                        </h1>
                        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                            View and submit assignments assigned across your Microsoft Teams classes.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: 6, background: '#e2e8f0', padding: 4, borderRadius: 8 }}>
                        {(['all', 'assigned', 'submitted'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    border: 'none',
                                    background: filter === f ? '#0a151a' : 'transparent',
                                    color: filter === f ? '#ffffff' : '#475569',
                                    padding: '6px 14px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: 48, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 13 }}>
                            <HugeiconsIcon icon={SpinnerIcon} size={18} className="animate-spin" />
                            <span>Syncing assignments from Microsoft Teams...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 12, padding: 24 }}>
                        <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: '#92400e' }}>
                            Assignments Notice
                        </h3>
                        <p style={{ margin: 0, fontSize: 13, color: '#b45309', lineHeight: 1.5 }}>
                            {error}
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '56px 24px', textAlign: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <HugeiconsIcon icon={CalendarIcon} size={22} style={{ color: '#94a3b8' }} />
                        </div>
                        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                            No assignments {filter !== 'all' ? `marked as ${filter}` : 'currently scheduled'}
                        </h3>
                        <p style={{ margin: '0 auto 20px', fontSize: 13, color: '#64748b', maxWidth: 460, lineHeight: 1.5 }}>
                            When course professors publish assignments in Microsoft Teams, they will automatically appear here with their respective deadlines and grading status.
                        </p>
                        <a
                            href="https://teams.microsoft.com/_#/school/assignments"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: '#0a151a',
                                color: 'white',
                                padding: '9px 18px',
                                borderRadius: 8,
                                fontSize: 12.5,
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Open Microsoft Teams Assignments
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'white',
                                    borderRadius: 10,
                                    border: '1px solid #e2e8f0',
                                    padding: '18px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 16,
                                }}
                            >
                                <div style={{ flex: 1, minWidth: 240 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: 4 }}>
                                            Microsoft Teams
                                        </span>
                                        <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <HugeiconsIcon icon={ClockIcon} size={13} />
                                            Due: {formatDueDate(item.dueDateTime)}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                                        {item.title}
                                    </h3>
                                </div>

                                <div>
                                    {item.webUrl ? (
                                        <a
                                            href={item.webUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                background: '#0a151a',
                                                color: 'white',
                                                padding: '8px 16px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            View Assignment
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
