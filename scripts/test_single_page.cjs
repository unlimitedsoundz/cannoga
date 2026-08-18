const { chromium } = require('playwright');

(async () => {
    console.log('Testing Single Page View and Toggle Switch...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    await new Promise(r => setTimeout(r, 1000));

    // Inspect the 1-page viewer container on the page
    const viewerStates = await page.evaluate(() => {
        const viewers = Array.from(document.querySelectorAll('.flipbook-root-container'));
        return viewers.map((v, idx) => ({
            index: idx,
            childCount: v.childElementCount,
            width: v.offsetWidth,
            height: v.offsetHeight,
            images: Array.from(v.querySelectorAll('img')).map(img => ({
                src: img.src,
                naturalWidth: img.naturalWidth,
                width: img.offsetWidth,
                height: img.offsetHeight,
                display: window.getComputedStyle(img).display,
                visibility: window.getComputedStyle(img).visibility,
                parentDisplay: window.getComputedStyle(img.parentElement).display
            }))
        }));
    });
    console.log('Initial Viewers State:', JSON.stringify(viewerStates, null, 2));

    // Click the toggle button in the first viewer
    const toggleBtn = await page.$('button[aria-label="Toggle Page Layout"]');
    if (toggleBtn) {
        console.log('Clicking Toggle View Mode button...');
        await toggleBtn.click();
        await new Promise(r => setTimeout(r, 1500));

        const stateAfterToggle = await page.evaluate(() => {
            const v = document.querySelector('.flipbook-root-container');
            if (!v) return 'no container';
            return {
                childCount: v.childElementCount,
                width: v.offsetWidth,
                height: v.offsetHeight,
                items: Array.from(v.querySelectorAll('.flipbook-page-item')).map(item => ({
                    className: item.className,
                    display: window.getComputedStyle(item).display,
                    visibility: window.getComputedStyle(item).visibility,
                    style: item.getAttribute('style')
                })),
                images: Array.from(v.querySelectorAll('img')).map(img => ({
                    src: img.src,
                    naturalWidth: img.naturalWidth,
                    width: img.offsetWidth,
                    height: img.offsetHeight,
                    display: window.getComputedStyle(img).display
                }))
            };
        });
        console.log('State After Toggle:', JSON.stringify(stateAfterToggle, null, 2));
    }

    await browser.close();
})();
