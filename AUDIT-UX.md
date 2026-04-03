# Audit Design/UX -- AITENCO Site

**Date :** 2 avril 2026  
**Score global : 6.5/10**

Un bon socle technique et une direction visuelle coherente, mais plusieurs problemes structurels freinent la conversion et la perception premium.

---

## Forces (ce qui marche)

1. **Direction visuelle dark/gold coherente.** La palette est adaptee au positionnement consulting B2B GCC. Le gold evoque le premium sans tomber dans le clinquant. Le dark background donne un feeling tech-enterprise.

2. **Hero bien structure.** Le titre "Less Manual Work. More Growth." est clair, benefit-driven, et scannable. Les stats (20+, 2-4 wks, Enterprise) ajoutent de la credibilite immediate. Le CTA primaire est visible et bien formule.

3. **Architecture de contenu solide.** Le flow hero > trust signals > services > difference > approach > impact > team > principles > FAQ > contact suit une logique de persuasion correcte (probleme > solution > preuve > equipe > confiance > action).

4. **Bonnes bases techniques.** CSS variables, responsive breakpoints, `prefers-reduced-motion`, skip-link, `aria-expanded` sur le hamburger, `aria-live` sur le form status, labels `sr-only`, autocomplete attributes. Le socle a11y est solide.

5. **Floating CTA bar + WhatsApp.** Deux mecanismes de persistance du CTA, pertinents pour le marche GCC ou WhatsApp est le canal business dominant.

6. **Section "The Difference" (vs Traditional Consulting).** Un excellent differentiateur. Le format comparison cote a cote est efficace pour le B2B.

---

## Faiblesses critiques (par impact decroissant)

### 1. ZERO preuve sociale -- Le tueur de conversion silencieux

**Impact : CRITIQUE**

Aucun temoignage client. Aucun logo client. Aucune etude de cas. Aucun chiffre de resultat reel. Les stats "Projected Impact" sont des benchmarks generiques, pas des resultats reels.

Pour une audience B2B enterprise GCC, la confiance se construit sur des references concretes. "Based on industry benchmarks" est un signal d'alarme pour un acheteur sophistique. Ca dit "nous n'avons pas encore de resultats a montrer."

**Consequence :** Un decision-maker B2B qui arrive sur le site n'a aucune raison de croire que AITENCO peut livrer. Le taux de conversion du formulaire est probablement tres bas.

### 2. Typography generique -- Space Grotesk + Inter = AI slop

**Impact : ELEVE**

Space Grotesk est devenu la police par defaut de tout site "tech/AI" genere en 2024-2026. Inter est litteralement la police la plus generique du web. Cette combinaison crie "template" a tout designer ou decision-maker qui voit 50 sites comme celui-ci par semaine.

Pour un cabinet de consulting premium qui facture des engagements enterprise, la typographie devrait respirer l'autorite et la differenciation, pas le generique.

### 3. Sections mid-page visuellement monotones (le "mur sombre")

**Impact : ELEVE**

Le screenshot desktop full-page est revelateur : a partir de la section services, toutes les sections se ressemblent. Cartes sombres sur fond sombre, meme structure repetee. Le regard n'est pas relance.

L'alternance `--black` / `--dark` est trop subtile pour creer une vraie separation visuelle. En scroll rapide, tout se fond en une masse sombre uniforme.

La section Vision 2030 (5 colonnes identiques) et Principles (6 cartes identiques) sont particulierement coupables -- elles se confondent completement.

### 4. Hero visual (canvas + floating badges) -- purement decoratif

**Impact : MOYEN-ELEVE**

Le canvas "neural network" a droite du hero + les 3 badges flottants ("System Deployed", "40% Less Manual Work", "ROI-First Approach") n'apportent rien de tangible. C'est du bruit visuel decoratif.

Pour un cabinet B2B qui vend de la credibilite, cet espace serait mieux utilise avec :
- Un screenshot de dashboard/systeme reel
- Une video de 30s du fondateur
- Un temoignage client video
- Un mini case study visuel

Les badges flottants avec animation `float` sont un pattern generic de landing pages AI. Ca detruit la credibilite enterprise.

### 5. Formulaire de contact -- friction inutile + positionnement faible

