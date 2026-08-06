
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

interface AdmissionLetterEmailProps {
    firstName: string;
    courseTitle: string;
    intake?: string;
    studentId?: string;
}

export default function AdmissionLetterEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    intake = 'Fall 2026',
    studentId = 'CCXXXXXXX',
}: AdmissionLetterEmailProps) {
    const previewText = `Congratulations on Your Admission to Cannoga College – Next Steps`;

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
                            Congratulations!
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are delighted to officially confirm your admission to Cannoga College following the successful confirmation of your tuition payment.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            You have been admitted to study:
                        </Text>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] leading-[24px]">Programme: {courseTitle}</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Intake: {intake}</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Student ID: {studentId}</Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            This marks a significant milestone, and we are confident that you will thrive academically and personally as part of the Cannoga community.
                        </Text>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">What Happens Next</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Now that your admission has been secured, you will begin the next critical phase of your journey – your Study Permit (Residence Permit) application.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                You will receive the following in your student dashboard shortly:
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Your Official Admission Letter</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Your Tuition Payment Receipt</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Visa/Study Permit Guidance Documents</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Instructions for your Residence Permit (RP) application</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Accommodation details and options</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Pre-arrival and onboarding information</Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Your Immediate Next Steps</Text>
                            <Text className="text-black text-[14px] leading-[24px]">To ensure a smooth process, please follow these steps carefully:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Download Your Documents: Log in to your application dashboard and download all issued documents.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Begin Your Residence Permit Application: Apply for your Canadian study permit via the official Enter Canada (IRCC) portal.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Book Your VFS Appointment: Schedule and attend your biometric appointment at the nearest VFS center.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Prepare Required Documents: Ensure you have: valid international passport, proof of funds, health insurance, and academic documents.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Follow All Guidance Provided: Our team will support you throughout this process to ensure accuracy and success.</Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Log In to Your Dashboard
                        </Text>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Accommodation & Student Life</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                At Cannoga College, we ensure that your transition into Canada is as seamless as possible.
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Once your payment is confirmed, your accommodation information will be made available in your dashboard, including:
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Student housing options (shared and private apartments)</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Estimated monthly costs</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Location and proximity to campus</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Application guidance for housing providers</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Canada offers a safe, modern, and student-friendly environment, with excellent public services, efficient transport systems, and a high quality of life.
                            </Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">What to Look Forward To at Cannoga College</Text>
                            <Text className="text-black text-[14px] leading-[24px]">As a Cannoga student, you will experience:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• A globally relevant curriculum designed for modern careers</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• A diverse and international student community</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Career-focused learning with practical insights</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Access to student support services and academic guidance</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Opportunities to build a strong professional network in Europe</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                You will also gain exposure to Ottawa, Ontario, Canada's innovation-driven ecosystem, positioning you for global opportunities after graduation.
                            </Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Important Note: As a confirmed student for the {intake} intake, it is essential that you proceed with your study permit application immediately, as timelines are strict and processing times must be carefully considered.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are excited to have you join Cannoga College and look forward to supporting you every step of the way.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Welcome to your next chapter.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9c27b3] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://cannogacollege.ca/portal/student"
                            >
                                Enter student Portal
                            </Link>
                        </Section>

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





