import { motion } from 'framer-motion'
import './About.css'

const SKILLS = [
  { name: 'React.js', primary: true },
  { name: 'Python', primary: true },
  { name: 'JavaScript', primary: true },
  { name: 'HTML5 / CSS3', primary: false },
  { name: 'SQL', primary: false },
  { name: 'Flask', primary: false },
  { name: 'Supabase', primary: false },
  { name: 'C / C++', primary: false },
  { name: 'Git & GitHub', primary: false },
  { name: 'NumPy · Pandas', primary: false },
  { name: 'Scikit-learn', primary: false },
  { name: 'Photoshop', primary: false },
]

const chipContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-left">
        <motion.h2
          className="about-heading"
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          ABOUT<br />
          <span className="accent">ME.</span>
        </motion.h2>

        <p className="about-body">
          I&apos;m a 2nd-year Computer Engineering student at Thapar Institute,
          building full-stack apps and exploring machine learning. I like making
          things that feel as good as they look — from REST APIs to responsive UIs.
        </p>
        <p className="about-body" style={{ marginTop: '12px' }}>
          When I&apos;m not coding, I&apos;m designing — I served as Graphic Design
          Core Member at Saturnalia&apos;25, which shapes my eye for aesthetics
          in everything I build.
        </p>

        <div className="about-edu">
          <p className="about-edu-label">EDUCATION</p>
          <p className="about-edu-name">
            Thapar Institute of Engineering &amp; Technology
          </p>
          <p className="about-edu-detail">
            B.E. Computer Engineering · 2024–2028
          </p>
        </div>
      </div>

      <div className="about-right">
        <p className="about-skills-label">TECH STACK</p>
        <motion.div
          className="about-skills"
          variants={chipContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SKILLS.map((skill) => (
            <motion.span
              key={skill.name}
              className={`skill-chip${skill.primary ? ' skill-chip-primary' : ''}`}
              variants={chipVariants}
            >
              {skill.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
