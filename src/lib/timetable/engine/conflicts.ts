import type { SchedulingProblem, SchedulingSolution, Assignment, Conflict, TimeSlot, Room, Section } from './types'
import { ConflictType, Severity } from './types'
import { toMinutes } from './constraints'

function assignmentsOverlap(a: Assignment, b: Assignment): boolean {
  if (a.dayOfWeek !== b.dayOfWeek) return false
  return toMinutes(a.startTime) < toMinutes(b.endTime) && toMinutes(b.startTime) < toMinutes(a.endTime)
}

function getSectionById(problem: SchedulingProblem, sectionId: string): Section | undefined {
  return problem.sections.find((s) => s.id === sectionId)
}

function getRoomById(problem: SchedulingProblem, roomId: string): Room | undefined {
  return problem.rooms.find((r) => r.id === roomId)
}

function getStudentsForSection(section: Section, problem: SchedulingProblem): Set<string> {
  const studentIds = new Set<string>()
  if (section.studentGroupId) {
    for (const cohort of problem.cohorts) {
      if (cohort.id === section.studentGroupId) {
        for (const sid of cohort.studentIds) {
          studentIds.add(sid)
        }
      }
    }
    for (const cm of problem.cohortMembers) {
      if (cm.group_id === section.studentGroupId) {
        studentIds.add(cm.student_id)
      }
    }
  }
  for (const enrollment of problem.moduleEnrollments) {
    if (enrollment.module_id === section.moduleId && enrollment.semester_id === section.semesterId) {
      studentIds.add(enrollment.student_id)
    }
  }
  return studentIds
}

function isHolidayDate(dateStr: string, holidays: SchedulingProblem['holidays']): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  return holidays.some((h) => {
    const start = new Date(h.start_date + 'T00:00:00')
    const end = new Date(h.end_date + 'T00:00:00')
    return date >= start && date <= end && h.affects_scheduling
  })
}

function isRoomAvailable(
  roomId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  problem: SchedulingProblem,
): boolean {
  const roomAvail = problem.roomAvailability.filter((ra) => ra.room_id === roomId)
  const slotStart = toMinutes(startTime)
  const slotEnd = toMinutes(endTime)
  for (const ra of roomAvail) {
    if (ra.block_type === 'MAINTENANCE' || ra.block_type === 'BLOCKED') {
      const blockStart = toMinutes(ra.start_datetime.split('T')[1]?.substring(0, 5) || ra.start_datetime)
      const blockEnd = toMinutes(ra.end_datetime.split('T')[1]?.substring(0, 5) || ra.end_datetime)
      if (slotStart < blockEnd && blockStart < slotEnd) {
        return false
      }
    }
  }
  return true
}

function isInstructorAvailable(
  instructorId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  problem: SchedulingProblem,
): boolean {
  const availSlots = problem.instructorAvailability.filter((ia) => ia.instructor_id === instructorId)
  const slotStart = toMinutes(startTime)
  const slotEnd = toMinutes(endTime)
  for (const ia of availSlots) {
    if (ia.day_of_week !== dayOfWeek) continue
    const availStart = toMinutes(ia.start_time)
    const availEnd = toMinutes(ia.end_time)
    if (ia.availability_type === 'UNAVAILABLE') {
      if (slotStart < availEnd && availStart < slotEnd) {
        return false
      }
    }
  }
  return true
}

