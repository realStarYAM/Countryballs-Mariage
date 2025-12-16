/**
 * shop.js
 * Système de Boutique Premium pour Countryballs Mariage RPG
 * Version 1.0
 */

// === CATALOGUE D'ARTICLES ===
const SHOP_ITEMS = {
    // --- BONUS DE COMPATIBILITÉ ---
    boost_compat_5: {
        id: 'boost_compat_5',
        name: 'Bénédiction Mineure',
        description: '+5% de compatibilité sur la prochaine union',
        price: 50,
        category: 'boost',
        icon: '💫',
        effect: { type: 'compat_boost', value: 5 },
        consumable: true
    },
    boost_compat_10: {
        id: 'boost_compat_10',
        name: 'Bénédiction Majeure',
        description: '+10% de compatibilité sur la prochaine union',
        price: 100,
        category: 'boost',
        icon: '✨',
        effect: { type: 'compat_boost', value: 10 },
        consumable: true
    },
    boost_compat_20: {
        id: 'boost_compat_20',
        name: 'Bénédiction Divine',
        description: '+20% de compatibilité sur la prochaine union',
        price: 200,
        category: 'boost',
        icon: '🌟',
        effect: { type: 'compat_boost', value: 20 },
        consumable: true
    },

    // --- MULTIPLICATEURS XP ---
    xp_mult_1_5: {
        id: 'xp_mult_1_5',
        name: 'Potion d\'XP',
        description: 'XP x1.5 pendant 3 unions',
        price: 75,
        category: 'xp',
        icon: '🧪',
        effect: { type: 'xp_mult', value: 1.5, duration: 3 },
        consumable: true
    },
    xp_mult_2: {
        id: 'xp_mult_2',
        name: 'Élixir d\'XP',
        description: 'XP x2 pendant 3 unions',
        price: 150,
        category: 'xp',
        icon: '⚗️',
        effect: { type: 'xp_mult', value: 2, duration: 3 },
        consumable: true
    },

    // --- THÈMES PREMIUM ---
    theme_sakura: {
        id: 'theme_sakura',
        name: 'Thème Sakura',
        description: 'Un thème rose fleuri inspiré du Japon',
        price: 300,
        category: 'theme',
        icon: '🌸',
        effect: { type: 'unlock_theme', value: 'sakura' },
        consumable: false
    },
    theme_royal: {
        id: 'theme_royal',
        name: 'Thème Royal',
        description: 'Un thème doré et majestueux',
        price: 500,
        category: 'theme',
        icon: '👑',
        effect: { type: 'unlock_theme', value: 'royal' },
        consumable: false
    },

    // --- LIVRES ---
    book_guide: {
        id: 'book_guide',
        name: 'Guide de l\'Union Parfaite',
        description: 'Les secrets pour atteindre 100%',
        price: 0, // Gratuit
        category: 'book',
        icon: '📖',
        effect: { type: 'unlock_book', value: 'guide_union_parfaite' },
        consumable: false
    },
    book_secrets: {
        id: 'book_secrets',
        name: 'Secrets des Âmes Sœurs',
        description: 'Découvrez les fusions secrètes',
        price: 150,
        category: 'book',
        icon: '📕',
        effect: { type: 'unlock_book', value: 'secrets_ames_soeurs' },
        consumable: false,
        levelRequired: 5
    },
    book_manual: {
        id: 'book_manual',
        name: 'Manuel du Mariage RPG',
        description: 'Le guide ultime du maître',
        price: 250,
        category: 'book',
        icon: '📚',
        effect: { type: 'unlock_book', value: 'manuel_mariage_rpg' },
        consumable: false,
        levelRequired: 10
    },
    book_legendes: {
        id: 'book_legendes',
        name: 'Légendes des Countryballs',
        description: 'Histoires épiques des nations',
        price: 200,
        category: 'book',
        icon: '📜',
        effect: { type: 'unlock_book', value: 'legendes_countryballs' },
        consumable: false
    }
};

// === CLASSE SHOP MANAGER ===
class ShopManager {
    constructor() {
        this.items = SHOP_ITEMS;
        this.purchases = [];
        this.activeEffects = {
            compatBoost: 0,
            xpMult: 1,
            xpMultRemaining: 0
        };
        this.unlockedThemes = ['default', 'ubuntu', 'aero', 'win95', 'winxp', 'ios', 'android', 'oneui', 'miui', 'google'];
        this.unlockedBooks = ['guide_union_parfaite']; // Gratuit par défaut

        this.loadPurchases();
        this.initDOM();
    }

