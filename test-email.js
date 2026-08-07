import { sendEmail } from './src/lib/email';
import InvoiceReadyEmail from './src/emails/InvoiceReadyEmail';

async function testInvoiceEmail() {
    const result = await sendEmail({
        to: 'unlymitedsoundz@gmail.com',
        subject: 'Test Invoice Ready for Payment',
        react: InvoiceReadyEmail({
            firstName: 'Test Student',
            courseTitle: 'Bachelor of Computer Science',
            amount: 2500,
            currency: 'CAD',
            invoiceType: 'TUITION DEPOSIT'
        }),
    });

    console.log('Email send result:', result);
}

testInvoiceEmail();