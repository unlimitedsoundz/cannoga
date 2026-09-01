export interface PageContentSection {
    pageSlug: string;
    sectionKey: string;
    label: string;
    defaultContent: string;
}

export interface PageContentPage {
    slug: string;
    name: string;
}

export const pageContentPages: PageContentPage[] = [
    {
        slug: 'admissions-bachelor',
        name: 'Bachelor Admissions',
    },
    {
        slug: 'admissions/master',
        name: 'Advanced Diploma Admissions',
    },
    {
        slug: 'admissions/tuition',
        name: 'Tuition & Fees',
    },
    {
        slug: 'admissions-application-process',
        name: 'Application Process',
    },
    {
        slug: 'admissions',
        name: 'Admissions Landing',
    },
];

export const pageContentSections: PageContentSection[] = [
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'How to Apply',
    },
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent: 'Follow our step-by-step guide to ensure a smooth application process for your studies at Cannoga College.',
    },
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'steps_content',
        label: 'Application Steps Content',
        defaultContent: `<div class="space-y-4">
    <h3 class="text-2xl font-bold text-black">Prepare in Advance</h3>
    <ul class="space-y-3 text-black">
        <li class="flex gap-4 items-start"><ArrowRight size={20} weight="regular" className="mt-1 shrink-0" /> Check programme-specific eligibility</li>
        <li class="flex gap-4 items-start"><ArrowRight size={20} weight="regular" className="mt-1 shrink-0" /> Prepare official documents and translations</li>
        <li class="flex gap-4 items-start"><ArrowRight size={20} weight="regular" className="mt-1 shrink-0" /> Schedule language tests and GMAT/GRE if required</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'documents_content',
        label: 'Required Documents Content',
        defaultContent: `<div class="grid gap-6 md:grid-cols-2">
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Certified Educational Documents</h4><p class="text-sm">Must be submitted within 14 days of receiving your admission decision.</p></div>
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Translations</h4><p class="text-sm">Non-English documents require official certified translations.</p></div>
    <div class="bg-card p-8 rounded-2xl"><h4 class="font-bold mb-2">Passport</h4><p class="text-sm">Color PDF of the personal information page.</p></div>
</div>`,
    },
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'requirements_content',
        label: 'Specific Requirements Content',
        defaultContent: `<h2 class="text-3xl font-bold mb-8 text-black">Specific Requirements Checklist</h2>
<div class="space-y-6">
    <div class="p-8 bg-card rounded-2xl shadow-sm"><h3 class="font-bold text-lg mb-2">Art and Design</h3><p>Applicants without a formal Bachelor’s degree may apply if they have equivalent skills through portfolios, work experience, or other studies.</p></div>
    <div class="p-8 bg-card rounded-2xl shadow-sm"><h3 class="font-bold text-lg mb-2">Business and Economics</h3><p>Some programmes require GMAT or GRE scores.</p></div>
    <div class="p-8 bg-card rounded-2xl shadow-sm"><h3 class="font-bold text-lg mb-2">Technology/Engineering</h3><p>Some may require relevant coursework or skills in mathematics, programming, or design.</p></div>
</div>`,
    },
    {
        pageSlug: 'admissions-application-process',
        sectionKey: 'evaluation_content',
        label: 'Evaluation & Decisions Content',
        defaultContent: `<h2 class="text-3xl font-bold mb-8 text-black">Evaluation & Decisions</h2>
<div class="space-y-6">
    <p class="text-lg leading-relaxed">Only complete applications are evaluated based on programme-specific criteria. Decision results are published within less than a week of submitting your application.</p>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'Apply to Bachelor’s Programmes',
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent:
            'Discover our international Bachelor’s programmes, application deadlines, and study pathways for the 2026 intake.',
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'benefits_content',
        label: 'Benefits Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-4">Studying at Cannoga combines small-group teaching, practical case work, and a modern campus environment. Our Bachelor’s students benefit from personalised guidance, strong industry links, and a curriculum designed for international careers.</p>
<ul class="space-y-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
    <li><strong class="text-slate-900 font-bold">International Classroom:</strong> Study with students from around the world.</li>
    <li><strong class="text-slate-900 font-bold">Career-Ready Skills:</strong> Focus on finance, management, and economics.</li>
    <li><strong class="text-slate-900 font-bold">Practical Learning:</strong> Case studies, projects, and internships.</li>
    <li><strong class="text-slate-900 font-bold">Personalised Support:</strong> Small class sizes and close faculty contact.</li>
