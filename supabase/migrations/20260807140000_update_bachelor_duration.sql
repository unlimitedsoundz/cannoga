-- Update Bachelor's Degree program duration from 3 Years to 4 Years and credits to 90

UPDATE public."Course"
SET 
  duration = '4 Years',
  credits = 90,
  updated_at = NOW()
WHERE "degreeLevel" = 'BACHELOR'
  AND (duration = '3 Years' OR duration = '3 year' OR credits = 90);
