'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { Modal } from '@/components/sis/Modal';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar01Icon as Calendar,
  Clock01Icon as Clock,
  MapPinIcon as MapPin,
  UserIcon as User,
  GridIcon as Grid,
  BuildingIcon as Building,
  BookOpenIcon as BookOpen,
  Move01Icon as Move,
  PlayCircleIcon as Play,
} from '@hugeicons/core-free-icons';
import type { TimetableAssignment, TimetableVersion, Room, Profile, Semester, CourseSection, Module } from '@/types/database';
import {
  getPublishedTimetable,
  getTimetableVersions,
  getConflicts,
  resolveConflict,
  moveAssignment,
  validateAssignmentMove,
  getSemesters,
  getRooms,
  getInstructors,
} from './actions';
import { generateTimetable, getGenerationProgress, ProgressUpdate } from '../scheduling/actions';
import styles from './timetable.module.css';

type ViewTab = 'week' | 'day' | 'room' | 'instructor' | 'program';

interface EnrichedAssignment extends TimetableAssignment {
  section: CourseSection & {
    module: Module;
    instructor?: { id: string; name: string; email: string };
    student_group?: { id: string; name: string; code: string } | null;
  };
  room: Room;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_ABBREV = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START_HOUR = 8;
const END_HOUR = 17;
const SLOT_DURATION = 30;
const ROW_HEIGHT = 40;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * (60 / SLOT_DURATION);

const SESSION_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  LECTURE: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  LAB: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  SEMINAR: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
  TUTORIAL: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  PRACTICAL: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  CLINICAL: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
  ONLINE: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  HYBRID: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function getCardPosition(startTime: string, endTime: string): { top: number; height: number } {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const dayStartMinutes = START_HOUR * 60;
  const top = ((startMinutes - dayStartMinutes) / SLOT_DURATION) * ROW_HEIGHT;
  const height = ((endMinutes - startMinutes) / SLOT_DURATION) * ROW_HEIGHT;
  return { top: Math.max(0, top), height: Math.max(ROW_HEIGHT, height) };
}

export default function TimetablePage() {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [viewTab, setViewTab] = useState<ViewTab>('week');
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [versions, setVersions] = useState<TimetableVersion[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [roomFilter, setRoomFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<EnrichedAssignment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moving, setMoving] = useState(false);
  const [moveForm, setMoveForm] = useState({
    day: 1,
    start_time: '09:00',
    end_time: '10:30',
    room_id: '',
    reason: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [draggingAssignment, setDraggingAssignment] = useState<EnrichedAssignment | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: number; time: string } | null>(null);
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [autoAssignProgress, setAutoAssignProgress] = useState<any>(null);
  const [autoAssignStartTime, setAutoAssignStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchTimetableData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoAssigning && autoAssignStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - autoAssignStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        setElapsedTime(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoAssigning, autoAssignStartTime]);

  const fetchLookups = async () => {
    try {
      const [semestersData, roomsData, instructorsData] = await Promise.all([
        getSemesters(),
        getRooms(),
        getInstructors(),
      ]);
      setSemesters(semestersData);
      setRooms(roomsData);
      setInstructors(instructorsData);
      if (semestersData.length > 0 && !selectedTerm) {
        setSelectedTerm(semestersData[0].id);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load lookups');
    }
  };

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, versionsData] = await Promise.all([
        getPublishedTimetable(selectedTerm),
        getTimetableVersions(selectedTerm),
      ]);
      setAssignments(assignmentsData as EnrichedAssignment[]);
      setVersions(versionsData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load timetable data');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    if (!selectedTerm) {
      toast.error('Please select a term first');
      return;
    }
    setAutoAssigning(true);
    setAutoAssignStartTime(Date.now());
    setAutoAssignProgress({ progress: 0, status: 'PENDING', currentStage: 'Starting...' });

    try {
      const result = await generateTimetable(selectedTerm);
      if (result.success && result.runId) {
        fetch('/api/timetable/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ termId: selectedTerm, runId: result.runId }),
        }).catch(err => console.error('Generation API error:', err));

        const pollInterval = setInterval(async () => {
          try {
            const progressResult: ProgressUpdate = await getGenerationProgress(result.runId!);
            if (progressResult) {
              setAutoAssignProgress(progressResult);
              if (['COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'].includes(progressResult.status)) {
                clearInterval(pollInterval);
                setAutoAssigning(false);
                setAutoAssignStartTime(null);
                if (progressResult.status === 'COMPLETED') {
                  toast.success('Timetable generated successfully');
                  fetchTimetableData();
                } else if (progressResult.status === 'FAILED') {
                  toast.error(progressResult.errorMessage || 'Generation failed');
                }
              }
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to start generation');
      }
    } catch (err: any) {
      toast.error(err.message || 'Auto-assign failed');
      setAutoAssigning(false);
      setAutoAssignStartTime(null);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      if (roomFilter && a.room_id !== roomFilter) return false;
      if (instructorFilter && a.instructor_id !== instructorFilter) return false;
      return true;
    });
  }, [assignments, roomFilter, instructorFilter]);

  const assignmentsByDay = useMemo(() => {
    const map = new Map<number, EnrichedAssignment[]>();
    DAYS.forEach((_, i) => map.set(i + 1, []));
    filteredAssignments.forEach(a => {
      const list = map.get(a.day_of_week) || [];
      list.push(a);
      map.set(a.day_of_week, list);
    });
    return map;
  }, [filteredAssignments]);

  const assignmentsByRoom = useMemo(() => {
    const map = new Map<string, EnrichedAssignment[]>();
    filteredAssignments.forEach(a => {
      const key = a.room_id;
      const list = map.get(key) || [];
      list.push(a);
      map.set(key, list);
    });
    return map;
  }, [filteredAssignments]);

  const assignmentsByInstructor = useMemo(() => {
    const map = new Map<string, EnrichedAssignment[]>();
    filteredAssignments.forEach(a => {
      const key = a.instructor_id || 'unassigned';
      const list = map.get(key) || [];
      list.push(a);
      map.set(key, list);
    });
    return map;
  }, [filteredAssignments]);

  const assignmentsByProgram = useMemo(() => {
    const map = new Map<string, EnrichedAssignment[]>();
    filteredAssignments.forEach(a => {
      const key = a.section?.student_group_id || 'ungrouped';
      const list = map.get(key) || [];
      list.push(a);
      map.set(key, list);
    });
    return map;
  }, [filteredAssignments]);

  const groupedViews = useMemo(() => {
    if (viewTab !== 'room' && viewTab !== 'instructor' && viewTab !== 'program') {
      return null;
    }
    const map = new Map<string, { key: string; label: string; assignments: EnrichedAssignment[] }>();
    filteredAssignments.forEach(a => {
      let key: string;
      let label: string;
      if (viewTab === 'room') {
        key = a.room_id;
        label = `${a.room?.name} (${a.room?.building})`;
      } else if (viewTab === 'instructor') {
        key = a.instructor_id || 'unassigned';
        label = a.section?.instructor ? `${a.section.instructor.name}` : 'Unassigned';
      } else {
        key = a.section?.student_group_id || 'ungrouped';
        label = a.section?.student_group?.name || a.section?.student_group?.code || 'Ungrouped';
      }
      const existing = map.get(key);
      if (existing) {
        existing.assignments.push(a);
      } else {
        map.set(key, { key, label, assignments: [a] });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredAssignments, viewTab]);

  const openDetailModal = (assignment: EnrichedAssignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const openMoveModal = (assignment: EnrichedAssignment) => {
    setSelectedAssignment(assignment);
    setMoveForm({
      day: assignment.day_of_week,
      start_time: assignment.start_time,
      end_time: assignment.end_time,
      room_id: assignment.room_id,
      reason: '',
    });
    setValidationErrors([]);
    setShowMoveModal(true);
  };

  const handleValidateMove = async () => {
    if (!selectedAssignment) return;
    try {
      const result = await validateAssignmentMove(
        selectedAssignment.id,
        moveForm.day,
        moveForm.start_time,
        moveForm.end_time,
        moveForm.room_id
      );
      setValidationErrors(result.errors);
      if (result.valid) {
        toast.success('Move is valid');
      }
    } catch (err: any) {
      toast.error(err.message || 'Validation failed');
    }
  };

  const handleMoveAssignment = async () => {
    if (!selectedAssignment) return;
    try {
      setMoving(true);
      const result = await moveAssignment(
        selectedAssignment.id,
        moveForm.day,
        moveForm.start_time,
        moveForm.end_time,
        moveForm.room_id,
        moveForm.reason
      );
      toast.success('Assignment moved successfully');
      setShowMoveModal(false);
      setShowDetailModal(false);
      fetchTimetableData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to move assignment');
    } finally {
      setMoving(false);
    }
  };

  const handleDragStart = (assignment: EnrichedAssignment) => {
    setDraggingAssignment(assignment);
  };

  const handleDragOver = (e: React.DragEvent, day: number, time: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day, time });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = async (day: number, time: string) => {
    if (!draggingAssignment) return;
    
    const duration = timeToMinutes(draggingAssignment.end_time) - timeToMinutes(draggingAssignment.start_time);
    const startTime = time;
    const [hours, minutes] = time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + duration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    setDraggingAssignment(null);
    setDragOverSlot(null);

    try {
      setMoving(true);
      await moveAssignment(
        draggingAssignment.id,
        day,
        startTime,
        endTime,
        draggingAssignment.room_id,
        `Drag and drop from day ${draggingAssignment.day_of_week} at ${draggingAssignment.start_time}`
      );
      toast.success('Assignment moved successfully');
      fetchTimetableData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to move assignment');
    } finally {
      setMoving(false);
    }
  };

  const handleResolveConflict = async (conflictId: string, resolution: string) => {
    try {
      await resolveConflict(conflictId, resolution);
      toast.success('Conflict resolved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve conflict');
    }
  };

  const roomOptions = useMemo(() => {
    const uniqueRooms = new Map<string, Room>();
    assignments.forEach(a => uniqueRooms.set(a.room_id, a.room));
    return Array.from(uniqueRooms.values());
  }, [assignments]);

  const instructorOptions = useMemo(() => {
    const uniqueInstructors = new Map<string, { id: string; name: string; email: string }>();
    assignments.forEach(a => {
      if (a.section?.instructor) {
        uniqueInstructors.set(a.section.instructor.id, a.section.instructor);
      }
    });
    return Array.from(uniqueInstructors.values());
  }, [assignments]);

  const filterOptions = useMemo(() => [
    {
      key: 'room',
      label: 'Room',
      options: roomOptions.map(r => ({ value: r.id, label: `${r.name} (${r.building})` })),
      value: roomFilter,
      onChange: setRoomFilter,
      placeholder: 'All Rooms',
    },
    {
      key: 'instructor',
      label: 'Instructor',
      options: instructorOptions.map(i => ({ value: i.id, label: `${i.name}` })),
      value: instructorFilter,
      onChange: setInstructorFilter,
      placeholder: 'All Instructors',
    },
  ], [roomFilter, instructorFilter, roomOptions, instructorOptions]);

  const clearFilters = () => {
    setRoomFilter('');
    setInstructorFilter('');
  };

  const renderWeekGrid = () => {
    const daysToShow = DAYS.map((_, i) => i + 1);
    const timeSlots = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
      timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }

    return (
      <div className={styles.timetableContainer}>
        <div className={styles.timetableGrid} style={{ gridTemplateColumns: `80px repeat(${daysToShow.length}, minmax(180px, 1fr))` }}>
          <div className={styles.timeLabel}></div>
          {daysToShow.map(day => (
            <div key={day} className={styles.gridHeader}>
              {DAY_ABBREV[day - 1]}
            </div>
          ))}
          {timeSlots.map((slot, i) => (
            <React.Fragment key={slot}>
              <div className={styles.timeLabel}>{slot}</div>
              {daysToShow.map(day => {
                const dayAssignments = assignmentsByDay.get(day) || [];
                const slotMinutes = START_HOUR * 60 + i * SLOT_DURATION;
                const slotHours = Math.floor(slotMinutes / 60);
                const slotMins = slotMinutes % 60;
                const slotTime = `${slotHours.toString().padStart(2, '0')}:${slotMins.toString().padStart(2, '0')}`;
                const isDragOver = dragOverSlot?.day === day && dragOverSlot?.time === slotTime;
                const assignment = dayAssignments.find(a => {
                  const start = timeToMinutes(a.start_time);
                  const end = timeToMinutes(a.end_time);
                  const current = START_HOUR * 60 + i * SLOT_DURATION;
                  return current >= start && current < end;
                });
                return (
                  <div
                    key={`${day}-${slot}`}
                    onDragOver={(e) => handleDragOver(e, day, slotTime)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(day, slotTime)}
                    className={`border-b border-neutral-100 transition-colors ${isDragOver ? 'bg-purple-100' : ''}`}
                    style={{ minHeight: `${ROW_HEIGHT}px` }}
                  >
                    {assignment && (
                      <div
                        draggable
                        onDragStart={() => handleDragStart(assignment)}
                        onClick={() => openDetailModal(assignment)}
                        className={`${styles.courseCard} ${draggingAssignment?.id === assignment.id ? 'opacity-50' : ''}`}
                        style={{ margin: '2px 0' }}
                      >
                        <div className={styles.courseCode}>
                          {assignment.section?.module?.code}
                        </div>
                        <div className={styles.courseTitle}>
                          {assignment.section?.module?.title}
                        </div>
                        <div className={styles.courseMeta}>
                          <span>{assignment.section?.code}</span>
                          {assignment.section?.instructor && (
                            <span>{assignment.section.instructor.name}</span>
                          )}
                          <span>{assignment.room?.name} ({assignment.room?.building})</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayGrid = () => {
    const timeSlots = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
      timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    const dayAssignments = assignmentsByDay.get(selectedDay) || [];

    return (
      <div className={styles.timetableContainer}>
        <div className={styles.timetableGrid} style={{ gridTemplateColumns: '80px 1fr' }}>
          <div className={styles.gridHeader}>{DAYS[selectedDay - 1]}</div>
          <div className="relative" style={{ height: `${TOTAL_SLOTS * ROW_HEIGHT}px` }}>
            {timeSlots.map((slot, i) => {
              const slotMinutes = START_HOUR * 60 + i * SLOT_DURATION;
              const slotHours = Math.floor(slotMinutes / 60);
              const slotMins = slotMinutes % 60;
              const slotTime = `${slotHours.toString().padStart(2, '0')}:${slotMins.toString().padStart(2, '0')}`;
              const isDragOver = dragOverSlot?.day === selectedDay && dragOverSlot?.time === slotTime;
              const assignment = dayAssignments.find(a => {
                const start = timeToMinutes(a.start_time);
                const end = timeToMinutes(a.end_time);
                const current = START_HOUR * 60 + i * SLOT_DURATION;
                return current >= start && current < end;
              });
              return (
                <div
                  key={i}
                  onDragOver={(e) => handleDragOver(e, selectedDay, slotTime)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(selectedDay, slotTime)}
                  className={`border-b border-neutral-100 transition-colors ${isDragOver ? 'bg-purple-100' : ''}`}
                  style={{ minHeight: `${ROW_HEIGHT}px` }}
                >
                  {assignment && (
                    <div
                      draggable
                      onDragStart={() => handleDragStart(assignment)}
                      onClick={() => openDetailModal(assignment)}
                      className={`${styles.courseCard} ${draggingAssignment?.id === assignment.id ? 'opacity-50' : ''}`}
                      style={{ margin: '2px 0' }}
                    >
                      <div className={styles.courseCode}>
                        {assignment.section?.module?.code}
                      </div>
                      <div className={styles.courseTitle}>
                        {assignment.section?.module?.title}
                      </div>
                      <div className={styles.courseMeta}>
                        <span>{assignment.section?.code}</span>
                        {assignment.section?.instructor && (
                          <span>{assignment.section.instructor.name}</span>
                        )}
                        <span>{assignment.room?.name} ({assignment.room?.building})</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderGroupedView = (groups: { key: string; label: string; assignments: EnrichedAssignment[] }[]) => {
    return (
      <div className={styles.timetableContainer}>
        {groups.map(group => (
          <div key={group.key} className="border border-neutral-200 bg-white rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">{group.label}</h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">{group.assignments.length} session{group.assignments.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.assignments.map(assignment => {
                  const colors = SESSION_COLORS[assignment.section?.session_type] || SESSION_COLORS.LECTURE;
                  return (
                    <div
                      key={assignment.id}
                      onClick={() => openDetailModal(assignment)}
                      className={`${styles.courseCard} ${draggingAssignment?.id === assignment.id ? 'opacity-50' : ''}`}
                      style={{ borderLeftColor: colors.border.replace('border-', '') }}
                    >
                      <div className={styles.courseCode}>
                        {assignment.section?.module?.code}
                      </div>
                      <div className={styles.courseTitle}>
                        {assignment.section?.module?.title}
                      </div>
                      <div className={styles.courseMeta}>
                        <span>Section {assignment.section?.code}</span>
                        <span>{formatTime(assignment.start_time)} - {formatTime(assignment.end_time)}</span>
                        <span>{assignment.room?.name} ({assignment.room?.building})</span>
                        {assignment.section?.instructor && (
                          <span>{assignment.section.instructor.name}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">No assignments found for this view</div>
        )}
      </div>
    );
  };

  const renderGridView = () => {
    switch (viewTab) {
      case 'week':
        return renderWeekGrid();
      case 'day':
        return renderDayGrid();
      case 'room':
      case 'instructor':
      case 'program':
        return renderGroupedView(groupedViews || []);
      default:
        return renderWeekGrid();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        subtitle="Master timetable grid view"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white"
            >
              <option value="">Select Term</option>
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={handleAutoAssign}
              disabled={!selectedTerm || autoAssigning}
              className="flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all"
            >
              <HugeiconsIcon icon={Play} size={14} strokeWidth={2.5} />
              {autoAssigning ? 'Assigning...' : 'Auto Assign'}
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 border-b border-neutral-200">
          {[
            { key: 'week', label: 'Week', icon: Grid },
            { key: 'day', label: 'Day', icon: Calendar },
            { key: 'room', label: 'Room', icon: Building },
            { key: 'instructor', label: 'Instructor', icon: User },
            { key: 'program', label: 'Program', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewTab(tab.key as ViewTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                viewTab === tab.key
                  ? 'border-[#9c27b3] text-[#9c27b3]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <HugeiconsIcon icon={tab.icon} size={14} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>
        {viewTab === 'day' && (
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(Number(e.target.value))}
            className="px-3 py-2 border border-neutral-200 rounded text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white"
          >
            {DAYS.map((day, i) => (
              <option key={i} value={i + 1}>{day}</option>
            ))}
          </select>
        )}
      </div>

      <ActionToolbar
        search={
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="Search timetable..."
          />
        }
        filter={
          <FilterBar filters={filterOptions} onClearAll={clearFilters} />
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : !selectedTerm ? (
        <div className="text-center py-20 text-neutral-400 text-sm">Please select a term to view the timetable</div>
      ) : (
        renderGridView()
      )}

      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedAssignment(null); }}
        title="Class Details"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowDetailModal(false); setSelectedAssignment(null); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Close
            </button>
            <button
              onClick={() => { setShowDetailModal(false); openMoveModal(selectedAssignment!); }}
              className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800"
            >
              Move Class
            </button>
          </div>
        }
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${SESSION_COLORS[selectedAssignment.section?.session_type]?.text || 'text-neutral-700'} ${SESSION_COLORS[selectedAssignment.section?.session_type]?.bg || 'bg-neutral-100'}`}>
                {selectedAssignment.section?.session_type}
              </span>
              <span className="text-sm text-neutral-500">{DAYS[selectedAssignment.day_of_week - 1]}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Course Code</label>
                <div className="text-sm font-bold text-neutral-900">{selectedAssignment.section?.module?.code}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Course Name</label>
                <div className="text-sm font-medium text-neutral-700">{selectedAssignment.section?.module?.title}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Section</label>
                <div className="text-sm font-medium text-neutral-700">{selectedAssignment.section?.code}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Capacity</label>
                <div className="text-sm font-medium text-neutral-700">{selectedAssignment.section?.capacity} students</div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Instructor</label>
                <div className="text-sm font-medium text-neutral-700">
                  {selectedAssignment.section?.instructor ? `${selectedAssignment.section.instructor.name}` : 'TBD'}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room</label>
                <div className="text-sm font-medium text-neutral-700">
                  {selectedAssignment.room?.name} ({selectedAssignment.room?.building})
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
                <div className="text-sm font-medium text-neutral-700">{formatTime(selectedAssignment.start_time)}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
                <div className="text-sm font-medium text-neutral-700">{formatTime(selectedAssignment.end_time)}</div>
              </div>
              {selectedAssignment.is_override && (
                <>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Override Reason</label>
                    <div className="text-sm font-medium text-neutral-700">{selectedAssignment.override_reason}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Override Date</label>
                    <div className="text-sm font-medium text-neutral-700">{selectedAssignment.override_at ? new Date(selectedAssignment.override_at).toLocaleString() : '—'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showMoveModal}
        onClose={() => { setShowMoveModal(false); setSelectedAssignment(null); setValidationErrors([]); }}
        title="Move Class"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowMoveModal(false); setSelectedAssignment(null); setValidationErrors([]); }}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleMoveAssignment}
              disabled={moving || validationErrors.length > 0}
              className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50"
            >
              {moving ? 'Moving...' : 'Move Class'}
            </button>
          </div>
        }
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
              <div className="text-xs font-bold text-neutral-900">{selectedAssignment.section?.module?.code} - {selectedAssignment.section?.module?.title}</div>
              <div className="text-[10px] text-neutral-500 mt-1">Section {selectedAssignment.section?.code}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Day</label>
                <select
                  value={moveForm.day}
                  onChange={e => setMoveForm({ ...moveForm, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                >
                  {DAYS.map((d, i) => (
                    <option key={i} value={i + 1}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Room</label>
                <select
                  value={moveForm.room_id}
                  onChange={e => setMoveForm({ ...moveForm, room_id: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                >
                  <option value="">Select room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.building})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Start Time</label>
                <input
                  type="time"
                  value={moveForm.start_time}
                  onChange={e => setMoveForm({ ...moveForm, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">End Time</label>
                <input
                  type="time"
                  value={moveForm.end_time}
                  onChange={e => setMoveForm({ ...moveForm, end_time: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Reason</label>
                <textarea
                  value={moveForm.reason}
                  onChange={e => setMoveForm({ ...moveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                  rows={2}
                  placeholder="Reason for moving this class..."
                />
              </div>
            </div>
            {validationErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-xs font-bold text-red-700 mb-1">Validation Errors</div>
                {validationErrors.map((err, i) => (
                  <div key={i} className="text-xs text-red-600">{err}</div>
                ))}
              </div>
            )}
            <button
              onClick={handleValidateMove}
              className="w-full px-4 py-2 border border-neutral-200 rounded text-xs font-bold uppercase tracking-widest text-neutral-700 hover:bg-neutral-50"
            >
              Validate Move
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={autoAssigning}
        onClose={() => {}}
        title="Auto Assigning Timetable..."
        size="md"
        footer={
          autoAssignProgress && ['COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'].includes(autoAssignProgress.status) ? (
            <button onClick={() => { setAutoAssigning(false); fetchTimetableData(); }} className="px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800">
              Close
            </button>
          ) : null
        }
      >
        <div className="space-y-4">
          <div className="w-full bg-neutral-200 h-2">
            <div className="bg-[#9c27b3] h-2 transition-all duration-500" style={{ width: `${autoAssignProgress?.progress || 0}%` }} />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-900">{autoAssignProgress?.currentStage || 'Initializing'}</div>
            <div className="text-xs text-neutral-500 mt-1">{autoAssignProgress?.progress || 0}% complete · {elapsedTime} elapsed</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Sections</div>
              <div className="font-bold">{autoAssignProgress?.sectionsCount || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Assignments</div>
              <div className="font-bold">{autoAssignProgress?.assignmentsCount || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Conflicts</div>
              <div className="font-bold text-red-600">{autoAssignProgress?.hardViolations || 0}</div>
            </div>
            <div className="border border-neutral-200 p-2">
              <div className="text-neutral-500">Status</div>
              <div className="font-bold">{autoAssignProgress?.status || 'RUNNING'}</div>
            </div>
          </div>
          {autoAssignProgress?.status === 'RUNNING' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs text-neutral-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9c27b3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9c27b3]"></span>
                </span>
                Running optimization engine...
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
