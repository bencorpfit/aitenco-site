# AITENCO -- Rapport d'Audit Executif

**Date :** 2026-04-02
**Scope :** Site statique HTML (index.html, style.css, main.js, api/contact.js)
**Auditeurs :** Design/UX, Communication, Technique

---

## Score Global : 6.4 / 10

| Expert | Score | Poids |
|--------|-------|-------|
| Design/UX | 6.5 | 30% |
| Communication | 5.5 | 40% |
| Technique | 7.2 | 30% |

**Justification :** Le socle technique est solide (pas de framework inutile, SEO meta correct, performance decent). Mais le site echoue sur l'essentiel pour du B2B GCC : zero preuve sociale, positionnement confus, et failles de securite bloquantes. Un prospect Dubai qui arrive sur ce site n'a aucune raison de faire confiance.

---

## Les 3 Problemes les Plus Critiques (consensus)

### 1. ZERO preuve sociale (3/3 experts)
Pas de temoignages, pas de logos clients, pas de case studies, pas de chiffres. Pour du B2B consulting dans le Golfe, c'est un deal-breaker absolu. Un prospect ne remplira pas un formulaire sans signal de confiance.

### 2. Failles de securite bloquantes (expert technique)
- Pas de CSP ni HSTS dans `vercel.json:1-38`
- PII dans `console.log` (`api/contact.js:19`) -- email, nom, entreprise logues en clair
- Pas de validation email cote serveur (`api/contact.js:8-9` -- check superficiel)
- Pas de protection anti-bot sur `/api/contact`
- WhatsApp placeholder `971500000000` (`index.html:99`) -- lien mort

### 3. Positionnement confus (expert communication)
- Title dit "Automation Advisory" (`index.html:5`) mais le contenu dit "We don't advise, we build"
- Headline hero generique "Less Manual Work. More Growth." -- interchangeable avec n'importe quel SaaS
- Footer "GCC Presence" avec 4 villes mais equipe uniquement Dubai
- Section Vision 2030 = name-dropping sans substance

---

## Plan d'Action Priorise

### PHASE 1 -- URGENT (avant mise en ligne)

| # | Action | Effort | Impact | Qui |
|---|--------|--------|--------|-----|
| 1 | **Ajouter CSP + HSTS** dans `vercel.json` | 30min | 5/5 | Dev |
| 2 | **Retirer `console.log` PII** dans `api/contact.js:19` | 5min | 5/5 | Dev |
| 3 | **Ajouter validation email regex** + **champ honeypot** dans `api/contact.js` | 1h | 4/5 | Dev |
| 4 | **Remplacer le numero WhatsApp** placeholder `971500000000` dans `index.html:99` par le vrai numero, ou retirer le bouton | 5min | 4/5 | Fondateur |
| 5 | **Corriger le positionnement** : remplacer "Automation Advisory" par "AI Automation Studio" ou "Implementation Partner" dans `index.html:5,9,17` et le schema JSON-LD `index.html:36` | 30min | 4/5 | Fondateur + Dev |
| 6 | **Reecrire la headline hero** : remplacer "Less Manual Work. More Growth." par quelque chose de specifique. Propositions : "We Build the AI Systems Your Team Actually Uses." ou "AI Automation. Built for Gulf Businesses." | 15min | 4/5 | Fondateur |

### PHASE 2 -- SEMAINE 1-2 (ameliorations conversion)

| # | Action | Effort | Impact | Qui |
|---|--------|--------|--------|-----|
| 7 | **Ajouter preuve sociale minimale** : 2-3 temoignages (meme anonymises "Head of Ops, Logistics Company, Dubai") + 2-3 logos clients. Placer apres la section hero ou "The Difference" | 3h | 5/5 | Fondateur (contenu) + Dev (integration) |
| 8 | **Reduire le formulaire de 6 a 3 champs** : garder Nom, Email, Defi. Retirer Last Name, Company, Industry (recuperables apres via HubSpot enrichment) | 1h | 4/5 | Dev |
| 9 | **Remplacer le canvas decoratif** par du contenu a valeur : screenshot d'un dashboard, mini case study visuelle, ou video 30s du fondateur | 3h | 4/5 | Fondateur (contenu) + Dev (integration) |
| 10 | **Etoffer les bios equipe** : ajouter noms de famille, photos, liens LinkedIn. Sans ca, "anonymous team in Dubai" ne convainc personne en B2B | 2h | 4/5 | Fondateur |
| 11 | **Retirer "GCC Presence" du footer** ou reformuler en "Serving clients across the GCC from Dubai" -- honnete et suffisant | 15min | 3/5 | Dev |
| 12 | **Charger les fonts en async** (`display=swap` est deja la, mais passer de 8 a 4 variantes de poids dans `index.html:26`) | 30min | 3/5 | Dev |
| 13 | **FAQ : remplacer `div[role="button"]` par des `<button>` natifs** pour l'accessibilite clavier | 1h | 3/5 | Dev |
| 14 | **Ajouter focus trap sur le menu mobile** | 1h | 3/5 | Dev |

