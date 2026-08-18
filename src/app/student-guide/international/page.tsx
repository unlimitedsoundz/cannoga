import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { StepBadge } from '@/components/ui/StepBadge';
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Hero } from '@/components/layout/Hero';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { SchemaLD } from '@/components/seo/SchemaLD';
import { Highlight } from '@/components/ui/Highlight';
import { StudentResourceHubCarousel } from '@/components/home/StudentResourceHubCarousel';

const tocSections = [
    { id: 'intro', title: 'Purpose of Guide', content: '' },
    { id: 'why-ottawa', title: 'Why Ottawa, Ontario, Canada', content: '' },
    { id: 'admission', title: 'After Admission', content: '' },
    { id: 'arrival', title: 'After Arrival', content: '' },
    { id: 'living', title: 'Living in Ottawa', content: '' },
    { id: 'support', title: 'Support Services', content: '' },
    { id: 'after-graduation', title: 'After Graduation', content: '' },
];

export const metadata = {
    title: 'Global Students Checklist & Resource Guide',
    description: 'Access pre-arrival checklists, registration guides, residency advice, and campus services tailored for international students.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/international/',
    },
};

export default function InternationalGuidePage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the tuition deposit amount?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The confirmation tuition deposit is $2,000 CAD across all programs. This non-refundable deposit secures your seat, enables issuance of your Provincial Attestation Letter (PAL) where required, and is credited 100% directly towards your first-term tuition balance."
                }
            },
            {
                "@type": "Question",
                "name": "Is orientation mandatory?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, orientation is mandatory and provides essential info for starting your studies. All students are expected to attend sessions during the first week."
                }
            },
            {
                "@type": "Question",
                "name": "Can I bring my family to Canada?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, eligible family members may apply for a study permit based on family ties. You must demonstrate sufficient financial resources for your family's stay and have suitable housing."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-12">
            <SchemaLD data={faqSchema} />

            <Hero
                title="International Students"
                body="Practical guidance for your journey to Ottawa, Ontario, Canada and Cannoga College."
                backgroundColor="#000000"
                tinted
                lightText={true}
                image={{
                    src: "/images/international-students-hero.png",
                    alt: "International students at Cannoga College Ottawa"
                }}
            />

            <GuideSidebarLayout 
                sections={tocSections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'International Students' }
                ]}
            >
                <div className="cc-container py-8 md:py-12 text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-10 md:space-y-14">

                        {/* Purpose */}
                        <section id="intro" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Purpose of This Guide</h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-3xl font-normal">
                                This section provides international degree and exchange students with practical guidance on what to do after admission and after arrival in Ottawa, Ontario, Canada. It covers study permits, housing, transportation, health coverage, and settling into your new community.
                            </p>
                        </section>

                        {/* Why Ottawa */}
                        <section id="why-ottawa" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Why Study in Ottawa, Ontario, Canada?</h2>
                            <div className="grid lg:grid-cols-2 gap-6 items-center">
                                <div className="space-y-3">
                                    <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">
                                        Ottawa is Canada&apos;s capital — a bilingual, safe, and cosmopolitan city that consistently ranks among the best places in the world to live and study. With a thriving tech sector, world-class research institutions, and a welcoming multicultural community, Ottawa offers international students an unparalleled experience.
                                    </p>
                                    <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">
                                        The Canadian education system is internationally recognized for its high quality, student-centered approach, and strong focus on research and innovation.
                                    </p>
                                    <div className="pt-1">
                                        <p className="font-semibold text-black text-base md:text-lg leading-relaxed">
                                            Cannoga College operates in the heart of Ottawa with strong ties to Canada&apos;s public service, tech industry, and research community.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 pt-1">
                                        <Link href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Study in Canada →</Link>
                                        <Link href="https://www.ottawatourism.ca" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Visit Ottawa →</Link>
                                        <Link href="https://www.investottawa.ca" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Invest Ottawa →</Link>
                                    </div>
                                </div>
                                <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <Image
                                        src="https://i.pinimg.com/736x/c8/72/86/c8728659d34059076a2ed84d690fd379.jpg"
                                        alt="Why Study in Ottawa, Ontario, Canada"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </section>

                        <Highlight
                            body="The mix of innovation, nature, and culture in Ottawa is something special. I felt welcome from day one — the city and college community really made this an amazing experience."
                            source="Marco Rossi, International Student"
                            alignment="right"
                        />

                        {/* After Admission */}
                        <section id="admission" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Practical Things to Do After Admission</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Study Permit</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-2">Apply for your Canadian study permit through Immigration, Refugees and Citizenship Canada (IRCC) as soon as you receive your acceptance letter. Processing times vary but typically take 1-3 months.</p>
                                    <Link href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Apply via IRCC →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Housing</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-2">Arrange accommodation before arrival. Ottawa student housing providers and private rentals should be booked early, especially for August/September intake.</p>
                                    <Link href="/student-guide/housing-for-students" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Housing Guide →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Health Insurance</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-2">All residents in Canada are entitled to public healthcare through provincial health insurance (OHIP in Ontario). International students may need private insurance for the first 3 months until eligible for provincial coverage. Cannoga partners with local clinics for walk-in care.</p>
                                    <Link href="https://www.ontario.ca/page/apply-ohip-health-card" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">OHIP Info →</Link>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Tuition &amp; Scholarships</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-2">International tuition fees apply. Check our merit scholarship opportunities — awards of up to 50% tuition waiver are available.</p>
                                    <Link href="/admissions/tuition" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Tuition Info →</Link>
                                </div>
                            </div>
                        </section>

                        {/* After Arrival */}
                        <section id="arrival" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">After Moving to Ottawa</h2>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg md:text-xl text-black">Getting Around</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                                        Ottawa&apos;s public transport is operated by <strong>OC Transpo</strong>, offering bus, light rail, and paratransit services. Students qualify for discounted fares with a valid student card.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="https://www.octranspo.com" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">OC Transpo →</Link>
                                        <Link href="https://www.octranspo.com/en/fares/student-fares" target="_blank" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Student Tickets →</Link>
                                    </div>
                                    <h3 className="font-bold text-lg md:text-xl text-black pt-2">Registering with Authorities</h3>
                                    <div className="space-y-2 text-base md:text-lg font-normal text-slate-700">
                                        <p className="flex gap-2.5 items-start"><span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" /> All international students must register their address with ServiceOntario after arrival.</p>
                                        <p className="flex gap-2.5 items-start"><span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" /> Canadian citizens and permanent residents must carry valid identification; international students apply for a study permit through IRCC.</p>
                                        <p className="flex gap-2.5 items-start"><span className="w-2 h-2 bg-[#0a151a] rounded-full mt-2.5 shrink-0" /> Open a Canadian bank account early — RBC, TD, Scotiabank, and others offer student accounts with low fees.</p>
                                    </div>
                                    <div className="pt-1">
                                        <Link href="/student-guide/arrival" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a] inline-flex items-center gap-1">
                                            Full Arrival Guide <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg md:text-xl text-black">Post-Arrival Checklist</h3>
                                    <ul className="space-y-2.5 text-base md:text-lg">
                                        {[
                                            "Collect keys and move into your accommodation",
                                            "Register at college and activate your Cannoga student card",
                                            "Register your address with ServiceOntario",
                                            "Apply for a study permit through IRCC (if applicable)",
                                            "Get your PRESTO card for public transit discounts",
                                            "Open a Canadian bank account",
                                            "Attend mandatory orientation week",
                                            "Join the Cannoga student community platform",
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-2.5 items-start font-normal text-slate-700">
                                                <StepBadge step={i + 1} size="w-6 h-6" fontSize="text-xs" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Living in Ottawa */}
                        <section id="living" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Living in Ottawa</h2>
                            <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                                <Image
                                    src="https://i.pinimg.com/1200x/b9/46/2f/b9462f65ccdfe4c2c4019ab1ea290e1f.jpg"
                                    alt="Students enjoying life in Ottawa, Ontario, Canada"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 1200px"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Student Health Care</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Once registered as a resident with an Ontario health card, you can access public healthcare through OHIP. In the interim, ensure you have private coverage. Cannoga partners with local clinics for walk-in care.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Local Culture</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Ottawa is bilingual (English &amp; French), diverse, and welcoming. It&apos;s one of the world's safest cities with a vibrant arts scene, national museums, and four distinct seasons.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Working While Studying</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Your Canadian study permit allows you to work up to 30 hours/week during term time (full-time during holidays). Many local employers actively recruit Cannoga students.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Language &amp; Careers</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal mb-2">Cannoga&apos;s Career Centre offers job boards, resume workshops, internships, and networking events with Ottawa&apos;s tech, government, and business sectors.</p>
                                    <Link href="/careers" className="font-bold underline text-sm uppercase tracking-widest text-[#0a151a]">Career Centre →</Link>
                                </div>
                            </div>
                        </section>

                        {/* Support Services */}
                        <section id="support" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">Support Services</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Peer Advice</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Connect with current international students for practical tips on student life, housing, and finding your feet in Ottawa.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">International Student Office</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Guidance on study permits, enrollment, academic procedures, and immigration compliance throughout your studies.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg md:text-xl mb-1 text-black">Career &amp; Settlement</h3>
                                    <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">Dedicated career support to help you plan your professional future and integrate into Ottawa&apos;s vibrant job market.</p>
                                </div>
                            </div>
                        </section>

                        {/* After Graduation */}
                        <section id="after-graduation" className="scroll-mt-32 space-y-4">
                            <h2 className="text-aalto-5 font-bold text-black tracking-tight">After Graduation</h2>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl font-normal">
                                After graduating as an international student in Cannoga College Ontario, you can apply for a Post-Graduation Work Permit (PGWP) to live, find a job, and gain valuable work experience in Canada.
                            </p>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <StepBadge step={1} size="w-9 h-9" />
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-lg md:text-xl font-bold text-black">Apply for a Post-Graduation Work Permit (PGWP)</h3>
                                        <div className="space-y-2 text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                                            <p><strong>What it is:</strong> An open work permit that allows you to work for almost any employer in Canada.</p>
                                            <p><strong>Duration:</strong> Valid for 8 months up to 3 years, depending on the length of your study program. Programs of 2 years or longer generally qualify for a 3-year work permit.</p>
                                            <p><strong>Deadline:</strong> You must apply within 180 days of receiving your final transcript and an official letter from your school confirming you completed your program.</p>
                                            <p><strong>Working while waiting:</strong> If you apply before your study permit expires, you can work full-time while waiting for a decision on your PGWP.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <StepBadge step={2} size="w-9 h-9" />
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-lg md:text-xl font-bold text-black">Gain Canadian Work Experience</h3>
                                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                                            Working on a PGWP allows you to build a professional network and earn Canadian work experience. This work experience is essential if you want to apply to stay in Canada permanently.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <StepBadge step={3} size="w-9 h-9" />
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-lg md:text-xl font-bold text-black">Transition to Permanent Residency (PR)</h3>
                                        <div className="space-y-2 text-base md:text-lg text-slate-700 leading-relaxed font-normal">
                                            <div>
                                                <p className="font-bold text-black">Express Entry (Canadian Experience Class):</p>
                                                <p>After completing at least 1 year of skilled work experience in Canada, you can apply through the Express Entry System. Your Canadian education and work history give you higher ranking points.</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">Provincial Nominee Program (OINP):</p>
                                                <p>Ontario has specific streams under the Ontario Immigrant Nominee Program for international students with a job offer or a master&apos;s/PhD degree.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Student Resource Hub */}
                        <section id="resource-hub" className="scroll-mt-32 pt-8 border-t border-neutral-200 space-y-4">
                            <div className="mb-4">
                                <h2 className="text-aalto-5 font-bold mb-1 text-black tracking-tight">Student Resource Hub</h2>
                                <p className="text-base md:text-lg text-slate-700 font-normal">Access additional campus services, health support, careers, and student policies.</p>
                            </div>
                            <StudentResourceHubCarousel />
                        </section>

                        <div className="pt-4 border-t border-neutral-100 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                            <p>Updated: June 2026 | Cannoga College International Student Services</p>
                        </div>
                    </div>
                </div>
            </GuideSidebarLayout>
        </div>
    );
}
