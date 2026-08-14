import type { Metadata } from 'next';
import { Link } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';

export const metadata: Metadata = {
    title: 'Official Student Handbook & Regulations — Cannoga College',
    description: 'Read the official student handbook detailing code of ethics, grade appeal procedures, housing policies, and campus rules.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-handbook/',
    },
};

/* ── tiny helper ── */
const Dot = () => <span className="w-1.5 h-1.5 bg-[#0a151a] rounded-full mt-2 shrink-0" />;
const Li = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 text-black"><Dot />{children}</li>
);
const Num = ({ n }: { n: number }) => (
    <span className="text-5xl font-black text-neutral-100">{n}</span>
);

export default function StudentHandbookPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* ─── Hero ─── */}
            <Hero
                title="Student Handbook"
                body="Academic Year 2026–2027 official guide to academic life, institutional policies, student responsibilities, and regulations at Cannoga College."
                backgroundColor="#0a151a"
                tinted
                lightText={true}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Student Handbook' }
                ]}
            />

            {/* ─── Body ─── */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-4xl space-y-16">

                    {/* 1 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={1} /><h2 className="text-2xl font-bold">Welcome Message</h2></div>
                        <div className="pl-14 space-y-4 text-black leading-relaxed">
                            <p>Welcome to Cannoga College.</p>
                            <p>This Student Handbook is the official guide to academic life, institutional policies, student responsibilities, and available services at Cannoga College. All students are required to read, understand, and comply with the regulations outlined in this handbook.</p>
                            <p>This handbook forms part of the regulatory framework of Cannoga College and applies to all enrolled Bachelor&apos;s and Master&apos;s students.</p>
                        </div>
                    </div>

                    {/* 2 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={2} /><h2 className="text-2xl font-bold">About Cannoga College</h2></div>
                        <div className="pl-14 space-y-4">
                            <p className="text-black leading-relaxed">Cannoga College is a higher education institution offering internationally oriented Bachelor&apos;s and Master&apos;s programmes. The University is committed to:</p>
                            <ul className="space-y-2">
                                <Li>Academic excellence</Li>
                                <Li>Ethical conduct</Li>
                                <Li>Transparency in administration</Li>
                                <Li>Student-centred learning</Li>
                                <Li>International accessibility</Li>
                            </ul>
                            <p className="text-black">Cannoga College operates in accordance with recognized academic standards and institutional best practices.</p>
                        </div>
                    </div>

                    {/* 3 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={3} /><h2 className="text-2xl font-bold">Student Status & Enrollment</h2></div>
                        <div className="pl-14 space-y-8">
                            {/* 3.1 */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">3.1 Admission vs Enrollment</h3>
                                <div className="bg-[#f3e600]/10 border-l-4 border-[#f3e600] p-4 mb-4">
                                    <p className="font-bold text-sm uppercase tracking-wide mb-1">Important Distinction</p>
                                </div>
                                <p className="text-black mb-3">A student becomes a fully enrolled student only after:</p>
                                <ul className="space-y-2 mb-4">
                                    <Li>Accepting an offer of admission</Li>
                                    <Li>Paying required tuition or enrollment fees</Li>
                                    <Li>Receiving official enrollment confirmation</Li>
                                </ul>
                                <p className="text-black mb-3">At this point:</p>
                                <ul className="space-y-2">
                                    <Li>A permanent student ID is issued</Li>
                                    <Li>Institutional email is activated</Li>
                                    <Li>Academic system access is granted</Li>
                                </ul>
                                <p className="text-black mt-4 font-medium">This moment marks the official start of student status.</p>
                            </div>

                            {/* 3.2 */}
                            <div>
                                <h3 className="font-bold text-lg mb-3">3.2 Student Status Categories</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border border-neutral-200">
                                        <thead>
                                            <tr className="bg-[#0a151a] text-white text-left">
                                                <th className="px-4 py-3 font-bold">Status</th>
                                                <th className="px-4 py-3 font-bold">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-black">
                                            {[
                                                ['Enrolled', 'Actively registered and attending'],
                                                ['On Leave', 'Approved temporary absence'],
                                                ['Withdrawn', 'Voluntarily discontinued'],
                                                ['Graduated', 'Programme completed'],
                                                ['Dismissed', 'Academic or disciplinary grounds'],
                                            ].map(([status, desc]) => (
                                                <tr key={status} className="">
                                                    <td className="px-4 py-3 font-medium text-black">{status}</td>
                                                    <td className="px-4 py-3">{desc}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-black mt-3 text-sm">Status changes are recorded permanently.</p>
                            </div>
                        </div>
                    </div>

                    {/* 4 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={4} /><h2 className="text-2xl font-bold">Academic Structure</h2></div>
                        <div className="pl-14 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">4.1 Programmes & Degrees</h3>
                                <p className="text-black mb-3">Cannoga College offers Bachelor&apos;s and Master&apos;s degrees. Each programme defines:</p>
                                <ul className="space-y-2">
                                    <Li>Learning outcomes</Li>
                                    <Li>Credit requirements</Li>
                                    <Li>Course structure</Li>
                                    <Li>Progression rules</Li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">4.2 Academic Calendar</h3>
                                <p className="text-black mb-3">The academic year is divided into terms or semesters. The calendar includes:</p>
                                <ul className="space-y-2">
                                    <Li>Registration periods</Li>
                                    <Li>Teaching weeks</Li>
                                    <Li>Examination periods</Li>
                                    <Li>Holidays</Li>
                                </ul>
                                <p className="text-black mt-3">The official academic calendar is published annually.</p>
                            </div>
                        </div>
                    </div>

                    {/* 5 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={5} /><h2 className="text-2xl font-bold">Course Registration</h2></div>
                        <div className="pl-14 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">5.1 Registration Rules</h3>
                                <p className="text-black mb-3">Students must:</p>
                                <ul className="space-y-2">
                                    <Li>Register within designated periods</Li>
                                    <Li>Meet prerequisites</Li>
                                    <Li>Observe credit limits</Li>
                                </ul>
                                <p className="text-black mt-3">Failure to register on time may delay progression.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">5.2 Add / Drop Period</h3>
                                <ul className="space-y-2">
                                    <Li>A limited add/drop period may be provided</Li>
                                    <Li>Changes after deadlines are normally not permitted</Li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 6 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={6} /><h2 className="text-2xl font-bold">Attendance & Engagement</h2></div>
                        <div className="pl-14">
                            <ul className="space-y-2">
                                <Li>Regular attendance is expected</Li>
                                <Li>Certain courses may enforce minimum attendance</Li>
                                <Li>Active participation supports academic success</Li>
                            </ul>
                            <p className="text-black mt-3">Failure to meet attendance expectations may affect assessment eligibility.</p>
                        </div>
                    </div>

                    {/* 7 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={7} /><h2 className="text-2xl font-bold">Assessment & Grading</h2></div>
                        <div className="pl-14 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">7.1 Assessment Methods</h3>
                                <p className="text-black mb-3">Assessment may include:</p>
                                <ul className="space-y-2">
                                    <Li>Exams</Li>
                                    <Li>Coursework</Li>
                                    <Li>Projects</Li>
                                    <Li>Presentations</Li>
                                    <Li>Practical assessments</Li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">7.2 Grading</h3>
                                <ul className="space-y-2">
                                    <Li>Grades follow an approved grading scale</Li>
                                    <Li>Results are published through the academic system</Li>
                                    <Li>All grades become part of the permanent record</Li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">7.3 Academic Integrity</h3>
                                <p className="text-black mb-3">Students must uphold honesty. Violations include:</p>
                                <ul className="space-y-2 mb-4">
                                    <Li>Plagiarism</Li>
                                    <Li>Cheating</Li>
                                    <Li>Fabrication of data</Li>
                                    <Li>Unauthorized collaboration</Li>
                                </ul>
                                <p className="text-black mb-3">Sanctions may include:</p>
                                <ul className="space-y-2">
                                    <Li>Grade penalties</Li>
                                    <Li>Course failure</Li>
                                    <Li>Suspension or dismissal</Li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 8 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={8} /><h2 className="text-2xl font-bold">Academic Progression</h2></div>
                        <div className="pl-14">
                            <ul className="space-y-2">
                                <Li>Minimum academic standards apply</Li>
                                <Li>Academic probation may be imposed</Li>
                                <Li>Continued underperformance may result in dismissal</Li>
                            </ul>
                            <p className="text-black mt-3">Decisions are recorded formally.</p>
                        </div>
                    </div>

                    {/* 9 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={9} /><h2 className="text-2xl font-bold">Learning Systems & Digital Access</h2></div>
                        <div className="pl-14 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">9.1 Learning Management System (LMS)</h3>
                                <p className="text-black mb-3">Students receive access to:</p>
                                <ul className="space-y-2">
                                    <Li>Course materials</Li>
                                    <Li>Assignments</Li>
                                    <Li>Grades</Li>
                                    <Li>Academic communications</Li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">9.2 Student Information System (SIS)</h3>
                                <p className="text-black mb-3">The SIS contains:</p>
                                <ul className="space-y-2">
                                    <Li>Enrollment status</Li>
                                    <Li>Academic records</Li>
                                    <Li>Transcripts</Li>
                                    <Li>Degree progress</Li>
                                </ul>
                                <p className="text-black mt-3">Access is governed by role and status.</p>
                            </div>
                        </div>
                    </div>

                    {/* 10 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={10} /><h2 className="text-2xl font-bold">Tuition Fees & Payments</h2></div>
                        <div className="pl-14">
                            <ul className="space-y-2 mb-4">
                                <Li>Tuition fees are published transparently</Li>
                                <Li>Payments are made through the official payment platform</Li>
                            </ul>
                            <p className="text-black mb-3">Fees may include:</p>
                            <ul className="space-y-2">
                                <Li>Tuition</Li>
                                <Li>Housing</Li>
                                <Li>IT materials</Li>
                                <Li>Student services</Li>
                            </ul>
                            <p className="text-black mt-3 font-medium">Failure to meet obligations may restrict access or enrollment.</p>
                        </div>
                    </div>

                    {/* 11 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={11} /><h2 className="text-2xl font-bold">Housing & Campus Services</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">Where applicable, Cannoga College may offer:</p>
                            <ul className="space-y-2">
                                <Li>Housing assistance or placements</Li>
                                <Li>IT services</Li>
                                <Li>Academic support services</Li>
                            </ul>
                            <p className="text-black mt-3">Housing availability is not guaranteed and is subject to capacity.</p>
                        </div>
                    </div>

                    {/* 12 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={12} /><h2 className="text-2xl font-bold">Student Conduct & Discipline</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">Students are expected to:</p>
                            <ul className="space-y-2 mb-4">
                                <Li>Behave professionally</Li>
                                <Li>Respect others</Li>
                                <Li>Follow institutional rules</Li>
                                <Li>Use systems responsibly</Li>
                            </ul>
                            <p className="text-black mb-3">Misconduct may lead to:</p>
                            <ul className="space-y-2">
                                <Li>Warnings</Li>
                                <Li>Suspension</Li>
                                <Li>Dismissal</Li>
                            </ul>
                        </div>
                    </div>

                    {/* 13 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={13} /><h2 className="text-2xl font-bold">Leave of Absence & Withdrawal</h2></div>
                        <div className="pl-14 space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-3">13.1 Leave of Absence</h3>
                                <ul className="space-y-2">
                                    <Li>Must be formally requested</Li>
                                    <Li>Approval is not automatic</Li>
                                    <Li>Academic and financial implications apply</Li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-3">13.2 Withdrawal</h3>
                                <ul className="space-y-2">
                                    <Li>Requires formal submission</Li>
                                    <Li>Refunds follow the Refund Policy</Li>
                                    <Li>Academic records are retained</Li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 14 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={14} /><h2 className="text-2xl font-bold">Records, Transcripts & Data Protection</h2></div>
                        <div className="pl-14">
                            <ul className="space-y-2">
                                <Li>Permanent academic records are maintained</Li>
                                <Li>Official transcripts are issued upon request</Li>
                                <Li>Student data is handled in compliance with data protection laws</Li>
                            </ul>
                        </div>
                    </div>

                    {/* 15 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={15} /><h2 className="text-2xl font-bold">Complaints & Appeals</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">Students may:</p>
                            <ul className="space-y-2">
                                <Li>Submit academic complaints</Li>
                                <Li>Appeal certain decisions</Li>
                            </ul>
                            <p className="text-black mt-3">All appeals are reviewed fairly and documented.</p>
                        </div>
                    </div>

                    {/* 16 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={16} /><h2 className="text-2xl font-bold">Graduation & Degree Conferral</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">To graduate, students must:</p>
                            <ul className="space-y-2">
                                <Li>Complete all academic requirements</Li>
                                <Li>Meet performance standards</Li>
                                <Li>Settle financial obligations</Li>
                            </ul>
                            <p className="text-black mt-3 font-medium">Degrees are awarded upon academic board approval.</p>
                        </div>
                    </div>

                    {/* 17 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={17} /><h2 className="text-2xl font-bold">Amendments & Governance</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">Cannoga College reserves the right to:</p>
                            <ul className="space-y-2">
                                <Li>Update this handbook</Li>
                                <Li>Amend regulations</Li>
                            </ul>
                            <p className="text-black mt-3">The most current version is published on the official website.</p>
                        </div>
                    </div>

                    {/* 18 */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-4"><Num n={18} /><h2 className="text-2xl font-bold">Contact & Official Communication</h2></div>
                        <div className="pl-14">
                            <p className="text-black mb-3">All official communication is conducted via:</p>
                            <ul className="space-y-2">
                                <Li>Institutional email</Li>
                                <Li>Student portal notifications</Li>
                            </ul>
                            <p className="text-black mt-3 font-medium">Students are responsible for monitoring official channels.</p>
                        </div>
                    </div>

                    {/* Related Links */}
                    <div className="pt-12 ">
                        <h3 className="font-bold text-lg mb-6">Related Documents</h3>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/admissions-policy" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-sm hover:bg-neutral-800 transition-colors">
                                Admissions Policy →
                            </Link>
                            <Link href="/academic-regulations" className="bg-[#0a151a] text-white px-6 py-3 font-bold text-sm hover:bg-neutral-800 transition-colors">
                                Academic Regulations →
                            </Link>
                            <Link href="/admissions" className="border border-[#0a151a] px-6 py-3 font-bold text-sm hover:bg-[#0a151a] hover:text-white transition-colors">
                                Admissions Overview →
                            </Link>
                            <Link href="/code-of-conduct" className="border border-[#0a151a] px-6 py-3 font-bold text-sm hover:bg-[#0a151a] hover:text-white transition-colors">
                                Code of Conduct →
                            </Link>
                            <Link href="/refund-withdrawal-policy/" className="border border-[#0a151a] px-6 py-3 font-bold text-sm hover:bg-[#0a151a] hover:text-white transition-colors">
                                Refund Policy →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

