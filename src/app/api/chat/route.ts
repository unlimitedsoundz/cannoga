import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { STATIC_SCHOOLS } from '@/lib/schools';

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

// Comprehensive Verified Cannoga College & Canada Knowledge Engine
const CANNOGA_VERIFIED_KNOWLEDGE = [
    {
        keywords: ['deposit', 'tuition deposit', '2000', '2,000', 'seat', 'reserve', 'confirmation deposit', 'pal deposit'],
        title: 'Tuition Deposit Policy ($2,000 CAD)',
        content: `### 🎓 Confirmation Tuition Deposit
* **Deposit Amount:** **$2,000 CAD** across all academic programs (Certificates, Diplomas, Advanced Diplomas, and Bachelor's).
* **Purpose:** Confirms your admission offer, reserves your seat in your chosen intake cohort, and initiates the immediate issuance of your **Provincial Attestation Letter (PAL)** and official Letter of Acceptance (LOA) for international students.
* **Credited 100%:** The full $2,000 CAD is credited directly against your first-term tuition fees balance.
* **Refund Exception:** The deposit is non-refundable; however, if an international applicant receives an official **Study Permit / Visa Refusal** from IRCC, **100% of the tuition deposit and prepaid fees will be refunded** (minus a standard $100 CAD administrative processing fee) upon submitting the refusal letter within 14 calendar days.
* **Payment Methods:** Payable securely via Flywire, Convera, Credit Card, or Bank Wire through the [Student Portal](https://cannogacollege.ca/portal).`
    },
    {
        keywords: ['tuition', 'fee', 'fees', 'cost', 'how much', 'price', 'afford', 'payment plan', 'osap'],
        title: 'Tuition & Academic Fees Breakdown',
        content: `### 💰 Cannoga College Tuition Schedule (Annual)
| Credential Level | Domestic Students | International Students | Tuition Deposit |
| :--- | :--- | :--- | :--- |
| **Postgraduate Certificate (6m–1y)** | CAD $2,400 / yr | CAD $4,000 / yr | CAD $2,000 |
| **Diploma (2y)** | CAD $2,400 / yr | CAD $4,000 / yr | CAD $2,000 |
| **Advanced Diploma (3y)** | CAD $5,600 / yr | CAD $9,600 / yr | CAD $2,000 |
| **Bachelor's Degree (4y)** | CAD $4,000 / yr | CAD $6,400 / yr | CAD $2,000 |

* **Financial Aid & OSAP:** Domestic Ontario students are eligible for the Ontario Student Assistance Program (OSAP) and flexible repayment plans (RAP).
* **Payment Options:** Flexible installment plans per semester are available upon request through the Registrar.`
    },
    {
        keywords: ['pal', 'provincial attestation letter', 'attestation', 'cap', 'ircc cap', 'visa letter', 'dli', 'dli number', 'designated learning institution'],
        title: 'Provincial Attestation Letter (PAL) & DLI Guide',
        content: `### 🇨🇦 Provincial Attestation Letter (PAL) & DLI Details
* **Designated Learning Institution (DLI) #:** **O19387496264**
* **What is a PAL:** A mandatory Canadian provincial certification required by Immigration, Refugees and Citizenship Canada (IRCC) to accompany study permit applications.
* **How to receive a PAL at Cannoga College:**
  1. Receive your official Offer of Admission.
  2. Accept your offer in the [Applicant Portal](https://cannogacollege.ca/portal).
  3. Pay the **$2,000 CAD confirmation tuition deposit**.
  4. Once payment is verified, Cannoga's International Admissions Office allocates and issues your official **PAL document & final LOA** within 3–5 business days.
* **No extra PAL fee:** The PAL allocation is included with your admission confirmation.`
    },
    {
        keywords: ['pgwp', 'work permit', 'after graduation', 'post graduation', 'work in canada', 'stay in canada', 'working after'],
        title: 'Post-Graduation Work Permit (PGWP) & Career Pathways',
        content: `### 🍁 Post-Graduation Work Permit (PGWP) & Canadian Careers
* **PGWP Eligibility:** Graduates of eligible full-time Cannoga College academic programs qualify to apply for an open Post-Graduation Work Permit (PGWP) without requiring a job offer beforehand.
* **Duration:**
  * **2+ Year Programs (Diplomas, Advanced Diplomas, Bachelor's):** Up to a **3-Year Open Work Permit**.
  * **Programs 8 months to 2 years:** Work permit length matches your study duration.
* **Permanent Residency (PR) Transitions:**
  * **Canadian Experience Class (Express Entry):** Eligible after 1 year of skilled work in Canada.
  * **Ontario Immigrant Nominee Program (OINP):** Direct provincial nomination streams for Ontario college and university graduates.`
    },
    {
        keywords: ['work', 'working', 'job', 'part time', 'hours', '24 hours', 'off campus', 'on campus', 'earn'],
        title: 'Working While Studying in Canada',
        content: `### 💼 Working While Studying at Cannoga
* **Off-Campus Work:** International students enrolled full-time can work up to **24 hours per week** off-campus during regular academic semesters.
* **Full-Time During Breaks:** You are eligible to work full-time (up to 40+ hrs/week) during scheduled academic breaks, holidays, and summer vacations.
* **On-Campus Jobs:** Access opportunities directly on campus in research, peer tutoring, student services, and campus administration.
* **Average Wages in Ottawa:** Ontario minimum wage is $17.20/hr, with tech and student positions averaging $18–$25/hr.`
    },
    {
        keywords: ['ottawa', 'canada', 'living', 'weather', 'city', 'location', 'where', 'address', 'campus'],
        title: 'Campus Location & Life in Ottawa, Ontario',
        content: `### 🏛️ Ottawa Campus & Canadian Capital Life
* **Campus Address:** **81 Montreal Rd, Ottawa, ON K1L 6E8, Canada**.
* **Why Ottawa:** Canada's capital city ranks among the safest, cleanest, and most livable cities in the world. It is a major technology hub (*"Silicon Valley North"* in Kanata) with government institutions, embassies, museums, and multinational corporations.
* **Bilingual Culture:** English and French are widely spoken, offering an enriching cultural immersion.
* **Transit:** High-frequency OC Transpo bus routes and O-Train light rail system connect the campus to downtown Ottawa in under 15 minutes.`
    },
    {
        keywords: ['housing', 'residence', 'accommodation', 'rent', 'living cost', 'living expenses', 'proof of funds', 'financial support', 'ircc funds', 'apartment', 'dorm', 'homestay'],
        title: 'Student Housing, Cost of Living & IRCC Financial Criteria',
        content: `### 🏠 Housing, Living Costs & IRCC Financial Proof
* **IRCC Living Expenses Requirement:** Starting **September 1, 2026**, a single international study permit applicant studying outside Quebec must demonstrate **CAD $23,448** for one year of living expenses (plus first-year tuition and travel costs) in accordance with official [IRCC Financial Guidelines](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html#doc3).
* **On-Campus & Partner Residences:** Furnished student residences from **$600 to $1,100 CAD/month** including high-speed internet and utilities.
* **Off-Campus Apartments:** Shared student apartments in Ottawa range from **$700 to $1,300 CAD/month**.
* **Homestay Options:** Canadian homestay families offer private rooms with meal plans ($900 – $1,200/mo).
* **Monthly Living Budget:** Estimated living expenses (groceries, transport, phone, recreation) average **$800 – $1,200 CAD/month** outside tuition.`
    },
    {
        keywords: ['program', 'programs', 'course', 'courses', 'bachelor', 'master', 'diploma', 'certificate', 'degrees', 'what do you offer', 'school', 'schools', 'faculty', 'faculties'],
        title: 'Academic Programs & 8 Academic Schools',
        content: `### 📚 Cannoga College Academic Schools & Credentials
Cannoga College offers industry-accredited programs across **4 Credential Levels**:
* **1-Year Certificates (30 Credits)** (e.g., Accounting Fundamentals, Cybersecurity Foundations, PSW, Data Analytics)
* **2-Year Ontario College Diplomas (60 Credits)** (e.g., Business Administration, Practical Nursing, Computer Systems Technician, Early Childhood Education)
* **3-Year Advanced Diplomas (90 Credits)** (e.g., AI, Computer Science, Civil Engineering, Architectural Technology, Design)
* **4-Year Bachelor's Degrees (120 Credits)** (e.g., BBA, Applied Computer Science, BScN Nursing, B.Arch, B.Eng, BSW Social Work, Global Finance)

#### 🏛️ Our 8 Academic Schools:
1. **School of Arts, Design and Architecture:** Architecture (B.Arch), Art & Media, Interactive Design, Film & Television Production, Animation.
2. **School of Business:** Accounting & Business Law, Global Finance, Business Administration (BBA), Management Studies, Marketing, Supply Chain & Logistics.
3. **School of Education and Social Sciences:** Early Childhood Education, Child and Youth Care, Social Work (BSW), Community & Justice Services, Developmental Services.
4. **School of Health and Community Services:** Practical Nursing, BScN Nursing, Dental Hygiene, Pharmacy Technician, Personal Support Worker (PSW), Physiotherapist Assistant.
5. **School of Hospitality and Tourism:** Culinary Skills & Culinary Management, Baking and Pastry Arts, Hotel Operations, Hospitality & Tourism Management, Event Planning.
6. **School of Science:** Applied Physics & Mathematics, Chemical & Materials Science, Environmental Science, Systems Analysis, Data Science.
7. **School of Technology:** Applied Computer Science & Software Engineering, Artificial Intelligence, Cybersecurity, Electrical & Automation Engineering, Civil Engineering, Mechanical & Energy Engineering.
8. **School of Transportation and Aviation:** Aviation Management, Flight Services, Aircraft Maintenance Technician, Automotive Service Technician, Transportation Logistics.

*Explore all courses on our [Programs Hub](https://cannogacollege.ca/schools) or view the interactive [Digital Viewbook](https://cannogacollege.ca/viewbook).*`
    },
    {
        keywords: ['apply', 'admission', 'requirements', 'deadline', 'how to apply', 'ielts', 'toefl', 'english', 'intake', 'september', 'january', 'may'],
        title: 'Admissions Requirements & Application Deadlines',
        content: `### 📝 How to Apply & Entry Requirements
* **Intakes:** Fall (September), Winter (January), and Spring/Summer (May).
* **General Requirements:**
  * **Secondary / High School Diploma** (for Diplomas & Bachelor's) or Post-Secondary Credential (for Advanced Diplomas & Postgraduate Certificates).
  * **English Language Proficiency:** IELTS Academic 6.0–6.5 (minimum 5.5 in each band), TOEFL iBT 80+, PTE Academic 58+, or Duolingo 105–115. *(English waivers available for applicants from recognized English-speaking curricula)*.
* **Application Steps:**
  1. Submit your online application via the [Admissions Portal](https://cannogacollege.ca/portal/apply).
  2. Upload your academic transcripts, passport copy, and proof of English proficiency.
  3. Receive your Offer of Admission within 3–7 business days.
  4. Confirm your offer with the **$2,000 CAD tuition deposit** to unlock your PAL & LOA.`
    },
    {
        keywords: ['contact', 'email', 'phone', 'advisor', 'help', 'office', 'reach', 'talk to human', 'support'],
        title: 'Contact Admissions & Support Team',
        content: `### 📞 Contact Cannoga College Admissions
* **Designated Learning Institution (DLI) #:** **O19387496264**
* **Admissions Email:** [admissions@cannogacollege.ca](mailto:admissions@cannogacollege.ca)
* **General Inquiries:** [info@cannogacollege.ca](mailto:info@cannogacollege.ca)
* **Phone / WhatsApp:** **+1 (613) 727-4723**
* **Campus Address:** 81 Montreal Rd, Ottawa, ON K1L 6E8, Canada
* **Admissions Office Hours:** Monday – Friday, 9:00 AM – 5:00 PM (Eastern Time)`
    }
];

