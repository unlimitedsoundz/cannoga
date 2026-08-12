import { ArrowLeft, Calendar, CaretRight, CheckCircle, FileText, Info, MapPin, ArrowRight, IdentificationBadge, Laptop, GraduationCap, House, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Hero } from '@/components/layout/Hero';
import { Metadata } from 'next';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';

export const metadata: Metadata = {
    title: 'Postgraduate Study Guide & Reference — Cannoga College',
    description: 'Guidance on academic advisor matching, thesis requirements, and credit systems for Master\'s students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/master/',
    },
};

export default function MastersGuidePage() {
    const sections = [
        { id: 'intro', title: 'Welcome', content: '' },
        { id: 'accept', title: 'Accept Admission', content: '' },
        { id: 'documents', title: 'Submit Documents', content: '' },
        { id: 'tuition', title: 'Tuition & Scholarships', content: '' },
        { id: 'residence', title: 'Residence Permit', content: '' },
        { id: 'enrolment', title: 'Enrolment', content: '' },
        { id: 'housing', title: 'Housing', content: '' },
        { id: 'arrival', title: 'Arrival & Orientation', content: '' },
    ];

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white text-black font-sans pb-20">
                {/* HERO SECTION */}
                <Hero
                    title="Master’s Students Guide"
                    body="Essential steps and instructions for newly admitted Master’s students at Cannoga College. Follow this guide to ensure a smooth start to your studies."
                    backgroundColor="#dc6ade"
                    tinted
                    lightText={true}
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Student Guide', href: '/student-guide' },
                        { label: "Master's Guide" }
                    ]}
                    image={{
                        src: "/images/student-guide-hero.png",
                        alt: "Master Students"
                    }}
                />

                <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
                    <div className="space-y-20">
                        {/* Intro */}
                        <section id="intro" className="scroll-mt-32">
                            <ContentBox
                                icon="info"
                                title="Congratulations on Your Admission!"
                                body={
                                    <div className="space-y-6 text-left">
                                        <p className="text-aalto-3 text-black font-medium leading-relaxed">
                                            Once your admission is confirmed, your school’s Learning Services team will be your main point of contact.
                                        </p>
                                        <div className="flex flex-wrap gap-6">
                                            <Link href="/student-guide/international" className="text-xs font-bold underline hover:text-black uppercase tracking-widest">
                                                International Info →
                                            </Link>
                                            <Link href="/student-guide/arrival" className="text-xs font-bold underline hover:text-black uppercase tracking-widest">
                                                Arrival Guide →
                                            </Link>
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        {/* 1. Accept Admission */}
                        <section id="accept" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">1. Accept Your Admission Offer</h2>
                            <ContentBox
                                size="large"
                                icon="calendar"
                                title="Deadline: 5 June 2026"
                                body={
                                    <div className="space-y-8 text-left">
                                        <p className="text-3xl font-bold text-black">15:00 (UTC +3)</p>
                                        <p className="text-sm font-bold text-neutral-600 leading-relaxed">
                                            Log in to the online study application service and follow instructions. Your acceptance is binding.
                                        </p>
                                        <div className="bg-neutral-100 p-6 rounded-xl border-l-4 border-[#9c27b3]">
                                            <h4 className="font-bold text-lg mb-2">Important Conditions</h4>
                                            <ul className="text-sm font-bold space-y-2">
                                                <li>• You can accept only one study place in Ottawa, Ontario, Canada per term.</li>
                                                <li>• Binding acceptance: strictly no cancellations after acceptance.</li>
                                            </ul>
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        {/* 2. Documents */}
                        <section id="documents" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">2. Submit Certified Documents</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card
                                    title="Submission Deadline (Early)"
                                    body="For decisions published early in the cycle, submit certified copies by the deadline specified in your offer."
                                />
                                <Card
                                    title="Submission Deadline (Rolling)"
                                    body="Submit certified copies within 14 days of your admission decision."
                                />
                            </div>
                        </section>

                        {/* 3. Tuition */}
                        <section id="tuition" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">3. Tuition & Scholarships</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card
                                    title="Tuition Fees"
                                    body="Tuition fees apply to international students. Check scholarship opportunities for fee support. Recommended: complete payment before your intake start date."
                                />
                                <Card
                                    title="Excellence Scholarship"
                                    body="You must accept scholarship terms before they become valid. Don't forfeit your award."
                                    badge={{ label: "Action Required" }}
                                />
                            </div>
                        </section>

                        {/* 4. Residence Permit */}
                        <section id="residence" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">4. Residence Permit</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card title="International Students" body="Apply for a Canadian study permit for studies immediately. Schedule your IRCC appointment early." />
                                <Card title="Canada Citizens" body="No study permit required. Complete enrolment online and ensure your provincial health coverage (OHIP) is active." />
                            </div>
                        </section>

                        {/* 6. Enrolment */}
                        <section id="enrolment" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">5. Enrol for the Academic Year</h2>
                            <ContentBox
                                icon="identificationBadge"
                                title="Enrolment Opens 18 May"
                                body={
                                    <div className="space-y-6 text-left">
                                        <p className="text-sm font-bold text-neutral-700 leading-relaxed">Apply for your chosen intake. September intake: October–February. January intake: June–September.</p>
                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="font-bold text-black mb-1">Attending</h4>
                                                <p className="text-xs text-neutral-500 font-bold">Starting studies immediately with full rights.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-black mb-1">Non-attending</h4>
                                                <p className="text-xs text-neutral-500 font-bold">Deferring for military or parental reasons.</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        {/* 7. Housing */}
                        <section id="housing" className="scroll-mt-32">
                            <h2 className="text-aalto-5 font-bold mb-10 text-black tracking-tight">6. Apply for Student Housing</h2>
                            <Card
                                title="Start Your Application"
                                 body="Apply as soon as you accept your study place. Queue times are long. Cannoga assists with the application process for student housing."
                                cta={{ label: "Housing Guide", linkComponentProps: { href: "/student-guide/housing-for-students" } }}
                            />
                        </section>

                        {/* 8. Arrival */}
                        <section id="arrival" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="graduationCap"
                                title="Arrival & Orientation"
                                body={
                                    <div className="space-y-8 text-left">
                                        <p className="text-aalto-2 text-black font-medium leading-relaxed">
                                            Courses begin in late August. Plan to arrive before orientation activities start.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <Card
                                                title="IT Account"
                                                body="Activate your account after enrolment for access to Email, Moodle, and Registration."
                                            />
                                            <Card
                                                title="Student Benefits"
                                                body="Access student card, healthcare (FSHS), and transport discounts."
                                            />
                                        </div>
                                    </div>
                                }
                            />
                        </section>

                        <div className="mt-12 pt-8 border-t border-neutral-200 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                            <p>Content adapted from official admissions and student guidance information.</p>
                        </div>
                    </div>
                </div>
            </div>
        </GuideSidebarLayout>
    );
}

