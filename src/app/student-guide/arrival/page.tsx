import { ArrowRight, Airplane, MapPin, GraduationCap, ChatCircleDots, BookOpen, Globe } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import Image from 'next/image';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';
import { CTA } from "@aalto-dx/react-modules";

export const metadata = {
    title: 'New Student Arrival & Campus Welcome Guide — Cannoga College',
    description: 'Plan your travel and welcome week. View details on campus pickup options, initial registration steps, and orientation.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/arrival/',
    },
};

const sections = [
    { id: 'before-you-arrive', title: 'Before You Arrive', content: '' },
    { id: 'arriving', title: 'Arriving in the Country', content: '' },
    { id: 'starting', title: 'Starting at Cannoga', content: '' },
    { id: 'living', title: 'Living & Studying', content: '' },
    { id: 'campus-life', title: 'Campus Experience', content: '' },
    { id: 'welcome', title: 'Welcome Message', content: '' },
];


export default function ArrivalGuidePage() {
    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black font-sans">
            {/* Hero Section */}
            <Hero
                title="Arrival Guide"
                body="Starting your studies at Cannoga College is an exciting step. This guide helps you prepare, settle in, and feel confident."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Arrival Guide' }
                ]}
                image={{
                    src: "/images/Arrival Guide Hero.png",
                    alt: "Arrival Guide"
                }}
            />

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                <div className="space-y-20">
                    {/* Before You Arrive */}
                    <section id="before-you-arrive" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Before You Arrive</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card
                                title="Enrolment"
                                body="Ensure you have accepted your admission offer, paid tuition fees, and completed enrolment as an attending student."
                                badge={{ label: "Essential" }}
                            />
                            <Card
                                title="Visa & Permits"
                                body="International students should apply for a Canadian study permit as soon as possible after accepting their offer. Ensure your passport is valid."
                                badge={{ label: "Legal" }}
                            />
                            <Card
                                title="Accommodation"
                                body="Secure housing before arrival. Cannoga assists with the application process for on-campus options."
                                badge={{ label: "Housing" }}
                            />
                            <Card
                                title="What to Bring"
                                body="Bring your passport, study permit, insurance, and enrolment documents. Pack for the local climate."
                                badge={{ label: "Checklist" }}
                            />
                        </div>
                    </section>

                    {/* Arriving */}
                    <section id="arriving" className="scroll-mt-32">
                        <ContentBox
                            size="large"
                            icon="airplane"
                            title="Arriving in the Country"
                            body={
                                <div className="space-y-10 text-left">
                                    {/* Border Procedures Overview with Spotlight Image */}
                                    <div className="grid md:grid-cols-3 gap-8 items-center bg-neutral-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#0a151a]">
                                        <div className="md:col-span-2 space-y-2">
                                            <h4 className="font-bold text-xl text-black">International Students: Border Procedures</h4>
                                            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                                                International students arriving in Ontario, Canada must carry essential identification documents in their carry-on luggage and complete standard border clearance procedures with Canada Border Services Agency (CBSA).
                                            </p>
                                        </div>
                                        <div className="relative h-44 rounded-xl overflow-hidden shadow-sm w-full">
                                            <Image
                                                src="https://i.pinimg.com/736x/0f/f4/0d/0ff40da102bd55d023e062f482f710f7.jpg"
                                                alt="Arriving in Canada"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Essential Documents & Arrival Steps Grid */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-black flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 bg-[#0a151a] rounded-full inline-block" />
                                                    Essential Documents to Carry
                                                </h4>
                                                <ul className="space-y-3 text-sm text-neutral-700 font-medium">
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Valid Passport:</strong> Must remain valid for your entire stay.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Port of Entry Letter of Introduction:</strong> Confirmation of study permit approval from IRCC.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Letter of Acceptance (LOA):</strong> Official acceptance from Cannoga College.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Provincial Attestation Letter (PAL):</strong> If applicable.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Proof of Financial Support:</strong> GIC confirmation, bank statements, or scholarship letters.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg mb-4 text-black flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 bg-[#0a151a] rounded-full inline-block" />
                                                    Airport Clearance Process
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="border-l-2 border-neutral-200 pl-4 space-y-1">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Step 1: Customs</span>
                                                        <p className="text-sm font-bold text-black">CBSA Declaration Kiosk</p>
                                                        <p className="text-xs text-neutral-600">Complete your customs declaration at a airport kiosk or via the ArriveCAN app upon landing.</p>
                                                    </div>
                                                    <div className="border-l-2 border-neutral-200 pl-4 space-y-1">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Step 2: Permit Issuance</span>
                                                        <p className="text-sm font-bold text-black">Immigration Desk Interview</p>
                                                        <p className="text-xs text-neutral-600">Meet a border officer who will review your documents and issue your physical Study Permit paper document.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Immediate Next Steps Row */}
                                    <div>
                                        <h4 className="font-bold text-lg mb-4 text-black">Immediate Settlement Steps</h4>
                                        <div className="grid sm:grid-cols-3 gap-6">
                                            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                                <span className="font-bold text-sm block text-black mb-1">1. Social Insurance Number</span>
                                                <p className="text-xs text-neutral-600 leading-relaxed">Apply for a SIN at Service Canada to work on or off campus legally.</p>
                                            </div>
                                            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                                <span className="font-bold text-sm block text-black mb-1">2. Banking & Mobile</span>
                                                <p className="text-xs text-neutral-600 leading-relaxed">Open a Canadian student bank account (RBC, TD, Scotiabank) and setup a local SIM.</p>
                                            </div>
                                            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                                                <span className="font-bold text-sm block text-black mb-1">3. Transportation & Housing</span>
                                                <p className="text-xs text-neutral-600 leading-relaxed">Confirm your housing address and familiarize with OC Transpo bus & O-Train routes.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Starting at Cannoga */}
                    <section id="starting" className="scroll-mt-32">
                        <ContentBox
                            size="large"
                            icon="graduationCap"
                            title="Starting at Cannoga"
                            body={
                                <div className="space-y-10 text-left">
                                    {/* Intro Banner */}
                                    <div className="bg-neutral-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#0a151a]">
                                        <h4 className="font-bold text-xl mb-2 text-black">Welcome to Your First Week on Campus</h4>
                                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                                            Your first week at Cannoga College is designed to connect you with academic leaders, peer mentors, and essential campus resources so you can start your degree with confidence.
                                        </p>
                                    </div>

                                    {/* Detailed Grid: Orientation & Student Services */}
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Orientation Week */}
                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-xl text-black">Orientation Week</h4>
                                                    <span className="bg-[#0a151a] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">Mandatory</span>
                                                </div>
                                                <p className="text-sm text-neutral-600 mb-6 font-medium leading-relaxed">
                                                    Comprehensive orientation sessions help you understand your academic programme, meet faculty members, and master university platforms.
                                                </p>
                                                <ul className="space-y-3 text-sm text-neutral-700 font-medium">
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Faculty & Program Introductions:</strong> Meet your academic dean, program directors, and course instructors.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Digital System Onboarding:</strong> Hands-on training for the SIS Portal, Moodle LMS, and student email.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Campus ID & Library Access:</strong> Obtain your official Cannoga student card and digital library credentials.</span>
                                                    </li>
                                                    <li className="flex gap-2 items-start">
                                                        <ArrowRight size={16} className="mt-1 shrink-0 text-[#0a151a]" />
                                                        <span><strong>Peer Mentorship & Campus Tours:</strong> Connect with senior student ambassadors for guided campus exploration.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Student Support Services */}
                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-xl text-black">Student Support Services</h4>
                                                    <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">Available Daily</span>
                                                </div>
                                                <p className="text-sm text-neutral-600 mb-6 font-medium leading-relaxed">
                                                    Cannoga College provides a centralized network of specialized support services to guide your personal and academic progress.
                                                </p>
                                                <div className="space-y-4">
                                                    <div className="border-l-2 border-[#0a151a] pl-3.5">
                                                        <span className="font-bold text-sm text-black block">Academic Advising</span>
                                                        <span className="text-xs text-neutral-600">One-on-one course selection, transfer credit review, and degree audit planning.</span>
                                                    </div>
                                                    <div className="border-l-2 border-[#0a151a] pl-3.5">
                                                        <span className="font-bold text-sm text-black block">International Student Desk</span>
                                                        <span className="text-xs text-neutral-600">Regulated Canadian Immigration Counselors (RCIC) for permit renewals and work eligibility.</span>
                                                    </div>
                                                    <div className="border-l-2 border-[#0a151a] pl-3.5">
                                                        <span className="font-bold text-sm text-black block">Wellbeing & Counseling</span>
                                                        <span className="text-xs text-neutral-600">Confidential mental health support, stress management workshops, and accessibility accommodations.</span>
                                                    </div>
                                                    <div className="border-l-2 border-[#0a151a] pl-3.5">
                                                        <span className="font-bold text-sm text-black block">Career & Co-op Center</span>
                                                        <span className="text-xs text-neutral-600">Resume building, mock interviews, co-op placement advising, and employer networking.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Success / Living */}
                    <section id="living" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Living & Studying</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card
                                title="Academic Life"
                                body="Attend classes regularly, use digital platforms, and manage your time effectively between lectures and independent study."
                            />
                            <Card
                                title="Stay Connected"
                                body="Check your Cannoga email and student portal regularly for updates, schedules, and important announcements."
                            />
                        </div>
                    </section>

                    {/* Campus Experience Collage Section */}
                    <section id="campus-life" className="scroll-mt-32">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-aalto-5 font-bold text-black tracking-tight mb-2">Campus Experience & Arrival Moments</h2>
                                <p className="text-neutral-600 font-medium text-sm">Experience the vibrant atmosphere, modern spaces, and student community awaiting you in Ottawa.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 relative h-[380px] rounded-2xl overflow-hidden shadow-sm group">
                                    <Image
                                        src="https://i.pinimg.com/736x/68/37/06/683706ddb24b3e62f37aecf01fd43be9.jpg"
                                        alt="Cannoga Student Arrival & Campus Experience"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-sm border border-white/20 mb-2 inline-block">Welcome Week</span>
                                        <h3 className="text-xl font-bold text-white">Vibrant Student Life in Ottawa</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="relative h-[178px] rounded-2xl overflow-hidden shadow-sm group">
                                        <Image
                                            src="https://i.pinimg.com/736x/72/02/74/72027422a2b62ce0f06b599060ea5be1.jpg"
                                            alt="Student Collaboration"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs font-bold text-white">Academic Workspaces</p>
                                        </div>
                                    </div>
                                    <div className="relative h-[178px] rounded-2xl overflow-hidden shadow-sm group">
                                        <Image
                                            src="/images/vibrant-community.png"
                                            alt="Campus Community"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-4 left-4 text-white">
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
        </div>
        </GuideSidebarLayout>
    );
}
