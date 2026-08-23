import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
    title: 'Complete Master Site Directory',
    description: 'The complete directory indexing all academic schools, departments, degree programs, student guides, portals, and administrative policies across Cannoga College.',
    alternates: {
        canonical: 'https://cannogacollege.ca/site-index/',
    },
};

const schoolsAndDepartments = [
    {
        name: 'School of Arts, Design and Architecture',
        href: '/schools/arts/',
        departments: [
            { name: 'Department of Art and Media', href: '/schools/arts/art-media/' },
            { name: 'Department of Design', href: '/schools/arts/design/' },
            { name: 'Department of Architecture', href: '/schools/arts/architecture/' },
            { name: 'Department of Film, Television and Scenography', href: '/schools/arts/film-tv/' },
            { name: 'Department of Media & Creative Arts', href: '/schools/arts/media-creative-arts-dept/' },
        ],
    },
    {
        name: 'School of Business',
        href: '/schools/business/',
        departments: [
            { name: 'Department of Accounting & Business Law', href: '/schools/business/accounting-business-law/' },
            { name: 'Department of Finance', href: '/schools/business/finance/' },
            { name: 'Department of Marketing', href: '/schools/business/marketing/' },
            { name: 'Department of Economics', href: '/schools/business/economics/' },
            { name: 'Department of Business & Management', href: '/schools/business/business-management-dept/' },
            { name: 'Department of Industrial Engineering & Management', href: '/schools/business/entrepreneurship-digital/' },
            { name: 'Department of Information & Service Management', href: '/schools/business/info-service/' },
            { name: 'Department of Management Studies', href: '/schools/business/management/' },
        ],
    },
    {
        name: 'School of Technology',
        href: '/schools/technology/',
        departments: [
            { name: 'Department of Civil & Environmental Engineering', href: '/schools/technology/civil-environmental/' },
            { name: 'Department of Electrical Engineering & Automation', href: '/schools/technology/automation-control/' },
            { name: 'Department of Energy & Mechanical Engineering', href: '/schools/technology/energy-mechanical/' },
            { name: 'Department of Engineering & Skilled Trades', href: '/schools/technology/engineering-skilled-trades-dept/' },
            { name: 'Department of Information Technology', href: '/schools/technology/information-technology-dept/' },
        ],
    },
    {
        name: 'School of Science',
        href: '/schools/science/',
        departments: [
            { name: 'Department of Applied Physics & Mathematics', href: '/schools/science/physics-math/' },
            { name: 'Department of Chemical & Metallurgical Engineering', href: '/schools/science/chemical-materials/' },
            { name: 'Department of Computer Science', href: '/schools/science/computer-science-digital/' },
            { name: 'Department of Environment & Agriculture', href: '/schools/science/environment-agriculture-dept/' },
        ],
    },
    {
        name: 'School of Health and Community Services',
        href: '/schools/health-community/',
        departments: [
            { name: 'Department of Health & Community Services', href: '/schools/health-community/health-community-dept/' },
            { name: 'Department of Nursing and Health Sciences', href: '/schools/health-community/nursing-health-sciences/' },
            { name: 'Department of Kinesiology & Human Movement', href: '/schools/health-community/kinesiology-human-movement/' },
        ],
    },
    {
        name: 'School of Education and Social Sciences',
        href: '/schools/education-social-sciences/',
        departments: [
            { name: 'Department of Education & Social Sciences', href: '/schools/education-social-sciences/education-social-sciences-dept/' },
            { name: 'Department of Psychology & Social Work', href: '/schools/education-social-sciences/psychology-social-work/' },
        ],
    },
    {
        name: 'School of Hospitality and Tourism',
        href: '/schools/hospitality-tourism/',
        departments: [
            { name: 'Department of Hospitality & Tourism', href: '/schools/hospitality-tourism/hospitality-tourism-dept/' },
        ],
    },
    {
        name: 'School of Transportation and Aviation',
        href: '/schools/transportation-aviation/',
        departments: [
            { name: 'Department of Transportation & Aviation', href: '/schools/transportation-aviation/transportation-aviation-dept/' },
        ],
    },
];

