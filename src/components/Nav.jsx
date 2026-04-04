import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Nav.css'

export default function Nav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="nav"
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          exit={{ y: -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="navigation"
          aria-label="Main navigation"
        >
          <a href="#hero" className="nav-logo">GJ.</a>
          <div className="nav-links">
            <a href="#about">ABOUT</a>
            <a href="#projects">PROJECTS</a>
            <a href="#highlights">HIGHLIGHTS</a>
            <a href="#contact" className="nav-contact">CONTACT ↗</a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
