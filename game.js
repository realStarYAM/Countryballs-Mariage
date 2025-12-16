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

// Ring Rarity System
const RARITIES = {
    COMMON: {
        name: 'COMMON',
        label: 'Commun',
        color: '#9ca3af',
        emoji: '🤍',
        chance: 60,
        effects: ['Aucun effet spécial']
    },
    RARE: {
        name: 'RARE',
        label: 'Rare',
        color: '#3b82f6',
        emoji: '💙',
        chance: 25,
        effects: ['+5% Bonus XP', 'Chance de drop améliorée']
    },
    EPIC: {
        name: 'EPIC',
        label: 'Épique',
        color: '#a855f7',
        emoji: '💜',
        chance: 10,
        effects: ['+10% Bonus XP', '+5% Score compatibilité', 'Aura violette']
    },
    LEGENDARY: {
        name: 'LEGENDARY',
        label: 'Légendaire',
        color: '#f97316',
        emoji: '🧡',
        chance: 4,
        effects: ['+25% Bonus XP', '+10% Score compatibilité', 'Particules dorées', 'Prestige +1']
    },
    MYTHIC: {
        name: 'MYTHIC',
        label: 'Mythique',
        color: '#ef4444',
        emoji: '❤️',
        chance: 1,
        effects: ['+50% Bonus XP', '+20% Score compatibilité', 'Aura arc-en-ciel', 'Prestige +3', 'Titre spécial']
    }
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
    level: 1,
    // Ring Collection
    rings: [],
    totalRings: 0,
    // Credits System
    credits: 0
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
    loadingText: document.getElementById('loading-text'),
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
    xpText: document.getElementById('xp-text'),

    // Theme
    themeSelect: document.getElementById('select-theme'),

    // Ring Collection
    btnCollection: document.getElementById('btn-collection'),
    ringCount: document.getElementById('ring-count'),
    modalRing: document.getElementById('modal-ring'),
    ringRarityText: document.getElementById('ring-rarity-text'),
    ringCountries: document.getElementById('ring-countries'),
    ringCompatibility: document.getElementById('ring-compatibility'),
    ringParticlesContainer: document.getElementById('ring-particles'),
    btnRingCollect: document.getElementById('btn-ring-collect'),
    modalCollection: document.getElementById('modal-collection'),
    collectionGrid: document.getElementById('collection-grid'),
    btnCollectionClose: document.getElementById('btn-collection-close'),
    totalRingsDisplay: document.getElementById('total-rings'),
    mythicCount: document.getElementById('mythic-count'),
    legendaryCount: document.getElementById('legendary-count'),
    epicCount: document.getElementById('epic-count'),
    rareCount: document.getElementById('rare-count'),
    commonCount: document.getElementById('common-count'),

    // Audio
    btnAudio: document.getElementById('btn-audio'),

    // Events
    modalEvent: document.getElementById('modal-event'),
    eventIcon: document.getElementById('event-icon'),
    eventTitle: document.getElementById('event-title'),
    eventDescription: document.getElementById('event-description'),
    eventChoices: document.getElementById('event-choices'),

    // Achievements
    btnAchievements: document.getElementById('btn-achievements'),
    achievementCount: document.getElementById('achievement-count'),
    modalAchievements: document.getElementById('modal-achievements'),
    achievementsGrid: document.getElementById('achievements-grid'),
    achievementProgressText: document.getElementById('achievement-progress-text'),
    achievementProgressBar: document.getElementById('achievement-progress-bar'),
    btnAchievementsClose: document.getElementById('btn-achievements-close'),

    // Stats
    btnStats: document.getElementById('btn-stats'),
    modalStats: document.getElementById('modal-stats'),
    btnStatsClose: document.getElementById('btn-stats-close'),
    statMarriages: document.getElementById('stat-marriages'),
    statCountries: document.getElementById('stat-countries'),
    statAvgCompat: document.getElementById('stat-avg-compat'),
    statBestCompat: document.getElementById('stat-best-compat'),
    statRareRate: document.getElementById('stat-rare-rate'),
    statFusions: document.getElementById('stat-fusions'),
    statTotalXP: document.getElementById('stat-total-xp'),
    statPlaytime: document.getElementById('stat-playtime'),

    // Settings
    btnSettings: document.getElementById('btn-settings'),
    modalSettings: document.getElementById('modal-settings'),
    btnSettingsClose: document.getElementById('btn-settings-close'),
    btnExport: document.getElementById('btn-export'),
    btnImport: document.getElementById('btn-import'),
    importFile: document.getElementById('import-file'),
    btnReset: document.getElementById('btn-reset')
};

