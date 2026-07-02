export const DESIGN_SYSTEM_CSS = `
  :root {
    /* Primary Colors */
    --primary:       #F97316; /* Orange 500 */
    --primary-light: #FFEDD5; /* Orange 100 */
    --success:       #10B981;
    --success-light: #D1FAE5;
    --warning:       #F59E0B;
    --warning-light: #FEF3C7;
    --danger:        #EF4444;
    --danger-light:  #FEE2E2;
    --purple:        #8B5CF6;
    --purple-light:  #EDE9FE;

    /* Backgrounds */
    --bg-primary:    #FFFFFF;
    --bg-secondary:  #F7F6F2;
    --bg-tertiary:   #EFEDE8;

    /* Texts */
    --text-primary:   #1A1A18;
    --text-secondary: #5A5A57;
    --text-tertiary:  #8A8A86;

    /* Borders */
    --border:         rgba(0,0,0,0.08);
    --border-strong:  rgba(0,0,0,0.15);

    /* Radius */
    --radius-sm:  6px;
    --radius-md:  8px;
    --radius-lg:  12px;
    --radius-xl:  16px;

    /* Fonts */
    --font-sans: 'Inter', 'Segoe UI', system-ui, sans-serif;
    --font-mono: 'Fira Code', 'Consolas', monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary:    rgba(30, 30, 30, 0.4);
      --bg-secondary:  rgba(40, 40, 40, 0.5);
      --bg-tertiary:   rgba(50, 50, 50, 0.6);
      --text-primary:  #F8FAFC;
      --text-secondary:#94A3B8;
      --text-tertiary: #64748B;
      --border:        rgba(255,255,255,0.08);
      --border-strong: rgba(255,255,255,0.15);
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--text-primary);
    background: transparent;
    line-height: 1.6;
    overflow-y: hidden; /* We rely on iframe resizing */
  }
  button {
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 13px;
    padding: 7px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-strong);
    background: transparent;
    color: var(--text-primary);
    transition: background 0.15s;
  }
  button:hover { background: var(--bg-secondary); }
  button.primary {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  button.primary:hover { opacity: 0.9; }

  .visual-container {
    padding: 12px;
  }
`;

export function buildHTMLDoc(componentCode) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>${DESIGN_SYSTEM_CSS}</style>
<script>
  // Script to auto-resize iframe to content height
  function reportHeight() {
    // Small timeout to allow repaint
    setTimeout(() => {
        const container = document.querySelector('.visual-container');
        const height = container ? container.scrollHeight : document.body.scrollHeight;
        window.parent.postMessage({
            action: 'resize',
            height: height
        }, '*');
    }, 50);
  }
  window.addEventListener('load', reportHeight);
  window.addEventListener('resize', reportHeight);
  
  if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(reportHeight);
      const container = document.querySelector('.visual-container');
      if (container) resizeObserver.observe(container);
  }

  const observer = new MutationObserver(reportHeight);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
</script>
</head>
<body>
  <div class="visual-container">
    ${componentCode}
  </div>
</body>
</html>`;
}
