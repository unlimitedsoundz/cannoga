import { Metadata } from 'next';
import Link from 'next/link';
import { 
    ArrowSquareOut
} from '@phosphor-icons/react/dist/ssr';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { HealthServicesCarousel } from '@/components/student-guide/HealthServicesCarousel';
import { UhipQuickLinksCarousel } from '@/components/student-guide/UhipQuickLinksCarousel';
import { Highlight } from '@/components/ui/Highlight';
import FAQ, { type FAQItem } from '@/components/FAQ';

export const metadata: Metadata = {
    title: 'Student Health & Wellbeing | Medical, Counseling & Accessibility',
    description: 'Comprehensive health services, confidential mental health counseling, UHIP health insurance support, and accessibility accommodations at Cannoga College Ottawa.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/health-and-wellbeing/',
    },
};

const sections = [
    { id: 'overview', title: 'Health Overview', content: '' },
    { id: 'medical-services', title: 'Medical Clinic & Nursing', content: '' },
    { id: 'mental-health', title: 'Mental Health & Counseling', content: '' },
    { id: 'health-insurance', title: 'Health Insurance (UHIP)', content: '' },
    { id: 'accessibility', title: 'Accessibility Services', content: '' },
    { id: 'emergency', title: '24/7 Crisis & Emergency', content: '' },
    { id: 'faq', title: 'Health & Wellness FAQs', content: '' },
];

const HEALTH_FAQS: FAQItem[] = [
    {
        id: 'faq-1',
        question: 'Are mental health counseling sessions really free?',
        answer: '<p>Yes. All enrolled Cannoga College students can access individual personal counseling sessions at zero extra charge. Sessions are completely confidential and not recorded on academic transcripts.</p>',
        order_index: 1
    },
    {
        id: 'faq-2',
        question: 'How do I access my UHIP insurance card?',
        answer: '<p>International students receive an email from Cowan/UHIP with a registration link upon completing course enrollment. You can also download your e-card anytime directly from your <a href="/portal/" class="font-bold underline text-slate-900">Student Portal</a>.</p>',
        order_index: 2
    },
    {
        id: 'faq-3',
        question: 'What if I get sick and miss an exam or class?',
        answer: '<p>Visit the on-campus health clinic or a certified Ottawa walk-in clinic to obtain a Student Medical Certificate, then submit an absence notification via the student portal within 48 hours.</p>',
        order_index: 3
    }
];

