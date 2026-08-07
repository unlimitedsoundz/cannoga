const fs = require('fs');
const path = require('path');
const https = require('https');

const url = 'https://i.pinimg.com/736x/d9/15/7b/d9157bb1d537a1364fed0bbbe8eaa30b.jpg';
const dest = path.join(__dirname, '..', 'public', 'images', 'student-guide-academic-guidance.jpg');

const file = fs.createWriteStream(dest);

console.log('Downloading image from:', url);
https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Request Failed. Status Code: ${response.statusCode}`);
        return;
    }
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Image download completed successfully and saved to:', dest);
    });
}).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Error downloading image:', err.message);
});
