export interface VoiceProvider {
  name: string;
  initialize(config: VoiceProviderConfig): Promise<void>;
  startCall(call: VoiceCall): Promise<VoiceSession>;
  endCall(sessionId: string): Promise<void>;
  sendText(sessionId: string, text: string): Promise<void>;
  onEvent(callback: (event: VoiceEvent) => void): void;
  transferCall(sessionId: string, target: VoiceTransfer): Promise<void>;
  destroy(): Promise<void>;
}

export interface VoiceProviderConfig {
  agentId: string;
  greeting: string;
  transferNumber?: string;
  recordingEnabled: boolean;
  language: string;
  systemPrompt: string;
}

export interface VoiceCall {
  id: string;
  agentId: string;
  callerPhone?: string;
  calledPhone?: string;
  direction: 'inbound' | 'outbound';
  metadata?: Record<string, any>;
}

export interface VoiceSession {
  id: string;
  callId: string;
  status: 'pending' | 'ringing' | 'answered' | 'completed' | 'failed' | 'transferred' | 'abandoned';
  startedAt: Date;
  answeredAt?: Date;
  endedAt?: Date;
  transcript: VoiceMessage[];
  toolEvents: VoiceToolEvent[];
  metadata: Record<string, any>;
  lastActivityAt: Date;
}

export interface VoiceMessage {
  id: string;
  role: 'caller' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  sequence: number;
  metadata?: Record<string, any>;
}

export interface VoiceToolEvent {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  result: Record<string, any> | string | null;
  success: boolean;
  error?: string;
  createdAt: Date;
}

export interface VoiceTransfer {
  reason: string;
  department?: string;
  destination: string;
}

export interface VoiceEvent {
  type: 'call.started' | 'call.answered' | 'call.ended' | 'call.transferred' | 'call.failed' | 'call.abandoned' | 'transcript.update' | 'tool.invoked' | 'tool.result' | 'error' | 'recording.update';
  sessionId: string;
  callId: string;
  timestamp: Date;
  data: Record<string, any>;
}

export interface VoiceRecording {
  id: string;
  callId: string;
  url?: string;
  durationSeconds?: number;
  status: 'recording' | 'completed' | 'failed';
  consentGiven: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>, context: ToolContext) => Promise<ToolResult>;
}

export interface ToolContext {
  callId: string;
  sessionId: string;
  callerPhone?: string;
  applicationId?: string;
  studentId?: string;
  adminClient: ReturnType<typeof import('@/utils/supabase/server-admin').createServiceRoleClient>;
}

export interface ToolResult {
  success: boolean;
  data?: Record<string, any> | string | null;
  error?: string;
  message?: string;
  nextAction?: 'end_call' | 'transfer' | 'callback' | 'continue';
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  sourceType: 'manual' | 'cms' | 'database';
  sourceReference?: string;
  active: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationEngineConfig {
  agentId: string;
  systemPrompt: string;
  greeting: string;
  tools: ToolDefinition[];
  knowledgeEntries: KnowledgeEntry[];
  faqs: FAQEntry[];
  maxTurns: number;
  enableBargeIn: boolean;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: VoiceToolEvent[];
  metadata?: Record<string, any>;
}

export interface ConversationState {
  sessionId: string;
  callId: string;
  turns: ConversationTurn[];
  currentTurnIndex: number;
  isActive: boolean;
  interrupted: boolean;
  context: Record<string, any>;
  startedAt: Date;
  lastActivityAt: Date;
  toolEvents: any[];
}

export interface VoiceAgentStats {
  callsToday: number;
  callsThisWeek: number;
  totalCalls: number;
  avgDurationSeconds: number;
  transferRate: number;
  callbackRequests: number;
  unresolvedCalls: number;
}

export interface CreateKnowledgePayload {
  title: string;
  category: string;
  content: string;
  sourceType?: string;
  sourceReference?: string;
  active?: boolean;
  priority?: number;
}

export interface UpdateKnowledgePayload {
  id: string;
  title?: string;
  category?: string;
  content?: string;
  sourceType?: string;
  sourceReference?: string;
  active?: boolean;
  priority?: number;
}

export interface CreateFAQPayload {
  question: string;
  answer: string;
  category: string;
  active?: boolean;
  priority?: number;
}

export interface UpdateFAQPayload {
  id: string;
  question?: string;
  answer?: string;
  category?: string;
  active?: boolean;
  priority?: number;
}
