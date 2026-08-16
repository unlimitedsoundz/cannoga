import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/portal/', '/debug/', '/api/', '/sis/'],
            },
        ],
        sitemap: 'https://cannogacollege.ca/sitemap.xml',
    };
}
