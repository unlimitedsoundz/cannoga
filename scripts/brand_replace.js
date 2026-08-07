const fs = require('fs');
const path = require('path');
const exts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx', '.html', '.ejs', '.sql'];
const root = path.resolve(__dirname, '..');
const ignoreDirs = new Set(['node_modules', '.git', '.next', '.kilo', 'out', 'dist', 'build', 'public', 'blog-app', 'ckeditor-demos', 'ckeditor5-demos']);
const replacements = [
  ['Cannoga College', 'Cannoga College'],
  ['Cannoga college', 'Cannoga college'],
  ['Cannoga', 'Cannoga'],
  ['Cannoga College', 'Cannoga College'],
  ['Cannoga', 'Cannoga'],
  ['Ottawa, Ontario, Canada', 'Ottawa, Ontario, Canada'],
  ['Ottawa, Ontario, Canada.', 'Ottawa, Ontario, Canada.'],
  ['Ottawa campus', 'Ottawa campus'],
  ['Ottawa campus', 'Ottawa campus'],
  ['Ottawa', 'Ottawa'],
  ['Canada', 'Canada'],
  ['Canadian', 'Canadian'],
  ['CAD', 'CAD'],
  ['$', '$'],
  ['cannogacollege.ca', 'cannogacollege.ca'],
  ['Cannoga.online', 'Cannogacollege.ca'],
  ['https://cannogacollege.ca', 'https://cannogacollege.ca'],
  ['http://cannogacollege.ca', 'https://cannogacollege.ca'],
  ['www.cannogacollege.ca', 'www.cannogacollege.ca'],
  ['@cannogacollege.ca', '@cannogacollege.ca'],
  ['admissions@cannogacollege.ca', 'admissions@cannogacollege.ca'],
  ['student@cannogacollege.ca', 'student@cannogacollege.ca'],
  ['admin@cannogacollege.ca', 'admin@cannogacollege.ca'],
  ['info@cannogacollege.ca', 'info@cannogacollege.ca'],
  ['support@cannogacollege.ca', 'support@cannogacollege.ca'],
  ['news@cannogacollege.ca', 'news@cannogacollege.ca'],
  ['docs@cannogacollege.ca', 'docs@cannogacollege.ca'],
  ['blog.cannogacollege.ca', 'blog.cannogacollege.ca'],
  ['ourblogs.cannogacollege.ca', 'ourblogs.cannogacollege.ca'],
  ['Cannoga College Blog', 'Cannoga College Blog'],
  ['Cannoga College Student Ambassadors', 'Cannoga College Student Ambassadors'],
  ['Cannoga College Ottawa campus', 'Cannoga College Ottawa Campus'],
  ['81 Montreal Rd', '81 Montreal Rd'],
  ['K1L 6E8', 'K1L 6E8'],
  ['Ontario', 'Ontario'],
  ['CA', 'CA'],
  ['Canadian study permit', 'Canadian study permit'],
  ['Canadian student study permit', 'Canadian study permit'],
  ['study permit', 'study permit'],
  ['Canada', 'Canada'],
  ['international', 'international'],
  ['Canadian government', 'Canadian authorities'],
  ['Canadian Ministry of Education', 'Ontario ministry or regional education authority'],
  ['Canadian Immigration Service', 'Immigration, Refugees and Citizenship Canada'],
  ['IRCC', 'IRCC'],
  ['study in Canada', 'study in Canada'],
  ['study in Ottawa', 'study in Ottawa'],
  ['Ottawa-based', 'Ottawa-based'],
  ['Canadian education', 'Canadian education'],
  ['Canadian university', 'Canadian college'],
  ['Canadian college', 'Canadian college']
];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (ignoreDirs.has(item.name)) continue;
    const filePath = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!exts.includes(path.extname(item.name))) continue;
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    replacements.forEach(([from, to]) => {
      updated = updated.split(from).join(to);
    });
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Updated', filePath);
    }
  }
}

walk(root);
console.log('Done');
