import { render, screen } from '@testing-library/react'
import About from '../src/components/About'

test('renders about heading', () => {
  render(<About />)
  expect(screen.getByText(/ABOUT/i)).toBeInTheDocument()
})

test('renders bio text', () => {
  render(<About />)
  expect(screen.getByText(/Thapar Institute/i)).toBeInTheDocument()
})

test('renders key skills', () => {
  render(<About />)
  expect(screen.getByText('React.js')).toBeInTheDocument()
  expect(screen.getByText('Python')).toBeInTheDocument()
  expect(screen.getByText('JavaScript')).toBeInTheDocument()
})

test('renders education without CGPA', () => {
  render(<About />)
  expect(screen.getByText(/2024–2028/)).toBeInTheDocument()
  expect(screen.queryByText(/8\.81/)).not.toBeInTheDocument()
})
