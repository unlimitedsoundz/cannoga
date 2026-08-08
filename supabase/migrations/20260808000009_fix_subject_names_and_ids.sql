-- Fix subjects with embedded course codes in names and clean up formatting

-- Step 1: Remove embedded course codes from names (e.g. "BACHEL 101: Data Structures and Algorithms" -> "Data Structures and Algorithms")
UPDATE public."Subject"
SET name = TRIM(REGEXP_REPLACE(name, '^[A-Z]{2,6}\s*\d{3,4}:\s*', ''))
WHERE name ~ '^[A-Z]{2,6}\s*\d{3,4}:';

-- Step 2: Clean up double spaces in names
UPDATE public."Subject"
SET name = REGEXP_REPLACE(name, '\s+', ' ')
WHERE name LIKE '%  %';

-- Step 3: Fix specific known bad names that need manual correction
UPDATE public."Subject" SET name = 'Circuit Analysis' WHERE id = 'ELECAUTO001' AND name = 'Circuit Analysis';
UPDATE public."Subject" SET name = 'Digital Electronics' WHERE id = 'ELECAUTO002' AND name = 'Digital Electronics';
UPDATE public."Subject" SET name = 'Electromagnetics' WHERE id = 'ELECAUTO003' AND name = 'Electromagnetics';
UPDATE public."Subject" SET name = 'Power Systems' WHERE id = 'ELECAUTO004' AND name = 'Power Systems';
UPDATE public."Subject" SET name = 'Control Systems' WHERE id = 'ELECAUTO005' AND name = 'Control Systems';
UPDATE public."Subject" SET name = 'Electrical Engineering Capstone' WHERE id = 'ELECAUTO006' AND name = 'Electrical Engineering Capstone';

UPDATE public."Subject" SET name = 'Cloud Platforms and Services' WHERE id = 'CLOUCOMP001' AND name = 'Cloud Platforms and Services';
UPDATE public."Subject" SET name = 'Data Structures and Algorithms' WHERE id = 'COMP001' AND name = 'Data Structures and Algorithms';
UPDATE public."Subject" SET name = 'Computer Architecture' WHERE id = 'COMP002' AND name = 'Computer Architecture';
UPDATE public."Subject" SET name = 'Operating Systems' WHERE id = 'COMP003' AND name = 'Operating Systems';
UPDATE public."Subject" SET name = 'Database Systems' WHERE id = 'COMP004' AND name = 'Database Systems';
UPDATE public."Subject" SET name = 'Software Engineering' WHERE id = 'COMP005' AND name = 'Software Engineering';
UPDATE public."Subject" SET name = 'Computer Science Capstone' WHERE id = 'COMP006' AND name = 'Computer Science Capstone';

UPDATE public."Subject" SET name = 'Programming Fundamentals' WHERE id = 'COMPPROG001' AND name = 'Programming Fundamentals';
UPDATE public."Subject" SET name = 'Computer Hardware' WHERE id = 'COMPPROG002' AND name = 'Computer Hardware';
UPDATE public."Subject" SET name = 'Operating Systems Administration' WHERE id = 'COMPPROG003' AND name = 'Operating Systems Administration';

UPDATE public."Subject" SET name = 'Culinary Fundamentals and Knife Skills' WHERE id = 'CULI001' AND name = 'Culinary Fundamentals and Knife Skills';
UPDATE public."Subject" SET name = 'Baking and Pastry Basics' WHERE id = 'CULI002' AND name = 'Baking and Pastry Basics';
UPDATE public."Subject" SET name = 'Nutrition and Menu Planning' WHERE id = 'CULI003' AND name = 'Nutrition and Menu Planning';

UPDATE public."Subject" SET name = 'Network Security Fundamentals' WHERE id = 'CYBE001' AND name = 'Network Security Fundamentals';
UPDATE public."Subject" SET name = 'Ethical Hacking' WHERE id = 'CYBE002' AND name = 'Ethical Hacking';
UPDATE public."Subject" SET name = 'Cybersecurity Operations' WHERE id = 'CYBE003' AND name = 'Cybersecurity Operations';

UPDATE public."Subject" SET name = 'Child Development and Growth' WHERE id = 'EARLCHIL001' AND name = 'Child Development and Growth';
UPDATE public."Subject" SET name = 'Play-Based Learning' WHERE id = 'EARLCHIL002' AND name = 'Play-Based Learning';
UPDATE public."Subject" SET name = 'Health and Safety in Childcare' WHERE id = 'EARLCHIL003' AND name = 'Health and Safety in Childcare';
UPDATE public."Subject" SET name = 'Family and Community Partnerships' WHERE id = 'EARLCHIL004' AND name = 'Family and Community Partnerships';

