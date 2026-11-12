import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react"
import { Link } from "react-router"
import { A, products } from "./site-data"

type Point = { x: number; y: number }

const sampleRooms = [
  ["c4c45.png", "Living room"],
  ["8aa54.png", "Bedroom"],
  ["beaa9.png", "Playroom"],
]

const defaultBoundary: Point[] = [
  { x: 3, y: 3 },
  { x: 97, y: 3 },
  { x: 94, y: 69 },
  { x: 7, y: 72 },
]

export default function ImagineYourWallPage() {
  const [roomImage, setRoomImage] = useState(`${A}/${sampleRooms[0][0]}`)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState<Point[]>(defaultBoundary)
  const [editingWall, setEditingWall] = useState(false)
  const [generated, setGenerated] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showAfter, setShowAfter] = useState(true)
  const [opacity, setOpacity] = useState(72)
  const [scale, setScale] = useState(115)
  const [finish, setFinish] = useState("Signature matte")
  const [collection, setCollection] = useState<"All" | "Calm" | "Playful">(
    "All",
  )
  const visualizerRef = useRef<HTMLDivElement>(null)
  const product = products[selected]

  useEffect(
    () => () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage)
    },
    [uploadedImage],
  )

  const uploadRoom = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (uploadedImage) URL.revokeObjectURL(uploadedImage)
    const nextImage = URL.createObjectURL(file)
    setUploadedImage(nextImage)
    setRoomImage(nextImage)
    setSelectedRoom(-1)
    setPoints([])
    setEditingWall(true)
    setGenerated(false)
  }

  const chooseSampleRoom = (index: number) => {
    setSelectedRoom(index)
    setRoomImage(`${A}/${sampleRooms[index][0]}`)
    setPoints(defaultBoundary)
    setEditingWall(false)
    setGenerated(true)
    setShowAfter(true)
  }

  const markWall = (event: MouseEvent<HTMLDivElement>) => {
    if (!editingWall || points.length >= 4) return
    const rect = event.currentTarget.getBoundingClientRect()
    const point = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
    setPoints((current) => [...current, point])
  }

  const generatePreview = () => {
    if (points.length !== 4) return
    setGenerating(true)
    setShowAfter(false)
    window.setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setEditingWall(false)
      setShowAfter(true)
      visualizerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 900)
  }

  const polygon = points.map((point) => `${point.x}% ${point.y}%`).join(",")
  const visibleProducts = products.filter(
    (item) => collection === "All" || item.collection === collection,
  )

  return (
    <main className="visualizer-page">
      <section className="visualizer-intro wrap">
        <p className="breadcrumb">Home / Inspiration / Imagine Your Wall</p>
        <span className="eyebrow">HOUSE OF MEHRANG WALLPAPER VISUALIZER</span>
        <h1>Find your next wallpaper, in your own room.</h1>
        <p>
          Upload a clear photograph, choose an artwork and create a considered
          preview in seconds.
        </p>
        <div className="visualizer-steps">
          <span><strong>01</strong> Add your room</span>
          <span><strong>02</strong> Choose a design</span>
          <span><strong>03</strong> See the transformation</span>
        </div>
      </section>

      <section className="visualizer-setup wrap">
        <article className="visualizer-upload-card">
          <span className="setup-number">01</span>
          <h2>Upload your room.</h2>
          <p>Use a bright, straight-on photograph where the wall is visible.</p>
          <label className="visualizer-dropzone">
            <img src={`${A}/d552f.svg`} alt="" />
            <strong>Choose a room image</strong>
            <span>JPG or PNG · up to 10 MB</span>
            <input type="file" accept="image/png,image/jpeg" onChange={uploadRoom} />
          </label>
          <div className="sample-room-picker">
            <span>Or begin with a sample room</span>
            <div>
              {sampleRooms.map(([image, name], index) => (
                <button
                  className={selectedRoom === index ? "active" : ""}
                  type="button"
                  onClick={() => chooseSampleRoom(index)}
                  key={name}
                >
                  <img src={`${A}/${image}`} alt="" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="visualizer-design-card">
          <div className="design-card-heading">
            <div>
              <span className="setup-number">02</span>
              <h2>Choose a wallpaper.</h2>
            </div>
            <div className="visualizer-filter">
              {(["All", "Calm", "Playful"] as const).map((name) => (
                <button
                  className={collection === name ? "active" : ""}
                  type="button"
                  onClick={() => setCollection(name)}
                  key={name}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="visualizer-wallpapers">
            {visibleProducts.map((item) => {
              const index = products.findIndex(
                (productItem) => productItem.slug === item.slug,
              )
              return (
                <button
                  className={selected === index ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setSelected(index)
                    if (points.length === 4) setGenerated(true)
                    setShowAfter(true)
                  }}
                  key={item.slug}
                >
                  <img src={`${A}/${item.image}`} alt="" />
                  <span>{item.name}</span>
                  {selected === index && <strong>Selected</strong>}
                </button>
              )
            })}
          </div>
        </article>
      </section>

      <section className="visualizer-studio wrap" ref={visualizerRef}>
        <div className="visualizer-toolbar">
          <div>
            <span className="setup-number">03</span>
            <div>
              <h2>Preview your wall.</h2>
              <p>
                {editingWall
                  ? `Click the four wall corners clockwise · ${points.length}/4 marked`
                  : `${product.name} · ${finish}`}
              </p>
            </div>
          </div>
          <div>
            <button
              className={!showAfter ? "active" : ""}
              type="button"
              onClick={() => setShowAfter(false)}
            >
              Before
            </button>
            <button
              className={showAfter ? "active" : ""}
              type="button"
              onClick={() => setShowAfter(true)}
            >
              After
            </button>
          </div>
        </div>

        <div
          className={`visualizer-canvas ${editingWall ? "is-marking" : ""}`}
          onClick={markWall}
        >
          <img src={roomImage} alt="Room selected for wallpaper preview" />
          {showAfter && generated && points.length === 4 && (
            <div
              className="visualized-wallpaper"
              style={{
                backgroundImage: `url(${A}/${product.image})`,
                backgroundSize: `${scale}px`,
                clipPath: `polygon(${polygon})`,
                opacity: opacity / 100,
              }}
            />
          )}
          {editingWall &&
            points.map((point, index) => (
              <span
                className="wall-corner"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                key={`${point.x}-${point.y}`}
              >
                {index + 1}
              </span>
            ))}
          {generating && (
            <div className="visualizer-generating">
              <span />
              <strong>Styling your wall…</strong>
            </div>
          )}
          {!generated && !editingWall && (
            <div className="visualizer-empty-state">
              <strong>Your room is ready.</strong>
              <span>Mark the wall to begin the preview.</span>
            </div>
          )}
        </div>

        <div className="visualizer-controls">
          <div className="boundary-actions">
            <button
              className="pill outline"
              type="button"
              onClick={() => {
                setPoints([])
                setEditingWall(true)
                setGenerated(false)
              }}
            >
              Mark wall corners
            </button>
            {editingWall && (
              <button
                className="pill primary"
                type="button"
                disabled={points.length !== 4}
                onClick={generatePreview}
              >
                Generate my preview
              </button>
            )}
          </div>
          <label>
            Pattern scale
            <input
              type="range"
              min="70"
              max="230"
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
            />
          </label>
          <label>
            Natural blend
            <input
              type="range"
              min="40"
              max="95"
              value={opacity}
              onChange={(event) => setOpacity(Number(event.target.value))}
            />
          </label>
          <label>
            Material finish
            <select
              value={finish}
              onChange={(event) => setFinish(event.target.value)}
            >
              <option>Signature matte</option>
              <option>Soft linen</option>
              <option>Textured canvas</option>
            </select>
          </label>
        </div>
        <p className="visualizer-disclaimer">
          Digital concept preview only. Pattern scale, wall boundaries, colour
          and texture should be confirmed with a physical sample.
        </p>
      </section>

      <section className="visualizer-result">
        <div className="wrap">
          <div>
            <span className="eyebrow">YOUR SELECTED ARTWORK</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div>
              <Link className="pill primary" to={`/wallpapers/${product.slug}`}>
                View wallpaper details
              </Link>
              <Link className="pill outline" to="/cart">
                Order a sample
              </Link>
            </div>
          </div>
          <img src={`${A}/${product.image}`} alt={`${product.name} artwork`} />
        </div>
      </section>

      <section className="visualizer-how wrap">
        <span className="eyebrow">A BETTER PREVIEW STARTS HERE</span>
        <h2>Three tips for a more useful result.</h2>
        <div>
          {[
            ["01", "Face the wall", "Photograph the wall as straight-on as possible."],
            ["02", "Use natural light", "Avoid heavy shadows and coloured artificial light."],
            ["03", "Include the room", "Furniture helps you judge colour, scale and context."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
