import { createClient } from '@supabase/supabase-js'
import type {
  SchedulingProblem,
  Room,
  Section,
  Meeting,
  TimeSlot,
  Instructor,
  Student,
  Cohort,
  InstructorAvailabilitySlot,
} from './types'
import { dbRoomToRoom, dbSectionToSection, dbMeetingToMeeting, dbTimeSlotToTimeSlot, dbInstructorToInstructor, dbStudentToStudent } from './types'
import type {
  Database,
  Room as DbRoom,
  RoomFeature as DbRoomFeature,
  RoomFeatureAssignment as DbRoomFeatureAssignment,
  RoomAvailability as DbRoomAvailability,
  InstructorAvailability as DbInstructorAvailability,
  CourseSection as DbCourseSection,
  CourseSectionMeeting as DbCourseSectionMeeting,
  StudentGroup as DbStudentGroup,
  CohortMember as DbCohortMember,
  TimeSlot as DbTimeSlot,
  Holiday as DbHoliday,
  ModuleEnrollment as DbModuleEnrollment,
  Student as DbStudent,
  Profile as DbProfile,
} from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createClient<Database>(supabaseUrl, supabaseKey)
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function isHolidayDate(dateStr: string, holidays: DbHoliday[]): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  return holidays.some((h) => {
    const start = new Date(h.start_date + 'T00:00:00')
    const end = new Date(h.end_date + 'T00:00:00')
    return date >= start && date <= end && h.affects_scheduling
  })
}

function timeOverlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd)
}

