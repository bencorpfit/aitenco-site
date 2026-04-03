# Audit Technique Complet - AITENCO

**Date:** 2026-04-02
**Auditeur:** Claude Opus 4.6
**Score global: 7.5 / 10**

---

## Forces techniques

- Architecture statique sans framework = temps de chargement minimal, zero JS framework overhead
- Security headers bien configures dans vercel.json (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Accessibilite bien pensee : skip-link, sr-only labels, aria-expanded, prefers-reduced-motion
- SEO meta tags complets : OG, Twitter Cards, canonical, JSON-LD avec @graph
- JS non-bloquant (`defer` sur le script, ligne 734 de index.html)
- Canvas neural network desactive sur mobile et prefers-reduced-motion
- IIFEs pour isoler le scope JS
- Cache immutable pour les assets statiques

---

## CRITICAL

### C1. OG Image manquante (SEO)
**Fichier:** `index.html` ligne 13, `og-image.png` n'existe pas sur le filesystem.
**Impact:** Apercu casse sur LinkedIn, Twitter, Slack, WhatsApp. Pour un site B2B, c'est un deal-breaker en termes de partageabilite.
**Fix:** Creer `og-image.png` (1200x630px) et le deployer.

### C2. Serverless function sans rate limiting (Securite)
**Fichier:** `api/contact.js`
**Impact:** Endpoint POST `/api/contact` est vulnerable au spam/abuse. Pas de rate limiting, pas de CAPTCHA, pas de honeypot. Un bot peut soumettre des milliers de leads fictifs dans HubSpot.
**Fix:**
```javascript
// Option 1: Honeypot field (zero friction)
// Ajouter un champ cache dans le HTML, rejeter si rempli

// Option 2: Vercel KV rate limiting
// Limiter a 5 soumissions par IP par heure

// Option 3: Turnstile (Cloudflare) ou reCAPTCHA
```

### C3. Validation email cote serveur insuffisante (Securite)
**Fichier:** `api/contact.js` ligne 8
**Impact:** La validation se limite a `!firstName || !email`. Pas de validation du format email, pas de sanitization. Injection potentielle via les champs `challenge`, `company`, etc. qui sont passes directement a HubSpot.
**Fix:**
```javascript
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!EMAIL_RE.test(email)) {
  return res.status(400).json({ error: 'Invalid email format' });
}
// Sanitize tous les champs string (trim, limiter la longueur)
const sanitize = (s, max = 500) => typeof s === 'string' ? s.trim().slice(0, max) : '';
```

---

## HIGH

### H1. Google Fonts render-blocking (Performance)
**Fichier:** `index.html` ligne 26
**Impact:** La feuille de style Google Fonts bloque le rendu. Elle charge 5 poids de Space Grotesk + 3 poids d'Inter = ~8 font files.
**Fix:**
```html
<!-- Option A: preload les fonts critiques + font-display: swap (deja dans le lien via display=swap) -->
<!-- Option B (recommande): self-host les fonts -->
<!-- Telecharger via google-webfonts-helper, servir depuis /fonts/ avec cache immutable -->
<!-- Option C: media="print" trick -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?...">
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?..." rel="stylesheet"></noscript>
```
L'option `display=swap` est deja presente (bien), mais le CSS lui-meme bloque le rendu initial. Self-hosting eliminerait aussi la dependance externe et le DNS lookup vers fonts.googleapis.com.

### H2. Canvas neural network - complexite O(n^2) (Performance)
**Fichier:** `main.js` lignes 41-56
**Impact:** Double boucle nested sur 55 noeuds = 1485 comparaisons par frame a 60fps. Avec `Math.sqrt` a chaque iteration + `beginPath/stroke` individuel par ligne. Pas de spatial partitioning.
**Fix:**
```javascript
// 1. Utiliser dist^2 au lieu de sqrt (eviter sqrt)
var distSq = dx * dx + dy * dy;
if (distSq < 19600) { // 140^2
  var alpha = (1 - Math.sqrt(distSq) / 140) * 0.25;
  // ...
}

// 2. Batch les lignes en un seul path
ctx.beginPath();
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    // ...
    ctx.moveTo(nodes[i].x, nodes[i].y);
    ctx.lineTo(nodes[j].x, nodes[j].y);
  }
}
ctx.stroke(); // Un seul appel stroke

// 3. Reduire ctx.shadowBlur (ligne 71-74) - tres couteux en GPU
// Supprimer ou limiter a un seul pass
```

### H3. Header Content-Security-Policy manquant (Securite)
**Fichier:** `vercel.json`
**Impact:** Pas de CSP = vulnerable a XSS via injection de scripts tiers. Le site charge des ressources de fonts.googleapis.com et fonts.gstatic.com, et envoie des donnees a api.hsforms.com.
**Fix:**
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com; connect-src 'self' https://api.hsforms.com; img-src 'self' data:; frame-ancestors 'none'"
}
```

### H4. Header HSTS manquant (Securite)
**Fichier:** `vercel.json`
**Impact:** Pas de Strict-Transport-Security. Les navigateurs ne sont pas forces sur HTTPS apres la premiere visite.
**Fix:**
```json
{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
```

---

## MEDIUM

### M1. Cache immutable sur des fichiers sans hash (Performance)
**Fichier:** `vercel.json` lignes 14-24
**Impact:** `style.css` et `main.js` ont `max-age=31536000, immutable` mais leurs noms ne contiennent pas de hash de contenu. Apres un deploiement, les navigateurs qui ont deja cache ces fichiers ne recevront jamais la mise a jour pendant 1 an.
**Fix:** Soit ajouter un content hash dans le nom du fichier (`style.a1b2c3.css`), soit reduire le cache a quelque chose de raisonnable :
```json
{ "key": "Cache-Control", "value": "public, max-age=86400, stale-while-revalidate=604800" }
```
Note: Vercel gere la purge CDN automatiquement au deploy, donc le cache immutable est OK pour les fichiers servis depuis le CDN Vercel. Mais les navigateurs qui ont le fichier en cache local ne le re-valideront pas.

### M2. Scroll listener sans throttle (Performance)
**Fichier:** `main.js` lignes 121-123, 203-208
**Impact:** Deux `window.addEventListener('scroll', ...)` sans throttle ni `passive: true`. Le scroll listener execute a chaque pixel scroll.
**Fix:**
```javascript
// Option passive (zero-cost)
window.addEventListener('scroll', handler, { passive: true });

// Option throttle
let ticking = false;
window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(function() {
      // logique ici
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
```

### M3. CSS inline styles dans le HTML (Code Quality)
**Fichier:** `index.html` lignes 353, 397, 526
**Impact:** Trois elements avec des `style="..."` inline qui dupliquent et overrident des styles CSS. Rompt la separation des preoccupations.
**Fix:** Creer des classes CSS dedies (`.tagline-gold`, `.approach-footer-text`, etc.)

### M4. WhatsApp avec numero placeholder (SEO/UX)
**Fichier:** `index.html` ligne 99
**Impact:** `971500000000` est un placeholder. Un visiteur qui clique n'arrivera nulle part.
**Fix:** Remplacer par le vrai numero ou retirer le bouton jusqu'a ce qu'il soit configure.

### M5. `apple-touch-icon` pointe vers un SVG (SEO)
**Fichier:** `index.html` ligne 22
**Impact:** iOS ne supporte pas les SVG comme apple-touch-icon. Il faut un PNG 180x180.
**Fix:**
```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

### M6. JSON-LD FAQPage - seulement 4 questions sur 6 (SEO)
**Fichier:** `index.html` lignes 55-89 vs lignes 573-597
**Impact:** Le schema FAQPage ne contient que 4 FAQ mais la page en affiche 6. Les questions "What if the automated system makes a mistake?" et "How is this different from hiring a consultant?" manquent.
**Fix:** Ajouter les 2 questions manquantes dans le JSON-LD.

### M7. FAQ accessible mais pas semantique (Accessibilite)
**Fichier:** `main.js` lignes 213-238, `index.html` lignes 573-597
**Impact:** Les FAQ utilisent des `<div class="faq-q">` avec `role="button"` ajoute dynamiquement en JS. Si JS ne charge pas, pas d'attributs ARIA. Mieux vaut utiliser `<button>` natifs ou `<details>/<summary>`.
**Fix:** Remplacer par du HTML natif :
```html
<details class="faq-item">
  <summary class="faq-q">How long before we see results?</summary>
  <div class="faq-a"><p>...</p></div>
</details>
```

### M8. Focus visible insuffisant sur certains elements (Accessibilite)
**Fichier:** `style.css`
**Impact:** Aucun style `:focus-visible` custom defini. Les liens, boutons et champs de formulaire s'appuient sur le focus par defaut du navigateur ou sur `outline: none` implicite via le reset. Les inputs ont `outline: none` (ligne 984).
**Fix:**
```css
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: -1px;
}
```

---

## LOW

### L1. CSS potentiellement surdimensionne (Performance)
**Fichier:** `style.css` - 1352 lignes, 33KB
**Impact:** Pour un one-pager, c'est raisonnable. Le CSS n'est pas minifie (pas de build step). En gzip, ca fera ~6-8KB, ce qui est acceptable. Pas un probleme bloquant.
**Recommandation:** Si un build step est ajoute plus tard, utiliser un minifier CSS.

### L2. Pas d'analytics (Business)
**Impact:** Aucune mesure du trafic, des conversions, du comportement utilisateur.
**Fix:** Ajouter Plausible (privacy-friendly, leger) ou GA4.

### L3. `meta keywords` obsolete (SEO)
**Fichier:** `index.html` ligne 9
**Impact:** Google ignore `meta keywords` depuis 2009. Ca ne nuit pas, mais c'est du bruit.
**Fix:** Supprimer la ligne.

### L4. Liens footer vers des ancres internes simulent des pages distinctes (SEO)
**Fichier:** `index.html` lignes 696-726
**Impact:** Les 4 villes GCC (Dubai, Riyadh, Doha, Manama) pointent toutes vers `#contact`. Ca ne nuit pas au SEO mais c'est trompeur pour l'utilisateur si AITENCO n'a pas vraiment de presence dans ces villes.

### L5. robots.txt minimal (SEO)
**Fichier:** `robots.txt`
**Impact:** Pas de regles specifiques pour les crawlers IA (GPTBot, Claude-Web, etc.). Si vous ne voulez pas que le contenu du site soit utilise pour l'entrainement, ajouter :
```
User-agent: GPTBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: CCBot
Disallow: /
```

### L6. Pas de `lang` change prevu pour l'arabe (Accessibilite/SEO)
**Fichier:** `index.html` ligne 2
**Impact:** Le site est en `lang="en"` mais mentionne du contenu arabe et des systemes bilingues. Quand la version arabe arrivera, il faudra gerer `hreflang` et `dir="rtl"`.

### L7. CLS potentiel sur les reveal animations (Core Web Vitals)
**Fichier:** `style.css` lignes 31-39
**Impact:** Les elements `.reveal` commencent avec `opacity: 0; transform: translateY(30px)`. Comme `transform` ne modifie pas le layout, le CLS devrait etre nul. Cependant, si le contenu est dans le viewport initial au chargement et que JS tarde, il y aura un flash de contenu invisible. Le `prefers-reduced-motion` gere ce cas (ligne 1351 : `.reveal { opacity: 1; transform: none; }`).

---

## Scores par categorie

| Categorie | Score | Notes |
|---|---|---|
| Performance | 7/10 | Fonts render-blocking, canvas O(n2), scroll sans throttle, mais architecture statique = rapide |
| SEO Technique | 7/10 | Meta tags complets, mais OG image manquante, FAQ schema incomplet, meta keywords inutile |
| Code Quality | 8/10 | Propre, bien structure, IIFEs, mais inline styles et div-as-button |
| Accessibilite | 7/10 | Skip-link, sr-only, aria-expanded, mais focus visible absent et FAQ non-semantique |
| Securite | 6/10 | Headers corrects mais CSP et HSTS manquants, API non protegee |
| Core Web Vitals | 8/10 | LCP bon (HTML statique), CLS gere (transform only), INP OK (peu d'interactivite) |
| Structured Data | 7/10 | JSON-LD correct mais incomplet (4/6 FAQ) |
| JS Rendering | 9/10 | SSR natif (HTML statique), JS en defer, progressive enhancement |

---

## Quick Wins (effort faible, impact fort)

1. **Creer og-image.png** - 30min de design, impact majeur sur le partage social
2. **Ajouter CSP + HSTS** dans vercel.json - 5min, securite nettement amelioree
3. **Ajouter `{ passive: true }` aux scroll listeners** - 2min, meilleure scrolling perf
4. **Completer le FAQPage schema** avec les 2 questions manquantes - 5min
5. **Supprimer `meta keywords`** - 1min
6. **Ajouter `:focus-visible` styles** - 10min, accessibilite clavier
7. **Ajouter un honeypot field** au formulaire - 15min, anti-spam basique
8. **Remplacer ou masquer le bouton WhatsApp** jusqu'a avoir le vrai numero - 1min

---

## Recommandation prioritaire

L'investissement le plus rentable maintenant est :
1. **Securite API** : rate limiting + validation email + honeypot (evite le spam)
2. **CSP + HSTS** (securite baseline)
3. **OG image** (partageabilite du site)
4. **Self-host fonts** (elimine la dependance externe, ameliore LCP)

Ces 4 actions couvrent les problemes les plus impactants et sont realisables en moins d'une demi-journee.
