import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { ProgramsAZTableView } from '@/components/programs/ProgramsAZTableView';

const sections = [
    { id: 'programs-az', title: 'Programs Directory (A-Z)', content: '' },
    { id: 'certificates', title: 'Certificate Programs', content: '' },
    { id: 'diplomas', title: 'Diploma Programs', content: '' },
    { id: 'bachelor', title: 'Bachelor\u2019s Degrees', content: '' },
    { id: 'master', title: 'Master\u2019s Degrees', content: '' },
    { id: 'admission', title: 'Admission Requirements', content: '' },
    { id: 'fees', title: 'Tuition & Fees', content: '' },
];

export const metadata = {
    title: 'Academic Degree Programmes & Certifications — Cannoga College',
    description: 'Find your ideal learning pathway. Browse our wide selection of certified Diploma, Bachelor\'s, and Master\'s courses.',
    alternates: {
        canonical: 'https://cannogacollege.ca/degree-programmes/',
    },
};

function ProgramCard({ id, duration, title, overview, requirements, admissionHref }: {
    id: string; duration: string; title: string; overview: string;
    requirements: string[]; admissionHref: string;
}) {
    return (
        <section id={id} className="scroll-mt-32">
            <div className="cc-section-divider flex items-center justify-between">
                <h2 className="cc-h2">{title}</h2>
                <span className="text-xs font-bold uppercase tracking-widest bg-[#0a151a] text-white px-4 py-1.5 shrink-0">{duration}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 cc-card cc-card-body space-y-4">
                    <h3 className="cc-h3">Overview</h3>
                    <p className="text-neutral-600 leading-relaxed">{overview}</p>
                </div>
                <div className="cc-card cc-card-body flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="cc-h3 mb-4">Requirements</h3>
                        <ul className="space-y-3 text-neutral-600 text-sm">
                            {requirements.map((r, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <ArrowRight size={16} className="text-[#000000] shrink-0 mt-0.5" />
                                    <span>{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href={admissionHref} className="cc-btn-outline text-sm mt-4 inline-flex no-underline">
                        Admission Details <ArrowRight size={14} weight="bold" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function DegreeProgrammesPage() {
    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white">
                <div className="cc-container py-8 md:py-16 space-y-16 md:space-y-24">

                    {/* Hero */}
                    <section className="border-b-2 border-[#0a151a] pb-12">
                        <p className="cc-label uppercase tracking-widest mb-3">Academic Offerings</p>
                        <h1 className="cc-h1 mb-6">Programs &amp; Degrees</h1>
                        <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                            Discover our diverse range of career-focused programs designed to prepare you for success.
                            From certificates and diplomas to undergraduate and graduate degrees, we offer world-class education in Ottawa.
                            All academic programs at Cannoga College are eligible for the Post-Graduation Work Permit (PGWP).
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link href="/admissions" className="cc-btn-primary no-underline">Apply Now <ArrowRight size={14} weight="bold" /></Link>
                            <Link href="#programs-az" className="cc-btn-outline no-underline">View Programs A-Z Table <ArrowRight size={14} weight="bold" /></Link>
                        </div>
                    </section>

                    {/* Interactive Programs A-Z Directory Table View */}
                    <section id="programs-az" className="scroll-mt-32">
                        <ProgramsAZTableView />
                    </section>

                    <ProgramCard
                        id="certificates"
                        duration="1 Year"
                        title="Certificate Programs"
                        overview="Our certificate programs provide rapid, focused training in specific technical or business domains. Perfect for professionals looking to upskill, transition careers, or gain fundamental entry-level knowledge. These programs emphasize hands-on, practical skills directly aligned with immediate industry needs in Ottawa's job market."
                        requirements={[
                            "High school diploma or equivalent",
                            "English language proficiency (IELTS 6.0 or equivalent)",
                            "Basic computer literacy",
                        ]}
                        admissionHref="/admissions"
                    />

                    <ProgramCard
                        id="diplomas"
                        duration="2 Years"
                        title="Diploma Programs"
                        overview="Our 2-year diploma programs offer a comprehensive blend of theoretical understanding and intensive practical training. Students dive deep into their chosen discipline, working on real-world projects and collaborative assignments. These programs are structured to prepare graduates for direct entry into the workforce with highly marketable technical capabilities."
                        requirements={[
                            "High school diploma or equivalent",
                            "English language proficiency (IELTS 6.0 or equivalent)",
                            "Satisfactory grades in prerequisite courses",
                        ]}
                        admissionHref="/admissions"
                    />

                    <ProgramCard
                        id="advanced-diplomas"
                        duration="2.5 Years"
                        title="Advanced Diploma Programs"
                        overview="Our advanced diploma programmes are designed for students who want a deeper specialization and stronger professional preparation in applied technical or business fields. They combine advanced study, project work and workplace-ready skills for career advancement and further academic progression."
                        requirements={[
                            "Relevant diploma or equivalent qualification",
                            "English language proficiency (IELTS 6.0 or equivalent)",
                            "Prior academic or professional experience in the field",
                        ]}
                        admissionHref="/admissions"
                    />

                    <ProgramCard
                        id="bachelor"
                        duration="4 Years"
                        title="Bachelor's Degree Programs"
                        overview="Our 4-year undergraduate degree programs offer rigorous academic instruction combined with professional training. Fusing analytical thinking, research methodologies, and leadership skills, these degrees prepare students for high-level careers or postgraduate research. Program structures include comprehensive co-op semesters in Ottawa's public and private sectors."
                        requirements={[
                            "High school diploma with competitive GPA (70%+)",
                            "English language proficiency (IELTS 6.5, no band below 6.0)",
                            "Prerequisite senior courses (e.g. English, Math)",
                        ]}
                        admissionHref="/admissions/bachelor"
                    />

                    <ProgramCard
                        id="master"
                        duration="2 Years"
                        title="Master's Degree Programs"
                        overview="Our graduate degree programs are designed for ambitious professionals and researchers seeking to lead innovation in their industries. The curriculum focuses on advanced strategic planning, specialized methodologies, and a major thesis or capstone project. Students collaborate with faculty on active research initiatives."
                        requirements={[
                            "Accredited Bachelor's degree in related field",
                            "Minimum undergraduate GPA of B (3.0/4.0)",
                            "Two letters of recommendation & Statement of Purpose",
                        ]}
                        admissionHref="/admissions/master"
                    />

                    {/* Admission Requirements */}
                    <section id="admission" className="scroll-mt-32">
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">Admission Requirements</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">Undergraduate <span className="text-[#000000]">(Certificates &amp; Diplomas)</span></h3>
                                <ul className="space-y-4">
                                    {["High school diploma or equivalent", "Minimum GPA requirements", "English language proficiency", "Academic transcripts of secondary education"].map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 text-neutral-600">
                                            <ArrowRight size={18} weight="bold" className="text-[#000000] flex-shrink-0 mt-0.5" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">Degrees <span className="text-[#000000]">(Bachelor's &amp; Master's)</span></h3>
                                <ul className="space-y-4">
                                    {["Bachelor's degree or equivalent (for Master's)", "High school diploma with required subject prerequisites (for Bachelor's)", "Academic transcripts and letters of recommendation", "Statement of purpose or portfolio (where applicable)"].map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 text-neutral-600">
                                            <ArrowRight size={18} weight="bold" className="text-[#000000] flex-shrink-0 mt-0.5" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Tuition & Fees */}
                    <section id="fees" className="scroll-mt-32">
                        <div className="cc-section-divider">
                            <h2 className="cc-h2">Tuition &amp; Fees</h2>
                            <p className="cc-label">All amounts in Euros (CAD)</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">Domestic Students</h3>
                                <div className="space-y-4">
                                    {[
                                        ["Certificate & Diploma programs", "$1,500/year"],
                                        ["Bachelor's degree programs", "$2,500/year"],
                                        ["Master's degree programs", "$3,500/year"],
                                    ].map(([label, price]) => (
                                        <div key={label} className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                            <span className="text-neutral-600 text-sm">{label}</span>
                                            <span className="font-bold text-lg text-[#000000]">{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">International Students</h3>
                                <div className="space-y-4">
                                    {[
                                        ["Certificate & Diploma programs", "$2,500/year"],
                                        ["Bachelor's degree programs", "$4,000/year"],
                                        ["Master's degree programs", "$6,000/year"],
                                    ].map(([label, price]) => (
                                        <div key={label} className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                            <span className="text-neutral-600 text-sm">{label}</span>
                                            <span className="font-bold text-lg text-[#000000]">{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Link href="/admissions/tuition" className="cc-btn-primary no-underline">
                                View Detailed Fee Information <ArrowRight size={14} weight="bold" />
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </GuideSidebarLayout>
    );
}

