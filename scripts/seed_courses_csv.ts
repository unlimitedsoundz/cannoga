
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

const csvData = `
96d7c08a-90ef-4d41-9017-a6315b992369,Accounting & Finance,accounting-finance,BACHELOR,3 Years,"Covers introduction to financial accounting, management accounting, corporate governance, strategic management accounting, auditing, performance management, and sustainability in accounting.",English,High School Diploma or equivalent,,Financial Analyst; Accountant; Auditor;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
1f3a9b8c-1a52-4e61-9f6e-7f0e9d6f6e12,Economics,economics,BACHELOR,3 Years,"Principles of economics, intermediate microeconomics and macroeconomics, applied microeconometrics, environmental economics, labor economics, urban economics, and empirical market analysis.",English,High School Diploma with Mathematics,,Economic Analyst; Policy Analyst; Researcher;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
7b91fcb4-0c1d-4c3b-9e1a-5f9eab6f4d21,Finance,finance,BACHELOR,3 Years,"Foundational program in corporate finance, investments, financial markets, derivatives, fixed income, portfolio management, and personal finance.",English,High School Diploma with Mathematics,,Financial Analyst; Investment Banker; Risk Manager;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
4c2e8f2a-1a9c-4b7e-9b19-2d8e7a3f4b11,Information Systems & Analytics,information-systems-analytics,BACHELOR,3 Years,"Covers programming, business analytics, information systems development, strategic IT management, simulation, quality management, and digital service design.",English,High School Diploma with Mathematics or ICT,,Business Systems Analyst; Data Analyst; IT Consultant;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
5e9a3f7d-8c2b-4e8f-b9a1-3d2e4c1a6b55,Management,management,BACHELOR,3 Years,"Introduction to strategic management, leadership, organizational design, people management, business model design, sustainability in business, and communication skills.",English,High School Diploma or equivalent,,Manager; Project Coordinator; Operations Manager;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66,Marketing,marketing,BACHELOR,3 Years,"Integrated marketing communications, consumer research, brand management, consumer psychology, fashion marketing, and data-driven marketing.",English,High School Diploma or equivalent,,Marketing Executive; Brand Manager; Consumer Researcher;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
6a2d4f7e-5c1b-4e9f-9a2b-7d3e4f5a6b77,Language & Intercultural,language-intercultural,BACHELOR,3 Years,"Swedish and Canadian for international students, intercultural communication, working in international teams, and global competences.",English,High School Diploma or equivalent,,Translator; International Coordinator; Team Leader;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
7d3e5f8a-1b2c-4e7d-9a3f-8c4e5d6b7f88,Accounting & Finance,accounting-finance-master,MASTER,2 Years,"Advanced corporate finance, international accounting, auditing, risk management, capital budgeting, financial management, and entrepreneurship law.",English,Bachelor's degree in Business or related field,,CFO; Strategy Director; Investment Banker;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
8e4f6a9b-2c3d-4f8a-9b1c-9d5e6f7a8b99,Economics & Analytics,economics-analytics,MASTER,2 Years,"Applied microeconometrics, advanced econometrics, environmental economics, labor economics, digital markets, game theory, and policy analysis.",English,Bachelor's degree in Economics, Business, or Mathematics,,Economic Analyst; Policy Analyst; Research Consultant;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
9f5a7b1c-3d4e-4f9b-9c2d-1e6f7a8b9c00,Finance,finance-master,MASTER,2 Years,"Advanced corporate finance, derivatives, fixed income, portfolio management, mergers and acquisitions, advanced investments, and valuation.",English,Bachelor's degree in Finance or Economics,,Investment Manager; Portfolio Analyst; CFO;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11,Management & Strategy,management-strategy,MASTER,2 Years,"International strategy, sustainability in global value chains, people management, strategic marketing, social innovation, sustainable entrepreneurship, and change management.",English,Bachelor's degree in Business or related field,,Strategy Director; Business Consultant; Operations Manager;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
b172c9d3-5e6f-4g2h-9i3d-3g8h9i0j1k22,Marketing & Innovation,marketing-innovation,MASTER,2 Years,"Brand management, consumer behavior, fashion marketing, digital marketing, contemporary marketing issues, and strategic retail management.",English,Bachelor's degree in Marketing or Business,,Brand Manager; Marketing Director; Consumer Insights Specialist;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33,Entrepreneurship & Innovation,entrepreneurship-innovation,MASTER,2 Years,"Entrepreneurship lab, startup leadership, design & innovation in context, sustainable development goals for business opportunities, and opportunity prototyping.",English,Bachelor's degree in any discipline,,Startup Founder; Innovation Manager; Venture Developer;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
d394e1f5-7g8h-4i5j-9k6f-5i0j1k2l3m44,Interdisciplinary / Joint,interdisciplinary-joint,MASTER,2-3 Years,"Courses in radical creativity, ideation, and design thinking, applicable to both BSc and MSc students.",English,High School Diploma or Bachelor's degree,,Creative Consultant; Innovation Specialist;,a54123ea-caae-40ec-b3b0-d2c1d91528ca,c4549615-f6bb-43f1-8e84-f523065bb08a
`;

