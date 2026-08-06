'use client';

import { createClient } from '@/utils/supabase/client';
import { User, Envelope as Mail, Globe, Calendar, GraduationCap, Clock, ShieldCheck, CircleNotch as Loader2, PencilLine, Check, X } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import { formatToDDMMYYYY } from '@/utils/date';
import AvatarUpload from '@/components/portal/AvatarUpload';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateProfile, ensureStudentId } from '../profile-actions';
import DateSelector from '@/components/ui/DateSelector';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({
        date_of_birth: '',
        country_of_residence: ''
    });

    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    router.push('/portal/account/login');
                    return;
                }

                setUser(authUser);

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle();

                if (profileError || !profileData) {
                    router.push('/portal/account/login');
                    return;
                }

                setProfile(profileData);
                setEditData({
                    date_of_birth: profileData.date_of_birth || '',
                    country_of_residence: profileData.country_of_residence || ''
                });

                // Auto-enter edit mode if critical data is missing
                if (searchParams.get('complete') === 'true' || !profileData.date_of_birth) {
                    setIsEditing(true);
                }

                // Ensure Student ID exists
                if (!profileData.student_id) {
                    const { studentId } = await ensureStudentId();
                    if (studentId) {
                        setProfile((prev: any) => ({ ...prev, student_id: studentId }));
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                router.push('/portal/account/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase, router, searchParams]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile(editData);
            setProfile((prev: any) => ({ ...prev, ...editData }));
            setIsEditing(false);
        } catch (error: any) {
            alert(`Failed to update profile: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    if (!user || !profile) return null;

    const isIncomplete = !profile.date_of_birth || !profile.country_of_residence;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-black text-black tracking-tight">Student Profile</h1>
                    <p className="text-[10px] font-bold text-black">Account Details</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-[10px] font-black text-neutral-500 hover:text-black transition-colors"
                    >
                        <PencilLine size={16} weight="bold" />
                        Edit Info
                    </button>
                )}
            </div>

            {isIncomplete && !isEditing && (
                <div className="bg-red-50 border border-red-100 p-4 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-red-700">
                        Your profile is incomplete. This may block application submissions.
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-[9px] font-black bg-red-700 text-white px-3 py-1.5 rounded-sm hover:bg-red-800 transition-all"
                    >
                        Fix Now
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Account Details */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-white p-6 border border-neutral-200">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-4">
                            <h3 className="text-[10px] font-black text-black">Account Information</h3>
                            {isEditing && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={isSaving}
                                        className="text-[9px] font-black text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 text-[9px] font-black text-black disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} weight="bold" />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileItem label="Email Address" value={user.email} />

                            {isEditing ? (
                                <div className="space-y-4 col-span-1 md:col-span-2 pt-2">
                                    <DateSelector
                                        name="date_of_birth"
                                        label="Date of Birth"
                                        value={editData.date_of_birth}
                                        onChange={(name, val) => setEditData(prev => ({ ...prev, [name]: val }))}
                                        required
                                    />
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-black">Country of Residence</label>
                                        <input
                                            type="text"
                                            value={editData.country_of_residence}
                                            onChange={(e) => setEditData(prev => ({ ...prev, country_of_residence: e.target.value }))}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-[#9c27b3] transition-all"
                                            placeholder="e.g. Ottawa, Ontario, Canada"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ProfileItem label="Date of Birth" value={profile.date_of_birth} />
                                    <ProfileItem label="Country" value={profile.country_of_residence} />
                                </>
                            )}

                            {!isEditing && <ProfileItem label="Joined" value={formatToDDMMYYYY(profile.created_at)} />}
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-[10px] font-black text-black mb-2">Account Security</h3>
                        <p className="text-[10px] font-bold leading-relaxed mb-4 tracking-tight text-neutral-600">
                            Your account is protected by Cannoga College biometric-ready authentication.
                        </p>
                        <a
                            href="mailto:info@cannogacollege.ca?subject=Data Update Request"
                            className="inline-block text-[9px] font-black bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 rounded transition-all"
                        >
                            Request Data Update
                        </a>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="md:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 text-center">
                        <AvatarUpload
                            userId={user.id}
                            currentAvatarUrl={undefined}
                            firstName={profile.first_name}
                            email={user.email}
                        />
                        <h2 className="text-sm font-black text-black tracking-tight">
                            {profile.first_name} {profile.last_name}
                        </h2>

                        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-1 items-center">
                            <div className="text-[9px] font-black leading-none text-black">Student ID</div>
                            <div className="text-base font-black leading-none text-black">{profile.student_id || <Loader2 className="animate-spin text-neutral-300" size={16} />}</div>
                        </div>
                    </div>

                    <Link
                        href="/portal/dashboard"
                        className="flex items-center justify-center w-full py-3 bg-neutral-100 rounded text-[10px] font-black hover:bg-neutral-200 transition-all"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ label, value }: { label: string, value?: string }) {
    return (
        <div className="space-y-0.5">
            <div className="text-[9px] font-black text-black">{label}</div>
            <div className="text-xs font-bold leading-tight text-black">{value || 'N/A'}</div>
        </div>
    );
}

