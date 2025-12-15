/**
 * Countryballs Mariage RPG
 * Game Logic
 * No external dependencies
 */

// ==================== CONFIGURATION ====================

const CONFIG = {
    XP_PER_LEVEL: 100,
    STORAGE_KEY: 'countryballs_rpg_v2',
    MAX_HISTORY: 20,
    EVENT_COOLDOWN: 10000 // 10s
};

const THEMES = {
    classique: { icon: '❤️', vibe: 'Classique' },
    dragonball: { icon: '⭐️', vibe: 'Dragon Ball' },
    onepiece: { icon: '☠️', vibe: 'One Piece' },
    naruto: { icon: '🌀', vibe: 'Naruto' },
    ios: { icon: '🍏', vibe: 'iOS' },
    windows: { icon: '🪟', vibe: 'Windows' },
    macos: { icon: '🍎', vibe: 'macOS' },
    oneui: { icon: '🌌', vibe: 'One UI' },
    ubuntu: { icon: '🟠', vibe: 'Ubuntu' },
    deepin: { icon: '💠', vibe: 'Deepin' },
    android: { icon: '🤖', vibe: 'Android' },
    miui: { icon: '🧡', vibe: 'MIUI' },
    hyperos: { icon: '💎', vibe: 'HyperOS' }
};

const XP_REWARDS = {
    COUNTRY_CHANGE: 10,
    NAME_CHANGE: 5,
    DIFFERENT_COUNTRIES: 20
};

// Données Pays
const COUNTRY_DATA = {
    'Algérie': { continent: 'Afrique', neighbors: ['Tunisie', 'Maroc'] },
    'Allemagne': { continent: 'Europe', neighbors: ['France', 'Pologne', 'Belgique'] },
    'Belgique': { continent: 'Europe', neighbors: ['France', 'Allemagne'] },
    'Canada': { continent: 'Amérique', neighbors: ['États-Unis'] },
    'Corée du Sud': { continent: 'Asie', neighbors: ['Japon'] },
    'Espagne': { continent: 'Europe', neighbors: ['France', 'Portugal'] },
    'États-Unis': { continent: 'Amérique', neighbors: ['Canada'] },
    'France': { continent: 'Europe', neighbors: ['Allemagne', 'Belgique', 'Espagne', 'Italie'] },
    'Grèce': { continent: 'Europe', neighbors: [] },
    'Italie': { continent: 'Europe', neighbors: ['France'] },
    'Japon': { continent: 'Asie', neighbors: ['Corée du Sud'] },
    'Liban': { continent: 'Asie', neighbors: ['Palestine'] },
    'Maroc': { continent: 'Afrique', neighbors: ['Algérie'] },
    'Pakistan': { continent: 'Asie', neighbors: [] },
    'Palestine': { continent: 'Asie', neighbors: ['Liban'] },
    'Pologne': { continent: 'Europe', neighbors: ['Allemagne', 'Ukraine'] },
    'Portugal': { continent: 'Europe', neighbors: ['Espagne'] },
    'Royaume-Uni': { continent: 'Europe', neighbors: ['France'] },
    'Russie': { continent: 'Europe', neighbors: ['Ukraine', 'Pologne'] },
    'Tunisie': { continent: 'Afrique', neighbors: ['Algérie'] },
    'Ukraine': { continent: 'Europe', neighbors: ['Pologne', 'Russie'] }
};

