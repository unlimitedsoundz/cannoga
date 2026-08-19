const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateDbAfter() {
  const newAfterContent = `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Once you receive your Letter of Acceptance, complete the following onboarding steps to secure your study place:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li>Accept your offer in the student portal before the stated deadline.</li>
        <li>Pay tuition fees and obtain your Provincial Attestation Letter (PAL).</li>
        <li>Apply for your Canadian Study Permit and arrange accommodation in Ottawa.</li>
        <li>Complete online orientation and semester course registration.</li>
    </ul>
    <div class="pt-2">
        <a href="/student-guide/international" class="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline hover:text-[#002f6c] transition-colors">Open International Student Guide &rarr;</a>
    </div>
</div>`;

  const res = await supabase
    .from('page_content')
    .update({ content: newAfterContent, updated_at: new Date().toISOString() })
    .eq('id', 24);
  console.log('Update ID 24 (after_content):', res.error || 'Success');
}

updateDbAfter();
