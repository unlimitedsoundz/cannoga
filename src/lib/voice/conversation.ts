import type { ConversationEngineConfig, ConversationTurn, ConversationState, ToolDefinition } from './types';
import { getToolByName } from './tools';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export function createConversationEngine(config: ConversationEngineConfig) {
  function buildSystemPrompt(): string {
    let prompt = config.systemPrompt;

    const knowledgeContext = config.knowledgeEntries
      .filter(k => k.active)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8)
      .map(k => `[${k.category}] ${k.title}: ${k.content}`)
      .join('\n');

    if (knowledgeContext) {
      prompt += `\n\nApproved Knowledge Base:\n${knowledgeContext}`;
    }

    const faqContext = config.faqs
      .filter(f => f.active)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5)
      .map(f => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n');

    if (faqContext) {
      prompt += `\n\nFAQ Context:\n${faqContext}`;
    }

    const toolDescriptions = config.tools
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');

    prompt += `\n\nAvailable Tools:\n${toolDescriptions}`;

    return prompt;
  }

  function selectRelevantTools(turn: string): ToolDefinition[] {
    const lowerTurn = turn.toLowerCase();
    const toolKeywords: Record<string, string[]> = {
      get_school_information: ['school', 'college', 'department', 'faculty', 'campus'],
      get_program_information: ['program', 'course', 'degree', 'diploma', 'certificate', 'major', 'study'],
      get_program_requirements: ['requirement', 'prerequisite', 'eligibility', 'qualify'],
      get_admission_requirements: ['admission', 'apply', 'application', 'entry', 'gpa', 'grade'],
      get_application_deadline: ['deadline', 'due date', 'when to apply', 'closing'],
      get_available_intakes: ['intake', 'start date', 'when does it start', 'semester', 'term', 'january', 'september', 'may'],
      get_tuition_information: ['tuition', 'fee', 'cost', 'price', 'payment', 'how much'],
      get_international_student_information: ['international', 'visa', 'study permit', 'from another country', 'foreign'],
      get_pal_information: ['pal', 'attestation', 'provincial', 'letter'],
      get_application_process: ['how to apply', 'application process', 'steps', 'procedure', 'apply'],
      get_housing_information: ['housing', 'residence', 'dorm', 'accommodation', 'live on campus'],
      get_student_services: ['service', 'support', 'help', 'resource', 'advising'],
      search_faq: ['faq', 'frequently asked', 'question', 'common question'],
      get_application_status: ['application status', 'my application', 'check status', 'where is my'],
      get_offer_status: ['offer', 'acceptance', 'admission offer', 'letter of acceptance'],
      get_payment_status: ['payment', 'paid', 'invoice', 'balance', 'tuition payment'],
      create_admissions_support_case: ['support', 'help me', 'case', 'follow up', 'speak to someone'],
      request_callback: ['callback', 'call me back', 'phone me', 'return call'],
      send_application_link: ['send link', 'email me', 'application form', 'apply online'],
      transfer_to_admissions: ['transfer', 'speak to admissions', 'human', 'person', 'representative'],
      end_call: ['goodbye', 'bye', 'thank you', 'end call', 'that is all'],
    };

    const matchedTools: ToolDefinition[] = [];
    for (const [toolName, keywords] of Object.entries(toolKeywords)) {
      if (keywords.some(kw => lowerTurn.includes(kw))) {
        const tool = getToolByName(toolName);
        if (tool) matchedTools.push(tool);
      }
    }

    return matchedTools.length > 0 ? matchedTools : config.tools.slice(0, 3);
  }

  function generateAssistantResponse(
    userTurn: string,
    toolResults: Array<{ success: boolean; data?: unknown; message?: string; error?: string; nextAction?: string }>
  ): string {
    if (toolResults.length === 0) {
      if (userTurn.toLowerCase().includes('hello') || userTurn.toLowerCase().includes('hi') || userTurn.toLowerCase().includes('hey')) {
        return "Hello! I'm Debbie, Cannoga College's virtual admissions assistant. How can I help you today?";
      }
      return "I'd be happy to help with that. Could you tell me a bit more about what you're looking for? I can help with programs, admissions requirements, application deadlines, tuition, housing, and more.";
    }

    const successfulResults = toolResults.filter(r => r.success && r.data);
    const failedResults = toolResults.filter(r => !r.success);

    if (successfulResults.length > 0) {
      const primaryResult = successfulResults[0];

      if (primaryResult.data && Array.isArray(primaryResult.data)) {
        const items = primaryResult.data.slice(0, 3);
        if (items.length === 0) {
          return "I searched our records but couldn't find anything matching that. Would you like me to connect you with an admissions representative who can look into this further?";
        }

        const itemSummaries = items.map((item: Record<string, unknown>) => {
          if (item.title) return `${item.title}`;
          if (item.term) return `${item.term}`;
          if (item.question) return `${item.question}`;
          if (item.name) return `${item.name}`;
          return 'Result';
        }).join(', ');

        let response = `I found ${items.length} result(s): ${itemSummaries}.`;
        if (items.length > 0 && items[0].content) {
          response += ` Here's what I have: ${String(items[0].content).slice(0, 300)}${String(items[0].content).length > 300 ? '...' : ''}`;
        }
        return response;
      }

      if (primaryResult.data && typeof primaryResult.data === 'object') {
        const dataObj = primaryResult.data as Record<string, unknown>;
        if (dataObj.summary) {
          const summary = dataObj.summary as Record<string, unknown>;
          return `Here's a summary: total paid is $${Number(summary.totalPaid || 0).toFixed(2)}, balance is $${Number(summary.balance || 0).toFixed(2)}, with ${Number(summary.paymentCount || 0)} completed payment(s).`;
        }
        if (dataObj.requirements) {
          return `Here are the requirements: ${dataObj.requirements}`;
        }
        if (dataObj.applicationUrl) {
          return `I've sent the application link to ${dataObj.applicationUrl}. Please check your email.`;
        }
        return `I found the information you requested. Is there anything else you'd like to know?`;
      }

      if (primaryResult.message) {
        return primaryResult.message;
      }
    }

    if (failedResults.length > 0 && successfulResults.length === 0) {
      const error = failedResults[0].error || 'unknown error';
      return `I'm having a little trouble accessing that information right now. ${error}. I can connect you with our admissions team or arrange a callback if you'd like.`;
    }

    return "Is there anything else I can help you with?";
  }

  async function processTurn(state: ConversationState, userInput: string): Promise<ConversationTurn> {
    const turnId = `turn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const relevantTools = selectRelevantTools(userInput);
    const toolResults: Array<{ success: boolean; data?: unknown; message?: string; error?: string; nextAction?: string }> = [];

    for (const tool of relevantTools) {
      try {
        const result = await tool.execute({}, {
          callId: state.callId,
          sessionId: state.sessionId,
          adminClient: createServiceRoleClient(),
        });
        toolResults.push(result);

        state.toolEvents.push({
          id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          callId: state.callId,
          toolName: tool.name,
          arguments: {},
          result: result.data || null,
          success: result.success,
          error: result.error || null,
          createdAt: new Date(),
        });

        if (result.nextAction === 'end_call') {
          break;
        }
      } catch (err) {
        toolResults.push({ success: false, error: err instanceof Error ? err.message : 'Tool execution threw an error' });
      }
    }

    const assistantMessage = generateAssistantResponse(userInput, toolResults);

    const turn: ConversationTurn = {
      id: turnId,
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
      toolCalls: state.toolEvents.filter(e => e.createdAt.getTime() > Date.now() - 5000),
    };

    state.turns.push(turn);
    state.lastActivityAt = new Date();

    return turn;
  }

  function createInitialState(callId: string, sessionId: string): ConversationState {
    const now = new Date();
    const greetingTurn: ConversationTurn = {
      id: `turn-${now.getTime()}-greeting`,
      role: 'assistant',
      content: config.greeting,
      timestamp: now,
    };

    return {
      sessionId,
      callId,
      turns: [greetingTurn],
      currentTurnIndex: 0,
      isActive: true,
      interrupted: false,
      context: {},
      startedAt: now,
      lastActivityAt: now,
      toolEvents: [],
    };
  }

  return {
    buildSystemPrompt,
    selectRelevantTools,
    generateAssistantResponse,
    processTurn,
    createInitialState,
  };
}
