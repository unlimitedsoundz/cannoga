const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

(async () => {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'uploads', 'cannoga college viewbook.pdf');
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    console.log('Read PDF bytes:', data.length);

    const doc = await pdfjs.getDocument({ data }).promise;
    console.log('=== PDF LOADED. TOTAL PAGES:', doc.numPages, '===');

    const pagesData = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      
      const lines = textContent.items
        .map(item => item.str.trim())
        .filter(s => s.length > 2);

      const titleGuess = lines.slice(0, 5).join(' - ') || `Page ${i}`;

      pagesData.push({
        pageNumber: i,
        width: Math.round(viewport.width),
        height: Math.round(viewport.height),
        aspectRatio: Number((viewport.width / viewport.height).toFixed(4)),
        titleSnippet: titleGuess.substring(0, 80),
        fullText: text
      });

      console.log(`Page ${i}: [${Math.round(viewport.width)}x${Math.round(viewport.height)}] | Title/Header: ${titleGuess.substring(0, 60)}`);
    }

    const output = {
      title: "Cannoga College Viewbook 2026/2027",
      edition: "2026-2027",
      totalPages: doc.numPages,
      width: pagesData[0]?.width || 595,
      height: pagesData[0]?.height || 842,
      pages: pagesData
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'scripts', 'viewbook_meta.json'),
      JSON.stringify(output, null, 2)
    );
    console.log('Saved viewbook metadata to scripts/viewbook_meta.json');
  } catch (err) {
    console.error('Error reading PDF:', err);
  }
})();
