// Configuration simple pour étendre facilement la liste des pays
const COUNTRIES = ["France", "Belgique", "Italie", "Espagne", "Portugal", "Pologne"];
const STORAGE_KEYS = {
  country: "countryballs-pays",
  theme: "countryballs-theme",
  nameLeft: "cb_name_left",
  nameRight: "cb_name_right",
  levelLeft: "cb_level_left",
  levelRight: "cb_level_right",
};

const NAME_DEFAULTS = {
  left: "Joueur",
  right: "Partenaire",
};

const elements = {
  select: document.getElementById("countrySelect"),
  player: document.getElementById("playerImage"),
  partner: document.getElementById("partnerImage"),
  playerFrame: document.getElementById("playerFrame"),
  partnerFrame: document.getElementById("partnerFrame"),
  playerBadge: document.getElementById("playerBadge"),
  partnerBadge: document.getElementById("partnerBadge"),
  themeToggle: document.getElementById("themeToggle"),
  couplePanel: document.getElementById("couplePanel"),
  playerName: document.getElementById("playerName"),
  partnerName: document.getElementById("partnerName"),
  playerCountry: document.getElementById("playerCountry"),
  partnerCountry: document.getElementById("partnerCountry"),
  playerLevel: document.getElementById("playerLevel"),
  partnerLevel: document.getElementById("partnerLevel"),
  playerRankTitle: document.getElementById("playerRankTitle"),
  partnerRankTitle: document.getElementById("partnerRankTitle"),
  levelButtons: document.querySelectorAll(".level-btn"),
};

const defaultCountry = COUNTRIES[0];
const levelCache = new Map();
const levels = {
  left: 1,
  right: 1,
};
const rankClasses = ["rank-beginner", "rank-bronze", "rank-silver", "rank-gold", "rank-legend"];

const sanitizeName = (value, fallback) => (value && value.trim() ? value.trim() : fallback);

const getSavedTheme = () => localStorage.getItem(STORAGE_KEYS.theme);
const getSavedCountry = () => localStorage.getItem(STORAGE_KEYS.country);

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light", isLight);
  elements.themeToggle.textContent = `Mode sombre : ${isLight ? "OFF" : "ON"}`;
  localStorage.setItem(STORAGE_KEYS.theme, isLight ? "light" : "dark");
}

function toggleTheme() {
  const newTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(newTheme);
}

function buildImagePath(country, role) {
  const safeCountry = country ? country.trim() : "";
  const safeRole = role === "droite" ? "droite" : "gauche";
  const folder = encodeURIComponent(safeCountry);
  return `Pays/${folder}/heureux_${safeRole}.PNG`;
}

function calculateLevel(country) {
  const key = country || defaultCountry;
  if (levelCache.has(key)) {
    return levelCache.get(key);
  }

  let hash = 0;
  for (const char of key.trim().toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  }

  const level = 12 + (hash % 89); // Niveau stable entre 12 et 100
  levelCache.set(key, level);
  return level;
}

const clampLevel = (value) => Math.min(100, Math.max(1, Number(value) || 1));

function loadLevels(country) {
  const defaultLevel = calculateLevel(country || defaultCountry);
  const savedLeft = clampLevel(localStorage.getItem(STORAGE_KEYS.levelLeft) || defaultLevel);
  const savedRight = clampLevel(localStorage.getItem(STORAGE_KEYS.levelRight) || defaultLevel);

  levels.left = savedLeft;
  levels.right = savedRight;

  localStorage.setItem(STORAGE_KEYS.levelLeft, savedLeft);
  localStorage.setItem(STORAGE_KEYS.levelRight, savedRight);
}

function persistLevel(side) {
  const key = side === "right" ? STORAGE_KEYS.levelRight : STORAGE_KEYS.levelLeft;
  localStorage.setItem(key, levels[side]);
}

function getRank(level) {
  if (level >= 80) return { key: "legend", title: "Légende", badge: "🔥 Légende" };
  if (level >= 50) return { key: "gold", title: "Or", badge: "💎 Élite" };
  if (level >= 30) return { key: "silver", title: "Argent", badge: "" };
  if (level >= 10) return { key: "bronze", title: "Bronze", badge: "" };
  return { key: "beginner", title: "Débutant", badge: "" };
}

function applyRankUI(side, level) {
  const rank = getRank(level);
  const frame = side === "right" ? elements.partnerFrame : elements.playerFrame;
  const badge = side === "right" ? elements.partnerBadge : elements.playerBadge;
  const title = side === "right" ? elements.partnerRankTitle : elements.playerRankTitle;
  const levelLabel = side === "right" ? elements.partnerLevel : elements.playerLevel;

  if (!frame || !badge || !title || !levelLabel) return;

  frame.classList.remove(...rankClasses);
  badge.classList.remove("badge-gold", "badge-legend", "is-visible");

  frame.classList.add(`rank-${rank.key}`);
  title.textContent = rank.title;
  levelLabel.textContent = `Niveau ${level}`;

  if (rank.badge) {
    badge.textContent = rank.badge;
    badge.classList.add("is-visible");
    if (rank.key === "gold") badge.classList.add("badge-gold");
    if (rank.key === "legend") badge.classList.add("badge-legend");
  } else {
    badge.textContent = "";
  }
}

