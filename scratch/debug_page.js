const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

function cleanHtml(str) {
    if (!str) return '';
    let val = str;
    let prev = '';
    while (val !== prev && typeof val === 'string') {
        prev = val;
        val = val.trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\\"') && val.endsWith('\\"'))) {
            try {
                const parsed = JSON.parse(val);
                if (typeof parsed === 'string') {
                    val = parsed;
                    continue;
                }
            } catch (e) {
                val = val.replace(/^(\\"|")+|(\\"|")+$/g, '');
            }
        }
        val = val
            .replace(/\\\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/^"+|"+$/g, '')
            .replace(/^\\+|\\+$/g, '');
    }
    return val.trim();
}

async function debugMba() {
    const { data: course, error } = await supabase
        .from('Course')
        .select(`
            *,
            school:School(*),
            department:Department(*),
            subjects:Subject(*)
        `)
        .eq('slug', 'mba')
        .single();

    if (error) {
        console.error('Error fetching course:', error);
        return;
    }

    console.log('Fetched course:', course.slug, course.title);
    const cleanedSections = (course.sections || []).map(section => ({
        ...section,
        id: cleanHtml(section.id),
        title: cleanHtml(section.title),
        content: cleanHtml(section.content)
    }));

    console.log('Cleaned sections count:', cleanedSections.length);
    console.log('Cleaned sections sample:', JSON.stringify(cleanedSections, null, 2));
}

debugMba();
