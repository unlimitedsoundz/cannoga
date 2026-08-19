'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
    CreditCardIcon as CreditCard, 
    ArrowRightIcon as ArrowRight,
    File01Icon as FileText,
    CheckmarkCircle01Icon as CheckCircle,
    Download01Icon as Download,
    BankIcon,
    Menu01Icon as Menu,
    Cancel01Icon as XCircle,
    Search01Icon as Search,
    Mail01Icon as Mail,
    Notification03Icon as Bell,
    UserCircleIcon as User,
    Logout01Icon as LogOut,
    Delete02Icon as Trash
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { HeaderSearch } from '@/components/sis/HeaderSearch';
import { toast } from 'sonner';

interface InstitutionalInvoice {
    id: string;
    invoice_number: string;
    description: string;
    total: number;
    paid: number;
    balance: number;
    status: string;
    due_date?: string;
    action: string;
    application_id?: string;
    invoice_type?: string;
}

interface PaymentReceipt {
    receipt_number: string;
    payment_reference: string;
    channel: string;
    amount_cad: number;
    local_amount?: number | null;
    local_currency?: string | null;
    issued_at: string;
    payment_id: string;
    application_id?: string;
    pdf_url?: string;
}

const navItems = [
    { label: 'DASHBOARD', href: '/sis?page=dashboard' },
    { label: 'MY DOCUMENTS', href: '/sis?page=documents' },
    { label: 'ACADEMIC PROFILE', href: '/sis?page=academics' },
    { label: 'TIMETABLE', href: '/sis?page=timetable' },
    { label: 'REGISTRATION', href: '/sis?page=registration' },
    { label: 'PAYMENTS & INVOICES', href: '/sis/payments' },
    { label: 'FINANCIAL AID & PAY', href: '/sis?page=financials' },
    { label: 'TRANSCRIPTS & GRADES', href: '/sis?page=grades' },
    { label: 'HOLDS & TASKS', href: '/sis?page=holds' },
    { label: 'NEWS', href: '/sis?page=news' },
    { label: 'DIRECTORY', href: '/sis?page=directory' },
    { label: 'STUDENT LIFE & SUPPORT', href: '/sis?page=student-life' },
    { label: 'MY PROFILE', href: '/sis?page=profile' },
];

