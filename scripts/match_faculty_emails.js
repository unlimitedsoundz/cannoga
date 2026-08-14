require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Transliterate Canadian/Swedish (and other) special letters to ASCII equivalents.
function transliterate(str) {
    const map = {
        'ä': 'a', 'Ä': 'a',
        'ö': 'o', 'Ö': 'o',
        'å': 'a', 'Å': 'a',
        'ü': 'u', 'Ü': 'u',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'á': 'a', 'à': 'a', 'â': 'a',
        'í': 'i', 'ì': 'i', 'î': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u',
        'ñ': 'n', 'ç': 'c',
        "'": '',
    };
    return str.replace(/[^\x00-\x7F]/g, (c) => map[c] ?? '');
}

// Strip a leading academic title (Prof. / Dr.) and return the clean full name.
function stripTitle(name) {
    return name.replace(/^(Prof\.\s+|Dr\.\s+|Dean\s+)/i, '').trim();
}

// Build a firstname.lastname@cannogacollege.ca email from the name.
function emailFromName(name) {
    const clean = stripTitle(name)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, ''); // remove any remaining combining accents

    const ascii = transliterate(clean)
        .replace(/[^a-z0-9.\s]/g, '') // drop anything that is not alphanumeric/dot/space
        .replace(/\s+/g, '.');        // spaces -> dots

    // Collapse accidental double dots
    const user = ascii.replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    return `${user}@cannogacollege.ca`;
}

async function matchFacultyEmails() {
    const { data: faculty, error } = await supabase
        .from('Faculty')
        .select('id, name, email')
        .order('name');

    if (error) {
        console.error('Error fetching faculty:', error);
        return;
    }

    console.log(`Found ${faculty.length} faculty members. Matching emails to names...`);

    let updated = 0;
    let unchanged = 0;

    for (const f of faculty) {
        const newEmail = emailFromName(f.name);

        if (newEmail === f.email) {
            unchanged++;
            continue;
        }

        const { error: updateError } = await supabase
            .from('Faculty')
            .update({ email: newEmail, updatedAt: new Date().toISOString() })
            .eq('id', f.id);

        if (updateError) {
            console.error(`Failed to update "${f.name}" (${f.id}):`, updateError.message);
        } else {
            console.log(`${f.name}  ->  ${newEmail}  (was ${f.email || '<none>'})`);
            updated++;
        }
    }

    console.log(`\nDone. Updated ${updated} emails, ${unchanged} already matched.`);
}

matchFacultyEmails();
