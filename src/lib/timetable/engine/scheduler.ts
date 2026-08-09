import { SchedulingProblem, SchedulingSolution, Assignment, SchedulingStats, UnschedulableSection, TimeSlot, Room, Meeting, Section, Severity } from './types'
import { HARD_CONSTRAINTS } from './constraints'
import { toMinutes } from './constraints'

function toMinutesFrom(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
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
  const slotStart = toMinutesFrom(startTime)
  const slotEnd = toMinutesFrom(endTime)
  for (const ra of roomAvail) {
    if (ra.block_type === 'MAINTENANCE' || ra.block_type === 'BLOCKED') {
      const blockStart = toMinutesFrom(ra.start_datetime.split('T')[1]?.substring(0, 5) || ra.start_datetime)
      const blockEnd = toMinutesFrom(ra.end_datetime.split('T')[1]?.substring(0, 5) || ra.end_datetime)
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
  const slotStart = toMinutesFrom(startTime)
  const slotEnd = toMinutesFrom(endTime)
  for (const ia of availSlots) {
    if (ia.day_of_week !== dayOfWeek) continue
    const availStart = toMinutesFrom(ia.start_time)
    const availEnd = toMinutesFrom(ia.end_time)
    if (ia.availability_type === 'UNAVAILABLE') {
      if (slotStart < availEnd && availStart < slotEnd) {
        return false
      }
    }
  }
  return true
}

interface Candidate {
  roomId: string
  timeSlot: TimeSlot
  score: number
}

function computeCandidates(
  meeting: Meeting,
  section: Section,
  problem: SchedulingProblem,
  assignedSoFar: Assignment[],
): Candidate[] {
  const candidates: Candidate[] = []
  const duration = section.durationMinutes || meeting.durationMinutes

  let eligibleRooms: Room[] = problem.rooms.filter((r) => r.status === 'ACTIVE')
  if (meeting.isFixed && meeting.fixedRoomId) {
    eligibleRooms = eligibleRooms.filter((r) => r.id === meeting.fixedRoomId)
  } else if (section.requiredRoomType) {
    eligibleRooms = eligibleRooms.filter((r) => r.roomType === section.requiredRoomType)
  }
  if (section.requiredFeatures.length > 0) {
    eligibleRooms = eligibleRooms.filter((r) => {
      const roomFeatureIds = r.features.map(f => f.featureId)
      return section.requiredFeatures.every((req) => {
        const featureName = req.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '')
        return roomFeatureIds.some(fid => {
          const feature = problem.roomFeatures.find(rf => rf.id === fid)
          return feature?.name.toLowerCase().includes(featureName) || featureName.includes(feature?.name.toLowerCase() || '')
        })
      })
    })
  }

  const eligibleSlots = problem.timeSlots.filter((ts) => {
    if (ts.isBreak) return false
    if (section.blockedDays.includes(ts.dayOfWeek)) return false
    if (section.preferredDays.length > 0 && !section.preferredDays.includes(ts.dayOfWeek)) return false
    const slotEnd = toMinutesFrom(ts.endTime)
    const slotStart = toMinutesFrom(ts.startTime)
    if (slotEnd - slotStart < duration) return false
    return true
  })

  const instructorId = meeting.fixedInstructorId || section.instructorId

  for (const room of eligibleRooms) {
    if (room.capacity < section.enrolledCount) continue
    for (const slot of eligibleSlots) {
      if (isHolidayDate(slot.startTime, problem.holidays)) continue
      if (!isRoomAvailable(room.id, slot.dayOfWeek, slot.startTime, slot.endTime, problem)) continue
      if (instructorId && !isInstructorAvailable(instructorId, slot.dayOfWeek, slot.startTime, slot.endTime, problem)) continue

      let hardViolations = 0
      const dummyAssignment: Assignment = {
        id: `temp-${meeting.id}-${room.id}-${slot.id}`,
        sectionId: section.id,
        meetingId: meeting.id,
        roomId: room.id,
        instructorId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        startDate: problem.termId,
        endDate: problem.termId,
        isOverride: false,
      }

      for (const existing of assignedSoFar) {
        if (existing.roomId === room.id && existing.dayOfWeek === slot.dayOfWeek) {
          const es = toMinutesFrom(existing.startTime)
          const ee = toMinutesFrom(existing.endTime)
          const ns = toMinutesFrom(slot.startTime)
          const ne = toMinutesFrom(slot.endTime)
          if (ns < ee && es < ne) {
            hardViolations++
          }
        }
        if (instructorId && existing.instructorId === instructorId && existing.dayOfWeek === slot.dayOfWeek) {
          const es = toMinutesFrom(existing.startTime)
          const ee = toMinutesFrom(existing.endTime)
          const ns = toMinutesFrom(slot.startTime)
          const ne = toMinutesFrom(slot.endTime)
          if (ns < ee && es < ne) {
            hardViolations++
          }
        }
      }

      let preferenceScore = 100
      if (section.preferredDays.includes(slot.dayOfWeek)) {
        preferenceScore += 10
      }
      if (section.preferredTimes.some((pt) => {
        const [ph, pm] = pt.split(':').map(Number)
        const sh = Math.floor(toMinutesFrom(slot.startTime) / 60)
        return Math.abs(sh - ph) <= 1
      })) {
        preferenceScore += 10
      }
      const ratio = section.enrolledCount / room.capacity
      if (ratio >= 0.5 && ratio <= 1.0) {
        preferenceScore += 10
      } else if (ratio > 1) {
        preferenceScore -= 1000
      }

      candidates.push({
        roomId: room.id,
        timeSlot: slot,
        score: preferenceScore - hardViolations * 1000,
      })
    }
  }

  candidates.sort((a, b) => b.score - a.score)
  return candidates
}

function buildStats(problem: SchedulingProblem, assignments: Assignment[], unschedulable: UnschedulableSection[]): SchedulingStats {
  const totalSections = problem.sections.length
  const scheduledSections = new Set(assignments.map((a) => a.sectionId)).size
  const unschedulableCount = unschedulable.length
  const totalAssignments = assignments.length

  let hardViolations = 0
  let softViolations = 0

  let totalGaps = 0
  let gapCount = 0
  const studentAssignments = new Map<string, Assignment[]>()
  for (const a of assignments) {
    const section = problem.sections.find((s) => s.id === a.sectionId)
    if (!section) continue
    const students = new Set<string>()
    if (section.studentGroupId) {
      for (const cohort of problem.cohorts) {
        if (cohort.id === section.studentGroupId) {
          for (const sid of cohort.studentIds) students.add(sid)
        }
      }
      for (const cm of problem.cohortMembers) {
        if (cm.group_id === section.studentGroupId) students.add(cm.student_id)
      }
    }
    for (const e of problem.moduleEnrollments) {
      if (e.module_id === section.moduleId && e.semester_id === section.semesterId) students.add(e.student_id)
    }
    for (const sid of students) {
      const list = studentAssignments.get(sid) || []
      list.push(a)
      studentAssignments.set(sid, list)
    }
  }
  for (const [sid, asgns] of studentAssignments) {
    const dayMap = new Map<number, Assignment[]>()
    for (const a of asgns) {
      const list = dayMap.get(a.dayOfWeek) || []
      list.push(a)
      dayMap.set(a.dayOfWeek, list)
    }
    for (const [day, dayAsgns] of dayMap) {
      if (dayAsgns.length < 2) continue
      const sorted = dayAsgns.sort((a, b) => toMinutesFrom(a.startTime) - toMinutesFrom(b.startTime))
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = toMinutesFrom(sorted[i + 1].startTime) - toMinutesFrom(sorted[i].endTime)
        if (gap > 0) {
          totalGaps += gap
          gapCount++
        }
      }
    }
  }
  const avgGap = gapCount > 0 ? totalGaps / gapCount : 0

  let instructorGaps = 0
  let instructorGapCount = 0
  const instructorAssignments = new Map<string, Assignment[]>()
  for (const a of assignments) {
    if (!a.instructorId) continue
    const list = instructorAssignments.get(a.instructorId) || []
    list.push(a)
    instructorAssignments.set(a.instructorId, list)
  }
  for (const [iid, asgns] of instructorAssignments) {
    const dayMap = new Map<number, Assignment[]>()
    for (const a of asgns) {
      const list = dayMap.get(a.dayOfWeek) || []
      list.push(a)
      dayMap.set(a.dayOfWeek, list)
    }
    for (const [day, dayAsgns] of dayMap) {
      if (dayAsgns.length < 2) continue
      const sorted = dayAsgns.sort((a, b) => toMinutesFrom(a.startTime) - toMinutesFrom(b.startTime))
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = toMinutesFrom(sorted[i + 1].startTime) - toMinutesFrom(sorted[i].endTime)
        if (gap > 0) {
          instructorGaps += gap
          instructorGapCount++
        }
      }
    }
  }
  const avgInstructorGap = instructorGapCount > 0 ? instructorGaps / instructorGapCount : 0

  const roomUtilization = assignments.length > 0
    ? assignments.reduce((sum, a) => {
        const room = problem.rooms.find((r) => r.id === a.roomId)
        const section = problem.sections.find((s) => s.id === a.sectionId)
        if (!room || !section) return sum
        return sum + Math.min(1, section.enrolledCount / room.capacity)
      }, 0) / assignments.length
    : 0

  const preferenceScore = Math.max(0, 100 - avgGap - avgInstructorGap / 10)

  const overallScore = Math.max(0, 100 - hardViolations * 10 - softViolations * 2)

  return {
    totalSections,
    scheduledSections,
    unschedulableSections: unschedulableCount,
    totalAssignments,
    hardViolations,
    softViolations,
    averageGapsPerStudent: avgGap,
    averageGapsPerInstructor: avgInstructorGap,
    roomUtilization,
    preferenceScore,
    overallScore,
  }
}

