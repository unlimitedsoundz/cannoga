
import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Img,
    Heading,
    Text,
    Hr,
    Link,
    Tailwind,
} from '@react-email/components';

interface AdminPaymentNotificationEmailProps {
    studentName: string;
    studentId?: string;
    paymentType: 'TUITION' | 'HOUSING' | 'DEPOSIT';
    amount: number;
    currency: string;
    transactionId: string;
    description: string;
}

export default function AdminPaymentNotificationEmail({
    studentName = 'John Doe',
    studentId = 'N/A',
    paymentType = 'TUITION',
    amount = 0,
    currency = 'CAD',
    transactionId = 'TXN-000',
    description = 'Tuition Fee Payment',
}: AdminPaymentNotificationEmailProps) {
    const previewText = `Payment Confirmed: ${currency} ${amount} received from ${studentName}.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-[20px] mx-auto px-[15px] py-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://cannogacollege.ca/images/logo-cannoga.png"
                                width="80"
                                height="80"
                                alt="Cannoga College"
                                className="my-0 mx-auto dark:invert"
                            />
                        </Section>

                        <Heading className="text-black text-[20px] font-bold text-center p-0 my-[30px] mx-0 uppercase tracking-tighter">
                            Payment Notification
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            A successful payment has been recorded in the system.
                        </Text>

                        <Section className="bg-blue-50 rounded-lg p-6 my-6 border border-blue-100">
                            <Text className="text-blue-700 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">From</Text>
                            <Text className="text-black text-[16px] font-bold my-0 mb-4">{studentName} {studentId !== 'N/A' ? `(${studentId})` : ''}</Text>

                            <Text className="text-blue-700 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Type</Text>
                            <Text className="text-black text-[14px] font-bold my-0 mb-4">{paymentType}</Text>

                            <Text className="text-blue-700 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Amount</Text>
                            <Text className="text-black text-[18px] font-black my-0 mb-4">{currency} {amount.toLocaleString()}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Description</Text>
                            <Text className="text-black text-[12px] my-0 mb-4">{description}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Transaction ID</Text>
                            <Text className="text-black text-[10px] font-mono my-0">{transactionId}</Text>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>

                        <Text className="text-[#666666] text-[10px] uppercase font-bold tracking-widest leading-[24px]">
                            Internal Notification Service — Cannoga College
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}




