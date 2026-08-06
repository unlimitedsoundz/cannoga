
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

interface WelcomeEmailProps {
    firstName: string;
    studentId: string;
}

export default function WelcomeEmail({
    firstName = 'Student',
    studentId = 'CCXXXXXXX',
}: WelcomeEmailProps) {
    const previewText = `Welcome to Cannoga College! Your Student ID is ${studentId}.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="my-[20px] mx-auto px-[15px] py-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://cannogacollege.ca/images/logo-cannoga.png" // Replace with actual logo URL
                                width="80"
                                height="80"
                                alt="Cannoga College"
                                className="my-0 mx-auto dark:invert"
                            />
                        </Section>
                        <Section className="mt-[16px]">
                            <Img
                                src="https://cannogacollege.ca/images/admissions/master-hero.png"
                                width="465"
                                height="150"
                                alt="Scholarships"
                                className="w-full object-cover object-top"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to Cannoga College
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Congratulations on creating your student account at Cannoga College! We are excited to have you join our academic community.
                        </Text>

                        <Section className="bg-neutral-900 rounded-lg p-6 my-8 text-center">
                            <Text className="text-white text-[10px] uppercase font-bold tracking-widest mb-2 opacity-60">
                                Your Unique Student ID
                            </Text>
                            <Text className="text-white text-[32px] font-bold tracking-tighter my-0">
                                {studentId}
                            </Text>
                                <Text className="text-white text-[10px] font-medium mt-4 opacity-80 leading-relaxed uppercase">
                                Use Email and Password to access the student portal.
                            </Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            You can now access your dashboard to complete your application, upload documents, and track your progress.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
<Link
                                 className="bg-white rounded text-black text-[12px] font-semibold no-underline text-center px-5 py-3"
                                 href="https://cannogacollege.ca/portal/account/login"
                             >
                                 Enter Student Portal
                             </Link>
                        </Section>

                        <Text className="text-white text-[14px] leading-[24px]">
                            If you have any questions or need assistance, please feel free to reach out to our Admissions Office at <Link href="mailto:admissions@cannogacollege.ca" className="text-blue-600 no-underline font-bold">admissions@cannogacollege.ca</Link>.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This email was sent to confirm your account registration at Cannoga College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}





