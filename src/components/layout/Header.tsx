
"use client"

import * as React from "react"
import { Link } from "@aalto-dx/react-components"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/Logo"
import { LanguageSelector } from "@/components/ui/LanguageSelector"
import { CaretDown, List, X, Plus, Minus, MagnifyingGlass as SearchIcon, MapPin } from "@phosphor-icons/react"
import { Search } from "./Search"

type NavItem = {
    name: string
    href: string
    children?: { name: string; href: string }[]
    sections?: {
        title: string
        items: { name: string; href: string }[]
    }[]
}

const navigation: NavItem[] = [
    {
        name: "Programs",
        href: "/studies/",
        sections: [
            {
                title: "Schools",
                items: [
                    { name: "Academic Programs & Studies Directory", href: "/studies/" },
                    { name: "All Academic Schools Directory", href: "/schools/" },
                    { name: "School of Arts, Design and Architecture", href: "/schools/arts/" },
                    { name: "School of Business", href: "/schools/business/" },
                    { name: "School of Science", href: "/schools/science/" },
                    { name: "School of Technology", href: "/schools/technology/" },
                    { name: "School of Health and Community Services", href: "/schools/health-community/" },
                    { name: "School of Hospitality and Tourism", href: "/schools/hospitality-tourism/" },
                    { name: "School of Education and Social Sciences", href: "/schools/education-social-sciences/" },
                    { name: "School of Transportation and Aviation", href: "/schools/transportation-aviation/" },
                ]
            },
            {
                title: "Departments",
                items: [
                    { name: "Accounting & Business Law", href: "/schools/business/accounting-business-law/" },
                    { name: "Applied Physics & Mathematics", href: "/schools/science/physics-math/" },
                    { name: "Architecture", href: "/schools/arts/architecture/" },
                    { name: "Art and Media", href: "/schools/arts/art-media/" },
                    { name: "Business & Management", href: "/schools/business/business-management-dept/" },
                    { name: "Chemical & Metallurgical Engineering", href: "/schools/science/chemical-materials/" },
                    { name: "Civil & Environmental Engineering", href: "/schools/technology/civil-environmental/" },
                    { name: "Computer Science", href: "/schools/science/computer-science-digital/" },
                    { name: "Design", href: "/schools/arts/design/" },
                    { name: "Economics", href: "/schools/business/economics/" },
                    { name: "Education & Social Sciences", href: "/schools/education-social-sciences/education-social-sciences-dept/" },
                    { name: "Electrical Engineering & Automation", href: "/schools/technology/automation-control/" },
                    { name: "Energy & Mechanical Engineering", href: "/schools/technology/energy-mechanical/" },
                    { name: "Engineering & Skilled Trades", href: "/schools/technology/engineering-skilled-trades-dept/" },
                    { name: "Environment & Agriculture", href: "/schools/science/environment-agriculture-dept/" },
                    { name: "Film, Television and Scenography", href: "/schools/arts/film-tv/" },
                    { name: "Finance", href: "/schools/business/finance/" },
                    { name: "Health & Community Services", href: "/schools/health-community/health-community-dept/" },
                    { name: "Hospitality & Tourism", href: "/schools/hospitality-tourism/hospitality-tourism-dept/" },
                    { name: "Industrial Engineering & Management", href: "/schools/business/entrepreneurship-digital/" },
                    { name: "Information & Service Management", href: "/schools/business/info-service/" },
                    { name: "Information Technology", href: "/schools/technology/information-technology-dept/" },
                    { name: "Management Studies", href: "/schools/business/management/" },
                    { name: "Marketing", href: "/schools/business/marketing/" },
                    { name: "Media & Creative Arts", href: "/schools/arts/media-creative-arts-dept/" },
                    { name: "Transportation & Aviation", href: "/schools/transportation-aviation/transportation-aviation-dept/" },
                ]
            }
        ]
    },
    {
        name: "Financial Aid",
        href: "/admissions/tuition/",
        children: [
            { name: "Scholarships & Tuition Fees", href: "/admissions/tuition/" },
            { name: "Refund & Withdrawal Policy", href: "/refund-withdrawal-policy/" },
        ]
    },
    {
        name: "Admissions",
        href: "/admissions/",
        children: [
            { name: "Digital Viewbook 2026/2027", href: "/viewbook" },
            { name: "Degree Programs", href: "/degree-programmes/" },
            { name: "Certificate & Diploma Programs", href: "/degree-programmes/#certificates" },
            { name: "How to Apply", href: "/admissions/application-process/" },
            { name: "Bachelor's Admission", href: "/admissions/bachelor/" },
            { name: "Master's Admissions", href: "/admissions/master/" },
            { name: "Admissions Policy", href: "/admissions-policy/" },
            { name: "Admission Services Contact", href: "/admissions/contact-information/" },
        ]
    },
    {
        name: "Current Students",
        href: "/student-guide/",
        children: [
            { name: "Student Guide", href: "/student-guide/" },
            { name: "Bachelor's Student Guide", href: "/student-guide/bachelor/" },
            { name: "Master's Student Guide", href: "/student-guide/master/" },
            { name: "Diploma Students Guide", href: "/student-guide/diploma/" },
            { name: "Certificate Students Guide", href: "/student-guide/certificate/" },
            { name: "Student Life & Campus", href: "/student-life/" },
            { name: "Health & Wellbeing", href: "/student-guide/health-and-wellbeing/" },
            { name: "Housing", href: "/housing/" },
            { name: "Academic Calendar", href: "/student-guide/#calendar" },
            { name: "Support Services", href: "/student-guide/#support" },
            { name: "Student Handbook", href: "/student-handbook/" },
            { name: "Academic Regulations", href: "/academic-regulations/" },
            { name: "Code of Conduct", href: "/code-of-conduct/" },
        ]
    },
    {
        name: "International Students",
        href: "/student-guide/international/",
        children: [
            { name: "International Student Guide", href: "/student-guide/international/" },
            { name: "Student Life", href: "/student-life/" },
            { name: "Health & Wellbeing", href: "/student-guide/health-and-wellbeing/" },
            { name: "Housing", href: "/housing/" },
            { name: "Arrival Guide", href: "/student-guide/arrival/" },
            { name: "Exchange Guide", href: "/student-guide/exchange/" },
            { name: "Chat with Students", href: "/student-guide/chat-with-cannoga-students/" },
        ]
    },
    {
        name: "Employees",
        href: "/portal/account/login/",
        children: [
            { name: "IT Support", href: "/portal/support/" },
            { name: "Student Portal Login", href: "/portal/account/login/" },
        ]
    },
    {
        name: "About",
        href: "/about/",
        children: [
            { name: "Our Story", href: "/about/" },
            { name: "Campus & Student Life", href: "/student-life/" },
            { name: "Welcome from the President", href: "/about/welcome-from-the-president/" },
            { name: "Leadership & Governance", href: "/about/leadership-and-governance/" },
            { name: "Innovation", href: "/innovation/" },
            { name: "News & Events", href: "/news/" },
            { name: "Research Hub", href: "/research/" },
            { name: "Careers", href: "/careers/" },
            { name: "Alumni", href: "/alumni/" },
            { name: "Contact Us", href: "/contact/" },
        ]
    }
]

