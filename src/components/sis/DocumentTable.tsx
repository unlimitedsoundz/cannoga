'use client';

import React from 'react';
import { DataTable } from './DataTable';
import { StatusBadge } from './StatusBadge';
import { 
  File01Icon as FileText, 
  Download01Icon as Download, 
  EyeIcon as Eye, 
  ClockIcon as Clock 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  uploadedAt: string;
  size: string;
  uploadedBy?: string;
}

interface DocumentTableProps {
  documents: Document[];
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export function DocumentTable({ documents, onView, onDownload, pagination }: DocumentTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Document',
      render: (doc: Document) => (
        <div className="flex items-center gap-3 min-w-0 max-w-full">
          <HugeiconsIcon icon={FileText} size={18} strokeWidth={2} className="text-neutral-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-neutral-900 truncate" title={doc.name}>{doc.name}</div>
            <div className="text-xs text-neutral-500 truncate">{doc.type.toUpperCase()} • {doc.size}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'status',
      header: 'Status',
      render: (doc: Document) => <StatusBadge status={doc.status} />,
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded',
      render: (doc: Document) => (
        <div className="flex items-center gap-1">
          <HugeiconsIcon icon={Clock} size={14} strokeWidth={2.5} className="text-neutral-400" />
          <span className="text-sm text-neutral-600">{doc.uploadedAt}</span>
        </div>
      ),
    },
    {
      key: 'uploadedBy',
      header: 'Uploaded By',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (doc: Document) => (
        <div className="flex items-center gap-1">
          {onView && (
            <button onClick={() => onView(doc)} className="p-1.5 text-neutral-400 hover:text-neutral-600" title="View">
              <HugeiconsIcon icon={Eye} size={16} strokeWidth={2} />
            </button>
          )}
          {onDownload && (
            <button onClick={() => onDownload(doc)} className="p-1.5 text-neutral-400 hover:text-neutral-600" title="Download">
              <HugeiconsIcon icon={Download} size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={documents}
      keyField="id"
      pagination={pagination}
      emptyMessage="No documents found"
    />
  );
}