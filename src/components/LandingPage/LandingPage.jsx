import './LandingPage.css';

const FEATURES = [
  {
    icon: '👥',
    iconClass: 'feature-card__icon--purple',
    title: 'Multi-Face Detection',
    desc: 'Instantly detects when multiple faces appear in the frame and triggers real-time alerts.',
  },
  {
    icon: '👁️',
    iconClass: 'feature-card__icon--blue',
    title: 'Gaze & Attention Tracking',
    desc: 'Monitors head orientation to detect when the user looks away from the screen for extended periods.',
  },
  {
    icon: '⏱️',
    iconClass: 'feature-card__icon--orange',
    title: '5-Second Continuous Alert',
    desc: 'Triggers a violation only after 5 uninterrupted seconds of looking away — no false positives from brief glances.',
  },
  {
    icon: '⚡',
    iconClass: 'feature-card__icon--green',
    title: '100% Edge Inference',
    desc: 'All AI processing runs locally in your browser via WebAssembly + WebGL. Zero data sent to any server.',
  },
  {
    icon: '📋',
    iconClass: 'feature-card__icon--cyan',
    title: 'Session Event Logging',
    desc: 'Every state change is logged with timestamps — face events, gaze changes, alerts, and violations.',
  },
  {
    icon: '📊',
    iconClass: 'feature-card__icon--red',
    title: 'Live Session Metrics',
    desc: 'Real-time dashboard with violation counts, longest look-away streak, and session duration.',
  },
];

const STEPS = [
  { title: 'Start Session', desc: 'Click "Start Monitoring" to request camera access and initialize AI models.' },
  { title: 'AI Initializes', desc: 'MediaPipe FaceLandmarker loads (~5 MB) and begins processing video frames.' },
  { title: 'Live Monitoring', desc: 'Real-time face counting, gaze tracking, and alert detection at ~15 FPS.' },
  { title: 'Review Results', desc: 'View session summary with violation counts, event log, and metrics.' },
];

const TECH = [
  { icon: '⚛️', name: 'React 18', role: 'UI Framework' },
  { icon: '⚡', name: 'Vite', role: 'Build Tool' },
  { icon: '🧠', name: 'MediaPipe', role: 'AI / Vision' },
  { icon: '🌐', name: 'WebAssembly', role: 'Runtime' },
];

export default function LandingPage({ onNavigateToMonitor }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo">EP</div>
          <span className="landing-nav__name">Edge Proctor</span>
        </div>
        <div className="landing-nav__links">
          <button className="landing-nav__link" onClick={() => scrollToSection('features')}>Features</button>
          <button className="landing-nav__link" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
          <button className="landing-nav__link" onClick={() => scrollToSection('tech-stack')}>Tech Stack</button>
          <button className="hero__cta" style={{ padding: '10px 24px', fontSize: '0.85rem' }} onClick={onNavigateToMonitor}>
            Launch Monitor →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Browser-Based AI Proctoring
        </div>
        <h1 className="hero__title">
          Real-Time Exam<br />
          <span className="hero__title-gradient">Proctoring on the Edge</span>
        </h1>
        <p className="hero__subtitle">
          A production-grade proctoring prototype that runs entirely in your browser.
          Face detection, gaze tracking, and violation alerts — powered by MediaPipe,
          with zero server-side processing.
        </p>
        <div className="hero__actions">
          <button className="hero__cta" onClick={onNavigateToMonitor}>
            ▶ Start Monitoring
          </button>
          <button className="hero__cta-secondary" onClick={() => scrollToSection('features')}>
            Explore Features ↓
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-item__value">478</span>
          <span className="stat-item__label">Facial Landmarks</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__value">~15</span>
          <span className="stat-item__label">FPS Detection</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__value">0</span>
          <span className="stat-item__label">Server Calls</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__value">5s</span>
          <span className="stat-item__label">Alert Threshold</span>
        </div>
        <div className="stat-item">
          <span className="stat-item__value">100%</span>
          <span className="stat-item__label">Client-Side</span>
        </div>
      </div>

      {/* Features */}
      <section className="section" id="features">
        <div className="section__header">
          <div className="section__label">Features</div>
          <h2 className="section__title">Everything Runs in Your Browser</h2>
          <p className="section__subtitle">
            No backend, no API keys, no data leaks. Just open the app and start monitoring.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className={`feature-card__icon ${f.iconClass}`}>{f.icon}</div>
              <div className="feature-card__title">{f.title}</div>
              <div className="feature-card__desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works" style={{ background: 'var(--bg-secondary)', maxWidth: '100%', paddingLeft: 40, paddingRight: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section__header">
            <div className="section__label">How It Works</div>
            <h2 className="section__title">Four Steps to Live Monitoring</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-card__number">{i + 1}</div>
                <div className="step-card__title">{s.title}</div>
                <div className="step-card__desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" id="tech-stack">
        <div className="section__header">
          <div className="section__label">Tech Stack</div>
          <h2 className="section__title">Built With Modern Tools</h2>
          <p className="section__subtitle">
            Carefully chosen technologies optimized for real-time browser-based AI inference.
          </p>
        </div>
        <div className="tech-grid">
          {TECH.map((t, i) => (
            <div className="tech-card" key={i}>
              <span className="tech-card__icon">{t.icon}</span>
              <span className="tech-card__name">{t.name}</span>
              <span className="tech-card__role">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-section__glow" />
        <h2 className="cta-section__title">Ready to Try It?</h2>
        <p className="cta-section__desc">
          Launch the monitoring dashboard, allow camera access, and see real-time edge AI proctoring in action.
        </p>
        <button className="hero__cta" onClick={onNavigateToMonitor}>
          Launch Monitor →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>© 2025 Edge Proctor — Browser-Based AI Monitoring POC</span>
        <div className="landing-footer__links">
          <span className="landing-footer__link">React</span>
          <span className="landing-footer__link">Vite</span>
          <span className="landing-footer__link">MediaPipe</span>
        </div>
      </footer>
    </div>
  );
}
