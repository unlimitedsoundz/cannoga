'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import AcademicDashboard from '@/components/portal/AcademicDashboard';

export default function StudentPortalPage() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // 1. Primary Auth Check (Supabase)
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                let currentUserEmail = sbUser?.email;
                let currentUserId = sbUser?.id;

                // 2. Secondary Auth Check (LocalStorage Fallback)
                if (!sbUser) {
                    const savedUser = localStorage.getItem('Cannoga_user');
                    if (savedUser) {
                        const localProfile = JSON.parse(savedUser);
                        currentUserEmail = localProfile.email;
                        currentUserId = localProfile.id;
                    }
                }

                if (!currentUserEmail) {
                    router.push('/portal/account/login');
                    return;
                }

                // Fetch Student Record (SIS) with relations
                const { data: studentData, error } = await supabase
                    .from('students')
                    .select(`
                        *,
                        program:Course(*),
                        user:profiles(*),
                        application:applications(*)
                    `)
                    .eq('user_id', currentUserId || '')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching student record:', error.message, error.details);
                    router.push('/portal/dashboard');
                    return;
                }

                if (!studentData) {
                    // If no student record, redirect back to application dashboard
                    // This is a normal state for applicants who haven't been enrolled yet
                    router.push('/portal/dashboard');
                } else if (studentData.application?.status === 'PAYMENT_SUBMITTED') {
                    // Security Check: If payment is pending verification, they are not yet fully enrolled students
                    console.log('Redirecting pending student to dashboard');
                    router.push('/portal/dashboard');
                } else {
                    setStudent(studentData);
                }
            } catch (err) {
                console.error('CRITICAL: Fetching student data failed', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    if (!student) return null;

    return <AcademicDashboard student={student} />;
}
