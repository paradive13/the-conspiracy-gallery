const fs = require('fs');
const htmlContent = fs.readFileSync('index.html', 'utf8');

const startIndex = htmlContent.indexOf('const THEORIES = [');
const endIndex = htmlContent.indexOf('];', startIndex) + 2;

const arrayStr = htmlContent.substring(startIndex, endIndex).replace('const THEORIES = ', '');
const oldTheories = eval(arrayStr);

const descriptions = {
1: "NASA’s 1969 Moon landing is called fake by skeptics who point to strange shadows, the waving flag, and “studio-like” footage. Some believe Stanley Kubrick secretly filmed it to help America win the Space Race.",
2: "Flat Earthers claim Earth is a giant disc surrounded by an Antarctic ice wall. They believe governments and NASA are hiding the truth from the public.",
3: "The Illuminati is believed to be a hidden elite group controlling governments, media, and money worldwide. Symbols in music videos and the all-seeing eye are seen as secret signs.",
4: "Area 51 is rumored to store alien spacecraft and bodies recovered from UFO crashes. Its extreme secrecy and restricted access continue to fuel theories.",
5: "Simulation Theory suggests reality may actually be a giant computer simulation. Some scientists and tech leaders argue statistically it’s more likely than people think.",
6: "Chemtrail theorists believe certain airplane trails contain chemicals for weather control or population manipulation. The strange grid-like patterns in the sky are often used as “evidence.”",
7: "The Mandela Effect is when huge groups remember things differently from reality, like famous movie quotes or brand names. Some think it’s proof of parallel timelines colliding.",
8: "This theory claims reptilian aliens secretly disguise themselves as world leaders and celebrities. Supposed “glitches” in live broadcasts are often pointed to as proof.",
9: "Birds Aren’t Real says the government replaced real birds with surveillance drones. Birds sitting on power lines are jokingly called “charging stations.”",
10: "Denver Airport theories focus on creepy murals, underground tunnels, and a giant glowing-eyed horse statue. Many believe the airport hides elite or apocalyptic secrets.",
11: "Some believe Paul McCartney died in 1966 and was secretly replaced by a lookalike. Fans search Beatles songs and album covers for hidden clues.",
12: "The Philadelphia Experiment claims a US Navy ship teleported during a secret WWII experiment. Stories include sailors disappearing or becoming fused into the ship itself.",
13: "Many doubt the official JFK assassination story, believing multiple shooters were involved. The “magic bullet theory” remains one of the biggest points of debate.",
14: "9/11 conspiracy theories argue the Twin Towers collapsed too perfectly to be caused by planes alone. Building 7’s collapse is one of the biggest focuses of suspicion.",
15: "This theory claims pharmaceutical companies suppress cancer cures because long-term treatments make more money. Several researchers are said to have been silenced over the years.",
16: "5G mind control theories exploded during COVID, with claims towers affect human behavior or health. In some places, people even burned down 5G towers.",
17: "Hollow Earth believers think a hidden civilization exists inside Earth beneath the poles. Some legends claim explorers discovered entrances in Antarctica.",
18: "Nikola Tesla allegedly created a system for free wireless electricity before powerful investors shut it down. His missing research papers continue to fuel speculation.",
19: "Rumors claim Walt Disney was cryogenically frozen after death to be revived in the future. The story became one of Hollywood’s most famous myths.",
20: "The New World Order theory says global elites are slowly creating a single world government with total surveillance and centralized control.",
21: "Some believe Stanley Kubrick directed fake Moon landing footage after filming *2001: A Space Odyssey*. His movies are often analyzed for “hidden confessions.”",
22: "Water fluoridation theories claim fluoride is added to public water not just for teeth, but to reduce intelligence or increase obedience.",
23: "MK-Ultra was a real CIA program involving LSD experiments, hypnosis, and mind-control research on civilians. Many documents were destroyed before investigations began.",
24: "Fans believe Tupac Shakur faked his death to escape fame and is secretly living in hiding. Posthumous songs and alleged sightings keep the theory alive.",
25: "Some believe Princess Diana was assassinated rather than killed accidentally in a car crash. Her own letters about fearing an “accident” fueled suspicion.",
26: "Bigfoot theories claim giant ape-like creatures live hidden in remote forests. Despite countless sightings and blurry footage, no body has ever been found.",
27: "The Titanic-Olympic Switch theory claims the Titanic was secretly swapped with its damaged sister ship for insurance fraud before the disaster.",
28: "HAARP conspiracy theories say a US research facility can secretly control weather, cause earthquakes, or manipulate storms using radio waves.",
29: "Some theorists believe Nazis built hidden bases in Antarctica after WWII and escaped there with advanced technology.",
30: "This theory accuses the CIA of helping flood US cities with crack cocaine in the 1980s to secretly fund foreign operations.",
31: "Elvis Presley fans believe he faked his death and disappeared with government help. Alleged sightings still appear decades later.",
32: "The Truman Show Delusion is a real psychological condition where people believe their lives are secretly being filmed like a reality show.",
33: "Alien abduction stories describe people being taken aboard UFOs for experiments by mysterious beings. Many accounts share eerily similar details.",
34: "Monsanto conspiracy theories accuse the company of controlling the food supply through patented GMO seeds and harmful chemicals like Roundup.",
35: "Some theorists believe the Sun is artificially created because of its unusual stability and predictable cycles.",
36: "Ancient Aliens theories claim extraterrestrials helped build the pyramids due to their incredible precision and engineering.",
37: "Simulation Theory argues physical reality has limits similar to a computer system, suggesting the universe may be programmed.",
38: "Project Stargate was a real US government program researching psychic spying and “remote viewing” during the Cold War.",
39: "The Deep State theory claims unelected intelligence and military officials secretly maintain control regardless of election results.",
40: "Some believe Facebook was secretly connected to a DARPA surveillance project because both launched on the exact same day.",
41: "This theory argues Mileva Marić secretly contributed to Einstein’s relativity work but was erased from history.",
42: "The Roswell incident began when the military first announced recovering a “flying disc” before suddenly changing the story to a weather balloon.",
43: "Dead Internet Theory claims most online content today is secretly generated by bots and AI rather than real humans.",
44: "The Black Knight Satellite is said to be an ancient alien object orbiting Earth for thousands of years, secretly monitoring humanity.",
45: "Some believe ancient Egyptians had electricity because temple carvings resemble light bulbs and tombs show no torch soot.",
46: "The Vatican Secret Archives are rumored to contain hidden documents capable of rewriting religion and human history.",
47: "The Phantom Time Hypothesis claims nearly 300 years of history were completely fabricated during the Middle Ages.",
48: "The Bermuda Triangle theory says mysterious disappearances there are caused by portals, magnetic anomalies, or alien technology.",
49: "Hollow Moon theorists point to Apollo seismic experiments where the Moon allegedly “rang like a bell” after impact.",
50: "Some believe Shakespeare was only a pen name used by a hidden writer from the elite class.",
51: "Some theorists say the CIA influenced 1960s counterculture movements to redirect political rebellion into music, drugs, and distraction.",
52: "This theory claims the Library of Alexandria’s knowledge wasn’t destroyed, but secretly hidden away in protected archives.",
53: "Hollywood Predictive Programming suggests movies and TV shows secretly “prepare” society for future real-world events before they happen.",
54: "The Federal Reserve is technically a private banking system, leading some to believe global finance is controlled behind closed doors.",
55: "Antarctica conspiracy theories claim governments are hiding secret bases, ancient ruins, or entrances to hidden worlds beneath the ice.",
56: "Ancient Giants theories point to old reports of massive human skeletons allegedly hidden from the public by institutions like the Smithsonian.",
57: "Some believe Marilyn Monroe was silenced because of her alleged connections to powerful political figures and secrets.",
58: "The Number 23 phenomenon claims the number appears everywhere in history, science, and daily life far too often to be coincidence.",
59: "This theory says modern music tuning at 440Hz was intentionally chosen to increase stress and anxiety instead of harmony.",
60: "Many believe smartphones constantly listen to conversations because ads often appear moments after discussing products aloud.",
61: "The Rothschild banking theory claims one powerful family secretly controls global banking systems and world economies.",
62: "Some researchers argue Google’s search algorithms can subtly influence elections by changing what information people see first.",
63: "Déjà vu is sometimes described as a “glitch in the Matrix,” where reality briefly repeats itself due to simulation errors.",
64: "Edward Snowden’s leaks revealed massive NSA surveillance programs collecting phone calls, searches, and online activity worldwide.",
65: "The Voynich Manuscript is a mysterious unreadable book filled with strange symbols and unknown plants that nobody has decoded.",
66: "A fringe theory claims octopuses may have extraterrestrial origins because of their unusual intelligence and biology.",
67: "Mount Rushmore secretly contains a hidden chamber behind the carvings designed to store important American records and artifacts.",
68: "The Great Attractor is a mysterious force pulling entire galaxies through space, and some theorists think it’s something artificial.",
69: "Cleopatra VII was actually Macedonian Greek, not ethnically Egyptian as many assume.",
70: "Some claim Stonehenge was heavily reconstructed in the 1900s and may not be as ancient-looking as people think.",
71: "The Great Reset theory says global elites are using crises like COVID to reshape economies, technology, and personal freedoms worldwide.",
72: "Operation Northwoods was a real US military proposal to stage fake attacks and blame Cuba to justify war during the Cold War.",
73: "Subliminal messaging theories claim hidden images and sounds in advertising can secretly influence consumer behavior and decisions.",
74: "Adrenochrome theories claim elites harvest a chemical from terrified victims for power or youth, though no verified evidence exists.",
75: "Some believe Peru’s Nazca Lines were created as giant landing markers for alien spacecraft because they’re best viewed from the sky.",
76: "Rh-negative blood theories claim people without the Rh factor may descend from a mysterious non-human bloodline.",
77: "The Saturnian Broadcast theory says Saturn and its strange hexagon storm may be part of an ancient artificial signal system.",
78: "The Bielefeld Conspiracy jokingly claims an entire German city doesn’t actually exist and is part of a massive cover-up.",
79: "Some fringe theorists reject gravity entirely, claiming objects fall only because of density and buoyancy differences.",
80: "Mattress Firm conspiracy theories question how so many stores stay open with so few customers, leading to money-laundering rumors.",
81: "The CIA Invented Hippies theory says intelligence agencies used drugs and counterculture to weaken political activism in the 1960s.",
82: "COINTELPRO was a real FBI operation used to infiltrate and disrupt civil rights groups, activists, and political movements.",
83: "The Truman Show Delusion is a documented condition where people believe their lives are secretly scripted and broadcast to the world.",
84: "Scientists have shown false memories can be implanted, leading some to fear memory manipulation could someday be weaponized.",
85: "Some believe the Vatican’s Paul VI Audience Hall was intentionally designed to resemble a giant serpent from above.",
86: "The Tuskegee Experiment was a real US study where Black men with syphilis were denied treatment for decades without consent.",
87: "Recent UFO hearings and military testimonies reignited theories that governments possess hidden non-human technology.",
88: "The Knights Templar treasure supposedly vanished after the order was dissolved, leading to legends of hidden gold and secret vaults.",
89: "The pineal gland is called the “third eye” in many spiritual traditions, and some believe it unlocks higher consciousness.",
90: "Operation Paperclip secretly brought former Nazi scientists to America after WWII to work on military and space programs.",
91: "Celebrity clone theories claim famous stars are secretly replaced by doubles or clones after sudden personality changes.",
92: "Some theorists argue nuclear weapons are exaggerated or fake and maintained as a global fear-based deterrence system.",
93: "The Sumerians appeared with advanced astronomy and writing systems so suddenly that some believe outside help was involved.",
94: "The Bilderberg Group gathers world leaders and CEOs in private annual meetings, fueling fears of secret global decision-making.",
95: "The Taos Hum is a mysterious low-frequency sound heard by some people with no confirmed scientific explanation.",
96: "Many believe Atlantis was a real advanced civilization destroyed by a catastrophic event thousands of years ago.",
97: "Some claim deeper layers of the dark web contain hidden societies and secret networks beyond normal internet access.",
98: "Internet jokes and conspiracy theories often portray Mark Zuckerberg as robotic or even non-human because of his unusual behavior.",
99: "Because the internet began as a military project, some believe mass surveillance was always part of its true purpose.",
100: "Nikola Tesla once claimed he received strange radio signals from space, inspiring theories about alien contact."
};

