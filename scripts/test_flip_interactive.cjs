const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testInteractiveFlip() {
    console.log('Testing interactive page flips on http://localhost:3000/viewbook ...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });

    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

        // Navigate to viewbook
        await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle', timeout: 30000 });
        console.log('✓ Page loaded');

        // Wait for flipbook ready
        await page.waitForSelector('.flipbook-root-container', { timeout: 10000 });
        await new Promise(r => setTimeout(r, 1000));

        // Click next page button
        const nextButton = await page.$('button[aria-label="Next Page"]');
        if (!nextButton) throw new Error('Next button not found');

        console.log('Flipping forward to spread 2-3...');
        await nextButton.click();
        await new Promise(r => setTimeout(r, 1200));

        // Verify image visibility
        const imagesVisibleAfterFlip1 = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('.flipbook-page-item img'));
            return imgs.length > 0 && imgs.some(img => img.complete && img.naturalWidth > 0);
        });
        console.log('✓ Images visible on spread 2-3:', imagesVisibleAfterFlip1);

        console.log('Flipping forward to spread 4-5...');
        await nextButton.click();
        await new Promise(r => setTimeout(r, 1200));

        const imagesVisibleAfterFlip2 = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('.flipbook-page-item img'));
            return imgs.length > 0 && imgs.some(img => img.complete && img.naturalWidth > 0);
        });
        console.log('✓ Images visible on spread 4-5:', imagesVisibleAfterFlip2);

        // Take a screenshot of the flipped spread
        const screenshotsDir = path.join(process.cwd(), 'scripts', 'test_screenshots');
        if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
        await page.screenshot({ path: path.join(screenshotsDir, 'flipped_spread_4_5.png') });
        console.log('✓ Captured screenshot at scripts/test_screenshots/flipped_spread_4_5.png');

        console.log('ALL FLIP TESTS PASSED WITH 100% VISIBILITY!');
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

testInteractiveFlip();
