'use client';

import { useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateApplicationStep } from '@/app/portal/actions';
import { CircleNotch as Loader2, Plus, Trash, CaretRight as ChevronRight } from "@phosphor-icons/react";
import { useRouter } from 'next/navigation';

const educationEntrySchema = z.object({
    institution: z.string().min(2, 'Institution is required'),
    degree: z.string().min(2, 'Degree name is required'),
    startYear: z.string().min(4, 'Start year is required'),
    endYear: z.string().min(4, 'End year is required'),
    grade: z.string().optional(),
});

const academicHistorySchema = z.object({
    education: z.array(educationEntrySchema).min(1, 'Please add at least one previous education entry'),
});

type AcademicHistoryValues = z.infer<typeof academicHistorySchema>;

interface Props {
    applicationId: string;
    initialData?: any;
    onUpdate?: () => Promise<void>;
}

export default function AcademicHistoryForm({ applicationId, initialData, onUpdate }: Props) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const form = useForm<AcademicHistoryValues>({
        resolver: zodResolver(academicHistorySchema),
        defaultValues: initialData || {
            education: [{ institution: '', degree: '', startYear: '', endYear: '', grade: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "education"
    });

    const onSubmit = async (data: AcademicHistoryValues) => {
        setIsSaving(true);
        try {
            await updateApplicationStep(applicationId, 'academic', data);
            if (onUpdate) await onUpdate();
            router.push(`?id=${applicationId}&step=5`);
            router.refresh();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-6 bg-white border border-neutral-100 rounded-sm space-y-6 relative group">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash size={16} weight="regular" />
                            </button>
                        )}
                        <h3 className="text-[13px] font-semibold text-black mb-4">
                            Education Entry #{index + 1}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[13px] font-semibold text-black mb-1">Institution Name <span className="text-red-500">*</span></label>
                                <input
                                    {...form.register(`education.${index}.institution`)}
                                    className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                                    placeholder="e.g. Cannoga College"
                                />
                                {form.formState.errors.education?.[index]?.institution && (
                                    <p className="text-red-500 text-xs font-bold mt-1">{form.formState.errors.education[index]?.institution?.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[13px] font-semibold text-black mb-1">Degree / Qualification <span className="text-red-500">*</span></label>
                                <input
                                    {...form.register(`education.${index}.degree`)}
                                    className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                                    placeholder="e.g. Bachelor of Science"
                                />
                                {form.formState.errors.education?.[index]?.degree && (
                                    <p className="text-red-500 text-xs font-bold mt-1">{form.formState.errors.education[index]?.degree?.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-black mb-1">Start Year <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    {...form.register(`education.${index}.startYear`)}
                                    className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                                    placeholder="YYYY"
                                />
                                {form.formState.errors.education?.[index]?.startYear && (
                                    <p className="text-red-500 text-xs font-bold mt-1">{form.formState.errors.education[index]?.startYear?.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-black mb-1">End Year <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    {...form.register(`education.${index}.endYear`)}
                                    className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                                    placeholder="YYYY"
                                />
                                {form.formState.errors.education?.[index]?.endYear && (
                                    <p className="text-red-500 text-xs font-bold mt-1">{form.formState.errors.education[index]?.endYear?.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[13px] font-semibold text-black mb-1">GPA / Grade <span className="text-red-500">*</span></label>
                                <input
                                    {...form.register(`education.${index}.grade`)}
                                    className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => append({ institution: '', degree: '', startYear: '', endYear: '', grade: '' })}
                className="w-fit px-8 py-4 border-2 border-dashed border-neutral-100 rounded-sm text-black font-semibold text-[11px] hover:border-[#0a151a] hover:text-black transition-all flex items-center justify-center gap-2 group"
            >
                <Plus size={14} weight="bold" className="group-hover:rotate-90 transition-transform" />
                Add another qualification
            </button>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`?id=${applicationId}&step=3`}
                        className="text-black hover:text-black font-semibold text-[13px] transition-colors"
                    >
                        Back
                    </Link>
                    <button
                        type="button"
                        onClick={async () => {
                            const data = form.getValues();
                            setIsSaving(true);
                            try {
                                await updateApplicationStep(applicationId, 'education', data);
                                router.push('/portal/dashboard/');
                            } catch (error) {
                                console.error('Failed to save:', error);
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        className="text-black hover:text-black font-semibold text-[13px] transition-colors"
                    >
                        Save & Exit
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-[#0a151a] text-white px-8 py-4 rounded-sm text-[13px] font-black hover:bg-neutral-800 transition-all disabled:opacity-50 min-w-[200px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="animate-spin" size={16} weight="bold" />
                            Saving...
                        </>
                    ) : (
                        <>
                            Continue
                            <ChevronRight size={16} weight="bold" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

