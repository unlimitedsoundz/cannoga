const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
            console.log('FRAME NAVIGATED TO:', frame.url());
        }
    });

    console.log('Navigating to /viewbook...');
    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    console.log('Current URL:', page.url());

    await page.waitForSelector('.flipbook-root-container', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000));

    console.log('Clicking Next Page button...');
    const nextBtn = await page.$('button[aria-label="Next Page"]');
    if (!nextBtn) throw new Error('No next button');
    
    await nextBtn.click();
    console.log('Clicked next button. Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));

    console.log('URL after click:', page.url());

    const isVisible = await page.evaluate(() => {
        const root = document.querySelector('.flipbook-root-container');
        return {
            exists: !!root,
            display: root ? window.getComputedStyle(root).display : null,
            childCount: root ? root.childElementCount : 0,
            activePages: Array.from(document.querySelectorAll('.flipbook-page-item')).map(p => ({
                density: p.getAttribute('data-density'),
                display: window.getComputedStyle(p).display,
                visibility: window.getComputedStyle(p).visibility,
                styleDisplay: p.style.display,
                classes: p.className
            }))
        };
    });
    console.log('Flipbook DOM state after flip:', JSON.stringify(isVisible, null, 2));

    await page.screenshot({ path: 'scripts/test_screenshots/live_flip_result.png' });
    console.log('Saved screenshot to scripts/test_screenshots/live_flip_result.png');

    await browser.close();
})();
