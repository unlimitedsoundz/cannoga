require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const certificateFeesContent = `<p class="text-black mb-6 font-medium">Annual tuition fee and deposit for Certificate programs (6 months – 1 year)</p>
<div class="rounded-xl overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead class="bg-black text-white"><tr><th class="p-4 font-bold">Student Residency</th><th class="p-4 font-bold">Tuition Fee / Year</th><th class="p-4 font-bold">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">Domestic Students</td><td class="p-4">$3,500</td><td class="p-4">$750</td></tr>
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">International Students</td><td class="p-4">$9,500</td><td class="p-4">$2,500</td></tr>
        </tbody>
    </table>
</div>`;

const diplomaFeesContent = `<p class="text-black mb-6 font-medium">Annual tuition fee and deposit for Diploma and Advanced Diploma programs (2 – 3 years)</p>
<div class="rounded-xl overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead class="bg-black text-white"><tr><th class="p-4 font-bold">Student Residency</th><th class="p-4 font-bold">Tuition Fee / Year</th><th class="p-4 font-bold">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">Domestic Students</td><td class="p-4">$3,500</td><td class="p-4">$750</td></tr>
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">International Students</td><td class="p-4">$9,500</td><td class="p-4">$2,500</td></tr>
        </tbody>
    </table>
</div>`;

const bachelorFeesContent = `<p class="text-black mb-6 font-medium">Annual tuition fee and deposit for Bachelor's degree programs (4-year programs)</p>
<div class="rounded-xl overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead class="bg-black text-white"><tr><th class="p-4 font-bold">Student Residency</th><th class="p-4 font-bold">Tuition Fee / Year</th><th class="p-4 font-bold">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">Domestic Students</td><td class="p-4">$6,200</td><td class="p-4">$1,250</td></tr>
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">International Students</td><td class="p-4">$12,500</td><td class="p-4">$3,500</td></tr>
        </tbody>
    </table>
</div>`;

const masterFeesContent = `<p class="text-black mb-6 font-medium">Annual tuition fee and deposit for Master's degree programs (2-year programs)</p>
<div class="rounded-xl overflow-hidden">
    <table class="w-full text-left border-collapse">
        <thead class="bg-black text-white"><tr><th class="p-4 font-bold">Student Residency</th><th class="p-4 font-bold">Tuition Fee / Year</th><th class="p-4 font-bold">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">Domestic Students</td><td class="p-4">$8,500</td><td class="p-4">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="p-4 font-medium">International Students</td><td class="p-4">$18,000</td><td class="p-4">$5,000</td></tr>
        </tbody>
    </table>
</div>`;

const sections = [
  { key: 'certificate_fees_content', content: certificateFeesContent },
  { key: 'diploma_fees_content', content: diplomaFeesContent },
  { key: 'bachelor_fees_content', content: bachelorFeesContent },
  { key: 'master_fees_content', content: masterFeesContent },
];

async function updateDatabase() {
  for (const section of sections) {
    console.log(`Processing ${section.key}...`);

    // Check if row exists
    const { data: existing } = await supabase
      .from('page_content')
      .select('id')
      .eq('page_slug', 'admissions/tuition')
      .eq('section_key', section.key)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('page_content')
        .update({ content: section.content })
        .eq('page_slug', 'admissions/tuition')
        .eq('section_key', section.key);
      if (error) console.error(`  ✗ Update error:`, error.message);
      else console.log(`  ✓ Updated`);
    } else {
      const { error } = await supabase
        .from('page_content')
        .insert({ page_slug: 'admissions/tuition', section_key: section.key, content: section.content });
      if (error) console.error(`  ✗ Insert error:`, error.message);
      else console.log(`  ✓ Inserted`);
    }
  }

  console.log("\nAll done.");
}

updateDatabase();
