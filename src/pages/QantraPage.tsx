import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './QantraPage.css'

gsap.registerPlugin(ScrollTrigger)

const asset = (name: string) => import.meta.env.BASE_URL + 'projects/qantra/' + name + '.webp'

const voices = [
  {
    id: 'editorial',
    label: 'تحريري',
    en: 'Editorial',
    title: 'الكلمة هي البطل',
    copy: 'مساحات هادئة، عناوين عربية كبيرة، وإيقاع يترك للفكرة وقتها قبل أن يطلب من القوس أن يتكلم.',
  },
  {
    id: 'architectural',
    label: 'معماري',
    en: 'Architectural',
    title: 'القوس يبني الصفحة',
    copy: 'هنا يصبح القوس إطاراً ومحوراً وشبكة. لا يعمل كزخرفة، بل كمنطق يحدد النسب والحركة والفراغ.',
  },
  {
    id: 'cultural',
    label: 'ثقافي',
    en: 'Cultural Poster',
    title: 'صوت أعلى للفعاليات',
    copy: 'أحجام طباعية أكثر جرأة، Terracotta أوضح، وحركة أسرع مع بقاء القواعد البصرية نفسها.',
  },
] as const

type VoiceId = typeof voices[number]['id']

function ArchMotif({ className = '' }: { className?: string }) {
  return (
    <div className={'qantra-arch-motif ' + className} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

function ArchGrid() {
  return (
    <div className="qantra-pattern-grid" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => <span key={i} className="qantra-pattern-arch" />)}
    </div>
  )
}

export default function QantraPage() {
  const rootRef = useRef<HTMLElement>(null)
  const [voice, setVoice] = useState<VoiceId>('editorial')
  const currentVoice = voices.find((item) => item.id === voice) ?? voices[0]

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'QANTRA — Visual Identity System | Hamza Qady'

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !rootRef.current) {
      return () => { document.title = previousTitle }
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.qantra-hero-copy > *',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.09, ease: 'power3.out' },
      )

      gsap.fromTo(
        '.qantra-hero-portal',
        { scale: 0.9, yPercent: 8, opacity: 0 },
        { scale: 1, yPercent: 0, opacity: 1, duration: 1.35, ease: 'power3.out', delay: 0.12 },
      )

      gsap.to('.qantra-hero-portal', {
        scale: 1.14,
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.qantra-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      gsap.utils.toArray('.qantra-reveal').forEach((element: any) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 84%', once: true },
          },
        )
      })

      gsap.fromTo(
        '.qantra-architecture-sheet',
        { y: 70, rotate: 1.2 },
        {
          y: -16,
          rotate: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.qantra-architecture',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        },
      )

      gsap.fromTo(
        '.qantra-application-image',
        { scale: 0.975, opacity: 0.72 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.qantra-applications', start: 'top 72%', once: true },
        },
      )
    }, rootRef)

    return () => {
      ctx.revert()
      document.title = previousTitle
    }
  }, [])

  return (
    <main ref={rootRef} className="qantra-page" lang="ar" dir="rtl" id="qantra-top">
      <a className="qantra-skip" href="#qantra-story">انتقل إلى قصة المشروع</a>

      <header className="qantra-nav">
        <a className="qantra-back" href={import.meta.env.BASE_URL + '#work'} aria-label="العودة إلى المشاريع المختارة">
          <span aria-hidden="true">↗</span>
          <span>العودة للأعمال</span>
        </a>
        <div className="qantra-nav-title">
          <span>QANTRA</span>
          <small>CASE STUDY 02</small>
        </div>
      </header>

      <section className="qantra-hero" aria-labelledby="qantra-title">
        <div className="qantra-hero-portal" aria-hidden="true">
          <div className="qantra-portal-line qantra-portal-line-one" />
          <div className="qantra-portal-line qantra-portal-line-two" />
          <div className="qantra-portal-line qantra-portal-line-three" />
        </div>
        <div className="qantra-hero-grain" aria-hidden="true" />

        <div className="qantra-hero-topline">
          <span>مشروع تصوري مستقل · دمشق · 2026</span>
          <span>Visual Identity System / Art Direction</span>
        </div>

        <div className="qantra-hero-copy">
          <p className="qantra-kicker">مكتبة · مساحة قراءة · نادي ثقافي</p>
          <h1 id="qantra-title">قنطرة</h1>
          <p className="qantra-hero-line">بين كتابٍ وقارئ، <em>قنطرة.</em></p>
          <a className="qantra-scroll-link" href="#qantra-story">اكتشف الفكرة <span aria-hidden="true">↓</span></a>
        </div>

        <div className="qantra-hero-foot">
          <span>ARCHITECTURE × LITERATURE × WARMTH</span>
          <span>02 / SELECTED WORK</span>
