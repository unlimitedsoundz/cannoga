'use client';

import React from 'react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange, showPageSize = false, pageSizeOptions = [10, 25, 50, 100], onPageSizeChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1 && !showPageSize) return null;

  const pages = React.useMemo(() => {
    const result: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (page > 3) result.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        result.push(i);
      }
      if (page < totalPages - 2) result.push('...');
      result.push(totalPages);
    }
    return result;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-neutral-200 bg-white">
      <div className="text-xs text-neutral-500">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
      </div>
      <div className="flex items-center gap-2">
        {showPageSize && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange?.(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
            >
              {pageSizeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => (
            <React.Fragment key={idx}>
              {p === '...' ? (
                <span className="px-2 text-neutral-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  className={`px-3 py-1.5 text-xs font-bold ${page === p ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'} rounded-none transition-colors`}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}