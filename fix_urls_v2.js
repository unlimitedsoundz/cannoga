const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'public', 'scripts'];
const extensions = ['.tsx', '.ts', '.md', '.json', '.js'];

function fixInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Fix image source paths /Cannoga-logo-official.png -> /Cannoga-logo-official.png
        content = content.replace(/\/images\/Cannoga/g, '/images/Cannoga');

        // 2. Fix external domains labs.Cannoga.edu -> labs.Cannoga.edu
        content = content.replace(/labs\.Cannoga\.edu/g, 'labs.Cannoga.edu');

        // 3. System-wide check for any href or item paths that might still be capitalized
        // Use regex to find internal absolute paths that are capitalized
        content = content.replace(/(href|item|url)="\/([^"]*Cannoga[^"]*)"/g, (match, prefix, pathPart) => {
            return `${prefix}="/${pathPart.toLowerCase()}"`;
        });

        // 4. Fix metadata base and schema urls specifically if not caught
        content = content.replace(/https:\/\/www\.Cannogauniversity\.fi/g, 'https://Cannoga.fi');
        content = content.replace(/https:\/\/Cannogauniversity\.fi/g, 'https://Cannoga.fi');

        // 5. Fix email addresses in mailto: or as text if they have Cannoga domain capitalized
        content = content.replace(/@Cannogauniversity\.fi/g, '@Cannoga.fi');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (extensions.includes(path.extname(fullPath))) {
            fixInFile(fullPath);
        }
    });
}

targetDirs.forEach(dir => {
    const absDir = path.resolve(__dirname, dir);
    if (fs.existsSync(absDir)) {
        walkDir(absDir);
    }
});

