'use client';

import { useState, useEffect } from 'react';
import { CaretUp } from '@phosphor-icons/react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        toggleVisibility();

        window.addEventListener('scroll', toggleVisibility, { passive: true });
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
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99980] w-12 h-12 sm:w-14 sm:h-14 bg-[#0a151a] hover:bg-[#c89211] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 flex items-center justify-center cursor-pointer group"
        >
            <CaretUp size={24} weight="bold" className="group-hover:-translate-y-0.5 transition-transform text-white" />
        </button>
    );
}
