/**
 * game.js
 * Version Beta 5.5 FINAL - Animations Premium & Fixes UI
 */

// --- CONSTANTES ---
const PATHS = {
    PAYS: "./Pays",
    FUSIONS: "./Fusion Pays",
    IMG_PREFIX: "heureux_",
    EXT: ".PNG"
};

// --- STATE ---
const state = {
    player: { country: null, gender: 'm', name: '', lastname: '' },
    partner: { country: null, gender: 'f', name: '', lastname: '' },
    score: 0,
    isFusion: false,
    fusionKey: null,
    locked: false,
    // XP System
    xp: 0,
    level: 1
};

// --- DOM ELEMENTS ---
const dom = {
    loader: document.getElementById('loader'),
    loaderBar: document.getElementById('loader-bar'),
    app: document.getElementById('app'),

    // Inputs
    selP: document.getElementById('select-country-p'),
    selPart: document.getElementById('select-country-part'),
    nameP: document.getElementById('name-p'),
    lastP: document.getElementById('lastname-p'),
    namePart: document.getElementById('name-part'),
    lastPart: document.getElementById('lastname-part'),
    genderBtnsP: document.querySelectorAll('#gender-p .g-btn'),
    genderBtnsPart: document.querySelectorAll('#gender-part .g-btn'),
    diceP: document.getElementById('btn-dice-p'),
    dicePart: document.getElementById('btn-dice-part'),

    // Visuals
    imgP: document.getElementById('img-p'),
    phP: document.getElementById('ph-p'),
    imgPart: document.getElementById('img-part'),
    phPart: document.getElementById('ph-part'),
    centerPanel: document.getElementById('center-panel'),
    ring: document.getElementById('ring-progress'),
    scoreVal: document.getElementById('score-val'),
    badgeUnion: document.getElementById('badge-union'),
    badgeFusion: document.getElementById('badge-fusion'),
    statusMsg: document.getElementById('status-msg'),

    // Action
    btnUnion: document.getElementById('btn-union'),

    // Overlays
    flash: document.getElementById('flash-overlay'),
    canvas: document.getElementById('confetti-canvas'),
    heartsContainer: document.getElementById('particles-hearts'),

    // History
    btnHistory: document.getElementById('btn-history'),
    modalHistory: document.getElementById('modal-history'),
    listHistory: document.getElementById('history-list'),
    btnCloseHistory: document.getElementById('btn-history-close'),
    btnClearHistory: document.getElementById('btn-clear-history'),

    // Modal
    modal: document.getElementById('modal-union'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),
    modalBtn: document.getElementById('btn-modal-close'),

    // XP UI
    levelBadge: document.getElementById('level-badge'),
    xpBar: document.getElementById('xp-bar'),
    xpText: document.getElementById('xp-text')
};

// --- INIT ---
window.addEventListener('DOMContentLoaded', async () => {
    loadXP(); // Load saved XP first
    setupUI();
    bindEvents();

    // LOADER
    try {
        await loadAssets(); // Robust loading
        hideLoader();
    } catch (e) {
        console.error("Loader error", e);
        hideLoader();
    }
});

// 1. LOADER LOGIC
async function loadAssets() {
    // Check quelques images "clés" pour le réalisme
    const checks = ["France", "Algérie", "Maroc"].map(c => checkImg(c));

    // Fake progress
    let p = 0;
    const int = setInterval(() => {
        p = Math.min(p + 5, 90);
        dom.loaderBar.style.width = p + "%";
    }, 50);

    // On attend tout (block pas si erreur)
    await Promise.allSettled(checks);
    clearInterval(int);
    dom.loaderBar.style.width = "100%";
    await wait(400);
}

function checkImg(country) {
    return new Promise(r => {
        const i = new Image();
        i.src = `${PATHS.PAYS}/${country}/${PATHS.IMG_PREFIX}gauche${PATHS.EXT}`;
        i.onload = r; i.onerror = r;
    });
}

