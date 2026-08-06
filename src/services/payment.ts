import { createClient } from "@/utils/supabase/client";
import { PaymentMethod } from "@/types/database";

export async function generateHousingInvoice(
    studentId: string,
    applicationId: string | null,
    items: { description: string; type: string; amount: number; quantity?: number }[]
) {
    const supabase = createClient();

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.amount * (item.quantity || 1)), 0);
    const referenceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Invoice
    const { data: invoice, error: invoiceError } = await supabase
        .from('housing_invoices')
        .insert({
            student_id: studentId,
            application_id: applicationId || null,
            reference_number: referenceNumber,
            total_amount: totalAmount,
            status: 'PENDING',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days due
            currency: 'CAD'
        })
        .select()
        .single();

    if (invoiceError) throw new Error(`Failed to create invoice: ${invoiceError.message}`);

    // Create Invoice Items
    const invoiceItems = items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        item_type: item.type,
        amount: item.amount,
        quantity: item.quantity || 1
    }));

    const { error: itemsError } = await supabase
        .from('housing_invoice_items')
        .insert(invoiceItems);

    if (itemsError) throw new Error(`Failed to create invoice items: ${itemsError.message}`);

    return invoice;
}

export async function initiatePayment(
    invoiceId: string,
    method: PaymentMethod,
    country: string
): Promise<{ success: boolean; paymentUrl?: string; transactionId?: string; error?: string }> {
    try {
        const supabase = createClient();

        // Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        // Get Invoice
        const { data: invoice } = await supabase
            .from('housing_invoices')
            .select('*, student:students(id)')
            .eq('id', invoiceId)
            .single();

        if (!invoice) return { success: false, error: 'Invoice not found' };

        // Mock PayGoWire Interaction
        const pgwTxId = `PGW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const mockPaymentUrl = `https://cannogacollege.ca/portal/application/payment/verify?ref=${pgwTxId}`;

        // Create Payment Record
        const { error: paymentError } = await supabase
            .from('housing_payments')
            .insert({
                invoice_id: invoiceId,
                student_id: invoice.student_id, // Use string ID from invoice
                amount: invoice.total_amount - (invoice.paid_amount || 0), // Paying remaining balance
                currency: invoice.currency,
                status: 'PENDING',
                payment_method: method,
                billing_country: country,
                paygowire_transaction_id: pgwTxId,
                paygowire_payment_url: mockPaymentUrl
            });

        if (paymentError) {
            console.error('Payment creation error:', paymentError);
            return { success: false, error: 'Failed to initiate payment transaction' };
        }

        return { success: true, paymentUrl: mockPaymentUrl, transactionId: pgwTxId };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function verifyPayment(
    transactionId: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    try {
        // 1. Find the pending payment
        const { data: payment } = await supabase
            .from('housing_payments')
            .select('*, invoice:housing_invoices(*)')
            .eq('paygowire_transaction_id', transactionId)
            .single();

        if (!payment) return { success: false, error: 'Payment transaction not found' };
        if (payment.status === 'COMPLETED') return { success: true }; // Already processed

        // 2. Update Payment Status (Trigger will update Invoice)
        const { error: updateError } = await supabase
            .from('housing_payments')
            .update({
                status: 'COMPLETED',
                paid_at: new Date().toISOString()
            })
            .eq('id', payment.id);

        if (updateError) throw updateError;

        // 3. Update Invoice Status manually if needed (or rely on DB triggers/RLS)
        const { data: updatedInvoice } = await supabase
            .from('housing_invoices')
            .select('*')
            .eq('id', payment.invoice_id)
            .single();

        if (updatedInvoice) {
            const newPaid = (updatedInvoice.paid_amount || 0) + payment.amount;
            const isPaid = newPaid >= updatedInvoice.total_amount;

            await supabase.from('housing_invoices')
                .update({
                    paid_amount: newPaid,
                    status: isPaid ? 'PAID' : 'PARTIALLY_PAID'
                })
                .eq('id', payment.invoice_id);


            if (isPaid) {
                let targetApplicationId = updatedInvoice.application_id;

                // Fallback: If no application_id, find a pending one for this student
                if (!targetApplicationId) {
                    const { data: pendingApp } = await supabase
                        .from('housing_applications')
                        .select('id')
                        .eq('student_id', updatedInvoice.student_id)
                        .eq('status', 'PENDING')
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    
                    if (pendingApp) {
                        targetApplicationId = pendingApp.id;
                        // Link the invoice for future
                        await supabase.from('housing_invoices').update({ application_id: targetApplicationId }).eq('id', updatedInvoice.id);
                    }
                }

                if (targetApplicationId) {
                    await supabase.from('housing_applications')
                        .update({ status: 'APPROVED' })
                        .eq('id', targetApplicationId);
                }
            }

            // Notify Admin & Student via Edge Function
            try {
                await supabase.functions.invoke('send-notification', {
                    body: {
                        type: 'PAYMENT_RECEIVED',
                        applicationId: updatedInvoice.application_id || undefined,
                        additionalData: {
                            amount: payment.amount,
                            currency: payment.currency,
                            reference: transactionId,
                            paymentType: 'HOUSING'
                        }
                    }
                });
            } catch (notifyError) {
                console.error('Failed to trigger housing payment notification:', notifyError);
            }
        }

        return { success: true };

    } catch (err: any) {
        console.error('Verify payment error:', err);
        return { success: false, error: err.message };
    }
}

export async function batchGenerateInvoices(month: number, year: number) {
    const supabase = createClient();

    // 1. Admin restricted check (RLS will handle actual write permission, but good to check role)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 2. Find all active assignments
    const { data: assignments } = await supabase
        .from('housing_assignments')
        .select('*, room:housing_rooms(*)')
        .eq('status', 'ASSIGNED');

    if (!assignments) return { success: true, count: 0 };

    let count = 0;
    for (const assignment of assignments) {
        // Check if invoice already exists for this month/year for this student
        const refPrefix = `RENT-${year}-${month.toString().padStart(2, '0')}`;
        const { data: existing } = await supabase
            .from('housing_invoices')
            .select('id')
            .eq('student_id', assignment.student_id)
            .ilike('reference_number', `${refPrefix}%`)
            .single();

        if (existing) continue;

        // Generate monthly rent invoice
        await generateHousingInvoice(
            assignment.student_id,
            assignment.application_id,
            [
                {
                    description: `Monthly Rent - ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1))} ${year}`,
                    type: 'MONTHLY_RENT',
                    amount: assignment.room?.monthly_rate || 600
                }
            ]
        );
        count++;
    }

    return { success: true, count };
}

export async function reconcilePayment(paymentId: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Fetch Payment and Invoice Data
    const { data: payment, error: fetchError } = await supabase
        .from('housing_payments')
        .select('*, invoice:housing_invoices(*)')
        .eq('id', paymentId)
        .single();

    if (fetchError || !payment) throw new Error(`Payment not found: ${fetchError?.message}`);
    if (payment.status === 'COMPLETED') return { success: true };

    const invoice = payment.invoice;
    if (!invoice) throw new Error('Invoice not found for this payment');

    // 2. Update Payment Status
    const { error: paymentUpdateError } = await supabase
        .from('housing_payments')
        .update({
            status: 'COMPLETED',
            paid_at: new Date().toISOString(),
            verified: true,
            metadata: {
                ...payment.metadata,
                reconciled_by: user.id,
                reconciled_at: new Date().toISOString()
            }
        })
        .eq('id', paymentId);

    if (paymentUpdateError) throw paymentUpdateError;

    // 3. Update Invoice Status
    const newPaidAmount = (invoice.paid_amount || 0) + payment.amount;
    const isFullyPaid = newPaidAmount >= invoice.total_amount;

    const { error: invoiceUpdateError } = await supabase
        .from('housing_invoices')
        .update({
            paid_amount: newPaidAmount,
            status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
            updated_at: new Date().toISOString()
        })
        .eq('id', invoice.id);

    if (invoiceUpdateError) throw invoiceUpdateError;

    // 4. Update Application if Fully Paid
    if (isFullyPaid) {
        let targetApplicationId = invoice.application_id;

        // Fallback: If no application_id, find a pending one for this student
        if (!targetApplicationId) {
            const { data: pendingApp } = await supabase
                .from('housing_applications')
                .select('id')
                .eq('student_id', invoice.student_id)
                .eq('status', 'PENDING')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (pendingApp) {
                targetApplicationId = pendingApp.id;
                // Link the invoice for future
                await supabase.from('housing_invoices').update({ application_id: targetApplicationId }).eq('id', invoice.id);
            }
        }

        if (targetApplicationId) {
            await supabase
                .from('housing_applications')
                .update({ status: 'APPROVED' })
                .eq('id', targetApplicationId);
        }
    }

    // 5. Notify Student via Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                type: 'PAYMENT_RECEIVED',
                applicationId: invoice.application_id || undefined,
                additionalData: {
                    amount: payment.amount,
                    currency: payment.currency,
                    reference: payment.paygowire_transaction_id || payment.id,
                    paymentType: 'HOUSING'
                }
            }
        });
    } catch (notifyError) {
        console.error('Failed to trigger reconcile notification:', notifyError);
    }

    return { success: true };
}

