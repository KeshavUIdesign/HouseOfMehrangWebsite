import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router"
import { A, products } from "./site-data"

function WallpaperMenu() {
  return (
    <div className="site-mega">
      <div className="site-mega-grid">
        <div>
          <b>Shop by mood</b>
          {[
            "Calm & quiet",
            "Playful & curious",
            "Warm & cocooning",
            "Bold & expressive",
          ].map((item) => (
            <Link to="/wallpapers" key={item}>
              {item}
            </Link>
          ))}
        </div>
        <div>
          <b>Shop by room</b>
          {[
            "Bedrooms",
            "Living rooms",
            "Kids & nursery",
            "Pooja room",
            "Home office",
          ].map((item) => (
            <Link to="/wallpapers" key={item}>
              {item}
            </Link>
          ))}
        </div>
        <div>
          <b>Shop by theme</b>
          {["Botanical", "Scenic", "Illustrative", "Minimal", "Textured"].map(
            (item) => (
              <Link to="/wallpapers" key={item}>
                {item}
              </Link>
            ),
          )}
        </div>
        <Link className="site-mega-feature" to="/wallpapers">
          <img src={`${A}/ba47b.png`} alt="Sweet Escape wallpaper artwork" />
          <span>PLAYFUL</span>
          <strong>Find your wallpaper</strong>
          <small>Explore every mood, room and story</small>
        </Link>
      </div>
    </div>
  )
}

function FabricsMenu() {
  return (
    <div className="site-mega compact-mega">
      <div className="site-mega-grid">
        <div>
          <b>Fabrics & more</b>
          {["Custom fabrics", "Upholstery", "Cushions", "Curtains"].map(
            (item) => (
              <Link to="/fabrics" key={item}>
                {item}
              </Link>
            ),
          )}
        </div>
        <div>
          <b>Table & window</b>
          {["Table runners", "Curtain ties", "Sheers", "Made to measure"].map(
            (item) => (
              <Link to="/fabrics" key={item}>
                {item}
              </Link>
            ),
          )}
        </div>
        <Link className="site-mega-feature" to="/fabrics">
          <img
            src={`${A}/f8d45.png`}
            alt="Layered fabric and material samples"
          />
          <span>BESPOKE</span>
          <strong>Made around your room</strong>
          <small>Speak with our Mumbai studio</small>
        </Link>
      </div>
    </div>
  )
}

