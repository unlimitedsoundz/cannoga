'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { ActionToolbar } from '@/components/sis/ActionToolbar';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { FilterBar } from '@/components/sis/FilterBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  BellIcon,
  FilterIcon,
  CircleCheckIcon,
  ChevronRightIcon
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const iconConfig = {
  Bell: BellIcon,
  Filter: FilterIcon,
  CheckCircle: CircleCheckIcon,
  ArrowRight: ChevronRightIcon
};

interface Notification {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [readFilter, setReadFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Registration', 'Admissions', 'Academics', 'Finance', 'Advising'];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sis/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const supabase = createClient();
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new as Notification : n));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || n.category === categoryFilter;
    const matchesRead = !readFilter || (readFilter === 'read' ? n.read : !n.read);
    return matchesSearch && matchesCategory && matchesRead;
  });

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/sis/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = filtered.filter(n => !n.read);
      await Promise.all(unread.map(n =>
        fetch('/api/sis/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n.id, read: true }),
        })
      ));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Notification',
      render: (n: Notification) => (
        <div className={`min-w-0 ${!n.read ? 'font-medium' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-neutral-900 ${!n.read ? '' : 'text-neutral-600'}`}>{n.title}</span>
            {n.priority === 'high' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">HIGH</span>}
            {n.priority === 'urgent' && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">URGENT</span>}
          </div>
          <div className={`text-sm text-neutral-500 line-clamp-2 ${!n.read ? 'text-neutral-700' : ''}`}>{n.message}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">{new Date(n.created_at).toLocaleString()}</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none ${n.category === 'Finance' ? 'bg-emerald-50 text-emerald-700' : n.category === 'Registration' ? 'bg-blue-50 text-blue-700' : n.category === 'Admissions' ? 'bg-amber-50 text-amber-700' : n.category === 'Academics' ? 'bg-purple-50 text-purple-700' : n.category === 'Advising' ? 'bg-red-50 text-red-700' : 'bg-neutral-50 text-neutral-700'}`}>
              {n.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (n: Notification) => (
        <div className="flex items-center gap-1">
          {!n.read && (
            <button onClick={() => markAsRead(n.id)} className="p-1.5 text-slate-800 hover:text-emerald-600" title="Mark as read">
              <HugeiconsIcon icon={iconConfig.CheckCircle} size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.filter(n => !n.read).length} unread notification${notifications.filter(n => !n.read).length !== 1 ? 's' : ''}`}
        actions={
          <button onClick={markAllAsRead} className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
            <HugeiconsIcon icon={iconConfig.CheckCircle} size={14} strokeWidth={2} /> Mark All Read
          </button>
        }
      />

      <ActionToolbar
        search={<SearchBar value={search} onChange={setSearch} placeholder="Search notifications..." />}
        filter={
          <FilterBar
            filters={[
              { key: 'category', label: 'Category', value: categoryFilter, onChange: setCategoryFilter, options: [
                { value: '', label: 'All Categories' },
                ...categories.map(c => ({ value: c, label: c })),
              ]},
              { key: 'read', label: 'Status', value: readFilter, onChange: setReadFilter, options: [
                { value: '', label: 'All' },
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
              ]},
            ]}
          />}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          selection={{ selected, onChange: setSelected }}
          pagination={{
            page,
            pageSize: 10,
            total: filtered.length,
            onPageChange: setPage,
          }}
          emptyMessage="No notifications found"
        />
      )}

      {selected.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200">
          <span className="text-sm font-medium text-neutral-700">{selected.size} selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100">Mark Read</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-neutral-200 text-neutral-700 hover:bg-neutral-100">Mark Unread</button>
            <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