    /**
     * Initialise les références DOM
     */
    initDOM() {
        this.dom = {
            btnShop: document.getElementById('btn-shop'),
            modalShop: document.getElementById('modal-shop'),
            shopGrid: document.getElementById('shop-grid'),
            btnShopClose: document.getElementById('btn-shop-close'),
            creditsDisplay: document.getElementById('credits-display'),
            shopCredits: document.getElementById('shop-credits')
        };

        this.bindEvents();
    }

    /**
     * Attache les événements
     */
    bindEvents() {
        if (this.dom.btnShop) {
            this.dom.btnShop.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.openShop();
            });
        }

        if (this.dom.btnShopClose) {
            this.dom.btnShopClose.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.closeShop();
            });
        }

        if (this.dom.modalShop) {
            this.dom.modalShop.addEventListener('click', (e) => {
                if (e.target === this.dom.modalShop) this.closeShop();
            });
        }
    }

    /**
     * Ouvre la modal boutique
     */
    openShop() {
        this.renderShop();
        this.dom.modalShop?.showModal();
        document.body.classList.add('modal-open');
    }

    /**
     * Ferme la modal boutique
     */
    closeShop() {
        this.dom.modalShop?.close();
        document.body.classList.remove('modal-open');
    }

    /**
     * Affiche le contenu de la boutique
     */
    renderShop() {
        if (!this.dom.shopGrid) return;

        // Mise à jour des crédits affichés
        if (this.dom.shopCredits) {
            this.dom.shopCredits.textContent = state.credits || 0;
        }

        // Grouper par catégorie
        const categories = {
            boost: { name: '💫 Bonus de Compatibilité', items: [] },
            xp: { name: '⚡ Multiplicateurs XP', items: [] },
            theme: { name: '🎨 Thèmes Premium', items: [] },
            book: { name: '📚 Livres', items: [] }
        };

        for (const [id, item] of Object.entries(this.items)) {
            if (categories[item.category]) {
                categories[item.category].items.push({ id, ...item });
            }
        }

        let html = '';
        for (const [categoryId, category] of Object.entries(categories)) {
            if (category.items.length === 0) continue;

            html += `<div class="shop-category">
                <h3 class="shop-category-title">${category.name}</h3>
                <div class="shop-items">`;

            for (const item of category.items) {
                const owned = this.isOwned(item.id);
                const canAfford = (state.credits || 0) >= item.price;
                const levelLocked = item.levelRequired && (state.level || 1) < item.levelRequired;

                let statusClass = '';
                let statusText = '';
                let buttonText = item.price === 0 ? 'Gratuit' : `${item.price} 💎`;

                if (owned && !item.consumable) {
                    statusClass = 'owned';
                    statusText = '✅ Possédé';
                    buttonText = 'Possédé';
                } else if (levelLocked) {
                    statusClass = 'locked';
                    statusText = `🔒 Niveau ${item.levelRequired}`;
                    buttonText = 'Verrouillé';
                } else if (!canAfford && item.price > 0) {
                    statusClass = 'cant-afford';
                }

                html += `
                    <div class="shop-item ${statusClass}" data-item-id="${item.id}">
                        <div class="shop-item-icon">${item.icon}</div>
                        <div class="shop-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                            ${statusText ? `<span class="shop-item-status">${statusText}</span>` : ''}
                        </div>
                        <button class="shop-buy-btn ${statusClass}" 
                            ${(owned && !item.consumable) || levelLocked || (!canAfford && item.price > 0) ? 'disabled' : ''}
                            onclick="window.shopManager.buyItem('${item.id}')">
                            ${buttonText}
                        </button>
                    </div>
                `;
            }

            html += `</div></div>`;
        }

        this.dom.shopGrid.innerHTML = html;
    }

    /**
     * Achète un article
     */
    buyItem(itemId) {
        const item = this.items[itemId];
        if (!item) return false;

        const credits = state.credits || 0;

        // Vérifications
        if (this.isOwned(itemId) && !item.consumable) {
            this.showNotification('Vous possédez déjà cet article !', 'warning');
            return false;
        }

        if (item.levelRequired && (state.level || 1) < item.levelRequired) {
            this.showNotification(`Niveau ${item.levelRequired} requis !`, 'error');
            return false;
        }

        if (credits < item.price) {
            this.showNotification('Crédits insuffisants !', 'error');
            return false;
        }

        // Déduire les crédits
        if (typeof spendCredits === 'function') {
            spendCredits(item.price);
        }

        // Appliquer l'effet
        this.applyEffect(item);

        // Sauvegarder l'achat
        if (!item.consumable) {
            this.purchases.push(itemId);
            this.savePurchases();
        }

        // Audio
        window.audioEngine?.playXPGain();

        // Notification
        this.showNotification(`${item.icon} ${item.name} acheté !`, 'success');

        // Rafraîchir l'affichage
        this.renderShop();
        this.updateCreditsDisplay();

        return true;
    }

    /**
     * Applique l'effet d'un article
     */
    applyEffect(item) {
        switch (item.effect.type) {
            case 'compat_boost':
                this.activeEffects.compatBoost += item.effect.value;
                console.log(`🎯 Boost de compatibilité actif: +${this.activeEffects.compatBoost}%`);
                break;

            case 'xp_mult':
                this.activeEffects.xpMult = item.effect.value;
                this.activeEffects.xpMultRemaining = item.effect.duration;
                console.log(`⚡ Multiplicateur XP actif: x${item.effect.value} pour ${item.effect.duration} unions`);
                break;

            case 'unlock_theme':
                if (!this.unlockedThemes.includes(item.effect.value)) {
                    this.unlockedThemes.push(item.effect.value);
                    // Ajouter le thème au select
                    const themeSelect = document.getElementById('select-theme');
                    if (themeSelect) {
                        const option = document.createElement('option');
                        option.value = item.effect.value;
                        option.textContent = item.name.replace('Thème ', '');
                        themeSelect.appendChild(option);
                    }
                }
                break;

            case 'unlock_book':
                if (!this.unlockedBooks.includes(item.effect.value)) {
                    this.unlockedBooks.push(item.effect.value);
                }
                break;
        }

        this.savePurchases();
    }

    /**
     * Consomme le boost de compatibilité (appelé lors d'une union)
     */
    consumeCompatBoost() {
        const boost = this.activeEffects.compatBoost;
        this.activeEffects.compatBoost = 0;
        return boost;
    }

    /**
     * Récupère le multiplicateur XP actif et décrémente
     */
    getXPMultiplier() {
        if (this.activeEffects.xpMultRemaining > 0) {
            this.activeEffects.xpMultRemaining--;
            if (this.activeEffects.xpMultRemaining === 0) {
                const mult = this.activeEffects.xpMult;
                this.activeEffects.xpMult = 1;
                return mult;
            }
            return this.activeEffects.xpMult;
        }
        return 1;
    }

    /**
     * Vérifie si un article est possédé
     */
    isOwned(itemId) {
        return this.purchases.includes(itemId);
    }

    /**
     * Vérifie si un livre est débloqué
     */
    isBookUnlocked(bookId) {
        return this.unlockedBooks.includes(bookId);
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
        // Créer l'élément notification
        const notif = document.createElement('div');
        notif.className = `shop-notification ${type}`;
        notif.innerHTML = message;
        document.body.appendChild(notif);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notif.classList.add('show');
        });

        // Suppression après 3s
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    /**
     * Met à jour l'affichage des crédits
     */
    updateCreditsDisplay() {
        if (this.dom.creditsDisplay) {
            this.dom.creditsDisplay.textContent = state.credits || 0;
        }
        if (this.dom.shopCredits) {
            this.dom.shopCredits.textContent = state.credits || 0;
        }
    }

    /**
     * Sauvegarde les achats
     */
    savePurchases() {
        const data = {
            purchases: this.purchases,
            activeEffects: this.activeEffects,
            unlockedThemes: this.unlockedThemes,
            unlockedBooks: this.unlockedBooks
        };
        localStorage.setItem('shopData', JSON.stringify(data));
    }

    /**
     * Charge les achats
     */
    loadPurchases() {
        const saved = localStorage.getItem('shopData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.purchases = data.purchases || [];
                this.activeEffects = data.activeEffects || { compatBoost: 0, xpMult: 1, xpMultRemaining: 0 };
                this.unlockedThemes = data.unlockedThemes || this.unlockedThemes;
                this.unlockedBooks = data.unlockedBooks || this.unlockedBooks;
            } catch (e) {
                console.error('Erreur chargement boutique:', e);
            }
        }
    }

    /**
     * Récupère tous les articles
     */
    getItems() {
        return this.items;
    }
}

// === INITIALISATION GLOBALE ===
window.addEventListener('DOMContentLoaded', () => {
    window.shopManager = new ShopManager();
});
