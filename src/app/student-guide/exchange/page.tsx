import { ArrowRight, Info, Users, GraduationCap, BookOpen, House, Heart, ListChecks } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';

export const metadata = {
    title: 'International Exchange Program Guide — Cannoga College',
    description: 'Find checklists, enrollment procedures, and learning agreement guidelines for exchange students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/exchange/',
    },
};

export default function ExchangeStudentsPage() {
    const sections = [
        { id: 'intro', title: 'Welcome', content: '' },
        { id: 'orientation', title: 'Orientation', content: '' },
        { id: 'courses', title: 'Course Selection', content: '' },
        { id: 'registration', title: 'Registration', content: '' },
        { id: 'housing', title: 'Housing & Arrival', content: '' },
        { id: 'living', title: 'Student Life', content: '' },
        { id: 'checklist', title: 'Departure Checklist', content: '' },
    ];

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black font-sans pb-20">
            {/* Hero Section */}
            <Hero
                title="Exchange Students Guide"
                body="Everything you need to know for your exchange semester or year at Cannoga College. We look forward to welcoming you to our vibrant international community!"
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Exchange Students' }
                ]}
                image={{
                    src: "/images/download (1).jpg",
                    alt: "Exchange Students"
                }}
            />

            <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                <div className="space-y-20">
                    {/* Welcome */}
                    <section id="intro" className="scroll-mt-32">
                        <ContentBox
                            size="large"
                            icon="info"
                            title="Welcome to Cannoga College!"
                            body={
                                <div className="space-y-8 text-left">
                                    <p className="text-sm md:text-base text-neutral-700 font-medium leading-relaxed">
                                        Completing an exchange semester or year at Cannoga College in Ottawa, Canada provides a unique opportunity to immerse yourself in high-caliber Canadian higher education, dynamic campus life, and rich cultural experiences.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
                                            <h4 className="font-bold text-lg mb-2 text-black flex items-center gap-2">
                                                <Users size={22} className="text-[#0a151a]" /> International Exchange Office
                                            </h4>
                                            <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                                Our international student advisors guide you through Learning Agreements, credit transfer verification, visa documentation, and official transcripts.
                                            </p>
                                        </div>
                                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
                                            <h4 className="font-bold text-lg mb-2 text-black flex items-center gap-2">
                                                <Users size={22} className="text-[#0a151a]" /> International Peer Tutors
                                            </h4>
                                            <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                                Every incoming exchange student is paired with a local student mentor to assist with airport arrival, orientation week, and settling into student life.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Orientation */}
                    <section id="orientation" className="scroll-mt-32">
                        <ContentBox
                            size="large"
                            icon="graduationCap"
                            title="Welcome & Orientation Week"
                            body={
                                <div className="space-y-8 text-left">
                                    <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                                        <p className="text-xs font-bold text-[#0a151a] uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded-sm">Mandatory Session for Incoming Students</p>
                                    </div>
                                    <p className="text-sm text-neutral-700 font-medium">Orientation Week takes place during the first week of term. It provides vital academic preparation, campus navigation, and social integration events.</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            "Guided Campus & Library Tours",
                                            "SIS Portal & Moodle System Training",
                                            "Course Registration & Advising",
                                            "Canadian Cultural & Survival Workshop",
                                            "Welcome Gala & Peer Social Events",
                                            "Meet Your Faculty & Student Buddies"
                                        ].map(item => (
                                            <div key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
                                                <ArrowRight size={16} className="text-[#0a151a] shrink-0" />
                                                <span className="text-xs md:text-sm font-bold text-black">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Course Selection */}
                    <section id="courses" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-8 text-black tracking-tight">Course Selection & Academic Workload</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card
                                title="Learning Agreement Setup"
                                body={
                                    <ul className="space-y-3 text-xs md:text-sm text-neutral-700 font-medium">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Must be signed by your home university coordinator and Cannoga Admissions prior to arrival.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Full-time semester workload is typically 15 Canadian credits (approx. 30 ECTS credits).</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                            <span>Adjustments to your course list are permitted within the first 2 weeks of the semester.</span>
                                        </li>
                                    </ul>
                                }
                                badge={{ label: "Academic" }}
                            />
                            <Card
                                title="Interdisciplinary Electives"
                                body={
                                    <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                                        While your core enrollment remains in your nominating department (e.g., Business, Computing, Arts), exchange students may select approved elective courses across other Cannoga schools to broaden their academic scope.
                                    </p>
                                }
                                badge={{ label: "Flexibility" }}
                            />
                        </div>
                    </section>

                    {/* Registration */}
                    <section id="registration" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-8 text-black tracking-tight">Registration & Student Portal Enrollment</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card
                                title="1. Institutional Enrollment"
                                body="Activate your Cannoga student IT account upon receipt of your acceptance email. Register as an 'Attending Student' in the SIS portal to unlock course registration rights."
                                badge={{ label: "Step 1" }}
                            />
                            <Card
                                title="2. Course Class Sign-Up"
                                body="Once registered, log into the SIS timetable planner to enroll into individual lecture and laboratory sections. Contact academic advising if prerequisites require override permission."
                                badge={{ label: "Step 2" }}
                            />
                        </div>
                    </section>

                    {/* Housing */}
                    <section id="housing" className="scroll-mt-32">
                        <ContentBox
                            icon="house"
                            title="Housing & Arrival Logistics"
                            body={
                                <div className="space-y-6 text-left">
                                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                                        <h4 className="font-bold text-black mb-2 text-base">Housing Application & Options</h4>
                                        <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                                            Apply for on-campus residence or affiliated student housing in Ottawa immediately after accepting your exchange offer. Off-campus housing listings are also provided through our student portal.
                                        </p>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                                            <h4 className="font-bold text-black mb-2 text-sm">Travel to Campus (Ottawa YOW)</h4>
                                            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                                                Arrival via Ottawa International Airport (YOW). Take OC Transpo Route 97 or the O-Train Line directly towards the Cannoga campus center.
                                            </p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                                            <h4 className="font-bold text-black mb-2 text-sm">Recommended Arrival Date</h4>
                                            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                                                Plan to arrive 3 to 5 days prior to Orientation Week to complete housing check-in and local banking setup.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Student Life */}
                    <section id="living" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-8 text-black tracking-tight">Student Life & Community Benefits</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card
                                title="U-Pass & Transit"
                                body="Exchange enrollment includes unlimited access to Ottawa OC Transpo buses and O-Train light rail system."
                                badge={{ label: "Transit" }}
                            />
                            <Card
                                title="Student Association (CSU)"
                                body="Join over 40+ student clubs, academic societies, outdoor adventures, and seasonal cultural galas."
                                badge={{ label: "Clubs" }}
                            />
                            <Card
                                title="Campus Athletics"
                                body="Full access to the Cannoga Fitness Centre, indoor pool, climbing wall, and intramural sports leagues."
                                badge={{ label: "Wellness" }}
                            />
                        </div>
                    </section>

                    {/* Checklist */}
                    <section id="checklist" className="scroll-mt-32">
                        <ContentBox
                            backgroundColor="#0a151a"
                            title={<span className="text-white">Pre-Departure Checklist</span>}
                            body={
                                <div className="space-y-8">
                                    <p className="text-xs md:text-sm text-neutral-300 font-medium">Ensure all essential items below are completed before traveling to Ottawa:</p>
                                    <ul className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            'Valid Passport (valid min. 6 months past return date)',
                                            'Official Letter of Acceptance (LOA) from Cannoga',
                                            'Approved Study Permit / eTA Entry Visa',
                                            'Signed Learning Agreement by Home Institution',
                                            'Comprehensive Health & Travel Insurance Policy',
                                            'Confirmed Ottawa Housing Lease / Residence Receipt'
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 items-center text-white font-medium text-xs md:text-sm bg-white/5 p-4 rounded-xl border border-white/10">
                                                <ArrowRight size={16} className="text-white shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-neutral-300 italic pt-2">Questions? Contact the International Office at exchange@cannogacollege.ca</p>
                                </div>
                            }
                        />
                    </section>
                </div>
            </div>
            </div>
        </GuideSidebarLayout>
    );
}
