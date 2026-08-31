'use client';

import { createClient } from '@/utils/supabase/client';
import { uploadToHosting } from '@/utils/hostingUpload';
import { FloppyDisk as Save, Image as ImageIcon, Calendar, MapPin, Tag } from "@phosphor-icons/react/dist/ssr";
import { useState } from 'react';
import Image from 'next/image';

interface EventFormProps {
    id: string;
    isNew: boolean;
    eventItem: any;
}

export default function EventForm({ id, isNew, eventItem }: EventFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(eventItem?.imageUrl || null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const supabase = createClient();

        try {
            const eventData: any = {
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                category: formData.get('category') as string,
                date: formData.get('date') as string,
                location: formData.get('location') as string,
                content: formData.get('content') as string,
                published: true,
                updatedAt: new Date().toISOString()
            };

            // Handle Image Upload (Hostinger PHP)
            const imageFile = formData.get('image') as File;
            if (imageFile && imageFile.size > 0) {
                const imageUrl = await uploadToHosting(imageFile);
                if (imageUrl) {
                    eventData.imageUrl = imageUrl;
                }
            }

            if (isNew) {
                const { error } = await supabase.from('Event').insert(eventData);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('Event').update(eventData).eq('id', id);
                if (error) throw error;
            }

            // Success! Redirect to list
            window.location.href = '/admin/events';
        } catch (error: any) {
            console.error('Error submitting form:', error);
            alert(`Failed to save: ${error.message}`);
            setIsSubmitting(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
            <div className="p-8 space-y-8">
                {/* Image Upload Selection */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-600 flex items-center gap-1">
                        <ImageIcon size={14} /> Event Cover Image
                    </label>
                    <div className="flex items-start gap-4">
                        {previewImage && (
                            <div className="w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0 relative">
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover object-top"
                                    unoptimized
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-neutral-100 file:text-black hover:file:bg-neutral-200 cursor-pointer border border-neutral-200 rounded-lg p-1"
                            />
                            <p className="text-[10px] text-neutral-400 mt-2 italic">Recommended size: 1200x630px. Max 5MB.</p>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600">Event Title</label>
                        <input
                            name="title"
                            defaultValue={eventItem?.title || ''}
                            required
                            className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-xl font-bold"
                            placeholder="e.g. Advanced Diploma Programme Virtual Open Day"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600">URL Slug</label>
                        <input
                            name="slug"
                            defaultValue={eventItem?.slug || ''}
                            required
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            placeholder="virtual-open-day-2026"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><Tag size={14} weight="bold" /> Category</label>
                        <select
                            name="category"
                            defaultValue={eventItem?.category || 'General'}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                        >
                            <option value="General">General</option>
                            <option value="Admissions">Admissions</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><Calendar size={14} weight="bold" /> Event Date & Time</label>
                        <input
                            name="date"
                            type="datetime-local"
                            required
                            defaultValue={eventItem?.date ? new Date(eventItem.date).toISOString().slice(0, 16) : ''}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-neutral-600 flex items-center gap-1"><MapPin size={14} weight="bold" /> Location</label>
                        <input
                            name="location"
                            defaultValue={eventItem?.location || ''}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
                            placeholder="e.g. Online (Zoom) or Main Campus, Room 102"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-600">Event Description</label>
                    <textarea
                        name="content"
                        defaultValue={eventItem?.content || ''}
                        rows={10}
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl outline-none resize-none font-sans"
                        placeholder="Provide details about the event, agenda, speakers, etc."
                    />
                </div>
            </div>

            <div className="bg-neutral-50 p-6 border-t border-neutral-200 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0a151a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} weight="bold" /> {isSubmitting ? 'Saving...' : (isNew ? 'Create Event' : 'Save Changes')}
                </button>
            </div>
        </form>
    );
}


