-- Update the access_url and description in it_assets to point to Penkka
UPDATE it_assets
SET 
  access_url = REPLACE(REPLACE(access_url, 'penkka.edu', 'penkkauniversity.com'), 'penkka', 'penkka'),
  description = REPLACE(REPLACE(description, 'penkka.edu', 'penkkauniversity.com'), 'penkka', 'penkka')
WHERE 
  access_url LIKE '%penkka%' OR description LIKE '%penkka%';
