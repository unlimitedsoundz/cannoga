'use client';

import * as React from "react"
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr";

interface SearchFieldProps {
    placeholder?: string;
    onEnter?: (value: string) => void;
    onClick?: (value: string) => void;
    onChange?: (value: string) => void;
    onValidate?: (value: string) => boolean;
    defaultValue?: string;
    value?: string;
}

/**
 * Standardized SearchField component for Cannoga College.
 * Aliased from @aalto-dx/react-components.
 */
export function SearchField({ 
    placeholder = "Find by keyword...", 
    onEnter, 
    onClick, 
    onChange, 
    onValidate,
    defaultValue = "",
    value: controlledValue
}: SearchFieldProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
            setUncontrolledValue(newValue);
        }
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (onValidate) {
                if (onValidate(value)) {
                    onEnter?.(value);
                }
            } else {
                onEnter?.(value);
            }
        }
    };

    const handleSearchClick = () => {
        if (onValidate) {
            if (onValidate(value)) {
                onClick?.(value);
            }
        } else {
            onClick?.(value);
        }
    };

    return (
        <div className="flex items-center gap-3 bg-[#f8fafc] px-4 py-3 rounded-none border-b-2 border-[#0f2027] group focus-within:bg-white transition-all">
            <button 
                onClick={handleSearchClick}
                className="text-black hover:opacity-70 transition-opacity"
            >
                <SearchIcon size={20} weight="bold" />
            </button>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm font-bold uppercase tracking-widest outline-none placeholder:text-neutral-300 placeholder:normal-case placeholder:font-medium"
            />
        </div>
    );
}

