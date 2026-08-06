'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'under review': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  completed: { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-500' },
  incomplete: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  outstanding: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'requires attention': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  enrolled: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  registered: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'in progress': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`${padding} font-sans`}>
      {status}
    </span>
  );
}