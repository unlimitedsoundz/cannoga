-- Seed additional subjects for courses with fewer than 5 subjects
-- Generated from actual Canadian academic standards

BEGIN;

-- Graphic Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('GRAPDESI001', 'GRAPHI 101: Graphic Design History and Trends', 3, 1, 'e920a449-64a1-4d0f-8e10-ca1ce49df8e4')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Interior Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INTEDESI001', 'INTERI 101: Interior Design History', 3, 1, '57dca006-2da9-417f-8ca7-81dbe18acd89')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Automotive Service Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('AUTOSERV001', 'AUTOMO 101: Automotive Engine Repair', 3, 1, '739fd695-26e2-4986-9b24-9c344778db2d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Science in Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MARK001', 'MASTER 101: Marketing Research', 3, 1, '10de7534-974b-44cc-b88b-8189cd3f302c'),
  ('MARK002', 'MASTER 102: Digital Marketing', 3, 1, '10de7534-974b-44cc-b88b-8189cd3f302c'),
  ('MARK003', 'MASTER 203: Consumer Behaviour', 3, 2, '10de7534-974b-44cc-b88b-8189cd3f302c'),
  ('MARK004', 'MASTER 204: Brand Management', 3, 2, '10de7534-974b-44cc-b88b-8189cd3f302c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Digital Business Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('DIGIBUSI001', 'BACHEL 101: Organizational Theory', 3, 1, '09892638-d4d8-4528-bc85-264f64a29474'),
  ('DIGIBUSI002', 'BACHEL 102: Leadership Development', 3, 1, '09892638-d4d8-4528-bc85-264f64a29474'),
  ('DIGIBUSI003', 'BACHEL 203: Change Management', 3, 2, '09892638-d4d8-4528-bc85-264f64a29474')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Environmental Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ENVI001', 'ENVIRO 101: Environmental Chemistry', 3, 1, '151555ca-dad5-4e18-92e2-84e8d8181c3d'),
  ('ENVI002', 'ENVIRO 102: Ecology and Biodiversity', 3, 1, '151555ca-dad5-4e18-92e2-84e8d8181c3d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Software Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCSOFT001', 'MSC IN 101: Software Development Lifecycle', 3, 1, '1c8e7234-9785-47aa-a838-b7db2cabae19'),
  ('MSCSOFT002', 'MSC IN 102: Object-Oriented Design', 3, 1, '1c8e7234-9785-47aa-a838-b7db2cabae19'),
  ('MSCSOFT003', 'MSC IN 203: Software Testing and QA', 3, 2, '1c8e7234-9785-47aa-a838-b7db2cabae19'),
  ('MSCSOFT004', 'MSC IN 204: Web Application Development', 3, 2, '1c8e7234-9785-47aa-a838-b7db2cabae19')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Cloud Computing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CLOUCOMP001', 'CLOUD  101: Cloud Platforms and Services', 3, 1, '1c7937fb-8f7f-4e5e-a3c3-ccc19ea2e54f')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Carpentry Techniques
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CARPTECH001', 'CARPEN 101: Carpentry Fundamentals', 3, 1, '189f7b1d-bce9-4194-8de2-6a666dc31790'),
  ('CARPTECH002', 'CARPEN 102: Residential Construction', 3, 1, '189f7b1d-bce9-4194-8de2-6a666dc31790')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Interactive Media Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INTEMEDI001', 'INTERA 101: Design Research Methods', 3, 1, '170bcd6a-0a17-4b39-86f0-9b4906a5d15b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Project Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PROJ001', 'BACHEL 101: Organizational Theory', 3, 1, 'cb16b448-5c5d-4e94-8ada-5049a0f0be4e'),
  ('PROJ002', 'BACHEL 102: Leadership Development', 3, 1, 'cb16b448-5c5d-4e94-8ada-5049a0f0be4e'),
  ('PROJ003', 'BACHEL 203: Change Management', 3, 2, 'cb16b448-5c5d-4e94-8ada-5049a0f0be4e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Information Technology
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFO001', 'BACHEL 101: IT Infrastructure', 3, 1, 'cd3b3eb9-6fd2-435c-9cb2-61c803195f21')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Social Media Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOCIMEDI001', 'SOCIAL 101: Digital Media Production', 3, 1, '2900350a-1a47-4712-8a04-805d26a06d43'),
  ('SOCIMEDI002', 'SOCIAL 102: Cultural Studies and Critique', 3, 1, '2900350a-1a47-4712-8a04-805d26a06d43')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Software Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFT001', 'BACHEL 101: Software Development Lifecycle', 3, 1, '24e9ab9d-d00c-4594-8825-0472992d3d0c'),
  ('SOFT002', 'BACHEL 102: Object-Oriented Design', 3, 1, '24e9ab9d-d00c-4594-8825-0472992d3d0c'),
  ('SOFT003', 'BACHEL 203: Software Testing and QA', 3, 2, '24e9ab9d-d00c-4594-8825-0472992d3d0c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Business Administration (MBA)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSIADMI001', 'MASTER 101: Organizational Behaviour', 3, 1, '34bd1ac7-e7d6-42e6-8888-c899fd0d5cea'),
  ('BUSIADMI002', 'MASTER 102: Business Statistics', 3, 1, '34bd1ac7-e7d6-42e6-8888-c899fd0d5cea')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Economics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTECON001', 'MASTER 101: Microeconomic Theory', 3, 1, '3f5938a1-8882-4bbf-8766-ecd48880a054')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Entrepreneurship
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ENTR001', 'ENTREP 101: New Venture Creation', 3, 1, '394b2ee4-df9c-4567-8307-cc8812ee05a4'),
  ('ENTR002', 'ENTREP 102: Lean Startup Methods', 3, 1, '394b2ee4-df9c-4567-8307-cc8812ee05a4'),
  ('ENTR003', 'ENTREP 203: Funding and Investment', 3, 2, '394b2ee4-df9c-4567-8307-cc8812ee05a4')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Computer Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('COMP001', 'BACHEL 101: Data Structures and Algorithms', 3, 1, '3a0578ec-17d6-4b83-bdc6-da2742969869'),
  ('COMP002', 'BACHEL 102: Computer Architecture', 3, 1, '3a0578ec-17d6-4b83-bdc6-da2742969869')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Project Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCPROJ001', 'MSC IN 101: Organizational Theory', 3, 1, '51dab0f3-6f72-4d6c-ad23-ca4a35fe005b'),
  ('MSCPROJ002', 'MSC IN 102: Leadership Development', 3, 1, '51dab0f3-6f72-4d6c-ad23-ca4a35fe005b'),
  ('MSCPROJ003', 'MSC IN 203: Change Management', 3, 2, '51dab0f3-6f72-4d6c-ad23-ca4a35fe005b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Information Technology
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCINFO001', 'MSC IN 101: IT Infrastructure', 3, 1, '54c454e0-fc2d-4190-b562-7c9411b430e1'),
  ('MSCINFO002', 'MSC IN 102: Networking Essentials', 3, 1, '54c454e0-fc2d-4190-b562-7c9411b430e1'),
  ('MSCINFO003', 'MSC IN 203: Cybersecurity Basics', 3, 2, '54c454e0-fc2d-4190-b562-7c9411b430e1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- International Business
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INTEBUSI001', 'INTERN 101: Cross-Cultural Management', 3, 1, '4c856873-9b89-4531-830f-92f62dfd3a7a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Data Analytics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('DATAANAL001', 'DATA A 101: Cloud Platforms and Services', 3, 1, '4fdb1a87-5990-4246-b3cd-f20ec912d517'),
  ('DATAANAL002', 'DATA A 102: Cloud Security', 3, 1, '4fdb1a87-5990-4246-b3cd-f20ec912d517')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Business Administration (BBA)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSIADMI003', 'BACHEL 203: Operations Management', 3, 2, '767ee2d0-be50-4a1b-bddd-81e20e29b3bf'),
  ('BUSIADMI004', 'BACHEL 204: Business Strategy', 3, 2, '767ee2d0-be50-4a1b-bddd-81e20e29b3bf')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACHMARK001', 'BACHEL 101: Marketing Research', 3, 1, '4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66'),
  ('BACHMARK002', 'BACHEL 102: Digital Marketing', 3, 1, '4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66'),
  ('BACHMARK003', 'BACHEL 203: Consumer Behaviour', 3, 2, '4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66'),
  ('BACHMARK004', 'BACHEL 204: Brand Management', 3, 2, '4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Artificial Intelligence
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARTIINTE001', 'BACHEL 101: Foundations of AI', 3, 1, '586d3032-d371-4032-91c2-c964dba62488'),
  ('ARTIINTE002', 'BACHEL 102: Machine Learning', 3, 1, '586d3032-d371-4032-91c2-c964dba62488'),
  ('ARTIINTE003', 'BACHEL 203: Neural Networks and Deep Learning', 3, 2, '586d3032-d371-4032-91c2-c964dba62488')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Computer Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCCOMP001', 'MSC IN 101: Data Structures and Algorithms', 3, 1, '76111223-8b47-4bab-aec6-08486b1ac08e'),
  ('MSCCOMP002', 'MSC IN 102: Computer Architecture', 3, 1, '76111223-8b47-4bab-aec6-08486b1ac08e'),
  ('MSCCOMP003', 'MSC IN 203: Operating Systems', 3, 2, '76111223-8b47-4bab-aec6-08486b1ac08e'),
  ('MSCCOMP004', 'MSC IN 204: Database Systems', 3, 2, '76111223-8b47-4bab-aec6-08486b1ac08e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Human Resources Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('HUMARESO001', 'HUMAN  101: Organizational Theory', 3, 1, '4f202844-eafa-4b4a-9134-b7284642b873'),
  ('HUMARESO002', 'HUMAN  102: Leadership Development', 3, 1, '4f202844-eafa-4b4a-9134-b7284642b873'),
  ('HUMARESO003', 'HUMAN  203: Change Management', 3, 2, '4f202844-eafa-4b4a-9134-b7284642b873')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Business Foundations
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSIFOUN001', 'BUSINE 101: Introduction to Business', 3, 1, '6b7f77bc-9f23-4110-ace0-bc56de5ad0b6'),
  ('BUSIFOUN002', 'BUSINE 102: Business Mathematics', 3, 1, '6b7f77bc-9f23-4110-ace0-bc56de5ad0b6')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACH001', 'BACHEL 101: Organizational Theory', 3, 1, '5e9a3f7d-8c2b-4e8f-b9a1-3d2e4c1a6b55'),
  ('BACH002', 'BACHEL 102: Leadership Development', 3, 1, '5e9a3f7d-8c2b-4e8f-b9a1-3d2e4c1a6b55')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Engineering in Electrical Engineering and Automation
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECAUTO001', 'BACHEL 101: Circuit Analysis', 3, 1, '6e409883-44cd-4411-abaf-9621c475141d'),
  ('ELECAUTO002', 'BACHEL 102: Digital Electronics', 3, 1, '6e409883-44cd-4411-abaf-9621c475141d'),
  ('ELECAUTO003', 'BACHEL 203: Electromagnetics', 3, 2, '6e409883-44cd-4411-abaf-9621c475141d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Electrical Engineering and Automation
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECAUTO004', 'MASTER 204: Power Systems', 3, 2, '2bbdb166-50b5-4d5e-a550-8f547a9614a4'),
  ('ELECAUTO005', 'MASTER 305: Control Systems', 3, 3, '2bbdb166-50b5-4d5e-a550-8f547a9614a4'),
  ('ELECAUTO006', 'MASTER 406: Electrical Engineering Capstone', 6, 4, '2bbdb166-50b5-4d5e-a550-8f547a9614a4')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Supply Chain Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SUPPCHAI001', 'SUPPLY 101: Organizational Theory', 3, 1, '785132bb-7ded-4e7a-9b67-108018bd582c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Project Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PROJ004', 'PROJEC 204: Strategic Planning', 3, 2, 'dd1c53df-0bd7-4ce0-afce-361ce8fc6b1b'),
  ('PROJ005', 'PROJEC 305: International Business', 3, 3, 'dd1c53df-0bd7-4ce0-afce-361ce8fc6b1b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Operations & Logistics Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('OPERLOGI001', 'BACHEL 101: Organizational Theory', 3, 1, '86e16012-9173-4c5c-bb66-8393e1ead703'),
  ('OPERLOGI002', 'BACHEL 102: Leadership Development', 3, 1, '86e16012-9173-4c5c-bb66-8393e1ead703'),
  ('OPERLOGI003', 'BACHEL 203: Change Management', 3, 2, '86e16012-9173-4c5c-bb66-8393e1ead703')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Tourism Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('TOUR001', 'TOURIS 101: Tourism Industry Overview', 3, 1, '9ffe85a3-a398-4223-af2f-31fe6ae1a255')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Human Resources Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('HUMARESO004', 'HUMAN  204: Strategic Planning', 3, 2, 'a332fcc0-b1a7-4f38-8b4d-2cc8e58e235b'),
  ('HUMARESO005', 'HUMAN  305: International Business', 3, 3, 'a332fcc0-b1a7-4f38-8b4d-2cc8e58e235b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Business Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSI001', 'BACHEL 101: Organizational Theory', 3, 1, '98857c40-e58f-4778-bd6b-9909d39f985b'),
  ('BUSI002', 'BACHEL 102: Leadership Development', 3, 1, '98857c40-e58f-4778-bd6b-9909d39f985b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Cybersecurity Foundations
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CYBEFOUN001', 'CYBERS 101: Network Security', 3, 1, 'a84e2e31-7bd0-4d05-8d6e-b1ec2fce5379')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Culinary Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CULI001', 'CULINA 101: Culinary Fundamentals and Knife Skills', 3, 1, 'bf06b497-fc02-4b6b-bac8-0079e1e445df'),
  ('CULI002', 'CULINA 102: Baking and Pastry Basics', 3, 1, 'bf06b497-fc02-4b6b-bac8-0079e1e445df')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Mechanical and Energy Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHENER001', 'MASTER 101: Mechanics of Materials', 3, 1, '494308a0-3733-4c52-bc91-24d1f4308ae1'),
  ('MECHENER002', 'MASTER 102: Thermodynamics', 3, 1, '494308a0-3733-4c52-bc91-24d1f4308ae1'),
  ('MECHENER003', 'MASTER 203: Fluid Mechanics', 3, 2, '494308a0-3733-4c52-bc91-24d1f4308ae1'),
  ('MECHENER004', 'MASTER 204: Machine Design', 3, 2, '494308a0-3733-4c52-bc91-24d1f4308ae1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Environmental Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ENVI003', 'BACHEL 203: Environmental Policy and Law', 3, 2, 'c27fdf2a-f786-47d0-8c9c-c9c3e65b5580'),
  ('ENVI004', 'BACHEL 204: Climate Science', 3, 2, 'c27fdf2a-f786-47d0-8c9c-c9c3e65b5580'),
  ('ENVI005', 'BACHEL 305: Sustainable Resource Management', 3, 3, 'c27fdf2a-f786-47d0-8c9c-c9c3e65b5580'),
  ('ENVI006', 'BACHEL 406: Environmental Science Capstone', 6, 4, 'c27fdf2a-f786-47d0-8c9c-c9c3e65b5580')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Science in Computer Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('COMP003', 'BACHEL 203: Operating Systems', 3, 2, 'f4fa2bd2-2596-460f-a6f8-2eb04bd77b76'),
  ('COMP004', 'BACHEL 204: Database Systems', 3, 2, 'f4fa2bd2-2596-460f-a6f8-2eb04bd77b76'),
  ('COMP005', 'BACHEL 305: Software Engineering', 3, 3, 'f4fa2bd2-2596-460f-a6f8-2eb04bd77b76'),
  ('COMP006', 'BACHEL 406: Computer Science Capstone', 6, 4, 'f4fa2bd2-2596-460f-a6f8-2eb04bd77b76')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Welding Techniques
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('WELDTECH001', 'WELDIN 101: Welding Safety and Blueprint Reading', 3, 1, 'ccaf1620-3c3a-4a9c-82ef-03cc26ba5110'),
  ('WELDTECH002', 'WELDIN 102: Shielded Metal Arc Welding', 3, 1, 'ccaf1620-3c3a-4a9c-82ef-03cc26ba5110')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Software Testing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFTTEST001', 'SOFTWA 101: Testing Fundamentals', 3, 1, 'd65df282-a25c-4dc7-826a-a8ba007cf56e'),
  ('SOFTTEST002', 'SOFTWA 102: Manual Testing Techniques', 3, 1, 'd65df282-a25c-4dc7-826a-a8ba007cf56e'),
  ('SOFTTEST003', 'SOFTWA 203: Automated Testing Tools', 3, 2, 'd65df282-a25c-4dc7-826a-a8ba007cf56e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Graphic Design Fundamentals
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('GRAPDESI002', 'GRAPHI 102: Color Theory and Application', 3, 1, 'e6c77f69-489b-4c24-a4d3-317b6eeee5ba'),
  ('GRAPDESI003', 'GRAPHI 203: Print and Publication Design', 3, 2, 'e6c77f69-489b-4c24-a4d3-317b6eeee5ba'),
  ('GRAPDESI004', 'GRAPHI 204: Motion Graphics and Animation', 3, 2, 'e6c77f69-489b-4c24-a4d3-317b6eeee5ba')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Cybersecurity
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CYBE001', 'BACHEL 101: Network Security Fundamentals', 3, 1, 'e037b19c-08f1-455c-9048-3548fe8a3c48'),
  ('CYBE002', 'BACHEL 102: Ethical Hacking', 3, 1, 'e037b19c-08f1-455c-9048-3548fe8a3c48')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Management Studies
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTSTUD001', 'MASTER 101: Organizational Theory', 3, 1, 'e11cbb69-6915-4cc6-a110-05f8ab9577c7'),
  ('MASTSTUD002', 'MASTER 102: Leadership Development', 3, 1, 'e11cbb69-6915-4cc6-a110-05f8ab9577c7')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Applied Physics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACHAPPL001', 'BACHEL 101: Classical Mechanics', 3, 1, 'cf82b5e1-82e1-4c91-b0e1-fba61408702b'),
  ('BACHAPPL002', 'BACHEL 102: Electromagnetism', 3, 1, 'cf82b5e1-82e1-4c91-b0e1-fba61408702b'),
  ('BACHAPPL003', 'BACHEL 203: Quantum Physics', 3, 2, 'cf82b5e1-82e1-4c91-b0e1-fba61408702b'),
  ('BACHAPPL004', 'BACHEL 204: Thermodynamics', 3, 2, 'cf82b5e1-82e1-4c91-b0e1-fba61408702b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Engineering in Industrial Engineering and Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INDU001', 'BACHEL 101: Work Measurement and Methods', 3, 1, '43fa12ae-50e9-4671-8fac-6b3953d16af2'),
  ('INDU002', 'BACHEL 102: Quality Control', 3, 1, '43fa12ae-50e9-4671-8fac-6b3953d16af2'),
  ('INDU003', 'BACHEL 203: Production Planning', 3, 2, '43fa12ae-50e9-4671-8fac-6b3953d16af2'),
  ('INDU004', 'BACHEL 204: Ergonomics and Safety', 3, 2, '43fa12ae-50e9-4671-8fac-6b3953d16af2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Artificial Intelligence
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCARTI001', 'MSC IN 101: Foundations of AI', 3, 1, '00a6ad7f-68a7-4f79-b28b-2dc086365722'),
  ('MSCARTI002', 'MSC IN 102: Machine Learning', 3, 1, '00a6ad7f-68a7-4f79-b28b-2dc086365722'),
  ('MSCARTI003', 'MSC IN 203: Neural Networks and Deep Learning', 3, 2, '00a6ad7f-68a7-4f79-b28b-2dc086365722')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Mechanical Foundations
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHFOUN001', 'MECHAN 101: Mechanical Blueprint Reading', 3, 1, 'f52416bf-2fc5-401c-a87e-c0649fe5d060')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Mental Health and Addictions Support
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MENTHEAL001', 'MENTAL 101: Foundations of Mental Health', 3, 1, '786ce71f-0470-4d1b-b87d-ae19cfa735e3')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Science in Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MARK005', 'BACHEL 305: Strategic Marketing', 3, 3, '8d630322-3f05-4ee1-b109-ee2484a7d55e'),
  ('MARK006', 'BACHEL 306: Marketing Analytics', 3, 3, '8d630322-3f05-4ee1-b109-ee2484a7d55e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Event Planning
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('EVENPLAN001', 'EVENT  101: Tourism Industry Overview', 3, 1, 'e9ab889b-7940-410a-a8ec-79893b9fd242')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Early Childhood Education
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('EARLCHIL001', 'EARLY  101: Child Development and Growth', 3, 1, '769e6e4e-1ce4-4115-9534-fec7106740b4'),
  ('EARLCHIL002', 'EARLY  102: Play-Based Learning', 3, 1, '769e6e4e-1ce4-4115-9534-fec7106740b4'),
  ('EARLCHIL003', 'EARLY  203: Health and Safety in Childcare', 3, 2, '769e6e4e-1ce4-4115-9534-fec7106740b4')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- BSc Accounting & Finance
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BSCACCO001', 'BSC AC 101: Financial Accounting II', 3, 1, 'e15ef57b-2f95-42a6-b766-aeef883af9d2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Information Systems
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOSYST001', 'BACHEL 101: IT Infrastructure', 3, 1, '44aa0886-019f-475a-b616-9511729d1386'),
  ('INFOSYST002', 'BACHEL 102: Networking Essentials', 3, 1, '44aa0886-019f-475a-b616-9511729d1386'),
  ('INFOSYST003', 'BACHEL 203: Cybersecurity Basics', 3, 2, '44aa0886-019f-475a-b616-9511729d1386'),
  ('INFOSYST004', 'BACHEL 204: Cloud Computing', 3, 2, '44aa0886-019f-475a-b616-9511729d1386')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Arts in Film, Television and Scenography
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('FILMTELE001', 'BACHEL 101: Screenwriting and Storytelling', 3, 1, 'dd0c8f81-22d3-4ebe-9be4-ed7052ab6ff1'),
  ('FILMTELE002', 'BACHEL 102: Cinematography and Lighting', 3, 1, 'dd0c8f81-22d3-4ebe-9be4-ed7052ab6ff1'),
  ('FILMTELE003', 'BACHEL 203: Film Editing and Post-Production', 3, 2, 'dd0c8f81-22d3-4ebe-9be4-ed7052ab6ff1'),
  ('FILMTELE004', 'BACHEL 204: Production Design and Scenography', 3, 2, 'dd0c8f81-22d3-4ebe-9be4-ed7052ab6ff1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Electronics and Nanoengineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECNANO001', 'MASTER 101: Semiconductor Devices', 3, 1, 'd6cee1e6-6abf-4825-8b7b-68975c563f77')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Medical Office Administration
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MEDIOFFI001', 'MEDICA 101: Medical Terminology', 3, 1, 'c66363ef-0033-4d2b-9e1f-a6a7f66e9777'),
  ('MEDIOFFI002', 'MEDICA 102: Office Administration', 3, 1, 'c66363ef-0033-4d2b-9e1f-a6a7f66e9777')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Marketing Essentials
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MARKESSE001', 'MARKET 101: Marketing Research', 3, 1, 'dce59322-9923-4fdd-a357-db3202550318'),
  ('MARKESSE002', 'MARKET 102: Digital Marketing', 3, 1, 'dce59322-9923-4fdd-a357-db3202550318')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Architecture (M.Arch)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARCHM.AR001', 'MASTER 101: Architectural History and Theory', 3, 1, 'e78c421f-8e56-49f8-9e8d-555f4c7b78a7'),
  ('ARCHM.AR002', 'MASTER 102: Building Construction Methods', 3, 1, 'e78c421f-8e56-49f8-9e8d-555f4c7b78a7'),
  ('ARCHM.AR003', 'MASTER 203: Structural Systems', 3, 2, 'e78c421f-8e56-49f8-9e8d-555f4c7b78a7')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Management & Strategy
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTSTRA001', 'MASTER 101: Organizational Theory', 3, 1, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11'),
  ('MASTSTRA002', 'MASTER 102: Leadership Development', 3, 1, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11'),
  ('MASTSTRA003', 'MASTER 203: Change Management', 3, 2, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11'),
  ('MASTSTRA004', 'MASTER 204: Strategic Planning', 3, 2, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Engineering in Chemical and Metallurgical Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CHEMMETA001', 'BACHEL 101: Introduction to Engineering in Chemical and Metallurgical Engineering', 3, 1, 'e95ba412-868a-4fa1-ad33-a731874d94dd'),
  ('CHEMMETA002', 'BACHEL 102: Core Concepts and Principles', 3, 1, 'e95ba412-868a-4fa1-ad33-a731874d94dd'),
  ('CHEMMETA003', 'BACHEL 203: Intermediate Studies', 3, 2, 'e95ba412-868a-4fa1-ad33-a731874d94dd'),
  ('CHEMMETA004', 'BACHEL 204: Applied Practice and Methods', 3, 2, 'e95ba412-868a-4fa1-ad33-a731874d94dd')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Chemical and Metallurgical Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CHEMMETA005', 'MASTER 205: Advanced Topics', 3, 2, '8f871bf4-7191-45c5-8024-04ff19768e57'),
  ('CHEMMETA006', 'MASTER 206: Capstone Project', 6, 2, '8f871bf4-7191-45c5-8024-04ff19768e57')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Electrical Techniques
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECTECH001', 'ELECTR 101: Electrical Theory', 3, 1, '3ee0c80d-4b74-4e87-afc1-55483fe2ce4c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Science in Information and Service Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOSERV001', 'MASTER 101: Organizational Theory', 3, 1, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334'),
  ('INFOSERV002', 'MASTER 102: Leadership Development', 3, 1, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334'),
  ('INFOSERV003', 'MASTER 203: Change Management', 3, 2, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334'),
  ('INFOSERV004', 'MASTER 204: Strategic Planning', 3, 2, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Early Childhood Education
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('EARLCHIL004', 'EARLY  204: Family and Community Partnerships', 3, 2, '526b7afe-375d-4b37-bd98-f4545bee84f3')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Civil Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CIVI001', 'MASTER 101: Structural Analysis', 3, 1, '04d07ff3-8b5b-4423-92bb-35ea0f21b132'),
  ('CIVI002', 'MASTER 102: Construction Materials', 3, 1, '04d07ff3-8b5b-4423-92bb-35ea0f21b132'),
  ('CIVI003', 'MASTER 203: Geotechnical Engineering', 3, 2, '04d07ff3-8b5b-4423-92bb-35ea0f21b132'),
  ('CIVI004', 'MASTER 204: Transportation Engineering', 3, 2, '04d07ff3-8b5b-4423-92bb-35ea0f21b132')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Entrepreneurship & Innovation
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCENTR001', 'MSC IN 101: New Venture Creation', 3, 1, '0a788bd6-ec83-4d79-a5b1-3f174d3393a8'),
  ('MSCENTR002', 'MSC IN 102: Lean Startup Methods', 3, 1, '0a788bd6-ec83-4d79-a5b1-3f174d3393a8'),
  ('MSCENTR003', 'MSC IN 203: Funding and Investment', 3, 2, '0a788bd6-ec83-4d79-a5b1-3f174d3393a8')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Sustainable Agriculture
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SUSTAGRI001', 'SUSTAI 101: Foundations of AI', 3, 1, '1de306e2-193d-4b8b-9776-e71fb0601dac'),
  ('SUSTAGRI002', 'SUSTAI 102: Machine Learning', 3, 1, '1de306e2-193d-4b8b-9776-e71fb0601dac'),
  ('SUSTAGRI003', 'SUSTAI 203: Neural Networks and Deep Learning', 3, 2, '1de306e2-193d-4b8b-9776-e71fb0601dac')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of International Business
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INTEBUSI002', 'BACHEL 102: Global Trade and Logistics', 3, 1, '48e55410-283c-40e1-b897-4d440ef27a19'),
  ('INTEBUSI003', 'BACHEL 203: International Finance', 3, 2, '48e55410-283c-40e1-b897-4d440ef27a19'),
  ('INTEBUSI004', 'BACHEL 204: Global Marketing', 3, 2, '48e55410-283c-40e1-b897-4d440ef27a19')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Architectural Technology
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARCH001', 'ARCHIT 101: Introduction to Architectural Technology', 3, 1, 'b3c9b66a-9636-4146-aa5f-ab895f13f29f')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Accounting and Payroll
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ACCOPAYR001', 'ACCOUN 101: Financial Accounting II', 3, 1, 'b221715a-51a0-4b44-9982-0d2f61979a99')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Cybersecurity
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CYBE003', 'CYBERS 203: Security Operations Center', 3, 2, 'a147d093-f8fa-4ef3-bde9-1877191d6837')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Mechanical Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHTECH001', 'MECHAN 101: Mechanical Blueprint Reading', 3, 1, 'c1d90542-f4aa-4209-9390-bcdd9bc66d2e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Applied Mathematics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('APPLMATH001', 'APPLIE 101: Advanced Calculus', 3, 1, '0626d283-8728-47d1-a1dc-75fcc72386f2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Pharmacy Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PHARTECH001', 'PHARMA 101: Pharmaceutical Chemistry', 3, 1, '6031e90a-b94a-4d41-9e33-f6732db5bbcb')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Hospitality Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('HOSP001', 'HOSPIT 101: Hotel Operations Management', 3, 1, 'a9bb6f76-d41d-4704-96b0-be7a5f930e84')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Culinary Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CULI003', 'CULINA 203: Nutrition and Menu Planning', 3, 2, '87712a8e-6385-4a5c-9726-12b1273b8d96')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Flight Services
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('FLIGSERV001', 'FLIGHT 101: Aviation Safety and Security', 3, 1, '76a1e786-56ae-4239-9c51-dc195bc0ec90')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Accounting Fundamentals
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ACCOFUND001', 'ACCOUN 101: Financial Accounting II', 3, 1, 'a38f1318-8b22-47c5-96c2-bbbf2a86d374'),
  ('ACCOFUND002', 'ACCOUN 102: Corporate Finance', 3, 1, 'a38f1318-8b22-47c5-96c2-bbbf2a86d374')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Data Science & Analytics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCDATA001', 'MSC IN 101: Data Mining and Warehousing', 3, 1, '29ae6600-245a-4e1b-afa8-127117f20969'),
  ('MSCDATA002', 'MSC IN 102: Statistical Learning', 3, 1, '29ae6600-245a-4e1b-afa8-127117f20969'),
  ('MSCDATA003', 'MSC IN 203: Big Data Technologies', 3, 2, '29ae6600-245a-4e1b-afa8-127117f20969'),
  ('MSCDATA004', 'MSC IN 204: Data Visualization', 3, 2, '29ae6600-245a-4e1b-afa8-127117f20969')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Business Administration
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSIADMI005', 'BUSINE 305: Leadership and Change Management', 3, 3, '5e6b379a-abfa-464b-b1cd-25773a08c2ed')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Electrical Engineering Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECTECH002', 'ELECTR 102: Digital Electronics', 3, 1, '68438abf-2a01-45da-acb7-ad8d2555db02')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Pharmacy Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PHARTECH002', 'PHARMA 102: Pharmacology for Technicians', 3, 1, '81236fc9-a2d7-4d8c-8160-750e9dca90c8')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Accounting
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ACCO001', 'ACCOUN 101: Financial Accounting II', 3, 1, '2895b13b-5bcd-4c70-aede-cbebdb67204c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Occupational Therapist Assistant
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('OCCUTHER001', 'OCCUPA 101: Human Anatomy and Function', 3, 1, 'bb527fba-5814-4af5-bb8b-6991e75c142d'),
  ('OCCUTHER002', 'OCCUPA 102: Occupational Performance', 3, 1, 'bb527fba-5814-4af5-bb8b-6991e75c142d'),
  ('OCCUTHER003', 'OCCUPA 203: Mental Health Concepts', 3, 2, 'bb527fba-5814-4af5-bb8b-6991e75c142d'),
  ('OCCUTHER004', 'OCCUPA 204: Rehabilitation Techniques', 3, 2, 'bb527fba-5814-4af5-bb8b-6991e75c142d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Computer Programming
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('COMPPROG001', 'COMPUT 101: Programming Fundamentals', 3, 1, 'bea3d482-82cb-4f92-864a-0b86678f4972'),
  ('COMPPROG002', 'COMPUT 102: Computer Hardware', 3, 1, 'bea3d482-82cb-4f92-864a-0b86678f4972'),
  ('COMPPROG003', 'COMPUT 203: Operating Systems Administration', 3, 2, 'bea3d482-82cb-4f92-864a-0b86678f4972')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Strategic Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCSTRA001', 'MSC IN 101: Organizational Theory', 3, 1, 'b7575c72-6bc8-44af-b640-b3034575e851'),
  ('MSCSTRA002', 'MSC IN 102: Leadership Development', 3, 1, 'b7575c72-6bc8-44af-b640-b3034575e851')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Software Development
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFTDEVE001', 'SOFTWA 101: Object-Oriented Programming', 3, 1, 'bcc464a3-6f1f-4d70-9c6a-889557f4075d'),
  ('SOFTDEVE002', 'SOFTWA 102: Database Design and SQL', 3, 1, 'bcc464a3-6f1f-4d70-9c6a-889557f4075d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Entrepreneurship & Innovation
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTENTR001', 'MASTER 101: New Venture Creation', 3, 1, 'c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33'),
  ('MASTENTR002', 'MASTER 102: Lean Startup Methods', 3, 1, 'c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33'),
  ('MASTENTR003', 'MASTER 203: Funding and Investment', 3, 2, 'c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33'),
  ('MASTENTR004', 'MASTER 204: Digital Business Models', 3, 2, 'c283d0e4-6f7g-4h3i-9j4e-4h9i0j1k2l33')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Automotive Service Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('AUTOSERV002', 'AUTOMO 102: Brake and Steering Systems', 3, 1, '9c6a8ceb-b8e8-4470-9bb6-ee79e77a2231')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Global Business & Leadership
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCGLOB001', 'MSC IN 101: Introduction to Business', 3, 1, 'e82ccc83-dc9b-4b90-a6e0-90689f49ad3a'),
  ('MSCGLOB002', 'MSC IN 102: Business Mathematics', 3, 1, 'e82ccc83-dc9b-4b90-a6e0-90689f49ad3a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Cybersecurity
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCCYBE001', 'MSC IN 101: Network Security Fundamentals', 3, 1, '337cecf9-4132-4a60-8cdb-ed316a316b30'),
  ('MSCCYBE002', 'MSC IN 102: Ethical Hacking', 3, 1, '337cecf9-4132-4a60-8cdb-ed316a316b30'),
  ('MSCCYBE003', 'MSC IN 203: Security Operations', 3, 2, '337cecf9-4132-4a60-8cdb-ed316a316b30'),
  ('MSCCYBE004', 'MSC IN 204: Incident Response', 3, 2, '337cecf9-4132-4a60-8cdb-ed316a316b30')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Information and Communications Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOCOMM001', 'MASTER 101: Introduction to Engineering in Information and Communications Engineering', 3, 1, 'ff92abca-873a-4709-a2fb-5c1203433f71'),
  ('INFOCOMM002', 'MASTER 102: Core Concepts and Principles', 3, 1, 'ff92abca-873a-4709-a2fb-5c1203433f71'),
  ('INFOCOMM003', 'MASTER 203: Intermediate Studies', 3, 2, 'ff92abca-873a-4709-a2fb-5c1203433f71')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Finance
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTFINA001', 'MASTER 101: Financial Accounting II', 3, 1, '9f5a7b1c-3d4e-4f9b-9c2d-1e6f7a8b9c00'),
  ('MASTFINA002', 'MASTER 102: Corporate Finance', 3, 1, '9f5a7b1c-3d4e-4f9b-9c2d-1e6f7a8b9c00'),
  ('MASTFINA003', 'MASTER 203: Management Accounting', 3, 2, '9f5a7b1c-3d4e-4f9b-9c2d-1e6f7a8b9c00'),
  ('MASTFINA004', 'MASTER 204: Auditing and Assurance', 3, 2, '9f5a7b1c-3d4e-4f9b-9c2d-1e6f7a8b9c00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Art and Media (MA)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARTMEDI001', 'MASTER 101: Digital Media Production', 3, 1, 'ce5a8ff0-c53c-4155-be7a-07d3e92a9e3d'),
  ('ARTMEDI002', 'MASTER 102: Cultural Studies and Critique', 3, 1, 'ce5a8ff0-c53c-4155-be7a-07d3e92a9e3d'),
  ('ARTMEDI003', 'MASTER 203: New Media Art Practices', 3, 2, 'ce5a8ff0-c53c-4155-be7a-07d3e92a9e3d'),
  ('ARTMEDI004', 'MASTER 204: Sound and Audio Design', 3, 2, 'ce5a8ff0-c53c-4155-be7a-07d3e92a9e3d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Mathematics and Systems Analysis
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTMATH001', 'MASTER 101: Introduction to Master''s in Mathematics and Systems Analysis', 3, 1, 'a56f72b0-a3ce-4857-9355-66b6d12e6a27'),
  ('MASTMATH002', 'MASTER 102: Core Concepts and Principles', 3, 1, 'a56f72b0-a3ce-4857-9355-66b6d12e6a27')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Human Resource Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('HUMARESO006', 'BACHEL 406: Management Consulting Project', 6, 4, '3cf65dd9-bc92-4b9f-aabf-383de5901327')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Art and Media (BA)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARTMEDI005', 'BACHEL 305: Interactive and Installation Art', 3, 3, '3f6633f5-6c7b-4bd8-afa1-6ff1d1eb7148'),
  ('ARTMEDI006', 'BACHEL 406: Media Arts Capstone Project', 6, 4, '3f6633f5-6c7b-4bd8-afa1-6ff1d1eb7148')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

COMMIT;
