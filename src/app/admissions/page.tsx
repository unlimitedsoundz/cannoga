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

export const metadata = {
    title: 'Admissions & Enrollment Hub â€” Cannoga College',
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
                "description": "Admissions information for Bachelorâ€™s and Masterâ€™s level programmes at Cannoga College in Ottawa, Ontario, Canada.",
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
                                Studying at Cannoga College offers a rich academic experience where innovation, multidisciplinary collaboration, and student community thrive together. You can pursue degree education at all levels Bachelorâ€™s and Masterâ€™s as well as various lifelong learning options. In the Cannoga College community, students have the freedom to specialise in one field or combine courses across several fields.
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
                                Cannoga Collegeâ€™s campus provides vibrant learning spaces, studios, libraries, and collaborative hubs where students experience academic life and community activities. The campus environment supports both study and leisure, encouraging a balanced student experience.
                            </p>
                            {/* Career Opportunities Carousel */}
                            <div className="pt-2">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black text-black tracking-tight">Career Opportunities</h2>
                                    <p className="text-sm text-neutral-600 font-medium mt-1">Support and services to help plan and pursue postâ€‘graduation careers, powered by strong industry ties.</p>
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
                                    <p className="text-black">Listen to podcasts where current students and staff discuss what itâ€™s like to study at Cannoga College, how programmes are structured, and tips for success.</p>
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


                        <section id="ask-about-applying" className="scroll-mt-32 mb-16 space-y-8">
                            <div>
                                <h2 className="text-aalto-5 font-bold mb-aalto-p4 text-black tracking-tight">Ask About Applying</h2>
                                <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">
                                    Cannoga College admissions advisors are available to assist prospective students with application requirements, program entry criteria, and campus information.
                                </p>
                            </div>

                            <div className="flex flex-col gap-6 pt-2">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                        <EnvelopeSimple size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-bold text-base leading-snug">Email</h3>
                                        <a href="mailto:admissions@cannogacollege.ca" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm mt-1 block">
                                            admissions@cannogacollege.ca
                                        </a>
                                        <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                            Ottawa, Ontario, Canada resident enquiries
                                        </p>
                                    </div>
                                </div>

                                {/* Talk to Cannoga */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                        <Phone size={16} weight="bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <h3 className="text-slate-900 font-bold text-base leading-snug">Talk to Cannoga</h3>
                                            <div className="mt-1 space-y-1">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Admissions office International students only</p>
                                                <a href="tel:+12272500427" className="text-[#0f2027] font-bold underline hover:text-[#c89211] transition-colors text-sm block">
                                                    Talk to Admissions: +1 (227) 250-0427
                                                </a>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-800 space-y-1 pt-1">
                                            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#c89211] mb-1">Telephone service hours (UTC +2):</p>
                                            <ul className="space-y-0.5 text-xs text-slate-700 font-medium">
                                                <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Mon:</span><span>12:30 pm – 2:00 pm</span></li>
                                                <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Tue:</span><span>9:30 am – 11:00 am</span></li>
                                                <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Wed:</span><span>9:30 am – 11:00 am</span></li>
                                                <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Thu:</span><span>9:30 am – 11:00 am</span></li>
                                                <li className="flex gap-2"><span className="font-bold text-slate-900 w-10">Fri:</span><span className="text-red-600 font-bold">Closed</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Where to reach us */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                        <MapPin size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-bold text-base leading-snug">Where to reach us</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-sm text-slate-700">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Campus Address</h4>
                                                <p className="leading-relaxed mt-0.5">
                                                    Cannoga College – Ottawa campus<br />
                                                    81 Montreal Rd,<br />
                                                    K1L 6E8 Ottawa, Ontario, Canada
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">Mailing Address</h4>
                                                <p className="leading-relaxed mt-0.5">
                                                    Cannoga College – Ottawa campus<br />
                                                    81 Montreal Rd,<br />
                                                    K1L 6E8 Ottawa, Ontario, Canada
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Note */}
                                <div className="flex items-start gap-4 pt-2">
                                    <div className="p-2 bg-[#0f2027] text-[#c89211] rounded-full shrink-0 mt-0.5">
                                        <ArrowRight size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-bold text-base leading-snug">Application Note</h3>
                                        <p className="text-slate-600 text-sm font-normal mt-1 leading-normal">
                                            All formal applications must be submitted through the Cannoga College online portal during the official application periods.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                </div>
            </div>
        </div>
    );
}


