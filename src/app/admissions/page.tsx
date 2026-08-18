import { Link } from '@/components/ui/Link';
import { CTA } from '@/components/ui/CTA';
import Image from 'next/image';
import { ArrowRight, EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
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
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { AdmissionsQuickLinksCarousel } from '@/components/admissions/AdmissionsQuickLinksCarousel';
import { AdmissionsCareerOpportunitiesCarousel } from '@/components/admissions/AdmissionsCareerOpportunitiesCarousel';
import { InternationalInfoCard } from '@/components/admissions/InternationalInfoCard';
import { StepBadge } from '@/components/ui/StepBadge';
import AdmissionsHelpCard from '@/components/admissions/AdmissionsHelpCard';

export const metadata = {
    title: 'Admissions & Enrollment Hub',
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
        .select('id, slug, name, description, imageUrl')
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
                "description": "Admissions information for Bachelor's and Master's level programmes at Cannoga College in Ottawa, Ontario, Canada.",
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
                    <Link href="/admissions/bachelor" className="bg-white text-[#0a151a] hover:bg-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-colors inline-flex items-center gap-2.5 no-underline shrink-0 shadow-md">
                        Bachelor's Admissions <ArrowRight size={16} weight="bold" />
                    </Link>
                    <Link href="/admissions/master" className="bg-white text-[#0a151a] hover:bg-slate-200 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-colors inline-flex items-center gap-2.5 no-underline shrink-0 shadow-md">
                        Master's Admissions <ArrowRight size={16} weight="bold" />
                    </Link>
                </div>
            </Hero>

            <div className="container mx-auto px-8 md:px-20 lg:px-32 py-16 md:py-24">
                {/* Main Content */}
                <div className="max-w-4xl mx-auto space-y-8 md:space-y-24">

                        <section id="overview" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Explore our fields</h2>
                            <p className="text-lg text-black leading-relaxed mb-4">
                                Studying at Cannoga College offers a rich academic experience where innovation, multidisciplinary collaboration, and student community thrive together. You can pursue degree education at all levels Bachelor's and Master's as well as various lifelong learning options. In the Cannoga College community, students have the freedom to specialise in one field or combine courses across several fields.
                            </p>
                        </section>

                        <section id="degree-programmes" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Degree Programmes &amp; Schools</h2>
                            <p className="text-lg text-black mb-6">
                                Cannoga College is organised into eight academic schools. Explore each school to discover its Bachelor's and Master's programmes, departments, and research.
                            </p>
                            <div className="mb-6">
                                <AcademicSchoolsCarousel schools={schoolList} />
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

                            {/* Admissions Quick Links Carousel */}
                            <div className="pt-2">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-black tracking-tight">Admissions Quick Links</h3>
                                    <p className="text-sm text-neutral-600 font-medium mt-1">Essential portals, fee payments, and Canadian immigration application resources.</p>
                                </div>
                                <AdmissionsQuickLinksCarousel />
                            </div>
                        </section>

                        <section id="events" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="calendar"
                                title="Events for Applicants"
                                body={
                                    <div className="space-y-6">
                                        <p className="text-slate-800 text-base md:text-lg font-medium leading-relaxed">
                                            Cannoga College regularly organises events designed to help prospective students learn more about studying and applying:
                                        </p>
                                        <div className="flex flex-col gap-4 pt-2">
                                            {[
                                                { title: "Webinars on degree programmes", desc: "Interact directly with faculty and programme heads" },
                                                { title: "Student chats", desc: "Peer ambassadors share authentic campus experiences" },
                                                { title: "Campus events", desc: "Tailored events for undergraduate and graduate applicants" },
                                                { title: "Applicant newsletters", desc: "Regular application insights and live Q&A sessions" },
                                            ].map((item) => (
                                                <div key={item.title} className="flex items-start gap-3.5">
                                                    <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                                        <ArrowRight size={14} weight="bold" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-slate-900 font-bold text-base leading-snug">{item.title}</h4>
                                                        <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                Cannoga College's campus provides vibrant learning spaces, studios, libraries, and collaborative hubs where students experience academic life and community activities. The campus environment supports both study and leisure, encouraging a balanced student experience.
                            </p>
                            {/* Career Opportunities Carousel */}
                            <div className="pt-2">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-black tracking-tight">Career Opportunities</h2>
                                    <p className="text-sm text-neutral-600 font-medium mt-1">Support and services to help plan and pursue post-graduation careers, powered by strong industry ties.</p>
                                </div>
                                <AdmissionsCareerOpportunitiesCarousel />
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
                                    <p className="text-black">Listen to podcasts where current students and staff discuss what it's like to study at Cannoga College, how programmes are structured, and tips for success.</p>
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
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <StepBadge step={1} size="w-9 h-9" />
                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-xl font-bold text-black">Apply for a Post-Graduation Work Permit (PGWP)</h3>
                                            <div className="space-y-3 text-neutral-600 leading-relaxed font-normal">
                                                <p><strong>What it is:</strong> An open work permit that allows you to work for almost any employer in Canada.</p>
                                                <p><strong>Duration:</strong> Valid for 8 months up to 3 years, depending on the length of your study program. Programs of 2 years or longer generally qualify for a 3-year work permit.</p>
                                                <p><strong>Deadline:</strong> You must apply within 180 days of receiving your final transcript and an official letter from your school confirming you completed your program.</p>
                                                <p><strong>Working while waiting:</strong> If you apply before your study permit expires, you can work full-time while waiting for a decision on your PGWP.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <StepBadge step={2} size="w-9 h-9" />
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-xl font-bold text-black">Gain Canadian Work Experience</h3>
                                            <p className="text-neutral-600 leading-relaxed font-normal">
                                                Working on a PGWP allows you to build a professional network and earn Canadian work experience. This work experience is essential if you want to apply to stay in Canada permanently.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <StepBadge step={3} size="w-9 h-9" />
                                        <div className="flex-1 space-y-3">
                                            <h3 className="text-xl font-bold text-black">Transition to Permanent Residency (PR)</h3>
                                            <div className="space-y-3 text-neutral-600 leading-relaxed font-normal">
                                                <div>
                                                    <p className="font-bold text-black">Express Entry (Canadian Experience Class):</p>
                                                    <p>After completing at least 1 year of skilled work experience in Canada, you can apply through the Express Entry System. Your Canadian education and work history give you higher ranking points.</p>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-black">Provincial Nominee Program (OINP):</p>
                                                    <p>Ontario has specific streams under the Ontario Immigrant Nominee Program for international students with a job offer or a master&apos;s/PhD degree.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>


                        <section id="study-in-ottawa-canada" className="scroll-mt-32">
                            <InternationalInfoCard />
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


                        {/* 2026/2027 DIGITAL VIEWBOOK BANNER */}
                        <section className="scroll-mt-32 p-8 rounded-3xl bg-gradient-to-br from-[#0a151a] via-[#12222a] to-[#0a151a] text-white border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="space-y-2 max-w-xl">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#c89211]">
                                        Official Publication • Edition 2026/2027
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                        Explore the Cannoga College Viewbook
                                    </h3>
                                    <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                                        Flip through our interactive 13-page digital prospectus to discover programs, faculty schools, tuition breakdowns, scholarships, and the Ottawa student journey.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3 shrink-0">
                                    <Link
                                        href="/viewbook"
                                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#c89211] hover:bg-[#b07f0f] text-black font-black text-sm transition-all shadow-lg active:scale-95 no-underline"
                                    >
                                        Open Digital Flipbook →
                                    </Link>
                                    <a
                                        href="/documents/cannoga-college-viewbook-2026-2027.pdf"
                                        download="Cannoga-College-Viewbook-2026-2027.pdf"
                                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all no-underline"
                                    >
                                        Download PDF
                                    </a>
                                </div>
                            </div>
                        </section>

                        <section id="ask-about-applying" className="scroll-mt-32 mb-16 space-y-8">
                            <AdmissionsHelpCard
                                title="ASK ABOUT APPLYING TO CANNOGA"
                                description="Cannoga College admissions advisors are available to assist prospective international students with application requirements, program entry criteria, scholarships, and campus arrival."
                                email="admissions@cannogacollege.ca"
                                phone="+1 (227) 250-0427"
                                variant="indigo"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base mb-1">Campus Address</h4>
                                    <p className="leading-relaxed text-slate-600">
                                        Cannoga College Ottawa campus<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base mb-1">Mailing &amp; Registry Address</h4>
                                    <p className="leading-relaxed text-slate-600">
                                        Cannoga College Admissions &amp; Registrar<br />
                                        81 Montreal Rd,<br />
                                        K1L 6E8 Ottawa, Ontario, Canada
                                    </p>
                                </div>
                            </div>

                            {/* Application Note */}
                            <div className="pt-2">
                                <h3 className="text-slate-900 font-bold text-base leading-snug">Application Note</h3>
                                <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                    All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
        </div>
    );
}


