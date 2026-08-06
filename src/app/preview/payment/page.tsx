'use client';

import PaymentView from '@/app/portal/application/payment/PaymentView';
import { useState, useEffect } from 'react';

export default function PreviewPaymentPage() {
    const mockApplication = {
        id: 'mock-app-id',
        status: 'OFFER_ACCEPTED',
        personal_info: {
            firstName: 'SAMUEL',
            lastName: 'ADENIYI'
        },
        contact_details: {
            email: 'samuel.adeniyi@example.com'
        },
        Course: {
            duration: '1'
        }
    };

    const mockOffer = {
        id: 'mock-offer-id',
        invoice_pushed: true,
        tuition_fee: 1250,
        invoice_type: 'TUITION_DEPOSIT'
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-neutral-50 border-b border-neutral-100 py-4 px-8">
                <h1 className="text-xl font-bold uppercase tracking-tighter text-black">SIS Payment Preview</h1>
            </div>
            <PaymentView 
                params={{ id: 'mock-app-id' }}
                application={mockApplication}
                admissionOffer={mockOffer}
            />
        </div>
    );
}