const mergedTheories = [];
for (let i = 1; i <= 100; i++) {
    const desc = descriptions[i];
    if (i <= 94) {
        const oldT = oldTheories[i - 1];
        mergedTheories.push({ title: oldT.title, category: oldT.category, description: desc });
    } else {
        let title = "Conspiracy";
        let cat = "Unknown";
        if (i === 95) { title = "The Taos Hum"; cat = "Science & Tech"; }
        if (i === 96) { title = "Atlantis"; cat = "Hidden History"; }
        if (i === 97) { title = "Dark Web Secrets"; cat = "Technology"; }
        if (i === 98) { title = "Zuckerberg is a Robot"; cat = "Pop Culture"; }
        if (i === 99) { title = "Internet Mass Surveillance"; cat = "Government"; }
        if (i === 100) { title = "Tesla's Alien Contact"; cat = "Science & Tech"; }
        mergedTheories.push({ title: title, category: cat, description: desc });
    }
}

const jsString = "const THEORIES = [\n" + mergedTheories.map(t => 
    `    { title: ${JSON.stringify(t.title)}, category: ${JSON.stringify(t.category)}, description: ${JSON.stringify(t.description)} }`
).join(",\n") + "\n];";

const newHtmlContent = htmlContent.substring(0, startIndex) + jsString + htmlContent.substring(endIndex);

fs.writeFileSync('index.html', newHtmlContent);
console.log(`Successfully updated index.html with ${mergedTheories.length} theories.`);
