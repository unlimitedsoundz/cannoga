import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { ToolDefinition, ToolContext, ToolResult } from './types';

function createAdminClient() {
  return createServiceRoleClient();
}

export const voiceTools: ToolDefinition[] = [
  {
    name: 'get_school_information',
    description: 'Retrieve information about Cannoga College schools and departments.',
    parameters: {
      type: 'object',
      properties: {
        school_id: { type: 'string', description: 'Optional school ID to filter results.' },
        query: { type: 'string', description: 'Optional keyword search across school names and descriptions.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createAdminClient();
      try {
        let query = adminClient
          .from('School')
          .select('id, name, slug, description, created_at')
          .order('name', { ascending: true });

        if (args.school_id) {
          query = query.eq('id', args.school_id);
        }

        const { data: schools, error } = await query;

        if (error) throw error;

        let results = schools || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (s: any) =>
              s.name.toLowerCase().includes(lowerQuery) ||
              (s.description && s.description.toLowerCase().includes(lowerQuery))
          );
        }

        const departments = await adminClient
          .from('Department')
          .select('id, name, slug, school_id, description')
          .order('name', { ascending: true });

        const deptBySchool = new Map<string, any[]>();
        for (const dept of departments.data || []) {
          const list = deptBySchool.get(dept.school_id) || [];
          list.push(dept);
          deptBySchool.set(dept.school_id, list);
        }

        const enriched = results.map((s: any) => ({
          ...s,
          departments: deptBySchool.get(s.id) || [],
        }));

        return {
          success: true,
          data: enriched,
          message: enriched.length > 0 ? `Found ${enriched.length} school(s).` : 'No schools found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch school information.' };
      }
    },
  },
  {
    name: 'get_program_information',
    description: 'Retrieve academic program information from the Course table.',
    parameters: {
      type: 'object',
      properties: {
        program_id: { type: 'string', description: 'Optional program/course ID.' },
        school_id: { type: 'string', description: 'Optional school ID to filter programs.' },
        credential_type: { type: 'string', description: 'Optional credential type (e.g., Bachelor, Master, Diploma, Certificate).' },
        query: { type: 'string', description: 'Optional keyword search across program titles and descriptions.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createAdminClient();
      try {
        let query = adminClient
          .from('Course')
          .select(`
            id, title, slug, degreeLevel, duration, credits, description, status, created_at,
            school:School(name, slug),
            departmentId:Department(name, slug)
          `)
          .order('title', { ascending: true });

        if (args.program_id) {
          query = query.eq('id', args.program_id);
        }

        if (args.credential_type) {
          query = query.eq('degreeLevel', args.credential_type);
        }

        const { data: programs, error } = await query;

        if (error) throw error;

        let results = (programs || []).map((p: any) => ({
          ...p,
          school: Array.isArray(p.school) ? p.school[0] : p.school,
          department: Array.isArray(p.departmentId) ? p.departmentId[0] : p.departmentId,
        }));

        if (args.school_id) {
          results = results.filter((p: any) => p.school?.id === args.school_id);
        }

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (p: any) =>
              p.title.toLowerCase().includes(lowerQuery) ||
              (p.description && p.description.toLowerCase().includes(lowerQuery))
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} program(s).` : 'No programs found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch program information.' };
      }
    },
  },
  {
    name: 'get_program_requirements',
    description: 'Retrieve admission requirements for a specific program.',
    parameters: {
      type: 'object',
      properties: {
        program_id: { type: 'string', description: 'Program/Course ID.' },
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: ['program_id'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createAdminClient();
      try {
        const { data: program, error } = await adminClient
          .from('Course')
          .select('id, title, degreeLevel, description, prerequisites, admission_requirements, created_at')
          .eq('id', args.program_id)
          .single();

        if (error || !program) {
          return { success: false, error: 'Program not found.' };
        }

        let requirements = program.admission_requirements || program.description || 'Standard admission requirements apply. Please contact admissions for detailed requirements.';
        let prerequisites = program.prerequisites || 'No specific prerequisites listed.';

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          if (!requirements.toLowerCase().includes(lowerQuery) && !prerequisites.toLowerCase().includes(lowerQuery)) {
            return {
              success: true,
              data: { program: program.title, requirements, prerequisites },
              message: `Requirements for ${program.title} retrieved, but no direct match for "${args.query}".`,
            };
          }
        }

        return {
          success: true,
          data: { program: program.title, requirements, prerequisites },
          message: `Requirements for ${program.title} retrieved.`,
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch program requirements.' };
      }
    },
  },
  {
    name: 'get_admission_requirements',
    description: 'Retrieve general admission requirements for Cannoga College.',
    parameters: {
      type: 'object',
      properties: {
        credential_type: { type: 'string', description: 'Optional credential type filter.' },
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createAdminClient();
      try {
        let query = adminClient
          .from('Course')
          .select('id, title, degreeLevel, admission_requirements, prerequisites')
          .not('admission_requirements', 'is', null);

        if (args.credential_type) {
          query = query.eq('degreeLevel', args.credential_type);
        }

        const { data: programs, error } = await query;

        if (error) throw error;

        let results = (programs || []).filter((p: any) => p.admission_requirements);

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (p: any) =>
              (p.admission_requirements && p.admission_requirements.toLowerCase().includes(lowerQuery)) ||
              (p.prerequisites && p.prerequisites.toLowerCase().includes(lowerQuery)) ||
              p.title.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found admission requirements for ${results.length} program(s).` : 'No admission requirements found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch admission requirements.' };
      }
    },
  },
  {
    name: 'get_application_deadline',
    description: 'Retrieve application deadlines and intake information.',
    parameters: {
      type: 'object',
      properties: {
        program_id: { type: 'string', description: 'Optional program ID.' },
        intake: { type: 'string', description: 'Optional intake term (e.g., Fall 2026, Winter 2027).' },
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createAdminClient();
      try {
        let query = adminClient
          .from('semesters')
          .select('id, name, start_date, end_date, registration_deadline, is_active, created_at')
          .eq('is_active', true)
          .order('start_date', { ascending: true });

        const { data: semesters, error } = await query;

        if (error) throw error;

        let results = semesters || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (s: any) =>
              s.name.toLowerCase().includes(lowerQuery) ||
              (s.registration_deadline && s.registration_deadline.includes(lowerQuery))
          );
        }

        const deadlines = results.map((s: any) => ({
          id: s.id,
          term: s.name,
          startDate: s.start_date,
          endDate: s.end_date,
          registrationDeadline: s.registration_deadline,
          isActive: s.is_active,
        }));

        return {
          success: true,
          data: deadlines,
          message: deadlines.length > 0 ? `Found ${deadlines.length} active intake(s).` : 'No active intakes found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch application deadlines.' };
      }
    },
  },
  {
    name: 'get_available_intakes',
    description: 'Retrieve available intakes and their dates.',
    parameters: {
      type: 'object',
      properties: {
        year: { type: 'string', description: 'Optional year filter.' },
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();

      try {
        let query = adminClient
          .from('semesters')
          .select('id, name, start_date, end_date, registration_deadline, is_active')
          .eq('is_active', true)
          .order('start_date', { ascending: true });

        const { data: semesters, error } = await query;

        if (error) throw error;

        let results = (semesters || []).map((s: any) => ({
          id: s.id,
          term: s.name,
          startDate: s.start_date,
          endDate: s.end_date,
          registrationDeadline: s.registration_deadline,
          isActive: s.is_active,
        }));

        if (args.year) {
          results = results.filter((r: any) => r.startDate?.startsWith(args.year));
        }

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter((r: any) => r.term.toLowerCase().includes(lowerQuery));
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} available intake(s).` : 'No available intakes found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch available intakes.' };
      }
    },
  },
  {
    name: 'get_tuition_information',
    description: 'Retrieve tuition information from the tuition_info table.',
    parameters: {
      type: 'object',
      properties: {
        credential_type: { type: 'string', description: 'Optional credential type filter.' },
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        let query = adminClient
          .from('tuition_info')
          .select('id, credential_type, domestic_tuition, international_tuition, application_fee, additional_fees, effective_from, effective_to, status')
          .eq('status', 'active')
          .order('effective_from', { ascending: false });

        if (args.credential_type) {
          query = query.eq('credential_type', args.credential_type);
        }

        const { data: tuition, error } = await query;

        if (error) throw error;

        let results = tuition || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (t: any) =>
              t.credential_type.toLowerCase().includes(lowerQuery) ||
              (t.domestic_tuition && JSON.stringify(t.domestic_tuition).toLowerCase().includes(lowerQuery)) ||
              (t.international_tuition && JSON.stringify(t.international_tuition).toLowerCase().includes(lowerQuery))
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found tuition info for ${results.length} credential type(s).` : 'No tuition information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch tuition information.' };
      }
    },
  },
  {
    name: 'get_international_student_information',
    description: 'Retrieve information relevant to international students.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: intl, error } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true)
          .eq('category', 'international_students')
          .order('priority', { ascending: false });

        if (error) throw error;

        let results = intl || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (r: any) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} international student resource(s).` : 'No international student information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch international student information.' };
      }
    },
  },
  {
    name: 'get_pal_information',
    description: 'Retrieve information about the Provincial Attestation Letter (PAL) process for international students.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: pal, error } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true)
          .eq('category', 'PAL')
          .order('priority', { ascending: false });

        if (error) throw error;

        let results = pal || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (r: any) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} PAL resource(s).` : 'No PAL information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch PAL information.' };
      }
    },
  },
  {
    name: 'get_application_process',
    description: 'Retrieve the step-by-step application process information.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: process, error } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true)
          .eq('category', 'application_process')
          .order('priority', { ascending: false });

        if (error) throw error;

        let results = process || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (r: any) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} process step(s).` : 'No application process information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch application process.' };
      }
    },
  },
  {
    name: 'get_housing_information',
    description: 'Retrieve housing and residence information.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: housing, error } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true)
          .eq('category', 'housing')
          .order('priority', { ascending: false });

        if (error) throw error;

        let results = housing || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (r: any) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} housing resource(s).` : 'No housing information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch housing information.' };
      }
    },
  },
  {
    name: 'get_student_services',
    description: 'Retrieve student services information.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional keyword search.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: services, error } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true)
          .eq('category', 'student_services')
          .order('priority', { ascending: false });

        if (error) throw error;

        let results = services || [];

        if (args.query && args.query.trim()) {
          const lowerQuery = args.query.toLowerCase();
          results = results.filter(
            (r: any) =>
              r.title.toLowerCase().includes(lowerQuery) ||
              r.content.toLowerCase().includes(lowerQuery)
          );
        }

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} student service(s).` : 'No student services information found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch student services.' };
      }
    },
  },
  {
    name: 'search_faq',
    description: 'Search the FAQ knowledge base for answers.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query.' },
        category: { type: 'string', description: 'Optional FAQ category filter.' },
      },
      required: ['query'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const queryText = (args.query || '').trim().toLowerCase();

        // 1. Handle common greetings and conversational openers
        if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(queryText)) {
          return {
            success: true,
            data: [
              {
                id: 'greeting-faq',
                question: 'Greeting',
                answer: "Hello! I'm Debbie, the virtual admissions assistant at Cannoga College. How can I assist you with programs, admissions, tuition, or application status today?",
                priority: 100,
              },
            ],
            message: 'Greeting acknowledged.',
          };
        }

        // 2. Query primary FAQs table
        let query = adminClient
          .from('voice_agent_faqs')
          .select('*')
          .eq('active', true);

        if (args.category) {
          query = query.eq('category', args.category);
        }

        const { data: faqs } = await query;

        let results = (faqs || []).filter((f: any) => {
          const q = f.question.toLowerCase();
          const a = f.answer.toLowerCase();
          return (
            q.includes(queryText) ||
            a.includes(queryText) ||
            queryText.split(' ').some((word: string) => word.length > 3 && (q.includes(word) || a.includes(word)))
          );
        });

        if (results.length > 0) {
          results.sort((a: any, b: any) => b.priority - a.priority);
          return {
            success: true,
            data: results.slice(0, 3),
            message: `Found ${results.length} FAQ match(es).`,
          };
        }

        // 3. Fallback: Search knowledge base entries
        const { data: knowledge } = await adminClient
          .from('voice_agent_knowledge')
          .select('*')
          .eq('active', true);

        if (knowledge && knowledge.length > 0) {
          const kMatches = knowledge.filter((k: any) => {
            const title = (k.title || '').toLowerCase();
            const content = (k.content || '').toLowerCase();
            return (
              title.includes(queryText) ||
              content.includes(queryText) ||
              queryText.split(' ').some((word: string) => word.length > 3 && (title.includes(word) || content.includes(word)))
            );
          });

          if (kMatches.length > 0) {
            return {
              success: true,
              data: kMatches.map((k: any) => ({
                id: k.id,
                question: k.title,
                answer: k.content,
                priority: k.priority || 50,
              })),
              message: `Found ${kMatches.length} knowledge base match(es).`,
            };
          }
        }

        // 4. Fallback: Search Courses/Programs if query is academic
        const { data: courses } = await adminClient
          .from('Course')
          .select('id, title, degreeLevel, description')
          .limit(5);

        if (courses && courses.length > 0) {
          const courseMatches = courses.filter((c: any) => {
            const title = (c.title || '').toLowerCase();
            const desc = (c.description || '').toLowerCase();
            return title.includes(queryText) || desc.includes(queryText);
          });

          if (courseMatches.length > 0) {
            const courseList = courseMatches.map((c: any) => `${c.title} (${c.degreeLevel || 'Program'})`).join(', ');
            return {
              success: true,
              data: [
                {
                  id: 'course-match',
                  question: 'Programs Offered',
                  answer: `We offer relevant programs matching your inquiry, including: ${courseList}. Would you like specific details on admission requirements or tuition?`,
                  priority: 80,
                },
              ],
              message: 'Program matches retrieved.',
            };
          }
        }

        // 5. Intelligent default helpful response
        return {
          success: true,
          data: [
            {
              id: 'general-info',
              question: 'General Admissions Assistance',
              answer: "Thank you for asking! Cannoga College offers bachelor's degrees, master's degrees, and diplomas in computer science, business, health sciences, and engineering. You can submit your application online or ask me about specific program requirements, tuition fees, or intake deadlines.",
              priority: 10,
            },
          ],
          message: 'General admissions guidance returned.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to search FAQs.' };
      }
    },
  },
  {
    name: 'get_application_status',
    description: 'Retrieve the status of a specific application by ID or application number.',
    parameters: {
      type: 'object',
      properties: {
        application_id: { type: 'string', description: 'Application UUID.' },
        application_number: { type: 'string', description: 'Application number (e.g., APP-2026-001).' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        let query = adminClient
          .from('applications')
          .select(`
            id, application_number, status, submitted_at, course_id, user_id,
            course:Course(title, degreeLevel),
            user:profiles(first_name, last_name, email),
            offer:admission_offers(id, status, tuition_fee, payment_deadline, document_url)
          `)
          .neq('status', 'DRAFT');

        if (args.application_id) {
          query = query.eq('id', args.application_id);
        }

        if (args.application_number) {
          query = query.eq('application_number', args.application_number);
        }

        const { data: applications, error } = await query;

        if (error) throw error;

        const results = (applications || []).map((a: any) => ({
          ...a,
          course: Array.isArray(a.course) ? a.course[0] : a.course,
          user: Array.isArray(a.user) ? a.user[0] : a.user,
          offer: Array.isArray(a.offer) ? a.offer[0] : a.offer,
        }));

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} application(s).` : 'No applications found.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch application status.' };
      }
    },
  },
  {
    name: 'get_offer_status',
    description: 'Retrieve admission offer details for an application.',
    parameters: {
      type: 'object',
      properties: {
        application_id: { type: 'string', description: 'Application UUID.' },
        offer_id: { type: 'string', description: 'Optional offer UUID.' },
      },
      required: ['application_id'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        let query = adminClient
          .from('admission_offers')
          .select(`
            id, application_id, tuition_fee, currency, payment_deadline, document_url, status, invoice_pushed, invoice_sent_at, invoice_type, created_at,
            application:applications(application_number, status, user:profiles(first_name, last_name))
          `)
          .eq('application_id', args.application_id);

        if (args.offer_id) {
          query = query.eq('id', args.offer_id);
        }

        const { data: offers, error } = await query;

        if (error) throw error;

        const results = (offers || []).map((o: any) => ({
          ...o,
          application: Array.isArray(o.application) ? o.application[0] : o.application,
        }));

        return {
          success: true,
          data: results,
          message: results.length > 0 ? `Found ${results.length} offer(s).` : 'No offers found for this application.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch offer status.' };
      }
    },
  },
  {
    name: 'get_payment_status',
    description: 'Retrieve payment status for an application or student.',
    parameters: {
      type: 'object',
      properties: {
        application_id: { type: 'string', description: 'Application UUID.' },
        student_id: { type: 'string', description: 'Student ID.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        let payments: any[] = [];
        let invoices: any[] = [];

        if (args.application_id) {
          const { data: apps, error: appError } = await adminClient
            .from('applications')
            .select('id, application_number, status, user_id, course_id')
            .eq('id', args.application_id)
            .single();

          if (appError || !apps) {
            return { success: false, error: 'Application not found.' };
          }

          const { data: offer } = await adminClient
            .from('admission_offers')
            .select('id, tuition_fee, payment_deadline, status')
            .eq('application_id', args.application_id)
            .maybeSingle();

          if (offer?.id) {
            const { data: paymentData } = await adminClient
              .from('tuition_payments')
              .select('*')
              .eq('offer_id', offer.id)
              .order('created_at', { ascending: false });

            payments = paymentData || [];
          }

          const { data: studentData } = await adminClient
            .from('students')
            .select('id, student_id, tuition_deposit_paid, tuition_deposit_paid_at, full_tuition_paid, full_tuition_paid_at')
            .eq('application_id', args.application_id)
            .maybeSingle();

          const { data: invoiceData } = await adminClient
            .from('invoices')
            .select('*')
            .eq('student_id', studentData?.id || '')
            .order('issued_date', { ascending: false });

          invoices = invoiceData || [];
        } else if (args.student_id) {
          const { data: paymentData } = await adminClient
            .from('tuition_payments')
            .select('*')
            .eq('student_id', args.student_id)
            .order('created_at', { ascending: false });

          payments = paymentData || [];

          const { data: invoiceData } = await adminClient
            .from('invoices')
            .select('*')
            .eq('student_id', args.student_id)
            .order('issued_date', { ascending: false });

          invoices = invoiceData || [];
        } else {
          return { success: false, error: 'application_id or student_id is required.' };
        }

        const totalPaid = payments
          .filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

        const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + Number(inv.amount || 0), 0);
        const balance = invoices.reduce((sum: number, inv: any) => sum + Number(inv.balance || 0), 0);

        return {
          success: true,
          data: {
            payments,
            invoices,
            summary: {
              totalPaid,
              totalInvoiced,
              balance,
              paymentCount: payments.filter((p: any) => p.status === 'COMPLETED' || p.status === 'verified').length,
              pendingPayments: payments.filter((p: any) => p.status === 'PENDING_VERIFICATION' || p.status === 'PENDING').length,
            },
          },
          message: `Payment status retrieved. Total paid: $${totalPaid.toFixed(2)}, balance: $${balance.toFixed(2)}.`,
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to fetch payment status.' };
      }
    },
  },
  {
    name: 'create_admissions_support_case',
    description: 'Create a support case for the admissions team to follow up.',
    parameters: {
      type: 'object',
      properties: {
        caller_name: { type: 'string', description: 'Caller full name.' },
        phone: { type: 'string', description: 'Caller phone number.' },
        email: { type: 'string', description: 'Caller email address.' },
        reason: { type: 'string', description: 'Reason for the support case.' },
        preferred_time: { type: 'string', description: 'Preferred callback time.' },
        notes: { type: 'string', description: 'Additional notes.' },
      },
      required: ['phone', 'reason'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data, error } = await adminClient
          .from('voice_agent_callbacks')
          .insert({
            call_id: context.callId || null,
            caller_name: args.caller_name || null,
            phone: args.phone,
            email: args.email || null,
            preferred_time: args.preferred_time || null,
            timezone: 'America/Toronto',
            reason: args.reason,
            status: 'pending',
            assigned_to: null,
            notes: args.notes || null,
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          data: { callbackId: data.id, status: 'pending' },
          message: 'Support case created. An admissions representative will follow up.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to create support case.' };
      }
    },
  },
  {
    name: 'request_callback',
    description: 'Request a callback from the admissions team.',
    parameters: {
      type: 'object',
      properties: {
        caller_name: { type: 'string', description: 'Caller full name.' },
        phone: { type: 'string', description: 'Caller phone number.' },
        email: { type: 'string', description: 'Caller email address.' },
        preferred_time: { type: 'string', description: 'Preferred callback time.' },
        reason: { type: 'string', description: 'Reason for callback.' },
      },
      required: ['phone'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data, error } = await adminClient
          .from('voice_agent_callbacks')
          .insert({
            call_id: context.callId || null,
            caller_name: args.caller_name || null,
            phone: args.phone,
            email: args.email || null,
            preferred_time: args.preferred_time || null,
            timezone: 'America/Toronto',
            reason: args.reason || 'Callback requested',
            status: 'pending',
            assigned_to: null,
            notes: null,
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          data: { callbackId: data.id, status: 'pending' },
          message: 'Callback request received. We will call you back as soon as possible.',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to request callback.' };
      }
    },
  },
  {
    name: 'send_application_link',
    description: 'Send an application link to the caller.',
    parameters: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email address to send the link to.' },
        program_id: { type: 'string', description: 'Optional program ID to tailor the link.' },
      },
      required: ['email'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cannogacollege.ca';
        let applicationUrl = `${baseUrl}/portal/apply`;

        if (args.program_id) {
          const { data: program } = await adminClient
            .from('Course')
            .select('slug')
            .eq('id', args.program_id)
            .single();

          if (program?.slug) {
            applicationUrl = `${baseUrl}/portal/apply?program=${program.slug}`;
          }
        }

        const { data: sent, error } = await adminClient
          .from('voice_agent_callbacks')
          .insert({
            call_id: context.callId || null,
            caller_name: null,
            phone: null,
            email: args.email,
            preferred_time: null,
            timezone: 'America/Toronto',
            reason: 'Application link sent',
            status: 'completed',
            assigned_to: null,
            notes: JSON.stringify({ applicationUrl, program_id: args.program_id || null }),
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          data: { applicationUrl, callbackId: sent?.id },
          message: `Application link sent to ${args.email}.`,
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send application link.' };
      }
    },
  },
  {
    name: 'transfer_to_admissions',
    description: 'Transfer the call to the admissions department.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Reason for transfer.' },
        department: { type: 'string', description: 'Target department (default: admissions).' },
      },
      required: ['reason'],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      const adminClient = createServiceRoleClient();
      try {
        const { data: agent } = await adminClient
          .from('voice_agents')
          .select('transfer_number')
          .eq('slug', 'debbie')
          .single();

        const destination = agent?.transfer_number || '+1-416-555-0100';

        const { data: transfer, error } = await adminClient
          .from('voice_agent_transfers')
          .insert({
            call_id: context.callId,
            reason: args.reason,
            department: args.department || 'admissions',
            destination,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          data: { transferId: transfer.id, destination },
          message: `Transferring to ${args.department || 'admissions'} at ${destination}.`,
          nextAction: 'transfer',
        };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to initiate transfer.' };
      }
    },
  },
  {
    name: 'end_call',
    description: 'End the current call gracefully.',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Optional call summary.' },
      },
      required: [],
    },
    async execute(args: Record<string, any>, context: ToolContext): Promise<ToolResult> {
      return {
        success: true,
        data: null,
        message: args.summary || 'Thank you for calling. Have a great day.',
        nextAction: 'end_call',
      };
    },
  },
];

export function getToolByName(name: string): ToolDefinition | undefined {
  return voiceTools.find(t => t.name === name);
}

export function getAllTools(): ToolDefinition[] {
  return voiceTools;
}
