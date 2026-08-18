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

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateFaqs() {
    console.log('Updating "Is there a tuition deposit required?" across database tables...');

    const updatedAnswer = `Yes. A non-refundable confirmation tuition deposit of $2,000 CAD is required across all programs to secure your place in the program after you receive an offer of admission.

This deposit is fully credited (100%) toward your first-year tuition fee and is required to initiate the issuance of your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL) where applicable. The deposit amount ($2,000 CAD) and the deadline for payment are clearly outlined in your official Admission Letter and accepted offer details in the applicant portal.`;

    const updatedAnswerHtml = `<div className="space-y-4">
        <p>Yes. A non-refundable confirmation tuition deposit of <strong>$2,000 CAD</strong> is required across all programs to secure your place in the program after you receive an offer of admission.</p>
        <p>This deposit is fully credited (100%) toward your first-year tuition fee and is required to initiate the issuance of your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL) where applicable. The deposit amount ($2,000 CAD) and the deadline for payment are clearly outlined in your official Admission Letter and accepted offer details in the applicant portal.</p>
    </div>`;

    // 1. Table `faq` (if exists)
    try {
        const { data: faqRows, error: faqErr } = await supabase.from('faq').select('id, question, answer');
        if (!faqErr && faqRows) {
            console.log(`Found ${faqRows.length} rows in \`faq\` table`);
            const matches = faqRows.filter(f => f.question.toLowerCase().includes('tuition deposit required'));
            for (const m of matches) {
                console.log(`Updating \`faq\` row ID: ${m.id} (${m.question})`);
                await supabase.from('faq').update({ answer: updatedAnswerHtml }).eq('id', m.id);
                console.log('✓ Updated `faq` row');
            }
        }
    } catch (e) {
        console.log('`faq` table query notice:', e.message);
    }

    // 2. Table `faqs`
    try {
        const { data: faqsRows, error: faqsErr } = await supabase.from('faqs').select('id, question, answer');
        if (!faqsErr && faqsRows) {
            console.log(`Found ${faqsRows.length} rows in \`faqs\` table`);
            const matches = faqsRows.filter(f => f.question.toLowerCase().includes('tuition deposit'));
            for (const m of matches) {
                console.log(`Found match in \`faqs\`: "${m.question}" (id: ${m.id})`);
            }

            const depositRequired = faqsRows.filter(f => f.question.toLowerCase().includes('tuition deposit required') || f.question.toLowerCase().includes('deposit amount'));
            for (const m of depositRequired) {
                console.log(`Updating \`faqs\` row ID: ${m.id} (${m.question})`);
                await supabase.from('faqs').update({
                    answer: updatedAnswer,
                    updated_at: new Date().toISOString()
                }).eq('id', m.id);
                console.log('✓ Updated `faqs` row');
            }

            // Also ensure "Is there a tuition deposit required?" exists
            const exact = faqsRows.find(f => f.question.toLowerCase() === 'is there a tuition deposit required?');
            if (!exact) {
                console.log('Inserting "Is there a tuition deposit required?" into `faqs` table...');
                await supabase.from('faqs').insert([{
                    question: 'Is there a tuition deposit required?',
                    answer: updatedAnswer,
                    category: 'Tuition & Fees',
                    status: 'published',
                    display_order: 1
                }]);
                console.log('✓ Inserted into `faqs`');
            }
        }
    } catch (e) {
        console.log('`faqs` table query notice:', e.message);
    }

    // 3. Table `voice_agent_faqs`
    try {
        const { data: voiceRows, error: vErr } = await supabase.from('voice_agent_faqs').select('id, question, answer');
        if (!vErr && voiceRows) {
            console.log(`Found ${voiceRows.length} rows in \`voice_agent_faqs\` table`);
            const exact = voiceRows.find(f => f.question.toLowerCase() === 'is there a tuition deposit required?');
            if (exact) {
                console.log(`Updating \`voice_agent_faqs\` row ID: ${exact.id}`);
                await supabase.from('voice_agent_faqs').update({
                    answer: updatedAnswer,
                    updated_at: new Date().toISOString()
                }).eq('id', exact.id);
                console.log('✓ Updated `voice_agent_faqs`');
            } else {
                console.log('Inserting into `voice_agent_faqs`...');
                await supabase.from('voice_agent_faqs').insert([{
                    question: 'Is there a tuition deposit required?',
                    answer: updatedAnswer,
                    category: 'tuition',
                    active: true,
                    priority: 1,
                    updated_at: new Date().toISOString()
                }]);
                console.log('✓ Inserted into `voice_agent_faqs`');
            }
        }
    } catch (e) {
        console.log('`voice_agent_faqs` query notice:', e.message);
    }

    console.log('\nAll tuition deposit FAQ answers updated successfully in DB!');
}

updateFaqs();
