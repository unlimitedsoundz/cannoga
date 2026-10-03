import { readFileSync } from 'node:fs';

// Bachelor programs were converted/merged into Ontario College Diplomas (Oct 2026).
// Map of old program slug -> new Diploma slug.
const legacyProgramRedirects = JSON.parse(
    readFileSync(new URL('./src/data/legacy-program-redirects.json', import.meta.url), 'utf8')
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'mrqzlmkdhzwvbpljikjz.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'lbkrzyqpdqgtqbodkcyi.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.brandfetch.io',
            },
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'dl.dropboxusercontent.com',
            },
        ],
    },
    trailingSlash: true,
    output: 'standalone',
    serverExternalPackages: [],


    typescript: {
        ignoreBuildErrors: true,
    },
    transpilePackages: [
        'ckeditor5',
        '@ckeditor/ckeditor5-ui',
        '@ckeditor/ckeditor5-utils',
        '@ckeditor/ckeditor5-core',
        '@ckeditor/ckeditor5-engine',
        '@ckeditor/ckeditor5-enter',
        '@ckeditor/ckeditor5-typing',
        '@ckeditor/ckeditor5-paragraph',
        '@ckeditor/ckeditor5-basic-styles',
        '@ckeditor/ckeditor5-heading',
        '@ckeditor/ckeditor5-link',
        '@ckeditor/ckeditor5-list',
        '@ckeditor/ckeditor5-table',
        '@ckeditor/ckeditor5-image',
        '@ckeditor/ckeditor5-media-embed',
        '@ckeditor/ckeditor5-alignment',
        '@ckeditor/ckeditor5-autoformat',
        '@ckeditor/ckeditor5-block-quote',
        '@ckeditor/ckeditor5-cloud-services',
        '@ckeditor/ckeditor5-essentials',
        '@ckeditor/ckeditor5-indent',
        '@ckeditor/ckeditor5-undo',
        '@ckeditor/ckeditor5-upload',
        '@ckeditor/ckeditor5-special-characters'
    ],
    async redirects() {
        return Object.entries(legacyProgramRedirects).map(([from, to]) => ({
            source: `/studies/${from}`,
            destination: `/studies/${to}/`,
            permanent: true,
        }));
    },
};

export default nextConfig;
