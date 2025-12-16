/**
 * events.js
 * Système d'Événements Aléatoires - Beta 6.5
 * Événements diplomatiques, crises, bonus
 */

class EventSystem {
    constructor() {
        this.lastEventLevel = 0;
        this.eventHistory = [];
        this.loadHistory();
    }

    /**
     * Check if an event should trigger
     * @param {number} currentLevel 
     */
    shouldTriggerEvent(currentLevel) {
        // Trigger every 3 levels
        if (currentLevel >= this.lastEventLevel + 3) {
            return true;
        }

        // Random chance (10% per marriage)
        return Math.random() < 0.1;
    }

    /**
     * Get a random event based on context
     * @param {object} gameState 
     */
    getRandomEvent(gameState) {
        const availableEvents = EVENTS.filter(event => {
            if (event.condition) {
                return event.condition(gameState);
            }
            return true;
        });

        if (availableEvents.length === 0) return null;

        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.lastEventLevel = gameState.level;
        this.eventHistory.push({
            id: event.id,
            level: gameState.level,
            date: new Date().toLocaleString()
        });
        this.saveHistory();

        return event;
    }

    loadHistory() {
        const saved = localStorage.getItem('eventHistory');
        if (saved) {
            const data = JSON.parse(saved);
            this.eventHistory = data.history || [];
            this.lastEventLevel = data.lastLevel || 0;
        }
    }

    saveHistory() {
        localStorage.setItem('eventHistory', JSON.stringify({
            history: this.eventHistory,
            lastLevel: this.lastEventLevel
        }));
    }
}

