/**
 * story.js
 * Mode Histoire - Countryballs Mariage RPG Beta 7.1
 * Système de chapitres narratifs avec progression sauvegardée
 */

// === DONNÉES DES CHAPITRES ===
const CHAPTERS = [
    {
        id: 1,
        title: "La Rencontre",
        icon: "🌍",
        intro: "Deux nations que tout sépare... ou que tout rapproche ?",
        narrative: `
            Le soleil se levait sur la frontière imaginaire entre deux mondes.
            D'un côté, une nation fière de son histoire millénaire.
            De l'autre, un pays aux rêves de grandeur.
            
            Ce jour-là, le destin avait décidé de mêler leurs chemins.
        `,
        dialogues: [
            { speaker: "player", text: "Je ne t'avais jamais remarqué avant..." },
            { speaker: "partner", text: "C'est peut-être parce que tu ne regardais pas au bon endroit." },
            { speaker: "player", text: "Nos drapeaux sont si différents, pourtant..." },
            { speaker: "partner", text: "Les couleurs ne définissent pas l'âme, tu sais." }
        ],
        conclusion: "Cette première rencontre allait changer le cours de l'histoire..."
    },
    {
        id: 2,
        title: "Le Test de Compatibilité",
        icon: "💫",
        accroche: "Parfois, un chiffre ne dit pas tout… mais il déclenche tout.",
        intro: "Parfois, un chiffre ne dit pas tout… mais il déclenche tout.",
        narrative: `
            Le ciel s'est assombri, comme si le monde retenait son souffle.
            Une interface ancienne s'est allumée entre vous deux, gravée de symboles : un cercle, une barre, et un pourcentage.

            Ce n'était pas une simple mesure.
            C'était une épreuve. Une façon de dire : "Êtes-vous faits pour avancer ensemble… ou juste pour vous croiser ?"
        `,
        dialogues: [
            { speaker: "player", text: "Alors… c'est ça, le fameux test ?" },
            { speaker: "partner", text: "Oui. Mais fais attention… certains résultats réveillent des choses." },
            { speaker: "player", text: "Je veux savoir. Même si ça fait peur." },
            { speaker: "partner", text: "Dans ce cas… lance le calcul." }
        ],
        // Effets RPG variables selon compatibilité
        compatibilityEffects: {
            high: "✨ Un frisson chaleureux traverse l'écran.",      // >= 80
            medium: "💫 Le cercle brille faiblement, comme hésitant.", // 50-79
            low: "⚡ Le cercle tremble… puis se stabilise."            // < 50
        },
        conclusion: "Le test était lancé... les résultats allaient tout changer."
    },
    {
        id: 3,
        title: "Le Premier Rendez-vous",
        icon: "💖",
        accroche: "La première vraie conversation… c'est là que tout commence.",
        intro: "La première vraie conversation… c'est là que tout commence.",
        narrative: `
            Vous vous retrouvez dans un lieu neutre : ni chez toi, ni chez elle, mais entre deux mondes.
            Un café discret, une lumière douce, et ce silence étrange… celui où tout peut arriver.

            Chaque mot semble peser plus lourd que d'habitude.
            Et pourtant, quelque chose est simple : vous êtes là. Ensemble.
        `,
        dialogues: [
            { speaker: "partner", text: "Tu sais… j'étais pas sûre de venir." },
            { speaker: "player", text: "Moi aussi. Mais j'ai pensé à toi." },
            { speaker: "partner", text: "Ça fait bizarre… j'ai l'impression de te connaître déjà." },
            { speaker: "player", text: "Peut-être parce qu'on se ressemble… sans être pareils." }
        ],
        event: "🎭 Événement : Moment de vérité",
        eventBonus: "+Power / +XP si le joueur envoie un message gentiment",
        conclusion: "Ce premier rendez-vous avait créé un lien invisible mais puissant..."
    },
    {
        id: 4,
        title: "La Crise",
        icon: "⚡",
        accroche: "Quand deux mondes se rapprochent… les différences se voient.",
        intro: "Quand deux mondes se rapprochent… les différences se voient.",
        narrative: `
            Le temps passe. Les messages s'enchaînent.
            Et un jour, une phrase de trop… ou un silence trop long… fait apparaître une fissure.

            Ce n'est pas une catastrophe.
            C'est un test plus dur : la patience, la confiance, la façon dont on réagit quand on ne comprend plus l'autre.
        `,
        dialogues: [
            { speaker: "player", text: "Pourquoi tu réponds comme ça ?" },
            { speaker: "partner", text: "Parce que j'ai peur que tu joues avec moi." },
            { speaker: "player", text: "Je joue pas. J'essaie de faire bien…" },
            { speaker: "partner", text: "Alors prouve-le. Pas avec des mots… avec des actes." }
        ],
        // Effet RPG lié aux powers
        powerEffect: {
            calmDown: "🕊️ Le conflit se dissipe. L'air redevient respirable.",
            noPower: "⚠️ Le malus de crise reste… pour l'instant."
        },
        conclusion: "La crise passée, quelque chose de plus fort émergeait..."
    },
    {
        id: 5,
        title: "La Décision",
        icon: "💍",
        accroche: "Ce n'est pas le pourcentage qui décide… c'est le choix.",
        intro: "Ce n'est pas le pourcentage qui décide… c'est le choix.",
        narrative: `
            Le cercle de compatibilité tourne, encore.
            Mais cette fois, tu ne regardes plus juste le chiffre. Tu regardes le chemin parcouru.

            Les doutes, les rires, les silences.
            Les mots simples. Les moments vrais.
            Et cette sensation : quoi qu'il arrive… quelque chose a déjà changé.

            Alors la question apparaît, nette, brillante, impossible à éviter :
            "Célébrer l'union ?"
        `,
        dialogues: [
            { speaker: "partner", text: "Si tu appuies… ça veut dire quelque chose." },
            { speaker: "player", text: "Je sais." },
            { speaker: "partner", text: "Et tu es sûr ?" },
            { speaker: "player", text: "Oui. Parce que je te choisis." }
        ],
        // Fins variables selon compatibilité
        compatibilityEffects: {
            high: "👑 Union Parfaite — Le monde applaudit.",           // >= 80
            medium: "💕 Union Sincère — Rien n'est parfait, mais c'est vrai.", // 50-79
            low: "🔥 Union Risquée — Tout commence… avec du courage."  // < 50
        },
        conclusion: "Et ainsi, deux nations devinrent une seule famille... à jamais liées par l'amour."
    }
];

