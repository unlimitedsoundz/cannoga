export interface SearchablePage {
    title: string;
    description?: string;
    href: string;
    category: string;
}

export const searchablePages: SearchablePage[] = [
    // Study & Admissions
    { title: "Digital Viewbook 2026/2027", href: "/viewbook", category: "Study & Admissions" },
    { title: "Admissions Overview", href: "/admissions", category: "Study & Admissions" },
    { title: "Certificate Programs", href: "/degree-programmes#certificates", category: "Study & Admissions" },
    { title: "Diploma Programs", href: "/degree-programmes#diplomas", category: "Study & Admissions" },
    { title: "Advanced Diploma Programs", href: "/degree-programmes#advanced-diplomas", category: "Study & Admissions" },
    { title: "Bachelor's Programmes", href: "/admissions/bachelor", category: "Study & Admissions" },
    { title: "Master's Programmes", href: "/admissions/master", category: "Study & Admissions" },
    { title: "Tuition Fees & Scholarships", href: "/admissions/tuition", category: "Study & Admissions" },
    { title: "Application Process", href: "/admissions/application-process", category: "Study & Admissions" },
    { title: "Requirements", href: "/admissions/requirements", category: "Study & Admissions" },
    { title: "All Courses", href: "/studies", category: "Study & Admissions" },

    // Research & Schools
    { title: "Research Overview", href: "/research", category: "Research & Schools" },
    { title: "Research Projects", href: "/research/projects", category: "Research & Schools" },
    { title: "Research Publications", href: "/research/publications", category: "Research & Schools" },
    { title: "All Schools", href: "/schools", category: "Research & Schools" },
    { title: "School of Arts & Architecture", href: "/schools/arts", category: "Research & Schools" },
    { title: "School of Business", href: "/schools/business", category: "Research & Schools" },
    { title: "School of Science", href: "/schools/science", category: "Research & Schools" },
    { title: "School of Technology", href: "/schools/technology", category: "Research & Schools" },

    // Departments
    { title: "Accounting & Business Law", href: "/schools/business/accounting-business-law", category: "Departments" },
    { title: "Applied Physics & Mathematics", href: "/schools/science/physics-math", category: "Departments" },
    { title: "Architecture", href: "/schools/arts/architecture", category: "Departments" },
    { title: "Art and Media", href: "/schools/arts/art-media", category: "Departments" },
    { title: "Automation & Control Engineering", href: "/schools/technology/automation-control", category: "Departments" },
    { title: "Chemical & Materials Engineering", href: "/schools/science/chemical-materials", category: "Departments" },
    { title: "Civil & Environmental Engineering", href: "/schools/technology/civil-environmental", category: "Departments" },
    { title: "Computer Science & Digital Systems", href: "/schools/science/computer-science-digital", category: "Departments" },
    { title: "Design", href: "/schools/arts/design", category: "Departments" },
    { title: "Economics", href: "/schools/business/economics", category: "Departments" },
    { title: "Electrical & Electronics Engineering", href: "/schools/technology/electrical-electronics", category: "Departments" },
    { title: "Film, Television and Scenography", href: "/schools/arts/film-tv", category: "Departments" },
    { title: "Finance", href: "/schools/business/finance", category: "Departments" },
    { title: "Information and Service Management", href: "/schools/business/info-service", category: "Departments" },
    { title: "Management Studies", href: "/schools/business/management", category: "Departments" },
    { title: "Marketing", href: "/schools/business/marketing", category: "Departments" },
    { title: "Energy & Mechanical Engineering", href: "/schools/technology/energy-mechanical", category: "Departments" },

    // Student Life & Guides
    { title: "International Student Guide", href: "/student-guide/international", category: "Student Life & Guides" },
    { title: "Exchange Students", href: "/student-guide/exchange", category: "Student Life & Guides" },
    { title: "Arrival Guide", href: "/student-guide/arrival", category: "Student Life & Guides" },
    { title: "Student Life", href: "/student-life", category: "Student Life & Guides" },
    { title: "Campus Information", href: "/student-guide", category: "Student Life & Guides" },

    // About Cannoga
    { title: "Our Story", href: "/about", category: "About Cannoga" },
    { title: "Contact Information", href: "/contact", category: "About Cannoga" },
    { title: "News & Events", href: "/news", category: "About Cannoga" },
    { title: "Collaboration", href: "/collaboration", category: "About Cannoga" },
    { title: "Innovation", href: "/innovation", category: "About Cannoga" },

    // Legal & Privacy
    { title: "Privacy Policy", href: "/privacy", category: "Legal & Privacy" },
    { title: "Terms of Use", href: "/terms", category: "Legal & Privacy" },
    { title: "Cookie Policy", href: "/cookies", category: "Legal & Privacy" },
    { title: "Accessibility Statement", href: "/accessibility", category: "Legal & Privacy" },
    { title: "Site Index", href: "/site-index", category: "Legal & Privacy" },
];
