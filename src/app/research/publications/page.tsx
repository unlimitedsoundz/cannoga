
import PublicationList from './PublicationList';

export const metadata = {
    title: 'Peer-Reviewed Academic Publications — Cannoga College',
    description: 'Read scholarly journals, conference papers, and project results published by our professors and research assistants.',
    alternates: {
        canonical: 'https://cannogacollege.ca/research/publications/',
    },
};

export default function PublicationsPage() {
    const publications = [
        {
            title: "Analysis of Recycled Concrete Aggregates in Structural Applications",
            authors: "Mitchell S., Korhonen A.",
            journal: "Journal of Sustainable Construction",
            year: "2025",
            abstract: "This comprehensive study investigates the mechanical properties, long-term durability, and environmental impact of concrete mixtures incorporating 50% and 100% recycled concrete aggregates (RCA) sourced from local demolition sites. Through extensive laboratory testing—including compressive strength, tensile splitting, and chloride penetration resistance—results indicate that while compressive strength is reduced by approximately 10-15%, the environmental benefits, such as reduced landfill waste and lowered carbon footprint, combined with adequate structural performance, make RCA a highly viable alternative for non-critical structural elements and sustainable urban infrastructure projects."
        },
        {
            title: "Smart Grid Resilience during Extreme Weather Events",
            authors: "Chen J., Virtanen M.",
            journal: "Energy Systems & Policy",
            year: "2024",
            abstract: "As planetary climate shifts lead to more frequent and intense extreme weather events, the resilience of smart grid architectures is becoming a paramount concern for national security and public safety. This paper identifies key vulnerabilities in traditional centralized power distribution and proposes a robust, decentralized control strategy. By leveraging microgrid islanding techniques and advanced sensing algorithms, the proposed system can autonomously isolate localized faults while maintaining a stable power supply to critical infrastructure, such as hospitals and emergency response centers, during severe storm conditions."
        },
        {
            title: "Urban Green Spaces and Mental Well-being in High-Density Cities",
            authors: "Laine E., Sato K.",
            journal: "Urban Planning Review",
            year: "2024",
            abstract: "This longitudinal research presents a comparative analysis of mental health indicators among residents in high-density urban environments with varying access to biophilic design elements. Utilizing a combination of physiological stress markers, such as cortisol level tracking, and standardized psychological assessments, the findings suggest a statistically significant correlation between daily proximity to small community 'pocket' parks and reduced levels of clinical anxiety and depression. The study concludes with policy recommendations for urban planners to prioritize small-scale green interventions in underprivileged residential zones."
        },
        {
            title: "Circular Economy Models for Textile Waste Management",
            authors: "Virtanen M., Hämäläinen T.",
            journal: "Sustainable Fashion Journal",
            year: "2023",
            abstract: "Exploring the economic and operational feasibility of closed-loop textile recycling systems, this paper focuses on the unique logistical challenges faced by the Nordic fashion industry. Through a series of case studies involving major retailers and regional waste processors, the research identifies key bottlenecks in automated fabric sorting and chemical separation processes. The paper proposes an integrated policy framework designed to incentivize consumer return participation while mandating corporate responsibility for end-of-life textile management, ultimately aiming to transform low-value waste into high-quality recycled fibers for high-end production."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-neutral-900 pt-8">Recent Publications</h1>

                <p className="text-neutral-600 mb-12 max-w-2xl text-lg">
                    Our faculty and researchers contribute to global knowledge through peer-reviewed journals, conferences, and open-access platforms.
                </p>

                <PublicationList publications={publications} />
            </div>
        </div>
    );
}
