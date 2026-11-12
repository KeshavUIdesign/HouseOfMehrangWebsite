import {
  ChangeEvent,
  KeyboardEvent,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { Link, Navigate, useParams } from "react-router"
import { A, products, type Product } from "./site-data"
import { WhatsAppPrompt } from "./SiteLayout"

const roomSets = [
  {
    name: "A calm beginning",
    mood: "Bedroom · Soft botanicals",
    image: "8aa54.png",
    detail: "03200.png",
    productIndexes: [0, 1, 2],
  },
  {
    name: "The collected living room",
    mood: "Living room · Layered and warm",
    image: "c4c45.png",
    detail: "691f2.png",
    productIndexes: [1, 3, 4],
  },
  {
    name: "A room for stories",
    mood: "Kids room · Playful and bright",
    image: "beaa9.png",
    detail: "45774.png",
    productIndexes: [3, 4, 6],
  },
]

function RoomProduct({
  product,
  onAdd,
}: {
  product: Product
  onAdd: () => void
}) {
  return (
    <article className="room-product-card">
      <Link to={`/wallpapers/${product.slug}`}>
        <img src={`${A}/${product.image}`} alt={`${product.name} wallpaper`} />
      </Link>
      <span>{product.collection.toUpperCase()} · WALLPAPER</span>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button className="outline-action" type="button" onClick={onAdd}>
        Add to room cart
      </button>
    </article>
  )
}

export function ShopTheRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [added, setAdded] = useState<string[]>([])
  const room = roomSets[selectedRoom]
  const roomProducts = room.productIndexes.map((index) => products[index])

  const addProduct = (name: string) =>
    setAdded((current) =>
      current.includes(name) ? current : [...current, name],
    )

  return (
    <main className="shop-room-page">
      <section className="room-film">
        <video autoPlay muted loop playsInline poster={`${A}/c4c45.png`}>
          <source src={`${A}/home-hero.mp4`} type="video/mp4" />
        </video>
        <div className="room-film-shade" />
        <div className="room-film-copy">
          <span>SHOP THE ROOM</span>
          <h1>See it together. Make it yours.</h1>
          <p>
            Step inside complete spaces where wallpaper, fabric and finishing
            details are selected to live beautifully together.
          </p>
          <a className="pill light-pill" href="#room-sets">
            Explore the room sets
          </a>
        </div>
      </section>

      <section className="room-set-selector wrap" id="room-sets">
        <div className="split-heading">
          <h2>Three rooms. Three ways to feel at home.</h2>
          <p>Choose a setting to reveal every product used in the room.</p>
        </div>
        <div>
          {roomSets.map((set, index) => (
            <button
              type="button"
              className={selectedRoom === index ? "active" : ""}
              onClick={() => setSelectedRoom(index)}
              key={set.name}
            >
              <img src={`${A}/${set.image}`} alt="" />
              <span>{set.mood}</span>
              <strong>{set.name}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="selected-room wrap">
        <div className="selected-room-heading">
          <div>
            <span className="eyebrow">ROOM {selectedRoom + 1} / 3</span>
            <h2>{room.name}</h2>
            <p>{room.mood}</p>
          </div>
          <button
            className="pill primary"
            type="button"
            onClick={() =>
              setAdded(roomProducts.map((product) => product.name))
            }
          >
            Add the entire room
          </button>
        </div>
        <div className="room-gallery">
          <div className="room-hero-image">
            <img src={`${A}/${room.image}`} alt={room.name} />
            {roomProducts.map((product, index) => (
              <button
                type="button"
                className={`room-tag room-tag-${index + 1}`}
                onClick={() => addProduct(product.name)}
                key={product.slug}
                aria-label={`Add ${product.name}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <img src={`${A}/${room.detail}`} alt={`${room.name} detail`} />
          <img
            src={`${A}/${roomProducts[0].image}`}
            alt={`${roomProducts[0].name} detail`}
          />
        </div>
      </section>

      <section className="room-products">
        <div className="wrap">
          <div className="room-products-heading">
            <div>
              <span className="eyebrow">EVERY DETAIL, INDIVIDUALLY</span>
              <h2>Products in this room.</h2>
            </div>
            <span>
              {added.length
                ? `${added.length} item${added.length > 1 ? "s" : ""} added`
                : "Select an item or add the full room"}
            </span>
          </div>
          <div className="room-product-grid">
            {roomProducts.map((product) => (
              <RoomProduct
                product={product}
                onAdd={() => addProduct(product.name)}
                key={product.slug}
              />
            ))}
          </div>
          {added.length > 0 && (
            <div className="room-cart-bar">
              <span>{added.join(" · ")}</span>
                <Link className="pill primary" to="/cart">
                View room cart
              </Link>
            </div>
          )}
        </div>
      </section>
      <WhatsAppPrompt />
    </main>
  )
}

export function WallpapersPage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const animationRef = useRef(0)
  const dragStartRef = useRef({ x: 0, scroll: 0 })
  const dragMovedRef = useRef(false)
  const [selectedCard, setSelectedCard] = useState(0)
  const [preview, setPreview] = useState<number | null>(null)
  const [position, setPosition] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const featured = products[selectedCard]
  const maxPosition = products.length - visibleCards

  const cardStep = () => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>(".wallpaper-thumb-card")
    if (!track || !card) return 0
    return card.offsetWidth + Number.parseFloat(getComputedStyle(track).gap || "0")
  }

  const scrollToPosition = (nextPosition: number) => {
    const track = trackRef.current
    if (!track) return
    const next = Math.max(0, Math.min(maxPosition, nextPosition))
    const target = Math.min(
      cardStep() * next,
      track.scrollWidth - track.clientWidth,
    )
    cancelAnimationFrame(animationRef.current)
    setPosition(next)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = target
      return
    }

    const start = track.scrollLeft
    const distance = target - start
    const startedAt = performance.now()
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 450)
      const eased = 1 - Math.pow(1 - progress, 3)
      track.scrollLeft = start + distance * eased
      if (progress < 1) animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  const syncPosition = () => {
    const track = trackRef.current
    const step = cardStep()
    if (!track || !step) return
    setPosition(Math.max(0, Math.min(maxPosition, Math.round(track.scrollLeft / step))))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    scrollToPosition(position + (event.key === "ArrowRight" ? 1 : -1))
  }

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return
    cancelAnimationFrame(animationRef.current)
    dragStartRef.current = {
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
    }
    dragMovedRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add("dragging")
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const distance = event.clientX - dragStartRef.current.x
    if (Math.abs(distance) > 5) dragMovedRef.current = true
    event.currentTarget.scrollLeft = dragStartRef.current.scroll - distance
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    event.currentTarget.classList.remove("dragging")
    const next = Math.max(
      0,
      Math.min(maxPosition, Math.round(event.currentTarget.scrollLeft / cardStep())),
    )
    scrollToPosition(next)
  }

  const openPreview = (index: number) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }
    setSelectedCard(index)
    setPreview(index)
  }

  useEffect(() => {
    const updateVisibleCards = () => {
      const next = window.innerWidth <= 560 ? 1 : window.innerWidth <= 820 ? 2 : 3
      setVisibleCards(next)
      setPosition((current) => Math.min(current, products.length - next))
    }
    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => {
      window.removeEventListener("resize", updateVisibleCards)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const max = products.length - visibleCards
    const next = Math.min(position, max)
    track.scrollLeft = Math.min(
      cardStep() * next,
      track.scrollWidth - track.clientWidth,
    )
  }, [visibleCards])

  useEffect(() => {
    if (preview === null) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const trapFocus = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreview(null)
        return
      }
      if (event.key !== "Tab" || !modalRef.current) return
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", trapFocus)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", trapFocus)
      previouslyFocused?.focus()
    }
  }, [preview])

  return (
    <main className="wallpaper-story-page">
      <section className="wallpaper-canvas">
        <img
          src={`${A}/${featured.image}`}
          alt={`${featured.name} wallpaper`}
        />
        <div className="wallpaper-canvas-shade" />
        <div className="wallpaper-title">
          <span>{featured.collection.toUpperCase()} COLLECTION</span>
          <h1>{featured.name}</h1>
          <p>{featured.description}</p>
        </div>
        <button className="wallpaper-marker marker-one" type="button">
          1<span>View the artwork</span>
        </button>
        <button className="wallpaper-marker marker-two" type="button">
          2<span>See it in a room</span>
        </button>
        <a className="wallpaper-scroll" href="#wallpaper-mockups">
          Scroll to see it styled
        </a>
      </section>

      <section className="wallpaper-mockups wrap" id="wallpaper-mockups">
        <div>
          <span className="eyebrow">SEE THE FULL STORY</span>
          <h2>One artwork. Three moods.</h2>
          <p>
            See how scale, light and surrounding materials change the feeling of
            the same design.
          </p>
        </div>
        <div className="mockup-grid">
          {["35f72.png", "6e81e.png", "fe1b9.png"].map((image, index) => (
            <article key={image}>
              <img src={`${A}/${image}`} alt={`Styled room ${index + 1}`} />
              <span>MOCKUP 0{index + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="wallpaper-library">
        <div className="wrap">
          <div className="wallpaper-library-heading">
            <div>
              <h2>Continue through the collection.</h2>
              <p>
                Browse the seven artworks and tap one to take a closer look.
              </p>
            </div>
            <div className="carousel-controls">
              <div>
                <button
                  type="button"
                  disabled={position === 0}
                  onClick={() => scrollToPosition(position - 1)}
                  aria-label="Previous artwork"
                >
                  <img src={`${A}/f912f.svg`} alt="" />
                </button>
                <button
                  type="button"
                  disabled={position === maxPosition}
                  onClick={() => scrollToPosition(position + 1)}
                  aria-label="Next artwork"
                >
                  <img src={`${A}/cc98d.svg`} alt="" />
                </button>
              </div>
            </div>
          </div>
          <div
            className="wallpaper-thumb-carousel"
            role="region"
            aria-label="Continue through the seven artwork collection"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <div
              className="wallpaper-thumb-track"
              ref={trackRef}
              onScroll={syncPosition}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
            {products.map((product, index) => (
              <button
                type="button"
                className={`wallpaper-thumb-card${
                  selectedCard === index ? " active" : ""
                }`}
                aria-label={`Preview artwork ${String(index + 1).padStart(2, "0")}, ${product.name}`}
                aria-pressed={selectedCard === index}
                onClick={() => openPreview(index)}
                key={product.slug}
              >
                <img
                  src={`${A}/${product.image}`}
                  alt={`${product.name} wallpaper artwork`}
                  draggable={false}
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{product.name}</strong>
              </button>
            ))}
            </div>
          </div>
          <div className="wallpaper-carousel-dots" aria-label="Carousel positions">
            {Array.from({ length: maxPosition + 1 }, (_, index) => (
              <button
                className={position === index ? "active" : ""}
                type="button"
                aria-label={`Go to carousel position ${index + 1}`}
                aria-current={position === index}
                onClick={() => scrollToPosition(index)}
                key={index}
              />
            ))}
          </div>
          <div className="wallpaper-library-action">
            <Link className="pill primary" to="/shop">
              Shop all wallpapers
            </Link>
            <Link className="pill outline" to="/contact">
              Request samples
            </Link>
          </div>
        </div>
      </section>
      {preview !== null && (
        <div
          className="artwork-lightbox-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreview(null)
          }}
        >
          <div
            className="artwork-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="artwork-lightbox-title"
            ref={modalRef}
          >
            <img
              src={`${A}/${products[preview].image}`}
              alt={`${products[preview].name} wallpaper artwork`}
            />
            <div className="artwork-lightbox-copy">
              <span>{products[preview].collection} collection</span>
              <h2 id="artwork-lightbox-title">{products[preview].name}</h2>
              <p>{products[preview].description}</p>
              <div>
                <Link className="pill primary" to="/contact">
                  Request this sample
                </Link>
                <button
                  className="pill outline"
                  type="button"
                  onClick={() => setPreview(null)}
                  ref={closeRef}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <WhatsAppPrompt />
    </main>
  )
}

const productGalleryImages = [
  "35f72.png",
  "6e81e.png",
  "fe1b9.png",
  "c4c45.png",
  "beaa9.png",
]

const productDetails = [
  {
    title: "Product details",
    copy: "A premium, digitally printed wallpaper with a refined matte finish. Designed for rich colour, crisp detail and a calm presence in the room.",
  },
  {
    title: "Installation",
    copy: "Professional installation is recommended. Walls should be smooth, dry, primed and free from dust before application.",
  },
  {
    title: "Shipping & care",
    copy: "Samples dispatch in 3–5 working days. Full orders are produced to specification. Gently wipe with a clean, slightly damp cloth.",
  },
  {
    title: "Returns & exchanges",
    copy: "Samples are non-returnable. Made-to-order wallpaper can only be replaced when it arrives damaged or differs from the confirmed specification.",
  },
]

export function WallpaperProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [colour, setColour] = useState(0)
  const [size, setSize] = useState("Standard roll")
  const [texture, setTexture] = useState("Signature matte")
  const [quantity, setQuantity] = useState(1)
  const [openDetail, setOpenDetail] = useState(0)
  const [roomPreview, setRoomPreview] = useState<string | null>(null)

  useEffect(
    () => () => {
      if (roomPreview) URL.revokeObjectURL(roomPreview)
    },
    [roomPreview],
  )

  if (!product) return <Navigate to="/wallpapers" replace />

  const gallery = [
    product.image,
    ...productGalleryImages.filter((image) => image !== product.image),
  ]
  const related = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3)

  const uploadRoom = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (roomPreview) URL.revokeObjectURL(roomPreview)
    setRoomPreview(URL.createObjectURL(file))
  }

  return (
    <main className="wallpaper-product-page">
      <div className="product-breadcrumb wrap">
        <Link to="/wallpapers">Wallpapers</Link>
        <span>/</span>
        <span>{product.collection}</span>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="product-detail-layout wrap">
        <div className="product-gallery">
          <div className="product-thumbnails">
            {gallery.map((image, index) => (
              <button
                className={galleryIndex === index ? "active" : ""}
                type="button"
                onClick={() => setGalleryIndex(index)}
                key={`${image}-${index}`}
              >
                <img src={`${A}/${image}`} alt="" />
              </button>
            ))}
          </div>
          <div className="product-gallery-main">
            <img
              src={`${A}/${gallery[galleryIndex]}`}
              alt={`${product.name} view ${galleryIndex + 1}`}
            />
            <span>VIEW {galleryIndex + 1} / {gallery.length}</span>
          </div>
        </div>

        <aside className="product-buy-panel">
          <span className="eyebrow">
            {product.collection.toUpperCase()} COLLECTION
          </span>
          <h1>{product.name}</h1>
          <p className="product-illustration">
            An original House of Mehrang illustration, composed to give the
            wall something beautiful to say.
          </p>
          <p>{product.description}</p>
          <strong className="product-price">
            From ₹{product.price.toLocaleString("en-IN")}
          </strong>

          <fieldset>
            <legend>Colour option</legend>
            <div className="colour-options">
              {["Blush", "Sage", "Sand"].map((name, index) => (
                <button
                  className={colour === index ? "active" : ""}
                  type="button"
                  onClick={() => setColour(index)}
                  aria-label={name}
                  key={name}
                />
              ))}
            </div>
          </fieldset>

          <div className="product-selectors">
            <label>
              Size
              <select value={size} onChange={(event) => setSize(event.target.value)}>
                <option>Standard roll</option>
                <option>Custom wall size</option>
                <option>Sample swatch</option>
              </select>
            </label>
            <label>
              Texture
              <select
                value={texture}
                onChange={(event) => setTexture(event.target.value)}
              >
                <option>Signature matte</option>
                <option>Soft linen</option>
                <option>Textured canvas</option>
              </select>
            </label>
          </div>

          <div className="quantity-row">
            <span>Quantity</span>
            <div>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <strong>{quantity}</strong>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>
          </div>

          <Link className="pill primary wide" to="/cart">
            Add to bag
          </Link>
          <Link className="pill sample-button wide" to="/cart">
            Order a sample first · ₹{product.price}
          </Link>
          <a
            className="product-expert-link"
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
          >
            Still unsure what to buy? Ask our wall experts
          </a>
        </aside>
      </section>

      <section className="wall-preview-section">
        <div className="wrap">
          <div>
            <span className="eyebrow">SEE IT ON YOUR WALL</span>
            <h2>Try the design in your own room.</h2>
            <p>
              Upload a photograph of your wall to create a quick visual
              reference before ordering samples.
            </p>
            <label className="pill primary upload-preview">
              Upload a room photo
              <input type="file" accept="image/*" onChange={uploadRoom} />
            </label>
          </div>
          <div className="wall-preview-canvas">
            {roomPreview ? (
              <>
                <img src={roomPreview} alt="Your uploaded room" />
                <div
                  className="preview-wallpaper"
                  style={{ backgroundImage: `url(${A}/${product.image})` }}
                />
              </>
            ) : (
              <>
                <img src={`${A}/c4c45.png`} alt="Example styled room" />
                <div
                  className="preview-wallpaper"
                  style={{ backgroundImage: `url(${A}/${product.image})` }}
                />
                <span>Example preview</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="product-information wrap">
        <div className="product-accordions">
          {productDetails.map((detail, index) => (
            <article className={openDetail === index ? "open" : ""} key={detail.title}>
              <button
                type="button"
                onClick={() => setOpenDetail(openDetail === index ? -1 : index)}
              >
                <span>{detail.title}</span>
                <strong>{openDetail === index ? "−" : "+"}</strong>
              </button>
              {openDetail === index && <p>{detail.copy}</p>}
            </article>
          ))}
        </div>
        <aside className="measurement-card">
          <span className="eyebrow">MEASURE WITH CONFIDENCE</span>
          <h2>How to measure your wall.</h2>
          <p>
            Measure the full width and height, including doors and windows. Our
            studio can confirm final quantities and pattern allowance.
          </p>
          <Link className="pill outline" to="/imagine-your-wall">
            Open the wall estimator
          </Link>
        </aside>
      </section>

      <section className="product-testimonials">
        <div className="wrap">
          <span className="eyebrow">LIVED WITH, LOVED DAILY</span>
          <h2>What our clients say.</h2>
          <div>
            {[
              "The sample made the decision easy. The colour changes beautifully through the day.",
              "The team helped us with scale and quantity, and the finished wall feels completely ours.",
              "Detailed, playful and still peaceful. It transformed the room without overwhelming it.",
            ].map((quote, index) => (
              <blockquote key={quote}>
                <span>★★★★★</span>
                <p>“{quote}”</p>
                <cite>House of Mehrang client · 0{index + 1}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="related-products wrap">
        <div className="split-heading">
          <h2>You may also like.</h2>
          <Link to="/wallpapers">View all wallpapers</Link>
        </div>
        <div>
          {related.map((item) => (
            <Link to={`/wallpapers/${item.slug}`} key={item.slug}>
              <img src={`${A}/${item.image}`} alt={`${item.name} wallpaper`} />
              <span>{item.collection.toUpperCase()}</span>
              <h3>{item.name}</h3>
              <p>From ₹{item.price}</p>
            </Link>
          ))}
        </div>
      </section>
      <WhatsAppPrompt />
    </main>
  )
}
