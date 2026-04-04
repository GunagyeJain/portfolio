import { render, screen } from '@testing-library/react'
import Highlights from '../src/components/Highlights'

test('renders all 3 highlight titles', () => {
  render(<Highlights />)
  expect(screen.getByText('FOUNDER MODE WINNER')).toBeInTheDocument()
  expect(screen.getByText('GRAPHIC DESIGN CORE')).toBeInTheDocument()
  expect(screen.getByText('DELHI → PATIALA')).toBeInTheDocument()
})

test('renders highlight subtitles', () => {
  render(<Highlights />)
  expect(screen.getByText('November 2025')).toBeInTheDocument()
  expect(screen.getByText("Saturnalia'25")).toBeInTheDocument()
  expect(screen.getByText('Home in Delhi')).toBeInTheDocument()
})
