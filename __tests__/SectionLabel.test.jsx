import { render, screen } from '@testing-library/react'
import SectionLabel from '../src/components/SectionLabel'

test('renders label text and section number', () => {
  render(<SectionLabel label="ABOUT" number="02" sub="WHO AM I" />)
  expect(screen.getByText('ABOUT')).toBeInTheDocument()
  expect(screen.getByText(/02/)).toBeInTheDocument()
  expect(screen.getByText(/WHO AM I/)).toBeInTheDocument()
})
