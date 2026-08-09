import fs from 'fs';

const input = `INSERT INTO rooms (
  id,
  name,
  building,
  floor,
  room_number,
  capacity,
  room_type,
  campus,
  accessibility,
  equipment,
  status,
  notes
) VALUES

-- ============================================================
-- SCHOOL OF BUSINESS — 20 ROOMS
-- ============================================================

('BUS-001','Maple Commerce Hall','Business & Commerce Building',1,'BC-101',180,'Lecture Hall','Capital Campus',true,'4K projector; dual displays; lecture capture; podium PC; microphones','Active','Large business and commerce lectures'),
('BUS-002','Cedar Business Theatre','Business & Commerce Building',1,'BC-115',140,'Lecture Theatre','Capital Campus',true,'4K projector; interactive display; lecture capture; microphones','Active','Large business courses'),
('BUS-003','Riverside Lecture Hall','Business & Commerce Building',2,'BC-201',120,'Lecture Hall','Capital Campus',true,'4K projector; podium PC; lecture capture; wireless presentation','Active','Business administration lectures'),
('BUS-004','Capital Commerce Hall','Business & Commerce Building',2,'BC-215',100,'Lecture Hall','Capital Campus',true,'Interactive display; projector; podium PC; microphones','Active','Commerce and management courses'),
('BUS-005','Kingston Business Classroom','Business & Commerce Building',1,'BC-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','General business instruction'),
('BUS-006','Lakeside Business Classroom','Business & Commerce Building',1,'BC-130',60,'Classroom','Capital Campus',true,'Interactive display; projector; wireless presentation','Active','Management and administration'),
('BUS-007','Enterprise Analytics Lab','Business & Commerce Building',2,'BC-225',50,'Computer Lab','Capital Campus',true,'Workstations; analytics software; dual displays; projector','Active','Business analytics and data courses'),
('BUS-008','Finance Simulation Lab','Business & Commerce Building',2,'BC-230',45,'Simulation Lab','Capital Campus',true,'Financial modelling software; workstations; market simulation software','Active','Finance and investment simulations'),
('BUS-009','Accounting Lab','Business & Commerce Building',2,'BC-235',45,'Computer Lab','Capital Campus',true,'Accounting software; workstations; projector; instructor PC','Active','Accounting instruction'),
('BUS-010','Entrepreneurship Studio','Business & Commerce Building',3,'BC-305',40,'Studio','Capital Campus',true,'Interactive display; collaboration tables; wireless presentation','Active','Entrepreneurship and innovation'),
('BUS-011','Marketing Studio','Business & Commerce Building',3,'BC-310',40,'Studio','Capital Campus',true,'Interactive display; presentation equipment; workstations','Active','Marketing and communications'),
('BUS-012','Human Resources Classroom','Business & Commerce Building',3,'BC-315',55,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Human resources courses'),
('BUS-013','Economics Classroom','Business & Commerce Building',3,'BC-320',65,'Classroom','Capital Campus',true,'Projector; interactive display; lecture capture','Active','Economics courses'),
('BUS-014','Business Research Room','Business & Commerce Building',3,'BC-325',25,'Research Room','Capital Campus',true,'Research workstations; display; video conferencing','Active','Faculty and student research'),
('BUS-015','Executive Seminar Room','Business & Commerce Building',2,'BC-240',30,'Seminar Room','Capital Campus',true,'Video conferencing; interactive display; microphones','Active','Advanced seminars'),
('BUS-016','Business Collaboration Room','Business & Commerce Building',2,'BC-245',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation','Active','Group projects'),
('BUS-017','Supply Chain Classroom','Business & Commerce Building',1,'BC-140',60,'Classroom','Capital Campus',true,'Interactive display; logistics software; projector','Active','Supply chain and operations'),
('BUS-018','Project Management Lab','Business & Commerce Building',2,'BC-250',40,'Computer Lab','Capital Campus',true,'Project management software; workstations; display','Active','Project management'),
('BUS-019','Business Case Room','Business & Commerce Building',3,'BC-335',35,'Case Study Room','Capital Campus',true,'Interactive display; conference tables; wireless presentation','Active','Business case analysis'),
('BUS-020','Leadership Seminar Room','Business & Commerce Building',3,'BC-340',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Leadership and organizational studies'),


-- ============================================================
-- SCHOOL OF ARTS, DESIGN & MEDIA — 20 ROOMS
-- ============================================================

('ART-001','Grand Arts Lecture Hall','Arts, Design & Media Building',1,'AD-101',160,'Lecture Hall','Capital Campus',true,'4K projector; lecture capture; podium PC; microphones','Active','Arts and design lectures'),
('ART-002','Creative Arts Theatre','Arts, Design & Media Building',1,'AD-115',120,'Lecture Theatre','Capital Campus',true,'Projector; stage lighting; lecture capture; microphones','Active','Arts and media presentations'),
('ART-003','Design Classroom','Arts, Design & Media Building',1,'AD-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Design theory'),
('ART-004','Visual Arts Classroom','Arts, Design & Media Building',1,'AD-130',60,'Classroom','Capital Campus',true,'Projector; display; movable tables','Active','Visual arts instruction'),
('ART-005','Graphic Design Studio','Arts, Design & Media Building',2,'AD-201',45,'Design Studio','Capital Campus',true,'Design workstations; Adobe Creative Cloud; dual displays; projector','Active','Graphic design'),
('ART-006','Digital Media Studio','Arts, Design & Media Building',2,'AD-210',40,'Media Studio','Capital Campus',true,'Editing workstations; cameras; microphones; display','Active','Digital media production'),
('ART-007','Photography Studio','Arts, Design & Media Building',2,'AD-220',30,'Photography Studio','Capital Campus',true,'Lighting systems; photography equipment; backdrop system','Active','Photography courses'),
('ART-008','Film Production Studio','Arts, Design & Media Building',2,'AD-230',35,'Film Studio','Capital Campus',true,'Cameras; lighting; audio equipment; editing workstation','Active','Film production'),
('ART-009','Animation Lab','Arts, Design & Media Building',3,'AD-301',40,'Computer Lab','Capital Campus',true,'Animation workstations; graphics tablets; 3D software','Active','Animation and motion graphics'),
('ART-010','Illustration Studio','Arts, Design & Media Building',3,'AD-310',35,'Studio','Capital Campus',true,'Drawing tables; graphics tablets; display','Active','Illustration'),
('ART-011','Fine Arts Studio','Arts, Design & Media Building',1,'AD-140',30,'Art Studio','Capital Campus',true,'Easels; work tables; storage; sinks','Active','Fine arts'),
('ART-012','Sculpture Studio','Arts, Design & Media Building',1,'AD-150',25,'Art Studio','Capital Campus',true,'Work benches; sculpting equipment; ventilation','Active','Sculpture and three-dimensional art'),
('ART-013','Printmaking Studio','Arts, Design & Media Building',1,'AD-160',25,'Specialized Studio','Capital Campus',true,'Print presses; work tables; drying racks','Active','Printmaking'),
('ART-014','Sound Production Lab','Arts, Design & Media Building',2,'AD-240',25,'Audio Lab','Capital Campus',true,'Audio workstations; microphones; mixing consoles; studio monitors','Active','Audio production'),
('ART-015','Media Research Room','Arts, Design & Media Building',3,'AD-320',25,'Research Room','Capital Campus',true,'Workstations; display; video conferencing','Active','Media research'),
('ART-016','Creative Collaboration Room','Arts, Design & Media Building',3,'AD-325',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation','Active','Collaborative creative projects'),
('ART-017','Typography Lab','Arts, Design & Media Building',2,'AD-250',30,'Design Lab','Capital Campus',true,'Design workstations; typography software; projector','Active','Typography and publication design'),
('ART-018','Interactive Design Lab','Arts, Design & Media Building',3,'AD-330',35,'Computer Lab','Capital Campus',true,'Design workstations; prototyping software; interactive displays','Active','UX and interactive design'),
('ART-019','Media Seminar Room','Arts, Design & Media Building',3,'AD-335',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Media seminars'),
('ART-020','Exhibition Workshop','Arts, Design & Media Building',1,'AD-170',30,'Workshop','Capital Campus',true,'Display panels; work tables; presentation equipment','Active','Exhibition preparation'),


-- ============================================================
-- SCHOOL OF TECHNOLOGY — 20 ROOMS
-- ============================================================

('TEC-001','Technology Lecture Hall','Technology & Engineering Building',1,'TE-101',200,'Lecture Hall','Capital Campus',true,'4K projector; dual displays; lecture capture; microphones','Active','Large technology lectures'),
('TEC-002','Engineering Lecture Theatre','Technology & Engineering Building',1,'TE-115',150,'Lecture Theatre','Capital Campus',true,'4K projector; lecture capture; podium PC','Active','Engineering lectures'),
('TEC-003','Software Engineering Classroom','Technology & Engineering Building',1,'TE-125',80,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Software engineering'),
('TEC-004','Computing Classroom','Technology & Engineering Building',1,'TE-130',70,'Computer Classroom','Capital Campus',true,'Desktop workstations; projector; interactive display','Active','Computing courses'),
('TEC-005','Programming Lab','Technology & Engineering Building',2,'TE-201',60,'Computer Lab','Capital Campus',true,'Developer workstations; IDEs; dual displays; projector','Active','Programming courses'),
('TEC-006','Networking Lab','Technology & Engineering Building',2,'TE-210',50,'Computer Lab','Capital Campus',true,'Networking racks; routers; switches; workstations','Active','Networking and infrastructure'),
('TEC-007','Cybersecurity Lab','Technology & Engineering Building',2,'TE-220',45,'Cybersecurity Lab','Capital Campus',true,'Security workstations; network simulation; monitoring systems','Active','Cybersecurity'),
('TEC-008','Database Lab','Technology & Engineering Building',2,'TE-230',50,'Computer Lab','Capital Campus',true,'Database servers; workstations; development software','Active','Database systems'),
('TEC-009','AI & Machine Learning Lab','Technology & Engineering Building',3,'TE-301',45,'Computer Lab','Capital Campus',true,'GPU workstations; ML software; interactive display','Active','Artificial intelligence and machine learning'),
('TEC-010','Robotics Lab','Technology & Engineering Building',1,'TE-140',40,'Robotics Lab','Capital Campus',true,'Robotics kits; workstations; sensors; development equipment','Active','Robotics'),
('TEC-011','Electronics Lab','Technology & Engineering Building',1,'TE-150',40,'Electronics Lab','Capital Campus',true,'Oscilloscopes; power supplies; electronics benches; soldering stations','Active','Electronics'),
('TEC-012','Embedded Systems Lab','Technology & Engineering Building',2,'TE-240',35,'Specialized Lab','Capital Campus',true,'Microcontrollers; development boards; oscilloscopes; workstations','Active','Embedded systems'),
('TEC-013','Cloud Computing Lab','Technology & Engineering Building',3,'TE-310',45,'Computer Lab','Capital Campus',true,'Cloud development workstations; virtualization software; projector','Active','Cloud computing'),
('TEC-014','Web Development Lab','Technology & Engineering Building',3,'TE-320',50,'Computer Lab','Capital Campus',true,'Developer workstations; browsers; IDEs; interactive display','Active','Web development'),
('TEC-015','Technology Research Room','Technology & Engineering Building',3,'TE-330',25,'Research Room','Capital Campus',true,'Research workstations; display; video conferencing','Active','Technology research'),
('TEC-016','Engineering Design Studio','Technology & Engineering Building',2,'TE-250',40,'Design Studio','Capital Campus',true,'CAD workstations; 3D modelling software; projector','Active','Engineering design'),
('TEC-017','Innovation Lab','Technology & Engineering Building',3,'TE-340',35,'Innovation Lab','Capital Campus',true,'Prototyping tools; development boards; interactive display','Active','Technology innovation'),
('TEC-018','Systems Administration Lab','Technology & Engineering Building',2,'TE-260',40,'Computer Lab','Capital Campus',true,'Server racks; virtualization systems; workstations','Active','Systems administration'),
('TEC-019','Technology Seminar Room','Technology & Engineering Building',3,'TE-350',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Technology seminars'),
('TEC-020','Technology Collaboration Room','Technology & Engineering Building',2,'TE-270',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation','Active','Team projects'),


-- ============================================================
-- SCHOOL OF SCIENCE — 20 ROOMS
-- ============================================================

('SCI-001','Science Grand Lecture Hall','Science & Innovation Building',1,'SI-101',200,'Lecture Hall','Capital Campus',true,'4K projector; dual displays; lecture capture; microphones','Active','Large science lectures'),
('SCI-002','Natural Sciences Theatre','Science & Innovation Building',1,'SI-115',150,'Lecture Theatre','Capital Campus',true,'4K projector; lecture capture; podium PC','Active','Natural sciences'),
('SCI-003','Biology Classroom','Science & Innovation Building',1,'SI-125',80,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Biology lectures'),
('SCI-004','Chemistry Classroom','Science & Innovation Building',1,'SI-130',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Chemistry theory'),
('SCI-005','General Biology Lab','Science & Innovation Building',2,'SI-201',40,'Science Laboratory','Capital Campus',true,'Laboratory benches; microscopes; sinks; safety equipment','Active','Biology practicals'),
('SCI-006','Chemistry Lab','Science & Innovation Building',2,'SI-210',40,'Chemistry Laboratory','Capital Campus',true,'Fume hoods; lab benches; chemical storage; safety equipment','Active','Chemistry practicals'),
('SCI-007','Physics Lab','Science & Innovation Building',2,'SI-220',40,'Physics Laboratory','Capital Campus',true,'Physics equipment; oscilloscopes; experiment stations','Active','Physics practicals'),
('SCI-008','Microbiology Lab','Science & Innovation Building',2,'SI-230',35,'Microbiology Laboratory','Capital Campus',true,'Microscopes; incubators; sterile workstations; safety equipment','Active','Microbiology'),
('SCI-009','Biochemistry Lab','Science & Innovation Building',3,'SI-301',35,'Biochemistry Laboratory','Capital Campus',true,'Laboratory benches; centrifuges; spectrophotometer; safety equipment','Active','Biochemistry'),
('SCI-010','Environmental Science Lab','Science & Innovation Building',3,'SI-310',35,'Science Laboratory','Capital Campus',true,'Sampling equipment; workstations; analysis equipment','Active','Environmental science'),
('SCI-011','Earth Science Lab','Science & Innovation Building',3,'SI-320',35,'Science Laboratory','Capital Campus',true,'Geology specimens; microscopes; analysis equipment','Active','Earth science'),
('SCI-012','Data Science Lab','Science & Innovation Building',3,'SI-330',45,'Computer Lab','Capital Campus',true,'Data science workstations; statistical software; projector','Active','Data science'),
('SCI-013','Mathematics Classroom','Science & Innovation Building',1,'SI-140',80,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Mathematics'),
('SCI-014','Statistics Classroom','Science & Innovation Building',1,'SI-150',65,'Classroom','Capital Campus',true,'Interactive display; statistical software; projector','Active','Statistics'),
('SCI-015','Science Research Room','Science & Innovation Building',3,'SI-340',25,'Research Room','Capital Campus',true,'Research workstations; display; video conferencing','Active','Science research'),
('SCI-016','Science Seminar Room','Science & Innovation Building',3,'SI-350',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Science seminars'),
('SCI-017','Scientific Computing Lab','Science & Innovation Building',2,'SI-240',40,'Computer Lab','Capital Campus',true,'Scientific computing workstations; modelling software; projector','Active','Scientific computing'),
('SCI-018','Research Collaboration Room','Science & Innovation Building',3,'SI-360',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation','Active','Research collaboration'),
('SCI-019','Applied Science Classroom','Science & Innovation Building',2,'SI-250',60,'Classroom','Capital Campus',true,'Interactive display; projector; lecture capture','Active','Applied sciences'),
('SCI-020','Science Preparation Room','Science & Innovation Building',1,'SI-160',20,'Preparation Room','Capital Campus',true,'Laboratory preparation equipment; storage; sinks','Active','Laboratory preparation'),


-- ============================================================
-- SCHOOL OF HEALTH SCIENCES — 20 ROOMS
-- ============================================================

('HLT-001','Health Sciences Lecture Hall','Health Sciences Building',1,'HS-101',180,'Lecture Hall','Capital Campus',true,'4K projector; lecture capture; podium PC; microphones','Active','Large health sciences lectures'),
('HLT-002','Clinical Sciences Theatre','Health Sciences Building',1,'HS-115',140,'Lecture Theatre','Capital Campus',true,'4K projector; interactive display; lecture capture','Active','Clinical science lectures'),
('HLT-003','Nursing Classroom','Health Sciences Building',1,'HS-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Nursing theory'),
('HLT-004','Health Studies Classroom','Health Sciences Building',1,'HS-130',65,'Classroom','Capital Campus',true,'Interactive display; projector; lecture capture','Active','Health studies'),
('HLT-005','Nursing Skills Lab','Health Sciences Building',2,'HS-201',35,'Clinical Skills Lab','Capital Campus',true,'Hospital beds; mannequins; clinical equipment; sinks; simulation equipment','Active','Nursing practical training'),
('HLT-006','Patient Care Simulation Lab','Health Sciences Building',2,'HS-210',30,'Simulation Lab','Capital Campus',true,'Patient simulators; hospital beds; monitoring equipment; recording system','Active','Clinical simulation'),
('HLT-007','Anatomy & Physiology Lab','Health Sciences Building',2,'HS-220',40,'Science Laboratory','Capital Campus',true,'Anatomical models; microscopes; interactive display','Active','Anatomy and physiology'),
('HLT-008','Pharmacology Lab','Health Sciences Building',2,'HS-230',35,'Clinical Laboratory','Capital Campus',true,'Medication training equipment; simulation systems; display','Active','Pharmacology training'),
('HLT-009','Medical Laboratory','Health Sciences Building',3,'HS-301',35,'Medical Laboratory','Capital Campus',true,'Microscopes; centrifuges; laboratory benches; safety equipment','Active','Medical laboratory science'),
('HLT-010','Dental Hygiene Lab','Health Sciences Building',1,'HS-140',25,'Clinical Laboratory','Capital Campus',true,'Dental training units; dental instruments; simulation equipment','Active','Dental hygiene practicals'),
('HLT-011','Diagnostic Imaging Lab','Health Sciences Building',2,'HS-240',25,'Simulation Lab','Capital Campus',true,'Imaging simulation equipment; display; training workstations','Active','Diagnostic imaging training'),
('HLT-012','Physiotherapy Lab','Health Sciences Building',1,'HS-150',30,'Clinical Skills Lab','Capital Campus',true,'Treatment tables; rehabilitation equipment; mobility equipment','Active','Physiotherapy practicals'),
('HLT-013','Health Assessment Lab','Health Sciences Building',2,'HS-250',35,'Clinical Skills Lab','Capital Campus',true,'Assessment equipment; examination beds; clinical simulation equipment','Active','Health assessment'),
('HLT-014','Public Health Classroom','Health Sciences Building',3,'HS-310',60,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Public health'),
('HLT-015','Health Research Room','Health Sciences Building',3,'HS-320',25,'Research Room','Capital Campus',true,'Research workstations; statistical software; display','Active','Health research'),
('HLT-016','Clinical Seminar Room','Health Sciences Building',3,'HS-330',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Clinical seminars'),
('HLT-017','Healthcare Technology Lab','Health Sciences Building',3,'HS-340',35,'Computer Lab','Capital Campus',true,'Healthcare software; workstations; simulation systems','Active','Digital health and health technology'),
('HLT-018','Interprofessional Practice Room','Health Sciences Building',2,'HS-260',30,'Simulation Room','Capital Campus',true,'Clinical simulation equipment; interactive display; recording system','Active','Interprofessional healthcare training'),
('HLT-019','Health Collaboration Room','Health Sciences Building',3,'HS-350',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation; video conferencing','Active','Health team projects'),
('HLT-020','Clinical Preparation Room','Health Sciences Building',1,'HS-160',20,'Preparation Room','Capital Campus',true,'Clinical equipment storage; preparation benches; sinks','Active','Clinical laboratory preparation'),


-- ============================================================
-- SCHOOL OF TRANSPORT — 20 ROOMS
-- ============================================================

('TRN-001','Pineview Lecture Hall','Transportation & Mobility Building',1,'TM-101',180,'Lecture Hall','Capital Campus',true,'4K projector; dual displays; lecture capture; podium PC; microphones','Active','Large transportation lectures'),
('TRN-002','Northfield Lecture Hall','Transportation & Mobility Building',1,'TM-115',140,'Lecture Hall','Capital Campus',true,'4K projector; interactive display; lecture capture; microphones','Active','Transportation and logistics'),
('TRN-003','Westbridge Lecture Theatre','Transportation & Mobility Building',2,'TM-201',120,'Lecture Theatre','Capital Campus',true,'4K projector; lecture capture; podium PC; wireless presentation','Active','Transportation management'),
('TRN-004','Clearwater Lecture Hall','Transportation & Mobility Building',2,'TM-215',100,'Lecture Hall','Capital Campus',true,'Interactive display; 4K projector; lecture capture','Active','Supply chain and mobility'),
('TRN-005','Evergreen Transport Classroom','Transportation & Mobility Building',1,'TM-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Transport operations'),
('TRN-006','Mobility Systems Lab','Transportation & Mobility Building',2,'TM-225',50,'Computer Lab','Capital Campus',true,'Workstations; GIS software; transport simulation software; projector','Active','Transportation planning and modelling'),
('TRN-007','Fleet Operations Lab','Transportation & Mobility Building',1,'TM-135',40,'Specialized Laboratory','Capital Campus',true,'Fleet management software; vehicle diagnostics training equipment','Active','Fleet management'),
('TRN-008','Supply Chain Simulation Lab','Transportation & Mobility Building',2,'TM-235',45,'Simulation Lab','Capital Campus',true,'Supply-chain simulation software; workstations; interactive display','Active','Logistics simulation'),
('TRN-009','Transportation Planning Studio','Transportation & Mobility Building',2,'TM-245',35,'Studio','Capital Campus',true,'GIS workstations; mapping displays; planning software','Active','Transportation planning'),
('TRN-010','Mobility Research Seminar Room','Transportation & Mobility Building',3,'TM-305',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Transportation research'),
('TRN-011','Transit Systems Classroom','Transportation & Mobility Building',3,'TM-310',65,'Classroom','Capital Campus',true,'Interactive display; 4K projector; lecture capture','Active','Public transit systems'),
('TRN-012','Freight & Logistics Classroom','Transportation & Mobility Building',3,'TM-320',75,'Classroom','Capital Campus',true,'Interactive display; logistics software; projector','Active','Freight and logistics'),
('TRN-013','Aviation Operations Classroom','Transportation & Mobility Building',2,'TM-230',60,'Specialized Classroom','Capital Campus',true,'Aviation operations software; interactive display; projector','Active','Aviation operations'),
('TRN-014','Transport Safety Training Room','Transportation & Mobility Building',1,'TM-145',50,'Training Room','Capital Campus',true,'Safety training equipment; interactive display; video system','Active','Transportation safety'),
('TRN-015','Roadway Design Studio','Transportation & Mobility Building',3,'TM-330',40,'Design Studio','Capital Campus',true,'CAD workstations; GIS software; large-format display','Active','Roadway design'),
('TRN-016','Transport Data Analytics Lab','Transportation & Mobility Building',3,'TM-340',45,'Computer Lab','Capital Campus',true,'Data analytics software; GIS; statistical software; workstations','Active','Transportation data analysis'),
('TRN-017','Warehouse & Distribution Lab','Transportation & Mobility Building',1,'TM-155',55,'Practical Laboratory','Capital Campus',true,'Warehouse management software; inventory systems; barcode equipment','Active','Warehousing and distribution'),
('TRN-018','Smart Mobility Innovation Lab','Transportation & Mobility Building',2,'TM-250',40,'Innovation Lab','Capital Campus',true,'IoT devices; mobility simulation software; development workstations','Active','Smart mobility'),
('TRN-019','Transportation Research Room','Transportation & Mobility Building',3,'TM-350',24,'Research Room','Capital Campus',true,'Workstations; research software; interactive display','Active','Transportation research'),
('TRN-020','Mobility Collaboration Room','Transportation & Mobility Building',2,'TM-260',20,'Collaboration Room','Capital Campus',true,'Interactive display; video conferencing; wireless presentation','Active','Transportation group projects'),


-- ============================================================
-- SCHOOL OF HOSPITALITY & TOURISM — 20 ROOMS
-- ============================================================

('HOS-001','Hospitality Lecture Hall','Hospitality & Tourism Building',1,'HT-101',160,'Lecture Hall','Capital Campus',true,'4K projector; lecture capture; podium PC; microphones','Active','Hospitality lectures'),
('HOS-002','Tourism Lecture Theatre','Hospitality & Tourism Building',1,'HT-115',120,'Lecture Theatre','Capital Campus',true,'4K projector; interactive display; lecture capture','Active','Tourism studies'),
('HOS-003','Hospitality Classroom','Hospitality & Tourism Building',1,'HT-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Hospitality management'),
('HOS-004','Tourism Studies Classroom','Hospitality & Tourism Building',1,'HT-130',65,'Classroom','Capital Campus',true,'Interactive display; projector; lecture capture','Active','Tourism studies'),
('HOS-005','Culinary Training Kitchen','Hospitality & Tourism Building',2,'HT-201',30,'Training Kitchen','Capital Campus',true,'Commercial ovens; ranges; preparation stations; refrigerators; sinks','Active','Culinary practical training'),
('HOS-006','Advanced Culinary Kitchen','Hospitality & Tourism Building',2,'HT-210',24,'Training Kitchen','Capital Campus',true,'Commercial cooking equipment; preparation stations; refrigeration','Active','Advanced culinary training'),
('HOS-007','Baking & Pastry Lab','Hospitality & Tourism Building',2,'HT-220',24,'Food Laboratory','Capital Campus',true,'Commercial ovens; mixers; preparation benches; refrigeration','Active','Baking and pastry'),
('HOS-008','Food Science Lab','Hospitality & Tourism Building',2,'HT-230',25,'Food Laboratory','Capital Campus',true,'Food testing equipment; laboratory benches; refrigeration','Active','Food science'),
('HOS-009','Restaurant Operations Lab','Hospitality & Tourism Building',1,'HT-140',35,'Practical Laboratory','Capital Campus',true,'Restaurant tables; POS systems; service stations; kitchen equipment','Active','Restaurant operations'),
('HOS-010','Hotel Operations Lab','Hospitality & Tourism Building',1,'HT-150',30,'Simulation Lab','Capital Campus',true,'Hotel front desk; reservation software; housekeeping simulation equipment','Active','Hotel operations'),
('HOS-011','Event Management Studio','Hospitality & Tourism Building',3,'HT-301',40,'Studio','Capital Campus',true,'Event planning software; presentation system; movable tables','Active','Event management'),
('HOS-012','Tourism Technology Lab','Hospitality & Tourism Building',3,'HT-310',40,'Computer Lab','Capital Campus',true,'Tourism software; booking systems; workstations; projector','Active','Tourism technology'),
('HOS-013','Travel Operations Lab','Hospitality & Tourism Building',3,'HT-320',35,'Computer Lab','Capital Campus',true,'Reservation systems; travel software; workstations','Active','Travel operations'),
('HOS-014','Hospitality Research Room','Hospitality & Tourism Building',3,'HT-330',25,'Research Room','Capital Campus',true,'Research workstations; display; video conferencing','Active','Hospitality research'),
('HOS-015','Tourism Seminar Room','Hospitality & Tourism Building',3,'HT-340',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Tourism seminars'),
('HOS-016','Guest Services Training Room','Hospitality & Tourism Building',1,'HT-160',35,'Training Room','Capital Campus',true,'Reception desk; POS system; reservation software; display','Active','Guest services'),
('HOS-017','Food & Beverage Classroom','Hospitality & Tourism Building',2,'HT-240',50,'Classroom','Capital Campus',true,'Interactive display; projector; food service training equipment','Active','Food and beverage management'),
('HOS-018','Hospitality Collaboration Room','Hospitality & Tourism Building',3,'HT-350',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation','Active','Hospitality projects'),
('HOS-019','Culinary Demonstration Room','Hospitality & Tourism Building',2,'HT-250',40,'Demonstration Room','Capital Campus',true,'Demonstration kitchen; overhead camera; display; audio system','Active','Chef demonstrations'),
('HOS-020','Tourism Planning Studio','Hospitality & Tourism Building',3,'HT-360',30,'Studio','Capital Campus',true,'Tourism planning software; GIS; interactive display','Active','Tourism planning'),


-- ============================================================
-- SCHOOL OF EDUCATION — 20 ROOMS
-- ============================================================

('EDU-001','Education Lecture Hall','Education & Learning Building',1,'EL-101',180,'Lecture Hall','Capital Campus',true,'4K projector; dual displays; lecture capture; microphones','Active','Large education lectures'),
('EDU-002','Teacher Education Theatre','Education & Learning Building',1,'EL-115',140,'Lecture Theatre','Capital Campus',true,'4K projector; interactive display; lecture capture','Active','Teacher education'),
('EDU-003','Education Classroom','Education & Learning Building',1,'EL-125',70,'Classroom','Capital Campus',true,'Interactive display; projector; instructor PC','Active','Education studies'),
('EDU-004','Curriculum Studies Classroom','Education & Learning Building',1,'EL-130',65,'Classroom','Capital Campus',true,'Interactive display; projector; lecture capture','Active','Curriculum studies'),
('EDU-005','Teaching Methods Lab','Education & Learning Building',2,'EL-201',40,'Teaching Lab','Capital Campus',true,'Interactive board; teaching technology; classroom furniture; recording system','Active','Teaching methods'),
('EDU-006','Early Childhood Education Lab','Education & Learning Building',2,'EL-210',35,'Specialized Lab','Capital Campus',true,'Early learning materials; child-sized furniture; interactive display','Active','Early childhood education'),
('EDU-007','Inclusive Education Lab','Education & Learning Building',2,'EL-220',35,'Specialized Lab','Capital Campus',true,'Assistive technology; accessibility equipment; interactive display','Active','Inclusive education'),
('EDU-008','Educational Technology Lab','Education & Learning Building',2,'EL-230',45,'Computer Lab','Capital Campus',true,'Teaching technology workstations; LMS software; interactive displays','Active','Educational technology'),
('EDU-009','Learning Sciences Lab','Education & Learning Building',3,'EL-301',35,'Research Laboratory','Capital Campus',true,'Research workstations; observation equipment; recording system','Active','Learning sciences research'),
('EDU-010','Assessment & Evaluation Lab','Education & Learning Building',3,'EL-310',40,'Computer Lab','Capital Campus',true,'Assessment software; workstations; statistical software','Active','Educational assessment'),
('EDU-011','Literacy Education Classroom','Education & Learning Building',1,'EL-140',60,'Classroom','Capital Campus',true,'Interactive display; projector; literacy resources','Active','Literacy education'),
('EDU-012','Mathematics Education Classroom','Education & Learning Building',1,'EL-150',60,'Classroom','Capital Campus',true,'Interactive display; mathematics teaching resources; projector','Active','Mathematics education'),
('EDU-013','Science Education Classroom','Education & Learning Building',1,'EL-160',60,'Classroom','Capital Campus',true,'Interactive display; science teaching equipment; projector','Active','Science education'),
('EDU-014','Teaching Simulation Room','Education & Learning Building',2,'EL-240',30,'Simulation Room','Capital Campus',true,'Classroom simulation equipment; cameras; microphones; observation display','Active','Teacher practice simulation'),
('EDU-015','Education Research Room','Education & Learning Building',3,'EL-320',25,'Research Room','Capital Campus',true,'Research workstations; statistical software; display','Active','Education research'),
('EDU-016','Education Seminar Room','Education & Learning Building',3,'EL-330',30,'Seminar Room','Capital Campus',true,'Interactive display; video conferencing; microphones','Active','Education seminars'),
('EDU-017','Student Teaching Collaboration Room','Education & Learning Building',3,'EL-340',20,'Collaboration Room','Capital Campus',true,'Interactive display; wireless presentation; video conferencing','Active','Student teacher collaboration'),
('EDU-018','Educational Media Studio','Education & Learning Building',2,'EL-250',30,'Media Studio','Capital Campus',true,'Cameras; microphones; editing workstation; lighting equipment','Active','Instructional media production'),
('EDU-019','Classroom Innovation Lab','Education & Learning Building',3,'EL-350',35,'Innovation Lab','Capital Campus',true,'Interactive technology; flexible classroom furniture; educational devices','Active','Innovative teaching methods'),
('EDU-020','Education Practicum Room','Education & Learning Building',2,'EL-260',30,'Practicum Room','Capital Campus',true,'Teaching stations; classroom furniture; recording equipment; interactive display','Active','Teaching practicum')
;`;

