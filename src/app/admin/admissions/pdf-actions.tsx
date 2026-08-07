'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { pdf } from '@react-pdf/renderer';
import LetterOfAcceptancePDF from '@/components/portal/pdf/LetterOfAcceptancePDF';
import ConditionalOfferPDF from '@/components/portal/pdf/ConditionalOfferPDF';
import React from 'react';

export async function generateAndStoreOfferLetter(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            throw new Error('Application not found');
        }

        const pdfBlob = await pdf(
            React.createElement(LetterOfAcceptancePDF, { application }) as React.ReactElement
        ).toBlob();

        const fileName = `letter-of-acceptance-${application.course?.slug || application.id}.pdf`;
        const storagePath = `student-documents/${application.user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('application-documents')
            .upload(storagePath, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (uploadError) {
            console.error('PDF upload error:', uploadError);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('application-documents')
            .getPublicUrl(storagePath);

        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', application.user_id)
            .maybeSingle();

        if (student) {
            const { error: docError } = await supabase
                .from('document_records')
                .upsert({
                    student_id: student.id,
                    document_type: 'loa',
                    title: `Letter of Acceptance - ${application.course?.title || 'Program'}`,
                    programme: application.course?.title || '',
                    status: 'active',
                    storage_path: publicUrl,
                    is_official: true,
                    is_student_visible: true,
                    metadata: {
                        application_id: application.id,
                        course_id: application.course?.id,
                        degree_level: application.course?.degreeLevel,
                        programme_slug: application.course?.slug,
                    },
                }, {
                    onConflict: 'student_id,document_type',
                });

            if (docError) {
                console.error('Document record creation error:', docError);
            }
        }

        const { data: offer } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (offer) {
            await supabase
                .from('admission_offers')
                .update({ document_url: publicUrl })
                .eq('id', offer.id);
        }

        return { success: true, url: publicUrl };
    } catch (e: any) {
        console.error('Error generating offer letter:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreAdmissionLetter(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(*)),
                user:profiles(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            throw new Error('Application not found');
        }

        const pdfBlob = await pdf(
            React.createElement(LetterOfAcceptancePDF, { application, admissionDetails: application } as any) as React.ReactElement
        ).toBlob();

        const fileName = `admission-letter-${application.course?.slug || application.id}.pdf`;
        const storagePath = `student-documents/${application.user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('application-documents')
            .upload(storagePath, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (uploadError) {
            console.error('PDF upload error:', uploadError);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('application-documents')
            .getPublicUrl(storagePath);

        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', application.user_id)
            .maybeSingle();

        if (student) {
            const { error: docError } = await supabase
                .from('document_records')
                .upsert({
                    student_id: student.id,
                    document_type: 'admission_letter',
                    title: `Admission Letter - ${application.course?.title || 'Program'}`,
                    programme: application.course?.title || '',
                    status: 'active',
                    storage_path: publicUrl,
                    is_official: true,
                    is_student_visible: true,
                    metadata: {
                        application_id: application.id,
                        course_id: application.course?.id,
                        degree_level: application.course?.degreeLevel,
                        programme_slug: application.course?.slug,
                    },
                }, {
                    onConflict: 'student_id,document_type',
                });

            if (docError) {
                console.error('Document record creation error:', docError);
            }
        }

        const { data: offer } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .single();

        if (offer) {
            await supabase
                .from('admission_offers')
                .update({ document_url: publicUrl })
                .eq('id', offer.id);
        }

        return { success: true, url: publicUrl };
    } catch (e: any) {
        console.error('Error generating admission letter:', e);
        return { success: false, error: e.message };
    }
}

export async function generateAndStoreReceipt(applicationId: string) {
    const supabase = createServiceRoleClient();
    try {
        const receiptUrl = `https://cannogacollege.ca/portal/application/receipt?id=${applicationId}`;

        return { success: true, url: receiptUrl };
    } catch (e: any) {
        console.error('Error generating receipt link:', e);
        return { success: false, error: e.message };
    }
}
