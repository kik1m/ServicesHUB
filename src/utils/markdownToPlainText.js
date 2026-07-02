export function cleanTextForCopy(rawText) {
    if (!rawText) return '';
    let clean = rawText;
    clean = clean.replace(/\[check\]/gi, '✅').replace(/\[warn\]/gi, '⚠️').replace(/\[info\]/gi, 'ℹ️')
        .replace(/\[insight\]/gi, '💡').replace(/\[metrics\]/gi, '📊').replace(/\[architecture\]/gi, '🏗️')
        .replace(/\[action\]/gi, '🛠️');
    clean = clean.replace(/\[REASONING\]([\s\S]*?)\[\/REASONING\]/gi, (m, p1) => `🧠 AI Thought Process:\n${p1.trim()}\n\n---\n`);
    clean = clean.replace(/\[step(\d+)\]/gi, '$1.');
    clean = clean.replace(/\[\s*TOOL_CARD\s*:\s*(.+?)\s*\]/gi, (m, p1) => {
        const slug = p1.trim().replace(/^["'{[\]]+|["'}\]]+$/g, '').split('||')[0].trim();
        return `🚀 Tool: ${slug} (https://hubly.com/tool/${slug})`;
    });
    clean = clean.replace(/\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.+?)\s*\]/gi, (m, p1) => {
        let [name, url, desc] = p1.trim().split('||').map(s => s.trim().replace(/^["'{\[]+|["'}\]]+$/g, ''));
        return `🌐 ${name || 'External Link'}: ${url || '#'} ${desc ? `- ${desc}` : ''}`;
    });
    return clean;
}
