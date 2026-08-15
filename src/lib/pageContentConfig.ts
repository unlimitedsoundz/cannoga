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
<p class="text-sm font-bold tracking-widest">— Dean of Admissions</p>`,
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
        defaultContent: `<div class="rounded-xl overflow-hidden border border-neutral-200 shadow-sm my-4">
    <table class="w-full text-left border-collapse">
        <thead class="bg-[#0f2027] text-white">
            <tr>
                <th class="p-4 font-bold">Intake Stage</th>
                <th class="p-4 font-bold">Application Window</th>
                <th class="p-4 font-bold">Best Time to Apply / Details</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 text-black">
            <tr class="hover:bg-neutral-50">
                <td class="p-4 font-medium">September Intake</td>
                <td class="p-4">October – February</td>
                <td class="p-4 font-semibold text-black">Early application: October – December</td>
            </tr>
            <tr class="hover:bg-neutral-50">
                <td class="p-4 font-medium">January Intake</td>
                <td class="p-4">June – September</td>
                <td class="p-4 font-semibold text-black">Early application: June – August</td>
            </tr>
            <tr class="hover:bg-neutral-50">
                <td class="p-4 font-medium">Evaluation Phase</td>
                <td class="p-4" colspan="2">Applications reviewed by the admissions committee and faculty within 4–6 weeks.</td>
            </tr>
            <tr class="hover:bg-neutral-50">
                <td class="p-4 font-medium">Decision</td>
                <td class="p-4" colspan="2">Admission decision communicated by email within 1 week of evaluation.</td>
            </tr>
            <tr class="hover:bg-neutral-50">
                <td class="p-4 font-medium">Studies Start</td>
                <td class="p-4" colspan="2">September (Fall) or January (Winter)</td>
            </tr>
        </tbody>
    </table>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'study_options_content',
        label: 'Study Options Section',
        defaultContent: `<div class="space-y-6 text-black">
    <p class="text-lg leading-relaxed">Cannoga College provides master's education across diverse fields of study, including Art and Design, Business and Economics, Technology and Engineering, Education, Science, Health and Life Sciences, and Transportation and Aviation.</p>

    <div>
        <h3 class="text-xl font-bold mb-4">Master’s Degrees Granted</h3>
        <ul class="space-y-3 text-base">
            <li><strong>In the field of Art and Design:</strong> Master of Arts (Art and Design)</li>
            <li><strong>In the field of Business and Economics:</strong> Master of Science (Economics and Business Administration)</li>
            <li><strong>In the field of Technology and Engineering:</strong> Master of Science (Technology), Master of Science (Architecture), or Master of Science (Landscape Architecture)</li>
            <li><strong>In the field of Education and Science:</strong> Master of Arts (Education), Master of Science (Educational Leadership), or Master of Science (Natural & Applied Sciences)</li>
            <li><strong>In the field of Health and Life Sciences:</strong> Master of Science (Healthcare Management & Public Health)</li>
            <li><strong>In the field of Transportation and Aviation:</strong> Master of Science (Aviation Management & Transport Logistics)</li>
        </ul>
        <p class="mt-4 font-semibold text-sm text-gray-700">You may apply to a maximum of two study options.</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Art & Design</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MA in Design, Architecture, Visual Arts, and Media Practices.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Business & Economics</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Accounting & Finance, Strategic Management, and Economics.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Technology & Engineering</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Engineering, Computer Science, Data Analytics, and Architecture.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Education</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MA/MSc in Pedagogy, Educational Leadership, and Curriculum Design.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Science</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Environmental Science, Applied Physics, and Bio-Analytics.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Health & Life Sciences</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Healthcare Leadership, Clinical Management, and Public Health.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Transportation & Aviation</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Aviation Operations, Supply Chain Logistics, and Transport Safety.</p>
        </div>
    </div>

    <p class="text-sm text-gray-600 pt-2">You can find all Cannoga College study options on the <a href="/studies" class="underline font-bold text-black hover:text-neutral-700">Degree programmes page</a>. You can filter your search results by field of education, level of degree, and language of instruction. On each study option's page, you will find detailed information on the studies, language of instruction, and admissions criteria.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'scholarships_content',
        label: 'Scholarships Section',
        defaultContent: `<p class="text-lg text-black leading-relaxed">At Cannoga College, we believe in rewarding academic excellence and supporting students through various financial aid options. Our scholarship programme is designed to help international talent thrive in Ottawa, Ontario, Canada.</p>
<ul class="space-y-4">
    <li class="flex gap-4 items-start">Merit-Based Scholarships Awarded to top-performing applicants based on academic record.</li>
    <li class="flex gap-4 items-start">Performance Waivers Maintain a 3.5 GPA and 55 credits/year for a 50% waiver from the 2nd year onwards.</li>
