'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar, MapPin, Users, Clock, CaretLeft as ChevronLeft, CaretRight as ChevronRight } from '@phosphor-icons/react/dist/ssr';
import { TimetableAssignment } from '@/types/database';

interface SessionRow extends TimetableAssignment {
  room: { name: string; building: string; room_number: string } | null;
  section: {
    code: string;
    session_type: string;
    delivery_mode: string;
    module: { code: string; title: string; credits: number } | null;
  } | null;
  instructor: { first_name: string; last_name: string } | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

export default function StudentTimetablePage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
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

      const { data: enrollments } = await supabase
        .from('module_enrollments')
        .select('module_id, semester_id')
        .eq('student_id', student.id)
        .eq('status', 'REGISTERED');

      const moduleIds = enrollments?.map((e: { module_id: string }) => e.module_id) || [];
      const semesterIds = [...new Set(enrollments?.map((e: { semester_id: string }) => e.semester_id) || [])];

      if (moduleIds.length === 0 || semesterIds.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const { data: sections } = await supabase
        .from('course_sections')
        .select('id, semester_id')
        .in('module_id', moduleIds);

      const sectionIds = sections?.map((s: { id: string }) => s.id) || [];
      const uniqueSemesterIds = [...new Set(sections?.map((s: { semester_id: string }) => s.semester_id) || [])];

      if (sectionIds.length === 0 || uniqueSemesterIds.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const { data: versions } = await supabase
        .from('timetable_versions')
        .select('id, semester_id')
        .in('semester_id', uniqueSemesterIds)
        .eq('status', 'PUBLISHED')
        .order('version_number', { ascending: false })
        .limit(1);

      if (!versions || versions.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const { data: assignments } = await supabase
        .from('timetable_assignments')
        .select(`
          *,
          room:rooms(id, name, building, room_number),
          section:course_sections(id, code, session_type, delivery_mode, module:modules(id, code, title, credits), instructor_id)
        `)
        .eq('version_id', versions[0].id)
        .in('section_id', sectionIds)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      let enrichedAssignments = assignments || [];

      const instructorIds = [
        ...new Set(
          enrichedAssignments
            .map(a => a.instructor_id || a.section?.instructor_id)
            .filter(Boolean)
        )
      ];

      if (instructorIds.length > 0) {
        const { data: instructors } = await supabase
          .from('Faculty')
          .select('id, name, email')
          .in('id', instructorIds);

        const instructorMap = new Map((instructors || []).map(i => [i.id, i]));
        enrichedAssignments = enrichedAssignments.map(a => ({
          ...a,
          instructor: instructorMap.get(a.instructor_id || a.section?.instructor_id) ? {
            name: instructorMap.get(a.instructor_id || a.section?.instructor_id)!.name,
            email: instructorMap.get(a.instructor_id || a.section?.instructor_id)!.email,
          } : null,
        }));
      }

      setSessions(enrichedAssignments);
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

  const handleExport = () => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cannoga College//Timetable//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n';

    sessions.forEach(session => {
      const dayIndex = session.day_of_week - 1;
      const sessionDate = weekDates[dayIndex];
      if (!sessionDate) return;
      const dateStr = sessionDate.toISOString().split('T')[0].replace(/-/g, '');
      const startTime = session.start_time.replace(/:/g, '') + '00';
      const endTime = session.end_time.replace(/:/g, '') + '00';
      const subjectName = session.section?.module?.title || 'Class';
      const moduleCode = session.section?.module?.code || '';
      const location = session.room ? `${session.room.room_number}${session.room.building ? ', ' + session.room.building : ''}` : 'TBD';
      const instructor = session.instructor?.name || 'TBD';

      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `DTSTART:${dateStr}T${startTime}\n`;
      icsContent += `DTEND:${dateStr}T${endTime}\n`;
      icsContent += `SUMMARY:${moduleCode} - ${subjectName}\n`;
      icsContent += `LOCATION:${location}\n`;
      icsContent += `DESCRIPTION:Instructor: ${instructor}\\nType: ${session.section?.session_type || 'Lecture'}\n`;
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
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"><ChevronLeft size={16} weight="bold" /></button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50">Today</button>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"><ChevronRight size={16} weight="bold" /></button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm">
            <Calendar size={14} weight="bold" /> Export .ics
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
                    const daySessions = sessions.filter(s => {
                      return s.day_of_week === dayIndex + 1 && parseInt(s.start_time.split(':')[0]) === hour;
                    });

                    return (
                      <div key={dayIndex} className="p-1 border-r last:border-r-0 border-neutral-100 flex flex-col gap-1 relative">
                        {daySessions.map(session => (
                          <div
                            key={session.id}
                            className={`p-2 rounded-sm border-l-4 shadow-sm transition-all hover:scale-[1.02] cursor-default
                              ${session.section?.delivery_mode === 'ONLINE'
                                ? 'bg-blue-50 border-blue-600 text-blue-900'
                                : 'bg-neutral-50 border-neutral-600 text-neutral-900'}`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-black uppercase truncate">{session.section?.module?.code}</span>
                              {session.section?.delivery_mode === 'ONLINE' ? <span className="text-[8px] font-bold uppercase">Online</span> : <MapPin size={10} weight="regular" />}
                            </div>
                            <div className="text-[10px] font-bold leading-tight mt-1 line-clamp-2">
                              {session.section?.module?.title}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[8px] font-bold opacity-70">
                              <Clock size={8} weight="regular" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                            </div>
                            {session.room && (
                              <div className="mt-1 text-[8px] font-black uppercase tracking-tighter truncate">
                                {session.room.room_number}{session.room.building ? `, ${session.room.building}` : ''}
                              </div>
                            )}
                            {session.instructor?.name && (
                              <div className="mt-0.5 text-[8px] font-medium opacity-80 truncate">
                                {session.instructor.name}
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
