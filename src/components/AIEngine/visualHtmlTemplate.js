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
  const hasChart = (componentCode || '').toLowerCase().includes('chart') || (componentCode || '').toLowerCase().includes('<canvas');
  const chartScript = hasChart ? '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>' : '';

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">

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

<!-- Chart.js (conditionally loaded) -->
${chartScript}

<style>
  /* ── CSS Design Tokens (HUBly Premium Matte Dark Theme) ── */
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
    --bg:             #121316; /* Premium deep charcoal bg */
    --card:           #16171b; /* Matte black card */
    --border:         rgba(255,255,255,0.05);
    --border-hover:   rgba(255,255,255,0.1);
    --border-focus:   rgba(0,210,255,0.4);
    --text:           #f8fafc;
    --text-muted:     #8e9099;
    --text-dim:       #585a66;
    --radius:         24px;
    --radius-sm:      12px;
    --shadow:         none;
  }

  /* ── Base Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: transparent !important;
    color: var(--text);
    font-family: 'Outfit', 'Inter', system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  body {
    opacity: 0;
    transition: opacity 0.25s ease-out;
  }

  /* ── Visual Container ── */
  #visual-root {
    padding: 20px;
    width: 100%;
    min-height: 60px;
  }

  /* ── Premium Card Design ── */
  .card-premium {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s ease;
  }
  .card-premium:hover {
    border-color: var(--border-hover);
  }

  /* ── Soft Gradient Radial Glows ── */
  .glow-emerald { background-image: radial-gradient(circle at top left, rgba(16, 185, 129, 0.15) 0%, transparent 60%); }
  .glow-orange  { background-image: radial-gradient(circle at top left, rgba(245, 158, 11, 0.15) 0%, transparent 60%); }
  .glow-cyan    { background-image: radial-gradient(circle at top left, rgba(0, 210, 255, 0.15) 0%, transparent 60%); }
  .glow-purple  { background-image: radial-gradient(circle at top left, rgba(168, 85, 247, 0.15) 0%, transparent 60%); }

  /* ── Custom Badges ── */
  .badge {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 100px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .badge-primary { background: var(--primary-dim); color: var(--primary); }
  .badge-success { background: var(--success-dim); color: var(--success); }
  .badge-warning { background: var(--warning-dim); color: var(--warning); }
  .badge-danger  { background: var(--danger-dim);  color: var(--danger);  }
  .badge-purple  { background: var(--purple-dim);  color: var(--purple);  }

  /* ── Animations ── */
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }

  .animate-fade    { animation: fadeIn  0.45s ease-out forwards; }
  .animate-slide   { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .animate-scale   { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.1s; }
  .delay-3 { animation-delay: 0.15s; }
  .delay-4 { animation-delay: 0.2s; }
  .delay-5 { animation-delay: 0.25s; }

  /* ── Premium Tables ── */
  table { width: 100%; border-collapse: separate; border-spacing: 0; }
  th, td { padding: 10px 16px; border-bottom: 1px solid var(--border); text-align: inherit; white-space: nowrap; }
  th { background: rgba(255,255,255,0.01); color: var(--text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  tr:last-child td { border-bottom: none; }
  tr { transition: background-color 0.2s ease; }
  tr:hover td { background: rgba(255, 255, 255, 0.02); }
  
  /* Highlight active row */
  tr.active-row td {
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* ── Scrollbars ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

  /* ── Premium Inputs ── */
  input, select, textarea {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    padding: 10px 14px;
    font-family: inherit;
    font-size: 14px;
    width: 100%;
    outline: none;
    transition: all 0.2s ease;
  }
  input:hover, select:hover, textarea:hover {
    border-color: var(--border-hover);
    background: rgba(255, 255, 255, 0.05);
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 0 15px rgba(0, 210, 255, 0.15);
  }
  
  /* Select styling overrides (Leds to premium dark dropdowns) */
  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='%238e9099' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px !important;
    cursor: pointer;
  }
  /* RTL specific arrow positioning */
  html[dir="rtl"] select,
  [dir="rtl"] select {
    background-position: left 12px center;
    padding-right: 14px !important;
    padding-left: 36px !important;
  }
  select option {
    background-color: #16171b !important;
    color: var(--text) !important;
  }

  /* ── Premium Buttons ── */
  button {
    cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600;
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.03); color: var(--text);
    padding: 10px 18px; transition: all 0.2s ease;
  }
  button:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-hover);
  }
  button.primary {
    background: var(--primary); color: #020617; border-color: var(--primary);
  }
  button.primary:hover {
    opacity: 0.9;
    box-shadow: 0 0 15px rgba(0, 210, 255, 0.2);
  }

  /* ── Progress & Dividers ── */
  .progress { height: 6px; background: rgba(255,255,255,0.04); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 100px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
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

    // Fallback timer to force fade-in and signal ready if load event hangs/takes too long
    const forceLoadTimer = setTimeout(() => {
        reportSize();
        document.body.style.opacity = '1';
        window.parent.postMessage({ action: 'ready' }, '*');
    }, 1200);

    // Run on load + after images/fonts settle
    window.addEventListener('load', () => {
        clearTimeout(forceLoadTimer);
        reportSize();
        document.body.style.opacity = '1'; // Fade in the body smoothly
        window.parent.postMessage({ action: 'ready' }, '*');
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

    // ── HUBly Sandbox API Bridge (window.HUBlyAPI) ───────────────────────
    const pendingPromises = {};
    window.HUBlyAPI = {
        generateSpeech: (payload) => {
            const requestId = 'req_' + Math.random().toString(36).substring(2, 11);
            return new Promise((resolve, reject) => {
                pendingPromises[requestId] = { resolve, reject };
                window.parent.postMessage({
                    action: 'HUB_GENERATE_SPEECH',
                    payload,
                    requestId
                }, '*');
            });
        },
        generateImage: (payload) => {
            const requestId = 'req_' + Math.random().toString(36).substring(2, 11);
            return new Promise((resolve, reject) => {
                pendingPromises[requestId] = { resolve, reject };
                window.parent.postMessage({
                    action: 'HUB_GENERATE_IMAGE',
                    payload,
                    requestId
                }, '*');
            });
        }
    };

    // Listen for responses back from parent
    window.addEventListener('message', (e) => {
        const { action, requestId, success, result, error } = e.data || {};
        if (action === 'HUB_API_RESPONSE' && requestId && pendingPromises[requestId]) {
            const { resolve, reject } = pendingPromises[requestId];
            delete pendingPromises[requestId];
            if (success) {
                resolve(result);
            } else {
                reject(new Error(error || 'API Execution failed'));
            }
        }
    });

    // ── Global image error handler to resolve broken logos dynamically ──
    document.addEventListener('error', function(e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
            const img = e.target;
            if (img.dataset.hasFailed) return;
            img.dataset.hasFailed = 'true';
            
            const originalSrc = img.getAttribute('src') || '';
            const altText = img.getAttribute('alt') || '';
            const combinedText = (originalSrc + ' ' + altText).toLowerCase();
            
            // Determine if it's a tool logo or a general explanatory/illustration image
            const brandNames = ['openai', 'midjourney', 'runway', 'elevenlabs', 'suno', 'udio', 'luma', 'kling', 'leonardo', 'pika', 'heygen', 'viggle', 'stripe', 'supabase', 'next.js', 'nextjs', 'tailwind', 'github', 'vercel'];
            const isToolLogo = img.classList.contains('toolLogo') || img.classList.contains('logo') || 
                               combinedText.includes('logo') || combinedText.includes('icon') || 
                               brandNames.some(w => combinedText.includes(w));
            
            if (isToolLogo) {
                let domain = '';
                if (combinedText.includes('openai') || combinedText.includes('chatgpt')) domain = 'openai.com';
                else if (combinedText.includes('midjourney')) domain = 'midjourney.com';
                else if (combinedText.includes('runway')) domain = 'runwayml.com';
                else if (combinedText.includes('elevenlabs') || combinedText.includes('eleven labs') || combinedText.includes('eleve')) domain = 'elevenlabs.io';
                else if (combinedText.includes('suno')) domain = 'suno.com';
                else if (combinedText.includes('udio')) domain = 'udio.com';
                else if (combinedText.includes('luma') || combinedText.includes('lumr')) domain = 'lumalabs.ai';
                else if (combinedText.includes('kling') || combinedText.includes('klino')) domain = 'klingai.com';
                else if (combinedText.includes('leonardo')) domain = 'leonardo.ai';
                else if (combinedText.includes('pika')) domain = 'pika.art';
                else if (combinedText.includes('heygen')) domain = 'heygen.com';
                else if (combinedText.includes('viggle')) domain = 'viggle.ai';
                else if (combinedText.includes('stripe')) domain = 'stripe.com';
                else if (combinedText.includes('supabase')) domain = 'supabase.com';
                else if (combinedText.includes('next.js') || combinedText.includes('nextjs')) domain = 'nextjs.org';
                else if (combinedText.includes('tailwind')) domain = 'tailwindcss.com';
                else if (combinedText.includes('github')) domain = 'github.com';
                else if (combinedText.includes('vercel')) domain = 'vercel.com';
                else {
                    const cleanSrc = originalSrc.trim().replace(/[^a-zA-Z0-9.-]/g, '');
                    if (cleanSrc && !cleanSrc.includes('/') && cleanSrc.length > 2) {
                        domain = cleanSrc.includes('.') ? cleanSrc : cleanSrc + '.com';
                    } else {
                        domain = 'google.com';
                    }
                }
                img.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=128';
            } else {
                // General content illustration/mockup image. Use high-res premium Unsplash fallbacks!
                let fallbackUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; // Sleek dark abstract default
                
                if (combinedText.includes('shadow') || combinedText.includes('light') || combinedText.includes('contrast')) {
                    fallbackUrl = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'; // Cinematic dark light/shadow
                } else if (combinedText.includes('action') || combinedText.includes('movement') || combinedText.includes('camera') || combinedText.includes('motion')) {
                    fallbackUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'; // Movie action/motion
                } else if (combinedText.includes('photoreal') || combinedText.includes('realism') || combinedText.includes('realistic')) {
                    fallbackUrl = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80'; // High fidelity nature/realism
                } else if (combinedText.includes('story') || combinedText.includes('script') || combinedText.includes('novel')) {
                    fallbackUrl = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80'; // Writing/storytelling
                } else if (combinedText.includes('dashboard') || combinedText.includes('chart') || combinedText.includes('analytics')) {
                    fallbackUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'; // Data/charts
                }
                img.src = fallbackUrl;
            }
        }
    }, true);

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
