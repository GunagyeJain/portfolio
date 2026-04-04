import { highlights } from '../data/highlights'
import './Highlights.css'

export default function Highlights() {
  return (
    <section id="highlights" className="highlights">
      {highlights.map((item) => (
        <div key={item.title} className="highlight-item">
          <span className="highlight-icon" role="img" aria-label={item.title}>
            {item.icon}
          </span>
          <h3 className="highlight-title">{item.title}</h3>
          <p className="highlight-sub">{item.line1}</p>
          <p className="highlight-sub accent">{item.line2}</p>
        </div>
      ))}
    </section>
  )
}
