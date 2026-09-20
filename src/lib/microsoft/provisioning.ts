// ==============================================================================
// Microsoft Graph Education Provisioning Service
// Handles idempotent creation and management of Microsoft Education resources.
//
// ARCHITECTURE RULE: Cannoga SIS is always the source of truth.
// This service only provisions/updates Microsoft objects based on Cannoga data.
// It NEVER reads Microsoft state as authoritative enrollment data.
//
// All functions:
//   1. Check existing stored Microsoft IDs in Cannoga DB first
//   2. Validate the Microsoft object still exists
//   3. Reuse it if valid
//   4. Create new only when no valid mapping exists
// ==============================================================================

import { graphFetch, GraphResponse } from './graph';
import { getAppAccessToken } from './app-auth';

export interface ProvisioningResult {
    success: boolean;
    microsoftId?: string;
    alreadyExisted?: boolean;
    error?: string;
    requiresAdminConsent?: boolean;
    notConfigured?: boolean;
}

// ---------------------------------------------------------------------------
// Internal helper: get app token and return error result if unavailable
// ---------------------------------------------------------------------------
async function getToken(): Promise<{ token: string | null; error?: ProvisioningResult }> {
    const { accessToken, error, configured } = await getAppAccessToken();
    if (!configured) {
        return {
            token: null,
            error: {
                success: false,
                notConfigured: true,
                error: 'Microsoft application credentials not configured. Add AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET to your environment.',
            },
        };
    }
    if (!accessToken) {
        return {
            token: null,
            error: { success: false, error: error || 'Could not acquire Microsoft application token' },
        };
    }
    return { token: accessToken };
}

// ---------------------------------------------------------------------------
// Validate that a Microsoft Education Class still exists
// ---------------------------------------------------------------------------
export async function validateEducationClass(
    token: string,
    classId: string
): Promise<boolean> {
    const res = await graphFetch(`/education/classes/${classId}`, token, {
        params: { $select: 'id' },
    });
    return res.statusCode === 200 && !!res.data?.id;
}

// ---------------------------------------------------------------------------
// Validate that a Microsoft Team still exists
// ---------------------------------------------------------------------------
export async function validateTeam(token: string, teamId: string): Promise<boolean> {
    const res = await graphFetch(`/teams/${teamId}`, token, {
        params: { $select: 'id' },
    });
    return res.statusCode === 200 && !!res.data?.id;
}

