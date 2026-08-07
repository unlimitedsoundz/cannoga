const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, '..', 'src', 'app');

const files = [
    "about-heffring-university/page.tsx",
    "academic-regulations/page.tsx",
    "accessibility/page.tsx",
    "admissions/application-process/page.tsx",
    "admissions/bachelor/page.tsx",
    "admissions/contact-information/page.tsx",
    "admissions/master/page.tsx",
    "admissions/page.tsx",
    "admissions/requirements/page.tsx",
    "admissions/tuition/page.tsx",
    "admissions-policy/page.tsx",
    "alumni/page.tsx",
    "art/page.tsx",
    "careers/layout.tsx",
    "code-of-conduct/page.tsx",
    "collaboration/page.tsx",
    "contact/page.tsx",
    "cookies/layout.tsx",
    "cookies/page.tsx",
    "degree-programmes/page.tsx",
    "innovation/page.tsx",
    "international/page.tsx",
    "layout.tsx",
    "news/events/[slug]/page.tsx",
    "news/page.tsx",
    "news/why-study-in-ottawa-canada/page.tsx",
    "news/[slug]/page.tsx",
    "page.tsx",
    "privacy/page.tsx",
    "refund-withdrawal-policy/page.tsx",
    "research/page.tsx",
    "research/projects/page.tsx",
    "research/projects/[slug]/page.tsx",
    "research/publications/page.tsx",
    "schools/page.tsx",
    "schools/[slug]/page.tsx",
    "schools/[slug]/[dept_slug]/page.tsx",
    "site-index/page.tsx",
    "student-guide/arrival/page.tsx",
    "student-guide/bachelor/layout.tsx",
    "student-guide/bachelor/page.tsx",
    "student-guide/chat-with-heffring-students/page.tsx",
    "student-guide/exchange/layout.tsx",
    "student-guide/exchange/page.tsx",
    "student-guide/housing-for-students/page.tsx",
    "student-guide/international/page.tsx",
    "student-guide/layout.tsx",
    "student-guide/master/layout.tsx",
    "student-guide/master/page.tsx",
    "student-guide/page.tsx",
    "student-handbook/page.tsx",
    "student-life/cafe/page.tsx",
    "student-life/layout.tsx",
    "student-life/page.tsx",
    "studies/page.tsx",
    "studies/[slug]/page.tsx",
    "terms/layout.tsx",
    "terms/page.tsx"
];

const results = {};

files.forEach(relPath => {
    const fullPath = path.join(srcAppDir, relPath.replace(/\//g, path.sep));
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Let's grab the metadata block or generateMetadata function block
    // A simple regex approach or index searching
    let metadataBlock = "";
    if (content.includes('generateMetadata')) {
        const start = content.indexOf('generateMetadata');
        metadataBlock = content.substring(start, start + 800); // look at the next 800 chars
    } else {
        const start = content.indexOf('export const metadata');
        if (start !== -1) {
            metadataBlock = content.substring(start, start + 800);
        }
    }
    
    results[relPath] = metadataBlock;
});

fs.writeFileSync(path.join(__dirname, 'metadata_raw.json'), JSON.stringify(results, null, 2), 'utf8');
console.log("Raw metadata extracted to scratch/metadata_raw.json");