export async function loadSchedulingData(termId: string): Promise<SchedulingProblem> {
  const supabase = getSupabase()

  const [
    roomsRes,
    featuresRes,
    featureAssignmentsRes,
    roomAvailRes,
    instructorAvailRes,
    sectionsRes,
    studentGroupsRes,
    cohortMembersRes,
    timeSlotsRes,
    holidaysRes,
    enrollmentsRes,
    profilesRes,
    studentsRes,
    semesterRes,
  ] = await Promise.all([
    supabase.from('rooms').select('*'),
    supabase.from('room_features').select('*'),
    supabase.from('room_feature_assignments').select('*'),
    supabase.from('room_availability').select('*'),
    supabase.from('instructor_availability').select('*'),
    supabase.from('course_sections').select('*').eq('semester_id', termId),
    supabase.from('student_groups').select('*').eq('is_active', true),
    supabase.from('cohort_members').select('*'),
    supabase.from('time_slots').select('*'),
    supabase.from('holidays').select('*'),
    supabase.from('module_enrollments').select('*').eq('semester_id', termId),
    supabase.from('profiles').select('*'),
    supabase.from('students').select('*'),
    supabase.from('semesters').select('start_date, end_date').eq('id', termId).single(),
  ])

  const semesterData = semesterRes.data as { start_date: string; end_date: string } | null

  const sectionIds = (sectionsRes.data as DbCourseSection[] | null)?.map((s) => s.id) || []

  const { data: meetingsData, error: meetingsError } = await supabase
    .from('course_section_meetings')
    .select('*')
    .in('section_id', sectionIds)

  if (meetingsError) throw new Error(`Failed to load meetings: ${meetingsError.message}`)

  if (roomsRes.error) throw new Error(`Failed to load rooms: ${roomsRes.error.message}`)
  if (sectionsRes.error) throw new Error(`Failed to load sections: ${sectionsRes.error.message}`)

  const rawRooms = (roomsRes.data as DbRoom[]) || []
  const rawFeatures = (featuresRes.data as DbRoomFeature[]) || []
  const rawFeatureAssignments = (featureAssignmentsRes.data as DbRoomFeatureAssignment[]) || []
  const rawRoomAvailability = (roomAvailRes.data as DbRoomAvailability[]) || []
  const rawInstructorAvailability = (instructorAvailRes.data as DbInstructorAvailability[]) || []
  const rawSections = (sectionsRes.data as DbCourseSection[]) || []
  const rawMeetings = (meetingsData as DbCourseSectionMeeting[]) || []
  const rawStudentGroups = (studentGroupsRes.data as DbStudentGroup[]) || []
  const rawCohortMembers = (cohortMembersRes.data as DbCohortMember[]) || []
  const rawTimeSlots = (timeSlotsRes.data as DbTimeSlot[]) || []
  const rawHolidays = (holidaysRes.data as DbHoliday[]) || []
  const rawEnrollments = (enrollmentsRes.data as DbModuleEnrollment[]) || []
  const rawProfiles = (profilesRes.data as DbProfile[]) || []
  const rawStudents = (studentsRes.data as DbStudent[]) || []

  console.log('[TimetableLoader] Raw data loaded', {
    rooms: rawRooms.length,
    sections: rawSections.length,
    meetings: rawMeetings.length,
    timeSlots: rawTimeSlots.length,
    holidays: rawHolidays.length,
    enrollments: rawEnrollments.length,
    cohorts: rawStudentGroups.length,
    cohortMembers: rawCohortMembers.length,
    instructors: rawProfiles.length,
    students: rawStudents.length,
  })

  const featureIdToName = new Map<string, string>()
  for (const f of rawFeatures) {
    featureIdToName.set(f.id, f.name)
  }

  const roomFeatureMap = new Map<string, { featureId: string; name: string; category: string }[]>()
  for (const fa of rawFeatureAssignments) {
    const existing = roomFeatureMap.get(fa.room_id) || []
    existing.push({
      featureId: fa.feature_id,
      name: featureIdToName.get(fa.feature_id) || fa.feature_id,
      category: rawFeatures.find(f => f.id === fa.feature_id)?.category || 'GENERAL',
    })
    roomFeatureMap.set(fa.room_id, existing)
  }

  const roomAvailabilityMap = new Map<string, DbRoomAvailability[]>()
  for (const ra of rawRoomAvailability) {
    const existing = roomAvailabilityMap.get(ra.room_id) || []
    existing.push(ra)
    roomAvailabilityMap.set(ra.room_id, existing)
  }

  const instructorAvailabilityMap = new Map<string, DbInstructorAvailability[]>()
  for (const ia of rawInstructorAvailability) {
    const existing = instructorAvailabilityMap.get(ia.instructor_id) || []
    existing.push(ia)
    instructorAvailabilityMap.set(ia.instructor_id, existing)
  }

  const meetingMap = new Map<string, DbCourseSectionMeeting[]>()
  for (const m of rawMeetings) {
    const existing = meetingMap.get(m.section_id) || []
    existing.push(m)
    meetingMap.set(m.section_id, existing)
  }

  const cohortStudentMap = new Map<string, string[]>()
  for (const cm of rawCohortMembers) {
    const existing = cohortStudentMap.get(cm.group_id) || []
    if (!existing.includes(cm.student_id)) {
      existing.push(cm.student_id)
    }
    cohortStudentMap.set(cm.group_id, existing)
  }

  const profileMap = new Map<string, DbProfile>()
  for (const p of rawProfiles) {
    profileMap.set(p.id, p)
  }

  const enrollmentByStudent = new Map<string, DbModuleEnrollment[]>()
  for (const e of rawEnrollments) {
    const existing = enrollmentByStudent.get(e.student_id) || []
    existing.push(e)
    enrollmentByStudent.set(e.student_id, existing)
  }

  const rooms: Room[] = rawRooms.map((r) =>
    dbRoomToRoom(r, roomFeatureMap.get(r.id) || []),
  )

  const roomIdToRoom = new Map<string, Room>()
  for (const room of rooms) {
    roomIdToRoom.set(room.id, room)
  }

  const sections: Section[] = rawSections
    .filter((s) => s.status !== 'CANCELLED')
    .map((s) => {
      const rawMeetingsForSection = meetingMap.get(s.id) || []
      const meetings: Meeting[] = rawMeetingsForSection
        .sort((a, b) => a.meeting_index - b.meeting_index)
        .map(dbMeetingToMeeting)
      return dbSectionToSection(s, meetings)
    })

  const instructors: Instructor[] = []
  const instructorIds = new Set<string>()
  for (const s of sections) {
    if (s.instructorId) {
      instructorIds.add(s.instructorId)
    }
    for (const m of s.meetings) {
      if (m.fixedInstructorId) {
        instructorIds.add(m.fixedInstructorId)
      }
    }
  }
  for (const id of instructorIds) {
    const rawSlots = instructorAvailabilityMap.get(id) || []
    const slots: InstructorAvailabilitySlot[] = rawSlots.map((ia) => ({
      dayOfWeek: ia.day_of_week,
      startTime: ia.start_time,
      endTime: ia.end_time,
      availabilityType: ia.availability_type as 'AVAILABLE' | 'UNAVAILABLE',
      effectiveDate: ia.effective_date,
      expiryDate: ia.expiry_date ?? undefined,
    }))
    instructors.push(dbInstructorToInstructor(id, slots))
  }

  const students: Student[] = []
  const studentIdToCohortIds = new Map<string, string[]>()
  for (const [groupId, memberIds] of cohortStudentMap.entries()) {
    for (const studentId of memberIds) {
      const existing = studentIdToCohortIds.get(studentId) || []
      if (!existing.includes(groupId)) {
        existing.push(groupId)
      }
      studentIdToCohortIds.set(studentId, existing)
    }
  }

  const studentIdSet = new Set<string>()
  for (const s of rawStudents) {
    if (!studentIdSet.has(s.id)) {
      studentIdSet.add(s.id)
      students.push(
        dbStudentToStudent(
          s.id,
          s.student_id,
          profileMap.get(s.user_id)?.first_name ?? undefined,
          profileMap.get(s.user_id)?.last_name ?? undefined,
          profileMap.get(s.user_id)?.email ?? undefined,
        ),
      )
    }
  }

  for (const student of students) {
    student.cohortIds = studentIdToCohortIds.get(student.id) || []
  }

  const cohorts: Cohort[] = []
  for (const group of rawStudentGroups) {
    cohorts.push({
      id: group.id,
      name: group.name,
      code: group.code,
      description: group.description ?? undefined,
      studentIds: cohortStudentMap.get(group.id) || [],
    })
  }

  const cohortStudents = new Map<string, Set<string>>()
  for (const [groupId, memberIds] of cohortStudentMap.entries()) {
    cohortStudents.set(groupId, new Set(memberIds))
  }

  for (const section of sections) {
    if (section.studentGroupId) {
      const cohortStudentsSet = cohortStudents.get(section.studentGroupId)
      if (cohortStudentsSet) {
        for (const student of students) {
          if (cohortStudentsSet.has(student.id) && !student.cohortIds.includes(section.studentGroupId)) {
            student.cohortIds.push(section.studentGroupId)
          }
        }
      }
    }
  }

  for (const section of sections) {
    if (section.studentGroupId && !section.requiredFeatures.includes(section.studentGroupId)) {
    }
  }

  const timeSlots: TimeSlot[] = rawTimeSlots
    .filter((ts) => !ts.is_break)
    .sort((a, b) => a.slot_index - b.slot_index)
    .map(dbTimeSlotToTimeSlot)

  const holidays: DbHoliday[] = rawHolidays.filter((h) => h.affects_scheduling)

  return {
    termId,
    termStartDate: semesterData?.start_date || new Date().toISOString().split('T')[0],
    termEndDate: semesterData?.end_date || new Date().toISOString().split('T')[0],
    rooms,
    roomFeatures: rawFeatures,
    roomFeatureAssignments: rawFeatureAssignments,
    roomAvailability: rawRoomAvailability,
    instructorAvailability: rawInstructorAvailability,
    sections,
    meetings: sections.flatMap((s) => s.meetings),
    studentGroups: rawStudentGroups,
    cohortMembers: rawCohortMembers,
    timeSlots,
    holidays,
    moduleEnrollments: rawEnrollments,
    instructors,
    cohorts,
    students,
  }
}
