'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Mail01Icon as Mail,
    Message01Icon as Message,
    MailSend01Icon as Send,
    UserIcon as User,
    Search01Icon as Search,
    Clock01Icon as Clock,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
    XCircle as XCircle,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { getMessages, sendMessage, markMessageRead } from '@/app/sis/student-life-actions';

interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    subject: string;
    body: string;
    category: string;
    priority: string;
    status: string;
    read_at: string | null;
    created_at: string;
    sender?: { first_name: string; last_name: string; email: string };
    recipient?: { first_name: string; last_name: string; email: string };
}

interface MessagingPanelProps {
    messages: Message[];
    unreadCount: number;
    onBack: () => void;
    studentId: string;
}

export default function MessagingPanel({ messages, unreadCount, onBack, studentId }: MessagingPanelProps) {
    const [allMessages, setAllMessages] = useState<Message[]>(messages);
    const [composeOpen, setComposeOpen] = useState(false);
    const [selectedThread, setSelectedThread] = useState<Message | null>(null);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);

    const [form, setForm] = useState({ recipientId: '', subject: '', body: '', category: 'GENERAL', priority: 'NORMAL' });

    useEffect(() => {
        setAllMessages(messages);
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const result = await sendMessage({
                senderId: studentId,
                recipientId: form.recipientId,
                subject: form.subject,
                body: form.body,
                category: form.category,
                priority: form.priority,
            });
            if (result.success) {
                toast.success('Message sent successfully');
                setForm({ recipientId: '', subject: '', body: '', category: 'GENERAL', priority: 'NORMAL' });
                setComposeOpen(false);
                const refreshed = await getMessages(studentId);
                if (refreshed.success) setAllMessages(refreshed.data);
            } else {
                toast.error(result.error || 'Failed to send message');
            }
        } finally {
            setSending(false);
        }
    };

    const handleReply = async () => {
        if (!selectedThread || !replyBody.trim()) return;
        setSending(true);
        try {
            const result = await sendMessage({
                senderId: studentId,
                recipientId: selectedThread.sender_id === studentId ? selectedThread.recipient_id : selectedThread.sender_id,
                subject: `Re: ${selectedThread.subject}`,
                body: replyBody,
                category: selectedThread.category,
                priority: selectedThread.priority,
            });
            if (result.success) {
                toast.success('Reply sent');
                setReplyBody('');
                const refreshed = await getMessages(studentId);
                if (refreshed.success) setAllMessages(refreshed.data);
            } else {
                toast.error(result.error || 'Failed to send reply');
            }
        } finally {
            setSending(false);
        }
    };

    const handleSelectThread = async (msg: Message) => {
        setSelectedThread(msg);
        if (!msg.read_at) {
            await markMessageRead(msg.id);
            setAllMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read_at: new Date().toISOString(), status: 'read' } : m));
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'ACADEMIC': return 'Academic';
            case 'FINANCIAL': return 'Financial';
            case 'IMMIGRATION': return 'Immigration';
            case 'TECHNICAL': return 'Technical';
            default: return 'General';
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return d.toLocaleDateString('en-CA');
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={onBack} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                    <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Back to Student Life
                </button>
                <button type="button" onClick={() => setComposeOpen(!composeOpen)} className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded flex items-center gap-1.5">
                    <HugeiconsIcon icon={Send} size={14} strokeWidth={2} /> New Message
                </button>
            </div>

            {composeOpen && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                    <h4 className="font-bold text-slate-900 text-sm mb-4">Compose Message</h4>
                    <form onSubmit={handleSend} className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Recipient</label>
                            <input
                                type="text"
                                value={form.recipientId}
                                onChange={e => setForm({ ...form, recipientId: e.target.value })}
                                placeholder="Enter recipient user ID or email..."
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="ACADEMIC">Academic</option>
                                    <option value="FINANCIAL">Financial</option>
                                    <option value="IMMIGRATION">Immigration</option>
                                    <option value="TECHNICAL">Technical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={e => setForm({ ...form, priority: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                >
                                    <option value="NORMAL">Normal</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                            <textarea
                                value={form.body}
                                onChange={e => setForm({ ...form, body: e.target.value })}
                                rows={4}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setComposeOpen(false)} className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50">Cancel</button>
                            <button type="submit" disabled={sending} className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded disabled:opacity-50">
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Mail} size={18} strokeWidth={2} className="text-slate-700" />
                        <h4 className="font-bold text-slate-900 text-sm">Messages</h4>
                        {unreadCount > 0 && <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{unreadCount} unread</span>}
                    </div>
                </div>

                {selectedThread ? (
                    <div className="p-6">
                        <button type="button" onClick={() => setSelectedThread(null)} className="text-xs text-slate-500 hover:text-slate-700 mb-3 flex items-center gap-1">
                            <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Back to threads
                        </button>
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h5 className="font-bold text-slate-900 text-sm">{selectedThread.subject}</h5>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-700 uppercase">{selectedThread.priority}</span>
                                <span className="text-[10px] text-slate-500">{getCategoryLabel(selectedThread.category)}</span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <HugeiconsIcon icon={Clock} size={12} strokeWidth={2} /> {formatDate(selectedThread.created_at)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-3 whitespace-pre-wrap">{selectedThread.body}</p>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-slate-600">Reply</label>
                            <textarea
                                value={replyBody}
                                onChange={e => setReplyBody(e.target.value)}
                                rows={3}
                                placeholder="Write your reply..."
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                            />
                            <div className="flex justify-end">
                                <button type="button" onClick={handleReply} disabled={sending || !replyBody.trim()} className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded disabled:opacity-50">
                                    {sending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {allMessages.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-500">No messages yet. Compose a new message to get started.</div>
                        ) : (
                            allMessages.map(msg => {
                                const otherUser = msg.sender_id === studentId ? msg.recipient : msg.sender;
                                const isUnread = !msg.read_at && msg.recipient_id === studentId;
                                return (
                                    <button
                                        key={msg.id}
                                        type="button"
                                        onClick={() => handleSelectThread(msg)}
                                        className="w-full text-left p-4 hover:bg-slate-50 transition flex items-start gap-3"
                                    >
                                        <div className="shrink-0 pt-0.5">
                                            <HugeiconsIcon icon={User} size={14} strokeWidth={2} className="text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-slate-900 truncate">{msg.subject}</span>
                                                {isUnread && <span className="w-2 h-2 bg-slate-900 rounded-full shrink-0"></span>}
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                                {msg.sender_id === studentId ? 'To: ' : 'From: '}
                                                {otherUser ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || otherUser.email : 'Unknown'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{msg.body}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-slate-700 uppercase">{msg.priority}</span>
                                                <span className="text-[10px] text-slate-400">{formatDate(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
