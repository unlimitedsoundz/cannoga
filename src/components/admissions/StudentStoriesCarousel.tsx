'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "@phosphor-icons/react";

interface Peer {
    id: number;
    name: string;
    firstName: string;
    country: string;
    flag: string;
    programme: string;
    image: string;
    quote: string;
    cardBgClass: string;
    imagePosition?: string;
}

const peers: Peer[] = [
    {
        id: 1,
        name: "Tanmehar Singh",
        firstName: "TANMEHAR",
        country: "INDIA",
        flag: "🇮🇳",
        programme: "Honours Bachelor of Computer Science",
        image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=800",
        quote: "Cannoga College gave me direct access to tech co-op placements in Ottawa and hands-on software laboratory projects from day one.",
        cardBgClass: "bg-[#008cc9] hover:bg-[#0077b6]",
    },
    {
        id: 2,
        name: "Shahad Al-Mansoor",
        firstName: "SHAHAD",
        country: "SYRIA",
        flag: "🇸🇾",
        programme: "Advanced Diploma in Biotechnology",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
        quote: "The state-of-the-art lab facilities and personalized mentorship from faculty made my transition to studying in Ottawa seamless.",
        cardBgClass: "bg-[#0d9488] hover:bg-[#0f766e]",
    },
    {
        id: 3,
        name: "Chinaza Kamsiyochukwu",
        firstName: "CHINAZA",
        country: "NIGERIA",
        flag: "🇳🇬",
        programme: "Honours Bachelor of Environmental Science",
        image: "https://i.pinimg.com/1200x/72/a1/7c/72a17cb6e8bda24fd421065e8ad24296.jpg",
        quote: "Conducting field research along the Rideau Canal and participating in campus sustainability projects gave me invaluable experience.",
        cardBgClass: "bg-[#e11d48] hover:bg-[#be123c]",
    },
    {
        id: 4,
        name: "Collins Huang",
        firstName: "COLLINS",
        country: "TAIWAN",
        flag: "🇹🇼",
        programme: "Bachelor's in International Business",
        image: "/images/collins-huang.jpg",
        quote: "Earn while you learn. The co-op program allowed me to gain real Canadian work experience in Ottawa's top firms.",
        cardBgClass: "bg-[#7c3aed] hover:bg-[#6d28d9]",
    },
    {
        id: 5,
        name: "Maria Petrova",
        firstName: "MARIA",
        country: "UKRAINE",
        flag: "🇺🇦",
        programme: "Master's in Design Management",
        image: "/images/student-story-2.jpg",
        quote: "Studying in Ottawa has been life-changing. Collaborative research and welcoming community at Cannoga are truly world-class.",
        cardBgClass: "bg-[#d97706] hover:bg-[#b45309]",
    },
    {
        id: 6,
        name: "Sergei Voldov",
        firstName: "SERGEI",
        country: "CANADA",
        flag: "🇨🇦",
        programme: "Advanced Diploma in Software Engineering",
        image: "/images/student-story-4.jpg",
        quote: "The practical coding labs helped me land a full-time software engineering offer in Ottawa's tech hub before graduation.",
        cardBgClass: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    }
];

export default function StudentStoriesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative">
            <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
                
                {/* Left Side Static Title Section */}
                <div className="w-full lg:w-[360px] shrink-0 flex flex-col justify-between py-2">
                    <div>
                        {/* Bold Vertical Heading */}
                        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1b2a4a] leading-[0.88] uppercase font-sans mb-6">
                            FIND<br />YOUR<br />PEOPLE
                        </h2>
                    </div>

                    {/* Left / Right Arrow Navigation Controls */}
                    <div className="flex items-center gap-6 pt-4">
                        <button
                            onClick={scrollLeft}
                            className="p-2 rounded-full text-[#1b2a4a] hover:text-[#008cc9] hover:bg-slate-100 transition-colors focus:outline-none"
                            aria-label="Scroll previous student"
                        >
                            <ArrowLeft size={36} weight="bold" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-2 rounded-full text-[#1b2a4a] hover:text-[#008cc9] hover:bg-slate-100 transition-colors focus:outline-none"
                            aria-label="Scroll next student"
                        >
                            <ArrowRight size={36} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Right Side Cards Horizontal Carousel */}
                <div className="flex-1 min-w-0">
                    <div 
                        ref={scrollRef}
                        className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {peers.map((peer) => (
                            <div
                                key={peer.id}
                                onClick={() => setSelectedPeer(peer)}
                                className="w-[350px] sm:w-[350px] h-[380px] sm:h-[440px] shrink-0 relative overflow-hidden group rounded-none shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer snap-start"
                            >
                                {/* Background Image */}
                                <Image
                                    src={peer.image}
                                    alt={peer.name}
                                    fill
                                    className={`object-cover group-hover:scale-105 transition-transform duration-700 ${peer.imagePosition || 'object-center'}`}
                                    sizes="(max-width: 768px) 350px, 350px"
                                />

                                {/* Top Gradient & Student Origin Banner */}
                                <div className="absolute top-0 inset-x-0 z-10 p-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                                    <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase font-sans">
                                        STUDENT FROM {peer.country}
                                    </span>
                                </div>

                                {/* Bottom Vibrant Box Button */}
                                <div className={`absolute bottom-0 inset-x-0 z-10 ${peer.cardBgClass} transition-colors p-4 sm:p-5 flex items-center justify-between text-white`}>
                                    <span className="font-black text-xl sm:text-2xl uppercase tracking-tight leading-none font-sans">
                                        MEET<br />{peer.firstName}
                                    </span>
                                    <ArrowUpRight size={32} weight="bold" className="text-white shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Story Detail Modal */}
            {selectedPeer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white max-w-2xl w-full relative overflow-hidden shadow-2xl rounded-sm">
                        <button
                            onClick={() => setSelectedPeer(null)}
                            className="absolute top-4 right-4 z-20 bg-black/10 hover:bg-black/20 text-slate-800 p-2 rounded-full transition-colors"
                            aria-label="Close story"
                        >
                            <X size={24} weight="bold" />
                        </button>

                        <div className="flex flex-col md:flex-row min-h-[380px]">
                            <div className="relative w-full md:w-1/2 h-[260px] md:h-auto shrink-0">
                                <Image
                                    src={selectedPeer.image}
                                    alt={selectedPeer.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 text-white text-xs font-black uppercase tracking-wider">
                                    {selectedPeer.flag} Student from {selectedPeer.country}
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 flex flex-col justify-between w-full md:w-1/2 bg-white">
                                <div>
                                    <p className="text-slate-700 text-base leading-relaxed italic mb-6 font-serif">
                                        "{selectedPeer.quote}"
                                    </p>
                                    <h3 className="text-2xl font-black text-[#1b2a4a] uppercase tracking-tight">
                                        {selectedPeer.name}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                                        {selectedPeer.programme}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 mt-6">
                                    <a
                                        href="/student-guide"
                                        className={`inline-flex items-center justify-center w-full ${selectedPeer.cardBgClass} text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-sm transition-colors no-underline gap-2 shadow-md`}
                                    >
                                        Read Full Student Guide <ArrowUpRight size={18} weight="bold" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
