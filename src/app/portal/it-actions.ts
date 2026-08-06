
import { createAdminClient } from '@/utils/supabase/admin';
/**
 * Automatically provision IT assets for a student upon enrollment
 * This should be called when a student's status becomes 'ACTIVE'
 */
export async function provisionItMaterials(studentId: string) {
    const adminClient = createAdminClient();

    try {
        // 1. Fetch all IT assets that are configured for auto-provisioning
        const { data: assets } = await adminClient
            .from('it_assets')
            .select('*')
            .eq('auto_provision', true);

        if (!assets || assets.length === 0) {
            return { success: true, message: 'No auto-provision assets configured' };
        }

        // 2. Check which assets the student already has access to
        const { data: existingAccess } = await adminClient
            .from('student_it_access')
            .select('asset_id')
            .eq('student_id', studentId);

        const existingAssetIds = new Set(existingAccess?.map(a => a.asset_id) || []);

        // 3. Provision missing assets
        const provisioned = [];
        for (const asset of assets) {
            if (existingAssetIds.has(asset.id)) continue;

            // Generate credentials (simplified simulation)
            const credentials = generateCredentials(asset.asset_type);

            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year validity

            const { data: access, error } = await adminClient
                .from('student_it_access')
                .insert({
                    student_id: studentId,
                    asset_id: asset.id,
                    credentials,
                    activated_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    status: 'ACTIVE'
                })
                .select()
                .single();

            if (!error && access) {
                provisioned.push(access);

                // Update usage counter
                await adminClient
                    .from('it_assets')
                    .update({ current_usage: asset.current_usage + 1 })
                    .eq('id', asset.id);
            }
        }
        return { success: true, provisioned };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Deactivate IT materials for a student (upon graduation, withdrawal, etc.)
 */
export async function deactivateItMaterials(studentId: string) {
    const adminClient = createAdminClient();

    try {
        const { error } = await adminClient
            .from('student_it_access')
            .update({
                status: 'DEACTIVATED',
                deactivated_at: new Date().toISOString()
            })
            .eq('student_id', studentId)
            .in('status', ['ACTIVE', 'PENDING']);

        if (error) throw error;

        // Decrement usage counters
        const { data: deactivated } = await adminClient
            .from('student_it_access')
            .select('asset_id')
            .eq('student_id', studentId)
            .eq('status', 'DEACTIVATED');

        if (deactivated) {
            for (const access of deactivated) {
                await adminClient.rpc('decrement_asset_usage', { asset_uuid: access.asset_id });
            }
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Manually override IT access (Admin only)
 */
export async function manualProvisionItAsset(studentId: string, assetId: string) {
    const adminClient = createAdminClient();

    try {
        const { data: asset } = await adminClient
            .from('it_assets')
            .select('*')
            .eq('id', assetId)
            .single();

        if (!asset) throw new Error('Asset not found');

        const credentials = generateCredentials(asset.asset_type);

        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const { data: access, error } = await adminClient
            .from('student_it_access')
            .upsert({
                student_id: studentId,
                asset_id: assetId,
                credentials,
                activated_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
                status: 'ACTIVE'
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, access };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

function generateCredentials(assetType: string) {
    // Simplified credential generation simulation
    switch (assetType) {
        case 'EMAIL':
            return {
                email: `student${Math.floor(Math.random() * 10000)}@cannogacollege.ca`,
                password: 'SET_ON_CARST_LOGIN'
            };
        case 'LMS':
            return {
                username: `student${Math.floor(Math.random() * 10000)}`,
                access_token: `lms_${generateToken()}`
            };
        case 'VPN':
            return {
                vpn_key: generateToken(),
                config_url: 'https://vpn.cannogacollege.ca/config'
            };
        case 'LIBRARY':
            return {
                library_id: `LIB${Math.floor(Math.random() * 100000)}`,
                pin: Math.floor(1000 + Math.random() * 9000).toString()
            };
        case 'VIRTUAL_LAB':
            return {
                lab_username: `vlab_${Math.floor(Math.random() * 10000)}`,
                access_url: 'https://labs.cannogacollege.ca'
            };
        default:
            return {
                license_key: generateToken()
            };
    }
}

function generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
