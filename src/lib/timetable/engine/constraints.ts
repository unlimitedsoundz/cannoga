import type {
  SchedulingProblem,
  SchedulingSolution,
  Assignment,
  ConstraintResult,
  Constraint,
  TimeSlot,
  Room,
  Section,
  Instructor,
} from './types'
import { Severity } from './types'

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

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

function getInstructorById(problem: SchedulingProblem, instructorId: string): Instructor | undefined {
  return problem.instructors.find((i) => i.id === instructorId)
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
  for (const ra of roomAvail) {
    if (ra.block_type === 'MAINTENANCE' || ra.block_type === 'BLOCKED') {
      const blockStart = toMinutes(ra.start_datetime.split('T')[1]?.substring(0, 5) || ra.start_datetime)
      const blockEnd = toMinutes(ra.end_datetime.split('T')[1]?.substring(0, 5) || ra.end_datetime)
      const slotStart = toMinutes(startTime)
      const slotEnd = toMinutes(endTime)
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

export class InstructorNoDoubleBooking implements Constraint {
  name = 'instructorNoDoubleBooking'
  type: 'HARD' = 'HARD'
  weight = 1000

  check(solution: SchedulingSolution, _problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    const instructorAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      if (!a.instructorId) continue
      const list = instructorAssignments.get(a.instructorId) || []
      list.push(a)
      instructorAssignments.set(a.instructorId, list)
    }

    for (const [instructorId, assignments] of instructorAssignments) {
      for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
          if (assignmentsOverlap(assignments[i], assignments[j])) {
            results.push({
              constraintName: this.name,
              passed: false,
              severity: Severity.HARD,
              description: `Instructor ${instructorId} is double-booked on day ${assignments[i].dayOfWeek} between ${assignments[i].startTime}-${assignments[i].endTime} and ${assignments[j].startTime}-${assignments[j].endTime}`,
              affectedAssignmentIds: [assignments[i].id, assignments[j].id],
              weight: this.weight,
            })
          }
        }
      }
    }

    return results
  }
}

export class RoomNoDoubleBooking implements Constraint {
  name = 'roomNoDoubleBooking'
  type: 'HARD' = 'HARD'
  weight = 1000

  check(solution: SchedulingSolution, _problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    const roomAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      const list = roomAssignments.get(a.roomId) || []
      list.push(a)
      roomAssignments.set(a.roomId, list)
    }

    for (const [roomId, assignments] of roomAssignments) {
      for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
          if (assignmentsOverlap(assignments[i], assignments[j])) {
            results.push({
              constraintName: this.name,
              passed: false,
              severity: Severity.HARD,
              description: `Room ${roomId} is double-booked on day ${assignments[i].dayOfWeek} between ${assignments[i].startTime}-${assignments[i].endTime} and ${assignments[j].startTime}-${assignments[j].endTime}`,
              affectedAssignmentIds: [assignments[i].id, assignments[j].id],
              weight: this.weight,
            })
          }
        }
      }
    }

    return results
  }
}

export class StudentNoDoubleBooking implements Constraint {
  name = 'studentNoDoubleBooking'
  type: 'HARD' = 'HARD'
  weight = 1000

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    const studentAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section) continue
      const students = getStudentsForSection(section, problem)
      for (const sid of students) {
        const list = studentAssignments.get(sid) || []
        list.push(a)
        studentAssignments.set(sid, list)
      }
    }

    for (const [studentId, assignments] of studentAssignments) {
      for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
          if (assignmentsOverlap(assignments[i], assignments[j])) {
            results.push({
              constraintName: this.name,
              passed: false,
              severity: Severity.HARD,
              description: `Student ${studentId} is double-booked on day ${assignments[i].dayOfWeek} between ${assignments[i].startTime}-${assignments[i].endTime} and ${assignments[j].startTime}-${assignments[j].endTime}`,
              affectedAssignmentIds: [assignments[i].id, assignments[j].id],
              weight: this.weight,
            })
          }
        }
      }
    }

    return results
  }
}

