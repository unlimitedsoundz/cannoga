import { Hero } from '@/components/layout/Hero';
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { TagGroup } from '@/components/ui/TagGroup';
import { LiftupCollection } from '@aalto-dx/react-modules';

export const metadata = {
    title: 'Scientific Research, Innovation & Labs — Cannoga College',
    description: 'Explore research initiatives, faculty publications, and specialist laboratories driving positive global change from Ottawa.',
    alternates: {
        canonical: 'https://cannogacollege.ca/research/',
    },
};

export default function ResearchPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
<Hero
                 title="Research & Creative Exploration"
                 body="Where curiosity meets creation, connecting theory with hands-on practice in the heart of Ottawa."
                 backgroundColor="#1e3a8a"
                 tinted={false}
                 lightText={true}
                 breadcrumbs={[
                     { label: 'Home', href: '/' },
                     { label: 'Research' }
                 ]}
             />

            {/* Intro Grid */}
            <div className="cc-container cc-section">
                <div className="cc-section-divider">
                    <h2 className="cc-h2">Where Curiosity Meets Creation</h2>
                </div>
                <div className="prose prose-lg text-neutral-600 max-w-3xl leading-relaxed">
                    <p className="mb-6">
                        At <strong className="text-[#000000]">Cannoga College</strong>, research is not locked away in labs or journals — it lives in studios, classrooms, communities, and real-world projects. We explore questions that matter now and ideas that shape what comes next, blending <strong className="text-[#000000]">technology, design, business, science, and culture</strong> into a shared space of experimentation and discovery.
                    </p>
                    <p>
                        Our research culture welcomes both analytical thinkers and creative makers. Whether through data, design, systems, or stories, we believe knowledge grows stronger when disciplines cross paths.
                    </p>
                </div>
            </div>

            {/* Core Exploration */}
            <div className="cc-section-tinted">
                <div className="cc-container grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">Core Exploration</h2>
                        </div>
                        <ul className="space-y-5">
                            {[
                                "Turn curiosity into meaningful action",
                                "Connect theory with hands-on practice",
                                "Support sustainable, ethical, and inclusive futures",
                                "Empower students to challenge norms and create alternatives"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-700 font-medium">
                                    <ArrowRight size={18} weight="bold" className="shrink-0 text-[#000000]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="cc-card cc-card-body">
                         <h3 className="cc-h3 mb-4">Core Values</h3>
                         <p className="text-neutral-600 leading-relaxed">
                             We value <strong>applied research</strong>, <strong>creative inquiry</strong>, and <strong>practice-based exploration</strong> equally because innovation rarely comes from just one way of thinking.
                        </p>
                    </div>
                </div>
            </div>

            {/* Research Focus Areas */}
            <div className="cc-section">
                <div className="cc-container">
                    <div className="cc-section-divider mb-10">
                        <h2 className="cc-h2">Research Focus Areas</h2>
                        <p className="cc-label">Exploring the radical intersection of technology, humanity, and the global environment.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Code & Culture",
                                desc: "Digitalisation beyond the screen examining how technology interacts with people, culture, ethics, and systems.",
                                tags: ["AI & Data", "Digital Platforms", "Ethics"]
                            },
                            {
                                title: "Smart Materials",
                                desc: "Rethinking materials and systems for sustainability, performance, and longevity.",
                                tags: ["Recyclable", "Energy", "Innovation"]
                            },
                            {
                                title: "Art & Media",
                                desc: "Artistic exploration as a way of knowing, questioning, and communicating.",
                                tags: ["Practice-based", "Visual", "Prototyping"]
                            },
                            {
                                title: "New Work Models",
                                desc: "Exploring how organisations can be more adaptive, ethical, and human-centred.",
                                tags: ["Service Design", "Sustainable", "Leadership"]
                            },
                            {
                                title: "Powering Tomorrow",
                                desc: "Connecting engineering, systems analysis, and environmental responsibility.",
                                tags: ["Renewable", "Smart Infra", "Climate"]
                            },
                            {
                                title: "Integrated Spaces",
                                desc: "How physical and digital spaces can be designed around real human needs.",
                                tags: ["Architecture", "Urban", "Inclusive"]
                            }
                        ].map((theme, i) => (
                            <div key={i} className="cc-card p-8 group hover:bg-[#9c27b3] transition-all">
                                <h3 className="text-lg font-bold text-[#000000] uppercase tracking-tight mb-3 group-hover:text-white transition-colors">{theme.title}</h3>
                                <p className="text-neutral-600 mb-6 leading-relaxed text-sm group-hover:text-white/80 transition-colors">{theme.desc}</p>
                                <TagGroup tags={theme.tags.map(tag => ({ label: tag }))} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Research - Liftup Collection */}
            <div className="bg-white py-20 md:py-40 border-t border-[#9c27b3]">
                <div className="container mx-auto px-4">
                    <h2 className="text-5xl font-semibold mb-20 text-black uppercase tracking-tighter text-center">Featured Explorations</h2>
                        <LiftupCollection
                            tilesPerRow={3}
                            tiles={[
                                {
                                    title: "Integrated Systems Research",
                                    body: "Exploring the boundary between physical infrastructure and digital twins. Our research into integrated systems aims to create more resilient urban environments through data-driven design and real-time monitoring.",
                                    cta: {
                                        label: "View Project Details",
                                        linkComponentProps: { href: "/research/projects/" },
                                    },
                                    icon: "chevron-right",
                                },
                                {
                                    title: "Future Materials Lab",
                                    body: "Developing biodegradable alternatives to structural polymers. This project combines synthetic biology with architectural engineering to grow the next generation of building materials.",
                                    cta: {
                                        label: "Download Whitepaper",
                                        linkComponentProps: { href: "/research/publications/", target: "_blank" },
                                    },
                                    icon: "arrow-download",
                                },
                                {
                                    title: "Ethical AI Frameworks",
                                    body: "Defining human-centric AI governance for creative industries. We are building the tools that ensure artificial intelligence serves human creativity without compromising individual integrity.",
                                    cta: {
                                        label: "Join the Discussion",
                                        linkComponentProps: { href: "/research/projects/" },
                                    },
                                    type: "button",
                                    icon: "chevron-right",
                                },
                                {
                                    title: "Urban Biodiversity",
                                    body: "Mapping the intersection of urban density and ecological health. This project uses satellite imagery and ground sensors to design cityscapes that actively support local flora and fauna.",
                                    cta: {
                                        label: "Explore Map",
                                        linkComponentProps: { href: "/research/projects/" },
                                    },
                                    icon: "chevron-right",
                                },
                                {
                                    title: "Circular Economy Models",
                                    body: "Rethinking the lifecycle of consumer electronics. Our team is developing modular hardware standards that enable 100% component recovery and secondary market utility.",
                                    cta: {
                                        label: "Learn More",
                                        linkComponentProps: { href: "/research/projects/" },
                                    },
                                    icon: "chevron-right",
                                },
                                {
                                    title: "Social Innovation Lab",
                                    body: "Prototyping community-led housing solutions in Ottawa. We connect architectural students with local residents to design living spaces that foster collective well-being and affordability.",
                                    cta: {
                                        label: "Read Case Study",
                                        linkComponentProps: { href: "/research/projects/" },
                                    },
                                    icon: "chevron-right",
                                },
                            ]}
                        />
                </div>
            </div>

            {/* Experimental Framework */}
            <div className="py-16 md:py-24 bg-[#9c27b3] text-white">
                <div className="cc-container">
                    <div className="cc-section-divider border-white/20 mb-12">
                        <h2 className="cc-h2 !text-white">Experimental Framework</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Collaborative", text: "Crossing departments and disciplines" },
                            { title: "Hands-on", text: "Grounded in making and iteration" },
                            { title: "Open-minded", text: "Welcoming radical questions" },
                            { title: "Ethical", text: "Guided by integrity" }
                        ].map((way, i) => (
                            <div key={i} className="p-8 bg-white/5 border border-white/10 hover:bg-white hover:text-[#000000] transition-all group">
                                <h3 className="text-lg font-bold uppercase tracking-tight mb-3 text-white group-hover:text-[#000000]">{way.title}</h3>
                                <p className="text-white text-sm leading-relaxed group-hover:text-neutral-500">{way.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Outcomes & Ethics */}
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="grid md:grid-cols-2 gap-20">
                    <div>
                        <h2 className="text-4xl font-semibold mb-10 uppercase tracking-tighter">Tangible Impact</h2>
                        <ul className="space-y-4 mb-12">
                            {[
                                "Publications and policy insights",
                                "Prototypes and digital tools",
                                "Exhibitions and performances",
                                "Sustainable business frameworks",
                                "Global community projects"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-black font-bold uppercase tracking-widest text-sm">
                                    <ArrowRight size={20} weight="bold" className="shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-neutral-50 p-10 shadow-sm">
                            <h3 className="text-2xl font-semibold uppercase tracking-tighter mb-4">Focus on Future</h3>
                            <p className="text-black font-medium leading-relaxed">Not just academically, but socially, culturally, and environmentally. Our work helps shape futures that are thoughtful, creative, and radically sustainable.</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-semibold mb-10 uppercase tracking-tighter">Ethics & Integrity</h2>
                        <p className="text-xl text-black mb-10 leading-relaxed font-medium">
                            All research and creative activity at Cannoga College follows clear ethical guidelines and quality standards. Integrity, transparency, and accountability are central to how we work.
                        </p>
                        <h3 className="text-2xl font-semibold uppercase tracking-tighter mb-6">Support Infrastructure</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {["Interdisciplinary labs", "Industry partnerships", "Global networks", "Research platforms"].map((item, idx) => (
                                 <div key={item} className={`text-sm font-bold uppercase tracking-widest flex items-center gap-4`}>
                                     <ArrowRight size={20} weight="bold" className="shrink-0" />
                                     {item}
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>            {/* CTA */}
            <div className="cc-section-tinted text-center">
                <div className="cc-container">
                    <p className="cc-label uppercase tracking-widest mb-3">Join the Research Community</p>
                    <h2 className="cc-h2 mb-6">Manifest Your Research</h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Students and staff are invited to actively engage in exploration. At Cannoga College, research is not just something you study — <strong>it's something you do</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/research/projects" className="cc-btn-primary no-underline">
                            Explore Projects <ArrowRight size={14} weight="bold" />
                        </Link>
                        <Link href="/contact" className="cc-btn-outline no-underline">
                            Connect With Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