export default function PaymentsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [invoices, setInvoices] = useState<InstitutionalInvoice[]>([]);
    const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const pageNotifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFinancialData = async () => {
            setLoading(true);
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                    setProfile(prof);

                    const { data: stud } = await supabase.from('students').select('*').eq('user_id', user.id).maybeSingle();
                    setStudent(stud);
                }

                const [invRes, payRes] = await Promise.all([
                    fetch('/api/sis/student-invoices'),
                    fetch('/api/sis/student-payments')
                ]);

                if (invRes.ok) {
                    const invData = await invRes.json();
                    setInvoices(invData.invoices || []);
                }

                if (payRes.ok) {
                    const payData = await payRes.json();
                    setReceipts(payData.receipts || []);
                }
            } catch (error) {
                console.error('Error loading payments dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialData();
    }, []);

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        inv.description.toLowerCase().includes(search.toLowerCase()) ||
        inv.status.toLowerCase().includes(search.toLowerCase())
    );

    const filteredReceipts = receipts.filter(rec =>
        rec.receipt_number.toLowerCase().includes(search.toLowerCase()) ||
        rec.payment_reference.toLowerCase().includes(search.toLowerCase()) ||
        rec.channel.toLowerCase().includes(search.toLowerCase())
    );

    const totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paid || 0), 0);
    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

    const displayName = profile?.first_name || profile?.last_name
        ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
        : profile?.email || 'Student';
    const studentId = student?.student_id || profile?.student_id || 'N/A';

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center max-w-sm w-full text-center space-y-6">
                    <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-10 w-auto object-contain brightness-0 invert animate-pulse" />
                    <div className="relative flex items-center justify-center py-2">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-amber-500 animate-spin"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-b-white animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                    </div>
                    <p className="text-white text-xs font-medium animate-pulse">Loading payments ledger & verified documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans min-h-screen bg-[#f5f5f5] text-black" data-theme="sis">
            {/* TOP HEADER */}
            <header className="bg-[#0a151a] text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white focus:outline-none md:hidden cursor-pointer">
                            <HugeiconsIcon icon={Menu} size={20} strokeWidth={2} />
                        </button>
                        <Link href="/sis" className="flex items-center space-x-2.5 py-1 shrink-0 no-underline">
                            <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-9 w-auto object-contain brightness-0 invert" />
                            <div className="hidden sm:flex flex-col justify-center border-l border-slate-700 pl-3 py-0.5">
                                <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase leading-tight text-white">CANNOGA COLLEGE</span>
                                <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider leading-none mt-0.5">Student Portal</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 max-w-md relative hidden sm:block">
                        <HeaderSearch isAdmin={false} onNavigatePage={(pageId) => router.push(`/sis?page=${pageId}`)} />
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button type="button" onClick={() => router.push('/sis?page=student-life')} className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-center cursor-pointer" title="Messages">
                            <HugeiconsIcon icon={Mail} size={18} strokeWidth={2} />
                        </button>
                        <div ref={pageNotifRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center justify-center cursor-pointer"
                                title="Notifications"
                            >
                                <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} />
                            </button>
                        </div>
                        <div className="h-5 w-px bg-slate-800 mx-1"></div>
                        <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-800 p-1.5 rounded-lg transition" onClick={() => router.push('/sis?page=profile')}>
                            <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <HugeiconsIcon icon={User} size={14} strokeWidth={2.5} className="text-slate-300" />
                                )}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-xs font-semibold leading-tight text-slate-200">{displayName}</p>
                                <p className="text-[10px] text-slate-300 font-medium">{studentId}</p>
                            </div>
                        </div>
                        <div className="h-5 w-px bg-slate-800 mx-0.5"></div>
                        <button
                            type="button"
                            onClick={async () => {
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                toast.success('Signed out successfully');
                                setTimeout(() => {
                                    window.location.href = '/portal/account/login';
                                }, 1000);
                            }}
                            className="p-1.5 sm:px-2.5 sm:py-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition flex items-center space-x-1 font-bold text-xs cursor-pointer"
                            title="Sign Out"
                        >
                            <HugeiconsIcon icon={LogOut} size={17} strokeWidth={2.2} className="text-red-400" />
                            <span className="hidden sm:inline text-xs font-bold text-red-400">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* SECONDARY TABS */}
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto no-scrollbar text-xs font-medium text-slate-600 scroll-smooth">
                        {navItems.map(item => {
                            const isActive = item.label === 'PAYMENTS & INVOICES';
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`border-b-2 py-2 px-3 flex items-center transition whitespace-nowrap no-underline ${
                                        isActive ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* SIDEBAR + MAIN CONTENT */}
            <div className="flex flex-1 relative">
                {/* Backdrop */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900 bg-opacity-40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
                
                {/* Sidebar */}
                <aside className={`fixed md:sticky inset-y-0 md:top-16 left-0 w-60 bg-[#0a151a] text-slate-300 z-50 transform transition-transform duration-200 ease-in-out flex-shrink-0 flex flex-col justify-between border-r border-slate-800 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="p-4 space-y-1">
                        <div className="flex items-center justify-between md:hidden pb-3 mb-2 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                                <img src="/images/logo-cannoga.png" alt="Cannoga College" className="h-6 w-auto object-contain brightness-0 invert" />
                                <span className="font-bold text-white text-xs">Cannoga College</span>
                            </div>
                            <button type="button" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <HugeiconsIcon icon={XCircle} size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        <nav className="space-y-0.5">
                            {navItems.map(item => {
                                const isActive = item.label === 'PAYMENTS & INVOICES';
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition text-left no-underline ${
                                            isActive ? 'bg-slate-800 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-slate-800 space-y-3">
                        <button
                            type="button"
                            onClick={async () => {
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                toast.success('Signed out successfully');
                                setTimeout(() => {
                                    window.location.href = '/portal/account/login';
                                }, 1000);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-bold text-red-400 hover:text-red-300 hover:bg-slate-800 transition text-left cursor-pointer"
                        >
                            <HugeiconsIcon icon={LogOut} size={16} strokeWidth={2.2} className="text-red-400" />
                            <span>Sign Out</span>
                        </button>
                        <div className="text-[11px] text-slate-500">
                            Cannoga College Student Portal
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Header Banner */}
                    {/* Header Banner */}
                    <div className="bg-[#0a151a] p-6 shadow-xs text-white flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl">
                        <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-white">Payments &amp; Invoice Portal</h3>
                            <p className="text-xs text-slate-300 mt-1 font-medium">Review authoritative institutional invoices, download verified PDF receipts, and make tuition settlements.</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 bg-white shadow-xs rounded-2xl">
                            <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Total Invoiced</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">${totalInvoiced.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                        </div>
                        <div className="p-5 bg-white shadow-xs rounded-2xl">
                            <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Payments Settled</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">${totalPaid.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                        </div>
                        <div className="p-5 bg-white shadow-xs rounded-2xl">
                            <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Outstanding Balance</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">${totalBalance.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</p>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 shadow-xs rounded-2xl flex items-center gap-3">
                        <HugeiconsIcon icon={Search} size={18} className="text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search invoices, references, purpose, status, or receipt #..."
                            className="w-full text-xs font-medium text-slate-900 bg-transparent border-0 focus:outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* SECTION 1: Institutional Invoices Table */}
                    <div className="bg-white shadow-xs rounded-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50">
                            <h3 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">Institutional Invoices</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-3.5">Invoice #</th>
                                        <th className="p-3.5">Description / Purpose</th>
                                        <th className="p-3.5 text-right">Total</th>
                                        <th className="p-3.5 text-right">Paid</th>
                                        <th className="p-3.5 text-right">Balance</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((inv) => (
                                             <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-3.5 font-mono font-bold text-slate-900 text-xs">{inv.invoice_number}</td>
                                                <td className="p-3.5">
                                                    <span className="font-medium text-slate-900 text-xs">{inv.description}</span>
                                                    {inv.due_date && (
                                                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {new Date(inv.due_date).toLocaleDateString('en-CA')}</p>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-xs">${Number(inv.total).toFixed(2)} CAD</td>
                                                <td className="p-3.5 text-right font-mono font-semibold text-slate-900 text-xs">${Number(inv.paid).toFixed(2)} CAD</td>
                                                <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-xs">
                                                    <span>
                                                        ${Number(inv.balance).toFixed(2)} CAD
                                                    </span>
                                                </td>
                                                <td className="p-3.5">
                                                    <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full ${inv.status === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-right whitespace-nowrap">
                                                    {inv.balance <= 0 ? (
                                                        <span className="text-xs font-bold text-emerald-600">
                                                            ✓ Settled
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                if (inv.application_id) {
                                                                    router.push(`/portal/application/payment?id=${inv.application_id}`);
                                                                } else {
                                                                    router.push('/portal/dashboard');
                                                                }
                                                            }}
                                                            className="inline-block text-[11px] font-bold px-3.5 py-1.5 bg-[#0a151a] hover:bg-slate-800 text-white transition shadow-xs rounded-lg cursor-pointer"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={7} className="p-6 text-center text-slate-500 font-medium text-xs">No institutional invoices on record</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SECTION 2: Official Payment Receipts Table */}
                    <div className="bg-white shadow-xs rounded-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50">
                            <h3 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">Official Payment Receipts</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-3.5">Receipt #</th>
                                        <th className="p-3.5">Payment Reference</th>
                                        <th className="p-3.5">Country &amp; Channel</th>
                                        <th className="p-3.5 text-right">Amount</th>
                                        <th className="p-3.5">Issued At</th>
                                        <th className="p-3.5 text-right">Document</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredReceipts.length > 0 ? (
                                        filteredReceipts.map((r) => (
                                            <tr key={r.receipt_number} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-3.5 font-mono font-bold text-slate-900 text-xs">{r.receipt_number}</td>
                                                <td className="p-3.5 font-mono text-[11px] text-slate-700">{r.payment_reference}</td>
                                                <td className="p-3.5 font-medium text-slate-800 text-xs">{r.channel}</td>
                                                <td className="p-3.5 text-right">
                                                    <p className="font-mono font-bold text-slate-900 text-xs">${Number(r.amount_cad).toFixed(2)} CAD</p>
                                                    {r.local_amount && r.local_currency && (
                                                        <p className="text-[10px] font-mono text-slate-500">
                                                            ({r.local_currency} {Number(r.local_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })})
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-3.5 text-slate-600 text-xs">{new Date(r.issued_at).toLocaleDateString('en-CA')}</td>
                                                <td className="p-3.5 text-right whitespace-nowrap">
                                                    <a
                                                        href={r.pdf_url || `/api/portal/receipt/pdf?paymentId=${r.payment_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block text-[11px] font-bold px-3.5 py-1.5 bg-[#0a151a] hover:bg-slate-800 text-white transition shadow-xs rounded-lg cursor-pointer no-underline"
                                                    >
                                                        View Receipt
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="p-6 text-center text-slate-500 font-medium text-xs">No verified official receipts found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}