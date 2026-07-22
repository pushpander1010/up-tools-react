import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MeshBackground from './components/MeshBackground'

const HomePage = lazy(() => import('./pages/HomePage'))
const GamesPage = lazy(() => import('./pages/GamesPage'))
const HnckerPage = lazy(() => import('./pages/HnckerPage'))
const ToolPage = lazy(() => import('./pages/ToolPage'))

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
              <Route path="/:toolSlug" element={<ToolPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  )
}
