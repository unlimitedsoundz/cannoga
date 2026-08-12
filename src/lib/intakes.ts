import { getProgramYears } from '@/utils/tuition';

export interface IntakeDefinition {
    id: string;
    label: string;
    month: string;
    startDate: string;
}

export const INTAKES: Record<string, IntakeDefinition> = {
    FALL_2026: { id: 'FALL_2026', label: 'Fall 2026', month: 'September', startDate: '11.09.2026' },
    WINTER_2027: { id: 'WINTER_2027', label: 'Winter 2027', month: 'January', startDate: '18.1.2027' },
    FALL_2027: { id: 'FALL_2027', label: 'Fall 2027', month: 'September', startDate: '11.09.2027' },
};

export const CANONICAL_INTAKES = Object.values(INTAKES);

export const DEFAULT_INTAKE_ID = 'FALL_2026';

export function getIntakeById(id?: string | null): IntakeDefinition {
    return INTAKES[id ?? ''] ?? INTAKES[DEFAULT_INTAKE_ID];
}

export function getIntakeStartDate(intake?: string | null): string {
    return getIntakeById(intake).startDate;
}

function addYearsToDate(dateStr: string, years: number): string {
    const [dayOrig, monthOrig, yearStr] = dateStr.split('.');
    const year = Number(yearStr) + years;
    const fmt = (n: number, orig: string) =>
        orig.length === 2 && orig.startsWith('0') ? String(n).padStart(2, '0') : String(n);
    return `${fmt(Number(dayOrig), dayOrig)}.${fmt(Number(monthOrig), monthOrig)}.${year}`;
}

export function getProgramEndDate(intake?: string | null, degreeLevel?: string): string {
    return addYearsToDate(getIntakeStartDate(intake), getProgramYears('', degreeLevel));
}

export function getIntakeAcademicYear(intake?: string | null): string {
    const year = Number(getIntakeStartDate(intake).split('.')[2]);
    return `${year} - ${year + 1}`;
}
