'use client';

import { useState, useRef } from 'react';
import { Camera, CircleNotch as Loader2, User } from "@phosphor-icons/react";
import { createClient } from '@/utils/supabase/client';
import { updateAvatarUrl } from '@/app/portal/account/actions';
import Image from 'next/image';

interface AvatarUploadProps {
    userId: string;
    currentAvatarUrl?: string | null;
    firstName?: string | null;
    email?: string | null;
}

export default function AvatarUpload({ userId, currentAvatarUrl, firstName, email }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('File size must be less than 2MB.');
            return;
        }

        try {
            setUploading(true);

            // 1. Upload to Supabase Storage
            // Path: avatars/{userId}/{filename}
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update Profile via Server Action
            await updateAvatarUrl(publicUrl);

            setPreviewUrl(publicUrl);
            alert('Profile picture updated successfully!');
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            alert(error.message || 'Failed to upload profile picture. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const initial = firstName?.[0] || email?.[0]?.toUpperCase() || '?';

    return (
        <div className="relative group">
            <div className="w-24 h-24 bg-neutral-900 rounded-full force-circle mx-auto mb-3 flex items-center justify-center text-white text-3xl font-black overflow-hidden relative shadow-2xl border-4 border-white">
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Profile"
                        fill
                        className="object-cover object-top"
                    />
                ) : (
                    initial
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-[#9c27b3]/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" weight="bold" />
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-[#9c27b3] text-white rounded-full force-circle shadow-lg border-2 border-white hover:scale-110 transition-all disabled:opacity-50 disabled:scale-100"
                title="Change Profile Picture"
            >
                <Camera size={14} weight="bold" />
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

        </div>
    );
}


