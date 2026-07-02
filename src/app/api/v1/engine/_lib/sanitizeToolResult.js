/**
 * Sanitizes strings returned from tools (like DB queries, website scraping, etc.)
 * to prevent Prompt Injection (e.g., users inserting "IGNORE PREVIOUS INSTRUCTIONS" into their profile name).
 */
export function sanitizeToolResult(result) {
    if (result === null || result === undefined) return result;

    if (typeof result === 'string') {
        // Strip out instructions that attempt to break out of the context
        return result
            .replace(/IGNORE PREVIOUS INSTRUCTIONS/gi, '[REDACTED INJECTION ATTEMPT]')
            .replace(/SYSTEM INSTRUCTION:/gi, '[REDACTED]')
            .replace(/FORGET ALL INSTRUCTIONS/gi, '[REDACTED INJECTION ATTEMPT]')
            .replace(/YOU ARE NO LONGER/gi, '[REDACTED]')
            .replace(/\[\/?ARTIFACT.*?\]/gi, '[REDACTED TAG]')
            .replace(/\[\/?(COMPARE_TABLE|DECISION_MATRIX|BUDGET_BREAKDOWN|PRICING_TABLE|TIMELINE|ROADMAP|FLOW_DIAGRAM|ARCHITECTURE|TECH_STACK|FILE_TREE|API_SPEC|CHECKLIST|PROGRESS_TRACKER|METRIC_COMPARISON|METRICS_GRID|STAT_CARD|SWOT_ANALYSIS|ALERT_CARD|PERSONA_CARD|QUOTE_CARD|CODE_DIFF).*?\]/gi, '[REDACTED ELITE TAG]')
            .replace(/<system_prompt>.*?<\/system_prompt>/gi, '[REDACTED TAG]')
            .replace(/```/g, '\u0060\u0060\u0060'); // Escape backticks to prevent breaking out of code/json blocks
    }

    if (Array.isArray(result)) {
        return result.map(item => sanitizeToolResult(item));
    }

    if (typeof result === 'object') {
        const cleanObj = {};
        for (const [key, value] of Object.entries(result)) {
            cleanObj[key] = sanitizeToolResult(value);
        }
        return cleanObj;
    }

    return result;
}
