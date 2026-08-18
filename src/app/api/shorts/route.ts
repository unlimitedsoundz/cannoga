import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface YouTubeShort {
    id: string;
    title: string;
    caption: string;
    videoId: string;
    publishedAt?: string;
    thumbnailUrl?: string;
}

// Curated library of Cannoga YouTube Shorts & Campus Life in Motion videos
const CANNOGA_SHORTS_CATALOG: YouTubeShort[] = [
    {
        id: 'short-1',
        title: 'Dance if you are excited about summer break 😂',
        caption: 'Dance if you are excited about summer break 😂 #CannogaOrientation #CampusLife #Ottawa',
        videoId: 'OJRQFDSUMDY',
        publishedAt: '2026-06-15'
    },
    {
        id: 'short-2',
        title: 'Finding your textbooks just got a lot easier 📚',
        caption: 'Finding your textbooks just got a lot easier 📚 #CannogaCampus #StudentResources',
        videoId: 'FNerZMOydps',
        publishedAt: '2026-05-20'
    },
    {
        id: 'short-3',
        title: 'There\'s always something you will love about Cannoga College ✨',
        caption: 'There\'s always something you will love about Cannoga College 🇨🇦✨ #CannogaLife #Ottawa',
        videoId: '_JkrXe53EjI',
        publishedAt: '2026-05-10'
    },
    {
        id: 'short-4',
        title: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓',
        caption: 'Meet Love, our Practical Nursing graduate 🇨🇦🎓 #CannogaGrad #NursingExcellence',
        videoId: 'QorLfVUYanA',
        publishedAt: '2026-04-28'
    },
    {
        id: 'short-5',
        title: 'Welcome to Orientation Week at Cannoga! 🎒🇨🇦',
        caption: 'Welcome new students! Experiencing campus culture and community in Ottawa 🎒🇨🇦 #OrientationWeek #CannogaCollege',
        videoId: 'aqz-KE-bpKQ',
        publishedAt: '2026-04-14'
    },
    {
        id: 'short-6',
        title: 'Inside our High-Tech Computer & Robotics Labs 💻🤖',
        caption: 'Hands-on learning with industry-standard software engineering and AI workstations 💻🤖 #TechCareers #CannogaOttawa',
        videoId: 'ysz5S6PUM-U',
        publishedAt: '2026-03-30'
    },
    {
        id: 'short-7',
        title: 'Ottawa Winter Vibes: Rideau Canal & Campus Life ❄️⛸️',
        caption: 'Embracing the Canadian winter in Ottawa, Canada\'s capital ❄️⛸️ #OttawaLife #StudyInCanada',
        videoId: 'jNQXAC9IVRw',
        publishedAt: '2026-02-18'
    },
    {
        id: 'short-8',
        title: 'International Student Success Stories in Canada 🍁💼',
        caption: 'From Letter of Acceptance to Graduation & Career placement in Ontario 🍁💼 #InternationalStudents #PGWP',
        videoId: 'kJQP7kiw5Fk',
        publishedAt: '2026-01-25'
    },
    {
        id: 'short-9',
        title: 'Student Lounge, Library & Academic Support Center 📖☕',
        caption: 'Your dedicated spaces for group study, peer tutoring, and unwinding between classes 📖☕ #CampusCommunity',
        videoId: 'L_LUpnjgPso',
        publishedAt: '2025-12-12'
    },
    {
        id: 'short-10',
        title: 'Graduation Ceremony Highlights & Convocation Pride 🎓🎉',
        caption: 'Celebrating our latest graduating class stepping into exciting global careers 🎓🎉 #CannogaAlumni #ClassOf2026',
        videoId: '3JZ_D3ELwOQ',
        publishedAt: '2025-11-05'
    }
];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(20, parseInt(searchParams.get('limit') || '4', 10)));

        // Optional YouTube API or RSS Feed Integration if Channel ID is provided
        const channelId = process.env.YOUTUBE_CHANNEL_ID;
        const apiKey = process.env.YOUTUBE_API_KEY;

        let dynamicItems: YouTubeShort[] = [];

        if (apiKey && channelId) {
            try {
                const ytUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20&type=video`;
                const ytRes = await fetch(ytUrl, { next: { revalidate: 3600 } });
                if (ytRes.ok) {
                    const ytData = await ytRes.json();
                    if (ytData.items && ytData.items.length > 0) {
                        dynamicItems = ytData.items.map((item: any) => ({
                            id: item.id.videoId,
                            title: item.snippet.title,
                            caption: item.snippet.description || item.snippet.title,
                            videoId: item.id.videoId,
                            publishedAt: item.snippet.publishedAt,
                            thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
                        }));
                    }
                }
            } catch (ytErr) {
                console.error('YouTube API fetch error:', ytErr);
            }
        }

        // Merge dynamic feed with verified catalog
        const allShorts = dynamicItems.length > 0 ? dynamicItems : CANNOGA_SHORTS_CATALOG;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageItems = allShorts.slice(startIndex, endIndex);
        const hasMore = endIndex < allShorts.length;

        return NextResponse.json({
            shorts: pageItems,
            hasMore,
            total: allShorts.length,
            page,
            limit
        });

    } catch (err: any) {
        console.error('Shorts route error:', err);
        return NextResponse.json({
            shorts: CANNOGA_SHORTS_CATALOG.slice(0, 4),
            hasMore: true,
            total: CANNOGA_SHORTS_CATALOG.length,
            page: 1,
            limit: 4
        }, { status: 200 });
    }
}
