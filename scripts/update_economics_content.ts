
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
            <p class="mb-4">The Economics program at Penkka University provides a comprehensive understanding of economic theory, quantitative methods, and applied policy analysis. Students learn to analyze micro- and macroeconomic systems, market structures, and economic policy challenges. The program combines rigorous theoretical knowledge with practical applications in finance, labor economics, environmental economics, urban economics, and econometrics.</p>
            <p>The program is suitable for students aiming to pursue careers in economic research, policy-making, consultancy, or international organizations.</p>
        `
    },
    {
        title: "Language of Instruction",
        id: "language",
        content: `
            <p class="mb-2"><strong>English (all courses)</strong></p>
            <p>The program ensures international accessibility and prepares students for global careers.</p>
        `
    },
    {
        title: "Tuition Fees and Scholarships",
        id: "tuition",
        content: `
            <div class="mb-4">
                <strong>Tuition Fee:</strong> Included in degree tuition (for full-time students)
            </div>
            <div>
                <strong>Scholarships:</strong>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>Merit-based scholarships for high-achieving applicants</li>
                    <li>Need-based financial aid for eligible students</li>
                    <li>International scholarships for MSc candidates</li>
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
                <h4 class="font-bold mb-2">BSc in Economics (3 Years):</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Core courses:</strong> Principles of Economics, Intermediate Micro- and Macroeconomics, Applied Microeconometrics, Environmental Economics, Labor Economics, Urban Economics.</li>
                    <li><strong>Electives:</strong> Digital Markets, Game Theory, Capstone projects, specialized quantitative methods.</li>
                    <li><strong>Final year:</strong> Empirical market analysis and thesis project.</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-2">MSc in Economics (2 Years):</h4>
                <ul class="list-disc pl-5 space-y-1">
                    <li><strong>Advanced courses:</strong> Applied Econometrics, Labor Economics II, Advanced Environmental Economics, Economics of Energy Markets, Blockchain Economics.</li>
                    <li><strong>Specialised modules:</strong> Policy Analysis, Urban Economics, Digital Markets, Game Theory.</li>
                    <li>MSc thesis required in the second year.</li>
                </ul>
                <p class="mt-4 italic">Practical projects, case studies, and capstone courses are embedded throughout both degrees.</p>
            </div>
        `
    },
    {
        title: "Specialisations",
        id: "specialisations",
        content: `
            <p class="mb-2">Students can specialise in:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Environmental Economics and Policy</li>
                <li>Labor and Urban Economics</li>
                <li>Digital Markets and Game Theory</li>
                <li>Applied Econometrics and Policy Analysis</li>
            </ul>
            <p class="mt-2">Specialisations allow tailoring of studies towards research or professional focus areas.</p>
        `
    },
    {
        title: "Internationalisation",
        id: "internationalisation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Opportunities for exchange programs with partner universities globally</li>
                <li>Participation in international seminars and workshops</li>
                <li>Guest lectures from international scholars and industry leaders</li>
            </ul>
            <p class="mt-2">International exposure enhances students’ career prospects in multinational organizations.</p>
        `
    },
    {
        title: "Further Study Opportunities",
        id: "further-study",
        content: `
            <p class="mb-2">Graduates can pursue:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>MSc programs in Economics, Finance, or Data Analytics</li>
                <li>PhD programs in Applied Economics, Econometrics, or Policy Analysis</li>
                <li>Professional certifications in Data Analytics, Risk Management, and Financial Modelling</li>
            </ul>
        `
    },
    {
        title: "Career Opportunities",
        id: "career",
        content: `
            <p class="mb-2">Potential career paths:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Economic Analyst</li>
                <li>Policy Advisor</li>
                <li>Researcher in public or private sector</li>
                <li>Consultant in think tanks or international organizations</li>
                <li>Financial Analyst specializing in market trends</li>
            </ul>
        `
    },
    {
        title: "Research Focus",
        id: "research",
        content: `
            <p class="mb-2">Penkka University Economics Department focuses on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Applied econometrics and microeconomic policy</li>
                <li>Environmental and energy market economics</li>
                <li>Urban economics and development</li>
                <li>Digital markets and game theory applications</li>
                <li>Sustainability and social impact in economics</li>
            </ul>
        `
    },
    {
        title: "Co-operation with Other Parties",
        id: "cooperation",
        content: `
            <ul class="list-disc pl-5 space-y-1">
                <li>Collaboration with government agencies and central banks</li>
                <li>Partnership with multinational corporations for research and internships</li>
                <li>Engagement with international universities for joint research projects</li>
            </ul>
        `
    },
    {
        title: "Study-Option-Specific Evaluation Criteria in Master's Admissions 2025",
        id: "admissions",
        content: `
            <p class="mb-2">Applicants will be evaluated based on:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Bachelor’s degree in Economics, Business, or related fields</li>
                <li>Academic performance (minimum grade requirements)</li>
                <li>Motivation letter and personal statement</li>
                <li>Letters of recommendation</li>
                <li>Relevant work or research experience</li>
            </ul>
            <p class="mt-2 text-sm text-neutral-500">Additional criteria may apply for international applicants and scholarship consideration.</p>
        `
    },
    {
        title: "Contact Information",
        id: "contact",
        content: `
            <p><strong>Penkka University School of Business – Economics Department</strong></p>
            <p>Email: <a href="mailto:economics@cannogacollege.ca" class="text-black hover:underline">economics@cannogacollege.ca</a></p>
            <p>Address: Penkka University, Otaniemi Campus, Canada</p>
            <p>Office Hours: Monday–Friday, 9:00–17:00</p>
        `
    }
];

async function main() {
    console.log('🔄 Updating Economics course with rich sections...');

    const { error } = await supabase
        .from('Course')
        .update({
            sections: sections,
            description: "A comprehensive program in economic theory, quantitative methods, and applied policy analysis." // Brief override for card view
        })
        .eq('slug', 'economics');

    if (error) {
        console.error('❌ Failed to update Economics course:', error);
    } else {
        console.log('✅ Successfully updated Economics course content.');
    }
}

main();
