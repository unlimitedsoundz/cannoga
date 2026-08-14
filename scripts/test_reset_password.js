const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const recipientEmail = 'unlymitedsoundz@gmail.com';

const supabase = createClient(supabaseUrl, anonKey);

async function testPasswordReset() {
    console.log(`Triggering Supabase password reset email for: ${recipientEmail}...`);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(recipientEmail, {
        redirectTo: 'https://cannogacollege.ca/auth/reset-password',
    });

    if (error) {
        console.error('Error triggering password reset:', error);
    } else {
        console.log('Password reset request sent successfully! Check inbox for unlymitedsoundz@gmail.com.');
        console.log('Result data:', data);
    }
}

testPasswordReset();
