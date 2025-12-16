/**
 * scenario-manager.js
 * Gestion du mode Scénario // Histoire
 * Version Beta 8.0
 */

class ScenarioManager {
    constructor() {
        this.currentChapter = 0;
        this.chapters = [
            { id: 1, title: "Le Commencement", levelReq: 1, text: "Le monde est vaste et chaotique. Deux nations doivent s'unir pour stabiliser la géopolitique mondiale." },
            { id: 2, title: "Premières Alliances", levelReq: 3, text: "Vos efforts portent leurs fruits. De nouvelles routes commerciales s'ouvrent grâce à vos unions." },
            { id: 3, title: "L'Ère des Tensions", levelReq: 5, text: "La croissance attire la jalousie. Des crises diplomatiques éclatent, nécessitant des mariages stratégiques." },
            { id: 4, title: "La Grande Unification", levelReq: 8, text: "Les continents se rapprochent. Les fusions deviennent une nécessité pour survivre." },
            { id: 5, title: "Paix Mondiale", levelReq: 12, text: "L'harmonie règne presque partout. Vous êtes l'architecte du nouveau monde." } // Endgame soft
        ];

        // Load save
        const saved = localStorage.getItem('scenarioProgress');
        if (saved) {
            this.currentChapter = parseInt(saved, 10);
        }
    }

    /**
     * Check if a new chapter is unlocked based on level
     * @param {number} level 
     */
    checkProgression(level) {
        // Find highest chapter unlocked
        const nextChapter = this.chapters.find(c => c.id === this.currentChapter + 1);

        if (nextChapter && level >= nextChapter.levelReq) {
            this.unlockChapter(nextChapter);
            return true;
        }
        return false;
    }

    /**
     * Unlock and display chapter
     */
    unlockChapter(chapter) {
        this.currentChapter = chapter.id;
        this.saveProgress();
        this.showChapterModal(chapter);

        // Audio cues
        if (window.audioEngine) {
            window.audioEngine.playLevelUp(); // Re-use fanfare
        }
    }

    showChapterModal(chapter) {
        // Create modal on the fly or reuse an existing one with specific class
        // Reusing modal-event logic but simpler
        const modal = document.createElement('dialog');
        modal.className = 'glass-modal scenario-modal';
        modal.innerHTML = `
            <div class="modal-content scenario-content">
                <div class="scenario-chapter">CHAPITRE ${chapter.id}</div>
                <h2>${chapter.title}</h2>
                <div class="scenario-text">${chapter.text}</div>
                <button class="btn-action">Continuer l'Histoire</button>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.showModal();
            document.body.classList.add('modal-open');
        });

        // Close event
        const btn = modal.querySelector('button');
        btn.addEventListener('click', () => {
            modal.close();
            document.body.classList.remove('modal-open');
            setTimeout(() => modal.remove(), 500);
        });
    }

    saveProgress() {
        localStorage.setItem('scenarioProgress', this.currentChapter.toString());
    }

    getLoadingText() {
        const texts = window.SCENARIO?.LOADING || ["Chargement..."];
        return texts[Math.floor(Math.random() * texts.length)];
    }
}

// Global Instance
window.scenarioManager = new ScenarioManager();
