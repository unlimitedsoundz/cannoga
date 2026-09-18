'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ background: '#0a151a', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 12, height: 52 }}>
                <Link href="/sis/" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
                    <HugeiconsIcon icon={BackIcon} size={16} strokeWidth={2} />
                    Back to SIS
                </Link>
                <span style={{ color: '#334155', fontSize: 16 }}>|</span>
                <HugeiconsIcon icon={MailIcon} size={18} strokeWidth={2} style={{ color: '#60a5fa' }} />
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>Student Mail</span>
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>— Microsoft 365</span>
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        onClick={() => { fetchMessages(folder, skip); fetchCounts(); }}
                        style={{ background: 'transparent', border: '1px solid #1e3a47', borderRadius: 6, padding: '5px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <HugeiconsIcon icon={RefreshIcon} size={13} strokeWidth={2} />
                        Refresh
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', height: 'calc(100vh - 52px)' }}>
                {/* Sidebar */}
                <div style={{ width: 200, background: 'white', borderRight: '1px solid #e2e8f0', padding: '12px 0', flexShrink: 0 }}>
                    {FOLDERS.map(f => {
                        const count = folderCounts[f.id] || 0;
                        const active = folder === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => { setFolder(f.id); setSkip(0); }}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 16px', background: active ? '#f0f9ff' : 'transparent',
                                    borderLeft: active ? '3px solid #0ea5e9' : '3px solid transparent',
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                    fontSize: 13, fontWeight: active ? 700 : 500,
                                    color: active ? '#0369a1' : '#475569',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <HugeiconsIcon icon={f.icon} size={16} strokeWidth={active ? 2.5 : 2} />
                                <span style={{ flex: 1 }}>{f.label}</span>
                                {count > 0 && (
                                    <span style={{
                                        background: active ? '#0ea5e9' : '#e2e8f0',
                                        color: active ? 'white' : '#475569',
                                        fontSize: 10, fontWeight: 700, padding: '1px 6px',
                                        borderRadius: 999, minWidth: 20, textAlign: 'center',
                                    }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Message list */}
                <div style={{ width: 340, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    {/* Folder title */}
                    <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                            {FOLDERS.find(f => f.id === folder)?.label}
                        </h2>
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
                            {messages.length} message{messages.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Message list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 10, color: '#94a3b8' }}>
                                <HugeiconsIcon icon={SpinnerIcon} size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ fontSize: 13 }}>Loading messages...</span>
                            </div>
                        ) : needsReauth ? (
                            <div style={{ padding: 24 }}>
                                <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                                    <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#92400e' }}>🔒 Admin Approval Required</p>
                                    <p style={{ margin: 0, fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
                                        Your Microsoft 365 tenant requires an admin to approve mail access for this app.
                                        Ask your IT administrator to visit the link below and click <strong>Accept</strong>:
                                    </p>
                                </div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin consent URL</p>
                                <code style={{ display: 'block', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 10px', fontSize: 11, color: '#0f172a', wordBreak: 'break-all', marginBottom: 16 }}>
                                    https://login.microsoftonline.com/559051ae-ebf4-496a-8dbb-128aac57d721/adminconsent?client_id=5548838a-7cd2-4be6-9f5d-116f8e8a200f
                                </code>
                                <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                                    Once the admin approves, students sign out and sign back in with Microsoft 365.
                                    Mail access will then work automatically.
                                </p>
                            </div>
                        ) : error ? (
                            <div style={{ padding: 24, textAlign: 'center' }}>
                                <p style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>{error}</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                                No messages in {FOLDERS.find(f => f.id === folder)?.label}
                            </div>
                        ) : (
                            messages.map(msg => {
                                const active = selectedMsg?.id === msg.id;
                                return (
                                    <button
                                        key={msg.id}
                                        onClick={() => openMessage(msg)}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '10px 14px',
                                            borderBottom: '1px solid #f8fafc',
                                            background: active ? '#eff6ff' : msg.isRead ? 'white' : '#f8fafc',
                                            borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                                            cursor: 'pointer', border: 'none',
                                            transition: 'background 0.1s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                            <div style={{ paddingTop: 2, flexShrink: 0 }}>
                                                <div style={{
                                                    width: 7, height: 7, borderRadius: '50%',
                                                    background: msg.isRead ? '#cbd5e1' : '#3b82f6',
                                                    marginTop: 3,
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                                    <span style={{ fontSize: 12, fontWeight: msg.isRead ? 500 : 700, color: '#0f172a', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {msg.from?.emailAddress?.name || msg.from?.emailAddress?.address}
                                                    </span>
                                                    <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0 }}>{formatDate(msg.receivedDateTime)}</span>
                                                </div>
                                                <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: msg.isRead ? 500 : 600, color: msg.isRead ? '#475569' : '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {msg.subject || '(No subject)'}
                                                </p>
                                                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {msg.bodyPreview}
                                                </p>
                                                <div style={{ display: 'flex', gap: 4, marginTop: 3, alignItems: 'center' }}>
                                                    {msg.importance === 'high' && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>● HIGH</span>}
                                                    {msg.flag?.flagStatus === 'flagged' && <span style={{ fontSize: 10, color: '#f59e0b' }}>🚩</span>}
                                                    {msg.hasAttachments && <span style={{ fontSize: 10, color: '#64748b' }}>📎</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}

                        {/* Pagination */}
                        {!loading && !error && messages.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    disabled={skip === 0}
                                    onClick={() => { const ns = Math.max(0, skip - PAGE_SIZE); setSkip(ns); fetchMessages(folder, ns); }}
                                    style={{ fontSize: 11, color: skip === 0 ? '#cbd5e1' : '#0ea5e9', background: 'none', border: 'none', cursor: skip === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                                >
                                    <HugeiconsIcon icon={ChevronLeftIcon} size={13} strokeWidth={2} /> Prev
                                </button>
                                <span style={{ fontSize: 10, color: '#94a3b8' }}>{skip + 1}–{skip + messages.length}</span>
                                <button
                                    disabled={!hasMore}
                                    onClick={() => { const ns = skip + PAGE_SIZE; setSkip(ns); fetchMessages(folder, ns); }}
                                    style={{ fontSize: 11, color: !hasMore ? '#cbd5e1' : '#0ea5e9', background: 'none', border: 'none', cursor: !hasMore ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                                >
                                    Next <HugeiconsIcon icon={ChevronRightIcon} size={13} strokeWidth={2} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message body */}
                <div style={{ flex: 1, overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    {!selectedMsg ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', gap: 12 }}>
                            <HugeiconsIcon icon={MailIcon} size={48} strokeWidth={1.5} style={{ opacity: 0.3 }} />
                            <p style={{ margin: 0, fontSize: 14 }}>Select a message to read</p>
                        </div>
                    ) : (
                        <div style={{ padding: '24px 32px', maxWidth: 760 }}>
                            {/* Subject */}
                            <h1 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                                {selectedMsg.subject || '(No subject)'}
                            </h1>

                            {/* Meta */}
                            <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', color: '#475569' }}>
                                    <div><span style={{ fontWeight: 600 }}>From: </span>{selectedMsg.from?.emailAddress?.name} &lt;{selectedMsg.from?.emailAddress?.address}&gt;</div>
                                    <div><span style={{ fontWeight: 600 }}>To: </span>{(selectedMsg.toRecipients || []).map(r => r.emailAddress.name || r.emailAddress.address).join(', ')}</div>
                                    <div style={{ color: '#94a3b8' }}>
                                        {new Date(selectedMsg.receivedDateTime || selectedMsg.sentDateTime || '').toLocaleString()}
                                    </div>
                                </div>
                                {selectedMsg.hasAttachments && (
                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                                        <HugeiconsIcon icon={AttachmentIcon} size={14} strokeWidth={2} />
                                        This email has attachments (open in Outlook to view)
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            {loadingMsg ? (
                                <div style={{ color: '#94a3b8', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <HugeiconsIcon icon={SpinnerIcon} size={16} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
                                    Loading message...
                                </div>
                            ) : selectedMsg.body ? (
                                selectedMsg.body.contentType === 'html' ? (
                                    <iframe
                                        srcDoc={selectedMsg.body.content}
                                        style={{ width: '100%', border: 'none', borderRadius: 8, background: 'white', minHeight: 400 }}
                                        sandbox="allow-same-origin"
                                        onLoad={e => {
                                            const frame = e.currentTarget;
                                            try {
                                                frame.style.height = (frame.contentDocument?.body?.scrollHeight || 400) + 'px';
                                            } catch {}
                                        }}
                                    />
                                ) : (
                                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, color: '#1e293b', lineHeight: 1.7 }}>
                                        {stripHtml(selectedMsg.body.content)}
                                    </pre>
                                )
                            ) : (
                                <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>{selectedMsg.bodyPreview}</p>
                            )}

                            {/* Open in Outlook */}
                            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                                <a
                                    href="https://outlook.office.com/mail/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}
                                >
                                    Open in Outlook 365 →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                button:hover { opacity: 0.9; }
            `}</style>
        </div>
    );
}
