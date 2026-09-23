import { useEffect } from 'react'
import './ChromaSnapPage.css'

const liveUrl = 'https://chromasnap-palette.sapyre-2377.chatgpt.site/'
const colors = [
  { hex: '#1B2821', label: 'Forest' },
  { hex: '#C5A477', label: 'Sand' },
  { hex: '#E8DED1', label: 'Cream' },
  { hex: '#70594D', label: 'Earth' },
  { hex: '#A69A87', label: 'Stone' },
]

export default function ChromaSnapPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'ChromaSnap — Image Palette Tool | Hamza Qady'
    return () => { document.title = previous }
  }, [])

  return <main className="chroma-case" id="chroma-top">
    <a className="chroma-skip" href="#chroma-story">Skip to project story</a>
    <header className="chroma-nav">
      <a href={`${import.meta.env.BASE_URL}#work`}>↖ Back to selected work</a>
      <span>HAMZA QADY <span className="chroma-divider">/</span> CASE STUDY 03</span>
    </header>

    <section className="chroma-hero">
      <div className="chroma-hero-copy">
        <p className="chroma-kicker">Independent digital product · 2026</p>
        <h1>CHROMA<br /><span>SNAP.</span></h1>
        <p className="chroma-hero-line">A photograph in.<br />A palette out.</p>
        <p className="chroma-intro">A focused tool for turning visual inspiration into five usable colors. Drop an image, explore the palette, and copy what you need.</p>
        <a className="chroma-live-link" href={liveUrl} target="_blank" rel="noopener noreferrer">Try the live tool <span aria-hidden="true">↗</span></a>
      </div>
      <div className="chroma-showcase" aria-label="Preview of the ChromaSnap palette interface">
        <div className="chroma-showcase-top"><span className="chroma-mini-logo"><i></i><i></i></span><b>CHROMA<br />SNAP</b><small>IMAGE → PALETTE</small></div>
        <p className="chroma-showcase-title">Five colors.<br />Ready to use.</p>
        <div className="chroma-showcase-swatches">
          {colors.map((color, index) => <div key={color.hex} style={{ backgroundColor: color.hex, color: index === 2 ? '#111' : '#fff' }}><span>{color.label}</span><strong>{color.hex}</strong></div>)}
        </div>
        <div className="chroma-showcase-bottom"><span>CLICK ANY COLOR TO COPY</span><span>SHUFFLE ↗</span></div>
      </div>
    </section>

    <div className="chroma-meta">
      <div><span>Project</span><p>Self-initiated web tool</p></div>
      <div><span>Role</span><p>Product design & development</p></div>
      <div><span>Technology</span><p>JavaScript · Canvas API · CSS</p></div>
      <div><span>Format</span><p>Responsive single-page app</p></div>
    </div>

    <section id="chroma-story" className="chroma-story-section">
      <p className="chroma-kicker">01 / The problem</p>
      <div><h2>Good colors are<br /><em>everywhere.</em><br />Using them takes work.</h2><p>When a photo has the right mood, translating it into a usable color palette often means opening another design app, picking colors one by one, and copying their values manually.</p><p>ChromaSnap compresses that process into one simple interaction: add an image and get a palette you can use immediately.</p></div>
    </section>

    <section className="chroma-flow" aria-labelledby="chroma-flow-title">
      <div className="chroma-flow-head"><p className="chroma-kicker">02 / The solution</p><h2 id="chroma-flow-title">One image.<br />Three steps.</h2></div>
      <div className="chroma-flow-grid">
        <article><span>01</span><h3>Drop</h3><p>Choose or drag in a JPG, PNG, WEBP or GIF image.</p></article>
        <article><span>02</span><h3>Explore</h3><p>Get five distinct colors. Shuffle to discover another selection from the same image.</p></article>
        <article><span>03</span><h3>Use</h3><p>Click to copy a HEX value, or download the entire palette as a PNG.</p></article>
      </div>
    </section>

    <section className="chroma-details">
      <div><p className="chroma-kicker">03 / How it works</p><h2>Fast by design.<br /><em>Private by default.</em></h2></div>
      <div className="chroma-details-copy"><p>The image is resized for analysis inside the browser. ChromaSnap samples its pixels, groups nearby RGB colors, and chooses five representative colors with enough separation to make the palette useful.</p><p>Every step happens on the visitor’s device. The image is never uploaded to a server, and the tool needs no account or paid API.</p><a href={liveUrl} target="_blank" rel="noopener noreferrer">Open ChromaSnap <span aria-hidden="true">↗</span></a></div>
    </section>

    <footer className="chroma-footer"><span>CHROMASNAP / 2026</span><div><a href={`${import.meta.env.BASE_URL}#work`}>↖ Selected work</a><a href="#chroma-top">Back to top ↑</a></div></footer>
  </main>
}
