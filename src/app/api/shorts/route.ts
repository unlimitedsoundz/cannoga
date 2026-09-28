import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface YouTubeShort {
    id: string;
    title: string;
    caption: string;
    videoId: string;
    views?: string;
    thumbnailUrl?: string;
}

const YOUTUBE_CHANNEL_ID = 'UC0S7xAUqVOZwf4jxn7oJgFQ';
const CHANNEL_HANDLE = '@CannogaCollege';

// Fallback verified catalog of real YouTube Shorts from @CannogaCollege
const CANNOGA_CHANNEL_SHORTS: YouTubeShort[] = [
    {
        "id": "b-VP-yWxKZg",
        "title": "Update of Ariana's 1 month journey so far at Cannoga College ❤️",
        "caption": "Update of Ariana's 1 month journey so far at Cannoga College ❤️ #CannogaCollege #Ottawa #CampusLife",
        "videoId": "b-VP-yWxKZg",
        "views": "62 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/b-VP-yWxKZg/hqdefault.jpg"
    },
    {
        "id": "87Y3tSEXQ4o",
        "title": "International student orientation and onboarding ongoing. Visit the administrative office 9am-4pm",
        "caption": "International student orientation and onboarding ongoing. Visit the administrative office 9am-4pm #CannogaCollege #Ottawa #CampusLife",
        "videoId": "87Y3tSEXQ4o",
        "views": "20 views",
        "thumbnailUrl": "https://i1.ytimg.com/vi/87Y3tSEXQ4o/hqdefault.jpg"
    },
    {
        "id": "b0muxfZzSPg",
        "title": "Orientation in 1 week ❤️",
        "caption": "Orientation in 1 week ❤️ #CannogaCollege #Ottawa #CampusLife",
        "videoId": "b0muxfZzSPg",
        "views": "9 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/b0muxfZzSPg/hqdefault.jpg"
    },
    {
        "id": "MdUR4hCTXw8",
        "title": "it's fraud prevention week💡 🚨",
        "caption": "it's fraud prevention week💡 🚨 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "MdUR4hCTXw8",
        "views": "1363 views",
        "thumbnailUrl": "https://i2.ytimg.com/vi/MdUR4hCTXw8/hqdefault.jpg"
    },
    {
        "id": "zJ2Mus8E7WM",
        "title": "Our Practical Nursing admission requirements 💯",
        "caption": "Our Practical Nursing admission requirements 💯 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "zJ2Mus8E7WM",
        "views": "75 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/zJ2Mus8E7WM/hqdefault.jpg"
    },
    {
        "id": "d_hHTHEUAho",
        "title": "Always make sure you apply for your housing early. 🏠#cannogacollege #cannoga",
        "caption": "Always make sure you apply for your housing early. 🏠#cannogacollege #cannoga #CannogaCollege #Ottawa #CampusLife",
        "videoId": "d_hHTHEUAho",
        "views": "11 views",
        "thumbnailUrl": "https://i1.ytimg.com/vi/d_hHTHEUAho/hqdefault.jpg"
    },
    {
        "id": "CnRHOVGuugE",
        "title": "Orientation in 2 weeks! 🎓We are looking forward to have our students back. #cannoga #cannogacollege",
        "caption": "Orientation in 2 weeks! 🎓We are looking forward to have our students back. #cannoga #cannogacollege #CannogaCollege #Ottawa #CampusLife",
        "videoId": "CnRHOVGuugE",
        "views": "94 views",
        "thumbnailUrl": "https://i4.ytimg.com/vi/CnRHOVGuugE/hqdefault.jpg"
    },
    {
        "id": "uiTMmdGxkvw",
        "title": "Meet Julia from Fortaleza, Brazil. A first year student studying ECE here at Cannoga College 🎓🎉",
        "caption": "Meet Julia from Fortaleza, Brazil. A first year student studying ECE here at Cannoga College 🎓🎉 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "uiTMmdGxkvw",
        "views": "1025 views",
        "thumbnailUrl": "https://i2.ytimg.com/vi/uiTMmdGxkvw/hqdefault.jpg"
    },
    {
        "id": "_mljLs9e4gY",
        "title": "Life of a Cannoga College student",
        "caption": "Life of a Cannoga College student #CannogaCollege #Ottawa #CampusLife",
        "videoId": "_mljLs9e4gY",
        "views": "231 views",
        "thumbnailUrl": "https://i4.ytimg.com/vi/_mljLs9e4gY/hqdefault.jpg"
    },
    {
        "id": "VU_nuqGfnj4",
        "title": "Life of a Cannoga College student 🎓",
        "caption": "Life of a Cannoga College student 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "VU_nuqGfnj4",
        "views": "58 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/VU_nuqGfnj4/hqdefault.jpg"
    },
    {
        "id": "2eggdqZG-_M",
        "title": "Just so you know! Orientation in 3 weeks 🎓👀",
        "caption": "Just so you know! Orientation in 3 weeks 🎓👀 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "2eggdqZG-_M",
        "views": "53 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/2eggdqZG-_M/hqdefault.jpg"
    },
    {
        "id": "gqcIbNlxXkc",
        "title": "Meet Claude, our fitness instructor, he has some tips to share.",
        "caption": "Meet Claude, our fitness instructor, he has some tips to share. #CannogaCollege #Ottawa #CampusLife",
        "videoId": "gqcIbNlxXkc",
        "views": "36 views",
        "thumbnailUrl": "https://i4.ytimg.com/vi/gqcIbNlxXkc/hqdefault.jpg"
    },
    {
        "id": "Ey0IZC247X8",
        "title": "Are you looking? 💯",
        "caption": "Are you looking? 💯 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "Ey0IZC247X8",
        "views": "1057 views",
        "thumbnailUrl": "https://i2.ytimg.com/vi/Ey0IZC247X8/hqdefault.jpg"
    },
    {
        "id": "LKcwB0lGaD0",
        "title": "Here's what Tood, our senior admissions advisor has to say about our admission process 💡",
        "caption": "Here's what Tood, our senior admissions advisor has to say about our admission process 💡 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "LKcwB0lGaD0",
        "views": "193 views",
        "thumbnailUrl": "https://i1.ytimg.com/vi/LKcwB0lGaD0/hqdefault.jpg"
    },
    {
        "id": "NiBHMBmtQ58",
        "title": "Excited about studying at Cannoga College? 🎓",
        "caption": "Excited about studying at Cannoga College? 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "NiBHMBmtQ58",
        "views": "410 views",
        "thumbnailUrl": "https://i3.ytimg.com/vi/NiBHMBmtQ58/hqdefault.jpg"
    },
    {
        "id": "JruSc-jqaF8",
        "title": "You can always reach us at our HELP DESK at the main campus 🎓",
        "caption": "You can always reach us at our HELP DESK at the main campus 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "JruSc-jqaF8",
        "views": "1.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/JruSc-jqaF8/hqdefault.jpg"
    },
    {
        "id": "XXv4olxiE_w",
        "title": "Meet our latest Marketing graduates 🎓",
        "caption": "Meet our latest Marketing graduates 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "XXv4olxiE_w",
        "views": "1.1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/XXv4olxiE_w/hqdefault.jpg"
    },
    {
        "id": "2ic_cjzv0CI",
        "title": "How well do you know Canada? 🇨🇦",
        "caption": "How well do you know Canada? 🇨🇦 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "2ic_cjzv0CI",
        "views": "1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/2ic_cjzv0CI/hqdefault.jpg"
    },
    {
        "id": "hNBjhTv09Qo",
        "title": "Immediately after you receive your LOA, apply for housing through your housing portal. Don't wait!",
        "caption": "Immediately after you receive your LOA, apply for housing through your housing portal. Don't wait! #CannogaCollege #Ottawa #CampusLife",
        "videoId": "hNBjhTv09Qo",
        "views": "25 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/hNBjhTv09Qo/hqdefault.jpg"
    },
    {
        "id": "sshWIdZDRlk",
        "title": "Meet Esosa, our latest graduate. She has a word for you. 🎓 #alumni",
        "caption": "Meet Esosa, our latest graduate. She has a word for you. 🎓 #alumni #CannogaCollege #Ottawa #CampusLife",
        "videoId": "sshWIdZDRlk",
        "views": "10 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/sshWIdZDRlk/hqdefault.jpg"
    },
    {
        "id": "DNNwfT_GEnM",
        "title": "Hospitality Management is a start point for a successful global career in the Hospitality industry💯",
        "caption": "Hospitality Management is a start point for a successful global career in the Hospitality industry💯 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "DNNwfT_GEnM",
        "views": "87 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/DNNwfT_GEnM/hqdefault.jpg"
    },
    {
        "id": "MhrrU2SmRWs",
        "title": "Expanding your horizon is very important in the journey of Networking 💯🎓",
        "caption": "Expanding your horizon is very important in the journey of Networking 💯🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "MhrrU2SmRWs",
        "views": "834 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/MhrrU2SmRWs/hqdefault.jpg"
    },
    {
        "id": "murX1kn0MCI",
        "title": "What's that one skill you've learned outside of class?",
        "caption": "What's that one skill you've learned outside of class? #CannogaCollege #Ottawa #CampusLife",
        "videoId": "murX1kn0MCI",
        "views": "1.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/murX1kn0MCI/hqdefault.jpg"
    },
    {
        "id": "OCjQYfgkDc0",
        "title": "School fit check 🎓",
        "caption": "School fit check 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "OCjQYfgkDc0",
        "views": "1.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/OCjQYfgkDc0/hqdefault.jpg"
    },
    {
        "id": "8_I0flvjTfY",
        "title": "#theothersideofmakebelieve",
        "caption": "#theothersideofmakebelieve #CannogaCollege #Ottawa #CampusLife",
        "videoId": "8_I0flvjTfY",
        "views": "1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/8_I0flvjTfY/hqdefault.jpg"
    },
    {
        "id": "Ar_qGJ1Xe3U",
        "title": "Stay clocked in, stay clocked out 💯🎓",
        "caption": "Stay clocked in, stay clocked out 💯🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "Ar_qGJ1Xe3U",
        "views": "68 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/Ar_qGJ1Xe3U/hqdefault.jpg"
    },
    {
        "id": "kz589LkVwtQ",
        "title": "We love you at Cannoga ❤️🎓",
        "caption": "We love you at Cannoga ❤️🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "kz589LkVwtQ",
        "views": "325 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/kz589LkVwtQ/hqdefault.jpg"
    },
    {
        "id": "EKiAqz6VhCY",
        "title": "Are you a sport lover? This is our outdoor basketball court 🏀",
        "caption": "Are you a sport lover? This is our outdoor basketball court 🏀 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "EKiAqz6VhCY",
        "views": "591 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/EKiAqz6VhCY/hqdefault.jpg"
    },
    {
        "id": "msGwvstO0xA",
        "title": "A sneak peek of our lunch room & patio 👀😍",
        "caption": "A sneak peek of our lunch room & patio 👀😍 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "msGwvstO0xA",
        "views": "248 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/msGwvstO0xA/hqdefault.jpg"
    },
    {
        "id": "hFFeXT-Zsps",
        "title": "Life of a Cannoga College student 🎓",
        "caption": "Life of a Cannoga College student 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "hFFeXT-Zsps",
        "views": "1.6K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/hFFeXT-Zsps/hqdefault.jpg"
    },
    {
        "id": "uV-F4Efj_A4",
        "title": "Fitness is really important 💯",
        "caption": "Fitness is really important 💯 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "uV-F4Efj_A4",
        "views": "1.1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/uV-F4Efj_A4/hqdefault.jpg"
    },
    {
        "id": "aJlexSRzlfo",
        "title": "We are always here for you 🎓🇨🇦",
        "caption": "We are always here for you 🎓🇨🇦 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "aJlexSRzlfo",
        "views": "359 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/aJlexSRzlfo/hqdefault.jpg"
    },
    {
        "id": "coj6p7j_i_k",
        "title": "Some of our Arts students 🇨🇦🖌️🎓",
        "caption": "Some of our Arts students 🇨🇦🖌️🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "coj6p7j_i_k",
        "views": "1.8K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/coj6p7j_i_k/hqdefault.jpg"
    },
    {
        "id": "YGDKsrPJipQ",
        "title": "Some of our Media Students 🇨🇦🎓🎥",
        "caption": "Some of our Media Students 🇨🇦🎓🎥 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "YGDKsrPJipQ",
        "views": "655 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/YGDKsrPJipQ/hqdefault.jpg"
    },
    {
        "id": "gZ1AtedYpa4",
        "title": "We just want the best for you 🥹🇨🇦🎓",
        "caption": "We just want the best for you 🥹🇨🇦🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "gZ1AtedYpa4",
        "views": "1.5K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/gZ1AtedYpa4/hqdefault.jpg"
    },
    {
        "id": "mp-uIE7J7gw",
        "title": "What exactly? 😂",
        "caption": "What exactly? 😂 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "mp-uIE7J7gw",
        "views": "906 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/mp-uIE7J7gw/hqdefault.jpg"
    },
    {
        "id": "OJRQFDSUMDY",
        "title": "Dance if you are excited about the summer break 😂",
        "caption": "Dance if you are excited about the summer break 😂 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "OJRQFDSUMDY",
        "views": "1.1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/OJRQFDSUMDY/hqdefault.jpg"
    },
    {
        "id": "lFLCGhA0E5I",
        "title": "Bowling Nights 🎳",
        "caption": "Bowling Nights 🎳 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "lFLCGhA0E5I",
        "views": "1.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/lFLCGhA0E5I/hqdefault.jpg"
    },
    {
        "id": "Nw5VMjKj1iU",
        "title": "Aww😂",
        "caption": "Aww😂 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "Nw5VMjKj1iU",
        "views": "1.3K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/Nw5VMjKj1iU/hqdefault.jpg"
    },
    {
        "id": "OyHlzS1DVMA",
        "title": "Feeling at home 🇨🇦 🎓",
        "caption": "Feeling at home 🇨🇦 🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "OyHlzS1DVMA",
        "views": "742 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/OyHlzS1DVMA/hqdefault.jpg"
    },
    {
        "id": "N2DB0d15tqY",
        "title": "You know how we ball 🏀",
        "caption": "You know how we ball 🏀 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "N2DB0d15tqY",
        "views": "1.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/N2DB0d15tqY/hqdefault.jpg"
    },
    {
        "id": "2N7q7B7VYMM",
        "title": "3 Essential things to have to get your study permit 🇨🇦📌",
        "caption": "3 Essential things to have to get your study permit 🇨🇦📌 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "2N7q7B7VYMM",
        "views": "2.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/2N7q7B7VYMM/hqdefault.jpg"
    },
    {
        "id": "VubkWWiFGiI",
        "title": "Very important Information 📌",
        "caption": "Very important Information 📌 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "VubkWWiFGiI",
        "views": "8 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/VubkWWiFGiI/hqdefault.jpg"
    },
    {
        "id": "Wacq_Nd9QjQ",
        "title": "Exams can be something else 📖",
        "caption": "Exams can be something else 📖 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "Wacq_Nd9QjQ",
        "views": "1.4K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/Wacq_Nd9QjQ/hqdefault.jpg"
    },
    {
        "id": "FNerZMOydps",
        "title": "Finding your textbooks just got a lot easier 📚",
        "caption": "Finding your textbooks just got a lot easier 📚 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "FNerZMOydps",
        "views": "1.5K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/FNerZMOydps/hqdefault.jpg"
    },
    {
        "id": "mr88oubePEQ",
        "title": "You should be studying 😂 📖",
        "caption": "You should be studying 😂 📖 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "mr88oubePEQ",
        "views": "1.9K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/mr88oubePEQ/hqdefault.jpg"
    },
    {
        "id": "jooiDkOAPiQ",
        "title": "Life of a Pharmacy Technician student ⚕️",
        "caption": "Life of a Pharmacy Technician student ⚕️ #CannogaCollege #Ottawa #CampusLife",
        "videoId": "jooiDkOAPiQ",
        "views": "2.1K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/jooiDkOAPiQ/hqdefault.jpg"
    },
    {
        "id": "B8xkkUs_QoY",
        "title": "Our Introduction to Forensics and Crime slScene Analysis 🎓🔎",
        "caption": "Our Introduction to Forensics and Crime slScene Analysis 🎓🔎 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "B8xkkUs_QoY",
        "views": "982 views",
        "thumbnailUrl": "https://i.ytimg.com/vi/B8xkkUs_QoY/hqdefault.jpg"
    },
    {
        "id": "wgsYYr92nks",
        "title": "A sneak peek of one of our Dental Labs at Cannoga 🇨🇦🎓",
        "caption": "A sneak peek of one of our Dental Labs at Cannoga 🇨🇦🎓 #CannogaCollege #Ottawa #CampusLife",
        "videoId": "wgsYYr92nks",
        "views": "2.2K views",
        "thumbnailUrl": "https://i.ytimg.com/vi/wgsYYr92nks/hqdefault.jpg"
    }
];

