import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    // Get departments with their head count
    const { data: deptsWithHead, error: headError } = await supabase
        .from('Department')
        .select('id, name, headofdepartmentid')
        .not('headofdepartmentid', 'is', null);
    
    if (headError) throw headError;
    
    // Get all departments
    const { data: allDepts, error: deptError } = await supabase
        .from('Department')
        .select('id, name');
    
    if (deptError) throw deptError;
    
    console.log(`Total departments: ${allDepts.length}`);
    console.log(`Departments with head assigned: ${deptsWithHead.length}`);
    console.log(`Departments needing head: ${allDepts.length - deptsWithHead.length}\n`);
    
    if (deptsWithHead.length > 0) {
        console.log('Departments that already have heads:');
        deptsWithHead.forEach(dept => {
            console.log(`  - ${dept.name}`);
        });
        console.log('');
    }
    
    // Get departments without heads
    const deptsWithHeadIds = new Set(deptsWithHead.map(d => dept.id));
    const deptsWithoutHead = allDepts.filter(dept => !deptsWithHeadIds.has(dept.id));
    
    console.log(`First 10 departments needing heads:`);
    deptsWithoutHead.slice(0, 10).forEach(dept => {
        console.log(`  - ${dept.name}`);
    });
    
    if (deptsWithoutHead.length > 10) {
        console.log(`  ... and ${deptsWithoutHead.length - 10} more`);
    }
    
    // Get faculty to assign as heads (one per department needing head)
    const { data: faculty, error: facError } = await supabase
        .from('Faculty')
        .select('id, name, departmentId, email')
        .order('createdAt', { ascending: false }); // Get newest faculty first
    
    if (facError) throw facError;
    
    console.log(`\nAvailable faculty: ${faculty.length}`);
    
    // Group faculty by department
    const facultyByDept = {};
    faculty.forEach(f => {
        if (!facultyByDept[f.departmentId]) {
            facultyByDept[f.departmentId] = [];
        }
        facultyByDept[f.departmentId].push(f);
    });
    
    // Assign heads to departments that don't have one
    let assignedCount = 0;
    const updates = [];
    
    for (const dept of deptsWithoutHead) {
        const deptFaculty = facultyByDept[dept.id] || [];
        
        if (deptFaculty.length > 0) {
            // Use the first faculty member from this department
            const head = deptFaculty[0];
            updates.push({
                id: dept.id,
                headofdepartmentid: head.id
            });
            assignedCount++;
            console.log(`Assigning ${head.name} as head of ${dept.name}`);
        } else {
            console.log(`Warning: No faculty found for department ${dept.name}`);
        }
    }
    
    if (updates.length > 0) {
        console.log(`\nAssigning ${assignedCount} department heads...`);
        
        // Apply updates in batches
        const batchSize = 10;
        for (let i = 0; i < updates.length; i += batchSize) {
            const batch = updates.slice(i, i + batchSize);
            
            const { error: updateError } = await supabase
                .from('Department')
                .upsert(batch);
            
            if (updateError) {
                console.error(`Error updating batch ${i/batchSize + 1}:`, updateError.message);
            } else {
                console.log(`✅ Updated batch ${i/batchSize + 1} (${batch.length} departments)`);
            }
            
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        console.log(`\n✅ Successfully assigned ${assignedCount} department heads!`);
    } else {
        console.log('No department heads to assign');
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});