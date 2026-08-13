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
                                <div className="space-y-8 text-left">
                                    <div className="bg-white p-8 rounded-2xl border border-neutral-200">
                                        <h4 className="font-bold text-xl mb-4 text-black">International Students: Border Procedures</h4>
                                        <p className="text-sm text-black leading-relaxed font-bold mb-4">
                                            International students arriving in Ontario, Canada must carry essential identification documents in their carry-on luggage and complete standard border clearance procedures.
                                        </p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-neutral-200">
                                        <h4 className="font-bold text-xl mb-4 text-black">Essential Documents</h4>
                                        <ul className="space-y-3 text-sm text-black">
                                            <li><strong>Valid Passport:</strong> Must remain valid for your entire planned stay.</li>
                                            <li><strong>Port of Entry Letter of Introduction:</strong> The letter issued by Immigration, Refugees and Citizenship Canada confirming your study permit approval.</li>
                                            <li><strong>Letter of Acceptance (LOA):</strong> The official acceptance letter from your Ontario designated learning institution.</li>
                                            <li><strong>Provincial Attestation Letter (PAL):</strong> A letter from Ontario confirming your school's allocation under provincial student caps (if applicable).</li>
                                            <li><strong>Proof of Financial Support:</strong> Bank statements, GIC confirmation, or scholarship letters showing you can support yourself.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-neutral-200">
                                        <h4 className="font-bold text-xl mb-4 text-black">Airport Arrival Process</h4>
                                        <ul className="space-y-3 text-sm text-black">
                                            <li><strong>CBSA Declaration:</strong> Complete your customs declaration at a kiosk or electronically using the ArriveCAN app before or upon landing.</li>
                                            <li><strong>Immigration Interview:</strong> Meet a Canada Border Services Agency officer who will review your documents and issue your physical study permit.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-neutral-200">
                                        <h4 className="font-bold text-xl mb-4 text-black">Immediate Next Steps</h4>
                                        <ul className="space-y-3 text-sm text-black">
                                            <li><strong>Social Insurance Number (SIN):</strong> Apply for a SIN at a Service Canada office if you plan to work on or off campus.</li>
                                            <li><strong>Banking and Mobile Services:</strong> Open a Canadian bank account and set up a local mobile phone plan.</li>
                                            <li><strong>Housing and Registration:</strong> Confirm your permanent accommodation and complete final course enrollment with your institution.</li>
                                        </ul>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">First Days</h4>
                                            <p className="text-sm text-black font-bold">Move into your home, register with local authorities, and consider opening a bank account.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">Locale</h4>
                                            <p className="text-sm text-black font-bold">Familiarise yourself with nearby public transport routes, grocery stores, and essential services.</p>
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
