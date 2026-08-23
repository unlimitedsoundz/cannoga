'use client';

import { useState, useEffect } from 'react';
import { Link } from "@aalto-dx/react-components";
import { CaretDown, CaretUp, Shield, ChartBar as BarChart3, Target, Lock } from "@phosphor-icons/react/dist/ssr";

interface CookiePreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [prefs, setPrefs] = useState<CookiePreferences>({
        essential: true,
        analytics: true,
        marketing: true
    });

    useEffect(() => {
        const savedPrefs = localStorage.getItem('Cannoga-cookie-preferences');
        if (!savedPrefs) {
            setShowConsent(true);
        }
    }, []);

    const savePreferences = (updatedPrefs: CookiePreferences) => {
        localStorage.setItem('Cannoga-cookie-preferences', JSON.stringify(updatedPrefs));
        localStorage.setItem('cookie-consent-accepted', 'true');
        setShowConsent(false);
    };

    const acceptAll = () => {
        const allPrefs = { essential: true, analytics: true, marketing: true };
        savePreferences(allPrefs);
    };

    const acceptNecessary = () => {
        const necessaryPrefs = { essential: true, analytics: false, marketing: false };
        savePreferences(necessaryPrefs);
    };

    const handleCustomSave = () => {
        savePreferences(prefs);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 pointer-events-none">
            <div className="container mx-auto max-w-4xl pointer-events-auto">
                <div className="bg-white border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl p-6 md:p-8 flex flex-col gap-6 transform transition-all duration-500 ease-in-out">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-bold text-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                                Cookies & Privacy
                            </h3>
                            <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
                                We use cookies to enhance your experience and analyze site traffic. You can choose to accept all cookies or customize your preferences below. Learn more in our {' '}
                                <Link href="/cookies/" className="text-black font-bold underline hover:text-neutral-700 transition-colors cursor-pointer">
                                    Cookie Policy
                                </Link>.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto shrink-0">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold text-sm hover:bg-neutral-50 transition-all cursor-pointer flex items-center gap-2"
                            >
                                {showDetails ? 'Hide Details' : 'Customize'}
                                {showDetails ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                            </button>
                            <button
                                onClick={acceptNecessary}
                                className="px-6 py-2.5 rounded-xl border border-neutral-200 text-black font-bold text-sm hover:bg-neutral-50 transition-all cursor-pointer"
                            >
                                Necessary Only
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-8 py-2.5 rounded-xl bg-[#0a151a] text-white font-bold text-sm hover:bg-neutral-800 transition-all cursor-pointer shadow-lg active:scale-95"
                            >
                                Allow All
                            </button>
                        </div>
                    </div>

                    {showDetails && (
                        <div className="border-t border-neutral-100 pt-6 mt-2 space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Essential */}
                                <div className="p-4 bg-neutral-50 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Required</span>
                                    </div>
                                    <h4 className="font-bold text-sm">Essential</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        Necessary for the website to function (e.g., authentication, security).
                                    </p>
                                </div>

                                {/* Analytics */}
                                <div className={`p-4 rounded-2xl space-y-3 border-2 transition-all cursor-pointer ${prefs.analytics ? 'bg-[#0a151a] text-white border-transparent' : 'bg-neutral-50 border-transparent text-neutral-900 opacity-60'}`}
                                    onClick={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}>
                                    <div className="flex items-center justify-between">
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${prefs.analytics ? 'bg-white/20' : 'bg-neutral-300'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${prefs.analytics ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm">Analytics</h4>
                                    <p className={`text-xs leading-relaxed ${prefs.analytics ? 'text-white/60' : 'text-neutral-500'}`}>
                                        Helps us understand how visitors interact with the site.
                                    </p>
                                </div>

                                {/* Marketing */}
                                <div className={`p-4 rounded-2xl space-y-3 border-2 transition-all cursor-pointer ${prefs.marketing ? 'bg-[#0a151a] text-white border-transparent' : 'bg-neutral-50 border-transparent text-neutral-900 opacity-60'}`}
                                    onClick={() => setPrefs({ ...prefs, marketing: !prefs.marketing })}>
                                    <div className="flex items-center justify-between">
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${prefs.marketing ? 'bg-white/20' : 'bg-neutral-300'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${prefs.marketing ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm">Marketing</h4>
                                    <p className={`text-xs leading-relaxed ${prefs.marketing ? 'text-white/60' : 'text-neutral-500'}`}>
                                        Used to show you relevant information across other platforms.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleCustomSave}
                                    className="px-8 py-3 rounded-xl bg-[#0a151a] text-white font-bold text-sm hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                                >
                                    Save My Choices
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