**Impact : MOYEN**

- 6 champs (prenom, nom, email, company, industry, challenge) = trop pour un premier contact B2B
- Le textarea "What's your biggest operational challenge?" est intimidant -- ca demande trop de reflexion pour un premier engagement
- Pas de preuve sociale a cote du formulaire (pas de "Join 50+ companies" ou temoignage)
- Le bouton "Request Your Assessment" est correct mais pourrait etre renforce

### 6. Mobile : hero visual masque, contenu long

**Impact : MOYEN**

- `hero-visual { display: none }` sur mobile = 50% du hero disparait. Ca marche en termes de contenu (le texte suffit) mais le visual est un placeholder decoratif de toute facon
- `approach-visual { display: none }` = meme chose, la visual est purement decorative
- Le scroll vertical est TRES long en mobile (10+ sections). Certaines sections (Vision 2030, Principles) pourraient etre compactees ou supprimees
- La floating CTA bar masque le texte sur mobile (`floating-cta-text { display: none }`) -- bien
- WhatsApp remonte a `bottom: 5rem` -- bien, ne chevauche pas la floating bar

### 7. Repetition de contenu

**Impact : MOYEN**

- "First measurable results within 30 days" apparait dans le hero (implicitement via "2-4 wks"), dans l'approach section, et dans la FAQ
- "Based on industry benchmarks" apparait 2 fois (section impact + disclaimer en bas)
- La section Difference et la section Principles communiquent des messages similaires avec des formulations differentes
- Le "readiness assessment" est mentionne environ 5 fois

---

## Recommandations concretes

### P0 -- Urgent (impact direct sur la conversion)

#### R1. Ajouter de la preuve sociale reelle
**Pourquoi :** C'est le facteur #1 de conversion en B2B. Sans preuve sociale, le site est une brochure sans credibilite.
**Quoi faire :**
- Si pas de clients encore : ajouter des "Featured In" logos (medias, partenariats), badges de certification, nombre de heures de consulting combinees
- Si clients existants : 2-3 temoignages courts avec nom, role, entreprise + logo
- Placer un bloc de preuve sociale juste apres le hero (avant ou apres la trust bar)
**Impact attendu :** +30-60% de conversion sur le formulaire

#### R2. Reduire le formulaire a 3-4 champs
**Pourquoi :** Chaque champ supplementaire reduit la conversion de 5-10%. Le textarea est particulierement tueur.
**Quoi faire :**
- Champs : Email, Prenom, Company (optionnel). C'est tout.
- Deplacer Industry et Challenge dans un follow-up email ou dans le call de qualification
- Alternative : Calendly embed direct pour booker un call
**Impact attendu :** +20-40% de soumission du formulaire

#### R3. Remplacer le canvas neural par du contenu a valeur ajoutee
**Pourquoi :** L'espace est premium (above the fold, droite du hero). Il doit travailler pour la conversion, pas etre decoratif.
**Quoi faire :**
- Option A : Video courte du fondateur (30s, "Here's what we do")
- Option B : Screenshot annote d'un dashboard/systeme reel
- Option C : Mini case study visuel ("Agency X reduced manual reporting by 40%")
**Impact attendu :** Augmente la credibilite perceptible et le temps passe sur le hero

### P1 -- Important (perception premium et differenciation)

#### R4. Changer la typographie
**Pourquoi :** Space Grotesk + Inter = generique. Pour un cabinet premium, la typo est le signal de qualite le plus subtil et le plus puissant.
**Quoi faire :**
- Headings : Passer a une serif contemporaine (Fraunces, Instrument Serif, Newsreader) OU une sans-serif a forte personnalite (Satoshi, Cabinet Grotesk, General Sans)
- Body : Remplacer Inter par un body text plus distinctif (Switzer, Plus Jakarta Sans, Geist)
- S'assurer que les fallback fonts ne creent pas de layout shift
**Impact attendu :** Perception de qualite et memorabilite nettement ameliorees

