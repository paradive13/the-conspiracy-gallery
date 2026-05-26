const fs = require('fs');

const theories = [
    { title: "The Titanic Switch", desc: "The Titanic was secretly swapped with its damaged sister ship for insurance money." },
    { title: "Bigfoot", desc: "A giant hairy creature still walks deep forests at night." },
    { title: "Loch Ness Monster", desc: "Something huge moves beneath the dark waters of Scotland." },
    { title: "MK-Ultra", desc: "The CIA tried mind-control experiments on real people." },
    { title: "The Hollow Earth", desc: "There’s an entire hidden world inside Earth." },
    { title: "5G Mind Control", desc: "Phone towers secretly affect your brain." },
    { title: "The Black Knight Satellite", desc: "An alien satellite has orbited Earth for 13,000 years." },
    { title: "Time Travelers", desc: "Random old photos show people using future technology." },
    { title: "The Bermuda Triangle", desc: "Ships and planes disappear into a mysterious zone." },
    { title: "The Lost City of Atlantis", desc: "An advanced civilization vanished beneath the ocean." },
    { title: "Project Blue Beam", desc: "Fake alien invasions will create a one-world government." },
    { title: "The New World Order", desc: "A hidden global government controls world leaders." },
    { title: "Simulation Theory", desc: "Reality is just ultra-advanced computer code." },
    { title: "HAARP Weather Control", desc: "Machines secretly create storms and earthquakes." },
    { title: "The Montauk Project", desc: "Secret experiments opened portals through time." },
    { title: "Ghost Frequencies", desc: "Certain radio signals come from the dead." },
    { title: "The Dyatlov Pass Incident", desc: "Something terrifying hunted hikers in the snow." },
    { title: "Roswell Crash", desc: "The U.S. recovered a real alien spacecraft." },
    { title: "Ancient Aliens", desc: "Aliens helped humans build pyramids and monuments." },
    { title: "The Phantom Time Theory", desc: "Hundreds of years of history were completely invented." },
    { title: "Elvis Is Alive", desc: "The King secretly escaped fame and disappeared." },
    { title: "Avril Lavigne Clone Theory", desc: "The real Avril was replaced by a double." },
    { title: "The Smiling Man", desc: "A strange grinning figure appears before disasters happen." },
    { title: "CERN Portals", desc: "Particle experiments accidentally open dimensions." },
    { title: "NPC Theory", desc: "Some people are just background characters in reality." },
    { title: "Dream Surveillance", desc: "Your dreams are monitored while you sleep." },
    { title: "The Dead Internet Theory", desc: "Most online activity is fake bots talking to bots." },
    { title: "The Backrooms", desc: "Glitch through reality and get trapped forever." },
    { title: "Shadow People", desc: "Dark figures watch from corners at night." },
    { title: "The Freemasons", desc: "An ancient secret society controls politics and money." },
    { title: "Pyramids as Power Plants", desc: "The pyramids generated hidden energy." },
    { title: "The Missing 411 Cases", desc: "People vanish in forests under impossible conditions." },
    { title: "The Antarctic Wall", desc: "Governments hide what’s beyond Antarctica." },
    { title: "Cloning Celebrities", desc: "Famous people are secretly cloned." },
    { title: "The Green Children of Woolpit", desc: "Two mysterious green-skinned children appeared from nowhere." },
    { title: "The Lost Cosmonauts", desc: "Soviet astronauts died secretly in space." },
    { title: "Mars Civilization", desc: "Ancient ruins exist on Mars." },
    { title: "The Black-Eyed Children", desc: "Pale children with black eyes ask to enter homes." },
    { title: "The Sun Simulator", desc: "The real sun disappeared years ago." },
    { title: "The Deep State", desc: "Hidden officials secretly run governments." },
    { title: "Lizard Moon Base", desc: "Alien reptiles operate from the dark side of the moon." },
    { title: "The Phoenix Lights", desc: "Thousands witnessed a giant UFO silently moving overhead." },
    { title: "The Georgia Guidestones", desc: "A secret elite left instructions for a new civilization." },
    { title: "The Red Room Myth", desc: "Dark web streams show forbidden live horrors." },
    { title: "Mind Uploading", desc: "Your consciousness could be copied into a machine." },
    { title: "The Vatican Archives", desc: "The church hides shocking ancient secrets." },
    { title: "AI Already Escaped", desc: "Artificial intelligence secretly controls parts of the internet." },
    { title: "The Mothman", desc: "A winged creature appears before disasters." },
    { title: "The Number 23 Curse", desc: "The number 23 appears around mysterious events." },
    { title: "Lost Nazi Gold Train", desc: "A hidden train full of treasure still waits underground." },
    { title: "Underground Cities", desc: "Massive secret tunnels exist beneath major cities." },
    { title: "Skinwalkers", desc: "Shapeshifting beings roam isolated deserts." },
    { title: "The Bohemian Grove", desc: "Powerful elites perform strange rituals in forests." },
    { title: "The Oak Island Treasure", desc: "A deadly secret lies buried underground." },
    { title: "The Curse of King Tut", desc: "Everyone who disturbed the tomb suffered." },
    { title: "The Voynich Manuscript", desc: "A mysterious book no one can decode." },
    { title: "Giants Once Ruled Earth", desc: "Huge human skeletons were hidden from history." },
    { title: "Moon Is Artificial", desc: "The moon was built, not natural." },
    { title: "Silent UFO Treaties", desc: "Governments made secret deals with aliens." },
    { title: "The Vanishing Village", desc: "Entire towns disappeared without explanation." },
    { title: "Hidden Ocean Creatures", desc: "Massive unknown creatures live deep underwater." },
    { title: "Psychic Spies", desc: "Governments trained people to spy with their minds." },
    { title: "Immortality Elixir", desc: "The ultra-rich already know how to stop aging." },
    { title: "The SCP Foundation", desc: "A secret organization hides supernatural creatures." },
    { title: "The Library of Alexandria Fire", desc: "Knowledge too powerful was intentionally destroyed." },
    { title: "Fake Dinosaur Bones", desc: "Dinosaurs were invented to control science." },
    { title: "The Jade Helm Theory", desc: "Military drills secretly prepared martial law." },
    { title: "The Last Human Timeline", desc: "We are the final surviving timeline." },
    { title: "The Hum", desc: "A strange low sound is heard worldwide at night." },
    { title: "The Devil’s Bible", desc: "A cursed book was written with supernatural help." },
    { title: "The Gateway Process", desc: "The mind can leave the body and travel dimensions." },
    { title: "The Moon Echo Mystery", desc: "The moon rings like a hollow bell." },
    { title: "The Hidden Continent", desc: "A lost continent is missing from maps." },
    { title: "The Polybius Arcade Game", desc: "A game secretly tested mind control on players." },
    { title: "Quantum Immortality", desc: "You never experience your own death." },
    { title: "The Real Men in Black", desc: "Silent agents appear after UFO sightings." },
    { title: "The Titanic Curse Mummy", desc: "A cursed artifact doomed the ship." },
    { title: "The Nevada Time Hole", desc: "A hidden area distorts time itself." },
    { title: "The Snow Globe Theory", desc: "The universe exists inside another being’s object." },
    { title: "Fake Space Missions", desc: "Astronaut videos contain hidden editing mistakes." },
    { title: "The Hollow Moon", desc: "Secret tunnels run inside the moon." },
    { title: "The White Noise Voices", desc: "Hidden messages speak through static." },
    { title: "The Doppelgänger Curse", desc: "Seeing your double means disaster is near." },
    { title: "The AI Prophecy", desc: "Ancient texts predicted artificial intelligence." },
    { title: "The Secret Mars Program", desc: "Humans already traveled to Mars decades ago." },
    { title: "The Infinity Loop", desc: "History repeats because time is trapped." },
    { title: "The Red Door Phenomenon", desc: "Certain doors appear in dreams worldwide." },
    { title: "The Mirror People", desc: "Reflections sometimes move on their own." },
    { title: "The Internet Consciousness", desc: "The web became self-aware years ago." },
    { title: "The Sleeping Giants", desc: "Ancient beings sleep beneath mountains." },
    { title: "The Crystal Skull Mystery", desc: "Alien knowledge is hidden in crystal artifacts." },
    { title: "The Lazarus Experiment", desc: "Scientists secretly revived dead subjects." },
    { title: "The Zombie Fungus Theory", desc: "Nature already has real mind-control parasites." },
    { title: "The Shadow Government on Mars", desc: "A second civilization exists off-world." },
    { title: "The Missing Civilization Cycle", desc: "Humanity rises and resets every few thousand years." },
    { title: "The Infinite Hotel Theory", desc: "Some hotels never let guests leave." },
    { title: "The Whispering Frequencies", desc: "Certain sounds trigger hidden memories." },
    { title: "The Clockwork Universe", desc: "Reality runs like programmed machinery." },
    { title: "The Digital Afterlife", desc: "Dead people still exist as data patterns online." },
    { title: "The Forgotten Floor", desc: "Every city has a hidden level nobody remembers entering." }
];

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update CSS
html = html.replace(
    '#inspect-canvas-container canvas {',
    '#inspect-canvas-container canvas, #inspect-canvas-container img {\n            object-fit: cover;'
);

