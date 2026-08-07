-- Drop old table if exists
DROP TABLE IF EXISTS page_contents;

-- Create page_content table for editable page content
CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    page_slug VARCHAR(255) NOT NULL,
    section_key VARCHAR(255) NOT NULL,
    content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    UNIQUE(page_slug, section_key)
);

-- Create index on page_slug and section_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_content_page_slug ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_content_section_key ON page_content(section_key);

-- Insert default content for admissions pages
INSERT INTO page_content (page_slug, section_key, content) VALUES
('admissions-bachelor', 'hero_title', 'Bachelor's Programmes'),
('admissions-bachelor', 'hero_subtitle', 'Join our internationally focused Bachelor's degree programmes taught entirely in English. Our programmes combine academic excellence with practical skills for global careers.'),
('admissions-bachelor', 'benefits_title', 'How You Benefit from Our Programmes'),
('admissions-bachelor', 'benefits_content', 'Our Bachelor's programmes are designed to provide you with a strong foundation in your chosen field while developing the skills needed for the modern workplace. You'll benefit from small class sizes, personalized attention, and opportunities to participate in research projects alongside our faculty.'),
('admissions-bachelor', 'requirements_title', 'Admission Requirements'),
('admissions-bachelor', 'requirements_content', 'To be eligible for our Bachelor's programmes, you need a secondary school diploma or equivalent qualification. English proficiency is required for all programmes taught in English. Specific requirements may vary by programme.'),
('admissions-bachelor', 'process_title', 'Application Process'),
('admissions-bachelor', 'process_content', 'Our application process is straightforward and designed to be as stress-free as possible. You can apply online through our portal, and our admissions team is here to help you every step of the way.'),
('admissions-bachelor', 'deadlines_title', 'Application Deadlines'),
('admissions-bachelor', 'deadlines_content', 'For fall intake: April 15th. For spring intake: October 15th. Early applications are encouraged as places are limited.'),
('admissions-bachelor', 'contact_title', 'Contact Admissions'),
('admissions-bachelor', 'contact_content', 'Have questions about our programmes or the application process? Our admissions team is here to help. Contact us at admissions@cannogacollege.ca or call +358 123 456 789.')
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Insert default content for admissions/tuition page
INSERT INTO page_content (page_slug, section_key, content) VALUES
('admissions/tuition', 'hero_title', 'Tuition Fees & Payment'),
('admissions/tuition', 'hero_subtitle', 'Understanding tuition costs, payment options, and financial support for international students at Cannoga College.'),
('admissions/tuition', 'fee_structure_content', 'Our tuition fees are competitive and designed to provide excellent value for money. Fees vary by programme and study level.'),
('admissions/tuition', 'bachelor_fees_content', '<p>Right to study starting on or after 1 August 2026</p><figure class="table" style="width:100%;"><table class="ck-table-resized"><colgroup><col style="width:32.15%;"><col style="width:26.54%;"><col style="width:41.31%;"></colgroup><thead><tr><th>Field of Study</th><th>Tuition Fee / Year</th><th>Tuition Deposit</th></tr></thead><tbody><tr><td>Business</td><td>$8"¯000</td><td>$4"¯000</td></tr><tr><td>Arts</td><td>$8"¯000</td><td>$4"¯000</td></tr><tr><td>Technology &amp; Engineering</td><td>$8"¯000</td><td>$4"¯000</td></tr><tr><td>Science</td><td>$12"¯000</td><td>$6"¯000</td></tr></tbody></table></figure>'),
('admissions/tuition', 'master_fees_content', '<p>Tuition fees for Master's programmes are determined by the field of study. They are not consistent with Bachelor's fees, and students should verify the exact amount in their personal admission letter.</p><h3>Early Bird Tuition Waiver (EBTW)</h3><p>New Master's students may receive a 25% waiver on their first academic year's tuition if they accept their offer as instructed.</p><ul><li data-list-item-id="e0d9925dbee8980cfe02135f259b81b9d">Accept your admission offer as instructed and pay tuiton fee<strong> before 7 days</strong>.</li></ul><figure class="table" style="width:100%;"><table class="ck-table-resized"><colgroup><col style="width:34.79%;"><col style="width:31.82%;"><col style="width:33.39%;"></colgroup><thead><tr><th>Field of Study</th><th>Waived Fees (1st Year)</th><th>Tuition Deposit</th></tr></thead><tbody><tr><td>Business</td><td>$6 000</td><td>$4 000</td></tr><tr><td>Arts</td><td>$6 000</td><td>$4 000</td></tr><tr><td>Technology &amp; Engineering</td><td>$6 000</td><td>$4 000</td></tr><tr><td>Science</td><td>$9 000</td><td>$6 000</td></tr></tbody></table></figure>'),
('admissions/tuition', 'merit_scholarship_content', 'Merit-based scholarships are available for outstanding applicants with excellent academic records.'),
('admissions/tuition', 'payment_methods_content', 'We accept bank transfers, credit cards, and international payment services. Payment plans are available.'),
('admissions/tuition', 'timing_content', 'Tuition fees are typically paid in two installments per academic year.'),
('admissions/tuition', 'additional_fees_content', 'Additional fees may include application fees ($100), study permit fees, and health insurance.'),
('admissions/tuition', 'health_insurance_content', 'Health insurance is mandatory for all international students. Cost: $200-300 per year.'),
('admissions/tuition', 'refunds_content', 'Refunds are processed according to our refund policy. Please contact the finance office for details.'),
('admissions/tuition', 'contact_content', 'For questions about fees and payments, contact finance@cannogacollege.ca')
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Insert default content for admissions/master page
INSERT INTO page_content (page_slug, section_key, content) VALUES
('admissions/master', 'hero_title', 'Apply to Master''s Programmes'),
('admissions/master', 'hero_subtitle', 'Advance your career with our international Master''s programmes. Join a diverse community of professionals and researchers.'),
('admissions/master', 'schedule_content', 'Applications are accepted twice per year for fall and spring intake.'),
('admissions/master', 'study_options_content', 'Full-time and part-time study options available. Most programmes can be completed in 1-2 years.'),
('admissions/master', 'scholarships_content', 'Various scholarships available including merit-based, need-based, and programme-specific funding.'),
('admissions/master', 'eligibility_content', 'Bachelor''s degree or equivalent, relevant work experience preferred for some programmes.'),
('admissions/master', 'field_reqs_content', 'Specific requirements vary by field of study. Contact admissions for detailed information.'),
('admissions/master', 'incomplete_content', 'Incomplete applications will not be considered. All required documents must be submitted.'),
('admissions/master', 'steps_content', '1. Choose programme, 2. Prepare documents, 3. Submit application, 4. Pay application fee, 5. Wait for decision.'),
('admissions/master', 'documents_content', 'CV, motivation letter, academic transcripts, proof of English proficiency, recommendation letters.'),
('admissions/master', 'language_content', 'TOEFL iBT 90+ or IELTS 6.5+ required for non-native English speakers.'),
('admissions/master', 'gmat_content', 'GMAT or GRE required for business programmes. Minimum scores vary by programme.'),
('admissions/master', 'decisions_content', 'Decisions are typically made within 4-6 weeks of complete application submission.'),
('admissions/master', 'after_content', 'After acceptance, you''ll receive admission letter, visa guidance, and accommodation assistance.')
ON CONFLICT (page_slug, section_key) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read/write page contents
CREATE POLICY "Admins can manage page content" ON page_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- Create policy for public read access
CREATE POLICY "Public can read page content" ON page_content
    FOR SELECT USING (true);
