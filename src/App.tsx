import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import './homepage.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const HERO_VIDEO = asset('astronauts-alien-garden-hero-1080p.mp4')
const HERO_POSTER = asset('hero-poster.webp')

const Galaxy = lazy(() => import('./components/Galaxy'))
const BloomsPage = lazy(() => import('./pages/BloomsPage'))
const QantraPage = lazy(() => import('./pages/QantraPage'))
const ChromaSnapPage = lazy(() => import('./pages/ChromaSnapPage'))

// Decoration must never take the portfolio content down with it.
class EffectBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

function useMotionAllowed() {
  const [allowed, setAllowed] = useState(() =>
    new URLSearchParams(window.location.search).get('motion') !== '0' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setAllowed(!preference.matches && new URLSearchParams(window.location.search).get('motion') !== '0')
    preference.addEventListener('change', update)
    update()
    return () => preference.removeEventListener('change', update)
  }, [])
  return allowed
}

let webglAvailable: boolean | undefined
function supportsWebGL() {
  if (webglAvailable !== undefined) return webglAvailable
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    webglAvailable = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch { webglAvailable = false }
  return webglAvailable
}

function useDesktopEffects() {
  const motionAllowed = useMotionAllowed()
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const update = () => setEnabled(motionAllowed && desktop.matches && supportsWebGL())
    // Give the readable hero a head start before loading decorative bundles.
    const timer = window.setTimeout(update, 500)
    desktop.addEventListener('change', update)
    if (!motionAllowed) setEnabled(false)
    return () => { window.clearTimeout(timer); desktop.removeEventListener('change', update) }
  }, [motionAllowed])
  return enabled
}

function HeroName() {
  const motionAllowed = useMotionAllowed()
  const [fontSize, setFontSize] = useState(128)
  useEffect(() => {
    const measure = () => setFontSize(Math.min(144, Math.max(64, Math.round(window.innerWidth * (window.innerWidth < 768 ? .19 : .097)))))
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])
  return <div className="hero-name" style={{ fontSize, height: Math.round(fontSize * 1.68) }}
    onPointerMove={event => {
      if (!motionAllowed || event.pointerType !== 'mouse') return
      const rect = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
      event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
    }}>
    <span className="hero-name-glow" aria-hidden="true" />
    <h1>HAMZA<br />QADY</h1>
  </div>
}

function PortfolioGalaxy() {
  const enabled = useDesktopEffects()
  return <div className="portfolio-backdrop" aria-hidden="true">
    {enabled && <div className="portfolio-galaxy"><EffectBoundary><Suspense fallback={null}>
      <Galaxy starSpeed={.15} density={.7} hueShift={28} speed={.3} mouseInteraction glowIntensity={.15}
        saturation={.25} mouseRepulsion repulsionStrength={1.1} twinkleIntensity={.15} rotationSpeed={.012} transparent />
    </Suspense></EffectBoundary></div>}
  </div>
}

function GlobalHeader() {
  const [active, setActive] = useState('')
  const items = [{ label: 'Work', href: '#work' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }]
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const current = entries.find(entry => entry.isIntersecting)
      if (current) setActive('#' + current.target.id)
    }, { rootMargin: '-15% 0px -50% 0px' })
    document.querySelectorAll('#home, #work, #about, #contact').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return <header className="portfolio-header">
    <a className="portfolio-monogram" href="#home" aria-label="Hamza Qady, back to top">HQ<span>.</span></a>
    <nav aria-label="Primary navigation">{items.map(item =>
      <a key={item.href} href={item.href} aria-current={active === item.href ? 'location' : undefined}>{item.label}</a>
    )}</nav>
  </header>
}

function HeroBackgroundVideo() {
  const motionAllowed = useMotionAllowed()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const update = () => {
      if (motionAllowed && !document.hidden) video.play().catch(() => undefined)
      else video.pause()
    }
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [motionAllowed, failed])
  return <>
    <img className="hero-media" src={HERO_POSTER} alt="" aria-hidden="true" width="1600" height="900" fetchPriority="high" />
    {motionAllowed && !failed && <video ref={videoRef} className="hero-media" src={HERO_VIDEO} poster={HERO_POSTER}
      autoPlay loop muted playsInline preload="metadata" aria-hidden="true" onError={() => setFailed(true)} />}
  </>
}

function Hero() {
  return <section id="home" className="portfolio-hero" aria-label="Introduction">
    <div className="hero-frame">
      <HeroBackgroundVideo />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content">
        <div><p className="hero-label">HAMZA QADY / DESIGN & DEVELOPMENT</p><HeroName />
          <p className="hero-role">Visual Identity Designer <span>&</span> Frontend Developer</p>
        </div>
        <div className="hero-intro">
          <p>I design distinctive brand identities and build expressive websites for independent businesses.</p>
          <div className="hero-actions">
            <a className="portfolio-button" href="#work">View selected work <ArrowRight size={18} aria-hidden="true" /></a>
            <a className="portfolio-text-link" href="#contact">Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </div>
  </section>
}

type Project = {
  id: string
  title: string
  type: string
  role: string
  image: string
  alt: string
  background: string
}

