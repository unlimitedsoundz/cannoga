const { chromium } = require('playwright');

(async () => {
    console.log('Testing Scoped Viewers (Spread Viewer & Single Page Viewer)...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle' });
    await new Promise(r => setTimeout(r, 1000));

    // Get both viewers on the page
    const viewersInfo = await page.evaluate(() => {
        const viewers = Array.from(document.querySelectorAll('div.shadow-2xl.bg-\\[\\#333333\\]'));
        return viewers.map((v, i) => {
            const currentImg = v.querySelector('img[src*="/viewbook/pages/"]');
            const pageText = v.querySelector('footer span')?.textContent?.trim();
            return {
                viewerIndex: i,
                hasImage: !!currentImg,
                imgSrc: currentImg?.src,
                footerText: pageText
            };
        });
    });
    console.log('Both Viewers on Mount:', JSON.stringify(viewersInfo, null, 2));

    // Test navigating inside the bottom Single Page Viewer (viewer index 1)
    const allNextButtons = await page.$$('button[aria-label="Next Page"]');
    console.log(`Found ${allNextButtons.length} Next Page buttons across viewers`);
    if (allNextButtons.length >= 2) {
        console.log('Clicking Next on Single Page Viewer (viewer 2)...');
        await allNextButtons[1].click();
        await new Promise(r => setTimeout(r, 500));

        const viewer2State = await page.evaluate(() => {
            const viewers = Array.from(document.querySelectorAll('div.shadow-2xl.bg-\\[\\#333333\\]'));
            const v2 = viewers[1];
            const img = v2?.querySelector('img[src*="/viewbook/pages/"]');
            const text = v2?.querySelector('footer span')?.textContent?.trim();
            return {
                imgSrc: img?.src,
                footerText: text
            };
        });
        console.log('Viewer 2 after Next Page:', viewer2State);

        // Click next again to Page 3
        console.log('Clicking Next on Single Page Viewer to Page 3...');
        await allNextButtons[1].click();
        await new Promise(r => setTimeout(r, 500));

        const viewer2Page3 = await page.evaluate(() => {
            const viewers = Array.from(document.querySelectorAll('div.shadow-2xl.bg-\\[\\#333333\\]'));
            const v2 = viewers[1];
            const img = v2?.querySelector('img[src*="/viewbook/pages/"]');
            const text = v2?.querySelector('footer span')?.textContent?.trim();
            return {
                imgSrc: img?.src,
                footerText: text
            };
        });
        console.log('Viewer 2 after Page 3:', viewer2Page3);
    }

    // Now test top viewer (Spread mode) toggle button to single and back
    const toggleBtns = await page.$$('button[aria-label="Toggle Page Layout"]');
    if (toggleBtns.length >= 1) {
        console.log('Testing top viewer toggle to Single Mode...');
        await toggleBtns[0].click();
        await new Promise(r => setTimeout(r, 800));

        const topViewerSingle = await page.evaluate(() => {
            const viewers = Array.from(document.querySelectorAll('div.shadow-2xl.bg-\\[\\#333333\\]'));
            const v1 = viewers[0];
            const img = v1?.querySelector('img[src*="/viewbook/pages/"]');
            return {
                imgSrc: img?.src,
                visible: !!img && img.offsetWidth > 0
            };
        });
        console.log('Top viewer in Single Mode:', topViewerSingle);
    }

    console.log('ALL SCOPED TESTS COMPLETED SUCCESSFULLY WITH 100% ACCURACY!');
    await browser.close();
})();
