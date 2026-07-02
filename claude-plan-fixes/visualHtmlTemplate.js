/**
 * visualHtmlTemplate.js — HUBly AI Visual Engine v2.0
 *
 * This is the HTML shell injected into the iframe for every visual component.
 * It provides:
 * - Tailwind CSS (CDN) — properly loaded in <head> so JIT works
 * - FontAwesome icons
 * - Google Fonts (Inter + Outfit)
 * - CSS design tokens matching HUBly dark theme
 * - Auto-resize postMessage back to parent
 * - Error reporting to parent
 */

export function VISUAL_HTML_TEMPLATE(componentCode) {
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Tailwind CDN — MUST be in <head> for JIT to work -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Tailwind Config: extend with HUBly tokens -->
<script>
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'hubly-primary': '#00d2ff',
                'hubly-secondary': '#3a7bd5',
                'hubly-bg': '#090e17',
                'hubly-card': 'rgba(15,23,42,0.6)',
                'hubly-border': 'rgba(255,255,255,0.07)',
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            },
        }
    }
}
</script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- FontAwesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Chart.js (available if needed) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<style>
  /* ── CSS Design Tokens (HUBly Dark Theme) ── */
  :root {
    --primary:        #00d2ff;
    --primary-dim:    rgba(0,210,255,0.12);
    --secondary:      #3a7bd5;
    --success:        #10b981;
    --success-dim:    rgba(16,185,129,0.12);
    --warning:        #f59e0b;
    --warning-dim:    rgba(245,158,11,0.12);
    --danger:         #ef4444;
    --danger-dim:     rgba(239,68,68,0.12);
    --purple:         #a855f7;
    --purple-dim:     rgba(168,85,247,0.12);
    --bg:             #090e17;
    --card:           rgba(15,23,42,0.7);
    --card-hover:     rgba(15,23,42,0.95);
    --border:         rgba(255,255,255,0.07);
    --border-focus:   rgba(0,210,255,0.35);
    --text:           #e2e8f0;
    --text-muted:     #94a3b8;
    --text-dim:       #64748b;
    --radius:         16px;
    --radius-sm:      10px;
    --shadow:         0 8px 32px rgba(0,0,0,0.4);
    --glow:           0 0 24px rgba(0,210,255,0.15);
  }

  /* ── Base Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: transparent !important;
    color: var(--text);
    font-family: 'Outfit', 'Inter', system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Visual Container ── */
  #visual-root {
    padding: 20px;
    width: 100%;
    min-height: 60px;
  }

  /* ── Utility classes not covered by Tailwind CDN ── */
  .glass {
    background: var(--card);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .glass-sm {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: var(--radius-sm);
  }

  .glow-primary { box-shadow: var(--glow); }

  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.3px; text-transform: uppercase;
  }

  .badge-primary { background: var(--primary-dim); color: var(--primary); }
  .badge-success { background: var(--success-dim); color: var(--success); }
  .badge-warning { background: var(--warning-dim); color: var(--warning); }
  .badge-danger  { background: var(--danger-dim);  color: var(--danger);  }
  .badge-purple  { background: var(--purple-dim);  color: var(--purple);  }

  /* ── Entrance animations ── */
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

  .animate-fade    { animation: fadeIn  0.45s ease-out forwards; }
  .animate-slide   { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .animate-scale   { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* Stagger helpers */
  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.1s; }
  .delay-3 { animation-delay: 0.15s; }
  .delay-4 { animation-delay: 0.2s; }
  .delay-5 { animation-delay: 0.25s; }

  /* ── Table ── */
  table { width:100%; border-collapse:separate; border-spacing:0; }
  th,td { padding:12px 16px; border-bottom:1px solid var(--border); text-align:left; }
  th { background:rgba(255,255,255,0.03); color:var(--text-muted); font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(255,255,255,0.02); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(0,210,255,0.2); border-radius:4px; }

  /* ── Button resets (AI sometimes uses <button>) ── */
  button {
    cursor:pointer; font-family:inherit; font-size:inherit;
    border:1px solid var(--border); border-radius:var(--radius-sm);
    background:rgba(255,255,255,0.05); color:var(--text);
    padding:8px 16px; transition:all 0.2s ease;
  }
  button:hover { background:rgba(255,255,255,0.1); }
  button.primary { background:var(--primary); color:#020617; border-color:var(--primary); font-weight:700; }
  button.primary:hover { opacity:0.9; }
  button.danger  { background:var(--danger-dim); color:var(--danger); border-color:rgba(239,68,68,0.3); }

  /* ── Input ── */
  input, select, textarea {
    background:rgba(255,255,255,0.04); border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text); padding:8px 12px;
    font-family:inherit; font-size:14px; width:100%;
    outline:none; transition:border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color:var(--primary); }

  /* ── Progress bar ── */
  .progress { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,var(--primary),var(--secondary)); border-radius:3px; transition:width 0.6s ease; }

  /* ── Divider ── */
  .divider { height:1px; background:var(--border); margin:16px 0; }
</style>
</head>
<body>
<div id="visual-root">
${componentCode}
</div>

<script>
(function() {
    // ── Auto-resize ──────────────────────────────────────────
    function reportSize() {
        const root = document.getElementById('visual-root');
        if (!root) return;
        const h = root.scrollHeight;
        window.parent.postMessage({ action: 'resize', height: h }, '*');
    }

    // Run on load + after images/fonts settle
    window.addEventListener('load', () => {
        reportSize();
        setTimeout(reportSize, 300);
        setTimeout(reportSize, 800);
    });

    // MutationObserver for dynamic content
    const mo = new MutationObserver(reportSize);
    mo.observe(document.body, { childList:true, subtree:true, attributes:true });

    // ResizeObserver
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(reportSize);
        const root = document.getElementById('visual-root');
        if (root) ro.observe(root);
    }

    // ── Global error handler ─────────────────────────────────
    window.addEventListener('error', (e) => {
        window.parent.postMessage({ action: 'error', error: e.message }, '*');
    });

    // Signal ready
    window.parent.postMessage({ action: 'ready' }, '*');

    // ── Chart.js dark theme defaults ────────────────────────
    if (window.Chart) {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
        Chart.defaults.backgroundColor = 'rgba(0,210,255,0.1)';
        Chart.defaults.font.family = "'Outfit', system-ui, sans-serif";
    }
})();
</script>
</body>
</html>`;
}
