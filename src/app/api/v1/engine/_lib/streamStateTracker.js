/**
 * Tracks the open/close state of HUBly structural blocks in streamed text.
 * This is the source-of-truth for continuation prompts.
 */
export class StreamStateTracker {
    constructor() {
        this.reset();
    }

    reset() {
        this.openVisualBlock = false;
        this.openCodeFence = null;
        this.backtickCount = 0;
        this.totalTokens = 0;
        this.qualityWarnings = [];
    }

    analyzeFullResponse(text) {
        this.reset();
        this.totalTokens = text.length;

        const cleanText = text
            .replace(/\[\s*REASONING\s*\][\s\S]*?\[\/\s*REASONING\s*\]/gi, '')
            .replace(/🧠 AI Thought Process:[\s\S]*?(?:---|\n\n)/gi, '');

        // --- 1. Detect unclosed <<<VISUAL_START>>> blocks ---
        const visualStartRe = /<<<VISUAL_START>>>/gi;
        const visualEndRe = /<<<VISUAL_END>>>/gi;
        const visualStarts = [...cleanText.matchAll(visualStartRe)];
        const visualEnds = [...cleanText.matchAll(visualEndRe)];

        if (visualStarts.length > 0) {
            const lastStartMatch = visualStarts[visualStarts.length - 1];
            const lastEndMatch = visualEnds.length > 0 ? visualEnds[visualEnds.length - 1] : null;
            
            if (!lastEndMatch || lastStartMatch.index > lastEndMatch.index) {
                this.openVisualBlock = true;
            }
        }

        // --- 2. Detect open code fences ONLY if we're not inside a VISUAL_BLOCK ---
        if (!this.openVisualBlock) {
            const textWithoutVisuals = cleanText.replace(/<<<VISUAL_START>>>[\s\S]*?<<<VISUAL_END>>>/gi, '[VISUAL_REMOVED]');
            const backtickMatches = textWithoutVisuals.match(/```/g) || [];
            if (backtickMatches.length % 2 !== 0) {
                const fenceRe = /```(\w*)/g;
                let m, lastLang = '';
                while ((m = fenceRe.exec(textWithoutVisuals)) !== null) lastLang = m[1];
                this.openCodeFence = lastLang;
            }
        }

        const lazyPlaceholderRe = /\/\/\s*(\.\.\.|rest of|add your|implement).*|\/\*\s*(\.\.\.|rest of|add your|implement).*\*\//gi;
        const lazyMatches = text.match(lazyPlaceholderRe);
        if (lazyMatches) {
            this.qualityWarnings = lazyMatches;
        }
    }

    get isCutOff() {
        return this.openVisualBlock || this.openCodeFence !== null;
    }

    get estimatedTokens() {
        return Math.ceil(this.totalTokens / 4);
    }

    buildContinuationPrompt() {
        const qualityWarningText = this.qualityWarnings.length > 0 
            ? `\n\n[QUALITY WARNING] You used lazy placeholders: ${this.qualityWarnings.join(', ')}. DO NOT use placeholders. Write FULL implementations.` 
            : '';

        if (this.openVisualBlock) {
            return `SYSTEM CONTINUATION: Your previous response was cut off by the token limit. 
You were in the middle of generating a <<<VISUAL_START>>> block.${qualityWarningText}
CRITICAL RULES:
1. DO NOT output <<<VISUAL_START>>> again. The block is already open.
2. DO NOT output any preamble, explanation, or markdown headers.
3. Start your response with the EXACT next character of code/content, as if copy-pasting from where you stopped.
4. CRITICAL: DO NOT start your response with <<<VISUAL_END>>>! You MUST finish generating the actual HTML/SVG first.
5. Only output <<<VISUAL_END>>> ONCE at the very end when the component is 100% complete.`;
        }

        if (this.openCodeFence) {
            return `SYSTEM CONTINUATION: Your previous response was cut off by the token limit.
You were in the middle of a \`\`\`${this.openCodeFence} code block.${qualityWarningText}
CRITICAL RULES:
1. DO NOT output \`\`\`${this.openCodeFence} again.
2. DO NOT output any preamble or explanations.
3. Start your response with the EXACT next character of code, as if copy-pasting from where you stopped.`;
        }

        return `SYSTEM CONTINUATION: Your previous response stopped prematurely before generating all requested items and before outputting [ALL_DONE].${qualityWarningText}
CRITICAL RULES:
1. If you have ALREADY generated all requested components in the previous responses, you MUST output ONLY [ALL_DONE] and nothing else.
2. If there are still components missing, continue generating them immediately.
3. DO NOT repeat components you have already generated.
4. When you are 100% finished with EVERYTHING, you MUST output [ALL_DONE].`;
    }

    /**
     * Response Quality Scorer — detects lazy placeholders & incomplete output.
     * Returns { score (0-100), needsContinuation, warnings[] }
     */
    scoreResponse(text) {
        let score = 100;
        const warnings = [];

        // Lazy placeholder patterns
        const lazyPatterns = [
            { re: /\/\/\s*(\.\.\.|rest of|add your|implement here|todo)/gi,  penalty: 20, label: 'code placeholder' },
            { re: /\/\*\s*(\.\.\.|rest of|add your)\s*\*\//gi,               penalty: 20, label: 'block comment placeholder' },
            { re: /add more (here|content|items)/gi,                          penalty: 15, label: 'add-more placeholder' },
            { re: /<!--\s*(add|insert|placeholder|todo)/gi,                   penalty: 15, label: 'HTML placeholder comment' },
            { re: /\.\.\.\s*\/\/ (more|etc)/gi,                              penalty: 10, label: 'ellipsis placeholder' },
        ];

        for (const { re, penalty, label } of lazyPatterns) {
            const matches = text.match(re);
            if (matches) {
                score -= penalty * Math.min(matches.length, 3);
                warnings.push(`${label} (×${matches.length})`);
            }
        }

        // Missing REASONING close tag
        if (text.includes('[REASONING]') && !text.includes('[/REASONING]')) {
            score -= 15;
            warnings.push('unclosed [REASONING] block');
        }

        // Missing [ALL_DONE] when response seems complete
        if (text.length > 2000 && text.includes('<<<VISUAL_END>>>') && !text.includes('[ALL_DONE]')) {
            score -= 5;
            warnings.push('missing [ALL_DONE] signal');
        }

        score = Math.max(0, score);
        return { score, needsContinuation: score < 70, warnings };
    }
}