// --- INIT ---
window.addEventListener('DOMContentLoaded', async () => {
    loadTheme(); // Load saved theme first
    loadXP(); // Load saved XP
    loadCredits(); // Load saved credits
    setupUI();
    bindEvents();

    // Initialize audio button state
    updateAudioButton();

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

        // Scenario Loading Text
        if (window.scenarioManager && p % 20 === 0) {
            if (dom.loadingText) dom.loadingText.innerText = window.scenarioManager.getLoadingText();
        }
    }, 50);

    // On attend tout (block pas si erreur)
    await Promise.allSettled(checks);
    clearInterval(int);
    dom.loaderBar.style.width = "100%";
    if (dom.loadingText) dom.loadingText.innerText = "Lancement...";
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
    // Initialize audio on first user interaction
    let audioInitialized = false;
    const initAudio = async () => {
        if (!audioInitialized && window.audioEngine) {
            await window.audioEngine.init();
            window.audioEngine.startAmbientMusic(); // Start ambient loop
            audioInitialized = true;
        }
    };

    dom.selP.addEventListener('change', e => { initAudio(); window.audioEngine?.playClick(); updateSelection('player', e.target.value); });
    dom.selPart.addEventListener('change', e => { initAudio(); window.audioEngine?.playClick(); updateSelection('partner', e.target.value); });

    // Genders
    dom.genderBtnsP.forEach(b => b.addEventListener('click', () => { initAudio(); window.audioEngine?.playClick(); setGender('player', b); }));
    dom.genderBtnsPart.forEach(b => b.addEventListener('click', () => { initAudio(); window.audioEngine?.playClick(); setGender('partner', b); }));

    // Dice
    dom.diceP.addEventListener('click', () => { initAudio(); window.audioEngine?.playDiceRoll(); genID('player'); });
    dom.dicePart.addEventListener('click', () => { initAudio(); window.audioEngine?.playDiceRoll(); genID('partner'); });

    // Union
    dom.btnUnion.addEventListener('click', () => { initAudio(); onUnionClick(); });

    // Modal Union
    dom.modalBtn.addEventListener('click', () => { window.audioEngine?.playClick(); closeModal(); });
    dom.modal.addEventListener('click', (e) => { if (e.target === dom.modal) closeModal(); });

    // Modal History
    dom.btnHistory.addEventListener('click', () => { initAudio(); window.audioEngine?.playClick(); openHistory(); });
    dom.btnCloseHistory.addEventListener('click', () => { window.audioEngine?.playClick(); dom.modalHistory.close(); document.body.classList.remove('modal-open'); });
    dom.btnClearHistory.addEventListener('click', () => { window.audioEngine?.playClick(); clearHistory(); });
    dom.modalHistory.addEventListener('click', (e) => { if (e.target === dom.modalHistory) { dom.modalHistory.close(); document.body.classList.remove('modal-open'); } });

    // Theme Selector
    dom.themeSelect.addEventListener('change', (e) => { window.audioEngine?.playClick(); setTheme(e.target.value); });

    // Audio Toggle
    dom.btnAudio.addEventListener('click', () => { initAudio(); toggleAudio(); });

    // Achievements
    dom.btnAchievements.addEventListener('click', () => { window.audioEngine?.playClick(); openAchievements(); });
    dom.btnAchievementsClose.addEventListener('click', () => { window.audioEngine?.playClick(); dom.modalAchievements.close(); document.body.classList.remove('modal-open'); });
    dom.modalAchievements.addEventListener('click', (e) => { if (e.target === dom.modalAchievements) { dom.modalAchievements.close(); document.body.classList.remove('modal-open'); } });

    // Stats Modal
    dom.btnStats.addEventListener('click', () => { window.audioEngine?.playClick(); openStats(); });
    dom.btnStatsClose.addEventListener('click', () => { window.audioEngine?.playClick(); dom.modalStats.close(); document.body.classList.remove('modal-open'); });
    dom.modalStats.addEventListener('click', (e) => { if (e.target === dom.modalStats) { dom.modalStats.close(); document.body.classList.remove('modal-open'); } });

    // Settings Modal
    dom.btnSettings.addEventListener('click', () => { window.audioEngine?.playClick(); openSettings(); });
    dom.btnSettingsClose.addEventListener('click', () => { window.audioEngine?.playClick(); dom.modalSettings.close(); document.body.classList.remove('modal-open'); });
    dom.modalSettings.addEventListener('click', (e) => { if (e.target === dom.modalSettings) { dom.modalSettings.close(); document.body.classList.remove('modal-open'); } });

    // Save Actions
    dom.btnExport.addEventListener('click', () => { window.audioEngine?.playClick(); window.saveManager?.exportSave(); });
    dom.btnImport.addEventListener('click', () => { window.audioEngine?.playClick(); dom.importFile.click(); });
    dom.importFile.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            try {
                await window.saveManager?.importSave(e.target.files[0]);
                alert('Partie importée avec succès ! La page va se recharger.');
                location.reload();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
            e.target.value = '';
        }
    });
    dom.btnReset.addEventListener('click', () => {
        if (confirm('⚠️ Êtes-vous sûr de vouloir TOUT réinitialiser ?\n\nCette action est IRRÉVERSIBLE !')) {
            window.saveManager?.resetAllData();
            alert('Données réinitialisées ! La page va se recharger.');
            location.reload();
        }
    });

    // ESC Key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (dom.modal.open) closeModal();
            if (dom.modalHistory.open) { dom.modalHistory.close(); document.body.classList.remove('modal-open'); }
        }
    });
}

