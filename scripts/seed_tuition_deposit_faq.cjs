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

async function seedFaqs() {
    console.log('Seeding $2,000 Tuition Deposit FAQs into database...');

    const tuitionFaqs = [
        {
            question: 'What is the tuition deposit amount?',
            answer: 'The confirmation tuition deposit is $2,000 CAD across all programs (Bachelor’s, Master’s, Diplomas, and Certificates). This deposit confirms your acceptance, reserves your seat in your chosen cohort, initiates the issuance of your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL) for international candidates, and is credited 100% directly towards your first-term tuition balance.',
            category: 'Tuition & Fees',
            status: 'published',
            display_order: 1
        },
        {
            question: 'How much is the deposit required to receive a Provincial Attestation Letter (PAL)?',
            answer: 'A tuition deposit of $2,000 CAD is required to secure your offer of admission and initiate the Provincial Attestation Letter (PAL) process for international students. Once paid and verified, the PAL processing begins immediately.',
            category: 'Admissions & PAL',
            status: 'published',
            display_order: 2
        },
        {
            question: 'Is the $2,000 CAD tuition deposit refundable?',
            answer: 'The $2,000 CAD tuition deposit is generally non-refundable as it reserves your institutional placement. However, in accordance with Cannoga College refund policy, if an international applicant receives an official Study Permit / Visa refusal from Immigration, Refugees and Citizenship Canada (IRCC), the entire prepaid tuition and deposit are refunded in full, less a standard $100 CAD administrative processing fee, upon submission of the official IRCC refusal letter within 14 calendar days.',
            category: 'Refunds & Withdrawals',
            status: 'published',
            display_order: 3
        }
    ];

    // 1. Check & Insert into `faqs` table
    console.log('\n--- Checking `faqs` table ---');
    try {
        const { data: existingFaqs, error: fetchErr } = await supabase.from('faqs').select('id, question');
        if (fetchErr) {
            console.log('Error querying `faqs`:', fetchErr.message);
        } else {
            console.log(`Found ${existingFaqs.length} existing FAQs in \`faqs\` table`);
            for (const faq of tuitionFaqs) {
                const match = existingFaqs.find(f => f.question.toLowerCase() === faq.question.toLowerCase());
                if (match) {
                    console.log(`Updating existing FAQ: "${faq.question}" (id: ${match.id})`);
                    const { error: updateErr } = await supabase.from('faqs').update({
                        answer: faq.answer,
                        category: faq.category,
                        status: faq.status,
                        updated_at: new Date().toISOString()
                    }).eq('id', match.id);
                    if (updateErr) console.error('Update error:', updateErr.message);
                    else console.log('✓ Successfully updated in `faqs`');
                } else {
                    console.log(`Inserting new FAQ: "${faq.question}"`);
                    const { error: insertErr } = await supabase.from('faqs').insert([faq]);
                    if (insertErr) console.error('Insert error:', insertErr.message);
                    else console.log('✓ Successfully inserted into `faqs`');
                }
            }
        }
    } catch (err) {
        console.error('Error on `faqs` table:', err.message);
    }

    // 2. Check & Insert into `voice_agent_faqs` table
    console.log('\n--- Checking `voice_agent_faqs` table ---');
    try {
        const { data: existingVoiceFaqs, error: vFetchErr } = await supabase.from('voice_agent_faqs').select('id, question');
        if (vFetchErr) {
            console.log('Error querying `voice_agent_faqs`:', vFetchErr.message);
        } else {
            console.log(`Found ${existingVoiceFaqs ? existingVoiceFaqs.length : 0} existing FAQs in \`voice_agent_faqs\` table`);
            for (const faq of tuitionFaqs) {
                const match = (existingVoiceFaqs || []).find(f => f.question.toLowerCase() === faq.question.toLowerCase());
                const payload = {
                    question: faq.question,
                    answer: faq.answer,
                    category: faq.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                    active: true,
                    priority: faq.display_order || 1,
                    updated_at: new Date().toISOString()
                };

                if (match) {
                    console.log(`Updating voice agent FAQ: "${faq.question}"`);
                    const { error: vUpdateErr } = await supabase.from('voice_agent_faqs').update(payload).eq('id', match.id);
                    if (vUpdateErr) console.error('Update error:', vUpdateErr.message);
                    else console.log('✓ Successfully updated in `voice_agent_faqs`');
                } else {
                    console.log(`Inserting voice agent FAQ: "${faq.question}"`);
                    const { error: vInsertErr } = await supabase.from('voice_agent_faqs').insert([payload]);
                    if (vInsertErr) console.error('Insert error:', vInsertErr.message);
                    else console.log('✓ Successfully inserted in `voice_agent_faqs`');
                }
            }
        }
    } catch (err) {
        console.error('Error on `voice_agent_faqs` table:', err.message);
    }

    console.log('\nDATABASE SEEDING COMPLETE!');
}

seedFaqs();
