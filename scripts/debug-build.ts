import fs from 'fs';

const converted = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');
const convertedRoomsEnd = converted.indexOf('ON CONFLICT (id) DO UPDATE SET');
const convertedRoomsSection = converted.substring(0, convertedRoomsEnd);

console.log('Converted rooms section length:', convertedRoomsSection.length);
console.log('First 200 chars:');
console.log(convertedRoomsSection.substring(0, 200));
console.log('\nLast 200 chars:');
console.log(convertedRoomsSection.substring(convertedRoomsSection.length - 200));