const NAME_SETS = {
    Afrique: {
        prefixes: ['Aï', 'Ma', 'Is', 'Na', 'Ka', 'Sa', 'Ti', 'Sou', 'Ya', 'Za', 'Rya', 'Lya', 'Aya', 'Hani', 'Amel', 'Bahi', 'Zin', 'Mal', 'Lam', 'Nour'],
        middles: ['ra', 'ya', 'la', 'ma', 'di', 'ni', 'ss', 'dou', 'nou', 'fi', 'ri', 'ta', 'li', 'zi', 'zou', 'zra', 'dra', 'han', 'kh', 'zen'],
        suffixes: ['a', 'ine', 'iya', 'ya', 'an', 'el', 'ou', 'ia', 'ane', 'enne', 'i', 'us', 'is', 'ar', 'al', 'ène', 'aya', 'iri', 'oun', 'ette']
    },
    Europe: {
        prefixes: ['El', 'Mar', 'An', 'Lil', 'Jo', 'Na', 'Lu', 'Theo', 'Is', 'Vic', 'Ale', 'Leo', 'Alba', 'Max', 'Sof', 'Chi', 'Adr', 'Eva', 'Ine', 'Rom'],
        middles: ['en', 'ie', 'an', 'la', 'ri', 'lo', 'ta', 're', 'za', 'do', 'li', 'to', 'se', 'na', 'va', 'ca', 'ri', 'no', 'ga', 'lu'],
        suffixes: ['a', 'o', 'e', 'i', 'us', 'ine', 'ette', 'io', 'ia', 'él', 'el', 'ine', 'ien', 'ès', 'isse', 'on', 'as', 'or', 'ès', 'ine']
    },
    Asie: {
        prefixes: ['Haru', 'Mina', 'Aya', 'Sora', 'Ken', 'Yuna', 'Akira', 'Nao', 'Toru', 'Rin', 'Chen', 'Li', 'Yue', 'Kai', 'Mei', 'Suki', 'Da', 'Jun', 'Ren', 'Hina'],
        middles: ['mi', 'na', 'ri', 'ko', 'ta', 'ya', 'ji', 'an', 'shi', 'ra', 'yu', 'ho', 'li', 'mei', 'rei', 'no', 'ki', 'zu', 'to', 'sa'],
        suffixes: ['ko', 'shi', 'ta', 'ya', 'ji', 'na', 'ra', 'yu', 'li', 'an', 'lin', 'ren', 'hua', 'mei', 'ta', 'so', 'zen', 'do', 'sai', 'rin']
    },
    Amérique: {
        prefixes: ['Ava', 'Mia', 'Liam', 'Noa', 'Santi', 'Luz', 'Amar', 'Nova', 'Léo', 'Mateo', 'Gael', 'Sara', 'Luca', 'Mila', 'Rosa', 'Elio', 'Noel', 'Ana', 'Cam', 'Rio'],
        middles: ['ri', 'la', 'ro', 'na', 'mi', 'ta', 'do', 'le', 'ri', 'za', 'li', 'jo', 'sa', 'ne', 'te', 'lu', 'ma', 'ca', 'ra', 'vi'],
        suffixes: ['a', 'o', 'e', 'el', 'ia', 'ar', 'ez', 'ia', 'ito', 'ina', 'on', 'en', 'es', 'an', 'el', 'ia', 'iel', 'son', 's', 'ah']
    },
    Global: {
        prefixes: ['Ar', 'El', 'Ka', 'No', 'Sa', 'Lu', 'Ya', 'Mi', 'Zo', 'Ra', 'Ha', 'Mo', 'Di', 'Fe', 'Ri', 'Ta', 'Vi', 'Ze', 'Oa', 'Li'],
        middles: ['la', 'ra', 'ne', 'ri', 'to', 'na', 'li', 'mo', 'za', 'lo', 'mi', 'ya', 're', 'ka', 'si', 'te', 'no', 'fi', 'do', 'sa'],
        suffixes: ['a', 'e', 'i', 'o', 'u', 'an', 'en', 'on', 'ar', 'el', 'er', 'is', 'us', 'ys', 'ine', 'iel', 'os', 'as', 'ae', 'or']
    }
};

// Succès
const ACHIEVEMENTS = [
    { id: 'PERFECT_MATCH', title: 'Mariage Parfait', desc: 'Compatibilité 100%', icon: '💍' },
    { id: 'INTERNATIONAL', title: 'Couple International', desc: 'Deux pays différents', icon: '🌍' },
    { id: 'EXPERT_DUO', title: 'Double Expert', desc: 'Deux niveaux 25+', icon: '🧠' },
    { id: 'LEGEND_DUO', title: 'Double Légende', desc: 'Deux niveaux 80+', icon: '👑' },
    { id: 'FIRST_EXPORT', title: 'Premier Export', desc: 'Exporter le couple', icon: '📤' },
    { id: 'FIRST_RING', title: 'Premier Anneau', desc: 'Obtenir un anneau', icon: '💫' },
    { id: 'RARE_RING', title: 'Anneau Rare', desc: 'Trouver un anneau rare', icon: '💠' },
    { id: 'LEG_RING', title: 'Anneau Légendaire', desc: 'Débloquer un anneau légendaire', icon: '🌟' },
    { id: 'BLESSED_COUPLE', title: 'Couple Béni', desc: 'Un anneau équipé côté joueur et partenaire', icon: '🕊️' }
];

// Événements
const EVENTS = [
    { text: "Dîner romantique", baseCompatDelta: 5, baseXpDelta: 10, isNegative: false, tags: ['romance'], icon: '🍷' },
    { text: "Dispute culturelle", baseCompatDelta: -8, baseXpDelta: 5, isNegative: true, tags: ['culture'], icon: '💢' },
    { text: "Voyage surprise", baseCompatDelta: 12, baseXpDelta: 20, isNegative: false, tags: ['aventure'], icon: '✈️' },
    { text: "Cadeau raté", baseCompatDelta: -10, baseXpDelta: 0, isNegative: true, tags: ['malchance'], icon: '🎁' },
    { text: "Adoption d'un animal", baseCompatDelta: 8, baseXpDelta: 15, isNegative: false, tags: ['famille'], icon: '🐕' },
    { text: "Netflix & Chill", baseCompatDelta: 3, baseXpDelta: 5, isNegative: false, tags: ['quotidien'], icon: '📺' },
    { text: "Choc des cultures", baseCompatDelta: -12, baseXpDelta: 8, isNegative: true, tags: ['culture'], icon: '🧭' },
    { text: "Promenade méditerranéenne", baseCompatDelta: 6, baseXpDelta: 12, isNegative: false, tags: ['aventure'], icon: '🌊' },
    { text: "Atelier cuisine fusion", baseCompatDelta: 7, baseXpDelta: 10, isNegative: false, tags: ['culture'], icon: '🍲' }
];

