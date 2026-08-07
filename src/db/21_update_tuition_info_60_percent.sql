-- Migration: Update tuition_info table with 60% increased rates

UPDATE tuition_info SET
  domestic_tuition = CASE credential_type
    WHEN 'CERTIFICATE' THEN '{"domesticTuition": "$2,400 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}'
    WHEN 'DIPLOMA' THEN '{"domesticTuition": "$2,400 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}'
    WHEN 'BACHELOR' THEN '{"domesticTuition": "$4,000 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}'
    WHEN 'MASTER' THEN '{"domesticTuition": "$5,600 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}'
    ELSE domestic_tuition
  END,
  international_tuition = CASE credential_type
    WHEN 'CERTIFICATE' THEN '{"annualTuition": "$4,000 per semester", "perCredit": null, "terms": "Payment plans available"}'
    WHEN 'DIPLOMA' THEN '{"annualTuition": "$4,000 per semester", "perCredit": null, "terms": "Payment plans available"}'
    WHEN 'BACHELOR' THEN '{"annualTuition": "$6,400 per semester", "perCredit": null, "terms": "Payment plans available"}'
    WHEN 'MASTER' THEN '{"annualTuition": "$9,600 per semester", "perCredit": null, "terms": "Payment plans available"}'
    ELSE international_tuition
  END,
  updated_at = NOW()
WHERE credential_type IN ('CERTIFICATE', 'DIPLOMA', 'BACHELOR', 'MASTER');