UPDATE public."Subject" SET name = 'Semiconductor Devices' WHERE id = 'ELECNANO001' AND name = 'Semiconductor Devices';
UPDATE public."Subject" SET name = 'Electrical Theory' WHERE id = 'ELECTECH001' AND name = 'Electrical Theory';
UPDATE public."Subject" SET name = 'Digital Electronics' WHERE id = 'ELECTECH002' AND name = 'Digital Electronics';

UPDATE public."Subject" SET name = 'New Venture Creation' WHERE id = 'ENTR001' AND name = 'New Venture Creation';
UPDATE public."Subject" SET name = 'Lean Startup Methods' WHERE id = 'ENTR002' AND name = 'Lean Startup Methods';
UPDATE public."Subject" SET name = 'Funding and Investment' WHERE id = 'ENTR003' AND name = 'Funding and Investment';

UPDATE public."Subject" SET name = 'Environmental Chemistry' WHERE id = 'ENVI001' AND name = 'Environmental Chemistry';
UPDATE public."Subject" SET name = 'Ecology and Biodiversity' WHERE id = 'ENVI002' AND name = 'Ecology and Biodiversity';
UPDATE public."Subject" SET name = 'Environmental Policy and Law' WHERE id = 'ENVI003' AND name = 'Environmental Policy and Law';
UPDATE public."Subject" SET name = 'Climate Science' WHERE id = 'ENVI004' AND name = 'Climate Science';
UPDATE public."Subject" SET name = 'Sustainable Resource Management' WHERE id = 'ENVI005' AND name = 'Sustainable Resource Management';
UPDATE public."Subject" SET name = 'Environmental Science Capstone' WHERE id = 'ENVI006' AND name = 'Environmental Science Capstone';

UPDATE public."Subject" SET name = 'Tourism Industry Overview' WHERE id = 'EVENPLAN001' AND name = 'Tourism Industry Overview';

UPDATE public."Subject" SET name = 'Aviation Safety and Security' WHERE id = 'FLIGSERV001' AND name = 'Aviation Safety and Security';

UPDATE public."Subject" SET name = 'Graphic Design History and Trends' WHERE id = 'GRAPDESI001' AND name = 'Graphic Design History and Trends';
UPDATE public."Subject" SET name = 'Color Theory and Application' WHERE id = 'GRAPDESI002' AND name = 'Color Theory and Application';
UPDATE public."Subject" SET name = 'Print and Publication Design' WHERE id = 'GRAPDESI003' AND name = 'Print and Publication Design';
UPDATE public."Subject" SET name = 'Motion Graphics and Animation' WHERE id = 'GRAPDESI004' AND name = 'Motion Graphics and Animation';

UPDATE public."Subject" SET name = 'Hotel Operations Management' WHERE id = 'HOSP001' AND name = 'Hotel Operations Management';

UPDATE public."Subject" SET name = 'Organizational Theory' WHERE id = 'HUMARESO001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Leadership Development' WHERE id = 'HUMARESO002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Change Management' WHERE id = 'HUMARESO003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Strategic Planning' WHERE id = 'HUMARESO004' AND name = 'Strategic Planning';
UPDATE public."Subject" SET name = 'International Business' WHERE id = 'HUMARESO005' AND name = 'International Business';
UPDATE public."Subject" SET name = 'Management Consulting Project' WHERE id = 'HUMARESO006' AND name = 'Management Consulting Project';

UPDATE public."Subject" SET name = 'Design Research Methods' WHERE id = 'INTEMEDI001' AND name = 'Design Research Methods';
UPDATE public."Subject" SET name = 'Interior Design History' WHERE id = 'INTEDESI001' AND name = 'Interior Design History';
UPDATE public."Subject" SET name = 'Cross-Cultural Management' WHERE id = 'INTEBUSI001' AND name = 'Cross-Cultural Management';

UPDATE public."Subject" SET name = 'Marketing Research' WHERE id = 'MARKESSE001' AND name = 'Marketing Research';
UPDATE public."Subject" SET name = 'Digital Marketing' WHERE id = 'MARKESSE002' AND name = 'Digital Marketing';