export async function POST(req: NextRequest) {
    try {
        const { messages, userQuery } = await req.json();

        const latestQuery = userQuery || (messages && messages.length > 0 ? messages[messages.length - 1].content : '');

        if (!latestQuery || typeof latestQuery !== 'string') {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const normalized = latestQuery.toLowerCase().trim();

        // 1. Live Database Queries (Supabase `faqs`, `School`, `Course`)
        let dbFaqMatch: { question: string; answer: string } | null = null;
        let dbSchools: any[] = STATIC_SCHOOLS;
        let dbCourses: any[] = [];

        try {
            const supabase = getSupabaseClient();
            if (supabase) {
                const [faqsRes, schoolsRes, coursesRes] = await Promise.all([
                    supabase.from('faqs').select('question, answer').eq('status', 'published').limit(60),
                    supabase.from('School').select('name, slug, description').limit(15),
                    supabase.from('Course').select('title, code, credits').limit(30)
                ]);

                if (faqsRes.data && faqsRes.data.length > 0) {
                    let highestFaqScore = 0;
                    const words = normalized.split(/\s+/).filter(w => w.length > 3);

                    for (const faq of faqsRes.data) {
                        const qNorm = faq.question.toLowerCase();
                        let score = 0;
                        if (qNorm === normalized) score += 12;
                        if (qNorm.includes(normalized) || normalized.includes(qNorm)) score += 8;
                        for (const w of words) {
                            if (qNorm.includes(w)) score += 3;
                        }
                        if (score > highestFaqScore && score >= 6) {
                            highestFaqScore = score;
                            dbFaqMatch = faq;
                        }
                    }
                }

                if (schoolsRes.data && schoolsRes.data.length > 0) dbSchools = schoolsRes.data;
                if (coursesRes.data && coursesRes.data.length > 0) dbCourses = coursesRes.data;
            }
        } catch (dbErr) {
            console.error('DB query error:', dbErr);
        }

        // 2. Score match against verified Cannoga website knowledge topics
        let bestTopic: typeof CANNOGA_VERIFIED_KNOWLEDGE[0] | null = null;
        let highestTopicScore = 0;

        for (const topic of CANNOGA_VERIFIED_KNOWLEDGE) {
            let score = 0;
            for (const kw of topic.keywords) {
                if (normalized.includes(kw)) {
                    score += kw.length > 5 ? 3 : 2;
                }
            }
            if (score > highestTopicScore) {
                highestTopicScore = score;
                bestTopic = topic;
            }
        }

        // 3. Compose Answer strictly from Database & Cannoga Website
        let answerText = '';

        if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey') || normalized.match(/^(good morning|good afternoon|good evening)/)) {
            answerText = `👋 **Welcome to Cannoga College in Ottawa, Ontario, Canada.**

I can provide verified information directly from our database and admissions portal:
* 🎓 **Programs & Degrees** (Certificates, Diplomas, Advanced Diplomas & Bachelor's)
* 💰 **Tuition Fees & the $2,000 CAD Confirmation Deposit**
* 🇨🇦 **Provincial Attestation Letter (PAL) & Study Permits**
* 🏠 **Living in Ottawa, Residences & Living Costs**
* 💼 **Working in Canada & Post-Graduation Work Permits (PGWP)**
* 📝 **Application Deadlines & Admission Requirements**

How can I help you today?`;
        } else if (normalized.includes('school') || normalized.includes('facult') || (normalized.includes('program') && dbSchools.length > 0)) {
            let schoolsList = dbSchools.map(s => `* **${s.name}**: ${s.description || 'Comprehensive programs designed for industry careers.'}`).join('\n');
            answerText = `### 📚 Academic Schools & Faculties at Cannoga College\n\n${schoolsList}\n\n*Explore detailed course outlines and admission requirements on our [Programs Hub](https://cannogacollege.ca/schools) or download our [Viewbook](https://cannogacollege.ca/viewbook).*`;
        } else if (dbFaqMatch) {
            // Clean up html tags from DB answer if present
            const cleanAnswer = dbFaqMatch.answer
                .replace(/<div[^>]*>/gi, '')
                .replace(/<\/div>/gi, '')
                .replace(/<p[^>]*>/gi, '')
                .replace(/<\/p>/gi, '\n\n')
                .replace(/<strong[^>]*>/gi, '**')
                .replace(/<\/strong>/gi, '**')
                .replace(/<ul[^>]*>/gi, '')
                .replace(/<\/ul>/gi, '')
                .replace(/<li[^>]*>/gi, '* ')
                .replace(/<\/li>/gi, '\n')
                .trim();

            answerText = `### 📋 ${dbFaqMatch.question}\n\n${cleanAnswer}\n\n*For further details, contact our admissions office at [admissions@cannogacollege.ca](mailto:admissions@cannogacollege.ca).*`;
        } else if (bestTopic && highestTopicScore >= 2) {
            answerText = `${bestTopic.content}\n\n*Would you like more details on admission requirements, tuition payment options, or booking an advisor consultation?*`;
        } else {
            // Fallback comprehensive overview from official Cannoga website
            answerText = `### 🏛️ Cannoga College & Study in Canada
Cannoga College is located at **81 Montreal Rd in Ottawa, Ontario, Canada**.

* **Programs:** Industry-aligned Diplomas, Advanced Diplomas, and Bachelor's programs.
* **Tuition Deposit:** A **$2,000 CAD non-refundable deposit** is required to secure your seat and issue your **Provincial Attestation Letter (PAL)**. It is credited 100% towards your first-term tuition.
* **Work Opportunities:** Work up to **24 hours/week** off-campus during studies and qualify for up to a **3-Year Post-Graduation Work Permit (PGWP)** upon graduation.
* **Admissions Contact:** [admissions@cannogacollege.ca](mailto:admissions@cannogacollege.ca) | Phone: +1 (613) 727-4723.

👉 *Visit our [Admissions Hub](https://cannogacollege.ca/admissions) or access the [Student Portal](https://cannogacollege.ca/portal).*`;
        }

        return NextResponse.json({
            reply: answerText,
            timestamp: new Date().toISOString(),
            topic: bestTopic?.title || dbFaqMatch?.question || 'Cannoga Information'
        });

    } catch (err: any) {
        console.error('Chat API Error:', err);
        return NextResponse.json({
            error: 'Failed to process chat query',
            reply: 'I am temporarily experiencing a connection delay. Please explore our [Admissions Page](https://cannogacollege.ca/admissions) or email [admissions@cannogacollege.ca](mailto:admissions@cannogacollege.ca) for immediate assistance!'
        }, { status: 500 });
    }
}
