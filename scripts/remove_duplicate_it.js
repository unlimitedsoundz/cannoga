import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching it_assets...');

    const { data: assets, error } = await supabase.from('it_assets').select('*');
    if (error) {
        console.error('Error fetching assets:', error);
        return;
    }

    // Group by asset_type
    const typeMap = {};
    for (const asset of assets) {
        if (!typeMap[asset.asset_type]) {
            typeMap[asset.asset_type] = [];
        }
        typeMap[asset.asset_type].push(asset);
    }

    console.log('Duplicates found:');
    const duplicateAssetIds = [];

    for (const [type, tools] of Object.entries(typeMap)) {
        if (tools.length > 1) {
            console.log(`\nType: ${type} has ${tools.length} entries:`);
            // Keep the first one, mark others for deletion
            // Or keep the one with auto_provision = true if mixed, or the most recent?
            // Let's sort by created_at or id to be deterministic, keep the oldest (first created)
            tools.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

            const keep = tools[0];
            console.log(`  KEEPING: [${keep.id}] ${keep.name}`);

            for (let i = 1; i < tools.length; i++) {
                const dup = tools[i];
                console.log(`  DELETING: [${dup.id}] ${dup.name}`);
                duplicateAssetIds.push(dup.id);
            }
        }
    }

    if (duplicateAssetIds.length === 0) {
        console.log('\nNo duplicate it_assets found based on asset_type.');
    } else {
        // We should also delete from student_it_access where asset_id is in duplicateAssetIds
        // Because foreign keys might restrict deletion, or it will cascade.
        // Let's manually delete from student_it_access first
        console.log(`\nDeleting associated student_it_access records for ${duplicateAssetIds.length} duplicate assets...`);
        const { error: accessError, count } = await supabase
            .from('student_it_access')
            .delete({ count: 'exact' })
            .in('asset_id', duplicateAssetIds);

        if (accessError) {
            console.error('Failed to delete student_it_access:', accessError);
        } else {
            console.log(`Deleted ${count || 0} student_it_access records attached to duplicates.`);
        }

        console.log(`Deleting ${duplicateAssetIds.length} duplicate it_assets...`);
        const { error: delError } = await supabase
            .from('it_assets')
            .delete()
            .in('id', duplicateAssetIds);

        if (delError) {
            console.error('Failed to delete it_assets:', delError);
        } else {
            console.log('Successfully deleted duplicate it_assets.');
        }
    }

    // Next, let's also check for duplicate student_it_access records for the same student and same asset
    console.log('\nChecking for duplicate student_it_access entries (same student, same asset)...');
    const { data: allAccess, error: accErr } = await supabase.from('student_it_access').select('*');
    if (accErr) {
        console.error(accErr);
        return;
    }

    const studentAssetMap = {};
    const duplicateAccessIds = [];

    for (const acc of allAccess) {
        const key = `${acc.student_id}-${acc.asset_id}`;
        if (!studentAssetMap[key]) {
            studentAssetMap[key] = [];
        }
        studentAssetMap[key].push(acc);
    }

    for (const [key, records] of Object.entries(studentAssetMap)) {
        if (records.length > 1) {
            records.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            // Keep first, delete rest
            for (let i = 1; i < records.length; i++) {
                duplicateAccessIds.push(records[i].id);
            }
        }
    }

    if (duplicateAccessIds.length > 0) {
        console.log(`Found ${duplicateAccessIds.length} duplicate student_it_access records. Deleting...`);
        const { error: dupDelErr } = await supabase
            .from('student_it_access')
            .delete()
            .in('id', duplicateAccessIds);

        if (dupDelErr) console.error(dupDelErr);
        else console.log('Successfully deleted duplicate student_it_access records.');
    } else {
        console.log('No duplicate student_it_access records found.');
    }
}

main();
