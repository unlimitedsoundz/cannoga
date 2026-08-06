'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon as SearchIcon } from '@hugeicons/core-free-icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, placeholder = 'Search...', onClear }: SearchBarProps) {
  return (
    <div className="relative">
      <HugeiconsIcon icon={SearchIcon} size={16} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none font-sans"
      />
      {value && onClear && (
        <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
          ×
        </button>
      )}
    </div>
  );
}