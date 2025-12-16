/**
 * audio.js
 * Système Audio Premium - Beta 6.0
 * Utilise Web Audio API pour générer des sons procéduraux
 */

class AudioEngine {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.isMuted = false;
        this.isInitialized = false;
        
        // Load saved preference
        const saved = localStorage.getItem('audioEnabled');
        this.isMuted = saved === 'false';
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.isMuted ? 0 : 0.3; // Default volume
            this.isInitialized = true;
            console.log('🔊 Audio Engine initialized');
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }

    /**
     * Toggle mute/unmute
     */
    toggleMute() {
        if (!this.isInitialized) return;
        
        this.isMuted = !this.isMuted;
        this.masterGain.gain.setValueAtTime(
            this.isMuted ? 0 : 0.3,
            this.context.currentTime
        );
        
        // Save preference
        localStorage.setItem('audioEnabled', !this.isMuted);
        
        // Play test sound when unmuting
        if (!this.isMuted) {
            this.playClick();
        }
        
        return !this.isMuted;
    }

    /**
     * Play a simple click sound (Glass/Crystal)
     */
    playClick() {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Play dice roll sound (Random generation)
     */
    playDiceRoll() {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        
        // Create multiple short bursts
        for (let i = 0; i < 8; i++) {
            const startTime = now + (i * 0.04);
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            // Random pitch for each burst
            const freq = 200 + Math.random() * 400;
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(0.05, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
            
            osc.start(startTime);
            osc.stop(startTime + 0.03);
        }
    }

    /**
     * Play union celebration sound (Marriage)
     */
    playUnion() {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        
        // Chord progression (C Major)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        notes.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.frequency.setValueAtTime(freq, now);
            osc.type = 'sine';
            
            const startTime = now + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.2);
            
            osc.start(startTime);
            osc.stop(startTime + 1.2);
        });
    }

    /**
     * Play ring drop sound (based on rarity)
     */
    playRingDrop(rarity) {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        const configs = {
            COMMON: { freq: 400, duration: 0.2 },
            RARE: { freq: 600, duration: 0.3 },
            EPIC: { freq: 800, duration: 0.4 },
            LEGENDARY: { freq: 1000, duration: 0.5 },
            MYTHIC: { freq: 1200, duration: 0.6 }
        };
        
        const config = configs[rarity] || configs.COMMON;
        
        // Bell-like sound
        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gain = this.context.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);
        
        osc1.frequency.setValueAtTime(config.freq, now);
        osc2.frequency.setValueAtTime(config.freq * 2, now); // Octave up
        osc1.type = 'triangle';
        osc2.type = 'sine';
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + config.duration);
        osc2.stop(now + config.duration);
    }

    /**
     * Play XP gain sound
     */
    playXPGain() {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        
        // Rising arpeggio
        const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        
        freqs.forEach((freq, i) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            const startTime = now + (i * 0.06);
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'square';
            
            gain.gain.setValueAtTime(0.08, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
            
            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    /**
     * Play level up fanfare
     */
    playLevelUp() {
        if (!this.isInitialized || this.isMuted) return;
        
        const now = this.context.currentTime;
        
        // Victory fanfare
        const melody = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 659.25, time: 0.15 },  // E5
            { freq: 783.99, time: 0.3 },   // G5
            { freq: 1046.50, time: 0.5 }   // C6
        ];
        
        melody.forEach(note => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            const startTime = now + note.time;
            osc.frequency.setValueAtTime(note.freq, startTime);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    /**
     * Background ambient music (subtle lo-fi loop)
     */
    startAmbientMusic() {
        if (!this.isInitialized || this.isMuted) return;
        
        // Simple ambient pad (optional feature)
        // Can be implemented later with more complex oscillators
        console.log('🎵 Ambient music system ready (to be implemented)');
    }

    /**
     * Get current mute state
     */
    getMuteState() {
        return this.isMuted;
    }
}

// Export global instance
window.audioEngine = new AudioEngine();
