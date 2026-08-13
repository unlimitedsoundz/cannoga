'use client';

import React from 'react';
import { HelpCircleIcon as Info, UserIcon as User, File01Icon as FileText, GraduationCapIcon as GraduationCap, CreditCardIcon as CreditCard } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';

interface EmptyStateProps {
  icon?: 'info' | 'user' | 'document' | 'academic' | 'finance';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  className?: string;
}

const icons = {
  info: Info,
  user: User,
  document: FileText,
  academic: GraduationCap,
  finance: CreditCard,
};

export function EmptyState({ icon = 'info', title, description, action, className = '' }: EmptyStateProps) {
  const Icon = icons[icon] as IconSvgElement;

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HugeiconsIcon icon={Icon} size={28} strokeWidth={1.5} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider ${action.href ? 'text-[#0a151a] hover:underline' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}