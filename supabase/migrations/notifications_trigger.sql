
-- Enable the pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to handle notification triggers
CREATE OR REPLACE FUNCTION public.handle_notification_trigger()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  -- Prepare payload with record, old_record, table name, and type
  payload := jsonb_build_object(
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD),
    'table', TG_TABLE_NAME
  );

  -- Perform async HTTP POST to the Edge Function
  PERFORM net.http_post(
    url := 'https://mrqzlmkdhzwvbpljikjz.supabase.co/functions/v1/send-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DECANER;

-- Trigger for Application Status Updates
DROP TRIGGER IF EXISTS "on_application_status_update" ON public.applications;
CREATE TRIGGER "on_application_status_update"
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE PROCEDURE public.handle_notification_trigger();

-- Trigger for Tuition Payment Completion
DROP TRIGGER IF EXISTS "on_payment_status_update" ON public.tuition_payments;
CREATE TRIGGER "on_payment_status_update"
  AFTER UPDATE OF status ON public.tuition_payments
  FOR EACH ROW
  WHEN (NEW.status = 'verified' AND OLD.status IS DISTINCT FROM 'verified')
  EXECUTE PROCEDURE public.handle_notification_trigger();

-- Trigger for Housing Application Status Updates
DROP TRIGGER IF EXISTS "on_housing_status_update" ON public.housing_applications;
CREATE TRIGGER "on_housing_status_update"
  AFTER UPDATE OF status ON public.housing_applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE PROCEDURE public.handle_notification_trigger();

-- Trigger for New User Registration Profile Creation
DROP TRIGGER IF EXISTS "on_profile_created" ON public.profiles;
CREATE TRIGGER "on_profile_created"
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_notification_trigger();

-- Trigger for Course Module Enrollment Registration
DROP TRIGGER IF EXISTS "on_module_registered" ON public.module_enrollments;
CREATE TRIGGER "on_module_registered"
  AFTER INSERT OR UPDATE OF status ON public.module_enrollments
  FOR EACH ROW
  WHEN (NEW.status = 'REGISTERED')
  EXECUTE PROCEDURE public.handle_notification_trigger();
