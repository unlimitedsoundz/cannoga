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
                                    {/* Border Procedures Overview */}
                                    <div className="bg-neutral-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#0a151a]">
                                        <h4 className="font-bold text-xl mb-2 text-black">International Students: Border Procedures</h4>
                                        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                                            International students arriving in Ontario, Canada must carry essential identification documents in their carry-on luggage and complete standard border clearance procedures with Canada Border Services Agency (CBSA).
                                        </p>
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
                                <div className="grid md:grid-cols-2 gap-12 text-left">
                                    <div>
                                        <h4 className="font-bold text-xl mb-4">Orientation Week</h4>
                                        <p className="text-sm text-black leading-relaxed font-bold">
                                            Orientation sessions help you understand your programme, meet faculty and fellow students, and learn to navigate campus systems.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl mb-4">Student Services</h4>
                                        <p className="text-sm text-black leading-relaxed font-bold">
                                            Access academic advising, wellbeing services, career guidance, and international support.
                                        </p>
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

                    {/* Welcome Message */}
                    <section id="welcome" className="scroll-mt-32">
                        <CTA
                            title="We Are Glad You Are Here"
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
