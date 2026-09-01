import Link from 'next/link';
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { StepBadge } from '@/components/ui/StepBadge';
import AdmissionsHelpCard from '@/components/admissions/AdmissionsHelpCard';

const steps = [
  {
    step: 1,
    title: "Confirm your program is open",
    content: (
      <div className="space-y-4">
        <p>Confirm your program is open for international students. Check the program details for availability.</p>
        <div className="border-l-2 border-black pl-3 py-1 my-2">
          <p className="text-base text-black font-medium">
            <strong>Note:</strong> When choosing a program, ensure it is not an online-only program. Cannoga College is located in Ottawa, Ontario, Canada.
          </p>
        </div>
        <Link href="/studies/" className="inline-flex items-center gap-2 text-lg font-bold text-[#0f2027] hover:underline">
          View Programs <ArrowRight size={20} weight="bold" />
        </Link>
      </div>
    )
  },
  {
    step: 2,
    title: "Check Country-Specific Requirements",
    content: (
      <div className="space-y-4">
        <p>Check the admission and credential requirements specific to your home country before starting your application.</p>
        <Link href="/admissions/requirements/" className="inline-flex items-center gap-2 text-lg font-bold text-[#0f2027] hover:underline">
          Check Requirements <ArrowRight size={20} weight="bold" />
        </Link>
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
          className="inline-flex items-center gap-2 text-lg font-bold text-[#0f2027] hover:underline"
        >
          Review Visa/Study Permit Requirements <ArrowSquareOut size={20} weight="bold" />
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
        <Link href="/portal/account/register/" className="inline-flex items-center gap-2 bg-[#0f2027] text-white px-6 py-3 text-lg font-bold hover:bg-[#0f2027] transition-colors">
          Fill in the Online Application 2026 <ArrowRight size={20} weight="bold" />
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
        <p className="text-lg text-black">Read more about next steps and important deadlines.</p>
      </div>
    )
  },
  {
    step: 6,
    title: "Pay Your Fees",
    content: (
      <div className="space-y-4">
        <p>Pay your tuition and fees through the student portal to secure your enrollment and receive your Provincial Attestation Letter (PAL) within 6–10 working days.</p>
        <Link href="/portal/dashboard/" className="inline-flex items-center gap-2 text-lg font-bold text-[#0f2027] hover:underline">
          Pay Your Fees <ArrowRight size={20} weight="bold" />
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
          className="inline-flex items-center gap-2 text-lg font-bold text-[#0f2027] hover:underline"
        >
          Apply for Study Permit <ArrowSquareOut size={20} weight="bold" />
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
      <p className="text-lg text-black font-medium mb-8 leading-relaxed">
        To ensure your application to Cannoga College has the best chance of success, follow our simple {steps.length}-step process.
      </p>

      <div className="space-y-8 divide-y divide-neutral-200">
        {steps.map((step) => (
            <div key={step.step} className="pt-6 first:pt-0">
              <div className="flex items-start gap-4">
                <StepBadge step={step.step} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
                  <div className="text-lg text-black font-medium leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-12 pt-4">
        <AdmissionsHelpCard
          title="QUESTIONS ABOUT THE ADMISSIONS PROCESS?"
          description="If you have any questions, please don't hesitate to contact the International Recruitment Team at admissions@cannogacollege.ca. We're always happy to help!"
          email="admissions@cannogacollege.ca"
          phone="+1 (227) 250-0427"
          variant="orange"
        />
      </div>
    </div>
  );
}
