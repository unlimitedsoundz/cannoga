'use client';

import React from 'react';
import { X as X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
      <div className={`relative bg-neutral-900 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 text-white`}>
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors">
            <HugeiconsIcon icon={X} size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-4 bg-neutral-900/50 flex justify-end gap-2 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}