ALTER TABLE public."Subject" ADD COLUMN IF NOT EXISTS code TEXT;
CREATE INDEX IF NOT EXISTS idx_subject_code ON public."Subject"(code);
