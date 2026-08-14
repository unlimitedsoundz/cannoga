
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newHeads = [
    "Dr. Aino Mäkinen",
    "Prof. Michael Jonathan Reed",
    "Dr. Sofia Alessandra Romano",
    "Dr. Elias Johannes Lehtinen",
    "Prof. Laura Elizabeth Bennett",
    "Dr. Matteo Lorenzo Bianchi",
    "Dr. Emilia Kaarina Lahtinen",
    "Prof. Andrew Thomas Wilson",
    "Dr. Giulia Francesca Conti",
    "Dr. Oskari Mikael Nieminen",
    "Prof. Sarah Anne Collins",
    "Dr. Luca Antonio Ferraro",
    "Dr. Helmi Sofia Salonen",
    "Prof. Daniel Christopher Moore",
    "Dr. Valentina Maria Ricci",
    "Dr. Joonas Pekka Rantanen",
    "Prof. Emily Rose Carter",
    "Dr. Alessandro Marco DeLuca",
    "Dr. Noora Emilia Hämäläinen",
    "Prof. Benjamin Oliver Hughes",
    "Dr. Chiara Elisabetta Moretti",
    "Dr. Antti Juhani Lehtonen",
    "Prof. Rebecca Louise Turner",
    "Dr. Federico Paolo Mancini",
    "Dr. Veera Linnea Koskinen",
    "Prof. James Edward Thompson",
    "Dr. Francesca Luisa Galli",
    "Dr. Sami Aleksanteri Aaltonen",
    "Prof. Olivia Margaret Hayes",
    "Dr. Roberto Stefano Bellini"
];

async function main() {
    console.log('🔄 Starting Head of Department Assignment...');

    // 1. Fetch all Departments
    const { data: departments, error: deptError } = await supabase
        .from('Department')
        .select('id, name, schoolId')
        .order('name');

    if (deptError || !departments) {
        console.error('❌ Failed to fetch departments:', deptError);
        return;
    }

    console.log(`ℹ️ Found ${departments.length} departments.`);

    // 2. Iterate and Assign
    for (let i = 0; i < newHeads.length; i++) {
        const name = newHeads[i];
        const names = name.split(' ');
        const lastName = names[names.length - 1].toLowerCase();
        const email = `${names[0].replace('.', '').toLowerCase()}.${lastName}@cannogacollege.ca`; // Construct simple email

        // Determine role and department
        // If we have more names than departments, the extras will just be "Professor" with no dept assigned for now (or assigned to first dept as faculty)
        // Actually, let's just create them all. 
        // If i < departments.length, we assign them as HOD of departments[i]

        const department = i < departments.length ? departments[i] : null;
        const role = department ? 'Head of Department' : 'Professor';

        const facultyData = {
            name: name,
            email: email,
            role: role,
            bio: `${role} at Penkka University. Expert in their field with a focus on sustainable development and academic excellence.`,
            imageUrl: `/images/faculty/${names[0].replace('.', '').toLowerCase()}-${lastName}.png`, // Professional portrait
            schoolId: department ? department.schoolId : null, // Fallback need a school? Maybe fetch schools.
            departmentId: department ? department.id : null
        };

        // Create Faculty
        // Check if exists first to avoid dupes if re-run
        const { data: existing } = await supabase.from('Faculty').select('id').eq('email', email).single();

        let facultyId;

        if (existing) {
            console.log(`ℹ️ Faculty member ${name} already exists. Updating...`);
            const { data: updated } = await supabase.from('Faculty').update(facultyData).eq('id', existing.id).select().single();
            facultyId = updated.id;
        } else {
            console.log(`✨ Creating faculty member: ${name}`);
            const { data: created, error: createError } = await supabase.from('Faculty').insert(facultyData).select().single();
            if (createError) {
                console.error(`❌ Error creating ${name}:`, createError.message);
                continue;
            }
            facultyId = created.id;
        }

        // Assign as HOD if applicable
        if (department) {
            console.log(`👉 Assigning ${name} as Head of ${department.name}`);
            const { error: updateDeptError } = await supabase
                .from('Department')
                .update({ headOfDepartmentId: facultyId })
                .eq('id', department.id);

            if (updateDeptError) {
                console.error(`❌ Failed to update department ${department.name}:`, updateDeptError.message);
            }
        }
    }

    console.log('✅ HOD Assignment Complete!');
}

main();
