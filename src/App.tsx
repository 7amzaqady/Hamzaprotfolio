import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import GooeyNav from './components/GooeyNav'
import CurtainReveal from './components/CurtainReveal'
import BorderGlow from './components/BorderGlow'
import IntroLoader from './components/IntroLoader'
import './homepage.css'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
const HERO_VIDEO = asset('astronauts-alien-garden-hero-1080p.mp4')
const HERO_POSTER = asset('hero-poster.webp')
const JELLYFISH_VIDEO = 'https://motionbgs.com/dl/hd/597'

const Galaxy = lazy(() => import('./components/Galaxy'))
const FluidText = lazy(() => import('./components/FluidText'))
const SpecularButton = lazy(() => import('./components/SpecularButton'))
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
  const enabled = useDesktopEffects()
  const [ready, setReady] = useState(false)
  const [fontSize, setFontSize] = useState(128)
  useEffect(() => {
    const measure = () => setFontSize(Math.min(144, Math.max(64, Math.round(window.innerWidth * (window.innerWidth < 768 ? .19 : .097)))))
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])
  return <div className={`hero-name${enabled && ready ? ' hero-name-ready' : ''}`} style={{ fontSize, height: Math.round(fontSize * 1.62) }}>
    <h1>HAMZA<br />QADY</h1>
    {enabled && <div className="hero-name-fluid" aria-hidden="true"><EffectBoundary><Suspense fallback={null}>
      <FluidText text={'HAMZA\nQADY'} color="#E1E0CC" paletteColors={['#FFF9E8', '#F0D9A8', '#C98C4B']}
        splatRadius={16} splatForce={22} curl={70} densityDissipation={2.1} onReady={setReady}
        font={{ fontFamily: 'Almarai', fontWeight: 500, fontSize, lineHeight: '.78em', letterSpacing: '-.065em', textAlign: 'left' }} />
    </Suspense></EffectBoundary></div>}
  </div>
}

function PortfolioGalaxy() {
  const enabled = useDesktopEffects()
  return <div className="portfolio-backdrop" aria-hidden="true">
    {enabled && <div className="portfolio-galaxy"><EffectBoundary><Suspense fallback={null}>
      <Galaxy focal={[.5, .5]} rotation={[1, 0]} starSpeed={.34} density={.9} hueShift={28} speed={.55}
        mouseInteraction glowIntensity={.24} saturation={.42} mouseRepulsion repulsionStrength={2.6}
        twinkleIntensity={.24} rotationSpeed={.025} autoCenterRepulsion={0} transparent />
    </Suspense></EffectBoundary></div>}
  </div>
}

function GlobalHeader() {
  const motionAllowed = useMotionAllowed()
  const [active, setActive] = useState('')
  const items = [{ label: 'Work', href: '#work' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }]
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('#home, #work, #about, #contact')]
    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * .3
      const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= readingLine)
      setActive(current ? '#' + current.id : '')
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
  return <header className="portfolio-header">
    <a className="portfolio-monogram" href="#home" aria-label="Hamza Qady, back to top">HQ<span>.</span></a>
    <div className="gooey-nav-shell"><GooeyNav items={items} activeItemIndex={items.findIndex(item => item.href === active)}
      motionAllowed={motionAllowed} initialActiveIndex={0} particleCount={15} particleDistances={[90, 10]}
      particleR={100} animationTime={600} timeVariance={300} colors={[1, 2, 3, 1, 2, 3, 1, 4]} /></div>
  </header>
}

function RotatingRole() {
  const motionAllowed = useMotionAllowed()
  const [index, setIndex] = useState(0)
  const roles = ['Brand Designer', 'Frontend Developer']
  useEffect(() => {
    if (!motionAllowed) return
    const timer = window.setInterval(() => { if (!document.hidden) setIndex(value => (value + 1) % 2) }, 2200)
    return () => window.clearInterval(timer)
  }, [motionAllowed])
  return <div className="hero-role" aria-label="Visual Identity Designer and Frontend Developer">
    <span className="role-dot" aria-hidden="true" /><span className="role-label">I work as</span>
    <span className="rotating-role" aria-hidden="true"><AnimatePresence mode="wait" initial={false}>
      <motion.span key={roles[index]} initial={motionAllowed ? { y: 18, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }} exit={motionAllowed ? { y: -18, opacity: 0 } : undefined}
        transition={{ duration: .45, ease: [.16, 1, .3, 1] }}>{roles[index]}</motion.span>
    </AnimatePresence></span>
  </div>
}

