'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Shield01Icon as Shield,
    CheckmarkCircle01Icon as CheckCircle,
    Clock01Icon as Clock,
    UserWarning02Icon as Warning,
    XCircle as XCircle,
    FileTypeIcon as FileText,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { updateComplianceTracker } from '@/app/sis/student-life-actions';

interface ComplianceItem {
    id: string;
    tracker_type: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    document_url: string;
    notes: string;
}

interface ComplianceTrackerProps {
    items: ComplianceItem[];
    onBack: () => void;
    studentId: string;
}

export default function ComplianceTracker({ items, onBack, studentId }: ComplianceTrackerProps) {
    const [localItems, setLocalItems] = useState<ComplianceItem[]>(items);
    const [updating, setUpdating] = useState<string | null>(null);

    React.useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'in_progress': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'overdue': return 'text-red-700 bg-red-50 border-red-200';
            default: return 'text-slate-700 bg-slate-100 border-slate-200';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'STUDY_PERMIT': return 'Study Permit';
            case 'VISA': return 'Visa';
            case 'IRCC': return 'IRCC Compliance';
            case 'HEALTH_INSURANCE': return 'Health Insurance';
            case 'TAX': return 'Tax Document';
            default: return type.replace(/_/g, ' ');
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'STUDY_PERMIT':
            case 'VISA':
            case 'IRCC':
                return Shield;
            case 'HEALTH_INSURANCE':
                return CheckCircle;
            case 'TAX':
                return FileText;
            default:
                return FileText;
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'No date';
        return new Date(dateStr).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isOverdue = (dateStr: string, status: string) => {
        if (!dateStr || status === 'completed') return false;
        return new Date(dateStr) < new Date();
    };

    const handleMarkComplete = async (id: string) => {
        setUpdating(id);
        try {
            const result = await updateComplianceTracker(id, { status: 'completed' });
            if (result.success) {
                toast.success('Marked as completed');
                setLocalItems(prev => prev.map(item => item.id === id ? { ...item, status: 'completed' } : item));
            } else {
                toast.error(result.error || 'Failed to update');
            }
        } finally {
            setUpdating(null);
        }
    };

    const handleMarkInProgress = async (id: string) => {
        setUpdating(id);
        try {
            const result = await updateComplianceTracker(id, { status: 'in_progress' });
            if (result.success) {
                toast.success('Updated to in progress');
                setLocalItems(prev => prev.map(item => item.id === id ? { ...item, status: 'in_progress' } : item));
            } else {
                toast.error(result.error || 'Failed to update');
            }
        } finally {
            setUpdating(null);
        }
    };

    const pendingItems = localItems.filter(i => i.status !== 'completed');
    const completedItems = localItems.filter(i => i.status === 'completed');

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={onBack} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                    <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Back to Student Life
                </button>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <HugeiconsIcon icon={Shield} size={20} strokeWidth={2} className="text-slate-700" />
                    <h4 className="font-bold text-slate-900 text-sm">Compliance Tracker</h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">Track your study permit, visa, and IRCC compliance requirements.</p>

                {pendingItems.length > 0 && (
                    <div className="mb-6">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Pending & In Progress</h5>
                        <div className="space-y-3">
                            {pendingItems.map(item => {
                                const overdue = isOverdue(item.due_date, item.status);
                                return (
                                    <div key={item.id} className={`p-4 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 ${overdue ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${overdue ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                                                <HugeiconsIcon icon={getTypeIcon(item.tracker_type)} size={16} strokeWidth={2} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase">{getTypeLabel(item.tracker_type)}</span>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>{item.status.replace(/_/g, ' ')}</span>
                                                    {overdue && <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5"><HugeiconsIcon icon={Warning} size={12} strokeWidth={2} /> Overdue</span>}
                                                </div>
                                                <h6 className="font-bold text-slate-900 text-xs">{item.title}</h6>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <HugeiconsIcon icon={Clock} size={12} strokeWidth={2} /> Due: {formatDate(item.due_date)}
                                                    </span>
                                                    {item.document_url && (
                                                        <a href={item.document_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold text-slate-700 hover:underline flex items-center gap-1">
                                                            <HugeiconsIcon icon={FileText} size={12} strokeWidth={2} /> View Document
                                                        </a>
                                                    )}
                                                </div>
                                                {item.notes && <p className="text-[10px] text-slate-400 mt-1 italic">{item.notes}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:ml-4">
                                            {item.status === 'pending' && (
                                                <button type="button" onClick={() => handleMarkInProgress(item.id)} disabled={updating === item.id} className="text-[11px] font-bold px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">
                                                    Start
                                                </button>
                                            )}
                                            {item.status === 'in_progress' && (
                                                <button type="button" onClick={() => handleMarkComplete(item.id)} disabled={updating === item.id} className="text-[11px] font-bold px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50">
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {pendingItems.length === 0 && (
                                <div className="text-center py-6 text-xs text-slate-500">No pending compliance items.</div>
                            )}
                        </div>
                    </div>
                )}

                {completedItems.length > 0 && (
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Completed</h5>
                        <div className="space-y-2">
                            {completedItems.map(item => (
                                <div key={item.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={CheckCircle} size={14} strokeWidth={2} className="text-emerald-600" />
                                        <span className="text-xs font-medium text-slate-800">{item.title}</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
