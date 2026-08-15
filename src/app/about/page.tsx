import { createStaticClient } from "@/lib/supabase/static";
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Hero } from "@/components/layout/Hero";
import DynamicNewsSection from "@/components/news/DynamicNewsSection";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { ContentBox } from "@/components/ui/ContentBox";
import { Card } from "@/components/ui/Card";
import { AcademicSchoolsCarousel } from "@/components/home/AcademicSchoolsCarousel";
import GuideSidebarLayout from "@/components/layout/StudentGuideLayout";

export const metadata = {
    title: 'About Us | Our Mission, History & Ottawa Campus — Cannoga College',
    description: 'Learn about Cannoga College, our mission, and how we support student success and career-focused education on our Ottawa campus.',
    alternates: {
        canonical: 'https://cannogacollege.ca/about/',
    },
};

export default async function AboutPage() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('name, slug, description, imageUrl')
        .order('name', { ascending: true });

    const sections = [
        {
            header: { label: 'About Cannoga College', linkComponentProps: { href: '/about' } },
            links: [
                { label: 'Our Story', linkComponentProps: { href: '/about' } },
                { label: 'News & Events', linkComponentProps: { href: '/news' } },
                { label: 'Research Hub', linkComponentProps: { href: '/research' } },
                { label: 'Careers', linkComponentProps: { href: '/careers' } },
                { label: 'Alumni', linkComponentProps: { href: '/alumni' } },
                { label: 'Contact Us', linkComponentProps: { href: '/contact' } },
            ]
        }
    ];


    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'About Cannoga College', item: '/about' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "About Cannoga College",
                "url": "https://cannogacollege.ca/about/",
                "mainEntity": {
                    "@type": "EducationalOrganization",
                    "description": "Cannoga College is a career-focused college located in Ottawa, Ontario, Canada.",
                    "url": "https://cannogacollege.ca"
                }
            }} />

            <Hero
                title="About Cannoga College"
                body="Cannoga College is a career-focused post-secondary institution located in Ottawa, Ontario, Canada, committed to practical education, applied research, and student success."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About' }
                ]}
                image={{
                    src: "/images/home-carousel-3.png",
                    alt: "Cannoga College – Ottawa Campus main building"
                }}
            />

            <GuideSidebarLayout sections={sections}>
                <div className="cc-container py-8 md:py-20 space-y-24">

                    {/* Overview */}
                    <section id="overview" className="scroll-mt-32 max-w-4xl space-y-5 text-lg leading-relaxed">
                        <p className="font-semibold text-xl text-[#0f2027]">
                            Cannoga College is an approved Ontario post-secondary college located in Ottawa, Ontario. We deliver certificate, diploma, and degree <Link href="/studies" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">programs</Link> designed to equip graduates with practical skills for the Canadian and global workforce.
                        </p>
                        <p className="text-neutral-600">
                            The college welcomes domestic and <Link href="/international" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">international students</Link> into a diverse academic community. Programs span key fields including <Link href="/schools/business" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Business Administration</Link>, <Link href="/schools/technology" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Information Technology</Link>, <Link href="/schools/health-community" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Health Sciences</Link>, <Link href="/schools/hospitality-tourism" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Hospitality and Tourism</Link>, and <Link href="/schools/science" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Applied Sciences</Link>.
                        </p>
                        <p className="text-neutral-600">
                            With a focus on practical learning and student success, Cannoga College combines academic instruction with hands-on training, industry-relevant projects, and experiential learning opportunities. Learn more about our <Link href="/research" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">research hubs</Link> and explore our <Link href="/careers" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">career opportunities</Link>.
                        </p>
                        <p className="text-neutral-600">
                            International students are supported through dedicated services including <Link href="/admissions/requirements" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">admissions guidance</Link>, study permit information, academic advising, career development support, and newcomer integration services to ensure a smooth transition to life and studies in Canada.
                        </p>
                        <p className="font-semibold text-[#0f2027]">
                            Cannoga College is committed to preparing graduates who are confident, skilled, and ready to contribute meaningfully. Check out our <Link href="/alumni" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">alumni network</Link> and <Link href="/news" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">newsroom</Link>.
                        </p>
                    </section>

                    {/* Philosophy + Mission */}
                    <div className="grid lg:grid-cols-2 gap-16">
                        <section id="philosophy" className="scroll-mt-32">
                            <ContentBox
                                icon="bookOpen"
                                title="Academic Philosophy"
                                body={
                                    <div className="space-y-4">
                                        <p>Cannoga College is guided by a learner-centered approach that emphasizes critical thinking, applied knowledge, and personal development. Inspired by modern global education practices, the college integrates academic theory with practical application to ensure students gain both understanding and real-world competence.</p>
                                        <p>The learning model focuses on active engagement, collaboration, and problem-solving, encouraging students to take part in project-based learning and industry-aligned experiences.</p>
                                    </div>
                                }
                            />
                        </section>
                        <section id="mission" className="scroll-mt-32">
                            <ContentBox
                                icon="target"
                                title="Mission Statement"
                                body={
                                    <div className="space-y-4">
                                        <p>Our mission is to empower students with the knowledge, technical skills, and professional values required to succeed in their chosen careers and contribute positively to society and the global economy.</p>
                                        <ul className="space-y-2">
                                            {[
                                                "Certificate, Diploma, and Degree programs",
                                                "Interdisciplinary academic pathways",
                                                "Applied, project-based learning model",
                                                "An inclusive international student community in Ottawa"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <ArrowRight size={20} weight="bold" className="shrink-0 text-black mt-0.5" />
                                                    <span className="text-base font-bold text-black leading-tight">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            />
                        </section>
                    </div>


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
                                        <p>Ontario has specific streams under the Ontario Immigrant Nominee Program for international students with a job offer or a master&apos;s/PhD degree.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Academic Schools */}
                    <section id="schools" className="scroll-mt-32">
                        <div className="mb-8 max-w-2xl text-left">
                            <h2 className="cc-h2">Academic Schools</h2>
                            <p className="text-neutral-600 font-normal text-base mt-2">Explore specialized schools and faculties across Cannoga College.</p>
                        </div>
                        <AcademicSchoolsCarousel schools={schools || []} />
                    </section>

                    {/* Key Statistics */}
                    <section id="stats" className="scroll-mt-32">
                        <div className="py-16 bg-[#0f2027] text-white w-full border-y border-[#1e3a47] -mx-4 px-4 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-3 text-[#c89211]">2.4k</span>
                                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Enrolled Students</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-3 text-[#c89211]">250</span>
                                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Faculty &amp; Instructors</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-3 text-[#c89211]">60+</span>
                                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Countries Represented</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Industry & Research */}
                    <section id="partnerships" className="scroll-mt-32">
                        <div className="cc-section-divider mb-12">
                            <h2 className="cc-h2">Industry &amp; Research Partnerships</h2>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="cc-card cc-card-body space-y-5">
                                <p className="text-neutral-600 leading-relaxed">
                                    We don&apos;t just study the future; we build it. Cannoga College maintains strategic partnerships with over 200 global companies and research institutions. Our students have direct access to internships, joint research projects, and innovation labs that bridge the gap between academic theory and market-ready solutions.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
                                    <ContentBox
                                        icon="globe"
                                        title="Global Network"
                                        body="Member of the World Federation of Sustainability Universities."
                                    />
                                    <ContentBox
                                        icon="briefcase"
                                        title="Employment Rate"
                                        body="92% of graduates find relevant employment within 6 months."
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { src: "/images/0f4315c00b2784fbddf4239ce341dd7e.jpg", alt: "Campus life at Cannoga College" },
                                    { src: "/images/2ea8f4b07a6cd09f34810c687fd924dc.jpg", alt: "Students collaborating on campus" },
                                    { src: "/images/5e581c79ed9339bdf506cf8f30e73aaa.jpg", alt: "Modern learning environment" },
                                    { src: "/images/8abea6bf09491ed4dcead9bb2d737082.jpg", alt: "Student activities and engagement" },
                                ].map((img, index) => (
                                    <div key={index} className="relative group rounded-3xl overflow-hidden shadow-lg h-64 md:h-auto md:aspect-square">
                                        <div className="absolute inset-0 bg-[#0a151a] opacity-20 mix-blend-multiply group-hover:opacity-5 transition-opacity z-10 duration-500"></div>
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            fill
                                            className="object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Campus Community */}
                    <section id="community" className="scroll-mt-32">
                        <ContentBox
                            size="large"
                            icon="users"
                            title="Vibrant Community"
                            body={
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-black">Life Beyond the Classroom</h3>
                                    <p>
                                        From music festivals to tech hackathons, your time at Cannoga is about more than just studies. Our campus in Ottawa is a hub of activity where students from over 60 countries collaborate and create.
                                    </p>
                                </div>
                            }
                            image={{
                                src: "/images/vibrant-community.png",
                                alt: "Cannoga Community"
                            }}
                        />
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
