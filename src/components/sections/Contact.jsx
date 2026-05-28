import { forwardRef, useRef, useImperativeHandle } from "react";

const LINKS = [
  {
    tag: "EMAIL",
    val: "gunagye.jain@gmail.com",
    href: "mailto:gunagye.jain@gmail.com",
  },
  {
    tag: "GITHUB",
    val: "github.com/gunagyejain",
    href: "https://github.com/GunagyeJain",
  },
  {
    tag: "LINKEDIN",
    val: "linkedin",
    href: "https://www.linkedin.com/in/gunagye-jain-b12962269/",
  },
];

const Contact = forwardRef(function Contact(_, ref) {
  const sectionRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get el() {
      return sectionRef.current;
    },
  }));

  return (
    <section ref={sectionRef} className="contact section-animate">
      <div className="contact__grid crosshatch-light" />

      <div className="contact__frame" />
      <span className="contact__fid contact__fid--tl" />
      <span className="contact__fid contact__fid--tr" />
      <span className="contact__fid contact__fid--bl" />
      <span className="contact__fid contact__fid--br" />

      <div className="contact-bgword" aria-hidden="true">
        CONTACT
      </div>

      <div className="contact-inner">
        <p className="contact-counter">05 / 05</p>

        <h2 className="contact-heading">
          LET&apos;S
          <br />
          BUILD.
        </h2>

        <p className="contact-sub">
          Open to internships, freelance projects,
          <br />
          and research collaborations.
        </p>

        <div className="contact-links">
          {LINKS.map(({ tag, val, href }) => (
            <a key={tag} href={href} className="contact-link" target="_blank" rel="noopener noreferrer">
              <span className="contact-link__tag">{tag}</span>
              <span className="contact-link__val">{val}</span>
              <span className="contact-link__arrow">→</span>
            </a>
          ))}
          <a href="/resume.pdf" download className="contact-link contact-link--resume">
            <span className="contact-link__tag">RESUME</span>
            <span className="contact-link__val">Download CV</span>
            <span className="contact-link__arrow">↓</span>
          </a>
        </div>
      </div>

      <div className="contact__sheet-tag">
        <span className="contact__sheet-dot" />
        &gt; 05 — CONTACT / REACH OUT
      </div>
    </section>
  );
});

export default Contact;
