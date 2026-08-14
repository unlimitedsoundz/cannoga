const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function updateDB() {
  const { data: rows, error } = await supabase.from('page_content').select('*');
  if (error) { console.error('Fetch error:', error); return; }

  let updatedCount = 0;

  for (const r of rows) {
    let newContent = r.content;
    if (!newContent) continue;

    // Replace Cannoga.online with cannogacollege.ca
    if (newContent.includes('Cannoga.online') || newContent.includes('cannoga.online')) {
      newContent = newContent.replace(/Cannoga\.online/gi, 'cannogacollege.ca');
    }

    // ID 22 & 41 specific replacements
    if (r.id === 22 || r.id === 41) {
      newContent = newContent.replace(/href="https:\/\/[^"]*portal\/account\/register\/?"/gi, 'href="https://cannogacollege.ca/portal/account/register"');
      newContent = newContent.replace(/Fill the Application Form/gi, 'Fill in the online application 2026');
    }

    // ID 73 specific replacements
    if (r.id === 73) {
      try {
        const json = JSON.parse(newContent);
        if (json.steps && Array.isArray(json.steps)) {
          const step4 = json.steps.find(s => s.step === 4);
          if (step4) {
            step4.title = 'Fill in the Online Application 2026';
            step4.link = '/portal/account/register';
            step4.linkText = 'Fill in the online application 2026';
          }
          newContent = JSON.stringify(json);
        }
      } catch (e) {
        console.error('JSON parse error row 73:', e);
      }
    }

    if (newContent !== r.content) {
      console.log('Updating ID:', r.id, r.page_slug, r.section_key);
      const { error: updateErr } = await supabase
        .from('page_content')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', r.id);

      if (updateErr) console.error('Update err ID', r.id, updateErr);
      else updatedCount++;
    }
  }

  console.log('✅ Successfully updated', updatedCount, 'rows in page_content table in database.');
}

updateDB();
