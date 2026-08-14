import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = ['src/app/**/*.tsx', 'src/components/**/*.tsx'];

async function main() {
  const paths = await glob(files);
  
  for (const filePath of paths) {
    let content = readFileSync(filePath, 'utf-8');
    const original = content;
    
    // Replace grey text colors with black
    content = content.replace(/text-neutral-600/g, 'text-black');
    content = content.replace(/text-neutral-500/g, 'text-black');
    content = content.replace(/text-neutral-400/g, 'text-black');
    
    if (content !== original) {
      writeFileSync(filePath, content);
      console.log(`Updated: ${filePath}`);
    }
  }
  
  console.log('\nDone.');
}

main();