#### R5. Casser la monotonie visuelle des sections mid-page
**Pourquoi :** Le "mur sombre" fatigue l'oeil et diminue l'engagement scroll.
**Quoi faire :**
- Introduire 1-2 sections avec un fond legerement different (ex: un gradient subtil, un fond card plus clair)
- Varier les layouts : toutes les sections sont titre + grille de cartes. Alterner avec des layouts asymetriques, des full-width elements, des sections plus courtes
- Ajouter des elements visuels de rupture entre sections (ligne gold, icone large, stat mise en avant)
- Reduire le nombre de sections : fusionner Principles + Difference (ils disent la meme chose) et compacter Vision 2030
**Impact attendu :** Scroll depth ameliore, engagement accru

#### R6. Condenser le contenu -- moins de sections, plus d'impact
**Pourquoi :** 10 sections avant le formulaire = trop. L'attention du visiteur chute drastiquement apres 3-4 scrolls.
**Quoi faire :**
- Supprimer ou fusionner Vision 2030 avec la section Difference/Principles
- Condenser Principles de 6 a 3-4 items (les plus differenciants)
- Placer le CTA contact plus tot dans le flow (apres Impact ou Team)
- Regle : chaque section doit repondre a une objection specifique du buyer
**Impact attendu :** Parcours de conversion raccourci, taux d'arrivee au formulaire augmente

### P2 -- Nice-to-have (polish et details)

#### R7. Ameliorer les focus states pour l'accessibilite
**Pourquoi :** Les focus states actuels (border-color dorée sur les inputs) sont corrects mais les liens de navigation n'ont pas de focus visible custom. WCAG AA demande un indicateur visible 3:1 contraste.
**Quoi faire :**
- Ajouter un `outline` ou `box-shadow` visible sur `:focus-visible` pour tous les elements interactifs (liens nav, liens footer, cards FAQ, boutons)
- Tester avec keyboard-only navigation

#### R8. Ajouter une micro-animation d'entree sur le hero
**Pourquoi :** Le hero est le moment le plus impactant. Une animation d'entree staggered (titre > sous-titre > CTA > stats) renforce la perception de qualite.
**Quoi faire :**
- CSS `@keyframes` stagger sur les elements hero avec `animation-delay`
- Garder les durees courtes (300-500ms) et le `prefers-reduced-motion` override

#### R9. Self-host les fonts
**Pourquoi :** Deja dans le TODO du CLAUDE.md. Google Fonts ajoute de la latence (DNS lookup, render blocking). Important pour le LCP.
**Quoi faire :**
- Telecharger les woff2, les mettre dans un dossier `/fonts/`
- Utiliser `@font-face` avec `font-display: swap`

#### R10. Ajouter un indicateur visuel de dropdown sur le select Industry
**Pourquoi :** `appearance: none` sans fleche custom rend le select non-identifiable comme interactif.
**Quoi faire :**
- Ajouter un chevron SVG en `background-image` a droite du select

---

## Resume des priorites

| # | Recommandation | Priorite | Effort | Impact conversion |
|---|---|---|---|---|
| R1 | Preuve sociale reelle | P0 | Moyen | +++ |
| R2 | Reduire le formulaire | P0 | Faible | ++ |
| R3 | Remplacer le canvas decoratif | P0 | Moyen | ++ |
| R4 | Typographie distinctive | P1 | Faible | + (perception) |
| R5 | Casser la monotonie visuelle | P1 | Moyen | + |
| R6 | Condenser le contenu | P1 | Moyen | ++ |
| R7 | Focus states a11y | P2 | Faible | - (compliance) |
| R8 | Micro-animation hero | P2 | Faible | + |
| R9 | Self-host fonts | P2 | Faible | + (perf) |
| R10 | Chevron select | P2 | Trivial | - |

---

## Verdict

Le site a un bon squelette et une direction visuelle coherente. Le principal probleme n'est pas technique mais strategique : **il n'y a aucune preuve que AITENCO a deja livre quoi que ce soit**. Pour un buyer B2B enterprise, c'est eliminatoire.

Les 3 actions a plus fort ROI :
1. Ajouter de la preuve sociale (meme minimale)
2. Simplifier le formulaire
3. Remplacer les elements decoratifs par du contenu a valeur ajoutee

Le reste (typo, layout variation, contenu condense) ameliore la perception premium mais ne compensera pas l'absence de social proof.
