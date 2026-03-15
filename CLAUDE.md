# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PoxelBit is a static portfolio/services website for a digital solutions agency. It is pure HTML/CSS/JavaScript with no build system or package manager — all dependencies are loaded via CDN.

## Running Locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Alternatively, open `index.html` directly.

## Branches

- **`main`**: Simplified single-file site (`index.html` only, ~216 lines). Uses Tailwind CSS CDN + Lucide icons + Animate.css.
- **`pro`**: Full multi-page version with `index.html`, `styles.css`, `script.js`, and 6 service pages under `servicios/`. Uses a custom CSS design system instead of Tailwind.

## Architecture

### Main branch
Single `index.html` with embedded styles — no JavaScript beyond Lucide icon initialization.

### Pro branch
- `index.html` — landing page, references `styles.css` and `script.js`
- `styles.css` — ~2100 lines, custom CSS design system using CSS variables for theming, glass-morphism effects, mesh gradients
- `script.js` — `ParticleSystem` class (canvas-based), scroll animations, hamburger menu, mouse interaction effects
- `servicios/*.html` — 6 service pages (web dev, AI, blockchain, software systems, virtual agents, web pages) sharing a consistent layout

## Key Details

- Language: Spanish (es-MX)
- No backend, no build step, no tests — deploy directly to any static host (GitHub Pages, Vercel, Netlify)
- Remote: https://github.com/uxurimx/poxelbit
