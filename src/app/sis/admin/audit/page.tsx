'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { getSISAuditLogs } from '../actions';

interface AuditLogRow {
  id: string;
  action: string;
  entity_table: string;
  entity_id: string;
  actor_id?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export default function AuditPage() {
  const [data, setData] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getSISAuditLogs(50);
        if (!result.success) throw new Error(result.error);
        setData(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load audit logs');
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

  const columns = [
    { key: 'timestamp', header: 'Timestamp', render: (l: AuditLogRow) => new Date(l.timestamp).toLocaleString('en-CA') },
    { key: 'action', header: 'Action', render: (l: AuditLogRow) => <span className="font-mono text-xs font-bold text-neutral-900">{l.action}</span> },
    { key: 'entity_table', header: 'Module', render: (l: AuditLogRow) => <span className="text-xs text-neutral-600">{l.entity_table}</span> },
    { key: 'entity_id', header: 'Record', render: (l: AuditLogRow) => <span className="font-mono text-xs text-neutral-500">{l.entity_id}</span> },
    { key: 'actor', header: 'Administrator', render: (l: AuditLogRow) => <span className="text-xs text-neutral-600">{l.actor_id || 'System'}</span> },
    {
      key: 'metadata',
      header: 'Details',
      render: (l: AuditLogRow) => l.metadata ? (
        <pre className="text-[10px] text-neutral-400 max-w-xs overflow-hidden truncate">{JSON.stringify(l.metadata)}</pre>
      ) : (
        <span className="text-neutral-400 text-xs">—</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit History"
        subtitle="Enterprise audit log of all administrative actions"
      />

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          keyField="id"
          pagination={{ page, pageSize: 15, total: data.length, onPageChange: setPage }}
          emptyMessage="No audit entries found"
        />
      </div>
    </div>
  );
}