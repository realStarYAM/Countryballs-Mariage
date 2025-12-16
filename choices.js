/**
 * choices.js
 * Données du jeu : Pays, Fusions, Prénoms, Noms.
 * Version: Beta 7.0
 */

// Liste des pays disponibles (Dossiers dans /Pays/)
window.COUNTRIES = [
    "Algérie", "Allemagne", "Belgique", "Brésil", "Canada", "Chine",
    "Corée du Sud", "Espagne", "États-Unis", "France", "Grèce",
    "Italie", "Japon", "Maroc", "Mexique", "Pays-Bas", "Portugal",
    "Royaume-Uni", "Russie", "Suisse", "Tunisie", "Turquie", "Ukraine"
];

// Configuration des Fusions (Dossiers dans /Fusion Pays/)
// Clé = Pays1|Pays2 (Ordre Alphabétique obligatoire)
window.FUSIONS = {
    "Algérie|Maroc": {
        name: "ALGÉROC",
        folder: "ALGÉROC",
        desc: "L'union sacrée du Maghreb !",
        bonus: { type: 'xp_percent', value: 20 }
    },
    "Allemagne|France": {
        name: "EURO CORE",
        folder: "EURO CORE",
        desc: "Le cœur battant de l'Europe unie ! 🇪🇺",
        bonus: { type: 'xp_percent', value: 15 }
    },
    "Espagne|Portugal": {
        name: "UNION IBÉRIQUE",
        folder: "UNION IBERIQUE",
        desc: "La péninsule réunifiée ! 🇪🇸🇵🇹",
        bonus: { type: 'xp_percent', value: 15 }
    },
    "Belgique|Pays-Bas": {
        name: "BENELUX",
        folder: "BENELUX",
        desc: "L'alliance des Pays-Bas historiques ! 🇧🇪🇳🇱",
        bonus: { type: 'rare_chance', value: 10 }
    },
    "Canada|États-Unis": {
        name: "ALENA",
        folder: "ALENA",
        desc: "Le partenariat nord-américain ! 🇺🇸🇨🇦",
        bonus: { type: 'xp_flat', value: 50 }
    },
    "Chine|Russie": {
        name: "PACTE DE L'EST",
        folder: "PACTE EST",
        desc: "L'alliance des géants ! 🇨🇳🇷🇺",
        bonus: { type: 'event_rare', value: true }
    }
};

// Continents pour bonus de compatibilité
window.CONTINENTS = {
    "Europe": ["Allemagne", "Belgique", "Espagne", "France", "Grèce", "Italie", "Pays-Bas", "Pologne", "Portugal", "Royaume-Uni", "Russie", "Suisse", "Ukraine"],
    "Afrique": ["Algérie", "Maroc", "Tunisie"],
    "Asie": ["Chine", "Corée du Sud", "Japon", "Pakistan", "Turquie"],
    "Amérique du Nord": ["Canada", "États-Unis", "Mexique"],
    "Amérique du Sud": ["Brésil"],
    "Moyen-Orient": ["Liban", "Palestine"]
};

// Pays voisins (frontières terrestres ou proximité géographique forte)
window.NEIGHBORS = {
    "France": ["Allemagne", "Belgique", "Espagne", "Italie", "Suisse"],
    "Allemagne": ["France", "Belgique", "Pays-Bas", "Pologne", "Suisse"],
    "Belgique": ["France", "Allemagne", "Pays-Bas"],
    "Pays-Bas": ["Belgique", "Allemagne"],
    "Espagne": ["France", "Portugal"],
    "Italie": ["France", "Suisse"],
    "Portugal": ["Espagne"],
    "Algérie": ["Maroc", "Tunisie"],
    "Maroc": ["Algérie", "Espagne"],
    "Tunisie": ["Algérie"],
    "Pologne": ["Allemagne", "Ukraine", "Russie"],
    "Ukraine": ["Pologne", "Russie"],
    "Russie": ["Ukraine", "Pologne", "Chine"],
    "Chine": ["Russie"],
    "Canada": ["États-Unis"],
    "États-Unis": ["Canada", "Mexique"],
    "Mexique": ["États-Unis"]
};

