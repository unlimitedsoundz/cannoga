const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCHOOLS_TO_CREATE = [
  {
    slug: 'health-community',
    name: 'School of Health and Community Services',
    description: 'Preparing compassionate professionals for healthcare, nursing, and community support roles.',
    imageUrl: '/images/school-health.png'
  },
  {
    slug: 'hospitality-tourism',
    name: 'School of Hospitality and Tourism',
    description: 'Providing hands-on education in culinary arts, baking, hotel, and tourism management.',
    imageUrl: '/images/school-hospitality.png'
  },
  {
    slug: 'education-social-sciences',
    name: 'School of Education and Social Sciences',
    description: 'Empowering leaders in early childhood education, child youth care, and community justice.',
    imageUrl: '/images/school-education.png'
  },
  {
    slug: 'transportation-aviation',
    name: 'School of Transportation and Aviation',
    description: 'Training professionals in aviation management, logistics, and automotive service technologies.',
    imageUrl: '/images/school-transportation.png'
  }
];

const DEPTS_TO_CREATE = [
  { slug: 'business-management-dept', name: 'Department of Business and Management', schoolSlug: 'business' },
  { slug: 'information-technology-dept', name: 'Department of Information Technology', schoolSlug: 'technology' },
  { slug: 'health-community-dept', name: 'Department of Health and Community Services', schoolSlug: 'health-community' },
  { slug: 'hospitality-tourism-dept', name: 'Department of Hospitality and Tourism', schoolSlug: 'hospitality-tourism' },
  { slug: 'engineering-skilled-trades-dept', name: 'Department of Engineering and Skilled Trades', schoolSlug: 'technology' },
  { slug: 'media-creative-arts-dept', name: 'Department of Media and Creative Arts', schoolSlug: 'arts' },
  { slug: 'education-social-sciences-dept', name: 'Department of Education and Social Sciences', schoolSlug: 'education-social-sciences' },
  { slug: 'environment-agriculture-dept', name: 'Department of Environment and Agriculture', schoolSlug: 'science' },
  { slug: 'transportation-aviation-dept', name: 'Department of Transportation and Aviation', schoolSlug: 'transportation-aviation' }
];

