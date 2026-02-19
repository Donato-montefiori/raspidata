// ===== RASPADITA ENGINE — ES MODULE =====
// Bridge injected by initEngine(). Falls back to localStorage when not set.
let gameBridge = null;
const $ = id => document.getElementById(id);

function toggleUpgrades(forceExpanded = null) {
    const section = document.querySelector('.upgrade-section');
    const willExpand = (forceExpanded !== null) ? !!forceExpanded : section.classList.contains('collapsed');
    section.classList.toggle('collapsed', !willExpand);
    document.body.classList.toggle('upgrades-expanded', willExpand);
    
    if (!willExpand) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    try { localStorage.setItem('upgradesExpanded', willExpand ? '1' : '0'); } catch(e) {}
}

function initUpgradesFold() {
    let expanded = false;
    try { expanded = localStorage.getItem('upgradesExpanded') === '1'; } catch(e) {}
    toggleUpgrades(expanded);
}

// ========== GEMS SVG DATA ==========
const gemSVGs = {
    'carbon': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="carbon-grad" x1="40%" y1="20%" x2="60%" y2="80%"><stop offset="0%" style="stop-color:#4a4a4a"/><stop offset="100%" style="stop-color:#1a1a1a"/></linearGradient></defs><path d="M 20,20 L 40,16 L 52,32 L 44,52 L 20,48 L 12,32 Z" fill="url(#carbon-grad)" stroke="#222" stroke-width="2"/><path d="M 20,20 L 40,16 L 52,32" stroke="#666" stroke-width="1" fill="none" opacity="0.3"/><path d="M 20,20 L 12,32 L 20,48" stroke="#000" stroke-width="2" fill="none" opacity="0.2"/></svg>`,
    
    'cuarzo': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cuarzo-grad" x1="30%" y1="10%" x2="70%" y2="90%"><stop offset="0%" style="stop-color:#eee"/><stop offset="100%" style="stop-color:#999"/></linearGradient></defs><path d="M 32,6 L 50,18 L 50,44 L 32,58 L 14,44 L 14,18 Z" fill="url(#cuarzo-grad)" stroke="#777" stroke-width="1.5"/><path d="M 32,6 L 50,18 L 32,30 Z" fill="#fff" opacity="0.6"/><path d="M 32,30 L 50,18 L 50,44 Z" fill="#ccc" opacity="0.3"/><path d="M 32,30 L 14,18 L 14,44 Z" fill="#ddd" opacity="0.4"/><path d="M 32,30 L 14,44 L 32,58 Z" fill="#bbb" opacity="0.5"/><path d="M 32,58 L 50,44 L 32,30 Z" fill="#aaa" opacity="0.6"/><path d="M 32,30 L 14,18 L 32,6 Z" fill="#fafafa" opacity="0.5"/></svg>`,
    
    'rubi': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rubi-grad" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" style="stop-color:#ff4d4d"/><stop offset="50%" style="stop-color:#e60000"/><stop offset="100%" style="stop-color:#800000"/></linearGradient></defs><path d="M 32,4 L 54,16 L 54,40 L 32,58 L 10,40 L 10,16 Z" fill="url(#rubi-grad)" stroke="#500000" stroke-width="2"/><path d="M 32,4 L 54,16 L 44,28 L 20,28 L 10,16 Z" fill="#ff6666" opacity="0.6"/><path d="M 20,28 L 44,28 L 32,46 Z" fill="#cc0000" opacity="0.5"/><path d="M 32,46 L 44,28 L 54,40 L 32,58 Z" fill="#800000" opacity="0.6"/><path d="M 10,40 L 20,28 L 32,46 L 32,58 Z" fill="#800000" opacity="0.6"/><path d="M 22,18 L 18,22" stroke="#fff" stroke-width="2" opacity="0.4"/></svg>`,
    
    'amatista': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="amatista-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e0aaff"/><stop offset="50%" style="stop-color:#9d4edd"/><stop offset="100%" style="stop-color:#5a189a"/></linearGradient></defs><path d="M 32,4 L 56,18 L 46,50 L 32,60 L 18,50 L 8,18 Z" fill="url(#amatista-grad)" stroke="#240046" stroke-width="1.5"/><path d="M 32,4 L 56,18 L 32,28 Z" fill="#f0d0ff" opacity="0.7"/><path d="M 32,28 L 56,18 L 46,50 Z" fill="#c77dff" opacity="0.5"/><path d="M 32,28 L 46,50 L 32,60 Z" fill="#7b2cbf" opacity="0.6"/><path d="M 32,60 L 18,50 L 32,28 Z" fill="#5a189a" opacity="0.7"/><path d="M 18,50 L 8,18 L 32,28 Z" fill="#9d4edd" opacity="0.6"/><path d="M 8,18 L 32,4 L 32,28 Z" fill="#e0aaff" opacity="0.5"/></svg>`,
    
    'topacio': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="topacio-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fffacd"/><stop offset="50%" style="stop-color:#ffcc00"/><stop offset="100%" style="stop-color:#b8860b"/></linearGradient></defs><path d="M 32,4 L 48,14 L 58,32 L 48,50 L 32,60 L 16,50 L 6,32 L 16,14 Z" fill="url(#topacio-grad)" stroke="#b8860b" stroke-width="2"/><path d="M 32,4 L 48,14 L 32,24 Z" fill="#ffeeaa" opacity="0.6"/><path d="M 16,14 L 6,32 L 16,50 L 22,40 L 22,24 Z" fill="#ffd700" opacity="0.5"/><path d="M 48,14 L 58,32 L 48,50 L 42,40 L 42,24 Z" fill="#daa520" opacity="0.5"/><path d="M 16,50 L 32,60 L 48,50 L 42,40 L 22,40 Z" fill="#b8860b" opacity="0.6"/><rect x="22" y="24" width="20" height="16" fill="#fff" opacity="0.2"/></svg>`,
    
    'esmeralda': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="esmeralda-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#34d399"/><stop offset="50%" style="stop-color:#059669"/><stop offset="100%" style="stop-color:#064e3b"/></linearGradient></defs><path d="M 24,8 L 40,8 L 50,18 L 50,46 L 40,56 L 24,56 L 14,46 L 14,18 Z" fill="url(#esmeralda-grad)" stroke="#065f46" stroke-width="2"/><rect x="22" y="20" width="20" height="24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><path d="M 14,18 L 22,20" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 42,20 L 50,18" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 42,44 L 50,46" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 14,46 L 22,44" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 24,8 L 22,20" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 40,8 L 42,20" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 40,56 L 42,44" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><path d="M 24,56 L 22,44" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><polygon points="24,8 40,8 32,18" fill="rgba(167, 243, 208, 0.4)"/><polygon points="14,18 22,20 22,44 14,46" fill="rgba(6, 78, 59, 0.2)"/></svg>`,
    
    'hielita': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hielita-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e0f2fe"/><stop offset="40%" style="stop-color:#7dd3fc"/><stop offset="70%" style="stop-color:#0ea5e9"/><stop offset="100%" style="stop-color:#0284c7"/></linearGradient></defs><path d="M 32,6 L 48,18 L 52,34 L 44,52 L 20,52 L 12,34 L 16,18 Z" fill="url(#hielita-grad)" stroke="#0369a1" stroke-width="2"/><path d="M 32,6 L 48,18 L 32,26 Z" fill="#f0f9ff" opacity="0.8"/><path d="M 16,18 L 32,26 L 12,34 Z" fill="#bae6fd" opacity="0.6"/><path d="M 48,18 L 52,34 L 32,26 Z" fill="#7dd3fc" opacity="0.5"/><path d="M 32,26 L 44,52 L 20,52 L 12,34 L 32,26 Z" fill="#0284c7" opacity="0.4"/><polygon points="28,20 36,20 32,28 30,24" fill="rgba(255,255,255,0.7)"/><path d="M 22,16 L 20,20" stroke="#fff" stroke-width="2" opacity="0.6"/><path d="M 42,16 L 44,20" stroke="#fff" stroke-width="2" opacity="0.6"/></svg>`,
    
    'diamante_rosa': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rosa-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fce7f3"/><stop offset="30%" style="stop-color:#f472b6"/><stop offset="70%" style="stop-color:#ec4899"/><stop offset="100%" style="stop-color:#831843"/></linearGradient></defs><path d="M 20,12 L 44,12 L 58,26 L 32,58 L 6,26 Z" fill="url(#rosa-grad)" stroke="#be185d" stroke-width="2"/><polygon points="20,12 44,12 32,26" fill="rgba(255,255,255,0.4)"/><polygon points="32,26 6,26 20,12" fill="rgba(255,240,245,0.5)"/><polygon points="32,26 44,12 58,26" fill="rgba(255,240,245,0.5)"/><polygon points="32,58 6,26 32,26" fill="rgba(236,72,153,0.3)"/><polygon points="32,26 32,38 22,32" fill="#fff" opacity="0.2"/><path d="M 24,14 L 20,18" stroke="#fff" stroke-width="2" opacity="0.5"/></svg>`,
    
    'galaxita': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="galaxita-grad"><stop offset="0%" style="stop-color:#ddd6fe"/><stop offset="40%" style="stop-color:#7c3aed"/><stop offset="100%" style="stop-color:#2e1065"/></radialGradient></defs><!-- Main Body sin blocker --><circle class="main-body" cx="32" cy="32" r="28" fill="url(#galaxita-grad)" stroke="#5b21b6" stroke-width="2"/><g><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="10s" repeatCount="indefinite"/><path d="M 15,32 Q 32,15 49,32 Q 32,49 15,32" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><circle cx="49" cy="32" r="2" fill="#fff" opacity="0.8"/></g><g><animateTransform attributeName="transform" type="rotate" from="360 32 32" to="0 32 32" dur="15s" repeatCount="indefinite"/><path d="M 32,10 Q 54,32 32,54 Q 10,32 32,10" fill="none" stroke="rgba(167,139,250,0.4)" stroke-width="1"/><circle cx="32" cy="10" r="1.5" fill="#fcd34d"/></g><circle cx="25" cy="25" r="1" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></circle><circle cx="40" cy="40" r="1.5" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle></svg>`,
    
    'obsidiana': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="obsidiana-grad" cx="50%" cy="40%" r="60%"><stop offset="0%" style="stop-color:#57534e"/><stop offset="70%" style="stop-color:#292524"/><stop offset="100%" style="stop-color:#0c0a09"/></radialGradient><filter id="glass-shine"><feGaussianBlur stdDeviation="0.5" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter></defs><path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z" fill="url(#obsidiana-grad)" stroke="#1c1917" stroke-width="1.5"/><path d="M 32,4 L 54,18 L 32,28 Z" fill="#44403c" opacity="0.3" filter="url(#glass-shine)"/><path d="M 10,18 L 32,28 L 6,38 Z" fill="#1c1917" opacity="0.4"/><path d="M 54,18 L 58,38 L 32,28 Z" fill="#1c1917" opacity="0.4"/><path d="M 32,28 L 48,56 L 16,56 L 6,38 L 32,28 Z" fill="#0c0a09" opacity="0.5"/><polygon points="28,22 36,22 32,32" fill="rgba(255,255,255,0.08)" filter="url(#glass-shine)"/><path d="M 20,15 L 18,20" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round"/><path d="M 44,15 L 46,20" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round"/></svg>`,

    'zafiro': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="zafiro-grad"><stop offset="10%" style="stop-color:#93c5fd"/><stop offset="60%" style="stop-color:#1d4ed8"/><stop offset="100%" style="stop-color:#172554"/></radialGradient></defs><path d="M 32,4 L 56,24 L 32,58 L 8,24 Z" fill="url(#zafiro-grad)" stroke="#1e3a8a" stroke-width="2"/><path d="M 32,4 L 56,24 L 32,30 Z" fill="#bfdbfe" opacity="0.6"/><path d="M 32,30 L 56,24 L 32,58 Z" fill="#1e40af" opacity="0.7"/><path d="M 32,30 L 32,58 L 8,24 Z" fill="#172554" opacity="0.6"/><path d="M 32,4 L 32,30 L 8,24 Z" fill="#60a5fa" opacity="0.5"/><polygon points="32,18 36,24 32,30 28,24" fill="rgba(255,255,255,0.6)"/></svg>`,

    'grieta_mal': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="rift-stone" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#3f3f46"/>
    <stop offset="100%" stop-color="#09090b"/>
  </linearGradient>
  <linearGradient id="rift-stone-hi" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="rgba(255,255,255,0.14)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0.35)"/>
  </linearGradient>
</defs>

<!-- Outer shape (same silueta que Obsidiana) -->
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="none" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="url(#rift-stone)" stroke="none"/>

<!-- Subtle rock shading -->
<path d="M 32,4 L 54,18 L 32,32 L 10,18 Z" fill="rgba(255,255,255,0.08)"/>
<path d="M 32,32 L 48,56 L 16,56 L 6,38 Z" fill="rgba(0,0,0,0.28)"/>
<path d="M 32,4 L 54,18 L 58,38 L 48,56" fill="none" stroke="url(#rift-stone-hi)" stroke-width="2.2" opacity="0.6" stroke-linecap="round"/>

<!-- Crack (dark, no portal) -->
<path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z"
      fill="#050508" stroke="#12091b" stroke-width="2.7" stroke-linejoin="round"/>

<!-- Inner edge (dark only, no purple glow) -->
<g transform="translate(32 32) scale(0.52) translate(-32 -32)" opacity="0.5">
<path d="M18 16 L24 13 L29 17 L34 15 L39 19 L45 17 L49 23 L47 30 L52 36 L47 42 L49 48 L44 51 L40 47 L35 51 L30 48 L26 53 L21 50 L17 45 L13 39 L14 33 L11 27 L14 21 Z"
      fill="none" stroke="rgba(63,63,70,0.35)" stroke-width="1.6" stroke-linejoin="round"/>
</g>
</svg>`,

    
    'corona_dios': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
    <!-- Gradiente Galáctico Divino -->
    <linearGradient id="god-galaxy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#e0e7ff"/> <!-- Blanco azulado -->
        <stop offset="25%" style="stop-color:#818cf8"/> <!-- Indigo claro -->
        <stop offset="60%" style="stop-color:#4f46e5"/> <!-- Indigo vivo -->
        <stop offset="100%" style="stop-color:#1e1b4b"/> <!-- Espacio profundo -->
    </linearGradient>
    
    <!-- Nebulosa Interior -->
    <radialGradient id="god-nebula-grad" cx="50%" cy="50%" r="60%">
        <stop offset="0%" style="stop-color:#f0abfc"/> <!-- Rosa brillante -->
        <stop offset="50%" style="stop-color:#a855f7"/> <!-- Purpura -->
        <stop offset="100%" style="stop-color:#312e81"/> <!-- Indigo oscuro -->
    </radialGradient>
    
    <filter id="god-aura" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
</defs>

<!-- Halo Cósmico -->
<g opacity="0.6">
    <animateTransform attributeName="transform" type="rotate" from="360 32 32" to="0 32 32" dur="20s" repeatCount="indefinite"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="url(#god-nebula-grad)" stroke-width="0.5" stroke-dasharray="1,5"/>
</g>

<!-- Estructura Cristalina Galáctica -->
<!-- Pico Central -->
<path d="M 22,42 L 32,2 L 42,42 Q 32,50 22,42" fill="url(#god-galaxy-grad)" stroke="#818cf8" stroke-width="0.5"/>
<!-- Pico Izquierdo -->
<path d="M 12,46 L 8,18 L 24,40 Z" fill="url(#god-galaxy-grad)" stroke="#6366f1" stroke-width="0.5"/>
<!-- Pico Derecho -->
<path d="M 52,46 L 56,18 L 40,40 Z" fill="url(#god-galaxy-grad)" stroke="#6366f1" stroke-width="0.5"/>
<!-- Base -->
<path d="M 12,46 Q 32,58 52,46 L 52,40 Q 32,52 12,40 Z" fill="#312e81" stroke="#818cf8" stroke-width="1"/>

<!-- Gema Nebula Central -->
<path d="M 32,18 L 39,30 L 32,44 L 25,30 Z" fill="url(#god-nebula-grad)" stroke="#c084fc" stroke-width="1" filter="url(#god-aura)">
    <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
</path>

<!-- Estrellas Incrustadas -->
<circle cx="32" cy="10" r="2" fill="#fff" filter="url(#god-aura)">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
</circle>
<circle cx="8" cy="18" r="1.5" fill="#a5f3fc">
    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
</circle>
<circle cx="56" cy="18" r="1.5" fill="#a5f3fc">
    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
</circle>

<!-- Destellos Orbitales -->
<circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" transform="rotate(45 32 32)"/>
<circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" transform="rotate(-45 32 32)"/>

</svg>`,

    'nada': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M 10,20 Q 20,10 30,20 Q 40,30 50,20" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/><path d="M 10,32 Q 20,22 30,32 Q 40,42 50,32" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/><path d="M 10,44 Q 20,34 30,44 Q 40,54 50,44" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/></svg>`
};

gemSVGs['gema_poder'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="amethyst-body" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#f5d0fe"/>
    <stop offset="45%" stop-color="#c084fc"/>
    <stop offset="100%" stop-color="#6d28d9"/>
  </linearGradient>
  <linearGradient id="amethyst-edge" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0.35)"/>
  </linearGradient>
  <radialGradient id="magic-aura" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="rgba(217,70,239,0.55)"/>
    <stop offset="55%" stop-color="rgba(124,58,237,0.25)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>
  <filter id="magic-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge>
      <feMergeNode in="b"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>

<!-- aura -->
<ellipse cx="32" cy="34" rx="22" ry="26" fill="url(#magic-aura)" filter="url(#magic-glow)">
  <animate attributeName="opacity" values="0.55;0.85;0.55" dur="2.6s" repeatCount="indefinite"/>
</ellipse>

<!-- crystal -->
<polygon points="32,4 46,18 46,46 32,60 18,46 18,18" fill="url(#amethyst-body)" stroke="#4c1d95" stroke-width="2"/>

<!-- facets (top) -->
<polygon points="32,4 46,18 32,26" fill="rgba(255,255,255,0.35)"/>
<polygon points="32,4 18,18 32,26" fill="rgba(255,255,255,0.18)"/>

<!-- facets (sides) -->
<polygon points="18,18 32,26 18,46" fill="rgba(0,0,0,0.10)"/>
<polygon points="46,18 32,26 46,46" fill="rgba(0,0,0,0.18)"/>

<!-- facets (bottom) -->
<polygon points="18,46 32,60 32,38" fill="rgba(0,0,0,0.16)"/>
<polygon points="46,46 32,60 32,38" fill="rgba(0,0,0,0.28)"/>

<!-- inner shine -->
<path d="M26 18 L30 14 L34 14 L30 20 Z" fill="rgba(255,255,255,0.55)"/>
<path d="M24 26 L28 22 L30 24 L26 30 Z" fill="rgba(255,255,255,0.18)"/>

<!-- magic runes -->
<g filter="url(#magic-glow)" opacity="0.9">
  <path d="M22 34 C26 30, 30 30, 34 34 C38 38, 42 38, 46 34" fill="none" stroke="#f0abfc" stroke-width="1.6" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.9s" repeatCount="indefinite"/>
  </path>
  <path d="M20 40 C25 36, 30 36, 32 40 C34 44, 39 44, 44 40" fill="none" stroke="#a78bfa" stroke-width="1.2" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="1;0.25;1" dur="2.4s" repeatCount="indefinite"/>
  </path>
</g>

<!-- particles -->
<g filter="url(#magic-glow)">
  <circle cx="16" cy="24" r="1.4" fill="#e879f9">
    <animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="22" r="1.2" fill="#c4b5fd">
    <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="0.4s"/>
  </circle>
  <circle cx="14" cy="46" r="1.1" fill="#a78bfa">
    <animate attributeName="opacity" values="0;1;0" dur="2.6s" repeatCount="indefinite" begin="0.8s"/>
  </circle>
  <circle cx="52" cy="44" r="1.5" fill="#f0abfc">
    <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite" begin="0.2s"/>
  </circle>
</g>
</svg>`;

gemSVGs['sol_atrapado'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="solstone-grad" x1="15%" y1="0%" x2="85%" y2="100%">
    <stop offset="0%" stop-color="#fff7d6"/>
    <stop offset="35%" stop-color="#f59e0b"/>
    <stop offset="100%" stop-color="#78350f"/>
  </linearGradient>
  <radialGradient id="sun-core" cx="45%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="30%" stop-color="#fef08a"/>
    <stop offset="70%" stop-color="#fbbf24"/>
    <stop offset="100%" stop-color="#f59e0b"/>
  </radialGradient>

  <filter id="sun-glow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge>
      <feMergeNode in="b"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

  <!-- clip sun + rays INSIDE the gem, so it looks "atrapado" -->
  <clipPath id="sol-gem-clip">
    <polygon points="22,6 42,6 58,22 58,42 42,58 22,58 6,42 6,22"/>
  </clipPath>
</defs>

<!-- gem body -->
<polygon points="22,6 42,6 58,22 58,42 42,58 22,58 6,42 6,22"
        fill="url(#solstone-grad)" stroke="#f59e0b" stroke-width="2.4" stroke-linejoin="round"/>

<!-- facets -->
<polygon points="22,6 42,6 32,20" fill="rgba(255,255,255,0.22)"/>
<polygon points="42,6 58,22 44,20" fill="rgba(255,255,255,0.12)"/>
<polygon points="58,22 58,42 44,32" fill="rgba(0,0,0,0.10)"/>
<polygon points="6,22 6,42 20,32" fill="rgba(255,255,255,0.14)"/>
<polygon points="22,58 42,58 32,44" fill="rgba(0,0,0,0.12)"/>

<!-- trapped sun (everything clipped inside gem) -->
<g clip-path="url(#sol-gem-clip)">
  <!-- internal rays (subtle, inside only) -->
  <g transform="translate(32,32)" opacity="0.55" filter="url(#sun-glow)">
    <path d="M0 -20 L3 -13 L0 -6 L-3 -13 Z" fill="#fbbf24">
      <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" dur="7s" repeatCount="indefinite"/>
    </path>
    <path d="M20 0 L13 3 L6 0 L13 -3 Z" fill="#fbbf24">
      <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" dur="7s" repeatCount="indefinite"/>
    </path>
    <path d="M0 20 L-3 13 L0 6 L3 13 Z" fill="#fbbf24">
      <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" dur="7s" repeatCount="indefinite"/>
    </path>
    <path d="M-20 0 L-13 -3 L-6 0 L-13 3 Z" fill="#fbbf24">
      <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" dur="7s" repeatCount="indefinite"/>
    </path>
  </g>

  <!-- sun core -->
  <circle cx="32" cy="32" r="11.5" fill="url(#sun-core)" filter="url(#sun-glow)">
    <animate attributeName="r" values="11.2;12.2;11.2" dur="2.2s" repeatCount="indefinite"/>
  </circle>

  <!-- heat shimmer highlight -->
  <ellipse cx="26" cy="26" rx="4.2" ry="3.1" fill="#fff" opacity="0.45" transform="rotate(-28 26 26)"/>
</g>
</svg>`;

gemSVGs['corazon_rubi'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ruby-heart-grad" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" style="stop-color:#fca5a5"/><stop offset="50%" style="stop-color:#dc2626"/><stop offset="100%" style="stop-color:#7f1d1d"/></linearGradient></defs><polygon points="32,20 42,10 54,10 60,22 60,30 32,58 4,30 4,22 10,10 22,10" fill="url(#ruby-heart-grad)" stroke="#991b1b" stroke-width="2"/><polygon points="32,20 22,10 10,10 4,22 4,30 32,35" fill="rgba(255,255,255,0.2)"/><polygon points="32,20 42,10 54,10 60,22 60,30 32,35" fill="rgba(0,0,0,0.1)"/><polygon points="32,58 4,30 32,35" fill="rgba(0,0,0,0.3)"/><polygon points="32,58 60,30 32,35" fill="rgba(0,0,0,0.4)"/><polygon points="20,20 25,15 30,20 25,25" fill="#fff" opacity="0.4"/></svg>`;

gemSVGs['cryogenita'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cryo-main" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#e0f2fe"/>
    <stop offset="40%" style="stop-color:#7dd3fc"/>
    <stop offset="80%" style="stop-color:#0284c7"/>
    <stop offset="100%" style="stop-color:#0c4a6e"/>
  </linearGradient>
  <linearGradient id="cryo-facet1" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#f0f9ff"/>
    <stop offset="100%" style="stop-color:#bae6fd"/>
  </linearGradient>
  <linearGradient id="cryo-facet2" x1="100%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:#0ea5e9"/>
    <stop offset="100%" style="stop-color:#0369a1"/>
  </linearGradient>
</defs>

<!-- Cuerpo principal - forma angular irregular -->
<path d="M 28,8 L 38,4 L 50,14 L 54,28 L 52,42 L 44,54 L 32,60 L 20,56 L 12,44 L 10,28 L 16,16 Z"
      fill="url(#cryo-main)" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="miter"/>

<!-- Faceta superior izquierda (clara) -->
<path d="M 28,8 L 16,16 L 10,28 L 24,22 Z"
      fill="url(#cryo-facet1)" opacity="0.8"/>

<!-- Faceta superior derecha (clara) -->
<path d="M 38,4 L 50,14 L 54,28 L 40,18 Z"
      fill="#f0f9ff" opacity="0.7"/>

<!-- Faceta central grande (media) -->
<path d="M 24,22 L 40,18 L 54,28 L 52,42 L 38,48 L 22,44 L 10,28 Z"
      fill="url(#cryo-main)" opacity="0.4"/>

<!-- Faceta lateral izquierda (oscura) -->
<path d="M 10,28 L 22,44 L 12,44 L 20,56 L 32,60 L 38,48 Z"
      fill="url(#cryo-facet2)" opacity="0.6"/>

<!-- Faceta lateral derecha (oscura) -->
<path d="M 54,28 L 52,42 L 44,54 L 32,60 L 38,48 Z"
      fill="rgba(12,74,110,0.5)"/>

<!-- Reflejos angulares blancos -->
<path d="M 30,10 L 36,8 L 40,14 L 34,16 Z" fill="#fff" opacity="0.6"/>
<path d="M 18,20 L 26,18 L 28,24 L 20,26 Z" fill="#fff" opacity="0.5"/>
<polygon points="46,20 50,24 48,30 44,26" fill="rgba(255,255,255,0.4)"/>

<!-- Líneas de fractura (edge highlights) -->
<line x1="28" y1="8" x2="24" y2="22" stroke="#fff" stroke-width="1.5" opacity="0.5"/>
<line x1="38" y1="4" x2="40" y2="18" stroke="#fff" stroke-width="1.5" opacity="0.6"/>
<line x1="16" y1="16" x2="10" y2="28" stroke="#0c4a6e" stroke-width="1" opacity="0.4"/>
<line x1="50" y1="14" x2="54" y2="28" stroke="#0c4a6e" stroke-width="1" opacity="0.4"/>
</svg>`;

gemSVGs['aurora_cristalina'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="aurora-core" x1="10%" y1="10%" x2="90%" y2="90%">
    <stop offset="0%" style="stop-color:#fff1f2"/>
    <stop offset="30%" style="stop-color:#fbcfe8"/>
    <stop offset="55%" style="stop-color:#fb7185"/>
    <stop offset="75%" style="stop-color:#d946ef"/>
    <stop offset="100%" style="stop-color:#9d174d"/>
  </linearGradient>
  <linearGradient id="aurora-facet" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:rgba(255,255,255,0.60)"/>
    <stop offset="50%" style="stop-color:rgba(255,255,255,0.12)"/>
    <stop offset="100%" style="stop-color:rgba(0,0,0,0.25)"/>
  </linearGradient>
</defs>

<!-- Diamante facetado -->
<path d="M32 4 L52 18 L60 30 L32 60 L4 30 L12 18 Z"
      fill="url(#aurora-core)" stroke="#be185d" stroke-width="2"/>

<!-- Corona (facetas superiores) -->
<path d="M12 18 L22 18 L32 28 L20 30 L4 30 Z" fill="rgba(255,255,255,0.16)"/>
<path d="M22 18 L42 18 L32 28 Z" fill="rgba(255,255,255,0.26)"/>
<path d="M42 18 L52 18 L60 30 L44 30 L32 28 Z" fill="rgba(0,0,0,0.10)"/>

<!-- Pabellón (facetas inferiores) -->
<path d="M20 30 L32 28 L32 60 L14 44 Z" fill="rgba(0,0,0,0.18)"/>
<path d="M44 30 L32 28 L32 60 L50 44 Z" fill="rgba(0,0,0,0.22)"/>
<path d="M4 30 L20 30 L14 44 Z" fill="rgba(0,0,0,0.28)"/>
<path d="M60 30 L44 30 L50 44 Z" fill="rgba(0,0,0,0.26)"/>

<!-- Brillos -->
<polygon points="20,22 28,14 34,18 26,26" fill="rgba(255,255,255,0.55)"/>
<polygon points="38,20 44,14 48,18 42,24" fill="rgba(255,255,255,0.30)"/>
<polygon points="30,34 34,32 38,36 34,40" fill="rgba(255,255,255,0.14)"/>
</svg>`;

gemSVGs['corona_dios'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
    <!-- Marco de Oro Divino -->
    <linearGradient id="god-gold-frame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#fff7ed"/>
        <stop offset="30%" style="stop-color:#ffd700"/>
        <stop offset="60%" style="stop-color:#d97706"/>
        <stop offset="100%" style="stop-color:#78350f"/>
    </linearGradient>
    
    <!-- Textura Galáctica Profunda (Violeta Estelar) -->
    <radialGradient id="god-galaxy-texture" cx="50%" cy="50%" r="70%">
        <stop offset="0%" style="stop-color:#d8b4fe"/> <!-- Violeta Claro -->
        <stop offset="40%" style="stop-color:#7c3aed"/> <!-- Violeta Intenso -->
        <stop offset="100%" style="stop-color:#2e1065"/> <!-- Violeta Oscuro -->
    </radialGradient>
    
    <filter id="god-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
</defs>

<!-- Halo Orbital -->
<g opacity="0.5">
    <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="url(#god-gold-frame)" stroke-width="0.5" stroke-dasharray="1,5"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#7c3aed" stroke-width="0.3"/>
</g>

<!-- Estructura: Oro por fuera, Galaxia por dentro -->
<!-- Base -->
<path d="M 14,48 Q 32,56 50,48 L 50,42 Q 32,50 14,42 Z" fill="url(#god-galaxy-texture)" stroke="url(#god-gold-frame)" stroke-width="1.5"/>

<!-- Picos (Más bajos) -->
<path d="M 14,44 L 8,24 L 24,38 Z" fill="url(#god-galaxy-texture)" stroke="url(#god-gold-frame)" stroke-width="1.5"/>
<path d="M 50,44 L 56,24 L 40,38 Z" fill="url(#god-galaxy-texture)" stroke="url(#god-gold-frame)" stroke-width="1.5"/>
<!-- Pico central más bajo y punta más chica -->
<path d="M 22,40 L 32,10 L 42,40 Q 32,48 22,40" fill="url(#god-galaxy-texture)" stroke="url(#god-gold-frame)" stroke-width="1.5"/>

<!-- Estrellas Internas -->
<circle cx="32" cy="20" r="1" fill="#fff" opacity="0.9">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
</circle>
<circle cx="20" cy="32" r="0.8" fill="#e9d5ff" opacity="0.7"/>
<circle cx="44" cy="32" r="0.8" fill="#e9d5ff" opacity="0.7"/>

<!-- Gema Central Divina -->
<path d="M 32,25 L 38,34 L 32,44 L 26,34 Z" fill="#fff" stroke="#a855f7" stroke-width="0.5" filter="url(#god-glow)">
    <animate attributeName="fill" values="#fff;#f3e8ff;#fff" dur="3s" repeatCount="indefinite"/>
</path>

<!-- Orbes de Poder (Oro Flotante) -->
<circle cx="8" cy="18" r="2" fill="url(#god-gold-frame)" filter="url(#god-glow)">
    <animate attributeName="cy" values="18;16;18" dur="4s" repeatCount="indefinite"/>
</circle>
<circle cx="56" cy="18" r="2" fill="url(#god-gold-frame)" filter="url(#god-glow)">
    <animate attributeName="cy" values="18;16;18" dur="4s" repeatCount="indefinite" begin="0.5s"/>
</circle>
<!-- Orbe superior (el "+") más chico y bajo -->
<circle cx="32" cy="10" r="1.8" fill="url(#god-gold-frame)" filter="url(#god-glow)">
    <animate attributeName="r" values="1.8;2.2;1.8" dur="2s" repeatCount="indefinite"/>
</circle>

</svg>`;

// Amuleto Presión — collar con gema miniatura
gemSVGs['amuleto_presion'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="chain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#c9a96e"/>
    <stop offset="50%" stop-color="#a0804a"/>
    <stop offset="100%" stop-color="#7a5c30"/>
  </linearGradient>
  <linearGradient id="pendant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#4b5563"/>
    <stop offset="50%" stop-color="#1f2937"/>
    <stop offset="100%" stop-color="#000000"/>
  </linearGradient>
  <filter id="pendant-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Rope arc (brown cord with texture) -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="url(#chain-grad)" stroke-width="3.5" stroke-linecap="round"/>
<!-- Rope texture lines (subtle twists) -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="#7a5c30" stroke-width="1" stroke-dasharray="3 4" stroke-linecap="round" opacity="0.5"/>
<!-- Pendant setting (metal frame) -->
<path d="M24 38 L28 36 L32 42 L36 36 L40 38 L36 46 L32 50 L28 46 Z"
      fill="#9ca3af" stroke="#6b7280" stroke-width="1.5"/>
<!-- Sombra petrificada gem inside pendant -->
<path d="M32 38 L38 43 L36 50 L28 50 L26 43 Z"
      fill="url(#pendant-grad)" stroke="#000" stroke-width="1" filter="url(#pendant-glow)"/>
<path d="M32 38 L38 43 L32 44 Z" fill="#6b7280" opacity="0.4"/>
<path d="M32 44 L36 50 L28 50 L26 43 Z" fill="#000" opacity="0.5"/>
<!-- Shimmer -->
<path d="M29 40 L31 39 L32 41 L30 42 Z" fill="#fff" opacity="0.45"/>
<!-- Glow aura -->
<circle cx="32" cy="44" r="8" fill="rgba(75,85,99,0.2)" filter="url(#pendant-glow)">
  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite"/>
</circle>
</svg>`;

// Diamante de Presión — diamante celeste con grietas internas (forma clásica como diamante rosa)
gemSVGs['diamante_presion'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="dpres-core" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#e0f7fa"/>
    <stop offset="30%" stop-color="#4dd0e1"/>
    <stop offset="70%" stop-color="#00acc1"/>
    <stop offset="100%" stop-color="#00695c"/>
  </linearGradient>
</defs>
<!-- Diamond body (same shape as diamante_rosa) -->
<path d="M 20,12 L 44,12 L 58,26 L 32,58 L 6,26 Z" fill="url(#dpres-core)" stroke="#00695c" stroke-width="2"/>
<!-- Crown facets -->
<polygon points="20,12 44,12 32,26" fill="rgba(255,255,255,0.35)"/>
<polygon points="32,26 6,26 20,12" fill="rgba(224,247,250,0.45)"/>
<polygon points="32,26 44,12 58,26" fill="rgba(224,247,250,0.45)"/>
<!-- Pavilion facets -->
<polygon points="32,58 6,26 32,26" fill="rgba(0,150,136,0.25)"/>
<polygon points="32,26 32,38 22,32" fill="#fff" opacity="0.15"/>
<!-- Internal pressure cracks -->
<g opacity="0.5" stroke="#4dd0e1" stroke-width="1" stroke-linecap="round" fill="none">
  <path d="M24 24 L28 32 L22 40"/>
  <path d="M40 22 L36 30 L42 36"/>
  <path d="M30 34 L32 42 L28 48"/>
</g>
<!-- Highlight -->
<path d="M 24,14 L 20,18" stroke="#fff" stroke-width="2" opacity="0.5"/>
</svg>`;

// Reversita — black hole gem (Mundo 2 secret)
gemSVGs['reversita'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="rev-hole" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#000000"/>
    <stop offset="40%" stop-color="#0a0014"/>
    <stop offset="70%" stop-color="#1a0033"/>
    <stop offset="100%" stop-color="#2d004d"/>
  </radialGradient>
  <radialGradient id="rev-ring" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(168,85,247,0)"/>
    <stop offset="60%" stop-color="rgba(168,85,247,0.6)"/>
    <stop offset="100%" stop-color="rgba(139,92,246,0)"/>
  </radialGradient>
</defs>
<!-- Accretion disk -->
<ellipse cx="32" cy="32" rx="29" ry="14" fill="none" stroke="url(#rev-ring)" stroke-width="4" opacity="0.7"/>
<ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="rgba(196,130,255,0.4)" stroke-width="2"/>
<!-- Black hole core -->
<circle cx="32" cy="32" r="16" fill="url(#rev-hole)"/>
<circle cx="32" cy="32" r="16" fill="none" stroke="rgba(168,85,247,0.6)" stroke-width="1.5"/>
<!-- Light distortion arcs -->
<path d="M14 26 Q20 16 32 14" fill="none" stroke="rgba(196,130,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M50 38 Q44 48 32 50" fill="none" stroke="rgba(196,130,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
<!-- Gravitational lensing highlights -->
<path d="M20 18 Q26 12 36 14" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
<path d="M44 46 Q38 52 28 50" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
<!-- Swirling matter -->
<circle cx="16" cy="28" r="2" fill="rgba(168,85,247,0.7)"/>
<circle cx="48" cy="36" r="2" fill="rgba(196,130,255,0.6)"/>
<circle cx="22" cy="40" r="1.5" fill="rgba(139,92,246,0.5)"/>
<circle cx="42" cy="24" r="1.5" fill="rgba(139,92,246,0.5)"/>
</svg>`;

// Metal — metallic ingot gem (Mundo 2 secret)
gemSVGs['metal'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="met-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e5e7eb"/><stop offset="35%" style="stop-color:#9ca3af"/><stop offset="65%" style="stop-color:#6b7280"/><stop offset="100%" style="stop-color:#374151"/></linearGradient><linearGradient id="met-shine" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.6)"/><stop offset="100%" style="stop-color:rgba(255,255,255,0)"/></linearGradient></defs><path d="M 18,14 L 46,14 L 54,28 L 46,50 L 18,50 L 10,28 Z" fill="url(#met-grad)" stroke="#1f2937" stroke-width="1.8" stroke-linejoin="round"/><path d="M 18,14 L 46,14 L 54,28 L 10,28 Z" fill="#d1d5db" opacity="0.75"/><path d="M 18,14 L 10,28 L 18,50 L 18,14 Z" fill="#9ca3af" opacity="0.5"/><path d="M 46,14 L 54,28 L 46,50 L 46,14 Z" fill="#4b5563" opacity="0.6"/><path d="M 10,28 L 54,28 L 46,50 L 18,50 Z" fill="#374151" opacity="0.45"/><line x1="18" y1="14" x2="18" y2="50" stroke="#6b7280" stroke-width="0.8" opacity="0.5"/><line x1="46" y1="14" x2="46" y2="50" stroke="#6b7280" stroke-width="0.8" opacity="0.5"/><line x1="10" y1="28" x2="54" y2="28" stroke="#9ca3af" stroke-width="0.6" opacity="0.4"/><path d="M 22,17 L 34,17 L 30,24 L 20,24 Z" fill="url(#met-shine)" opacity="0.7"/><circle cx="24" cy="21" r="1.5" fill="rgba(255,255,255,0.5)"/><path d="M 40,17 L 44,17 L 48,24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" stroke-linecap="round"/></svg>`;

// Amuleto Focus — collar con fragmento espectral colgando
gemSVGs['amuleto_focus'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="focus-chain" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#e5e7eb"/>
    <stop offset="50%" stop-color="#9ca3af"/>
    <stop offset="100%" stop-color="#6b7280"/>
  </linearGradient>
  <linearGradient id="focus-gem" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="50%" stop-color="#d1d5db"/>
    <stop offset="100%" stop-color="#9ca3af"/>
  </linearGradient>
</defs>
<!-- Chain arc (same shape as amuleto_presion) -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="url(#focus-chain)" stroke-width="3" stroke-linecap="round"/>
<!-- Chain detail links -->
<circle cx="16" cy="17" r="1.5" fill="#d1d5db"/>
<circle cx="15" cy="23" r="1.5" fill="#d1d5db"/>
<circle cx="48" cy="17" r="1.5" fill="#d1d5db"/>
<circle cx="49" cy="23" r="1.5" fill="#d1d5db"/>
<!-- Pendant setting (metal frame) -->
<path d="M24 38 L28 36 L32 42 L36 36 L40 38 L36 46 L32 50 L28 46 Z"
      fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/>
<!-- Fragmento espectral gem (hexagonal, scaled to fit pendant) -->
<path d="M32 33 L38 37 L38 47 L32 51 L26 47 L26 37 Z"
      fill="url(#focus-gem)" stroke="#6b7280" stroke-width="1"/>
<!-- Inner facet (same style as fragmento espectral) -->
<path d="M32 35 L36 38 L36 46 L32 49 L28 46 L28 38 Z"
      fill="#f3f4f6" opacity="0.7"/>
<!-- Center vertical line -->
<path d="M32 33 L32 51" stroke="#fff" stroke-width="0.8" opacity="0.5"/>
<!-- Shimmer -->
<path d="M29 37 L31 35 L32 37 L30 39 Z" fill="#fff" opacity="0.5"/>
</svg>`;

// Amuleto Fortuna — collar de cuerda dorada con ojo de víbora miniatura (se obtiene fusionando 2 Esmeraldas)
gemSVGs['amuleto_fortuna'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="fortuna-chain" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#fbbf24"/>
    <stop offset="50%" stop-color="#d97706"/>
    <stop offset="100%" stop-color="#92400e"/>
  </linearGradient>
  <linearGradient id="fortuna-gem" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#86efac"/>
    <stop offset="50%" stop-color="#22c55e"/>
    <stop offset="100%" stop-color="#14532d"/>
  </linearGradient>
  <filter id="fortuna-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Golden rope chain -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="url(#fortuna-chain)" stroke-width="3.5" stroke-linecap="round"/>
<!-- Rope texture -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="#92400e" stroke-width="1" stroke-dasharray="3 4" stroke-linecap="round" opacity="0.5"/>
<!-- Pendant setting (golden frame) -->
<path d="M24 38 L28 36 L32 42 L36 36 L40 38 L36 46 L32 50 L28 46 Z"
      fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
<!-- Ojo de víbora gem inside pendant -->
<path d="M32 34 L38 39 L38 47 L32 51 L26 47 L26 39 Z"
      fill="url(#fortuna-gem)" stroke="#14532d" stroke-width="1" filter="url(#fortuna-glow)"/>
<!-- Snake eye pupil -->
<path d="M32 38 L33.5 43 L32 47 L30.5 43 Z" fill="#000" opacity="0.8"/>
<!-- Eye glint -->
<circle cx="30" cy="39" r="1.2" fill="#fff" opacity="0.6"/>
<!-- Glow aura -->
<circle cx="32" cy="44" r="8" fill="rgba(34,197,94,0.2)" filter="url(#fortuna-glow)">
  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite"/>
</circle>
</svg>`;

gemSVGs['amuleto_suerte'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="suerte-chain" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#e0f2fe"/>
    <stop offset="35%" stop-color="#bae6fd"/>
    <stop offset="65%" stop-color="#7dd3fc"/>
    <stop offset="100%" stop-color="#38bdf8"/>
  </linearGradient>
  <linearGradient id="suerte-chain-hi" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fff"/>
    <stop offset="100%" stop-color="#bae6fd"/>
  </linearGradient>
  <radialGradient id="suerte-clover" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#93c5fd"/>
    <stop offset="55%" stop-color="#1d4ed8"/>
    <stop offset="100%" stop-color="#1e3a8a"/>
  </radialGradient>
  <filter id="suerte-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Diamond chain -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="url(#suerte-chain)" stroke-width="3.5" stroke-linecap="round"/>
<!-- Diamond facet shimmer -->
<path d="M18 8 Q12 16 14 26 Q16 34 24 38 L32 42 L40 38 Q48 34 50 26 Q52 16 46 8"
      fill="none" stroke="url(#suerte-chain-hi)" stroke-width="1.2" stroke-dasharray="2 5" stroke-linecap="round" opacity="0.7"/>
<!-- Diamond sparkle nodes -->
<circle cx="15" cy="18" r="1.2" fill="#fff" opacity="0.8"/>
<circle cx="22" cy="32" r="1" fill="#fff" opacity="0.6"/>
<circle cx="42" cy="32" r="1" fill="#fff" opacity="0.6"/>
<circle cx="49" cy="18" r="1.2" fill="#fff" opacity="0.8"/>
<!-- Pendant setting (diamond-tinted frame) -->
<path d="M24 38 L28 36 L32 42 L36 36 L40 38 L36 46 L32 50 L28 46 Z"
      fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>
<!-- Pendant setting highlight -->
<path d="M28 36 L32 42 L36 36" fill="none" stroke="#e0f2fe" stroke-width="0.8" opacity="0.6"/>
<!-- 4-leaf clover made of sapphire — 4 ellipse petals -->
<g filter="url(#suerte-glow)">
  <ellipse cx="32" cy="39" rx="4.5" ry="6" fill="url(#suerte-clover)" stroke="#1e3a8a" stroke-width="0.8"/>
  <ellipse cx="32" cy="49" rx="4.5" ry="6" fill="url(#suerte-clover)" stroke="#1e3a8a" stroke-width="0.8"/>
  <ellipse cx="27" cy="44" rx="6" ry="4.5" fill="url(#suerte-clover)" stroke="#1e3a8a" stroke-width="0.8"/>
  <ellipse cx="37" cy="44" rx="6" ry="4.5" fill="url(#suerte-clover)" stroke="#1e3a8a" stroke-width="0.8"/>
  <!-- Center disc -->
  <circle cx="32" cy="44" r="3" fill="#1d4ed8" stroke="#172554" stroke-width="0.8"/>
  <circle cx="32" cy="44" r="1.5" fill="#93c5fd" opacity="0.6"/>
  <!-- Facet lines on petals -->
  <line x1="32" y1="34" x2="32" y2="38" stroke="#bfdbfe" stroke-width="0.5" opacity="0.5"/>
  <line x1="32" y1="50" x2="32" y2="54" stroke="#172554" stroke-width="0.5" opacity="0.4"/>
  <line x1="22" y1="44" x2="26" y2="44" stroke="#bfdbfe" stroke-width="0.5" opacity="0.5"/>
  <line x1="38" y1="44" x2="42" y2="44" stroke="#172554" stroke-width="0.5" opacity="0.4"/>
  <!-- Stem -->
  <line x1="32" y1="51" x2="32" y2="56" stroke="#1e3a8a" stroke-width="1.2" stroke-linecap="round"/>
  <!-- Shimmer highlights -->
  <circle cx="29" cy="40" r="1" fill="#fff" opacity="0.5"/>
  <circle cx="35" cy="48" r="0.8" fill="#fff" opacity="0.35"/>
</g>
<!-- Glow aura -->
<circle cx="32" cy="44" r="10" fill="rgba(29,78,216,0.18)" filter="url(#suerte-glow)">
  <animate attributeName="opacity" values="0.18;0.4;0.18" dur="2.5s" repeatCount="indefinite"/>
</circle>
</svg>`;

// --- Post-Cryo special items ---
gemSVGs['bolsa_rellena'] = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="bolsa-body" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#e9d5ff"/>
    <stop offset="50%" stop-color="#a855f7"/>
    <stop offset="100%" stop-color="#581c87"/>
  </linearGradient>
  <linearGradient id="bolsa-knot" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fbbf24"/>
    <stop offset="100%" stop-color="#b45309"/>
  </linearGradient>
</defs>
<!-- Bag body -->
<path d="M 16,28 Q 10,38 12,50 Q 14,58 32,60 Q 50,58 52,50 Q 54,38 48,28 Z" fill="url(#bolsa-body)" stroke="#581c87" stroke-width="2"/>
<!-- Bag top gathered -->
<path d="M 16,28 Q 20,22 24,26 Q 28,20 32,24 Q 36,20 40,26 Q 44,22 48,28" fill="url(#bolsa-body)" stroke="#581c87" stroke-width="1.5"/>
<!-- Rope/knot -->
<ellipse cx="32" cy="26" rx="10" ry="3" fill="none" stroke="url(#bolsa-knot)" stroke-width="2.5"/>
<!-- Sparkles emerging -->
<circle cx="26" cy="16" r="2" fill="#fcd34d" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/></circle>
<circle cx="38" cy="14" r="1.5" fill="#c084fc" opacity="0.8"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite"/></circle>
<circle cx="32" cy="10" r="2.5" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/></circle>
<!-- Bag highlights -->
<path d="M 20,34 Q 22,40 24,48" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
<path d="M 38,32 Q 40,38 42,46" stroke="rgba(255,255,255,0.15)" stroke-width="1" fill="none"/>
</svg>`;

gemSVGs['medallon_final'] = '❄️';

// ========== GAME LOGIC ==========
const PLAY_COST = 100;
const STARTING_GEMS = 1000;
const STARTING_MAX = 10000;
const POLISH_COST = 500;
const FAVOR_REWARD = 150;
const FAVOR_PENALTY = 50;
const RARITY_TITLES = {'Mítico':'🌌 ¡¡MÍTICO!!','Legendario':'👑 ¡LEGENDARIO!','Épico':'💫 ¡ÉPICO!','Raro':'✨ ¡Raro!','Secreto':'🔮 ¡SECRETO!','Celestial':'✨ ¡¡¡CELESTIAL!!!','Endgame':'🏆 ¡¡¡ENDGAME!!!'};

// Avatar border colors by gem ID (shared constant)
const SPRITE_BORDER_COLORS = {
    carbon:'rgba(74,74,74,.8)', cuarzo:'rgba(200,200,200,.8)', esmeralda:'rgba(52,211,153,.8)',
    hielita:'rgba(14,165,233,.8)', amatista:'rgba(157,78,221,.8)', topacio:'rgba(255,204,0,.8)',
    obsidiana:'rgba(41,37,36,.8)', rubi:'rgba(255,77,77,.8)', zafiro:'rgba(29,78,216,.8)',
    diamante_rosa:'rgba(236,72,153,.8)', galaxita:'rgba(124,58,237,.8)',
    gema_poder:'rgba(157,78,221,.7)',
    sol_atrapado:'rgba(255,204,0,.7)',
    corazon_rubi:'rgba(220,38,38,.7)', grieta_mal:'rgba(168,85,247,.7)',
    cryogenita:'rgba(14,165,233,.8)', aurora_cristalina:'rgba(236,72,153,.7)',
    corona_dios:'rgba(255,215,0,.9)', amuleto_focus:'rgba(139,92,246,.7)',
    amuleto_fortuna:'rgba(34,197,94,.7)', diamante_presion:'rgba(77,208,225,.7)',
    amuleto_suerte:'rgba(249,115,22,.8)',
    bolsa_rellena:'rgba(168,85,247,.8)', medallon_final:'rgba(6,182,212,.8)',
    reversita:'rgba(139,92,246,.8)', metal:'rgba(156,163,175,.8)'
};

const baseGems = [
    { id: 'carbon', emoji: '⬛', name: 'Carbón', amount: 35, rarity: 'Común', rarityClass: 'rarity-comun', neonClass: 'neon-comun', chance: 0.25 },
    { id: 'cuarzo', emoji: '🪨', name: 'Cuarzo', amount: 55, rarity: 'Común', rarityClass: 'rarity-comun', neonClass: 'neon-comun', chance: 0.20 },
    { id: 'esmeralda', emoji: '💚', name: 'Esmeralda', amount: 80, rarity: 'Poco Común', rarityClass: 'rarity-poco-comun', neonClass: 'neon-poco-comun', chance: 0.16 },
    { id: 'hielita', emoji: '🧊', name: 'Hielita', amount: 120, rarity: 'Poco Común', rarityClass: 'rarity-poco-comun', neonClass: 'neon-poco-comun', chance: 0.13 },
    { id: 'amatista', emoji: '🔮', name: 'Amatista', amount: 180, rarity: 'Raro', rarityClass: 'rarity-raro', neonClass: 'neon-raro', chance: 0.11 },
    { id: 'topacio', emoji: '🌟', name: 'Topacio', amount: 280, rarity: 'Raro', rarityClass: 'rarity-raro', neonClass: 'neon-raro', chance: 0.08 },
    { id: 'obsidiana', emoji: '🖤', name: 'Obsidiana', amount: 560, rarity: 'Épico', rarityClass: 'rarity-epico', neonClass: 'neon-epico', chance: 0.06 },
    { id: 'rubi', emoji: '❤️', name: 'Rubí', amount: 600, rarity: 'Épico', rarityClass: 'rarity-epico', neonClass: 'neon-epico', chance: 0.05 },
    { id: 'zafiro', emoji: '🔷', name: 'Zafiro', amount: 1200, rarity: 'Mítico', rarityClass: 'rarity-mitico', neonClass: 'neon-mitico', chance: 0.025 },
    { id: 'diamante_rosa', emoji: '💖', name: 'Diamante Rosa', amount: 4500, rarity: 'Legendario', rarityClass: 'rarity-legendario', neonClass: 'neon-legendario', chance: 0.01 },
    { id: 'galaxita', emoji: '🌌', name: 'Galaxita', amount: 15000, rarity: 'Legendario', rarityClass: 'rarity-legendario', neonClass: 'neon-legendario', chance: 0.007 },
    { id: 'nada', emoji: '💨', name: 'Nada', amount: 0, rarity: 'Vacío', isNothing: true }
];

// Gema especial obtenida por efecto pasivo del Amuleto Presión
const diamantePresion = { id: 'diamante_presion', emoji: '💠', name: 'Diamante de Presión', amount: 520, rarity: 'Secreto', rarityClass: 'rarity-secreto', neonClass: 'neon-secreto', isSecret: true };

// Gemas secretas exclusivas del Mundo 2
const reversita = { id: 'reversita', emoji: '🕳️', name: 'Reversita', amount: 800, rarity: 'Secreto', rarityClass: 'rarity-secreto', neonClass: 'neon-secreto', isSecret: true, world: 2 };
const metal = { id: 'metal', emoji: '🔩', name: 'Metal', amount: 680, rarity: 'Secreto', rarityClass: 'rarity-secreto', neonClass: 'neon-secreto', isSecret: true, world: 2 };

const fusionRecipes = {
    'carbon': { id: 'amuleto_presion', emoji: '📿', name: 'Amuleto Presión', baseRarity: 'Común', isAmulet: true },
    'cuarzo': { id: 'amuleto_focus', emoji: '🔍', name: 'Amuleto Focus', baseRarity: 'Común', isAmulet: true },
    'esmeralda': { id: 'amuleto_fortuna', emoji: '🍀', name: 'Amuleto Fortuna', baseRarity: 'Poco Común', isAmulet: true },
    'hielita': { id: 'cryogenita', emoji: '❄️', name: 'Cryogenita', baseRarity: 'Poco Común', isArtifact: true },
    'amatista': { id: 'gema_poder', emoji: '💜', name: 'Gema de Poder', baseRarity: 'Raro', isArtifact: true },
    'topacio': { id: 'sol_atrapado', emoji: '☀️', name: 'Sol Atrapado', baseRarity: 'Raro', isAmulet: true },
    'obsidiana': { id: 'grieta_mal', emoji: '🕳️', name: 'Grieta del Mal', baseRarity: 'Épico', isArtifact: true },
    'rubi': { id: 'corazon_rubi', emoji: '💗', name: 'Corazón de Rubí', baseRarity: 'Épico' },
    'zafiro': { id: 'amuleto_suerte', emoji: '🍀', name: 'Amuleto Suerte', baseRarity: 'Mítico', isAmulet: true },
    'diamante_rosa': { id: 'aurora_cristalina', emoji: '💫', name: 'Aurora Cristalina', baseRarity: 'Celestial' },
    'galaxita': { id: 'corona_dios', emoji: '👑', name: 'Corona de Dios', baseRarity: 'Celestial', isAmulet: true }
};

// ====== SINGULARIDADES (Compresora — Mundo 2) ======
const singularityRecipes = {
    'carbon':        { id: 'sing_carbon',        name: 'Singularidad de Carbón',        colors: ['#374151','#6b7280','#9ca3af'], glow: '#9ca3af', cost: 50 },
    'cuarzo':        { id: 'sing_cuarzo',        name: 'Singularidad de Cuarzo',        colors: ['#78716c','#a8a29e','#d6d3d1'], glow: '#d6d3d1', cost: 50 },
    'esmeralda':     { id: 'sing_esmeralda',     name: 'Singularidad de Esmeralda',     colors: ['#065f46','#10b981','#6ee7b7'], glow: '#6ee7b7', cost: 50 },
    'hielita':       { id: 'sing_hielita',       name: 'Singularidad de Hielita',       colors: ['#0369a1','#38bdf8','#bae6fd'], glow: '#bae6fd', cost: 50 },
    'amatista':      { id: 'sing_amatista',      name: 'Singularidad de Amatista',       colors: ['#6b21a8','#a855f7','#d8b4fe'], glow: '#d8b4fe', cost: 50 },
    'topacio':       { id: 'sing_topacio',       name: 'Singularidad de Topacio',       colors: ['#92400e','#f59e0b','#fde68a'], glow: '#fde68a', cost: 50 },
    'obsidiana':     { id: 'sing_obsidiana',     name: 'Singularidad de Obsidiana',     colors: ['#18181b','#3f3f46','#71717a'], glow: '#71717a', cost: 50 },
    'rubi':          { id: 'sing_rubi',          name: 'Singularidad de Rubí',          colors: ['#991b1b','#ef4444','#fca5a5'], glow: '#fca5a5', cost: 50 },
    'zafiro':        { id: 'sing_zafiro',        name: 'Singularidad de Zafiro',        colors: ['#1e3a8a','#3b82f6','#93c5fd'], glow: '#93c5fd', cost: 50 },
    'diamante_rosa': { id: 'sing_diamante_rosa', name: 'Singularidad de Diamante Rosa', colors: ['#9d174d','#ec4899','#f9a8d4'], glow: '#f9a8d4', cost: 50 },
    'galaxita':      { id: 'sing_galaxita',      name: 'Singularidad de Galaxita',      colors: ['#312e81','#6366f1','#a5b4fc'], glow: '#a5b4fc', cost: 50 },
    'reversita':     { id: 'sing_reversita',     name: 'Singularidad de Reversita',     colors: ['#1a0528','#3b0764','#7c3aed'], glow: '#8b5cf6', cost: 50 },
    'metal':         { id: 'sing_metal',         name: 'Singularidad de Metal',         colors: ['#1f2937','#6b7280','#d1d5db'], glow: '#d1d5db', cost: 50 },
};

let _singIdCounter = 0;
function getSingularitySVG(colors, glow) {
    const [dark, mid, light] = colors;
    const u = ++_singIdCounter;
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="sg-core-${u}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${light}"/>
    <stop offset="60%" stop-color="${mid}"/>
    <stop offset="100%" stop-color="${dark}"/>
  </radialGradient>
  <filter id="sg-glow-${u}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="sg-inner-${u}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2.5"/>
  </filter>
</defs>
<g filter="url(#sg-glow-${u})">
  <circle cx="32" cy="32" r="17.2" fill="url(#sg-core-${u})" stroke="${mid}" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="17.2" fill="none" stroke="${glow}" stroke-width="0.8" opacity="0.72"/>
  <ellipse cx="32" cy="32" rx="22" ry="10" fill="none" stroke="${glow}" stroke-width="1.2" opacity="0.52"/>
  <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="${glow}" stroke-width="1.2" opacity="0.52"/>
  <g filter="url(#sg-inner-${u})">
    <circle cx="32" cy="32" r="5" fill="${light}" opacity="0.35"/>
    <circle cx="32" cy="32" r="2" fill="#fff" opacity="0.4"/>
    <circle cx="27" cy="28" r="1.5" fill="rgba(255,255,255,0.15)"/>
  </g>
</g>
</svg>`;
}

// Register singularity SVGs
Object.values(singularityRecipes).forEach(r => {
    gemSVGs[r.id] = getSingularitySVG(r.colors, r.glow);
});

function isSingularityId(gemId) {
    return Object.values(singularityRecipes).some(r => r.id === gemId);
}

// Singularity quality tiers based on base gem rarity
const singularityTierByRarity = {
    'Común':      { name: 'Normal',       class: 'rarity-comun',       neon: 'neon-comun' },
    'Poco Común': { name: 'Pulida',       class: 'rarity-poco-comun',  neon: 'neon-poco-comun' },
    'Raro':       { name: 'Preciosa',     class: 'rarity-raro',        neon: 'neon-raro' },
    'Secreto':    { name: 'Dorada',       class: 'rarity-secreto',     neon: 'neon-secreto' },
    'Épico':      { name: 'Adiamantada',  class: 'rarity-epico',       neon: 'neon-epico' },
    'Mítico':     { name: 'Rose',         class: 'rarity-mitico',      neon: 'neon-mitico' },
    'Legendario': { name: 'Celestial',    class: 'rarity-celestial',   neon: 'neon-celestial' },
};
// Exception overrides by base gem id
const singularityTierOverrides = {
    'diamante_rosa': { name: 'Rose', class: 'rarity-mitico', neon: 'neon-mitico' },
};
function getSingularityTier(baseGemId) {
    if (singularityTierOverrides[baseGemId]) return singularityTierOverrides[baseGemId];
    // Find the base gem to get its rarity
    const gem = baseGems.find(g => g.id === baseGemId)
             || [reversita, metal, diamantePresion].find(g => g.id === baseGemId);
    const rarity = gem ? gem.rarity : 'Común';
    return singularityTierByRarity[rarity] || singularityTierByRarity['Común'];
}

function isFusionGemId(gemId) {
    return Object.values(fusionRecipes).some(r => r && r.id === gemId);
}

function deleteGemInstance(gemId, type) {
    if (type === 'amulet') {
        if (!gameData.amuletCounts || !gameData.amuletCounts[gemId]) return;
        // If this amulet is equipped, unequip first
        if (gameData.equippedAmulet === gemId) {
            gameData.equippedAmulet = null;
        }
        gameData.amuletCounts[gemId] = (gameData.amuletCounts[gemId] || 0) - 1;
        if (gameData.amuletCounts[gemId] <= 0) delete gameData.amuletCounts[gemId];
        updateUI();
        renderAlmacen();
        saveGame();
        return;
    }
    if (type === 'created') {
        if (!isFusionGemId(gemId)) return;
        const c = gameData.createdCounts[gemId] || 0;
        if (c <= 0) return;
        gameData.createdCounts[gemId] = c - 1;
        if (gameData.createdCounts[gemId] <= 0) delete gameData.createdCounts[gemId];
        updateUI();
        renderAlmacen();
        saveGame();
        return;
    }
}

const randomNames = ['Alexandrita','Kunzita','Tanzanita','Morganita','Espinela','Granate','Circón','Iolita','Larimar','Moldavita','Obsidiana','Labradorita','Piedra Luna','Cornalina','Calcedonia','Crisoprasa','Heliodoro','Prehnita','Rodonita','Sodalita','Sugilita','Charoita','Fluorita','Malaquita','Pirita','Rodocrosita','Serafinita','Berilo','Kornerupina','Painita'];
const randomEmojis = ['💠','🔶','🔷','⚪','🟠','🟡','🟢','🔵','💜','💛','🧡','🩵','🩷','🤍','⭐','🌸','🦋','🌺','🏵️','💮','🌙','❄️','🔥','⚡','🍀','🫧','✴️','🔆','💫','🌈'];
const rarityOrder = ['Común','Poco Común','Raro','Secreto','Épico','Mítico','Legendario','Celestial','Endgame'];
const rarityData = {
    'Común': { class: 'rarity-comun', neon: 'neon-comun' },
    'Poco Común': { class: 'rarity-poco-comun', neon: 'neon-poco-comun' },
    'Raro': { class: 'rarity-raro', neon: 'neon-raro' },
    'Secreto': { class: 'rarity-secreto', neon: 'neon-secreto' },
    'Épico': { class: 'rarity-epico', neon: 'neon-epico' },
    'Mítico': { class: 'rarity-mitico', neon: 'neon-mitico' },
    'Legendario': { class: 'rarity-legendario', neon: 'neon-legendario' },
    'Celestial': { class: 'rarity-celestial', neon: 'neon-celestial' },
    'Endgame': { class: 'rarity-endgame', neon: 'neon-endgame' }
};

const luckMultipliers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const luckPrices = [500, 1000, 2000, 3000, 5000, 7000, 9000, 10000, 12000];
const nothingProbs = [0.5, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.12, 0.10, 0.07];

function getMaxUpgradeData() {
    const current = gameData.maxGems;
    const maxCap = (gameData.world || 1) >= 2 ? 99000 : 50000;
    if (current >= maxCap) return null;
    const nextMax = Math.min(current + 10000, maxCap);
    const cost = applyFortunaDiscount(Math.floor(current * 0.66));
    return { amount: nextMax, cost: cost };
}

let createdGems = [];
let polishedGems = [];

function getDefaultGameData() {
    return {
        totalGems: STARTING_GEMS,
        maxGems: STARTING_MAX,
        almacenLevel: 0,
        luckLevel: 0,
        foundGems: {}, gemCounts: {},
        createdCounts: {}, polishedCounts: {}, singularityCounts: {},
        // Pulidas por variante (cada pulida puede tener multiplicador distinto)
        // Estructura: { [baseId]: { items: [{amount, mult, ts}], viewIndex } }
        polishedInventory: {},
        cursedGems: {},
        favorActive: false,
        totalPolished: 0,
        settingsOpened: false,
        amuletCounts: {},
        equippedAmulet: null,
        focusGemId: null,
        fortunaUpgradesBought: 0,
        settings: {
            instantTicket: false,
            infiniteGems: false
        },
        // Perfil de usuario
        profile: {
            username: 'Jugador',
            avatarGemId: null
        },
        prontoGemSlot: null,
        prontoGemActivated: false,
        // Post-cryo state
        cryoEnding: false,
        bolsaRellenaClaimed: false,
        preCryoPlata: 0,
        preCryoGems: [],
        medallonFinal: false,
        world: 1,
        proximamenteLevel: 0
    };
}

// Estado principal (usar la fábrica para crear/merge en load/reset/import)
let gameData = getDefaultGameData();

let canvas, ctx, isDrawing = false, revealed = false, canPlay = false;
let currentPrize = null, lastX, lastY, smoothX, smoothY;
let selectedFusionGem = null;
let selectedGem = null, selectedGemType = null;
let selectedPolishGem = null;
let currentAlmacenTab = 'base';
let almacenSortOrder = 'desc'; // 'asc' o 'desc'
let favorMode = false;
let currentFavorPrize = null;
let ticketStack = [];
let currentTicket = null;
let isScratching = false;
let fusionPendingCollect = false;
let winMessageOpen = false; // Bloquea compra mientras el mensaje está abierto

// ====== Pulidas por variante (evita que se "pisen" valores al pulir con distintos multiplicadores) ======
function ensurePolishedBucket(baseId) {
    if (!gameData.polishedInventory || typeof gameData.polishedInventory !== 'object') gameData.polishedInventory = {};
    if (!gameData.polishedInventory[baseId]) {
        gameData.polishedInventory[baseId] = { items: [], viewIndex: 0, userSet: false };
    }
    if (!Array.isArray(gameData.polishedInventory[baseId].items)) gameData.polishedInventory[baseId].items = [];
    if (typeof gameData.polishedInventory[baseId].viewIndex !== 'number') gameData.polishedInventory[baseId].viewIndex = 0;
    if (typeof gameData.polishedInventory[baseId].userSet !== 'boolean') gameData.polishedInventory[baseId].userSet = false;
    return gameData.polishedInventory[baseId];
}

function getPolishedItems(baseId) {
    const bucket = ensurePolishedBucket(baseId);
    return bucket.items;
}

function getPolishedViewIndex(baseId) {
    const bucket = ensurePolishedBucket(baseId);
    const max = Math.max(0, bucket.items.length - 1);
    bucket.viewIndex = Math.max(0, Math.min(max, bucket.viewIndex));
    return bucket.viewIndex;
}

function setPolishedViewIndex(baseId, idx) {
    const bucket = ensurePolishedBucket(baseId);
    const max = Math.max(0, bucket.items.length - 1);
    bucket.viewIndex = Math.max(0, Math.min(max, idx));
    bucket.userSet = true;
    // Mantener compatibilidad con contador viejo
    try { gameData.polishedCounts['pol_' + baseId] = bucket.items.length; } catch(e) {}
    saveGame();
}

function addPolishedVariant(baseId, amount, mult) {
    const bucket = ensurePolishedBucket(baseId);
    bucket.items.push({ amount: Math.round(amount), mult: Number(mult) || 1, ts: Date.now() });
    // IMPORTANTE: no saltar a la última variante automáticamente.
    // El visor debe empezar en la primera variante (index 0) y el usuario
    // navega deslizando hacia la derecha/izquierda.
    // Mantenemos el índice actual (clamp) salvo que sea la primera.
    if (bucket.items.length === 1) bucket.viewIndex = 0;
    bucket.viewIndex = getPolishedViewIndex(baseId);
    // Mantener compatibilidad con contador viejo
    gameData.polishedCounts['pol_' + baseId] = bucket.items.length;
}

function getAlmacenSellPct() { 
    const percentages = [66, 66, 70, 75, 80, 85, 90, 95, 100];
    return percentages[gameData.almacenLevel] || 100;
}
function getAlmacenUpgradeCost() { return applyFortunaDiscount(150 + gameData.almacenLevel * 150); }
function isAlmacenMaxed() { return getAlmacenSellPct() >= 100; }
function getEffectiveLuckLevel() {
    const base = gameData.luckLevel;
    return (gameData.equippedAmulet === 'amuleto_suerte') ? Math.min(base + 1, luckMultipliers.length - 1) : base;
}
function getLuckMultiplier() { return luckMultipliers[getEffectiveLuckLevel()] || 1; }
function getFusionFailChance() { return Math.round(25 - (getEffectiveLuckLevel() / 9) * 20); }
function getLuckUpgradeCost() { const base = luckPrices[gameData.luckLevel]; return base ? applyFortunaDiscount(base) : null; }
function isLuckMaxed() { return gameData.luckLevel >= 9; }
function isSuerteLuck() { return isLuckMaxed() && gameData.equippedAmulet === 'amuleto_suerte'; }

// Determina la rareza de una gema fusionada: misma que la base, excepto aurora_cristalina (Celestial) y corona_dios (Endgame)
function getFusionRarity(recipe, baseGem) {
    if (recipe?.id === 'corona_dios') return 'Endgame';
    if (recipe?.id === 'aurora_cristalina') return 'Celestial';
    return baseGem.rarity;
}

function applyFortunaDiscount(baseCost) {
    if (gameData.equippedAmulet !== 'amuleto_fortuna') return baseCost;
    const discount = 1 - (gameData.fortunaUpgradesBought * 0.0333);
    return Math.max(1, Math.round(baseCost * Math.max(0.01, discount)));
}

let gemIconCounter = 0;
const _reId = /id="([^"]+)"/g;
const _reUrl = /url\(#([^)]+)\)/g;
function getGemIcon(gem) {
    if (!gem) return '';
    if (gem.isNothing) return `<div class="gem-svg-icon">${gemSVGs['nada']}</div>`;
    let id = gem.id;
    if (id.startsWith('pol_') && gem.baseId) id = gem.baseId;
    if (gemSVGs[id]) {
        const u = ++gemIconCounter;
        const svg = gemSVGs[id].replace(_reId, `id="$1-${u}"`).replace(_reUrl, `url(#$1-${u})`);
        return `<div class="gem-svg-icon" data-gem-id="${id}">${svg}</div>`;
    }
    return `<div class="gem-text-icon">${gem.emoji}</div>`;
}

function getBannedItemsHTML() {
    const cursedGemIds = Object.keys(gameData.cursedGems || {}).filter(id => (gameData.cursedGems[id] || 0) > 0);
    if (cursedGemIds.length === 0) return '';

    // Helper to get gem price
    const getPrice = (id) => {
        const bg = baseGems.find(g => g.id === id);
        if (bg) return bg.amount;
        if (id === 'reversita') return reversita.amount;
        if (id === 'metal') return metal.amount;
        if (id === 'diamante_presion') return diamantePresion.amount;
        const cg = createdGems.find(g => g.id === id);
        return cg ? (cg.amount || 0) : 0;
    };

    // Sort by price descending (best → worst)
    cursedGemIds.sort((a, b) => getPrice(b) - getPrice(a));
    
    let html = '<div class="banned-items-container">';
    for (const gemId of cursedGemIds) {
        let gem = baseGems.find(g => g.id === gemId);
        if (!gem) gem = createdGems.find(g => g.id === gemId);
        if (!gem && gemId === 'reversita') gem = reversita;
        if (!gem && gemId === 'metal') gem = metal;
        if (!gem && gemId === 'diamante_presion') gem = diamantePresion;
        if (gem) {
            html += `<div class="banned-item-sprite">${getGemIcon(gem)}</div>`;
        }
    }
    html += '</div>';
    return html;
}

function addGems(amount) {
    gameData.totalGems = Math.min(gameData.maxGems, gameData.totalGems + amount);
    updateUI();
}

// Helpers to support reversible "infinite gems" setting without mutating totals directly
function canAfford(cost) {
    return !!(gameData.settings && gameData.settings.infiniteGems) || gameData.totalGems >= cost;
}

function spendGems(cost) {
    // Returns true if the cost was (virtually) paid. If infiniteGems is active we don't deduct.
    if (gameData.settings && gameData.settings.infiniteGems) return true;
    if (gameData.totalGems >= cost) {
        gameData.totalGems -= cost;
        return true;
    }
    return false;
}

function setProgress(pct) {
    $('progressFill').style.width = pct + '%';
}
function updateUI() {
    const totalGemsEl = $('totalGems');
    const maxGemsEl = $('maxGems');
    const godCrownEl = $('godCrown');
    const amuletVisualEl = $('equippedAmuletVisual');
    const almBtn = $('upgradeAlmacenBtn');
    const almTitle = $('almacenInfoTitle');
    const luckBtn = $('upgradeLuckBtn');
    const luckTitle = $('luckInfoTitle');
    
    // Gems display
    if (gameData.totalGems >= gameData.maxGems) {
        totalGemsEl.textContent = 'MAX';
        totalGemsEl.classList.add('gems-maxed');
        // World 2: cyan MAX glow when max upgrade is at cap (99,000)
        const maxCap = (gameData.world || 1) >= 2 ? 99000 : 50000;
        totalGemsEl.classList.toggle('gems-maxed-cyan', gameData.maxGems >= maxCap && (gameData.world || 1) >= 2);
    } else {
        totalGemsEl.textContent = gameData.totalGems.toLocaleString();
        totalGemsEl.classList.remove('gems-maxed', 'gems-maxed-cyan');
    }
    maxGemsEl.textContent = gameData.maxGems.toLocaleString();
    
    // Corona / Amuleto visual
    const expandBtnEl = document.querySelector('.gems-balance .expand-btn');
    if (gameData.equippedAmulet === 'sol_atrapado') {
        // Sol Atrapado: replaces the + button entirely
        godCrownEl.style.display = 'none';
        if (amuletVisualEl) amuletVisualEl.style.display = 'none';
        if (expandBtnEl) expandBtnEl.style.display = 'none';
        // Create or show the sol_atrapado replacement
        let solBtn = document.getElementById('solAtrapado_btn');
        if (!solBtn) {
            solBtn = document.createElement('div');
            solBtn.id = 'solAtrapado_btn';
            solBtn.className = 'sol-atrapado-btn';
            // Static version: remove SMIL animations, shrink core, dedup IDs
            const u = ++gemIconCounter;
            let staticSvg = (gemSVGs['sol_atrapado'] || '☀️')
                .replace(/<animateTransform[^/]*\/>/g, '')
                .replace(/<animate\s[^/]*\/>/g, '')
                .replace(/r="11\.5"/g, 'r="9.5"')
                .replace(_reId, `id="$1-${u}"`)
                .replace(_reUrl, `url(#$1-${u})`);
            solBtn.innerHTML = staticSvg;
            expandBtnEl.parentNode.appendChild(solBtn);
            initSolAtrapado(solBtn);
        }
        solBtn.style.display = 'flex';
    } else if (gameData.equippedAmulet === 'corona_dios') {
        godCrownEl.style.display = 'block';
        godCrownEl.innerHTML = gemSVGs['corona_dios'] || '👑';
        if (amuletVisualEl) amuletVisualEl.style.display = 'none';
        if (expandBtnEl) expandBtnEl.style.display = '';
        const solBtn = document.getElementById('solAtrapado_btn');
        if (solBtn) solBtn.style.display = 'none';
    } else if (gameData.equippedAmulet) {
        godCrownEl.style.display = 'none';
        if (amuletVisualEl) {
            amuletVisualEl.style.display = 'block';
            amuletVisualEl.innerHTML = '<div class="amulet-inner">' + (gemSVGs[gameData.equippedAmulet] || '📿') + '</div>' +
                                     '<div class="amulet-hit" title="Amuleto equipado" role="button" aria-label="Amuleto equipado"></div>';
            const hit = amuletVisualEl.querySelector('.amulet-hit');
            if (hit) {
                hit.onclick = openAmuletInfoModal;
            }
        }
        if (expandBtnEl) expandBtnEl.style.display = '';
        const solBtn = document.getElementById('solAtrapado_btn');
        if (solBtn) solBtn.style.display = 'none';
    } else {
        godCrownEl.style.display = 'none';
        if (amuletVisualEl) amuletVisualEl.style.display = 'none';
        if (expandBtnEl) expandBtnEl.style.display = '';
        const solBtn = document.getElementById('solAtrapado_btn');
        if (solBtn) solBtn.style.display = 'none';
    }
    
    // Almacén
    $('almacenInfoDesc').textContent = `Porcentaje venta ${getAlmacenSellPct()}%`;
    almBtn.classList.remove('maxed', 'compact-3', 'compact-4');
    
    if (isAlmacenMaxed()) {
        almBtn.textContent = 'MAX'; almBtn.disabled = true; almBtn.classList.add('maxed');
        almTitle.textContent = '📦 Almacén: Nivel MAX';
        almTitle.style.color = '#ffd700';
    } else {
        const cost = getAlmacenUpgradeCost();
        almBtn.textContent = cost.toLocaleString() + '🪙'; 
        almBtn.disabled = !canAfford(cost);
        almTitle.textContent = `📦 Almacén: Nivel ${gameData.almacenLevel + 1}`;
        almTitle.style.color = '';
        if (cost >= 10000) almBtn.classList.add('compact-4');
        else if (cost >= 1000) almBtn.classList.add('compact-3');
    }
    
    // Suerte
    $('luckInfoDesc').textContent = 'Gemas y fusión';
    luckBtn.classList.remove('maxed', 'compact-3', 'compact-4');
    
    if (isLuckMaxed()) {
        luckBtn.textContent = 'MAX'; 
        luckBtn.classList.add('maxed');
        if (isSuerteLuck()) {
            luckBtn.style.cssText = 'background:linear-gradient(135deg,#1d4ed8,#1e3a8a);color:#e0f2fe;cursor:default;opacity:1;';
            luckTitle.textContent = '💎 Suerte: Nivel MAX Z';
            luckTitle.style.color = '#60a5fa';
        } else {
            luckBtn.style.cssText = 'background:linear-gradient(135deg,#ffd700,#f59e0b);color:#1a0a2e;cursor:default;opacity:1;';
            luckTitle.textContent = '🍀 Suerte: Nivel MAX';
            luckTitle.style.color = '#ffd700';
        }
    } else {
        const cost = getLuckUpgradeCost();
        luckBtn.textContent = cost.toLocaleString() + '🪙'; 
        luckBtn.disabled = !canAfford(cost);
        luckBtn.style.cssText = '';
        luckTitle.textContent = `🍀 Suerte: Nivel ${gameData.luckLevel + 1}`;
        luckTitle.style.color = '';
        if (cost >= 10000) luckBtn.classList.add('compact-4');
        else if (cost >= 1000) luckBtn.classList.add('compact-3');
    }
    
    // World-specific UI
    const isW2 = (gameData.world || 1) >= 2;
    
    // Almacén upgrade: hide in world 2
    const almRow = $('upgradeAlmacenRow');
    if (almRow) almRow.style.display = isW2 ? 'none' : '';
    
    
    // Favor button: hide in world 2
    const favorBtn = $('favorBtn');
    if (favorBtn) favorBtn.style.display = isW2 ? 'none' : '';
    const favorInfo = $('favorInfo');
    if (favorInfo && isW2) favorInfo.style.display = 'none';
    
    const btn = $('newGameBtn');
    const scratchCost = gameData.equippedAmulet === 'amuleto_fortuna' ? 80 : PLAY_COST;
    btn.textContent = favorMode ? '🪙 Raspar (GRATIS)' : `🪙 Raspar (${scratchCost})🪙`;
    btn.disabled = (!favorMode && !canAfford(scratchCost)) || isScratching || winMessageOpen;
    
    // Sync circle raspar button (world 2)
    const rasparCircle = $('rasparCircleBtn');
    if (rasparCircle) {
        rasparCircle.disabled = btn.disabled;
    }
    
    if (!isW2) {
        $('favorBtn').disabled = favorMode || gameData.favorActive || isScratching || gameData.totalGems >= 300 || winMessageOpen;
    }
    
    updateGoldenBorders();
    updateTicketBorder();
    updateProfileDisplay();

    // Compressor button: celeste glow when all singularities owned
    const compBtn = $('btnCompressor');
    if (compBtn) {
        const totalRecipes = Object.keys(singularityRecipes).length;
        const ownedCount = gameData.singularityCounts
            ? Object.values(singularityRecipes).filter(r => (gameData.singularityCounts[r.id] || 0) > 0).length
            : 0;
        compBtn.classList.toggle('all-singularities', ownedCount >= totalRecipes);
    }
    
    $('instantTicket').checked = gameData.settings.instantTicket;
    updateProntoGem();
}

// ===== World Theme Application =====
function applyWorldTheme() {
    const isW2 = (gameData.world || 1) >= 2;
    document.body.classList.toggle('world-2', isW2);
    // Ensure compressor button is not visible or present in World 1
    try {
        const compWrap = document.querySelector('.compressor-wrapper');
        if (compWrap) compWrap.style.display = isW2 ? '' : 'none';
    } catch (e) {
        // ignore
    }
}

// ========== PRONTO BUTTON SYSTEM ==========
const PRONTO_GEMS = ['hielita', 'grieta_mal', 'metal'];
let prontoLongPressTimer = null;
let prontoTapBlocked = false;
let prontoContourRAF = null;

// Hielita texture (clean) fitted into obsidiana silhouette — NOT activated
function getHielitaSilhouetteSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-hiel" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#e0f2fe"/>
    <stop offset="40%" style="stop-color:#7dd3fc"/>
    <stop offset="70%" style="stop-color:#0ea5e9"/>
    <stop offset="100%" style="stop-color:#0284c7"/>
  </linearGradient>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="url(#p-hiel)" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 32,26 L 10,18 Z" fill="#f0f9ff" opacity="0.8"/>
<path d="M 10,18 L 32,26 L 6,38 Z" fill="#bae6fd" opacity="0.6"/>
<path d="M 54,18 L 58,38 L 32,26 Z" fill="#7dd3fc" opacity="0.5"/>
<path d="M 32,26 L 58,38 L 48,56 L 16,56 L 6,38 Z" fill="#0284c7" opacity="0.4"/>
<polygon points="28,14 36,14 32,22 30,18" fill="rgba(255,255,255,0.7)"/>
<path d="M 18,14 L 16,18" stroke="#fff" stroke-width="2" opacity="0.6"/>
<path d="M 46,14 L 48,18" stroke="#fff" stroke-width="2" opacity="0.6"/>
</svg>`;
}

// Cryogenita texture fitted into obsidiana silhouette — ACTIVATED version
function getCryoActivatedSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-cryo-a" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#e0f2fe"/>
    <stop offset="40%" style="stop-color:#7dd3fc"/>
    <stop offset="80%" style="stop-color:#0284c7"/>
    <stop offset="100%" style="stop-color:#0c4a6e"/>
  </linearGradient>
  <linearGradient id="p-cryo-f1" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#f0f9ff"/>
    <stop offset="100%" style="stop-color:#bae6fd"/>
  </linearGradient>
  <linearGradient id="p-cryo-f2" x1="100%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:#0ea5e9"/>
    <stop offset="100%" style="stop-color:#0369a1"/>
  </linearGradient>
  <clipPath id="p-cryo-clip">
    <path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"/>
  </clipPath>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="url(#p-cryo-a)" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M 32,4 L 10,18 L 6,38 L 24,22 Z" fill="url(#p-cryo-f1)" opacity="0.7"/>
<path d="M 32,4 L 54,18 L 58,38 L 40,18 Z" fill="#f0f9ff" opacity="0.6"/>
<path d="M 24,22 L 40,18 L 58,38 L 48,56 L 38,48 L 22,44 L 6,38 Z" fill="url(#p-cryo-a)" opacity="0.4"/>
<path d="M 6,38 L 22,44 L 16,56 L 32,60 L 38,48 Z" fill="url(#p-cryo-f2)" opacity="0.55"/>
<path d="M 58,38 L 48,56 L 32,60 L 38,48 Z" fill="rgba(12,74,110,0.5)"/>
<path d="M 30,8 L 36,6 L 42,14 L 36,16 Z" fill="#fff" opacity="0.55"/>
<path d="M 14,20 L 22,16 L 26,24 L 18,26 Z" fill="#fff" opacity="0.45"/>
<polygon points="48,22 52,26 50,32 46,28" fill="rgba(255,255,255,0.35)"/>
<line x1="32" y1="4" x2="24" y2="22" stroke="#fff" stroke-width="1.5" opacity="0.45"/>
<line x1="32" y1="4" x2="40" y2="18" stroke="#fff" stroke-width="1.5" opacity="0.5"/>
<line x1="10" y1="18" x2="6" y2="38" stroke="#0c4a6e" stroke-width="1" opacity="0.35"/>
<line x1="54" y1="18" x2="58" y2="38" stroke="#0c4a6e" stroke-width="1" opacity="0.35"/>
<!-- Snow cap on top -->
<g clip-path="url(#p-cryo-clip)">
  <path d="M 6,20 Q 12,14 18,17 Q 24,8 32,4 Q 40,8 46,14 Q 52,10 58,18 L 58,26 Q 52,20 46,22 Q 40,16 32,12 Q 24,16 18,22 Q 12,20 6,26 Z"
        fill="#fff" opacity="0.92"/>
  <path d="M 6,20 Q 12,14 18,17 Q 24,8 32,4 Q 40,8 46,14 Q 52,10 58,18"
        fill="none" stroke="#e0f2fe" stroke-width="0.8" opacity="0.5"/>
  <circle cx="32" cy="6" r="3" fill="#fff" opacity="0.9"/>
  <circle cx="16" cy="17" r="2.5" fill="#fff" opacity="0.8"/>
  <circle cx="24" cy="11" r="2" fill="#fff" opacity="0.75"/>
  <circle cx="40" cy="11" r="2.2" fill="#fff" opacity="0.8"/>
  <circle cx="50" cy="15" r="2" fill="#fff" opacity="0.7"/>
  <circle cx="20" cy="20" r="1.5" fill="#f0f9ff" opacity="0.6"/>
  <circle cx="44" cy="19" r="1.5" fill="#f0f9ff" opacity="0.6"/>
</g>
</svg>`;
}

// Grieta del Mal apagada (dark, no portal) — for Pronto button
function getGrietaApagadaSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-rift-off" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#3f3f46"/>
    <stop offset="100%" stop-color="#09090b"/>
  </linearGradient>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z" fill="url(#p-rift-off)" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 32,32 L 10,18 Z" fill="rgba(255,255,255,0.08)"/>
<path d="M 32,32 L 48,56 L 16,56 L 6,38 Z" fill="rgba(0,0,0,0.28)"/>
<path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z" fill="#050508" stroke="#12091b" stroke-width="2.7" stroke-linejoin="round"/>
<g transform="translate(32 32) scale(0.52) translate(-32 -32)" opacity="0.4">
<path d="M18 16 L24 13 L29 17 L34 15 L39 19 L45 17 L49 23 L47 30 L52 36 L47 42 L49 48 L44 51 L40 47 L35 51 L30 48 L26 53 L21 50 L17 45 L13 39 L14 33 L11 27 L14 21 Z" fill="none" stroke="rgba(63,63,70,0.3)" stroke-width="1.6" stroke-linejoin="round"/>
</g>
</svg>`;
}

// Grieta del Mal encendida (with purple portal) — ACTIVATED
function getGrietaEncendidaSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-rift-on" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#3f3f46"/>
    <stop offset="100%" stop-color="#09090b"/>
  </linearGradient>
  <radialGradient id="p-rift-p" cx="50%" cy="50%" r="65%">
    <stop offset="0%" stop-color="rgba(216,180,254,0.95)"/>
    <stop offset="35%" stop-color="rgba(168,85,247,0.85)"/>
    <stop offset="70%" stop-color="rgba(124,58,237,0.70)"/>
    <stop offset="100%" stop-color="rgba(46,16,101,0.55)"/>
  </radialGradient>
  <filter id="p-rift-gl" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z" fill="url(#p-rift-on)" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 32,32 L 10,18 Z" fill="rgba(255,255,255,0.08)"/>
<path d="M 32,32 L 48,56 L 16,56 L 6,38 Z" fill="rgba(0,0,0,0.28)"/>
<path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z" fill="#050508" stroke="#12091b" stroke-width="2.7" stroke-linejoin="round"/>
<g filter="url(#p-rift-gl)" opacity="0.95">
  <g transform="translate(32 32) scale(0.62) translate(-32 -32)">
    <path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z" fill="url(#p-rift-p)" stroke="rgba(216,180,254,0.35)" stroke-width="1.4" stroke-linejoin="round"/>
  </g>
  <g transform="translate(32 32) scale(0.46) translate(-32 -32)" opacity="0.75">
    <path d="M18 16 L24 13 L29 17 L34 15 L39 19 L45 17 L49 23 L47 30 L52 36 L47 42 L49 48 L44 51 L40 47 L35 51 L30 48 L26 53 L21 50 L17 45 L13 39 L14 33 L11 27 L14 21 Z" fill="rgba(88,28,135,0.55)" stroke="rgba(168,85,247,0.25)" stroke-width="1.2" stroke-linejoin="round"/>
  </g>
</g>
</svg>`;
}

// Grieta encendida for profile/avatar (standalone, with unique IDs)
function getGrietaEncendidaProfileSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="pr-rift-on" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#3f3f46"/>
    <stop offset="100%" stop-color="#09090b"/>
  </linearGradient>
  <radialGradient id="pr-rift-p" cx="50%" cy="50%" r="65%">
    <stop offset="0%" stop-color="rgba(216,180,254,0.95)"/>
    <stop offset="35%" stop-color="rgba(168,85,247,0.85)"/>
    <stop offset="70%" stop-color="rgba(124,58,237,0.70)"/>
    <stop offset="100%" stop-color="rgba(46,16,101,0.55)"/>
  </radialGradient>
  <filter id="pr-rift-gl" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z" fill="url(#pr-rift-on)" stroke="#000" stroke-width="3.2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 32,32 L 10,18 Z" fill="rgba(255,255,255,0.08)"/>
<path d="M 32,32 L 48,56 L 16,56 L 6,38 Z" fill="rgba(0,0,0,0.28)"/>
<path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z" fill="#050508" stroke="#12091b" stroke-width="2.7" stroke-linejoin="round"/>
<g filter="url(#pr-rift-gl)" opacity="0.95">
  <g transform="translate(32 32) scale(0.62) translate(-32 -32)">
    <path d="M16 13 L24 10 L30 15 L34 12 L40 17 L46 14 L52 22 L49 30 L55 36 L49 44 L52 51 L45 55 L40 49 L35 54 L30 50 L26 56 L20 52 L15 46 L10 39 L12 32 L8 26 L12 20 Z" fill="url(#pr-rift-p)" stroke="rgba(216,180,254,0.35)" stroke-width="1.4" stroke-linejoin="round"/>
  </g>
  <g transform="translate(32 32) scale(0.46) translate(-32 -32)" opacity="0.75">
    <path d="M18 16 L24 13 L29 17 L34 15 L39 19 L45 17 L49 23 L47 30 L52 36 L47 42 L49 48 L44 51 L40 47 L35 51 L30 48 L26 53 L21 50 L17 45 L13 39 L14 33 L11 27 L14 21 Z" fill="rgba(88,28,135,0.55)" stroke="rgba(168,85,247,0.25)" stroke-width="1.2" stroke-linejoin="round"/>
  </g>
</g>
</svg>`;
}

// Floating gem SVG for gema_poder (with unique IDs)
function getFloatingGemaPoderSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="fg-body" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#f5d0fe"/>
    <stop offset="45%" stop-color="#c084fc"/>
    <stop offset="100%" stop-color="#6d28d9"/>
  </linearGradient>
  <radialGradient id="fg-aura" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="rgba(217,70,239,0.55)"/>
    <stop offset="55%" stop-color="rgba(124,58,237,0.25)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>
  <filter id="fg-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<ellipse cx="32" cy="34" rx="22" ry="26" fill="url(#fg-aura)" filter="url(#fg-glow)">
  <animate attributeName="opacity" values="0.55;0.85;0.55" dur="2.6s" repeatCount="indefinite"/>
</ellipse>
<polygon points="32,4 46,18 46,46 32,60 18,46 18,18" fill="url(#fg-body)" stroke="#4c1d95" stroke-width="2"/>
<polygon points="32,4 46,18 32,26" fill="rgba(255,255,255,0.35)"/>
<polygon points="32,4 18,18 32,26" fill="rgba(255,255,255,0.18)"/>
<polygon points="18,18 32,26 18,46" fill="rgba(0,0,0,0.10)"/>
<polygon points="46,18 32,26 46,46" fill="rgba(0,0,0,0.18)"/>
<polygon points="18,46 32,60 32,38" fill="rgba(0,0,0,0.16)"/>
<polygon points="46,46 32,60 32,38" fill="rgba(0,0,0,0.28)"/>
<path d="M26 18 L30 14 L34 14 L30 20 Z" fill="rgba(255,255,255,0.55)"/>
<g filter="url(#fg-glow)" opacity="0.9">
  <path d="M22 34 C26 30, 30 30, 34 34 C38 38, 42 38, 46 34" fill="none" stroke="#f0abfc" stroke-width="1.6" stroke-linecap="round">
    <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.9s" repeatCount="indefinite"/>
  </path>
</g>
</svg>`;
}

// Floating cryogenita SVG (with unique IDs)
function getFloatingCryoSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="fg-cryo" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#e0f2fe"/>
    <stop offset="40%" style="stop-color:#7dd3fc"/>
    <stop offset="80%" style="stop-color:#0284c7"/>
    <stop offset="100%" style="stop-color:#0c4a6e"/>
  </linearGradient>
  <linearGradient id="fg-cryo-f1" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#f0f9ff"/>
    <stop offset="100%" style="stop-color:#bae6fd"/>
  </linearGradient>
</defs>
<path d="M 28,8 L 38,4 L 50,14 L 54,28 L 52,42 L 44,54 L 32,60 L 20,56 L 12,44 L 10,28 L 16,16 Z"
      fill="url(#fg-cryo)" stroke="#0c4a6e" stroke-width="2.5" stroke-linejoin="miter"/>
<path d="M 28,8 L 16,16 L 10,28 L 24,22 Z" fill="url(#fg-cryo-f1)" opacity="0.8"/>
<path d="M 38,4 L 50,14 L 54,28 L 40,18 Z" fill="#f0f9ff" opacity="0.7"/>
<path d="M 24,22 L 40,18 L 54,28 L 52,42 L 38,48 L 22,44 L 10,28 Z" fill="url(#fg-cryo)" opacity="0.4"/>
<path d="M 10,28 L 22,44 L 12,44 L 20,56 L 32,60 L 38,48 Z" fill="rgba(3,105,161,0.5)" opacity="0.6"/>
<path d="M 54,28 L 52,42 L 44,54 L 32,60 L 38,48 Z" fill="rgba(12,74,110,0.5)"/>
<path d="M 30,10 L 36,8 L 40,14 L 34,16 Z" fill="#fff" opacity="0.6"/>
<path d="M 18,20 L 26,18 L 28,24 L 20,26 Z" fill="#fff" opacity="0.5"/>
<line x1="28" y1="8" x2="24" y2="22" stroke="#fff" stroke-width="1.5" opacity="0.5"/>
<line x1="38" y1="4" x2="40" y2="18" stroke="#fff" stroke-width="1.5" opacity="0.6"/>
</svg>`;
}

// Metal texture fitted into obsidiana silhouette — NOT activated
function getMetalSilhouetteSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-met" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#e5e7eb"/>
    <stop offset="30%" style="stop-color:#9ca3af"/>
    <stop offset="60%" style="stop-color:#6b7280"/>
    <stop offset="100%" style="stop-color:#374151"/>
  </linearGradient>
</defs>
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="url(#p-met)" stroke="#374151" stroke-width="2" stroke-linejoin="round"/>
<path d="M 32,4 L 54,18 L 32,26 L 10,18 Z" fill="#e5e7eb" opacity="0.6"/>
<path d="M 10,18 L 32,26 L 6,38 Z" fill="#9ca3af" opacity="0.5"/>
<path d="M 54,18 L 58,38 L 32,26 Z" fill="#6b7280" opacity="0.4"/>
<path d="M 32,26 L 58,38 L 48,56 L 16,56 L 6,38 Z" fill="#374151" opacity="0.5"/>
<polygon points="28,12 36,12 34,20 30,18" fill="rgba(255,255,255,0.5)"/>
<path d="M 18,14 L 16,18" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
<path d="M 46,14 L 48,18" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
</svg>`;
}

// Metal portal — metal frame with screws in corners, reversita portal in center — ACTIVATED
function getMetalPortalSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="p-met-frame" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#d1d5db"/>
    <stop offset="50%" style="stop-color:#6b7280"/>
    <stop offset="100%" style="stop-color:#374151"/>
  </linearGradient>
  <radialGradient id="p-met-portal" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#000000"/>
    <stop offset="30%" stop-color="#0a0014"/>
    <stop offset="60%" stop-color="#1a0033"/>
    <stop offset="100%" stop-color="rgba(168,85,247,0.8)"/>
  </radialGradient>
  <radialGradient id="p-met-ring" cx="50%" cy="50%" r="55%">
    <stop offset="0%" stop-color="rgba(168,85,247,0)"/>
    <stop offset="55%" stop-color="rgba(168,85,247,0.5)"/>
    <stop offset="100%" stop-color="rgba(139,92,246,0)"/>
  </radialGradient>
  <filter id="p-met-glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="1.8" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Metal frame (obsidiana shape) -->
<path d="M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z"
      fill="url(#p-met-frame)" stroke="#1f2937" stroke-width="3" stroke-linejoin="round"/>
<!-- Metallic facets -->
<path d="M 32,4 L 54,18 L 32,26 L 10,18 Z" fill="#e5e7eb" opacity="0.35"/>
<path d="M 32,26 L 48,56 L 16,56 L 6,38 Z" fill="#1f2937" opacity="0.25"/>
<!-- Reversita portal in center -->
<g filter="url(#p-met-glow)">
  <circle cx="32" cy="32" r="16" fill="url(#p-met-portal)"/>
  <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(168,85,247,0.6)" stroke-width="1.5"/>
  <ellipse cx="32" cy="32" rx="18" ry="8" fill="none" stroke="url(#p-met-ring)" stroke-width="2.5" opacity="0.7"/>
  <ellipse cx="32" cy="32" rx="14" ry="6" fill="none" stroke="rgba(196,130,255,0.35)" stroke-width="1.2"/>
  <!-- Light distortion arcs -->
  <path d="M20 26 Q26 20 32 18" fill="none" stroke="rgba(196,130,255,0.45)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M44 38 Q38 44 32 46" fill="none" stroke="rgba(196,130,255,0.45)" stroke-width="1.2" stroke-linecap="round"/>
</g>
<!-- Swirling matter dots -->
<circle cx="26" cy="28" r="1.5" fill="rgba(168,85,247,0.6)"/>
<circle cx="38" cy="36" r="1.5" fill="rgba(196,130,255,0.5)"/>
</svg>`;
}

// Floating reversita SVG for drag-to-activate (with unique IDs)
function getFloatingReversitaSVG() {
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="fg-rev-hole" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#000000"/>
    <stop offset="40%" stop-color="#0a0014"/>
    <stop offset="70%" stop-color="#1a0033"/>
    <stop offset="100%" stop-color="#2d004d"/>
  </radialGradient>
  <radialGradient id="fg-rev-ring" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(168,85,247,0)"/>
    <stop offset="60%" stop-color="rgba(168,85,247,0.6)"/>
    <stop offset="100%" stop-color="rgba(139,92,246,0)"/>
  </radialGradient>
  <radialGradient id="fg-rev-aura" cx="50%" cy="50%" r="60%">
    <stop offset="0%" stop-color="rgba(168,85,247,0.5)"/>
    <stop offset="55%" stop-color="rgba(124,58,237,0.25)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>
  <filter id="fg-rev-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<ellipse cx="32" cy="32" rx="28" ry="28" fill="url(#fg-rev-aura)" filter="url(#fg-rev-glow)">
  <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.4s" repeatCount="indefinite"/>
</ellipse>
<!-- Accretion disk -->
<ellipse cx="32" cy="32" rx="29" ry="14" fill="none" stroke="url(#fg-rev-ring)" stroke-width="4" opacity="0.7"/>
<ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="rgba(196,130,255,0.4)" stroke-width="2"/>
<!-- Black hole core -->
<circle cx="32" cy="32" r="16" fill="url(#fg-rev-hole)"/>
<circle cx="32" cy="32" r="16" fill="none" stroke="rgba(168,85,247,0.6)" stroke-width="1.5"/>
<!-- Light distortion arcs -->
<path d="M14 26 Q20 16 32 14" fill="none" stroke="rgba(196,130,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
<path d="M50 38 Q44 48 32 50" fill="none" stroke="rgba(196,130,255,0.5)" stroke-width="1.5" stroke-linecap="round"/>
<!-- Swirling matter -->
<circle cx="16" cy="28" r="2" fill="rgba(168,85,247,0.7)"/>
<circle cx="48" cy="36" r="2" fill="rgba(196,130,255,0.6)"/>
</svg>`;
}

// ---- Pronto button input handling ----
function initProntoButton() {
    const btn = $('btnComingSoon');
    if (!btn) return;

    btn.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        prontoTapBlocked = false;

        // No gem placed → single click opens popup directly
        if (!gameData.prontoGemSlot) {
            prontoTapBlocked = true;
            openProntoPopup();
            return;
        }

        // Gem placed and not activated → short tap spawns floating gem, long-press opens menu
        if (!gameData.prontoGemActivated) {
            prontoLongPressTimer = setTimeout(function() {
                prontoTapBlocked = true;
                cancelProntoContour();
                openProntoPopup();
            }, 500);
            startProntoContour();
            return;
        }

        // Gem placed and activated → long-press (500ms) to open menu with contour anim, tap for action
        prontoLongPressTimer = setTimeout(function() {
            prontoTapBlocked = true;
            cancelProntoContour();
            openProntoPopup();
        }, 500);
        startProntoContour();
    });

    btn.addEventListener('pointerup', function(e) {
        clearTimeout(prontoLongPressTimer);
        cancelProntoContour();
        if (!prontoTapBlocked) {
            if (!gameData.prontoGemActivated && gameData.prontoGemSlot) {
                // Short tap on non-activated gem → spawn floating gem
                spawnFloatingGem(gameData.prontoGemSlot);
            } else {
                // Short tap on activated gem → Próximamente
                openProximamente(gameData.prontoGemSlot);
            }
        }
    });
    btn.addEventListener('pointerleave', function() {
        clearTimeout(prontoLongPressTimer);
        cancelProntoContour();
    });
    btn.addEventListener('pointercancel', function() {
        clearTimeout(prontoLongPressTimer);
        cancelProntoContour();
    });

    btn.removeAttribute('onclick');
}

// ---- Contour loading animation on long-press ----
function startProntoContour() {
    const btn = $('btnComingSoon');
    if (!btn) return;
    cancelProntoContour();

    const isGrieta = gameData.prontoGemSlot === 'grieta_mal';
    const isMetal = gameData.prontoGemSlot === 'metal';
    const color = isGrieta ? '#dc2626' : isMetal ? '#a855f7' : '#ffcc00';
    const glowColor = isGrieta ? 'rgba(220,38,38,0.5)' : isMetal ? 'rgba(168,85,247,0.5)' : 'rgba(255,204,0,0.5)';

    const contourSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contourSvg.setAttribute('viewBox', '0 0 64 64');
    contourSvg.setAttribute('class', 'pronto-contour-svg');
    // SVG is 80x80 centered on the 72x72 button → path renders ~4px larger per side, hugging the outer edge
    contourSvg.style.cssText = 'position:absolute;top:-4px;left:-4px;width:80px;height:80px;pointer-events:none;z-index:10;overflow:visible;';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Exact same obsidiana silhouette as the button border — the larger SVG element makes it render outside
    path.setAttribute('d', 'M 32,4 L 54,18 L 58,38 L 48,56 L 16,56 L 6,38 L 10,18 Z');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
    path.style.filter = `drop-shadow(0 0 3px ${glowColor})`;

    const totalLen = 180;
    path.setAttribute('stroke-dasharray', String(totalLen));
    path.setAttribute('stroke-dashoffset', String(totalLen));
    contourSvg.appendChild(path);
    btn.style.position = 'relative';
    btn.appendChild(contourSvg);

    const duration = 500;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        path.setAttribute('stroke-dashoffset', String(totalLen * (1 - progress)));
        if (progress < 1) {
            prontoContourRAF = requestAnimationFrame(animate);
        }
    }
    prontoContourRAF = requestAnimationFrame(animate);
}

function cancelProntoContour() {
    if (prontoContourRAF) {
        cancelAnimationFrame(prontoContourRAF);
        prontoContourRAF = null;
    }
    const btn = $('btnComingSoon');
    if (btn) {
        const old = btn.querySelector('.pronto-contour-svg');
        if (old) old.remove();
    }
}

// Popup for special gem selection
function openProntoPopup() {
    const popup = $('prontoPopup');
    if (popup.classList.contains('show')) {
        popup.classList.remove('show');
        return;
    }
    
    const container = $('prontoPopupGems');
    const removeBtn = $('prontoRemoveBtn');
    container.innerHTML = '';
    
    const inW2 = (gameData.world || 1) >= 2;
    let hasAny = false;
    PRONTO_GEMS.forEach(gemId => {
        // metal only available in W2
        if (gemId === 'metal' && !inW2) return;
        // hielita only available in W1 (not in W2)
        if (gemId === 'hielita' && inW2) return;
        // hielita and metal are base gems (gemCounts), others are created (createdCounts)
        const isBaseGem = gemId === 'hielita' || gemId === 'metal';
        const count = isBaseGem
            ? (gameData.gemCounts[gemId] || 0)
            : (gameData.createdCounts[gemId] || 0);
        if (count <= 0) return;
        hasAny = true;

        const gemWrapper = document.createElement('div');
        gemWrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center;';

        const div = document.createElement('div');
        div.className = 'pronto-popup-gem';
        if (gameData.prontoGemSlot === gemId) div.classList.add('selected');
        div.innerHTML = `<div class="gem-svg-icon">${gemSVGs[gemId] || '?'}</div>`;
        div.onclick = function(e) { e.stopPropagation(); placeProntoGem(gemId); };
        gemWrapper.appendChild(div);

        container.appendChild(gemWrapper);
    });

    // Show small X always to the right of grieta_mal (last gem = rightmost)
    if (gameData.prontoGemSlot && hasAny) {
        const xBtn = document.createElement('div');
        xBtn.className = 'pronto-popup-x';
        xBtn.innerHTML = '✕';
        xBtn.onclick = function(e) { e.stopPropagation(); removeProntoGem(); };
        container.appendChild(xBtn);
    }
    
    if (!hasAny) {
        container.innerHTML = '<div style="font-size:0.65rem;color:rgba(255,255,255,0.35);padding:4px 0;">Sin gemas disponibles</div>';
    }
    
    // Hide old remove button (using inline X now)
    removeBtn.style.display = 'none';
    popup.classList.add('show');
}

function placeProntoGem(gemId) {
    gameData.prontoGemSlot = gemId;
    gameData.prontoGemActivated = false; // reset activation when changing gem
    $('prontoPopup').classList.remove('show');
    updateProntoGem();
    saveGame();
}

function removeProntoGem() {
    gameData.prontoGemSlot = null;
    gameData.prontoGemActivated = false;
    $('prontoPopup').classList.remove('show');
    updateProntoGem();
    saveGame();
}

function updateProntoGem() {
    const btn = $('btnComingSoon');
    if (!btn) return;
    
    const old = btn.querySelector('.pronto-gem-placed');
    if (old) old.remove();
    
    const gemId = gameData.prontoGemSlot;
    const isBaseGem = gemId === 'hielita' || gemId === 'metal';
    const prontoCount = isBaseGem ? (gameData.gemCounts[gemId] || 0) : (gameData.createdCounts[gemId] || 0);
    if (gemId && prontoCount <= 0) {
        gameData.prontoGemSlot = null;
        gameData.prontoGemActivated = false;
    }
    
    if (gameData.prontoGemSlot) {
        btn.classList.add('has-gem');
        // Clear text without removing child elements
        Array.from(btn.childNodes).forEach(n => { if (n.nodeType === 3) n.remove(); });
        const wrapper = document.createElement('div');
        wrapper.className = 'pronto-gem-placed';
        
        if (gameData.prontoGemSlot === 'hielita') {
            wrapper.innerHTML = gameData.prontoGemActivated ? getCryoActivatedSVG() : getHielitaSilhouetteSVG();
        } else if (gameData.prontoGemSlot === 'grieta_mal') {
            wrapper.innerHTML = gameData.prontoGemActivated ? getGrietaEncendidaSVG() : getGrietaApagadaSVG();
        } else if (gameData.prontoGemSlot === 'metal') {
            wrapper.innerHTML = gameData.prontoGemActivated ? getMetalPortalSVG() : getMetalSilhouetteSVG();
        }
        btn.appendChild(wrapper);
    } else {
        btn.classList.remove('has-gem');
        btn.textContent = '?';
    }
}

// ---- Floating gem drag-to-activate ----
function spawnFloatingGem(slotGemId) {
    const isGrieta = slotGemId === 'grieta_mal';
    const isMetal = slotGemId === 'metal';
    // Activation gem: gema_poder for grieta, reversita for metal, cryogenita for hielita
    const activationGemId = isGrieta ? 'gema_poder' : isMetal ? 'reversita' : 'cryogenita';
    // reversita is a base gem (gemCounts), others are created (createdCounts)
    const activationCount = activationGemId === 'reversita'
        ? (gameData.gemCounts[activationGemId] || 0)
        : (gameData.createdCounts[activationGemId] || 0);
    // Check ownership
    if (activationCount <= 0) {
        // Show inline red message instead of alert
        let msg = document.createElement('div');
        msg.textContent = 'No puedes hacer esta acción todavía...';
        msg.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:rgba(220,38,38,0.9);color:#fff;padding:10px 22px;border-radius:10px;font-size:0.85rem;font-weight:600;z-index:9999;pointer-events:none;opacity:1;transition:opacity 0.5s;white-space:nowrap;text-align:center;';
        document.body.appendChild(msg);
        setTimeout(function(){ msg.style.opacity = '0'; }, 2000);
        setTimeout(function(){ msg.remove(); }, 2600);
        return;
    }
    
    const floatingSvg = isGrieta ? getFloatingGemaPoderSVG() : isMetal ? getFloatingReversitaSVG() : getFloatingCryoSVG();
    const hint = isGrieta ? 'Arrastra la Gema de Poder hacia la grieta' : isMetal ? 'Arrastra la Reversita hacia el portal' : 'Arrastra la Cryogenita hacia el botón';
    
    const overlay = document.createElement('div');
    overlay.className = 'floating-gem-overlay';
    overlay.id = 'floatingGemOverlay';
    
    const hintEl = document.createElement('div');
    hintEl.className = 'floating-gem-hint';
    hintEl.textContent = hint;
    overlay.appendChild(hintEl);
    
    const gem = document.createElement('div');
    gem.className = 'floating-gem-draggable';
    gem.innerHTML = floatingSvg;
    overlay.appendChild(gem);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✕ Cancelar';
    cancelBtn.style.cssText = 'position:absolute;bottom:50px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.8);border:1.5px solid rgba(255,255,255,0.25);border-radius:20px;padding:8px 24px;font-size:0.8rem;font-weight:600;cursor:pointer;z-index:501;backdrop-filter:blur(4px);transition:all 0.2s;';
    cancelBtn.addEventListener('pointerenter', function(){ cancelBtn.style.background='rgba(239,68,68,0.3)'; cancelBtn.style.borderColor='rgba(239,68,68,0.6)'; cancelBtn.style.color='#fca5a5'; });
    cancelBtn.addEventListener('pointerleave', function(){ cancelBtn.style.background='rgba(255,255,255,0.12)'; cancelBtn.style.borderColor='rgba(255,255,255,0.25)'; cancelBtn.style.color='rgba(255,255,255,0.8)'; });
    cancelBtn.addEventListener('click', function(e){ e.stopPropagation(); overlay.remove(); });
    overlay.appendChild(cancelBtn);

    document.body.appendChild(overlay);
    
    // Drag state
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let gemX = 0, gemY = 0;
    // Physics: velocity tracking + smooth interpolation
    let targetX = 0, targetY = 0;
    let velX = 0, velY = 0;
    let lastPointerX = 0, lastPointerY = 0;
    let lastPointerTime = 0;
    let physicsRAF = null;
    const LERP_FACTOR = 0.25; // smoothing for drag follow (0-1, lower = smoother)
    const FRICTION = 0.92; // velocity decay after release
    const SNAP_STRENGTH = 0.08; // pull toward button when near
    
    function getPointerPos(e) {
        if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }
    
    function isNearButton(x, y) {
        const btn = $('btnComingSoon');
        if (!btn) return false;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        return dist < 60;
    }

    function getButtonCenter() {
        const btn = $('btnComingSoon');
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function updateGemPosition() {
        gem.style.position = 'fixed';
        gem.style.left = (gemX - 45) + 'px';
        gem.style.top = (gemY - 45) + 'px';
        gem.style.margin = '0';
    }

    function physicsLoop() {
        if (isDragging) {
            // Smooth follow: lerp toward target (pointer position)
            const dx = targetX - gemX;
            const dy = targetY - gemY;
            gemX += dx * LERP_FACTOR;
            gemY += dy * LERP_FACTOR;

            // Magnetic pull when near target button
            const btnC = getButtonCenter();
            if (btnC && isNearButton(gemX, gemY)) {
                const pullX = btnC.x - gemX;
                const pullY = btnC.y - gemY;
                gemX += pullX * SNAP_STRENGTH;
                gemY += pullY * SNAP_STRENGTH;
            }

            updateGemPosition();

            // Update near-target visuals
            const btn = $('btnComingSoon');
            if (isNearButton(gemX, gemY)) {
                gem.classList.add('near-target');
                if (btn) btn.classList.add('drop-target-active');
            } else {
                gem.classList.remove('near-target');
                if (btn) btn.classList.remove('drop-target-active');
            }
        } else if (Math.abs(velX) > 0.3 || Math.abs(velY) > 0.3) {
            // Momentum after release (coasting)
            gemX += velX;
            gemY += velY;
            velX *= FRICTION;
            velY *= FRICTION;
            updateGemPosition();
        }

        physicsRAF = requestAnimationFrame(physicsLoop);
    }
    
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        gem.classList.add('dragging');
        gem.style.animation = 'none';
        const pos = getPointerPos(e);
        const rect = gem.getBoundingClientRect();
        offsetX = pos.x - rect.left - rect.width / 2;
        offsetY = pos.y - rect.top - rect.height / 2;
        targetX = pos.x - offsetX;
        targetY = pos.y - offsetY;
        gemX = targetX;
        gemY = targetY;
        lastPointerX = pos.x;
        lastPointerY = pos.y;
        lastPointerTime = performance.now();
        velX = 0;
        velY = 0;
        updateGemPosition();
        if (!physicsRAF) physicsRAF = requestAnimationFrame(physicsLoop);
    }
    
    function moveDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const pos = getPointerPos(e);
        targetX = pos.x - offsetX;
        targetY = pos.y - offsetY;

        // Track velocity for momentum
        const now = performance.now();
        const dt = now - lastPointerTime;
        if (dt > 0) {
            velX = (pos.x - lastPointerX) / dt * 16; // normalize to ~60fps frame
            velY = (pos.y - lastPointerY) / dt * 16;
        }
        lastPointerX = pos.x;
        lastPointerY = pos.y;
        lastPointerTime = now;
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        gem.classList.remove('dragging');
        
        const btn = $('btnComingSoon');
        if (btn) btn.classList.remove('drop-target-active');
        
        const pos = e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY };
        
        if (isNearButton(gemX, gemY)) {
            // Snap animation to button center then activate
            const btnC = getButtonCenter();
            if (btnC) {
                gem.style.transition = 'left 0.2s cubic-bezier(0.22,1,0.36,1), top 0.2s cubic-bezier(0.22,1,0.36,1), transform 0.2s ease';
                gem.style.left = (btnC.x - 45) + 'px';
                gem.style.top = (btnC.y - 45) + 'px';
                gem.style.transform = 'scale(0.5)';
                gem.style.opacity = '0.6';
            }
            // Consume 1 unit of the activation gem
            if (activationGemId === 'reversita') {
                gameData.gemCounts[activationGemId] = Math.max(0, (gameData.gemCounts[activationGemId] || 1) - 1);
            } else {
                gameData.createdCounts[activationGemId] = Math.max(0, (gameData.createdCounts[activationGemId] || 1) - 1);
            }
            gameData.prontoGemActivated = true;
            updateProntoGem();
            updateUI();
            saveGame();
            setTimeout(function() { overlay.remove(); }, 220);
        } else {
            // Cancel with momentum coast, then remove
            setTimeout(function() { overlay.remove(); }, 300);
        }
    }
    
    function cancelOverlay(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    }
    
    gem.addEventListener('pointerdown', startDrag);
    document.addEventListener('pointermove', moveDrag);
    document.addEventListener('pointerup', endDrag);
    // Delay overlay dismiss listener so the initial tap-up doesn't immediately close it on mobile
    setTimeout(function() {
        overlay.addEventListener('click', cancelOverlay);
    }, 300);
    
    // Cleanup when overlay removed
    const observer = new MutationObserver(function() {
        if (!document.body.contains(overlay)) {
            document.removeEventListener('pointermove', moveDrag);
            document.removeEventListener('pointerup', endDrag);
            if (physicsRAF) { cancelAnimationFrame(physicsRAF); physicsRAF = null; }
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true });
}

function openProximamente(gemId) {
    // Hielita activated → freeze warning instead of "Próximamente"
    if (gemId === 'hielita' && gameData.prontoGemActivated) {
        openCryoWarning();
        return;
    }
    // Metal activated → portal to World 1
    if (gemId === 'metal' && gameData.prontoGemActivated) {
        openPortalWarning();
        return;
    }
    const overlay = $('proximamenteOverlay');
    const box = $('proximamenteBox');
    box.className = 'proximamente-box ' + (gemId === 'grieta_mal' ? 'purple' : 'cyan');
    overlay.classList.add('show');
}

function closeProximamente() {
    $('proximamenteOverlay').classList.remove('show');
}

// ===== PORTAL TO WORLD 1 =====
function openPortalWarning() {
    $('portalWarnOverlay').classList.add('show');
}

function closePortalWarning() {
    $('portalWarnOverlay').classList.remove('show');
}

function confirmPortalTravel() {
    closePortalWarning();
    // Consume the metal + clear pronto slot
    gameData.prontoGemSlot = null;
    gameData.prontoGemActivated = false;
    // Switch to World 1
    gameData.world = 1;
    applyWorldTheme();
    // Auto-place hielita if player has at least 1
    if ((gameData.gemCounts['hielita'] || 0) > 0) {
        gameData.prontoGemSlot = 'hielita';
        gameData.prontoGemActivated = false;
    }
    updateProntoGem();
    updateUI();
    saveGame();
    rescaleGame();
}

// ===== CRYO FREEZE SEQUENCE =====
function openCryoWarning() {
    const overlay = $('cryoWarnOverlay');
    const mainHint = overlay.querySelector('.cryo-warn-hint-main');
    const subHint = overlay.querySelector('.cryo-warn-hint-sub');
    if (gameData.equippedAmulet === 'sol_atrapado') {
        mainHint.innerHTML = '<span style="color:#fde047;">❄️ Quizás esto sirva de algo...</span>';
        subHint.style.display = 'none';
    } else {
        mainHint.textContent = '❄️ No debería congelarme sin poder revertirlo...';
        subHint.style.display = '';
    }
    overlay.classList.add('show');
}

function closeCryoWarning() {
    $('cryoWarnOverlay').classList.remove('show');
}

function confirmCryoFreeze() {
    closeCryoWarning();
    startCryoIrisWipe();
}

// Shared cryo frost state for sol_atrapado rescue sequence
let _cryoFrost = null;

function startCryoIrisWipe() {
    const wipe = $('cryoIrisWipe');
    const canvas = document.getElementById('cryoIrisCanvas');
    const expandBtn = document.querySelector('.expand-btn');
    const solBtn = document.getElementById('solAtrapado_btn');
    if (!wipe || !canvas) return;

    // If sol_atrapado is equipped, show a clone above the frost overlay
    const SOL_CLONE_Y_OFFSET = 2; // px — slight vertical adjustment
    if (solBtn && gameData.equippedAmulet === 'sol_atrapado') {
        const r = solBtn.getBoundingClientRect();
        const clone = solBtn.cloneNode(true);
        clone.id = 'solAtrapado_frostClone';
        // Use fixed positioning in the viewport and copy size from source rect
        clone.style.position = 'fixed';
        clone.style.display = 'flex';
        clone.style.left = r.left + 'px';
        clone.style.top = (r.top + SOL_CLONE_Y_OFFSET) + 'px';
        clone.style.width = r.width + 'px';
        clone.style.height = r.height + 'px';
        clone.style.zIndex = '3';
        clone.style.pointerEvents = 'none';
        wipe.appendChild(clone);

        // If the amulet avatar elsewhere uses a vertical transform (e.g. translateY for amulets),
        // apply the same vertical offset so the clone visually lines up with the original.
        try {
            const amuletSample = document.querySelector('.profile-avatar .avatar-gem.avatar-amulet');
            if (amuletSample) {
                const cs = getComputedStyle(amuletSample);
                const tr = cs.transform || '';
                let ty = 0;
                const m = tr.match(/matrix\(([^)]+)\)/);
                if (m) {
                    const parts = m[1].split(',').map(s => parseFloat(s));
                    // matrix(a, b, c, d, tx, ty)
                    if (parts.length >= 6) ty = parts[5] || 0;
                } else {
                    const m2 = tr.match(/translate\(([^)]+)\)/);
                    if (m2) {
                        const vals = m2[1].split(',').map(s => parseFloat(s));
                        ty = vals.length >= 2 ? vals[1] : (vals[0] || 0);
                    }
                }
                if (ty) {
                    clone.style.top = (r.top + ty + SOL_CLONE_Y_OFFSET) + 'px';
                }
            }
        } catch (e) { /* ignore */ }
    }

    // Work at CSS pixel resolution (canvas CSS stretches to fill)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.width = vw;
    canvas.height = vh;
    const c = canvas.getContext('2d');

    // The + button center — the last place to freeze (frost slows near it)
    // When sol_atrapado is equipped, use its position instead
    let bx = vw / 2, by = vh * 0.15; // fallback
    let slowRadius = 180;
    const refBtn = (solBtn && gameData.equippedAmulet === 'sol_atrapado') ? solBtn : expandBtn;
    if (refBtn) {
        const btnRect = refBtn.getBoundingClientRect();
        bx = btnRect.left + btnRect.width / 2;
        by = btnRect.top + btnRect.height / 2;
        slowRadius = Math.max(180, btnRect.width * 10);
    }

    // ---- Frost simulation grid ----
    const cellSize = 4; // px per cell — small = detailed
    const cols = Math.ceil(vw / cellSize);
    const rows = Math.ceil(vh / cellSize);
    const total = cols * rows;

    // Per-cell state: 0 = unfrozen, >0 = frozen (value = opacity 0.0-1.0)
    const frost = new Float32Array(total);     // opacity
    const frostAge = new Float32Array(total);  // when it froze (0-1 normalized time)
    const queued = new Uint8Array(total);      // in growth queue?

    // Crystal branch data — long dendritic shoots
    const branches = [];

    // Noise function for organic shapes (simple value noise)
    function hash(x, y) {
        let h = x * 374761393 + y * 668265263;
        h = (h ^ (h >> 13)) * 1274126177;
        return (h ^ (h >> 16)) & 0x7fffffff;
    }
    function noise2d(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix, fy = y - iy;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
        const n00 = hash(ix, iy) / 0x7fffffff;
        const n10 = hash(ix + 1, iy) / 0x7fffffff;
        const n01 = hash(ix, iy + 1) / 0x7fffffff;
        const n11 = hash(ix + 1, iy + 1) / 0x7fffffff;
        return (n00 * (1 - sx) + n10 * sx) * (1 - sy) + (n01 * (1 - sx) + n11 * sx) * sy;
    }
    function fbm(x, y) {
        return noise2d(x, y) * 0.5 + noise2d(x * 2.3, y * 2.3) * 0.3 + noise2d(x * 5.1, y * 5.1) * 0.2;
    }

    // Distance from + button center in pixels
    function distFromBtn(col, row) {
        const px = col * cellSize + cellSize / 2;
        const py = row * cellSize + cellSize / 2;
        return Math.sqrt((px - bx) ** 2 + (py - by) ** 2);
    }

    // Growth queue — random consumption for organic spread
    let growthQueue = [];
    function enqueue(col, row) {
        const idx = row * cols + col;
        if (queued[idx] || frost[idx] > 0) return;
        queued[idx] = 1;
        growthQueue.push(row * cols + col);
    }
    function dequeue() {
        if (growthQueue.length === 0) return null;
        // Pick a random item from the queue for organic spread
        const i = Math.floor(Math.random() * growthQueue.length);
        const val = growthQueue[i];
        // Swap with last and pop (O(1) removal)
        growthQueue[i] = growthQueue[growthQueue.length - 1];
        growthQueue.pop();
        const col = val % cols;
        const row = (val - col) / cols;
        return { col, row };
    }
    function queueSize() { return growthQueue.length; }

    // Seed edges — all border cells
    for (let col = 0; col < cols; col++) {
        enqueue(col, 0);
        enqueue(col, rows - 1);
    }
    for (let row = 0; row < rows; row++) {
        enqueue(0, row);
        enqueue(cols - 1, row);
    }
    // Extra random seeds near edges for density
    for (let i = 0; i < 200; i++) {
        const side = Math.floor(Math.random() * 4);
        let col, row;
        if (side === 0) { col = Math.floor(Math.random() * cols); row = Math.floor(Math.random() * 8); }
        else if (side === 1) { col = Math.floor(Math.random() * cols); row = rows - 1 - Math.floor(Math.random() * 8); }
        else if (side === 2) { col = Math.floor(Math.random() * 8); row = Math.floor(Math.random() * rows); }
        else { col = cols - 1 - Math.floor(Math.random() * 8); row = Math.floor(Math.random() * rows); }
        enqueue(col, row);
    }

    // How many cells to freeze per frame
    const totalCells = cols * rows;
    const duration = 5000; // ms total
    const framesExpected = duration / 16.67;
    const cellsPerFrame = Math.ceil(totalCells / framesExpected) + 4;

    let frozenCount = 0;
    let animTime = 0;

    wipe.classList.add('active');
    const startTime = performance.now();

    // ---- Crystal branch system ----
    function spawnBranch(col, row) {
        const angle = Math.random() * Math.PI * 2;
        const len = 15 + Math.random() * 40;
        branches.push({ col, row, angle, len, pos: 0, speed: 0.8 + Math.random() * 1.5 });
    }

    function growBranches() {
        for (let i = branches.length - 1; i >= 0; i--) {
            const br = branches[i];
            br.pos += br.speed;
            if (br.pos >= br.len) { branches.splice(i, 1); continue; }
            const nc = Math.round(br.col + Math.cos(br.angle) * br.pos);
            const nr = Math.round(br.row + Math.sin(br.angle) * br.pos);
            if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
                const idx = nr * cols + nc;
                // Slowdown near + button — branches much less likely to advance
                const d = distFromBtn(nc, nr);
                if (d < slowRadius) {
                    const proximity = 1 - d / slowRadius; // 1 at center, 0 at edge
                    // Cubic slowdown — extremely slow near center
                    const skipChance = proximity * proximity * proximity * 0.99;
                    if (Math.random() < skipChance) continue;
                }
                if (frost[idx] === 0) {
                    const n = fbm(nc * 0.08, nr * 0.08);
                    frost[idx] = 0.35 + n * 0.45;
                    frostAge[idx] = animTime;
                    frozenCount++;
                    // Side branches
                    if (Math.random() < 0.12) {
                        const sideAngle = br.angle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.8);
                        branches.push({ col: nc, row: nr, angle: sideAngle, len: 5 + Math.random() * 15, pos: 0, speed: 0.5 + Math.random() * 1 });
                    }
                    // Enqueue neighbors for organic fill
                    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                    for (const [dc, dr] of dirs) {
                        const c2 = nc + dc, r2 = nr + dr;
                        if (c2 >= 0 && c2 < cols && r2 >= 0 && r2 < rows) {
                            enqueue(c2, r2);
                        }
                    }
                }
            }
            // Slight angle wobble for organic look
            br.angle += (Math.random() - 0.5) * 0.15;
        }
    }

    // ---- Main growth step ----
    function growStep(t) {
        animTime = t;

        let grown = 0;
        const maxGrow = cellsPerFrame + Math.floor(t * 8); // accelerate over time

        while (grown < maxGrow && queueSize() > 0) {
            const item = dequeue();
            if (!item) break;
            const { col, row } = item;
            const idx = row * cols + col;

            if (frost[idx] > 0) continue; // already frozen

            // Gradual slowdown near + button — much more pronounced near center
            const d = distFromBtn(col, row);
            if (d < slowRadius) {
                const proximity = 1 - d / slowRadius; // 1 at center, 0 at edge
                // Cubic slowdown: at center ~99% skip, dramatic deceleration
                const skipChance = proximity * proximity * proximity * 0.99;
                if (Math.random() < skipChance) {
                    queued[idx] = 0;
                    enqueue(col, row); // put it back for later
                    continue;
                }
            }

            // Freeze this cell
            const n = fbm(col * 0.06, row * 0.06);
            const edgeFade = Math.min(1, d / (slowRadius * 1.5)); // thinner near + button
            frost[idx] = (0.3 + n * 0.5 + Math.random() * 0.2) * Math.min(1, edgeFade + 0.3);
            frostAge[idx] = t;
            frozenCount++;
            grown++;

            // Spawn crystal branch occasionally
            if (Math.random() < 0.005 + t * 0.003) {
                spawnBranch(col, row);
            }

            // Enqueue neighbors with organic spread pattern
            // 8-directional with bias — diagonal less likely
            const dirs8 = [[-1,0,1],[1,0,1],[0,-1,1],[0,1,1],[-1,-1,0.5],[1,-1,0.5],[-1,1,0.5],[1,1,0.5]];
            for (const [dc, dr, prob] of dirs8) {
                if (Math.random() > prob * 0.85) continue; // skip some for irregularity
                const c2 = col + dc, r2 = row + dr;
                if (c2 >= 0 && c2 < cols && r2 >= 0 && r2 < rows) {
                    enqueue(c2, r2);
                }
            }
        }

        growBranches();
    }

    // Pre-allocate ImageData for rendering
    const imgData = c.createImageData(vw, vh);

    // ---- Render the frost ----
    function renderFrost() {
        const data = imgData.data;
        // Clear previous frame data for unfrozen cells
        data.fill(0);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const idx = row * cols + col;
                const f = frost[idx];
                if (f <= 0) continue;

                const age = frostAge[idx];
                // Color: mix of white, light blue, and blue based on noise
                const n = fbm(col * 0.12 + 1.1, row * 0.12 + 2.2);
                const n2 = fbm(col * 0.25 + 5.5, row * 0.25 + 8.8);

                // Base ice colors interpolated
                let r, g, b;
                if (n2 > 0.6) {
                    // White frost (crystalline highlights)
                    r = 210 + Math.floor(n * 45); g = 230 + Math.floor(n * 25); b = 245;
                } else if (n2 > 0.3) {
                    // Light blue frost
                    r = 160 + Math.floor(n * 40); g = 200 + Math.floor(n * 30); b = 230 + Math.floor(n * 20);
                } else {
                    // Deeper blue-grey frost
                    r = 100 + Math.floor(n * 50); g = 150 + Math.floor(n * 40); b = 200 + Math.floor(n * 30);
                }

                // Opacity: thicker frost = more opaque
                const alpha = Math.floor(f * 255 * 0.92);

                // Fill the cell's pixels
                const px0 = col * cellSize;
                const py0 = row * cellSize;
                for (let dy = 0; dy < cellSize && (py0 + dy) < vh; dy++) {
                    for (let dx = 0; dx < cellSize && (px0 + dx) < vw; dx++) {
                        const pi = ((py0 + dy) * vw + (px0 + dx)) * 4;
                        data[pi] = r;
                        data[pi + 1] = g;
                        data[pi + 2] = b;
                        data[pi + 3] = alpha;
                    }
                }
            }
        }

        c.putImageData(imgData, 0, 0);

        // Draw crystal veins / dendrite lines on top
        c.save();
        c.globalAlpha = 0.35;
        c.strokeStyle = '#e0f2fe';
        c.lineWidth = 1;
        for (let row = 1; row < rows - 1; row++) {
            for (let col = 1; col < cols - 1; col++) {
                const idx = row * cols + col;
                if (frost[idx] <= 0) continue;
                // Draw vein if there's a sharp opacity gradient
                const right = frost[idx + 1] || 0;
                const down = frost[(row + 1) * cols + col] || 0;
                if (Math.abs(frost[idx] - right) > 0.25 || Math.abs(frost[idx] - down) > 0.25) {
                    const px = col * cellSize + cellSize / 2;
                    const py = row * cellSize + cellSize / 2;
                    c.beginPath();
                    c.moveTo(px, py);
                    if (Math.abs(frost[idx] - right) > Math.abs(frost[idx] - down)) {
                        c.lineTo(px + cellSize, py + (Math.random() - 0.5) * 2);
                    } else {
                        c.lineTo(px + (Math.random() - 0.5) * 2, py + cellSize);
                    }
                    c.stroke();
                }
            }
        }
        c.restore();

        // Bright crystalline highlights (sparse)
        c.save();
        c.globalAlpha = 0.5;
        for (let i = 0; i < 60; i++) {
            const col = Math.floor(Math.random() * cols);
            const row = Math.floor(Math.random() * rows);
            if (frost[row * cols + col] < 0.5) continue;
            const px = col * cellSize + cellSize / 2;
            const py = row * cellSize + cellSize / 2;
            const sz = 1 + Math.random() * 3;
            c.fillStyle = '#f0f9ff';
            c.globalAlpha = 0.2 + Math.random() * 0.3;
            c.beginPath();
            // 6-pointed star shape
            for (let a = 0; a < 6; a++) {
                const ang = a * Math.PI / 3 - Math.PI / 2;
                const x2 = px + Math.cos(ang) * sz;
                const y2 = py + Math.sin(ang) * sz;
                c.moveTo(px, py);
                c.lineTo(x2, y2);
            }
            c.stroke();
        }
        c.restore();
    }

    // ---- Animation loop ----
    function animate(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        growStep(t);
        renderFrost();

        if (queueSize() > 0 || branches.length > 0) {
            requestAnimationFrame(animate);
        } else {
            // Frost has naturally covered everything
            renderFrost();
            // Save frost state for potential sol_atrapado rescue
            _cryoFrost = { frost, cols, rows, cellSize, vw, vh, canvas, c: canvas.getContext('2d'), imgData, bx, by, fbm };
            setTimeout(() => freezeProntoButton(), 400);
        }
    }

    requestAnimationFrame(animate);
    }

    function freezeProntoButton() {
    if (gameData.equippedAmulet === 'sol_atrapado') {
        // Sol Atrapado rescue — don't show game over
        setTimeout(() => startSolAtrapado_rescue(), 1200);
    } else {
        // Normal cryo ending
        setTimeout(() => showCryoGameOver(), 1200);
    }
}

function showCryoGameOver() {
    const wipe = $('cryoIrisWipe');
    if (!wipe) return;
    
    // Create the narrative text directly over the frost canvas
    const goContainer = document.createElement('div');
    goContainer.className = 'cryo-go-container';

    // Build elements with staggered reveal
    const narrative = document.createElement('div');
    narrative.className = 'cryo-go-narrative';
    narrative.textContent = 'Decidiste cryogenizarte en busca de encontrar mejores cosas en el futuro... pero por la falta de una fuente de calor cercana nunca lograste descongelarte.';
    narrative.style.opacity = '0';
    narrative.style.transform = 'translateY(8px)';
    narrative.style.transition = 'opacity 2s ease, transform 2s ease';

    const divider = document.createElement('div');
    divider.className = 'cryo-go-divider';
    divider.style.opacity = '0';
    divider.style.transition = 'opacity 2.5s ease';

    const epilogue = document.createElement('div');
    epilogue.className = 'cryo-go-epilogue';
    epilogue.textContent = 'Pasaste a la eternidad, poco a poco te fuiste convirtiendo en una leyenda, pero eventualmente te olvidaron.';
    epilogue.style.opacity = '0';
    epilogue.style.transform = 'translateY(8px)';
    epilogue.style.transition = 'opacity 2s ease, transform 2s ease';

    const btn = document.createElement('button');
    btn.className = 'cryo-go-accept-btn';
    btn.textContent = 'Aceptar Final';
    btn.onclick = acceptCryoFinal;
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(6px)';
    btn.style.transition = 'opacity 1.5s ease, transform 1.5s ease, background 0.4s, color 0.4s, border-color 0.4s, box-shadow 0.4s';

    goContainer.appendChild(narrative);
    goContainer.appendChild(divider);
    goContainer.appendChild(epilogue);
    goContainer.appendChild(btn);
    wipe.appendChild(goContainer);

    // Stagger the reveal
    requestAnimationFrame(() => {
        goContainer.classList.add('visible');
        setTimeout(() => { narrative.style.opacity = '1'; narrative.style.transform = 'translateY(0)'; }, 400);
        setTimeout(() => { divider.style.opacity = '1'; }, 1200);
        setTimeout(() => { epilogue.style.opacity = '1'; epilogue.style.transform = 'translateY(0)'; }, 1800);
        setTimeout(() => { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }, 3000);
    });
}

function acceptCryoFinal() {
    // Remove the frost overlay (also removes the sol_atrapado clone if any)
    const wipe = $('cryoIrisWipe');
    if (wipe) { wipe.classList.remove('active'); wipe.innerHTML = '<canvas id="cryoIrisCanvas"></canvas>'; }

    // --- Save pre-cryo data before reset ---
    const savedProfile = gameData.profile ? { ...gameData.profile } : { username: 'Jugador', avatarGemId: null };
    const savedPlata = gameData.totalGems || 0;
    // Collect all gem types the player had (base + created + amulets)
    const ownedGemTypes = [];
    // Base gems
    baseGems.filter(g => !g.isNothing).forEach(g => {
        if ((gameData.gemCounts[g.id] || 0) > 0) ownedGemTypes.push(g.id);
    });
    // Diamante de presión (special base-like gem)
    if ((gameData.gemCounts['diamante_presion'] || 0) > 0) ownedGemTypes.push('diamante_presion');
    // World 2 secret gems
    if ((gameData.gemCounts['reversita'] || 0) > 0) ownedGemTypes.push('reversita');
    if ((gameData.gemCounts['metal'] || 0) > 0) ownedGemTypes.push('metal');
    // Created/fusion gems (non-amulet)
    Object.keys(gameData.createdCounts || {}).forEach(id => {
        if ((gameData.createdCounts[id] || 0) > 0 && !ownedGemTypes.includes(id)) ownedGemTypes.push(id);
    });
    // Amulets
    Object.keys(gameData.amuletCounts || {}).forEach(id => {
        if ((gameData.amuletCounts[id] || 0) > 0 && !ownedGemTypes.includes(id)) ownedGemTypes.push(id);
    });
    // Reset the game directly (no confirmation needed — the cryo ending IS the confirmation)
    (gameBridge ? gameBridge.clearLocal() : localStorage.removeItem('raspadita_gemas_save'));
    createdGems = [];
    polishedGems = [];
    resetCheatState();
    gameData = getDefaultGameData();

    // --- Restore preserved data ---
    gameData.profile = savedProfile;
    gameData.cryoEnding = true;
    gameData.preCryoPlata = savedPlata;
    gameData.preCryoGems = ownedGemTypes;
    // bolsaRellenaClaimed resets to false — bolsa rellena can appear once per cryo cycle
    gameData.medallonFinal = true;

    // Give 1 hielita and 1 gema_poder as starting items
    gameData.gemCounts['hielita'] = 1;
    gameData.foundGems['hielita'] = true;
    gameData.createdCounts['gema_poder'] = 1;

    // Register gema_poder in the createdGems catalog so it shows in almacén
    const gpRecipe = fusionRecipes['amatista']; // gema_poder recipe
    const gpBase = baseGems.find(g => g.id === 'amatista');
    if (gpRecipe && gpBase) {
        const gpRarity = getFusionRarity(gpRecipe, gpBase);
        const gpRd = rarityData[gpRarity] || {};
        createdGems.push({
            id: gpRecipe.id, emoji: gpRecipe.emoji, name: gpRecipe.name,
            amount: gpBase.amount * 2, rarity: gpRarity,
            rarityClass: gpRd.class, neonClass: gpRd.neon,
            isArtifact: true
        });
    }

    favorMode = false;
    currentFavorPrize = null;
    ticketStack = [];
    currentTicket = null;
    isScratching = false;
    fusionPendingCollect = false;
    canPlay = false;
    revealed = false;
    canvas = null;
    ctx = null;
    const card = $('scratchCard');
    card.innerHTML = '<div class="empty-ticket-message">🎫 Compra un ticket para jugar</div>';
    card.classList.remove('broken');
    setProgress(0);
    $('favorBtn').classList.remove('active');
    $('favorInfo').style.display = 'none';
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    $('winMessage').classList.remove('show');
    applyWorldTheme();
    updateUI();
    saveGame();
}

// ---- Sol Atrapado Cryo Rescue Sequence ----
function startSolAtrapado_rescue() {
    const wipe = $('cryoIrisWipe');
    if (!wipe || !_cryoFrost) return;
    const { frost, cols, rows, cellSize, vw, vh, canvas, fbm } = _cryoFrost;
    const ctx = canvas.getContext('2d');

    // Find the sol_atrapado clone position (center of melt)
    const clone = document.getElementById('solAtrapado_frostClone');
    let cx = vw / 2, cy = vh * 0.15;
    if (clone) {
        const r = clone.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2;
    }

    // ---- Phase 1: White flash + solidify ice simultaneously ----
    const flash = document.createElement('div');
    flash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;opacity:0;z-index:5;transition:opacity 1.5s ease;pointer-events:none;';
    wipe.appendChild(flash);

    // Fade in white flash
    requestAnimationFrame(() => { flash.style.opacity = '1'; });

    // Solidify ice during the flash fade-in
    const solidifyStart = performance.now();
    const solidifyDur = 1500; // match flash fade-in duration
    function solidifyStep(now) {
        const t = Math.min(1, (now - solidifyStart) / solidifyDur);
        for (let i = 0; i < frost.length; i++) {
            if (frost[i] > 0) frost[i] = Math.min(1, frost[i] + 0.4 * t);
        }
        renderSolFrost(ctx, frost, cols, rows, cellSize, vw, vh, fbm, 1);
        if (t < 1) requestAnimationFrame(solidifyStep);
    }
    requestAnimationFrame(solidifyStep);

    setTimeout(() => {
        // ---- Phase 2: While flash is fully opaque, transition to World 2 ----
        if ((gameData.world || 1) < 2) {
            gameData.world = 2;
        }
        applyWorldTheme();
        updateUI();
        saveGame();

        // Reposition clone to where sol_atrapado_btn is now in W2 layout
        const SOL_CLONE_Y_OFFSET_2 = 2; // px — slight vertical adjustment
        if (clone) {
            const solBtn = document.getElementById('solAtrapado_btn');
            if (solBtn) {
                const r2 = solBtn.getBoundingClientRect();
                    clone.style.left = r2.left + 'px';
                    clone.style.top = (r2.top + SOL_CLONE_Y_OFFSET_2) + 'px';
                    clone.style.width = r2.width + 'px';
                    clone.style.height = r2.height + 'px';
                    // If profile amulet element uses a translateY, apply same vertical offset
                    try {
                        const amuletSample = document.querySelector('.profile-avatar .avatar-gem.avatar-amulet');
                        if (amuletSample) {
                            const cs = getComputedStyle(amuletSample);
                            const tr = cs.transform || '';
                            let ty = 0;
                            const m = tr.match(/matrix\(([^)]+)\)/);
                            if (m) {
                                const parts = m[1].split(',').map(s => parseFloat(s));
                                if (parts.length >= 6) ty = parts[5] || 0;
                            } else {
                                const m2 = tr.match(/translate\(([^)]+)\)/);
                                if (m2) {
                                    const vals = m2[1].split(',').map(s => parseFloat(s));
                                    ty = vals.length >= 2 ? vals[1] : (vals[0] || 0);
                                }
                            }
                            if (ty) {
                                clone.style.top = (r2.top + ty + SOL_CLONE_Y_OFFSET_2) + 'px';
                            }
                        }
                    } catch (e) { /* ignore */ }
                    // Update melt center to new position (use clone's center)
                    const crect = clone.getBoundingClientRect();
                    cx = crect.left + crect.width / 2;
                    cy = crect.top + crect.height / 2;
            }
        }

        // ---- Phase 3: Flash fades out, reveal solid ice (now in W2 theme) ----
        flash.style.transition = 'opacity 2s ease';
        flash.style.opacity = '0';

        setTimeout(() => {
            flash.remove();

            // ---- Phase 4: Sol regains animation + crack ----
            if (clone) {
                // Replace clone SVG with animated version (re-enable SMIL)
                const u = ++gemIconCounter;
                const animSvg = gemSVGs['sol_atrapado']
                    .replace(_reId, `id="$1-${u}"`)
                    .replace(_reUrl, `url(#$1-${u})`);
                clone.innerHTML = animSvg;

                // Add crack overlay
                const crack = document.createElement('div');
                crack.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
                crack.innerHTML = `<svg viewBox="0 0 64 64" style="width:100%;height:100%;" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 8 L34 20 L30 26 L35 32 L28 38 L33 46 L30 58"
                          fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"
                          stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="60">
                        <animate attributeName="stroke-dashoffset" from="60" to="0" dur="0.8s" fill="freeze"/>
                    </path>
                    <path d="M30 26 L22 30" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1"
                          stroke-dasharray="12" stroke-dashoffset="12">
                        <animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.4s" begin="0.5s" fill="freeze"/>
                    </path>
                    <path d="M35 32 L42 28" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1"
                          stroke-dasharray="10" stroke-dashoffset="10">
                        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.4s" begin="0.6s" fill="freeze"/>
                    </path>
                </svg>`;
                clone.style.position = 'fixed';
                clone.style.overflow = 'visible';
                clone.appendChild(crack);
            }

            // ---- Phase 5: Melt ice radiating from sol_atrapado (after crack draws) ----
            setTimeout(() => startSolMelt(wipe, frost, cols, rows, cellSize, vw, vh, ctx, fbm, cx, cy, clone), 1200);

        }, 2000); // after flash fades
    }, 2000); // flash hold time
}

function renderSolFrost(ctx, frost, cols, rows, cellSize, vw, vh, fbm, opacityMul) {
    const imgData = ctx.createImageData(vw, vh);
    const data = imgData.data;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const idx = row * cols + col;
            const f = frost[idx];
            if (f <= 0) continue;

            const n = fbm(col * 0.12 + 1.1, row * 0.12 + 2.2);
            const n2 = fbm(col * 0.25 + 5.5, row * 0.25 + 8.8);

            let r, g, b;
            if (n2 > 0.6) {
                r = 210 + Math.floor(n * 45); g = 230 + Math.floor(n * 25); b = 245;
            } else if (n2 > 0.3) {
                r = 160 + Math.floor(n * 40); g = 200 + Math.floor(n * 30); b = 230 + Math.floor(n * 20);
            } else {
                r = 100 + Math.floor(n * 50); g = 150 + Math.floor(n * 40); b = 200 + Math.floor(n * 30);
            }

            const alpha = Math.floor(f * 255 * opacityMul);
            const px0 = col * cellSize;
            const py0 = row * cellSize;
            for (let dy = 0; dy < cellSize && (py0 + dy) < vh; dy++) {
                for (let dx = 0; dx < cellSize && (px0 + dx) < vw; dx++) {
                    const pi = ((py0 + dy) * vw + (px0 + dx)) * 4;
                    data[pi] = r;
                    data[pi + 1] = g;
                    data[pi + 2] = b;
                    data[pi + 3] = alpha;
                }
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function startSolMelt(wipe, frost, cols, rows, cellSize, vw, vh, ctx, fbm, cx, cy, clone) {
    // Organic melt — mirrors the freeze algorithm but in reverse
    // Seeded from sol_atrapado center, grows outward using queue + branches
    // Runs until ALL ice is completely gone (no time limit)
    const total = cols * rows;
    const melted = new Uint8Array(total);   // 1 = fully melted (frost = 0)
    const queued = new Uint8Array(total);
    const meltQueue = [];
    const branches = [];

    // Convert sol_atrapado pixel center to grid coords
    const seedCol = Math.floor(cx / cellSize);
    const seedRow = Math.floor(cy / cellSize);

    function enqueue(col, row) {
        if (col < 0 || col >= cols || row < 0 || row >= rows) return;
        const idx = row * cols + col;
        if (queued[idx] || melted[idx]) return;
        if (frost[idx] <= 0) { melted[idx] = 1; return; }
        queued[idx] = 1;
        meltQueue.push(idx);
    }
    function dequeue() {
        if (meltQueue.length === 0) return null;
        const i = Math.floor(Math.random() * meltQueue.length);
        const val = meltQueue[i];
        meltQueue[i] = meltQueue[meltQueue.length - 1];
        meltQueue.pop();
        const col = val % cols;
        const row = (val - col) / cols;
        queued[val] = 0;
        return { col, row, idx: val };
    }

    // Seed from sol_atrapado center area
    for (let dr = -4; dr <= 4; dr++) {
        for (let dc = -4; dc <= 4; dc++) {
            enqueue(seedCol + dc, seedRow + dr);
        }
    }

    function spawnMeltBranch(col, row) {
        const angle = Math.random() * Math.PI * 2;
        const len = 12 + Math.random() * 35;
        branches.push({ col, row, angle, len, pos: 0, speed: 0.6 + Math.random() * 1.2 });
    }

    function growMeltBranches() {
        for (let i = branches.length - 1; i >= 0; i--) {
            const br = branches[i];
            br.pos += br.speed;
            if (br.pos >= br.len) { branches.splice(i, 1); continue; }
            const nc = Math.round(br.col + Math.cos(br.angle) * br.pos);
            const nr = Math.round(br.row + Math.sin(br.angle) * br.pos);
            if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
                const idx = nr * cols + nc;
                if (!melted[idx] && frost[idx] > 0) {
                    frost[idx] = Math.max(0, frost[idx] - 0.35);
                    if (frost[idx] <= 0) { frost[idx] = 0; melted[idx] = 1; }
                    // Enqueue neighbors
                    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                    for (const [dc2, dr2] of dirs) enqueue(nc + dc2, nr + dr2);
                    // Side branches
                    if (Math.random() < 0.1) {
                        const sa = br.angle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.8);
                        branches.push({ col: nc, row: nr, angle: sa, len: 4 + Math.random() * 12, pos: 0, speed: 0.4 + Math.random() * 0.8 });
                    }
                }
            }
            br.angle += (Math.random() - 0.5) * 0.15;
        }
    }

    const baseCellsPerFrame = Math.ceil(total / 300) + 4;
    const startTime = performance.now();
    let frameCount = 0;

    function animateMelt(now) {
        const elapsed = now - startTime;
        frameCount++;
        // Accelerate over time so it doesn't drag
        const accel = 1 + elapsed / 3000;
        const maxGrow = Math.ceil(baseCellsPerFrame * accel);

        let grown = 0;
        while (grown < maxGrow && meltQueue.length > 0) {
            const item = dequeue();
            if (!item) break;
            const { col, row, idx } = item;

            if (melted[idx] || frost[idx] <= 0) { melted[idx] = 1; continue; }

            // Melt this cell — reduce opacity
            const n = fbm(col * 0.06, row * 0.06);
            frost[idx] -= (0.2 + n * 0.3 + Math.random() * 0.2);
            if (frost[idx] <= 0.05) {
                frost[idx] = 0;
                melted[idx] = 1;
            } else {
                // Not fully melted yet — re-enqueue so it keeps melting
                enqueue(col, row);
            }
            grown++;

            // Spawn melt branches occasionally
            if (Math.random() < 0.005 + elapsed / 500000) spawnMeltBranch(col, row);

            // Enqueue neighbors with organic spread (8-directional)
            const dirs8 = [[-1,0,1],[1,0,1],[0,-1,1],[0,1,1],[-1,-1,0.5],[1,-1,0.5],[-1,1,0.5],[1,1,0.5]];
            for (const [dc, dr, prob] of dirs8) {
                if (Math.random() > prob * 0.85) continue;
                enqueue(col + dc, row + dr);
            }
        }

        growMeltBranches();

        renderSolFrost(ctx, frost, cols, rows, cellSize, vw, vh, fbm, 1);

        // Check if any ice remains
        let hasIce = false;
        for (let i = 0; i < total; i++) {
            if (frost[i] > 0) { hasIce = true; break; }
        }

        if (hasIce) {
            // If queue is empty but ice remains, re-seed from melted edges
            if (meltQueue.length === 0 && branches.length === 0) {
                for (let r = 0; r < rows; r++) {
                    for (let c2 = 0; c2 < cols; c2++) {
                        if (melted[r * cols + c2]) {
                            const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                            for (const [dc, dr] of dirs) enqueue(c2 + dc, r + dr);
                        }
                    }
                }
                // Also force-melt any remaining thin frost
                for (let i = 0; i < total; i++) {
                    if (frost[i] > 0 && frost[i] < 0.2) { frost[i] = 0; melted[i] = 1; }
                }
            }
            requestAnimationFrame(animateMelt);
        } else {
            // All ice fully melted — done
            finishSolRescue(wipe, clone);
        }
    }

    requestAnimationFrame(animateMelt);
}

function finishSolRescue(wipe, clone) {
    // Brief pause before cleanup
    setTimeout(() => {
        // Fade out overlay
        wipe.style.transition = 'opacity 1s ease';
        wipe.style.opacity = '0';

        setTimeout(() => {
            wipe.classList.remove('active');
            wipe.innerHTML = '<canvas id="cryoIrisCanvas"></canvas>';
            wipe.style.opacity = '';
            wipe.style.transition = '';
            _cryoFrost = null;

            // Add crack overlay to the real sol_atrapado button (visual only, until unequip)
            const realBtn = document.getElementById('solAtrapado_btn');
            if (realBtn && !realBtn.querySelector('.sol-crack-overlay')) {
                const crk = document.createElement('div');
                crk.className = 'sol-crack-overlay';
                crk.innerHTML = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 8 L34 20 L30 26 L35 32 L28 38 L33 46 L30 58" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M30 26 L22 30" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1"/>
                    <path d="M35 32 L42 28" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1"/>
                </svg>`;
                realBtn.appendChild(crk);
            }

            // World 2 transition already happened during the flash
            // Auto-place metal in pronto if player has metal or reversita
            if (!gameData.prontoGemSlot && ((gameData.gemCounts['metal'] || 0) > 0 || (gameData.gemCounts['reversita'] || 0) > 0)) {
                gameData.prontoGemSlot = 'metal';
                gameData.prontoGemActivated = false;
            }
            updateProntoGem();
            updateUI();
            applyWorldTheme();
            saveGame();
            rescaleGame();
        }, 1000);
    }, 500);
}
document.addEventListener('click', function(e) {
    const popup = $('prontoPopup');
    const wrapper = e.target.closest('.pronto-wrapper');
    if (popup && popup.classList.contains('show') && !wrapper) {
        popup.classList.remove('show');
    }
});

function updateGoldenBorders() {
    const realBaseGems = baseGems.filter(g => !g.isNothing);
    const hasAllBase = realBaseGems.every(g => (gameData.gemCounts[g.id] || 0) > 0);
    const inW2 = (gameData.world || 1) >= 2;
    const hasW2Gems = inW2 && (gameData.gemCounts[reversita.id] || 0) > 0 && (gameData.gemCounts[metal.id] || 0) > 0;
    const almBtn = $('btnAlmacen');
    almBtn.classList.toggle('golden-border', hasAllBase && !hasW2Gems);
    almBtn.classList.toggle('celeste-border', hasAllBase && hasW2Gems);

    const fusionVals = Object.values(fusionRecipes);
    const allFusionIds = fusionVals.filter(r => !r.isAmulet).map(r => r.id);
    $('btnFusion').classList.toggle('golden-border', allFusionIds.every(id => (gameData.createdCounts[id] || 0) > 0));

    let totalPol = 0;
    if (gameData.polishedInventory && typeof gameData.polishedInventory === 'object') {
        for (const b of Object.values(gameData.polishedInventory)) if (b && Array.isArray(b.items)) totalPol += b.items.length;
    } else {
        for (const key in gameData.polishedCounts) totalPol += (gameData.polishedCounts[key] || 0);
    }
    $('btnPolish').classList.toggle('golden-border', totalPol >= 5);
}

function updateTicketBorder() {
    const sc = $('scratchCard');
    if (!sc) return;
    const maxed = isLuckMaxed();
    const suerte = isSuerteLuck();
    sc.classList.toggle('luck-maxed', maxed && !suerte);
    sc.classList.toggle('luck-suerte', suerte);
    sc.classList.toggle('luck-normal', !maxed);
}

function upgradeAlmacen() {
    if (isAlmacenMaxed()) return;
    const cost = getAlmacenUpgradeCost();
    if (!spendGems(cost)) return;
    gameData.almacenLevel++;
    if (gameData.equippedAmulet === 'amuleto_fortuna') gameData.fortunaUpgradesBought++;
    updateUI();
    saveGame();
}

function upgradeLuck() {
    if (isLuckMaxed()) return;
    const cost = getLuckUpgradeCost();
    if (!spendGems(cost)) return;
    gameData.luckLevel++;
    if (gameData.equippedAmulet === 'amuleto_fortuna') gameData.fortunaUpgradesBought++;
    updateUI();
    saveGame();
}

function toggleSetting(setting) {
    gameData.settings[setting] = !gameData.settings[setting];
    saveGame();
    updateUI();
}

function activateFavor() {
    if ((gameData.world || 1) >= 2) return; // No favor in World 2
    if (gameData.favorActive || favorMode || isScratching) return;
    if (gameData.totalGems >= 300) return; // Solo disponible con menos de 300 gemas
    addGems(FAVOR_REWARD);
    favorMode = true;
    gameData.favorActive = true;
    const btn = $('favorBtn');
    const info = $('favorInfo');
    btn.classList.add('active');
    info.style.display = 'block';
    updateUI();
}

function createStars() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 50; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*2}s`;
        frag.appendChild(s);
    }
    $('stars').appendChild(frag);
}

function selectPrize() {
    // Post-cryo: 10% chance to get Bolsa Rellena (one-time only)
    if (gameData.cryoEnding && !gameData.bolsaRellenaClaimed && Math.random() < 0.10) {
        const sellPrice = Math.floor((gameData.preCryoPlata || 0) / 2);
        return {
            id: 'bolsa_rellena', emoji: '👜', name: 'Bolsa Rellena',
            amount: sellPrice, rarity: 'Endgame',
            rarityClass: 'rarity-endgame', neonClass: 'neon-endgame',
            isBolsaRellena: true
        };
    }

    const mult = getLuckMultiplier();
    const currentNothingProb = nothingProbs[getEffectiveLuckLevel()] || 0.07;
    if (Math.random() < currentNothingProb) return baseGems.find(g => g.isNothing);
    
    const realGems = baseGems.filter(g => !g.isNothing);
    let weightedGems = realGems.map(gem => {
        let weight = gem.chance;
        if (mult > 1) {
            if (gem.rarity === 'Legendario') weight *= (1 + mult * 0.3);
            else if (gem.rarity === 'Mítico') weight *= (1 + mult * 0.4);
            else if (gem.rarity === 'Épico') weight *= (1 + mult * 0.3);
            else if (gem.rarity === 'Raro') weight *= (1 + mult * 0.1);
        }
        return { gem, weight };
    });

    // World 2: add reversita and metal to the weighted pool (between rare and epic)
    if ((gameData.world || 1) >= 2) {
        let rWeight = 0.07;
        let mWeight = 0.07;
        if (mult > 1) {
            rWeight *= (1 + mult * 0.2);
            mWeight *= (1 + mult * 0.2);
        }
        weightedGems.push({ gem: { ...reversita }, weight: rWeight });
        weightedGems.push({ gem: { ...metal }, weight: mWeight });
    }

    // Efecto pasivo: Amuleto Focus — multiplica ×2.0 la probabilidad de la gema seleccionada
    if (gameData.equippedAmulet === 'amuleto_focus' && gameData.focusGemId) {
        const focusItem = weightedGems.find(item => item.gem.id === gameData.focusGemId);
        if (focusItem) focusItem.weight *= 2.0;
    }

    const totalWeight = weightedGems.reduce((sum, item) => sum + item.weight, 0);
    const rand = Math.random() * totalWeight;
    
    let cumulative = 0;
    let selected = realGems[0];
    for (const item of weightedGems) {
        cumulative += item.weight;
        if (rand <= cumulative) { selected = item.gem; break; }
    }

    // Efecto pasivo: Amuleto Presión — si sale Carbón y el amuleto está equipado, 25% chance de Diamante de Presión
    if (selected.id === 'carbon' && gameData.equippedAmulet === 'amuleto_presion' && Math.random() < 0.25) {
        return { ...diamantePresion };
    }

    return selected;
}

function initCanvas() {
    if (!canvas || !ctx) return;
    const card = $('scratchCard');
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
    const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    gradient.addColorStop(0,'#a8a8a8'); gradient.addColorStop(0.5,'#c8c8c8'); gradient.addColorStop(1,'#a8a8a8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let i = 0; i < 150; i++) ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 2, 2);
    ctx.font = 'bold 18px Poppins'; ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🪙 RASPÁ AQUÍ 🪙', canvas.width/2, canvas.height/2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    smoothX = smoothY = undefined;
    $('scratchCard').classList.remove('broken');
}

function scratch(tx, ty) {
    if (!ctx || !canvas) return;
    if (smoothX === undefined) { smoothX = tx; smoothY = ty; }
    smoothX = tx;
    smoothY = ty;
    const radius = 25;
    ctx.beginPath(); 
    ctx.arc(smoothX, smoothY, radius, 0, Math.PI*2); 
    ctx.fill();
    if (lastX !== undefined) { 
        ctx.beginPath(); 
        ctx.lineWidth = radius * 2; 
        ctx.moveTo(lastX, lastY); 
        ctx.lineTo(smoothX, smoothY); 
        ctx.stroke(); 
    }
    lastX = smoothX; lastY = smoothY;
}

function calculateScratched() {
    if (!ctx || !canvas) return 0;
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let t = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pixelWidth = canvas.width;
    
    for (let i = 3; i < data.length; i += 32) {
        if (data[i] === 0) {
            const pixelIndex = i / 4;
            const x = pixelIndex % pixelWidth;
            const y = Math.floor(pixelIndex / pixelWidth);
            const distanceFromCenterX = Math.abs(x - centerX);
            const maxDistanceX = pixelWidth / 2;
            const centerWeightX = 1 - (distanceFromCenterX / maxDistanceX);
            const distanceFromCenterY = Math.abs(y - centerY);
            const maxDistanceY = canvas.height / 2;
            const centerWeightY = 1 - (distanceFromCenterY / maxDistanceY);
            const combinedCenter = centerWeightX * centerWeightY;
            const centerBonus = combinedCenter * 4;
            const edgePenalty = combinedCenter < 0.3 ? 0.3 : 1;
            const centerWeight = (1 + centerBonus) * edgePenalty;
            t += centerWeight;
        }
    }
    const maxPossible = (data.length / 32) * 0.95;
    const pct = Math.min(100, Math.round((t / maxPossible) * 100));
    setProgress(pct);
    return pct;
}

function getCoords(e) {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // IMPORTANTE: si el juego está escalado con CSS transform, rect.* ya está escalado,
    // pero canvas.width/canvas.height siguen en coordenadas "internas" sin escala.
    // Ajustamos para evitar que el área de raspado quede defasada.
    const scaleX = rect.width ? (canvas.width / rect.width) : 1;
    const scaleY = rect.height ? (canvas.height / rect.height) : 1;
    if (e.touches) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function setupEvents() {
    if (!canvas) return;
    const newCanvas = canvas.cloneNode(true);
    if (canvas.parentNode) {
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;
        ctx = canvas.getContext('2d');
    }
    
    const start = e => { 
        if (!canPlay) return; 
        e.preventDefault?.(); 
        isDrawing = true; 
        lastX = lastY = smoothX = smoothY = undefined; 
        const {x,y} = getCoords(e); 
        scratch(x,y); 
        checkReveal(); 
    };
    
    const move = e => { 
        if (!canPlay) return; 
        e.preventDefault?.(); 
        const {x,y} = getCoords(e); 
        if (isDrawing || (e.buttons === 1 && !e.touches)) {
            if (!isDrawing) {
                isDrawing = true;
                lastX = lastY = smoothX = smoothY = undefined;
            }
            scratch(x,y); 
            checkReveal();
        }
    };
    
    const end = () => { isDrawing = false; lastX = lastY = undefined; };
    
    canvas.addEventListener('mousedown', start); 
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end); 
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start); 
    canvas.addEventListener('touchmove', move); 
    canvas.addEventListener('touchend', end);
}

function checkReveal() { 
    const progress = calculateScratched();
    if (!revealed && progress >= 100) { 
        revealed = true; 
        revealPrize(); 
    } 
}

function revealPrize() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setProgress(100);
    canPlay = false;
    isScratching = false;
    
    const wasFavor = favorMode;
    
    if (wasFavor) {
        currentFavorPrize = currentPrize;
        if (!currentPrize.isNothing) {
            const finalAmount = currentPrize.amount;
            const isNew = !gameData.foundGems[currentPrize.id];
            currentPrize._finalAmount = finalAmount;
            currentPrize._isNew = isNew;
            updateUI();
            setTimeout(() => { createConfetti(); showFavorWinMessage(finalAmount, isNew); }, 300);
        } else {
            updateUI();
            setTimeout(() => showFavorLoseMessage(), 300);
        }
    } else {
        if (!currentPrize.isNothing) {
            const isStolen = (gameData.cursedGems[currentPrize.id] || 0) > 0 && currentPrize.id !== 'galaxita';
            if (isStolen) {
                // Clear this gem's debt + all debts for cheaper gems
                const stolenPrice = currentPrize.amount;
                const getDebtPrice = (id) => {
                    const bg = baseGems.find(g => g.id === id);
                    if (bg) return bg.amount;
                    if (id === 'reversita') return reversita.amount;
                    if (id === 'metal') return metal.amount;
                    if (id === 'diamante_presion') return diamantePresion.amount;
                    return 0;
                };
                for (const id of Object.keys(gameData.cursedGems)) {
                    if (getDebtPrice(id) <= stolenPrice) {
                        delete gameData.cursedGems[id];
                    }
                }
                updateUI();
                saveGame();
                setTimeout(() => showStolenMessage(), 300);
            } else {
                const finalAmount = currentPrize.amount;
                const isNew = !gameData.foundGems[currentPrize.id];
                currentPrize._finalAmount = finalAmount;
                currentPrize._isNew = isNew;
                updateUI();
                setTimeout(() => { createConfetti(); showWinMessage(finalAmount, isNew, false); }, 300);
            }
        } else {
            updateUI();
            setTimeout(() => showLoseMessage(), 300);
        }
    }
    processNextTicket();
}

function createConfetti() {
    const c = $('confettiContainer');
    const emojis = ['💎','✨','⭐','💖','💙','💚','🔮','👑'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 50; i++) {
        const cf = document.createElement('div');
        cf.className = 'confetti';
        cf.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        cf.style.cssText = `left:${Math.random()*100}%;font-size:${10+Math.random()*14}px;animation-delay:${Math.random()*0.5}s`;
        frag.appendChild(cf);
        setTimeout(() => cf.remove(), 4000);
    }
    c.appendChild(frag);
}

function _showWinBase(cfg) {
    $('newBadge').style.display = cfg.badge || 'none';
    $('winPrizeDisplay').innerHTML = cfg.icon;
    if (cfg.filter) $('winPrizeDisplay').style.filter = cfg.filter;
    $('winPrizeText')[cfg.textHtml ? 'innerHTML' : 'textContent'] = cfg.text;
    const val = $('winPrizeValue');
    val[cfg.valHtml ? 'innerHTML' : 'textContent'] = cfg.value;
    if (cfg.valStyle) Object.assign(val.style, cfg.valStyle);
    $('winTitle')[cfg.titleHtml ? 'innerHTML' : 'textContent'] = cfg.title;
    $('winButtons').innerHTML = cfg.buttons;
    winMessageOpen = true;
    $('winMessageOverlay').classList.add('show');
    $('winMessage').classList.add('show');
    updateUI();
}
function _prizeNameHtml(gem) {
    const rc = gem.rarityClass || 'rarity-comun';
    return `<span class="prize-name">${gem.name}</span> - <span class="prize-rarity-text ${rc}">${gem.rarity}</span>`;
}

function showWinMessage(amount, isNew) {
    // Special handling for Bolsa Rellena
    if (currentPrize && currentPrize.isBolsaRellena) {
        _showWinBase({
            badge: 'inline-block',
            icon: getGemIcon(currentPrize),
            text: _prizeNameHtml(currentPrize), textHtml: true,
            value: 'Restos renacidos ✨',
            title: '🏆 ¡¡¡ENDGAME!!!',
            buttons: `<button class="btn-abrir-bolsa" onclick="abrirBolsaRellena()">👜 Abrir</button>
            <button class="btn-vender" id="btnVender" onclick="venderLimpia()">💰 ${amount.toLocaleString()}</button>`
        });
        return;
    }

    _showWinBase({
        badge: isNew ? 'inline-block' : 'none',
        icon: getGemIcon(currentPrize),
        text: _prizeNameHtml(currentPrize), textHtml: true,
        value: '+' + amount.toLocaleString() + ' 🪙',
        title: RARITY_TITLES[currentPrize.rarity] || '¡Gema encontrada!',
        buttons: `<button class="btn-almacenar" onclick="almacenarPrize()">📦 Almacenar</button>
        <button class="btn-vender" id="btnVender" onclick="venderLimpia()">💰 ${amount.toLocaleString()}</button>`
    });
}

function showLoseMessage() {
    _showWinBase({
        icon: getGemIcon({id:'nada', isNothing:true, emoji:'💨'}),
        text: '¡Seguí intentando!', value: '+0 🪙',
        title: '😢 Vacío...',
        buttons: `<button class="btn-continuar" onclick="closeWinMessage()">Continuar</button>`
    });
}

function showFavorWinMessage(amount) {
    _showWinBase({
        icon: getGemIcon(currentPrize),
        text: _prizeNameHtml(currentPrize), textHtml: true,
        value: '+' + amount.toLocaleString() + ' 🪙',
        title: RARITY_TITLES[currentPrize.rarity] || '¡Gema encontrada!',
        buttons: `<button class="btn-devolver-favor" onclick="returnFavor()">Devolver Favor</button>`
    });
}

function showFavorLoseMessage() {
    _showWinBase({
        icon: getGemIcon({id:'nada', isNothing:true, emoji:'💨'}),
        text: 'Aire... no hay nada aquí', value: '+0 🪙',
        title: '💨 Aire...',
        buttons: `<button class="btn-devolver-favor" onclick="returnFavor()">Devolver 50🪙</button>`
    });
}

function showStolenMessage() {
    _showWinBase({
        icon: getGemIcon(currentPrize), filter: 'grayscale(1) opacity(0.7)',
        text: currentPrize.name + ' - PERDIDO',
        value: 'Te lo robó el que te hizo el favor<br>porque quería uno más para hacer una fusión', valHtml: true,
        valStyle: { color: '#ef4444', fontSize: '0.9rem', lineHeight: '1.4' },
        title: '<span class="stolen-message-title">🚨 ROBADO POR EL FAVOR 🚨</span>', titleHtml: true,
        buttons: `<button class="btn-continuar" onclick="closeWinMessage()">Aceptar Pérdida</button>`
    });
}

function returnFavor() {
    const prize = currentFavorPrize;
    if (!prize.isNothing) {
        if (prize.id !== 'galaxita') {
            // Only steal the NEXT one (counter = 1), not forever
            gameData.cursedGems[prize.id] = (gameData.cursedGems[prize.id] || 0) + 1;
        }
    } else {
        gameData.totalGems = Math.max(0, gameData.totalGems - FAVOR_PENALTY);
    }
    favorMode = false;
    gameData.favorActive = false;
    currentFavorPrize = null;
    const btn = $('favorBtn');
    const info = $('favorInfo');
    btn.classList.remove('active');
    info.style.display = 'none';
    updateUI();
    closeWinMessage();
    saveGame();
}

function processNextTicket() {
    if (ticketStack.length > 0) {
        const nextTicket = ticketStack.shift();
        currentTicket = nextTicket;
        isScratching = true;
        revealed = false;
        lastX = lastY = smoothX = smoothY = undefined;
        showCurrentTicket();
        updateUI();
        setProgress(0);
    } else {
        currentTicket = null;
        isScratching = false;
        canPlay = false;
        updateUI();
    }
}

function almacenarPrize() {
    if (!currentPrize || currentPrize.isNothing) return;
    // Bolsa Rellena cannot be stored
    if (currentPrize.isBolsaRellena) return;
    gameData.foundGems[currentPrize.id] = true;
    gameData.gemCounts[currentPrize.id] = (gameData.gemCounts[currentPrize.id] || 0) + 1;
    updateUI();
    closeWinMessage();
    saveGame();
}

function abrirBolsaRellena() {
    if (!currentPrize || !currentPrize.isBolsaRellena) return;
    // Mark as claimed so it never appears again
    gameData.bolsaRellenaClaimed = true;
    // Give one of each gem type the player had before the freeze
    const preCryoGems = gameData.preCryoGems || [];
    const givenGems = [];
    preCryoGems.forEach(gemId => {
        // Check if it's a base gem
        const baseGem = baseGems.find(g => g.id === gemId && !g.isNothing);
        if (baseGem) {
            gameData.foundGems[gemId] = true;
            gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + 1;
            givenGems.push(baseGem);
            return;
        }
        // Check if it's a fusion/created gem
        const recipe = Object.values(fusionRecipes).find(r => r.id === gemId);
        if (recipe) {
            if (recipe.isAmulet) {
                if (!gameData.amuletCounts) gameData.amuletCounts = {};
                gameData.amuletCounts[gemId] = (gameData.amuletCounts[gemId] || 0) + 1;
            } else {
                gameData.createdCounts[gemId] = (gameData.createdCounts[gemId] || 0) + 1;
                // Ensure it's registered in createdGems catalog for almacén display
                if (!createdGems.find(g => g.id === gemId)) {
                    const baseKey = Object.keys(fusionRecipes).find(k => fusionRecipes[k].id === gemId);
                    const bGem = baseKey ? baseGems.find(g => g.id === baseKey) : null;
                    if (bGem) {
                        const fRarity = getFusionRarity(recipe, bGem);
                        const fRd = rarityData[fRarity] || {};
                        createdGems.push({
                            id: recipe.id, emoji: recipe.emoji, name: recipe.name,
                            amount: bGem.amount * 2, rarity: fRarity,
                            rarityClass: fRd.class, neonClass: fRd.neon,
                            ...(recipe.isArtifact ? { isArtifact: true } : {})
                        });
                    }
                }
            }
            givenGems.push(recipe);
            return;
        }
        // Diamante de presión
        if (gemId === 'diamante_presion') {
            gameData.foundGems[gemId] = true;
            gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + 1;
            givenGems.push(diamantePresion);
            return;
        }
        // World 2 secret gems
        if (gemId === 'reversita') {
            gameData.foundGems[gemId] = true;
            gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + 1;
            givenGems.push(reversita);
            return;
        }
        if (gemId === 'metal') {
            gameData.foundGems[gemId] = true;
            gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + 1;
            givenGems.push(metal);
            return;
        }
    });
    closeWinMessage();
    saveGame();
    // Show a summary alert with all the gems received
    const count = givenGems.length;
    const preview = givenGems.slice(0, 5).map(g => g.emoji || '💎').join(' ');
    const extra = count > 5 ? ` +${count - 5} más` : '';
    const sprite = `<div style="width:56px;height:56px;margin:0 auto;">${gemSVGs['bolsa_rellena'] || '👜'}</div>`;
    showCustomAlert(sprite, '¡Bolsa Abierta!', `Recibiste ${count} gema${count !== 1 ? 's' : ''} de tu vida pasada:\n${preview}${extra}`, 'rgba(168,85,247,0.8)');
    updateUI();
}

function venderLimpia() {
    if (!currentPrize || currentPrize.isNothing) return;
    const amount = currentPrize._finalAmount || currentPrize.amount;
    addGems(amount);
    closeWinMessage();
    saveGame();
}

function closeWinMessage() { 
    $('winMessage').classList.remove('show');
    $('winMessageOverlay').classList.remove('show');
    $('winPrizeDisplay').style.filter = '';
    $('winPrizeValue').style.color = '';
    winMessageOpen = false;
    updateUI();
}

function showNewTicketAnimated() {
    const container = $('ticketContainer');
    const oldCard = $('scratchCard');
    
    // Determinar clase de borde según suerte
    const luckClass = isSuerteLuck() ? 'luck-suerte' : (isLuckMaxed() ? 'luck-maxed' : 'luck-normal');
    
    // Crear nuevo ticket
    const newCard = document.createElement('div');
    newCard.className = 'scratch-card ticket-new ' + luckClass;
    newCard.id = 'scratchCardNew';
    newCard.innerHTML = `
        <div class="prize-layer" id="prizeLayerNew" style="opacity: 0;">
            ${getBannedItemsHTML()}
            <div class="prize-emoji" id="prizeEmojiNew">💎</div>
            <div class="prize-text" id="prizeTextNew">RASPÁ AQUÍ</div>
            <div class="prize-amount" id="prizeAmountNew"></div>
            <div class="prize-rarity rarity-legendario" id="prizeRarityNew"></div>
        </div>
        <canvas id="scratchCanvasNew"></canvas>
    `;
    
    // Inicializar el canvas del nuevo ticket
    const tempCanvas = $('scratchCanvasNew');
    if (tempCanvas) {
        tempCanvas.width = 270;
        tempCanvas.height = 180;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Crear path con esquinas redondeadas para clipear
        const radius = 16;
        tempCtx.beginPath();
        tempCtx.moveTo(radius, 0);
        tempCtx.lineTo(270 - radius, 0);
        tempCtx.quadraticCurveTo(270, 0, 270, radius);
        tempCtx.lineTo(270, 180 - radius);
        tempCtx.quadraticCurveTo(270, 180, 270 - radius, 180);
        tempCtx.lineTo(radius, 180);
        tempCtx.quadraticCurveTo(0, 180, 0, 180 - radius);
        tempCtx.lineTo(0, radius);
        tempCtx.quadraticCurveTo(0, 0, radius, 0);
        tempCtx.closePath();
        tempCtx.clip();
        
        // Dibujar fondo gris con gradiente
        const gradient = tempCtx.createLinearGradient(0, 0, 270, 180);
        gradient.addColorStop(0, '#a8a8a8');
        gradient.addColorStop(0.5, '#c8c8c8');
        gradient.addColorStop(1, '#a8a8a8');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, 270, 180);
        
        // Agregar ruido
        tempCtx.fillStyle = 'rgba(0,0,0,0.04)';
        for (let i = 0; i < 100; i++) {
            tempCtx.fillRect(Math.random() * 270, Math.random() * 180, 2, 2);
        }
        
        // Texto
        tempCtx.fillStyle = 'rgba(0,0,0,0.1)';
        tempCtx.font = 'bold 18px Poppins';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText('🪙 RASPÁ AQUÍ 🪙', 135, 90);
    }
    
    if (gameData.settings.instantTicket) {
        // Reemplazar inmediatamente
        oldCard.remove();
        container.appendChild(newCard);
    newCard.id = 'scratchCard';
    newCard.classList.remove('ticket-new');
    newCard.classList.add('scratch-card');
    // Asegurar contorno dorado/estado de suerte en flujo instantáneo
    newCard.classList.toggle('golden', isLuckMaxed() && !isSuerteLuck());
    if (isSuerteLuck()) newCard.classList.add('luck-suerte');
    else if (isLuckMaxed()) newCard.classList.add('luck-maxed');
        
        // Renombrar IDs
        const ids = ['prizeLayer', 'prizeEmoji', 'prizeText', 'prizeAmount', 'prizeRarity', 'scratchCanvas'];
        ids.forEach(id => {
            const el = document.getElementById(id + 'New');
            if (el) el.id = id;
        });
        
        // Configurar el juego
        canvas = $('scratchCanvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
            setupEvents();
            currentPrize = selectPrize();
            $('prizeEmoji').innerHTML = getGemIcon(currentPrize);
            $('prizeText').textContent = currentPrize.name;
            const displayAmount = currentPrize.isNothing ? 0 : currentPrize.amount;
            $('prizeAmount').textContent = '+' + displayAmount.toLocaleString() + ' 🪙';
            $('prizeRarity').textContent = currentPrize.rarity;
            $('prizeRarity').className = 'prize-rarity ' + (currentPrize.rarityClass || '');
            initCanvas();
            setTimeout(() => {
                const pl = $('prizeLayer');
                if (pl) pl.style.opacity = '1';
            }, 100);
            canPlay = true;
        }
        
        setProgress(0);
        
        saveGame();
    } else {
        // Marcar el viejo como "old" y añadir nuevo
        oldCard.classList.add('ticket-old');
        container.appendChild(newCard);
        
        // Guardar posición de scroll actual
        const scrollY = window.scrollY;
        
        // Forzar reflow y animar
        requestAnimationFrame(() => {
            newCard.classList.add('slide-in');
        });
        
        // Después de la animación, limpiar y configurar
        setTimeout(() => {
            // Eliminar viejo ticket
            oldCard.remove();
            
            // Renombrar IDs del nuevo ticket
            newCard.id = 'scratchCard';
            newCard.classList.remove('ticket-new', 'slide-in');
            newCard.classList.add('scratch-card');
            newCard.style.pointerEvents = 'auto';
            
            const prizeLayer = $('prizeLayerNew');
            if(prizeLayer) prizeLayer.id = 'prizeLayer';
            const prizeEmoji = $('prizeEmojiNew');
            if(prizeEmoji) prizeEmoji.id = 'prizeEmoji';
            const prizeText = $('prizeTextNew');
            if(prizeText) prizeText.id = 'prizeText';
            const prizeAmount = $('prizeAmountNew');
            if(prizeAmount) prizeAmount.id = 'prizeAmount';
            const prizeRarity = $('prizeRarityNew');
            if(prizeRarity) prizeRarity.id = 'prizeRarity';
            const scratchCanvas = $('scratchCanvasNew');
            if(scratchCanvas) scratchCanvas.id = 'scratchCanvas';
            
            // Configurar el juego
            canvas = $('scratchCanvas');
            if (canvas) {
                ctx = canvas.getContext('2d');
                setupEvents();
                currentPrize = selectPrize();
                $('prizeEmoji').innerHTML = getGemIcon(currentPrize);
                $('prizeText').textContent = currentPrize.name;
                const displayAmount = currentPrize.isNothing ? 0 : currentPrize.amount;
                $('prizeAmount').textContent = '+' + displayAmount.toLocaleString() + ' 🪙';
                $('prizeRarity').textContent = currentPrize.rarity;
                $('prizeRarity').className = 'prize-rarity ' + (currentPrize.rarityClass || '');
                initCanvas();
                setTimeout(() => {
                    const pl = $('prizeLayer');
                    if (pl) pl.style.opacity = '1';
                }, 100);
                canPlay = true;
            }
            
            setProgress(0);
            
            // Restaurar posición de scroll
            window.scrollTo(0, scrollY);
            
            saveGame();
        }, 800); // Esperar a que termine la animación (0.75s)
    }
}

function showCurrentTicket() {
    const card = $('scratchCard');
    card.classList.remove('broken');
    card.classList.toggle('golden', isLuckMaxed() && !isSuerteLuck());
    card.classList.toggle('luck-suerte', isSuerteLuck());
    card.innerHTML = `
        <div class="prize-layer" id="prizeLayer" style="opacity: 0;">
            ${getBannedItemsHTML()}
            <div class="prize-emoji" id="prizeEmoji">💎</div>
            <div class="prize-text" id="prizeText">RASPÁ AQUÍ</div>
            <div class="prize-amount" id="prizeAmount"></div>
            <div class="prize-rarity rarity-legendario" id="prizeRarity"></div>
        </div>
        <canvas id="scratchCanvas"></canvas>
    `;
    setTimeout(() => {
        canvas = $('scratchCanvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
            setupEvents();
            currentPrize = selectPrize();
            $('prizeEmoji').innerHTML = getGemIcon(currentPrize);
            $('prizeText').textContent = currentPrize.name;
            const displayAmount = currentPrize.isNothing ? 0 : currentPrize.amount;
            $('prizeAmount').textContent = '+' + displayAmount.toLocaleString() + ' 🪙';
            $('prizeRarity').textContent = currentPrize.rarity;
            $('prizeRarity').className = 'prize-rarity ' + (currentPrize.rarityClass || '');
            initCanvas();
            setTimeout(() => {
                const prizeLayer = $('prizeLayer');
                if (prizeLayer) prizeLayer.style.opacity = '1';
            }, 100);
            canPlay = true;
        }
    }, 50);
}

function newGame() {
    const baseCost = gameData.equippedAmulet === 'amuleto_fortuna' ? 80 : PLAY_COST;
    const cost = favorMode ? 0 : baseCost;
    if (!canAfford(cost)) return;
    if (winMessageOpen) return; // No permitir compra mientras el mensaje está abierto
    
    if (isScratching) {
        // Ticket ya en juego - no apilar, solo ignorar
        return;
    }
    
    if (!spendGems(cost)) return;
    isScratching = true;
    revealed = false; 
    lastX = lastY = smoothX = smoothY = undefined;
    currentTicket = { cost: cost, isFavor: favorMode };
    showNewTicketAnimated();
    // Mark raspar circle as used (cyan outline in World 2)
    const rasparCircle = $('rasparCircleBtn');
    if (rasparCircle) rasparCircle.classList.add('raspar-used');
    updateUI();
    saveGame();
    setProgress(0);
}

function useGodCrown() {
    if (!gameData.amuletCounts || !gameData.amuletCounts['corona_dios']) return;
    $('crownConfirmModal').classList.add('show');
}

function closeCrownConfirm() {
    $('crownConfirmModal').classList.remove('show');
}

function confirmUseGodCrown() {
    if (!gameData.amuletCounts || !gameData.amuletCounts['corona_dios']) return;
    closeCrownConfirm();
    const doubled = Math.min(gameData.maxGems, gameData.totalGems * 2);
    gameData.totalGems = doubled;
    // Consume one corona
    gameData.amuletCounts['corona_dios']--;
    if (gameData.amuletCounts['corona_dios'] <= 0) delete gameData.amuletCounts['corona_dios'];
    // Unequip if was equipped
    if (gameData.equippedAmulet === 'corona_dios') gameData.equippedAmulet = null;
    updateUI();
    createConfetti();
    saveGame();
}

function openExpandModal() {
    $('currentMaxDisplay').textContent = gameData.maxGems.toLocaleString();
    const container = $('expandOptions');
    container.innerHTML = '';
    const upgradeData = getMaxUpgradeData();
    if (!upgradeData) {
        container.innerHTML = '<p style="color:#ffd700;text-align:center;padding:20px;font-size:0.85rem;">🏆 ¡Máximo alcanzado!</p>';
        $('expandModal').classList.add('show');
        deferSliders();
        return;
    }
    const div = document.createElement('div');
    div.className = 'upgrade-option';
    div.innerHTML = `
        <div class="info">Máximo: <span>${upgradeData.amount.toLocaleString()}</span> 🪙</div>
        <button onclick="buyMaxUpgrade()" ${!canAfford(upgradeData.cost) ? 'disabled' : ''}>${upgradeData.cost.toLocaleString()} 🪙</button>
    `;
    container.appendChild(div);
    $('expandModal').classList.add('show');
    deferSliders();
}

function closeExpandModal() { $('expandModal').classList.remove('show'); }

function buyMaxUpgrade() {
    const upg = getMaxUpgradeData();
    if (!spendGems(upg.cost)) return;
    gameData.maxGems = upg.amount;
    if (gameData.equippedAmulet === 'amuleto_fortuna') gameData.fortunaUpgradesBought++;
    updateUI();
    saveGame();
    openExpandModal();
}

function openAlmacen() {
    selectedGem = null; selectedGemType = null;
    currentAlmacenTab = 'base';
    document.querySelectorAll('#almacenModal .tab').forEach((t,i) => t.classList.toggle('active', i === 0));
    updateAlmacenLevelDisplay();
    renderAlmacen();
    $('almacenModal').classList.add('show');
    // Inicializar sliders después de que el modal sea visible
    deferSliders();
}

function updateAlmacenLevelDisplay() {
    const levelEl = $('almacenLevelDisplay');
    if (isAlmacenMaxed()) {
        levelEl.textContent = 'Nivel: MAX';
        levelEl.classList.add('level-maxed');
    } else {
        levelEl.textContent = `Nivel: ${gameData.almacenLevel + 1}`;
        levelEl.classList.remove('level-maxed');
    }
}

let sliderDragging = false;
let sliderStartX = 0;
let sliderKnobStartX = 0;
let sliderMaxSlide = 0;
let activeSliderKnob = null;
let activeSliderFill = null;
let activeSliderTarget = null;

const closeModalFunctions = {
    almacenModal: () => closeAlmacen(),
    fusionModal: () => closeFusion(),
    compressorModal: () => closeCompressor(),
    polishModal: () => closePolish(),
    expandModal: () => closeExpandModal(),
    settingsModal: () => closeSettings(),
    profileModal: () => closeProfileModal(),
    amuletInfoModal: () => closeAmuletInfoModal(),
    creativeMenuModal: () => closeCreativeMenu(),
    levelInfoModal: () => closeLevelInfoModal()
};

function initAllSliders() {
    document.querySelectorAll('.close-slider').forEach(slider => {
        const knob = slider.querySelector('.slider-knob');
        const fill = slider.querySelector('.slider-fill');
        const track = slider.querySelector('.slider-track');
        if (!knob || !track) return;
        
        const maxSlide = track.clientWidth - knob.offsetWidth;
        knob.dataset.maxSlide = maxSlide > 0 ? maxSlide : 60;
        knob.dataset.target = slider.dataset.closeTarget;
        
        knob.style.left = '0px';
        if (fill) fill.style.width = '10px';
        
        // Importante en móviles: touchstart/touchmove deben ser passive:false para que preventDefault funcione
        knob.onmousedown = null;
        knob.ontouchstart = null;
        knob.addEventListener('mousedown', sliderStart);
        knob.addEventListener('touchstart', sliderStart, { passive: false });
    });
}

// Helper: reinicializar sliders tras cambio de DOM
function deferSliders() { setTimeout(initAllSliders, 50); }

function sliderStart(e) {
    sliderDragging = true;
    activeSliderKnob = e.currentTarget;
    activeSliderFill = activeSliderKnob.parentElement.querySelector('.slider-fill');
    activeSliderTarget = activeSliderKnob.dataset.target;
    sliderMaxSlide = parseInt(activeSliderKnob.dataset.maxSlide) || 60;
    sliderStartX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    sliderKnobStartX = parseInt(activeSliderKnob.style.left) || 0;
    activeSliderKnob.classList.add('dragging');
    activeSliderKnob.classList.remove('released');
    e.preventDefault();
    
    document.addEventListener('mousemove', sliderMove);
    document.addEventListener('touchmove', sliderMove, { passive: false });
    document.addEventListener('mouseup', sliderEnd);
    document.addEventListener('touchend', sliderEnd);
}

function sliderMove(e) {
    if (!sliderDragging || !activeSliderKnob) return;
    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const diff = currentX - sliderStartX;
    let newLeft = sliderKnobStartX + diff;
    newLeft = Math.max(0, Math.min(sliderMaxSlide, newLeft));
    activeSliderKnob.style.left = newLeft + 'px';
    if (activeSliderFill) activeSliderFill.style.width = (newLeft + 10) + 'px';
    
    // Sistema de cheat para almacén
    if (activeSliderTarget === 'almacenModal') {
        updateCheatProgress(newLeft);
    }
}

function sliderEnd() {
    if (!sliderDragging || !activeSliderKnob) return;
    sliderDragging = false;
    activeSliderKnob.classList.remove('dragging');
    activeSliderKnob.classList.add('released');
    
    // Verificar si se activa el modo creativo
    if (activeSliderTarget === 'almacenModal' && window.cheatPhase === 2) {
        activateCreativeMode();
        resetCheatState();
    }

    const currentLeft = parseInt(activeSliderKnob.style.left) || 0;
    if (currentLeft >= sliderMaxSlide * 0.7 && activeSliderTarget) {
        const closeFn = closeModalFunctions[activeSliderTarget];
        if (closeFn) closeFn();
    }
    activeSliderKnob.style.left = '0px';
    if (activeSliderFill) activeSliderFill.style.width = '10px';
    
    // Resetear estado del cheat si no se completó
    if (activeSliderTarget === 'almacenModal') {
        resetCheatState();
    }
    
    activeSliderKnob = null;
    activeSliderFill = null;
    activeSliderTarget = null;
    
    document.removeEventListener('mousemove', sliderMove);
    document.removeEventListener('touchmove', sliderMove);
    document.removeEventListener('mouseup', sliderEnd);
    document.removeEventListener('touchend', sliderEnd);
}

function closeAlmacen() { 
    $('almacenModal').classList.remove('show'); 
    resetCheatState();
}

// ========== MODO CREATIVO (CHEAT) ==========
// Fases: 0=nada, 1=rojo (máximo 2s), 2=azul (medio 1.5s), 3=cósmico (listo para activar)
window.cheatPhase = 0;
window.cheatTimer = null;
window.cheatStartTime = 0;
window.cheatLastPosition = 0;

function updateCheatProgress(position) {
    const maxPos = sliderMaxSlide;
    const isAtMax = position >= maxPos * 0.9; // En el máximo (90%+)
    const isInMiddle = position > maxPos * 0.25 && position < maxPos * 0.75; // En el medio
    const wentBackward = position < window.cheatLastPosition - 5; // Retrocedió significativamente
    
    window.cheatLastPosition = position;
    
    const knob = activeSliderKnob;
    const fill = activeSliderFill;
    
    // Si está en fase completada (1, 2 o 3) y retrocede, resetear
    if (window.cheatPhase >= 1 && wentBackward && !isAtMax && window.cheatPhase < 2) {
        resetCheatState();
        return;
    }
    if (window.cheatPhase === 2 && position < maxPos * 0.2) {
        // En fase azul y fue muy atrás, resetear
        resetCheatState();
        return;
    }
    
    // FASE 0: Esperando llegar al máximo
    if (window.cheatPhase === 0) {
        if (isAtMax) {
            window.cheatStartTime = Date.now();
            window.cheatPhase = 0.5;
            // Empezar a mostrar rojo gradualmente
            if (knob) {
                knob.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                knob.style.boxShadow = '0 0 10px #ef4444';
            }
            if (fill) {
                fill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            }
            window.cheatTimer = setInterval(function() {
                if (window.cheatPhase !== 0.5) return;
                const elapsed = (Date.now() - window.cheatStartTime) / 1000;
                if (elapsed >= 2) {
                    // ¡Fase ROJA completada! -> Ahora es azul
                    window.cheatPhase = 1;
                    clearInterval(window.cheatTimer);
                    if (knob) {
                        knob.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                        knob.style.boxShadow = '0 0 15px #3b82f6';
                    }
                    if (fill) {
                        fill.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
                    }
                }
            }, 100);
        }
    }
    // FASE 0.5: Contando para rojo
    else if (window.cheatPhase === 0.5) {
        if (!isAtMax) {
            resetCheatState();
        }
    }
    // FASE 1: AZUL - Esperando ir al medio
    else if (window.cheatPhase === 1) {
        if (isInMiddle) {
            window.cheatStartTime = Date.now();
            window.cheatPhase = 1.5;
            window.cheatTimer = setInterval(function() {
                if (window.cheatPhase !== 1.5) return;
                const elapsed = (Date.now() - window.cheatStartTime) / 1000;
                if (elapsed >= 1.5) {
                    // ¡Fase AZUL completada! -> Ahora es CÓSMICO (estilo galaxita)
                    window.cheatPhase = 2;
                    clearInterval(window.cheatTimer);
                    if (knob) {
                        knob.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e, #1a1a4e, #4a1a6b)';
                        knob.style.backgroundSize = '400% 400%';
                        knob.style.animation = 'cheatCosmic 2s ease infinite';
                        knob.style.boxShadow = '0 0 15px #a855f7, 0 0 30px #302b63, inset 0 0 10px rgba(255,255,255,0.2)';
                    }
                    if (fill) {
                        fill.style.background = 'linear-gradient(90deg, #0f0c29, #302b63, #24243e, #4a1a6b, #1a1a4e)';
                        fill.style.backgroundSize = '400% 100%';
                        fill.style.animation = 'cheatCosmicFill 3s ease infinite';
                    }
                }
            }, 100);
        }
    }
    // FASE 1.5: Contando para cósmico
    else if (window.cheatPhase === 1.5) {
        if (!isInMiddle) {
            // Salió del medio, volver a azul (fase 1)
            clearInterval(window.cheatTimer);
            window.cheatPhase = 1;
        }
    }
    // FASE 2: CÓSMICO - Listo para activar al soltar
}

function resetCheatState() {
    clearInterval(window.cheatTimer);
    window.cheatPhase = 0;
    window.cheatTimer = null;
    window.cheatStartTime = 0;
    window.cheatLastPosition = 0;
    
    // Restaurar colores del slider
    const sliders = document.querySelectorAll('#almacenModal .slider-knob, #almacenModal .slider-fill');
    sliders.forEach(function(el) {
        el.style.background = '';
        el.style.boxShadow = '';
        el.style.animation = '';
        el.style.backgroundSize = '';
    });
}

function activateCreativeMode() {
    openCreativeMenu();
}

function openCreativeMenu() {
    // Poblar selects de gemas
    const gemSelect = $('creativeGemSelect');
    gemSelect.innerHTML = '';
    baseGems.filter(g => !g.isNothing).forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = `${g.emoji} ${g.name}`;
        gemSelect.appendChild(opt);
    });
    // Diamante de Presión
    const dpOpt = document.createElement('option');
    dpOpt.value = 'diamante_presion';
    dpOpt.textContent = `💠 Diamante de Presión`;
    gemSelect.appendChild(dpOpt);

    // Poblar selects de fusiones
    const fusionSelect = $('creativeFusionSelect');
    fusionSelect.innerHTML = '';
    Object.keys(fusionRecipes).forEach(key => {
        const r = fusionRecipes[key];
        if (!r.isAmulet) {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.emoji} ${r.name}`;
            fusionSelect.appendChild(opt);
        }
    });

    // Poblar probabilidades
    const chanceList = $('creativeChanceList');
    chanceList.innerHTML = '';
    baseGems.filter(g => !g.isNothing).forEach(g => {
        const row = document.createElement('div');
        row.className = 'creative-chance-row';
        row.innerHTML = `<span class="gem-label">${g.emoji} ${g.name}</span>
            <input type="number" class="creative-chance-input" data-gem-id="${g.id}" 
                   value="${(g.chance * 100).toFixed(1)}" min="0" max="100" step="0.1">
            <span style="color:#888;font-size:0.65rem;">%</span>`;
        chanceList.appendChild(row);
    });

    // Cargar valores actuales
    $('creativeLuckLevel').value = gameData.luckLevel;
    $('creativeAlmacenLevel').value = gameData.almacenLevel;
    $('creativeInfiniteGems').checked = !!(gameData.settings && gameData.settings.infiniteGems);

    $('creativeMenuModal').classList.add('show');
    deferSliders();
}

function closeCreativeMenu() {
    $('creativeMenuModal').classList.remove('show');
}

function creativeGiveSilver() {
    const amount = parseInt($('creativeSilverAmount').value) || 0;
    gameData.totalGems = Math.min(gameData.totalGems + amount, gameData.maxGems);
    updateUI(); saveGame();
    showCustomAlert('🪙', `+${amount.toLocaleString()} Plata`, `Ahora tienes ${gameData.totalGems.toLocaleString()} 🪙`);
}

function creativeSetMaxSilver() {
    const val = parseInt($('creativeMaxSilver').value) || 10000;
    gameData.maxGems = Math.max(val, 1000);
    updateUI(); saveGame();
    showCustomAlert('📈', 'Máximo Cambiado', `Nuevo máximo: ${gameData.maxGems.toLocaleString()} 🪙`);
}

function creativeSetLuck() {
    const val = Math.min(9, Math.max(0, parseInt($('creativeLuckLevel').value) || 0));
    gameData.luckLevel = val;
    updateUI(); saveGame();
    showCustomAlert('🍀', 'Suerte Ajustada', `Nivel de suerte: ${val}`);
}

function creativeSetAlmacen() {
    const val = Math.min(10, Math.max(0, parseInt($('creativeAlmacenLevel').value) || 0));
    gameData.almacenLevel = val;
    updateUI(); updateAlmacenLevelDisplay(); saveGame();
    showCustomAlert('📦', 'Almacén Ajustado', `Nivel de almacén: ${val}`);
}

function creativeToggleInfinite() {
    if (!gameData.settings) gameData.settings = {};
    const checked = $('creativeInfiniteGems').checked;
    gameData.settings.infiniteGems = checked;
    updateUI(); saveGame();
    showCustomAlert(checked ? '♾️' : '🚫', checked ? 'Gemas Infinitas ON' : 'Gemas Infinitas OFF', '');
}

function creativeGiveGem() {
    const gemId = $('creativeGemSelect').value;
    const amount = parseInt($('creativeGemAmount').value) || 1;

    if (gemId === 'diamante_presion') {
        gameData.foundGems[gemId] = true;
        gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + amount;
        updateUI(); saveGame();
        showCustomAlert('💠', `+${amount} Diamante de Presión`, '');
        return;
    }

    const gem = baseGems.find(g => g.id === gemId);
    if (!gem) return;
    gameData.foundGems[gemId] = true;
    gameData.gemCounts[gemId] = (gameData.gemCounts[gemId] || 0) + amount;
    updateUI(); saveGame();
    showCustomAlert(gem.emoji, `+${amount} ${gem.name}`, '');
}

function creativeGiveFusion() {
    const fusionId = $('creativeFusionSelect').value;
    const amount = parseInt($('creativeFusionAmount').value) || 1;
    const recipe = Object.values(fusionRecipes).find(r => r.id === fusionId);
    if (!recipe) return;

    // Asegurar que la gema de fusión existe en createdGems
    let fusionGem = createdGems.find(g => g.id === fusionId);
    if (!fusionGem) {
        const baseKey = Object.keys(fusionRecipes).find(k => fusionRecipes[k].id === fusionId);
        const baseGem = baseGems.find(g => g.id === baseKey);
        if (!baseGem) return;
        const newRarity = getFusionRarity(recipe, baseGem);
        const rd = rarityData[newRarity];
        fusionGem = {
            id: recipe.id, emoji: recipe.emoji, name: recipe.name,
            amount: baseGem.amount * 2, rarity: newRarity,
            rarityClass: rd.class, neonClass: rd.neon,
            ...(recipe.isArtifact ? { isArtifact: true } : {})
        };
        createdGems.push(fusionGem);
    }
    gameData.createdCounts[fusionId] = (gameData.createdCounts[fusionId] || 0) + amount;
    updateUI(); saveGame();
    showCustomAlert(recipe.emoji, `+${amount} ${recipe.name}`, '');
}

function creativeGiveAmulet() {
    const amuletId = $('creativeAmuletSelect').value;
    if (!gameData.amuletCounts) gameData.amuletCounts = {};
    gameData.amuletCounts[amuletId] = (gameData.amuletCounts[amuletId] || 0) + 1;
    updateUI(); saveGame();
    const name = amuletDescriptions[amuletId] ? amuletDescriptions[amuletId].name : amuletId;
    const sprite = `<div style="width:48px;height:48px;margin:0 auto;">${gemSVGs[amuletId] || '📿'}</div>`;
    showCustomAlert(sprite, `+1 ${name}`, '', getAmuletRarityColor(amuletId));
}

function creativeEquipAmulet() {
    const amuletId = $('creativeAmuletSelect').value;
    if (!gameData.amuletCounts) gameData.amuletCounts = {};
    if (!gameData.amuletCounts[amuletId]) gameData.amuletCounts[amuletId] = 1;
    equipAmulet(amuletId);
}

function creativeGiveAll() {
    const amount = 50;
    // All base gems
    baseGems.filter(g => !g.isNothing).forEach(g => {
        gameData.foundGems[g.id] = true;
        gameData.gemCounts[g.id] = (gameData.gemCounts[g.id] || 0) + amount;
    });
    // Diamante de Presión
    gameData.foundGems['diamante_presion'] = true;
    gameData.gemCounts['diamante_presion'] = (gameData.gemCounts['diamante_presion'] || 0) + amount;
    // World 2 secret gems
    gameData.foundGems['reversita'] = true;
    gameData.gemCounts['reversita'] = (gameData.gemCounts['reversita'] || 0) + amount;
    gameData.foundGems['metal'] = true;
    gameData.gemCounts['metal'] = (gameData.gemCounts['metal'] || 0) + amount;
    // All fusions (non-amulet)
    Object.keys(fusionRecipes).forEach(key => {
        const r = fusionRecipes[key];
        if (!r.isAmulet) {
            let fusionGem = createdGems.find(g => g.id === r.id);
            if (!fusionGem) {
                const baseGem = baseGems.find(g => g.id === key);
                if (baseGem) {
                    const newRarity = getFusionRarity(r, baseGem);
                    const rd = rarityData[newRarity];
                    fusionGem = {
                        id: r.id, emoji: r.emoji, name: r.name,
                        amount: baseGem.amount * 2, rarity: newRarity,
                        rarityClass: rd.class, neonClass: rd.neon,
                        ...(r.isArtifact ? { isArtifact: true } : {})
                    };
                    createdGems.push(fusionGem);
                }
            }
            gameData.createdCounts[r.id] = (gameData.createdCounts[r.id] || 0) + amount;
        }
    });
    // All amulets (including corona_dios)
    if (!gameData.amuletCounts) gameData.amuletCounts = {};
    Object.keys(fusionRecipes).forEach(key => {
        const r = fusionRecipes[key];
        if (r.isAmulet) {
            gameData.amuletCounts[r.id] = (gameData.amuletCounts[r.id] || 0) + 5;
        }
    });
    updateUI(); saveGame();
    showCustomAlert('🎁', '¡Todo Dado!', 'Recibiste ×50 de cada gema y fusión, ×5 amuletos y ×1 Corona de Dios.');
}

function creativeApplyChances() {
    const inputs = document.querySelectorAll('.creative-chance-input');
    inputs.forEach(input => {
        const gemId = input.dataset.gemId;
        const val = parseFloat(input.value) || 0;
        const gem = baseGems.find(g => g.id === gemId);
        if (gem) gem.chance = val / 100;
    });
    showCustomAlert('🎲', 'Probabilidades Aplicadas', 'Los cambios se reflejarán al rascar.');
}

function creativeResetChances() {
    const originalChances = {
        carbon: 0.25, cuarzo: 0.20, esmeralda: 0.16, hielita: 0.13,
        amatista: 0.11, topacio: 0.08, obsidiana: 0.06, rubi: 0.05,
        zafiro: 0.025, diamante_rosa: 0.01, galaxita: 0.007
    };
    baseGems.filter(g => !g.isNothing).forEach(g => {
        if (originalChances[g.id] !== undefined) g.chance = originalChances[g.id];
    });
    // Actualizar inputs
    const inputs = document.querySelectorAll('.creative-chance-input');
    inputs.forEach(input => {
        const gemId = input.dataset.gemId;
        const gem = baseGems.find(g => g.id === gemId);
        if (gem) input.value = (gem.chance * 100).toFixed(1);
    });
    showCustomAlert('🎲', 'Probabilidades Reseteadas', 'Valores originales restaurados.');
}

function showAlmacenTab(tab) {
    currentAlmacenTab = tab;
    document.querySelectorAll('#almacenModal .tab').forEach((t,i) => {
        const tabs = ['base','created','polished'];
        t.classList.toggle('active', tabs[i] === tab);
    });
    selectedGem = null; selectedGemType = null;

    // Pulidas: NO recordar qué variante estabas viendo.
    // Siempre arrancar por defecto en la PRIMERA variante al entrar a la pestaña.
    if (tab === 'polished' && gameData && gameData.polishedInventory) {
        Object.keys(gameData.polishedInventory).forEach(baseId => {
            const b = ensurePolishedBucket(baseId);
            b.viewIndex = 0;
            b.userSet = false;
        });
    }
    renderAlmacen();
}

function toggleAlmacenSort() {
    almacenSortOrder = almacenSortOrder === 'desc' ? 'asc' : 'desc';
    const btn = $('almacenSortBtn');
    btn.classList.remove('asc', 'desc');
    btn.classList.add(almacenSortOrder);
    renderAlmacen();
}

// Orden de rareza para ordenamiento (Legendario mejor que Mítico)
const rarityOrderSort = ['Común', 'Poco Común', 'Raro', 'Secreto', 'Épico', 'Mítico', 'Legendario', 'Celestial', 'Endgame'];
// Orden de calidad de singularidades
const singularityQualityOrder = ['Normal', 'Pulida', 'Preciosa', 'Dorada', 'Adiamantada', 'Rose', 'Celestial'];

function sortGemsByQualityAndPrice(gems, order) {
    return [...gems].sort((a, b) => {
        const rarityA = rarityOrderSort.indexOf(a.rarity);
        const rarityB = rarityOrderSort.indexOf(b.rarity);
        if (rarityA !== rarityB) {
            return order === 'desc' ? rarityB - rarityA : rarityA - rarityB;
        }
        // Misma rareza: ordenar por precio
        return order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    });
}

function renderAlmacen() {
    const grid = $('almacenGrid');
    grid.innerHTML = '';
    const pct = getAlmacenSellPct();
    
    if (currentAlmacenTab === 'base') {
        let gems = baseGems.filter(g => !g.isNothing);
        // Incluir Diamante de Presión si el jugador tiene al menos 1
        const dpCount = gameData.gemCounts['diamante_presion'] || 0;
        if (dpCount > 0) {
            gameData.foundGems['diamante_presion'] = true;
            gems = [...gems, diamantePresion];
        }
        // Incluir gemas secretas del Mundo 2
        const revCount = gameData.gemCounts['reversita'] || 0;
        if (revCount > 0) {
            gameData.foundGems['reversita'] = true;
            gems = [...gems, reversita];
        }
        const metCount = gameData.gemCounts['metal'] || 0;
        if (metCount > 0) {
            gameData.foundGems['metal'] = true;
            gems = [...gems, metal];
        }
        gems = sortGemsByQualityAndPrice(gems, almacenSortOrder);
        gems.forEach(gem => {
            const found = gameData.foundGems[gem.id];
            const count = gameData.gemCounts[gem.id] || 0;
            const card = createGemCard(gem, found, count, 'base');
            grid.appendChild(card);
        });
    } else if (currentAlmacenTab === 'polished') {
        // Mostrar 1 tarjeta por tipo (baseId), pero cada tipo puede tener múltiples variantes con distinto valor
        let gemsWithCount = polishedGems
            .map(gem => {
                const items = getPolishedItems(gem.baseId);
                const count = items.length;
                const idx = getPolishedViewIndex(gem.baseId);
                const current = items[idx];
                if (!count) return null;
                return { ...gem, amount: current ? current.amount : gem.amount, __variantsCount: count, __variantIndex: idx };
            })
            .filter(Boolean);
        if (gemsWithCount.length === 0) {
            grid.innerHTML = '<p style="color:#888;text-align:center;padding:20px;grid-column:1/-1;font-size:0.65rem;">No tienes gemas pulidas</p>';
        } else {
            gemsWithCount = sortGemsByQualityAndPrice(gemsWithCount, almacenSortOrder);
            gemsWithCount.forEach(gem => {
                const count = gem.__variantsCount || 0;
                const card = createGemCard(gem, true, count, 'polished');
                grid.appendChild(card);
            });
        }
    } else if (currentAlmacenTab === 'created') {
        let fusionGems = [];
        let singularityGems = [];
        
        // Amuletos + Fusiones
        if (gameData.amuletCounts) {
            Object.keys(gameData.amuletCounts).forEach(amuletId => {
                const count = gameData.amuletCounts[amuletId];
                if (count > 0) {
                    let amuletGem;
                    const recipe = Object.values(fusionRecipes).find(r => r.id === amuletId);
                    if (recipe) {
                        const baseKey = Object.keys(fusionRecipes).find(k => fusionRecipes[k].id === amuletId);
                        const baseGem = baseKey ? baseGems.find(g => g.id === baseKey) : null;
                        const amuletRarity = baseGem ? getFusionRarity(recipe, baseGem) : (recipe.baseRarity || 'Poco Común');
                        const rd = rarityData[amuletRarity] || {};
                        amuletGem = { ...recipe, amount: baseGem ? baseGem.amount * 2 : 0, rarity: amuletRarity, rarityClass: rd.class, neonClass: rd.neon };
                    } else {
                        const legacy = createdGems.find(g => g.id === amuletId && g.isLegacy);
                        if (legacy) amuletGem = { ...legacy };
                    }
                    if (amuletGem) fusionGems.push({ gem: amuletGem, count, isAmulet: true });
                }
            });
        }
        
        createdGems.forEach(gem => {
            const count = gameData.createdCounts[gem.id] || 0;
            if (count > 0) fusionGems.push({ gem, count });
        });

        // Singularidades
        if (gameData.singularityCounts) {
            Object.entries(gameData.singularityCounts).forEach(([singId, count]) => {
                if (count > 0) {
                    const recipe = Object.values(singularityRecipes).find(r => r.id === singId);
                    if (recipe) {
                        const baseKey = Object.keys(singularityRecipes).find(k => singularityRecipes[k].id === singId);
                        const baseGem = baseKey ? (baseGems.find(g => g.id === baseKey) || [reversita, metal].find(g => g.id === baseKey)) : null;
                        const tier = getSingularityTier(baseKey || '');
                        const singGem = {
                            id: recipe.id, name: recipe.name, emoji: '🌀',
                            amount: baseGem ? baseGem.amount * 50 : 0,
                            rarity: tier.name, rarityClass: tier.class, neonClass: tier.neon,
                            isSingularity: true
                        };
                        singularityGems.push({ gem: singGem, count });
                    }
                }
            });
        }

        const hasFusions = fusionGems.length > 0;
        const hasSingularities = singularityGems.length > 0;

        if (!hasFusions && !hasSingularities) {
            grid.innerHTML = '<p style="color:#888;text-align:center;padding:20px;grid-column:1/-1;font-size:0.65rem;">No has creado gemas</p>';
        } else {
            // Sub-header: Fusiones
            if (hasFusions) {
                const header = document.createElement('div');
                header.style.cssText = 'grid-column:1/-1;color:#ffd700;font-size:0.75rem;font-weight:700;padding:6px 0 2px;border-bottom:1px solid rgba(255,215,0,0.2);margin-bottom:4px;';
                header.textContent = '⚗️ Fusiones';
                grid.appendChild(header);

                fusionGems.sort((a, b) => {
                    const rarityA = rarityOrderSort.indexOf(a.gem.rarity);
                    const rarityB = rarityOrderSort.indexOf(b.gem.rarity);
                    if (rarityA !== rarityB) return almacenSortOrder === 'desc' ? rarityB - rarityA : rarityA - rarityB;
                    return almacenSortOrder === 'desc' ? b.gem.amount - a.gem.amount : a.gem.amount - b.gem.amount;
                });
                fusionGems.forEach(({ gem, count }) => {
                    const card = createGemCard(gem, true, count, 'created');
                    grid.appendChild(card);
                });
            }

            // Sub-header: Singularidades
            if (hasSingularities) {
                const header = document.createElement('div');
                header.style.cssText = 'grid-column:1/-1;color:#a78bfa;font-size:0.75rem;font-weight:700;padding:6px 0 2px;border-bottom:1px solid rgba(167,139,250,0.2);margin-bottom:4px;' + (hasFusions ? 'margin-top:8px;' : '');
                header.textContent = '🌀 Singularidades';
                grid.appendChild(header);

                singularityGems.sort((a, b) => {
                    const qualA = singularityQualityOrder.indexOf(a.gem.rarity);
                    const qualB = singularityQualityOrder.indexOf(b.gem.rarity);
                    if (qualA !== qualB) return almacenSortOrder === 'desc' ? qualB - qualA : qualA - qualB;
                    return almacenSortOrder === 'desc' ? b.gem.amount - a.gem.amount : a.gem.amount - b.gem.amount;
                });
                singularityGems.forEach(({ gem, count }) => {
                    const card = createGemCard(gem, true, count, 'singularity');
                    grid.appendChild(card);
                });
            }
        }
    }
}

function createGemCard(gem, found, count, type) {
    const card = document.createElement('div');
    card.className = 'gem-card ' + (found ? 'found ' + (gem.neonClass||'') : 'not-found');
    card.dataset.gem = gem.id;
    if (gem.isPolished) {
        card.classList.add('polished-gem');
    }
    if (gem.isAmulet) card.classList.add('amulet-card');
    let chanceHtml = '';
    if (!found && type === 'base' && gem.chance) {
        chanceHtml = `<div class="gem-chance">📊 ${(gem.chance * 100).toFixed(1)}%</div>`;
    }
    const gemDisplay = found ? getGemIcon(gem) : '<div class="gem-text-icon">❓</div>';
    const sellPct = (type === 'polished' || type === 'created' || type === 'singularity') ? 100 : getAlmacenSellPct();
    const sellPrice = Math.floor(gem.amount * (sellPct / 100));
    let sellButtonHtml = '';
    let trashHtml = '';

    // Badge de cantidad (esquina superior izquierda)
    let qtyBadgeHtml = '';
    if (found && count > 0) {
        if (type === 'polished' && gem.baseId) {
            const realIdxRaw = (typeof gem.__variantIndex === 'number') ? gem.__variantIndex : getPolishedViewIndex(gem.baseId);
            const realIdx = Math.max(0, Math.min(count - 1, realIdxRaw));
            qtyBadgeHtml = `<div class="gem-qty-badge">${(realIdx + 1)}/${count}</div>`;
        } else {
            qtyBadgeHtml = `<div class="gem-qty-badge">x${count}</div>`;
        }
    }
    const isArtifactCreated = (type === 'created' && isFusionGemId(gem.id) && gem.isArtifact);
    const isAmuletCard = (type === 'created' && gem.isAmulet);
    const trashSvg = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2z" fill="rgba(255,255,255,0.9)"/><path d="M6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z" fill="rgba(255,255,255,0.75)"/><path d="M10 12v7M14 12v7" stroke="rgba(0,0,0,0.45)" stroke-width="2" stroke-linecap="round"/></svg>`;
    const holdFill = `<span class="gem-btn-hold-fill"></span>`;
    if (found && count > 0 && isAmuletCard) {
        const isEquipped = gameData.equippedAmulet === gem.id;
        if (isEquipped) {
            sellButtonHtml = `<button class="gem-card-use-btn" style="background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="event.stopPropagation(); unequipAmulet()"><span>❌</span><span>Desequipar</span></button>`;
        } else {
            sellButtonHtml = `<button class="gem-card-use-btn" onclick="event.stopPropagation(); equipAmulet('${gem.id}')"><span>✨</span><span>Equipar</span></button>`;
        }
        trashHtml = `<button class="gem-trash-btn" data-gemid="${gem.id}" data-gemtype="amulet" data-count="${count}" aria-label="Eliminar">${holdFill}${trashSvg}</button>`;
    } else if (found && count > 0 && isArtifactCreated) {
        // Artefactos: no se venden
        sellButtonHtml = `<button class="gem-card-pronto-btn" onclick="event.stopPropagation();"><span>⏳</span><span>Pronto</span></button>`;
        trashHtml = `<button class="gem-trash-btn" data-gemid="${gem.id}" data-gemtype="created" data-count="${count}" aria-label="Eliminar">${holdFill}${trashSvg}</button>`;
    } else if (found && count > 0) {
        sellButtonHtml = `<button class="gem-card-sell-btn" data-gemid="${gem.id}" data-gemtype="${type}" data-sellprice="${sellPrice}" data-count="${count}">${holdFill}<span>💰</span><span>${sellPrice.toLocaleString()}</span></button>`;
    }
    // Dots de variantes (pulidas): máximo 4.
    // Si hay más de 4 variantes, el "activo" usa el último dot y ese dot cambia de color gradualmente
    // según el índice (hasta un máximo de 50 variantes para la escala de color).
    const dotsHtml = (type === 'polished' && found && count > 1 && gem.baseId)
        ? (() => {
            const realIdxRaw = (typeof gem.__variantIndex === 'number') ? gem.__variantIndex : getPolishedViewIndex(gem.baseId);
            const realIdx = Math.max(0, Math.min(count - 1, realIdxRaw));
            const dotCount = Math.min(4, count);

            // Helper: interpolate between two hex colors
            const hexToRgb = (hex) => {
                const h = hex.replace('#','');
                return {
                    r: parseInt(h.substring(0,2),16),
                    g: parseInt(h.substring(2,4),16),
                    b: parseInt(h.substring(4,6),16),
                };
            };
            const lerp = (a,b,t) => a + (b-a)*t;
            const rgbToHex = (r,g,b) => {
                const toHex = (x) => Math.round(x).toString(16).padStart(2,'0');
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            };
            const lerpHex = (a,b,t) => {
                const A = hexToRgb(a), B = hexToRgb(b);
                return rgbToHex(lerp(A.r,B.r,t), lerp(A.g,B.g,t), lerp(A.b,B.b,t));
            };
            const overflowColor = (p) => {
                // naranja -> rojo -> violeta -> azul -> azul intenso -> fucsia -> magenta intenso (max 50)
                const stops = ['#f59e0b','#ef4444','#8b5cf6','#3b82f6','#1d4ed8','#d946ef','#ff00ff'];
                const n = stops.length - 1;
                const x = Math.max(0, Math.min(1, p)) * n;
                const i = Math.min(n-1, Math.floor(x));
                const t = x - i;
                return lerpHex(stops[i], stops[i+1], t);
            };

            // Active dot logic
            let activeDot = Math.min(dotCount - 1, realIdx);
            let activeStyle = '';

            if (count > 4 && realIdx >= 3 && dotCount === 4) {
                // Clamp active dot to last, but vary its color based on progress beyond 3
                activeDot = 3;
                const maxIdxForColor = Math.min(49, count - 1); // 50 variantes (0..49)
                const denom = Math.max(1, (maxIdxForColor - 3));
                const idxForColor = Math.min(maxIdxForColor, realIdx);
                const p = (idxForColor - 3) / denom; // 0..1
                const c = overflowColor(p);
                activeStyle = `style="background:${c}; box-shadow: 0 0 10px ${c}99;"`;
            }

            const dots = Array.from({ length: dotCount })
                .map((_, i) => {
                    if (i === activeDot) {
                        // If overflow active, inject style
                        const style = (i === 3 && activeStyle) ? activeStyle : '';
                        const cls = (i === 3 && activeStyle) ? '' : 'active';
                        return `<span class="gem-variant-dot ${cls}" ${style}></span>`;
                    }
                    return `<span class="gem-variant-dot"></span>`;
                })
                .join('');

            return `<div class="gem-variant-dots">${dots}</div>`;
        })()
        : '';
    // Mini source sprite for fusions
    let sourceHtml = '';
    if (found && type === 'created') {
        const sourceKey = Object.keys(fusionRecipes).find(k => fusionRecipes[k].id === gem.id);
        if (sourceKey) {
            const sourceGem = baseGems.find(g => g.id === sourceKey);
            if (sourceGem) {
                sourceHtml = `<div style="display:inline-block;width:14px;height:14px;vertical-align:middle;margin-right:2px;">${getGemIcon(sourceGem)}</div>`;
            }
        }
    }
    card.innerHTML = `
        ${qtyBadgeHtml}
        <div class="gem-emoji">${gemDisplay}</div>
        <div class="gem-name">${found ? gem.name : '???'}</div>
        <div class="gem-value">${found ? (gem.isAmulet ? '📿 Amuleto' : gem.isArtifact ? '🔮 Artefacto' : '+'+gem.amount.toLocaleString()+' 🪙') : '???'}</div>
        <span class="gem-rarity ${gem.rarityClass||''}">${sourceHtml}${gem.rarity}</span>
        ${chanceHtml}
        ${sellButtonHtml}
        ${trashHtml}
        ${dotsHtml}
    `;
    if (found && count > 0) {
        card.onclick = () => {
            const wasSelected = card.classList.contains('selected');
            document.querySelectorAll('#almacenGrid .gem-card').forEach(c => c.classList.remove('selected'));
            if (!wasSelected) card.classList.add('selected');
        };
    }

    // Swipe horizontal dentro de gemas pulidas: permite ver cada variante (sin pisar valores)
    if (type === 'polished' && found && count > 1 && gem.baseId) {
        let startX = 0;
        let startY = 0;
        let tracking = false;
        let handled = false;
        const threshold = 35; // px

        const onDown = (e) => {
            tracking = true;
            handled = false;
            const p = (e.touches && e.touches[0]) ? e.touches[0] : e;
            startX = p.clientX;
            startY = p.clientY;
        };
        const onMove = (e) => {
            if (!tracking || handled) return;
            const p = (e.touches && e.touches[0]) ? e.touches[0] : e;
            const dx = p.clientX - startX;
            const dy = p.clientY - startY;
            // Si es más vertical, dejamos scroll normal
            if (Math.abs(dy) > Math.abs(dx)) return;
            if (Math.abs(dx) < threshold) return;
            handled = true;
            e.preventDefault();

            const baseId = gem.baseId;
            const currentIdx = getPolishedViewIndex(baseId);
            const max = count - 1;
            const nextIdx = dx > 0 ? Math.max(0, currentIdx - 1) : Math.min(max, currentIdx + 1);
            if (nextIdx !== currentIdx) {
                setPolishedViewIndex(baseId, nextIdx);
                renderAlmacen();
            }
        };
        const onUp = () => {
            tracking = false;
        };

        // Preferimos pointer events cuando existe
        if (window.PointerEvent) {
            card.addEventListener('pointerdown', onDown);
            card.addEventListener('pointermove', onMove, { passive: false });
            card.addEventListener('pointerup', onUp);
            card.addEventListener('pointercancel', onUp);
        } else {
            card.addEventListener('touchstart', onDown, { passive: true });
            card.addEventListener('touchmove', onMove, { passive: false });
            card.addEventListener('touchend', onUp);
            card.addEventListener('mousedown', onDown);
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseup', onUp);
        }
    }
    return card;
}

function sellGemDirect(gemId, type) {
    // Pulidas: vender la variante actualmente visible (cada una con su propio valor)
    if (type === 'polished') {
        const baseId = gemId.startsWith('pol_') ? gemId.slice(4) : null;
        if (!baseId) return;
        const items = getPolishedItems(baseId);
        if (!items.length) return;
        const idx = getPolishedViewIndex(baseId);
        const variant = items[idx] || items[items.length - 1];
        const sellPrice = Math.floor((variant.amount || 0) * 1); // 100%
        // Eliminar variante
        items.splice(idx, 1);
        const bucket = ensurePolishedBucket(baseId);
        bucket.viewIndex = Math.min(bucket.viewIndex, Math.max(0, bucket.items.length - 1));
        gameData.polishedCounts[gemId] = items.length;
        addGems(sellPrice);
        renderAlmacen();
        saveGame();
        return;
    }

    // Singularidades
    if (type === 'singularity') {
        if (!gameData.singularityCounts) return;
        const count = gameData.singularityCounts[gemId] || 0;
        if (count <= 0) return;
        const recipe = Object.values(singularityRecipes).find(r => r.id === gemId);
        if (!recipe) return;
        const baseKey = Object.keys(singularityRecipes).find(k => singularityRecipes[k].id === gemId);
        const baseGem2 = baseKey ? (baseGems.find(g => g.id === baseKey) || [reversita, metal].find(g => g.id === baseKey)) : null;
        const singPrice = baseGem2 ? baseGem2.amount * 50 : 0;
        gameData.singularityCounts[gemId]--;
        if (gameData.singularityCounts[gemId] <= 0) delete gameData.singularityCounts[gemId];
        addGems(singPrice);
        renderAlmacen();
        saveGame();
        return;
    }

    const countKey = type === 'created' ? 'createdCounts' : 'gemCounts';
    const count = gameData[countKey][gemId] || 0;
    if (count <= 0) return;
    let gem = null;
    if (type === 'base') gem = baseGems.find(g => g.id === gemId) || [diamantePresion, reversita, metal].find(g => g.id === gemId);
    else if (type === 'polished') gem = polishedGems.find(g => g.id === gemId);
    else if (type === 'created') gem = createdGems.find(g => g.id === gemId);
    if (!gem || gem.isAmulet) return;
    const sellPct = type === 'created' ? 100 : getAlmacenSellPct();
    const sellPrice = Math.floor(gem.amount * (sellPct / 100));
    gameData[countKey][gemId]--;
    addGems(sellPrice);
    if (type === 'base' && gameData.gemCounts[gemId] <= 0) delete gameData.foundGems[gemId];
    renderAlmacen();
    saveGame();
}

function useGodCrownFromAlmacen() {
    if (!gameData.amuletCounts || !gameData.amuletCounts['corona_dios']) return;
    closeAlmacen();
    $('crownConfirmModal').classList.add('show');
}

function getAmuletRarityColor(amuletId) {
    const colorMap = {
        'amuleto_presion': '#3b82f6',   // Poco Común (blue)
        'amuleto_focus': '#3b82f6',     // Poco Común (blue)
        'amuleto_fortuna': '#22c55e',   // Raro (green)
        'amuleto_suerte': '#f97316',    // Mítico (orange)
        'corona_dios': '#ffffff',        // Celestial (white)
        'sol_atrapado': '#22c55e',       // Raro (green)
    };
    return colorMap[amuletId] || 'rgba(34,197,94,0.5)';
}

function getAmuletName(amuletId) {
    const info = amuletDescriptions[amuletId];
    return info ? info.name : amuletId;
}

function getUniqueSvg(id) {
    if (!gemSVGs[id]) return '📿';
    const u = ++gemIconCounter;
    return gemSVGs[id].replace(_reId, `id="$1-${u}"`).replace(_reUrl, `url(#$1-${u})`);
}

function equipAmulet(amuletId) {
    if (!gameData.amuletCounts || !gameData.amuletCounts[amuletId]) return;
    gameData.equippedAmulet = amuletId;
    updateUI();
    renderAlmacen();
    saveGame();
    const sprite = `<div style="width:56px;height:56px;margin:0 auto;">${getUniqueSvg(amuletId)}</div>`;
    showCustomAlert(sprite, '¡Amuleto Equipado!', `Has equipado ${getAmuletName(amuletId)}.`, getAmuletRarityColor(amuletId));
}

function unequipAmulet() {
    const prevId = gameData.equippedAmulet;
    gameData.equippedAmulet = null;
    updateUI();
    renderAlmacen();
    saveGame();
    const sprite = prevId ? `<div style="width:56px;height:56px;margin:0 auto;">${getUniqueSvg(prevId)}</div>` : '📿';
    const borderColor = prevId ? getAmuletRarityColor(prevId) : undefined;
    showCustomAlert(sprite, 'Amuleto Desequipado', 'Ya no tienes ningún amuleto equipado.', borderColor);
}

const amuletDescriptions = {
    'amuleto_presion': {
        name: 'Amuleto Presión',
        desc: 'Cuando rascas, tienes un <strong>25%</strong> de probabilidad de que el <strong>Carbón</strong> se convierta en un <strong>Diamante de Presión</strong> (520🪙).'
    },
    'amuleto_focus': {
        name: 'Amuleto Focus',
        desc: 'Elige una gema objetivo. Al rascar, esa gema tiene <strong>×1.5</strong> probabilidad de aparecer.'
    },
    'amuleto_fortuna': {
        name: 'Amuleto Fortuna',
        desc: 'El costo de raspar baja a <strong>80🪙</strong>. Cada mejora comprada hace que la siguiente sea <strong>3.33%</strong> más barata.'
    },
    'corona_dios': {
        name: 'Corona de Dios',
        desc: 'La reliquia suprema. Puedes activarla desde el Almacén para <strong>duplicar toda tu plata</strong> actual. Uso único.'
    },
    'amuleto_suerte': {
        name: 'Amuleto Suerte',
        desc: 'Tu nivel de suerte sube <strong>+1</strong> internamente. Si tu suerte ya está al MAX, pasa a <strong>MAX Z</strong>, una suerte superior al máximo.'
    },
    'sol_atrapado': {
        name: 'Sol Atrapado',
        desc: 'Una inmensa fuente de calor contenida dentro de una gema, quizás en miles de años libere una fracción de su poder que derretirá todo a su paso.'
    }
};

function getAmuletGradient(amuletId) {
    const gradients = {
        'amuleto_presion': { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.3)', border: '#3b82f6' },
        'amuleto_focus': { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.3)', border: '#3b82f6' },
        'amuleto_fortuna': { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34,197,94,0.3)', border: '#22c55e' },
        'amuleto_suerte': { bg: 'linear-gradient(135deg, #fb923c, #ea580c)', shadow: 'rgba(249,115,22,0.3)', border: '#f97316' },
        'corona_dios': { bg: 'linear-gradient(135deg, #ffd700, #f59e0b)', shadow: 'rgba(255,215,0,0.3)', border: '#ffd700', color: '#1a0a2e' },
        'sol_atrapado': { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', shadow: 'rgba(34,197,94,0.3)', border: '#22c55e' },
    };
    return gradients[amuletId] || { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.3)', border: '#3b82f6' };
}

function openAmuletInfoModal() {
    const amuletId = gameData.equippedAmulet;
    if (!amuletId) return;
    const info = amuletDescriptions[amuletId];
    if (!info) return;
    const modal = $('amuletInfoModal');
    const iconEl = $('amuletInfoIcon');
    iconEl.innerHTML = getUniqueSvg(amuletId);
    iconEl.classList.toggle('sol-atrapado-info', amuletId === 'sol_atrapado');
    $('amuletInfoName').textContent = info.name;
    $('amuletInfoDesc').innerHTML = info.desc;

    // Color the accept button and modal border by rarity
    const grad = getAmuletGradient(amuletId);
    const acceptBtn = $('amuletInfoAcceptBtn');
    acceptBtn.style.background = grad.bg;
    acceptBtn.style.boxShadow = `0 4px 15px ${grad.shadow}`;
    acceptBtn.style.color = grad.color || '#fff';
    const box = document.querySelector('.amulet-info-box');
    box.style.borderColor = grad.border;
    box.style.boxShadow = `0 0 50px ${grad.shadow}, 0 0 100px ${grad.shadow}`;

    // Focus gem selector
    const focusSelector = $('focusGemSelector');
    if (amuletId === 'amuleto_focus') {
        focusSelector.style.display = 'block';
        const select = $('focusGemSelect');
        select.innerHTML = '<option value="">— Sin objetivo —</option>';
        baseGems.filter(g => !g.isNothing).forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = `${g.emoji} ${g.name}`;
            if (gameData.focusGemId === g.id) opt.selected = true;
            select.appendChild(opt);
        });
        // World 2: include reversita and metal in the focus selector
        if ((gameData.world || 1) >= 2) {
            [reversita, metal].forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = `${g.emoji} ${g.name}`;
                if (gameData.focusGemId === g.id) opt.selected = true;
                select.appendChild(opt);
            });
        }
        const currentGem = baseGems.find(g => g.id === gameData.focusGemId)
            || ((gameData.world || 1) >= 2 && [reversita, metal].find(g => g.id === gameData.focusGemId));
        $('focusGemCurrent').textContent = currentGem
            ? `Activo: ${currentGem.emoji} ${currentGem.name} (×1.5 prob.)`
            : 'Ninguna gema seleccionada';
    } else {
        focusSelector.style.display = 'none';
    }

    modal.classList.add('show');
    deferSliders();
}

function setFocusGem(gemId) {
    gameData.focusGemId = gemId || null;
    saveGame();
    const currentGem = baseGems.find(g => g.id === gameData.focusGemId);
    $('focusGemCurrent').textContent = currentGem
        ? `Activo: ${currentGem.emoji} ${currentGem.name} (×1.5 prob.)`
        : 'Ninguna gema seleccionada';
}

function closeAmuletInfoModal() {
    $('amuletInfoModal').classList.remove('show');
}

// ---- Sol Atrapado: replaces the + button when equipped ----
let solAtrapado_pressTimer = null;
let solAtrapado_contourRAF = null;
let solAtrapado_tapBlocked = false;

function initSolAtrapado(el) {
    el.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        solAtrapado_tapBlocked = false;

        // Start contour fill animation + timer for long press (650ms)
        solAtrapado_pressTimer = setTimeout(function() {
            solAtrapado_tapBlocked = true;
            cancelSolAtrapado_contour();
            openAmuletInfoModal();
        }, 650);
        startSolAtrapado_contour(el);
    });

    el.addEventListener('pointerup', function() {
        clearTimeout(solAtrapado_pressTimer);
        cancelSolAtrapado_contour();
        if (!solAtrapado_tapBlocked) {
            // Short tap → open expand modal (same as +)
            openExpandModal();
        }
    });

    el.addEventListener('pointerleave', function() {
        clearTimeout(solAtrapado_pressTimer);
        cancelSolAtrapado_contour();
    });

    el.addEventListener('pointercancel', function() {
        clearTimeout(solAtrapado_pressTimer);
        cancelSolAtrapado_contour();
    });
}

function startSolAtrapado_contour(el) {
    cancelSolAtrapado_contour();

    const contourSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    contourSvg.setAttribute('viewBox', '0 0 44 44');
    contourSvg.setAttribute('class', 'sol-atrapado-contour-svg');
    contourSvg.style.cssText = 'position:absolute;top:-4px;left:-4px;width:44px;height:44px;pointer-events:none;z-index:10;overflow:visible;';

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '22');
    circle.setAttribute('cy', '22');
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#f59e0b');
    circle.setAttribute('stroke-width', '2.5');
    circle.style.filter = 'drop-shadow(0 0 3px rgba(245,158,11,0.6))';

    const totalLen = 2 * Math.PI * 20; // ~125.7
    circle.setAttribute('stroke-dasharray', String(totalLen));
    circle.setAttribute('stroke-dashoffset', String(totalLen));
    circle.setAttribute('stroke-linecap', 'round');
    // Start from the top
    circle.setAttribute('transform', 'rotate(-90 22 22)');

    contourSvg.appendChild(circle);
    el.appendChild(contourSvg);

    const duration = 650;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        circle.setAttribute('stroke-dashoffset', String(totalLen * (1 - progress)));
        if (progress < 1) {
            solAtrapado_contourRAF = requestAnimationFrame(animate);
        }
    }
    solAtrapado_contourRAF = requestAnimationFrame(animate);
}

function cancelSolAtrapado_contour() {
    if (solAtrapado_contourRAF) {
        cancelAnimationFrame(solAtrapado_contourRAF);
        solAtrapado_contourRAF = null;
    }
    const el = document.getElementById('solAtrapado_btn');
    if (el) {
        const old = el.querySelector('.sol-atrapado-contour-svg');
        if (old) old.remove();
    }
}

function openFusion() {
    if (fusionPendingCollect) {
        $('fusionModal').classList.add('show');
        deferSliders();
        return;
    }
    selectedFusionGem = null;
    $('fusionFailDisplay').textContent = getFusionFailChance() + '%';
    renderFusion();
    $('fusionModal').classList.add('show');
    deferSliders();
}

function closeFusion() {
    if (fusionPendingCollect) {
        // Auto-collect instead of trapping the user
        collectFusionResult();
    }
    $('fusionModal').classList.remove('show');
}

// ====== COMPRESORA (Mundo 2) ======
let selectedCompressorGem = null;

function openCompressor() {
    selectedCompressorGem = null;
    renderCompressor();
    $('compressorModal').classList.add('show');
    deferSliders();
}

function closeCompressor() {
    $('compressorModal').classList.remove('show');
}

function renderCompressor() {
    const select = $('compressorSelect');
    const btn = $('compressorBtn');
    const result = $('compressorResult');
    select.innerHTML = '';

    // All base gems + W2 secret gems that have singularity recipes
    // Insert secret gems (reversita, metal) before Épico tier
    const baseFiltered = baseGems.filter(g => !g.isNothing);
    const epicIdx = baseFiltered.findIndex(g => g.rarity === 'Épico');
    const allGems = epicIdx >= 0
        ? [...baseFiltered.slice(0, epicIdx), reversita, metal, ...baseFiltered.slice(epicIdx)]
        : [...baseFiltered, reversita, metal];
    const eligible = allGems.filter(g => singularityRecipes[g.id]);

    eligible.forEach(gem => {
        const isBase = baseGems.includes(gem);
        const count = isBase ? (gameData.gemCounts[gem.id] || 0) : (gameData.gemCounts[gem.id] || 0);
        const recipe = singularityRecipes[gem.id];
        const needed = recipe.cost;
        const card = document.createElement('div');
        card.className = 'gem-select-card' + (count >= needed ? '' : ' disabled') + (selectedCompressorGem && selectedCompressorGem.id === gem.id ? ' selected' : '');
        card.innerHTML = `<div class="gem-select-icon">${getGemIcon(gem)}</div>`;
        if (count >= needed) {
            card.onclick = () => {
                selectedCompressorGem = gem;
                renderCompressor();
            };
        }
        select.appendChild(card);
    });

    if (selectedCompressorGem) {
        const recipe = singularityRecipes[selectedCompressorGem.id];
        result.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <span style="font-size:3.5rem;filter:drop-shadow(0 0 12px ${recipe.glow});color:${recipe.colors[1]};">🗜</span>
            <span style="color:${recipe.glow};font-size:0.7rem;font-weight:600;">${recipe.name}</span>
        </div>`;
        btn.disabled = false;
    } else {
        result.innerHTML = '<span style="color:#555;font-size:2rem;">🗜</span>';
        btn.disabled = true;
    }
}

function executeCompression() {
    if (!selectedCompressorGem) return;
    const recipe = singularityRecipes[selectedCompressorGem.id];
    if (!recipe) return;
    const count = gameData.gemCounts[selectedCompressorGem.id] || 0;
    if (count < recipe.cost) return;

    // Consume gems
    gameData.gemCounts[selectedCompressorGem.id] -= recipe.cost;
    if (gameData.gemCounts[selectedCompressorGem.id] <= 0) {
        delete gameData.gemCounts[selectedCompressorGem.id];
        delete gameData.foundGems[selectedCompressorGem.id];
    }

    // Create singularity
    if (!gameData.singularityCounts) gameData.singularityCounts = {};
    gameData.singularityCounts[recipe.id] = (gameData.singularityCounts[recipe.id] || 0) + 1;

    // Close compressor modal and launch cinematic
    closeCompressor();
    const gem = selectedCompressorGem;
    selectedCompressorGem = null;
    updateUI();
    saveGame();
    setTimeout(() => launchSingularityCinematic(gem, recipe), 300);
}

function launchSingularityCinematic(gem, recipe) {
    const cine = $('singularityCinematic');
    const mass = $('scMass');
    const distortion = $('scDistortion');
    const flash = $('scFlash');
    const result = $('scResult');
    const title = $('scTitle');
    const subtitle = $('scSubtitle');
    const buttons = $('scButtons');
    const collectBtn = $('scCollectBtn');

    const [dark, mid, light] = recipe.colors;
    cine.style.setProperty('--sc-dark', dark);
    cine.style.setProperty('--sc-mid', mid);
    cine.style.setProperty('--sc-glow', light);

    // Reset everything
    cine.querySelectorAll('.sc-gem-particle, .sc-bg-star, .sc-shockwave, .sc-cluster-gem').forEach(e => e.remove());
    mass.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:0;height:0;border-radius:50%;z-index:5;pointer-events:none;';
    distortion.style.width = '0px'; distortion.style.height = '0px';
    flash.style.opacity = '0'; flash.style.transition = '';
    result.classList.remove('revealed');
    result.removeAttribute('style');
    // Generate fresh SVG with unique IDs so gradients/filters render properly
    const singRawSvg = gemSVGs[recipe.id] || '🔮';
    const uR = ++gemIconCounter;
    const singUniqueSvg = singRawSvg.replace(_reId, `id="$1-${uR}"`).replace(_reUrl, `url(#$1-${uR})`);
    result.innerHTML = singUniqueSvg;
    result.style.filter = `drop-shadow(0 0 30px ${light}) drop-shadow(0 0 60px ${mid})`;
    title.classList.remove('visible'); title.textContent = `🌀 ${recipe.name} 🌀`;
    subtitle.classList.remove('visible');
    buttons.classList.remove('visible');

    // Background stars
    for (let i = 0; i < 40; i++) {
        const s = document.createElement('div');
        s.className = 'sc-bg-star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.width = (1 + Math.random() * 2) + 'px';
        s.style.height = s.style.width;
        s.style.background = Math.random() > 0.7 ? light : '#888';
        s.style.opacity = Math.random() * 0.4 + 0.1;
        s.style.animation = `sc-star-float ${6 + Math.random() * 8}s linear infinite`;
        s.style.animationDelay = Math.random() * 5 + 's';
        cine.appendChild(s);
    }

    cine.classList.add('active');

    const W = window.innerWidth;
    const H = window.innerHeight;
    const CX = W / 2;
    const CY = H / 2;
    const gemIcon = getGemIcon(gem);
    const isReversita = gem.id === 'reversita';

    // ── CLUSTER: gems that stick near the center ──
    const clusterGems = [];

    // ── REVERSITA SPECIAL: single growing gem at center ──
    let reversitaCenterEl = null;
    let reversitaScale = 0.4;
    if (isReversita) {
        reversitaCenterEl = document.createElement('div');
        reversitaCenterEl.className = 'sc-cluster-gem';
        reversitaCenterEl.style.cssText = `position:absolute;width:120px;height:120px;pointer-events:none;z-index:5;left:${CX}px;top:${CY}px;transform:translate(-50%,-50%) scale(${reversitaScale});opacity:0.95;transition:transform 0.3s ease-out;`;
        reversitaCenterEl.innerHTML = gemIcon;
        const svgIcon = reversitaCenterEl.querySelector('.gem-svg-icon');
        if (svgIcon) svgIcon.style.cssText = 'width:100%;height:100%;';
        cine.appendChild(reversitaCenterEl);
        clusterGems.push(reversitaCenterEl);
    }

    // Concentric ring layout for dense, uniform mass (normal gems)
    const RING_LAYOUT = [1, 6, 12, 18, 24, 30]; // gems per ring
    let ringIndex = 0;
    let posInRing = 0;
    let currentRingMax = RING_LAYOUT[0];

    function addToCluster() {
        if (isReversita) {
            // Grow the center reversita
            reversitaScale = Math.min(2.2, reversitaScale + 0.012);
            if (reversitaCenterEl) {
                reversitaCenterEl.style.transform = `translate(-50%,-50%) scale(${reversitaScale})`;
            }
            // Grow distortion
            const distSize = Math.min(reversitaScale * 120, 400);
            distortion.style.width = distSize + 'px';
            distortion.style.height = distSize + 'px';
            return;
        }
        const el = document.createElement('div');
        el.className = 'sc-cluster-gem';
        const cSize = 40 + Math.random() * 14; // 40-54px
        el.style.cssText = `position:absolute;width:${cSize}px;height:${cSize}px;pointer-events:none;z-index:5;`;
        el.innerHTML = gemIcon;
        const svgIcon = el.querySelector('.gem-svg-icon');
        if (svgIcon) svgIcon.style.cssText = 'width:100%;height:100%;';

        // Place in concentric rings for dense coverage
        const ringRadius = ringIndex * 18; // balanced ring spacing
        const angleOffset = (Math.random() - 0.5) * 0.45;
        const angle = (posInRing / currentRingMax) * Math.PI * 2 + angleOffset;
        const rJitter = (Math.random() - 0.5) * 11;
        const cx = CX + Math.cos(angle) * (ringRadius + rJitter);
        const cy = CY + Math.sin(angle) * (ringRadius + rJitter);
        const rot = Math.random() * 360;
        const scl = 0.68 + Math.random() * 0.4;
        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
        el.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(${scl})`;
        el.style.opacity = '0.9';
        // Insert the new cluster gem at a random layer (not always on top)
        if (clusterGems.length === 0) {
            cine.appendChild(el);
            clusterGems.push(el);
        } else {
            const insertIdx = Math.floor(Math.random() * (clusterGems.length + 1));
            if (insertIdx >= clusterGems.length) {
                cine.appendChild(el);
            } else {
                const refEl = clusterGems[insertIdx];
                cine.insertBefore(el, refEl);
            }
            clusterGems.splice(insertIdx, 0, el);
        }

        // Advance ring position
        posInRing++;
        if (posInRing >= currentRingMax) {
            posInRing = 0;
            ringIndex++;
            currentRingMax = ringIndex < RING_LAYOUT.length ? RING_LAYOUT[ringIndex] : (RING_LAYOUT[RING_LAYOUT.length - 1] + 6);
        }

        // Grow distortion ring
        const totalRadius = ringIndex * 18 + 40;
        const distSize = Math.min(totalRadius * 3, 400);
        distortion.style.width = distSize + 'px';
        distortion.style.height = distSize + 'px';
    }

    // ── STEADY STREAM: one gem at a time, constant interval ──
    const TOTAL_GEMS = 70;
    const SPAWN_INTERVAL_START = 200; // ms — slow at first
    const SPAWN_INTERVAL_END = 50;    // ms — fast at end (many gems rushing in)
    const FLY_DURATION_START = 2200; // first gems fly slower
    const FLY_DURATION_END = 800;    // last gems fly faster
    let gemsArrived = 0;

    function spawnShockwave() {
        const sw = document.createElement('div');
        sw.className = 'sc-shockwave';
        sw.style.borderColor = light;
        sw.style.animation = 'sc-shockwave-expand 1.2s ease-out forwards';
        cine.appendChild(sw);
        setTimeout(() => sw.remove(), 1200);
    }

    function spawnGemParticle(flyDuration) {
        const el = document.createElement('div');
        el.className = 'sc-gem-particle';
        const size = 48 + Math.random() * 16; // 48-64px
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.innerHTML = gemIcon;
        const svgIcon = el.querySelector('.gem-svg-icon');
        if (svgIcon) svgIcon.style.cssText = 'width:100%;height:100%;';

        // Random spawn from edges
        const edge = Math.floor(Math.random() * 4);
        let sx, sy;
        switch (edge) {
            case 0: sx = Math.random() * W; sy = -60; break;
            case 1: sx = Math.random() * W; sy = H + 60; break;
            case 2: sx = -60; sy = Math.random() * H; break;
            case 3: sx = W + 60; sy = Math.random() * H; break;
        }
        el.style.left = sx + 'px';
        el.style.top = sy + 'px';
        el.style.opacity = '0';
        cine.appendChild(el);

        const duration = flyDuration + Math.random() * 200;
        const startTime = performance.now();
        const offsetAngle = (Math.random() - 0.5) * 0.6;

        function animateParticle(now) {
            const elapsed = now - startTime;
            let t = Math.min(elapsed / duration, 1);
            t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

            const curveX = Math.sin(offsetAngle * Math.PI) * (1 - t) * 80;
            const curveY = Math.cos(offsetAngle * Math.PI) * (1 - t) * 80;
            const x = sx + (CX - sx) * t + curveX;
            const y = sy + (CY - sy) * t + curveY;
            const scale = 1 - t * 0.5;

            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.transform = `translate(-50%,-50%) scale(${scale}) rotate(${t * 300}deg)`;
            el.style.opacity = t < 0.08 ? t * 12 : (t > 0.88 ? (1 - t) * 8 : 1);

            if (t < 1) {
                requestAnimationFrame(animateParticle);
            } else {
                // If we're within the last 1000ms before compression starts, skip adding this gem to the mass
                const now = performance.now();
                if (typeof compressionStartAt === 'number' && now > (compressionStartAt - 1000)) {
                    // just fade/remove the particle quietly
                    el.remove();
                } else {
                    el.remove();
                    gemsArrived++;
                    addToCluster();
                }
            }
        }
        requestAnimationFrame(animateParticle);
    }

    // Spawn gems with accelerating frequency (slow → fast)
    let cumulativeSpawnDelay = 0;
    for (let i = 0; i < TOTAL_GEMS; i++) {
        const progress = i / (TOTAL_GEMS - 1); // 0→1
        const flyDur = Math.round(FLY_DURATION_START - progress * (FLY_DURATION_START - FLY_DURATION_END));
        const interval = Math.round(SPAWN_INTERVAL_START - progress * (SPAWN_INTERVAL_START - SPAWN_INTERVAL_END));
        setTimeout(() => spawnGemParticle(flyDur), cumulativeSpawnDelay);
        cumulativeSpawnDelay += interval;
    }

    // ── FINAL SEQUENCE ── after all gems spawned + last fly time + buffer
    const allSpawnedAt = cumulativeSpawnDelay;
    const totalDuration = allSpawnedAt + FLY_DURATION_END + 600;
    // Absolute timestamp (performance.now) when compression will start
    // compressionStart = now + totalDuration + glowDelay (1000ms)
    let compressionStartAt = performance.now() + totalDuration + 1000;

    setTimeout(() => {
        // ── GLOW PHASE: mass pulses bright to signal it's complete ──
        if (isReversita && reversitaCenterEl) {
            reversitaCenterEl.style.transition = 'filter 0.8s ease-in-out';
            reversitaCenterEl.style.filter = `brightness(1.8) drop-shadow(0 0 40px ${light}) drop-shadow(0 0 80px ${mid})`;
        } else {
            clusterGems.forEach((el) => {
                el.style.transition = 'filter 0.8s ease-in-out, opacity 0.8s ease-in-out';
                el.style.filter = `brightness(1.6) drop-shadow(0 0 12px ${light})`;
                el.style.opacity = '1';
            });
        }
        // Small shockwave to mark mass completion
        spawnShockwave();

        // ── COMPRESSION PHASE: starts after glow settles ──
        setTimeout(() => {
            if (isReversita && reversitaCenterEl) {
                // Reversita: compress down to singularity size
                reversitaCenterEl.style.transition = 'all 1.4s cubic-bezier(.4,0,.2,1)';
                reversitaCenterEl.style.transform = 'translate(-50%,-50%) scale(0.55)';
                reversitaCenterEl.style.filter = `brightness(1.3) drop-shadow(0 0 25px ${light})`;
            } else {
                // Normal: smoothly compress the whole cluster toward center
                const clusterRect = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
                clusterGems.forEach(el => {
                    const left = parseFloat(el.style.left);
                    const top = parseFloat(el.style.top);
                    clusterRect.minX = Math.min(clusterRect.minX, left);
                    clusterRect.maxX = Math.max(clusterRect.maxX, left);
                    clusterRect.minY = Math.min(clusterRect.minY, top);
                    clusterRect.maxY = Math.max(clusterRect.maxY, top);
                });
                const massWidth = clusterRect.maxX - clusterRect.minX;
                const massHeight = clusterRect.maxY - clusterRect.minY;
                const massRadius = Math.max(massWidth, massHeight) / 2;
                // Target: compress to ~35px radius (close to singularity's 140px display)
                const targetRadius = 35;
                const compressionScale = massRadius > 0 ? Math.min(1, targetRadius / massRadius) : 0.3;

                clusterGems.forEach((el) => {
                    const origLeft = parseFloat(el.style.left);
                    const origTop = parseFloat(el.style.top);
                    const origTransform = el.style.transform;
                    const rotMatch = origTransform.match(/rotate\(([^)]+)\)/);
                    const sclMatch = origTransform.match(/scale\(([^)]+)\)/);
                    const origRot = rotMatch ? parseFloat(rotMatch[1]) : 0;
                    const origScl = sclMatch ? parseFloat(sclMatch[1]) : 1;

                    // Move each gem proportionally toward center *without shrinking*
                    const newLeft = CX + (origLeft - CX) * compressionScale;
                    const newTop = CY + (origTop - CY) * compressionScale;
                    // Keep original scale so gems don't shrink; optionally nudge slightly smaller for spacing
                    const newScl = origScl * 0.98; // keep nearly the same size

                    el.style.transition = 'left 1.4s cubic-bezier(.4,0,.2,1), top 1.4s cubic-bezier(.4,0,.2,1), transform 1.4s cubic-bezier(.4,0,.2,1)';
                    el.style.left = newLeft + 'px';
                    el.style.top = newTop + 'px';
                    el.style.transform = `translate(-50%,-50%) rotate(${origRot}deg) scale(${newScl})`;
                    el.style.opacity = '0.85';
                    el.style.filter = `brightness(1.4) drop-shadow(0 0 10px ${light})`;
                });
            }

            // Shrink distortion with the compression
            distortion.style.transition = 'all 1.4s cubic-bezier(.4,0,.2,1)';
            const distTarget = 160;
            distortion.style.width = distTarget + 'px';
            distortion.style.height = distTarget + 'px';

            // After compression completes → flash + reveal singularity
            setTimeout(() => {
            // Remove cluster
            clusterGems.forEach(el => el.remove());
            clusterGems.length = 0;

            // BIG FLASH
            flash.style.transition = 'opacity 0.12s';
            flash.style.opacity = '1';

            // Multiple shockwaves
            for (let i = 0; i < 3; i++) {
                setTimeout(() => spawnShockwave(), i * 200);
            }

            // Screen shake
            cine.style.transition = 'none';
            let shakes = 0;
            const shakeInterval = setInterval(() => {
                const rx = (Math.random() - 0.5) * 14;
                const ry = (Math.random() - 0.5) * 14;
                cine.style.transform = `translate(${rx}px, ${ry}px)`;
                shakes++;
                if (shakes > 14) {
                    clearInterval(shakeInterval);
                    cine.style.transform = '';
                }
            }, 35);

            // Fade flash, hide distortion
            setTimeout(() => {
                flash.style.transition = 'opacity 0.8s';
                flash.style.opacity = '0';
                distortion.style.transition = 'all 0.5s';
                distortion.style.width = '0'; distortion.style.height = '0';
            }, 350);

            // Reveal singularity
            setTimeout(() => {
                result.classList.add('revealed');
            }, 700);

            // Title + subtitle
            setTimeout(() => {
                title.classList.add('visible');
            }, 1100);
            setTimeout(() => {
                subtitle.classList.add('visible');
            }, 1400);

            // Collect button
            setTimeout(() => {
                buttons.classList.add('visible');
                collectBtn.onclick = () => {
                    cine.classList.remove('active');
                    cine.querySelectorAll('.sc-gem-particle, .sc-bg-star, .sc-shockwave, .sc-cluster-gem').forEach(e => e.remove());
                    renderCompressor();
                };
            }, 1700);

        }, 1500); // after compression animation (1.4s transition + 100ms buffer)
        }, 1000); // glow phase duration before compression begins
    }, totalDuration);
}

function renderFusion() {
    const slot1 = $('fusionSlot1');
    const slot2 = $('fusionSlot2');
    const result = $('fusionResult');
    const reel1 = $('reel1');
    const reel2 = $('reel2');
    const reel3 = $('reel3');
    
    slot1.classList.remove('god-fusing', 'filled');
    slot2.classList.remove('god-fusing', 'filled');
    result.classList.remove('god-appearing', 'winner');
    reel1.classList.remove('spinning', 'stopping', 'stopped');
    reel2.classList.remove('spinning', 'stopping', 'stopped');
    reel3.classList.remove('spinning', 'stopping', 'stopped');
    
    if (selectedFusionGem) {
        const gemDisplay = getGemIcon(selectedFusionGem);
        reel1.querySelector('.slot-emoji').innerHTML = gemDisplay;
        slot1.querySelector('.slot-label').textContent = selectedFusionGem.name;
        slot1.classList.add('filled');
        reel2.querySelector('.slot-emoji').innerHTML = gemDisplay;
        slot2.querySelector('.slot-label').textContent = selectedFusionGem.name;
        slot2.classList.add('filled');
        
        const resultValue = selectedFusionGem.amount * 2;
        const recipe = fusionRecipes[selectedFusionGem.id];
        const newRarity = recipe ? getFusionRarity(recipe, selectedFusionGem) : selectedFusionGem.rarity;
        
        if (recipe) {
            const resultDisplay = getGemIcon(recipe);
            reel3.querySelector('.slot-emoji').innerHTML = resultDisplay;
            if (recipe.isAmulet) {
                result.querySelector('.slot-label').innerHTML = `${recipe.name}<br><small style="color:#f472b6">📿 Amuleto</small>`;
            } else if (recipe.isArtifact) {
                result.querySelector('.slot-label').innerHTML = `${recipe.name}<br><small style="color:#c084fc">🔮 Artefacto</small>`;
            } else {
                result.querySelector('.slot-label').innerHTML = `${recipe.name}<br><small style="color:#00ff88">${resultValue.toLocaleString()}🪙 (${newRarity})</small>`;
            }
        } else {
            reel3.querySelector('.slot-emoji').textContent = '🎲';
            result.querySelector('.slot-label').innerHTML = `Aleatoria<br><small style="color:#00ff88">${resultValue.toLocaleString()}🪙 (${newRarity})</small>`;
        }
    } else {
        reel1.querySelector('.slot-emoji').textContent = '❓';
        slot1.querySelector('.slot-label').textContent = 'Gema';
        reel2.querySelector('.slot-emoji').textContent = '❓';
        slot2.querySelector('.slot-label').textContent = 'Igual';
        reel3.querySelector('.slot-emoji').textContent = '✨';
        result.querySelector('.slot-label').textContent = 'Nueva';
    }
    
    // CRITICAL: Don't touch button state when waiting for collect
    if (!fusionPendingCollect) {
        const count = selectedFusionGem ? getGemCount(selectedFusionGem) : 0;
        $('fusionBtn').disabled = !selectedFusionGem || count < 2;
    }
    
    const selectEl = $('fusionSelect');
    selectEl.innerHTML = '';
    
    // If pending collect, show message instead of gem options
    if (fusionPendingCollect) {
        selectEl.innerHTML = '<p style="color:#ffd700;text-align:center;padding:12px;font-size:0.65rem;">⬆️ Recoge el resultado para continuar</p>';
        return;
    }
    
    const fusionable = getFusionableGems();
    if (fusionable.length === 0) {
        selectEl.innerHTML = '<p style="color:#888;text-align:center;padding:12px;font-size:0.6rem;">Necesitas ×2 de una gema en tu almacén</p>';
        return;
    }
    fusionable.forEach(({gem, count, type}) => {
        const opt = document.createElement('div');
        const isSelected = selectedFusionGem?.id === gem.id;
        const canFuse = count >= 2;
        opt.className = 'gem-option' + (isSelected ? ' selected' : '');
        opt.style.opacity = canFuse ? '1' : '0.5';
        const gemDisplay = getGemIcon(gem);
        opt.innerHTML = `
            <div class="opt-emoji">${gemDisplay}</div>
            <div class="opt-name">${gem.name}</div>
            <div class="opt-count" style="color:${canFuse ? '#00ff88' : '#ef4444'};">×${count}</div>
        `;
        if (canFuse) {
            opt.onclick = () => { selectedFusionGem = {...gem, _type: type}; renderFusion(); };
        }
        selectEl.appendChild(opt);
    });
}

function getFusionableGems() {
    const result = [];
    baseGems.filter(g => !g.isNothing).forEach(gem => {
        const count = gameData.gemCounts[gem.id] || 0;
        if (count >= 1) result.push({gem, count, type: 'base'});
    });
    return result;
}

function getGemCount(gem) {
    if (!gem) return 0;
    const type = gem._type || 'base';
    if (type === 'created') return gameData.createdCounts[gem.id] || 0;
    return gameData.gemCounts[gem.id] || 0;
}

function executeFusion() {
    if (!selectedFusionGem) return;
    const type = selectedFusionGem._type || 'base';
    const countKey = type === 'created' ? 'createdCounts' : 'gemCounts';
    const count = gameData[countKey][selectedFusionGem.id] || 0;
    if (count < 2) return;
    
    const failChance = getFusionFailChance();
    
    const slot1 = $('fusionSlot1');
    const slot2 = $('fusionSlot2');
    const result = $('fusionResult');
    const reel1 = $('reel1');
    const reel2 = $('reel2');
    const reel3 = $('reel3');
    const btn = $('fusionBtn');
    
    btn.disabled = true;
    
    const spinItems = [...baseGems];
    if (createdGems.length > 0) spinItems.push(...createdGems);
    
        reel1.classList.add('spinning');
        reel2.classList.add('spinning');
        reel3.classList.add('spinning');
        
        let reel1Stopped = false;
        let reel2Stopped = false;
        
        const spinInterval = setInterval(() => {
            if (!reel1Stopped) {
                const randomGem1 = spinItems[Math.floor(Math.random() * spinItems.length)];
                reel1.querySelector('.slot-emoji').innerHTML = getGemIcon(randomGem1);
            }
            if (!reel2Stopped) {
                const randomGem2 = spinItems[Math.floor(Math.random() * spinItems.length)];
                reel2.querySelector('.slot-emoji').innerHTML = getGemIcon(randomGem2);
            }
            const randomGem3 = spinItems[Math.floor(Math.random() * spinItems.length)];
            reel3.querySelector('.slot-emoji').innerHTML = getGemIcon(randomGem3);
        }, 120);
        
        setTimeout(() => {
            reel1Stopped = true;
            reel1.classList.remove('spinning');
            reel1.classList.add('stopping');
            const gemDisplay = getGemIcon(selectedFusionGem); 
            reel1.querySelector('.slot-emoji').innerHTML = gemDisplay;
            setTimeout(() => {
                reel1.classList.remove('stopping');
                reel1.classList.add('stopped');
            }, 300);
        }, 1500);
        
        setTimeout(() => {
            reel2Stopped = true;
            reel2.classList.remove('spinning');
            reel2.classList.add('stopping');
            const gemDisplay = getGemIcon(selectedFusionGem);
            reel2.querySelector('.slot-emoji').innerHTML = gemDisplay;
            setTimeout(() => {
                reel2.classList.remove('stopping');
                reel2.classList.add('stopped');
            }, 300);
        }, 2500);
        
        setTimeout(() => {
            clearInterval(spinInterval);
            reel3.classList.remove('spinning');
            reel3.classList.add('stopping');
            processResult();
        }, 3600);
    
    function processResult() {
        if (Math.random() * 100 < failChance) {
            reel3.querySelector('.slot-emoji').textContent = '❌';
            result.querySelector('.slot-label').textContent = '¡Falló!';
            setTimeout(() => {
                reel3.classList.remove('stopping');
                reel3.classList.add('stopped');
            }, 300);
            gameData[countKey][selectedFusionGem.id] -= 2;
            if (type === 'base' && gameData.gemCounts[selectedFusionGem.id] <= 0) delete gameData.foundGems[selectedFusionGem.id];
            updateUI();
            setupCollectButton(false);
            saveGame();
            return;
        }
        
        let newGem;
        const recipe = fusionRecipes[selectedFusionGem.id];
        const ingredientValue = selectedFusionGem.amount * 2;
        let newRarity = recipe ? getFusionRarity(recipe, selectedFusionGem) : selectedFusionGem.rarity;
        const rd = rarityData[newRarity];
        
        if (recipe) {
            newGem = createdGems.find(g => g.id === recipe.id);
            if (!newGem) { 
                newGem = { ...recipe, amount: ingredientValue, rarity: newRarity, rarityClass: rd.class, neonClass: rd.neon }; 
                createdGems.push(newGem); 
            }
        } else {
            newGem = generateRandomGem(selectedFusionGem);
            newGem.amount = ingredientValue;
        }
        
        gameData[countKey][selectedFusionGem.id] -= 2;
        if (type === 'base' && gameData.gemCounts[selectedFusionGem.id] <= 0) delete gameData.foundGems[selectedFusionGem.id];
        
        const gemDisplay = getGemIcon(newGem);
        reel3.querySelector('.slot-emoji').innerHTML = gemDisplay;
        result.querySelector('.slot-label').textContent = newGem.name;
        
        setTimeout(() => {
            reel3.classList.remove('stopping');
            reel3.classList.add('stopped');
            result.classList.add('winner');
        }, 300);
        
        if (newGem.isAmulet) {
            gameData.amuletCounts[newGem.id] = (gameData.amuletCounts[newGem.id] || 0) + 1;
        } else {
            gameData.createdCounts[newGem.id] = (gameData.createdCounts[newGem.id] || 0) + 1;
        }
        
        updateUI();
        createConfetti();
        setupCollectButton(true);
        saveGame();
    }
    
    function setupCollectButton(success) {
        const btn = $('fusionBtn');
        fusionPendingCollect = true;
        
        if (success) {
            btn.innerHTML = '📥 Recoger';
            btn.classList.add('collect-btn');
        } else {
            btn.innerHTML = '😢 Continuar';
            btn.classList.remove('collect-btn');
            btn.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
        }
        btn.onclick = collectFusionResult;
        btn.disabled = false;
        
        // Show gold border on machine
        $('fusionSlotsContainer').classList.add('fusion-ready');
        
        // Disable gem selection without calling renderFusion (which would re-disable the button)
        document.querySelectorAll('#fusionSelect .gem-option').forEach(opt => {
            opt.style.opacity = '0.5';
            opt.style.pointerEvents = 'none';
        });
    }
}

function collectFusionResult() {
    fusionPendingCollect = false;
    selectedFusionGem = null;
    
    // Remove fusion-ready class to hide gold border
    $('fusionSlotsContainer').classList.remove('fusion-ready');
    
    // Fully reset button state
    const btn = $('fusionBtn');
    btn.innerHTML = '⚗️ Fusionar';
    btn.onclick = executeFusion;
    btn.classList.remove('collect-btn');
    btn.style.background = ''; // Reset inline style from fail button
    btn.disabled = true;
    
    // Now it's safe to re-render fusion UI
    renderFusion();
    saveGame();
}

function generateRandomGem(src) {
    const targetValue = src.amount * 2;
    const targetRarity = src.rarity;
    const usedNames = [...baseGems.map(g=>g.name), ...createdGems.map(g=>g.name)];
    const usedEmojis = [...baseGems.map(g=>g.emoji), ...createdGems.map(g=>g.emoji)];
    const availNames = randomNames.filter(n => !usedNames.includes(n));
    const availEmojis = randomEmojis.filter(e => !usedEmojis.includes(e));
    const name = availNames.length ? availNames[Math.floor(Math.random()*availNames.length)] : 'Gema #'+(createdGems.length+1);
    const emoji = availEmojis.length ? availEmojis[Math.floor(Math.random()*availEmojis.length)] : '💎';
    const id = 'gen_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
    const rd = rarityData[targetRarity];
    const newGem = { id, emoji, name, amount: targetValue, rarity: targetRarity, rarityClass: rd.class, neonClass: rd.neon };
    createdGems.push(newGem);
    return newGem;
}

function openPolish() {
    selectedPolishGem = null;
    renderPolish();
    $('polishModal').classList.add('show');
    deferSliders();
}

function closePolish() { $('polishModal').classList.remove('show'); }

function renderPolish() {
    const grid = $('polishGrid');
    grid.innerHTML = '';
    selectedPolishGem = null;
    
    const polishable = [];
    baseGems.filter(g => !g.isNothing).forEach(gem => {
        const count = gameData.gemCounts[gem.id] || 0;
        if (count > 0) polishable.push({gem, count, type: 'base'});
    });
    createdGems.forEach(gem => {
        const count = gameData.createdCounts[gem.id] || 0;
        if (count > 0 && !gem.isAmulet) polishable.push({gem, count, type: 'created'});
    });
    
    if (polishable.length === 0) {
        grid.innerHTML = '<p style="color:#888;text-align:center;padding:20px;grid-column:1/-1;font-size:0.65rem;">No tienes gemas para pulir</p>';
        return;
    }
    
    polishable.forEach(({gem, count, type}) => {
        const card = document.createElement('div');
        card.className = 'gem-card found ' + (gem.neonClass||'');
        if (gem.isPolished) card.classList.add('polished-gem');
        
    const afford = canAfford(POLISH_COST);
        
        card.innerHTML = `
            <div class="gem-emoji">${getGemIcon(gem)}</div>
            <div class="gem-name">${gem.name}</div>
            <div class="gem-value">+${gem.amount.toLocaleString()} 🪙</div>
            <span class="gem-rarity ${gem.rarityClass||''}">${gem.rarity}</span>
            <div class="gem-count">×${count}</div>
            <div class="gem-action-area" style="display:none; margin-top:6px;">
                <button class="polish-card-btn" ${!afford ? 'disabled' : ''}>
                    <span>🪙</span><span>500</span>
                </button>
            </div>
        `;
        
        const btn = card.querySelector('.polish-card-btn');
        
        card.onclick = (e) => {
            if (e.target.closest('.polish-card-btn')) return;
            
            selectedPolishGem = {gem, type};
            document.querySelectorAll('#polishGrid .gem-card').forEach(c => {
                c.classList.remove('selected');
                const area = c.querySelector('.gem-action-area');
                if(area) area.style.display = 'none';
            });
            card.classList.add('selected');
            const area = card.querySelector('.gem-action-area');
            if(area) area.style.display = 'block';
        };
        
        btn.onclick = () => {
            selectedPolishGem = {gem, type};
            executePolish();
        };
        
        grid.appendChild(card);
    });
}

function executePolish() {
    if (!selectedPolishGem) return;
    const {gem, type} = selectedPolishGem;
    if (!canAfford(POLISH_COST)) return;
    const countKey = type === 'created' ? 'createdCounts' : 'gemCounts';
    if ((gameData[countKey][gem.id]||0) <= 0) return;
    
    // Cobrar el costo
    if (!spendGems(POLISH_COST)) return;
    gameData[countKey][gem.id]--;
    if (type === 'base' && gameData.gemCounts[gem.id] <= 0) delete gameData.foundGems[gem.id];
    
    updateUI();
    saveGame();
    
    // Lanzar minijuego
    startPolishMinigame(gem, type);
}

// ========== POLISH MINIGAME - RECODIFICADO ==========
const polishGame = {
    active: false,
    caught: 0,
    spawned: 0,
    total: 10,
    gem: null,
    gemType: null,
    spawnTimer: null,
    checkTimer: null,
    arena: null,
    file: null,
    stars: [],
    dragging: false,
    currentX: 0,
    targetX: 0,
    animFrame: null,
    heat: 0,         // 0 a 100
    overheated: false,
    warningTriggered: false
};

function getPolishMultiplier(caught, cleanRun = false) {
    if (caught >= 10 && cleanRun) return 2.2;
    if (caught >= 8) return 2.0;
    if (caught >= 6) return 1.6;
    if (caught >= 2) return 1.2;
    return 1.0;
}

function startPolishMinigame(gem, type) {
    // Limpiar cualquier juego anterior que no haya terminado correctamente
    if (polishGame.active || polishGame.arena) {
        polishCleanup();
    }
    
    polishGame.active = true;
    polishGame.caught = 0;
    polishGame.spawned = 0;
    polishGame.gem = gem;
    polishGame.gemType = type;
    polishGame.stars = [];
    polishGame.dragging = false;
    polishGame.heat = 0;
    polishGame.overheated = false;
    polishGame.warningTriggered = false;
    polishGame.animFrame = null;
    
    $('polishModal').classList.remove('show');
    $('polishMinigameModal').classList.add('show');
    
    polishGame.arena = $('polishArena');
    polishGame.file = $('polishFile');
    polishGame.file.style.background = ''; // reset color
    
    // Limpiar estrellas previas
    polishGame.arena.querySelectorAll('.polish-star').forEach(s => s.remove());
    polishGame.arena.querySelectorAll('.polish-spark').forEach(s => s.remove());
    
    // Mostrar gema
    $('polishGem').innerHTML = getGemIcon(gem);
    $('polishCaught').textContent = '0';
    $('polishMult').textContent = '1.0';
    
    // Centrar lima e inicializar movimiento suave
    // Usamos requestAnimationFrame para asegurar que el modal ya tenga dimensiones (reflow)
    requestAnimationFrame(() => {
        if (!polishGame.active) return; // Si se cerró mientras esperaba
        const arenaW = polishGame.arena.offsetWidth;
        polishGame.currentX = arenaW / 2;
        polishGame.targetX = arenaW / 2;
        polishUpdateFilePos();
        if(polishGame.file) {
            polishGame.file.style.background = ''; // reset visual
            polishGame.file.style.boxShadow = '';
            polishGame.file.style.cursor = 'grab';
        }
        // Siempre iniciar el loop (cancelar el anterior si existe)
        if(polishGame.animFrame) {
            cancelAnimationFrame(polishGame.animFrame);
            polishGame.animFrame = null;
        }
        polishLoop();
    });
    
    // Eventos (removemos primero por si acaso quedaron de antes)
    polishGame.arena.removeEventListener('mousedown', polishDragStart);
    polishGame.arena.removeEventListener('touchstart', polishDragStart);
    document.removeEventListener('mousemove', polishDragMove);
    document.removeEventListener('touchmove', polishDragMove);
    document.removeEventListener('mouseup', polishDragEnd);
    document.removeEventListener('touchend', polishDragEnd);
    
    // Ahora agregamos los nuevos
    polishGame.arena.addEventListener('mousedown', polishDragStart);
    polishGame.arena.addEventListener('touchstart', polishDragStart, { passive: false });
    document.addEventListener('mousemove', polishDragMove);
    document.addEventListener('touchmove', polishDragMove, { passive: false });
    document.addEventListener('mouseup', polishDragEnd);
    document.addEventListener('touchend', polishDragEnd);
    
    // Comenzar juego
    setTimeout(() => {
        polishSpawnStar();
        polishGame.spawnTimer = setInterval(() => {
            if (polishGame.spawned >= polishGame.total) {
                clearInterval(polishGame.spawnTimer);
                setTimeout(polishEnd, 1500);
            } else {
                polishSpawnStar();
            }
        }, 1000);
        
        polishGame.checkTimer = setInterval(polishCheckCollisions, 30);
    }, 500);
}

// Función de limpieza separada
function polishCleanup() {
    polishGame.active = false;
    polishGame.dragging = false;
    if (polishGame.animFrame) {
        cancelAnimationFrame(polishGame.animFrame);
        polishGame.animFrame = null;
    }
    if (polishGame.spawnTimer) {
        clearInterval(polishGame.spawnTimer);
        polishGame.spawnTimer = null;
    }
    if (polishGame.checkTimer) {
        clearInterval(polishGame.checkTimer);
        polishGame.checkTimer = null;
    }
    if (polishGame.arena) {
        polishGame.arena.removeEventListener('mousedown', polishDragStart);
        polishGame.arena.removeEventListener('touchstart', polishDragStart);
    }
    document.removeEventListener('mousemove', polishDragMove);
    document.removeEventListener('touchmove', polishDragMove);
    document.removeEventListener('mouseup', polishDragEnd);
    document.removeEventListener('touchend', polishDragEnd);
    
    // Reset visual de la lima
    if (polishGame.file) {
        polishGame.file.style.cursor = 'grab';
        polishGame.file.style.background = '';
        polishGame.file.style.boxShadow = '';
    }
}

function polishLoop() {
    if (!polishGame.active) return;
    
    // Interpolación suave (Lerp) para movimiento "lento"
    const lerpFactor = 0.08; 
    polishGame.currentX += (polishGame.targetX - polishGame.currentX) * lerpFactor;
    
    // Lógica de Sobrecalentamiento
    const arenaW = polishGame.arena.offsetWidth;
    const center = arenaW / 2;
    const dist = Math.abs(polishGame.currentX - center);
    const safeZone = arenaW * 0.15; // 15% del centro es seguro
    
    if (dist > safeZone) {
        // Calentar si está lejos del centro
        polishGame.heat += 0.4;
    } else {
        // Enfriar si está en el centro
        polishGame.heat -= 0.8;
    }
    
    // Limites de calor
    polishGame.heat = Math.max(0, Math.min(100, polishGame.heat));
    
    // Estado de sobrecalentamiento
    if (polishGame.heat >= 100) {
        polishGame.overheated = true;
    } else if (polishGame.heat <= 0) {
        polishGame.overheated = false;
    }
    
    // Advertencia de calor
    const warningThreshold = 35;
    const isWarning = polishGame.heat > warningThreshold;
    if (isWarning) {
        polishGame.warningTriggered = true;
        // Feedback visual en el HUD si se pierde el bono
        const multEl = $('polishMult');
        if(multEl) multEl.style.color = '#ef4444'; // Rojo si pierde el bono
    } else if (!polishGame.warningTriggered) {
         const multEl = $('polishMult');
         if(multEl) multEl.style.color = '#fbbf24';
    }
    
    const warnEl = $('polishHeatWarning');
    if (warnEl) {
        warnEl.style.opacity = isWarning ? '1' : '0';
    }
    
    // Efectos visuales de calor (Barra)
    if (polishGame.file) {
        if (polishGame.overheated) {
            // Parpadeo rojo intenso
            const blink = Math.floor(Date.now() / 100) % 2 === 0;
            polishGame.file.style.background = blink ? '#ef4444' : '#7f1d1d';
            polishGame.file.style.boxShadow = '0 0 15px #ef4444';
        } else {
            // Gradiente normal a rojo según calor
            if (polishGame.heat > 0) {
                const r = Math.min(255, 228 + (polishGame.heat * 0.27)); // base 228 -> 255
                const g = Math.max(0, 228 - (polishGame.heat * 2.2));   // base 228 -> 0
                const b = Math.max(0, 231 - (polishGame.heat * 2.3));   // base 231 -> 0
                polishGame.file.style.background = `rgb(${r},${g},${b})`;
                polishGame.file.style.boxShadow = `0 4px 12px rgba(${polishGame.heat > 50 ? 255 : 0},0,0,${polishGame.heat/200})`;
            } else {
                polishGame.file.style.background = ''; // reset al CSS original
                polishGame.file.style.boxShadow = ''; 
            }
        }
    }
    
    polishUpdateFilePos();
    
    polishGame.animFrame = requestAnimationFrame(polishLoop);
}

function polishUpdateFilePos() {
    if(polishGame.file) {
        polishGame.file.style.left = polishGame.currentX + 'px';
        polishGame.file.style.transform = 'translateX(-50%)';
    }
}

function polishDragStart(e) {
    if (!polishGame.active) return;
    e.preventDefault();
    polishGame.dragging = true;
    polishGame.file.style.cursor = 'grabbing';
    polishUpdateTarget(e);
}

function polishDragMove(e) {
    if (!polishGame.dragging || !polishGame.active) return;
    e.preventDefault();
    polishUpdateTarget(e);
}

function polishUpdateTarget(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = polishGame.arena.getBoundingClientRect();
    const fileWidth = 140;
    
    let x = clientX - rect.left;
    x = Math.max(fileWidth / 2, Math.min(rect.width - fileWidth / 2, x));
    
    polishGame.targetX = x; // Solo actualizamos objetivo, el loop anima
}

function polishDragEnd() {
    polishGame.dragging = false;
    if (polishGame.file) polishGame.file.style.cursor = 'grab';
}

function polishSpawnStar() {
    if (!polishGame.active) return;
    polishGame.spawned++;
    
    const star = document.createElement('div');
    star.className = 'polish-star';
    star.textContent = '⭐';
    star.dataset.value = '1';
    
    // 50% izquierda, 50% derecha (bien pegado a los bordes)
    const arenaW = polishGame.arena.offsetWidth;
    // Velocidad variable (algunas rápidas 0.8s, otras lentas 1.5s)
    const duration = 0.8 + Math.random() * 0.7;
    star.style.animationDuration = duration + 's';

    if (Math.random() < 0.5) {
        star.classList.add('left');
        star.style.left = (2 + Math.random() * 15) + '%';
    } else {
        star.classList.add('right');
        star.style.right = (2 + Math.random() * 15) + '%';
        star.style.left = 'auto';
    }
    
    star.dataset.hit = 'false';
    polishGame.arena.appendChild(star);
    polishGame.stars.push(star);
    
    // Iniciar caída
    requestAnimationFrame(() => star.classList.add('drop'));
    
    // Remover después de caer
    setTimeout(() => {
        if (star.parentNode && star.dataset.hit === 'false') {
            star.remove();
        }
        const idx = polishGame.stars.indexOf(star);
        if (idx > -1) polishGame.stars.splice(idx, 1);
    }, 1250);
}

function polishCheckCollisions() {
    if (!polishGame.active) return;
    
    // Si está sobrecalentado, no puede atrapar
    if (polishGame.overheated) return;
    
    const fileRect = polishGame.file.getBoundingClientRect();
    const fileLeft = fileRect.left;
    const fileRight = fileRect.right;
    const fileBottom = fileRect.bottom + 15; // punta del triángulo
    
    polishGame.stars.forEach(star => {
        if (star.dataset.hit === 'true') return;
        
        const starRect = star.getBoundingClientRect();
        const starCX = starRect.left + starRect.width / 2;
        const starCY = starRect.top + starRect.height / 2;
        
        // Verificar colisión con zona de la lima
        if (starCX >= fileLeft - 10 && starCX <= fileRight + 10 &&
            starCY >= fileRect.top - 10 && starCY <= fileBottom + 10) {
            
            star.dataset.hit = 'true';
            const starValue = parseInt(star.dataset.value) || 1;
            polishGame.caught += starValue;
            
            // Efecto visual
            star.classList.remove('drop');
            star.classList.add('hit');
            polishCreateSparks(starCX, starCY);
            
            // Actualizar HUD
            $('polishCaught').textContent = polishGame.caught;
            $('polishMult').textContent = getPolishMultiplier(polishGame.caught, !polishGame.warningTriggered).toFixed(1);
            
            setTimeout(() => star.remove(), 200);
        }
    });
}

function polishCreateSparks(x, y) {
    const rect = polishGame.arena.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.className = 'polish-spark';
        spark.style.left = (x - rect.left + (Math.random() - 0.5) * 30) + 'px';
        spark.style.top = (y - rect.top + (Math.random() - 0.5) * 30) + 'px';
        polishGame.arena.appendChild(spark);
        setTimeout(() => spark.remove(), 300);
    }
}

function polishEnd() {
    // Usar función de limpieza centralizada
    polishCleanup();
    
    // Calcular resultado
    const cleanRun = !polishGame.warningTriggered;
    const mult = getPolishMultiplier(polishGame.caught, cleanRun);
    const gem = polishGame.gem;
    
    // Crear el "catálogo" de gema pulida (1 por tipo) y guardar cada variante con su valor
    let polished = polishedGems.find(p => p.baseId === gem.id);
    if (!polished) {
        polished = {
            id: 'pol_' + gem.id,
            baseId: gem.id,
            emoji: gem.emoji,
            name: gem.name + ' Pulida',
            // amount aquí es solo un valor de referencia; el render toma el de la variante seleccionada
            amount: Math.round(gem.amount * mult),
            rarity: gem.rarity,
            rarityClass: gem.rarityClass,
            neonClass: gem.neonClass,
            isPolished: true
        };
        polishedGems.push(polished);
    }

    // Guardar variante (no se pisa el valor previo)
    addPolishedVariant(gem.id, gem.amount * mult, mult);
    
    // Incrementar contador total de pulidas
    gameData.totalPolished = (gameData.totalPolished || 0) + 1;
    
    updateUI();
    createConfetti();
    saveGame();
    
    $('polishMinigameModal').classList.remove('show');
    renderPolish();
}

// ========== SAVE / LOAD SYSTEM ==========
const SAVE_KEY = 'raspadita_gemas_save';
let _saveTimeout = null;

function saveGame() {
    clearTimeout(_saveTimeout);
    _saveTimeout = setTimeout(_doSaveGame, 300);
}

function _doSaveGame() {
    try {
        const saveData = {
            version: 2,
            gameData: gameData,
            createdGems: createdGems,
            polishedGems: polishedGems,
            timestamp: Date.now()
        };
        if (gameBridge) { gameBridge.save(saveData); } else { localStorage.setItem('raspadita_gemas_save', JSON.stringify(saveData)); }
        
        // Mostrar indicador visual
        const indicator = $('saveIndicator');
        if (indicator) {
            indicator.classList.add('show');
            clearTimeout(indicator._hideTimeout);
            indicator._hideTimeout = setTimeout(() => indicator.classList.remove('show'), 1500);
        }
    } catch(e) {
        console.warn('No se pudo guardar:', e);
    }
}

// Migración: rescatar gemas de versiones anteriores que ya no existen en el código
function migrateOrphanedGems(savedCreatedGems, savedPolishedGems) {
    // ── Guard: only run destructive orphan steps once ──
    const alreadyMigrated = gameData._migrationDone;

    // Build lookup maps from original save data to preserve names/prices/rarity
    const savedCreatedMap = {};
    (savedCreatedGems || []).forEach(g => { if (g && g.id) savedCreatedMap[g.id] = g; });
    const savedPolishedMap = {};
    (savedPolishedGems || []).forEach(g => {
        if (g && g.baseId) savedPolishedMap[g.baseId] = g;
        else if (g && g.id) savedPolishedMap[g.id] = g;
    });

    // Helpers
    const fallbackRarities = ['Común', 'Poco Común', 'Raro', 'Épico'];
    const rndRarity = () => fallbackRarities[Math.floor(Math.random() * fallbackRarities.length)];
    const rndPrice  = () => Math.floor(Math.random() * 900 + 100);
    const rndEmoji  = () => randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    const prettify  = id => id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const pick = (saved, key, fallback) => (saved && saved[key]) ? saved[key] : fallback;

    // ══════════════════════════════════════════════════════════════════
    // Step 0: Rebuild catalog entries for KNOWN gems whose counts exist
    //         but whose runtime array entry is missing (always runs)
    // ══════════════════════════════════════════════════════════════════

    // 0a) Fusion recipes → createdGems
    Object.keys(fusionRecipes).forEach(baseKey => {
        const recipe = fusionRecipes[baseKey];
        const id = recipe.id;
        if (createdGems.find(g => g.id === id)) return;
        const inCounts  = (gameData.createdCounts[id] || 0) > 0;
        const inAmulets = gameData.amuletCounts && (gameData.amuletCounts[id] || 0) > 0;
        if (!inCounts && !inAmulets) return;
        const baseGem = baseGems.find(g => g.id === baseKey);
        const rarity = baseGem ? getFusionRarity(recipe, baseGem) : (recipe.baseRarity || 'Poco Común');
        const rd = rarityData[rarity] || {};
        createdGems.push({
            id, emoji: recipe.emoji, name: recipe.name,
            amount: baseGem ? baseGem.amount * 2 : 0,
            rarity, rarityClass: rd.class, neonClass: rd.neon,
            ...(recipe.isArtifact ? { isArtifact: true } : {}),
            ...(recipe.isAmulet  ? { isAmulet: true }  : {})
        });
    });

    // 0b) polishedInventory → polishedGems (for known base gems only)
    Object.keys(gameData.polishedInventory || {}).forEach(baseId => {
        const bucket = gameData.polishedInventory[baseId];
        if (!bucket || !bucket.items || !bucket.items.length) return;
        if (polishedGems.find(g => g.baseId === baseId)) return;
        const base = baseGems.find(g => g.id === baseId) || createdGems.find(g => g.id === baseId);
        if (!base) return; // unknown base → handled by step 4
        polishedGems.push({
            id: 'pol_' + baseId, baseId,
            emoji: base.emoji, name: base.name + ' Pulida',
            amount: base.amount, rarity: base.rarity,
            rarityClass: base.rarityClass, neonClass: base.neonClass,
            isPolished: true
        });
    });

    // If destructive migration already ran, stop here
    if (alreadyMigrated) return;

    // ══════════════════════════════════════════════════════════════════
    // Steps 1-4: Handle truly orphaned gems (unknown IDs)
    //            These steps are destructive (discard/cap) — run once
    // ══════════════════════════════════════════════════════════════════
    const knownIds = new Set([
        ...baseGems.map(g => g.id),
        'diamante_presion', 'reversita', 'metal',
        ...Object.values(fusionRecipes).map(r => r.id),
        ...createdGems.map(g => g.id),
        ...polishedGems.map(g => g.id)
    ]);
    const isOrphan = id => !knownIds.has(id);
    const shouldDiscard = () => Math.random() < 0.33;

    // 1) Orphaned base gems
    const baseOrphans = new Set();
    Object.keys(gameData.gemCounts || {}).forEach(id => {
        if ((gameData.gemCounts[id] || 0) > 0 && isOrphan(id)) baseOrphans.add(id);
    });
    Object.keys(gameData.foundGems || {}).forEach(id => {
        if (gameData.foundGems[id] && isOrphan(id)) baseOrphans.add(id);
    });
    baseOrphans.forEach(id => {
        if (shouldDiscard()) {
            delete gameData.gemCounts[id];
            delete gameData.foundGems[id];
            return;
        }
        const saved = savedCreatedMap[id];
        const rarity = pick(saved, 'rarity', rndRarity());
        const rd = rarityData[rarity] || {};
        baseGems.splice(baseGems.length - 1, 0, {
            id, emoji: pick(saved, 'emoji', rndEmoji()),
            name: pick(saved, 'name', prettify(id)),
            amount: pick(saved, 'amount', rndPrice()),
            rarity, rarityClass: rd.class || 'rarity-comun', neonClass: rd.neon || 'neon-comun',
            chance: 0, isLegacy: true
        });
        knownIds.add(id);
        gameData.gemCounts[id] = 1;
    });

    // 2) Orphaned created gems
    Object.keys(gameData.createdCounts || {}).forEach(id => {
        if ((gameData.createdCounts[id] || 0) <= 0 || !isOrphan(id)) return;
        if (shouldDiscard()) { delete gameData.createdCounts[id]; return; }
        const saved = savedCreatedMap[id];
        const rarity = pick(saved, 'rarity', rndRarity());
        const rd = rarityData[rarity] || {};
        createdGems.push({
            id, emoji: pick(saved, 'emoji', rndEmoji()),
            name: pick(saved, 'name', prettify(id)),
            amount: pick(saved, 'amount', rndPrice()),
            rarity, rarityClass: rd.class || 'rarity-comun', neonClass: rd.neon || 'neon-comun',
            isLegacy: true
        });
        knownIds.add(id);
        gameData.createdCounts[id] = 1;
    });

    // 3) Orphaned amulets
    Object.keys(gameData.amuletCounts || {}).forEach(id => {
        if ((gameData.amuletCounts[id] || 0) <= 0 || !isOrphan(id)) return;
        if (shouldDiscard()) {
            delete gameData.amuletCounts[id];
            if (gameData.equippedAmulet === id) gameData.equippedAmulet = null;
            return;
        }
        const saved = savedCreatedMap[id];
        const rarity = pick(saved, 'rarity', rndRarity());
        const rd = rarityData[rarity] || {};
        createdGems.push({
            id, emoji: pick(saved, 'emoji', rndEmoji()),
            name: pick(saved, 'name', prettify(id)),
            amount: pick(saved, 'amount', rndPrice()),
            rarity, rarityClass: rd.class || 'rarity-comun', neonClass: rd.neon || 'neon-comun',
            isAmulet: true, isLegacy: true
        });
        knownIds.add(id);
        gameData.amuletCounts[id] = 1;
    });

    // 4) Orphaned polished gems
    if (!gameData.polishedCounts) gameData.polishedCounts = {};
    Object.keys(gameData.polishedInventory || {}).forEach(baseId => {
        const bucket = gameData.polishedInventory[baseId];
        if (!bucket || !bucket.items || !bucket.items.length) return;
        const polId = 'pol_' + baseId;
        if (!isOrphan(polId) || polishedGems.find(g => g.baseId === baseId)) return;

        // 50% discard chance for polished orphans
        if (Math.random() < 0.50) {
            delete gameData.polishedInventory[baseId];
            delete gameData.polishedCounts[polId];
            return;
        }

        const savedPol = savedPolishedMap[baseId];
        const base = baseGems.find(g => g.id === baseId) || createdGems.find(g => g.id === baseId);
        const hasName = (savedPol && savedPol.name) || base;

        if (!hasName) {
            // Nameless polished — don't migrate, but compensate if >1 copies
            if (bucket.items.length > 1) {
                const uid = 'undefined_' + baseId;
                if (!createdGems.find(g => g.id === uid)) {
                    const urd = rarityData['Celestial'] || {};
                    createdGems.push({
                        id: uid, emoji: '❔', name: 'Undefined',
                        amount: 23000, rarity: 'Celestial',
                        rarityClass: urd.class, neonClass: urd.neon,
                        isLegacy: true
                    });
                    gameData.createdCounts[uid] = 1;
                }
            }
            delete gameData.polishedInventory[baseId];
            delete gameData.polishedCounts[polId];
            return;
        }

        const rarity = pick(savedPol, 'rarity', base ? base.rarity : rndRarity());
        const rd = rarityData[rarity] || {};
        polishedGems.push({
            id: polId, baseId,
            emoji: pick(savedPol, 'emoji', base ? base.emoji : rndEmoji()),
            name: pick(savedPol, 'name', (base ? base.name : prettify(baseId)) + ' Pulida'),
            amount: pick(savedPol, 'amount', base ? base.amount : rndPrice()),
            rarity, rarityClass: rd.class || 'rarity-comun', neonClass: rd.neon || 'neon-comun',
            isPolished: true, isLegacy: true
        });
        bucket.items = [bucket.items[0]];
        bucket.viewIndex = 0;
        gameData.polishedCounts[polId] = 1;
    });

    // Mark migration as done so destructive steps don't re-run
    gameData._migrationDone = true;
}

function loadGame() {
    try {
        const saved = gameBridge ? gameBridge.loadSync() : localStorage.getItem('raspadita_gemas_save');
        if (!saved) return false;
        const data = JSON.parse(saved);
        if (data.gameData) {
            // Merge saved data onto a safe default to ensure missing keys exist
            gameData = Object.assign(getDefaultGameData(), data.gameData || {});
            // Nunca restaurar mid-favor para evitar bugs
            gameData.favorActive = false;
            
            // Inicializar perfil si no existe
            if (!gameData.profile) gameData.profile = { username: 'Jugador', avatarGemId: null };

            // Migración: si tiene godCrown viejo pero no amuleto, migrar al sistema de amuletos
            if (gameData.hasGodCrown && (!gameData.amuletCounts || !gameData.amuletCounts['corona_dios'])) {
                if (!gameData.amuletCounts) gameData.amuletCounts = {};
                gameData.amuletCounts['corona_dios'] = 1;
                if (!gameData.equippedAmulet) gameData.equippedAmulet = 'corona_dios';
            }
            delete gameData.hasGodCrown;

            // Migración: sol_atrapado pasó de fusión genérica a amuleto equipable
            if (gameData.createdCounts && gameData.createdCounts['sol_atrapado'] > 0) {
                if (!gameData.amuletCounts) gameData.amuletCounts = {};
                gameData.amuletCounts['sol_atrapado'] = (gameData.amuletCounts['sol_atrapado'] || 0) + gameData.createdCounts['sol_atrapado'];
                delete gameData.createdCounts['sol_atrapado'];
            }

            // Migración: si venías de una versión vieja con polishedCounts/amount "pisado",
            // reconstruimos inventario de variantes.
            if (!gameData.polishedInventory || typeof gameData.polishedInventory !== 'object') {
                gameData.polishedInventory = {};
            }
            // Si no hay items cargados pero hay conteos, crear "items" ficticios con el amount actual del catálogo.
            const hasAnyVariant = Object.values(gameData.polishedInventory).some(b => b && Array.isArray(b.items) && b.items.length);
            if (!hasAnyVariant) {
                (data.polishedGems || []).forEach(pg => {
                    if (!pg || !pg.baseId) return;
                    const count = (data.gameData && data.gameData.polishedCounts && data.gameData.polishedCounts[pg.id]) ? data.gameData.polishedCounts[pg.id] : 0;
                    if (!count) return;
                    const bucket = ensurePolishedBucket(pg.baseId);
                    const base = baseGems.find(g => g.id === pg.baseId) || createdGems.find(g => g.id === pg.baseId) || null;
                    const baseAmount = base ? base.amount : (pg.amount || 1);
                    const mult = baseAmount ? (pg.amount / baseAmount) : 1;
                    for (let i = 0; i < count; i++) bucket.items.push({ amount: Math.round(pg.amount || 0), mult: Number(mult) || 1, ts: Date.now() - (count - i) * 1000 });
                    bucket.viewIndex = Math.max(0, bucket.items.length - 1);
                    gameData.polishedCounts[pg.id] = bucket.items.length;
                });
            } else {
                // Mantener contador viejo sincronizado
                Object.keys(gameData.polishedInventory).forEach(baseId => {
                    const b = ensurePolishedBucket(baseId);
                    gameData.polishedCounts['pol_' + baseId] = b.items.length;
                });
            }

            // Al refrescar/entrar: el visor de variantes pulidas debe comenzar en la PRIMERA.
            // El usuario cambia de variante deslizando (eso marca userSet=true).
            Object.keys(gameData.polishedInventory).forEach(baseId => {
                const b = ensurePolishedBucket(baseId);
                b.viewIndex = 0;
                b.userSet = false;
            });
        }
        if (data.createdGems && Array.isArray(data.createdGems)) createdGems = data.createdGems;
        if (data.polishedGems && Array.isArray(data.polishedGems)) polishedGems = data.polishedGems;

        // Migración: rescatar gemas huérfanas de versiones anteriores
        // Pass original save arrays so orphans can preserve their original data
        migrateOrphanedGems(data.createdGems || [], data.polishedGems || []);

        favorMode = false;
        return true;
    } catch(e) {
        console.warn('Error cargando progreso:', e);
        return false;
    }
}

// ========== PROFILE SYSTEM ==========
function getLevelData() {
    const luck = gameData.luckLevel;
    const almacen = gameData.almacenLevel;
    const maxExp = Math.floor((gameData.maxGems - STARTING_MAX) / 10000);
    const foundGemsCount = Object.keys(gameData.foundGems).length;
    const created = Object.keys(gameData.createdCounts).filter(id => (gameData.createdCounts[id] || 0) > 0).length;
    let polished = 0;
    if (gameData.polishedInventory) {
        polished = Object.keys(gameData.polishedInventory).filter(id => {
            const inv = gameData.polishedInventory[id];
            return inv && inv.items && inv.items.length > 0;
        }).length;
    }
    const polCapped = Math.min(5, polished);
    let bonusDorado = 0;
    if (almacen >= 1) bonusDorado++;
    if (created > 0) bonusDorado++;
    if (polished > 0) bonusDorado++;
    // Contorno celeste almacén (mundo 2 con todas las gemas base)
    const _realBaseGems = baseGems.filter(g => !g.isNothing);
    const _hasAllBase = _realBaseGems.every(g => (gameData.gemCounts[g.id] || 0) > 0);
    const _inW2 = (gameData.world || 1) >= 2;
    const _hasW2Gems = _inW2 && (gameData.gemCounts[reversita.id] || 0) > 0 && (gameData.gemCounts[metal.id] || 0) > 0;
    if (_hasAllBase && _hasW2Gems) bonusDorado++;
    // Contorno celeste compresora (todas las singularidades)
    if (gameData.singularityCounts) {
        const totalRecipes = Object.keys(singularityRecipes).length;
        const ownedCount = Object.values(singularityRecipes).filter(r => (gameData.singularityCounts[r.id] || 0) > 0).length;
        if (ownedCount >= totalRecipes) bonusDorado++;
    }
    // Suerte MAX / MAX Z
    if (isLuckMaxed()) bonusDorado++;
    if (isSuerteLuck()) bonusDorado++;
    const level = luck + almacen + maxExp + foundGemsCount + created + polCapped + bonusDorado;
    return {
        level,
        breakdown: [
            { label: 'Suerte', value: luck },
            { label: 'Almacén', value: almacen },
            { label: 'Expansión', value: maxExp },
            { label: 'Gemas', value: foundGemsCount },
            { label: 'Fusiones', value: created },
            { label: 'Pulidas', value: polCapped + (polished > 5 ? '+' : '') },
            { label: '✨ Dorados', value: bonusDorado }
        ]
    };
}
function calculatePlayerLevel() { return getLevelData().level; }

function openLevelInfoModal() {
    const { level, breakdown } = getLevelData();
    $('levelInfoCurrent').textContent = level;
    const container = $('levelInfoItems');
    // Reset stats section to collapsed each time it opens
    const statsSection = $('liStatsSection');
    if (statsSection) statsSection.classList.add('collapsed');
    
    const itemData = [
        { icon: '🍀', label: 'Nivel de Suerte', desc: 'Sube con mejoras de suerte', key: 'Suerte' },
        { icon: '📦', label: 'Nivel de Almacén', desc: 'Sube con mejoras de almacén', key: 'Almacén' },
        { icon: '📈', label: 'Expansiones de Plata', desc: 'Cada +10,000 al máximo de plata', key: 'Expansión' },
        { icon: '💎', label: 'Gemas Descubiertas', desc: 'Tipos únicos de gemas base encontradas', key: 'Gemas' },
        { icon: '⚗️', label: 'Fusiones Creadas', desc: 'Tipos únicos de gemas de fusión creadas', key: 'Fusiones' },
        { icon: '✨', label: 'Gemas Pulidas', desc: 'Tipos únicos de gemas pulidas', key: 'Pulidas' },
        { icon: '🏅', label: 'Bonus Dorados', desc: 'Contornos especiales', key: '✨ Dorados' }
    ];
    
    container.innerHTML = itemData.map(item => {
        const bd = breakdown.find(b => b.label === item.key);
        const val = bd ? bd.value : 0;
        return `<div class="level-info-item">
            <div class="li-icon">${item.icon}</div>
            <div class="li-text">
                <div class="li-label">${item.label}</div>
                <div class="li-desc">${item.desc}</div>
            </div>
            <div class="li-value">+${val}</div>
        </div>`;
    }).join('');
    
    $('levelInfoModal').classList.add('show');
    deferSliders();
}

function closeLevelInfoModal() {
    $('levelInfoModal').classList.remove('show');
}

function openProfileModal() {
    // Inicializar perfil si no existe
    if (!gameData.profile) {
        gameData.profile = { username: 'Jugador', avatarGemId: null };
    }
    
    // Cargar nombre actual
    $('profileNameInput').value = gameData.profile.username || 'Jugador';
    
    // Renderizar grid de avatares
    renderAvatarGrid();
    
    // Limpiar textarea y status
    $('dataTextarea').value = '';
    $('dataStatus').style.display = 'none';
    
    $('profileModal').classList.add('show');
    deferSliders();
}

function closeProfileModal() {
    $('profileModal').classList.remove('show');
}

function saveProfileAndClose() {
    // Guardar nombre
    const newName = $('profileNameInput').value.trim();
    if (newName && newName.length > 0) {
        gameData.profile.username = newName.substring(0, 15);
    }
    
    saveGame();
    updateProfileDisplay();
    closeProfileModal();
}

function renderAvatarGrid() {
    const grid = $('avatarGrid');
    grid.innerHTML = '';
    
    // Obtener todas las gemas base, inserting secret gems before Épico
    const baseFiltered = baseGems.filter(g => !g.isNothing);
    const epicIdx = baseFiltered.findIndex(g => g.rarity === 'Épico');
    const allGems = epicIdx >= 0
        ? [...baseFiltered.slice(0, epicIdx), reversita, metal, ...baseFiltered.slice(epicIdx)]
        : [...baseFiltered, reversita, metal];
    
    allGems.forEach(gem => {
        const div = document.createElement('div');
        div.className = 'avatar-option';
        
        // Verificar si el usuario tiene o tuvo esta gema
        const hasGem = gameData.foundGems[gem.id];
        const isSelected = gameData.profile.avatarGemId === gem.id;
        
        if (!hasGem) {
            div.classList.add('locked');
        }
        if (isSelected) {
            div.classList.add('selected');
        }
        
        div.innerHTML = `<div class="gem-icon">${getGemIcon(gem)}</div>`;
        
        div.onclick = () => {
            if (hasGem || gameData.profile.avatarGemId === gem.id) {
                // Seleccionar este avatar
                gameData.profile.avatarGemId = gem.id;
                renderAvatarGrid(); // Re-renderizar para mostrar selección
            }
        };
        
        grid.appendChild(div);

        // After Topacio, inject singularity avatar buttons for reversita and metal
        if (gem.id === 'topacio') {
            ['reversita', 'metal'].forEach(baseKey => {
                const recipe = singularityRecipes[baseKey];
                if (!recipe) return;
                const count = (gameData.singularityCounts && gameData.singularityCounts[recipe.id]) || 0;
                const hasSing = count > 0 || gameData.profile.avatarGemId === recipe.id;
                const isSelectedSing = gameData.profile.avatarGemId === recipe.id;

                const sdiv = document.createElement('div');
                sdiv.className = 'avatar-option';
                if (!hasSing) sdiv.classList.add('locked');
                if (isSelectedSing) sdiv.classList.add('selected');

                const uS = ++gemIconCounter;
                const svgStr = (gemSVGs[recipe.id] || '🔮').replace(_reId, `id="$1-${uS}"`).replace(_reUrl, `url(#$1-${uS})`);
                sdiv.innerHTML = `<div class="gem-icon"><div class="gem-svg-icon">${svgStr}</div></div>`;
                sdiv.onclick = () => {
                    if (hasSing || isSelectedSing) {
                        gameData.profile.avatarGemId = recipe.id;
                        renderAvatarGrid();
                    }
                };
                grid.appendChild(sdiv);
            });
        }
    });
    
    // Agregar gemas creadas también (skip amulets — they have their own section)
    createdGems.forEach(gem => {
        // Skip amulets to avoid duplicates (corona_dios etc.)
        const recipe = Object.values(fusionRecipes).find(r => r.id === gem.id);
        if (recipe && recipe.isAmulet) return;

        const count = gameData.createdCounts[gem.id] || 0;
        const hasGem = count > 0 || gameData.profile.avatarGemId === gem.id;
        
        const div = document.createElement('div');
        div.className = 'avatar-option';
        
        if (!hasGem && gameData.profile.avatarGemId !== gem.id) {
            div.classList.add('locked');
        }
        if (gameData.profile.avatarGemId === gem.id) {
            div.classList.add('selected');
        }
        
        // Grieta del Mal: show activated (violet effect) version
        if (gem.id === 'grieta_mal') {
            div.innerHTML = `<div class="gem-icon"><div class="gem-svg-icon">${getGrietaEncendidaProfileSVG()}</div></div>`;
        } else {
            div.innerHTML = `<div class="gem-icon">${getGemIcon(gem)}</div>`;
        }
        
        div.onclick = () => {
            if (hasGem || gameData.profile.avatarGemId === gem.id) {
                gameData.profile.avatarGemId = gem.id;
                renderAvatarGrid();
            }
        };
        
        grid.appendChild(div);
    });

    // Agregar amuletos
    const amuletRecipes = Object.values(fusionRecipes).filter(r => r.isAmulet);
    amuletRecipes.forEach(recipe => {
        const count = (gameData.amuletCounts && gameData.amuletCounts[recipe.id]) || 0;
        const hasGem = count > 0 || gameData.profile.avatarGemId === recipe.id;
        const isSelected = gameData.profile.avatarGemId === recipe.id;

        const div = document.createElement('div');
        div.className = 'avatar-option';
        if (!hasGem) div.classList.add('locked');
        if (isSelected) div.classList.add('selected');

        div.innerHTML = `<div class="gem-icon">${getGemIcon(recipe)}</div>`;
        div.onclick = () => {
            if (hasGem || isSelected) {
                gameData.profile.avatarGemId = recipe.id;
                renderAvatarGrid();
            }
        };
        grid.appendChild(div);
    });

    // Agregar singularidades (skip reversita/metal because they were injected earlier)
    Object.entries(singularityRecipes).forEach(([baseKey, recipe]) => {
        if (baseKey === 'reversita' || baseKey === 'metal') return; // already inserted near Topacio
        const count = (gameData.singularityCounts && gameData.singularityCounts[recipe.id]) || 0;
        const hasGem = count > 0 || gameData.profile.avatarGemId === recipe.id;
        const isSelected = gameData.profile.avatarGemId === recipe.id;

        const div = document.createElement('div');
        div.className = 'avatar-option';
        if (!hasGem) div.classList.add('locked');
        if (isSelected) div.classList.add('selected');

        const uS = ++gemIconCounter;
        const svgStr = (gemSVGs[recipe.id] || '🔮').replace(_reId, `id="$1-${uS}"`).replace(_reUrl, `url(#$1-${uS})`);
        div.innerHTML = `<div class="gem-icon"><div class="gem-svg-icon">${svgStr}</div></div>`;
        div.onclick = () => {
            if (hasGem || isSelected) {
                gameData.profile.avatarGemId = recipe.id;
                renderAvatarGrid();
            }
        };
        grid.appendChild(div);
    });
}

function updateProfileDisplay() {
    // Helper: extract first hex or rgb color from an SVG string
    function extractPrimaryColorFromSVG(svg) {
        if (!svg || typeof svg !== 'string') return null;
        // Try hex (#rrggbb or #rgb)
        const hexMatch = svg.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
        if (hexMatch) return '#' + hexMatch[1];
        // Try rgb(...) or rgba(...)
        const rgbMatch = svg.match(/rgba?\([^\)]+\)/);
        if (rgbMatch) return rgbMatch[0];
        return null;
    }

    // Helper: given a gem id / objects, return border and background colors
    function getAvatarColors(gid, gemObj, singRecipe) {
        // Priority: singularity recipe explicit glow/colors -> SVG -> SPRITE_BORDER_COLORS
        let primary = null;
        if (singRecipe) {
            primary = singRecipe.glow || (singRecipe.colors && singRecipe.colors[1]) || null;
        }
        if (!primary && gid && gemSVGs[gid]) {
            primary = extractPrimaryColorFromSVG(gemSVGs[gid]);
        }
        if (!primary && gemObj && SPRITE_BORDER_COLORS[gemObj.id]) {
            primary = SPRITE_BORDER_COLORS[gemObj.id];
        }
        if (!primary) primary = 'rgba(107,114,128,.7)';

        // Normalize hex to rgba with alpha for border; small alpha for background
        function hexToRgba(hex, a) {
            if (hex.indexOf('rgba') === 0 || hex.indexOf('rgb') === 0) return hex;
            const h = hex.replace('#','');
            const r = parseInt(h.length === 3 ? h[0]+h[0] : h.substring(0,2),16);
            const g = parseInt(h.length === 3 ? h[1]+h[1] : h.substring(2,4),16);
            const b = parseInt(h.length === 3 ? h[2]+h[2] : h.substring(4,6),16);
            return `rgba(${r},${g},${b},${a})`;
        }

        const borderColor = (primary.indexOf('#') === 0) ? hexToRgba(primary, 0.85) : primary;
        const bgColor = (primary.indexOf('#') === 0) ? hexToRgba(primary, 0.12) : primary.replace('rgba', 'rgba').replace('rgb(', 'rgba(').replace(')', ',0.12)');
        return { border: borderColor, bg: bgColor };
    }
    // Actualizar nombre
    const usernameEl = $('profileUsername');
    if (usernameEl && gameData.profile) {
        usernameEl.textContent = gameData.profile.username || 'Jugador';
    }
    
    // Actualizar avatar
    const avatarEl = $('profileAvatar');
    if (avatarEl && gameData.profile) {
        const gid = gameData.profile.avatarGemId;
        let gem = gid && (baseGems.find(g => g.id === gid) || createdGems.find(g => g.id === gid)
            || (gid === 'reversita' ? reversita : null) || (gid === 'metal' ? metal : null)
            || Object.values(fusionRecipes).find(r => r.id === gid) || null);
        // Check if it's a singularity
        const singRecipe = gid && Object.values(singularityRecipes).find(r => r.id === gid);
        if (singRecipe) {
            const uA = ++gemIconCounter;
            const svgA = (gemSVGs[singRecipe.id] || '🔮').replace(_reId, `id="$1-${uA}"`).replace(_reUrl, `url(#$1-${uA})`);
            avatarEl.innerHTML = `<div class="avatar-gem avatar-singularity"><div class="gem-svg-icon">${svgA}</div></div>`;
            const cols = getAvatarColors(singRecipe.id, null, singRecipe);
            avatarEl.style.borderColor = cols.border;
            avatarEl.style.background = `radial-gradient(circle at 30% 30%, ${cols.bg} 0%, rgba(0,0,0,0) 60%)`;
        } else if (gem) {
            const isAmulet = !!gem.isAmulet;
            if (gem.id === 'grieta_mal') {
                avatarEl.innerHTML = `<div class="avatar-gem${isAmulet ? ' avatar-amulet' : ''}"><div class="gem-svg-icon">${getGrietaEncendidaProfileSVG()}</div></div>`;
            } else {
                const amuletAttr = isAmulet ? ` data-amulet="${gem.id}"` : '';
                avatarEl.innerHTML = `<div class="avatar-gem${isAmulet ? ' avatar-amulet' : ''}"${amuletAttr}>${getGemIcon(gem)}</div>`;
            }
            const cols = getAvatarColors(gem.id, gem, null);
            avatarEl.style.borderColor = cols.border;
            avatarEl.style.background = `radial-gradient(circle at 30% 30%, ${cols.bg} 0%, rgba(0,0,0,0) 60%)`;
        } else {
            avatarEl.innerHTML = '<div class="avatar-gem"><div class="gem-svg-icon">' + gemSVGs['nada'] + '</div></div>';
            const cols = getAvatarColors('nada', null, null);
            avatarEl.style.borderColor = cols.border;
            avatarEl.style.background = `radial-gradient(circle at 30% 30%, ${cols.bg} 0%, rgba(0,0,0,0) 60%)`;
        }
    }
    
    // Actualizar nivel
    const levelEl = $('profileLevel');
    if (levelEl) {
        levelEl.textContent = calculatePlayerLevel();
    }

    // Show/hide gema_poder icon next to level
    const gpIcon = $('gemaPodeIcon');
    if (gpIcon) {
        const gpCount = gameData.createdCounts['gema_poder'] || 0;
        if (gpCount > 0) {
            gpIcon.style.display = '';
            const svgEl = $('gemaPodeIconSvg');
            if (svgEl && !svgEl.innerHTML) {
                svgEl.innerHTML = gemSVGs['gema_poder'] || '💜';
            }
        } else {
            gpIcon.style.display = 'none';
        }
    }

    // Update finales medal slots
    updateFinalesMedals();
}

// ---- Finales menu (medal slots) ----
function toggleFinalesMenu() {
    const menu = $('finalesMenu');
    if (!menu) return;
    if (menu.classList.contains('show')) {
        closeFinalesMenu();
    } else {
        menu.classList.add('show');
        // Only hide header buttons if the menu overlaps them
        const hb = document.querySelector('.header-buttons');
        if (hb) {
            requestAnimationFrame(function() {
                const mr = menu.getBoundingClientRect();
                const hr = hb.getBoundingClientRect();
                if (mr.right > hr.left && mr.left < hr.right && mr.bottom > hr.top && mr.top < hr.bottom) {
                    hb.style.display = 'none';
                }
            });
        }
    }
}

function closeFinalesMenu() {
    const menu = $('finalesMenu');
    if (menu) menu.classList.remove('show');
    const hb = document.querySelector('.header-buttons');
    if (hb) hb.style.display = '';
}

function updateFinalesMedals() {
    const isW2 = (gameData.world || 1) >= 2;
    const slotsContainer = document.querySelector('.finales-menu-slots');
    
    if (isW2 && slotsContainer) {
        // In World 2, show "Mundo 2" text instead of medal slots
        // Keep same dimensions as the 3-slot layout (3×24px + 2×4px gaps = 80px)
        slotsContainer.innerHTML = '<div style="color:#67e8f9;font-size:0.7rem;font-weight:700;text-align:center;width:80px;height:24px;display:flex;align-items:center;justify-content:center;letter-spacing:1px;text-shadow:0 0 10px rgba(103,232,249,0.5);">Mundo 2</div>';
        return;
    }
    
    // Slot 0: Medallón de Final (cryo ending)
    const slot0 = $('medalSlot0');
    if (slot0) {
        if (gameData.medallonFinal) {
            slot0.classList.add('unlocked');
            slot0.title = 'Medallón de Final';
            // Replace lock with the medal SVG (with unique IDs)
            const u = ++gemIconCounter;
            const svg = (gemSVGs['medallon_final'] || '').replace(_reId, `id="$1-m${u}"`).replace(_reUrl, `url(#$1-m${u})`);
            slot0.innerHTML = `<div class="medal-icon-inner">${svg}</div>`;
        } else {
            slot0.classList.remove('unlocked');
            slot0.title = 'Próximamente';
            slot0.innerHTML = '<span class="medal-placeholder">🔒</span>';
        }
    }
    // Slots 1, 2: future medals (stay locked)
}

function exportGameData() {
    try {
        // Filtrar solo valores no vacíos/no cero
        const filterObj = (obj) => {
            const r = {};
            for (let k in obj) {
                if (obj[k] && obj[k] !== 0) r[k] = obj[k];
            }
            return Object.keys(r).length ? r : null;
        };
        
        // Simplificar polishedInventory (solo guardar items necesarios)
        const simplifyPI = (pi) => {
            const r = {};
            for (let k in pi) {
                if (pi[k] && pi[k].items && pi[k].items.length) {
                    r[k] = pi[k].items.map(i => [i.amount, i.mult]);
                }
            }
            return Object.keys(r).length ? r : null;
        };
        
        // Exportar solo lo esencial (sin redundancias)
        const d = {
            v: 5,
            t: gameData.totalGems,
            m: gameData.maxGems,
            a: gameData.almacenLevel,
            l: gameData.luckLevel,
            tp: gameData.totalPolished
        };
        
        // Amuletos
        const ac = filterObj(gameData.amuletCounts);
        if (ac) d.ac = ac;
        if (gameData.equippedAmulet) d.ea = gameData.equippedAmulet;
        if (gameData.focusGemId) d.fg = gameData.focusGemId;
        if (gameData.fortunaUpgradesBought) d.fu = gameData.fortunaUpgradesBought;
        
        // Solo incluir si tienen datos
        const f = filterObj(gameData.foundGems);
        const c = filterObj(gameData.gemCounts);
        const cc = filterObj(gameData.createdCounts);
        const pc = filterObj(gameData.polishedCounts);
        const pi = simplifyPI(gameData.polishedInventory);
        const cg = filterObj(gameData.cursedGems);
        
        if (f) d.f = f;
        if (c) d.c = c;
        if (cc) d.cc = cc;
        if (pc) d.pc = pc;
        if (pi) d.pi = pi;
        if (cg) d.cg = cg;
        
        // Perfil simplificado
        if (gameData.profile) {
            d.p = {};
            if (gameData.profile.username && gameData.profile.username !== 'Jugador') {
                d.p.n = gameData.profile.username;
            }
            if (gameData.profile.avatarGemId) {
                d.p.a = gameData.profile.avatarGemId;
            }
            if (!Object.keys(d.p).length) delete d.p;
        }
        
        const jsonStr = JSON.stringify(d);
        const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
        
        $('dataTextarea').value = base64;
        
        navigator.clipboard.writeText(base64).then(() => {
            showDataStatus('✅ Copiado! (' + base64.length + ' chars)', 'success');
        }).catch(() => {
            showDataStatus('✅ Exportado (' + base64.length + ' chars)', 'success');
        });
    } catch (e) {
        console.error('Export error:', e);
        showDataStatus('❌ Error: ' + e.message, 'error');
    }
}

function copyExportData() {
    const textarea = $('dataTextarea');
    const text = textarea.value.trim();
    
    if (!text) {
        showDataStatus('⚠️ Primero exporta tus datos', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = $('copyDataBtn');
        btn.classList.add('copied');
        btn.textContent = '✓';
        showDataStatus('✅ Copiado al portapapeles!', 'success');
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '📋';
        }, 2000);
    }).catch(() => {
        textarea.select();
        document.execCommand('copy');
        showDataStatus('✅ Copiado!', 'success');
    });
}

function importGameData() {
    const base64 = $('dataTextarea').value.trim();
    if (!base64) {
        showDataStatus('⚠️ Pega los datos primero', 'error');
        return;
    }
    
    // Decodificar base64
    let jsonStr;
    try {
        jsonStr = decodeURIComponent(escape(atob(base64)));
    } catch (e1) {
        try {
            jsonStr = atob(base64);
        } catch (e2) {
            showDataStatus('❌ Código inválido', 'error');
            return;
        }
    }
    
    let data;
    try {
        data = JSON.parse(jsonStr);
    } catch (e) {
        showDataStatus('❌ Formato incorrecto', 'error');
        return;
    }
    
    let importedGameData;
    
    if (data.v === 5) {
        // Formato v5 ultra compacto
        const rebuildPI = (pi) => {
            if (!pi) return {};
            const r = {};
            for (let k in pi) {
                r[k] = {
                    items: pi[k].map(arr => ({ amount: arr[0], mult: arr[1], ts: Date.now() })),
                    viewIndex: 0
                };
            }
            return r;
        };
        
        importedGameData = {
            totalGems: data.t || 1000,
            maxGems: data.m || 10000,
            almacenLevel: data.a || 0,
            luckLevel: data.l || 0,
            foundGems: data.f || {},
            gemCounts: data.c || {},
            createdCounts: data.cc || {},
            polishedCounts: data.pc || {},
            polishedInventory: rebuildPI(data.pi),
            amuletCounts: data.ac || (data.gc === 1 ? { 'corona_dios': 1 } : {}),
            equippedAmulet: data.ea || (data.gc === 1 ? 'corona_dios' : null),
            focusGemId: data.fg || null,
            fortunaUpgradesBought: data.fu || 0,
            cursedGems: data.cg || {},
            totalPolished: data.tp || 0,
            profile: {
                username: (data.p && data.p.n) || 'Jugador',
                avatarGemId: (data.p && data.p.a) || null
            },
            settings: {}
        };
    } else if (data.v === 4 && data.g) {
        // Formato v4
        importedGameData = {
            totalGems: data.g.t || 1000,
            maxGems: data.g.m || 10000,
            almacenLevel: data.g.a || 0,
            luckLevel: data.g.l || 0,
            foundGems: data.g.f || {},
            gemCounts: data.g.c || {},
            createdCounts: data.g.cc || {},
            polishedCounts: data.g.pc || {},
            polishedInventory: data.g.pi || {},
            amuletCounts: data.g.gc ? { 'corona_dios': 1 } : {},
            equippedAmulet: data.g.gc ? 'corona_dios' : null,
            cursedGems: data.g.cg || {},
            totalPolished: data.g.tp || 0,
            profile: data.g.p || { username: 'Jugador', avatarGemId: null },
            settings: data.g.s || {}
        };
    } else if (data.gameData) {
        // Formato viejo
        importedGameData = data.gameData;
    } else {
        showDataStatus('❌ Datos no reconocidos', 'error');
        return;
    }
    
    // Confirmar importación con modal personalizado
    showCustomConfirm('⚠️', '¿Importar datos?', 'Esto reemplazará TODOS tus datos actuales. Esta acción no se puede deshacer.').then(confirmed => {
            if (confirmed) {
                // Merge imported data onto defaults to avoid missing keys
                gameData = Object.assign(getDefaultGameData(), importedGameData || {});
                gameData.favorActive = false;
            
            saveGame();
            updateUI();
            applyWorldTheme();
            updateProfileDisplay();
            
            showDataStatus('✅ Importado!', 'success');
            
            setTimeout(() => {
                closeProfileModal();
                location.reload();
            }, 1200);
        }
    });
}

// ========== CUSTOM DIALOGS ==========
function showCustomAlert(icon, title, message, borderColor) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-dialog-overlay';
        const borderStyle = borderColor ? `border-color:${borderColor};` : '';
        const btnStyle = borderColor ? `style="background:linear-gradient(135deg,${borderColor},${borderColor}cc);"` : '';
        overlay.innerHTML = `
            <div class="custom-dialog success" style="${borderStyle}">
                <div class="custom-dialog-icon">${icon}</div>
                <div class="custom-dialog-title">${title}</div>
                <div class="custom-dialog-message">${message}</div>
                <div class="custom-dialog-buttons">
                    <button class="custom-dialog-btn ok" ${btnStyle}>Aceptar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.ok').onclick = () => {
            overlay.remove();
            resolve();
        };
        
        // Cerrar con click fuera
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve();
            }
        };
    });
}

function showCustomConfirm(icon, title, message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'custom-dialog-overlay';
        overlay.innerHTML = `
            <div class="custom-dialog warning">
                <div class="custom-dialog-icon">${icon}</div>
                <div class="custom-dialog-title">${title}</div>
                <div class="custom-dialog-message">${message}</div>
                <div class="custom-dialog-buttons">
                    <button class="custom-dialog-btn cancel">Cancelar</button>
                    <button class="custom-dialog-btn confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.cancel').onclick = () => {
            overlay.remove();
            resolve(false);
        };
        
        overlay.querySelector('.confirm').onclick = () => {
            overlay.remove();
            resolve(true);
        };
        
        // Cerrar con click fuera = cancelar
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(false);
            }
        };
    });
}

function showDataStatus(message, type) {
    const status = $('dataStatus');
    status.textContent = message;
    status.className = 'data-status ' + type;
    status.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

function openSettings() {
    if (!gameData.settingsOpened) {
        gameData.settingsOpened = true;
        updateUI();
        saveGame();
    }
    $('settingsModal').classList.add('show');
    deferSliders();
}

function closeSettings() {
    $('settingsModal').classList.remove('show');
}

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Entrar a pantalla completa
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        // Salir de pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Reescalar cuando cambia fullscreen
function onFullscreenChange() {
    const wrapper = $('gameWrapper');
    if (!wrapper) return;
    
    // Resetear escala inmediatamente
    wrapper.style.zoom = '';
    wrapper.style.transform = '';
    
    // Esperar a que el viewport se estabilice completamente
    setTimeout(() => {
        // Forzar reflow
        void wrapper.offsetHeight;
        
        // Recalcular escala
        const viewportHeight = window.innerHeight;
        const contentHeight = wrapper.scrollHeight;
        
        if (contentHeight > 0) {
            let scale = (viewportHeight * 0.95) / contentHeight;
            scale = Math.max(0.85, Math.min(2.0, scale));
            
            // Aplicar nueva escala
            if ('zoom' in document.body.style) {
                wrapper.style.zoom = String(scale);
            } else {
                wrapper.style.transform = `scale(${scale})`;
                wrapper.style.transformOrigin = 'top center';
            }
        }
    }, 300);
}

// Listeners para fullscreen change
document.addEventListener('fullscreenchange', onFullscreenChange);
document.addEventListener('webkitfullscreenchange', onFullscreenChange);

function confirmResetGame() {
    closeSettings();
    resetGame();
}

function resetGame() {
    // Mostrar modal de confirmación bonito
    const overlay = document.createElement('div');
    overlay.id = 'resetConfirmOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);display:flex;justify-content:center;align-items:center;z-index:500;padding:15px;';
    overlay.innerHTML = `
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;max-width:340px;width:100%;text-align:center;border:2px solid rgba(239,68,68,0.5);box-shadow:0 25px 60px rgba(0,0,0,0.6);">
            <div style="font-size:3rem;margin-bottom:10px;">⚠️</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:1.3rem;color:#ef4444;margin-bottom:10px;">¿Reiniciar Progreso?</h2>
            <p style="color:#a0a0a0;font-size:0.8rem;margin-bottom:8px;">Se perderán <strong style="color:#ffd700;">TODAS</strong> tus gemas, mejoras, gemas creadas, pulidas y todo tu progreso.</p>
            <p style="color:#ef4444;font-size:0.7rem;font-weight:700;margin-bottom:20px;">¡Esta acción NO se puede deshacer!</p>
            <div style="display:flex;gap:10px;justify-content:center;">
                <button onclick="confirmReset()" style="padding:12px 24px;font-family:'Poppins',sans-serif;font-size:0.85rem;font-weight:700;color:white;background:linear-gradient(135deg,#ef4444,#dc2626);border:none;border-radius:12px;cursor:pointer;flex:1;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">🗑️ Sí, Reiniciar</button>
                <button onclick="cancelReset()" style="padding:12px 24px;font-family:'Poppins',sans-serif;font-size:0.85rem;font-weight:700;color:white;background:linear-gradient(135deg,#6b7280,#4b5563);border:none;border-radius:12px;cursor:pointer;flex:1;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function confirmReset() {
    // Borrar save
    (gameBridge ? gameBridge.clearLocal() : localStorage.removeItem('raspadita_gemas_save'));
    
    // Resetear todo el estado
    createdGems = [];
    polishedGems = [];
    resetCheatState();
    gameData = getDefaultGameData();
    favorMode = false;
    currentFavorPrize = null;
    ticketStack = [];
    currentTicket = null;
    isScratching = false;
    fusionPendingCollect = false;
    canPlay = false;
    revealed = false;
    canvas = null;
    ctx = null;
    
    // Resetear UI del ticket
    const card = $('scratchCard');
    card.innerHTML = '<div class="empty-ticket-message">🎫 Compra un ticket para jugar</div>';
    card.classList.remove('broken');
    setProgress(0);
    $('favorBtn').classList.remove('active');
    $('favorInfo').style.display = 'none';
    
    // Cerrar todos los modales por si acaso
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    $('winMessage').classList.remove('show');
    
    updateUI();
    applyWorldTheme();
    cancelReset();
}

function cancelReset() {
    const overlay = $('resetConfirmOverlay');
    if (overlay) overlay.remove();
}

// ========== GOD CROWN CINEMATIC ==========
function launchGodCrownCinematic() {
    const cine = $('godCrownCinematic');
    const gem1 = $('gcGem1');
    const gem2 = $('gcGem2');
    const flash = $('gcFlash');
    const crown = $('gcCrown');
    const title = $('gcTitle');
    const subtitle = $('gcSubtitle');
    const buttons = $('gcButtons');
    const particlesContainer = $('gcParticles');
    
    // Reset everything
    [gem1, gem2].forEach(g => { g.style.cssText = ''; g.style.opacity = '1'; });
    
    // Limpiar blockers anteriores si existen
    cine.querySelectorAll('.gc-blocker').forEach(b => b.remove());
    
    flash.style.cssText = '';
    flash.style.opacity = '0';
    crown.style.cssText = '';
    crown.style.opacity = '0';
    crown.style.transform = 'translate(-50%, -50%) scale(0)';
    crown.classList.remove('revealed');
    title.classList.remove('visible');
    subtitle.classList.remove('visible');
    buttons.classList.remove('visible');
    particlesContainer.innerHTML = '';
    cine.querySelectorAll('.gc-shockwave').forEach(s => s.remove());
    cine.style.transform = '';
    
    // Insert SVGs
    const galaxySvg = gemSVGs['galaxita'] || '🌌';
    const crownSvg = gemSVGs['corona_dios'] || '👑';
    gem1.innerHTML = galaxySvg;
    gem2.innerHTML = galaxySvg;
    
    // Capturar círculos internos para transparencia
    // IMPORTANTE: Ahora el primer circulo es el BLOQUEADOR NEGRO.
    // Queremos animar el SEGUNDO círculo (main-body) con el gradiente.
    const circle1 = gem1.querySelector('.main-body') || gem1.querySelectorAll('circle')[1];
    const circle2 = gem2.querySelector('.main-body') || gem2.querySelectorAll('circle')[1];
    
    // Modo mezcla: normal para bloquear estrellas con el círculo negro
    gem1.style.mixBlendMode = 'normal';
    gem2.style.mixBlendMode = 'normal';
    
    crown.innerHTML = crownSvg;
    
    // Show cinematic
    cine.classList.add('active');
    document.body.classList.add('gc-input-locked');
    
    // Spawn ambient particles (stars)
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'gc-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.background = Math.random() > 0.8 ? '#fff' : '#a78bfa';
        p.style.opacity = Math.random() * 0.5 + 0.2;
        p.style.width = (1 + Math.random() * 2) + 'px';
        p.style.height = p.style.width;
        particlesContainer.appendChild(p);
    }
    
    const W = window.innerWidth;
    const H = window.innerHeight;
    const CX = W / 2;
    const CY = H / 2;

    const GEM_SIZE = 90;
    const HALF_GEM = GEM_SIZE / 2;
    
    // Configuración de la trayectoria
    // Para una transición suave recta -> espiral, entramos tangencialmente.
    // Gema 1 (Derecha) entra por arriba del centro (Y - R), moviéndose a la Izquierda.
    // En el punto (CX, CY-R) la tangente de un círculo es precisamente Hacia la Izquierda.
    // Gema 2 (Izquierda) entra por abajo del centro (Y + R), moviéndose a la Derecha.
    
    const ORBIT_R_START = 140; // Radio donde empieza la curva
    const SPEED = 18; // Velocidad AUMENTADA (era 12) para fase inicial rápida
    
    // Fase 1: Aproximación Lineal
    // Gema 1: Viene de derecha a izquierda
    let g1 = { x: W + 150, y: CY - ORBIT_R_START, angle: 0 };
    // Gema 2: Viene de izquierda a derecha
    let g2 = { x: -150, y: CY + ORBIT_R_START, angle: 0 };
    
    let phase = 'approach'; // approach, spiral, merge
    let spiralRadius = ORBIT_R_START;
    // Ángulos iniciales para la fase espiral
    let angleShift = -Math.PI / 2; 
    let spiralSpeed = SPEED / ORBIT_R_START; 
    
    const gems = [gem1, gem2];
    
    // Crear Lentes Independientes (Layer separado para no distorsionarse entre sí)
    // Z-index: Lenses(10) < Gems(20). 
    const lens1 = document.createElement('div');
    lens1.className = 'gc-lens';
    cine.appendChild(lens1);

    const lens2 = document.createElement('div');
    lens2.className = 'gc-lens';
    cine.appendChild(lens2);
    
    // Crear "Blockers" oscuros independientes
    // Estos estarán detrás de las gemas para bloquear estrellas, pero no afectar la mezcla entre gemas
    // Z-Index: 15 (Encima de lentes/fondo, debajo de gemas)
    const blocker1 = document.createElement('div');
    blocker1.className = 'gc-blocker';
    blocker1.style.cssText = 'position:absolute; width:90px; height:90px; border-radius:50%; background:#0a0015; z-index:15; pointer-events:none;';
    cine.appendChild(blocker1);

    const blocker2 = document.createElement('div');
    blocker2.className = 'gc-blocker';
    blocker2.style.cssText = 'position:absolute; width:90px; height:90px; border-radius:50%; background:#0a0015; z-index:15; pointer-events:none;';
    cine.appendChild(blocker2);

    // gemas: mix-blend-mode lighten para que se fusionen visualmente las partes de color
    // IMPORTANTE: el blocker negro detrás se encarga de tapar las estrellas.
    gem1.style.mixBlendMode = 'lighten';
    gem2.style.mixBlendMode = 'lighten';
    
    // Mostrar lentes
    setTimeout(() => {
        lens1.style.opacity = '1';
        lens2.style.opacity = '1';
    }, 100);

    gems.forEach(g => {
        g.style.position = 'absolute';
        g.style.width = GEM_SIZE + 'px';
        g.style.height = GEM_SIZE + 'px';
        g.style.transition = 'none'; 
        g.style.zIndex = '20'; // Gemas ENCIMA de lentes y blockers
    });

    const cleanup = () => { 
        lens1.remove();
        lens2.remove();
        blocker1.remove();
        blocker2.remove();
    };
    
    function updateGemVisuals() {
        // Calcular transparencia del relleno
        // A medida que se acercan (spiralRadius baja), el centro se vacía
        let fillOpacity = 1;
        if (phase === 'spiral') {
            // Transición suave desde los 75px
            // Opacidad mínima 0.65 (solido al 65%, no pierde tanta opacidad)
            // Rango de acción: 75px -> 10px
            const progress = Math.max(0, Math.min(1, (spiralRadius - 10) / 65));
            fillOpacity = 0.65 + (progress * 0.35); 
        }

        // Aplicar solo al relleno violeta, preservando bordes
        if (circle1) {
            circle1.style.transition = 'fill-opacity 0.05s'; // Respuesta más rápida
            circle1.style.fillOpacity = fillOpacity;
        }
        if (circle2) {
            circle2.style.transition = 'fill-opacity 0.05s';
            circle2.style.fillOpacity = fillOpacity;
        }

        // Gema 1
        gem1.style.left = (g1.x - HALF_GEM) + 'px';
        gem1.style.top = (g1.y - HALF_GEM) + 'px';
        gem1.style.transform = `rotate(${g1.angle * 50}deg) scale(1)`; 
        gem1.style.filter = 'none';
        
        // Lens 1 & Blocker 1
        lens1.style.left = g1.x + 'px';
        lens1.style.top = g1.y + 'px';
        blocker1.style.left = (g1.x - HALF_GEM) + 'px';
        blocker1.style.top = (g1.y - HALF_GEM) + 'px';
        
        // Gema 2
        gem2.style.left = (g2.x - HALF_GEM) + 'px';
        gem2.style.top = (g2.y - HALF_GEM) + 'px';
        gem2.style.transform = `rotate(${g2.angle * 50}deg) scale(1)`; 
        gem2.style.filter = 'none';
        
        // Lens 2 & Blocker 2
        lens2.style.left = g2.x + 'px';
        lens2.style.top = g2.y + 'px';
        blocker2.style.left = (g2.x - HALF_GEM) + 'px';
        blocker2.style.top = (g2.y - HALF_GEM) + 'px';
    }
    
    let lastShockwave = 0;
    
    function animate() {
        if (phase === 'approach') {
            // Mover hacia el centro X
            g1.x -= SPEED;
            g2.x += SPEED;
            
            // Ángulo aumenta más lento (era 0.05)
            g1.angle += 0.02; 
            g2.angle += 0.02;
            
            if (g1.x <= CX) {
                phase = 'spiral';
                angleShift = -Math.PI / 2; 
            }
        } 
        else if (phase === 'spiral') {
            // Fusión más rápida: Decaimiento aumentado
            const decay = spiralRadius > 60 ? 2.5 : 0.15; 
            spiralRadius -= decay;
            
            // Giro más lento
            // Multiplicador reducido de 1.8 a 0.8
            spiralSpeed = Math.min(0.8, (SPEED / Math.max(20, spiralRadius)) * 0.8);
            
            angleShift -= spiralSpeed;
            
            // Gema 1
            g1.x = CX + Math.cos(angleShift) * spiralRadius;
            g1.y = CY + Math.sin(angleShift) * spiralRadius;
            
            // Gema 2 (opuesta, +PI)
            g2.x = CX + Math.cos(angleShift + Math.PI) * spiralRadius;
            g2.y = CY + Math.sin(angleShift + Math.PI) * spiralRadius;
            
            g1.angle = angleShift;
            g2.angle = angleShift;
            
            // Ondas gravitacionales
            const minDelay = 400; 
            
            if (Date.now() - lastShockwave > minDelay) {
                lastShockwave = Date.now();
                emitGravitationalWave(cine, CX, CY, 400); 
            }
            
            if (spiralRadius <= 5) {
                phase = 'merge';
                cleanup();
                doMergeExplosion();
                return;
            }
        }
        
        updateGemVisuals();
        if (phase !== 'merge') requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    function emitGravitationalWave(container, x, y, size) {
        const wave = document.createElement('div');
        wave.className = 'gc-shockwave';
        // Circular perfecto
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        wave.style.width = size + 'px';
        wave.style.height = size + 'px'; 
        // Eliminamos rotación para mantener circularidad perfecta
        wave.style.transform = `translate(-50%, -50%)`;
        
        // Animación suave de expansión - Duración aumentada para viajar más lejos
        wave.style.animation = 'gravitational-pulse 2.5s ease-out forwards'; // Más duración
        
        container.appendChild(wave);
        setTimeout(() => wave.remove(), 2500);
    }
    
    function doMergeExplosion() {
        // Ocultar gemas
        gems.forEach(g => g.style.opacity = '0');
        
        // Explosión masiva de ondas
        for(let i=0; i<10; i++) {
            setTimeout(() => {
                emitGravitationalWave(cine, CX, CY, 50);
            }, i * 50);
        }
        
        // Flash blanco
        flash.style.transition = 'opacity 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)';
        flash.style.opacity = '1';
        
        setTimeout(() => {
            // Fade out flash
            flash.style.transition = 'opacity 2s ease-out';
            flash.style.opacity = '0';
            
            // Aparece la corona
            crown.style.cssText = '';
            void crown.offsetHeight; // Reflow
            crown.classList.add('revealed');
            
            // Textos y botones
            setTimeout(() => {
                title.classList.add('visible');
                subtitle.classList.add('visible');
                setTimeout(() => buttons.classList.add('visible'), 800);
                
                // Confeti final
                for (let i = 0; i < 50; i++) {
                    const p = document.createElement('div');
                    p.className = 'gc-particle';
                    p.style.left = CX + (Math.random()-0.5)*200 + 'px';
                    p.style.top = CY + (Math.random()-0.5)*200 + 'px';
                    p.style.background = '#ffd700';
                    p.style.animation = `gc-particle-float ${1+Math.random()*2}s ease-out forwards`;
                    particlesContainer.appendChild(p);
                }
            }, 800);
            
        }, 600);
    }
}

function godCrownPersist() {
    // Close cinematic, keep playing with the crown
    const cine = $('godCrownCinematic');
    cine.style.transition = 'opacity 0.8s ease';
    cine.style.opacity = '0';
    setTimeout(() => {
        cine.classList.remove('active');
        document.body.classList.remove('gc-input-locked');
        cine.style.opacity = ''; cine.style.transition = '';
        
        // Reset fusion state
        fusionPendingCollect = false;
        selectedFusionGem = null;
        const btn = $('fusionBtn');
        btn.innerHTML = '⚗️ Fusionar';
        btn.onclick = executeFusion;
        btn.classList.remove('collect-btn');
        btn.style.background = '';
        btn.disabled = true;
        $('fusionSlotsContainer').classList.remove('fusion-ready');
        
        updateUI();
        createConfetti();
        saveGame();
    }, 800);
}

function godCrownReborn() {
    const cine = $('godCrownCinematic');
    
    // Flash transition
    const flash = $('gcFlash');
    flash.style.transition = 'opacity 0.5s ease-in';
    flash.style.opacity = '1';
    
    setTimeout(() => {
        // Reset everything but keep the crown
        (gameBridge ? gameBridge.clearLocal() : localStorage.removeItem('raspadita_gemas_save'));
        
        createdGems = [];
        polishedGems = [];
        resetCheatState();
        gameData = Object.assign(getDefaultGameData(), { amuletCounts: { 'corona_dios': 1 }, equippedAmulet: 'corona_dios' });
        favorMode = false;
        currentFavorPrize = null;
        ticketStack = [];
        currentTicket = null;
        isScratching = false;
        fusionPendingCollect = false;
        canPlay = false;
        revealed = false;
        canvas = null;
        ctx = null;
        
        // Reset ticket UI
        const card = $('scratchCard');
        card.innerHTML = '<div class="empty-ticket-message">🎫 Compra un ticket para jugar</div>';
        card.classList.remove('broken');
        setProgress(0);
        $('favorBtn').classList.remove('active');
        $('favorInfo').style.display = 'none';
        
        // Close all modals
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
        $('winMessage').classList.remove('show');
        
        // Reset fusion UI
        const fusBtn = $('fusionBtn');
        fusBtn.innerHTML = '⚗️ Fusionar';
        fusBtn.onclick = executeFusion;
        fusBtn.classList.remove('collect-btn');
        fusBtn.style.background = '';
        fusBtn.disabled = true;
        $('fusionSlotsContainer').classList.remove('fusion-ready');
        
        applyWorldTheme();
        updateUI();
        saveGame();
        
        // Fade out cinematic
        flash.style.transition = 'opacity 1s ease-out';
        flash.style.opacity = '0';
        setTimeout(() => {
            cine.classList.remove('active');
            cine.style.opacity = ''; cine.style.transition = '';
            createConfetti();
        }, 500);
    }, 600);
}

// Auto-scale para ajustar contenido a la pantalla
let __scaleAppliedOnce = false;

function getViewportHeightStable() {
    // visualViewport suele reflejar mejor el espacio real en móviles
    const vv = window.visualViewport;
    const h = vv && vv.height ? vv.height : window.innerHeight;
    return Math.max(1, Math.floor(h));
}

function computeScaleForWrapper(wrapper) {
    // Resetear para medir tamaño real
    wrapper.style.zoom = '';
    wrapper.style.transform = '';

    const viewportHeight = getViewportHeightStable();
    const contentHeight = wrapper.scrollHeight;
    if (!contentHeight) return 1;

    let scale = (viewportHeight * 0.98) / contentHeight;
    scale = Math.max(0.9, Math.min(1.8, scale));
    return scale;
}

function applyScale(wrapper, scale) {
    if ('zoom' in document.body.style) {
        wrapper.style.zoom = String(scale);
        wrapper.style.transform = '';
    } else {
        wrapper.style.zoom = '';
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top center';
    }
}

// Escala SOLO 1 vez al entrar. No se vuelve a recalcular hasta refrescar la página.
async function updateGameScaleOnce() {
    if (__scaleAppliedOnce) return;
    await _doRescale();
    __scaleAppliedOnce = true;
}

async function rescaleGame() {
    await _doRescale();
}

async function _doRescale() {
    const wrapper = $('gameWrapper');
    if (!wrapper) return;

    // Esperar a fuentes (evita que el alto cambie luego y obligue a refrescar)
    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
    } catch (e) {}

    // Esperar a que el layout se estabilice (varios frames con mismo scrollHeight/viewport)
    let lastH = -1;
    let lastV = -1;
    let stable = 0;
    const maxFrames = 40;

    for (let i = 0; i < maxFrames; i++) {
        await new Promise(r => requestAnimationFrame(r));
        const ch = wrapper.scrollHeight;
        const vh = getViewportHeightStable();
        if (Math.abs(ch - lastH) <= 2 && Math.abs(vh - lastV) <= 2) stable++;
        else stable = 0;
        lastH = ch;
        lastV = vh;
        if (stable >= 4) break;
    }

    const scale = computeScaleForWrapper(wrapper);
    applyScale(wrapper, scale);
}

// ========== LONG-PRESS BULK ACTIONS (almacén) ==========
const GEM_BTN_HOLD_MS_TRASH = 1000;  // trash necesita más tiempo
const GEM_BTN_HOLD_MS_SELL  = 900;   // vender también más tiempo
let _gemHoldRAF = null;
let _gemHoldStart = 0;
let _gemHoldBtn = null;
let _gemHoldIsHold = false; // true si el hold llegó a completarse

function _getHoldDuration(btn) {
    return btn.classList.contains('gem-trash-btn') ? GEM_BTN_HOLD_MS_TRASH : GEM_BTN_HOLD_MS_SELL;
}

function _startGemHold(e, btn) {
    _cancelGemHold();
    e.stopPropagation();
    _gemHoldBtn = btn;
    _gemHoldStart = performance.now();
    _gemHoldIsHold = false;
    const isTrash = btn.classList.contains('gem-trash-btn');
    const canBulk = parseInt(btn.dataset.count, 10) > 1;
    // Si no hay más de 1, no iniciamos la animación de hold pero sí guardamos el btn para el tap
    if (!canBulk) return;
    const fill = btn.querySelector('.gem-btn-hold-fill');
    const holdDuration = _getHoldDuration(btn);
    function tick(now) {
        const p = Math.min((now - _gemHoldStart) / holdDuration, 1);
        if (fill) fill.style.transform = `scaleX(${p})`;
        // Aura creciente en el trash
        if (isTrash) {
            const glow = Math.round(p * 18);
            const alpha = (p * 0.85).toFixed(2);
            btn.style.boxShadow = p > 0
                ? `0 0 ${glow}px ${Math.round(p*8)}px rgba(239,68,68,${alpha})`
                : '';
        }
        if (p < 1) { _gemHoldRAF = requestAnimationFrame(tick); }
        else {
            _gemHoldRAF = null;
            _gemHoldIsHold = true;
            const gemId = btn.dataset.gemid;
            const gemType = btn.dataset.gemtype;
            if (isTrash) {
                _doBulkDelete(gemId, gemType);
            } else {
                _doBulkSell(gemId, gemType, parseInt(btn.dataset.sellprice, 10));
            }
        }
    }
    _gemHoldRAF = requestAnimationFrame(tick);
}

function _cancelGemHold() {
    if (_gemHoldRAF) { cancelAnimationFrame(_gemHoldRAF); _gemHoldRAF = null; }
    if (_gemHoldBtn) {
        const fill = _gemHoldBtn.querySelector('.gem-btn-hold-fill');
        if (fill) fill.style.transform = 'scaleX(0)';
        _gemHoldBtn.style.boxShadow = '';
        _gemHoldBtn = null;
    }
}

function _doBulkDelete(gemId, type) {
    if (type === 'amulet') {
        if ((gameData.amuletCounts[gemId] || 0) <= 1) return;
        gameData.amuletCounts[gemId] = 1;
    } else if (type === 'created') {
        if ((gameData.createdCounts[gemId] || 0) <= 1) return;
        gameData.createdCounts[gemId] = 1;
    }
    updateUI(); renderAlmacen(); saveGame();
}

function _doBulkSell(gemId, type, sellPrice) {
    if (type === 'polished') {
        const baseId = gemId.startsWith('pol_') ? gemId.slice(4) : null;
        if (!baseId || !gameData.polishedGems) return;
        const arr = gameData.polishedGems[baseId];
        if (!arr || arr.length <= 1) return;
        const toSell = arr.length - 1;
        let total = 0;
        for (let i = 0; i < toSell; i++) total += Math.floor((arr[i].amount || 0));
        arr.splice(0, toSell);
        addGems(total);
    } else if (type === 'singularity') {
        if (!gameData.singularityCounts) return;
        const count = gameData.singularityCounts[gemId] || 0;
        if (count <= 1) return;
        gameData.singularityCounts[gemId] = 1;
        addGems(sellPrice * (count - 1));
    } else {
        const countKey = type === 'created' ? 'createdCounts' : 'gemCounts';
        const count = (gameData[countKey] && gameData[countKey][gemId]) || 0;
        if (count <= 1) return;
        gameData[countKey][gemId] = 1;
        addGems(sellPrice * (count - 1));
    }
    updateUI(); renderAlmacen(); saveGame();
}

document.addEventListener('pointerdown', function(e) {
    const btn = e.target.closest('.gem-trash-btn[data-gemid], .gem-card-sell-btn[data-gemid]');
    if (!btn) return;
    _startGemHold(e, btn);
}, { passive: false });

document.addEventListener('pointerup', function(e) {
    if (!_gemHoldBtn) return;
    const elapsed = performance.now() - _gemHoldStart;
    const btn = _gemHoldBtn;
    const holdDuration = _getHoldDuration(btn);
    _cancelGemHold();
    // Solo disparar tap simple si NO completó el hold
    if (!_gemHoldIsHold && elapsed < holdDuration) {
        const gemId = btn.dataset.gemid;
        const gemType = btn.dataset.gemtype;
        e.stopPropagation();
        if (btn.classList.contains('gem-trash-btn')) {
            deleteGemInstance(gemId, gemType);
        } else if (btn.classList.contains('gem-card-sell-btn')) {
            sellGemDirect(gemId, gemType);
        }
    }
    _gemHoldIsHold = false;
});
document.addEventListener('pointercancel', _cancelGemHold);
document.addEventListener('pointermove', function(e) {
    if (!_gemHoldBtn) return;
    const btn = e.target.closest('.gem-trash-btn[data-gemid], .gem-card-sell-btn[data-gemid]');
    if (btn !== _gemHoldBtn) _cancelGemHold();
});
// ========== END LONG-PRESS BULK ACTIONS ==========

// ===== ENGINE INIT (called by React Game component) =====
export function initEngine(bridge) {
    gameBridge = bridge;
    try { localStorage.setItem('upgradesExpanded', '0'); } catch(e) {}
    try { toggleUpgrades(false); } catch(e) {}
    initUpgradesFold();
    createStars();
    updateGameScaleOnce();
    loadGame();
    applyWorldTheme();
    updateUI();
    initProntoButton();
    const btn = document.getElementById('newGameBtn');
    if (btn) btn.addEventListener('click', newGame);
    window.addEventListener('resize', () => {
        if (!revealed && canvas && ctx) initCanvas();
    });
    window.addEventListener('beforeunload', () => {
        if (_saveTimeout) { clearTimeout(_saveTimeout); _doSaveGame(); }
    });
}
