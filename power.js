/**
 * power.js
 * Système de Power (Pouvoirs) - Countryballs Mariage RPG Beta 7.1
 * Gestion des pouvoirs activables avec effets temporaires
 */

// === DÉFINITION DES POUVOIRS ===
const POWERS = {
    boostLove: {
        id: 'boostLove',
        name: 'Boost Love',
        icon: '💕',
        description: '+10% compatibilité sur le prochain calcul',
        cost: 20,
        effect: { type: 'compat_boost', value: 10 },
        duration: 1 // 1 utilisation
    },
    calmDown: {
        id: 'calmDown',
        name: 'Calm Down',
        icon: '😌',
        description: 'Annule le malus de conflit entre pays',
        cost: 15,
        effect: { type: 'remove_malus' },
        duration: 1
    },
    luckyDay: {
        id: 'luckyDay',
        name: 'Lucky Day',
        icon: '🍀',
        description: '+50 XP bonus immédiat',
        cost: 25,
        effect: { type: 'xp_bonus', value: 50 },
        duration: 0 // Effet immédiat
    },
    goldenEmoji: {
        id: 'goldenEmoji',
        name: 'Golden Emoji',
        icon: '🌟',
        description: 'Double les crédits de la prochaine union',
        cost: 30,
        effect: { type: 'double_credits' },
        duration: 1
    }
};

// === CLASSE POWER MANAGER ===
class PowerManager {
    constructor() {
        this.current = 0;
        this.max = 100;
        this.activeEffects = {
            boostLove: false,
            calmDown: false,
            goldenEmoji: false
        };

        this.loadPower();
        this.initDOM();
    }

    /**
     * Initialise les références DOM
     */
    initDOM() {
        this.dom = {
            btnPowers: document.getElementById('btn-powers'),
            modalPowers: document.getElementById('modal-powers'),
            powersGrid: document.getElementById('powers-grid'),
            btnPowersClose: document.getElementById('btn-powers-close'),
            powerBar: document.getElementById('power-bar'),
            powerText: document.getElementById('power-text')
        };

        this.bindEvents();
        this.updateUI();
    }