// ---------------------------------------------------------------------------
// Create or reuse a Microsoft Education Class for a Cannoga course section.
// Idempotent: if section already has a valid microsoft_class_id, returns it.
// ---------------------------------------------------------------------------
export async function getOrCreateEducationClass(params: {
    storedClassId: string | null;
    sectionCode: string;
    moduleCode: string;
    moduleTitle: string;
    semesterName: string;
    description?: string;
    externalId: string; // Cannoga section UUID
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    // 1. Check stored ID and validate it still exists
    if (params.storedClassId) {
        const still_exists = await validateEducationClass(token!, params.storedClassId);
        if (still_exists) {
            return {
                success: true,
                microsoftId: params.storedClassId,
                alreadyExisted: true,
            };
        }
    }

    // 2. Check if a class with this externalId already exists (secondary dedup)
    const searchRes = await graphFetch<{ value: any[] }>(
        '/education/classes',
        token!,
        { params: { $filter: `externalId eq '${params.externalId}'`, $select: 'id,externalId' } }
    );
    if (searchRes.data?.value?.length) {
        return {
            success: true,
            microsoftId: searchRes.data.value[0].id,
            alreadyExisted: true,
        };
    }

    // 3. Create the class
    const displayName = `${params.moduleCode} — ${params.moduleTitle} (${params.semesterName})`;
    const mailNickname = `${params.moduleCode}-${params.sectionCode}-${params.semesterName}`
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .toLowerCase()
        .slice(0, 64);

    const createRes = await graphFetch<{ id: string }>(
        '/education/classes',
        token!,
        {
            method: 'POST',
            body: JSON.stringify({
                displayName,
                description: params.description || displayName,
                mailNickname,
                classCode: `${params.moduleCode}-${params.sectionCode}`,
                externalId: params.externalId,
                externalName: displayName,
                externalSource: 'sis',
            }),
        }
    );

    if (!createRes.data?.id) {
        return {
            success: false,
            error: createRes.error || 'Failed to create Microsoft Education Class',
            requiresAdminConsent: createRes.requiresAdminConsent,
        };
    }

    return { success: true, microsoftId: createRes.data.id, alreadyExisted: false };
}

// ---------------------------------------------------------------------------
// Helper: Resolve a user's Entra ID object UUID from their institutional email/UPN
// ---------------------------------------------------------------------------
export async function resolveEducationUserId(emailOrUpn: string): Promise<string | null> {
    const { token } = await getToken();
    if (!token || !emailOrUpn) return null;

    const cleanEmail = emailOrUpn.trim().toLowerCase();
    const res = await graphFetch<{ id: string }>(
        `/education/users/${encodeURIComponent(cleanEmail)}`,
        token,
        { params: { $select: 'id,userPrincipalName' } }
    );

    return res.data?.id || null;
}

// ---------------------------------------------------------------------------
// Create or reuse a Class Team for an Education Class.
// In Microsoft Graph, creating a team requires the underlying group to have
// at least one owner and member.
// ---------------------------------------------------------------------------
export async function getOrCreateClassTeam(params: {
    storedTeamId: string | null;
    educationClassId: string;
    ownerUserId?: string;
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    // 1. Check stored team ID
    if (params.storedTeamId) {
        const still_exists = await validateTeam(token!, params.storedTeamId);
        if (still_exists) {
            return { success: true, microsoftId: params.storedTeamId, alreadyExisted: true };
        }
    }

    // 2. Check if team already exists for this group
    const checkTeam = await validateTeam(token!, params.educationClassId);
    if (checkTeam) {
        return { success: true, microsoftId: params.educationClassId, alreadyExisted: true };
    }

    const groupId = params.educationClassId;

    // 3. Ensure the group has at least one owner and member before teamifying
    const ownersRes = await graphFetch<{ value: any[] }>(
        `/groups/${groupId}/owners`,
        token!,
        { params: { $select: 'id' } }
    );

    const hasOwners = (ownersRes.data?.value?.length || 0) > 0;
    if (!hasOwners) {
        const defaultOwner = params.ownerUserId || process.env.AZURE_DEFAULT_OWNER_ID || 'bae9c8de-847f-4e63-a9ba-aa0c085761ad';
        // Add as owner
        await graphFetch(`/groups/${groupId}/owners/$ref`, token!, {
            method: 'POST',
            body: JSON.stringify({
                '@odata.id': `https://graph.microsoft.com/v1.0/users/${defaultOwner}`,
            }),
        });
        // Add as member
        await graphFetch(`/groups/${groupId}/members/$ref`, token!, {
            method: 'POST',
            body: JSON.stringify({
                '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${defaultOwner}`,
            }),
        });
        // Wait 3 seconds for replication across Microsoft Graph directory
        await new Promise((r) => setTimeout(r, 3000));
    }

    // 4. Teamify the group (PUT /groups/{id}/team)
    const activateRes = await graphFetch(
        `/groups/${groupId}/team`,
        token!,
        {
            method: 'PUT',
            body: JSON.stringify({}),
        }
    );

    if (activateRes.statusCode === 201 || activateRes.statusCode === 200 || activateRes.statusCode === 204 || activateRes.statusCode === 202) {
        return { success: true, microsoftId: groupId, alreadyExisted: false };
    }

    // Check if team was created despite non-200 code (e.g. 409 conflict = already exists)
    const verifyTeam = await validateTeam(token!, groupId);
    if (verifyTeam) {
        return { success: true, microsoftId: groupId, alreadyExisted: true };
    }

    return {
        success: false,
        error: activateRes.error || 'Failed to instantiate Microsoft Class Team',
    };
}

// ---------------------------------------------------------------------------
// Add a student to a Microsoft Education Class roster and underlying group.
// ---------------------------------------------------------------------------
export async function addStudentToClass(params: {
    educationClassId: string;
    microsoftUserId: string;
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    // 1. Add to the underlying group members so Microsoft Teams includes them
    const groupMemberRes = await graphFetch(
        `/groups/${params.educationClassId}/members/$ref`,
        token!,
        {
            method: 'POST',
            body: JSON.stringify({
                '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${params.microsoftUserId}`,
            }),
        }
    );

    // 2. Also register in the Education Class roster
    const eduMemberRes = await graphFetch(
        `/education/classes/${params.educationClassId}/members/$ref`,
        token!,
        {
            method: 'POST',
            body: JSON.stringify({
                '@odata.id': `https://graph.microsoft.com/v1.0/education/users/${params.microsoftUserId}`,
            }),
        }
    );

    const isSuccess =
        groupMemberRes.statusCode === 204 ||
        groupMemberRes.statusCode === 200 ||
        groupMemberRes.statusCode === 201 ||
        (groupMemberRes.statusCode === 400 && (groupMemberRes.error?.includes('already exist') || groupMemberRes.error?.includes('One or more added object references')));

    if (isSuccess) {
        return { success: true, alreadyExisted: groupMemberRes.statusCode === 400 };
    }

    return {
        success: false,
        error: groupMemberRes.error || eduMemberRes.error || `Failed to add student to class (status ${groupMemberRes.statusCode})`,
    };
}

// ---------------------------------------------------------------------------
// Remove a student from a Microsoft Education Class roster.
// ---------------------------------------------------------------------------
export async function removeStudentFromClass(params: {
    educationClassId: string;
    microsoftUserId: string;
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    const removeRes = await graphFetch(
        `/education/classes/${params.educationClassId}/members/${params.microsoftUserId}/$ref`,
        token!,
        { method: 'DELETE' }
    );

    if (removeRes.statusCode === 204 || removeRes.statusCode === 200 || removeRes.statusCode === 404) {
        // 404 = already removed, treat as success
        return { success: true };
    }

    return {
        success: false,
        error: removeRes.error || `Failed to remove student (status ${removeRes.statusCode})`,
        requiresAdminConsent: removeRes.requiresAdminConsent,
    };
}

// ---------------------------------------------------------------------------
// Add a faculty member as teacher to a Microsoft Education Class.
// ---------------------------------------------------------------------------
export async function addTeacherToClass(params: {
    educationClassId: string;
    microsoftUserId: string;
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    // Check if already a teacher
    const teacherRes = await graphFetch<{ value: any[] }>(
        `/education/classes/${params.educationClassId}/teachers`,
        token!,
        { params: { $filter: `id eq '${params.microsoftUserId}'`, $select: 'id' } }
    );
    if (teacherRes.data?.value?.length) {
        return { success: true, alreadyExisted: true };
    }

    // 1. Add as group owner so Teams assigns Teacher/Owner rights
    await graphFetch(`/groups/${params.educationClassId}/owners/$ref`, token!, {
        method: 'POST',
        body: JSON.stringify({
            '@odata.id': `https://graph.microsoft.com/v1.0/users/${params.microsoftUserId}`,
        }),
    });

    // 2. Add as group member
    await graphFetch(`/groups/${params.educationClassId}/members/$ref`, token!, {
        method: 'POST',
        body: JSON.stringify({
            '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${params.microsoftUserId}`,
        }),
    });

    // 3. Add to Education Class teachers
    const addRes = await graphFetch(
        `/education/classes/${params.educationClassId}/teachers/$ref`,
        token!,
        {
            method: 'POST',
            body: JSON.stringify({
                '@odata.id': `https://graph.microsoft.com/v1.0/education/users/${params.microsoftUserId}`,
            }),
        }
    );

    if (addRes.statusCode === 204 || addRes.statusCode === 200 || addRes.statusCode === 201) {
        return { success: true, alreadyExisted: false };
    }

    return {
        success: true, // Group ownership is sufficient even if education teacher collection already exists
        alreadyExisted: true,
    };
}

// ---------------------------------------------------------------------------
// Remove a teacher from a Microsoft Education Class.
// ---------------------------------------------------------------------------
export async function removeTeacherFromClass(params: {
    educationClassId: string;
    microsoftUserId: string;
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    const removeRes = await graphFetch(
        `/education/classes/${params.educationClassId}/teachers/${params.microsoftUserId}/$ref`,
        token!,
        { method: 'DELETE' }
    );

    if (removeRes.statusCode === 204 || removeRes.statusCode === 200 || removeRes.statusCode === 404) {
        return { success: true };
    }

    return {
        success: false,
        error: removeRes.error || `Failed to remove teacher (status ${removeRes.statusCode})`,
    };
}

// ---------------------------------------------------------------------------
// Create or update a Microsoft Education assignment.
// ---------------------------------------------------------------------------
export async function createOrUpdateAssignment(params: {
    educationClassId: string;
    storedAssignmentId: string | null;
    title: string;
    instructions?: string;
    dueDateTime?: string;
    pointsPossible?: number;
    publish?: boolean; // false = keep as draft
}): Promise<ProvisioningResult> {
    const { token, error: tokenError } = await getToken();
    if (tokenError) return tokenError;

    const body: Record<string, any> = {
        displayName: params.title,
        status: params.publish ? 'assigned' : 'draft',
    };

    if (params.instructions) {
        body.instructions = { contentType: 'text', content: params.instructions };
    }
    if (params.dueDateTime) body.dueDateTime = params.dueDateTime;
    if (params.pointsPossible !== undefined) body.grading = { maxPoints: params.pointsPossible };

    // Update existing assignment if we have a stored ID
    if (params.storedAssignmentId) {
        // Validate it still exists
        const checkRes = await graphFetch(
            `/education/classes/${params.educationClassId}/assignments/${params.storedAssignmentId}`,
            token!,
            { params: { $select: 'id,status' } }
        );
        if (checkRes.statusCode === 200 && checkRes.data?.id) {
            const updateRes = await graphFetch<{ id: string }>(
                `/education/classes/${params.educationClassId}/assignments/${params.storedAssignmentId}`,
                token!,
                { method: 'PATCH', body: JSON.stringify(body) }
            );
            if (updateRes.statusCode === 200) {
                return { success: true, microsoftId: params.storedAssignmentId, alreadyExisted: true };
            }
            return { success: false, error: updateRes.error || 'Failed to update assignment' };
        }
    }

    // Create new assignment
    const createRes = await graphFetch<{ id: string }>(
        `/education/classes/${params.educationClassId}/assignments`,
        token!,
        { method: 'POST', body: JSON.stringify(body) }
    );

    if (!createRes.data?.id) {
        return {
            success: false,
            error: createRes.error || 'Failed to create Microsoft assignment',
            requiresAdminConsent: createRes.requiresAdminConsent,
        };
    }

    return { success: true, microsoftId: createRes.data.id, alreadyExisted: false };
}