const masterDirectory = [
    {
        id: 'admissions',
        title: '1. Admissions & Prospective Students',
        description: 'Programs of study, entrance requirements, tuition fees, and online application channels.',
        links: [
            { name: 'Admissions Landing Hub', href: '/admissions' },
            { name: 'Bachelor\'s Degree Admissions', href: '/admissions/bachelor' },
            { name: 'Master\'s Degree Admissions', href: '/admissions/master' },
            { name: 'Application Process & Timelines', href: '/admissions/application-process' },
            { name: 'Country Entry Requirements', href: '/admissions/requirements' },
            { name: 'Tuition Fees & Scholarships', href: '/admissions/tuition' },
            { name: 'Admissions Contact Desk', href: '/admissions/contact-information' },
            { name: 'Degree Programmes Overview', href: '/degree-programmes' },
            { name: 'Online Application Portal', href: '/portal/apply' },
        ],
    },
    {
        id: 'student-guide',
        title: '2. Student Guide & Onboarding',
        description: 'Essential guides for international, exchange, and newly arriving Ottawa students.',
        links: [
            { name: 'Student Guide Portal', href: '/student-guide' },
            { name: 'International Student Guide', href: '/student-guide/international' },
            { name: 'Exchange & Visiting Students', href: '/student-guide/exchange' },
            { name: 'Ottawa Arrival & Orientation', href: '/student-guide/arrival' },
            { name: 'Bachelor\'s Student Handbook Guide', href: '/student-guide/bachelor' },
            { name: 'Master\'s Student Handbook Guide', href: '/student-guide/master' },
            { name: 'Student Housing & Accommodations Guide', href: '/housing/' },
            { name: 'Chat with Ambassadors & Students', href: '/student-guide/chat-with-cannoga-students' },
        ],
    },
    {
        id: 'student-life-housing',
        title: '3. Student Life & Campus Residences',
        description: 'On-campus housing, student dining, sports, and Ottawa community experience.',
        links: [
            { name: 'Student Housing & Residences', href: '/housing' },
            { name: 'Campus Life & Community', href: '/student-life' },
            { name: 'Campus Café & Dining Services', href: '/student-life/cafe' },
            { name: 'Alumni Network & Guild', href: '/alumni' },
            { name: 'Career Opportunities & Services', href: '/careers' },
        ],
    },
    {
        id: 'institutional-policies',
        title: '4. Institutional Policies & Handbooks',
        description: 'Official academic policies, student governance, code of ethics, and regulations.',
        links: [
            { name: 'Admissions Policy', href: '/admissions-policy' },
            { name: 'Academic Regulations', href: '/academic-regulations' },
            { name: 'Official Student Handbook', href: '/student-handbook' },
            { name: 'Refund & Fee Withdrawal Policy', href: '/refund-withdrawal-policy' },
            { name: 'Code of Conduct & Ethics', href: '/code-of-conduct' },
        ],
    },
    {
        id: 'research',
        title: '5. Research & Publications',
        description: 'Pioneering academic research, active projects, and scholarly publications.',
        links: [
            { name: 'Research Overview & Impact', href: '/research' },
            { name: 'Active Research Projects', href: '/research/projects' },
            { name: 'Research Publications & Papers', href: '/research/publications' },
            { name: 'Innovation Hub', href: '/innovation' },
            { name: 'Industry & External Collaboration', href: '/collaboration' },
        ],
    },
    {
        id: 'about-news',
        title: '6. About & Campus News',
        description: 'Institutional background, news articles, events, and campus location details.',
        links: [
            { name: 'Our History & Campus Story', href: '/about' },
            { name: 'News & Campus Events', href: '/news' },
            { name: 'Why Study in Ottawa, Canada', href: '/news/why-study-in-ottawa-canada' },
            { name: 'General Contact & Location', href: '/contact' },
        ],
    },
    {
        id: 'student-portal',
        title: '7. Student Portal & Self-Service Desk',
        description: 'MyCannoga student portal for course enrollment, timetables, and documents.',
        links: [
            { name: 'Student Portal Sign In', href: '/portal/account/login' },
            { name: 'Student Portal Registration', href: '/portal/account/register' },
            { name: 'Student Portal Dashboard', href: '/portal/dashboard' },
            { name: 'Course Enrollment', href: '/portal/student/courses' },
            { name: 'Timetable & Class Schedule', href: '/portal/student/timetable' },
            { name: 'Academic Transcript & Records', href: '/portal/student/transcript' },
            { name: 'IT Access & Accounts Desk', href: '/portal/student/it-access' },
            { name: 'Learning Management System (LMS)', href: '/portal/student/lms' },
            { name: 'IT & Technical Support Desk', href: '/portal/support' },
        ],
    },
    {
        id: 'administrative-sis',
        title: '8. Administrative & SIS Portals',
        description: 'Staff, faculty, and administrative Student Information System (SIS) management.',
        links: [
            { name: 'Admin Portal Login', href: '/portal/account/admin-login' },
            { name: 'Administrative Portal Hub', href: '/admin' },
            { name: 'Admissions Review System', href: '/admin/admissions/review' },
            { name: 'Course Management System', href: '/admin/courses' },
            { name: 'Faculty & Department Administration', href: '/admin/faculty' },
            { name: 'Financial Invoices & Housing Admin', href: '/admin/finance/invoices' },
            { name: 'Student Information System (SIS)', href: '/sis' },
            { name: 'SIS Academic Records Admin', href: '/sis/admin/academics' },
            { name: 'SIS Scheduling & Timetables', href: '/sis/admin/scheduling' },
        ],
    },
    {
        id: 'legal-terms',
        title: '9. Legal, Privacy & Digital Terms',
        description: 'Institutional legal terms, privacy compliance, cookie policies, and accessibility.',
        links: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Use & Agreements', href: '/terms' },
            { name: 'Cookie Usage Policy', href: '/cookies' },
            { name: 'Accessibility Statement', href: '/accessibility' },
        ],
    },
];