export function detectConflicts(solution: SchedulingSolution, problem: SchedulingProblem): Conflict[] {
  const conflicts: Conflict[] = []
  const assignments = solution.assignments
  let conflictIdCounter = 1

  for (let i = 0; i < assignments.length; i++) {
    for (let j = i + 1; j < assignments.length; j++) {
      const a = assignments[i]
      const b = assignments[j]

      const sectionA = getSectionById(problem, a.sectionId)
      const sectionB = getSectionById(problem, b.sectionId)
      if (!sectionA || !sectionB) continue

      const roomA = getRoomById(problem, a.roomId)
      const roomB = getRoomById(problem, b.roomId)

      if (a.instructorId && a.instructorId === b.instructorId && assignmentsOverlap(a, b)) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.INSTRUCTOR_DOUBLE_BOOKING,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: b.id,
          description: `Instructor ${a.instructorId} is assigned to both ${sectionA.code} and ${sectionB.code} on day ${a.dayOfWeek} during overlapping times`,
          suggestedResolution: `Reschedule one of the sessions or assign a different instructor`,
          affectedInstructorId: a.instructorId,
        })
      }

      if (a.roomId === b.roomId && assignmentsOverlap(a, b)) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.ROOM_DOUBLE_BOOKING,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: b.id,
          description: `Room ${roomA?.name || a.roomId} is assigned to both ${sectionA.code} and ${sectionB.code} on day ${a.dayOfWeek} during overlapping times`,
          suggestedResolution: `Reschedule one session to a different room or time slot`,
          affectedRoomId: a.roomId,
        })
      }

      if (assignmentsOverlap(a, b)) {
        const studentsA = getStudentsForSection(sectionA, problem)
        const studentsB = getStudentsForSection(sectionB, problem)
        const commonStudents = Array.from(studentsA).filter((sid) => studentsB.has(sid))
        if (commonStudents.length > 0) {
          conflicts.push({
            id: `conflict-${conflictIdCounter++}`,
            type: ConflictType.STUDENT_DOUBLE_BOOKING,
            severity: Severity.HARD,
            assignmentAId: a.id,
            assignmentBId: b.id,
            description: `${commonStudents.length} students are double-booked between ${sectionA.code} and ${sectionB.code} on day ${a.dayOfWeek}`,
            suggestedResolution: `Reschedule one session to avoid overlap for shared students`,
            affectedStudentIds: commonStudents,
          })
        }
      }

      if (roomA && sectionA.enrolledCount > roomA.capacity) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.CAPACITY_OVERFLOW,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Room ${roomA.name} (capacity ${roomA.capacity}) is too small for section ${sectionA.code} (enrollment ${sectionA.enrolledCount})`,
          suggestedResolution: `Assign to a larger room`,
        })
      }

      if (sectionA.requiredRoomType && roomA && roomA.roomType !== sectionA.requiredRoomType) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.ROOM_TYPE_MISMATCH,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Section ${sectionA.code} requires ${sectionA.requiredRoomType} but assigned to ${roomA.roomType} room ${roomA.name}`,
          suggestedResolution: `Reassign to a room of type ${sectionA.requiredRoomType}`,
          affectedRoomId: a.roomId,
        })
      }

      if (sectionA.requiredFeatures.length > 0 && roomA) {
        const missing = sectionA.requiredFeatures.filter((f) => !roomA.features.includes(f))
        if (missing.length > 0) {
          conflicts.push({
            id: `conflict-${conflictIdCounter++}`,
            type: ConflictType.FEATURE_MISSING,
            severity: Severity.HARD,
            assignmentAId: a.id,
            assignmentBId: a.id,
            description: `Room ${roomA.name} is missing required features: ${missing.join(', ')} for section ${sectionA.code}`,
            suggestedResolution: `Assign to a room with all required features`,
            affectedRoomId: a.roomId,
          })
        }
      }

      if (a.instructorId && !isInstructorAvailable(a.instructorId, a.dayOfWeek, a.startTime, a.endTime, problem)) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.INSTRUCTOR_UNAVAILABLE,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Instructor ${a.instructorId} is unavailable on day ${a.dayOfWeek} at ${a.startTime}-${a.endTime} for section ${sectionA.code}`,
          suggestedResolution: `Reschedule to a time when instructor is available`,
          affectedInstructorId: a.instructorId,
        })
      }

      if (!isRoomAvailable(a.roomId, a.dayOfWeek, a.startTime, a.endTime, problem)) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.ROOM_UNAVAILABLE,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Room ${roomA?.name || a.roomId} is blocked on day ${a.dayOfWeek} at ${a.startTime}-${a.endTime} for section ${sectionA.code}`,
          suggestedResolution: `Reschedule to a time when room is available`,
          affectedRoomId: a.roomId,
        })
      }

      if (isHolidayDate(a.startDate, problem.holidays)) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.HOLIDAY_CONFLICT,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Assignment for section ${sectionA.code} falls on a holiday`,
          suggestedResolution: `Reschedule to a non-holiday date`,
        })
      }

      if (sectionA.sessionType === 'CLINICAL' && (!roomA || roomA.roomType !== 'CLINICAL_LAB')) {
        conflicts.push({
          id: `conflict-${conflictIdCounter++}`,
          type: ConflictType.CLINICAL_ROOM_MISMATCH,
          severity: Severity.HARD,
          assignmentAId: a.id,
          assignmentBId: a.id,
          description: `Clinical section ${sectionA.code} is assigned to non-clinical room ${roomA?.name || a.roomId}`,
          suggestedResolution: `Assign to a clinical lab room`,
          affectedRoomId: a.roomId,
        })
      }

      if (sectionA.consecutiveSessions && a.meetingId !== b.meetingId) {
        const meetingA = sectionA.meetings.find((m) => m.id === a.meetingId)
        const meetingB = sectionA.meetings.find((m) => m.id === b.meetingId)
        if (meetingA && meetingB && a.sectionId === b.sectionId) {
          if (a.dayOfWeek !== b.dayOfWeek) {
            conflicts.push({
              id: `conflict-${conflictIdCounter++}`,
              type: ConflictType.CONSECUTIVE_SESSION_VIOLATION,
              severity: Severity.HARD,
              assignmentAId: a.id,
              assignmentBId: b.id,
              description: `Section ${sectionA.code} requires consecutive sessions but meetings are on different days`,
              suggestedResolution: `Schedule consecutive meetings on the same day`,
            })
          } else {
            const gap = toMinutes(b.startTime) - toMinutes(a.endTime)
            if (gap > 30) {
              conflicts.push({
                id: `conflict-${conflictIdCounter++}`,
                type: ConflictType.CONSECUTIVE_SESSION_VIOLATION,
                severity: Severity.HARD,
                assignmentAId: a.id,
                assignmentBId: b.id,
                description: `Section ${sectionA.code} requires consecutive sessions but has a ${gap} minute gap`,
                suggestedResolution: `Schedule meetings consecutively without gaps`,
              })
            }
          }
        }
      }
    }
  }

  return conflicts
}
