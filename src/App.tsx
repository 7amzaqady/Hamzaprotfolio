import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { animate, scrambleText } from 'animejs'
import RibbonGlow from './components/RibbonGlow'
import FluidText from './components/FluidText'
import GlitchCharReveal from './components/GlitchCharReveal'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'
const FEATURE_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

const ease = [0.16, 1, 0.3, 1] as const

function WordsPullUp({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden pr-[0.28em]">
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: reduced ? 0 : i * 0.055, ease }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}



function useFluidTitleSize() {
  const [fontSize, setFontSize] = useState(128)

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      const ratio = w >= 1280 ? 0.097 : w >= 1024 ? 0.105 : w >= 768 ? 0.135 : w >= 640 ? 0.16 : 0.18
      setFontSize(Math.max(58, Math.round(w * ratio)))
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  return fontSize
}

function FluidName() {
  const reduced = useReducedMotion()
  const fontSize = useFluidTitleSize()

  if (reduced) {
    return (
      <h1 className="text-[18vw] font-medium leading-[0.78] tracking-[-0.065em] text-[#E1E0CC] sm:text-[16vw] md:text-[13.5vw] lg:text-[10.5vw] xl:text-[9.7vw]">
        HAMZA
        <br />
        QADY<span className="align-top text-[0.3em]">*</span>
      </h1>
    )
  }

  return (
    <div
      role="heading"
      aria-level={1}
      aria-label="HAMZA QADY"
      className="relative w-full max-w-[980px]"
      style={{ height: Math.round(fontSize * 1.62) }}
    >
      <FluidText
        text={'HAMZA\nQADY*'}
        color="#E1E0CC"
        paletteColors={['#E1E0CC', '#D8C7A5', '#A98E68']}
        splatRadius={5}
        splatForce={7}
        curl={34}
        densityDissipation={5}
        font={{
          fontFamily: 'Almarai',
          fontWeight: 500,
          fontSize,
          lineHeight: '0.78em',
          letterSpacing: '-0.065em',
          textAlign: 'left',
        }}
      />
    </div>
  )
}

function AboutGlitchLine({ text, serif = false }: { text: string; serif?: boolean }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <span>{text}</span>
  }

  return (
    <GlitchCharReveal
      words={text}
      color="#E1E0CC"
      font={{
        fontFamily: serif ? 'Instrument Serif' : 'Almarai',
        fontStyle: serif ? 'italic' : 'normal',
        fontWeight: serif ? 400 : 400,
        fontSize: 'inherit',
        lineHeight: '0.96em',
        letterSpacing: '-0.03em',
        textAlign: 'center',
      }}
      enterAnimation={{
        mode: 'oneLine',
        restState: 'solid',
        replay: false,
        position: 'above',
        scrambleIntensity: 68,
        ease: { type: 'tween', duration: 1.25, ease: [0.16, 1, 0.3, 1] },
        flickerEnabled: false,
      }}
      hoverAnimation={{
        type: 'diffusion',
        lines: 'oneLine',
        radius: 2,
        collapse: true,
        collapseTime: 0.45,
        glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        glitchShuffle: true,
        flickerEnabled: false,
      }}
      tag="div"
    />
  )
}

function AnimeScrambleBody({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduced) return
    const animation = animate(el, {
      innerHTML: scrambleText({
        text,
        chars: 'uppercase',
        override: '_',
        revealRate: 42,
        settleRate: 26,
        settleDuration: 420,
        perturbation: 0.35,
        seed: 42,
      }),
    })
    return () => { animation.cancel() }
  }, [inView, reduced, text])

  return <span ref={ref}>{text}</span>
}

function PortfolioRibbon() {
  const reduced = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="ribbon-glow-fallback absolute inset-0" />
      {!reduced && (
        <RibbonGlow
          background="#090909"
          color1="#171812"
          color2="#3A3025"
          speed={34}
          size={108}
          angle={-165}
          hover={78}
          reach={320}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
          }}
        />
      )}
    </div>
  )
}

