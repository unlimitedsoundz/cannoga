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
        name: 'Master Admissions',
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
    <div class="bg-[#0f2027] text-white p-8 rounded-2xl shadow-lg">
        <h3 class="font-bold text-lg mb-1">Waiting List Procedure</h3>
        <p class="text-sm text-white/80">Places on the waiting list may be offered until 26 June 2026. Keep an eye on your email.</p>
    </div>
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
        defaultContent: `<p class="text-lg text-black leading-relaxed">Studying at Cannoga combines small-group teaching, practical case work, and a modern campus environment. Our Bachelor’s students benefit from personalised guidance, strong industry links, and a curriculum designed for international careers.</p>
<ul class="space-y-3">
    <li class="flex gap-3 items-start">International Classroom: Study with students from around the world.</li>
    <li class="flex gap-3 items-start">Career-Ready Skills: Focus on finance, management, and economics.</li>
    <li class="flex gap-3 items-start">Practical Learning: Case studies, projects, and internships.</li>
    <li class="flex gap-3 items-start">Personalised Support: Small class sizes and close faculty contact.</li>
</ul>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'progression_content',
        label: 'Progression Section',
        defaultContent: `<p class="text-lg text-black leading-relaxed">Completing a Bachelor’s degree at Cannoga opens seamless progression paths into Master’s programmes, specialised tracks, and international partner universities.</p>
<ul class="space-y-3">
    <li class="flex gap-3 items-start">Internal Continuation: Direct progression to Cannoga Master’s programmes.</li>
    <li class="flex gap-3 items-start">Specialised Tracks: Accounting, Economics, or Management.</li>
    <li class="flex gap-3 items-start">International Opportunities: Partner universities worldwide.</li>
    <li class="flex gap-3 items-start">Research Integration: Bachelor theses as a bridge to advanced research.</li>
</ul>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'scholarships_content',
        label: 'Scholarships Section',
        defaultContent: `<div class="space-y-4 text-lg text-black">
    <div class="p-8 pl-16 bg-neutral-50 border-l-4 border-[#0f2027] rounded-r-lg">
        Tuition Fee: Included in degree tuition for full-time BSc students.
    </div>
    <ul class="space-y-3 pt-4">
        <li class="flex gap-3 items-start">Merit-Based: For exceptional academic records.</li>
        <li class="flex gap-3 items-start">Need-Based: Financial assistance for eligible students.</li>
        <li class="flex gap-3 items-start">International: Merit and need-based support for global talent.</li>
    </ul>
    <p><a href="/admissions/tuition" class="text-black font-bold hover:underline inline-block mt-2">See detailed scholarship info →</a></p>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'admissions_content',
        label: 'Admissions Info Section',
        defaultContent: `<div class="grid md:grid-cols-2 gap-12">
    <div class="bg-card p-8 rounded-2xl">
        <h3 class="text-xl font-bold mb-6 text-black">Eligibility</h3>
        <ul class="space-y-3 text-black pt-4">
            <li class="flex gap-3 items-start">High school diploma or equivalent</li>
            <li class="flex gap-3 items-start">Proficiency in English (IELTS/TOEFL)</li>
            <li class="flex gap-3 items-start">Strong mathematics and academic records</li>
        </ul>
    </div>
    <div class="bg-card p-8 rounded-2xl">
        <h3 class="text-xl font-bold mb-6 text-black">Selection Criteria</h3>
        <ul class="space-y-3 text-black pt-4">
            <li class="flex gap-3 items-start">Academic excellence</li>
            <li class="flex gap-3 items-start">Motivation and personal statement</li>
            <li class="flex gap-3 items-start">Leadership and extracurricular activities</li>
        </ul>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'more_content',
        label: 'Learn More Section',
        defaultContent: `<div class="grid grid-cols-2 md:grid-cols-5 gap-6 text-left">
    <a href="/student-life#facilities" style="text-decoration: none !important;" class="p-4 bg-card rounded-xl hover:bg-neutral-100 transition-colors block"><h4 class="font-bold mb-1">Modern Campus</h4><p class="text-xs text-black">State-of-the-art facilities</p></a>
    <a href="/student-life#services" style="text-decoration: none !important;" class="p-4 bg-card rounded-xl hover:bg-neutral-100 transition-colors block"><h4 class="font-bold mb-1">Support</h4><p class="text-xs text-black">Advisors and counseling</p></a>
    <a href="/student-life#organizations" style="text-decoration: none !important;" class="p-4 bg-card rounded-xl hover:bg-neutral-100 transition-colors block"><h4 class="font-bold mb-1">Community</h4><p class="text-xs text-black">Global network</p></a>
    <a href="/collaboration" style="text-decoration: none !important;" class="p-4 bg-card rounded-xl hover:bg-neutral-100 transition-colors block"><h4 class="font-bold mb-1">Careers</h4><p class="text-xs text-black">Internships and mentoring</p></a>
    <a href="/student-life" style="text-decoration: none !important;" class="p-4 bg-card rounded-xl hover:bg-neutral-100 transition-colors block"><h4 class="font-bold mb-1">Student Life</h4><p class="text-xs text-black">Clubs and sports</p></a>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'events_content',
        label: 'Events Section',
        defaultContent: `<div class="relative z-10 grid md:grid-cols-2 gap-12 items-center">
    <div>
        <h2 class="text-3xl font-bold mb-6 text-black">Fairs and Events</h2>
        <ul class="space-y-4 text-black">
            <li class="flex gap-3 items-start">Open Days: Explore campus and meet faculty.</li>
            <li class="flex gap-3 items-start">Virtual Info Sessions: Online webinars on applications.</li>
            <li class="flex gap-3 items-start">Education Fairs: Meet us in your city.</li>
        </ul>
        <div class="mt-8"><a href="/news" class="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block">See Upcoming Events</a></div>
    </div>
    <div class="w-full relative h-[250px] md:h-80 mt-8 md:mt-0"></div>
