import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

function loadEnvFile(path: string): Record<string, string> {
  const content = readFileSync(path, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join('=').trim();
    }
  }
  return env;
}

const env = loadEnvFile(join(process.cwd(), '.env.local'));
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('Starting timetable data seeding...');

  // 1. Get active semester or use any available
  let { data: semesters, error: semError } = await supabase
    .from('semesters')
    .select('id, name, start_date, end_date')
    .eq('status', 'ACTIVE')
    .limit(1);

  if ((semError || !semesters || semesters.length === 0) && !semError) {
    const { data: allSemesters } = await supabase
      .from('semesters')
      .select('id, name, start_date, end_date')
      .order('start_date', { ascending: false })
      .limit(1);
    
    if (allSemesters && allSemesters.length > 0) {
      semesters = allSemesters;
      // Update to ACTIVE
      await supabase.from('semesters').update({ status: 'ACTIVE' }).eq('id', allSemesters[0].id);
      console.log(`  Updated semester ${allSemesters[0].name} to ACTIVE`);
    }
  }

  if (semError || !semesters || semesters.length === 0) {
    console.error('No semester found:', semError);
    process.exit(1);
  }

  const semester = semesters[0];
  console.log(`Using semester: ${semester.name} (${semester.id})`);

  // 2. Seed rooms
  console.log('Seeding rooms...');
  const rooms = [
    { id: 'r001-1111-1111-1111', name: 'Lecture Hall A', building: 'Main Building', floor: '1', room_number: '101', capacity: 120, room_type: 'LECTURE_ROOM', campus: 'MAIN', accessibility: true, equipment: { projector: true, smart_board: true, audio_visual: true }, status: 'ACTIVE', notes: 'Large lecture hall' },
    { id: 'r002-1111-1111-1111', name: 'Lecture Hall B', building: 'Main Building', floor: '1', room_number: '102', capacity: 120, room_type: 'LECTURE_ROOM', campus: 'MAIN', accessibility: true, equipment: { projector: true, smart_board: true, audio_visual: true }, status: 'ACTIVE', notes: 'Large lecture hall' },
    { id: 'r003-1111-1111-1111', name: 'Seminar Room 1', building: 'Main Building', floor: '2', room_number: '201', capacity: 30, room_type: 'SEMINAR_ROOM', campus: 'MAIN', accessibility: true, equipment: { projector: true }, status: 'ACTIVE', notes: 'Seminar room' },
    { id: 'r004-1111-1111-1111', name: 'Seminar Room 2', building: 'Main Building', floor: '2', room_number: '202', capacity: 30, room_type: 'SEMINAR_ROOM', campus: 'MAIN', accessibility: true, equipment: { projector: true }, status: 'ACTIVE', notes: 'Seminar room' },
    { id: 'r005-1111-1111-1111', name: 'Computer Lab 1', building: 'Technology Building', floor: '1', room_number: '101', capacity: 40, room_type: 'COMPUTER_LAB', campus: 'MAIN', accessibility: true, equipment: { computers: true, projector: true }, status: 'ACTIVE', notes: 'Computer lab with 40 workstations' },
    { id: 'r006-1111-1111-1111', name: 'Computer Lab 2', building: 'Technology Building', floor: '1', room_number: '102', capacity: 40, room_type: 'COMPUTER_LAB', campus: 'MAIN', accessibility: true, equipment: { computers: true, projector: true }, status: 'ACTIVE', notes: 'Computer lab with 40 workstations' },
    { id: 'r007-1111-1111-1111', name: 'Science Lab 1', building: 'Science Building', floor: '1', room_number: '101', capacity: 35, room_type: 'SCIENCE_LAB', campus: 'MAIN', accessibility: true, equipment: { science_lab: true, projector: true }, status: 'ACTIVE', notes: 'General science lab' },
    { id: 'r008-1111-1111-1111', name: 'Science Lab 2', building: 'Science Building', floor: '1', room_number: '102', capacity: 35, room_type: 'SCIENCE_LAB', campus: 'MAIN', accessibility: true, equipment: { science_lab: true, projector: true }, status: 'ACTIVE', notes: 'General science lab' },
    { id: 'r009-1111-1111-1111', name: 'Clinical Lab 1', building: 'Health Sciences Building', floor: '1', room_number: '101', capacity: 25, room_type: 'CLINICAL_LAB', campus: 'MAIN', accessibility: true, equipment: { nursing_equipment: true, specialized_equipment: true }, status: 'ACTIVE', notes: 'Nursing clinical lab' },
    { id: 'r010-1111-1111-1111', name: 'Clinical Lab 2', building: 'Health Sciences Building', floor: '1', room_number: '102', capacity: 25, room_type: 'CLINICAL_LAB', campus: 'MAIN', accessibility: true, equipment: { nursing_equipment: true, specialized_equipment: true }, status: 'ACTIVE', notes: 'Nursing clinical lab' },
    { id: 'r011-1111-1111-1111', name: 'Auditorium', building: 'Main Building', floor: '1', room_number: 'Auditorium', capacity: 200, room_type: 'AUDITORIUM', campus: 'MAIN', accessibility: true, equipment: { projector: true, audio_visual: true, wheelchair_access: true }, status: 'ACTIVE', notes: 'Main auditorium' },
    { id: 'r012-1111-1111-1111', name: 'Online Room A', building: 'Virtual', floor: null, room_number: 'ONLINE-1', capacity: 50, room_type: 'ONLINE', campus: 'ONLINE', accessibility: true, equipment: {}, status: 'ACTIVE', notes: 'Virtual classroom' },
    { id: 'r013-1111-1111-1111', name: 'Lecture Hall C', building: 'Main Building', floor: '2', room_number: '203', capacity: 80, room_type: 'LECTURE_ROOM', campus: 'MAIN', accessibility: true, equipment: { projector: true }, status: 'ACTIVE', notes: 'Medium lecture hall' },
    { id: 'r014-1111-1111-1111', name: 'Lab 3', building: 'Science Building', floor: '2', room_number: '201', capacity: 30, room_type: 'LAB', campus: 'MAIN', accessibility: true, equipment: { science_lab: true }, status: 'ACTIVE', notes: 'Science lab' },
    { id: 'r015-1111-1111-1111', name: 'Tutorial Room 1', building: 'Main Building', floor: '3', room_number: '301', capacity: 20, room_type: 'SEMINAR_ROOM', campus: 'MAIN', accessibility: true, equipment: {}, status: 'ACTIVE', notes: 'Small tutorial room' },
  ];

  const { error: roomsError } = await supabase.from('rooms').upsert(rooms, { onConflict: 'id' });
  if (roomsError) throw roomsError;
  console.log(`  Inserted/updated ${rooms.length} rooms`);

  // 3. Seed room features
  console.log('Seeding room features...');
  const features = [
    { id: 'f001-1111-1111-1111', name: 'projector', description: 'Video projector', category: 'AV' },
    { id: 'f002-1111-1111-1111', name: 'smart_board', description: 'Interactive smart board', category: 'AV' },
    { id: 'f003-1111-1111-1111', name: 'computers', description: 'Desktop computers', category: 'COMPUTING' },
    { id: 'f004-1111-1111-1111', name: 'science_lab', description: 'Science lab equipment', category: 'SCIENCE' },
    { id: 'f005-1111-1111-1111', name: 'nursing_equipment', description: 'Nursing clinical equipment', category: 'MEDICAL' },
    { id: 'f006-1111-1111-1111', name: 'audio_visual', description: 'Audio visual system', category: 'AV' },
    { id: 'f007-1111-1111-1111', name: 'wheelchair_access', description: 'Wheelchair accessible', category: 'ACCESSIBILITY' },
    { id: 'f008-1111-1111-1111', name: 'specialized_equipment', description: 'Specialized equipment', category: 'GENERAL' },
  ];

  const { error: featuresError } = await supabase.from('room_features').upsert(features, { onConflict: 'name' });
  if (featuresError) throw featuresError;
  console.log(`  Inserted/updated ${features.length} room features`);

  // 4. Seed room feature assignments
  console.log('Seeding room feature assignments...');
  const featureAssignments = [];
  for (const room of rooms) {
    const roomType = room.room_type;
    let featureNames: string[] = [];
    if (roomType === 'LECTURE_ROOM' || roomType === 'AUDITORIUM') featureNames = ['projector', 'smart_board', 'audio_visual'];
    else if (roomType === 'COMPUTER_LAB') featureNames = ['computers', 'projector'];
    else if (roomType === 'SCIENCE_LAB' || roomType === 'LAB') featureNames = ['science_lab', 'projector'];
    else if (roomType === 'CLINICAL_LAB') featureNames = ['nursing_equipment', 'specialized_equipment'];
    else if (roomType === 'ONLINE') featureNames = ['projector'];

    for (const fname of featureNames) {
      const feature = features.find(f => f.name === fname);
      if (feature) {
        featureAssignments.push({ room_id: room.id, feature_id: feature.id, notes: 'Standard equipment' });
      }
    }
  }

  const { error: faError } = await supabase.from('room_feature_assignments').upsert(featureAssignments, { onConflict: 'room_id, feature_id' });
  if (faError) throw faError;
  console.log(`  Inserted/updated ${featureAssignments.length} room feature assignments`);

  // 5. Seed academic days
  console.log('Seeding academic days...');
  const academicDays = [
    { day_of_week: 0, name: 'Sunday', abbreviation: 'Sun', is_teaching_day: false },
    { day_of_week: 1, name: 'Monday', abbreviation: 'Mon', is_teaching_day: true },
    { day_of_week: 2, name: 'Tuesday', abbreviation: 'Tue', is_teaching_day: true },
    { day_of_week: 3, name: 'Wednesday', abbreviation: 'Wed', is_teaching_day: true },
    { day_of_week: 4, name: 'Thursday', abbreviation: 'Thu', is_teaching_day: true },
    { day_of_week: 5, name: 'Friday', abbreviation: 'Fri', is_teaching_day: true },
    { day_of_week: 6, name: 'Saturday', abbreviation: 'Sat', is_teaching_day: false },
  ];

  const { error: daysError } = await supabase.from('academic_days').upsert(academicDays, { onConflict: 'day_of_week' });
  if (daysError) throw daysError;
  console.log(`  Inserted/updated ${academicDays.length} academic days`);

  // 6. Seed time slots
  console.log('Seeding time slots...');
  const timeSlots = [];
  for (let slotIdx = 0; slotIdx < 18; slotIdx++) {
    const startHour = 8 + Math.floor(slotIdx / 2);
    const startMin = (slotIdx % 2) * 30;
    const endHour = 8 + Math.floor((slotIdx + 1) / 2);
    const endMin = ((slotIdx + 1) % 2) * 30;
    timeSlots.push({
      slot_index: slotIdx,
      day_of_week: 1,
      start_time: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
      end_time: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
      slot_duration: 30,
      is_break: false,
    });
  }

  const { error: slotsError } = await supabase.from('time_slots').upsert(timeSlots, { onConflict: 'day_of_week, slot_index' });
  if (slotsError) throw slotsError;
  console.log(`  Inserted/updated ${timeSlots.length} time slots`);

  // 7. Seed holidays
  console.log('Seeding holidays...');
  const holidays = [
    { name: 'Labour Day', start_date: '2026-09-07', end_date: '2026-09-07', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Thanksgiving', start_date: '2026-10-12', end_date: '2026-10-12', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Reading Week', start_date: '2026-11-02', end_date: '2026-11-06', block_type: 'SEMESTER_BREAK', affects_scheduling: true },
    { name: 'Remembrance Day', start_date: '2026-11-11', end_date: '2026-11-11', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Christmas Break', start_date: '2026-12-18', end_date: '2027-01-03', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Family Day', start_date: '2027-02-15', end_date: '2027-02-15', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Reading Week Winter', start_date: '2027-02-22', end_date: '2027-02-26', block_type: 'SEMESTER_BREAK', affects_scheduling: true },
    { name: 'Good Friday', start_date: '2027-04-02', end_date: '2027-04-02', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Easter Monday', start_date: '2027-04-05', end_date: '2027-04-05', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Victoria Day', start_date: '2027-05-24', end_date: '2027-05-24', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Canada Day', start_date: '2027-07-01', end_date: '2027-07-01', block_type: 'HOLIDAY', affects_scheduling: true },
    { name: 'Civic Holiday', start_date: '2027-08-02', end_date: '2027-08-02', block_type: 'HOLIDAY', affects_scheduling: true },
  ];

  const { error: holidaysError } = await supabase.from('holidays').upsert(holidays, { onConflict: 'name' });
  if (holidaysError) throw holidaysError;
  console.log(`  Inserted/updated ${holidays.length} holidays`);

  // 8. Seed student groups
  console.log('Seeding student groups...');
  const { data: programs, error: programsError } = await supabase.from('Course').select('id, title, code, departmentId');
  if (programsError) throw programsError;

  const { data: departments } = await supabase.from('Department').select('id');

  const studentGroups = [];
  for (const program of programs || []) {
    for (let year = 1; year <= 4; year++) {
      studentGroups.push({
        name: `${program.title} - Year ${year}`,
        code: `${program.code}-Y${year}`,
        description: `Cohort for ${program.title} Year ${year}`,
        program_id: program.id,
        department_id: program.departmentId,
        cohort_year: year,
        semester: 1,
        total_students: 30,
        is_active: true,
      });
    }
  }

  const { error: groupsError } = await supabase.from('student_groups').upsert(studentGroups, { onConflict: 'code' });
  if (groupsError) throw groupsError;
  console.log(`  Inserted/updated ${studentGroups.length} student groups`);

  // 9. Seed cohort members
  console.log('Seeding cohort members...');
  const { data: students, error: studentsError } = await supabase.from('students').select('id, program_id').eq('enrollment_status', 'ACTIVE').limit(200);
  if (studentsError) throw studentsError;

  const { data: groups } = await supabase.from('student_groups').select('id, program_id');
  const cohortMembers = [];
  for (const student of students || []) {
    const group = groups?.find(g => g.program_id === student.program_id);
    if (group) {
      cohortMembers.push({ group_id: group.id, student_id: student.id });
    }
  }

  if (cohortMembers.length > 0) {
    const { error: cmError } = await supabase.from('cohort_members').upsert(cohortMembers, { onConflict: 'group_id, student_id' });
    if (cmError) throw cmError;
    console.log(`  Inserted/updated ${cohortMembers.length} cohort members`);
  }

  // 10. Seed instructor availability
  console.log('Seeding instructor availability...');
  const { data: instructors, error: instructorsError } = await supabase.from('profiles').select('id').eq('role', 'INSTRUCTOR');
  if (instructorsError) throw instructorsError;

  const instructorAvailability = [];
  for (const instructor of instructors || []) {
    for (let day = 1; day <= 5; day++) {
      instructorAvailability.push({
        instructor_id: instructor.id,
        day_of_week: day,
        start_time: '09:00',
        end_time: '17:00',
        availability_type: 'AVAILABLE',
        effective_date: semester.start_date,
        expiry_date: semester.end_date,
        notes: 'Default availability',
      });
    }
  }

  if (instructorAvailability.length > 0) {
    const { error: iaError } = await supabase.from('instructor_availability').upsert(instructorAvailability, { onConflict: 'instructor_id, day_of_week' });
    if (iaError) throw iaError;
    console.log(`  Inserted/updated ${instructorAvailability.length} instructor availability slots`);
  }

  // 11. Seed course sections from existing modules
  console.log('Seeding course sections...');
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, code, title, credits, department_id')
    .limit(50);

  if (modulesError) throw modulesError;

  const sections = [];
  const sectionCodes = new Set();

  for (const module of modules || []) {
    const numSections = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1));
    for (let i = 0; i < numSections; i++) {
      const sectionCode = `${module.code}-${String.fromCharCode(65 + i)}`;
      if (sectionCodes.has(sectionCode)) continue;
      sectionCodes.add(sectionCode);

      const sessionType = module.code.toLowerCase().includes('lab') ? 'LAB' :
        module.code.toLowerCase().includes('clin') ? 'CLINICAL' :
        module.code.toLowerCase().includes('sem') ? 'SEMINAR' : 'LECTURE';

      const requiredRoomType = sessionType === 'LAB' ? 'LAB' :
        sessionType === 'CLINICAL' ? 'CLINICAL_LAB' :
        sessionType === 'SEMINAR' ? 'SEMINAR_ROOM' : 'LECTURE_ROOM';

      const requiredFeatures = sessionType === 'LAB' ? ['science_lab'] :
        sessionType === 'CLINICAL' ? ['nursing_equipment', 'specialized_equipment'] : [];

      sections.push({
        code: sectionCode,
        module_id: module.id,
        semester_id: semester.id,
        instructor_id: instructors?.[0]?.id || null,
        capacity: 30 + Math.floor(Math.random() * 20),
        enrolled_count: 20 + Math.floor(Math.random() * 15),
        session_type: sessionType,
        delivery_mode: 'IN_PERSON',
        required_room_type: requiredRoomType,
        required_features: requiredFeatures,
        duration_minutes: 60 + Math.floor(Math.random() * 60),
        meetings_per_week: sessionType === 'LAB' || sessionType === 'CLINICAL' ? 2 : 1,
        consecutive_sessions: false,
        max_daily_sessions: 3,
        preferred_days: [],
        blocked_days: [],
        preferred_times: [],
        blocked_times: [],
        student_group_id: null,
        department_id: module.department_id,
        notes: 'Auto-generated section',
        status: 'PENDING',
      });
    }
  }

  if (sections.length > 0) {
    const { error: sectionsError } = await supabase.from('course_sections').upsert(sections, { onConflict: 'module_id, semester_id, code' });
    if (sectionsError) throw sectionsError;
    console.log(`  Inserted/updated ${sections.length} course sections`);
  }

  // 12. Seed course section meetings
  console.log('Seeding course section meetings...');
  const { data: createdSections, error: csError } = await supabase
    .from('course_sections')
    .select('id, meetings_per_week, delivery_mode, instructor_id')
    .eq('semester_id', semester.id)
    .eq('status', 'PENDING');

  if (csError) throw csError;

  const meetings = [];
  for (const section of createdSections || []) {
    for (let i = 0; i < section.meetings_per_week; i++) {
      const dayOfWeek = 1 + Math.floor(Math.random() * 5);
      const startHour = 8 + Math.floor(Math.random() * 8);
      const startMin = Math.random() > 0.5 ? 0 : 30;
      const endHour = startHour + 1;
      const endMin = startMin;

      meetings.push({
        section_id: section.id,
        meeting_index: i,
        day_of_week: dayOfWeek,
        start_time: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
        end_time: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
        duration_minutes: 60,
        room_id: section.delivery_mode === 'ONLINE' ? 'r012-1111-1111-1111' : null,
        instructor_id: section.instructor_id,
        is_fixed: false,
      });
    }
  }

  if (meetings.length > 0) {
    const { error: meetingsError } = await supabase.from('course_section_meetings').upsert(meetings, { onConflict: 'section_id, meeting_index' });
    if (meetingsError) throw meetingsError;
    console.log(`  Inserted/updated ${meetings.length} course section meetings`);
  }

  // 13. Seed timetable constraints and preferences
  console.log('Seeding timetable constraints and preferences...');
  const constraints = [
    { name: 'instructor_no_double_booking', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Instructor cannot teach two classes simultaneously' },
    { name: 'room_no_double_booking', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Room cannot host two classes simultaneously' },
    { name: 'student_no_double_booking', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Student cannot be scheduled into two classes simultaneously' },
    { name: 'capacity_check', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Room capacity must be >= expected enrollment' },
    { name: 'room_type_match', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Required room type must match the course' },
    { name: 'room_features_match', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Required room equipment must exist' },
    { name: 'instructor_availability', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Instructor availability must be respected' },
    { name: 'room_availability', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Room availability must be respected' },
    { name: 'academic_term_match', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Academic term must match' },
    { name: 'holiday_block', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Holidays and blocked periods must not be used' },
    { name: 'consecutive_sessions', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Courses requiring consecutive blocks must receive consecutive blocks' },
    { name: 'clinical_room_match', constraint_type: 'HARD', is_enabled: true, weight: 1.0, description: 'Clinical/laboratory courses must receive appropriate rooms' },
    { name: 'prerequisite_sequence', constraint_type: 'SOFT', is_enabled: true, weight: 0.5, description: 'Prerequisites should not be scheduled in impossible sequences' },
    { name: 'student_gap_minimization', constraint_type: 'SOFT', is_enabled: true, weight: 0.3, description: 'Minimize student timetable gaps' },
    { name: 'instructor_gap_minimization', constraint_type: 'SOFT', is_enabled: true, weight: 0.3, description: 'Minimize instructor timetable gaps' },
    { name: 'building_change_minimization', constraint_type: 'SOFT', is_enabled: true, weight: 0.2, description: 'Minimize unnecessary building changes' },
    { name: 'room_utilization', constraint_type: 'SOFT', is_enabled: true, weight: 0.2, description: 'Maximize efficient room utilization' },
    { name: 'preferred_times', constraint_type: 'SOFT', is_enabled: true, weight: 0.1, description: 'Respect preferred times when available' },
  ];

  const { error: constraintsError } = await supabase.from('timetable_constraints').upsert(constraints, { onConflict: 'name' });
  if (constraintsError) throw constraintsError;
  console.log(`  Inserted/updated ${constraints.length} constraints`);

  const preferences = [
    { name: 'student_gap_weight', weight: 10.0, is_enabled: true, description: 'Minimize gaps between student classes' },
    { name: 'instructor_preference_weight', weight: 7.0, is_enabled: true, description: 'Respect instructor preferred times and days' },
    { name: 'room_utilization_weight', weight: 5.0, is_enabled: true, description: 'Optimize room utilization' },
    { name: 'building_change_weight', weight: 4.0, is_enabled: true, description: 'Minimize building changes for students' },
    { name: 'avoid_early_classes', weight: 3.0, is_enabled: true, description: 'Avoid very early morning classes' },
    { name: 'avoid_late_classes', weight: 3.0, is_enabled: true, description: 'Avoid very late afternoon classes' },
    { name: 'avoid_friday_afternoon', weight: 2.0, is_enabled: true, description: 'Avoid Friday late-afternoon classes' },
    { name: 'daily_balance', weight: 2.0, is_enabled: true, description: 'Distribute classes throughout the week' },
    { name: 'instructor_daily_balance', weight: 2.0, is_enabled: true, description: 'Avoid excessive teaching load on one day' },
    { name: 'cohort_grouping', weight: 1.0, is_enabled: true, description: 'Keep program cohorts together where practical' },
    { name: 'room_capacity_waste', weight: 1.0, is_enabled: true, description: 'Minimize room capacity waste' },
    { name: 'preferred_rooms', weight: 1.0, is_enabled: true, description: 'Prioritize preferred rooms' },
    { name: 'back_to_back', weight: 1.0, is_enabled: true, description: 'Minimize undesirable back-to-back classes' },
  ];

  const { error: prefsError } = await supabase.from('timetable_preferences').upsert(preferences, { onConflict: 'name' });
  if (prefsError) throw prefsError;
  console.log(`  Inserted/updated ${preferences.length} preferences`);

  // 14. Update section enrolled counts from module_enrollments
  console.log('Updating section enrolled counts...');
  const { data: updatedSections, error: updateError } = await supabase
    .from('course_sections')
    .select('id, module_id, semester_id')
    .eq('semester_id', semester.id)
    .eq('status', 'PENDING');

  if (updateError) throw updateError;

  for (const section of updatedSections || []) {
    const { count, error: countError } = await supabase
      .from('module_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', section.module_id)
      .eq('semester_id', section.semester_id)
      .eq('status', 'REGISTERED');

    if (!countError && count !== null) {
      await supabase.from('course_sections').update({ enrolled_count: count }).eq('id', section.id);
    }
  }
  console.log(`  Updated enrolled counts for ${updatedSections?.length || 0} sections`);

  console.log('\nSeeding completed successfully!');
  console.log('\nSummary:');
  console.log(`- Rooms: ${rooms.length}`);
  console.log(`- Room features: ${features.length}`);
  console.log(`- Room feature assignments: ${featureAssignments.length}`);
  console.log(`- Academic days: ${academicDays.length}`);
  console.log(`- Time slots: ${timeSlots.length}`);
  console.log(`- Holidays: ${holidays.length}`);
  console.log(`- Student groups: ${studentGroups.length}`);
  console.log(`- Cohort members: ${cohortMembers.length}`);
  console.log(`- Instructor availability slots: ${instructorAvailability.length}`);
  console.log(`- Course sections: ${sections.length}`);
  console.log(`- Course section meetings: ${meetings.length}`);
  console.log(`- Constraints: ${constraints.length}`);
  console.log(`- Preferences: ${preferences.length}`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
