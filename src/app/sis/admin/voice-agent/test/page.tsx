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

      const mockCall = {
        id: newCallId,
        agentId: '00000000-0000-0000-0000-000000000001',
        callerPhone: '+1-416-555-0199',
        calledPhone: '+1-416-555-0100',
        direction: 'inbound' as const,
        metadata: { sessionId: newSessionId },
      };

      const session = await provider.startCall(mockCall);
      setCallId(newCallId);
      setSessionId(session.id);
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

    const userMessage: VoiceMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'caller',
      content: text,
      timestamp: new Date(),
      sequence: transcript.length,
    };

    setTranscript(prev => [...prev, userMessage]);

    try {
      const provider = providerRef.current;
      await provider.sendText(sessionId, text);

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
        const results = toolData.data || [];

        const toolEvent: VoiceToolEvent = {
          id: `tool-${Date.now()}`,
          toolName: 'search_faq',
          arguments: { query: text },
          result: results,
          success: true,
          error: null,
          createdAt: new Date(),
        };
        setToolEvents(prev => [...prev, toolEvent]);

        if (results.length > 0 && results[0].answer) {
          const matchedFaq = results[0];
          const assistantMsg = provider.appendAssistantMessage(sessionId, matchedFaq.answer);
          if (assistantMsg) {
            setTranscript(prev => [...prev.filter(m => m.id !== assistantMsg.id), assistantMsg]);
          }
        } else {
          const fallbackText = "I don't want to give you incorrect information. Let me connect you with our admissions team or arrange a callback for detailed program inquiries.";
          const fallbackMsg = provider.appendAssistantMessage(sessionId, fallbackText);
          if (fallbackMsg) {
            setTranscript(prev => [...prev.filter(m => m.id !== fallbackMsg.id), fallbackMsg]);
          }
        }
      }
    } catch (err) {
      setErrors(prev => [...prev, err instanceof Error ? err.message : 'Failed to send message']);
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
          <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Call Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${status === 'active' ? 'bg-emerald-950 text-emerald-300' : status === 'ended' ? 'bg-red-950 text-red-300' : status === 'starting' ? 'bg-amber-950 text-amber-300' : 'bg-neutral-800 text-neutral-300'}`}>
                  <HugeiconsIcon icon={status === 'active' ? CheckCircle : status === 'ended' ? X : Clock} size={12} />
                  {status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Duration</span>
                <span className="text-sm font-mono text-white">{Math.floor(duration / 60)}m {duration % 60}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Messages</span>
                <span className="text-sm font-mono text-white">{transcript.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Tool Calls</span>
                <span className="text-sm font-mono text-white">{toolEvents.length}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {status === 'idle' && (
                  <button
                    onClick={startCall}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <HugeiconsIcon icon={Phone} size={16} strokeWidth={2.5} /> Start Call
                  </button>
                )}
                {(status === 'active' || status === 'starting') && (
                  <button
                    onClick={endCall}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <HugeiconsIcon icon={Stop} size={16} strokeWidth={2.5} /> End Call
                  </button>
                )}
                {status === 'ended' && (
                  <button
                    onClick={() => { setStatus('idle'); setCallId(null); setSessionId(null); setTranscript([]); setToolEvents([]); setDuration(0); setCallSummary(null); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <HugeiconsIcon icon={Phone} size={16} strokeWidth={2.5} /> New Call
                  </button>
                )}
              </div>
            </div>
          </div>

          {callSummary && (
            <div className="bg-emerald-950/60 p-4 rounded-xl text-emerald-300">
              <p className="text-xs font-medium">{callSummary}</p>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-950/60 p-4 rounded-xl space-y-2">
              {errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2">
                  <HugeiconsIcon icon={AlertCircle} size={16} className="text-red-400 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium">{err}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Activity} size={16} strokeWidth={2} /> Live Transcript
              </h3>
              {transcript.length > 0 && (
                <span className="text-xs text-neutral-500">{transcript.length} messages</span>
              )}
            </div>
            <div className="p-4 h-96 overflow-y-auto space-y-3 bg-black/20">
              {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                  <HugeiconsIcon icon={Phone} size={32} className="mb-2" />
                  <p className="text-xs uppercase tracking-wider font-bold">Start a call to see live transcript</p>
                </div>
              ) : (
                transcript.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'caller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl ${msg.role === 'caller' ? 'bg-[#9c27b3] text-white' : msg.role === 'assistant' ? 'bg-neutral-800 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                      <div className="flex justify-between items-center mb-1 gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{msg.role}</span>
                        <span className="text-[10px] opacity-50">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={status === 'active' ? 'Type a message and press Enter...' : 'Start a call first...'}
                  disabled={status !== 'active'}
                  className="flex-1 p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10 disabled:opacity-40"
                />
                <button
                  onClick={sendMessage}
                  disabled={status !== 'active' || !userInput.trim()}
                  className="px-4 py-3 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HugeiconsIcon icon={Send} size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <HugeiconsIcon icon={Shield} size={16} strokeWidth={2} /> Tool Calls
              </h3>
              {toolEvents.length > 0 && (
                <span className="text-xs text-neutral-500">{toolEvents.length} events</span>
              )}
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-2 bg-black/20">
              {toolEvents.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">No tool calls recorded yet</p>
              ) : (
                toolEvents.map((tool) => (
                  <div key={tool.id} className="p-3 bg-neutral-800 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">{tool.toolName}</span>
                      <span className={`text-[10px] font-bold ${tool.success ? 'text-emerald-400' : 'text-red-400'}`}>{tool.success ? 'SUCCESS' : 'FAILED'}</span>
                    </div>
                    {tool.error && <p className="text-xs text-red-400 mt-1">{tool.error}</p>}
                    {tool.result && typeof tool.result === 'object' && (
                      <pre className="text-xs text-neutral-300 mt-2 p-3 bg-neutral-900 rounded-lg overflow-x-auto">{JSON.stringify(tool.result, null, 2)}</pre>
                    )}
                    {typeof tool.result === 'string' && (
                      <p className="text-xs text-neutral-300 mt-1">{tool.result}</p>
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
