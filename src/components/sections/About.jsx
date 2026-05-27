import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

const TECH = [
  'React.js', 'Next.js', 'Python', 'JavaScript',
  'HTML/CSS', 'SQL', 'Flask', 'Supabase', 'Git', 'Photoshop',
]

// ── Geometry helpers ──────────────────────────────────────────
function bez3(p0, p1, p2, p3, n = 28) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, mt = 1 - t
    pts.push([
      mt**3*p0[0] + 3*mt**2*t*p1[0] + 3*mt*t**2*p2[0] + t**3*p3[0],
      mt**3*p0[1] + 3*mt**2*t*p1[1] + 3*mt*t**2*p2[1] + t**3*p3[1],
    ])
  }
  return pts
}

function ellipsePts(cx, cy, rx, ry, n = 52) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]
  })
}

// ── Pre-computed figure geometry (SVG 320×420 space) ─────────
const SILHOUETTE = [
  ...bez3([160,50],[108,50],[82,88],[82,138]),
  ...bez3([82,138],[82,180],[96,215],[124,232]).slice(1),
  [124,256],
  ...bez3([124,256],[96,268],[70,286],[50,320]).slice(1),
  [32,376],[288,376],[270,320],
  ...bez3([270,320],[250,286],[224,268],[196,256]).slice(1),
  [196,232],
  ...bez3([196,232],[224,215],[238,180],[238,138]).slice(1),
  ...bez3([238,138],[238,88],[212,50],[160,50]).slice(1),
]
const CONTOURS = [
  ellipsePts(160, 78,  56, 7),
  ellipsePts(160, 98,  68, 6),
  ellipsePts(160, 120, 74, 5),
  ellipsePts(160, 144, 76, 5),
  ellipsePts(160, 170, 72, 5),
  ellipsePts(160, 196, 58, 5),
  ellipsePts(160, 220, 42, 4),
]
const FIG_CX = 160
const FIG_CY = 210


// ── Main component ────────────────────────────────────────────
const About = forwardRef(function About(_, ref) {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)

  useImperativeHandle(ref, () => ({
    get el() { return sectionRef.current },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.lineCap  = 'round'
    ctx.lineJoin = 'round'

    const GRID_SPACING  = 40
    const WARP_RADIUS   = 200
    const WARP_STRENGTH = 28

    let W = 0, H = 0, figX = 0, figY = 0, figScale = 1

    const initLayout = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      figScale = Math.min(400 / 320, (H * 0.72) / 420)
      figX = W / 2 - 160 * figScale
      figY = H / 2 - 210 * figScale
    }

    const OFF = -2000
    let mouseX = OFF, mouseY = OFF
    let lerpX  = OFF, lerpY  = OFF

    const onMouseMove  = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    const onMouseLeave = ()  => { mouseX = OFF; mouseY = OFF }

    // Radial warp in screen/canvas coordinates
    const disp = (x, y) => {
      const dx = x - lerpX, dy = y - lerpY
      const dist = Math.hypot(dx, dy)
      if (dist === 0 || dist > WARP_RADIUS) return [x, y]
      const force = (1 - dist / WARP_RADIUS) ** 2 * WARP_STRENGTH
      return [x + (dx / dist) * force, y + (dy / dist) * force]
    }

    // SVG figure point → canvas coords → warped canvas coords
    const dispFig = ([sx, sy]) =>
      disp(figX + sx * figScale, figY + sy * figScale)

    const strokeFig = (pts, close = false) => {
      if (!pts.length) return
      ctx.beginPath()
      const [sx, sy] = dispFig(pts[0])
      ctx.moveTo(sx, sy)
      for (let i = 1; i < pts.length; i++) {
        const [px, py] = dispFig(pts[i])
        ctx.lineTo(px, py)
      }
      if (close) ctx.closePath()
      ctx.stroke()
    }

    const drawFigure = () => {
      ctx.lineWidth = 1.6 * figScale
      strokeFig(SILHOUETTE, true)
      ctx.lineWidth   = 0.9 * figScale
      ctx.globalAlpha = 0.55
      CONTOURS.forEach(pts => strokeFig(pts, true))
      ctx.globalAlpha = 1
    }

    let rafId
    const draw = () => {
      lerpX += (mouseX - lerpX) * 0.06
      lerpY += (mouseY - lerpY) * 0.06

      ctx.clearRect(0, 0, W, H)

      // ── Full background warp grid (matches Hero) ──────────────
      const cols = Math.ceil(W / GRID_SPACING) + 2
      const rows = Math.ceil(H / GRID_SPACING) + 2

      ctx.strokeStyle = 'rgba(240,237,232,0.04)'
      ctx.lineWidth   = 0.5

      for (let r = 0; r < rows; r++) {
        ctx.beginPath()
        for (let c = 0; c < cols; c++) {
          const [px, py] = disp(c * GRID_SPACING, r * GRID_SPACING)
          c === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      for (let c = 0; c < cols; c++) {
        ctx.beginPath()
        for (let r = 0; r < rows; r++) {
          const [px, py] = disp(c * GRID_SPACING, r * GRID_SPACING)
          r === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(240,237,232,0.07)'
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const [px, py] = disp(c * GRID_SPACING, r * GRID_SPACING)
          ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8)
        }
      }

      // ── Chromatic aberration: activates across the whole figure
      // chromRad = 160 SVG units converted to screen pixels
      const figCX     = figX + FIG_CX * figScale
      const figCY     = figY + FIG_CY * figScale
      const chromRad  = 160 * figScale
      const distToFig = Math.hypot(lerpX - figCX, lerpY - figCY)
      const chromStr  = Math.max(0, 1 - distToFig / chromRad) ** 1.8
      const chromOff  = chromStr * 12

      if (chromOff > 0.4) {
        ctx.save()
        ctx.translate(-chromOff, -chromOff * 0.45)
        ctx.strokeStyle = `rgba(255, 30, 60, ${chromStr * 0.72})`
        drawFigure()
        ctx.restore()

        ctx.save()
        ctx.translate(chromOff, chromOff * 0.45)
        ctx.strokeStyle = `rgba(0, 210, 255, ${chromStr * 0.62})`
        drawFigure()
        ctx.restore()
      }

      ctx.strokeStyle = `rgba(240,237,232,${1 - chromStr * 0.3})`
      drawFigure()

      rafId = requestAnimationFrame(draw)
    }

    initLayout()
    window.addEventListener('resize',     initLayout)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize',     initLayout)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} className="about section-animate">

      <canvas ref={canvasRef} className="about__grid" />

      <div className="about-bgword" aria-hidden="true">ABOUT</div>

      <div className="about-footnote">
        <span>FN.</span>
        <span>hi there</span>
      </div>

      <div className="about-grid">
        <div />
        <div />
        <div className="about-bio">
          <div className="about-bio__heading">&gt; BIO</div>
          <p>
            I&apos;m a 2nd-year Computer Engineering student at Thapar Institute,
            building full-stack apps and exploring machine learning. I like making
            things that feel as good as they look — from REST APIs to responsive UIs.
            When I&apos;m not coding, I&apos;m designing.
          </p>
          <div className="about-bio__heading">&gt; STACK</div>
          <div className="about-bio__pills">
            {TECH.map((t) => <span key={t} className="about-bio__pill">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="about__sheet-tag">
        <span className="about__sheet-dot" />&gt; 02 — ABOUT / G.J.
      </div>

    </section>
  )
})

export default About