// --- LOGIQUE METIER ---
function updateSelection(role, country) {
    if (state.locked) return;
    state[role].country = country;

    detectFusion();
    updateVisuals(role);
    calcScore();

    // Update background dynamically
    if (window.updateDynamicBackground) {
        window.updateDynamicBackground(state.player.country, state.partner.country);
    }
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
        updateRing(state.score);
        return;
    }

    dom.badgeFusion.style.display = 'none';

    // === COMPATIBILITÉ INTELLIGENTE ===
    const c1 = state.player.country;
    const c2 = state.partner.country;

    // Base aléatoire stable (hash)
    const str = c1 + c2;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let base = Math.abs(hash % 31) + 40; // 40-70% base

    let bonus = 0;

    // BONUS: Même continent (+10%)
    const continent1 = getContinent(c1);
    const continent2 = getContinent(c2);
    if (continent1 && continent2 && continent1 === continent2) {
        bonus += 10;
    }

    // BONUS: Pays voisins (+15%)
    if (areNeighbors(c1, c2)) {
        bonus += 15;
    }

    // MALUS: Pays en conflit (-20%) - sauf si Calm Down actif
    if (areInConflict(c1, c2)) {
        if (window.powerManager?.isCalmDownActive()) {
            dom.statusMsg.innerText = "😌 Calm Down actif: malus annulé !";
        } else {
            bonus -= 20;
        }
    }

    // BONUS: Power Boost Love actif
    const powerBoost = window.powerManager?.consumeBoostLove() || 0;
    if (powerBoost > 0) {
        bonus += powerBoost;
        dom.statusMsg.innerText = `💕 Boost Love: +${powerBoost}% !`;
    }

    state.score = Math.max(30, Math.min(100, base + bonus)); // Clamp 30-100%
    if (!powerBoost && !window.powerManager?.isCalmDownActive()) {
        dom.statusMsg.innerText = "Compatibilité calculée.";
    }

    updateRing(state.score);
}

// Helpers pour compatibilité intelligente
function getContinent(country) {
    for (const [continent, countries] of Object.entries(window.CONTINENTS || {})) {
        if (countries.includes(country)) return continent;
    }
    return null;
}

function areNeighbors(c1, c2) {
    const neighbors = window.NEIGHBORS || {};
    return (neighbors[c1] && neighbors[c1].includes(c2)) || (neighbors[c2] && neighbors[c2].includes(c1));
}

function areInConflict(c1, c2) {
    const conflicts = window.CONFLICTS || [];
    return conflicts.some(pair => (pair[0] === c1 && pair[1] === c2) || (pair[0] === c2 && pair[1] === c1));
}

function updateRing(pct) {
    dom.scoreVal.innerText = pct + "%";
    // Circle SVG : dasharray=440. offset = 100 - pct (pathLength=100)
    const offset = 100 - pct;
    dom.ring.style.strokeDashoffset = offset;

    // === GLOW EFFECTS SELON SCORE ===
    const svg = dom.ring.parentElement;
    svg.classList.remove('ring-glow-red', 'ring-glow-yellow', 'ring-glow-green');

    if (pct < 50) {
        svg.classList.add('ring-glow-red');
    } else if (pct < 80) {
        svg.classList.add('ring-glow-yellow');
    } else {
        svg.classList.add('ring-glow-green');
    }
}

