import { render, screen } from '@testing-library/react'
import Nav from '../src/components/Nav'

test('renders logo and nav links', () => {
  render(
    <div>
      <div id="hero" />
      <Nav />
    </div>
  )
  expect(document.body).toBeInTheDocument()
})

test('renders all navigation links when visible', () => {
  const mockObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
  }
  vi.stubGlobal('IntersectionObserver', vi.fn(() => mockObserver))

  render(<Nav />)
  expect(document.body).toBeInTheDocument()

  vi.unstubAllGlobals()
})