const roomTypeMap = {
  'Lecture Hall': 'LECTURE_ROOM',
  'Lecture Theatre': 'LECTURE_ROOM',
  'Classroom': 'LECTURE_ROOM',
  'Computer Classroom': 'COMPUTER_LAB',
  'Computer Lab': 'COMPUTER_LAB',
  'Simulation Lab': 'SPECIALIZED_ROOM',
  'Studio': 'SPECIALIZED_ROOM',
  'Art Studio': 'SPECIALIZED_ROOM',
  'Specialized Studio': 'SPECIALIZED_ROOM',
  'Audio Lab': 'SPECIALIZED_ROOM',
  'Design Studio': 'SPECIALIZED_ROOM',
  'Media Studio': 'SPECIALIZED_ROOM',
  'Photography Studio': 'SPECIALIZED_ROOM',
  'Film Studio': 'SPECIALIZED_ROOM',
  'Workshop': 'SPECIALIZED_ROOM',
  'Research Room': 'SEMINAR_ROOM',
  'Collaboration Room': 'SEMINAR_ROOM',
  'Seminar Room': 'SEMINAR_ROOM',
  'Science Laboratory': 'SCIENCE_LAB',
  'Chemistry Laboratory': 'SCIENCE_LAB',
  'Physics Laboratory': 'SCIENCE_LAB',
  'Microbiology Laboratory': 'SCIENCE_LAB',
  'Biochemistry Laboratory': 'SCIENCE_LAB',
  'Clinical Laboratory': 'CLINICAL_LAB',
  'Medical Laboratory': 'CLINICAL_LAB',
  'Clinical Skills Lab': 'CLINICAL_LAB',
  'Training Kitchen': 'SPECIALIZED_ROOM',
  'Food Laboratory': 'SPECIALIZED_ROOM',
  'Practical Laboratory': 'SPECIALIZED_ROOM',
  'Teaching Lab': 'SPECIALIZED_ROOM',
  'Specialized Lab': 'SPECIALIZED_ROOM',
  'Research Laboratory': 'SPECIALIZED_ROOM',
  'Cybersecurity Lab': 'COMPUTER_LAB',
  'Specialized Laboratory': 'SPECIALIZED_ROOM',
  'Training Room': 'SEMINAR_ROOM',
  'Practicum Room': 'SEMINAR_ROOM',
  'Simulation Room': 'SPECIALIZED_ROOM',
  'Preparation Room': 'SPECIALIZED_ROOM',
  'Design Lab': 'COMPUTER_LAB',
  'Innovation Lab': 'SPECIALIZED_ROOM',
  'Robotics Lab': 'SPECIALIZED_ROOM',
  'Electronics Lab': 'SPECIALIZED_ROOM',
  'Demonstration Room': 'SPECIALIZED_ROOM',
  'Case Study Room': 'SEMINAR_ROOM',
  'Media Seminar Room': 'SEMINAR_ROOM',
  'Audio Lab': 'SPECIALIZED_ROOM',
};

