const fs = require('fs');
const files = [
  'src/pages/Terms.jsx',
  'src/pages/Promote.jsx',
  'src/pages/Privacy.jsx',
  'src/pages/Premium.jsx',
  'src/pages/Contact.jsx',
  'src/pages/Auth.jsx',
  'src/pages/About.jsx',
  'src/pages/Tools.jsx',
  'src/pages/FAQ.jsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace single line
    content = content.replace(/useSEO\(\{\s*pageKey:\s*'([^']+)'\s*\}\);/g, "useSEO({ pageKey: '$1', entityId: '$1', entityType: 'page' });");
    
    // Replace multiline
    content = content.replace(/pageKey:\s*'([^']+)',/g, (match, p1) => {
        if (content.includes(`entityId: '${p1}'`) || content.includes(`entityId: 'home'`)) return match;
        return `pageKey: '${p1}',\n        entityId: '${p1}',\n        entityType: 'page',`;
    });

    // Special case for Tools.jsx
    content = content.replace(/pageKey:\s*isSearchMode \? 'search' : 'tools',/, (match) => {
         if (content.includes(`entityType: 'page'`)) return match;
         return `${match}\n        entityId: isSearchMode ? 'search' : 'tools',\n        entityType: 'page',`;
    });

    fs.writeFileSync(f, content);
    console.log('✅ Updated: ' + f);
  } else {
    console.log('❌ Not found: ' + f);
  }
});
