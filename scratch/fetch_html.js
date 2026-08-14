const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://ourblogs.penkka.fi/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync(path.join(__dirname, 'blog_raw.html'), data);
    console.log('HTML saved to blog_raw.html');
  });
}).on('error', (err) => {
  console.error('Error fetching URL:', err.message);
});
