import fs from 'fs';

const content = fs.readFileSync('supabase/migrations/20260810000004_seed_timetable_data.sql', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < Math.min(5, lines.length); i++) {
  const line = lines[i];
  const trimmed = line.trim();
  console.log(`Line ${i}: ${trimmed.substring(0, 80)}`);
  console.log(`  startsWith("('"): ${trimmed.startsWith("('")}`);
  console.log(`  includes("', '"): ${trimmed.includes("', '")}`);
  if (trimmed.startsWith("('") && trimmed.includes("', '")) {
    const replaced = line.replace(/\s*\('[^']*',\s*/, '  (');
    console.log(`  Replaced: ${replaced.trim().substring(0, 80)}`);
  }
}
