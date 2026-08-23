const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getAllFiles(filePath, exts, fileList);
      }
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = getAllFiles('D:/cannogauniversity/src', ['.tsx', '.ts', '.jsx', '.js']);

let modifiedCount = 0;
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Fix static href="..." and href='...'
  content = content.replace(/href=(["'])(\/[^"'\s]*)\1/g, (match, quote, url) => {
    // Ignore root, api, images, fonts, static assets with extensions
    if (url === '/' || url.startsWith('/api') || url.startsWith('/images') || url.startsWith('/fonts') || url.startsWith('/_next')) {
      return match;
    }
    if (/\.[a-zA-Z0-9]{2,5}($|\?|#)/.test(url)) {
      return match;
    }

    let fixedUrl = url;
    if (url.includes('?')) {
      const [base, query] = url.split('?');
      if (!base.endsWith('/')) {
        fixedUrl = `${base}/?${query}`;
      }
    } else if (url.includes('#')) {
      const [base, hash] = url.split('#');
      if (!base.endsWith('/')) {
        fixedUrl = `${base}/#${hash}`;
      }
    } else {
      if (!url.endsWith('/')) {
        fixedUrl = `${url}/`;
      }
    }

    if (fixedUrl !== url) {
      totalReplacements++;
      return `href=${quote}${fixedUrl}${quote}`;
    }
    return match;
  });

  // 2. Fix template literal href={`...`}
  content = content.replace(/href=\{`(\/[^`]+)`\}/g, (match, template) => {
    if (template.startsWith('/api') || template.startsWith('/images') || template.startsWith('/fonts') || template.startsWith('/_next')) {
      return match;
    }
    if (/\.[a-zA-Z0-9]{2,5}($|\?|#)/.test(template)) {
      return match;
    }

    let fixedTemplate = template;
    if (template.includes('?')) {
      const parts = template.split('?');
      const base = parts[0];
      const rest = parts.slice(1).join('?');
      if (!base.endsWith('/')) {
        fixedTemplate = `${base}/?${rest}`;
      }
    } else if (template.includes('#')) {
      const parts = template.split('#');
      const base = parts[0];
      const rest = parts.slice(1).join('#');
      if (!base.endsWith('/')) {
        fixedTemplate = `${base}/#${rest}`;
      }
    } else {
      if (!template.endsWith('/')) {
        fixedTemplate = `${template}/`;
      }
    }

    if (fixedTemplate !== template) {
      totalReplacements++;
      return `href={\`${fixedTemplate}\`}`;
    }
    return match;
  });

  // 3. Fix router.push('/...') and router.replace('/...')
  content = content.replace(/router\.(push|replace)\((["'])(\/[^"'\s]*)\2/g, (match, method, quote, url) => {
    if (url === '/' || url.startsWith('/api') || url.startsWith('/images') || url.startsWith('/fonts') || url.startsWith('/_next')) {
      return match;
    }
    if (/\.[a-zA-Z0-9]{2,5}($|\?|#)/.test(url)) {
      return match;
    }

    let fixedUrl = url;
    if (url.includes('?')) {
      const [base, query] = url.split('?');
      if (!base.endsWith('/')) {
        fixedUrl = `${base}/?${query}`;
      }
    } else if (url.includes('#')) {
      const [base, hash] = url.split('#');
      if (!base.endsWith('/')) {
        fixedUrl = `${base}/#${hash}`;
      }
    } else {
      if (!url.endsWith('/')) {
        fixedUrl = `${url}/`;
      }
    }

    if (fixedUrl !== url) {
      totalReplacements++;
      return `router.${method}(${quote}${fixedUrl}${quote}`;
    }
    return match;
  });

  // 4. Fix router.push(`...`) and router.replace(`...`)
  content = content.replace(/router\.(push|replace)\(\{?`(\/[^`]+)`\}?/g, (match, method, template) => {
    if (template.startsWith('/api') || template.startsWith('/images') || template.startsWith('/fonts') || template.startsWith('/_next')) {
      return match;
    }
    if (/\.[a-zA-Z0-9]{2,5}($|\?|#)/.test(template)) {
      return match;
    }

    let fixedTemplate = template;
    if (template.includes('?')) {
      const parts = template.split('?');
      const base = parts[0];
      const rest = parts.slice(1).join('?');
      if (!base.endsWith('/')) {
        fixedTemplate = `${base}/?${rest}`;
      }
    } else if (template.includes('#')) {
      const parts = template.split('#');
      const base = parts[0];
      const rest = parts.slice(1).join('#');
      if (!base.endsWith('/')) {
        fixedTemplate = `${base}/#${rest}`;
      }
    } else {
      if (!template.endsWith('/')) {
        fixedTemplate = `${template}/`;
      }
    }

    if (fixedTemplate !== template) {
      totalReplacements++;
      return `router.${method}(\`${fixedTemplate}\``;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated: ${path.relative('D:/cannogauniversity', file)}`);
  }
}

console.log(`\nDone! Modified ${modifiedCount} files with ${totalReplacements} link updates.`);