function hideLoader() {
    dom.loader.style.opacity = '0';
    setTimeout(() => {
        dom.loader.classList.add('hidden');
        dom.app.classList.add('visible');
    }, 500); // Respect transition css
}

// --- SETUP ---
function setupUI() {
    window.COUNTRIES.forEach(c => {
        dom.selP.add(new Option(c, c));
        dom.selPart.add(new Option(c, c));
    });
    // Defaults
    dom.selP.value = "";
    dom.selPart.value = "";
}

function bindEvents() {
    dom.selP.addEventListener('change', e => updateSelection('player', e.target.value));
    dom.selPart.addEventListener('change', e => updateSelection('partner', e.target.value));

    // Genders
    dom.genderBtnsP.forEach(b => b.addEventListener('click', () => setGender('player', b)));
    dom.genderBtnsPart.forEach(b => b.addEventListener('click', () => setGender('partner', b)));

    // Dice
    dom.diceP.addEventListener('click', () => genID('player'));
    dom.dicePart.addEventListener('click', () => genID('partner'));

    // Union
    dom.btnUnion.addEventListener('click', onUnionClick);

    // Modal Union
    dom.modalBtn.addEventListener('click', closeModal);
    dom.modal.addEventListener('click', (e) => { if (e.target === dom.modal) closeModal(); });

    // Modal History
    dom.btnHistory.addEventListener('click', openHistory);
    dom.btnCloseHistory.addEventListener('click', () => dom.modalHistory.close());
    dom.btnClearHistory.addEventListener('click', clearHistory);
    dom.modalHistory.addEventListener('click', (e) => { if (e.target === dom.modalHistory) dom.modalHistory.close(); });
}

// --- LOGIQUE METIER ---
function updateSelection(role, country) {
    if (state.locked) return;
    state[role].country = country;

    detectFusion();
    updateVisuals(role);
    calcScore();
}

function detectFusion() {
    const c1 = state.player.country;
    const c2 = state.partner.country;
    if (!c1 || !c2) { state.isFusion = false; return; }

    const key = [c1, c2].sort().join("|");
    if (window.FUSIONS[key]) {
        state.isFusion = true;
        state.fusionKey = key;
    } else {
        state.isFusion = false;
    }
}

function updateVisuals(role) {
    const data = state[role];
    const img = role === 'player' ? dom.imgP : dom.imgPart;
    const ph = role === 'player' ? dom.phP : dom.phPart;

    if (!data.country) {
        img.classList.add('hidden');
        ph.style.display = 'flex';
        return;
    }

    // Path Logic : /Pays/{Nom}/heureux_{gauche|droite}.PNG
    // ou /Fusion Pays/{NomFusion}/...
    let folder = `${PATHS.PAYS}/${data.country}`;
    if (state.isFusion && state.fusionKey) {
        folder = `${PATHS.FUSIONS}/${window.FUSIONS[state.fusionKey].folder}`;
    }

    const side = role === 'player' ? 'gauche' : 'droite';
    const src = `${folder}/${PATHS.IMG_PREFIX}${side}${PATHS.EXT}`; // heureux_gauche.PNG

    img.src = src;
    img.classList.remove('hidden');
    ph.style.display = 'none';

    img.onerror = () => {
        // Fallback discret
        img.classList.add('hidden');
        ph.style.display = 'flex';
        ph.innerText = data.country.substr(0, 2).toUpperCase();
    };
}