// === CLASSE STORY MANAGER ===
class StoryManager {
    constructor() {
        this.currentChapter = 0;
        this.chaptersCompleted = [];
        this.isReading = false;

        this.loadProgress();
        this.initDOM();
    }

    /**
     * Initialise les références DOM
     */
    initDOM() {
        this.dom = {
            btnStory: document.getElementById('btn-story'),
            modalStory: document.getElementById('modal-story'),
            storyList: document.getElementById('story-list'),
            storyReader: document.getElementById('story-reader'),
            btnStoryClose: document.getElementById('btn-story-close'),
            btnPrevChapter: document.getElementById('btn-prev-chapter'),
            btnNextChapter: document.getElementById('btn-next-chapter'),
            chapterTitle: document.getElementById('chapter-title'),
            chapterContent: document.getElementById('chapter-content'),
            btnBackToList: document.getElementById('btn-back-to-list')
        };

        this.bindEvents();
    }

    /**
     * Attache les événements
     */
    bindEvents() {
        if (this.dom.btnStory) {
            this.dom.btnStory.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.openStory();
            });
        }

        if (this.dom.btnStoryClose) {
            this.dom.btnStoryClose.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.closeStory();
            });
        }

        if (this.dom.btnBackToList) {
            this.dom.btnBackToList.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.showList();
            });
        }

        if (this.dom.btnPrevChapter) {
            this.dom.btnPrevChapter.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.prevChapter();
            });
        }

        if (this.dom.btnNextChapter) {
            this.dom.btnNextChapter.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.nextChapter();
            });
        }

        if (this.dom.modalStory) {
            this.dom.modalStory.addEventListener('click', (e) => {
                if (e.target === this.dom.modalStory) this.closeStory();
            });
        }
    }

    /**
     * Ouvre la modal histoire
     */
    openStory() {
        this.showList();
        this.dom.modalStory?.showModal();
        document.body.classList.add('modal-open');
    }

    /**
     * Ferme la modal histoire
     */
    closeStory() {
        this.dom.modalStory?.close();
        document.body.classList.remove('modal-open');
        this.isReading = false;
    }

    /**
     * Affiche la liste des chapitres
     */
    showList() {
        this.isReading = false;
        if (this.dom.storyList) this.dom.storyList.style.display = 'block';
        if (this.dom.storyReader) this.dom.storyReader.style.display = 'none';

        this.renderList();
    }

    /**
     * Render la liste des chapitres
     */
    renderList() {
        if (!this.dom.storyList) return;

        let html = '<div class="chapters-grid">';

        CHAPTERS.forEach((chapter, index) => {
            const isCompleted = this.chaptersCompleted.includes(chapter.id);
            const isCurrent = index === this.currentChapter;
            const isLocked = index > this.currentChapter && !isCompleted;

            let statusClass = '';
            let statusIcon = '';

            if (isCompleted) {
                statusClass = 'completed';
                statusIcon = '✅';
            } else if (isCurrent) {
                statusClass = 'current';
                statusIcon = '📖';
            } else if (isLocked) {
                statusClass = 'locked';
                statusIcon = '🔒';
            }

            html += `
                <div class="chapter-card ${statusClass}" data-chapter="${index}">
                    <div class="chapter-icon">${chapter.icon}</div>
                    <div class="chapter-info">
                        <h4>Chapitre ${chapter.id} ${statusIcon}</h4>
                        <h3>${chapter.title}</h3>
                        <p>${chapter.intro}</p>
                    </div>
                    <button class="btn-read-chapter" ${isLocked ? 'disabled' : ''} 
                        onclick="window.storyManager.openChapter(${index})">
                        ${isLocked ? '🔒 Verrouillé' : '📖 Lire'}
                    </button>
                </div>
            `;
        });

        html += '</div>';
        this.dom.storyList.innerHTML = html;
    }

    /**
     * Ouvre un chapitre spécifique
     */
    openChapter(index) {
        if (index < 0 || index >= CHAPTERS.length) return;
        if (index > this.currentChapter && !this.chaptersCompleted.includes(CHAPTERS[index].id)) return;

        this.currentChapter = index;
        this.isReading = true;

        if (this.dom.storyList) this.dom.storyList.style.display = 'none';
        if (this.dom.storyReader) this.dom.storyReader.style.display = 'block';

        this.renderChapter();
    }

    /**
     * Récupère la compatibilité actuelle du jeu
     * @returns {number} Pourcentage de compatibilité (0-100)
     */
    getCompatibility() {
        // Essayer de récupérer depuis window.game ou localStorage
        if (window.game && typeof window.game.compatibility === 'number') {
            return window.game.compatibility;
        }
        // Fallback: essayer localStorage
        const saved = localStorage.getItem('gameState');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                return data.compatibility || 50;
            } catch (e) {
                return 50;
            }
        }
        return 50; // Valeur par défaut
    }

    /**
     * Retourne l'effet de compatibilité approprié
     * @param {Object} effects - Objet avec high, medium, low
     * @returns {string} Texte de l'effet
     */
    getCompatibilityEffect(effects) {
        if (!effects) return '';
        const compat = this.getCompatibility();
        if (compat >= 80) return effects.high || '';
        if (compat >= 50) return effects.medium || '';
        return effects.low || '';
    }

    /**
     * Vérifie si un power est actif
     * @param {string} powerName - Nom du power
     * @returns {boolean}
     */
    isPowerActive(powerName) {
        if (window.powerManager && typeof window.powerManager.isPowerActive === 'function') {
            return window.powerManager.isPowerActive(powerName);
        }
        return false;
    }

    /**
     * Render le chapitre actuel
     */
    renderChapter() {
        const chapter = CHAPTERS[this.currentChapter];
        if (!chapter) return;

        if (this.dom.chapterTitle) {
            this.dom.chapterTitle.innerHTML = `${chapter.icon} Chapitre ${chapter.id} : ${chapter.title}`;
        }

        if (this.dom.chapterContent) {
            // Accroche si disponible
            const accroche = chapter.accroche ?
                `<div class="chapter-accroche">« ${chapter.accroche} »</div>` : '';

            let html = `
                ${accroche}
                <div class="chapter-intro">${chapter.intro}</div>
                <div class="chapter-narrative">${chapter.narrative.trim()}</div>
                <div class="chapter-dialogues">
            `;

            chapter.dialogues.forEach((dialogue, i) => {
                const isPlayer = dialogue.speaker === 'player';
                html += `
                    <div class="dialogue ${isPlayer ? 'player' : 'partner'}" style="animation-delay: ${i * 0.15}s">
                        <span class="dialogue-speaker">${isPlayer ? '🎮 Joueur' : '💕 Partenaire'}</span>
                        <p class="dialogue-text">"${dialogue.text}"</p>
                    </div>
                `;
            });

            html += `</div>`;

            // Effet RPG selon compatibilité (chapitres 2 et 5)
            if (chapter.compatibilityEffects) {
                const effect = this.getCompatibilityEffect(chapter.compatibilityEffects);
                const compat = this.getCompatibility();
                let effectClass = compat >= 80 ? 'effect-high' : (compat >= 50 ? 'effect-medium' : 'effect-low');
                html += `
                    <div class="chapter-effect ${effectClass}">
                        <span class="effect-label">🎮 Effet RPG</span>
                        <p class="effect-text">${effect}</p>
                    </div>
                `;
            }

            // Effet Power (chapitre 4 - La Crise)
            if (chapter.powerEffect) {
                const hasCalmPower = this.isPowerActive('calmDown') || this.isPowerActive('calm');
                const powerText = hasCalmPower ? chapter.powerEffect.calmDown : chapter.powerEffect.noPower;
                const powerClass = hasCalmPower ? 'power-active' : 'power-inactive';
                html += `
                    <div class="chapter-power-effect ${powerClass}">
                        <span class="effect-label">⚡ Effet Power</span>
                        <p class="effect-text">${powerText}</p>
                    </div>
                `;
            }

            // Événement spécial (chapitre 3)
            if (chapter.event) {
                html += `
                    <div class="chapter-event">
                        <span class="event-title">${chapter.event}</span>
                        ${chapter.eventBonus ? `<span class="event-bonus">💫 ${chapter.eventBonus}</span>` : ''}
                    </div>
                `;
            }

            html += `<div class="chapter-conclusion">${chapter.conclusion}</div>`;

            this.dom.chapterContent.innerHTML = html;
        }

        // Mettre à jour navigation
        if (this.dom.btnPrevChapter) {
            this.dom.btnPrevChapter.disabled = this.currentChapter === 0;
        }
        if (this.dom.btnNextChapter) {
            const isLast = this.currentChapter === CHAPTERS.length - 1;
            this.dom.btnNextChapter.disabled = isLast;
            this.dom.btnNextChapter.textContent = isLast ? '🎉 Fin' : 'Suivant ➡️';
        }

        // Sauvegarder le chapitre courant
        this.saveProgress();
    }

    /**
     * Chapitre précédent
     */
    prevChapter() {
        if (this.currentChapter > 0) {
            this.openChapter(this.currentChapter - 1);
        }
    }

    /**
     * Chapitre suivant
     */
    nextChapter() {
        if (this.currentChapter < CHAPTERS.length - 1) {
            // Marquer le chapitre actuel comme complété
            if (!this.chaptersCompleted.includes(CHAPTERS[this.currentChapter].id)) {
                this.chaptersCompleted.push(CHAPTERS[this.currentChapter].id);
                window.audioEngine?.playXPGain();
            }

            this.openChapter(this.currentChapter + 1);
            this.saveProgress();
        }
    }

    /**
     * Débloquer le chapitre suivant (appelé lors d'événements du jeu)
     */
    unlockNextChapter() {
        const currentId = CHAPTERS[this.currentChapter]?.id;
        if (currentId && !this.chaptersCompleted.includes(currentId)) {
            this.chaptersCompleted.push(currentId);
        }
        if (this.currentChapter < CHAPTERS.length - 1) {
            this.currentChapter++;
        }
        this.saveProgress();
    }

    /**
     * Sauvegarde la progression
     */
    saveProgress() {
        const data = {
            currentChapter: this.currentChapter,
            chaptersCompleted: this.chaptersCompleted
        };
        localStorage.setItem('storyProgress', JSON.stringify(data));
    }

    /**
     * Charge la progression
     */
    loadProgress() {
        const saved = localStorage.getItem('storyProgress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentChapter = data.currentChapter || 0;
                this.chaptersCompleted = data.chaptersCompleted || [];
            } catch (e) {
                console.error('Erreur chargement histoire:', e);
            }
        }
    }

    /**
     * Reset la progression
     */
    resetProgress() {
        this.currentChapter = 0;
        this.chaptersCompleted = [];
        localStorage.removeItem('storyProgress');
    }
}

// === INITIALISATION GLOBALE ===
window.addEventListener('DOMContentLoaded', () => {
    window.storyManager = new StoryManager();
});
