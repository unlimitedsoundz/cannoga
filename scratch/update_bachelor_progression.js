const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateContent() {
    console.log('🔍 Fetching the row...');
    const { data: row, error: fetchError } = await supabase
        .from('page_content')
        .select('id, content')
        .eq('id', 16)
        .single();

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        process.exit(1);
    }

    console.log('Old content:', row.content);

    const oldParagraph = '<p>For information about Bachelor\'s programmes at Cannoga in Canadian and Swedish, please visit our dedicated page for <a target="_blank" rel="noopener noreferrer" href="https://cannoga.fi/admissions/bachelor-fi/"><u>Canadian- and Swedish-language Bachelor\'s Degrees</u> </a>(available in Canadian/Swedish only).</p>';
    
    // Also try a regex replacement in case of spacing/attributes
    let newContent = row.content.replace(/<p>For information about Bachelor's programmes at Cannoga in Canadian and Swedish.*<\/p>/gi, '');
    
    // Trim extra spaces
    newContent = newContent.trim();

    console.log('New content:', newContent);

    if (newContent === row.content) {
        console.log('No change detected, check pattern match!');
        process.exit(1);
    }

    const { error: updateError } = await supabase
        .from('page_content')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', 16);

    if (updateError) {
        console.error('Update error:', updateError);
        process.exit(1);
    }

    console.log('✅ Successfully updated page_content row 16!');
}

updateContent().catch(console.error);
