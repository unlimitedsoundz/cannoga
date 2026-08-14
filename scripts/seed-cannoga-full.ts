import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INSTITUTION = {
    name: 'Cannoga College',
    type: 'College',
    street: '81 Montreal Rd',
    city: 'Ottawa',
    province: 'Ontario',
    postalCode: 'K1L 6E8',
    country: 'Canada',
    countryCode: 'CA',
    currency: 'CAD',
    timezone: 'America/Toronto',
    emailDomain: '@cannogacollege.ca',
};

type SchoolDef = {
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    departments: {
        slug: string;
        name: string;
        description: string;
        courses: {
            slug: string;
            title: string;
            degreeLevel: 'BACHELOR' | 'MASTER' | 'DIPLOMA' | 'CERTIFICATE';
            duration: string;
            description: string;
            entryRequirements: string;
            careerPaths: string;
            subjects: { name: string; credits: number; semester: number }[];
        }[];
    }[];
};

const SCHOOLS: SchoolDef[] = [
    {
        slug: 'arts',
        name: 'School of Arts, Design and Architecture',
        description: 'A multidisciplinary academic unit focused on creativity, innovation, and societal impact through art, design, architecture, film, and media.',
        imageUrl: '/images/school-of-arts.jpg',
        departments: [
            {
                slug: 'arts-art-media',
                name: 'Department of Art and Media',
                description: 'Exploring visual arts, digital media, and contemporary creative practice.',
                courses: [
                    {
                        slug: 'fine-arts-bachelor',
                        title: 'Bachelor of Fine Arts',
                        degreeLevel: 'BACHELOR',
                        duration: '4 Years',
                        description: 'Develop your creative practice across painting, sculpture, photography, and digital media in a supportive studio environment.',
                        entryRequirements: 'High School Diploma and Portfolio.',
                        careerPaths: 'Visual Artist, Curator, Art Educator, Gallery Director.',
                        subjects: [
                            { name: 'Foundations of Visual Art', credits: 5, semester: 1 },
                            { name: 'Drawing and Composition', credits: 5, semester: 1 },
                            { name: 'Digital Media Studio', credits: 5, semester: 2 },
                            { name: 'Art History and Criticism', credits: 4, semester: 2 },
                            { name: 'Professional Practice for Artists', credits: 5, semester: 3 },
                            { name: 'Capstone Exhibition', credits: 6, semester: 4 },
                        ],
                    },
                    {
                        slug: 'graphic-design-diploma',
                        title: 'Graphic Design',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Learn branding, typography, layout, and digital design tools used by modern creative teams.',
                        entryRequirements: 'High School Diploma and Portfolio.',
                        careerPaths: 'Graphic Designer, UI Designer, Brand Designer.',
                        subjects: [
                            { name: 'Typography and Layout', credits: 5, semester: 1 },
                            { name: 'Brand Identity Design', credits: 5, semester: 1 },
                            { name: 'Digital Tools for Designers', credits: 5, semester: 2 },
                            { name: 'Web and Motion Graphics', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
            {
                slug: 'arts-design',
                name: 'Department of Design',
                description: 'Interior, product, and interaction design with industry projects.',
                courses: [
                    {
                        slug: 'interior-design-diploma',
                        title: 'Interior Design',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Create functional, safe, and beautiful interior spaces using current codes, materials, and design software.',
                        entryRequirements: 'High School Diploma and Portfolio.',
                        careerPaths: 'Interior Designer, Space Planner, Retail Designer.',
                        subjects: [
                            { name: 'Design Drafting and Space Planning', credits: 5, semester: 1 },
                            { name: 'Materials and Finishes', credits: 5, semester: 1 },
                            { name: 'Lighting and Environmental Systems', credits: 5, semester: 2 },
                            { name: 'Residential and Commercial Studio', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
            {
                slug: 'arts-architecture',
                name: 'Department of Architecture',
                description: 'Architectural design, drawing, and building technology fundamentals.',
                courses: [
                    {
                        slug: 'architecture-technology-diploma',
                        title: 'Architectural Technology',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Prepare construction documents, building models, and technical drawings for architectural practice.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Architectural Technologist, CAD Technician, Building Inspector.',
                        subjects: [
                            { name: 'Architectural Graphics', credits: 5, semester: 1 },
                            { name: 'Building Construction', credits: 5, semester: 1 },
                            { name: 'Building Services and Codes', credits: 5, semester: 2 },
                            { name: 'Computer-Aided Design', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'business',
        name: 'School of Business',
        description: 'Developing leaders for modern business, finance, and entrepreneurship.',
        imageUrl: '/images/school-of-business.jpg',
        departments: [
            {
                slug: 'business-management',
                name: 'Department of Management Studies',
                description: 'Leadership, operations, and organizational strategy.',
                courses: [
                    {
                        slug: 'business-administration-diploma',
                        title: 'Business Administration',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Gain core skills in management, marketing, accounting, and communications for today’s workplaces.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Administrative Manager, Office Manager, Operations Coordinator.',
                        subjects: [
                            { name: 'Business Communication', credits: 5, semester: 1 },
                            { name: 'Financial Accounting', credits: 5, semester: 1 },
                            { name: 'Marketing Fundamentals', credits: 5, semester: 2 },
                            { name: 'Business Law and Ethics', credits: 4, semester: 2 },
                            { name: 'Management Principles', credits: 5, semester: 3 },
                            { name: 'Business Strategy Project', credits: 6, semester: 4 },
                        ],
                    },
                    {
                        slug: 'business-administration-bachelor',
                        title: 'Bachelor of Business Administration',
                        degreeLevel: 'BACHELOR',
                        duration: '4 Years',
                        description: 'A broader business degree with advanced courses in strategy, finance, and leadership.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Business Analyst, Finance Officer, Startup Founder.',
                        subjects: [
                            { name: 'Microeconomics', credits: 5, semester: 1 },
                            { name: 'Financial Accounting', credits: 5, semester: 1 },
                            { name: 'Marketing Management', credits: 5, semester: 2 },
                            { name: 'Organizational Behaviour', credits: 5, semester: 2 },
                            { name: 'Corporate Finance', credits: 5, semester: 3 },
                            { name: 'Strategic Management', credits: 5, semester: 4 },
                        ],
                    },
                ],
            },
            {
                slug: 'business-accounting',
                name: 'Department of Accounting and Business Law',
                description: 'Accounting, taxation, payroll, and business law.',
                courses: [
                    {
                        slug: 'accounting-diploma',
                        title: 'Accounting and Payroll',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Build practical skills in financial reporting, tax compliance, and payroll administration.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Accountant, Payroll Administrator, Bookkeeper.',
                        subjects: [
                            { name: 'Financial Accounting I', credits: 5, semester: 1 },
                            { name: 'Payroll Fundamentals', credits: 5, semester: 1 },
                            { name: 'Management Accounting', credits: 5, semester: 2 },
                            { name: 'Taxation Basics', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'technology',
        name: 'School of Technology',
        description: 'Driving the development of next-generation computing, automation, and engineering solutions.',
        imageUrl: '/images/school-of-technology.jpg',
        departments: [
            {
                slug: 'technology-it',
                name: 'Department of Information Technology',
                description: 'Software development, networking, cybersecurity, and systems support.',
                courses: [
                    {
                        slug: 'software-engineering-diploma',
                        title: 'Software Engineering',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Learn modern programming, databases, testing, and teamwork through project-based learning.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Software Developer, QA Analyst, Technical Support Engineer.',
                        subjects: [
                            { name: 'Programming Fundamentals', credits: 5, semester: 1 },
                            { name: 'Data Structures', credits: 5, semester: 1 },
                            { name: 'Database Systems', credits: 5, semester: 2 },
                            { name: 'Web Development', credits: 5, semester: 2 },
                            { name: 'Software Testing', credits: 5, semester: 3 },
                            { name: 'Capstone Development Project', credits: 6, semester: 4 },
                        ],
                    },
                    {
                        slug: 'cybersecurity-diploma',
                        title: 'Cybersecurity',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Prepare for security operations, risk assessment, and incident response roles.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Security Analyst, SOC Operator, IT Risk Consultant.',
                        subjects: [
                            { name: 'Networking Essentials', credits: 5, semester: 1 },
                            { name: 'Security Fundamentals', credits: 5, semester: 1 },
                            { name: 'Threat Detection and Response', credits: 5, semester: 2 },
                            { name: 'Risk and Compliance', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
            {
                slug: 'technology-engineering',
                name: 'Department of Engineering and Skilled Trades',
                description: 'Mechanical, electrical, and industrial maintenance training.',
                courses: [
                    {
                        slug: 'mechanical-technician-diploma',
                        title: 'Mechanical Technician',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Hands-on training in mechanical systems, CAD, manufacturing processes, and preventive maintenance.',
                        entryRequirements: 'High School Diploma with Mathematics and Science.',
                        careerPaths: 'Mechanical Technician, Maintenance Technician, CAD Drafter.',
                        subjects: [
                            { name: 'Mechanical Drafting', credits: 5, semester: 1 },
                            { name: 'Materials and Processes', credits: 5, semester: 1 },
                            { name: 'Fluid Power Systems', credits: 5, semester: 2 },
                            { name: 'Manufacturing Technology', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'science',
        name: 'School of Science',
        description: 'Advancing scientific knowledge through research-informed teaching and applied science programs.',
        imageUrl: '/images/school-of-science.jpg',
        departments: [
            {
                slug: 'science-data',
                name: 'Department of Data Science and AI',
                description: 'Data analytics, machine learning, and applied computing.',
                courses: [
                    {
                        slug: 'data-science-bachelor',
                        title: 'Bachelor of Data Science',
                        degreeLevel: 'BACHELOR',
                        duration: '4 Years',
                        description: 'Build expertise in statistics, programming, machine learning, and business analytics.',
                        entryRequirements: 'High School Diploma with Advanced Mathematics.',
                        careerPaths: 'Data Scientist, Business Analyst, ML Engineer.',
                        subjects: [
                            { name: 'Statistics for Data Science', credits: 5, semester: 1 },
                            { name: 'Programming for Analytics', credits: 5, semester: 1 },
                            { name: 'Database Design', credits: 5, semester: 2 },
                            { name: 'Machine Learning Foundations', credits: 5, semester: 2 },
                            { name: 'Data Visualization', credits: 5, semester: 3 },
                            { name: 'Applied Analytics Project', credits: 6, semester: 4 },
                        ],
                    },
                ],
            },
            {
                slug: 'science-physics-math',
                name: 'Department of Applied Physics and Mathematics',
                description: 'Applied mathematics, modelling, and physical sciences.',
                courses: [
                    {
                        slug: 'applied-mathematics-diploma',
                        title: 'Applied Mathematics',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Strengthen analytical and quantitative skills for industry, finance, and technology roles.',
                        entryRequirements: 'High School Diploma with Advanced Mathematics.',
                        careerPaths: 'Quantitative Analyst, Operations Researcher, Technical Writer.',
                        subjects: [
                            { name: 'Calculus I', credits: 5, semester: 1 },
                            { name: 'Linear Algebra', credits: 5, semester: 1 },
                            { name: 'Statistics and Probability', credits: 5, semester: 2 },
                            { name: 'Modelling and Simulation', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'health-community',
        name: 'School of Health and Community Services',
        description: 'Preparing compassionate professionals for healthcare, nursing, and community support roles.',
        imageUrl: '/images/school-of-health.jpg',
        departments: [
            {
                slug: 'health-community-dept',
                name: 'Department of Health and Community Services',
                description: 'Nursing, personal support, pharmacy, and community care pathways.',
                courses: [
                    {
                        slug: 'practical-nursing-diploma',
                        title: 'Practical Nursing',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Prepare for entry-level nursing practice with clinical placements and foundational care skills.',
                        entryRequirements: 'High School Diploma with Biology and Chemistry.',
                        careerPaths: 'Licensed Practical Nurse, Community Health Worker.',
                        subjects: [
                            { name: 'Fundamentals of Nursing', credits: 5, semester: 1 },
                            { name: 'Human Anatomy and Physiology', credits: 5, semester: 1 },
                            { name: 'Pharmacology Basics', credits: 5, semester: 2 },
                            { name: 'Clinical Practicum I', credits: 6, semester: 2 },
                            { name: 'Mental Health Nursing', credits: 5, semester: 3 },
                            { name: 'Clinical Practicum II', credits: 6, semester: 4 },
                        ],
                    },
                    {
                        slug: 'personal-support-worker-cert',
                        title: 'Personal Support Worker',
                        degreeLevel: 'CERTIFICATE',
                        duration: '1 Year',
                        description: 'Provide compassionate personal care and support to clients in homes, hospitals, and long-term care settings.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Personal Support Worker, Home Care Aide.',
                        subjects: [
                            { name: 'Personal Care Skills', credits: 5, semester: 1 },
                            { name: 'Communication and Documentation', credits: 5, semester: 1 },
                            { name: 'Supporting Persons with Disabilities', credits: 5, semester: 2 },
                            { name: 'Workplace Placement', credits: 6, semester: 2 },
                        ],
                    },
                    {
                        slug: 'pharmacy-technician-diploma',
                        title: 'Pharmacy Technician',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Prepare for pharmacy dispensing, inventory, and patient support roles in retail or clinical settings.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Pharmacy Technician, Pharmacist Assistant.',
                        subjects: [
                            { name: 'Pharmacy Operations', credits: 5, semester: 1 },
                            { name: 'Medication Preparation', credits: 5, semester: 1 },
                            { name: 'Pharmacy Calculations', credits: 5, semester: 2 },
                            { name: 'Clinical Pharmacy Practice', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'hospitality-tourism',
        name: 'School of Hospitality and Tourism',
        description: 'Providing hands-on education in culinary arts, hotel operations, and tourism management.',
        imageUrl: '/images/school-of-hospitality.jpg',
        departments: [
            {
                slug: 'hospitality-tourism-dept',
                name: 'Department of Hospitality and Tourism',
                description: 'Hotel operations, culinary management, tourism planning, and event services.',
                courses: [
                    {
                        slug: 'hospitality-management-diploma',
                        title: 'Hospitality Management',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Learn front-office, housekeeping, food service, and revenue management for hotel and resort operations.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Hotel Manager, Front Office Supervisor, Event Coordinator.',
                        subjects: [
                            { name: 'Hospitality Operations', credits: 5, semester: 1 },
                            { name: 'Food and Beverage Management', credits: 5, semester: 1 },
                            { name: 'Revenue and Yield Management', credits: 5, semester: 2 },
                            { name: 'Customer Experience Design', credits: 5, semester: 2 },
                        ],
                    },
                    {
                        slug: 'culinary-management-diploma',
                        title: 'Culinary Management',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Combine cooking techniques with kitchen management, menu planning, and food safety.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Chef, Kitchen Manager, Catering Supervisor.',
                        subjects: [
                            { name: 'Culinary Fundamentals', credits: 5, semester: 1 },
                            { name: 'Baking and Pastry', credits: 5, semester: 1 },
                            { name: 'Menu Planning and Costing', credits: 5, semester: 2 },
                            { name: 'Kitchen Management', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'education-social-sciences',
        name: 'School of Education and Social Sciences',
        description: 'Empowering leaders in early childhood education, child youth care, and community justice.',
        imageUrl: '/images/school-of-education.jpg',
        departments: [
            {
                slug: 'education-social-sciences-dept',
                name: 'Department of Education and Social Sciences',
                description: 'Teaching, early childhood development, youth care, and community services.',
                courses: [
                    {
                        slug: 'early-childhood-education-diploma',
                        title: 'Early Childhood Education',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Prepare to work with young children in childcare, preschool, and family support settings.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Early Childhood Educator, Childcare Supervisor, Family Support Worker.',
                        subjects: [
                            { name: 'Child Growth and Development', credits: 5, semester: 1 },
                            { name: 'Curriculum for Young Children', credits: 5, semester: 1 },
                            { name: 'Family and Community Partnerships', credits: 5, semester: 2 },
                            { name: 'Field Practicum', credits: 6, semester: 2 },
                        ],
                    },
                    {
                        slug: 'educational-assistant-cert',
                        title: 'Educational Assistant',
                        degreeLevel: 'CERTIFICATE',
                        duration: '1 Year',
                        description: 'Support teachers and students in elementary and secondary school environments.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Educational Assistant, Student Support Worker.',
                        subjects: [
                            { name: 'Classroom Support Strategies', credits: 5, semester: 1 },
                            { name: 'Inclusive Education Practices', credits: 5, semester: 1 },
                            { name: 'Behaviour Support', credits: 5, semester: 2 },
                            { name: ' practicum in Education Settings', credits: 6, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        slug: 'transportation-aviation',
        name: 'School of Transportation and Aviation',
        description: 'Training professionals in aviation management, logistics, and automotive service technologies.',
        imageUrl: '/images/school-of-transportation.jpg',
        departments: [
            {
                slug: 'transportation-aviation-dept',
                name: 'Department of Transportation and Aviation',
                description: 'Aviation operations, flight services, logistics, and automotive technology.',
                courses: [
                    {
                        slug: 'aviation-management-diploma',
                        title: 'Aviation Management',
                        degreeLevel: 'DIPLOMA',
                        duration: '3 Years',
                        description: 'Study airport operations, aviation safety, airline management, and regulatory compliance.',
                        entryRequirements: 'High School Diploma with Mathematics.',
                        careerPaths: 'Airport Operations Officer, Aviation Supervisor, Airline Coordinator.',
                        subjects: [
                            { name: 'Aviation Industry Overview', credits: 5, semester: 1 },
                            { name: 'Airport Operations', credits: 5, semester: 1 },
                            { name: 'Aviation Safety and Security', credits: 5, semester: 2 },
                            { name: 'Airline Management', credits: 5, semester: 2 },
                            { name: 'Regulatory Compliance', credits: 5, semester: 3 },
                            { name: 'Aviation Capstone Project', credits: 6, semester: 4 },
                        ],
                    },
                    {
                        slug: 'automotive-service-technician-diploma',
                        title: 'Automotive Service Technician',
                        degreeLevel: 'DIPLOMA',
                        duration: '2 Years',
                        description: 'Diagnose, service, and repair vehicles using modern tools and manufacturer procedures.',
                        entryRequirements: 'High School Diploma.',
                        careerPaths: 'Automotive Technician, Service Advisor, Fleet Maintenance Technician.',
                        subjects: [
                            { name: 'Engine Systems', credits: 5, semester: 1 },
                            { name: 'Electrical and Electronics', credits: 5, semester: 1 },
                            { name: 'Brakes and Steering', credits: 5, semester: 2 },
                            { name: 'Engine Performance and Diagnostics', credits: 5, semester: 2 },
                        ],
                    },
                ],
            },
        ],
    },
];

const FACULTY_TEMPLATES: Record<string, { name: string; role: string; bio: string; email: string }[]> = {
    arts: [
        { name: 'Dr. Sarah Mitchell', role: 'Dean', bio: 'Creative director and researcher with experience in contemporary art and design education.', email: 'sarah.mitchell@cannogacollege.ca' },
        { name: 'James Carter', role: 'Program Coordinator', bio: 'Practicing designer and instructor specializing in visual communication and digital media.', email: 'james.carter@cannogacollege.ca' },
        { name: 'Priya Nair', role: 'Faculty', bio: 'Architect and educator focused on sustainable design and community-focused architecture.', email: 'priya.nair@cannogacollege.ca' },
    ],
    business: [
        { name: 'Michael Thompson', role: 'Dean', bio: 'Experienced business leader and educator with expertise in strategy and entrepreneurship.', email: 'michael.thompson@cannogacollege.ca' },
        { name: 'Lisa Chen', role: 'Program Coordinator', bio: 'Accounting professional and instructor with industry experience in financial reporting.', email: 'lisa.chen@cannogacollege.ca' },
        { name: 'David Okonkwo', role: 'Faculty', bio: 'Marketing strategist and consultant specializing in digital brand development.', email: 'david.okonkwo@cannogacollege.ca' },
    ],
    technology: [
        { name: 'Daniel Campbell', role: 'Dean', bio: 'Engineering educator and researcher in intelligent systems and automation.', email: 'daniel.campbell@cannogacollege.ca' },
        { name: 'Aisha Rahman', role: 'Program Coordinator', bio: 'Software engineer and instructor focused on full-stack development and cybersecurity.', email: 'aisha.rahman@cannogacollege.ca' },
        { name: 'Tom Nguyen', role: 'Faculty', bio: 'Network specialist and educator teaching infrastructure and cloud systems.', email: 'tom.nguyen@cannogacollege.ca' },
    ],
    science: [
        { name: 'Dr. Emily Johansson', role: 'Dean', bio: 'Data science researcher and educator with industry partnerships in analytics and AI.', email: 'emily.johansson@cannogacollege.ca' },
        { name: 'Carlos Mendez', role: 'Program Coordinator', bio: 'Statistician and applied mathematician focused on quantitative research methods.', email: 'carlos.mendez@cannogacollege.ca' },
        { name: 'Fatima Al-Rashid', role: 'Faculty', bio: 'Computing instructor specializing in machine learning and data visualization.', email: 'fatima.alrashid@cannogacollege.ca' },
    ],
    'health-community': [
        { name: 'Dr. Rachel Adams', role: 'Dean', bio: 'Nursing educator and clinician with experience in community health and primary care.', email: 'rachel.adams@cannogacollege.ca' },
        { name: 'Mark Singh', role: 'Program Coordinator', bio: 'Personal support worker educator and frontline healthcare mentor.', email: 'mark.singh@cannogacollege.ca' },
        { name: 'Laura Bennett', role: 'Faculty', bio: 'Pharmacy technician instructor with retail and hospital pharmacy experience.', email: 'laura.bennett@cannogacollege.ca' },
    ],
    'hospitality-tourism': [
        { name: 'Chef Antonio Rossi', role: 'Dean', bio: 'Culinary educator and hospitality leader with restaurant and hotel management experience.', email: 'antonio.rossi@cannogacollege.ca' },
        { name: 'Nina Patel', role: 'Program Coordinator', bio: 'Tourism and event management professional with international resort experience.', email: 'nina.patel@cannogacollege.ca' },
        { name: 'Chris Osei', role: 'Faculty', bio: 'Hotel operations instructor focused on guest experience and revenue management.', email: 'chris.osei@cannogacollege.ca' },
    ],
    'education-social-sciences': [
        { name: 'Dr. Jennifer McLeod', role: 'Dean', bio: 'Education researcher and practitioner specializing in early childhood and inclusive learning.', email: 'jennifer.mcleod@cannogacollege.ca' },
        { name: 'Sam Carter', role: 'Program Coordinator', bio: 'Youth care worker and educator with community justice and social services background.', email: 'sam.carter@cannogacollege.ca' },
        { name: 'Maria Gonzalez', role: 'Faculty', bio: 'Classroom assistant mentor and education instructor with elementary school experience.', email: 'maria.gonzalez@cannogacollege.ca' },
    ],
    'transportation-aviation': [
        { name: 'Capt. Andrew Wilson', role: 'Dean', bio: 'Aviation professional and educator with airline and airport operations background.', email: 'andrew.wilson@cannogacollege.ca' },
        { name: 'Karen Liu', role: 'Program Coordinator', bio: 'Logistics specialist teaching transportation planning and supply chain fundamentals.', email: 'karen.liu@cannogacollege.ca' },
        { name: 'Brian Kowalski', role: 'Faculty', bio: 'Automotive service educator and former dealership technician with ASE certifications.', email: 'brian.kowalski@cannogacollege.ca' },
    ],
};

const TUITION_TEMPLATES: Record<string, { domestic: number; international: number }> = {
    'CERTIFICATE': { domestic: 3200, international: 5200 },
    'DIPLOMA': { domestic: 5600, international: 9500 },
    'BACHELOR': { domestic: 7200, international: 14000 },
    'MASTER': { domestic: 8500, international: 17000 },
};

const SCHOOL_FIELD_MAP: Record<string, string> = {
    'arts': 'ARTS',
    'business': 'BUSINESS',
    'technology': 'TECHNOLOGY',
    'science': 'SCIENCE',
    'health-community': 'HEALTH',
    'hospitality-tourism': 'HOSPITALITY',
    'education-social-sciences': 'EDUCATION',
    'transportation-aviation': 'TRANSPORTATION',
};

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedTuition() {
    const { data: existing } = await supabase.from('tuition_rates').select('degree_level, field');
    const existingKeys = new Set((existing || []).map(t => `${t.degree_level}-${t.field}`));

    const rowsToUpsert: any[] = [];

    for (const school of SCHOOLS) {
        const field = SCHOOL_FIELD_MAP[school.slug];
        if (!field) continue;

        const degreeLevelsInSchool = new Set<string>();
        for (const dept of school.departments) {
            for (const course of dept.courses) {
                degreeLevelsInSchool.add(course.degreeLevel);
            }
        }

        for (const degreeLevel of degreeLevelsInSchool) {
            const ranges = TUITION_TEMPLATES[degreeLevel];
            if (!ranges) continue;

            const domesticKey = `${degreeLevel}-${field}`;
            const internationalKey = `${degreeLevel}-${field}_INTERNATIONAL`;

            if (!existingKeys.has(domesticKey)) {
                rowsToUpsert.push({
                    degree_level: degreeLevel,
                    field: field,
                    annual_fee: ranges.domestic,
                    currency: 'CAD',
                });
            }

            if (!existingKeys.has(internationalKey)) {
                rowsToUpsert.push({
                    degree_level: degreeLevel,
                    field: `${field}_INTERNATIONAL`,
                    annual_fee: ranges.international,
                    currency: 'CAD',
                });
            }
        }
    }

    if (rowsToUpsert.length === 0) {
        console.log('✅ Tuition records already up to date');
        return;
    }

    const { error } = await supabase.from('tuition_rates').upsert(rowsToUpsert, { onConflict: 'degree_level,field' });
    if (error) {
        console.error('Failed to seed tuition rates:', error);
    } else {
        console.log(`✅ Seeded ${rowsToUpsert.length} tuition records`);
    }
}

async function upsertSystemSettings() {
    const settings = [
        { key: 'institution_name', value: INSTITUTION.name, description: 'Official institution display name' },
        { key: 'institution_type', value: INSTITUTION.type, description: 'Type of institution' },
        { key: 'street', value: INSTITUTION.street, description: 'Street address' },
        { key: 'city', value: INSTITUTION.city, description: 'City' },
        { key: 'province', value: INSTITUTION.province, description: 'Province/State' },
        { key: 'postal_code', value: INSTITUTION.postalCode, description: 'Postal / ZIP code' },
        { key: 'country', value: INSTITUTION.country, description: 'Country' },
        { key: 'country_code', value: INSTITUTION.countryCode, description: 'ISO country code' },
        { key: 'currency', value: INSTITUTION.currency, description: 'Default transactional currency' },
        { key: 'timezone', value: INSTITUTION.timezone, description: 'Default timezone' },
        { key: 'institution_email_domain', value: INSTITUTION.emailDomain, description: 'Institutional email domain (configurable)' },
        { key: 'institution_address_full', value: `${INSTITUTION.name}\n${INSTITUTION.street}\n${INSTITUTION.city}, ${INSTITUTION.province}\n${INSTITUTION.postalCode}\n${INSTITUTION.country}`, description: 'Full formatted postal address' },
        { key: 'institution_official_location', value: `${INSTITUTION.city}, ${INSTITUTION.province}`, description: 'Human-readable location' },
        { key: 'seo_default_title', value: `${INSTITUTION.name} — ${INSTITUTION.city}, ${INSTITUTION.province}`, description: 'Default SEO title' },
        { key: 'seo_default_description', value: `${INSTITUTION.name} is a career-focused college located in ${INSTITUTION.city}, ${INSTITUTION.province}, ${INSTITUTION.country}. Explore our programs, admissions, and support for international students.`, description: 'Default SEO description' },
    ];

    for (const s of settings) {
        await supabase.from('system_settings').upsert(
            { key: s.key, value: s.value, description: s.description },
            { onConflict: 'key' }
        );
    }
    console.log('✅ System settings seeded');
}

async function seedSchools() {
    const schoolMap: Record<string, string> = {};

    for (const s of SCHOOLS) {
        const { data: existing } = await supabase.from('School').select('id').eq('slug', s.slug).maybeSingle();
        if (existing) {
            schoolMap[s.slug] = existing.id;
            continue;
        }

        const { data, error } = await supabase.from('School').insert({
            name: s.name,
            slug: s.slug,
            description: s.description,
            imageUrl: s.imageUrl,
        }).select('id').single();

        if (error) {
            console.error(`Failed to create school ${s.slug}:`, error);
            continue;
        }
        schoolMap[s.slug] = data.id;
        console.log(`Created school: ${s.name}`);
    }

    return schoolMap;
}

async function seedDepartments(schoolMap: Record<string, string>) {
    const deptMap: Record<string, string> = {};

    for (const school of SCHOOLS) {
        for (const dept of school.departments) {
            const { data: existing } = await supabase.from('Department').select('id').eq('slug', dept.slug).maybeSingle();
            if (existing) {
                deptMap[dept.slug] = existing.id;
                continue;
            }

            const schoolId = schoolMap[school.slug];
            if (!schoolId) continue;

            const { data, error } = await supabase.from('Department').insert({
                name: dept.name,
                slug: dept.slug,
                schoolId,
                description: dept.description,
            }).select('id').single();

            if (error) {
                console.error(`Failed to create dept ${dept.slug}:`, error);
                continue;
            }
            deptMap[dept.slug] = data.id;
            console.log(`Created dept: ${dept.name}`);
        }
    }

    return deptMap;
}

async function seedCourses(schoolMap: Record<string, string>, deptMap: Record<string, string>) {
    const courseMap: Record<string, string> = {};

    for (const school of SCHOOLS) {
        for (const dept of school.departments) {
            for (const course of dept.courses) {
                const { data: existing } = await supabase.from('Course').select('id').eq('slug', course.slug).maybeSingle();
                let courseId = existing?.id;

                const schoolId = schoolMap[school.slug];
                const departmentId = deptMap[dept.slug];
                if (!schoolId || !departmentId) continue;

                if (!courseId) {
                    const { data, error } = await supabase.from('Course').insert({
                        title: course.title,
                        slug: course.slug,
                        degreeLevel: course.degreeLevel,
                        duration: course.duration,
                        description: course.description,
                        entryRequirements: course.entryRequirements,
                        careerPaths: course.careerPaths,
                        schoolId,
                        departmentId,
                        language: 'English',
                    }).select('id').single();

                    if (error) {
                        console.error(`Failed to create course ${course.slug}:`, error);
                        continue;
                    }
                    courseId = data.id;
                    console.log(`Created course: ${course.title}`);
                }

                courseMap[course.slug] = courseId;

                const subjectsToInsert = course.subjects.map((s, index) => ({
                    name: s.name,
                    creditUnits: s.credits,
                    semester: s.semester,
                    courseId,
                    id: `${courseId}-${index}`,
                }));

                const { error: subError } = await supabase.from('Subject').upsert(subjectsToInsert, { onConflict: 'id' });
                if (subError) {
                    console.error(`Failed to seed subjects for ${course.slug}:`, subError);
                } else {
                    console.log(`Seeded ${subjectsToInsert.length} subjects for ${course.title}`);
                }
            }
        }
    }

    return courseMap;
}

async function seedFaculty(schoolMap: Record<string, string>, deptMap: Record<string, string>) {
    for (const school of SCHOOLS) {
        const templates = FACULTY_TEMPLATES[school.slug] || [];
        const schoolId = schoolMap[school.slug];
        if (!schoolId) continue;

        for (const f of templates) {
            const departmentId = deptMap[school.departments[0]?.slug];
            if (!departmentId) continue;

            const { error } = await supabase.from('Faculty').insert({
                name: f.name,
                role: f.role,
                bio: f.bio,
                email: f.email,
                schoolId,
                departmentId,
            });

            if (error) {
                console.error(`Failed to create faculty ${f.name}:`, error);
            } else {
                console.log(`Created faculty: ${f.name}`);
            }
        }
    }
}

async function main() {
    console.log('🌱 Starting Cannoga College full seed...');

    try {
        await upsertSystemSettings();
        console.log('🏫 Seeding schools...');
        const schoolMap = await seedSchools();

        console.log('🏢 Seeding departments...');
        const deptMap = await seedDepartments(schoolMap);

        console.log('📚 Seeding courses and subjects...');
        const courseMap = await seedCourses(schoolMap, deptMap);

        console.log('👩‍🏫 Seeding faculty...');
        await seedFaculty(schoolMap, deptMap);

        console.log('💸 Seeding tuition...');
        await seedTuition();

        console.log('✅ Cannoga College full seed complete.');
    } catch (e) {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    }
}

main();
