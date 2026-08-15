import Link from 'next/link';
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { StepBadge } from '@/components/ui/StepBadge';

const steps = [
  {
    step: 1,
    title: "Confirm your program is open",
    content: (
      <div className="space-y-4">
        <p>Confirm your program is open for international students. Check the program details for availability.</p>
        <div className="border-l-2 border-black pl-3 py-1 my-2">
          <p className="text-xs text-neutral-700 font-medium">
            <strong>Note:</strong> When choosing a program, ensure it is not an online-only program. Cannoga College is located in Ottawa, Ontario, Canada.
          </p>
        </div>
        <Link href="/studies" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
          Confirm your program <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    )
  },
  {
    step: 2,
    title: "Review Admission Requirements",
    content: (
      <div className="space-y-4">
        <p>Review the admission requirements for your country and program. Ensure you meet all academic and language requirements.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-black">
          <li>Admission Requirements per Country</li>
          <li>English Language Proficiency Tests & Scores</li>
          <li>Exemptions from English Proficiency Requirements</li>
        </ul>
      </div>
    )
  },
  {
    step: 3,
    title: "Review Visa/Study Permit/Work Requirements",
    content: (
      <div className="space-y-4">
        <p>Review the visa and study permit requirements for international students in Canada.</p>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline"
        >
          Review Visa/Study Permit Requirements <ArrowRight size={16} weight="bold" />
        </a>
      </div>
    )
  },
  {
    step: 4,
    title: "Fill in the Online Application 2026",
    content: (
      <div className="space-y-4">
        <p>Start your 2026 online application through our admissions portal. Create an account to upload documents and track your application.</p>
        <Link href="/portal/account/register" className="inline-flex items-center gap-2 bg-[#0f2027] text-white px-6 py-3 text-sm font-bold hover:bg-[#0f2027] transition-colors">
          Fill in the Online Application 2026 <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    )
  },
  {
    step: 5,
    title: "Receive Letter of Acceptance",
    content: (
      <div className="space-y-4">
        <p>Once your application is reviewed and accepted, you will receive a Letter of Acceptance via the online application portal.</p>
        <p className="text-sm text-black">Read more about next steps and important deadlines.</p>
      </div>
    )
  },
  {
    step: 6,
    title: "Pay Your Fees",
    content: (
      <div className="space-y-4">
        <p>Pay your tuition and fees through the student portal to secure your enrollment and receive your Provincial Attestation Letter (PAL) within 6–10 working days.</p>
        <Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline">
          Pay Your Fees <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    )
  },
  {
    step: 7,
    title: "Apply for a Study Permit",
    content: (
      <div className="space-y-4">
        <p>Apply for your study permit and any required visas through the Government of Canada website.</p>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0f2027] hover:underline"
        >
          Apply for Study Permit <ArrowRight size={16} weight="bold" />
        </a>
      </div>
    )
  },
  {
    step: 8,
    title: "Register and attend International Student Orientation",
    content: (
      <div className="space-y-4">
        <p>Register and attend your International Student Orientation, where you will meet new friends, have fun and learn important information about Cannoga and about being an international student in Canada.</p>
      </div>
    )
  },
  {
    step: 9,
    title: "Arrange for travel/airport pickup",
    content: (
      <div className="space-y-4">
        <p>Arrange your travel to Canada and book your airport pickup. Cannoga College provides airport pickup services for new international students.</p>
      </div>
    )
  }
];


export default function ApplicationProcess() {
  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-black text-black mb-4">Steps to Apply</h2>
      <p className="text-sm text-neutral-700 font-medium mb-8 leading-relaxed">
        To ensure your application to Cannoga College has the best chance of success, follow our simple {steps.length}-step process.
      </p>

      <div className="space-y-8 divide-y divide-neutral-200">
        {steps.map((step) => (
            <div key={step.step} className="pt-6 first:pt-0">
              <div className="flex items-start gap-4">
                <StepBadge step={step.step} />
                <div className="flex-1">
                  <h3 className="text-base font-bold text-black mb-2">{step.title}</h3>
                  <div className="text-sm text-neutral-700 font-medium leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200">
        <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
          If you have any questions, please don&apos;t hesitate to contact the International Recruitment Team at <a href="mailto:admissions@cannogacollege.ca" className="text-black font-bold underline hover:text-[#c89211] transition-colors">admissions@cannogacollege.ca</a>. We&apos;re always happy to help!
        </p>
      </div>
    </div>
  );
}