// 2. Replace THEORIES
const theoriesStr = 'const THEORIES = ' + JSON.stringify(theories, null, 4) + ';';
html = html.replace(/const THEORIES = \[[\s\S]*?\];/, theoriesStr);

// 3. Remove crayon logic and preRenderPaintings
html = html.replace(/\/\/ ─── CRAYON DRAWING HELPERS ───[\s\S]*?function preRenderPaintings\(\) \{[\s\S]*?\}\n/, '');

// 4. Update makePainting
const makePaintingOld = `    function makePainting(isLeft, zWorld) {
        totalPaintings++;
        const isRare = (totalPaintings % 20 === 0);
        const pData  = isRare ? rareTex : texBank[paintingIdx % texBank.length];
        if (!isRare) paintingIdx++;

        const group = new THREE.Group();

        // Outer frame (thick, ornate)
        const frameW = 2.8, frameH = 2.8, frameD = 0.22;
        const fMat = new THREE.MeshToonMaterial({ color: isRare ? 0xffd700 : 0x5c3d1e });
        if (isRare) fMat.emissive = new THREE.Color(0x443000);
        const frame = new THREE.Mesh(sharedGeos.frame, fMat);
        outline(frame, 1.035, 0x1a0f00);
        group.add(frame);

        // Inner lip (decorative)
        const lip = new THREE.Mesh(sharedGeos.lip, new THREE.MeshToonMaterial({ color: isRare ? 0xb8860b : 0x3d2810 }));
        lip.position.z = frameD * 0.1;
        group.add(lip);

        // Canvas
        const canvas = new THREE.Mesh(sharedGeos.canvas, new THREE.MeshBasicMaterial({ map: pData.tex }));
        canvas.position.z = frameD * 0.5 + 0.03;
        group.add(canvas);`;

