
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

const sharedSections = (title: string, degree: string) => [
    {
        id: "description",
        title: "Programme Description",
        content: `
            <p class="mb-4">The ${title} ${degree} programme at Penkka University offers a comprehensive curriculum designed to prepare students for leadership roles in the global economy. The programme integrates theoretical foundations with practical applications, focusing on sustainable practices and innovative thinking.</p>
            <p>Students will engage in multi-disciplinary projects, case studies, and corporate collaborations to develop the skills necessary for a successful career in ${title}.</p>
        `
    },
    {
        id: "structure",
        title: "Degree Structure",
        content: `
            <p class="mb-4">The degree consists of core studies, specialization courses, and a final thesis project. The curriculum is updated annually to reflect the latest industry trends and research insights.</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Core Discipline Studies (${degree === 'MASTER' ? '60' : '150'} ECTS)</li>
                <li>Elective Studies (20 ECTS)</li>
                <li>${degree === 'MASTER' ? 'Master\'s' : 'Bachelor\'s'} Thesis (30 ECTS)</li>
            </ul>
        `
    },
    {
        id: "career",
        title: "Career Opportunities",
        content: `
            <p class="mb-4">Graduates of the ${title} programme are highly sought after by international organizations, consulting firms, and innovative startups. Potential career paths include:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Senior ${title} Consultant</li>
                <li>Project Lead in ${title} Operations</li>
                <li>Research & Development Specialist</li>
                <li>Independent Entrepreneur in the ${title} Sector</li>
            </ul>
        `
    },
    {
        id: "admissions",
        title: "Admissions Information",
        content: `
            <p class="mb-4">Admission is based on academic excellence and potential for impact. Applicants must demonstrate strong analytical skills and a commitment to sustainable business values.</p>
            <p>Required documents include previous degree certificates, transcripts, a motivation letter, and proof of English proficiency.</p>
        `
    }
];

const courseUpdates = [
    { slug: 'finance-master', title: 'Finance', degree: 'MASTER' },
    { slug: 'management-strategy', title: 'Management & Strategy', degree: 'MASTER' },
    { slug: 'marketing-innovation', title: 'Marketing & Innovation', degree: 'MASTER' },
    { slug: 'entrepreneurship-innovation', title: 'Entrepreneurship & Innovation', degree: 'MASTER' },
    { slug: 'interdisciplinary-joint', title: 'Interdisciplinary / Joint', degree: 'MASTER' },
    { slug: 'marketing', title: 'Marketing', degree: 'BACHELOR' },
    { slug: 'finance', title: 'Finance', degree: 'BACHELOR' },
    { slug: 'information-systems-analytics', title: 'Information Systems & Analytics', degree: 'BACHELOR' },
    { slug: 'management', title: 'Management', degree: 'BACHELOR' },
    { slug: 'language-intercultural', title: 'Language & Intercultural', degree: 'BACHELOR' },
    { slug: 'strategic-management-finance', title: 'Strategic Management & Finance', degree: 'MASTER' }
];

async function main() {
    console.log('🌱 Seeding missing course sections...');

    for (const update of courseUpdates) {
        console.log(`Updating ${update.title} (${update.slug})...`);
        const { error } = await supabase
            .from('Course')
            .update({
                sections: sharedSections(update.title, update.degree)
            })
            .eq('slug', update.slug);

        if (error) {
            console.error(`Error updating ${update.slug}:`, error);
        } else {
            console.log(`✅ Updated ${update.slug}`);
        }
    }

    console.log('✨ All missing sections populated.');
}

main();
