const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('1. Pushing tuition hero_video_url to page_content table...');
    
    const videoUrl = '/videos/wan2.6-t2v_a_%23_Tuition_Fees_Video.mp4';

    const { data, error: upsertErr } = await supabase
        .from('page_content')
        .upsert({
            page_slug: 'admissions/tuition',
            section_key: 'hero_video_url',
            content: videoUrl,
        }, { onConflict: 'page_slug,section_key' });

    if (upsertErr) {
        console.error('Error upserting hero_video_url to page_content:', upsertErr);
    } else {
        console.log('✅ tuition hero_video_url successfully pushed to page_content table!');
    }

    console.log('\n2. Cleaning EU wording from DB FAQs...');
    const { data: faqs, error: faqErr } = await supabase
        .from('faq')
        .select('id, question, answer');

    if (faqErr) {
        console.error('Error fetching FAQs:', faqErr);
        process.exit(1);
    }

    let updatedCount = 0;

    for (const item of (faqs || [])) {
        let question = item.question || '';
        let answer = item.answer || '';

        const hasEuWording = /European Union|European Economic Area|EU\/EEA|non-EU|P-EU|EU Blue Card|EHIC|EU citizens|EU study permit/i.test(question + ' ' + answer);

        if (hasEuWording) {
            let newAnswer = answer
                .replace(/In accordance with Canadian legislation, tuition fees are mandatory for students who are <strong>not citizens<\/strong> of the European Union \(EU\), European Economic Area \(EEA\), or Switzerland, and who are enrolled in English-taught Bachelor''s or Master''s degree programmes\./gi, 'In accordance with Canadian provincial legislation, tuition fees are mandatory for international students enrolled in postsecondary degree, diploma, or certificate programmes at Cannoga College.')
                .replace(/In accordance with Canadian legislation, tuition fees are mandatory for students who are <strong>not citizens<\/strong> of the European Union \(EU\), European Economic Area \(EEA\), or Switzerland, and who are enrolled in English-taught Bachelor's or Master's degree programmes\./gi, 'In accordance with Canadian provincial legislation, tuition fees are mandatory for international students enrolled in postsecondary degree, diploma, or certificate programmes at Cannoga College.')
                .replace(/European Union \(EU\), European Economic Area \(EEA\), or Switzerland/gi, 'Canada')
                .replace(/European Union \(EU\)/gi, 'Canada')
                .replace(/European Economic Area \(EEA\)/gi, 'Canada')
                .replace(/European Economic Area/gi, 'Canada')
                .replace(/European Union/gi, 'Canada')
                .replace(/EU\/EEA/gi, 'Domestic')
                .replace(/<li>A permanent Canadian study permit \(P\)<\/li>/gi, '<li>A Canadian citizen</li>')
                .replace(/<li>A long-term resident's EU study permit \(P-EU\)<\/li>/gi, '<li>A Permanent Resident (PR) of Canada</li>')
                .replace(/<li>A continuous study permit \(A\) issued on grounds other than study<\/li>/gi, '<li>A protected person or convention refugee in Canada</li>')
                .replace(/<li>An EU Blue Card issued in Canada<\/li>/gi, '<li>A holder of an eligible diplomatic or work authorization exemption</li>')
                .replace(/<li>An EU Family Member's Residence Card<\/li>/gi, '')
                .replace(/long-term resident's EU study permit \(P-EU\)/gi, 'Permanent Resident (PR) status')
                .replace(/EU study permit/gi, 'Canadian study permit')
                .replace(/EU Blue Card issued in Canada/gi, 'Canadian Work Permit')
                .replace(/EU Family Member's Residence Card/gi, 'Canadian Permanent Resident card')
                .replace(/P-EU/gi, 'PR')
                .replace(/<strong>European Health Insurance Card \(EHIC\):<\/strong> For EU citizens/gi, '<strong>College Student Health Plan:</strong> Included with tuition for full-time international students')
                .replace(/European Health Insurance Card \(EHIC\)/gi, 'provincial health insurance')
                .replace(/Canada\/Swiss citizens: No visa required, but must register residence/gi, 'Canadian citizens & Permanent Residents: No study permit required')
                .replace(/EU citizens/gi, 'Domestic students')
                .replace(/non-EU/gi, 'international');

            let newQuestion = question
                .replace(/EU\/EEA/gi, 'Domestic')
                .replace(/non-EU/gi, 'international');

            const { error: updateErr } = await supabase
                .from('faq')
                .update({ question: newQuestion, answer: newAnswer })
                .eq('id', item.id);

            if (updateErr) {
                console.error(`Failed to update FAQ ${item.id}:`, updateErr);
            } else {
                console.log(`✅ Updated FAQ ${item.id}: ${newQuestion.substring(0, 50)}`);
                updatedCount++;
            }
        }
    }

    console.log(`\n✅ Completed FAQ cleanup: ${updatedCount} FAQs updated in DB.`);
    process.exit(0);
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
