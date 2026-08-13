'use client';

import { useEffect } from 'react';
import { Printer } from "@phosphor-icons/react/dist/ssr";

export default function PrintButton() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#0f2027] text-white border border-white/20 px-6 py-2 rounded-sm text-[10px] font-bold transition-all shadow-sm hover:bg-[#1a3644]"
        >
            <Printer size={16} weight="regular" /> Print Letter
        </button>
    );
}

