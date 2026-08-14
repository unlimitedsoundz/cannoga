'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-black !text-white text-white uppercase tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-xs !text-slate-300 text-slate-300 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}