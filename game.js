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

// Succès
const ACHIEVEMENTS = [
    { id: 'PERFECT_MATCH', title: 'Mariage Parfait', desc: 'Compatibilité 100%', icon: '💍' },
    { id: 'INTERNATIONAL', title: 'Couple International', desc: 'Deux pays différents', icon: '🌍' },
    { id: 'EXPERT_DUO', title: 'Double Expert', desc: 'Deux niveaux 25+', icon: '🧠' },
    { id: 'LEGEND_DUO', title: 'Double Légende', desc: 'Deux niveaux 80+', icon: '👑' },
    { id: 'FIRST_EXPORT', title: 'Premier Export', desc: 'Exporter le couple', icon: '📤' }
    // "Collectionneur" removed as not in new prompt explicit list, but keeping it is fine. 
    // Prompt said "Exemples". I'll stick to the requested ones for precision.
];

// Événements
const EVENTS = [
    { text: "Dîner romantique", effect: { compat: 5, xp: 10 }, icon: '🍷' },
    { text: "Dispute mineure", effect: { compat: -5, xp: 5 }, icon: '💢' },
    { text: "Voyage surprise", effect: { compat: 10, xp: 20 }, icon: '✈️' },
    { text: "Cadeau raté", effect: { compat: -10, xp: 0 }, icon: '🎁' },
    { text: "Adoption animal", effect: { compat: 8, xp: 15 }, icon: '🐕' },
    { text: "Netflix & Chill", effect: { compat: 3, xp: 5 }, icon: '📺' }
];

// ==================== STATE ====================

let state = {
    player: { country: '', name: '', level: 0, xp: 0 },
    partner: { country: '', name: '', level: 0, xp: 0 },
    history: [],
    unlocked: [],
    logs: [],
    lastEvent: 0,
    compatBonus: 0
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
            <span class="log-time">${new Date(l.date).toLocaleTimeString()}</span>
            <span>${l.icon} ${l.text}</span>
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
        ui.pCountry.value = state.player.country;
        ui.partCountry.value = state.partner.country;

        updateUI('player');
        updateUI('partner');
        renderHistory();
        renderAchievements();
        renderLogs();

        // Load theme
        if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
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

    const checks = {
        'PERFECT_MATCH': score >= 100,
        'INTERNATIONAL': state.player.country !== state.partner.country && state.player.country && state.partner.country,
        'EXPERT_DUO': state.player.level >= 25 && state.partner.level >= 25,
        'LEGEND_DUO': state.player.level >= 80 && state.partner.level >= 80,
        'FIRST_EXPORT': false // Handled in export
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

if (ui.eventBtn) ui.eventBtn.onclick = triggerEvent;
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

// Init
window.onload = load;
