const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const courseData = {
  'business-foundations-cert': {
    prefix: 'BMF',
    area: 'Business Foundations',
    subjects: [
      "Introduction to Business",
      "Principles of Management",
      "Business Communications",
      "Financial Accounting Basics",
      "Marketing Fundamentals",
      "Computer Applications for Business",
      "Business Mathematics",
      "Professional Development"
    ]
  },
  'hr-management-cert': {
    prefix: 'HRM',
    area: 'Human Resources',
    subjects: [
      "Introduction to Human Resources",
      "Recruitment and Selection",
      "Compensation and Benefits",
      "Employment Law",
      "Training and Development",
      "Workplace Health and Safety",
      "Organizational Behaviour",
      "Human Resources Information Systems"
    ]
  },
  'accounting-fundamentals-cert': {
    prefix: 'ACC',
    area: 'Accounting',
    subjects: [
      "Financial Accounting I",
      "Managerial Accounting",
      "Payroll Administration",
      "Business Mathematics",
      "Introduction to Economics",
      "Computerized Accounting Systems",
      "Business Communications",
      "Spreadsheet Applications"
    ]
  },
  'entrepreneurship-cert': {
    prefix: 'ENT',
    area: 'Entrepreneurship',
    subjects: [
      "Entrepreneurship Principles",
      "Business Planning",
      "Marketing for Small Business",
      "Accounting for Entrepreneurs",
      "Digital Business Strategies",
      "Sales and Customer Relations",
      "Innovation and Creativity",
      "Leadership Skills"
    ]
  },
  'marketing-essentials-cert': {
    prefix: 'MKT',
    area: 'Marketing',
    subjects: [
      "Principles of Marketing",
      "Consumer Behaviour",
      "Digital Marketing Fundamentals",
      "Social Media Marketing",
      "Advertising Principles",
      "Market Research",
      "Business Communications",
      "Sales Techniques"
    ]
  },
  'project-management-cert': {
    prefix: 'PRM',
    area: 'Project Management',
    subjects: [
      "Foundations of Project Management",
      "Project Planning and Scheduling",
      "Risk Management",
      "Budgeting and Cost Control",
      "Leadership and Team Management",
      "Project Quality Management",
      "Procurement Management",
      "Project Software Applications"
    ]
  },
  'supply-chain-management-cert': {
    prefix: 'SCM',
    area: 'Supply Chain',
    subjects: [
      "Introduction to Supply Chains",
      "Purchasing and Procurement",
      "Logistics Management",
      "Inventory Control",
      "Transportation Systems",
      "Warehouse Operations",
      "International Trade",
      "Supply Chain Analytics"
    ]
  },
  'business-administration-dip': {
    prefix: 'BUS',
    area: 'Business Administration',
    subjects: [
      "Business Communications",
      "Principles of Management",
      "Financial Accounting",
      "Managerial Accounting",
      "Marketing Principles",
      "Human Resource Management",
      "Business Statistics",
      "Economics",
      "Operations Management",
      "Business Law",
      "Entrepreneurship",
      "Strategic Management"
    ]
  },
  'accounting-dip': {
    prefix: 'ACC',
    area: 'Accounting',
    subjects: [
      "Financial Accounting I & II",
      "Managerial Accounting",
      "Intermediate Accounting",
      "Taxation",
      "Auditing Principles",
      "Payroll Administration",
      "Economics",
      "Business Law",
      "Spreadsheet Applications",
      "Accounting Software Systems",
      "Statistics for Business",
      "Professional Ethics"
    ]
  },
  'marketing-dip': {
    prefix: 'MKT',
    area: 'Marketing',
    subjects: [
      "Marketing Principles",
      "Consumer Behaviour",
      "Digital Marketing",
      "Brand Management",
      "Advertising and Promotion",
      "Sales Management",
      "Market Research",
      "Social Media Marketing",
      "Retail Marketing",
      "E-Commerce",
      "Business Communications",
      "Strategic Marketing"
    ]
  },
  'hr-management-dip': {
    prefix: 'HRM',
    area: 'Human Resources',
    subjects: [
      "Human Resource Management",
      "Recruitment and Selection",
      "Compensation and Benefits",
      "Employment Law",
      "Labour Relations",
      "Organizational Behaviour",
      "Training and Development",
      "Workplace Diversity",
      "Performance Management",
      "Health and Safety",
      "HR Information Systems",
      "Leadership Skills"
    ]
  },
  'international-business-dip': {
    prefix: 'INB',
    area: 'International Business',
    subjects: [
      "International Trade",
      "Global Marketing",
      "Cross-Cultural Communication",
      "International Finance",
      "Supply Chain Management",
      "Business Law",
      "Import and Export Procedures",
      "Economics",
      "Logistics Management",
      "International Business Strategy",
      "Project Management",
      "Entrepreneurship"
    ]
  },
  'financial-services-dip': {
    prefix: 'CAN',
    area: 'Financial Services',
    subjects: [
      "Financial Planning",
      "Investment Fundamentals",
      "Personal Finance",
      "Banking Operations",
      "Risk Management",
      "Economics",
      "Accounting Principles",
      "Insurance Fundamentals",
      "Wealth Management",
      "Business Ethics",
      "Customer Relationship Management",
      "Financial Markets"
    ]
  },
  'supply-chain-logistics-dip': {
    prefix: 'SCM',
    area: 'Supply Chain & Logistics',
    subjects: [
      "Logistics Operations",
      "Inventory Management",
      "Procurement and Purchasing",
      "Transportation Systems",
      "Supply Chain Analytics",
      "International Trade",
      "Warehouse Management",
      "Operations Management",
      "Quality Assurance",
      "Project Management",
      "Business Communications",
      "Strategic Supply Chain Management"
    ]
  }
};

