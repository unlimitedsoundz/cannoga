import type {
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
  SessionType as DbSessionType,
  DeliveryMode as DbDeliveryMode,
  RoomType as DbRoomType,
  ConflictSeverity as DbConflictSeverity,
} from '@/types/database'

export enum SessionType {
  LECTURE = 'LECTURE',
  LAB = 'LAB',
  SEMINAR = 'SEMINAR',
  TUTORIAL = 'TUTORIAL',
  PRACTICAL = 'PRACTICAL',
  CLINICAL = 'CLINICAL',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
}

export enum DeliveryMode {
  IN_PERSON = 'IN_PERSON',
  ONLINE = 'ONLINE',
  HYBRID = 'HYBRID',
  SYNC_ONLINE = 'SYNC_ONLINE',
}

export enum RoomType {
  LECTURE_ROOM = 'LECTURE_ROOM',
  LAB = 'LAB',
  COMPUTER_LAB = 'COMPUTER_LAB',
  SCIENCE_LAB = 'SCIENCE_LAB',
  SEMINAR_ROOM = 'SEMINAR_ROOM',
  AUDITORIUM = 'AUDITORIUM',
  CLINICAL_LAB = 'CLINICAL_LAB',
  SPECIALIZED_ROOM = 'SPECIALIZED_ROOM',
  ONLINE = 'ONLINE',
}

export enum ConflictType {
  INSTRUCTOR_DOUBLE_BOOKING = 'INSTRUCTOR_DOUBLE_BOOKING',
  ROOM_DOUBLE_BOOKING = 'ROOM_DOUBLE_BOOKING',
  STUDENT_DOUBLE_BOOKING = 'STUDENT_DOUBLE_BOOKING',
  CAPACITY_OVERFLOW = 'CAPACITY_OVERFLOW',
  ROOM_TYPE_MISMATCH = 'ROOM_TYPE_MISMATCH',
  FEATURE_MISSING = 'FEATURE_MISSING',
  INSTRUCTOR_UNAVAILABLE = 'INSTRUCTOR_UNAVAILABLE',
  ROOM_UNAVAILABLE = 'ROOM_UNAVAILABLE',
  HOLIDAY_CONFLICT = 'HOLIDAY_CONFLICT',
  CONSECUTIVE_SESSION_VIOLATION = 'CONSECUTIVE_SESSION_VIOLATION',
  CLINICAL_ROOM_MISMATCH = 'CLINICAL_ROOM_MISMATCH',
}

export enum Severity {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export interface TimeSlot {
  id: string
  slotIndex: number
  dayOfWeek: number
  startTime: string
  endTime: string
  durationMinutes: number
  isBreak: boolean
  breakName?: string
}

export interface Room {
  id: string
  name: string
  building: string
  floor?: string
  roomNumber: string
  capacity: number
  roomType: RoomType
  campus: string
  accessibility: boolean
  equipment?: Record<string, any>
  status: string
  notes?: string
  features: string[]
}

export interface InstructorAvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  availabilityType: 'AVAILABLE' | 'UNAVAILABLE'
  effectiveDate: string
  expiryDate?: string
}

export interface Instructor {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  departmentId?: string
  availability: InstructorAvailabilitySlot[]
}

export interface Student {
  id: string
  studentId: string
  firstName?: string
  lastName?: string
  email?: string
  cohortIds: string[]
}

export interface Cohort {
  id: string
  name: string
  code: string
  description?: string
  studentIds: string[]
}

export interface Meeting {
  id: string
  sectionId: string
  meetingIndex: number
  dayOfWeek: number
  startTime: string
  endTime: string
  durationMinutes: number
  isFixed: boolean
  fixedRoomId?: string
  fixedInstructorId?: string
}

export interface Section {
  id: string
  code: string
  moduleId: string
  semesterId: string
  instructorId?: string
  capacity: number
  enrolledCount: number
  sessionType: SessionType
  deliveryMode: DeliveryMode
  requiredRoomType?: RoomType
  requiredFeatures: string[]
  durationMinutes: number
  meetingsPerWeek: number
  consecutiveSessions: boolean
  maxDailySessions?: number
  preferredDays: number[]
  blockedDays: number[]
  preferredTimes: string[]
  blockedTimes: string[]
  studentGroupId?: string
  departmentId?: string
  notes?: string
  status: string
  meetings: Meeting[]
}

export interface Assignment {
  id: string
  sectionId: string
  meetingId: string
  roomId: string
  instructorId?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  isOverride: boolean
  overrideReason?: string
  metadata?: Record<string, any>
}

export interface Conflict {
  id: string
  type: ConflictType
  severity: Severity
  assignmentAId: string
  assignmentBId: string
  description: string
  suggestedResolution?: string
  affectedStudentIds?: string[]
  affectedInstructorId?: string
  affectedRoomId?: string
}

export interface Score {
  id?: string
  runId?: string
  versionId?: string
  overallScore: number
  hardViolationCount: number
  softViolationCount: number
  studentGapScore: number
  instructorGapScore: number
  roomUtilizationScore: number
  buildingChangeScore: number
  preferenceScore: number
  details?: Record<string, any>
}

