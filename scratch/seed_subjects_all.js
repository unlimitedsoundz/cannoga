const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const courseData = {
  // 1. Business and Management
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
  },

  // 2. Information Technology
  'cybersecurity-foundations-cert': {
    prefix: 'SEC',
    area: 'Cybersecurity',
    subjects: [
      "Introduction to Cybersecurity",
      "Computer Hardware and Software",
      "Network Fundamentals",
      "Operating Systems",
      "Information Security Principles",
      "Ethical Hacking Basics",
      "Cybersecurity Tools",
      "Professional Communications"
    ]
  },
  'web-development-cert': {
    prefix: 'WEB',
    area: 'Web Development',
    subjects: [
      "HTML and CSS",
      "JavaScript Fundamentals",
      "Web Design Principles",
      "Responsive Web Development",
      "User Experience Design",
      "Content Management Systems",
      "Introduction to Databases",
      "Web Project Development"
    ]
  },
  'data-analytics-cert': {
    prefix: 'DAT',
    area: 'Data Analytics',
    subjects: [
      "Introduction to Data Analytics",
      "Statistics for Data Analysis",
      "Microsoft Excel for Analytics",
      "Database Fundamentals",
      "Data Visualization",
      "Business Intelligence Concepts",
      "Python Fundamentals",
      "Data Ethics"
    ]
  },
  'cloud-computing-cert': {
    prefix: 'CLD',
    area: 'Cloud Computing',
    subjects: [
      "Cloud Computing Fundamentals",
      "Virtualization Technologies",
      "Networking Essentials",
      "Cloud Platforms",
      "Linux Administration",
      "Security in Cloud Computing",
      "Storage Systems",
      "Cloud Services Management"
    ]
  },
  'software-testing-cert': {
    prefix: 'TST',
    area: 'Software Testing',
    subjects: [
      "Software Development Fundamentals",
      "Testing Methodologies",
      "Manual Testing Techniques",
      "Automated Testing",
      "Quality Assurance Principles",
      "Software Documentation",
      "Bug Tracking Systems",
      "Professional Practices"
    ]
  },
  'computer-programming-dip': {
    prefix: 'PRG',
    area: 'Computer Programming',
    subjects: [
      "Programming Fundamentals",
      "Object-Oriented Programming",
      "Web Development",
      "Database Design",
      "Java Programming",
      "Python Programming",
      "Systems Analysis",
      "Mobile Application Development",
      "Data Structures and Algorithms",
      "Software Engineering",
      "Operating Systems",
      "Capstone Project"
    ]
  },
  'computer-systems-technician-dip': {
    prefix: 'CST',
    area: 'Computer Systems',
    subjects: [
      "Computer Hardware",
      "Network Administration",
      "Windows Server Administration",
      "Linux Systems",
      "Cybersecurity Fundamentals",
      "Database Concepts",
      "Technical Support",
      "Virtualization Technologies",
      "Cloud Computing",
      "Scripting Fundamentals",
      "IT Project Management",
      "Work Placement"
    ]
  },
  'it-networking-dip': {
    prefix: 'NET',
    area: 'Networking',
    subjects: [
      "Network Fundamentals",
      "Routing and Switching",
      "Wireless Networking",
      "Linux Administration",
      "Windows Server",
      "Cybersecurity",
      "Cloud Infrastructure",
      "Network Troubleshooting",
      "Virtualization",
      "Systems Administration",
      "IT Service Management",
      "Capstone Project"
    ]
  },
  'cybersecurity-dip': {
    prefix: 'SEC',
    area: 'Cybersecurity',
    subjects: [
      "Information Security",
      "Ethical Hacking",
      "Network Security",
      "Digital Forensics",
      "Security Operations",
      "Incident Response",
      "Cryptography",
      "Risk Management",
      "Penetration Testing",
      "Cloud Security",
      "Security Compliance",
      "Capstone Project"
    ]
  },
  'software-development-dip': {
    prefix: 'DEV',
    area: 'Software Development',
    subjects: [
      "Programming Fundamentals",
      "Object-Oriented Programming",
      "Database Systems",
      "Software Engineering",
      "Web Development",
      "Mobile Development",
      "Systems Analysis",
      "Data Structures",
      "Cloud Computing",
      "API Development",
      "Agile Methodologies",
      "Software Project"
    ]
  },
  'ai-data-science-dip': {
    prefix: 'AID',
    area: 'Artificial Intelligence',
    subjects: [
      "Programming with Python",
      "Statistics",
      "Machine Learning Fundamentals",
      "Database Systems",
      "Data Visualization",
      "Artificial Intelligence Concepts",
      "Big Data Technologies",
      "Cloud Computing",
      "Data Mining",
      "Predictive Analytics",
      "Business Intelligence",
      "Applied AI Project"
    ]
  },

  // 3. Health and Community Services
  'personal-support-worker-cert': {
    prefix: 'PSW',
    area: 'Personal Support',
    subjects: [
      "Human Anatomy and Physiology",
      "Personal Care Skills",
      "Mental Health Support",
      "Nutrition and Wellness",
      "Communication Skills",
      "Infection Prevention",
      "Community Care",
      "Clinical Placement"
    ]
  },
  'medical-office-admin-cert': {
    prefix: 'MOA',
    area: 'Medical Administration',
    subjects: [
      "Medical Terminology",
      "Office Administration",
      "Medical Billing",
      "Health Records Management",
      "Customer Service",
      "Keyboarding Skills",
      "Healthcare Communications",
      "Medical Software Applications"
    ]
  },
  'community-support-worker-cert': {
    prefix: 'CSW',
    area: 'Community Support',
    subjects: [
      "Human Services Foundations",
      "Communication Skills",
      "Mental Health Awareness",
      "Crisis Intervention",
      "Community Resources",
      "Diversity and Inclusion",
      "Ethics and Professional Practice",
      "Field Placement"
    ]
  },
  'mental-health-addictions-cert': {
    prefix: 'MHA',
    area: 'Mental Health',
    subjects: [
      "Mental Health Fundamentals",
      "Addiction Studies",
      "Counselling Skills",
      "Crisis Intervention",
      "Psychology Basics",
      "Community Services",
      "Professional Ethics",
      "Practicum"
    ]
  },
  'practical-nursing-dip': {
    prefix: 'PRN',
    area: 'Practical Nursing',
    subjects: [
      "Anatomy and Physiology",
      "Pharmacology",
      "Nursing Foundations",
      "Medical-Surgical Nursing",
      "Maternal and Child Health",
      "Mental Health Nursing",
      "Community Health",
      "Health Assessment",
      "Clinical Practice",
      "Pathophysiology",
      "Professional Nursing Practice",
      "Consolidated Clinical Placement"
    ]
  },
  'pharmacy-technician-dip': {
    prefix: 'PHT',
    area: 'Pharmacy',
    subjects: [
      "Pharmaceutical Calculations",
      "Anatomy and Physiology",
      "Pharmacology",
      "Community Pharmacy Practice",
      "Hospital Pharmacy Practice",
      "Sterile Compounding",
      "Pharmacy Law and Ethics",
      "Medication Safety",
      "Clinical Placement",
      "Drug Distribution Systems",
      "Professional Practice",
      "Health Communications"
    ]
  },
  'occupational-therapist-assistant-dip': {
    prefix: 'OTA',
    area: 'Occupational Therapy',
    subjects: [
      "Human Anatomy",
      "Rehabilitation Principles",
      "Therapeutic Activities",
      "Mental Health Support",
      "Assistive Technologies",
      "Community Rehabilitation",
      "Professional Practice",
      "Field Placement",
      "Patient Care Skills",
      "Functional Assessment",
      "Communication Skills",
      "Ethics"
    ]
  },
  'physiotherapist-assistant-dip': {
    prefix: 'PTA',
    area: 'Physiotherapy',
    subjects: [
      "Anatomy and Physiology",
      "Exercise Therapy",
      "Patient Care Techniques",
      "Rehabilitation Science",
      "Therapeutic Modalities",
      "Musculoskeletal Conditions",
      "Neurological Rehabilitation",
      "Clinical Placement",
      "Professional Practice",
      "Health Promotion",
      "Communication Skills",
      "Functional Assessment"
    ]
  },
  'dental-hygiene-dip': {
    prefix: 'DHY',
    area: 'Dental Hygiene',
    subjects: [
      "Oral Anatomy",
      "Dental Sciences",
      "Preventive Dentistry",
      "Dental Radiography",
      "Periodontology",
      "Community Oral Health",
      "Clinical Practice",
      "Pharmacology",
      "Infection Control",
      "Dental Materials",
      "Ethics and Professional Practice",
      "Patient Education"
    ]
  },
  'early-childhood-education-health-dip': {
    prefix: 'ECE',
    area: 'Early Childhood Education',
    subjects: [
      "Child Development",
      "Curriculum Planning",
      "Inclusive Education",
      "Child Psychology",
      "Family and Community Relations",
      "Observation and Assessment",
      "Health and Safety",
      "Play-Based Learning",
      "Communication Skills",
      "Field Placement",
      "Behaviour Guidance",
      "Professional Practice"
    ]
  },
  'social-service-worker-dip': {
    prefix: 'SSW',
    area: 'Social Work',
    subjects: [
      "Human Behaviour",
      "Counselling Techniques",
      "Community Development",
      "Psychology",
      "Sociology",
      "Crisis Intervention",
      "Social Policy",
      "Case Management",
      "Group Dynamics",
      "Ethics",
      "Diversity and Inclusion",
      "Field Placement"
    ]
  },

  // 4. Hospitality and Tourism
  'event-planning-cert': {
    prefix: 'EVP',
    area: 'Event Planning',
    subjects: [
      "Introduction to Event Planning",
      "Event Marketing and Promotion",
      "Risk Management for Events",
      "Event Operations and Logistics",
      "Budgeting and Financial Management",
      "Food and Beverage Operations",
      "Customer Service Excellence",
      "Event Capstone Project"
    ]
  },
  'culinary-skills-cert': {
    prefix: 'CUL',
    area: 'Culinary Skills',
    subjects: [
      "Culinary Fundamentals",
      "Knife Skills and Prep Techniques",
      "Food Safety and Sanitation",
      "Introduction to Baking",
      "Basic Cooking Methods",
      "Nutrition and Menu Planning",
      "Kitchen Operations",
      "Culinary Practicum"
    ]
  },
  'hotel-operations-cert': {
    prefix: 'HTL',
    area: 'Hotel Operations',
    subjects: [
      "Front Office Procedures",
      "Housekeeping Operations",
      "Customer Service in Hospitality",
      "Introduction to Tourism",
      "Food and Beverage Service",
      "Property Management Systems",
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
      "Front Office Management",
      "Marketing for Hospitality",
      "Financial Accounting for Hotels",
      "Human Resources in Hospitality",
      "Hospitality Law and Ethics",
      "Customer Relationship Management",
      "Conference and Banqueting",
      "Cost Control Systems",
      "Leadership in Hospitality",
      "Management Internship"
    ]
  },
  'tourism-management-dip': {
    prefix: 'TOM',
    area: 'Tourism Management',
    subjects: [
      "Introduction to Global Tourism",
      "Tourism Marketing and Sales",
      "Sustainable Tourism Development",
      "Travel Agency Operations",
      "Destination Management",
      "Tour Guiding and Guiding Techniques",
      "Cultural Heritage Tourism",
      "Geography of Tourism",
      "Event and Tourism Integration",
      "Finance in Tourism",
      "Customer Service Management",
      "Co-op Work Term"
    ]
  },
  'culinary-management-dip': {
    prefix: 'CUL',
    area: 'Culinary Management',
    subjects: [
      "Advanced Cooking Techniques",
      "Kitchen Management",
      "Menu Design and Costing",
      "Butchery and Charcuterie",
      "International Cuisines",
      "Wine and Beverage Appreciation",
      "Garde Manger",
      "Pastry and Dessert Techniques",
      "Hospitality Human Resources",
      "Food Purchasing and Inventory",
      "Restaurant Entrepreneurship",
      "Culinary Management Internship"
    ]
  },
  'baking-pastry-arts-dip': {
    prefix: 'BPA',
    area: 'Baking & Pastry',
    subjects: [
      "Baking Ingredients and Technology",
      "Bread and Yeast Products",
      "Cake Design and Decorating",
      "Chocolate and Confections",
      "Pastry Shop Operations",
      "Advanced Pastries",
      "Food Safety and Sanitation",
      "Dessert Presentation",
      "Cost Control and Inventory",
      "Bakery Entrepreneurship",
      "Customer Relations",
      "Baking Arts Internship"
    ]
  },

  // 5. Engineering and Skilled Trades
  'welding-techniques-cert': {
    prefix: 'WLD',
    area: 'Welding',
    subjects: [
      "Introduction to Welding",
      "Shielded Metal Arc Welding (SMAW)",
      "Gas Metal Arc Welding (GMAW)",
      "Blueprint Reading and Drafting",
      "Welding Safety and Standards",
      "Gas Tungsten Arc Welding (GTAW)",
      "Fabrication Techniques",
      "Welding Shop Practice"
    ]
  },
  'electrical-techniques-cert': {
    prefix: 'ELT',
    area: 'Electrical Techniques',
    subjects: [
      "Electrical Fundamentals",
      "Residential Wiring Basics",
      "Canadian Electrical Code I",
      "Electrical Tools and Safety",
      "Blueprints and Schematics",
      "Introduction to AC/DC Circuits",
      "Commercial Wiring Basics",
      "Electrical Techniques Lab"
    ]
  },
  'carpentry-techniques-cert': {
    prefix: 'CAR',
    area: 'Carpentry',
    subjects: [
      "Introduction to Carpentry",
      "Carpentry Tools and Safety",
      "Residential Framing",
      "Construction Geometry & Blueprints",
      "Materials and Methods",
      "Interior and Exterior Finishes",
      "Building Codes and Regulations",
      "Carpentry Practical Project"
    ]
  },
  'mechanical-foundations-cert': {
    prefix: 'MEF',
    area: 'Mechanical Foundations',
    subjects: [
      "Mechanical Fundamentals",
      "Hand and Power Tools",
      "Fluid Power and Hydraulics",
      "Blueprint Reading & CAD Basics",
      "Shop Safety and Standards",
      "Machine Shop Practice",
      "Preventive Maintenance",
      "Mechanical Foundations Lab"
    ]
  },
  'civil-engineering-technician-dip': {
    prefix: 'CIV',
    area: 'Civil Engineering',
    subjects: [
      "Engineering Graphics and CAD",
      "Construction Surveying",
      "Soil Mechanics and Testing",
      "Fluid Mechanics and Hydraulics",
      "Structural Analysis",
      "Construction Materials",
      "Highway Engineering",
      "Environmental Engineering Basics",
      "Estimating and Costing",
      "Project Management",
      "Civil Engineering Software",
      "Capstone Design Project"
    ]
  },
  'mechanical-engineering-technician-dip': {
    prefix: 'MEC',
    area: 'Mechanical Engineering',
    subjects: [
      "Computer-Aided Design (CAD)",
      "Manufacturing Processes",
      "Mechanics of Materials",
      "Thermodynamics and Fluid Power",
      "Machine Design",
      "CNC Programming and Machining",
      "Quality Control and Metrology",
      "Automation and Robotics",
      "Mechanics of Machines",
      "Instrumentation and Control",
      "Industrial Safety & Management",
      "Capstone Project"
    ]
  },
  'electrical-engineering-technician-dip': {
    prefix: 'ELT',
    area: 'Electrical Engineering',
    subjects: [
      "DC/AC Circuits and Analysis",
      "Electronic Devices and Circuits",
      "Digital Electronics",
      "Electrical Machines",
      "Programmable Logic Controllers (PLCs)",
      "Power Systems and Distribution",
      "Control Systems",
      "Electrical Installation and Safety",
      "Industrial Automation",
      "Microcontrollers",
      "Project Management",
      "Capstone Project"
    ]
  },
  'architectural-technology-dip': {
    prefix: 'ARC',
    area: 'Architectural Technology',
    subjects: [
      "Architectural Drafting and CAD",
      "Building Materials and Methods",
      "History of Architecture",
      "Building Codes and Regulations",
      "Building Information Modeling (BIM)",
      "Architectural Design Studio",
      "Structural Systems",
      "Sustainable Building Design",
      "Estimating and Contracts",
      "Working Drawings and Details",
      "Environmental Systems",
      "Capstone Design Studio"
    ]
  },
  'construction-engineering-technician-dip': {
    prefix: 'CON',
    area: 'Construction Engineering',
    subjects: [
      "Construction Graphics and BIM",
      "Surveying and Site Layout",
      "Construction Materials & Testing",
      "Heavy Construction Methods",
      "Cost Estimating",
      "Project Planning and Scheduling",
      "Construction Law and Contracts",
      "Construction Safety Management",
      "Building Systems",
      "Structural Design Basics",
      "Construction Project Management",
      "Capstone Project"
    ]
  },

  // 6. Media and Creative Arts
  'digital-photography-cert': {
    prefix: 'PHO',
    area: 'Photography',
    subjects: [
      "Digital Camera Fundamentals",
      "Lighting Principles",
      "Introduction to Photo Editing",
      "Composition and Visual Storytelling",
      "Portrait Photography",
      "Commercial and Studio Photography",
      "Professional Practice & Portfolio",
      "Photography Exhibition"
    ]
  },
  'graphic-design-fundamentals-cert': {
    prefix: 'GDF',
    area: 'Graphic Design',
    subjects: [
      "Color Theory and Typography",
      "Adobe Photoshop Basics",
      "Adobe Illustrator Basics",
      "Visual Hierarchy",
      "Layout Design",
      "Digital Imaging",
      "Branding Principles",
      "Design Portfolio"
    ]
  },
  'social-media-marketing-cert': {
    prefix: 'SMM',
    area: 'Social Media Marketing',
    subjects: [
      "Social Media Platforms Overview",
      "Content Creation and Copywriting",
      "Social Media Analytics",
      "Digital Advertising Basics",
      "Brand Management Online",
      "Influencer Marketing",
      "Social Media Campaign Strategy",
      "Capstone Campaign Project"
    ]
  },
  'graphic-design-dip': {
    prefix: 'GRD',
    area: 'Graphic Design',
    subjects: [
      "History of Graphic Design",
      "Advanced Typography",
      "Adobe Creative Suite Mastery",
      "Brand Identity Design",
      "Editorial and Publication Design",
      "Web and UI/UX Design",
      "Package Design",
      "Motion Graphics Basics",
      "Print Production and Prepress",
      "Advertising and Art Direction",
      "Design Business & Portfolio",
      "Capstone Design Project"
    ]
  },
  'animation-dip': {
    prefix: 'ANI',
    area: 'Animation',
    subjects: [
      "History of Animation",
      "Principles of 2D Animation",
      "Principles of 3D Animation",
      "Character Design and Storyboarding",
      "Modeling and Texturing",
      "Rigging and Character Setup",
      "Digital Sculpting",
      "Lighting and Rendering",
      "Visual Effects (VFX)",
      "Audio Production for Animation",
      "Animation Production Pipeline",
      "Capstone Animation Project"
    ]
  },
  'interactive-media-design-dip': {
    prefix: 'IMD',
    area: 'Interactive Media',
    subjects: [
      "Web Design Fundamentals",
      "UI/UX Design Principles",
      "HTML5, CSS3, and JavaScript",
      "Audio and Video Production",
      "Responsive Web Development",
      "Content Management Systems",
      "Graphic Design for Interactive Media",
      "Motion Design",
      "E-Commerce and Web Analytics",
      "Project Management for Media",
      "Professional Practice & Portfolio",
      "Interactive Capstone Project"
    ]
  },
  'broadcasting-dip': {
    prefix: 'BRD',
    area: 'Broadcasting',
    subjects: [
      "Introduction to Broadcasting",
      "Radio Production",
      "Television Production",
      "Broadcast Writing and Journalism",
      "Audio Production Fundamentals",
      "Video Editing Techniques",
      "On-Air Presentation",
      "Media Law and Ethics",
      "Studio Operations",
      "Digital Media and Podcasting",
      "Sales and Programming",
      "Broadcasting Internship"
    ]
  },
  'film-tv-production-dip': {
    prefix: 'FTP',
    area: 'Film & Television',
    subjects: [
      "Screenwriting and Story Development",
      "Camera Operations and Cinematography",
      "Lighting and Sound Recording",
      "Directing Techniques",
      "Non-Linear Video Editing",
      "Audio Post-Production",
      "Producing and Production Management",
      "Documentary Film Production",
      "Narrative Film Production",
      "Television Studio Production",
      "Media Industry and Distribution",
      "Capstone Film Project"
    ]
  },

  // 7. Education and Social Sciences
  'educational-assistant-cert': {
    prefix: 'EDA',
    area: 'Education',
    subjects: [
      "Roles and Responsibilities of the EA",
      "Child Development and Learning",
      "Supporting Students with Exceptionalities",
      "Classroom Management Support",
      "Instructioning Strategies",
      "Language and Literacy Support",
      "Professional Communication",
      "Field Placement"
    ]
  },
  'leadership-development-cert': {
    prefix: 'LDR',
    area: 'Leadership',
    subjects: [
      "Principles of Leadership",
      "Organizational Communication",
      "Conflict Resolution",
      "Team Building and Collaboration",
      "Strategic Planning Basics",
      "Decision Making & Problem Solving",
      "Leadership Ethics",
      "Leadership Action Project"
    ]
  },
  'early-childhood-education-dip': {
    prefix: 'ECE',
    area: 'Early Childhood Education',
    subjects: [
      "Child Development",
      "Curriculum Planning",
      "Inclusive Education",
      "Child Psychology",
      "Family and Community Relations",
      "Observation and Assessment",
      "Health and Safety",
      "Play-Based Learning",
      "Communication Skills",
      "Field Placement",
      "Behaviour Guidance",
      "Professional Practice"
    ]
  },
  'child-youth-care-dip': {
    prefix: 'CYC',
    area: 'Child & Youth Care',
    subjects: [
      "Introduction to Child and Youth Care",
      "Developmental Psychology",
      "Therapeutic Program Design",
      "Counseling Skills for Youth",
      "Family Dynamics and Support",
      "Crisis Intervention in CYC",
      "Addiction and Mental Health in Youth",
      "Youth Justice and Advocacy",
      "Group Dynamics in Care",
      "Professional Ethics and Law",
      "CYC Field Placement I & II",
      "Capstone Integration Seminar"
    ]
  },
  'developmental-services-worker-dip': {
    prefix: 'DSW',
    area: 'Developmental Services',
    subjects: [
      "Foundations of Developmental Services",
      "Human Growth and Development",
      "Supporting Individuals with Autism",
      "Pharmacology and Health Support",
      "Interpersonal Communication Skills",
      "Crisis Prevention and Intervention",
      "Advocacy and Human Rights",
      "Community Integration and Inclusion",
      "Case Management and Planning",
      "Dual Diagnosis & Complex Needs",
      "DSW Field Placement I & II",
      "Professional Practice and Ethics"
    ]
  },
  'community-justice-services-dip': {
    prefix: 'CJS',
    area: 'Community & Justice',
    subjects: [
      "Introduction to the Canadian Justice System",
      "Criminology and Human Behaviour",
      "Penology and Correctional Practice",
      "Counseling and Rehabilitation",
      "Youth Justice Systems",
      "Crisis Intervention and Security",
      "Addictions and Mental Health in Justice",
      "Community Corrections and Parole",
      "Restorative Justice and Mediation",
      "Case Management in Justice Services",
      "Field Placement I & II",
      "Professional Ethics and Conduct"
    ]
  },

  // 8. Environment and Agriculture
  'sustainable-agriculture-cert': {
    prefix: 'SAG',
    area: 'Agriculture',
    subjects: [
      "Introduction to Sustainable Agriculture",
      "Soil Science and Management",
      "Crop Production Principles",
      "Sustainable Pest Management",
      "Urban Agriculture",
      "Farm Tools and Safety",
      "Small Farm Business Basics",
      "Sustainable Agriculture Practicum"
    ]
  },
  'environmental-management-cert': {
    prefix: 'EVM',
    area: 'Environmental Management',
    subjects: [
      "Environmental Science Fundamentals",
      "Environmental Laws and Regulations",
      "Waste Management Systems",
      "Introduction to GIS",
      "Water Resource Management",
      "Environmental Assessment",
      "Health and Safety in the Environment",
      "Environmental Project"
    ]
  },
  'environmental-technician-dip': {
    prefix: 'EVT',
    area: 'Environmental Technology',
    subjects: [
      "Ecology and Conservation",
      "Environmental Chemistry",
      "Soil and Water Sampling",
      "Geographic Information Systems (GIS)",
      "Waste and Wastewater Treatment",
      "Environmental Air Quality",
      "Environmental Remediation",
      "Wildlife and Habitat Management",
      "Environmental Legislation & Policy",
      "Data Analysis and Reporting",
      "Environmental Field School",
      "Capstone Applied Project"
    ]
  },
  'horticulture-technician-dip': {
    prefix: 'HOR',
    area: 'Horticulture',
    subjects: [
      "Plant Identification and Science",
      "Greenhouse Operations",
      "Landscape Design and Construction",
      "Soil Science and Fertilizers",
      "Plant Pathology and Pest Management",
      "Arboriculture Basics",
      "Nursery Management",
      "Turfgrass Management",
      "Horticulture Business and Sales",
      "Sustainable Landscaping Practices",
      "Horticulture Field Placement",
      "Capstone Design Project"
    ]
  },
  'agriculture-technology-dip': {
    prefix: 'AGT',
    area: 'Agriculture Technology',
    subjects: [
      "Precision Agriculture Systems",
      "Agricultural Machinery and Robotics",
      "GIS and Remote Sensing in Farming",
      "Soil and Water Engineering",
      "Crop Physiology and Breeding",
      "Farm Management Information Systems",
      "Data Analytics in Agriculture",
      "Sustainable Farming Practices",
      "Agribusiness Finance and Marketing",
      "Food Safety and Supply Chain",
      "Agri-Tech Field Placement",
      "Capstone Integration Project"
    ]
  },

  // 9. Transportation and Aviation
  'logistics-transportation-cert': {
    prefix: 'LOG',
    area: 'Logistics',
    subjects: [
      "Introduction to Logistics",
      "Transportation Systems Overview",
      "Inventory Management Basics",
      "Warehouse Operations",
      "Supply Chain Principles",
      "Business Communications",
      "Customs and Documentation",
      "Logistics Practical Project"
    ]
  },
  'flight-services-cert': {
    prefix: 'FLS',
    area: 'Flight Services',
    subjects: [
      "Aviation Safety and Procedures",
      "Cabin Crew Roles and Responsibilities",
      "Customer Service in Aviation",
      "Aviation Geography & Routing",
      "In-Flight Service Operations",
      "First Aid and Emergency Procedures",
      "Intercultural Communication",
      "Flight Services Practicum"
    ]
  },
  'aviation-management-dip': {
    prefix: 'AVM',
    area: 'Aviation Management',
    subjects: [
      "Introduction to Aviation Industry",
      "Airport Operations Management",
      "Airline Operations and Scheduling",
      "Aviation Safety and Security",
      "Aviation Law and Policy",
      "Aviation Finance and Economics",
      "Human Factors in Aviation",
      "Air Cargo and Logistics",
      "Marketing for Airlines and Airports",
      "Strategic Aviation Management",
      "Aviation Management Project",
      "Co-op Work Term"
    ]
  },
  'aircraft-maintenance-technician-dip': {
    prefix: 'AMT',
    area: 'Aircraft Maintenance',
    subjects: [
      "Aviation Mathematics and Physics",
      "Aircraft Structures and Materials",
      "Aerodynamics and Flight Theory",
      "Aircraft Electrical Systems",
      "Turbine and Piston Engines",
      "Aviation Regulations and Safety",
      "Hydraulic and Pneumatic Systems",
      "Avionics and Instrument Systems",
      "Aircraft Inspection and Maintenance",
      "Propeller Systems",
      "Maintenance Shop Practice",
      "Capstone Maintenance Project"
    ]
  },
  'automotive-service-technician-dip': {
    prefix: 'AST',
    area: 'Automotive Service',
    subjects: [
      "Automotive Engine Systems",
      "Electrical and Electronic Systems",
      "Suspension and Steering Systems",
      "Brake Systems",
      "Manual and Automatic Transmissions",
      "Engine Performance and Diagnostics",
      "Climate Control Systems",
      "Hybrid and Electric Vehicle Basics",
      "Shop Safety and Tool Operation",
      "Service Advisor Principles",
      "Automotive Co-op Placement",
      "Capstone Diagnostic Project"
    ]
  }
};

async function run() {
  console.log('Fetching all certificate and diploma courses...');
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

    // Insert in chunks of 5 to avoid any potential connection limits or payload issues, though 8/12 is small
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
