'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SmartPhone01Icon as Phone,
  Stop as Stop,
  MailSend01Icon as Send,
  ActivityIcon as Activity,
  Shield01Icon as Shield,
  Alert01Icon as AlertCircle,
  CheckCircle as CheckCircle,
  ClockIcon as Clock,
  X as X,
} from '@hugeicons/core-free-icons';
import { getMockVoiceProvider } from '@/lib/voice/mock-provider';
import type { VoiceEvent, VoiceMessage, VoiceToolEvent } from '@/lib/voice/types';

export default function VoiceAgentTestPage() {
  const [callId, setCallId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'active' | 'ended'>('idle');
  const [transcript, setTranscript] = useState<VoiceMessage[]>([]);
  const [toolEvents, setToolEvents] = useState<VoiceToolEvent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [callSummary, setCallSummary] = useState<string | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef(getMockVoiceProvider());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [transcript, scrollToBottom]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const startCall = async () => {
    setStatus('starting');
    setErrors([]);
    setToolEvents([]);
    setTranscript([]);
    setDuration(0);
    setCallSummary(null);

    try {
      const provider = providerRef.current;

      const greetingRes = await fetch('/api/voice/incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: 'inbound',
          callerPhone: '+1-416-555-0199',
          calledPhone: '+1-416-555-0100',
        }),
      });

      if (!greetingRes.ok) {
        throw new Error(`Failed to initiate call: ${greetingRes.statusText}`);
      }

      const greetingData = await greetingRes.json();
      const newCallId = greetingData.callId;
      const newSessionId = greetingData.sessionId || `session-${Date.now()}`;

      setCallId(newCallId);
      setSessionId(newSessionId);

      const mockCall = {
        id: newCallId,
        agentId: '00000000-0000-0000-0000-000000000001',
        callerPhone: '+1-416-555-0199',
        calledPhone: '+1-416-555-0100',
        direction: 'inbound' as const,
      };

      await provider.startCall(mockCall);
      setStatus('active');

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

      if (greetingData.greeting) {
        setTranscript([{
          id: `msg-${Date.now()}-greeting`,
          role: 'assistant',
          content: greetingData.greeting,
          timestamp: new Date(),
          sequence: 0,
        }]);
      }
    } catch (err) {
      setStatus('idle');
      setErrors([err instanceof Error ? err.message : 'Failed to start call']);
    }
  };

  const endCall = async () => {
    if (!callId || !sessionId) return;

    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await providerRef.current.endCall(sessionId);

      await fetch('/api/voice/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId,
          event: 'completed',
          sessionId,
        }),
      });

      setStatus('ended');
      setCallSummary(`Call ended. Duration: ${Math.floor(duration / 60)}m ${duration % 60}s. Messages: ${transcript.length}.`);
    } catch (err) {
      setErrors([...errors, err instanceof Error ? err.message : 'Failed to end call']);
      setStatus('ended');
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !callId || !sessionId || status !== 'active') return;

    const text = userInput.trim();
    setUserInput('');

    try {
      const provider = providerRef.current;
      await provider.sendText(sessionId, text);

      const callRes = await fetch(`/api/voice/incoming?callId=${callId}`, { cache: 'no-store' });
      if (callRes.ok) {
        const data = await callRes.json();
        if (data.toolEvents && data.toolEvents.length > 0) {
          const newToolEvents = data.toolEvents.filter((te: { id: string }) => !toolEvents.some(te2 => te2.id === te.id));
          if (newToolEvents.length > 0) {
            setToolEvents(prev => [...prev, ...newToolEvents.map((te: { id: string; created_at: string; [key: string]: unknown }) => ({
              ...te,
              createdAt: new Date(te.created_at),
            }))]);
          }
        }
      }

      const toolRes = await fetch('/api/voice/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: callId,
          session_id: sessionId,
          tool_name: 'search_faq',
          arguments: { query: text },
        }),
      });

      if (toolRes.ok) {
        const toolData = await toolRes.json();
        if (toolData.data && toolData.data.length > 0) {
          const matchedFaq = toolData.data[0];
          const assistantMsg = provider.appendAssistantMessage(sessionId, matchedFaq.answer);
          if (assistantMsg) {
            setTranscript(prev => [...prev, assistantMsg]);
          }
        } else {
          const fallbackMsg = provider.appendAssistantMessage(sessionId, "I don't want to give you incorrect information. Let me connect you with our admissions team or arrange a callback.");
          if (fallbackMsg) {
            setTranscript(prev => [...prev, fallbackMsg]);
          }
        }
      }
    } catch (err) {
      setErrors([...errors, err instanceof Error ? err.message : 'Failed to send message']);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const provider = providerRef.current;
    const handler = (event: VoiceEvent) => {
      if (event.type === 'transcript.update') {
        const message = event.data.message as VoiceMessage;
        if (message) {
          setTranscript(prev => {
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, message];
          });
        }
      } else if (event.type === 'tool.result') {
        const toolEvent = event.data.toolEvent as VoiceToolEvent;
        if (toolEvent) {
          setToolEvents(prev => {
            if (prev.some(t => t.id === toolEvent.id)) return prev;
            return [...prev, toolEvent];
          });
        }
      } else if (event.type === 'error') {
        setErrors(prev => [...prev, event.data.message || 'Unknown error']);
      }
    };

    provider.onEvent(handler);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test Voice Agent"
        subtitle="Browser-based voice testing UI for Debbie"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Call Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${status === 'active' ? 'bg-green-100 text-green-700' : status === 'ended' ? 'bg-red-100 text-red-700' : status === 'starting' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>
                  <HugeiconsIcon icon={status === 'active' ? CheckCircle : status === 'ended' ? X : Clock} size={12} />
                  {status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Duration</span>
                <span className="text-sm font-mono text-neutral-900">{Math.floor(duration / 60)}m {duration % 60}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Messages</span>
                <span className="text-sm font-mono text-neutral-900">{transcript.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Tool Calls</span>
                <span className="text-sm font-mono text-neutral-900">{toolEvents.length}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {status === 'idle' && (
                  <button
                    onClick={startCall}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
                  >
                    <HugeiconsIcon icon={Phone} size={16} strokeWidth={2.5} /> Start Call
                  </button>
                )}
                {(status === 'active' || status === 'starting') && (
                  <button
                    onClick={endCall}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-700 transition-colors"
                  >
                    <HugeiconsIcon icon={Stop} size={16} strokeWidth={2.5} /> End Call
                  </button>
                )}
                {status === 'ended' && (
                  <button
                    onClick={() => { setStatus('idle'); setCallId(null); setSessionId(null); setTranscript([]); setToolEvents([]); setDuration(0); setCallSummary(null); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
                  >
                    <HugeiconsIcon icon={Phone} size={16} strokeWidth={2.5} /> New Call
                  </button>
                )}
              </div>
            </div>
          </div>

          {callSummary && (
            <div className="bg-green-50 border border-green-100 p-4">
              <p className="text-xs font-medium text-green-700">{callSummary}</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-100 p-4 space-y-2">
              {errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2">
                  <HugeiconsIcon icon={AlertCircle} size={16} className="text-red-500 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{err}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-neutral-200">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Activity} size={16} strokeWidth={2} /> Live Transcript
              </h3>
              {transcript.length > 0 && (
                <span className="text-xs text-neutral-400">{transcript.length} messages</span>
              )}
            </div>
            <div className="p-4 h-96 overflow-y-auto space-y-3 bg-neutral-50">
              {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                  <HugeiconsIcon icon={Phone} size={32} className="mb-2" />
                  <p className="text-sm">Start a call to see the live transcript</p>
                </div>
              ) : (
                transcript.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'caller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 ${msg.role === 'caller' ? 'bg-blue-100 text-blue-900' : msg.role === 'assistant' ? 'bg-white border border-neutral-200 text-neutral-900' : 'bg-neutral-200 text-neutral-700'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{msg.role}</span>
                        <span className="text-xs opacity-50">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={status === 'active' ? 'Type a message and press Enter...' : 'Start a call first...'}
                  disabled={status !== 'active'}
                  className="flex-1 p-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={status !== 'active' || !userInput.trim()}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HugeiconsIcon icon={Send} size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Shield} size={16} strokeWidth={2} /> Tool Calls
              </h3>
              {toolEvents.length > 0 && (
                <span className="text-xs text-neutral-400">{toolEvents.length} events</span>
              )}
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-2 bg-neutral-50">
              {toolEvents.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">No tool calls yet</p>
              ) : (
                toolEvents.map((tool) => (
                  <div key={tool.id} className="p-3 bg-white border border-neutral-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">{tool.toolName}</span>
                      <span className={`text-xs font-bold ${tool.success ? 'text-emerald-600' : 'text-red-600'}`}>{tool.success ? 'SUCCESS' : 'FAILED'}</span>
                    </div>
                    {tool.error && <p className="text-xs text-red-600 mt-1">{tool.error}</p>}
                    {tool.result && typeof tool.result === 'object' && (
                      <pre className="text-xs text-neutral-600 mt-2 p-2 bg-neutral-50 overflow-x-auto">{JSON.stringify(tool.result, null, 2)}</pre>
                    )}
                    {typeof tool.result === 'string' && (
                      <p className="text-xs text-neutral-600 mt-1">{tool.result}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
