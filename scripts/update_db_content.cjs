const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateDb() {
  const newDecisionsContent = `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Only complete applications are evaluated based on programme-specific academic criteria. Decision results are published within less than a week of submitting your application.</p>
</div>`;

  const res1 = await supabase
    .from('page_content')
    .update({ content: newDecisionsContent, updated_at: new Date().toISOString() })
    .eq('id', 27);
  console.log('Update ID 27:', res1.error || 'Success');

  const newEvalContent = `<h2 class="text-3xl font-bold mb-8 text-black">Evaluation & Decisions</h2>
<div class="space-y-6">
    <p class="text-lg leading-relaxed">Only complete applications are evaluated based on programme-specific criteria. Decision results are published within less than a week of submitting your application.</p>
</div>`;

  const res2 = await supabase
    .from('page_content')
    .update({ content: newEvalContent, updated_at: new Date().toISOString() })
    .eq('id', 64);
  console.log('Update ID 64:', res2.error || 'Success');

  const newDocsMaster = `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Ensure all submitted documentation conforms to official verification standards:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Certified Educational Documents:</strong> Must be submitted during application in the upload section.</li>
        <li><strong class="text-slate-900 font-bold">Translations:</strong> Non-English/Non-English documents require official translations.</li>
        <li><strong class="text-slate-900 font-bold">Passport/ID:</strong> Color PDF of the personal information page.</li>
    </ul>
</div>`;

  const res3 = await supabase
    .from('page_content')
    .update({ content: newDocsMaster, updated_at: new Date().toISOString() })
    .eq('id', 38);
  console.log('Update ID 38:', res3.error || 'Success');

  const newDocsApp = `<div class="grid gap-6 md:grid-cols-2">
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Certified Educational Documents</h4><p class="text-sm">Must be submitted during application in the upload section.</p></div>
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Translations</h4><p class="text-sm">Non-English documents require official certified translations.</p></div>
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Passport</h4><p class="text-sm">Color PDF of the personal information page.</p></div>
</div>`;

  const res4 = await supabase
    .from('page_content')
    .update({ content: newDocsApp, updated_at: new Date().toISOString() })
    .eq('id', 40);
  console.log('Update ID 40:', res4.error || 'Success');
}

updateDb();
