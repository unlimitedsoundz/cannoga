'use client';

import React from 'react';
import { ChevronDownIcon as ChevronDown } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  selection?: {
    selected: Set<string>;
    onChange: (selected: Set<string>) => void;
  };
  rowActions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  onRowClick,
  className = '',
  emptyMessage = 'No records found',
  pagination,
  sortConfig,
  onSort,
  selection,
  rowActions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(sortConfig?.key || null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(sortConfig?.direction || 'asc');

  const handleSort = (key: string) => {
    if (onSort) { onSort(key); return; }
    if (sortKey === key) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey && !sortConfig) return data;
    const key: string = sortKey || sortConfig!.key;
    const dir = sortKey ? sortDirection : (sortConfig?.direction || 'asc');
    return [...data].sort((a, b) => {
      const av = (a as any)[key];
      const bv = (b as any)[key];
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection, sortConfig]);

  return (
    <div className={`overflow-x-auto rounded-2xl bg-[#1a1a1a] shadow-sm ${className}`}>
      <table className="w-full text-left text-sm font-sans min-w-[480px]">
        <thead className="bg-white/4">
          <tr>
            {selection && (
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/10 accent-white outline-none"
                  onChange={(e) => {
                    const newSelected = new Set(selection.selected);
                    if (e.target.checked) {
                      sortedData.forEach(row => newSelected.add(String(row[keyField])));
                    } else {
                      sortedData.forEach(row => newSelected.delete(String(row[keyField])));
                    }
                    selection.onChange(newSelected);
                  }}
                  checked={selection.selected.size === data.length && data.length > 0}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={`p-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:text-neutral-200 select-none transition-colors' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-neutral-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && (
              <th className="p-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selection ? 1 : 0) + (rowActions ? 1 : 0)} className="p-10 text-center text-neutral-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map(row => (
              <tr
                key={row[keyField]}
                className={`transition-colors ${onRowClick ? 'hover:bg-white/4 cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {selection && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded bg-white/10 accent-white outline-none"
                      checked={selection.selected.has(String(row[keyField]))}
                      onChange={(e) => {
                        const newSelected = new Set(selection.selected);
                        if (e.target.checked) newSelected.add(String(row[keyField]));
                        else newSelected.delete(String(row[keyField]));
                        selection.onChange(newSelected);
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className={`p-3 text-neutral-300 ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="p-3">
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="px-4 py-3 bg-white/2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-white/5 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-white/5 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}