require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CARST_NAMES = {
    'oiva': 'Oliver',
    'eeva': 'Eva',
    'juha': 'Julian',
    'markku': 'Marcus',
    'onni': 'Owen',
    'vesa': 'Vincent',
    'eino': 'Ethan',
    'minna': 'Sarah',
    'anja': 'Amanda',
    'tanja': 'Tania',
    'noor': 'Noel',
    'jussi': 'Julian',
    'jukka': 'Juan',
    'tommi': 'Tommy',
    'kirsi': 'Camila',
    'matti': 'Matthew',
    'jouko': 'John',
    'otso': 'Oscar',
    'päivi': 'Patricia',
    'paivi': 'Patricia',
    'jari': 'Jared',
    'tarja': 'Teresa',
    'eero': 'Eric',
    'riitta': 'Rita',
    'sari': 'Sarah',
    'ismo': 'Ian',
    'ville': 'William',
    'maija': 'Maya',
    'pekka': 'Peter',
    'heikki': 'Henry',
    'antti': 'Anthony',
    'mikko': 'Michael',
    'timo': 'Timothy',
    'seppo': 'Sebastian',
    'sanna': 'Sandra',
    'pirjo': 'Patricia',
    'leena': 'Lena',
    'kaisa': 'Katherine',
    'tiina': 'Tina',
    'liisa': 'Lisa',
    'tuula': 'Julia'
};

const LAST_NAMES = {
    'koskinen': 'Jenkins',
    'ahonen': 'Adams',
    'savolainen': 'Silva',
    'mäkinen': 'Macdonald',
    'makinen': 'Macdonald',
    'virtanen': 'Valenzuela',
    'heinonen': 'Harrison',
    'aaltonen': 'Alvarez',
    'niemi': 'Nelson',
    'ojala': 'O\'Neill',
    'mustonen': 'Murray',
    'lassila': 'Larson',
    'laaksonen': 'Lawson',
    'laine': 'Lane',
    'hiltunen': 'Hamilton',
    'salminen': 'Salazar',
    'jääskeläinen': 'Jackson',
    'jaaskelainen': 'Jackson',
    'hämäläinen': 'Hernandez',
    'hamalainen': 'Hernandez',
    'karjalainen': 'Knight',
    'leppänen': 'Lopez',
    'leppanen': 'Lopez',
    'järvinen': 'Jenkins',
    'jarvinen': 'Jenkins',
    'korhonen': 'Campbell',
    'nieminen': 'Newman',
    'mäkelä': 'MacLeod',
    'makela': 'MacLeod',
    'laitinen': 'Lawson',
    'heikkinen': 'Henderson'
};

function cleanNameForEmail(name) {
    let clean = name.replace(/^(Prof\.\s+|Dr\.\s+)/i, '');
    return clean.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9.\s]/g, '')
        .replace(/\s+/g, '.');
}

async function fixFaculty() {
    console.log("Fetching all faculty...");
    const { data: facultyList, error } = await supabase.from('Faculty').select('*');

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(`Processing ${facultyList.length} faculty members...`);
    let updatedCount = 0;

    for (const faculty of facultyList) {
        const originalName = faculty.name;
        const originalEmail = faculty.email;

        // Split names and map them
        let prefix = "";
        let workingName = originalName;

        if (originalName.startsWith("Prof. ")) {
            prefix = "Prof. ";
            workingName = originalName.substring(6);
        } else if (originalName.startsWith("Dr. ")) {
            prefix = "Dr. ";
            workingName = originalName.substring(4);
        }

        const parts = workingName.split(/\s+/);
        let updatedParts = parts.map((part, index) => {
            const key = part.toLowerCase().replace(/[^a-zäö]/g, '');
            if (index === 0) {
                // First name
                return CARST_NAMES[key] || part;
            } else if (index === parts.length - 1) {
                // Last name
                return LAST_NAMES[key] || part;
            }
            return part;
        });

        let newWorkingName = updatedParts.join(" ");
        let newFullName = prefix + newWorkingName;

        // Force email update to match the new name and have @cannogacollege.ca domain
        let emailUser = cleanNameForEmail(newWorkingName);
        let newEmail = `${emailUser}@cannogacollege.ca`;

        // Check if anything changed
        if (newFullName !== originalName || originalEmail !== newEmail) {
            console.log(`Updating: "${originalName}" (${originalEmail}) -> "${newFullName}" (${newEmail})`);
            const { error: updateErr } = await supabase
                .from('Faculty')
                .update({
                    name: newFullName,
                    email: newEmail,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', faculty.id);

            if (updateErr) {
                console.error(`Failed to update ${faculty.id}:`, updateErr);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`Done! Updated ${updatedCount} faculty records.`);
}

fixFaculty();
