'use client';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="System configuration and administration"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Display Name</label>
              <input type="text" defaultValue="Admin User" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</label>
              <input type="email" defaultValue="admin@cannogacollege.ca" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Department</label>
              <input type="text" defaultValue="Administration" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">Save Changes</button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Current Password</label>
              <input type="password" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">New Password</label>
              <input type="password" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">Update Password</button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">System Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Academic Term</label>
              <select className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans">
                <option>Fall 2026</option>
                <option>Winter 2027</option>
                <option>Spring 2027</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Registration Window</label>
              <input type="text" defaultValue="Nov 1 - Dec 15, 2026" className="mt-1 w-full px-3 py-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none font-sans" />
            </div>
            <button className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">Save Settings</button>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">Session Management</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-neutral-50">
              <div>
                <div className="text-xs font-bold text-neutral-900">Current Session</div>
                <div className="text-[10px] text-neutral-500">Active since Aug 3, 2026</div>
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Active</span>
            </div>
            <button className="w-full px-4 py-2 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors">Terminate All Other Sessions</button>
          </div>
        </div>
      </div>
    </div>
  );
}