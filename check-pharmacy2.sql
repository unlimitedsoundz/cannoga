SELECT id, name, code FROM public."Subject" 
WHERE name LIKE '%Pharmacology%' OR name LIKE '%Pharmacy%' OR name LIKE '%Drug%' OR name LIKE '%Health%'
ORDER BY name;
