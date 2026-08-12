import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import AdminJourneyTimeline from '@/components/sis/AdminJourneyTimeline';

export default async function AdminStudentJourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      user:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found.</p>
      </div>
    );
  }

  const user = student.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Journey</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage the student&apos;s journey through the international student workflow.
        </p>
      </div>

      <AdminJourneyTimeline
        student={{
          id: student.id,
          first_name: user?.first_name || 'Unknown',
          last_name: user?.last_name || 'Unknown',
          student_id: student.student_id,
          email: user?.email || 'N/A',
          current_stage: student.current_stage || 'application',
          pal_status: student.pal_status,
          pal_required: student.pal_required,
          study_permit_status: student.study_permit_status,
          arrival_status: student.arrival_status,
          checkin_status: student.checkin_status,
          orientation_status: student.orientation_status,
          registration_status: student.registration_status,
          enrollment_status: student.enrollment_status,
        }}
      />
    </div>
  );
}
