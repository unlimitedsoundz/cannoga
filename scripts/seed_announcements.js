const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newsItems = [
  {
    title: 'Welcome to Cannoga College',
    excerpt: 'We welcome all new and returning students for the upcoming Fall semester at Cannoga College Ottawa Campus.',
    content: 'We welcome all new and returning students for the upcoming Fall semester. Our campus facilities, academic support services, and digital resources are fully prepared to support your learning journey.',
    priority: 'normal',
    status: 'published',
    publish_start: new Date('2026-08-04T09:00:00Z').toISOString(),
    created_at: new Date('2026-08-04T09:00:00Z').toISOString()
  },
  {
    title: 'Fall 2026 Intake Open',
    excerpt: 'Applications are now officially open for the Fall 2026 academic intake across all undergraduate and diploma programs.',
    content: 'Applications are now open for the Fall 2026 intake. Prospective international and domestic students can submit their documents directly through the Cannoga Student Application Portal.',
    priority: 'normal',
    status: 'published',
    publish_start: new Date('2026-08-04T10:00:00Z').toISOString(),
    created_at: new Date('2026-08-04T10:00:00Z').toISOString()
  },
  {
    title: 'Academic Orientation & Check-In Schedule',
    excerpt: 'Mandatory orientation sessions and campus check-in schedules for all incoming international and domestic students.',
    content: 'Welcome to Cannoga College! Please review your orientation schedule and room assignments in the Student Information System portal.',
    priority: 'high',
    status: 'published',
    publish_start: new Date('2026-08-10T09:00:00Z').toISOString(),
    created_at: new Date('2026-08-10T09:00:00Z').toISOString()
  },
  {
    title: 'Debbie Voice Agent Assistant Available 24/7',
    excerpt: 'Get instant answers for admissions, tuition inquiries, and student services via voice call or online chat.',
    content: 'Debbie, our AI Voice Assistant, is now live 24/7 to answer student questions regarding registration, financial aid, and timetable access. Dial +1 227 250 0427 to speak with Debbie.',
    priority: 'normal',
    status: 'published',
    publish_start: new Date('2026-08-12T09:00:00Z').toISOString(),
    created_at: new Date('2026-08-12T09:00:00Z').toISOString()
  },
  {
    title: 'Campus Library & Digital Resource Hours',
    excerpt: 'Extended operating hours and online database access available 24/7 for research and coursework.',
    content: 'Access thousands of e-books, academic journals, and study spaces directly through your student credentials at the Cannoga Library.',
    priority: 'normal',
    status: 'published',
    publish_start: new Date('2026-08-14T09:00:00Z').toISOString(),
    created_at: new Date('2026-08-14T09:00:00Z').toISOString()
  }
];

async function seedAnnouncements() {
  console.log('Seeding news items to announcements table in Supabase...');

  for (const item of newsItems) {
    // Check if title already exists to prevent duplicate seeding
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('title', item.title)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`- Item already exists in DB: "${item.title}"`);
    } else {
      const { data, error } = await supabase
        .from('announcements')
        .insert([item])
        .select();

      if (error) {
        console.error(`Error inserting "${item.title}":`, error.message);
      } else {
        console.log(`+ Successfully inserted announcement: "${item.title}"`);
      }
    }
  }

  console.log('Finished seeding announcements table successfully!');
}

seedAnnouncements();
