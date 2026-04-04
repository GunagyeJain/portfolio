import { render } from '@testing-library/react'
import CustomCursor from '../src/components/CustomCursor'

test('renders cursor element', () => {
  const { container } = render(<CustomCursor />)
  const cursor = container.querySelector('.custom-cursor')
  expect(cursor).toBeInTheDocument()
})
