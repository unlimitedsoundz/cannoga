const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://lbkrzyqpdqgtqbodkcyi.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NTcxNTMsImV4cCI6MjEwMTEzMzE1M30.0fnx2dno78--fAlamSlLkywo4fpY_i8WTyuUZa_S_5E');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40);
}

function generateSubjectId(courseTitle, index, suffix = '') {
  const words = courseTitle.split(/[\s\-()]+/)
    .filter(w => w.length > 2 && w !== 'and' && w !== 'of' && w !== 'in' && w !== 'the' && w !== 'for' && w !== 'with' && w !== 'Master' && w !== 'Bachelor' && w !== 'Diploma' && w !== 'Certificate' && w !== 'Science' && w !== 'Arts' && w !== 'Engineering' && w !== 'Technology' && w !== 'Management')
    .slice(0, 2)
    .map(w => w.substring(0, 4).toUpperCase())
    .join('');
  const num = String(index).padStart(3, '0');
  return `${words}${num}${suffix}`.substring(0, 20);
}

function getCanadianSubjects(course) {
  const title = course.title.toLowerCase();
  const level = course.degreeLevel;
  const schoolId = course.schoolId;
  
  const baseSubjects = [];
  
  // Arts & Design school
  if (schoolId === '0b41ebd2-d034-4578-be50-e495e134d400') {
    if (title.includes('graphic design')) {
      baseSubjects.push(
        ['Graphic Design History and Trends', 3, 1],
        ['Color Theory and Application', 3, 1],
        ['Print and Publication Design', 3, 2],
        ['Motion Graphics and Animation', 3, 2],
        ['Web and Digital Design', 3, 3],
        ['Client Projects and Freelance Practice', 3, 3]
      );
    } else if (title.includes('interior design')) {
      baseSubjects.push(
        ['Interior Design History', 3, 1],
        ['Space Planning and Layout', 3, 1],
        ['Materials and Finishes', 3, 2],
        ['Lighting Design', 3, 2],
        ['Building Codes and Regulations', 3, 3],
        ['Sustainable Interior Design', 3, 3]
      );
    } else if (title.includes('film') || title.includes('television') || title.includes('scenography')) {
      baseSubjects.push(
        ['Screenwriting and Storytelling', 3, 1],
        ['Cinematography and Lighting', 3, 1],
        ['Film Editing and Post-Production', 3, 2],
        ['Production Design and Scenography', 3, 2],
        ['Directing and Performance', 3, 3],
        ['Film Business and Distribution', 3, 3]
      );
    } else if (title.includes('architecture')) {
      baseSubjects.push(
        ['Architectural History and Theory', 3, 1],
        ['Building Construction Methods', 3, 1],
        ['Structural Systems', 3, 2],
        ['Environmental Systems', 3, 2],
        ['Urban Design and Planning', 3, 3],
        ['Professional Practice and Ethics', 3, 3]
      );
    } else if (title.includes('animation')) {
      baseSubjects.push(
        ['Animation Principles', 3, 1],
        ['Character Animation', 3, 1],
        ['3D Modeling and Rigging', 3, 2],
        ['Storyboarding and Pre-visualization', 3, 2],
        ['Visual Effects Compositing', 3, 3],
        ['Animation Production Pipeline', 3, 3]
      );
    } else if (title.includes('design')) {
      baseSubjects.push(
        ['Design Research Methods', 3, 1],
        ['Visual Communication Theory', 3, 1],
        ['Interaction Design Principles', 3, 2],
        ['User Experience Testing', 3, 2],
        ['Design for Sustainability', 3, 3],
        ['Design Portfolio Development', 3, 3]
      );
    } else if (title.includes('art and media') || title.includes('media')) {
      baseSubjects.push(
        ['Digital Media Production', 3, 1],
        ['Cultural Studies and Critique', 3, 1],
        ['New Media Art Practices', 3, 2],
        ['Sound and Audio Design', 3, 2],
        ['Interactive and Installation Art', 3, 3],
        ['Media Arts Capstone Project', 6, 4]
      );
    } else if (title.includes('fine arts')) {
      baseSubjects.push(
        ['Advanced Drawing Techniques', 3, 1],
        ['Mixed Media Exploration', 3, 1],
        ['Installation and Site-Specific Work', 3, 2],
        ['Digital Art and New Media', 3, 2],
        ['Professional Art Practice', 3, 3],
        ['Exhibition and Curation', 3, 3]
      );
    } else if (title.includes('broadcasting')) {
      baseSubjects.push(
        ['Broadcast Journalism', 3, 1],
        ['Radio Production', 3, 1],
        ['Television Studio Production', 3, 2],
        ['Digital Broadcasting', 3, 2],
        ['Media Law and Ethics', 3, 3],
        ['Broadcast Management', 3, 3]
      );
    } else if (title.includes('social media marketing')) {
      baseSubjects.push(
        ['Social Media Strategy', 3, 1],
        ['Content Creation and Curation', 3, 1],
        ['Analytics and Metrics', 3, 2],
        ['Influencer Marketing', 3, 2],
        ['Campaign Management', 3, 3],
        ['Personal Branding', 3, 3]
      );
    } else if (title.includes('photography')) {
      baseSubjects.push(
        ['Advanced Lighting Techniques', 3, 1],
        ['Portrait and Commercial Photography', 3, 1],
        ['Digital Post-Processing', 3, 2],
        ['Documentary Photography', 3, 2],
        ['Photography Business', 3, 3],
        ['Professional Portfolio', 3, 3]
      );
    } else if (title.includes('marketing')) {
      baseSubjects.push(
        ['Marketing Research and Analysis', 3, 1],
        ['Brand Strategy and Management', 3, 1],
        ['Digital Marketing Channels', 3, 2],
        ['Consumer Behavior', 3, 2],
        ['Marketing Analytics', 3, 3],
        ['Integrated Marketing Campaigns', 3, 3]
      );
    }
  }
  
  // Business school
  else if (schoolId === '86303fdf-096f-4f4f-b3fc-b70e3ada4b5a') {
    if (title.includes('business administration') || title.includes('bba')) {
      baseSubjects.push(
        ['Organizational Behaviour', 3, 1],
        ['Business Statistics', 3, 1],
        ['Operations Management', 3, 2],
        ['Business Strategy', 3, 2],
        ['Leadership and Change Management', 3, 3],
        ['Business Capstone Project', 6, 4]
      );
    } else if (title.includes('accounting') || title.includes('finance')) {
      baseSubjects.push(
        ['Financial Accounting II', 3, 1],
        ['Corporate Finance', 3, 1],
        ['Management Accounting', 3, 2],
        ['Auditing and Assurance', 3, 2],
        ['Taxation Planning', 3, 3],
        ['Financial Reporting and Analysis', 3, 3]
      );
    } else if (title.includes('marketing')) {
      baseSubjects.push(
        ['Marketing Research', 3, 1],
        ['Digital Marketing', 3, 1],
        ['Consumer Behaviour', 3, 2],
        ['Brand Management', 3, 2],
        ['Strategic Marketing', 3, 3],
        ['Marketing Analytics', 3, 3]
      );
    } else if (title.includes('management') || title.includes('management studies')) {
      baseSubjects.push(
        ['Organizational Theory', 3, 1],
        ['Leadership Development', 3, 1],
        ['Change Management', 3, 2],
        ['Strategic Planning', 3, 2],
        ['International Business', 3, 3],
        ['Management Consulting Project', 6, 4]
      );
    } else if (title.includes('economics')) {
      baseSubjects.push(
        ['Microeconomic Theory', 3, 1],
        ['Macroeconomic Policy', 3, 1],
        ['Econometrics', 3, 2],
        ['International Economics', 3, 2],
        ['Financial Economics', 3, 3],
        ['Economic Research Project', 3, 3]
      );
    } else if (title.includes('entrepreneurship')) {
      baseSubjects.push(
        ['New Venture Creation', 3, 1],
        ['Lean Startup Methods', 3, 1],
        ['Funding and Investment', 3, 2],
        ['Digital Business Models', 3, 2],
        ['Scaling and Growth Strategies', 3, 3],
        ['Entrepreneurship Capstone', 6, 4]
      );
    } else if (title.includes('human resources')) {
      baseSubjects.push(
        ['Talent Acquisition', 3, 1],
        ['Employee Relations', 3, 1],
        ['Training and Development', 3, 2],
        ['Compensation and Benefits', 3, 2],
        ['HR Analytics', 3, 3],
        ['Strategic HR Management', 3, 3]
      );
    } else if (title.includes('international business')) {
      baseSubjects.push(
        ['Cross-Cultural Management', 3, 1],
        ['Global Trade and Logistics', 3, 1],
        ['International Finance', 3, 2],
        ['Global Marketing', 3, 2],
        ['Foreign Market Entry', 3, 3],
        ['International Business Strategy', 3, 3]
      );
    } else if (title.includes('operations') || title.includes('logistics')) {
      baseSubjects.push(
        ['Supply Chain Fundamentals', 3, 1],
        ['Logistics Operations', 3, 1],
        ['Inventory and Warehouse Management', 3, 2],
        ['Transportation Planning', 3, 2],
        ['Quality Control and Lean', 3, 3],
        ['Operations Capstone', 6, 4]
      );
    } else if (title.includes('project management')) {
      baseSubjects.push(
        ['Project Planning and Scheduling', 3, 1],
        ['Risk Management', 3, 1],
        ['Agile Project Management', 3, 2],
        ['Project Budgeting and Cost Control', 3, 2],
        ['Stakeholder Communication', 3, 3],
        ['Project Management Professional Practice', 3, 3]
      );
    } else if (title.includes('information systems') || title.includes('information service')) {
      baseSubjects.push(
        ['Systems Analysis and Design', 3, 1],
        ['Database Management', 3, 1],
        ['Enterprise Systems', 3, 2],
        ['IT Governance and Strategy', 3, 2],
        ['Business Intelligence', 3, 3],
        ['Information Systems Capstone', 6, 4]
      );
    } else if (title.includes('business foundations') || title.includes('business')) {
      baseSubjects.push(
        ['Introduction to Business', 3, 1],
        ['Business Mathematics', 3, 1],
        ['Business Communication', 3, 2],
        ['Customer Service Excellence', 3, 2],
        ['Office Administration', 3, 3],
        ['Business Fundamentals Project', 3, 3]
      );
    }
  }
  
  // Education & Social Sciences school
  else if (schoolId === '0cbc110e-8c24-463c-9623-7d349085b75f') {
    if (title.includes('early childhood education')) {
      baseSubjects.push(
        ['Child Development and Growth', 3, 1],
        ['Play-Based Learning', 3, 1],
        ['Health and Safety in Childcare', 3, 2],
        ['Family and Community Partnerships', 3, 2],
        ['Inclusive Practices', 3, 3],
        ['Early Childhood Practicum', 3, 3]
      );
    } else if (title.includes('psychology')) {
      baseSubjects.push(
        ['Cognitive Psychology', 3, 1],
        ['Social Psychology', 3, 1],
        ['Research Methods in Psychology', 3, 2],
        ['Abnormal Psychology', 3, 2],
        ['Developmental Psychology', 3, 3],
        ['Psychology Capstone', 6, 4]
      );
    } else if (title.includes('social work') || title.includes('community and justice')) {
      baseSubjects.push(
        ['Canadian Social Policy', 3, 1],
        ['Counselling Skills', 3, 1],
        ['Diversity and Anti-Oppressive Practice', 3, 2],
        ['Mental Health and Addictions', 3, 2],
        ['Community Development', 3, 3],
        ['Field Practicum', 6, 4]
      );
    } else if (title.includes('developmental services') || title.includes('child and youth care')) {
      baseSubjects.push(
        ['Human Development', 3, 1],
        ['Communication and Interviewing', 3, 1],
        ['Mental Health Support', 3, 2],
        ['Crisis Intervention', 3, 2],
        ['Case Management', 3, 3],
        ['Field Placement', 3, 3]
      );
    } else if (title.includes('social service worker')) {
      baseSubjects.push(
        ['Introduction to Social Services', 3, 1],
        ['Counselling Foundations', 3, 1],
        ['Group Facilitation', 3, 2],
        ['Trauma-Informed Practice', 3, 2],
        ['Ethics and Professional Boundaries', 3, 3],
        ['Social Service Field Work', 3, 3]
      );
    } else if (title.includes('leadership development')) {
      baseSubjects.push(
        ['Leadership Theory', 3, 1],
        ['Team Dynamics', 3, 1],
        ['Conflict Resolution', 3, 2],
        ['Emotional Intelligence', 3, 2],
        ['Change Leadership', 3, 3],
        ['Leadership Capstone Project', 3, 3]
      );
    }
  }
  
  // Health & Community Services school
  else if (schoolId === 'a2041423-97e4-40d1-967d-b5595ec294cd') {
    if (title.includes('nursing') || title.includes('practical nursing')) {
      baseSubjects.push(
        ['Anatomy and Physiology', 4, 1],
        ['Foundations of Nursing Practice', 3, 1],
        ['Health Assessment', 3, 2],
        ['Pharmacology', 3, 2],
        ['Medical-Surgical Nursing', 4, 3],
        ['Nursing Practicum', 6, 4]
      );
    } else if (title.includes('pharmacy')) {
      baseSubjects.push(
        ['Pharmaceutical Chemistry', 3, 1],
        ['Pharmacology for Technicians', 3, 1],
        ['Pharmacy Law and Ethics', 3, 2],
        ['Drug Distribution Systems', 3, 2],
        ['Clinical Pharmacy Practice', 3, 3],
        ['Pharmacy Practicum', 3, 3]
      );
    } else if (title.includes('health sciences') || title.includes('global health')) {
      baseSubjects.push(
        ['Epidemiology', 3, 1],
        ['Health Promotion', 3, 1],
        ['Health Policy and Systems', 3, 2],
        ['Environmental Health', 3, 2],
        ['Research Methods in Health', 3, 3],
        ['Health Sciences Capstone', 6, 4]
      );
    } else if (title.includes('dental hygiene')) {
      baseSubjects.push(
        ['Oral Anatomy and Histology', 3, 1],
        ['Dental Radiology', 3, 1],
        ['Periodontology', 3, 2],
        ['Preventive Dental Hygiene', 3, 2],
        ['Community Dental Health', 3, 3],
        ['Clinical Practicum', 3, 3]
      );
    } else if (title.includes('occupational therapist')) {
      baseSubjects.push(
        ['Human Anatomy and Function', 3, 1],
        ['Occupational Performance', 3, 1],
        ['Mental Health Concepts', 3, 2],
        ['Rehabilitation Techniques', 3, 2],
        ['Assistive Technology', 3, 3],
        ['Fieldwork Practicum', 6, 4]
      );
    } else if (title.includes('physiotherapist')) {
      baseSubjects.push(
        ['Musculoskeletal Anatomy', 3, 1],
        ['Exercise Physiology', 3, 1],
        ['Neurological Rehabilitation', 3, 2],
        ['Cardiopulmonary Therapy', 3, 2],
        ['Clinical Assessment', 3, 3],
        ['Physiotherapy Practicum', 6, 4]
      );
    } else if (title.includes('medical office')) {
      baseSubjects.push(
        ['Medical Terminology', 3, 1],
        ['Office Administration', 3, 1],
        ['Medical Billing and Coding', 3, 2],
        ['Electronic Health Records', 3, 2],
        ['Patient Communication', 3, 3],
        ['Medical Office Practicum', 3, 3]
      );
    } else if (title.includes('community support') || title.includes('personal support')) {
      baseSubjects.push(
        ['Personal Support Skills', 3, 1],
        ['Body Systems and Function', 3, 1],
        ['Mental Health and Dementia Care', 3, 2],
        ['Infection Control', 3, 2],
        ['Palliative Care', 3, 3],
        ['Field Placement', 3, 3]
      );
    } else if (title.includes('mental health and addictions')) {
      baseSubjects.push(
        ['Foundations of Mental Health', 3, 1],
        ['Addiction Studies', 3, 1],
        ['Crisis Intervention Skills', 3, 2],
        ['Trauma and Recovery', 3, 2],
        ['Community Mental Health', 3, 3],
        ['Practicum in Mental Health', 3, 3]
      );
    }
  }
  
  // Hospitality & Tourism school
  else if (schoolId === '60f6a142-715e-42d2-a486-19896c8ff718') {
    if (title.includes('culinary arts') || title.includes('culinary management')) {
      baseSubjects.push(
        ['Culinary Fundamentals and Knife Skills', 3, 1],
        ['Baking and Pastry Basics', 3, 1],
        ['Nutrition and Menu Planning', 3, 2],
        ['International Cuisine', 3, 2],
        ['Kitchen Management', 3, 3],
        ['Culinary Practicum', 3, 3]
      );
    } else if (title.includes('hotel') || title.includes('hospitality management')) {
      baseSubjects.push(
        ['Hotel Operations Management', 3, 1],
        ['Food and Beverage Service', 3, 1],
        ['Revenue Management', 3, 2],
        ['Hospitality Marketing', 3, 2],
        ['Event and Conference Planning', 3, 3],
        ['Hospitality Capstone Project', 6, 4]
      );
    } else if (title.includes('tourism') || title.includes('event planning')) {
      baseSubjects.push(
        ['Tourism Industry Overview', 3, 1],
        ['Destination Marketing', 3, 1],
        ['Event Coordination and Planning', 3, 2],
        ['Sustainable Tourism Development', 3, 2],
        ['Travel Services and Operations', 3, 3],
        ['Tourism Entrepreneurship', 3, 3]
      );
    } else if (title.includes('baking')) {
      baseSubjects.push(
        ['Baking Fundamentals', 3, 1],
        ['Breads and Viennoiserie', 3, 1],
        ['Cakes and Decorative Arts', 3, 2],
        ['Chocolate and Sugar Work', 3, 2],
        ['Bakery Management', 3, 3],
        ['Baking Practicum', 3, 3]
      );
    }
  }
  
  // Science school
  else if (schoolId === 'a4201f51-c6d7-475e-a80a-d4a332a89f57') {
    if (title.includes('computer science')) {
      baseSubjects.push(
        ['Data Structures and Algorithms', 3, 1],
        ['Computer Architecture', 3, 1],
        ['Operating Systems', 3, 2],
        ['Database Systems', 3, 2],
        ['Software Engineering', 3, 3],
        ['Computer Science Capstone', 6, 4]
      );
    } else if (title.includes('software engineering')) {
      baseSubjects.push(
        ['Software Development Lifecycle', 3, 1],
        ['Object-Oriented Design', 3, 1],
        ['Software Testing and QA', 3, 2],
        ['Web Application Development', 3, 2],
        ['Software Architecture', 3, 3],
        ['Software Engineering Project', 6, 4]
      );
    } else if (title.includes('environmental science') || title.includes('environmental')) {
      baseSubjects.push(
        ['Environmental Chemistry', 3, 1],
        ['Ecology and Biodiversity', 3, 1],
        ['Environmental Policy and Law', 3, 2],
        ['Climate Science', 3, 2],
        ['Sustainable Resource Management', 3, 3],
        ['Environmental Science Capstone', 6, 4]
      );
    } else if (title.includes('chemistry') || title.includes('materials')) {
      baseSubjects.push(
        ['Organic Chemistry', 3, 1],
        ['Physical Chemistry', 3, 1],
        ['Materials Science', 3, 2],
        ['Analytical Chemistry', 3, 2],
        ['Chemical Engineering Principles', 3, 3],
        ['Materials Science Capstone', 6, 4]
      );
    } else if (title.includes('biology') || title.includes('biochemistry')) {
      baseSubjects.push(
        ['Cell Biology', 3, 1],
        ['Genetics', 3, 1],
        ['Microbiology', 3, 2],
        ['Biochemistry', 3, 2],
        ['Molecular Biology', 3, 3],
        ['Biology Research Project', 6, 4]
      );
    } else if (title.includes('physics') || title.includes('applied physics')) {
      baseSubjects.push(
        ['Classical Mechanics', 3, 1],
        ['Electromagnetism', 3, 1],
        ['Quantum Physics', 3, 2],
        ['Thermodynamics', 3, 2],
        ['Optics and Waves', 3, 3],
        ['Physics Laboratory Project', 6, 4]
      );
    } else if (title.includes('mathematics') || title.includes('applied mathematics')) {
      baseSubjects.push(
        ['Advanced Calculus', 3, 1],
        ['Linear Algebra', 3, 1],
        ['Probability and Statistics', 3, 2],
        ['Differential Equations', 3, 2],
        ['Numerical Analysis', 3, 3],
        ['Mathematics Capstone', 6, 4]
      );
    } else if (title.includes('data science') || title.includes('data analytics')) {
      baseSubjects.push(
        ['Data Mining and Warehousing', 3, 1],
        ['Statistical Learning', 3, 1],
        ['Big Data Technologies', 3, 2],
        ['Data Visualization', 3, 2],
        ['Machine Learning Applications', 3, 3],
        ['Data Science Capstone', 6, 4]
      );
    } else if (title.includes('artificial intelligence') || title.includes('ai')) {
      baseSubjects.push(
        ['Foundations of AI', 3, 1],
        ['Machine Learning', 3, 1],
        ['Neural Networks and Deep Learning', 3, 2],
        ['Natural Language Processing', 3, 2],
        ['Computer Vision', 3, 3],
        ['AI Capstone Project', 6, 4]
      );
    } else if (title.includes('cybersecurity')) {
      baseSubjects.push(
        ['Network Security Fundamentals', 3, 1],
        ['Ethical Hacking', 3, 1],
        ['Security Operations', 3, 2],
        ['Incident Response', 3, 2],
        ['Security Governance', 3, 3],
        ['Cybersecurity Capstone', 6, 4]
      );
    } else if (title.includes('information technology') || title.includes('information systems')) {
      baseSubjects.push(
        ['IT Infrastructure', 3, 1],
        ['Networking Essentials', 3, 1],
        ['Cybersecurity Basics', 3, 2],
        ['Cloud Computing', 3, 2],
        ['IT Project Management', 3, 3],
        ['IT Capstone Project', 6, 4]
      );
    } else if (title.includes('laboratory technology')) {
      baseSubjects.push(
        ['Laboratory Safety and Procedures', 3, 1],
        ['Sample Collection and Processing', 3, 1],
        ['Clinical Chemistry', 3, 2],
        ['Microbiology Techniques', 3, 2],
        ['Quality Assurance', 3, 3],
        ['Laboratory Practicum', 3, 3]
      );
    } else if (title.includes('agriculture') || title.includes('environmental technician')) {
      baseSubjects.push(
        ['Soil Science and Management', 3, 1],
        ['Crop Production', 3, 1],
        ['Integrated Pest Management', 3, 2],
        ['Sustainable Agriculture Practices', 3, 2],
        ['Agricultural Technology', 3, 3],
        ['Agriculture Practicum', 3, 3]
      );
    }
  }
  
  // Technology school
  else if (schoolId === '9001c5a7-5eeb-4523-857a-21a3b4fbedd8') {
    if (title.includes('electrical') && title.includes('engineering')) {
      baseSubjects.push(
        ['Circuit Analysis', 3, 1],
        ['Digital Electronics', 3, 1],
        ['Electromagnetics', 3, 2],
        ['Power Systems', 3, 2],
        ['Control Systems', 3, 3],
        ['Electrical Engineering Capstone', 6, 4]
      );
    } else if (title.includes('electronics') || title.includes('nanoengineering')) {
      baseSubjects.push(
        ['Semiconductor Devices', 3, 1],
        ['Analog Circuit Design', 3, 1],
        ['Microelectronics', 3, 2],
        ['Embedded Systems', 3, 2],
        ['Nanotechnology Applications', 3, 3],
        ['Electronics Engineering Project', 6, 4]
      );
    } else if (title.includes('civil') && title.includes('engineering')) {
      baseSubjects.push(
        ['Structural Analysis', 3, 1],
        ['Construction Materials', 3, 1],
        ['Geotechnical Engineering', 3, 2],
        ['Transportation Engineering', 3, 2],
        ['Environmental Engineering', 3, 3],
        ['Civil Engineering Capstone', 6, 4]
      );
    } else if (title.includes('mechanical') && title.includes('engineering')) {
      baseSubjects.push(
        ['Mechanics of Materials', 3, 1],
        ['Thermodynamics', 3, 1],
        ['Fluid Mechanics', 3, 2],
        ['Machine Design', 3, 2],
        ['Manufacturing Processes', 3, 3],
        ['Mechanical Engineering Capstone', 6, 4]
      );
    } else if (title.includes('industrial engineering')) {
      baseSubjects.push(
        ['Work Measurement and Methods', 3, 1],
        ['Quality Control', 3, 1],
        ['Production Planning', 3, 2],
        ['Ergonomics and Safety', 3, 2],
        ['Lean Manufacturing', 3, 3],
        ['Industrial Engineering Project', 6, 4]
      );
    } else if (title.includes('chemical') || title.includes('materials')) {
      baseSubjects.push(
        ['Chemical Process Principles', 3, 1],
        ['Material Properties and Testing', 3, 1],
        ['Reaction Engineering', 3, 2],
        ['Process Control', 3, 2],
        ['Sustainable Materials', 3, 3],
        ['Chemical Engineering Capstone', 6, 4]
      );
    } else if (title.includes('computer systems') || title.includes('computer programming')) {
      baseSubjects.push(
        ['Programming Fundamentals', 3, 1],
        ['Computer Hardware', 3, 1],
        ['Operating Systems Administration', 3, 2],
        ['Network Configuration', 3, 2],
        ['Technical Support and Troubleshooting', 3, 3],
        ['Systems Project', 6, 4]
      );
    } else if (title.includes('software development') || title.includes('software engineering technician')) {
      baseSubjects.push(
        ['Object-Oriented Programming', 3, 1],
        ['Database Design and SQL', 3, 1],
        ['Web Development', 3, 2],
        ['Software Testing', 3, 2],
        ['Agile Development Practices', 3, 3],
        ['Software Development Project', 6, 4]
      );
    } else if (title.includes('cybersecurity')) {
      baseSubjects.push(
        ['Network Security', 3, 1],
        ['Ethical Hacking Fundamentals', 3, 1],
        ['Security Operations Center', 3, 2],
        ['Digital Forensics', 3, 2],
        ['Security Policy and Compliance', 3, 3],
        ['Cybersecurity Practicum', 3, 3]
      );
    } else if (title.includes('web development')) {
      baseSubjects.push(
        ['HTML and CSS Foundations', 3, 1],
        ['JavaScript Programming', 3, 1],
        ['Front-End Frameworks', 3, 2],
        ['Back-End Development', 3, 2],
        ['Responsive Design and UX', 3, 3],
        ['Web Development Portfolio', 3, 3]
      );
    } else if (title.includes('mechanical technician') || title.includes('mechanical foundations')) {
      baseSubjects.push(
        ['Mechanical Blueprint Reading', 3, 1],
        ['Machining and Fabrication', 3, 1],
        ['Hydraulics and Pneumatics', 3, 2],
        ['CNC Operations', 3, 2],
        ['Preventive Maintenance', 3, 3],
        ['Mechanical Technician Practicum', 3, 3]
      );
    } else if (title.includes('electrical technician') || title.includes('electrical techniques')) {
      baseSubjects.push(
        ['Electrical Theory', 3, 1],
        ['Wiring and Installation', 3, 1],
        ['Motor Controls', 3, 2],
        ['Industrial Electronics', 3, 2],
        ['Electrical Code and Safety', 3, 3],
        ['Electrical Technician Practicum', 3, 3]
      );
    } else if (title.includes('automotive') || title.includes('automotive service')) {
      baseSubjects.push(
        ['Automotive Engine Systems', 3, 1],
        ['Brakes and Suspension', 3, 1],
        ['Electrical Systems', 3, 2],
        ['Engine Performance', 3, 2],
        ['Transmission and Drivetrain', 3, 3],
        ['Automotive Service Practicum', 3, 3]
      );
    } else if (title.includes('welding')) {
      baseSubjects.push(
        ['Welding Safety and Blueprint Reading', 3, 1],
        ['Shielded Metal Arc Welding', 3, 1],
        ['Gas Metal Arc Welding', 3, 2],
        ['Welding Metallurgy', 3, 2],
        ['Welding Inspection and Testing', 3, 3],
        ['Welding Practicum', 3, 3]
      );
    } else if (title.includes('carpentry')) {
      baseSubjects.push(
        ['Carpentry Fundamentals', 3, 1],
        ['Residential Construction', 3, 1],
        ['Cabinetry and Finish Work', 3, 2],
        ['Commercial Carpentry', 3, 2],
        ['Building Code Compliance', 3, 3],
        ['Carpentry Practicum', 3, 3]
      );
    } else if (title.includes('cloud computing') || title.includes('data analytics')) {
      baseSubjects.push(
        ['Cloud Platforms and Services', 3, 1],
        ['Cloud Security', 3, 1],
        ['Infrastructure as Code', 3, 2],
        ['Cloud Migration Strategies', 3, 2],
        ['Cloud Architecture Design', 3, 3],
        ['Cloud Project', 3, 3]
      );
    } else if (title.includes('software testing')) {
      baseSubjects.push(
        ['Testing Fundamentals', 3, 1],
        ['Manual Testing Techniques', 3, 1],
        ['Automated Testing Tools', 3, 2],
        ['Performance Testing', 3, 2],
        ['Test Planning and Management', 3, 3],
        ['Testing Practicum', 3, 3]
      );
    } else if (title.includes('information technology') || title.includes('it-networking')) {
      baseSubjects.push(
        ['Computer Networks', 3, 1],
        ['Routing and Switching', 3, 1],
        ['Network Security', 3, 2],
        ['Windows and Linux Administration', 3, 2],
        ['Technical Support', 3, 3],
        ['IT Practicum', 3, 3]
      );
    }
  }
  
  // Transportation & Aviation school
  else if (schoolId === '0d28baa8-a6ec-4849-8c8c-604b7672779f') {
    if (title.includes('aviation management')) {
      baseSubjects.push(
        ['Aviation Industry Overview', 3, 1],
        ['Airport Operations', 3, 1],
        ['Aviation Safety Management', 3, 2],
        ['Airline Operations', 3, 2],
        ['Aviation Law and Regulations', 3, 3],
        ['Aviation Management Capstone', 6, 4]
      );
    } else if (title.includes('automotive')) {
      baseSubjects.push(
        ['Automotive Engine Repair', 3, 1],
        ['Brake and Steering Systems', 3, 1],
        ['Electrical and Electronic Systems', 3, 2],
        ['Heating and Air Conditioning', 3, 2],
        ['Transmission and Drivetrains', 3, 3],
        ['Automotive Practicum', 3, 3]
      );
    } else if (title.includes('aviation maintenance') || title.includes('aircraft')) {
      baseSubjects.push(
        ['Aircraft Structures', 3, 1],
        ['Aircraft Powerplants', 3, 1],
        ['Avionics Systems', 3, 2],
        ['Aircraft Maintenance Practices', 3, 2],
        ['Maintenance Regulations', 3, 3],
        ['Maintenance Practicum', 3, 3]
      );
    } else if (title.includes('flight services')) {
      baseSubjects.push(
        ['Aviation Safety and Security', 3, 1],
        ['Passenger Services', 3, 1],
        ['Emergency Procedures', 3, 2],
        ['Aviation Communication', 3, 2],
        ['Customer Service in Aviation', 3, 3],
        ['Flight Services Practicum', 3, 3]
      );
    } else if (title.includes('logistics') || title.includes('transportation')) {
      baseSubjects.push(
        ['Transportation Fundamentals', 3, 1],
        ['Supply Chain Management', 3, 1],
        ['Fleet Operations', 3, 2],
        ['Warehousing and Distribution', 3, 2],
        ['Transportation Law', 3, 3],
        ['Logistics Capstone Project', 6, 4]
      );
    }
  }
  
  // Default generic subjects for any remaining courses
  if (baseSubjects.length === 0) {
    const levelNum = level === 'CERTIFICATE' ? 1 : level === 'DIPLOMA' ? 2 : level === 'BACHELOR' ? 4 : 2;
    baseSubjects.push(
      ['Introduction to ' + course.title.replace(/^(Bachelor|Master|Diploma|Certificate)\s+(of\s+)?/i, ''), 3, 1],
      ['Core Concepts and Principles', 3, 1],
      ['Intermediate Studies', 3, 2],
      ['Applied Practice and Methods', 3, 2],
      ['Advanced Topics', 3, levelNum],
      ['Capstone Project', 6, levelNum]
    );
  }
  
  return baseSubjects.map(([name, credits, semester], idx) => ({
    id: generateSubjectId(course.title, idx + 1),
    name: `${course.title.split(' ').slice(0, 2).join(' ').substring(0, 6).toUpperCase()} ${(semester * 100 + idx + 1)}: ${name}`,
    creditUnits: credits,
    semester: semester,
    courseId: course.id
  }));
}

