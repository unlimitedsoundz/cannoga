const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const updates = [
    {
        id: '1af91779-13cf-4e94-b3ad-c0ac8ba68a08',
        title: 'Cannoga College Launches New Ottawa Campus for the 2026–2027 Academic Year',
        slug: 'cannoga-college-ottawa-campus-2026',
        excerpt: 'Cannoga College officially opens its expanded Ottawa campus, welcoming a diverse cohort of domestic and international students for the upcoming academic year.',
        content: `Cannoga College is proud to announce the launch of its expanded Ottawa Campus ahead of the 2026–2027 academic year. Located in Ottawa, Canada's capital city, the campus features state-of-the-art learning facilities, modern labs, collaborative workspaces, and enhanced student services designed to support academic excellence and student wellbeing.

The college has invested in upgrading its infrastructure to accommodate growing enrolment across all faculties, including Business Administration, Information Technology, Health Sciences, and Engineering Foundations. New dedicated spaces for student services — including an International Student Centre, Career Development Hub, and Wellness Resource Room — are now operational.

President of Cannoga College, Dr. Michael Osei, welcomed students, faculty, and community partners to the milestone: "This campus expansion reflects our commitment to delivering a world-class education experience right here in Ottawa. We are building not just classrooms, but a community."

Cannoga College continues to welcome applications from both domestic and international students for all Certificate, Diploma, and Degree programs. For more information, visit cannogacollege.ca or contact admissions@cannogacollege.ca.`
    },
    {
        id: '9b919478-c7a0-43a5-873f-2c9fbf730372',
        title: '2026 Spring Break: Student Activities, Travel Opportunities & Campus Events in Ottawa',
        slug: 'spring-break-ottawa-2026',
        excerpt: 'Cannoga College students enjoy a packed spring break with campus events, community volunteering, and guided travel opportunities across Ontario and Quebec.',
        content: `Cannoga College students made the most of the 2026 spring break with a variety of enriching activities organized by the Cannoga Student Association (CSA) and the Student Life Office.

Campus Events:
The Student Life Office hosted a Spring Wellness Fair on campus, featuring fitness workshops, mental health resources, and cultural exchange activities. International students were invited to participate in a guided Ottawa city tour, exploring landmarks such as Parliament Hill, the Rideau Canal, and the Byward Market.

Community Volunteering:
Over 120 students volunteered with Ottawa Community Housing and local food banks as part of Cannoga College's ongoing civic engagement initiative. "Giving back to the city that's become our home is incredibly meaningful," said Amara Diallo, a third-year Business student.

Travel Opportunities:
The CSA partnered with a licensed travel agency to offer optional weekend trips to Montreal, Toronto, and Niagara Falls. Students from over 30 countries participated, creating connections that extended well beyond the classroom.

Cannoga College encourages all students to engage with the campus community and explore all that Ottawa and Canada have to offer. Check the Student Portal for upcoming events and opportunities.`
    },
    {
        id: '90225ff6-ed0f-4f00-a271-c3a14b3abfb5',
        title: 'Applications Now Open: September 2026 and January 2027 Intake at Cannoga College',
        slug: 'applications-open-sept-2026-jan-2027',
        excerpt: 'Cannoga College is now accepting applications for its September 2026 and January 2027 intakes across all Certificate, Diploma, and Degree programs.',
        content: `Cannoga College is pleased to announce that applications are now open for the September 2026 and January 2027 academic intakes. Students are encouraged to apply early to secure their place and benefit from early applicant support services.

Application Windows:
- September 2026 Intake: Apply October – February (early application recommended)
- January 2027 Intake: Apply June – September (early application recommended)

Programs Available:
Applications are open across all faculties including Business Administration, Information Technology, Health Sciences, Hospitality and Tourism, Engineering Foundations, Education, and Social Sciences. Both full-time and part-time study options are available for select programs.

How to Apply:
1. Create an account on the Cannoga College Student Portal at cannogacollege.ca/portal
2. Complete the online application form
3. Upload required documents (transcripts, English proficiency test results, passport)
4. Submit — no application fee required

International Students:
Cannoga College welcomes applications from students worldwide. Our dedicated International Admissions team offers guidance on study permits, document requirements, and settlement support. Contact admissions@cannogacollege.ca for personalized assistance.

For full eligibility criteria and program-specific requirements, visit cannogacollege.ca/admissions.`
    },
    {
        id: '6220902b-7c0c-4d60-9ca8-6538151c3855',
        title: 'Young Innovators Shine at the Cannoga College Annual STEM Showcase 2026',
        slug: 'cannoga-stem-showcase-2026',
        excerpt: 'Cannoga College hosted its Annual STEM Showcase, celebrating student-led innovation in technology, data science, environmental engineering, and health informatics.',
        content: `Cannoga College hosted its Annual STEM Showcase 2026 at the Ottawa Campus, bringing together students, faculty, industry professionals, and community partners for a day of innovation, collaboration, and discovery.

This year's showcase featured over 60 student-led projects spanning disciplines including Artificial Intelligence, Environmental Engineering, Health Informatics, Cybersecurity, and Sustainable Technology. Judges from leading Ottawa-area companies and research organizations evaluated projects across categories including social impact, technical innovation, and commercial viability.

Top Projects:
🥇 First Place – "AquaTrack": A real-time water quality monitoring system for the Ottawa River, built by a team of Environmental Engineering students.
🥈 Second Place – "MediLink": A patient-communication app designed to reduce appointment no-shows in Ontario's healthcare system.
🥉 Third Place – "GreenRoute": An AI-powered public transit optimization model for the OC Transpo network.

Faculty Director of Research and Innovation, Dr. Priya Mehta, addressed the audience: "Our students are solving real problems affecting real communities. The STEM Showcase is proof that when you combine curiosity with the right environment, remarkable things happen."

Industry partners including Shopify, Calian Group, and the National Research Council of Canada (NRC) engaged with student teams and expressed interest in further collaboration and co-op placements.

The STEM Showcase reflects Cannoga College's commitment to applied learning, research, and building the next generation of Canadian innovators. For information on our STEM programs, visit cannogacollege.ca/programs.`
    }
];

(async () => {
    let updated = 0;
    for (const u of updates) {
        const { error } = await s.from('News').update({
            title: u.title,
            slug: u.slug,
            excerpt: u.excerpt,
            content: u.content,
            updatedAt: new Date().toISOString()
        }).eq('id', u.id);
        if (error) console.error('❌', u.title.slice(0, 50), error.message);
        else { console.log('✅', u.title.slice(0, 70)); updated++; }
    }
    console.log(`\nDone: ${updated}/${updates.length} updated.`);
})().catch(console.error);