function setGender(role, btn) {
    if (state.locked) return;
    state[role].gender = btn.dataset.gender;
    const group = role === 'player' ? dom.genderBtnsP : dom.genderBtnsPart;
    group.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function genID(role) {
    const c = state[role].country || "World";
    const g = state[role].gender;

    // Safety check data
    const pool = window.AI_NAMES[c] || window.AI_NAMES["World"];
    const firsts = pool[g] || ["Alex"];
    const lasts = pool.last || ["Doe"];

    const f = firsts[Math.floor(Math.random() * firsts.length)];
    const l = lasts[Math.floor(Math.random() * lasts.length)];

    if (role === 'player') { dom.nameP.value = f; dom.lastP.value = l; }
    else { dom.namePart.value = f; dom.lastPart.value = l; }
}

function calcScore() {
    if (!state.player.country || !state.partner.country) {
        updateRing(0);
        dom.badgeFusion.style.display = 'none';
        dom.statusMsg.innerText = "Sélectionnez deux nations...";
        return;
    }

    if (state.isFusion) {
        state.score = 100;
        dom.badgeFusion.style.display = 'block';
        dom.statusMsg.innerText = "FUSION LÉGENDAIRE !";
    } else {
        dom.badgeFusion.style.display = 'none';
        // Hachage simple pour score stable par couple
        const str = state.player.country + state.partner.country;
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const rand = Math.abs(hash % 41) + 60; // 60-100%
        state.score = rand;

        dom.statusMsg.innerText = "Compatibilité calculée.";
    }

    updateRing(state.score);
}

function updateRing(pct) {
    dom.scoreVal.innerText = pct + "%";
    // Circle SVG : dasharray=440. offset = 440 * (1 - pct/100)
    const offset = 440 - (440 * pct / 100);
    dom.ring.style.strokeDashoffset = offset;
}

// --- ANIMATION UNION ---
async function onUnionClick() {
    if (!state.player.country || !state.partner.country) return;
    if (state.locked) return;

    lockUI(true);

    // 1. Flash & Shake
    dom.flash.classList.add('flash-active');
    dom.centerPanel.classList.add('shake');

    // 2. Pulse Circle
    dom.ring.parentElement.parentElement.classList.add('pulse');

    // 3. Particles
    spawnConfetti();
    spawnHearts();

    // 4. Save History (Auto)
    saveMarriage();

    // 5. Wait
    await wait(1200);

    // 6. Cleanup anims
    dom.flash.classList.remove('flash-active');
    dom.centerPanel.classList.remove('shake');
    dom.ring.parentElement.parentElement.classList.remove('pulse');

    // 7. Show Result
    showModal();
}

function saveMarriage() {
    const record = {
        date: new Date().toLocaleString(),
        pCountry: state.player.country,
        partCountry: state.partner.country,
        pName: dom.nameP.value || "Inconnu",
        partName: dom.namePart.value || "Inconnu",
        pGender: state.player.gender,
        partGender: state.partner.gender,
        score: state.score
    };

    let history = JSON.parse(localStorage.getItem('marriagesHistory') || "[]");
    history.unshift(record); // Add to top
    localStorage.setItem('marriagesHistory', JSON.stringify(history));

    // --- XP GAIN ---
    let xpGain = XP_PER_MARRIAGE;
    if (state.isFusion) xpGain += 25; // Bonus for Fusion!
    addXP(xpGain);
}

function openHistory() {
    const history = JSON.parse(localStorage.getItem('marriagesHistory') || "[]");
    dom.listHistory.innerHTML = "";

    if (history.length === 0) {
        dom.listHistory.innerHTML = "<div class='history-empty'>Aucune union célébrée pour le moment.</div>";
    } else {
        history.forEach(u => {
            const item = document.createElement('div');
            item.className = 'history-item';

            // Icons
            const iconP = u.pGender === 'm' ? '👨' : '🎀';
            const iconPart = u.partGender === 'm' ? '👨' : '🎀';

            item.innerHTML = `
                <div class="history-header">
                    <span>${u.pCountry} ❤️ ${u.partCountry}</span>
                    <span style="color:${u.score > 80 ? '#4ade80' : '#ffd700'}">${u.score}%</span>
                </div>
                <div class="history-names">
                    ${iconP} ${u.pName} & ${iconPart} ${u.partName}
                </div>
                <div class="history-meta">
                    <span>${u.date}</span>
                </div>
            `;
            dom.listHistory.appendChild(item);
        });
    }

    dom.modalHistory.showModal();
}

function clearHistory() {
    if (confirm("Effacer tout l'historique ?")) {
        localStorage.removeItem('marriagesHistory');
        openHistory(); // Refresh
    }
}

function lockUI(locked) {
    state.locked = locked;
    // On cible uniquement les boutons DE L'APP (pas ceux de la modale qui est hors de #app)
    const els = [...dom.app.querySelectorAll('button, select, input')];
    els.forEach(e => e.disabled = locked);
    dom.btnUnion.innerText = locked ? "CÉLÉBRATION..." : "CÉLÉBRER L'UNION";
}

// --- MODAL & PARTICLES ---
function showModal() {
    const c1 = state.player.country;
    const c2 = state.partner.country;

    dom.modalTitle.innerText = "Mariage Célébré 💍";
    dom.modalText.innerHTML = `<strong>${c1}</strong> et <strong>${c2}</strong><br>se sont unis pour le meilleur !<br><br>Compatibilité : <strong style="color:#ffd700">${state.score}%</strong>`;

    dom.modal.showModal();
    dom.badgeUnion.classList.add('show');
}

function closeModal() {
    dom.modal.close();
    lockUI(false);
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// -- CANVAS CONFETTI (Micro Engine) --
function spawnConfetti() {
    const ctx = dom.canvas.getContext('2d');
    dom.canvas.width = window.innerWidth;
    dom.canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#ffd700', '#ff007a', '#00e5ff', '#ffffff'];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: window.innerWidth / 2, y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
            size: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)],
            life: 100
        });
    }

    function loop() {
        ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
        let alive = false;
        particles.forEach(p => {
            if (p.life > 0) {
                alive = true;
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life--;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 100;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            }
        });
        if (alive) requestAnimationFrame(loop);
        else ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    }
    loop();
}

