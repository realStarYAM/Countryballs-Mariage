/**
 * messages.js
 * Système de Messages - Countryballs Mariage RPG Beta 7.1
 * Messagerie avec emojis et réponses automatiques du partenaire
 */

// === EMOJIS RAPIDES ===
const QUICK_EMOJIS = ['❤️', '😂', '😍', '😳', '🔥', '🥺', '😎', '✨', '💕', '😘', '🎉', '💫'];

// === RÉPONSES AUTOMATIQUES SELON COMPATIBILITÉ ===
const AUTO_RESPONSES = {
    // Compatibilité > 80% : très positif
    high: [
        "Je pensais justement à toi ! 💕",
        "Tu me manques déjà... 🥺",
        "On est vraiment faits l'un pour l'autre ✨",
        "Chaque moment avec toi est magique 💫",
        "Je suis tellement heureux/heureuse avec toi ! 😍",
        "Tu es la meilleure chose qui me soit arrivée 💖",
        "J'ai hâte de te revoir ! ❤️",
        "Nos drapeaux s'harmonisent parfaitement 🌈",
        "Tu illumines ma journée ☀️",
        "Forever and ever! 💍"
    ],
    // Compatibilité 50-80% : neutre
    medium: [
        "Salut ! Comment ça va ? 😊",
        "C'est gentil de m'écrire !",
        "On devrait se voir bientôt peut-être ?",
        "Hmm, intéressant... 🤔",
        "Ah oui, je vois ce que tu veux dire.",
        "Pas mal, pas mal... 👍",
        "On verra comment ça évolue !",
        "Tu as passé une bonne journée ?",
        "C'est noté ! 📝",
        "Mmh, pourquoi pas ?"
    ],
    // Compatibilité < 50% : froid/distant (mais pas insultant)
    low: [
        "Ah, c'est toi... 😐",
        "Je suis un peu occupé(e) là...",
        "On se connaît à peine, non ?",
        "Hmm... si tu le dis.",
        "Je ne suis pas sûr(e) de comprendre.",
        "Peut-être une autre fois ? 🤷",
        "C'est... une façon de voir les choses.",
        "Je dois y réfléchir.",
        "Nos cultures sont assez différentes...",
        "On verra bien... 😶"
    ]
};

// === CLASSE MESSAGES MANAGER ===
class MessagesManager {
    constructor() {
        this.messages = [];
        this.loadMessages();
        this.initDOM();
    }

    /**
     * Initialise les références DOM
     */
    initDOM() {
        this.dom = {
            btnMessages: document.getElementById('btn-messages'),
            modalMessages: document.getElementById('modal-messages'),
            messagesContainer: document.getElementById('messages-container'),
            messageInput: document.getElementById('message-input'),
            btnSendMessage: document.getElementById('btn-send-message'),
            emojiPicker: document.getElementById('emoji-picker'),
            btnClearMessages: document.getElementById('btn-clear-messages'),
            btnMessagesClose: document.getElementById('btn-messages-close'),
            selectedEmoji: null
        };

        this.bindEvents();
        this.renderEmojiPicker();
    }

