const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'public', 'images', '1780747446746-019e9cd0-7d46-785d-9132-9ed99a77ee01.png');
const destPath = path.join(__dirname, '..', 'public', 'images', 'student-guide-cover.png');

if (fs.existsSync(srcPath)) {
    console.log('Renaming student guide hero image on disk...');
    try {
        fs.renameSync(srcPath, destPath);
        console.log('Successfully renamed to student-guide-cover.png!');
    } catch (err) {
        console.error('Failed to rename file:', err);
    }
} else {
    console.log(`Source file not found at: ${srcPath}`);
}
