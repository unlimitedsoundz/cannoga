const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-admission-letter`;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function trigger(type) {
  console.log(`Triggering ${type} letter for app: 032d3d84-ca9b-4cd6-a20d-78e1a93409d2...`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      applicationId: '032d3d84-ca9b-4cd6-a20d-78e1a93409d2',
      type: type
    })
  });

  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
}

async function run() {
    await trigger('OFFER');
    // await trigger('ADMISSION'); // This might fail if no payment exists
}

run();