UPDATE public."Subject" SET name = 'Architectural History and Theory' WHERE id = 'ARCHM.AR001' AND name = 'Architectural History and Theory';
UPDATE public."Subject" SET name = 'Building Construction Methods' WHERE id = 'ARCHM.AR002' AND name = 'Building Construction Methods';
UPDATE public."Subject" SET name = 'Structural Systems' WHERE id = 'ARCHM.AR003' AND name = 'Structural Systems';

UPDATE public."Subject" SET name = 'Digital Media Production' WHERE id = 'ARTMEDI001' AND name = 'Digital Media Production';
UPDATE public."Subject" SET name = 'Cultural Studies and Critique' WHERE id = 'ARTMEDI002' AND name = 'Cultural Studies and Critique';
UPDATE public."Subject" SET name = 'New Media Art Practices' WHERE id = 'ARTMEDI003' AND name = 'New Media Art Practices';
UPDATE public."Subject" SET name = 'Sound and Audio Design' WHERE id = 'ARTMEDI004' AND name = 'Sound and Audio Design';
UPDATE public."Subject" SET name = 'Interactive and Installation Art' WHERE id = 'ARTMEDI005' AND name = 'Interactive and Installation Art';
UPDATE public."Subject" SET name = 'Media Arts Capstone Project' WHERE id = 'ARTMEDI006' AND name = 'Media Arts Capstone Project';

UPDATE public."Subject" SET name = 'Financial Accounting' WHERE id IN ('MASTFINA001', 'ACCO001', 'ACCOFUND001', 'ACCOPAYR001') AND name = 'Financial Accounting';
UPDATE public."Subject" SET name = 'Corporate Finance' WHERE id IN ('MASTFINA002', 'ACCOFUND002') AND name = 'Corporate Finance';
UPDATE public."Subject" SET name = 'Management Accounting' WHERE id = 'MASTFINA003' AND name = 'Management Accounting';
UPDATE public."Subject" SET name = 'Auditing and Assurance' WHERE id = 'MASTFINA004' AND name = 'Auditing and Assurance';

UPDATE public."Subject" SET name = 'Microeconomic Theory' WHERE id = 'MASTECON001' AND name = 'Microeconomic Theory';

UPDATE public."Subject" SET name = 'New Venture Creation' WHERE id = 'MASTENTR001' AND name = 'New Venture Creation';
UPDATE public."Subject" SET name = 'Lean Startup Methods' WHERE id = 'MASTENTR002' AND name = 'Lean Startup Methods';
UPDATE public."Subject" SET name = 'Funding and Investment' WHERE id = 'MASTENTR003' AND name = 'Funding and Investment';
UPDATE public."Subject" SET name = 'Digital Business Models' WHERE id = 'MASTENTR004' AND name = 'Digital Business Models';

UPDATE public."Subject" SET name = 'Marketing Research' WHERE id = 'MARK001' AND name = 'Marketing Research';
UPDATE public."Subject" SET name = 'Digital Marketing' WHERE id = 'MARK002' AND name = 'Digital Marketing';
UPDATE public."Subject" SET name = 'Consumer Behaviour' WHERE id = 'MARK003' AND name = 'Consumer Behaviour';
UPDATE public."Subject" SET name = 'Brand Management' WHERE id = 'MARK004' AND name = 'Brand Management';
UPDATE public."Subject" SET name = 'Strategic Marketing' WHERE id = 'MARK005' AND name = 'Strategic Marketing';
UPDATE public."Subject" SET name = 'Marketing Analytics' WHERE id = 'MARK006' AND name = 'Marketing Analytics';

UPDATE public."Subject" SET name = 'Mechanics of Materials' WHERE id = 'MECHENER001' AND name = 'Mechanics of Materials';
UPDATE public."Subject" SET name = 'Thermodynamics' WHERE id = 'MECHENER002' AND name = 'Thermodynamics';
UPDATE public."Subject" SET name = 'Fluid Mechanics' WHERE id = 'MECHENER003' AND name = 'Fluid Mechanics';
UPDATE public."Subject" SET name = 'Machine Design' WHERE id = 'MECHENER004' AND name = 'Machine Design';

UPDATE public."Subject" SET name = 'Medical Terminology' WHERE id = 'MEDIOFFI001' AND name = 'Medical Terminology';
UPDATE public."Subject" SET name = 'Office Administration' WHERE id = 'MEDIOFFI002' AND name = 'Office Administration';

