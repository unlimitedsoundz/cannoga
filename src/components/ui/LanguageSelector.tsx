"use client"

import * as React from "react"
import { Globe, Check } from "@phosphor-icons/react/dist/ssr"

// Languages map: code -> Name
const languages = [
    { code: "en", name: "English", short: "EN" },
    { code: "fi", name: "Suomeksi", short: "CA" },
    { code: "sv", name: "Svenska", short: "SV" },
    { code: "es", name: "Español", short: "ES" },
    { code: "it", name: "Italiano", short: "IT" },
    { code: "de", name: "Deutsch", short: "DE" },
    { code: "fr", name: "Français", short: "FR" },
    { code: "ur", name: "Urdu", short: "UR" },
    { code: "zh-CN", name: "Chinese", short: "ZH" },
    { code: "ar", name: "Arabic", short: "AR" },
    { code: "ja", name: "Japanese", short: "JA" },
    { code: "ko", name: "Korean", short: "KO" },
]

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const [currentCode, setCurrentCode] = React.useState("en")

    // Initialize Google Translate Script
    React.useEffect(() => {
        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: languages.map(l => l.code).join(","),
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            };
        }
    }, []);

    // Handle language change via Google Translate Cookie/Event
    const handleLanguageChange = (code: string) => {
        setCurrentCode(code);
        setOpen(false);

        // Google Translate uses a specific cookie 'googtrans'.
        // Format: /source/target or /target
        const cookieValue = `/en/${code}`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`;

        // Reload to apply translation
        window.location.reload();
    };

    // Read current language from cookie on mount
    React.useEffect(() => {
        const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
        if (match && match[1]) {
            setCurrentCode(match[1]);
        }
    }, []);

    if (mobile) {
        return (
            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`text-sm py-2 px-3 rounded text-left ${currentCode === lang.code
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-black hover:bg-neutral-200"
                                }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:opacity-70 transition-colors"
                title="Change Language"
            >
                <Globe size={20} weight="regular" />
                <span className="hidden xl:inline">{languages.find(l => l.code === currentCode)?.short || "EN"}</span>
            </button>

            {/* Hidden Google Translate Element for functionality */}
            <div id="google_translate_element" className="hidden"></div>
            {/* Custom styled styling to hide the google top bar if it appears */}
            <style jsx global>{`
                body { top: 0 !important; }
                .goog-te-banner-frame { display: none !important; }
                .goog-tooltip { display: none !important; }
                .goog-te-gadget-simple { background-color: transparent !important; border: none !important; }
                .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
            `}</style>

            {open && (
                <div className="absolute top-10 right-0 w-48 bg-white border border-neutral-200 shadow-xl rounded-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center justify-between"
                        >
                            <span className={currentCode === lang.code ? "font-bold text-black" : "text-black hover:opacity-70"}>
                                {lang.name}
                            </span>
                            {currentCode === lang.code && <Check size={14} weight="bold" className="text-neutral-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
