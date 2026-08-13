'use client';

import React from 'react';
import Link from 'next/link';
import { BellIcon as Bell, X as X } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  priority: 'normal' | 'high';
  read: boolean;
  href?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({ notifications, onClose, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  return (
    <div className="fixed right-4 top-14 w-80 bg-white border border-neutral-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">Notifications</span>
        <button onClick={onMarkAllRead} className="text-[10px] font-bold uppercase tracking-wider text-[#0a151a] hover:underline">Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className={`px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 cursor-pointer ${!n.read ? 'bg-[#faf5ff]' : ''}`}>
            <div className="flex items-start gap-2">
              {!n.read && <span className="w-2 h-2 bg-[#0a151a] rounded-full mt-1.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-900 truncate">{n.title}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{n.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{n.time}</span>
                  {n.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">High</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-neutral-200">
        <Link href="/sis/notifications" className="block text-center text-xs font-bold uppercase tracking-wider text-[#0a151a] hover:underline no-underline">View All Notifications</Link>
      </div>
    </div>
  );
}