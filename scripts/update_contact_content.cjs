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
    const newContent = `<p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed mb-6">If you have questions about payment processes, deadlines, or refunds, contact the Tuition Fee Office.</p><a href="mailto:admissions@cannogacollege.ca" class="inline-flex items-center gap-2 bg-[#0a151a] !text-white text-white px-6 py-3 font-bold hover:bg-slate-800 hover:!text-white transition-colors shadow-sm">Contact Tuition Office &rarr;</a>`;

    const { data, error } = await supabase
        .from('page_content')
        .update({ content: newContent })
        .match({ page_slug: 'admissions/tuition', section_key: 'contact_content' })
        .select();

    if (error) {
        console.log('Update error on PageContent:', error.message);
    } else {
        console.log('Updated PageContent rows:', data);
    }
}

run();
