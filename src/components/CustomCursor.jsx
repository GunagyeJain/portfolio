import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ringRef.current?.classList.add('cursor-ring--expanded')
      }
    }

    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ringRef.current?.classList.remove('cursor-ring--expanded')
      }
    }

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`
        dotRef.current.style.top = `${mouseY}px`
      }
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`
        ringRef.current.style.top = `${ringY}px`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
