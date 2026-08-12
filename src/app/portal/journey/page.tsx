import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { CurrentStage } from '@/types/journey';
import JourneyTimeline from '@/components/portal/JourneyTimeline';
import CurrentStageCard from '@/components/portal/CurrentStageCard';

export default async function JourneyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Journey</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track your progress through the Cannoga College international student journey.
        </p>
      </div>

      <JourneyClient />
    </div>
  );
}

async function JourneyClient() {
  const supabase = createServiceRoleClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your journey.</p>
      </div>
    );
  }

  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student record not found. Please contact support.</p>
      </div>
    );
  }

  const currentStage = (student.current_stage || 'application') as CurrentStage;

  return (
    <div className="space-y-6">
      <CurrentStageCard
        currentStage={currentStage}
        palStatus={student.pal_status}
        palRequired={student.pal_required}
        studyPermitStatus={student.study_permit_status}
        arrivalStatus={student.arrival_status}
        checkinStatus={student.checkin_status}
        orientationStatus={student.orientation_status}
        registrationStatus={student.registration_status}
        enrollmentStatus={student.enrollment_status}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Timeline</h3>
        <JourneyTimeline
          currentStage={currentStage}
          palStatus={student.pal_status}
          palRequired={student.pal_required}
          studyPermitStatus={student.study_permit_status}
          arrivalStatus={student.arrival_status}
          checkinStatus={student.checkin_status}
          orientationStatus={student.orientation_status}
          registrationStatus={student.registration_status}
          enrollmentStatus={student.enrollment_status}
        />
      </div>
    </div>
  );
}
