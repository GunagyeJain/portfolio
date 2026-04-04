import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'
import './Projects.css'

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <motion.h2
        className="projects-heading"
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        SELECTED<br />
        <span className="accent">WORK.</span>
      </motion.h2>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <p className="projects-hint">HOVER CARDS FOR 3D EFFECT →</p>
    </section>
  )
}
