const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\eltig\\OneDrive\\Documents\\heffringcollege';

const replacements = [
    { search: /Suomen ympäristöopisto SYKLI/g, replace: 'Cannoga College' },
    { search: /Environmental College/g, replace: 'Independent higher education institution' },
    { search: /SYKLI College/g, replace: 'Cannoga College' },
    { search: /Sykli College/g, replace: 'Cannoga College' },
    { search: /SKYLl College/g, replace: 'Cannoga College' },
    { search: /syklicollege\.fi/g, replace: 'cannogacollege.ca' },
    { search: /syklicollege/g, replace: 'heffring' },
    { search: /SYKLI/g, replace: 'Cannoga' },
    { search: /Sykli/g, replace: 'Cannoga' },
    { search: /SKYLl/g, replace: 'Cannoga' },
    { search: /sykli\.fi/g, replace: 'cannogacollege.ca' },
    { search: /sykli/g, replace: 'heffring' },
    { search: /College/g, replace: 'University' },
    { search: /college/g, replace: 'university' },
];

function processDirectory(directory) {
    let files;
    try {
        files = fs.readdirSync(directory);
    } catch (e) {
        return;
    }

    for (const file of files) {
        // Exclude git, node_modules, build outputs, media files, etc.
        if (
            file === 'node_modules' ||
            file === '.next' ||
            file === '.git' ||
            file === 'rebrand.js' ||
            file.endsWith('.png') ||
            file.endsWith('.jpg') ||
            file.endsWith('.jpeg') ||
            file.endsWith('.webp') ||
            file.endsWith('.mp4') ||
            file.endsWith('.pdf') ||
            file.endsWith('.svg') ||
            file.endsWith('.ico') ||
            file.endsWith('.ttf') ||
            file.endsWith('.woff') ||
            file.endsWith('.woff2') ||
            file.endsWith('.eot') ||
            file.startsWith('build_') ||
            file.endsWith('.log') ||
            file === 'package-lock.json'
        ) continue;

        const fullPath = path.join(directory, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) {
            continue;
        }

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content;

                for (const { search, replace } of replacements) {
                    newContent = newContent.replace(search, replace);
                }

                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            } catch (e) {
                // file might be binary or unreadable
            }
        }
    }
}

console.log('Starting global replacement...');
processDirectory(dir);
console.log('Finished global replacement.');