// Event Definitions
const EVENTS = [
    {
        id: 'diplomatic_summit',
        title: '🤝 Sommet Diplomatique',
        description: 'Les nations se réunissent pour discuter des alliances futures.',
        image: '🌍',
        choices: [
            {
                text: 'Organiser une grande conférence',
                effect: (state) => {
                    state.xp += 50;
                    return '+50 XP pour votre leadership !';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Boycotter le sommet',
                effect: (state) => {
                    // No effect
                    return 'Vous restez neutre.';
                },
                audio: 'playClick'
            }
        ]
    },
    {
        id: 'economic_crisis',
        title: '📉 Crise Économique',
        description: 'Une récession frappe le monde. Vos ressources sont menacées.',
        image: '💸',
        choices: [
            {
                text: 'Sacrifier 100 XP pour stabiliser',
                effect: (state) => {
                    if (state.xp >= 100) {
                        state.xp -= 100;
                        return 'Crise évitée ! -100 XP';
                    }
                    return 'XP insuffisant. La crise continue...';
                },
                audio: 'playClick'
            },
            {
                text: 'Laisser la crise passer',
                effect: (state) => {
                    // Lose random ring (if any)
                    if (state.rings.length > 0) {
                        state.rings.pop();
                        state.totalRings--;
                        return 'Vous avez perdu un anneau dans la crise !';
                    }
                    return 'Heureusement, vous n\'aviez rien à perdre.';
                },
                audio: 'playClick'
            }
        ],
        condition: (state) => state.level >= 5
    },
    {
        id: 'border_conflict',
        title: '⚔️ Conflit Frontalier',
        description: 'Tensions entre pays voisins. Une intervention est nécessaire.',
        image: '🛡️',
        choices: [
            {
                text: 'Médiation diplomatique',
                effect: (state) => {
                    state.xp += 75;
                    return 'Paix restaurée ! +75 XP';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Sanctions économiques',
                effect: (state) => {
                    state.xp += 25;
                    return 'Efficacité limitée. +25 XP';
                },
                audio: 'playXPGain'
            }
        ]
    },
    {
        id: 'cultural_festival',
        title: '🎭 Festival Culturel',
        description: 'Un grand festival international célèbre la diversité.',
        image: '🎊',
        choices: [
            {
                text: 'Participer activement',
                effect: (state) => {
                    state.xp += 40;
                    return '+40 XP et de beaux souvenirs !';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Envoyer des représentants',
                effect: (state) => {
                    state.xp += 15;
                    return '+15 XP pour votre présence.';
                },
                audio: 'playXPGain'
            }
        ]
    },
    {
        id: 'rare_fusion_bonus',
        title: '👑 Fusion Légendaire Détectée !',
        description: 'Vos dernières unions ont créé une synergie rare.',
        image: '✨',
        choices: [
            {
                text: 'Activer le bonus permanent',
                effect: (state) => {
                    state.fusionBonusActive = true;
                    return 'Bonus +10% XP permanent activé !';
                },
                audio: 'playLevelUp'
            }
        ],
        condition: (state) => state.rings.filter(r => r.isFusion).length >= 2
    },
    {
        id: 'ancient_treasure',
        title: '🗝️ Trésor Ancien',
        description: 'Des archéologues découvrent un artefact mystérieux.',
        image: '💎',
        choices: [
            {
                text: 'Exposer dans un musée',
                effect: (state) => {
                    state.xp += 60;
                    return 'Le monde vous remercie ! +60 XP';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Garder secrètement',
                effect: (state) => {
                    state.xp += 30;
                    // Potential future event unlock
                    return '+30 XP. Le secret est gardé...';
                },
                audio: 'playXPGain'
            }
        ],
        condition: (state) => state.level >= 8
    },
    {
        id: 'technology_breakthrough',
        title: '🚀 Percée Technologique',
        description: 'Une nouvelle innovation pourrait tout changer.',
        image: '⚡',
        choices: [
            {
                text: 'Investir dans la recherche',
                effect: (state) => {
                    state.xp += 80;
                    return 'Innovation réussie ! +80 XP';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Rester prudent',
                effect: (state) => {
                    state.xp += 20;
                    return 'Approche conservative. +20 XP';
                },
                audio: 'playXPGain'
            }
        ]
    },
    {
        id: 'natural_disaster',
        title: '🌪️ Catastrophe Naturelle',
        description: 'Un désastre frappe une région. L\'aide internationale est cruciale.',
        image: '🆘',
        choices: [
            {
                text: 'Envoyer des secours massifs',
                effect: (state) => {
                    if (state.xp >= 50) {
                        state.xp -= 50;
                        return 'Héros humanitaire ! -50 XP mais grand prestige';
                    }
                    return 'Ressources insuffisantes...';
                },
                audio: 'playClick'
            },
            {
                text: 'Aide symbolique',
                effect: (state) => {
                    state.xp += 10;
                    return 'Geste apprécié. +10 XP';
                },
                audio: 'playXPGain'
            }
        ]
    },
    {
        id: 'legendary_ring_chance',
        title: '💍 Opportunité Rare',
        description: 'Un marchand propose un anneau légendaire contre vos ressources.',
        image: '🎰',
        choices: [
            {
                text: 'Échanger 150 XP',
                effect: (state) => {
                    if (state.xp >= 150) {
                        state.xp -= 150;
                        // Force a legendary ring drop (will need integration with game.js)
                        return 'Vous avez obtenu un anneau Légendaire !';
                    }
                    return 'XP insuffisant...';
                },
                audio: 'playRingDrop'
            },
            {
                text: 'Refuser l\'offre',
                effect: (state) => {
                    return 'Vous gardez vos ressources.';
                },
                audio: 'playClick'
            }
        ],
        condition: (state) => state.level >= 10 && state.xp >= 150
    },
    {
        id: 'rebellion',
        title: '🔥 Rébellion Populaire',
        description: 'Des manifestations éclatent. Comment réagir ?',
        image: '✊',
        choices: [
            {
                text: 'Négocier avec les leaders',
                effect: (state) => {
                    state.xp += 55;
                    return 'Paix sociale restaurée. +55 XP';
                },
                audio: 'playXPGain'
            },
            {
                text: 'Ignorer les revendications',
                effect: (state) => {
                    state.xp -= 30;
                    return 'Tensions accrues. -30 XP';
                },
                audio: 'playClick'
            }
        ],
        condition: (state) => state.level >= 6
    }
];

// Global instance
window.eventSystem = new EventSystem();
