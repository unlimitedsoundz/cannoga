
import { createClient } from '@/utils/supabase/client';
import { createAdminClient } from '@/utils/supabase/admin';
import { provisionLmsAccount } from './lms-actions';
import { provisionItMaterials } from './it-actions';
import { initializePalForStudent } from '@/utils/pal-status';
import { generateAndStoreLOA } from '@/utils/loa-pdf-generator';
import ReceiptPDF from '@/components/portal/pdf/ReceiptPDF';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

export async function confirmEnrollment(applicationId: string) {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Get current session (Actor)
    const { data: { user: actor } } = await supabase.auth.getUser();

    if (!actor) {
        throw new Error('Unauthorized');
    }

    try {
        // 1. Fetch Application & Offer Details
        const { data: application, error: appError } = await adminClient
            .from('applications')
            .select(`
                *,
                user:profiles(*),
                course:Course(*),
                offer:admission_offers!inner(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('App fetch error:', appError);
            throw new Error('Application not found');
        }

        // 2. Validate State
        // Handle both 1:1 (object) and 1:N (array) returns from Supabase
        const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;

        if (!offer) {
            throw new Error('Associated admission offer not found');
        }
        const { data: payment } = await adminClient
            .from('tuition_payments')
            .select('*')
            .eq('offer_id', offer.id)
            .eq('status', 'COMPLETED')
            .single();

        if (application.status === 'ENROLLED') {
            return { success: true, message: 'Student is already enrolled.' };
        }

        // Only allow enrollment if payment is submitted or offer accepted (manual override)
        if (application.status !== 'PAYMENT_SUBMITTED' && application.status !== 'OFFER_ACCEPTED') {
            throw new Error(`Invalid application status for enrollment: ${application.status}`);
        }

        // 2b. Check if already enrolled (Idempotency)
        const { data: existingStudent } = await adminClient
            .from('students')
            .select('id, student_id, pal_tal_required, pal_tal_status')
            .eq('application_id', applicationId)
            .single();

        if (existingStudent) {
            if (existingStudent.pal_tal_required && existingStudent.pal_tal_status !== 'verified') {
                throw new Error(`PAL/TAL verification is required before enrollment. Current status: ${existingStudent.pal_tal_status}`);
            }

            if (application.status !== 'ENROLLED') {
                await adminClient.from('applications').update({ status: 'ENROLLED' }).eq('id', applicationId);
            }

            // Ensure LOA document exists for already-enrolled students
            try {
                await generateAndStoreLOA(application.id, application as any);
            } catch (loaError) {
                console.error('Failed to generate LOA for existing student:', loaError);
            }

            // Ensure receipt document exists if payment exists
            if (payment) {
                try {
                    const pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(ReceiptPDF, { application: application as any, payment }) as any));
                    const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
                    const storagePath = `student-documents/${application.user_id}/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('application-documents')
                        .upload(storagePath, pdfBuffer, {
                            contentType: 'application/pdf',
                            upsert: true,
                        });

                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage
                            .from('application-documents')
                            .getPublicUrl(storagePath);

                        const receiptPayload = {
                            student_id: existingStudent.id,
                            document_type: 'tuition_receipt',
                            title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
                            programme: (application as any).course?.title || '',
                            status: 'issued',
                            storage_path: publicUrl,
                            is_official: true,
                            is_student_visible: true,
                            version: 1,
                            issue_date: new Date().toISOString(),
                            metadata: {
                                payment_id: payment.id,
                                transaction_reference: payment.transaction_reference,
                                amount: payment.amount,
                                invoice_type: payment.invoice_type,
                                payment_method: payment.payment_method,
                            },
                        };

                        const { data: existingReceipt } = await supabase
                            .from('document_records')
                            .select('id')
                            .eq('student_id', existingStudent.id)
                            .eq('document_type', 'tuition_receipt')
                            .eq('metadata->>payment_id', payment.id)
                            .maybeSingle();

                        if (existingReceipt?.id) {
                            await supabase.from('document_records').update(receiptPayload).eq('id', existingReceipt.id);
                        } else {
                            await supabase.from('document_records').insert(receiptPayload);
                        }
                    }
                } catch (receiptError) {
                    console.error('Error creating receipt document for existing student:', receiptError);
                }
            }

            return { success: true, studentId: existingStudent.student_id, message: 'Student was already enrolled.' };
        }

        // 3. Generate Student Identity (Format: CC + 7 random digits, e.g. CC1234567)
        const studentUser = application.user;
        let studentId = studentUser?.student_id;

        if (!studentId) {
            studentId = `CC${Math.floor(1000000 + Math.random() * 8999999)}`;
        } else if (!studentId.startsWith('CC')) {
            studentId = studentId.replace(/^(SYK|KC|KU|HU)/, 'CC');
        }

        if (!studentUser) {
            throw new Error('Applicant profile not found');
        }

        const firstName = studentUser.first_name || 'Student';
        const lastName = studentUser.last_name || 'Cannoga';
        let institutionalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@cannogacollege.ca`.replace(/\s/g, '');
        let emailCounter = 0;

        while (true) {
            const { data: emailConflict } = await adminClient
                .from('students')
                .select('id')
                .eq('institutional_email', institutionalEmail)
                .single();

            if (!emailConflict) break;

            emailCounter++;
            institutionalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}@cannogacollege.ca`.replace(/\s/g, '');
        }

        // 4. Create Student Record (SIS Handover)
        const admittedAt = offer?.accepted_at || offer?.created_at || application.updated_at || application.submitted_at || application.created_at || new Date().toISOString();

        const { error: studentError, data: newStudent } = await adminClient
            .from('students')
            .insert({
                user_id: application.user_id,
                student_id: studentId,
                application_id: applicationId,
                program_id: application.course_id,
                enrollment_status: 'ACTIVE',
                tuition_deposit_paid: true,
                institutional_email: institutionalEmail,
                personal_email: studentUser.email,
                start_date: admittedAt,
                expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
            })
            .select('id, pal_tal_required, pal_tal_status')
            .single();

        if (studentError) {
            console.error('SIS Creation Failed:', studentError);
            throw new Error(`Failed to create student record: ${studentError.message}`);
        }

        // 4b. Initialize PAL/TAL status for the new student
        if (newStudent?.id) {
            await initializePalForStudent(newStudent.id);
        }

        // 4c. Re-fetch student to get updated PAL/TAL status after initialization
        const { data: updatedStudent } = await adminClient
            .from('students')
            .select('pal_tal_required, pal_tal_status')
            .eq('id', newStudent.id)
            .single();

        if (updatedStudent?.pal_tal_required && updatedStudent.pal_tal_status !== 'verified') {
            throw new Error(`PAL/TAL verification is required before enrollment. Current status: ${updatedStudent.pal_tal_status}`);
        }

        // 4d. Generate LOA document
        try {
            await generateAndStoreLOA(application.id, application as any);
        } catch (loaError) {
            console.error('Failed to generate LOA during enrollment:', loaError);
        }

        // 4e. Generate receipt document if payment exists
        if (payment) {
            try {
                const pdfBuffer = Buffer.from(await renderToBuffer(React.createElement(ReceiptPDF, { application: application as any, payment }) as any));
                const fileName = `receipt-${payment.transaction_reference || payment.id}.pdf`;
                const storagePath = `student-documents/${application.user_id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('application-documents')
                    .upload(storagePath, pdfBuffer, {
                        contentType: 'application/pdf',
                        upsert: true,
                    });

                if (uploadError) {
                    console.error('Receipt upload error during enrollment:', uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('application-documents')
                        .getPublicUrl(storagePath);

                    const receiptPayload = {
                        student_id: newStudent.id,
                        document_type: 'tuition_receipt',
                        title: `Tuition Receipt - ${payment.transaction_reference || payment.id}`,
                        programme: (application as any).course?.title || '',
                        status: 'issued',
                        storage_path: publicUrl,
                        is_official: true,
                        is_student_visible: true,
                        version: 1,
                        issue_date: new Date().toISOString(),
                        metadata: {
                            payment_id: payment.id,
                            transaction_reference: payment.transaction_reference,
                            amount: payment.amount,
                            invoice_type: payment.invoice_type,
                            payment_method: payment.payment_method,
                        },
                    };

                    const { data: existingReceipt } = await supabase
                        .from('document_records')
                        .select('id')
                        .eq('student_id', newStudent.id)
                        .eq('document_type', 'tuition_receipt')
                        .eq('metadata->>payment_id', payment.id)
                        .maybeSingle();

                    if (existingReceipt?.id) {
                        await supabase.from('document_records').update(receiptPayload).eq('id', existingReceipt.id);
                    } else {
                        await supabase.from('document_records').insert(receiptPayload);
                    }
                }
            } catch (receiptError) {
                console.error('Error creating receipt document during enrollment:', receiptError);
            }
        }

        // 5. Lock Admissions & Propagate Student ID to Profile
        const { error: updateError } = await adminClient
            .from('applications')
            .update({ status: 'ENROLLED' })
            .eq('id', applicationId);

        if (updateError) throw updateError;

        // Also update the profile with the student_id and enrollment_date
        const { error: profileError } = await adminClient
            .from('profiles')
            .update({
                student_id: studentId,
                enrollment_date: admittedAt,
                updated_at: new Date().toISOString()
            })
            .eq('id', application.user_id);

        if (profileError) {
            console.error('Failed to update student profile with ID:', profileError);
            // Non-blocking but should be logged
        }

        // 6. Audit Logging
        await adminClient.from('audit_logs').insert({
            action: 'ENROLLMENT_CONCARMED',
            entity_table: 'students',
            entity_id: studentId,
            actor_id: actor.id,
            metadata: {
                previous_status: application.status,
                trigger: 'TUITION_PAYMENT_VERICAED',
                payment_ref: payment?.transaction_reference,
                actor_role: actor.id === application.user_id ? 'APPLICANT' : 'ADMIN'
            }
        });

        // 7. LMS Provisioning
        try {
            await provisionLmsAccount(newStudent.id, institutionalEmail);
        } catch (lmsError) {
            console.error('LMS Provisioning deferred:', lmsError);
        }

        // 8. IT Materials Provisioning (auto-provision all configured assets)
        try {
            await provisionItMaterials(newStudent.id);
        } catch (itError) {
            console.error('IT Materials provisioning deferred:', itError);
        }

        // 9. Generate automatic tasks for the student
        try {
            const { generateAutomaticTasksForStudent } = await import('@/utils/tasks');
            await generateAutomaticTasksForStudent(newStudent.id);
        } catch (taskError) {
            console.error('Task generation deferred:', taskError);
        }

        return { success: true, studentId };

    } catch (error: any) {
        console.error('Enrollment Error:', error);
        return { success: false, error: error.message || 'Enrollment failed.' };
    }
}
