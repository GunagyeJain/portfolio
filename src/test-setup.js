import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag) => {
    const Component = React.forwardRef(function MotionComponent(
      { children, initial, animate, exit, whileInView, transition,
        viewport, variants, whileHover, style, ...rest },
      ref
    ) {
      return React.createElement(tag, { ref, style, ...rest }, children)
    })
    Component.displayName = `motion.${tag}`
    return Component
  }

  const tags = ['div', 'span', 'nav', 'section', 'h1', 'h2', 'p', 'a', 'ul', 'li']
  const motion = {}
  tags.forEach((tag) => { motion[tag] = createMotionComponent(tag) })

  return {
    motion,
    AnimatePresence: ({ children }) => children,
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
    useTransform: () => 0,
    useInView: () => true,
  }
})
