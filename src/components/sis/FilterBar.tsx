'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronDownIcon as ChevronDown } from '@hugeicons/core-free-icons';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: Array<{
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }>;
  onClearAll?: () => void;
}

export function FilterBar({ filters, onClearAll }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map(filter => (
        <div key={filter.key} className="relative">
          <label className="sr-only">{filter.label}</label>
          <select
            value={filter.value}
            onChange={e => filter.onChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none cursor-pointer"
          >
            <option value="">{filter.placeholder || filter.label}</option>
            {filter.options.map(opt => (
              <option key={`${filter.key}-${opt.value}`} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <HugeiconsIcon icon={ChevronDown} size={12} strokeWidth={2.5} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      ))}
      {onClearAll && filters.some(f => f.value) && (
        <button onClick={onClearAll} className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-700">Clear all</button>
      )}
    </div>
  );
}