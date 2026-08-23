import type { Metadata } from 'next';
import { Hero } from '@/components/layout/Hero';
import { Link } from '@/components/ui/Link';
import AcademicRegulationsAccordion from '@/components/academic/AcademicRegulationsAccordion';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
    title: 'Official Student Handbook & Regulations',
    description: 'Read the official student handbook detailing code of ethics, grade appeal procedures, housing policies, and campus rules.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-handbook/',
    },
};

const handbookSections = [
    {
        id: "hb-1",
        question: "1. Welcome & Institutional Mission",
        order_index: 1,
        answer: (
            <div className="space-y-3">
                <p>Welcome to Cannoga College in Ottawa, Ontario, Canada. This Student Handbook serves as the definitive reference guide to academic life, administrative procedures, campus resources, and student entitlements.</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Institutional Mission:</strong> Empowering forward-thinking scholars through career-focused degrees, multidisciplinary applied research, and inclusive community support.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Ontario Standards:</strong> All programs and learning pathways adhere to Ontario post-secondary quality benchmarks and ministry regulations.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-2",
        question: "2. Student Enrolment, Identity & Registration",
        order_index: 2,
        answer: (
            <div className="space-y-3">
                <p>Registry rules governing your active student status and official identification:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Cannoga Student ID Card:</strong> Issued upon completion of enrolment verification. Must be carried at all times for campus access, library loans, laboratory sessions, and examinations.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Course Enrolment Windows:</strong> Registration for Fall, Winter, and Summer terms is conducted online via the Student Portal during designated enrolment periods.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Contact Details Updates:</strong> Students are legally required to maintain current mailing addresses and emergency contact numbers in the digital portal.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-3",
        question: "3. Academic Support, Tutoring & Advising",
        order_index: 3,
        answer: (
            <div className="space-y-3">
                <p>Cannoga College provides comprehensive academic enhancement services:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Academic Advising</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Dedicated program advisors guide module selection, prerequisite planning, minor concentrations, and graduation checks.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Learning &amp; Writing Centre</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Free peer tutoring, academic writing consultations, research citation workshops, and English language support.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Library &amp; Research Help</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Liaison librarians assist with digital database queries, peer-reviewed journal access, and interlibrary loans.</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-sm">
                        <h4 className="font-bold text-slate-900 text-base">Math &amp; Code Labs</h4>
                        <p className="text-sm text-slate-600 font-normal mt-1">Drop-in technical coaching for data science, software development, engineering calculations, and stats.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "hb-4",
        question: "4. Student Health, Wellness & Accessibility Services",
        order_index: 4,
        answer: (
            <div className="space-y-3">
                <p>Holistic health, psychological wellness, and accommodation infrastructure:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Health &amp; Counselling Centre:</strong> Confidential mental health counselling, stress management workshops, crisis intervention, and wellness coaching.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Student Accessibility Centre:</strong> Academic accommodations for students with documented physical disabilities, neurodiverse learning profiles, or chronic health conditions.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Health Insurance (UHIP / Guard.me):</strong> Mandatory coverage for international students covering physician visits, hospital care, and emergency diagnostics.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-5",
        question: "5. Campus Housing, Dining & Residence Standards",
        order_index: 5,
        answer: (
            <div className="space-y-3">
                <p>Residence living standards, meal plans, and community housing rules:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Residence Agreements:</strong> All residents must abide by quiet hours (11:00 PM – 7:00 AM weekdays), guest registration protocols, and fire safety codes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Dining &amp; Nutrition:</strong> On-campus cafeterias provide dietary-conscious meal options (Halal, Kosher, Vegan, Gluten-Free) linked to student ID smart cards.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Off-Campus Housing Advisory:</strong> Legal assistance with Ontario standard residential leases, tenant rights, and transit-connected housing search.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-6",
        question: "6. Career Development, Internships & Co-Op Services",
        order_index: 6,
        answer: (
            <div className="space-y-3">
                <p>Equipping students with industry connections and employment readiness:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Career Centre Appointments:</strong> Resume evaluations, LinkedIn optimization, mock interviews, and personalized career coaching.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Co-op Work Placements:</strong> Eligible students complete structured 4-month paid industry placements with top Canadian technology firms, research labs, and government agencies.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>On-Campus Employment:</strong> Work-study positions available across IT services, library desks, admissions, and departmental research assistance.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-7",
        question: "7. Information Technology, LMS & Digital Systems",
        order_index: 7,
        answer: (
            <div className="space-y-3">
                <p>Digital ecosystem guidelines, cloud accounts, and cybersecurity policies:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Student Accounts:</strong> Every student receives an official @cannogacollege.ca email, Microsoft 365 license, cloud storage, and campus Wi-Fi access.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Learning Management System (LMS):</strong> Course syllabi, lecture slides, graded assignment submissions, and instructor announcements are hosted on the LMS.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Acceptable IT Use:</strong> Tampering with campus network security, torrenting copyrighted materials, or sharing passwords is strictly prohibited.</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: "hb-8",
        question: "8. Campus Security, Safety & Emergency Procedures",
        order_index: 8,
        answer: (
            <div className="space-y-3">
                <p>Ensuring a secure and prepared environment for all students and staff:</p>
                <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>24/7 Campus Security:</strong> Uniformed security officers patrol all buildings, monitoring surveillance systems and emergency call boxes.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>SafeWalk Service:</strong> Security escorts available on-demand 24 hours a day to accompany students anywhere on campus or to adjacent transit stops.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2 shrink-0" />
                        <span><strong>Emergency Notifications:</strong> Urgent weather closures and security alerts are broadcast instantaneously via SMS, email, and campus sirens.</span>
                    </li>
                </ul>
            </div>
        )
    }
];

export default function StudentHandbookPage() {
    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            {/* HERO SECTION */}
            <Hero
                title="Student Handbook"
                body="The comprehensive official guide to academic life, student services, campus living standards, health & wellness, and institutional regulations at Cannoga College."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Handbook' }
                ]}
                image={{
                    src: "/images/alumni-hero.png",
                    alt: "Cannoga Student Handbook"
                }}
            />

            {/* MAIN CONTENT ACCORDION */}
            <main className="container mx-auto max-w-5xl px-4 py-16 space-y-16 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight">Academic Life &amp; Campus Resources</h2>
                    <p className="text-slate-700 text-base md:text-lg font-normal leading-relaxed max-w-3xl">
                        Explore core campus services, health and accessibility accommodations, residence guidelines, career support, and safety procedures.
                    </p>
                </section>

                <section className="pt-4">
                    <AcademicRegulationsAccordion items={handbookSections} />
                </section>

                {/* RELATED LINKS */}
                <section className="pt-8 border-t border-slate-200 space-y-6">
                    <h3 className="text-2xl font-black text-black tracking-tight">Related Student Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link 
                            href="/code-of-conduct/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Code of Conduct</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Community standards and ethics</p>
                        </Link>
                        <Link 
                            href="/academic-regulations/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Academic Regulations</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Grading, credits, and progression</p>
                        </Link>
                        <Link 
                            href="/student-guide/" 
                            className="p-5 border border-slate-200 hover:border-black transition-colors block text-[#0a151a] font-bold text-base no-underline rounded-sm space-y-1"
                        >
                            <div className="flex items-center justify-between">
                                <span>Student Guide</span>
                                <ArrowRight size={16} weight="bold" />
                            </div>
                            <p className="text-sm text-slate-600 font-normal leading-normal">Arrival, housing, and life in Ottawa</p>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
