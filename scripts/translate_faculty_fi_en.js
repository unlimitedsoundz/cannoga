require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Exact-match English translations for the Canadian role/bio values.
const ROLE_MAP = {
    'Koulutusjohtaja': 'Head of School',
};

const BIO_MAP = {
    'Päättävähenkilö kestävän rakentamisen hankkeissa.':
        'Leader in sustainable construction projects.',
    'Tutkija markkinointitiedosta ja kestävästä kuluttajakäyttäytymisestä.':
        'Researcher in marketing data and sustainable consumer behaviour.',
    'Tutkija tietoturvassa ja hajautetuissa järjestelmissä.':
        'Researcher in cybersecurity and distributed systems.',
    'Asiantuntija fintechistä ja kestävistä investointistrategioista.':
        'Expert in fintech and sustainable investment strategies.',
    'Opettaja data-analyytikästä ja algoritmien puolueettomuudesta.':
        'Lecturer in data analytics and algorithmic fairness.',
    'Tutkija kiertotalousmalleista ja makrotaloustieteestä.':
        'Researcher in circular economy models and macroeconomics.',
    'Prof. Möller is an experienced specialist in the field of Hospitality and Tourism, with a strong focus on student mentorship and academic innovation at Cannoga College.':
        'Prof. Moller is an experienced specialist in the field of Hospitality and Tourism, with a strong focus on student mentorship and academic innovation at Cannoga College.',
};

const hasCanadian = (s) => /[äöåÄÖÅ]/.test(s || '');

async function translateFaculty() {
    const { data: faculty, error } = await supabase
        .from('Faculty')
        .select('id, name, role, bio');

    if (error) {
        console.error('Error fetching faculty:', error);
        return;
    }

    console.log(`Found ${faculty.length} faculty members. Scanning for Canadian text...`);
    let updated = 0;

    for (const f of faculty) {
        const newRole = ROLE_MAP[f.role] || f.role;
        const newBio = BIO_MAP[f.bio] || f.bio;

        const roleChanged = newRole !== f.role;
        const bioChanged = newBio !== f.bio;
        // Safety net: if anything still contains Canadian letters, leave it for manual review.
        const stillCanadian = hasCanadian(newRole) || hasCanadian(newBio);

        if ((roleChanged || bioChanged)) {
            if (stillCanadian) {
                console.warn(`Skipping "${f.name}" - unmapped Canadian text remains (role="${newRole}", bio="${newBio}")`);
                continue;
            }
            const { error: updateError } = await supabase
                .from('Faculty')
                .update({ role: newRole, bio: newBio, updatedAt: new Date().toISOString() })
                .eq('id', f.id);

            if (updateError) {
                console.error(`Failed to update "${f.name}" (${f.id}):`, updateError.message);
            } else {
                console.log(`Updated "${f.name}": role=${newRole} | bio=${newBio.slice(0, 60)}`);
                updated++;
            }
        }
    }

    console.log(`\nDone. Translated ${updated} faculty records to English.`);
}

translateFaculty();
