import { forwardRef } from 'react'

const ProjectCard = forwardRef(function ProjectCard({ project, index }, ref) {
  const num = String(index).padStart(2, '0')

  return (
    <article
      ref={ref}
      className="project-card"
      style={{ '--card-color': project.color }}
    >
      <div className="project-card__grid" />
      <div className="project-card__watermark">{num}</div>

      <div className="project-card__corner project-card__corner--tl" />
      <div className="project-card__corner project-card__corner--tr" />
      <div className="project-card__corner project-card__corner--bl" />
      <div className="project-card__corner project-card__corner--br" />

      <div className="project-card__inner">
        <header className="project-card__header">
          <h3 className="project-card__name">{project.name}</h3>
          <span className="project-card__index">[ {num} / 04 ] — {project.year}</span>
        </header>

        <div className="project-card__rule" />

        <p className="project-card__desc">{project.description}</p>

        <footer className="project-card__footer">
          <div className="project-card__tech">
            {project.tech.map((t) => (
              <span key={t} className="project-card__tag">{t}</span>
            ))}
          </div>

          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="project-card__link"
            data-hover
          >
            VIEW PROJECT →
          </a>
        </footer>
      </div>
    </article>
  )
})

export default ProjectCard
