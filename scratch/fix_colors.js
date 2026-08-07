const fs = require('fs');
const path = require('path');

const root = 'E:\\Cannogacollege\\src';

function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(escaped, 'g'), replace);
    }
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error processing ' + filePath + ':', e.message);
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
    } else if (stat && !stat.isDirectory() && /\.(ts|tsx|js|jsx|css)$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

const files = walk(root);
console.log('Found ' + files.length + ' files');

let changed = 0;

for (const file of files) {
  const replacements = [];
  
  // Change neutral colors (replaced from emerald earlier) back to purple
  replacements.push(['neutral-100', 'purple-100']);
  replacements.push(['neutral-600', 'purple-600']);
  replacements.push(['neutral-700', 'purple-700']);
  replacements.push(['neutral-800', 'purple-800']);
  replacements.push(['neutral-50', 'purple-50']);
  replacements.push(['neutral-950', 'purple-950']);
  replacements.push(['neutral-400', 'purple-400']);
  replacements.push(['neutral-500', 'purple-500']);
  replacements.push(['neutral-300', 'purple-300']);
  replacements.push(['neutral-200', 'purple-200']);
  replacements.push(['neutral-900', 'purple-900']);
  
  // Purple text colors to black
  replacements.push(['text-purple-200', 'text-black']);
  replacements.push(['text-purple-300', 'text-black']);
  replacements.push(['text-purple-400', 'text-black']);
  replacements.push(['text-purple-500', 'text-black']);
  replacements.push(['text-purple-600', 'text-black']);
  replacements.push(['text-purple-700', 'text-black']);
  replacements.push(['text-purple-800', 'text-black']);
  replacements.push(['text-purple-900', 'text-black']);
  replacements.push(['text-purple-100', 'text-black']);
  replacements.push(['text-purple-50', 'text-black']);
  
  // Purple borders to black if they are font/border colors
  replacements.push(['border-purple-200', 'border-black']);
  replacements.push(['border-purple-300', 'border-black']);
  replacements.push(['border-purple-400', 'border-black']);
  replacements.push(['border-purple-500', 'border-black']);
  replacements.push(['border-purple-600', 'border-black']);
  replacements.push(['border-purple-700', 'border-black']);
  replacements.push(['border-purple-800', 'border-black']);
  replacements.push(['border-purple-900', 'border-black']);
  replacements.push(['border-purple-100', 'border-black']);
  replacements.push(['border-purple-50', 'border-black']);
  
  // Purple backgrounds for buttons/accents to stay purple but text black
  // bg-purple-600 with white text -> keep purple bg but black text
  replacements.push(['bg-purple-600', 'bg-purple-600']);
  replacements.push(['bg-purple-700', 'bg-purple-700']);
  replacements.push(['bg-purple-500', 'bg-purple-500']);
  replacements.push(['bg-purple-100', 'bg-purple-100']);
  replacements.push(['bg-purple-50', 'bg-purple-50']);
  
  if (replaceInFile(file, replacements)) {
    changed++;
    console.log('Updated: ' + path.relative(root, file));
  }
}

console.log('\nTotal files changed: ' + changed);
