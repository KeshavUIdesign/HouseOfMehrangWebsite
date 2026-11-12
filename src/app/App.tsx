import { useEffect, useState } from "react"
import { RouterProvider } from "react-router"
import { router } from "./routes"

export default function App() {
  const [preloader, setPreloader] = useState(true)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (!preloader) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const fallback = window.setTimeout(() => finishPreloader(), 8000)
    return () => {
      window.clearTimeout(fallback)
      document.body.style.overflow = previousOverflow
    }
  }, [preloader])

  const finishPreloader = () => {
    if (closing) return
    setClosing(true)
    window.setTimeout(() => setPreloader(false), 600)
  }

  return (
    <>
      <RouterProvider router={router} />
      {preloader && (
        <div className={`site-preloader ${closing ? "is-closing" : ""}`}>
          <video autoPlay muted playsInline onEnded={finishPreloader}>
            <source src="/assets/site-preloader.mp4" type="video/mp4" />
          </video>
          <button type="button" onClick={finishPreloader}>
            Skip intro
          </button>
        </div>
      )}
    </>
  )
}
