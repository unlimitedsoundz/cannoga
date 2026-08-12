'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PageHeader } from '@/components/sis/PageHeader';
import { Calendar, MapPin, Users, Clock, CaretLeft as ChevronLeft, CaretRight as ChevronRight } from '@phosphor-icons/react';
import { TimetableAssignment, CourseSection } from '@/types/database';
import { getFacultyTimetable, getFacultySections } from './actions';

interface SessionRow extends TimetableAssignment {
  module: { code: string; title: string; credits: number } | null;
  room: { name: string; building: string; room_number: string } | null;
  section: { code: string; session_type: string; capacity: number; enrolled_count: number } | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

export default function FacultyTimetablePage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sections, setSections] = useState<(CourseSection & { module: { code: string; title: string; credits: number } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [termId, setTermId] = useState('');
  const [terms, setTerms] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (termId) fetchData();
  }, [termId]);

  const fetchTerms = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) return;

      const { data: semesters } = await supabase
        .from('semesters')
        .select('id, name, start_date, end_date, status')
        .order('start_date', { ascending: false });

      setTerms(semesters || []);
      const active = semesters?.find((s: { status: string }) => s.status === 'ACTIVE');
      if (active) setTermId(active.id);
    } catch (err) {
      console.error('Failed to load terms:', err);
    }
  };

  const fetchData = async () => {
    if (!termId) return;
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) return;

      const [timetableResult, sectionsResult] = await Promise.all([
        getFacultyTimetable(profile.id, termId),
        getFacultySections(profile.id, termId),
      ]);

      setSessions(timetableResult as SessionRow[]);
      setSections(sectionsResult as any);
    } catch (err) {
      console.error('Failed to load faculty timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">My Teaching Schedule</h1>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
            Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={termId}
            onChange={(e) => setTermId(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded text-xs font-medium text-neutral-700 bg-white"
          >
            <option value="">Select term</option>
            {terms.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"><ChevronLeft size={16} weight="bold" /></button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 border border-neutral-200 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50">Today</button>
          <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 border border-neutral-200 rounded hover:bg-neutral-50"><ChevronRight size={16} weight="bold" /></button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white border-2 border-neutral-200 rounded-sm p-12 text-center">
          <Calendar size={48} weight="thin" className="mx-auto text-neutral-300 mb-4" />
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">No classes scheduled</p>
          <p className="text-xs text-slate-800 mt-2">Your teaching schedule will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-[#9c27b3] rounded-sm overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 border-b-2 border-[#9c27b3] bg-neutral-50 font-black italic">
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
                <div key={hour} className="grid grid-cols-6 border-b last:border-b-0 border-neutral-200 min-h-[60px]">
                  <div className="p-1 border-r-2 border-[#c084fc] bg-neutral-50 flex items-start justify-center">
                    <span className="text-[10px] font-bold text-slate-800">{hour}:00</span>
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const daySessions = sessions.filter(s => {
                      return s.day_of_week === dayIndex + 1 && parseInt(s.start_time.split(':')[0]) === hour;
                    });
                    return (
                      <div key={dayIndex} className="p-1 border-r last:border-r-0 border-neutral-100 flex flex-col gap-1 relative">
                        {daySessions.map(session => (
                          <div key={session.id} className="p-2 rounded-sm border-l-4 border-[#c084fc] bg-purple-50 text-purple-900 shadow-sm">
                            <div className="text-[9px] font-black uppercase truncate">{session.section?.module?.code}</div>
                            <div className="text-[10px] font-bold leading-tight mt-1 line-clamp-2">{session.section?.module?.title}</div>
                            <div className="flex items-center gap-1 mt-1 text-[8px] font-bold opacity-70">
                              <Clock size={8} weight="regular" /> {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                            </div>
                            {session.room && (
                              <div className="mt-1 text-[8px] font-black uppercase tracking-tighter truncate">
                                {session.room.name}{session.room.building ? `, ${session.room.building}` : ''}
                              </div>
                            )}
                            {session.section && (
                              <div className="mt-0.5 text-[8px] font-medium opacity-80 flex items-center gap-1">
                                <Users size={8} weight="regular" /> {session.section.enrolled_count || 0}/{session.section.capacity}
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

      {sections.length > 0 && (
        <div className="bg-white border-2 border-neutral-200 rounded-sm p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-4">My Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map(section => (
              <div key={section.id} className="border border-neutral-200 rounded-sm p-4">
                <div className="font-bold text-neutral-900">{section.module?.code} - {section.module?.title}</div>
                <div className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mt-1">Section {section.code}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-600">
                  <Users size={12} weight="regular" /> {section.enrolled_count || 0} / {section.capacity} students
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 inline-block">
                  {section.session_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}