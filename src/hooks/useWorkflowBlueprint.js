import { useMemo } from 'react';

/**
 * useWorkflowBlueprint
 * Parses AI chat messages to extract the latest accumulated workflow blueprint JSON.
 * Extracted from WorkflowClient to keep the page component lean.
 *
 * @param {Array} messages - chat messages from useWorkflowChat
 * @param {string|null} sidParam - current session ID from URL
 * @returns {{ blueprint, rawBlueprint, projectId, messageId } | null}
 */
export function useWorkflowBlueprint(messages = [], sidParam = null) {
    return useMemo(() => {
        if (!messages || messages.length === 0) return null;

        let accumulatedBlueprint = {
            projectName: 'Proposed Project Workflow Blueprint',
            description: 'Start chatting with the smart assistant to generate and detail your project workflow and schema blueprints here.',
            phases: [],
            database_schema: [],
        };

        let lastRawBlueprint = '';
        let lastMessageId = null;
        let hasAnyValidJSON = false;

        const repairJson = (jsonStr) => {
            let str = jsonStr.trim();
            if (!str) return null;
            
            // Quick check if already valid
            try { return JSON.parse(str); } catch (_) {}

            let insideString = false;
            let isEscaped = false;
            const stack = [];

            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (isEscaped) {
                    isEscaped = false;
                    continue;
                }
                if (char === '\\') {
                    isEscaped = true;
                    continue;
                }
                if (char === '"') {
                    insideString = !insideString;
                    continue;
                }
                if (!insideString) {
                    if (char === '{' || char === '[') {
                        stack.push(char === '{' ? '}' : ']');
                    } else if (char === '}' || char === ']') {
                        stack.pop();
                    }
                }
            }

            if (insideString) {
                str += '"';
            }

            // Remove trailing commas/colons at truncation boundary
            str = str.replace(/,\s*$/, '');
            str = str.replace(/:\s*$/, '');

            // Close brackets/braces
            const tempStack = [...stack];
            while (tempStack.length > 0) {
                str += tempStack.pop();
            }

            try {
                return JSON.parse(str);
            } catch (_) {
                // If it fails, strip the last potential incomplete key-value pair and retry
                try {
                    const lastComma = str.lastIndexOf(',');
                    if (lastComma !== -1) {
                        const cutStr = str.substring(0, lastComma);
                        // Re-run repair on cut string
                        let reStack = [];
                        let reInsideString = false;
                        let reEscaped = false;
                        for (let j = 0; j < cutStr.length; j++) {
                            const c = cutStr[j];
                            if (reEscaped) { reEscaped = false; continue; }
                            if (c === '\\') { reEscaped = true; continue; }
                            if (c === '"') { reInsideString = !reInsideString; continue; }
                            if (!reInsideString) {
                                if (c === '{' || c === '[') reStack.push(c === '{' ? '}' : ']');
                                else if (c === '}' || c === ']') reStack.pop();
                            }
                        }
                        let repairedCut = cutStr;
                        if (reInsideString) repairedCut += '"';
                        repairedCut = repairedCut.replace(/,\s*$/, '').replace(/:\s*$/, '');
                        while (reStack.length > 0) repairedCut += reStack.pop();
                        return JSON.parse(repairedCut);
                    }
                } catch (__) {}
                return null;
            }
        };

        const tryParse = (raw) => {
            return repairJson(raw);
        };

        const mergeBlueprint = (parsed) => {
            if (!parsed) return false;
            if (!parsed.phases && !parsed.database_schema && !parsed.databaseSchema && parsed.projectName === undefined) {
                return false;
            }
            accumulatedBlueprint = {
                ...accumulatedBlueprint,
                ...parsed,
                phases: parsed.phases || accumulatedBlueprint.phases,
                database_schema: parsed.database_schema || parsed.databaseSchema || accumulatedBlueprint.database_schema,
            };
            return true;
        };

        for (let i = 0; i < messages.length; i++) {
            const m = messages[i];
            if (m.role !== 'assistant' || !m.content) continue;

            const contentLower = m.content.toLowerCase();
            const VISUAL_START = '<<<visual_start>>>';
            const VISUAL_END = '<<<visual_end>>>';

            // Scan all <<<visual_start>>> blocks
            let startPos = 0;
            while ((startPos = contentLower.indexOf(VISUAL_START, startPos)) !== -1) {
                const endIdx = contentLower.indexOf(VISUAL_END, startPos + VISUAL_START.length);
                const rawCode = endIdx !== -1
                    ? m.content.slice(startPos + VISUAL_START.length, endIdx).trim()
                    : m.content.slice(startPos + VISUAL_START.length).trim();

                // Try direct parse, then strip markdown fences
                let parsed = tryParse(rawCode) ||
                    tryParse(rawCode.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim());

                if (parsed && mergeBlueprint(parsed)) {
                    hasAnyValidJSON = true;
                    lastRawBlueprint = JSON.stringify(accumulatedBlueprint);
                    lastMessageId = m.id;
                }

                startPos += VISUAL_START.length;
            }

            // Fallback: if the whole content is raw JSON
            const trimmed = m.content.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                const parsed = tryParse(trimmed);
                if (parsed && mergeBlueprint(parsed)) {
                    hasAnyValidJSON = true;
                    lastRawBlueprint = JSON.stringify(accumulatedBlueprint);
                    lastMessageId = m.id;
                }
            }
        }

        if (!hasAnyValidJSON) return null;

        return {
            blueprint: accumulatedBlueprint,
            rawBlueprint: lastRawBlueprint,
            projectId: sidParam,
            messageId: lastMessageId,
        };
    }, [messages, sidParam]);
}
