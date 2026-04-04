import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SectionLabel from './components/SectionLabel'
import About from './components/About'
import Projects from './components/Projects'
import Highlights from './components/Highlights'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <SectionLabel label="ABOUT" number="02" sub="WHO AM I" />
        <About />
        <SectionLabel label="PROJECTS" number="03" sub="WHAT I'VE BUILT" />
        <Projects />
        <SectionLabel label="BEYOND CODE" number="04" sub="HIGHLIGHTS" />
        <Highlights />
        <SectionLabel label="CONTACT" number="05" sub="LET'S TALK" />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
