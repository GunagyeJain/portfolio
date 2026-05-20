import { forwardRef, useRef, useImperativeHandle } from 'react'

const TECH = [
  'React.js', 'Next.js', 'Python', 'JavaScript',
  'HTML/CSS', 'SQL', 'Flask', 'Supabase', 'Git', 'Photoshop',
]

function SchematicPortrait() {
  return (
    <svg
      className="about-schematic"
      viewBox="0 0 320 420"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#F0EDE8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Reference grid */}
      <g stroke="#F0EDE8" strokeWidth="0.4" opacity="0.12">
        <line x1="40"  y1="60"  x2="280" y2="60"  />
        <line x1="40"  y1="120" x2="280" y2="120" />
        <line x1="40"  y1="180" x2="280" y2="180" />
        <line x1="40"  y1="240" x2="280" y2="240" />
        <line x1="40"  y1="300" x2="280" y2="300" />
        <line x1="40"  y1="360" x2="280" y2="360" />
        <line x1="80"  y1="40"  x2="80"  y2="380" />
        <line x1="160" y1="40"  x2="160" y2="380" />
        <line x1="240" y1="40"  x2="240" y2="380" />
      </g>

      {/* Centerline */}
      <line x1="160" y1="30" x2="160" y2="395"
            stroke="#F0EDE8" strokeWidth="0.6"
            strokeDasharray="2 4" opacity="0.45" />

      {/* Head + neck + shoulders silhouette */}
      <path
        d="M 160 50 C 108 50, 82 88, 82 138 C 82 180, 96 215, 124 232 L 124 256 C 96 268, 70 286, 50 320 L 32 376 L 288 376 L 270 320 C 250 286, 224 268, 196 256 L 196 232 C 224 215, 238 180, 238 138 C 238 88, 212 50, 160 50 Z"
        strokeWidth="1.6"
      />

      {/* Topographic contour lines */}
      <g strokeWidth="0.9" opacity="0.55">
        <ellipse cx="160" cy="78"  rx="56" ry="7" />
        <ellipse cx="160" cy="98"  rx="68" ry="6" />
        <ellipse cx="160" cy="120" rx="74" ry="5" />
        <ellipse cx="160" cy="144" rx="76" ry="5" />
        <ellipse cx="160" cy="170" rx="72" ry="5" />
        <ellipse cx="160" cy="196" rx="58" ry="5" />
        <ellipse cx="160" cy="220" rx="42" ry="4" />
      </g>

      {/* Brow / jaw markers */}
      <line x1="118" y1="140" x2="146" y2="140" strokeWidth="1.4" opacity="0.85" />
      <line x1="174" y1="140" x2="202" y2="140" strokeWidth="1.4" opacity="0.85" />
      <line x1="148" y1="186" x2="172" y2="186" strokeWidth="1.2" opacity="0.7"  />

      {/* Shoulder line */}
      <line x1="48" y1="320" x2="272" y2="320"
            strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />

      {/* Callout A — forehead */}
      <g opacity="0.8">
        <circle cx="36" cy="80" r="11" strokeWidth="0.9" />
        <line x1="47" y1="82" x2="98" y2="100" strokeWidth="0.7" />
      </g>
      <text x="36" y="84" fill="#F0EDE8" fontFamily="Space Mono, monospace"
            fontSize="11" textAnchor="middle">A</text>

      {/* Callout B — jaw / chin */}
      <g opacity="0.8">
        <circle cx="284" cy="232" r="11" strokeWidth="0.9" />
        <line x1="273" y1="232" x2="206" y2="248" strokeWidth="0.7" />
      </g>
      <text x="284" y="236" fill="#F0EDE8" fontFamily="Space Mono, monospace"
            fontSize="11" textAnchor="middle">B</text>

      {/* Callout C — shoulder */}
      <g opacity="0.8">
        <circle cx="36" cy="324" r="11" strokeWidth="0.9" />
        <line x1="47" y1="324" x2="74" y2="320" strokeWidth="0.7" />
      </g>
      <text x="36" y="328" fill="#F0EDE8" fontFamily="Space Mono, monospace"
            fontSize="11" textAnchor="middle">C</text>

      {/* Dimension annotation — right edge */}
      <g opacity="0.5">
        <line x1="304" y1="50"  x2="304" y2="376" strokeWidth="0.6" />
        <line x1="300" y1="50"  x2="308" y2="50"  strokeWidth="0.6" />
        <line x1="300" y1="376" x2="308" y2="376" strokeWidth="0.6" />
      </g>
      <text x="312" y="216" fill="#F0EDE8" fontFamily="Space Mono, monospace"
            fontSize="9" letterSpacing="2" opacity="0.7">SUBJECT</text>
    </svg>
  )
}

const About = forwardRef(function About(_, ref) {
  const sectionRef = useRef(null)

  useImperativeHandle(ref, () => ({
    get el() { return sectionRef.current },
  }))

  return (
    <section ref={sectionRef} className="about">

      {/* Drafting frame + corner fiducials */}
      <div className="about__frame" />
      <span className="about__fid about__fid--tl" />
      <span className="about__fid about__fid--tr" />
      <span className="about__fid about__fid--bl" />
      <span className="about__fid about__fid--br" />

      {/* Background watermark */}
      <div className="about-bgword" aria-hidden="true">ABOUT</div>

      {/* Main 3-column grid: spacer | figure | bio */}
      <div className="about-grid">
        <div />

        <div className="about-figure">
          <div className="about-footnote">
            <span>FN.</span>
            <span>yes i googled that</span>
          </div>
          <SchematicPortrait />
        </div>

        <div className="about-bio">
          <div className="about-bio__heading">&gt; BIO</div>
          <p>
            I&apos;m a 2nd-year Computer Engineering student at Thapar Institute,
            building full-stack apps and exploring machine learning. I like making
            things that feel as good as they look — from REST APIs to responsive UIs.
            When I&apos;m not coding, I&apos;m designing.
          </p>
          <div className="about-bio__heading">&gt; STACK</div>
          <div className="about-bio__pills">
            {TECH.map((t) => (
              <span key={t} className="about-bio__pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Engineering callout annotation */}
      <div className="about__callout" style={{ top: '12%', right: 80 }}>
        <span className="about__callout-leader" />
        <span className="about__callout-bub">A</span>
        <span>OUTLINED BACKDROP — STROKE 2PX</span>
      </div>

      {/* Sheet tag — bottom left */}
      <div className="about__sheet-tag">
        <span className="about__sheet-dot" />&gt; 04 — ABOUT / SUBJECT
      </div>

      {/* Title block — bottom right */}
      <div className="about__title-block">
        <div className="about__tb-row">
          <div className="about__tb-cell about__tb-cell--wide about__tb-cell--big">
            <div className="about__tb-k">Drawing</div>
            <div className="about__tb-v">About / Subject</div>
          </div>
        </div>
        <div className="about__tb-row">
          <div className="about__tb-cell">
            <div className="about__tb-k">Fig.</div>
            <div className="about__tb-v">04</div>
          </div>
          <div className="about__tb-cell">
            <div className="about__tb-k">Scale</div>
            <div className="about__tb-v">1 : 1</div>
          </div>
        </div>
        <div className="about__tb-row">
          <div className="about__tb-cell">
            <div className="about__tb-k">Sheet</div>
            <div className="about__tb-v">04 / 05</div>
          </div>
          <div className="about__tb-cell">
            <div className="about__tb-k">Drawn</div>
            <div className="about__tb-v">G.J.</div>
          </div>
        </div>
      </div>

    </section>
  )
})

export default About
