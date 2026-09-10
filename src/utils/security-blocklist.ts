/**
 * Security Blocklist Configuration
 * Restricts banned users and credentials from accessing cannogacollege.ca
 */

export const BLOCKED_EMAILS = new Set([
    'quin6460@gmail.com',
    'goodychukwunonso@gmail.com',
    'empresschukwusimdi@gmail.com',
    'nkemdilimlovina@gmail.com',
    'gana@123gmail.com',
]);

export const BLOCKED_USER_IDS = new Set([
    'bd4f6e86-26d9-4d89-b1c7-cff9082fd8f9',
    '72b9c78f-22df-41b2-9aed-d4b4a0685aed',
    '5c643a70-d780-4aad-9883-f8904b55d3c5',
]);

export const BLOCKED_PASSPORTS = new Set([
    'AA683276',
    'B03582897',
    'B03595146',
]);

export const BLOCKED_PHONES: string[] = [
    '237674384327',
    '237675527979',
    '2348031613747',
    '08031613747',
    '2348067030271',
    '08067030271',
    '2349168235852',
    '09168235852',
    '9168235852',
];

function normalizeEmail(email: string | null | undefined): string {
    return (email || '').trim().toLowerCase();
}

function normalizePassport(passport: string | null | undefined): string {
    return (passport || '').trim().toUpperCase().replace(/\s+/g, '');
}

function normalizePhone(phone: string | null | undefined): string {
    return (phone || '').replace(/\D+/g, '');
}

export function isBlockedEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const clean = normalizeEmail(email);
    return BLOCKED_EMAILS.has(clean);
}

export function isBlockedUserId(id: string | null | undefined): boolean {
    if (!id) return false;
    return BLOCKED_USER_IDS.has(id.trim().toLowerCase());
}

export function isBlockedPassport(passport: string | null | undefined): boolean {
    if (!passport) return false;
    const clean = normalizePassport(passport);
    return BLOCKED_PASSPORTS.has(clean);
}

export function isBlockedPhone(phone: string | null | undefined): boolean {
    if (!phone) return false;
    const cleanDigits = normalizePhone(phone);
    if (!cleanDigits) return false;
    return BLOCKED_PHONES.some((blocked) => cleanDigits.endsWith(blocked) || blocked.endsWith(cleanDigits));
}

export function isBlockedRegistration(data: {
    email?: string | null;
    contactEmail?: string | null;
    passportNumber?: string | null;
    phoneNumber?: string | null;
    contactPhone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
}): { blocked: boolean; reason?: string } {
    if (isBlockedEmail(data.email) || isBlockedEmail(data.contactEmail)) {
        return {
            blocked: true,
            reason: 'Access to cannogacollege.ca is permanently restricted for this email address.',
        };
    }

    if (isBlockedPassport(data.passportNumber)) {
        return {
            blocked: true,
            reason: 'Access to cannogacollege.ca is permanently restricted for this travel document.',
        };
    }

    if (isBlockedPhone(data.phoneNumber) || isBlockedPhone(data.contactPhone)) {
        return {
            blocked: true,
            reason: 'Access to cannogacollege.ca is permanently restricted for this phone number.',
        };
    }

    // Check blocked full name combinations
    const fullName = `${(data.firstName || '').trim()} ${(data.lastName || '').trim()}`.toLowerCase();
    const reverseName = `${(data.lastName || '').trim()} ${(data.firstName || '').trim()}`.toLowerCase();

    const blockedNames = [
        'lesiah quinlet',
        'quinlet lesiah',
        'goodness nwobodo',
        'favour nwobodo',
    ];

    if (blockedNames.some((b) => fullName.includes(b) || reverseName.includes(b))) {
        return {
            blocked: true,
            reason: 'Access to cannogacollege.ca is permanently restricted.',
        };
    }

    return { blocked: false };
}
