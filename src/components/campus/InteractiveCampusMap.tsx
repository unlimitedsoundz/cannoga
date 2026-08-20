'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    Plus,
    Minus,
    ArrowsOut,
    MapPin,
    Target,
    Info,
    CheckCircle,
    ArrowUpRight,
    HandGrabbing,
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
    schools?: { name: string; link: string }[];
    bgColor: string;
    borderColor: string;
    accentColor: string;
}

const LOCATIONS: CampusLocation[] = [
    {
        id: 'cannoga-main',
        title: 'Cannoga College Main Campus',
        shortName: 'Cannoga College Campus',
        x: 67.5,
        y: 57.5,
        description: 'Main Campus Headquarters at 81 Montreal Rd, Ottawa. Housing the Central Welcome Centre, Student Services, Registrar, Admissions, and Administrative Leadership.',
        facilities: ['Central Welcome Centre', 'Admissions & Registrar Hall', 'Student Life Services & Career Hub', 'Executive Administration'],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/contact/',
        linkText: 'Contact Campus Services',
        bgColor: 'bg-[#dc2626]', // Vibrant Red
        borderColor: 'border-[#dc2626]',
        accentColor: '#dc2626',
    },
    {
        id: 'health-community',
        title: 'School of Health & Community',
        shortName: 'Health & Community',
        x: 79,
        y: 54,
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
        x: 45,
        y: 58,
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
        id: 'science-technology',
        title: 'Science & Technology Complex',
        shortName: 'Science & Technology',
        x: 50,
        y: 48,
        description: 'Integrated STEM academic complex housing both the School of Science & Engineering and the School of Technology. Features AI compute clusters, cybersecurity ranges, biochemistry research suites, and robotics prototyping bays.',
        facilities: [
            'School of Technology: AI Lab & Cyber Ranges',
            'School of Science: Biochemistry & Materials Suites',
            'Shared Robotics & Hardware Prototyping Workshop',
            'Joint STEM Collaborative Lecture Theatres'
        ],
        hours: 'Mon – Fri: 9:00 AM – 4:00 PM | Sat: 9:00 AM – 4:00 PM',
        link: '/schools/technology/',
        linkText: 'Explore School of Technology',
        schools: [
            { name: 'Explore School of Technology', link: '/schools/technology/' },
            { name: 'Explore School of Science', link: '/schools/science/' }
        ],
        bgColor: 'bg-[#4f46e5]', // Electric Indigo
        borderColor: 'border-[#4f46e5]',
        accentColor: '#4f46e5',
    },
    {
        id: 'arts-design',
        title: 'School of Arts & Design',
        shortName: 'Arts & Design',
        x: 74,
        y: 42,
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
        id: 'transportation-aviation',
        title: 'School of Transportation & Aviation',
        shortName: 'Transportation & Aviation',
        x: 86,
        y: 48,
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
        x: 60,
        y: 68,
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
        x: 76,
        y: 64,
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

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.5;

export function InteractiveCampusMap() {
    const [activeLocationId, setActiveLocationId] = useState<string>(LOCATIONS[0].id);
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const viewportRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const touchDistanceRef = useRef<number | null>(null);

    const activeLocation = LOCATIONS.find((loc) => loc.id === activeLocationId) || LOCATIONS[0];

    // Clamps position so the map cannot be dragged out of view
    const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
        if (!viewportRef.current || currentScale <= 1) {
            return { x: 0, y: 0 };
        }
        const rect = viewportRef.current.getBoundingClientRect();
        const maxPanX = (rect.width * (currentScale - 1)) / 2;
        const maxPanY = (rect.height * (currentScale - 1)) / 2;

        return {
            x: Math.max(-maxPanX, Math.min(maxPanX, x)),
            y: Math.max(-maxPanY, Math.min(maxPanY, y)),
        };
    }, []);

    // Smooth focal zoom (Google Maps behavior)
    const zoomAtPoint = useCallback((targetScale: number, focalPoint?: { clientX: number; clientY: number }) => {
        if (!viewportRef.current) return;
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, targetScale));
        
        setScale((prevScale) => {
            if (newScale === prevScale) return prevScale;
            
            setPosition((prevPos) => {
                if (newScale === 1) return { x: 0, y: 0 };

                if (!focalPoint || !viewportRef.current) {
                    const ratio = newScale / prevScale;
                    return clampPosition(prevPos.x * ratio, prevPos.y * ratio, newScale);
                }

                const rect = viewportRef.current.getBoundingClientRect();
                const mouseX = focalPoint.clientX - rect.left - rect.width / 2;
                const mouseY = focalPoint.clientY - rect.top - rect.height / 2;

                const ratio = newScale / prevScale;
                const newX = mouseX - (mouseX - prevPos.x) * ratio;
                const newY = mouseY - (mouseY - prevPos.y) * ratio;

                return clampPosition(newX, newY, newScale);
            });

            return newScale;
        });
    }, [clampPosition]);

    // Attach non-passive wheel event listener to container for smooth Google Maps scroll zoom
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 1.18 : 0.85;
            setScale((currScale) => {
                const target = currScale * zoomDelta;
                zoomAtPoint(target, { clientX: e.clientX, clientY: e.clientY });
                return currScale; // zoomAtPoint will manage setScale
            });
        };

        viewport.addEventListener('wheel', onWheel, { passive: false });
        return () => viewport.removeEventListener('wheel', onWheel);
    }, [zoomAtPoint]);

    // Button controls
    const handleZoomIn = () => zoomAtPoint(scale * 1.35);
    const handleZoomOut = () => zoomAtPoint(scale / 1.35);
    const handleResetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Double click to zoom in at that spot
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        zoomAtPoint(scale * 1.5, { clientX: e.clientX, clientY: e.clientY });
    };

    // Mouse Drag (Pan) Handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only start drag on primary mouse button
        if (e.button !== 0) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        lastPosRef.current = { ...position };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPosition(clampPosition(lastPosRef.current.x + dx, lastPosRef.current.y + dy, scale));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch Handlers for Mobile Gestures (Pinch to Zoom + Drag Pan)
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            lastPosRef.current = { ...position };
            touchDistanceRef.current = null;
        } else if (e.touches.length === 2) {
            setIsDragging(false);
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchDistanceRef.current = Math.hypot(dx, dy);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - dragStartRef.current.x;
            const dy = e.touches[0].clientY - dragStartRef.current.y;
            setPosition(clampPosition(lastPosRef.current.x + dx, lastPosRef.current.y + dy, scale));
        } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDist = Math.hypot(dx, dy);
            const pinchRatio = newDist / touchDistanceRef.current;
            touchDistanceRef.current = newDist;

            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            zoomAtPoint(scale * pinchRatio, { clientX: midX, clientY: midY });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        touchDistanceRef.current = null;
    };

    // Center on selected location when clicked
    const handleLocationSelect = (loc: CampusLocation, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveLocationId(loc.id);
    };

    // Counter scale factor so pins stay legible and appropriately sized
    const markerScale = 1 / Math.pow(scale, 0.45);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
            {/* Main Interactive Map Stage */}
            <div className="grid lg:grid-cols-12 gap-0 relative">
                {/* Left/Main Column: Google Maps Style Interactive Canvas */}
                <div
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onDoubleClick={handleDoubleClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className={`lg:col-span-8 relative bg-slate-950 overflow-hidden min-h-[440px] sm:min-h-[520px] flex items-center justify-center select-none ${
                        isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
                    }`}
                >
                    {/* Google Maps Style Floating Control Stack */}
                    <div className="absolute top-3 right-3 z-30 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-md border border-slate-300 overflow-hidden text-slate-800">
                        <button
                            onClick={handleZoomIn}
                            title="Zoom In (+)"
                            className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black transition-colors border-b border-slate-200 flex items-center justify-center"
                            aria-label="Zoom In"
                        >
                            <Plus size={14} weight="bold" />
                        </button>
                        
                        {/* Zoom Level Indicator */}
                        <div className="px-1.5 py-0.5 text-[9px] font-extrabold text-slate-600 bg-slate-100 w-full text-center border-b border-slate-200 tracking-tighter">
                            {Math.round(scale * 100)}%
                        </div>

                        <button
                            onClick={handleZoomOut}
                            title="Zoom Out (-)"
                            className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black transition-colors border-b border-slate-200 flex items-center justify-center"
                            aria-label="Zoom Out"
                        >
                            <Minus size={14} weight="bold" />
                        </button>
                        <button
                            onClick={handleResetView}
                            title="Reset View & Recenter"
                            className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black transition-colors border-b border-slate-200 flex items-center justify-center"
                            aria-label="Recenter Map"
                        >
                            <Target size={14} weight="bold" />
                        </button>
                        <button
                            onClick={() => setIsLightboxOpen(true)}
                            title="Expand Full View"
                            className="p-2 hover:bg-slate-100 text-slate-700 hover:text-black transition-colors flex items-center justify-center"
                            aria-label="Fullscreen Map"
                        >
                            <ArrowsOut size={14} weight="bold" />
                        </button>
                    </div>

                    {/* Google Maps Info Pill */}
                    <div className="absolute top-3 left-3 z-30 bg-black/85 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 pointer-events-none">
                        <MapPin size={12} weight="fill" className="text-[#c89211]" />
                        <span className="hidden sm:inline">Scroll to Zoom • Drag to Pan</span>
                        <span className="sm:hidden">Pinch / Drag Map</span>
                    </div>

                    {/* Transform Stage (Smooth GPU-accelerated Zoom & Pan) */}
                    <div
                        className="relative w-full h-full aspect-[4/3] sm:aspect-[16/10] origin-center will-change-transform"
                        style={{
                            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                            transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
                        }}
                    >
                        <Image
                            src="/images/Cannoga College Campus MAp.png"
                            alt="Cannoga College Ottawa Campus Map"
                            fill
                            priority
                            draggable={false}
                            className="object-cover object-center pointer-events-none"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                        />

                        {/* Interactive Hotspot Pins with Counter-Scaling */}
                        {LOCATIONS.map((loc) => {
                            const isSelected = activeLocationId === loc.id;
                            return (
                                <div
                                    key={loc.id}
                                    style={{
                                        left: `${loc.x}%`,
                                        top: `${loc.y}%`,
                                        transform: `translate(-50%, -50%) scale(${markerScale})`,
                                        transformOrigin: 'center center',
                                    }}
                                    className="absolute z-20 will-change-transform"
                                >
                                    <button
                                        onClick={(e) => handleLocationSelect(loc, e)}
                                        className="group transition-all duration-150 focus:outline-hidden"
                                        aria-label={`Select ${loc.title}`}
                                    >
                                        <div
                                            className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold transition-all ${
                                                isSelected
                                                    ? `${loc.bgColor} text-white ring-2 ring-white scale-105`
                                                    : 'bg-white/95 text-slate-900 hover:scale-105 hover:bg-[#0a151a] hover:text-white border border-slate-300'
                                            }`}
                                        >
                                            <MapPin
                                                size={11}
                                                weight="fill"
                                                className={isSelected ? 'text-white' : ''}
                                                style={!isSelected ? { color: loc.accentColor } : undefined}
                                            />
                                            <span className="tracking-tight text-[10px] whitespace-nowrap">
                                                {loc.shortName}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Student Resource Hub Styled Location Card Inspector */}
                <div className="lg:col-span-4 p-3 sm:p-5 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-center">
                    <div
                        className={`w-full p-6 sm:p-7 rounded-md ${activeLocation.bgColor} ${activeLocation.borderColor} border-4 text-white overflow-hidden relative flex flex-col justify-between min-h-[440px] shadow-sm`}
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

                        {/* Bottom CTA Links */}
                        <div className="pt-4 mt-4 border-t border-white/20">
                            {activeLocation.schools && activeLocation.schools.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {activeLocation.schools.map((school, sIdx) => (
                                        <Link
                                            key={sIdx}
                                            href={school.link}
                                            className="group flex items-center justify-between text-white font-black uppercase tracking-wider text-xs sm:text-sm no-underline hover:text-slate-100 py-1"
                                        >
                                            <span className="underline">{school.name}</span>
                                            <div className="shrink-0 p-1.5 bg-white text-slate-900 rounded-full group-hover:scale-110 transition-transform">
                                                <ArrowUpRight size={16} weight="bold" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    href={activeLocation.link}
                                    className="group flex items-center justify-between text-white font-black uppercase tracking-wider text-xs sm:text-sm no-underline hover:text-slate-100"
                                >
                                    <span className="underline">{activeLocation.linkText}</span>
                                    <div className="shrink-0 p-1.5 bg-white text-slate-900 rounded-full group-hover:scale-110 transition-transform">
                                        <ArrowUpRight size={18} weight="bold" />
                                    </div>
                                </Link>
                            )}
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
