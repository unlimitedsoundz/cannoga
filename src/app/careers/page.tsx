import React from 'react';
import { Link } from '@/components/ui/Link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Careers & Faculty Vacancies — Cannoga College Ottawa',
    description: 'Explore academic faculty appointments, administrative positions, research fellowships, and staff career opportunities at Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/careers/',
    },
};

const positions = [
    {
        title: 'University Lecturer, Engineering & Sustainability',
        department: 'School of Technology',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Leading undergraduate research and curriculum design across multi-disciplinary engineering and renewable energy systems.',
        link: '/schools/technology'
    },
    {
        title: 'Senior Admissions Coordinator',
        department: 'Admissions Services',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Assisting international and domestic applicants through credential verification, application evaluations, and orientation.',
        link: '/admissions/contact-information'
    },
    {
        title: 'Assistant Professor, Computer Science & AI',
        department: 'School of Science',
        type: 'Tenure-track',
        location: 'Ottawa campus',
        description: 'Conducting peer-reviewed machine learning research while delivering core computer science courses.',
        link: '/schools/science'
    },
    {
        title: 'IT Support & Systems Specialist',
        department: 'Information Technology Services',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Managing campus cloud infrastructure, identity management systems, and supporting digital learning platforms.',
        link: '/portal/support'
    },
    {
        title: 'Student Wellbeing & Career Advisor',
        department: 'Student Services',
        type: 'Full-time',
        location: 'Ottawa campus',
        description: 'Providing comprehensive academic advising, health & wellness referrals, and graduate career transition support.',
        link: '/student-guide'
    },
    {
        title: 'Postdoctoral Research Fellow, Clean Technology',
        department: 'Research & Innovation Hub',
        type: 'Contract (2 Years)',
        location: 'Ottawa campus',
        description: 'Participating in industry-partnered applied research in sustainable materials and environmental remediation.',
        link: '/research'
    }
];