    /**
     * Attache les événements
     */
    bindEvents() {
        if (this.dom.btnPowers) {
            this.dom.btnPowers.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.openPowers();
            });
        }

        if (this.dom.btnPowersClose) {
            this.dom.btnPowersClose.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.closePowers();
            });
        }

        if (this.dom.modalPowers) {
            this.dom.modalPowers.addEventListener('click', (e) => {
                if (e.target === this.dom.modalPowers) this.closePowers();
            });
        }
    }

    /**
     * Ouvre la modal des pouvoirs
     */
    openPowers() {
        this.renderPowers();
        this.dom.modalPowers?.showModal();
        document.body.classList.add('modal-open');
    }

    /**
     * Ferme la modal des pouvoirs
     */
    closePowers() {
        this.dom.modalPowers?.close();
        document.body.classList.remove('modal-open');
    }

    /**
     * Render la grille des pouvoirs
     */
    renderPowers() {
        if (!this.dom.powersGrid) return;

        let html = `
            <div class="power-status">
                <div class="power-current">
                    <span class="power-icon-big">⚡</span>
                    <span class="power-value">${this.current}/${this.max}</span>
                </div>
                <div class="power-bar-big-wrapper">
                    <div class="power-bar-big" style="width: ${(this.current / this.max) * 100}%"></div>
                </div>
            </div>
            <div class="powers-list">
        `;

        for (const [id, power] of Object.entries(POWERS)) {
            const canAfford = this.current >= power.cost;
            const isActive = this.activeEffects[id];

            html += `
                <div class="power-card ${!canAfford ? 'disabled' : ''} ${isActive ? 'active' : ''}">
                    <div class="power-icon">${power.icon}</div>
                    <div class="power-info">
                        <h4>${power.name}</h4>
                        <p>${power.description}</p>
                        <span class="power-cost">⚡ ${power.cost}</span>
                        ${isActive ? '<span class="power-active-badge">✅ Actif</span>' : ''}
                    </div>
                    <button class="btn-activate-power" 
                        ${!canAfford || isActive ? 'disabled' : ''}
                        onclick="window.powerManager.usePower('${id}')">
                        ${isActive ? 'Actif' : canAfford ? 'Activer' : 'Insuffisant'}
                    </button>
                </div>
            `;
        }

        html += '</div>';
        html += `
            <div class="power-tips">
                <h4>💡 Comment gagner du Power ?</h4>
                <ul>
                    <li>+10⚡ par union célébrée</li>
                    <li>+5⚡ par message envoyé</li>
                    <li>+15⚡ si compatibilité ≥80%</li>
                </ul>
            </div>
        `;

        this.dom.powersGrid.innerHTML = html;
    }

    /**
     * Ajoute du power
     */
    addPower(amount) {
        this.current = Math.min(this.max, this.current + amount);
        this.updateUI();
        this.savePower();

        // Notification subtile
        this.showToast(`+${amount}⚡ Power`);
    }

    /**
     * Utilise un pouvoir
     */
    usePower(powerId) {
        const power = POWERS[powerId];
        if (!power) return false;

        if (this.current < power.cost) {
            this.showToast('❌ Power insuffisant !', 'error');
            return false;
        }

        if (this.activeEffects[powerId]) {
            this.showToast('⚠️ Ce pouvoir est déjà actif !', 'warning');
            return false;
        }

        // Déduire le coût
        this.current -= power.cost;

        // Appliquer l'effet
        this.applyEffect(powerId, power);

        // Audio
        window.audioEngine?.playXPGain();

        // Mise à jour
        this.updateUI();
        this.renderPowers();
        this.savePower();

        this.showToast(`${power.icon} ${power.name} activé !`, 'success');
        return true;
    }

    /**
     * Applique l'effet d'un pouvoir
     */
    applyEffect(powerId, power) {
        switch (power.effect.type) {
            case 'compat_boost':
                this.activeEffects.boostLove = power.effect.value;
                break;

            case 'remove_malus':
                this.activeEffects.calmDown = true;
                break;

            case 'xp_bonus':
                // Effet immédiat
                if (typeof addXP === 'function') {
                    addXP(power.effect.value);
                }
                break;

            case 'double_credits':
                this.activeEffects.goldenEmoji = true;
                break;
        }
    }

    /**
     * Consomme le boost de compatibilité
     */
    consumeBoostLove() {
        const boost = this.activeEffects.boostLove || 0;
        this.activeEffects.boostLove = false;
        this.savePower();
        return boost;
    }

    /**
     * Vérifie si le malus de conflit est annulé
     */
    isCalmDownActive() {
        const active = this.activeEffects.calmDown;
        if (active) {
            this.activeEffects.calmDown = false;
            this.savePower();
        }
        return active;
    }

    /**
     * Consomme le golden emoji (double crédits)
     */
    consumeGoldenEmoji() {
        const active = this.activeEffects.goldenEmoji;
        if (active) {
            this.activeEffects.goldenEmoji = false;
            this.savePower();
        }
        return active;
    }

    /**
     * Met à jour l'UI du header
     */
    updateUI() {
        if (this.dom.powerBar) {
            this.dom.powerBar.style.width = `${(this.current / this.max) * 100}%`;
        }
        if (this.dom.powerText) {
            this.dom.powerText.textContent = `${this.current}/${this.max}`;
        }
    }

    /**
     * Affiche une notification toast
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `power-toast ${type}`;
        toast.innerHTML = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    /**
     * Sauvegarde le power
     */
    savePower() {
        localStorage.setItem('powerData', JSON.stringify({
            current: this.current,
            max: this.max,
            activeEffects: this.activeEffects
        }));
    }

    /**
     * Charge le power
     */
    loadPower() {
        const saved = localStorage.getItem('powerData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.current = data.current || 0;
                this.max = data.max || 100;
                this.activeEffects = data.activeEffects || {
                    boostLove: false,
                    calmDown: false,
                    goldenEmoji: false
                };
            } catch (e) {
                console.error('Erreur chargement power:', e);
            }
        }
    }

    /**
     * Reset le power
     */
    resetPower() {
        this.current = 0;
        this.activeEffects = {
            boostLove: false,
            calmDown: false,
            goldenEmoji: false
        };
        localStorage.removeItem('powerData');
        this.updateUI();
    }
}

// === INITIALISATION GLOBALE ===
window.addEventListener('DOMContentLoaded', () => {
    window.powerManager = new PowerManager();
});
