import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicImagesDir = path.join(rootDir, 'public', 'images');
const srcDir = path.join(rootDir, 'src');

if (!fs.existsSync(publicImagesDir)) {
    console.log('No public/images directory found.');
    process.exit(0);
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return arrayOfFiles;
}

const allImages = getAllFiles(publicImagesDir);
const srcFiles = getAllFiles(srcDir);

// Also check configuration files in root if necessary
const rootFiles = [
    path.join(rootDir, 'next.config.mjs'),
    path.join(rootDir, 'tailwind.config.ts')
];

const allSourceFiles = [...srcFiles, ...rootFiles].filter(f => fs.existsSync(f));

console.log(`Found ${allImages.length} images and ${allSourceFiles.length} source files.`);

let sourceContent = '';
allSourceFiles.forEach(file => {
   sourceContent += fs.readFileSync(file, 'utf8');
});

// Also check for images referenced in database/config if available
// For now, only checking static references in code.

const unusedImages = allImages.filter(imagePath => {
    const fileName = path.basename(imagePath);
    const relativePath = path.relative(path.join(rootDir, 'public'), imagePath).replace(/\\/g, '/');
    
    // Check if relative path or filename is in source
    return !sourceContent.includes(relativePath) && !sourceContent.includes(fileName);
});

console.log(`Found ${unusedImages.length} unused images.`);

if (unusedImages.length > 0) {
    const backupDir = path.join(rootDir, 'unused_images_backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    unusedImages.forEach(imagePath => {
        const destPath = path.join(backupDir, path.relative(publicImagesDir, imagePath));
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        console.log(`Moving unused image: ${path.basename(imagePath)}`);
        fs.renameSync(imagePath, destPath);
    });
    console.log(`Unused images moved to ${backupDir}`);
} else {
    console.log('No unused images found.');
}
