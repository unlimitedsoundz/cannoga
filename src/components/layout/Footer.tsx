'use client';

import { Link } from "@aalto-dx/react-components"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/Logo"
import { EnvelopeSimple, MapPin, Phone, TiktokLogo, YoutubeLogo } from "@phosphor-icons/react"

export function Footer() {
    const pathname = usePathname();
    const isPortalOrAdmin = pathname.startsWith('/portal') || pathname.startsWith('/admin')
    const isNewsPage = pathname === '/news'

    if (isPortalOrAdmin) return null;
    return (
        <>
            <footer className="bg-[#191919] text-white pt-12 pb-8 border-t border-white/10 font-sans">
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Footer Links Grid - Carleton 4-Column Layout + Side Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Admissions */}
                        <div>
                            <h3 className="font-bold text-base text-white mb-4 tracking-wide border-b border-white/10 pb-2">Admissions</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/studies" className="text-gray-300 hover:text-white transition-colors no-underline">Undergraduate</Link></li>
                                <li><Link href="/studies" className="text-gray-300 hover:text-white transition-colors no-underline">Graduate</Link></li>
                                <li><Link href="/student-guide/international" className="text-gray-300 hover:text-white transition-colors no-underline">International Applicants</Link></li>
                                <li><Link href="/admissions" className="text-gray-300 hover:text-white transition-colors no-underline">Professional Development</Link></li>
                                <li><Link href="/admissions/tuition" className="text-gray-300 hover:text-white transition-colors no-underline">Financial Aid & Scholarships</Link></li>
                                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors no-underline">Campus Tours</Link></li>
                            </ul>
                        </div>

                        {/* Academics */}
                        <div>
                            <h3 className="font-bold text-base text-white mb-4 tracking-wide border-b border-white/10 pb-2">Academics</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/academic-regulations" className="text-gray-300 hover:text-white transition-colors no-underline">Schedules & Key Dates</Link></li>
                                <li><Link href="/portal/support" className="text-gray-300 hover:text-white transition-colors no-underline">Brightspace Portal</Link></li>
                                <li><Link href="/student-handbook" className="text-gray-300 hover:text-white transition-colors no-underline">Library & Resources</Link></li>
                                <li><Link href="/portal/support" className="text-gray-300 hover:text-white transition-colors no-underline">Academic Support Services</Link></li>
                                <li><Link href="/admissions-policy" className="text-gray-300 hover:text-white transition-colors no-underline">Academic Calendars</Link></li>
                                <li><Link href="/research" className="text-gray-300 hover:text-white transition-colors no-underline">Research & Innovation</Link></li>
                            </ul>
                        </div>

                        {/* Students */}
                        <div>
                            <h3 className="font-bold text-base text-white mb-4 tracking-wide border-b border-white/10 pb-2">Students</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/portal/support" className="text-gray-300 hover:text-white transition-colors no-underline">Career Services</Link></li>
                                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors no-underline">Departments & Faculties</Link></li>
                                <li><Link href="/portal/support" className="text-gray-300 hover:text-white transition-colors no-underline">Student Email & Systems</Link></li>
                                <li><Link href="/student-life" className="text-gray-300 hover:text-white transition-colors no-underline">Housing & Residence</Link></li>
                                <li><Link href="/admissions/contact-information" className="text-gray-300 hover:text-white transition-colors no-underline">Registrar's Office</Link></li>
                                <li><Link href="/portal/support" className="text-gray-300 hover:text-white transition-colors no-underline">ITS Help Centre</Link></li>
                            </ul>
                        </div>

                        {/* Campus & Community */}
                        <div>
                            <h3 className="font-bold text-base text-white mb-4 tracking-wide border-b border-white/10 pb-2">Campus</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors no-underline">Campus Map & Directions</Link></li>
                                <li><Link href="/news" className="text-gray-300 hover:text-white transition-colors no-underline">Events & Activities</Link></li>
                                <li><Link href="/student-life" className="text-gray-300 hover:text-white transition-colors no-underline">Campus Safety & Parking</Link></li>
                                <li><Link href="/student-life" className="text-gray-300 hover:text-white transition-colors no-underline">Dining Services</Link></li>
                                <li><Link href="/student-life" className="text-gray-300 hover:text-white transition-colors no-underline">Clubs & Societies</Link></li>
                                <li><Link href="/alumni" className="text-gray-300 hover:text-white transition-colors no-underline">Giving to Cannoga</Link></li>
                            </ul>
                        </div>

                        {/* Contact & Brand Column */}
                        <div className="lg:col-span-1 flex flex-col justify-between space-y-6">
                            <div>
                                <Logo className="h-10 text-white mb-4" />
                                <address className="not-italic text-sm text-gray-300 space-y-2 leading-relaxed">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={18} className="shrink-0 text-white mt-1" />
                                        <span>81 Montreal Rd, K1L 6E8 Ottawa, Ontario, Canada</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Phone size={16} className="shrink-0 text-white" />
                                        <a href="tel:+1-613-520-2600" className="hover:text-white text-gray-300 transition-colors no-underline">+1 (613) 520-2600</a>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <EnvelopeSimple size={16} className="shrink-0 text-white" />
                                        <a href="mailto:info@cannogacollege.ca" className="hover:text-white text-gray-300 transition-colors no-underline">info@cannogacollege.ca</a>
                                    </div>
                                </address>
                            </div>

                            {/* Social Icons */}
                            <div>
                                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Connect With Us</h4>
                                <div className="flex space-x-4">
                                    <a href="https://www.youtube.com/@CannogaCollege" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-opacity-75 transition-opacity">
                                        <YoutubeLogo className="h-6 w-6" />
                                    </a>
                                    <a href="https://www.tiktok.com/@cannogacollege" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-opacity-75 transition-opacity">
                                        <TiktokLogo className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright & Legal Links (Carleton Style) */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <Link href="/privacy" className="hover:text-white transition-colors no-underline">Privacy Policy</Link>
                            <Link href="/accessibility" className="hover:text-white transition-colors no-underline">Accessibility</Link>
                            <Link href="/terms" className="hover:text-white transition-colors no-underline">Terms of Use</Link>
                            <Link href="/cookies" className="hover:text-white transition-colors no-underline">Cookie Policy</Link>
                            <Link href="/site-index" className="hover:text-white transition-colors no-underline">Site Index</Link>
                        </div>
                        <p>© Copyright 2026 Cannoga College. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
