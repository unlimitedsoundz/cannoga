'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types/database';
import { Info, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Tooltip from '@/components/ui/tooltip';

interface TuitionEstimatorProps {
    courses: Course[];
}

interface TuitionInfo {
    id: string;
    credential_type: string;
    domestic_tuition: any;
    international_tuition: any;
}

// Helper to extract tuition from JSONB
const extractTuition = (jsonb: any, fallback: number): number => {
    if (!jsonb) return fallback;
    const val = jsonb.annualTuition || jsonb.domesticTuition || jsonb.tuition || jsonb.amount || jsonb.value;
    if (!val) return fallback;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
};

const FEE_DESCRIPTIONS: Record<string, string> = {
    'Program Tuition Fee': 'The core instruction fee covering academic lectures, credits, and faculty instruction for the semester.',
    'Student Activity Fee': 'Supports student union initiatives, clubs, recreation, student associations, campus social events, and student-led organizations.',
    'Technology Fee': 'Covers campus Wi-Fi, computer labs, software licensing (LMS, office suites), cloud services, and student digital resources.',
    'Athletics and Recreation Fee': 'Provides full access to campus fitness centers, athletic fields, recreation equipment, and organized varsity or intramural sports leagues.',
    'Convocation Fee': 'Covers the cost of your graduation ceremony, including gown rental, degree parchment printing, ceremony hosting, and administrative processing.',
    'Student Counselling Fee': 'Provides access to confidential, professional mental health counselling, academic guidance, stress management, and support resources.',
    'Program Transcript Fee': 'Covers the cost of printing, certifying, and sending official academic transcripts and enrollment letters throughout your study.',
    'Student Experience Fee': 'Funds campus-wide enrichment activities, workshops, career networking events, guest speaker series, and student engagement initiatives.'
};

const ANCILLARY_FEES = [
    { name: 'Student Activity Fee', amount: 150, description: FEE_DESCRIPTIONS['Student Activity Fee'] },
    { name: 'Technology Fee', amount: 100, description: FEE_DESCRIPTIONS['Technology Fee'] },
    { name: 'Athletics and Recreation Fee', amount: 75, description: FEE_DESCRIPTIONS['Athletics and Recreation Fee'] },
    { name: 'Convocation Fee', amount: 50, description: FEE_DESCRIPTIONS['Convocation Fee'] },
    { name: 'Student Counselling Fee', amount: 50, description: FEE_DESCRIPTIONS['Student Counselling Fee'] },
    { name: 'Program Transcript Fee', amount: 25, description: FEE_DESCRIPTIONS['Program Transcript Fee'] },
    { name: 'Student Experience Fee', amount: 50, description: FEE_DESCRIPTIONS['Student Experience Fee'] },
];

const FALLBACK_DOMESTIC = {
    CERTIFICATE: 2400,
    DIPLOMA: 2400,
    BACHELOR: 4000,
    MASTER: 5600,
};

const FALLBACK_INTERNATIONAL = {
    CERTIFICATE: 4000,
    DIPLOMA: 4000,
    BACHELOR: 6400,
    MASTER: 9600,
};

export default function TuitionEstimator({ courses }: TuitionEstimatorProps) {
    const [tuitionInfo, setTuitionInfo] = useState<TuitionInfo[]>([]);
    const [campus, setCampus] = useState('Ottawa');
    const [startTerm, setStartTerm] = useState('2026 Fall');
    const [residency, setResidency] = useState('International');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [submittedData, setSubmittedData] = useState<any | null>(null);
    const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({ 1: true });

    const schoolToFieldMap: Record<string, string> = {
        'arts': 'ARTS',
        'business': 'BUSINESS',
        'technology': 'TECHNOLOGY',
        'science': 'SCIENCE',
        'health-community': 'HEALTH',
        'hospitality-tourism': 'HOSPITALITY',
        'education-social-sciences': 'EDUCATION',
        'transportation-aviation': 'TRANSPORTATION',
    };

    useEffect(() => {
        const fetchTuitionInfo = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('tuition_info')
                .select('id, credential_type, domestic_tuition, international_tuition')
                .eq('status', 'active')
                .order('credential_type', { ascending: true });
            if (data) setTuitionInfo(data as TuitionInfo[]);
        };
        fetchTuitionInfo();
    }, []);

    // Handle course change
    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) {
            alert('Please select a program.');
            return;
        }

        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) return;

        // Determine years based on course duration and degree level
        let years = 2; // Default
        const durationStr = course.duration.toLowerCase();
        if (durationStr.includes('3 year')) {
            years = 3;
        } else if (durationStr.includes('4 year')) {
            years = 4;
        } else if (durationStr.includes('1 year')) {
            years = 1;
        } else if (durationStr.includes('6 month')) {
            years = 0.5;
        }

        const degreeLevel = course.degreeLevel;
        const isDomestic = residency === 'Domestic';

        const getAnnualFeeFromDB = (level: string, domestic: boolean): number => {
            const upper = level.toUpperCase();
            let credentialType: keyof typeof FALLBACK_DOMESTIC = 'BACHELOR';
            if (upper.includes('CERTIFICATE')) credentialType = 'CERTIFICATE';
            else if (upper.includes('DIPLOMA')) credentialType = 'DIPLOMA';
            else if (upper.includes('MASTER')) credentialType = 'MASTER';

            const info = tuitionInfo.find((t: any) => t.credential_type === credentialType);
            if (info) {
                const jsonb = domestic ? info.domestic_tuition : info.international_tuition;
                const fallback = domestic ? FALLBACK_DOMESTIC[credentialType] : FALLBACK_INTERNATIONAL[credentialType];
                return extractTuition(jsonb, fallback);
            }

            const fallback = domestic ? FALLBACK_DOMESTIC[credentialType] : FALLBACK_INTERNATIONAL[credentialType];
            return fallback;
        };

        const annualBase = getAnnualFeeFromDB(degreeLevel, isDomestic);
        const semesterBaseTuition = annualBase / 2;

        const totalSemesters = Math.ceil(years * 2);
        const programTuitionTotal = annualBase * years;
        const ancillaryFeesTotal = ANCILLARY_FEES.reduce((sum, fee) => sum + fee.amount, 0);

        setSubmittedData({
            course,
            campus,
            startTerm,
            residency,
            years,
            totalSemesters,
            semesterBaseTuition,
            programTuitionTotal,
            ancillaryFeesTotal,
        });

        // Initialize accordion with first semester open
        setOpenSemesters({ 1: true });
    };

    // Reset Form
    const handleReset = () => {
        setCampus('Ottawa');
        setStartTerm('2026 Fall');
        setResidency('International');
        setSelectedCourseId('');
        setSubmittedData(null);
        setOpenSemesters({ 1: true });
    };

    // Toggle semester accordion
    const toggleSemester = (semNum: number) => {
        setOpenSemesters(prev => ({
            ...prev,
            [semNum]: !prev[semNum]
        }));
    };

    // Helper to format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'CAD' }).format(val);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 my-12 text-black font-sans">
            {/* Left Controls Card */}
            <div className="lg:col-span-5 bg-[#f5f5f5] border border-[#e2e8f0] p-6 flex flex-col justify-between">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <label htmlFor="campus-select" className="text-xs font-bold uppercase tracking-wider text-[#000000]">Campus</label>
                            <Tooltip text="Cannoga College Ottawa campus offers full facilities, modern classrooms, and hands-on laboratory space in the heart of the capital." />
                        </div>
                        <select
                            id="campus-select"
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            className="w-full bg-white border border-[#e2e8f0] px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#9c27b3] transition-colors"
                        >
                            <option value="Ottawa">Ottawa</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <label htmlFor="start-term-select" className="text-xs font-bold uppercase tracking-wider text-[#000000]">Start Term</label>
                            <Tooltip text="Select the academic term you intend to start. Course schedules and availabilities may vary depending on the intake session." />
                        </div>
                        <select
                            id="start-term-select"
                            value={startTerm}
                            onChange={(e) => setStartTerm(e.target.value)}
                            className="w-full bg-white border border-[#e2e8f0] px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#9c27b3] transition-colors"
                        >
                            <option value="2026 Fall">2026 Fall</option>
                            <option value="2027 Winter">2027 Winter</option>
                            <option value="2027 Fall">2027 Fall</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <label htmlFor="residency-select" className="text-xs font-bold uppercase tracking-wider text-[#000000]">Residency</label>
                            <Tooltip text="Domestic fees apply to Canadian citizens and permanent residents. International student rates apply to all students studying on a Canadian study permit." />
                        </div>
                        <select
                            id="residency-select"
                            value={residency}
                            onChange={(e) => setResidency(e.target.value)}
                            className="w-full bg-white border border-[#e2e8f0] px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#9c27b3] transition-colors"
                        >
                            <option value="International">International</option>
                            <option value="Domestic">Domestic</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <label htmlFor="program-select" className="text-xs font-bold uppercase tracking-wider text-[#000000]">Program</label>
                            <Tooltip text="Choose your specific certificate, diploma, or degree program. Tuition rates are calculated based on the program's credential level." />
                        </div>
                        <select
                            id="program-select"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full bg-white border border-[#e2e8f0] px-4 py-3 text-sm font-bold text-black focus:outline-none focus:border-[#9c27b3] transition-colors"
                            required
                        >
                            <option value="">Select a Program...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title} ({course.degreeLevel === 'MASTER' ? "Master's Degree" : course.degreeLevel === 'BACHELOR' ? "Bachelor's Degree" : course.degreeLevel === 'DIPLOMA' ? 'Ontario College Diploma' : 'Canadian Certificate'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 cc-btn-outline py-3 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={14} /> Reset
                        </button>
                        <button
                            type="submit"
                            className="flex-1 cc-btn-primary py-3 flex items-center justify-center"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Results Panel */}
            <div className="lg:col-span-7 bg-white border border-[#e2e8f0] p-6 min-h-[400px] flex flex-col justify-between">
                {!submittedData ? (
                    <div className="flex flex-col items-center justify-center text-center h-full py-16 space-y-4">
                        <Info size={48} className="text-[#000000] opacity-40" />
                        <h3 className="text-lg font-bold text-[#000000] uppercase">Tuition Estimation</h3>
                        <p className="text-neutral-500 text-sm max-w-sm">
                            Select your Campus, Start Term, Residency, and Program on the left, then click <strong>Submit</strong> to calculate your fee breakdown.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header Details */}
                        <div className="border-b-2 border-[#9c27b3] pb-4">
                            <h3 className="text-2xl font-black text-[#000000] uppercase tracking-tight mb-2 underline decoration-[#000000] decoration-2 underline-offset-4">
                                {submittedData.course.title.toUpperCase()}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-neutral-600">
                                <span>• Full-time</span>
                                <span>• On Campus</span>
                                <span>• {submittedData.years} {submittedData.years === 1 ? 'Year' : 'Years'}</span>
                                <span className="text-[#000000]">
                                    {submittedData.course.degreeLevel === 'MASTER' ? "Master's Degree" : submittedData.course.degreeLevel === 'BACHELOR' ? "Bachelor's Degree" : submittedData.course.degreeLevel === 'DIPLOMA' ? 'Ontario College Diploma' : 'Canadian Certificate'}
                                </span>
                            </div>
                            <div className="mt-3 text-xs font-bold text-[#000000]">
                                Start Term: {submittedData.startTerm}
                            </div>
                        </div>

                        {/* Accordion List */}
                        <div className="space-y-3">
                            {Array.from({ length: submittedData.totalSemesters }).map((_, idx) => {
                                const semNum = idx + 1;
                                const isOpen = !!openSemesters[semNum];

                                return (
                                    <div key={semNum} className="border border-[#e2e8f0]">
                                        {/* Accordion Title */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSemester(semNum)}
                                            className="w-full bg-[#f5f5f5] px-4 py-3 flex items-center justify-between text-sm font-bold text-[#000000] uppercase hover:bg-[#fafafa]"
                                        >
                                            <span>Semester {semNum}</span>
                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                         {/* Accordion Content */}
                                         {isOpen && (
                                             <div className="p-4 bg-white divide-y divide-[#f3f4f6]">
                                                 {/* Tuition Base */}
                                                 <div className="flex justify-between py-2 text-xs items-center">
                                                     <span className="font-semibold text-neutral-700 flex items-center gap-1">
                                                         Program Tuition Fee
                                                         <Tooltip text={FEE_DESCRIPTIONS['Program Tuition Fee']} />
                                                     </span>
                                                     <span className="font-bold">{formatCurrency(submittedData.semesterBaseTuition)}</span>
                                                 </div>

                                                 {/* Ancillary Fees */}
                                                 {ANCILLARY_FEES.map((fee) => (
                                                     <div key={fee.name} className="flex justify-between py-2 text-xs items-center">
                                                         <span className="font-semibold text-neutral-700 flex items-center gap-1">
                                                             {fee.name}
                                                             <Tooltip text={fee.description} />
                                                         </span>
                                                         <span className="font-bold">{formatCurrency(fee.amount)}</span>
                                                     </div>
                                                 ))}

                                                 {/* Semester Total */}
                                                 <div className="flex justify-between pt-3 pb-1 text-sm font-black text-[#000000]">
                                                     <span>SEMESTER {semNum} TOTAL</span>
                                                     <span>{formatCurrency(submittedData.semesterBaseTuition + submittedData.ancillaryFeesTotal)}</span>
                                                 </div>
                                             </div>
                                         )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary / Total Box */}
                        <div className="bg-[#f5f5f5] p-4 border border-[#e2e8f0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-neutral-500 uppercase">Estimated Total Tuition</h4>
                                <p className="text-[10px] text-neutral-400 font-semibold leading-tight mt-0.5">Based on {submittedData.years} year(s) at {formatCurrency(submittedData.semesterBaseTuition)} per semester + ancillary fees</p>
                            </div>
                            <div className="text-xl font-black text-[#000000]">
                                {formatCurrency(submittedData.programTuitionTotal + (submittedData.ancillaryFeesTotal * submittedData.totalSemesters))}
                            </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                            *Disclaimer: Fees listed are estimates based on the current academic year schedule. Actual tuition and fee rates are subject to change and may vary depending on courses selected, course loads, and other factors.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

