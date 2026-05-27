import { chromium } from 'playwright';
import { setTimeout } from 'timers/promises';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

const errors = [];
const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:8081/', { waitUntil: 'load', timeout: 30000 });
await setTimeout(8000);

const html = await page.content();
console.log('=== BODY snippet ===');
console.log(html.slice(0, 1200));
console.log('\n=== ERRORS ===');
errors.forEach(e => console.log(e));
console.log('\n=== CONSOLE (last 30) ===');
logs.slice(-30).forEach(l => console.log(l));
