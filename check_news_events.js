require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  try {
    console.log('Checking News table...');
    const { data: news, error: newsError } = await supabase
      .from('News')
      .select('*')
      .eq('published', true);

    if (newsError) {
      console.error('News query error:', newsError);
    } else {
      console.log(`Found ${news.length} published news items`);
      if (news.length > 0) {
        console.log('Sample news:', news.slice(0, 2).map(n => ({ title: n.title, slug: n.slug, publishDate: n.publishDate })));
      }
    }

    console.log('Checking Event table...');
    const { data: events, error: eventsError } = await supabase
      .from('Event')
      .select('*')
      .eq('published', true);

    if (eventsError) {
      console.error('Events query error:', eventsError);
    } else {
      console.log(`Found ${events.length} published events`);
      if (events.length > 0) {
        console.log('Sample events:', events.slice(0, 2).map(e => ({ title: e.title, slug: e.slug, date: e.date })));
      }
    }

    // Also check total counts
    const { count: newsCount } = await supabase
      .from('News')
      .select('*', { count: 'exact', head: true });

    const { count: eventCount } = await supabase
      .from('Event')
      .select('*', { count: 'exact', head: true });

    console.log(`Total news records: ${newsCount}, Total event records: ${eventCount}`);

  } catch (error) {
    console.error('Script error:', error);
  }
}

checkTables();