
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

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
    "Mustonen", "Partanen", "Pitkänen", "Aaltonen", "Manninen", "Räsänen", "Tolvanen", "Laaksonen", "Koivisto", "Anttila",
    "Adler", "Albrecht", "Bauer", "Baumann", "Beck", "Becker", "Berger", "Bergmann", "Brandt", "Braun",
    "Busch", "Dietrich", "Engel", "Fischer", "Frank", "Fuchs", "Graf", "Groß", "Günther", "Haas",
    "Hahn", "Hartmann", "Heinrich", "Herrmann", "Hoffmann", "Hofmann", "Huber", "Jung", "Kaiser", "Keller",
    "Klein", "Koch", "Köhler", "König", "Kraus", "Krämer", "Krüger", "Kuhn", "Lang", "Lange",
    "Lehmann", "Lorenz", "Ludwig", "Maier", "Martin", "Mayer", "Meier", "Meyer", "Möller", "Müller",
    "Neumann", "Otto", "Peters", "Pohl", "Richter", "Roth", "Sauer", "Schäfer", "Schmid", "Schmidt",
    "Schmitt", "Schneider", "Scholz", "Schreiber", "Schröder", "Schubert", "Schulte", "Schulze", "Schumacher", "Schuster",
    "Schwarz", "Seidel", "Simon", "Sommer", "Stein", "Stern", "Thomas", "Vogel", "Vogt", "Voigt",
    "Wagner", "Walter", "Weber", "Weiss", "Werner", "Winkler", "Winter", "Wolf", "Wolff", "Zimmermann"
];

const uniqueFirst = [...new Set(CARST_NAMES)];
const uniqueLast = [...new Set(LAST_NAMES)];

async function deduplicateNames() {
    console.log('Fetching faculty...');
    const { data: faculty, error } = await supabase.from('Faculty').select('id, name').order('name');

    if (error || !faculty) {
        console.error('Error fetching faculty', error);
        return;
    }

    if (faculty.length > uniqueFirst.length || faculty.length > uniqueLast.length) {
        console.error(`CRITICAL: Not enough unique names! Need ${faculty.length}, have ${uniqueFirst.length} first and ${uniqueLast.length} last.`);
        process.exit(1);
    }

    const shuffledFirst = [...uniqueFirst].sort(() => 0.5 - Math.random());
    const shuffledLast = [...uniqueLast].sort(() => 0.5 - Math.random());

    console.log('Applying updates directly...');

    for (let i = 0; i < faculty.length; i++) {
        const f = faculty[i];

        let title = "";
        let currentName = f.name;

        if (currentName.includes("Prof. ")) {
            title = "Prof. ";
        } else if (currentName.includes("Dr. ")) {
            title = "Dr. ";
        } else if (currentName.includes("Ing. ")) {
            title = "Ing. ";
        } else if (currentName.includes("Dean ")) {
            title = "Dean ";
        }

        const newFirst = shuffledFirst[i];
        const newLast = shuffledLast[i];

        const newName = `${title}${newFirst} ${newLast}`;

        const { error: updateError } = await supabase
            .from('Faculty')
            .update({ name: newName })
            .eq('id', f.id);

        if (updateError) {
            console.error(`Failed to update ${f.id}:`, updateError.message);
        }
    }

    console.log('Deduplication complete.');
}

deduplicateNames();
