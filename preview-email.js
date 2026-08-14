import { render } from '@react-email/render';
import InvoiceReadyEmail from './src/emails/InvoiceReadyEmail';

const html = render(InvoiceReadyEmail({
    firstName: 'John',
    courseTitle: 'Bachelor of Computer Science',
    amount: 2500,
    currency: 'CAD',
    invoiceType: 'TUITION DEPOSIT'
}));

console.log(html);