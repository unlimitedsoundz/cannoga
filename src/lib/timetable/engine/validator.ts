import { SchedulingSolution, SchedulingProblem, ValidationResult, Conflict, Severity, Score } from './types'
import { HARD_CONSTRAINTS, SOFT_CONSTRAINTS } from './constraints'

export function validateSolution(
  solution: SchedulingSolution,
  problem: SchedulingProblem,
): ValidationResult {
  const hardViolations: Conflict[] = []
  const softViolations: Conflict[] = []

  for (const constraint of HARD_CONSTRAINTS) {
    const results = constraint.check(solution, problem)
    for (const result of results) {
      if (!result.passed) {
        hardViolations.push({
          id: `validation-${constraint.name}-${result.affectedAssignmentIds.join('-')}`,
          type: result.constraintName as any,
          severity: Severity.HARD,
          assignmentAId: result.affectedAssignmentIds[0] || '',
          assignmentBId: result.affectedAssignmentIds[1] || result.affectedAssignmentIds[0] || '',
          description: result.description,
        })
      }
    }
  }

  for (const constraint of SOFT_CONSTRAINTS) {
    const results = constraint.check(solution, problem)
    for (const result of results) {
      if (!result.passed) {
        softViolations.push({
          id: `validation-${constraint.name}-${result.affectedAssignmentIds.join('-')}`,
          type: result.constraintName as any,
          severity: Severity.SOFT,
          assignmentAId: result.affectedAssignmentIds[0] || '',
          assignmentBId: result.affectedAssignmentIds[1] || result.affectedAssignmentIds[0] || '',
          description: result.description,
        })
      }
    }
  }

  const score: Score = {
    overallScore: Math.max(0, 100 - hardViolations.length * 10 - softViolations.length * 2),
    hardViolationCount: hardViolations.length,
    softViolationCount: softViolations.length,
    studentGapScore: 0,
    instructorGapScore: 0,
    roomUtilizationScore: 0,
    buildingChangeScore: 0,
    preferenceScore: 0,
  }

  const isValid = hardViolations.length === 0
  const message = isValid
    ? 'Solution passes all hard constraints'
    : `Solution has ${hardViolations.length} hard constraint violation(s)`

  return {
    isValid,
    hardViolations,
    softViolations,
    score,
    message,
  }
}
