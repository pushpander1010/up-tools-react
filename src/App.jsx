import { Component as ReactComponent } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MeshBackground from './components/MeshBackground'
import GameAdSlot from './components/GameAdSlot'
import { AD_SLOTS } from './config/ads'

class ErrorBoundary extends ReactComponent {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-sm text-slate-400 mb-4 font-mono">{String(this.state.error)}</p>
        <a href="/" className="glow-btn text-xs px-4 py-2 rounded-xl no-underline inline-block">← Back to Home</a>
      </div>
    )
    return this.props.children
  }
}

const HomePage = lazy(() => import('./pages/HomePage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))
const HnckerPage = lazy(() => import('./pages/HnckerPage'))
const AimakerichPage = lazy(() => import('./pages/AimakerichPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Dynamic tool component loader
function ToolRoute() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\//, '').replace(/\/$/, '')
  const [Component, setComponent] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug || slug === 'games' || slug === 'hncker') {
      setNotFound(true)
      return
    }
    // Filenames map 1:1 from the slug. Do NOT prefix digit-leading names: the only
    // such file is 401k_calculator.jsx, and a `tool_` prefix made /401k-calculator/
    // import a file that has never existed, so the route always fell through to 404
    // while still being prerendered and listed in the sitemap.
    const compName = slug.replace(/\//g, '_').replace(/-/g, '_')

    import(`./tools/${compName}.jsx`)
      .then(mod => setComponent(() => mod.default))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
        <a href="/" className="glow-btn text-sm px-5 py-2 rounded-xl no-underline inline-block">← Home</a>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <ErrorBoundary><Component /></ErrorBoundary>
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function SidebarLayout({ children }) {
  const location = useLocation()
  // Only individual games (/games/<name>[/]) are full-page (they carry their own aside ads).
  // The /games landing is a catalog and must keep the outer sidebar + aside ads like other pages.
  // (Fix: startsWith('/games/') wrongly stripped the sidebar for /games/ with a trailing slash.)
  const isGame = /^\/games\/[^/]+\/?$/.test(location.pathname)
  if (isGame) return children

  return (
    <div className="flex gap-4">
      <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
        <GameAdSlot key={'l-' + location.pathname} slot={AD_SLOTS.railLeft} format="vertical" width={160} height={600} className="mt-2" />
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
        <GameAdSlot key={'r-' + location.pathname} slot={AD_SLOTS.railRight} format="vertical" width={160} height={600} className="mt-2" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <MeshBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 py-8">
          <Suspense fallback={<Loading />}>
            <SidebarLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/hncker" element={<HnckerPage />} />
                <Route path="/aimakerich" element={<AimakerichPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<ToolRoute />} />
              </Routes>
            </SidebarLayout>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  )
}
