const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    console.log('Updating database timing_content & FAQs...');

    const newTimingContent = `<div class="space-y-6">
    <div class="space-y-2">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">First Academic Year</h3>
        <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
            After accepting the admission offer, pay your tuition deposit of $2,000 CAD.
        </p>
    </div>

    <div class="space-y-2 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">After the First Year</h3>
        <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
            Students are encouraged to pay the full fee in one instalment during the annual enrolment period. Alternatively, two instalments may be allowed, but this can affect your attendance status.
        </p>
        <p class="text-xs sm:text-sm font-semibold text-slate-800 pt-1">
            Important: Non-attending status may affect visa or study permit conditions.
        </p>
    </div>

    <div class="pt-4 border-t border-slate-200">
        <p class="text-xs sm:text-sm font-medium text-slate-600">
            For further details, consult the official Cannoga College enrolment guidelines.
        </p>
    </div>
</div>`;

    // 1. Update `page_content`
    const { data: pcData, error: pcErr } = await supabase
        .from('page_content')
        .update({ content: newTimingContent })
        .match({ page_slug: 'admissions/tuition', section_key: 'timing_content' })
        .select();

    if (pcErr) {
        console.error('Error updating page_content:', pcErr.message);
    } else {
        console.log('✓ Successfully updated page_content timing_content:', pcData?.length || 0, 'rows');
    }

    // 2. Update `faq` table if question "Can I pay in instalments?" exists
    const newInstalmentAnswer = `<div className="space-y-4">
        <p>After accepting your offer of admission, you are required to pay the <strong>$2,000 CAD confirmation tuition deposit</strong> to secure your seat and initiate the Provincial Attestation Letter (PAL) issuance. The deposit is credited 100% towards your first-term tuition balance.</p>
        <p>For remaining tuition balances and subsequent semesters, flexible payment options and semester-based installments are available. Contact the Registrar or review your accepted offer details in the student portal for personalized payment schedules.</p>
    </div>`;

    try {
        const { data: faqList } = await supabase.from('faq').select('id, question');
        if (faqList) {
            const matches = faqList.filter(f => f.question.toLowerCase().includes('instalment'));
            for (const m of matches) {
                console.log(`Updating \`faq\` row ID: ${m.id} (${m.question})`);
                await supabase.from('faq').update({ answer: newInstalmentAnswer }).eq('id', m.id);
                console.log('✓ Updated `faq` row');
            }
        }
    } catch (e) {
        console.log('`faq` notice:', e.message);
    }

    // 3. Update `faqs` table
    try {
        const { data: faqsList } = await supabase.from('faqs').select('id, question');
        if (faqsList) {
            const matches = faqsList.filter(f => f.question.toLowerCase().includes('instalment'));
            for (const m of matches) {
                console.log(`Updating \`faqs\` row ID: ${m.id} (${m.question})`);
                await supabase.from('faqs').update({
                    answer: 'After accepting your offer of admission, pay your confirmation tuition deposit of $2,000 CAD to secure your seat and initiate PAL issuance. The deposit is credited 100% towards your first-term tuition. Flexible semester-based installment options are available for subsequent term balances.',
                    updated_at: new Date().toISOString()
                }).eq('id', m.id);
                console.log('✓ Updated `faqs` row');
            }
        }
    } catch (e) {
        console.log('`faqs` notice:', e.message);
    }

    console.log('All updates complete!');
}

run();