// --- ANIMATION UNION ---
async function onUnionClick() {
    if (!state.player.country || !state.partner.country) return;
    if (state.locked) return;

    lockUI(true);

    // AUDIO: Union celebration sound
    window.audioEngine?.playUnion();

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

    // 5. Collect Ring (NEW!)
    collectRing();

    // 6. Check Achievements
    window.checkAchievements?.(state);

    // 7. Wait
    await wait(1200);

    // 8. Cleanup anims
    dom.flash.classList.remove('flash-active');
    dom.centerPanel.classList.remove('shake');
    dom.ring.parentElement.parentElement.classList.remove('pulse');

    // 8. Show Result
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

    // Track stats
    window.statsTracker?.recordMarriage(
        state.player.country,
        state.partner.country,
        state.score,
        state.fusion !== null,
        state.fusion ? `${state.player.country}|${state.partner.country}` : null
    );

    // --- CREDITS GAIN ---
    let creditsGain = 25; // Base credits
    if (state.score >= 100) creditsGain += 25; // Perfect match bonus
    else if (state.score >= 80) creditsGain += 10; // High compat bonus
    if (state.isFusion) creditsGain += 15; // Fusion bonus

    // Power: Golden Emoji double les crédits
    if (window.powerManager?.consumeGoldenEmoji()) {
        creditsGain *= 2;
        window.powerManager.showToast('🌟 Golden Emoji: Crédits doublés !', 'success');
    }
    addCredits(creditsGain);

    // --- XP GAIN ---
    let xpGain = XP_PER_MARRIAGE;
    // Apply shop XP multiplier
    const xpMult = window.shopManager?.getXPMultiplier() || 1;
    xpGain = Math.floor(xpGain * xpMult);
    if (state.isFusion) xpGain += 25; // Bonus for Fusion!
    addXP(xpGain);

    // --- POWER GAIN ---
    let powerGain = 10; // Base power per union
    if (state.score >= 80) powerGain += 15; // High compat bonus
    if (state.isFusion) powerGain += 10; // Fusion bonus
    window.powerManager?.addPower(powerGain);
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
    document.body.classList.add('modal-open');
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

    // Si fusion, afficher nom du pays fusionné
    if (state.isFusion && state.fusionKey) {
        const fusionData = window.FUSIONS[state.fusionKey];
        dom.modalTitle.innerText = `🔥 FUSION : ${fusionData.name} 🔥`;
        dom.modalText.innerHTML = `<strong>${c1}</strong> et <strong>${c2}</strong><br>ont fusionné pour créer <strong style="color:#ffd700">${fusionData.name}</strong> !<br><br>${fusionData.desc}<br><br>Compatibilité : <strong style="color:#4ade80">100% PARFAIT</strong>`;
    } else {
        dom.modalTitle.innerText = "Mariage Célébré 💍";
        dom.modalText.innerHTML = `<strong>${c1}</strong> et <strong>${c2}</strong><br>se sont unis pour le meilleur !<br><br>Compatibilité : <strong style="color:#ffd700">${state.score}%</strong>`;
    }

    dom.modal.showModal();
    document.body.classList.add('modal-open');
    dom.badgeUnion.classList.add('show');
}

