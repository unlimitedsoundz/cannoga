const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const courseData = {
  // --- Environment and Agriculture ---
  'sustainable-agriculture-cert': {
    prefix: 'SAG',
    area: 'Sustainable Agriculture',
    subjects: [
      "Introduction to Agriculture",
      "Soil Science Basics",
      "Crop Production Techniques",
      "Sustainable Farming Practices",
      "Pest Management",
      "Agricultural Technology",
      "Environmental Stewardship",
      "Field Training"
    ]
  },
  'environmental-management-cert': {
    prefix: 'ENV',
    area: 'Environmental Management',
    subjects: [
      "Environmental Science Fundamentals",
      "Climate Change Basics",
      "Waste Management",
      "Pollution Control",
      "Ecosystem Studies",
      "Environmental Policy Introduction",
      "Sustainability Practices",
      "Fieldwork Training"
    ]
  },
  'environmental-technician-dip': {
    prefix: 'EVT',
    area: 'Environmental Technician',
    subjects: [
      "Environmental Chemistry",
      "Ecology and Ecosystems",
      "Environmental Impact Assessment",
      "Water and Soil Analysis",
      "Waste Management Systems",
      "Climate Science",
      "Environmental Law and Policy",
      "Field Laboratory Work",
      "Geographic Information Systems (GIS)",
      "Sustainability Planning",
      "Work Placement",
      "Capstone Project"
    ]
  },
  'horticulture-technician-dip': {
    prefix: 'HRT',
    area: 'Horticulture',
    subjects: [
      "Plant Biology",
      "Soil Science",
      "Landscape Design",
      "Plant Propagation",
      "Pest and Disease Control",
      "Greenhouse Management",
      "Irrigation Systems",
      "Turf Management",
      "Environmental Sustainability",
      "Field Practicum",
      "Business Basics in Horticulture",
      "Capstone Project"
    ]
  },
  'agriculture-technology-dip': {
    prefix: 'AGT',
    area: 'Agriculture Technology',
    subjects: [
      "Agricultural Science",
      "Crop Management",
      "Livestock Fundamentals",
      "Soil and Water Management",
      "Agricultural Economics",
      "Farm Machinery Operations",
      "Sustainable Agriculture Systems",
      "Precision Farming Technology",
      "Agribusiness Management",
      "Field Training",
      "Data in Agriculture",
      "Capstone Project"
    ]
  },

  // --- Transportation and Aviation ---
  'logistics-transportation-cert': {
    prefix: 'LOG',
    area: 'Logistics & Transportation',
    subjects: [
      "Introduction to Logistics",
      "Supply Chain Basics",
      "Transportation Systems",
      "Warehouse Operations",
      "Inventory Management",
      "Freight Handling",
      "Safety Regulations",
      "Business Communications",
      "Field Training"
    ]
  },
  'flight-services-cert': {
    prefix: 'FLS',
    area: 'Flight Services',
    subjects: [
      "Aviation Fundamentals",
      "Airline Customer Service",
      "Airport Operations Basics",
      "Safety and Emergency Procedures",
      "Travel Documentation",
      "Cabin Crew Introduction",
      "Communication Skills",
      "Aviation Ethics"
    ]
  },
  'aviation-management-dip': {
    prefix: 'AVM',
    area: 'Aviation Management',
    subjects: [
      "Aviation Industry Overview",
      "Airline Operations",
      "Airport Management",
      "Aviation Safety and Security",
      "Air Traffic Basics",
      "Aviation Law and Regulations",
      "Customer Service in Aviation",
      "Airline Marketing",
      "Logistics in Aviation",
      "Financial Management",
      "Internship Placement",
      "Capstone Project"
    ]
  },
  'aircraft-maintenance-technician-dip': {
    prefix: 'AMT',
    area: 'Aircraft Maintenance',
    subjects: [
      "Aircraft Systems Fundamentals",
      "Aviation Safety Standards",
      "Aircraft Structures",
      "Engine Maintenance",
      "Electrical Systems in Aircraft",
      "Hydraulics and Pneumatics",
      "Maintenance Documentation",
      "Aviation Regulations",
      "Troubleshooting Techniques",
      "Workshop Practice",
      "Industry Placement",
      "Capstone Certification Exam"
    ]
  },
  'automotive-service-technician-dip': {
    prefix: 'AST',
    area: 'Automotive Service',
    subjects: [
      "Automotive Systems",
      "Engine Repair and Diagnostics",
      "Electrical Systems",
      "Brake Systems",
      "Suspension and Steering",
      "Transmission Systems",
      "Vehicle Maintenance",
      "Diagnostic Tools",
      "Safety Procedures",
      "Workshop Practice",
      "Industry Placement",
      "Capstone Project"
    ]
  }
};

// Semester assignment logic:
// 8 subjects  -> 4 per semester (2 semesters)
// 9 subjects  -> 5 in S1, 4 in S2
// 12 subjects -> 3 per semester (4 semesters)
function getSemester(index, total) {
  if (total <= 8) {
    return index < 4 ? 1 : 2;
  } else if (total === 9) {
    return index < 5 ? 1 : 2;
  } else {
    return Math.floor(index / 3) + 1;
  }
}

function getCodeNum(index, total) {
  if (total <= 8) {
    const sem = index < 4 ? 1 : 2;
    const posInSem = total <= 8 ? (index % 4) : (index % Math.ceil(total / 2));
    return (100 * sem) + 1 + posInSem;
  } else if (total === 9) {
    if (index < 5) return 101 + index;
    return 201 + (index - 5);
  } else {
    const sem = Math.floor(index / 3) + 1;
    const posInSem = index % 3;
    return (100 * sem) + 1 + posInSem;
  }
}

async function run() {
  console.log('Fetching courses for Environment & Agriculture and Transportation & Aviation...');
  const { data: courses, error: errCourses } = await supabase
    .from('Course')
    .select('id, slug, title')
    .in('slug', Object.keys(courseData));

  if (errCourses) {
    console.error('Error fetching courses:', errCourses);
    return;
  }

  console.log(`Found ${courses.length} courses to process.`);
  const foundSlugs = courses.map(c => c.slug);
  const missingSlugs = Object.keys(courseData).filter(s => !foundSlugs.includes(s));
  if (missingSlugs.length > 0) {
    console.warn('WARNING - these slugs were not found in DB:', missingSlugs);
  }

  for (const course of courses) {
    const data = courseData[course.slug];
    if (!data) continue;

    console.log(`\nProcessing: ${course.title} (${course.slug})`);

    const { error: errDel } = await supabase
      .from('Subject')
      .delete()
      .eq('courseId', course.id);

    if (errDel) {
      console.error(`Error deleting existing subjects for ${course.slug}:`, errDel);
      continue;
    }

    const total = data.subjects.length;
    const subjectsToInsert = data.subjects.map((subName, index) => {
      const semester = getSemester(index, total);
      const codeNum = getCodeNum(index, total);
      return {
        id: uuidv4(),
        name: subName,
        creditUnits: 3,
        semester,
        courseId: course.id,
        code: `${data.prefix}-${codeNum}`,
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
      console.log(`✓ Inserted ${subjectsToInsert.length} subjects for ${course.slug}`);
    }
  }

  console.log('\nDone!');
}

run();
