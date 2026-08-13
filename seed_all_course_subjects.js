const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SUBJECTS_BY_COURSE = [
  // 1. Management Diploma
  { id: 'subj-mgt-101', courseId: 'management-diploma', code: 'MGT-101', name: 'Principles of Organizational Management', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-mgt-102', courseId: 'management-diploma', code: 'MGT-102', name: 'Business Communication & Professional Ethics', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-mgt-201', courseId: 'management-diploma', code: 'MGT-201', name: 'Financial Accounting for Managers', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-101' },
  { id: 'subj-mgt-202', courseId: 'management-diploma', code: 'MGT-202', name: 'Human Resource Management & Labor Relations', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-101' },
  { id: 'subj-mgt-301', courseId: 'management-diploma', code: 'MGT-301', name: 'Global Supply Chain & Operations Logistics', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'MGT-201' },
  { id: 'subj-mgt-302', courseId: 'management-diploma', code: 'MGT-302', name: 'Strategic Leadership & Enterprise Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' },

  // 2. Bachelor of Business Management
  { id: 'subj-mgt-b101', courseId: 'management-bachelor', code: 'MGT-100', name: 'Introduction to Global Enterprise', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-mgt-b102', courseId: 'management-bachelor', code: 'BUS-110', name: 'Microeconomics for Decision Makers', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-mgt-b201', courseId: 'management-bachelor', code: 'MGT-220', name: 'Corporate Finance & Valuation', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-100' },
  { id: 'subj-mgt-b202', courseId: 'management-bachelor', code: 'MGT-250', name: 'Organizational Behavior & Cross-Cultural Leadership', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'MGT-100' },
  { id: 'subj-mgt-b301', courseId: 'management-bachelor', code: 'MGT-340', name: 'Operations & Supply Chain Analytics', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'MGT-220' },
  { id: 'subj-mgt-b401', courseId: 'management-bachelor', code: 'MGT-490', name: 'Senior Executive Capstone & Co-op Work Term', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Senior Standing' },

  // 3. Accounting & Business Law Diploma
  { id: 'subj-acc-101', courseId: 'accounting-business-law-diploma', code: 'ACC-101', name: 'Financial Accounting Standards I', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-law-102', courseId: 'accounting-business-law-diploma', code: 'LAW-102', name: 'Canadian Commercial & Business Law', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-acc-201', courseId: 'accounting-business-law-diploma', code: 'ACC-201', name: 'Managerial Cost Accounting & Auditing', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'ACC-101' },
  { id: 'subj-tax-202', courseId: 'accounting-business-law-diploma', code: 'TAX-202', name: 'Corporate & Personal Taxation Principles', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'ACC-101' },
  { id: 'subj-acc-301', courseId: 'accounting-business-law-diploma', code: 'ACC-301', name: 'Forensic Accounting & Corporate Fraud', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'ACC-201' },
  { id: 'subj-acc-302', courseId: 'accounting-business-law-diploma', code: 'ACC-302', name: 'Accounting Information Systems Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' },

  // 4. Computer Science & Software Engineering Bachelor
  { id: 'subj-cs-101', courseId: 'computer-science-digital-bachelor', code: 'CS-101', name: 'Data Structures & Algorithm Design', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-cs-102', courseId: 'computer-science-digital-bachelor', code: 'CS-102', name: 'Full-Stack Web Architecture & REST APIs', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-cs-201', courseId: 'computer-science-digital-bachelor', code: 'CS-201', name: 'Cloud Infrastructure & DevOps Automation', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'CS-101' },
  { id: 'subj-cs-202', courseId: 'computer-science-digital-bachelor', code: 'CS-202', name: 'Database Engineering & Distributed Systems', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'CS-101' },
  { id: 'subj-cs-301', courseId: 'computer-science-digital-bachelor', code: 'CS-301', name: 'Cybersecurity Operations & Network Defense', creditUnits: 6, semester: 3, area: 'Advanced', eligibility: 'CS-201' },
  { id: 'subj-cs-302', courseId: 'computer-science-digital-bachelor', code: 'CS-302', name: 'Artificial Intelligence & Machine Learning Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' },

  // 5. Global Finance Bachelor
  { id: 'subj-fin-101', courseId: 'finance-bachelor', code: 'FIN-101', name: 'Corporate Financial Strategy', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-fin-102', courseId: 'finance-bachelor', code: 'FIN-102', name: 'Quantitative Methods for Finance', creditUnits: 6, semester: 1, area: 'Core', eligibility: 'Open Enrollment' },
  { id: 'subj-fin-201', courseId: 'finance-bachelor', code: 'FIN-201', name: 'Investment Banking & Equity Markets', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'FIN-101' },
  { id: 'subj-fin-202', courseId: 'finance-bachelor', code: 'FIN-202', name: 'International Risk Management & Fintech', creditUnits: 6, semester: 2, area: 'Specialization', eligibility: 'FIN-101' },
  { id: 'subj-fin-301', courseId: 'finance-bachelor', code: 'FIN-301', name: 'Portfolio Management & Derivatives Capstone', creditUnits: 12, semester: 4, area: 'Capstone', eligibility: 'Completion of 30 CR' }
];

async function seedSubjects() {
  console.log('Seeding Subject records into Supabase DB...');
  for (const s of SUBJECTS_BY_COURSE) {
    const { error } = await supabase.from('Subject').upsert(s, { onConflict: 'id' });
    if (error) console.error(`Error inserting subject ${s.code}:`, error.message);
  }
  console.log('Successfully seeded all subjects into Supabase DB!');
}

seedSubjects().catch(console.error);
