'use client';

import * as React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

export interface SelectTriggerProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children?: React.ReactNode;
}

export interface SelectContentProps {
    children?: React.ReactNode;
}

export interface SelectItemProps {
    value: string;
    children?: React.ReactNode;
}

export interface SelectValueProps {
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, children, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white ${className}`}
                    {...props}
                >
                    {children}
                </select>
            </div>
        );
    }
);

Select.displayName = 'Select';

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectTriggerProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans bg-white ${className}`}
                {...props}
            >
                {children}
            </select>
        );
    }
);

SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({ children }: SelectContentProps) => {
    return <>{children}</>;
};

SelectContent.displayName = 'SelectContent';

const SelectItem = ({ value, children }: SelectItemProps) => {
    return <option value={value}>{children}</option>;
};

SelectItem.displayName = 'SelectItem';

const SelectValue = ({ placeholder }: SelectValueProps) => {
    return <span className="text-sm text-neutral-500">{placeholder}</span>;
};

SelectValue.displayName = 'SelectValue';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };