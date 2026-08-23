'use client';

import { useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CaretRight, CircleNotch as Loader2 } from "@phosphor-icons/react/dist/ssr";
import { updateApplicationStep } from '@/app/portal/actions';
import { useRouter } from 'next/navigation';

const motivationSchema = z.object({
    statementOfPurpose: z.string().min(100, 'Please provide a more detailed statement (min 100 characters)'),
    languageProficiency: z.object({
        englishLevel: z.enum(['native', 'advanced', 'intermediate', 'basic']),
        testTaken: z.string().optional(),
        testScore: z.string().optional(),
    }),
    howDidYouHear: z.string().optional(),
});

type MotivationValues = z.infer<typeof motivationSchema>;

interface Props {
    applicationId: string;
    initialData?: any;
    onUpdate?: () => Promise<void>;
}

export default function MotivationForm({ applicationId, initialData, onUpdate }: Props) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const form = useForm<MotivationValues>({
        resolver: zodResolver(motivationSchema),
        defaultValues: initialData || {
            statementOfPurpose: '',
            languageProficiency: {
                englishLevel: 'intermediate',
                testTaken: '',
                testScore: '',
            },
            howDidYouHear: '',
        }
    });

    const onSubmit = async (data: MotivationValues) => {
        setIsSaving(true);
        try {
            await updateApplicationStep(applicationId, 'motivation', data);
            if (onUpdate) await onUpdate();
            router.push(`?id=${applicationId}&step=6`);
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
                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Motivation Letter / Statement of Purpose <span className="text-red-500">*</span></label>
                    <p className="text-[13px] text-[#2d2d2d] mb-2 leading-relaxed">
                        Tell us why you want to study at Cannoga College and why you are a good fit for this programme.
                    </p>
                    <textarea
                        {...form.register('statementOfPurpose')}
                        rows={6}
                        className="w-full px-3 py-2 bg-white border border-neutral-100 rounded-sm text-sm focus:ring-1 focus:ring-black outline-none font-medium leading-relaxed"
                        placeholder="Type your statement here..."
                    />
                    {form.formState.errors.statementOfPurpose && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.statementOfPurpose.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-[13px] font-semibold text-black mb-1">English Proficiency</label>
                        <select
                            {...form.register('languageProficiency.englishLevel')}
                            className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                        >
                            <option value="native">Native / Bilingual</option>
                            <option value="advanced">Advanced (C1/C2)</option>
                            <option value="intermediate">Intermediate (B1/B2)</option>
                            <option value="basic">Basic (A1/A2)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-black mb-1">Test (e.g. IELTS)</label>
                        <input
                            {...form.register('languageProficiency.testTaken')}
                            className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-black mb-1">Score</label>
                        <input
                            {...form.register('languageProficiency.testScore')}
                            className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold text-black mb-1">How did you hear?</label>
                        <input
                            {...form.register('howDidYouHear')}
                            className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                            placeholder="Optional"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                    <Link
                        href={`?id=${applicationId}&step=4`}
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
                                await updateApplicationStep(applicationId, 'motivation', data);
                                router.push('/portal/dashboard/');
                            } catch (error) {
                                console.error('Failed to save:', error);
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        className="text-black hover:text-primary font-semibold text-[13px] transition-colors"
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
                            <CaretRight size={16} weight="bold" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