</ul>
<p><a href="/admissions/tuition" class="inline-flex items-center gap-2 text-black font-bold hover:opacity-70 transition-colors">See detailed tuition info →</a></p>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'eligibility_content',
        label: 'Eligibility Section',
        defaultContent: `<div class="bg-gray-50 text-black p-12 rounded-3xl shadow-xl">
    <ul class="space-y-4 text-lg">
        <li>Hold a Bachelor’s degree (180 credits) or equivalent.</li>
        <li>Degree must enable eligibility for Master’s study in the awarding country.</li>
        <li>Only long-cycle degrees are considered in place of a Bachelor’s.</li>
    </ul>
    <div class="mt-8 pt-6 border-t border-gray-200 text-sm">Important: Previous Master’s degrees alone do not qualify you for admission.</div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'field_reqs_content',
        label: 'Field Requirements Section',
        defaultContent: `<div class="space-y-6">
    <div class="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-sm"><h3 class="font-bold text-lg mb-2">Art and Design</h3><p>Applicants without a formal Bachelor’s degree may apply if they have equivalent skills through portfolios, work experience, or other studies.</p></div>
    <div class="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-sm"><h3 class="font-bold text-lg mb-2">Business and Economics</h3><p>Some programmes require GMAT or GRE scores.</p></div>
    <div class="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-sm"><h3 class="font-bold text-lg mb-2">Technology/Engineering</h3><p>Some may require relevant coursework or skills in mathematics, programming, or design.</p></div>
    <div class="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-sm"><h3 class="font-bold text-lg mb-2">Science</h3><p>Requires a relevant Bachelor’s degree in natural sciences, physics, chemistry, or environmental science.</p></div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'incomplete_content',
        label: 'Incomplete Degree Section',
        defaultContent: `<p>You may apply before your Bachelor’s degree is complete if you will graduate by 31 July 2026.</p>
<ul class="space-y-3 pt-4">
    <li>Admission is conditional upon submission of certified final degree documents within 14 days of your admission decision.</li>
    <li>Failure to submit by the deadline will cancel your study right.</li>
</ul>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'steps_content',
        label: 'Application Steps Section',
        defaultContent: `<div class="space-y-8">
    <div><h3 class="text-xl font-bold mb-4">Prepare in Advance</h3><ul class="space-y-3 text-sm"><li>Check programme-specific eligibility</li><li>Prepare official documents and translations</li><li>Schedule language tests and GMAT/GRE if required</li></ul></div>
    <div><h3 class="text-[18px] font-bold mb-4"><a href="https://cannogacollege.ca/portal/account/register" class="text-black underline hover:opacity-80">Fill in the Online Application 2026</a></h3><ul class="space-y-3 text-sm mb-4"><li><a href="https://cannogacollege.ca/portal/account/register" class="font-bold underline text-black hover:opacity-80">Fill in the Online Application 2026 →</a></li><li><strong>September intake:</strong> Apply October – February</li><li><strong>January intake:</strong> Apply June – September</li><li>Only one form per applicant</li><li>Can include two programmes ranked by preference</li><li>Edit application until closing date</li></ul></div>
    <div><h3 class="text-xl font-bold mb-4">Application Fee</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4"><div class="p-6 bg-gray-50 rounded-3xl shadow-sm"><div>International Applicants</div><div class="text-2xl font-bold mt-1">Free</div></div><div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-sm"><div>Domestic (Canada & Nordic)</div><div class="text-2xl font-bold mt-1">Free</div></div></div><p class="text-sm">No payment required to submit your application.</p></div>
    <div><h3 class="text-xl font-bold mb-4">Upload Required Documents</h3><p class="mb-4">Submit documents with your application. Late documents may delay your decision.</p><ul class="grid sm:grid-cols-2 gap-4 text-sm mb-6"><li>Bachelor’s degree & transcripts</li><li>Proof of English proficiency</li><li>International passport only</li><li>CV, Motivation Letter</li><li>Portfolio (if required)</li><li>GMAT/GRE (if required)</li></ul><p class="text-xs text-gray-500">File format: PDF only, named appropriately.</p></div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'documents_content',
        label: 'Required Documents Section',
        defaultContent: `<div class="grid gap-6 md:grid-cols-2">
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-sm"><h4 class="font-bold mb-2">Certified Educational Documents</h4><p class="text-sm">Must be submitted after admission decision by 13 May or 14 August 2026.</p></div>
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-sm"><h4 class="font-bold mb-2">Translations</h4><p class="text-sm">Non-English documents require official certified translations.</p></div>
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-sm"><h4 class="font-bold mb-2">Passport</h4><p class="text-sm">Color PDF of the personal information page.</p></div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'language_content',
        label: 'Language Requirements Section',
        defaultContent: `<div class="bg-gradient-to-br from-gray-50 to-gray-100 text-black rounded-3xl p-12 shadow-sm">
    <h3 class="font-bold text-xl mb-6">Language Proficiency Details</h3>
    <div class="space-y-4">
        <p class="leading-relaxed">English language proficiency is mandatory for all Master’s programmes taught in English. Demonstrate your skills via an accepted language test or previous studies.</p>
        <ul class="space-y-6 pt-6 flex flex-col">
            <li><div class="font-bold uppercase tracking-widest text-[10px] mb-1">Tests</div><div class="text-sm leading-relaxed">Acceptable tests: IELTS Academic, TOEFL iBT, PTE Academic, or C1 Advanced/C2 Proficiency.</div></li>
            <li><div class="font-bold uppercase tracking-widest text-[10px] mb-1">Exemptions</div><div class="text-sm leading-relaxed">Applicants who completed a degree taught entirely in English in Canada, Australia, New Zealand, the USA, or the UK may be exempt from language requirements.</div></li>
        </ul>
    </div>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'gmat_content',
        label: 'GMAT / GRE Section',
        defaultContent: `<div class="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl text-black shadow-sm">
    <p class="mb-6 font-medium">Certain programmes in Business and Economics require a GMAT or GRE score.</p>
    <ul class="space-y-4 text-sm">
        <li>Minimum Focus Edition score: 555</li>
        <li>GRE General Test equivalent accepted</li>
    </ul>
    <p class="mt-8 text-sm">Scores must be sent directly by the testing organization to Cannoga College.</p>
</div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'decisions_content',
        label: 'Decisions Section',
        defaultContent: `<p class="mb-6 font-medium">Only complete applications are evaluated based on programme-specific criteria. Decision results are published within less than a week of submitting your application.</p>
