-- Voice Agent: Debbie for Cannoga College International Admissions
-- Migration: 20260811100000_create_voice_agent_tables.sql

-- ============================
-- voice_agents
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agents (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Debbie',
    slug TEXT NOT NULL DEFAULT 'debbie' UNIQUE,
    role TEXT NOT NULL DEFAULT 'International Admissions Voice Assistant',
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    voice_provider TEXT NOT NULL DEFAULT 'mock',
    voice_id TEXT,
    system_prompt TEXT NOT NULL DEFAULT 'You are Debbie, Cannoga College International Admissions Assistant.',
    greeting TEXT NOT NULL DEFAULT 'Hi, you''ve reached Cannoga College Admissions. I''m Debbie. How can I help you today?',
    language TEXT NOT NULL DEFAULT 'en-US',
    timezone TEXT NOT NULL DEFAULT 'America/Toronto',
    business_hours JSONB DEFAULT '{"monday":{"open":"09:00","close":"17:00"},"tuesday":{"open":"09:00","close":"17:00"},"wednesday":{"open":"09:00","close":"17:00"},"thursday":{"open":"09:00","close":"17:00"},"friday":{"open":"09:00","close":"17:00"},"saturday":{"open":"10:00","close":"14:00"},"sunday":null}'::jsonb,
    transfer_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    transfer_number TEXT,
    fallback_text TEXT NOT NULL DEFAULT 'I''m having a little trouble accessing that information right now. I can connect you with admissions or arrange a callback.',
    max_call_duration_seconds INTEGER NOT NULL DEFAULT 1800,
    recording_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    recording_consent_text TEXT DEFAULT 'This call may be recorded for quality and training purposes.',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- voice_agent_settings
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agent_settings (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL REFERENCES public.voice_agents(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(agent_id, setting_key)
);

-- ============================
-- voice_calls
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_calls (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL REFERENCES public.voice_agents(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'mock',
    provider_call_id TEXT,
    caller_phone TEXT,
    called_phone TEXT,
    direction TEXT NOT NULL DEFAULT 'inbound',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, ringing, answered, completed, failed, transferred, abandoned
    started_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP(3),
    ended_at TIMESTAMP(3),
    duration_seconds INTEGER,
    transferred BOOLEAN NOT NULL DEFAULT FALSE,
    transfer_target TEXT,
    intent TEXT,
    summary TEXT,
    student_id TEXT REFERENCES public.students(id) ON DELETE SET NULL,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_calls_provider_call_id ON public.voice_calls(provider_call_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_caller_phone ON public.voice_calls(caller_phone);
CREATE INDEX IF NOT EXISTS idx_voice_calls_student_id ON public.voice_calls(student_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_application_id ON public.voice_calls(application_id);
CREATE INDEX IF NOT EXISTS idx_voice_calls_created_at ON public.voice_calls(created_at);
CREATE INDEX IF NOT EXISTS idx_voice_calls_status ON public.voice_calls(status);

-- ============================
-- voice_call_messages
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_call_messages (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT NOT NULL REFERENCES public.voice_calls(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- caller, assistant, system, tool
    message TEXT NOT NULL,
    timestamp TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sequence INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_voice_call_messages_call_id ON public.voice_call_messages(call_id);

-- ============================
-- voice_call_tool_events
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_call_tool_events (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT NOT NULL REFERENCES public.voice_calls(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    arguments JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_call_tool_events_call_id ON public.voice_call_tool_events(call_id);

-- ============================
-- voice_call_summaries
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_call_summaries (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT NOT NULL REFERENCES public.voice_calls(id) ON DELETE CASCADE UNIQUE,
    summary TEXT NOT NULL,
    intent TEXT,
    topics JSONB DEFAULT '[]'::jsonb,
    next_action TEXT,
    follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
    follow_up_date TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- voice_agent_knowledge
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agent_knowledge (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- admissions, programs, schools, tuition, deadlines, intakes, international_students, application_process, requirements, PAL, housing, student_services, general, faqs
    content TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'manual', -- manual, cms, database
    source_reference TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_agent_knowledge_category ON public.voice_agent_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_voice_agent_knowledge_active ON public.voice_agent_knowledge(active);

-- ============================
-- voice_agent_faqs
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agent_faqs (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_agent_faqs_category ON public.voice_agent_faqs(category);
CREATE INDEX IF NOT EXISTS idx_voice_agent_faqs_active ON public.voice_agent_faqs(active);

-- ============================
-- voice_agent_transfers
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agent_transfers (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT NOT NULL REFERENCES public.voice_calls(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    department TEXT,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS idx_voice_agent_transfers_call_id ON public.voice_agent_transfers(call_id);

-- ============================
-- voice_agent_callbacks
-- ============================
CREATE TABLE IF NOT EXISTS public.voice_agent_callbacks (
    id TEXT DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT REFERENCES public.voice_calls(id) ON DELETE SET NULL,
    caller_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_time TEXT,
    timezone TEXT DEFAULT 'America/Toronto',
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, assigned, completed, cancelled
    assigned_to TEXT,
    notes TEXT,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_voice_agent_callbacks_call_id ON public.voice_agent_callbacks(call_id);
CREATE INDEX IF NOT EXISTS idx_voice_agent_callbacks_status ON public.voice_agent_callbacks(status);

-- ============================
-- Seed: Default Debbie agent
-- ============================
INSERT INTO public.voice_agents (id, name, slug, role, description, active, system_prompt, greeting, transfer_number)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Debbie',
    'debbie',
    'International Admissions Voice Assistant',
    'Cannoga College International Admissions Voice Assistant',
    TRUE,
    'You are Debbie, Cannoga College International Admissions Assistant. You are warm, calm, professional, friendly, patient, conversational, confident, helpful, respectful, natural, concise, and reassuring. You speak naturally using short conversational sentences. You never repeatedly announce that you are an AI. If asked if you are an AI, you say: "Yes, I''m Cannoga College''s virtual admissions assistant. I can help with programs, applications, admissions information and general questions. If you''d prefer to speak with someone from our admissions team, I can connect you." You retrieve information from approved knowledge and database records. You never invent programs, tuition, deadlines, requirements, or student information. If you do not know something, you say: "I don''t want to give you incorrect information. Let me connect you with our admissions team or arrange a callback." You must not claim to be IRCC, guarantee study permits, guarantee visa approval, or provide legal advice. You distinguish Cannoga College admissions information from Canadian immigration requirements.',
    'Hi, you''ve reached Cannoga College Admissions. I''m Debbie. How can I help you today?',
    '+1-416-555-0100'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.voice_agent_settings (agent_id, setting_key, setting_value)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'voice_provider', 'mock'),
    ('00000000-0000-0000-0000-000000000001', 'voice_id', 'mock-voice-01'),
    ('00000000-0000-0000-0000-000000000001', 'speaking_speed', '1.0'),
    ('00000000-0000-0000-0000-000000000001', 'interruption_sensitivity', 'medium'),
    ('00000000-0000-0000-0000-000000000001', 'max_response_length', '200'),
    ('00000000-0000-0000-0000-000000000001', 'goodbye', 'Thank you for calling Cannoga College Admissions. Have a great day!')
ON CONFLICT (agent_id, setting_key) DO NOTHING;
