'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
    ArrowRight,
    ArrowLeft,
    Building as Building2,
    Wallet,
    ShieldCheck,
    Info,
    CheckCircle as CheckCircle2,
    Clock,
    Copy,
    CaretDown,
    ArrowSquareOut,
    Spinner,
    Warning,
    FileText,
} from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import type { InstitutionalBankAccount, InstitutionalExchangeRate } from '@/types/payments';
import { countries as allWorldCountries } from '@/utils/countries';

// ─── Props & Types ───────────────────────────────────────────────────────────
interface PayGoWireCheckoutProps {
    amount: number;
    currency: string;
    offerId?: string;
    applicationId?: string;
    invoiceType?: string;
    onPaymentComplete: (paymentData: any) => Promise<void>;
    isProcessing?: boolean;
    paymentReference?: string;
}

type Step = 'COUNTRY' | 'METHOD' | 'FX' | 'BANK_INSTRUCTIONS' | 'PROOF' | 'SUBMITTED';

// ─── Copy Button ─────────────────────────────────────────────────────────────
const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            type="button"
            onClick={handleCopy}
            title={`Copy ${label}`}
            className="inline-flex items-center gap-1 text-[11px] font-normal text-[#147BD1] hover:text-[#1a3399] transition-colors ml-1 px-1.5 py-0.5 rounded-sm hover:bg-blue-50"
        >
            {copied ? (
                <><CheckCircle2 size={11} className="text-green-600" /><span className="text-green-600">Copied</span></>
            ) : (
                <><Copy size={11} /><span>Copy</span></>
            )}
        </button>
    );
};

