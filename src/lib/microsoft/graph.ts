// ==============================================================================
// Microsoft Graph API Base Client
// Unified server-side caller with least-privilege handling and error degradation.
// ==============================================================================

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';

export interface GraphFetchOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

export interface GraphResponse<T = any> {
    data?: T;
    error?: string;
    statusCode: number;
    requiresAdminConsent?: boolean;
    needsReauth?: boolean;
}

/**
 * Performs an authenticated request to Microsoft Graph API.
 * Safely handles authorization, permission warnings, and unexpected response statuses.
 */
export async function graphFetch<T = any>(
    endpoint: string,
    token: string,
    options: GraphFetchOptions = {}
): Promise<GraphResponse<T>> {
    if (!token) {
        return {
            error: 'Missing Microsoft provider access token',
            statusCode: 401,
            needsReauth: true,
        };
    }

    try {
        let url = endpoint.startsWith('http')
            ? endpoint
            : `${GRAPH_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        if (options.params) {
            const searchParams = new URLSearchParams();
            Object.entries(options.params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    searchParams.append(key, String(val));
                }
            });
            const qs = searchParams.toString();
            if (qs) {
                url += (url.includes('?') ? '&' : '?') + qs;
            }
        }

        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        const res = await fetch(url, {
            ...options,
            headers,
            cache: options.cache || 'no-store',
        });

        if (res.status === 204) {
            return { statusCode: 204 };
        }

        const contentType = res.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const body = isJson ? await res.json().catch(() => ({})) : null;

        if (!res.ok) {
            const errorCode = body?.error?.code || '';
            const errorMessage = body?.error?.message || res.statusText || 'Graph request failed';

            const requiresConsent =
                res.status === 403 ||
                errorCode === 'Authorization_RequestDenied' ||
                errorMessage.toLowerCase().includes('admin consent');

            const tokenExpired =
                res.status === 401 ||
                errorCode === 'InvalidAuthenticationToken';

            return {
                error: errorMessage,
                statusCode: res.status,
                requiresAdminConsent: requiresConsent,
                needsReauth: tokenExpired,
            };
        }

        return {
            data: body as T,
            statusCode: res.status,
        };
    } catch (err: any) {
        console.error('[Microsoft Graph Client Error]:', err);
        return {
            error: err?.message || 'Network error communicating with Microsoft Graph',
            statusCode: 500,
        };
    }
}
