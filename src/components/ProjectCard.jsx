import { useRef } from 'react'
import './ProjectCard.css'

export default function ProjectCard({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)'
    }
  }

  return (
    <article
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="project-card-ghost" aria-hidden="true">
        {project.id}
      </span>
      <span className="project-tag">{project.tag}</span>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>
      <div className="project-tech">
        {project.tech.map((t) => (
          <span key={t} className="tech-pill">{t}</span>
        ))}
      </div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link"
      >
        VIEW PROJECT ↗
      </a>
    </article>
  )
}