export interface SchedulingProblem {
  termId: string
  termStartDate: string
  termEndDate: string
  rooms: Room[]
  roomFeatures: DbRoomFeature[]
  roomFeatureAssignments: DbRoomFeatureAssignment[]
  roomAvailability: DbRoomAvailability[]
  instructorAvailability: DbInstructorAvailability[]
  sections: Section[]
  meetings: Meeting[]
  studentGroups: DbStudentGroup[]
  cohortMembers: DbCohortMember[]
  timeSlots: TimeSlot[]
  holidays: DbHoliday[]
  moduleEnrollments: DbModuleEnrollment[]
  instructors: Instructor[]
  cohorts: Cohort[]
  students: Student[]
}

export interface UnschedulableSection {
  sectionId: string
  reason: string
  constraints: string[]
}

export interface SchedulingStats {
  totalSections: number
  scheduledSections: number
  unschedulableSections: number
  totalAssignments: number
  hardViolations: number
  softViolations: number
  averageGapsPerStudent: number
  averageGapsPerInstructor: number
  roomUtilization: number
  preferenceScore: number
  overallScore: number
}

export interface SchedulingSolution {
  problem: SchedulingProblem
  assignments: Assignment[]
  conflicts: Conflict[]
  score: Score
  unschedulableSections: UnschedulableSection[]
  stats: SchedulingStats
}

export interface ValidationResult {
  isValid: boolean
  hardViolations: Conflict[]
  softViolations: Conflict[]
  score: Score
  message: string
}

export interface ConstraintParameters {
  [key: string]: any
}

export interface ConstraintResult {
  constraintName: string
  passed: boolean
  severity: Severity
  description: string
  affectedAssignmentIds: string[]
  weight: number
}

export interface Constraint {
  name: string
  type: 'HARD' | 'SOFT'
  weight: number
  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[]
}

export interface SchedulingConstraint {
  name: string
  type: 'HARD' | 'SOFT'
  weight: number
  parameters: ConstraintParameters
}

export function dbRoomToRoom(row: DbRoom, featureIds: string[]): Room {
  return {
    id: row.id,
    name: row.name,
    building: row.building,
    floor: row.floor ?? undefined,
    roomNumber: row.room_number,
    capacity: row.capacity,
    roomType: row.room_type as RoomType,
    campus: row.campus,
    accessibility: row.accessibility,
    equipment: row.equipment,
    status: row.status,
    notes: row.notes ?? undefined,
    features: featureIds,
  }
}

export function dbSectionToSection(
  row: DbCourseSection,
  meetings: Meeting[],
): Section {
  const rawRequiredFeatures = row.required_features
  let requiredFeatures: string[] = []
  if (Array.isArray(rawRequiredFeatures)) {
    requiredFeatures = rawRequiredFeatures.filter((v): v is string => typeof v === 'string')
  } else if (rawRequiredFeatures && typeof rawRequiredFeatures === 'object') {
    const obj = rawRequiredFeatures as Record<string, any>
    if (Array.isArray(obj.features)) {
      requiredFeatures = obj.features.filter((v): v is string => typeof v === 'string')
    } else if (Array.isArray(obj.ids)) {
      requiredFeatures = obj.ids.filter((v): v is string => typeof v === 'string')
    }
  }

  return {
    id: row.id,
    code: row.code,
    moduleId: row.module_id,
    semesterId: row.semester_id,
    instructorId: row.instructor_id ?? undefined,
    capacity: row.capacity,
    enrolledCount: row.enrolled_count,
    sessionType: row.session_type as SessionType,
    deliveryMode: row.delivery_mode as DeliveryMode,
    requiredRoomType: row.required_room_type ? (row.required_room_type as RoomType) : undefined,
    requiredFeatures,
    durationMinutes: row.duration_minutes,
    meetingsPerWeek: row.meetings_per_week,
    consecutiveSessions: row.consecutive_sessions,
    maxDailySessions: row.max_daily_sessions ?? undefined,
    preferredDays: Array.isArray(row.preferred_days) ? row.preferred_days : [],
    blockedDays: Array.isArray(row.blocked_days) ? row.blocked_days : [],
    preferredTimes: Array.isArray(row.preferred_times) ? row.preferred_times : [],
    blockedTimes: Array.isArray(row.blocked_times) ? row.blocked_times : [],
    studentGroupId: row.student_group_id ?? undefined,
    departmentId: row.department_id ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    meetings,
  }
}

export function dbMeetingToMeeting(row: DbCourseSectionMeeting): Meeting {
  return {
    id: row.id,
    sectionId: row.section_id,
    meetingIndex: row.meeting_index,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMinutes: row.duration_minutes,
    isFixed: row.is_fixed,
    fixedRoomId: row.room_id ?? undefined,
    fixedInstructorId: row.instructor_id ?? undefined,
  }
}

export function dbTimeSlotToTimeSlot(row: DbTimeSlot): TimeSlot {
  return {
    id: row.id,
    slotIndex: row.slot_index,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMinutes: row.slot_duration,
    isBreak: row.is_break,
    breakName: row.break_name ?? undefined,
  }
}

export function dbInstructorToInstructor(
  id: string,
  availability: InstructorAvailabilitySlot[],
): Instructor {
  return {
    id,
    availability,
  }
}

export function dbStudentToStudent(
  id: string,
  studentId: string,
  firstName?: string,
  lastName?: string,
  email?: string,
): Student {
  return {
    id,
    studentId,
    firstName,
    lastName,
    email,
    cohortIds: [],
  }
}