// ==================== STATE ====================

let state = {
    player: { country: '', name: '', level: 0, xp: 0 },
    partner: { country: '', name: '', level: 0, xp: 0 },
    history: [],
    unlocked: [],
    logs: [],
    lastEvent: 0,
    compatBonus: 0,
    theme: 'classique',
    rings: {
        inventory: [],
        equipped: { player: null, partner: null },
        guaranteedDrops: 0
    }
};

// ==================== DOM SEARCH ====================

const $ = (id) => document.getElementById(id);

const ui = {
    pCountry: $('player-country'),
    partCountry: $('partner-country'),
    pName: $('player-name'),
    partName: $('partner-name'),

    // Visuals
    pImage: $('player-image'),
    partImage: $('partner-image'),
    pWrapper: $('player-ball-wrapper'),
    partWrapper: $('partner-ball-wrapper'),
    pBadge: $('player-badge'),
    partBadge: $('partner-badge'),

    // Stats
    pLevel: $('player-level'),
    partLevel: $('partner-level'),
    pTitle: $('player-title'),
    partTitle: $('partner-title'),
    pXpBar: $('player-xp-bar'),
    partXpBar: $('partner-xp-bar'),
    pXpText: $('player-xp-text'),
    partXpText: $('partner-xp-text'),
    pCountryDisplay: $('player-country-display'),
    partCountryDisplay: $('partner-country-display'),
    pRingDisplay: $('player-ring-display'),
    partRingDisplay: $('partner-ring-display'),

    // Compat
    compatSection: $('compatibility-section'),
    compatPercent: $('compatibility-percent'),
    compatLabel: $('compatibility-label'),
    progressCircle: $('progress-circle'),
    heart: $('couple-heart'),
    coupleZone: $('couple-zone'),

    // Panels
    historyList: $('history-list'),
    achievementsGrid: $('achievements-grid'),
    eventLog: $('event-log'),
    toast: $('toast-container'),

    // Actions
    exportBtn: $('export-btn'),
    eventBtn: $('event-btn'),
    saveBtn: $('save-couple-btn'),
    resetBtn: $('reset-btn'),
    clearHistBtn: $('clear-history-btn'),
    themeToggle: $('theme-toggle'),
    universeTheme: $('universe-theme'),

    // Export fx
    flash: $('export-flash'),
    canvas: $('export-canvas'),

    // Notifs
    levelUp: $('level-up-notification')
};

// ==================== UTILS ====================

function getRank(level) {
    if (level >= 80) return { title: 'Légende', class: 'rank-legend' };
    if (level >= 25) return { title: 'Expert', class: 'rank-expert' };
    if (level >= 10) return { title: 'Intermédiaire', class: 'rank-intermediate' };
    return { title: 'Débutant', class: 'rank-beginner' };
}

function getImgPath(country, side) {
    return country ? `Pays/${encodeURIComponent(country)}/heureux_${side}.PNG` : '';
}

function generateAiName(country) {
    const continent = COUNTRY_DATA[country]?.continent;
    const set = NAME_SETS[continent] || NAME_SETS.Global;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const base = `${pick(set.prefixes)}${Math.random() > 0.5 ? pick(set.middles) : ''}${pick(set.suffixes)}`;
    return base.charAt(0).toUpperCase() + base.slice(1);
}

function updateImg(img, src) {
    if (!src) { img.src = ''; img.classList.remove('loaded'); return; }
    const i = new Image();
    i.onload = () => { img.src = src; img.classList.add('loaded'); };
    i.src = src;
}

