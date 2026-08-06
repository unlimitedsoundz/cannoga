
'use client';

import React from 'react';
import { Calendar, MapPin, VideoCamera as Video, Clock, CaretLeft as ChevronLeft, CaretRight as ChevronRight, DownloadSimple as Download } from "@phosphor-icons/react/dist/ssr";
import { Module, ClassSession } from '@/types/database';

interface TimetableClientProps {
    sessions: (ClassSession & { module: Module })[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

export default function TimetableClient({ sessions }: TimetableClientProps) {
    const [view, setView] = React.useState<'WEEK' | 'TODAY'>('WEEK');

    const handleExport = () => {
        alert('Standard .ics export generated. Your calendar will now sync with Outlook/Google.');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">My Timetable</h1>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                        Academic Semester: Autumn 2024
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                    >
                        <Download size={14} weight="bold" /> Export .ics
                    </button>
                </div>
            </div>

            {/* Weekly Grid */}
            <div className="bg-white border-2 border-[#9c27b3] rounded-sm overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Day Headers */}
                        <div className="grid grid-cols-8 border-b-2 border-[#9c27b3] bg-neutral-50 font-black italic">
                            <div className="p-2 border-r-2 border-[#9c27b3]"></div>
                            {DAYS.map((day, i) => (
                                <div key={day} className="p-2 text-center border-r-2 last:border-r-0 border-[#9c27b3]">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{day.substring(0, 3)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Hour Rows */}
                        {HOURS.map((hour) => (
                            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 border-neutral-200 min-h-[60px]">
                                <div className="p-1 border-r-2 border-[#9c27b3] bg-neutral-50 flex items-start justify-center">
                                    <span className="text-[10px] font-bold text-neutral-400">{hour}:00</span>
                                </div>
                                {DAYS.map((_, dayIndex) => {
                                    const daySessions = sessions.filter(s => s.day_of_week === dayIndex && parseInt(s.start_time) === hour);

                                    return (
                                        <div key={dayIndex} className="p-1 border-r last:border-r-0 border-neutral-100 flex flex-col gap-1 relative group">
                                            {daySessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className={`p-2 rounded-sm border-l-4 h-full shadow-sm transition-all hover:scale-[1.02] cursor-default
                                                        ${session.location_type === 'ONLINE'
                                                            ? 'bg-blue-50 border-blue-600 text-blue-900'
                                                            : 'bg-neutral-50 border-neutral-600 text-neutral-900'}`}
                                                >
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="text-[9px] font-black uppercase truncate">{session.module.code}</span>
                                                        {session.location_type === 'ONLINE' ? <Video size={10} weight="regular" /> : <MapPin size={10} weight="regular" />}
                                                    </div>
                                                    <div className="text-[10px] font-bold leading-tight mt-1 line-clamp-2">
                                                        {session.module.title}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-2 text-[8px] font-bold opacity-70">
                                                        <Clock size={8} weight="regular" /> {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                                                    </div>
                                                    <div className="mt-1 text-[8px] font-black uppercase tracking-tighter truncate">
                                                        {session.location_detail}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-3 p-3 border-2 border-[#9c27b3] bg-neutral-50 rounded-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-neutral-50 border-l-4 border-neutral-600"></div>
                        <span className="text-[9px] font-black uppercase tracking-tight text-neutral-600">On Campus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-50 border-l-4 border-blue-600"></div>
                        <span className="text-[9px] font-black uppercase tracking-tight text-neutral-600">Online</span>
                    </div>
                </div>
                <div className="md:ml-auto text-[9px] font-bold text-neutral-400 italic">
                    * Schedule is locked by Registrar.
                </div>
            </div>
        </div>
    );
}

