import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={`${styles.container} ${styles.navContainer}`}>
          <div className={styles.logo}>Ashish<span className={styles.logospan}>.</span></div>
          <ul className={styles.navLinks}>
            <li><a href="#about" className={styles.navLink}>About</a></li>
            <li><a href="#experience" className={styles.navLink}>Experience</a></li>
            <li><a href="#skills" className={styles.navLink}>Skills</a></li>
            <li><a href="#gallery" className={styles.navLink}>Gallery</a></li>
            <li><a href="#contact" className={styles.navLink}>Contact</a></li>
          </ul>
        </div>
      </nav>

      <main className={styles.container}>
        {/* HERO SECTION */}
        <section id="about" className={styles.hero}>
          <p className={`${styles.greeting} animate-fade-in`}>Hi, my name is</p>
          <h1 className={`${styles.title} animate-fade-in delay-1`}>Ashish Khanal.</h1>
          <h2 className={`${styles.subtitle} animate-fade-in delay-2`}>Senior Software Engineer & Solution Lead.</h2>
          <p className={`${styles.description} animate-fade-in delay-3`}>
            I'm a results-driven engineer with over 5 years of experience architecting and delivering enterprise Salesforce products used globally. I specialize in Apex, Lightning Web Components, RESTful API integrations, and cloud-native system design.
          </p>
          <div className={`${styles.ctaGroup} animate-fade-in delay-3`}>
            <a href="#experience" className={styles.primaryBtn}>View Experience</a>
            <a href="#contact" className={styles.secondaryBtn}>Get In Touch</a>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className={styles.section}>
          <h2 className={styles.sectionTitle}>Where I've Worked</h2>
          <div className={styles.experienceGrid}>

            <div className={styles.experienceCard}>
              <div className={styles.experienceHeader}>
                <div>
                  <h3 className={styles.role}>Senior Software Engineer | Solution Lead</h3>
                  <span className={styles.company}>ComplianceQuest-Nepal</span>
                </div>
                <div className={styles.duration}>Jan 2020 — 2026</div>
              </div>
              <ul className={styles.experienceList}>
                <li>Architected multiple high-impact enterprise product features across Salesforce serving a global B2B customer base.</li>
                <li>Led sprint planning, task estimation, and cross-team dependency management in an Agile/Scrum environment.</li>
                <li>Designed and implemented RESTful API integrations between Salesforce and third-party systems.</li>
                <li>Reduced sprint cycle time by 20–30% by streamlining developer coordination and tasks.</li>
                <li>Built internal tooling that automated manual release comparison processes, saving multiple hours per release cycle.</li>
              </ul>
            </div>

            <div className={styles.experienceCard}>
              <div className={styles.experienceHeader}>
                <div>
                  <h3 className={styles.role}>Software Engineering Intern</h3>
                  <span className={styles.company}>Ambarkaar Software Pvt. Ltd.</span>
                </div>
                <div className={styles.duration}>Jun 2019 — Aug 2019</div>
              </div>
              <ul className={styles.experienceList}>
                <li>Designed and developed an internal PDF diff generator comparing software release versions, streamlining documentation workflows.</li>
                <li>Built a functional Scratch Org creator prototype using Node.js and JavaScript to automate Salesforce org setup.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionTitle}>Technical Expertise</h2>
          <div className={styles.projectsGrid}>

            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.folderIcon}>☁️</div>
              </div>
              <h3 className={styles.projectTitle}>Salesforce Stack</h3>
              <p className={styles.projectDescription}>
                Deep expertise in the core Salesforce ecosystem, from frontend LWC to backend APEX workflows.
              </p>
              <ul className={styles.techList}>
                <li>LWC</li>
                <li>Apex Triggers</li>
                <li>Flows</li>
                <li>SOQL</li>
                <li>Salesforce DX</li>
              </ul>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.folderIcon}>💻</div>
              </div>
              <h3 className={styles.projectTitle}>Languages & Frameworks</h3>
              <p className={styles.projectDescription}>
                A robust foundation in versatile programming semantics and web standard technologies.
              </p>
              <ul className={styles.techList}>
                <li>Apex</li>
                <li>Java</li>
                <li>JavaScript</li>
                <li>React</li>
                <li>HTML5/CSS</li>
              </ul>
            </div>

            <div className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <div className={styles.folderIcon}>🏗️</div>
              </div>
              <h3 className={styles.projectTitle}>Architecture & Integration</h3>
              <p className={styles.projectDescription}>
                Skilled in designing scalable SaaS systems and driving high-availability API inter-connections.
              </p>
              <ul className={styles.techList}>
                <li>RESTful APIs</li>
                <li>Event-Driven</li>
                <li>MVC Pattern</li>
                <li>CI/CD</li>
                <li>JSON/XML</li>
              </ul>
            </div>

          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Photography & Life</h2>
            <a href="https://www.instagram.com/a.s.h.i.s.h_k.h.a.n.a.l/" target="_blank" rel="noreferrer" className={styles.primaryBtn} style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              View on Instagram
            </a>
          </div>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryItem}>
              <img src="/gallery/1.webp" alt="Instagram Photo 1" className={styles.galleryImage} />
            </div>
            <div className={styles.galleryItem}>
              <img src="/gallery/2.jpeg" alt="Instagram Photo 2" className={styles.galleryImage} />
            </div>
            <div className={styles.galleryItem}>
              <img src="/gallery/3.jpg" alt="Instagram Photo 3" className={styles.galleryImage} />
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className={`${styles.section} ${styles.contactSection}`}>
          <h2 className={styles.sectionTitle} style={{ justifyContent: 'center' }}>Get In Touch</h2>
          <p>
            Whether you have a question, want to collaborate, or just want to chat about architecture, my inbox is always open.
          </p>
          <a href="mailto:brkhanal17@gmail.com" className={styles.primaryBtn}>Say Hello</a>
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <a href="https://linkedin.com/in/aacesh" target="_blank" rel="noreferrer" className={styles.secondaryBtn}>LinkedIn Profile</a>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>+977 9860196101</span>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>

        <p>Copyright © 2026. All rights reserved.</p>
      </footer>
    </>
  );
}
