'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types/database';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CANONICAL_INTAKES } from '@/lib/intakes';

interface CourseSelectorProps {
    initialCourses: (Course & { school: { name: string, slug: string } | null })[];
    initialSelected?: string | null;
}

export default function CourseSelector({ initialCourses, initialSelected }: CourseSelectorProps) {
    const [filter, setFilter] = useState<'ALL' | 'CERTIFICATE' | 'DIPLOMA' | 'BACHELOR' | 'MASTER'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedIntake, setSelectedIntake] = useState<string>('Fall 2026');
    const [tuitionRates, setTuitionRates] = useState<Record<string, Record<string, number>>>({});
    const router = useRouter();
    const supabase = createClient();

    // Fetch tuition rates on mount
    useEffect(() => {
        const fetchTuitionRates = async () => {
            const { data } = await supabase
                .from('tuition_rates')
                .select('degree_level, field, annual_fee');
            
            if (data) {
                const rates: Record<string, Record<string, number>> = {};
                for (const r of data) {
                    if (!rates[r.degree_level]) rates[r.degree_level] = {};
                    rates[r.degree_level][r.field] = r.annual_fee;
                }
                setTuitionRates(rates);
            }
        };
        fetchTuitionRates();
    }, [supabase]);

    // Pre-select course if initialSelected is provided
    useEffect(() => {
        if (initialSelected) {
            const course = initialCourses.find(c => c.slug === initialSelected);
            if (course) {
                setSelectedCourse(course.id);
            }
        }
    }, [initialSelected, initialCourses]);

    const handleSelectProgramme = async (courseId: string) => {
        setIsSubmitting(courseId);
        try {
            // 1. Get current user & credentials
            const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

            console.log('[CourseSelector] Auth Check:', {
                hasUser: !!currentUser,
                userId: currentUser?.id,
                error: authError
            });

            if (authError || !currentUser) {
                console.error('[CourseSelector] Auth failed:', authError);
                alert(`Session validation failed: ${authError?.message || 'No active session'}`);
                // router.push('/portal/account/login/?redirect=/portal/apply'); // Temporarily disable auto-redirect to see the alert
                return;
            }

            let studentId = (currentUser as any)?.user_metadata?.student_id;
            let dob = (currentUser as any)?.user_metadata?.date_of_birth;

            // Fallback: If we have a user but metadata is missing, fetch from profiles
            if (!studentId || !dob) {
                console.log('Metadata missing, fetching profile fallback...');
                const { data: dbProfile } = await supabase
                    .from('profiles')
                    .select('student_id, date_of_birth')
                    .eq('id', currentUser.id)
                    .single();

                if (dbProfile) {
                    studentId = dbProfile.student_id;
                    dob = dbProfile.date_of_birth;
                    console.log('Profile fallback successful');
                }
            }

            // Proceed without DOB/Student ID blockers as requested
            console.log('Proceeding to application creation...', {
                userId: currentUser.id,
                courseId,
                hasStudentId: !!studentId,
                hasDob: !!dob
            });

            console.log('Calling Secure Application Creation RPC...', {
                userId: currentUser.id,
                courseId,
                studentId
            });

            // 2. Call the Secure RPC (Bypasses RLS with local validation)
            const { data, error: rpcError } = await supabase.rpc('create_application_v2', {
                p_user_id: currentUser.id,
                p_course_id: courseId,
                p_student_id: studentId || null,
                p_dob: dob || null
            });

            if (rpcError) {
                console.error('RPC Execution Error:', rpcError);
                throw rpcError;
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            // Persist the chosen intake on the newly created application
            try {
                await supabase
                    .from('applications')
                    .update({ intake: selectedIntake })
                    .eq('id', data.id);
            } catch (intakeError) {
                console.error('Failed to set intake on application:', intakeError);
            }

            router.push(`/portal/application/?id=${data.id}`);
        } catch (error: any) {
            console.error('Detailed Application Creation Error:', {
                message: error.message,
                code: error.code,
                details: error.details,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
            alert(`Failed to create application: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(null);
        }
    };

    const filteredCourses = initialCourses.filter(course => {
        const matchesFilter = filter === 'ALL' || course.degreeLevel === filter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.school?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-neutral-50 p-6 rounded-sm border border-neutral-100">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <span className="text-[11px] font-bold text-black">Filter by Level</span>
                    <div className="flex flex-wrap gap-2">
                        {(['ALL', 'CERTIFICATE', 'DIPLOMA', 'BACHELOR', 'MASTER'] as const).map((level) => (
                            <button
                                key={level}
                                onClick={() => setFilter(level)}
                                className={`px-4 py-2 text-[13px] font-bold rounded-sm border transition-all ${filter === level
                                    ? 'bg-transparent text-black border-neutral-900 shadow-sm'
                                    : 'bg-white text-black border-neutral-200 hover:border-neutral-400'
                                    }`}
                            >
                                {level === 'ALL' ? 'All Programs' : level === 'CERTIFICATE' ? 'Certificate' : level === 'DIPLOMA' ? 'Diploma' : level === 'BACHELOR' ? 'Bachelors' : 'Masters'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-64">
                    <span className="text-[11px] font-bold text-black">Intake</span>
                    <select
                        value={selectedIntake}
                        onChange={(e) => setSelectedIntake(e.target.value)}
                        className="bg-white border border-neutral-200 px-4 py-2 text-[11px] font-bold text-black focus:outline-none focus:border-[#0a151a] transition-colors w-full"
                    >
                        {CANONICAL_INTAKES.map((it) => (
                            <option key={it.id} value={it.label}>
                                {it.label} ({it.month})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-64">
                    <p className="text-black text-[11px] font-bold mb-10 leading-relaxed max-w-2xl">
                Choose the programme you wish to apply for. Multiple active applications are permitted.
                Ensure you meet the minimum entry requirements listed in the programme details.
            </p>
                    <input
                        type="text"
                        placeholder="Name or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-neutral-200 px-4 py-2 text-[11px] font-bold text-black placeholder:text-black focus:outline-none focus:border-[#0a151a] transition-colors w-full"
                    />
                </div>
            </div>

            {/* Course List */}
            <div className="grid gap-4">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white p-6 rounded-sm border border-neutral-100 flex flex-col md:flex-row gap-8 transition-all hover:border-neutral-300 group">
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-black leading-none group-hover:text-black transition-colors">{course.title}</h3>
                                    <p className="text-[11px] text-black font-semibold leading-none">{course.school?.name}</p>
                                </div>
                                 <span className={`px-2 py-1 rounded-sm text-[11px] font-bold border transition-colors ${
                                     course.degreeLevel === 'MASTER' ? 'border-[#0a151a] text-black'
                                     : course.degreeLevel === 'CERTIFICATE' ? 'border-amber-400 text-amber-700 bg-amber-50'
                                     : course.degreeLevel === 'DIPLOMA' ? 'border-blue-300 text-blue-700 bg-blue-50'
                                     : 'border-neutral-300 text-black'
                                     }`}>
                                     {course.degreeLevel === 'MASTER' ? 'Masters' : course.degreeLevel === 'CERTIFICATE' ? 'Certificate' : course.degreeLevel === 'DIPLOMA' ? 'Diploma' : 'Bachelors'}
                                 </span>
                            </div>
                            <p className="text-[13px] text-black font-medium mb-6 line-clamp-2 leading-relaxed">
                                {course.description || "Advancing knowledge and innovation through world-class research and education."}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                <span className="flex items-center gap-2 text-[13px] font-bold text-black">
                                    {course.duration}
                                    {course.programType && (
                                        <span className="ml-2 px-2 py-0.5 rounded-sm bg-neutral-100 text-black group-hover:bg-[#0a151a]/5 group-hover:text-black transition-colors">
                                            {course.programType}
                                        </span>
                                    )}
                                </span>
                                 {(() => {
                                     const schoolSlug = course.school?.slug || '';
                                     const fieldMap: Record<string, string> = {
                                         'arts': 'ARTS',
                                         'business': 'BUSINESS',
                                         'technology': 'TECHNOLOGY',
                                         'science': 'SCIENCE',
                                         'health-community': 'HEALTH',
                                         'hospitality-tourism': 'HOSPITALITY',
                                         'education-social-sciences': 'EDUCATION',
                                         'transportation-aviation': 'TRANSPORTATION',
                                     };
                                     const field = fieldMap[schoolSlug] || 'BUSINESS';
                                     const upper = course.degreeLevel.toUpperCase();
                                     
                                     const getRate = (isInternational: boolean) => {
                                         const rateKey = isInternational ? `${field}_INTERNATIONAL` : field;
                                          return tuitionRates[upper]?.[rateKey] || (isInternational ? 6400 : 2400);
                                     };
                                     
                                     const domesticFee = getRate(false);
                                     const internationalFee = getRate(true);

                                     return (
                                         <div className="flex flex-wrap items-center gap-3">
                                             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-neutral-100 text-black font-bold text-[13px]">
                                                 ${domesticFee.toLocaleString()} <span className="text-[11px] text-black font-medium lowercase ml-1">/ year (Domestic)</span>
                                             </div>
                                             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-neutral-100 text-black font-bold text-[13px]">
                                                 ${internationalFee.toLocaleString()} <span className="text-[11px] text-black font-medium lowercase ml-1">/ year (International)</span>
                                             </div>
                                         </div>
                                     );
                                 })()}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center min-w-[160px]">
                            <button
                                onClick={() => handleSelectProgramme(course.id)}
                                disabled={isSubmitting !== null}
                                className="bg-transparent border border-neutral-900 text-black font-bold text-[13px] py-4 px-8 rounded-sm hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 min-w-[200px]"
                            >
                                {isSubmitting === course.id ? 'Processing...' : 'Select Programme'}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20 text-[11px] font-bold text-black border border-neutral-100 rounded-sm bg-neutral-50">
                        {searchQuery || filter !== 'ALL'
                            ? `No ${filter !== 'ALL' ? filter.toLowerCase() : ''} programmes match your search.`
                            : "No academic programmes currently available for application."}
                    </div>
                )}
            </div>
        </div>
    );
}

