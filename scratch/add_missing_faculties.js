require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const POOL_CARST = [
    // Canadian / American
    'Sarah', 'Emily', 'Elizabeth', 'Arthur', 'David', 'Robert', 'James', 'John', 'William', 'Mary', 'Patricia',
    'Jennifer', 'Michael', 'Thomas', 'Jessica', 'Matthew', 'Daniel', 'Richard', 'Joseph', 'Charles', 'Christopher',
    // South American
    'Carlos', 'Gabriela', 'Mateo', 'Camila', 'Isabella', 'Lucas', 'Juan', 'Teresa', 'Rita', 'Sofia', 'Miguel',
    'Mariana', 'Diego', 'Alejandro', 'Beatriz', 'Luiz', 'Thiago', 'Rafael',
    // European
    'Oliver', 'Chloe', 'Charlotte', 'Lars', 'Hans', 'Elena', 'Stefan', 'Laura', 'Marc', 'Claire', 'Pierre',
    'Jean', 'Eva', 'Antoine', 'Giuseppe', 'Alessandro'
];

const POOL_LAST = [
    // Canadian / American
    'Jenkins', 'Adams', 'Macdonald', 'Harrison', 'Nelson', 'O\'Neill', 'Murray', 'Larson', 'Lawson', 'Lane',
    'Hamilton', 'Knight', 'Jackson', 'Campbell', 'Newman', 'MacLeod', 'Henderson', 'Smith', 'Miller', 'Taylor',
    'Wilson', 'Anderson', 'Thomas',
    // South American
    'Silva', 'Valenzuela', 'Alvarez', 'Salazar', 'Hernandez', 'Lopez', 'Ortiz', 'Gomez', 'Rodriguez', 'Mendez',
    'Santos', 'Diaz', 'Perez', 'Torres', 'Reyes',
    // European
    'Brandt', 'Gruber', 'Möller', 'Fuchs', 'Winkler', 'Bianchi', 'Dupont', 'Sauer', 'Erikson', 'Braun',
    'Neumann', 'Becker', 'Rossi', 'Bennet', 'Smirnov', 'Weber', 'Dubois', 'Krantz', 'Bernard', 'Laurent', 'Schuster'
];

const ROLES = ['Assistant Professor', 'Associate Professor', 'Senior Lecturer', 'Adjunct Professor', 'Lecturer'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function cleanNameForEmail(name) {
    return name.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.\s]/g, '')
        .replace(/\s+/g, '.');
}

async function addMissingFaculties() {
    console.log("Fetching all departments...");
    const { data: depts, error: deptsErr } = await supabase.from('Department').select('*');
    if (deptsErr) {
        console.error("Error fetching depts:", deptsErr);
        return;
    }

    console.log("Fetching all faculty...");
    const { data: faculty, error: facultyErr } = await supabase.from('Faculty').select('*');
    if (facultyErr) {
        console.error("Error fetching faculty:", facultyErr);
        return;
    }

    // Group faculty by departmentId
    const deptFacultyMap = {};
    depts.forEach(d => {
        deptFacultyMap[d.id] = [];
    });
    faculty.forEach(f => {
        if (f.departmentId && deptFacultyMap[f.departmentId]) {
            deptFacultyMap[f.departmentId].push(f);
        }
    });

    console.log("Checking departments for faculty count < 3...");

    let totalAdded = 0;
    const usedNames = new Set(faculty.map(f => f.name.replace(/^(Prof\.\s+|Dr\.\s+)/i, '').trim()));

    for (const dept of depts) {
        const currentList = deptFacultyMap[dept.id] || [];
        const count = currentList.length;
        if (count < 3) {
            const need = 3 - count;
            console.log(`Department "${dept.name}" has ${count} faculty member(s). Adding ${need} more...`);

            for (let i = 0; i < need; i++) {
                // Generate a unique name
                let firstName = '';
                let lastName = '';
                let fullName = '';
                let attempts = 0;

                do {
                    firstName = getRandomElement(POOL_CARST);
                    lastName = getRandomElement(POOL_LAST);
                    fullName = `${firstName} ${lastName}`;
                    attempts++;
                } while (usedNames.has(fullName) && attempts < 100);

                usedNames.add(fullName);

                const role = getRandomElement(ROLES);
                const emailUser = cleanNameForEmail(fullName);
                const email = `${emailUser}@cannogacollege.ca`;
                const bio = `Prof. ${lastName} is an experienced specialist in the field of ${dept.name.replace('Department of ', '')}, with a strong focus on student mentorship and academic innovation at Cannoga College.`;

                console.log(` - Adding: "${fullName}" (${email}) as ${role}`);

                const { error: insertErr } = await supabase
                    .from('Faculty')
                    .insert({
                        id: uuidv4(),
                        name: fullName,
                        email: email,
                        role: role,
                        bio: bio,
                        schoolId: dept.schoolId,
                        departmentId: dept.id,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });

                if (insertErr) {
                    console.error(`   ❌ Failed to insert faculty:`, insertErr);
                } else {
                    totalAdded++;
                }
            }
        }
    }

    console.log(`Finished! Added a total of ${totalAdded} new faculty members across departments.`);
}

addMissingFaculties();
