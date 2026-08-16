'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    Buildings,
    Flask,
    GraduationCap,
    BookOpen,
    HouseLine,
    ForkKnife,
    MagnifyingGlassPlus,
    MagnifyingGlassMinus,
    ArrowsOut,
    MapPin,
    NavigationArrow,
    Info,
    CheckCircle,
    ArrowUpRight,
} from '@phosphor-icons/react';
import Link from 'next/link';

interface CampusLocation {
    id: string;
    title: string;
    shortName: string;
    x: number; // percentage from left
    y: number; // percentage from top
    description: string;
    facilities: string[];
    hours: string;
    link: string;
    linkText: string;
    bgColor: string;
    borderColor: string;
    accentColor: string;
}

const LOCATIONS: CampusLocation[] = [
    {
        id: 'health-community',
        title: 'School of Health & Community',
        shortName: 'Health & Community',
        x: 74,
        y: 46,
        description: 'Modern healthcare simulation clinics, practical nursing observation suites, and community support counseling rooms.',
        facilities: ['Clinical Simulation Suite', 'Health Assessment Wards', 'Community Care Lab'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/health-community/',
        linkText: 'Explore School of Health',
        bgColor: 'bg-[#ec4899]', // Vibrant Hot Pink
        borderColor: 'border-[#ec4899]',
        accentColor: '#ec4899',
    },
    {
        id: 'business',
        title: 'School of Business',
        shortName: 'Business',
        x: 32,
        y: 42,
        description: 'Home to international commerce, corporate finance simulation rooms, accounting suites, and executive lecture theatres.',
        facilities: ['FinTech & Analytics Lab', 'Executive Boardrooms', 'Commerce Study Commons'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/business/',
        linkText: 'Explore School of Business',
        bgColor: 'bg-[#f97316]', // Vibrant Orange
        borderColor: 'border-[#f97316]',
        accentColor: '#f97316',
    },
    {
        id: 'technology',
        title: 'School of Technology',
        shortName: 'Technology',
        x: 58,
        y: 35,
        description: 'Advanced software engineering studios, AI research labs, cybersecurity defensive ranges, and cloud compute bays.',
        facilities: ['AI & Machine Learning Hub', 'Cybersecurity Testbed', 'Full-Stack Software Lab'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/technology/',
        linkText: 'Explore School of Technology',
        bgColor: 'bg-[#6366f1]', // Electric Indigo
        borderColor: 'border-[#6366f1]',
        accentColor: '#6366f1',
    },
    {
        id: 'arts-design',
        title: 'School of Arts & Design',
        shortName: 'Arts & Design',
        x: 22,
        y: 58,
        description: 'Creative design studios, digital media workstations, exhibition galleries, and experimental fashion workshops.',
        facilities: ['Digital Media Suites', 'Fine Art & Design Studios', 'Student Exhibition Gallery'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/arts-design/',
        linkText: 'Explore School of Arts',
        bgColor: 'bg-[#10b981]', // Electric Emerald
        borderColor: 'border-[#10b981]',
        accentColor: '#10b981',
    },
    {
        id: 'science',
        title: 'School of Science & Engineering',
        shortName: 'Science & Engineering',
        x: 48,
        y: 28,
        description: 'State-of-the-art biochemistry laboratories, environmental research units, and applied materials testing facilities.',
        facilities: ['Analytical Chemistry Lab', 'Environmental Science Unit', 'Robotics & Hardware Bay'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/science/',
        linkText: 'Explore School of Science',
        bgColor: 'bg-[#06b6d4]', // Electric Cyan
        borderColor: 'border-[#06b6d4]',
        accentColor: '#06b6d4',
    },
    {
        id: 'transportation-aviation',
        title: 'School of Transportation & Aviation',
        shortName: 'Transportation & Aviation',
        x: 82,
        y: 28,
        description: 'Flight simulation cockpits, avionics troubleshooting bays, logistics planning centres, and propulsion test labs.',
        facilities: ['Flight Simulators', 'Avionics Diagnostics Lab', 'Logistics Management Centre'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/transportation-aviation/',
        linkText: 'Explore Transportation & Aviation',
        bgColor: 'bg-[#8b5cf6]', // Deep Purple
        borderColor: 'border-[#8b5cf6]',
        accentColor: '#8b5cf6',
    },
    {
        id: 'education-social-sciences',
        title: 'School of Education & Social Sciences',
        shortName: 'Education & Social Sciences',
        x: 45,
        y: 65,
        description: 'Early childhood education mock classrooms, social policy research units, and interactive behavioral study labs.',
        facilities: ['Teaching Observation Lab', 'Policy Research Centre', 'Student Counseling Suites'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/education-social-sciences/',
        linkText: 'Explore Education & Social Sciences',
        bgColor: 'bg-[#ef4444]', // Electric Crimson
        borderColor: 'border-[#ef4444]',
        accentColor: '#ef4444',
    },
    {
        id: 'hospitality-tourism',
        title: 'School of Hospitality & Tourism',
        shortName: 'Hospitality & Tourism',
        x: 36,
        y: 78,
        description: 'Culinary arts teaching kitchens, hotel operations simulation front desks, and international event management suites.',
        facilities: ['Commercial Training Kitchen', 'Hotel Front-Desk Simulator', 'Wine & Beverage Lab'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/hospitality-tourism/',
        linkText: 'Explore Hospitality & Tourism',
        bgColor: 'bg-[#84cc16]', // Lime Green
        borderColor: 'border-[#84cc16]',
        accentColor: '#84cc16',
    },
];

export function InteractiveCampusMap() {
    const [activeLocationId, setActiveLocationId] = useState<string>(LOCATIONS[0].id);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const activeLocation = LOCATIONS.find((loc) => loc.id === activeLocationId) || LOCATIONS[0];

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    const handleResetZoom = () => setZoomLevel(1);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-md overflow-hidden">
            {/* Main Interactive Map Stage */}
            <div className="grid lg:grid-cols-12 gap-0 relative">
                {/* Left/Main Column: Zoomable Map with Interactive Hotspots */}
                <div className="lg:col-span-8 relative bg-slate-900 overflow-hidden min-h-[420px] sm:min-h-[500px] flex items-center justify-center select-none">
                    {/* Zoom Controls Overlay */}
                    <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-black/75 backdrop-blur-xs p-1.5 rounded-md border border-white/10 text-white">
                        <button
                            onClick={handleZoomIn}
                            title="Zoom in"
                            className="p-2 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors"
                        >
                            <MagnifyingGlassPlus size={18} weight="bold" />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            title="Zoom out"
                            className="p-2 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors"
                        >
                            <MagnifyingGlassMinus size={18} weight="bold" />
                        </button>
                        <button
                            onClick={handleResetZoom}
                            title="Reset view"
                            className="p-2 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors text-[10px] font-bold"
                        >
                            1:1
                        </button>
                        <button
                            onClick={() => setIsLightboxOpen(true)}
                            title="Full size view"
                            className="p-2 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors"
                        >
                            <ArrowsOut size={18} weight="bold" />
                        </button>
                    </div>

                    {/* Instructions badge */}
                    <div className="absolute top-4 left-4 z-30 bg-black/75 backdrop-blur-xs px-3 py-1.5 rounded text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                        <MapPin size={14} weight="fill" className="text-[#c89211]" />
                        <span>Click any marker to inspect</span>
                    </div>

                    {/* Map Image Container with CSS transform zoom */}
                    <div
                        className="relative w-full h-full aspect-[4/3] sm:aspect-[16/10] transition-transform duration-300 ease-out origin-center cursor-grab active:cursor-grabbing"
                        style={{ transform: `scale(${zoomLevel})` }}
                    >
                        <Image
                            src="/images/Cannoga College Campus MAp.png"
                            alt="Cannoga College Ottawa Campus Map"
                            fill
                            priority
                            className="object-cover object-center pointer-events-none"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                        />

                        {/* Interactive Hotspot Pins */}
                        {LOCATIONS.map((loc) => {
                            const isSelected = activeLocationId === loc.id;
                            return (
                                <button
                                    key={loc.id}
                                    onClick={() => setActiveLocationId(loc.id)}
                                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-200 focus:outline-hidden"
                                    aria-label={`Select ${loc.title}`}
                                >
                                    {/* Pin Body */}
                                    <div
                                        className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black transition-transform ${
                                            isSelected
                                                ? 'bg-[#0a151a] text-white ring-2 ring-[#c89211] scale-110'
                                                : 'bg-white/95 text-slate-900 hover:scale-105 hover:bg-[#0a151a] hover:text-white'
                                        }`}
                                    >
                                        <MapPin
                                            size={14}
                                            weight="fill"
                                            style={{ color: isSelected ? '#c89211' : loc.accentColor }}
                                        />
                                        <span className="tracking-tight text-[11px] whitespace-nowrap">
                                            {loc.shortName}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Student Resource Hub Styled Location Card Inspector */}
                <div className="lg:col-span-4 p-3 sm:p-5 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-center">
                    <div
                        className={`w-full p-6 sm:p-7 rounded-md ${activeLocation.bgColor} ${activeLocation.borderColor} border-4 text-white overflow-hidden relative flex flex-col justify-between min-h-[440px]`}
                    >
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-[1.08] mb-3">
                                {activeLocation.title}
                            </h3>

                            <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed mb-5">
                                {activeLocation.description}
                            </p>

                            {/* Facilities Checklist */}
                            <div className="pt-3 border-t border-white/20">
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-white/90 mb-2 flex items-center gap-1.5">
                                    <Info size={14} weight="bold" />
                                    <span>Building Facilities & Highlights</span>
                                </h4>
                                <ul className="space-y-1.5 text-xs font-medium text-white/90">
                                    {activeLocation.facilities.map((fac, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle size={14} weight="fill" className="text-white shrink-0" />
                                            <span>{fac}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Operating Hours */}
                            <div className="mt-4 p-3 bg-black/20 rounded-sm border border-white/15">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/75 mb-0.5">
                                    Operating Hours & Access
                                </p>
                                <p className="text-xs font-bold text-white leading-snug">
                                    {activeLocation.hours}
                                </p>
                            </div>
                        </div>

                        {/* Bottom CTA Link with Floating Arrow */}
                        <div className="pt-4 mt-4 border-t border-white/20">
                            <Link
                                href={activeLocation.link}
                                className="group flex items-center justify-between text-white font-black uppercase tracking-wider text-xs sm:text-sm no-underline hover:text-slate-100"
                            >
                                <span className="underline">{activeLocation.linkText}</span>
                                <div className="shrink-0 p-1.5 bg-white text-slate-900 rounded-full group-hover:scale-110 transition-transform">
                                    <ArrowUpRight size={18} weight="bold" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal for Full View */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                        ✕ Close Map
                    </button>
                    <div className="relative w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-md border border-white/20">
                        <Image
                            src="/images/Cannoga College Campus MAp.png"
                            alt="Cannoga College Campus Map"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
