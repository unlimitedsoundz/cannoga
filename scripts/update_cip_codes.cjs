/**
 * update_cip_codes.cjs
 * 
 * 1. Adds `cip_code TEXT` column to "Course" table (idempotent)
 * 2. Updates all 185 courses with real Canadian CIP 2021 codes
 *    from Statistics Canada Classification of Instructional Programs
 *
 * Run: node scripts/update_cip_codes.cjs
 */

const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

// Real Canadian CIP 2021 codes (Statistics Canada)
// Format: 6-digit code e.g. "52.0301" = Accounting
function assignCIPCode(title, degreeLevel) {
    const t = (title || '').toLowerCase();

    // ── Accounting / Finance / Business Law ──────────────────────────────────
    if ((t.includes('accounting') && t.includes('payroll')) || t.includes('payroll'))
        return '52.0301'; // Accounting
    if (t.includes('accounting') && t.includes('business law'))
        return '52.0301'; // Accounting — business law variant
    if (t.includes('accounting') && t.includes('finance') && !t.includes('advanced'))
        return '52.0302'; // Accounting and Finance
    if (t.includes('accounting') && t.includes('finance') && t.includes('advanced'))
        return '52.0302'; // Advanced Diploma Accounting & Finance
    if (t.includes('accounting fundamentals') || (t.includes('accounting') && t.includes('certificate')))
        return '52.0301'; // Accounting Fundamentals
    if (t.includes('accounting') && !t.includes('finance') && !t.includes('law') && !t.includes('payroll'))
        return '52.0301'; // General accounting
    if (t.includes('bsc accounting') && t.includes('business law'))
        return '52.0301';
    if (t.includes('bsc accounting') && t.includes('finance'))
        return '52.0302';

    // ── Business Administration / Management ─────────────────────────────────
    if (t.includes('business administration') && (t.includes('bachelor') || t.includes('bba')))
        return '52.0201'; // BBA
    if (t.includes('business administration') && t.includes('executive'))
        return '52.0201';
    if (t.includes('business administration'))
        return '52.0201'; // Diploma/Advanced Diploma BAdmin
    if (t.includes('business management') && t.includes('bachelor'))
        return '52.0201';
    if (t.includes('business management') && t.includes('digital'))
        return '52.1201'; // Digital Business Management
    if (t.includes('business management'))
        return '52.0201';
    if (t.includes('business foundations'))
        return '52.0101'; // Business (general)
    if (t.includes('management studies') && t.includes('advanced'))
        return '52.0201';
    if (t.includes('management studies'))
        return '52.0201';
    if (t.includes('management') && t.includes('strategy') && t.includes('finance'))
        return '52.0801'; // Strategic Management & Finance
    if (t.includes('strategic management'))
        return '52.0201';
    if (t.includes('global business'))
        return '52.1101';
    if (t.includes('international business'))
        return '52.1101';
    if (t.includes('management') && t.includes('strategy') && !t.includes('supply') && !t.includes('project'))
        return '52.0201';
    if (t.includes('management') && !t.includes('supply') && !t.includes('project') && !t.includes('hospitality') && !t.includes('tourism') && !t.includes('culinary') && !t.includes('aviation') && !t.includes('information') && !t.includes('event') && !t.includes('human') && !t.includes('financial') && !t.includes('industrial') && !t.includes('environmental') && !t.includes('operations') && !t.includes('service') && !t.includes('retail'))
        return '52.0201';

    // ── Finance ──────────────────────────────────────────────────────────────
    if (t.includes('financial services'))
        return '52.0801';
    if (t.includes('finance') && !t.includes('accounting') && !t.includes('agri'))
        return '52.0801';

    // ── Marketing ────────────────────────────────────────────────────────────
    if (t.includes('marketing') && t.includes('innovation'))
        return '52.1401';
    if (t.includes('marketing essentials') || t.includes('marketing') && t.includes('certificate'))
        return '52.1401';
    if (t.includes('social media marketing'))
        return '52.1401';
    if (t.includes('marketing'))
        return '52.1401';

    // ── Human Resources ──────────────────────────────────────────────────────
    if (t.includes('human resource') || t.includes('human resources'))
        return '52.1001';

    // ── Project Management ───────────────────────────────────────────────────
    if (t.includes('project management'))
        return '52.2101';

    // ── Entrepreneurship / Innovation ────────────────────────────────────────
    if (t.includes('entrepreneurship'))
        return '52.0701'; // Entrepreneurship/Entrepreneurial Studies

    // ── Supply Chain / Logistics ─────────────────────────────────────────────
    if (t.includes('supply chain') || t.includes('logistics'))
        return '52.1801'; // Operations Management & Logistics

    // ── Operations ───────────────────────────────────────────────────────────
    if (t.includes('operations') && t.includes('logistics'))
        return '52.1801';

    // ── Hospitality / Tourism / Culinary ─────────────────────────────────────
    if (t.includes('culinary management'))
        return '52.1903'; // Hospitality & Culinary
    if (t.includes('culinary skills') || t.includes('baking') || t.includes('pastry'))
        return '12.0503'; // Culinary Arts
    if (t.includes('hospitality'))
        return '52.1903';
    if (t.includes('tourism'))
        return '52.1902';
    if (t.includes('hotel operations') || t.includes('hotel'))
        return '52.1903';
    if (t.includes('event planning'))
        return '52.1904'; // Meeting/Event Planning

    // ── Computer Science / Software ──────────────────────────────────────────
    if (t.includes('computer science') && (t.includes('bachelor') || t.includes('bsc')))
        return '11.0701'; // Computer Science (B.Sc.)
    if (t.includes('computer science'))
        return '11.0701';
    if (t.includes('software engineering') && t.includes('bachelor'))
        return '14.0903'; // Software Engineering (B.Eng.)
    if (t.includes('software engineering'))
        return '14.0903';
    if (t.includes('software development') || t.includes('software testing'))
        return '11.0201'; // Computer Programming
    if (t.includes('computer programming'))
        return '11.0201';
    if (t.includes('computer systems'))
        return '11.0501'; // Computer Systems Technology
    if (t.includes('web development') || t.includes('web application'))
        return '11.0801'; // Web Technologies
    if (t.includes('cloud computing'))
        return '11.1003'; // Cloud Computing
    if (t.includes('information technology networking') || t.includes('it networking'))
        return '11.0901'; // Data/Network Administration
    if (t.includes('information technology') && !t.includes('information and service'))
        return '11.0401'; // Information Technology
    if (t.includes('interactive media'))
        return '11.0801'; // Web Technologies / Interactive Media

    // ── Cybersecurity ────────────────────────────────────────────────────────
    if (t.includes('cybersecurity') || t.includes('cyber security'))
        return '11.1003'; // Cybersecurity

    // ── Artificial Intelligence / Data Science ───────────────────────────────
    if (t.includes('artificial intelligence') && t.includes('data science'))
        return '11.0102'; // AI & Data Science
    if (t.includes('artificial intelligence'))
        return '11.0102'; // AI
    if (t.includes('data science') || t.includes('big analytics'))
        return '11.0102'; // Data Science
    if (t.includes('data analytics'))
        return '11.0901'; // Data Analytics

    // ── Information Systems ──────────────────────────────────────────────────
    if (t.includes('information systems') && t.includes('analytics'))
        return '52.1201'; // MIS/Analytics
    if (t.includes('information systems'))
        return '52.1201';
    if (t.includes('information and service management') || t.includes('information and communications'))
        return '11.0501'; // Information/Service Management

    // ── Engineering ──────────────────────────────────────────────────────────
    if (t.includes('civil engineering') && !t.includes('technician'))
        return '14.0801'; // Civil Engineering
    if (t.includes('civil engineering technician') || t.includes('civil engineering tech'))
        return '15.0201'; // Civil Engineering Technology
    if (t.includes('construction engineering'))
        return '15.0201';
    if (t.includes('electrical engineering') && t.includes('automation') && !t.includes('technician'))
        return '14.1001'; // Electrical Engineering
    if (t.includes('electrical engineering technician') || t.includes('electrical engineering tech') || t.includes('electrical techniques'))
        return '15.0303'; // Electrical/Electronics Engineering Technology
    if (t.includes('mechanical engineering') && t.includes('energy') && !t.includes('technician'))
        return '14.1901'; // Mechanical Engineering
    if (t.includes('mechanical engineering technician') || t.includes('mechanical engineering tech') || t.includes('mechanical technician') || t.includes('mechanical foundations'))
        return '15.0805'; // Mechanical Engineering Technology
    if (t.includes('chemical') && t.includes('metallurgical') && !t.includes('technician'))
        return '14.0701'; // Chemical Engineering
    if (t.includes('electronics') && t.includes('nanoengineering'))
        return '14.1001'; // Electronics & Nanoengineering
    if (t.includes('industrial engineering'))
        return '14.3501'; // Industrial Engineering
    if (t.includes('robotics') || t.includes('mechatronics'))
        return '15.0405'; // Robotics/Mechatronics
    if (t.includes('automation'))
        return '15.0406'; // Automation Technology
    if (t.includes('welding'))
        return '48.0508'; // Welding Technology
    if (t.includes('carpentry'))
        return '46.0201'; // Carpentry

    // ── Architecture / Design ────────────────────────────────────────────────
    if (t.includes('bachelor of architecture') || (t.includes('architecture') && t.includes('b.arch')))
        return '04.0201'; // Architecture (B.Arch.)
    if (t.includes('architectural technology') || t.includes('architectural tech'))
        return '04.0301'; // Architectural Technology/Technician
    if (t.includes('design') && (t.includes('bachelor') || t.includes('advanced')) && !t.includes('graphic') && !t.includes('interior'))
        return '50.0408'; // Design (general)
    if (t.includes('interior design'))
        return '50.0408'; // Interior Design
    if (t.includes('graphic design') || t.includes('graphic design fundamentals'))
        return '50.0409'; // Graphic Design
    if (t.includes('urban planning') || t.includes('smart city'))
        return '04.0301'; // Planning — also 05.0299 in Canada
    if (t.includes('industrial') && t.includes('product design'))
        return '50.0411'; // Industrial Design

    // ── Arts / Media / Film ──────────────────────────────────────────────────
    if (t.includes('film') && t.includes('television') && (t.includes('bachelor') || t.includes('advanced')))
        return '50.0602'; // Film/Cinema/Video Studies
    if (t.includes('film and television') || t.includes('film production') || t.includes('broadcasting'))
        return '50.0602'; // Film/TV
    if (t.includes('art and media') || t.includes('art media'))
        return '50.0101'; // Visual & Performing Arts
    if (t.includes('fine arts'))
        return '50.0702'; // Fine/Studio Arts
    if (t.includes('animation'))
        return '50.0411'; // Design/Animation
    if (t.includes('digital photography'))
        return '50.0605'; // Photography
    if (t.includes('broadcasting'))
        return '09.0101'; // Communication/Journalism

    // ── Health Sciences ──────────────────────────────────────────────────────
    if (t.includes('nursing') && t.includes('bscn'))
        return '51.1613'; // Nursing Science (B.Sc.N.)
    if (t.includes('practical nursing') || (t.includes('nursing') && !t.includes('bachelor')))
        return '51.1601'; // Licensed Practical Nurse Training
    if (t.includes('nursing') && t.includes('bachelor'))
        return '51.1613';
    if (t.includes('dental hygiene'))
        return '51.0602'; // Dental Hygiene/Hygienist
    if (t.includes('pharmacy technician'))
        return '51.2002'; // Pharmacy Tech
    if (t.includes('physiotherapist assistant') || t.includes('occupational therapist assistant'))
        return '51.0806'; // Physical Therapy Technician
    if (t.includes('personal support worker') || t.includes('community support worker'))
        return '51.2601'; // Health Aide
    if (t.includes('medical office administration'))
        return '51.0710'; // Medical Admin/Secretary
    if (t.includes('mental health') || t.includes('addictions'))
        return '51.1502'; // Psychiatric/Mental Health Tech
    if (t.includes('global health') || t.includes('public health'))
        return '51.2201'; // Public Health
    if (t.includes('health sciences') && t.includes('bachelor'))
        return '51.0000'; // Health Sciences (general)
    if (t.includes('health care administration') || t.includes('health admin'))
        return '51.0701'; // Health/Medical Admin
    if (t.includes('kinesiology'))
        return '31.0505'; // Kinesiology & Exercise Science
    if (t.includes('biomedical') || t.includes('biotechnology'))
        return '26.0102'; // Biomedical Sciences
    if (t.includes('developmental services'))
        return '44.0000'; // Social/Community Services

    // ── Social Sciences / Education / Law ────────────────────────────────────
    if (t.includes('social work') && t.includes('bachelor'))
        return '44.0701'; // Social Work (B.S.W.)
    if (t.includes('social work'))
        return '44.0799'; // Social Work
    if (t.includes('social service worker') || t.includes('social service'))
        return '44.0799';
    if (t.includes('community and justice') || t.includes('community services'))
        return '43.0103'; // Criminal Justice/Safety Studies
    if (t.includes('child and youth') || t.includes('child youth'))
        return '19.0709'; // Child Development
    if (t.includes('early childhood education'))
        return '13.1210'; // Early Childhood Education
    if (t.includes('educational assistant'))
        return '13.1099'; // Educational Support
    if (t.includes('paralegal') || t.includes('legal studies'))
        return '22.0302'; // Legal Assistant/Paralegal
    if (t.includes('psychology') && t.includes('bachelor'))
        return '42.0101'; // Psychology (B.A.)
    if (t.includes('psychology'))
        return '42.0101';
    if (t.includes('sociology'))
        return '45.1101'; // Sociology
    if (t.includes('economics'))
        return '45.0601'; // Economics
    if (t.includes('public policy') || t.includes('governance') || t.includes('international affairs'))
        return '44.0401'; // Public Administration
    if (t.includes('interdisciplinary'))
        return '30.0101'; // Multi/Interdisciplinary Studies

    // ── Sciences ─────────────────────────────────────────────────────────────
    if (t.includes('chemistry') && t.includes('materials') && t.includes('bachelor'))
        return '40.0501'; // Chemistry
    if (t.includes('chemistry') && t.includes('materials'))
        return '40.0501';
    if (t.includes('applied physics') || (t.includes('physics') && !t.includes('applied')))
        return '40.0801'; // Physics
    if (t.includes('mathematics') && t.includes('systems') && t.includes('bachelor'))
        return '27.0101'; // Mathematics
    if (t.includes('mathematics') && t.includes('systems'))
        return '27.0101';
    if (t.includes('applied mathematics') || t.includes('mathematics'))
        return '27.0301'; // Applied Mathematics
    if (t.includes('environmental science') || t.includes('environmental') && t.includes('sustainability'))
        return '03.0103'; // Environmental Studies
    if (t.includes('environmental technician') || t.includes('environmental management'))
        return '03.0101'; // Natural Resources/Environmental Mgmt
    if (t.includes('horticulture'))
        return '01.0601'; // Horticulture Science

    // ── Agriculture ──────────────────────────────────────────────────────────
    if (t.includes('agriculture technology') || t.includes('sustainable agriculture'))
        return '01.0000'; // Agriculture, General
    if (t.includes('agriculture'))
        return '01.0000';

    // ── Aviation / Transportation ─────────────────────────────────────────────
    if (t.includes('aviation management'))
        return '49.0101'; // Aviation/Airway Management
    if (t.includes('aircraft maintenance'))
        return '47.0608'; // Aircraft Powerplant Technology
    if (t.includes('flight services'))
        return '49.0101';
    if (t.includes('automotive service') || t.includes('automotive'))
        return '47.0604'; // Automobile Technician

    // ── Language / Communications ─────────────────────────────────────────────
    if (t.includes('language') && t.includes('intercultural'))
        return '16.0101'; // Foreign Languages & Literatures

    // ── Leadership / General ─────────────────────────────────────────────────
    if (t.includes('leadership development'))
        return '52.0201'; // Management/Leadership

    // Fallback
    return '52.9999'; // Business/Management (general fallback)
}

