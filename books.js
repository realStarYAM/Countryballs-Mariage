/**
 * books.js
 * Système de Livres Interactifs pour Countryballs Mariage RPG
 * Version 1.0
 */

// === CATALOGUE DES LIVRES ===
const BOOKS_CATALOG = {
    guide_union_parfaite: {
        id: 'guide_union_parfaite',
        title: 'Guide de l\'Union Parfaite',
        author: 'Maître Célébrant',
        icon: '📖',
        file: 'guide_union_parfaite.txt',
        free: true,
        levelRequired: 0,
        description: 'Les bases pour devenir un maître du mariage'
    },
    secrets_ames_soeurs: {
        id: 'secrets_ames_soeurs',
        title: 'Secrets des Âmes Sœurs',
        author: 'L\'Oracle des Nations',
        icon: '📕',
        file: 'secrets_ames_soeurs.txt',
        free: false,
        levelRequired: 5,
        description: 'Découvrez les combinaisons légendaires'
    },
    manuel_mariage_rpg: {
        id: 'manuel_mariage_rpg',
        title: 'Manuel du Mariage RPG',
        author: 'Les Anciens',
        icon: '📚',
        file: 'manuel_mariage_rpg.txt',
        free: false,
        levelRequired: 10,
        description: 'Le guide ultime pour les experts'
    },
    legendes_countryballs: {
        id: 'legendes_countryballs',
        title: 'Légendes des Countryballs',
        author: 'Chroniqueur Mondial',
        icon: '📜',
        file: 'legendes_countryballs.txt',
        free: false,
        levelRequired: 0,
        description: 'Histoires épiques des nations'
    }
};

// === CLASSE BOOK MANAGER ===
class BookManager {
    constructor() {
        this.catalog = BOOKS_CATALOG;
        this.currentBook = null;
        this.bookContent = {};
        this.basePath = './livre/';

        this.initDOM();
    }

    /**
     * Initialise les références DOM
     */
    initDOM() {
        this.dom = {
            modalBook: document.getElementById('modal-book'),
            bookTitle: document.getElementById('book-title'),
            bookAuthor: document.getElementById('book-author'),
            bookContent: document.getElementById('book-content'),
            btnBookClose: document.getElementById('btn-book-close'),
            btnBookLibrary: document.getElementById('btn-library')
        };

        this.bindEvents();
    }

    /**
     * Attache les événements
     */
    bindEvents() {
        if (this.dom.btnBookClose) {
            this.dom.btnBookClose.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.closeBook();
            });
        }

        if (this.dom.modalBook) {
            this.dom.modalBook.addEventListener('click', (e) => {
                if (e.target === this.dom.modalBook) this.closeBook();
            });
        }

        // Bouton bibliothèque (optionnel)
        if (this.dom.btnBookLibrary) {
            this.dom.btnBookLibrary.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.openLibrary();
            });
        }
    }

    /**
     * Vérifie si un livre est accessible
     */
    canAccessBook(bookId) {
        const book = this.catalog[bookId];
        if (!book) return false;

        // Livre gratuit
        if (book.free) return true;

        // Vérifie si acheté dans la boutique
        if (window.shopManager?.isBookUnlocked(bookId)) return true;

        return false;
    }

    /**
     * Ouvre un livre
     */
    async openBook(bookId) {
        const book = this.catalog[bookId];
        if (!book) {
            console.error('Livre non trouvé:', bookId);
            return;
        }

        // Vérifier l'accès
        if (!this.canAccessBook(bookId)) {
            this.showLockedMessage(book);
            return;
        }

        // Charger le contenu si pas en cache
        if (!this.bookContent[bookId]) {
            try {
                const content = await this.loadBookContent(book.file);
                this.bookContent[bookId] = content;
            } catch (error) {
                console.error('Erreur chargement livre:', error);
                this.bookContent[bookId] = this.getDefaultContent(book);
            }
        }

        this.currentBook = book;
        this.renderBook(book, this.bookContent[bookId]);

        // Ouvrir la modal
        this.dom.modalBook?.showModal();
        document.body.classList.add('modal-open');

        // Audio
        window.audioEngine?.playClick();
    }

    /**
     * Charge le contenu d'un fichier livre
     */
    async loadBookContent(filename) {
        const response = await fetch(`${this.basePath}${filename}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.text();
    }

    /**
     * Contenu par défaut si le fichier n'est pas trouvé
     */
    getDefaultContent(book) {
        return `═══════════════════════════════════════════
        
${book.title}

par ${book.author}

═══════════════════════════════════════════

Ce livre sera bientôt disponible...

En attendant, continuez à célébrer des unions 
et à explorer le monde des Countryballs !

⭐ Astuce : Gagnez des crédits pour débloquer 
   plus de contenu dans la boutique.

═══════════════════════════════════════════`;
    }

    /**
     * Affiche le contenu du livre
     */
    renderBook(book, content) {
        if (this.dom.bookTitle) {
            this.dom.bookTitle.innerHTML = `${book.icon} ${book.title}`;
        }
        if (this.dom.bookAuthor) {
            this.dom.bookAuthor.textContent = `par ${book.author}`;
        }
        if (this.dom.bookContent) {
            // Convertir le texte en HTML avec formatage
            this.dom.bookContent.innerHTML = this.formatContent(content);
        }
    }

    /**
     * Formate le contenu texte
     */
    formatContent(text) {
        // Remplacer les sauts de ligne par des <br>
        let html = text
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/═+/g, '<hr class="book-divider">')
            .replace(/⭐/g, '<span class="book-star">⭐</span>')
            .replace(/💡/g, '<span class="book-tip">💡</span>')
            .replace(/⚠️/g, '<span class="book-warning">⚠️</span>');

        return `<p>${html}</p>`;
    }

    /**
     * Ferme le livre
     */
    closeBook() {
        this.dom.modalBook?.close();
        document.body.classList.remove('modal-open');
        this.currentBook = null;
    }

    /**
     * Affiche un message pour livre verrouillé
     */
    showLockedMessage(book) {
        let message = '';

        if (book.levelRequired > (state.level || 1)) {
            message = `🔒 Ce livre nécessite le niveau ${book.levelRequired}`;
        } else {
            message = `🔒 Achetez ce livre dans la boutique pour le lire`;
        }

        // Notification via shopManager ou alerte
        if (window.shopManager?.showNotification) {
            window.shopManager.showNotification(message, 'warning');
        } else {
            alert(message);
        }
    }

    /**
     * Ouvre la bibliothèque (liste des livres)
     */
    openLibrary() {
        // Déléguer à la boutique, onglet livres
        if (window.shopManager) {
            window.shopManager.openShop();
        }
    }

    /**
     * Récupère tous les livres
     */
    getAllBooks() {
        return Object.values(this.catalog);
    }

    /**
     * Récupère les livres accessibles
     */
    getAccessibleBooks() {
        return this.getAllBooks().filter(book => this.canAccessBook(book.id));
    }
}

// === INITIALISATION GLOBALE ===
window.addEventListener('DOMContentLoaded', () => {
    window.bookManager = new BookManager();
});
