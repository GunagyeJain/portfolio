import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

const LINES = ['I BUILD THINGS', 'THAT FEEL AS', 'GOOD AS THEY LOOK']

const SPACING  = 40
const RADIUS   = 200
const STRENGTH = 28

const Statement = forwardRef(function Statement(_, ref) {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)

  useImperativeHandle(ref, () => ({
    get el() { return sectionRef.current },
  }))

  // Warp grid
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

    const onMove = (e) => {
      const r = section.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inBounds = x >= 0 && x <= r.width && y >= 0 && y <= r.height

      if (inBounds) {
        if (wasOut) { lerpX = x; lerpY = y; wasOut = false }
        mouseX = x; mouseY = y
      } else {
        if (!wasOut) { mouseX = OFF; mouseY = OFF; wasOut = true }
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
      lerpX += (mouseX - lerpX) * 0.06
      lerpY += (mouseY - lerpY) * 0.06

      const w    = canvas.width
      const h    = canvas.height
      const cols = Math.ceil(w / SPACING) + 2
      const rows = Math.ceil(h / SPACING) + 2

      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(240,237,232,0.04)'
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

      ctx.fillStyle = 'rgba(240,237,232,0.07)'
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

  return (
    <section ref={sectionRef} className="statement section-animate">
      <canvas ref={canvasRef} className="statement__grid" />

      <div className="statement__inner">

        <div className="statement__rule" />

        <div className="statement__body">
          <span className="statement__stat statement__stat--tl">
            [ 4 PROJECTS SHIPPED ]
          </span>
          <span className="statement__stat statement__stat--tr">
            [ 2024 → PRESENT ]
          </span>

          <div className="statement__display">
            {LINES.map((line, i) => (
              <p key={i} className="statement__line">{line}</p>
            ))}
          </div>
        </div>

        <div className="statement__rule" />

        <p className="statement__caption">
          CS Student · Thapar Institute · Full Stack &amp; ML
        </p>

      </div>
    </section>
  )
})

export default Statement