const benefitsList = [
    { title: "Competitive Salaries & Pension", desc: "Comprehensive health benefits, dental coverage, and institutional pension contribution matching." },
    { title: "Tuition Assistance & Learning", desc: "100% tuition coverage for staff and dependents taking accredited Cannoga degree or diploma programs." },
    { title: "Ottawa Campus Facilities", desc: "Access to state-of-the-art research labs, campus fitness centers, digital library databases, and transit subsidies." },
    { title: "Flexible Work Arrangements", desc: "Hybrid options for eligible administrative roles and generous annual vacation leave allowances." }
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Careers', item: '/careers' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Careers at Cannoga College",
                "description": "Explore academic and administrative job opportunities at Cannoga College in Ottawa, Ontario.",
                "url": "https://cannogacollege.ca/careers"
            }} />

            {/* HERO SECTION USING STANDARDIZED HERO LAYOUT */}
            <Hero
                title="Work at Cannoga College"
                body="Shape the future of higher education in Ottawa, Ontario, Canada. We are seeking passionate educators, researchers, and administrative professionals to join our academic community."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Careers' }
                ]}
                image={{
                    src: "/images/careers-hero.png",
                    alt: "Work at Cannoga College"
                }}
            >
                <div className="flex flex-wrap gap-4">
                    <a 
                        href="mailto:careers@cannogacollege.ca" 
                        className="inline-flex items-center gap-2 bg-[#0f2027] hover:bg-[#1a2e35] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-4 transition-colors no-underline rounded-sm shadow-md"
                    >
                        <span>Send Your CV (careers@cannogacollege.ca)</span>
                        <ArrowRight size={16} weight="bold" />
                    </a>
                    <Link 
                        href="/about" 
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-4 transition-colors no-underline rounded-sm"
                    >
                        <span>Explore Our Mission</span>
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16">

                {/* INSTITUTIONAL CULTURE & OVERVIEW */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-black tracking-tight">Academic Excellence & Culture</h2>
                    <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                        Cannoga College is a dynamic higher education institution located in Ottawa, Ontario, Canada. Our multidisciplinary faculty spans eight specialized academic schools, offering career-focused programs in technology, business, applied sciences, health, and design.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="p-6 border border-slate-200 hover:border-black transition-all">
                            <h3 className="font-bold text-base text-slate-900 mb-2">
                                Multidisciplinary Focus
                            </h3>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed">
                                Deliver real-world impact across <Link href="/schools" className="font-bold text-[#0f2027] underline">8 Academic Schools</Link> and specialized departmental labs.
                            </p>
                        </div>
                        <div className="p-6 border border-slate-200 hover:border-black transition-all">
                            <h3 className="font-bold text-base text-slate-900 mb-2">
                                International Diversity
                            </h3>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed">
                                Teach and collaborate with students and researchers from over 40 countries across our <Link href="/student-guide/international" className="font-bold text-[#0f2027] underline">Global Community</Link>.
                            </p>
                        </div>
                        <div className="p-6 border border-slate-200 hover:border-black transition-all">
                            <h3 className="font-bold text-base text-slate-900 mb-2">
                                Ottawa Capital Location
                            </h3>
                            <p className="text-sm text-slate-600 font-normal leading-relaxed">
                                Situated at 81 Montreal Rd in Ottawa, connecting faculty with national industry partners and <Link href="/research" className="font-bold text-[#0f2027] underline">Research Networks</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* BORDERLESS HORIZONTAL ROWS FOR CURRENT POSITIONS */}
                <section id="positions" className="scroll-mt-32 space-y-8 pt-8 border-t border-slate-200">
                    <div>
                        <h2 className="text-3xl font-black text-black tracking-tight mb-2">Current Faculty & Staff Vacancies</h2>
                        <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                            Review open academic appointments, research grants, and administrative roles.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 pt-2">
                        {positions.map((pos, idx) => (
                            <div key={idx} className="border-b border-slate-100 pb-6 last:border-b-0 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="text-slate-900 font-bold text-lg leading-snug">{pos.title}</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f2027] bg-slate-100 px-3 py-1 rounded-sm self-start sm:self-auto">
                                        {pos.type}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {pos.department} • {pos.location}
                                </p>
                                <p className="text-slate-600 text-sm font-normal leading-relaxed">
                                    {pos.description}
                                </p>
                                <div className="pt-2 flex items-center gap-4 text-xs font-bold">
                                    <a 
                                        href={`mailto:careers@cannogacollege.ca?subject=Application for ${encodeURIComponent(pos.title)}`} 
                                        className="text-[#0f2027] underline hover:text-black transition-colors"
                                    >
                                        Apply via Email (careers@cannogacollege.ca) →
                                    </a>
                                    <Link href={pos.link} className="text-slate-500 hover:text-slate-900 underline">
                                        View Department →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* EMPLOYEE BENEFITS */}
                <section className="pt-8 border-t border-slate-200">
                    <h2 className="text-2xl font-black text-black tracking-tight mb-6">Why Work With Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefitsList.map((benefit, idx) => (
                            <div key={idx} className="space-y-1">
                                <h3 className="font-bold text-base text-slate-900">{benefit.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* INTERNAL LINKING DIRECTORY */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h2 className="text-2xl font-black text-black tracking-tight">Explore Cannoga Academic Departments</h2>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        Interested in joining our faculty? Learn more about our academic programs, admissions criteria, and institutional regulations:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-wider">
                        <Link href="/schools" className="p-4 border border-slate-200 hover:border-black text-[#0f2027] no-underline transition-colors block">
                            Academic Schools →
                        </Link>
                        <Link href="/degree-programmes" className="p-4 border border-slate-200 hover:border-black text-[#0f2027] no-underline transition-colors block">
                            Degree Programmes →
                        </Link>
                        <Link href="/research" className="p-4 border border-slate-200 hover:border-black text-[#0f2027] no-underline transition-colors block">
                            Research Hub →
                        </Link>
                        <Link href="/admissions-policy" className="p-4 border border-slate-200 hover:border-black text-[#0f2027] no-underline transition-colors block">
                            Admissions Policy →
                        </Link>
                    </div>
                </section>

                {/* OPEN APPLICATION CTA */}
                <section className="pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#0f2027] text-white p-8">
                        <div className="space-y-2">
                            <span className="text-slate-300 font-bold uppercase tracking-wider text-xs block">General Application</span>
                            <h3 className="text-2xl font-black text-white">Don&apos;t See a Listed Position?</h3>
                            <p className="text-slate-300 text-sm max-w-xl font-normal">
                                We welcome open applications from qualified researchers, lecturers, and staff. Send your resume and cover letter directly to our recruitment desk.
                            </p>
                        </div>
                        <a 
                            href="mailto:careers@cannogacollege.ca?subject=Open Career Application - Cannoga College" 
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-[#0f2027] font-extrabold text-xs uppercase tracking-wider px-6 py-4 whitespace-nowrap transition-colors no-underline shrink-0 rounded-sm"
                        >
                            <span>Submit Open CV</span>
                            <ArrowRight size={14} weight="bold" />
                        </a>
                    </div>
                </section>

            </div>
        </div>
    );
}
