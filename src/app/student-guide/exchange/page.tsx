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
                                    <p className="text-aalto-3 text-black font-medium leading-relaxed">
                                         Completing an exchange at Cannoga College is a unique opportunity to experience Canadian education, culture, and student life.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Users size={24} /> International Office
                                            </h4>
                                            <p className="text-sm text-black font-bold">Our exchange coordinators are here to support you with learning agreements and general advice.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                                <Users size={24} /> Student Tutors
                                            </h4>
                                            <p className="text-sm text-black font-bold">Every exchange student is assigned a local buddy to help you settle in and meet new friends.</p>
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
                            title="Orientation Week"
                            body={
                                <div className="space-y-8 text-left">
                                    <p className="text-sm font-bold text-black uppercase tracking-widest">Mandatory for all incoming exchange students.</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            "Campus tours", "IT system training",
                                            "Course registration help", "Social events & parties",
                                            "Survival Canadian session", "Meet your tutors"
                                        ].map(item => (
                                            <div key={item} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-neutral-100 shadow-sm">
                                                <ArrowRight size={16} weight="bold" />
                                                <span className="text-sm font-bold">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Course Selection */}
                    <section id="courses" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Course Selection</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <ContentBox
                                icon="bookOpen"
                                title="Learning Agreement"
                                body={
                                    <ul className="space-y-3 text-sm font-bold text-black">
                                        <li>• Signed by home university & Cannoga before arrival.</li>
                                        <li>• Updateable during the first 2 weeks.</li>
                                        <li>• Standard workload: 30 credits per semester.</li>
                                    </ul>
                                }
                            />
                            <ContentBox
                                icon="info"
                                title="Academic Breadth"
                                body="While primarily focused on your nominating department, interdisciplinary study is often possible across our diverse schools."
                            />
                        </div>
                    </section>

                    {/* Registration */}
                    <section id="registration" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Registration & Enrollment</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card
                                title="Academic Enrollment"
                                body="Enroll as 'Attending' once your IT account is active to enable study rights and catalog access."
                            />
                            <Card
                                title="Course Registration"
                                body="You must sign up for each course separately in the student portal after semester enrollment."
                            />
                        </div>
                    </section>

                    {/* Housing */}
                    <section id="housing" className="scroll-mt-32">
                        <ContentBox
                            icon="house"
                            title="Housing & Arrival"
                            body={
                                <div className="space-y-6 text-left">
                                    <p className="text-sm font-bold text-black">Apply for housing through foundations (HOAS/KUNI) as soon as you receive your acceptance letter.</p>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-black mb-2">Travel to Campus</h4>
                                            <p className="text-xs text-black font-bold"> commuter train or shuttle from Ottawa International (HEL).</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black mb-2">When to Arrive?</h4>
                                            <p className="text-xs text-black font-bold">2-3 days before Orientation Week recommended.</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </section>

                    {/* Student Life */}
                    <section id="living" className="scroll-mt-32">
                        <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">Student Life & Benefits</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card
                                title="Student Card"
                                body="Massive discounts on trains, buses, and campus meals."
                            />
                            <Card
                                title="Student Union"
                                body="Join clubs, attend grand balls, and traditional dinner parties."
                            />
                            <Card
                                title="Sauna Culture"
                                body="Most student housing has shared saunas. Relax and socialize!"
                            />
                        </div>
                    </section>

                    {/* Checklist */}
                    <section id="checklist" className="scroll-mt-32">
                        <ContentBox
                            backgroundColor="#0a151a"
                            title={<span className="text-white">Departure Checklist</span>}
                            body={
                                <div className="space-y-8">
                                    <ul className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            'Valid Passport / ID card',
                                            'Acceptance Letter',
                                            'Signed Learning Agreement',
                                            'Health Insurance',
                                            'Housing contract',
                                            'Warm clothing'
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 items-center text-white font-bold text-sm">
                                                <ArrowRight size={14} weight="bold" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-white text-sm italic">Questions? Contact admissions@cannogacollege.ca</p>
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
