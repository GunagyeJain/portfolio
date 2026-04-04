import { render, screen } from '@testing-library/react'
import ProjectCard from '../src/components/ProjectCard'

const mockProject = {
  id: '01',
  tag: 'FULL-STACK',
  title: 'RoadReport',
  description: 'A road reporting platform.',
  tech: ['Flask', 'JavaScript'],
  link: 'https://github.com/example',
}

test('renders project title and tag', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText('RoadReport')).toBeInTheDocument()
  expect(screen.getByText('FULL-STACK')).toBeInTheDocument()
})

test('renders tech stack pills', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText('Flask')).toBeInTheDocument()
  expect(screen.getByText('JavaScript')).toBeInTheDocument()
})

test('renders view project link with correct href', () => {
  render(<ProjectCard project={mockProject} />)
  const link = screen.getByText(/VIEW PROJECT/i).closest('a')
  expect(link).toHaveAttribute('href', 'https://github.com/example')
})

test('renders ghost number', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText('01')).toBeInTheDocument()
})
