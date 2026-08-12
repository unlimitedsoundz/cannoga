
import { CheckCircle, X, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';

export const metadata = {
    title: 'Academic Admission Requirements & Criteria — Cannoga College',
    description: 'Check GPA requirements, English language proficiency test scores (IELTS/TOEFL), and documents needed to qualify for admissions.',
    alternates: {
        canonical: 'https://cannogacollege.ca/admissions/requirements/',
    },
};

export default function RequirementsPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="bg-[#FFE600] text-black overflow-hidden">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 pt-12 pb-12 lg:pb-0 h-auto lg:h-[600px] lg:py-0 relative mb-0">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-6 relative z-10 flex flex-col justify-center h-full pt-0 lg:pt-0">
                        <span className="text-sm font-bold uppercase tracking-widest text-black mb-0 block">Admissions</span>
                        <h1 className="font-bold leading-[1.1] tracking-tight pt-0 text-black" style={{ fontSize: '40px' }}>
                            Entry Requirements
                        </h1>
                        <p className="text-[21px] text-black max-w-xl leading-relaxed">
                            Find everything you need to know about academic thresholds, English proficiency, and required documentation for your application.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 h-full w-full relative lg:translate-y-16 z-20 flex justify-center lg:block order-first lg:order-none">
                        <div className="h-full">
                            <div className="relative w-[368px] h-[368px] lg:w-full lg:h-full bg-neutral-800">
                                <Image
                                    src="/images/admissions/hero.jpg"
                                    alt="Entry Requirements"
                                    fill
                                    priority
                                    className="object-cover object-top"
                                    sizes="(max-width: 1024px) 368px, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 gap-16">
                    <section>
                        <h2 className="text-3xl font-bold mb-10 pb-0 pl-0 text-black uppercase tracking-widest">Bachelor's Degrees</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">Upper Secondary Education</h4>
                                    <p className="text-black font-medium text-sm">Certificate of Matriculation or equivalent foreign qualification.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">English Proficiency</h4>
                                    <p className="text-black font-medium text-sm">IELTS 6.0, TOEFL iBT 60, or equivalent.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">Entrance Exam / SAT</h4>
                                    <p className="text-black font-medium text-sm">Applying via SAT scores is possible for all Engineering programs.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-10 pb-0 pl-0 text-black uppercase tracking-widest">Master's Degrees</h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">Bachelor's Degree</h4>
                                    <p className="text-black font-medium text-sm">In a relevant field of study.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">Work Experience</h4>
                                    <p className="text-black font-medium text-sm">Minimum of 2 years of relevant post-graduation work experience.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <ArrowRight size={20} weight="bold" className="text-black shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-black uppercase text-sm tracking-widest">Motivation Video</h4>
                                    <p className="text-black font-medium text-sm">A 2-minute video introducing yourself and your goals.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

