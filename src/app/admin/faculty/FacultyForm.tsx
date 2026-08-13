'use client';

import { createClient } from '@/utils/supabase/client';
import { uploadToHosting } from '@/utils/hostingUpload';
import { FloppyDisk as Save, User, Envelope as Mail, Briefcase, Info, Buildings as SchoolIcon, UploadSimple as Upload } from "@phosphor-icons/react/dist/ssr";
import { useState } from 'react';

interface FacultyFormProps {
    id: string;
    isNew: boolean;
    facultyMember: any;
    schools: { id: string; name: string }[];
    departments: { id: string; name: string; schoolId: string; headOfDepartmentId?: string | null }[];
}

export default function FacultyForm({ id, isNew, facultyMember, schools, departments }: FacultyFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(facultyMember?.departmentId || '');
    const [previewImage, setPreviewImage] = useState<string | null>(facultyMember?.imageUrl || null);

    // Head of Department state
    const initialIsHead = !isNew && id && departments.find(d => d.id === facultyMember?.departmentId)?.headOfDepartmentId === id;
    const [isHeadOfDept, setIsHeadOfDept] = useState(initialIsHead || false);

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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        try {
            const facultyData: any = {
                name: formData.get('name') as string,
                role: formData.get('role') as string,
                bio: formData.get('bio') as string,
                email: formData.get('email') as string,
                schoolId: formData.get('schoolId') as string,
                departmentId: (formData.get('departmentId') as string) || null,
            };

            // Handle Image Upload (Hostinger PHP)
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                const imageUrl = await uploadToHosting(imageFile);
                if (imageUrl) {
                    facultyData.imageUrl = imageUrl;
                }
            }

            let facultyId = id;
            if (isNew) {
                const { data, error } = await supabase.from('Faculty').insert(facultyData).select().single();
                if (error) throw error;
                facultyId = data.id;
            } else {
                const { error } = await supabase.from('Faculty').update(facultyData).eq('id', id);
                if (error) throw error;
            }

            // Head of Department Logic
            const isHeadOfDepartment = formData.get('isHeadOfDepartment') === 'on';
            const deptId = facultyData.departmentId;

            if (facultyId) {
                // Remove from all existing headships
                await supabase.from('Department')
                    .update({ headOfDepartmentId: null })
                    .eq('headOfDepartmentId', facultyId);

                if (isHeadOfDepartment && deptId) {
                    const { error: deptError } = await supabase.from('Department')
                        .update({ headOfDepartmentId: facultyId })
                        .eq('id', deptId);
                    if (deptError) console.error("Failed to update Department Head:", deptError);
                }
            }

            window.location.href = '/admin/faculty';
        } catch (error: any) {
            console.error('Error submitting form:', error);
            alert(`Failed to save: ${error.message}`);
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-neutral-900 font-bold uppercase text-xs tracking-widest border-b border-neutral-100 pb-2">
                            <User size={14} weight="bold" /> Basic Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Image Upload Column */}
                            <div className="md:row-span-2">
                                <label className="text-sm font-bold text-neutral-600 mb-2 block">Profile Photo</label>
                                <div className="relative group aspect-square rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload size={32} weight="regular" className="text-neutral-300 mx-auto mb-2" />
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Upload Photo</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="absolute inset-0 bg-[#0a151a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600">Full Name</label>
                                    <input
                                        name="name"
                                        defaultValue={facultyMember?.name || ''}
                                        required
                                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="e.g. Prof. Jane Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600">Email Address</label>
                                    <div className="relative">
                                        <Mail size={18} weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={facultyMember?.email || ''}
                                            required
                                            className="w-full p-4 pl-12 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="jane.doe@cannogacollege.ca"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600">Professional Role</label>
                                    <div className="relative">
                                        <Briefcase size={18} weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            name="role"
                                            defaultValue={facultyMember?.role || ''}
                                            required
                                            className="w-full p-4 pl-12 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="e.g. Head of Architecture"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600">School</label>
                                    <div className="relative">
                                        <SchoolIcon size={18} weight="regular" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <select
                                            name="schoolId"
                                            defaultValue={facultyMember?.schoolId || schools?.[0]?.id}
                                            className="w-full p-4 pl-12 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none appearance-none"
                                        >
                                            {schools?.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Media & Details */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-2 text-neutral-900 font-bold uppercase text-xs tracking-widest border-b border-neutral-100 pb-2">
                                <Info size={14} weight="bold" /> Media & Biography
                            </div>

                            {/* Bio */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600 flex items-center gap-2">
                                        Biography <Info size={14} weight="regular" className="text-neutral-300" />
                                    </label>
                                    <textarea
                                        name="bio"
                                        defaultValue={facultyMember?.bio || ''}
                                        rows={8}
                                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all resize-none"
                                        placeholder="Tell us about this person's background and achievements..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-neutral-600">Department (Optional)</label>
                                    <div className="space-y-3">
                                        <select
                                            name="departmentId"
                                            value={selectedDepartmentId}
                                            onChange={(e) => {
                                                const newDeptId = e.target.value;
                                                setSelectedDepartmentId(newDeptId);
                                                // If switching items, reset HOD unless we match existing
                                                const dept = departments.find(d => d.id === newDeptId);
                                                if (!isNew && id && dept?.headOfDepartmentId === id) {
                                                    setIsHeadOfDept(true);
                                                } else {
                                                    setIsHeadOfDept(false);
                                                }
                                            }}
                                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none appearance-none"
                                        >
                                            <option value="">None / Administrative</option>
                                            {departments?.map(d => (
                                                <option key={d.id} value={d.id}>{d.name} ({schools?.find(s => s.id === d.schoolId)?.name})</option>
                                            ))}
                                        </select>

                                        <div className={`p-4 rounded-xl border transition-all duration-300 ${isHeadOfDept ? 'bg-amber-50 border-amber-200' : 'bg-white border-neutral-100'}`}>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="isHeadOfDepartment"
                                                    disabled={!selectedDepartmentId}
                                                    checked={isHeadOfDept}
                                                    onChange={(e) => setIsHeadOfDept(e.target.checked)}
                                                    className="mt-1 w-5 h-5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500 border-2"
                                                />
                                                <div className={!selectedDepartmentId ? 'opacity-50' : ''}>
                                                    <span className="block font-bold text-sm text-neutral-900">Assign as Head of Department</span>
                                                    <span className="block text-xs text-neutral-500 mt-1">
                                                        {selectedDepartmentId
                                                            ? isHeadOfDept
                                                                ? "This person will be displayed as the Department Head."
                                                                : "Check this to set them as the leader appearing on School pages."
                                                            : "Select a department first to assign leadership."}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 p-8 flex justify-between items-center">
                    <div className="text-white/40 text-xs font-mono uppercase tracking-widest">
                        {isNew ? 'New Entry' : `Editing ID: ${id.slice(0, 8)}...`}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-neutral-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} weight="bold" />
                        {isSubmitting ? 'SAVING...' : (isNew ? 'CREATE MEMBER' : 'SAVE CHANGES')}
                    </button>
                </div>
            </div>
        </form>
    );
}


