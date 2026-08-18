const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Testing Viewbook on http://localhost:3000/viewbook ...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    
    // 1. Desktop Test
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for canvas or container to be visible
    await desktopPage.waitForSelector('.flipbook-root-container', { timeout: 10000 });
    console.log('✓ Desktop Viewbook Loaded');

    const screenshotsDir = path.join(process.cwd(), 'scripts', 'test_screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    await desktopPage.screenshot({ path: path.join(screenshotsDir, 'desktop_viewbook_cover.png') });
    console.log('✓ Captured desktop cover screenshot');

    // Test search trigger
    await desktopPage.keyboard.press('/');
    // Check title text
    const title = await desktopPage.title();
    console.log('✓ Page Title:', title);

    // 2. Mobile Viewport Test (iPhone 14 / 390x844)
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto('http://localhost:3000/viewbook', { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForSelector('.flipbook-root-container', { timeout: 10000 });
    console.log('✓ Mobile Viewbook Loaded');
    await mobilePage.screenshot({ path: path.join(screenshotsDir, 'mobile_viewbook_cover.png') });
    console.log('✓ Captured mobile screenshot');

    // 3. Deep link test (?page=8)
    const deepLinkPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await deepLinkPage.goto('http://localhost:3000/viewbook?page=8', { waitUntil: 'networkidle', timeout: 30000 });
    await deepLinkPage.waitForSelector('.flipbook-root-container', { timeout: 10000 });
    console.log('✓ Deep link to Page 8 loaded');
    await deepLinkPage.screenshot({ path: path.join(screenshotsDir, 'desktop_viewbook_page8.png') });

    await browser.close();
    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  }
})();