### PHASE 3 -- MOIS 1 (polish et scale)

| # | Action | Effort | Impact | Qui |
|---|--------|--------|--------|-----|
| 15 | **Rompre la monotonie visuelle** : alterner fond sombre/leger entre sections, ajouter des separateurs visuels ou des illustrations | 4h | 3/5 | Dev |
| 16 | **Remplacer la typo** Space Grotesk + Inter par quelque chose de moins "template AI" (ex: General Sans / Satoshi pour headings) + self-host les fonts | 3h | 3/5 | Dev |
| 17 | **Corriger les contrastes** : `--muted` en petit texte ne passe pas WCAG AA. Ajuster dans `style.css` | 1h | 3/5 | Dev |
| 18 | **Optimiser le canvas** : remplacer `Math.sqrt` O(n^2) par un calcul de distance approxime, ou simplement reduire le nombre de particules | 2h | 2/5 | Dev |
| 19 | **Ajouter du rate limiting** sur `/api/contact` (via Vercel Edge Middleware ou un compteur simple) | 2h | 3/5 | Dev |
| 20 | **Ajouter CORS restreint** sur l'API contact (origin `aitenco.com` uniquement) | 30min | 3/5 | Dev |
| 21 | **Cache immutable** : ajouter des hash de fichier aux noms CSS/JS (`style.abc123.css`) ou retirer le header `immutable` dans `vercel.json:15-25` | 2h | 2/5 | Dev |
| 22 | **Installer analytics** (Plausible ou GA4) | 1h | 3/5 | Dev |
| 23 | **Generer l'image OG** (`og-image.png` 1200x630) referencee dans `index.html:13` mais inexistante | 1h | 2/5 | Fondateur |

---

## Decisions a Prendre par le Fondateur

Ces points bloquent l'avancement et ne peuvent pas etre decides par un dev :

### 1. Choix de positionnement
**"Automation Advisory"** est contradictoire avec "We don't advise, we build."
Options :
- **"AI Automation Studio"** -- implique execution, craft, sur mesure
- **"AI Implementation Partner"** -- implique partenariat, fiabilite, B2B
- **"AI Systems Builder"** -- le plus direct et honnete

Impact : change le title, meta, schema, et le ton de toute la page.

### 2. Preuve sociale
Questions a repondre :
- As-tu des clients existants dont tu peux utiliser le nom/logo ? Meme 2-3 suffisent.
- Si pas de nom, peux-tu avoir des temoignages anonymises avec titre + secteur + ville ?
- As-tu des metriques a partager ? ("40% de temps economise sur X process")
- Option minimale : une seule citation avec photo, ca suffit pour demarrer.

### 3. Equipe
- Es-tu pret a mettre ton nom complet, photo, et LinkedIn sur le site ?
- Y a-t-il d'autres membres a presenter, ou vaut-il mieux assumer le "solo founder" ?
- Un fondateur visible et credible vaut mieux qu'une "equipe" vague.

### 4. WhatsApp
- Quel est le vrai numero ? Ou preferes-tu retirer le bouton et garder uniquement le formulaire ?

### 5. Scope geographique
- Garder "GCC" au risque de paraitre trompeur, ou assumer "Based in Dubai, serving the Gulf" ?

---

## Resume des Efforts

| Phase | Heures estimees | Prerequis fondateur |
|-------|----------------|---------------------|
| URGENT | ~2.5h dev | Numero WhatsApp, choix de positionnement, headline |
| Semaine 1-2 | ~11h dev | Temoignages, photos equipe, contenu visuel |
| Mois 1 | ~16h dev | Image OG, choix typo |

**Total : ~30h de dev, dont les 2.5 premieres heures sont bloquantes.**

---

## References Cles

- `vercel.json:1-38` -- headers de securite (CSP/HSTS manquants)
- `api/contact.js:8-9` -- validation insuffisante
- `api/contact.js:19` -- PII dans console.log
- `index.html:5` -- title avec "Advisory"
- `index.html:26` -- 8 variantes de font chargees
- `index.html:99` -- WhatsApp placeholder
- `index.html:28-93` -- schema JSON-LD a aligner avec le nouveau positionnement
