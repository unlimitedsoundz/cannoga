
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

interface AdminApplicationEmailProps {
    studentName: string;
    studentEmail: string;
    courseName: string;
    applicationId: string;
}

export default function AdminApplicationEmail({
    studentName = 'John Doe',
    studentEmail = 'john@example.com',
    courseName = 'Bachelor of Science',
    applicationId = 'APP-000',
}: AdminApplicationEmailProps) {
    const previewText = `New Application: ${studentName} has submitted an application for ${courseName}.`;

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
                            New Application Submitted
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            A new application has been submitted for review.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-6 border border-neutral-100">
                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Applicant</Text>
                            <Text className="text-black text-[16px] font-bold my-0 mb-4">{studentName}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Email</Text>
                            <Text className="text-black text-[14px] my-0 mb-4">{studentEmail}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Program</Text>
                            <Text className="text-black text-[14px] font-bold my-0 mb-4">{courseName}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Application ID</Text>
                            <Text className="text-black text-[12px] font-mono my-0">{applicationId}</Text>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-bold no-underline text-center px-6 py-3 uppercase tracking-widest"
                                href={`https://cannogacollege.ca/admin/admissions/applications/${applicationId}`}
                            >
                                Review Application
                            </Link>
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





