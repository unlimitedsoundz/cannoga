
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

const sections = [
    {
        title: "Description",
        id: "description",
        content: `
            <p class="mb-4">The Accounting & Finance BSc program at Penkka University provides a solid foundation in accounting, finance, and management. Students gain practical and theoretical knowledge in financial accounting, management accounting, corporate governance, auditing, performance management, and financial decision-making.</p>
            <p>The program equips students with analytical skills and business understanding necessary for careers in accounting, finance, and corporate administration.</p>
        `
    },
    {
        title: "Language of Instruction",
        id: "language",
        content: `
            <p class="mb-2"><strong>English (all courses)</strong></p>
            <p>The program is designed to prepare students for careers in international business environments.</p>
        `
    },
    {
        title: "Tuition Fees and Scholarships",
        id: "tuition",
        content: `
            <div class="mb-4">
                <strong>Tuition Fee:</strong> Included in degree tuition for full-time BSc students
            </div>
            <div>
                <strong>Scholarships:</strong>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>Merit-based scholarships for high-achieving students</li>
                    <li>Need-based financial aid</li>
                    <li>Support for international students</li>
                </ul>
                <p class="mt-2 text-sm text-neutral-500">Detailed scholarship information is available on the Penkka University Scholarships page.</p>
            </div>
        `
    },
    {
        title: "Structure of Studies",
        id: "structure",
        content: `
            <div class="mb-6">
                <h4 class="font-bold mb-2">BSc in Accounting & Finance (3 Years):</h4>
                <div class="mb-4">
                    <strong class="block mb-1">Core Courses:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Introduction to Financial Accounting</li>
                        <li>Management Accounting I & II</li>
                        <li>Financial Statement Analysis</li>
                        <li>Corporate Governance</li>
                        <li>Auditing – Theory and Practice</li>
                        <li>Performance Management</li>
                    </ul>
                </div>
                <div class="mb-4">
                    <strong class="block mb-1">Electives and Projects:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Big Data Analysis in Accounting</li>
                        <li>Risk Management and Financial Planning</li>
                        <li>Entrepreneurship Law</li>
                    </ul>
                </div>
                <div>
                    <strong class="block mb-1">Final Year:</strong>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Students complete a capstone project or thesis to apply their knowledge in a practical accounting or finance scenario.</li>
                    </ul>
                </div>
                <p class="mt-4 italic">The program emphasizes hands-on exercises, case studies, and team-based projects.</p>
            </div>
        `
    },
    {
        title: "Specialisations",
        id: "specialisations",
        content: `
            <p class="mb-2">Students may focus on areas such as:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Financial Accounting and Reporting</li>
                <li>Management Accounting and Planning</li>
                <li>Auditing and Compliance</li>
                <li>Risk Management and Sustainability Accounting</li>
            </ul>
            <p class="mt-2">Specialisations help tailor the degree to the student’s career goals.</p>
        `
    },
    {
        title: "Internationalisation",
        id: "internationalisation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Opportunities for student exchange with partner universities</li>
                <li>International workshops, seminars, and guest lectures</li>
                <li>Collaboration on global finance and accounting projects</li>
            </ul>
            <p class="mt-2">International exposure prepares students for multinational corporations and global finance roles.</p>
        `
    },
    {
        title: "Further Study Opportunities",
        id: "further-study",
        content: `
            <p class="mb-2">Graduates can pursue:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>MSc programs in Accounting, Finance, or Business Analytics</li>
                <li>Professional certifications (CPA, ACCA, CFA)</li>
                <li>Research positions or internships in accounting and finance firms</li>
            </ul>
        `
    },
    {
        title: "Career Opportunities",
        id: "career",
        content: `
            <p class="mb-2">Potential career paths include:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Accountant or Financial Analyst</li>
                <li>Auditor or Compliance Officer</li>
                <li>Management Consultant</li>
                <li>Corporate Finance Specialist</li>
                <li>Entrepreneur in Financial Services</li>
            </ul>
        `
    },
    {
        title: "Research Focus",
        id: "research",
        content: `
            <p class="mb-2">The Accounting & Finance Department emphasizes:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Corporate finance and management accounting</li>
                <li>Auditing and regulatory compliance</li>
                <li>Risk management and financial planning</li>
                <li>Sustainability accounting</li>
                <li>Accounting analytics and data-driven decision-making</li>
            </ul>
        `
    },
    {
        title: "Co-operation with Other Parties",
        id: "cooperation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Collaboration with leading accounting and finance firms</li>
                <li>Partnerships with multinational companies for internships and projects</li>
                <li>Engagement with regulatory authorities and professional bodies</li>
            </ul>
        `
    },
    {
        title: "Study-Option-Specific Evaluation Criteria in Admissions",
        id: "admissions",
        content: `
            <p class="mb-2">Applicants are evaluated based on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>High school diploma or equivalent</li>
                <li>Academic performance, especially in mathematics and business-related subjects</li>
                <li>Motivation letter and career aspirations</li>
                <li>Letters of recommendation</li>
                <li>Relevant extracurricular or internship experience</li>
            </ul>
        `
    },
    {
        title: "Contact Information",
        id: "contact",
        content: `
            <p><strong>Penkka University School of Business – Accounting & Finance Department</strong></p>
            <p>Email: <a href="mailto:accounting@cannogacollege.ca" class="text-black hover:underline">accounting@cannogacollege.ca</a></p>
            <p>Address: Penkka University, Otaniemi Campus, Canada</p>
            <p>Office Hours: Monday–Friday, 9:00–17:00</p>
        `
    }
];

async function main() {
    console.log('🔄 Finding dependencies (School, Department)...');

    // Find School of Business
    const { data: school } = await supabase.from('School').select('id').ilike('name', '%Business%').single();
    if (!school) {
        console.error('❌ School of Business not found.');
        return;
    }

    // Find Business Department
    const { data: department } = await supabase.from('Department').select('id').ilike('name', 'Business').single();
    if (!department) {
        console.error('❌ Business Department not found.');
        return;
    }

    console.log('🔄 Upserting Accounting & Finance BSc...');

    // We use a specific slug for the BSc to distinguish it from the (presumed) MSc
    const slug = 'accounting-and-finance-bsc';
    const title = 'Accounting & Finance'; // Same title, different degree level

    // Check if it exists by slug
    const { data: existingCourse } = await supabase.from('Course').select('id').eq('slug', slug).single();

    let result;
    if (existingCourse) {
        // Update
        result = await supabase.from('Course').update({
            title: title,
            degreeLevel: 'BACHELOR',
            credits: 180,
            duration: '3 Years',
            description: "Solid foundation in accounting, finance, and management.",
            sections: sections,
            schoolId: school.id,
            departmentId: department.id,
            language: 'English',
            tuitionFee: '12 000 $ / year' // Assuming standard BSc fee from previous script logic, or included in degree tuition
        }).eq('id', existingCourse.id);
    } else {
        // Create
        result = await supabase.from('Course').insert({
            slug: slug,
            title: title,
            degreeLevel: 'BACHELOR',
            credits: 180,
            duration: '3 Years',
            description: "Solid foundation in accounting, finance, and management.",
            sections: sections,
            schoolId: school.id,
            departmentId: department.id,
            language: 'English',
            tuitionFee: '12 000 $ / year'
        });
    }

    if (result.error) {
        console.error('❌ Failed to upsert Accounting BSc course:', result.error);
    } else {
        console.log('✅ Successfully upserted Accounting & Finance BSc course.');
    }
}

main();