// Helper to parse CSV like structure
function parseRow(row: string) {
    const parts = [];
    let currentPart = '';
    let insideQuote = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart.trim());
    return parts;
}

async function main() {
    console.log('🌱 Adding new courses from CSV import...');

    const rows = csvData.trim().split('\n');
    let count = 0;

    for (const row of rows) {
        if (!row.trim()) continue;

        const cols = parseRow(row);

        // Manual mapping based on observed data structure:
        // 0: id
        // 1: title
        // 2: slug
        // 3: degreeLevel
        // 4: duration
        // 5: description
        // 6: language
        // 7: entryRequirements
        // 8: minimumGrade
        // 9: careerPaths
        // 10: schoolId (imageUrl in header, but matches schoolId)
        // 11: departmentId

        const id = cols[0];
        const title = cols[1];
        let slug = cols[2];
        const degreeLevel = cols[3] === 'BOTH' ? 'MASTER' : cols[3]; // Default BOTH to MASTER or handle otherwise? DB implies enum. 
        // User data had "BOTH" for Interdisciplinary. Enum is BACHELOR | MASTER.
        // Let's coerce 'BOTH' to 'MASTER' for now or 'BACHELOR'. Or if enum allows, we might need a db change. 
        // Assuming Enum is strict BACHELOR/MASTER, I'll pick MASTER for Interdisciplinary as it can be both but fits master level often.

        const duration = cols[4];
        const description = cols[5]?.replace(/^"|"$/g, ''); // Remove quotes
        const language = cols[6];
        const entryRequirements = cols[7];
        const minimumGrade = cols[8] || null;
        const careerPaths = cols[9];
        const schoolId = cols[10];
        const departmentId = cols[11];

        // Hack for slug duplicates (user provided 'accounting-finance' twice for BSc and MSc)
        if (title === 'Accounting & Finance' && degreeLevel === 'MASTER' && slug === 'accounting-finance') {
            slug = 'accounting-finance-master';
        }
        if (title === 'Finance' && degreeLevel === 'MASTER' && slug === 'finance') {
            slug = 'finance-master';
        }


        const courseData = {
            id,
            title,
            slug,
            degreeLevel,
            duration,
            description,
            language,
            entryRequirements,
            minimumGrade,
            careerPaths,
            schoolId,
            departmentId,
            imageUrl: null // No image provided
        };

        const { error } = await supabase
            .from('Course')
            .upsert(courseData, { onConflict: 'id' });

        if (error) {
            console.error(`❌ Failed to import ${title}:`, error);
        } else {
            console.log(`✅ Imported: ${title}`);
            count++;
        }
    }

    console.log(`\nDone! Imported ${count} courses.`);
}

main();
