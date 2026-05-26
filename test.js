
    // ─── CONSTANTS ────────────────────────────────────────────────────
    const WALK_SPEED    = 0.045;
    const LANE_WIDTH    = 2.2;
    const SEG_LEN       = 12;
    const WALL_DIST     = 4.5;
    const WALL_H        = 10;
    const CHAR_SCALE    = 1.0;
    const CAM_Z_OFFSET  = 7;
    const CAM_Y_OFFSET  = 3.5;
    const FLOOR_W       = WALL_DIST * 2 + 2;

    // ─── STATE ────────────────────────────────────────────────────────
    let scene, camera, renderer, clock;
    let charGroup, charParts = {};
    let segments = [], paintings = [];
    let dustParticles, dustPositions;

    let currentLane   = 0;   // -1 left, 0 center, 1 right
    let targetLaneX   = 0;
    let gameState     = 'WALK';
    let activePainting = null;
    let seenPaintings  = new Set();
    let totalPaintings = 0;
    let isBlinking     = false;

    let camX = 0, camY = CAM_Y_OFFSET, camZ = CAM_Z_OFFSET;

    // ─── THEORIES ─────────────────────────────────────────────────────
const THEORIES = [
    { title: "Moon Landing Hoax", category: "Government", description: "In July 1969, NASA claimed to land humans on the Moon — but skeptics say the photos look too perfect. Shadows fall at odd angles, the flag waves in a vacuum, and Stanley Kubrick's 2001 looks suspiciously similar. The official story says it was real; the theorists say Kubrick directed the whole thing in a studio. Either way, the US had every reason to win the Space Race against the Soviets at any cost." },
    { title: "Flat Earth", category: "Science & Tech", description: "Believers say the Earth is a flat disc, with the Arctic at the center and a 150-foot ice wall (what we call Antarctica) forming the rim. NASA, airlines, and every government are allegedly colluding to hide this. Ships don't fall off the edge because the wall stops them. The sun and moon are small spotlights circling overhead — not distant celestial bodies." },
    { title: "The Illuminati", category: "Elite & Power", description: "A secret society of elites — bankers, politicians, celebrities — allegedly pulling every string on Earth. Founded in Bavaria in 1776, they supposedly never disbanded and now control the media, governments, and global finance. The all-seeing eye on the US dollar, Jay-Z's triangle hand gesture, and certain music videos are cited as open signals. Their goal: a single world government with them in charge." },
    { title: "Area 51", category: "Alien & Space", description: "A classified US Air Force base in the Nevada desert that the government denied even existed until 2013. Theorists say it houses crashed UFOs, alien bodies from Roswell, and reverse-engineered alien technology. The extreme secrecy, restricted airspace, and camouflage-uniformed gu <truncated 45215 bytes> age. The 'before and after 30' facial bone structure changes are attributed to the clone aging differently." },
    { title: "Nuclear Weapons Are a Bluff", category: "Government", description: "The theory: nuclear weapons don't actually work as described, and the entire deterrence regime is a mutually agreed fiction maintained by the five permanent UN Security Council members. The evidence cited: no wartime use since 1945, implausible yields described for bombs the size of a suitcase, and the fact that the only independent nuclear testing verification comes from the governments claiming to have the weapons." },
    { title: "The Sumerians Had Full Astronomical Knowledge", category: "Hidden History", description: "The Sumerian civilization of 3500 BCE had a fully formed pantheon, writing system, calendar, and astronomical record — appearing with no developmental period, unlike every other civilization. Their texts describe all eight planets of the solar system, including Uranus and Neptune — not discovered by modern astronomy until 1781 and 1846. Theorists say this knowledge was either inherited from an earlier advanced civilization or given by extraterrestrials they called the Anunnaki." },
    { title: "The Bilderberg Group Controls Policy", category: "Elite & Power", description: "Since 1954, around 130–140 of the world's most powerful people — heads of state, central bankers, military chiefs, tech CEOs — have met annually at the Bilderberg Group conference with no press, no minutes published, and no joint statement. What is decided is purely private. The group doesn't deny meeting — they release a rough topic list. Critics call it the world's most powerful unaccountable decision-making body." },
    { title: "The Taos Hum", category: "Science & Tech", description: "Since the 1990s, a small percentage of residents in Taos, New Mexi <truncated 10301 bytes>  NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need." }
];

    const RARE_THEORY = {
        title: "THE ARCHITECT",
        desc: "You were never supposed to find this room. The simulation is degrading. Close the tab. They are already watching you. WAKE UP."
    };
    THEORIES.sort(() => Math.random() - 0.5);

    // ─── AUDIO ────────────────────────────────────────────────────────
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    function initAudio() {
        if (!audioCtx) { audioCtx = new AudioCtxClass(); }
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }
    ['keydown','touchstart','mousedown','pointerdown'].forEach(e => document.addEventListener(e, initAudio, {once:true}));

    function playFootstep() {
        if (!audioCtx) return;
        try {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const now = audioCtx.currentTime;
            o.type = 'sine';
            o.frequency.setValueAtTime(90, now);
            o.frequency.exponentialRampToValueAtTime(28, now + 0.12);
            g.gain.setValueAtTime(0.12, now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(now); o.stop(now + 0.13);
        } catch(e) {}
    }

    function playOminousSting() {
        if (!audioCtx) return;
        try {
            [45, 54, 63].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                const now = audioCtx.currentTime + i * 0.6;
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(freq, now);
                o.frequency.linearRampToValueAtTime(freq * 0.7, now + 2);
                g.gain.setValueAtTime(0.22, now);
                g.gain.linearRampToValueAtTime(0.0001, now + 2);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now); o.stop(now + 2.1);
            });
        } catch(e) {}
    }

    
    // ─── VERTEX NOISE ─────────────────────────────────────────────────
    function wobble(geo, amt) {
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            pos.setXYZ(i,
                pos.getX(i) + (Math.random() - 0.5) * amt,
                pos.getY(i) + (Math.random() - 0.5) * amt,
                pos.getZ(i) + (Math.random() - 0.5) * amt
            );
        }
        geo.computeVertexNormals();
        return geo;
    }

    // ─── OUTLINE TRICK ────────────────────────────────────────────────
    function outline(mesh, scale = 1.06, color = 0x2a1508) {
        const m = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }));
        m.scale.setScalar(scale);
        mesh.add(m);
        return m;
    }

    // ─── THREE.JS INIT ────────────────────────────────────────────────
    function initThree() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf2ebdc);
        scene.fog = new THREE.FogExp2(0x9a8c7a, 0.035);

        camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 120);
        camera.position.set(0, CAM_Y_OFFSET, CAM_Z_OFFSET);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.shadowMap.enabled = false;
        document.getElementById('game-container').appendChild(renderer.domElement);

        // Lighting
        scene.add(new THREE.AmbientLight(0xffe8cc, 0.75));
        const dir = new THREE.DirectionalLight(0xfff2d9, 0.4);
        dir.position.set(3, 8, 4);
        scene.add(dir);

        clock = new THREE.Clock();

        // Floating dust
        const N = 600;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 25;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        dustPositions = geo.attributes.position;
        dustParticles = new THREE.Points(geo, new THREE.PointsMaterial({
            color: 0xffeebb, size: 0.12, transparent: true, opacity: 0.9, sizeAttenuation: true
        }));
        scene.add(dustParticles);
    }

    // ─── CUTE CHARACTER ───────────────────────────────────────────────
    function createCharacter() {
        charGroup = new THREE.Group();
        charGroup.position.y = 0;

        const cream  = new THREE.MeshToonMaterial({ color: 0xfffbef });
        const cream2 = new THREE.MeshToonMaterial({ color: 0xf5f0e0 });
        const brown  = new THREE.MeshToonMaterial({ color: 0x6d4c3d });
        const black  = new THREE.MeshBasicMaterial({ color: 0x1a1008 });
        const white  = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const blush  = new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.75 });
        const nose   = new THREE.MeshToonMaterial({ color: 0xffaacc });

        // ── BODY ──
        const bodyGeo = wobble(new THREE.SphereGeometry(0.9, 20, 16), 0.05);
        charParts.body = new THREE.Mesh(bodyGeo, cream);
        charParts.body.scale.set(1.05, 0.9, 1.0);
        charParts.body.position.y = 1.05;
        outline(charParts.body, 1.05);
        charGroup.add(charParts.body);

        // ── FLUFF puffs on body ──
        // Removed to make character less fluffy

        // ── HEAD ──
        const headGeo = wobble(new THREE.SphereGeometry(0.58, 20, 16), 0.03);
        charParts.head = new THREE.Mesh(headGeo, cream);
        charParts.head.scale.set(1.05, 1.0, 0.95);
        charParts.head.position.set(0, 0.78, 0.42);
        outline(charParts.head, 1.05);
        charParts.body.add(charParts.head);

        // Head fluff
        // Removed to make character less fluffy

        // ── EARS ──
        const earGeo = wobble(new THREE.SphereGeometry(0.18, 8, 8), 0.02);
        ['L','R'].forEach((s, i) => {
            const ear = new THREE.Mesh(earGeo, cream);
            ear.scale.set(0.8, 1.3, 0.7);
            ear.position.set((i === 0 ? -1 : 1) * 0.42, 0.45, 0.05);
            ear.rotation.z = (i === 0 ? 1 : -1) * 0.3;
            outline(ear, 1.08);
            charParts.head.add(ear);
        });

        // ── EYES (big, cute) ──
        ['L','R'].forEach((s, i) => {
            const side = i === 0 ? -1 : 1;
            // White sclera
            const sclera = new THREE.Mesh(wobble(new THREE.SphereGeometry(0.1, 10, 10), 0.005), white);
            sclera.position.set(side * 0.22, 0.1, 0.5);
            charParts.head.add(sclera);
            // Dark pupil
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.072, 8, 8), black);
            pupil.position.set(side * 0.22, 0.1, 0.56);
            charParts.head.add(pupil);
            charParts[`eye${s}`] = pupil;
            // Shine dot
            const shine = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), white);
            shine.position.set(side * 0.21, 0.13, 0.623);
            charParts.head.add(shine);
        });

        // ── BLUSH ──
        ['L','R'].forEach((s, i) => {
            const b = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), blush);
            b.position.set((i === 0 ? -1 : 1) * 0.42, 0.0, 0.36);
            b.rotation.y = (i === 0 ? -1 : 1) * 0.55;
            charParts.head.add(b);
        });

        // ── NOSE ──
        const noseM = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), nose);
        noseM.position.set(0, -0.05, 0.555);
        charParts.head.add(noseM);

        // ── TINY ARMS (stubby) ──
        ['L','R'].forEach((s, i) => {
            const side = i === 0 ? -1 : 1;
            const arm = new THREE.Mesh(wobble(new THREE.SphereGeometry(0.22, 8, 8), 0.03), cream);
            arm.scale.set(0.6, 1.0, 0.55);
            arm.position.set(side * 1.0, 0.05, 0.0);
            arm.rotation.z = side * 0.4;
            outline(arm, 1.08);
            charParts.body.add(arm);
            charParts[`arm${s}`] = arm;
        });

        // ── FEET ──
        ['L','R'].forEach((s, i) => {
            const side = i === 0 ? -1 : 1;
            const foot = new THREE.Mesh(wobble(new THREE.SphereGeometry(0.24, 10, 8), 0.03), brown);
            foot.scale.set(1.0, 0.55, 1.5);
            foot.position.set(side * 0.38, 0.12, 0.1);
            outline(foot, 1.1);
            charGroup.add(foot);
            charParts[`foot${s}`] = foot;
        });

        scene.add(charGroup);
    }

    // ─── GALLERY MATERIALS ────────────────────────────────────────────
    let wallMat, floorMat, ceilMat, moldingMat;
    let sharedGeos = {};

    function buildFloorTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 512;
        const ctx = c.getContext('2d');
        // Warm parquet planks
        const plankColors = ['#c4935a','#b88448','#d4a870','#c89060','#b87840'];
        const PW = 64, PH = 512;
        for (let col = 0; col < 8; col++) {
            ctx.fillStyle = plankColors[col % plankColors.length];
            ctx.fillRect(col * PW, 0, PW, PH);
            // Grain lines
            ctx.save(); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1.5;
            for (let g = 20; g < PH; g += 40 + Math.random() * 30) {
                ctx.beginPath(); ctx.moveTo(col*PW + 4, g); ctx.lineTo(col*PW + PW - 4, g + (Math.random() - 0.5) * 6);
                ctx.stroke();
            }
            ctx.restore();
            // Divider
            ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(col * PW, 0, 3, PH);
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2.5, SEG_LEN / 5);
        return t;
    }

    function initGalleryMaterials() {
        wallMat   = new THREE.MeshToonMaterial({ color: 0xf4ede0 });
        ceilMat   = new THREE.MeshToonMaterial({ color: 0xe8e0d0 });
        moldingMat = new THREE.MeshToonMaterial({ color: 0xd4b896 });
        floorMat  = new THREE.MeshToonMaterial({ map: buildFloorTexture() });

        // Pre-cache wobbly geometries to prevent GC stuttering (lag)
        sharedGeos.floor = wobble(new THREE.PlaneGeometry(FLOOR_W, SEG_LEN, 6, 12), 0.08);
        sharedGeos.wall = wobble(new THREE.BoxGeometry(0.8, WALL_H, SEG_LEN, 1, 6, 8), 0.15);
        sharedGeos.base = wobble(new THREE.BoxGeometry(0.12, 0.35, SEG_LEN, 1, 1, 4), 0.02);
        sharedGeos.crown = wobble(new THREE.BoxGeometry(0.1, 0.25, SEG_LEN, 1, 1, 4), 0.02);
        sharedGeos.ceil = wobble(new THREE.PlaneGeometry(FLOOR_W, SEG_LEN, 3, 6), 0.06);
        sharedGeos.div = new THREE.PlaneGeometry(FLOOR_W, 0.06);

        const frameW = 2.8, frameH = 2.8, frameD = 0.22;
        sharedGeos.frame = wobble(new THREE.BoxGeometry(frameW, frameH, frameD, 1, 1, 1), 0.02);
        sharedGeos.lip = new THREE.BoxGeometry(frameW - 0.2, frameH - 0.2, frameD * 0.5);
        sharedGeos.canvas = new THREE.PlaneGeometry(frameW - 0.5, frameH - 0.5);
        sharedGeos.plaque = wobble(new THREE.BoxGeometry(frameW * 0.7, 0.3, 0.08, 1, 1, 1), 0.01);
        sharedGeos.lampBase = new THREE.CylinderGeometry(0.1, 0.2, 0.35, 8);
        sharedGeos.lampShade = new THREE.ConeGeometry(0.3, 0.35, 8, 1, true);
    }

    // ─── PAINTING FACTORY ─────────────────────────────────────────────
    let paintingIdx = 0;

    function makePainting(isLeft, zWorld) {
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

        // Texture Loading via Picsum (Real photos, consistent seeds, no rate limits)
        const mat = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const seedStr = encodeURIComponent(theory.title.replace(/\s+/g, ''));
        const url = `https://picsum.photos/seed/${seedStr}/512/512?grayscale&blur=1`;
        
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        // Random delay to stagger load slightly
        setTimeout(() => {
            loader.load(url, (tex) => {
                tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                tex.minFilter = THREE.LinearMipmapLinearFilter;
                tex.generateMipmaps = true;
                mat.map = tex;
                mat.color.setHex(0xffffff);
                mat.needsUpdate = true;
            });
        }, Math.random() * 500);

        // Canvas
        const canvas = new THREE.Mesh(sharedGeos.canvas, mat);
        canvas.position.z = frameD * 0.5 + 0.03;
        group.add(canvas);

        // Outline mesh (for glow)
        const outMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.BackSide });
        const outMesh = new THREE.Mesh(sharedGeos.frame, outMat);
        outMesh.scale.setScalar(1.04);
        group.add(outMesh);

        // Position on wall
        const xPos = isLeft ? -(WALL_DIST - 0.15) : (WALL_DIST - 0.15);
        const fixedZ = 0; // center of segment
        group.position.set(xPos, 3.2, fixedZ);
        group.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;

        // Title plaque below
        const plaqueMat = new THREE.MeshToonMaterial({ color: 0xf2e8d0 });
        const plaque = new THREE.Mesh(sharedGeos.plaque, plaqueMat);
        plaque.position.y = -frameH / 2 - 0.25;
        outline(plaque, 1.05, 0x333);
        group.add(plaque);

        // Gallery lamp above
        const lampGroup = new THREE.Group();
        const base = new THREE.Mesh(sharedGeos.lampBase, new THREE.MeshToonMaterial({ color: 0xc8a040 }));
        outline(base, 1.06);
        lampGroup.add(base);
        const shade = new THREE.Mesh(sharedGeos.lampShade, new THREE.MeshToonMaterial({ color: 0xa07030, side: THREE.DoubleSide }));
        shade.position.y = -0.32;
        lampGroup.add(shade);
        const ptLight = new THREE.PointLight(0xffddaa, isRare ? 2.5 : 1.2, 8);
        ptLight.position.y = -0.5;
        lampGroup.add(ptLight);
        lampGroup.position.set(0, frameH / 2 + 0.5, 0);
        group.add(lampGroup);

        return {
            mesh: group,
            outMesh,
            theory: theory,
            z: zWorld + fixedZ,
            isLeft,
            isRare
        };
    }

    // ─── SEGMENT SYSTEM ───────────────────────────────────────────────
    function createSegment(index) {
        const grp   = new THREE.Group();
        const zOff  = -index * SEG_LEN;
        grp.position.z = zOff;

        // Floor
        const floorM = new THREE.Mesh(sharedGeos.floor, floorMat);
        floorM.rotation.x = -Math.PI / 2;
        grp.add(floorM);

        // Walls (left & right)
        [-1, 1].forEach(side => {
            const wall = new THREE.Mesh(sharedGeos.wall, wallMat);
            wall.position.set(side * (WALL_DIST + 0.4), WALL_H / 2, 0);
            grp.add(wall);

            // Baseboard molding
            const base = new THREE.Mesh(sharedGeos.base, moldingMat);
            base.position.set(side * WALL_DIST, 0.18, 0);
            grp.add(base);

            // Crown molding at top
            const crown = new THREE.Mesh(sharedGeos.crown, moldingMat);
            crown.position.set(side * WALL_DIST, WALL_H - 0.5, 0);
            grp.add(crown);
        });

        // Ceiling
        const ceil = new THREE.Mesh(sharedGeos.ceil, ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.y = WALL_H;
        grp.add(ceil);

        // Paintings on this segment
        const pL = makePainting(true,  zOff);
        const pR = makePainting(false, zOff);
        grp.add(pL.mesh);
        grp.add(pR.mesh);
        paintings.push(pL, pR);

        // Floor divider line between segments
        const divM   = new THREE.Mesh(sharedGeos.div, new THREE.MeshBasicMaterial({ color: 0x8a6a40, opacity: 0.5, transparent: true }));
        divM.rotation.x = -Math.PI / 2;
        divM.position.y = 0.001;
        divM.position.z = SEG_LEN / 2;
        grp.add(divM);

        scene.add(grp);
        return { grp, index };
    }

    function manageSegments() {
        const charZ  = charGroup.position.z;
        const curIdx = Math.floor(-charZ / SEG_LEN);

        for (let i = Math.max(0, curIdx - 1); i < curIdx + 6; i++) {
            if (!segments.find(s => s.index === i)) {
                segments.push(createSegment(i));
            }
        }
        segments = segments.filter(s => {
            if (s.index < curIdx - 2) {
                scene.remove(s.grp);
                paintings = paintings.filter(p => !s.grp.children.includes(p.mesh));
                return false;
            }
            return true;
        });
    }

    // ─── INTERACTION ──────────────────────────────────────────────────
    const inspectOverlay = document.getElementById('inspect-overlay');
    const inspectTitle   = document.getElementById('inspect-title');
    const inspectDesc    = document.getElementById('inspect-desc');
    const inspectCC      = document.getElementById('inspect-canvas-container');
    const controlsHint   = document.getElementById('controls-hint');
    const inspectHint    = document.getElementById('inspect-hint');

    setTimeout(() => { controlsHint.style.opacity = '0'; controlsHint.style.pointerEvents = 'none'; }, 9000);

    function openInspect(p) {
        gameState = 'INSPECT';
        inspectOverlay.style.display = 'flex';
        inspectTitle.innerText       = p.theory.title;
        inspectDesc.innerText        = p.theory.description || p.theory.desc;
        inspectTitle.className       = p.isRare ? 'rare-frame' : '';

        // Add Wikipedia / Reddit links with icons (removing Ask Claude)
        let existingLinks = document.getElementById('inspect-links');
        if (existingLinks) existingLinks.remove();
        
        const linksHtml = `
            <div id="inspect-links" style="margin-top: 25px; display: flex; gap: 15px; font-size: 1.1rem; justify-content: center;">
                <a href="https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(p.theory.title)}" target="_blank" style="color: #fff; text-decoration: none; display: flex; align-items: center; gap: 8px; background: #333; padding: 10px 18px; border-radius: 6px; font-weight: bold; border: 1px solid #555;">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M14.075 1.125a.75.75 0 0 1 .47 1.055l-5 12a.75.75 0 0 1-1.398-.035l-2.036-5.599-5.598-2.035a.75.75 0 0 1-.035-1.399l12-5a.75.75 0 0 1 1.054.469l.543 1.044z"/></svg>
                    Wikipedia
                </a>
                <a href="https://www.reddit.com/search/?q=${encodeURIComponent(p.theory.title)}" target="_blank" style="color: #fff; text-decoration: none; display: flex; align-items: center; gap: 8px; background: #ff4500; padding: 10px 18px; border-radius: 6px; font-weight: bold;">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15.54 7.63a2.53 2.53 0 0 0-2.31-2.48 5.6 5.6 0 0 0-3.32-.78l.64-3 2.56.54a1.76 1.76 0 1 0 .28-1.07l-2.82-.6a.37.37 0 0 0-.44.29l-.75 3.51a5.62 5.62 0 0 0-3.41.8 2.52 2.52 0 0 0-2.32 2.47 2.44 2.44 0 0 0 .52 1.54 4.56 4.56 0 0 0-.16 1.2c0 2.68 3.55 4.85 7.9 4.85s7.9-2.17 7.9-4.85a4.4 4.4 0 0 0-.15-1.18 2.44 2.44 0 0 0 .51-1.54M4.15 9.19a1.44 1.44 0 1 1 1.44-1.44 1.44 1.44 0 0 1-1.44 1.44m8.05 3.17c-1.58 1.58-5.32 1.63-5.32 1.63s-3.74-.05-5.32-1.63a.35.35 0 1 1 .5-.5c1.3 1.3 4.82 1.35 4.82 1.35s3.52-.05 4.82-1.35a.35.35 0 1 1 .5.5m-.35-3.17a1.44 1.44 0 1 1 1.44-1.44 1.44 1.44 0 0 1-1.44 1.44"/></svg>
                    Reddit
                </a>
            </div>
        `;
        inspectDesc.insertAdjacentHTML('afterend', linksHtml);

        inspectCC.innerHTML = '';
        const img = document.createElement('img');
        const seedStr = encodeURIComponent(p.theory.title.replace(/\s+/g, ''));
        img.src = `https://picsum.photos/seed/${seedStr}/512/512?grayscale`;
        inspectCC.appendChild(img);

        if (p.isRare) playOminousSting();
        if (!seenPaintings.has(p.theory.title)) {
            seenPaintings.add(p.theory.title);
            document.getElementById('seen-count').innerText = seenPaintings.size;
        }
    }

    function closeInspect() {
        gameState = 'WALK';
        inspectOverlay.style.display = 'none';
    }

    window.addEventListener('keydown', e => {
        if (gameState === 'INSPECT') {
            if (e.code === 'Escape' || e.code === 'Space') { e.preventDefault(); closeInspect(); }
            return;
        }
        e.preventDefault && ['ArrowLeft','ArrowRight','Space','KeyA','KeyD'].includes(e.code) && e.preventDefault();
        if (e.code === 'ArrowLeft'  || e.code === 'KeyA') { if (currentLane > -1) { currentLane--; targetLaneX = currentLane * LANE_WIDTH; } }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') { if (currentLane <  1) { currentLane++; targetLaneX = currentLane * LANE_WIDTH; } }
        if (e.code === 'Space' && activePainting) openInspect(activePainting);
    });

    let touchStartX = 0;
    window.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        if (gameState === 'INSPECT') { closeInspect(); return; }
        if (activePainting) { openInspect(activePainting); return; }
    }, { passive: true });
    window.addEventListener('touchend', e => {
        if (gameState === 'INSPECT') return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) < 12) return; // tap
        if (dx < 0 && currentLane > -1) { currentLane--; targetLaneX = currentLane * LANE_WIDTH; }
        if (dx > 0 && currentLane <  1) { currentLane++; targetLaneX = currentLane * LANE_WIDTH; }
    }, { passive: true });

    inspectOverlay.addEventListener('pointerdown', e => { if (e.target === inspectOverlay || e.target.id === 'inspect-close') closeInspect(); });

    // ─── MAIN LOOP ────────────────────────────────────────────────────
    let footTimer = 0;
    let blinkTimer = 3 + Math.random() * 3;
    let walkCycle  = 0;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function update() {
        requestAnimationFrame(update);
        const dt   = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        if (gameState === 'WALK') {
            // Auto-walk
            charGroup.position.z -= WALK_SPEED;
            walkCycle += WALK_SPEED * 4;

            // Smooth lane switching
            charGroup.position.x = lerp(charGroup.position.x, targetLaneX, 0.1);

            // Body tilt in direction of movement
            const leanAmount = (targetLaneX - charGroup.position.x) * 0.18;
            charGroup.rotation.z = lerp(charGroup.rotation.z, -leanAmount, 0.12);

            // Idle body bob
            charParts.body.position.y   = 1.05 + Math.sin(time * 3.5) * 0.045;
            charParts.body.rotation.z   = Math.sin(time * 2.2) * 0.025;

            // Walk squish
            const squish = 1.0 + Math.sin(walkCycle * 2) * 0.04;
            charParts.body.scale.set(1.05 / squish, 0.9 * squish, 1.0);

            // Foot swing
            const sw = Math.sin(walkCycle);
            charParts.footL.position.y = 0.12 + Math.max(0, sw) * 0.3;
            charParts.footL.position.z = sw * 0.4;
            charParts.footL.rotation.x = sw * 0.4;
            charParts.footR.position.y = 0.12 + Math.max(0, -sw) * 0.3;
            charParts.footR.position.z = -sw * 0.4;
            charParts.footR.rotation.x = -sw * 0.4;

            // Arm swing (opposite to feet)
            charParts.armL.rotation.x = -sw * 0.3;
            charParts.armR.rotation.x =  sw * 0.3;

            // Head slight look-around
            charParts.head.rotation.y = Math.sin(time * 0.8) * 0.12;

            // Footstep sound
            footTimer += WALK_SPEED;
            if (footTimer > 0.25) { playFootstep(); footTimer = 0; }

            // Blink
            blinkTimer -= dt;
            if (blinkTimer <= 0 && !isBlinking) {
                isBlinking = true;
                charParts.eyeL.scale.y = 0.08;
                charParts.eyeR.scale.y = 0.08;
                setTimeout(() => {
                    if (charParts.eyeL) { charParts.eyeL.scale.y = 1; charParts.eyeR.scale.y = 1; }
                    isBlinking = false;
                    blinkTimer = 3 + Math.random() * 4;
                }, 130);
            }

            manageSegments();
            document.getElementById('depth-count').innerText = Math.floor(-charGroup.position.z);
        }

        // Smooth camera follow
        const tCamX = charGroup.position.x * 0.45;
        const tCamY = charGroup.position.y + CAM_Y_OFFSET;
        const tCamZ = charGroup.position.z + CAM_Z_OFFSET;
        camX = lerp(camX, tCamX, 0.05);
        camY = lerp(camY, tCamY, 0.06);
        camZ = lerp(camZ, tCamZ, 0.08);
        camera.position.set(camX, camY, camZ);

        const lookX = lerp(camera.position.x, charGroup.position.x, 0.3);
        camera.lookAt(lookX, charGroup.position.y + 1.0, charGroup.position.z - 4);

        // Animate dust particles
        const dp = dustPositions;
        for (let i = 0; i < dp.count; i++) {
            let y = dp.getY(i) + 0.008 * Math.sin(time * 0.5 + i);
            if (y > 6) y = 0;
            dp.setY(i, y);
        }
        dp.needsUpdate = true;
        dustParticles.position.set(camX, 0, camZ - 8);

        // Painting proximity & glow
        activePainting = null;
        let closestD = Infinity;

        for (const p of paintings) {
            // Reset outline
            p.outMesh.material.color.setHex(0x111111);
            p.mesh.scale.setScalar(1.0);

            const pWorldZ = p.z;
            const dz = Math.abs(pWorldZ - charGroup.position.z);
            const charSide = Math.sign(charGroup.position.x) || 0;
            const pSide    = p.isLeft ? -1 : 1;

            if (dz < 4.0 && (charSide === pSide || Math.abs(charGroup.position.x) < 0.8)) {
                if (dz < closestD) { closestD = dz; activePainting = p; }
            }
        }

        if (activePainting) {
            const pulse = 0.5 + Math.sin(time * 6) * 0.5;
            const gc = activePainting.isRare ? 0xffcc00 : 0xffaa33;
            activePainting.outMesh.material.color.setHex(gc);
            const sc = 1.03 + pulse * 0.015;
            activePainting.mesh.scale.setScalar(sc);
            inspectHint.style.display = 'block';
        } else {
            inspectHint.style.display = 'none';
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });

    // ─── BOOTSTRAP ────────────────────────────────────────────────────
    function init() {
        initThree();
        initGalleryMaterials();
                createCharacter();
        manageSegments();
        update();
    }
    init();
    