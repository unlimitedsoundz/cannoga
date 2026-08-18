const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    await page.waitForSelector('.flipbook-root-container', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    const htmlStructure = await page.evaluate(() => {
        const root = document.querySelector('.flipbook-root-container');
        return {
            innerHTML: root ? root.innerHTML.slice(0, 1000) : 'none',
            childElementCount: root ? root.childElementCount : 0,
            classes: root ? Array.from(root.children).map(c => c.className) : []
        };
    });
    console.log('HTML structure before flip:', htmlStructure);

    const nextBtn = await page.$('button[aria-label="Next Page"]');
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    const htmlStructureAfter = await page.evaluate(() => {
        const root = document.querySelector('.flipbook-root-container');
        return {
            innerHTML: root ? root.innerHTML.slice(0, 1000) : 'none',
            childElementCount: root ? root.childElementCount : 0,
            classes: root ? Array.from(root.children).map(c => c.className) : [],
            allCanvases: document.querySelectorAll('canvas').length,
            allImgs: Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, width: i.width, height: i.height, offsetWidth: i.offsetWidth, offsetHeight: i.offsetHeight, parentClass: i.parentElement?.className }))
        };
    });
    console.log('HTML structure after flip:', JSON.stringify(htmlStructureAfter, null, 2));

    await browser.close();
})();
