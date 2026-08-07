const fs = require('fs');
const path = require('path');

const root = 'E:\\Cannogacollege';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.') && file !== 'supabase' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (/\.(ts|tsx|js|jsx|css|json|md|sql|xml)$/.test(file)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// Files to check in the root
const rootFiles = [
  path.join(root, 'tailwind.config.ts'),
  path.join(root, 'next.config.mjs'),
  path.join(root, 'package.json'),
  path.join(root, 'README.md'),
  path.join(root, 'sitemap.xml'),
  path.join(root, 'test-invoice-email.js'),
];

// Walk the src directory
const srcFiles = walk(path.join(root, 'src'));
const allFiles = [...rootFiles, ...srcFiles];

console.log(`Found ${allFiles.length} files to check.`);

let changedCount = 0;

for (const filePath of allFiles) {
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace domain names
  content = content.replace(/cannogacollege\.ca/gi, 'cannogacollege.ca');
  content = content.replace(/heffring\.fi/gi, 'cannogacollege.ca');

  // 2. Perform color replacements
  
  // tailwind.config.ts
  if (filePath.endsWith('tailwind.config.ts')) {
    content = content.replace(/black:\s*["']#2e1150["']/g, 'black: "#000000"');
  }

  // src/app/innovation/page.tsx
  if (filePath.endsWith('src\\app\\innovation\\page.tsx') || filePath.endsWith('src/app/innovation/page.tsx')) {
    content = content.replace(/bg-indigo-900/g, 'bg-black');
    content = content.replace(/text-indigo-200/g, 'text-neutral-300');
    content = content.replace(/bg-indigo-100/g, 'bg-neutral-100');
    content = content.replace(/text-indigo-600/g, 'text-black');
    content = content.replace(/hover:text-indigo-800/g, 'hover:opacity-80');
  }

  // src/app/studies/[slug]/page.tsx
  if (filePath.endsWith('src\\app\\studies\\[slug]\\page.tsx') || filePath.endsWith('src/app/studies/[slug]/page.tsx')) {
    content = content.replace(/bg-indigo-950/g, 'bg-black');
  }

  // src/app/schools/[slug]/[dept_slug]/page.tsx
  if (filePath.endsWith('src\\app\\schools\\[slug]\\\\[dept_slug]\\page.tsx') || filePath.endsWith('src/app/schools/[slug]/[dept_slug]/page.tsx')) {
    content = content.replace(/#4f46e5/g, '#000000');
  }

  // src/app/admin/page.tsx
  if (filePath.endsWith('src\\app\\admin\\page.tsx') || filePath.endsWith('src/app/admin/page.tsx')) {
    content = content.replace(/color:\s*['"]bg-indigo-600['"]/g, "color: 'bg-neutral-800'");
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
    console.log(`Updated: ${path.relative(root, filePath)}`);
  }
}

console.log(`\nDone! Total files updated: ${changedCount}`);
