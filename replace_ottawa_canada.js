const fs = require('fs');
const path = require('path');

const srcDir = 'src';

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    newContent = newContent.replace(/Ottawa/g, 'Ottawa');
    newContent = newContent.replace(/Canada/g, 'Canada');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next' && file !== 'out') {
      walkDir(filePath);
    } else if (/\.(tsx|ts|js|json|md)$/.test(filePath)) {
      replaceInFile(filePath);
    }
  }
}

walkDir(srcDir);
