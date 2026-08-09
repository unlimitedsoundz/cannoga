const line = "  ('r001-1111-1111-1111', 'Lecture Hall A', 'Main Building', '1', '101', 120, 'LECTURE_ROOM', 'MAIN', true, '{\"projector\": true}', 'ACTIVE', 'Large lecture hall'),";
console.log('Original:', line);
console.log('Starts with (r:', line.trim().startsWith("('r"));
console.log('Contains comma-quote:', line.includes("','"));
const result = line.replace(/\s*\('[^']*',\s*/, '  (');
console.log('Result:', result);
