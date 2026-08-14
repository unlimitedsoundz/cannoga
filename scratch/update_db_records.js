require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use service role key to ensure we bypass RLS and can update records
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function cleanSlug(slug) {
  if (!slug) return slug;
  let s = slug.toLowerCase();
  
  // Handlers for specific slugs
  s = s.replace(/cannoga-college-ottawa-campus-2026/, 'heffring-university-helsinki-campus-2026');
  s = s.replace(/spring-break-ottawa-2026/, 'spring-break-helsinki-2026');
  s = s.replace(/study-in-ottawa,\s*canada-masterclass/, 'study-in-helsinki-finland-masterclass');
  s = s.replace(/study-in-ottawa,\s*canada/, 'study-in-helsinki-finland');
  
  // Generic replacements
  s = s.replace(/cannoga-college/g, 'heffring-university');
  s = s.replace(/cannoga/g, 'heffring');
  s = s.replace(/ottawa/g, 'helsinki');
  s = s.replace(/canada/g, 'finland');
  
  // Remove or replace non-alphanumeric chars (except hyphens)
  s = s.replace(/[^a-z0-9\-]/g, '-');
  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');
  // Trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, '');
  
  return s;
}

function applyReplacements(text) {
  if (typeof text !== 'string') return text;
  
  let newText = text;
  
  // 1. Handle domains and emails first
  newText = newText.replace(/cannogacollege\.ca/gi, 'cannogacollege.ca');
  
  // 2. Handle specific combinations to avoid double naming
  newText = newText.replace(/Ottawa,\s*Canada/g, 'Ottawa, Ontario, Canada');
  newText = newText.replace(/ottawa,\s*canada/g, 'helsinki, finland');
  newText = newText.replace(/Ottawa-area/g, 'Ottawa-area');
  newText = newText.replace(/Ottawa\s+River/g, 'Vantaa River');
  newText = newText.replace(/Ottawa\s+Campus/g, 'Ottawa campus');
  newText = newText.replace(/expanded\s+Ottawa\s+campus/gi, 'expanded Ottawa campus');
  newText = newText.replace(/Ottawa\s+Community\s+Housing/g, 'Ottawa Community Housing');
  newText = newText.replace(/city\s+of\s+Ottawa/gi, 'city of Ottawa');
  newText = newText.replace(/in\s+Ottawa\s+and\s+Canada/gi, 'in Ottawa and Canada');
  newText = newText.replace(/capital\s+city\s+of\s+Canada/gi, 'capital city of Canada');
  
  // 3. General replacements
  newText = newText.replace(/Cannoga College/g, 'Cannoga College');
  newText = newText.replace(/Cannogo Coillege/g, 'Cannoga College');
  newText = newText.replace(/Cannoga Student Association/g, 'Cannoga Student Association');
  newText = newText.replace(/Cannoga/g, 'Cannoga');
  newText = newText.replace(/cannoga/g, 'heffring');
  
  newText = newText.replace(/Ottawa/g, 'Ottawa, Ontario, Canada');
  newText = newText.replace(/ottawa/g, 'helsinki, finland');
  
  newText = newText.replace(/Canada's/g, "Canada's");
  newText = newText.replace(/canada's/g, "finland's");
  newText = newText.replace(/Canada/g, 'Canada');
  newText = newText.replace(/canada/g, 'finland');
  newText = newText.replace(/Canadian/g, 'Canadian');
  newText = newText.replace(/canadian/g, 'finnish');
  
  // Clean up any double spaces or comma/punctuation anomalies
  newText = newText.replace(/Ottawa, Ontario, Canada, Canada/g, 'Ottawa, Ontario, Canada');
  newText = newText.replace(/Ottawa, Ontario, Canada,\s*Canada/gi, 'Ottawa, Ontario, Canada');
  newText = newText.replace(/Ottawa, Ontario, Canada and Canada/g, 'Ottawa and Canada');
  newText = newText.replace(/Ottawa, Ontario, Canada\s+Campus/gi, 'Ottawa campus');
  newText = newText.replace(/expanded\s+Ottawa, Ontario, Canada\s+campus/gi, 'expanded Ottawa campus');
  
  return newText;
}

async function updateDatabase() {
  try {
    // 1. Fetch News
    const { data: news, error: newsErr } = await supabase.from('News').select('*');
    if (newsErr) throw newsErr;

    console.log(`Fetched ${news.length} news items.`);
    for (const item of news) {
      const updates = {};
      let changed = false;

      for (const key of ['title', 'slug', 'excerpt', 'content']) {
        if (item[key]) {
          const original = item[key];
          const updated = key === 'slug' ? cleanSlug(original) : applyReplacements(original);
          if (original !== updated) {
            updates[key] = updated;
            changed = true;
          }
        }
      }

      if (changed) {
        console.log(`Updating News record ID: ${item.id}...`);
        const { error: updateErr } = await supabase
          .from('News')
          .update(updates)
          .eq('id', item.id);
        
        if (updateErr) {
          console.error(`Failed to update News record ${item.id}:`, updateErr);
        } else {
          console.log(`Successfully updated News record ${item.id} with fields:`, Object.keys(updates));
        }
      }
    }

    // 2. Fetch Events
    const { data: events, error: eventsErr } = await supabase.from('Event').select('*');
    if (eventsErr) throw eventsErr;

    console.log(`Fetched ${events.length} event items.`);
    for (const item of events) {
      const updates = {};
      let changed = false;

      for (const key of ['title', 'slug', 'content', 'location']) {
        if (item[key]) {
          const original = item[key];
          const updated = key === 'slug' ? cleanSlug(original) : applyReplacements(original);
          if (original !== updated) {
            updates[key] = updated;
            changed = true;
          }
        }
      }

      if (changed) {
        console.log(`Updating Event record ID: ${item.id}...`);
        const { error: updateErr } = await supabase
          .from('Event')
          .update(updates)
          .eq('id', item.id);
        
        if (updateErr) {
          console.error(`Failed to update Event record ${item.id}:`, updateErr);
        } else {
          console.log(`Successfully updated Event record ${item.id} with fields:`, Object.keys(updates));
        }
      }
    }

    // 3. Fetch Students
    const { data: students, error: studentsErr } = await supabase.from('students').select('*');
    if (studentsErr) throw studentsErr;

    console.log(`Fetched ${students.length} student items.`);
    for (const item of students) {
      const updates = {};
      let changed = false;

      if (item.student_id && item.student_id.startsWith('CNC')) {
        updates.student_id = item.student_id.replace(/^CNC/, 'KU');
        changed = true;
      }

      if (item.institutional_email && item.institutional_email.includes('cannogacollege.ca')) {
        updates.institutional_email = item.institutional_email.replace(/@cannogacollege\.ca/gi, '@cannogacollege.ca');
        changed = true;
      }

      if (changed) {
        console.log(`Updating Student record ID: ${item.id}...`);
        const { error: updateErr } = await supabase
          .from('students')
          .update(updates)
          .eq('id', item.id);
        
        if (updateErr) {
          console.error(`Failed to update Student record ${item.id}:`, updateErr);
        } else {
          console.log(`Successfully updated Student record ${item.id} with fields:`, Object.keys(updates));
        }
      }
    }

    // 4. Fetch Profiles
    const { data: profiles, error: profilesErr } = await supabase.from('profiles').select('*');
    if (profilesErr) throw profilesErr;

    console.log(`Fetched ${profiles.length} profile items.`);
    for (const item of profiles) {
      const updates = {};
      let changed = false;

      if (item.student_id && item.student_id.startsWith('CNC')) {
        updates.student_id = item.student_id.replace(/^CNC/, 'KU');
        changed = true;
      }

      if (changed) {
        console.log(`Updating Profile record ID: ${item.id}...`);
        const { error: updateErr } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', item.id);
        
        if (updateErr) {
          console.error(`Failed to update Profile record ${item.id}:`, updateErr);
        } else {
          console.log(`Successfully updated Profile record ${item.id} with fields:`, Object.keys(updates));
        }
      }
    }

    console.log('Database update completed successfully.');
  } catch (err) {
    console.error('Error updating database:', err);
  }
}

updateDatabase();
