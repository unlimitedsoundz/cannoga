const fs = require('fs');
let content = fs.readFileSync('src/components/programs/ProgramsAZTableView.tsx', 'utf8');

content = content.replace(/level:\s*'Certificate'\s*\|\s*'Diploma'\s*\|\s*'Advanced Diploma'\s*\|\s*'Bachelor'\s*\|\s*'Master'/g, "level: 'Certificate' | 'Diploma' | 'Advanced Diploma' | 'Bachelor'");
content = content.replace(/const levels = \['All', 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor', 'Master'\];/g, "const levels = ['All', 'Certificate', 'Diploma', 'Advanced Diploma', 'Bachelor'];");
content = content.replace(/level:\s*'Master',/g, "level: 'Advanced Diploma',\n        duration: '3 Years',\n        credits: 90,");
content = content.replace(/href:\s*'\/admissions\/master'/g, "href: '/admissions'");
content = content.replace(/p\.level === 'Master' \? '\$5,600\/yr'/g, "p.level === 'Advanced Diploma' ? '$5,600/yr'");
content = content.replace(/p\.level === 'Master' \? '\$9,600\/yr'/g, "p.level === 'Advanced Diploma' ? '$9,600/yr'");
content = content.replace(/item\.degreeLevel === 'MASTER' \? 'Master'/g, "(item.degreeLevel === 'MASTER' || item.degreeLevel === 'ADVANCED_DIPLOMA') ? 'Advanced Diploma'");
content = content.replace(/levelFormatted === 'Master' \? '\$5,600\/yr'/g, "levelFormatted === 'Advanced Diploma' ? '$5,600/yr'");
content = content.replace(/levelFormatted === 'Master' \? '\$9,600\/yr'/g, "levelFormatted === 'Advanced Diploma' ? '$9,600/yr'");
content = content.replace(/levelFormatted === 'Master' \|\| levelFormatted === 'Bachelor'/g, "levelFormatted === 'Advanced Diploma' || levelFormatted === 'Bachelor'");
content = content.replace(/levelFormatted === 'Master' \? 60/g, "levelFormatted === 'Advanced Diploma' ? 90");

fs.writeFileSync('src/components/programs/ProgramsAZTableView.tsx', content, 'utf8');
console.log('ProgramsAZTableView.tsx updated successfully.');
