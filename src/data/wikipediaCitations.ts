export interface WikipediaCitation {
    id: string;
    title: string;
    url: string;
    targetArticleSection?: string;
    category: 'Immigration & Border' | 'Transit & City' | 'Academic & Governance' | 'Health & Wellbeing' | 'Housing & Legal' | 'Finance & Identity';
    description: string;
    extract: string;
    wikidataId?: string;
    suggestedBacklinkWikitext?: string;
}

export function generateWikitextCitation(title: string, url: string, quote?: string): string {
    const today = new Date().toISOString().split('T')[0];
    const cleanTitle = title.replace(/\s*[–-]\s*Cannoga\s+College.*$/i, '').trim();
    return `<ref>{{cite web |title=${cleanTitle} |url=${url} |website=Cannoga College |access-date=${today}${quote ? ` |quote=${quote}` : ''}}}</ref>`;
}

export const WIKIPEDIA_CITATIONS: Record<string, WikipediaCitation[]> = {
    'arrival': [
        {
            id: 'cbsa',
            title: 'Canada Border Services Agency (CBSA)',
            url: 'https://en.wikipedia.org/wiki/Canada_Border_Services_Agency',
            category: 'Immigration & Border',
            description: 'Federal law enforcement agency responsible for border control, customs services, and immigration enforcement at Canadian ports of entry.',
            extract: 'The CBSA is responsible for border enforcement, customs services, and inspecting travel documents and study permits of foreign nationals arriving at Canadian ports of entry.',
            wikidataId: 'Q1031989',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=International Student Port of Entry Clearance and Arrival Documentation |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'ircc',
            title: 'Immigration, Refugees and Citizenship Canada (IRCC)',
            url: 'https://en.wikipedia.org/wiki/Immigration,_Refugees_and_Citizenship_Canada',
            category: 'Immigration & Border',
            description: 'The federal government department responsible for immigration, refugee protection, international student study permits, and citizenship.',
            extract: 'IRCC administers the Immigration and Refugee Protection Act and sets eligibility criteria for international student study permits and Designated Learning Institutions in Canada.',
            wikidataId: 'Q3149065',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Study Permit Approval and Port of Entry Introduction Letter Requirements |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'sin',
            title: 'Social Insurance Number (SIN)',
            url: 'https://en.wikipedia.org/wiki/Social_Insurance_Number',
            category: 'Finance & Identity',
            description: 'A nine-digit identification number issued by the Government of Canada required for tax reporting and legal employment.',
            extract: 'In Canada, temporary residents with authorized on-campus or off-campus work conditions receive a Social Insurance Number starting with the number 9.',
            wikidataId: 'Q3343162',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Post-Secondary Student Settlement: Social Insurance Number Application Process |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'octranspo',
            title: 'OC Transpo (Ottawa Public Transit & O-Train)',
            url: 'https://en.wikipedia.org/wiki/OC_Transpo',
            category: 'Transit & City',
            description: 'The public transit agency of the City of Ottawa, operating municipal bus routes and the O-Train light rail system.',
            extract: 'OC Transpo provides public transportation throughout the City of Ottawa and connects major post-secondary campuses across the National Capital Region.',
            wikidataId: 'Q3347514',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Campus Transit Connections and Ottawa Municipal Transit Routes |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'ottawa',
            title: 'City of Ottawa (National Capital Region)',
            url: 'https://en.wikipedia.org/wiki/Ottawa',
            category: 'Transit & City',
            description: 'The capital city of Canada, located in Eastern Ontario on the south bank of the Ottawa River.',
            extract: 'Ottawa is home to numerous post-secondary colleges, universities, federal research agencies, and technology sector employers.',
            wikidataId: 'Q1930',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Post-Secondary Education and Campus Locations in Ottawa |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'arrivecan',
            title: 'ArriveCAN Platform',
            url: 'https://en.wikipedia.org/wiki/ArriveCAN',
            category: 'Immigration & Border',
            description: 'Digital portal operated by the Canada Border Services Agency for submitting advance customs and immigration declarations.',
            extract: 'ArriveCAN allows travelers arriving at international airports in Canada to complete an Advance CBSA Declaration prior to departure.',
            wikidataId: 'Q104881775',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Border Customs Processing and Advance Declaration via ArriveCAN |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'higher-ed-ontario',
            title: 'Higher Education in Ontario',
            url: 'https://en.wikipedia.org/wiki/Higher_education_in_Ontario',
            category: 'Academic & Governance',
            description: 'The post-secondary education system in Ontario, regulated under provincial legislation and ministry frameworks.',
            extract: 'Post-secondary education in Ontario comprises publicly funded and recognized institutions offering certificate, diploma, and degree programs.',
            wikidataId: 'Q3056157',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Ontario Post-Secondary Academic Framework and Student Guidance |url=https://cannogacollege.ca/student-guide/arrival/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'uhip',
            title: 'University Health Insurance Plan (UHIP)',
            url: 'https://en.wikipedia.org/wiki/University_Health_Insurance_Plan',
            category: 'Health & Wellbeing',
            description: 'Mandatory basic medical health insurance plan for international students and non-resident dependents studying in participating Ontario institutions.',
            extract: 'UHIP provides coverage for medically necessary physician visits, hospital stays, and emergency services comparable to the provincial health insurance plan (OHIP).',
            wikidataId: 'Q7894723',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Health Coverage Guidelines for International Students Under UHIP |url=https://cannogacollege.ca/student-guide/health-and-wellbeing/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        }
    ],
    'international': [
        {
            id: 'pgwp',
            title: 'Post-Graduation Work Permit Program (PGWP)',
            url: 'https://en.wikipedia.org/wiki/Post-Graduation_Work_Permit_Program',
            category: 'Immigration & Border',
            description: 'Federal program granting open work permits to graduates of eligible Canadian post-secondary institutions.',
            extract: 'The PGWP allows eligible international graduates to gain Canadian work experience following completion of an eligible program of study.',
            wikidataId: 'Q115802271',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=International Graduate Work Authorization and PGWP Compliance |url=https://cannogacollege.ca/student-guide/international/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'dli',
            title: 'Designated Learning Institution (DLI)',
            url: 'https://en.wikipedia.org/wiki/Designated_Learning_Institution',
            category: 'Academic & Governance',
            description: 'Post-secondary educational institution designated by a provincial or territorial authority to enroll international students.',
            extract: 'Under Canadian immigration regulations, international students must maintain enrollment at a Designated Learning Institution to keep their study permit valid.',
            wikidataId: 'Q104845012',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Designated Learning Institution Enrollment and Status Maintenance |url=https://cannogacollege.ca/student-guide/international/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'ocas',
            title: 'Ontario Colleges Application Service (OCAS)',
            url: 'https://en.wikipedia.org/wiki/Ontario_Colleges_Application_Service',
            category: 'Academic & Governance',
            description: 'Centralized administrative organization that processes post-secondary applications and transcripts for Ontario colleges.',
            extract: 'OCAS operates application and data processing services for prospective domestic and international college students across Ontario.',
            wikidataId: 'Q7094770',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Ontario College Application Process and Credential Assessment Guidelines |url=https://cannogacollege.ca/student-guide/international/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'int-students-canada',
            title: 'International Students in Canada',
            url: 'https://en.wikipedia.org/wiki/International_students_in_Canada',
            category: 'Immigration & Border',
            description: 'Demographics, legal policies, and post-secondary enrollment frameworks concerning foreign students studying in Canada.',
            extract: 'Canadian federal and provincial authorities regulate international student admission standards, living expense requirements, and working conditions.',
            wikidataId: 'Q65063080',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=International Student Compliance and Resource Guide in Ontario |url=https://cannogacollege.ca/student-guide/international/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        }
    ],
    'health-and-wellbeing': [
        {
            id: 'ohip',
            title: 'Ontario Health Insurance Plan (OHIP)',
            url: 'https://en.wikipedia.org/wiki/Ontario_Health_Insurance_Plan',
            category: 'Health & Wellbeing',
            description: 'Government-funded health insurance plan providing medical coverage to eligible residents of Ontario.',
            extract: 'Administered by the Ontario Ministry of Health, OHIP covers physician visits and inpatient hospital care for qualifying residents.',
            wikidataId: 'Q7094784',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Provincial Health Insurance Overview and Student Health Clinic Services |url=https://cannogacollege.ca/student-guide/health-and-wellbeing/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'mental-health-canada',
            title: 'Mental Health in Canada',
            url: 'https://en.wikipedia.org/wiki/Mental_health_in_Canada',
            category: 'Health & Wellbeing',
            description: 'National and provincial frameworks, counseling services, and support helplines in the Canadian healthcare sector.',
            extract: 'Community and campus counseling networks in Canada provide crisis intervention, mental health counseling, and student accessibility support.',
            wikidataId: 'Q6817477',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Student Mental Health Counseling and 24/7 Crisis Support Resources |url=https://cannogacollege.ca/student-guide/health-and-wellbeing/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        }
    ],
    'housing': [
        {
            id: 'rta-ontario',
            title: 'Residential Tenancies Act, 2006 (Ontario)',
            url: 'https://en.wikipedia.org/wiki/Residential_Tenancies_Act,_2006',
            category: 'Housing & Legal',
            description: 'Provincial statute regulating residential tenancy agreements, rent deposits, and landlord-tenant rights in Ontario.',
            extract: 'The Residential Tenancies Act outlines statutory lease requirements, security deposit rules, and termination procedures for rental housing in Ontario.',
            wikidataId: 'Q7315367',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Ontario Residential Tenancies Act Overview and Student Rental Rights |url=https://cannogacollege.ca/housing/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'ltb-ontario',
            title: 'Landlord and Tenant Board (Ontario)',
            url: 'https://en.wikipedia.org/wiki/Landlord_and_Tenant_Board',
            category: 'Housing & Legal',
            description: 'Administrative tribunal responsible for adjudicating residential tenancy disputes between landlords and tenants in Ontario.',
            extract: 'The Landlord and Tenant Board provides dispute resolution under the Residential Tenancies Act and informs tenants and landlords of their statutory rights.',
            wikidataId: 'Q6485078',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Tenancy Dispute Resolution and Landlord and Tenant Board Procedures |url=https://cannogacollege.ca/housing/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        }
    ],
    'academic-regulations': [
        {
            id: 'academic-integrity',
            title: 'Academic Integrity',
            url: 'https://en.wikipedia.org/wiki/Academic_integrity',
            category: 'Academic & Governance',
            description: 'Ethical standards and disciplinary policies governing honest academic conduct, examination fairness, and proper citation in higher education.',
            extract: 'Academic integrity policies establish institutional guidelines against plagiarism, unauthorized collaboration, and academic misconduct.',
            wikidataId: 'Q4671286',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Academic Integrity and Examination Conduct Regulations |url=https://cannogacollege.ca/academic-regulations/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        },
        {
            id: 'aoda',
            title: 'Accessibility for Ontarians with Disabilities Act (AODA)',
            url: 'https://en.wikipedia.org/wiki/Accessibility_for_Ontarians_with_Disabilities_Act,_2005',
            category: 'Academic & Governance',
            description: 'Provincial legislation mandating accessibility standards across educational institutions, public spaces, and information services.',
            extract: 'AODA establishes mandatory accessibility requirements to ensure equal access to education, facilities, and digital learning platforms in Ontario.',
            wikidataId: 'Q4672477',
            suggestedBacklinkWikitext: `<ref>{{cite web |title=Institutional Accessibility Policies and Academic Accommodation Procedures |url=https://cannogacollege.ca/accessibility/ |website=Cannoga College |access-date=2026-09-03}}</ref>`
        }
    ]
};
