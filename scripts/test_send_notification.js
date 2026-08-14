const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testOfferNotification() {
    console.log('Testing OFFER_ISSUED notification request to Edge Function...');
    
    const functionUrl = `${supabaseUrl}/functions/v1/send-notification`;
    
    const payload = {
        type: 'UPDATE',
        table: 'applications',
        record: {
            id: 'test-app-' + Date.now(),
            first_name: 'Alex',
            last_name: 'Morgan',
            email: 'cannogacollege@gmail.com',
            course_title: 'Bachelor of Computer Science',
            course_degree_level: 'BACHELOR',
            status: 'OFFER_ISSUED',
            updated_at: new Date().toISOString()
        },
        old_record: {
            status: 'submitted'
        }
    };

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error invoking function:', err);
    }
}

testOfferNotification();
