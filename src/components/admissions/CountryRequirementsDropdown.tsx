'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { countryRequirements, countries, CountryRequirements } from '@/data/country-requirements';

export default function CountryRequirementsDropdown() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const requirements: CountryRequirements | undefined = selectedCountry ? countryRequirements[selectedCountry] : undefined;

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
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setIsOpen(true);
            }}
            className="w-full px-4 py-3 text-lg font-bold text-black bg-white border-2 border-[#0f2027] focus:outline-none focus:border-[#0f2027] appearance-none cursor-pointer rounded-sm"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {countryRequirements[country].country}
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

          {/* Bachelor's Degree Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Bachelor's Degree Program
            </h3>
            <ul className="space-y-3">
              {requirements.bachelorDegree.map((req, idx) => {
                const cleaned = req.replace(/^\d+\.\s*/, '').trim();
                const isSubHeader = cleaned.toLowerCase() === 'one of the following:';
                if (isSubHeader) {
                  return (
                    <li key={idx} className="text-lg font-bold text-black pt-1 pb-0.5">
                      {cleaned}
                    </li>
                  );
                }
                return (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-[#0f2027] font-bold text-xl leading-snug shrink-0 select-none">•</span>
                    <span className="text-lg text-black leading-relaxed flex-1">{cleaned}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Post Graduate Certificate Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Ontario College Certificate (1 year)
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

          {/* Master's Degree Program */}
          <div>
            <h3 className="text-xl font-black text-black mb-4">
              Admission To Master's Degree Program
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

          {/* Additional Notes */}
          {requirements.additionalNotes.length > 0 && (
            <div className="bg-neutral-50 p-4 space-y-2">
              {requirements.additionalNotes.map((note, idx) => (
                <p key={idx} className="text-lg text-black">
                  {note}
                </p>
              ))}
            </div>
          )}

          {/* Canadian External Links */}
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="text-xl font-black text-black mb-4">Canadian Immigration & Study Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-[#0f2027] hover:underline flex items-center gap-2"
              >
                Study in Canada - Government of Canada
                <ChevronUp size={16} strokeWidth={2} />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-[#0f2027] hover:underline flex items-center gap-2"
              >
                Study Permit Application Guide
                <ChevronUp size={16} strokeWidth={2} />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-[#0f2027] hover:underline flex items-center gap-2"
              >
                Provincial Attestation Letter (PAL)
                <ChevronUp size={16} strokeWidth={2} />
              </a>
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold text-[#0f2027] hover:underline flex items-center gap-2"
              >
                Immigration Application Guides
                <ChevronUp size={16} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
