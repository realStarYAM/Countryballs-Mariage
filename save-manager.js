/**
 * save-manager.js
 * Save/Load System - Beta 7.0
 * Export/Import game progress as JSON
 */

class SaveManager {
    constructor() {
        this.version = '7.0';
    }

    /**
     * Collect all game data for export
     */
    collectSaveData() {
        const saveData = {
            version: this.version,
            exportDate: new Date().toISOString(),
            exportTimestamp: Date.now(),

            // Player progress
            player: {
                xp: 0,
                level: 1
            },

            // Rings collection
            rings: [],
            totalRings: 0,

            // Achievements
            achievements: [],

            // Event history
            eventHistory: [],
            lastEventLevel: 0,

            // Statistics
            stats: null,

            // Theme preference
            theme: localStorage.getItem('theme') || 'default',

            // Audio preference
            audioMuted: localStorage.getItem('audioMuted') === 'true'
        };

        // Get player progress
        const progress = localStorage.getItem('playerProgress');
        if (progress) {
            const parsed = JSON.parse(progress);
            saveData.player.xp = parsed.xp || 0;
            saveData.player.level = parsed.level || 1;
        }

        // Get rings
        const rings = localStorage.getItem('ringsCollection');
        if (rings) {
            const parsed = JSON.parse(rings);
            saveData.rings = parsed.rings || [];
            saveData.totalRings = parsed.totalRings || 0;
        }

        // Get achievements
        const achievements = localStorage.getItem('achievements');
        if (achievements) {
            saveData.achievements = JSON.parse(achievements);
        }

        // Get event history
        const eventHistory = localStorage.getItem('eventHistory');
        if (eventHistory) {
            const parsed = JSON.parse(eventHistory);
            saveData.eventHistory = parsed.history || [];
            saveData.lastEventLevel = parsed.lastLevel || 0;
        }

        // Get stats
        if (window.statsTracker) {
            saveData.stats = window.statsTracker.exportData();
        }

        return saveData;
    }

    /**
     * Export save to JSON file
     */
    exportSave() {
        const saveData = this.collectSaveData();
        const json = JSON.stringify(saveData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `countryballs-rpg-save-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        window.audioEngine?.playXPGain();
        return true;
    }

    /**
     * Import save from JSON file
     */
    async importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);

                    // Validate save data
                    if (!this.validateSaveData(saveData)) {
                        reject(new Error('Fichier de sauvegarde invalide'));
                        return;
                    }

                    // Restore data
                    this.restoreSaveData(saveData);

                    window.audioEngine?.playLevelUp();
                    resolve(saveData);
                } catch (error) {
                    reject(new Error('Erreur de lecture du fichier'));
                }
            };

            reader.onerror = () => reject(new Error('Erreur de lecture'));
            reader.readAsText(file);
        });
    }

    /**
     * Validate save data structure
     */
    validateSaveData(data) {
        if (!data) return false;
        if (!data.version) return false;
        if (!data.player || typeof data.player.xp !== 'number') return false;
        if (!Array.isArray(data.rings)) return false;
        return true;
    }

    /**
     * Restore save data to localStorage
     */
    restoreSaveData(saveData) {
        // Restore player progress
        localStorage.setItem('playerProgress', JSON.stringify({
            xp: saveData.player.xp,
            level: saveData.player.level
        }));

        // Restore rings
        localStorage.setItem('ringsCollection', JSON.stringify({
            rings: saveData.rings,
            totalRings: saveData.totalRings
        }));

        // Restore achievements
        if (saveData.achievements) {
            localStorage.setItem('achievements', JSON.stringify(saveData.achievements));
        }

        // Restore event history
        if (saveData.eventHistory) {
            localStorage.setItem('eventHistory', JSON.stringify({
                history: saveData.eventHistory,
                lastLevel: saveData.lastEventLevel
            }));
        }

        // Restore stats
        if (saveData.stats && window.statsTracker) {
            window.statsTracker.importData(saveData.stats);
        }

        // Restore theme
        if (saveData.theme) {
            localStorage.setItem('theme', saveData.theme);
        }

        // Restore audio
        localStorage.setItem('audioMuted', saveData.audioMuted ? 'true' : 'false');
    }

    /**
     * Reset all game data
     */
    resetAllData() {
        const keysToRemove = [
            'playerProgress',
            'ringsCollection',
            'achievements',
            'eventHistory',
            'gameStats',
            'unionHistory'
        ];

        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Reset stats tracker
        if (window.statsTracker) {
            window.statsTracker.reset();
        }

        // Reset achievement system
        if (window.achievementSystem) {
            window.achievementSystem.unlocked = [];
            window.achievementSystem.saveProgress();
        }

        // Reset event system
        if (window.eventSystem) {
            window.eventSystem.eventHistory = [];
            window.eventSystem.lastEventLevel = 0;
            window.eventSystem.saveHistory();
        }

        return true;
    }
}

// Global instance
window.saveManager = new SaveManager();
