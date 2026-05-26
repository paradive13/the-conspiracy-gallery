const fs = require('fs');

const newTheories = [
  { title: "Smart Dust", category: "Technology", description: "Smart Dust refers to tiny microscopic sensors developed for surveillance and tracking. Some fear they could someday be secretly dispersed through the air." },
  { title: "Time Capsule Propaganda", category: "Hidden History", description: "This theory claims time capsules are carefully curated propaganda tools designed to control how future generations view history." },
  { title: "Shared Dream Consciousness", category: "Psychology", description: "Some believe dreams are part of a shared collective consciousness where humans unknowingly connect through symbols and emotions." },
  { title: "Hidden Sphinx Chambers", category: "Hidden History", description: "Researchers claim hidden chambers may exist beneath the Great Sphinx, possibly containing knowledge from a lost civilization." },
  { title: "Agenda 21", category: "Government", description: "The Agenda 21 theory links UN sustainability plans with fears of population control and centralized global governance." },
  { title: "Tunguska UFO Explosion", category: "Alien & Space", description: "The Tunguska explosion in Siberia flattened forests with enormous force, and some believe it was caused by a UFO rather than a meteor." },
  { title: "Expanding Earth Theory", category: "Science & Tech", description: "Expanding Earth Theory suggests Earth itself has grown larger over millions of years, separating the continents naturally." },
  { title: "Jack the Ripper Royalty", category: "Elite & Power", description: "Some theories claim Jack the Ripper was secretly connected to British royalty and protected from exposure." },
  { title: "Airport Art Messages", category: "Hidden History", description: "Airport art conspiracy theories say strange murals and sculptures secretly communicate elite messages in public spaces." },
  { title: "Sandy Island Mystery", category: "Hidden History", description: "Sandy Island appeared on official maps for over 100 years until explorers discovered it never actually existed." },
  { title: "Skull and Bones Influence", category: "Elite & Power", description: "Yale’s Skull and Bones society has produced many powerful political figures, leading to rumors of hidden influence over America." },
  { title: "The Hutchison Effect", category: "Science & Tech", description: "The Hutchison Effect allegedly caused levitation and bizarre electromagnetic phenomena that scientists could never fully explain." },
  { title: "The Architect Distraction", category: "Psychology", description: "“The Architect” theory claims all conspiracy theories are intentionally created distractions hiding one deeper truth nobody notices." }
];

const htmlContent = fs.readFileSync('index.html', 'utf8');
const startIndex = htmlContent.indexOf('const THEORIES = [');
const endIndex = htmlContent.indexOf('];', startIndex) + 2;

const arrayStr = htmlContent.substring(startIndex, endIndex).replace('const THEORIES = ', '');
const oldTheories = eval(arrayStr);

const combined = oldTheories.concat(newTheories);

const jsString = "const THEORIES = [\n" + combined.map(t => 
    `    { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, description: ${JSON.stringify(t.description)} }`
).join(",\n") + "\n];";

const newHtmlContent = htmlContent.substring(0, startIndex) + jsString + htmlContent.substring(endIndex);

fs.writeFileSync('index.html', newHtmlContent);
console.log(`Successfully added remaining theories. Total is now ${combined.length}`);
