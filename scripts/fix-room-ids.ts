import fs from 'fs';

let sql = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');

// Remove id from rooms INSERT
sql = sql.replace(
  'INSERT INTO public.rooms (id, name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n',
  'INSERT INTO public.rooms (name, building, floor, room_number, capacity, room_type, campus, accessibility, equipment, status, notes)\nVALUES\n'
);

// Remove id from each row (first column)
sql = sql.replace(/  \('[^']*', /g, '  (');

// Fix course_section_meetings to use subqueries instead of hardcoded IDs
sql = sql.replace(
  "CASE WHEN cs.delivery_mode = 'ONLINE' THEN 'TEC-014' ELSE 'BUS-001' END,",
  "CASE WHEN cs.delivery_mode = 'ONLINE' THEN (SELECT id FROM public.rooms WHERE room_type = 'COMPUTER_LAB' ORDER BY random() LIMIT 1) ELSE (SELECT id FROM public.rooms WHERE room_type = 'LECTURE_ROOM' ORDER BY random() LIMIT 1) END,"
);

fs.writeFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', sql);
console.log('Fixed room IDs');
