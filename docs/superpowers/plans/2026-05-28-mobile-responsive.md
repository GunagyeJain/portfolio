# Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio work on mobile by bypassing the RAF scroll-jacking system and switching to normal browser scrolling with CSS-only layout reflows and IntersectionObserver fade-in animations.

**Architecture:** A module-level `IS_MOBILE` boolean in `App.jsx` gates all three animation useEffects so the RAF loop, wheel/touch listeners, and fog canvas never run on mobile. A fourth useEffect (mobile-only) attaches an IntersectionObserver that adds `.is-visible` to sections and cards as they scroll into view. All layout reflows live in a single `@media (max-width: 768px)` block at the bottom of `index.css`.

**Tech Stack:** React 19, Vite, vanilla CSS media queries, IntersectionObserver API

---

## File Map

| File | What changes |
|---|---|
| `src/App.jsx` | Add `IS_MOBILE` constant; wrap 3 existing useEffects with early return; add IntersectionObserver useEffect |
| `src/index.css` | Add `@media (max-width: 768px)` block at bottom |
| `src/components/sections/Statement.jsx` | Add `section-animate` class to `<section>` |
| `src/components/sections/About.jsx` | Add `section-animate` class to `<section>` |
| `src/components/sections/Contact.jsx` | Add `section-animate` class to `<section>` |

---

## Task 1: Add `IS_MOBILE` and gate the RAF tick loop

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the mobile detection constant at the top of App.jsx, after the imports**

Open `src/App.jsx`. After the last import line and before the constants block (`const SCROLL_DIST`), add:

```js
// Evaluated once at module load — no listener needed, orientation changes can refresh
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches
```

- [ ] **Step 2: Gate the RAF tick loop useEffect**

The first `useEffect` (around line 43) starts with `let rafId` and contains the `tick` function. Wrap its entire body with an early return:

```js
useEffect(() => {
  if (IS_MOBILE) return   // ← add this line as the very first line of the effect
  let rafId
  // ... rest of existing code unchanged ...
}, [])
```

- [ ] **Step 3: Verify dev server shows no console errors**

Run `npm run dev` (if not already running). Open `http://localhost:5173` in a browser, open DevTools console. No errors should appear.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(mobile): add IS_MOBILE gate — skip RAF loop on mobile"
```

---

## Task 2: Gate the input listeners and fog canvas useEffects

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Gate the input listeners useEffect**

The second `useEffect` (around line 229) starts with `const clamp = (v) =>` and registers `onWheel`, `onTouchStart`, `onTouchEnd`, `onKey`. Add early return as the first line:

```js
useEffect(() => {
  if (IS_MOBILE) return   // ← add this line
  const clamp = (v) => Math.max(0, Math.min(MAX_PROG, v))
  // ... rest unchanged ...
}, [])
```

- [ ] **Step 2: Gate the fog canvas init useEffect**

The third `useEffect` (around line 269) starts with `const init = () => {` and sets up `fogRef` canvas size + particles. Add early return:

```js
useEffect(() => {
  if (IS_MOBILE) return   // ← add this line
  const init = () => {
  // ... rest unchanged ...
}, [])
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(mobile): gate input listeners and fog canvas on mobile"
```

---

## Task 3: Add IntersectionObserver useEffect (mobile only)

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add the IntersectionObserver useEffect after the fog canvas useEffect**

Add this new useEffect block after the existing three useEffects, before the `return (` JSX:

```js
useEffect(() => {
  if (!IS_MOBILE) return
  const els = document.querySelectorAll('.section-animate, .project-card')
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting)),
    { threshold: 0.12 }
  )
  els.forEach((el) => obs.observe(el))
  return () => obs.disconnect()
}, [])
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat(mobile): add IntersectionObserver for scroll-triggered reveals"
```

---

## Task 4: Add `section-animate` class to Statement, About, Contact

**Files:**
- Modify: `src/components/sections/Statement.jsx`
- Modify: `src/components/sections/About.jsx`
- Modify: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Statement.jsx — add class to section element**

In `src/components/sections/Statement.jsx`, find:
```jsx
<section ref={sectionRef} className="statement">
```
Change to:
```jsx
<section ref={sectionRef} className="statement section-animate">
```

- [ ] **Step 2: About.jsx — add class to section element**

In `src/components/sections/About.jsx`, find:
```jsx
<section ref={sectionRef} className="about">
```
Change to:
```jsx
<section ref={sectionRef} className="about section-animate">
```

- [ ] **Step 3: Contact.jsx — add class to section element**

In `src/components/sections/Contact.jsx`, find:
```jsx
<section ref={sectionRef} className="contact">
```
Change to:
```jsx
<section ref={sectionRef} className="contact section-animate">
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Statement.jsx src/components/sections/About.jsx src/components/sections/Contact.jsx
git commit -m "feat(mobile): add section-animate class to Statement, About, Contact"
```

---

## Task 5: Global mobile CSS — resets, hidden elements, fade-in classes

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add the `@media (max-width: 768px)` block at the very bottom of `index.css`**

Append the following to the end of `src/index.css`:

```css
/* ════════════════════════════════════════════════════════
   MOBILE  (≤ 768px) — normal-scroll layout
   All scroll-jacking is disabled in App.jsx (IS_MOBILE gate).
   These rules reflow every section into normal document flow.
   ════════════════════════════════════════════════════════ */

