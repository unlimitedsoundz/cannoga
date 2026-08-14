const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'public', 'images', '1780748337060-019e9cde-bddc-7eca-a0a3-03505e25bdb8.png');
const destPath = path.join(__dirname, '..', 'public', 'images', 'student-guide-master.png');

if (fs.existsSync(srcPath)) {
    console.log('Renaming Master image on disk...');
    try {
        fs.renameSync(srcPath, destPath);
        console.log('Successfully renamed to student-guide-master.png!');
    } catch (err) {
        console.error('Failed to rename file:', err);
    }
} else {
    console.log(`Source file not found at: ${srcPath}`);
}
