const { Resend } = require('resend');
const { render } = require('@react-email/render');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' }); // fallback

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
    console.error("No RESEND_API_KEY found in environment variables.");
    process.exit(1);
}

// Simple HTML template for test
const html = `
<!DOCTYPE html>
<html>
<head></head>
<body style="background-color: white; margin: auto; font-family: sans-serif;">
  <div style="border: 1px solid #eaeaea; border-radius: 4px; margin: 40px auto; padding: 20px; width: 465px;">
    <div style="margin-top: 32px;">
      <img src="https://cannogacollege.ca/images/logo-cannoga.png" width="120" height="120" alt="Cannoga College" style="margin: 0 auto;" />
    </div>

    <h1 style="color: black; font-size: 24px; font-weight: normal; text-align: center; padding: 0; margin: 30px 0;">Invoice Ready for Payment</h1>

    <p style="color: black; font-size: 14px; line-height: 24px;">Dear Test Student,</p>

    <p style="color: black; font-size: 14px; line-height: 24px;">Your tuition deposit invoice for the Bachelor of Computer Science programme has been generated and is now ready for payment.</p>

    <div style="background-color: #f5f5f5; border-radius: 8px; padding: 24px; margin: 32px 0; border: 1px solid #f5f5f5;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <p style="color: #737373; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Invoice Type</p>
        <p style="color: black; font-size: 14px; font-weight: bold; margin: 0;">TUITION DEPOSIT</p>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <p style="color: #737373; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Amount Due</p>
        <p style="color: black; font-size: 18px; font-weight: 900; margin: 0;">CAD 2,500</p>
      </div>
    </div>

    <p style="color: black; font-size: 14px; line-height: 24px;">Please proceed to your student portal to complete the payment and secure your place in the programme.</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://cannogacollege.ca/portal/application/payment" style="background-color: #000000; border-radius: 4px; color: white; font-size: 12px; font-weight: 600; text-decoration: none; text-align: center; padding: 12px 20px;">Pay Invoice</a>
    </div>

    <hr style="border: 1px solid #eaeaea; margin: 26px 0; width: 100%;" />

    <p style="color: #666666; font-size: 12px; line-height: 24px;">If you have any questions, please contact our admissions team.</p>
    <p style="color: #666666; font-size: 12px; line-height: 24px;">Finance Department, Cannoga College.</p>
  </div>
</body>
</html>
`;

async function sendTestEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Cannoga College <admissions@cannogacollege.ca>',
            to: ['unlymitedsoundz@gmail.com'],
            subject: 'Test Invoice Ready for Payment',
            html: html,
        });

        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', data);
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

sendTestEmail();

