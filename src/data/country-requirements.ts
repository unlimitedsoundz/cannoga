export interface CountryRequirements {
  country: string;
  basicRequirements: string[];
  notes: string[];
  undergraduateCertificate: string[];
  bachelorDegree: string[];
  mastersDegree: string[];
  postGraduateCertificate: string[];
  additionalNotes: string[];
}

export const countryRequirements: Record<string, CountryRequirements> = {
  algeria: {
    country: 'Algeria',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Baccalauréat (Bac) with minimum 10/20 in relevant subjects', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Baccalauréat with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/5.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/5.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.', 'For programs requiring a portfolio, please submit samples of your work.']
  },
  argentina: {
    country: 'Argentina',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 7/10', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 8/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  australia: {
    country: 'Australia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Australian Senior Secondary Certificate (VCE/WACE) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Australian Senior Secondary Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 5.0/7.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 5.0/7.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  bangladesh: {
    country: 'Bangladesh',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Higher Secondary Certificate (HSC) with minimum 60% marks', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Higher Secondary Certificate (HSC) with minimum 70% marks in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  brazil: {
    country: 'Brazil',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificado de Ensino Médio (High School Certificate)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificado de Ensino Médio with minimum 7.0/10.0 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10.0", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10.0", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  canada: {
    country: 'Canada',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['High School Diploma with minimum 60% average', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['High School Diploma with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  china: {
    country: 'China',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Senior High School Diploma (Gaokao) with minimum 450 points', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Senior High School Diploma with minimum 500 points in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.', 'For programs requiring a portfolio, please submit samples of your work.']
  },
  colombia: {
    country: 'Colombia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  egypt: {
    country: 'Egypt',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Thanaweya Amma (General Secondary Education Certificate) with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Thanaweya Amma with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  france: {
    country: 'France',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Baccalauréat (Bac) with minimum 10/20 in relevant subjects', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Baccalauréat with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  germany: {
    country: 'Germany',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Abitur (General Higher Education Entrance Qualification)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Abitur with minimum 2.5 GPA in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  ghana: {
    country: 'Ghana',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['West African Senior Secondary School Certificate (WASSCE) with minimum C6 in five relevant subjects including English', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['WASSCE with minimum B3 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['Please note that, for admissions purposes, transcripts from Bachelor Degree programs only will be accepted.', 'These are minimums cut-offs and the admissions decision is at the discretion of Cannoga College.']
  },
  india: {
    country: 'India',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Senior Secondary Certificate (10+2) from a recognized board with minimum 50% marks', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Higher Secondary Certificate (10+2) with minimum 60% marks in relevant subjects', 'Diploma or equivalent qualification may be required for lateral entry', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum 55% marks", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum 55% marks", 'Relevant work experience is highly valued'],
    additionalNotes: ['Transcripts must be accompanied by an attestation from the issuing institution.', 'For programs requiring a portfolio, please submit samples of your work.']
  },
  indonesia: {
    country: 'Indonesia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Indonesian High School Diploma (SMA) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['SMA with minimum 75% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  iran: {
    country: 'Iran',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diploma (High School Certificate) with minimum 14/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diploma with minimum 16/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  italy: {
    country: 'Italy',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diploma di Maturità (Matura) with minimum 70/100', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diploma di Maturità with minimum 80/100 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  japan: {
    country: 'Japan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Senior High School Diploma (Kotogakko) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Senior High School Diploma with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  kenya: {
    country: 'Kenya',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Kenya Certificate of Secondary Education (KCSE) with minimum C+ (60%)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['KCSE with minimum B (70%) in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum CGPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['Please note that, for admissions purposes, transcripts from Bachelor Degree programs only will be accepted.', 'These are minimums cut-offs and the admissions decision is at the discretion of Cannoga College.']
  },
  malaysia: {
    country: 'Malaysia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Malaysian Certificate of Education (SPM) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['SPM with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  mexico: {
    country: 'Mexico',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  morocco: {
    country: 'Morocco',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Baccalauréat (Bac) with minimum 10/20 in relevant subjects', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Baccalauréat with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  nepal: {
    country: 'Nepal',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Higher Secondary Education Board (HSEB) with minimum 50% marks', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['HSEB with minimum 60% marks in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum CGPA 2.8/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum CGPA 2.8/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  nigeria: {
    country: 'Nigeria',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['West African School Certificate/General Certificate of Education with a minimum grade of C4 in five relevant subjects (including English)', 'A minimum grade of B will be required for programs that require a 65% grade for English.', 'Include transcripts for any post-secondary courses or programs completed'],
    bachelorDegree: ['One of the following:', 'West African School Certificate/General Certificate of Education A Levels with a minimum grade of two in required program subjects', 'Senior School Certificate with a minimum grade of B in required program subjects', 'A complete educational history including transcripts for any postsecondary courses or programs completed.'],
    mastersDegree: ["Bachelor's degree and University transcripts (2nd class upper division)"],
    postGraduateCertificate: ["Bachelor's degree and University transcripts (2nd class upper division)"],
    additionalNotes: ['Please note that, for admissions purposes, transcripts from Bachelor Degree programs only will be accepted. Masters Degree transcripts will not be accepted for assessment purposes.', 'These are minimums cut-offs and the admissions decision is at the discretion of Cannoga College. Admissions requirements may change at any time.', 'Please note that IELTS refers to Academic IELTS and not General IELTS']
  },
  pakistan: {
    country: 'Pakistan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Intermediate (HSSC) with minimum 50% marks', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Intermediate (HSSC) with minimum 60% marks in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum CGPA 2.5/4.0 or equivalent", 'Relevant work experience may be required for some programs'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum CGPA 2.5/4.0 or equivalent", 'Relevant work experience may be required for some programs'],
    additionalNotes: ['All documents must be translated into English by a certified translator.', 'For programs requiring a portfolio, please submit samples of your work.']
  },
  philippines: {
    country: 'Philippines',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Senior High School Diploma', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Senior High School Diploma with minimum 85% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or 85%", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or 85%", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  saudiArabia: {
    country: 'Saudi Arabia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Certificate of Secondary Education (GCSE) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['GCSE with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  southKorea: {
    country: 'South Korea',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['High School Diploma (Godeung Hakgyo) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['High School Diploma with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  spain: {
    country: 'Spain',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 7/10', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 8/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  sriLanka: {
    country: 'Sri Lanka',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Certificate of Education Advanced Level (GCE A-Level) with minimum 3 passes', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['GCE A-Level with minimum 3 passes in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  taiwan: {
    country: 'Taiwan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Senior High School Diploma with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Senior High School Diploma with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  thailand: {
    country: 'Thailand',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matayom 6 (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matayom 6 with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  turkey: {
    country: 'Turkey',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Lise Diploması (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Lise Diploması with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  ukraine: {
    country: 'Ukraine',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (School Leaving Certificate) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  unitedArabEmirates: {
    country: 'United Arab Emirates',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate (Thanaweya Amma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Thanaweya Amma with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  vietnam: {
    country: 'Vietnam',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education (Bang tot nghiep Trung hoc pho thong)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificate of Secondary Education with minimum 7.0/10.0 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10.0", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 7.0/10.0", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  austria: {
    country: 'Austria',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (General Higher Education Entrance Qualification)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 2.0 GPA in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 2.5/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  belgium: {
    country: 'Belgium',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diploma of Secondary Education (Belgian or equivalent)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diploma of Secondary Education with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  bulgaria: {
    country: 'Bulgaria',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary Education Certificate with minimum 4/6', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary Education Certificate with minimum 5/6 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  chile: {
    country: 'Chile',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Licencia de Educación Media (High School Diploma) with minimum 5.0/7.0', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Licencia de Educación Media with minimum 6.0/7.0 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 5.0/7.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 5.0/7.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  denmark: {
    country: 'Denmark',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Studentereksamen (Upper Secondary School Leaving Certificate)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Studentereksamen with minimum 7/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  finland: {
    country: 'Finland',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Ylioppilastutkinto (Matriculation Examination) or equivalent', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Ylioppilastutkinto with minimum 5/9 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  greece: {
    country: 'Greece',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Apolyterion (High School Diploma) with minimum 10/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Apolyterion with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  hungary: {
    country: 'Hungary',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Érettségi (Matriculation Examination) with minimum 4/5', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Érettségi with minimum 5/5 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  kazakhstan: {
    country: 'Kazakhstan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificate of Secondary Education with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  netherlands: {
    country: 'Netherlands',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Havo/Vwo (General Secondary Education)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Vwo with minimum 7/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  poland: {
    country: 'Poland',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (Secondary School Leaving Certificate) with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  portugal: {
    country: 'Portugal',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diploma de Ensino Secundário (High School Diploma) with minimum 10/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diploma de Ensino Secundário with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  qatar: {
    country: 'Qatar',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  romania: {
    country: 'Romania',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diploma de Bacalaureat with minimum 6/10', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diploma de Bacalaureat with minimum 7/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  russia: {
    country: 'Russia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificate of Secondary Education with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  singapore: {
    country: 'Singapore',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Singapore-Cambridge GCE A-Level with minimum 3 passes', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['GCE A-Level with minimum 3 passes in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  sweden: {
    country: 'Sweden',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Upper Secondary School Leaving Certificate (Gymnasieskolan)', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Upper Secondary School Leaving Certificate with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  usa: {
    country: 'United States',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['High School Diploma with minimum 2.5/4.0 GPA', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['High School Diploma with minimum 3.0/4.0 GPA in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  bahrain: {
    country: 'Bahrain',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  croatia: {
    country: 'Croatia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (Secondary School Leaving Certificate) with minimum 3/5', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 4/5 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  czechRepublic: {
    country: 'Czech Republic',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (Secondary School Leaving Certificate) with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  estonia: {
    country: 'Estonia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary School Leaving Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary School Leaving Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  iceland: {
    country: 'Iceland',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Student\'s Certificate (Stúdentspróf) with minimum 6.5/10', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Student\'s Certificate with minimum 7.5/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  iraq: {
    country: 'Iraq',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary School Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary School Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  israel: {
    country: 'Israel',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matriculation Certificate (Bagrut) with minimum 80%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matriculation Certificate with minimum 90% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  jordan: {
    country: 'Jordan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  kuwait: {
    country: 'Kuwait',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  lebanon: {
    country: 'Lebanon',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Baccalauréat (Bac) with minimum 10/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Baccalauréat with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  malta: {
    country: 'Malta',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  newZealand: {
    country: 'New Zealand',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['New Zealand Certificate of Secondary Education with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['New Zealand Certificate of Secondary Education with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  slovakia: {
    country: 'Slovakia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (Secondary School Leaving Certificate) with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  slovenia: {
    country: 'Slovenia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Matura (Secondary School Leaving Certificate) with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Matura with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  cyprus: {
    country: 'Cyprus',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Apolytirio (High School Diploma) with minimum 10/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Apolytirio with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  georgia: {
    country: 'Georgia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Education Certificate with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Education Certificate with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  latvia: {
    country: 'Latvia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary School Leaving Certificate with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary School Leaving Certificate with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  lithuania: {
    country: 'Lithuania',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Secondary School Leaving Certificate with minimum 60%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Secondary School Leaving Certificate with minimum 70% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  luxembourg: {
    country: 'Luxembourg',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Diplôme de fin d\'études secondaires with minimum 40/60', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Diplôme de fin d\'études secondaires with minimum 50/60 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  mauritius: {
    country: 'Mauritius',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Higher School Certificate (HSC) with minimum 5 credits', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['HSC with minimum 6 credits in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  moldova: {
    country: 'Moldova',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bacalaureat with minimum 6/10', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bacalaureat with minimum 7/10 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  mongolia: {
    country: 'Mongolia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificate of Secondary Education with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  myanmar: {
    country: 'Myanmar',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['University Entrance Examination with minimum 50%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['University Entrance Examination with minimum 60% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  oman: {
    country: 'Oman',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  panama: {
    country: 'Panama',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  paraguay: {
    country: 'Paraguay',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  peru: {
    country: 'Peru',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  southAfrica: {
    country: 'South Africa',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['National Senior Certificate with minimum 30% in four designated subjects', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['National Senior Certificate with minimum 40% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  tanzania: {
    country: 'Tanzania',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education Examination (CSEE) with minimum 3 passes', 'Advanced Certificate of Secondary Education (ACSE) with minimum 2 passes', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['ACSE with minimum 3 passes in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  tunisia: {
    country: 'Tunisia',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Baccalauréat (Bac) with minimum 10/20', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Baccalauréat with minimum 12/20 in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  uganda: {
    country: 'Uganda',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Uganda Certificate of Education (UCE) with minimum 5 passes', 'Uganda Advanced Certificate of Education (UACE) with minimum 2 passes', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['UACE with minimum 3 passes in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  uzbekistan: {
    country: 'Uzbekistan',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Certificate of Secondary Education with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Certificate of Secondary Education with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  venezuela: {
    country: 'Venezuela',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['Bachillerato (High School Diploma) with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['Bachillerato with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  },
  yemen: {
    country: 'Yemen',
    basicRequirements: ['International Application Form', 'Application fee: Free'],
    notes: ['Note: Applications from applicants with a study gap of more than 3 years following secondary school graduation or 5 years following completion of their Bachelor Degree may not be accepted.'],
    undergraduateCertificate: ['General Secondary Education Certificate with minimum 70%', 'English language proficiency: IELTS 6.0 or equivalent', 'Transcripts from all previously attended institutions'],
    bachelorDegree: ['General Secondary Education Certificate with minimum 80% in relevant subjects', 'English language proficiency: IELTS 6.5 or equivalent'],
    mastersDegree: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    postGraduateCertificate: ["Bachelor's degree from a recognized university with minimum GPA 3.0/4.0 or equivalent", 'Relevant work experience is highly valued'],
    additionalNotes: ['All documents must be translated into English by a certified translator.']
  }
};

export const countries = Object.keys(countryRequirements).sort();

