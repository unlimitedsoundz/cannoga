import { Link } from "@aalto-dx/react-components";
import { CTA } from "@aalto-dx/react-modules";
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { Hero } from '@/components/layout/Hero';
import Image from 'next/image';
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { Card } from '@/components/ui/Card';
import { ContentBox } from '@/components/ui/ContentBox';

export const metadata = {
    title: 'Connect with Current Student Ambassadors',
    description: 'Chat directly with our current student ambassadors to hear first-hand about campus culture and living in Ottawa.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-guide/chat-with-cannoga-students/',
    },
};

const sections = [
    { id: 'connect', title: 'Connect with Us', content: '' },
    { id: 'chat-platform', title: 'Chat Platform', content: '' },
    { id: 'ambassadors', title: 'Student Ambassadors', content: '' },
];

export default function ChatWithStudentsPage() {
    return (
        <div className="min-h-screen bg-white text-black font-sans pb-20">
            {/* Hero Section */}
            <Hero
                title="Chat with our Students"
                body="Get a first-hand perspective on what it's like to study at Cannoga College. Our student ambassadors are here to answer your questions about academics, campus life, and living in Canada."
                backgroundColor="#a987ff"
                tinted
                lightText={true}
                image={{
                    src: "/images/student-ambassadors.png",
                    alt: "Cannoga College Students"
                }}
            />

            <GuideSidebarLayout 
                sections={sections}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Guide', href: '/student-guide' },
                    { label: 'Chat' }
                ]}
            >

                <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl text-base md:text-lg font-normal text-slate-700 leading-relaxed">
                    <div className="space-y-16 md:space-y-20">
                        {/* Intro */}
                        <section id="connect" className="scroll-mt-32">
                            <ContentBox
                                icon="chatCircleDots"
                                title="Real Conversations, Real Insights"
                                body={
                                    <div className="space-y-6 text-left">
                                        <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">
                                            Choosing the right university is a big decision. While brochures and websites provide important information, nothing beats talking to someone who is already here.
                                        </p>
                                        <p className="text-base md:text-lg text-slate-700 font-normal">
                                            Our digital platform allows you to connect with current students from various programs and backgrounds.
                                        </p>
                                    </div>
                                }
                            />
                        </section>

                        {/* Chat Platform */}
                        <section id="chat-platform" className="scroll-mt-32 space-y-4">
                            <div className="bg-neutral-100 p-1 rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                                <div className="bg-card" style={{ height: '800px' }}>
                                    <iframe 
                                        src="https://students.cannogacollege.ca/" 
                                        width="100%"
                                        height="100%"
                                        className="w-full h-full border-none"
                                        title="Chat with Cannoga Students"
                                        allow="camera; microphone; clipboard-read; clipboard-write; display-capture; geolocation; fullscreen; payment; autoplay; midi; encrypted-media"
                                        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
                                    />
                                </div>
                                <div className="p-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black">
                                    <span>Interactive Student Platform</span>
                                    <Link href="https://students.cannogacollege.ca/" target="_blank" className="underline hover:text-black inline-flex items-center gap-1">Open in New Tab <ArrowSquareOut size={13} weight="bold" /></Link>
                                </div>
                            </div>
                        </section>

                        {/* Ambassadors */}
                        <section id="ambassadors" className="scroll-mt-32">
                            <ContentBox
                                size="large"
                                icon="users"
                                title="Our Student Ambassadors"
                                image={{
                                    src: "/images/student-ambassadors.png",
                                    alt: "Student Ambassadors"
                                }}
                                body={
                                    <div className="space-y-6 text-left">
                                        <p className="text-base md:text-lg text-slate-700 font-normal leading-relaxed">
                                            Our ambassadors represent different schools and programs. They are passionate about Cannoga and eager to share their experiences.
                                        </p>
                                        <Link 
                                            href="https://ourblogs.cannogacollege.ca/" 
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-black font-bold underline hover:opacity-70 transition-all text-base"
                                        >
                                            Read their stories <ArrowSquareOut size={16} weight="bold" />
                                        </Link>
                                    </div>
                                }
                            />
                        </section>

                        {/* Standardized CTA Section */}
                        <section className="scroll-mt-32">
                            <CTA
                                title="Ready to start the conversation?"
                                body="Join our community platform and connect with the people who make Cannoga College what it is."
                                cta={{
                                    label: "Connect with Ambassadors",
                                    linkComponentProps: {
                                        href: "https://ourblogs.cannogacollege.ca/",
                                    },
                                }}
                            />
                        </section>
                    </div>
                </div>
            </GuideSidebarLayout>
        </div>
    );
}
