// Configuration simple pour étendre facilement la liste des pays
const COUNTRIES = ["France", "Belgique", "Italie", "Espagne", "Portugal", "Pologne"];
const STORAGE_KEYS = {
  countryLeft: "countryballs-pays-left",
  countryRight: "countryballs-pays-right",
  theme: "countryballs-theme",
  nameLeft: "cb_name_left",
  nameRight: "cb_name_right",
  levelLeft: "cb_level_left",
  levelRight: "cb_level_right",
};

const PLACEHOLDER_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='240' viewBox='0 0 360 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23ffd166'/%3E%3Cstop offset='1' stop-color='%236dd3b6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='360' height='240' fill='%230f1116'/%3E%3Ccircle cx='110' cy='120' r='70' fill='url(%23g)' opacity='0.25'/%3E%3Ccircle cx='250' cy='120' r='70' fill='url(%23g)' opacity='0.25'/%3E%3Ctext x='180' y='130' fill='%23e8ecf5' font-family='Inter,Segoe UI' font-size='18' text-anchor='middle'%3ENouveau duo%3C/text%3E%3C/svg%3E";

const NAME_DEFAULTS = {
  left: "Joueur",
  right: "Partenaire",
};

const elements = {
  selectLeft: document.getElementById("countrySelectLeft"),
  selectRight: document.getElementById("countrySelectRight"),
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
const getSavedCountry = (side) => {
  const key = side === "right" ? STORAGE_KEYS.countryRight : STORAGE_KEYS.countryLeft;
  return localStorage.getItem(key);
};

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

function loadLevels(countryLeft, countryRight) {
  const defaultLeft = calculateLevel(countryLeft || defaultCountry);
  const defaultRight = calculateLevel(countryRight || defaultCountry);
  const savedLeft = clampLevel(localStorage.getItem(STORAGE_KEYS.levelLeft) || defaultLeft);
  const savedRight = clampLevel(localStorage.getItem(STORAGE_KEYS.levelRight) || defaultRight);

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
  const lastValid = imgEl?.dataset?.lastValid;

  imgEl.classList.remove("is-visible");
  imgEl.onload = () => {
    imgEl.classList.add("is-visible");
    imgEl.dataset.lastValid = imgEl.src;
  };
  imgEl.onerror = () => {
    if (lastValid && imgEl.src !== lastValid) {
      imgEl.src = lastValid;
      return;
    }

    if (imgEl.src !== PLACEHOLDER_SRC) {
      imgEl.src = PLACEHOLDER_SRC;
      imgEl.alt = `${label} indisponible`;
      return;
    }

    imgEl.classList.remove("is-visible");
  };

  imgEl.alt = `${label} (${country || "Inconnu"})`;
  imgEl.src = src;

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    imgEl.classList.add("is-visible");
    imgEl.dataset.lastValid = imgEl.src;
  }
}

function updateLeft(countryLeft) {
  const safeCountry = countryLeft || defaultCountry;
  localStorage.setItem(STORAGE_KEYS.countryLeft, safeCountry);
  setBallImage(elements.player, safeCountry, "gauche", "Avatar joueur");
  elements.playerCountry.textContent = safeCountry;
}

function updateRight(countryRight) {
  const safeCountry = countryRight || defaultCountry;
  localStorage.setItem(STORAGE_KEYS.countryRight, safeCountry);
  setBallImage(elements.partner, safeCountry, "droite", "Avatar partenaire");
  elements.partnerCountry.textContent = safeCountry;
}

function updateImages(countryLeft, countryRight) {
  elements.couplePanel.setAttribute("aria-busy", "true");

  updateLeft(countryLeft);
  updateRight(countryRight);

  updateIDCards(countryLeft, countryRight);
  refreshAllRankUI();

  window.requestAnimationFrame(() => elements.couplePanel.removeAttribute("aria-busy"));
}

function updateIDCards(countryLeft, countryRight) {
  elements.playerCountry.textContent = countryLeft || defaultCountry;
  elements.partnerCountry.textContent = countryRight || defaultCountry;
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

function onCountryChange(side, value) {
  const country = COUNTRIES.includes(value) ? value : defaultCountry;
  const key = side === "right" ? STORAGE_KEYS.countryRight : STORAGE_KEYS.countryLeft;
  localStorage.setItem(key, country);
  updateImages(elements.selectLeft.value, elements.selectRight.value);
}

function hydrateUI() {
  // Pré-sélection depuis le stockage si disponible
  const savedCountryLeft = getSavedCountry("left");
  const savedCountryRight = getSavedCountry("right");

  const selectedLeft = COUNTRIES.includes(savedCountryLeft) ? savedCountryLeft : defaultCountry;
  const selectedRight = COUNTRIES.includes(savedCountryRight) ? savedCountryRight : defaultCountry;

  elements.selectLeft.value = selectedLeft;
  elements.selectRight.value = selectedRight;

  localStorage.setItem(STORAGE_KEYS.countryLeft, selectedLeft);
  localStorage.setItem(STORAGE_KEYS.countryRight, selectedRight);

  loadLevels(selectedLeft, selectedRight);
  updateImages(selectedLeft, selectedRight);

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
  elements.selectLeft.addEventListener("change", (event) => onCountryChange("left", event.target.value));
  elements.selectRight.addEventListener("change", (event) => onCountryChange("right", event.target.value));
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
