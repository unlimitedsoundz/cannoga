'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Mail01Icon as MailIcon,
    InboxIcon,
    SentIcon,
    ArchiveIcon,
    Edit01Icon as DraftIcon,
    FavouriteIcon as StarIcon,
    Flag01Icon as FlagIcon,
    RefreshIcon,
    ArrowLeft01Icon as BackIcon,
    AttachmentIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Loading03Icon as SpinnerIcon,
} from '@hugeicons/core-free-icons';

interface EmailMessage {
    id: string;
    subject: string;
    from: { emailAddress: { name: string; address: string } };
    toRecipients: { emailAddress: { name: string; address: string } }[];
    bodyPreview: string;
    receivedDateTime: string;
    sentDateTime?: string;
    isRead: boolean;
    flag: { flagStatus: 'notFlagged' | 'flagged' | 'complete' };
    hasAttachments: boolean;
    importance: 'low' | 'normal' | 'high';
    body?: { contentType: string; content: string };
}

type Folder = 'inbox' | 'starred' | 'flagged' | 'sent' | 'archive' | 'drafts';

const FOLDERS: { id: Folder; label: string; icon: any }[] = [
    { id: 'inbox', label: 'Inbox', icon: InboxIcon },
    { id: 'starred', label: 'Starred', icon: StarIcon },
    { id: 'flagged', label: 'Flagged', icon: FlagIcon },
    { id: 'sent', label: 'Sent', icon: SentIcon },
    { id: 'archive', label: 'Archive', icon: ArchiveIcon },
    { id: 'drafts', label: 'Drafts', icon: DraftIcon },
];

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000 && d.getDate() === now.getDate()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 7 * 86400000) {
        return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function getSanitizedHtml(html: string) {
    const responsiveStyles = `
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">
        <style>
            html, body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 12px;
                color: #1e293b;
                font-size: 14px;
                line-height: 1.6;
                word-break: break-word;
                overflow-wrap: break-word;
                background-color: #ffffff;
                box-sizing: border-box;
            }
            img { max-width: 100% !important; height: auto !important; }
            table { max-width: 100% !important; table-layout: auto !important; }
            pre { white-space: pre-wrap; word-break: break-all; }
            a { color: #0284c7; }
        </style>
    `;
    if (html.includes('<head>') || html.includes('<head ')) {
        return html.replace(/<head[^>]*>/i, `$&${responsiveStyles}`);
    }
    if (html.includes('<html') || html.includes('<body')) {
        return `<!DOCTYPE html><html><head>${responsiveStyles}</head>${html}</html>`;
    }
    return `<!DOCTYPE html><html><head>${responsiveStyles}</head><body>${html}</body></html>`;
}

export default function StudentMailPage() {
    const searchParams = useSearchParams();
    const initialFolder = (searchParams.get('folder') as Folder) || 'inbox';
    const [folder, setFolder] = useState<Folder>(initialFolder);
    const [messages, setMessages] = useState<EmailMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [needsReauth, setNeedsReauth] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState<EmailMessage | null>(null);
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [folderCounts, setFolderCounts] = useState<Record<string, number>>({});
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const PAGE_SIZE = 25;

    const fetchMessages = useCallback(async (f: Folder, s = 0, silent = false) => {
        if (!silent) {
            setLoading(true);
            setError(null);
            setSelectedMsg(null);
        }
        try {
            const res = await fetch(`/api/sis/mail?folder=${f}&top=${PAGE_SIZE}&skip=${s}`);
            const data = await res.json();
            if (!res.ok) {
                if (data.needsReauth) setNeedsReauth(true);
                if (!silent) {
                    setError(data.error || 'Failed to load messages');
                    setMessages([]);
                }
                return;
            }
            setMessages(data.messages || []);
            setHasMore(!!data.nextLink);
        } catch (e: any) {
            if (!silent) setError('Failed to connect. Check your connection.');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    const fetchCounts = useCallback(async () => {
        try {
            const res = await fetch('/api/sis/mail?action=unread_counts');
            if (!res.ok) return;
            const data = await res.json();
            const map: Record<string, number> = { flagged: data.flaggedCount ?? 0 };
            (data.counts || []).forEach((c: any) => {
                if (c.displayName) map[c.displayName.toLowerCase().replace(' ', '')] = c.unreadItemCount ?? 0;
                if (c.id === 'inbox') map.inbox = c.unreadItemCount ?? 0;
                if (c.id === 'sentitems') map.sent = c.unreadItemCount ?? 0;
                if (c.id === 'archive') map.archive = c.unreadItemCount ?? 0;
                if (c.id === 'drafts') map.drafts = c.unreadItemCount ?? 0;
            });
            setFolderCounts(map);
        } catch {}
    }, []);

    useEffect(() => {
        fetchMessages(folder, 0);
        setSkip(0);
    }, [folder, fetchMessages]);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    // Live auto-refresh: Poll Microsoft 365 every 30 seconds in the background
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchMessages(folder, skip, true);
                fetchCounts();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [folder, skip, fetchMessages, fetchCounts]);

    const openMessage = async (msg: EmailMessage) => {
        setSelectedMsg(msg);
        setLoadingMsg(true);
        // Mark as read
        if (!msg.isRead) {
            fetch('/api/sis/mail', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId: msg.id, isRead: true }),
            }).catch(() => {});
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
        }
        try {
            const res = await fetch(`/api/sis/mail?action=message&messageId=${msg.id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedMsg(data.message);
            }
        } catch {}
        setLoadingMsg(false);
    };

    const currentFolderLabel = FOLDERS.find(f => f.id === folder)?.label || 'Inbox';

    return (
        <div className="flex flex-col h-screen h-[100dvh] bg-slate-100 overflow-hidden font-sans">
            {/* Header */}
            <header className="bg-[#0a151a] text-white px-3 sm:px-6 flex items-center justify-between h-[52px] border-b border-slate-800 shrink-0 z-10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Link
                        href="/sis/"
                        className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors shrink-0"
                    >
                        <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                        <span className="hidden sm:inline">Back to SIS</span>
                        <span className="sm:hidden">SIS</span>
                    </Link>
                    <span className="text-slate-700 text-sm hidden sm:inline">|</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <HugeiconsIcon icon={MailIcon} size={18} strokeWidth={2} className="text-blue-400 shrink-0" />
                        <span className="font-bold text-sm tracking-tight text-white truncate">Student Mail</span>
                        <span className="text-xs text-slate-500 hidden md:inline shrink-0">— Microsoft 365</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => { fetchMessages(folder, skip); fetchCounts(); }}
                        className="bg-transparent hover:bg-white/5 border border-[#1e3a47] hover:border-slate-600 rounded-md px-2.5 sm:px-3 py-1.5 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                        title="Refresh messages"
                    >
                        <HugeiconsIcon icon={RefreshIcon} size={13} strokeWidth={2} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </header>

            {/* Mobile Folder Selector Tabs (visible on mobile when no message is open) */}
            {!selectedMsg && (
                <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto flex gap-1.5 shrink-0 no-scrollbar shadow-xs">
                    {FOLDERS.map(f => {
                        const count = folderCounts[f.id] || 0;
                        const active = folder === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => { setFolder(f.id); setSkip(0); setSelectedMsg(null); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                                    active
                                        ? 'bg-sky-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300'
                                }`}
                            >
                                <HugeiconsIcon icon={f.icon} size={14} strokeWidth={active ? 2.5 : 2} />
                                <span>{f.label}</span>
                                {count > 0 && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                                        active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Desktop Sidebar (visible on md+) */}
                <aside className="w-52 bg-white border-r border-slate-200 py-3 hidden md:flex md:flex-col shrink-0">
                    <div className="px-4 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Folders</span>
                    </div>
                    <div className="flex-1 space-y-0.5 overflow-y-auto">
                        {FOLDERS.map(f => {
                            const count = folderCounts[f.id] || 0;
                            const active = folder === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => { setFolder(f.id); setSkip(0); setSelectedMsg(null); }}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left transition-colors border-l-[3px] ${
                                        active
                                            ? 'bg-sky-50 border-sky-600 text-sky-700 font-bold'
                                            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                                    }`}
                                >
                                    <HugeiconsIcon icon={f.icon} size={16} strokeWidth={active ? 2.5 : 2} />
                                    <span className="flex-1 truncate">{f.label}</span>
                                    {count > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none ${
                                            active ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Message List Pane */}
                <div className={`bg-white border-r border-slate-200 flex flex-col shrink-0 ${
                    selectedMsg ? 'hidden md:flex md:w-80 lg:w-96' : 'w-full md:w-80 lg:w-96 flex-1 md:flex-initial'
                }`}>
                    {/* Folder title bar */}
                    <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                        <div>
                            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                {currentFolderLabel}
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {messages.length} message{messages.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {messages.length > 0 && (
                            <span className="text-[11px] text-slate-400 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                                {skip + 1}–{skip + messages.length}
                            </span>
                        )}
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-48 gap-2.5 text-slate-400">
                                <HugeiconsIcon icon={SpinnerIcon} size={20} strokeWidth={2} className="animate-spin text-sky-500" />
                                <span className="text-xs sm:text-sm font-medium">Loading messages...</span>
                            </div>
                        ) : needsReauth ? (
                            <div className="p-4 sm:p-6">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                    <p className="text-xs sm:text-sm font-bold text-amber-900 mb-1">🔒 Admin Approval Required</p>
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        Your Microsoft 365 tenant requires an admin to approve mail access for this app.
                                        Ask your IT administrator to visit the link below and click <strong>Accept</strong>:
                                    </p>
                                </div>
                                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Admin consent URL</p>
                                <code className="block bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-800 break-all mb-4 select-all">
                                    https://login.microsoftonline.com/559051ae-ebf4-496a-8dbb-128aac57d721/adminconsent?client_id=5548838a-7cd2-4be6-9f5d-116f8e8a200f
                                </code>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Once the admin approves, students sign out and sign back in with Microsoft 365. Mail access will then work automatically.
                                </p>
                            </div>
                        ) : error ? (
                            <div className="p-6 text-center">
                                <p className="text-xs sm:text-sm text-red-500 mb-3">{error}</p>
                                <button
                                    onClick={() => fetchMessages(folder, skip)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold text-slate-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs sm:text-sm">
                                No messages in {currentFolderLabel}
                            </div>
                        ) : (
                            messages.map(msg => {
                                const active = selectedMsg?.id === msg.id;
                                return (
                                    <button
                                        key={msg.id}
                                        onClick={() => openMessage(msg)}
                                        className={`w-full text-left p-3 sm:p-3.5 border-b border-slate-100 transition-colors cursor-pointer border-l-3 ${
                                            active
                                                ? 'bg-sky-50 border-l-sky-600'
                                                : msg.isRead
                                                ? 'bg-white hover:bg-slate-50 border-l-transparent'
                                                : 'bg-slate-50/70 hover:bg-slate-100/70 border-l-sky-500'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className="pt-1.5 shrink-0">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        msg.isRead ? 'bg-slate-300' : 'bg-sky-500'
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline gap-2 mb-0.5">
                                                    <span className={`text-xs sm:text-[13px] truncate ${
                                                        msg.isRead ? 'font-medium text-slate-800' : 'font-bold text-slate-950'
                                                    }`}>
                                                        {msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || 'Unknown'}
                                                    </span>
                                                    <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0 font-normal">
                                                        {formatDate(msg.receivedDateTime)}
                                                    </span>
                                                </div>
                                                <p className={`text-xs sm:text-[13px] mb-0.5 truncate ${
                                                    msg.isRead ? 'font-normal text-slate-600' : 'font-semibold text-slate-900'
                                                }`}>
                                                    {msg.subject || '(No subject)'}
                                                </p>
                                                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                                                    {msg.bodyPreview}
                                                </p>
                                                {(msg.importance === 'high' || msg.flag?.flagStatus === 'flagged' || msg.hasAttachments) && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                                                        {msg.importance === 'high' && (
                                                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded leading-none">
                                                                ● HIGH
                                                            </span>
                                                        )}
                                                        {msg.flag?.flagStatus === 'flagged' && (
                                                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5">
                                                                🚩 Flagged
                                                            </span>
                                                        )}
                                                        {msg.hasAttachments && (
                                                            <span className="text-[10px] text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5">
                                                                📎 Attachment
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && !error && messages.length > 0 && (
                        <div className="flex justify-between items-center px-3 sm:px-4 py-2.5 bg-white border-t border-slate-100 shrink-0">
                            <button
                                disabled={skip === 0}
                                onClick={() => { const ns = Math.max(0, skip - PAGE_SIZE); setSkip(ns); fetchMessages(folder, ns); }}
                                className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
                                    skip === 0
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-sky-600 hover:bg-sky-50 active:bg-sky-100 cursor-pointer'
                                }`}
                            >
                                <HugeiconsIcon icon={ChevronLeftIcon} size={14} strokeWidth={2} />
                                <span>Prev</span>
                            </button>
                            <span className="text-xs text-slate-400 font-medium">
                                {skip + 1}–{skip + messages.length}
                            </span>
                            <button
                                disabled={!hasMore}
                                onClick={() => { const ns = skip + PAGE_SIZE; setSkip(ns); fetchMessages(folder, ns); }}
                                className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1 font-medium transition-colors ${
                                    !hasMore
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-sky-600 hover:bg-sky-50 active:bg-sky-100 cursor-pointer'
                                }`}
                            >
                                <span>Next</span>
                                <HugeiconsIcon icon={ChevronRightIcon} size={14} strokeWidth={2} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Message Body Pane */}
                <div className={`flex-1 bg-white flex flex-col overflow-y-auto ${
                    !selectedMsg ? 'hidden md:flex' : 'flex w-full'
                }`}>
                    {!selectedMsg ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 p-6">
                            <HugeiconsIcon icon={MailIcon} size={48} strokeWidth={1.5} className="opacity-30" />
                            <p className="text-sm font-medium text-slate-400">Select a message to read</p>
                        </div>
                    ) : (
                        <div className="flex flex-col min-h-full">
                            {/* Mobile Top Navigation Bar (Back to messages list) */}
                            <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0 sticky top-0 z-10">
                                <button
                                    onClick={() => setSelectedMsg(null)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 active:text-sky-800 transition-colors"
                                >
                                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2.5} />
                                    <span>Back to {currentFolderLabel}</span>
                                </button>
                                <a
                                    href="https://outlook.office.com/mail/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1"
                                >
                                    Outlook ↗
                                </a>
                            </div>

                            {/* Message content */}
                            <div className="p-4 sm:p-6 md:p-8 max-w-3xl w-full mx-auto flex-1 flex flex-col">
                                {/* Subject */}
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-3 sm:mb-4 break-words">
                                    {selectedMsg.subject || '(No subject)'}
                                </h1>

                                {/* Meta Box */}
                                <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm">
                                    <div className="flex flex-col gap-1.5 text-slate-600">
                                        <div className="flex flex-wrap items-baseline gap-x-1.5">
                                            <span className="font-semibold text-slate-700 shrink-0">From:</span>
                                            <span className="text-slate-900 font-medium break-all">
                                                {selectedMsg.from?.emailAddress?.name ? `${selectedMsg.from.emailAddress.name} ` : ''}
                                                <span className="text-slate-500 font-normal">&lt;{selectedMsg.from?.emailAddress?.address}&gt;</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-baseline gap-x-1.5">
                                            <span className="font-semibold text-slate-700 shrink-0">To:</span>
                                            <span className="text-slate-700 break-all">
                                                {(selectedMsg.toRecipients || []).map(r => r.emailAddress.name || r.emailAddress.address).join(', ') || 'Me'}
                                            </span>
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                            {new Date(selectedMsg.receivedDateTime || selectedMsg.sentDateTime || '').toLocaleString([], {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </div>
                                    </div>
                                    {selectedMsg.hasAttachments && (
                                        <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center gap-1.5 text-slate-600 text-xs">
                                            <HugeiconsIcon icon={AttachmentIcon} size={14} strokeWidth={2} className="text-slate-400 shrink-0" />
                                            <span>This email has attachments (open in Outlook to view)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Body Content */}
                                <div className="flex-1">
                                    {loadingMsg ? (
                                        <div className="text-slate-400 text-xs sm:text-sm flex gap-2 items-center py-6">
                                            <HugeiconsIcon icon={SpinnerIcon} size={16} strokeWidth={2} className="animate-spin text-sky-500" />
                                            <span>Loading message...</span>
                                        </div>
                                    ) : selectedMsg.body ? (
                                        selectedMsg.body.contentType === 'html' ? (
                                            <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
                                                <iframe
                                                    srcDoc={getSanitizedHtml(selectedMsg.body.content)}
                                                    className="w-full border-0 min-h-[350px] sm:min-h-[420px]"
                                                    sandbox="allow-same-origin"
                                                    onLoad={e => {
                                                        const frame = e.currentTarget;
                                                        const resize = () => {
                                                            try {
                                                                if (frame.contentDocument?.body) {
                                                                    frame.style.height = `${Math.max(350, frame.contentDocument.body.scrollHeight + 30)}px`;
                                                                }
                                                            } catch {}
                                                        };
                                                        resize();
                                                        setTimeout(resize, 350);
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
                                                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed break-words">
                                                    {stripHtml(selectedMsg.body.content)}
                                                </pre>
                                            </div>
                                        )
                                    ) : (
                                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200">
                                            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed break-words">
                                                {selectedMsg.bodyPreview}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Outlook link */}
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                                    <a
                                        href="https://outlook.office.com/mail/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs sm:text-sm text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>Open in Outlook 365</span>
                                        <span aria-hidden="true">→</span>
                                    </a>
                                    <button
                                        onClick={() => setSelectedMsg(null)}
                                        className="md:hidden text-xs text-slate-500 hover:text-slate-700 font-medium px-2.5 py-1 rounded bg-slate-100 active:bg-slate-200"
                                    >
                                        Back to list
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

