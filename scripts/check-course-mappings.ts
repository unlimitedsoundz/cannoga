import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const { data: courses } = await supabase.from('Course').select('id, title, slug');
    const courseMap = new Map((courses || []).map(c => [c.slug, c.id]));

    const mappings = [
        { slug: 'data-science-bachelor', oldId: '49b84c9a-009f-4840-a61c-27abaf03fc07' },
        { slug: 'personal-support-worker-cert', oldId: '6a24f1f1-e11a-4454-afe0-b1406ac1929e' },
        { slug: 'educational-assistant-cert', oldId: 'f006c2a0-53fa-4f01-9f5f-58a3244d7544' },
    ];

    console.log('Course ID mappings needed:');
    for (const m of mappings) {
        const newId = courseMap.get(m.slug);
        if (newId) {
            console.log(`  ${m.slug}: ${m.oldId} -> ${newId}`);
        } else {
            console.log(`  ${m.slug}: NOT FOUND IN DATABASE`);
        }
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});