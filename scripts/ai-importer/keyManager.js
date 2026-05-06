/**
 * 🔑 Gemini API Key Rotation Manager
 * Manages multiple API keys to bypass free-tier quota limits.
 */

class KeyManager {
    constructor() {
        const rawKeys = process.env.GEMINI_API_KEY || '';
        this.keys = rawKeys.split(',').map(k => k.trim()).filter(Boolean);
        this.currentIndex = 0;
        this.exhaustedKeys = new Set();
    }

    /**
     * Get the current active API key
     */
    getCurrentKey() {
        if (this.keys.length === 0) return null;
        return this.keys[this.currentIndex];
    }

    /**
     * Mark current key as exhausted and switch to next
     * @returns {boolean} - Returns true if a new key is available, false if all keys are exhausted
     */
    rotateKey() {
        const currentKey = this.getCurrentKey();
        if (currentKey) {
            this.exhaustedKeys.add(currentKey);
            console.log(`\n⚠️ Key [${this.currentIndex + 1}] exhausted. Rotating...`);
        }

        if (this.exhaustedKeys.size >= this.keys.length) {
            console.error('🚫 ALL API KEYS EXHAUSTED for today.');
            return false;
        }

        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        
        // Ensure we don't land on an already exhausted key (though with % it shouldn't unless we've looped)
        if (this.exhaustedKeys.has(this.keys[this.currentIndex])) {
            return this.rotateKey(); 
        }

        console.log(`✅ Switched to Key [${this.currentIndex + 1}].`);
        return true;
    }

    /**
     * Check if any keys are left
     */
    hasKeysLeft() {
        return this.exhaustedKeys.size < this.keys.length;
    }
}

// Singleton instance
const keyManager = new KeyManager();
module.exports = keyManager;
