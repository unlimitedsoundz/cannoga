
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCHOOL_BUSINESS_ID = 'a54123ea-caae-40ec-b3b0-d2c1d91528ca';
const SCHOOL_SCIENCE_ID = '3592d39b-e747-44c4-ab63-2fa22a1cc49a';

const DEPT_BUSINESS_ID = 'c4549615-f6bb-43f1-8e84-f523065bb08a';
const DEPT_CS_ID = '36796002-4383-4129-942e-8d8d2ad07e38';
const DEPT_CIVIL_ID = '6844c4bb-09b9-465a-b469-dd640f8c561c';

const coursesData = [
    // SCHOOL OF BUSINESS - Bachelor's
    {
        title: "Bachelor of Business Administration (BBA)",
        slug: "bba",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "BBA101", name: "Introduction to Business", credits: 6 },
            { code: "BBA102", name: "Principles of Marketing", credits: 6 },
            { code: "BBA103", name: "Organizational Behavior", credits: 6 },
            { code: "BBA104", name: "Business Communication", credits: 6 },
            { code: "BBA201", name: "Financial Accounting", credits: 6 },
            { code: "BBA202", name: "Business Law", credits: 6 },
            { code: "BBA203", name: "Management Information Systems", credits: 6 },
            { code: "BBA301", name: "Strategic Management", credits: 8 }
        ]
    },
    {
        title: "Bachelor of Business Management",
        slug: "business-management-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "MGT101", name: "Management Principles", credits: 6 },
            { code: "MGT102", name: "Business Ethics", credits: 6 },
            { code: "MGT201", name: "Operations Management", credits: 6 },
            { code: "MGT202", name: "Human Resource Management", credits: 6 },
            { code: "MGT301", name: "Leadership Development", credits: 6 },
            { code: "MGT302", name: "Project Management Foundations", credits: 6 }
        ]
    },
    {
        title: "Bachelor of International Business",
        slug: "international-business-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "INT101", name: "Global Business Environment", credits: 6 },
            { code: "INT102", name: "International Marketing", credits: 6 },
            { code: "INT201", name: "Cross-Cultural Management", credits: 6 },
            { code: "INT202", name: "International Finance", credits: 6 },
            { code: "INT301", name: "Global Supply Chain", credits: 6 },
            { code: "INT302", name: "Emerging Markets Strategy", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Entrepreneurship & Innovation",
        slug: "entrepreneurship-innovation-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "ENT101", name: "Ideation & Innovation", credits: 6 },
            { code: "ENT102", name: "Business Model Design", credits: 6 },
            { code: "ENT201", name: "Venture Capital & Finance", credits: 6 },
            { code: "ENT202", name: "Digital Entrepreneurship", credits: 6 },
            { code: "ENT301", name: "Startup Launchpad", credits: 10 },
            { code: "ENT302", name: "Growth Hacking", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Human Resource Management",
        slug: "human-resource-management-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "HRM101", name: "HR Fundamentals", credits: 6 },
            { code: "HRM102", name: "Talent Acquisition", credits: 6 },
            { code: "HRM201", name: "Compensation & Benefits", credits: 6 },
            { code: "HRM202", name: "Employee Relations", credits: 6 },
            { code: "HRM301", name: "Strategic HRM", credits: 6 },
            { code: "HRM302", name: "Organizational Psychology", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Project Management",
        slug: "project-management-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "PM101", name: "Project Management Lifecycle", credits: 6 },
            { code: "PM102", name: "Agile & Scrum Methodologies", credits: 6 },
            { code: "PM201", name: "Project Risk Management", credits: 6 },
            { code: "PM202", name: "Scheduling & Budgeting", credits: 6 },
            { code: "PM301", name: "Stakeholder Management", credits: 6 },
            { code: "PM302", name: "Advanced Project Portfolio", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Operations & Logistics Management",
        slug: "operations-logistics-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "LOG101", name: "Logistics Foundations", credits: 6 },
            { code: "LOG102", name: "Supply Chain Analytics", credits: 6 },
            { code: "LOG201", name: "Warehouse & Inventory", credits: 6 },
            { code: "LOG202", name: "Transport & Distribution", credits: 6 },
            { code: "LOG301", name: "Sustainable Operations", credits: 6 },
            { code: "LOG302", name: "Lean Management", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Digital Business Management",
        slug: "digital-business-management-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "DBM101", name: "Digital Economy", credits: 6 },
            { code: "DBM102", name: "E-Commerce Systems", credits: 6 },
            { code: "DBM201", name: "Digital Transformation", credits: 6 },
            { code: "DBM202", name: "Data-Driven Marketing", credits: 6 },
            { code: "DBM301", name: "Digital Product Management", credits: 6 },
            { code: "DBM302", name: "AI in Business", credits: 6 }
        ]
    },
    // SCHOOL OF BUSINESS - Master's
    {
        title: "Master of Business Administration (MBA)",
        slug: "mba",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "MBA501", name: "Leadership & Strategy", credits: 10 },
            { code: "MBA502", name: "Global Macroeconomics", credits: 6 },
            { code: "MBA503", name: "Corporate Finance", credits: 6 },
            { code: "MBA601", name: "Advanced Marketing Strategy", credits: 6 },
            { code: "MBA602", name: "Entrepreneurial Leadership", credits: 6 },
            { code: "MBA700", name: "MBA Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in International Business & Management",
        slug: "international-business-management-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "IBM501", name: "International Strategic Management", credits: 8 },
            { code: "IBM502", name: "Global Operations", credits: 6 },
            { code: "IBM503", name: "Advanced Cross-Cultural Management", credits: 6 },
            { code: "IBM601", name: "International Trade Law", credits: 6 },
            { code: "IBM700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Strategic Management",
        slug: "strategic-management-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "STR501", name: "Advanced Strategy Theory", credits: 8 },
            { code: "STR502", name: "Competitor Analysis", credits: 6 },
            { code: "STR601", name: "Corporate Governance", credits: 6 },
            { code: "STR602", name: "Mergers & Acquisitions", credits: 6 },
            { code: "STR700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Entrepreneurship & Innovation",
        slug: "entrepreneurship-innovation-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "EIN501", name: "Advanced Innovation Management", credits: 8 },
            { code: "EIN502", name: "Venture Capital Systems", credits: 6 },
            { code: "EIN601", name: "Lean Startup Methodology", credits: 6 },
            { code: "EIN602", name: "Digital Business Models", credits: 6 },
            { code: "EIN700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Project Management",
        slug: "project-management-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "MPM501", name: "Advanced PMO Standards", credits: 8 },
            { code: "MPM502", name: "Project Portfolio Optimization", credits: 6 },
            { code: "MPM601", name: "Global Project Teams", credits: 6 },
            { code: "MPM602", name: "Crisis Management in Projects", credits: 6 },
            { code: "MPM700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Global Business & Leadership",
        slug: "global-business-leadership-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_BUSINESS_ID,
        departmentId: DEPT_BUSINESS_ID,
        subjects: [
            { code: "GBL501", name: "Global Leadership Ethics", credits: 8 },
            { code: "GBL502", name: "International Business Strategy", credits: 6 },
            { code: "GBL601", name: "Leading Digital Transformation", credits: 6 },
            { code: "GBL602", name: "Strategic Change Management", credits: 6 },
            { code: "GBL700", name: "MSc Thesis", credits: 30 }
        ]
    },

    // SCHOOL OF SCIENCE - Bachelor's
    {
        title: "Bachelor of Computer Science",
        slug: "computer-science-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "CS101", name: "Intro to Computer Science", credits: 6 },
            { code: "CS102", name: "Programming in Python/C++", credits: 6 },
            { code: "CS201", name: "Data Structures & Algorithms", credits: 6 },
            { code: "CS202", name: "Operating Systems", credits: 6 },
            { code: "CS203", name: "Database Systems", credits: 6 },
            { code: "CS301", name: "Software Architecture", credits: 6 },
            { code: "CS302", name: "Cloud Computing", credits: 6 },
            { code: "CS303", name: "CS Capstone Project", credits: 12 }
        ]
    },
    {
        title: "Bachelor of Information Technology",
        slug: "information-technology-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "IT101", name: "IT Fundamentals", credits: 6 },
            { code: "IT102", name: "Networking Basics", credits: 6 },
            { code: "IT201", name: "Web Technologies", credits: 6 },
            { code: "IT202", name: "System Administration", credits: 6 },
            { code: "IT301", name: "IT Project Management", credits: 6 },
            { code: "IT302", name: "Enterprise IT Solutions", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Data Science",
        slug: "data-science-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "DS101", name: "Statistical Methods", credits: 6 },
            { code: "DS102", name: "Computational Thinking", credits: 6 },
            { code: "DS201", name: "Machine Learning Foundations", credits: 6 },
            { code: "DS202", name: "Data Visualization", credits: 6 },
            { code: "DS301", name: "Big Data Systems", credits: 6 },
            { code: "DS302", name: "Deep Learning Intro", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Software Engineering",
        slug: "software-engineering-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "SE101", name: "Requirements Engineering", credits: 6 },
            { code: "SE102", name: "Object Oriented Design", credits: 6 },
            { code: "SE201", name: "Software Testing & QA", credits: 6 },
            { code: "SE202", name: "DevOps Practices", credits: 6 },
            { code: "SE301", name: "Mobile App Development", credits: 6 },
            { code: "SE302", name: "Scrum Master Foundations", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Cybersecurity",
        slug: "cybersecurity-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "CYS101", name: "Security Fundamentals", credits: 6 },
            { code: "CYS102", name: "Network Security", credits: 6 },
            { code: "CYS201", name: "Ethical Hacking", credits: 6 },
            { code: "CYS202", name: "Cryptography", credits: 6 },
            { code: "CYS301", name: "Incident Response", credits: 6 },
            { code: "CYS302", name: "Cloud Security", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Artificial Intelligence",
        slug: "artificial-intelligence-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "AI101", name: "AI Foundations", credits: 6 },
            { code: "AI102", name: "Neural Networks", credits: 6 },
            { code: "AI201", name: "Natural Language Processing", credits: 6 },
            { code: "AI202", name: "Computer Vision", credits: 6 },
            { code: "AI301", name: "Reinforcement Learning", credits: 6 },
            { code: "AI302", name: "Ethics in AI", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Environmental Science",
        slug: "environmental-science-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CIVIL_ID,
        subjects: [
            { code: "EVS101", name: "Ecology & Ecosystems", credits: 6 },
            { code: "EVS102", name: "Climate Change Science", credits: 6 },
            { code: "EVS201", name: "Environmental Chemistry", credits: 6 },
            { code: "EVS202", name: "Water Resource Management", credits: 6 },
            { code: "EVS301", name: "Renewable Energy Systems", credits: 6 },
            { code: "EVS302", name: "Sustainable Policy", credits: 6 }
        ]
    },
    {
        title: "Bachelor of Information Systems",
        slug: "information-systems-bachelor",
        degreeLevel: "BACHELOR",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "IS101", name: "Business Processes", credits: 6 },
            { code: "IS102", name: "ERP Systems", credits: 6 },
            { code: "IS201", name: "Database Management", credits: 6 },
            { code: "IS202", name: "Systems Analysis", credits: 6 },
            { code: "IS301", name: "IT Governance", credits: 6 },
            { code: "IS302", name: "Strategic IS Planning", credits: 6 }
        ]
    },

    // SCHOOL OF SCIENCE - Master's
    {
        title: "MSc in Computer Science",
        slug: "computer-science-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MCS501", name: "Advanced Algorithms", credits: 8 },
            { code: "MCS502", name: "Distributed Systems", credits: 6 },
            { code: "MCS601", name: "Scientific Computing", credits: 6 },
            { code: "MCS602", name: "Advanced OS Design", credits: 6 },
            { code: "MCS700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Information Technology",
        slug: "information-technology-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MIT501", name: "Enterprise Architecture", credits: 8 },
            { code: "MIT502", name: "Advanced Networking", credits: 6 },
            { code: "MIT601", name: "Cyber Resilience", credits: 6 },
            { code: "MIT602", name: "IT Service Management", credits: 6 },
            { code: "MIT700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Data Science & Analytics",
        slug: "data-science-analytics-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MSA501", name: "Advanced Statistics", credits: 8 },
            { code: "MSA502", name: "Predictive Analytics", credits: 6 },
            { code: "MSA601", name: "Big Data Processing", credits: 6 },
            { code: "MSA602", name: "Optimization Methods", credits: 6 },
            { code: "MSA700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Artificial Intelligence",
        slug: "artificial-intelligence-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MAI501", name: "Deep Learning Systems", credits: 8 },
            { code: "MAI502", name: "AI Planning & Robotics", credits: 6 },
            { code: "MAI601", name: "NLP Advanced", credits: 6 },
            { code: "MAI602", name: "AI Ethics & Society", credits: 6 },
            { code: "MAI700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Cybersecurity",
        slug: "cybersecurity-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MCY501", name: "Cyber Defense Strategy", credits: 8 },
            { code: "MCY502", name: "Cryptographic Engineering", credits: 6 },
            { code: "MCY601", name: "Information Security Audit", credits: 6 },
            { code: "MCY602", name: "Forensics & Response", credits: 6 },
            { code: "MCY700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Software Engineering",
        slug: "software-engineering-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CS_ID,
        subjects: [
            { code: "MSE501", name: "Software Ecosystems", credits: 8 },
            { code: "MSE502", name: "Advanced Software Testing", credits: 6 },
            { code: "MSE601", name: "Continuous Integration & Delivery", credits: 6 },
            { code: "MSE602", name: "Software Measurement", credits: 6 },
            { code: "MSE700", name: "MSc Thesis", credits: 30 }
        ]
    },
    {
        title: "MSc in Environmental & Sustainability Science",
        slug: "environmental-sustainability-science-msc",
        degreeLevel: "MASTER",
        schoolId: SCHOOL_SCIENCE_ID,
        departmentId: DEPT_CIVIL_ID,
        subjects: [
            { code: "MES501", name: "Regenerative Design", credits: 8 },
            { code: "MES502", name: "Circular Economy Science", credits: 6 },
            { code: "MES601", name: "Environmental Impact Analysis", credits: 6 },
            { code: "MES602", name: "Sustainability Transition", credits: 6 },
            { code: "MES700", name: "MSc Thesis", credits: 30 }
        ]
    }
];

async function main() {
    console.log('🌱 Starting academic expansion seed...');

    for (const course of coursesData) {
        const { subjects, ...courseInfo } = course;

        // 1. Upsert Course
        const { data: courseRecord, error: courseError } = await supabase
            .from('Course')
            .upsert({
                ...courseInfo,
                duration: courseInfo.degreeLevel === "BACHELOR" ? "4 Years" : "2 Years",
                credits: courseInfo.degreeLevel === "BACHELOR" ? 90 : 60,
                description: `Official ${courseInfo.title} programme at Penkka University.`,
                language: 'English',
                careerPaths: "Diverse opportunities in global industries.",
                imageUrl: null
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (courseError) {
            console.error(`❌ Error seeding course ${courseInfo.slug}:`, courseError.message);
            continue;
        }

        console.log(`✅ Seeded Course: ${courseRecord.title}`);

        // 2. Clear old subjects
        await supabase.from('Subject').delete().eq('courseId', courseRecord.id);

        // 3. Insert Subjects
        const subjectsMapped = subjects.map((s, index) => ({
            name: s.name,
            code: s.code,
            creditUnits: s.credits,
            courseId: courseRecord.id,
            semester: Math.floor(index / 2) + 1,
            language: 'English'
        }));

        const { error: subjectError } = await supabase.from('Subject').insert(subjectsMapped);
        if (subjectError) {
            console.error(`   ❌ Error seeding subjects for ${courseInfo.slug}:`, subjectError.message);
        } else {
            console.log(`   ✅ Seeded ${subjectsMapped.length} subjects.`);
        }
    }

    console.log('✨ Academic expansion seeding complete!');
}

main();
