
"use client"

import * as React from "react"
import { Link } from "@aalto-dx/react-components"
import { Bell, ArrowRight } from "@phosphor-icons/react"

export function NotificationBanner() {
    return (
        <div className="bg-[#034737] text-white py-3 px-4 relative z-[60] overflow-hidden group">
            <div className="container mx-auto flex items-center justify-center gap-4 text-center">
                <div className="flex items-center gap-2">
                    <Bell size={20} weight="fill" className="text-white/80 animate-pulse" />
                    <span className="text-[14px] md:text-[15px] font-bold tracking-wide uppercase">
                        Admissions: September intake apply Oct–Feb · January intake apply Jun–Sep · Apply early for best results
                    </span>
                </div>
                
                <Link 
                    href="/admissions" 
                    className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-4 py-1.5 rounded-full border border-white/20 text-[13px] font-bold uppercase tracking-wider"
                >
                    Apply Now
                    <ArrowRight size={16} weight="bold" />
                </Link>
            </div>
            
            {/* Subtle gloss effect for "premium" feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        </div>
    )
}
