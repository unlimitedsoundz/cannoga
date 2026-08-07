import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('=== PAGE CONTENT VERIFICATION ===\n');
    
    // Get all page_content records
    const { data: records, error } = await supabase.from('page_content').select('page_slug, section_key, content').order('page_slug', { ascending: true });
    
    if (error) {
        console.error('Error fetching page_content:', error);
        return;
    }
    
    console.log(`Total records: ${records?.length || 0}\n`);
    
    // Group by page_slug
    const byPage: Record<string, any[]> = {};
    for (const row of records || []) {
        if (!byPage[row.page_slug]) byPage[row.page_slug] = [];
        byPage[row.page_slug].push(row);
    }
    
    console.log(`Pages with content: ${Object.keys(byPage).length}`);
    console.log(`Pages: ${Object.keys(byPage).join(', ')}\n`);
    
    // Check for old branding references
    console.log('=== CHECKING FOR OLD BRANDING REFERENCES ===\n');
    
    const oldBrands = ['Heffring', 'Kestora', 'Finland', 'Finnish', 'Helsinki', 'Migri', 'heffring.online', 'heffring.fi', 'admissions@heffring'];
    let foundIssues = false;
    
    for (const [pageSlug, rows] of Object.entries(byPage)) {
        for (const row of rows) {
            for (const brand of oldBrands) {
                if (row.content && row.content.toLowerCase().includes(brand.toLowerCase())) {
                    console.log(`⚠️  Found "${brand}" in ${pageSlug} / ${row.section_key}`);
                    console.log(`   Content preview: ${row.content?.substring(0, 150)}...\n`);
                    foundIssues = true;
                }
            }
        }
    }
    
    if (!foundIssues) {
        console.log('✅ No old branding references found in page_content\n');
    }
    
    // Sample check - show first 3 records fully
    console.log('=== SAMPLE RECORDS (first 3) ===\n');
    for (const row of (records || []).slice(0, 3)) {
        console.log(`Page: ${row.page_slug} / Section: ${row.section_key}`);
        console.log(`Content: ${row.content?.substring(0, 200)}...`);
        console.log('');
    }
}

main();