'use client';

import { useState, useEffect } from 'react';
import { CaretUp } from '@phosphor-icons/react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#0a151a] hover:bg-[#c89211] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border border-white/20 group cursor-pointer focus:outline-none"
        >
            <CaretUp size={20} weight="bold" className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
    );
}