// Add the fourth project here once its assets and case study are ready.
const projects: Project[] = [
  { id: 'blooms', title: 'Blooms Book Store', type: 'Brand identity', role: 'Visual identity & art direction', image: 'projects/blooms/packaging-cream.webp', alt: 'Blooms packaging and stationery in cream and dusty rose', background: '#D8C6B0' },
  { id: 'qantra', title: 'قنطرة / Qantra', type: 'Visual identity system', role: 'Visual system, patterns & applications', image: 'projects/qantra/hero.webp', alt: 'Qantra architectural arch in deep navy and warm stone', background: '#0E2A47' },
  { id: 'chromasnap', title: 'ChromaSnap', type: 'Digital product', role: 'Product design & frontend development', image: 'projects/chromasnap-preview.webp', alt: 'Actual ChromaSnap interface with image upload workspace', background: '#F4F1E8' },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <a href={`?project=${project.id}`} className={`project-card project-card-${project.id}`}>
    <div className="project-cover" style={{ backgroundColor: project.background }}>
      <img src={asset(project.image)} alt={project.alt} loading="lazy" decoding="async" width="1360" height="936" />
      <span className="project-open" aria-hidden="true"><ArrowUpRight size={23} /></span>
    </div>
    <div className="project-summary">
      <div className="project-caption"><span>{String(index + 1).padStart(2, '0')} / {project.type}</span><span>2026</span></div>
      <h3>{project.title}</h3><p>{project.role}</p>
      <span className="project-link">Explore the project <ArrowRight size={18} aria-hidden="true" /></span>
    </div>
  </a>
}

function UpcomingProject() {
  return <article className="project-card project-upcoming" aria-label="Fourth project, coming soon">
    <div className="project-cover upcoming-cover" aria-hidden="true"><span className="upcoming-number">04</span><span className="upcoming-note">A NEW CHAPTER</span></div>
    <div className="project-summary"><div className="project-caption"><span>04 / Next project</span><span>Coming soon</span></div>
      <h3>Something new is taking shape.</h3><p>A new project will join this collection soon.</p>
      <span className="upcoming-status"><span />Coming soon</span>
    </div>
  </article>
}

function Work() {
  const motionAllowed = useMotionAllowed()
  return <section id="work" className="portfolio-work" aria-labelledby="work-title">
    <div className="portfolio-container">
      <div className="work-heading"><div><p className="section-label">Selected work</p><h2 id="work-title">Ideas made tangible.</h2></div>
        <p>Visual identities and digital experiences.<br />Explore the thinking behind each project.</p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => <motion.div key={project.id} initial={false}
          whileInView={motionAllowed ? { opacity: [0.85, 1], y: [12, 0] } : undefined}
          viewport={{ once: true, amount: .15 }} transition={{ duration: .45, ease: [.16, 1, .3, 1] }}>
          <ProjectCard project={project} index={index} />
        </motion.div>)}
        {projects.length < 4 && <UpcomingProject />}
      </div>
    </div>
  </section>
}

function About() {
  return <section id="about" className="portfolio-about" aria-labelledby="about-title">
    <div className="portfolio-container about-layout"><p className="section-label">About me</p>
      <div><h2 id="about-title">A visual designer<br /><em>who codes.</em></h2>
        <p>I’m Hamza Qady. I create visual identities and websites that help independent businesses look credible, feel distinctive, and give people a clear next step.</p>
        <div className="about-disciplines"><span>Visual identity</span><span>Art direction</span><span>Frontend development</span></div>
      </div>
    </div>
  </section>
}

function Contact() {
  return (
    <footer id="contact" className="bg-transparent px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
      <div className="contact-space-panel rounded-[28px] px-6 py-16 sm:px-10 md:px-14 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/55 sm:text-xs">Get in touch</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <h2 className="contact-space-mask m-0 text-5xl font-extrabold leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl">
                LET&apos;S BUILD SOMETHING MEMORABLE.
              </h2>
            </div>
            <div className="lg:col-span-3">
              <a className="portfolio-button" href="mailto:7amzaqady@gmail.com">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="mt-16 grid gap-6 border-t border-primary/20 pt-6 sm:grid-cols-2 lg:mt-24">
            <a className="group flex flex-col gap-2" href="mailto:7amzaqady@gmail.com" aria-label="Email Hamza at 7amzaqady@gmail.com">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary/45">Email</span>
              <span className="break-all text-lg font-medium text-primary transition-colors group-hover:text-[#E8C59B] sm:text-xl">7amzaqady@gmail.com <span aria-hidden="true">↗</span></span>
            </a>
            <a className="group flex flex-col gap-2" href="https://wa.me/963993720719" aria-label="Chat with Hamza on WhatsApp at +963 993 720 719">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary/45">WhatsApp</span>
              <span className="text-lg font-medium text-primary transition-colors group-hover:text-[#E8C59B] sm:text-xl" dir="ltr">+963 993 720 719 <span aria-hidden="true">↗</span></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const project = new URLSearchParams(window.location.search).get('project')
  useEffect(() => {
    if (project) return
    const target = window.location.hash.slice(1)
    if (!target) return
    const frame = window.requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'instant' }))
    return () => window.cancelAnimationFrame(frame)
  }, [project])
  if (project === 'blooms') return <Suspense fallback={<main className="case-loading">Loading Blooms…</main>}><BloomsPage /></Suspense>
  if (project === 'qantra') return <Suspense fallback={<main className="case-loading">Loading QANTRA…</main>}><QantraPage /></Suspense>
  if (project === 'chromasnap') return <Suspense fallback={<main className="case-loading">Loading ChromaSnap…</main>}><ChromaSnapPage /></Suspense>
  return <>
    <a className="portfolio-skip" href="#work">Skip to selected work</a>
    <PortfolioGalaxy />
    <GlobalHeader />
    <main className="portfolio-main"><Hero /><Work /><About /></main>
    <div className="portfolio-contact"><Contact /></div>
  </>
}
