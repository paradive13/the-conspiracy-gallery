const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => {
        console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
    });

    await page.goto('file://' + __dirname + '/index.html', { waitUntil: 'networkidle2' });
    
    // Check if images are loading
    const imageCount = await page.evaluate(() => document.querySelectorAll('img').length);
    console.log('Total images found in DOM:', imageCount);
    
    // Click on canvas to trigger inspect (assuming first click is ok, but we need to pass a fake raycast)
    await page.evaluate(() => {
        if(typeof THEORIES !== 'undefined' && THEORIES.length > 0) {
            console.log('THEORIES array is available, length: ' + THEORIES.length);
            try {
                openInspect({ theory: THEORIES[0], isRare: false });
                console.log('Opened inspect for ' + THEORIES[0].title);
            } catch(e) {
                console.log('openInspect error: ' + e);
            }
        }
    });

    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
})();
