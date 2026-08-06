'use client';

import React from 'react';
import { X as X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

const sizeClasses = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[32rem]',
  full: 'w-[90vw] max-w-full',
};

export function Drawer({ isOpen, onClose, title, children, position = 'right', size = 'md' }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative bg-white shadow-xl flex flex-col ${sizeClasses[size]} ${position === 'right' ? 'ml-auto' : 'mr-auto'} animate-in slide-in-from-${position === 'right' ? 'right' : 'left'} duration-300`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">{title}</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
            <HugeiconsIcon icon={X} size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}