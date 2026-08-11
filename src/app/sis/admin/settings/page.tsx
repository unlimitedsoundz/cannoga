'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserIcon as User,
  Shield01Icon as Security,
  Setting01Icon as SettingsIcon,
  CheckCircle as CheckCircle,
  Alert01Icon as AlertCircle,
  Logout01Icon as Logout,
} from '@hugeicons/core-free-icons';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Admin User');
  const [email, setEmail] = useState('admin@cannogacollege.ca');
  const [department, setDepartment] = useState('Administration');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [academicTerm, setAcademicTerm] = useState('Fall 2026');
  const [registrationWindow, setRegistrationWindow] = useState('Nov 1 - Dec 15, 2026');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [savingSystem, setSavingSystem] = useState(false);
  const [otherSessionsTerminated, setOtherSessionsTerminated] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast('success', 'Profile settings updated successfully');
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('error', 'Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters long');
      return;
    }
    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      showToast('success', 'Security password updated successfully');
    }, 600);
  };

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSystem(true);
    setTimeout(() => {
      setSavingSystem(false);
      showToast('success', 'System settings updated successfully');
    }, 600);
  };

  const handleTerminateSessions = () => {
    setOtherSessionsTerminated(true);
    showToast('success', 'All other active administrator sessions have been terminated');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="System configuration, profile management, and security administration"
      />

      {feedback && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40' : 'bg-red-950/70 text-red-300 border border-red-800/40'}`}>
          <HugeiconsIcon icon={feedback.type === 'success' ? CheckCircle : AlertCircle} size={18} />
          <p className="text-xs font-bold uppercase tracking-wider">{feedback.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleSaveProfile} className="bg-neutral-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <HugeiconsIcon icon={User} size={16} strokeWidth={2} /> Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-3 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="bg-neutral-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <HugeiconsIcon icon={Security} size={16} strokeWidth={2} /> Security & Authentication
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPassword}
              className="px-5 py-3 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {updatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>

        <form onSubmit={handleSaveSystemSettings} className="bg-neutral-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <HugeiconsIcon icon={SettingsIcon} size={16} strokeWidth={2} /> System Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Academic Term</label>
              <select
                value={academicTerm}
                onChange={e => setAcademicTerm(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              >
                <option value="Fall 2026">Fall 2026</option>
                <option value="Winter 2027">Winter 2027</option>
                <option value="Spring 2027">Spring 2027</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Course Registration Window</label>
              <input
                type="text"
                value={registrationWindow}
                onChange={e => setRegistrationWindow(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9c27b3] font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={savingSystem}
              className="px-5 py-3 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingSystem ? 'Saving System Settings...' : 'Save System Settings'}
            </button>
          </div>
        </form>

        <div className="bg-neutral-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <HugeiconsIcon icon={Logout} size={16} strokeWidth={2} /> Session Management
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-neutral-800 rounded-xl flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-white">Current Session</div>
                <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">Active Browser • Ottawa, ON</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
            </div>

            <button
              type="button"
              onClick={handleTerminateSessions}
              disabled={otherSessionsTerminated}
              className="w-full px-4 py-3 bg-red-950/60 text-red-300 border border-red-900/40 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-900/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              {otherSessionsTerminated ? 'Other Sessions Terminated' : 'Terminate All Other Sessions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}