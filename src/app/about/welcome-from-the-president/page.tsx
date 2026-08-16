import Image from 'next/image';
import { Quotes } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/layout/Hero";
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SchemaLD } from '@/components/seo/SchemaLD';
import GuideSidebarLayout from "@/components/layout/StudentGuideLayout";


export const metadata = {
    title: 'Welcome from the President | About',
    description: 'A personal welcome from the President of Cannoga College, sharing our vision, values, and commitment to student success in Ottawa, Ontario.',
    alternates: {
        canonical: 'https://cannogacollege.ca/about/welcome-from-the-president/',
    },
};

const sections = [
    {
        header: { label: 'About Cannoga College', linkComponentProps: { href: '/about' } },
        links: [
            { label: 'Our Story', linkComponentProps: { href: '/about' } },
            { label: 'Welcome from the President', linkComponentProps: { href: '/about/welcome-from-the-president' } },
            { label: 'Leadership & Governance', linkComponentProps: { href: '/about/leadership-and-governance' } },
            { label: 'News & Events', linkComponentProps: { href: '/news' } },
            { label: 'Research Hub', linkComponentProps: { href: '/research' } },
            { label: 'Careers', linkComponentProps: { href: '/careers' } },
            { label: 'Alumni', linkComponentProps: { href: '/alumni' } },
            { label: 'Contact Us', linkComponentProps: { href: '/contact' } },
        ]
    }
];

export default function WelcomeFromPresidentPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'About Cannoga College', item: '/about' },
                { name: 'Welcome from the President', item: '/about/welcome-from-the-president' }
            ]} />

            <SchemaLD data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Welcome from the President Cannoga College",
                "url": "https://cannogacollege.ca/about/welcome-from-the-president/",
                "isPartOf": { "@type": "WebSite", "url": "https://cannogacollege.ca" }
            }} />

            <Hero
                title="Welcome from the President"
                body="A message of commitment, vision, and welcome from the leadership of Cannoga College."
                backgroundColor="#0f2027"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Welcome from the President' }
                ]}
                image={{
                    src: "/images/home-carousel-3.png",
                    alt: "Cannoga College Ottawa Campus"
                }}
            />

            <GuideSidebarLayout sections={sections}>
                <div className="cc-container py-12 md:py-20">

                    {/* President Portrait + Quote */}
                    <section id="message" className="scroll-mt-32 mb-20">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">

                            {/* Portrait */}
                            <div className="relative">
                                <div className="relative w-full aspect-[3/4] max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-slate-200">
                                    <Image
                                        src="/images/president-luke-schaffner.jpg"
                                        alt="Dr. Luke Schaffner President of Cannoga College"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f2027]/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <p className="text-lg font-black tracking-tight leading-tight">Dr. Luke Schaffner</p>
                                        <p className="text-sm font-semibold text-white/80 uppercase tracking-widest mt-0.5">President</p>
                                        <p className="text-xs text-white/60 mt-1">Cannoga College, Ottawa</p>
                                    </div>
                                </div>

                                {/* Gold accent bar */}
                                <div className="hidden lg:block absolute -left-4 top-8 bottom-8 w-1.5 bg-[#c89211] rounded-full" />
                            </div>

                            {/* Welcome Letter */}
                            <div className="space-y-6">

                                <div className="relative">
                                    {/* Blue quote icon */}
                                    <Quotes
                                        size={56}
                                        weight="fill"
                                        className="text-blue-500 mb-3"
                                    />
                                    <div className="space-y-5 text-neutral-700 leading-relaxed text-base md:text-[17px] pl-2 border-l-4 border-blue-400">
                                        <p>
                                            On behalf of our faculty, staff, and the entire Cannoga College community, it is my honour and privilege to welcome you to our institution.
                                        </p>
                                        <p>
                                            Whether you are a prospective student exploring your options, a current student navigating your academic journey, or an industry partner considering collaboration I want you to know that you belong here. Cannoga College was built on the belief that career-focused, applied education has the power to change lives.
                                        </p>
                                        <p>
                                            Located in the heart of Ottawa, Ontario, we sit at the intersection of government, technology, health sciences, and culture industries that define Canada's present and future. Our programs are intentionally designed to connect the classroom with the real world, and our graduates consistently enter the workforce with confidence, competence, and character.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Continued letter */}
                    <section id="vision" className="scroll-mt-32 mb-20 max-w-4xl">
                        <div className="space-y-6 text-neutral-700 leading-relaxed text-base md:text-[17px]">
                            <h2 className="text-2xl md:text-3xl font-black text-[#0f2027] tracking-tight">Our Vision for the Future</h2>

                            <p>
                                As we look ahead, Cannoga College is committed to expanding access to quality education for students from all backgrounds domestic and international alike. We are investing in new research facilities, growing our industry partnerships, and continuing to enhance the student experience in every way we can.
                            </p>
                            <p>
                                We understand that choosing where to study is one of the most significant decisions you will make. I want to assure you that at Cannoga College, you will be challenged, supported, and inspired every step of the way. Our dedicated instructors bring both academic rigour and real-world experience to the classroom, and our student services teams are here to ensure your time with us is successful and fulfilling.
                            </p>
                            <p>
                                Our campus is a vibrant, diverse, and welcoming community representing over 60 countries and united by a shared commitment to learning and growth. I am incredibly proud of the culture we have built together, and I am excited about what lies ahead for our students, our institution, and our city.
                            </p>
                            <p>
                                Thank you for your interest in Cannoga College. I look forward to welcoming you personally as part of our community.
                            </p>
                        </div>

                        {/* Signature block */}
                        <div className="mt-12 pt-8 border-t border-neutral-200">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 ring-4 ring-[#c89211]/30">
                                    <Image
                                        src="/images/president-luke-schaffner.jpg"
                                        alt="Dr. Luke Schaffner President of Cannoga College"
                                        fill
                                        className="object-cover object-top"
                                        sizes="64px"
                                    />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-[#0f2027] tracking-tight">Dr. Luke Schaffner</p>
                                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">President</p>
                                    <p className="text-sm text-neutral-400 mt-0.5">Cannoga College · Ottawa, Ontario</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Values strip */}
                    <section id="values" className="scroll-mt-32 mb-20">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    color: '#c89211',
                                    title: 'Excellence',
                                    body: 'We hold ourselves to the highest academic and professional standards in everything we do.',
                                },
                                {
                                    color: '#005596',
                                    title: 'Inclusion',
                                    body: 'We celebrate diversity and ensure every student feels valued, seen, and supported.',
                                },
                                {
                                    color: '#0f766e',
                                    title: 'Impact',
                                    body: 'We measure our success by the positive difference our graduates make in the world.',
                                },
                            ].map((v) => (
                                <div
                                    key={v.title}
                                    className="rounded-2xl p-8 text-white"
                                    style={{ backgroundColor: v.color }}
                                >
                                    <h3 className="text-xl font-black uppercase tracking-wider mb-3">{v.title}</h3>
                                    <p className="text-white/85 leading-relaxed text-sm font-medium">{v.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>


                </div>
            </GuideSidebarLayout>
        </div>
    );
}
