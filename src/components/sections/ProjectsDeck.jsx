import { forwardRef, useRef, useImperativeHandle } from 'react'
import ProjectCard from '../ProjectCard'

const PROJECTS = [
  {
    name: 'Multilingual Research',
    year: '2024',
    description:
      'Cross-lingual NLP model for low-resource language understanding and document classification across 12 languages.',
    tech: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI'],
    color: '#0F2A4A',
    link: '#',
  },
  {
    name: 'Book Rental System',
    year: '2024',
    description:
      'Full-stack library management and book lending platform built for institutional use with integrated payments.',
    tech: ['Django', 'PostgreSQL', 'Bootstrap', 'Stripe'],
    color: '#1A3D2B',
    link: '#',
  },
  {
    name: 'RoadReport',
    year: '2024',
    description:
      'Community-driven road hazard reporting system with live map integration and real-time hazard alerting.',
    tech: ['React', 'Node.js', 'MongoDB', 'Mapbox'],
    color: '#8B3A0F',
    link: '#',
  },
  {
    name: 'MockMate',
    year: '2025',
    description:
      'AI-powered mock interview platform with real-time voice feedback, adaptive questioning, and performance analytics.',
    tech: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL'],
    color: '#2D1B69',
    link: '#',
  },
]

const ProjectsDeck = forwardRef(function ProjectsDeck(_, ref) {
  const sectionRef = useRef(null)
  const cardRefs   = useRef([])
  const sceneRef   = useRef(null)
  const bgRef      = useRef(null)

  useImperativeHandle(ref, () => ({
    get el()    { return sectionRef.current },
    get cards() { return cardRefs.current   },
    get scene() { return sceneRef.current   },
    get bg()    { return bgRef.current      },
  }))

  return (
    <section ref={sectionRef} className="projects-deck">
      <div ref={bgRef} className="projects-deck__bg crosshatch-light" />

      <div ref={sceneRef} className="projects-deck__scene">
        <div className="projects-deck__header">
          <span className="projects-deck__counter">03 / 05</span>
          <h2 className="projects-deck__title">PROJECTS</h2>
          <p className="projects-deck__sub">SCROLL TO EXPLORE</p>
        </div>

        <div className="projects-deck__stack">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.name}
              ref={(el) => { cardRefs.current[i] = el }}
              project={project}
              index={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
})

export default ProjectsDeck
