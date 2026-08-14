const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../blog-app/public/css/output.css');
if (!fs.existsSync(cssPath)) {
  console.error('File not found:', cssPath);
  process.exit(1);
}

const content = fs.readFileSync(cssPath, 'utf8');

const classes = ['pt-20', 'max-w-7xl', 'bg-white', 'w-full', 'fixed', 'z-50'];
classes.forEach(cls => {
  const present = content.includes(cls);
  console.log(`Class "${cls}" present: ${present}`);
});
