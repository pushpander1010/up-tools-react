import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MeshBackground from './components/MeshBackground'

const HomePage = lazy(() => import('./pages/HomePage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))
const HnckerPage = lazy(() => import('./pages/HnckerPage'))

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
    const compName = slug.replace(/\//g, '_').replace(/-/g, '_')
    const safeName = /^\d/.test(compName) ? 'tool_' + compName : compName

    import(`./tools/${safeName}.jsx`)
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

  return <Component />
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <MeshBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-6xl mx-auto px-5 py-8">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/hncker" element={<HnckerPage />} />
              <Route path="*" element={<ToolRoute />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  )
}
