const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(url, key);

function cleanValue(val) {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'string') return val;
    let str = val;
    
    let prev = '';
    while (str !== prev && typeof str === 'string') {
        prev = str;
        str = str.trim();
        
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith('\\"') && str.endsWith('\\"'))) {
            try {
                const parsed = JSON.parse(str);
                if (typeof parsed === 'string') {
                    str = parsed;
                    continue;
                }
            } catch (e) {
                str = str.replace(/^(\\"|")+|(\\"|")+$/g, '');
            }
        }
        
        str = str.replace(/\\"/g, '"');
        str = str.replace(/\\\\/g, '\\');
        str = str.replace(/\\n/g, '\n');
        str = str.replace(/\\r/g, '\r');
        str = str.replace(/\\t/g, '\t');
        
        str = str.replace(/^"+|"+$/g, '');
        str = str.replace(/^\\+|\\+$/g, '');
    }
    
    return str.trim();
}

function cleanSection(section) {
    if (!section || typeof section !== 'object') return section;
    const cleaned = { ...section };
    if (cleaned.id) cleaned.id = cleanValue(cleaned.id);
    if (cleaned.title) cleaned.title = cleanValue(cleaned.title);
    if (cleaned.content) cleaned.content = cleanValue(cleaned.content);
    if (Array.isArray(cleaned.items)) {
        cleaned.items = cleaned.items.map(item => ({
            ...item,
            title: cleanValue(item.title),
            href: cleanValue(item.href)
        }));
    }
    return cleaned;
}

async function fixAllCourses() {
    console.log('Fetching all courses from Supabase...');
    const { data: courses, error } = await supabase.from('Course').select('*');
    if (error) {
        console.error('Error fetching courses:', error);
        return;
    }

    console.log(`Fetched ${courses.length} courses.`);
    let updatedCount = 0;

    for (const c of courses) {
        let needsUpdate = false;
        const updatePayload = {};

        // Check sections
        if (c.sections) {
            let originalSections = c.sections;
            if (typeof originalSections === 'string') {
                try {
                    originalSections = JSON.parse(originalSections);
                } catch (e) {}
            }

            if (Array.isArray(originalSections)) {
                const cleanedSections = originalSections.map(cleanSection);
                if (JSON.stringify(cleanedSections) !== JSON.stringify(c.sections)) {
                    updatePayload.sections = cleanedSections;
                    needsUpdate = true;
                }
            }
        }

        // Check textual fields
        for (const field of ['description', 'entryRequirements', 'careerPaths']) {
            if (c[field] && typeof c[field] === 'string') {
                const cleaned = cleanValue(c[field]);
                if (cleaned !== c[field]) {
                    updatePayload[field] = cleaned;
                    needsUpdate = true;
                }
            }
        }

        if (needsUpdate) {
            console.log(`Updating course [${c.slug || c.id}]: ${c.title}...`);
            const { error: updateErr } = await supabase
                .from('Course')
                .update(updatePayload)
                .eq('id', c.id);

            if (updateErr) {
                console.error(`Failed to update ${c.slug}:`, updateErr);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`\nSuccessfully updated ${updatedCount} courses.`);
}

fixAllCourses();
