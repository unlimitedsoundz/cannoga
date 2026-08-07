const https = require('https');

https.get('https://ourblogs.penkka.fi/css/output.css?v=0.19262391239009102', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('First 50 chars of body:', JSON.stringify(body.substring(0, 50)));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