function spawnHearts() {
    dom.heartsContainer.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const h = document.createElement('div');
        h.className = 'heart';
        h.innerText = '❤️';
        h.style.left = (Math.random() * 100) + '%';
        h.style.top = (Math.random() * 100) + '%';
        h.style.animationDelay = (Math.random() * 0.5) + 's';
        dom.heartsContainer.appendChild(h);
    }
    setTimeout(() => dom.heartsContainer.innerHTML = '', 2500);
}

// =====================
// XP / LEVEL SYSTEM
// =====================

const XP_PER_MARRIAGE = 25; // Base XP per union
const XP_PER_LEVEL_BASE = 100; // XP needed for level 2

/**
 * Calculate XP required to reach a given level.
 * Formula: 100 * level (Linear for simplicity)
 */
function getXPForLevel(level) {
    return XP_PER_LEVEL_BASE * level;
}

/**
 * Load XP and Level from localStorage on init.
 */
function loadXP() {
    const saved = localStorage.getItem('playerProgress');
    if (saved) {
        const data = JSON.parse(saved);
        state.xp = data.xp || 0;
        state.level = data.level || 1;
    }
    updateXPUI();
}

/**
 * Save current XP and Level to localStorage.
 */
function saveXP() {
    localStorage.setItem('playerProgress', JSON.stringify({
        xp: state.xp,
        level: state.level
    }));
}

/**
 * Add XP and handle level-up logic.
 */
function addXP(amount) {
    state.xp += amount;

    // Check for level up
    let xpNeeded = getXPForLevel(state.level);
    while (state.xp >= xpNeeded) {
        state.xp -= xpNeeded;
        state.level++;
        xpNeeded = getXPForLevel(state.level);
        console.log(`🎉 Level Up! Now Level ${state.level}`);
    }

    saveXP();
    updateXPUI();
}

/**
 * Update the XP bar and level badge in the UI.
 */
function updateXPUI() {
    const xpNeeded = getXPForLevel(state.level);
    const percent = Math.min(100, (state.xp / xpNeeded) * 100);

    dom.levelBadge.innerText = `Niv. ${state.level}`;
    dom.xpBar.style.width = `${percent}%`;
    dom.xpText.innerText = `${state.xp} / ${xpNeeded} XP`;
}
