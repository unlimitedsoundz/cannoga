'use client';

import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

interface AdmissionsHelpCardProps {
    title?: string;
    description?: string;
    email?: string;
    phone?: string;
    variant?: 'indigo' | 'pink' | 'emerald' | 'orange' | 'cyan' | 'purple';
    className?: string;
}

export default function AdmissionsHelpCard({
    title = "HAVE QUESTIONS ABOUT APPLYING?",
    description = "If you have any questions, please don't hesitate to contact the International Recruitment Team at admissions@cannogacollege.ca. We're always happy to help!",
    email = "admissions@cannogacollege.ca",
    phone = "+1 (227) 250-0427",
    variant = 'indigo',
    className = "",
}: AdmissionsHelpCardProps) {
    const variantStyles = {
        indigo: {
            bgColor: 'bg-[#6366f1]', // Electric Indigo
            borderColor: 'border-[#6366f1]',
            waveColor: '#4f46e5',
        },
        pink: {
            bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
            borderColor: 'border-[#ec4899]',
            waveColor: '#db2777',
        },
        emerald: {
            bgColor: 'bg-[#10b981]', // Electric Emerald
            borderColor: 'border-[#10b981]',
            waveColor: '#059669',
        },
        orange: {
            bgColor: 'bg-[#f97316]', // Vibrant Orange
            borderColor: 'border-[#f97316]',
            waveColor: '#ea580c',
        },
        cyan: {
            bgColor: 'bg-[#06b6d4]', // Electric Cyan
            borderColor: 'border-[#06b6d4]',
            waveColor: '#0891b2',
        },
        purple: {
            bgColor: 'bg-[#8b5cf6]', // Deep Purple
            borderColor: 'border-[#8b5cf6]',
            waveColor: '#7c3aed',
        },
    };

    const style = variantStyles[variant] || variantStyles.indigo;
    const mailtoHref = `mailto:${email}`;

    return (
        <div className={`w-full flex flex-col no-underline ${className}`}>
            <style jsx>{`
                @keyframes arrowFloatHelp {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(5px, -5px);
                    }
                }
                .animate-arrow-help {
                    animation: arrowFloatHelp 2.2s ease-in-out infinite;
                }
            `}</style>

            <a
                href={mailtoHref}
                className={`block w-full p-6 sm:p-8 md:p-10 rounded-md ${style.bgColor} ${style.borderColor} border-4 no-underline overflow-hidden relative min-h-[220px] sm:min-h-[260px] flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:brightness-105`}
            >
                {/* Card Content Header */}
                <div className="relative z-20">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.05]">
                        {title}
                    </h3>
                </div>

                {/* Card Bottom Description & Arrow Icon */}
                <div className="relative z-20 pt-6 flex items-end justify-between gap-4 text-white">
                    <div className="max-w-[85%] space-y-2">
                        <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed font-sans">
                            {description}
                        </p>
                        {phone && (
                            <p className="text-xs sm:text-sm font-bold text-white/80">
                                Talk to Admissions: <span className="underline">{phone}</span> • <span className="underline">{email}</span>
                            </p>
                        )}
                    </div>

                    <div className="shrink-0 mb-0.5 animate-arrow-help group-hover:scale-110 transition-transform">
                        <ArrowUpRight size={44} weight="bold" className="text-white" />
                    </div>
                </div>
            </a>
        </div>
    );
}
