// Configuration simple pour étendre facilement la liste des pays
const COUNTRIES = ["France", "Belgique", "Italie", "Espagne", "Portugal", "Pologne"];
const STORAGE_KEYS = {
  country: "countryballs-pays",
  theme: "countryballs-theme",
};

const elements = {
  select: document.getElementById("countrySelect"),
  player: document.getElementById("playerImage"),
  partner: document.getElementById("partnerImage"),
  themeToggle: document.getElementById("themeToggle"),
  couplePanel: document.getElementById("couplePanel"),
};

const defaultCountry = COUNTRIES[0];

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

function buildImageCandidates(country, role) {
  const safeRole = role === "droite" ? "droite" : "gauche";
  const folder = encodeURIComponent(country.trim());
  const baseNames = [
    `heureux_${safeRole}.png`,
    `heureux_${safeRole}.PNG`,
    `heureux ${safeRole}.png`,
    `heureux ${safeRole}.PNG`,
    `heureux_${safeRole}_.png`,
    `heureux_${safeRole}_.PNG`,
    `heureux_${safeRole} .png`,
    `heureux_${safeRole} .PNG`,
  ];

  const uniquePaths = [...new Set(baseNames)].map((filename) => {
    const safeFilename = encodeURIComponent(filename);
    return `Pays/${folder}/${safeFilename}`;
  });

  return uniquePaths;
}

function loadFirstWorkingImage(imgEl, candidates, fallbackAlt) {
  imgEl.classList.remove("is-visible");

  const tryLoad = (index) => {
    if (index >= candidates.length) {
      imgEl.alt = fallbackAlt || "Image indisponible";
      imgEl.removeAttribute("src");
      imgEl.classList.remove("is-visible");
      return;
    }

    const candidate = candidates[index];
    const probe = new Image();

    probe.onload = () => {
      imgEl.src = candidate;
      imgEl.alt = fallbackAlt || "Avatar chargé";
      imgEl.classList.add("is-visible");
    };

    probe.onerror = () => tryLoad(index + 1);
    probe.src = candidate;
  };

  tryLoad(0);
}

function updateImages(country) {
  elements.couplePanel.setAttribute("aria-busy", "true");

  loadFirstWorkingImage(
    elements.player,
    buildImageCandidates(country, "gauche"),
    `Avatar joueur pour ${country}`
  );

  loadFirstWorkingImage(
    elements.partner,
    buildImageCandidates(country, "droite"),
    `Avatar partenaire pour ${country}`
  );

  window.requestAnimationFrame(() => elements.couplePanel.removeAttribute("aria-busy"));
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
  hydrateUI();
}

window.addEventListener("DOMContentLoaded", init);
