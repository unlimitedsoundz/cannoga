require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for inserts
);

async function addDummyData() {
  try {
    console.log('Adding dummy news...');
    const dummyNews = [
      {
        title: 'Welcome to Cannoga College 2026',
        slug: 'welcome-2026',
        content: 'We are excited to welcome our new students for the 2026 academic year. Our campus is ready with state-of-the-art facilities and dedicated faculty.',
        excerpt: 'Exciting start to the 2026 academic year at Cannoga College.',
        imageUrl: '/images/campus-welcome.jpg',
        publishDate: new Date('2026-04-01T00:00:00Z').toISOString(),
        published: true
      },
      {
        title: 'New Research Partnership Announced',
        slug: 'research-partnership-2026',
        content: 'Cannoga College has partnered with leading research institutions to advance innovation in technology and science.',
        excerpt: 'Groundbreaking research partnership to drive innovation.',
        imageUrl: '/images/research.jpg',
        publishDate: new Date('2026-04-05T00:00:00Z').toISOString(),
        published: true
      }
    ];

    for (const news of dummyNews) {
      const { error } = await supabase.from('News').insert(news);
      if (error) console.error('Insert news error:', error);
      else console.log('Inserted news:', news.title);
    }

    console.log('Adding dummy events...');
    const dummyEvents = [
      {
        title: 'Spring Career Fair 2026',
        slug: 'spring-career-fair-2026',
        date: new Date('2026-05-15T10:00:00Z').toISOString(),
        endDate: new Date('2026-05-15T16:00:00Z').toISOString(),
        location: 'Main Campus Auditorium',
        category: 'Career',
        content: 'Join us for our annual Spring Career Fair featuring top employers from various industries.',
        imageUrl: '/images/career-fair.jpg',
        published: true
      },
      {
        title: 'International Student Orientation',
        slug: 'orientation-2026',
        date: new Date('2026-08-20T09:00:00Z').toISOString(),
        location: 'Student Center',
        category: 'Orientation',
        content: 'Orientation session for new international students arriving for the fall semester.',
        imageUrl: '/images/orientation.jpg',
        published: true
      }
    ];

    for (const event of dummyEvents) {
      const { error } = await supabase.from('Event').insert(event);
      if (error) console.error('Insert event error:', error);
      else console.log('Inserted event:', event.title);
    }

    console.log('Dummy data added successfully!');

  } catch (error) {
    console.error('Script error:', error);
  }
}

addDummyData();
