import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router"
import { A, products } from "./site-data"
import { PageIntro } from "./SiteLayout"

function Arrow() {
  return <img className="inline-icon" src={`${A}/a028e.svg`} alt="" />
}

export function LoginPage() {
  const navigate = useNavigate()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate("/account")
  }
  return (
    <main>
      <p className="breadcrumb wrap solo-crumb">
        Home / Customer account / Login
      </p>
      <section className="wrap login-layout">
        <div className="login-image">
          <img
            src={`${A}/c4c45.png`}
            alt="Living room with deep teal wallpaper"
          />
          <div>
            <span>YOUR HOUSE OF MEHRANG</span>
            <h2>A place for your favourite possibilities.</h2>
            <p>
              Keep your saved designs, sample requests and project details
              together.
            </p>
          </div>
        </div>
        <form className="login-form" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Make yourself at home.</h1>
          <p>Log in to revisit your palettes and sample orders.</p>
          <label>
            Email address *
            <input type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password *
            <input type="password" required placeholder="Enter your password" />
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>
          <button className="pill primary wide" type="submit">
            Log in
          </button>
          <hr />
          <p>New to House of Mehrang?</p>
          <button
            className="pill outline wide"
            type="button"
            onClick={() => navigate("/account")}
          >
            Create an account <Arrow />
          </button>
          <small>
            Static login design · no sign-in or password recovery is performed.
          </small>
        </form>
      </section>
    </main>
  )
}

const dashboardNav = [
  ["64b54.svg", "Overview"],
  ["c247e.svg", "Orders"],
  ["4d775.svg", "Sample requests"],
  ["bab86.svg", "Saved designs"],
  ["c2d4d.svg", "Addresses"],
  ["1a1c7.svg", "Profile & password"],
  ["f3d62.svg", "Trade programme"],
]

export function AccountPage() {
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Customer account"
        eyebrow="YOUR HOUSE OF MEHRANG"
        title="Welcome back, Aarya."
        copy="Your ideas, samples and project details in one place. This dashboard contains demo customer and order data."
      />
      <section className="wrap account-grid">
        <aside className="account-side">
          <div className="account-person">
            <span>AS</span>
            <h3>Aarya Shah</h3>
            <p>Homeowner · Demo profile</p>
          </div>
          {dashboardNav.map(([icon, label], i) => (
            <button className={i === 0 ? "active" : ""} key={label}>
              <img src={`${A}/${icon}`} alt="" />
              {label}
            </button>
          ))}
          <Link to="/login">
            Log out <Arrow />
          </Link>
        </aside>
        <div className="account-main">
          <div className="metrics">
            {[
              ["Sample orders", "01"],
              ["Sample requests", "01"],
              ["Saved designs", "03"],
            ].map(([label, n]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{n}</strong>
                <Link to="/account">
                  Review details <Arrow />
                </Link>
              </div>
            ))}
          </div>
          <section className="dashboard-card recent-order">
            <div className="card-title">
              <h2>Recent order</h2>
              <span>Demo · Confirmed</span>
            </div>
            <div className="order-meta">
              <strong>HM-DEMO-001</strong>
              <span>02 Oct 2026 · Demo date</span>
              <span>4 samples · ₹1,050 total</span>
            </div>
            <div className="order-preview">
              {products.slice(0, 3).map((p) => (
                <img key={p.slug} src={`${A}/${p.image}`} alt={p.name} />
              ))}
              <p>
                <strong>
                  Veil of Spring × 2 · Lavender Hush × 1 · Soft Unfurl × 1
                </strong>
                <br />
                Samples ₹950 + demo delivery ₹100 · ₹1,050
              </p>
            </div>
            <Link className="pill outline" to="/checkout">
              View order details
            </Link>
          </section>
          <section className="dashboard-card">
            <div className="card-title">
              <h2>Sample requests</h2>
              <span>Demo · In review</span>
            </div>
            <strong>SR-DEMO-001 · Living room palette</strong>
            <p>
              Veil of Spring, Lavender Hush and Soft Unfurl. Enquiry for a
              Mumbai home; colour and finish discussion requested.
            </p>
            <Link to="/contact">
              View request <Arrow />
            </Link>
          </section>
          <section className="saved-section">
            <div className="card-title">
              <h2>Your saved palette</h2>
              <Link to="/collections">
                View all <Arrow />
              </Link>
            </div>
            <div className="saved-grid">
              {products.slice(0, 3).map((p) => (
                <article key={p.slug}>
                  <img src={`${A}/${p.image}`} alt={p.name} />
                  <h3>{p.name}</h3>
                  <small>₹{p.price} / sample · demo</small>
                  <Link className="pill outline" to="/cart">
                    Add sample
                  </Link>
                </article>
              ))}
            </div>
          </section>
          <div className="profile-cards">
            <div>
              <span>DEFAULT SHIPPING & BILLING</span>
              <h3>Home address</h3>
              <p>
                Aarya Shah
                <br />
                [Demo delivery address]
                <br />
                Mumbai, Maharashtra · 400001 [demo]
                <br />
                India
              </p>
              <Link to="/account">
                Edit address / Add address <Arrow />
              </Link>
            </div>
            <div>
              <span>YOUR DETAILS</span>
              <h3>Profile & preferences</h3>
              <p>
                Aarya Shah · Demo customer
                <br />
                aarya@example.com
                <br />
                [Demo phone number]
                <br />
                Journal subscription: not selected
              </p>
              <Link to="/account">
                Edit profile / Change password <Arrow />
              </Link>
            </div>
          </div>
          <section className="trade-banner">
            <div>
              <span>FOR DESIGNERS & ARCHITECTS</span>
              <h2>Bring your next brief.</h2>
              <p>
                Discuss sample palettes, specifications and project support with
                our Mumbai studio.
              </p>
            </div>
            <Link className="pill light-pill" to="/contact">
              Enquire about trade <Arrow />
            </Link>
          </section>
        </div>
      </section>
    </main>
  )
}

