'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Mail01Icon as Mail,
    Shield01Icon as Shield,
    Book02Icon as Book,
    HeartPulseIcon as Heart,
    Chat01Icon as Chat,
    LibraryIcon as Library,
    Calendar01Icon as Calendar,
    Clock01Icon as Clock,
    UserIcon as User,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
    BellIcon as Bell,
    FileTypeIcon as FileText,
    CreditCardIcon as CreditCard,
    ChevronRightIcon as ChevronRight,
    Search01Icon as Search,
    CancelCircleIcon as XCircle,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { getStudentLifeData, getUnreadMessageCount } from './student-life-actions';
import MessagingPanel from '@/components/sis/student-life/MessagingPanel';
import ComplianceTracker from '@/components/sis/student-life/ComplianceTracker';
import LibraryPanel from '@/components/sis/student-life/LibraryPanel';
import HealthBookings from '@/components/sis/student-life/HealthBookings';

interface StudentLifeData {
    messages: any[];
    compliance: any[];
    library: any[];
    health: any[];
    unreadCount: number;
}

type SubPage = 'hub' | 'messages' | 'compliance' | 'library' | 'health';

interface StudentLifePageProps {
    studentId: string;
}

export default function StudentLifePage({ studentId }: StudentLifePageProps) {
    const [data, setData] = useState<StudentLifeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [subPage, setSubPage] = useState<SubPage>('hub');

    useEffect(() => {
        const fetchData = async () => {
            if (!studentId) return;
            setLoading(true);
            try {
                const result = await getStudentLifeData(studentId);
                if (result.success && result.data) {
                    setData(result.data);
                }
            } catch (e) {
                console.error('Error fetching student life data:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const navigateTo = (page: SubPage) => {
        setSubPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goBack = () => {
        setSubPage('hub');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full border-2 border-t-transparent border-slate-900 h-8 w-8"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12 text-slate-500">
                <p>Unable to load student life data.</p>
            </div>
        );
    }

    if (subPage === 'messages') {
        return <MessagingPanel messages={data.messages} unreadCount={data.unreadCount} onBack={goBack} studentId={studentId} />;
    }
    if (subPage === 'compliance') {
        return <ComplianceTracker items={data.compliance} onBack={goBack} studentId={studentId} />;
    }
    if (subPage === 'library') {
        return <LibraryPanel holds={data.library} onBack={goBack} studentId={studentId} />;
    }
    if (subPage === 'health') {
        return <HealthBookings bookings={data.health} onBack={goBack} studentId={studentId} />;
    }

    const features = [
        {
            id: 'messages' as SubPage,
            title: 'Campus Email & Messages',
            description: 'Communicate with faculty, staff, and administration. View announcements and direct messages.',
            icon: Mail,
            stats: `${data.unreadCount} unread messages`,
        },
        {
            id: 'compliance' as SubPage,
            title: 'Compliance Tracker',
            description: 'Track study permit, visa, and IRCC compliance requirements and deadlines.',
            icon: Shield,
            stats: `${data.compliance.filter(c => c.status === 'pending').length} pending items`,
        },
        {
            id: 'library' as SubPage,
            title: 'Library Account',
            description: 'Manage book holds, view borrowing history, and check account status.',
            icon: Book,
            stats: `${data.library.filter(h => h.status === 'active').length} active holds`,
        },
        {
            id: 'health' as SubPage,
            title: 'Health & Wellness',
            description: 'Book appointments with campus health, counseling, and academic advising services.',
            icon: Heart,
            stats: `${data.health.filter(b => b.status === 'scheduled').length} upcoming appointments`,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-white shadow-md">
                <h3 className="text-lg font-extrabold tracking-tight text-white">Student Life & Support</h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">Access campus services, messaging, and support resources.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map(feature => (
                    <button
                        key={feature.id}
                        type="button"
                        onClick={() => navigateTo(feature.id)}
                        className="w-full text-left p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                        <div className="flex items-start gap-3.5 mb-4">
                            <div className="p-2.5 bg-slate-900 rounded-lg text-white group-hover:bg-slate-800 transition-colors shrink-0">
                                <HugeiconsIcon icon={feature.icon} size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{feature.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{feature.stats}</span>
                            <div className="flex items-center text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                                <span>Open</span>
                                <HugeiconsIcon icon={ChevronRight} size={14} strokeWidth={2.5} className="ml-1" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