function closeModal() {
    dom.modal.close();
    document.body.classList.remove('modal-open');
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

    // AUDIO: XP gain sound
    window.audioEngine?.playXPGain();

    // Track in stats
    window.statsTracker?.recordXP(amount);

    // Check for level up
    let xpNeeded = getXPForLevel(state.level);
    let leveledUp = false;
    while (state.xp >= xpNeeded) {
        state.xp -= xpNeeded;
        state.level++;
        xpNeeded = getXPForLevel(state.level);
        leveledUp = true;
        console.log(`🎉 Level Up! Now Level ${state.level}`);

        // CREDITS BONUS on level up!
        addCredits(50);
    }

    // AUDIO: Level up fanfare
    if (leveledUp) {
        window.audioEngine?.playLevelUp();

        // CHECK FOR SCENARIO
        if (window.scenarioManager?.checkProgression(state.level)) {
            // Priority to scenario
            return;
        }

        // CHECK FOR EVENT TRIGGER
        checkForEvent();
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

// =====================
// CREDITS SYSTEM
// =====================

/**
 * Load credits from localStorage on init.
 */
function loadCredits() {
    const saved = localStorage.getItem('playerCredits');
    if (saved) {
        state.credits = parseInt(saved, 10) || 0;
    }
    updateCreditsDisplay();
}

/**
 * Save current credits to localStorage.
 */
function saveCredits() {
    localStorage.setItem('playerCredits', state.credits.toString());
}

/**
 * Add credits and show animation.
 */
function addCredits(amount) {
    if (amount <= 0) return;

    state.credits += amount;
    saveCredits();
    updateCreditsDisplay();

    // Show floating +credits animation
    showCreditsGain(amount);

    // Update shop display if open
    window.shopManager?.updateCreditsDisplay();

    console.log(`+${amount} crédits ! Total: ${state.credits}`);
}

/**
 * Spend credits (returns true if successful).
 */
function spendCredits(amount) {
    if (amount <= 0) return true;
    if (state.credits < amount) return false;

    state.credits -= amount;
    saveCredits();
    updateCreditsDisplay();

    // Update shop display if open
    window.shopManager?.updateCreditsDisplay();

    console.log(`-${amount} crédits ! Reste: ${state.credits}`);
    return true;
}

/**
 * Update the credits display in the UI.
 */
function updateCreditsDisplay() {
    const creditsEl = document.getElementById('credits-display');
    if (creditsEl) {
        creditsEl.textContent = state.credits;
    }
}

/**
 * Show floating credits gain animation.
 */
function showCreditsGain(amount) {
    const el = document.createElement('div');
    el.className = 'credits-gain';
    el.innerHTML = `+${amount} 💎`;
    document.body.appendChild(el);

    // Remove after animation
    setTimeout(() => el.remove(), 1500);
}

// =====================
// THEME SYSTEM
// =====================

/**
 * Load saved theme from localStorage and apply it.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    dom.themeSelect.value = savedTheme;
    applyThemeClass(savedTheme);
}

/**
 * Set and save a new theme.
 */
function setTheme(themeName) {
    localStorage.setItem('selectedTheme', themeName);
    applyThemeClass(themeName);
}

/**
 * Apply theme by updating body class.
 */
function applyThemeClass(themeName) {
    // Remove all existing theme classes
    document.body.classList.remove(
        'theme-ubuntu', 'theme-aero', 'theme-win95', 'theme-winxp',
        'theme-ios', 'theme-android', 'theme-oneui', 'theme-miui', 'theme-google'
    );

    // Apply new theme class (default has no class)
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
}

// =====================
// RING COLLECTION SYSTEM
// =====================

/**
 * Calculate ring rarity based on score and fusion status
 */
function getRingRarity(score) {
    // Fusion = always Legendary or Mythic
    if (state.isFusion) {
        return Math.random() < 0.8 ? 'LEGENDARY' : 'MYTHIC';
    }

    // Base random chance
    let roll = Math.random() * 100;

    // Bonus for high compatibility
    if (score >= 90) roll -= 20;
    else if (score >= 80) roll -= 10;

    // Determine rarity
    if (roll < 1) return 'MYTHIC';
    if (roll < 5) return 'LEGENDARY';
    if (roll < 15) return 'EPIC';
    if (roll < 40) return 'RARE';
    return 'COMMON';
}

/**
 * Show ring celebration modal with animations and particles
 */
async function showRingCelebration(ring) {
    const rarityData = RARITIES[ring.rarity];

    // Set rarity text and class
    dom.ringRarityText.innerText = `${rarityData.emoji} ${rarityData.label.toUpperCase()} RING`;
    dom.ringRarityText.className = 'ring-rarity-title rarity-' + ring.rarity.toLowerCase();

    // Set ring info
    const countries = ring.isFusion
        ? `${ring.countries[0]} + ${ring.countries[1]} = ${window.FUSIONS[ring.fusionKey].name}`
        : `${ring.countries[0]} ❤️ ${ring.countries[1]}`;

    dom.ringCountries.innerHTML = `<strong>${countries}</strong>`;
    dom.ringCompatibility.innerText = `Compatibilité : ${ring.compatibility}%`;

    // Show modal
    dom.modalRing.showModal();
    document.body.classList.add('modal-open');

    // Spawn ring particles based on rarity
    await wait(600); // Wait for beam animation
    spawnRingParticles(ring.rarity);
}

/**
 * Spawn particles based on rarity
 */
function spawnRingParticles(rarity) {
    const configs = {
        COMMON: { count: 20, colors: ['#9ca3af', '#d1d5db'] },
        RARE: { count: 40, colors: ['#3b82f6', '#60a5fa', '#93c5fd'] },
        EPIC: { count: 60, colors: ['#a855f7', '#c084fc', '#e9d5ff'] },
        LEGENDARY: { count: 100, colors: ['#f97316', '#fb923c', '#ffd700'] },
        MYTHIC: { count: 150, colors: ['#ef4444', '#ec4899', '#fbbf24', '#ffffff'] }
    };

    const config = configs[rarity];
    dom.ringParticlesContainer.innerHTML = '';

    for (let i = 0; i < config.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'ring-particle';

        // Random direction
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.cssText = `
            left: 50%;
            top: 50%;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
            background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation-delay: ${Math.random() * 0.3}s;
        `;

        dom.ringParticlesContainer.appendChild(particle);
    }

    // Clear after animation
    setTimeout(() => {
        if (dom.ringParticlesContainer) dom.ringParticlesContainer.innerHTML = '';
    }, 2000);
}

/**
 * Collect ring and add to collection
 */
function collectRing() {
    // Create ring object
    const ring = {
        id: Date.now() + Math.random(),
        rarity: getRingRarity(state.score),
        countries: [state.player.country, state.partner.country],
        names: [dom.nameP.value || 'Inconnu', dom.namePart.value || 'Inconnu'],
        compatibility: state.score,
        date: new Date().toLocaleString(),
        isFusion: state.isFusion,
        fusionKey: state.fusionKey
    };

    // AUDIO: Ring drop sound based on rarity
    window.audioEngine?.playRingDrop(ring.rarity);

    // Add to collection
    state.rings.unshift(ring);
    state.totalRings++;

    // Save to localStorage
    saveRings();

    // Track ring in stats
    window.statsTracker?.recordRing(ring.rarity);

    // Update UI
    updateRingCountDisplay();
    updateAchievementCounter();

    // Show celebration modal
    showRingCelebration(ring);

    // Check achievements
    window.checkAchievements?.(state);
}

/**
 * Close ring celebration modal
 */
function closeRingModal() {
    dom.modalRing.close();
    document.body.classList.remove('modal-open');
    dom.ringParticlesContainer.innerHTML = '';
}

/**
 * Open collection modal
 */
function openCollection() {
    // Update stats
    updateCollectionStats();

    // Render collection grid
    renderCollection();

    // Show modal
    dom.modalCollection.showModal();
    document.body.classList.add('modal-open');
}

/**
 * Update collection stats display
 */
function updateCollectionStats() {
    const counts = {
        MYTHIC: 0,
        LEGENDARY: 0,
        EPIC: 0,
        RARE: 0,
        COMMON: 0
    };

    state.rings.forEach(ring => {
        counts[ring.rarity]++;
    });

    dom.totalRingsDisplay.innerText = state.totalRings;
    dom.mythicCount.innerText = counts.MYTHIC;
    dom.legendaryCount.innerText = counts.LEGENDARY;
    dom.epicCount.innerText = counts.EPIC;
    dom.rareCount.innerText = counts.RARE;
    dom.commonCount.innerText = counts.COMMON;
}

/**
 * Render collection grid
 */
function renderCollection() {
    dom.collectionGrid.innerHTML = '';

    if (state.rings.length === 0) {
        dom.collectionGrid.innerHTML = `
            <div class="collection-empty">
                Aucun anneau collecté pour le moment.<br>
                Célébrez des unions pour commencer votre collection !
            </div>
        `;
        return;
    }

    state.rings.forEach(ring => {
        const rarityData = RARITIES[ring.rarity];
        const card = document.createElement('div');
        card.className = `ring-card ${ring.rarity.toLowerCase()}`;

        const countries = ring.isFusion
            ? window.FUSIONS[ring.fusionKey]?.name || 'Fusion'
            : `${ring.countries[0]} + ${ring.countries[1]}`;

        // Generate ring name
        const ringName = ring.isFusion
            ? `Anneau de ${window.FUSIONS[ring.fusionKey]?.name}`
            : `Anneau d'Union`;

        // Generate effects list
        const effectsList = rarityData.effects.map(e => `• ${e}`).join('<br>');

        card.innerHTML = `
            <div class="ring-emoji">💍</div>
            <div class="ring-label" style="color: ${rarityData.color}">
                ${rarityData.emoji} ${rarityData.label}
            </div>
            <div class="ring-info">
                ${countries}<br>
                ${ring.compatibility}%
            </div>
        `;

        // Attach Tooltip Data & Events
        card.addEventListener('mouseenter', (e) => showGlobalTooltip(e, ring, rarityData));
        card.addEventListener('mouseleave', hideGlobalTooltip);

        dom.collectionGrid.appendChild(card);
    });
}

// =====================
// GLOBAL TOOLTIP SYSTEM
// =====================

// Create tooltip element on load
const tooltipEl = document.createElement('div');
tooltipEl.id = 'global-tooltip';
tooltipEl.className = 'ring-tooltip global-tooltip-hidden';
document.body.appendChild(tooltipEl);

function showGlobalTooltip(e, ring, rarityData) {
    const ringName = ring.isFusion
        ? `Anneau de ${window.FUSIONS[ring.fusionKey]?.name}`
        : `Anneau d'Union`;

    const effectsList = rarityData.effects.map(eff => `• ${eff}`).join('<br>');

    // Set Content
    tooltipEl.style.borderColor = rarityData.color;
    tooltipEl.innerHTML = `
        <div class="tooltip-title" style="color: ${rarityData.color}">
            ${ringName}
        </div>
        <div class="tooltip-rarity">
            ${rarityData.emoji} ${rarityData.label.toUpperCase()}
        </div>
        <div class="tooltip-stats">
            <strong>Union:</strong> ${ring.isFusion ? window.FUSIONS[ring.fusionKey]?.name : ring.countries.join(' + ')}<br>
            <strong>Compatibilité:</strong> ${ring.compatibility}%<br>
            <strong>Noms:</strong> ${ring.names[0]} & ${ring.names[1]}<br>
            <strong>Date:</strong> ${ring.date}
        </div>
        <div class="tooltip-effects">
            <strong>✨ Effets spéciaux:</strong><br>
            ${effectsList}
        </div>
    `;

    // Position Tooltip
    updateTooltipPosition(e.currentTarget);

    // Show
    tooltipEl.classList.remove('global-tooltip-hidden');
    tooltipEl.classList.add('global-tooltip-visible');
}

function hideGlobalTooltip() {
    tooltipEl.classList.remove('global-tooltip-visible');
    tooltipEl.classList.add('global-tooltip-hidden');
}

function updateTooltipPosition(targetCard) {
    const rect = targetCard.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    // Default: Above the card
    let top = rect.top - tooltipRect.height - 15;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // Check if goes off-screen top
    if (top < 10) {
        // Move to bottom
        top = rect.bottom + 15;
        tooltipEl.setAttribute('data-pos', 'bottom');
    } else {
        tooltipEl.setAttribute('data-pos', 'top');
    }

    // Check left/right edges
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
}

/**
 * Update ring count display in header
 */
function updateRingCountDisplay() {
    dom.ringCount.innerText = state.totalRings;
}

/**
 * Save rings to localStorage
 */
function saveRings() {
    localStorage.setItem('ringsCollection', JSON.stringify({
        rings: state.rings,
        totalRings: state.totalRings
    }));
}

/**
 * Load rings from localStorage
 */
function loadRings() {
    const saved = localStorage.getItem('ringsCollection');
    if (saved) {
        const data = JSON.parse(saved);
        state.rings = data.rings || [];
        state.totalRings = data.totalRings || 0;
    }
    updateRingCountDisplay();
}

// =====================
// EVENT SYSTEM INTEGRATION
// =====================

/**
 * Check if an event should trigger
 */
function checkForEvent() {
    if (!window.eventSystem) return;

    if (window.eventSystem.shouldTriggerEvent(state.level)) {
        const event = window.eventSystem.getRandomEvent(state);
        if (event) {
            // Delay to let level-up animation finish
            setTimeout(() => showEvent(event), 1500);
        }
    }
}

/**
 * Display event modal with choices
 */
function showEvent(event) {
    dom.eventIcon.textContent = event.image;
    dom.eventTitle.textContent = event.title;
    dom.eventDescription.textContent = event.description;

    // Clear previous choices
    dom.eventChoices.innerHTML = '';

    // Create choice buttons
    event.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'event-choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', () => handleEventChoice(event, choice, btn));
        dom.eventChoices.appendChild(btn);
    });

    dom.modalEvent.showModal();
    document.body.classList.add('modal-open');
}

