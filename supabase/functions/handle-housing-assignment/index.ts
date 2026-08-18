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

    const { applicationId, roomId, studentId, startDate, endDate, monthlyRate } = await req.json();

    // 1. Create Assignment
    const { data: assignment, error: assignError } = await supabase
      .from('housing_assignments')
      .insert({
        student_id: studentId,
        room_id: roomId,
        application_id: applicationId,
        start_date: startDate,
        end_date: endDate,
        status: 'ASSIGNED'
      })
      .select('*, room:housing_rooms(*, building:housing_buildings(*)), student:students(*, user:profiles(*)), application:housing_applications(*)')
      .single();

    if (assignError) throw assignError;

    // 2. Update Room Status
    const { error: roomError } = await supabase
      .from('housing_rooms')
      .update({ status: 'OCCUPIED' })
      .eq('id', roomId);

    if (roomError) throw roomError;

    // 3. Update Application Status
    const { error: appError } = await supabase
      .from('housing_applications')
      .update({ status: 'ASSIGNED' })
      .eq('id', applicationId);

    if (appError) throw appError;

    // 4. Generate Invoice
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    const referenceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const duration = assignment.application?.lease_duration || 1;
    const totalAmount = assignment.application?.total_contract_value || (assignment.room.monthly_rate * duration);

    const { error: invoiceError } = await supabase
      .from('housing_invoices')
      .insert({
        student_id: studentId,
        application_id: applicationId,
        reference_number: referenceNumber,
        total_amount: totalAmount,
        paid_amount: 0,
        currency: 'CAD',
        status: 'PENDING',
        due_date: dueDate.toISOString(),
        description: `Housing Contract (${duration} mo) - ${assignment.room?.building?.name} Room ${assignment.room?.room_number}`,
        metadata: {
          lease_duration: duration,
          room_id: roomId
        }
      });

    if (invoiceError) throw invoiceError;

    // 5. Trigger Email via send-notification function (Internal call)
    if (assignment.student?.user?.email) {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          type: 'HOUSING_ASSIGNED',
          record: {
            email: assignment.student.user.email,
            first_name: assignment.student.user.first_name || 'Student'
          },
          additionalData: {
            buildingName: assignment.room?.building?.name || 'Campus Residence',
            roomNumber: assignment.room?.room_number || 'N/A',
            startDate: new Date(startDate).toLocaleDateString('fi-CA'),
            monthlyRate: assignment.room?.monthly_rate || monthlyRate
          }
        })
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in handle-housing-assignment:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
