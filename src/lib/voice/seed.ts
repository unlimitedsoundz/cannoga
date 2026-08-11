import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { getActiveKnowledgeEntries, createKnowledgeEntry } from './knowledge';
import { getActiveFAQs, createFAQ } from './knowledge';

export async function seedVoiceKnowledgeFromDatabase(): Promise<{ success: boolean; created: number; errors: string[] }> {
  const adminClient = createServiceRoleClient();
  const errors: string[] = [];
  let created = 0;

  try {
    const { data: schools } = await adminClient
      .from('School')
      .select('id, name, description, slug');

    for (const school of schools || []) {
      const existing = await getActiveKnowledgeEntries();
      const alreadyExists = existing.some(k => k.sourceReference === `school-${school.id}`);

      if (!alreadyExists) {
        const result = await createKnowledgeEntry({
          title: school.name,
          category: 'schools',
          content: school.description || `${school.name} is one of the schools at Cannoga College.`,
          sourceType: 'database',
          sourceReference: `school-${school.id}`,
          active: true,
          priority: 5,
        });

        if (result) created++;
      }
    }

    const { data: departments } = await adminClient
      .from('Department')
      .select('id, name, description, school_id');

    for (const dept of departments || []) {
      const existing = await getActiveKnowledgeEntries();
      const alreadyExists = existing.some(k => k.sourceReference === `department-${dept.id}`);

      if (!alreadyExists) {
        const result = await createKnowledgeEntry({
          title: dept.name,
          category: 'schools',
          content: dept.description || `${dept.name} is a department at Cannoga College.`,
          sourceType: 'database',
          sourceReference: `department-${dept.id}`,
          active: true,
          priority: 3,
        });

        if (result) created++;
      }
    }

    const { data: programs } = await adminClient
      .from('Course')
      .select('id, title, degreeLevel, duration, credits, description, admission_requirements, prerequisites');

    for (const program of programs || []) {
      const existing = await getActiveKnowledgeEntries();
      const alreadyExists = existing.some(k => k.sourceReference === `program-${program.id}`);

      if (!alreadyExists && program.title) {
        let content = program.description || `${program.title} is offered at Cannoga College.`;
        if (program.admission_requirements) {
          content += ` Admission requirements: ${program.admission_requirements}`;
        }
        if (program.prerequisites) {
          content += ` Prerequisites: ${program.prerequisites}`;
        }
        content += ` Duration: ${program.duration || 'Not specified'} years. Credits: ${program.credits || 'Not specified'}. Credential: ${program.degreeLevel || 'Not specified'}.`;

        const result = await createKnowledgeEntry({
          title: program.title,
          category: 'programs',
          content,
          sourceType: 'database',
          sourceReference: `program-${program.id}`,
          active: true,
          priority: 10,
        });

        if (result) created++;
      }
    }

    const { data: tuitionInfo } = await adminClient
      .from('tuition_info')
      .select('id, credential_type, domestic_tuition, international_tuition, application_fee, additional_fees, effective_from, effective_to')
      .eq('status', 'active');

    for (const tuition of tuitionInfo || []) {
      const existing = await getActiveKnowledgeEntries();
      const alreadyExists = existing.some(k => k.sourceReference === `tuition-${tuition.id}`);

      if (!alreadyExists) {
        const domestic = tuition.domestic_tuition || {};
        const international = tuition.international_tuition || {};
        const domesticAmount = domestic.annual || domestic.total || Object.values(domestic)[0];
        const internationalAmount = international.annual || international.total || Object.values(international)[0];
        const appFee = tuition.application_fee || 'Not specified';

        let content = `${tuition.credential_type} tuition information. `;
        if (domesticAmount) content += `Domestic tuition: $${Number(domesticAmount).toLocaleString()} per year. `;
        if (internationalAmount) content += `International tuition: $${Number(internationalAmount).toLocaleString()} per year. `;
        content += `Application fee: $${appFee}. `;
        if (tuition.additional_fees && Object.keys(tuition.additional_fees).length > 0) {
          content += `Additional fees may apply. Please contact admissions for details. `;
        }
        content += `Effective from ${tuition.effective_from}${tuition.effective_to ? ` to ${tuition.effective_to}` : ''}.`;

        const result = await createKnowledgeEntry({
          title: `${tuition.credential_type} Tuition`,
          category: 'tuition',
          content,
          sourceType: 'database',
          sourceReference: `tuition-${tuition.id}`,
          active: true,
          priority: 8,
        });

        if (result) created++;
      }
    }

    const { data: semesters } = await adminClient
      .from('semesters')
      .select('id, name, start_date, end_date, registration_deadline, is_active');

    for (const semester of semesters || []) {
      if (!semester.is_active) continue;

      const existing = await getActiveKnowledgeEntries();
      const alreadyExists = existing.some(k => k.sourceReference === `intake-${semester.id}`);

      if (!alreadyExists) {
        const content = `${semester.name} intake at Cannoga College. Start date: ${semester.start_date}. End date: ${semester.end_date}. Registration deadline: ${semester.registration_deadline || 'Contact admissions'}.`;

        const result = await createKnowledgeEntry({
          title: `${semester.name} Intake`,
          category: 'intakes',
          content,
          sourceType: 'database',
          sourceReference: `intake-${semester.id}`,
          active: true,
          priority: 7,
        });

        if (result) created++;
      }
    }

    const { data: applications } = await adminClient
      .from('applications')
      .select('id, application_number, status, course_id, submitted_at, course:Course(title, degreeLevel), user:profiles(first_name, last_name, email)')
      .order('submitted_at', { ascending: false })
      .limit(100);

    const statusCounts = new Map<string, number>();
    for (const app of applications || []) {
      const count = statusCounts.get(app.status) || 0;
      statusCounts.set(app.status, count + 1);
    }

    const faqEntries: { question: string; answer: string; category: string }[] = [
      {
        question: 'What programs does Cannoga College offer?',
        answer: `Cannoga College offers a wide range of programs including Bachelor's degrees, Master's degrees, Diplomas, and Certificates across multiple schools. You can ask about specific programs like "Computer Science", "Business Administration", or "Nursing" for more details.`,
        category: 'programs',
      },
      {
        question: 'How do I apply to Cannoga College?',
        answer: 'To apply, visit our application portal at cannogacollege.ca/portal/apply. You will need to create an account, select your program, submit your academic transcripts, and pay the application fee. International students may also need to provide proof of English proficiency and a study permit.',
        category: 'application_process',
      },
      {
        question: 'What are the admission requirements?',
        answer: 'Admission requirements vary by program. Generally, you need a high school diploma or equivalent, minimum GPA requirements, and English proficiency (IELTS 6.0 or equivalent). Some programs have additional prerequisites. Please ask about a specific program for detailed requirements.',
        category: 'admissions',
      },
      {
        question: 'What is the tuition fee?',
        answer: 'Tuition fees vary by program and student type (domestic vs international). Please ask about a specific program or credential type for current tuition information. Application fees also apply.',
        category: 'tuition',
      },
      {
        question: 'When are the application deadlines?',
        answer: 'Application deadlines vary by intake. Cannoga College typically has intakes in Fall (September), Winter (January), and Spring/Summer (May). Please ask about a specific intake for the latest deadlines.',
        category: 'deadlines',
      },
      {
        question: 'Do you offer housing for students?',
        answer: 'Yes, Cannoga College offers on-campus residence options for students. Housing availability and fees vary. Please ask about housing for more details on residence options, room types, and application processes.',
        category: 'housing',
      },
      {
        question: 'What is a PAL?',
        answer: 'A Provincial Attestation Letter (PAL) is a document required by some international students applying to designated learning institutions in Canada. It verifies that your spot is reserved. Please ask about PAL requirements for your specific situation.',
        category: 'PAL',
      },
      {
        question: 'What student services are available?',
        answer: 'Cannoga College offers various student services including academic advising, career services, counseling, international student support, accessibility services, and more. Please ask about a specific service for details.',
        category: 'student_services',
      },
      {
        question: 'How can I check my application status?',
        answer: 'You can check your application status by logging into your applicant portal at cannogacollege.ca/portal/dashboard. If you need assistance, I can help look up your application if you provide your application number.',
        category: 'applications',
      },
      {
        question: 'Is there financial aid available?',
        answer: 'Yes, financial aid, scholarships, and bursaries are available for eligible students. Please contact the financial aid office or ask about specific scholarships for more information.',
        category: 'tuition',
      },
    ];

    const existingFAQs = await getActiveFAQs();
    for (const faq of faqEntries) {
      const alreadyExists = existingFAQs.some(f => f.question.toLowerCase() === faq.question.toLowerCase());
      if (!alreadyExists) {
        const result = await createFAQ(faq);
        if (result) created++;
      }
    }

    return { success: true, created, errors };
  } catch (err: any) {
    console.error('seedVoiceKnowledgeFromDatabase error:', err);
    return { success: false, created, errors: [err.message] };
  }
}
