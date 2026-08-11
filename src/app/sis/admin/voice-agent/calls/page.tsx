'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { X as X } from '@hugeicons/core-free-icons';

interface VoiceCallRow {
  id: string;
  agent_id: string;
  provider: string;
  provider_call_id: string;
  caller_phone: string | null;
  called_phone: string | null;
  direction: string;
  status: string;
  started_at: string;
  answered_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  transferred: boolean;
  transfer_target: string | null;
  intent: string | null;
  summary: string | null;
  student_id: string | null;
  application_id: string | null;
}

interface CallMessage {
  id: string;
  role: string;
  message: string;
  timestamp: string;
  sequence: number;
}

interface CallToolEvent {
  id: string;
  tool_name: string;
  result: unknown;
  success: boolean;
  error: string | null;
}

export default function VoiceAgentCallsPage() {
  const [calls, setCalls] = useState<VoiceCallRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCall, setSelectedCall] = useState<VoiceCallRow | null>(null);
  const [callDetails, setCallDetails] = useState<{ messages: CallMessage[]; toolEvents: CallToolEvent[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/voice/calls?search=${encodeURIComponent(searchQuery)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch calls');
        const data = await res.json();
        setCalls(data.calls || []);
      } catch (err) {
        console.error('Failed to load calls:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleViewCall = async (call: VoiceCallRow) => {
    setSelectedCall(call);
    setLoadingDetails(true);
    setCallDetails(null);

    try {
      const res = await fetch(`/api/voice/incoming?callId=${call.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch call details');
      const data = await res.json();
      setCallDetails({
        messages: (data.messages || []) as CallMessage[],
        toolEvents: (data.toolEvents || []) as CallToolEvent[],
      });
    } catch (err) {
      console.error('Failed to load call details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

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

  const columns = [
    {
      key: 'caller_phone',
      header: 'Caller',
      render: (call: VoiceCallRow) => <span className="font-mono text-xs text-neutral-200">{call.caller_phone || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (call: VoiceCallRow) => <StatusBadge status={call.status} />,
    },
    {
      key: 'started_at',
      header: 'Started',
      render: (call: VoiceCallRow) => <span className="text-slate-400 text-xs">{formatDate(call.started_at)}</span>,
    },
    {
      key: 'duration_seconds',
      header: 'Duration',
      render: (call: VoiceCallRow) => <span className="text-slate-400 text-xs">{formatDuration(call.duration_seconds)}</span>,
    },
    {
      key: 'transferred',
      header: 'Transferred',
      render: (call: VoiceCallRow) => call.transferred ? <span className="text-xs font-bold text-amber-400">Yes</span> : <span className="text-xs text-neutral-500">No</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (call: VoiceCallRow) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleViewCall(call); }}
          className="text-xs font-bold text-white hover:text-neutral-300 transition-colors uppercase tracking-wider"
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call History"
        subtitle="View and search all voice calls"
        actions={
          <button
            onClick={() => handleSearchChange('')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors"
          >
            <HugeiconsIcon icon={X} size={14} strokeWidth={2.5} /> Clear
          </button>
        }
      />
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by phone, status, or ID..."
        />
      </div>
      <DataTable
        columns={columns}
        data={calls}
        keyField="id"
        emptyMessage="No calls found"
        onRowClick={(call) => handleViewCall(call as VoiceCallRow)}
      />

      {selectedCall && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setSelectedCall(null)}>
          <div className="bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Call Details</h3>
              <button onClick={() => setSelectedCall(null)} className="text-slate-400 hover:text-white">
                <HugeiconsIcon icon={X} size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Caller</span>
                  <p className="text-sm font-mono mt-1 text-white">{selectedCall.caller_phone || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                  <p className="text-sm mt-1"><StatusBadge status={selectedCall.status} /></p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</span>
                  <p className="text-sm mt-1 text-white">{formatDuration(selectedCall.duration_seconds)}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Transferred</span>
                  <p className="text-sm mt-1 text-white">{selectedCall.transferred ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {selectedCall.summary && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Summary</span>
                  <p className="text-sm text-neutral-300 mt-1 p-4 bg-white/4 rounded-xl">{selectedCall.summary}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Transcript</h4>
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {(callDetails?.messages || []).map((msg: CallMessage) => (
                      <div key={msg.id} className={`p-3 rounded-xl ${msg.role === 'caller' ? 'bg-neutral-800 ml-8' : msg.role === 'assistant' ? 'bg-white/5 mr-8' : 'bg-neutral-800'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{msg.role}</span>
                          <span className="text-[10px] text-neutral-500">{formatDate(msg.timestamp)}</span>
                        </div>
                        <p className="text-xs text-white">{msg.message}</p>
                      </div>
                    ))}
                    {(callDetails?.messages || []).length === 0 && (
                      <p className="text-xs text-neutral-500 text-center py-4">No transcript available</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tool Events</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(callDetails?.toolEvents || []).map((tool: CallToolEvent) => (
                    <div key={tool.id} className="p-4 bg-white/4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">{tool.tool_name}</span>
                        <span className={`text-[10px] font-bold ${tool.success ? 'text-emerald-400' : 'text-red-400'}`}>{tool.success ? 'SUCCESS' : 'FAILED'}</span>
                      </div>
                      {tool.error && <p className="text-xs text-red-400 mt-1">{tool.error}</p>}
                      {tool.result != null && (
                        <pre className="text-xs text-neutral-300 mt-2 p-3 bg-neutral-900 rounded-lg overflow-x-auto">{JSON.stringify(tool.result, null, 2)}</pre>
                      )}
                    </div>
                  ))}
                  {(callDetails?.toolEvents || []).length === 0 && (
                    <p className="text-xs text-neutral-500 text-center py-4">No tool events recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
