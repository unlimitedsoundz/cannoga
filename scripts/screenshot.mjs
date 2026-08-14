import { chromium } from 'playwright';
import path from 'path';

/**
 * Capture a screenshot of a given URL or relative route.
 * Usage: node scripts/screenshot.mjs <url-or-path> [output-filename]
 */
async function captureScreenshot() {
  const target = process.argv[2] || 'http://localhost:3000';
  const filename = process.argv[3] || 'screenshot.png';
  const url = target.startsWith('http') ? target : `http://localhost:3000${target.startsWith('/') ? '' : '/'}${target}`;
  const outputPath = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename);

  console.log(`Navigating to: ${url}`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Saved screenshot to: ${outputPath}`);
  } catch (err) {
    console.error(`Failed to capture screenshot of ${url}:`, err);
  } finally {
    await browser.close();
  }
}

captureScreenshot();
