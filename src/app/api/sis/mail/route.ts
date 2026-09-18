import { createServerClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0/me';

const FOLDER_MAP: Record<string, string> = {
    inbox: 'inbox',
    sent: 'sentitems',
    archive: 'archive',
    drafts: 'drafts',
};

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const providerToken = session.provider_token;
        if (!providerToken) {
            return NextResponse.json(
                { error: 'No Microsoft provider token. Please sign out and sign in again to grant mail access.', needsReauth: true },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || 'inbox';
        const action = searchParams.get('action') || 'list';
        const messageId = searchParams.get('messageId');
        const top = Math.min(parseInt(searchParams.get('top') || '50'), 50);
        const skip = parseInt(searchParams.get('skip') || '0');

        const graphHeaders: HeadersInit = {
            Authorization: Bearer ,
            'Content-Type': 'application/json',
        };

        if (action === 'message' && messageId) {
            const res = await fetch(
                ${GRAPH_BASE}/messages/? +
                select=id,subject,from,toRecipients,ccRecipients,body,receivedDateTime,sentDateTime,isRead,flag,hasAttachments,importance,
                { headers: graphHeaders }
            );
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                return NextResponse.json({ error: err.error?.message || 'Failed to fetch message' }, { status: res.status });
            }
            return NextResponse.json({ message: await res.json() });
        }

        if (action === 'unread_counts') {
            const folderIds = ['inbox', 'sentitems', 'archive', 'drafts'];
            const counts = await Promise.all(
                folderIds.map(async (fid) => {
                    const r = await fetch(
                        ${GRAPH_BASE}/mailFolders/? +
                        select=id,displayName,unreadItemCount,totalItemCount,
                        { headers: graphHeaders }
                    );
                    if (!r.ok) return { folder: fid, unreadItemCount: 0, totalItemCount: 0 };
                    return r.json();
                })
            );
            const flagRes = await fetch(
                ${GRAPH_BASE}/messages? +
                ilter=flag/flagStatus eq 'flagged'& +
                select=id&count=true&top=1,
                { headers: { ...graphHeaders, ConsistencyLevel: 'eventual' } }
            );
            const flagData = flagRes.ok ? await flagRes.json() : {};
            return NextResponse.json({
                counts,
                flaggedCount: flagData['@odata.count'] ?? 0,
                starredCount: 0,
            });
        }

        // list messages
        let url: string;
        if (folder === 'starred') {
            url = ${GRAPH_BASE}/messages? +
                ilter=importance eq 'high'& +
                select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance& +
                orderby=receivedDateTime desc&top=&skip=;
        } else if (folder === 'flagged') {
            url = ${GRAPH_BASE}/messages? +
                ilter=flag/flagStatus eq 'flagged'& +
                select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance& +
                orderby=receivedDateTime desc&top=&skip=;
        } else {
            const gf = FOLDER_MAP[folder] || 'inbox';
            url = ${GRAPH_BASE}/mailFolders//messages? +
                select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance& +
                orderby=receivedDateTime desc&top=&skip=;
        }

        const needsEventual = folder === 'starred' || folder === 'flagged';
        const res = await fetch(url, {
            headers: needsEventual ? { ...graphHeaders, ConsistencyLevel: 'eventual' } : graphHeaders,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: err.error?.message || 'Failed to fetch messages', code: err.error?.code },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json({
            messages: data.value || [],
            nextLink: data['@odata.nextLink'] || null,
            count: data['@odata.count'] || (data.value || []).length,
        });
    } catch (err: any) {
        console.error('[Mail API] Error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createServerClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.provider_token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        const body = await request.json();
        const { messageId, ...patch } = body;
        if (!messageId) return NextResponse.json({ error: 'Missing messageId' }, { status: 400 });

        const res = await fetch(${GRAPH_BASE}/messages/, {
            method: 'PATCH',
            headers: {
                Authorization: Bearer ,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patch),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return NextResponse.json({ error: err.error?.message || 'Failed to update message' }, { status: res.status });
        }
        return NextResponse.json({ message: await res.json() });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
