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
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, stagger: 0.08, ease: 'power3.out' },
      )

      gsap.fromTo(
        '.qantra-hero-media img',
        { scale: 1.035 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.qantra-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.65,
          },
        },
      )

      gsap.utils.toArray('.qantra-reveal').forEach((element: any) => {
        gsap.fromTo(
          element,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          },
        )
      })

      gsap.utils.toArray('.qantra-application-image').forEach((element: any) => {
        gsap.fromTo(
          element,
          { y: 28, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          },
        )
      })

      gsap.to('.qantra-closing-media img', {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.qantra-closing',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })
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
        <div className="qantra-hero-media" aria-hidden="true">
          <img src={asset('hero-arches')} alt="" width="1672" height="941" fetchPriority="high" />
        </div>
        <div className="qantra-hero-shade" aria-hidden="true" />

        <div className="qantra-hero-topline">
          <span>مشروع تصوري مستقل · دمشق · 2026</span>
          <span>Visual Identity System / Art Direction</span>
        </div>

        <div className="qantra-hero-copy">
          <p className="qantra-kicker">مكتبة · مساحة قراءة · نادي ثقافي</p>
          <h1 id="qantra-title">قنطرة</h1>
          <p className="qantra-hero-line">بين كتابٍ وقارئ، قنطرة.</p>
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
            <img src={asset('logo-reference')} alt="الشعار الموجود مسبقاً لمكتبة قنطرة" width="1254" height="1254" loading="lazy" />
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
          <p className="qantra-reveal">استُلهمت الفكرة من الإيقاع المعماري الدمشقي، ثم جرى اختزالها إلى قوس يعمل كإطار، نافذة، مسار ونظام تكرار. القوس هنا جزء من البناء البصري، لا رمزاً زخرفياً مستقلاً.</p>
          <div className="qantra-arch-functions qantra-reveal">
            <span>FRAME</span><span>PASSAGE</span><span>STRUCTURE</span><span>RHYTHM</span>
          </div>
        </div>
        <figure className="qantra-architecture-sheet qantra-reveal">
          <img src={asset('arch-system')} alt="لوحة تطوير القوس في هوية قنطرة من مرجع معماري إلى نظام تجريدي" width="1100" height="733" loading="lazy" />
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
            <p>في الصفحة الرقمية نحافظ على الإحساس التحريري بخط عربي مفتوح المصدر، مع إبقاء اختيار الخط التجاري كجزء من استكشاف الهوية.</p>
          </div>
        </div>
      </section>

      <section className="qantra-pattern-section">
        <div className="qantra-pattern-copy qantra-reveal">
          <div className="qantra-section-index">04 / لغة القوس</div>
          <h2>من قوس واحد،<br />إلى <em>إيقاع كامل.</em></h2>
          <p>النمط الأساسي يكرر القوس كنبض معماري. استخدمنا النسختين الداكنة والفاتحة حتى يبقى النظام مرناً بين المساحات التحريرية والتطبيقات الجريئة.</p>
        </div>
        <div className="qantra-pattern-gallery">
          <figure className="qantra-pattern-figure qantra-application-image">
            <img src={asset('pattern-navy')} alt="نمط قنطرة بخلفية كحلية وخطوط ذهبية" width="1672" height="941" loading="lazy" />
            <figcaption><span>Pattern 01 / Navy</span><strong>Rhythmical Arch</strong></figcaption>
          </figure>
          <figure className="qantra-pattern-figure qantra-application-image">
            <img src={asset('pattern-ivory')} alt="نسخة فاتحة من نمط قنطرة بأقواس كحلية" width="1672" height="941" loading="lazy" />
            <figcaption><span>Pattern 01 / Ivory</span><strong>Reverse system</strong></figcaption>
          </figure>
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
          <h2 id="qantra-app-title">حين تتحول القاعدة<br />إلى <em>شيء يُقرأ ويُحمل ويُهدى.</em></h2>
          <p>الموكابات التالية تصورات مولدة بالذكاء الاصطناعي لتجربة التطبيقات، بينما يعتمد النظام البصري نفسه على القواعد المطورة في المشروع.</p>
        </div>

        <div className="qantra-application-group qantra-posters-group">
          <div className="qantra-group-heading qantra-reveal"><span>01</span><h3>الملصقات الثقافية</h3><p>Poster System</p></div>
          <div className="qantra-poster-grid">
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('poster-launch')} alt="ملصق إطلاق كتاب ضمن نظام قنطرة البصري" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Book launch</span><strong>طاقة أعلى للفعاليات</strong></figcaption>
            </figure>
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('poster-reading')} alt="ملصق نادي القراءة ضمن نظام قنطرة البصري" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Reading club</span><strong>صوت تحريري أكثر هدوءاً</strong></figcaption>
            </figure>
          </div>
        </div>

        <div className="qantra-application-group qantra-bookmarks-group">
          <div className="qantra-group-heading qantra-reveal"><span>02</span><h3>فواصل الكتب</h3><p>Bookmark Collection</p></div>
          <div className="qantra-bookmark-grid">
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('bookmark-cultural')} alt="فاصل كتاب قنطرة بأسلوب ثقافي جريء" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Cultural</span><strong>Terracotta × Type</strong></figcaption>
            </figure>
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('bookmark-arch')} alt="فاصل كتاب قنطرة بقوس معماري" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Architectural</span><strong>Arch frame</strong></figcaption>
            </figure>
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('bookmark-pattern')} alt="فاصل كتاب قنطرة بنمط الأقواس" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Pattern</span><strong>Rhythmical system</strong></figcaption>
            </figure>
          </div>
        </div>

        <div className="qantra-application-group qantra-packaging-group">
          <div className="qantra-group-heading qantra-reveal"><span>03</span><h3>نظام تغليف الهدايا</h3><p>Gift Packaging System</p></div>
          <figure className="qantra-application-image qantra-wide-board">
            <img src={asset('packaging-system')} alt="نظام تغليف هدايا قنطرة بصندوق وورق تغليف وبطاقات" width="1536" height="1024" loading="lazy" />
            <figcaption><span>System overview</span><strong>Wrapping paper · Sleeve · Gift box · Tag</strong></figcaption>
          </figure>

          <div className="qantra-packaging-pair">
            <figure className="qantra-application-image qantra-wide-board">
              <img src={asset('packaging-board')} alt="مجموعة تطبيقات تغليف هدايا قنطرة بتفاصيل المواد" width="1536" height="1024" loading="lazy" />
              <figcaption><span>Material study</span><strong>Paper × Navy × Gold</strong></figcaption>
            </figure>
            <figure className="qantra-application-image qantra-tall-card">
              <img src={asset('gift-box-board')} alt="عرض صندوق هدية قنطرة وتفاصيل الختم والبطاقة" width="1122" height="1402" loading="lazy" />
              <figcaption><span>Editorial gift box</span><strong>Detail board</strong></figcaption>
            </figure>
          </div>

          <figure className="qantra-application-image qantra-gift-wrap-card">
            <img src={asset('gift-wrap')} alt="تطبيق تغليف كتاب بسيط لهوية قنطرة" width="1122" height="1402" loading="lazy" />
            <figcaption><span>Minimal gift wrap</span><strong>هدية بسيطة، وهوية واضحة</strong></figcaption>
          </figure>
        </div>
      </section>

      <section className="qantra-closing">
        <div className="qantra-closing-media" aria-hidden="true">
          <img src={asset('closing-hero')} alt="" width="1672" height="941" loading="lazy" />
        </div>
        <div className="qantra-closing-shade" aria-hidden="true" />
        <div className="qantra-closing-copy qantra-reveal">
          <span>QANTRA / 2026</span>
          <p>بين كتابٍ وقارئ،</p>
          <h2>قنطرة.</h2>
        </div>
        <div className="qantra-closing-links">
          <a href={import.meta.env.BASE_URL + '#work'}>العودة إلى المشاريع <span>↗</span></a>
          <a href="#qantra-top">إلى الأعلى <span>↑</span></a>
        </div>
      </section>
    </main>
  )
}
