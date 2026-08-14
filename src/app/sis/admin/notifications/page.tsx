'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRightIcon as Send, BellIcon as Bell, Trash as Trash } from '@hugeicons/core-free-icons';

interface Notification {
    id: string;
    title: string;
    message: string;
    category: string;
    priority: string;
    recipient_type: string;
    read: boolean;
    created_at: string;
}

interface Program {
    id: string;
    title: string;
}

interface Student {
    id: string;
    student_id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
}

export default function AdminNotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('General');
    const [priority, setPriority] = useState('normal');
    const [recipientType, setRecipientType] = useState('all');
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [studentSearch, setStudentSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, programsRes, studentsRes] = await Promise.all([
                    fetch('/api/sis/admin/notifications'),
                    fetch('/api/sis/admin/programs'),
                    fetch('/api/sis/students'),
                ]);

                if (notifRes.ok) {
                    const data = await notifRes.json();
                    setNotifications(data.notifications || []);
                }

                if (programsRes.ok) {
                    const data = await programsRes.json();
                    setPrograms(data.programs || []);
                }

                if (studentsRes.ok) {
                    const data = await studentsRes.json();
                    setStudentsList(data.students || []);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccess(null);

        try {
            const body: any = {
                title,
                message,
                category,
                priority,
                recipient_type: recipientType,
            };

            if (recipientType === 'program') {
                body.recipient_ids = selectedPrograms;
            } else if (recipientType === 'individual') {
                body.recipient_ids = selectedStudents;
            }

            const response = await fetch('/api/sis/admin/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send notification');
            }

            setSuccess('Notification sent successfully');
            setTitle('');
            setMessage('');
            setCategory('General');
            setPriority('normal');
            setRecipientType('all');
            setSelectedPrograms([]);
            setSelectedStudents([]);

            const notifRes = await fetch('/api/sis/admin/notifications');
            if (notifRes.ok) {
                const data = await notifRes.json();
                setNotifications(data.notifications || []);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/sis/admin/notifications?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete');
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Push Notifications"
                subtitle="Send notifications to students in real-time"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-[#0f2027] border border-white/10 rounded-2xl p-6 space-y-4 text-white shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                            <HugeiconsIcon icon={Bell} size={16} strokeWidth={2} /> New Notification
                        </h3>

                        {error && (
                            <div className="bg-red-950/60 border border-red-500/20 p-3 rounded-xl text-xs text-red-300 font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-950/60 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-300 font-medium">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Title *</Label>
                            <input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Notification title"
                                className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white/10 font-sans transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Message *</Label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                placeholder="Notification message"
                                rows={4}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white/10 font-sans transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Category</Label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white/10 font-sans transition-all"
                                >
                                    <option value="General" className="bg-[#0f2027] text-white">General</option>
                                    <option value="Academics" className="bg-[#0f2027] text-white">Academics</option>
                                    <option value="Finance" className="bg-[#0f2027] text-white">Finance</option>
                                    <option value="Registration" className="bg-[#0f2027] text-white">Registration</option>
                                    <option value="Admissions" className="bg-[#0f2027] text-white">Admissions</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Priority</Label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white/10 font-sans transition-all"
                                >
                                    <option value="low" className="bg-[#0f2027] text-white">Low</option>
                                    <option value="normal" className="bg-[#0f2027] text-white">Normal</option>
                                    <option value="high" className="bg-[#0f2027] text-white">High</option>
                                    <option value="urgent" className="bg-[#0f2027] text-white">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipientType" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recipients</Label>
                            <select
                                id="recipientType"
                                value={recipientType}
                                onChange={e => setRecipientType(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white/10 font-sans transition-all"
                            >
                                <option value="all" className="bg-[#0f2027] text-white">All Students</option>
                                <option value="program" className="bg-[#0f2027] text-white">By Program</option>
                                <option value="individual" className="bg-[#0f2027] text-white">Individual Students</option>
                            </select>
                        </div>

                        {recipientType === 'program' && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Programs</Label>
                                <div className="max-h-40 overflow-y-auto bg-white/5 border border-white/10 rounded-xl p-2 space-y-1">
                                    {programs.map(program => (
                                        <label key={program.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedPrograms.includes(program.id)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setSelectedPrograms([...selectedPrograms, program.id]);
                                                    } else {
                                                        setSelectedPrograms(selectedPrograms.filter(id => id !== program.id));
                                                    }
                                                }}
                                                className="w-4 h-4 text-sky-500 border-white/20 bg-white/10 rounded focus:ring-sky-500"
                                            />
                                            <span className="text-xs text-slate-200">{program.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recipientType === 'individual' && (() => {
                            const filteredStudents = studentsList
                                .filter(st => {
                                    const fullName = `${st.first_name || ''} ${st.last_name || ''}`.trim().toLowerCase();
                                    const searchLower = studentSearch.toLowerCase();
                                    return fullName.includes(searchLower) || (st.email && st.email.toLowerCase().includes(searchLower));
                                })
                                .sort((a, b) => {
                                    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
                                    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
                                    return nameA.localeCompare(nameB);
                                });

                            return (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search & Select Student by Name</Label>
                                        {selectedStudents.length > 0 && (
                                            <span className="text-[10px] font-bold text-sky-400">{selectedStudents.length} selected</span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Type student name to search..."
                                        value={studentSearch}
                                        onChange={e => setStudentSearch(e.target.value)}
                                        className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-sky-500 font-sans transition-all"
                                    />
                                    <div className="max-h-52 overflow-y-auto bg-white/5 border border-white/10 rounded-xl p-2 space-y-1">
                                        {filteredStudents.length === 0 ? (
                                            <div className="p-3 text-xs text-slate-400 font-medium">
                                                {studentSearch ? `No students match "${studentSearch}"` : 'No enrolled students found'}
                                            </div>
                                        ) : (
                                            filteredStudents.map(st => {
                                                const fullName = `${st.first_name || ''} ${st.last_name || ''}`.trim() || st.email || (st.student_id ? `Student #${st.student_id}` : `Student #${st.id.substring(0, 6)}`);
                                                return (
                                                    <label key={st.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(st.id)}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    setSelectedStudents([...selectedStudents, st.id]);
                                                                } else {
                                                                    setSelectedStudents(selectedStudents.filter(id => id !== st.id));
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-sky-500 border-white/20 bg-white/10 rounded focus:ring-sky-500"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-white">{fullName}</span>
                                                            {st.email && <span className="text-[10px] text-slate-400 font-mono">{st.email}</span>}
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <HugeiconsIcon icon={Send} size={14} strokeWidth={2.5} />
                            {sending ? 'Sending...' : 'Send Notification'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-[#0f2027] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-white/10">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent Notifications</h3>
                        </div>
                        <div className="p-4 space-y-2.5">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-xs uppercase tracking-wider font-bold">No notifications sent yet</div>
                            ) : (
                                notifications.map(notification => (
                                    <div key={notification.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white">{notification.title}</span>
                                                    {notification.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full">HIGH</span>}
                                                    {notification.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full">URGENT</span>}
                                                </div>
                                                <div className="text-xs text-slate-300 line-clamp-2">{notification.message}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">{notification.category}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(notification.created_at).toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-400">• {notification.recipient_type}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-4"
                                                title="Delete Notification"
                                            >
                                                <HugeiconsIcon icon={Trash} size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