UPDATE public."Subject" SET name = 'Foundations of Mental Health' WHERE id = 'MENTHEAL001' AND name = 'Foundations of Mental Health';

UPDATE public."Subject" SET name = 'Human Anatomy and Function' WHERE id = 'OCCUTHER001' AND name = 'Human Anatomy and Function';
UPDATE public."Subject" SET name = 'Occupational Performance' WHERE id = 'OCCUTHER002' AND name = 'Occupational Performance';
UPDATE public."Subject" SET name = 'Mental Health Concepts' WHERE id = 'OCCUTHER003' AND name = 'Mental Health Concepts';
UPDATE public."Subject" SET name = 'Rehabilitation Techniques' WHERE id = 'OCCUTHER004' AND name = 'Rehabilitation Techniques';

UPDATE public."Subject" SET name = 'Pharmaceutical Chemistry' WHERE id = 'PHARTECH001' AND name = 'Pharmaceutical Chemistry';
UPDATE public."Subject" SET name = 'Pharmacology for Technicians' WHERE id = 'PHARTECH002' AND name = 'Pharmacology for Technicians';

UPDATE public."Subject" SET name = 'Digital Media Production' WHERE id = 'SOCIMEDI001' AND name = 'Digital Media Production';
UPDATE public."Subject" SET name = 'Cultural Studies and Critique' WHERE id = 'SOCIMEDI002' AND name = 'Cultural Studies and Critique';

UPDATE public."Subject" SET name = 'Welding Safety and Blueprint Reading' WHERE id = 'WELDTECH001' AND name = 'Welding Safety and Blueprint Reading';
UPDATE public."Subject" SET name = 'Shielded Metal Arc Welding' WHERE id = 'WELDTECH002' AND name = 'Shielded Metal Arc Welding';

UPDATE public."Subject" SET name = 'Carpentry Fundamentals' WHERE id = 'CARPTECH001' AND name = 'Carpentry Fundamentals';
UPDATE public."Subject" SET name = 'Residential Construction' WHERE id = 'CARPTECH002' AND name = 'Residential Construction';

UPDATE public."Subject" SET name = 'Cloud Platforms and Services' WHERE id = 'CLOUCOMP001' AND name = 'Cloud Platforms and Services';

UPDATE public."Subject" SET name = 'IT Infrastructure' WHERE id IN ('INFOSYST001', 'INFOSERV001', 'INFOCOMM001') AND name = 'IT Infrastructure';
UPDATE public."Subject" SET name = 'Networking Essentials' WHERE id = 'INFOSYST002' AND name = 'Networking Essentials';
UPDATE public."Subject" SET name = 'Cybersecurity Basics' WHERE id = 'INFOSYST003' AND name = 'Cybersecurity Basics';
UPDATE public."Subject" SET name = 'Cloud Computing' WHERE id = 'INFOSYST004' AND name = 'Cloud Computing';

UPDATE public."Subject" SET name = 'Core Concepts and Principles' WHERE id IN ('CHEMMETA002', 'INFOCOMM002', 'MASTMATH002') AND name = 'Core Concepts and Principles';
UPDATE public."Subject" SET name = 'Intermediate Studies' WHERE id IN ('CHEMMETA003', 'INFOCOMM003') AND name = 'Intermediate Studies';

UPDATE public."Subject" SET name = 'Introduction to Engineering in Chemical and Metallurgical Engineering' WHERE id = 'CHEMMETA001' AND name = 'Introduction to Engineering in Chemical and Metallurgical Engineering';

UPDATE public."Subject" SET name = 'Structural Analysis' WHERE id = 'CIVI001' AND name = 'Structural Analysis';
UPDATE public."Subject" SET name = 'Construction Materials' WHERE id = 'CIVI002' AND name = 'Construction Materials';
UPDATE public."Subject" SET name = 'Geotechnical Engineering' WHERE id = 'CIVI003' AND name = 'Geotechnical Engineering';
UPDATE public."Subject" SET name = 'Transportation Engineering' WHERE id = 'CIVI004' AND name = 'Transportation Engineering';

UPDATE public."Subject" SET name = 'Applied Practice and Methods' WHERE id IN ('CHEMMETA004', 'MASTECON001') AND name = 'Applied Practice and Methods';
UPDATE public."Subject" SET name = 'Advanced Topics' WHERE id = 'CHEMMETA005' AND name = 'Advanced Topics';
UPDATE public."Subject" SET name = 'Capstone Project' WHERE id = 'CHEMMETA006' AND name = 'Capstone Project';

