
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

interface AdminHousingApplicationEmailProps {
    studentName: string;
    studentId: string;
    semesterName: string;
    preferredBuilding: string;
    moveInDate: string;
}

export default function AdminHousingApplicationEmail({
    studentName = 'John Doe',
    studentId = 'CC0000000',
    semesterName = 'Fall 2024',
    preferredBuilding = 'West Wing',
    moveInDate = '2024-09-01',
}: AdminHousingApplicationEmailProps) {
    const previewText = `New Housing Application: ${studentName} (${studentId}) for ${semesterName}.`;

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
                            New Housing Application
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            A student has submitted a new housing application.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-6 border border-neutral-100">
                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Student</Text>
                            <Text className="text-black text-[16px] font-bold my-0 mb-4">{studentName} ({studentId})</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Term</Text>
                            <Text className="text-black text-[14px] my-0 mb-4">{semesterName}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Preferred Building</Text>
                            <Text className="text-black text-[14px] my-0 mb-4">{preferredBuilding}</Text>

                            <Text className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-1 mt-0">Intended Move-In</Text>
                            <Text className="text-black text-[14px] my-0">{moveInDate}</Text>
                        </Section>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-bold no-underline text-center px-6 py-3 uppercase tracking-widest"
                                href={`https://cannogacollege.ca/admin/housing/applications`}
                            >
                                Manage Housing
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





