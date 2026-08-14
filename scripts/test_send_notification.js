const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const recipientEmail = 'unlymitedsoundz@gmail.com';

async function runEdgeFunctionNotificationTests() {
    console.log(`Sending edge function notification tests to ${recipientEmail}...`);
    
    const functionUrl = `${supabaseUrl}/functions/v1/send-notification`;
    
    // Test 1: Application Received Notification
    const submissionPayload = {
        type: 'INSERT',
        table: 'applications',
        record: {
            id: 'app-' + Date.now(),
            first_name: 'Unlymited',
            last_name: 'Soundz',
            email: recipientEmail,
            course_title: 'Ontario College Diploma in Software Engineering',
            course_degree_level: 'DIPLOMA',
            status: 'submitted',
            created_at: new Date().toISOString()
        }
    };

    try {
        console.log('1. Dispatching Application Submission Notification...');
        const res1 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(submissionPayload)
        });
        const data1 = await res1.json();
        console.log('Submission Notification Result:', res1.status, JSON.stringify(data1));
    } catch (err) {
        console.error('Error sending submission notification:', err);
    }

    // Test 2: Admission Offer Issued Notification
    const offerPayload = {
        type: 'UPDATE',
        table: 'applications',
        record: {
            id: 'app-' + Date.now(),
            first_name: 'Unlymited',
            last_name: 'Soundz',
            email: recipientEmail,
            course_title: 'Bachelor of Computer Science & Artificial Intelligence',
            course_degree_level: 'BACHELOR',
            status: 'OFFER_ISSUED',
            updated_at: new Date().toISOString()
        },
        old_record: {
            status: 'submitted'
        }
    };

    try {
        console.log('2. Dispatching Offer Issued Notification...');
        const res2 = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceKey}`
            },
            body: JSON.stringify(offerPayload)
        });
        const data2 = await res2.json();
        console.log('Offer Issued Notification Result:', res2.status, JSON.stringify(data2));
    } catch (err) {
        console.error('Error sending offer notification:', err);
    }
}

runEdgeFunctionNotificationTests();
