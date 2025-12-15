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

function buildImagePath(country, role) {
  // Sécurise le chemin pour GitHub Pages : encodage, casse, et extension cohérente
  const safeCountry = encodeURIComponent(country.trim());
  const safeRole = role === "droite" ? "droite" : "gauche";
  return `Pays/${safeCountry}/heureux_${safeRole}.png`;
}

function setBallImage(img, src, fallbackAlt = "Image indisponible") {
  // Réinitialise l'état et prépare l'accessibilité avant le chargement
  img.classList.remove("is-visible");
  img.alt = fallbackAlt;

  img.onload = () => {
    img.classList.add("is-visible");
  };

  img.onerror = () => {
    img.classList.remove("is-visible");
  };

  img.src = src;
}

function updateImages(country) {
  const cleanedCountry = country.trim();
  const playerPath = buildImagePath(cleanedCountry, "gauche");
  const partnerPath = buildImagePath(cleanedCountry, "droite");

  setBallImage(elements.player, playerPath, "Image joueur indisponible");
  setBallImage(elements.partner, partnerPath, "Image partenaire indisponible");
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
