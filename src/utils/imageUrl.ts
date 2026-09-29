/**
 * Utility for normalizing and resolving direct image URLs from common hosting services
 * (Imgur albums, Imgur single posts, Google Drive, Dropbox, etc.)
 */

export function normalizeImageUrl(url?: string | null, fallback: string = ''): string {
    if (!url) return fallback;
    const cleanUrl = url.trim();
    if (!cleanUrl) return fallback;

    // Single Imgur post: https://imgur.com/XXXXX (not /a/ or /gallery/)
    const imgurSingleMatch = cleanUrl.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,8})(?:\.[a-zA-Z]+)?$/i);
    if (imgurSingleMatch && !cleanUrl.includes('/a/') && !cleanUrl.includes('/gallery/')) {
        return `https://i.imgur.com/${imgurSingleMatch[1]}.jpg`;
    }

    // Google Drive preview / sharing link
    const gDriveMatch = cleanUrl.match(/^https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
    if (gDriveMatch) {
        return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
    }

    // Dropbox shared link
    if (cleanUrl.includes('dropbox.com')) {
        return cleanUrl.replace(/[?&]dl=0/, '?raw=1');
    }

    return cleanUrl;
}

/**
 * Server-side / async resolver that fetches HTML metadata if a gallery/album link (e.g. Imgur album) is passed.
 */
export async function resolveDirectImageUrl(url?: string | null): Promise<string> {
    if (!url) return '';
    let cleanUrl = url.trim();
    if (!cleanUrl) return '';

    // Check if it's an Imgur album/gallery: https://imgur.com/a/XXXXX or /gallery/XXXXX
    if (cleanUrl.match(/^https?:\/\/(?:www\.)?imgur\.com\/(?:a|gallery)\/([a-zA-Z0-9]+)/i)) {
        try {
            const res = await fetch(cleanUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                next: { revalidate: 3600 }
            });

            if (res.ok) {
                const html = await res.text();
                const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+[^>]*content=["']([^"']+)["']/i) ||
                                     html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                                     html.match(/<meta\s+name=["']twitter:image["']\s+[^>]*content=["']([^"']+)["']/i);

                if (ogImageMatch && ogImageMatch[1]) {
                    return ogImageMatch[1].replace(/\?.*$/, '');
                }
            }
        } catch (err) {
            console.error('Failed to resolve Imgur album direct image:', err);
        }
    }

    return normalizeImageUrl(cleanUrl);
}