function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>✨</span> <span>${msg}</span>`;
    ui.toast.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 3000);
}

function applyTheme(themeKey, silent = false) {
    const theme = THEMES[themeKey] || THEMES.classique;
    state.theme = themeKey;
    document.body.dataset.theme = themeKey;
    ui.heart.textContent = theme.icon;
    if (ui.universeTheme && ui.universeTheme.value !== themeKey) {
        ui.universeTheme.value = themeKey;
    }
    if (!silent) {
        save();
        showToast(`Thème ${theme.vibe} activé`);
    }
}

// ==================== RINGS ====================

function getRingsCatalog() {
    return [
        {
            id: 'confiance',
            name: 'Anneau de Confiance',
            icon: '🤝',
            rarity: 'common',
            description: 'Solidifie la complicité et rassure chaque échange.',
            effects: { compatBonus: 2, bonusOnPositiveEvent: 1 }
        },
        {
            id: 'paix',
            name: 'Anneau de Paix',
            icon: '🕊️',
            rarity: 'rare',
            description: 'Apaise les tensions et adoucit les moments difficiles.',
            effects: { reduceNegEventChance: 0.2, compatBonus: 1 }
        },
        {
            id: 'passion',
            name: 'Passion Ardente',
            icon: '🔥',
            rarity: 'rare',
            description: 'Booste l’XP sur chaque aventure, mais reste imprévisible.',
            effects: { xpMultiplier: 1.35, bonusOnPositiveEvent: 2 }
        },
        {
            id: 'culture',
            name: 'Éclat Culturel',
            icon: '📚',
            rarity: 'common',
            description: 'Transforme les différences culturelles en atout.',
            effects: { cancelCultureMalus: true, compatBonus: 1 }
        },
        {
            id: 'equilibre',
            name: 'Équilibre des Cœurs',
            icon: '⚖️',
            rarity: 'common',
            description: 'Protège doucement le couple des coups durs.',
            effects: { reduceNegEventChance: 0.1 }
        },
        {
            id: 'lueur',
            name: 'Lueur du Désert',
            icon: '✨',
            rarity: 'rare',
            description: 'Chaque bonne nouvelle brille encore plus.',
            effects: { bonusOnPositiveEvent: 3 }
        },
        {
            id: 'legende',
            name: 'Légende Vivante',
            icon: '🌟',
            rarity: 'legendary',
            description: 'Une aura mythique qui bénit chaque action.',
            effects: { compatBonus: 2, xpMultiplier: 1.15, reduceNegEventChance: 0.1 }
        },
        {
            id: 'destin',
            name: 'Destin Constellé',
            icon: '💫',
            rarity: 'legendary',
            description: 'Le destin veille et récompense les bonnes ondes.',
            effects: { compatBonus: 1, xpMultiplier: 1.25, reduceNegEventChance: 0.1, bonusOnPositiveEvent: 2 }
        }
    ];
}

function loadRingsState() {
    if (!state.rings) {
        state.rings = { inventory: [], equipped: { player: null, partner: null }, guaranteedDrops: 0 };
    }
    const catalogIds = getRingsCatalog().map(r => r.id);
    state.rings.inventory = (state.rings.inventory || []).filter(id => catalogIds.includes(id));
    state.rings.equipped = state.rings.equipped || { player: null, partner: null };
    state.rings.guaranteedDrops = state.rings.guaranteedDrops || 0;
}

function saveRingsState() {
    save();
    renderRingDisplays();
}

function rollRarity() {
    const roll = Math.random() * 100;
    if (roll < 70) return 'common';
    if (roll < 95) return 'rare';
    return 'legendary';
}

function pickRingByRarity(rarity, missing) {
    const pool = missing.filter(r => r.rarity === rarity);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

function attemptRingDrop() {
    const catalog = getRingsCatalog();
    const missing = catalog.filter(r => !state.rings.inventory.includes(r.id));
    if (!missing.length) return null;

    const guaranteed = state.rings.inventory.length < 3 || state.rings.guaranteedDrops < 3;
    const rarity = rollRarity();
    let ring = pickRingByRarity(rarity, missing);

    if (!ring && guaranteed) {
        ring = ['common', 'rare', 'legendary'].map(r => pickRingByRarity(r, missing)).find(Boolean);
    }

    if (!ring) return null;

    state.rings.inventory.push(ring.id);
    if (guaranteed) state.rings.guaranteedDrops += 1;
    saveRingsState();
    showRingDropModal(ring);
    checkAchievements();
    return ring;
}

function openRingModal(side) {
    const modal = $('ring-modal');
    const inventoryEl = $('ring-inventory');
    modal.dataset.side = side;
    modal.classList.remove('hidden');

    const inventory = state.rings.inventory;
    if (!inventory.length) {
        inventoryEl.innerHTML = '<p class="empty">Aucun anneau obtenu pour le moment.</p>';
        return;
    }

    inventoryEl.innerHTML = inventory.map(id => {
        const ring = getRingsCatalog().find(r => r.id === id);
        const equipped = Object.values(state.rings.equipped).includes(id);
        return `
            <div class="ring-card">
                <header>
                    <div class="ring-meta"><span class="ring-icon">${ring.icon}</span> ${ring.name}</div>
                    <span class="rarity-tag rarity-${ring.rarity}">${ring.rarity}</span>
                </header>
                <p>${ring.description}</p>
                <ul class="effects-list">${formatRingEffects(ring.effects).map(e => `<li>${e}</li>`).join('')}</ul>
                <button onclick="equipRing('${side}','${ring.id}')" ${equipped && state.rings.equipped[side] !== ring.id ? 'disabled' : ''}>
                    ${state.rings.equipped[side] === ring.id ? 'Équipé' : 'Équiper'}
                </button>
            </div>
        `;
    }).join('');
}

function equipRing(side, ringId) {
    state.rings.equipped[side] = ringId;
    saveRingsState();
    checkAchievements();
    closeRingModal();
}

function equipFromDrop(side) {
    const modal = $('ring-drop-modal');
    const ringId = modal?.dataset.ringId;
    if (!ringId) return;
    equipRing(side, ringId);
    closeRingDropModal();
}

function closeRingModal() {
    $('ring-modal').classList.add('hidden');
}

function showRingDropModal(ring) {
    const modal = $('ring-drop-modal');
    if (!modal) return;
    modal.dataset.ringId = ring.id;
    modal.classList.remove('hidden');
    $('drop-ring-icon').textContent = ring.icon;
    $('drop-ring-name').textContent = ring.name;
    $('drop-ring-desc').textContent = ring.description;
    const badge = $('drop-ring-rarity');
    badge.textContent = ring.rarity;
    badge.className = `rarity-tag rarity-${ring.rarity}`;
    $('drop-ring-effects').innerHTML = formatRingEffects(ring.effects).map(e => `<li>${e}</li>`).join('');
}

function closeRingDropModal() {
    const modal = $('ring-drop-modal');
    modal?.classList.add('hidden');
}

function formatRingEffects(effects) {
    const parts = [];
    if (effects.compatBonus) parts.push(`+${effects.compatBonus} compatibilité`);
    if (effects.bonusOnPositiveEvent) parts.push(`+${effects.bonusOnPositiveEvent} compat sur événements positifs`);
    if (effects.xpMultiplier) parts.push(`XP x${effects.xpMultiplier}`);
    if (effects.reduceNegEventChance) parts.push(`-${Math.round(effects.reduceNegEventChance * 100)}% risque négatif`);
    if (effects.cancelCultureMalus) parts.push('Annule le malus culturel');
    return parts;
}

function getEquippedRing(side) {
    const id = state.rings.equipped[side];
    return getRingsCatalog().find(r => r.id === id);
}

function applyRingEffects(event, side, current) {
    let compatDelta = current.compatDelta;
    let xpDelta = current.xpDelta;
    const ring = getEquippedRing(side);
    const notes = [];
    if (!ring) return { compatDelta, xpDelta, notes };
    const effects = ring.effects || {};

    if (effects.cancelCultureMalus && event.tags?.includes('culture') && compatDelta < 0) {
        compatDelta = 0;
        notes.push(`Malus culturel annulé grâce à ${ring.icon} ${ring.name}`);
    }
    if (typeof effects.compatBonus === 'number') {
        compatDelta += effects.compatBonus;
        notes.push(`+${effects.compatBonus}% compatibilité grâce à ${ring.icon} ${ring.name}`);
    }
    if (!event.isNegative && typeof effects.bonusOnPositiveEvent === 'number') {
        compatDelta += effects.bonusOnPositiveEvent;
        notes.push(`Bonus positif (${effects.bonusOnPositiveEvent}) via ${ring.icon} ${ring.name}`);
    }
    if (typeof effects.xpMultiplier === 'number') {
        xpDelta = Math.round(xpDelta * effects.xpMultiplier);
        notes.push(`XP x${effects.xpMultiplier} grâce à ${ring.icon} ${ring.name}`);
    }

    return { compatDelta, xpDelta, notes };
}

function getNegativeReduction() {
    const equipped = Object.values(state.rings.equipped);
    const total = equipped.reduce((acc, id) => {
        const ring = getRingsCatalog().find(r => r.id === id);
        return acc + (ring?.effects?.reduceNegEventChance || 0);
    }, 0);
    return Math.min(Math.max(total, 0), 0.6);
}

function generateEventWithRings() {
    const now = Date.now();
    if (now - state.lastEvent < CONFIG.EVENT_COOLDOWN) return;

    const negativePool = EVENTS.filter(e => e.isNegative);
    const positivePool = EVENTS.filter(e => !e.isNegative);
    const baseNegChance = 0.35;
    const effectiveNegChance = Math.max(0.05, baseNegChance * (1 - getNegativeReduction()));
    const pool = Math.random() < effectiveNegChance ? negativePool : positivePool;
    const evt = pool[Math.floor(Math.random() * pool.length)];

    let compatDelta = evt.baseCompatDelta;
    let xpDelta = evt.baseXpDelta;
    const notes = [];

    ['player', 'partner'].forEach(side => {
        const { compatDelta: c, xpDelta: x, notes: n } = applyRingEffects(evt, side, { compatDelta, xpDelta });
        compatDelta = c;
        xpDelta = x;
        notes.push(...n);
    });

    state.compatBonus += compatDelta;
    addXP('player', xpDelta);
    addXP('partner', xpDelta);

    state.logs.unshift({ date: now, text: evt.text, icon: evt.icon, compatDelta, xpDelta, notes });
    if (state.logs.length > 10) state.logs.pop();
    state.lastEvent = now;
    save();
    renderLogs();

    if (compatDelta < 0) {
        ui.coupleZone.classList.add('shake');
        setTimeout(() => ui.coupleZone.classList.remove('shake'), 500);
    }

    attemptRingDrop();
}

// ==================== CORE LOGIC ====================

function calculateCompat() {
    const p1 = state.player;
    const p2 = state.partner;
    if (!p1.country || !p2.country) return 0;

    let score = state.compatBonus || 0;

    // Geo Logic
    const d1 = COUNTRY_DATA[p1.country];
    const d2 = COUNTRY_DATA[p2.country];

    if (p1.country === p2.country) score += 30; // Narcissist?
    else if (d1.continent === d2.continent) score += 15; // Same continent
    else score += 5;

    if (p1.country !== p2.country) score += 20; // International love

    // Level Logic
    const diff = Math.abs(p1.level - p2.level);
    if (diff <= 5) score += 20;

    // Name
    if (p1.name && p2.name) score += 10;

    return Math.min(100, Math.max(0, score));
}

function addXP(target, amount) {
    const char = state[target];
    const oldLvl = char.level;
    char.xp += amount;

    while (char.xp >= CONFIG.XP_PER_LEVEL) {
        char.xp -= CONFIG.XP_PER_LEVEL;
        char.level = Math.min(100, char.level + 1);
    }

    if (char.level > oldLvl) {
        ui.levelUp.classList.add('show');
        setTimeout(() => ui.levelUp.classList.remove('show'), 2000);
    }

    updateUI(target);
    save();
    checkAchievements();
}

function updateUI(target) {
    const char = state[target];
    const side = target === 'player' ? 'gauche' : 'droite';

    // Update Fields
    if (ui[`${target === 'player' ? 'p' : 'part'}Name`].value !== char.name) {
        ui[`${target === 'player' ? 'p' : 'part'}Name`].value = char.name;
    }

    // Text stats
    ui[`${target === 'player' ? 'p' : 'part'}CountryDisplay`].textContent = char.country || '---';
    ui[`${target === 'player' ? 'p' : 'part'}Level`].textContent = char.level;

    // Rank
    const rank = getRank(char.level);
    ui[`${target === 'player' ? 'p' : 'part'}Title`].textContent = rank.title;
    ui[`${target === 'player' ? 'p' : 'part'}Badge`].textContent = rank.title;

    // Visuals
    updateImg(ui[`${target === 'player' ? 'p' : 'part'}Image`], getImgPath(char.country, side));
    ui[`${target === 'player' ? 'p' : 'part'}Wrapper`].className = `countryball-wrapper ${rank.class}`;

    // XP Bar
    const pct = (char.xp / CONFIG.XP_PER_LEVEL) * 100;
    ui[`${target === 'player' ? 'p' : 'part'}XpBar`].style.width = `${pct}%`;
    ui[`${target === 'player' ? 'p' : 'part'}XpText`].textContent = `${char.xp}/${CONFIG.XP_PER_LEVEL} XP`;

    updateCompatUI();
    renderRingDisplays();
}

function updateCompatUI() {
    const score = calculateCompat();

    // Update Number
    const current = parseInt(ui.compatPercent.textContent) || 0;
    if (current !== score) {
        ui.compatPercent.textContent = score;
    }

    // Update Circle
    const offset = 283 - (score / 100) * 283;
    ui.progressCircle.style.strokeDashoffset = offset;

    // Label & Color
    const circle = ui.compatSection.querySelector('.compatibility-circle');
    circle.classList.remove('low', 'medium', 'high');

    let label = 'Faible';
    if (score < 40) { circle.classList.add('low'); label = 'Faible'; }
    else if (score < 75) { circle.classList.add('medium'); label = 'Moyenne'; }
    else { circle.classList.add('high'); label = 'Élevée'; }

    if (score >= 100) label = 'Parfaite 💖';
    ui.compatLabel.textContent = label;

    // Visibility
    if (state.player.country || state.partner.country) {
        ui.compatSection.classList.add('visible');
    }
}

function renderRingDisplays() {
    const playerRing = getEquippedRing('player');
    const partnerRing = getEquippedRing('partner');

    ui.pRingDisplay.innerHTML = playerRing ? `<span class="ring-icon">${playerRing.icon}</span> ${playerRing.name} <span class="rarity-tag rarity-${playerRing.rarity}">${playerRing.rarity}</span>` : 'Aucun anneau';
    ui.partRingDisplay.innerHTML = partnerRing ? `<span class="ring-icon">${partnerRing.icon}</span> ${partnerRing.name} <span class="rarity-tag rarity-${partnerRing.rarity}">${partnerRing.rarity}</span>` : 'Aucun anneau';
}

// ==================== FEATURES ====================

// 4. Story Mode
function triggerEvent() {
    const now = Date.now();
    if (now - state.lastEvent < CONFIG.EVENT_COOLDOWN) return;

    const evt = EVENTS[Math.floor(Math.random() * EVENTS.length)];

    // Effects
    state.compatBonus += evt.effect.compat;
    addXP('player', evt.effect.xp);
    addXP('partner', evt.effect.xp);

    // Log
    state.logs.unshift({ date: now, text: evt.text, icon: evt.icon });
    if (state.logs.length > 10) state.logs.pop();

    state.lastEvent = now;
    save();
    renderLogs();

    // Animation
    if (evt.effect.compat < 0) {
        ui.coupleZone.classList.add('shake');
        setTimeout(() => ui.coupleZone.classList.remove('shake'), 500);
    }
}

function renderLogs() {
    ui.eventLog.innerHTML = state.logs.map(l => `
        <div class="log-entry">
            <div class="log-main">
                <span class="log-time">${new Date(l.date).toLocaleTimeString()}</span>
                <span>${l.icon} ${l.text}</span>
            </div>
            <div class="log-effects">
                <span class="effect-chip">${(l.compatDelta ?? 0) >= 0 ? '+' : ''}${l.compatDelta ?? 0}% compat</span>
                <span class="effect-chip">+${l.xpDelta ?? 0} XP</span>
            </div>
            ${l.notes?.length ? `<div class="log-notes">${l.notes.map(n => `<div>${n}</div>`).join('')}</div>` : ''}
        </div>
    `).join('') || '<p class="empty">Aucun événement</p>';
}

// 5. Save & History
function save() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
}

function load() {
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        state = { ...state, ...JSON.parse(s) };
        loadRingsState();
        ui.pCountry.value = state.player.country;
        ui.partCountry.value = state.partner.country;

        updateUI('player');
        updateUI('partner');
        renderHistory();
        renderAchievements();
        renderLogs();

        applyTheme(state.theme || 'classique', true);

        checkAchievements();

        // Load theme
        if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    } else {
        loadRingsState();
        applyTheme(state.theme, true);
    }
}

function addToHistory() {
    state.history.unshift({
        date: new Date().toISOString(),
        p1: { ...state.player },
        p2: { ...state.partner },
        score: calculateCompat()
    });
    if (state.history.length > CONFIG.MAX_HISTORY) state.history.pop();
    save();
    renderHistory();
    showToast('Couple sauvegardé');
}

function renderHistory() {
    ui.historyList.innerHTML = state.history.map((h, i) => `
        <div class="history-card">
            <div class="h-info">
                <strong>${h.p1.country} ❤️ ${h.p2.country}</strong>
                <span>${new Date(h.date).toLocaleDateString()} - ${h.score}% Compat</span>
            </div>
            <div class="h-actions">
                <button onclick="loadHistory(${i})">Charger</button>
                <button onclick="delHistory(${i})">X</button>
            </div>
        </div>
    `).join('') || '<p class="empty">Vide</p>';
}

window.loadHistory = (i) => {
    if (!confirm('Écraser le couple actuel ?')) return;
    const h = state.history[i];
    state.player = { ...h.p1 };
    state.partner = { ...h.p2 };
    state.compatBonus = 0;

    ui.pCountry.value = state.player.country;
    ui.partCountry.value = state.partner.country;
    updateUI('player');
    updateUI('partner');
    save();
};

window.delHistory = (i) => {
    state.history.splice(i, 1);
    save();
    renderHistory();
};

// 6. Achievements
function checkAchievements() {
    const score = calculateCompat();
    const inventory = state.rings?.inventory || [];
    const catalog = getRingsCatalog();

    const checks = {
        'PERFECT_MATCH': score >= 100,
        'INTERNATIONAL': state.player.country !== state.partner.country && state.player.country && state.partner.country,
        'EXPERT_DUO': state.player.level >= 25 && state.partner.level >= 25,
        'LEGEND_DUO': state.player.level >= 80 && state.partner.level >= 80,
        'FIRST_EXPORT': false, // Handled in export
        'FIRST_RING': inventory.length >= 1,
        'RARE_RING': inventory.some(id => catalog.find(r => r.id === id)?.rarity === 'rare'),
        'LEG_RING': inventory.some(id => catalog.find(r => r.id === id)?.rarity === 'legendary'),
        'BLESSED_COUPLE': Boolean(state.rings?.equipped?.player && state.rings?.equipped?.partner)
    };

    let changed = false;
    for (const [id, condition] of Object.entries(checks)) {
        if (condition && !state.unlocked.includes(id)) {
            state.unlocked.push(id);
            showToast(`🏆 Succès : ${ACHIEVEMENTS.find(a => a.id === id).title}`);
            changed = true;
        }
    }
    if (changed) {
        save();
        renderAchievements();
    }
}

function renderAchievements() {
    ui.achievementsGrid.innerHTML = ACHIEVEMENTS.map(a => `
        <div class="ach-card ${state.unlocked.includes(a.id) ? 'unlocked' : 'locked'}">
            <div class="ach-icon">${a.icon}</div>
            <div>
                <h4>${a.title}</h4>
                <p>${a.desc}</p>
            </div>
        </div>
    `).join('');
}

// 7. Export
function doExport() {
    // Reveal Achievement
    if (!state.unlocked.includes('FIRST_EXPORT')) {
        state.unlocked.push('FIRST_EXPORT');
        showToast('🏆 Succès : Premier Export');
        renderAchievements();
        save();
    }

    // Animation
    ui.flash.classList.add('active');
    setTimeout(() => ui.flash.classList.remove('active'), 400);
    ui.coupleZone.classList.add('shake');
    setTimeout(() => ui.coupleZone.classList.remove('shake'), 500);

    // Canvas Generation
    const ctx = ui.canvas.getContext('2d');
    ui.canvas.width = 800;
    ui.canvas.height = 400;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 800, 400);
    grad.addColorStop(0, '#0f0c29');
    grad.addColorStop(1, '#302b63');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 400);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${state.player.country} + ${state.partner.country}`, 400, 50);

    ctx.font = '20px sans-serif';
    ctx.fillText(`Compatibilité : ${calculateCompat()}%`, 400, 350);

    // Draw placeholders/images would go here, simplified for robustness:
    ctx.font = '60px serif';
    ctx.fillText('❤️', 400, 200);

    // Save
    const link = document.createElement('a');
    link.download = `Couple_${Date.now()}.png`;
    link.href = ui.canvas.toDataURL();
    link.click();
}

