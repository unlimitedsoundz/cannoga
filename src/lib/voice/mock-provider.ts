import type { VoiceProvider, VoiceProviderConfig, VoiceCall, VoiceSession, VoiceEvent, VoiceTransfer, VoiceMessage, VoiceToolEvent } from './types';

type EventHandler = (event: VoiceEvent) => void;

export class MockVoiceProvider implements VoiceProvider {
  name = 'mock';
  private config: VoiceProviderConfig | null = null;
  private sessions: Map<string, VoiceSession> = new Map();
  private eventHandlers: EventHandler[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();

  async initialize(config: VoiceProviderConfig): Promise<void> {
    this.config = config;
  }

  async startCall(call: VoiceCall): Promise<VoiceSession> {
    const sessionId = `mock-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const session: VoiceSession = {
      id: sessionId,
      callId: call.id,
      status: 'answered',
      startedAt: new Date(),
      answeredAt: new Date(),
      transcript: [],
      toolEvents: [],
      metadata: call.metadata || {},
    };

    this.sessions.set(sessionId, session);

    this.emit({
      type: 'call.answered',
      sessionId,
      callId: call.id,
      timestamp: new Date(),
      data: { direction: call.direction },
    });

    const greetingMessage: VoiceMessage = {
      id: `msg-${Date.now()}-greeting`,
      role: 'assistant',
      content: this.config?.greeting || 'Hello, how can I help you today?',
      timestamp: new Date(),
      sequence: 0,
    };
    session.transcript.push(greetingMessage);

    this.emit({
      type: 'transcript.update',
      sessionId,
      callId: call.id,
      timestamp: new Date(),
      data: { message: greetingMessage },
    });

    return session;
  }

  async endCall(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'completed';
    session.endedAt = new Date();
    session.metadata.durationSeconds = Math.floor((session.endedAt.getTime() - session.startedAt.getTime()) / 1000);

    this.clearTimers(sessionId);

    this.emit({
      type: 'call.ended',
      sessionId,
      callId: session.callId,
      timestamp: new Date(),
      data: { durationSeconds: session.metadata.durationSeconds },
    });

    this.sessions.delete(sessionId);
  }

  async sendText(sessionId: string, text: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const sequence = session.transcript.length;
    const message: VoiceMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'caller',
      content: text,
      timestamp: new Date(),
      sequence,
    };

    session.transcript.push(message);
    session.lastActivityAt = new Date();

    this.emit({
      type: 'transcript.update',
      sessionId,
      callId: session.callId,
      timestamp: new Date(),
      data: { message },
    });
  }

  onEvent(callback: (event: VoiceEvent) => void): void {
    this.eventHandlers.push(callback);
  }

  async transferCall(sessionId: string, target: VoiceTransfer): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'transferred';
    session.metadata.transferred = true;
    session.metadata.transferTarget = target.destination;
    session.endedAt = new Date();
    session.metadata.durationSeconds = Math.floor((session.endedAt.getTime() - session.startedAt.getTime()) / 1000);

    this.clearTimers(sessionId);

    this.emit({
      type: 'call.transferred',
      sessionId,
      callId: session.callId,
      timestamp: new Date(),
      data: { destination: target.destination, reason: target.reason },
    });

    this.sessions.delete(sessionId);
  }

  async destroy(): Promise<void> {
    for (const sessionId of Array.from(this.sessions.keys())) {
      this.clearTimers(sessionId);
      await this.endCall(sessionId);
    }
    this.eventHandlers = [];
  }

  getSession(sessionId: string): VoiceSession | undefined {
    return this.sessions.get(sessionId);
  }

  appendAssistantMessage(sessionId: string, content: string): VoiceMessage | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const message: VoiceMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      sequence: session.transcript.length,
    };

    session.transcript.push(message);
    session.lastActivityAt = new Date();

    this.emit({
      type: 'transcript.update',
      sessionId,
      callId: session.callId,
      timestamp: new Date(),
      data: { message },
    });

    return message;
  }

  appendToolEvent(sessionId: string, toolEvent: Omit<VoiceToolEvent, 'id' | 'createdAt'>): VoiceToolEvent | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const event: VoiceToolEvent = {
      ...toolEvent,
      id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date(),
    };

    session.toolEvents.push(event);

    this.emit({
      type: 'tool.result',
      sessionId,
      callId: session.callId,
      timestamp: new Date(),
      data: { toolEvent: event },
    });

    return event;
  }

  simulateCallerResponse(sessionId: string, responses: string[], delayMs: number = 2000): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const timer = setTimeout(() => {
      if (responses.length > 0) {
        const text = responses[0];
        this.sendText(sessionId, text).then(() => {
          const remaining = responses.slice(1);
          if (remaining.length > 0) {
            this.simulateCallerResponse(sessionId, remaining, delayMs);
          }
        });
      }
    }, delayMs);

    this.timers.set(sessionId, timer);
  }

  private emit(event: VoiceEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (err) {
        console.error('MockVoiceProvider event handler error:', err);
      }
    }
  }

  private clearTimers(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(sessionId);
    }
  }
}

let sharedProvider: MockVoiceProvider | null = null;

export function getMockVoiceProvider(): MockVoiceProvider {
  if (!sharedProvider) {
    sharedProvider = new MockVoiceProvider();
  }
  return sharedProvider;
}
