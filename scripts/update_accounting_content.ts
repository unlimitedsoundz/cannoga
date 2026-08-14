
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

// Content from user request
const sections = [
    {
        title: "Description",
        id: "description",
        content: `
            <p class="mb-4">The Accounting & Finance MSc program at Penkka University is designed for students seeking advanced knowledge in accounting, corporate finance, auditing, and financial management. The program emphasizes both theoretical understanding and practical application of accounting standards, corporate governance, strategic management accounting, performance management, risk management, and sustainability in accounting.</p>
            <p>Students develop analytical skills for complex financial decision-making, preparing them for leadership roles in accounting, finance, and corporate strategy.</p>
        `
    },
    {
        title: "Language of Instruction",
        id: "language",
        content: `
            <p class="mb-2"><strong>English (all courses)</strong></p>
            <p>The program prepares students for careers in international business environments and global financial institutions.</p>
        `
    },
    {
        title: "Tuition Fees and Scholarships",
        id: "tuition",
        content: `
            <div class="mb-4">
                <strong>Tuition Fee:</strong> Included in degree tuition for full-time MSc students
            </div>
            <div>
                <strong>Scholarships:</strong>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>Merit-based scholarships for top-performing applicants</li>
                    <li>Need-based financial aid</li>
                    <li>Scholarships for international students</li>
                </ul>
                <p class="mt-2 text-sm text-neutral-500">Detailed scholarship information and application procedures are available on the Penkka University Scholarships page.</p>
            </div>
        `
    },
    {
        title: "Structure of Studies",
        id: "structure",
        content: `
            <div class="mb-6">
                <h4 class="font-bold mb-2">MSc in Accounting & Finance (2 Years):</h4>
                <div class="mb-4">
                    <strong class="block mb-1">Core Courses:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Financial Statement Analysis</li>
                        <li>Financial Accounting Theories</li>
                        <li>Corporate Governance</li>
                        <li>Strategic Management Accounting</li>
                        <li>Auditing – Theory and Practice</li>
                        <li>Performance Management</li>
                        <li>Accounting for Sustainability</li>
                    </ul>
                </div>
                <div class="mb-4">
                    <strong class="block mb-1">Specialised Courses:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Risk Management: Organization and Control</li>
                        <li>Financial Management for Entrepreneurs</li>
                        <li>Capital Budgeting</li>
                        <li>Big Data Analysis in Accounting</li>
                        <li>Entrepreneurship Law in Practice</li>
                    </ul>
                </div>
                <div>
                    <strong class="block mb-1">Capstone / Thesis:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Students complete an individual thesis project focusing on applied accounting and financial issues.</li>
                    </ul>
                </div>
                <p class="mt-4 italic">Practical exercises, case studies, and real-world financial scenarios are embedded throughout the program.</p>
            </div>
        `
    },
    {
        title: "Specialisations",
        id: "specialisations",
        content: `
            <p class="mb-2">Students may choose to focus on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Corporate Finance and Auditing</li>
                <li>Strategic and Management Accounting</li>
                <li>Financial Risk and Sustainability</li>
                <li>Accounting Analytics and Big Data Applications</li>
            </ul>
            <p class="mt-2">Specialisations allow tailoring the degree to career ambitions in consulting, corporate finance, or regulatory roles.</p>
        `
    },
    {
        title: "Internationalisation",
        id: "internationalisation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Student exchange opportunities with partner universities worldwide</li>
                <li>Participation in international conferences and workshops</li>
                <li>Guest lectures from global finance and accounting professionals</li>
            </ul>
            <p class="mt-2">International exposure prepares graduates for multinational organizations and global business roles.</p>
        `
    },
    {
        title: "Further Study Opportunities",
        id: "further-study",
        content: `
            <p class="mb-2">Graduates of the MSc program can pursue:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Doctoral programs (PhD) in Accounting, Finance, or Management</li>
                <li>Professional certifications: CPA, CFA, ACCA</li>
                <li>Advanced research positions in universities or policy institutes</li>
            </ul>
        `
    },
    {
        title: "Career Opportunities",
        id: "career",
        content: `
            <p class="mb-2">Potential career paths include:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Financial Analyst or Advisor</li>
                <li>Corporate Auditor or Compliance Officer</li>
                <li>Chief Financial Officer (CFO)</li>
                <li>Management Consultant</li>
                <li>Entrepreneur in Finance and Accounting Services</li>
            </ul>
        `
    },
    {
        title: "Research Focus",
        id: "research",
        content: `
            <p class="mb-2">Penkka University Accounting & Finance Department focuses on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Advanced corporate finance and valuation</li>
                <li>Management accounting and strategic decision-making</li>
                <li>Auditing and compliance research</li>
                <li>Sustainability accounting and reporting</li>
                <li>Big Data analytics in financial decision-making</li>
            </ul>
        `
    },
    {
        title: "Co-operation with Other Parties",
        id: "cooperation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Collaborations with international accounting firms and financial institutions</li>
                <li>Partnerships with multinational corporations for research projects and internships</li>
                <li>Engagement with regulatory bodies and policy institutes</li>
            </ul>
        `
    },
    {
        title: "Study-Option-Specific Evaluation Criteria in Master's Admissions 2025",
        id: "admissions",
        content: `
            <p class="mb-2">Applicants are evaluated based on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Bachelor’s degree in Business, Finance, Accounting, or related field</li>
                <li>Academic excellence (GPA or minimum grade requirement)</li>
                <li>Motivation letter and career goals</li>
                <li>Letters of recommendation</li>
                <li>Relevant professional experience or internships</li>
            </ul>
            <p class="mt-2 text-sm text-neutral-500">Additional criteria may apply for international students and scholarship applications.</p>
        `
    },
    {
        title: "Contact Information",
        id: "contact",
        content: `
            <p><strong>Penkka University School of Business – Accounting & Finance Department</strong></p>
            <p>Email: <a href="mailto:accounting@cannogacollege.ca" class="text-black hover:underline">accounting@cannogacollege.ca</a></p>
            <p>Phone: +358 20 123 4568</p>
            <p>Address: Penkka University, Otaniemi Campus, Canada</p>
            <p>Office Hours: Monday–Friday, 9:00–17:00</p>
        `
    }
];

async function main() {
    // Assuming the user meant "Accounting & Finance" from the import list.
    // The previous prompt implies the course is "Accounting & Finance".
    // We will target the slug, which is likely 'accounting-and-finance' or 'accounting-finance'
    // Let's assume 'accounting-and-finance' based on standard slugify, but the previous step will confirm it in the logs.
    // To be safe, we'll try to find it by title if slug fails or use the one we find.

    console.log('🔄 Finding Accounting & Finance course...');

    // Try precise match first
    let { data: course } = await supabase.from('Course').select('id, slug').ilike('title', 'Accounting & Finance').single();

    if (!course) {
        // Fallback loose match
        const { data: looseMatch } = await supabase.from('Course').select('id, slug').ilike('title', '%Accounting%').limit(1).single();
        course = looseMatch;
    }

    if (!course) {
        console.error('❌ Could not find "Accounting & Finance" course to update.');
        return;
    }

    console.log(`✅ Found course: ${course.slug}. Updating content...`);

    const { error } = await supabase
        .from('Course')
        .update({
            sections: sections,
            description: "Advanced knowledge in accounting, corporate finance, auditing, and financial management."
        })
        .eq('id', course.id);

    if (error) {
        console.error('❌ Failed to update Accounting course:', error);
    } else {
        console.log('✅ Successfully updated Accounting course content.');
    }
}

main();