/* The heading stays semantic while its original curtain reveal runs in view. */
function AboutMaskLine({ text, serif = false, delay = 0 }: { text: string; serif?: boolean; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const motionAllowed = useMotionAllowed()
  return <span ref={ref} className="about-mask-line">
    {motionAllowed && inView ? <CurtainReveal text={text} color="#E1E0CC" tag="span" direction="bottom-to-top"
      transition={{ type: 'tween', duration: .9, delay, ease: [.16, 1, .3, 1] }}
      font={{ fontFamily: serif ? 'Instrument Serif' : 'Almarai', fontStyle: serif ? 'italic' : 'normal',
        fontSize: 'inherit', fontWeight: 400, lineHeight: '1.1em', letterSpacing: '-.035em', textAlign: 'left' }} /> : text}
  </span>
}

function ContactButton() {
  const enabled = useDesktopEffects()
  const fallback = <a className="portfolio-button" href="mailto:7amzaqady@gmail.com">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
  return <Suspense fallback={fallback}><SpecularButton href="mailto:7amzaqady@gmail.com" effectsEnabled={enabled}
    size="md" radius={999} tint="#DEDBC8" tintOpacity={.08} blur={10} textColor="#DEDBC8"
    lineColor="#FFF7DF" baseColor="#6B6250" intensity={1.25} shineSize={11} shineFade={42}
    thickness={1.15} speed={.28} followMouse proximity={260} autoAnimate={false} className="contact-specular-cta">
    <span className="inline-flex items-center gap-3">Start a conversation <ArrowRight size={16} aria-hidden="true" /></span>
  </SpecularButton></Suspense>
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
          <RotatingRole />
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
  { id: 'blooms', title: 'Blooms Book Store', type: 'Brand identity', role: 'Visual identity & art direction', image: 'projects/blooms/logo-reverse.webp', alt: 'Blooms cream logo with a dusty rose flower', background: '#103A2C' },
  { id: 'qantra', title: 'قنطرة', type: 'Visual identity system', role: 'QANTRA / Visual Identity System', image: 'projects/qantra/logo.webp', alt: 'Qantra logo', background: '#0E2A47' },
  { id: 'chromasnap', title: 'ChromaSnap', type: 'Digital product', role: 'Product design / Frontend development', image: '', alt: '', background: '#F4F1E8' },
]

function ChromaCover() {
  return <>
    <div className="chroma-cover-heading"><span>03 / DIGITAL PRODUCT</span><ArrowUpRight size={20} aria-hidden="true" /></div>
    <div className="chroma-cover-copy">
      <div className="chroma-brand" aria-hidden="true"><span className="chroma-dot-orange" /><span className="chroma-dot-purple" /><span>CHROMA<br />SNAP</span></div>
      <p>Find the colors<br />in any image.</p>
    </div>
    <div className="chroma-palette" aria-hidden="true">{['#1B2821', '#C5A477', '#E8DED1', '#70594D', '#A69A87'].map(color =>
      <span key={color} style={{ backgroundColor: color }} />)}</div>
  </>
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <a href={`?project=${project.id}`} className={`project-card project-card-${project.id}`}>
    <div className="project-cover" style={{ backgroundColor: project.background }}>
      {project.id === 'chromasnap' ? <ChromaCover /> : <>
        <img src={asset(project.image)} alt={project.alt} loading="lazy" decoding="async" />
        <span className="project-open" aria-hidden="true"><ArrowUpRight size={23} /></span>
      </>}
    </div>
    <div className="project-summary">
      <div className="project-caption"><span>{String(index + 1).padStart(2, '0')} / {project.type}</span><span>2026</span></div>
      <h3>{project.title}</h3><p>{project.role}</p>
      <span className="project-link">Explore the project <ArrowRight size={18} aria-hidden="true" /></span>
    </div>
  </a>
}

function UpcomingProject() {
  const motionAllowed = useMotionAllowed()
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let visible = false
    const sync = () => { if (visible && !document.hidden) video.play().catch(() => undefined); else video.pause() }
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync() })
    observer.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause() }
  }, [motionAllowed, failed])
  return <BorderGlow className="upcoming-glow" edgeSensitivity={26} glowColor="8 88 58" backgroundColor="#151513"
    borderRadius={16} glowRadius={30} glowIntensity={.9} coneSpread={24} animated={motionAllowed}
    colors={['#ff4d3a', '#d0a96e', '#dedbc8']} fillOpacity={.2}>
    <article className="project-card project-upcoming" aria-label="Fourth project, coming soon">
    <div className="project-cover upcoming-cover" aria-hidden="true">
      {motionAllowed && !failed && <video ref={videoRef} src={JELLYFISH_VIDEO} loop muted playsInline preload="none" onError={() => setFailed(true)} />}
      <span className="upcoming-number">04</span><span className="upcoming-note">A NEW CHAPTER</span>
    </div>
    <div className="project-summary"><div className="project-caption"><span>04 / Next project</span><span>Coming soon</span></div>
      <h3>Something new is taking shape.</h3><p>A new project will join this collection soon.</p>
      <span className="upcoming-status"><span />Coming soon</span>
    </div>
    </article>
  </BorderGlow>
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
      <div><h2 id="about-title"><AboutMaskLine text="A visual designer" /><em><AboutMaskLine text="who codes." serif delay={.12} /></em></h2>
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
              <ContactButton />
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
  const motionAllowed = useMotionAllowed()
  const [loading, setLoading] = useState(() => !project && !window.location.hash && motionAllowed)
  const finishIntro = useCallback(() => setLoading(false), [])
  useEffect(() => {
    document.documentElement.classList.toggle('motion-disabled', !motionAllowed)
    return () => document.documentElement.classList.remove('motion-disabled')
  }, [motionAllowed])
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
    {loading && motionAllowed && <IntroLoader onDone={finishIntro} />}
    <a className="portfolio-skip" href="#work">Skip to selected work</a>
    <PortfolioGalaxy />
    <GlobalHeader />
    <main className="portfolio-main"><Hero /><Work /><About /></main>
    <div className="portfolio-contact"><Contact /></div>
  </>
}
