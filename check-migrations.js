const { execSync } = require('child_process');

const output = execSync('npx supabase migration list', { encoding: 'utf8' });
const lines = output.split('\n');

const localVersions = new Set();
const remoteVersions = new Set();

for (const line of lines) {
  const matches = line.match(/`([^`]+)`/g);
  if (matches && matches.length >= 2) {
    const v1 = matches[0].replace(/`/g, '').trim();
    const v2 = matches[1].replace(/`/g, '').trim();
    if (v1) localVersions.add(v1);
    if (v2) remoteVersions.add(v2);
  }
}

const missingInLocal = [...remoteVersions].filter(v => !localVersions.has(v));
const missingInRemote = [...localVersions].filter(v => !remoteVersions.has(v));

console.log('Local count:', localVersions.size);
console.log('Remote count:', remoteVersions.size);
console.log('Missing in local (remote-only):', missingInLocal.length);
console.log('Missing in remote (local-only):', missingInRemote.length);
console.log('First 20 remote-only:', missingInLocal.slice(0, 20));
