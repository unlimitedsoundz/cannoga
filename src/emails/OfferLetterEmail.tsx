
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

interface OfferLetterEmailProps {
    firstName: string;
    courseTitle: string;
}

export default function OfferLetterEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
}: OfferLetterEmailProps) {
    const previewText = `Conditional Admission Offer - Cannoga College Next Steps`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white dark:bg-[#9c27b3] my-auto mx-auto font-sans">
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
                            Cannoga College Admission
                        </Heading>

                        <Heading className="text-black text-[18px] font-normal text-center p-0 mb-[20px] mx-0">
                            Congratulations on Your Offer!
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are delighted to inform you that you have been offered a conditional place to study at Cannoga College.
                        </Text>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Your Offer Details:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Programme: {courseTitle}</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Intake: Fall 2026</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Status: Conditional Offer</Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">What Does a Conditional Offer Mean?</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                A conditional offer means that you have a place reserved for you, provided you meet certain conditions. In most cases, the primary condition is the payment of your tuition fee deposit or the submission of final verified academic documents.
                            </Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Your Next Steps</Text>
                            <Text className="text-black text-[14px] leading-[24px]">To secure your place, please complete the following steps:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Review Your Letter of Acceptance (LOA): Log in to your student dashboard to carefully read the terms of your conditional offer.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Accept Your Offer: Confirm your acceptance of the offer in the portal.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Fulfill Your Conditions: Fulfill the conditions outlined in your Letter of Acceptance (LOA) (such as paying your tuition fee deposit). Once the conditions are met, your offer will become unconditional, and your Official Admission Letter will be issued.</Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Log In and View Letter of Acceptance
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Important Request: Please act promptly to accept your offer and fulfill the conditions, as places are limited and allocated on a first-come, first-served basis once conditions are met.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are very impressed by your application and look forward to welcoming you to our creative community in Ottawa, Ontario, Canada.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Warm regards,
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Admissions Office
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Cannoga College
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            admissions@cannogacollege.ca
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            https://cannogacollege.ca
                        </Text>
                        <Section className="text-center mt-[10px] mb-[20px]">
                            <Text className="m-0">
                                <Link href="https://www.instagram.com/cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">Instagram</Link>
                                <Link href="https://www.tiktok.com/@cannogacollege" className="text-[#888888] text-[12px] no-underline font-bold mx-[10px]">TikTok</Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}





