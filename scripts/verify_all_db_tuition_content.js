const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const updatedFeeSections = {
    certificate_fees_content: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Certificate programs (6 months – 1 year)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$3,500</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$9,500</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    diploma_fees_content: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Diploma and Advanced Diploma programs (2 – 3 years)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$3,500</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$9,500</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    bachelor_fees_content: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Bachelor's degree programs (4-year programs)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$4,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    master_fees_content: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Master's degree programs (2-year programs)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$8,500</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$18,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`
};

async function run() {
    console.log('Upserting updated tuition fee tables to page_content in Supabase DB...');
    for (const [sectionKey, content] of Object.entries(updatedFeeSections)) {
        const { error } = await supabase
            .from('page_content')
            .upsert({
                page_slug: 'admissions/tuition',
                section_key: sectionKey,
                content: content
            }, { onConflict: 'page_slug,section_key' });

        if (error) {
            console.error(`Error updating ${sectionKey}:`, error);
        } else {
            console.log(`✅ Successfully updated ${sectionKey} in page_content table!`);
        }
    }
    console.log('All tuition DB content synchronized successfully.');
    process.exit(0);
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
