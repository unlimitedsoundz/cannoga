const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function inspectStrict() {
    const { data: courses } = await supabase.from('Course').select('id, title, slug, sections');
    let escapedQuoteCount = 0;

    for (const c of courses ?? []) {
        if (!c.sections) continue;
        const sectionsArr = Array.isArray(c.sections) ? c.sections : JSON.parse(c.sections);
        for (const sec of sectionsArr) {
            if (
                sec.id?.includes('"') || sec.id?.includes('\\') ||
                sec.title?.includes('"') || sec.title?.includes('\\') ||
                sec.content?.includes('\\"') || sec.content?.startsWith('"')
            ) {
                escapedQuoteCount++;
                console.log(`Course [${c.slug}]: sec.id = ${JSON.stringify(sec.id)}, sec.title = ${JSON.stringify(sec.title)}`);
            }
        }
    }

    console.log(`Remaining courses with corrupted/escaped quotes or slashes: ${escapedQuoteCount}`);
}

inspectStrict();
