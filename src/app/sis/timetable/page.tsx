'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar, DownloadSimple as Download, MapPin, VideoCamera as Video, Clock, CaretLeft as ChevronLeft, CaretRight as ChevronRight } from '@phosphor-icons/react/dist/ssr';
import { ClassSession, Subject } from '@/types/database';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

export default function StudentTimetablePage() {
  const [sessions, setSessions] = useState<(ClassSession & { subject: Subject; instructor?: { first_name: string; last_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: student } = await supabase
        .from('students')
        .select('id, program_id, current_semester_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!student) throw new Error('Student record not found');

      const { data: subjects } = await supabase
        .from('Subject')
        .select('id')
        .eq('courseId', student.program_id);

      const subjectIds = subjects?.map((s: { id: string }) => s.id) || [];

      if (subjectIds.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('class_sessions')
        .select(`
          *,
          subject:Subject(id, name, code, creditUnits),
          instructor:profiles!class_sessions_instructor_id_fkey(first_name, last_name)
        `)
        .in('subject_id', subjectIds)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (student.current_semester_id) {
        query = query.eq('semester_id', student.current_semester_id);
      }

      const { data: sessionsData, error } = await query;

      if (error) throw error;
      setSessions(sessionsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

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
  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.session_date);
    return weekDates.some(d => d.toDateString() === sessionDate.toDateString());
  });

  const handleExport = () => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cannoga College//Timetable//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';
    
    sessions.forEach(session => {
      const dateStr = session.session_date.replace(/-/g, '');
      const startTime = session.start_time.replace(/:/g, '') + '00';
      const endTime = session.end_time.replace(/:/g, '') + '00';
      const subjectName = session.subject?.name || 'Class';
      const location = session.room ? `${session.room}${session.building ? ', ' + session.building : ''}` : 'TBD';
      const instructor = session.instructor ? `${session.instructor.first_name} ${session.instructor.last_name}` : 'TBD';
      
      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `DTSTART:${dateStr}T${startTime}\n`;
      icsContent += `DTEND:${dateStr}T${endTime}\n`;
      icsContent += `SUMMARY:${subjectName} - ${session.session_type}\n`;
      icsContent += `LOCATION:${location}\n`;
      icsContent += `DESCRIPTION:Instructor: ${instructor}\\nSession Type: ${session.session_type}\n`;
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

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

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
                {DAYS.map((day, i) => {
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
                  {DAYS.map((_, dayIndex) => {
                    const dayDate = weekDates[dayIndex];
                    const dateStr = dayDate.toISOString().split('T')[0];
                    const daySessions = weekSessions.filter(s => {
                      const sessionDay = new Date(s.session_date).getDay();
                      const sessionHour = parseInt(s.start_time.split(':')[0]);
                      return sessionDay === dayIndex && sessionHour === hour;
                    });

                    return (
                      <div key={dayIndex} className="p-1 border-r last:border-r-0 border-neutral-100 flex flex-col gap-1 relative">
                        {daySessions.map(session => (
                          <div
                            key={session.id}
                            className={`p-2 rounded-sm border-l-4 shadow-sm transition-all hover:scale-[1.02] cursor-default
                              ${session.session_type === 'Online'
                                ? 'bg-blue-50 border-blue-600 text-blue-900'
                                : 'bg-neutral-50 border-neutral-600 text-neutral-900'}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-black uppercase truncate">{session.subject?.code}</span>
                              {session.session_type === 'Online' ? <Video size={10} weight="regular" /> : <MapPin size={10} weight="regular" />}
                            </div>
                            <div className="text-[10px] font-bold leading-tight mt-1 line-clamp-2">
                              {session.subject?.name}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[8px] font-bold opacity-70">
                              <Clock size={8} weight="regular" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                            </div>
                            {session.room && (
                              <div className="mt-1 text-[8px] font-black uppercase tracking-tighter truncate">
                                {session.room}{session.building ? `, ${session.building}` : ''}
                              </div>
                            )}
                            {session.instructor && (
                              <div className="mt-0.5 text-[8px] font-medium opacity-80 truncate">
                                {session.instructor.first_name} {session.instructor.last_name}
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
          * Schedule managed by Registrar.
        </div>
      </div>
    </div>
  );
}
