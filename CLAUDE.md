# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "Чайхона Согдиана" (Sogdiana Teahouse) - an Uzbek cafe in Voronezh, Russia. No build tools or frameworks - pure HTML, CSS, and vanilla JavaScript.

## Development

### Local Server
The menu page requires a local server due to JSON fetch:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
Then open http://localhost:8000

### Deployment
Files can be deployed via drag-and-drop to Netlify or uploaded to any static hosting. Currently deployed at meek-dasik-ba9467.netlify.app

## Architecture

### Menu System
- Menu data stored in `data/menu.json` (categories, items with prices, weights, images)
- `js/menu.js` loads JSON and renders menu dynamically
- Category filtering via URL hash (e.g., `menu.html#plov`)
- Items with `"popular": true` get a "Хит" badge

### CSS Design System
`css/style.css` contains CSS custom properties:
- Colors: `--color-primary` (purple #2D1B4E), `--color-secondary` (gold #D4A574)
- Fonts: Montserrat (headings), Inter (body)
- Spacing scale: `--spacing-xs` through `--spacing-4xl`
- Components in `css/components.css`, responsive breakpoints in `css/responsive.css`

### JavaScript
- `js/main.js`: Mobile menu, sticky header, scroll animations, utilities
- `js/menu.js`: Menu rendering from JSON, category filtering
- Utility functions exposed via `window.SogdianaUtils` (formatPrice, debounce, throttle)

### HTML Pages
- `index.html` - Homepage with hero, features, popular dishes
- `menu.html` - Full menu with category filters
- `about.html` - About the restaurant
- `contacts.html` - Contact info with Yandex Maps embed

## Key Patterns

- All logos use inline SVG (cup icon), not emoji
- Animations use `[data-animate]` attribute with IntersectionObserver
- Images have placeholder SVG fallbacks (no external images currently)
- Phone numbers use `tel:` links, all show placeholder `+7 (926) XXX-XX-XX`
- Year in footer: 2026
