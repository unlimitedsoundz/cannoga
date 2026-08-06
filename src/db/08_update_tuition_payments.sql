-- Add missing columns to tuition_payments
ALTER TABLE public.tuition_payments 
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'CAD',
ADD COLUMN IF NOT EXISTS fx_metadata JSONB;

-- Enable RLS for INSERT if we want client-side, OR just rely on server action.
-- Let's add the policy just in case, but restrict it to valid offers.
CREATE POLICY "Applicants can insert own payments" ON public.tuition_payments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admission_offers ao
        JOIN public.applications app ON ao.application_id = app.id
        WHERE ao.id = tuition_payments.offer_id AND app.user_id = auth.uid()
    )
);
