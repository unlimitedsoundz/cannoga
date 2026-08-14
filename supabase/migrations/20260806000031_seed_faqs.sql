-- Insert FAQ page records
INSERT INTO faq_pages (name, slug) VALUES
('Tuition', 'admissions/tuition'),
('Bachelor Admissions', 'admissions/bachelor'),
('Master Admissions', 'admissions/master'),
('Application Process', 'admissions/application-process'),
('International Students', 'admissions/international')
ON CONFLICT (slug) DO NOTHING;

-- Get page IDs for reference
-- Tuition FAQs
INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Who is required to pay tuition fees at Cannoga College?',
    '<div className="space-y-4">
        <p>In accordance with Canadian provincial legislation, tuition fees are mandatory for international students enrolled in postsecondary degree, diploma, or certificate programmes at Cannoga College.</p>
        <p><strong>Domestic tuition rate eligibility applies if you are:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>A Canadian citizen</li>
            <li>A Permanent Resident (PR) of Canada</li>
            <li>A protected person or convention refugee in Canada</li>
            <li>A holder of an eligible diplomatic or work authorization exemption</li>
        </ul>
        <p>Status is verified during the application process. You must upload a copy of your status document or passport to the applicant portal for verification by our admissions team.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    0,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'How do I pay my tuition fees?',
    '<div className="space-y-4">
        <p>Cannoga College uses a <strong>secure payment portal</strong> to process tuition payments securely and efficiently for international students.</p>
        <p><strong>Steps to complete your payment:</strong></p>
        <ol className="list-decimal pl-5 space-y-2">
            <li>Log in to your <strong>Cannoga Applicant Portal</strong>.</li>
            <li>Navigate to the ''Payment'' section of your accepted application.</li>
            <li>Click ''Proceed to Payment'' to be redirected to the secure <strong>payment gateway</strong>.</li>
            <li>You must initiate the payment in the portal.</li>
            <li>Select your country and preferred payment method (Bank Transfer, Credit Card, etc.).</li>
            <li>Choose the preferred method of payment.</li>
            <li>Follow the on-screen instructions to finalize your payment.</li>
        </ol>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-sm mb-2 text-black">Important Notes for Bank Transfers:</p>
            <p className="text-sm text-black">If you choose a bank transfer option, the platform will eventually give you the details to take to your bank for the transfer. You must first fill in your details so that the payment can be identified as yours. An initiated payment will stay valid for a few days, after which it will expire. Make sure to complete the transfer in that timeframe.</p>
        </div>
        <p>Once the payment is completed, your status will clear automatically, and you will receive an official receipt for your study permit application.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    1,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'What are the specific requirements for the Early Bird Tuition Waiver (EBTW)?',
    '<div className="space-y-4">
        <p>To encourage early enrolment, we offer a <strong>25% waiver</strong> on the first year''s tuition fee. This is a significant saving and is highly recommended for all international students.</p>
        <p><strong>Eligibility Criteria:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>You must accept your study offer within <strong>14 days</strong> of receiving the admission letter.</li>
            <li>The full (discounted) payment must reach Cannoga College''s account by <strong>23 April 2026</strong>.</li>
            <li>This discount applies ONLY to the first academic year and cannot be combined with other tuition fee waivers.</li>
        </ul>
        <p>If the payment is not received by 23 April 2026, the waiver is voided, and the full standard fee will be required to confirm your enrolment.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    2,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Detailed Refund Policy: When can I get my money back?',
    '<div className="space-y-4">
        <p>We understand that circumstances change. Our refund policy is designed to be fair while ensuring administrative costs are covered.</p>
        <p><strong>100% Refund (minus $100 admin fee):</strong></p>
        <ul className="list-disc pl-5 space-y-1">
            <li>Negative study permit decision (must provide official IRCC document).</li>
            <li>Failure to meet conditional admission requirements (e.g., failed to graduate on time).</li>
            <li>Cancellation of the degree program by the University.</li>
        </ul>
        <p><strong>Partial Refund:</strong> If you withdraw after the semester has started but before the ''Add/Drop'' deadline, you may be eligible for a 50% refund. No refunds are issued for the current semester after the 4th week of classes.</p>
        <p><em>Note: Refunds are always paid back to the original source/account that made the payment.</em></p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    3,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Can I pay in instalments?',
    '<div className="space-y-4">
        <p>For the <strong>first academic year</strong>, the tuition fee must be paid in <strong>one full instalment</strong> to facilitate the study permit process. Canadian immigration authorities generally require proof of full payment for the first year before granting a permit.</p>
        <p>For <strong>subsequent years</strong>, you may choose to pay in two instalments (per semester). However, please be aware that paying in instalments may incur a small administrative surcharge of $50 per instalment.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    4,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'How do I maintain my scholarship eligibility?',
    '<div className="space-y-4">
        <p>Cannoga College rewards academic dedication. Our continuing scholarships (available from the 2nd year onwards) are based on your performance during the previous academic year.</p>
        <p><strong>To qualify for a 50% waiver on the next year''s fee:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>You must complete at least <strong>30 credits</strong> within the academic year (Sept 1 – July 31).</li>
            <li>You must maintain a minimum weighted GPA of 3.5 / 5.0.</li>
            <li>You must not have any disciplinary actions on your record.</li>
        </ul>
        <p>Scholarships are automatically reviewed every August, and eligible students are notified before the Autumn semester tuition deadline.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    5,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Is there a tuition deposit required?',
    '<div className="space-y-4">
        <p>Yes. Depending on your program and applicant status, Cannoga College may require a non-refundable tuition <strong>deposit</strong> to secure your place in the program after you receive an offer of admission.</p>
        <p>This deposit is fully credited toward your first-year tuition fee. The specific deposit amount and the deadline for payment will be clearly outlined in your official Admission Letter and accepted offer details in the applicant portal.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/tuition'),
    6,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/tuition');

