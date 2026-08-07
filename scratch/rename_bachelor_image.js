const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'public', 'images', 'download (2).jpg');
const destPath = path.join(__dirname, '..', 'public', 'images', 'student-guide-bachelor.jpg');

if (fs.existsSync(srcPath)) {
    console.log('Renaming download (2).jpg on disk...');
    try {
        fs.renameSync(srcPath, destPath);
        console.log('Successfully renamed to student-guide-bachelor.jpg!');
    } catch (err) {
        console.error('Failed to rename file:', err);
    }
} else {
    console.log(`Source file not found at: ${srcPath}`);
}
