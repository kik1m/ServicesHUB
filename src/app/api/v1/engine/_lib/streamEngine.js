import { createOpenRouterStream } from './providers/openRouter';
import { createGeminiStream } from './providers/gemini';

export async function createStream(modelType, messages, toolsArray, systemInstruction, keys, openRouterKey, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages, mode) {
    const isOpenRouterDirect = modelType === 'claude-sonnet-4-6' || modelType === 'gpt-4o' || modelType === 'o1-preview';
    
    if (isOpenRouterDirect) {
        return createOpenRouterStream(modelType, messages, toolsArray, systemInstruction, openRouterKey, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages, mode);
    } else {
        return createGeminiStream(modelType, messages, toolsArray, systemInstruction, keys, verifiedUserId, userRole, initialSessionId, tool1Context, tool2Context, rawMessages, mode);
    }
}

