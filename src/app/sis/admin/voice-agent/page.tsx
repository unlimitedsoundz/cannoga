'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PhoneCall as Phone,
  Calendar01Icon as Calendar,
  ClockIcon as Clock,
  ArrowRightIcon as ArrowRight,
  ActivityIcon as Activity,
  CheckCircle as CheckCircle,
  ArrowRightIcon as Transfer,
  Message01Icon as Message,
  Alert01Icon as AlertCircle,
  Shield01Icon as Shield,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';

interface VoiceCallRow {
  id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  transferred: boolean;
  caller_phone: string | null;
  summary: string | null;
}

interface VoiceStats {
  callsToday: number;
  callsThisWeek: number;
  totalCalls: number;
  avgDurationSeconds: number;
  transferRate: number;
  callbackRequests: number;
  unresolvedCalls: number;
}

async function getVoiceAgentStats(): Promise<VoiceStats> {
  try {
    const res = await fetch('/api/voice/stats', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return data;
  } catch {
    return {
      callsToday: 0,
      callsThisWeek: 0,
      totalCalls: 0,
      avgDurationSeconds: 0,
      transferRate: 0,
      callbackRequests: 0,
      unresolvedCalls: 0,
    };
  }
}

async function getRecentCalls(): Promise<VoiceCallRow[]> {
  try {
    const res = await fetch('/api/voice/stats?recent=true', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.recentCalls || [];
  } catch {
    return [];
  }
}

export default function VoiceAgentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VoiceStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<VoiceCallRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, callsData] = await Promise.all([getVoiceAgentStats(), getRecentCalls()]);
        setStats(statsData);
        setRecentCalls(callsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load voice agent data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-neutral-900 rounded-2xl text-center">
        <HugeiconsIcon icon={AlertCircle} size={36} className="text-neutral-500 mx-auto mb-4" />
        <p className="text-white font-bold text-sm uppercase tracking-wider mb-1">Voice Agent Error</p>
        <p className="text-slate-400 text-xs">{error}</p>
      </div>
    );
  }

  const s = stats!;

  const statCards = [
    { label: 'Calls Today', count: s.callsToday, icon: Phone, href: '/sis/admin/voice-agent/calls' },
    { label: 'Calls This Week', count: s.callsThisWeek, icon: Calendar, href: '/sis/admin/voice-agent/calls' },
    { label: 'Total Calls', count: s.totalCalls, icon: Activity, href: '/sis/admin/voice-agent/calls' },
    { label: 'Avg Duration', count: `${Math.floor(s.avgDurationSeconds / 60)}m ${s.avgDurationSeconds % 60}s`, icon: Clock, href: '/sis/admin/voice-agent/calls' },
    { label: 'Transfer Rate', count: `${s.transferRate}%`, icon: Transfer, href: '/sis/admin/voice-agent/calls' },
    { label: 'Callback Requests', count: s.callbackRequests, icon: Message, href: '/sis/admin/voice-agent/calls' },
    { label: 'Unresolved Calls', count: s.unresolvedCalls, icon: AlertCircle, href: '/sis/admin/voice-agent/calls' },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'â€”';
    return new Date(dateStr).toLocaleString('en-CA');
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'â€”';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voice Agent â€” Debbie"
        subtitle="International Admissions Voice Assistant monitoring and management"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/sis/admin/voice-agent/test"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a151a] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 transition-all no-underline shadow-sm"
            >
              <HugeiconsIcon icon={Shield} size={14} strokeWidth={2.5} /> Test Voice
            </Link>
            <Link
              href="/sis/admin/voice-agent/knowledge"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-700 transition-all no-underline shadow-sm"
            >
              Manage Knowledge
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className="bg-neutral-900 rounded-2xl p-5 hover:bg-neutral-800/80 transition-all no-underline group shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-neutral-800 text-white">
                <HugeiconsIcon icon={stat.icon} size={18} strokeWidth={2} />
              </div>
              <HugeiconsIcon icon={ArrowRight} size={13} strokeWidth={2.5} className="text-neutral-600 group-hover:text-white transform group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-2xl font-black text-white">{stat.count}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <HugeiconsIcon icon={Phone} size={14} className="text-neutral-500" /> Recent Calls
            </h2>
            <Link href="/sis/admin/voice-agent/calls" className="text-xs font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-wider no-underline">
              View All â†’
            </Link>
          </div>
          <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-white/4">
                <tr>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone</th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Started</th>
                  <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentCalls.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-500 text-sm">No calls recorded yet</td></tr>
                ) : (
                  recentCalls.slice(0, 10).map((call) => (
                    <tr key={call.id} className="hover:bg-white/4 transition-colors">
                      <td className="p-3 font-mono text-xs text-neutral-200">{call.caller_phone || 'â€”'}</td>
                      <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-neutral-800 text-white">{call.status}</span></td>
                      <td className="p-3 text-xs text-slate-400">{formatDate(call.started_at)}</td>
                      <td className="p-3 text-xs text-slate-400">{formatDuration(call.duration_seconds)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <HugeiconsIcon icon={CheckCircle} size={14} className="text-neutral-500" /> Quick Actions
          </h2>
          <div className="bg-neutral-900 rounded-2xl p-5 space-y-3 shadow-sm">
            <Link href="/sis/admin/voice-agent/test" className="flex items-center gap-4 p-4 bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition-colors no-underline group">
              <div className="p-2.5 bg-neutral-800 text-white rounded-xl">
                <HugeiconsIcon icon={Phone} size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Test Voice Agent</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Open browser-based voice testing interface</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-600 group-hover:text-white ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/sis/admin/voice-agent/calls" className="flex items-center gap-4 p-4 bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition-colors no-underline group">
              <div className="p-2.5 bg-neutral-800 text-white rounded-xl">
                <HugeiconsIcon icon={Activity} size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Call History</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">View and search complete call logs and transcripts</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-600 group-hover:text-white ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/sis/admin/voice-agent/knowledge" className="flex items-center gap-4 p-4 bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition-colors no-underline group">
              <div className="p-2.5 bg-neutral-800 text-white rounded-xl">
                <HugeiconsIcon icon={Message} size={18} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Knowledge Base</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Configure approved admissions knowledge and FAQs</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-600 group-hover:text-white ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
