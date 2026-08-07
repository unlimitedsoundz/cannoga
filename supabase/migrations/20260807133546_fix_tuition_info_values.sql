-- Fix tuition_info values to match hardcoded annual rates in src/utils/tuition.ts

UPDATE public.tuition_info
SET 
  domestic_tuition = '{"terms": "Payment plans available", "domesticTuition": "$2,400 per year", "domesticPerCredit": null}',
  international_tuition = '{"terms": "Payment plans available", "perCredit": null, "annualTuition": "$4,000 per year"}',
  updated_at = NOW()
WHERE credential_type = 'CERTIFICATE';

UPDATE public.tuition_info
SET 
  domestic_tuition = '{"terms": "Payment plans available", "domesticTuition": "$2,400 per year", "domesticPerCredit": null}',
  international_tuition = '{"terms": "Payment plans available", "perCredit": null, "annualTuition": "$4,000 per year"}',
  updated_at = NOW()
WHERE credential_type = 'DIPLOMA';

UPDATE public.tuition_info
SET 
  domestic_tuition = '{"terms": "Payment plans available", "domesticTuition": "$4,000 per year", "domesticPerCredit": null}',
  international_tuition = '{"terms": "Payment plans available", "perCredit": null, "annualTuition": "$6,400 per year"}',
  updated_at = NOW()
WHERE credential_type = 'BACHELOR';

UPDATE public.tuition_info
SET 
  domestic_tuition = '{"terms": "Payment plans available", "domesticTuition": "$5,600 per year", "domesticPerCredit": null}',
  international_tuition = '{"terms": "Payment plans available", "perCredit": null, "annualTuition": "$9,600 per year"}',
  updated_at = NOW()
WHERE credential_type = 'MASTER';
