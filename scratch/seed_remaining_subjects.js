const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const courseData = {
  // 1. Hospitality and Tourism
  'event-planning-cert': {
    prefix: 'EVP',
    area: 'Event Planning',
    subjects: [
      "Introduction to Event Management",
      "Hospitality Fundamentals",
      "Customer Service Excellence",
      "Event Marketing",
      "Budgeting and Cost Control",
      "Venue Operations",
      "Risk and Safety Management",
      "Event Coordination Practicum"
    ]
  },
  'culinary-skills-cert': {
    prefix: 'CUL',
    area: 'Culinary Skills',
    subjects: [
      "Food Safety and Sanitation",
      "Basic Culinary Techniques",
      "Kitchen Operations",
      "Nutrition Fundamentals",
      "Menu Planning Basics",
      "Baking Fundamentals",
      "Food Presentation",
      "Culinary Practicum"
    ]
  },
  'hotel-operations-cert': {
    prefix: 'HTL',
    area: 'Hotel Operations',
    subjects: [
      "Hospitality Introduction",
      "Front Desk Operations",
      "Housekeeping Standards",
      "Customer Service",
      "Reservation Systems",
      "Food and Beverage Basics",
      "Hospitality Communications",
      "Industry Placement"
    ]
  },
  'hospitality-management-dip': {
    prefix: 'HPM',
    area: 'Hospitality Management',
    subjects: [
      "Hospitality Operations",
      "Food and Beverage Management",
      "Hotel Front Office Management",
      "Tourism Principles",
      "Marketing in Hospitality",
      "Human Resources in Hospitality",
      "Financial Management",
      "Customer Experience Management",
      "Event Management",
      "Hospitality Law",
      "Internship Placement",
      "Strategic Hospitality Management"
    ]
  },
  'tourism-management-dip': {
    prefix: 'TOM',
    area: 'Tourism Management',
    subjects: [
      "Tourism Industry Overview",
      "Destination Marketing",
      "Travel Operations",
      "Cultural Tourism",
      "Sustainable Tourism",
      "Tour Planning",
      "Airline and Travel Systems",
      "Customer Service",
      "Tourism Law and Ethics",
      "Event Tourism",
      "Business Communications",
      "Field Placement"
    ]
  },
  'culinary-management-dip': {
    prefix: 'CUL',
    area: 'Culinary Management',
    subjects: [
      "Advanced Culinary Techniques",
      "Kitchen Leadership",
      "Food Costing and Budgeting",
      "Menu Development",
      "Nutrition and Dietary Planning",
      "Restaurant Operations",
      "Food Safety Management",
      "Culinary Innovation",
      "Hospitality Business Management",
      "Baking and Pastry Arts",
      "Industry Internship",
      "Capstone Project"
    ]
  },
  'baking-pastry-arts-dip': {
    prefix: 'BPA',
    area: 'Baking & Pastry',
    subjects: [
      "Baking Fundamentals",
      "Cake and Pastry Production",
      "Chocolate and Confectionery",
      "Bread Making Techniques",
      "Food Safety",
      "Dessert Presentation",
      "Bakery Operations",
      "Nutrition Basics",
      "Costing and Pricing",
      "Culinary Creativity",
      "Internship Placement",
      "Final Practical Exam"
    ]
  },

  // 2. Engineering and Skilled Trades
  'welding-techniques-cert': {
    prefix: 'WLD',
    area: 'Welding',
    subjects: [
      "Welding Safety",
      "Arc Welding Basics",
      "MIG and TIG Welding",
      "Blueprint Reading",
      "Metal Fabrication",
      "Welding Inspection",
      "Workshop Practice",
      "Trade Mathematics"
    ]
  },
  'electrical-techniques-cert': {
    prefix: 'ELT',
    area: 'Electrical Techniques',
    subjects: [
      "Electrical Safety",
      "Basic Circuit Theory",
      "Wiring Systems",
      "Electrical Code Fundamentals",
      "Power Distribution Basics",
      "Electrical Tools and Equipment",
      "Troubleshooting Techniques",
      "Practical Lab Work"
    ]
  },
  'carpentry-techniques-cert': {
    prefix: 'CAR',
    area: 'Carpentry',
    subjects: [
      "Carpentry Tools and Safety",
      "Woodworking Fundamentals",
      "Blueprint Reading",
      "Framing Techniques",
      "Finishing Methods",
      "Building Codes",
      "Construction Materials",
      "Workshop Practice"
    ]
  },
  'mechanical-foundations-cert': {
    prefix: 'MEF',
    area: 'Mechanical Foundations',
    subjects: [
      "Mechanical Principles",
      "Tool Usage and Safety",
      "Machine Shop Basics",
      "Technical Drawing",
      "Maintenance Fundamentals",
      "Material Science Basics",
      "Workshop Training",
      "Trade Mathematics"
    ]
  },
  'civil-engineering-technician-dip': {
    prefix: 'CIV',
    area: 'Civil Engineering',
    subjects: [
      "Engineering Mathematics",
      "Structural Analysis Basics",
      "Construction Materials",
      "Surveying Techniques",
      "CAD Design",
      "Soil Mechanics",
      "Construction Management",
      "Blueprint Reading",
      "Environmental Engineering",
      "Transportation Systems",
      "Work Placement",
      "Capstone Project"
    ]
  },
  'mechanical-engineering-technician-dip': {
    prefix: 'MEC',
    area: 'Mechanical Engineering',
    subjects: [
      "Engineering Mathematics",
      "Thermodynamics",
      "Fluid Mechanics",
      "Mechanical Design",
      "CAD and CAM Systems",
      "Manufacturing Processes",
      "Materials Engineering",
      "Machine Design",
      "Maintenance Engineering",
      "Industrial Safety",
      "Work Placement",
      "Capstone Project"
    ]
  },
  'electrical-engineering-technician-dip': {
    prefix: 'ELT',
    area: 'Electrical Engineering',
    subjects: [
      "Electrical Circuit Theory",
      "Power Systems",
      "Electronics Fundamentals",
      "Control Systems",
      "Industrial Wiring",
      "Electrical Machines",
      "Renewable Energy Systems",
      "CAD Electrical Design",
      "Troubleshooting Systems",
      "Safety Standards",
      "Work Placement",
      "Capstone Project"
    ]
  },
  'architectural-technology-dip': {
    prefix: 'ARC',
    area: 'Architectural Technology',
    subjects: [
      "Architectural Drawing",
      "Building Materials",
      "CAD and BIM Systems",
      "Construction Technology",
      "Structural Design Basics",
      "Environmental Design",
      "Building Codes",
      "Site Planning",
      "Interior Design Fundamentals",
      "Construction Documentation",
      "Internship Placement",
      "Capstone Project"
    ]
  },

  // 3. Media and Creative Arts
  'digital-photography-cert': {
    prefix: 'PHO',
    area: 'Photography',
    subjects: [
      "Camera Techniques",
      "Lighting Basics",
      "Photo Composition",
      "Photo Editing Software",
      "Studio Photography",
      "Digital Imaging",
      "Visual Storytelling",
      "Portfolio Development"
    ]
  },
  'graphic-design-fundamentals-cert': {
    prefix: 'GDF',
    area: 'Graphic Design',
    subjects: [
      "Design Principles",
      "Typography Basics",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Color Theory",
      "Layout Design",
      "Branding Basics",
      "Creative Projects"
    ]
  },
  'social-media-marketing-cert': {
    prefix: 'SMM',
    area: 'Social Media Marketing',
    subjects: [
      "Social Media Platforms",
      "Content Creation",
      "Digital Marketing Basics",
      "Branding Strategies",
      "Analytics Tools",
      "Copywriting Basics",
      "Advertising Fundamentals",
      "Campaign Development"
    ]
  },
  'graphic-design-dip': {
    prefix: 'GRD',
    area: 'Graphic Design',
    subjects: [
      "Design Theory",
      "Typography",
      "Branding and Identity",
      "Digital Illustration",
      "Web Design Basics",
      "Motion Graphics",
      "Adobe Creative Suite",
      "Marketing Design",
      "Portfolio Development",
      "Client Projects",
      "Internship Placement",
      "Capstone Project"
    ]
  },
  'animation-dip': {
    prefix: 'ANI',
    area: 'Animation',
    subjects: [
      "2D Animation",
      "3D Modeling",
      "Storyboarding",
      "Character Design",
      "Motion Graphics",
      "Visual Effects",
      "Animation Software",
      "Digital Storytelling",
      "Rendering Techniques",
      "Portfolio Development",
      "Internship Placement",
      "Capstone Project"
    ]
  },
  'film-tv-production-dip': {
    prefix: 'FTP',
    area: 'Film & Television',
    subjects: [
      "Film Theory",
      "Scriptwriting",
      "Cinematography",
      "Video Editing",
      "Sound Design",
      "Directing Techniques",
      "Production Management",
      "Lighting Techniques",
      "Post-Production Editing",
      "Media Ethics",
      "Internship Placement",
      "Capstone Project"
    ]
  },

  // 4. Education and Social Sciences
  'educational-assistant-cert': {
    prefix: 'EDA',
    area: 'Education',
    subjects: [
      "Child Development Basics",
      "Classroom Support Techniques",
      "Behaviour Management",
      "Communication Skills",
      "Inclusive Education",
      "Special Needs Support",
      "Safety Procedures",
      "Field Practicum"
    ]
  },
  'leadership-development-cert': {
    prefix: 'LDR',
    area: 'Leadership',
    subjects: [
      "Leadership Principles",
      "Communication Skills",
      "Team Building",
      "Conflict Resolution",
      "Decision Making",
      "Organizational Skills",
      "Personal Development",
      "Project Work"
    ]
  },
  'early-childhood-education-dip': {
    prefix: 'ECE',
    area: 'Early Childhood Education',
    subjects: [
      "Child Psychology",
      "Curriculum Planning",
      "Early Learning Theories",
      "Inclusive Education",
      "Health and Safety",
      "Play-Based Learning",
      "Family Engagement",
      "Behaviour Guidance",
      "Observation and Assessment",
      "Field Placement",
      "Professional Practice",
      "Capstone Project"
    ]
  },
  'child-youth-care-dip': {
    prefix: 'CYC',
    area: 'Child & Youth Care',
    subjects: [
      "Youth Development",
      "Counselling Skills",
      "Behaviour Intervention",
      "Crisis Support",
      "Community Services",
      "Mental Health Basics",
      "Case Management",
      "Ethics and Professional Practice",
      "Family Systems",
      "Field Placement",
      "Communication Skills",
      "Capstone Project"
    ]
  },
  'community-justice-services-dip': {
    prefix: 'CJS',
    area: 'Community & Justice',
    subjects: [
      "Criminal Justice System",
      "Sociology",
      "Psychology Basics",
      "Correctional Practices",
      "Crisis Intervention",
      "Case Management",
      "Ethics and Law",
      "Rehabilitation Programs",
      "Communication Skills",
      "Field Placement",
      "Report Writing",
      "Capstone Project"
    ]
  }
};

async function run() {
  console.log('Fetching courses for updated subjects...');
  const { data: courses, error: errCourses } = await supabase
    .from('Course')
    .select('id, slug, title')
    .in('slug', Object.keys(courseData));

  if (errCourses) {
    console.error('Error fetching courses:', errCourses);
    return;
  }

  console.log(`Found ${courses.length} courses to update subjects for.`);

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
        const semIndex = Math.floor(index / 3);
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
