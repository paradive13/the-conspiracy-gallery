const fs = require('fs');
let content = fs.readFileSync('theories2.txt', 'utf8');
content = content.replace(/\r\n/g, '\n');

// The format is:
// #001
// Title
//
// Category
// Description...
//
// Wikipedia
// Reddit
//
// Ask Claude

const theoryRegex = /#\d{3}\n([^\n]+)\n\n([^\n]+)\n([\s\S]*?)(?=\n\nWikipedia|\n\n#\d{3}|$)/g;

let match;
const parsed = [];

while ((match = theoryRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const category = match[2].trim();
    const description = match[3].trim().replace(/\n/g, ' ');
    
    if (title && category && description && description.length > 20) {
        parsed.push({ title, category, description });
    }
}

if (parsed.length > 94) {
    parsed.length = 94; 
}

const jsString = "const THEORIES = [\n" + parsed.map(t => 
    `    { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, description: ${JSON.stringify(t.description)} }`
).join(",\n") + "\n];\n";

fs.writeFileSync('new_theories.js', jsString);
console.log(`Parsed ${parsed.length} theories.`);
