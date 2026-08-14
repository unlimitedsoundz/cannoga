const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, '..', 'src', 'app');

const updates = {
  "about-heffring-university/page.tsx": {
    "title": "About Us | Our Mission, History & Ottawa campus — Cannoga College",
    "description": "Learn about our history, core values, and educational philosophy. Explore how Cannoga College supports student success and innovation on our Ottawa campus."
  },
  "academic-regulations/page.tsx": {
    "title": "Academic Guidelines & Regulations — Cannoga College",
    "description": "Review the official policies, rules, and academic standards governing coursework, evaluations, and student progression at Cannoga College."
  },
  "accessibility/page.tsx": {
    "title": "Digital Accessibility Commitment & Policy — Cannoga College",
    "description": "Read our dedication to providing accessible digital experiences, learning tools, and web platforms for all members of our community."
  },
  "admissions/application-process/page.tsx": {
    "title": "How to Apply: Step-by-Step Admissions Guide — Cannoga College",
    "description": "Find clear, step-by-step instructions on submitting your application, preparing your portfolio, tracking deadlines, and joining Cannoga College."
  },
  "admissions/bachelor/page.tsx": {
    "title": "Undergraduate Admissions & Bachelor's Entry — Cannoga College",
    "description": "Learn about admissions criteria, application pathways, and scholarship options for our English-taught Bachelor's programs."
  },
  "admissions/contact-information/page.tsx": {
    "title": "Admissions Contact Directory & Inquiry Desk — Cannoga College",
    "description": "Reach out to our admissions team for personalized guidance. Find telephone numbers, email addresses, and support hours."
  },
  "admissions/master/page.tsx": {
    "title": "Postgraduate Admissions & Master's Entry — Cannoga College",
    "description": "Discover admissions criteria, application requirements, and selection procedures for our advanced Master's degree programs."
  },
  "admissions/page.tsx": {
    "title": "Admissions & Enrollment Hub — Cannoga College",
    "description": "Explore educational options at Cannoga. Get information on entry pathways, deadlines, fees, and requirements for all programs."
  },
  "admissions/requirements/page.tsx": {
    "title": "Academic Admission Requirements & Criteria — Cannoga College",
    "description": "Check GPA requirements, English language proficiency test scores (IELTS/TOEFL), and documents needed to qualify for admissions."
  },
  "admissions/tuition/page.tsx": {
    "title": "Tuition Fees, Payment Plans & Scholarships — Cannoga College",
    "description": "Explore current tuition rates, acceptable payment methods, installments, and funding support for domestic and international students."
  },
  "admissions-policy/page.tsx": {
    "title": "Institutional Admissions Policy — Cannoga College",
    "description": "Read the policy governing selection standards, fairness, equality, and admission decisions at Cannoga College."
  },
  "alumni/page.tsx": {
    "title": "Global Alumni Network & Community — Cannoga College",
    "description": "Stay connected with fellow graduates, explore mentorship roles, join networking events, and access exclusive career services."
  },
  "art/page.tsx": {
    "title": "Creative Arts, Galleries & Student Showcases — Cannoga College",
    "description": "Discover upcoming art gallery viewings, design exhibitions, and creative projects by our students and faculty members in Ottawa."
  },
  "careers/layout.tsx": {
    "title": "Careers & Job Opportunities — Cannoga College",
    "description": "Explore faculty positions, research fellowships, and staff career opportunities within our dynamic campus community."
  },
  "code-of-conduct/page.tsx": {
    "title": "Community Code of Conduct & Ethics — Cannoga College",
    "description": "Learn about the behavioral standards, ethics, and values that guide interactions and maintain a respectful campus environment."
  },
  "collaboration/page.tsx": {
    "title": "Industry Collaborations & Strategic Partnerships — Cannoga College",
    "description": "Partner with Cannoga College on commercial research, internships, knowledge transfer programs, and local innovations."
  },
  "contact/page.tsx": {
    "title": "Contact Directory & General Inquiries — Cannoga College",
    "description": "Find primary phone lines, office locations, email directories, and contact forms for administrative departments at Cannoga."
  },
  "cookies/layout.tsx": {
    "title": "Cookies & Digital Privacy Policy — Cannoga College",
    "description": "Read how our online systems utilize cookies to deliver personalized content, ensure security, and improve website navigation."
  },
  "cookies/page.tsx": {
    "title": "Cookie Usage Statement — Cannoga College",
    "description": "Detailed outline of the cookie categories we collect and instructions on managing your browser preferences."
  },
  "degree-programmes/page.tsx": {
    "title": "Academic Degree Programmes & Certifications — Cannoga College",
    "description": "Find your ideal learning pathway. Browse our wide selection of certified Diploma, Bachelor's, and Master's courses."
  },
  "innovation/page.tsx": {
    "title": "Center for Innovation & Entrepreneurial Support — Cannoga College",
    "description": "Discover student incubators, start-up mentoring programs, and collaborative research spaces at our Ottawa Innovation Hub."
  },
  "international/page.tsx": {
    "title": "International Student Portal & Relocation Guide — Cannoga College",
    "description": "Prepare for your move to Canada. Access essential details on student visas, study permits, local housing, and language studies."
  },
  "news/page.tsx": {
    "title": "Newsroom, Press Releases & Event Calendar — Cannoga College",
    "description": "Keep up with current campus news, press releases, breakthroughs, and public events from Cannoga."
  },
  "news/why-study-in-ottawa-canada/page.tsx": {
    "title": "Choosing Ottawa: Top 10 Reasons for International Students — Cannoga College",
    "description": "Explore why Ottawa, Ontario, Canada stands out as a top global study destination, highlighting its standard of living, tech industry, and high-quality education."
  },
  "privacy/page.tsx": {
    "title": "Privacy & Data Protection Notice — Cannoga College",
    "description": "Our formal privacy notice detailing how we collect, process, and protect student and website user data under GDPR rules."
  },
  "refund-withdrawal-policy/page.tsx": {
    "title": "Tuition Refund & Course Withdrawal Terms — Cannoga College",
    "description": "Review key guidelines, deadlines, and requirements regarding tuition refunds and formal course withdrawals."
  },
  "research/page.tsx": {
    "title": "Scientific Research, Innovation & Labs — Cannoga College",
    "description": "Explore research initiatives, faculty publications, and specialist laboratories driving positive global change from Ottawa."
  },
  "research/projects/page.tsx": {
    "title": "Active Scientific & Collaborative Projects — Cannoga College",
    "description": "Discover current and historical research projects across technology, arts, sciences, and sustainability at Cannoga."
  },
  "research/publications/page.tsx": {
    "title": "Peer-Reviewed Academic Publications — Cannoga College",
    "description": "Read scholarly journals, conference papers, and project results published by our professors and research assistants."
  },
  "schools/page.tsx": {
    "title": "Academic Faculties & Schools — Cannoga College",
    "description": "Explore our diverse schools, including Business, Technology, Science, Health, and Arts. Find your academic department today."
  },
  "site-index/page.tsx": {
    "title": "Comprehensive Website Directory & Index — Cannoga College",
    "description": "Use our website index to navigate quickly to admissions, faculties, support desks, and administrative pages."
  },
  "student-guide/arrival/page.tsx": {
    "title": "New Student Arrival & Campus Welcome Guide — Cannoga College",
    "description": "Plan your travel and welcome week. View details on campus pickup options, initial registration steps, and orientation."
  },
  "student-guide/bachelor/layout.tsx": {
    "title": "Bachelor's Degree Student Orientation — Cannoga College",
    "description": "Access key schedules, course selection instructions, and advisors for new Bachelor's degree students."
  },
  "student-guide/bachelor/page.tsx": {
    "title": "Undergraduate Student Reference Guide — Cannoga College",
    "description": "Essential information on degree requirements, credit hours, and university systems for undergraduate students."
  },
  "student-guide/chat-with-heffring-students/page.tsx": {
    "title": "Connect with Current Student Ambassadors — Cannoga College",
    "description": "Chat directly with our current student ambassadors to hear first-hand about campus culture and living in Ottawa."
  },
  "student-guide/exchange/layout.tsx": {
    "title": "Incoming Exchange & Mobility Student Info — Cannoga College",
    "description": "Resource hub for incoming exchange partners. Information on courses open to visitor profiles, housing allocations, and credit transfers."
  },
  "student-guide/exchange/page.tsx": {
    "title": "International Exchange Program Guide — Cannoga College",
    "description": "Find checklists, enrollment procedures, and learning agreement guidelines for exchange students."
  },
  "student-guide/housing-for-students/page.tsx": {
    "title": "Student Accommodations & Off-Campus Rentals — Cannoga College",
    "description": "Explore student housing options in Ottawa. Learn about university partners, average rental costs, and local neighborhoods."
  },
  "student-guide/international/page.tsx": {
    "title": "Global Students Checklist & Resource Guide — Cannoga College",
    "description": "Access pre-arrival checklists, registration guides, residency advice, and campus services tailored for international students."
  },
  "student-guide/layout.tsx": {
    "title": "Student Academic Support & Guide Portal — Cannoga College",
    "description": "Your primary portal for academic calendars, digital learning systems, housing advice, and wellness resources."
  },
  "student-guide/master/layout.tsx": {
    "title": "Master's Student Portal & Resources — Cannoga College",
    "description": "Explore checklists, research thesis guidelines, and postgraduate events for newly enrolled master's students."
  },
  "student-guide/master/page.tsx": {
    "title": "Postgraduate Study Guide & Reference — Cannoga College",
    "description": "Guidance on academic advisor matching, thesis requirements, and credit systems for Master's students."
  },
  "student-guide/page.tsx": {
    "title": "Undergraduate & Postgraduate Resources — Cannoga College",
    "description": "Browse essential student tools, links to student services, calendars, and support desks for a successful academic year."
  },
  "student-handbook/page.tsx": {
    "title": "Official Student Handbook & Regulations — Cannoga College",
    "description": "Read the official student handbook detailing code of ethics, grade appeal procedures, housing policies, and campus rules."
  },
  "student-life/cafe/page.tsx": {
    "title": "Opiskelija Café Dining Menu & Operations — Cannoga College",
    "description": "Check menus, dietary details, student pricing, and opening hours for the Opiskelija campus dining room."
  },
  "student-life/layout.tsx": {
    "title": "Student Culture, Sports & Recreation — Cannoga College",
    "description": "Discover the community aspects of Cannoga: student unions, sports clubs, recreational amenities, and city life in Ottawa."
  },
  "student-life/page.tsx": {
    "title": "Campus Culture & Student Life Portal — Cannoga College",
    "description": "Get a glimpse into student events, interest groups, physical recreation, and arts programs active across our campus."
  },
  "studies/page.tsx": {
    "title": "Available Programs & Studies Directory — Cannoga College",
    "description": "Browse all study fields and formats, from degrees to executive training options, offered at Cannoga College."
  },
  "terms/layout.tsx": {
    "title": "Platform Terms of Service & Agreements — Cannoga College",
    "description": "Read the policies outlining acceptable use, data security responsibilities, and legal agreements for our website visitors."
  },
  "terms/page.tsx": {
    "title": "Terms of Use & Site Agreements — Cannoga College",
    "description": "Legal terms and standard rules governing access to and usage of the public Cannoga online portal."
  }
};