</ul>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'progression_content',
        label: 'Progression Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-4">Completing a Bachelor’s degree at Cannoga opens seamless progression paths into Advanced Diploma programmes, specialised tracks, and international partner universities.</p>
<ul class="space-y-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
    <li><strong class="text-slate-900 font-bold">Internal Continuation:</strong> Direct progression to Cannoga Advanced Diploma programmes.</li>
    <li><strong class="text-slate-900 font-bold">Specialised Tracks:</strong> Accounting, Economics, or Management.</li>
    <li><strong class="text-slate-900 font-bold">International Opportunities:</strong> Partner universities worldwide.</li>
    <li><strong class="text-slate-900 font-bold">Research Integration:</strong> Bachelor theses as a bridge to advanced research.</li>
</ul>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'scholarships_content',
        label: 'Scholarships Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
        Cannoga College offers several financial support and scholarship pathways for undergraduate students:
    </p>
    <ul class="space-y-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Merit-Based:</strong> For exceptional high school academic records and standardized achievements.</li>
        <li><strong class="text-slate-900 font-bold">Need-Based:</strong> Financial assistance and bursaries for eligible domestic and international students.</li>
        <li><strong class="text-slate-900 font-bold">Continuing Merit:</strong> 50% tuition reduction after first year based on academic performance.</li>
    </ul>
    <p class="pt-2"><a href="/admissions/tuition/" class="underline font-bold text-slate-900 hover:text-[#002f6c]">See detailed tuition and scholarship information &rarr;</a></p>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'admissions_content',
        label: 'Admissions Info Section',
        defaultContent: `<div class="grid md:grid-cols-2 gap-6">
    <div class="space-y-2">
        <h3 class="text-lg font-bold text-slate-900 tracking-tight">Eligibility Criteria</h3>
        <ul class="space-y-1.5 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
            <li>High school diploma or recognized equivalent</li>
            <li>Proficiency in English (IELTS, TOEFL, Duolingo, or equivalent)</li>
            <li>Strong mathematics and general academic background</li>
        </ul>
    </div>
    <div class="space-y-2">
        <h3 class="text-lg font-bold text-slate-900 tracking-tight">Selection Process</h3>
        <ul class="space-y-1.5 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
            <li>Overall academic excellence and grade transcript review</li>
            <li>Prerequisite subject evaluation and proficiency assessment</li>
            <li>Extracurricular leadership and community engagement</li>
        </ul>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'events_content',
        label: 'Events Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
        Connect with our admissions team, explore student life, and learn about undergraduate programmes through our upcoming events:
    </p>
    <ul class="space-y-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Open Days:</strong> Explore the campus, tour facilities, and meet faculty members.</li>
        <li><strong class="text-slate-900 font-bold">Virtual Info Sessions:</strong> Live online webinars explaining requirements and visa pathways.</li>
        <li><strong class="text-slate-900 font-bold">Education Fairs:</strong> In-person representative meetings in select cities across Canada and abroad.</li>
    </ul>
    <div class="pt-2">
        <a href="/news/" class="underline font-bold text-slate-900 hover:text-[#002f6c]">View upcoming campus and online events &rarr;</a>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'quote_content',
        label: 'Quote Banner',
        defaultContent: `<h3 class="text-2xl md:text-3xl leading-tight mb-4 font-bold">"We empower students with the analytical skills and global mindset needed for complex financial decision-making."</h3>
