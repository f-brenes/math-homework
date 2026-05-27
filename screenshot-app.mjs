import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

async function waitForApp() {
  await page.waitForFunction(() => {
    const root = document.getElementById('root') || document.querySelector('[data-reactroot]') || document.body;
    return root && root.children.length > 0;
  }, { timeout: 20000 }).catch(() => {});
  await setTimeout(4000);
}

async function shot(name, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await waitForApp();
  await page.screenshot({ path: `/tmp/app-${name}.png`, fullPage: false });
  console.log(`✓ ${name}`);
}

await shot('dashboard', 'http://localhost:8081/');
await shot('saved',     'http://localhost:8081/saved');
await shot('theory',   'http://localhost:8081/theory');
await shot('quiz',     'http://localhost:8081/quiz');
await shot('settings', 'http://localhost:8081/settings');

await browser.close();
console.log('Done');