let cachedShorts: YouTubeShort[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes auto-refresh for newly uploaded videos

/**
 * Fetch latest videos/shorts directly from the official YouTube channel RSS feed.
 * This is ultra-reliable, never blocked, and reflects new uploads immediately.
 */
async function fetchFromRss(): Promise<YouTubeShort[]> {
    try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; CannogaBot/1.0)',
                'Cache-Control': 'no-cache'
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];

        const xml = await res.text();
        const entries = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);
        const rssShorts: YouTubeShort[] = [];

        for (const m of entries) {
            const entry = m[1];
            const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || 'Cannoga College Shorts';
            const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
            const views = viewsMatch ? `${viewsMatch[1]} views` : '';
            const thumbMatch = entry.match(/<media:thumbnail url="(.*?)"/);
            const thumb = thumbMatch ? thumbMatch[1] : (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');

            if (videoId) {
                rssShorts.push({
                    id: videoId,
                    title,
                    caption: `${title} #CannogaCollege #Ottawa #CampusLife`,
                    videoId,
                    views,
                    thumbnailUrl: thumb
                });
            }
        }

        return rssShorts;
    } catch (err) {
        console.error('Error fetching YouTube channel RSS:', err);
        return [];
    }
}

/**
 * Scrape the YouTube channel's dedicated /shorts tab to obtain up to 50 shorts.
 */