/**
 * Handle event choice selection
 */
async function handleEventChoice(event, choice, btnElement) {
    // Disable all buttons
    const allBtns = dom.eventChoices.querySelectorAll('.event-choice-btn');
    allBtns.forEach(b => b.disabled = true);

    // Apply effect
    const result = choice.effect(state);

    // Play audio if specified
    if (choice.audio && window.audioEngine) {
        window.audioEngine[choice.audio]();
    }

    // Show result
    const resultDiv = document.createElement('div');
    resultDiv.className = 'event-result';
    resultDiv.textContent = result;
    dom.eventChoices.appendChild(resultDiv);

    // Update UI if XP changed
    updateXPUI();
    updateRingCountDisplay();
    saveXP();
    saveRings();

    // Wait then close
    await wait(2500);
    dom.modalEvent.close();
    document.body.classList.remove('modal-open');
}

// =====================
// ACHIEVEMENT SYSTEM
// =====================

/**
 * Open achievements modal and render grid
 */
function openAchievements() {
    if (!window.achievementSystem) return;

    const progress = window.achievementSystem.getProgress();

    // Update progress
    dom.achievementProgressText.textContent = `${progress.unlocked} / ${progress.total} débloqués`;
    dom.achievementProgressBar.style.width = `${progress.percentage}%`;

    // Render grid
    dom.achievementsGrid.innerHTML = '';

    ACHIEVEMENTS.forEach(achievement => {
        const card = document.createElement('div');
        const isUnlocked = window.achievementSystem.isUnlocked(achievement.id);
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;

        dom.achievementsGrid.appendChild(card);
    });

    // Show modal
    dom.modalAchievements.showModal();
    document.body.classList.add('modal-open');
}

