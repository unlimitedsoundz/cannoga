'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    HeartPulseIcon as Heart,
    Calendar01Icon as Calendar,
    Clock01Icon as Clock,
    UserIcon as User,
    XCircle as XCircle,
    CheckmarkCircle01Icon as CheckCircle,
    UserWarning02Icon as Warning,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { bookAppointment, cancelBooking, getHealthBookings } from '@/app/sis/student-life-actions';

interface HealthBooking {
    id: string;
    booking_type: string;
    provider_name: string;
    appointment_date: string;
    appointment_time: string;
    location: string;
    status: string;
    notes: string;
}

interface HealthBookingsProps {
    bookings: HealthBooking[];
    onBack: () => void;
    studentId: string;
}

export default function HealthBookings({ bookings, onBack, studentId }: HealthBookingsProps) {
    const [localBookings, setLocalBookings] = useState<HealthBooking[]>(bookings);
    const [showForm, setShowForm] = useState(false);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [form, setForm] = useState({ bookingType: 'counseling', providerName: '', appointmentDate: '', appointmentTime: '', location: '', notes: '' });

    React.useEffect(() => {
        setLocalBookings(bookings);
    }, [bookings]);

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await bookAppointment({
                studentId,
                bookingType: form.bookingType,
                providerName: form.providerName,
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime,
                location: form.location || undefined,
                notes: form.notes || undefined,
            });
            if (result.success) {
                toast.success('Appointment booked successfully');
                setForm({ bookingType: 'counseling', providerName: '', appointmentDate: '', appointmentTime: '', location: '', notes: '' });
                setShowForm(false);
                const refreshed = await getHealthBookings(studentId);
                if (refreshed.success) setLocalBookings(refreshed.data);
            } else {
                toast.error(result.error || 'Failed to book appointment');
            }
        } catch (e) {
            toast.error('Failed to book appointment');
        }
    };

    const handleCancel = async (id: string) => {
        setCancelling(id);
        try {
            const result = await cancelBooking(id);
            if (result.success) {
                toast.success('Appointment cancelled');
                setLocalBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
            } else {
                toast.error(result.error || 'Failed to cancel appointment');
            }
        } finally {
            setCancelling(null);
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'counseling': return 'Counseling';
            case 'health': return 'Health Services';
            case 'advising': return 'Academic Advising';
            case 'wellness': return 'Wellness';
            default: return type.replace(/_/g, ' ');
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'counseling': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'health': return 'bg-red-50 text-red-700 border-red-200';
            case 'advising': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'wellness': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const isPast = (dateStr: string) => {
        const appointmentDate = new Date(dateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return appointmentDate < now;
    };

    const upcomingBookings = localBookings.filter(b => b.status === 'scheduled' && !isPast(b.appointment_date));
    const pastBookings = localBookings.filter(b => b.status === 'cancelled' || isPast(b.appointment_date));

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={onBack} className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                    <HugeiconsIcon icon={XCircle} size={14} strokeWidth={2} /> Back to Student Life
                </button>
                <button type="button" onClick={() => setShowForm(!showForm)} className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar} size={14} strokeWidth={2} /> Book Appointment
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
                    <h4 className="font-bold text-slate-900 text-sm mb-4">Book an Appointment</h4>
                    <form onSubmit={handleBook} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Service Type</label>
                                <select
                                    value={form.bookingType}
                                    onChange={e => setForm({ ...form, bookingType: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                >
                                    <option value="counseling">Counseling</option>
                                    <option value="health">Health Services</option>
                                    <option value="advising">Academic Advising</option>
                                    <option value="wellness">Wellness</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Provider / Counselor</label>
                                <input
                                    type="text"
                                    value={form.providerName}
                                    onChange={e => setForm({ ...form, providerName: e.target.value })}
                                    placeholder="e.g., Dr. Smith"
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={form.appointmentDate}
                                    onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={form.appointmentTime}
                                    onChange={e => setForm({ ...form, appointmentTime: e.target.value })}
                                    className="w-full border border-slate-300 rounded p-2 text-xs"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Location (Optional)</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="e.g., Student Services Building, Room 204"
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes (Optional)</label>
                            <textarea
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                rows={2}
                                className="w-full border border-slate-300 rounded p-2 text-xs"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowForm(false)} className="text-xs font-medium px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50">Cancel</button>
                            <button type="submit" className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded">Book Appointment</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={Heart} size={18} strokeWidth={2} className="text-slate-700" />
                        <h4 className="font-bold text-slate-900 text-sm">Health & Wellness Bookings</h4>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{upcomingBookings.length} upcoming</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {upcomingBookings.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-500">No upcoming appointments. Book one to get started.</div>
                    ) : (
                        upcomingBookings.map(booking => (
                            <div key={booking.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${getTypeColor(booking.booking_type)}`}>
                                        <HugeiconsIcon icon={Heart} size={14} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeColor(booking.booking_type)}`}>{getTypeLabel(booking.booking_type)}</span>
                                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                <HugeiconsIcon icon={CheckCircle} size={12} strokeWidth={2} /> Scheduled
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-slate-900 text-xs">{booking.provider_name}</h5>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <HugeiconsIcon icon={Calendar} size={12} strokeWidth={2} /> {formatDate(booking.appointment_date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <HugeiconsIcon icon={Clock} size={12} strokeWidth={2} /> {formatTime(booking.appointment_time)}
                                            </span>
                                        </p>
                                        {booking.location && <p className="text-[10px] text-slate-400 mt-0.5">{booking.location}</p>}
                                        {booking.notes && <p className="text-[10px] text-slate-400 mt-0.5 italic">{booking.notes}</p>}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCancel(booking.id)}
                                    disabled={cancelling === booking.id}
                                    className="text-[11px] font-medium px-3 py-1.5 border border-red-300 text-red-700 rounded hover:bg-red-50 disabled:opacity-50 self-start md:self-center"
                                >
                                    {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {pastBookings.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm">Past Appointments</h4>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {pastBookings.map(booking => (
                            <div key={booking.id} className="p-4 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="font-medium text-slate-700 text-xs">{booking.provider_name}</h5>
                                        <p className="text-[11px] text-slate-500">{getTypeLabel(booking.booking_type)} - {formatDate(booking.appointment_date)}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500">{booking.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
