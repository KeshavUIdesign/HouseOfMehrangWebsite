import {
  FormEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { Link } from "react-router"
import { A, articles, products, type Product } from "./site-data"
import { Header, PageIntro, WhatsAppPrompt } from "./SiteLayout"
import HomeCarousel from "./HomeCarousel"

function Arrow({ file = "a028e.svg" }: { file?: string }) {
  return <img className="inline-icon" src={`${A}/${file}`} alt="" />
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-art">
        <Link to={`/wallpapers/${product.slug}`}>
          <img
            src={`${A}/${product.image}`}
            alt={`${product.name} wallpaper artwork`}
          />
        </Link>
        <button
          className="heart-button"
          type="button"
          aria-label={`Save ${product.name}`}
        >
          <img src={`${A}/84088.svg`} alt="" />
        </button>
      </div>
      <span className="card-kicker">
        {product.collection.toUpperCase()} · WALLPAPER
      </span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <small>₹{product.price} / sample</small>
      <Link className="outline-action" to={`/wallpapers/${product.slug}`}>
        View wallpaper <Arrow />
      </Link>
    </article>
  )
}

function Invitation() {
  return (
    <section className="invitation">
      <div>
        <span className="eyebrow">THE RIGHT WALL FINISHES THE ROOM</span>
        <h2>Find your wall, in your own light.</h2>
        <p>
          See colour, pattern and texture up close. Request samples or explore
          the materials at our Mumbai studio.
        </p>
      </div>
      <div className="invitation-actions">
        <Link className="pill primary" to="/contact">
          Request samples <Arrow />
        </Link>
        <Link className="pill outline" to="/contact">
          Book a studio visit <Arrow />
        </Link>
      </div>
    </section>
  )
}