export function Header({
  overlay = false,
  dark = false,
}: {
  overlay?: boolean
  dark?: boolean
}) {
  const [menu, setMenu] = useState<"wallpapers" | "fabrics" | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  useEffect(() => {
    if (!searchOpen) setQuery("")
  }, [searchOpen])

  return (
    <div
      className={`header-stack ${overlay ? "overlay-stack" : ""} ${
        dark ? "dark-stack" : ""
      }`}
    >
      <div className="announcement-bar">
        <span>Complimentary design guidance for your first wall</span>
        <Link to="/contact">Request samples</Link>
      </div>
      <header
        className={`global-header ${overlay ? "header-overlay" : ""} ${
          dark ? "header-dark" : ""
        }`}
      >
        <Link className="global-logo" to="/">
          <img src={`${A}/ef0f6.png`} alt="House of Mehrang" />
        </Link>
        <nav className="global-nav" aria-label="Main navigation">
          <button
            className="nav-search"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            <img src={`${A}/70dff.svg`} alt="" />
            Search
          </button>
          <NavLink to="/shop-the-room">Shop the Room</NavLink>
          <div
            className="nav-shop"
            onMouseEnter={() => setMenu("wallpapers")}
            onMouseLeave={() => setMenu(null)}
          >
            <NavLink to="/wallpapers" onFocus={() => setMenu("wallpapers")}>
              Wallpapers
            </NavLink>
            {menu === "wallpapers" && <WallpaperMenu />}
          </div>
          <div
            className="nav-shop"
            onMouseEnter={() => setMenu("fabrics")}
            onMouseLeave={() => setMenu(null)}
          >
            <NavLink to="/fabrics" onFocus={() => setMenu("fabrics")}>
              Fabrics & more
            </NavLink>
            {menu === "fabrics" && <FabricsMenu />}
          </div>
          <NavLink to="/contact">Contact us</NavLink>
        </nav>
        <div className="global-actions">
          <Link className="utility-link" to="/trade">
            Trade
          </Link>
          <Link className="utility-link" to="/about">
            About
          </Link>
          <Link className="round-link" to="/account" aria-label="Wishlist">
            <img src={`${A}/84088.svg`} alt="" />
          </Link>
          <Link className="round-link" to="/cart" aria-label="Cart">
            <img src={`${A}/${overlay ? "3e72a.svg" : "58c05.svg"}`} alt="" />
          </Link>
          <Link
            className="round-link"
            to="/login"
            aria-label="Customer account"
          >
            <img src={`${A}/${overlay ? "b346f.svg" : "02f30.svg"}`} alt="" />
          </Link>
        </div>
      </header>
      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <div className="search-panel">
            <button
              className="search-close"
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              ×
            </button>
            <span className="eyebrow">SEARCH HOUSE OF MEHRANG</span>
            <h2>What are you looking for?</h2>
            <label>
              Search wallpapers, rooms and materials
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “calm bedroom”"
              />
            </label>
            <div className="search-suggestions">
              {(query
                ? products.filter((product) =>
                    product.name.toLowerCase().includes(query.toLowerCase()),
                  )
                : products.slice(0, 4)
              ).map((product) => (
                <Link
                  to={`/wallpapers/${product.slug}`}
                  key={product.slug}
                  onClick={() => setSearchOpen(false)}
                >
                  <img src={`${A}/${product.image}`} alt="" />
                  <span>{product.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="global-footer">
      <div className="footer-columns">
        <div className="footer-brand">
          <video
            className="footer-logo-video"
            autoPlay
            muted
            loop
            playsInline
            aria-label="House of Mehrang animated logo"
          >
            <source src={`${A}/footer-logo.mp4`} type="video/mp4" />
          </video>
          <p>
            Walls with character. Spaces with soul. Crafted and curated in
            Mumbai.
          </p>
          <Link className="footer-motion-link" to="/about">
            Discover our story <img src={`${A}/9ae9b.svg`} alt="" />
          </Link>
        </div>
        <div>
          <b>CUSTOMER CARE</b>
          <a href="mailto:info@houseofmehrang.com">info@houseofmehrang.com</a>
          <a href="tel:+910000000000">+91 00000 00000</a>
          <span>Monday–Saturday</span>
          <span>10:30 am–6:00 pm IST</span>
        </div>
        <div>
          <b>SHOP</b>
          <Link to="/shop-the-room">Shop the Room</Link>
          <Link to="/wallpapers">Wallpapers</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/fabrics">Fabrics & more</Link>
          <Link to="/imagine-your-wall">Imagine Your Wall</Link>
        </div>
        <div>
          <b>LEGAL & HELP</b>
          <Link to="/contact">Terms & conditions</Link>
          <Link to="/contact">Privacy policy</Link>
          <Link to="/contact">Refund & shipping</Link>
          <Link to="/contact">Warranty</Link>
          <Link to="/contact">FAQs</Link>
          <div className="footer-socials">
            {[
              ["52cb3.svg", "Instagram"],
              ["7f8b4.svg", "Facebook"],
              ["6a011.svg", "LinkedIn"],
            ].map(([icon, label]) => (
              <a href="#" aria-label={label} key={label}>
                <img src={`${A}/${icon}`} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-legal">
        <span>© House of Mehrang. All rights reserved.</span>
        <span>Mumbai · India</span>
      </div>
    </footer>
  )
}

export function WhatsAppPrompt() {
  return (
    <a
      className="whatsapp-prompt"
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noreferrer"
      aria-label="Ask House of Mehrang on WhatsApp"
    >
      <span>Still confused about what will suit your space?</span>
      <strong>Ask us on WhatsApp</strong>
    </a>
  )
}

export function SiteLayout() {
  const location = useLocation()
  return (
    <div className="site-shell">
      <Header />
      <div className="page-transition" key={location.pathname}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export function PageIntro({
  breadcrumb,
  eyebrow,
  title,
  copy,
}: {
  breadcrumb: string
  eyebrow?: string
  title: string
  copy?: string
}) {
  return (
    <section className="page-intro wrap">
      <p className="breadcrumb">{breadcrumb}</p>
      <div className="page-intro-grid">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
        </div>
        {copy && <p className="lede">{copy}</p>}
      </div>
    </section>
  )
}
