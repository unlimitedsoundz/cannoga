const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://storage.googleapis.com/firecrawl-scrape-media/screenshot-7d731953-3468-41c6-8a74-c85ec4572332.png?GoogleAccessId=scrape-bucket-accessor%40firecrawl.iam.gserviceaccount.com&Expires=1781347697&Signature=NHx7NfhnGEXEYLerZ1R36Ke0ZW0g8keLrfOCD6WV5m2sYUg155pozWw4LcMlmFDGbQNy89cRjU5qDZLJmB2S84elVlYE5hrvUbksShVAWVXdufXlM8fJTCTzX%2FfDHNkWDECOevidtldX8lUttgwHm7mhbTkioBGp0Imk%2BhHMnoUBf6G40x%2FUmxJLdN2tNt3XnyOWIzp4sgnD3ccjymGJxh8Ob3z2rfhSvrsLDcA5q5Q%2FzlLwhOY9cp3gTaHkFVO3uodpHaDlZkBQDix34gthYCUtIjUc%2Bdh2Ca3Op0dhA7JwOUJ0yoyjRR%2FKOL6un2uQ48hb%2Fw22Ezk4b42asbdzlw%3D%3D';
const dest = path.join(__dirname, 'screenshot.png');

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete!');
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading:', err.message);
});
