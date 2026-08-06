'use server';

import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { revalidatePath } from 'next/cache';
// --- HELPERS ---

async function uploadFile(file: File, bucket: string = 'content') {
    if (!file || file.size === 0) return null;
    const supabase = await createServerClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}

// --- COURSES ---

export async function createCourse(formData: FormData) {
    const supabase = await createServerClient();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const degreeLevel = formData.get('degreeLevel') as any;
    const schoolId = formData.get('schoolId') as string;

    const { error } = await supabase.from('Course').insert({
        title,
        slug,
        degreeLevel,
        schoolId,
        duration: formData.get('duration') as string || '3 years',
        language: formData.get('language') as string || 'English',
        description: formData.get('description') as string,
        tuitionFee: formData.get('tuitionFee') as string,
        credits: parseInt(formData.get('credits') as string) || 0,
    });

    if (error) throw new Error((error as any).message);
    revalidatePath('/studies');
    if (slug) revalidatePath(`/studies/${slug}`);
}

export async function updateCourse(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const slug = formData.get('slug') as string;

    const { error } = await supabase.from('Course').update({
        title: formData.get('title') as string,
        slug,
        degreeLevel: formData.get('degreeLevel') as any,
        schoolId: formData.get('schoolId') as string,
        duration: formData.get('duration') as string,
        language: formData.get('language') as string,
        description: formData.get('description') as string,
        tuitionFee: formData.get('tuitionFee') as string,
        credits: parseInt(formData.get('credits') as string) || 0,
    }).eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/studies');
    if (slug) revalidatePath(`/studies/${slug}`);
}

export async function deleteCourse(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Course').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/studies');
}

// --- NEWS ---

export async function createNews(formData: FormData) {
    const supabase = await createServerClient();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File;
    const publishDate = formData.get('publishDate') as string || new Date().toISOString();

    const imageUrl = await uploadFile(imageFile);

    const { error } = await supabase.from('News').insert({
        title,
        slug,
        content,
        imageUrl,
        publishDate,
        published: formData.get('published') === 'true',
    });

    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
    if (slug) revalidatePath(`/news/${slug}`);
}

export async function updateNews(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const imageFile = formData.get('image') as File;
    const imageUrl = await uploadFile(imageFile);
    const slug = formData.get('slug') as string;

    const updateData: any = {
        title: formData.get('title') as string,
        slug,
        content: formData.get('content') as string,
        publishDate: formData.get('publishDate') as string,
    };

    if (imageUrl) updateData.imageUrl = imageUrl;

    const { error } = await supabase.from('News').update(updateData).eq('id', id);

    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
    if (slug) revalidatePath(`/news/${slug}`);
}

export async function deleteNews(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('News').delete().eq('id', id);
    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
}

// --- EVENTS ---

export async function createEvent(formData: FormData) {
    const supabase = await createServerClient();
    const imageFile = formData.get('image') as File;
    const imageUrl = await uploadFile(imageFile);
    const slug = formData.get('slug') as string;

    const { error } = await supabase.from('Event').insert({
        title: formData.get('title') as string,
        slug,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        category: formData.get('category') as string,
        content: formData.get('content') as string,
        imageUrl,
        published: true,
    });

    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
    if (slug) revalidatePath(`/news/events/${slug}`);
}

export async function updateEvent(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const imageFile = formData.get('image') as File;
    const imageUrl = await uploadFile(imageFile);
    const slug = formData.get('slug') as string;

    const updateData: any = {
        title: formData.get('title') as string,
        slug,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        category: formData.get('category') as string,
        content: formData.get('content') as string,
    };

    if (imageUrl) updateData.imageUrl = imageUrl;

    const { error } = await supabase.from('Event').update(updateData).eq('id', id);

    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
    if (slug) revalidatePath(`/news/events/${slug}`);
}

export async function deleteEvent(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Event').delete().eq('id', id);
    if (error) throw new Error((error as any).message);
    revalidatePath('/news');
}

// --- SUBJECTS ---

export async function createSubject(formData: FormData) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Subject').insert({
        name: formData.get('name') as string,
        creditUnits: parseInt(formData.get('creditUnits') as string) || 5,
        semester: parseInt(formData.get('semester') as string) || 1,
        courseId: formData.get('courseId') as string,
        code: formData.get('code') as string,
        area: formData.get('area') as string,
    });

    if (error) throw new Error(error.message);
}

