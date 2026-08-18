const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  try {
    const pagesDir = path.join(process.cwd(), 'public', 'viewbook', 'pages');
    const thumbsDir = path.join(process.cwd(), 'public', 'viewbook', 'thumbnails');
    if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

    const pdfPath = path.join(process.cwd(), 'public', 'documents', 'cannoga-college-viewbook-2026-2027.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');
    console.log('PDF Read. Launching browser to render pages...');

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
          <style>
            body { margin: 0; padding: 0; background: transparent; }
            canvas { display: block; }
          </style>
        </head>
        <body>
          <canvas id="render-canvas"></canvas>
        </body>
      </html>
    `);

    await page.evaluate(async (pdfB64) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const binaryString = atob(pdfB64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      window.pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
      window.totalPages = window.pdfDoc.numPages;
    }, pdfBase64);

    const totalPages = await page.evaluate(() => window.totalPages);
    console.log(`Rendering ${totalPages} pages at high-DPI...`);

    for (let i = 1; i <= totalPages; i++) {
      // Render full page canvas (scale 2.0 = 1152x1152 for retina)
      await page.evaluate(async (pageNum) => {
        const p = await window.pdfDoc.getPage(pageNum);
        const viewport = p.getViewport({ scale: 2.0 });
        const canvas = document.getElementById('render-canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await p.render({ canvasContext: ctx, viewport }).promise;
      }, i);

      const canvasHandle = await page.$('#render-canvas');
      const fullImgPath = path.join(pagesDir, `page-${i}.webp`);
      await canvasHandle.screenshot({ path: fullImgPath, type: 'webp', quality: 90 });

      // Render thumbnail (scale 0.5 = 288x288)
      await page.evaluate(async (pageNum) => {
        const p = await window.pdfDoc.getPage(pageNum);
        const viewport = p.getViewport({ scale: 0.5 });
        const canvas = document.getElementById('render-canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        await p.render({ canvasContext: ctx, viewport }).promise;
      }, i);

      const thumbImgPath = path.join(thumbsDir, `thumb-${i}.webp`);
      await canvasHandle.screenshot({ path: thumbImgPath, type: 'webp', quality: 85 });

      if (i === 1) {
        // Save OG cover image
        const ogPath = path.join(process.cwd(), 'public', 'images', 'viewbook-cover-og.jpg');
        await canvasHandle.screenshot({ path: ogPath, type: 'jpeg', quality: 92 });
      }

      console.log(`✓ Rendered Page ${i}/${totalPages} (Full & Thumbnail)`);
    }

    await browser.close();
    console.log('All viewbook pages rendered successfully!');
  } catch (err) {
    console.error('Error rendering pages:', err);
  }
})();