function normalizeEquipment(equip) {
  if (!equip || equip === '{}') return '{}';
  const items = equip.split(';').map(s => s.trim()).filter(Boolean);
  const obj = {};
  for (const item of items) {
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    obj[key] = true;
  }
  return JSON.stringify(obj);
}

// Parse VALUES rows
const valuesMatch = input.match(/VALUES\s*([\s\S]*);$/);
if (!valuesMatch) {
  console.error('Could not parse VALUES section');
  process.exit(1);
}

const valuesText = valuesMatch[1];
const rows = [];
const rowRegex = /\('([^']*)','([^']*)','([^']*)',(\d+),'([^']*)',(\d+),'([^']*)','([^']*)',(true|false),'([^']*)','([^']*)','([^']*)'\)/g;

let match;
while ((match = rowRegex.exec(valuesText)) !== null) {
  rows.push({
    id: match[1],
    name: match[2],
    building: match[3],
    floor: match[4],
    room_number: match[5],
    capacity: parseInt(match[6]),
    room_type: match[7],
    campus: match[8],
    accessibility: match[9],
    equipment: match[10],
    status: match[11],
    notes: match[12],
  });
}

console.log(`Parsed ${rows.length} rooms`);

const outputRows = rows.map(r => {
  const mappedType = roomTypeMap[r.room_type] || 'SPECIALIZED_ROOM';
  const equipment = normalizeEquipment(r.equipment);
  return `  ('${r.id}', '${r.name}', '${r.building}', '${r.floor}', '${r.room_number}', ${r.capacity}, '${mappedType}', 'MAIN', ${r.accessibility}, '${equipment}', 'ACTIVE', '${r.notes.replace(/'/g, "''")}')`;
}).join(',\n');

const output = `INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)
VALUES
${outputRows}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  building = EXCLUDED.building,
  capacity = EXCLUDED.capacity,
  room_type = EXCLUDED.room_type,
  status = EXCLUDED.status;
`;

fs.writeFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', output);
console.log('Wrote converted seed data');
