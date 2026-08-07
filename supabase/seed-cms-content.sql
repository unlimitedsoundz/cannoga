-- Cannoga College Public Website Content Migration
-- Migrates existing static content into Supabase CMS tables
-- Safe to re-run (uses upsert logic)

BEGIN;

-- ============================================================
-- 1. SCHOOLS
-- ============================================================
INSERT INTO "School" (id, name, slug, description, "imageUrl")
VALUES
  ('arts', 'School of Arts, Design and Architecture', 'arts', 'A multidisciplinary academic unit focused on creativity, innovation, and societal impact through art, design, architecture, film, and media.', NULL),
  ('business', 'School of Business', 'business', 'Developing leaders for the green economy and circular business models.', NULL),
  ('education-social-sciences', 'School of Education and Social Sciences', 'education-social-sciences', 'Empowering leaders in early childhood education, child youth care, and community justice.', NULL),
  ('health-community', 'School of Health and Community Services', 'health-community', 'Preparing compassionate professionals for healthcare, nursing, and community support roles.', NULL),
  ('hospitality-tourism', 'School of Hospitality and Tourism', 'hospitality-tourism', 'Providing hands-on education in culinary arts, baking, hotel, and tourism management.', NULL),
  ('science', 'School of Science', 'science', 'Advancing the frontiers of scientific knowledge through rigorous research and innovative global education.', NULL),
  ('technology', 'School of Technology', 'technology', 'Driving the development of next-generation systems and intelligent computing solutions.', NULL),
  ('transportation-aviation', 'School of Transportation and Aviation', 'transportation-aviation', 'Training professionals in aviation management, logistics, and automotive service technologies.', NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "imageUrl" = EXCLUDED."imageUrl",
  "updatedAt" = CURRENT_TIMESTAMP;

-- ============================================================
-- 2. PAGES (CMS editable pages)
-- ============================================================
INSERT INTO pages (slug, title, meta_title, meta_description, canonical_url, status, published_at, content, order_index)
VALUES
  ('home', 'Cannoga College | International Higher Education in Canada', 'Cannoga College | International Higher Education in Canada', 'Pursue your academic and career goals at Cannoga College. We offer Degree, Diploma, and Certificate programs in Ottawa, Ontario, Canada.', 'https://cannogacollege.ca/', 'published', NOW(), '{"hero": {"heading": "Welcome to Cannoga College", "description": "Pursue your academic and career goals at Cannoga College. We offer Degree, Diploma, and Certificate programs in Ottawa, Ontario, Canada."}, "programs": {"title": "Explore Our Programs and Courses", "description": "Find the right academic path tailored to your goals at our Ottawa campus."}, "news": {"title": "News & Events"}, "schools": {"title": "Our Schools"}, "resources": {"title": "Student Resource Hub"}}', 0),
  ('admissions', 'Admissions & Enrollment Hub — Cannoga College', 'Admissions & Enrollment Hub — Cannoga College', 'Explore educational options at Cannoga. Get information on entry pathways, deadlines, fees, and requirements for all programs.', 'https://cannogacollege.ca/admissions/', 'published', NOW(), '{"overview": {"title": "Admissions & Enrollment", "description": "Explore educational options at Cannoga College."}, "degreeProgrammes": {"title": "Degree Programmes"}, "howToApply": {"title": "How to Apply"}, "events": {"title": "Events for Applicants"}, "studentStories": {"title": "Student Stories"}, "campus": {"title": "Studying on Campus"}, "careers": {"title": "Career Opportunities"}, "onlineOpportunities": {"title": "Online & Onsite"}, "community": {"title": "Vibrant Community"}, "graduation": {"title": "After Graduation"}, "studyInOttawa": {"title": "Study in Ottawa, Ontario, Canada"}, "lifelongLearning": {"title": "Lifelong Learning"}, "summerEducation": {"title": "Summer Education"}, "collaboration": {"title": "Collaboration"}, "contact": {"title": "Contact & Support"}}', 0),
  ('about', 'About Cannoga College', 'About Cannoga College', 'Learn about Cannoga College''s mission, history, and commitment to international higher education in Ottawa, Ontario, Canada.', 'https://cannogacollege.ca/about/', 'published', NOW(), '{"mission": {"title": "Our Mission"}, "history": {"title": "Our Story"}, "news": {"title": "News & Events"}, "research": {"title": "Research Hub"}, "careers": {"title": "Careers"}, "alumni": {"title": "Alumni"}, "contact": {"title": "Contact Us"}}', 0),
  ('contact', 'Contact Us — Cannoga College', 'Contact Us — Cannoga College', 'Get in touch with Cannoga College. Find our address, phone number, and email for admissions, support, and general inquiries.', 'https://cannogacollege.ca/contact/', 'published', NOW(), '{"address": {"title": "Our Location"}, "phone": {"title": "Phone"}, "email": {"title": "Email"}, "map": {"title": "Campus Map"}}', 0),
  ('research', 'Research — Cannoga College', 'Research — Cannoga College', 'Explore Cannoga College''s research initiatives, projects, and publications across various academic disciplines.', 'https://cannogacollege.ca/research/', 'published', NOW(), '{"projects": {"title": "Research Projects"}, "publications": {"title": "Research Publications"}}', 0),
  ('news', 'News & Events — Cannoga College', 'News & Events — Cannoga College', 'Stay updated with the latest news, events, and announcements from Cannoga College.', 'https://cannogacollege.ca/news/', 'published', NOW(), '{"latestNews": {"title": "Latest News"}, "events": {"title": "Upcoming Events"}}', 0),
  ('student-life', 'Student Life — Cannoga College', 'Student Life — Cannoga College', 'Discover campus life, student services, clubs, and activities at Cannoga College.', 'https://cannogacollege.ca/student-life/', 'published', NOW(), '{"cafe": {"title": "Campus Cafe"}, "activities": {"title": "Student Activities"}}', 0),
  ('careers', 'Careers — Cannoga College', 'Careers — Cannoga College', 'Explore career opportunities and professional development resources at Cannoga College.', 'https://cannogacollege.ca/careers/', 'published', NOW(), '{"jobOpportunities": {"title": "Career Opportunities"}, "ccCareer": {"title": "CC Career Opportunities"}}', 0),
  ('alumni', 'Alumni — Cannoga College', 'Alumni — Cannoga College', 'Stay connected with the Cannoga College alumni network and access alumni resources.', 'https://cannogacollege.ca/alumni/', 'published', NOW(), '{"network": {"title": "Alumni Network"}, "events": {"title": "Alumni Events"}}', 0),
  ('innovation', 'Innovation — Cannoga College', 'Innovation — Cannoga College', 'Discover Cannoga College''s innovation initiatives, research, and entrepreneurial programs.', 'https://cannogacollege.ca/innovation/', 'published', NOW(), '{"initiatives": {"title": "Innovation Initiatives"}, "projects": {"title": "Innovation Projects"}}', 0),
  ('collaboration', 'Collaboration — Cannoga College', 'Collaboration — Cannoga College', 'Explore partnerships, collaborations, and industry connections at Cannoga College.', 'https://cannogacollege.ca/collaboration/', 'published', NOW(), '{"partnerships": {"title": "Industry Partnerships"}, "research": {"title": "Research Collaborations"}}', 0),
  ('international', 'International Students — Cannoga College', 'International Students — Cannoga College', 'Information for international students including admissions, visas, housing, and campus life at Cannoga College in Ottawa, Canada.', 'https://cannogacollege.ca/international/', 'published', NOW(), '{"visa": {"title": "Visa & Immigration"}, "housing": {"title": "Housing for International Students"}, "arrival": {"title": "Arrival Guide"}, "exchange": {"title": "Exchange Programs"}}', 0),
  ('student-guide', 'Student Guide — Cannoga College', 'Student Guide — Cannoga College', 'Comprehensive guide for students including academic calendar, support services, and campus resources.', 'https://cannogacollege.ca/student-guide/', 'published', NOW(), '{"calendar": {"title": "Academic Calendar"}, "support": {"title": "Support Services"}, "handbook": {"title": "Student Handbook"}, "regulations": {"title": "Academic Regulations"}, "codeOfConduct": {"title": "Code of Conduct"}}', 0),
  ('student-handbook', 'Student Handbook — Cannoga College', 'Student Handbook — Cannoga College', 'The official student handbook containing policies, procedures, and guidelines for Cannoga College students.', 'https://cannogacollege.ca/student-handbook/', 'published', NOW(), '{"policies": {"title": "Policies"}, "procedures": {"title": "Procedures"}, "guidelines": {"title": "Guidelines"}}', 0),
  ('academic-regulations', 'Academic Regulations — Cannoga College', 'Academic Regulations — Cannoga College', 'Academic regulations and policies governing student conduct, grading, and academic standards at Cannoga College.', 'https://cannogacollege.ca/academic-regulations/', 'published', NOW(), '{"regulations": {"title": "Academic Regulations"}, "policies": {"title": "Policies"}}', 0),
  ('code-of-conduct', 'Code of Conduct — Cannoga College', 'Code of Conduct — Cannoga College', 'The Code of Conduct outlining expected behavior and standards for all members of the Cannoga College community.', 'https://cannogacollege.ca/code-of-conduct/', 'published', NOW(), '{"conduct": {"title": "Code of Conduct"}, "expectations": {"title": "Expectations"}}', 0),
  ('privacy', 'Privacy Policy — Cannoga College', 'Privacy Policy — Cannoga College', 'Privacy policy describing how Cannoga College collects, uses, and protects personal information.', 'https://cannogacollege.ca/privacy/', 'published', NOW(), '{"policy": {"title": "Privacy Policy"}, "dataCollection": {"title": "Data Collection"}, "dataUsage": {"title": "Data Usage"}}', 0),
  ('terms', 'Terms of Use — Cannoga College', 'Terms of Use — Cannoga College', 'Terms of use governing the use of the Cannoga College website and services.', 'https://cannogacollege.ca/terms/', 'published', NOW(), '{"terms": {"title": "Terms of Use"}, "conditions": {"title": "Conditions"}}', 0),
  ('cookies', 'Cookie Policy — Cannoga College', 'Cookie Policy — Cannoga College', 'Cookie policy describing how Cannoga College uses cookies on its website.', 'https://cannogacollege.ca/cookies/', 'published', NOW(), '{"cookies": {"title": "Cookie Policy"}, "preferences": {"title": "Cookie Preferences"}}', 0),
  ('accessibility', 'Accessibility Statement — Cannoga College', 'Accessibility Statement — Cannoga College', 'Accessibility statement describing Cannoga College''s commitment to web accessibility.', 'https://cannogacollege.ca/accessibility/', 'published', NOW(), '{"accessibility": {"title": "Accessibility Statement"}, "standards": {"title": "Accessibility Standards"}}', 0),
  ('site-index', 'Site Index — Cannoga College', 'Site Index — Cannoga College', 'Complete site index listing all pages and resources on the Cannoga College website.', 'https://cannogacollege.ca/site-index/', 'published', NOW(), '{"index": {"title": "Site Index"}}', 0),
  ('refund-withdrawal-policy', 'Refund & Withdrawal Policy — Cannoga College', 'Refund & Withdrawal Policy — Cannoga College', 'Refund and withdrawal policy for Cannoga College students.', 'https://cannogacollege.ca/refund-withdrawal-policy/', 'published', NOW(), '{"policy": {"title": "Refund & Withdrawal Policy"}}', 0),
  ('admissions-policy', 'Admissions Policy — Cannoga College', 'Admissions Policy — Cannoga College', 'Admissions policy outlining the requirements and procedures for admission to Cannoga College.', 'https://cannogacollege.ca/admissions-policy/', 'published', NOW(), '{"policy": {"title": "Admissions Policy"}}', 0),
  ('admissions/contact-information', 'Admission Services Contact — Cannoga College', 'Admission Services Contact — Cannoga College', 'Contact information for the Admissions Services office at Cannoga College.', 'https://cannogacollege.ca/admissions/contact-information/', 'published', NOW(), '{"contact": {"title": "Admission Services Contact"}}', 0),
  ('admissions/requirements', 'Admission Requirements — Cannoga College', 'Admission Requirements — Cannoga College', 'Admission requirements for various programs at Cannoga College.', 'https://cannogacollege.ca/admissions/requirements/', 'published', NOW(), '{"requirements": {"title": "Admission Requirements"}}', 0),
  ('research/publications', 'Research Publications — Cannoga College', 'Research Publications — Cannoga College', 'Research publications from Cannoga College faculty and researchers.', 'https://cannogacollege.ca/research/publications/', 'published', NOW(), '{"publications": {"title": "Research Publications"}}', 0),
  ('innovation/', 'Innovation — Cannoga College', 'Innovation — Cannoga College', 'Innovation initiatives and programs at Cannoga College.', 'https://cannogacollege.ca/innovation/', 'published', NOW(), '{"innovation": {"title": "Innovation"}}', 0)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  canonical_url = EXCLUDED.canonical_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- 3. HOMEPAGE SECTIONS
-- ============================================================
INSERT INTO homepage_sections (section_type, status, display_order, title, description, button_text, button_url, items)
VALUES
  ('hero', 'published', 0, 'Welcome to Cannoga College', 'Pursue your academic and career goals at Cannoga College. We offer Degree, Diploma, and Certificate programs in Ottawa, Ontario, Canada.', 'Explore Programs', '/degree-programmes', NULL),
  ('announcements', 'published', 1, 'Latest Announcements', 'Stay updated with the latest news and announcements from Cannoga College.', NULL, NULL, NULL),
  ('featured_schools', 'published', 2, 'Our Schools', 'Explore our academic schools and discover your path.', 'View All Schools', '/schools', NULL),
  ('featured_programs', 'published', 3, 'Explore Programs and Courses', 'Find the right academic path tailored to your goals at our Ottawa campus.', NULL, NULL, NULL),
  ('statistics', 'published', 4, 'Cannoga College at a Glance', NULL, NULL, NULL, NULL),
  ('news_feed', 'published', 5, 'News & Events', 'Stay updated with the latest news and events.', 'View All News', '/news', NULL),
  ('cta', 'published', 6, 'Start Your Journey', 'Take the first step toward your academic and career goals.', 'Apply Now', '/portal/apply', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. FAQs
-- ============================================================
INSERT INTO faqs (id, question, answer, category, display_order, status, created_at)
VALUES
  ('0ba9b8fd-19a1-4bc8-ab18-a1163397e287', 'Can I work while studying?', 'International students with a valid study permit may be eligible to work up to 20 hours per week during regular academic sessions and full-time during scheduled breaks. Please check current IRCC regulations.', 'f8efa207-88b2-4dda-8a2d-ef605092e812', 4, 'published', '2026-08-01 17:41:02.253754+00'),
  ('0dbb9414-ea3c-457a-b403-b708ca03b5af', 'When are the application deadlines?', 'Generally, you may apply anytime during the year; however, the earlier you start the process, the better chance you will have to obtain a seat in your desired program(s). Also, some programs are highly competitive, and to receive equal consideration for a seat, students must apply by February 1st. You can see which programs are Highly Competitive (HCP) here.', '63621040-012a-410f-96fa-55b49e526a2f', 4, 'published', '2026-08-02 08:58:15.336017+00'),
  ('25af5e47-d4a1-4957-ad9e-1494bfc4ef21', 'Can I study part-time?', 'Yes, many master programs offer part-time study options. Part-time students typically complete the program over 3-4 years instead of the standard 2 years.', 'ddaa8228-1ec6-46b4-975c-ee6e0d69d14b', 3, 'published', '2026-08-01 17:41:02.253754+00'),
  ('29fa30ee-3bb2-4c61-bfa7-10e645b9c63a', 'What is the ISIC?', 'The ISIC, International Student Identity Card, is the only internationally recognized proof of full-time student status providing worldwide photo identity documentation for student travellers.

It allows cardholders to plug into a worldwide network of discounts, services and other benefits including savings on VIA Rail, Greyhound and Travel CUTS/ Voyages Campus'' Student Class Airfares.', '63621040-012a-410f-96fa-55b49e526a2f', 0, 'published', '2026-08-02 08:58:15.336017+00'),
  ('2cd71726-3cf5-49cd-9e7c-e79f0baedf2f', 'What English proficiency tests are accepted?', 'We accept IELTS Academic (minimum 6.0 overall), TOEFL iBT (minimum 79-80), PTE Academic (minimum 58-59), and Duolingo English Test (minimum 105). Test scores must be no more than 2 years old.', 'f8efa207-88b2-4dda-8a2d-ef605092e812', 3, 'published', '2026-08-01 17:41:02.253754+00'),
  ('38585e27-b8aa-4fc3-9f9d-93e05973fe47', 'Is there an orientation for new students?', 'Orientation is offered to new International students entering the English for Academic Purposes program and for those entering Post Secondary programs. If you can''t find the information on the website, please contact the college for orientation information one to two months before your program start date.', '63621040-012a-410f-96fa-55b49e526a2f', 12, 'published', '2026-08-02 08:58:15.336017+00'),
  ('48294784-6ddc-443b-95cb-cf985e0ec2d5', 'What are the admission requirements for master programs?', 'Master program applicants typically need a bachelor''s degree in a related field with a minimum GPA of 3.0, proof of English proficiency, letters of recommendation, and a statement of purpose.', 'ddaa8228-1ec6-46b4-975c-ee6e0d69d14b', 1, 'published', '2026-08-01 17:41:02.253754+00'),
  ('4c57738d-6ccb-4f5e-82b1-a522eb0a9f61', 'Is there a thesis requirement?', 'Master programs may offer thesis or non-thesis options. The thesis option requires original research and a written thesis, while the non-thesis option may include a capstone project or additional coursework.', 'ddaa8228-1ec6-46b4-975c-ee6e0d69d14b', 2, 'published', '2026-08-01 17:41:02.253754+00'),
  ('4cad68d5-3c5b-4f9a-8265-50b56e94650f', 'Do I need health insurance?', 'All International full-time students have mandatory health insurance included in their tuition fees. International students registered in part-time courses or in Co-op must pay additional health insurance and should consult with the International Education Centre.', '63621040-012a-410f-96fa-55b49e526a2f', 3, 'published', '2026-08-02 08:58:15.336017+00'),
  ('534048eb-1b83-49ee-ac73-1fed8d0d79a0', 'What financial aid options are available?', 'Cannoga College offers various financial aid options including scholarships, grants, and student loans. Please visit the financial aid office or contact admissions for more information.', '354e9413-bd93-4db0-920d-329eb5246112', 4, 'published', '2026-08-01 17:41:02.253754+00'),
  ('662712bf-776b-4d37-ae31-7d18e56edaa9', 'How many hours per week is the English for Academic Purposes (EAP) program and how many levels are there?', 'The English as a Second Language program is an intensive, full-time program of 20 hours/week in a traditional classroom setting. There are eight levels – 2 Pre-EAP Levels (Pre-EAP 1, Pre-EAP 2) and 6 EAP Levels (1A, 1B, 2A, 2B, 3A and 3B).', '63621040-012a-410f-96fa-55b49e526a2f', 15, 'published', '2026-08-02 08:58:15.336017+00'),
  ('80aa3114-9bd5-4644-8007-afa9a0fa999e', 'Do you offer co-op programs?', 'Many of our bachelor programs include co-op opportunities that provide real-world work experience. Check the specific program details for co-op availability and requirements.', 'aa291b86-416a-405f-beeb-cedda49e5fbe', 3, 'published', '2026-08-01 17:41:02.253754+00'),
  ('86d13f4c-95ef-4201-9531-3dc1400f2b9e', 'Do I need a study permit?', 'International students from countries requiring a visa must obtain a valid Canadian study permit before arriving in Canada. Please check with Immigration, Refugees and Citizenship Canada (IRCC) for current requirements.', 'f8efa207-88b2-4dda-8a2d-ef605092e812', 1, 'published', '2026-08-01 17:41:02.253754+00'),
  ('8eb217fc-952f-48c9-ae57-ed8c6489c6f7', 'Do you offer extra curricular activities?', 'Yes! Activities such as bowling, movie night, dancing, skiing, skating etc. are organized through the International Education Centre (IEC).

The IEC also organizes free workshops about academic issues and immigration-related matters. Visit our News and Events for a listing.', '63621040-012a-410f-96fa-55b49e526a2f', 2, 'published', '2026-08-02 08:58:15.336017+00'),
  ('92271bc6-34e1-4f7a-a5e9-22e82c4ca002', 'Why are international student fees higher than Canadian fees?', 'The provincial government and its taxpayers subsidize education for Canadian students who are studying in Canada. International students do not pay provincial taxes, so they are not eligible for subsidies and must pay the full cost of tuition.', '63621040-012a-410f-96fa-55b49e526a2f', 5, 'published', '2026-08-02 08:58:15.336017+00'),
  ('9dc0812b-358f-4590-9aee-47f94366052a', 'Do you offer scholarships/financial assistance to International students?', 'Scholarships and bursaries are available through individual programs based upon student academic performance and leadership skills. Limited financial assistance may be available in emergency situations.', '63621040-012a-410f-96fa-55b49e526a2f', 10, 'published', '2026-08-02 08:58:15.336017+00'),
  ('a0ecfac0-d47d-4e88-b8af-2523810c440f', 'Are there payment plans available?', 'Yes, payment plans may be available. Please contact the admissions office for details on installment options.', '354e9413-bd93-4db0-920d-329eb5246112', 3, 'published', '2026-08-01 17:41:02.253754+00'),
  ('a88e53cb-9078-4778-8029-9f1ef6d65375', 'What level will I start at if I study English?', 'All new International students entering the English for Academic Purposes program will be required to complete a placement test when they arrive. That test will determine your level. Click here for information about our EAP levels.', '63621040-012a-410f-96fa-55b49e526a2f', 13, 'published', '2026-08-02 08:58:15.336017+00'),
  ('b79a45cb-3010-424a-aed3-41b87df42ecc', 'Can I transfer credits from another institution?', 'Yes, transfer credits may be accepted from recognized post-secondary institutions. Each transfer request is evaluated on a case-by-case basis. Contact the registrar''s office for a transfer credit assessment.', 'aa291b86-416a-405f-beeb-cedda49e5fbe', 2, 'published', '2026-08-01 17:41:02.253754+00'),
  ('bc8775c9-45cc-4abf-a763-6f5f08552f50', 'How can I get a study permit?', 'You can apply for a study permit from your home country at the closest Canadian Embassy, High Commission or Consulate once you have received a letter of acceptance. Visit Citizenship and Immigration Canada (CIC)''s website to find out how to obtain a study permit.', '63621040-012a-410f-96fa-55b49e526a2f', 8, 'published', '2026-08-02 08:58:15.336017+00'),
  ('c0ffabd8-e1bb-496a-a007-deb04e764d11', 'How many students are there in an English for Academic Purposes (EAP) class?', 'Class sizes vary depending on the level of instruction. Lower levels tend to have smaller class sizes.

At the higher levels, students prepare for academic studies and are expected to adapt to larger groups. Average class size is 15-22.', '63621040-012a-410f-96fa-55b49e526a2f', 14, 'published', '2026-08-02 08:58:15.336017+00'),
  ('c4386f17-6839-4afc-995c-00f3a106df78', 'How much money will I need for one year of study?', 'You will require approximately $25,000 CAD to cover tuition fees, living expenses, clothing, entertainment, local travel, books and supplies etc.', '63621040-012a-410f-96fa-55b49e526a2f', 9, 'published', '2026-08-02 08:58:15.336017+00'),
  ('ca5afe1f-b19e-4fa8-83ef-cea63a9e16d5', 'What is the weather like in Ottawa?', 'Ottawa is lucky enough to have four distinct seasons: fall, winter, summer and spring.', '63621040-012a-410f-96fa-55b49e526a2f', 6, 'published', '2026-08-02 08:58:15.336017+00'),
  ('d7d7d0f3-bf34-4f1a-90f3-d160daad9b96', 'Is dental care covered in my health insurance?', 'Dental care is not covered in your comprehensive health insurance package.

However, Cannoga College has a dental clinic on campus, and dental coverage can be obtained through the Student''s Association.', '63621040-012a-410f-96fa-55b49e526a2f', 1, 'published', '2026-08-02 08:58:15.336017+00'),
  ('d8b22454-3ac4-444e-91dc-edbefe3df3b7', 'Can I work while I study?', 'International students who are registered in full-time programs can work on- and off-campus. Find out more info on the International Student Handouts page.

The wages offered for this type of work will not be enough to cover your tuition and/or living expenses.', '63621040-012a-410f-96fa-55b49e526a2f', 7, 'published', '2026-08-02 08:58:15.336017+00'),
  ('d98c083f-1969-48a9-b0dd-c69e067db9f9', 'What is the tuition fee for domestic students?', 'Tuition fees for domestic students vary by program. Certificate programs are $1,500 per semester, diploma programs are $1,500 per semester, bachelor programs are $2,500 per semester, and master programs are $3,500 per semester.', '354e9413-bd93-4db0-920d-329eb5246112', 1, 'published', '2026-08-01 17:41:02.253754+00'),
  ('df35089e-64ad-48d8-8b20-25ee05a7022c', 'What will my class schedule be like?', 'For English for Academic Purposes (EAP), classes are held Monday to Friday, from 8 a.m. to 12 p.m., 12 p.m. to 4 p.m., 4 p.m. to 8 p.m., depending on your level of study. For Post Secondary programs, your class schedule will depend on the program and a variety of factors and won''t be established until close to the start of your program. You should be available at any time for classes.', '63621040-012a-410f-96fa-55b49e526a2f', 11, 'published', '2026-08-02 08:58:15.336017+00'),
  ('e473885d-a8ac-483f-8c40-6c17ace884bd', 'What are the admission requirements for bachelor programs?', 'Bachelor program applicants typically need a high school diploma with a minimum average of 70%, proof of English proficiency, and any program-specific prerequisites. Some programs may require a portfolio or interview.', 'aa291b86-416a-405f-beeb-cedda49e5fbe', 1, 'published', '2026-08-01 17:41:02.253754+00'),
  ('e9f9e0de-25e0-4b5a-a5ab-d406975d2a97', 'Is Cannoga College a Designated Learning Institution (DLI)?', 'Cannoga College is recognized by the province of Ontario. Please verify the current DLI status with the college directly and check the IRCC website for the most up-to-date information.', 'f8efa207-88b2-4dda-8a2d-ef605092e812', 2, 'published', '2026-08-01 17:41:02.253754+00'),
  ('f383b60a-ee5b-4f49-a484-f803f3d7d0af', 'What is the tuition fee for international students?', 'Tuition fees for international students vary by program. Certificate programs are $2,500 per semester, diploma programs are $2,500 per semester, bachelor programs are $4,000 per semester, and master programs are $6,000 per semester.', '354e9413-bd93-4db0-920d-329eb5246112', 2, 'published', '2026-08-01 17:41:02.253754+00')
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  created_at = EXCLUDED.created_at,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- 5. TUITION INFO
-- ============================================================
INSERT INTO tuition_info (credential_type, domestic_tuition, international_tuition, application_fee, status)
VALUES
  ('CERTIFICATE', '{"domesticTuition": "$2,400 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}', '{"annualTuition": "$4,000 per semester", "perCredit": null, "terms": "Payment plans available"}', 0.00, 'active'),
  ('DIPLOMA', '{"domesticTuition": "$2,400 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}', '{"annualTuition": "$4,000 per semester", "perCredit": null, "terms": "Payment plans available"}', 0.00, 'active'),
  ('BACHELOR', '{"domesticTuition": "$4,000 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}', '{"annualTuition": "$6,400 per semester", "perCredit": null, "terms": "Payment plans available"}', 0.00, 'active'),
  ('MASTER', '{"domesticTuition": "$5,600 per semester", "domesticPerCredit": null, "terms": "Payment plans available"}', '{"annualTuition": "$9,600 per semester", "perCredit": null, "terms": "Payment plans available"}', 0.00, 'active')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. ANNOUNCEMENTS
-- ============================================================
INSERT INTO announcements (title, excerpt, content, priority, status, publish_start)
VALUES
  ('Welcome to Cannoga College', 'We welcome all new and returning students for the upcoming semester.', 'Welcome to Cannoga College! We are excited to have you join our academic community.', 'normal', 'published', NOW()),
  ('Fall 2026 Intake Open', 'Applications are now open for the Fall 2026 intake.', 'Applications for the Fall 2026 intake are now open. Visit our admissions page to apply.', 'normal', 'published', NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. INTAKES
-- ============================================================
INSERT INTO system_settings ("key", "value", description)
VALUES
  ('intake_fall_2026', '{"label": "Fall 2026", "month": "September", "startDate": "11.09.2026"}', 'Fall 2026 intake details'),
  ('intake_winter_2027', '{"label": "Winter 2027", "month": "January", "startDate": "18.1.2027"}', 'Winter 2027 intake details'),
  ('intake_fall_2027', '{"label": "Fall 2027", "month": "September", "startDate": "11.09.2027"}', 'Fall 2027 intake details')
ON CONFLICT ("key") DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  "updatedAt" = CURRENT_TIMESTAMP;

-- ============================================================
-- 8. SEARCH DATA (page content)
-- ============================================================
INSERT INTO page_content (page_slug, section_key, content)
VALUES
  ('admissions', 'overview', 'Explore educational options at Cannoga College.'),
  ('admissions', 'degreeProgrammes', 'Degree Programmes'),
  ('admissions', 'howToApply', 'How to Apply'),
  ('admissions', 'events', 'Events for Applicants'),
  ('admissions', 'studentStories', 'Student Stories'),
  ('admissions', 'campus', 'Studying on Campus'),
  ('admissions', 'careers', 'Career Opportunities'),
  ('admissions', 'onlineOpportunities', 'Online & Onsite'),
  ('admissions', 'community', 'Vibrant Community'),
  ('admissions', 'graduation', 'After Graduation'),
  ('admissions', 'studyInOttawa', 'study in Ottawa, Ontario, Canada'),
  ('admissions', 'lifelongLearning', 'Lifelong Learning'),
  ('admissions', 'summerEducation', 'Summer Education'),
  ('admissions', 'collaboration', 'Collaboration'),
  ('admissions', 'contact', 'Contact & Support'),
  ('schools', 'title', 'Our Schools'),
  ('schools', 'description', 'Cannoga College is organized into specialized schools, each driving innovation in technology, business, science, and design through world-class research and English-taught certificate, diploma, bachelor''s and master''s programmes.'),
  ('home', 'programsTitle', 'Explore Our Programs and Courses'),
  ('home', 'programsDescription', 'Find the right academic path tailored to your goals at our Ottawa campus.'),
  ('home', 'schoolsTitle', 'Our Schools'),
  ('home', 'resourcesTitle', 'Student Resource Hub')
ON CONFLICT (page_slug, section_key) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

COMMIT;