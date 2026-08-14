import fs from 'fs';

let sql = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');

// 1. Remove id column from rooms INSERT only
sql = sql.replace(
  'INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n',
  'INSERT INTO public.rooms (name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n'
);

// 2. Remove only the first column from rooms VALUES rows
const lines = sql.split('\n');
const newLines = [];
let inRoomsSection = false;

for (const line of lines) {
  if (line.includes('-- =============================================') && line.includes('SEED ROOMS')) {
    inRoomsSection = true;
    newLines.push(line);
    continue;
  }
  if (line.includes('-- =============================================') && line.includes('SEED ROOM FEATURES')) {
    inRoomsSection = false;
    newLines.push(line);
    continue;
  }
  
  if (inRoomsSection) {
    const trimmed = line.trim();
    // Match rooms data rows: start with spaces + (' + quoted id + comma
    if (trimmed.startsWith("('") && trimmed.includes("', '")) {
      // Remove the first quoted value (the id)
      newLines.push(line.replace(/\s*\('[^']*',\s*/, '  ('));
      continue;
    }
  }
  
  newLines.push(line);
}
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
const firstRoomLine = verify.split('\n').find(l => l.includes("Maple Commerce Hall"));
console.log('First room row:', firstRoomLine ? firstRoomLine.trim().substring(0, 120) : 'not found');
const roomFeaturesLine = verify.split('\n').find(l => l.includes("INSERT INTO public.room_features (id, name"));
console.log('Room features insert:', roomFeaturesLine ? roomFeaturesLine.trim() : 'not found');
const meetingLine = verify.match(/CASE WHEN cs\.delivery_mode[^\n]+/);
console.log('Meeting case:', meetingLine ? meetingLine[0] : 'not found');
