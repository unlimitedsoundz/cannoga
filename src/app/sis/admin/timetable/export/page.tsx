'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { SearchBar } from '@/components/sis/SearchBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { toast } from 'sonner';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Download01Icon as Download,
  FileTypeIcon as FileText,
  Table01Icon as Table,
  PrinterIcon as Printer,
  Calendar01Icon as Calendar,
} from '@hugeicons/core-free-icons';
import { exportTimetablePDF, exportTimetableCSV, exportTimetableExcel } from './actions';

type ExportFormat = 'pdf' | 'csv' | 'excel' | 'print';
type ExportType = 'master' | 'student' | 'faculty' | 'room';

export default function ExportTimetablePage() {
  const [versionId, setVersionId] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [exportType, setExportType] = useState<ExportType>('master');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!versionId) {
      toast.error('Please enter a version ID');
      return;
    }

    setExporting(true);
    try {
      let result;
      let mimeType: string;
      let extension: string;

      if (exportFormat === 'pdf') {
        result = await exportTimetablePDF(versionId, exportType);
        if (!result.success) throw new Error(result.error);
        mimeType = 'application/pdf';
        extension = 'pdf';
      } else if (exportFormat === 'csv') {
        result = await exportTimetableCSV(versionId, exportType);
        if (!result.success) throw new Error(result.error);
        mimeType = 'text/csv';
        extension = 'csv';
      } else if (exportFormat === 'excel') {
        result = await exportTimetableExcel(versionId, exportType);
        if (!result.success) throw new Error(result.error);
        mimeType = 'application/vnd.ms-excel';
        extension = 'xls';
      } else {
        const pdfResult = await exportTimetablePDF(versionId, exportType);
        if (!pdfResult.success) throw new Error(pdfResult.error);
        const blob = new Blob([new Uint8Array(pdfResult.data as Buffer)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
        toast.success('Opened print view');
        setExporting(false);
        return;
      }

      const blob = exportFormat === 'csv'
        ? new Blob([(result as any).data ?? ''], { type: mimeType })
        : new Blob([(result as any).data ?? ''], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-${exportType}-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportType} timetable as ${extension.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const exportCards = [
    { format: 'pdf', label: 'PDF', desc: 'Professional PDF document', icon: FileText, color: 'bg-red-50 text-red-700 border-red-200' },
    { format: 'csv', label: 'CSV', desc: 'Comma-separated values', icon: Table, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { format: 'excel', label: 'Excel', desc: 'Spreadsheet format', icon: Table, color: 'bg-green-50 text-green-700 border-green-200' },
    { format: 'print', label: 'Print', desc: 'Open in print view', icon: Printer, color: 'bg-neutral-100 text-neutral-700 border-neutral-300' },
  ];

  const typeCards = [
    { type: 'master', label: 'Master Timetable', desc: 'Complete schedule with all assignments', icon: Calendar },
    { type: 'student', label: 'Student Timetable', desc: 'Timetable per student enrollment', icon: FileText },
    { type: 'faculty', label: 'Faculty Timetable', desc: 'Timetable per instructor', icon: FileText },
    { type: 'room', label: 'Room Timetable', desc: 'Timetable per room', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Timetable"
        subtitle="Download timetable in multiple formats"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Version</h3>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Version ID</label>
              <input
                type="text"
                value={versionId}
                onChange={(e) => setVersionId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded text-sm"
                placeholder="Enter version ID"
              />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Export Format</h3>
            {exportCards.map((card) => (
              <button
                key={card.format}
                onClick={() => setExportFormat(card.format as ExportFormat)}
                className={`w-full flex items-center gap-3 p-3 border transition-colors ${exportFormat === card.format ? 'border-[#9c27b3] bg-purple-50' : 'border-neutral-200 hover:border-neutral-400'}`}
              >
                <div className={`p-2 ${card.color}`}>
                  <HugeiconsIcon icon={card.icon} size={16} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">{card.label}</div>
                  <div className="text-[10px] text-neutral-500">{card.desc}</div>
                </div>
                {exportFormat === card.format && (
                  <HugeiconsIcon icon={FileText} size={12} strokeWidth={2.5} className="ml-auto text-[#9c27b3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Export Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {typeCards.map((card) => (
                <button
                  key={card.type}
                  onClick={() => setExportType(card.type as ExportType)}
                  className={`flex items-center gap-3 p-4 border text-left transition-colors ${exportType === card.type ? 'border-[#9c27b3] bg-purple-50' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  <HugeiconsIcon icon={card.icon} size={20} strokeWidth={2.5} className={exportType === card.type ? 'text-[#9c27b3]' : 'text-slate-800'} />
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{card.label}</div>
                    <div className="text-[10px] text-neutral-500">{card.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Export Summary</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {exportFormat.toUpperCase()} • {exportType.charAt(0).toUpperCase() + exportType.slice(1)} Timetable
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting || !versionId}
                className="flex items-center gap-2 px-6 py-2 bg-[#9c27b3] text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all"
              >
                <HugeiconsIcon icon={Download} size={14} strokeWidth={2.5} />
                {exporting ? 'Exporting...' : 'Export Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