export default function SiteIndexPage() {
    return (
        <div className="bg-white min-h-screen font-sans text-black">
            {/* HERO SECTION */}
            <section className="bg-[#0a151a] text-white pt-28 pb-20 md:pt-40 md:pb-28 px-4 border-b border-slate-800">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-6">
                        <Link href="/" className="text-sky-400 hover:text-white transition-colors no-underline">HOME</Link>
                        <span className="text-slate-600">/</span>
                        <span>SITE DIRECTORY</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                        Master Site Directory
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Complete directory indexing all academic schools, specialized departments, degree courses, student portals, and administrative resources across Cannoga College.
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT WITH SIDEBAR NAVIGATION */}
            <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* STICKY SECTION NAV */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 space-y-4 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold uppercase tracking-wider text-slate-700">
                        <p className="text-slate-400 text-[10px] pb-2 border-b border-slate-200">Directory Sections</p>
                        <nav className="flex flex-col space-y-2">
                            <a href="#schools-departments" className="hover:text-black transition-colors">0. Schools &amp; Departments</a>
                            {masterDirectory.map((cat, i) => (
                                <a key={cat.id} href={`#${cat.id}`} className="hover:text-black transition-colors truncate">
                                    {i + 1}. {cat.title.replace(/^\d+\.\s*/, '')}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* DIRECTORY CONTENT BODY */}
                <div className="lg:col-span-3 space-y-14">

                    {/* SCHOOLS & DEPARTMENTS FULL DIRECTORY */}
                    <section id="schools-departments" className="scroll-mt-28 border-t-2 border-[#0a151a] pt-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                00
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Academic Schools &amp; Departments</h2>
                        </div>
                        <p className="text-sm text-slate-600 mb-8 pl-11">
                            Explore our 8 academic schools and specialized departments driving research, innovation, and industry-aligned education in Ottawa.
                        </p>

                        <div className="pl-11 space-y-10">
                            {schoolsAndDepartments.map((school) => (
                                <div key={school.name} className="space-y-3 border-b border-slate-100 pb-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="text-lg font-black text-slate-900">{school.name}</h3>
                                        <Link
                                            href={school.href}
                                            className="text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:text-sky-700 transition-colors flex items-center gap-1 no-underline shrink-0"
                                        >
                                            View School Hub <ArrowRight size={14} weight="bold" />
                                        </Link>
                                    </div>
                                    
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
                                        {school.departments.map((dept) => (
                                            <li key={dept.href}>
                                                <Link
                                                    href={dept.href}
                                                    className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#0a151a] py-1.5 border-b border-slate-50 transition-colors no-underline"
                                                >
                                                    <span className="group-hover:underline underline-offset-4">{dept.name}</span>
                                                    <ArrowRight size={14} weight="bold" className="text-slate-400 group-hover:text-[#0a151a] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* MASTER DIRECTORY SECTIONS */}
                    {masterDirectory.map((cat, index) => (
                        <section key={cat.id} id={cat.id} className="scroll-mt-28 border-t border-slate-200 pt-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold uppercase bg-[#0a151a] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{cat.title}</h2>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 pl-11">{cat.description}</p>

                            <ul className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none p-0 m-0">
                                {cat.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-[#0a151a] py-2 border-b border-slate-100 transition-colors no-underline"
                                        >
                                            <span className="group-hover:underline underline-offset-4">{link.name}</span>
                                            <ArrowRight size={14} weight="bold" className="text-slate-400 group-hover:text-[#0a151a] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    {/* HELP CTA LINE */}
                    <div className="mt-16 pt-8 border-t-2 border-[#0a151a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Need Assistance Finding a Page?</h3>
                            <p className="text-sm text-slate-600">Contact our Information Services Desk for guidance navigating institutional portals.</p>
                        </div>
                        <Link
                            href="/contact/"
                            className="bg-[#0a151a] text-white px-6 py-3 font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors no-underline shrink-0"
                        >
                            Contact Support Desk →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
