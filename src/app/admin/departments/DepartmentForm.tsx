'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { FloppyDisk as Save, UploadSimple as Upload } from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';

// Image upload is handled via Supabase Storage in handleSubmit

interface DepartmentFormProps {
    department: any;
    schools: any[];
    facultyMembers: any[];
}

export default function DepartmentForm({ department, schools, facultyMembers }: DepartmentFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(department.imageUrl);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const supabase = createClient();

        try {
            const formData = new FormData(e.currentTarget);

            const updateData: any = {
                name: formData.get('name') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                schoolId: formData.get('schoolId') as string,
                headOfDepartmentId: (formData.get('headOfDepartmentId') as string) || null,
                updatedAt: new Date().toISOString(),
            };

            // Handle Image Upload (Supabase Storage)
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                console.log('--- Starting image upload to Supabase ---');
                try {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${department.slug}-${Date.now()}.${fileExt}`;
                    const filePath = `departments/${fileName}`;

                    const { error: uploadError, data: uploadData } = await supabase.storage
                        .from('content')
                        .upload(filePath, imageFile, {
                            cacheControl: '3600',
                            upsert: true
                        });

                    if (uploadError) {
                        throw uploadError;
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('content')
                        .getPublicUrl(filePath);

                    console.log('✅ Image upload successful:', publicUrl);
                    updateData.imageUrl = publicUrl;
                } catch (uploadError: any) {
                    console.error('❌ Supabase storage upload error:', uploadError);
                    alert(`Image upload failed: ${uploadError?.message || 'Unknown error'}. Attempting to save other changes.`);
                }
            }

            console.log('--- Updating Department in Supabase ---', updateData);
            const { error, data } = await supabase
                .from('Department')
                .update(updateData)
                .eq('id', department.id)
                .select();

            if (error) {
                console.error('❌ Supabase update error:', error);
                throw error;
            }

            console.log('✅ Department updated successfully:', data);
            alert('Department details and image updated successfully!');

            // Give it a small delay for DB consistency before redirect
            setTimeout(() => {
                window.location.href = '/admin/departments';
            }, 800);
        } catch (error: any) {
            console.error('Error saving department:', error);
            alert(error.message || 'Error saving department. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-neutral-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            Department Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={department.name}
                            className="w-full p-4 border border-neutral-200 focus:outline-none focus:border-[#9c27b3] transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            Slug (URL path)
                        </label>
                        <input
                            type="text"
                            name="slug"
                            defaultValue={department.slug}
                            className="w-full p-4 border border-neutral-200 focus:outline-none focus:border-[#9c27b3] transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            School
                        </label>
                        <select
                            name="schoolId"
                            defaultValue={department.schoolId}
                            className="w-full p-4 border border-neutral-200 focus:outline-none focus:border-[#9c27b3] transition-colors appearance-none bg-white"
                            required
                        >
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            Head of Department
                        </label>
                        <select
                            name="headOfDepartmentId"
                            defaultValue={department.headOfDepartmentId || ''}
                            className="w-full p-4 border border-neutral-200 focus:outline-none focus:border-[#9c27b3] transition-colors appearance-none bg-white"
                        >
                            <option value="">To be appointed</option>
                            {facultyMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                        Featured Image
                    </label>
                    <div className="border-2 border-dashed border-neutral-200 p-8 text-center space-y-4 relative min-h-[200px] flex items-center justify-center">
                        {previewImage ? (
                            <div className="aspect-[3/2] w-full relative group">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    unoptimized
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-[#9c27b3]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-sm font-bold">Change Image</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12">
                                <Upload className="mx-auto mb-4 text-neutral-400" size={48} weight="regular" />
                                <p className="text-neutral-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-neutral-400">Recommended: 1200x800px (3:2 ratio)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    defaultValue={department.description}
                    rows={6}
                    className="w-full p-4 border border-neutral-200 focus:outline-none focus:border-[#9c27b3] transition-colors"
                />
            </div>

            <div className="pt-8 border-t border-neutral-100">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto px-12 py-4 bg-[#9c27b3] text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-400"
                >
                    {isSaving ? (
                        <>Saving Changes...</>
                    ) : (
                        <>
                            <Save size={18} weight="bold" />
                            Save Department Details
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}


