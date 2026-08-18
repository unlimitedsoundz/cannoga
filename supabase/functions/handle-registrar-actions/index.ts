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

    const { action, payload } = await req.json();

    let result;
    let error;

    switch (action) {
      case 'UPDATE_WINDOW_STATUS':
        ({ data: result, error } = await supabase
          .from('registration_windows')
          .update({ status: payload.status })
          .eq('id', payload.id));
        break;

      case 'SAVE_WINDOW':
        const windowData = {
          semester_id: payload.data.semester_id,
          status: payload.data.status,
          open_at: payload.data.open_at || null,
          close_at: payload.data.close_at || null,
          add_drop_deadline: payload.data.add_drop_deadline || null
        };
        if (payload.id) {
          ({ data: result, error } = await supabase
            .from('registration_windows')
            .update(windowData)
            .eq('id', payload.id));
        } else {
          ({ data: result, error } = await supabase
            .from('registration_windows')
            .insert(windowData));
        }
        break;

      case 'SAVE_SEMESTER':
        const semData = {
          name: payload.data.name,
          start_date: payload.data.start_date || null,
          end_date: payload.data.end_date || null,
          status: payload.data.status
        };
        if (payload.id) {
          ({ data: result, error } = await supabase
            .from('semesters')
            .update(semData)
            .eq('id', payload.id));
        } else {
          ({ data: result, error } = await supabase
            .from('semesters')
            .insert(semData));
        }
        break;

      case 'CANALIZE_GRADE':
        ({ data: result, error } = await supabase
          .from('module_enrollments')
          .update({
            grade_status: 'CANAL',
            finalized_at: new Date().toISOString()
          })
          .eq('id', payload.id));
        break;

      case 'UPDATE_STUDENT_STATUS':
        ({ data: result, error } = await supabase
          .from('students')
          .update({ enrollment_status: payload.status })
          .eq('id', payload.id));
        break;

      case 'UPDATE_SEMESTER_STATUS':
        ({ data: result, error } = await supabase
          .from('semesters')
          .update({ status: payload.status })
          .eq('id', payload.id));
        break;

      case 'SAVE_SESSION':
        if (payload.id) {
          ({ data: result, error } = await supabase
            .from('class_sessions')
            .update(payload.data)
            .eq('id', payload.id));
        } else {
          ({ data: result, error } = await supabase
            .from('class_sessions')
            .insert(payload.data));
        }
        break;

      case 'DELETE_ENTITY':
        ({ data: result, error } = await supabase
          .from(payload.table)
          .delete()
          .eq('id', payload.id));
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in handle-registrar-actions:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
