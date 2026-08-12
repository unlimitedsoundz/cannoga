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
      <HugeiconsIcon icon={SearchIcon} size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 text-sm bg-white/5 text-white placeholder-neutral-500 focus:bg-white/10 focus:outline-none rounded-xl font-sans transition-colors"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors text-base leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}