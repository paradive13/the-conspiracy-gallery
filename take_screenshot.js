const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set a timeout of 10s to ensure it doesn't hang forever
    await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'load', timeout: 10000 }).catch(e => console.log('Goto error:', e.message));
    
    // Wait a bit for Three.js to render
    await new Promise(r => setTimeout(r, 2000));
    
    const screenshot = await page.screenshot();
    const fs = require('fs');
    fs.writeFileSync('screenshot.png', screenshot);
    
    // Check if canvas exists and is visible
    const canvasInfo = await page.evaluate(() => {
        const c = document.querySelector('canvas');
        if (!c) return 'No canvas found';
        const rect = c.getBoundingClientRect();
        return `Canvas size: ${rect.width}x${rect.height}, display: ${getComputedStyle(c).display}`;
    });
    console.log(canvasInfo);
    
    await browser.close();
})();
