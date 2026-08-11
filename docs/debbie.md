# DEBBIE — Cannoga College Virtual International Admissions Voice Assistant

## Overview
Debbie is the virtual international admissions office voice assistant for Cannoga College. Designed to feel natural, warm, professional, and helpful, Debbie answers questions regarding admissions, programs, tuition, application procedures, Provincial Attestation Letters (PAL), and international student services.

---

## Architecture

```
PHONE CALL / TEST CONSOLE
          ↓
  TelephonyProvider (Twilio / Telnyx / Web Test Adapter)
          ↓
  SpeechToTextProvider (Whisper / STT Adapter)
          ↓
  Conversation Engine (Context RAG, Interruption, Turn Detection)
          ↓
  KnowledgeProvider (Supabase RAG, Programs, Tuition, PAL, CMS Sync)
          ↓
  LanguageModelProvider (System Guardrails, Factual Knowledge, Persona)
          ↓
  TextToSpeechProvider (MiniMax TTS: moss_audio_3a23d270-45ff-11f1-bb39-7aa70590506b)
          ↓
  AUDIO STREAM BACK TO CALLER
```

---

## Environment Variables

Configure the following variables in `.env.local`:

```env
# MiniMax TTS Configuration
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
DEBBIE_MINIMAX_VOICE_ID=moss_audio_3a23d270-45ff-11f1-bb39-7aa70590506b

# Telephony Provider
DEBBIE_TELEPHONY_PROVIDER=twilio
DEBBIE_PHONE_NUMBER=+12272500427
DEBBIE_TRANSFER_NUMBER=+12272500427

# STT & LLM Providers
DEBBIE_STT_PROVIDER=puter-js # Options: puter-js (Zero API key needed via Puter.js), openai-whisper, deepgram
DEBBIE_STT_API_KEY=
DEBBIE_LLM_PROVIDER=openai
DEBBIE_LLM_API_KEY=
```

---

## Database Schema & Tables

Migration file: `supabase/migrations/20260811120000_debbie_voice_tables.sql`

- `debbie_settings`: System prompts, greetings, business hours, and voice configuration.
- `debbie_knowledge_sources`: Approved institutional knowledge entries, category priorities, and CMS links.
- `debbie_calls`: Inbound/outbound call logs, provider IDs, durations, and recording URLs.
- `debbie_conversations`: Session tracking, sentiment analysis, outcomes, and transfer flags.
- `debbie_messages`: Turn-by-turn transcripts, latency tracking, and roles.
- `debbie_leads`: Prospective student lead capture records (name, email, phone, country, interest).
- `debbie_escalations`: Human transfer triggers and support case queue.
- `debbie_feedback`: Caller satisfaction ratings and notes.

---

## Admin Dashboard Routes

- `/sis/admin/debbie` — Main Dashboard Overview
- `/sis/admin/debbie/calls` — Call Log & Transcripts
- `/sis/admin/debbie/knowledge` — Knowledge Base & CMS Sync
- `/sis/admin/debbie/leads` — Captured Prospective Student Leads
- `/sis/admin/debbie/escalations` — Human Transfers & Support Escalations
- `/sis/admin/debbie/settings` — Voice, Greetings, and Hours Configuration
- `/sis/admin/debbie/test` — Interactive Real-Time Test Console

---

## Knowledge Indexing API

Trigger CMS knowledge re-indexing:
`POST /api/debbie/knowledge/reindex` (Requires ADMIN role authentication).
