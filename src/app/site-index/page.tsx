import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Comprehensive Website Directory & Index — Cannoga College',
    description: 'Use our website index to navigate quickly to admissions, faculties, support desks, and administrative pages.',
    alternates: {
        canonical: 'https://cannogacollege.ca/site-index/',
    },
};

const categories = [
    {
        title: 'Study & Admissions',
        links: [
            { name: 'Admissions Overview', href: '/admissions' },
            { name: 'Bachelor\'s Programmes', href: '/admissions/bachelor' },
            { name: 'Master\'s Programmes', href: '/admissions/master' },
            { name: 'Tuition Fees & Scholarships', href: '/admissions/tuition' },
            { name: 'Application Process', href: '/admissions/application-process' },
            { name: 'Requirements', href: '/admissions/requirements' },
            { name: 'All Courses', href: '/studies' },
        ],
    },
    {
        title: 'Research & Schools',
        links: [
            { name: 'Research Overview', href: '/research' },
            { name: 'Research Projects', href: '/research/projects' },
            { name: 'Research Publications', href: '/research/publications' },
            { name: 'All Schools', href: '/schools' },
            { name: 'School of Arts & Architecture', href: '/schools/arts' },
            { name: 'School of Business', href: '/schools/business' },
        ],
    },
    {
        title: 'Student Life & Guides',
        links: [
            { name: 'International Student Guide', href: '/student-guide/international' },
            { name: 'Exchange Students', href: '/student-guide/exchange' },
            { name: 'Arrival Guide', href: '/student-guide/arrival' },
            { name: 'Student Life', href: '/student-life' },
            { name: 'Campus Information', href: '/student-guide' },
        ],
    },
    {
        title: 'About Cannoga',
        links: [
            { name: 'Our Story', href: '/about' },
            { name: 'Contact Information', href: '/contact' },
            { name: 'News & Events', href: '/news' },
            { name: 'Collaboration', href: '/collaboration' },
            { name: 'Innovation', href: '/innovation' },
        ],
    },
    {
        title: 'Legal & Privacy',
        links: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Use', href: '/terms' },
            { name: 'Cookie Policy', href: '/cookies' },
            { name: 'Accessibility Statement', href: '/accessibility' },
        ],
    },
];

export default function SiteIndexPage() {
    return (
        <main className="min-h-screen bg-white text-black pt-32 pb-24 md:pt-48">
            <div className="container mx-auto px-4">
                <header className="max-w-4xl mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 pt-8">
                        Site Index
                    </h1>
                    <p className="text-xl text-neutral-600 leading-relaxed">
                        A comprehensive directory of all public resources, programmes, and informational pages across Cannoga College.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {categories.map((category) => (
                        <section key={category.title} className="space-y-6">
                            <div className="pb-2">
                                <h2 className="text-2xl font-bold">{category.title}</h2>
                            </div>
                            <ul className="space-y-4">
                                {category.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center justify-between text-neutral-600 hover:text-black transition-colors py-1"
                                        >
                                            <span className="text-lg">{link.name}</span>
                                            <ArrowRight size={16} weight="bold" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                <div className="mt-24 p-12 border border-neutral-100 rounded-3xl bg-neutral-50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
                        <p className="text-neutral-600">
                            Our admissions and student services teams are available to help you navigate our campus and programmes.
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="bg-[#0a151a] text-white px-8 py-4 font-bold hover:bg-neutral-800 transition-colors whitespace-nowrap"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </main>
    );
}

