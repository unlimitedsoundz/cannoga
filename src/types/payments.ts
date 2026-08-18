// ============================================================
// Cannoga College — Dynamic Payments TypeScript Types
// ============================================================

export interface PaymentPurpose {
    id: string;
    code: string;
    title: string;
    description: string | null;
    default_amount_cad: number | null;
    allow_partial_payments: boolean;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface InstitutionalBankAccount {
    id: string;
    country_code: string;
    country_name: string;
    country_flag: string | null;
    currency: string;
    currency_symbol: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    account_type: string;
    routing_or_sort_code: string | null;
    swift_bic: string | null;
    iban: string | null;
    branch_address: string | null;
    transfer_instructions: string | null;
    processing_time: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface InstitutionalExchangeRate {
    id: string;
    from_currency: string;
    to_currency: string;
    rate_multiplier: number;
    lock_duration_hours: number;
    is_active: boolean;
    notes: string | null;
    last_updated_by: string | null;
    updated_at: string;
}

export type WirePaymentStatus =
    | 'COMPLETED'
    | 'PENDING'
    | 'FAILED'
    | 'REFUNDED'
    | 'pending_proof'
    | 'pending_admin_verification';

export interface WirePayment {
    id: string;
    offer_id: string;
    student_id: string;
    transaction_reference: string;
    wire_tracking_ref: string | null;
    amount: number;
    status: WirePaymentStatus;
    payment_method: string | null;
    invoice_type: string | null;
    country_code: string | null;
    local_currency: string | null;
    local_amount: number | null;
    exchange_rate_applied: number | null;
    student_proof_ref: string | null;
    student_proof_url: string | null;
    proof_submitted_at: string | null;
    admin_verified_by: string | null;
    admin_verified_at: string | null;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface WirePaymentWithStudent extends WirePayment {
    application?: {
        id: string;
        course?: { title: string; school?: { name: string }[] };
        user?: { first_name: string; last_name: string; email: string };
        personal_info?: { firstName: string; lastName: string; passportNumber?: string };
    };
    offer?: {
        id: string;
        tuition_fee: number;
        offer_type: string;
        status: string;
    };
}

export interface InitializeWirePaymentRequest {
    offerId: string;
    applicationId: string;
    countryCode: string;
    currency: string;
    cadAmount: number;
    localAmount: number;
    exchangeRate: number;
    paymentMethod: string;
    invoiceType?: string;
}

export interface InitializeWirePaymentResponse {
    success: boolean;
    paymentId: string;
    trackingRef: string;
    bankAccount: InstitutionalBankAccount;
    cadAmount: number;
    localAmount: number;
    localCurrency: string;
    exchangeRate: number;
    expiresAt: string;
    error?: string;
}

export interface SubmitProofRequest {
    paymentId: string;
    bankRef: string;
    proofUrl?: string;
}

export interface VerifyWireRequest {
    paymentId: string;
    action: 'approve' | 'reject';
    adminNotes: string;
}
