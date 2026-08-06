import { DegreeLevel } from '@/types/database';

export type TuitionField = 'BUSINESS' | 'ARTS' | 'TECHNOLOGY' | 'SCIENCE';

export const DOMESTIC_TUITION = {
    CERTIFICATE_DIPLOMA: 1500,
    BACHELOR: 2500,
    MASTER: 3500
};

export const INTERNATIONAL_TUITION = {
    CERTIFICATE_DIPLOMA: 2500,
    BACHELOR: 4000,
    MASTER: 6000
};

export const DOMESTIC_DEPOSIT = {
    CERTIFICATE_DIPLOMA: 750,
    BACHELOR: 1250,
    MASTER: 1750
};

export const INTERNATIONAL_DEPOSIT = {
    CERTIFICATE_DIPLOMA: 1250,
    BACHELOR: 2000,
    MASTER: 3000
};


export const EARLY_PAYMENT_DISCOUNT_PERCENT = 0;
export const EARLY_PAYMENT_WINDOW_DAYS = 7;

/**
 * Checks if the current date is within the early payment window (7 days)
 * from the offer creation date.
 */
export function isWithinEarlyPaymentWindow(offerCreatedAt: string): boolean {
    const offerDate = new Date(offerCreatedAt);
    const deadline = new Date(offerDate);
    deadline.setDate(deadline.getDate() + EARLY_PAYMENT_WINDOW_DAYS);
    return new Date() <= deadline;
}

/**
 * Validates and gets the tuition fee based on degree level and residency (isDomestic).
 */
export function getTuitionFee(level: string, field?: string, isDomestic: boolean = false): number {
    const lvl = (level || '').toUpperCase();
    if (lvl.includes('CERTIFICATE') || lvl.includes('DIPLOMA')) {
        return isDomestic ? DOMESTIC_TUITION.CERTIFICATE_DIPLOMA : INTERNATIONAL_TUITION.CERTIFICATE_DIPLOMA;
    }
    if (lvl.includes('BACHELOR') || lvl.includes('BSC')) {
        return isDomestic ? DOMESTIC_TUITION.BACHELOR : INTERNATIONAL_TUITION.BACHELOR;
    }
    if (lvl.includes('MASTER') || lvl.includes('MSC')) {
        return isDomestic ? DOMESTIC_TUITION.MASTER : INTERNATIONAL_TUITION.MASTER;
    }
    // Default fallback
    return isDomestic ? DOMESTIC_TUITION.BACHELOR : INTERNATIONAL_TUITION.BACHELOR;
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
    if (lvl.includes('BACHELOR') || lvl.includes('BSC')) return 3;
    if (lvl.includes('MASTER') || lvl.includes('MSC')) return 2;
    if (lvl.includes('DIPLOMA')) return 2;
    if (lvl.includes('CERTIFICATE')) return 1;

    const dur = duration.toLowerCase();
    if (dur.includes('6 months') || dur.includes('1 year') || dur.includes('1st year') || dur.includes('1-year')) return 1;
    if (dur.includes('2 year') || dur.includes('2-year')) return 2;
    if (dur.includes('3 year') || dur.includes('3-year')) return 3;
    if (dur.includes('4 year') || dur.includes('4-year')) return 4;

    return 1; // Default fallback for certificates
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
    return Math.round(annualFee * 0.5);
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