// Pays en conflit (malus de compatibilité)
window.CONFLICTS = [
    ["Russie", "Ukraine"]
];

// Données Genre
window.GENDERS = {
    MALE: { id: 'm', label: "Homme", icon: "👨" },
    FEMALE: { id: 'f', label: "Femme", icon: "🎀" }
};

// Générateur de Noms par Pays
// Fallback (World) si pays non défini
window.AI_NAMES = {
    "World": {
        m: ["Adam", "Alex", "John", "Liam", "Noah"],
        f: ["Eva", "Sarah", "Mia", "Emma", "Lara"],
        last: ["Smith", "Doe", "Novak", "Popov", "Muller"]
    },
    "France": {
        m: ["Pierre", "Louis", "Gabriel", "Arthur", "Jules"],
        f: ["Louise", "Jade", "Emma", "Chloé", "Manon"],
        last: ["Dupont", "Martin", "Bernard", "Dubois", "Lambert"]
    },
    "Algérie": {
        m: ["Amine", "Karim", "Mohamed", "Yacine", "Bilal"],
        f: ["Amel", "Leïla", "Nour", "Yasmine", "Soraya"],
        last: ["Benamar", "Saïdi", "Dahmani", "Mebarki", "Kader"]
    },
    "Maroc": {
        m: ["Hassan", "Omar", "Youssef", "Mehdi", "Driss"],
        f: ["Fatima", "Salma", "Rim", "Ghita", "Kenza"],
        last: ["Bennani", "Alami", "Tazi", "Idrissi", "Chraibi"]
    },
    "États-Unis": {
        m: ["James", "Mike", "Robert", "William", "David"],
        f: ["Mary", "Jennifer", "Linda", "Susan", "Karen"],
        last: ["Smith", "Johnson", "Williams", "Brown", "Jones"]
    },
    "Japon": {
        m: ["Kenji", "Hiro", "Takumi", "Yuki", "Ren"],
        f: ["Sakura", "Hina", "Akari", "Yui", "Mei"],
        last: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe"]
    },
    "Russie": {
        m: ["Ivan", "Dmitri", "Sergei", "Vladimir", "Mikhail"],
        f: ["Anastansia", "Maria", "Elena", "Olga", "Natalia"],
        last: ["Ivanov", "Smirnov", "Kuznetsov", "Popov", "Sokolov"]
    },
    "Pays-Bas": {
        m: ["Jan", "Pieter", "Willem", "Lars", "Daan"],
        f: ["Anna", "Sophie", "Emma", "Fleur", "Lotte"],
        last: ["De Vries", "Van Dijk", "Bakker", "Jansen", "Visser"]
    },
    "Espagne": {
        m: ["Carlos", "Diego", "Pablo", "Miguel", "Alejandro"],
        f: ["Maria", "Carmen", "Lucia", "Sofia", "Elena"],
        last: ["Garcia", "Rodriguez", "Martinez", "Lopez", "Fernandez"]
    },
    "Portugal": {
        m: ["João", "Pedro", "Miguel", "Tiago", "André"],
        f: ["Ana", "Maria", "Sofia", "Beatriz", "Ines"],
        last: ["Silva", "Santos", "Ferreira", "Costa", "Oliveira"]
    },
    "Chine": {
        m: ["Wei", "Ming", "Chen", "Lei", "Hao"],
        f: ["Mei", "Xia", "Lin", "Yan", "Jing"],
        last: ["Wang", "Li", "Zhang", "Liu", "Chen"]
    },
    "Canada": {
        m: ["Liam", "Noah", "Ethan", "Lucas", "Mason"],
        f: ["Emma", "Olivia", "Ava", "Sophia", "Mia"],
        last: ["Smith", "Brown", "Tremblay", "Martin", "Roy"]
    }
    // Ajouter d'autres pays au besoin...
};