export class TimetableScheduler {
  async schedule(problem: SchedulingProblem): Promise<SchedulingSolution> {
    const assignments: Assignment[] = []
    const unschedulable: UnschedulableSection[] = []
    const sectionMeetings: { section: Section; meeting: Meeting }[] = []

    for (const section of problem.sections) {
      for (const meeting of section.meetings) {
        sectionMeetings.push({ section, meeting })
      }
    }

    sectionMeetings.sort((a, b) => {
      const candidatesA = computeCandidates(a.meeting, a.section, problem, assignments).length
      const candidatesB = computeCandidates(b.meeting, b.section, problem, assignments).length
      if (candidatesA !== candidatesB) return candidatesA - candidatesB
      return a.meeting.id.localeCompare(b.meeting.id)
    })

    const maxIterations = sectionMeetings.length * 10
    let iteration = 0

    function backtrack(index: number): boolean {
      if (index >= sectionMeetings.length) return true
      if (iteration > maxIterations) return false
      iteration++

      const { section, meeting } = sectionMeetings[index]
      const candidates = computeCandidates(meeting, section, problem, assignments)

      if (candidates.length === 0) {
        return false
      }

      for (const candidate of candidates) {
        const instructorId = meeting.fixedInstructorId || section.instructorId
        const newAssignment: Assignment = {
          id: `assignment-${meeting.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sectionId: section.id,
          meetingId: meeting.id,
          roomId: candidate.roomId,
          instructorId,
          dayOfWeek: candidate.timeSlot.dayOfWeek,
          startTime: candidate.timeSlot.startTime,
          endTime: candidate.timeSlot.endTime,
          startDate: problem.termStartDate,
          endDate: problem.termEndDate,
          isOverride: false,
        }

        const testAssignments = [...assignments, newAssignment]
        let hardViolationFound = false

        for (const constraint of HARD_CONSTRAINTS) {
          const results = constraint.check(
            { problem, assignments: testAssignments } as unknown as SchedulingSolution,
            problem,
          )
          if (results.some((r) => !r.passed && r.severity === Severity.HARD)) {
            hardViolationFound = true
            break
          }
        }

        if (!hardViolationFound) {
          assignments.push(newAssignment)
          if (backtrack(index + 1)) {
            return true
          }
          assignments.pop()
        }
      }

      return false
    }

    const scheduledSectionIds = new Set<string>()
    for (const a of assignments) {
      scheduledSectionIds.add(a.sectionId)
    }

    for (const section of problem.sections) {
      if (!scheduledSectionIds.has(section.id)) {
        const sectionMeetingsList = sectionMeetings.filter((sm) => sm.section.id === section.id)
        const allScheduled = sectionMeetingsList.every((sm) =>
          assignments.some((a) => a.meetingId === sm.meeting.id),
        )
        if (!allScheduled) {
          const reasons = new Set<string>()
          for (const sm of sectionMeetingsList) {
            const candidates = computeCandidates(sm.meeting, sm.section, problem, assignments)
            if (candidates.length === 0) {
              reasons.add(`No valid slots for meeting ${sm.meeting.meetingIndex}`)
            }
          }
          unschedulable.push({
            sectionId: section.id,
            reason: reasons.size > 0 ? Array.from(reasons).join('; ') : 'Could not schedule all meetings',
            constraints: ['backtracking_failed'],
          })
        }
      }
    }

    const stats = buildStats(problem, assignments, unschedulable)

    const score = {
      overallScore: stats.overallScore,
      hardViolationCount: stats.hardViolations,
      softViolationCount: stats.softViolations,
      studentGapScore: Math.max(0, 100 - stats.averageGapsPerStudent),
      instructorGapScore: Math.max(0, 100 - stats.averageGapsPerInstructor),
      roomUtilizationScore: stats.roomUtilization * 100,
      buildingChangeScore: 0,
      preferenceScore: stats.preferenceScore,
      details: {},
    }

    return {
      problem,
      assignments,
      conflicts: [],
      score,
      unschedulableSections: unschedulable,
      stats,
    }
  }
}
