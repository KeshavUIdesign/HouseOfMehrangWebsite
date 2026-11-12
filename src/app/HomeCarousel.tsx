import { KeyboardEvent, useState } from "react"
import { Link } from "react-router"
import { A } from "./site-data"

const collectionPanels = [
  {
    image: "8aa54.webp",
    title: "Wallpapers",
    copy: "Pattern with possibility",
    to: "/wallpapers",
  },
  {
    image: "f8750.webp",
    title: "Wall panels",
    copy: "Architectural depth, beautifully made",
    to: "/shop",
  },
  {
    image: "f8d45.webp",
    title: "Textured finishes",
    copy: "Quiet character you can feel",
    to: "/fabrics",
  },
  {
    image: "45774.webp",
    title: "Custom prints",
    copy: "Your vision, made for your walls",
    to: "/contact",
  },
]

export default function HomeCarousel() {
  const [activePanel, setActivePanel] = useState(0)

  const selectPanel = (index: number) => {
    setActivePanel(Math.max(0, Math.min(collectionPanels.length - 1, index)))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    selectPanel(activePanel + (event.key === "ArrowRight" ? 1 : -1))
  }

  return (
    <div className="home-carousel">
      <div className="carousel-controls">
        <span>Scroll to explore</span>
        <div>
          <button
            type="button"
            disabled={activePanel === 0}
            onClick={() => selectPanel(activePanel - 1)}
            aria-label="Previous collection"
          >
            <img src={`${A}/f912f.svg`} alt="" />
          </button>
          <button
            type="button"
            disabled={activePanel === collectionPanels.length - 1}
            onClick={() => selectPanel(activePanel + 1)}
            aria-label="Next collection"
          >
            <img src={`${A}/cc98d.svg`} alt="" />
          </button>
        </div>
      </div>

      <div
        className="collection-panels"
        role="region"
        aria-label="Explore wall collections"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {collectionPanels.map((panel, index) => {
          const active = activePanel === index
          const number = String(index + 1).padStart(2, "0")

          return (
            <article
              className={`collection-panel${active ? " active" : ""}`}
              onMouseEnter={() => {
                if (window.matchMedia("(hover: hover)").matches)
                  selectPanel(index)
              }}
              key={panel.title}
            >
              <button
                className="collection-panel-trigger"
                type="button"
                onClick={() => selectPanel(index)}
                aria-label={`Show ${panel.title} collection`}
                aria-pressed={active}
              >
                <span
                  className="collection-panel-media"
                  data-panel-depth={0.8 + index * 0.11}
                >
                  <img
                    src={`${A}/${panel.image}`}
                    alt={`${panel.title} interior inspiration`}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="collection-panel-shade" />
                <span className="collection-panel-number">{number}</span>
                <span className="collection-panel-vertical-title">
                  {panel.title}
                </span>
                <span className="collection-panel-copy">
                  <strong>{panel.title}</strong>
                  <small>{panel.copy}</small>
                </span>
              </button>
              {active && (
                <Link
                  className="collection-panel-link"
                  to={panel.to}
                  aria-label={`Explore ${panel.title}`}
                >
                  <img src={`${A}/a028e.svg`} alt="" />
                </Link>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