const COURSES_TO_CREATE = [
  // 1. Business and Management
  { title: 'Business Foundations', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'business-foundations-cert' },
  { title: 'Human Resources Management', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'hr-management-cert' },
  { title: 'Accounting Fundamentals', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'accounting-fundamentals-cert' },
  { title: 'Entrepreneurship', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'entrepreneurship-cert' },
  { title: 'Marketing Essentials', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'marketing-essentials-cert' },
  { title: 'Project Management', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'project-management-cert' },
  { title: 'Supply Chain Management', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'supply-chain-management-cert' },
  { title: 'Business Administration', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'business-administration-dip' },
  { title: 'Accounting', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'accounting-dip' },
  { title: 'Marketing', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'marketing-dip' },
  { title: 'Human Resources Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'hr-management-dip' },
  { title: 'International Business', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'international-business-dip' },
  { title: 'Financial Services', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'financial-services-dip' },
  { title: 'Supply Chain and Logistics Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'business-management-dept', schoolSlug: 'business', slug: 'supply-chain-logistics-dip' },

  // 2. Information Technology
  { title: 'Cybersecurity Foundations', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'cybersecurity-foundations-cert' },
  { title: 'Web Development', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'web-development-cert' },
  { title: 'Data Analytics', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'data-analytics-cert' },
  { title: 'Cloud Computing', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'cloud-computing-cert' },
  { title: 'Software Testing', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'software-testing-cert' },
  { title: 'Computer Programming', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'computer-programming-dip' },
  { title: 'Computer Systems Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'computer-systems-technician-dip' },
  { title: 'Information Technology Networking', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'it-networking-dip' },
  { title: 'Cybersecurity', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'cybersecurity-dip' },
  { title: 'Software Development', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'software-development-dip' },
  { title: 'Artificial Intelligence and Data Science', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'information-technology-dept', schoolSlug: 'technology', slug: 'ai-data-science-dip' },

  // 3. Health and Community Services
  { title: 'Personal Support Worker', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'personal-support-worker-cert' },
  { title: 'Medical Office Administration', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'medical-office-admin-cert' },
  { title: 'Community Support Worker', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'community-support-worker-cert' },
  { title: 'Mental Health and Addictions Support', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'mental-health-addictions-cert' },
  { title: 'Practical Nursing', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'practical-nursing-dip' },
  { title: 'Pharmacy Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'pharmacy-technician-dip' },
  { title: 'Occupational Therapist Assistant', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'occupational-therapist-assistant-dip' },
  { title: 'Physiotherapist Assistant', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'physiotherapist-assistant-dip' },
  { title: 'Dental Hygiene', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'dental-hygiene-dip' },
  { title: 'Early Childhood Education (Health)', titleDisplay: 'Early Childhood Education', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'early-childhood-education-health-dip' },
  { title: 'Social Service Worker', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'health-community-dept', schoolSlug: 'health-community', slug: 'social-service-worker-dip' },

  // 4. Hospitality and Tourism
  { title: 'Event Planning', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'event-planning-cert' },
  { title: 'Culinary Skills', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'culinary-skills-cert' },
  { title: 'Hotel Operations', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'hotel-operations-cert' },
  { title: 'Hospitality Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'hospitality-management-dip' },
  { title: 'Tourism Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'tourism-management-dip' },
  { title: 'Culinary Management', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'culinary-management-dip' },
  { title: 'Baking and Pastry Arts', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'hospitality-tourism-dept', schoolSlug: 'hospitality-tourism', slug: 'baking-pastry-arts-dip' },

  // 5. Engineering and Skilled Trades
  { title: 'Welding Techniques', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'welding-techniques-cert' },
  { title: 'Electrical Techniques', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'electrical-techniques-cert' },
  { title: 'Carpentry Techniques', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'carpentry-techniques-cert' },
  { title: 'Mechanical Foundations', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'mechanical-foundations-cert' },
  { title: 'Civil Engineering Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'civil-engineering-technician-dip' },
  { title: 'Mechanical Engineering Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'mechanical-engineering-technician-dip' },
  { title: 'Electrical Engineering Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'electrical-engineering-technician-dip' },
  { title: 'Architectural Technology', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'architectural-technology-dip' },
  { title: 'Construction Engineering Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'engineering-skilled-trades-dept', schoolSlug: 'technology', slug: 'construction-engineering-technician-dip' },

  // 6. Media and Creative Arts
  { title: 'Digital Photography', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'digital-photography-cert' },
  { title: 'Graphic Design Fundamentals', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'graphic-design-fundamentals-cert' },
  { title: 'Social Media Marketing', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'social-media-marketing-cert' },
  { title: 'Graphic Design', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'graphic-design-dip' },
  { title: 'Animation', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'animation-dip' },
  { title: 'Interactive Media Design', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'interactive-media-design-dip' },
  { title: 'Broadcasting', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'broadcasting-dip' },
  { title: 'Film and Television Production', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'media-creative-arts-dept', schoolSlug: 'arts', slug: 'film-tv-production-dip' },

  // 7. Education and Social Sciences
  { title: 'Educational Assistant', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'educational-assistant-cert' },
  { title: 'Leadership Development', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'leadership-development-cert' },
  { title: 'Early Childhood Education', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'early-childhood-education-dip' },
  { title: 'Child and Youth Care', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'child-youth-care-dip' },
  { title: 'Developmental Services Worker', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'developmental-services-worker-dip' },
  { title: 'Community and Justice Services', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'education-social-sciences-dept', schoolSlug: 'education-social-sciences', slug: 'community-justice-services-dip' },

  // 8. Environment and Agriculture
  { title: 'Sustainable Agriculture', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'environment-agriculture-dept', schoolSlug: 'science', slug: 'sustainable-agriculture-cert' },
  { title: 'Environmental Management', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'environment-agriculture-dept', schoolSlug: 'science', slug: 'environmental-management-cert' },
  { title: 'Environmental Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'environment-agriculture-dept', schoolSlug: 'science', slug: 'environmental-technician-dip' },
  { title: 'Horticulture Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'environment-agriculture-dept', schoolSlug: 'science', slug: 'horticulture-technician-dip' },
  { title: 'Agriculture Technology', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'environment-agriculture-dept', schoolSlug: 'science', slug: 'agriculture-technology-dip' },

  // 9. Transportation and Aviation
  { title: 'Logistics and Transportation', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'logistics-transportation-cert' },
  { title: 'Flight Services', degreeLevel: 'CERTICACATE', duration: '1 Year', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'flight-services-cert' },
  { title: 'Aviation Management', degreeLevel: 'DIPLOMA', duration: '3 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'aviation-management-dip' },
  { title: 'Aircraft Maintenance Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'aircraft-maintenance-technician-dip' },
  { title: 'Automotive Service Technician', degreeLevel: 'DIPLOMA', duration: '2 Years', deptSlug: 'transportation-aviation-dept', schoolSlug: 'transportation-aviation', slug: 'automotive-service-technician-dip' }
];

async function run() {
  console.log('Seeding process started...');

  // 1. Get existing schools and departments mapping
  const { data: existingSchools } = await supabase.from('School').select('id, slug');
  const { data: existingDepts } = await supabase.from('Department').select('id, slug');

  const schoolMap = {};
  existingSchools.forEach(s => { schoolMap[s.slug] = s.id; });

  const deptMap = {};
  existingDepts.forEach(d => { deptMap[d.slug] = d.id; });

  // 2. Create schools if they don't exist
  for (const school of SCHOOLS_TO_CREATE) {
    if (!schoolMap[school.slug]) {
      console.log(`Creating school: ${school.name}`);
      const schoolId = uuidv4();
      const { data, error } = await supabase.from('School').insert({
        id: schoolId,
        name: school.name,
        slug: school.slug,
        description: school.description,
        imageUrl: school.imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).select().single();

      if (error) {
        console.error(`Failed to create school ${school.name}:`, error);
      } else {
        schoolMap[school.slug] = schoolId;
      }
    }
  }

  // 3. Create departments if they don't exist
  for (const dept of DEPTS_TO_CREATE) {
    if (!deptMap[dept.slug]) {
      console.log(`Creating department: ${dept.name}`);
      const schoolId = schoolMap[dept.schoolSlug];
      if (!schoolId) {
        console.error(`School id not found for ${dept.schoolSlug}`);
        continue;
      }

      const deptId = uuidv4();
      const { data, error } = await supabase.from('Department').insert({
        id: deptId,
        name: dept.name,
        slug: dept.slug,
        description: `The ${dept.name} offers training in Certificate and Diploma programmes.`,
        schoolId: schoolId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).select().single();

      if (error) {
        console.error(`Failed to create department ${dept.name}:`, error);
      } else {
        deptMap[dept.slug] = deptId;
      }
    }
  }

  // 4. Create courses if they don't exist
  let createdCount = 0;
  for (const course of COURSES_TO_CREATE) {
    const title = course.titleDisplay || course.title;
    const schoolId = schoolMap[course.schoolSlug];
    const departmentId = deptMap[course.deptSlug];

    if (!schoolId || !departmentId) {
      console.error(`Mapping missing for course ${course.title}: schoolId=${schoolId}, departmentId=${departmentId}`);
      continue;
    }

    // Check if course already exists by slug
    const { data: existingCourse, error: checkError } = await supabase
      .from('Course')
      .select('id')
      .eq('slug', course.slug)
      .maybeSingle();

    if (checkError) {
      console.error(`Error checking course ${course.slug}:`, checkError);
      continue;
    }

    if (!existingCourse) {
      const courseId = uuidv4();
      const { error: insertError } = await supabase.from('Course').insert({
        id: courseId,
        title: title,
        slug: course.slug,
        degreeLevel: course.degreeLevel,
        duration: course.duration,
        description: `Develop professional expertise in ${title} with our state-of-the-art curriculum, industry-led instruction, and hands-on training.`,
        language: 'English',
        schoolId: schoolId,
        departmentId: departmentId,
        entryRequirements: 'Secondary school diploma or equivalent. English proficiency test results (IELTS 6.0+ or equivalent).',
        minimumGrade: 'Passing grade in core subjects.',
        careerPaths: `${title} Practitioner, Industry Specialist, Professional Assistant.`,
        imageUrl: `/images/courses/${course.slug}.jpg`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (insertError) {
        console.error(`Failed to insert course ${title}:`, insertError);
      } else {
        createdCount++;
      }
    }
  }

  console.log(`Seeding process finished! Created ${createdCount} new courses.`);
}

run();
