const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, '..', 'src', 'app');

function scanDir(dir) {
    const results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results.push(...scanDir(fullPath));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('export const metadata') || content.includes('generateMetadata')) {
                    results.push(fullPath);
                }
            }
        }
    });
    return results;
}

const files = scanDir(srcAppDir);
console.log(`Found ${files.length} files with metadata:`);
files.forEach(f => {
    console.log(path.relative(srcAppDir, f));
});