export default function HealthAndWellbeingPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Hero Section */}
            <Hero
                title="Student Health & Wellbeing"
                body="Your health, mental wellness, and accessibility support are fundamental to your success. Access confidential on-campus medical care, professional counseling, and comprehensive health insurance guidance."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/health-and-wellbeing-hero.jpg",
                    alt: "Student Health and Wellbeing at Cannoga College Ottawa"
                }}
            />

            <GuideSidebarLayout
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Health & Wellbeing' }
                ]}
            >
                <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl space-y-12">

                    {/* OVERVIEW */}
                    <section id="overview" className="scroll-mt-32 space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0a151a]">
                                Wellness, Medical &amp; Support Services
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                Cannoga College provides inclusive, culturally sensitive health and wellness services for all registered students. Whether you require routine medical care, confidential mental health counseling, specialized academic accommodations, or help navigating Canadian health insurance, our dedicated wellness teams are here for you.
                            </p>
                        </div>

                        {/* Interactive Health Services Carousel */}
                        <div className="pt-2">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Core Health &amp; Wellness Services</h3>
                            <HealthServicesCarousel />
                        </div>
                    </section>

                    {/* MEDICAL SERVICES & CLINIC */}
                    <section id="medical-services" className="scroll-mt-32 space-y-6 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0a151a]">
                                On-Campus Health Clinic &amp; Nursing Care
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                Our campus health clinic provides primary care services, walk-in nursing triage, health assessments, preventative care, and specialized medical referrals.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-2">
                            <div className="space-y-3">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900">Clinical &amp; Nursing Services</h3>
                                <ul className="space-y-2 text-base text-slate-700 list-disc list-outside pl-5">
                                    <li>Assessment and treatment of minor illnesses, cuts, and acute injuries</li>
                                    <li>Routine immunizations, flu vaccines, and TB testing compliance</li>
                                    <li>Sexual health counseling, STI testing, and birth control advising</li>
                                    <li>Prescription coordination and referrals to Ottawa specialized doctors</li>
                                    <li>Blood pressure checks and preventative wellness consultations</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900">Clinic Hours &amp; Location</h3>
                                <div className="space-y-2 text-base text-slate-700">
                                    <p><strong>Location:</strong> 81 Montreal Rd, Student Wellness Center (Room W-102), Ottawa, ON</p>
                                    <p><strong>Hours:</strong> Monday – Friday: 8:30 AM – 4:30 PM (Closed on statutory holidays)</p>
                                    <p><strong>Appointment:</strong> Walk-ins welcome for urgent triage; booked appointments recommended via the <Link href="/portal/" className="font-bold underline text-slate-900">Student Portal</Link>.</p>
                                    <p><strong>Contact:</strong> <a href="mailto:healthservices@cannogacollege.ca" className="underline font-bold text-slate-900">healthservices@cannogacollege.ca</a></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FEATURED STUDENT QUOTE */}
                    <Highlight
                        body="Taking care of my mental health while balancing a heavy course load was tough at first, but the counselors at Cannoga's wellness center gave me practical tools and unconditional support whenever I needed it."
                        source="Sarah Tremblay, Health Informatics Graduate"
                    />

                    {/* MENTAL HEALTH & COUNSELING */}
                    <section id="mental-health" className="scroll-mt-32 space-y-6 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0a151a]">
                                Mental Health &amp; Psychological Counseling
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                We believe mental wellness is just as vital as academic performance. Cannoga College offers free, 100% confidential personal counseling with registered psychotherapists and social workers.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                                <h4 className="font-bold text-base md:text-lg text-slate-900">1-on-1 Personal Counseling</h4>
                                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Confidential individual sessions to navigate anxiety, depression, academic stress, relationships, homesickness, or grief.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-base md:text-lg text-slate-900">Peer Wellness Network</h4>
                                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Student-led wellness champions offering study-break coffee chats, mindfulness workshops, and peer connection groups.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-base md:text-lg text-slate-900">Stress &amp; Exam Resilience</h4>
                                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Practical strategy workshops covering time management, sleep hygiene, meditation, and healthy study habits.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* HEALTH INSURANCE (UHIP) */}
                    <section id="health-insurance" className="scroll-mt-32 space-y-6 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0a151a]">
                                University Health Insurance Plan (UHIP)
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                Mandatory medical protection for all international students in Ontario. Every international and domestic student at Cannoga College is backed by comprehensive medical insurance to ensure full access to healthcare services across Ottawa and Ontario without out-of-pocket stress.
                            </p>
                        </div>

                        <div className="pt-2">
                            <UhipQuickLinksCarousel />
                        </div>
                    </section>

                    {/* ACCESSIBILITY & ACCOMMODATIONS */}
                    <section id="accessibility" className="scroll-mt-32 space-y-6 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0a151a]">
                                Accessibility &amp; Academic Accommodations
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                Cannoga College is committed to creating an equitable learning environment under the <em>Accessibility for Ontarians with Disabilities Act (AODA)</em>. Our Accessibility Consultants work confidentially with students experiencing temporary or permanent disabilities.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-2">
                            <div className="space-y-3">
                                <h3 className="font-bold text-lg md:text-xl text-slate-900">Types of Supported Accommodations</h3>
                                <ul className="space-y-2 text-base text-slate-700 list-disc list-outside pl-5">
                                    <li><strong>Exam Accommodations:</strong> Extra time, quiet testing rooms, and assistive software.</li>
                                    <li><strong>Classroom Adjustments:</strong> Peer note-takers, audio recording permissions, and accessible seating.</li>
                                    <li><strong>Assistive Tech:</strong> Screen readers, speech-to-text tools, and ergonomic equipment.</li>
                                    <li><strong>Temporary Accommodations:</strong> Support for concussions, surgery recovery, or mobility limitations.</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-lg md:text-xl text-slate-900">How to Register for Accommodations</h3>
                                <div className="space-y-2 text-base text-slate-700">
                                    <p>1. Complete the confidential Accessibility Intake Form in the <Link href="/portal/" className="font-bold underline text-slate-900">Student Portal</Link>.</p>
                                    <p>2. Provide supporting medical or psycho-educational documentation from a qualified healthcare practitioner.</p>
                                    <p>3. Attend a collaborative intake appointment with an Accessibility Advisor to build your individualized accommodation plan.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 24/7 EMERGENCY & CRISIS CONTACTS */}
                    <section id="emergency" className="scroll-mt-32 space-y-6 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#0a151a]">
                                24/7 Emergency &amp; Crisis Helplines
                            </h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mt-2">
                                If you or someone you know is in immediate danger, experiencing a mental health emergency, or requires urgent medical care, access these 24/7 free resources immediately.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                            <div className="space-y-1">
                                <div className="text-red-700 font-black text-2xl">911</div>
                                <h4 className="font-bold text-base text-slate-900">Emergency Services</h4>
                                <p className="text-xs sm:text-sm text-slate-600">Police, Ambulance, and Fire in Canada. Call immediately for life-threatening emergencies.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-blue-700 font-black text-xl">1-866-925-5454</div>
                                <h4 className="font-bold text-base text-slate-900">Good2Talk Helpline</h4>
                                <p className="text-xs sm:text-sm text-slate-600">Free, confidential 24/7 post-secondary student helpline. Or text <strong>GOOD2TALKON to 686868</strong>.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-emerald-700 font-black text-xl">613-238-3311</div>
                                <h4 className="font-bold text-base text-slate-900">Distress Centre of Ottawa</h4>
                                <p className="text-xs sm:text-sm text-slate-600">24/7 confidential mental health and distress response for the National Capital Region.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="text-amber-700 font-black text-xl">811</div>
                                <h4 className="font-bold text-base text-slate-900">Health Connect Ontario</h4>
                                <p className="text-xs sm:text-sm text-slate-600">24/7 free access to registered nurse medical advice and health guidance.</p>
                            </div>
                        </div>
                    </section>

                    {/* FREQUENTLY ASKED QUESTIONS */}
                    <section id="faq" className="scroll-mt-32 space-y-4 pt-4 border-t border-slate-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-[#0a151a]">
                                Health &amp; Wellbeing FAQs
                            </h2>
                        </div>

                        <FAQ faqs={HEALTH_FAQS} />
                    </section>

                </div>
            </GuideSidebarLayout>
        </div>
    );
}
