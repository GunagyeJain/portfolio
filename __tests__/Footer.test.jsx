import { render, screen } from '@testing-library/react'
import Footer from '../src/components/Footer'

test('renders copyright and name', () => {
  render(<Footer />)
  expect(screen.getByText(/GUNAGYE JAIN/i)).toBeInTheDocument()
  expect(screen.getByText(/2026/)).toBeInTheDocument()
})

test('renders built with text', () => {
  render(<Footer />)
  expect(screen.getByText(/REACT \+ VITE/i)).toBeInTheDocument()
})
