/**
 * choices.js
 * Données du jeu : Pays, Fusions, Prénoms, Noms.
 * Version: Beta 5.5
 */

// Liste des pays disponibles (Dossiers dans /Pays/)
window.COUNTRIES = [
    "Algérie", "Allemagne", "Belgique", "Brésil", "Canada", "Chine",
    "Corée du Sud", "Espagne", "États-Unis", "France", "Grèce",
    "Italie", "Japon", "Maroc", "Mexique", "Portugal",
    "Royaume-Uni", "Russie", "Suisse", "Tunisie", "Turquie", "Ukraine"
];

// Configuration des Fusions (Dossiers dans /Fusion Pays/)
// Clé = Pays1|Pays2 (Ordre Alphabétique obligatoire)
window.FUSIONS = {
    "Algérie|Maroc": {
        name: "ALGÉROC",
        folder: "ALGÉROC", // Nom du dossier dans "Fusion Pays"
        desc: "L'union sacrée du Maghreb !"
    },
    // Exemple d'autre fusion si besoin
    "France|Allemagne": {
        name: "FRALLEMAGNE",
        folder: "FRALLEMAGNE",
        desc: "Le moteur de l'Europe."
    }
};

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
    }
    // Ajouter d'autres pays au besoin...
};
