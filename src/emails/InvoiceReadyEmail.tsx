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

interface InvoiceReadyEmailProps {
    firstName: string;
    courseTitle: string;
    amount: number;
    currency: string;
    invoiceType: string;
}

export default function InvoiceReadyEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    amount = 0,
    currency = 'CAD',
    invoiceType = 'TUITION DEPOSIT',
}: InvoiceReadyEmailProps) {
    const previewText = `Your ${invoiceType.toLowerCase()} invoice is ready for payment.`;

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
                            Invoice Ready for Payment
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your {invoiceType.toLowerCase()} invoice for the <strong>{courseTitle}</strong> programme has been generated and is now ready for payment.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-8 border border-neutral-100">
                            <div className="flex justify-between mb-2">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Invoice Type</Text>
                                <Text className="text-black text-[14px] font-normal my-0">{invoiceType}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Amount Due</Text>
                                <Text className="text-black text-[18px] font-black my-0">{currency} {amount.toLocaleString()}</Text>
                            </div>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Please proceed to your student portal to complete the payment and secure your place in the programme.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://cannogacollege.ca/portal/application/payment"
                            >
                                Pay Tuition
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
                            If you have any questions, please contact our admissions team.
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





