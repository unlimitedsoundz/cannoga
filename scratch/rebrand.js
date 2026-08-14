const fs = require('fs');
const path = require('path');

const root = 'E:\\Cannogacollege';

function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (e) {
    console.error(`Error processing ${filePath}:`, e.message);
    return false;
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scratch' && file !== 'supabase') {
      results = results.concat(walk(filePath));
    } else if (stat && !stat.isDirectory() && /\.(ts|tsx|js|jsx|css|json|md)$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

const files = walk(root);
console.log(`Found ${files.length} files`);

let changed = 0;

for (const file of files) {
  const rel = path.relative(root, file);
  
  // Skip blog-app subdirectory
  if (rel.startsWith('blog-app\\')) continue;
  
  const replacements = [];
  
  // Brand name replacements
  replacements.push(['Cannoga College', 'Cannoga College']);
  
  // URL replacements
  replacements.push(['cannogacollege\\.ca', 'cannogacollege.ca']);
  replacements.push(['heffring\\.fi', 'cannogacollege.ca']);
  
  // Logo replacements
  replacements.push(['logo-cannoga\\.png', 'logo-heffring.png']);
  
  // Email replacements
  replacements.push(['info@cannogacollege\\.ca', 'info@cannogacollege.ca']);
  replacements.push(['admissions@cannogacollege\\.ca', 'admissions@cannogacollege.ca']);
  replacements.push(['admissions@heffring\\.fi', 'admissions@cannogacollege.ca']);
  
  // Address replacements
  replacements.push(['81 Montreal Rd', 'Kaarrostie 38']);
  replacements.push(['K1L 6E8 Ottawa, Ontario, Canada', '00960 Ottawa, Ontario']);
  replacements.push(['Ottawa, Ontario', 'Ottawa, Ontario, Canada']);
  replacements.push(['00960', 'K1L 6E8']);
  
  // Ottawa -> Ottawa (but preserve some specific cases)
  // We'll do a targeted replacement that avoids "Ottawa" in certain URLs
  replacements.push(['Cannoga College – Ottawa Campus', 'Cannoga College – Ottawa campus']);
  replacements.push(['Cannoga College Ottawa', 'Cannoga College Ottawa campus']);
  
  // Specific Ottawa -> Ottawa replacements
  replacements.push(['our Ottawa Campus', 'our Ottawa campus']);
  replacements.push(['Ottawa Campus', 'Ottawa campus']);
  replacements.push(['Ottawa Campus (Single Location)', 'Ottawa campus (Single Location)']);
  replacements.push(['Ottawa-area', 'Ottawa-area']);
  replacements.push(['Ottawa River', 'Vantaa River']);
  replacements.push(['Ottawa Community Housing', 'Ottawa Community Housing']);
  replacements.push(['city of Ottawa', 'city of Ottawa']);
  replacements.push(['Ottawa, Canada', 'Ottawa, Ontario, Canada']);
  replacements.push(['in Ottawa and Canada', 'in Ottawa and Canada']);
  replacements.push(['expanded Ottawa campus', 'expanded Ottawa campus']);
  replacements.push(['Ottawa, Canada resident enquiries', 'Ottawa, Ontario, Canada resident enquiries']);
  
  // In the scratch directory, keep original replacements but skip some aggressive ones
  const isScratch = rel.startsWith('scratch\\');
  
  if (replaceInFile(file, replacements)) {
    changed++;
    console.log(`Updated: ${rel}`);
  }
}

console.log(`\nTotal files changed: ${changed}`);