function useHomeParallax(rootRef: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )
    if (!root) return

    gsap.registerPlugin(ScrollTrigger)
    let destroyMotion = () => {}

    const setupMotion = () => {
      destroyMotion()
      destroyMotion = () => {}
      if (reducedMotion.matches) {
        root
          .querySelectorAll<HTMLElement>(".process-number")
          .forEach((number, index) => {
            number.textContent = String(index + 1).padStart(2, "0")
          })
        root
          .querySelectorAll(".process-grid > div.is-active")
          .forEach((step) => step.classList.remove("is-active"))
        return
      }

      const lenis = new Lenis({
        duration: 1.15,
        easing: (value) => 1 - Math.pow(1 - value, 4),
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      })
      const marquee = root.querySelector<HTMLElement>(".brand-rolling-band")
      const marqueeTrack = marquee?.querySelector<HTMLElement>("div")
      const wrapMarquee = gsap.utils.wrap(-50, 0)
      let marqueePosition = 0
      let marqueeSpeed = -0.012
      let marqueeTargetSpeed = -0.012
      let marqueeDirection = 1
      let marqueePaused = false
      let lastScrollAt = 0

      const updateScroll = () => {
        ScrollTrigger.update()
        lastScrollAt = performance.now()
        if (lenis.direction) marqueeDirection = lenis.direction
        marqueeTargetSpeed =
          -marqueeDirection *
          (0.03 + Math.min(Math.abs(lenis.velocity) * 0.018, 0.18))
      }
      const pauseMarquee = () => {
        marqueePaused = true
      }
      const resumeMarquee = () => {
        marqueePaused = false
      }
      const updateMotion = (time: number) => {
        lenis.raf(time * 1000)
        if (!marqueeTrack) return
        if (marqueePaused) {
          marqueeTargetSpeed = 0
        } else if (performance.now() - lastScrollAt > 160) {
          marqueeTargetSpeed = -marqueeDirection * 0.012
        }
        marqueeSpeed +=
          (marqueeTargetSpeed - marqueeSpeed) *
          Math.min(1, 0.075 * gsap.ticker.deltaRatio(60))
        marqueePosition = wrapMarquee(
          marqueePosition +
            marqueeSpeed * Math.min(2, gsap.ticker.deltaRatio(60)),
        )
        gsap.set(marqueeTrack, { xPercent: marqueePosition })
      }

      lenis.on("scroll", updateScroll)
      marquee?.addEventListener("mouseenter", pauseMarquee)
      marquee?.addEventListener("mouseleave", resumeMarquee)
      marquee?.addEventListener("focusin", pauseMarquee)
      marquee?.addEventListener("focusout", resumeMarquee)
      gsap.ticker.add(updateMotion)
      gsap.ticker.lagSmoothing(0)

      const context = gsap.context(() => {
        const section = root.querySelector<HTMLElement>(".home-category")
        if (!section) return

        const processSection =
          root.querySelector<HTMLElement>(".process-section")
        const processLine =
          processSection?.querySelector<HTMLElement>(".process-progress-line span")
        const processSteps = processSection
          ? Array.from(
              processSection.querySelectorAll<HTMLElement>(".process-grid > div"),
            )
          : []
        const processNumbers = processSteps.map((step) =>
          step.querySelector<HTMLElement>(".process-number"),
        )

        if (processSection && processLine && processNumbers.every(Boolean)) {
          processNumbers.forEach((number) => {
            if (number) number.textContent = "00"
          })
          gsap.fromTo(
            processLine,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: processSection,
                start: "top 72%",
                end: "bottom 58%",
                scrub: 1.1,
                onUpdate: (trigger) => {
                  const progress = trigger.progress
                  const activeIndex =
                    progress < 0.02
                      ? -1
                      : Math.min(3, Math.floor(progress * 4))
                  processSteps.forEach((step, index) =>
                    step.classList.toggle("is-active", index === activeIndex),
                  )
                  processNumbers.forEach((number, index) => {
                    if (!number) return
                    const numberProgress = Math.max(
                      0,
                      Math.min(1, (progress - index * 0.22) / 0.22),
                    )
                    number.textContent = String(
                      Math.round(numberProgress * (index + 1)),
                    ).padStart(2, "0")
                  })
                },
              },
            },
          )
        }

        const storySection =
          root.querySelector<HTMLElement>(".brand-story-strip")
        const storyPin =
          storySection?.querySelector<HTMLElement>(".story-location-pin")
        if (storySection && storyPin) {
          gsap.from(storyPin, {
            y: -42,
            opacity: 0,
            duration: 0.85,
            ease: "bounce.out",
            scrollTrigger: {
              trigger: storySection,
              start: "top 82%",
              once: true,
            },
          })
        }

        const possibilitiesWord = section.querySelector<HTMLElement>(
          ".collection-possibilities-word",
        )
        if (possibilitiesWord) {
          gsap.fromTo(
            possibilitiesWord,
            { x: -40, y: 10 },
            {
              x: 40,
              y: -10,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          )
        }

        if (window.innerWidth < 768) {
          [
            [section, ".home-carousel"],
            [
              root.querySelector<HTMLElement>(".brand-unfurl"),
              ".brand-unfurl .wrap",
            ],
            [
              root.querySelector<HTMLElement>(".mood-story"),
              ".mood-story .mood-stage",
            ],
            [
              root.querySelector<HTMLElement>(".home-soft-products"),
              ".home-soft-products > div:last-child",
            ],
            [processSection, ".process-steps"],
            [storySection, ".mumbai-skyline"],
          ].forEach(([trigger, target]) => {
            if (!trigger || typeof target !== "string") return
            gsap.fromTo(
              target,
              { y: 14, opacity: 0.94 },
              {
                y: -14,
                opacity: 1,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.25,
                },
              },
            )
          })
          return
        }

        gsap.fromTo(
          section,
          { y: 90 },
          {
            y: 0,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 98%",
              end: "top 72%",
              scrub: 1.15,
            },
          },
        )

        gsap.utils
          .toArray<HTMLElement>("[data-panel-depth]", section)
          .forEach((layer) => {
            const depth = Number(layer.dataset.panelDepth || 0)
            const distance = 21 * depth
            gsap.fromTo(
              layer,
              { y: distance },
              {
                y: -distance,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                  invalidateOnRefresh: true,
                },
              },
            )
          })

        gsap.utils
          .toArray<HTMLElement>(".stage-b-depth", root)
          .forEach((stageSection) => {
            gsap.utils
              .toArray<HTMLElement>("[data-stage-b-depth]", stageSection)
              .forEach((layer) => {
                const depth = Number(layer.dataset.stageBDepth || 0)
                const rotation = Number(layer.dataset.parallaxRotate || 0)
                const distance = 42 * depth
                gsap.fromTo(
                  layer,
                  {
                    y: distance,
                    rotation: rotation ? -rotation / 2 : 0,
                  },
                  {
                    y: -distance,
                    rotation: rotation ? rotation / 2 : 0,
                    ease: "power3.inOut",
                    scrollTrigger: {
                      trigger: stageSection,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.2,
                      invalidateOnRefresh: true,
                    },
                  },
                )
              })
          })

        gsap.utils
          .toArray<HTMLElement>(".stage-c-depth", root)
          .forEach((stageSection) => {
            gsap.utils
              .toArray<HTMLElement>("[data-stage-c-depth]", stageSection)
              .forEach((layer) => {
                const depth = Number(layer.dataset.stageCDepth || 0)
                const rotation = Number(layer.dataset.stageCRotate || 0)
                const distance = 42 * depth
                gsap.fromTo(
                  layer,
                  {
                    y: distance,
                    rotation: rotation ? -rotation / 2 : 0,
                  },
                  {
                    y: -distance,
                    rotation: rotation ? rotation / 2 : 0,
                    ease: "power3.inOut",
                    scrollTrigger: {
                      trigger: stageSection,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.2,
                      invalidateOnRefresh: true,
                    },
                  },
                )
              })
          })
      }, root)

      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 80)
      destroyMotion = () => {
        window.clearTimeout(refresh)
        context.revert()
        marquee?.removeEventListener("mouseenter", pauseMarquee)
        marquee?.removeEventListener("mouseleave", resumeMarquee)
        marquee?.removeEventListener("focusin", pauseMarquee)
        marquee?.removeEventListener("focusout", resumeMarquee)
        gsap.ticker.remove(updateMotion)
        lenis.destroy()
      }
    }

    setupMotion()
    reducedMotion.addEventListener("change", setupMotion)

    return () => {
      reducedMotion.removeEventListener("change", setupMotion)
      destroyMotion()
    }
  }, [rootRef])
}

