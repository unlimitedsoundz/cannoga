const fs = require('fs');
const path = 'src/app/site-index/page.tsx';
let content = fs.readFileSync(path, 'utf8');
let newContent = content.replace(/Ottawa/g, 'Ottawa');
if (newContent !== content) {
  fs.writeFileSync(path, newContent, 'utf8');
  console.log('Updated');
} else {
  console.log('No changes');
}