</div>`,
    },
    {
        pageSlug: 'admissions-bachelor',
        sectionKey: 'quote_content',
        label: 'Quote Banner',
        defaultContent: `<h3 class="text-2xl md:text-3xl leading-tight mb-4 font-bold">"We empower students with the analytical skills and global mindset needed for complex financial decision-making."</h3>
<p class="text-base text-neutral-600 mb-3">Our undergraduate curriculum bridges foundational economic theory with hands-on fintech modeling, case competitions, and real-world internships. From day one, students receive direct mentorship to navigate international career pathways and graduate school admissions across Canada and globally.</p>
<p class="text-sm font-bold tracking-widest">— International Admissions Officer</p>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'hero_title',
        label: 'Hero Title',
        defaultContent: 'Apply to Master’s Programmes',
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'hero_subtitle',
        label: 'Hero Subtitle',
        defaultContent: 'Applicants guide to two-year Master’s programmes. Two intakes per year: September (apply Oct–Feb) and January (apply Jun–Sep).',
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
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Cannoga College provides master's education across diverse fields of study, including Art & Design, Business & Economics, Technology & Engineering, Education, Science, Health & Life Sciences, and Transportation & Aviation.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'scholarships_content',
        label: 'Scholarships Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">At Cannoga College, we believe in rewarding academic excellence and supporting students through various financial aid options. Our scholarship programme is designed to help international talent thrive in Ottawa, Ontario, Canada:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Merit-Based Scholarships:</strong> Awarded to top-performing applicants based on academic record.</li>
        <li><strong class="text-slate-900 font-bold">Performance Waivers:</strong> Maintain a 3.5 GPA and 55 credits/year for a 50% waiver from the 2nd year onwards.</li>
    </ul>
    <div class="pt-2">
        <a href="/admissions/tuition" class="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline hover:text-[#002f6c] transition-colors">See detailed tuition &amp; OSAP info &rarr;</a>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'eligibility_content',
        label: 'Eligibility Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">To be eligible for Master's degree studies at Cannoga College, applicants must meet the following baseline requirements:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li>Hold a Bachelor’s degree (180 ECTS credits / 3-4 year degree) or equivalent recognized credential.</li>
        <li>Degree must enable eligibility for Master’s study in the awarding country.</li>
        <li>Only long-cycle degrees are considered in place of a Bachelor’s.</li>
    </ul>
    <p class="text-xs sm:text-sm font-bold text-slate-900 pt-1"><strong class="text-amber-800">Important:</strong> Previous Master’s degrees alone do not qualify you for admission without a recognized Bachelor's foundation.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'field_reqs_content',
        label: 'Field Requirements Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Depending on your chosen faculty, specific subject prerequisites apply:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
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
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">You may apply before your Bachelor’s degree is officially completed if you are on track to graduate by 31 July 2026:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
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
    <div class="space-y-3">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">1. Prepare in Advance</h3>
        <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
            <li>Check programme-specific eligibility and entry deadlines.</li>
            <li>Prepare official certified academic documents and English translations.</li>
            <li>Schedule language proficiency tests and GMAT/GRE if required.</li>
        </ul>
    </div>
    
    <div class="space-y-3">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">2. Fill in the Online Application 2026</h3>
        <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
            <li><strong class="text-slate-900 font-bold">September Intake:</strong> Apply October – February</li>
            <li><strong class="text-slate-900 font-bold">January Intake:</strong> Apply June – September</li>
            <li>Submit only one application form per candidate (can rank up to two programmes).</li>
            <li>You can edit and update documents in your student portal until the intake closing date.</li>
        </ul>
    </div>

    <div class="space-y-3">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">3. Application Fee</h3>
        <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
            <li><strong class="text-slate-900 font-bold">International Applicants:</strong> Free ($0 Application Fee)</li>
            <li><strong class="text-slate-900 font-bold">Domestic Applicants (Canada &amp; PR):</strong> Free ($0 Application Fee)</li>
        </ul>
    </div>

    <div class="space-y-3">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">4. Upload Required Documents</h3>
        <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Submit all documents in clear PDF format through your portal. Late documents may delay evaluation decisions:</p>
        <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
            <li>Bachelor’s degree diploma &amp; official transcript of records</li>
            <li>Proof of English language proficiency</li>
            <li>Valid international passport identification page</li>
            <li>Curriculum Vitae (CV) &amp; Statement of Motivation</li>
            <li>Portfolio or GMAT/GRE score report (if required by programme)</li>
        </ul>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'documents_content',
        label: 'Required Documents Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Ensure all submitted documentation conforms to official verification standards:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Certified Educational Documents:</strong> Must be submitted after admission decision within 14 days of your admission decision.</li>
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
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">English language proficiency is mandatory for all Master’s programmes taught in English. Demonstrate your skills via an accepted language test or previous qualifying degree:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
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
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Certain programmes within the School of Business &amp; Economics require a standardized quantitative examination score:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
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
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Only complete applications are evaluated based on programme-specific academic criteria. Decision results are published within less than a week of submitting your application:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li><strong class="text-slate-900 font-bold">Direct Offers:</strong> Sent electronically to your registered email and student portal account.</li>
        <li><strong class="text-slate-900 font-bold">Waiting List Procedure:</strong> Places on the waiting list may be offered until 26 June 2026. Keep an eye on your email for updates.</li>
    </ul>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'after_content',
        label: 'After Admission Section',
        defaultContent: `<div class="space-y-4">
    <p class="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">Once you receive your Letter of Acceptance, complete the following onboarding steps to secure your study place:</p>
    <ul class="space-y-1.5 pt-1 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5">
        <li>Accept your offer in the student portal before the stated deadline.</li>
        <li>Submit certified degree documents and final transcripts.</li>
        <li>Pay tuition fees and obtain your Provincial Attestation Letter (PAL).</li>
        <li>Apply for your Canadian Study Permit and arrange accommodation in Ottawa.</li>
        <li>Complete online orientation and semester course registration.</li>
    </ul>
    <div class="pt-2">
        <a href="/student-guide/international" class="inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline hover:text-[#002f6c] transition-colors">Open International Student Guide &rarr;</a>
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
        defaultContent: `<p class="text-lg leading-relaxed mb-6">Cannoga College's tuition rates are highly competitive compared to other major colleges across Canada and significantly more affordable than university fees. Postsecondary education in Canada offers excellent value when compared to other English-speaking destinations like the United States or United Kingdom. Your overall expenses will depend on your selected program, housing preferences, and personal lifestyle. All tuition payments include comprehensive health insurance coverage.</p>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'fee_structure_content',
        label: 'Fee Structure Section',
        defaultContent: `<p class="text-lg leading-relaxed mb-6">Tuition fees at Cannoga College depend on your degree level, field of study, and start date. The exact amount for your programme is always listed in your personal admission letter.</p>
 <div class="bg-gray-100 p-6 md:p-12 pl-6 md:pl-16 rounded-xl"><p class="font-medium">Note: Students whose right to study began on or before 1 August 2025 may have different fee levels. The tables below apply to new students starting in 2026.</p></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'certificate_fees_content',
        label: 'Certificate Fees Section',
        defaultContent: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Certificate programs (6 months – 1 year)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,400</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$4,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'diploma_fees_content',
        label: 'Diploma Fees Section',
        defaultContent: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Diploma and Advanced Diploma programs (2 – 3 years)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,400</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$4,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'bachelor_fees_content',
        label: 'Bachelor Fees Section',
        defaultContent: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Bachelor's degree programs (4-year programs)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$4,000</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$6,400</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'master_fees_content',
        label: 'Master Fees Section',
        defaultContent: `<p class="text-black mb-6 font-normal">Annual tuition fee and deposit for Master's degree programs (2-year programs)</p>
