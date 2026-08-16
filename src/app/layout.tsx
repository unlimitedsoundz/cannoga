import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalHeaderFooter } from "@/components/layout/ConditionalHeaderFooter";
import { Toaster } from "sonner";

// next/font/google is disabled because build-time font fetching fails in this environment.
// We use a standard Google Fonts link in the <head> instead.
const inter = { variable: "font-inter-var" };
const playfair = { variable: "font-playfair-var" };



export const metadata: Metadata = {
    metadataBase: new URL('https://cannogacollege.ca'),
    alternates: {
        canonical: '/',
    },
    title: {
        default: "Cannoga College Ottawa, Ontario",
        template: "%s | Cannoga College"
    },
    description: "Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.",
    keywords: ["Cannoga College", "Cannoga College Ottawa", "college Ottawa", "study in Canada", "Ontario college", "college programs", "international students"],
    applicationName: "Cannoga College",
    appleWebApp: {
        title: "Cannoga College",
        statusBarStyle: "default",
        capable: true,
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' }
        ]
    },

    openGraph: {
        type: 'website',
        locale: 'en_CA',
        siteName: 'Cannoga College',
        title: 'Cannoga College Ottawa, Ontario',
        description: "Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.",
        images: [
            {
                url: '/images/logo-cannoga.png',
                width: 800,
                height: 600,
                alt: 'Cannoga College Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@CannogaCollege',
        creator: '@CannogaCollege',
        title: 'Cannoga College Ottawa, Ontario',
        description: "Cannoga College is a career-focused college located in Ottawa, Ontario, Canada. Explore our programs, admissions, and support for international students.",
        images: ['/images/logo-cannoga.png'],
    }
};

import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&family=Source+Sans+3:ital,wght@0,300..900;1,300..900&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{ __html: `
                    :root {
                        --font-inter: 'Inter', sans-serif;
                        --font-playfair: 'Source Sans 3', 'Source Sans Pro', sans-serif;
                        --font-source: 'Source Sans 3', 'Source Sans Pro', sans-serif;
                        --font-lato: 'Lato', sans-serif;
                    }
                ` }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "CollegeOrUniversity",
                            "name": "Cannoga College",
                            "description": "Cannoga College is a career-focused college located in Ottawa, Ontario, Canada.",
                            "alternateName": "Cannoga College Ottawa Campus",
                            "url": "https://cannogacollege.ca",
                            "logo": "https://cannogacollege.ca/images/logo-cannoga.png",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "81 Montreal Rd",
                                "addressLocality": "Ottawa",
                                "postalCode": "K1L 6E8",
                                "addressRegion": "Ontario",
                                "addressCountry": "CA"
                            },
                            "location": {
                                "@type": "Place",
                                "name": "Ottawa, Ontario"
                            },
                            "sameAs": [
                                "https://www.instagram.com/cannogacollege"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+1-613-727-4723",
                                "contactType": "admissions",
                                "email": "admissions@cannogacollege.ca"
                            }
                        })
                    }}
                />
            </head>

            <body className="font-sans antialiased">
                <Toaster position="top-right" />
                <ConditionalHeaderFooter>
                    {children}
                </ConditionalHeaderFooter>
                <ScrollToTop />
            </body>
        </html>
    );
}

