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
} from '@phosphor-icons/react';
import Link from 'next/link';

interface CampusLocation {
    id: string;
    title: string;
    category: 'academic' | 'labs' | 'admin' | 'services' | 'residence';
    buildingNumber: string;
    x: number; // percentage from left
    y: number; // percentage from top
    description: string;
    facilities: string[];
    hours: string;
    link?: string;
    linkText?: string;
    accentColor: string;
}

const LOCATIONS: CampusLocation[] = [
    {
        id: 'main-academic',
        title: 'Academic Centre & Lecture Theatres',
        category: 'academic',
        buildingNumber: 'Building A',
        x: 38,
        y: 42,
        description: 'Main lecture halls, multimedia presentation rooms, and faculty advising suites.',
        facilities: ['Smart Classrooms 101–210', 'Main Auditorium (400 seats)', 'Faculty Advisory Offices'],
        hours: 'Mon – Fri: 7:30 AM – 9:30 PM | Sat: 8:00 AM – 5:00 PM',
        link: '/studies/',
        linkText: 'Explore Academic Programs',
        accentColor: '#3b82f6', // Blue
    },
    {
        id: 'tech-labs',
        title: 'Technology & Applied Engineering Hub',
        category: 'labs',
        buildingNumber: 'Building T',
        x: 58,
        y: 35,
        description: 'Advanced computing facilities, AI simulation labs, cybersecurity testbeds, and robotics suites.',
        facilities: ['Cybersecurity Lab', 'Robotics & Automation Bay', 'Cloud Compute Workstations'],
        hours: 'Mon – Sun: 24/7 (Student Access Pass Required)',
        link: '/schools/technology/',
        linkText: 'School of Technology',
        accentColor: '#06b6d4', // Cyan
    },
    {
        id: 'admissions-admin',
        title: 'Admissions & Central Registry Office',
        category: 'admin',
        buildingNumber: 'Building R',
        x: 24,
        y: 58,
        description: 'Official student admissions, transcript verifications, international visa desk, and tuition inquiries.',
        facilities: ['Admissions Counter', 'Student Financial Services', 'International Student Desk'],
        hours: 'Mon – Fri: 8:30 AM – 4:30 PM (EST)',
        link: '/admissions/',
        linkText: 'Admissions Services',
        accentColor: '#c89211', // Gold
    },
    {
        id: 'learning-centre',
        title: 'Campus Library & Digital Learning Centre',
        category: 'services',
        buildingNumber: 'Building L',
        x: 48,
        y: 62,
        description: 'Comprehensive academic research stacks, quiet study pods, high-speed workstations, and group discussion rooms.',
        facilities: ['24/7 Quiet Study Zone', 'Digital Resource Stacks', 'Collaboration Pods'],
        hours: 'Mon – Sun: 7:00 AM – 11:00 PM',
        link: '/student-life/',
        linkText: 'Student Life & Services',
        accentColor: '#8b5cf6', // Purple
    },
    {
        id: 'residence-suites',
        title: 'Student Residence & Living Commons',
        category: 'residence',
        buildingNumber: 'Building H',
        x: 76,
        y: 48,
        description: 'Modern fully furnished student suites with 24/7 security, shared kitchens, and wellness recreation lounges.',
        facilities: ['Single & Shared Suites', 'Common Kitchens', 'Residence Support Office'],
        hours: '24/7 Resident Access (Secured Keycard Entry)',
        link: '/housing/',
        linkText: 'Housing Options & Rates',
        accentColor: '#ec4899', // Pink
    },
    {
        id: 'campus-dining',
        title: 'Student Dining Hall & Campus Cafe',
        category: 'services',
        buildingNumber: 'Building C',
        x: 32,
        y: 30,
        description: 'Fresh local and international cuisine dining, artisanal coffee lounge, and open outdoor terrace seating.',
        facilities: ['Full Service Dining Hall', 'Espresso & Bakery Bar', 'Outdoor Summer Terrace'],
        hours: 'Mon – Fri: 7:00 AM – 8:00 PM | Sat – Sun: 8:00 AM – 6:00 PM',
        link: '/student-life/cafe/',
        linkText: 'Dining & Menus',
        accentColor: '#10b981', // Emerald
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All Highlights', icon: Buildings },
    { id: 'academic', label: 'Academic Halls', icon: GraduationCap },
    { id: 'labs', label: 'Tech & Science Labs', icon: Flask },
    { id: 'admin', label: 'Admissions & Registry', icon: BookOpen },
    { id: 'residence', label: 'Student Housing', icon: HouseLine },
    { id: 'services', label: 'Dining & Library', icon: ForkKnife },
];

export function InteractiveCampusMap() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activeLocationId, setActiveLocationId] = useState<string>(LOCATIONS[0].id);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const activeLocation = LOCATIONS.find((loc) => loc.id === activeLocationId) || LOCATIONS[0];

    const filteredLocations = selectedCategory === 'all'
        ? LOCATIONS
        : LOCATIONS.filter((loc) => loc.category === selectedCategory);

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    const handleResetZoom = () => setZoomLevel(1);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
            {/* Top Filter Category Bar */}
            <div className="bg-[#0a151a] p-4 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <NavigationArrow size={22} weight="fill" className="text-[#c89211]" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
                        Interactive Ottawa Campus Navigator
                    </span>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                    isActive
                                        ? 'bg-[#c89211] text-black shadow-sm'
                                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                <Icon size={14} weight={isActive ? 'fill' : 'regular'} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Interactive Map Stage */}
            <div className="grid lg:grid-cols-12 gap-0 relative">
                {/* Left/Main Column: Zoomable Map with Interactive Hotspots */}
                <div className="lg:col-span-8 relative bg-slate-900 overflow-hidden min-h-[420px] sm:min-h-[500px] flex items-center justify-center select-none">
                    {/* Zoom Controls Overlay */}
                    <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 bg-black/75 backdrop-blur-xs p-1.5 rounded-md border border-white/10 text-white shadow-lg">
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
                        {filteredLocations.map((loc) => {
                            const isSelected = activeLocationId === loc.id;
                            return (
                                <button
                                    key={loc.id}
                                    onClick={() => setActiveLocationId(loc.id)}
                                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-200 focus:outline-hidden`}
                                    aria-label={`Select ${loc.title}`}
                                >
                                    {/* Pulse ring for active pin */}
                                    {isSelected && (
                                        <span className="absolute inset-[-6px] rounded-full animate-ping bg-[#c89211]/60 pointer-events-none" />
                                    )}

                                    {/* Pin Body */}
                                    <div
                                        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black shadow-2xl transition-transform ${
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
                                            {loc.buildingNumber}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Detailed Location Card Inspector */}
                <div className="lg:col-span-4 p-6 sm:p-8 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
                    <div>
                        {/* Selected Location Header */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#c89211] bg-slate-900 px-2.5 py-0.5 rounded-sm">
                                {activeLocation.buildingNumber}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                {activeLocation.category}
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mt-2 mb-3">
                            {activeLocation.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
                            {activeLocation.description}
                        </p>

                        {/* Key Facilities Checklist */}
                        <div className="space-y-3 pt-4 border-t border-slate-200">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                <Info size={16} weight="bold" className="text-slate-600" />
                                <span>Building Facilities & Highlights</span>
                            </h4>
                            <ul className="space-y-2 text-xs font-medium text-slate-700">
                                {activeLocation.facilities.map((fac, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <CheckCircle size={14} weight="fill" className="text-emerald-600 shrink-0" />
                                        <span>{fac}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Operating Hours */}
                        <div className="mt-5 p-3.5 bg-white border border-slate-200 rounded-sm">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">
                                Operating Hours & Access
                            </p>
                            <p className="text-xs font-bold text-slate-800 leading-snug">
                                {activeLocation.hours}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Action CTA */}
                    {activeLocation.link && (
                        <div className="mt-8 pt-4 border-t border-slate-200">
                            <Link
                                href={activeLocation.link}
                                className="group w-full bg-[#0a151a] hover:bg-slate-800 text-white flex items-center justify-between p-3.5 px-5 rounded-sm font-black uppercase tracking-wider text-xs transition-all shadow-sm no-underline"
                            >
                                <span>{activeLocation.linkText || 'Learn More'}</span>
                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    )}
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
