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
        router.push('/portal/account/login?redirect=/portal/apply');
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

      router.push(`/portal/application/view?id=${data.id}`);
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

        <div className="cc-container max-w-3xl mx-auto py-10">
          <div className="bg-white border border-neutral-100 shadow-sm p-8 rounded-sm">
            <h2 className="text-base font-bold uppercase tracking-[0.25em] text-[#2d2d2d] mb-6">Online Application for International Student</h2>

            {submissionMessage && (
              <div className={`p-4 mb-6 rounded-sm text-sm font-bold border ${submissionMessage.type === 'success' ? 'bg-green-50 text-black border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                {submissionMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Is English your First Language? *</label>
                <div className="relative">
                  <select
                    required
                    value={englishFirstLanguage}
                    onChange={(e) => setEnglishFirstLanguage(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Program Type *</label>
                <div className="relative">
                  <select
                    required
                    value={programType}
                    onChange={(e) => setProgramType(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="Academic Program">Academic Program</option>
                    <option value="English Language Program">English Language Program</option>
                    <option value="Pathway Program">Pathway Program</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Did you complete an English pathway program at a partner language school? *</label>
                <div className="relative">
                  <select
                    required
                    value={englishPathway}
                    onChange={(e) => setEnglishPathway(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Desired Academic Term *</label>
                <div className="relative">
                  <select
                    required
                    value={desiredIntake}
                    onChange={(e) => setDesiredIntake(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="">Select term</option>
                    {CANONICAL_INTAKES.map((it: any) => (
                      <option key={it.id} value={it.label}>{it.label}</option>
                    ))}
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Academic Program Choice *</label>
                <div className="relative">
                  <select
                    required
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="">Select your programme</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title} — {course.degreeLevel}</option>
                    ))}
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Alternate Program Choice *</label>
                <div className="relative">
                  <select
                    required
                    value={alternateCourseId}
                    onChange={(e) => setAlternateCourseId(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="">Select an alternate programme</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title} — {course.degreeLevel}</option>
                    ))}
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Are you currently in Canada? *</label>
                <div className="relative">
                  <select
                    required
                    value={isInCanada}
                    onChange={(e) => setIsInCanada(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Do you have a valid Study Permit or Approval Letter from IRCC? *</label>
                <div className="relative">
                  <select
                    required
                    value={hasValidPermit}
                    onChange={(e) => setHasValidPermit(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Have you ever received a Study Permit rejection from IRCC? *</label>
                <div className="relative">
                  <select
                    required
                    value={hasRejection}
                    onChange={(e) => setHasRejection(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Have you ever received a Provincial Attestation Letter (PAL)? *</label>
                <div className="relative">
                  <select
                    required
                    value={hasPAL}
                    onChange={(e) => setHasPAL(e.target.value)}
                    className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-black appearance-none pr-10"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                  <CaretDown size={16} weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="releaseConsent"
                  type="checkbox"
                  checked={releaseConsent}
                  onChange={(e) => setReleaseConsent(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 text-black border border-neutral-200 rounded-sm"
                />
                <label htmlFor="releaseConsent" className="text-sm text-black font-medium">
                  I give my consent to Cannoga University to release application information as requested. *
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-3 rounded-sm hover:opacity-95 transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
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
        <p className="text-base text-black font-medium mb-6">Already have a Cannoga portal account? Please <Link href="/portal/account/login" className="text-primary underline">log in</Link> instead.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/portal/account/register?type=international" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">International Applicant</div>
            <div className="p-4">
              <img src="/images/international-students-hero.jpg" alt="International" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are an international applicant and don't have an account yet, click "International Applicant" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register?type=new" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">New Student</div>
            <div className="p-4">
              <img src="/images/school-of-business.jpg" alt="New Student" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are a new student and don't have network credentials yet, click "New Student" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register?type=alumni" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
            <div className="px-4 py-3 bg-primary text-white font-semibold">Alumni</div>
            <div className="p-4">
              <img src="/images/alumni-hero.png" alt="Alumni" className="w-full h-28 object-cover rounded-md mb-3" />
              <p className="text-sm text-black">If you are alumni and know your student number, click "Alumni" to create an account.</p>
            </div>
          </Link>

          <Link href="/portal/account/register?type=other" className="block bg-white border border-slate-200 hover:shadow-md rounded-md overflow-hidden">
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
