import { useState, type PointerEvent } from "react"

const assetPath = "/assets"

const roomItems = [
  {
    number: "01",
    name: "Wallpaper",
    title: "Veil of Spring",
    detail: "A Calm collection pairing. Room pattern is conceptual.",
    meta: "House of Mehrang · Calm",
    position: { left: "49.8%", top: "20.8%" },
  },
  {
    number: "02",
    name: "Upholstered seating",
    title: "Soft upholstered seating",
    detail: "A relaxed linen sofa layered with warm, tactile cushions.",
    meta: "Furniture · Styling inspiration",
    position: { left: "26.8%", top: "55.8%" },
  },
  {
    number: "03",
    name: "Tablecloth",
    title: "Linen tablecloth",
    detail:
      "Softly draped natural linen brings an effortless finish to the room.",
    meta: "Textile · Styling inspiration",
    position: { left: "47.8%", top: "74.8%" },
  },
  {
    number: "04",
    name: "Crockery",
    title: "Ceramic tea setting",
    detail: "Hand-finished ceramics echo the quiet green tones of the wall.",
    meta: "Crockery · Styling inspiration",
    position: { left: "59.8%", top: "61.8%" },
  },
  {
    number: "05",
    name: "Woven rug",
    title: "Natural woven rug",
    detail:
      "A low, earthy weave grounds the room and softens the timber floor.",
    meta: "Textile · Styling inspiration",
    position: { left: "24.8%", top: "87.8%" },
  },
  {
    number: "06",
    name: "Lighting & accessories",
    title: "Brass floor light",
    detail: "A slender brass light adds height and a softly reflective accent.",
    meta: "Furniture · Styling inspiration",
    position: { left: "86.8%", top: "32.8%" },
  },
]

const menuGroups = [
  {
    title: "By Style",
    links: [
      "All Wallpapers",
      "Botanical & Floral",
      "Geometric & Abstract",
      "Heritage & Craft",
      "Textured & Woven",
      "Mural & Scenic",
      "Minimalist & Plain",
    ],
  },
  {
    title: "By Room",
    links: [
      "Bedrooms",
      "Living Rooms",
      "Kids & Nursery",
      "Pooja Room",
      "Home Office",
      "Commercial",
      "Powder Room",
      "All Rooms",
    ],
  },
  {
    title: "Designs",
    links: [
      "Veil of Spring",
      "Lavender Hush",
      "Jungle Jamboree",
      "Soft Unfurl",
      "Little Wanderers",
      "Little Mischief",
    ],
  },
]

const palette = [
  ["88bb3.png", "Veil of Spring", "House of Mehrang · Calm"],
  ["35f72.png", "Soft upholstered seating", "Styling inspiration"],
  ["e03cc.png", "Linen tablecloth", "Styling inspiration"],
  ["fe1b9.png", "Ceramic tea setting", "Styling inspiration"],
  ["6e81e.png", "Woven rug & brass light", "Styling inspiration"],
]

function IconButton({ src, label }: { src: string; label: string }) {
  return (
    <button className="icon-button" type="button" aria-label={label}>
      <img src={`${assetPath}/${src}`} alt="" />
    </button>
  )
}

