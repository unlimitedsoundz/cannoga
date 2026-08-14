const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const recipientEmail = 'unlymitedsoundz@gmail.com';

async function testResendEmailDispatch() {
    console.log(`Testing Resend email dispatch to: ${recipientEmail}`);
    const functionUrl = `${supabaseUrl}/functions/v1/send-notification`;

    // Test Payload 1: Direct APPLICATION_SUBMITTED type
    const payload1 = {
        type: 'APPLICATION_SUBMITTED',
        table: 'applications',
        record: {
            id: 'app-' + Date.now(),
            first_name: 'Unlymited',
            last_name: 'Soundz',
            email: recipientEmail,
            course_title: 'Ontario College Diploma in Software Engineering',
            course_degree_level: 'DIPLOMA',
            status: 'SUBMITTED'
        }
    };

    // Test Payload 2: Direct OFFER_LETTER_READY type
    const payload2 = {
        type: 'OFFER_LETTER_READY',
        table: 'applications',
        record: {
            id: 'app-' + Date.now(),
            first_name: 'Unlymited',
            last_name: 'Soundz',
            email: recipientEmail,
            course_title: 'Bachelor of Computer Science & AI',
            course_degree_level: 'BACHELOR',
            intake: 'Fall 2026',
            status: 'OFFER_ISSUED'
        }
    };

    try {
        console.log('Sending Test 1 (Application Submitted Email)...');
        const res1 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload1)
        });
        const data1 = await res1.json();
        console.log('Test 1 Response:', res1.status, JSON.stringify(data1, null, 2));

        console.log('Sending Test 2 (Admission Offer Email)...');
        const res2 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload2)
        });
        const data2 = await res2.json();
        console.log('Test 2 Response:', res2.status, JSON.stringify(data2, null, 2));

    } catch (err) {
        console.error('Error triggering edge function:', err);
    }
}

testResendEmailDispatch();
