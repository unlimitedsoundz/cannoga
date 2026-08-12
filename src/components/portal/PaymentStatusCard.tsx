'use client';

import { CheckCircle, CurrencyEur as DollarSign } from "@phosphor-icons/react/dist/ssr";

type PaymentState = { paid: boolean; paidAt: string | null };

function PaymentStatusRow({
    label,
    state,
    dark,
}: {
    label: string;
    state: PaymentState;
    dark?: boolean;
}) {
    const paid = !!state.paid;
    const iconWrap = dark
        ? paid ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
        : paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
    const badge = dark
        ? paid ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
        : paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
    const card = dark ? 'border-white/20 bg-neutral-900' : 'border-neutral-200 bg-white';
    const title = dark ? 'text-white' : 'text-black';
    const sub = dark ? 'text-neutral-400' : 'text-neutral-500';

    return (
        <div className={`flex items-center justify-between gap-4 py-3 px-4 border rounded-sm ${card}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${iconWrap}`}>
                    <CheckCircle size={16} weight="bold" />
                </div>
                <div>
                    <p className={`text-[13px] font-bold leading-tight ${title}`}>{label}</p>
                    <p className={`text-[10px] font-bold ${sub}`}>
                        {paid
                            ? state.paidAt
                                ? `Paid on ${new Date(state.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
                                : 'Paid'
                            : 'Awaiting payment'}
                    </p>
                </div>
            </div>
            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider ${badge}`}>
                {paid ? 'Paid' : 'Pending'}
            </span>
        </div>
    );
}

export default function PaymentStatusCard({
    student,
    dark,
}: {
    student: {
        tuition_deposit_paid?: boolean;
        tuition_deposit_paid_at?: string | null;
        full_tuition_paid?: boolean;
        full_tuition_paid_at?: string | null;
        housing_fee_paid?: boolean;
        housing_fee_paid_at?: string | null;
    } | null;
    dark?: boolean;
}) {
    if (!student) return null;

    const heading = dark ? 'text-white' : 'text-black';

    return (
        <div>
            <h3 className={`font-bold text-[13px] md:text-[15px] pb-2 md:pb-3 mb-3 flex items-center gap-2 ${heading}`}>
                <DollarSign size={16} weight="bold" /> Payment Status
            </h3>
            <div className="space-y-2 md:space-y-3">
                <PaymentStatusRow
                    label="Tuition Deposit"
                    state={{ paid: !!student.tuition_deposit_paid, paidAt: student.tuition_deposit_paid_at ?? null }}
                    dark={dark}
                />
                <PaymentStatusRow
                    label="Full Tuition"
                    state={{ paid: !!student.full_tuition_paid, paidAt: student.full_tuition_paid_at ?? null }}
                    dark={dark}
                />
                <PaymentStatusRow
                    label="Housing Fees"
                    state={{ paid: !!student.housing_fee_paid, paidAt: student.housing_fee_paid_at ?? null }}
                    dark={dark}
                />
            </div>
        </div>
    );
}
