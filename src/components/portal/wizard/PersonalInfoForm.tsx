'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CaretRight as ChevronRight } from "@phosphor-icons/react";
import { ProgressIndicator } from "@aalto-dx/react-components";
import { updateApplicationStep } from '@/app/portal/actions';
import { useRouter } from 'next/navigation';
import { nationalities } from '@/utils/nationalities';
import DateSelector from '@/components/ui/DateSelector';
import { Controller } from 'react-hook-form';

const personalInfoSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    middleName: z.string().optional(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(2, 'Nationality is required'),
    passportNumber: z.string().min(5, 'Passport number is required'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
    studentType: z.enum(['domestic', 'international'], { message: 'Please select student type' }),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

interface Props {
    applicationId: string;
    initialData?: any;
    onUpdate?: () => Promise<void>;
}

export default function PersonalInfoForm({ applicationId, initialData, onUpdate }: Props) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            middleName: '',
            dateOfBirth: '',
            nationality: '',
            passportNumber: '',
            gender: undefined,
            studentType: 'international',
        }
    });

    const onSubmit = async (data: PersonalInfoValues) => {
        setIsSaving(true);
        try {
            await updateApplicationStep(applicationId, 'personal', data);
            if (onUpdate) await onUpdate(); // Refresh parent state
            router.push(`?id=${applicationId}&step=3`);
            router.refresh();
            // In a real wizard, we might navigate to next step or update local state
            // For now, refresh keeps us on same page but implementation plan says we switch components based on status.
            // Since we don't have step switching logic fully in page.tsx yet, this just saves.
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save progress. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-neutral-100 rounded-sm">
                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">First Name <span className="text-red-500">*</span></label>
                    <input
                        {...form.register('firstName')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.firstName && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Middle Name <span className="text-neutral-400 font-normal">(optional)</span></label>
                    <input
                        {...form.register('middleName')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input
                        {...form.register('lastName')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.lastName && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                </div>

                <div>
                    <Controller
                        name="dateOfBirth"
                        control={form.control}
                        render={({ field }) => (
                            <DateSelector
                                label="Date of Birth"
                                name={field.name}
                                value={field.value}
                                required
                                onChange={(name, value) => field.onChange(value)}
                            />
                        )}
                    />
                    {form.formState.errors.dateOfBirth && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.dateOfBirth.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Gender <span className="text-red-500">*</span></label>
                    <select
                        {...form.register('gender')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {form.formState.errors.gender && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.gender.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Nationality <span className="text-red-500">*</span></label>
                    <select
                        {...form.register('nationality')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select Nationality</option>
                        {nationalities.map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    {form.formState.errors.nationality && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.nationality.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Student Type <span className="text-red-500">*</span></label>
                    <select
                        {...form.register('studentType')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    >
                        <option value="">Select Student Type</option>
                        <option value="domestic">Domestic Student</option>
                        <option value="international">International Student</option>
                    </select>
                    {form.formState.errors.studentType && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.studentType.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-[13px] font-semibold text-black mb-1">Passport Number <span className="text-red-500">*</span></label>
                    <input
                        {...form.register('passportNumber')}
                        className="w-full px-3 py-1.5 bg-neutral-50 rounded text-sm focus:ring-1 focus:ring-black outline-none font-medium"
                    />
                    {form.formState.errors.passportNumber && (
                        <p className="text-red-500 text-xs font-semibold mt-1">{form.formState.errors.passportNumber.message}</p>
                    )}
                </div>
            </div>



            <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                <button
                    type="button"
                    onClick={async () => {
                        const data = form.getValues();
                        setIsSaving(true);
                        try {
                            await updateApplicationStep(applicationId, 'personal', data);
                            router.push('/portal/dashboard');
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

                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-[#9c27b3] text-white px-8 py-4 rounded-sm text-[13px] font-black hover:bg-neutral-800 transition-all disabled:opacity-50 min-w-[200px]"
                >
                    {isSaving ? (
                        <>
                            <ProgressIndicator size={16} variant="white" />
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

