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
            Authorization: 'Bearer ' + providerToken,
            'Content-Type': 'application/json',
        };

        if (action === 'message' && messageId) {
            const res = await fetch(
                GRAPH_BASE + '/messages/' + messageId + '?$select=id,subject,from,toRecipients,ccRecipients,body,receivedDateTime,sentDateTime,isRead,flag,hasAttachments,importance',
                { headers: graphHeaders }
            );
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                return NextResponse.json({ error: err.error?.message || 'Failed to fetch message' }, { status: res.status });
            }
            return NextResponse.json({ message: await res.json() });
        }

        if (action === 'unread_counts') {
            const folderIds = [
                { id: 'inbox', key: 'inbox' },
                { id: 'sentitems', key: 'sent' },
                { id: 'archive', key: 'archive' },
                { id: 'drafts', key: 'drafts' },
            ];

            const folderMap: Record<string, number> = {};
            const totalMap: Record<string, number> = {};

            const counts = await Promise.all(
                folderIds.map(async ({ id: fid, key }) => {
                    const r = await fetch(
                        GRAPH_BASE + '/mailFolders/' + fid + '?$select=id,displayName,unreadItemCount,totalItemCount',
                        { headers: graphHeaders }
                    );
                    if (!r.ok) return { folderKey: key, id: fid, unreadItemCount: 0, totalItemCount: 0 };
                    const data = await r.json().catch(() => ({}));
                    return {
                        folderKey: key,
                        id: data.id || fid,
                        displayName: data.displayName || fid,
                        unreadItemCount: data.unreadItemCount ?? 0,
                        totalItemCount: data.totalItemCount ?? 0,
                    };
                })
            );

            counts.forEach((c) => {
                folderMap[c.folderKey] = c.unreadItemCount;
                totalMap[c.folderKey] = c.totalItemCount;
            });

            // Query real-time unread messages count for inbox + flagged/starred
            const [inboxUnreadRes, flagRes, starRes] = await Promise.all([
                fetch(
                    GRAPH_BASE + "/mailFolders/inbox/messages?$filter=isRead eq false&$select=id&$count=true&$top=1",
                    { headers: { ...graphHeaders, ConsistencyLevel: 'eventual' } }
                ).catch(() => null),
                fetch(
                    GRAPH_BASE + "/messages?$filter=flag/flagStatus eq 'flagged'&$select=id&$count=true&$top=1",
                    { headers: { ...graphHeaders, ConsistencyLevel: 'eventual' } }
                ).catch(() => null),
                fetch(
                    GRAPH_BASE + "/messages?$filter=importance eq 'high'&$select=id&$count=true&$top=1",
                    { headers: { ...graphHeaders, ConsistencyLevel: 'eventual' } }
                ).catch(() => null),
            ]);

            const inboxUnreadData = inboxUnreadRes?.ok ? await inboxUnreadRes.json().catch(() => ({})) : {};
            const flagData = flagRes?.ok ? await flagRes.json().catch(() => ({})) : {};
            const starData = starRes?.ok ? await starRes.json().catch(() => ({})) : {};

            const realtimeInboxUnread = typeof inboxUnreadData['@odata.count'] === 'number'
                ? inboxUnreadData['@odata.count']
                : (folderMap.inbox ?? 0);

            folderMap.inbox = realtimeInboxUnread;
            folderMap.flagged = flagData['@odata.count'] ?? 0;
            folderMap.starred = starData['@odata.count'] ?? 0;

            return NextResponse.json({
                counts,
                folderCounts: folderMap,
                totalCounts: totalMap,
                inboxUnreadCount: realtimeInboxUnread,
                inboxTotalCount: totalMap.inbox ?? 0,
                flaggedCount: folderMap.flagged,
                starredCount: folderMap.starred,
            });
        }

        // list messages
        let url: string;
        if (folder === 'starred') {
            url = GRAPH_BASE + "/messages?$filter=importance eq 'high'&$select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance&$orderby=receivedDateTime desc&$top=" + top + '&$skip=' + skip;
        } else if (folder === 'flagged') {
            url = GRAPH_BASE + "/messages?$filter=flag/flagStatus eq 'flagged'&$select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance&$orderby=receivedDateTime desc&$top=" + top + '&$skip=' + skip;
        } else {
            const gf = FOLDER_MAP[folder] || 'inbox';
            url = GRAPH_BASE + '/mailFolders/' + gf + '/messages?$select=id,subject,from,toRecipients,bodyPreview,receivedDateTime,isRead,flag,hasAttachments,importance&$orderby=receivedDateTime desc&$top=' + top + '&$skip=' + skip;
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

        const res = await fetch(GRAPH_BASE + '/messages/' + messageId, {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + session.provider_token,
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
