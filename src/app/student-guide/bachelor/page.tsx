import { ArrowLeft, Calendar, CaretRight, CheckCircle, FileText, Info, MapPin, CreditCard, ArrowRight, IdentificationBadge, Laptop, Heart, GraduationCap, House } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import Image from 'next/image';
import { Metadata } from 'next';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';

export const metadata: Metadata = {
    title: 'Undergraduate Student Reference Guide — Cannoga College',
    description: 'Essential information on degree requirements, credit hours, and university systems for undergraduate students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/bachelor/',
    },
};

export default function BachelorsGuidePage() {
    const sections = [
        { id: 'intro', title: 'Welcome', content: '' },
        { id: 'accept', title: 'Accept Admission', content: '' },
        { id: 'tuition', title: 'Tuition & Scholarships', content: '' },
        { id: 'residence', title: 'Residence Permit', content: '' },
        { id: 'enrolment', title: 'Enrolment', content: '' },
        { id: 'it-account', title: 'IT Account', content: '' },
        { id: 'healthcare', title: 'Healthcare & Fees', content: '' },
        { id: 'orientation', title: 'Orientation', content: '' },
        { id: 'housing', title: 'Housing & Aid', content: '' },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-20">
            {/* HERO SECTION */}
            <Hero
                title="Bachelor’s Students Guide"
                body="Essential information for students admitted to Bachelor’s programmes taught in English. Read carefully to ensure a smooth start to your studies."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                image={{
                    src: "/images/download (2).jpg",
                    alt: "Bachelor Students"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: "Bachelor's Guide" }
                ]}
            >

                <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                    <div className="space-y-20">
                        {/* Intro */}
                        <section id="intro" className="scroll-mt-32">
                            <ContentBox
                                icon="info"
                                title="Welcome to Cannoga College!"
                                body="This guide covers the critical steps from accepting your offer to arriving on campus. Follow the deadlines closely to secure your study place."
                            />
                        </section>

                        {/* 1. Accept Admission */}
                        <section id="accept" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">1. Accept Your Admission Offer</h2>
                            <ContentBox
                                size="large"
                                icon="calendar"
                                title="Deadline: 24 July 2026"
                                body={
                                    <div className="space-y-8 text-left">
                                        <p className="text-3xl font-bold text-black">15:00 (UTC +3)</p>
                                        <p className="text-sm font-bold text-neutral-600 leading-relaxed">
                                            Accept by this date or lose your study place offer. Use the personal link sent via email or log in to the national admissions portal.
                                        </p>
                                        <div className="bg-neutral-100 p-6 rounded-xl border-l-4 border-[#0a151a]">
                                            <h4 className="font-bold text-lg mb-2">Waitlist & Multiple Offers</h4>
                                            <ul className="text-sm font-bold space-y-2">
                                                <li>• You can accept only one degree study place per term.</li>
                                                <li>• Conditional acceptance for lower-ranked offers is possible.</li>
                                            </ul>
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        {/* 2. Tuition */}
                        <section id="tuition" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">2. Tuition Fees & Scholarships</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card
                                    title="General Rules"
                                    body="International students typically pay tuition. Fees are due after acceptance and before enrolment."
                                />
                                <Card
                                    title="Early Payment Discount"
                                    body="Receive a 25% reduction on the first year's fee if paid within 7 days of acceptance."
                                    badge={{ label: "25% Off" }}
                                />
                            </div>
                        </section>

                        {/* 3. Residence Permit */}
                        <section id="residence" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">3. Residence Permit</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card title="International Students" body="Apply for a Canadian study permit for studies immediately after accepting your offer. Processing typically takes 1-3 months." />
                                <Card title="Canada Citizens" body="No study permit required. Register for your programme and complete enrolment online." />
                                <Card title="Nordic" body="Register with the Population Info System upon arrival for a personal ID code." />
                            </div>
                        </section>

                        {/* 4. Enrolment */}
                        <section id="enrolment" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">4. Enrol for the Academic Year</h2>
                            <ContentBox
                                icon="identificationBadge"
                                title="Application Windows"
                                body={
                                    <div className="grid md:grid-cols-2 gap-8 text-left">
                                        <div>
                                            <h4 className="font-bold text-black mb-2">Attending</h4>
                                            <p className="text-sm text-neutral-600 font-bold">Start studies, get student number, and register for courses.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black mb-2">Non-Attending</h4>
                                            <p className="text-sm text-neutral-600 font-bold">Only for military service, parental leave, or medical reasons.</p>
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        {/* 5. IT Account */}
                        <section id="it-account" className="scroll-mt-32">
                            <ContentBox
                                icon="laptop"
                                title="5. Activate IT Account"
                                body="After enrolling, you will receive an email to activate your Cannoga College IT account. This gives you access to email and learning platforms."
                            />
                        </section>

                        {/* 6. Healthcare */}
                        <section id="healthcare" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">6. Healthcare & Fees</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card
                                    title="Student Healthcare (FSHS)"
                                    body="All attending degree students must ensure they have valid health coverage in Canada (e.g., OHIP or private insurance) for each term."
                                />
                                <Card
                                    title="Student Card"
                                    body="Once enrolled, get an electronic student card for public transport and restaurant discounts."
                                />
                            </div>
                        </section>

                        {/* 8. Orientation */}
                        <section id="orientation" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="graduationCap"
                                title="Orientation & Start"
                                body={
                                    <div className="space-y-6 text-left">
                                        <p className="text-sm font-bold text-neutral-700 leading-relaxed">Usually held in August/September. Helps you meet tutors, learn systems, and settle in.</p>
                                        <ul className="space-y-4">
                                            <li className="flex gap-4 items-center font-bold text-black underline text-sm"><ArrowRight size={14} weight="bold" /> Check platforms for Pre-Orientation Modules.</li>
                                            <li className="flex gap-4 items-center font-bold text-black underline text-sm"><ArrowRight size={14} weight="bold" /> Connect with your assigned Peer Tutor.</li>
                                        </ul>
                                    </div>
                                }
                            />
                        </section>

                        {/* 10. Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">7. Housing & Aid</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card
                                    title="Housing"
                                    body="Apply immediately. Cannoga assists with the application process for student housing."
                                />
                                <Card
                                    title="Financial Aid"
                                    body="Check eligibility for Canadian student financial aid (OSAP) early and apply before the deadline."
                                />
                            </div>
                        </section>

                    </div>
                </div>
            </GuideSidebarLayout>
        </div>
    );
}

