import { useEffect, useState } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      className="custom-cursor"
      style={{
        transform: `translate(${pos.x - 6}px, ${pos.y - 6}px)`,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  )
}
