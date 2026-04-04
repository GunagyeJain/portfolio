import { projects } from '../src/data/projects'
import { highlights } from '../src/data/highlights'

test('projects has 3 entries with required fields', () => {
  expect(projects).toHaveLength(3)
  projects.forEach((p) => {
    expect(p).toHaveProperty('id')
    expect(p).toHaveProperty('tag')
    expect(p).toHaveProperty('title')
    expect(p).toHaveProperty('description')
    expect(p).toHaveProperty('tech')
    expect(p).toHaveProperty('link')
  })
})

test('highlights has 3 entries with required fields', () => {
  expect(highlights).toHaveLength(3)
  highlights.forEach((h) => {
    expect(h).toHaveProperty('icon')
    expect(h).toHaveProperty('title')
    expect(h).toHaveProperty('line1')
    expect(h).toHaveProperty('line2')
  })
})
