'use client';

import React from 'react';
import { StatusBadge } from './StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CreditCardIcon as CreditCard, 
  DollarSignIcon as DollarSign, 
  Calendar01Icon as Calendar, 
  Alert01Icon as AlertTriangle 
} from '@hugeicons/core-free-icons';

interface FinanceSummaryProps {
  summary: {
    currentBalance: number;
    nextDueDate?: string;
    nextDueAmount?: number;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
    paymentStatus: string;
    holdAmount?: number;
    refundAmount?: number;
  };
}

export function FinanceSummary({ summary }: FinanceSummaryProps) {
  const balanceColor = summary.currentBalance > 0 ? 'text-red-600' : 'text-emerald-600';
  const balanceBg = summary.currentBalance > 0 ? 'bg-red-50' : 'bg-emerald-50';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={`bg-white border border-neutral-200 p-4 ${balanceBg}`}>
        <div className="flex items-center gap-2 mb-2">
          <HugeiconsIcon icon={DollarSign} size={18} strokeWidth={2} className={balanceColor} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Current Balance</span>
        </div>
        <div className={`text-2xl font-black ${balanceColor}`}>
          ${Math.abs(summary.currentBalance).toLocaleString()}
        </div>
        <div className="text-xs text-neutral-500 mt-1">
          {summary.currentBalance > 0 ? 'Amount Due' : summary.currentBalance < 0 ? 'Credit Balance' : 'Paid in Full'}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <HugeiconsIcon icon={Calendar} size={18} strokeWidth={2} className="text-blue-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Next Payment</span>
        </div>
        {summary.nextDueDate && summary.nextDueAmount ? (
          <>
            <div className="font-bold text-neutral-900">{summary.nextDueDate}</div>
            <div className="text-sm text-neutral-600">${summary.nextDueAmount.toLocaleString()}</div>
          </>
        ) : (
          <div className="text-neutral-500">No upcoming payments</div>
        )}
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <HugeiconsIcon icon={CreditCard} size={18} strokeWidth={2} className="text-emerald-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Last Payment</span>
        </div>
        {summary.lastPaymentDate && summary.lastPaymentAmount ? (
          <>
            <div className="font-bold text-neutral-900">{summary.lastPaymentDate}</div>
            <div className="text-sm text-emerald-600">${summary.lastPaymentAmount.toLocaleString()}</div>
          </>
        ) : (
          <div className="text-neutral-500">No payments recorded</div>
        )}
      </div>

      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <HugeiconsIcon icon={AlertTriangle} size={18} strokeWidth={2} className="text-amber-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Account Status</span>
        </div>
        <div className="font-bold text-neutral-900">
          <StatusBadge status={summary.paymentStatus} size="sm" />
        </div>
      </div>

      {(summary.holdAmount && summary.holdAmount > 0) || (summary.refundAmount && summary.refundAmount > 0) ? (
        <div className="grid grid-cols-2 gap-4">
          {summary.holdAmount && summary.holdAmount > 0 && (
            <div className="bg-white border border-neutral-200 p-4 bg-amber-50">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon icon={AlertTriangle} size={18} strokeWidth={2} className="text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Hold Amount</span>
              </div>
              <div className="font-bold text-amber-700">${summary.holdAmount.toLocaleString()}</div>
            </div>
          )}
          {summary.refundAmount && summary.refundAmount > 0 && (
            <div className="bg-white border border-neutral-200 p-4 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <HugeiconsIcon icon={DollarSign} size={18} strokeWidth={2} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Refund Pending</span>
              </div>
              <div className="font-bold text-emerald-700">${summary.refundAmount.toLocaleString()}</div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}