// ==================== EVENTS ====================

ui.pCountry.onchange = (e) => {
    state.player.country = e.target.value;
    addXP('player', XP_REWARDS.COUNTRY_CHANGE);
};

ui.partCountry.onchange = (e) => {
    state.partner.country = e.target.value;
    addXP('partner', XP_REWARDS.COUNTRY_CHANGE);
};

ui.pName.oninput = (e) => { state.player.name = e.target.value; save(); };
ui.partName.oninput = (e) => { state.partner.name = e.target.value; save(); };

// Buttons
const levelBtns = document.querySelectorAll('.level-btn');
levelBtns.forEach(b => {
    b.onclick = () => {
        const target = b.dataset.target;
        const add = b.classList.contains('plus');
        const char = state[target];
        char.level = Math.max(0, Math.min(100, char.level + (add ? 1 : -1)));
        updateUI(target);
        save();
        checkAchievements();
    };
});

document.querySelectorAll('.ai-name-btn').forEach(btn => {
    btn.onclick = () => {
        const target = btn.dataset.target;
        const chosen = generateAiName(state[target].country);
        state[target].name = chosen;
        updateUI(target);
        addXP(target, XP_REWARDS.NAME_CHANGE);
        showToast(`Prénom IA choisi : ${chosen}`);
    };
});

