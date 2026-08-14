import {
    ArrowRight
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';

export const metadata = {
    title: 'Undergraduate & Postgraduate Resources — Cannoga College',
    description: 'Browse essential student tools, links to student services, calendars, and support desks for a successful academic year.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/',
    },
};

export default function StudentGuidePage() {
    const sections = [
        {
            id: 'programmes',
            title: 'Programs & Degrees',
            content: '',
            items: [
                { title: "Certificate Programs", href: "/degree-programmes#certificates" },
                { title: "Diploma Programs", href: "/degree-programmes#diplomas" },
                { title: "Bachelor's Degree", href: "/admissions/bachelor" },
                { title: "Master's Degree", href: "/admissions/master" },
            ]
        },
        {
            id: 'minors',
            title: 'Minors & Combinations',
            content: '',
            items: [
                { title: "What is a Minor?", href: "#minors" },
                { title: "Benefits", href: "#minors" },
            ]
        },
        {
            id: 'courses',
            title: 'Courses & Registration',
            content: '',
            items: [
                { title: "Course Structure", href: "#courses" },
                { title: "Registration", href: "#courses" },
            ]
        },
        { id: 'language', title: 'Language Studies', content: '' },
        {
            id: 'calendar',
            title: 'Academic Calendar',
            content: '',
            items: [
                { title: "Fall Semester", href: "#calendar" },
                { title: "Winter Semester", href: "#calendar" },
            ]
        },
        {
            id: 'support',
            title: 'Support Services',
            content: '',
            items: [
                { title: "Academic Guidance", href: "#support" },
                { title: "Learning Support", href: "#support" },
                { title: "Wellbeing", href: "#support" },
            ]
        },
        { id: 'new-students', title: 'For New Students', content: '' },
        {
            id: 'student-types',
            title: 'Student Categories',
            content: '',
            items: [
                { title: "Bachelor's Students", href: "/student-guide/bachelor" },
                { title: "Master's Students", href: "/student-guide/master" },
                { title: "Chat with Students", href: "/student-guide/chat-with-cannoga-students" },
                { title: "International Students", href: "/student-guide/international" },
                { title: "Exchange Students", href: "/student-guide/exchange" },
            ]
        },
        { id: 'digital', title: 'Digital Systems', content: '' },
        { id: 'community', title: 'Community & Life', content: '' },
        {
            id: 'contact',
            title: 'Contact & Guidance',
            content: '',
            items: [
                { title: "Student Services", href: "#contact" },
                { title: "Peer Tutors", href: "#contact" },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* HERO SECTION */}
            <Hero
                title="Student Guide"
                body="Discover the tools, resources, and support available throughout your time at Cannoga College. Whether you're navigating academics, student services, or campus life, you'll find the guidance you need every step of the way."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-guide-cover.png",
                    alt: "Students collaborating at Cannoga College"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide' }
                ]}
            >

            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Main Content */}
                    <main className="lg:w-full space-y-10">

                        {/* Intro */}
                        <div>
                            <p className="text-base md:text-lg text-neutral-700 font-medium leading-relaxed">
                                Whether you are a new student, continuing your degree, or joining from abroad, this guide explains how studies are organised and how support is provided throughout your academic journey.
                            </p>
                        </div>

                        {/* Degree Programmes */}
                        <section id="programmes" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">
                                Programs &amp; Degrees at Cannoga College
                            </h2>
                            <p className="text-xs md:text-sm text-neutral-600 font-medium mb-4 leading-relaxed">
                                Cannoga College offers Certificate, Diploma, Advanced Diploma, Bachelor’s, and Master’s programmes across business, economics, management, finance, information systems, entrepreneurship, and interdisciplinary fields. All academic programs at Cannoga College are eligible for the Post-Graduation Work Permit (PGWP).
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Certificate Programs</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Rapid, career-focused training in specific technical or business domains.</p>
                                    <Link href="/degree-programmes#certificates" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Learn more →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Diploma Programs</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Comprehensive 2-year and 3-year programs combining theory with practical skills.</p>
                                    <Link href="/degree-programmes#diplomas" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Learn more →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Bachelor’s Degree</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Structured curriculum focused on core knowledge and skills.</p>
                                    <Link href="/admissions/bachelor" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Learn more →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black mb-1">Master’s Degree</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Advanced studies focusing on specialized expertise and research-oriented development.</p>
                                    <Link href="/admissions/master" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Learn more →</Link>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="font-bold text-base mb-2 text-black">Curriculum Structure</h3>
                                <ul className="grid sm:grid-cols-2 gap-2 text-xs md:text-sm text-neutral-700 font-medium">
                                    {[
                                        "Core compulsory courses", "Elective courses",
                                        "Minor studies", "Language and communication studies",
                                        "Final thesis or capstone project"
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-2">
                                            <ArrowRight size={14} className="text-[#0a151a] shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Minors */}
                        <section id="minors" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Minors and Study Combinations</h2>
                            <div className="grid md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-3">
                                    <h3 className="text-base font-bold text-black">What is a Minor?</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                        A minor is a coherent set of courses, typically ranging from 20 to 30 credits, completed alongside a major degree. It allows students to deepen expertise in a specific area or broaden knowledge beyond their main field of study.
                                    </p>
                                    <h3 className="text-base font-bold text-black pt-1">Choosing a Minor</h3>
                                    <ul className="space-y-1.5 text-xs md:text-sm text-neutral-700 font-medium">
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Within your own school</li>
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> From other schools at Cannoga College</li>
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> From interdisciplinary or entrepreneurship offerings</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-base text-black">Benefits of Minors</h3>
                                    <ul className="space-y-2 text-xs md:text-sm text-neutral-700 font-medium">
                                        {[
                                            "Strengthen employability",
                                            "Support career specialisation",
                                            "Enable interdisciplinary competence",
                                            "Prepare for advanced studies"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2">
                                                <ArrowRight size={14} className="shrink-0 text-[#0a151a]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Courses */}
                        <section id="courses" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Courses and Course Registration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-base text-black">Course Structure</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">Courses are assigned credits based on workload. Formats include lectures, seminars, team projects, case studies, and exams.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-base text-black">Registration</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">Register via the digital study system during published periods.</p>
                                    <ul className="text-xs md:text-sm space-y-1.5 text-neutral-700 font-medium">
                                        <li className="flex items-center gap-2"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Check participant limits</li>
                                        <li className="flex items-center gap-2"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Verify prerequisites</li>
                                        <li className="flex items-center gap-2"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Review selection criteria</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100">
                                <h4 className="font-bold text-sm mb-1 text-black">Other Study Options</h4>
                                <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                    In addition to degree courses, students may complete Entrepreneurship and startup courses, Interdisciplinary project courses, Open university studies, or Exchange student courses.
                                </p>
                            </div>
                        </section>

                        {/* Language */}
                        <section id="language" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">
                                Language and Communication
                            </h2>
                            <p className="text-xs md:text-sm text-neutral-600 font-medium mb-3 leading-relaxed">
                                Language studies support academic success, professional skills, and international competence.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    "Academic communication", "Intercultural communication",
                                    "English for Academic Purposes", "French language (optional)"
                                ].map(lang => (
                                    <div key={lang} className="text-xs md:text-sm font-bold text-black">
                                        {lang}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Calendar */}
                        <section id="calendar" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Academic Calendar</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-bold text-base text-black">The Academic Year</h4>
                                    <div className="space-y-2 text-xs md:text-sm font-medium">
                                        <div>
                                            <h5 className="font-bold text-black mb-0.5">Fall Semester</h5>
                                            <p className="text-neutral-600">September — December</p>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-black mb-0.5">Winter Semester</h5>
                                            <p className="text-neutral-600">January — April</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-bold text-base text-black">Teaching Periods &amp; Dates</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">Each term consists of multiple teaching periods. Courses may run intensively or throughout the semester.</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { t: "Teaching Periods", d: "Scheduled sessions" },
                                            { t: "Exam Periods", d: "Assessment weeks" },
                                            { t: "Registration", d: "Sign-up deadlines" },
                                            { t: "Breaks", d: "Winter & Summer" }
                                        ].map(item => (
                                            <div key={item.t} className="space-y-0.5">
                                                <span className="block font-bold text-black text-xs md:text-sm">{item.t}</span>
                                                <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">{item.d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Support */}
                        <section id="support" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Study Support Services</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Academic Guidance</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Programme level advising and personal study plans.</p>
                                    <Link href="/contact" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Contact Advisor →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Learning Support</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Workshops, writing support, and study skills development.</p>
                                    <Link href="#support" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">View Workshops →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Wellbeing</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Health services, accessibility, and counseling for all students.</p>
                                    <Link href="#support" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Get Support →</Link>
                                </div>
                            </div>
                        </section>

                        {/* New Students */}
                        <section id="new-students" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Information for New Students</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-base text-black">Orientation Programme</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">
                                        New students receive structured onboarding before studies begin, ensuring a smooth transition into university life.
                                    </p>
                                    <ul className="space-y-1.5 pt-1 text-xs md:text-sm font-medium text-neutral-700">
                                        {[
                                            "Degree programme introductions",
                                            "Digital systems training",
                                            "Course registration guidance",
                                            "Campus services overview"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-2">
                                                <ArrowRight size={14} className="shrink-0 text-[#0a151a]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-base text-black">Getting Started Checklist</h4>
                                    <ul className="space-y-1.5 text-xs md:text-sm font-medium text-neutral-700">
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Confirm study rights</li>
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Activate student email</li>
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Access learning platforms</li>
                                        <li className="flex gap-2 items-center"><ArrowRight size={14} className="shrink-0 text-[#0a151a]" /> Get student ID card</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Student Categories / Breakdown */}
                        <section id="student-types" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Student Categories</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Chat with Students</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Connect with current students and ambassadors to learn about life at Cannoga.</p>
                                    <Link href="/student-guide/chat-with-cannoga-students" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Chat now →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">International Students</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Support services, study permits, and integration into Ottawa&apos;s multicultural community.</p>
                                    <Link href="/student-guide/international" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">View guide →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Exchange Students</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium mb-2">Orientation, course selection, and cultural adaptation for short-term studies.</p>
                                    <Link href="/student-guide/exchange" className="font-bold underline text-xs uppercase tracking-widest text-[#0a151a]">Learn more →</Link>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section id="contact" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Contact and Guidance</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Student Services</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Reach out to programme coordinators, academic advisors, and the international support team.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base mb-1 text-black">Peer Tutors</h3>
                                    <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-medium">Connect with senior students for advice on student life and settling in.</p>
                                </div>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
            </GuideSidebarLayout>
        </div>
    );
}


