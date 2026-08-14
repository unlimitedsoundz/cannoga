import fs from 'fs';

let sql = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');

// 1. Remove id column from rooms INSERT only
sql = sql.replace(
  'INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n',
  'INSERT INTO public.rooms (name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n'
);

// 2. Remove only the first column from rooms VALUES rows
// Match any row that starts with a quoted string followed by comma (rooms data pattern)
const lines = sql.split('\n');
const newLines = lines.map(line => {
  // Match rows in rooms VALUES section: starts with spaces and ('SOMETHING',
  // We detect this by checking if the line starts with spaces + quote + has multiple quoted values
  const trimmed = line.trim();
  if (trimmed.startsWith("('") && trimmed.includes("', '") && !trimmed.startsWith("('0") && !trimmed.startsWith("('1")) {
    // This is a rooms data row - remove the first quoted value (the id)
    return line.replace(/\s*\('[^']*',\s*/, '  (');
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
const firstRoomLine = verify.split('\n').find(l => l.includes("Maple Commerce Hall"));
console.log('First room row:', firstRoomLine ? firstRoomLine.trim().substring(0, 120) : 'not found');
const secondRoomLine = verify.split('\n').find(l => l.includes("Cedar Business Theatre"));
console.log('Second room row:', secondRoomLine ? secondRoomLine.trim().substring(0, 120) : 'not found');
const meetingLine = verify.match(/CASE WHEN cs\.delivery_mode[^\n]+/);
console.log('Meeting case:', meetingLine ? meetingLine[0] : 'not found');
