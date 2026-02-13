# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Valentine's Day mini-game "Поймай сердечки" (Catch the Hearts). A mobile-first web game where the player catches falling heart emojis with a basket to reveal love messages, ending with a final photo + message screen.

## Commands

- `npm run dev` — dev server on port 5155 with `--host`
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

## Architecture

**Stack:** Vite + Alpine.js + GSAP + vanilla CSS

**Data flow:** `index.html` (Alpine directives) → `main.js` (init) → `game.js` (state & logic) → `animations.js` (GSAP tweens)

**Key files:**
- `src/game.js` — Alpine component with all game state and logic. Phases: `start` → `playing` → `final`. Uses `requestAnimationFrame` game loop for collision detection, reads heart positions via `getBoundingClientRect()` while GSAP controls DOM transforms.
- `src/animations.js` — GSAP animation functions. Uses `fromTo` (not `from`) for elements toggled by Alpine's `x-show` to avoid opacity conflicts.
- `src/messages.js` — Love messages array and final screen content. Personalized for "Настя".
- `src/style.css` — All styles. Uses CSS variables, `clamp()` for responsive sizing, `100dvh` with `100vh` fallback.
- `index.html` — Alpine directives (`x-data="game"`, `x-show`, `x-for`). Touch events use manual `preventDefault()` in handler (not `.prevent` modifier) so buttons work on mobile.

## Key Patterns

- **GSAP + Alpine conflict:** Never use `x-transition` on elements animated by GSAP. Use `gsap.fromTo()` instead of `gsap.from()` for elements controlled by `x-show`.
- **Mobile touch:** `@touchstart`/`@touchmove` without `.prevent` on the container; `event.preventDefault()` is called inside `handlePointerMove()` only when `phase === 'playing'` so UI buttons remain tappable.
- **Graphics:** Emoji-based (no sprites/images except final photo in `public/photo.jpg`).
