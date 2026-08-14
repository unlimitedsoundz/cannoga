require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verify() {
  try {
    const { data: news, error: newsErr } = await supabase.from('News').select('*');
    if (newsErr) throw newsErr;

    const { data: events, error: eventsErr } = await supabase.from('Event').select('*');
    if (eventsErr) throw eventsErr;

    let newsMatches = [];
    let eventMatches = [];

    const searchRegex = /cannoga|cannogo|ottawa|canada/i;

    news.forEach(item => {
      const matchFields = [];
      ['title', 'slug', 'excerpt', 'content'].forEach(key => {
        if (item[key] && searchRegex.test(item[key])) {
          matchFields.push(key);
        }
      });
      if (matchFields.length > 0) {
        newsMatches.push({ id: item.id, fields: matchFields });
      }
    });

    events.forEach(item => {
      const matchFields = [];
      ['title', 'slug', 'content', 'location'].forEach(key => {
        if (item[key] && searchRegex.test(item[key])) {
          matchFields.push(key);
        }
      });
      if (matchFields.length > 0) {
        eventMatches.push({ id: item.id, fields: matchFields });
      }
    });

    console.log('=== VERICACATION RESULTS ===');
    console.log(`News matches remaining: ${newsMatches.length}`);
    if (newsMatches.length > 0) {
      console.log('Details:', JSON.stringify(newsMatches, null, 2));
    }

    console.log(`Event matches remaining: ${eventMatches.length}`);
    if (eventMatches.length > 0) {
      console.log('Details:', JSON.stringify(eventMatches, null, 2));
    }

    if (newsMatches.length === 0 && eventMatches.length === 0) {
      console.log('Success! No matches found for legacy terms in News and Event tables.');
    } else {
      console.log('Warning: Some legacy terms are still present. Review the details above.');
    }
  } catch (err) {
    console.error('Error during verification:', err);
  }
}

verify();
