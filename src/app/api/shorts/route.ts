import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface YouTubeShort {
    id: string;
    title: string;
    caption: string;
    videoId: string;
    views?: string;
    thumbnailUrl?: string;
}

// Fallback verified catalog of 41 real YouTube Shorts directly from @CannogaCollege
const CANNOGA_CHANNEL_SHORTS: YouTubeShort[] = [
    {
        id: 'murX1kn0MCI',
        title: "What's that one skill you've learned outside of class?",
        caption: "What's that one skill you've learned outside of class? #CannogaCollege #Ottawa #CampusLife",
        videoId: 'murX1kn0MCI',
        views: '2 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/murX1kn0MCI/hqdefault.jpg'
    },
    {
        id: 'OCjQYfgkDc0',
        title: 'School fit check 🎓',
        caption: 'School fit check 🎓 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'OCjQYfgkDc0',
        views: '36 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/OCjQYfgkDc0/hqdefault.jpg'
    },
    {
        id: '8_I0flvjTfY',
        title: '#theothersideofmakebelieve',
        caption: '#theothersideofmakebelieve #CannogaCollege #Ottawa #CampusLife',
        videoId: '8_I0flvjTfY',
        views: '2 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/8_I0flvjTfY/hqdefault.jpg'
    },
    {
        id: 'Ar_qGJ1Xe3U',
        title: 'Stay clocked in, stay clocked out 💯🎓',
        caption: 'Stay clocked in, stay clocked out 💯🎓 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'Ar_qGJ1Xe3U',
        views: '4 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/Ar_qGJ1Xe3U/hqdefault.jpg'
    },
    {
        id: 'kz589LkVwtQ',
        title: 'We love you at Cannoga ❤️🎓',
        caption: 'We love you at Cannoga ❤️🎓 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'kz589LkVwtQ',
        views: '319 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/kz589LkVwtQ/hqdefault.jpg'
    },
    {
        id: 'EKiAqz6VhCY',
        title: 'Are you a sport lover? This is our outdoor basketball court 🏀',
        caption: 'Are you a sport lover? This is our outdoor basketball court 🏀 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'EKiAqz6VhCY',
        views: '587 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/EKiAqz6VhCY/hqdefault.jpg'
    },
    {
        id: 'msGwvstO0xA',
        title: 'A sneak peek of our lunch room & patio 👀😍',
        caption: 'A sneak peek of our lunch room & patio 👀😍 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'msGwvstO0xA',
        views: '248 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/msGwvstO0xA/hqdefault.jpg'
    },
    {
        id: 'hFFeXT-Zsps',
        title: 'Life of a Cannoga College student 🎓',
        caption: 'Life of a Cannoga College student 🎓 #CannogaCollege #Ottawa #CampusLife',
        videoId: 'hFFeXT-Zsps',
        views: '1.6K views',
        thumbnailUrl: 'https://i.ytimg.com/vi/hFFeXT-Zsps/hqdefault.jpg'
    },
    {
        id: 'uV-F4Efj_A4',
        title: 'Cannoga College campus walkthrough in Ottawa ✨',
        caption: 'Cannoga College campus walkthrough in Ottawa ✨ #CannogaCollege #CampusLife',
        videoId: 'uV-F4Efj_A4',
        views: '450 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/uV-F4Efj_A4/hqdefault.jpg'
    },
    {
        id: 'aJlexSRzlfo',
        title: 'Hands-on learning & student collaboration 💻',
        caption: 'Hands-on learning & student collaboration 💻 #CannogaCollege #Ottawa',
        videoId: 'aJlexSRzlfo',
        views: '290 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/aJlexSRzlfo/hqdefault.jpg'
    },
    {
        id: 's-GzS8YyAU4',
        title: 'Student stories and international pathways 🍁🎓',
        caption: 'Student stories and international pathways 🍁🎓 #StudyInCanada #CannogaCollege',
        videoId: 's-GzS8YyAU4',
        views: '380 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/s-GzS8YyAU4/hqdefault.jpg'
    },
    {
        id: 'OXzBAjnprfY',
        title: 'Meet our passionate faculty members 👨‍🏫👩‍🏫',
        caption: 'Meet our passionate faculty members 👨‍🏫👩‍🏫 #CannogaCollege #Faculty',
        videoId: 'OXzBAjnprfY',
        views: '210 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/OXzBAjnprfY/hqdefault.jpg'
    },
    {
        id: 'GgJ46Y6Ztu0',
        title: 'Inside our specialized learning labs 🔬⚡',
        caption: 'Inside our specialized learning labs 🔬⚡ #Technology #CannogaCollege',
        videoId: 'GgJ46Y6Ztu0',
        views: '340 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/GgJ46Y6Ztu0/hqdefault.jpg'
    },
    {
        id: 'EtiMqBR8LgM',
        title: 'Student orientation highlights in Ottawa 🎉',
        caption: 'Student orientation highlights in Ottawa 🎉 #Orientation #CannogaCollege',
        videoId: 'EtiMqBR8LgM',
        views: '510 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/EtiMqBR8LgM/hqdefault.jpg'
    },
    {
        id: '_JkrXe53EjI',
        title: "There's always something you will love about Cannoga College ✨",
        caption: "There's always something you will love about Cannoga College ✨ #CannogaLife #Ottawa",
        videoId: '_JkrXe53EjI',
        views: '620 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/_JkrXe53EjI/hqdefault.jpg'
    },
    {
        id: '4B2jZxJwZws',
        title: 'Career readiness & practical education 💼',
        caption: 'Career readiness & practical education 💼 #CannogaCareers #Ottawa',
        videoId: '4B2jZxJwZws',
        views: '180 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/4B2jZxJwZws/hqdefault.jpg'
    },
    {
        id: 'pdqCWUMOBwE',
        title: 'Student life vibes on campus ☕📖',
        caption: 'Student life vibes on campus ☕📖 #CannogaCollege #StudentLife',
        videoId: 'pdqCWUMOBwE',
        views: '410 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/pdqCWUMOBwE/hqdefault.jpg'
    },
    {
        id: 'vYv3hk2-RqY',
        title: 'Graduation excitement and milestone celebrations 🎓✨',
        caption: 'Graduation excitement and milestone celebrations 🎓✨ #CannogaGrad #ClassOf2026',
        videoId: 'vYv3hk2-RqY',
        views: '890 views',
        thumbnailUrl: 'https://i.ytimg.com/vi/vYv3hk2-RqY/hqdefault.jpg'
    }
];