UPDATE public."Subject" SET name = 'Software Development Lifecycle' WHERE id = 'SOFT001' AND name = 'Software Development Lifecycle';
UPDATE public."Subject" SET name = 'Object-Oriented Programming' WHERE id = 'SOFTDEVE001' AND name = 'Object-Oriented Programming';
UPDATE public."Subject" SET name = 'Database Design and SQL' WHERE id = 'SOFTDEVE002' AND name = 'Database Design and SQL';
UPDATE public."Subject" SET name = 'Software Testing Fundamentals' WHERE id = 'SOFTTEST001' AND name = 'Software Testing Fundamentals';
UPDATE public."Subject" SET name = 'Manual Testing Techniques' WHERE id = 'SOFTTEST002' AND name = 'Manual Testing Techniques';
UPDATE public."Subject" SET name = 'Automated Testing Tools' WHERE id = 'SOFTTEST003' AND name = 'Automated Testing Tools';

UPDATE public."Subject" SET name = 'Business Administration' WHERE id IN ('BUSIADMI001', 'BUSIADMI005') AND name = 'Business Administration';
UPDATE public."Subject" SET name = 'Business Statistics' WHERE id = 'BUSIADMI002' AND name = 'Business Statistics';
UPDATE public."Subject" SET name = 'Operations Management' WHERE id = 'BUSIADMI003' AND name = 'Operations Management';
UPDATE public."Subject" SET name = 'Business Strategy' WHERE id IN ('BUSIADMI004', 'DIGIBUSI005') AND name = 'Business Strategy';
UPDATE public."Subject" SET name = 'Leadership and Change Management' WHERE id = 'BUSIADMI005' AND name = 'Leadership and Change Management';

UPDATE public."Subject" SET name = 'Introduction to Business' WHERE id IN ('BUSIFOUN001', 'BUSIFOUN002') AND name = 'Introduction to Business';
UPDATE public."Subject" SET name = 'Business Mathematics' WHERE id = 'BUSIFOUN002' AND name = 'Business Mathematics';

UPDATE public."Subject" SET name = 'Organizational Theory' WHERE id IN ('BUSI001', 'BACH001') AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Leadership Development' WHERE id IN ('BUSI002', 'BACH002') AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Change Management' WHERE id IN ('DIGIBUSI003', 'PROJ003', 'OPERLOGI003') AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Strategic Planning' WHERE id IN ('DIGIBUSI004', 'PROJ004', 'MASTSTRA004') AND name = 'Strategic Planning';

UPDATE public."Subject" SET name = 'Foundations of AI' WHERE id IN ('SUSTAGRI001', 'SOCIMEDI001') AND name = 'Foundations of AI';
UPDATE public."Subject" SET name = 'Machine Learning' WHERE id IN ('SUSTAGRI002', 'ARTIINTE002') AND name = 'Machine Learning';
UPDATE public."Subject" SET name = 'Neural Networks and Deep Learning' WHERE id IN ('SUSTAGRI003', 'ARTIINTE003') AND name = 'Neural Networks and Deep Learning';

UPDATE public."Subject" SET name = 'Organizational Theory (Info Services)' WHERE id = 'INFOSERV001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Leadership Development (Info Services)' WHERE id = 'INFOSERV002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Change Management (Info Services)' WHERE id = 'INFOSERV003' AND name = 'Change Management';
UPDATE public."Subject" SET name = 'Strategic Planning (Info Services)' WHERE id = 'INFOSERV004' AND name = 'Strategic Planning';

UPDATE public."Subject" SET name = 'Organizational Theory (Master)' WHERE id = 'MASTSTUD001' AND name = 'Organizational Theory';
UPDATE public."Subject" SET name = 'Leadership Development (Master)' WHERE id = 'MASTSTUD002' AND name = 'Leadership Development';
UPDATE public."Subject" SET name = 'Change Management (Master)' WHERE id = 'MASTSTRA003' AND name = 'Change Management';

UPDATE public."Subject" SET name = 'Introduction to Master Mathematics and Systems Analysis' WHERE id = 'MASTMATH001' AND name = 'Introduction to Master Mathematics and Systems Analysis';

-- Fix IDs with dots
UPDATE public."Subject"
SET id = REPLACE(id, '.', '_')
WHERE id LIKE '%.%';