@media (max-width: 768px) {

  /* ── Global resets ─────────────────────────────────── */

  html {
    overflow: visible;
    height: auto;
  }

  body {
    overflow-x: hidden;
    overflow-y: auto;
    height: auto;
    cursor: auto;
  }

  /* ── Hide desktop-only transition elements ─────────── */

  .fog-canvas,
  .portal-overlay,
  .arch-curtain {
    display: none !important;
  }

  /* ── Scroll-triggered fade-in ──────────────────────── */

  .section-animate {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }

  .section-animate.is-visible {
    opacity: 1;
    transform: none;
  }

}
```

- [ ] **Step 2: Verify in browser at 375px width**

In DevTools, set viewport to 375px wide. The page should now scroll normally (no custom scroll-jacking). Statement, About, Contact sections should be invisible until scrolled into view (once per-section CSS is added in later tasks — currently they may overlap since fixed positioning not yet removed).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): global CSS resets, hide transition elements, add fade-in classes"
```

---

## Task 6: Mobile CSS — all sections un-fixed + Navbar

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add section resets inside the `@media (max-width: 768px)` block**

Inside the existing `@media (max-width: 768px)` block (after the `.section-animate.is-visible` rule), add:

```css
  /* ── Un-fix all sections into normal document flow ─── */

  .hero {
    position: relative;
    min-height: 100svh;
    z-index: auto;
  }

  .statement {
    position: relative;
    min-height: 100svh;
    inset: auto;
    z-index: auto;
    clip-path: none !important;
    will-change: auto;
  }

  .projects-deck {
    position: relative;
    min-height: auto;
    inset: auto;
    z-index: auto;
    transform: none !important;
    will-change: auto;
    align-items: flex-start;
  }

  .about {
    position: relative;
    min-height: 100svh;
    inset: auto;
    z-index: auto;
    transform: none !important;
    will-change: auto;
    overflow: visible;
  }

  .contact {
    position: relative;
    min-height: 100svh;
    inset: auto;
    z-index: auto;
    opacity: 1 !important;
    will-change: auto;
    overflow: visible;
  }

  /* ── Navbar — reduce padding on narrow screens ─────── */

  .navbar {
    padding: 16px 20px;
  }
```

- [ ] **Step 2: Verify at 375px**

Sections should now stack vertically in the document. Hero → Statement → ProjectsDeck → About → Contact in order. You should be able to scroll through all of them.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): un-fix all sections into normal document flow"
```

---

## Task 7: Mobile CSS — Hero

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add Hero mobile styles inside the `@media` block**

```css
  /* ── Hero ──────────────────────────────────────────── */

  .hero {
    padding: 80px 24px 60px;
  }

  .hero__line--1,
  .hero__line--2 {
    font-size: clamp(52px, 18vw, 96px);
  }

  .hero__callout {
    left: 24px;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): Hero responsive sizing"
