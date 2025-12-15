// Countryballs Mariage - gestion simple et robuste du duo
const STORAGE_KEYS = {
  leftCountry: "cb-country-left",
  rightCountry: "cb-country-right",
  theme: "cb-theme",
  leftName: "cb-name-left",
  rightName: "cb-name-right",
  leftLevel: "cb-level-left",
  rightLevel: "cb-level-right",
};

const elements = {
  selectLeft: document.getElementById("countrySelectLeft"),
  selectRight: document.getElementById("countrySelectRight"),
  playerImage: document.getElementById("playerImage"),
  partnerImage: document.getElementById("partnerImage"),
  playerCountry: document.getElementById("playerCountry"),
  partnerCountry: document.getElementById("partnerCountry"),
  themeToggle: document.getElementById("themeToggle"),
  playerName: document.getElementById("playerName"),
  partnerName: document.getElementById("partnerName"),
  playerLevel: document.getElementById("playerLevel"),
  partnerLevel: document.getElementById("partnerLevel"),
  playerRankTitle: document.getElementById("playerRankTitle"),
  partnerRankTitle: document.getElementById("partnerRankTitle"),
  levelButtons: document.querySelectorAll(".level-btn"),
  playerFrame: document.getElementById("playerFrame"),
  partnerFrame: document.getElementById("partnerFrame"),
  playerBadge: document.getElementById("playerBadge"),
  partnerBadge: document.getElementById("partnerBadge"),
};

const DEFAULT_COUNTRY = elements.selectLeft?.options?.[0]?.value || "France";
const NAME_FALLBACK = { left: "Joueur", right: "Partenaire" };
const levels = { left: 1, right: 1 };
const rankSteps = [
  { min: 80, key: "legend", label: "Légende", badge: "🔥" },
  { min: 50, key: "gold", label: "Or", badge: "💎" },
  { min: 30, key: "silver", label: "Argent", badge: "" },
  { min: 10, key: "bronze", label: "Bronze", badge: "" },
  { min: 1, key: "beginner", label: "Débutant", badge: "" },
];

const clampLevel = (value) => Math.min(100, Math.max(1, Number(value) || 1));

function buildImagePath(country, side) {
  const cleanCountry = country?.trim() || DEFAULT_COUNTRY;
  const role = side === "right" ? "droite" : "gauche";
  return `Pays/${cleanCountry}/heureux_${role}.PNG`;
}

function revealImage(img) {
  img.classList.add("is-visible");
  img.dataset.lastValid = img.src;
}

function setBallImage(img, country, side) {
  img.classList.remove("is-visible");
  const src = buildImagePath(country, side);

  img.onload = () => revealImage(img);
  img.onerror = () => {
    img.alt = `Image manquante : ${country || "Inconnu"}`;
    img.classList.remove("is-visible");
  };

  img.src = src;

  if (img.complete && img.naturalWidth > 0) {
    revealImage(img);
  }
}

function syncCountries() {
  const left = elements.selectLeft?.value?.trim() || DEFAULT_COUNTRY;
  const right = elements.selectRight?.value?.trim() || DEFAULT_COUNTRY;

  localStorage.setItem(STORAGE_KEYS.leftCountry, left);
  localStorage.setItem(STORAGE_KEYS.rightCountry, right);

  elements.playerCountry.textContent = left;
  elements.partnerCountry.textContent = right;

  setBallImage(elements.playerImage, left, "left");
  setBallImage(elements.partnerImage, right, "right");
}

function getRank(level) {
  return rankSteps.find((step) => level >= step.min) || rankSteps.at(-1);
}

function paintRank(side) {
  const levelValue = levels[side];
  const rank = getRank(levelValue);
  const isRight = side === "right";

  const badge = isRight ? elements.partnerBadge : elements.playerBadge;
  const title = isRight ? elements.partnerRankTitle : elements.playerRankTitle;
  const frame = isRight ? elements.partnerFrame : elements.playerFrame;

  badge.textContent = rank.badge;
  badge.className = `rank-badge rank-${rank.key}`;
  frame.className = `avatar__frame rank-${rank.key}`;
  title.textContent = rank.label;
}

function setLevel(side, value, animate = false) {
  const clamped = clampLevel(value);
  levels[side] = clamped;
  localStorage.setItem(
    side === "right" ? STORAGE_KEYS.rightLevel : STORAGE_KEYS.leftLevel,
    clamped
  );

  if (side === "right") {
    elements.partnerLevel.textContent = clamped;
  } else {
    elements.playerLevel.textContent = clamped;
  }

  paintRank(side);

  if (animate) {
    const frame = side === "right" ? elements.partnerFrame : elements.playerFrame;
    frame.classList.remove("level-pop");
    // force reflow for animation restart
    void frame.offsetWidth;
    frame.classList.add("level-pop");
  }
}

function adjustLevel(side, direction) {
  const current = levels[side];
  const delta = direction === "down" ? -1 : 1;
  setLevel(side, current + delta, true);
}

function syncLevels() {
  const savedLeft = clampLevel(localStorage.getItem(STORAGE_KEYS.leftLevel) || 12);
  const savedRight = clampLevel(localStorage.getItem(STORAGE_KEYS.rightLevel) || 12);
  setLevel("left", savedLeft);
  setLevel("right", savedRight);
}

function syncNames() {
  const savedLeft = localStorage.getItem(STORAGE_KEYS.leftName) || "";
  const savedRight = localStorage.getItem(STORAGE_KEYS.rightName) || "";
  elements.playerName.value = savedLeft || NAME_FALLBACK.left;
  elements.partnerName.value = savedRight || NAME_FALLBACK.right;
}

function handleNameInput(side, value) {
  const trimmed = value.trim();
  const fallback = NAME_FALLBACK[side];
  localStorage.setItem(
    side === "right" ? STORAGE_KEYS.rightName : STORAGE_KEYS.leftName,
    trimmed
  );
  if (side === "right") {
    elements.partnerName.value = trimmed || fallback;
  } else {
    elements.playerName.value = trimmed || fallback;
  }
}

function applyTheme(theme) {
  const useLight = theme === "light";
  document.body.classList.toggle("light", useLight);
  elements.themeToggle.textContent = `Mode sombre : ${useLight ? "OFF" : "ON"}`;
  localStorage.setItem(STORAGE_KEYS.theme, useLight ? "light" : "dark");
}

function toggleTheme() {
  const next = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(next);
}

function hydrateFromStorage() {
  const savedLeft = localStorage.getItem(STORAGE_KEYS.leftCountry);
  const savedRight = localStorage.getItem(STORAGE_KEYS.rightCountry);
  if (savedLeft && elements.selectLeft.querySelector(`option[value='${savedLeft}']`)) {
    elements.selectLeft.value = savedLeft;
  }
  if (
    savedRight &&
    elements.selectRight.querySelector(`option[value='${savedRight}']`)
  ) {
    elements.selectRight.value = savedRight;
  }

  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  syncNames();
  syncLevels();
  syncCountries();
}

function bindEvents() {
  elements.selectLeft.addEventListener("change", syncCountries);
  elements.selectRight.addEventListener("change", syncCountries);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.playerName.addEventListener("input", (event) =>
    handleNameInput("left", event.target.value)
  );
  elements.partnerName.addEventListener("input", (event) =>
    handleNameInput("right", event.target.value)
  );
  elements.levelButtons.forEach((button) => {
    const side = button.dataset.side === "right" ? "right" : "left";
    const direction = button.dataset.direction === "down" ? "down" : "up";
    button.addEventListener("click", () => adjustLevel(side, direction));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  hydrateFromStorage();
});
