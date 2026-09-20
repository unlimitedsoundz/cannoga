// ==============================================================================
// Microsoft 365 Education & Graph TypeScript Types
// ==============================================================================

export interface MicrosoftUser {
    id: string;
    displayName: string;
    givenName?: string;
    surname?: string;
    userPrincipalName: string;
    mail?: string;
    jobTitle?: string;
    officeLocation?: string;
}

export interface MicrosoftEducationClass {
    id: string;
    displayName: string;
    description?: string;
    mailNickname?: string;
    classCode?: string;
    externalId?: string;
    externalName?: string;
    term?: {
        id?: string;
        displayName?: string;
        startDate?: string;
        endDate?: string;
    };
    members?: MicrosoftUser[];
    teachers?: MicrosoftUser[];
}

export interface MicrosoftEducationAssignment {
    id: string;
    classId: string;
    displayName: string;
    instructions?: {
        contentType: string;
        content: string;
    };
    dueDateTime?: string;
    assignedDateTime?: string;
    status: 'draft' | 'scheduled' | 'assigned' | 'inactive';
    allowStudentsToAddResourcesToSubmission?: boolean;
    webUrl?: string;
    resources?: Array<{
        id: string;
        displayName: string;
        resource?: {
            displayName: string;
            fileUrl?: string;
        };
    }>;
}

export interface MicrosoftEducationSubmission {
    id: string;
    assignmentId: string;
    status: 'working' | 'submitted' | 'released' | 'returned';
    submittedDateTime?: string;
    resources?: Array<{
        id: string;
        displayName: string;
    }>;
}

export interface MicrosoftTeamInfo {
    id: string;
    displayName: string;
    description?: string;
    isArchived?: boolean;
    webUrl?: string;
    deepLinkUrl?: string;
}

export interface MicrosoftIntegrationStatus {
    configured: boolean;
    tenantId?: string;
    clientId?: string;
    hasProviderToken: boolean;
    userPrincipalName?: string;
    classesCount: number;
    assignmentsCount: number;
    error?: string;
}

// ==============================================================================
// Classwork Types
// ==============================================================================

export interface MicrosoftClassworkModule {
    id: string;
    displayName: string;
    description?: string;
    /** 'notPublished' | 'published' | 'archived' */
    status?: string;
    resourcesFolderUrl?: string;
    gradingCategory?: {
        id: string;
        displayName: string;
    };
}

// ==============================================================================
// Sync Queue Types
// ==============================================================================

export type SyncEntityType =
    | 'student'
    | 'faculty'
    | 'course_section'
    | 'enrollment'
    | 'classwork_unit'
    | 'assignment';

export type SyncAction =
    | 'create'
    | 'update'
    | 'archive'
    | 'add_student'
    | 'remove_student'
    | 'add_teacher'
    | 'remove_teacher'
    | 'publish'
    | 'sync_classwork'
    | 'sync_assignment';

export type SyncStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface SyncQueueItem {
    id: string;
    entity_type: SyncEntityType;
    entity_id: string;
    action: SyncAction;
    payload: Record<string, any>;
    status: SyncStatus;
    attempts: number;
    max_attempts: number;
    last_error?: string | null;
    scheduled_at: string;
    started_at?: string | null;
    processed_at?: string | null;
    created_at: string;
    created_by?: string | null;
}

// ==============================================================================
// Provisioning Types
// ==============================================================================

export interface CourseSectionMicrosoftMapping {
    microsoft_class_id: string | null;
    microsoft_team_id: string | null;
    microsoft_group_id: string | null;
    microsoft_site_id: string | null;
    microsoft_sync_status: string;
    microsoft_last_synced_at: string | null;
    microsoft_sync_error: string | null;
}

export interface MicrosoftSyncSettings {
    ms_auto_class_creation: boolean;
    ms_auto_enrollment_sync: boolean;
    ms_auto_faculty_sync: boolean;
    ms_auto_classwork_sync: boolean;
    ms_auto_assignment_sync: boolean;
    ms_auto_publish_classwork: boolean;
    ms_auto_publish_assignments: boolean;
}

// ==============================================================================
// Admin Dashboard Types
// ==============================================================================

export interface MicrosoftAdminStatusResponse {
    ok: boolean;
    configuration: {
        tenantConfigured: boolean;
        tenantId: string;
        clientId: string;
        graphConfigured: boolean;
        appCredentialsConfigured: boolean;
        schoolDataSyncConfigured: boolean;
    };
    metrics: {
        totalStudents: number;
        linkedStudents: number;
        totalFaculty: number;
        linkedFaculty: number;
        totalSections: number;
        mappedSections: number;
        unmappedSections: number;
        syncQueuePending: number;
        syncQueueFailed: number;
        syncQueueCompleted: number;
    };
    settings: MicrosoftSyncSettings;
    recentFailures: SyncQueueItem[];
    requiredPermissions: Array<{
        name: string;
        type: string;
        purpose: string;
        status: string;
        appLevel: boolean;
    }>;
}
