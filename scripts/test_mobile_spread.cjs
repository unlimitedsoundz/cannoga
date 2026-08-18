const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('Testing 2-Page View on Mobile Screen (390x844 iPhone 12/13/14)...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ 
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    });

    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    await new Promise(r => setTimeout(r, 1200));

    // Flip forward from cover (page 1) to spread 2-3
    const nextBtn = await page.$('button[aria-label="Next Page"]');
    if (!nextBtn) throw new Error('Next Page button not found');

    console.log('1. Flipping from cover to spread 2-3 on mobile...');
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    // Check visible pages on mobile
    const mobileSpreadState = await page.evaluate(() => {
        const spreadContainer = document.querySelector('.flipbook-root-container');
        const visibleItems = Array.from(document.querySelectorAll('.flipbook-page-item')).filter(item => {
            const style = window.getComputedStyle(item);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

        const visibleImages = visibleItems.map(item => {
            const img = item.querySelector('img');
            return {
                src: img ? img.src : null,
                width: item.offsetWidth,
                height: item.offsetHeight,
                left: item.offsetLeft
            };
        });

        return {
            containerWidth: spreadContainer?.offsetWidth,
            containerHeight: spreadContainer?.offsetHeight,
            visiblePageCount: visibleItems.length,
            pages: visibleImages
        };
    });

    console.log('Mobile Spread State on Pages 2-3:', JSON.stringify(mobileSpreadState, null, 2));

    // Capture mobile screenshot
    const screenshotDir = path.join(__dirname, 'test_screenshots');
    const screenshotPath = path.join(screenshotDir, 'mobile_2page_spread.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`✓ Captured mobile 2-page spread screenshot at ${screenshotPath}`);

    if (mobileSpreadState.visiblePageCount === 2) {
        console.log('✓ SUCCESS: Mobile view is now rendering exactly 2 pages side-by-side!');
    } else {
        console.log(`Warning: expected 2 visible pages, got ${mobileSpreadState.visiblePageCount}`);
    }

    await browser.close();
})();
