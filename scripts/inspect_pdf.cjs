const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'uploads', 'cannoga college viewbook.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    console.log('PDF buffer size:', pdfBuffer.length);

    const browser = await chromium.launch({ 
      channel: 'msedge',
      headless: true
    });
    const page = await browser.newPage();
    
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        </head>
        <body>
          <div id="output"></div>
        </body>
      </html>
    `);

    await page.evaluate(async (pdfData) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });
      const pdf = await loadingTask.promise;
      
      const results = {
        numPages: pdf.numPages,
        pages: []
      };

      for (let i = 1; i <= pdf.numPages; i++) {
        const pageObj = await pdf.getPage(i);
        const textContent = await pageObj.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        const viewport = pageObj.getViewport({ scale: 1.0 });
        results.pages.push({
          pageNumber: i,
          width: viewport.width,
          height: viewport.height,
          aspectRatio: Number((viewport.width / viewport.height).toFixed(3)),
          textSnippet: text.substring(0, 150),
          fullText: text
        });
      }

      window.results = results;
    }, Array.from(pdfBuffer));

    const data = await page.evaluate(() => window.results);
    console.log('=== TOTAL PAGES IN PDF:', data.numPages, '===');
    data.pages.forEach(p => {
      console.log(`Page ${p.pageNumber}: [${p.width}x${p.height}] ${p.textSnippet.replace(/\\s+/g, ' ')}`);
    });

    const outPath = path.join(process.cwd(), 'scripts', 'viewbook_extracted_data.json');
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log('Saved extracted data to:', outPath);

    await browser.close();
  } catch (err) {
    console.error('Error inspecting PDF:', err);
  }
})();
