import { render, screen } from '@testing-library/react'
import App from '../src/App'

beforeEach(() => {
  const mockObserver = { observe: vi.fn(), disconnect: vi.fn() }
  vi.stubGlobal('IntersectionObserver', vi.fn(function () { return mockObserver }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('renders all major sections', () => {
  render(<App />)
  expect(screen.getAllByText(/GUNAGYE/i)[0]).toBeInTheDocument()
  expect(screen.getAllByText(/ABOUT/i)[0]).toBeInTheDocument()
  expect(screen.getAllByText(/SELECTED/i)[0]).toBeInTheDocument()
  expect(screen.getByText('FOUNDER MODE WINNER')).toBeInTheDocument()
  expect(screen.getAllByText(/LET'S/i)[0]).toBeInTheDocument()
})
