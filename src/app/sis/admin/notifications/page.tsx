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

export default function AdminNotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('General');
    const [priority, setPriority] = useState('normal');
    const [recipientType, setRecipientType] = useState('all');
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, programsRes] = await Promise.all([
                    fetch('/api/sis/admin/notifications'),
                    fetch('/api/sis/admin/programs'),
                ]);

                if (notifRes.ok) {
                    const data = await notifRes.json();
                    setNotifications(data.notifications || []);
                }

                if (programsRes.ok) {
                    const data = await programsRes.json();
                    setPrograms(data.programs || []);
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
                    <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
                            <HugeiconsIcon icon={Bell} size={16} strokeWidth={2} /> New Notification
                        </h3>

                        {error && (
                            <div className="bg-red-950/60 p-3 rounded-xl text-xs text-red-300 font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-950/60 p-3 rounded-xl text-xs text-emerald-300 font-medium">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Title *</Label>
                            <input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="Notification title"
                                className="w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Message *</Label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                placeholder="Notification message"
                                rows={4}
                                className="w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Category</Label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
                                >
                                    <option value="General">General</option>
                                    <option value="Academics">Academics</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Registration">Registration</option>
                                    <option value="Admissions">Admissions</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Priority</Label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipientType" className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Recipients</Label>
                            <select
                                id="recipientType"
                                value={recipientType}
                                onChange={e => setRecipientType(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
                            >
                                <option value="all">All Students</option>
                                <option value="program">By Program</option>
                                <option value="individual">Individual Students</option>
                            </select>
                        </div>

                        {recipientType === 'program' && (
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Select Programs</Label>
                                <div className="max-h-40 overflow-y-auto bg-black/20 rounded-xl p-2 space-y-1">
                                    {programs.map(program => (
                                        <label key={program.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer">
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
                                                className="w-4 h-4 text-[#9c27b3] border-neutral-700 bg-neutral-800 rounded focus:ring-[#9c27b3]"
                                            />
                                            <span className="text-xs text-neutral-200">{program.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button htmlType="submit" disabled={sending} className="w-full bg-[#9c27b3] hover:bg-purple-700 text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs border-0">
                            <HugeiconsIcon icon={Send} size={14} strokeWidth={2.5} className="mr-2" />
                            {sending ? 'Sending...' : 'Send Notification'}
                        </Button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Sent Notifications</h3>
                        </div>
                        <div className="p-4 space-y-2 bg-black/20">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-neutral-500 text-xs uppercase tracking-wider font-bold">No notifications sent yet</div>
                            ) : (
                                notifications.map(notification => (
                                    <div key={notification.id} className="p-4 bg-neutral-800 rounded-xl hover:bg-neutral-800/80 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-white">{notification.title}</span>
                                                    {notification.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full">HIGH</span>}
                                                    {notification.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded-full">URGENT</span>}
                                                </div>
                                                <div className="text-xs text-neutral-300 line-clamp-2">{notification.message}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full">{notification.category}</span>
                                                    <span className="text-[10px] text-slate-800">{new Date(notification.created_at).toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-800">• {notification.recipient_type}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer ml-4"
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
