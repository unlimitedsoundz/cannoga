// ==============================================================================
// Microsoft Graph — App-Level (Client Credentials) Token Acquisition
// Used for server-side provisioning: class creation, roster management, etc.
// This token is NEVER exposed to the browser.
// Requires: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET in env.
// ==============================================================================

let _cachedToken: string | null = null;
let _tokenExpiresAt: number = 0;

export interface AppTokenResult {
    accessToken: string | null;
    error?: string;
    configured: boolean;
}

/**
 * Acquires a Microsoft Graph application-level access token via client credentials.
 * Token is cached in memory until 5 minutes before expiry.
 * Never call this from any client-side code path.
 */
export async function getAppAccessToken(): Promise<AppTokenResult> {
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
        return {
            accessToken: null,
            configured: false,
            error: 'Microsoft application credentials not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET in environment.',
        };
    }

    // Return cached token if still valid (with 5-minute buffer)
    const now = Date.now();
    if (_cachedToken && _tokenExpiresAt > now + 5 * 60 * 1000) {
        return { accessToken: _cachedToken, configured: true };
    }

    try {
        const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

        const body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'https://graph.microsoft.com/.default',
        });

        const res = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            cache: 'no-store',
        });

        const json = await res.json();

        if (!res.ok || !json.access_token) {
            return {
                accessToken: null,
                configured: true,
                error: json.error_description || json.error || 'Failed to acquire application token',
            };
        }

        _cachedToken = json.access_token;
        // expires_in is in seconds; store as ms timestamp
        _tokenExpiresAt = now + (json.expires_in || 3600) * 1000;

        return { accessToken: _cachedToken, configured: true };
    } catch (err: any) {
        return {
            accessToken: null,
            configured: true,
            error: err?.message || 'Network error acquiring application token',
        };
    }
}

/**
 * Returns true if app-level Microsoft Graph credentials are configured.
 */
export function isAppGraphConfigured(): boolean {
    return !!(
        process.env.AZURE_TENANT_ID &&
        process.env.AZURE_CLIENT_ID &&
        process.env.AZURE_CLIENT_SECRET
    );
}