export async function searchStudents(query: string) {
    const supabase = createClient();

    const { data: students, error } = await supabase
        .from('students')
        .select('*, user:profiles(*)')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,student_id.ilike.%${query}%`, { foreignTable: 'profiles' })
        .limit(10);

    if (error) throw error;
    return students;
}

export async function verifyHousingPaymentManually(invoiceId: string, amount: number, method: PaymentMethod = 'BANK_TRANSFER', reference?: string) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 2. Fetch Invoice
    const { data: invoice } = await supabase
        .from('housing_invoices')
        .select('*, student:students(*, user:profiles(*))')
        .eq('id', invoiceId)
        .single();

    if (!invoice) throw new Error('Invoice not found');

    // 3. Create Manual Payment Record
    await supabase
        .from('housing_payments')
        .insert({
            invoice_id: invoiceId,
            student_id: invoice.student_id,
            amount,
            currency: invoice.currency,
            status: 'COMPLETED',
            payment_method: method,
            billing_country: 'Manual Verification',
            paid_at: new Date().toISOString(),
            verified: true,
            metadata: {
                verified_by: user.id,
                manual_reference: reference || 'Manual Admin Action',
                verification_date: new Date().toISOString()
            }
        });

    // 4. Update Invoice Status
    const newPaidAmount = (invoice.paid_amount || 0) + amount;
    const isFullyPaid = newPaidAmount >= invoice.total_amount;

    await supabase
        .from('housing_invoices')
        .update({
            paid_amount: newPaidAmount,
            status: isFullyPaid ? 'PAID' : 'PARTIALLY_PAID',
            updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);


    if (isFullyPaid) {
        let targetApplicationId = invoice.application_id;

        // Fallback: If no application_id, find a pending one for this student
        if (!targetApplicationId) {
            const { data: pendingApp } = await supabase
                .from('housing_applications')
                .select('id')
                .eq('student_id', invoice.student_id)
                .eq('status', 'PENDING')
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (pendingApp) {
                targetApplicationId = pendingApp.id;
                // Link the invoice for future
                await supabase.from('housing_invoices').update({ application_id: targetApplicationId }).eq('id', invoiceId);
            }
        }

        if (targetApplicationId) {
            await supabase
                .from('housing_applications')
                .update({ status: 'APPROVED' })
                .eq('id', targetApplicationId);
        }
    }

    // 6. Notify Admin & Student via Edge Function
    try {
        await supabase.functions.invoke('send-notification', {
            body: {
                type: 'PAYMENT_RECEIVED',
                applicationId: invoice.application_id || undefined,
                additionalData: {
                    amount: amount,
                    currency: invoice.currency,
                    reference: reference || 'MANUAL-VERIF',
                    paymentType: 'HOUSING'
                }
            }
        });
    } catch (notifyError) {
        console.error('Failed to trigger manual payment notification:', notifyError);
    }

    return { success: true };
}

