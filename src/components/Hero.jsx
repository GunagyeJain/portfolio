import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion'
import './Hero.css'

/* Letter-by-letter animated word */
const letterVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}
const wordVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

function AnimatedWord({ word, className }) {
  return (
    <motion.span
      className={className}
      variants={wordVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="hero-word-text">{word}</span>
      <span aria-hidden="true" className="hero-letters">
        {word.split('').map((ch, i) => (
          <motion.span key={i} variants={letterVariants} className="hero-letter">
            {ch}
          </motion.span>
        ))}
      </span>
    </motion.span>
  )
}

/* Count-up number */
function CountUp({ target, suffix }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const steps = 30
    const duration = 1200
    let step = 0
    const timer = setInterval(() => {
      step++
      setCount(Math.round((target / steps) * step))
      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} className="accent">
      {count}{suffix}
    </span>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nameX = useTransform(mouseX, [-1, 1], [-18, 18])
  const nameY = useTransform(mouseY, [-1, 1], [-10, 10])

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const { left, top, width, height } = heroRef.current.getBoundingClientRect()
    mouseX.set(((e.clientX - left) / width) * 2 - 1)
    mouseY.set(((e.clientY - top) / height) * 2 - 1)
  }

  return (
    <section id="hero" className="hero" ref={heroRef} onMouseMove={handleMouseMove}>
      <div className="hero-left-bar" aria-hidden="true" />
      <div className="hero-grid-line" style={{ top: 80 }} aria-hidden="true" />
      <div className="hero-grid-line" style={{ top: 200 }} aria-hidden="true" />
      <div className="hero-grid-line" style={{ top: 340 }} aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-index">&gt; 01 — HELLO WORLD</p>

        <motion.div className="hero-name" style={{ x: nameX, y: nameY }}>
          <AnimatedWord word="GUNAGYE" className="hero-name-line" />
          <br aria-hidden="true" />
          <AnimatedWord word="JAIN." className="hero-name-line hero-name-cyan" />
        </motion.div>

        <motion.div
          className="hero-title-box"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          FULL-STACK DEVELOPER
        </motion.div>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          CS Student · Thapar Institute<br />
          Building things with React, Python &amp; ML
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          <a href="#projects" className="cta-primary">VIEW PROJECTS ↓</a>
          <a href="/resume.pdf" download className="cta-secondary">DOWNLOAD CV ↗</a>
        </motion.div>
      </div>

      <div className="hero-right">
        <p className="hero-right-ghost" aria-hidden="true">GJ</p>
        <p className="hero-right-label">QUICK STATS</p>
        <div className="hero-stats">
          <div className="stat">
            <p className="stat-num"><CountUp target={3} suffix="" /></p>
            <p className="stat-label">PROJECTS SHIPPED</p>
          </div>
          <div className="stat">
            <p className="stat-num"><CountUp target={2} suffix="+" /></p>
            <p className="stat-label">YEARS CODING</p>
          </div>
          <div className="stat">
            <p className="stat-num"><CountUp target={5} suffix="+" /></p>
            <p className="stat-label">TECHNOLOGIES</p>
          </div>
        </div>
        <p className="hero-scroll-hint">↓ SCROLL TO EXPLORE</p>
      </div>
    </section>
  )
}
