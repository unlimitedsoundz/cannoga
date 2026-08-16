import PublicationList from './PublicationList';
import { Hero } from '@/components/layout/Hero';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';

export const metadata = {
    title: 'Peer-Reviewed Academic Publications',
    description: 'Explore scientific journals, Canadian research publications, engineering papers, and project results published by Cannoga College faculty.',
    alternates: {
        canonical: 'https://cannogacollege.ca/research/publications/',
    },
};

export default function PublicationsPage() {
    const publications = [
        {
            title: "Analysis of Recycled Concrete Aggregates in Structural Applications",
            authors: "Dr. Mitchell S., Dr. Tremblay A.",
            journal: "Canadian Journal of Sustainable Civil Engineering",
            year: "2025",
            abstract: "This comprehensive study investigates the mechanical properties, long-term durability, and environmental impact of concrete mixtures incorporating 50% and 100% recycled concrete aggregates (RCA) sourced from local demolition sites across Ontario. Through extensive laboratory testing—including compressive strength, tensile splitting, and chloride penetration resistance—results indicate that while compressive strength is reduced by approximately 10-15%, the environmental benefits, such as reduced landfill waste and lowered carbon footprint, combined with adequate structural performance, make RCA a highly viable alternative for non-critical structural elements and sustainable urban infrastructure projects."
        },
        {
            title: "Smart Grid Resilience during Extreme Winter Events in Eastern Canada",
            authors: "Dr. Chen J., Dr. MacLeod M.",
            journal: "Energy Systems & Policy Quarterly",
            year: "2024",
            abstract: "As severe winter climate shifts lead to more frequent ice storms and extreme weather events in North America, the resilience of smart grid architectures is becoming a paramount concern for national infrastructure. This paper identifies key vulnerabilities in traditional centralized power distribution and proposes a robust, decentralized control strategy. By leveraging microgrid islanding techniques and advanced sensing algorithms, the proposed system can autonomously isolate localized faults while maintaining a stable power supply to critical infrastructure, such as Ottawa hospitals and emergency response centers, during severe storm conditions."
        },
        {
            title: "Urban Green Spaces and Mental Well-being in High-Density Canadian Cities",
            authors: "Dr. Laine E., Dr. Bouchard K.",
            journal: "Canadian Urban Planning Review",
            year: "2024",
            abstract: "This longitudinal research presents a comparative analysis of mental health indicators among residents in high-density urban environments across Ottawa and Toronto with varying access to biophilic design elements. Utilizing a combination of physiological stress markers, such as cortisol level tracking, and standardized psychological assessments, the findings suggest a statistically significant correlation between daily proximity to small community 'pocket' parks and reduced levels of clinical anxiety and depression. The study concludes with policy recommendations for Canadian urban planners to prioritize small-scale green interventions in underprivileged residential zones."
        },
        {
            title: "Circular Economy Models for Textile & Industrial Waste Management",
            authors: "Dr. Vance E., Dr. O'Connor T.",
            journal: "North American Sustainable Materials Journal",
            year: "2023",
            abstract: "Exploring the economic and operational feasibility of closed-loop textile recycling systems, this paper focuses on the unique logistical challenges faced by Canadian consumer industries. Through a series of case studies involving major retailers and regional waste processors, the research identifies key bottlenecks in automated fabric sorting and chemical separation processes. The paper proposes an integrated policy framework designed to incentivize consumer return participation while mandating corporate responsibility for end-of-life textile management, ultimately aiming to transform low-value waste into high-quality recycled fibers for high-end production."
        },
        {
            title: "Applied Machine Learning Models for Environmental Risk Assessment in Sub-Arctic Watersheds",
            authors: "Dr. Fraser R., Dr. Nguyen L.",
            journal: "Environmental Informatics & Applied Computing",
            year: "2023",
            abstract: "Developing predictive water quality assessment models using satellite imagery and IoT sensor streams deployed along Northern Ontario watershed networks. The research presents a 94.2% accuracy rate in early detection of industrial run-off spikes, providing municipal decision-makers with actionable real-time risk alerts."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black antialiased font-sans pb-24">
            <BreadcrumbSchema items={[
                { name: 'Home', item: '/' },
                { name: 'Research Hub', item: '/research' },
                { name: 'Publications', item: '/research/publications' }
            ]} />

            {/* Standard Hero Component */}
            <Hero
                title="Peer-Reviewed Academic Publications"
                body="Our faculty and researchers contribute to global scientific knowledge through peer-reviewed journals, international conference proceedings, and Canadian open-access research repositories."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                overlay={true}
                overlayOpacity="opacity-40"
                image={{
                    src: "/images/technology.jpg",
                    alt: "Cannoga Academic Publications"
                }}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Research', href: '/research' },
                    { label: 'Publications' }
                ]}
            />

            <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">Faculty Journal Index</h2>
                        <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                            Select any publication entry below to view the abstract and publication details.
                        </p>
                    </div>
                    <Link 
                        href="/research" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:underline transition-colors shrink-0"
                    >
                        <span>← Return to Research Hub</span>
                    </Link>
                </div>

                <PublicationList publications={publications} />
            </div>
        </div>
    );
}
