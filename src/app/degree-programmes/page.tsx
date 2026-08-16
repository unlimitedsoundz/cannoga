import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { ProgramsAZTableView } from '@/components/programs/ProgramsAZTableView';
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { createStaticClient } from '@/lib/supabase/static';

const sections = [
    { id: 'programs-az', title: 'Programs Directory (A-Z)', content: '' },
    { id: 'academic-schools', title: 'Academic Schools', content: '' },
    { id: 'admission', title: 'Admission Requirements', content: '' },
    { id: 'fees', title: 'Tuition & Fees', content: '' },
];

export const metadata = {
    title: 'Academic Degree Programmes & Certifications',
    description: 'Find your ideal learning pathway. Browse our wide selection of certified Diploma, Bachelor\'s, and Master\'s courses.',
    alternates: {
        canonical: 'https://cannogacollege.ca/degree-programmes/',
    },
};

export default async function DegreeProgrammesPage() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('id, name, slug, description, imageUrl')
        .order('name', { ascending: true });

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white">
                <div className="cc-container py-8 md:py-16 space-y-16 md:space-y-24">

                    {/* Hero */}
                    <section className="border-b-2 border-[#0a151a] pb-12">
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

                    {/* Academic Schools Carousel */}
                    <section id="academic-schools" className="scroll-mt-32">
                        <div className="mb-8 max-w-2xl text-left">
                            <h2 className="cc-h2">Academic Schools</h2>
                            <p className="text-neutral-600 font-normal text-base mt-2">Explore specialized schools and faculties across Cannoga College.</p>
                        </div>
                        <AcademicSchoolsCarousel schools={schools || []} />
                    </section>

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