function refreshAllRankUI() {
  applyRankUI("left", levels.left);
  applyRankUI("right", levels.right);
}

function saveName(side, value) {
  const isRight = side === "right";
  const key = isRight ? STORAGE_KEYS.nameRight : STORAGE_KEYS.nameLeft;
  const fallback = isRight ? NAME_DEFAULTS.right : NAME_DEFAULTS.left;
  const safeValue = sanitizeName(value, fallback);
  localStorage.setItem(key, safeValue);

  const target = isRight ? elements.partnerName : elements.playerName;
  if (target) {
    target.value = safeValue;
  }
}

function loadNames() {
  const savedLeft = localStorage.getItem(STORAGE_KEYS.nameLeft);
  const savedRight = localStorage.getItem(STORAGE_KEYS.nameRight);

  const leftName = sanitizeName(savedLeft, NAME_DEFAULTS.left);
  const rightName = sanitizeName(savedRight, NAME_DEFAULTS.right);

  elements.playerName.value = leftName;
  elements.partnerName.value = rightName;

  localStorage.setItem(STORAGE_KEYS.nameLeft, leftName);
  localStorage.setItem(STORAGE_KEYS.nameRight, rightName);
}

function animateElement(el, className, duration = 320) {
  if (!el) return;
  el.classList.remove(className);
  // Trigger reflow for restart
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

function setBallImage(imgEl, country, role, label) {
  const src = buildImagePath(country, role);

  imgEl.classList.remove("is-visible");
  imgEl.onload = () => imgEl.classList.add("is-visible");
  imgEl.onerror = () => {
    imgEl.removeAttribute("src");
    imgEl.alt = `${label} indisponible`;
    imgEl.classList.remove("is-visible");
  };

  imgEl.alt = `${label} (${country})`;
  imgEl.src = src;

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    imgEl.classList.add("is-visible");
  }
}

function updateImages(country) {
  elements.couplePanel.setAttribute("aria-busy", "true");

  setBallImage(elements.player, country, "gauche", "Avatar joueur");
  setBallImage(elements.partner, country, "droite", "Avatar partenaire");

  updateIDCards(country);
  refreshAllRankUI();

  window.requestAnimationFrame(() => elements.couplePanel.removeAttribute("aria-busy"));
}

function updateIDCards(country) {
  const safeCountry = country || defaultCountry;

  elements.playerCountry.textContent = safeCountry;
  elements.partnerCountry.textContent = safeCountry;
}

function setLevel(side, value, { animate = false } = {}) {
  const frame = side === "right" ? elements.partnerFrame : elements.playerFrame;
  const levelLabel = side === "right" ? elements.partnerLevel : elements.playerLevel;

  const clamped = clampLevel(value);
  levels[side] = clamped;
  persistLevel(side);
  refreshAllRankUI();

  if (animate) {
    animateElement(frame, "level-pop");
    animateElement(levelLabel, "level-pop");
  }
}

function adjustLevel(side, direction) {
  const delta = direction === "up" ? 1 : -1;
  const current = levels[side];
  const target = clampLevel(current + delta);
  const frame = side === "right" ? elements.partnerFrame : elements.playerFrame;

  if (target === current) {
    animateElement(frame, "level-shake", 380);
    return;
  }

  setLevel(side, target, { animate: true });
}

function onCountryChange(event) {
  const country = event.target.value;
  localStorage.setItem(STORAGE_KEYS.country, country);
  updateImages(country);
}

function hydrateUI() {
  // Pré-sélection depuis le stockage si disponible
  const savedCountry = getSavedCountry();
  if (COUNTRIES.includes(savedCountry)) {
    elements.select.value = savedCountry;
  } else {
    elements.select.value = defaultCountry;
    localStorage.setItem(STORAGE_KEYS.country, defaultCountry);
  }

  loadLevels(elements.select.value);
  updateImages(elements.select.value);

  // Appliquer le thème sauvegardé ou préférences du système
  const savedTheme = getSavedTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

function init() {
  // Peu d'éléments mais on garde la fonction pour évoluer facilement
  elements.select.addEventListener("change", onCountryChange);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.playerName.addEventListener("input", (event) => saveName("left", event.target.value));
  elements.partnerName.addEventListener("input", (event) => saveName("right", event.target.value));
  elements.levelButtons.forEach((button) => {
    const side = button.dataset.side === "right" ? "right" : "left";
    const direction = button.dataset.direction === "down" ? "down" : "up";
    button.addEventListener("click", () => adjustLevel(side, direction));
  });

  loadNames();
  hydrateUI();
}

window.addEventListener("DOMContentLoaded", init);
