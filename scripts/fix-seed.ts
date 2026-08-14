import fs from 'fs';

let sql = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');

// 1. Remove id column from rooms INSERT only
sql = sql.replace(
  'INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n',
  'INSERT INTO public.rooms (name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n'
);

// 2. Remove only the first column from rooms VALUES rows
// Match lines that start with spaces and have a UUID-like id pattern in single quotes
const lines = sql.split('\n');
const inRoomsSection = { value: false };
const newLines = lines.map(line => {
  if (line.includes('-- =============================================') && line.includes('SEED ROOMS')) {
    inRoomsSection.value = true;
  } else if (line.includes('-- =============================================') && line.includes('SEED ROOM FEATURES')) {
    inRoomsSection.value = false;
  }
  
  if (inRoomsSection.value && line.trim().startsWith("('r") && line.includes("','")) {
    // Remove the first quoted UUID id from rooms rows
    return line.replace(/\('[^']*'\), /, '(');
  }
  return line;
});
sql = newLines.join('\n');

// 3. Fix course_section_meetings to use subqueries instead of hardcoded IDs
sql = sql.replace(
  "CASE WHEN cs.delivery_mode = 'ONLINE' THEN 'r012-1111-1111-1111' ELSE 'r001-1111-1111-1111' END,",
  "CASE WHEN cs.delivery_mode = 'ONLINE' THEN (SELECT id FROM public.rooms WHERE room_type = 'COMPUTER_LAB' ORDER BY random() LIMIT 1) ELSE (SELECT id FROM public.rooms WHERE room_type = 'LECTURE_ROOM' ORDER BY random() LIMIT 1) END,"
);

fs.writeFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', sql);
console.log('Fixed seed file');

// Verify
const verify = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');
const roomsInsert = verify.match(/INSERT INTO public\.rooms \([^)]+\)/);
console.log('Rooms insert:', roomsInsert ? roomsInsert[0] : 'not found');
const meetingLine = verify.match(/CASE WHEN cs\.delivery_mode[^\n]+/);
console.log('Meeting case:', meetingLine ? meetingLine[0] : 'not found');
