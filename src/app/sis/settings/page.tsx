'use client';

import React from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { Tabs } from '@/components/sis/Tabs';
import { 
  BellIcon as Bell, 
  UserIcon as User, 
  Shield01Icon as Shield, 
  CreditCardIcon as CreditCard, 
  GlobeIcon as Globe, 
  Key01Icon as Key, 
  MonitorSpeakerIcon as Monitor, 
  SaveIcon as Save, 
  Alert01Icon as AlertTriangle 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const tabs = [
  { label: 'Profile', href: '/sis/settings' },
  { label: 'Notifications', href: '/sis/settings/notifications' },
  { label: 'Security', href: '/sis/settings/security' },
  { label: 'Finance', href: '/sis/settings/finance' },
  { label: 'Preferences', href: '/sis/settings/preferences' },
];

export default function SettingsPage() {
  const [profile, setProfile] = React.useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'registrar@cannogacollege.ca',
    phone: '(613) 555-0100',
    title: 'Registrar',
    department: 'Office of the Registrar',
  });

  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
    finance: true,
    registration: true,
    academic: true,
    advising: true,
    system: true,
  });

  const [security, setSecurity] = React.useState({
    twoFactor: true,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  const [preferences, setPreferences] = React.useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/Toronto',
    dateFormat: 'MM/DD/YYYY',
    itemsPerPage: 25,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account preferences and system settings" />

      <Tabs tabs={tabs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={User} size={18} strokeWidth={2} className="text-[#9c27b3]" />
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={e => setProfile({...profile, firstName: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={e => setProfile({...profile, lastName: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={e => setProfile({...profile, title: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={e => setProfile({...profile, department: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                <HugeiconsIcon icon={Save} size={14} strokeWidth={2} /> Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={Bell} size={18} strokeWidth={2} className="text-[#9c27b3]" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
                { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in the portal' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between p-3 bg-neutral-50">
                  <div>
                    <div className="font-medium text-neutral-900">{n.label}</div>
                    <div className="text-xs text-neutral-500">{n.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[n.key as keyof typeof notifications]}
                      onChange={e => setNotifications({...notifications, [n.key]: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#9c27b3] rounded-full peer peer-checked:bg-[#9c27b3] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
              <div className="border-t border-neutral-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Notification Categories</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'finance', label: 'Finance & Billing' },
                    { key: 'registration', label: 'Registration' },
                    { key: 'academic', label: 'Academic Updates' },
                    { key: 'advising', label: 'Advising' },
                    { key: 'system', label: 'System Announcements' },
                  ].map(n => (
                    <label key={n.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[n.key as keyof typeof notifications]}
                        onChange={e => setNotifications({...notifications, [n.key]: e.target.checked})}
                        className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]"
                      />
                      <span className="text-sm text-neutral-700">{n.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={Shield} size={18} strokeWidth={2} className="text-[#9c27b3]" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50">
                <div>
                  <div className="font-medium text-neutral-900">Two-Factor Authentication</div>
                  <div className="text-xs text-neutral-500">Require 2FA for login</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={e => setSecurity({...security, twoFactor: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#9c27b3] rounded-full peer peer-checked:bg-[#9c27b3] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50">
                <div>
                  <div className="font-medium text-neutral-900">Login Alerts</div>
                  <div className="text-xs text-neutral-500">Notify on new device login</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={e => setSecurity({...security, loginAlerts: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#9c27b3] rounded-full peer peer-checked:bg-[#9c27b3] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Session Timeout (minutes)</label>
                <select
                  value={security.sessionTimeout}
                  onChange={e => setSecurity({...security, sessionTimeout: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                  <option value={120}>120</option>
                </select>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">
                  <HugeiconsIcon icon={Key} size={14} strokeWidth={2} /> Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={Monitor} size={18} strokeWidth={2} className="text-[#9c27b3]" />
              Display Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={e => setPreferences({...preferences, theme: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Language</label>
                <select
                  value={preferences.language}
                  onChange={e => setPreferences({...preferences, language: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={e => setPreferences({...preferences, timezone: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="America/Toronto">Eastern Time (Toronto)</option>
                  <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                  <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                  <option value="America/Winnipeg">Central Time (Winnipeg)</option>
                  <option value="America/Halifax">Atlantic Time (Halifax)</option>
                  <option value="America/St_Johns">Newfoundland Time (St. John's)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={e => setPreferences({...preferences, dateFormat: e.target.value})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1">Items Per Page</label>
                <select
                  value={preferences.itemsPerPage}
                  onChange={e => setPreferences({...preferences, itemsPerPage: Number(e.target.value)})}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white focus:border-neutral-400 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}