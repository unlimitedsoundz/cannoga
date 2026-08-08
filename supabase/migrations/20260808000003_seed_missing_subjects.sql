-- Seed additional subjects for courses with fewer than 5 subjects
-- Generated from actual Canadian academic standards

BEGIN;

-- Graphic Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('GRAPDESI005', 'GRAPHI 305: Web and Digital Design', 3, 3, 'e920a449-64a1-4d0f-8e10-ca1ce49df8e4'),
  ('GRAPDESI006', 'GRAPHI 306: Client Projects and Freelance Practice', 3, 3, 'e920a449-64a1-4d0f-8e10-ca1ce49df8e4')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Science in Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MARK005', 'MASTER 305: Strategic Marketing', 3, 3, '10de7534-974b-44cc-b88b-8189cd3f302c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Environmental Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ENVI005', 'ENVIRO 305: Sustainable Resource Management', 3, 3, '151555ca-dad5-4e18-92e2-84e8d8181c3d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Artificial Intelligence and Data Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARTIINTE004', 'ARTIFI 204: Applied Practice and Methods', 3, 2, '0368a078-9729-445a-9304-5953292cb6bc')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Software Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCSOFT001', 'MSC IN 101: Software Development Lifecycle', 3, 1, '1c8e7234-9785-47aa-a838-b7db2cabae19'),
  ('MSCSOFT003', 'MSC IN 203: Software Testing and QA', 3, 2, '1c8e7234-9785-47aa-a838-b7db2cabae19'),
  ('MSCSOFT004', 'MSC IN 204: Web Application Development', 3, 2, '1c8e7234-9785-47aa-a838-b7db2cabae19')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Cloud Computing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CLOUCOMP002', 'CLOUD  102: Cloud Security', 3, 1, '1c7937fb-8f7f-4e5e-a3c3-ccc19ea2e54f')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Interactive Media Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INTEMEDI002', 'INTERA 102: Visual Communication Theory', 3, 1, '170bcd6a-0a17-4b39-86f0-9b4906a5d15b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MA in Sociology
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOCI001', 'MA IN 101: Introduction to MA in Sociology', 3, 1, 'def54bae-8f88-4774-a6a6-4f3f3b095882')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Information Technology
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFO002', 'BACHEL 102: Networking Essentials', 3, 1, 'cd3b3eb9-6fd2-435c-9cb2-61c803195f21')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Software Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFT001', 'BACHEL 101: Software Development Lifecycle', 3, 1, '24e9ab9d-d00c-4594-8825-0472992d3d0c'),
  ('SOFT003', 'BACHEL 203: Software Testing and QA', 3, 2, '24e9ab9d-d00c-4594-8825-0472992d3d0c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Mechanical Engineering Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHTECH002', 'MECHAN 102: Thermodynamics', 3, 1, '3fafc964-0ebe-46b6-8023-66086a474343'),
  ('MECHTECH003', 'MECHAN 203: Fluid Mechanics', 3, 2, '3fafc964-0ebe-46b6-8023-66086a474343')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Marketing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACHMARK005', 'BACHEL 305: Strategic Marketing', 3, 3, '4f9a1e2b-2c8b-4d7e-9f1a-6b2c3d4f5a66')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Human Resources Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('HUMARESO004', 'HUMAN  204: Strategic Planning', 3, 2, '4f202844-eafa-4b4a-9134-b7284642b873')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACH003', 'BACHEL 203: Change Management', 3, 2, '5e9a3f7d-8c2b-4e8f-b9a1-3d2e4c1a6b55'),
  ('BACH004', 'BACHEL 204: Strategic Planning', 3, 2, '5e9a3f7d-8c2b-4e8f-b9a1-3d2e4c1a6b55')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Computer Systems Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('COMPSYST001', 'COMPUT 101: Programming Fundamentals', 3, 1, '68f3659d-1084-4e50-8d89-30262ae49434'),
  ('COMPSYST002', 'COMPUT 102: Computer Hardware', 3, 1, '68f3659d-1084-4e50-8d89-30262ae49434')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Supply Chain Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SUPPCHAI002', 'SUPPLY 102: Leadership Development', 3, 1, '785132bb-7ded-4e7a-9b67-108018bd582c'),
  ('SUPPCHAI003', 'SUPPLY 203: Change Management', 3, 2, '785132bb-7ded-4e7a-9b67-108018bd582c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Project Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PROJ004', 'PROJEC 204: Strategic Planning', 3, 2, 'dd1c53df-0bd7-4ce0-afce-361ce8fc6b1b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Operations & Logistics Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('OPERLOGI004', 'BACHEL 204: Strategic Planning', 3, 2, '86e16012-9173-4c5c-bb66-8393e1ead703')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Civil Engineering Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CIVITECH001', 'CIVIL  101: Structural Analysis', 3, 1, '96c94bdf-a42a-4ed3-80b1-42c774e90715')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Construction Engineering Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CONSTECH001', 'CONSTR 101: Introduction to Construction Engineering Technician', 3, 1, '5f16bff0-c8d6-4cf3-88dc-c17c392d03f2')
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