async function run() {
  console.log('Fetching course list...');
  const { data: courses, error: errCourses } = await supabase
    .from('Course')
    .select('id, slug, title')
    .in('slug', Object.keys(courseData));

  if (errCourses) {
    console.error('Error fetching courses:', errCourses);
    return;
  }

  console.log(`Found ${courses.length} courses to seed subjects for.`);

  for (const course of courses) {
    const data = courseData[course.slug];
    if (!data) continue;

    console.log(`\nProcessing subjects for course: ${course.title} (${course.slug})`);

    // Delete existing subjects for this course
    const { error: errDel } = await supabase
      .from('Subject')
      .delete()
      .eq('courseId', course.id);

    if (errDel) {
      console.error(`Error deleting existing subjects for ${course.slug}:`, errDel);
      continue;
    }
    console.log(`Deleted existing subjects for ${course.slug}`);

    const subjectsToInsert = data.subjects.map((subName, index) => {
      // Semester logic:
      // For certificate (8 subjects), 4 in sem 1, 4 in sem 2
      // For diploma (12 subjects), 3 in sem 1, 3 in sem 2, 3 in sem 3, 3 in sem 4
      const totalSubjects = data.subjects.length;
      let semester = 1;
      let codeNum = 101;

      if (totalSubjects === 8) {
        if (index < 4) {
          semester = 1;
          codeNum = 101 + index;
        } else {
          semester = 2;
          codeNum = 101 + (index - 4);
        }
      } else { // 12 subjects
        const semIndex = Math.floor(index / 3); // 0, 1, 2, 3
        semester = semIndex + 1;
        const subInSem = index % 3;
        codeNum = (100 * semester) + 1 + subInSem;
      }

      const code = `${data.prefix}-${codeNum}`;

      return {
        id: uuidv4(),
        name: subName,
        creditUnits: 3,
        semester: semester,
        courseId: course.id,
        code: code,
        area: data.area,
        language: 'English',
        eligibility: null
      };
    });

    const { error: errIns } = await supabase
      .from('Subject')
      .insert(subjectsToInsert);

    if (errIns) {
      console.error(`Error inserting subjects for ${course.slug}:`, errIns);
    } else {
      console.log(`Successfully inserted ${subjectsToInsert.length} subjects for ${course.slug}`);
    }
  }

  console.log('\nSubject seeding completed!');
}

run();