function RotatingRole() {
  const roles = ['Visual Designer', 'Brand Designer', 'Frontend Developer', 'Creative Coder']
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 1800)
    return () => window.clearInterval(timer)
  }, [reduced])

  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] sm:text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="text-primary/55">I work as</span>
      <span className="relative inline-flex min-w-[180px] overflow-hidden text-primary sm:min-w-[220px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={roles[index]}
            initial={reduced ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -16, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="inline-block"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="min-h-[100dvh] bg-transparent p-3 sm:p-4 md:p-6">
      <div className="relative min-h-[calc(100dvh-24px)] overflow-hidden rounded-[22px] bg-[#16130f] sm:min-h-[calc(100dvh-32px)] md:min-h-[calc(100dvh-48px)] md:rounded-[34px]">
        <video className="absolute inset-0 h-full w-full object-cover" src={HERO_VIDEO} autoPlay loop muted playsInline />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.48] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_35%,rgba(233,190,128,0.10),transparent_30%)]" />

        <nav className="absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-b-[22px] bg-[#090909] px-4 py-2.5 sm:px-7 md:px-10">
          <div className="flex items-center gap-3 text-[9px] text-[rgba(225,224,204,.76)] sm:gap-6 sm:text-[10px] md:gap-10 md:text-xs">
            {['About', 'Work', 'Expertise', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition-colors hover:text-[#E1E0CC] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7 md:p-10 lg:p-12">
          <div className="grid items-end gap-7 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-primary/60 sm:text-xs">Hamza Qady — Selected Portfolio</p>
              <FluidName />
              <div className="mt-6"><RotatingRole /></div>
            </div>

            <div className="flex flex-col items-start gap-5 pb-1 lg:col-span-4 lg:pl-8">
              <p className="max-w-md text-xs leading-[1.45] text-primary/70 sm:text-sm md:text-base">
                Visual identity, creative direction and frontend experiments built with a cinematic eye and an obsession with detail.
              </p>
              <a href="#work" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-bold text-[#090909] transition-transform active:scale-[.97]">
                View selected work
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#090909] text-primary transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:scale-105">
                  <ArrowRight size={16} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  const body = 'I build identities and digital experiences that feel crafted, tactile and memorable — balancing visual storytelling with clean systems and practical code.'

  return (
    <section id="about" className="bg-transparent px-3 py-8 sm:px-4 md:px-6 md:py-12">
      <div className="mx-auto max-w-[1400px] rounded-[28px] bg-[#11110f]/95 px-6 py-20 text-center backdrop-blur-[2px] sm:px-10 md:px-16 md:py-28 lg:px-24 lg:py-36">
        <p className="mb-8 text-[10px] uppercase tracking-[0.32em] text-primary/60 sm:text-xs">About / 01</p>
        <div className="mx-auto max-w-5xl text-3xl leading-[0.96] text-[#E1E0CC] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          <div className="scramble-line"><AboutGlitchLine text="I am Hamza Qady," /></div>
          <div className="scramble-line mt-1 font-serif italic"><AboutGlitchLine text="a visual designer who codes." serif /></div>
          <div className="scramble-line mt-1"><AboutGlitchLine text="I shape brands, interfaces and expressive digital experiences." /></div>
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-sm leading-7 text-primary/80 sm:text-base md:mt-16 md:text-lg">
          <AnimeScrambleBody text={body} />
        </p>
      </div>
    </section>
  )
}

const projects = [
  { title: 'Blooms Book Store', type: 'Brand identity / Art direction', meta: '01' },
  { title: 'Qantara', type: 'Visual system / Pattern language', meta: '02' },
  { title: 'Digital Experiments', type: 'Frontend / Motion / Creative coding', meta: '03' },
]

function Work() {
  return (
    <section id="work" className="relative overflow-hidden bg-transparent px-3 py-24 sm:px-4 md:px-6 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.32em] text-primary/50 sm:text-xs">Selected work / 02</p>
            <h2 className="max-w-3xl text-3xl leading-[1.02] text-[#E1E0CC] sm:text-4xl md:text-5xl lg:text-6xl">Projects built to feel like worlds, not templates.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-primary/55">Brand systems, editorial direction and digital prototypes with a strong visual point of view.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:h-[520px]">
          <motion.article whileHover={{ scale: 0.992 }} transition={{ duration: 0.35, ease }} className="group relative min-h-[380px] overflow-hidden rounded-[24px] md:min-h-[420px] lg:min-h-0 lg:col-span-1">
            <video className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" src={FEATURE_VIDEO} autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-sm text-[#E1E0CC]">Creative canvas.</p>
              <p className="mt-1 text-xs text-primary/50">Motion study / Portfolio mood</p>
            </div>
          </motion.article>

          {projects.map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const bullets = index === 0
    ? ['Identity system', 'Packaging direction', 'Editorial brand language']
    : index === 1
      ? ['Symbol-led system', 'Architectural patterns', 'Print applications']
      : ['React interfaces', 'Motion studies', 'Interactive prototypes']

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease }}
      className="flex min-h-[380px] flex-col justify-between rounded-[24px] bg-[#20201d] p-6 md:min-h-[420px] lg:min-h-0"
    >
      <div>
        <div className="mb-10 flex items-start justify-between">
          <span className="text-5xl font-light tracking-[-0.06em] text-primary/20">{project.meta}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#151513] text-primary"><ArrowDownRight size={17} /></span>
        </div>
        <h3 className="text-xl text-[#E1E0CC] sm:text-2xl">{project.title}</h3>
        <p className="mt-2 text-sm text-primary/45">{project.type}</p>
      </div>
      <div className="space-y-3">
        {bullets.map((bullet) => (
          <div key={bullet} className="flex items-center gap-2 text-xs text-primary/60 sm:text-sm">
            <Check size={14} className="text-primary" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </motion.article>
  )
}

function Expertise() {
  const items = ['Brand Identity', 'Art Direction', 'Packaging Design', 'Frontend Development', 'Motion Design']
  return (
    <section id="expertise" className="bg-transparent px-3 py-24 sm:px-4 md:px-6 md:py-32">
      <div className="mx-auto max-w-[1400px] border-y border-white/10">
        {items.map((item, i) => (
          <motion.div key={item} whileHover={{ x: 10 }} transition={{ duration: 0.28, ease }} className="group flex min-h-24 items-center justify-between border-b border-white/10 px-1 last:border-b-0 sm:min-h-28 md:min-h-32">
            <div className="flex items-center gap-4 sm:gap-8">
              <span className="text-[10px] text-primary/35 sm:text-xs">0{i + 1}</span>
              <h3 className="text-2xl tracking-[-0.03em] text-[#E1E0CC] transition-colors group-hover:text-primary sm:text-3xl md:text-4xl lg:text-5xl">{item}</h3>
            </div>
            <ArrowRight size={20} className="text-primary/35 transition-transform duration-300 group-hover:-rotate-45 group-hover:text-primary" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact" className="bg-transparent px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
      <div className="rounded-[28px] bg-primary px-6 py-16 text-[#090909] sm:px-10 md:px-14 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 sm:text-xs">Contact / 03</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h2 className="text-5xl leading-[0.88] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:col-span-9 lg:text-8xl xl:text-9xl">LET'S BUILD SOMETHING MEMORABLE.</h2>
            <div className="lg:col-span-3">
              <a href="mailto:hello@hamzaqady.com" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#090909] px-5 text-sm font-bold text-primary transition-transform active:scale-[.97]">Start a conversation <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <main className="relative overflow-x-clip bg-[#090909]">
      <PortfolioRibbon />
      <div className="relative z-10">
      <Hero />
      <About />
      <Work />
      <Expertise />
      <Contact />
      </div>
    </main>
  )
}
