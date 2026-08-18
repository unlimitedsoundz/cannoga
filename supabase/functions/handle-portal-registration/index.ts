// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) throw new Error('Unauthorized');

    const { action, payload } = await req.json();

    // 1. Fetch Student Data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select(`id, enrollment_status, user_id, program_id`)
      .eq('user_id', user.id)
      .single();

    if (studentError || !student) throw new Error('Student record not found');
    if (student.enrollment_status !== 'ACTIVE') throw new Error('Only active students can register for courses.');

    let result;
    let error;

    switch (action) {
      case 'REGISTER_MODULE':
        const { moduleId } = payload;
        
        // 2. Fetch Subject & Window
        const { data: subjectData, error: subjectError } = await supabase
          .from('Subject')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (subjectError || !subjectData) throw new Error('Subject not found');

        // Security check: Ensure subject belongs to student's program
        if (subjectData.courseId !== student.program_id) {
          throw new Error('This subject is not part of your enrolled program.');
        }

        const { data: window, error: windowError } = await supabase
          .from('registration_windows')
          .select('*, semesters(*)')
          .eq('status', 'OPEN')
          .order('open_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (windowError || !window) throw new Error('Registration window is currently closed.');

        // 4. Credit Limit Check
        const { data: existingEnrollments } = await supabase
          .from('module_enrollments')
          .select('subject_id')
          .eq('student_id', student.id)
          .eq('semester_id', window.semester_id)
          .eq('status', 'REGISTERED');

        let currentCredits = 0;
        if (existingEnrollments && existingEnrollments.length > 0) {
          const subjectIds = existingEnrollments.map(e => e.subject_id).filter(Boolean);
          const { data: subjects } = await supabase
            .from('Subject')
            .select('creditUnits')
            .in('id', subjectIds);

          currentCredits = (subjects || []).reduce((sum, s) => sum + (s.creditUnits || 0), 0);
        }

        const MAX_CREDITS = 35;
        if (currentCredits + subjectData.creditUnits > MAX_CREDITS) {
          throw new Error(`Credit limit exceeded. Maximum per semester is ${MAX_CREDITS} credits.`);
        }

        // 5. Execute Enrollment
        ({ error } = await supabase
          .from('module_enrollments')
          .upsert({
            student_id: student.id,
            subject_id: moduleId,
            semester_id: window.semester_id,
            status: 'REGISTERED',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'student_id, subject_id, semester_id'
          }));

        if (error) throw error;

        // 6. Audit Logging & LMS Sync Simulation
        await supabase.from('audit_logs').insert([
          {
            action: 'SUBJECT_REGISTRATION',
            entity_table: 'module_enrollments',
            entity_id: moduleId,
            actor_id: user.id,
            metadata: {
              subject_code: subjectData.code,
              semester: window.semesters.name,
              credits: subjectData.creditUnits
            }
          },
          {
            action: 'LMS_COURSE_SYNC',
            entity_table: 'module_enrollments',
            entity_id: `${student.id}:${moduleId}`,
            metadata: {
              student_id: student.id,
              module_id: moduleId,
              semester_id: window.semester_id,
              status: 'GRANTED'
            }
          }
        ]);
        break;

      case 'DROP_MODULE':
        const { enrollmentId } = payload;
        
        const { data: enrollment, error: fetchError } = await supabase
          .from('module_enrollments')
          .select('*')
          .eq('id', enrollmentId)
          .single();

        if (fetchError || !enrollment) throw new Error('Enrollment not found');

        const { data: regWindow, error: regWindowError } = await supabase
          .from('registration_windows')
          .select('*')
          .eq('semester_id', enrollment.semester_id)
          .eq('status', 'OPEN')
          .order('open_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (regWindowError || !regWindow) {
          throw new Error('Registration window is currently closed for this term.');
        }

        const deadline = new Date(regWindow.add_drop_deadline);
        if (new Date() > deadline) {
          throw new Error('The add/drop deadline has passed.');
        }

        ({ error } = await supabase
          .from('module_enrollments')
          .update({ status: 'DROPPED', updated_at: new Date().toISOString() })
          .eq('id', enrollmentId));

        if (error) throw error;

        await supabase.from('audit_logs').insert({
          action: 'MODULE_DROPPED',
          entity_table: 'module_enrollments',
          entity_id: enrollmentId,
          actor_id: user.id
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in handle-portal-registration:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
