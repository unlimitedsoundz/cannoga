
export const metadata = {
    title: 'International Student Portal & Relocation Guide — Cannoga College',
    description: 'Prepare for your move to Canada. Access essential details on student visas, study permits, local housing, and language studies.',
};

export default function InternationalPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
                <span className="text-neutral-600 font-bold uppercase tracking-wider text-sm mb-2 block">Student Services</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 pt-8">International Students</h1>

                <div className="prose prose-lg max-w-none text-neutral-600 mb-12">
                    <p>
                        Welcome to Cannoga! Each year, we welcome hundreds of students from around the world. We are committed to making your transition to Ottawa, Ontario, Canada as smooth as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-neutral-100 p-10 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-neutral-800">🛂 Canadian Study Permit</h3>
                         <p className="mb-4 text-sm">Most international students require a Canadian study permit. You should apply as soon as you receive your acceptance letter from Cannoga College.</p>
                        <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" target="_blank" rel="noopener noreferrer" className="text-neutral-600 font-bold text-sm underline">IRCC Study Permit Guide</a>
                    </div>
                    <div className="bg-neutral-100 p-10 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 text-neutral-800">🏠 Student Housing</h3>
                         <p className="mb-4 text-sm">Cannoga College offers on-campus housing for international students. Applications are processed on a first-come, first-served basis.</p>
                        <a href="/student-guide/housing-for-students" className="text-neutral-600 font-bold text-sm underline">Learn About Housing Options</a>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-6">Key Admission Requirements for International Students</h2>
                    <div className="space-y-6">
                        <div className="bg-neutral-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-3 text-neutral-800">Ontario College Diploma Programs</h3>
                            <ul className="space-y-2 text-sm text-neutral-600">
                                <li><strong>Academic Background:</strong> High school graduation certificate (equivalent to an Ontario Secondary School Diploma / Grade 12) with passing grades, or a relevant degree for postgraduate certificates.</li>
                                <li><strong>English Language Proficiency:</strong> Typically an IELTS Academic score of 6.0 (with no band under 5.5) or equivalent tests like TOEFL or Duolingo, depending on the program.</li>
                                <li><strong>Immigration Documents:</strong> A valid passport and a Canadian Study Permit issued by Immigration, Refugees and Citizenship Canada (IRCC).</li>
                                <li><strong>Proof of Financial Support:</strong> Evidence of sufficient funds to cover tuition and living expenses for the first year of study.</li>
                            </ul>
                        </div>
                        <div className="bg-neutral-100 p-6 rounded-xl">
                            <h3 className="text-xl font-bold mb-3 text-neutral-800">Certificate Programs</h3>
                            <ul className="space-y-2 text-sm text-neutral-600">
                                <li><strong>Academic Background:</strong> High school graduation certificate or equivalent.</li>
                                <li><strong>English Language Proficiency:</strong> IELTS Academic 6.0 or equivalent.</li>
                                <li><strong>Immigration Documents:</strong> Valid passport and Canadian Study Permit (if applicable).</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
                    <div className="space-y-4">
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-neutral-600">Can I work while studying?</summary>
                            <p className="mt-2 text-neutral-600">Yes, international students can work up to 30 hours per week on average during the academic year, and full-time during holidays.</p>
                        </details>
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-neutral-600">Is health insurance mandatory?</summary>
                            <p className="mt-2 text-neutral-600">Yes, you must have valid private health insurance for your first 3 months in Canada before OHIP kicks in. This is also required for your study permit application.</p>
                        </details>
                        <details className="group p-4 rounded-lg cursor-pointer">
                            <summary className="font-bold text-neutral-900 group-hover:text-neutral-600">Are Canadian classes available?</summary>
                            <p className="mt-2 text-neutral-600">Absolutely! We offer free "Survival Canadian" courses for all incoming international students.</p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    );
}
