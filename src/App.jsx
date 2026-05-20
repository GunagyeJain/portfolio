import { useRef, useState, useEffect } from 'react'
import './index.css'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/sections/Hero'
import Statement from './components/sections/Statement'
import ProjectsDeck from './components/sections/ProjectsDeck'
import About from './components/sections/About'

// px of wheel delta per one full section unit
const SCROLL_DIST = 800
// Max progress — grows as sections are added (currently: Statement + Deck entry + 4 cards + transition + About)
const MAX_PROG = 10
// Lerp factor
const LERP = 0.07

// Card stacking timing — each card takes CARD_DURATION scroll units to land,
// and CARD_STARTS controls when each begins (overlap = CARD_DURATION - gap)
const CARD_STARTS   = [0, 0.8, 1.6, 2.4]  // stackProg at which each card begins
const CARD_DURATION = 1.2                   // stackProg units each card takes to land

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const easeOutQuint   = (t) => 1 - Math.pow(1 - t, 5)
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export default function App() {
  const [currentSection, setCurrentSection] = useState(1)

  const statementEl    = useRef(null)
  const deckEl         = useRef(null)
  const aboutEl        = useRef(null)
  const portalRef      = useRef(null)
  const targetProg     = useRef(0)
  const currentProg    = useRef(0)
  const displaySection = useRef(1)

  // RAF loop — drives all panel positions every frame
  useEffect(() => {
    let rafId

    const tick = () => {
      const t = targetProg.current
      const c = currentProg.current
      const next = Math.abs(t - c) < 0.0001 ? t : c + (t - c) * LERP

      currentProg.current = next

      // ── Statement: slides up from bottom (prog 0 → 1) ──────────
      const s = statementEl.current
      if (s?.el) {
        s.el.style.transform = `translateY(${(1 - clamp01(next)) * 100}%)`
        const opacity = next < 0.5
          ? 0.35 + next * 2 * 0.65
          : 1
        s.el.style.setProperty('--text-opacity', opacity)
      }

      // ── Projects Deck: slides in from right (prog 1.3 → 2.8) ───
      // 0.3-unit dead zone after Statement fully covers, then 1.5 units
      // of travel so it takes real scroll force to pull in
      const deckProg = clamp01((next - 1.3) / 1.5)
      const deckEased = easeInOutCubic(deckProg)
      const d = deckEl.current
      if (d?.el) {
        d.el.style.transform = `translateX(${(1 - deckEased) * 100}%)`
      }

      // ── Card stacking (prog 2.8 → 6.4, overlapping entries) ────
      const stackProg = Math.max(0, Math.min(3.6, next - 2.8))
      if (d?.cards) {
        d.cards.forEach((cardEl, i) => {
          if (!cardEl) return

          const ep = clamp01((stackProg - CARD_STARTS[i]) / CARD_DURATION)

          if (ep <= 0) {
            cardEl.style.opacity = '0'
            cardEl.style.pointerEvents = 'none'
            return
          }

          // Fractional count of cards on top of card i (drives shrink + shift)
          let topCount = 0
          for (let j = i + 1; j < 4; j++) {
            topCount += clamp01((stackProg - CARD_STARTS[j]) / CARD_DURATION)
          }

          // Ease-out quint — fast start, very long soft landing
          const easedEp = easeOutQuint(ep)

          // Spread: each buried card shifts down 65px and shrinks 6%
          const stackY = topCount * 65
          // Entry: rise from below the viewport with eased motion
          const entryY = (1 - easedEp) * window.innerHeight * 2
          const scale  = 1 - topCount * 0.06

          cardEl.style.opacity       = '1'
          cardEl.style.transform     = `translateY(${stackY + entryY}px) scale(${scale})`
          cardEl.style.zIndex        = String(i + 1)
          cardEl.style.pointerEvents = 'auto'
        })
      }

      // ── Deck: 3D angle flattens + zooms (prog 6.4 → 7.2) ──────
      // Starts only after all 4 cards have fully stacked (prog 6.4)
      const flattenProg  = clamp01((next - 6.4) / 0.8)
      const flattenEased = easeInOutCubic(flattenProg)
      const rx = 38  * (1 - flattenEased)
      const ry = -13 * (1 - flattenEased)
      const rz = 20  * (1 - flattenEased)
      const sceneScale = 1 + flattenEased * 0.35
      const sceneEl = deckEl.current?.scene
      const bgEl    = deckEl.current?.bg
      if (sceneEl) sceneEl.style.transform = `perspective(3000px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sceneScale})`
      if (bgEl)    bgEl.style.transform    = `perspective(3000px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`

      // ── Portal dot: black box grows to fill screen (prog 7.0 → 7.4) ─
      const dotOpacity = clamp01((next - 7.0) / 0.25)
      const dotScale   = 1 + easeInOutCubic(clamp01((next - 7.05) / 0.35)) * 24
      const p = portalRef.current
      if (p) {
        p.style.opacity   = String(dotOpacity)
        p.style.transform = `scale(${dotScale})`
      }

      // ── About: portal zoom from centre (prog 7.0 → 8.0) ───────
      // Starts with the portal dot so there's never a bare black frame
      const aboutProg = clamp01((next - 7.0) / 1.0)
      const aboutEased = easeInOutCubic(aboutProg)
      const insetPct = 50 * (1 - aboutEased)
      const insetR   = 6  * (1 - aboutEased)
      const a = aboutEl.current
      if (a?.el) {
        a.el.style.clipPath = `inset(${insetPct}% round ${insetR}px)`
      }

      // ── Navbar counter ──────────────────────────────────────────
      // About halfway at 7.4 + 0.5 = 7.9
      const sec = next < 0.5 ? 1 : next < 2.05 ? 2 : next < 7.9 ? 3 : 4
      if (sec !== displaySection.current) {
        displaySection.current = sec
        setCurrentSection(sec)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Input listeners — only update the target, never the rendered position
  useEffect(() => {
    const clamp = (v) => Math.max(0, Math.min(MAX_PROG, v))

    const onWheel = (e) => {
      targetProg.current = clamp(targetProg.current + e.deltaY / SCROLL_DIST)
    }

    let touchY = 0
    const onTouchStart = (e) => { touchY = e.touches[0].clientY }
    const onTouchEnd   = (e) => {
      const diff = touchY - e.changedTouches[0].clientY
      targetProg.current = clamp(targetProg.current + diff / SCROLL_DIST)
    }

    const onKey = (e) => {
      if (['ArrowDown', 'Space', 'PageDown'].includes(e.code)) {
        e.preventDefault()
        targetProg.current = clamp(targetProg.current + 0.25)
      }
      if (['ArrowUp', 'PageUp'].includes(e.code)) {
        e.preventDefault()
        targetProg.current = clamp(targetProg.current - 0.25)
      }
    }

    window.addEventListener('wheel',      onWheel,      { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })
    window.addEventListener('keydown',    onKey)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('keydown',    onKey)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navbar currentSection={currentSection} />
      <Hero />
      <Statement ref={statementEl} />
      <ProjectsDeck ref={deckEl} />
      <div className="portal-overlay">
        <div ref={portalRef} className="portal-dot" />
      </div>
      <About ref={aboutEl} />
    </>
  )
}
