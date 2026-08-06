
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

interface PaymentConfirmationEmailProps {
    firstName: string;
    courseTitle: string;
    amount: number;
    currency: string;
    transactionId: string;
}

export default function PaymentConfirmationEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    amount = 0,
    currency = 'CAD',
    transactionId = 'TXN-000000',
}: PaymentConfirmationEmailProps) {
    const previewText = `Payment Received: Your tuition for ${courseTitle} has been successfully processed.`;

    const getCurrencySymbol = (code: string): string => {
        const symbols: Record<string, string> = {
            'CAD': '$',
            'USD': '$',
            'NGN': '₦',
            'GBP': '£',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr',
            'FCFA': 'FCFA',
        };
        return symbols[code.toUpperCase()] || code;
    };

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

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Payment Confirmation
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            This is to confirm that we have successfully received your tuition payment for the <strong>{courseTitle}</strong> programme.
                        </Text>

                        <Section className="my-8">
                            <div className="flex justify-between items-center mb-3" style={{ gap: '24px' }}>
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Amount Paid</Text>
                                <Text className="text-black text-[14px] font-bold my-0">{getCurrencySymbol('CAD')} {amount.toLocaleString()}</Text>
                            </div>
                            <div className="flex justify-between items-center" style={{ gap: '24px' }}>
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Transaction ID</Text>
                                <Text className="text-black text-[10px] font-mono my-0">{transactionId}</Text>
                            </div>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your payment has been received and is being verified. Once verified, you will gain access to the student portal where you can view your Letter of Acceptance and tuition receipt.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://cannogacollege.ca/portal/dashboard"
                            >
                                View Dashboard
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        
                        <Section className="text-center">
                            <Text className="text-black text-[10px] font-bold uppercase tracking-widest my-0">
                                Powered by Flywire
                            </Text>
                            <Text className="text-[#888888] text-[8px] uppercase tracking-wider my-1">
                                Copyright ©Flywire. 2009-2026 All rights reserved.
                            </Text>
                            <Text className="text-[#888888] text-[8px] uppercase tracking-wider my-0">
                                Flywire is a trademark of Flywire Corporation.
                            </Text>
                        </Section>

                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Thank you for your prompt payment.
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Finance Department, Cannoga College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}





