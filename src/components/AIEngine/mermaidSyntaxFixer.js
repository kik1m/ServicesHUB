// ─── Gantt-specific fixer ─────────────────────────────────────────────────────
export function fixGanttLines(lines) {
    const taskPattern = /:\s*(done|active|crit|milestone|after\s+\w+|\s*,|\d{4}-\d{2}-\d{2}|\w+\s*,)/i;
    const metaKeywords = /^(gantt|dateFormat|dateformat|title|axisFormat|excludes|todayMarker|%%)/i;
    const sectionKeyword = /^section\s/i;

    return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (metaKeywords.test(trimmed)) return line;
        if (sectionKeyword.test(trimmed)) return line;

        if (trimmed.includes(':') && !taskPattern.test(trimmed)) {
            const colonIdx = trimmed.indexOf(':');
            const beforeColon = trimmed.substring(0, colonIdx).trim();
            const afterColon = trimmed.substring(colonIdx + 1).trim();
            const sectionName = afterColon || beforeColon;
            return `section ${sectionName}`;
        }
        return line;
    });
}

// ─── StateDiagram-specific fixer ──────────────────────────────────────────────
export function fixStateDiagramLines(lines) {
    return lines.map(line => {
        let fixed = line;
        fixed = fixed.replace(/"([^"]+)"/g, (match, inner) => {
            return inner.trim().replace(/\s+/g, '_');
        });
        return fixed;
    });
}

// ─── Mindmap-specific fixer ───────────────────────────────────────────────────
export function fixMindmapLines(lines) {
    const directiveLine = /^(mindmap|%%)/i;

    return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed || directiveLine.test(trimmed)) return line;

        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '';

        let shapeMatch = trimmed.match(/^(\w*)(\(\(|\[|{|{{|\()(.+)(\)\)|\]|}|}}|\))$/);
        
        if (shapeMatch) {
            let [, id, open, inner, close] = shapeMatch;
            let cleanInner = inner.replace(/^["`']|["`']$/g, '').trim();
            cleanInner = cleanInner.replace(/\(/g, '（').replace(/\)/g, '）');
            return `${indent}${id}${open}"${cleanInner}"${close}`;
        } else {
            const needsQuoting = /[\u0600-\u06FF()\[\]{}]/.test(trimmed);
            if (needsQuoting) {
                let cleanInner = trimmed.replace(/^["`']|["`']$/g, '').trim();
                cleanInner = cleanInner.replace(/\(/g, '（').replace(/\)/g, '）');
                return `${indent}["${cleanInner}"]`;
            }
        }

        return line;
    });
}

// ─── Pre-processor: Fix common AI-generated Mermaid issues ────────────────────
export function fixMermaidCode(rawCode) {
    let code = (rawCode || '').trim();

    code = code.replace(/^\s*SubGraph\b/gmi, 'subgraph');
    code = code.replace(/^\s*End\s*$/gmi, 'end');

    const initDirectives = [];
    code = code.replace(/%%\{[\s\S]*?\}%%/g, (m) => { initDirectives.push(m); return ''; });
    code = code.trim();
    if (initDirectives.length > 0) {
        code = initDirectives.join('\n') + '\n' + code;
    }

    code = code.replace(/\["([^"]*)"\]/g, (match, inner) => {
        const cleaned = inner.replace(/\*\*|__|\*|_/g, '');
        return `["${cleaned}"]`;
    });
    code = code.replace(/\('([^']*)'\)/g, (match, inner) => {
        const cleaned = inner.replace(/\*\*|__|\*|_/g, '');
        return `("${cleaned}")`;
    });

    const arabicRE = /[\u0600-\u06FF]/;

    code = code.replace(/(\w+)\[([^\]"[]+)\]/g, (match, id, text) => {
        if (!arabicRE.test(text)) return match;
        const cleaned = text.trim().replace(/\*\*|__|\*|_/g, '');
        return `${id}["${cleaned}"]`;
    });

    code = code.replace(/(\w+)\(([^)"(]+)\)/g, (match, id, text) => {
        if (!arabicRE.test(text)) return match;
        const cleaned = text.trim().replace(/\*\*|__|\*|_/g, '');
        return `${id}("${cleaned}")`;
    });

    code = code.replace(/(\w+)\{([^}"{}]+)\}/g, (match, id, text) => {
        if (!arabicRE.test(text)) return match;
        const cleaned = text.trim().replace(/\*\*|__|\*|_/g, '');
        return `${id}{"${cleaned}"}`;
    });

    code = code.replace(/(-->|---|===>|-.->|==>)\|([^|"]+)\|/g, (match, arrow, text) => {
        if (!arabicRE.test(text)) return match;
        const cleaned = text.trim().replace(/\*\*|__|\*|_/g, '');
        return `${arrow}|"${cleaned}"|`;
    });

    code = code.replace(/^(\s*subgraph\s+)([^"\n]+)$/gm, (match, prefix, name) => {
        if (!arabicRE.test(name)) return match;
        const cleaned = name.trim().replace(/\*\*|__|\*|_/g, '');
        return `${prefix}"${cleaned}"`;
    });

    code = code.replace(/["'][^"']*["']/g, (match) => {
        return match.replace(/[\u2700-\u27BF\u{1F300}-\u{1FFFF}✅❌⚠️✓✗]/gu, (emoji) => {
            const map = { '✅': '[check]', '❌': '[x]', '✓': '[check]', '✗': '[x]', '⚠️': '[warn]', '⚠': '[warn]' };
            return map[emoji] || '';
        });
    });

    const firstMeaningfulLine = code.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('%%'))
        .find(Boolean) || '';

    if (/^gantt\b/i.test(firstMeaningfulLine)) {
        const lines = code.split('\n');
        code = fixGanttLines(lines).join('\n');
    }

    if (/^mindmap\b/i.test(firstMeaningfulLine)) {
        const lines = code.split('\n');
        code = fixMindmapLines(lines).join('\n');
    }

    if (/^stateDiagram/i.test(firstMeaningfulLine)) {
        const lines = code.split('\n');
        code = fixStateDiagramLines(lines).join('\n');
    }

    if (/^(graph|flowchart)\b/i.test(firstMeaningfulLine)) {
        // graph and flowchart do NOT support the "title" keyword directly.
        // It must be commented out, or placed in YAML frontmatter. We'll comment it out to be safe.
        code = code.replace(/^(\s*title\s+.*)$/gm, '%% $1');
    }

    if (/^gauge\b/i.test(firstMeaningfulLine)) {
        // Mermaid doesn't support 'gauge'. Convert it to a simple pie chart.
        code = code.replace(/^gauge/i, 'pie');
        code = code.replace(/^(\s*)([\d.]+)%\s*$/gm, '$1"Value" : $2');
    }

    return code;
}
