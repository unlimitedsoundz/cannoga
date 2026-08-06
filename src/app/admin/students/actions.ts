import { createAdminClient } from '@/utils/supabase/admin';
import { initializePalForStudent } from '@/utils/pal-status';
/**
 * Enrolls a student officially after tuition payment.
 */
export async function enrollStudent(applicationId: string) {
    const supabase = await createAdminClient();

    try {
        console.log('Enrollment: Starting for application', applicationId);

        // 1. Fetch application and related data
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select(`
                *,
                user:profiles!user_id(*),
                course:Course(*),
                offer:admission_offers(*)
            `)
            .eq('id', applicationId)
            .single();

        if (appError || !application) {
            console.error('Enrollment: Application not found', appError);
            return { success: false, error: 'Application not found' };
        }

        const user = application.user;
        const currentYear = new Date().getFullYear();
        const offer = Array.isArray(application.offer) ? application.offer[0] : application.offer;
        const admittedAt = offer?.accepted_at || offer?.created_at || application.updated_at || application.submitted_at || application.created_at || new Date().toISOString();

        // 2. Student ID Handling
        // Force 'CC' prefix, even if profile has an old ID (like 'SYK', 'KC', or 'KU')
        let studentId = user.student_id;
        if (!studentId || !studentId.startsWith('CC')) {
            // Generate CC followed by 7 random digits (e.g., CC1234567)
            studentId = `CC${Math.floor(1000000 + Math.random() * 8999999)}`;
        }

        // 3. Generate Unique Institutional Email
        let institutionalEmail = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@cannogacollege.ca`;

        // Sanitize (remove spaces, etc.)
        institutionalEmail = institutionalEmail.replace(/\s+/g, '');

        // Check if email already exists in students table
        const { data: existingEmail } = await supabase
            .from('students')
            .select('institutional_email')
            .eq('institutional_email', institutionalEmail)
            .maybeSingle();

        if (existingEmail) {
            // Append a random number if conflict
            institutionalEmail = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}${Math.floor(Math.random() * 100)}@cannogacollege.ca`.replace(/\s+/g, '');
        }

        // 4. Create Student Record
        const { data: student, error: studentError } = await supabase
            .from('students')
            .upsert({
                user_id: user.id,
                student_id: studentId,
                application_id: application.id,
                program_id: application.course_id,
                institutional_email: institutionalEmail,
                personal_email: user.email,
                enrollment_status: 'ACTIVE',
                tuition_deposit_paid: true,
                start_date: admittedAt,
                expected_graduation_date: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString()
            }, {
                onConflict: 'application_id'
            })
            .select('id, pal_tal_required, pal_tal_status')
            .single();

        if (studentError) {
            console.error('Enrollment: Failed to create student record', studentError);
            return { success: false, error: `Failed to create student record: ${studentError.message}` };
        }

        // 4b. Initialize PAL/TAL status for the student
        if (student?.id) {
            await initializePalForStudent(student.id);
        }

        // 4c. Check PAL/TAL status before finalizing enrollment
        const { data: updatedStudent } = await supabase
            .from('students')
            .select('pal_tal_required, pal_tal_status')
            .eq('id', student.id)
            .single();

        if (updatedStudent?.pal_tal_required && updatedStudent.pal_tal_status !== 'verified') {
            return { success: false, error: `PAL/TAL verification is required before enrollment. Current status: ${updatedStudent.pal_tal_status}` };
        }


        // 5. Update Application Status
        const { error: updateError } = await supabase
            .from('applications')
            .update({
                status: 'ENROLLED',
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId);

        if (updateError) {
            console.warn('Enrollment: Success but failed to update application status', updateError);
        }

        // 6. Update User Profile Role
        await supabase
            .from('profiles')
            .update({ role: 'STUDENT', student_id: studentId })
            .eq('id', user.id);

        // 7. Verify Payment Record (Atomic Update)
        const { data: offerRecord } = await supabase
            .from('admission_offers')
            .select('id')
            .eq('application_id', applicationId)
            .maybeSingle();

        if (offerRecord) {
            await supabase
                .from('tuition_payments')
                .update({ status: 'verified' })
                .eq('offer_id', offerRecord.id)
                .eq('status', 'PENDING_VERIFICATION');
        }

        // 8. Trigger Post-Enrollment Actions (Docs & Email)
        try {
            const { generateAndStoreAdmissionLetter, generateAndStoreReceipt } = await import('../admissions/pdf-actions');
            await generateAndStoreAdmissionLetter(applicationId);
            await generateAndStoreReceipt(applicationId);

            // Welcome Email and other notifications are now handled by database 
            // triggers on 'applications' and 'tuition_payments' status changes.
        } catch (postError) {
            console.error('Enrollment: Post-action error', postError);
        }

        // 9. Generate automatic tasks for the student
        try {
            const { generateAutomaticTasksForStudent } = await import('@/utils/tasks');
            await generateAutomaticTasksForStudent(student.id);
        } catch (taskError) {
            console.error('Enrollment: Task generation error', taskError);
        }

        console.log('Enrollment: Success for', user.email);
        return { success: true, studentId };

    } catch (e: any) {
        console.error('Enrollment: Unexpected error', e);
        return { success: false, error: e.message };
    }
}

/**
 * Deletes a student record and reverts associated profile and application statuses.
 */
export async function deleteStudent(studentId: string) {
    const supabase = await createAdminClient();

    try {
        console.log('Deletion: Starting for student', studentId);

        // 1. Fetch student data to get application_id and user_id
        const { data: student, error: fetchError } = await supabase
            .from('students')
            .select('application_id, user_id')
            .eq('id', studentId)
            .single();

        if (fetchError || !student) {
            console.error('Deletion: Student not found', fetchError);
            return { success: false, error: 'Student record not found' };
        }

        // 2. Delete from module_enrollments
        const { error: enrollmentError } = await supabase
            .from('module_enrollments')
            .delete()
            .eq('student_id', studentId);

        if (enrollmentError) {
            console.error('Deletion: Failed to delete enrollments', enrollmentError);
            return { success: false, error: `Failed to clear enrollments: ${enrollmentError.message}` };
        }

        // 3. Delete from students table
        const { error: studentError } = await supabase
            .from('students')
            .delete()
            .eq('id', studentId);

        if (studentError) {
            console.error('Deletion: Failed to delete student record', studentError);
            return { success: false, error: `Failed to delete student record: ${studentError.message}` };
        }

        // 4. Revert profile role to APPLICANT and clear student_id
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'APPLICANT', student_id: null })
            .eq('id', student.user_id);

        if (profileError) {
            console.warn('Deletion: Student deleted but failed to revert profile role', profileError);
        }

        // 5. Revert application status to PAYMENT_SUBMITTED
        const { error: appError } = await supabase
            .from('applications')
            .update({ status: 'PAYMENT_SUBMITTED' })
            .eq('id', student.application_id);

        if (appError) {
            console.warn('Deletion: Student deleted but failed to revert application status', appError);
        }

        console.log('Deletion: Success for student', studentId);
        return { success: true };

    } catch (e: any) {
        console.error('Deletion: Unexpected error', e);
        return { success: false, error: e.message };
    }
}
