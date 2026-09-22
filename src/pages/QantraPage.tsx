import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './QantraPage.css'

gsap.registerPlugin(ScrollTrigger)

const asset = (name: string) => import.meta.env.BASE_URL + 'projects/qantra/' + name + '.webp'

const QANTRA_HERO_IMAGE = asset('hero')
const QANTRA_CLOSING_IMAGE = asset('closing')

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
        '.qantra-hero-image',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.35, ease: 'power3.out', delay: 0.08 },
      )

      gsap.to('.qantra-hero-image', {
        scale: 1.06,
        yPercent: -2.5,
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
        <img
          className="qantra-hero-image"
          src={QANTRA_HERO_IMAGE}
          alt=""
          aria-hidden="true"
          width="1672"
          height="941"
          fetchPriority="high"
        />
        <div className="qantra-hero-image-overlay" aria-hidden="true" />
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
        </div>
      </section>

      <section className="qantra-context qantra-section" id="qantra-story">
        <div className="qantra-section-index qantra-reveal">01 / السياق</div>
        <div className="qantra-context-main qantra-reveal">
          <h2>هوية تُبنى حول فكرة <em>العبور.</em></h2>
          <p className="qantra-lede">قنطرة مشروع تصوري لمكتبة ومساحة قراءة ونادٍ ثقافي للشباب في دمشق. الهدف لم يكن إعادة رسم الشعار، بل بناء عالم بصري يستطيع حمله من الواجهة إلى الملصق وإلى الأشياء التي يلمسها القارئ.</p>
        </div>
        <aside className="qantra-context-note qantra-reveal">
          <span>نطاق العمل</span>
          <p>Visual Identity System<br />Art Direction<br />Patterns & Applications</p>
          <span>ملاحظة</span>
          <p>الشعار موجود مسبقاً ولم يتم تقديمه هنا كتصميم من عملي.</p>
          <figure className="qantra-existing-mark">
            <img src={asset('logo')} alt="الشعار الموجود مسبقاً لمكتبة قنطرة" width="640" height="640" loading="lazy" />
            <figcaption>Existing mark / supplied reference</figcaption>
          </figure>
        </aside>
      </section>

      <section className="qantra-passage">
        <div className="qantra-passage-copy qantra-reveal">
          <p>الفكرة الجوهرية</p>
          <h2>معبر إلى المعرفة</h2>
        </div>
        <div className="qantra-passage-flow" aria-label="قارئ إلى كتاب إلى معرفة إلى حوار">
          {['قارئ', 'كتاب', 'معرفة', 'حوار'].map((item, index) => (
            <div className="qantra-passage-step qantra-reveal" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
              {index < 3 && <i aria-hidden="true">←</i>}
            </div>
          ))}
        </div>
        <p className="qantra-passage-caption qantra-reveal">كما تنقل القنطرة الإنسان من ضفة إلى أخرى، ينقله الكتاب من فكرة إلى أخرى. من هنا بدأ النظام كله.</p>
      </section>

      <section className="qantra-architecture qantra-section">
        <div className="qantra-architecture-copy">
          <div className="qantra-section-index qantra-reveal">02 / من العمارة إلى الهوية</div>
          <h2 className="qantra-reveal">القوس ليس زينة.<br /><em>إنه بنية.</em></h2>
          <p className="qantra-reveal">استُلهمت الفكرة من الإيقاع المعماري الدمشقي، ثم جرى اختزالها إلى قوس واسع ومستدير يعمل كإطار، نافذة، مسار ونظام تكرار. عمداً ابتعدنا عن القوس المدبب المركزي حتى لا يتحول الرمز إلى محراب بصري.</p>
          <div className="qantra-arch-functions qantra-reveal">
            <span>FRAME</span><span>PASSAGE</span><span>STRUCTURE</span><span>RHYTHM</span>
          </div>
        </div>
        <figure className="qantra-architecture-sheet qantra-reveal">
          <img src={asset('arch-system')} alt="لوحة تطوير القوس في هوية قنطرة من مرجع معماري إلى نظام تجريدي" width="1100" height="733" />
          <figcaption>Arch development study · AI-assisted presentation visualization</figcaption>
        </figure>
      </section>

      <section className="qantra-foundations qantra-section">
        <div className="qantra-section-heading qantra-reveal">
          <div className="qantra-section-index">03 / الأساس البصري</div>
          <h2>ليل دمشق،<br /><em>وورقٌ دافئ.</em></h2>
        </div>

        <div className="qantra-color-system qantra-reveal" aria-label="ألوان قنطرة">
          {[
            ['Qantra Navy', '#0E2A47', 'primary'],
            ['Paper Ivory', '#F8F5EE', 'light'],
            ['Stone Beige', '#D7C9B2', 'light'],
            ['Antique Gold', '#B89B5E', 'gold'],
            ['Terracotta', '#A5523A', 'terra'],
            ['Warm Ink', '#2B2A26', 'ink'],
          ].map(([name, hex, kind]) => (
            <div className={'qantra-swatch qantra-swatch-' + kind} key={hex} style={{ backgroundColor: hex }}>
              <span>{name}</span><span>{hex}</span>
            </div>
          ))}
        </div>

        <div className="qantra-type-system qantra-reveal">
          <div className="qantra-type-display">
            <p>قنطرة</p>
            <span>العنوان العربي هو الشخصية، وليس مجرد ترجمة.</span>
          </div>
          <div className="qantra-type-notes">
            <div><span>Display exploration</span><strong>29LT Riwaya</strong></div>
            <div><span>Supporting exploration</span><strong>29LT Idris</strong></div>
            <p>في الصفحة الرقمية نحافظ على الإحساس التحريري بخط عربي مفتوح المصدر، مع إبقاء اختيار الخط التجاري كجزء من استكشاف الهوية لا كادعاء ترخيص للويب.</p>
          </div>
        </div>
      </section>

      <section className="qantra-pattern-section">
        <div className="qantra-pattern-copy qantra-reveal">
          <div className="qantra-section-index">04 / لغة القوس</div>
          <h2>من قوس واحد،<br />إلى <em>إيقاع كامل.</em></h2>
          <p>النمط الأساسي يكرر القوس كنبض معماري. لا يحتاج النبات، ولا الأرابيسك، ولا أي رمز تراثي جاهز كي يقول دمشق.</p>
        </div>
        <div className="qantra-pattern-stage qantra-reveal">
          <ArchGrid />
          <div className="qantra-pattern-label"><span>PATTERN 01</span><strong>Rhythmical Arch</strong></div>
        </div>
      </section>

      <section className="qantra-voices qantra-section">
        <div className="qantra-voices-copy qantra-reveal">
          <div className="qantra-section-index">05 / هوية واحدة، ثلاثة أصوات</div>
          <h2>نظام واحد.<br /><em>ثلاث درجات من الطاقة.</em></h2>
        </div>

        <div className="qantra-voice-controls qantra-reveal" role="group" aria-label="اختيار أسلوب الهوية">
          {voices.map((item) => (
            <button
              key={item.id}
              type="button"
              className={voice === item.id ? 'is-active' : ''}
              aria-pressed={voice === item.id}
              onClick={() => setVoice(item.id)}
            >
              <span>{item.label}</span><small>{item.en}</small>
            </button>
          ))}
        </div>

        <div className={'qantra-voice-preview is-' + voice} aria-live="polite">
          <div className="qantra-voice-visual" aria-hidden="true">
            <ArchMotif />
            <span className="qantra-voice-word">{voice === 'cultural' ? 'إطلاق' : voice === 'architectural' ? 'قنطرة' : 'اقرأ'}</span>
            <span className="qantra-voice-block" />
          </div>
          <div className="qantra-voice-text">
            <span>{currentVoice.en}</span>
            <h3>{currentVoice.title}</h3>
            <p>{currentVoice.copy}</p>
          </div>
        </div>
      </section>

      <section className="qantra-applications" aria-labelledby="qantra-app-title">
        <div className="qantra-app-intro qantra-reveal">
          <div className="qantra-section-index">06 / الهوية في الاستخدام</div>
          <h2 id="qantra-app-title">حين تتحول القاعدة<br />إلى <em>شيء يُحمل ويُهدى.</em></h2>
          <p>الموكابات التالية تصورات مولدة بالذكاء الاصطناعي لتجربة التطبيقات، بينما يعتمد النظام البصري نفسه على القواعد المطورة في المشروع.</p>
        </div>

        <figure className="qantra-application-image qantra-poster-series">
          <img src={asset('poster-series')} alt="سلسلة ملصقات قنطرة: نادي القراءة، أمسية ثقافية، وإطلاق كتاب" width="1400" height="566" loading="lazy" />
          <figcaption><span>Cultural poster series</span><strong>نادي القراءة · أمسية ثقافية · إطلاق كتاب</strong></figcaption>
        </figure>

        <div className="qantra-objects qantra-section">
          <figure className="qantra-application-image qantra-object qantra-object-bookmark">
            <img src={asset('bookmarks')} alt="مجموعة فواصل كتب لهوية قنطرة" width="800" height="1000" loading="lazy" />
            <figcaption><span>Bookmarks</span><strong>القوس كرفيق داخل الكتاب</strong></figcaption>
          </figure>
          <figure className="qantra-application-image qantra-object qantra-object-tote">
            <img src={asset('tote-system')} alt="تطبيقات حقيبة قماشية وأنماط لهوية قنطرة" width="1100" height="733" loading="lazy" />
            <figcaption><span>Tote system</span><strong>Pattern × bold cropped arch</strong></figcaption>
          </figure>
        </div>

        <figure className="qantra-application-image qantra-packaging qantra-reveal">
          <img src={asset('gift-packaging')} alt="نظام تغليف هدايا الكتب لقنطرة" width="1100" height="733" loading="lazy" />
          <figcaption><span>Gift packaging system</span><strong>ورق تغليف · Belly band · صندوق هدية · بطاقة</strong></figcaption>
        </figure>
      </section>

      <section
        className="qantra-closing"
        style={{ backgroundImage: `url(${QANTRA_CLOSING_IMAGE})` }}
      >
        <div className="qantra-closing-overlay" aria-hidden="true" />
        <div className="qantra-closing-copy qantra-reveal">
          <span>QANTRA / 2026</span>
          <p>بين كتابٍ وقارئ،</p>
          <h2>قنطرة.</h2>
          <i aria-hidden="true" />
        </div>
        <div className="qantra-closing-links">
          <a href={import.meta.env.BASE_URL + '#work'}>العودة إلى المشاريع <span>↗</span></a>
          <a href="#qantra-top">إلى الأعلى <span>↑</span></a>
        </div>
      </section>
    </main>
  )
}
