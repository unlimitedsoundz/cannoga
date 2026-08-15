/**
 * Shared vibrant step-number circle badge.
 * Used consistently across all public-facing pages.
 */

export const STEP_COLORS = [
    '#f43f5e', // 1 – rose
    '#f97316', // 2 – orange
    '#eab308', // 3 – amber
    '#22c55e', // 4 – green
    '#06b6d4', // 5 – cyan
    '#6366f1', // 6 – indigo
    '#a855f7', // 7 – purple
    '#ec4899', // 8 – pink
    '#10b981', // 9 – emerald
];

interface StepBadgeProps {
    /** 1-based step number */
    step: number;
    /** Badge diameter Tailwind classes, defaults to w-9 h-9 */
    size?: string;
    /** Font-size Tailwind class, defaults to text-sm */
    fontSize?: string;
}

export function StepBadge({ step, size = 'w-9 h-9', fontSize = 'text-sm' }: StepBadgeProps) {
    const color = STEP_COLORS[(step - 1) % STEP_COLORS.length];
    return (
        <div
            className={lex-shrink-0  rounded-full text-white flex items-center justify-center font-black  shadow-md}
            style={{ backgroundColor: color }}
        >
            {step}
        </div>
    );
}
