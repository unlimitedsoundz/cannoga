const fs = require('fs');
const path = require('path');

const schoolFile = 'E:/heffringuniversity/out/schools/health-community/index.html';
const deptFile = 'E:/heffringuniversity/out/schools/health-community/health-community-dept/index.html';

const schoolHtml = fs.readFileSync(schoolFile, 'utf8');
const deptHtml = fs.readFileSync(deptFile, 'utf8');

console.log('=== SCHOOL PAGE (health-community) ===');
const schoolChecks = [
    'school-of-health',
    'Professor & Chair',
    'Professor &amp; Chair',
    'Dr. Emily Campbell',
    'Faculty',
    'No faculty listings available'
];
schoolChecks.forEach(term => {
    console.log(`${schoolHtml.includes(term) ? '✓' : '✗'} "${term}"`);
});

console.log('\n=== DEPARTMENT PAGE (health-community-dept) ===');
const deptChecks = [
    'school-of-health',
    'Professor & Chair',
    'Professor &amp; Chair',
    'Dr. Emily Campbell',
    'Faculty',
    'No faculty listings available'
];
deptChecks.forEach(term => {
    console.log(`${deptHtml.includes(term) ? '✓' : '✗'} "${term}"`);
});

console.log('\n--- Nursing context in school page ---');
const idx = schoolHtml.indexOf('Practical Nursing');
if (idx !== -1) {
    console.log(schoolHtml.substring(idx - 30, idx + 120));
} else {
    console.log('Not found');
}
