# Architecture Decisions

## 2026-03-15 — Day 1: Stack & Scaffold

### Stack
- **Runtime**: Bun (fast installs, native bundler compatibility)
- **Bundler**: Vite 8 (HMR, official Svelte plugin)
- **Framework**: Svelte 5 (runes, scoped CSS, built-in transitions)
- **Language**: JavaScript (no TypeScript)
- **CSS**: Scoped Svelte styles + CSS custom properties (no framework)
- **Deployment**: Docker (multi-stage) → DigitalOcean droplet
- **CI/CD**: GitHub Actions push-to-deploy
- **Domain**: shashidev.me (Namecheap)

### Why this stack
- Svelte 5 runes give fine-grained reactivity without virtual DOM overhead — perfect for real-time drag, resize, cursor tracking
- No CSS framework: everything custom (icons, colors, backgrounds, cursor) — a CSS framework would fight us
- Bun over Node: faster installs, native test runner, fewer moving parts
- Vite: fastest DX for Svelte, official plugin support

### Directory layout
```
src/lib/components/  — reusable UI (Desktop, Window, Loading, Cursor)
src/lib/stores/      — Svelte 5 rune-based state
src/lib/styles/      — global.css (reset), theme.css (CSS vars)
src/lib/utils/       — drag.js, position.js
src/apps/            — "applications" that open in windows
public/assets/       — static assets (icons, cursors, backgrounds)
```
