import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import AdmissionsHelpCard from '@/components/admissions/AdmissionsHelpCard';

export const metadata = {
    title: 'International Exchange Program Guide',
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
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            {/* Hero Section */}
            <Hero
                title="Exchange Students Guide"
                body="Everything you need to know for your exchange semester or year at Cannoga College. We look forward to welcoming you to our vibrant international community!"
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/exchange-students.png",
                    alt: "Exchange Students"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Exchange Students' }
                ]}
            >

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
                <div className="space-y-10">
                    {/* Welcome */}
                    <section id="intro" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Welcome to Cannoga College!</h2>
                        <div className="space-y-4 text-left">
                            {/* Welcome Intro & Image Spotlight */}
                            <div className="grid md:grid-cols-5 gap-6 items-center">
                                <div className="md:col-span-3 space-y-2">
                                    <h4 className="font-bold text-base md:text-lg text-black">Exchange Student Community</h4>
                                    <p className="text-sm md:text-base text-neutral-700 leading-relaxed font-medium">
                                        Completing an exchange semester or year at Cannoga College in Ottawa, Canada provides a unique opportunity to immerse yourself in high-caliber Canadian higher education, dynamic campus life, and rich cultural experiences.
                                    </p>
                                </div>
                                <div className="md:col-span-2 relative h-56 md:h-64 rounded-2xl overflow-hidden w-full shadow-md">
                                    <Image
                                        src="https://i.pinimg.com/736x/2b/5c/ca/2b5cca9c1d9d3bc9a2e2123a53e26897.jpg"
                                        alt="Cannoga Exchange Students"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <h4 className="font-bold text-base mb-1 text-black">International Exchange Office</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                        Our international student advisors guide you through Learning Agreements, credit transfer verification, visa documentation, and official transcripts.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-base mb-1 text-black">International Peer Tutors</h4>
                                    <p className="text-xs md:text-sm text-neutral-600 font-medium leading-relaxed">
                                        Every incoming exchange student is paired with a local student mentor to assist with airport arrival, orientation week, and settling into student life.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Orientation */}
                    <section id="orientation" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Welcome & Orientation Week</h2>
                        <div className="space-y-3 text-left">
                            <p className="text-sm text-neutral-700 font-medium leading-relaxed">Orientation Week takes place during the first week of term. It provides vital academic preparation, campus navigation, and social integration events.</p>
                            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
                                {[
                                    "Guided Campus & Library Tours",
                                    "SIS Portal & Moodle System Training",
                                    "Course Registration & Advising",
                                    "Canadian Cultural & Survival Workshop",
                                    "Welcome Gala & Peer Social Events",
                                    "Meet Your Faculty & Student Buddies"
                                ].map(item => (
                                    <div key={item} className="flex items-center gap-2.5">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full shrink-0" />
                                        <span className="text-xs md:text-sm font-bold text-black">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Course Selection */}
                    <section id="courses" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Course Selection & Academic Workload</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">Learning Agreement Setup</h3>
                                <ul className="space-y-1.5 text-xs md:text-sm text-neutral-700 font-medium">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                        <span>Must be signed by your home university coordinator and Cannoga Admissions prior to arrival.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                        <span>Full-time semester workload is typically 15 academic credits (5 courses at 3 credits each).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                                        <span>Adjustments to your course list are permitted within the first 2 weeks of the semester.</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">Interdisciplinary Electives</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                                    While your core enrollment remains in your nominating department (e.g., Business, Computing, Arts), exchange students may select approved elective courses across other Cannoga schools to broaden their academic scope.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Registration */}
                    <section id="registration" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Registration & Student Portal Enrollment</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">1. Institutional Enrollment</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">Activate your Cannoga student IT account upon receipt of your acceptance email. Register as an &apos;Attending Student&apos; in the SIS portal to unlock course registration rights.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">2. Course Class Sign-Up</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">Once registered, log into the SIS timetable planner to enroll into individual lecture and laboratory sections. Contact academic advising if prerequisites require override permission.</p>
                            </div>
                        </div>
                    </section>

                    {/* Housing */}
                    <section id="housing" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Housing & Arrival Logistics</h2>
                        <div className="space-y-3 text-left">
                            <div>
                                <h4 className="font-bold text-black mb-1 text-base">Housing Application & Options</h4>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">
                                    Apply for on-campus residence or affiliated student housing in Ottawa immediately after accepting your exchange offer. Read our detailed <Link href="/student-guide/housing-for-students" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Housing Guide</Link>, consult our <Link href="/student-guide/arrival" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">Arrival Guide</Link>, or check <Link href="/international" className="text-[#0a151a] underline hover:text-[#c89211] transition-colors">International Student Services</Link>.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4 pt-1">
                                <div>
                                    <h4 className="font-bold text-black mb-1 text-sm">Travel to Campus (Ottawa YOW)</h4>
                                    <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                                        Arrival via Ottawa International Airport (YOW). Take OC Transpo Route 97 or the O-Train Line directly towards the Cannoga campus center.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black mb-1 text-sm">Recommended Arrival Date</h4>
                                    <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                                        Plan to arrive 3 to 5 days prior to Orientation Week to complete housing check-in and local banking setup.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Student Life */}
                    <section id="living" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Student Life & Community Benefits</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">U-Pass & Transit</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">Exchange enrollment includes unlimited access to Ottawa OC Transpo buses and O-Train light rail system.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">Student Association (CSU)</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">Join over 40+ student clubs, academic societies, outdoor adventures, and seasonal cultural galas.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-base mb-1 text-black">Campus Athletics</h3>
                                <p className="text-xs md:text-sm text-neutral-700 font-medium leading-relaxed">Full access to the Cannoga Fitness Centre, indoor pool, climbing wall, and intramural sports leagues.</p>
                            </div>
                        </div>
                    </section>

                    {/* Checklist */}
                    <section id="checklist" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-3 text-black tracking-tight">Pre-Departure Checklist</h2>
                        <div className="space-y-3">
                            <p className="text-xs md:text-sm text-neutral-700 font-medium">Ensure all essential items below are completed before traveling to Ottawa:</p>
                            <ul className="grid sm:grid-cols-2 gap-2 pt-1">
                                {[
                                    'Valid Passport (valid min. 6 months past return date)',
                                    'Official Letter of Acceptance (LOA) from Cannoga',
                                    'Approved Study Permit / eTA Entry Visa',
                                    'Signed Learning Agreement by Home Institution',
                                    'Comprehensive Health & Travel Insurance Policy',
                                    'Confirmed Ottawa Housing Lease / Residence Receipt'
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-2.5 items-center text-black font-medium text-xs md:text-sm">
                                        <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-8">
                                <AdmissionsHelpCard
                                    title="QUESTIONS ABOUT EXCHANGE PROGRAMS?"
                                    description="Our International Student Advisors guide you through Learning Agreements, credit transfer verification, visa documentation, and arrival logistics."
                                    email="exchange@cannogacollege.ca"
                                    phone="+1 (227) 250-0427"
                                    variant="purple"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            </GuideSidebarLayout>
        </div>
    );
}

