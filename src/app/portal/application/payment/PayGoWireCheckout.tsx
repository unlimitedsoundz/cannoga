'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    ArrowRight,
    ArrowLeft,
    Building as Building2,
    Wallet,
    ShieldCheck,
    Info,
    CheckCircle as CheckCircle2,
    Calendar,
    Clock,
    Copy,
    CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';
import { countries } from '@/utils/countries';

interface PayGoWireCheckoutProps {
    amount: number;
    currency: string;
    onPaymentComplete: (details: {
        method: string;
        country: string;
        currency: string;
        fxMetadata: any;
    }) => Promise<void>;
    isProcessing: boolean;
    paymentReference?: string;
}

type Step = 'COUNTRY' | 'METHOD' | 'FX' | 'CONCARM' | 'BANK_INSTRUCTIONS';

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    type: 'CARD' | 'BANK' | 'WALLET' | 'OTHER';
    icon: any;
    processingTime: string;
    importantInfo?: string | React.ReactNode;
}

const CopyButton = ({ text, label }: { text: string, label: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            // Fallback for non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[#147BD1] hover:text-[#1a3399] transition-colors text-[10px] uppercase font-normal tracking-widest bg-[#147BD1]/5 hover:bg-[#147BD1]/10 px-2 py-1 rounded-4px"
            title={`Copy ${label}`}
        >
            {copied ? (
                <>
                    <CheckCircle2 size={12} />
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <Copy size={12} />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};

export default function PayGoWireCheckout({
    amount,
    currency: defaultCurrency,
    onPaymentComplete,
    isProcessing,
    paymentReference
}: PayGoWireCheckoutProps) {
    const [step, setStep] = useState<Step>('COUNTRY');
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
    const [ngnEnabled, setNgnEnabled] = useState<boolean>(true);

    useEffect(() => {
        async function fetchSettings() {
            const { createClient } = await import('@/utils/supabase/client');
            const supabase = createClient();
            const { data } = await supabase
                .from('system_settings')
                .select('value')
                .eq('key', 'ngn_payment_enabled')
                .single();
            
            if (data) {
                setNgnEnabled(data.value === 'true');
            }
        }
        fetchSettings();
    }, []);

    const handleStepChange = (nextStep: Step) => {
        setLoadingStep(step);
        setTimeout(() => {
            setStep(nextStep);
            setLoadingStep(null);
        }, 800);
    };

    const filteredCountries = useMemo(() => {
        return [...countries].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // Dynamic Payment Methods Logic
    const getMethodsForCountry = (country: string): PaymentMethod[] => {
        const methods: PaymentMethod[] = [];

        const BankIcon = (props: any) => (
            <div className={props.className} style={{ width: props.size || 20, height: props.size || 20, position: 'relative' }}>
                <Image
                    src="/images/bank-icon.png"
                    alt="Bank"
                    fill
                    className="object-contain"
                />
            </div>
        );

        if (country === 'India') {
            methods.unshift({ id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm', type: 'WALLET', icon: Wallet, processingTime: '10-30 minutes' });
            methods.push({ id: 'in_bank', name: 'Net Banking', description: 'Direct transfer from Indian banks', type: 'BANK', icon: BankIcon, processingTime: '1-2 business days' });
        } else if (country === 'Ottawa, Ontario, Canada' || country === 'France' || country === 'Germany') {
            if (country === 'Ottawa, Ontario, Canada')         methods.push({ id: 'nordea', name: 'RBC Online', description: 'Local Canadian bank login', type: 'BANK', icon: BankIcon, processingTime: 'Instant' });
        } else if (country === 'Nigeria' && ngnEnabled) {
            methods.unshift({ 
                id: 'ng_bank', 
                name: 'Online Bank Transfer in Nigerian Naira (NGN)', 
                description: 'Pay via Local NGN Bank', 
                type: 'BANK', 
                icon: BankIcon, 
                processingTime: '1-2 hours'
            });
        } else if (country === 'United Arab Emirates') {
            methods.unshift({
                id: 'flutterwave_uae',
                name: 'Flutterwave (UAE)',
                description: 'Secure instant payment for UAE residents',
                type: 'WALLET',
                icon: Wallet,
                processingTime: 'Instant'
            });
        } else if (country === 'Cameroon') {
            methods.unshift({
                id: 'flutterwave_cm_momo',
                name: 'Mobile Money (Cameroon)',
                description: 'MTN MoMo, Orange Money',
                type: 'WALLET',
                icon: Wallet,
                processingTime: 'Instant'
            });
        } else if (country === 'United States') {
            methods.push({ id: 'ach', name: 'ACH Direct Debit', description: 'Low fee US bank pull', type: 'BANK', icon: BankIcon, processingTime: '3-5 business days' });
        }

        methods.push({ id: 'eur_wire', name: 'Bank Transfer in Canadian Dollars (CAD)', description: 'Pay in CAD via RBC', type: 'BANK', icon: BankIcon, processingTime: '7-14 days' });
        methods.push({ id: 'gbp_wire', name: 'International Bank Transfer in British Pounds (GBP)', description: 'Pay in GBP via World First UK Bank', type: 'BANK', icon: BankIcon, processingTime: '10-15 Business days' });
        methods.push({ id: 'usd_wire', name: 'International Bank Transfer in US Dollars (USD)', description: 'Pay in USD via JP MORGAN CHASE BANK', type: 'BANK', icon: BankIcon, processingTime: '10-15 business days' });

        return methods;
    };

    const countryMethods = useMemo(() => {
        return selectedCountry ? getMethodsForCountry(selectedCountry) : [];
    }, [selectedCountry, ngnEnabled]);

    // FX Data Logic (Mocked)
    const fxData = useMemo(() => {
        if (!selectedCountry) return null;

        let rate = 1.0;
        let localCurrency = defaultCurrency;

        if (selectedMethod?.id === 'usd_wire') { rate = 0.73; localCurrency = 'USD'; }
        else if (selectedMethod?.id === 'eur_wire') { rate = 0.68; localCurrency = 'CAD'; }
        else if (selectedMethod?.id === 'gbp_wire') { rate = 0.58; localCurrency = 'GBP'; }
        else if (selectedCountry === 'Nigeria') { rate = 968.40; localCurrency = 'NGN'; }
        else if (selectedCountry === 'India') { rate = 61.42; localCurrency = 'INR'; }
        else if (selectedCountry === 'United States') { rate = 0.73; localCurrency = 'USD'; }
        else if (selectedCountry === 'United Arab Emirates') { rate = 2.69; localCurrency = 'AED'; }
        else if (selectedCountry === 'Cameroon') { rate = 440.00; localCurrency = 'XAF'; }
        else if (['France', 'Germany'].includes(selectedCountry)) { rate = 0.68; localCurrency = 'CAD'; }
        else if (selectedCountry === 'Ottawa, Ontario, Canada') { rate = 1.0; localCurrency = 'CAD'; }

        // Special handling for CAD wire method which has a flat 25 CAD fee
        let localAmount = (amount * rate).toFixed(2);
        if (selectedMethod?.id === 'eur_wire') {
            localAmount = (amount + 25).toFixed(2);
        }

        return {
            localAmount,
            localCurrency,
            rate,
            fee: (amount * 0.015).toFixed(2) // 1.5% simulated fee
        };
    }, [selectedCountry, amount, defaultCurrency, selectedMethod]);

    const handleConfirmPayment = async () => {
        if (!selectedCountry || !selectedMethod || !fxData) return;

        await onPaymentComplete({
            method: selectedMethod.id,
            country: selectedCountry,
            currency: fxData.localCurrency,
            fxMetadata: {
                rate: fxData.rate,
                originalAmount: amount,
                localAmount: fxData.localAmount,
                localCurrency: fxData.localCurrency,
                timestamp: new Date().toISOString()
            }
        });
    };

    // Calculate dynamic expiration (Tomorrow 22:59)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    expiryDate.setHours(22, 59, 0, 0);
    const expiryString = expiryDate.toISOString().slice(0, 16).replace('T', ' ');

    const progress = useMemo(() => {
        switch (step) {
            case 'COUNTRY': return 25;
            case 'METHOD': return 50;
            case 'FX': return 75;
            default: return 100;
        }
    }, [step]);

    return (
        <div className="bg-white rounded-4px overflow-hidden max-w-none md:max-w-2xl mx-auto font-rubik">
            {/* Header Steps */}
            <div className="bg-neutral-50 py-3 px-4 flex justify-between items-center overflow-x-auto no-scrollbar gap-4">
                {[
                    { id: 'COUNTRY', label: 'Country' },
                    { id: 'METHOD', label: 'Method' },
                    { id: 'FX', label: 'Review' },
                    { id: 'CONCARM', label: 'Pay' }
                ].map((s, idx) => {
                    const isActive = step === s.id || (s.id === 'CONCARM' && step === 'BANK_INSTRUCTIONS');
                    const isCompleted = progress > (idx + 1) * 25 || (idx === 3 && progress === 100);

                    return (
                        <div
                            key={s.id}
                            className={`flex items-center gap-1.5 whitespace-nowrap text-[10px] md:text-sm font-normal uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-[#147BD1]' : 'text-neutral-400'
                                }`}
                        >
                            <span className={`w-4 h-4 force-circle flex items-center justify-center text-[8px] border ${isActive ? 'border-[#147BD1] bg-[#147BD1] text-white' : 'border-neutral-100'}`}>{idx + 1}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                            {idx < 3 && <ArrowRight size={10} className="text-neutral-100 ml-1" />}
                        </div>
                    );
                })}
            </div>

            {/* Transaction Timeline */}
            {fxData && (
                <div className="bg-white px-4 py-3 flex items-center justify-between text-[10px] md:text-xs font-rubik animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="flex flex-col">
                        <span className="text-black uppercase tracking-widest mb-0.5">You send</span>
                        <span className="font-normal text-black text-sm md:text-base">
                            {fxData.localCurrency} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex-grow flex items-center px-4 md:px-8">
                        <div className="flex-grow h-[1px] bg-neutral-50 relative">
                            <div className="absolute right-0 -top-[4px] w-2 h-2 border-t border-r border-neutral-100 rotate-45" />
                        </div>
                    </div>

                    <div className="flex flex-col text-right">
                        <span className="text-black uppercase tracking-widest mb-0.5">Cannoga College receives</span>
                        <span className="font-normal text-black text-sm md:text-base">
                            $ {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="h-1 w-full bg-neutral-100 overflow-hidden">
                <div
                    className="h-full bg-[#147BD1] transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(0,166,81,0.4)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-3 md:p-8">
                {/* ... existing checkout steps logic ... */}
                {step === 'COUNTRY' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Where are you paying from?</h2>
                            <p className="text-sm text-black font-normal">Explicit country selection is required for regulatory compliance.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-normal text-black uppercase tracking-widest block" htmlFor="country-select">Choose Country</label>
                            <div className="relative">
                                <select
                                    id="country-select"
                                    className="country-select w-full pl-4 pr-10 h-[48px] bg-white border border-neutral-400 rounded-4px focus:outline-none focus:ring-2 focus:ring-[#147BD1]/10 focus:border-[#147BD1] transition-all font-normal text-sm text-black appearance-none cursor-pointer"
                                    value={selectedCountry || ''}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                >
                                    <option value="" disabled>Select your payment origin...</option>
                                    {filteredCountries.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black">
                                    <ArrowRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!selectedCountry || loadingStep === 'COUNTRY'}
                            onClick={() => handleStepChange('METHOD')}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingStep === 'COUNTRY' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'METHOD' && (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <button
                             onClick={() => setStep('COUNTRY')}
                             className="flex items-center gap-2 text-black hover:text-black text-sm font-normal uppercase tracking-widest transition-colors mb-4 rounded-4px"
                         >
                             <ArrowLeft size={14} /> Back to Country
                         </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Select your preferred payment method</h2>
                            <p className="text-sm text-black font-normal lowercase mb-6">Available rails for <span className="text-[#147BD1] font-normal uppercase">{selectedCountry}</span></p>

                            {selectedCountry === 'Nigeria' && (
                                <div className="mb-8 p-0">
                                    <p className="text-[16px] text-neutral-500 leading-relaxed font-normal">
                                        Use this option to pay quickly in Naira via Bank Transfer.
                                        <br /><br />
                                        Note if you want to pay using a Form A application - please scroll down or select to pay in another currency - choose Bank Transfer in the destination currency and complete this journey to obtain Flywire's bank details to be used in the Form A application on the Trade Monitoring System. Full details are available <a href="https://help.flywire.com/hc/en-us/articles/9450081898781-How-can-I-access-Flywire-s-account-details-in-order-to-fill-out-the-Form-A-" target="_blank" rel="noopener noreferrer" className="text-[#147BD1] underline">here</a>.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {countryMethods.map(method => {
                                const Icon = method.icon;
                                return (
                                    <div key={method.id} className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setSelectedMethod(method);
                                                handleStepChange('FX');
                                            }}
                                            className={`w-full flex items-center justify-between p-3 md:p-5 rounded-4px transition-all group ${selectedMethod?.id === method.id
                                                ? 'border-2 border-[#147BD1] bg-blue-50/30'
                                                : 'border-0 hover:border hover:border-neutral-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-neutral-100 rounded-4px group-hover:bg-[#147BD1]/10 transition-colors">
                                                    <Icon size={20} className="text-black group-hover:text-[#147BD1]" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-normal text-black">{method.name}</p>
                                                    <p className="text-sm text-black">{method.description}</p>
                                                    {method.importantInfo && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedInfo(expandedInfo === method.id ? null : method.id);
                                                            }}
                                                            className="text-[10px] text-[#147BD1] mt-1 flex items-center gap-1 uppercase tracking-widest hover:underline"
                                                        >
                                                            Important Info
                                                            <CaretDown size={10} className={`transition-transform duration-300 ${expandedInfo === method.id ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-normal text-black uppercase tracking-widest flex items-center gap-1 justify-end">
                                                    <div className="w-3">
                                                        {(loadingStep === 'METHOD' && selectedMethod?.id === method.id) && (
                                                            <div className="w-3 h-3 border-2 border-[#147BD1]/30 border-t-[#147BD1] force-circle animate-spin" />
                                                        )}
                                                    </div>
                                                    <Clock size={12} /> {method.processingTime}
                                                </div>
                                            </div>
                                        </button>
                                        
                                        {method.importantInfo && expandedInfo === method.id && (
                                            <div className="p-4 bg-[#147BD1]/5 border border-[#147BD1]/10 rounded-4px text-xs text-black leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                                <div className="whitespace-pre-line">{method.importantInfo}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 'FX' && fxData && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => setStep('METHOD')}
                            className="flex items-center gap-2 text-black hover:text-black text-sm font-normal uppercase tracking-widest transition-colors rounded-4px"
                        >
                            <ArrowLeft size={14} /> Back to Methods
                        </button>

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Review Foreign Exchange</h2>
                            <p className="text-sm text-black font-normal">Locked FX rates for your payment corridor.</p>
                        </div>

                        <div className="space-y-6">

                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                <div>
                                    <p className="text-[10px] md:text-sm font-normal text-[#147BD1] uppercase tracking-widest mb-1">Local Amount</p>
                                    <p className="text-2xl md:text-3xl font-normal">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] md:text-sm font-normal text-black uppercase tracking-widest mb-1">Settlement (CAD)</p>
                                    <p className="text-xl md:text-2xl font-normal">$ {amount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="pt-6 space-y-3">
                                <div className="flex justify-between text-xs md:text-sm font-normal">
                                    <span className="text-black">Exchange Rate</span>
                                    <span className="text-[#147BD1] font-normal">1 CAD = {fxData.rate} {fxData.localCurrency}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-normal pt-2">
                                    <span>Total Payable</span>
                                    <span className="text-black">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-100 p-3 md:p-4 rounded-4px flex gap-3">
                            <Info size={16} className="text-black shrink-0" />
                            <p className="text-sm text-black leading-relaxed font-normal">
                                This FX rate is locked for the next 15 minutes. By proceeding, you confirm your intent to pay from <span>{selectedCountry}</span> using <span>{selectedMethod?.name}</span>.
                            </p>
                        </div>

                        <button
                            disabled={loadingStep === 'FX'}
                            onClick={() => handleStepChange('CONCARM')}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loadingStep === 'FX' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />
                                    Locking Rate...
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'CONCARM' && fxData && (
                    <div className="space-y-6 md:space-y-8 animate-in zoom-in duration-300 text-center">

                        <div>
                            <h2 className="text-[18px] font-normal text-black mb-2">Final Confirmation</h2>
                        </div>

                        <div className="bg-neutral-50 p-6 md:p-8 rounded-4px space-y-3 text-left">
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-normal">Country of Origin</p>
                                <p className="text-sm font-normal text-black uppercase">{selectedCountry}</p>
                            </div>
                            <div className="space-y-1 border-t border-neutral-200/50 pt-3">
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-normal">Payment Channel</p>
                                <p className="text-sm font-normal text-black">{selectedMethod?.name}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (selectedMethod?.id === 'flutterwave_uae' || selectedMethod?.id === 'flutterwave_cm_momo') {
                                    window.open('https://flutterwave.com/pay/Cannoga', '_blank');
                                    handleConfirmPayment();
                                } else if (selectedMethod?.id === 'ng_bank' || selectedMethod?.id === 'usd_wire' || selectedMethod?.id === 'eur_wire' || selectedMethod?.id === 'gbp_wire' || selectedMethod?.id === 'wire' || selectedMethod?.id === 'sepa') {
                                    handleStepChange('BANK_INSTRUCTIONS');
                                } else {
                                    handleConfirmPayment();
                                }
                            }}
                            disabled={isProcessing || loadingStep === 'CONCARM'}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            {isProcessing || loadingStep === 'CONCARM' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />
                                    Authorizing...
                                </>
                            ) : (
                                <>
                                    {selectedMethod?.id === 'flutterwave_uae'
                                        ? 'Pay via Flutterwave (UAE)'
                                        : selectedMethod?.id === 'flutterwave_cm_momo'
                                            ? 'Pay via Mobile Money (Flutterwave)'
                                            : selectedCountry === 'Nigeria'
                                                ? 'Complete Payment'
                                                : `Complete Payment via FLYWIRE (${fxData.localCurrency} ${Number(fxData.localAmount).toLocaleString()})`
                                    }
                                </>
                            )}
                        </button>
                    </div>
                )}

                {step === 'BANK_INSTRUCTIONS' && fxData && (
                    <div className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 font-rubik">
                        <div className="text-center space-y-4">
                            <h2 className="text-[18px] font-normal text-black leading-relaxed">
                                Transfer the exact amount including decimals, before <span className="font-normal text-[#147BD1]">{expiryString}</span>
                            </h2>
                            <p className="text-sm text-black max-w-lg mx-auto">
                                To ensure your payment is processed automatically, please use the exact provided account details below.
                            </p>
                        </div>

                        <div className="bg-neutral-50 p-4 md:p-6 space-y-3 md:space-y-4 rounded-4px">
                            <div className="grid gap-3">
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Amount</span>
                                    <div className="flex items-center gap-3">
                                        <CopyButton text={fxData.localAmount} label="Amount" />
                                        <span className="text-sm text-black font-normal">{fxData.localCurrency} {Number(fxData.localAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                {selectedMethod?.id === 'usd_wire' ? (
                                    <>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Bank</span>
                                            <span className="text-sm text-black font-normal text-right">JP MORGAN CHASE BANK, N.A.</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">ACH Routing</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="028000024" label="ACH Routing" />
                                                <span className="text-sm text-black font-normal tracking-wider">028000024</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Account Number</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="30000001050066" label="Account Number" />
                                                <span className="text-sm text-black font-normal tracking-wider">30000001050066</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Wire Routing</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="021000021" label="Wire Routing" />
                                                <span className="text-sm text-black font-normal tracking-wider">021000021</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">SWIFT/BIC</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="CHASUS33" label="SWIFT/BIC" />
                                                <span className="text-sm text-black font-normal tracking-wider">CHASUS33</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Beneficiary</span>
                                            <span className="text-sm text-black font-normal text-right">SYKLI EDUCATIONAL SERVICES</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Reference</span>
                                            <span className="text-sm text-black font-normal">{paymentReference || '1774261321084'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Processing Time</span>
                                            <span className="text-sm text-black font-normal text-right">10-15 Business Days</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Currency</span>
                                            <span className="text-sm text-black font-normal text-right">USD</span>
                                        </div>
                                    </>
                                ) : selectedMethod?.id === 'eur_wire' ? (
                                    <>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Bank</span>
                                            <span className="text-sm text-black font-normal text-right">RBC</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">IBAN</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="CA71 0395 6387 6849 73" label="IBAN" />
                                                <span className="text-sm text-black font-normal tracking-wider">CA71 0395 6387 6849 73</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Account Number</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="87684973" label="Account Number" />
                                                <span className="text-sm text-black font-normal tracking-wider">87684973</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Beneficiary</span>
                                            <span className="text-sm text-black font-normal text-right">SYKLI EDUCATIONAL SERVICES</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Reference</span>
                                            <span className="text-sm text-black font-normal">{paymentReference || '1774261321084'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Processing Time</span>
                                            <span className="text-sm text-black font-normal text-right">7-14 Days</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Transfer Fee</span>
                                            <span className="text-sm text-black font-normal text-right">Includes 25,00 $ fee</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Currency</span>
                                            <span className="text-sm text-black font-normal text-right">CAD</span>
                                        </div>
                                    </>
                                ) : selectedMethod?.id === 'gbp_wire' ? (
                                    <>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Bank Name</span>
                                            <span className="text-sm text-black font-normal text-right">WORLD CARST UK LTD</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Sort Code</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="236824" label="Sort Code" />
                                                <span className="text-sm text-black font-normal tracking-wider">236824</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Account Number</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="30103996" label="Account Number" />
                                                <span className="text-sm text-black font-normal tracking-wider">30103996</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">IBAN</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="GB81WFST23682430103996" label="IBAN" />
                                                <span className="text-sm text-black font-normal tracking-wider">GB81WFST23682430103996</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">SWIFT/BIC</span>
                                            <div className="flex items-center gap-3">
                                                <CopyButton text="WFSTGB2L" label="SWIFT/BIC" />
                                                <span className="text-sm text-black font-normal tracking-wider">WFSTGB2L</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Beneficiary</span>
                                            <span className="text-sm text-black font-normal text-right">SYKLI EDUCATIONAL SERVICES</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Reference</span>
                                            <span className="text-sm text-black font-normal">{paymentReference || '1774261321084'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Processing Time</span>
                                            <span className="text-sm text-black font-normal text-right">10-15 Business days</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Currency</span>
                                            <span className="text-sm text-black font-normal text-right">GBP</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
<div className="flex justify-between items-center pb-2">
                                             <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Bank</span>
                                             <span className="text-sm text-black font-normal text-right">OPAY MFB</span>
                                         </div>
                                         <div className="flex justify-between items-center pb-2">
                                             <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Account Number</span>
                                             <div className="flex items-center gap-3">
                                                 <CopyButton text="6500021843" label="Account Number" />
                                                 <span className="text-sm text-black font-normal tracking-wider">6500021843</span>
                                             </div>
                                         </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Beneficiary</span>
                                            <span className="text-sm text-black font-normal text-right">SYKLI EDUCATIONAL SERVICES</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Reference</span>
                                            <span className="text-sm text-black font-normal">{paymentReference || '1774261321084'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] md:text-sm text-neutral-500 uppercase tracking-widest">Expiration Date</span>
                                            <span className="text-sm text-black font-normal text-right">{expiryString}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>


                        <div className="text-sm text-neutral-500 leading-relaxed bg-white p-6 rounded-4px">
                            {selectedMethod?.id === 'usd_wire' ? (
                                <>
                                    <p className="mb-4">
                                        Please complete your USD wire transfer via <span>Bank of America</span>. Processing takes <span>10-15 business days</span>.
                                    </p>
                                    <p>
                                        Ensure you use the correct routing and wire routing numbers provided above. Contact your bank if you need assistance initiating an international USD wire transfer. Transfer the exact amount to avoid processing delays.
                                    </p>
                                </>
                            ) : selectedMethod?.id === 'eur_wire' ? (
                                <>
                                        <p className="mb-4">
                                            Please complete your CAD bank transfer to <span>RBC</span> using the IBAN provided above. Processing takes <span>7-14 days</span>.
                                        </p>
                                    <p>
                                        A <span>25,00 $</span> processing fee is included in the total amount. Please ensure you transfer the exact amount using the IBAN and account number provided. Contact your bank if you need assistance initiating an international CAD transfer.
                                    </p>
                                </>
                            ) : selectedMethod?.id === 'gbp_wire' ? (
                                <>
                                    <p className="mb-4">
                                        Please complete your GBP bank transfer to <span>Barclays Bank</span> using the IBAN provided above. Processing takes <span>10-15 days</span>.
                                    </p>
                                    <p>
                                        Please ensure you transfer the exact amount using the IBAN and SWIFT/BIC code provided. Contact your bank if you need assistance initiating an international GBP transfer.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="mb-4">
                                        You have until <span>{expiryString}</span> to complete your payment via Online Bank Transfer.
                                    </p>
                                    <p>
                                        We recommend making a NIBSS Instant Payment (NIP), offered by most banks, as other bank transfers can take longer to be received. To ensure your payment can be processed successfully, transfer the exact amount, otherwise your payment will be rejected. If the transaction is above the limit established by your bank for online transfers, reach out to your bank to increase your limit; if your bank is unable to raise your limit, create a new Payment Request for an amount that aligns with your bank's limits.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-widest">Supporting Documents for Bank Payments</h3>
                            <p className="text-sm text-black leading-relaxed">
                                In some instances, banks in some countries are not familiar with the payment arrangement established between Cannoga College and our payment partner. Below are letters that students can take to their bank if the bank questions the payment requirement.
                            </p>
                            <div className="space-y-3">
                                <p>
                                    <a
                                        href="https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/supporting-documents/Cannoga%20College%20Flywire-Nigerian-Naira.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#147BD1] underline"
                                    >
                                        Authorization Letter (.pdf)
                                    </a>
                                    <span className="text-black"> Provided by Cannoga College to confirm the payment arrangement with our payment partner.</span>
                                </p>
                                <p>
                                    <a
                                        href="https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/supporting-documents/Cannoga%20College%20Flywire-Nigerian-Naira.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#147BD1] underline"
                                    >
                                        Flywire Nigerian Payments (.pdf)
                                    </a>
                                    <span className="text-black"> Provided by our payment partner regarding acceptance of Nigerian Naira and payment methods.</span>
                                </p>
                                <p>
                                    <a
                                        href="https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/supporting-documents/Flywire-_-Cannoga%20Authorization-Letter.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#147BD1] underline"
                                    >
                                        General Authorization Letter (.pdf)
                                    </a>
                                    <span className="text-black"> Provided by Flywire to confirm the payment arrangement with Cannoga College.</span>
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="w-full h-[48px] bg-[#147BD1] text-white rounded-4px font-normal uppercase tracking-widest text-sm hover:bg-[#1a3399] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white force-circle animate-spin" />
                                    Confirming Transfer...
                                </>
                            ) : (
                                'I have sent the transfer'
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Regulatory Info */}
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
                    <div className="flex flex-col">
                        <p className="text-[12px] text-[#5a687b] font-normal">Copyright ©Flywire. 2009-2026 All rights reserved.</p>
                        <p className="text-[12px] text-[#5a687b] font-normal">Flywire is a trademark of Flywire Corporation.</p>
                    </div>
                </div>
                <div className="flex gap-6 opacity-30">
                </div>
            </div>
        </div>
    );
}