-- Master of Engineering in Mechanical and Energy Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHENER002', 'MASTER 102: Thermodynamics', 3, 1, '494308a0-3733-4c52-bc91-24d1f4308ae1'),
  ('MECHENER005', 'MASTER 305: Manufacturing Processes', 3, 3, '494308a0-3733-4c52-bc91-24d1f4308ae1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Science in Computer Science
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('COMP005', 'BACHEL 305: Software Engineering', 3, 3, 'f4fa2bd2-2596-460f-a6f8-2eb04bd77b76')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Design
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTDESI001', 'MASTER 101: Design Research Methods', 3, 1, '0fd794fc-88a4-45aa-aa9d-e8b47921a23a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Broadcasting
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BROA001', 'BROADC 101: Broadcast Journalism', 3, 1, 'ce588e1c-8d52-4414-918c-8f4e7ba8d111'),
  ('BROA002', 'BROADC 102: Radio Production', 3, 1, 'ce588e1c-8d52-4414-918c-8f4e7ba8d111')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Welding Techniques
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('WELDTECH001', 'WELDIN 101: Welding Safety and Blueprint Reading', 3, 1, 'ccaf1620-3c3a-4a9c-82ef-03cc26ba5110'),
  ('WELDTECH002', 'WELDIN 102: Shielded Metal Arc Welding', 3, 1, 'ccaf1620-3c3a-4a9c-82ef-03cc26ba5110'),
  ('WELDTECH003', 'WELDIN 203: Gas Metal Arc Welding', 3, 2, 'ccaf1620-3c3a-4a9c-82ef-03cc26ba5110')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Software Testing
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFTTEST001', 'SOFTWA 101: Testing Fundamentals', 3, 1, 'd65df282-a25c-4dc7-826a-a8ba007cf56e'),
  ('SOFTTEST004', 'SOFTWA 204: Performance Testing', 3, 2, 'd65df282-a25c-4dc7-826a-a8ba007cf56e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor's in Applied Physics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BACHAPPL004', 'BACHEL 204: Thermodynamics', 3, 2, 'cf82b5e1-82e1-4c91-b0e1-fba61408702b')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Engineering in Industrial Engineering and Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INDU001', 'BACHEL 101: Work Measurement and Methods', 3, 1, '43fa12ae-50e9-4671-8fac-6b3953d16af2'),
  ('INDU005', 'BACHEL 305: Lean Manufacturing', 3, 3, '43fa12ae-50e9-4671-8fac-6b3953d16af2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Mechanical Foundations
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MECHFOUN002', 'MECHAN 102: Machining and Fabrication', 3, 1, 'f52416bf-2fc5-401c-a87e-c0649fe5d060'),
  ('MECHFOUN003', 'MECHAN 203: Hydraulics and Pneumatics', 3, 2, 'f52416bf-2fc5-401c-a87e-c0649fe5d060')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Event Planning
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('EVENPLAN002', 'EVENT  102: Destination Marketing', 3, 1, 'e9ab889b-7940-410a-a8ec-79893b9fd242')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- BSc Accounting & Finance
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BSCACCO002', 'BSC AC 102: Corporate Finance', 3, 1, 'e15ef57b-2f95-42a6-b766-aeef883af9d2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Bachelor of Information Systems
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOSYST005', 'BACHEL 305: IT Project Management', 3, 3, '44aa0886-019f-475a-b616-9511729d1386')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Web Development
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('WEBDEVE001', 'WEB DE 101: HTML and CSS Foundations', 3, 1, 'acca3dd3-bc8f-4635-9191-49bb25b8d4e1'),
  ('WEBDEVE002', 'WEB DE 102: JavaScript Programming', 3, 1, 'acca3dd3-bc8f-4635-9191-49bb25b8d4e1')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Electronics and Nanoengineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECNANO002', 'MASTER 102: Analog Circuit Design', 3, 1, 'd6cee1e6-6abf-4825-8b7b-68975c563f77')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Architecture (M.Arch)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARCHM.AR001', 'MASTER 101: Architectural History and Theory', 3, 1, 'e78c421f-8e56-49f8-9e8d-555f4c7b78a7'),
  ('ARCHM.AR002', 'MASTER 102: Building Construction Methods', 3, 1, 'e78c421f-8e56-49f8-9e8d-555f4c7b78a7')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Management & Strategy
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTSTRA004', 'MASTER 204: Strategic Planning', 3, 2, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11'),
  ('MASTSTRA005', 'MASTER 305: International Business', 3, 3, 'a061b8c2-4d5e-4f1a-9b3c-2f7a8b9c1d11')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Electrical Techniques
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ELECTECH003', 'ELECTR 203: Motor Controls', 3, 2, '3ee0c80d-4b74-4e87-afc1-55483fe2ce4c')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Science in Information and Service Management
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOSERV004', 'MASTER 204: Strategic Planning', 3, 2, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334'),
  ('INFOSERV005', 'MASTER 305: International Business', 3, 3, 'ed80c1ca-7994-43bd-8e7a-e93623cdc334')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Civil Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CIVI001', 'MASTER 101: Structural Analysis', 3, 1, '04d07ff3-8b5b-4423-92bb-35ea0f21b132'),
  ('CIVI004', 'MASTER 204: Transportation Engineering', 3, 2, '04d07ff3-8b5b-4423-92bb-35ea0f21b132')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Sustainable Agriculture
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SUSTAGRI004', 'SUSTAI 204: Natural Language Processing', 3, 2, '1de306e2-193d-4b8b-9776-e71fb0601dac')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Accounting and Payroll
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ACCOPAYR002', 'ACCOUN 102: Corporate Finance', 3, 1, 'b221715a-51a0-4b44-9982-0d2f61979a99')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Software Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFT004', 'SOFTWA 204: Applied Practice and Methods', 3, 2, '257f32f9-9ad8-4db5-83a9-e0d2558cb56a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Cybersecurity
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('CYBE004', 'CYBERS 204: Digital Forensics', 3, 2, 'a147d093-f8fa-4ef3-bde9-1877191d6837')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Applied Mathematics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('APPLMATH002', 'APPLIE 102: Linear Algebra', 3, 1, '0626d283-8728-47d1-a1dc-75fcc72386f2')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Data Science & Analytics
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCDATA002', 'MSC IN 102: Statistical Learning', 3, 1, '29ae6600-245a-4e1b-afa8-127117f20969')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Business Administration
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('BUSIADMI006', 'BUSINE 406: Business Capstone Project', 6, 4, '5e6b379a-abfa-464b-b1cd-25773a08c2ed')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Software Development
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('SOFTDEVE003', 'SOFTWA 203: Web Development', 3, 2, 'bcc464a3-6f1f-4d70-9c6a-889557f4075d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Environmental Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ENVITECH001', 'ENVIRO 101: Environmental Chemistry', 3, 1, 'd8045f38-f48f-4299-936a-f4f4ef61ab1e')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Automotive Service Technician
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('AUTOSERV003', 'AUTOMO 203: Electrical and Electronic Systems', 3, 2, '9c6a8ceb-b8e8-4470-9bb6-ee79e77a2231'),
  ('AUTOSERV004', 'AUTOMO 204: Heating and Air Conditioning', 3, 2, '9c6a8ceb-b8e8-4470-9bb6-ee79e77a2231')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- MSc in Global Business & Leadership
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MSCGLOB003', 'MSC IN 203: Business Communication', 3, 2, 'e82ccc83-dc9b-4b90-a6e0-90689f49ad3a')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Financial Services
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('FINASERV001', 'FINANC 101: Introduction to Financial Services', 3, 1, 'cc8f9664-0193-4f46-a869-7e8dbb2bc51f')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Physiotherapist Assistant
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('PHYSASSI001', 'PHYSIO 101: Musculoskeletal Anatomy', 3, 1, 'd971ea18-0c64-4ca6-84c7-d655219e2400')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Engineering in Information and Communications Engineering
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('INFOCOMM004', 'MASTER 204: Applied Practice and Methods', 3, 2, 'ff92abca-873a-4709-a2fb-5c1203433f71')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master of Art and Media (MA)
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('ARTMEDI004', 'MASTER 204: Sound and Audio Design', 3, 2, 'ce5a8ff0-c53c-4155-be7a-07d3e92a9e3d')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

-- Master's in Mathematics and Systems Analysis
INSERT INTO "Subject" (id, name, "creditUnits", semester, "courseId") VALUES
  ('MASTMATH003', 'MASTER 203: Intermediate Studies', 3, 2, 'a56f72b0-a3ce-4857-9355-66b6d12e6a27')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "creditUnits" = EXCLUDED."creditUnits",
  semester = EXCLUDED.semester,
  "courseId" = EXCLUDED."courseId";

COMMIT;
