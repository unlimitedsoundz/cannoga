import { Link } from "@aalto-dx/react-components";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import GuideSidebarLayout from '@/components/layout/StudentGuideLayout';
import { ProgramsAZTableView } from '@/components/programs/ProgramsAZTableView';
import { AcademicSchoolsCarousel } from '@/components/home/AcademicSchoolsCarousel';
import { createStaticClient } from '@/lib/supabase/static';
import { DOMESTIC_TUITION, INTERNATIONAL_TUITION } from '@/utils/tuition';

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

function extractAnnualFee(jsonb: any, fallback: number): number {
    if (!jsonb) return fallback;
    const val = jsonb.annualTuition || jsonb.domesticTuition || jsonb.tuition || jsonb.amount || jsonb.value;
    if (!val) return fallback;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
}

export default async function DegreeProgrammesPage() {
    const supabase = createStaticClient();
    const { data: schools } = await supabase
        .from('School')
        .select('id, name, slug, description, imageUrl')
        .order('name', { ascending: true });

    let tuitionDataMap: Record<string, { domestic: number; international: number }> = {
        DIPLOMA: { domestic: DOMESTIC_TUITION.CERTIFICATE_DIPLOMA, international: INTERNATIONAL_TUITION.CERTIFICATE_DIPLOMA },
        BACHELOR: { domestic: DOMESTIC_TUITION.BACHELOR, international: INTERNATIONAL_TUITION.BACHELOR },
        MASTER: { domestic: DOMESTIC_TUITION.MASTER, international: INTERNATIONAL_TUITION.MASTER },
    };

    try {
        const { data: tuitionRows } = await supabase
            .from('tuition_info')
            .select('credential_type, domestic_tuition, international_tuition')
            .eq('status', 'active');

        if (tuitionRows && tuitionRows.length > 0) {
            tuitionRows.forEach((row: any) => {
                const cred = (row.credential_type || '').toUpperCase();
                const fallbackDom = cred === 'MASTER' ? DOMESTIC_TUITION.MASTER : cred === 'BACHELOR' ? DOMESTIC_TUITION.BACHELOR : DOMESTIC_TUITION.CERTIFICATE_DIPLOMA;
                const fallbackInt = cred === 'MASTER' ? INTERNATIONAL_TUITION.MASTER : cred === 'BACHELOR' ? INTERNATIONAL_TUITION.BACHELOR : INTERNATIONAL_TUITION.CERTIFICATE_DIPLOMA;

                const domFee = extractAnnualFee(row.domestic_tuition, fallbackDom);
                const intFee = extractAnnualFee(row.international_tuition, fallbackInt);

                if (cred === 'DIPLOMA' || cred === 'CERTIFICATE') {
                    tuitionDataMap.DIPLOMA = { domestic: domFee, international: intFee };
                } else if (cred === 'BACHELOR') {
                    tuitionDataMap.BACHELOR = { domestic: domFee, international: intFee };
                } else if (cred === 'MASTER') {
                    tuitionDataMap.MASTER = { domestic: domFee, international: intFee };
                }
            });
        }
    } catch (e) {
        console.error('Error fetching tuition_info for degree programmes:', e);
    }

    const domesticFees = [
        ["Certificate & Diploma programs (1-2 Years)", `$${tuitionDataMap.DIPLOMA.domestic.toLocaleString()}/year`],
        ["Advanced Diploma programs (3 Years)", `$${tuitionDataMap.MASTER.domestic.toLocaleString()}/year`],
        ["Bachelor's degree programs (4 Years)", `$${tuitionDataMap.BACHELOR.domestic.toLocaleString()}/year`],
    ];

    const internationalFees = [
        ["Certificate & Diploma programs (1-2 Years)", `$${tuitionDataMap.DIPLOMA.international.toLocaleString()}/year`],
        ["Advanced Diploma programs (3 Years)", `$${tuitionDataMap.MASTER.international.toLocaleString()}/year`],
        ["Bachelor's degree programs (4 Years)", `$${tuitionDataMap.BACHELOR.international.toLocaleString()}/year`],
    ];

    return (
        <GuideSidebarLayout sections={sections}>
            <div className="min-h-screen bg-white">
                <div className="cc-container py-8 md:py-16 space-y-16 md:space-y-24">

                    {/* Hero */}
                    <section className="border-b-2 border-[#0a151a] pb-12">
                        <h1 className="cc-h1 mb-6">Programs &amp; Degrees</h1>
                        <p className="text-lg text-black leading-relaxed max-w-2xl">
                            Discover our diverse range of career-focused programs designed to prepare you for success.
                            From certificates and diplomas to 3-year advanced diplomas and bachelor degrees, we offer world-class education in Ottawa.
                            Graduates of eligible diploma, advanced diploma, and degree programs can qualify for the Post-Graduation Work Permit (PGWP).
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link href="/admissions/" className="cc-btn-primary no-underline">Apply Now <ArrowRight size={14} weight="bold" /></Link>
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
                            <p className="text-black font-normal text-lg mt-2">Explore specialized schools and faculties across Cannoga College.</p>
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
                                        <li key={i} className="flex items-start gap-3 text-black text-lg">
                                            <span className="w-2 h-2 rounded-full bg-[#0f2027] flex-shrink-0 mt-2.5" />
                                            <span>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">Degrees &amp; Advanced Diplomas <span className="text-[#000000]">(Bachelor's &amp; Adv. Diplomas)</span></h3>
                                <ul className="space-y-4">
                                    {["High school diploma or equivalent with required subject prerequisites", "Academic transcripts and qualification certificates", "English language proficiency (IELTS 6.0/6.5 or equivalent)", "Government-issued photo identification and statement of intent"].map((r, i) => (
                                        <li key={i} className="flex items-start gap-3 text-black text-lg">
                                            <span className="w-2 h-2 rounded-full bg-[#0f2027] flex-shrink-0 mt-2.5" />
                                            <span>{r}</span>
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
                            <p className="cc-label">All amounts in Canadian Dollars (CAD)</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">Domestic Students</h3>
                                <div className="space-y-4">
                                    {domesticFees.map(([label, price]) => (
                                        <div key={label} className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                            <span className="text-slate-600 text-sm">{label}</span>
                                            <span className="font-bold text-lg text-[#000000]">{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cc-card cc-card-body">
                                <h3 className="cc-h3 mb-6">International Students</h3>
                                <div className="space-y-4">
                                    {internationalFees.map(([label, price]) => (
                                        <div key={label} className="flex justify-between items-center border-b border-neutral-100 pb-3">
                                            <span className="text-slate-600 text-sm">{label}</span>
                                            <span className="font-bold text-lg text-[#000000]">{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Link href="/admissions/tuition/" className="cc-btn-primary no-underline">
                                View Detailed Fee Information <ArrowRight size={14} weight="bold" />
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </GuideSidebarLayout>
    );
}

