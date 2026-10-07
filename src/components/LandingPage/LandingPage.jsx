import Logo from '../Logo/Logo';
import './LandingPage.css';

// Crisp, Apple-style SVG icons for features
const Icons = {
  Users: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Eye: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Timer: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M12 2v2" />
    </svg>
  ),
  Cpu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  BarChart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const FEATURES = [
  {
    icon: <Icons.Users />,
    tag: 'Edge Neural Vision',
    badgeClass: 'badge--blue',
    title: 'Sub-Second Multi-Person & Absence Detection',
    desc: 'Instantly identifies unauthorized secondary individuals in frame or candidate absence. AI tethers directly to hardware frames, preventing collusion without sending video across the wire.',
    highlight: 'Instant Visual & Sound Flagging',
    span2: true,
  },
  {
    icon: <Icons.Eye />,
    tag: 'Spatial Geometry',
    badgeClass: 'badge--purple',
    title: '3D Gaze & Attention Pose Vectoring',
    desc: 'Analyzes pitch, yaw, and iris coordinates across 478 high-precision facial landmarks to track whether candidate focus drifts away from the exam perimeter.',
    highlight: '3-Axis Angular Tracking',
  },
  {
    icon: <Icons.Timer />,
    tag: 'Temporal Integrity',
    badgeClass: 'badge--amber',
    title: '5.0-Second Continuous Temporal Window',
    desc: 'Eliminates false alarms triggered by normal blinks or quick muscle adjustments. Violations only record after a sustained 5 uninterrupted seconds of looking away.',
    highlight: 'Anti-Spam Filter Logic',
  },
  {
    icon: <Icons.Cpu />,
    tag: 'Zero Cloud Footprint',
    badgeClass: 'badge--emerald',
    title: '100% On-Device WebAssembly Inference',
    desc: 'All computer vision calculations execute directly on candidate hardware via WebGL shaders and WebAssembly. Zero biometric imagery or video streams ever touch external servers.',
    highlight: 'Strict Privacy Compliance',
  },
  {
    icon: <Icons.ShieldCheck />,
    tag: 'Forensic Audit',
    badgeClass: 'badge--cyan',
    title: 'Cryptographic Audit Trail & Event Ledger',
    desc: 'Every face count transition, gaze deviation, and alert severity is logged with microsecond precision, compiling an irrefutable session report for academic examiners.',
    highlight: 'Exportable Integrity Log',
  },
  {
    icon: <Icons.BarChart />,
    tag: 'Live Telemetry',
    badgeClass: 'badge--rose',
    title: 'Real-Time Proctor Analytics & Heatmap',
    desc: 'Instant operational dashboard providing duration timers, violation tallies, longest look-away streaks, and dynamic visual tracking overlays for examiners.',
    highlight: 'Continuous System Health',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Hardware Handshake',
    desc: 'Authorize camera access through native browser permissions with zero external plugins or kernel drivers required.',
  },
  {
    number: '02',
    title: 'Model Compilation',
    desc: 'MediaPipe Vision pipeline instantiates in browser memory (~5 MB) with WebAssembly and WebGL GPU acceleration.',
  },
  {
    number: '03',
    title: 'Autonomous Monitoring',
    desc: 'Continuous ~15 FPS facial mesh evaluation tracks presence, multi-person events, and spatial head yaw/pitch angles.',
  },
  {
    number: '04',
    title: 'Forensic Synthesis',
    desc: 'Review comprehensive metrics, active incident timestamps, and exportable session logs for institutional compliance.',
  },
];