async function main() {
    await client.connect();
    console.log('✅ Connected to database');

    // Step 1: Add cip_code column if it doesn't exist
    console.log('\n📋 Step 1: Adding cip_code column (if not exists)...');
    await client.query(`
        ALTER TABLE "Course" 
        ADD COLUMN IF NOT EXISTS cip_code TEXT;
    `);
    console.log('✅ cip_code column ready');

    // Step 2: Fetch all courses
    console.log('\n📋 Step 2: Fetching all courses...');
    const result = await client.query(`
        SELECT id, title, "degreeLevel", slug 
        FROM "Course" 
        ORDER BY title
    `);
    const courses = result.rows;
    console.log(`Found ${courses.length} courses`);

    // Step 3: Update each course with its CIP code
    console.log('\n📋 Step 3: Assigning Canadian CIP 2021 codes...\n');
    let updated = 0;
    let errors = 0;

    for (const course of courses) {
        const cipCode = assignCIPCode(course.title, course.degreeLevel);
        try {
            await client.query(
                `UPDATE "Course" SET cip_code = $1 WHERE id = $2`,
                [cipCode, course.id]
            );
            console.log(`  ✅ ${cipCode} → ${course.title} (${course.degreeLevel})`);
            updated++;
        } catch (e) {
            console.error(`  ❌ Failed: ${course.title} — ${e.message}`);
            errors++;
        }
    }

    console.log(`\n🎉 Done! Updated: ${updated}, Errors: ${errors}`);

    // Step 4: Verify a sample
    console.log('\n📋 Step 4: Verification sample (first 10):');
    const verify = await client.query(`
        SELECT title, cip_code, "degreeLevel" 
        FROM "Course" 
        WHERE cip_code IS NOT NULL 
        ORDER BY title 
        LIMIT 10
    `);
    verify.rows.forEach(r => console.log(`  ${r.cip_code}  ${r.title} [${r.degreeLevel}]`));

    // Stats
    const stats = await client.query(`
        SELECT COUNT(*) as total,
               COUNT(cip_code) as with_cip,
               COUNT(DISTINCT cip_code) as unique_cip_codes
        FROM "Course"
    `);
    console.log('\n📊 Stats:', stats.rows[0]);

    await client.end();
}

main().catch(async (e) => {
    console.error('Fatal error:', e.message);
    await client.end();
    process.exit(1);
});
