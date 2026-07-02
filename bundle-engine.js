const fs = require('fs');
const path = require('path');

const filesToBundle = [
    'src/components/Compare/AIEngine/AIChatWidget.jsx',
    'src/components/Compare/AIEngine/AIChatWidget.module.css',
    'src/components/Compare/AIEngine/MarkdownRenderer.jsx',
    'src/components/Compare/AIEngine/SmartToolCard.jsx',
    'src/components/Compare/AIEngine/TypingIndicator.jsx',
    'src/components/Compare/AIEngine/useToolsCache.js',
    'src/components/Compare/AIEngine/VersusCard.jsx',
    'src/hooks/useAIChat.js',
    'src/hooks/useAIEngineData.js',
    'src/hooks/useAISessions.js',
    'src/app/api/v1/engine/chat/route.js',
    'src/app/api/v1/engine/chat/title/route.js',
    'src/config/models.config.js'
];

const workspaceDir = 'd:/services-hub-next';
const outputFile = path.join(workspaceDir, 'hubly_ai_engine_package.md');

let markdownContent = `# HUBly AI Engine Complete Source Code\n\n`;
markdownContent += `This document contains the complete source code of the HUBly AI Engine frontend components, hooks, backend API routes, and configuration files.\n\n`;

for (const file of filesToBundle) {
    const filePath = path.join(workspaceDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const ext = path.extname(file).substring(1);
        const lang = ext === 'jsx' ? 'jsx' : ext === 'js' ? 'javascript' : ext === 'css' ? 'css' : 'text';
        markdownContent += `## File: \`${file}\`\n\n\`\`\`${lang}\n${content}\n\`\`\`\n\n---\n\n`;
    } else {
        console.warn(`File not found: ${filePath}`);
    }
}

fs.writeFileSync(outputFile, markdownContent, 'utf8');
console.log(`Successfully bundled ${filesToBundle.length} files into ${outputFile}`);
