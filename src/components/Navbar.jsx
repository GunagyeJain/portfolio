const SECTION_THEMES = {
  1: 'light',  // Hero
  2: 'dark',   // Statement
  3: 'light',  // Projects Deck
  4: 'about',  // About (dark + teal hamburger)
  5: 'light',  // Contact
}

export default function Navbar({ currentSection = 1, totalSections = 5 }) {
  const theme = SECTION_THEMES[currentSection] ?? 'light'
  const isDark = theme === 'dark' || theme === 'about'

  const navClass = [
    'navbar',
    isDark ? 'navbar--dark' : '',
    theme === 'about' ? 'navbar--about' : '',
  ].filter(Boolean).join(' ')

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <nav className={navClass}>
      <a href="#" className="navbar__logo">GJ.</a>
      <div className="navbar__right">
        <span className="navbar__counter">
          {pad(currentSection)} / {pad(totalSections)}
        </span>
        <button className="navbar__hamburger" aria-label="Menu">
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
