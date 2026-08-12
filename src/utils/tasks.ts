import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export interface StudentTask {
  id: string;
  student_id: string;
  title: string;
  description: string;
  task_type: 'automatic' | 'manual';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  action_url?: string;
  action_label?: string;
  created_by?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getStudentTasks(studentId: string): Promise<StudentTask[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('student_tasks')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function createStudentTask(task: {
  student_id: string;
  title: string;
  description: string;
  task_type: 'automatic' | 'manual';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  action_url?: string;
  action_label?: string;
  created_by?: string;
}): Promise<StudentTask | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('student_tasks')
    .insert({
      ...task,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateStudentTask(taskId: string, updates: {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completed_at?: string;
}): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const updateData: any = { ...updates, updated_at: new Date().toISOString() };

  if (updates.status === 'completed' && !updates.completed_at) {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('student_tasks')
    .update(updateData)
    .eq('id', taskId);

  return !error;
}

export async function deleteStudentTask(taskId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('student_tasks')
    .delete()
    .eq('id', taskId);

  return !error;
}

export async function generateAutomaticTasksForStudent(studentId: string): Promise<{ success: boolean; tasksCreated: number; error?: string }> {
  const supabase = createServiceRoleClient();

  try {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, current_stage, study_permit_status, arrival_status, checkin_status, orientation_status, orientation_scheduled_at, registration_status, application_id, program_id')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return { success: false, tasksCreated: 0, error: 'Student not found' };
    }

    const { data: existingTasks, error: tasksError } = await supabase
      .from('student_tasks')
      .select('title, status')
      .eq('student_id', studentId);

    if (tasksError) {
      return { success: false, tasksCreated: 0, error: tasksError.message };
    }

    const existingTitles = new Set((existingTasks || []).map(t => t.title));
    let tasksCreated = 0;

    const tasksToCreate: Array<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      due_date: string;
    }> = [];

    switch (student.current_stage) {
      case 'tuition_deposit_verified':
        if (!existingTitles.has('PAL Processing Available')) {
          tasksToCreate.push({
            title: 'PAL Processing Available',
            description: 'Your tuition deposit has been verified. Your PAL process is now available where applicable. Please monitor your student portal for updates.',
            priority: 'high',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      case 'pal_issued':
        if (!existingTitles.has('Study Permit Preparation')) {
          tasksToCreate.push({
            title: 'Study Permit Preparation',
            description: 'Your PAL has been issued. You may now proceed with your study permit application. Please follow current Government of Canada instructions.',
            priority: 'high',
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      case 'pre_arrival':
        if (!existingTitles.has('Complete Pre-Arrival Checklist')) {
          tasksToCreate.push({
            title: 'Complete Pre-Arrival Checklist',
            description: 'Please review and complete all pre-arrival requirements before your departure to Canada.',
            priority: 'high',
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      case 'arrival_in_canada':
        if (!existingTitles.has('Complete International Student Check-In')) {
          tasksToCreate.push({
            title: 'Complete International Student Check-In',
            description: 'Please complete your international student check-in process upon arrival in Canada.',
            priority: 'high',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      case 'orientation':
        if (!existingTitles.has('Attend Orientation')) {
          tasksToCreate.push({
            title: 'Attend Orientation',
            description: 'Please attend the scheduled orientation session.',
            priority: 'medium',
            due_date: student.orientation_scheduled_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
      case 'academic_registration':
        if (!existingTitles.has('Complete Academic Registration')) {
          tasksToCreate.push({
            title: 'Complete Academic Registration',
            description: 'Please complete your academic registration for the upcoming term.',
            priority: 'high',
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        break;
    }

    for (const task of tasksToCreate) {
      const { error: createError } = await supabase
        .from('student_tasks')
        .insert({
          student_id: studentId,
          ...task,
          task_type: 'automatic',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (!createError) {
        tasksCreated++;
      }
    }

    return { success: true, tasksCreated };
  } catch (e: any) {
    return { success: false, tasksCreated: 0, error: e?.message || 'Failed to generate tasks' };
  }
}

export async function generateAutomaticTasksForAllStudents(): Promise<{ success: boolean; studentsProcessed: number; totalTasksCreated: number; error?: string }> {
  const supabase = createServiceRoleClient();

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id')
      .in('enrollment_status', ['ACTIVE', 'CONDITIONAL']);

    if (error) {
      return { success: false, studentsProcessed: 0, totalTasksCreated: 0, error: error.message };
    }

    let studentsProcessed = 0;
    let totalTasksCreated = 0;

    for (const student of students || []) {
      const result = await generateAutomaticTasksForStudent(student.id);
      if (result.success) {
        totalTasksCreated += result.tasksCreated;
      }
      studentsProcessed++;
    }

    return { success: true, studentsProcessed, totalTasksCreated };
  } catch (e: any) {
    return { success: false, studentsProcessed: 0, totalTasksCreated: 0, error: e?.message || 'Failed to generate tasks' };
  }
}