const TECH = [
  { icon: '⚛️', name: 'React 18', role: 'Component State & Concurrent UI' },
  { icon: '⚡', name: 'Vite 6', role: 'Modern ESM Tooling & Instant HMR' },
  { icon: '🧠', name: 'MediaPipe', role: '478-Landmark Neural Face Mesh' },
  { icon: '🌐', name: 'WebAssembly', role: 'Hardware-Accelerated Client Runtime' },
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
          <Logo size={36} />
          <div className="landing-nav__name-wrapper">
            <span className="landing-nav__name">ExamGuard</span>
            <span className="landing-nav__version">v2.4 Core</span>
          </div>
        </div>
        <div className="landing-nav__links">
          <button className="landing-nav__link" onClick={() => scrollToSection('features')}>
            Features
          </button>
          <button className="landing-nav__link" onClick={() => scrollToSection('how-it-works')}>
            Architecture
          </button>
          <button className="landing-nav__link" onClick={() => scrollToSection('tech-stack')}>
            Technology
          </button>
          <button className="btn btn--primary landing-nav__cta" onClick={onNavigateToMonitor}>
            Start Monitoring →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__glow" />

        <div className="hero__badge">
          <span className="hero__badge-dot" />
          <span>On-Device AI Vision • 100% Private</span>
        </div>

        <h1 className="hero__title">
          Real-Time Assessment<br />
          <span className="hero__title-gradient">Integrity Monitoring</span>
        </h1>

        <p className="hero__subtitle">
          ExamGuard analyzes webcam input in real time to identify multiple faces, face absence,
          and significant gaze or head-position changes. AI inference runs locally in the browser
          without transmitting video to a remote server.
        </p>

        <div className="hero__actions">
          <button className="btn btn--primary hero__cta-primary" onClick={onNavigateToMonitor}>
            Launch Exam Console →
          </button>
          <button className="btn btn--ghost hero__cta-secondary" onClick={() => scrollToSection('features')}>
            Explore Features ↓
          </button>
        </div>

        {/* Apple-style trust pills */}
        <div className="hero__trust-strip">
          <div className="trust-pill">
            <span className="trust-pill__check"><Icons.Check /></span>
            <span>Zero Server Video Streaming</span>
          </div>
          <div className="trust-pill">
            <span className="trust-pill__check"><Icons.Check /></span>
            <span>478-Point Facial Landmark Mesh</span>
          </div>
          <div className="trust-pill">
            <span className="trust-pill__check"><Icons.Check /></span>
            <span>Sub-Millisecond On-Device Latency</span>
          </div>
          <div className="trust-pill">
            <span className="trust-pill__check"><Icons.Check /></span>
            <span>Temporal False-Positive Shield</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-item__value">478</span>
            <span className="stat-item__label">Facial Landmarks</span>
            <span className="stat-item__subtext">High-density 3D spatial mesh</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">~15</span>
            <span className="stat-item__label">FPS Inference</span>
            <span className="stat-item__subtext">Hardware-accelerated runtime</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">0 ms</span>
            <span className="stat-item__label">Cloud Latency</span>
            <span className="stat-item__subtext">100% on-device processing</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">5.0s</span>
            <span className="stat-item__label">Sustained Filter</span>
            <span className="stat-item__subtext">Eliminates natural glance errors</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value">100%</span>
            <span className="stat-item__label">Privacy Preserved</span>
            <span className="stat-item__subtext">Biometrics never leave client</span>
          </div>
        </div>
      </section>

      {/* Features Section — Apple-inspired Bento Grid */}
      <section className="section" id="features">
        <div className="section__header">
          <div className="section__label">Platform Capabilities</div>
          <h2 className="section__title">Precision Vision Architecture</h2>
          <p className="section__subtitle">
            Engineered with deep neural vision models that process every pixel locally.
            Reliable, privacy-preserving, and tamper-resistant exam monitoring.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, i) => (
            <div
              className={`feature-card ${feature.span2 ? 'feature-card--span2' : ''}`}
              key={i}
            >
              <div className="feature-card__top">
                <div className={`feature-card__icon ${feature.badgeClass}`}>
                  {feature.icon}
                </div>
                <span className={`feature-card__tag ${feature.badgeClass}`}>
                  {feature.tag}
                </span>
              </div>

              <div className="feature-card__content">
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
              </div>

              <div className="feature-card__footer">
                <span className="feature-card__highlight">
                  <span className="feature-card__pulse" />
                  {feature.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section section--tinted" id="how-it-works">
        <div className="section-inner">
          <div className="section__header">
            <div className="section__label">Workflow Architecture</div>
            <h2 className="section__title">From Launch to Live Telemetry</h2>
            <p className="section__subtitle">
              A streamlined, high-performance pipeline that activates without configuration or backend dependencies.
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-card__header">
                  <span className="step-card__number">{step.number}</span>
                  <div className="step-card__line" />
                </div>
                <h4 className="step-card__title">{step.title}</h4>
                <p className="step-card__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" id="tech-stack">
        <div className="section__header">
          <div className="section__label">Foundation</div>
          <h2 className="section__title">Built with Cutting-Edge Standards</h2>
          <p className="section__subtitle">
            Carefully curated technologies optimized for ultra-low latency, real-time client inference, and clean ergonomics.
          </p>
        </div>

        <div className="tech-grid">
          {TECH.map((t, i) => (
            <div className="tech-card" key={i}>
              <div className="tech-card__icon-wrapper">{t.icon}</div>
              <div className="tech-card__name">{t.name}</div>
              <div className="tech-card__role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-card__badge">Zero Infrastructure Needed</div>
          <h2 className="cta-card__title">Ready to see it in action?</h2>
          <p className="cta-card__desc">
            Launch the live monitor, grant camera permission, and experience real-time AI face and gaze tracking directly in your browser.
          </p>
          <button className="btn btn--primary cta-card__button" onClick={onNavigateToMonitor}>
            Launch Exam Console →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__left">
          <div className="landing-footer__brand">
            <Logo size={26} />
            <span className="landing-footer__name">ExamGuard</span>
          </div>
          <p className="landing-footer__copy">
            © 2026 ExamGuard Technologies. All rights reserved. On-device exam integrity platform.
          </p>
        </div>
        <div className="landing-footer__links">
          <span className="landing-footer__link">React 18</span>
          <span className="landing-footer__link">MediaPipe Vision</span>
          <span className="landing-footer__link">WebAssembly</span>
          <span className="landing-footer__link">Client Privacy</span>
        </div>
      </footer>
    </div>
  );
}
