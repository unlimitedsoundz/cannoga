'use client';

import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans resize-y ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };