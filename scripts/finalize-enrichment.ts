
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const courseSections = {
    'entrepreneurship-innovation-bachelor': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The Bachelor of Entrepreneurship & Innovation at Penkka University is designed for future disruptors and builders. We focus on the mindset and skillset required to launch new ventures and drive innovation within established organizations.</p>
                <p>Our practical curriculum covers everything from lean startup methodology to venture finance, mentored by active entrepreneurs and industry experts.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Venture Creation:</strong> Ideation, validation, and business model design.</li>
                    <li><strong>Innovation Strategy:</strong> managing R&D and disruptive technologies.</li>
                    <li><strong>Market Dynamics:</strong> Understanding consumer behavior and scaling.</li>
                    <li><strong>Founder Development:</strong> Leadership, resilience, and personal branding.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <p class="mb-4">Graduates are prepared to lead their own startups or take on high-impact roles in innovation hubs:</p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Startup Founder</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Innovation Consultant</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Product Manager</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Venture Associate</div>
                </div>
            `
        }
    ],
    'international-business-management-msc': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The MSc in International Business & Management provides a sophisticated understanding of global markets and cross-border operations. This programme is geared towards professionals seeking to navigate the complexities of international trade and global leadership.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Global Strategy:</strong> Designing competitive strategies across borders.</li>
                    <li><strong>Cross-Cultural Leadership:</strong> Managing diverse teams in a global environment.</li>
                    <li><strong>International Finance:</strong> Currency risks and global investment strategies.</li>
                    <li><strong>Sustainable Operations:</strong> Global supply chain ethics and logistics.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Global Operations Manager</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Export Strategist</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">International Consultant</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Regional Director</div>
                </div>
            `
        }
    ],
    'international-business-bachelor': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The Bachelor of International Business equips students with the foundational knowledge of how business works on a global scale. From international marketing to global economics, students gain a comprehensive view of the world stage.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Global Marketing:</strong> Adapting brands for diverse international markets.</li>
                    <li><strong>Business Communication:</strong> Advanced proficiency in professional global context.</li>
                    <li><strong>Economic Foundations:</strong> Macro and microeconomics in a globalized world.</li>
                    <li><strong>Digital Trade:</strong> The role of e-commerce in international business.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Market Entry Analyst</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Trade Coordinator</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Global Sales Associate</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Project Coordinator</div>
                </div>
            `
        }
    ],
    'entrepreneurship-innovation-msc': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The MSc in Entrepreneurship & Innovation is an advanced incubator-style programme. It focuses on rapid venture scaling, advanced innovation frameworks, and securing high-stakes venture capital.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Venture Scaling:</strong> Strategies for hyper-growth and global expansion.</li>
                    <li><strong>Advanced R&D Management:</strong> Integrating deep tech into business models.</li>
                    <li><strong>Financial Engineering:</strong> Structuring deals and equity management.</li>
                    <li><strong>Strategic Partnerships:</strong> Building ecosystem moats and alliances.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Chief Innovation Officer</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Serial Entrepreneur</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Venture Architect</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Scalability Expert</div>
                </div>
            `
        }
    ],
    'digital-business-management-bachelor': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The Bachelor of Digital Business Management bridges the gap between traditional management and the new digital economy. Students learn to manage digital assets, platform ecosystems, and data-driven organizations.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Platform Economy:</strong> Understanding multi-sided markets and network effects.</li>
                    <li><strong>Data Governance:</strong> Policy, ethics, and privacy in digital management.</li>
                    <li><strong>Digital Transformation:</strong> Re-engineering legacy systems for the modern age.</li>
                    <li><strong>Agile Management:</strong> Leading teams in high-velocity environments.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Digital Product Owner</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Business Analyst</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">E-commerce Manager</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Digital Strategy Associate</div>
                </div>
            `
        }
    ],
    'cybersecurity-msc': [
        {
            id: 'overview',
            title: 'Programme Overview',
            content: `
                <p class="mb-4">The MSc in Cybersecurity is a specialist programme focused on defensive and offensive security, cryptographic analysis, and cyber-resilience at the enterprise level.</p>
            `
        },
        {
            id: 'curriculum',
            title: 'Core Pillars of Study',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Offensive Security:</strong> Ethical hacking and penetration testing.</li>
                    <li><strong>Advanced Cryptography:</strong> Post-quantum security and blockchain privacy.</li>
                    <li><strong>Cloud Security Architecture:</strong> Securing hyperscale environments.</li>
                    <li><strong>Threat Intelligence:</strong> Predictive security and forensic analysis.</li>
                </ul>
            `
        },
        {
            id: 'outcomes',
            title: 'Career Outcomes',
            content: `
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">CISO</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Lead Security Researcher</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Forensic Investigator</div>
                    <div class="p-4 bg-neutral-50 rounded border border-neutral-100 font-bold">Security Architect</div>
                </div>
            `
        }
    ]
};

async function main() {
    console.log('🚀 Finalizing academic content enrichment...');

    for (const [slug, sections] of Object.entries(courseSections)) {
        console.log(`🔹 Updating content for: ${slug}`);
        const { error } = await supabase
            .from('Course')
            .update({ sections })
            .eq('slug', slug);

        if (error) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        } else {
            console.log(`✅ Successfully updated ${slug}`);
        }
    }

    console.log('✨ Enrichment complete!');
}

main();
