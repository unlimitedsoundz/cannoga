// ==============================================================================
// Microsoft 365 Education Service Layer
// Interacts with Microsoft Graph Education endpoints with graceful fallbacks.
// ==============================================================================

import { graphFetch, GraphResponse } from './graph';
import {
    MicrosoftUser,
    MicrosoftEducationClass,
    MicrosoftEducationAssignment,
    MicrosoftEducationSubmission,
} from './types';

/**
 * Retrieves the currently authenticated Microsoft user profile.
 */
export async function getMicrosoftMe(token: string): Promise<GraphResponse<MicrosoftUser>> {
    return graphFetch<MicrosoftUser>('/me', token, {
        params: {
            $select: 'id,displayName,givenName,surname,userPrincipalName,mail,jobTitle,officeLocation',
        },
    });
}

/**
 * Retrieves all education classes the signed-in student/teacher is enrolled in.
 * Falls back to joined Microsoft Teams groups if EduRoster endpoint is not enabled.
 */
export async function getStudentEducationClasses(
    token: string
): Promise<GraphResponse<{ value: MicrosoftEducationClass[] }>> {
    // Primary: Microsoft Education Graph API endpoint
    const eduRes = await graphFetch<{ value: MicrosoftEducationClass[] }>(
        '/education/me/classes',
        token,
        {
            params: {
                $select: 'id,displayName,description,mailNickname,classCode,externalId',
            },
        }
    );

    if (eduRes.data && eduRes.data.value && eduRes.data.value.length > 0) {
        return eduRes;
    }

    // Fallback: If EduRoster is not configured, check user's joined Teams groups
    if (eduRes.statusCode === 404 || eduRes.statusCode === 403 || !eduRes.data?.value?.length) {
        const teamsRes = await graphFetch<{ value: any[] }>(
            '/me/joinedTeams',
            token,
            {
                params: {
                    $select: 'id,displayName,description,isArchived',
                },
            }
        );

        if (teamsRes.data?.value) {
            const mapped: MicrosoftEducationClass[] = teamsRes.data.value.map((t) => ({
                id: t.id,
                displayName: t.displayName,
                description: t.description || undefined,
                classCode: t.id.slice(0, 8).toUpperCase(),
            }));
            return {
                data: { value: mapped },
                statusCode: 200,
            };
        }
    }

    return eduRes;
}

/**
 * Retrieves assignments for a specific class.
 */
export async function getClassAssignments(
    token: string,
    classId: string
): Promise<GraphResponse<{ value: MicrosoftEducationAssignment[] }>> {
    return graphFetch<{ value: MicrosoftEducationAssignment[] }>(
        `/education/classes/${classId}/assignments`,
        token,
        {
            params: {
                $select: 'id,classId,displayName,instructions,dueDateTime,assignedDateTime,status,webUrl',
                $orderby: 'dueDateTime desc',
            },
        }
    );
}

/**
 * Retrieves all assignments for the signed-in student across all classes.
 */
export async function getStudentAssignments(
    token: string
): Promise<GraphResponse<{ value: MicrosoftEducationAssignment[] }>> {
    // Primary: /education/me/assignments (available in Microsoft Education)
    const directRes = await graphFetch<{ value: MicrosoftEducationAssignment[] }>(
        '/education/me/assignments',
        token,
        {
            params: {
                $select: 'id,classId,displayName,dueDateTime,assignedDateTime,status,webUrl',
                $orderby: 'dueDateTime desc',
                $top: 25,
            },
        }
    );

    if (directRes.data && directRes.data.value && directRes.data.value.length > 0) {
        return directRes;
    }

    // If /education/me/assignments is unavailable, fetch classes first and query assignments
    const classesRes = await getStudentEducationClasses(token);
    const classes = classesRes.data?.value || [];

    if (classes.length === 0) {
        return {
            data: { value: [] },
            statusCode: 200,
        };
    }

    const allAssignments: MicrosoftEducationAssignment[] = [];

    await Promise.all(
        classes.slice(0, 5).map(async (c) => {
            const assignRes = await getClassAssignments(token, c.id);
            if (assignRes.data?.value) {
                assignRes.data.value.forEach((a) => {
                    allAssignments.push({
                        ...a,
                        classId: c.id,
                    });
                });
            }
        })
    );

    return {
        data: { value: allAssignments },
        statusCode: 200,
    };
}

/**
 * Retrieves student submissions for an assignment.
 */
export async function getAssignmentSubmissions(
    token: string,
    classId: string,
    assignmentId: string
): Promise<GraphResponse<{ value: MicrosoftEducationSubmission[] }>> {
    return graphFetch<{ value: MicrosoftEducationSubmission[] }>(
        `/education/classes/${classId}/assignments/${assignmentId}/submissions`,
        token
    );
}
