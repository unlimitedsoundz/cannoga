'use client';

import { Link } from "@aalto-dx/react-components"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/Logo"
import { TiktokLogo, YoutubeLogo } from "@phosphor-icons/react"
import { PreFooterBanner } from "@/components/layout/PreFooterBanner"

export function Footer() {
    const pathname = usePathname();
    const isPortalOrAdmin = pathname.startsWith('/portal') || pathname.startsWith('/admin')
    const isNewsPage = pathname === '/news'

    if (isPortalOrAdmin) return null;
    return (
        <>
            <PreFooterBanner />
            <footer className="bg-[#0a151a] text-white pt-16 pb-10 font-sans">
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Top Row: Brand + Land Acknowledgement + Social */}
                    <div className="mb-12 pb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 max-w-4xl">
                            <Logo className="h-20 md:h-24 text-white shrink-0" />
                            <div className="text-xs text-white/80 leading-relaxed pt-4 md:pt-0 md:pl-6">
                                <span className="font-semibold block text-white mb-1 uppercase tracking-wider text-[10px]">Land Acknowledgement</span>
                                Cannoga College acknowledges that its campus in Ottawa is located on the traditional and unceded territory of the Anishinaabe Algonquin Nation. We honour the enduring presence, history, cultures, and contributions of First Nations, Inuit, and Métis peoples and recognize their continued connection to these lands.
                            </div>
                        </div>
                        <div className="flex space-x-5 shrink-0 items-center">
                            <a href="https://www.youtube.com/@CannogaCollege" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-[#c89211] hover:scale-110 transition-all transform inline-block">
                                <YoutubeLogo className="h-8 w-8" weight="fill" />
                            </a>
                            <a href="https://www.tiktok.com/@cannoga_college" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-[#c89211] hover:scale-110 transition-all transform inline-block">
                                <TiktokLogo className="h-8 w-8" weight="fill" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns - Original Text & Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 mb-12">
                        {/* Study */}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Study</h3>
                            <ul className="space-y-3">
                                <li><Link href="/studies" className="text-white text-sm hover:text-white transition-colors no-underline">All Courses</Link></li>
                                <li><Link href="/admissions" className="text-white text-sm hover:text-white transition-colors no-underline">Admissions</Link></li>
                                <li><Link href="/housing" className="text-white text-sm hover:text-white transition-colors no-underline">Student Housing</Link></li>
                                <li><Link href="/admissions/tuition" className="text-white text-sm hover:text-white transition-colors no-underline">Scholarships</Link></li>
                                <li><Link href="/international" className="text-white text-sm hover:text-white transition-colors no-underline">International</Link></li>
                                <li><Link href="/student-guide/international" className="text-white text-sm hover:text-white transition-colors no-underline">International Students</Link></li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">About</h3>
                            <ul className="space-y-3">
                                <li><Link href="/about" className="text-white text-sm hover:text-white transition-colors no-underline">Our Story</Link></li>
                                <li><Link href="/art" className="text-white text-sm hover:text-white transition-colors no-underline">Creative Arts</Link></li>
                                <li><Link href="/news" className="text-white text-sm hover:text-white transition-colors no-underline">News & Events</Link></li>
                                <li><Link href="/research" className="text-white text-sm hover:text-white transition-colors no-underline">Research</Link></li>
                                <li><Link href="/student-life" className="text-white text-sm hover:text-white transition-colors no-underline">Campus Life</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Resources</h3>
                            <ul className="space-y-3">
                                <li><Link href="/admissions-policy" className="text-white text-sm hover:text-white transition-colors no-underline">Admissions Policy</Link></li>
                                <li><Link href="/academic-regulations" className="text-white text-sm hover:text-white transition-colors no-underline">Academic Regulations</Link></li>
                                <li><Link href="/student-handbook" className="text-white text-sm hover:text-white transition-colors no-underline">Student Handbook</Link></li>
                                <li><Link href="/refund-withdrawal-policy" className="text-white text-sm hover:text-white transition-colors no-underline">Refund Policy</Link></li>
                                <li><Link href="/code-of-conduct" className="text-white text-sm hover:text-white transition-colors no-underline">Code of Conduct</Link></li>
                                <li><Link href="/alumni" className="text-white text-sm hover:text-white transition-colors no-underline">Alumni</Link></li>
                                <li><Link href="/portal/support" className="text-white text-sm hover:text-white transition-colors no-underline">IT Support</Link></li>
                                <li><Link href="/contact" className="text-white text-sm hover:text-white transition-colors no-underline">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Explore */}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Explore</h3>
                            <ul className="space-y-3">
                                <li><Link href="/admissions/requirements" className="text-white text-sm hover:text-white transition-colors no-underline">Admission Requirements</Link></li>
                                <li><Link href="/admissions/contact-information" className="text-white text-sm hover:text-white transition-colors no-underline">Admissions Contact</Link></li>
                                <li><Link href="/research/publications" className="text-white text-sm hover:text-white transition-colors no-underline">Publications</Link></li>
                                <li><Link href="/innovation" className="text-white text-sm hover:text-white transition-colors no-underline">Innovation</Link></li>
                                <li><Link href="/terms" className="text-white text-sm hover:text-white transition-colors no-underline">Terms of Use</Link></li>
                                <li><Link href="/student-guide/chat-with-cannoga-students" className="text-white text-sm hover:text-white transition-colors no-underline">Chat with Students</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-white">Contact</h3>
                            <ul className="space-y-4">
                                <li className="text-white text-sm">
                                    <div className="space-y-2">
                                        <span className="block font-semibold text-white">Cannoga College – Ottawa campus</span>
                                        <span className="block text-xs text-white">81 Montreal Rd,</span>
                                        <span className="block text-xs text-white">K1L 6E8 Ottawa, Ontario, Canada</span>
                                    </div>
                                </li>
                                <li className="text-white text-sm">
                                    <a href="mailto:info@cannogacollege.ca" className="hover:text-white transition-colors no-underline text-white">info@cannogacollege.ca</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Institutional & Accreditation Partner Logos */}
                    <div className="pt-6 pb-6 flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-12">
                        <img
                            src="https://ircc.com/icon.png"
                            alt="IRCC Canada"
                            className="h-9 md:h-11 w-auto object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/3/36/OCAS_Logo_2026.png"
                            alt="OCAS"
                            className="h-9 md:h-11 w-auto object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Ottawa%2C_City_of.svg/3840px-Ottawa%2C_City_of.svg.png"
                            alt="City of Ottawa"
                            className="h-9 md:h-11 w-auto object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
                        />
                        <img
                            src="https://static.wikia.nocookie.net/logopedia/images/e/ea/Ontario1972.svg/revision/latest?cb=20241011133938"
                            alt="Government of Ontario"
                            className="h-9 md:h-11 w-auto object-contain brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-slate-400 text-xs order-2 md:order-1 space-y-1 text-center md:text-left">
                                <p>© 2026 Cannoga College. All rights reserved.</p>
                                <p className="text-[11px] text-slate-500">Approved by Ontario Ministry of Colleges and Universities (MCU).</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 md:order-2">
                                <Link href="/site-index" className="text-white text-xs hover:text-white transition-colors no-underline">Site Index</Link>
                                <Link href="/privacy" className="text-white text-xs hover:text-white transition-colors no-underline">Privacy Policy</Link>
                                <Link href="/terms" className="text-white text-xs hover:text-white transition-colors no-underline">Terms of Use</Link>
                                <Link href="/cookies" className="text-white text-xs hover:text-white transition-colors no-underline">Cookie Policy</Link>
                                <Link href="/accessibility" className="text-white text-xs hover:text-white transition-colors no-underline">Accessibility</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