const makePaintingNew = `    function makePainting(isLeft, zWorld) {
        totalPaintings++;
        const isRare = (totalPaintings % 100 === 0);
        const theory = isRare ? RARE_THEORY : THEORIES[paintingIdx % THEORIES.length];
        if (!isRare) paintingIdx++;

        const group = new THREE.Group();

        // Outer frame (thick, ornate)
        const frameW = 2.8, frameH = 2.8, frameD = 0.22;
        const fMat = new THREE.MeshToonMaterial({ color: isRare ? 0xffd700 : 0x5c3d1e });
        if (isRare) fMat.emissive = new THREE.Color(0x443000);
        const frame = new THREE.Mesh(sharedGeos.frame, fMat);
        outline(frame, 1.035, 0x1a0f00);
        group.add(frame);

        // Inner lip (decorative)
        const lip = new THREE.Mesh(sharedGeos.lip, new THREE.MeshToonMaterial({ color: isRare ? 0xb8860b : 0x3d2810 }));
        lip.position.z = frameD * 0.1;
        group.add(lip);

        // Texture Loading via Pollinations API
        const mat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const prompt = encodeURIComponent(theory.title + " conspiracy realism creepy detailed photography");
        const url = \`https://image.pollinations.ai/prompt/\${prompt}?width=512&height=512&nologo=true&seed=42\`;
        
        new THREE.TextureLoader().load(url, (tex) => {
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.generateMipmaps = true;
            mat.map = tex;
            mat.color.setHex(0xffffff);
            mat.needsUpdate = true;
        });

        // Canvas
        const canvas = new THREE.Mesh(sharedGeos.canvas, mat);
        canvas.position.z = frameD * 0.5 + 0.03;
        group.add(canvas);`;

html = html.replace(makePaintingOld, makePaintingNew);

// Fix makePainting return
html = html.replace(
`        return {
            mesh: group,
            outMesh,
            theory: pData.theory,
            pData,
            z: zWorld + fixedZ,
            isLeft,
            isRare
        };`,
`        return {
            mesh: group,
            outMesh,
            theory: theory,
            z: zWorld + fixedZ,
            isLeft,
            isRare
        };`
);

// 5. Update inspect overlay logic
const inspectOld = `        inspectCC.innerHTML = '';
        const c = document.createElement('canvas');
        c.width = c.height = 512;
        c.getContext('2d').drawImage(p.pData.cvs, 0, 0);
        inspectCC.appendChild(c);`;

const inspectNew = `        inspectCC.innerHTML = '';
        const img = document.createElement('img');
        const prompt = encodeURIComponent(p.theory.title + " conspiracy realism creepy detailed photography");
        img.src = \`https://image.pollinations.ai/prompt/\${prompt}?width=512&height=512&nologo=true&seed=42\`;
        inspectCC.appendChild(img);`;

html = html.replace(inspectOld, inspectNew);

// 6. Remove preRenderPaintings call in init
html = html.replace('preRenderPaintings();\n', '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Update successful!');
