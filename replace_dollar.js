const fs = require('fs');
const path = require('path');

const adminDir = 'src/app/admin';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/\$(?!\{)/g, '$');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir(adminDir);
