/**
 * Scrubber to prevent sensitive information from being leaked in the browser console.
 */
export function scrubDebugData(data) {
    if (!data) return data;

    try {
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        
        // Redact potential secrets, API keys, session tokens, and workspace contexts
        const scrubbed = str
            .replace(/(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/g, '[REDACTED_JWT]')
            .replace(/(sk-[a-zA-Z0-9]{20,})/g, '[REDACTED_API_KEY]')
            .replace(/"workspaceContext":\s*"[^"]+"/g, '"workspaceContext": "[REDACTED_WORKSPACE]"')
            .replace(/"systemInstruction":\s*"[^"]+"/g, '"systemInstruction": "[REDACTED_SYSTEM_PROMPT]"');
            
        if (typeof data === 'string') return scrubbed;
        return JSON.parse(scrubbed);
    } catch (e) {
        // If parsing fails, it's safer to redact everything than leak it
        return '[REDACTED_UNPARSABLE_DATA]';
    }
}
