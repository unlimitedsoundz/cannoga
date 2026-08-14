const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' }); // fallback

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
    console.error("No RESEND_API_KEY found in environment variables.");
    process.exit(1);
}

const emails = [
    "pethmath2016@gmail.com",
    "maxwellduodu7950@gmail.com",
    "theophilusgodsent@gmail.com",
    "adegbemigunilerioluwa1805@gmail.com",
    "imanatuesophia@gmail.com",
    "omoefewealth001200@gmail.com",
    "unlymitedsoundz@gmail.com",
    "adeyasalu672@gmail.com"
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penkka University Newsletter</title>
</head>

<body style="margin:0; padding:0; background-color:#f8f9fa; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a;">

    <table width="100%" bgcolor="#f8f9fa" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
        <tr>
            <td align="center">

                <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="margin:0 auto; border-radius:4px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #eeeeee;">

                    <!-- HEADER / LOGO -->
                    <tr>
                        <td style="background:#ffffff; padding:30px; text-align:center; border-bottom: 1px solid #eeeeee;">
                            <img src="https://penkka.fi/logo-penkka.png" width="160" alt="Penkka University" style="display: block; margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- HERO IMAGE -->
                    <tr>
                        <td style="padding:0;">
                            <img src="https://penkka.fi/images/international-students.png" width="600" alt="International Students at Penkka University" style="display: block; width: 100%; height: auto;">
                        </td>
                    </tr>

                    <!-- HERO TEXT -->
                    <tr>
                        <td style="padding:40px 40px 20px 40px;">
                            <h2 style="margin-top:0; font-size: 26px; font-weight: 600; color: #000000; line-height: 1.2;">Your Journey to Study in Canada Starts Here</h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #444444;">
                                We are pleased to welcome you to the Penkka University community. This newsletter serves to provide you with critical updates, upcoming deadlines, and the necessary next steps for your official admission process.
                            </p>
                        </td>
                    </tr>

                    <!-- IMPORTANT UPDATE -->
                    <tr>
                        <td style="padding:30px 40px; background:#fafafa; border-left: 4px solid #000000;">
                            <h3 style="margin-top:0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #000000;">Important Update</h3>
                            <p style="font-size: 15px; line-height: 1.5; color: #333333; margin-bottom: 0;">
                                The August 2026 intake is approaching capacity and will be closing shortly. To ensure your placement, please complete your application, formally accept your offer, and finalize your tuition payment.
                            </p>
                        </td>
                    </tr>

                    <!-- CTA BUTTON -->
                    <tr>
                        <td align="center" style="padding:40px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" bgcolor="#000000" style="border-radius: 2px;">
                                        <a href="https://penkka.fi/portal" target="_blank" style="font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 16px 35px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                                            Access Your Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- STUDENT COMMUNITY -->
                    <tr>
                        <td style="padding:0 40px 40px 40px; text-align: center;">
                            <h3 style="font-size: 18px; color: #000000; margin-bottom: 10px; margin-top: 0;">Official Student Community</h3>
                            <p style="font-size: 15px; line-height: 1.6; color: #444444; margin-bottom: 20px;">
                                Engage with fellow students and ambassadors through our dedicated communication platform for real-time support and peer networking.
                            </p>
                            <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center" bgcolor="#000000" style="border-radius: 2px;">
                                        <a href="https://students.penkka.fi/" target="_blank" style="font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 16px 35px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
                                            Student Community
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- NEXT STEPS -->
                    <tr>
                        <td style="padding:30px 40px; background:#000000; color: #ffffff;">
                            <h3 style="margin-top:0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Required Actions</h3>
                            <ul style="padding-left: 20px; font-size: 15px; line-height: 2; margin-bottom: 0;">
                                <li>Review and accept your formal admission offer</li>
                                <li>Finalize the required tuition deposit</li>
                                <li>Download your official admission and visa support letters</li>
                                <li>Initiate the Canadian study permit application process</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="padding:40px; text-align:center; color: #888888; font-size: 12px;">
                            <p style="margin:0; font-weight: bold; color: #333333; text-transform: uppercase; letter-spacing: 1px;">Penkka University</p>
                            <p style="margin:10px 0;">Admissions Office: admissions@cannogacollege.ca</p>
                            <div style="margin:20px 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                                <a href="https://penkka.fi" style="color:#333333; text-decoration: none; margin: 0 10px;">Website</a>
                                <span style="color: #dddddd;">|</span>
                                <a href="https://penkka.fi/privacy" style="color:#333333; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                            </div>
                            <p style="margin:0;">&copy; 2026 Penkka University. All rights reserved.</p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;

async function sendBatch() {
    console.log("Starting email delivery to", emails.length, "recipients...");
    for (const email of emails) {
        try {
            const data = await resend.emails.send({
                from: "Penkka University <admissions@cannogacollege.ca>",
                to: [email],
                subject: "Important Update: August 2026 Intake & Next Steps",
                html: htmlContent
            });
            console.log(`✅ Sent to ${email}: `, data);
        } catch (error) {
            console.error(`❌ Failed to send to ${email}: `, error);
        }
    }
    console.log("Finished sending process.");
}

sendBatch();
