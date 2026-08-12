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
            <footer className="bg-[#191919] text-white pt-16 pb-10 border-t border-white/10 font-sans">
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Top Row: Brand + Social */}
                    <div className="mb-12 pb-10 border-b border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <Logo className="h-20 md:h-24 text-white mb-3" />
                        </div>
                        <div className="flex space-x-4">
                            <a href="https://www.youtube.com/@CannogaCollege" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-opacity-75 transition-opacity">
                                <YoutubeLogo className="h-6 w-6" weight="fill" />
                            </a>
                            <a href="https://www.tiktok.com/@cannogacollege" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-opacity-75 transition-opacity">
                                <TiktokLogo className="h-6 w-6" weight="fill" />
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
                                <li className="flex items-start gap-3 text-white text-sm">
                                    <MapPin size={16} className="shrink-0 text-white mt-0.5" />
                                    <div className="space-y-2">
                                        <span className="block font-semibold text-white">Cannoga College – Ottawa campus</span>
                                        <span className="block text-xs text-white">81 Montreal Rd,</span>
                                        <span className="block text-xs text-white">K1L 6E8 Ottawa, Ontario, Canada</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 text-white text-sm">
                                    <EnvelopeSimple size={16} className="shrink-0 text-white" />
                                    <a href="mailto:info@cannogacollege.ca" className="hover:text-white transition-colors no-underline text-white">info@cannogacollege.ca</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-white text-xs order-2 md:order-1">
                                © 2026 Cannoga College. All rights reserved.
                            </p>
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
