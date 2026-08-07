'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { initializePalForStudent } from '@/utils/pal-status';

export async function getAdminInvoiceData() {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from('applications')
        .select(`
            id,
            personal_info,
            status,
            user:profiles(first_name, last_name, email),
            program:Course(title, duration),
            offer:admission_offers(
                id,
                tuition_fee,
                invoice_type,
                invoice_pushed,
                invoice_sent_at
            )
        `)
        .in('status', ['OFFER_ACCEPTED', 'PAYMENT_SUBMITTED', 'ENROLLED', 'ADMISSION_LETTER_GENERATED']);

    if (error) {
        console.error("Error fetching admin invoice data:", error.message || error);
        return [];
    }

    return data || [];
}

export async function getPendingPayments() {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
        .from('tuition_payments')
        .select('id, amount, currency, invoice_type, transaction_reference, created_at, offer_id, status')
        .eq('status', 'PENDING_VERIFICATION')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching pending payments:", error.message || error);
        return [];
    }

    return data || [];
}

export async function pushInvoice(applicationId: string, customFee: number, invoiceType: string) {
    const supabase = createServiceRoleClient();
    const ANCILLARY_FEES_TOTAL = 700;
    const ANCILLARY_FEES = [
        { name: 'Student Activity Fee', amount: 100 },
        { name: 'Technology Fee', amount: 100 },
        { name: 'Athletics and Recreation Fee', amount: 100 },
        { name: 'Convocation Fee', amount: 100 },
        { name: 'Student Counselling Fee', amount: 100 },
        { name: 'Program Transcript Fee', amount: 100 },
        { name: 'Student Experience Fee', amount: 100 }
    ];

    // Verify application exists and is in a valid state
    const { data: offer, error: offerError } = await supabase
        .from('admission_offers')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();

    let finalOffer = offer;

    if (offerError || !finalOffer) {
        console.log(`[pushInvoice] No offer found for ${applicationId}, creating one automatically...`);
        
        // Fetch application with course data to create offer
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*))
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('[pushInvoice] Application not found:', appError);
            throw new Error('Application not found');
        }

        const courseData = (application as any).course;
        const degreeLevel = courseData?.degreeLevel || 'BACHELOR';
        const schoolSlug = courseData?.school?.slug || 'technology';

        const { getTuitionFee, mapSchoolToTuitionField, getProgramYears } = await import('@/utils/tuition');
        const tuitionField = mapSchoolToTuitionField(schoolSlug);
        const personal = (application as any).personal_info || {};
        const studentType = personal.studentType;
        const isDomestic = studentType === 'domestic';
        const annualFee = await getTuitionFee(degreeLevel, tuitionField, isDomestic);

        const { data: newOffer, error: createError } = await supabase
            .from('admission_offers')
            .insert({
                application_id: applicationId,
                tuition_fee: annualFee,
                payment_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                offer_type: 'FULL_TUITION',
                status: 'PENDING'
            })
            .select('*')
            .single();

        if (createError || !newOffer) {
            console.error('[pushInvoice] Failed to create offer:', createError);
            throw new Error('Admission offer not found and could not be created');
        }

        finalOffer = newOffer;
    }

    // Update the offer with new custom fee and mark as invoiced
    const { error: updateError } = await supabase
        .from('admission_offers')
        .update({
            tuition_fee: customFee,
            invoice_type: invoiceType,
            offer_type: invoiceType === 'TUITION_DEPOSIT' ? 'TUITION_DEPOSIT' : invoiceType === 'ANCILLARY' ? 'FULL_TUITION' : invoiceType,
            invoice_pushed: true,
            invoice_sent_at: new Date().toISOString()
        })
        .eq('application_id', applicationId);

    if (updateError) {
        console.error('Error updating admission offer:', updateError.message || updateError);
        throw new Error('Failed to push invoice');
    }

    // Fetch application and user data
    const { data: application, error: appError } = await supabase
        .from('applications')
        .select(`
            *,
            course:Course(title),
            user:profiles(first_name, last_name, email, id)
        `)
        .eq('id', applicationId)
        .single();

    if (appError || !application) {
        console.error('Error fetching application data:', appError?.message || appError);
        // Don't throw error here, invoice is already pushed
        return { success: true };
    }

    // Ensure the student has an invoice record for the SIS dashboard balance
    const { data: studentForInvoice } = await supabase
        .from('students')
        .select('id')
        .eq('application_id', applicationId)
        .maybeSingle();

    if (studentForInvoice?.id) {
        const invoiceNumber = `INV-${applicationId.slice(0, 8).toUpperCase()}-${invoiceType}`;
        const isFirstInvoice = !offer?.invoice_pushed;
        const ancillaryTotal = isFirstInvoice ? ANCILLARY_FEES.reduce((acc, item) => acc + item.amount, 0) : 0;
        const invoiceAmount = customFee + ancillaryTotal;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const { error: invoiceError } = await supabase
            .from('invoices')
            .upsert({
                student_id: studentForInvoice.id,
                invoice_number: invoiceNumber,
                type: 'TUITION',
                term: application.intake || 'Current',
                amount: invoiceAmount,
                paid: 0,
                balance: invoiceAmount,
                due_date: dueDate.toISOString(),
                status: 'OUTSTANDING',
            }, { onConflict: 'invoice_number' });

        if (invoiceError) {
            console.error('Error creating invoice record:', invoiceError.message || invoiceError);
        } else {
            const docPayload = {
                student_id: studentForInvoice.id,
                document_type: 'tuition_invoice',
                title: `Tuition Invoice - ${application.intake || 'Current'}`,
                programme: (application as any).course?.title || '',
                status: 'pending',
                storage_path: null,
                is_official: true,
                is_student_visible: true,
                version: 1,
                issue_date: new Date().toISOString(),
                metadata: {
                    invoice_number: invoiceNumber,
                    amount: invoiceAmount,
                    due_date: dueDate.toISOString(),
                    invoice_type: invoiceType,
                },
            };

            const { data: existingDoc } = await supabase
                .from('document_records')
                .select('id')
                .eq('student_id', studentForInvoice.id)
                .eq('document_type', 'tuition_invoice')
                .eq('metadata->>invoice_number', invoiceNumber)
                .maybeSingle();

            if (existingDoc?.id) {
                await supabase.from('document_records').update(docPayload).eq('id', existingDoc.id);
            } else {
                await supabase.from('document_records').insert(docPayload);
            }
        }
    }

    // Trigger Invoice Ready via Edge Function instead of local sendEmail
    try {
        console.log(`[pushInvoice] Triggering notification for application: ${applicationId}`);
        const { data, error } = await supabase.functions.invoke('send-notification', {
            body: {
                applicationId: applicationId,
                type: 'INVOICE_READY',
                additionalData: {
                    amount: customFee,
                    currency: 'CAD',
                    invoiceType: invoiceType,
                    ancillaryFees: ANCILLARY_FEES
                }
            }
        });

        if (error) {
            console.error('[pushInvoice] Edge function error:', error.message || error);
        } else {
            console.log('[pushInvoice] Edge function triggered successfully:', data);
        }
    } catch (notifyError: any) {
        console.error('[pushInvoice] Failed to invoke notification edge function:', notifyError.message || notifyError);
        // Don't fail the push if notification fails
    }

    return { success: true };
}

