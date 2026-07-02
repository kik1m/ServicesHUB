export async function parseAIStream(reader, callbacks) {
    const {
        onSessionId,
        onTitleGenerationTrigger,
        onChunk,
        onToolCall,
        onToolStatus,
        onStatus,
        onError,
        onFinish
    } = callbacks;

    const decoder = new TextDecoder();
    let buffer = '';
    let streamFinishedCleanly = false;
    let hasError = false;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                if (!streamFinishedCleanly && !hasError) {
                    hasError = true;
                    onError('The AI Engine connection was unexpectedly interrupted (e.g. server timeout). Please try again.');
                }
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.indexOf('\n\n');
            let accumulatedText = '';

            while (boundary !== -1) {
                const eventBlock = buffer.slice(0, boundary).trim();
                
                let dataPayload = '';
                const lines = eventBlock.split('\n');
                for (const l of lines) {
                    if (l.startsWith('data: ')) dataPayload += l.slice(6);
                    else if (l.startsWith('data:')) dataPayload += l.slice(5);
                }

                if (dataPayload) {
                    if (dataPayload === '[DONE]') {
                        buffer = buffer.slice(boundary + 2);
                        streamFinishedCleanly = true;
                        boundary = buffer.indexOf('\n\n');
                        continue;
                    }
                    try {
                        const data = JSON.parse(dataPayload);
                        
                        // Parse succeeded, consume the buffer
                        buffer = buffer.slice(boundary + 2);
                        
                        if (data.type === 'session_id') {
                            if (onSessionId) onSessionId(data.id);
                            if (onTitleGenerationTrigger) onTitleGenerationTrigger(data.id);
                        } else if (data.type === 'chunk') {
                            if (data.text) accumulatedText += data.text;
                        } else if (data.type === 'tool_call') {
                            if (onToolCall) onToolCall(data.toolName);
                        } else if (data.type === 'tool_status') {
                            if (onToolStatus) onToolStatus(data.toolName);
                        } else if (data.type === 'status') {
                            if (onStatus) onStatus(data.phase);
                        } else if (data.type === 'done') {
                            streamFinishedCleanly = true;
                        } else if (data.type === 'error') {
                            let errMsg = data.message || 'An error occurred during generation.';
                            errMsg = sanitizeErrorMessage(errMsg);
                            hasError = true;
                            onError(errMsg);
                            return { hasError: true };
                        }
                        
                        boundary = buffer.indexOf('\n\n');
                    } catch (err) {
                        // JSON parse failed. \n\n might be inside an unescaped JSON string.
                        // Look for the next \n\n to form a complete JSON object.
                        const nextBoundary = buffer.indexOf('\n\n', boundary + 2);
                        if (nextBoundary !== -1) {
                            const nextBlock = buffer.slice(boundary + 2, nextBoundary);
                            if (nextBlock.includes('data:')) {
                                // The next block is a new event, so the current block is complete but corrupt.
                                // Discard the current corrupt block to prevent stalling the stream.
                                buffer = buffer.slice(boundary + 2);
                                boundary = buffer.indexOf('\n\n');
                                continue;
                            }
                            boundary = nextBoundary;
                        } else {
                            if (buffer.length > 8192) {
                                buffer = '';
                            }
                            break; 
                        }
                    }
                } else {
                    // Empty event or no data prefix
                    buffer = buffer.slice(boundary + 2);
                    boundary = buffer.indexOf('\n\n');
                }
            }
            
            if (accumulatedText) {
                if (onChunk) onChunk(accumulatedText);
            }
        }
    } catch (err) {
        hasError = true;
        throw err; // Rethrow to let the caller handle aborts or fetch failures
    } finally {
        if (onFinish) onFinish({ hasError, streamFinishedCleanly });
    }

    return { hasError, streamFinishedCleanly };
}

// ── User-friendly error messages (English) ───────────────────────────
const USER_FRIENDLY_ERRORS = {
    quota:      'We have exceeded the daily request limit. Please try again in an hour.',
    timeout:    'The request took too long. Please try again.',
    rate_limit: 'Too many requests in a short time. Please wait a moment and try again.',
    overloaded: 'The servers are currently busy. Please try again in a few moments.',
    network:    'The connection to the server was lost. Please check your connection and try again.',
    default:    'An unexpected error occurred. Please try again.',
};

function sanitizeErrorMessage(errMsg) {
    // Clean up ugly nested JSON if it's there (e.g. Gemini 503 errors)
    try {
        if (typeof errMsg === 'string') {
            const jsonStart = errMsg.indexOf('{');
            if (jsonStart !== -1) {
                const jsonStr = errMsg.slice(jsonStart);
                const parsed1 = JSON.parse(jsonStr);
                if (parsed1.error?.message) {
                    try {
                        const parsed2 = JSON.parse(parsed1.error.message);
                        if (parsed2.error?.message) errMsg = parsed2.error.message;
                        else errMsg = parsed1.error.message;
                    } catch (e) {
                        errMsg = parsed1.error.message;
                    }
                }
            }
        }
    } catch (e) {
        // Fallback: use regex to find the innermost message string
        const match = errMsg.match(/"message"\s*:\s*"([^"]+)"/g);
        if (match && match.length > 0) {
            const lastMatch = match[match.length - 1];
            const extract = lastMatch.match(/"message"\s*:\s*"([^"]+)"/);
            if (extract && extract[1]) errMsg = extract[1];
        }
    }

    // Clean up any lingering ugly prefixes
    errMsg = errMsg.replace(/^got status:[^{]+/, '').trim();
    if (errMsg.startsWith('{')) return USER_FRIENDLY_ERRORS.default;

    // Map known error patterns to user-friendly messages
    const lower = errMsg.toLowerCase();
    if (lower.includes('quota') || lower.includes('exceeded') || lower.includes('exhausted') || lower.includes('429')) {
        console.error('[AI Engine] Quota error hidden from UI:', errMsg);
        return USER_FRIENDLY_ERRORS.quota;
    }
    if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('deadline')) {
        return USER_FRIENDLY_ERRORS.timeout;
    }
    if (lower.includes('rate') || lower.includes('rate_limit') || lower.includes('too many requests')) {
        return USER_FRIENDLY_ERRORS.rate_limit;
    }
    if (lower.includes('overload') || lower.includes('capacity') || lower.includes('high demand')) {
        return USER_FRIENDLY_ERRORS.overloaded;
    }
    if (lower.includes('fetch') || lower.includes('network') || lower.includes('econnrefused') || lower.includes('enotfound')) {
        return USER_FRIENDLY_ERRORS.network;
    }
    // Hide internal identifiers from leaking to UI
    if (lower.includes('gemini') || lower.includes('generative') || lower.includes('google') || lower.includes('openrouter') || lower.includes('unauthorized')) {
        console.error('[AI Engine] Internal error hidden from UI:', errMsg);
        return USER_FRIENDLY_ERRORS.default;
    }

    return errMsg;
}
