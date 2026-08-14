const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateDetailedContent() {
    console.log('Updating News content in DB...');

    const newsUpdates = [
        {
            slug: 'cannoga-graduate-employment-2026',
            title: 'Cannoga College Recognized as Top Ontario Institution for Graduate Employment',
            excerpt: 'The latest Ministry of Colleges and Universities KPI survey confirms Cannoga graduates lead provincial employment outcomes, achieving a 94.2% placement rate within six months of graduation.',
            content: `Cannoga College has achieved the highest graduate employment rate among Ontario post-secondary institutions, according to the annual Key Performance Indicators (KPI) survey released by the Ministry of Colleges and Universities.

The report highlights that 94.2% of Cannoga College graduates secured full-time employment in their field of study within six months of completing their diploma or degree. Furthermore, employer satisfaction with Cannoga graduates reached an outstanding 96.8%.

Key Highlights from the 2026 Ministry KPI Report:

1. Exceptional Placement in Technology & Healthcare
Graduates from the School of Technology and the School of Health & Community Services achieved a near-perfect 98% employment rate, driven by acute industry demand across Eastern Ontario and Ottawa's technology cluster.

2. Strong Earnings and Career Advancement
The survey indicated that Cannoga alumni start with competitive starting salaries that exceed the provincial average for college graduates, with over 78% reporting opportunities for career advancement within their first year.

3. Employer Satisfaction and Industry Readiness
Employers cited strong practical competencies, project management skills, and hands-on laboratory experience as key differentiators of Cannoga alumni.

"Our commitment to experiential learning, state-of-the-art lab environments, and direct industry collaboration ensures that our students step out of the classroom and directly into meaningful careers," stated Dr. Robert Vance, Vice-President Academic.

"This recognition reflects the dedication of our faculty and the tremendous effort of our students and industry partners."

Preparing for the Future of Work
As Ottawa continues to grow as North America's leading tech hub, Cannoga College remains focused on expanding co-op opportunities, industry-sponsored capstone projects, and specialized micro-credentials designed for modern workforce demands.`,
            imageUrl: '/images/home-carousel-1.png',
            publishDate: '2026-02-10T00:00:00Z',
            published: true
        },
        {
            slug: 'ottawa-coop-partnerships',
            title: 'New Partnerships Announced with Ottawa Tech Sector for Co-op Placements',
            excerpt: 'Eight leading Ottawa technology and engineering firms have signed formal agreements to provide paid co-op placements for Cannoga College students starting Autumn 2026.',
            content: `Cannoga College is proud to announce eight new strategic industry partnerships with prominent technology, engineering, and cybersecurity enterprises across the National Capital Region.

These agreements will create over 150 new paid co-op placements annually for students enrolled in Business Administration, Computer Science, Cyber Security, and Software Engineering programs.

Partner Organizations Include:
- Kanata North Tech Association Hub
- Ottawa CleanTech Solutions Inc.
- Apex Cyber Defense Networks
- Capital Data Analytics Group
- Ottawa BioMed Technologies
- NextGen Cloud Systems Canada
- Federal Public Sector IT Contractors Network
- Ottawa Renewable Energy Research Co.

Empowering Students with Real-World Experience
Co-op placements provide students with hands-on, paid work experience integrated directly into their academic curriculum. Students work alongside senior engineers, software architects, and project managers, gaining invaluable workplace exposure before graduation.

"Ottawa's tech sector is booming, and our companies urgently require talented, job-ready graduates," said Sarah Jenkins, Executive Director of the Kanata North Tech Association. "Cannoga College has proven to be an exceptional talent pipeline for our member companies."

Co-op Program Structure & PGWP Support
International and domestic students participating in Cannoga's co-op programs receive full support from the Career Services Centre, including resume workshops, mock interview sessions, and dedicated co-op advisors.

For international students, co-op work terms are fully compliant with Immigration, Refugees and Citizenship Canada (IRCC) co-op work permit requirements and count toward valuable Canadian work experience.`,
            imageUrl: '/images/home-carousel-2.png',
            publishDate: '2026-02-08T00:00:00Z',
            published: true
        },
        {
            slug: 'cannoga-launches-ai-tech-hub',
            title: 'Cannoga Launches Next-Generation Applied AI & Tech Innovation Hub',
            excerpt: 'A state-of-the-art research facility dedicated to artificial intelligence, machine learning, robotics, and cybersecurity opens at the Ottawa main campus.',
            content: `Cannoga College has officially opened its new $12-million Applied AI & Tech Innovation Hub at the Ottawa campus, marking a major milestone in practical technology education in Ontario.

The facility features high-performance GPU computing clusters, dedicated robotics testing arenas, cybersecurity simulation labs, and collaborative workspace for student startups and faculty researchers.

Core Capabilities of the New AI Hub:

1. Artificial Intelligence & Machine Learning Lab
Equipped with enterprise-grade server infrastructure, allowing students to train large language models, computer vision systems, and predictive analytics applications.

2. Cyber Security Operations Center (SOC)
A simulated enterprise network environment where cybersecurity students learn real-time threat detection, incident response, and ethical hacking protocols.

3. Applied Industry Research Hub
Small and medium-sized enterprises (SMEs) across Eastern Ontario will collaborate directly with Cannoga faculty and students to develop AI prototypes and test automation solutions.

"The Applied AI Hub is not just a building; it is a catalyst for innovation," said Dr. Marcus Thorne, Dean of the School of Technology. "Our students will work on real-world challenges using the exact tools and infrastructure employed by top technology firms globally."

Student Hackathons and Industry Mentorship
Starting Autumn 2026, the Hub will host annual student hackathons, industry pitch competitions, and developer workshops featuring guest speakers from leading global tech companies.`,
            imageUrl: '/images/technology.jpg',
            publishDate: '2026-02-01T00:00:00Z',
            published: true
        }
    ];

    for (const item of newsUpdates) {
        const { error } = await supabase.from('News').upsert(item, { onConflict: 'slug' });
        if (error) {
            console.error('Error updating news:', item.slug, error);
        } else {
            console.log('Successfully updated news:', item.slug);
        }
    }

    console.log('\nUpdating Event content in DB...');
    const eventUpdates = [
        {
            slug: 'orientation-week-2026',
            title: 'Orientation Week — Ottawa Campus',
            category: 'ALL STUDENTS',
            date: '2026-09-01T09:00:00Z',
            location: 'Cannoga Main Campus, Ottawa',
            content: `Welcome to Cannoga College! Orientation Week is designed to help new domestic and international students transition seamlessly into academic life on our Ottawa campus.

Event Schedule & Highlights:

Day 1: Official Welcome Ceremony & Campus Tours
- Opening remarks by College Executives and Student Union Leaders
- Guided campus walking tours covering academic halls, labs, library, and student dining
- Campus ID card pickup and IT portal setup support

Day 2: Academic Program Information Sessions
- Meet your faculty deans, department chairs, and academic advisors
- Program curriculum overviews, syllabus breakdowns, and lab safety briefings
- Textbooks and digital learning material distribution

Day 3: Student Life & Ottawa Integration Fair
- Explore over 30 student clubs, sports teams, and volunteer opportunities
- Housing, transit pass (U-Pass), health insurance, and banking guidance for newcomers
- Welcome BBQ and live music performance at the campus courtyard

Day 4: Career & Co-Op Workshop
- Introduction to Career Services, resume writing tools, and campus employment
- Work-Integrated Learning (WIL) and co-op planning session

Join us to meet fellow students, discover campus resources, and start your college journey with confidence!`,
            imageUrl: '/images/home-carousel-3.png',
            published: true
        },
        {
            slug: 'ircc-study-permit-workshop',
            title: 'IRCC Study Permit & Visa Information Workshop',
            category: 'INTERNATIONAL',
            date: '2026-09-08T14:00:00Z',
            location: 'Student Center Auditorium & Online Stream',
            content: `Attending international students are invited to a comprehensive legal and immigration information workshop presented by Regulated Canadian Immigration Consultants (RCICs) and Cannoga International Student Advisors.

Workshop Agenda & Covered Topics:

1. Maintaining Valid Study Permit Status
- Understanding study permit conditions, full-time student status requirements, and DLI compliance.
- How to extend study permits prior to expiration dates.

2. On-Campus and Off-Campus Work Regulations
- Hour limits and eligibility rules for working off-campus during regular academic terms and scheduled breaks.
- Social Insurance Number (SIN) application procedure.

3. Post-Graduation Work Permit (PGWP) Pathway
- Detailed eligibility criteria for 1-year to 3-year PGWP open work permits.
- Key timelines and required documentation post-graduation.

4. Permanent Residency (PR) Overview
- Introduction to Express Entry (Canadian Experience Class) and the Ontario Immigrant Nominee Program (OINP).

Q&A Session:
A live 45-minute Q&A session will follow the presentation to address individual student inquiries.`,
            imageUrl: '/images/events/ircc-study-permit-workshop.jpg',
            published: true
        },
        {
            slug: 'ottawa-tech-business-career-fair',
            title: 'Ottawa Technology & Business Career Fair',
            category: 'CAREERS',
            date: '2026-09-15T10:00:00Z',
            location: 'Cannoga Exhibition Center',
            content: `Connect directly with hiring managers, talent recruiters, and department heads from over 50 leading companies across Ottawa and Eastern Ontario at the Autumn 2026 Career Fair.

Participating Sectors:
- Software Engineering, AI & IT Infrastructure
- Financial Services, Accounting & Business Analytics
- Health Sciences, Nursing & Biotechnology
- Tourism, Hospitality & Event Management
- Government Agencies & Public Sector Contractors

What to Bring & How to Prepare:
- Bring multiple printed copies of your updated resume / CV.
- Dress in professional business attire.
- Prepare a 30-second elevator pitch introducing your background and skills.
- Pre-register via the Student Portal to receive expedited fast-track entry badges.

Free Professional Headshots:
A professional photo booth will be available free of charge for students wishing to update their LinkedIn profiles.`,
            imageUrl: '/images/business.jpg',
            published: true
        }
    ];

    for (const item of eventUpdates) {
        const { error } = await supabase.from('Event').upsert(item, { onConflict: 'slug' });
        if (error) {
            console.error('Error updating event:', item.slug, error);
        } else {
            console.log('Successfully updated event:', item.slug);
        }
    }

    console.log('\nAll updates completed successfully!');
}

updateDetailedContent();