function MegaMenu() {
  return (
    <div className="mega-menu" id="shop-menu">
      <div className="mega-menu-inner">
        {menuGroups.map((group, groupIndex) => (
          <div className="menu-column" key={group.title}>
            <b>{group.title}</b>
            <div>
              {group.links.map((link, index) => (
                <a
                  className={
                    groupIndex === 0 && index === 0 ? "featured-link" : ""
                  }
                  href="#palette"
                  key={link}
                >
                  {link}
                </a>
              ))}
            </div>
            {groupIndex === 2 && (
              <a className="view-all" href="#palette">
                View all collections
                <img src={`${assetPath}/2a32c.svg`} alt="" />
              </a>
            )}
          </div>
        ))}
        <div className="menu-feature">
          <b>Featured</b>
          <a className="menu-feature-card" href="#sample">
            <div className="menu-feature-image">
              <img
                src={`${assetPath}/ba47b.png`}
                alt="Sweet Escape wallpaper artwork"
              />
              <span>Playful</span>
            </div>
            <div className="menu-feature-copy">
              <h2>Sweet Escape</h2>
              <p>Playful · Wallpaper artwork</p>
              <strong>
                Request a sample
                <img src={`${assetPath}/2a32c.svg`} alt="" />
              </strong>
            </div>
          </a>
          <small>Supplied wallpaper artwork</small>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [cursor, setCursor] = useState({ x: 50, y: 50, visible: false })
  const item = roomItems[active]

  const handleRoomMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -2.6, y: x * 3.2 })
    const pointerX = (x + 0.5) * 100
    const pointerY = (y + 0.5) * 100
    setCursor({ x: pointerX, y: pointerY, visible: true })

    const nearest = roomItems.reduce(
      (best, roomItem, index) => {
        const dx = pointerX - parseFloat(roomItem.position.left)
        const dy = pointerY - parseFloat(roomItem.position.top)
        const distance = Math.hypot(dx, dy)
        return distance < best.distance ? { index, distance } : best
      },
      { index: active, distance: Number.POSITIVE_INFINITY },
    )
    setActive(nearest.index)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Wall of Mehrang",
        url: window.location.href,
      })
    } else {
      await navigator.clipboard?.writeText(window.location.href)
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="House of Mehrang home">
          <img src={`${assetPath}/ef0f6.png`} alt="House of Mehrang" />
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <div
            className={`shop-menu-trigger ${menuOpen ? "is-open" : ""}`}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="shop-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Shop <span aria-hidden="true" />
            </button>
            <MegaMenu />
          </div>
          <a href="#palette">Collections</a>
          <a href="#about">About Mehrang</a>
          <a href="#journal">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <a className="button button-light" href="#sample">
            Request samples
            <img src={`${assetPath}/6c0ef.svg`} alt="" />
          </a>
          <IconButton src="bc20d.svg" label="Shopping bag" />
          <IconButton src="0484c.svg" label="Customer account" />
        </div>
      </header>

      <section className="intro">
        <div className="breadcrumb">Home / Inspiration / Wall of Mehrang</div>
        <div className="intro-row">
          <div>
            <span className="eyebrow-line" />
            <h1>Wall of Mehrang</h1>
            <p>
              A room, thoughtfully brought together. Explore the wall, the
              textures and the little details that make a space feel like home.
            </p>
          </div>
          <div className="page-actions">
            <button
              className={`outline-button ${saved ? "is-saved" : ""}`}
              onClick={() => setSaved(!saved)}
              type="button"
            >
              {saved ? "Room saved" : "Save room"}
              <img src={`${assetPath}/67a9a.svg`} alt="" />
            </button>
            <button className="outline-button" onClick={share} type="button">
              Share
              <img src={`${assetPath}/90df3.svg`} alt="" />
            </button>
          </div>
        </div>

        <div className="room-choices">
          <div className="moods">
            <span>Room mood</span>
            <button className="mood active" type="button">
              Calm · Living room
            </button>
            <button className="mood" type="button">
              Playful · Family room
            </button>
          </div>
          <span className="concept-label">
            Concept room · Interactive exploration
          </span>
        </div>

        <div className="explorer">
          <div className="room-column">
            <div
              className="room-stage"
              onPointerMove={handleRoomMove}
              onPointerEnter={() =>
                setCursor((value) => ({ ...value, visible: true }))
              }
              onPointerLeave={() => {
                setTilt({ x: 0, y: 0 })
                setCursor((value) => ({ ...value, visible: false }))
              }}
            >
              <div
                className="room-scene"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.018)`,
                }}
              >
                <div className="room-drift">
                  <img
                    className="room-image"
                    src={`${assetPath}/f2b73.png`}
                    alt="A calm living room styled with House of Mehrang wallpaper"
                  />
                </div>
                <div className="room-light" />
                {roomItems.map((roomItem, index) => (
                  <button
                    className="discovery-zone"
                    style={roomItem.position}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    type="button"
                    aria-label={`View ${roomItem.name} details`}
                    aria-pressed={active === index}
                    key={roomItem.number}
                  />
                ))}
                <div
                  className={`room-cursor ${
                    cursor.visible ? "is-visible" : ""
                  }`}
                  style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
                />
                <div
                  className="focus-orb"
                  style={item.position}
                  aria-hidden="true"
                >
                  <span />
                </div>
                <div
                  className="floating-detail"
                  key={item.name}
                  aria-live="polite"
                >
                  <span>{item.name.toUpperCase()} · DISCOVERED</span>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
              </div>
              <div className="drag-hint">Move through the room to discover</div>
            </div>
            <p className="room-note">
              Move through the room and pause over an object to reveal its
              story. Click or tap any area to keep its details open.
            </p>
          </div>

          <aside className="item-panel" aria-label="Room items">
            <h2>In this room</h2>
            <p className="panel-intro">
              Hover, click or tap to explore an item
            </p>
            <div className="item-list">
              {roomItems.map((roomItem, index) => (
                <button
                  className={`item-choice ${active === index ? "active" : ""}`}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  type="button"
                  aria-pressed={active === index}
                  key={roomItem.number}
                >
                  <span>
                    <b>{roomItem.name}</b>
                    <small>{roomItem.meta}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="selected-art">
              <img
                src={`${assetPath}/88bb3.png`}
                alt="Veil of Spring wallpaper artwork detail"
              />
            </div>
            <p className="selected-copy">
              <strong>{item.title}</strong>
              <br />
              {item.detail}
            </p>
            <a className="button button-primary" href="#sample">
              {active === 0
                ? "Request wallpaper sample"
                : "Explore the pairing"}
              <img src={`${assetPath}/a028e.svg`} alt="" />
            </a>
          </aside>
        </div>
      </section>

      <section className="palette" id="palette">
        <div className="section-heading">
          <h2>The art of bringing it together.</h2>
          <span>A considered palette / 5 pairings</span>
        </div>
        <div className="palette-grid">
          {palette.map(([image, name, meta]) => (
            <article className="palette-card" key={name}>
              <img src={`${assetPath}/${image}`} alt="" />
              <h3>{name}</h3>
              <p>{meta}</p>
            </article>
          ))}
        </div>
        <p className="disclaimer">
          Furniture, textiles, crockery and accessories are styling inspiration
          only, not confirmed House of Mehrang products. No prices or vendor
          links are implied.
        </p>
      </section>

      <footer id="contact">
        <div className="footer-grid">
          <div className="footer-brand" id="about">
            <img src={`${assetPath}/6710d.png`} alt="House of Mehrang" />
            <p>
              Walls with character. Spaces with soul.
              <br />
              Mumbai, Maharashtra, India.
            </p>
            <span>◇&nbsp;&nbsp;◇&nbsp;&nbsp;◇&nbsp;&nbsp;◇</span>
          </div>
          <div className="footer-links" id="journal">
            <b>EXPLORE</b>
            <a href="#">Wallpapers</a>
            <a href="#">Wall panels</a>
            <a href="#">For designers</a>
            <a href="#">Studio</a>
            <a href="#sample">Request samples</a>
          </div>
          <div>
            <b className="footer-label">STAY INSPIRED</b>
            <div className="socials">
              <IconButton src="d349a.svg" label="Instagram" />
              <IconButton src="f895c.svg" label="Facebook" />
              <IconButton src="fc2dd.svg" label="LinkedIn" />
            </div>
            <p className="contact-copy">
              Mumbai studio
              <br />
              By appointment
              <br />
              hello@houseofmehrang.com
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© House of Mehrang. All rights reserved.</span>
          <span>Thoughtfully curated in Mumbai.</span>
        </div>
      </footer>
      <div id="sample" />
    </main>
  )
}
