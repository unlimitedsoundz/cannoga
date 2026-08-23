'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Hero } from '@/components/layout/Hero';
import { CANONICAL_INTAKES } from '@/lib/intakes';
import { CaretDown } from '@phosphor-icons/react/dist/ssr';

export default function ApplyPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [alternateCourseId, setAlternateCourseId] = useState('');
  const [desiredIntake, setDesiredIntake] = useState('');
  const [programType, setProgramType] = useState('Academic Program');
  const [englishFirstLanguage, setEnglishFirstLanguage] = useState('YES');
  const [englishPathway, setEnglishPathway] = useState('NO');
  const [isInCanada, setIsInCanada] = useState('NO');
  const [hasValidPermit, setHasValidPermit] = useState('NO');
  const [hasRejection, setHasRejection] = useState('NO');
  const [hasPAL, setHasPAL] = useState('NO');
  const [releaseConsent, setReleaseConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const initialProgram = searchParams.get('program');

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser || null);

        if (currentUser) {
          const { data, error } = await supabase
            .from('Course')
            .select(`*, school:School(name, slug)`)
            .order('title');

          if (error) throw error;
          const uniqueCourses = (data || []).filter((course: any, index: number, self: any[]) =>
            index === self.findIndex((c: any) => c.title === course.title)
          );
          setCourses(uniqueCourses);
        }
      } catch (err) {
        console.error('ApplyPage init error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [supabase]);

  useEffect(() => {
    if (initialProgram && courses.length > 0) {
      const matchedCourse = courses.find((course) => course.slug === initialProgram || String(course.id) === initialProgram);
      if (matchedCourse) {
        setSelectedCourseId(matchedCourse.id);
      }
    }
  }, [initialProgram, courses]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCourseId) {
      setSubmissionMessage({ type: 'error', text: 'Please select an Academic Program Choice.' });
      return;
    }

    if (!releaseConsent) {
      setSubmissionMessage({ type: 'error', text: 'Please agree to the release of information consent.' });
      return;
    }

    setIsSubmitting(true);
    setSubmissionMessage(null);

    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check:', { user: !!currentUser, authError });
      if (authError || !currentUser) {
        setSubmissionMessage({ type: 'error', text: 'Authentication required. Please log in again.' });
        router.push('/portal/account/login/?redirect=/portal/apply');
        return;
      }

      const { data, error } = await supabase.rpc('create_application_v2', {
        p_user_id: currentUser.id,
        p_course_id: selectedCourseId,
        p_intake: desiredIntake,
        p_program_type: programType,
        p_english_first_language: englishFirstLanguage,
        p_english_pathway_completed: englishPathway,
        p_is_in_canada: isInCanada,
        p_has_valid_study_permit: hasValidPermit,
        p_has_study_permit_rejection: hasRejection,
        p_has_pal: hasPAL,
        p_alternate_course_id: alternateCourseId || null,
        p_release_of_information_consent: releaseConsent
      });

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('RPC error details:', error);
        throw error;
      }

      if (!data?.id) {
        throw new Error('Unable to create application.');
      }

      // Trigger Application Submitted & Under Review Notification
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            applicationId: data.id,
            type: 'APPLICATION_SUBMITTED'
          }
        });
      } catch (notifyErr) {
        console.warn('Notification invocation note:', notifyErr);
      }

      router.push(`/portal/application/view/?id=${data.id}`);
    } catch (err: any) {
      console.error('Apply submit error:', err);
      console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      setSubmissionMessage({ type: 'error', text: err?.message || 'Submission failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="w-full">
        <Hero
          title="Online Application for International Students"
          body="Complete your international application by selecting your desired term, programme choice, and admission details in one place."
          backgroundColor="#000000"
          tinted
          lightText={true}
          image={{ src: '/images/international-students-hero.png', alt: 'International students' }}
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Apply' }]}
        />

        <div className="cc-container max-w-2xl mx-auto py-6">
          {submissionMessage && (
            <div className={`p-3 rounded-sm mb-4 text-[13px] font-bold border ${submissionMessage.type === 'success' ? 'bg-neutral-50 text-black border-neutral-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {submissionMessage.text}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h1 className="text-xl font-bold mb-1.5 text-black">Online Application for International Students</h1>

            <div className="mb-4 text-[13px] text-black leading-snug space-y-0.5 font-medium">
              <p>
                Complete your international application by selecting your desired intake term, programme choices, and study permit details below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Section 1: Academic Choices */}
              <div className="space-y-3">
                <h2 className="-mx-6 px-6 py-1.5 bg-neutral-100 text-black text-[13px] font-bold mb-3 border-y border-neutral-200/60">
                  Academic Programme &amp; Intake
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Program Type <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Academic Program">Academic Program</option>
                      <option value="English Language Program">English Language Program</option>
                      <option value="Pathway Program">Pathway Program</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Desired Intake Term <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={desiredIntake}
                      onChange={(e) => setDesiredIntake(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="">Select term</option>
                      {CANONICAL_INTAKES.map((it: any) => (
                        <option key={it.id} value={it.label}>{it.label}</option>
                      ))}
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Primary Program Choice <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="">Select your programme</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title} {course.degreeLevel}</option>
                      ))}
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Alternate Program Choice <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={alternateCourseId}
                      onChange={(e) => setAlternateCourseId(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="">Select an alternate programme</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>{course.title} {course.degreeLevel}</option>
                      ))}
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Section 2: Language Proficiency */}
              <div className="pt-2 space-y-3">
                <h2 className="-mx-6 px-6 py-1.5 bg-neutral-100 text-black text-[13px] font-bold mb-3 border-y border-neutral-200/60">
                  Language Background
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    English First Language? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={englishFirstLanguage}
                      onChange={(e) => setEnglishFirstLanguage(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Completed English Pathway? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={englishPathway}
                      onChange={(e) => setEnglishPathway(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Section 3: Immigration & Canada Status */}
              <div className="pt-2 space-y-3">
                <h2 className="-mx-6 px-6 py-1.5 bg-neutral-100 text-black text-[13px] font-bold mb-3 border-y border-neutral-200/60">
                  Immigration &amp; Canadian Status
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Currently in Canada? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={isInCanada}
                      onChange={(e) => setIsInCanada(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Valid Study Permit / LOA? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={hasValidPermit}
                      onChange={(e) => setHasValidPermit(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Prior Permit Rejection? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={hasRejection}
                      onChange={(e) => setHasRejection(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <label className="w-full sm:w-44 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                    Prior PAL Received? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative w-full max-w-[400px]">
                    <select
                      required
                      value={hasPAL}
                      onChange={(e) => setHasPAL(e.target.value)}
                      className="w-full h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none pr-8 cursor-pointer"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                    <CaretDown size={14} weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Section 4: Declaration & Consent */}
              <div className="pt-2 space-y-3">
                <h2 className="-mx-6 px-6 py-1.5 bg-neutral-100 text-black text-[13px] font-bold mb-3 border-y border-neutral-200/60">
                  Consent &amp; Declaration
                </h2>

                <div className="flex items-start gap-3 sm:ml-44">
                  <input
                    id="releaseConsent"
                    type="checkbox"
                    checked={releaseConsent}
                    onChange={(e) => setReleaseConsent(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 text-black border border-neutral-200 rounded-lg cursor-pointer"
                  />
                  <label htmlFor="releaseConsent" className="text-[13px] text-black font-medium leading-snug cursor-pointer">
                    I give my consent to Cannoga University to release application information as requested. <span className="text-red-600">*</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-center sm:justify-start sm:pl-44">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-[400px] h-[40px] bg-neutral-900 hover:bg-black text-white text-[13px] font-bold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Hero
        title="Welcome to Cannaga Student Portal"
        body="This platform will help you complete important tasks and access services throughout your academic journey with Cannoga University."
        backgroundColor="#000000"
        tinted
        lightText={true}
        image={{ src: '/images/international-students-hero.png', alt: 'Cannaga students' }}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal' }]}
      />

      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-black mb-4">New users, to create a new account select the option below that best fits your needs.</p>
        <p className="text-base text-black font-medium mb-6">Already have a Cannoga portal account? Please <Link href="/portal/account/login/" className="text-primary underline">log in</Link> instead.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/portal/account/register/?type=international" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">International Applicant</div>
            <div className="p-4">
              <img src="/images/international-students-hero.jpg" alt="International" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are an international applicant and don't have an account yet, click "International Applicant" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register/?type=new" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">New Student</div>
            <div className="p-4">
              <img src="/images/school-of-business.jpg" alt="New Student" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are a new student and don't have network credentials yet, click "New Student" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register/?type=alumni" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">Alumni</div>
            <div className="p-4">
              <img src="/images/alumni-hero.png" alt="Alumni" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are alumni and know your student number, click "Alumni" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register/?type=other" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">Other</div>
            <div className="p-4">
              <img src="/images/student-story-2.jpg" alt="Other" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you do not fit into the other categories and would like to submit a case to Registrar's Office, choose "Other".</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
