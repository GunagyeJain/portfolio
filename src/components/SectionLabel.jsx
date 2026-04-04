import './SectionLabel.css'

export default function SectionLabel({ label, number, sub }) {
  return (
    <div className="section-label">
      <span className="section-label-text">{label}</span>
      <span className="section-label-num">
        {number} <span className="section-label-sub">— {sub}</span>
      </span>
    </div>
  )
}
