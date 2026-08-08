const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const output = execSync('npx supabase migration list', { encoding: 'utf8' });
const lines = output.split('\n');

const remoteVersions = new Set();

for (const line of lines) {
  const matches = line.match(/`([^`]+)`/g);
  if (matches && matches.length >= 2) {
    const v1 = matches[0].replace(/`/g, '').trim();
    const v2 = matches[1].replace(/`/g, '').trim();
    if (!v1 && v2) {
      remoteVersions.add(v2);
    }
  }
}

const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

for (const version of remoteVersions) {
  const filePath = path.join(migrationsDir, `${version}_placeholder.sql`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `-- Placeholder for remote migration ${version}\n-- This migration was applied remotely but the local file is missing.\n`);
  }
}

console.log(`Created ${remoteVersions.size} placeholder files`);
