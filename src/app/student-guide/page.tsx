import {
    ArrowRight
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';
import { ProgramLevelsCarousel } from '@/components/student-guide/ProgramLevelsCarousel';
import { StudySupportCarousel } from '@/components/student-guide/StudySupportCarousel';
import { AcademicCalendarCarousel } from '@/components/student-guide/AcademicCalendarCarousel';
import { StudentCategoriesCarousel } from '@/components/student-guide/StudentCategoriesCarousel';

export const metadata = {
    title: 'Undergraduate & Postgraduate Resources',
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
                { title: "Advanced Diploma", href: "/admissions/master" },
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
                { title: "Health & Wellbeing", href: "/student-guide/health-and-wellbeing/" },
            ]
        },
        { id: 'new-students', title: 'For New Students', content: '' },
        {
            id: 'student-types',
            title: 'Student Categories',
            content: '',
            items: [
                { title: "Bachelor's Students", href: "/student-guide/bachelor" },
                { title: "Advanced Diploma Students", href: "/student-guide/master" },
                { title: "Student Housing", href: "/housing/" },
                { title: "Health & Wellbeing Guide", href: "/student-guide/health-and-wellbeing/" },
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
                    <main className="lg:w-full space-y-10 md:space-y-14 text-base md:text-lg font-normal text-black leading-relaxed">

                        {/* Intro */}
                        <div>
                            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
                                Whether you are a new student, continuing your degree, or joining from abroad, this guide explains how studies are organised and how support is provided throughout your academic journey.
                            </p>
                        </div>

                        {/* Degree Programmes */}
                        <section id="programmes" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Programs &amp; Degrees at Cannoga College
                            </h2>
                            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
                                Cannoga College offers Certificate, Diploma, Advanced Diploma, and Bachelor’s programmes across business, economics, management, finance, information systems, entrepreneurship, and interdisciplinary fields. Eligible full-time diploma, advanced diploma, and undergraduate programs qualify for the Post-Graduation Work Permit (PGWP) pathway.
                            </p>

                            <ProgramLevelsCarousel />

                            <div className="pt-4">
                                <h3 className="font-bold text-lg md:text-xl mb-3 text-black">Curriculum Structure</h3>
                                <ul className="grid sm:grid-cols-2 gap-3 text-base md:text-lg text-black font-normal">
                                    {[
                                        "Core compulsory courses", "Elective courses",
                                        "Minor studies", "Language and communication studies",
                                        "Final thesis or capstone project"
                                    ].map(item => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Minors */}
                        <section id="minors" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Minors and Study Combinations</h2>
                            <div className="grid md:grid-cols-2 gap-6 items-start">
                                <div className="space-y-3">
                                    <h3 className="text-lg md:text-xl font-bold text-black">What is a Minor?</h3>
                                    <p className="text-base md:text-lg text-black font-normal leading-relaxed">
                                        A minor is a coherent set of courses, typically ranging from 20 to 30 credits, completed alongside a major degree. It allows students to deepen expertise in a specific area or broaden knowledge beyond their main field of study.
                                    </p>
                                    <h3 className="text-lg md:text-xl font-bold text-black pt-2">Choosing a Minor</h3>
                                    <ul className="space-y-2 text-base md:text-lg text-black font-normal">
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Within your own school</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>From other schools at Cannoga College</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>From interdisciplinary or entrepreneurship offerings</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg md:text-xl text-black">Benefits of Minors</h3>
                                    <ul className="space-y-2 text-base md:text-lg text-black font-normal">
                                        {[
                                            "Strengthen employability",
                                            "Support career specialisation",
                                            "Enable interdisciplinary competence",
                                            "Prepare for advanced studies"
                                        ].map(item => (
                                            <li key={item} className="flex items-start gap-2.5">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Courses */}
                        <section id="courses" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Courses and Course Registration</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg md:text-xl text-black">Course Structure</h3>
                                    <p className="text-base md:text-lg text-black font-normal leading-relaxed">Courses are assigned credits based on workload. Formats include lectures, seminars, team projects, case studies, and exams.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg md:text-xl text-black">Registration</h3>
                                    <p className="text-base md:text-lg text-black font-normal leading-relaxed">Register via the digital study system during published periods.</p>
                                    <ul className="text-base md:text-lg space-y-2 text-black font-normal">
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Check participant limits</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Verify prerequisites</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Review selection criteria</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100">
                                <h4 className="font-bold text-base md:text-lg mb-1 text-black">Other Study Options</h4>
                                <p className="text-base md:text-lg text-black font-normal leading-relaxed">
                                    In addition to degree courses, students may complete Entrepreneurship and startup courses, Interdisciplinary project courses, Open university studies, or Exchange student courses.
                                </p>
                            </div>
                        </section>

                        {/* Language */}
                        <section id="language" className="scroll-mt-32 space-y-3">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">
                                Language and Communication
                            </h2>
                            <p className="text-base md:text-lg text-black font-normal leading-relaxed">
                                Language studies support academic success, professional skills, and international competence.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    "Academic communication", "Intercultural communication",
                                    "English for Academic Purposes", "French language (optional)"
                                ].map(lang => (
                                    <div key={lang} className="text-base md:text-lg font-bold text-black">
                                        {lang}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Calendar */}
                        <section id="calendar" className="scroll-mt-32 space-y-3">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Academic Calendar</h2>
                            <AcademicCalendarCarousel />
                        </section>

                        {/* Support */}
                        <section id="support" className="scroll-mt-32 space-y-3">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Study Support Services</h2>
                            <StudySupportCarousel />
                        </section>

                        {/* New Students */}
                        <section id="new-students" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Information for New Students</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg md:text-xl text-black">Orientation Programme</h4>
                                    <p className="text-base md:text-lg text-black leading-relaxed font-normal">
                                        New students receive structured onboarding before studies begin, ensuring a smooth transition into university life.
                                    </p>
                                    <ul className="space-y-2 pt-1 text-base md:text-lg font-normal text-black">
                                        {[
                                            "Degree programme introductions",
                                            "Digital systems training",
                                            "Course registration guidance",
                                            "Campus services overview"
                                        ].map(item => (
                                            <li key={item} className="flex items-start gap-2.5">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg md:text-xl text-black">Getting Started Checklist</h4>
                                    <ul className="space-y-2 text-base md:text-lg font-normal text-black">
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Confirm study rights</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Activate student email</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Access learning platforms</span>
                                        </li>
                                        <li className="flex gap-2.5 items-start">
                                            <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Get student ID card</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Student Categories / Breakdown */}
                        <section id="student-types" className="scroll-mt-32 space-y-3">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Student Categories</h2>
                            <StudentCategoriesCarousel />
                        </section>

                        {/* Contact */}
                        <section id="contact" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Contact and Guidance</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Student Services</h3>
                                    <p className="text-base md:text-lg text-black leading-relaxed font-normal">Reach out to programme coordinators, academic advisors, and the international support team.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Peer Tutors</h3>
                                    <p className="text-base md:text-lg text-black leading-relaxed font-normal">Connect with senior students for advice on student life and settling in.</p>
                                </div>
                            </div>
                        </section>

                        {/* Student Resource Hub */}
                        <section id="resource-hub" className="scroll-mt-32 pt-6 border-t border-neutral-200 space-y-4">
                            <div className="mb-4">
                                <h2 className="text-aalto-5 font-bold mb-1 text-black tracking-tight">Student Resource Hub</h2>
                                <p className="text-base md:text-lg text-black font-normal">Direct access to campus services, health support, careers, and academic governance.</p>
                            </div>
                            <StudentResourceHubCarousel />
                        </section>

                    </main>
                </div>
            </div>
            </GuideSidebarLayout>
        </div>
    );
}