(async () => {
  const { data: courses } = await supabase.from('Course').select('id, title, degreeLevel, schoolId, departmentId');
  const { data: subjects } = await supabase.from('Subject').select('id, name, creditUnits, semester, courseId');
  
  const subjectCounts = {};
  subjects?.forEach(s => {
    subjectCounts[s.courseId] = (subjectCounts[s.courseId] || 0) + 1;
  });
  
  const lowCourses = courses?.filter(c => (subjectCounts[c.id] || 0) < 5) || [];
  
  const allNewSubjects = [];
  const usedIds = new Set(subjects?.map(s => s.id) || []);
  
  for (const course of lowCourses) {
    const needed = 5 - (subjectCounts[course.id] || 0);
    const candidates = getCanadianSubjects(course);
    const existingNames = new Set(
      subjects?.filter(s => s.courseId === course.id).map(s => s.name) || []
    );
    
    let added = 0;
    for (const subj of candidates) {
      if (added >= needed) break;
      if (!existingNames.has(subj.name) && !usedIds.has(subj.id)) {
        allNewSubjects.push(subj);
        usedIds.add(subj.id);
        added++;
      }
    }
  }
  
  console.log(`Total new subjects to generate: ${allNewSubjects.length}`);
  
  // Write SQL file
  let sql = '-- Seed additional subjects for courses with fewer than 5 subjects\n';
  sql += '-- Generated from actual Canadian academic standards\n\n';
  sql += 'BEGIN;\n\n';
  
  // Group by course for readability
  const byCourse = {};
  allNewSubjects.forEach(s => {
    if (!byCourse[s.courseId]) byCourse[s.courseId] = [];
    byCourse[s.courseId].push(s);
  });
  
  for (const [courseId, courseSubjects] of Object.entries(byCourse)) {
    const course = courses?.find(c => c.id === courseId);
    sql += `-- ${course?.title || courseId}\n`;
    sql += `INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES\n`;
    
    const values = courseSubjects.map((s, i) => {
      const escapedName = s.name.replace(/'/g, "''");
      const comma = i < courseSubjects.length - 1 ? ',' : '';
      return `  ('${s.id}', '${escapedName}', ${s.creditUnits}, ${s.semester}, '${s.courseId}')${comma}`;
    }).join('\n');
    
    sql += values + '\n';
    sql += `ON CONFLICT (id) DO UPDATE SET\n`;
    sql += `  name = EXCLUDED.name,\n`;
    sql += `  "creditUnits" = EXCLUDED."creditUnits",\n`;
    sql += `  semester = EXCLUDED.semester,\n`;
    sql += `  "courseId" = EXCLUDED."courseId";\n\n`;
  }
  
  sql += 'COMMIT;\n';
  
  fs.writeFileSync('supabase/migrations/20260808000003_seed_missing_subjects.sql', sql);
  console.log('SQL written to supabase/migrations/20260808000003_seed_missing_subjects.sql');
})();
