const fs = require('fs');
const path = require('path');

const srcDir = 'D:/cannogauniversity/src/db';
const destDir = 'D:/cannogauniversity/supabase/migrations';

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.sql')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let seq = 5;
for (const file of files) {
  let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  
  // Add DROP POLICY IF EXISTS before CREATE POLICY
  const lines = content.split('\n');
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const policyMatch = line.match(/CREATE POLICY "([^"]+)" ON (\S+) (.+)/);
    if (policyMatch) {
      const [, name, table, rest] = policyMatch;
      newLines.push(`DROP POLICY IF EXISTS "${name}" ON ${table};`);
      newLines.push(`CREATE POLICY "${name}" ON ${table} ${rest};`);
    } else {
      newLines.push(line);
    }
  }
  content = newLines.join('\n');
  
  // Handle CREATE TYPE with DO blocks
  content = content.replace(
    /CREATE TYPE (\S+) AS ENUM \(([^)]+)\);/g,
    (match, typeName, values) => {
      return `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${typeName}') THEN CREATE TYPE ${typeName} AS ENUM (${values}); END IF; END $$;`;
    }
  );
  
  const timestamp = `20260806${String(seq).padStart(6, '0')}`;
  const newFileName = `${timestamp}_${file}`;
  fs.writeFileSync(path.join(destDir, newFileName), content);
  console.log(`${file} -> ${newFileName}`);
  seq++;
}
