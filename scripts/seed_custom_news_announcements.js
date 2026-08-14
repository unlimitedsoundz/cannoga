const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const userNewsItems = [
  {
    title: "New Partnerships Announced with Ottawa Tech Sector for Co-op Placements",
    slug: "ottawa-coop-partnerships",
    content: "Cannoga College is proud to announce eight new strategic industry partnerships with prominent technology, engineering, and cybersecurity enterprises across the National Capital Region.\n\nThese agreements will create over 150 new paid co-op placements annually for students enrolled in Business Administration, Computer Science, Cyber Security, and Software Engineering programs.\n\nPartner Organizations Include:\n- Kanata North Tech Association Hub\n- Ottawa CleanTech Solutions Inc.\n- Apex Cyber Defense Networks\n- Capital Data Analytics Group\n- Ottawa BioMed Technologies\n- NextGen Cloud Systems Canada\n- Federal Public Sector IT Contractors Network\n- Ottawa Renewable Energy Research Co.\n\nEmpowering Students with Real-World Experience\nCo-op placements provide students with hands-on, paid work experience integrated directly into their academic curriculum. Students work alongside senior engineers, software architects, and project managers, gaining invaluable workplace exposure before graduation.\n\n\"Ottawa's tech sector is booming, and our companies urgently require talented, job-ready graduates,\" said Sarah Jenkins, Executive Director of the Kanata North Tech Association. \"Cannoga College has proven to be an exceptional talent pipeline for our member companies.\"\n\nCo-op Program Structure & PGWP Support\nInternational and domestic students participating in Cannoga's co-op programs receive full support from the Career Services Centre, including resume workshops, mock interview sessions, and dedicated co-op advisors.\n\nFor international students, co-op work terms are fully compliant with Immigration, Refugees and Citizenship Canada (IRCC) co-op work permit requirements and count toward valuable Canadian work experience.",
    excerpt: "Eight leading Ottawa technology and engineering firms have signed formal agreements to provide paid co-op placements for Cannoga College students starting Autumn 2026.",
    imageUrl: "/images/home-carousel-2.png",
    publish_start: "2026-02-08 00:00:00",
    priority: "normal",
    status: "published",
    created_at: "2026-08-14 10:12:44.367"
  },
  {
    title: "Cannoga Launches Next-Generation Applied AI & Tech Innovation Hub",
    slug: "cannoga-launches-ai-tech-hub",
    content: "Cannoga College has officially opened its new $12-million Applied AI & Tech Innovation Hub at the Ottawa campus, marking a major milestone in practical technology education in Ontario.\n\nThe facility features high-performance GPU computing clusters, dedicated robotics testing arenas, cybersecurity simulation labs, and collaborative workspace for student startups and faculty researchers.\n\nCore Capabilities of the New AI Hub:\n\n1. Artificial Intelligence & Machine Learning Lab\nEquipped with enterprise-grade server infrastructure, allowing students to train large language models, computer vision systems, and predictive analytics applications.\n\n2. Cyber Security Operations Center (SOC)\nA simulated enterprise network environment where cybersecurity students learn real-time threat detection, incident response, and ethical hacking protocols.\n\n3. Applied Industry Research Hub\nSmall and medium-sized enterprises (SMEs) across Eastern Ontario will collaborate directly with Cannoga faculty and students to develop AI prototypes and test automation solutions.\n\n\"The Applied AI Hub is not just a building; it is a catalyst for innovation,\" said Dr. Marcus Thorne, Dean of the School of Technology. \"Our students will work on real-world challenges using the exact tools and infrastructure employed by top technology firms globally.\"\n\nStudent Hackathons and Industry Mentorship\nStarting Autumn 2026, the Hub will host annual student hackathons, industry pitch competitions, and developer workshops featuring guest speakers from leading global tech companies.",
    excerpt: "A state-of-the-art research facility dedicated to artificial intelligence, machine learning, robotics, and cybersecurity opens at the Ottawa main campus.",
    imageUrl: "/images/technology.jpg",
    publish_start: "2026-02-01 00:00:00",
    priority: "normal",
    status: "published",
    created_at: "2026-08-14 10:12:44.731"
  },
  {
    title: "Cannoga College Recognized as Top Ontario Institution for Graduate Employment",
    slug: "cannoga-graduate-employment-2026",
    content: "Cannoga College has achieved the highest graduate employment rate among Ontario post-secondary institutions, according to the annual Key Performance Indicators (KPI) survey released by the Ministry of Colleges and Universities.\n\nThe report highlights that 94.2% of Cannoga College graduates secured full-time employment in their field of study within six months of completing their diploma or degree. Furthermore, employer satisfaction with Cannoga graduates reached an outstanding 96.8%.\n\nKey Highlights from the 2026 Ministry KPI Report:\n\n1. Exceptional Placement in Technology & Healthcare\nGraduates from the School of Technology and the School of Health & Community Services achieved a near-perfect 98% employment rate, driven by acute industry demand across Eastern Ontario and Ottawa's technology cluster.\n\n2. Strong Earnings and Career Advancement\nThe survey indicated that Cannoga alumni start with competitive starting salaries that exceed the provincial average for college graduates, with over 78% reporting opportunities for career advancement within their first year.\n\n3. Employer Satisfaction and Industry Readiness\nEmployers cited strong practical competencies, project management skills, and hands-on laboratory experience as key differentiators of Cannoga alumni.\n\n\"Our commitment to experiential learning, state-of-the-art lab environments, and direct industry collaboration ensures that our students step out of the classroom and directly into meaningful careers,\" stated Dr. Robert Vance, Vice-President Academic.\n\n\"This recognition reflects the dedication of our faculty and the tremendous effort of our students and industry partners.\"\n\nPreparing for the Future of Work\nAs Ottawa continues to grow as North America's leading tech hub, Cannoga College remains focused on expanding co-op opportunities, industry-sponsored capstone projects, and specialized micro-credentials designed for modern workforce demands.",
    excerpt: "The latest Ministry of Colleges and Universities KPI survey confirms Cannoga graduates lead provincial employment outcomes, achieving a 94.2% placement rate within six months of graduation.",
    imageUrl: "/images/home-carousel-1.png",
    publish_start: "2026-02-10 00:00:00",
    priority: "normal",
    status: "published",
    created_at: "2026-08-14 10:12:44.102"
  },
  {
    title: "Why Study in Ottawa Canada? 10 Reasons International Students Choose Ottawa",
    slug: "why-study-in-ottawa-canada",
    content: "Ottawa offers international students world-class education, safety, high quality of life, and incredible co-op career opportunities in technology and public sector governance.",
    excerpt: "Canada has become one of North America's premier study destinations. From world-class education to a thriving tech scene, discover why students are flocking to Ottawa.",
    imageUrl: "/images/news/why-study-in-ottawa.jpg",
    publish_start: "2026-02-14 00:00:00",
    priority: "normal",
    status: "published",
    created_at: "2026-08-14 10:12:43.843"
  }
];

async function seedUserNewsToAnnouncements() {
  console.log('Seeding provided 4 news items into announcements table...');

  for (const item of userNewsItems) {
    // Check if title already exists in announcements
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('title', item.title)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`- Updating existing announcement: "${item.title}"`);
      const { error } = await supabase
        .from('announcements')
        .update({
          excerpt: item.excerpt,
          content: item.content,
          priority: item.priority,
          status: item.status,
          publish_start: item.publish_start,
        })
        .eq('title', item.title);

      if (error) console.error(`Error updating "${item.title}":`, error.message);
    } else {
      console.log(`+ Inserting new announcement: "${item.title}"`);
      const { error } = await supabase
        .from('announcements')
        .insert([{
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          priority: item.priority,
          status: item.status,
          publish_start: item.publish_start,
          created_at: item.created_at
        }]);

      if (error) console.error(`Error inserting "${item.title}":`, error.message);
    }
  }

  console.log('All 4 news items successfully seeded into announcements table!');
}

seedUserNewsToAnnouncements();
