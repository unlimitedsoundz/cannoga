'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  active:               { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  pending:              { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'under review':       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  approved:             { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  rejected:             { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  completed:            { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  incomplete:           { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' },
  paid:                 { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  partial:              { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  outstanding:          { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  overdue:              { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  verified:             { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'requires attention': { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  enrolled:             { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  registered:           { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'in progress':        { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  draft:                { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' },
  published:            { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

const defaultStyle = { bg: 'bg-neutral-100', text: 'text-neutral-800', border: 'border-neutral-300' };

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="text-xs font-medium text-slate-700 font-sans uppercase tracking-wider">
      {status?.replace(/_/g, ' ')}
    </span>
  );
}