<div class="bg-gray-50 text-black p-8 rounded-3xl shadow-lg"><div class="font-bold text-lg mb-1">Waiting List Procedure</div><div class="text-sm">Places on the waiting list may be offered until 26 June 2026. Keep an eye on your email.</div></div>`,
    },
    {
        pageSlug: 'admissions/master',
        sectionKey: 'after_content',
        label: 'After Admission Section',
        defaultContent: `<div class="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl text-black shadow-sm">
    <ul class="space-y-6 font-bold text-lg mb-8">
        <li>Accept the offer by the stated deadline.</li>
        <li>Submit certified documents by the required deadline.</li>
        <li>Pay tuition fees if applicable.</li>
        <li>Complete enrolment and orientation.</li>
    </ul>
    <div class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
        <h4 class="font-bold mb-2">International Students</h4>
        <p class="text-sm leading-relaxed mb-6">moving to Ottawa, Ontario, Canada requires planning. Read our comprehensive guide on study permits, housing, and arrival.</p>
        <a href="/student-guide/international" class="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm">Open International Student Guide →</a>
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
        defaultContent: `<div class="space-y-16"><div class="max-w-4xl"><h3 class="text-2xl font-bold mb-6">Financial Requirements &amp; Living Costs</h3><p class="text-neutral-600 leading-relaxed mb-8">Beyond tuition, ensure you have sufficient funds for rent, personal expenses, transportation, meals, insurance, and any Immigration, Refugees and Citizenship Canada (IRCC) requirements.</p><div class="p-8 bg-gray-100 rounded-2xl shadow-sm"><p class="font-bold">Cannoga College supports international students in finding accommodation in Ottawa, Ontario, Canada. Our housing guide covers all major providers and neighbourhoods.</p></div></div><div class="grid md:grid-cols-2 gap-8"><div class="p-8 bg-gray-100 rounded-3xl shadow-sm"><h3 class="text-xl font-bold mb-4">What's Included?</h3><p class="mb-6">The tuition fee includes teaching and access to modern learning facilities. Core student services are free of charge.</p><ul class="grid grid-cols-1 gap-3 text-sm font-medium"><li>Library access</li><li>Student Services</li><li>Career Services</li><li>Exchange Services</li><li>Study support</li></ul></div><div class="p-8 bg-[#0f2027] text-white rounded-3xl shadow-md"><h3 class="text-xl font-bold mb-4">Cannoga Student Association</h3><p class="leading-relaxed mb-6">All enrolled students are members of the Cannoga Student Association (CSA), offering advocacy, events, discounts, and community.</p><div class="space-y-3"><div class="p-3 bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest">Campus dining discounts</div><div class="p-3 bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest">OC Transpo U-Pass subsidy</div></div></div></div></div>`,
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

