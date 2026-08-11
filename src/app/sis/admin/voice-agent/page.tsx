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
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 border border-red-100 rounded-none text-center"><p className="text-red-600 font-medium text-sm">{error}</p></div>;
  }

  const s = stats!;

  const statCards = [
    { label: 'Calls Today', count: s.callsToday, icon: Phone, color: 'bg-blue-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Calls This Week', count: s.callsThisWeek, icon: Calendar, color: 'bg-indigo-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Total Calls', count: s.totalCalls, icon: Activity, color: 'bg-purple-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Avg Duration', count: `${Math.floor(s.avgDurationSeconds / 60)}m ${s.avgDurationSeconds % 60}s`, icon: Clock, color: 'bg-teal-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Transfer Rate', count: `${s.transferRate}%`, icon: Transfer, color: 'bg-amber-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Callback Requests', count: s.callbackRequests, icon: Message, color: 'bg-emerald-500', href: '/sis/admin/voice-agent/calls' },
    { label: 'Unresolved Calls', count: s.unresolvedCalls, icon: AlertCircle, color: 'bg-red-500', href: '/sis/admin/voice-agent/calls' },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-CA');
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Voice Agent — Debbie"
        subtitle="International Admissions Voice Assistant monitoring and management"
        actions={
          <div className="flex items-center gap-2">
            <Link href="/sis/admin/voice-agent/test" className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors no-underline">
              <HugeiconsIcon icon={Shield} size={14} strokeWidth={2.5} /> Test Voice
            </Link>
            <Link href="/sis/admin/voice-agent/knowledge" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-sm hover:border-neutral-400 transition-colors no-underline">
              Manage Knowledge
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="bg-white border border-neutral-200 p-6 hover:border-[#9c27b3] transition-colors no-underline group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-none ${stat.color} text-white`}>
                <HugeiconsIcon icon={stat.icon} size={24} strokeWidth={2} />
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-300 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{stat.label}</span>
              <span className="text-2xl font-black text-neutral-900">{stat.count}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HugeiconsIcon icon={Phone} size={20} strokeWidth={2} className="text-blue-500" /> Recent Calls
            </h2>
            <Link href="/sis/admin/voice-agent/calls" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">
              View All →
            </Link>
          </div>
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Phone</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Status</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Started</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentCalls.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-400 text-sm">No calls yet</td></tr>
                ) : (
                  recentCalls.slice(0, 10).map((call) => (
                    <tr key={call.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono text-xs">{call.caller_phone || '—'}</td>
                      <td className="p-3"><span className="inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm bg-neutral-100 text-neutral-700">{call.status}</span></td>
                      <td className="p-3 text-xs">{formatDate(call.started_at)}</td>
                      <td className="p-3 text-xs">{formatDuration(call.duration_seconds)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HugeiconsIcon icon={CheckCircle} size={20} strokeWidth={2} className="text-emerald-500" /> Quick Actions
          </h2>
          <div className="bg-white border border-neutral-200 p-6 space-y-4">
            <Link href="/sis/admin/voice-agent/test" className="flex items-center gap-4 p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors no-underline group">
              <div className="p-3 bg-blue-500 text-white">
                <HugeiconsIcon icon={Phone} size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Test Voice Agent</h3>
                <p className="text-xs text-neutral-500">Open browser-based voice testing UI</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-300 group-hover:text-black ml-auto" />
            </Link>
            <Link href="/sis/admin/voice-agent/calls" className="flex items-center gap-4 p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors no-underline group">
              <div className="p-3 bg-purple-500 text-white">
                <HugeiconsIcon icon={Activity} size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Call History</h3>
                <p className="text-xs text-neutral-500">View and search all voice calls</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-300 group-hover:text-black ml-auto" />
            </Link>
            <Link href="/sis/admin/voice-agent/knowledge" className="flex items-center gap-4 p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors no-underline group">
              <div className="p-3 bg-emerald-500 text-white">
                <HugeiconsIcon icon={Message} size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Knowledge Base</h3>
                <p className="text-xs text-neutral-500">Manage knowledge entries and FAQs</p>
              </div>
              <HugeiconsIcon icon={ArrowRight} size={14} strokeWidth={2.5} className="text-neutral-300 group-hover:text-black ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
