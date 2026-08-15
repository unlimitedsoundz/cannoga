'use client';

import React, { useState, useEffect } from 'react';
import { Elevator, WifiHigh, WashingMachine, Drop, Users, X, CaretLeft, CaretRight, Info, CheckCircle, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";

// Image with graceful fallback
function HousingImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [broken, setBroken] = useState(false);
    if (broken) {
        return (
            <div className={`flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 gap-2 ${className}`}>
                <ImageIcon size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">{src.split('/').pop()}</span>
            </div>
        );
    }
    return <img src={src} alt={alt} className={className} onError={() => setBroken(true)} />;
}

export interface ApartmentOption {
    id: string;
    type: string;
    size: string;
    quantity: number;
    price: number;
    images: string[];
}

export interface BuildingCatalog {
    id: string;
    name: string;
    location: string;
    condition?: string;
    services: string[];
    apartments: ApartmentOption[];
    mainImages: string[];
    description?: string;
}

// Hardcoded catalog for now. Later can be fetched from DB.
export const BUILDINGS_CATALOG: BuildingCatalog[] = [
    {
        id: "domus-academica",
        name: "Domus Academica",
        location: "Ottawa",
        mainImages: [
            "/images/housing/dji-0020.jpg",
            "/images/housing/haukilahdenkuja15-julkisivukuva.jpg",
            "/images/housing/dsc4428.jpg"
        ],
        services: ["Elevator", "Internet: DNA", "Laundry", "Sauna", "Clubroom"],
        apartments: [
            {
                id: "room",
                type: "Room",
                size: "15.1 m²",
                quantity: 8,
                price: 490,
                images: [
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-1.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-3.jpg",
                    "/images/housing/dsc4401-hdr.jpg",
                    "/images/housing/dsc4377-hdr.jpg",
                    "/images/housing/dsc4383-hdr.jpg"
                ]
            },
            {
                id: "studio",
                type: "Studio",
                size: "27.5 - 28 m²",
                quantity: 97,
                price: 617,
                images: [
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-3.jpg",
                    "/images/housing/dsc4401-hdr.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-1.jpg",
                    "/images/housing/dsc4398-hdr.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-asuinhuone-1.jpg"
                ]
            },
            {
                id: "two-room",
                type: "Two-room apartment",
                size: "42 - 56.5 m²",
                quantity: 48,
                price: 818,
                images: [
                    "/images/housing/dsc4401-hdr.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-1.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-3.jpg",
                    "/images/housing/dsc4377-hdr.jpg",
                    "/images/housing/dsc4398-hdr.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-asuinhuone-1.jpg"
                ]
            }
        ]
    },
    {
        id: "kuura-kampus",
        name: "Kuura Kampus",
        location: "Ottawa",
        condition: "Excellent",
        mainImages: [
            "/images/housing/Kura/14-atlantinkatu5-julkisivukuva.jpg",
            "/images/housing/Kura/15-atlantinkatu5.jpg",
            "/images/housing/Kura/4-atlantinkatu5.jpg",
            "/images/housing/Kura/haukilahdenkuja-15-kaksio-kylpyhuone-1.jpg"
        ],
        services: ["Elevator", "Internet: DNA", "Laundry", "Sauna", "Clubroom"],
        apartments: [
            {
                id: "room",
                type: "Room",
                size: "11.5 - 16.5 m²",
                quantity: 73,
                price: 408,
                images: [
                    "/images/housing/Kura/6-atlantinkatu5.jpg",
                    "/images/housing/Kura/7-atlantinkatu5.jpg",
                    "/images/housing/Kura/atlantinkatu-5-solu-keittotila-1.jpg",
                    "/images/housing/Kura/haukilahdenkuja-15-kaksio-kylpyhuone-1.jpg",
                    "/images/housing/dsc4377-hdr.jpg",
                    "/images/housing/dsc4383-hdr.jpg"
                ]
            },
            {
                id: "studio",
                type: "Studio",
                size: "29.5 - 36.5 m²",
                quantity: 48,
                price: 707,
                images: [
                    "/images/housing/Kura/10-atlantinkatu5.jpg",
                    "/images/housing/Kura/atlantinkatu-5-yksio-kylpyhuone-1.jpg",
                    "/images/housing/Kura/atlantinkatu-5-yksio-kylpyhuone-2.jpg",
                    "/images/housing/Kura/atlantinkatu-5-solu-keittotila-1.jpg",
                    "/images/housing/dsc4398-hdr.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-keittotila-3.jpg"
                ]
            },
            {
                id: "two-room",
                type: "Two-room apartment",
                size: "39.5 - 55 m²",
                quantity: 23,
                price: 860,
                images: [
                    "/images/housing/Kura/4-atlantinkatu5.jpg",
                    "/images/housing/Kura/6-atlantinkatu5.jpg",
                    "/images/housing/Kura/10-atlantinkatu5.jpg",
                    "/images/housing/Kura/atlantinkatu-5-yksio-kylpyhuone-1.jpg",
                    "/images/housing/haukilahdenkuja-15-kaksio-asuinhuone-1.jpg",
                    "/images/housing/dsc4401-hdr.jpg"
                ]
            },
            {
                id: "three-room",
                type: "Three-room apartment",
                size: "72.5 m²",
                quantity: 3,
                price: 1226,
                images: [
                    "/images/housing/Kura/15-atlantinkatu5.jpg",
                    "/images/housing/Kura/7-atlantinkatu5.jpg",
                    "/images/housing/Kura/atlantinkatu-5-yksio-kylpyhuone-2.jpg",
                    "/images/housing/Kura/atlantinkatu-5-solu-keittotila-1.jpg",
                    "/images/housing/dsc4383-hdr.jpg",
                    "/images/housing/dsc4398-hdr.jpg"
                ]
            }
        ]
    },
    {
        id: "vanamo",
        name: "Vanamo",
        location: "Vanamo Campus, Ottawa",
        mainImages: [
            "/images/housing/Vanamo/retkeilijankatu11-julkisivukuva.jpg",
            "/images/housing/Vanamo/dsc4574-hdr.jpg",
            "/images/housing/Vanamo/retkeilijankatu-11-yhteistila.jpg"
        ],
        services: ["Elevator", "Internet: DNA", "Laundry", "Sauna", "Clubroom"],
        apartments: [
            {
                id: "studio",
                type: "Studio",
                size: "16.5 - 47 m²",
                quantity: 100,
                price: 534,
                images: [
                    "/images/housing/Vanamo/dsc4556-hdr.jpg",
                    "/images/housing/Vanamo/dsc4559-hdr.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-huone-stailattu.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-huone.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-kerhohuone.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-pesula.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yhteistila.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio-eteinen-1.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio-keittotila-1.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio-kylpyhuone-1.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio-parvi-1.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio2-huone.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio2-keittio.jpg",
                    "/images/housing/Vanamo/retkeilijankatu-11-yksio2-kylpyhuone2.jpg"
                ]
            }
        ]
    },
    {
        id: "myrsky-kampus",
        name: "Myrsky Kampus",
        location: "Cannoga College, Ottawa",
        mainImages: [
            "/images/housing/Myskry/2-santakuja3.jpg",
            "/images/housing/Myskry/1-santakuja3.jpg"
        ],
        services: ["Internet: DNA", "Laundry", "Sauna", "Clubroom"],
        apartments: [
            {
                id: "room",
                type: "Room",
                size: "12.7 - 13.5 m²",
                quantity: 30,
                price: 442,
                images: [
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-asuinhuone-1.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-asuinhuone-2.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-1.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-kylpyhuone-1.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-wc-1.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-parveke-1.jpg"
                ]
            },
            {
                id: "two-room",
                type: "Two-room apartment",
                size: "60.5 m²",
                quantity: 3,
                price: 1011,
                images: [
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-4.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-asuinhuone-3.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-asuinhuone-4.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-5.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-6.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-keittio-7.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-parveke-2.jpg",
                    "/images/housing/Myskry/selkamerenkatu-6-santakuja-3-kolmio-parveke-3.jpg"
                ]
            }
        ]
    }
];