export async function updateSubject(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Subject').update({
        name: formData.get('name') as string,
        creditUnits: parseInt(formData.get('creditUnits') as string) || 5,
        semester: parseInt(formData.get('semester') as string) || 1,
        courseId: formData.get('courseId') as string,
        code: formData.get('code') as string,
        area: formData.get('area') as string,
    }).eq('id', id);

    if (error) throw new Error(error.message);
}

export async function deleteSubject(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Subject').delete().eq('id', id);
    if (error) throw new Error(error.message);
}

// --- STUDENTS ---

export async function updateStudentStatus(id: string, status: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Student').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
}

export async function updateStudentTuition(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const tuitionPaid = formData.get('tuitionPaid') === 'true';
    const tuitionAmount = formData.get('tuitionAmount') as string;

    const { error } = await supabase.from('Student').update({
        tuitionPaid,
        tuitionAmount,
        paymentDate: tuitionPaid ? new Date().toISOString() : null
    }).eq('id', id);

    if (error) throw new Error(error.message);
}

export async function deleteStudent(id: string) {
    const adminClient = createServiceRoleClient();

    // 1. Delete associated module enrollments first (SIS integrity)
    const { error: enrollmentError } = await adminClient
        .from('module_enrollments')
        .delete()
        .eq('student_id', id);

    if (enrollmentError) throw new Error(`Failed to clear enrollments: ${enrollmentError.message}`);

    // 2. Delete the student record from SIS
    const { error } = await adminClient
        .from('students')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// --- FACULTY ---

export async function createFaculty(formData: FormData) {
    const supabase = await createServerClient();
    const imageFile = formData.get('image') as File;
    const imageUrl = await uploadFile(imageFile);

    const { error } = await supabase.from('Faculty').insert({
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        bio: formData.get('bio') as string,
        email: formData.get('email') as string,
        schoolId: formData.get('schoolId') as string,
        departmentId: formData.get('departmentId') as string || null,
        imageUrl,
    });

    if (error) throw new Error(error.message);
}

export async function updateFaculty(id: string, formData: FormData) {
    const supabase = await createServerClient();
    const imageFile = formData.get('image') as File;
    const imageUrl = await uploadFile(imageFile);

    const updateData: any = {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        bio: formData.get('bio') as string,
        email: formData.get('email') as string,
        schoolId: formData.get('schoolId') as string,
        departmentId: formData.get('departmentId') as string || null,
    };

    if (imageUrl) updateData.imageUrl = imageUrl;

    const { error } = await supabase.from('Faculty').update(updateData).eq('id', id);

    if (error) throw new Error(error.message);
}

export async function deleteFaculty(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from('Faculty').delete().eq('id', id);
    if (error) throw new Error(error.message);


}

// --- DEPARTMENTS ---

// Note: Department updates are now handled by /api/departments route to ensure
// reliable image uploads and database persistence via service role.

export async function adminApproveTuition(applicationId: string) {
    const supabase = await createServerClient();
    const adminClient = createServiceRoleClient();

    // 1. Check/Create Payment
    // We assume if admin clicks this, they verified payment offline or just want to override.
    const { data: application } = await supabase
        .from('applications')
        .select(`*, offer:admission_offers(*)`)
        .eq('id', applicationId)
        .single();

    if (!application || !application.offer?.[0]) throw new Error('Application or Offer not found');
    const offer = application.offer[0];

    // Check existing payment
    const { data: existingPayment } = await supabase
        .from('tuition_payments')
        .select('*')
        .eq('offer_id', offer.id)
        .single();

    if (!existingPayment) {
        // Create override payment
        await adminClient.from('tuition_payments').insert({
            offer_id: offer.id,
            amount: offer.tuition_fee, // Full amount
            status: 'COMPLETED',
            payment_method: 'MANUAL_ADMIN_OVERRIDE',
            transaction_reference: `MANUAL-${new Date().getTime()}`
        });
    } else if (existingPayment.status !== 'COMPLETED') {
        // Update to completed
        await adminClient.from('tuition_payments')
            .update({ status: 'COMPLETED' })
            .eq('id', existingPayment.id);
    }

    // 2. Trigger Enrollment
    const { confirmEnrollment } = await import('@/app/portal/enrollment-actions');
    const result = await confirmEnrollment(applicationId);

    if (!result.success) {
        throw new Error(result.error || 'Enrollment failed');
    }
}

// --- RESEARCH PROJECTS ---

export async function createResearchProject(formData: FormData) {
    console.log('SERVER ACTION: createResearchProject called');
    try {
        const supabase = await createServerClient();
        const imageFile = formData.get('image') as File;
        const imageUrl = await uploadFile(imageFile);

        const { error } = await supabase.from('ResearchProject').insert({
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            leadResearcher: formData.get('leadResearcher') as string,
            fundingSource: formData.get('fundingSource') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
            imageUrl,
        });

        if (error) throw new Error(error.message);
        revalidatePath('/research/projects');
        const slug = formData.get('slug') as string;
        if (slug) revalidatePath(`/research/projects/${slug}`);
    } catch (e: any) {
        console.error('Create Research Project Error:', e);
        throw new Error(e.message);
    }
}

export async function updateResearchProject(id: string, formData: FormData) {
    try {
        console.log('SERVER ACTION: updateResearchProject', id);
        const supabase = await createServerClient();
        const imageFile = formData.get('image') as File;

        console.log('Image from FormData:', {
            name: imageFile?.name,
            size: imageFile?.size,
            type: imageFile?.type
        });

        const imageUrl = await uploadFile(imageFile);
        console.log('Uploaded Image URL:', imageUrl);

        const slug = formData.get('slug') as string;

        const updateData: any = {
            title: formData.get('title') as string,
            slug,
            leadResearcher: formData.get('leadResearcher') as string,
            fundingSource: formData.get('fundingSource') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
            updatedAt: new Date().toISOString(),
        };

        if (imageUrl) {
            console.log('Updating imageUrl in DB to:', imageUrl);
            updateData.imageUrl = imageUrl;
        } else {
            console.log('No new image uploaded, keeping existing.');
        }

        const { error } = await supabase.from('ResearchProject').update(updateData).eq('id', id);

        if (error) throw new Error(error.message);
        revalidatePath('/research/projects');
        if (slug) revalidatePath(`/research/projects/${slug}`);
    } catch (e: any) {
        console.error('Update Research Project Error:', e);
        throw new Error(e.message);
    }

    // Assuming slug doesn't change or we redirect to list anyway
}

export async function deleteResearchProject(formData: FormData) {
    const id = formData.get('id') as string;
    const supabase = await createServerClient();
    const { error } = await supabase.from('ResearchProject').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/research/projects');
}

export async function getAdmissionsApplications() {
    console.log('SERVER ACTION: getAdmissionsApplications called');
    const adminClient = createServiceRoleClient();

    try {
        const { data, error } = await adminClient
            .from('applications')
            .select(`
                *,
                course:Course(title),
                user:profiles(first_name, last_name, email, student_id)
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message || 'Failed to fetch applications');
        return { success: true, data };
    } catch (e: any) {
        console.error('getAdmissionsApplications Error:', e);
        return { success: false, error: e.message || 'An unexpected error occurred' };
    }
}

export async function getAdmissionsApplicationById(id: string) {
    console.log('SERVER ACTION: getAdmissionsApplicationById called for', id);
    const adminClient = createServiceRoleClient();

    try {
        const { data, error } = await adminClient
            .from('applications')
            .select(`
                *,
                course:Course(*, school:School(slug)),
                user:profiles(*),
                documents:application_documents(*),
                offer:admission_offers(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw new Error(error.message || 'Failed to fetch application details');

        const { data: admData } = await adminClient
            .from('admissions')
            .select('*')
            .eq('user_id', data.user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        return { success: true, data, admissions: admData };
    } catch (e: any) {
        console.error('getAdmissionsApplicationById Error:', e);
        return { success: false, error: e.message };
    }
}

export async function updateApplicationStatusAdmin(id: string, status: string) {
    console.log('SERVER ACTION: updateApplicationStatusAdmin called for', id, 'to', status);
    const adminClient = createServiceRoleClient();
    try {
        const { error } = await adminClient
            .from('applications')
            .update({ status })
            .eq('id', id);
        if (error) throw new Error(error.message || 'Failed to update application status');

        return { success: true };
    } catch (e: any) {
        console.error('updateApplicationStatusAdmin Error:', e);
        return { success: false, error: e.message || 'An unexpected error occurred' };
    }
}

export async function updateApplicationInternalNotesAdmin(id: string, notes: string) {
    console.log('SERVER ACTION: updateApplicationInternalNotesAdmin called for', id);
    const adminClient = createServiceRoleClient();
    try {
        const { error } = await adminClient
            .from('applications')
            .update({ internal_notes: notes })
            .eq('id', id);
        if (error) throw new Error(error.message || 'Failed to update internal notes');
        return { success: true };
    } catch (e: any) {
        console.error('updateApplicationInternalNotesAdmin Error:', e);
        return { success: false, error: e.message };
    }
}

export async function getAdminDashboardStats() {
    const adminClient = createServiceRoleClient();
    try {
        const [
            { count: courseCount },
            { count: newsCount },
            { count: eventCount },
            { count: subjectCount },
            { count: facultyCount },
            { count: departmentCount },
            { count: housingAppsCount },
            { count: registrarCount },
            { data: apps, count: totalApps },
            { data: allApps }
        ] = await Promise.all([
            adminClient.from('Course').select('*', { count: 'exact', head: true }),
            adminClient.from('News').select('*', { count: 'exact', head: true }),
            adminClient.from('Event').select('*', { count: 'exact', head: true }),
            adminClient.from('Subject').select('*', { count: 'exact', head: true }),
            adminClient.from('Faculty').select('*', { count: 'exact', head: true }),
            adminClient.from('Department').select('*', { count: 'exact', head: true }),
            adminClient.from('housing_applications').select('*', { count: 'exact', head: true }),
            adminClient.from('registration_windows').select('*', { count: 'exact', head: true }),
            adminClient.from('applications').select('*, course:Course(title), user:profiles(first_name, last_name, email)', { count: 'exact' }).neq('status', 'DRAFT').order('submitted_at', { ascending: false }).limit(5),
            adminClient.from('applications').select('status')
        ]);

        const statusCounts = {
            SUBMITTED: allApps?.filter((s: any) => s.status === 'SUBMITTED').length || 0,
            UNDER_REVIEW: allApps?.filter((s: any) => s.status === 'UNDER_REVIEW' || s.status === 'DOCS_REQUIRED').length || 0,
            ADMITTED: allApps?.filter((s: any) => s.status === 'ADMITTED' || s.status === 'OFFER_ACCEPTED').length || 0,
            REJECTED: allApps?.filter((s: any) => s.status === 'REJECTED' || s.status === 'OFFER_DECLINED').length || 0,
        };

        const stats = [
            { label: 'Courses', count: courseCount, icon: 'BookOpen', color: 'bg-blue-500', href: '/sis/admin/courses' },
            { label: 'News Stories', count: newsCount, icon: 'Newspaper', color: 'bg-neutral-800', href: '/sis/admin/news' },
            { label: 'Campus Events', count: eventCount, icon: 'Calendar', color: 'bg-neutral-500', href: '/sis/admin/events' },
            { label: 'Applications', count: totalApps, icon: 'FileText', color: 'bg-amber-500', href: '/sis/admin/admissions' },
            { label: 'Housing Applications', count: housingAppsCount, icon: 'Home', color: 'bg-teal-500', href: '/sis/admin/housing' },
            { label: 'Faculty Members', count: facultyCount, icon: 'Users', color: 'bg-neutral-900', href: '/sis/admin/faculty' },
            { label: 'Academic Departments', count: departmentCount, icon: 'SchoolIcon', color: 'bg-neutral-600', href: '/sis/admin/departments' },
            { label: 'Registrar Windows', count: registrarCount, icon: 'FileText', color: 'bg-neutral-800', href: '/sis/admin/registrar' },
        ];

        return { success: true, stats, apps: apps || [], statusCounts, appsCount: totalApps || 0 };
    } catch (e: any) {
        console.error('getAdminDashboardStats Error:', e);
        return { success: false, error: e.message };
    }
}
