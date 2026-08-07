require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map of Canadian names to Canadian, American, or South American names
const NAME_MAP = {
    'Minna Koskinen': 'Sarah Jenkins',
    'Anja Ahonen': 'Amanda Adams',
    'Tanja Savolainen': 'Tania Silva',
    'Noor Mäkinen': 'Noel Macdonald',
    'Oliver Virtanen': 'Oliver Valenzuela',
    'Felix Heinonen': 'Felix Harrison',
    'Jukka Seidel': 'Julian Seidel',
    'Jussi Seidel': 'Julian Seidel',
    'Jukka Aaltonen': 'Juan Alvarez',
    'Tommi Niemi': 'Tommy Nelson',
    'Alice Ojala': 'Alice O\'Neill',
    'Kirsi Michel': 'Camila Michel',
    'Matti Stern': 'Matthew Sterling',
    'Jouko Watson': 'John Watson',
    'Eva Mustonen': 'Evelyn Murray',
    'Otso Bertrand': 'Oscar Bertrand',
    'Jari Yoshida': 'Jared Young',
    'Tarja Popova': 'Teresa Portal',
    'Eero Baumann': 'Eric Baumann',
    'Riitta Otto': 'Rita Ortiz',
    'Sari Schröder': 'Sarah Schroeder',
    'Ismo Schneider': 'Ian Schneider',
    'Ville Järvinen': 'William Jenkins',
    'Päivi O\'Connor': 'Patricia O\'Connor'
};

function cleanNameForEmail(name) {
    // Remove "Prof. ", "Dr. "
    let clean = name.replace(/^(Prof\.\s+|Dr\.\s+)/i, '');
    // Replace spaces and special chars
    return clean.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9.\s]/g, '')
        .replace(/\s+/g, '.');
}

