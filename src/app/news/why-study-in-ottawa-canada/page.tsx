import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import Image from 'next/image';
import { CaretLeft, GraduationCap, Globe, ShieldCheck, Lightbulb, Leaf, Briefcase, Buildings, Heart, MapTrifold, Certificate } from "@phosphor-icons/react/dist/ssr";
import { Info } from '@/components/ui/Info';
import { Highlight } from '@/components/ui/Highlight';
import { Hero } from '@/components/layout/Hero';

export const metadata = {
    title: 'Choosing Ottawa: Top 10 Reasons for International Students — Cannoga College',
    description: 'Explore why Ottawa, Ontario, Canada stands out as a top global study destination, highlighting its standard of living, tech industry, and high-quality education.',
    keywords: 'study in ottawa, why ottawa for international students, study in canada, canadian education, study abroad canada',
    alternates: {
        canonical: 'https://cannogacollege.ca/news/why-study-in-ottawa-canada/',
    },
};

const reasons = [
    {
        icon: GraduationCap,
        title: "World-Class Education System",
        content: "Canada is globally respected for its high-quality education model. Universities emphasise research, innovation, and practical learning rather than rote memorisation. The Canadian education system consistently ranks among the best in the world, producing graduates who are critical thinkers and problem solvers."
    },
    {
        icon: Certificate,
        title: "Globally Recognised Degrees",
        content: "Canadian degrees are internationally accredited and respected by employers worldwide. Whether you plan to work in Europe, Africa, Asia, or North America, your qualification holds strong value. Cannoga College degrees follow rigorous North American standards, ensuring seamless credit transfer and recognition."
    },
    {
        icon: Globe,
        title: "English-Speaking Environment",
        content: "You can immerse yourself in an English-speaking country. All academic programs and university services at Cannoga are delivered fully in English. Furthermore, Ottawa is a bilingual city (English and French), offering rich language immersion opportunities."
    },
    {
        icon: ShieldCheck,
        title: "Safe and Welcoming Environment",
        content: "Canada is consistently ranked as one of the safest and most welcoming countries in the world. Ottawa offers a calm, secure, and student-friendly environment where you can focus on your studies and personal growth without worry."
    },
    {
        icon: Lightbulb,
        title: "Innovation and Technology Hub",
        content: "Ottawa is known as 'Silicon Valley North' with a massive tech and startup sector. Students in business, IT, sustainability, and engineering benefit greatly from this ecosystem through internships, co-op placements, projects, and networking."
    },
    {
        icon: Leaf,
        title: "Strong Focus on Sustainability",
        content: "Canada has a strong dedication to environmental responsibility and sustainable development. Universities integrate sustainability into their curriculum and campus operations. At Cannoga College, sustainability is woven into every programme across all four schools."
    },
    {
        icon: Briefcase,
        title: "Work Opportunities for Students",
        content: "International students are allowed to work part-time during their studies in Canada. After graduation, eligible students can leverage the Post-Graduation Work Permit (PGWP) pathway to search for employment and build their careers."
    },
    {
        icon: Buildings,
        title: "Modern Learning Facilities",
        content: "Canadian universities provide advanced laboratories, digital libraries, collaborative spaces, and strong student support systems. Cannoga College's Ottawa campus features state-of-the-art facilities designed for hands-on, project-based learning."
    },
    {
        icon: Heart,
        title: "High Quality of Life",
        content: "Ottawa offers efficient public transit, clean air, modern housing, and access to nature. You can move from a lecture hall to a forest trail, the Rideau Canal, or Parliament Hill within minutes. Canada consistently ranks as one of the happiest countries in the world."
    },
    {
        icon: MapTrifold,
        title: "Gateway to North America",
        content: "Located in Ontario, Ottawa is just a few hours' drive from major cities like Toronto and Montreal, and is very close to the US border. Ottawa International Airport connects you to major cities across Canada, the US, and Europe."
    }
];

export default function WhyStudyInOttawaCanadaPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-black">
            {/* Hero */}
            <Hero
                title="Why Study in Ottawa Canada?"
                body="Discover why Ottawa has become one of North America's most attractive study destinations."
                image={{
                    src: "/images/news/helsinki-study-hero.png",
                    alt: "Aerial view of Ottawa, Ontario, Canada with university campus and parks"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'News', href: '/news' },
                    { label: 'Why Study in Ottawa Canada' }
                ]}
            />

            {/* Back nav */}
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <Link href="/news" className="text-neutral-500 hover:text-black font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 transition-colors">
                    <CaretLeft size={16} weight="bold" /> Back to News
                </Link>
            </div>

            {/* Article body */}
            <div className="container mx-auto px-4 pb-16 md:pb-24 max-w-4xl">
                
                <Info 
                    items={[
                        { title: "Published", body: "14.2.2026" },
                        { title: "Updated", body: "15.2.2026" },
                        { title: "Author", body: "Cannoga Admissions" },
                        {
                            tagGroup: {
                                tags: [
                                    { label: "News" },
                                    { label: "International" },
                                    { label: "Ottawa" }
                                ]
                            }
                        }
                    ]}
                />

                {/* Intro */}
                <div className="mb-12">
                    <p className="text-aalto-4 text-neutral-800 leading-aalto-3 font-medium">
                        Every year, thousands of international students choose Canada for their higher education. The combination of academic excellence, personal safety, career opportunities, and a high quality of life makes it a uniquely compelling destination.
                    </p>
                </div>

                <Highlight 
                    body="Canada's education system is built on equality and high quality. We don't just teach facts; we teach students how to think and innovate."
                    source="Dr. Elena Nieminen, Head of International Admissions"
                    alignment="right"
                />

                {/* Content Image */}
                <div className="mb-16">
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                            src="/images/news/helsinki-study-hero.png"
                            alt="International students at Cannoga College campus in Ottawa"
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-4">Cannoga College Campus | Ottawa</p>
                </div>

                {/* Reasons */}
                <div className="space-y-16">
                    {reasons.map((reason, index) => {
                        const Icon = reason.icon;
                        return (
                            <div key={index} className="flex gap-8 items-start">
                                {/* Number */}
                                <div className="flex-shrink-0 w-16 h-16 bg-[#0a151a] text-white flex items-center justify-center font-bold text-2xl">
                                    {index + 1}
                                </div>
                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-aalto-5 font-bold mb-4 text-[#000000] tracking-tight flex items-center gap-4">
                                        <Icon size={28} weight="bold" className="text-neutral-300" />
                                        {reason.title}
                                    </h2>
                                    <p className="text-aalto-3 text-neutral-600 font-medium leading-aalto-3">
                                        {reason.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="my-20 border-t border-neutral-100" />

                {/* CTA Section */}
                <div className="py-12">
                    <CTA
                        title="Ready to Start Your Journey?"
                        body="Cannoga College offers world-class English-taught programmes in Business, Technology, Science, and Arts & Architecture. Applications for Autumn 2026 are now open."
                        cta={{
                            label: "Apply Now",
                            linkComponentProps: {
                                href: "/admissions",
                            },
                        }}
                    />
                </div>

                {/* Related links */}
                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Student Life", href: "/student-life", desc: "Explore campus and housing." },
                        { title: "Tuition Fees", href: "/admissions/tuition", desc: "Scholarships and aids." },
                        { title: "Arrival Guide", href: "/student-guide/arrival", desc: "Settling in Ottawa." },
                    ].map(link => (
                        <Link key={link.href} href={link.href} className="bg-neutral-50 p-8 hover:bg-neutral-100 transition-all group border-l-2 border-transparent hover:border-[#0a151a]">
                            <h3 className="font-bold text-[#000000] mb-2 group-hover:underline">{link.title}</h3>
                            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

