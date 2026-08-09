INSERT INTO public.rooms (name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)
VALUES
  ('Maple Commerce Hall', 'Business & Commerce Building', '1', 'BC-101', 180, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"dual_displays":true,"lecture_capture":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Large business and commerce lectures'),
  ('Cedar Business Theatre', 'Business & Commerce Building', '1', 'BC-115', 140, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"interactive_display":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Large business courses'),
  ('Riverside Lecture Hall', 'Business & Commerce Building', '2', 'BC-201', 120, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"podium_pc":true,"lecture_capture":true,"wireless_presentation":true}', 'ACTIVE', 'Business administration lectures'),
  ('Capital Commerce Hall', 'Business & Commerce Building', '2', 'BC-215', 100, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Commerce and management courses'),
  ('Kingston Business Classroom', 'Business & Commerce Building', '1', 'BC-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'General business instruction'),
  ('Lakeside Business Classroom', 'Business & Commerce Building', '1', 'BC-130', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"wireless_presentation":true}', 'ACTIVE', 'Management and administration'),
  ('Enterprise Analytics Lab', 'Business & Commerce Building', '2', 'BC-225', 50, 'COMPUTER_LAB', 'MAIN', true, '{"workstations":true,"analytics_software":true,"dual_displays":true,"projector":true}', 'ACTIVE', 'Business analytics and data courses'),
  ('Finance Simulation Lab', 'Business & Commerce Building', '2', 'BC-230', 45, 'SPECIALIZED_ROOM', 'MAIN', true, '{"financial_modelling_software":true,"workstations":true,"market_simulation_software":true}', 'ACTIVE', 'Finance and investment simulations'),
  ('Accounting Lab', 'Business & Commerce Building', '2', 'BC-235', 45, 'COMPUTER_LAB', 'MAIN', true, '{"accounting_software":true,"workstations":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Accounting instruction'),
  ('Entrepreneurship Studio', 'Business & Commerce Building', '3', 'BC-305', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"interactive_display":true,"collaboration_tables":true,"wireless_presentation":true}', 'ACTIVE', 'Entrepreneurship and innovation'),
  ('Marketing Studio', 'Business & Commerce Building', '3', 'BC-310', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"interactive_display":true,"presentation_equipment":true,"workstations":true}', 'ACTIVE', 'Marketing and communications'),
  ('Human Resources Classroom', 'Business & Commerce Building', '3', 'BC-315', 55, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Human resources courses'),
  ('Economics Classroom', 'Business & Commerce Building', '3', 'BC-320', 65, 'LECTURE_ROOM', 'MAIN', true, '{"projector":true,"interactive_display":true,"lecture_capture":true}', 'ACTIVE', 'Economics courses'),
  ('Business Research Room', 'Business & Commerce Building', '3', 'BC-325', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"display":true,"video_conferencing":true}', 'ACTIVE', 'Faculty and student research'),
  ('Executive Seminar Room', 'Business & Commerce Building', '2', 'BC-240', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"video_conferencing":true,"interactive_display":true,"microphones":true}', 'ACTIVE', 'Advanced seminars'),
  ('Business Collaboration Room', 'Business & Commerce Building', '2', 'BC-245', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true}', 'ACTIVE', 'Group projects'),
  ('Supply Chain Classroom', 'Business & Commerce Building', '1', 'BC-140', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"logistics_software":true,"projector":true}', 'ACTIVE', 'Supply chain and operations'),
  ('Project Management Lab', 'Business & Commerce Building', '2', 'BC-250', 40, 'COMPUTER_LAB', 'MAIN', true, '{"project_management_software":true,"workstations":true,"display":true}', 'ACTIVE', 'Project management'),
  ('Business Case Room', 'Business & Commerce Building', '3', 'BC-335', 35, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"conference_tables":true,"wireless_presentation":true}', 'ACTIVE', 'Business case analysis'),
  ('Leadership Seminar Room', 'Business & Commerce Building', '3', 'BC-340', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Leadership and organizational studies'),
  ('Grand Arts Lecture Hall', 'Arts, Design & Media Building', '1', 'AD-101', 160, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Arts and design lectures'),
  ('Creative Arts Theatre', 'Arts, Design & Media Building', '1', 'AD-115', 120, 'LECTURE_ROOM', 'MAIN', true, '{"projector":true,"stage_lighting":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Arts and media presentations'),
  ('Design Classroom', 'Arts, Design & Media Building', '1', 'AD-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Design theory'),
  ('Visual Arts Classroom', 'Arts, Design & Media Building', '1', 'AD-130', 60, 'LECTURE_ROOM', 'MAIN', true, '{"projector":true,"display":true,"movable_tables":true}', 'ACTIVE', 'Visual arts instruction'),
  ('Graphic Design Studio', 'Arts, Design & Media Building', '2', 'AD-201', 45, 'SPECIALIZED_ROOM', 'MAIN', true, '{"design_workstations":true,"adobe_creative_cloud":true,"dual_displays":true,"projector":true}', 'ACTIVE', 'Graphic design'),
  ('Digital Media Studio', 'Arts, Design & Media Building', '2', 'AD-210', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"editing_workstations":true,"cameras":true,"microphones":true,"display":true}', 'ACTIVE', 'Digital media production'),
  ('Photography Studio', 'Arts, Design & Media Building', '2', 'AD-220', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"lighting_systems":true,"photography_equipment":true,"backdrop_system":true}', 'ACTIVE', 'Photography courses'),
  ('Film Production Studio', 'Arts, Design & Media Building', '2', 'AD-230', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"cameras":true,"lighting":true,"audio_equipment":true,"editing_workstation":true}', 'ACTIVE', 'Film production'),
  ('Animation Lab', 'Arts, Design & Media Building', '3', 'AD-301', 40, 'COMPUTER_LAB', 'MAIN', true, '{"animation_workstations":true,"graphics_tablets":true,"3d_software":true}', 'ACTIVE', 'Animation and motion graphics'),
  ('Illustration Studio', 'Arts, Design & Media Building', '3', 'AD-310', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"drawing_tables":true,"graphics_tablets":true,"display":true}', 'ACTIVE', 'Illustration'),
  ('Fine Arts Studio', 'Arts, Design & Media Building', '1', 'AD-140', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"easels":true,"work_tables":true,"storage":true,"sinks":true}', 'ACTIVE', 'Fine arts'),
  ('Sculpture Studio', 'Arts, Design & Media Building', '1', 'AD-150', 25, 'SPECIALIZED_ROOM', 'MAIN', true, '{"work_benches":true,"sculpting_equipment":true,"ventilation":true}', 'ACTIVE', 'Sculpture and three-dimensional art'),
  ('Printmaking Studio', 'Arts, Design & Media Building', '1', 'AD-160', 25, 'SPECIALIZED_ROOM', 'MAIN', true, '{"print_presses":true,"work_tables":true,"drying_racks":true}', 'ACTIVE', 'Printmaking'),
  ('Sound Production Lab', 'Arts, Design & Media Building', '2', 'AD-240', 25, 'SPECIALIZED_ROOM', 'MAIN', true, '{"audio_workstations":true,"microphones":true,"mixing_consoles":true,"studio_monitors":true}', 'ACTIVE', 'Audio production'),
  ('Media Research Room', 'Arts, Design & Media Building', '3', 'AD-320', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"workstations":true,"display":true,"video_conferencing":true}', 'ACTIVE', 'Media research'),
  ('Creative Collaboration Room', 'Arts, Design & Media Building', '3', 'AD-325', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true}', 'ACTIVE', 'Collaborative creative projects'),
  ('Typography Lab', 'Arts, Design & Media Building', '2', 'AD-250', 30, 'COMPUTER_LAB', 'MAIN', true, '{"design_workstations":true,"typography_software":true,"projector":true}', 'ACTIVE', 'Typography and publication design'),
  ('Interactive Design Lab', 'Arts, Design & Media Building', '3', 'AD-330', 35, 'COMPUTER_LAB', 'MAIN', true, '{"design_workstations":true,"prototyping_software":true,"interactive_displays":true}', 'ACTIVE', 'UX and interactive design'),
  ('Media Seminar Room', 'Arts, Design & Media Building', '3', 'AD-335', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Media seminars'),
  ('Exhibition Workshop', 'Arts, Design & Media Building', '1', 'AD-170', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"display_panels":true,"work_tables":true,"presentation_equipment":true}', 'ACTIVE', 'Exhibition preparation'),
  ('Technology Lecture Hall', 'Technology & Engineering Building', '1', 'TE-101', 200, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"dual_displays":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Large technology lectures'),
  ('Engineering Lecture Theatre', 'Technology & Engineering Building', '1', 'TE-115', 150, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true}', 'ACTIVE', 'Engineering lectures'),
  ('Software Engineering Classroom', 'Technology & Engineering Building', '1', 'TE-125', 80, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Software engineering'),
  ('Computing Classroom', 'Technology & Engineering Building', '1', 'TE-130', 70, 'COMPUTER_LAB', 'MAIN', true, '{"desktop_workstations":true,"projector":true,"interactive_display":true}', 'ACTIVE', 'Computing courses'),
  ('Programming Lab', 'Technology & Engineering Building', '2', 'TE-201', 60, 'COMPUTER_LAB', 'MAIN', true, '{"developer_workstations":true,"ides":true,"dual_displays":true,"projector":true}', 'ACTIVE', 'Programming courses'),
  ('Networking Lab', 'Technology & Engineering Building', '2', 'TE-210', 50, 'COMPUTER_LAB', 'MAIN', true, '{"networking_racks":true,"routers":true,"switches":true,"workstations":true}', 'ACTIVE', 'Networking and infrastructure'),
  ('Cybersecurity Lab', 'Technology & Engineering Building', '2', 'TE-220', 45, 'COMPUTER_LAB', 'MAIN', true, '{"security_workstations":true,"network_simulation":true,"monitoring_systems":true}', 'ACTIVE', 'Cybersecurity'),
  ('Database Lab', 'Technology & Engineering Building', '2', 'TE-230', 50, 'COMPUTER_LAB', 'MAIN', true, '{"database_servers":true,"workstations":true,"development_software":true}', 'ACTIVE', 'Database systems'),
  ('AI & Machine Learning Lab', 'Technology & Engineering Building', '3', 'TE-301', 45, 'COMPUTER_LAB', 'MAIN', true, '{"gpu_workstations":true,"ml_software":true,"interactive_display":true}', 'ACTIVE', 'Artificial intelligence and machine learning'),
  ('Robotics Lab', 'Technology & Engineering Building', '1', 'TE-140', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"robotics_kits":true,"workstations":true,"sensors":true,"development_equipment":true}', 'ACTIVE', 'Robotics'),
  ('Electronics Lab', 'Technology & Engineering Building', '1', 'TE-150', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"oscilloscopes":true,"power_supplies":true,"electronics_benches":true,"soldering_stations":true}', 'ACTIVE', 'Electronics'),
  ('Embedded Systems Lab', 'Technology & Engineering Building', '2', 'TE-240', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"microcontrollers":true,"development_boards":true,"oscilloscopes":true,"workstations":true}', 'ACTIVE', 'Embedded systems'),
  ('Cloud Computing Lab', 'Technology & Engineering Building', '3', 'TE-310', 45, 'COMPUTER_LAB', 'MAIN', true, '{"cloud_development_workstations":true,"virtualization_software":true,"projector":true}', 'ACTIVE', 'Cloud computing'),
  ('Web Development Lab', 'Technology & Engineering Building', '3', 'TE-320', 50, 'COMPUTER_LAB', 'MAIN', true, '{"developer_workstations":true,"browsers":true,"ides":true,"interactive_display":true}', 'ACTIVE', 'Web development'),
  ('Technology Research Room', 'Technology & Engineering Building', '3', 'TE-330', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"display":true,"video_conferencing":true}', 'ACTIVE', 'Technology research'),
  ('Engineering Design Studio', 'Technology & Engineering Building', '2', 'TE-250', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"cad_workstations":true,"3d_modelling_software":true,"projector":true}', 'ACTIVE', 'Engineering design'),
  ('Innovation Lab', 'Technology & Engineering Building', '3', 'TE-340', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"prototyping_tools":true,"development_boards":true,"interactive_display":true}', 'ACTIVE', 'Technology innovation'),
  ('Systems Administration Lab', 'Technology & Engineering Building', '2', 'TE-260', 40, 'COMPUTER_LAB', 'MAIN', true, '{"server_racks":true,"virtualization_systems":true,"workstations":true}', 'ACTIVE', 'Systems administration'),
  ('Technology Seminar Room', 'Technology & Engineering Building', '3', 'TE-350', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Technology seminars'),
  ('Technology Collaboration Room', 'Technology & Engineering Building', '2', 'TE-270', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true}', 'ACTIVE', 'Team projects'),
  ('Science Grand Lecture Hall', 'Science & Innovation Building', '1', 'SI-101', 200, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"dual_displays":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Large science lectures'),
  ('Natural Sciences Theatre', 'Science & Innovation Building', '1', 'SI-115', 150, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true}', 'ACTIVE', 'Natural sciences'),
  ('Biology Classroom', 'Science & Innovation Building', '1', 'SI-125', 80, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Biology lectures'),
  ('Chemistry Classroom', 'Science & Innovation Building', '1', 'SI-130', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Chemistry theory'),
  ('General Biology Lab', 'Science & Innovation Building', '2', 'SI-201', 40, 'SCIENCE_LAB', 'MAIN', true, '{"laboratory_benches":true,"microscopes":true,"sinks":true,"safety_equipment":true}', 'ACTIVE', 'Biology practicals'),
  ('Chemistry Lab', 'Science & Innovation Building', '2', 'SI-210', 40, 'SCIENCE_LAB', 'MAIN', true, '{"fume_hoods":true,"lab_benches":true,"chemical_storage":true,"safety_equipment":true}', 'ACTIVE', 'Chemistry practicals'),
  ('Physics Lab', 'Science & Innovation Building', '2', 'SI-220', 40, 'SCIENCE_LAB', 'MAIN', true, '{"physics_equipment":true,"oscilloscopes":true,"experiment_stations":true}', 'ACTIVE', 'Physics practicals'),
  ('Microbiology Lab', 'Science & Innovation Building', '2', 'SI-230', 35, 'SCIENCE_LAB', 'MAIN', true, '{"microscopes":true,"incubators":true,"sterile_workstations":true,"safety_equipment":true}', 'ACTIVE', 'Microbiology'),
  ('Biochemistry Lab', 'Science & Innovation Building', '3', 'SI-301', 35, 'SCIENCE_LAB', 'MAIN', true, '{"laboratory_benches":true,"centrifuges":true,"spectrophotometer":true,"safety_equipment":true}', 'ACTIVE', 'Biochemistry'),
  ('Environmental Science Lab', 'Science & Innovation Building', '3', 'SI-310', 35, 'SCIENCE_LAB', 'MAIN', true, '{"sampling_equipment":true,"workstations":true,"analysis_equipment":true}', 'ACTIVE', 'Environmental science'),
  ('Earth Science Lab', 'Science & Innovation Building', '3', 'SI-320', 35, 'SCIENCE_LAB', 'MAIN', true, '{"geology_specimens":true,"microscopes":true,"analysis_equipment":true}', 'ACTIVE', 'Earth science'),
  ('Data Science Lab', 'Science & Innovation Building', '3', 'SI-330', 45, 'COMPUTER_LAB', 'MAIN', true, '{"data_science_workstations":true,"statistical_software":true,"projector":true}', 'ACTIVE', 'Data science'),
  ('Mathematics Classroom', 'Science & Innovation Building', '1', 'SI-140', 80, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Mathematics'),
  ('Statistics Classroom', 'Science & Innovation Building', '1', 'SI-150', 65, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"statistical_software":true,"projector":true}', 'ACTIVE', 'Statistics'),
  ('Science Research Room', 'Science & Innovation Building', '3', 'SI-340', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"display":true,"video_conferencing":true}', 'ACTIVE', 'Science research'),
  ('Science Seminar Room', 'Science & Innovation Building', '3', 'SI-350', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Science seminars'),
  ('Scientific Computing Lab', 'Science & Innovation Building', '2', 'SI-240', 40, 'COMPUTER_LAB', 'MAIN', true, '{"scientific_computing_workstations":true,"modelling_software":true,"projector":true}', 'ACTIVE', 'Scientific computing'),
  ('Research Collaboration Room', 'Science & Innovation Building', '3', 'SI-360', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true}', 'ACTIVE', 'Research collaboration'),
  ('Applied Science Classroom', 'Science & Innovation Building', '2', 'SI-250', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"lecture_capture":true}', 'ACTIVE', 'Applied sciences'),
  ('Science Preparation Room', 'Science & Innovation Building', '1', 'SI-160', 20, 'SPECIALIZED_ROOM', 'MAIN', true, '{"laboratory_preparation_equipment":true,"storage":true,"sinks":true}', 'ACTIVE', 'Laboratory preparation'),
  ('Health Sciences Lecture Hall', 'Health Sciences Building', '1', 'HS-101', 180, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Large health sciences lectures'),
  ('Clinical Sciences Theatre', 'Health Sciences Building', '1', 'HS-115', 140, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"interactive_display":true,"lecture_capture":true}', 'ACTIVE', 'Clinical science lectures'),
  ('Nursing Classroom', 'Health Sciences Building', '1', 'HS-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Nursing theory'),
  ('Health Studies Classroom', 'Health Sciences Building', '1', 'HS-130', 65, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"lecture_capture":true}', 'ACTIVE', 'Health studies'),
  ('Nursing Skills Lab', 'Health Sciences Building', '2', 'HS-201', 35, 'CLINICAL_LAB', 'MAIN', true, '{"hospital_beds":true,"mannequins":true,"clinical_equipment":true,"sinks":true,"simulation_equipment":true}', 'ACTIVE', 'Nursing practical training'),
  ('Patient Care Simulation Lab', 'Health Sciences Building', '2', 'HS-210', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"patient_simulators":true,"hospital_beds":true,"monitoring_equipment":true,"recording_system":true}', 'ACTIVE', 'Clinical simulation'),
  ('Anatomy & Physiology Lab', 'Health Sciences Building', '2', 'HS-220', 40, 'SCIENCE_LAB', 'MAIN', true, '{"anatomical_models":true,"microscopes":true,"interactive_display":true}', 'ACTIVE', 'Anatomy and physiology'),
  ('Pharmacology Lab', 'Health Sciences Building', '2', 'HS-230', 35, 'CLINICAL_LAB', 'MAIN', true, '{"medication_training_equipment":true,"simulation_systems":true,"display":true}', 'ACTIVE', 'Pharmacology training'),
  ('Medical Laboratory', 'Health Sciences Building', '3', 'HS-301', 35, 'CLINICAL_LAB', 'MAIN', true, '{"microscopes":true,"centrifuges":true,"laboratory_benches":true,"safety_equipment":true}', 'ACTIVE', 'Medical laboratory science'),
  ('Dental Hygiene Lab', 'Health Sciences Building', '1', 'HS-140', 25, 'CLINICAL_LAB', 'MAIN', true, '{"dental_training_units":true,"dental_instruments":true,"simulation_equipment":true}', 'ACTIVE', 'Dental hygiene practicals'),
  ('Diagnostic Imaging Lab', 'Health Sciences Building', '2', 'HS-240', 25, 'SPECIALIZED_ROOM', 'MAIN', true, '{"imaging_simulation_equipment":true,"display":true,"training_workstations":true}', 'ACTIVE', 'Diagnostic imaging training'),
  ('Physiotherapy Lab', 'Health Sciences Building', '1', 'HS-150', 30, 'CLINICAL_LAB', 'MAIN', true, '{"treatment_tables":true,"rehabilitation_equipment":true,"mobility_equipment":true}', 'ACTIVE', 'Physiotherapy practicals'),
  ('Health Assessment Lab', 'Health Sciences Building', '2', 'HS-250', 35, 'CLINICAL_LAB', 'MAIN', true, '{"assessment_equipment":true,"examination_beds":true,"clinical_simulation_equipment":true}', 'ACTIVE', 'Health assessment'),
  ('Public Health Classroom', 'Health Sciences Building', '3', 'HS-310', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Public health'),
  ('Health Research Room', 'Health Sciences Building', '3', 'HS-320', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"statistical_software":true,"display":true}', 'ACTIVE', 'Health research'),
  ('Clinical Seminar Room', 'Health Sciences Building', '3', 'HS-330', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Clinical seminars'),
  ('Healthcare Technology Lab', 'Health Sciences Building', '3', 'HS-340', 35, 'COMPUTER_LAB', 'MAIN', true, '{"healthcare_software":true,"workstations":true,"simulation_systems":true}', 'ACTIVE', 'Digital health and health technology'),
  ('Interprofessional Practice Room', 'Health Sciences Building', '2', 'HS-260', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"clinical_simulation_equipment":true,"interactive_display":true,"recording_system":true}', 'ACTIVE', 'Interprofessional healthcare training'),
  ('Health Collaboration Room', 'Health Sciences Building', '3', 'HS-350', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true,"video_conferencing":true}', 'ACTIVE', 'Health team projects'),
  ('Clinical Preparation Room', 'Health Sciences Building', '1', 'HS-160', 20, 'SPECIALIZED_ROOM', 'MAIN', true, '{"clinical_equipment_storage":true,"preparation_benches":true,"sinks":true}', 'ACTIVE', 'Clinical laboratory preparation'),
  ('Pineview Lecture Hall', 'Transportation & Mobility Building', '1', 'TM-101', 180, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"dual_displays":true,"lecture_capture":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Large transportation lectures'),
  ('Northfield Lecture Hall', 'Transportation & Mobility Building', '1', 'TM-115', 140, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"interactive_display":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Transportation and logistics'),
  ('Westbridge Lecture Theatre', 'Transportation & Mobility Building', '2', 'TM-201', 120, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true,"wireless_presentation":true}', 'ACTIVE', 'Transportation management'),
  ('Clearwater Lecture Hall', 'Transportation & Mobility Building', '2', 'TM-215', 100, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"4k_projector":true,"lecture_capture":true}', 'ACTIVE', 'Supply chain and mobility'),
  ('Evergreen Transport Classroom', 'Transportation & Mobility Building', '1', 'TM-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Transport operations'),
  ('Mobility Systems Lab', 'Transportation & Mobility Building', '2', 'TM-225', 50, 'COMPUTER_LAB', 'MAIN', true, '{"workstations":true,"gis_software":true,"transport_simulation_software":true,"projector":true}', 'ACTIVE', 'Transportation planning and modelling'),
  ('Fleet Operations Lab', 'Transportation & Mobility Building', '1', 'TM-135', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"fleet_management_software":true,"vehicle_diagnostics_training_equipment":true}', 'ACTIVE', 'Fleet management'),
  ('Supply Chain Simulation Lab', 'Transportation & Mobility Building', '2', 'TM-235', 45, 'SPECIALIZED_ROOM', 'MAIN', true, '{"supply_chain_simulation_software":true,"workstations":true,"interactive_display":true}', 'ACTIVE', 'Logistics simulation'),
  ('Transportation Planning Studio', 'Transportation & Mobility Building', '2', 'TM-245', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"gis_workstations":true,"mapping_displays":true,"planning_software":true}', 'ACTIVE', 'Transportation planning'),
  ('Mobility Research Seminar Room', 'Transportation & Mobility Building', '3', 'TM-305', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Transportation research'),
  ('Transit Systems Classroom', 'Transportation & Mobility Building', '3', 'TM-310', 65, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"4k_projector":true,"lecture_capture":true}', 'ACTIVE', 'Public transit systems'),
  ('Freight & Logistics Classroom', 'Transportation & Mobility Building', '3', 'TM-320', 75, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"logistics_software":true,"projector":true}', 'ACTIVE', 'Freight and logistics'),
  ('Aviation Operations Classroom', 'Transportation & Mobility Building', '2', 'TM-230', 60, 'SPECIALIZED_ROOM', 'MAIN', true, '{"aviation_operations_software":true,"interactive_display":true,"projector":true}', 'ACTIVE', 'Aviation operations'),
  ('Transport Safety Training Room', 'Transportation & Mobility Building', '1', 'TM-145', 50, 'SEMINAR_ROOM', 'MAIN', true, '{"safety_training_equipment":true,"interactive_display":true,"video_system":true}', 'ACTIVE', 'Transportation safety'),
  ('Roadway Design Studio', 'Transportation & Mobility Building', '3', 'TM-330', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"cad_workstations":true,"gis_software":true,"large_format_display":true}', 'ACTIVE', 'Roadway design'),
  ('Transport Data Analytics Lab', 'Transportation & Mobility Building', '3', 'TM-340', 45, 'COMPUTER_LAB', 'MAIN', true, '{"data_analytics_software":true,"gis":true,"statistical_software":true,"workstations":true}', 'ACTIVE', 'Transportation data analysis'),
  ('Warehouse & Distribution Lab', 'Transportation & Mobility Building', '1', 'TM-155', 55, 'SPECIALIZED_ROOM', 'MAIN', true, '{"warehouse_management_software":true,"inventory_systems":true,"barcode_equipment":true}', 'ACTIVE', 'Warehousing and distribution'),
  ('Smart Mobility Innovation Lab', 'Transportation & Mobility Building', '2', 'TM-250', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"iot_devices":true,"mobility_simulation_software":true,"development_workstations":true}', 'ACTIVE', 'Smart mobility'),
  ('Transportation Research Room', 'Transportation & Mobility Building', '3', 'TM-350', 24, 'SEMINAR_ROOM', 'MAIN', true, '{"workstations":true,"research_software":true,"interactive_display":true}', 'ACTIVE', 'Transportation research'),
  ('Mobility Collaboration Room', 'Transportation & Mobility Building', '2', 'TM-260', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"wireless_presentation":true}', 'ACTIVE', 'Transportation group projects'),
  ('Hospitality Lecture Hall', 'Hospitality & Tourism Building', '1', 'HT-101', 160, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"lecture_capture":true,"podium_pc":true,"microphones":true}', 'ACTIVE', 'Hospitality lectures'),
  ('Tourism Lecture Theatre', 'Hospitality & Tourism Building', '1', 'HT-115', 120, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"interactive_display":true,"lecture_capture":true}', 'ACTIVE', 'Tourism studies'),
  ('Hospitality Classroom', 'Hospitality & Tourism Building', '1', 'HT-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Hospitality management'),
  ('Tourism Studies Classroom', 'Hospitality & Tourism Building', '1', 'HT-130', 65, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"lecture_capture":true}', 'ACTIVE', 'Tourism studies'),
  ('Culinary Training Kitchen', 'Hospitality & Tourism Building', '2', 'HT-201', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"commercial_ovens":true,"ranges":true,"preparation_stations":true,"refrigerators":true,"sinks":true}', 'ACTIVE', 'Culinary practical training'),
  ('Advanced Culinary Kitchen', 'Hospitality & Tourism Building', '2', 'HT-210', 24, 'SPECIALIZED_ROOM', 'MAIN', true, '{"commercial_cooking_equipment":true,"preparation_stations":true,"refrigeration":true}', 'ACTIVE', 'Advanced culinary training'),
  ('Baking & Pastry Lab', 'Hospitality & Tourism Building', '2', 'HT-220', 24, 'SPECIALIZED_ROOM', 'MAIN', true, '{"commercial_ovens":true,"mixers":true,"preparation_benches":true,"refrigeration":true}', 'ACTIVE', 'Baking and pastry'),
  ('Food Science Lab', 'Hospitality & Tourism Building', '2', 'HT-230', 25, 'SPECIALIZED_ROOM', 'MAIN', true, '{"food_testing_equipment":true,"laboratory_benches":true,"refrigeration":true}', 'ACTIVE', 'Food science'),
  ('Restaurant Operations Lab', 'Hospitality & Tourism Building', '1', 'HT-140', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"restaurant_tables":true,"pos_systems":true,"service_stations":true,"kitchen_equipment":true}', 'ACTIVE', 'Restaurant operations'),
  ('Hotel Operations Lab', 'Hospitality & Tourism Building', '1', 'HT-150', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"hotel_front_desk":true,"reservation_software":true,"housekeeping_simulation_equipment":true}', 'ACTIVE', 'Hotel operations'),
  ('Event Management Studio', 'Hospitality & Tourism Building', '3', 'HT-301', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"event_planning_software":true,"presentation_system":true,"movable_tables":true}', 'ACTIVE', 'Event management'),
  ('Tourism Technology Lab', 'Hospitality & Tourism Building', '3', 'HT-310', 40, 'COMPUTER_LAB', 'MAIN', true, '{"tourism_software":true,"booking_systems":true,"workstations":true,"projector":true}', 'ACTIVE', 'Tourism technology'),
  ('Travel Operations Lab', 'Hospitality & Tourism Building', '3', 'HT-320', 35, 'COMPUTER_LAB', 'MAIN', true, '{"reservation_systems":true,"travel_software":true,"workstations":true}', 'ACTIVE', 'Travel operations'),
  ('Hospitality Research Room', 'Hospitality & Tourism Building', '3', 'HT-330', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"display":true,"video_conferencing":true}', 'ACTIVE', 'Hospitality research'),
  ('Tourism Seminar Room', 'Hospitality & Tourism Building', '3', 'HT-340', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Tourism seminars'),
  ('Guest Services Training Room', 'Hospitality & Tourism Building', '1', 'HT-160', 35, 'SEMINAR_ROOM', 'MAIN', true, '{"reception_desk":true,"pos_system":true,"reservation_software":true,"display":true}', 'ACTIVE', 'Guest services'),
  ('Food & Beverage Classroom', 'Hospitality & Tourism Building', '2', 'HT-240', 50, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"food_service_training_equipment":true}', 'ACTIVE', 'Food and beverage management'),
  ('Hospitality Collaboration Room', 'Hospitality & Tourism Building', '3', 'HT-350', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true}', 'ACTIVE', 'Hospitality projects'),
  ('Culinary Demonstration Room', 'Hospitality & Tourism Building', '2', 'HT-250', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"demonstration_kitchen":true,"overhead_camera":true,"display":true,"audio_system":true}', 'ACTIVE', 'Chef demonstrations'),
  ('Tourism Planning Studio', 'Hospitality & Tourism Building', '3', 'HT-360', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"tourism_planning_software":true,"gis":true,"interactive_display":true}', 'ACTIVE', 'Tourism planning'),
  ('Education Lecture Hall', 'Education & Learning Building', '1', 'EL-101', 180, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"dual_displays":true,"lecture_capture":true,"microphones":true}', 'ACTIVE', 'Large education lectures'),
  ('Teacher Education Theatre', 'Education & Learning Building', '1', 'EL-115', 140, 'LECTURE_ROOM', 'MAIN', true, '{"4k_projector":true,"interactive_display":true,"lecture_capture":true}', 'ACTIVE', 'Teacher education'),
  ('Education Classroom', 'Education & Learning Building', '1', 'EL-125', 70, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"instructor_pc":true}', 'ACTIVE', 'Education studies'),
  ('Curriculum Studies Classroom', 'Education & Learning Building', '1', 'EL-130', 65, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"lecture_capture":true}', 'ACTIVE', 'Curriculum studies'),
  ('Teaching Methods Lab', 'Education & Learning Building', '2', 'EL-201', 40, 'SPECIALIZED_ROOM', 'MAIN', true, '{"interactive_board":true,"teaching_technology":true,"classroom_furniture":true,"recording_system":true}', 'ACTIVE', 'Teaching methods'),
  ('Early Childhood Education Lab', 'Education & Learning Building', '2', 'EL-210', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"early_learning_materials":true,"child_sized_furniture":true,"interactive_display":true}', 'ACTIVE', 'Early childhood education'),
  ('Inclusive Education Lab', 'Education & Learning Building', '2', 'EL-220', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"assistive_technology":true,"accessibility_equipment":true,"interactive_display":true}', 'ACTIVE', 'Inclusive education'),
  ('Educational Technology Lab', 'Education & Learning Building', '2', 'EL-230', 45, 'COMPUTER_LAB', 'MAIN', true, '{"teaching_technology_workstations":true,"lms_software":true,"interactive_displays":true}', 'ACTIVE', 'Educational technology'),
  ('Learning Sciences Lab', 'Education & Learning Building', '3', 'EL-301', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"research_workstations":true,"observation_equipment":true,"recording_system":true}', 'ACTIVE', 'Learning sciences research'),
  ('Assessment & Evaluation Lab', 'Education & Learning Building', '3', 'EL-310', 40, 'COMPUTER_LAB', 'MAIN', true, '{"assessment_software":true,"workstations":true,"statistical_software":true}', 'ACTIVE', 'Educational assessment'),
  ('Literacy Education Classroom', 'Education & Learning Building', '1', 'EL-140', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"projector":true,"literacy_resources":true}', 'ACTIVE', 'Literacy education'),
  ('Mathematics Education Classroom', 'Education & Learning Building', '1', 'EL-150', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"mathematics_teaching_resources":true,"projector":true}', 'ACTIVE', 'Mathematics education'),
  ('Science Education Classroom', 'Education & Learning Building', '1', 'EL-160', 60, 'LECTURE_ROOM', 'MAIN', true, '{"interactive_display":true,"science_teaching_equipment":true,"projector":true}', 'ACTIVE', 'Science education'),
  ('Teaching Simulation Room', 'Education & Learning Building', '2', 'EL-240', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"classroom_simulation_equipment":true,"cameras":true,"microphones":true,"observation_display":true}', 'ACTIVE', 'Teacher practice simulation'),
  ('Education Research Room', 'Education & Learning Building', '3', 'EL-320', 25, 'SEMINAR_ROOM', 'MAIN', true, '{"research_workstations":true,"statistical_software":true,"display":true}', 'ACTIVE', 'Education research'),
  ('Education Seminar Room', 'Education & Learning Building', '3', 'EL-330', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"video_conferencing":true,"microphones":true}', 'ACTIVE', 'Education seminars'),
  ('Student Teaching Collaboration Room', 'Education & Learning Building', '3', 'EL-340', 20, 'SEMINAR_ROOM', 'MAIN', true, '{"interactive_display":true,"wireless_presentation":true,"video_conferencing":true}', 'ACTIVE', 'Student teacher collaboration'),
  ('Educational Media Studio', 'Education & Learning Building', '2', 'EL-250', 30, 'SPECIALIZED_ROOM', 'MAIN', true, '{"cameras":true,"microphones":true,"editing_workstation":true,"lighting_equipment":true}', 'ACTIVE', 'Instructional media production'),
  ('Classroom Innovation Lab', 'Education & Learning Building', '3', 'EL-350', 35, 'SPECIALIZED_ROOM', 'MAIN', true, '{"interactive_technology":true,"flexible_classroom_furniture":true,"educational_devices":true}', 'ACTIVE', 'Innovative teaching methods'),
  ('Education Practicum Room', 'Education & Learning Building', '2', 'EL-260', 30, 'SEMINAR_ROOM', 'MAIN', true, '{"teaching_stations":true,"classroom_furniture":true,"recording_equipment":true,"interactive_display":true}', 'ACTIVE', 'Teaching practicum')
;




-- =============================================
-- 2. SEED ROOM FEATURES
-- =============================================

INSERT INTO public.room_features (name, description, category) VALUES
  ('projector', 'Video projector', 'AV'),
  ('smart_board', 'Interactive smart board', 'AV'),
  ('computers', 'Desktop computers', 'COMPUTING'),
  ('science_lab', 'Science lab equipment', 'SCIENCE'),
  ('nursing_equipment', 'Nursing clinical equipment', 'MEDICAL'),
  ('audio_visual', 'Audio visual system', 'AV'),
  ('wheelchair_access', 'Wheelchair accessible', 'ACCESSIBILITY'),
  ('specialized_equipment', 'Specialized equipment', 'GENERAL')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, category = EXCLUDED.category;

-- =============================================
-- 3. SEED ROOM FEATURE ASSIGNMENTS
-- =============================================

INSERT INTO public.room_feature_assignments (room_id, feature_id, notes)
SELECT 
  r.id, f.id, 'Standard equipment'
FROM public.rooms r
JOIN public.room_features f ON 
  (r.room_type = 'LECTURE_ROOM' AND f.name IN ('projector', 'smart_board', 'audio_visual'))
  OR (r.room_type = 'COMPUTER_LAB' AND f.name IN ('computers', 'projector'))
  OR (r.room_type = 'SCIENCE_LAB' AND f.name IN ('science_lab', 'projector'))
  OR (r.room_type = 'CLINICAL_LAB' AND f.name IN ('nursing_equipment', 'specialized_equipment'))
  OR (r.room_type = 'AUDITORIUM' AND f.name IN ('projector', 'audio_visual', 'wheelchair_access'))
  OR (r.room_type = 'ONLINE' AND f.name IN ('projector'))
WHERE r.status = 'ACTIVE'
ON CONFLICT (room_id, feature_id) DO NOTHING;

-- =============================================
-- 4. SEED ACADEMIC DAYS (already in migration, but ensure)
-- =============================================

INSERT INTO public.academic_days (day_of_week, name, abbreviation, is_teaching_day) VALUES
  (0, 'Sunday', 'Sun', false),
  (1, 'Monday', 'Mon', true),
  (2, 'Tuesday', 'Tue', true),
  (3, 'Wednesday', 'Wed', true),
  (4, 'Thursday', 'Thu', true),
  (5, 'Friday', 'Fri', true),
  (6, 'Saturday', 'Sat', false)
ON CONFLICT (day_of_week) DO UPDATE SET name = EXCLUDED.name, abbreviation = EXCLUDED.abbreviation;

-- =============================================
-- 5. SEED TIME SLOTS
-- =============================================

INSERT INTO public.time_slots (slot_index, day_of_week, start_time, end_time, slot_duration, is_break)
SELECT
  slot_idx,
  day_of_week,
  make_time(8 + (slot_idx / 2), (slot_idx % 2) * 30, 0),
  make_time(8 + ((slot_idx + 1) / 2), ((slot_idx + 1) % 2) * 30, 0),
  30,
  false
FROM generate_series(0, 17) AS slot_idx
CROSS JOIN (SELECT DISTINCT day_of_week FROM public.academic_days WHERE is_teaching_day = true) AS days
ON CONFLICT (day_of_week, slot_index) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time;

-- =============================================
-- 6. SEED HOLIDAYS (Canadian academic year 2026-2027)
-- =============================================

INSERT INTO public.holidays (name, start_date, end_date, block_type, affects_scheduling) VALUES
  ('Labour Day', '2026-09-07', '2026-09-07', 'HOLIDAY', true),
  ('Thanksgiving', '2026-10-12', '2026-10-12', 'HOLIDAY', true),
  ('Reading Week', '2026-11-02', '2026-11-06', 'SEMESTER_BREAK', true),
  ('Remembrance Day', '2026-11-11', '2026-11-11', 'HOLIDAY', true),
  ('Christmas Break', '2026-12-18', '2027-01-03', 'HOLIDAY', true),
  ('Family Day', '2027-02-15', '2027-02-15', 'HOLIDAY', true),
  ('Reading Week Winter', '2027-02-22', '2027-02-26', 'SEMESTER_BREAK', true),
  ('Good Friday', '2027-04-02', '2027-04-02', 'HOLIDAY', true),
  ('Easter Monday', '2027-04-05', '2027-04-05', 'HOLIDAY', true),
  ('Victoria Day', '2027-05-24', '2027-05-24', 'HOLIDAY', true),
  ('Canada Day', '2027-07-01', '2027-07-01', 'HOLIDAY', true),
  ('Civic Holiday', '2027-08-02', '2027-08-02', 'HOLIDAY', true)
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. SEED COURSE SECTIONS FROM EXISTING MODULES
-- =============================================

-- Create sections for each module in the active semester (Fall 2026)
-- We create 1-3 sections per module depending on expected enrollment

INSERT INTO public.course_sections (id, code, module_id, semester_id, instructor_id, capacity, enrolled_count, session_type, delivery_mode, required_room_type, required_features, duration_minutes, meetings_per_week, consecutive_sessions, max_daily_sessions, preferred_days, blocked_days, preferred_times, blocked_times, student_group_id, department_id, notes, status)
SELECT
  gen_random_uuid(),
  m.code || '-' || chr(65 + ((row_number() OVER (PARTITION BY m.id ORDER BY random()) - 1) % 3)::int),
  m.id,
  s.id,
  f.id,
  30 + (random() * 20)::int,
  20 + (random() * 15)::int,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 'LAB'
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 'CLINICAL'
    WHEN m.code ILIKE 'sem%' OR m.code ILIKE '%seminar%' THEN 'SEMINAR'
    ELSE 'LECTURE'
  END,
  'IN_PERSON',
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 'LAB'
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 'CLINICAL_LAB'
    WHEN m.code ILIKE 'comp%' OR m.code ILIKE '%computer%' THEN 'COMPUTER_LAB'
    ELSE 'LECTURE_ROOM'
  END,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN '["science_lab"]'::jsonb
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN '["nursing_equipment", "specialized_equipment"]'::jsonb
    WHEN m.code ILIKE 'comp%' OR m.code ILIKE '%computer%' THEN '["computers"]'::jsonb
    ELSE '[]'::jsonb
  END,
  60 + (random() * 60)::int,
  CASE 
    WHEN m.code ILIKE 'lab%' OR m.code ILIKE '%lab' THEN 2
    WHEN m.code ILIKE 'clin%' OR m.code ILIKE '%clinical%' THEN 2
    ELSE 1
  END,
  false,
  3,
  '{}',
  '{}',
  '{}',
  '{}',
  null,
  d.id,
  'Auto-generated section',
  'PENDING'
FROM modules m
JOIN semesters s ON s.name = 'Fall 2026' AND s.status IN ('ACTIVE', 'UPCOMING')
JOIN "Department" d ON d.id = m.department_id
LEFT JOIN "Faculty" f ON f."departmentId" = d.id
LIMIT 100
ON CONFLICT (module_id, semester_id, code) DO NOTHING;

-- =============================================
-- 8. SEED COURSE SECTION MEETINGS
-- =============================================

INSERT INTO public.course_section_meetings (id, section_id, meeting_index, day_of_week, start_time, end_time, duration_minutes, room_id, instructor_id, is_fixed)
SELECT
  gen_random_uuid(),
  cs.id,
  generate_series(0, (cs.meetings_per_week - 1)),
  (1 + (random() * 4)::int),
  make_time(8 + (random() * 8)::int, (random() * 2 = 0)::int * 30, 0),
  make_time(8 + (random() * 8)::int + 1, (random() * 2 = 0)::int * 30, 0),
  cs.duration_minutes,
  CASE WHEN cs.delivery_mode = 'ONLINE' THEN (SELECT id FROM public.rooms WHERE room_type = 'COMPUTER_LAB' ORDER BY random() LIMIT 1) ELSE (SELECT id FROM public.rooms WHERE room_type = 'LECTURE_ROOM' ORDER BY random() LIMIT 1) END,
  cs.instructor_id,
  false
FROM course_sections cs
WHERE cs.status = 'PENDING'
  AND cs.semester_id = (SELECT id FROM semesters WHERE name = 'Fall 2026' AND status IN ('ACTIVE', 'UPCOMING') LIMIT 1)
ON CONFLICT (section_id, meeting_index) DO NOTHING;

-- =============================================
-- 9. SEED STUDENT GROUPS
-- =============================================

INSERT INTO public.student_groups (id, name, code, description, program_id, department_id, cohort_year, semester, total_students, is_active)
SELECT
  gen_random_uuid(),
  c.title || ' - Year ' || y.year,
  c.slug || '-Y' || y.year,
  'Cohort for ' || c.title || ' Year ' || y.year,
  c.id,
  d.id,
  y.year,
  1,
  30,
  true
FROM "Course" c
JOIN "Department" d ON d.id = c."departmentId"
CROSS JOIN (VALUES (1), (2), (3), (4)) AS y(year)
WHERE NOT EXISTS (
  SELECT 1 FROM public.student_groups sg 
  WHERE sg.program_id = c.id AND sg.cohort_year = y.year
);

-- =============================================
-- 10. SEED COHORT MEMBERS
-- =============================================

INSERT INTO public.cohort_members (group_id, student_id)
SELECT sg.id, s.id
FROM public.student_groups sg
JOIN "Course" c ON c.id = sg.program_id
JOIN students s ON s.enrollment_status = 'ACTIVE'
WHERE s.program_id = c.id
  AND NOT EXISTS (
    SELECT 1 FROM public.cohort_members cm 
    WHERE cm.group_id = sg.id AND cm.student_id = s.id
  )
LIMIT 200;

-- =============================================
-- 11. SEED INSTRUCTOR AVAILABILITY
-- =============================================

INSERT INTO public.instructor_availability (instructor_id, day_of_week, start_time, end_time, availability_type, effective_date, expiry_date, notes)
SELECT
  f.id,
  d.day_of_week,
  make_time(9, 0, 0),
  make_time(17, 0, 0),
  'AVAILABLE',
  (SELECT start_date FROM semesters WHERE name = 'Fall 2026' AND status IN ('ACTIVE', 'UPCOMING') LIMIT 1),
  (SELECT end_date FROM semesters WHERE name = 'Fall 2026' AND status IN ('ACTIVE', 'UPCOMING') LIMIT 1),
  'Default availability'
FROM "Faculty" f
JOIN academic_days d ON d.is_teaching_day = true
WHERE NOT EXISTS (
    SELECT 1 FROM public.instructor_availability ia 
    WHERE ia.instructor_id = f.id AND ia.day_of_week = d.day_of_week
  );

-- =============================================
-- 12. UPDATE MODULE ENROLLMENTS TO HAVE STUDENTS IN SECTIONS
-- =============================================

UPDATE course_sections cs
SET enrolled_count = (
  SELECT count(*)
  FROM module_enrollments me
  WHERE me.module_id = cs.module_id
    AND me.semester_id = cs.semester_id
    AND me.status = 'REGISTERED'
)
WHERE cs.status = 'PENDING';
