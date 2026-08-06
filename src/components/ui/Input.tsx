'use client';

import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };