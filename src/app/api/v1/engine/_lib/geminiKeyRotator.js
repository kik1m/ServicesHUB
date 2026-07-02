/**
 * Thread-safe key rotator using a closure over atomic counter.
 * Uses a timestamp-based salt to distribute load across keys.
 */
export class GeminiKeyRotator {
    constructor(keys) {
        this.keys = keys;
        this.failureCount = new Map(); // key → consecutive failure count
    }

    /**
     * Get the next available key. Skips keys with >= 3 consecutive failures.
     * Falls back to least-failed key if all are exhausted.
     */
    getNextKey() {
        const baseIndex = Date.now() % this.keys.length;
        
        // Try keys starting from the time-based index
        for (let offset = 0; offset < this.keys.length; offset++) {
            const idx = (baseIndex + offset) % this.keys.length;
            const key = this.keys[idx];
            const failures = this.failureCount.get(key) || 0;
            if (failures < 3) return { key, idx };
        }

        // All keys exhausted — return the one with fewest failures
        let bestKey = this.keys[0];
        let minFailures = Infinity;
        for (const key of this.keys) {
            const f = this.failureCount.get(key) || 0;
            if (f < minFailures) { minFailures = f; bestKey = key; }
        }
        return { key: bestKey, idx: this.keys.indexOf(bestKey) };
    }

    recordFailure(key) {
        this.failureCount.set(key, (this.failureCount.get(key) || 0) + 1);
    }

    recordSuccess(key) {
        this.failureCount.delete(key); // Reset on success
    }
}

// Singleton — one rotator per server process
let rotatorInstance = null;
export function getRotator(keys) {
    if (!rotatorInstance || rotatorInstance.keys.length !== keys.length) {
        rotatorInstance = new GeminiKeyRotator(keys);
    }
    return rotatorInstance;
}
