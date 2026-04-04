import { render, screen } from '@testing-library/react'
import Hero from '../src/components/Hero'

test('renders name and title', () => {
  render(<Hero />)
  expect(screen.getByText(/GUNAGYE/i)).toBeInTheDocument()
  expect(screen.getByText(/JAIN/i)).toBeInTheDocument()
  expect(screen.getByText(/FULL-STACK DEVELOPER/i)).toBeInTheDocument()
})

test('renders CTA links', () => {
  render(<Hero />)
  expect(screen.getByText(/VIEW PROJECTS/i)).toBeInTheDocument()
  expect(screen.getByText(/DOWNLOAD CV/i)).toBeInTheDocument()
})

test('renders stat labels', () => {
  render(<Hero />)
  expect(screen.getByText(/PROJECTS SHIPPED/i)).toBeInTheDocument()
  expect(screen.getByText(/YEARS CODING/i)).toBeInTheDocument()
  expect(screen.getByText(/TECHNOLOGIES/i)).toBeInTheDocument()
})
