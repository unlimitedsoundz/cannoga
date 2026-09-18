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
