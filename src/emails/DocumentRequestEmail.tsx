
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

interface DocumentRequestEmailProps {
    firstName: string;
    courseTitle: string;
    requestedDocuments: string[];
    note?: string | null;
}

export default function DocumentRequestEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    requestedDocuments = [],
    note = '',
}: DocumentRequestEmailProps) {
    const previewText = `Action Required: Additional documents requested for your application to ${courseTitle}.`;

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
                            Action Required: Documents Requested
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            The admissions team has reviewed your application for <strong>{courseTitle}</strong> and requires additional information to proceed.
                        </Text>

                        {note && (
                            <Section className="bg-[#f9f9f9] p-[20px] rounded my-[20px] border border-solid border-[#eaeaea]">
                                <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold mb-[10px] leading-none">
                                    Message from Admissions:
                                </Text>
                                <Text className="text-black text-[14px] leading-[24px] m-0">
                                    "{note}"
                                </Text>
                            </Section>
                        )}

                        {requestedDocuments.length > 0 && (
                            <Section className="my-[20px]">
                                <Text className="text-black text-[14px] font-bold mb-[10px]">
                                    Required Documents:
                                </Text>
                                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                                    {requestedDocuments.map((doc) => (
                                        <li key={doc} className="text-black text-[14px] leading-[24px]">
                                            {doc.replaceAll('_', ' ')}
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://cannogacollege.ca/portal/dashboard"
                            >
                                Upload Documents
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Office of Admissions, Cannoga College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}





