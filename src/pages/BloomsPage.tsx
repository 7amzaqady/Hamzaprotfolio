import { useEffect } from 'react'
import './BloomsPage.css'

const asset = (name: string) => `${import.meta.env.BASE_URL}projects/blooms/${name}.webp`
function Picture({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  return <figure className="blooms-photo"><img src={asset(name)} alt={alt} loading="lazy" decoding="async" width="1312" height="1199" /><figcaption>{caption}</figcaption></figure>
}

export default function BloomsPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Blooms — Independent Brand Redesign | Hamza Qady'
    return () => { document.title = previous }
  }, [])
  return <main className="blooms-page" id="blooms-top">
    <a className="blooms-skip" href="#blooms-story">Skip to project story</a>
    <header className="blooms-nav">
      <a href={`${import.meta.env.BASE_URL}#work`}>↖ Back to selected work</a>
      <span>HAMZA QADY <span className="blooms-nav-divider">/</span> CASE STUDY 01</span>
    </header>
    <section className="blooms-hero">
      <div className="blooms-hero-copy">
        <p className="blooms-eyebrow">Independent brand redesign · 2026</p>
        <h1>Blooms<span>Stories take<br /><em>root here.</em></span></h1>
        <p className="blooms-intro">A personal exploration of how a bookstore’s identity can grow from a single symbol into a world of books, flowers, and thoughtful details.</p>
        <a className="blooms-story-link" href="#blooms-story">Discover the story <span>↓</span></a>
      </div>
      <figure className="blooms-hero-image"><img src={asset('packaging-cream')} alt="Proposed Blooms packaging in warm cream and dusty rose: bags, gift wrap, stationery and a wax seal" width="1312" height="1199" fetchPriority="high" /><figcaption>Packaging concept · AI-generated visualization</figcaption></figure>
    </section>
    <div className="blooms-meta">
      <div><span>Project</span><p>Self-initiated concept</p></div>
      <div><span>Role</span><p>Concept & visual identity</p></div>
      <div><span>Tools</span><p>Illustrator · Canva · AI mockups</p></div>
      <div><span>Duration</span><p>Approximately 8 days</p></div>
    </div>
    <section id="blooms-story" className="blooms-section blooms-story">
      <p className="blooms-eyebrow">01 / The starting point</p>
      <div><h2>A familiar idea.<br /><em>A new expression.</em></h2><p>I began this project after seeing the existing Blooms Book Store logo. Its combination of books and flowers sparked an idea: preserve that literary, botanical character while exploring a more focused mark and a consistent visual identity.</p><p>The proposed symbol brings together the letter B, the pages of an open book, and a blooming flower. Those elements carry through to patterns, stationery, bookmarks, and packaging.</p><p className="blooms-note">An independent design study. Not commissioned by or affiliated with the store; the proposed identity is not presented as an adopted rebrand.</p></div>
    </section>
    <section className="blooms-comparison" aria-label="Original identity and proposed redesign">
      <figure className="blooms-original"><img src={asset('original')} alt="Existing Blooms logo: a detailed floral illustration above an open book" width="150" height="150" loading="lazy" /><figcaption>Existing identity / reference supplied for this study</figcaption></figure>
      <figure className="blooms-proposed"><img src={asset('logo-reverse')} alt="Proposed Blooms logo combining a B monogram, an open book and a rose flower" width="2048" height="755" loading="lazy" /><figcaption>Proposed identity / Book + B + Bloom</figcaption></figure>
    </section>
    <section className="blooms-section">
      <div className="blooms-section-heading"><p className="blooms-eyebrow">02 / The visual language</p><h2>Rooted in green.<br /><em>Softened by rose.</em></h2></div>
      <div className="blooms-colors">{[['Forest Green', '#103A2C'], ['Dusty Rose', '#B77F7F'], ['Warm Cream', '#F8F5EE'], ['Warm Ink', '#3E342F']].map(([name, hex]) => <div key={hex} style={{ backgroundColor: hex, color: hex === '#103A2C' || hex === '#3E342F' ? '#F8F5EE' : '#103A2C' }}><span>{name}</span><span>{hex}</span></div>)}</div>
      <div className="blooms-type"><h3>A literary character</h3><div><p>The brand guidelines pair <strong>Noto Serif Bengali</strong> with <strong>Times New Roman — Condensed (Style)</strong>. The serif direction supports a warm, bookish tone across the proposed identity.</p><p>Warm, calm, thoughtful. A voice that invites readers to slow down and discover.</p></div></div>
      <div className="blooms-patterns"><figure><img src={asset('pattern-petals')} alt="Dusty rose petal pattern on cream" width="1344" height="1885" loading="lazy" /><figcaption>Petals / a soft, repeating detail</figcaption></figure><figure><img src={asset('pattern-monogram')} alt="Cream B monogram repeated on forest green" width="1344" height="1885" loading="lazy" /><figcaption>Monogram / a recognizable signature</figcaption></figure></div>
    </section>
    <section className="blooms-applications">
      <div className="blooms-section-heading"><p className="blooms-eyebrow">03 / The identity in use</p><h2>Made for the<br /><em>ritual of reading.</em></h2><p>Exploring the identity through objects a reader might carry, keep, or give. The following mockups are AI-generated visualizations of proposed applications.</p></div>
      <div className="blooms-gallery"><Picture name="packaging-green" alt="Green bags and gift wrap with a cream petal pattern" caption="01 / Packaging exploration — petal pattern" /><Picture name="bookmarks" alt="Green monogram and cream Blooms bookmark concepts" caption="02 / Bookmark exploration — monogram system" /><Picture name="bookmarks-rose" alt="Dusty rose and cream bookmark concepts with tassels" caption="03 / Bookmark exploration — rose variation" /><Picture name="packaging-cream" alt="Cream and rose bags and stationery with the B monogram pattern" caption="04 / Packaging exploration — cream variation" /></div>
      <figure className="blooms-card"><img src={asset('card')} alt="Flat stationery concept with the Blooms logo framed by books and botanical illustrations" width="1138" height="481" loading="lazy" /><figcaption>Stationery artwork / an additional botanical variation</figcaption></figure>
    </section>
    <section className="blooms-section blooms-story"><p className="blooms-eyebrow">04 / Reflection</p><div><h2>One mark.<br /><em>Room to grow.</em></h2><p>Across roughly eight days, I developed the concept and visual identity using Adobe Illustrator and Canva, then used AI mockups to explore how it could live across physical applications.</p><p>The result is a proposed identity system: a logo family, a four-color palette, two pattern directions, and a set of stationery and packaging explorations.</p><p className="blooms-note">Concept, logo & identity: Hamza Qady. Mockup scenes: AI-generated. Original logo shown for context.</p></div></section>
    <footer className="blooms-footer"><p>Good books.<br /><em>Brighter days.</em></p><div><a href="https://wa.me/963993720719" target="_blank" rel="noopener noreferrer">Discuss your brand project ↗</a><a href={`${import.meta.env.BASE_URL}#work`}>↖ Explore selected work</a><a href="#blooms-top">Back to top ↑</a></div><span>Blooms / Independent redesign concept / 2026</span></footer>
  </main>
}
