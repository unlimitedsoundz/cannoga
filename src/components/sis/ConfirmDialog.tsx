'use client';

import React from 'react';
import { Alert01Icon as AlertTriangle } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  loading?: boolean;
}

const variantStyles = {
  danger: 'bg-red-600 hover:bg-red-700',
  primary: 'bg-neutral-900 hover:bg-neutral-800',
  warning: 'bg-amber-600 hover:bg-amber-700',
};

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary', loading = false }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-none shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 py-3 border-b border-neutral-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">{title}</h2>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <HugeiconsIcon icon={AlertTriangle} size={20} strokeWidth={2} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-600">{message}</p>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider text-white ${variantStyles[variant]} disabled:opacity-50 transition-colors`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}