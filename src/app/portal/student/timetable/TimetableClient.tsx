'use client';

import React from 'react';
import { Calendar, MapPin, VideoCamera as Video, Clock, CaretLeft as ChevronLeft, CaretRight as ChevronRight, DownloadSimple as Download } from "@phosphor-icons/react/dist/ssr";
import { TimetableAssignment, Module, Room } from '@/types/database';

interface SessionRow extends TimetableAssignment {
  module: { code: string; title: string; credits: number } | null;
  room: Room | null;
  instructor: { first_name: string; last_name: string } | null;
  section: { session_type: string; delivery_mode: string; module: { code: string; title: string; credits: number } | null } | null;
}

interface TimetableClientProps {
    sessions: SessionRow[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

export default function TimetableClient({ sessions }: TimetableClientProps) {
    const [view, setView] = React.useState<'WEEK' | 'TODAY'>('WEEK');
    const [weekOffset, setWeekOffset] = React.useState(0);

    const getWeekDates = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const weekDates = getWeekDates();
    const todayStr = new Date().toISOString().split('T')[0];

    const handleExport = () => {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cannoga College//Timetable//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';
        
        sessions.forEach(session => {
            const dateStr = session.start_date.replace(/-/g, '');
            const startTime = session.start_time.replace(/:/g, '') + '00';
            const endTime = session.end_time.replace(/:/g, '') + '00';
            const subjectName = session.section?.module?.title || 'Class';
            const location = session.room ? `${session.room.name}${session.room.building ? ', ' + session.room.building : ''}` : 'TBD';
            
            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `DTSTART:${dateStr}T${startTime}\n`;
            icsContent += `DTEND:${dateStr}T${endTime}\n`;
            icsContent += `SUMMARY:${subjectName}\n`;
            icsContent += `LOCATION:${location}\n`;
            icsContent += 'END:VEVENT\n';
        });

        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'timetable.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getSessionDate = (session: SessionRow, dayIndex: number) => {
        const weekStart = weekDates[0];
        const sessionDate = new Date(weekStart);
        sessionDate.setDate(weekStart.getDate() + dayIndex);
        return sessionDate.toISOString().split('T')[0];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">My Timetable</h1>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                        Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setWeekOffset(w => w - 1)}
                        className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"
                    >
                        <ChevronLeft size={16} weight="bold" />
                    </button>
                    <button
                        onClick={() => setWeekOffset(0)}
                        className="px-3 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setWeekOffset(w => w + 1)}
                        className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"
                    >
                        <ChevronRight size={16} weight="bold" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                    >
                        <Download size={14} weight="bold" /> Export .ics
                    </button>
                </div>
            </div>

            {sessions.length === 0 ? (
                <div className="bg-white border-2 border-neutral-200 rounded-sm p-12 text-center">
                    <Calendar size={48} weight="thin" className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">No timetable entries yet</p>
                    <p className="text-xs text-neutral-400 mt-2">Your class schedule will appear here once enrolled.</p>
                </div>
            ) : (
                <div className="bg-white border-2 border-[#9c27b3] rounded-sm overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-8 border-b-2 border-[#9c27b3] bg-neutral-50 font-black italic">
                                <div className="p-2 border-r-2 border-[#9c27b3]"></div>
                                {DAYS.slice(0, 5).map((day, i) => {
                                    const date = weekDates[i];
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    return (
                                        <div key={day} className={`p-2 text-center border-r-2 last:border-r-0 border-[#9c27b3] ${isToday ? 'bg-[#9c27b3] text-white' : ''}`}>
                                            <span className="text-[10px] font-black uppercase tracking-widest block">{day.substring(0, 3)}</span>
                                            <span className={`text-xs font-bold ${isToday ? 'text-white' : 'text-neutral-600'}`}>{date.getDate()}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {HOURS.map(hour => (
                                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 border-neutral-200 min-h-[60px]">
                                    <div className="p-1 border-r-2 border-[#9c27b3] bg-neutral-50 flex items-start justify-center">
                                        <span className="text-[10px] font-bold text-neutral-400">{hour}:00</span>
                                    </div>
                                    {DAYS.slice(0, 5).map((_, dayIndex) => {
                                        const dayDate = weekDates[dayIndex];
                                        const dateStr = dayDate.toISOString().split('T')[0];
                                        const daySessions = sessions.filter(s => {
                                            return s.day_of_week === dayIndex + 1 && parseInt(s.start_time.split(':')[0]) === hour;
                                        });

                                        return (
                                            <div key={dayIndex} className="p-1 border-r last:border-r-0 border-neutral-100 flex flex-col gap-1 relative">
                                                {daySessions.map(session => (
                                                    <div
                                                        key={session.id}
                                                        className="p-2.5 rounded-2xl bg-blue-600 border border-blue-500 shadow-md text-white transition-all hover:scale-[1.02] cursor-default"
                                                    >
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="text-[10px] font-black uppercase text-blue-200 truncate">{session.section?.module?.code}</span>
                                                            {(session.section?.delivery_mode === 'ONLINE' || session.section?.session_type === 'ONLINE') ? <Video size={10} className="text-blue-200" weight="regular" /> : <MapPin size={10} className="text-blue-200" weight="regular" />}
                                                        </div>
                                                        <div className="text-xs font-bold leading-tight mt-1 text-white line-clamp-2">
                                                            {session.section?.module?.title}
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1 text-[9px] font-medium text-blue-100">
                                                            <Clock size={10} className="text-blue-200" weight="regular" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                                                        </div>
                                                        {session.room && (
                                                            <div className="mt-1 text-[9px] font-black uppercase tracking-tighter text-blue-200 truncate">
                                                                {session.room.name}{session.room.building ? `, ${session.room.building}` : ''}
                                                            </div>
                                                        )}
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
            )}

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
                    * Schedule is managed by Registrar.
                </div>
            </div>
        </div>
    );
}