/**
 * Update achievement counter in header
 */
function updateAchievementCounter() {
    if (!window.achievementSystem || !dom.achievementCount) return;

    const progress = window.achievementSystem.getProgress();
    dom.achievementCount.textContent = `${progress.unlocked}/${progress.total}`;
}

// =====================
// STATS & SETTINGS
// =====================

/**
 * Open stats modal and display all metrics
 */
function openStats() {
    if (!window.statsTracker) return;

    const stats = window.statsTracker.getCalculatedStats();

    // Update all stat values
    dom.statMarriages.textContent = stats.totalMarriages;
    dom.statCountries.textContent = `${stats.countriesDiscovered}/${stats.countriesTotal}`;
    dom.statAvgCompat.textContent = `${stats.avgCompatibility}%`;
    dom.statBestCompat.textContent = `${stats.bestCompatibility}%`;
    dom.statRareRate.textContent = `${stats.rareRate}%`;
    dom.statFusions.textContent = `${stats.fusionsRealized}/${stats.fusionsTotal}`;
    dom.statTotalXP.textContent = stats.totalXPEarned;
    dom.statPlaytime.textContent = stats.playTime;

    dom.modalStats.showModal();
    document.body.classList.add('modal-open');
}

/**
 * Open settings modal
 */
function openSettings() {
    dom.modalSettings.showModal();
    document.body.classList.add('modal-open');
}