// Verify and accept a subsequent (2nd, 3rd...) tuition invoice payment that the
// student submitted through the checkout. Runs server-side with the service-role
// client so it bypasses RLS and can UPDATE tuition_payments / applications /
// profiles directly. No edge-function hop is needed.
export async function verifyTuitionPayment(paymentId: string, applicationId: string) {
    const supabase = createServiceRoleClient();

    try {
        // 1. Mark payment as verified. This fires the on_payment_status_update
        // trigger which notifies the student (TUITION_PAYMENT_VERIFIED).
        const { error: updateError } = await supabase
            .from('tuition_payments')
            .update({ status: 'verified' })
            .eq('id', paymentId)
            .eq('status', 'PENDING_VERIFICATION');

        if (updateError) throw updateError;

        // 2. Fetch application + user data
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select('*, user:profiles!user_id(*), course:Course(*)')
            .eq('id', applicationId)
            .single();

        if (appError || !application) throw new Error('Application not found');

        const appUser = application.user;
        const currentYear = new Date().getFullYear();

        // 3. Generate student id + institutional email
        let studentId = appUser?.student_id;
        if (!studentId || !studentId.startsWith('HU')) {
            studentId = `CC${Math.floor(1000000 + Math.random() * 8999999)}`;
        }

        let institutionalEmail = `${appUser?.first_name ?? 'student'}.${appUser?.last_name ?? 'heffring'}@cannogacollege.ca`
            .toLowerCase()
            .replace(/\s+/g, '');

        const { data: existingEmail } = await supabase
            .from('students')
            .select('institutional_email')
            .eq('institutional_email', institutionalEmail)
            .maybeSingle();

        if (existingEmail) {
            institutionalEmail = `${appUser?.first_name ?? 'student'}.${appUser?.last_name ?? 'heffring'}${Math.floor(Math.random() * 100)}@cannogacollege.ca`
                .toLowerCase()
                .replace(/\s+/g, '');
        }

        // 4. Upsert student record
        const { error: studentError, data: newStudent } = await supabase
            .from('students')
            .upsert({
                user_id: appUser?.id,
                student_id: studentId,
                application_id: application.id,
                program_id: application.course_id,
                institutional_email: institutionalEmail,
                personal_email: appUser?.email,
                enrollment_status: 'ACTIVE',
                tuition_deposit_paid: true,
                start_date: application.updated_at || new Date().toISOString(),
                expected_graduation_date: new Date(new Date().setFullYear(currentYear + 3)).toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'application_id' })
            .select('id, pal_tal_required, pal_tal_status')
            .single();

        if (studentError) throw studentError;

        // 4b. Initialize PAL status for international students
        if (newStudent?.id) {
            await initializePalForStudent(newStudent.id);
        }

        // 4c. Generate automatic tasks for the student
        if (newStudent?.id) {
            try {
                const { generateAutomaticTasksForStudent } = await import('@/utils/tasks');
                await generateAutomaticTasksForStudent(newStudent.id);
            } catch (taskError) {
                console.error('Task generation deferred:', taskError);
            }
        }

        // 4d. Recalculate outstanding balance and update invoice
        if (newStudent?.id) {
            let paymentRecord: any = null;
            try {
                const { data: paymentRecordData } = await supabase
                    .from('tuition_payments')
                    .select('amount, invoice_type, transaction_reference, payment_method')
                    .eq('id', paymentId)
                    .single();

                paymentRecord = paymentRecordData;

                if (paymentRecord) {
                    const { data: existingInvoice } = await supabase
                        .from('invoices')
                        .select('*')
                        .eq('student_id', newStudent.id)
                        .eq('type', 'TUITION')
                        .neq('status', 'PAID')
                        .order('issued_date', { ascending: true })
                        .limit(1)
                        .maybeSingle();

                    if (existingInvoice) {
                        const newPaid = Number(existingInvoice.paid || 0) + Number(paymentRecord.amount || 0);
                        const newBalance = Math.max(0, Number(existingInvoice.amount || 0) - newPaid);
                        const newStatus = newBalance <= 0 ? 'PAID' : Number(existingInvoice.amount || 0) > 0 ? (newPaid > 0 ? 'PARTIAL' : 'OUTSTANDING') : 'PAID';

                        await supabase
                            .from('invoices')
                            .update({
                                paid: newPaid,
                                balance: newBalance,
                                status: newStatus,
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', existingInvoice.id);
                    } else {
                        const { data: offerForInvoice } = await supabase
                            .from('admission_offers')
                            .select('tuition_fee, invoice_type')
                            .eq('application_id', applicationId)
                            .maybeSingle();

                        const invoiceAmount = Number(offerForInvoice?.tuition_fee || paymentRecord.amount || 0);
                        const newPaid = Number(paymentRecord.amount || 0);
                        const newBalance = Math.max(0, invoiceAmount - newPaid);
                        const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIAL';

                        await supabase
                            .from('invoices')
                            .insert({
                                student_id: newStudent.id,
                                invoice_number: `INV-${applicationId.slice(0, 8).toUpperCase()}-${Date.now()}`,
                                type: 'TUITION',
                                term: application.intake || 'Current',
                                amount: invoiceAmount,
                                paid: newPaid,
                                balance: newBalance,
                                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                                status: newStatus,
                                issued_date: new Date().toISOString(),
                            });
                    }
                }
            } catch (invoiceError) {
                console.error('Error updating invoice:', invoiceError);
            }

            // 4e. Create receipt document record
            try {
                const receiptUrl = `https://lbkrzyqpdqgtqbodkcyi.supabase.co/storage/v1/object/public/application-documents/receipt-${paymentId}.pdf`;
                const receiptPayload = {
                    student_id: newStudent.id,
                    document_type: 'tuition_receipt',
                    title: `Tuition Receipt - ${paymentRecord.transaction_reference || paymentId}`,
                    programme: (application as any).course?.title || '',
                    status: 'issued',
                    storage_path: receiptUrl,
                    is_official: true,
                    is_student_visible: true,
                    version: 1,
                    issue_date: new Date().toISOString(),
                    metadata: {
                        payment_id: paymentId,
                        transaction_reference: paymentRecord.transaction_reference,
                        amount: paymentRecord.amount,
                        invoice_type: paymentRecord.invoice_type,
                        payment_method: paymentRecord.payment_method,
                    },
                };

                const { data: existingReceipt } = await supabase
                    .from('document_records')
                    .select('id')
                    .eq('student_id', newStudent.id)
                    .eq('document_type', 'tuition_receipt')
                    .eq('metadata->>payment_id', paymentId)
                    .maybeSingle();

                if (existingReceipt?.id) {
                    await supabase.from('document_records').update(receiptPayload).eq('id', existingReceipt.id);
                } else {
                    await supabase.from('document_records').insert(receiptPayload);
                }
            } catch (receiptError) {
                console.error('Error creating receipt document record:', receiptError);
            }
        }

        // 5. Mark application enrolled
        const { error: enrollError } = await supabase
            .from('applications')
            .update({
                status: 'ENROLLED',
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (enrollError) throw enrollError;

        // 6. Update user profile role
        await supabase
            .from('profiles')
            .update({ role: 'STUDENT', student_id: studentId })
            .eq('id', appUser?.id);

        return { success: true };
    } catch (err: any) {
        console.error('verifyTuitionPayment error:', err.message || err);
        throw new Error(err.message || 'Failed to verify payment');
    }
}

export async function getSystemSetting(key: string) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        console.error(`Error fetching setting ${key}:`, error.message || error);
        return null;
    }
    return data.value;
}

export async function updateSystemSetting(key: string, value: string) {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
        .from('system_settings')
        .update({ value, updatedAt: new Date().toISOString() })
        .eq('key', key);

    if (error) {
        console.error(`Error updating setting ${key}:`, error.message || error);
        throw new Error(`Failed to update setting ${key}`);
    }
    return { success: true };
}
