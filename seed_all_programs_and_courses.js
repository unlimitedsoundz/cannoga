const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SCHOOLS = [
  { id: 'sch-business', name: 'School of Business', slug: 'business', description: 'Empowering future corporate leaders, entrepreneurs, and financial strategists through rigorous practical business education.' },
  { id: 'sch-technology', name: 'School of Technology', slug: 'technology', description: 'Advancing technical innovation in software engineering, artificial intelligence, cybersecurity, and digital infrastructure.' },
  { id: 'sch-arts-design', name: 'School of Arts & Design', slug: 'arts-design', description: 'Fostering creative expression, digital media production, interaction design, and visual storytelling.' },
  { id: 'sch-health-sciences', name: 'School of Health & Life Sciences', slug: 'health-sciences', description: 'Dedicated to excellence in patient care, health services administration, kinesiology, and biomedical research.' },
  { id: 'sch-education-social', name: 'School of Education & Social Sciences', slug: 'education-social-sciences', description: 'Preparing transformative educators, policy analysts, legal professionals, and social leaders.' }
];

const DEPARTMENTS = [
  { id: 'dept-acc-law', schoolId: 'sch-business', name: 'Department of Accounting & Business Law', slug: 'accounting-business-law', description: 'Specialized education in corporate taxation, forensic auditing, and commercial legal compliance.' },
  { id: 'dept-comp-digital', schoolId: 'sch-technology', name: 'Department of Computer Science & Digital Media', slug: 'computer-science-digital', description: 'Leading-edge research and instruction in AI, cloud computing, full-stack software development, and network security.' },
  { id: 'dept-finance', schoolId: 'sch-business', name: 'Department of Finance', slug: 'finance', description: 'Global financial analytics, quantitative portfolio management, and investment strategy.' },
  { id: 'dept-management', schoolId: 'sch-business', name: 'Department of Management', slug: 'management', description: 'Strategic organizational management, global supply chain logistics, and executive leadership.' },
  { id: 'dept-marketing', schoolId: 'sch-business', name: 'Department of Marketing', slug: 'marketing', description: 'Digital marketing analytics, consumer behavior, brand management, and strategic communications.' },
  { id: 'dept-civil-env', schoolId: 'sch-technology', name: 'Department of Civil & Environmental Engineering', slug: 'civil-environmental', description: 'Sustainable urban infrastructure design, environmental impact modeling, and structural engineering.' },
  { id: 'dept-elec-mech', schoolId: 'sch-technology', name: 'Department of Electrical & Automation Engineering', slug: 'electrical-electronics', description: 'Robotics, industrial automation, power distribution, and embedded electrical systems.' },
  { id: 'dept-art-media', schoolId: 'sch-arts-design', name: 'Department of Art & Interactive Media', slug: 'art-media', description: 'Game development, digital media arts, graphic communication, and interactive experience design.' }
];

const COURSES = [
  {
    id: 'management-diploma',
    title: 'Management & Business Leadership Diploma',
    slug: 'management-diploma',
    schoolId: 'sch-business',
    departmentId: 'dept-management',
    degreeLevel: 'DIPLOMA',
    duration: '2 Years',
    credits: 60,
    language: 'English',
    description: 'Comprehensive 2-year diploma focused on strategic organizational management, project leadership, financial accounting, and business operations.',
    entryRequirements: 'Secondary School Diploma (OSSD or equivalent) with minimum 65% in Senior English.',
    minimumGrade: 'B- / 70%',
    careerPaths: 'Operations Manager, Business Operations Analyst, Project Coordinator, Team Leader.'
  },
  {
    id: 'management-bachelor',
    title: 'Bachelor of Business Management (BBM)',
    slug: 'management-bachelor',
    schoolId: 'sch-business',
    departmentId: 'dept-management',
    degreeLevel: 'BACHELOR',
    duration: '4 Years',
    credits: 120,
    language: 'English',
    description: 'Four-year undergraduate degree with integrated co-op work term placement, strategic capstone, and international business analytics.',
    entryRequirements: 'Secondary School Diploma (OSSD or equivalent) with 6 Grade 12 U/M courses including English & Mathematics.',
    minimumGrade: 'B / 75%',
    careerPaths: 'Executive Director, Management Consultant, Corporate Strategist, Regional Supply Director.'
  },
  {
    id: 'accounting-business-law-diploma',
    title: 'Accounting & Business Law Diploma',
    slug: 'accounting-business-law-diploma',
    schoolId: 'sch-business',
    departmentId: 'dept-acc-law',
    degreeLevel: 'DIPLOMA',
    duration: '2 Years',
    credits: 60,
    language: 'English',
    description: 'Intensive practical training in corporate financial accounting, taxation principles, payroll administration, and commercial law.',
    entryRequirements: 'High School Diploma (OSSD) with Grade 12 Math and English.',
    minimumGrade: 'B- / 70%',
    careerPaths: 'Tax Specialist, Payroll Administrator, Forensic Accounting Associate, Compliance Specialist.'
  },
  {
    id: 'computer-science-digital-bachelor',
    title: 'Bachelor of Applied Computer Science & Software Engineering',
    slug: 'computer-science-digital-bachelor',
    schoolId: 'sch-technology',
    departmentId: 'dept-comp-digital',
    degreeLevel: 'BACHELOR',
    duration: '4 Years',
    credits: 120,
    language: 'English',
    description: 'Advanced degree covering artificial intelligence algorithms, distributed systems architecture, cloud computing, and cybersecurity defense.',
    entryRequirements: 'OSSD with minimum 75% average in Grade 12 Advanced Functions, Calculus & Physics.',
    minimumGrade: 'B+ / 78%',
    careerPaths: 'Full Stack Software Engineer, Cloud Architect, AI Systems Developer, Cybersecurity Specialist.'
  },
  {
    id: 'finance-bachelor',
    title: 'Bachelor of Commerce in Global Finance',
    slug: 'finance-bachelor',
    schoolId: 'sch-business',
    departmentId: 'dept-finance',
    degreeLevel: 'BACHELOR',
    duration: '4 Years',
    credits: 120,
    language: 'English',
    description: 'Specialized financial degree focused on quantitative risk modeling, investment banking strategies, fintech innovation, and portfolio management.',
    entryRequirements: 'OSSD with Grade 12 Advanced Functions & Data Management.',
    minimumGrade: 'B / 75%',
    careerPaths: 'Financial Analyst, Investment Banker, Portfolio Manager, Risk Risk Advisor.'
  }
];

async function seedDatabase() {
  console.log('Seeding Schools...');
  for (const s of SCHOOLS) {
    const { error } = await supabase.from('School').upsert(s, { onConflict: 'slug' });
    if (error) console.error(`School ${s.slug} error:`, error.message);
  }

  console.log('Seeding Departments...');
  for (const d of DEPARTMENTS) {
    const { error } = await supabase.from('Department').upsert(d, { onConflict: 'slug' });
    if (error) console.error(`Department ${d.slug} error:`, error.message);
  }

  console.log('Seeding Courses...');
  for (const c of COURSES) {
    const { error: cErr } = await supabase.from('Course').upsert(c, { onConflict: 'slug' });
    if (cErr) console.error(`Course ${c.slug} error:`, cErr.message);
  }

  console.log('Seeding complete! All academic records saved to Supabase DB.');
}

seedDatabase().catch(console.error);
