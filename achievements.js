/**
 * achievements.js
 * Achievement/Success System - Beta 6.5
 */

class AchievementSystem {
    constructor() {
        this.unlocked = [];
        this.loadProgress();
    }

    /**
     * Check and unlock achievement if conditions met
     */
    check(achievementId, gameState) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return false;

        // Already unlocked
        if (this.unlocked.includes(achievementId)) return false;

        // Check condition
        if (achievement.condition(gameState)) {
            this.unlock(achievementId);
            return true;
        }
        return false;
    }

    /**
     * Unlock achievement and show toast
     */
    unlock(achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement || this.unlocked.includes(achievementId)) return;

        this.unlocked.push(achievementId);
        this.saveProgress();

        // Show toast notification
        showAchievementToast(achievement);

        // Play sound
        window.audioEngine?.playLevelUp();

        console.log(`🏆 Achievement Unlocked: ${achievement.title}`);
    }

    /**
     * Get progress stats
     */
    getProgress() {
        return {
            unlocked: this.unlocked.length,
            total: ACHIEVEMENTS.length,
            percentage: Math.round((this.unlocked.length / ACHIEVEMENTS.length) * 100)
        };
    }

    /** 
     * Check if achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.unlocked.includes(achievementId);
    }

    loadProgress() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            this.unlocked = JSON.parse(saved);
        }
    }

    saveProgress() {
        localStorage.setItem('achievements', JSON.stringify(this.unlocked));
    }
}

// Achievement Definitions
const ACHIEVEMENTS = [
    {
        id: 'first_union',
        title: '💍 Premier Mariage',
        description: 'Célébrez votre première union',
        icon: '💑',
        rarity: 'common',
        condition: (state) => state.totalRings >= 1
    },
    {
        id: 'collector_10',
        title: '📿 Collectionneur',
        description: 'Obtenez 10 anneaux',
        icon: '💎',
        rarity: 'rare',
        condition: (state) => state.totalRings >= 10
    },
    {
        id: 'collector_25',
        title: '👑 Maître Collectionneur',
        description: 'Obtenez 25 anneaux',
        icon: '🏆',
        rarity: 'epic',
        condition: (state) => state.totalRings >= 25
    },
    {
        id: 'legendary_ring',
        title: '🧡 Chasseur Légendaire',
        description: 'Obtenez votre premier anneau Légendaire',
        icon: '⭐',
        rarity: 'rare',
        condition: (state) => state.rings.filter(r => r.rarity === 'LEGENDARY').length >= 1
    },
    {
        id: 'mythic_ring',
        title: '❤️ Élite Mythique',
        description: 'Obtenez un anneau Mythique',
        icon: '🌟',
        rarity: 'legendary',
        condition: (state) => state.rings.filter(r => r.rarity === 'MYTHIC').length >= 1
    },
    {
        id: 'explorer_10',
        title: '🗺️ Explorateur',
        description: 'Testez 10 pays différents',
        icon: '🌍',
        rarity: 'common',
        condition: (state) => {
            const countries = new Set();
            state.rings.forEach(r => {
                r.countries.forEach(c => countries.add(c));
            });
            return countries.size >= 10;
        }
    },
    {
        id: 'level_10',
        title: '⚡ Ascension',
        description: 'Atteignez le niveau 10',
        icon: '🚀',
        rarity: 'rare',
        condition: (state) => state.level >= 10
    },
    {
        id: 'level_20',
        title: '👼 Transcendance',
        description: 'Atteignez le niveau 20',
        icon: '✨',
        rarity: 'epic',
        condition: (state) => state.level >= 20
    },
    {
        id: 'perfectionist',
        title: '💯 Perfectionniste',
        description: 'Obtenez 5 unions à 100% de compatibilité',
        icon: '🎯',
        rarity: 'epic',
        condition: (state) => state.rings.filter(r => r.compatibility === 100).length >= 5
    },
    {
        id: 'fusion_master',
        title: '👑 Maître des Fusions',
        description: 'Réalisez 3 fusions différentes',
        icon: '🔮',
        rarity: 'legendary',
        condition: (state) => {
            const fusions = new Set();
            state.rings.forEach(r => {
                if (r.isFusion && r.fusionKey) fusions.add(r.fusionKey);
            });
            return fusions.size >= 3;
        }
    },
    {
        id: 'diplomat',
        title: '🤝 Diplomate Aguerri',
        description: 'Complétez 5 événements',
        icon: '📜',
        rarity: 'rare',
        condition: (state) => {
            return window.eventSystem && window.eventSystem.eventHistory.length >= 5;
        }
    },
    {
        id: 'xp_master',
        title: '📈 Accumulateur',
        description: 'Accumulez 1000 XP au total',
        icon: '💰',
        rarity: 'epic',
        condition: (state) => {
            // Calculate total XP earned (current + spent on levels)
            let totalXP = state.xp;
            for (let i = 1; i < state.level; i++) {
                totalXP += 100 * i; // XP per level formula
            }
            return totalXP >= 1000;
        }
    }
];

/**
 * Show achievement toast notification
 */
function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = `achievement-toast rarity-${achievement.rarity}`;
    toast.innerHTML = `
        <div class="toast-icon">${achievement.icon}</div>
        <div class="toast-content">
            <div class="toast-title">Succès Débloqué !</div>
            <div class="toast-achievement">${achievement.title}</div>
            <div class="toast-desc">${achievement.description}</div>
        </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Global instance
window.achievementSystem = new AchievementSystem();

// Helper function to check achievements
window.checkAchievements = function (gameState) {
    if (!window.achievementSystem) return;

    ACHIEVEMENTS.forEach(achievement => {
        window.achievementSystem.check(achievement.id, gameState);
    });
};