export class CapacityCheck implements Constraint {
  name = 'capacityCheck'
  type: 'HARD' = 'HARD'
  weight = 800

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const room = getRoomById(problem, a.roomId)
      const section = getSectionById(problem, a.sectionId)
      if (!room || !section) continue
      if (room.capacity < section.enrolledCount) {
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Room ${room.name} (capacity ${room.capacity}) is insufficient for section ${section.code} (enrollment ${section.enrolledCount})`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class RoomTypeMatch implements Constraint {
  name = 'roomTypeMatch'
  type: 'HARD' = 'HARD'
  weight = 800

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const room = getRoomById(problem, a.roomId)
      const section = getSectionById(problem, a.sectionId)
      if (!room || !section || !section.requiredRoomType) continue
      if (room.roomType !== section.requiredRoomType) {
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Section ${section.code} requires ${section.requiredRoomType} but assigned to ${room.roomType} room ${room.name}`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class RoomFeatureMatch implements Constraint {
  name = 'roomFeatureMatch'
  type: 'HARD' = 'HARD'
  weight = 800

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const room = getRoomById(problem, a.roomId)
      const section = getSectionById(problem, a.sectionId)
      if (!room || !section) continue
      const missing = section.requiredFeatures.filter((f) => !room.features.includes(f))
      if (missing.length > 0) {
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Room ${room.name} missing required features: ${missing.join(', ')} for section ${section.code}`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class InstructorAvailabilityConstraint implements Constraint {
  name = 'instructorAvailability'
  type: 'HARD' = 'HARD'
  weight = 800

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      if (!a.instructorId) continue
      const available = isInstructorAvailable(a.instructorId, a.dayOfWeek, a.startTime, a.endTime, problem)
      if (!available) {
        const instructor = getInstructorById(problem, a.instructorId)
        const name = instructor ? `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || a.instructorId : a.instructorId
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Instructor ${name} is unavailable on day ${a.dayOfWeek} at ${a.startTime}-${a.endTime}`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class RoomAvailabilityConstraint implements Constraint {
  name = 'roomAvailability'
  type: 'HARD' = 'HARD'
  weight = 800

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const available = isRoomAvailable(a.roomId, a.dayOfWeek, a.startTime, a.endTime, problem)
      if (!available) {
        const room = getRoomById(problem, a.roomId)
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Room ${room?.name || a.roomId} is blocked on day ${a.dayOfWeek} at ${a.startTime}-${a.endTime}`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class HolidayBlock implements Constraint {
  name = 'holidayBlock'
  type: 'HARD' = 'HARD'
  weight = 1000

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const dateStr = a.startDate
      if (isHolidayDate(dateStr, problem.holidays)) {
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Assignment on ${dateStr} falls on a holiday`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class ConsecutiveSessions implements Constraint {
  name = 'consecutiveSessions'
  type: 'HARD' = 'HARD'
  weight = 600

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    const sectionMeetings = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      const list = sectionMeetings.get(a.sectionId) || []
      list.push(a)
      sectionMeetings.set(a.sectionId, list)
    }

    for (const section of problem.sections) {
      if (!section.consecutiveSessions) continue
      const assignments = sectionMeetings.get(section.id)
      if (!assignments || assignments.length < 2) continue
      const sorted = assignments.sort((a, b) => a.meetingId.localeCompare(b.meetingId))
      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = sorted[i]
        const next = sorted[i + 1]
        if (curr.dayOfWeek !== next.dayOfWeek) {
          results.push({
            constraintName: this.name,
            passed: false,
            severity: Severity.HARD,
            description: `Section ${section.code} requires consecutive sessions but meetings are on different days`,
            affectedAssignmentIds: [curr.id, next.id],
            weight: this.weight,
          })
        }
        const gap = toMinutes(next.startTime) - toMinutes(curr.endTime)
        if (gap > 30) {
          results.push({
            constraintName: this.name,
            passed: false,
            severity: Severity.HARD,
            description: `Section ${section.code} requires consecutive sessions but has a ${gap} minute gap between meetings`,
            affectedAssignmentIds: [curr.id, next.id],
            weight: this.weight,
          })
        }
      }
    }

    return results
  }
}

export class ClinicalRoomMatch implements Constraint {
  name = 'clinicalRoomMatch'
  type: 'HARD' = 'HARD'
  weight = 900

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section || section.sessionType !== 'CLINICAL') continue
      const room = getRoomById(problem, a.roomId)
      if (!room || room.roomType !== 'CLINICAL_LAB') {
        results.push({
          constraintName: this.name,
          passed: false,
          severity: Severity.HARD,
          description: `Clinical section ${section.code} assigned to non-clinical room ${room?.name || a.roomId}`,
          affectedAssignmentIds: [a.id],
          weight: this.weight,
        })
      }
    }
    return results
  }
}

export class StudentGapMinimization implements Constraint {
  name = 'studentGapMinimization'
  type: 'SOFT' = 'SOFT'
  weight = 50

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let totalGaps = 0
    let gapCount = 0

    const studentAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section) continue
      const students = getStudentsForSection(section, problem)
      for (const sid of students) {
        const list = studentAssignments.get(sid) || []
        list.push(a)
        studentAssignments.set(sid, list)
      }
    }

    for (const [studentId, assignments] of studentAssignments) {
      const dayMap = new Map<number, Assignment[]>()
      for (const a of assignments) {
        const list = dayMap.get(a.dayOfWeek) || []
        list.push(a)
        dayMap.set(a.dayOfWeek, list)
      }
      for (const [day, dayAssignments] of dayMap) {
        if (dayAssignments.length < 2) continue
        const sorted = dayAssignments.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
        for (let i = 0; i < sorted.length - 1; i++) {
          const gap = toMinutes(sorted[i + 1].startTime) - toMinutes(sorted[i].endTime)
          if (gap > 0) {
            totalGaps += gap
            gapCount++
          }
        }
      }
    }

    const avgGap = gapCount > 0 ? totalGaps / gapCount : 0
    const score = Math.max(0, 100 - avgGap)
    results.push({
      constraintName: this.name,
      passed: avgGap <= 60,
      severity: Severity.SOFT,
      description: `Average student gap is ${avgGap.toFixed(1)} minutes (target <= 60). Score: ${score.toFixed(1)}`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class InstructorGapMinimization implements Constraint {
  name = 'instructorGapMinimization'
  type: 'SOFT' = 'SOFT'
  weight = 50

  check(solution: SchedulingSolution, _problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let totalGaps = 0
    let gapCount = 0

    const instructorAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      if (!a.instructorId) continue
      const list = instructorAssignments.get(a.instructorId) || []
      list.push(a)
      instructorAssignments.set(a.instructorId, list)
    }

    for (const [instructorId, assignments] of instructorAssignments) {
      const dayMap = new Map<number, Assignment[]>()
      for (const a of assignments) {
        const list = dayMap.get(a.dayOfWeek) || []
        list.push(a)
        dayMap.set(a.dayOfWeek, list)
      }
      for (const [day, dayAssignments] of dayMap) {
        if (dayAssignments.length < 2) continue
        const sorted = dayAssignments.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
        for (let i = 0; i < sorted.length - 1; i++) {
          const gap = toMinutes(sorted[i + 1].startTime) - toMinutes(sorted[i].endTime)
          if (gap > 0) {
            totalGaps += gap
            gapCount++
          }
        }
      }
    }

    const avgGap = gapCount > 0 ? totalGaps / gapCount : 0
    const score = Math.max(0, 100 - avgGap)
    results.push({
      constraintName: this.name,
      passed: avgGap <= 60,
      severity: Severity.SOFT,
      description: `Average instructor gap is ${avgGap.toFixed(1)} minutes (target <= 60). Score: ${score.toFixed(1)}`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class BuildingChangeMinimization implements Constraint {
  name = 'buildingChangeMinimization'
  type: 'SOFT' = 'SOFT'
  weight = 30

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let totalChanges = 0
    let studentCount = 0

    const studentAssignments = new Map<string, Assignment[]>()

    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section) continue
      const students = getStudentsForSection(section, problem)
      for (const sid of students) {
        const list = studentAssignments.get(sid) || []
        list.push(a)
        studentAssignments.set(sid, list)
      }
    }

    for (const [studentId, assignments] of studentAssignments) {
      const dayMap = new Map<number, Assignment[]>()
      for (const a of assignments) {
        const list = dayMap.get(a.dayOfWeek) || []
        list.push(a)
        dayMap.set(a.dayOfWeek, list)
      }
      for (const [day, dayAssignments] of dayMap) {
        if (dayAssignments.length < 2) continue
        const sorted = dayAssignments.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
        for (let i = 0; i < sorted.length - 1; i++) {
          const roomA = getRoomById(problem, sorted[i].roomId)
          const roomB = getRoomById(problem, sorted[i + 1].roomId)
          if (roomA && roomB && roomA.building !== roomB.building) {
            totalChanges++
          }
        }
        studentCount++
      }
    }

    const avgChanges = studentCount > 0 ? totalChanges / studentCount : 0
    const score = Math.max(0, 100 - avgChanges * 20)
    results.push({
      constraintName: this.name,
      passed: avgChanges <= 1,
      severity: Severity.SOFT,
      description: `Average building changes per student per day is ${avgChanges.toFixed(2)} (target <= 1). Score: ${score.toFixed(1)}`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class RoomUtilization implements Constraint {
  name = 'roomUtilization'
  type: 'SOFT' = 'SOFT'
  weight = 40

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let totalFit = 0
    let count = 0

    for (const a of solution.assignments) {
      const room = getRoomById(problem, a.roomId)
      const section = getSectionById(problem, a.sectionId)
      if (!room || !section) continue
      const ratio = section.enrolledCount / room.capacity
      const fit = ratio >= 0.5 && ratio <= 1.0 ? 100 : Math.max(0, 100 - Math.abs(ratio - 0.75) * 200)
      totalFit += fit
      count++
    }

    const avgFit = count > 0 ? totalFit / count : 0
    results.push({
      constraintName: this.name,
      passed: avgFit >= 70,
      severity: Severity.SOFT,
      description: `Average room utilization fit score is ${avgFit.toFixed(1)} (target >= 70)`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class PreferredTimes implements Constraint {
  name = 'preferredTimes'
  type: 'SOFT' = 'SOFT'
  weight = 40

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let matched = 0
    let total = 0

    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section || section.preferredTimes.length === 0) continue
      total++
      const startHour = Math.floor(toMinutes(a.startTime) / 60)
      const preferred = section.preferredTimes.some((pt) => {
        const [ph, pm] = pt.split(':').map(Number)
        return Math.abs(startHour - ph) <= 1
      })
      if (preferred) matched++
    }

    const ratio = total > 0 ? matched / total : 1
    results.push({
      constraintName: this.name,
      passed: ratio >= 0.7,
      severity: Severity.SOFT,
      description: `${(ratio * 100).toFixed(1)}% of assignments match preferred times`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class PreferredDays implements Constraint {
  name = 'preferredDays'
  type: 'SOFT' = 'SOFT'
  weight = 30

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    let matched = 0
    let total = 0

    for (const a of solution.assignments) {
      const section = getSectionById(problem, a.sectionId)
      if (!section || section.preferredDays.length === 0) continue
      total++
      if (section.preferredDays.includes(a.dayOfWeek)) {
        matched++
      }
    }

    const ratio = total > 0 ? matched / total : 1
    results.push({
      constraintName: this.name,
      passed: ratio >= 0.7,
      severity: Severity.SOFT,
      description: `${(ratio * 100).toFixed(1)}% of assignments match preferred days`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export class DailyBalance implements Constraint {
  name = 'dailyBalance'
  type: 'SOFT' = 'SOFT'
  weight = 20

  check(solution: SchedulingSolution, problem: SchedulingProblem): ConstraintResult[] {
    const results: ConstraintResult[] = []
    const dayCounts = new Map<number, number>()
    for (const a of solution.assignments) {
      dayCounts.set(a.dayOfWeek, (dayCounts.get(a.dayOfWeek) || 0) + 1)
    }
    const counts = Array.from(dayCounts.values())
    if (counts.length === 0) {
      results.push({
        constraintName: this.name,
        passed: true,
        severity: Severity.SOFT,
        description: 'No assignments to evaluate daily balance',
        affectedAssignmentIds: [],
        weight: this.weight,
      })
      return results
    }
    const max = Math.max(...counts)
    const min = Math.min(...counts)
    const spread = max - min
    const score = Math.max(0, 100 - spread * 20)
    results.push({
      constraintName: this.name,
      passed: spread <= 2,
      severity: Severity.SOFT,
      description: `Daily class distribution spread is ${spread} (max ${max}, min ${min}). Score: ${score.toFixed(1)}`,
      affectedAssignmentIds: solution.assignments.map((a) => a.id),
      weight: this.weight,
    })

    return results
  }
}

export const HARD_CONSTRAINTS: Constraint[] = [
  new InstructorNoDoubleBooking(),
  new RoomNoDoubleBooking(),
  new StudentNoDoubleBooking(),
  new CapacityCheck(),
  new RoomTypeMatch(),
  new RoomFeatureMatch(),
  new InstructorAvailabilityConstraint(),
  new RoomAvailabilityConstraint(),
  new HolidayBlock(),
  new ConsecutiveSessions(),
  new ClinicalRoomMatch(),
]

export const SOFT_CONSTRAINTS: Constraint[] = [
  new StudentGapMinimization(),
  new InstructorGapMinimization(),
  new BuildingChangeMinimization(),
  new RoomUtilization(),
  new PreferredTimes(),
  new PreferredDays(),
  new DailyBalance(),
]

export const ALL_CONSTRAINTS: Constraint[] = [...HARD_CONSTRAINTS, ...SOFT_CONSTRAINTS]
