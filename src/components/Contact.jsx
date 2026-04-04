import { motion } from 'framer-motion'
import './Contact.css'

const links = [
  {
    label: 'gunagye.jain@gmail.com',
    href: 'mailto:gunagye.jain@gmail.com',
    primary: true,
  },
  {
    label: 'GITHUB ↗',
    href: 'https://github.com/GunagyeJain',
    primary: false,
  },
  {
    label: 'LINKEDIN ↗',
    href: 'https://www.linkedin.com/in/gunagye-jain-b12962269/',
    primary: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <p className="contact-ghost" aria-hidden="true">HI.</p>

      <motion.h2
        className="contact-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        LET&apos;S<br />
        <span className="accent">TALK.</span>
      </motion.h2>

      <p className="contact-sub">
        Open to internships, collaborations, and interesting problems.
      </p>

      <motion.div
        className="contact-links"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            className={`contact-link${link.primary ? ' contact-link-primary' : ''}`}
            variants={linkVariants}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
