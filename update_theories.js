const fs = require('fs');

// 1. Read existing theories
const oldTheoriesContent = fs.readFileSync('new_theories.js', 'utf8');
// Extract the array part using eval or parsing
const arrayStr = oldTheoriesContent.substring(oldTheoriesContent.indexOf('['), oldTheoriesContent.lastIndexOf(']') + 1);
const oldTheories = eval(arrayStr);

// 2. Read new descriptions
const newDescContent = fs.readFileSync('new_descriptions.txt', 'utf8');

const regex = /#(\d{3})\n([\s\S]*?)(?=\n#\d{3}|\n<\/USER_REQUEST>|$)/g;
let match;
const newDescriptions = {};

while ((match = regex.exec(newDescContent)) !== null) {
    const num = parseInt(match[1], 10);
    const desc = match[2].trim().replace(/\n/g, ' ');
    newDescriptions[num] = desc;
}

// 3. Merge them
const mergedTheories = [];

for (let i = 1; i <= 100; i++) {
    const newDesc = newDescriptions[i];
    if (i <= 94) {
        // Use old title/category and new description
        const oldT = oldTheories[i - 1];
        if (oldT) {
            mergedTheories.push({
                title: oldT.title,
                category: oldT.category,
                description: newDesc || oldT.description
            });
        }
    } else {
        // Infer title/category for 95-100
        let title = "Conspiracy";
        let cat = "Unknown";
        if (i === 95) { title = "The Taos Hum"; cat = "Science & Tech"; }
        if (i === 96) { title = "Atlantis"; cat = "Hidden History"; }
        if (i === 97) { title = "Dark Web Secrets"; cat = "Technology"; }
        if (i === 98) { title = "Zuckerberg is a Robot"; cat = "Pop Culture"; }
        if (i === 99) { title = "Internet Mass Surveillance"; cat = "Government"; }
        if (i === 100) { title = "Tesla's Alien Contact"; cat = "Science & Tech"; }
        
        if (newDesc) {
            mergedTheories.push({
                title: title,
                category: cat,
                description: newDesc
            });
        }
    }
}

// Write to new file
const jsString = "const THEORIES = [\n" + mergedTheories.map(t => 
    `    { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, description: ${JSON.stringify(t.description)} }`
).join(",\n") + "\n];\n";

fs.writeFileSync('new_theories_updated.js', jsString);
console.log(`Merged ${mergedTheories.length} theories.`);
