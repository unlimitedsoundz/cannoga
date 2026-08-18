const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('Testing Mobile Toolbar on 360px and 390px Viewports...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    
    for (const width of [360, 390]) {
        console.log(`\n--- Testing ${width}px screen width ---`);
        const page = await browser.newPage({ 
            viewport: { width, height: 800 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
        });

        await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
        await new Promise(r => setTimeout(r, 1000));

        const toolbarMetrics = await page.evaluate((w) => {
            const toolbar = document.querySelector('footer');
            if (!toolbar) return null;

            const allButtons = Array.from(toolbar.querySelectorAll('button, a'));
            const rect = toolbar.getBoundingClientRect();

            const buttonsStatus = allButtons.map(btn => {
                const bRect = btn.getBoundingClientRect();
                const isWithinBounds = bRect.left >= 0 && bRect.right <= w;
                return {
                    label: btn.getAttribute('aria-label') || btn.getAttribute('title') || btn.textContent?.trim(),
                    left: Math.round(bRect.left),
                    right: Math.round(bRect.right),
                    isCropped: !isWithinBounds
                };
            });

            return {
                toolbarWidth: rect.width,
                hasCroppedButtons: buttonsStatus.some(b => b.isCropped),
                buttons: buttonsStatus
            };
        }, width);

        console.log(`Toolbar metrics for ${width}px:`, JSON.stringify(toolbarMetrics, null, 2));

        const screenshotPath = path.join(__dirname, 'test_screenshots', `mobile_toolbar_${width}px.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`✓ Saved screenshot: ${screenshotPath}`);

        await page.close();
    }

    await browser.close();
})();
