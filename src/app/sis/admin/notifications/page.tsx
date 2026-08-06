'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRightIcon as Send, BellIcon as Bell } from '@hugeicons/core-free-icons';
import Link from 'next/link';

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
        return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Push Notifications"
                subtitle="Send notifications to students in real-time"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">New Notification</h3>

                        {error && (
                            <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-sm text-emerald-700">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Notification title" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Notification message" rows={4} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                                    <option value="General">General</option>
                                    <option value="Academics">Academics</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Registration">Registration</option>
                                    <option value="Admissions">Admissions</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <select id="priority" value={priority} onChange={e => setPriority(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recipientType">Recipients</Label>
                            <select id="recipientType" value={recipientType} onChange={e => setRecipientType(e.target.value)} className="w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white">
                                <option value="all">All Students</option>
                                <option value="program">By Program</option>
                                <option value="individual">Individual Students</option>
                            </select>
                        </div>

                        {recipientType === 'program' && (
                            <div className="space-y-2">
                                <Label>Select Programs</Label>
                                <div className="max-h-40 overflow-y-auto border border-neutral-200 p-2 space-y-1">
                                    {programs.map(program => (
                                        <label key={program.id} className="flex items-center gap-2 p-1 hover:bg-neutral-50">
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
                                                className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]"
                                            />
                                            <span className="text-sm text-neutral-700">{program.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button htmlType="submit" disabled={sending} className="w-full">
                            <HugeiconsIcon icon={Send} size={14} strokeWidth={2.5} className="mr-2" />
                            {sending ? 'Sending...' : 'Send Notification'}
                        </Button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white border border-neutral-200">
                        <div className="p-4 border-b border-neutral-200">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Sent Notifications</h3>
                        </div>
                        <div className="divide-y divide-neutral-200">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-neutral-500 text-sm">No notifications sent yet</div>
                            ) : (
                                notifications.map(notification => (
                                    <div key={notification.id} className="p-4 hover:bg-neutral-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-neutral-900">{notification.title}</span>
                                                    {notification.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">HIGH</span>}
                                                    {notification.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">URGENT</span>}
                                                </div>
                                                <div className="text-xs text-neutral-500 line-clamp-2">{notification.message}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{notification.category}</span>
                                                    <span className="text-[10px] text-neutral-400">{new Date(notification.created_at).toLocaleString()}</span>
                                                    <span className="text-[10px] text-neutral-400">• {notification.recipient_type}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="text-xs font-bold text-red-600 hover:text-red-800 ml-4"
                                            >
                                                Delete
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
