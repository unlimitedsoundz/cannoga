import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTable(tableName: string, rows: any[]) {
    console.log(`Seeding ${tableName}...`);
    
    // Delete existing data first to ensure clean state
    const { error: deleteError } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.log(`  Warning: could not clear ${tableName}: ${deleteError.message}`);
    }
    
    // Insert fresh data
    const { data, error } = await supabase.from(tableName).insert(rows).select();
    
    if (error) {
        console.log(`  ❌ Failed: ${error.message}`);
        return [] as any[];
    }
    
    console.log(`  ✅ Inserted ${data?.length || 0} rows`);
    return data || [];
}

async function main() {
    console.log('🌱 Starting Cannoga College comprehensive seed...\n');

    // 1. Seed FAQ Pages
    const faqPages = await seedTable('faq_pages', [
        { name: 'General FAQ', slug: 'general' },
        { name: 'Admissions FAQ', slug: 'admissions' },
        { name: 'International Students FAQ', slug: 'international-students' },
        { name: 'Housing FAQ', slug: 'housing' },
        { name: 'Tuition & Fees FAQ', slug: 'tuition' },
    ]);

    // Create slug to ID mapping
    const faqPageSlugToId: Record<string, string> = {};
    for (const page of faqPages) {
        faqPageSlugToId[(page as any).slug] = (page as any).id;
    }

    // 2. Seed FAQs
    const faqRows = [
        { question: 'What is Cannoga College?', answer: 'Cannoga College is a career-focused college located in Ottawa, Ontario, Canada, offering certificate, diploma, and degree programs.', page_id: faqPageSlugToId['general'], order_index: 1 },
        { question: 'Where is Cannoga College located?', answer: 'Cannoga College is located at 81 Montreal Rd, Ottawa, Ontario K1L 6E8, Canada.', page_id: faqPageSlugToId['general'], order_index: 2 },
        { question: 'How do I apply to Cannoga College?', answer: 'You can apply online through our application portal. Create an account, select your program, and submit the required documents.', page_id: faqPageSlugToId['admissions'], order_index: 1 },
        { question: 'What are the admission requirements?', answer: 'Admission requirements vary by program. Generally, you need a high school diploma or equivalent, proof of English proficiency, and any program-specific requirements.', page_id: faqPageSlugToId['admissions'], order_index: 2 },
        { question: 'Do I need a study permit to study at Cannoga College?', answer: 'International students may need a Canadian study permit. Please verify current requirements with Immigration, Refugees and Citizenship Canada (IRCC).', page_id: faqPageSlugToId['international-students'], order_index: 1 },
        { question: 'Is Cannoga College a Designated Learning Institution (DLI)?', answer: 'Please confirm the current DLI status directly with Cannoga College and the appropriate Canadian authorities.', page_id: faqPageSlugToId['international-students'], order_index: 2 },
        { question: 'What housing options are available?', answer: 'Cannoga College offers on-campus housing through our residence buildings. Applications are processed on a first-come, first-served basis.', page_id: faqPageSlugToId['housing'], order_index: 1 },
        { question: 'How much does housing cost?', answer: 'Housing costs vary by room type and building. Please contact the housing office for current rates.', page_id: faqPageSlugToId['housing'], order_index: 2 },
        { question: 'What is the tuition fee?', answer: 'Tuition fees vary by program and student type (domestic vs international). Please check the specific program page for detailed tuition information.', page_id: faqPageSlugToId['tuition'], order_index: 1 },
        { question: 'Are there payment plans available?', answer: 'Payment plan options may be available. Please contact the admissions office for details.', page_id: faqPageSlugToId['tuition'], order_index: 2 },
    ];
    await seedTable('faq', faqRows);

    // 3. Seed Semesters
    await seedTable('semesters', [
        { id: 'sem-2026-fall', name: 'Fall 2026', start_date: '2026-09-01', end_date: '2026-12-15', status: 'UPCOMING' },
        { id: 'sem-2027-winter', name: 'Winter 2027', start_date: '2027-01-05', end_date: '2027-04-15', status: 'UPCOMING' },
    ]);

    // 4. Seed Modules
    await seedTable('modules', [
        { id: 'mod-101', code: 'BUS-101', title: 'Introduction to Business', description: 'Foundational business concepts including management, marketing, and finance.', credits: 5, department_id: 'd70f6b5a-44f6-4444-858a-ddf5991773b3' },
        { id: 'mod-102', code: 'MKT-201', title: 'Marketing Fundamentals', description: 'Principles of marketing, consumer behavior, and brand strategy.', credits: 5, department_id: 'd70f6b5a-44f6-4444-858a-ddf5991773b3' },
        { id: 'mod-103', code: 'CS-101', title: 'Programming Fundamentals', description: 'Introduction to programming using modern languages and tools.', credits: 5, department_id: '34e70ab3-d6f3-4751-947c-ef22cd5cf1e7' },
        { id: 'mod-104', code: 'NUR-101', title: 'Fundamentals of Nursing', description: 'Core nursing skills, patient care, and professional practice.', credits: 5, department_id: 'c7cb345f-6944-4946-b527-ff5fed0613bb' },
    ]);

    // 5. Seed Housing Buildings
    const buildings = await seedTable('housing_buildings', [
        { name: 'Cannoga Residence Hall A', campus_location: 'Main Campus', total_rooms: 120 },
        { name: 'Cannoga Residence Hall B', campus_location: 'Main Campus', total_rooms: 80 },
    ]);

    // 6. Seed Housing Rooms
    if (buildings.length >= 2) {
        await seedTable('housing_rooms', [
            { building_id: buildings[0].id, room_number: '101', capacity: 2, monthly_rate: 850, status: 'AVAILABLE', amenities: ['WiFi', 'Furnished', 'Shared Bathroom'] },
            { building_id: buildings[0].id, room_number: '102', capacity: 1, monthly_rate: 1200, status: 'AVAILABLE', amenities: ['WiFi', 'Furnished', 'Private Bathroom'] },
            { building_id: buildings[1].id, room_number: '201', capacity: 4, monthly_rate: 700, status: 'AVAILABLE', amenities: ['WiFi', 'Furnished', 'Kitchenette'] },
        ]);
    }

    // 7. Seed IT Assets
    await seedTable('it_assets', [
        { asset_type: 'LMS', name: 'Cannoga Learning Management System', description: 'Online learning platform for courses and assignments.', access_url: 'https://lms.cannogacollege.ca', auto_provision: true },
        { asset_type: 'EMAIL', name: 'Cannoga Student Email', description: 'Official institutional email account.', access_url: 'https://mail.cannogacollege.ca', auto_provision: true },
        { asset_type: 'LIBRARY', name: 'Cannoga Digital Library', description: 'Online library resources and databases.', access_url: 'https://library.cannogacollege.ca', auto_provision: true },
    ]);

    console.log('\n✅ Comprehensive seed complete!');
    console.log('\nSummary:');
    console.log('  - FAQ pages: 5');
    console.log('  - FAQs: 10');
    console.log('  - Semesters: 2');
    console.log('  - Modules: 4');
    console.log('  - Housing buildings: 2');
    console.log('  - Housing rooms: 3');
    console.log('  - IT assets: 3');
    console.log('\nNote: Applications, students, admission offers, tuition payments, housing applications, assignments, deposits, invoices, and payments require real user data and should be created through the application portal.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});