<div class="w-full overflow-x-auto rounded-xl">
    <table class="w-full table-fixed text-left border-collapse">
        <thead class="bg-[#0f2027] text-white"><tr><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Student Residency</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Fee / yr</th><th class="w-1/3 px-2 py-2.5 font-normal whitespace-normal break-words">Tuition Deposit</th></tr></thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">Domestic Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$5,600</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
            <tr class="hover:bg-neutral-50"><td class="px-2 py-2.5 font-normal whitespace-normal break-words">International Students</td><td class="px-2 py-2.5 whitespace-normal break-words">$9,600</td><td class="px-2 py-2.5 whitespace-normal break-words">$2,000</td></tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'merit_scholarship_content',
        label: 'Merit Scholarship Section',
        defaultContent: `<div class="mb-8"><h3 class="text-2xl font-bold mb-4">Continuing Merit Scholarship</h3><p class="text-lg leading-relaxed mb-6">Cannoga College rewards academic excellence. After the first year, international students can apply for a merit scholarship covering 50% of tuition for the next academic year.</p><div class="grid md:grid-cols-2 gap-8"><div class="space-y-4"><h4 class="font-bold text-sm uppercase tracking-widest mb-2">Academic Criteria</h4><ul class="space-y-3"><li>Complete at least 55 credits per academic year</li><li>Maintain a minimum weighted GPA of 3.5 / 5.0</li></ul></div><div class="space-y-4"><h4 class="font-bold text-sm uppercase tracking-widest mb-2">Application & Review</h4><p class="text-sm leading-relaxed">Scholarship eligibility is automatically reviewed every August and eligible students will be notified before the autumn tuition deadline.</p></div></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'payment_methods_content',
        label: 'Payment Methods Section',
        defaultContent: `<div class="space-y-8"><div class="bg-gray-100 p-6 md:p-12 rounded-2xl"><p class="text-lg leading-relaxed mb-4">Cannoga provides secure, convenient payment options using local and international channels through our integrated payment gateway.</p><p class="leading-relaxed">All tuition payments are processed through our secure portal for accurate tracking, faster confirmation, and proper allocation to your student account.</p></div><div class="bg-card p-6 md:p-12 shadow-sm rounded-xl"><h3 class="text-xl font-bold mb-4 uppercase tracking-tight">Step-by-Step Payment Process</h3><div class="space-y-6"><div><h4 class="font-bold mb-1">Accept Your Offer</h4><p class="text-sm leading-relaxed">Once you accept your offer through the portal, you will be redirected to the secure payment page.</p></div><div><h4 class="font-bold mb-1">Choose Where You’re Paying From</h4><p class="text-sm leading-relaxed">Select the country from which you will make your payment. The portal shows local payment options specific to your location.</p></div><div><h4 class="font-bold mb-1">Review Payment Details</h4><p class="text-sm leading-relaxed">Confirm your full name, student ID, programme, amount payable, and payment reference before submitting.</p></div><div><h4 class="font-bold mb-1">Select Your Payment Method</h4><p class="text-sm leading-relaxed">Choose one of the available payment methods based on your country and preference.</p></div><div><h4 class="font-bold mb-1">Complete the Payment</h4><p class="text-sm leading-relaxed">Follow the on-screen instructions to pay securely.</p></div><div><h4 class="font-bold mb-1">Payment Confirmation</h4><p class="text-sm leading-relaxed">Once payment is confirmed, your payment status updates automatically and an official receipt is issued.</p></div></div></div><div class="grid md:grid-cols-2 gap-6"><div class="bg-gray-100 p-8 rounded-2xl shadow-sm"><h3 class="text-xl font-bold mb-4 uppercase tracking-tight">Processing Time</h3><p class="leading-relaxed">Most payments are confirmed within 24–72 hours, depending on the selected payment method.</p></div><div class="bg-gray-100 p-8 rounded-2xl shadow-sm"><h3 class="text-xl font-bold mb-4">Need Help With Payment?</h3><p class="leading-relaxed">If you experience any difficulties, contact the Admissions Office through your student portal or by email.</p><a href="mailto:admissions@cannogacollege.ca" class="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-black underline">Email Admissions</a></div></div><div class="bg-gray-100 p-6 rounded-xl shadow-sm"><p class="text-sm">Please pay by the deadline indicated in your official offer of admission to confirm your enrollment.</p></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'timing_content',
        label: 'Payment Schedule Section',
        defaultContent: `<div class="grid md:grid-cols-2 gap-8"><div class="bg-gray-100 p-6 rounded-2xl shadow-sm"><h3 class="text-xl font-bold mb-4">First Academic Year</h3><p class="leading-relaxed">After accepting the admission offer, pay the full tuition fee in a single instalment. Payment in multiple instalments is not permitted for first-year enrolment.</p></div><div class="bg-gray-100 p-6 rounded-2xl shadow-sm"><h3 class="text-xl font-bold mb-4">After the First Year</h3><p class="leading-relaxed">Students are encouraged to pay the full fee in one instalment during the annual enrolment period. Alternatively, two instalments may be allowed, but this can affect your attendance status.</p><div class="mt-4 p-4 bg-gray-100 rounded-lg text-sm">Important: Non-attending status may affect visa or study permit conditions.</div></div></div><p class="mt-8 text-black text-center">For further details, consult the official Cannoga College enrolment guidelines.</p>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'additional_fees_content',
        label: 'Additional Fees Section',
        defaultContent: `<div class="space-y-8"><div class="max-w-4xl"><h3 class="text-2xl font-bold mb-4 text-slate-900">Financial Requirements &amp; Living Costs</h3><p class="text-slate-700 leading-relaxed mb-6">Beyond tuition, ensure you have sufficient funds for rent, personal expenses, transportation, meals, insurance, and any Immigration, Refugees and Citizenship Canada (IRCC) requirements.</p><p class="text-slate-700 leading-relaxed">Cannoga College supports international students in finding accommodation in Ottawa, Ontario, Canada. Our housing guide covers all major providers and neighbourhoods.</p></div><div class="space-y-6 pt-2"><div><h3 class="text-xl font-bold mb-3 text-slate-900">What's Included?</h3><p class="text-slate-700 leading-relaxed mb-3">The tuition fee includes teaching and access to modern learning facilities. Core student services are free of charge:</p><ul class="space-y-3 pt-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5"><li><strong>Library access</strong></li><li><strong>Student Services</strong></li><li><strong>Career Services</strong></li><li><strong>Exchange Services</strong></li><li><strong>Study support</strong></li></ul></div><div><h3 class="text-xl font-bold mb-3 text-slate-900">Cannoga Student Association</h3><p class="text-slate-700 leading-relaxed mb-3">All enrolled students are members of the Cannoga Student Association (CSA), offering advocacy, events, discounts, and community.</p><ul class="space-y-3 pt-2 text-sm sm:text-base font-normal text-slate-700 leading-relaxed list-disc list-outside pl-5"><li>Campus dining discounts</li><li>OC Transpo U-Pass subsidy</li></ul></div></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'refunds_content',
        label: 'Refund Policy Section',
        defaultContent: `<div class="space-y-8"><div><h3 class="text-xl font-bold mb-3">Full Refund Cases</h3><ul class="grid md:grid-cols-2 gap-4 text-sm"><li>Conditional offer cancelled (conditions not met)</li><li>Renounce study right during enrolment</li><li>Residence permit denied</li><li>Residence status becomes exempt</li><li>Programme cancellation by University</li></ul></div><div class="bg-gray-100 p-6 rounded-xl"><h3 class="font-bold text-lg mb-2">Refund Application</h3><p class="leading-relaxed mb-4">To request a refund, contact the tuition fee team by the relevant deadline.</p><p class="text-sm">Refunds normally exclude service and bank charges. For the full policy, visit our <a href="/refund-withdrawal-policy/" class="underline font-bold">Refund & Withdrawal Policy</a>.</p></div></div>`,
    },
    {
        pageSlug: 'admissions/tuition',
        sectionKey: 'contact_content',
        label: 'Contact Section',
        defaultContent: `<p class="text-black mb-10 max-w-2xl mx-auto text-lg leading-relaxed">If you have questions about payment processes, deadlines, or refunds, contact the Tuition Fee Office.</p><a href="mailto:tuition@cannogacollege.ca" class="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-md">Contact Tuition Office</a>`,
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
        defaultContent: 'Apply to Cannoga College Ottawa and begin your Bachelor’s or Master’s studies in an internationally focused learning environment. Our admissions process is transparent, supportive, and open to students from around the world.',
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

