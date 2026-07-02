/**
 * HUBly AI Engine — Models Configuration
 * 
 * Tier System:
 * - free  → Gemini 2.5 Flash only (via 5 Google free keys OR OpenRouter Gemini fallback)
 * - pro   → Gemini Flash + Claude Sonnet + GPT-4o
 * - elite → All Pro models + Gemini 2.5 Pro
 * - admin → All models, no tier restrictions
 */

export const MODELS = {
    GEMINI_FLASH: {
        id: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash',
        apiString: 'google/gemini-2.5-flash',
        provider: 'google',
        minTier: 'free',
        icon: 'Zap',
        description: 'Fast and efficient. Best for most tasks.'
    },
    CLAUDE_SONNET: {
        id: 'claude-sonnet-4-6',
        displayName: 'Claude Sonnet 4.6',
        apiString: 'anthropic/claude-sonnet-4-6',
        provider: 'openrouter',
        minTier: 'pro',
        icon: 'Brain',
        description: 'Superior reasoning and nuanced writing.'
    },
    GPT_4O: {
        id: 'gpt-4o',
        displayName: 'GPT-4o',
        apiString: 'openai/gpt-4o',
        provider: 'openrouter',
        minTier: 'pro',
        icon: 'Star',
        description: 'OpenAI flagship model. Versatile and powerful.'
    },
    O1_PREVIEW: {
        id: 'o1-preview',
        displayName: 'O1 Preview',
        apiString: 'openai/o1-preview',
        provider: 'openrouter',
        minTier: 'elite',
        icon: 'Crown',
        description: 'Most advanced reasoning model. Best for deep logic and coding.'
    }
};

export const DEFAULT_MODEL_ID = MODELS.GEMINI_FLASH.id;
export const getModelById = (id) => Object.values(MODELS).find(m => m.id === id) || MODELS.GEMINI_FLASH;

/**
 * Returns models available for a given subscription tier.
 * Admins bypass tier restrictions entirely.
 */
export const getAvailableModels = (subscriptionTier, userRole) => {
    if (userRole === 'admin') return Object.values(MODELS);
    const tierValue = { free: 0, pro: 1, elite: 2 };
    const userTier = tierValue[subscriptionTier] ?? 0;
    return Object.values(MODELS).filter(m => (tierValue[m.minTier] ?? 0) <= userTier);
};
