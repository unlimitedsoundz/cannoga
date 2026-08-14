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
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
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
  
  // Purple colors to black
  replacements.push(['#5c2d91', '#000000']);
  replacements.push(['#2e1150', '#000000']);
  replacements.push(['#4a2475', '#000000']);
  replacements.push(['#efeaf7', '#f5f5f5']);
  replacements.push(['#f7f4fc', '#f5f5f5']);
  replacements.push(['#faf9ff', '#fafafa']);
  
  // Emerald colors to neutral
  replacements.push(['emerald-100', 'neutral-100']);
  replacements.push(['emerald-700', 'neutral-700']);
  replacements.push(['emerald-600', 'neutral-600']);
  replacements.push(['emerald-500', 'neutral-500']);
  replacements.push(['emerald-800', 'neutral-800']);
  replacements.push(['emerald-50', 'neutral-50']);
  replacements.push(['emerald-950', 'neutral-950']);
  
  // Purple text classes
  replacements.push(['text-purple-200', 'text-neutral-300']);
  replacements.push(['text-purple-300', 'text-neutral-400']);
  replacements.push(['text-purple-100', 'text-neutral-200']);
  
  if (replaceInFile(file, replacements)) {
    changed++;
    console.log('Updated: ' + path.relative(root, file));
  }
}

console.log('\nTotal files changed: ' + changed);
