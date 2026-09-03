import { ArrowRight, Airplane, MapPin, GraduationCap, ChatCircleDots, BookOpen, Globe } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import Image from 'next/image';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { ContentBox } from '@/components/ui/ContentBox';
import { CTA } from "@aalto-dx/react-modules";
import { BeforeYouArriveCarousel } from '@/components/student-guide/BeforeYouArriveCarousel';

export const metadata = {
    title: 'New Student Arrival & Campus Welcome Guide',
    description: 'Plan your travel and welcome week. View details on campus pickup options, initial registration steps, and orientation.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/arrival/',
    },
};

const sections = [
    { id: 'before-you-arrive', title: 'Before You Arrive', content: '' },
    { id: 'arriving', title: 'Arriving in the Country', content: '' },
    { id: 'starting', title: 'Starting at', content: '' },
    { id: 'living', title: 'Living & Studying', content: '' },
    { id: 'campus-life', title: 'Campus Experience', content: '' },
    { id: 'welcome', title: 'Welcome Message', content: '' },
];


export default function ArrivalGuidePage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Hero Section */}
            <Hero
                title="Arrival Guide"
                body="Starting your studies at Cannoga College is an exciting step. This guide helps you prepare, settle in, and feel confident."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/Arrival Guide Hero.png",
                    alt: "Arrival Guide"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Arrival Guide' }
                ]}
            >
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
                <div className="space-y-8">
                    {/* Before You Arrive */}
                    <section id="before-you-arrive" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Before You Arrive</h2>
                        <BeforeYouArriveCarousel />
                    </section>

                    {/* Arriving */}
                    <section id="arriving" className="scroll-mt-32 space-y-4">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight">Arriving in the Country</h2>
                        <div className="space-y-4 text-left">
                            {/* Border Procedures Overview with Large Image */}
                            <div className="grid md:grid-cols-12 gap-6 items-center my-4">
                                <div className="md:col-span-6 lg:col-span-7 space-y-3">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-black tracking-tight leading-tight">
                                        International Students: Border Clearance in Canada
                                    </h3>
                                    <p className="text-base md:text-lg text-black leading-relaxed font-normal">
                                        International students arriving in Ontario, Canada must carry essential identification documents in their carry-on luggage and complete standard border clearance procedures with the Canada Border Services Agency (CBSA) at their initial Canadian port of entry.
                                    </p>
                                </div>
                                <div className="md:col-span-6 lg:col-span-5 relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-xl overflow-hidden w-full border border-slate-200">
                                    <Image
                                        src="https://i.pinimg.com/736x/0f/f4/0d/0ff40da102bd55d023e062f482f710f7.jpg"
                                        alt="Arriving in Canada"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 45vw"
                                    />
                                </div>
                            </div>

                            {/* Essential Documents & Arrival Steps Grid */}
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg md:text-xl mb-3 text-black flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 bg-[#0a151a] rounded-full inline-block" />
                                            Essential Documents to Carry
                                        </h4>
                                        <ul className="space-y-2 text-base md:text-lg text-black font-normal">
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Valid Passport:</strong> Must remain valid for your entire stay.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Port of Entry Letter of Introduction:</strong> Confirmation of study permit approval from IRCC.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Letter of Acceptance (LOA):</strong> Official acceptance from Cannoga College (Registered Private Career College).</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Provincial Attestation Letter (PAL):</strong> Mandatory official document issued by the Province of Ontario confirming your study permit allocation.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Proof of Financial Support:</strong> GIC certificate, bank statements, or sponsor letters meeting the <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html#doc3" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black hover:text-[#c89211]">IRCC financial criteria</a> (CAD $23,448 for one year of living expenses for single applicants outside Quebec starting Sept 1, 2026, plus tuition &amp; travel).</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg md:text-xl mb-3 text-black flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 bg-[#0a151a] rounded-full inline-block" />
                                            Airport Clearance Process
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="pl-3 border-l-2 border-black space-y-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-black">Step 1: Customs</span>
                                                <p className="text-base md:text-lg font-bold text-black">CBSA Declaration Kiosk &amp; ArriveCAN</p>
                                                <p className="text-base text-black">Complete your customs declaration at an airport kiosk or via the ArriveCAN digital application upon landing.</p>
                                            </div>
                                            <div className="pl-3 border-l-2 border-black space-y-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-black">Step 2: Permit Issuance</span>
                                                <p className="text-base md:text-lg font-bold text-black">Immigration Desk Interview</p>
                                                <p className="text-base text-black">Meet a border officer who will review your documents and issue your physical Study Permit paper document.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Immediate Next Steps Row */}
                            <div className="pt-2">
                                <h4 className="font-bold text-lg md:text-xl mb-2 text-black">Immediate Settlement Steps</h4>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <span className="font-bold text-base md:text-lg block text-black mb-1">1. Social Insurance Number (SIN)</span>
                                        <p className="text-base text-black leading-relaxed font-normal">Apply for a SIN at Service Canada to work on or off campus legally.</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-base md:text-lg block text-black mb-1">2. Banking &amp; Mobile</span>
                                        <p className="text-base text-black leading-relaxed font-normal">Open a Canadian student bank account (RBC, TD, Scotiabank) and setup a local SIM.</p>
                                    </div>
                                    <div>
                                        <span className="font-bold text-base md:text-lg block text-black mb-1">3. Transportation &amp; Housing (OC Transpo)</span>
                                        <p className="text-base text-black leading-relaxed font-normal">Confirm your housing address and familiarize with OC Transpo bus &amp; O-Train routes across Ottawa.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Starting at Cannoga */}
                    <section id="starting" className="scroll-mt-32 space-y-4">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight">Starting at Cannoga</h2>
                        <div className="space-y-4 text-left">
                            {/* Intro Banner */}
                            <div>
                                <h4 className="font-bold text-lg md:text-xl mb-1 text-black">Welcome to Your First Week on Campus</h4>
                                <p className="text-base md:text-lg text-black leading-relaxed font-normal">
                                    Your first week at Cannoga College is designed to connect you with academic leaders, peer mentors, and essential campus resources so you can start your studies in Ontario with confidence.
                                </p>
                            </div>

                            {/* Detailed Grid: Orientation & Student Services */}
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                {/* Orientation Week */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg md:text-xl text-black mb-2">Orientation Week</h4>
                                        <p className="text-base md:text-lg text-black mb-3 font-normal leading-relaxed">
                                            Comprehensive orientation sessions help you understand your academic programme, meet faculty members, and master university platforms.
                                        </p>
                                        <ul className="space-y-2 text-base md:text-lg text-black font-normal">
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Faculty & Program Introductions:</strong> Meet your academic dean, program directors, and course instructors.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Digital System Onboarding:</strong> Hands-on training for the SIS Portal, Moodle LMS, and student email.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Campus ID & Library Access:</strong> Obtain your official Cannoga student card and digital library credentials.</span>
                                            </li>
                                            <li className="flex gap-2.5 items-start">
                                                <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" />
                                                <span><strong>Peer Mentorship & Campus Tours:</strong> Connect with senior student ambassadors for guided campus exploration.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Student Support Services */}
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-lg md:text-xl text-black mb-2">Student Support Services</h4>
                                        <p className="text-base md:text-lg text-black mb-3 font-normal leading-relaxed">
                                            Cannoga College provides a centralized network of specialized support services to guide your personal and academic progress.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="pl-3 border-l-2 border-black">
                                                <span className="font-bold text-base md:text-lg text-black block">Academic Advising</span>
                                                <span className="text-base text-black">One-on-one course selection, transfer credit review, and degree audit planning.</span>
                                            </div>
                                            <div className="pl-3 border-l-2 border-black">
                                                <span className="font-bold text-base md:text-lg text-black block">International Student Desk</span>
                                                <span className="text-base text-black">Regulated Canadian Immigration Counselors (RCIC) for permit renewals and work eligibility.</span>
                                            </div>
                                            <div className="pl-3 border-l-2 border-black">
                                                <Link href="/student-guide/health-and-wellbeing/" className="font-bold text-base md:text-lg text-black block hover:text-[#c89211] transition-colors">Wellbeing &amp; Counseling →</Link>
                                                <span className="text-base text-black">Confidential mental health support, stress management workshops, and accessibility accommodations.</span>
                                            </div>
                                            <div className="pl-3 border-l-2 border-black">
                                                <span className="font-bold text-base md:text-lg text-black block">Career & Co-op Center</span>
                                                <span className="text-base text-black">Resume building, mock interviews, co-op placement advising, and employer networking.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Success / Living */}
                    <section id="living" className="scroll-mt-32 space-y-4">
                        <h2 className="text-aalto-5 font-bold text-black tracking-tight">Living & Studying</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="py-2">
                                <h3 className="font-bold text-lg md:text-xl text-black mb-1">Academic Life</h3>
                                <p className="text-base md:text-lg text-black leading-relaxed font-normal">
                                    Attend classes regularly, use digital platforms, and manage your time effectively between lectures and independent study.
                                </p>
                            </div>
                            <div className="py-2">
                                <h3 className="font-bold text-lg md:text-xl text-black mb-1">Stay Connected</h3>
                                <p className="text-base md:text-lg text-black leading-relaxed font-normal">
                                    Check your Cannoga email and student portal regularly for updates, schedules, and important announcements.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Campus Experience Collage Section */}
                    <section id="campus-life" className="scroll-mt-32">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-1.5">
                                    Campus Experience &amp; Arrival in Ottawa
                                </h2>
                                <p className="text-black font-medium text-sm">Experience the vibrant atmosphere, modern spaces, and student community awaiting you in Ottawa.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="md:col-span-2 relative h-[320px] rounded-2xl overflow-hidden shadow-sm group">
                                    <Image
                                        src="https://i.pinimg.com/736x/68/37/06/683706ddb24b3e62f37aecf01fd43be9.jpg"
                                        alt="Cannoga Student Arrival & Campus Experience"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-5 left-5 right-5 text-white">
                                        <h3 className="text-lg font-bold text-white">Vibrant Student Life in Ottawa</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <div className="relative h-[148px] rounded-2xl overflow-hidden shadow-sm group">
                                        <Image
                                            src="https://i.pinimg.com/736x/72/02/74/72027422a2b62ce0f06b599060ea5be1.jpg"
                                            alt="Student Collaboration"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <p className="text-xs font-bold text-white">Academic Workspaces</p>
                                        </div>
                                    </div>
                                    <div className="relative h-[148px] rounded-2xl overflow-hidden shadow-sm group">
                                        <Image
                                            src="/images/vibrant-community.png"
                                            alt="Campus Community"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <p className="text-xs font-bold text-white">Inclusive Campus Community</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Welcome Message */}
                    <section id="welcome" className="scroll-mt-32">
                        <CTA
                            title="We Are Glad You Are Here At Cannoga"
                            body="Arriving in a new place can feel overwhelming, but Cannoga College is here to support you from arrival through graduation."
                            cta={{
                                label: "Explore Student Guide",
                                linkComponentProps: {
                                    href: "/student-guide",
                                },
                            }}
                        />
                    </section>
                </div>
            </div>
            </GuideSidebarLayout>
        </div>
    );
}

