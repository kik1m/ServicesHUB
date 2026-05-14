/**
 * 🔑 API Key Manager for Serverless Functions
 * Handles key rotation within a single request context.
 */

export const getKeys = () => {
    const rawKeys = process.env.GEMINI_API_KEY || '';
    return rawKeys.split(',').map(k => k.trim()).filter(Boolean);
};

/**
 * Returns a key based on the current minute to distribute load
 * across all keys even in serverless environments.
 */
export const getRandomKey = () => {
    const keys = getKeys();
    if (keys.length === 0) return null;
    const minuteIndex = Math.floor(Date.now() / 60000);
    return keys[minuteIndex % keys.length];
};
