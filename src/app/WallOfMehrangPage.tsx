import { useState, type PointerEvent } from "react"
import { Link } from "react-router"
import { A, products } from "./site-data"
import { PageIntro } from "./SiteLayout"

const roomItems = [
  [
    "Wallpaper",
    "Veil of Spring",
    "A Calm collection pairing with softly layered botanicals.",
    "49.8%",
    "20.8%",
  ],
  [
    "Upholstered seating",
    "Soft upholstered seating",
    "Relaxed linen seating layered with warm, tactile cushions.",
    "26.8%",
    "55.8%",
  ],
  [
    "Tablecloth",
    "Linen tablecloth",
    "Natural linen brings an effortless, softly draped finish.",
    "47.8%",
    "74.8%",
  ],
  [
    "Crockery",
    "Ceramic tea setting",
    "Hand-finished ceramics echo the quiet green tones of the wall.",
    "59.8%",
    "61.8%",
  ],
  [
    "Woven rug",
    "Natural woven rug",
    "An earthy low weave grounds the room and softens the timber floor.",
    "24.8%",
    "87.8%",
  ],
  [
    "Lighting & accessories",
    "Brass floor light",
    "A slender brass light adds height and a softly reflective accent.",
    "86.8%",
    "32.8%",
  ],
]

export default function WallOfMehrangPage() {
  const [active, setActive] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const item = roomItems[active]

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setTilt({ x: (y - 50) * -0.045, y: (x - 50) * 0.055 })
    const nearest = roomItems.reduce(
      (best, roomItem, index) => {
        const distance = Math.hypot(
          x - parseFloat(roomItem[3]),
          y - parseFloat(roomItem[4]),
        )
        return distance < best.distance ? { index, distance } : best
      },
      { index: active, distance: Number.POSITIVE_INFINITY },
    )
    setActive(nearest.index)
  }

  return (
    <main className="wall-page">
      <PageIntro
        breadcrumb="Home / Inspiration / Wall of Mehrang"
        eyebrow="AN INTERACTIVE ROOM"
        title="Wall of Mehrang"
        copy="Move through the room to discover wallpaper, textiles, crockery, furniture and the details that bring a space together."
      />
      <section className="wrap wall-toolbar">
        <div>
          <span>Room mood</span>
          <button className="active">Calm · Living room</button>
          <button>Playful · Family room</button>
        </div>
        <span>Interactive concept room</span>
      </section>
      <section className="wrap wall-explorer">
        <div>
          <div
            className="wall-room"
            onPointerMove={move}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div
              className="wall-room-scene"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`,
              }}
            >
              <img
                src={`${A}/f2b73.png`}
                alt="A calm living room styled with House of Mehrang wallpaper"
              />
              {roomItems.map((roomItem, index) => (
                <button
                  className="wall-hit-area"
                  style={{ left: roomItem[3], top: roomItem[4] }}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  aria-label={`Explore ${roomItem[0]}`}
                  key={roomItem[0]}
                />
              ))}
              <span
                className="wall-focus"
                style={{ left: item[3], top: item[4] }}
              />
              <div className="wall-detail" key={item[0]}>
                <span>{item[0].toUpperCase()} · DISCOVERED</span>
                <h2>{item[1]}</h2>
                <p>{item[2]}</p>
              </div>
            </div>
          </div>
          <p className="wall-note">
            Move through the image, or select an item from the list. Tap targets
            remain available on touch devices.
          </p>
        </div>
        <aside className="wall-panel">
          <h2>In this room</h2>
          <p>Hover, click or tap to explore each detail.</p>
          {roomItems.map((roomItem, index) => (
            <button
              className={active === index ? "active" : ""}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              key={roomItem[0]}
            >
              <strong>{roomItem[0]}</strong>
              <span>{roomItem[1]}</span>
            </button>
          ))}
          <Link to="/wallpapers/veil-of-spring">
            <img
              className="wall-art"
              src={`${A}/88bb3.png`}
              alt="Veil of Spring artwork detail"
            />
          </Link>
          <Link className="pill primary wide" to="/wallpapers/veil-of-spring">
            View this wallpaper{" "}
            <img className="inline-icon" src={`${A}/a028e.svg`} alt="" />
          </Link>
        </aside>
      </section>
      <section className="wall-palette">
        <div className="wrap">
          <div className="split-heading">
            <h2>The art of bringing it together.</h2>
            <p>
              A considered palette of wallpaper, textiles, ceramics and warm
              natural materials.
            </p>
          </div>
          <div className="wall-palette-grid">
            {products.slice(0, 5).map((product) => (
              <Link to={`/wallpapers/${product.slug}`} key={product.slug}>
                <img src={`${A}/${product.image}`} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.collection} collection</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