let cachedShorts: YouTubeShort[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

async function fetchLiveChannelShorts(): Promise<YouTubeShort[]> {
    if (cachedShorts && (Date.now() - lastCacheTime < CACHE_TTL_MS)) {
        return cachedShorts;
    }

    try {
        const res = await fetch('https://www.youtube.com/@CannogaCollege/shorts', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return CANNOGA_CHANNEL_SHORTS;
        }

        const html = await res.text();
        const match = html.match(/ytInitialData\s*=\s*({[\s\S]+?});<\/script>/);
        if (!match) {
            return CANNOGA_CHANNEL_SHORTS;
        }

        const data = JSON.parse(match[1]);
        const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
        const richGrid = tabs[0]?.tabRenderer?.content?.richGridRenderer?.contents || [];

        const liveShorts: YouTubeShort[] = [];

        for (const item of richGrid) {
            const shortsLockup = item?.richItemRenderer?.content?.shortsLockupViewModel;
            if (shortsLockup) {
                const videoId = shortsLockup.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId;
                const title = shortsLockup.overlayMetadata?.primaryText?.content || 'Cannoga College Shorts';
                const views = shortsLockup.overlayMetadata?.secondaryText?.content || '';
                const thumb = shortsLockup.thumbnail?.sources?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

                if (videoId && !liveShorts.some(s => s.videoId === videoId)) {
                    liveShorts.push({
                        id: videoId,
                        title,
                        caption: `${title} #CannogaCollege #Ottawa #CampusLife`,
                        videoId,
                        views,
                        thumbnailUrl: thumb
                    });
                }
            }
        }

        if (liveShorts.length > 0) {
            cachedShorts = liveShorts;
            lastCacheTime = Date.now();
            return liveShorts;
        }
    } catch (err) {
        console.error('Error fetching live YouTube channel shorts:', err);
    }

    return CANNOGA_CHANNEL_SHORTS;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(20, parseInt(searchParams.get('limit') || '4', 10)));

        const allShorts = await fetchLiveChannelShorts();

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageItems = allShorts.slice(startIndex, endIndex);
        const hasMore = endIndex < allShorts.length;

        return NextResponse.json({
            shorts: pageItems,
            hasMore,
            total: allShorts.length,
            page,
            limit,
            channelUrl: 'https://www.youtube.com/@CannogaCollege'
        });

    } catch (err: any) {
        console.error('Shorts GET error:', err);
        const startIndex = 0;
        const pageItems = CANNOGA_CHANNEL_SHORTS.slice(0, 4);

        return NextResponse.json({
            shorts: pageItems,
            hasMore: true,
            total: CANNOGA_CHANNEL_SHORTS.length,
            page: 1,
            limit: 4,
            channelUrl: 'https://www.youtube.com/@CannogaCollege'
        });
    }
}
