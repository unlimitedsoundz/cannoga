const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: 'postgresql://postgres.lbkrzyqpdqgtqbodkcyi:Guiliababy21@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function updateDatabase() {
  await client.connect();
  console.log('Connected to Postgres.');

  // 1. Update faq_pages
  await client.query(`
    UPDATE faq_pages 
    SET name = 'Advanced Diploma Admissions' 
    WHERE slug = 'admissions/master' OR id = 'ddaa8228-1ec6-46b4-975c-ee6e0d69d14b'
  `);
  console.log('✓ Updated faq_pages table');

  // 2. Update faq table
  const faqUpdates = [
    {
      id: 'd98c083f-1969-48a9-b0dd-c69e067db9f9',
      question: 'What is the tuition fee for domestic students?',
      answer: 'Tuition fees for domestic students vary by credential. Certificate and Diploma programs (1–2 years) are $2,400 per semester ($4,800/year), 3-Year Advanced Diploma programs are $2,800 per semester ($5,600/year), and Bachelor’s degree programs are $3,750 per semester ($7,500/year).'
    },
    {
      id: 'f383b60a-ee5b-4f49-a484-f803f3d7d0af',
      question: 'What is the tuition fee for international students?',
      answer: 'Tuition fees for international students vary by credential. Certificate and Diploma programs (1–2 years) are $4,000 per semester ($8,000/year), 3-Year Advanced Diploma programs are $4,800 per semester ($9,600/year), and Bachelor’s degree programs are $5,500 per semester ($11,000/year).'
    },
    {
      id: '48294784-6ddc-443b-95cb-cf985e0ec2d5',
      question: 'What are the admission requirements for Advanced Diploma programs?',
      answer: "Admission to Cannoga College's 3-year Advanced Diploma programs requires an Ontario Secondary School Diploma (OSSD) or recognized Canadian / international high school equivalent, including Grade 12 English and stream-specific prerequisites (such as senior Mathematics or Sciences). International applicants must provide proof of English proficiency (IELTS Academic 6.0 overall with no band below 5.5, TOEFL iBT 80, PTE 58, or equivalent). Mature students (age 19+) may qualify through admissions assessment or relevant prior learning."
    },
    {
      id: '4c57738d-6ccb-4f5e-82b1-a522eb0a9f61',
      question: 'Is there a thesis requirement for Advanced Diploma programs?',
      answer: 'No, there is no academic thesis requirement. Advanced Diploma programs in the Canadian college system emphasize practical, career-focused learning, including hands-on applied coursework, industry capstone projects, lab simulations, and integrated co-op or field placement practicums.'
    },
    {
      id: '25af5e47-d4a1-4957-ad9e-1494bfc4ef21',
      question: 'Can I study part-time in the Advanced Diploma program?',
      answer: 'Yes, flexible part-time and hybrid study options are available for many Advanced Diploma programs. While standard full-time students complete the 3-year curriculum across 6 semesters, part-time students can pace their course load to balance work, life, and study obligations.'
    },
    {
      id: '17fb4890-a414-4ca4-9548-a5b0c412b2b4',
      question: 'What are the admission requirements for Advanced Diploma programmes?',
      answer: `<div class="space-y-4">
        <p>Cannoga College's 3-year Advanced Diploma programmes are designed to equip students with specialized technical expertise and professional practical skills aligned with Canadian postsecondary standards.</p>
        <p><strong>General Admission Requirements:</strong></p>
        <ul class="list-disc pl-5 space-y-2">
            <li>Ontario Secondary School Diploma (OSSD) or recognized Canadian / international high school diploma</li>
            <li>Grade 12 English (C or U level or equivalent)</li>
            <li>Programme-specific senior prerequisites (e.g., Grade 12 Math for Technology/Business or Grade 11/12 Sciences for Health programmes)</li>
            <li>English Language Proficiency for international students (IELTS Academic 6.0 with minimum 5.5 in each band, TOEFL iBT 80, PTE 58, or equivalent)</li>
            <li>Official transcripts from high school and any postsecondary studies (eligible for transfer credit evaluation)</li>
            <li>Mature Student Status: Applicants aged 19+ without an OSSD may qualify through admissions testing</li>
        </ul>
    </div>`
    },
    {
      id: 'afedcd57-c2cf-48b8-be21-9d1753e57c43',
      question: 'Can I apply for an Advanced Diploma programme if I have prior post-secondary studies or a different background?',
      answer: `<div class="space-y-4">
        <p>Yes! Cannoga College welcomes applicants from diverse educational and career backgrounds into our Advanced Diploma programmes.</p>
        <p><strong>Pathway and Transfer Options:</strong></p>
        <ul class="list-disc pl-5 space-y-2">
            <li><strong>Advanced Standing &amp; Credit Transfer:</strong> If you have completed prior college courses, a diploma, or university credits, you can apply for Prior Learning Assessment and Recognition (PLAR) to enter directly into Year 2 or 3.</li>
            <li><strong>Bridging &amp; Foundations:</strong> Foundation and prerequisite modules are available if you are transitioning into a new technical field.</li>
            <li><strong>Mature Applicants:</strong> Relevant industry experience can be evaluated alongside formal credentials.</li>
        </ul>
        <p>Contact our admissions team or upload your transcripts to the Applicant Portal for a transfer credit assessment.</p>
    </div>`
    },
    {
      id: '684e46ba-5c01-473d-bd12-d7ecf0c34ffc',
      question: 'How do I start my application?',
      answer: `<div class="space-y-4">
        <p>Beginning your application to Cannoga College is straightforward.</p>
        <p><strong>Steps to Apply:</strong></p>
        <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Create an Account:</strong> Register on our application portal</li>
            <li><strong>Choose Your Programme:</strong> Select from our Bachelor’s, Advanced Diploma, Diploma, or Certificate offerings</li>
            <li><strong>Prepare Documents:</strong> Gather required academic transcripts and proof of identification</li>
            <li><strong>Submit Application:</strong> Complete and submit through the portal</li>
            <li><strong>Track Progress:</strong> Monitor your application status and receive your offer of admission</li>
        </ol>
    </div>`
    }
  ];

  for (const item of faqUpdates) {
    await client.query(`
      UPDATE faq 
      SET question = $1, answer = $2 
      WHERE id = $3
    `, [item.question, item.answer, item.id]);
    console.log(`✓ Updated FAQ row ID: ${item.id}`);
  }

  // 3. Update faqs table
  for (const item of faqUpdates) {
    await client.query(`
      UPDATE faqs 
      SET question = $1, answer = $2 
      WHERE id = $3
    `, [item.question, item.answer, item.id]);
  }
  await client.query(`
    UPDATE faqs 
    SET answer = 'Cannoga College offers certificate, diploma, 3-year advanced diploma, and bachelor degree programs across various fields.' 
    WHERE id = 'ea2bf48a-69cd-40fc-a9ff-7eb2fcc1d44e'
  `);
  console.log('✓ Updated faqs table');

  // 4. Update voice_agent_faqs table
  await client.query(`
    UPDATE voice_agent_faqs 
    SET answer = 'The confirmation tuition deposit is $2,000 CAD across all programs (Bachelor’s, Advanced Diplomas, Diplomas, and Certificates). This deposit confirms your acceptance, reserves your seat in your chosen cohort, initiates the issuance of your official Letter of Acceptance (LOA) and Provincial Attestation Letter (PAL) for international candidates, and is credited 100% directly towards your first-term tuition balance.'
    WHERE id = 'be4f74f1-acc7-4c3d-abe0-0f7e0ee06f81' OR answer ILIKE '%Bachelor’s, Master’s, Diplomas%'
  `);
  console.log('✓ Updated voice_agent_faqs table');

  // 5. Update page_content table for admissions/master
  const pcUpdates = [
    {
      section_key: 'hero_subtitle',
      content: 'Applicants guide to 3-year Advanced Diploma programmes. Two intakes per year: September (apply Oct–Feb) and January (apply Jun–Sep).'
    },
    {
      section_key: 'eligibility_content',
      content: `<div class="space-y-3">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Applications must fulfil general eligibility criteria to be evaluated for admission into Cannoga College's Advanced Diploma programmes.</p>
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">To meet the general eligibility criteria, applicants must have an Ontario Secondary School Diploma (OSSD) or recognized Canadian / International high school diploma equivalent. Mature students (aged 19 or older) without a high school diploma may also qualify through admissions testing and prior learning assessments. In addition, applicants must provide proof of English language proficiency and submit all required transcripts by the specified intake deadline.</p>
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Complete applications that meet the general eligibility requirements will be evaluated by the admissions committee according to programme-specific prerequisite standards.</p>
</div>`
    },
    {
      section_key: 'field_reqs_content',
      content: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Depending on your chosen academic stream, specific senior secondary subject prerequisites apply:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Art &amp; Design:</strong> High school diploma with Grade 12 English; portfolio submission or creative work samples demonstrating foundational design aptitude.</li>
        <li><strong class="text-slate-900 font-bold">Business &amp; Management:</strong> High school diploma with Grade 12 English and Grade 11/12 Mathematics (Functions, Calculus, or Data Management).</li>
        <li><strong class="text-slate-900 font-bold">Technology &amp; Engineering:</strong> High school diploma with Grade 12 English, Grade 12 Mathematics, and senior physics or computer science coursework.</li>
        <li><strong class="text-slate-900 font-bold">Health &amp; Life Sciences:</strong> High school diploma with Grade 12 English, Grade 11/12 Biology, and Grade 11/12 Chemistry.</li>
    </ul>
</div>`
    },
    {
      section_key: 'incomplete_content',
      content: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">You may apply before your secondary school diploma or previous post-secondary credential is officially completed if you are currently in your final semester:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li>Conditional admission will be granted based on interim grades and mid-term transcripts.</li>
        <li>Admission will be finalized upon submission of your official final high school diploma or graduation certificate and final transcripts before classes begin.</li>
    </ul>
</div>`
    },
    {
      section_key: 'steps_content',
      content: `<div class="space-y-6">
    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #f43f5e;">1</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Prepare in Advance</h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                <li>Check programme-specific prerequisite courses and grades</li>
                <li>Prepare official transcripts and certified English translations (if applicable)</li>
                <li>Schedule an English language proficiency test if required</li>
            </ul>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #f97316;">2</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">
                <a href="https://cannogacollege.ca/portal/account/register" class="underline hover:text-[#002f6c]">Fill in the online application 2026</a>
            </h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                <li>Application period: Open year-round for Fall (September) and Winter (January) intakes</li>
                <li>Only one application form per candidate</li>
                <li>Select up to two programme choices ranked by preference</li>
                <li>Track and update your application details through the student portal</li>
            </ul>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #eab308;">3</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Application Fee</h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                <li><strong class="text-slate-900 font-bold">International Applicants:</strong> Free ($0 Application Fee)</li>
                <li><strong class="text-slate-900 font-bold">Domestic (Canada/ PR):</strong> Free ($0 Application Fee)</li>
            </ul>
            <p class="text-sm font-semibold text-slate-800 pt-0.5">No application submission fees required.</p>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #22c55e;">4</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Upload Required Documents</h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
                <li>High school diploma &amp; official transcripts (or post-secondary transcripts for transfer credits)</li>
                <li>Proof of English proficiency (IELTS, TOEFL, Duolingo, or equivalent)</li>
                <li>Government-issued photo ID or international passport</li>
                <li>Portfolio (only for design and creative specializations)</li>
            </ul>
            <p class="text-xs text-neutral-500 pt-0.5">File format: PDF or image uploads via the portal.</p>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #06b6d4;">5</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Ready to Start</h3>
            <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                Begin your 3-year Advanced Diploma at Cannoga College Ottawa today. Create your applicant profile to track admissions decisions and receive your official Letter of Acceptance.
            </p>
        </div>
    </div>
</div>`
    },
    {
      section_key: 'language_content',
      content: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">English language proficiency is required for all international applicants to Advanced Diploma programmes taught in English. Demonstrate your proficiency via one of the following recognized pathways:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">IELTS Academic:</strong> Minimum overall score of 6.0 (with no individual band below 5.5).</li>
        <li><strong class="text-slate-900 font-bold">TOEFL iBT:</strong> Minimum score of 80 (with no section below 20).</li>
        <li><strong class="text-slate-900 font-bold">PTE Academic:</strong> Minimum overall score of 58.</li>
        <li><strong class="text-slate-900 font-bold">Duolingo English Test:</strong> Minimum score of 105–115.</li>
        <li><strong class="text-slate-900 font-bold">Exemption Criteria:</strong> Applicants who completed at least 3 consecutive years of full-time secondary or post-secondary education in English in Canada, USA, UK, Australia, or New Zealand.</li>
    </ul>
</div>`
    }
  ];

  for (const pc of pcUpdates) {
    await client.query(`
      UPDATE page_content 
      SET content = $1 
      WHERE page_slug = 'admissions/master' AND section_key = $2
    `, [pc.content, pc.section_key]);
    console.log(`✓ Updated page_content section: ${pc.section_key}`);
  }

  await client.end();
  console.log('\nAll updates completed successfully in PostgreSQL!');
}

updateDatabase().catch(err => {
  console.error('Error updating database:', err);
  process.exit(1);
});
