import { render, screen } from '@testing-library/react'
import Projects from '../src/components/Projects'

test('renders section heading', () => {
  render(<Projects />)
  expect(screen.getByText(/SELECTED/i)).toBeInTheDocument()
  expect(screen.getByText(/WORK/i)).toBeInTheDocument()
})

test('renders all 3 project titles', () => {
  render(<Projects />)
  expect(screen.getByText('RoadReport')).toBeInTheDocument()
  expect(screen.getByText('Book Rental System')).toBeInTheDocument()
  expect(screen.getByText('Multilingual Research Insights')).toBeInTheDocument()
})
