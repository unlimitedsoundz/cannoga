'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon as Close } from '@hugeicons/core-free-icons';

interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  priority: string;
  status: string;
  publish_start: string;
  publish_end: string;
  created_at: string;
}

interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export default function AnnouncementModal({ announcement, onClose }: AnnouncementModalProps) {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white border border-neutral-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900">{announcement.title}</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-600">
            <HugeiconsIcon icon={Close} size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${announcement.priority === 'urgent' ? 'bg-red-50 text-red-700' : announcement.priority === 'high' ? 'bg-orange-50 text-orange-700' : 'bg-neutral-50 text-neutral-700'}`}>
              {announcement.priority}
            </span>
            <span className="text-xs text-neutral-500">
              {new Date(announcement.created_at).toLocaleDateString('en-CA')}
            </span>
          </div>
          <div className="bg-neutral-100 border border-neutral-200 flex items-center justify-center h-48">
            <span className="text-neutral-400 text-sm font-medium">Image Placeholder</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-neutral-700 whitespace-pre-wrap">{announcement.content || announcement.excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
