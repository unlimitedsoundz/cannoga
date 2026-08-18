'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { countryRequirements, CountryRequirements } from '@/data/country-requirements';
import { countries as allWorldCountries } from '@/utils/countries';

export default function CountryRequirementsDropdown() {
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');

  const getRequirementsForCountry = (countryName: string): CountryRequirements | undefined => {
    if (!countryName) return undefined;
    const cleanKey = countryName.toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const [k, v] of Object.entries(countryRequirements)) {
      if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanKey || v.country.toLowerCase() === countryName.toLowerCase()) {
        return v;
      }
    }

    return {
      country: countryName,
      basicRequirements: ['International Application Form', 'Application fee: Free'],
      notes: ['Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may require additional CV/resume verification.'],
      undergraduateCertificate: [
        `Official High School Certificate / Secondary School Diploma from ${countryName} with minimum passing grades`,
        'English language proficiency: IELTS 6.0 (minimum 5.5 in each band), TOEFL iBT 80, Duolingo 105, or Cannoga English Placement Test',
        'Official transcripts from all previously attended institutions'
      ],
      bachelorDegree: [
        `Recognized High School Completion / Senior Secondary School Certificate from ${countryName} with strong academic standing in relevant prerequisites`,
        'English language proficiency: IELTS 6.5 (minimum 6.0 in each band), TOEFL iBT 88, Duolingo 115, or Cannoga EAP completion',
        'Certified academic transcripts translated into English'
      ],
      mastersDegree: [
        `Recognized 4-year Bachelor's degree (or equivalent international qualification) from an accredited institution in ${countryName} with minimum 70% (B / 3.0 GPA average)`,
        'English language proficiency: IELTS 6.5 (minimum 6.0 in each band), TOEFL iBT 88, or equivalent',
        'Statement of Intent, 2 Letters of Recommendation, and Updated Resume / CV'
      ],
      postGraduateCertificate: [
        `Recognized Bachelor's degree or 3-year post-secondary Diploma from ${countryName}`,
        'English language proficiency: IELTS 6.5 or equivalent',
        'Relevant academic background or professional work experience'
      ],
      additionalNotes: [
        'All non-English educational documents must be accompanied by an official certified English translation.',
        'For design, technology, or portfolio-based programs, work samples or code repositories may be required.'
      ]
    };
  };

  const requirements = getRequirementsForCountry(selectedCountryName);

  return (
    <div className="w-full max-w-2xl">
      {/* Country Selector */}
      <div className="relative mb-8">
        <label htmlFor="country-select" className="block text-lg font-bold text-black mb-2">
          Country*
        </label>
        <div className="relative">
          <select
            id="country-select"
            value={selectedCountryName}
            onChange={(e) => setSelectedCountryName(e.target.value)}
            className="w-full px-4 py-3 text-base md:text-lg font-bold text-black bg-white border-2 border-[#0f2027] focus:outline-none focus:border-[#0f2027] appearance-none cursor-pointer rounded-sm"
          >
            <option value="">Select a country</option>
            {allWorldCountries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={20} />
        </div>
      </div>

      {/* Requirements Content */}
      {requirements && (
        <div className="bg-white border border-neutral-200 rounded-sm p-6 md:p-8 space-y-8">
          {/* Basic Requirements */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">Basic Requirements for all students:</h3>
            <ul className="space-y-3">
              {requirements.basicRequirements.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Notes */}
          {requirements.notes.length > 0 && (
            <div className="bg-neutral-50 p-4 border-l-4 border-[#0f2027]">
              <p className="text-lg text-black italic">
                <strong>Note:</strong> {requirements.notes[0]}
              </p>
            </div>
          )}

          {/* Undergraduate Certificate or Diploma Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Ontario College Diploma Program (2 years)
            </h3>
            <ul className="space-y-3">
              {requirements.undergraduateCertificate.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bachelor's Degree */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Honours Bachelor's Degree Program (4 years)
            </h3>
            <ul className="space-y-3">
              {requirements.bachelorDegree.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Master's Degree Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Master's Degree Program (2 years)
            </h3>
            <ul className="space-y-3">
              {requirements.mastersDegree.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Post-Graduate Certificate Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Post-Graduate Certificate Program (1 year)
            </h3>
            <ul className="space-y-3">
              {requirements.postGraduateCertificate.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Additional Notes */}
          {requirements.additionalNotes.length > 0 && (
            <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-sm">
              <h4 className="font-black text-black text-base uppercase tracking-wider mb-2">Important Information:</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                {requirements.additionalNotes.map((note, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* IRCC Official Resources */}
          <div className="bg-neutral-100 p-6 rounded-sm space-y-4">
            <h4 className="font-black text-black text-base uppercase tracking-wider">Official Canadian Immigration Resources (IRCC)</h4>
            <p className="text-sm text-neutral-700">
              International students should verify their study permit and visa requirements directly on the official Government of Canada Immigration portal:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0f2027] underline hover:text-neutral-500 transition-colors inline-flex items-center gap-1.5"
              >
                Study in Canada (IRCC Guide) <ExternalLink size={13} className="shrink-0" />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0f2027] underline hover:text-neutral-500 transition-colors inline-flex items-center gap-1.5"
              >
                How to Apply for a Study Permit <ExternalLink size={13} className="shrink-0" />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0f2027] underline hover:text-neutral-500 transition-colors inline-flex items-center gap-1.5"
              >
                Provincial Attestation Letter (PAL) Info <ExternalLink size={13} className="shrink-0" />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0f2027] underline hover:text-neutral-500 transition-colors inline-flex items-center gap-1.5"
              >
                IRCC Application Forms &amp; Guides <ExternalLink size={13} className="shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
