// ==============================================================================
// Microsoft Teams & M365 Deep Linking Utilities
// Generates official web and desktop links for Microsoft 365 Education apps.
// ==============================================================================

/**
 * Returns the web link to open a Class Team in Microsoft Teams.
 */
export function getTeamsClassWebUrl(teamIdOrGroupId: string): string {
    if (!teamIdOrGroupId) return 'https://teams.microsoft.com';
    return `https://teams.microsoft.com/l/team/${encodeURIComponent(teamIdOrGroupId)}/conversations?groupId=${encodeURIComponent(teamIdOrGroupId)}&tenantId=cannogacollege.ca`;
}

/**
 * Returns the desktop client protocol deep link for Microsoft Teams.
 */
export function getTeamsClassDeepLink(teamIdOrGroupId: string): string {
    if (!teamIdOrGroupId) return 'msteams://';
    return `msteams://teams.microsoft.com/l/team/${encodeURIComponent(teamIdOrGroupId)}/conversations?groupId=${encodeURIComponent(teamIdOrGroupId)}`;
}

/**
 * Returns the web link to an assignment in Microsoft Teams.
 */
export function getTeamsAssignmentWebUrl(classId: string, assignmentId: string): string {
    if (!classId || !assignmentId) return 'https://teams.microsoft.com/_#/school/assignments';
    return `https://teams.microsoft.com/_#/school/assignments/class/${encodeURIComponent(classId)}/assignment/${encodeURIComponent(assignmentId)}`;
}

/**
 * Returns official web links for standard Microsoft 365 Education apps.
 */
export const MICROSOFT_APP_URLS = {
    teams: 'https://teams.microsoft.com',
    outlook: 'https://outlook.office.com/mail/',
    onedrive: 'https://cannogacollege-my.sharepoint.com',
    officePortal: 'https://www.office.com',
    oneNote: 'https://www.onenote.com/edu',
    word: 'https://www.office.com/launch/word',
    excel: 'https://www.office.com/launch/excel',
    powerpoint: 'https://www.office.com/launch/powerpoint',
    forms: 'https://forms.office.com',
} as const;
