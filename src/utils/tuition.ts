import { DegreeLevel } from '@/types/database';
import { createClient } from '@/utils/supabase/client';

export type TuitionField = 'BUSINESS' | 'ARTS' | 'TECHNOLOGY' | 'SCIENCE';

/** Tuition schedule effective October 1, 2026 (annual, CAD). Bachelor's degrees are no longer offered. */
export const TUITION_EFFECTIVE_DATE = '2026-10-01';

export const DOMESTIC_TUITION = {
    CERTIFICATE: 2400,
    DIPLOMA: 2400,
    /** @deprecated use CERTIFICATE or DIPLOMA */
    CERTIFICATE_DIPLOMA: 2400,
    ADVANCED_DIPLOMA: 5600,
    MASTER: 5600
};

export const INTERNATIONAL_TUITION = {
    CERTIFICATE: 4000,
    DIPLOMA: 8000,
    /** @deprecated use CERTIFICATE or DIPLOMA (Certificate value) */
    CERTIFICATE_DIPLOMA: 4000,
    ADVANCED_DIPLOMA: 16600,
    MASTER: 16600
};

export const DOMESTIC_DEPOSIT = {
    CERTIFICATE_DIPLOMA: 2000,
    ADVANCED_DIPLOMA: 2000,
    MASTER: 2000
};

export const INTERNATIONAL_DEPOSIT = {
    CERTIFICATE_DIPLOMA: 2000,
    ADVANCED_DIPLOMA: 2000,
    MASTER: 2000
};

export const ANCILLARY_FEES = [
    { name: 'Student Activity Fee', amount: 150 },
    { name: 'Technology Fee', amount: 100 },
    { name: 'Athletics and Recreation Fee', amount: 75 },
    { name: 'Convocation Fee', amount: 50 },
    { name: 'Student Counselling Fee', amount: 50 },
    { name: 'Program Transcript Fee', amount: 25 },
    { name: 'Student Experience Fee', amount: 50 }
];

export const ANCILLARY_FEES_TOTAL = ANCILLARY_FEES.reduce((acc, item) => acc + item.amount, 0); // 475 CAD

export const EARLY_PAYMENT_DISCOUNT_PERCENT = 0;
export const EARLY_PAYMENT_WINDOW_DAYS = 14;

/**
 * Checks if the current date is within the early payment window (14 days)
 * from the offer creation date.
 */
export function isWithinEarlyPaymentWindow(offerCreatedAt: string): boolean {
    const offerDate = new Date(offerCreatedAt);
    const deadline = new Date(offerDate);
    deadline.setDate(deadline.getDate() + EARLY_PAYMENT_WINDOW_DAYS);
    return new Date() <= deadline;
}

function getCredentialType(level: string): string {
    const lvl = (level || '').toUpperCase();
    if (lvl.includes('ADVANCED') || lvl.includes('MASTER') || lvl.includes('MSC')) return 'MASTER';
    if (lvl.includes('CERTIFICATE')) return 'CERTIFICATE';
    // Diplomas, plus legacy BACHELOR/BSC values (all Bachelor programs became Diplomas in Oct 2026)
    return 'DIPLOMA';
}

function extractAnnualFee(jsonb: any, fallback: number): number {
    if (!jsonb) return fallback;
    const val = jsonb.annualTuition || jsonb.domesticTuition || jsonb.tuition || jsonb.amount || jsonb.value;
    if (!val) return fallback;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
}

export function getTuitionFeeSync(level: string, field?: string, isDomestic: boolean = false): number {
    const table = isDomestic ? DOMESTIC_TUITION : INTERNATIONAL_TUITION;
    switch (getCredentialType(level)) {
        case 'CERTIFICATE': return table.CERTIFICATE;
        case 'MASTER': return table.MASTER;
        default: return table.DIPLOMA;
    }
}

/**
 * Validates and gets the tuition fee based on degree level and residency (isDomestic).
 * Fetches from tuition_info table; falls back to hardcoded values if DB is unavailable.
 * Returns annual fee.
 */
export async function getTuitionFee(level: string, field?: string, isDomestic: boolean = false): Promise<number> {
    const credentialType = getCredentialType(level);

    try {
        const supabase = createClient();
        const { data } = await supabase
            .from('tuition_info')
            .select('domestic_tuition, international_tuition')
            .eq('credential_type', credentialType)
            .eq('status', 'active')
            .single();

        if (data) {
            const jsonb = isDomestic ? data.domestic_tuition : data.international_tuition;
            const fallback = getTuitionFeeSync(level, field, isDomestic);
            const fee = extractAnnualFee(jsonb, fallback);
            if (fee > 0) return fee;
        }
    } catch (error) {
        console.error('Failed to fetch tuition from DB:', error);
    }

    return getTuitionFeeSync(level, field, isDomestic);
}

/**
 * Calculates the fee after early payment discount (always returns totalFee since percent is 0).
 */
export function calculateDiscountedFee(totalFee: number): number {
    return totalFee;
}

/**
 * Calculates the total program fee with early bird discount applied to the first year only.
 * Since discount is 0, this is simply annualFee * years.
 */
export function calculateFullProgramDiscountedFee(annualFee: number, years: number): number {
    return annualFee * years;
}

/**
 * Gets total program years based on duration string and degree level.
 */
export function getProgramYears(duration: string, level?: string): number {
    const lvl = (level || '').toUpperCase();
    if (lvl.includes('ADVANCED') || lvl.includes('MASTER') || lvl.includes('MSC')) return 3;
    if (lvl.includes('DIPLOMA') || lvl.includes('BACHELOR') || lvl.includes('BSC')) return 2;
    if (lvl.includes('CERTIFICATE')) return 1;

    const dur = duration.toLowerCase();
    if (dur.includes('6 months') || dur.includes('1 year') || dur.includes('1st year') || dur.includes('1-year')) return 1;
    if (dur.includes('2 year') || dur.includes('2-year')) return 2;
    if (dur.includes('3 year') || dur.includes('3-year')) return 3;
    if (dur.includes('4 year') || dur.includes('4-year')) return 4;

    return 3; // Default fallback for advanced diploma
}

/**
 * Calculates the annual original fee from the total discounted fee and discount amount.
 */
export function getAnnualFeeFromTotal(totalFee: number, discountAmount: number, years: number): number {
    return Math.round(totalFee / years);
}

/**
 * Calculates the tuition deposit required to secure a place.
 */
export function calculateTuitionDeposit(annualFee: number, field?: string, isEarlyBird?: boolean, level?: string, isDomestic?: boolean): number {
    return 2000;
}

/**
 * Maps a School ID/Slug to a TuitionField.
 */
export function mapSchoolToTuitionField(schoolSlug: string): TuitionField {
    const slug = schoolSlug.toLowerCase();
    if (slug.includes('business')) return 'BUSINESS';
    if (slug.includes('arts') || slug.includes('design') || slug.includes('architecture')) return 'ARTS';
    if (slug.includes('technology') || slug.includes('engineering')) return 'TECHNOLOGY';
    if (slug.includes('science')) return 'SCIENCE';
    return 'TECHNOLOGY';
}