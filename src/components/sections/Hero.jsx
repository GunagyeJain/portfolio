import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SPACING  = 40
const RADIUS   = 200
const STRENGTH = 28

const splitWord = (word) =>
  word.split('').map((char, i) => (
    <span key={i} className="hero__letter">{char}</span>
  ))

export default function Hero() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)

  // Animated warp grid
  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    const ctx     = canvas.getContext('2d')

    const OFF = RADIUS * -4
    let mouseX = OFF, mouseY = OFF
    let lerpX  = OFF, lerpY  = OFF
    let wasOut = true
    let rafId

    const resize = () => {
      canvas.width  = section.offsetWidth
      canvas.height = section.offsetHeight
    }

    // Listen on window so the fixed navbar can't swallow events
    const onMove = (e) => {
      const r = section.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inBounds = x >= 0 && x <= r.width && y >= 0 && y <= r.height

      if (inBounds) {
        if (wasOut) {
          // Snap lerp on entry so warp appears instantly at cursor, not sweeping from off-screen
          lerpX = x
          lerpY = y
          wasOut = false
        }
        mouseX = x
        mouseY = y
      } else {
        if (!wasOut) {
          mouseX = OFF
          mouseY = OFF
          wasOut = true
        }
      }
    }

    const displaced = (x, y) => {
      const dx = x - lerpX
      const dy = y - lerpY
      const d  = Math.sqrt(dx * dx + dy * dy)
      if (d === 0 || d > RADIUS) return [x, y]
      const force = (1 - d / RADIUS) ** 2 * STRENGTH
      return [x + (dx / d) * force, y + (dy / d) * force]
    }

    const draw = () => {
      // Lerp mouse position for smooth trailing warp
      lerpX += (mouseX - lerpX) * 0.06
      lerpY += (mouseY - lerpY) * 0.06

      const w    = canvas.width
      const h    = canvas.height
      const cols = Math.ceil(w / SPACING) + 2
      const rows = Math.ceil(h / SPACING) + 2

      ctx.clearRect(0, 0, w, h)

      // Grid lines
      ctx.strokeStyle = 'rgba(10,10,10,0.09)'
      ctx.lineWidth   = 0.5

      for (let r = 0; r < rows; r++) {
        ctx.beginPath()
        for (let c = 0; c < cols; c++) {
          const [px, py] = displaced(c * SPACING, r * SPACING)
          c === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      for (let c = 0; c < cols; c++) {
        ctx.beginPath()
        for (let r = 0; r < rows; r++) {
          const [px, py] = displaced(c * SPACING, r * SPACING)
          r === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      // Intersection dots
      ctx.fillStyle = 'rgba(10,10,10,0.15)'
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const [px, py] = displaced(c * SPACING, r * SPACING)
          ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8)
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // GSAP letter entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const letters = sectionRef.current.querySelectorAll('.hero__letter')
      gsap.set(letters, { y: 60, opacity: 0 })
      gsap.to(letters, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.15,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hero">
      <canvas ref={canvasRef} className="hero__grid" />

      <div className="hero__content">
        <div className="hero__name">
          <div className="hero__line hero__line--1">{splitWord('GUNAGYE')}</div>
          <div className="hero__line hero__line--2">{splitWord('JAIN')}</div>
        </div>
        <div className="hero__badge-row">
          <span className="hero__badge">FULL-STACK DEVELOPER</span>
        </div>
      </div>

      <p className="hero__callout">&gt; 01 — HELLO WORLD</p>
    </section>
  )
}
