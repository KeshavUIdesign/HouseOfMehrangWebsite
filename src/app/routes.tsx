import { createBrowserRouter, Link } from "react-router"
import {
  AboutPage,
  BlogPage,
  CollectionsPage,
  ContactPage,
  HomePage,
  ShopPage,
} from "./MarketingPages"
import { AccountPage, CartPage, CheckoutPage, LoginPage } from "./AccountPages"
import { FabricsPage, TradeProgrammePage } from "./EditorialPages"
import { Footer, SiteLayout } from "./SiteLayout"
import WallOfMehrangPage from "./WallOfMehrangPage"
import {
  ShopTheRoomPage,
  WallpaperProductPage,
  WallpapersPage,
} from "./ShopTheRoomPages"

function HomeRoute() {
  return (
    <>
      <HomePage />
      <Footer />
    </>
  )
}

function HydrateFallback() {
  return null
}

function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This wall is still waiting for its story.</h1>
      <Link className="pill primary" to="/">
        Return home
      </Link>
    </main>
  )
}

export const router = createBrowserRouter([
  { path: "/", Component: HomeRoute },
  {
    path: "/imagine-your-wall",
    HydrateFallback,
    lazy: async () => ({
      Component: (await import("./ImagineRoute")).default,
    }),
  },
  {
    Component: SiteLayout,
    children: [
      { path: "shop", Component: ShopPage },
      { path: "shop-the-room", Component: ShopTheRoomPage },
      { path: "wallpapers", Component: WallpapersPage },
      { path: "wallpapers/:slug", Component: WallpaperProductPage },
      { path: "fabrics", Component: FabricsPage },
      { path: "trade", Component: TradeProgrammePage },
      { path: "collections", Component: CollectionsPage },
      { path: "about", Component: AboutPage },
      { path: "blog", Component: BlogPage },
      { path: "contact", Component: ContactPage },
      { path: "login", Component: LoginPage },
      { path: "account", Component: AccountPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "wall-of-mehrang", Component: WallOfMehrangPage },
      { path: "*", Component: NotFound },
    ],
  },
])