<p class="text-base text-black mb-3">Our undergraduate curriculum bridges foundational economic theory with hands-on fintech modeling, case competitions, and real-world internships. From day one, students receive direct mentorship to navigate international career pathways and graduate school admissions across Canada and globally.</p>
<p class="text-sm font-bold tracking-widest">— International Admissions Officer</p>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'Apply to Advanced Diploma Programmes',
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent: 'Applicants guide to two-year Advanced Diploma programmes. Two intakes per year: September (apply Oct–Feb) and January (apply Jun–Sep).',
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'schedule_content',
        label: 'Schedule Section',
        defaultContent: `<div class="w-full overflow-x-auto my-4 rounded-lg border border-neutral-200 shadow-sm bg-white">
    <table class="w-full table-fixed border-collapse">
        <thead class="bg-[#0a151a] text-white">
            <tr>
                <th class="w-[28%] border-b border-neutral-700 px-3 py-2.5 text-left text-xs font-normal uppercase tracking-tight">Intake Stage</th>
                <th class="w-[32%] border-b border-neutral-700 px-3 py-2.5 text-left text-xs font-normal uppercase tracking-tight">Application Window</th>
                <th class="w-[40%] border-b border-neutral-700 px-3 py-2.5 text-left text-xs font-normal uppercase tracking-tight">Best Time to Apply / Details</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 text-slate-800">
            <tr class="hover:bg-neutral-50/80">
                <td class="px-3 py-2.5 text-xs md:text-sm font-bold text-slate-900">September Intake</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-normal text-neutral-800">October – February</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-semibold text-slate-900">Early application: October – December</td>
            </tr>
            <tr class="hover:bg-neutral-50/80 bg-neutral-50/50">
                <td class="px-3 py-2.5 text-xs md:text-sm font-bold text-slate-900">January Intake</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-normal text-neutral-800">June – September</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-semibold text-slate-900">Early application: June – August</td>
            </tr>
            <tr class="hover:bg-neutral-50/80">
                <td class="px-3 py-2.5 text-xs md:text-sm font-bold text-slate-900">Evaluation Phase</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-normal text-neutral-800" colspan="2">Applications reviewed by the admissions committee and faculty within 4–6 weeks.</td>
            </tr>
            <tr class="hover:bg-neutral-50/80 bg-neutral-50/50">
                <td class="px-3 py-2.5 text-xs md:text-sm font-bold text-slate-900">Decision</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-normal text-neutral-800" colspan="2">Admission decision communicated by email within 1 week of evaluation.</td>
            </tr>
            <tr class="hover:bg-neutral-50/80">
                <td class="px-3 py-2.5 text-xs md:text-sm font-bold text-slate-900">Studies Start</td>
                <td class="px-3 py-2.5 text-xs md:text-sm font-normal text-neutral-800" colspan="2">September (Fall) or January (Winter)</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'study_options_content',
        label: 'Study Options Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Cannoga College provides advanced diploma education across diverse fields of study, including Art & Design, Business & Economics, Technology & Engineering, Education, Science, Health & Life Sciences, and Transportation & Aviation.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'scholarships_content',
        label: 'Scholarships Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">At Cannoga College, we believe in rewarding academic excellence and supporting students through various financial aid options. Our scholarship programme is designed to help international talent thrive in Ottawa, Ontario, Canada:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Merit-Based Scholarships:</strong> Awarded to top-performing applicants based on academic record.</li>
        <li><strong class="text-slate-900 font-bold">Performance Waivers:</strong> Maintain a 3.5 GPA and 55 credits/year for a 50% waiver from the 2nd year onwards.</li>
    </ul>
    <div class="pt-2">
        <a href="/admissions/tuition/" class="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline hover:text-[#002f6c] transition-colors">See detailed tuition &amp; OSAP info &rarr;</a>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'eligibility_content',
        label: 'Eligibility Section',
        defaultContent: `<div class="space-y-3">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Applications must fulfil general eligibility criteria to be evaluated by the study options.</p>
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">To meet the general eligibility criteria, applicants must have a bachelor's degree that grants eligibility to advanced diploma level education. In addition, the application must include an accepted proof of language proficiency and all required documents submitted by the deadline.</p>
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Complete applications that meet the general eligibility requirements will be evaluated by the study options according to their specific evaluation criteria.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'field_reqs_content',
        label: 'Field Requirements Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Depending on your chosen faculty, specific subject prerequisites apply:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Art and Design:</strong> Applicants without a formal Bachelor’s degree may apply if they demonstrate equivalent skills through portfolios, work experience, or accredited design studies.</li>
        <li><strong class="text-slate-900 font-bold">Business and Economics:</strong> Quantitative background required; some programmes require official GMAT or GRE scores.</li>
        <li><strong class="text-slate-900 font-bold">Technology &amp; Engineering:</strong> Requires relevant coursework in mathematics, physics, computer programming, or engineering design.</li>
        <li><strong class="text-slate-900 font-bold">Natural &amp; Health Sciences:</strong> Requires a relevant Bachelor’s degree in biology, health sciences, chemistry, or environmental sciences.</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'incomplete_content',
        label: 'Incomplete Degree Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">You may apply before your Bachelor’s degree is officially completed if you are on track to graduate by 31 July 2026:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li>Admission is conditional upon submission of certified final degree documents and official transcripts within 14 days of your admission decision.</li>
        <li>Failure to submit official graduation certificates by the specified deadline will result in cancellation of the offer.</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'steps_content',
        label: 'Application Steps Section',
        defaultContent: `<div class="space-y-6">
    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #f43f5e;">1</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Prepare in Advance</h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
                <li>Check programme-specific eligibility</li>
                <li>Prepare official documents and translations</li>
                <li>Schedule language tests and GMAT/GRE if required</li>
            </ul>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #f97316;">2</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">
                <a href="https://cannogacollege.ca/portal/account/register" class="underline hover:text-[#002f6c]">Fill in the online application 2026</a>
            </h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
                <li>Application period: October (Sept intake) / June (Jan intake) – February (Sept intake) / September (Jan intake)</li>
                <li>Only one form per applicant</li>
                <li>Include up to two programmes ranked by preference</li>
                <li>Edit application until closing date</li>
            </ul>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #eab308;">3</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Application Fee</h3>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
                <li><strong class="text-slate-900 font-bold">International Applicants:</strong> Free ($0 Application Fee)</li>
                <li><strong class="text-slate-900 font-bold">Domestic (Canada/ PR):</strong> Free ($0 Application Fee)</li>
            </ul>
            <p class="text-sm font-semibold text-slate-800 pt-0.5">No payment required to submit your application.</p>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #22c55e;">4</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Upload Required Documents</h3>
            <p class="text-sm font-semibold text-slate-800">Deadline: February (Sept intake) / September (Jan intake) at 15:00 (UTC+2)</p>
            <ul class="space-y-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
                <li>Bachelor’s degree &amp; transcripts</li>
                <li>Proof of English proficiency (optional)</li>
                <li>International passport only</li>
                <li>Portfolio (if required)</li>
                <li>GMAT/GRE (if required)</li>
            </ul>
            <p class="text-xs text-neutral-500 pt-0.5">File format: PDF only, named appropriately.</p>
        </div>
    </div>

    <div class="flex items-start gap-4">
        <div class="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm" style="background-color: #06b6d4;">5</div>
        <div class="flex-1 space-y-1.5">
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Ready to Start</h3>
            <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
                Begin your postgraduate journey at Cannoga College today. Create your applicant profile to track submissions and admissions decisions.
            </p>
        </div>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'documents_content',
        label: 'Required Documents Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Ensure all submitted documentation conforms to official verification standards:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Certified Educational Documents:</strong> Must be submitted during application in the upload section.</li>
        <li><strong class="text-slate-900 font-bold">Translations:</strong> Non-English/Non-English documents require official translations.</li>
        <li><strong class="text-slate-900 font-bold">Passport/ID:</strong> Color PDF of the personal information page.</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'language_content',
        label: 'Language Requirements Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">English language proficiency is mandatory for all Advanced Diploma programmes taught in English. Demonstrate your skills via an accepted language test or previous qualifying degree:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Accepted Standardized Tests:</strong> IELTS Academic (min 6.5 overall, 6.0 in writing), TOEFL iBT (min 92), PTE Academic (min 62), or Cambridge C1 Advanced / C2 Proficiency.</li>
        <li><strong class="text-slate-900 font-bold">Exemption Criteria:</strong> Applicants who completed a secondary or higher education degree taught entirely in English in Canada, the United States, the UK, Australia, or New Zealand.</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'gmat_content',
        label: 'GMAT / GRE Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Certain programmes within the School of Business &amp; Economics require a standardized quantitative examination score:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">GMAT Focus Edition:</strong> Minimum score of 555</li>
        <li><strong class="text-slate-900 font-bold">GRE General Test:</strong> Equivalent score percentile in Quantitative and Verbal sections accepted.</li>
    </ul>
    <p class="text-xs sm:text-sm font-semibold text-slate-800 pt-1">Official test scores must be transmitted electronically by the testing agency to Cannoga College admissions.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'decisions_content',
        label: 'Decisions Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Only complete applications are evaluated based on programme-specific academic criteria. Decision results are published within less than a week of submitting your application.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'after_content',
        label: 'After Admission Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-black leading-relaxed">Once you receive your Letter of Acceptance, complete the following onboarding steps to secure your study place:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
        <li>Accept your offer in the student portal before the stated deadline.</li>
        <li>Pay tuition fees and obtain your Provincial Attestation Letter (PAL).</li>
        <li>Apply for your Canadian Study Permit and arrange accommodation in Ottawa.</li>
        <li>Complete online orientation and semester course registration.</li>
    </ul>
    <div class="pt-2">
        <a href="/student-guide/international/" class="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline hover:text-[#002f6c] transition-colors">Open International Student Guide &rarr;</a>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'Paying the Tuition Fee',
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'hero_video_url',
        label: 'Hero Video URL',
        defaultContent: '/videos/wan2.6-t2v_a_%23_Tuition_Fees_Video.mp4',
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent: 'Comprehensive guide to fee levels, payment methods, and financial policies for the 2026 academic year.',
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'costs_intro_content',
        label: 'Costs Intro Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed">Cannoga College's tuition rates are highly competitive compared to other major colleges across Canada and significantly more affordable than university fees. Postsecondary education in Canada offers excellent value when compared to other English-speaking destinations like the United States or United Kingdom. Your overall expenses will depend on your selected program, housing preferences, and personal lifestyle. All tuition payments include comprehensive health insurance coverage.</p>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'fee_structure_content',
        label: 'Fee Structure Section',
        defaultContent: '',
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'certificate_fees_content',
        label: 'Certificate Fees Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">Annual tuition fee and deposit for Certificate programs (6 months – 1 year)</p>
<div class="w-full overflow-x-auto my-2 bg-white">
    <table class="w-full table-auto sm:table-fixed border-collapse">
        <thead>
            <tr class="bg-[#0a151a] text-white">
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Student Residency</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Fee / yr</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Deposit</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white hover:bg-neutral-50/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">Domestic Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 text-center align-middle whitespace-nowrap">CAD $2,400</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
            <tr class="bg-neutral-50/80 hover:bg-neutral-100/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">International Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-[#0a151a] text-center align-middle whitespace-nowrap">CAD $4,000</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'diploma_fees_content',
        label: 'Diploma Fees Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">Annual tuition fee and deposit for Diploma and Advanced Diploma programs (2 – 3 years)</p>
<div class="w-full overflow-x-auto my-2 bg-white">
    <table class="w-full table-auto sm:table-fixed border-collapse">
        <thead>
            <tr class="bg-[#0a151a] text-white">
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Student Residency</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Fee / yr</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Deposit</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white hover:bg-neutral-50/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">Domestic Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 text-center align-middle whitespace-nowrap">CAD $2,400</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
            <tr class="bg-neutral-50/80 hover:bg-neutral-100/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">International Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-[#0a151a] text-center align-middle whitespace-nowrap">CAD $4,000</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'bachelor_fees_content',
        label: 'Bachelor Fees Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">Annual tuition fee and deposit for Bachelor's degree programs (4-year programs)</p>
<div class="w-full overflow-x-auto my-2 bg-white">
    <table class="w-full table-auto sm:table-fixed border-collapse">
        <thead>
            <tr class="bg-[#0a151a] text-white">
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Student Residency</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Fee / yr</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Deposit</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white hover:bg-neutral-50/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">Domestic Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 text-center align-middle whitespace-nowrap">CAD $4,000</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
            <tr class="bg-neutral-50/80 hover:bg-neutral-100/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">International Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-[#0a151a] text-center align-middle whitespace-nowrap">CAD $6,400</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'master_fees_content',
        label: 'Advanced Diploma Fees Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">Annual tuition fee and deposit for Advanced Diploma programs (3-year programs)</p>
<div class="w-full overflow-x-auto my-2 bg-white">
    <table class="w-full table-auto sm:table-fixed border-collapse">
        <thead>
            <tr class="bg-[#0a151a] text-white">
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Student Residency</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Fee / yr</th>
                <th class="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase tracking-wide">Tuition Deposit</th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white hover:bg-neutral-50/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">Domestic Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 text-center align-middle whitespace-nowrap">CAD $5,600</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
            <tr class="bg-neutral-50/80 hover:bg-neutral-100/60">
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-slate-900 align-middle">International Students</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-semibold text-[#0a151a] text-center align-middle whitespace-nowrap">CAD $9,600</td>
                <td class="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-base font-normal text-black text-center align-middle whitespace-nowrap">CAD $2,000</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'merit_scholarship_content',
        label: 'Merit Scholarship Section',
        defaultContent: `<div class="space-y-4"><h3 class="text-xl font-bold text-slate-900 tracking-tight mb-2">Continuing Merit Scholarship</h3><p class="text-sm sm:text-base font-normal text-black leading-relaxed">Cannoga College rewards academic excellence. After the first year, international students can apply for a merit scholarship covering 50% of tuition for the next academic year.</p><div class="grid md:grid-cols-2 gap-6 pt-2"><div class="space-y-2"><h4 class="font-bold text-xs uppercase tracking-widest text-slate-900">Academic Criteria</h4><ul class="space-y-2 text-sm sm:text-base font-normal text-black list-disc list-inside"><li>Complete at least 55 credits per academic year</li><li>Maintain a minimum weighted GPA of 3.5 / 5.0</li></ul></div><div class="space-y-2"><h4 class="font-bold text-xs uppercase tracking-widest text-slate-900">Application & Review</h4><p class="text-sm sm:text-base font-normal text-black leading-relaxed">Scholarship eligibility is automatically reviewed every August and eligible students will be notified before the autumn tuition deadline.</p></div></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'payment_methods_content',
        label: 'Payment Methods Section',
        defaultContent: `<div class="space-y-6">
    <div class="space-y-3">
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            Cannoga provides secure, convenient payment options using local and international channels through our integrated payment gateway.
        </p>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            All tuition payments are processed through our secure portal for accurate tracking, faster confirmation, and proper allocation to your student account.
        </p>
    </div>

    <div class="pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight mb-6">Step-by-Step Payment Process</h3>
        
        <div class="space-y-6">
            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">1</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Accept Your Offer</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Once you accept your offer through the portal, you will be redirected to the secure payment page.
                    </p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">2</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Choose Where You’re Paying From</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Select the country from which you will make your payment. The portal shows local payment options specific to your location.
                    </p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">3</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Review Payment Details</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Confirm your full name, student ID, programme, amount payable, and payment reference before submitting.
                    </p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">4</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Select Your Payment Method</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Choose one of the available payment methods based on your country and preference.
                    </p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">5</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Complete the Payment</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Follow the on-screen instructions to pay securely.
                    </p>
                </div>
            </div>

            <div class="flex items-start gap-4">
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#0a151a] text-white flex items-center justify-center font-bold text-sm">6</div>
                <div class="flex-1 space-y-1">
                    <h4 class="text-base font-bold text-slate-900 tracking-tight">Payment Confirmation</h4>
                    <p class="text-base font-normal text-black leading-relaxed">
                        Once payment is confirmed, your payment status updates automatically and an official receipt is issued.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="pt-4 border-t border-slate-200">
        <p class="text-base font-semibold text-slate-800">
            Please pay by the deadline indicated in your official offer of admission to confirm your enrollment.
        </p>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'timing_content',
        label: 'Payment Schedule Section',
        defaultContent: `<div class="space-y-6">
    <div class="space-y-2">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">First Academic Year</h3>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            After accepting the admission offer, pay your tuition deposit of $2,000 CAD.
        </p>
    </div>

    <div class="space-y-2 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">After the First Year</h3>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            Students are encouraged to pay the full fee in one instalment during the annual enrolment period. Alternatively, two instalments may be allowed, but this can affect your attendance status.
        </p>
        <p class="text-xs sm:text-sm font-semibold text-slate-800 pt-1">
            Important: Non-attending status may affect visa or study permit conditions.
        </p>
    </div>

    <div class="pt-4 border-t border-slate-200">
        <p class="text-xs sm:text-sm font-medium text-slate-600">
            For further details, consult the official Cannoga College enrolment guidelines.
        </p>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'additional_fees_content',
        label: 'Additional Fees Section',
        defaultContent: `<div class="space-y-8"><div class="max-w-4xl"><h3 class="text-2xl font-bold mb-4 text-slate-900">Financial Requirements &amp; Living Costs</h3><p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-4">Beyond tuition, ensure you have sufficient funds for rent, personal expenses, transportation, meals, health insurance, and mandatory Immigration, Refugees and Citizenship Canada (IRCC) financial support criteria.</p><div class="bg-slate-50 border-l-4 border-[#0a151a] p-4 rounded-sm mb-6 space-y-2"><h4 class="text-sm font-bold text-black uppercase tracking-wider">IRCC Proof of Financial Support Criteria</h4><p class="text-sm font-normal text-black leading-relaxed"><strong>Starting September 1, 2026</strong>, a single international study permit applicant studying outside Quebec must demonstrate <strong>CAD $23,448</strong> for one year of living expenses (in addition to first-year tuition and travel costs).</p><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html#doc3" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-[#0a151a] underline hover:text-[#002f6c]">View Official IRCC Proof of Financial Support Guidelines &rarr;</a></div><p class="text-sm sm:text-base font-normal text-black leading-relaxed">Cannoga College supports international students in finding accommodation in Ottawa, Ontario, Canada. Our housing guide covers all major providers and neighbourhoods.</p></div><div class="space-y-6 pt-2"><div><h3 class="text-xl font-bold mb-3 text-slate-900">What's Included?</h3><p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">The tuition fee includes teaching and access to modern learning facilities. Core student services are free of charge:</p><ul class="space-y-2 pt-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5"><li><strong>Library access</strong></li><li><strong>Student Services</strong></li><li><strong>Career Services</strong></li><li><strong>Exchange Services</strong></li><li><strong>Study support</strong></li></ul></div><div><h3 class="text-xl font-bold mb-3 text-slate-900">Cannoga Student Association</h3><p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-3">All enrolled students are members of the Cannoga Student Association (CSA), offering advocacy, events, discounts, and community.</p><ul class="space-y-2 pt-2 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5"><li>Campus dining discounts</li><li>OC Transpo U-Pass subsidy</li></ul></div></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'refunds_content',
        label: 'Refund Policy Section',
        defaultContent: `<div class="space-y-6">
    <div class="space-y-3">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Full Refund Cases</h3>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            A full refund of paid tuition fees will be granted under the following circumstances:
        </p>
        <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-black leading-relaxed list-disc list-outside pl-5">
            <li>Conditional offer cancelled (conditions not met)</li>
            <li>Renounce study right during enrolment</li>
            <li>Study permit denied</li>
            <li>Residence status becomes exempt</li>
            <li>Programme cancellation by University</li>
        </ul>
    </div>

    <div class="space-y-3 pt-4 border-t border-slate-200">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Refund Application</h3>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            To request a refund, contact the tuition fee team by the relevant deadline.
        </p>
        <p class="text-sm sm:text-base font-normal text-black leading-relaxed">
            Refunds normally exclude service and bank charges. For the full policy, visit our <a href="/refund-withdrawal-policy/" class="underline font-bold text-slate-900 hover:text-[#002f6c]">Refund &amp; Withdrawal Policy &rarr;</a>
        </p>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'contact_content',
        label: 'Contact Section',
        defaultContent: `<p class="text-sm sm:text-base font-normal text-black leading-relaxed mb-6">If you have questions about payment processes, deadlines, or refunds, contact the Tuition Fee Office.</p><a href="mailto:admissions@cannogacollege.ca" class="inline-flex items-center gap-2 bg-[#0a151a] !text-white text-white px-6 py-3 font-bold hover:bg-slate-800 hover:!text-white transition-colors shadow-sm">Contact Tuition Office &rarr;</a>`,
    },
    {
        pageSlug: 'admissions',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'Admissions to Cannoga College',
    },
    {
        pageSlug: 'admissions',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent: 'Apply to Cannoga College Ottawa and begin your Bachelor’s or Advanced Diploma studies in an internationally focused learning environment. Our admissions process is transparent, supportive, and open to students from around the world.',
    },
];

export const pageContentSectionsByPage: Record<string, PageContentSection[]> = pageContentSections.reduce((acc, section) => {
    if (!acc[section.pageSlug]) {
        acc[section.pageSlug] = [];
    }
    acc[section.pageSlug].push(section);
    return acc;
}, {} as Record<string, PageContentSection[]>);

export function getPageContentSection(pageSlug: string, sectionKey: string) {
    return pageContentSections.find(section => section.pageSlug === pageSlug && section.sectionKey === sectionKey);
}

