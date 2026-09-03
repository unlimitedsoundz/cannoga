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
    return `<ref>{{cite web |url=${url} |title=${title} |publisher=Cannoga College |work=Cannoga Academic & Student Portal |access-date=${today}${quote ? ` |quote=${quote}` : ''}}}</ref>`;
}

export const WIKIPEDIA_CITATIONS: Record<string, WikipediaCitation[]> = {
    'arrival': [
        {
            id: 'cbsa',
            title: 'Canada Border Services Agency (CBSA)',
            url: 'https://en.wikipedia.org/wiki/Canada_Border_Services_Agency',
            category: 'Immigration & Border',
            description: 'Federal law enforcement agency responsible for border control, customs services, and immigration enforcement at Canadian ports of entry.',
            extract: 'The CBSA facilitates the entry of legitimate travellers and verifies study permits, visas, and port-of-entry introduction letters for international students arriving in Canada.',
            wikidataId: 'Q1031989'
        },
        {
            id: 'ircc',
            title: 'Immigration, Refugees and Citizenship Canada (IRCC)',
            url: 'https://en.wikipedia.org/wiki/Immigration,_Refugees_and_Citizenship_Canada',
            category: 'Immigration & Border',
            description: 'The department of the Government of Canada responsible for immigration, international student study permits, and citizenship.',
            extract: 'IRCC oversees the legal criteria for international study permits, Designated Learning Institution (DLI) compliance, off-campus work eligibility, and post-graduation pathways.',
            wikidataId: 'Q3149065'
        },
        {
            id: 'sin',
            title: 'Social Insurance Number (SIN)',
            url: 'https://en.wikipedia.org/wiki/Social_Insurance_Number',
            category: 'Finance & Identity',
            description: 'A nine-digit number required to work in Canada or to access government programs and benefits.',
            extract: 'International students with valid work authorization on their study permit obtain a SIN starting with the digit "9" from Service Canada upon arrival.',
            wikidataId: 'Q3343162'
        },
        {
            id: 'octranspo',
            title: 'OC Transpo (Ottawa Public Transit & O-Train)',
            url: 'https://en.wikipedia.org/wiki/OC_Transpo',
            category: 'Transit & City',
            description: 'The urban transit service of the City of Ottawa, operating light rail (O-Train) and extensive bus networks connecting college campuses.',
            extract: 'Provides comprehensive multimodal transportation across the National Capital Region, offering student transit passes and campus transit connections.',
            wikidataId: 'Q3347514'
        },
        {
            id: 'ottawa',
            title: 'City of Ottawa (National Capital Region)',
            url: 'https://en.wikipedia.org/wiki/Ottawa',
            category: 'Transit & City',
            description: 'The capital city of Canada located in Ontario, known for top technology hubs, cultural institutions, and bilingual academic environment.',
            extract: 'Ottawa is a premier destination for post-secondary education, offering rich student life, international embassies, national research laboratories, and diverse tech sector employment.',
            wikidataId: 'Q1930'
        },
        {
            id: 'arrivecan',
            title: 'ArriveCAN Platform',
            url: 'https://en.wikipedia.org/wiki/ArriveCAN',
            category: 'Immigration & Border',
            description: 'Digital platform operated by the CBSA for travelers to submit customs and immigration declarations in advance of port-of-entry arrival.',
            extract: 'Allows arriving international students to complete the Advance CBSA Declaration up to 72 hours before flying into major Canadian international airports.',
            wikidataId: 'Q104881775'
        },
        {
            id: 'higher-ed-ontario',
            title: 'Higher Education in Ontario',
            url: 'https://en.wikipedia.org/wiki/Higher_education_in_Ontario',
            category: 'Academic & Governance',
            description: 'The post-secondary education framework governed by the Ontario Ministry of Colleges and Universities.',
            extract: 'Encompasses publicly assisted colleges and universities providing quality-assured diplomas, applied degrees, certificate programs, and co-operative work education in Ontario.',
            wikidataId: 'Q3056157'
        },
        {
            id: 'uhip',
            title: 'University Health Insurance Plan (UHIP)',
            url: 'https://en.wikipedia.org/wiki/University_Health_Insurance_Plan',
            category: 'Health & Wellbeing',
            description: 'Comprehensive mandatory health care insurance plan designed for international students studying in Ontario participating institutions.',
            extract: 'Covers essential medical services including physician visits, emergency hospital care, diagnostic tests, and surgery comparable to the provincial OHIP coverage.',
            wikidataId: 'Q7894723'
        }
    ],
    'international': [
        {
            id: 'pgwp',
            title: 'Post-Graduation Work Permit Program (PGWP)',
            url: 'https://en.wikipedia.org/wiki/Post-Graduation_Work_Permit_Program',
            category: 'Immigration & Border',
            description: 'Open work permit program allowing international students graduating from eligible Canadian institutions to gain Canadian work experience.',
            extract: 'Enables qualifying graduates to work full-time in Canada for up to three years, creating eligible pathways towards Canadian permanent residency.',
            wikidataId: 'Q115802271'
        },
        {
            id: 'dli',
            title: 'Designated Learning Institution (DLI)',
            url: 'https://en.wikipedia.org/wiki/Designated_Learning_Institution',
            category: 'Academic & Governance',
            description: 'A school approved by a provincial or territorial government to host international students in Canada.',
            extract: 'Only institutions designated by provincial ministries are authorized to enroll international students holding Canadian study permits.',
            wikidataId: 'Q104845012'
        },
        {
            id: 'ocas',
            title: 'Ontario Colleges Application Service (OCAS)',
            url: 'https://en.wikipedia.org/wiki/Ontario_Colleges_Application_Service',
            category: 'Academic & Governance',
            description: 'Centralized application service and data exchange for prospective students applying to Ontario post-secondary colleges.',
            extract: 'Processes college admissions applications, international credential assessments, and transcript distributions for the Ontario college network.',
            wikidataId: 'Q7094770'
        },
        {
            id: 'int-students-canada',
            title: 'International Students in Canada',
            url: 'https://en.wikipedia.org/wiki/International_students_in_Canada',
            category: 'Immigration & Border',
            description: 'Overview of international student population, regulations, economic contributions, and academic programs across Canadian provinces.',
            extract: 'Canada is among the world\'s leading international education destinations, welcoming students across thousands of academic and applied career programs.',
            wikidataId: 'Q65063080'
        }
    ],
    'health-and-wellbeing': [
        {
            id: 'ohip',
            title: 'Ontario Health Insurance Plan (OHIP)',
            url: 'https://en.wikipedia.org/wiki/Ontario_Health_Insurance_Plan',
            category: 'Health & Wellbeing',
            description: 'Government-funded health care plan providing medical coverage for residents of Ontario.',
            extract: 'Administered by the Ontario Ministry of Health, covering medically necessary physician visits and hospital emergency care for eligible residents.',
            wikidataId: 'Q7094784'
        },
        {
            id: 'mental-health-canada',
            title: 'Mental Health in Canada',
            url: 'https://en.wikipedia.org/wiki/Mental_health_in_Canada',
            category: 'Health & Wellbeing',
            description: 'Healthcare initiatives, support systems, and community mental health resources across Canadian post-secondary education.',
            extract: 'Highlights comprehensive student wellness strategies, 24/7 crisis support lines (e.g. 9-8-8 Suicide Crisis Helpline), and campus accessibility accommodations.',
            wikidataId: 'Q6817477'
        }
    ],
    'housing': [
        {
            id: 'rta-ontario',
            title: 'Residential Tenancies Act (Ontario)',
            url: 'https://en.wikipedia.org/wiki/Residential_Tenancies_Act,_2006',
            category: 'Housing & Legal',
            description: 'Ontario provincial legislation governing residential tenancy agreements, student tenant rights, rent deposits, and landlord obligations.',
            extract: 'Sets legal standards for Ontario rental housing, including standard leases, rent increase limits, maintenance requirements, and dispute resolution.',
            wikidataId: 'Q7315367'
        },
        {
            id: 'ltb-ontario',
            title: 'Landlord and Tenant Board (Ontario)',
            url: 'https://en.wikipedia.org/wiki/Landlord_and_Tenant_Board',
            category: 'Housing & Legal',
            description: 'Adjudicative tribunal that resolves disputes between residential landlords and tenants under the Residential Tenancies Act.',
            extract: 'Provides impartial dispute resolution and legal information regarding residential rights for student renters and property owners across Ontario.',
            wikidataId: 'Q6485078'
        }
    ],
    'academic-regulations': [
        {
            id: 'academic-integrity',
            title: 'Academic Integrity',
            url: 'https://en.wikipedia.org/wiki/Academic_integrity',
            category: 'Academic & Governance',
            description: 'The moral code and ethical policy of academia, encompassing honesty, trust, fairness, respect, and responsibility.',
            extract: 'Underpins institutional standards regarding plagiarism avoidance, honest scholarship, accurate citations, and ethical conduct in examinations.',
            wikidataId: 'Q4671286'
        },
        {
            id: 'aoda',
            title: 'Accessibility for Ontarians with Disabilities Act (AODA)',
            url: 'https://en.wikipedia.org/wiki/Accessibility_for_Ontarians_with_Disabilities_Act,_2005',
            category: 'Academic & Governance',
            description: 'Ontario statute establishing mandatory accessibility standards for educational institutions, public spaces, and digital services.',
            extract: 'Mandates equal access, assistive accommodations, and accessible learning environments for all enrolled students with disabilities.',
            wikidataId: 'Q4672477'
        }
    ]
};
