'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const cancelled = false;

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
      render: (call: VoiceCallRow) => <span className="font-mono text-xs">{call.caller_phone || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (call: VoiceCallRow) => <StatusBadge status={call.status} />,
    },
    {
      key: 'started_at',
      header: 'Started',
      render: (call: VoiceCallRow) => formatDate(call.started_at),
    },
    {
      key: 'duration_seconds',
      header: 'Duration',
      render: (call: VoiceCallRow) => formatDuration(call.duration_seconds),
    },
    {
      key: 'transferred',
      header: 'Transferred',
      render: (call: VoiceCallRow) => call.transferred ? <span className="text-xs font-bold text-amber-600">Yes</span> : <span className="text-xs text-neutral-400">No</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (call: VoiceCallRow) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleViewCall(call); }}
          className="text-xs font-bold text-[#9c27b3] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Call History"
        subtitle="View and search all voice calls"
        actions={
          <button
            onClick={() => handleSearchChange('')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-sm hover:border-neutral-400 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCall(null)}>
          <div className="bg-white border border-neutral-200 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-neutral-900">Call Details</h3>
              <button onClick={() => setSelectedCall(null)} className="text-neutral-400 hover:text-neutral-600">
                <HugeiconsIcon icon={X} size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Caller</span>
                  <p className="text-sm font-mono mt-1">{selectedCall.caller_phone || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Status</span>
                  <p className="text-sm mt-1"><StatusBadge status={selectedCall.status} /></p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Duration</span>
                  <p className="text-sm mt-1">{formatDuration(selectedCall.duration_seconds)}</p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Transferred</span>
                  <p className="text-sm mt-1">{selectedCall.transferred ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {selectedCall.summary && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Summary</span>
                  <p className="text-sm text-neutral-700 mt-1 p-3 bg-neutral-50">{selectedCall.summary}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-neutral-900 mb-3">Transcript</h4>
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900"></div></div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {(callDetails?.messages || []).map((msg: CallMessage) => (
                      <div key={msg.id} className={`p-3 ${msg.role === 'caller' ? 'bg-blue-50 ml-8' : msg.role === 'assistant' ? 'bg-neutral-50 mr-8' : 'bg-neutral-100'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{msg.role}</span>
                          <span className="text-xs text-neutral-400">{formatDate(msg.timestamp)}</span>
                        </div>
                        <p className="text-sm text-neutral-800">{msg.message}</p>
                      </div>
                    ))}
                    {(callDetails?.messages || []).length === 0 && (
                      <p className="text-xs text-neutral-400 text-center py-4">No transcript available</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-neutral-900 mb-3">Tool Events</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(callDetails?.toolEvents || []).map((tool: CallToolEvent) => (
                    <div key={tool.id} className="p-3 border border-neutral-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">{tool.tool_name}</span>
                        <span className={`text-xs font-bold ${tool.success ? 'text-emerald-600' : 'text-red-600'}`}>{tool.success ? 'SUCCESS' : 'FAILED'}</span>
                      </div>
                      {tool.error && <p className="text-xs text-red-600 mt-1">{tool.error}</p>}
                      {tool.result != null && (
                        <pre className="text-xs text-neutral-600 mt-2 p-2 bg-neutral-50 overflow-x-auto">{JSON.stringify(tool.result, null, 2)}</pre>
                      )}
                    </div>
                  ))}
                  {(callDetails?.toolEvents || []).length === 0 && (
                    <p className="text-xs text-neutral-400 text-center py-4">No tool events recorded</p>
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
