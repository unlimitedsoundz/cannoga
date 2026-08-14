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

        // Test Payload 3: Direct OFFER_ACCEPTED type
        const payload3 = {
            type: 'OFFER_ACCEPTED',
            table: 'applications',
            record: {
                id: 'app-' + Date.now(),
                first_name: 'Unlymited',
                last_name: 'Soundz',
                email: recipientEmail,
                course_title: 'Bachelor of Computer Science & AI',
                course_degree_level: 'BACHELOR',
                intake: 'Fall 2026',
                status: 'OFFER_ACCEPTED'
            }
        };

        console.log('Sending Test 3 (Offer Accepted Email)...');
        const res3 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload3)
        });
        const data3 = await res3.json();
        console.log('Test 3 Response:', res3.status, JSON.stringify(data3, null, 2));

        // Test Payload 4: Direct USER_REGISTRATION type
        const payload4 = {
            type: 'USER_REGISTRATION',
            table: 'profiles',
            record: {
                id: 'usr-' + Date.now(),
                first_name: 'Unlymited',
                last_name: 'Soundz',
                email: recipientEmail
            }
        };

        console.log('Sending Test 4 (User Registration Welcome Email)...');
        const res4 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload4)
        });
        const data4 = await res4.json();
        console.log('Test 4 Response:', res4.status, JSON.stringify(data4, null, 2));

        // Test Payload 5: Direct TUITION_PAYMENT_VERIFIED type
        const payload5 = {
            type: 'TUITION_PAYMENT_VERIFIED',
            table: 'tuition_payments',
            record: {
                id: 'pay-' + Date.now(),
                amount: 2000,
                currency: 'CAD',
                transaction_reference: 'TXN-998822',
                status: 'VERIFIED'
            },
            applicationData: {
                id: 'app-' + Date.now(),
                first_name: 'Unlymited',
                last_name: 'Soundz',
                email: recipientEmail,
                course_title: 'Bachelor of Computer Science & AI'
            }
        };

        console.log('Sending Test 5 (Tuition Payment Verified Email with Receipt)...');
        const res5 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(payload5)
        });
        const data5 = await res5.json();
        console.log('Test 5 Response:', res5.status, JSON.stringify(data5, null, 2));

    } catch (err) {
        console.error('Error triggering edge function:', err);
    }
}

testResendEmailDispatch();