function escapeForSingleQuotes(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

Object.entries(updates).forEach(([relPath, data]) => {
  const filePath = path.join(srcAppDir, relPath.replace(/\//g, path.sep));
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (relPath === 'layout.tsx') {
    // Special layout.tsx updates
    const oldTitleDefault = 'default: "Cannoga College – Ottawa, Ontario, Canada"';
    const newTitleDefault = 'default: "Cannoga College | Higher Education & Research in Ottawa"';
    
    const oldTitlePlain1 = "title: 'Cannoga College – Ottawa, Ontario, Canada'";
    const newTitlePlain1 = "title: 'Cannoga College | Higher Education & Research in Ottawa'";
    const oldTitlePlain2 = 'title: "Cannoga College – Ottawa, Ontario, Canada"';
    const newTitlePlain2 = 'title: "Cannoga College | Higher Education & Research in Ottawa"';
    
    const oldDescription = 'Cannoga College is a dynamic and career-focused institution located in Ottawa, Ontario, Canada. The university is committed to providing high-quality education through a wide range of Diploma, Degree, and Certificate programs.';
    const newDescription = 'Pursue your academic and career goals at Cannoga College. We offer leading English-taught Degree, Diploma, and Certificate programs in Ottawa, Ontario, Canada.';
    
    let updated = content;
    updated = updated.replace(oldTitleDefault, newTitleDefault);
    updated = updated.replace(oldTitlePlain1, newTitlePlain1);
    updated = updated.replace(oldTitlePlain2, newTitlePlain2);
    // Replace all occurrences of oldDescription
    updated = updated.split(oldDescription).join(newDescription);
    
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated layout.tsx`);
    } else {
      console.error(`Could not update layout.tsx - strings didn't match`);
    }
    return;
  }
  
  // Normal file replacement
  // We match the export const metadata block:
  const metadataRegex = /export\s+const\s+metadata(:\s*Metadata)?\s*=\s*\{([\s\S]*?)\};/;
  const match = content.match(metadataRegex);
  
  if (!match) {
    console.error(`No metadata block found in: ${relPath}`);
    return;
  }
  
  const fullBlock = match[0];
  let blockContent = match[2];
  
  // Standard title/description literal regexes
  const titleRegex = /title:\s*('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g;
  const descriptionRegex = /description:\s*('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g;
  
  let newBlockContent = blockContent;
  
  const escapedTitle = escapeForSingleQuotes(data.title);
  const escapedDesc = escapeForSingleQuotes(data.description);
  
  if (titleRegex.test(blockContent)) {
    newBlockContent = newBlockContent.replace(titleRegex, `title: '${escapedTitle}'`);
  } else {
    // If not found inside, maybe we should prepend it? Usually it's there
    console.warn(`No title literal found in metadata block of: ${relPath}`);
  }
  
  if (descriptionRegex.test(blockContent)) {
    newBlockContent = newBlockContent.replace(descriptionRegex, `description: '${escapedDesc}'`);
  } else {
    console.warn(`No description literal found in metadata block of: ${relPath}`);
  }
  
  const newFullBlock = fullBlock.replace(blockContent, newBlockContent);
  const newContent = content.replace(fullBlock, newFullBlock);
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated: ${relPath}`);
});
console.log("All static updates processed!");