// =====================
// AUDIO CONTROLS
// =====================

/**
 * Toggle audio mute/unmute
 */
function toggleAudio() {
    if (!window.audioEngine) return;

    const isEnabled = window.audioEngine.toggleMute();
    updateAudioButton(isEnabled);
}

/**
 * Update audio button UI state
 */
function updateAudioButton(isEnabled = null) {
    if (!window.audioEngine || !dom.btnAudio) return;

    // Get current state if not provided
    if (isEnabled === null) {
        isEnabled = !window.audioEngine.getMuteState();
    }

    if (isEnabled) {
        dom.btnAudio.textContent = '🔊 Son';
        dom.btnAudio.classList.remove('muted');
        dom.btnAudio.classList.add('active');
    } else {
        dom.btnAudio.textContent = '🔇 Son';
        dom.btnAudio.classList.remove('active');
        dom.btnAudio.classList.add('muted');
    }
}

// Add ring event listeners
window.addEventListener('DOMContentLoaded', () => {
    loadRings(); // Load rings on startup

    // Collection button
    dom.btnCollection.addEventListener('click', openCollection);

    // Ring celebration modal
    dom.btnRingCollect.addEventListener('click', closeRingModal);
    dom.modalRing.addEventListener('click', (e) => {
        if (e.target === dom.modalRing) closeRingModal();
    });

    // Collection modal
    dom.btnCollectionClose.addEventListener('click', () => {
        dom.modalCollection.close();
        document.body.classList.remove('modal-open');
    });
    dom.modalCollection.addEventListener('click', (e) => {
        if (e.target === dom.modalCollection) {
            dom.modalCollection.close();
            document.body.classList.remove('modal-open');
        }
    });

    // ESC key for ring modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (dom.modalRing.open) closeRingModal();
            if (dom.modalCollection.open) {
                dom.modalCollection.close();
                document.body.classList.remove('modal-open');
            }
        }
    });
});
