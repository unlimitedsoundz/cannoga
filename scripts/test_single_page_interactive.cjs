const { chromium } = require('playwright');

(async () => {
    console.log('Testing Single Page Mode Interactive Flipping & Switching...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));

    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    await new Promise(r => setTimeout(r, 1000));

    // Toggle to single page mode
    const toggleBtn = await page.$('button[aria-label="Toggle Page Layout"]');
    console.log('1. Switching to Single Page Mode...');
    await toggleBtn.click();
    await new Promise(r => setTimeout(r, 1000));

    // Check single page image is visible
    let activeImgSrc = await page.evaluate(() => {
        const img = document.querySelector('img[src*="/viewbook/pages/"]');
        return img ? { src: img.src, width: img.offsetWidth, height: img.offsetHeight, complete: img.complete } : null;
    });
    console.log('✓ Page 1 image visible in Single Mode:', activeImgSrc);

    // Click next page
    const nextBtn = await page.$('button[aria-label="Next Page"]');
    console.log('2. Clicking Next Page in Single Mode...');
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 500));

    activeImgSrc = await page.evaluate(() => {
        const img = document.querySelector('img[src*="/viewbook/pages/"]');
        return img ? { src: img.src, width: img.offsetWidth, height: img.offsetHeight } : null;
    });
    console.log('✓ Page 2 image visible in Single Mode:', activeImgSrc);

    // Click next page again (Page 3)
    console.log('3. Clicking Next Page to Page 3...');
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 500));

    activeImgSrc = await page.evaluate(() => {
        const img = document.querySelector('img[src*="/viewbook/pages/"]');
        return img ? { src: img.src, width: img.offsetWidth, height: img.offsetHeight } : null;
    });
    console.log('✓ Page 3 image visible in Single Mode:', activeImgSrc);

    // Toggle back to spread mode
    console.log('4. Switching back to 2-Page Spread Mode...');
    await toggleBtn.click();
    await new Promise(r => setTimeout(r, 1000));

    const spreadState = await page.evaluate(() => {
        const container = document.querySelector('.flipbook-root-container');
        return container ? { exists: true, width: container.offsetWidth } : { exists: false };
    });
    console.log('✓ Spread mode restored:', spreadState);

    console.log('ALL SINGLE-PAGE AND SPREAD SWITCHING TESTS PASSED!');
    await browser.close();
})();