export function CartPage() {
  const [quantities, setQuantities] = useState([2, 1, 1])
  const cartProducts = products.slice(0, 3)
  const subtotal = cartProducts.reduce(
    (sum, p, i) => sum + p.price * quantities[i],
    0,
  )
  const change = (index: number, delta: number) =>
    setQuantities((values) =>
      values.map((n, i) => (i === index ? Math.max(1, n + delta) : n)),
    )
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Cart"
        eyebrow="YOUR SAMPLE PALETTE"
        title="A little closer to your wall."
        copy="Compare your chosen colours and textures at home before planning the full surface."
      />
      <section className="wrap cart-layout">
        <div className="cart-list">
          <div className="cart-title">
            <h2>4 samples. 3 designs.</h2>
            <span>Demo basket</span>
          </div>
          <div className="cart-labels">
            <span>PRODUCT / SAMPLE</span>
            <span>UNIT</span>
            <span>QUANTITY</span>
            <span>TOTAL</span>
          </div>
          {cartProducts.map((p, i) => (
            <article className="cart-item" key={p.slug}>
              <img src={`${A}/${p.image}`} alt={p.name} />
              <div>
                <h3>{p.name}</h3>
                <p>
                  {p.collection} · {p.name}
                </p>
                <small>Wallpaper sample · demo pricing</small>
              </div>
              <strong>₹{p.price}</strong>
              <div className="quantity">
                <button onClick={() => change(i, -1)}>
                  <img src={`${A}/dbcec.svg`} alt="Decrease" />
                </button>
                <span>{quantities[i]}</span>
                <button onClick={() => change(i, 1)}>
                  <img src={`${A}/ff1e0.svg`} alt="Increase" />
                </button>
              </div>
              <strong>₹{p.price * quantities[i]}</strong>
              <div className="cart-item-actions">
                <button>Save for later</button>
                <button>Remove</button>
              </div>
            </article>
          ))}
          <div className="cart-bottom">
            <Link className="pill outline" to="/shop">
              Continue shopping <Arrow />
            </Link>
            <span>Sample subtotal: ₹{subtotal}</span>
          </div>
        </div>
        <aside className="cart-summary">
          <div>
            <h2>Your sample order</h2>
            <span>DEMO BASKET · 4 SAMPLES / 3 DESIGNS</span>
            <hr />
            <p>
              Sample subtotal <strong>₹{subtotal}</strong>
            </p>
            <p>
              Delivery · demo estimate <strong>₹100</strong>
            </p>
            <small>
              Demo prices include applicable taxes. Final pricing and delivery
              to be confirmed by the studio.
            </small>
            <hr />
            <h3>
              Total (INR) <strong>₹{subtotal + 100}</strong>
            </h3>
            <Link className="pill primary wide" to="/checkout">
              Continue to checkout <Arrow />
            </Link>
          </div>
          <div className="planning-card">
            <img src={`${A}/77619.svg`} alt="" />
            <h2>Planning a whole wall?</h2>
            <p>
              Share your measurements with the studio for a full-wall material
              and quantity discussion.
            </p>
            <Link to="/contact">
              Request a project quotation <Arrow />
            </Link>
          </div>
        </aside>
      </section>
      <section className="sample-reminder">
        <div>
          <h2>A sample is the beginning.</h2>
          <p>
            Use your room&apos;s daylight and evening light to compare colour
            and texture. Room imagery is illustrative; the physical material is
            your reference.
          </p>
        </div>
        <Link className="pill outline" to="/contact">
          Book a studio visit <Arrow />
        </Link>
      </section>
    </main>
  )
}

function CheckoutSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="checkout-section">
      <h2>
        <span>{number}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function CheckoutPage() {
  const [placed, setPlaced] = useState(false)
  if (placed)
    return (
      <main className="confirmation wrap">
        <img src={`${A}/7f038.svg`} alt="" />
        <span className="eyebrow">SAMPLE ORDER RECEIVED</span>
        <h1>Thank you, Aarya.</h1>
        <p>
          Your demo sample order has been recorded. The Mumbai studio will
          confirm availability, delivery and final pricing.
        </p>
        <Link className="pill primary" to="/account">
          View your account <Arrow />
        </Link>
      </main>
    )
  return (
    <main>
      <PageIntro
        breadcrumb="Home / Cart / Checkout"
        eyebrow="YOUR SAMPLE ORDER"
        title="Make room for possibilities."
        copy="Complete your sample-order details. This populated checkout uses illustrative customer information and pricing."
      />
      <div className="wrap checkout-steps">
        <span>1 / Basket</span>
        <img src={`${A}/071d7.svg`} alt="" />
        <strong>2 / Checkout</strong>
        <img src={`${A}/071d7.svg`} alt="" />
        <span>3 / Confirmation</span>
      </div>
      <section className="wrap checkout-layout">
        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault()
            setPlaced(true)
          }}
        >
          <CheckoutSection number="01" title="Contact information">
            <div className="form-two">
              <label>
                Full name *<input required defaultValue="Aarya Shah" />
              </label>
              <label>
                Email address *
                <input required type="email" defaultValue="aarya@example.com" />
              </label>
              <label className="span-2">
                Phone number *
                <input required placeholder="[Demo phone number]" />
              </label>
            </div>
            <small>Demo customer details · replace before use.</small>
          </CheckoutSection>
          <CheckoutSection number="02" title="Shipping address">
            <div className="form-two">
              <label className="span-2">
                Address line 1 *
                <input required placeholder="[Demo delivery address]" />
              </label>
              <label className="span-2">
                Address line 2
                <input placeholder="Apartment, landmark (optional)" />
              </label>
              <label>
                City *<input defaultValue="Mumbai" />
              </label>
              <label>
                PIN code *<input defaultValue="400001 · demo" />
              </label>
              <label>
                State *
                <select>
                  <option>Maharashtra</option>
                </select>
              </label>
              <label>
                Country *
                <select>
                  <option>India</option>
                </select>
              </label>
            </div>
            <div className="delivery-note">
              <img src={`${A}/9b1a8.svg`} alt="" />
              <span>
                Sample delivery · demo estimate ₹100
                <br />
                Delivery availability and timing to be confirmed by the studio.
              </span>
            </div>
          </CheckoutSection>
          <CheckoutSection number="03" title="Billing details">
            <label className="consent">
              <img className="check-icon" src={`${A}/23954.svg`} alt="" />
              <input type="checkbox" defaultChecked /> Billing address is the
              same as my shipping address
            </label>
            <p>
              Aarya Shah · [Demo delivery address], Mumbai, Maharashtra
              <br />
              India · 400001 (demo)
            </p>
            <button className="outline-field" type="button">
              Add billing or business details
            </button>
          </CheckoutSection>
          <CheckoutSection number="04" title="Payment choice">
            <div className="payment-options">
              {[
                ["b1a9e.svg", "UPI", "a524d.svg"],
                ["17a81.svg", "Credit / debit card", "8bcf7.svg"],
                ["17a81.svg", "Bank transfer", "d2fce.svg"],
              ].map(([radio, label, icon], i) => (
                <button
                  className={i === 0 ? "active" : ""}
                  type="button"
                  key={label}
                >
                  <img src={`${A}/${radio}`} alt="" />
                  <span>
                    <strong>{label}</strong>
                    <small>
                      {i === 0
                        ? "Use your preferred UPI app · demo option"
                        : "Payment instructions to be confirmed"}
                    </small>
                  </span>
                  <img src={`${A}/${icon}`} alt="" />
                </button>
              ))}
            </div>
            <small>
              Payment methods are illustrative and require brand confirmation.
              No banking details are collected or payments processed in this
              static design.
            </small>
          </CheckoutSection>
          <label className="consent terms">
            <input type="checkbox" required /> I have reviewed the demo order
            and agree to the Terms of Use and Privacy notice.
          </label>
          <button className="pill primary wide" type="submit">
            Place sample order · ₹1,050
          </button>
        </form>
        <aside className="checkout-summary">
          <div>
            <h2>Your sample order</h2>
            <span>DEMO BASKET · 4 SAMPLES / 3 DESIGNS</span>
            {products.slice(0, 3).map((p, i) => (
              <div className="checkout-product" key={p.slug}>
                <img src={`${A}/${p.image}`} alt={p.name} />
                <p>
                  <strong>{p.name}</strong>
                  <small>{i === 0 ? "2 × ₹250 · sample" : "1 × sample"}</small>
                </p>
                <span>₹{i === 0 ? 500 : p.price}</span>
              </div>
            ))}
            <hr />
            <p>
              Sample subtotal <strong>₹950</strong>
            </p>
            <p>
              Delivery · demo estimate <strong>₹100</strong>
            </p>
            <hr />
            <h3>
              Total (INR) <strong>₹1,050</strong>
            </h3>
          </div>
          <div className="need-help">
            <span>NEED A HAND?</span>
            <p>
              Questions about a sample or your project? Contact the Mumbai
              studio.
            </p>
            <strong>
              [Phone number]
              <br />
              [Email address]
            </strong>
            <Link className="pill outline" to="/cart">
              Return to cart <Arrow />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