interface HousingCatalogViewProps {
    onSelectBuilding: (buildingId: string) => void;
    onSelectApartment: (apartmentId: string, leaseDuration: number) => void;
    onClose: () => void;
}

export default function HousingCatalogView({ onSelectBuilding, onSelectApartment, onClose }: HousingCatalogViewProps) {
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingCatalog | null>(BUILDINGS_CATALOG[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedApt, setSelectedApt] = useState<string | null>(null);
    const [aptImageIndices, setAptImageIndices] = useState<Record<string, number>>({});
    const [leaseDuration, setLeaseDuration] = useState<number>(6); // Default to 6 months


    // Lock body scroll so the nav doesn't hide and shift the catalog
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    const getServiceIcon = (service: string) => {
        const s = service.toLowerCase();
        if (s.includes('elevator')) return <Elevator size={20} />;
        if (s.includes('internet')) return <WifiHigh size={20} />;
        if (s.includes('laundry')) return <WashingMachine size={20} />;
        if (s.includes('sauna')) return <Drop size={20} />;
        if (s.includes('club')) return <Users size={20} />;
        return <Info size={20} />;
    };

    const handleApply = () => {
        if (!selectedBuilding) return;
        onSelectBuilding(selectedBuilding.id);
        if (selectedApt) {
            onSelectApartment(selectedApt, leaseDuration);
        }
        onClose();
    };

    return (
        <div className="fixed top-16 inset-x-0 bottom-0 z-[200] flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-black">Available Properties</h2>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">Select your student housing</p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                >
                    <X size={24} weight="bold" />
                </button>
            </div>
            {/* Mobile Campus Tabs - visible only on mobile */}
            <div className="md:hidden border-b border-neutral-200 overflow-x-auto flex bg-neutral-50 scrollbar-none">
                {BUILDINGS_CATALOG.map(building => (
                    <button
                        key={building.id}
                        onClick={() => { setSelectedBuilding(building); setCurrentImageIndex(0); }}
                        className={`flex-shrink-0 px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${
                            selectedBuilding?.id === building.id
                                ? 'border-[#0a151a] text-black bg-white'
                                : 'border-transparent text-neutral-500 hover:text-black'
                        }`}
                    >
                        {building.name}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Sidebar - Property List (if we add more buildings) */}
                <div className="w-1/4 border-r border-neutral-200 overflow-y-auto bg-neutral-50 hidden md:block">
                    {BUILDINGS_CATALOG.map(building => (
                        <div 
                            key={building.id}
                            onClick={() => { setSelectedBuilding(building); setCurrentImageIndex(0); }}
                            className={`p-6 cursor-pointer border-b border-neutral-200 transition-colors ${selectedBuilding?.id === building.id ? 'bg-[#0a151a] text-white' : 'hover:bg-neutral-200 text-black'}`}
                        >
                            <h3 className="text-lg font-black uppercase tracking-tight">{building.name}</h3>
                            <p className={`text-xs uppercase tracking-widest mt-1 ${selectedBuilding?.id === building.id ? 'text-neutral-300' : 'text-neutral-500'}`}>{building.location}</p>
                            <div className="mt-4 flex gap-2 flex-wrap">
                                <span className={`text-[10px] px-2 py-1 uppercase font-bold ${selectedBuilding?.id === building.id ? 'bg-white text-black' : 'bg-neutral-200 text-black'}`}>
                                    {building.apartments.length} Options
                                </span>
                                {building.condition && (
                                    <span className={`text-[10px] px-2 py-1 uppercase font-bold ${selectedBuilding?.id === building.id ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                                        {building.condition}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Property Details */}
                {selectedBuilding && (
                    <div className="flex-1 overflow-y-auto">
                        {/* Image Carousel Area */}
                        <div className="relative h-96 bg-neutral-100 overflow-hidden group">
                            {/* Actual image */}
                            <HousingImage
                                src={selectedBuilding.mainImages[currentImageIndex]}
                                alt={selectedBuilding.name}
                                className="w-full h-full object-contain"
                            />

                            {/* Dark gradient overlay at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Image counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {selectedBuilding.mainImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>

                            {/* Carousel Nav hidden by default, visible on hover */}
                            {selectedBuilding.mainImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? selectedBuilding.mainImages.length - 1 : prev - 1)}
                                    >
                                        <CaretLeft size={20} weight="bold" />
                                    </button>
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                                        onClick={() => setCurrentImageIndex(prev => prev === selectedBuilding.mainImages.length - 1 ? 0 : prev + 1)}
                                    >
                                        <CaretRight size={20} weight="bold" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Building Info */}
                        <div className="p-8 md:p-12 max-w-5xl mx-auto">
                            <div className="mb-12">
                                <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-1">{selectedBuilding.name}</h1>
                                <p className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">{selectedBuilding.location}</p>
                                {selectedBuilding.condition && (
                                    <div className="mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-black px-3 py-1">Condition: {selectedBuilding.condition}</span>
                                    </div>
                                )}
                                
                                <div className="mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Apartments Available</h3>
                                </div>

                                <div className="border-t border-b border-neutral-200 py-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-4">Services</h3>
                                    <div className="flex flex-wrap gap-6">
                                        {selectedBuilding.services.map((service, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-black">
                                                {getServiceIcon(service)}
                                                <span className="text-sm font-bold">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Apartments List */}
                            <div>
                                <h3 className="text-xl font-black uppercase text-black mb-6">Apartments</h3>
                                <p className="text-sm text-neutral-600 mb-8">
                                    You can add these apartments to your housing application. There might be a wait, as these apartments are currently occupied.
                                </p>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {selectedBuilding.apartments.map((apt) => (
                                        <div 
                                            key={apt.id} 
                                            onClick={() => setSelectedApt(apt.id)}
                                            className={`border-2 cursor-pointer transition-all ${selectedApt === apt.id ? 'border-[#0a151a] bg-neutral-50' : 'border-neutral-200 hover:border-[#0a151a]'} p-6`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-lg uppercase text-black">{apt.type}</h4>
                                                {selectedApt === apt.id && <CheckCircle size={24} weight="fill" className="text-black" />}
                                            </div>
                                            
                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-sm text-black">
                                                    <span className="text-neutral-500">Size</span>
                                                    <span className="font-bold">{apt.size}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-black">
                                                    <span className="text-neutral-500">Availability</span>
                                                    <span className="font-bold">{apt.quantity} pcs</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-black">
                                                    <span className="text-neutral-500">Rent</span>
                                                    <span className="font-bold">{apt.price} $</span>
                                                </div>
                                            </div>

                                            {/* Apartment mini-carousel */}
                                            <div className="h-36 mb-4 relative overflow-hidden bg-neutral-100 group/card">
                                                <HousingImage
                                                    src={apt.images[aptImageIndices[apt.id] ?? 0]}
                                                    alt={apt.type}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                                {apt.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setAptImageIndices(prev => ({ ...prev, [apt.id]: ((prev[apt.id] ?? 0) - 1 + apt.images.length) % apt.images.length })); }}
                                                            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-white/90 hover:bg-white text-black opacity-0 group-hover/card:opacity-100 transition-all"
                                                        >
                                                            <CaretLeft size={14} weight="bold" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setAptImageIndices(prev => ({ ...prev, [apt.id]: ((prev[apt.id] ?? 0) + 1) % apt.images.length })); }}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-white/90 hover:bg-white text-black opacity-0 group-hover/card:opacity-100 transition-all"
                                                        >
                                                            <CaretRight size={14} weight="bold" />
                                                        </button>
                                                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                                                            {apt.images.map((_, i) => (
                                                                <span key={i} className={`block rounded-full transition-all ${i === (aptImageIndices[apt.id] ?? 0) ? 'bg-white w-3 h-1.5' : 'bg-white/50 w-1.5 h-1.5'}`} />
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedApt(apt.id);
                                                }}
                                                className={`w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${selectedApt === apt.id ? 'bg-[#0a151a] text-white' : 'bg-neutral-200 text-black hover:bg-neutral-300'}`}
                                            >
                                                {selectedApt === apt.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {selectedApt && (
                                    <div className="mt-12 p-8 border-4 border-[#0a151a] bg-neutral-50 animate-in slide-in-from-top-4 duration-500">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div>
                                                <h3 className="text-xl font-black uppercase text-black mb-1">Select Lease Duration</h3>
                                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Choose your stay length for total calculation</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {[1, 6, 12].map((duration) => (
                                                    <button
                                                        key={duration}
                                                        onClick={() => setLeaseDuration(duration)}
                                                        className={`px-6 py-3 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${leaseDuration === duration ? 'bg-[#0a151a] text-white border-[#0a151a] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black border-neutral-200 hover:border-[#0a151a]'}`}
                                                    >
                                                        {duration === 12 ? '1 Year' : `${duration} Months`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-end gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Monthly Rent</p>
                                                <p className="text-2xl font-black text-black">
                                                    ${selectedBuilding.apartments.find(a => a.id === selectedApt)?.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Contract Value ({leaseDuration} months)</p>
                                                <p className="text-4xl font-black text-black">
                                                    ${(selectedBuilding.apartments.find(a => a.id === selectedApt)?.price || 0) * leaseDuration}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Action Bar */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
                <div className="text-sm">
                    {selectedApt ? (
                        <span>
                            <strong className="text-black uppercase">Selected:</strong> {selectedBuilding?.apartments.find(a => a.id === selectedApt)?.type} 
                            <span className="mx-2">|</span>
                            <strong className="text-black uppercase">Lease:</strong> {leaseDuration} {leaseDuration === 1 ? 'Month' : 'Months'}
                        </span>
                    ) : (
                        <span className="text-neutral-500">Select an apartment type to continue</span>
                    )}
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 border border-neutral-300 text-black text-[10px] font-black uppercase tracking-widest hover:border-[#0a151a] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleApply}
                        disabled={!selectedApt}
                        className="px-6 py-3 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add to Application
                    </button>
                </div>
            </div>
        </div>
    );
}