    /**
     * Attache les événements
     */
    bindEvents() {
        if (this.dom.btnMessages) {
            this.dom.btnMessages.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.openMessages();
            });
        }

        if (this.dom.btnMessagesClose) {
            this.dom.btnMessagesClose.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.closeMessages();
            });
        }

        if (this.dom.btnSendMessage) {
            this.dom.btnSendMessage.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (this.dom.messageInput) {
            this.dom.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (this.dom.btnClearMessages) {
            this.dom.btnClearMessages.addEventListener('click', () => {
                window.audioEngine?.playClick();
                this.clearConversation();
            });
        }

        if (this.dom.modalMessages) {
            this.dom.modalMessages.addEventListener('click', (e) => {
                if (e.target === this.dom.modalMessages) this.closeMessages();
            });
        }
    }

    /**
     * Render le sélecteur d'emojis
     */
    renderEmojiPicker() {
        if (!this.dom.emojiPicker) return;

        let html = '';
        QUICK_EMOJIS.forEach(emoji => {
            html += `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`;
        });
        this.dom.emojiPicker.innerHTML = html;

        // Bind emoji buttons
        this.dom.emojiPicker.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle selected state
                this.dom.emojiPicker.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.dom.selectedEmoji = btn.dataset.emoji;
                window.audioEngine?.playClick();
            });
        });
    }

    /**
     * Ouvre la modal messages
     */
    openMessages() {
        this.renderMessages();
        this.dom.modalMessages?.showModal();
        document.body.classList.add('modal-open');
        this.scrollToBottom();
    }

    /**
     * Ferme la modal messages
     */
    closeMessages() {
        this.dom.modalMessages?.close();
        document.body.classList.remove('modal-open');
    }

    /**
     * Envoie un message
     */
    sendMessage() {
        const text = this.dom.messageInput?.value?.trim();
        if (!text) return;

        // Créer le message du joueur
        const message = {
            author: 'player',
            text: text,
            emoji: this.dom.selectedEmoji || null,
            time: this.getCurrentTime()
        };

        this.messages.push(message);
        this.renderMessages();
        this.scrollToBottom();

        // Reset input
        this.dom.messageInput.value = '';
        this.dom.selectedEmoji = null;
        this.dom.emojiPicker?.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));

        // Audio
        window.audioEngine?.playClick();

        // Power gain pour message envoyé
        if (window.powerManager) {
            window.powerManager.addPower(5);
        }

        // Générer réponse automatique après un délai
        setTimeout(() => {
            this.generateAutoResponse();
        }, 1000 + Math.random() * 2000);

        this.saveMessages();
    }

    /**
     * Génère une réponse automatique du partenaire
     */
    generateAutoResponse() {
        // Obtenir la compatibilité actuelle
        const compatibility = window.state?.score || 50;

        let responsePool;
        if (compatibility >= 80) {
            responsePool = AUTO_RESPONSES.high;
        } else if (compatibility >= 50) {
            responsePool = AUTO_RESPONSES.medium;
        } else {
            responsePool = AUTO_RESPONSES.low;
        }

        const randomText = responsePool[Math.floor(Math.random() * responsePool.length)];
        const randomEmoji = compatibility >= 60 ? QUICK_EMOJIS[Math.floor(Math.random() * QUICK_EMOJIS.length)] : null;

        const response = {
            author: 'partner',
            text: randomText,
            emoji: randomEmoji,
            time: this.getCurrentTime()
        };

        this.messages.push(response);
        this.renderMessages();
        this.scrollToBottom();
        this.saveMessages();

        // Audio notification
        window.audioEngine?.playXPGain();
    }

    /**
     * Render tous les messages
     */
    renderMessages() {
        if (!this.dom.messagesContainer) return;

        if (this.messages.length === 0) {
            this.dom.messagesContainer.innerHTML = `
                <div class="messages-empty">
                    <p>💬 Aucun message pour l'instant...</p>
                    <p>Commence la conversation !</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.messages.forEach((msg, index) => {
            const isPlayer = msg.author === 'player';
            html += `
                <div class="message-bubble ${isPlayer ? 'player' : 'partner'}" 
                     style="animation-delay: ${index * 0.05}s">
                    <div class="message-header">
                        <span class="message-author">${isPlayer ? '🎮 Toi' : '💕 ' + (window.state?.partner?.country || 'Partenaire')}</span>
                        <span class="message-time">${msg.time}</span>
                    </div>
                    <div class="message-text">
                        ${msg.text}
                        ${msg.emoji ? `<span class="message-emoji">${msg.emoji}</span>` : ''}
                    </div>
                </div>
            `;
        });

        this.dom.messagesContainer.innerHTML = html;
    }

    /**
     * Scroll vers le bas de la conversation
     */
    scrollToBottom() {
        if (this.dom.messagesContainer) {
            setTimeout(() => {
                this.dom.messagesContainer.scrollTop = this.dom.messagesContainer.scrollHeight;
            }, 100);
        }
    }

    /**
     * Efface la conversation
     */
    clearConversation() {
        if (confirm('Effacer toute la conversation ?')) {
            this.messages = [];
            localStorage.removeItem('messagesData');
            this.renderMessages();
        }
    }

    /**
     * Obtient l'heure actuelle formatée
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Sauvegarde les messages
     */
    saveMessages() {
        localStorage.setItem('messagesData', JSON.stringify({
            messages: this.messages
        }));
    }

    /**
     * Charge les messages
     */
    loadMessages() {
        const saved = localStorage.getItem('messagesData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.messages = data.messages || [];
            } catch (e) {
                console.error('Erreur chargement messages:', e);
            }
        }
    }

    /**
     * Reset les messages
     */
    resetMessages() {
        this.messages = [];
        localStorage.removeItem('messagesData');
    }
}

// === INITIALISATION GLOBALE ===
window.addEventListener('DOMContentLoaded', () => {
    window.messagesManager = new MessagesManager();
});
