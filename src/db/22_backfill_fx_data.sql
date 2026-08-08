-- Migration: Backfill missing FX data for existing tuition_payments
-- This sets sensible defaults for payments created before FX tracking was added

UPDATE public.tuition_payments
SET
  currency = COALESCE(currency, CASE WHEN country ILIKE '%nigeria%' THEN 'NGN' ELSE 'CAD' END),
  country = COALESCE(country, CASE WHEN currency = 'NGN' THEN 'Nigeria' ELSE 'Canada' END),
  fx_metadata = COALESCE(
    fx_metadata,
    jsonb_build_object(
      'rate', CASE WHEN country ILIKE '%nigeria%' THEN 968.40 ELSE 1.0 END,
      'localAmount', amount * CASE WHEN country ILIKE '%nigeria%' THEN 968.40 ELSE 1.0 END,
      'localCurrency', CASE WHEN country ILIKE '%nigeria%' THEN 'NGN' ELSE 'CAD' END,
      'originalAmount', amount,
      'backfilled', true
    )
  )
WHERE
  currency IS NULL
  OR fx_metadata IS NULL
  OR fx_metadata = '{}'::jsonb;
