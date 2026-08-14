'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface ParallaxBannerSectionProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
}

export function ParallaxBannerSection({
  imageSrc,
  title,
  subtitle,
  ctaText = 'Explore Campus Services',
  ctaHref = '/contact',
}: ParallaxBannerSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when section is near viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.25;
        const relativeY = rect.top - windowHeight / 2;
        setOffsetY(relativeY * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-[360px] md:h-[420px] overflow-hidden flex items-center justify-center text-center text-white my-12"
    >
      {/* Parallax Background Layer */}
      <div
        className="absolute inset-0 w-full h-full parallax-bg"
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2027]/90 via-black/50 to-[#0f2027]/70" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-12 max-w-4xl">
        <span className="text-[#c89211] font-bold text-xs uppercase tracking-widest bg-black/40 px-3 py-1 border border-[#c89211]/30 rounded-full inline-block mb-3 backdrop-blur-sm">
          Ottawa Campus Experience
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-slate-200 text-sm md:text-base mt-3 max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-6">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-[#c89211] hover:bg-[#b07e0e] text-white font-bold text-xs tracking-wider uppercase px-7 py-3.5 no-underline transition-all shadow-lg hover:shadow-xl rounded-sm"
          >
            <span>{ctaText}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
