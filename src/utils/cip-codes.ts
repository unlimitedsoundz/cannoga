/**
 * Canadian Classification of Instructional Programs (CIP) 2021
 * Statistics Canada official educational classification.
 * Format: "XX.XXXX" (e.g. "52.0301" for Accounting)
 */

export function assignCIPCode(title: string, degreeLevel?: string): string {
    const t = (title || '').toLowerCase();

    // ── Accounting / Finance / Business Law ──────────────────────────────────
    if ((t.includes('accounting') && t.includes('payroll')) || t.includes('payroll'))
        return '52.0301'; // Accounting
    if (t.includes('accounting') && t.includes('business law'))
        return '52.0301'; // Accounting & Business Law
    if (t.includes('accounting') && t.includes('finance') && !t.includes('advanced'))
        return '52.0302'; // Accounting and Finance
    if (t.includes('accounting') && t.includes('finance') && t.includes('advanced'))
        return '52.0302'; // Advanced Diploma Accounting & Finance
    if (t.includes('accounting fundamentals') || (t.includes('accounting') && t.includes('certificate')))
        return '52.0301'; // Accounting Fundamentals
    if (t.includes('accounting') && !t.includes('finance') && !t.includes('law') && !t.includes('payroll'))
        return '52.0301'; // General accounting
    if (t.includes('bsc accounting') && t.includes('business law'))
        return '52.0301';
    if (t.includes('bsc accounting') && t.includes('finance'))
        return '52.0302';

    // ── Business Administration / Management ─────────────────────────────────
    if (t.includes('business administration') && (t.includes('bachelor') || t.includes('bba')))
        return '52.0201'; // BBA
    if (t.includes('business administration') && t.includes('executive'))
        return '52.0201';
    if (t.includes('business administration'))
        return '52.0201'; // Diploma/Advanced Diploma BAdmin
    if (t.includes('business management') && t.includes('bachelor'))
        return '52.0201';
    if (t.includes('business management') && t.includes('digital'))
        return '52.1201'; // Digital Business Management
    if (t.includes('business management'))
        return '52.0201';
    if (t.includes('business foundations'))
        return '52.0101'; // Business (general)
    if (t.includes('management studies') && t.includes('advanced'))
        return '52.0201';
    if (t.includes('management studies'))
        return '52.0201';
    if (t.includes('management') && t.includes('strategy') && t.includes('finance'))
        return '52.0801'; // Strategic Management & Finance
    if (t.includes('strategic management'))
        return '52.0201';
    if (t.includes('global business') || t.includes('international business'))
        return '52.1101';
    if (t.includes('management') && !t.includes('supply') && !t.includes('project') && !t.includes('hospitality') && !t.includes('tourism') && !t.includes('culinary') && !t.includes('aviation') && !t.includes('information') && !t.includes('event') && !t.includes('human') && !t.includes('financial') && !t.includes('industrial') && !t.includes('environmental') && !t.includes('operations') && !t.includes('service') && !t.includes('retail'))
        return '52.0201';

    // ── Finance ──────────────────────────────────────────────────────────────
    if (t.includes('financial services'))
        return '52.0801';
    if (t.includes('finance') && !t.includes('accounting') && !t.includes('agri'))
        return '52.0801';

    // ── Marketing ────────────────────────────────────────────────────────────
    if (t.includes('marketing') && t.includes('innovation'))
        return '52.1401';
    if (t.includes('marketing essentials') || (t.includes('marketing') && t.includes('certificate')))
        return '52.1401';
    if (t.includes('social media marketing') || t.includes('marketing'))
        return '52.1401';

    // ── Human Resources ──────────────────────────────────────────────────────
    if (t.includes('human resource') || t.includes('human resources'))
        return '52.1001';

    // ── Project Management ───────────────────────────────────────────────────
    if (t.includes('project management'))
        return '52.2101';

    // ── Entrepreneurship / Innovation ────────────────────────────────────────
    if (t.includes('entrepreneurship'))
        return '52.0701';

    // ── Supply Chain / Logistics ─────────────────────────────────────────────
    if (t.includes('supply chain') || t.includes('logistics') || t.includes('operations'))
        return '52.1801';

    // ── Hospitality / Tourism / Culinary ─────────────────────────────────────
    if (t.includes('culinary management'))
        return '52.1903';
    if (t.includes('culinary skills') || t.includes('baking') || t.includes('pastry'))
        return '12.0503';
    if (t.includes('hospitality') || t.includes('hotel'))
        return '52.1903';
    if (t.includes('tourism'))
        return '52.1902';
    if (t.includes('event planning'))
        return '52.1904';

    // ── Computer Science / Software ──────────────────────────────────────────
    if (t.includes('computer science'))
        return '11.0701';
    if (t.includes('software engineering'))
        return '14.0903';
    if (t.includes('software development') || t.includes('software testing') || t.includes('computer programming'))
        return '11.0201';
    if (t.includes('computer systems'))
        return '11.0501';
    if (t.includes('web development') || t.includes('web application') || t.includes('interactive media'))
        return '11.0801';
    if (t.includes('cloud computing'))
        return '11.1003';
    if (t.includes('information technology networking') || t.includes('it networking'))
        return '11.0901';
    if (t.includes('information technology') && !t.includes('information and service'))
        return '11.0401';

    // ── Cybersecurity ────────────────────────────────────────────────────────
    if (t.includes('cybersecurity') || t.includes('cyber security'))
        return '11.1003';

    // ── Artificial Intelligence / Data Science ───────────────────────────────
    if (t.includes('artificial intelligence') || t.includes('data science') || t.includes('big analytics'))
        return '11.0102';
    if (t.includes('data analytics'))
        return '11.0901';

    // ── Information Systems ──────────────────────────────────────────────────
    if (t.includes('information systems'))
        return '52.1201';
    if (t.includes('information and service management') || t.includes('information and communications'))
        return '11.0501';

    // ── Engineering ──────────────────────────────────────────────────────────
    if (t.includes('civil engineering') && !t.includes('technician'))
        return '14.0801';
    if (t.includes('civil engineering technician') || t.includes('civil engineering tech') || t.includes('construction engineering'))
        return '15.0201';
    if (t.includes('electrical engineering') && !t.includes('technician'))
        return '14.1001';
    if (t.includes('electrical engineering technician') || t.includes('electrical engineering tech') || t.includes('electrical techniques'))
        return '15.0303';
    if (t.includes('mechanical engineering') && !t.includes('technician'))
        return '14.1901';
    if (t.includes('mechanical engineering technician') || t.includes('mechanical engineering tech') || t.includes('mechanical technician') || t.includes('mechanical foundations'))
        return '15.0805';
    if (t.includes('chemical') && !t.includes('technician'))
        return '14.0701';
    if (t.includes('electronics') && t.includes('nanoengineering'))
        return '14.1001';
    if (t.includes('industrial engineering'))
        return '14.3501';
    if (t.includes('robotics') || t.includes('mechatronics'))
        return '15.0405';
    if (t.includes('automation'))
        return '15.0406';
    if (t.includes('welding'))
        return '48.0508';
    if (t.includes('carpentry'))
        return '46.0201';

    // ── Architecture / Design ────────────────────────────────────────────────
    if (t.includes('bachelor of architecture') || (t.includes('architecture') && t.includes('b.arch')))
        return '04.0201';
    if (t.includes('architectural technology') || t.includes('architectural tech') || t.includes('urban planning') || t.includes('smart city'))
        return '04.0301';
    if (t.includes('interior design') || (t.includes('design') && !t.includes('graphic') && !t.includes('product')))
        return '50.0408';
    if (t.includes('graphic design'))
        return '50.0409';
    if (t.includes('industrial') && t.includes('product design'))
        return '50.0411';

    // ── Arts / Media / Film ──────────────────────────────────────────────────
    if (t.includes('film') || t.includes('television') || t.includes('broadcasting'))
        return '50.0602';
    if (t.includes('art and media') || t.includes('art media'))
        return '50.0101';
    if (t.includes('fine arts'))
        return '50.0702';
    if (t.includes('animation'))
        return '50.0411';
    if (t.includes('digital photography'))
        return '50.0605';

    // ── Health Sciences ──────────────────────────────────────────────────────
    if (t.includes('nursing') && (t.includes('bscn') || t.includes('bachelor')))
        return '51.1613';
    if (t.includes('practical nursing') || t.includes('nursing'))
        return '51.1601';
    if (t.includes('dental hygiene'))
        return '51.0602';
    if (t.includes('pharmacy technician'))
        return '51.2002';
    if (t.includes('physiotherapist assistant') || t.includes('occupational therapist assistant'))
        return '51.0806';
    if (t.includes('personal support worker') || t.includes('community support worker'))
        return '51.2601';
    if (t.includes('medical office administration'))
        return '51.0710';
    if (t.includes('mental health') || t.includes('addictions'))
        return '51.1502';
    if (t.includes('global health') || t.includes('public health'))
        return '51.2201';
    if (t.includes('health sciences'))
        return '51.0000';
    if (t.includes('health care administration') || t.includes('health admin'))
        return '51.0701';
    if (t.includes('kinesiology'))
        return '31.0505';
    if (t.includes('biomedical') || t.includes('biotechnology'))
        return '26.0102';

    // ── Social Sciences / Education / Law ────────────────────────────────────
    if (t.includes('social work') && t.includes('bachelor'))
        return '44.0701';
    if (t.includes('social work') || t.includes('social service'))
        return '44.0799';
    if (t.includes('community and justice') || t.includes('community services'))
        return '43.0103';
    if (t.includes('child and youth') || t.includes('child youth'))
        return '19.0709';
    if (t.includes('early childhood education'))
        return '13.1210';
    if (t.includes('educational assistant'))
        return '13.1099';
    if (t.includes('paralegal') || t.includes('legal studies'))
        return '22.0302';
    if (t.includes('psychology'))
        return '42.0101';
    if (t.includes('sociology'))
        return '45.1101';
    if (t.includes('economics'))
        return '45.0601';
    if (t.includes('public policy') || t.includes('governance') || t.includes('international affairs'))
        return '44.0401';

    // ── Sciences ─────────────────────────────────────────────────────────────
    if (t.includes('chemistry'))
        return '40.0501';
    if (t.includes('physics'))
        return '40.0801';
    if (t.includes('mathematics'))
        return '27.0101';
    if (t.includes('environmental science') || (t.includes('environmental') && t.includes('sustainability')))
        return '03.0103';
    if (t.includes('environmental technician') || t.includes('environmental management'))
        return '03.0101';
    if (t.includes('horticulture'))
        return '01.0601';
    if (t.includes('agriculture'))
        return '01.0000';

    // ── Aviation / Transportation ─────────────────────────────────────────────
    if (t.includes('aviation') || t.includes('flight'))
        return '49.0101';
    if (t.includes('aircraft maintenance'))
        return '47.0608';
    if (t.includes('automotive'))
        return '47.0604';

    // ── General Fallback ─────────────────────────────────────────────────────
    return '52.0201';
}

export function getCIPCode(course?: {
    cip_code?: string | null;
    code?: string | null;
    title?: string;
    degreeLevel?: string;
} | null): string {
    if (!course) return '52.0201';
    if (course.cip_code && course.cip_code.trim()) {
        return course.cip_code.trim();
    }
    return assignCIPCode(course.title || '', course.degreeLevel);
}
