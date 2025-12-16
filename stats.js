/**
 * stats.js
 * Statistics & Encyclopedia System - Beta 7.0
 */

class StatsTracker {
    constructor() {
        this.stats = {
            totalMarriages: 0,
            countriesUsed: [],
            compatibilityHistory: [],
            fusionsRealized: [],
            ringsByRarity: {
                COMMON: 0,
                RARE: 0,
                EPIC: 0,
                LEGENDARY: 0,
                MYTHIC: 0
            },
            bestCompatibility: 0,
            totalXPEarned: 0,
            playTime: 0,
            sessionStart: Date.now()
        };
        this.loadStats();
    }

    /**
     * Record a new marriage
     */
    recordMarriage(player, partner, compatibility, isFusion, fusionKey) {
        this.stats.totalMarriages++;

        // Track countries
        if (!this.stats.countriesUsed.includes(player)) {
            this.stats.countriesUsed.push(player);
        }
        if (!this.stats.countriesUsed.includes(partner)) {
            this.stats.countriesUsed.push(partner);
        }

        // Track compatibility
        this.stats.compatibilityHistory.push(compatibility);
        if (compatibility > this.stats.bestCompatibility) {
            this.stats.bestCompatibility = compatibility;
        }

        // Track fusions
        if (isFusion && fusionKey && !this.stats.fusionsRealized.includes(fusionKey)) {
            this.stats.fusionsRealized.push(fusionKey);
        }

        this.saveStats();
    }

    /**
     * Record ring obtained
     */
    recordRing(rarity) {
        if (this.stats.ringsByRarity[rarity] !== undefined) {
            this.stats.ringsByRarity[rarity]++;
        }
        this.saveStats();
    }

    /**
     * Record XP earned
     */
    recordXP(amount) {
        this.stats.totalXPEarned += amount;
        this.saveStats();
    }

    /**
     * Get calculated statistics
     */
    getCalculatedStats() {
        const avgCompatibility = this.stats.compatibilityHistory.length > 0
            ? Math.round(this.stats.compatibilityHistory.reduce((a, b) => a + b, 0) / this.stats.compatibilityHistory.length)
            : 0;

        const perfectUnions = this.stats.compatibilityHistory.filter(c => c === 100).length;

        const totalRings = Object.values(this.stats.ringsByRarity).reduce((a, b) => a + b, 0);

        const rareRate = totalRings > 0
            ? Math.round(((this.stats.ringsByRarity.LEGENDARY + this.stats.ringsByRarity.MYTHIC) / totalRings) * 100)
            : 0;

        // Playtime calculation
        const sessionTime = Date.now() - this.stats.sessionStart;
        const totalTime = this.stats.playTime + sessionTime;
        const hours = Math.floor(totalTime / 3600000);
        const minutes = Math.floor((totalTime % 3600000) / 60000);

        return {
            totalMarriages: this.stats.totalMarriages,
            countriesDiscovered: this.stats.countriesUsed.length,
            countriesTotal: window.COUNTRIES?.length || 22,
            avgCompatibility,
            bestCompatibility: this.stats.bestCompatibility,
            perfectUnions,
            fusionsRealized: this.stats.fusionsRealized.length,
            fusionsTotal: Object.keys(window.FUSIONS || {}).length,
            totalRings,
            ringsByRarity: this.stats.ringsByRarity,
            rareRate,
            totalXPEarned: this.stats.totalXPEarned,
            playTime: `${hours}h ${minutes}m`
        };
    }

    /**
     * Get list of discovered countries
     */
    getDiscoveredCountries() {
        return this.stats.countriesUsed;
    }

    loadStats() {
        const saved = localStorage.getItem('gameStats');
        if (saved) {
            const data = JSON.parse(saved);
            this.stats = { ...this.stats, ...data };
            // Reset session start
            this.stats.sessionStart = Date.now();
        }
    }

    saveStats() {
        // Update playtime before saving
        const sessionTime = Date.now() - this.stats.sessionStart;
        const statsToSave = {
            ...this.stats,
            playTime: this.stats.playTime + sessionTime
        };
        // Reset session time after saving
        this.stats.sessionStart = Date.now();
        this.stats.playTime = statsToSave.playTime;

        localStorage.setItem('gameStats', JSON.stringify(statsToSave));
    }

    /**
     * Export all stats for save file
     */
    exportData() {
        return this.stats;
    }

    /**
     * Import stats from save file
     */
    importData(data) {
        if (data) {
            this.stats = { ...this.stats, ...data };
            this.stats.sessionStart = Date.now();
            this.saveStats();
        }
    }

    /**
     * Reset all stats
     */
    reset() {
        this.stats = {
            totalMarriages: 0,
            countriesUsed: [],
            compatibilityHistory: [],
            fusionsRealized: [],
            ringsByRarity: { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0, MYTHIC: 0 },
            bestCompatibility: 0,
            totalXPEarned: 0,
            playTime: 0,
            sessionStart: Date.now()
        };
        this.saveStats();
    }
}

// Global instance
window.statsTracker = new StatsTracker();