if (ui.eventBtn) ui.eventBtn.onclick = generateEventWithRings;
if (ui.saveBtn) ui.saveBtn.onclick = addToHistory;
if (ui.resetBtn) ui.resetBtn.onclick = () => {
    if (confirm('Réinitialiser le couple ? (Historique conservé)')) {
        state.player = { country: '', name: '', level: 0, xp: 0 };
        state.partner = { country: '', name: '', level: 0, xp: 0 };
        state.compatBonus = 0;
        ui.pCountry.value = "";
        ui.partCountry.value = "";
        updateUI('player');
        updateUI('partner');
        save();
    }
};
if (ui.clearHistBtn) ui.clearHistBtn.onclick = () => {
    if (confirm('Supprimer tout l\'historique ?')) {
        state.history = [];
        save();
        renderHistory();
    }
};
if (ui.exportBtn) ui.exportBtn.onclick = doExport;

// Theme
ui.themeToggle.onclick = () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
};
if (ui.universeTheme) ui.universeTheme.onchange = (e) => applyTheme(e.target.value);
$('close-ring-modal').onclick = closeRingModal;
$('ring-modal').addEventListener('click', (e) => {
    if (e.target.id === 'ring-modal') closeRingModal();
});
$('ring-drop-modal').addEventListener('click', (e) => {
    if (e.target.id === 'ring-drop-modal') closeRingDropModal();
});

// Init
window.onload = load;
