// ==============================================================================
// Microsoft Graph Education Classwork Service
// Manages Classwork modules in Microsoft Education classes.
// Cannoga module_classwork_units are authoritative; Microsoft is the sync target.
// ==============================================================================

import { graphFetch } from './graph';
import { getAppAccessToken } from './app-auth';
import { ProvisioningResult } from './provisioning';

export interface ClassworkModule {
    id: string;
    displayName: string;
    description?: string;
    status?: 'notPublished' | 'published' | 'archived';
}

// ---------------------------------------------------------------------------
// List classwork modules for a class
// ---------------------------------------------------------------------------
export async function listClassworkModules(
    educationClassId: string
): Promise<{ modules: ClassworkModule[]; error?: string }> {
    const { accessToken, error, configured } = await getAppAccessToken();
    if (!configured || !accessToken) {
        return { modules: [], error: error || 'Microsoft app credentials not configured' };
    }

    const res = await graphFetch<{ value: ClassworkModule[] }>(
        `/education/classes/${educationClassId}/modules`,
        accessToken,
        { params: { $select: 'id,displayName,description,status' } }
    );

    return {
        modules: res.data?.value || [],
        error: res.error,
    };
}

// ---------------------------------------------------------------------------
// Create or reuse a Microsoft Education Classwork module.
// Idempotent: if storedModuleId is provided and still exists, returns it.
// New modules are created as 'notPublished' (draft) unless explicitly published.
// ---------------------------------------------------------------------------
export async function getOrCreateClassworkModule(params: {
    educationClassId: string;
    storedModuleId: string | null;
    title: string;
    description?: string;
}): Promise<ProvisioningResult> {
    const { accessToken, error, configured } = await getAppAccessToken();
    if (!configured) {
        return { success: false, notConfigured: true, error: 'Microsoft app credentials not configured' };
    }
    if (!accessToken) {
        return { success: false, error: error || 'Could not acquire Microsoft app token' };
    }

    // 1. Check stored module ID and validate it still exists
    if (params.storedModuleId) {
        const checkRes = await graphFetch<{ id: string }>(
            `/education/classes/${params.educationClassId}/modules/${params.storedModuleId}`,
            accessToken,
            { params: { $select: 'id,displayName' } }
        );
        if (checkRes.statusCode === 200 && checkRes.data?.id) {
            return {
                success: true,
                microsoftId: params.storedModuleId,
                alreadyExisted: true,
            };
        }
    }

    // 2. Search for a module with matching title to avoid duplicates
    const listRes = await graphFetch<{ value: any[] }>(
        `/education/classes/${params.educationClassId}/modules`,
        accessToken,
        { params: { $select: 'id,displayName' } }
    );
    const existing = (listRes.data?.value || []).find(
        (m) => m.displayName?.trim() === params.title.trim()
    );
    if (existing?.id) {
        return { success: true, microsoftId: existing.id, alreadyExisted: true };
    }

    // 3. Create the module (draft by default)
    const createRes = await graphFetch<{ id: string }>(
        `/education/classes/${params.educationClassId}/modules`,
        accessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                displayName: params.title,
                description: params.description || '',
                status: 'notPublished',
            }),
        }
    );

    if (!createRes.data?.id) {
        return {
            success: false,
            error: createRes.error || 'Failed to create Microsoft Classwork module',
            requiresAdminConsent: createRes.requiresAdminConsent,
        };
    }

    return { success: true, microsoftId: createRes.data.id, alreadyExisted: false };
}

// ---------------------------------------------------------------------------
// Publish a Microsoft Education Classwork module.
// Only call this when Cannoga content is explicitly marked published.
// ---------------------------------------------------------------------------
export async function publishClassworkModule(
    educationClassId: string,
    microsoftModuleId: string
): Promise<ProvisioningResult> {
    const { accessToken, error, configured } = await getAppAccessToken();
    if (!configured) {
        return { success: false, notConfigured: true, error: 'Microsoft app credentials not configured' };
    }
    if (!accessToken) {
        return { success: false, error: error || 'Could not acquire token' };
    }

    const res = await graphFetch(
        `/education/classes/${educationClassId}/modules/${microsoftModuleId}/publish`,
        accessToken,
        { method: 'POST' }
    );

    if (res.statusCode === 200 || res.statusCode === 204) {
        return { success: true };
    }

    return {
        success: false,
        error: res.error || `Failed to publish classwork module (status ${res.statusCode})`,
        requiresAdminConsent: res.requiresAdminConsent,
    };
}
