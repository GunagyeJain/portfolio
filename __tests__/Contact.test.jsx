import { render, screen } from '@testing-library/react'
import Contact from '../src/components/Contact'

test("renders LET'S TALK heading", () => {
  render(<Contact />)
  expect(screen.getByText(/LET'S/i)).toBeInTheDocument()
  expect(screen.getByText(/TALK/i)).toBeInTheDocument()
})

test('renders email link', () => {
  render(<Contact />)
  const emailLink = screen.getByText(/gunagye\.jain@gmail\.com/i).closest('a')
  expect(emailLink).toHaveAttribute('href', 'mailto:gunagye.jain@gmail.com')
})

test('renders GitHub and LinkedIn links', () => {
  render(<Contact />)
  expect(screen.getByText(/GITHUB/i)).toBeInTheDocument()
  expect(screen.getByText(/LINKEDIN/i)).toBeInTheDocument()
})
