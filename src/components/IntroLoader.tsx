import { useEffect, useState } from 'react'
import './IntroLoader.css'

const words = ['VISUAL DESIGN', 'CREATIVE CODE', 'ART DIRECTION', 'DIGITAL EXPERIENCES']

function waitForMedia(element: HTMLImageElement | HTMLVideoElement) {
  if (element instanceof HTMLImageElement && element.complete) return Promise.resolve()
  if (element instanceof HTMLVideoElement && element.readyState >= 2) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const finish = () => {
      element.removeEventListener('load', finish)
      element.removeEventListener('loadeddata', finish)
      element.removeEventListener('error', finish)
      resolve()
    }
    element.addEventListener('load', finish, { once: true })
    element.addEventListener('loadeddata', finish, { once: true })
    element.addEventListener('error', finish, { once: true })
  })
}

function preloadImage(source: string) {
  const image = new Image()
  image.src = source
  return waitForMedia(image)
}

export default function IntroLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setWordIndex((index) => (index + 1) % words.length), 800)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    let active = true
    let finished = false
    let completed = 0
    const started = performance.now()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const images = [...document.querySelectorAll<HTMLImageElement>('main img')]
    const videos = [...document.querySelectorAll<HTMLVideoElement>('main video')]
    const tasks = [
      ...images.map((image) => preloadImage(image.currentSrc || image.src)),
      ...videos.map(waitForMedia),
      document.fonts.ready,
      import('./Galaxy'),
    ]
    const total = tasks.length
    const finish = () => {
      if (!active || finished) return
      finished = true
      setProgress(100)
      window.setTimeout(() => { if (active) onDone() }, 320)
    }
    const timeout = window.setTimeout(finish, 8000)

    tasks.forEach((task) => {
      Promise.resolve(task).catch(() => undefined).finally(() => {
        if (!active || finished) return
        completed += 1
        setProgress(Math.round((completed / total) * 100))
        if (completed === total) {
          window.clearTimeout(timeout)
          window.setTimeout(finish, Math.max(0, 1000 - (performance.now() - started)))
        }
      })
    })

    return () => {
      active = false
      window.clearTimeout(timeout)
      document.body.style.overflow = previousOverflow
    }
  }, [onDone])

  return (
    <div className="intro-loader" role="status" aria-label={`Loading portfolio ${progress}%`}>
      <div className="intro-loader__stars" aria-hidden="true" />
      <div className="intro-loader__top"><span>HAMZA QADY<span className="intro-loader__dot">.</span></span><span>PORTFOLIO / 2026</span></div>
      <div className="intro-loader__center">
        <span className="intro-loader__eyebrow">DESIGNING THE SPACE BETWEEN</span>
        <span className="intro-loader__word" key={wordIndex}>{words[wordIndex]}</span>
        <span className="intro-loader__caption">& FORM + FUNCTION</span>
      </div>
      <div className="intro-loader__bottom">
        <div className="intro-loader__labels"><span>PREPARING EXPERIENCE</span><span>{progress}%</span></div>
        <div className="intro-loader__track"><div className="intro-loader__fill" style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  )
}
