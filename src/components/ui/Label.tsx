import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = '', children, htmlFor, ...props }, ref) => {
        return (
            <label
                ref={ref}
                htmlFor={htmlFor}
                className={`text-[10px] font-bold uppercase tracking-wider text-neutral-400 ${className}`}
                {...props}
            >
                {children}
            </label>
        );
    }
);

Label.displayName = 'Label';

export { Label };