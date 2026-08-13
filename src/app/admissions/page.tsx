import { Link } from '@/components/ui/Link';
import { CTA } from '@/components/ui/CTA';
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import TableOfContents from '@/components/course/TableOfContents';
import StudentStoriesCarousel from '@/components/admissions/StudentStoriesCarousel';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Hero } from '@/components/layout/Hero';
import DbPageContent from '@/components/DbPageContent';
import { getPageContentSection } from '@/lib/pageContentConfig';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';
import { createStaticClient } from '@/lib/supabase/static';
import CountryRequirementsDropdown from '@/components/admissions/CountryRequirementsDropdown';
import ApplicationProcess from '@/components/admissions/ApplicationProcess';

export const metadata = {
    title: 'Admissions & Enrollment Hub — Cannoga College',
    description: 'Explore educational options at Cannoga. Get information on entry pathways, deadlines, fees, and requirements for all programs.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/',
    },
};

const tocSections = [
    { id: 'overview', title: 'Explore our fields', content: '' },
    { id: 'degree-programmes', title: 'Degree Programmes', content: '' },
    { id: 'how-to-apply', title: 'How to Apply', content: '' },
    { id: 'events', title: 'Events for Applicants', content: '' },
    { id: 'student-stories', title: 'Student Stories', content: '' },
    { id: 'campus', title: 'Studying on Campus', content: '' },
    { id: 'careers', title: 'Career Opportunities', content: '' },
    { id: 'online-opportunities', title: 'Online & Onsite', content: '' },
    { id: 'community', title: 'Vibrant Community', content: '' },
    { id: 'graduation', title: 'After Graduation', content: '' },
    { id: 'study-in-ottawa-canada', title: 'study in Ottawa, Ontario, Canada', content: '' },

    { id: 'lifelong', title: 'Lifelong Learning', content: '' },
    { id: 'summer', title: 'Summer Education', content: '' },
    { id: 'collaboration', title: 'Collaboration', content: '' },
    { id: 'contact', title: 'Contact & Support', content: '' },
];

export default async function AdmissionsPage() {
    const pageSlug = 'admissions';
    const getSectionDefault = (sectionKey: string) => getPageContentSection(pageSlug, sectionKey)?.defaultContent ?? '';

    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('id, slug, name, description')
        .order('name');
    const schoolList = schools || [];

    return (
        <div className="flex flex-col min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Admissions', item: '/admissions' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Admissions to Cannoga College",
                "url": "https://cannogacollege.ca/admissions",
                "description": "Admissions information for Bachelor’s and Master’s level programmes at Cannoga College in Ottawa, Ontario, Canada.",
                "mainEntity": {
                    "@type": "EducationalOccupationalProgram",
                    "name": "Degree Programmes at Cannoga College",
                    "educationalLevel": [
                        "BachelorLevel",
                        "MasterLevel"
                    ],
                    "provider": {
                        "@type": "EducationalOrganization",
                        "name": "Cannoga College",
                        "url": "https://cannogacollege.ca"
                    },
                    "inLanguage": "en",
                    "availableChannel": {
                        "@type": "ServiceChannel",
                        "serviceLocation": {
                            "@type": "Place",
                            "name": "Ottawa, Ontario, Canada"
                        }
                    }
                }
            }} />

            <Hero
                title={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_title"
                        fallbackContent={getSectionDefault('hero_title')}
                    />
                }
                body={
                    <DbPageContent
                        tagName="span"
                        pageSlug={pageSlug}
                        sectionKey="hero_subtitle"
                        fallbackContent={getSectionDefault('hero_subtitle')}
                    />
                }
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Admissions' }
                ]}
                image={{
                    src: "/images/home-carousel-3.png",
                    alt: "Admissions to Cannoga College"
                }}
            >
                <div className="flex flex-wrap gap-4">
                    <Link href="/admissions/bachelor" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white text-white inline-flex items-center gap-2" noHover>
                        Bachelor's Admissions <ArrowRight size={20} weight="bold" />
                    </Link>
                    <Link href="/admissions/master" className="text-aalto-3 font-bold underline underline-offset-8 decoration-white text-white inline-flex items-center gap-2" noHover>
                        Master's Admissions <ArrowRight size={20} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar / Table of Contents */}
                    <div className="hidden lg:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <TableOfContents sections={tocSections} />
                            <div className="bg-[#0f2027] text-white p-8 border-0 rounded-sm">
                                <h3 className="font-serif font-bold text-lg mb-2 text-white tracking-wide">Admissions Office</h3>
                                <p className="text-xs text-slate-300 mb-6 font-normal">Ottawa Campus — Designated Learning Institution (DLI #O19394821)</p>
                                <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-[#c89211] hover:underline">Contact Admissions</Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9 space-y-8 md:space-y-24 px-0 md:px-0">

                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Explore our fields</h2>
                            <p className="text-lg text-black leading-relaxed mb-4">
                                Studying at Cannoga College offers a rich academic experience where innovation, multidisciplinary collaboration, and student community thrive together. You can pursue degree education at all levels Bachelor’s and Master’s as well as various lifelong learning options. In the Cannoga College community, students have the freedom to specialise in one field or combine courses across several fields.
                            </p>
                        </section>

                        <section id="degree-programmes" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Degree Programmes &amp; Schools</h2>
                            <p className="text-lg text-black mb-6">
                                Cannoga College is organised into eight academic schools. Explore each school to discover its Bachelor's and Master's programmes, departments, and research.
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {schoolList.map((school: { id: string; slug: string; name: string; description: string | null }) => (
                                    <Link
                                        key={school.id}
                                        href={`/schools/${school.slug}`}
                                        className="group block bg-white border border-slate-200 p-6 hover:border-[#0f2027] hover:shadow-md transition-all no-underline rounded-sm"
                                    >
                                        <h3 className="font-bold text-lg mb-2 text-black flex justify-between items-center">
                                            {school.name}
                                            <ArrowRight weight="bold" size={18} className="group-hover:translate-x-1 transition-transform text-[#c89211]" />
                                        </h3>
                                        <p className="text-black opacity-60 text-sm leading-relaxed">
                                            {school.description || 'Explore programmes, departments, and research.'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            <p className="text-black">
                                Students can pursue degrees in their chosen field or explore courses across fields, gaining new perspectives and collaborative opportunities as part of a multidisciplinary community.
                            </p>
                        </section>

                        <section id="how-to-apply" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">How to Apply</h2>
                            <p className="text-lg text-black mb-8">
                                Ready to apply to Cannoga College Ottawa? Follow our international admissions process below.
                            </p>

                            {/* International Admissions Requirements by Country */}
                            <div className="mb-16">
                                <h3 className="text-2xl font-black text-black mb-6">International Admissions Requirements</h3>
                                <CountryRequirementsDropdown />
                            </div>

                            {/* 10-Step Application Process */}
                            <div className="mb-16">
                                <h3 className="text-2xl font-black text-black mb-6">Application Process</h3>
                                <ApplicationProcess />
                            </div>

                            {/* Quick Links */}
                            <div className="bg-[#f8fafc] p-8 border-l-4 border-[#0f2027] rounded-r-sm">
                                <h3 className="text-lg font-bold font-serif text-[#0f2027] mb-4">Admissions Quick Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link href="/portal/apply" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
                                        Start Application <ArrowRight size={16} weight="bold" className="text-[#c89211]" />
                                    </Link>
                                    <Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
                                        Pay Your Fees <ArrowRight size={16} weight="bold" className="text-[#c89211]" />
                                    </Link>
                                    <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
                                        Study in Canada (IRCC) <ArrowRight size={16} weight="bold" className="text-[#c89211]" />
                                    </a>
                                    <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/study-permit-application-guide.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
                                        Study Permit Guide <ArrowRight size={16} weight="bold" className="text-[#c89211]" />
                                    </a>
                                </div>
                            </div>
                        </section>

                        <section id="events" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="calendar"
                                title="Events for Applicants"
                                body={
                                    <div className="space-y-6">
                                        <p className="text-black">Cannoga College regularly organises events designed to help prospective students learn more about studying and applying:</p>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { title: "Webinars on degree programmes", desc: "Interact with programme heads" },
                                                { title: "Student chats", desc: "Peer ambassadors share experiences" },
                                                { title: "Campus events", desc: "Tailored to applicants" },
                                                { title: "Applicant newsletters", desc: "And Q&A sessions" },
                                            ].map((item) => (
                                                <li key={item.title} className="flex gap-3 items-start border-0">
                                                    <ArrowRight size={18} weight="bold" className="mt-1 text-black flex-shrink-0" />
                                                    <div>
                                                        <strong className="block text-black font-bold">{item.title}</strong>
                                                        <span className="text-black opacity-40 text-sm font-light">{item.desc}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                                image={{
                                    src: "/images/events-for-applicants.png",
                                    alt: "Students at Cannoga College event"
                                }}
                            />
                        </section>

                        <section id="student-stories" className="scroll-mt-32">
                            <div>
                                <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Student Stories</h2>
                                <p className="text-lg text-black mb-8">
                                    Hear first-hand experiences from current students and alumni about life at Cannoga College, academic projects, internships, and perspectives on how the University supports personal and professional growth.
                                </p>
                            </div>
                            <StudentStoriesCarousel />
                        </section>

                        <section id="campus" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Studying on Campus</h2>
                            <p className="text-lg text-black leading-relaxed">
                                Cannoga College’s campus provides vibrant learning spaces, studios, libraries, and collaborative hubs where students experience academic life and community activities. The campus environment supports both study and leisure, encouraging a balanced student experience.
                            </p>
                        </section>

                        <section id="careers" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Career Opportunities</h2>
                            <p className="text-lg text-black mb-8">
                                Cannoga College offers support and services to help students plan and pursue careers after graduation. Our strong industry ties ensure your education translates into real-world success.
                            </p>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { title: "Industry Collaboration", image: "/images/018a4f1509eeb2689b7d07a9cc7f89ba.jpg", desc: "Work on real projects with our global partners." },
                                    { title: "Alumni Networks", image: "/images/81bf468416f63752a8a72ca7896666ab.jpg", desc: "Connect with graduates working in leading industries." },
                                    { title: "Career Services", image: "/images/f845f2f0c16fa812a425753a4b26328a.jpg", desc: "Expert guidance for your professional journey." }
                                ].map(item => (
                                    <Card
                                        key={item.title}
                                        title={item.title}
                                        image={{
                                            src: item.image,
                                            alt: item.title
                                        }}
                                        body={item.desc}
                                        cta={{
                                            label: "Learn more",
                                            linkComponentProps: {
                                                href: "/contact"
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        <section id="online-opportunities" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Explore Online and Onsite Opportunities</h2>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Webinars on Degree Programmes</h3>
                                    <p className="text-black">Prospective students can join interactive webinars where programme content, learning outcomes, and study paths are explained by faculty and programme heads.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Podcasts About Studying</h3>
                                    <p className="text-black">Listen to podcasts where current students and staff discuss what it’s like to study at Cannoga College, how programmes are structured, and tips for success.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Chat with Students</h3>
                                    <p className="text-black">Student ambassadors are available for online chats and Q&A sessions for prospective students, offering realistic insights into student life, academics and campus culture.</p>
                                </div>
                            </div>
                        </section>

                        {/* Vibrant Community */}
                         <section id="community" className="scroll-mt-32">
                             <div className="grid lg:grid-cols-2 gap-0 overflow-hidden">
                                 {/* Left: Text Content */}
                                 <div className="p-12 md:p-16 flex flex-col justify-center bg-gray-100 text-black">
                                     <h2 className="text-3xl font-bold mb-6 text-black">Vibrant Community</h2>
                                     <h3 className="text-xl font-bold mb-4 text-black">Life Beyond the Classroom</h3>
                                     <p className="text-lg text-black leading-relaxed font-medium">
                                         From music festivals to tech hackathons, your time at Cannoga is about more than just studies.
                                     </p>
                                 </div>

                                 {/* Right: Image */}
                                 <div className="relative aspect-square lg:aspect-auto overflow-hidden">
                                       <Image
                                           src="/images/vibrant-community.png"
                                           alt="Cannoga Community"
                                           fill
                                           className="object-cover object-top"
                                           sizes="(max-width: 1024px) 100vw, 50vw"
                                       />
                                 </div>
                             </div>
                         </section>

                          {/* After Graduation */}
                           <section id="graduation" className="scroll-mt-32">
                               <div className="cc-section-divider mb-10">
                                   <h2 className="cc-h2">After Graduation</h2>
                               </div>
                               <p className="text-neutral-600 text-lg leading-relaxed mb-8 max-w-3xl">
                                   After graduating as an international student in Cannoga College Ontario, you can apply for a Post-Graduation Work Permit (PGWP) to live, find a job, and gain valuable work experience in Canada.
                               </p>
                               <div className="space-y-12">
                                   <div>
                                       <h3 className="text-xl font-bold text-black mb-4">1. Apply for a Post-Graduation Work Permit (PGWP)</h3>
                                       <div className="space-y-4 text-neutral-600 leading-relaxed">
                                           <p><strong>What it is:</strong> An open work permit that allows you to work for almost any employer in Canada.</p>
                                           <p><strong>Duration:</strong> Valid for 8 months up to 3 years, depending on the length of your study program. Programs of 2 years or longer generally qualify for a 3-year work permit.</p>
                                           <p><strong>Deadline:</strong> You must apply within 180 days of receiving your final transcript and an official letter from your school confirming you completed your program.</p>
                                           <p><strong>Working while waiting:</strong> If you apply before your study permit expires, you can work full-time while waiting for a decision on your PGWP.</p>
                                       </div>
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-bold text-black mb-4">2. Gain Canadian Work Experience</h3>
                                       <p className="text-neutral-600 leading-relaxed">
                                           Working on a PGWP allows you to build a professional network and earn Canadian work experience. This work experience is essential if you want to apply to stay in Canada permanently.
                                       </p>
                                   </div>
                                   <div>
                                       <h3 className="text-xl font-bold text-black mb-4">3. Transition to Permanent Residency (PR)</h3>
                                       <div className="space-y-4 text-neutral-600 leading-relaxed">
                                           <div>
                                               <p className="font-bold text-black">Express Entry (Canadian Experience Class):</p>
                                               <p>After completing at least 1 year of skilled work experience in Canada, you can apply through the Express Entry System. Your Canadian education and work history give you higher ranking points.</p>
                                           </div>
                                           <div>
                                               <p className="font-bold text-black">Provincial Nominee Program (OINP):</p>
                                               <p>Ontario has specific streams under the Ontario Immigrant Nominee Program for international students with a job offer or a master's/PhD degree.</p>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </section>


                        <section id="study-in-ottawa-canada" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="globeHemisphereWest"
                                title="study in Ottawa, Ontario, Canada with Cannoga College"
                                body={
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 gap-6">
                                            {[
                                                { title: "Quality & Safety", desc: "World-leading education in a safe, equal society." },
                                                { title: "Practical Innovation", desc: "Focus on independent study and real-world application." },
                                                { title: "Life Balance", desc: "Flexibility to shape your own unique academic path." }
                                            ].map(item => (
                                                <div key={item.title} className="flex gap-4 items-start">
                                                    <ArrowRight size={18} weight="bold" className="mt-1 text-black flex-shrink-0" />
                                                    <div>
                                                        <strong className="block text-black font-bold">{item.title}</strong>
                                                        <span className="text-black opacity-60 text-sm">{item.desc}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Link href="/student-guide/international" className="inline-flex items-center gap-2 font-bold underline underline-offset-4 hover:opacity-50 transition-colors text-black">
                                            Read Our International Student Guide <ArrowRight size={20} weight="bold" />
                                        </Link>
                                    </div>
                                }
                                image={{
                                    src: "/images/home-carousel-2.png",
                                    alt: "Ottawa, Ontario, Canada Campus"
                                }}
                            />
                        </section>

                        <section id="lifelong" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Lifewide and Lifelong Learning</h2>
                            <p className="text-lg text-black mb-8">Education is a journey that never ends. Explore our flexible learning paths:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { title: "Professional Modules", desc: "Deepen your expertise with specialized short courses." },
                                    { title: "Online Learning", desc: "Flexible content accessible from anywhere in the world." },
                                    { title: "Campus Workshops", desc: "Hands-on learning in our state-of-the-art labs." },
                                    { title: "Custom Training", desc: "Tailored solutions for organizational growth." }
                                ].map(item => (
                                    <Card
                                        key={item.title}
                                        title={item.title}
                                        body={item.desc}
                                        cta={{
                                            label: "View Path",
                                            linkComponentProps: {
                                                href: "#lifelong"
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        <section id="summer" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Summer and Continuing Education</h2>
                            <p className="text-lg text-black leading-relaxed">
                                Cannoga College hosts summer courses and programmes that allow students and professionals to deepen specific skills and knowledge in compact, high-impact formats. These programmes offer valuable opportunities for networking and learning from experienced faculty and industry experts.
                            </p>
                        </section>

                        <section id="collaboration" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Collaboration and Community</h2>
                            <p className="text-lg text-black leading-relaxed mb-4">
                                Cannoga College actively partners with industries, research institutions, and international universities to provide students with collaborative projects, internships, and global exchange opportunities.
                            </p>
                            <p className="text-black">
                                Students benefit from a connected academic community that supports innovation, entrepreneurship and real-world problem solving.
                            </p>
                        </section>


                        <section id="contact" className="scroll-mt-32 mb-24 -mx-4 md:mx-0">
                            <div className="bg-[#0f2027] text-white p-12">
                                <p className="text-lg mb-6">
                                    Prospective and current students can find support and contact information for admissions, campus visits, and student services through the official Cannoga College contact pages.
                                </p>
                                <p className="text-white opacity-60 mb-6">
                                    Whether you’re planning a campus visit or seeking guidance on admissions, resources are available to help guide your academic journey.
                                </p>
                                <div className="flex flex-wrap gap-x-8 gap-y-4">
                                    <Link href="/contact" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Contact Us
                                    </Link>
                                    <Link href="/admissions-policy" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Admissions Policy
                                    </Link>
                                    <Link href="/academic-regulations" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Academic Regulations
                                    </Link>
                                    <Link href="/student-handbook" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Student Handbook
                                    </Link>
                                    <Link href="/code-of-conduct" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Code of Conduct
                                    </Link>
                                    <Link href="/refund-withdrawal-policy/" className="text-lg font-bold underline underline-offset-4 hover:text-neutral-300 transition-colors">
                                        Refund Policy
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}