export function Header() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [expandedMobileSections, setExpandedMobileSections] = React.useState<Record<string, boolean>>({})
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
    const [currentLanguage, setCurrentLanguage] = React.useState("en")

    React.useEffect(() => {
        const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
        if (match && match[1]) {
            setCurrentLanguage(match[1]);
        }
    }, [])

    const switchLanguage = (code: string) => {
        const cookieValue = `/en/${code}`;
        const domain = window.location.hostname;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`;
        window.location.reload();
    };

    const isAdmissionsPage = false
    const isPortalOrAdmin = pathname.startsWith('/portal') || pathname.startsWith('/admin')

    if (isPortalOrAdmin) return null;

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm flex flex-col"
        >
            {/* Top Utility Bar (Desktop only) */}
            <div className="hidden lg:block bg-[#0f2027] text-white text-xs h-9 w-full border-b border-[#1e3a47]">
                <div className="container mx-auto px-4 h-full flex items-center justify-between font-medium">
                    <div className="flex items-center gap-6 text-white">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                            <MapPin size={14} weight="fill" className="text-white" />
                            Ottawa Campus
                        </span>
                        <span className="text-white/40">|</span>
                        <Link href="/admissions/" className="text-white hover:text-white/80 no-underline transition-colors">Future Students</Link>
                        <Link href="/student-guide/" className="text-white hover:text-white/80 no-underline transition-colors">Current Students</Link>
                        <Link href="/student-life/" className="text-white hover:text-white/80 no-underline transition-colors font-semibold">Student Life</Link>
                        <Link href="/about/" className="text-white hover:text-white/80 no-underline transition-colors">Faculty &amp; Staff</Link>
                        <Link href="/alumni/" className="text-white hover:text-white/80 no-underline transition-colors">Alumni</Link>
                    </div>
                    <div className="flex items-center gap-6 text-white">
                        <Link href="/student-guide/international/" className="text-white hover:text-white/80 no-underline transition-colors font-semibold">International Students</Link>
                        <Link href="/portal/support/" className="text-white hover:text-white/80 no-underline transition-colors">IT Support</Link>
                        <div className="flex items-center gap-2 pl-4 border-l border-[#1e3a47] text-white font-semibold">
                            <button
                                type="button"
                                onClick={() => switchLanguage('en')}
                                className={`text-white transition-opacity hover:opacity-80 cursor-pointer ${currentLanguage === 'en' ? 'font-black underline decoration-2 underline-offset-4' : 'opacity-70'}`}
                            >
                                EN
                            </button>
                            <span className="text-white/40">/</span>
                            <button
                                type="button"
                                onClick={() => switchLanguage('fr')}
                                className={`text-white transition-opacity hover:opacity-80 cursor-pointer ${currentLanguage === 'fr' ? 'font-black underline decoration-2 underline-offset-4' : 'opacity-70'}`}
                            >
                                FR
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 h-28 flex items-center justify-between">
                <Logo
                    className="h-14 md:h-16 lg:mr-12 mr-4 shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navigation.map((item) => (
                        <div
                            key={item.name}
                            className="relative group h-28 flex items-center"
                            onMouseEnter={() => setOpenDropdown(item.name)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <Link
                                href={item.href}
                                className={`text-[15.2px] font-bold flex items-center gap-1 transition-colors hover:text-[#000000] ${pathname.startsWith(item.href) ? "text-[#000000]" : "text-[#2d2d2d]"
                                    }`}
                            >
                                {item.name}
                                {(item.children || item.sections) && <CaretDown size={14} weight="bold" />}
                            </Link>

                            {/* Standard Dropdown */}
                            {item.children && (
                                <div className="absolute top-28 left-0 w-64 shadow-xl hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200 bg-white border border-neutral-100">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className="block px-6 py-4 text-base font-semibold text-[#2d2d2d] hover:bg-neutral-50 hover:text-[#000000] no-underline border-b border-neutral-50 last:border-b-0"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Mega Dropdown for Sections */}
                            {item.sections && (
                                <div className="absolute top-28 left-0 w-[600px] max-h-[80vh] overflow-y-auto shadow-2xl hidden group-hover:block p-0 animate-in fade-in slide-in-from-top-1 duration-200 bg-white border border-neutral-100">
                                    <div className="flex flex-col">
                                        {item.sections.map((section, idx) => (
                                            <div key={section.title}>
                                                <div className="bg-[#f5f5f5] px-6 py-3 font-bold uppercase text-sm tracking-wider text-[#000000] sticky top-0 border-b border-neutral-100">
                                                    {section.title}
                                                </div>
                                                <div className={`p-2 grid ${section.title === 'Departments' ? 'grid-cols-2' : 'grid-cols-1'} gap-x-4`}>
                                                    {section.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            className="block px-4 py-2 text-base font-semibold text-[#2d2d2d] hover:underline hover:bg-neutral-50 hover:text-[#000000] no-underline"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden lg:flex items-center gap-6">
                    <Search />
                    <div className="flex items-center gap-4 pl-6 border-l border-neutral-200">
                        <LanguageSelector />
                    </div>
                </div>

                {/* Mobile Toggle & Search */}
                <div className="lg:hidden flex items-center gap-2">
                    <Search />
                    <button
                        className="p-2 text-[#2d2d2d] hover:text-[#000000]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-28 left-0 right-0 bg-white h-[calc(100vh-112px)] overflow-y-auto border-t border-neutral-100">
                    <div className="flex flex-col pb-20">
                        {navigation.map((item) => (
                            <div key={item.name} className="border-b border-neutral-100">
                                <Link
                                    href={item.href}
                                    className="block text-lg font-bold uppercase p-4 text-[#000000] hover:bg-neutral-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                                {item.children && (
                                    <div className="bg-[#f5f5f5] pl-6 border-t border-neutral-100">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block py-4 pr-6 text-base font-semibold text-[#2d2d2d] hover:text-[#000000] no-underline border-b border-white/50 last:border-0"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {item.sections && (
                                    <div className="bg-[#f5f5f5] border-t border-neutral-100">
                                        {item.sections.map((section) => {
                                            const isOpen = expandedMobileSections[section.title];
                                            return (
                                                <div key={section.title} className="border-b border-white/50 last:border-0">
                                                    <button
                                                        onClick={() => setExpandedMobileSections(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
                                                        className="w-full text-left px-4 py-3.5 text-base font-bold uppercase text-[#000000] flex items-center justify-between hover:bg-neutral-100"
                                                    >
                                                        {section.title}
                                                        {isOpen ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
                                                    </button>
                                                    {isOpen && (
                                                        <div className="animate-in slide-in-from-top-1 duration-200 bg-white/50">
                                                            {section.items.map((subItem) => (
                                                                <Link
                                                                    key={subItem.name}
                                                                    href={subItem.href}
                                                                    className="block py-3 px-6 pl-8 text-base font-semibold text-[#2d2d2d] hover:bg-neutral-100 hover:text-[#000000] no-underline"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile Language Selector */}
                        <div className="border-b border-neutral-100">
                            <button
                                onClick={() => setExpandedMobileSections(prev => ({ ...prev, language: !prev.language }))}
                                className="w-full text-left px-4 py-4 text-lg font-bold uppercase text-[#000000] flex items-center justify-between hover:bg-neutral-50"
                            >
                                Language
                                {expandedMobileSections.language ? <Minus size={20} weight="bold" /> : <Plus size={20} weight="bold" />}
                            </button>
                            {expandedMobileSections.language && (
                                <div className="animate-in slide-in-from-top-1 duration-200 bg-[#f5f5f5]">
                                    <LanguageSelector mobile />
                                </div>
                            )}
                        </div>

                        {/* Mobile Ottawa Location Tag */}
                        <div className="p-4 bg-[#f5f5f5] flex items-center gap-2 border-b border-neutral-100 text-xs font-semibold text-[#000000]">
                            <MapPin size={16} weight="fill" className="text-[#000000]" />
                            <span>Ottawa campus (Single Location)</span>
                        </div>

                        <div className="p-4">
                            <Link href="/admissions/application-process/" className="flex w-full h-[50px] items-center justify-center bg-[#0f2027] hover:bg-[#1a3644] text-white font-bold no-underline transition-colors rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                Apply to Cannoga College
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