async function fetchFromScrape(): Promise<YouTubeShort[]> {
    try {
        const res = await fetch(`https://www.youtube.com/${CHANNEL_HANDLE}/shorts`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache'
            },
            next: { revalidate: 120 }
        });

        if (!res.ok) return [];

        const html = await res.text();
        const match = html.match(/(?:var\s+ytInitialData|ytInitialData)\s*=\s*({[\s\S]+?});(?:<\/script>|\n)/);
        if (!match) return [];

        const data = JSON.parse(match[1]);
        const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];

        // Search across all tabs for the one containing richGridRenderer
        let richGrid: any[] = [];
        for (const tab of tabs) {
            const contents = tab?.tabRenderer?.content?.richGridRenderer?.contents;
            if (Array.isArray(contents) && contents.length > 0) {
                richGrid = contents;
                break;
            }
        }

        const liveShorts: YouTubeShort[] = [];

        for (const item of richGrid) {
            const content = item?.richItemRenderer?.content;
            const shortsLockup = content?.shortsLockupViewModel;
            const reelItem = content?.reelItemRenderer;

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
            } else if (reelItem) {
                const videoId = reelItem.videoId;
                const title = reelItem.headline?.simpleText || 'Cannoga College Shorts';
                const views = reelItem.viewCountText?.simpleText || '';
                const thumb = reelItem.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

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

        return liveShorts;
    } catch (err) {
        console.error('Error fetching live YouTube channel shorts scrape:', err);
        return [];
    }
}

async function fetchLiveChannelShorts(): Promise<YouTubeShort[]> {
    if (cachedShorts && (Date.now() - lastCacheTime < CACHE_TTL_MS)) {
        return cachedShorts;
    }

    try {
        const [rssResults, scrapeResults] = await Promise.allSettled([
            fetchFromRss(),
            fetchFromScrape()
        ]);

        const rssShorts = rssResults.status === 'fulfilled' ? rssResults.value : [];
        const scrapedShorts = scrapeResults.status === 'fulfilled' ? scrapeResults.value : [];

        // Prioritize newly published items from RSS feed, then merge full catalog from scrape
        const merged: YouTubeShort[] = [...rssShorts];
        for (const s of scrapedShorts) {
            if (!merged.some(existing => existing.videoId === s.videoId)) {
                merged.push(s);
            }
        }

        if (merged.length > 0) {
            cachedShorts = merged;
            lastCacheTime = Date.now();
            return merged;
        }
    } catch (err) {
        console.error('Error in fetchLiveChannelShorts:', err);
    }

    return CANNOGA_CHANNEL_SHORTS;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '4', 10)));

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
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
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
        }, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    }
}
