/**
 * visual-fx.js
 * Dynamic Visual Effects - Beta 6.5
 * Background changes, parallax, etc.
 */

const CONTINENT_THEMES = {
    'Europe': {
        gradient: 'radial-gradient(circle at top center, #1a237e 0%, #0d47a1 40%, #0b0d15 100%)',
        name: 'Europe (Bleu Froid)'
    },
    'Afrique': {
        gradient: 'radial-gradient(circle at top center, #d84315 0%, #f4511e 40%, #0b0d15 100%)',
        name: 'Afrique (Rouge Chaud)'
    },
    'Asie': {
        gradient: 'radial-gradient(circle at top center, #e91e63 0%, #f06292 40%, #0b0d15 100%)',
        name: 'Asie (Rose Doré)'
    },
    'Amérique du Nord': {
        gradient: 'radial-gradient(circle at top center, #1b5e20 0%, #388e3c 40%, #0b0d15 100%)',
        name: 'Amérique du Nord (Vert Forêt)'
    },
    'Amérique du Sud': {
        gradient: 'radial-gradient(circle at top center, #f9a825 0%, #fbc02d 40%, #0b0d15 100%)',
        name: 'Amérique du Sud (Jaune Tropical)'
    },
    'Moyen-Orient': {
        gradient: 'radial-gradient(circle at top center, #6a1b9a 0%, #8e24aa 40%, #0b0d15 100%)',
        name: 'Moyen-Orient (Violet Mystique)'
    }
};

/**
 * Update background based on selected countries
 */
function updateDynamicBackground(playerCountry, partnerCountry) {
    if (!playerCountry || !partnerCountry) {
        // Reset to default
        document.body.style.background = 'radial-gradient(circle at top center, #1f2235 0%, #0b0d15 100%)';
        return;
    }

    // Get continents
    const continent1 = getContinent(playerCountry);
    const continent2 = getContinent(partnerCountry);

    // If same continent, use that theme
    if (continent1 && continent1 === continent2) {
        const theme = CONTINENT_THEMES[continent1];
        if (theme) {
            document.body.style.background = theme.gradient;
            document.body.style.transition = 'background 1.5s ease';
        }
    } else if (continent1 || continent2) {
        // Mixed: use primary continent
        const primaryContinent = continent1 || continent2;
        const theme = CONTINENT_THEMES[primaryContinent];
        if (theme) {
            document.body.style.background = theme.gradient;
            document.body.style.transition = 'background 1.5s ease';
        }
    }
}

/**
 * Helper: get continent from country (uses window.CONTINENTS from choices.js)
 */
function getContinent(country) {
    if (!window.CONTINENTS) return null;
    for (const [continent, countries] of Object.entries(window.CONTINENTS)) {
        if (countries.includes(country)) return continent;
    }
    return null;
}

// Export to global
window.updateDynamicBackground = updateDynamicBackground;
