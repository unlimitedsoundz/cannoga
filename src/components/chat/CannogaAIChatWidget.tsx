'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
    ChatCircleDots,
    PaperPlaneRight,
    X,
    Minus,
    ArrowsOutSimple,
    ArrowsInSimple,
    Microphone,
    SpeakerHigh,
    ArrowCounterClockwise
} from '@phosphor-icons/react';

interface Message {
    id: string;
    role: 'assistant' | 'user';
    text: string;
    timestamp: string;
}

const INITIAL_SUGGESTIONS = [
    { label: 'Tuition & $2,000 Deposit', query: 'What is the tuition deposit amount and fee schedule?' },
    { label: 'Programs & Faculties', query: 'What programs and degrees do you offer?' },
    { label: 'Study Permit & PAL', query: 'How does the Provincial Attestation Letter (PAL) work?' },
    { label: 'Working & PGWP in Canada', query: 'Can I work while studying and get a Post-Graduation Work Permit (PGWP)?' },
    { label: 'Ottawa Living & Housing', query: 'What is student housing and living in Ottawa like?' },
    { label: 'How to Apply & Deadlines', query: 'What are the admission requirements and deadlines?' }
];

export function CannogaAIChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'msg-welcome',
            role: 'assistant',
            text: `Welcome to Cannoga College in Ottawa, Ontario, Canada.\n\nAsk me anything about our academic programs, admissions, tuition fees, the **$2,000 CAD confirmation deposit**, Provincial Attestation Letters (PAL), living in Ottawa, or working in Canada.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto popup when user enters home page ('/')
    useEffect(() => {
        if (pathname === '/') {
            const hasPopped = sessionStorage.getItem('cannoga_ai_chat_popped');
            if (!hasPopped) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    setHasUnread(true);
                    sessionStorage.setItem('cannoga_ai_chat_popped', 'true');
                }, 2500);
                return () => clearTimeout(timer);
            }
        }
    }, [pathname]);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || inputValue).trim();
        if (!query || isTyping) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.text })),
                    userQuery: query
                })
            });

            const data = await res.json();
            const replyText = data.reply || 'I am happy to assist you! Please feel free to ask more or contact admissions@cannogacollege.ca.';

            const assistantMsg: Message = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [
                ...prev,
                {
                    id: `ai-err-${Date.now()}`,
                    role: 'assistant',
                    text: 'I had a brief connection glitch. Please check your connection or contact our admissions office at **admissions@cannogacollege.ca**.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // Voice recognition helper (Web Speech API)
    const handleVoiceListen = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input is not supported in this browser. Please type your message.');
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-CA';
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInputValue(transcript);
                    handleSendMessage(transcript);
                }
                setIsListening(false);
            };

            recognition.start();
        } catch (e) {
            console.error('Speech recognition error:', e);
            setIsListening(false);
        }
    };

    // Text to Speech
    const handleSpeak = (text: string) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_`\[\]()]/g, ' ').replace(/https?:\/\/\S+/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: 'msg-welcome-new',
                role: 'assistant',
                text: `Conversation cleared. How can I help you today regarding Cannoga College or studying in Canada?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    // Formatter for markdown-like text (bold, links, lists)
    const formatMessageText = (content: string) => {
        const lines = content.split('\n');
        return lines.map((line, idx) => {
            if (line.startsWith('### ')) {
                return (
                    <h4 key={idx} className="font-bold text-slate-900 text-base mt-2 mb-1">
                        {line.replace('### ', '')}
                    </h4>
                );
            }
            if (line.startsWith('* ') || line.startsWith('- ')) {
                const itemText = line.replace(/^[\*\-]\s+/, '');
                return (
                    <div key={idx} className="flex items-start gap-2 my-1 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: parseInline(itemText) }} />
                    </div>
                );
            }
            if (line.startsWith('|')) {
                // simple table indicator row
                return (
                    <div key={idx} className="text-xs font-mono my-0.5 text-slate-600 overflow-x-auto whitespace-nowrap">
                        {line}
                    </div>
                );
            }
            if (!line.trim()) {
                return <div key={idx} className="h-2" />;
            }
            return (
                <p key={idx} className="my-1 leading-relaxed text-slate-800" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
            );
        });
    };

    const parseInline = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-slate-900 underline font-bold hover:text-black transition-colors">$1</a>');
    };

    return (
        <div className={`fixed font-sans antialiased ${
            isOpen
                ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999]'
                : 'bottom-20 right-4 sm:bottom-24 sm:right-6 z-[99990]'
        }`}>
            {/* 1. Closed Floating Widget Button */}
            {!isOpen && (
                <div className="relative group">
                    <button
                        onClick={() => {
                            setIsOpen(true);
                            setHasUnread(false);
                        }}
                        aria-label="Open Ask Cannoga"
                        className="relative flex items-center gap-2 bg-[#0a151a] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700/60 hover:border-slate-500 transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#0a151a] shadow-sm">
                            <ChatCircleDots size={16} weight="bold" />
                        </div>
                        <div className="text-left">
                            <div className="text-xs sm:text-sm font-bold text-white tracking-wide">Ask Cannoga</div>
                        </div>

                        {/* Unread indicator */}
                        {hasUnread && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0a151a]" />
                        )}
                    </button>
                </div>
            )}

            {/* 2. Open Chat Window */}
            {isOpen && (
                <div
                    className={`flex flex-col bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded
                            ? 'fixed inset-4 md:inset-10 w-auto h-auto z-[99999]'
                            : 'w-[90vw] sm:w-[350px] h-[520px] max-h-[80vh]'
                    }`}
                >
                    {/* Header */}
                    <div className="bg-[#0a151a] text-white px-4 py-3.5 flex items-center justify-between shadow-md border-b border-slate-800 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#0a151a]">
                                <ChatCircleDots size={18} weight="bold" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-white tracking-tight">Ask Cannoga</h3>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 text-slate-300">
                            <button
                                onClick={handleClearChat}
                                title="Reset conversation"
                                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ArrowCounterClockwise size={16} />
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                title={isExpanded ? 'Collapse' : 'Expand'}
                                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                            >
                                {isExpanded ? <ArrowsInSimple size={16} /> : <ArrowsOutSimple size={16} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Minimize chat"
                                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close"
                                className="p-1.5 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-sm">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`relative max-w-[88%] rounded-2xl px-4 py-3 shadow-xs ${
                                        msg.role === 'user'
                                            ? 'bg-[#0a151a] text-white rounded-br-none'
                                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div>
                                            <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100 text-[10px] text-slate-400 font-semibold">
                                                <span className="text-slate-700 font-bold">
                                                    Cannoga Advisor
                                                </span>
                                                <button
                                                    onClick={() => handleSpeak(msg.text)}
                                                    className="hover:text-slate-700 flex items-center gap-1 text-slate-400"
                                                    title="Read out loud"
                                                >
                                                    <SpeakerHigh size={13} />
                                                </button>
                                            </div>
                                            {formatMessageText(msg.text)}
                                        </div>
                                    ) : (
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xs w-fit">
                                <span className="text-xs text-slate-500 font-medium">Cannoga is typing...</span>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        {INITIAL_SUGGESTIONS.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(item.query)}
                                disabled={isTyping}
                                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 hover:text-black border border-slate-200 transition-all shrink-0"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                    >
                        <button
                            type="button"
                            onClick={handleVoiceListen}
                            className={`p-2 rounded-xl border transition-all ${
                                isListening
                                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                            title={isListening ? 'Listening...' : 'Voice search'}
                        >
                            <Microphone size={18} weight={isListening ? 'fill' : 'regular'} />
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40 focus:border-slate-900 transition-all"
                        />

                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="p-2.5 bg-[#0a151a] hover:bg-black disabled:opacity-40 text-white rounded-xl shadow-xs transition-all flex items-center justify-center shrink-0"
                            title="Send message"
                        >
                            <PaperPlaneRight size={16} weight="bold" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
