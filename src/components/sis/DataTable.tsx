'use client';

import React from 'react';
import { ChevronDownIcon as ChevronDown, Search01Icon as SearchIcon, X as X } from '@hugeicons/core-free-icons';
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
    if (onSort) {
      onSort(key);
      return;
    }
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
    <div className={`overflow-x-auto border border-neutral-200 ${className}`}>
      <table className="w-full text-left text-sm font-sans">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {selection && (
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]"
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
                  data-indeterminate="true"
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={`p-3 text-xs font-bold uppercase tracking-wider text-neutral-600 ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:text-neutral-900 select-none' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && (
              <th className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selection ? 1 : 0) + (rowActions ? 1 : 0)} className="p-8 text-center text-neutral-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map(row => (
              <tr
                key={row[keyField]}
                className={onRowClick ? 'hover:bg-neutral-50 cursor-pointer transition-colors' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {selection && (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]"
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
                  <td key={col.key} className={`p-3 ${col.className || ''}`}>
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
        <div className="px-4 py-3 border-t border-neutral-200 bg-white flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}