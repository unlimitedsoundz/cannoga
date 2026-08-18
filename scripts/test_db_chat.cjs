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
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing Supabase queries...');
    const [faqsRes, schoolsRes, coursesRes, pageContentRes] = await Promise.all([
        supabase.from('faqs').select('id, question, answer, category').limit(50),
        supabase.from('School').select('id, name, slug, description').limit(20),
        supabase.from('Course').select('id, title, code, credits').limit(30),
        supabase.from('page_content').select('page_slug, section_key, content').limit(20)
    ]);

    console.log(`FAQs count:`, faqsRes.data?.length || 0);
    console.log(`Schools count:`, schoolsRes.data?.length || 0);
    console.log(`Courses count:`, coursesRes.data?.length || 0);
    console.log(`PageContent count:`, pageContentRes.data?.length || 0);
}

test();
