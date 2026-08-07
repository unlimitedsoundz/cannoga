const fs = require('fs');
const path = require('path');

const migrationsDir = 'D:/cannogauniversity/supabase/migrations';
const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql') && f.match(/^\d{14}_/));

for (const file of files) {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix CREATE POLICY lines
  const policyRegex = /CREATE POLICY "([^"]+)" ON (\S+) (.+)$/gm;
  content = content.replace(policyRegex, (match, name, table, rest) => {
    modified = true;
    return `DROP POLICY IF EXISTS "${name}" ON ${table};\nCREATE POLICY "${name}" ON ${table} ${rest}`;
  });

  // Fix CREATE TRIGGER lines
  const triggerRegex = /CREATE TRIGGER "([^"]+)"$/gm;
  content = content.replace(triggerRegex, (match, name) => {
    modified = true;
    return `DROP TRIGGER IF EXISTS "${name}";\nCREATE TRIGGER "${name}"`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  }
}