```

---

## Task 8: Mobile CSS — Statement

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add Statement mobile styles inside the `@media` block**

```css
  /* ── Statement ─────────────────────────────────────── */

  .statement {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .statement__inner {
    width: 90vw;
    padding: 0 0 40px;
  }

  .statement__line {
    font-size: clamp(32px, 11vw, 72px);
  }

  .statement__stat--tr {
    display: none;
  }

  .statement__stat--tl {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 12px;
    display: block;
  }

  .statement__body {
    padding: 24px 0 20px;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): Statement responsive sizing"
```

---

## Task 9: Mobile CSS — ProjectsDeck and cards

**Files:**
- Modify: `src/index.css`

The desktop deck uses `projects-deck__stack` as a `position: relative; width: 680px; height: 420px` container with cards `position: absolute; inset: 0` stacked on top of each other. On mobile this needs to become a vertical scrolling list.

- [ ] **Step 1: Add ProjectsDeck mobile styles inside the `@media` block**

```css
  /* ── Projects Deck ─────────────────────────────────── */

  .projects-deck {
    padding: 60px 20px 80px;
  }

  .projects-deck__bg {
    display: none;
  }

  .projects-deck__scene {
    width: 100%;
    margin-bottom: 0;
    gap: 24px;
    will-change: auto;
    transform: none !important;
  }

  .projects-deck__header {
    width: 100%;
  }

  .projects-deck__title {
    font-size: clamp(48px, 16vw, 96px);
  }

  .projects-deck__stack {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Project cards — vertical list on mobile ───────── */

  .project-card {
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    min-height: 280px;
    opacity: 0;
    pointer-events: auto;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .project-card:nth-child(1) { transition-delay: 0s;    }
  .project-card:nth-child(2) { transition-delay: 0.08s; }
  .project-card:nth-child(3) { transition-delay: 0.16s; }
  .project-card:nth-child(4) { transition-delay: 0.24s; }

  .project-card.is-visible {
    opacity: 1;
    transform: none;
  }

  .project-card__inner {
    padding: 24px 20px 20px;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): ProjectsDeck vertical card list"
```

---

## Task 10: Mobile CSS — About

**Files:**
- Modify: `src/index.css`

The desktop About uses a `grid-template-columns: 1fr 460px 1fr` 3-column layout where col 1 and col 2 are empty (the figure is drawn on the canvas). On mobile, collapse to a single column showing only the bio.

- [ ] **Step 1: Add About mobile styles inside the `@media` block**

```css
  /* ── About ─────────────────────────────────────────── */

  .about {
    padding: 80px 24px 100px;
  }

  .about__grid {
    display: none;
  }

  .about-grid {
    grid-template-columns: 1fr;
    height: auto;
    padding-top: 20px;
  }

  .about-grid > :nth-child(1),
  .about-grid > :nth-child(2) {
    display: none;
  }

  .about-bio {
    max-width: 100%;
  }

  .about-bgword {
    font-size: 40vw;
  }

  .about-footnote {
    top: 24px;
    left: 24px;
    transform: none;
  }

  .about__sheet-tag {
    left: 24px;
    right: 24px;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): About single-column layout"
```

---

## Task 11: Mobile CSS — Contact

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add Contact mobile styles inside the `@media` block**

```css
  /* ── Contact ───────────────────────────────────────── */

  .contact-inner {
    height: auto;
    padding: 100px 24px 80px;
    max-width: 100%;
  }

  .contact-heading {
    font-size: clamp(52px, 16vw, 120px);
  }

  .contact-links {
    flex-direction: column;
    gap: 0;
  }

  .contact-link {
    padding: 16px 0;
  }

  .contact-bgword {
    font-size: 40vw;
  }

  .contact__frame,
  .contact__fid {
    display: none;
  }

  .contact__sheet-tag {
    left: 24px;
    right: 24px;
  }
```

- [ ] **Step 2: Verify full mobile flow at 375px**

Scroll through the full page at 375px viewport width. Check:
- Hero: name fits, GSAP animation fires on load
- Statement: text readable, section-animate fade-in works on scroll
- ProjectsDeck: cards stack vertically, each fades in on scroll
- About: bio text visible, figure canvas hidden, section-animate works
- Contact: heading fits, links stacked, section-animate works

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(mobile): Contact responsive layout"
```

---

## Task 12: Fix `about__sheet-tag` and `contact__sheet-tag` — check they exist on mobile

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Check the sheet-tag CSS to confirm it has absolute positioning that needs overriding**

Run this grep to find the current sheet-tag styles:
```bash
grep -n "sheet-tag" src/index.css
```

- [ ] **Step 2: If `.about__sheet-tag` or `.contact__sheet-tag` have `position: absolute` with left/right values that break on mobile, override them in the `@media` block**

If the grep shows `position: absolute; bottom: ...; left: ...; right: ...` on the sheet tags, add inside the `@media` block:

```css
  .about__sheet-tag,
  .contact__sheet-tag {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    margin-top: 32px;
  }
```

If the sheet tags already work fine at narrow widths (they're `position: absolute` inside the section which is now normal flow), skip this step.

- [ ] **Step 3: Final check — test on a real device or browser emulator at 390px (iPhone 14)**

Open DevTools → Device Toolbar → iPhone 14 (390×844). Scroll through all 5 sections. Verify:
1. No horizontal overflow / horizontal scrollbar
2. All text readable (nothing overflowing its container)
3. GSAP hero animation fires
4. Section fade-ins trigger correctly on scroll
5. Contact links are tappable (large enough touch targets)
6. Navbar stays fixed at top and is readable

- [ ] **Step 4: Final commit**

```bash
git add src/index.css
git commit -m "feat(mobile): sheet-tag position fix and final mobile verification"
```
