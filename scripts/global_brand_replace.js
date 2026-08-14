const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const includeExt = new Set(['.ts','.tsx','.js','.jsx','.json','.md','.mdx','.sql','.html','.css','.scss','.txt']);
const excludeDirs = new Set(['.git','.next','.kilo','node_modules','public/images','public/css','supabase/.temp']);

const replacements = [
  // domain and branding
  ['https://www.cannogacollege.ca', 'https://www.cannogacollege.ca'],
  ['https://cannogacollege.ca', 'https://cannogacollege.ca'],
  ['cannogacollege.ca', 'cannogacollege.ca'],
  ['@cannogacollege.ca', '@cannogacollege.ca'],
  ['Cannoga College', 'Cannoga College'],
  ['Cannoga college', 'Cannoga College'],
  ['Cannoga', 'Cannoga'],
  ['heffring', 'cannoga'],
  ['Cannoga College', 'Cannoga College'],
  ['Cannoga College', 'Cannoga College'],
  ['Cannoga', 'Cannoga'],
  ['Ottawa', 'Ottawa'],
  ['Ottawa, Ontario, Canada', 'Ottawa, Ontario'],
  ['Canada', 'Canada'],
  ['Canadian', 'Canadian'],
  ['CAD', 'CAD'],
  ['$', '$'],
  ['Otaniemi Campus', 'Ottawa Campus'],
  ['81 Montreal Rd', '81 Montreal Rd'],
  ['K1L 6E8 Ottawa', 'K1L 6E8'],
  ['Ontario', 'Ontario'],
  ['Canadian study permit', 'Canadian study permit'],
  ['Canadian student study permit', 'Canadian study permit'],
  ['Canadian study permit', 'Canadian study permit'],
  ['Canadian Immigration Service', 'Immigration, Refugees and Citizenship Canada'],
  ['IRCC', 'IRCC'],
  ['student study permit', 'study permit'],
  ['study permit', 'study permit'],
  ['study permit application', 'study permit application'],
  ['DLI', 'DLI'],
  ['Eu/EEA', 'Canada']
];

function shouldExclude(dir) {
  return excludeDirs.has(path.basename(dir));
}

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (shouldExclude(full)) continue;
      results.push(...walk(full));
    } else if (entry.isFile()) {
      if (includeExt.has(path.extname(entry.name))) {
        results.push(full);
      }
    }
  }
  return results;
}

const files = walk(root).filter((file) => {
  const rel = path.relative(root, file);
  return !rel.startsWith('supabase/.temp');
});

let totalChanges = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let updated = content;
  replacements.forEach(([from, to]) => {
    updated = updated.split(from).join(to);
  });
  if (updated !== content) {
    totalChanges++;
    fs.writeFileSync(file, updated, 'utf8');
    console.log('Updated', file);
  }
}
console.log(`Finished. Files changed: ${totalChanges}`);
