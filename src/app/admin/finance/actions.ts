'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { initializePalForStudent } from '@/utils/pal-status';
import { generateAndStoreLOA } from '@/utils/loa-pdf-generator';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import ReceiptPDF from '@/components/portal/pdf/ReceiptPDF';

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

    // 1. Fetch pending tuition payments
    const { data: tuitionData, error: tuitionError } = await supabase
        .from('tuition_payments')
        .select(`
            id,
            amount,
            currency,
            invoice_type,
            transaction_reference,
            created_at,
            offer_id,
            status,
            fx_metadata,
            offer:admission_offers(
                id,
                application_id,
                application:applications(
                    id,
                    personal_info,
                    user:profiles(first_name, last_name, email),
                    program:Course(title)
                )
            )
        `)
        .in('status', ['PENDING_VERIFICATION', 'pending_proof', 'PENDING'])
        .order('created_at', { ascending: false });

    if (tuitionError) {
        console.error("Error fetching pending tuition payments:", tuitionError.message || tuitionError);
    }

    // 2. Fetch pending housing payments
    const { data: housingData, error: housingError } = await supabase
        .from('housing_payments')
        .select(`
            id,
            amount,
            currency,
            payment_method,
            transaction_reference,
            created_at,
            status,
            metadata,
            student:students(
                id,
                user:profiles(first_name, last_name, email),
                application:applications(id, personal_info, course:Course(title))
            )
        `)
        .in('status', ['pending', 'PENDING_VERIFICATION', 'PENDING'])
        .order('created_at', { ascending: false });

    if (housingError) {
        console.error("Error fetching pending housing payments:", housingError.message || housingError);
    }

    const list: any[] = [];

    (tuitionData || []).forEach(t => {
        const app = (t as any).offer?.application;
        list.push({
            ...t,
            category: 'TUITION',
            app: app || null,
        });
    });

    (housingData || []).forEach(h => {
        const studentUser = (h as any).student?.user;
        const studentApp = (h as any).student?.application;
        list.push({
            id: h.id,
            amount: h.amount,
            currency: h.currency || 'CAD',
            invoice_type: 'HOUSING_DEPOSIT',
            transaction_reference: h.transaction_reference,
            created_at: h.created_at,
            status: h.status,
            category: 'HOUSING',
            fx_metadata: h.metadata,
            app: {
                id: (h as any).student?.id || h.id,
                personal_info: studentApp?.personal_info || {},
                user: studentUser || { first_name: 'Student', last_name: '', email: '' },
                program: { title: 'Housing Reservation Deposit' },
            }
        });
    });

    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function pushInvoice(applicationId: string, customFee: number, invoiceType: string, customDueDate?: string) {
    const supabase = createServiceRoleClient();
    const { ANCILLARY_FEES, ANCILLARY_FEES_TOTAL } = await import('@/utils/tuition');

    // Calculate due date
    const finalDueDate = customDueDate ? new Date(customDueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
                tuition_fee: customFee || annualFee,
                payment_deadline: finalDueDate.toISOString(),
                offer_type: invoiceType || 'FULL_TUITION',
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
            payment_deadline: finalDueDate.toISOString(),
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
    let { data: studentForInvoice } = await supabase
        .from('students')
        .select('id, user_id, application_id')
        .or(`application_id.eq.${applicationId},user_id.eq.${application.user_id}`)
        .maybeSingle();

    // If student record doesn't have application_id linked, update it
    if (studentForInvoice && !studentForInvoice.application_id) {
        await supabase.from('students').update({ application_id: applicationId }).eq('id', studentForInvoice.id);
    }

    if (studentForInvoice?.id) {
        const invoiceNumber = `INV-${applicationId.slice(0, 8).toUpperCase()}-${invoiceType}`;
        const invoiceAmount = Number(customFee);

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
                due_date: finalDueDate.toISOString(),
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
                    due_date: finalDueDate.toISOString(),
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

    // Trigger in-app notification in notifications table
    try {
        const studentId = studentForInvoice?.id;
        const userId = application.user?.id || (application as any).user_id;
        const recipientIds = [studentId, userId].filter(Boolean) as string[];

        if (userId || recipientIds.length > 0) {
            await supabase.from('notifications').insert({
                user_id: userId || null,
                title: `New Invoice Issued: ${invoiceType.replace(/_/g, ' ')}`,
                message: `An authoritative invoice of $${Number(customFee).toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD has been issued for your application (${application.course?.title || 'Program'}). Due date: ${finalDueDate.toLocaleDateString('en-CA')}.`,
                category: 'Finance',
                priority: 'high',
                recipient_type: 'individual',
                recipient_ids: recipientIds,
                related_id: applicationId,
                related_type: 'invoice',
                link: '/sis/payments',
                read: false,
                created_at: new Date().toISOString()
            });
        }
    } catch (notifErr: any) {
        console.error('[pushInvoice] Error inserting in-app notification:', notifErr.message || notifErr);
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

// Verify and accept a tuition payment submitted through the checkout.
// Runs server-side with the service-role client so it bypasses RLS and can
// UPDATE tuition_payments / applications / profiles directly.
export async function verifyTuitionPayment(paymentId: string, applicationId: string) {
    const supabase = createServiceRoleClient();

    try {
        // Check if this is a housing payment first
        const { data: housingRecord } = await supabase
            .from('housing_payments')
            .select('*')
            .eq('id', paymentId)
            .maybeSingle();

        if (housingRecord) {
            // 1. Mark housing payment as completed
            await supabase
                .from('housing_payments')
                .update({ status: 'completed' })
                .eq('id', paymentId);

            // 2. Mark corresponding housing application as RESERVED / PAID
            const studentId = housingRecord.student_id;
            if (studentId) {
                await supabase
                    .from('housing_applications')
                    .update({ status: 'RESERVED', deposit_paid: true })
                    .or(`student_id.eq.${studentId},id.eq.${housingRecord.invoice_id}`);
            }

            return { success: true };
        }

        // 0. Fetch payment record first so we know amount / type / reference
        const { data: paymentRecord, error: paymentFetchError } = await supabase
            .from('tuition_payments')
            .select('amount, invoice_type, transaction_reference, payment_method, currency, status, offer_id')
            .eq('id', paymentId)
            .single();

        if (paymentFetchError || !paymentRecord) {
            throw new Error('Payment record not found');
        }

        const paymentAmount = Number(paymentRecord.amount || 0);
        const isDeposit = paymentRecord.invoice_type === 'TUITION_DEPOSIT';
        const isFullTuition = paymentRecord.invoice_type === 'TUITION_FULL';
        const isAncillary = paymentRecord.invoice_type === 'ANCILLARY';

        // 1. Mark payment as verified / completed
        const { error: updateError } = await supabase
            .from('tuition_payments')
            .update({ status: 'COMPLETED' })
            .eq('id', paymentId);

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
        if (!studentId) {
            studentId = `CC${Math.floor(1000000 + Math.random() * 8999999)}`;
        } else if (!studentId.startsWith('CC')) {
            studentId = studentId.replace(/^(SYK|KC|KU|HU)/, 'CC');
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

        // 4. Upsert student record with payment flags
        const studentPayload: any = {
            user_id: appUser?.id,
            student_id: studentId,
            application_id: application.id,
            program_id: application.course_id,
            institutional_email: institutionalEmail,
            personal_email: appUser?.email,
            enrollment_status: 'ACTIVE',
            start_date: application.updated_at || new Date().toISOString(),
            expected_graduation_date: new Date(new Date().setFullYear(currentYear + 3)).toISOString(),
            updated_at: new Date().toISOString(),
        };

        if (isDeposit) {
            studentPayload.tuition_deposit_paid = true;
            studentPayload.tuition_deposit_paid_at = new Date().toISOString();
        }

        if (isFullTuition) {
            studentPayload.full_tuition_paid = true;
            studentPayload.full_tuition_paid_at = new Date().toISOString();
        }

        const { error: studentError, data: newStudent } = await supabase
            .from('students')
            .upsert(studentPayload, { onConflict: 'application_id' })
            .select('id, pal_tal_required, pal_tal_status')
            .single();

        if (studentError) throw studentError;

        // 4b. Initialize PAL status for international students
        if (newStudent?.id) {
            await initializePalForStudent(newStudent.id);
        }

        // 4c. Generate LOA document
        if (newStudent?.id) {
            try {
                await generateAndStoreLOA(applicationId, application as any);
            } catch (loaError) {
                console.error('Failed to generate LOA during payment verification:', loaError);
            }
        }

        // 4d. Generate automatic tasks for the student
        if (newStudent?.id) {
            try {
                const { generateAutomaticTasksForStudent } = await import('@/utils/tasks');
                await generateAutomaticTasksForStudent(newStudent.id);
            } catch (taskError) {
                console.error('Task generation deferred:', taskError);
            }
        }

        // 4d. Recalculate outstanding balance and update/create invoice
        if (newStudent?.id) {
            try {
                let existingInvoice = null;

                if (paymentRecord?.invoice_type) {
                    const { data: invoiceByType } = await supabase
                        .from('invoices')
                        .select('*')
                        .eq('student_id', newStudent.id)
                        .eq('type', 'TUITION')
                        .neq('status', 'PAID')
                        .ilike('invoice_number', `%${paymentRecord.invoice_type}`)
                        .order('issued_date', { ascending: true })
                        .limit(1)
                        .maybeSingle();

                    existingInvoice = invoiceByType;
                }

                if (!existingInvoice) {
                    const { data: fallbackInvoice } = await supabase
                        .from('invoices')
                        .select('*')
                        .eq('student_id', newStudent.id)
                        .eq('type', 'TUITION')
                        .neq('status', 'PAID')
                        .order('issued_date', { ascending: true })
                        .limit(1)
                        .maybeSingle();

                    existingInvoice = fallbackInvoice;
                }

                if (existingInvoice) {
                    const newPaid = Number(existingInvoice.paid || 0) + paymentAmount;
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
                        .select('tuition_fee, invoice_type, invoice_pushed')
                        .eq('application_id', applicationId)
                        .maybeSingle();

                    const { ANCILLARY_FEES_TOTAL } = await import('@/utils/tuition');
                    const isFirstInvoice = !offerForInvoice?.invoice_pushed;
                    const ancillaryTotal = isFirstInvoice ? ANCILLARY_FEES_TOTAL : 0;
                    const baseFee = Number(offerForInvoice?.tuition_fee || paymentAmount);
                    const invoiceAmount = baseFee + ancillaryTotal;
                    const newBalance = Math.max(0, invoiceAmount - paymentAmount);
                    const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIAL';

                    await supabase
                        .from('invoices')
                        .insert({
                            student_id: newStudent.id,
                            invoice_number: `INV-${applicationId.slice(0, 8).toUpperCase()}-${paymentRecord.invoice_type || 'TUITION'}-${Date.now()}`,
                            type: 'TUITION',
                            term: application.intake || 'Current',
                            amount: invoiceAmount,
                            paid: paymentAmount,
                            balance: newBalance,
                            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            status: newStatus,
                            issued_date: new Date().toISOString(),
                        });
                }
            } catch (invoiceError) {
                console.error('Error updating invoice:', invoiceError);
            }

            // 4e. Update admission_offers invoice tracking
            try {
                const { data: offer } = await supabase
                    .from('admission_offers')
                    .select('id')
                    .eq('application_id', applicationId)
                    .maybeSingle();

                if (offer?.id) {
                    await supabase
                        .from('admission_offers')
                        .update({
                            invoice_pushed: true,
                            invoice_sent_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', offer.id);
                }
            } catch (offerError) {
                console.error('Error updating admission offer:', offerError);
            }

            // 4f. Create receipt document record and upload PDF
            try {
                const pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(ReceiptPDF, { application, payment: paymentRecord }) as any));
                const fileName = `receipt-${paymentRecord.transaction_reference || paymentId}.pdf`;
                const storagePath = `student-documents/${application.user_id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('application-documents')
                    .upload(storagePath, pdfBuffer, {
                        contentType: 'application/pdf',
                        upsert: true,
                    });

                if (uploadError) {
                    console.error('Receipt upload error:', uploadError);
                    throw new Error(`Failed to upload receipt: ${uploadError.message}`);
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('application-documents')
                    .getPublicUrl(storagePath);

                const receiptPayload = {
                    student_id: newStudent.id,
                    document_type: 'tuition_receipt',
                    title: `Tuition Receipt - ${paymentRecord.transaction_reference || paymentId}`,
                    programme: (application as any).course?.title || '',
                    status: 'issued',
                    storage_path: publicUrl,
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

                await supabase.from('document_records').upsert(receiptPayload, {
                    onConflict: 'student_id,document_type',
                });

                // 4g. Trigger notification to student with receipt PDF attachment
                try {
                    console.log(`[verifyTuitionPayment] Triggering TUITION_PAYMENT_VERIFIED notification for app: ${applicationId}`);
                    await supabase.functions.invoke('send-notification', {
                        body: {
                            applicationId: applicationId,
                            type: 'TUITION_PAYMENT_VERIFIED',
                            record: {
                                amount: paymentRecord.amount,
                                currency: paymentRecord.currency || 'CAD',
                                transaction_reference: paymentRecord.transaction_reference,
                                receipt_url: publicUrl,
                                status: 'VERIFIED'
                            },
                            applicationData: application
                        }
                    });
                } catch (notifyErr) {
                    console.error('[verifyTuitionPayment] Failed to trigger payment verification notification:', notifyErr);
                }
            } catch (receiptError) {
                console.error('Error creating receipt document record:', receiptError);
            }
        }

        // 5. Mark application enrolled if payment covers deposit or full tuition
        if (isDeposit || isFullTuition) {
            const { error: enrollError } = await supabase
                .from('applications')
                .update({
                    status: 'ENROLLED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', applicationId);

            if (enrollError) throw enrollError;
        }

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