// ─── Bank Detail Row ─────────────────────────────────────────────────────────
const BankRow = ({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-neutral-200/60 last:border-b-0 gap-3">
        <span className="text-[12px] text-neutral-500 font-normal uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5 justify-end">
            <span className="text-xs md:text-sm text-neutral-900 font-normal text-right break-all">{value}</span>
            {copyable && <CopyButton text={value} label={label} />}
        </div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PayGoWireCheckout({
    amount,
    currency: defaultCurrency,
    offerId,
    applicationId,
    invoiceType,
    onPaymentComplete,
    isProcessing,
    paymentReference,
}: PayGoWireCheckoutProps) {
    const [step, setStep] = useState<Step>('COUNTRY');
    const [loadingStep, setLoadingStep] = useState<string | null>(null);

    // DB-driven state
    const [countries, setCountries] = useState<InstitutionalBankAccount[]>([]);
    const [rateMap, setRateMap] = useState<Record<string, InstitutionalExchangeRate>>({});
    const [loadingData, setLoadingData] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // Selection state
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<InstitutionalBankAccount | null>(null);
    const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
    const [countrySearch, setCountrySearch] = useState<string>('');

    // Initialized payment state
    const [initPayload, setInitPayload] = useState<{
        paymentId: string;
        trackingRef: string;
        localAmount: number;
        localCurrency: string;
        exchangeRate: number;
        expiresAt: string;
    } | null>(null);

    // Proof submission state
    const [bankRef, setBankRef] = useState('');
    const [submittingProof, setSubmittingProof] = useState(false);
    const [proofError, setProofError] = useState<string | null>(null);

    // ── Fetch countries & rates from DB on mount ──
    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            setDataError(null);
            try {
                const [countriesRes, ratesRes] = await Promise.all([
                    fetch('/api/payments/countries'),
                    fetch('/api/payments/rates'),
                ]);
                if (!countriesRes.ok || !ratesRes.ok) throw new Error('Failed to load payment configuration');
                const { countries: countryData } = await countriesRes.json();
                const { rateMap: rates } = await ratesRes.json();
                setCountries(countryData ?? []);
                setRateMap(rates ?? {});
            } catch (err: any) {
                setDataError('Could not load payment options. Please refresh and try again.');
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // ── Full Unified Countries List (Strictly Deduplicated) ──
    const fullCountryList = useMemo(() => {
        const list: { country_code: string; country_name: string; country_flag: string }[] = [];
        const seenNames = new Set<string>();

        const normalize = (str: string) => str.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

        // 1. Prioritize dedicated DB accounts first (e.g. Nigeria, Ghana, Canada, UK, US)
        countries.forEach(c => {
            const normName = normalize(c.country_name);
            if (!seenNames.has(normName)) {
                seenNames.add(normName);
                list.push({
                    country_code: c.country_code,
                    country_name: c.country_name,
                    country_flag: c.country_flag ?? '🌐',
                });
            }
        });

        // 2. Add remaining world countries only if not already present
        allWorldCountries.forEach(w => {
            const normName = normalize(w.name);
            if (!seenNames.has(normName)) {
                seenNames.add(normName);
                list.push({
                    country_code: w.name,
                    country_name: w.name,
                    country_flag: w.flag,
                });
            }
        });

        // Sort alphabetically
        return list.sort((a, b) => a.country_name.localeCompare(b.country_name));
    }, [countries]);

    // ── Filtered country list based on search term ──
    const filteredCountryList = useMemo(() => {
        if (!countrySearch.trim()) return fullCountryList;
        const q = countrySearch.toLowerCase().trim();
        return fullCountryList.filter(c => c.country_name.toLowerCase().includes(q) || c.country_code.toLowerCase().includes(q));
    }, [fullCountryList, countrySearch]);

    // ── Derived FX data from DB rates ──
    const fxData = useMemo(() => {
        if (!selectedBank) return null;
        const currency = selectedBank.currency || 'USD';
        const rate = rateMap[currency] ? Number(rateMap[currency].rate_multiplier) : 1;
        let localAmount = parseFloat((amount * rate).toFixed(2));
        // CAD wire has a $25 processing fee
        if (currency === 'CAD' && selectedBank.country_code === 'CA') {
            localAmount = parseFloat((amount + 25).toFixed(2));
        }
        return {
            localAmount: localAmount.toFixed(2),
            localCurrency: currency,
            currencySymbol: selectedBank.currency_symbol || '$',
            rate,
            lockHours: rateMap[currency]?.lock_duration_hours ?? 48,
        };
    }, [selectedBank, rateMap, amount]);

    // ── Expiry string ──
    const expiryString = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(22, 59, 0, 0);
        return d.toISOString().slice(0, 16).replace('T', ' ');
    }, []);

    // ── Step navigation helpers ──
    const handleStepChange = (nextStep: Step) => {
        setLoadingStep(step);
        setTimeout(() => { setStep(nextStep); setLoadingStep(null); }, 600);
    };

    // ── Progress ──
    const progress = useMemo(() => {
        const map: Record<Step, number> = {
            COUNTRY: 20, METHOD: 40, FX: 60, BANK_INSTRUCTIONS: 80, PROOF: 95, SUBMITTED: 100,
        };
        return map[step] ?? 20;
    }, [step]);

    // ── Initialize payment on the server when student clicks "Proceed to Transfer" ──
    const handleInitialize = useCallback(async () => {
        if (!selectedBank || !fxData) return;
        setLoadingStep('BANK_INSTRUCTIONS');
        try {
            const res = await fetch('/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offerId,
                    applicationId,
                    countryCode: selectedBank.country_code,
                    currency: selectedBank.currency,
                    cadAmount: amount,
                    localAmount: Number(fxData.localAmount),
                    exchangeRate: fxData.rate,
                    paymentMethod: 'direct_bank_wire',
                    invoiceType: invoiceType ?? 'TUITION_DEPOSIT',
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed to initialize payment');
            setInitPayload({
                paymentId: data.paymentId,
                trackingRef: data.trackingRef,
                localAmount: data.localAmount,
                localCurrency: data.localCurrency,
                exchangeRate: data.exchangeRate,
                expiresAt: data.expiresAt,
            });
            setStep('BANK_INSTRUCTIONS');
        } catch (err: any) {
            alert(err.message ?? 'Could not initialize payment. Please try again.');
        } finally {
            setLoadingStep(null);
        }
    }, [selectedBank, fxData, offerId, applicationId, amount, invoiceType]);

    // ── Submit proof ──
    const handleSubmitProof = async () => {
        if (!initPayload || !bankRef.trim()) return;
        setSubmittingProof(true);
        setProofError(null);
        try {
            const res = await fetch('/api/payments/submit-proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: initPayload.paymentId, bankRef: bankRef.trim() }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed to submit proof');
            setStep('SUBMITTED');
            await onPaymentComplete({
                method: 'direct_bank_wire',
                country: selectedBank?.country_name ?? '',
                currency: initPayload.localCurrency,
                trackingRef: initPayload.trackingRef,
                fxMetadata: {
                    rate: initPayload.exchangeRate,
                    originalAmount: amount,
                    localAmount: initPayload.localAmount,
                    localCurrency: initPayload.localCurrency,
                    trackingRef: initPayload.trackingRef,
                },
            });
        } catch (err: any) {
            setProofError(err.message ?? 'Could not submit. Please try again.');
        } finally {
            setSubmittingProof(false);
        }
    };

    // ── Loading / Error state for initial data fetch ──
    if (loadingData) {
        return (
            <div className="bg-white rounded-4px p-12 flex flex-col items-center gap-4">
                <Spinner size={24} className="animate-spin text-[#147BD1]" />
                <p className="text-sm text-neutral-500 font-normal">Loading payment options...</p>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="bg-white rounded-4px p-8 flex flex-col items-center gap-4 text-center">
                <Warning size={32} className="text-red-500" />
                <p className="text-sm text-red-600">{dataError}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#147BD1] text-white text-sm rounded-4px hover:bg-[#1a3399] transition-all">Retry</button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-4px overflow-hidden max-w-none md:max-w-2xl mx-auto font-rubik">

            {/* ── Step Header ── */}
            <div className="bg-neutral-50 py-3 px-4 flex justify-between items-center overflow-x-auto no-scrollbar gap-4">
                {[
                    { id: 'COUNTRY', label: 'Country' },
                    { id: 'FX', label: 'Review' },
                    { id: 'BANK_INSTRUCTIONS', label: 'Transfer' },
                    { id: 'PROOF', label: 'Confirm' },
                ].map((s, idx) => {
                    const isActive = step === s.id || (s.id === 'BANK_INSTRUCTIONS' && step === 'SUBMITTED');
                    const isDone = progress > (idx + 1) * 25;
                    return (
                        <div key={s.id} className={`flex items-center gap-1.5 whitespace-nowrap text-xs md:text-sm font-normal transition-colors duration-300 ${isActive ? 'text-[#147BD1]' : 'text-neutral-400'}`}>
                            <span className={`w-4 h-4 force-circle flex items-center justify-center text-[8px] border ${isActive ? 'border-[#147BD1] bg-[#147BD1] text-white' : isDone ? 'border-green-500 bg-green-500 text-white' : 'border-neutral-100'}`}>{isDone ? '✓' : idx + 1}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                            {idx < 3 && <ArrowRight size={10} className="text-neutral-300 ml-1" />}
                        </div>
                    );
                })}
            </div>

            {/* ── FX Summary Bar (visible after country selected) ── */}
            {fxData && step !== 'COUNTRY' && (
                <div className="bg-white px-4 py-3 flex items-center justify-between text-xs font-rubik animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="flex flex-col">
                        <span className="text-slate-500 font-normal mb-0.5">You send</span>
                        <span className="font-normal text-black text-sm md:text-base">
                            {fxData.currencySymbol} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fxData.localCurrency}
                        </span>
                    </div>
                    <div className="flex-grow flex items-center px-4 md:px-8">
                        <div className="flex-grow h-[1px] bg-neutral-50 relative">
                            <div className="absolute right-0 -top-[4px] w-2 h-2 border-t border-r border-neutral-100 rotate-45" />
                        </div>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-slate-500 font-normal mb-0.5">Cannoga College receives</span>
                        <span className="font-normal text-black text-sm md:text-base">CA$ {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            )}

            {/* ── Progress Bar ── */}
            <div className="h-1 w-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-[#147BD1] transition-all duration-700 ease-in-out" style={{ width: `${progress}%` }} />
            </div>

            <div className="p-3 md:p-8">

                {/* ══ STEP 1: COUNTRY ══ */}
                {step === 'COUNTRY' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-[22px] md:text-[24px] font-medium text-slate-900 mb-6">
                                {invoiceType === 'HOUSING_DEPOSIT' || invoiceType?.toLowerCase().includes('housing')
                                    ? 'Housing Deposit'
                                    : (invoiceType === 'TUITION_DEPOSIT' || invoiceType?.toLowerCase().includes('tuition'))
                                    ? 'Tuition Deposit'
                                    : (invoiceType?.replaceAll('_', ' ') || 'Your payment')}
                            </h2>
                            
                            {/* Section 1: Institution receives */}
                            <div className="space-y-2 mb-6">
                                <label className="text-xl md:text-lg font-normal text-gray-950 block">
                                    Cannoga College - Ontario, CA receives
                                </label>
                                
                                <div className="flex border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0066cc]/20 focus-within:border-[#0066cc] transition-all bg-white shadow-2xs">
                                    <div className="bg-slate-50 text-slate-700 px-4 py-2.5 font-bold text-sm flex items-center justify-center min-w-[54px]">
                                        C$
                                    </div>
                                    <div className="flex-1 px-3 py-1.5 flex flex-col justify-center">
                                        <span className="text-[10px] font-medium text-slate-400 leading-none mb-0.5">Amount *</span>
                                        <span className="text-sm md:text-base font-normal text-slate-900 leading-none">
                                            {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[12px] font-medium text-gray-700 mt-0.5 block leading-relaxed" style={{ fontSize: '12px' }}>
                                    Amount will be formatted in the destination currency, in this case Canadian Dollars, i.e. 10,000.00 for ten thousand CAD.
                                </p>
                            </div>

                            {/* Section 2: Country origin */}
                            <div className="space-y-2">
                                <label className="text-xl md:text-lg font-normal text-gray-950 block">
                                    The payment will come from
                                </label>
                                
                                <div className="relative flex border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0066cc]/20 focus-within:border-[#0066cc] transition-all bg-white shadow-2xs">
                                    <div className="flex-1 px-3 py-1.5 flex flex-col justify-center">
                                        <span className="text-[10px] font-medium text-slate-400 leading-none mb-0.5">Country or region *</span>
                                        <select
                                            id="country-select"
                                            className="country-select w-full bg-transparent font-normal text-sm md:text-base text-slate-900 cursor-pointer pr-8 leading-none focus:outline-none border-none outline-none shadow-none"
                                            value={selectedCountryCode}
                                            onChange={(e) => {
                                                const code = e.target.value;
                                                setSelectedCountryCode(code);
                                                const directBank = countries.find(b => b.country_code === code || b.country_name.toLowerCase() === code.toLowerCase());
                                                if (directBank) {
                                                    setSelectedBank(directBank);
                                                } else {
                                                    const fallbackBank = countries.find(b => b.country_code === 'US' || b.country_code === 'CA') || countries[0];
                                                    if (fallbackBank) {
                                                        const countryObj = fullCountryList.find(c => c.country_code === code || c.country_name === code);
                                                        setSelectedBank({
                                                            ...fallbackBank,
                                                            country_name: countryObj?.country_name ?? code,
                                                            country_flag: countryObj?.country_flag ?? '🌐',
                                                        });
                                                    }
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Select your payment country or region...</option>
                                            {fullCountryList.map(c => (
                                                <option key={c.country_code} value={c.country_code}>
                                                    {c.country_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                        <CaretDown size={14} weight="bold" />
                                    </div>
                                </div>

                                <p className="text-[12px] font-medium text-gray-700 mt-0.5 block leading-relaxed" style={{ fontSize: '12px' }}>
                                    Choose where your bank account, card, or payment wallet is based. This helps us show available payment methods.
                                </p>
                            </div>
                        </div>

                        {/* Real-time FX / Payment Method Card */}
                        {selectedBank && fxData && (
                            <div className="border border-slate-200 rounded-md p-5 bg-white shadow-2xs space-y-4 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 relative shrink-0 flex items-center justify-center">
                                            <Image
                                                src="/images/bank-icon.png"
                                                alt="Bank Transfer Icon"
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 object-contain"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-normal text-slate-700 leading-tight mb-1">
                                                Online Bank Transfer in {selectedBank.country_name === 'Nigeria' ? 'Nigerian Naira (NGN)' : `${selectedBank.currency} (${selectedBank.currency})`}
                                            </p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-[22px] md:text-[24px] font-bold text-slate-950 tracking-tight">
                                                    {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-[18px] md:text-[20px] font-bold text-slate-950">
                                                    {fxData.currencySymbol}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={loadingStep === 'COUNTRY'}
                                        onClick={() => handleStepChange('FX')}
                                        className="h-[42px] px-8 bg-[#0066cc] hover:bg-[#0052a3] text-white rounded-md font-medium text-sm transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                                    >
                                        {loadingStep === 'COUNTRY' ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white force-circle animate-spin mr-2" />Processing...</>
                                        ) : (
                                            'Select'
                                        )}
                                    </button>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[12px] text-[#0066cc] font-medium cursor-pointer hover:underline">
                                    <Info size={14} weight="bold" />
                                    <span>Important info</span>
                                    <CaretDown size={12} weight="bold" />
                                </div>
                            </div>
                        )}

                        {/* Next Action Button */}
                        <button
                            disabled={!selectedBank || loadingStep === 'COUNTRY'}
                            onClick={() => handleStepChange('FX')}
                            className="w-full h-[48px] px-8 bg-[#0066cc] hover:bg-[#0052a3] text-white rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                        >
                            {loadingStep === 'COUNTRY' ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white force-circle animate-spin" />Processing...</>
                            ) : (
                                <>Next <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" /></>
                            )}
                        </button>
                    </div>
                )}

                {/* ══ STEP 2: FX REVIEW ══ */}
                {step === 'FX' && fxData && selectedBank && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button onClick={() => setStep('COUNTRY')} className="flex items-center gap-2 text-black text-sm font-normal uppercase tracking-widest transition-colors">
                            <ArrowLeft size={14} /> Back
                        </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Review Exchange Rate</h2>
                            <p className="text-sm text-black font-normal">Institutional rate locked for {fxData.lockHours} hours.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                <div>
                                    <p className="text-[10px] md:text-sm font-normal text-[#147BD1] uppercase tracking-widest mb-1">You Send ({fxData.localCurrency})</p>
                                    <p className="text-2xl md:text-3xl font-normal">{fxData.currencySymbol} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] md:text-sm font-normal text-black uppercase tracking-widest mb-1">Settlement (CAD)</p>
                                    <p className="text-xl md:text-2xl font-normal">CA$ {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-neutral-100">
                                <div className="flex justify-between text-xs md:text-sm font-normal">
                                    <span className="text-black">Exchange Rate</span>
                                    <span className="text-[#147BD1] font-normal">1 CAD = {fxData.rate} {fxData.localCurrency}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-normal">
                                    <span>Payment Bank</span>
                                    <span className="text-black text-right">{selectedBank.bank_name}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-normal">
                                    <span>Processing Time</span>
                                    <span className="text-black">{selectedBank.processing_time}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-normal">
                                    <span>Country</span>
                                    <span className="text-black">{selectedBank.country_flag} {selectedBank.country_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-100 p-3 md:p-4 rounded-4px flex gap-3">
                            <Info size={16} className="text-black shrink-0 mt-0.5" />
                            <p className="text-sm text-black leading-relaxed font-normal">
                                This rate is locked for {fxData.lockHours} hours from when you initialize the payment. By proceeding you confirm intent to pay from <span className="font-medium">{selectedBank.country_name}</span>.
                            </p>
                        </div>

                        <button
                            disabled={!!loadingStep}
                            onClick={handleInitialize}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loadingStep === 'BANK_INSTRUCTIONS' ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />Generating Reference...</>
                            ) : (
                                <>Proceed to Transfer Details<ArrowRight size={14} className="group-hover:translate-x-1 transition-all" /></>
                            )}
                        </button>
                    </div>
                )}

                {/* ══ STEP 3: BANK INSTRUCTIONS ══ */}
                {step === 'BANK_INSTRUCTIONS' && fxData && selectedBank && initPayload && (
                    <div className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 font-rubik">

                        <div className="text-center space-y-2">
                            <h2 className="text-[20px] font-normal text-black pt-1">
                                Transfer exactly <span className="text-black">{fxData.currencySymbol} {Number(initPayload.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {initPayload.localCurrency}</span>
                            </h2>
                            <p className="text-xs text-neutral-600 max-w-lg mx-auto">
                                Use the bank details below. Include your tracking reference in the narration/remarks field.
                            </p>
                        </div>

                        {/* Tracking Reference Badge */}
                        <div className="bg-[#147BD1] text-white rounded-xl p-4 shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest text-white/80 font-normal mb-0.5">Your Tracking Reference</p>
                            <p className="font-mono text-xl font-normal tracking-widest">{initPayload.trackingRef}</p>
                        </div>

                        {/* Dynamic Bank Details */}
                        <div className="bg-neutral-50 p-4 rounded-xl space-y-1 shadow-xs">
                            <BankRow label="Amount" value={`${fxData.currencySymbol} ${Number(initPayload.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${initPayload.localCurrency}`} copyable />
                            <BankRow label="Bank" value={selectedBank.bank_name} />
                            <BankRow label="Account Name" value={selectedBank.account_name} />
                            <BankRow label="Account Number" value={selectedBank.account_number} copyable />
                            <BankRow label="Account Type" value={selectedBank.account_type} />
                            {selectedBank.routing_or_sort_code && <BankRow label={selectedBank.country_code === 'GB' ? 'Sort Code' : selectedBank.country_code === 'CA' ? 'Transit/Routing' : 'ACH Routing'} value={selectedBank.routing_or_sort_code} copyable />}
                            {selectedBank.swift_bic && <BankRow label="SWIFT / BIC" value={selectedBank.swift_bic} copyable />}
                            {selectedBank.iban && <BankRow label="IBAN" value={selectedBank.iban} copyable />}
                            <BankRow label="Reference / Narration" value={initPayload.trackingRef} copyable />
                            <BankRow label="Processing Time" value={selectedBank.processing_time} />
                            {selectedBank.country_code === 'US' && <BankRow label="Wire Routing" value="021000021" copyable />}
                        </div>

                        {/* Transfer Instructions */}
                        {selectedBank.transfer_instructions && (
                            <div className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl shadow-xs">
                                {selectedBank.transfer_instructions}
                            </div>
                        )}

                        {/* Supporting Documents (Flywire Authorization Letters) */}
                        <div className="pt-2 space-y-2">
                            <p className="text-[11px] font-normal text-neutral-500 uppercase tracking-wider">Supporting Documents</p>
                            <p className="text-xs text-neutral-600">If your bank or financial institution requires authorization letters for wire processing:</p>
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-b-0">
                                    <span className="text-neutral-800 font-normal">Flywire Authorization Letter</span>
                                    <a
                                        href="/images/Cannoga%20College%20Flywire-Authorization-Letter.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-normal text-black hover:underline"
                                    >
                                        Download PDF <ArrowSquareOut size={12} />
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-b-0">
                                    <span className="text-neutral-800 font-normal">Nigerian Naira Authorization Letter</span>
                                    <a
                                        href="/images/Cannoga%20College%20Flywire-Nigerian-Naira.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-normal text-black hover:underline"
                                    >
                                        Download PDF <ArrowSquareOut size={12} />
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 last:border-b-0">
                                    <span className="text-neutral-800 font-normal">General Wire Authorization Letter</span>
                                    <a
                                        href="/images/Flywire-_-Cannoga%20Authorization-Letter.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 font-normal text-black hover:underline"
                                    >
                                        Download PDF <ArrowSquareOut size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loadingStep === 'BANK_INSTRUCTIONS'}
                            onClick={async () => {
                                if (!initPayload) {
                                    await handleInitialize();
                                }
                                setStep('PROOF');
                            }}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs disabled:opacity-60"
                        >
                            {loadingStep === 'BANK_INSTRUCTIONS' ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />Initializing Payment...</>
                            ) : (
                                <>I Have Sent the Transfer <ArrowRight size={14} /></>
                            )}
                        </button>
                    </div>
                )}

                {/* ══ STEP 4: SUBMIT PROOF ══ */}
                {step === 'PROOF' && initPayload && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button onClick={() => setStep('BANK_INSTRUCTIONS')} className="flex items-center gap-2 text-black text-sm font-normal uppercase tracking-widest transition-colors">
                            <ArrowLeft size={14} /> Back to Bank Details
                        </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Submit Transfer Confirmation</h2>
                            <p className="text-sm text-black font-normal">Enter your bank's transaction reference or session ID so our Finance team can verify your payment.</p>
                        </div>

                        <div className="bg-neutral-50 rounded-4px p-4 space-y-2">
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span className="uppercase tracking-widest">Your Tracking Ref</span>
                                <span className="font-mono text-black">{initPayload.trackingRef}</span>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span className="uppercase tracking-widest">Amount Sent</span>
                                <span className="text-black">{selectedBank?.currency_symbol} {Number(initPayload.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {initPayload.localCurrency}</span>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span className="uppercase tracking-widest">Bank</span>
                                <span className="text-black">{selectedBank?.bank_name}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-normal text-black uppercase tracking-widest block" htmlFor="bank-ref">
                                Bank Transaction Reference / Session ID *
                            </label>
                            <input
                                id="bank-ref"
                                type="text"
                                value={bankRef}
                                onChange={e => setBankRef(e.target.value)}
                                placeholder="e.g. NIP241218123456789"
                                className="w-full h-[48px] px-4 border border-neutral-400 rounded-4px focus:outline-none focus:ring-2 focus:ring-[#147BD1]/10 focus:border-[#147BD1] transition-all font-mono text-sm text-black bg-white placeholder:text-neutral-400 placeholder:font-sans"
                            />
                            <p className="text-[11px] text-neutral-500">This is the reference or session ID from your bank's transaction confirmation screen or SMS.</p>
                        </div>

                        {proofError && (
                            <div className="bg-red-50 border border-red-200 rounded-4px p-3 flex items-center gap-2 text-sm text-red-600">
                                <Warning size={16} weight="bold" className="shrink-0" />
                                {proofError}
                            </div>
                        )}

                        <button
                            disabled={!bankRef.trim() || submittingProof}
                            onClick={handleSubmitProof}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingProof ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />Submitting...</>
                            ) : (
                                <><ShieldCheck size={16} />Submit for Finance Verification</>
                            )}
                        </button>
                    </div>
                )}

                {/* ══ STEP 5: SUBMITTED ══ */}
                {step === 'SUBMITTED' && initPayload && (
                    <div className="space-y-6 animate-in zoom-in duration-300 text-center py-4">
                        <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} className="text-green-600" weight="fill" />
                        </div>
                        <div>
                            <h2 className="text-[20px] font-normal text-black mb-2">Transfer Submitted</h2>
                            <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                                Your transfer proof has been received. Our Finance team will verify and confirm your payment within 1-2 business days.
                            </p>
                        </div>

                        <div className="bg-neutral-50 rounded-4px p-5 text-left space-y-3 max-w-sm mx-auto">
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-500 uppercase tracking-widest">Tracking Reference</span>
                                <span className="font-mono text-black font-medium">{initPayload.trackingRef}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-500 uppercase tracking-widest">Status</span>
                                <span className="text-amber-600 font-medium">Pending Finance Verification</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-neutral-500 uppercase tracking-widest">Amount Submitted</span>
                                <span className="text-black">{selectedBank?.currency_symbol} {Number(initPayload.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {initPayload.localCurrency}</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                            You will receive an in-portal notification once Finance confirms your payment. Your receipt will appear in your student documents.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer — Flywire branding kept for non-NGN wires ── */}
            {selectedBank && selectedBank.country_code !== 'NG' && (
                <div className="bg-neutral-50 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[12px] text-[#5a687b] font-normal">
                            <span>Powered by</span>
                            <Image
                                src="https://cdn.brandfetch.io/id1L6oKjVX/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667924686641"
                                alt="Flywire"
                                width={48}
                                height={16}
                                className="h-4 w-auto object-contain"
                            />
                        </div>
                        <p className="text-[12px] text-[#5a687b] font-normal">Copyright ©Flywire. 2009-2026 All rights reserved.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
