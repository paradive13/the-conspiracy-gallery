const fs = require('fs');
const https = require('https');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch(e) {
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

async function getImageUrl(title) {
    let sourceUrl = '';
    try {
        const cleanTitle = title.replace(/ Conspiracy( Theory)?$/i, '');
        const url1 = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(cleanTitle)}&prop=pageimages&format=json&pithumbsize=512`;
        const data = await fetchJson(url1);
        if (data && data.query && data.query.pages) {
            const pageId = Object.keys(data.query.pages)[0];
            if (pageId !== "-1" && data.query.pages[pageId].thumbnail) {
                sourceUrl = data.query.pages[pageId].thumbnail.source;
            }
        }
        
        if (!sourceUrl) {
            const url2 = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanTitle)}&utf8=&format=json`;
            const searchData = await fetchJson(url2);
            if (searchData && searchData.query && searchData.query.search && searchData.query.search.length > 0) {
                const firstTitle = searchData.query.search[0].title;
                const url3 = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstTitle)}&prop=pageimages&format=json&pithumbsize=512`;
                const data2 = await fetchJson(url3);
                if (data2 && data2.query && data2.query.pages) {
                    const pageId2 = Object.keys(data2.query.pages)[0];
                    if (pageId2 !== "-1" && data2.query.pages[pageId2].thumbnail) {
                        sourceUrl = data2.query.pages[pageId2].thumbnail.source;
                    }
                }
            }
        }
    } catch(e) { console.error(e); }

    if (!sourceUrl) {
        const seed = encodeURIComponent(title.replace(/\s+/g, ''));
        sourceUrl = `https://picsum.photos/seed/${seed}/512/512`;
    }
    return sourceUrl;
}

async function run() {
    console.log("Reading index.html...");
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const startIndex = htmlContent.indexOf('const THEORIES = [');
    const endIndex = htmlContent.indexOf('];', startIndex) + 2;

    const arrayStr = htmlContent.substring(startIndex, endIndex).replace('const THEORIES = ', '');
    const THEORIES = eval(arrayStr);
    
    console.log(`Processing ${THEORIES.length} theories...`);
    
    // Process in batches of 10 to be nice to Wikipedia
    for (let i = 0; i < THEORIES.length; i++) {
        const t = THEORIES[i];
        process.stdout.write(`Fetching ${i+1}/${THEORIES.length}: ${t.title}... `);
        const url = await getImageUrl(t.title);
        t.imageUrl = url;
        console.log(`OK`);
    }

    const jsString = "const THEORIES = [\n" + THEORIES.map(t => 
        `    { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, description: ${JSON.stringify(t.description)}, imageUrl: ${JSON.stringify(t.imageUrl)} }`
    ).join(",\n") + "\n];";

    const newHtmlContent = htmlContent.substring(0, startIndex) + jsString + htmlContent.substring(endIndex);
    fs.writeFileSync('index.html', newHtmlContent);
    console.log("Successfully updated index.html with baked image URLs!");
}

run();
