
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

interface OfferRejectionEmailProps {
    firstName: string;
    applicationId: string;
    courseName?: string;
}

export default function OfferRejectionEmail({
    firstName = 'Applicant',
    applicationId = 'APP-12345',
    courseName = 'Bachelor of Business Administration',
}: OfferRejectionEmailProps) {
    const previewText = `We have received your decision to decline our offer of admission.`;

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

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Admission Offer Declined
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We have received your decision to decline the offer of admission to the <strong>{courseName}</strong> program at Cannoga College.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your application (ID: {applicationId}) status has been updated to <strong>OFFER_DECLINED</strong>. We appreciate you letting us know so we can offer your spot to another candidate.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            If you declined this offer by mistake, please contact our Admissions Office immediately at <Link href="mailto:admissions@cannogacollege.ca" className="text-blue-600 no-underline">admissions@cannogacollege.ca</Link>.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This email was intended for {firstName}. If you were not expecting this email, you can ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}




