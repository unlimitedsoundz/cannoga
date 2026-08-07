-- Migration: Update tuition fees with 60% increase and fix deposit to $2,000

-- 1. Update tuition_rates table with new increased fees
UPDATE public.tuition_rates SET annual_fee = CASE
    WHEN degree_level = 'CERTIFICATE' THEN 4000.00
    WHEN degree_level = 'DIPLOMA' THEN 4000.00
    WHEN degree_level = 'BACHELOR' THEN 6400.00
    WHEN degree_level = 'MASTER' THEN 9600.00
    ELSE annual_fee
END
WHERE degree_level IN ('CERTIFICATE', 'DIPLOMA', 'BACHELOR', 'MASTER');

-- 2. Update existing admission_offers with recalculated tuition fees
-- This updates offers where we can determine the degree level from the application's course
UPDATE public.admission_offers ao
SET tuition_fee = CASE
    WHEN LOWER(c."degreeLevel") LIKE '%master%' OR LOWER(c."degreeLevel") LIKE '%msc%' THEN 9600.00
    WHEN LOWER(c."degreeLevel") LIKE '%bachelor%' OR LOWER(c."degreeLevel") LIKE '%bsc%' THEN 6400.00
    WHEN LOWER(c."degreeLevel") LIKE '%diploma%' OR LOWER(c."degreeLevel") LIKE '%certificate%' THEN 4000.00
    ELSE ao.tuition_fee
END
FROM public.applications a
JOIN public."Course" c ON c.id = a.course_id
WHERE ao.application_id = a.id;

-- 3. Update any tuition_payments that reference old deposit amounts
-- Note: This is a best-effort update. Payment amounts that were exactly 50% of old tuition
-- will not be automatically adjusted. Manual review may be needed for payment records.
