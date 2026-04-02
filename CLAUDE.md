# CLAUDE.md - AITENCO Website

## Project

AITENCO is a B2B AI consulting/automation advisory firm. This repo is the marketing website: a static single-page site deployed on Vercel.

- **URL:** https://aitenco.com
- **Stack:** Static HTML + CSS + vanilla JS (no build step, no framework)
- **Hosting:** Vercel (edge CDN, serverless functions)
- **CRM:** HubSpot Free (contact form -> serverless function -> HubSpot API)
- **Domain registrar:** TBD (aintenco.com was the original, aitenco.com is the brand)

## Architecture

```
aitenco-site/
  index.html          Main single-page site
  style.css           All styles (extracted from inline)
  main.js             All JS (canvas, reveal, hamburger, form, FAQ)
  logo.svg            SVG logo (A with neural network nodes)
  favicon.svg         Same as logo, used as favicon
  privacy.html        Privacy policy page
  terms.html          Terms of service page
  robots.txt          Search engine directives
  sitemap.xml         XML sitemap (3 URLs)
  vercel.json         Vercel config (security headers, caching)
  api/
    contact.js        Vercel serverless function (form -> HubSpot)
```

## Key Decisions

- **No framework:** Single marketing page with zero dynamic content. HTML/CSS/JS is simpler, faster, and has no build overhead. Reconsider Next.js only if adding 10+ pages (blog, case studies).
- **No build step:** Files served as-is from Vercel CDN. No bundler, no minifier. File sizes are small enough that this is fine.
- **HubSpot Free CRM:** Chosen for free tier with contacts, pipeline, email tracking, and native form API.

## Environment Variables (Vercel)

- `HUBSPOT_PORTAL_ID` - HubSpot portal ID for form submissions
- `HUBSPOT_FORM_GUID` - HubSpot form GUID for the contact form

## Commands

- **Local dev:** `python3 -m http.server 8765` then open http://localhost:8765
- **Deploy:** Push to GitHub, Vercel auto-deploys

## Conventions

- CSS uses custom properties defined in `:root` in style.css
- Color palette: dark (#080a0f), gold (#c9a84c), blue (#3a8fff), green (#4caf50)
- Fonts: Space Grotesk (headings), Inter (body) via Google Fonts
- All JS is in IIFEs in main.js to avoid global scope pollution
- Animations respect `prefers-reduced-motion`
- Form uses real fetch to `/api/contact`, not fake submit

## Accessibility

- WCAG AA target
- Skip-to-content link
- Hamburger menu on mobile with aria-expanded
- Form inputs have labels (sr-only) and autocomplete attributes
- FAQ uses role="button", aria-expanded, aria-controls
- prefers-reduced-motion disables all animations

## SEO

- Meta description, OG tags, Twitter cards, canonical URL
- JSON-LD: Organization + WebSite + FAQPage
- robots.txt + sitemap.xml
- SVG favicon

## What's Not Done Yet

- HubSpot account setup (need PORTAL_ID + FORM_GUID)
- Real WhatsApp number (currently placeholder 971500000000)
- OG image (og-image.png 1200x630)
- Self-hosted fonts (currently Google Fonts CDN)
- Analytics (GA4 or Plausible)
- Arabic version / RTL
