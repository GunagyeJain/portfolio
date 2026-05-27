# Mobile Responsive Design Spec
**Date:** 2026-05-28
**Branch:** mobile-responsive
**Scope:** Make the portfolio work on mobile by switching to normal browser scrolling with simplified animations.

---

## Problem

The portfolio uses a custom RAF-based scroll-jacking system (fixed sections, wheel/touch input → `targetProg` → lerped `currentProg` → CSS transforms). This is designed for precise mouse/trackpad input and does not work well on mobile:

- Touch scroll feels unnatural with the custom lerp
- `SCROLL_DIST = 800` is far too long for a phone swipe
- All sections are `position: fixed; inset: 0` — they overlap each other and only the active one is visible
- Padding, grids, and font sizes are desktop-only
- No responsive CSS exists (only one `@media (hover: none)` rule)

---

## Approach

**Single codebase, JS mobile gate + CSS breakpoints.**

Detect mobile via `window.matchMedia('(max-width: 768px)')` on mount. On mobile:
- Skip the RAF scroll-jacking loop entirely
- Skip wheel/touch input listeners
- Let `html/body` scroll normally (`overflow-y: auto`)
- Sections become normal flow elements (`position: relative`)
- One `IntersectionObserver` triggers `.is-visible` CSS fade-ins as sections scroll into view

Desktop behavior is completely unchanged.

---

## Breakpoint

`768px` — covers phones and small tablets in portrait. Landscape tablets at 768px+ get the desktop experience.

---

## App.jsx Changes

### Mobile detection
```js
const isMobile = window.matchMedia('(max-width: 768px)').matches
```
Evaluated once on mount. No listener needed — orientation changes re-mount or the user can refresh.

### Gate all animation useEffects
Both the RAF tick loop and the wheel/touchstart/touchend/keydown input listeners are wrapped:
```js
useEffect(() => {
  if (isMobile) return
  // ... existing RAF loop
}, [])

useEffect(() => {
  if (isMobile) return
  // ... existing input listeners
}, [])

useEffect(() => {
  if (isMobile) return
  // ... fog canvas init
}, [])
```

### IntersectionObserver (mobile only)
New `useEffect` that only runs on mobile:
```js
useEffect(() => {
  if (!isMobile) return
  const els = document.querySelectorAll('.section-animate, .project-card')
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle('is-visible', e.isIntersecting)),
    { threshold: 0.12 }
  )
  els.forEach(el => obs.observe(el))
  return () => obs.disconnect()
}, [])
```

### JSX: add `.section-animate` to animatable section wrappers
- `<Statement>` section element — add `section-animate` class inside `Statement.jsx`
- `<About>` section element — add `section-animate` class inside `About.jsx`
- `<Contact>` section element — add `section-animate` class inside `Contact.jsx`

`ProjectCard` elements already have class `project-card` and are targeted directly by the observer — no component change needed.

---

## CSS Changes (`index.css`)

All changes live inside a single `@media (max-width: 768px)` block at the bottom of the file.

### Global
```css
html, body { overflow-y: auto; overflow-x: hidden; height: auto; }
```

### All fixed sections → normal flow
Every section (`hero`, `about`, `statement`, `projects-deck`, `contact`) gets:
```css
position: relative;
width: 100%;
transform: none !important;
clip-path: none !important;
opacity: 1 !important;
z-index: auto;
```
`!important` overrides any inline styles the (now-disabled) RAF loop might have left on initial render before the mobile check fires.

### Hidden on mobile
```css
.fog-canvas,
.portal-overlay,
.arch-curtain { display: none; }
```

### Scroll-triggered fade-in
```css
.section-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.section-animate.is-visible {
  opacity: 1;
  transform: none;
}
```

For staggered card reveals, each `.project-card` gets `transition-delay` based on its index (handled via `nth-child` or inline style).

### Hero
- `min-height: 100svh`
- `padding: 0 24px` (reduce from desktop 80px sides)
- `.hero__name` font-size: `clamp(56px, 18vw, 96px)`
- `.hero__badge-row`, `.hero__callout`: adjust spacing

### Statement
- `min-height: 100svh`
- `.statement__line` font-size: `clamp(36px, 12vw, 72px)`
- `.statement__inner` padding: `60px 24px`
- Canvas: still renders, no warp (no mouse on mobile)

### ProjectsDeck
- `position: relative; min-height: auto; padding: 80px 24px`
- `.projects-deck__scene`: no perspective transform
- `.projects-deck__stack`: `position: relative; display: flex; flex-direction: column; gap: 20px`
- `.project-card`: `position: relative; width: 100%; opacity: 0; transform: translateY(24px); transition: ...`
- `.project-card.is-visible`: `opacity: 1; transform: none`
- Cards stagger via `nth-child` transition-delay: `0s, 0.1s, 0.2s, 0.3s`

### About
- `position: relative; min-height: 100svh; padding: 80px 24px`
- `.about-grid`: `grid-template-columns: 1fr` (single column, figure column hidden)
- `.about-grid > :nth-child(1), .about-grid > :nth-child(2)`: `display: none` (hide empty figure columns)
- `.about-bio`: `max-width: 100%; align-self: center`
- `.about-bgword`: `font-size: 40vw`
- `.about-footnote`: reposition for mobile

### Contact
- `position: relative; min-height: 100svh; padding: 80px 24px`
- `.contact-heading`: `font-size: clamp(52px, 16vw, 96px)`
- `.contact-links`: `flex-direction: column`
- `.contact-link`: full width
- `.contact-bgword`: `font-size: 40vw`
- Frame/fiducials: hidden on mobile (too small to be meaningful)

### Navbar
- Already fixed, should work on mobile
- Adjust padding for narrower screens

---

## Section Component Changes

### `About.jsx`
No logic changes. The canvas `figScale` already uses `window.innerHeight` and `window.innerWidth`, so it recalculates correctly on mobile portrait. The warp grid and figure simply draw without mouse interaction, which is fine.

### `ProjectsDeck.jsx`
Add `.section-animate` to each `<ProjectCard>` via the existing `ref` pattern, or pass it as a className. The `cardRefs` array is already wired — on mobile the IntersectionObserver targets `.project-card` elements directly so no component change is needed.

### `Statement.jsx`, `Contact.jsx`, `Hero.jsx`
No component changes. CSS handles layout reflow.

---

## What's Kept vs Removed on Mobile

| Feature | Mobile |
|---|---|
| GSAP hero letter entrance | ✅ Kept |
| Canvas grid backgrounds (Hero, About, Statement) | ✅ Kept — static, no warp |
| Scroll-triggered section fade-ins | ✅ New |
| Project card staggered reveal | ✅ New |
| Contact link layout | ✅ Adapted |
| 3D card stacking + flatten animation | ❌ Removed |
| Portal dot transition | ❌ Removed |
| Fog canvas sweep | ❌ Removed |
| Clip-path Statement reveal | ❌ Removed |
| Arch curtain loop | ❌ Removed |
| About slide-up from bottom | ❌ Removed |
| Custom cursor | ❌ Already hidden |

---

## Out of Scope

- Landscape-specific overrides (desktop experience kicks in at 769px+)
- Performance optimisation of canvas on low-end devices
- Touch gesture navigation between sections
