'use client';

import { Link } from "@aalto-dx/react-components";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface NavLink {
    label: string;
    linkComponentProps?: {
        href: string;
    };
    highlighted?: boolean;
    hidden?: boolean;
}

interface NavSection {
    header: NavLink;
    links: NavLink[];
}

interface NavigationAccordionProps {
    sections: NavSection[];
    onChange?: (value: string) => void;
}

/**
 * Standardized NavigationAccordion component for Cannoga College.
 * Aliased from @aalto-dx/react-modules.
 */
export function NavigationAccordion({ sections, onChange }: NavigationAccordionProps) {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

    // Initialize expanded state based on pathname
    useEffect(() => {
        const initialExpanded: Record<number, boolean> = {};
        sections.forEach((section, index) => {
            const hasActiveLink = section.links.some(link => link.linkComponentProps?.href === pathname) || 
                                 section.header.linkComponentProps?.href === pathname;
            if (hasActiveLink) {
                initialExpanded[index] = true;
            }
        });
        setExpandedSections(prev => ({ ...prev, ...initialExpanded }));
    }, [sections, pathname]);

    const toggleSection = (index: number) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <nav className="aalto-side-navigation no-scrollbar" aria-label="Side Menu">
            <div className="aalto-navigation-accordion">
                {sections.map((section, index) => {
                    const isExpanded = !!expandedSections[index];
                    const hasLinks = section.links && section.links.length > 0;
                    const isHeaderActive = section.header.linkComponentProps?.href === pathname;

                    return (
                        <div key={index} className="aalto-navigation-accordion-item">
                            <div className={`aalto-navigation-accordion-item__title ${isHeaderActive ? 'highlighted' : ''}`}>
                                <span className={`aalto-link ${isHeaderActive ? 'highlighted' : ''}`}>
                                    {section.header.linkComponentProps ? (
                                        <Link 
                                            href={section.header.linkComponentProps.href} 
                                            className="aalto-link__rlink aalto-statefx medium"
                                            onClick={() => onChange?.(section.header.label)}
                                        >
                                            <span className="aalto-link__rlink-label aalto-txt-small">
                                                {section.header.label}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span className="aalto-link__rlink aalto-statefx medium cursor-default">
                                            <span className="aalto-link__rlink-label aalto-txt-small">
                                                {section.header.label}
                                            </span>
                                        </span>
                                    )}
                                </span>
                                {hasLinks && (
                                    <button 
                                        className={`aalto-button aalto-button--icon ${isExpanded ? 'active' : ''}`} 
                                        type="button" 
                                        aria-label={isExpanded ? "icon-minus" : "icon-plus"}
                                        onClick={() => toggleSection(index)}
                                    >
                                        <div className="aalto-statefx">
                                            <div className="aalto-icon aalto-txt-icon-s" aria-hidden="true">
                                                {isExpanded ? <Minus weight="bold" /> : <Plus weight="bold" />}
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                            
                            {hasLinks && (
                                <div 
                                    aria-hidden={!isExpanded} 
                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                        isExpanded ? 'max-h-[1000px] opacity-100 py-2' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="aalto-navigation-accordion-item__sub-items">
                                        {section.links.map((link, linkIndex) => {
                                            if (link.hidden) return null;
                                            const isActive = link.linkComponentProps?.href === pathname;
                                            const isHighlighted = link.highlighted || isActive;

                                            return (
                                                <div key={linkIndex} className="aalto-navigation-accordion-item__sub-item">
                                                    <span className={`aalto-link ${isHighlighted ? 'highlighted' : ''}`}>
                                                        {link.linkComponentProps ? (
                                                            <Link 
                                                                href={link.linkComponentProps.href} 
                                                                className="aalto-link__rlink aalto-statefx small"
                                                                onClick={() => onChange?.(link.label)}
                                                            >
                                                                <span className="aalto-link__rlink-label aalto-txt-small">
                                                                    {link.label}
                                                                </span>
                                                            </Link>
                                                        ) : (
                                                            <span className="aalto-link__rlink aalto-statefx small cursor-default">
                                                                <span className="aalto-link__rlink-label aalto-txt-small">
                                                                    {link.label}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