export function HomePage() {
  const [mood, setMood] = useState(0)
  const [previousMood, setPreviousMood] = useState<number | null>(null)
  const homeRef = useRef<HTMLElement>(null)
  const moodTransitionTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  )
  useHomeParallax(homeRef)
  const moods = [
    {
      name: "Quietly grounded",
      prompt: "I want my room to exhale.",
      image: "35f72.png",
      copy: "Airy botanicals, warm neutrals and a soft sense of rhythm.",
    },
    {
      name: "Joyfully curious",
      prompt: "I want a room full of stories.",
      image: "6e81e.png",
      copy: "Illustrated worlds and playful details for imaginative spaces.",
    },
    {
      name: "Boldly collected",
      prompt: "I want my wall to lead the room.",
      image: "fe1b9.png",
      copy: "Confident colour and expressive pattern with a layered point of view.",
    },
  ]
  const moodCutouts = ["48571.webp", "ba47b.webp", "88bb3.webp"]

  useEffect(
    () => () => {
      if (moodTransitionTimer.current)
        window.clearTimeout(moodTransitionTimer.current)
    },
    [],
  )

  const selectMood = (index: number) => {
    if (index === mood) return
    if (moodTransitionTimer.current)
      window.clearTimeout(moodTransitionTimer.current)
    setPreviousMood(mood)
    setMood(index)
    moodTransitionTimer.current = window.setTimeout(
      () => setPreviousMood(null),
      420,
    )
  }

  return (
    <main className="home-page" ref={homeRef}>
      <section className="home-hero">
        <Header overlay />
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${A}/c4c45.png`}
          aria-label="House of Mehrang interior film"
        >
          <source src={`${A}/home-hero.mp4`} type="video/mp4" />
        </video>
        <img
          className="hero-poster"
          src={`${A}/c4c45.png`}
          alt="Living room with a deep teal botanical wall"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>
            We are glad
            <br />
            you are here.
          </h1>
          <div>
            <Link className="pill light-pill" to="/shop-the-room">
              Shop the room <Arrow file="7800e.svg" />
            </Link>
          </div>
          <a
            className="hero-scroll"
            href="#home-categories"
            aria-label="Scroll to explore"
          >
            <img src={`${A}/3e60f.svg`} alt="" />
          </a>
        </div>
      </section>

      <section
        className="home-category home-depth-section"
        id="home-categories"
      >
        <span
          className="mood-depth-word collection-possibilities-word"
          aria-hidden="true"
        >
          POSSIBILITIES
        </span>
        <div className="wrap">
          <div className="split-heading">
            <h2>
              A world of walls.
              <br />A world of possibilities.
            </h2>
            <div className="category-intro-action">
              <p>
                Room inspiration begins with how a surface feels. Explore four
                ways to bring character home.
              </p>
              <Link className="pill outline" to="/imagine-your-wall">
                Imagine Your Wall <Arrow />
              </Link>
            </div>
          </div>
          <HomeCarousel />
        </div>
      </section>

      <section
        className="brand-rolling-band"
        aria-label="House of Mehrang values"
        tabIndex={0}
      >
        <div>
          <span className="rolling-monogram">M</span>
          <span>Pattern with purpose</span>
          <i />
          <span>Made for real homes</span>
          <i />
          <span>Curated in Mumbai</span>
          <i />
          <span>Colour with character</span>
          <i />
          <span className="rolling-monogram">M</span>
          <span>Pattern with purpose</span>
          <i />
          <span>Made for real homes</span>
          <i />
          <span>Curated in Mumbai</span>
          <i />
          <span>Colour with character</span>
          <i />
        </div>
      </section>

      <section className="brand-unfurl stage-b-depth">
        <span
          className="brand-depth-word"
          data-stage-b-depth="0.4"
          aria-hidden="true"
        >
          MEHRANG
        </span>
        <div className="wrap">
          <div className="brand-orbit-mark">
            <span
              className="brand-orbit-ellipse"
              data-stage-b-depth="0.3"
              data-parallax-rotate="20"
            />
            <div
              className="brand-floating-print print-one"
              data-stage-b-depth="0.9"
              aria-hidden="true"
            >
              <img src={`${A}/88bb3.webp`} alt="" loading="lazy" />
            </div>
            <div
              className="brand-floating-print print-two"
              data-stage-b-depth="1.3"
              aria-hidden="true"
            >
              <img src={`${A}/f0b0a.webp`} alt="" loading="lazy" />
            </div>
          </div>
          <div>
            <span className="eyebrow light">MEET MEHRANG</span>
            <h2>A house with many rooms, and a story on every wall.</h2>
            <p>
              Mehrang is our curious guide through colour, craft and the
              everyday joy of making a space your own. Follow the golden thread
              as the world of the house gently unfolds.
            </p>
            <Link className="pill light-pill" to="/about">
              About the brand <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section
        className={`mood-story mood-tone-${mood} wrap stage-b-depth`}
      >
        <span
          className="mood-depth-word"
          data-stage-b-depth="0.5"
          aria-hidden="true"
        >
          FEELING
        </span>
        <div className="mood-story-intro">
          <div className="mood-intro-spacer" aria-hidden="true" />
          <div>
            <span className="eyebrow">WHAT IS YOUR MOOD TODAY?</span>
            <h2>Begin with a feeling.</h2>
            <p>
              Choose the atmosphere you want to create and discover a more
              intuitive way into pattern.
            </p>
          </div>
        </div>
        <div className="mood-stage">
          <div className="mood-image" data-stage-b-depth="0.82">
            {previousMood !== null && (
              <img
                className="mood-image-previous"
                src={`${A}/${moods[previousMood].image.replace(".png", ".webp")}`}
                alt=""
                loading="lazy"
              />
            )}
            <img
              className="mood-image-current"
              src={`${A}/${moods[mood].image.replace(".png", ".webp")}`}
              alt={moods[mood].name}
              loading="lazy"
              key={moods[mood].image}
            />
            <div>
              <span>{moods[mood].prompt}</span>
              <h3>{moods[mood].name}</h3>
              <p>{moods[mood].copy}</p>
            </div>
          </div>
          <div className="mood-tabs">
            {moods.map((item, index) => (
              <button
                className={mood === index ? "active" : ""}
                type="button"
                onClick={() => selectMood(index)}
                aria-pressed={mood === index}
                key={item.name}
              >
                <span>0{index + 1}</span>
                {item.name}
              </button>
            ))}
          </div>
          <div
            className="mood-cutout-depth"
            data-stage-b-depth="1.16"
            aria-hidden="true"
          >
            <img
              className="mood-cutout"
              src={`${A}/${moodCutouts[mood]}`}
              alt=""
              loading="lazy"
              key={moodCutouts[mood]}
            />
          </div>
        </div>
      </section>

      <section className="home-soft-products wrap stage-c-depth">
        <span
          className="fabrics-depth-word"
          data-stage-c-depth="0.4"
          aria-hidden="true"
        >
          FABRICS
        </span>
        <div className="split-heading">
          <h2>The story continues beyond the wall.</h2>
          <p>
            Cushions, curtains and upholstery bring the same feeling into the
            rest of the room.
          </p>
        </div>
        <div>
          {[
            ["03200.png", "Cushions", "Small pieces, generous character"],
            ["3bd24.png", "Curtains", "Light, framed beautifully"],
            ["f8d45.png", "Upholstery", "Texture made to live with"],
          ].map(([image, title, copy], index) => (
            <div className="fabric-card-depth" key={title}>
              <Link to="/contact">
                <div className="fabric-image-stage">
                  <div
                    className="parallax-image-frame"
                    data-stage-c-depth={["0.84", "1.08", "0.94"][index]}
                  >
                    <img
                      src={`${A}/${image.replace(".png", ".webp")}`}
                      alt={`${title} inspiration`}
                      loading="lazy"
                    />
                  </div>
                </div>
                <span>FABRICS & MORE</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="expertise-band">
        <div className="expertise-media">
          <img
            src={`${A}/6900b.png`}
            alt="Designer selecting material samples"
          />
        </div>
        <div>
          <span className="eyebrow light">OUR MATERIAL EXPERTISE</span>
          <h2>
            Your vision.
            <br />
            Our material expertise.
          </h2>
          <p>
            We pair pattern with practical material guidance, helping you make
            decisions with confidence.
          </p>
          {[
            ["7f038.svg", "Samples selected for presentation"],
            ["1cb13.svg", "Material scale and application"],
            ["d0934.svg", "Quantity and finish discussion"],
            ["54b5d.svg", "Custom print project enquiries"],
            ["115ee.svg", "A collaborative studio conversation"],
          ].map(([icon, text]) => (
            <span className="benefit" key={text}>
              <img src={`${A}/${icon}`} alt="" />
              {text}
            </span>
          ))}
          <Link className="pill light-pill" to="/about">
            Meet our material approach <Arrow file="8d1cd.svg" />
          </Link>
        </div>
      </section>

      <section className="wrap process-section stage-c-depth">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2>From an idea to a wall you love.</h2>
        <div className="process-steps">
          <div className="process-progress-line" aria-hidden="true">
            <span />
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "Share your wall",
                "Tell us about the room, light and feeling you want.",
              ],
              [
                "02",
                "Review samples",
                "Compare colour and texture in the space itself.",
              ],
              [
                "03",
                "Confirm quantities",
                "Plan the final material and application.",
              ],
              ["04", "Install", "Bring the finished wall home."],
            ].map(([n, title, copy]) => (
              <div key={n}>
                <span className="process-number">{n}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-story-strip stage-c-depth">
        <svg
          className="mumbai-skyline"
          data-stage-c-depth="0.3"
          viewBox="0 0 720 180"
          aria-hidden="true"
        >
          <path d="M20 155H700M55 155V124H94V155M105 155V106H145V155M160 155V132H202V155M244 155V91H275V155M280 155V70H440V155M304 70V54H416V70M330 155V126C330 92 390 92 390 126V155M350 54C350 32 370 20 370 20C370 20 390 32 390 54M445 155V112H480V155M495 155V88H535V155M552 155V120H594V155M612 155V100H660V155" />
        </svg>
        <div className="story-symbols">
          <img
            className="story-monogram"
            src={`${A}/48571.png`}
            alt="House of Mehrang monogram"
            data-stage-c-depth="0.4"
            data-stage-c-rotate="24"
          />
          <img
            className="story-location-pin"
            src={`${A}/1e6f2.svg`}
            alt=""
          />
        </div>
        <div>
          <span className="eyebrow">A HOME FOR YOUR IDEAS</span>
          <h2>
            Rooted in Mumbai.
            <br />
            Inspired by the way you live.
          </h2>
        </div>
        <p>
          House of Mehrang brings together wallpapers, wall panels and
          thoughtful material guidance for homes with character.
        </p>
      </section>

      <section className="wrap home-contact">
        <div>
          <span className="eyebrow">BEGIN WITH A CONVERSATION</span>
          <h2>Good spaces begin with a conversation.</h2>
          <p>
            Share your room with the studio. We will help you build a useful
            starting palette.
          </p>
        </div>
        <ContactMiniForm />
      </section>
      <WhatsAppPrompt />
    </main>
  )
}

function ContactMiniForm() {
  const [sent, setSent] = useState(false)
  return sent ? (
    <div className="form-success">
      <img src={`${A}/7f038.svg`} alt="" />
      <strong>Thank you.</strong>
      <span>Our studio will be in touch.</span>
    </div>
  ) : (
    <form
      className="mini-form"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <label>
        Name
        <input required placeholder="Your full name" />
      </label>
      <label>
        Email
        <input required type="email" placeholder="you@example.com" />
      </label>
      <label>
        Phone
        <input required placeholder="Your phone number" />
      </label>
      <label>
        Project type
        <select>
          <option>Wallpaper samples</option>
          <option>Studio visit</option>
          <option>Design project</option>
        </select>
      </label>
      <button className="pill primary" type="submit">
        Request samples <Arrow />
      </button>
    </form>
  )
}

export function ShopPage() {
  const [query, setQuery] = useState("")
  const [collection, setCollection] = useState<"All" | "Calm" | "Playful">(
    "All",
  )
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (collection === "All" || p.collection === collection) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [collection, query],
  )
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Shop"
        eyebrow="THE WALLPAPER LIBRARY"
        title="Find your kind of wall."
        copy="Browse pattern, texture and finish. Build a sample palette before choosing the surface for your space."
      />
      <section className="wrap catalogue-search">
        <img src={`${A}/70dff.svg`} alt="" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by design, colour or material"
        />
        <button type="button">
          Sort: Featured <img src={`${A}/79c81.svg`} alt="" />
        </button>
      </section>
      <section className="wrap catalogue-layout">
        <aside className="filters">
          <h3>
            Filters <img src={`${A}/85f84.svg`} alt="" />
          </h3>
          <b>Collection</b>
          {(["All", "Calm", "Playful"] as const).map((name) => (
            <label key={name}>
              <input
                type="radio"
                checked={collection === name}
                onChange={() => setCollection(name)}
              />
              {name}
            </label>
          ))}
          <b>Style</b>
          {["Botanical & floral", "Illustrative", "Minimal", "Scenic"].map(
            (name) => (
              <label key={name}>
                <input type="checkbox" />
                {name}
              </label>
            ),
          )}
          <div className="filter-note">
            <strong>Not sure where to start?</strong>
            <p>
              Order samples and see every pattern in your room&apos;s own light.
            </p>
            <Link to="/contact">
              Ask the studio <Arrow />
            </Link>
          </div>
        </aside>
        <div className="catalogue-results">
          <div className="results-heading">
            <span>Showing all 7 designs</span>
            <b>{visible.length} results</b>
          </div>
          {(["Calm", "Playful"] as const).map((group) => {
            const groupProducts = visible.filter((p) => p.collection === group)
            if (!groupProducts.length) return null
            return (
              <section className="product-group" key={group}>
                <div>
                  <span>COLLECTION</span>
                  <h2>{group}</h2>
                  <p>
                    {group === "Calm"
                      ? "Quiet, airy compositions rooted in nature."
                      : "Imaginative, joyful designs with wit and warmth."}
                  </p>
                </div>
                <div className="product-grid">
                  {groupProducts.map((p) => (
                    <ProductCard product={p} key={p.slug} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </section>
      <Invitation />
    </main>
  )
}

export function CollectionsPage() {
  const calm = products.filter((p) => p.collection === "Calm")
  const playful = products.filter((p) => p.collection === "Playful")
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Collections"
        eyebrow="COLLECTIONS"
        title="Walls with a feeling."
        copy="Two worlds, seven designs. Explore CALM—quiet, airy compositions for restful spaces—and PLAYFUL, a joyful collection made for curious minds."
      />
      <section className="wrap featured-collection">
        <img src={`${A}/88bb3.png`} alt="Veil of Spring wallpaper artwork" />
        <div>
          <span className="eyebrow">CALM COLLECTION</span>
          <h2>Veil of Spring.</h2>
          <p>
            Delicate foliage drifts through a field of muted colour, creating a
            composition that feels light, still and at home.
          </p>
          <Link className="pill primary" to={`/wallpapers/${calm[0].slug}`}>
            Request a sample <Arrow />
          </Link>
        </div>
      </section>
      <CollectionBlock
        title="Serene. Airy. Quietly considered."
        eyebrow="CALM COLLECTION"
        products={calm}
      />
      <CollectionBlock
        title="Joyful. Imaginative. Made for curious minds."
        eyebrow="PLAYFUL COLLECTION"
        products={playful}
      />
      <section className="collection-overview wrap">
        <div>
          <span className="eyebrow">ALL COLLECTIONS</span>
          <h2>Seven designs. Two worlds.</h2>
        </div>
        <div>
          {calm.map((p) => (
            <Link to={`/wallpapers/${p.slug}`} key={p.slug}>
              <img src={`${A}/${p.image}`} alt={p.name} />
            </Link>
          ))}
          <strong>3 designs</strong>
        </div>
        <div>
          {playful.map((p) => (
            <Link to={`/wallpapers/${p.slug}`} key={p.slug}>
              <img src={`${A}/${p.image}`} alt={p.name} />
            </Link>
          ))}
          <strong>4 designs</strong>
        </div>
      </section>
      <Invitation />
    </main>
  )
}

function CollectionBlock({
  title,
  eyebrow,
  products: list,
}: {
  title: string
  eyebrow: string
  products: Product[]
}) {
  return (
    <section className="collection-block">
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>
          Every artwork is designed to hold a room gently, with enough detail to
          reward a closer look.
        </p>
        <div className="editorial-product-grid">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <main>
      <section className="about-film">
        <video autoPlay muted loop playsInline poster={`${A}/c4c45.png`}>
          <source src={`${A}/home-hero.mp4`} type="video/mp4" />
        </video>
        <div />
        <blockquote>
          “We have always believed a space is more than the things inside it.”
        </blockquote>
      </section>
      <section className="wrap about-story">
        <img
          src={`${A}/c4c45.png`}
          alt="Teal wallpaper in a warm living room"
        />
        <div>
          <img className="monogram" src={`${A}/48571.png`} alt="" />
          <h2>A home for your ideas.</h2>
          <p>
            There was never a shortage of beautiful things. What interested us
            was how they came together—how scale, context, colour, texture and
            proportion could make a room feel entirely its own.
          </p>
          <p>
            With material experience, we work with homeowners, interior
            designers and architects across Mumbai and Maharashtra.
          </p>
        </div>
      </section>
      <section className="approach-section">
        <div className="wrap">
          <span className="eyebrow">
            SCALE · CONTEXT · COLOUR · TEXTURE · PROPORTION
          </span>
          <h2>The things we were trained to see before we ever designed a product.</h2>
          <div className="approach-grid">
            {[
              ["e6169.svg", "Colour in context"],
              ["e6411.svg", "Texture with intention"],
              ["d4e5b.svg", "Details that matter"],
            ].map(([icon, title]) => (
              <div key={title}>
                <img src={`${A}/${icon}`} alt="" />
                <h3>{title}</h3>
                <p>
                  Every selection begins with how a room feels, how it is used
                  and how material responds to light.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap material-story">
        <div>
          <span className="eyebrow">MATERIAL / WITH INTENT</span>
          <h2>Slow down. Look closer.</h2>
          <p>
            A wall is more than a backdrop. Material, finish and detail change
            how a room feels throughout the day.
          </p>
          <Link className="pill primary" to="/contact">
            Discover the material library <Arrow />
          </Link>
        </div>
        <img src={`${A}/6900b.png`} alt="Hands arranging material samples" />
      </section>
      <section className="designer-band">
        <div>
          <img className="band-diamond" src={`${A}/d8151.svg`} alt="" />
          <span className="eyebrow light">FOR DESIGNERS & ARCHITECTS</span>
          <h2>
            Your vision.
            <br />A shared material conversation.
          </h2>
          <p>
            Bring your brief, plans and measurements. Explore sample relations
            and scale with the studio.
          </p>
          <Link className="pill light-pill" to="/contact">
            Discuss a design project <Arrow />
          </Link>
        </div>
        <div>
          {[
            "Sample palettes for presentations",
            "Material scale & practical guidance",
            "Quantity and finish discussion",
            "Custom print project enquiries",
          ].map((x, i) => (
            <span key={x}>
              <img
                src={`${A}/${["23b1c.svg", "87fea.svg", "e238c.svg", "67dbf.svg"][i]}`}
                alt=""
              />
              {x}
            </span>
          ))}
        </div>
      </section>
      <section className="wrap studio-story">
        <img
          src={`${A}/8aa54.png`}
          alt="Layered textiles and wallpaper in a bedroom"
        />
        <div>
          <span className="eyebrow">MUMBAI MATERIAL STUDIO</span>
          <h2>Feel it. See it. Make it yours.</h2>
          <p>
            Visit our Mumbai studio to explore materials in person. We welcome
            project conversations for spaces across Mumbai and Maharashtra.
          </p>
          <Link className="pill outline" to="/contact">
            Book a studio visit <Arrow />
          </Link>
        </div>
      </section>
      <section className="behind-scenes wrap">
        <div className="split-heading">
          <div>
            <span className="eyebrow">BEHIND THE HOUSE</span>
            <h2>Sketches, samples and the details between.</h2>
          </div>
          <p>
            A glimpse into the drawings, material trials and quiet studio
            decisions behind each finished collection.
          </p>
        </div>
        <div>
          {["03200.png", "3bd24.png", "6900b.png", "45774.png", "f8d45.png"].map(
            (image, index) => (
              <img
                src={`${A}/${image}`}
                alt={`Behind the scenes frame ${index + 1}`}
                key={image}
              />
            ),
          )}
        </div>
        <div className="behind-scenes-actions">
          <Link className="pill primary" to="/collections">
            Explore the collections <Arrow />
          </Link>
          <Link className="pill outline" to="/blog">
            Open the designer&apos;s book <Arrow />
          </Link>
        </div>
      </section>
      <Invitation />
    </main>
  )
}

export function BlogPage() {
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Blog / Articles"
        eyebrow="THE MEHRANG JOURNAL"
        title="Ideas for inspired walls."
        copy="Material notes, colour conversations and room inspiration for homeowners, designers and architects."
      />
      <section className="wrap featured-article">
        <img src={`${A}/beaa9.png`} alt="Patterned living room" />
        <div>
          <span className="eyebrow">FEATURED / DESIGN NOTES</span>
          <h2>One room. Many moods.</h2>
          <p>
            A guide to building a wall palette around the light, materials and
            everyday life in your room.
          </p>
          <Link className="pill primary" to="/blog">
            Read the article <Arrow />
          </Link>
        </div>
      </section>
      <section className="wrap article-tools">
        <div>
          {[
            "All articles",
            "Design notes",
            "Materials",
            "Colour stories",
            "Studio journal",
            "For designers",
          ].map((x, i) => (
            <button className={i === 0 ? "active" : ""} key={x}>
              {x}
            </button>
          ))}
        </div>
        <button className="outline-action">Search journal</button>
      </section>
      <section className="wrap article-grid">
        {articles.map((article) => (
          <article key={article.title}>
            <img src={`${A}/${article.image}`} alt="" />
            <span className="card-kicker">{article.label}</span>
            <h3>{article.title}</h3>
            <p>{article.copy}</p>
            <Link to="/blog">
              Read article <Arrow />
            </Link>
          </article>
        ))}
      </section>
      <section className="newsletter">
        <div>
          <span className="eyebrow">STAY INSPIRED</span>
          <h2>Good ideas, worth keeping.</h2>
          <p>
            Receive material stories, new palette inspiration and notes from the
            House of Mehrang studio.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Email address
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <input type="checkbox" /> I would like to receive the House of
            Mehrang journal by email.
          </label>
          <button className="pill primary">
            Subscribe to the journal <Arrow />
          </button>
        </form>
      </section>
    </main>
  )
}

export function ContactPage() {
  const [mode, setMode] = useState("Request samples")
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Contact"
        eyebrow="LET'S FIND YOUR PERFECT WALL"
        title="Begin with a conversation."
        copy="Request samples, share a project or plan a visit to our Mumbai studio. Tell us what you have in mind."
      />
      <section className="wrap contact-layout">
        <div>
          <div className="form-tabs">
            {["Request samples", "Project enquiry", "Studio visit"].map((x) => (
              <button
                className={mode === x ? "active" : ""}
                onClick={() => setMode(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          <h2>Bring the possibilities home.</h2>
          <p>
            Share your contact details and the materials you&apos;d like to
            explore. Fields marked * are required.
          </p>
          {sent ? (
            <div className="form-success large">
              <img src={`${A}/7f038.svg`} alt="" />
              <h3>Thank you for starting a conversation.</h3>
              <p>
                Our Mumbai studio will be in touch about your{" "}
                {mode.toLowerCase()}.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>
                Name *<input required placeholder="Your full name" />
              </label>
              <label>
                Phone *<input required placeholder="Your phone number" />
              </label>
              <label>
                Email *
                <input required type="email" placeholder="you@example.com" />
              </label>
              <label>
                Project type *
                <select>
                  <option>{mode}</option>
                  <option>Residential project</option>
                  <option>Commercial project</option>
                </select>
              </label>
              <label>
                I am a
                <select>
                  <option>Homeowner / Designer / Architect</option>
                </select>
              </label>
              <label>
                Project location
                <input placeholder="City, Maharashtra" />
              </label>
              <label className="span-2">
                Designs or materials of interest
                <input placeholder="e.g. Neel botanica, wallpapers, textured finishes" />
              </label>
              <label className="span-2">
                Message
                <textarea placeholder="Tell us about your wall, room, ideas and timeline..." />
              </label>
              <label className="consent span-2">
                <input type="checkbox" required /> I agree to be contacted by
                House of Mehrang about this enquiry.
              </label>
              <button className="pill primary" type="submit">
                {mode} <Arrow />
              </button>
            </form>
          )}
        </div>
        <aside className="studio-card">
          <img
            src={`${A}/6900b.png`}
            alt="Material consultation at the studio"
          />
          <img className="map-icon" src={`${A}/82929.svg`} alt="" />
          <img className="map-icon-secondary" src={`${A}/e181a.svg`} alt="" />
          <h2>
            Feel it. See it.
            <br />
            Make it yours.
          </h2>
          <p>
            Discover pattern, texture and finish with a material conversation at
            our Mumbai studio.
          </p>
          <hr />
          <p>
            <strong>[Mumbai studio address]</strong>
            <br />
            Mumbai, Maharashtra, India
          </p>
          <p className="contact-lines">
            <span>
              <img src={`${A}/53e12.svg`} alt="" />
              [Phone number]
            </span>
            <span>
              <img src={`${A}/28669.svg`} alt="" />
              [Email address]
            </span>
          </p>
          <Link className="pill outline" to="/contact">
            Book a studio visit <Arrow />
          </Link>
        </aside>
      </section>
      <section className="visit-prep">
        <div className="wrap">
          <span className="eyebrow">
            A LITTLE PREPARATION / A CLEARER CONVERSATION
          </span>
          <h2>Bring your room into the studio.</h2>
          <div>
            {[
              [
                "Your space",
                "Room photographs and rough wall measurements help give the material selection context.",
              ],
              [
                "Your palette",
                "Bring fabric swatches, furniture references or a moodboard to compare colour and texture.",
              ],
              [
                "Your ideas",
                "Share the patterns you love, how the room is used and any project questions you have.",
              ],
            ].map(([t, p]) => (
              <article key={t}>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
