
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CARST_NAMES = [
    "Aino", "Alessandro", "Alice", "Anders", "Astrid", "Björn", "Charlotte", "Chiara", "Chloé", "Daniel",
    "David", "Elena", "Elias", "Elizabeth", "Emilia", "Emma", "Eric", "Eva", "Felix", "Francesca",
    "Gabriel", "Giovanni", "Grace", "Hannah", "Hans", "Heidi", "Henrik", "Hugo", "Ingrid", "Isabella",
    "Jack", "James", "Jean-Luc", "Johan", "Julia", "Klaus", "Lars", "Leo", "Liam", "Linnea",
    "Lucas", "Magnus", "Marco", "Marcus", "Marie", "Matilda", "Maximilian", "Mikael", "Nathan", "Noah",
    "Oliver", "Olivia", "Oscar", "Paul", "Robert", "Samuel", "Sarah", "Sebastian", "Silvia", "Sofia",
    "Thomas", "Tobias", "Venla", "Victor", "William", "Alexander", "Benjamin", "Julian", "Adrian", "Flora",
    "Nora", "Elsa", "Kasper", "Rasmus", "Axel", "Ida", "Vera", "Alma", "Otso", "Onni",
    "Eino", "Väinö", "Ilmari", "Toivo", "Oiva", "Vilho", "Olavi", "Anja", "Leena", "Marja",
    "Sari", "Tiina", "Minna", "Tarja", "Päivi", "Pirjo", "Tuula", "Anne", "Satu", "Kirsi",
    "Ulla", "Eeva", "Laura", "Jenni", "Sanna", "Tanja", "Hanna", "Kati", "Riitta", "Seija",
    "Antti", "Jukka", "Mikko", "Timo", "Juha", "Heikki", "Matti", "Kari", "Jari", "Petri",
    "Marko", "Ville", "Janne", "Ari", "Pekka", "Hannu", "Sami", "Teemu", "Jussi", "Harri",
    "Pasi", "Vesa", "Ismo", "Kimmo", "Tommi", "Markku", "Jouko", "Risto", "Pentti", "Eero",
    "Sophie", "Clara", "Léa", "Manon", "Camille", "Louis", "Arthur", "Jules", "Maël", "Noah",
    "Adam", "Liam", "Ethan", "Mohamed", "Amir", "Yusuf", "Ibrahim", "Omar", "Ali", "Hassan",
    "Fatima", "Zainab", "Maryam", "Aisha", "Noor", "Layla", "Yasmin", "Zara", "Maya", "Amara",
    "Hiroshi", "Kenji", "Takumi", "Yuki", "Sakura", "Hana", "Mei", "Wei", "Li", "Jun",
    "Santiago", "Mateo", "Leonardo", "Diego", "Valentina", "Camila", "Lucia", "Martina", "Elena", "Carmen"
];

const LAST_NAMES = [
    "Larsson", "Müller", "Virtanen", "Bernard", "Thomas", "Martin", "Nieminen", "Lehtonen", "Johnson", "Roberts",
    "Esposito", "Rossi", "Russo", "Svensson", "Persson", "Bianchi", "Schneider", "Fischer", "Korhonen", "Mäkinen",
    "Brown", "Taylor", "Williams", "Andersen", "Johansson", "Smith", "Mikkelsen", "Popova", "Klein", "Curry",
    "Windsor", "Picard", "Gruber", "Conti", "Twist", "Watson", "Langdon", "O'Connor", "Wagner", "Weber",
    "Fontaine", "Holm", "Lindholm", "Dubois", "Moretti", "Nielsen", "Berger", "Laurent", "Davies", "Evans",
    "Wilson", "Lindberg", "Mattila", "Laine", "Heikkinen", "Koskinen", "Järvinen", "Leppänen", "Hämäläinen",
    "Lassila", "Kinnunen", "Salminen", "Turunen", "Heinonen", "Niemi", "Laitinen", "Karjalainen", "Jokinen",
    "Rantanen", "Savolainen", "Tuominen", "Ahonen", "Ojala", "Hiltunen", "Väisänen", "Kemppainen", "Wang",
    "Chen", "Zhang", "Liu", "Singh", "Kumar", "Patel", "Kim", "Lee", "Park", "Yamamoto",
    "Tanaka", "Suzuki", "Sato", "Takahashi", "Watanabe", "Ito", "Nakamura", "Kobayashi", "Kato", "Yoshida",
    "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Sanchez", "Romero", "Torres",
    "Dupont", "Durand", "Leroy", "Moreau", "Simon", "Michel", "Lefebvre", "Roux", "David", "Bertrand",
    "Ivanov", "Smirnov", "Kuznetsov", "Popov", "Sokolov", "Lebedev", "Kozlov", "Novikov", "Morozov", "Petrov",
    "Mustonen", "Partanen", "Pitkänen", "Aaltonen", "Manninen", "Räsänen", "Tolvanen", "Laaksonen", "Koivisto", "Anttila"
];

// Remove duplicates from source lists just in case
const uniqueFirst = [...new Set(CARST_NAMES)];
const uniqueLast = [...new Set(LAST_NAMES)];

async function deduplicateNames() {
    console.log('Fetching faculty...');
    const { data: faculty, error } = await supabase.from('Faculty').select('id, name, role').order('name');

    if (error || !faculty) {
        console.error('Error fetching faculty', error);
        return;
    }

    console.log(`Checking ${faculty.length} faculty members for strict name uniqueness...`);
    console.log(`Available Names: ${uniqueFirst.length} First, ${uniqueLast.length} Last`);

    if (faculty.length > uniqueFirst.length || faculty.length > uniqueLast.length) {
        throw new Error(`CRITICAL: Not enough unique names! Need ${faculty.length}, have ${uniqueFirst.length} first and ${uniqueLast.length} last.`);
    }

    const shuffledFirst = [...uniqueFirst].sort(() => 0.5 - Math.random());
    const shuffledLast = [...uniqueLast].sort(() => 0.5 - Math.random());

    console.log('Assigning new unique names...');

    for (let i = 0; i < faculty.length; i++) {
        const f = faculty[i];

        // Preserve title if exists (Prof. / Dr.)
        let title = "";
        let currentName = f.name;

        if (currentName.startsWith("Prof. ")) {
            title = "Prof. ";
            currentName = currentName.replace("Prof. ", "");
        } else if (currentName.startsWith("Dr. ")) {
            title = "Dr. ";
            currentName = currentName.replace("Dr. ", "");
        } else if (currentName.startsWith("Ing. ")) {
            title = "Ing. ";
            currentName = currentName.replace("Ing. ", "");
        } else if (currentName.startsWith("Dean ")) {
            title = "Dean ";
            currentName = currentName.replace("Dean ", "");
        }

        // Assign purely new names strictly from the list to guarantee global uniqueness
        // Using modulo to wrap around if we run out (hoping we don't)
        const newFirst = shuffledFirst[i % shuffledFirst.length];
        const newLast = shuffledLast[i % shuffledLast.length];

        const newName = `${title}${newFirst} ${newLast}`;

        // console.log(`Renaming ${f.name} -> ${newName}`);

        // const { error: updateError } = await supabase
        //     .from('Faculty')
        //     .update({ name: newName })
        //     .eq('id', f.id);

        // if (updateError) console.error(`Failed to update ${f.id}:`, updateError.message);

        console.log(`UPDATE "Faculty" SET name = '${newName.replace(/'/g, "''")}' WHERE id = '${f.id}';`);
    }

    console.log('Deduplication complete.');
}

deduplicateNames();