async function fixFaculty() {
    console.log("Starting faculty migration...");

    // 1. Fetch all faculty members
    const { data: facultyList, error: facultyError } = await supabase
        .from('Faculty')
        .select('*');

    if (facultyError) {
        console.error("Error fetching faculty:", facultyError);
        return;
    }

    console.log(`Found ${facultyList.length} faculty members. Processing updates...`);

    for (const faculty of facultyList) {
        let name = faculty.name;
        // Strip prefixes for name map lookup, but preserve them in updated name
        let prefix = "";
        let lookupName = name;
        if (name.startsWith("Prof. ")) {
            prefix = "Prof. ";
            lookupName = name.substring(6);
        } else if (name.startsWith("Dr. ")) {
            prefix = "Dr. ";
            lookupName = name.substring(4);
        }

        let newLookupName = NAME_MAP[lookupName] || lookupName;
        let newFullName = prefix + newLookupName;

        // Clean name for email and suffix with cannogacollege.ca
        let emailUser = cleanNameForEmail(newLookupName);
        let newEmail = `${emailUser}@cannogacollege.ca`;

        // Handle specific overrides if any
        if (faculty.email === 'aleksei.i@cannogacollege.ca') {
            newEmail = 'alexander.ivanov@cannogacollege.ca';
            newFullName = 'Prof. Alexander Ivanov';
        } else if (faculty.email === 'nina.s@cannogacollege.ca') {
            newEmail = 'nina.sorokin@cannogacollege.ca';
        }

        console.log(`Updating: "${name}" (${faculty.email}) -> "${newFullName}" (${newEmail})`);

        const { error: updateError } = await supabase
            .from('Faculty')
            .update({
                name: newFullName,
                email: newEmail,
                updatedAt: new Date().toISOString()
            })
            .eq('id', faculty.id);

        if (updateError) {
            console.error(`Failed to update faculty ${faculty.id}:`, updateError);
        }
    }

    console.log("Faculty updates complete.");

    // 2. Add faculty to departments that don't have any
    console.log("Checking departments for missing faculty...");
    
    // Fetch all departments
    const { data: depts, error: deptsError } = await supabase
        .from('Department')
        .select('*');

    if (deptsError) {
        console.error("Error fetching departments:", deptsError);
        return;
    }

    // New faculty templates for empty departments
    const EMPTY_DEPT_FACULTY = {
        'business-management-dept': {
            name: 'Dr. Robert Henderson',
            email: 'robert.henderson@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Henderson is a Canadian business strategist with over 20 years of academic administration and advisory experience in Ottawa.'
        },
        'engineering-skilled-trades-dept': {
            name: 'Prof. Carlos Mendez',
            email: 'carlos.mendez@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Prof. Mendez brings expertise in mechanical engineering and advanced structural design from South America and Canada.'
        },
        'transportation-aviation-dept': {
            name: 'Dr. James Vance',
            email: 'james.vance@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Vance is a veteran aerospace specialist and licensed instructor with background in aviation management and safety systems.'
        },
        'information-technology-dept': {
            name: 'Dr. Sophia Rodriguez',
            email: 'sophia.rodriguez@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Rodriguez specializes in cybersecurity networks and cloud computing solutions with academic backgrounds in American institutions.'
        },
        'media-creative-arts-dept': {
            name: 'Prof. Gabriel Silva',
            email: 'gabriel.silva@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Prof. Silva is a media strategist and film producer from South America directing creative communications in Ottawa.'
        },
        'health-community-dept': {
            name: 'Dr. Emily Campbell',
            email: 'emily.campbell@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Campbell is a registered nurse and community health advocate specializing in practical nursing programs across Canada.'
        },
        'education-social-sciences-dept': {
            name: 'Prof. Arthur Bertrand',
            email: 'arthur.bertrand@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Prof. Bertrand is a specialist in early childhood learning models and developmental support systems in Ontario.'
        },
        'hospitality-tourism-dept': {
            name: 'Dr. Isabella Santos',
            email: 'isabella.santos@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Santos oversees hospitality management systems and culinary arts program certifications with global tourism networks.'
        },
        'environment-agriculture-dept': {
            name: 'Dr. Elizabeth Warren',
            email: 'elizabeth.warren@cannogacollege.ca',
            role: 'Professor & Chair',
            bio: 'Dr. Warren is an agricultural engineer researching sustainable soil conservation and smart farming technologies in North America.'
        }
    };

    for (const dept of depts) {
        // Query to check if faculty exists for this department
        const { data: existingFaculty, error: checkError } = await supabase
            .from('Faculty')
            .select('id')
            .eq('departmentId', dept.id)
            .limit(1);

        if (checkError) {
            console.error(`Error checking faculty for department ${dept.name}:`, checkError);
            continue;
        }

        if (existingFaculty && existingFaculty.length > 0) {
            console.log(`Department "${dept.name}" already has faculty.`);
            continue;
        }

        // Add faculty member if we have a template for this department slug
        const template = EMPTY_DEPT_FACULTY[dept.slug];
        if (template) {
            console.log(`Adding faculty member to empty department "${dept.name}"...`);
            const facultyId = uuidv4();

            const { error: insertError } = await supabase
                .from('Faculty')
                .insert({
                    id: facultyId,
                    name: template.name,
                    email: template.email,
                    role: template.role,
                    bio: template.bio,
                    schoolId: dept.schoolId,
                    departmentId: dept.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });

            if (insertError) {
                console.error(`Failed to insert faculty for department ${dept.name}:`, insertError);
                continue;
            }

            // Set as head of department
            console.log(`Setting headOfDepartmentId for department "${dept.name}"...`);
            const { error: updateDeptError } = await supabase
                .from('Department')
                .update({
                    headOfDepartmentId: facultyId,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', dept.id);

            if (updateDeptError) {
                console.error(`Failed to update head of department for ${dept.name}:`, updateDeptError);
            }
        } else {
            console.log(`Warning: No template defined for empty department slug "${dept.slug}"`);
        }
    }

    console.log("Faculty seeding complete!");
}

fixFaculty();
