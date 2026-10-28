-- Update Personal Support Worker from Certificate to Diploma
UPDATE "Course"
SET 
    "degreeLevel" = 'DIPLOMA',
    "duration" = '2 Years',
    "credits" = 60,
    "slug" = 'personal-support-worker-diploma',
    "updatedAt" = NOW()
WHERE "slug" = 'personal-support-worker-cert' OR "id" = '162707d8-b8c9-4064-aba0-0abf83afb717';

