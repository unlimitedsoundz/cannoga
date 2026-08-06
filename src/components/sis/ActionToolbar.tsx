'use client';

import React from 'react';

interface ActionToolbarProps {
  actions?: React.ReactNode;
  search?: React.ReactNode;
  filter?: React.ReactNode;
}

export function ActionToolbar({ actions, search, filter }: ActionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        {filter}
      </div>
      <div className="flex items-center gap-2">
        {search}
        {actions}
      </div>
    </div>
  );
}