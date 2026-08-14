
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const { data: schools } = await supabase.from('School').select('id, name, slug');

    for (const school of schools || []) {
        console.log(`\nSchool: ${school.name} (${school.slug})`);
        const { data: depts } = await supabase
            .from('Department')
            .select('id, name, slug, headOfDepartmentId, headOfDepartment:Faculty(name, role)')
            .eq('schoolId', school.id);

        if (depts && depts.length > 0) {
            depts.forEach(d => {
                const hod = d.headOfDepartment as any;
                console.log(` - ${d.name} [${d.slug}] -> Head: ${hod ? `${hod.name} (${hod.role})` : 'NONE'} (ID: ${d.headOfDepartmentId})`);
            });
        } else {
            console.log(" - No departments found.");
        }
    }
}

main();
