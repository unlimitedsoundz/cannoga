import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { CurrentStage, StudyPermitStatus, PreArrivalStatus, ArrivalStatus, CheckinStatus, OrientationStatus, RegistrationStatus } from '@/types/journey';

export async function getStudentJourney(studentId: string) {
  const supabase = createServiceRoleClient();

  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      application:applications(*),
      user:profiles(*),
      program:Course(*, school:School(*))
    `)
    .eq('id', studentId)
    .single();

  if (error || !student) {
    return null;
  }

  return student;
}

export async function updateStudentCurrentStage(studentId: string, stage: CurrentStage, reason?: string) {
  const supabase = createServiceRoleClient();

  const { data: student, error: fetchError } = await supabase
    .from('students')
    .select('id, current_stage, application_id')
    .eq('id', studentId)
    .single();

  if (fetchError || !student) {
    return { success: false, error: 'Student not found' };
  }

  const previousStage = student.current_stage;

  const { error: updateError } = await supabase
    .from('students')
    .update({
      current_stage: stage,
      journey_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await supabase.from('journey_status_history').insert({
    student_id: studentId,
    application_id: student.application_id,
    stage: 'students',
    previous_status: previousStage,
    new_status: stage,
    changed_by: null,
    reason: reason || 'Stage updated',
    metadata: {},
  });

  return { success: true, previousStage, newStage: stage };
}

export async function updateStudyPermitStatus(studentId: string, status: StudyPermitStatus, notes?: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('students')
    .update({
      study_permit_status: status,
      study_permit_notes: notes,
      study_permit_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePreArrivalStatus(studentId: string, status: PreArrivalStatus, notes?: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('students')
    .update({
      pre_arrival_status: status,
      pre_arrival_notes: notes,
      pre_arrival_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function recordArrival(studentId: string, arrivalDate?: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('students')
    .update({
      arrival_status: 'arrived',
      arrival_date: arrivalDate || new Date().toISOString(),
      arrival_notes: 'Student confirmed arrival in Canada',
      arrival_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateCheckinStatus(studentId: string, status: CheckinStatus, notes?: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('students')
    .update({
      checkin_status: status,
      checkin_notes: notes,
      checkin_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateOrientationStatus(studentId: string, status: OrientationStatus, notes?: string) {
  const supabase = createServiceRoleClient();

  const updateData: any = {
    orientation_status: status,
    orientation_notes: notes,
    orientation_updated_at: new Date().toISOString(),
  };

  if (status === OrientationStatus.SCHEDULED) {
    updateData.orientation_scheduled_at = new Date().toISOString();
  } else if (status === OrientationStatus.COMPLETED) {
    updateData.orientation_completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateRegistrationStatus(studentId: string, status: RegistrationStatus) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('students')
    .update({
      registration_status: status,
      registration_updated_at: new Date().toISOString(),
    })
    .eq('id', studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getJourneyStatusHistory(studentId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('journey_status_history')
    .select('*')
    .eq('student_id', studentId)
    .order('changed_at', { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}