-- Bachelor Admissions FAQs
INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'What are the admission requirements for bachelor''s programmes?',
    '<div className="space-y-4">
        <p>Cannoga College''s bachelor''s programmes are designed for motivated students ready to begin their academic journey in Ottawa, Ontario, Canada.</p>
        <p><strong>General Requirements:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>Completed secondary education (high school diploma or equivalent)</li>
            <li>Minimum GPA of 3.0/4.0 or equivalent</li>
            <li>English language proficiency (TOEFL iBT 80, IELTS 6.0, or equivalent)</li>
            <li>Motivation letter</li>
            <li>Two letters of recommendation</li>
        </ul>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/bachelor'),
    0,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/bachelor');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'When are the application deadlines?',
    '<div className="space-y-4">
        <p>We operate on rolling admissions with priority deadlines to ensure you have the best chance of admission.</p>
        <p><strong>Application Periods:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Early Round:</strong> 1 November - 15 January (Priority consideration)</li>
            <li><strong>Main Round:</strong> 16 January - 15 April</li>
            <li><strong>Late Round:</strong> 16 April - 30 June (Limited availability)</li>
        </ul>
        <p>Applications are processed on a first-come, first-served basis within each round.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/bachelor'),
    1,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/bachelor');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'How long does the admission process take?',
    '<div className="space-y-4">
        <p>Our efficient admission process ensures you receive a decision quickly.</p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Application Review:</strong> 2-4 weeks from submission</li>
            <li><strong>Interview (if required):</strong> Within 1 week of application review</li>
            <li><strong>Final Decision:</strong> Within 1 week of interview</li>
            <li><strong>Acceptance Deadline:</strong> 2 weeks from offer date</li>
        </ul>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/bachelor'),
    2,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/bachelor');

-- Master Admissions FAQs
INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'What are the admission requirements for master''s programmes?',
    '<div className="space-y-4">
        <p>Our master''s programmes are designed for professionals and recent graduates seeking advanced education.</p>
        <p><strong>General Requirements:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>Bachelor''s degree or equivalent (minimum GPA 3.0/4.0)</li>
            <li>English language proficiency (TOEFL iBT 90, IELTS 6.5, or equivalent)</li>
            <li>CV/Resume</li>
            <li>Motivation letter (500-800 words)</li>
            <li>Two academic/professional references</li>
            <li>Work experience preferred for some programmes</li>
        </ul>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/master'),
    0,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/master');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Can I apply for a master''s programme with a different undergraduate background?',
    '<div className="space-y-4">
        <p>Yes, many of our master''s programmes accept students from diverse academic backgrounds. However, some programmes may require prerequisite knowledge or courses.</p>
        <p><strong>For students with different backgrounds:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>Some programmes offer bridge courses for necessary skills</li>
            <li>Admission may be conditional on completing prerequisite modules</li>
            <li>Work experience can compensate for academic background differences</li>
        </ul>
        <p>Contact our admissions team to discuss your specific situation.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/master'),
    1,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/master');

-- Application Process FAQs
INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'How do I start my application?',
    '<div className="space-y-4">
        <p>Beginning your application to Cannoga College is straightforward.</p>
        <p><strong>Steps to Apply:</strong></p>
        <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Create an Account:</strong> Register on our application portal</li>
            <li><strong>Choose Your Programme:</strong> Select from our bachelor''s or master''s offerings</li>
            <li><strong>Prepare Documents:</strong> Gather required materials</li>
            <li><strong>Submit Application:</strong> Complete and submit through the portal</li>
            <li><strong>Track Progress:</strong> Monitor your application status</li>
        </ol>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/application-process'),
    0,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/application-process');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'What documents do I need to submit?',
    '<div className="space-y-4">
        <p>All required documents must be submitted through our online application portal.</p>
        <p><strong>Required Documents:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li>Academic transcripts and diplomas</li>
            <li>English language proficiency certificate</li>
            <li>Passport copy</li>
            <li>Motivation letter</li>
            <li>Letters of recommendation</li>
            <li>CV/Resume</li>
            <li>Portfolio (for design/art programmes)</li>
        </ul>
        <p>All documents must be in English or accompanied by certified translations.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/application-process'),
    1,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/application-process');

-- International Students FAQs
INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'Do I need a visa to study in Canada?',
    '<div className="space-y-4">
        <p>Most international students need a study permit for studies in Canada.</p>
        <p><strong>Visa Requirements:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Canadian citizens & Permanent Residents:</strong> No study permit required</li>
            <li><strong>International students:</strong> Canadian Study Permit required for programs over 6 months</li>
            <li><strong>Short-term study:</strong> Visitors may study for programs under 6 months without a study permit</li>
        </ul>
        <p>The study permit application is submitted to IRCC after receiving your acceptance letter.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/international'),
    0,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/international');

INSERT INTO faq (question, answer, page_id, order_index, is_published)
SELECT
    'What health insurance do I need?',
    '<div className="space-y-4">
        <p>Health insurance is mandatory for all international students in Canada.</p>
        <p><strong>Insurance Options:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>College Student Health Plan:</strong> Included with tuition for full-time international students</li>
            <li><strong>Private health insurance:</strong> Must meet Canadian immigration and health coverage requirements</li>
            <li><strong>Provincial health coverage (OHIP):</strong> Available for eligible Ontario residents</li>
        </ul>
        <p>Your insurance must be valid for your entire study period in Canada.</p>
    </div>',
    (SELECT id FROM faq_pages WHERE slug = 'admissions/international'),
    1,
    true
WHERE EXISTS (SELECT 1 FROM faq_pages WHERE slug = 'admissions/international');