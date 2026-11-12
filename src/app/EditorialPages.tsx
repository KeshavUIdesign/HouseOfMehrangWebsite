import { useState } from "react"
import { Link } from "react-router"
import { A } from "./site-data"
import { WhatsAppPrompt } from "./SiteLayout"

const fabricCategories = {
  Cushions: [
    ["03200.png", "Dawn Garden Cushion", "₹2,850"],
    ["3bd24.png", "Soft Unfurl Cushion", "₹2,650"],
    ["45774.png", "Playful Path Cushion", "₹2,950"],
  ],
  Curtains: [
    ["8aa54.png", "Veil of Spring Curtain", "₹4,800"],
    ["f8d45.png", "Quiet Weave Curtain", "₹5,200"],
    ["691f2.png", "Botanical Dusk Curtain", "₹5,450"],
  ],
  Upholstery: [
    ["6900b.png", "Mehrang Studio Weave", "₹3,900"],
    ["f8750.png", "Linear Rhythm Fabric", "₹4,100"],
    ["0c14d.png", "Soft Field Upholstery", "₹3,750"],
  ],
}

export function FabricsPage() {
  const [category, setCategory] =
    useState<keyof typeof fabricCategories>("Cushions")
  const [selected, setSelected] = useState(0)
  const [size, setSize] = useState("16 × 16 in")
  const [quantity, setQuantity] = useState(1)
  const items = fabricCategories[category]
  const product = items[selected]

  return (
    <main className="fabrics-page">
      <section className="fabric-intro wrap">
        <span className="eyebrow">FABRICS & MORE</span>
        <h1>Pattern that moves through the room.</h1>
        <p>
          Cushions, curtains and upholstery designed to pair naturally with the
          House of Mehrang wallpaper collection.
        </p>
      </section>

      <section className="fabric-shop wrap">
        <aside className="fabric-category-list">
          {(Object.keys(fabricCategories) as (keyof typeof fabricCategories)[]).map(
            (name) => (
              <button
                className={category === name ? "active" : ""}
                type="button"
                onClick={() => {
                  setCategory(name)
                  setSelected(0)
                }}
                key={name}
              >
                <span>{name}</span>
                <strong>0{Object.keys(fabricCategories).indexOf(name) + 1}</strong>
              </button>
            ),
          )}
        </aside>

        <div className="fabric-gallery">
          <div className="fabric-gallery-main">
            <img src={`${A}/${product[0]}`} alt={product[1]} />
          </div>
          <div>
            {items.map((item, index) => (
              <button
                className={selected === index ? "active" : ""}
                type="button"
                onClick={() => setSelected(index)}
                key={item[1]}
              >
                <img src={`${A}/${item[0]}`} alt="" />
              </button>
            ))}
          </div>
        </div>

        <aside className="fabric-buy-panel">
          <span className="eyebrow">{category.toUpperCase()}</span>
          <h2>{product[1]}</h2>
          <p>
            A tactile statement piece made to bring colour, comfort and
            continuity into your room.
          </p>
          <strong>{product[2]}</strong>
          <fieldset>
            <legend>Available sizes</legend>
            <div className="fabric-size-options">
              {["16 × 16 in", "18 × 18 in", "20 × 20 in"].map((option) => (
                <button
                  className={size === option ? "active" : ""}
                  type="button"
                  onClick={() => setSize(option)}
                  key={option}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
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
          <Link className="pill outline wide" to="/checkout">
            Buy it now
          </Link>
          <div className="pairs-well">
            <span>PAIRS WELL WITH</span>
            <div>
              <Link to="/wallpapers/veil-of-spring">
                <img src={`${A}/88bb3.png`} alt="" />
                Veil of Spring
              </Link>
              <Link to="/wallpapers/soft-unfurl">
                <img src={`${A}/f0b0a.png`} alt="" />
                Soft Unfurl
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="fabric-service-band">
        <div className="wrap">
          {[
            ["Why you’ll love it", "Original artwork and considered material."],
            ["Shipping", "Carefully packed and dispatched from Mumbai."],
            ["Returns & exchange", "Clear support for every eligible order."],
            ["Care & maintenance", "Simple guidance to keep it beautiful."],
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <WhatsAppPrompt />
    </main>
  )
}

export function TradeProgrammePage() {
  return (
    <main className="trade-page">
      <section className="trade-hero">
        <img src={`${A}/6900b.png`} alt="Designer arranging material samples" />
        <div>
          <span>THE DESIGNER&apos;S DESK</span>
          <h1>Built for the way you design.</h1>
          <p>
            For architects, interior designers and design professionals who
            need a clearer, faster path from room concept to final material.
          </p>
          <Link className="pill light-pill" to="/contact">
            Apply to the trade programme
          </Link>
        </div>
      </section>

      <section className="trade-manifesto wrap">
        <span className="eyebrow">LESS SEARCHING. MORE DESIGNING.</span>
        <h2>
          You know the design is yours.
          <br />
          We are here to make finding the pieces easier.
        </h2>
      </section>

      <section className="trade-planning">
        <div className="wrap">
          <div>
            <span className="eyebrow light">BEGIN WITH A PROJECT ROOM</span>
            <h2>Build one project inventory, one room at a time.</h2>
            <p>
              Save wallpapers, fabrics and samples into a shared specification
              set that stays easy to review.
            </p>
            <Link className="pill light-pill" to="/contact">
              Start a project conversation
            </Link>
          </div>
          <div className="project-board">
            <span>MENTOR RESIDENCE · LIVING ROOM</span>
            {[
              ["88bb3.png", "Veil of Spring", "Wallpaper"],
              ["03200.png", "Dawn Garden", "Cushion"],
              ["f8d45.png", "Quiet Weave", "Curtain"],
            ].map(([image, name, type]) => (
              <article key={name}>
                <img src={`${A}/${image}`} alt="" />
                <div>
                  <strong>{name}</strong>
                  <span>{type}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trade-tools wrap">
        {[
          ["Download mockups", "Bring the whole visual set into presentations."],
          ["Share a room link", "Review a complete room with clients and teams."],
          ["Order samples together", "Create one considered material delivery."],
          ["Confirm specifications", "Discuss changes directly with the studio."],
        ].map(([title, copy], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="designer-desk">
        <div className="wrap">
          <span className="eyebrow light">THE DESIGNER&apos;S DESK</span>
          <h2>A direct line to material guidance.</h2>
          <p>
            Share specifications, update quantities and resolve project
            questions with the House of Mehrang studio on WhatsApp.
          </p>
          <a
            className="pill light-pill"
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
          >
            Message the designer&apos;s desk
          </a>
        </div>
      </section>
    </main>
  )
}
