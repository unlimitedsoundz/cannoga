'use client';

import React, { useState } from 'react';
import { Trophy as Award, Info, Percent, CheckCircle as CheckCircle2 } from "@phosphor-icons/react/dist/ssr";
import { createAdmissionOffer } from './actions';
import {
    calculateTuitionDeposit,
    TuitionField
} from '@/utils/tuition';
import { DegreeLevel } from '@/types/database';

interface FinancialOfferFormProps {
    applicationId: string;
    baseTuition: number;
    programYears: number;
    degreeLevel?: DegreeLevel;
    tuitionField?: TuitionField;
    onSuccess?: () => void;
    isDomestic?: boolean;
}

export function FinancialOfferForm({ applicationId, baseTuition, programYears, degreeLevel, tuitionField = 'TECHNOLOGY', onSuccess, isDomestic = false }: FinancialOfferFormProps) {
    const [offerType, setOfferType] = useState<'DEPOSIT' | '1ST_YEAR' | 'FULL_PROGRAM'>('1ST_YEAR');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Calculations
    const isDeposit = offerType === 'DEPOSIT';
    const fullProgramBase = baseTuition * programYears;
    
    let currentBase = baseTuition;
    if (offerType === 'FULL_PROGRAM') currentBase = fullProgramBase;
    
    let offerFee: number;
    let depositAmountForView = 0;

    if (isDeposit) {
        offerFee = calculateTuitionDeposit(baseTuition, tuitionField, false, degreeLevel, isDomestic);
    } else if (offerType === 'FULL_PROGRAM') {
        offerFee = fullProgramBase;
    } else {
        offerFee = baseTuition;
    }

    const displayDeposit = calculateTuitionDeposit(baseTuition, tuitionField, !isDeposit, degreeLevel, isDomestic);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const deadline = formData.get('deadline') as string;

        setIsSubmitting(true);
        try {
            // Map internal types to DB tags
            let mappedOfferType = 'DEPOSIT';
            if (offerType === '1ST_YEAR') mappedOfferType = '1ST_YEAR_FULL';
            if (offerType === 'FULL_PROGRAM') mappedOfferType = 'FULL_TUITION';

            await createAdmissionOffer(applicationId, offerFee, deadline, mappedOfferType as any);
            setShowSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to issue financial offer');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-neutral-200">
                    <CheckCircle2 size={24} weight="bold" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest leading-none mb-2">Offer Issued</h3>
                    <p className="text-[10px] font-bold text-neutral-600 uppercase leading-relaxed">
                        Financial offer for ${offerFee.toLocaleString()} has been generated and student notification triggered.
                    </p>
                </div>
                <button
                    onClick={() => setShowSuccess(false)}
                    className="text-[10px] font-black text-neutral-700 uppercase tracking-widest hover:underline"
                >
                    Issue Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
                <button
                    type="button"
                    onClick={() => setOfferType('DEPOSIT')}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${offerType === 'DEPOSIT' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                >
                    Deposit
                </button>
                <button
                    type="button"
                    onClick={() => setOfferType('1ST_YEAR')}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${offerType === '1ST_YEAR' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                >
                    1st Year Full
                </button>
                <button
                    type="button"
                    onClick={() => setOfferType('FULL_PROGRAM')}
                     className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tight rounded-lg transition-all ${offerType === 'FULL_PROGRAM' ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-200' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                >
                    Full Programme
                </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-neutral-400">
                        {offerType === 'FULL_PROGRAM' ? `Full ${programYears} Years` : (offerType === 'DEPOSIT' ? 'Tuition Deposit' : '1st Year Full Tuition')}
                    </span>
                    <div className="text-right">
                        <span className="text-xl font-black text-neutral-900 leading-none">${offerFee.toLocaleString()}</span>
                    </div>
                </div>

                {isDeposit && (
                    <div className="flex items-center gap-2 p-2 bg-neutral-100 rounded-xl border border-neutral-200">
                        <div className="w-6 h-6 bg-neutral-400 rounded-lg flex items-center justify-center text-white">
                            <Award size={12} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase leading-none mb-0.5">Manual Deposit Amount</p>
                            <p className="text-[8px] font-bold text-neutral-400 uppercase">Fixed deposit to secure place</p>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div className="w-6 h-6 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                        $
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-900 uppercase leading-none mb-0.5">Required Deposit</p>
                        <p className="text-[8px] font-bold text-neutral-400 uppercase">${displayDeposit.toLocaleString()} CAD</p>
                    </div>
                </div>

                {offerType === '1ST_YEAR' && programYears > 1 && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Info size={12} weight="bold" />
                        </div>
                        <p className="text-[8px] font-bold text-blue-700 uppercase leading-tight">
                            Covers initial year. Remaining {programYears - 1} years due at start of each term.
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-[9px] font-black uppercase text-neutral-400 mb-1 leading-none">Payment Deadline</label>
                <input
                    name="deadline"
                    type="date"
                    required
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-neutral-500 transition-all shadow-inner"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neutral-600 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-700 transition-all shadow-lg hover:shadow-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Issuing...' : 'Issue Financial Offer'}
            </button>
        </form>
    );
}
