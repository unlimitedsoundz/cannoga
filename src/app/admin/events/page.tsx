'use client';

import { createClient } from '@/utils/supabase/client';
import { Calendar, MapPin, Trash, PencilSimple as Edit, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { useState, useEffect } from 'react';

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchEvents = async () => {
        try {
            const { data } = await supabase
                .from('Event')
                .select('*')
                .order('date', { ascending: false });
            setEvents(data || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase.from('Event').delete().eq('id', id);
            if (error) throw error;
            setEvents(events.filter(e => e.id !== id));
        } catch (error: any) {
            alert("Error deleting event: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Manage Events</h1>
                <Link href="/admin/events/edit" className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-colors">
                    + New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#9c27b3] transition-colors group shadow-sm">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex flex-col items-center justify-center text-neutral-600 shadow-inner">
                                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-neutral-900">{event.title}</h3>
                                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 font-medium">
                                    <span className="flex items-center gap-1"><Calendar size={14} weight="bold" /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} weight="bold" /> {event.location || 'Online'}</span>
                                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold uppercase tracking-wider">{event.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/events/edit?id=${event.id}`} className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 shadow-sm" title="Edit">
                                <Edit size={18} weight="bold" />
                            </Link>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 border border-neutral-200 rounded-lg hover:bg-red-50 text-red-600 shadow-sm"
                                title="Delete"
                            >
                                <Trash size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <Calendar className="mx-auto mb-4 text-neutral-300" size={48} weight="regular" />
                        <h3 className="text-lg font-bold text-neutral-400 uppercase tracking-tight">No Events Found</h3>
                        <p className="text-neutral-400 text-sm mt-1 font-medium">Start by creating your first campus event.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

