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
const HackolutionPage = lazy(() => import('./pages/HackolutionPage'))
const HackolutionApps = lazy(() => import('./pages/HackolutionApps'))
const AimakerichPage = lazy(() => import('./pages/AimakerichPage'))
const AiforrichPage = lazy(() => import('./pages/AiforrichPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const BlogsPage = lazy(() => import('./pages/BlogsPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const LearningPage = lazy(() => import('./pages/LearningPage'))
const LearningAIPage = lazy(() => import('./pages/LearningAIPage'))
const HowAIWorksPage = lazy(() => import('./pages/HowAIWorksPage'))
const PromptingPage = lazy(() => import('./pages/PromptingPage'))
const ContextMemoryPage = lazy(() => import('./pages/ContextMemoryPage'))
const HallucinationsPage = lazy(() => import('./pages/HallucinationsPage'))
const EmbeddingsPage = lazy(() => import('./pages/EmbeddingsPage'))
const RagPage = lazy(() => import('./pages/RagPage'))
const AgentsPage = lazy(() => import('./pages/AgentsPage'))
const ImageGenPage = lazy(() => import('./pages/ImageGenPage'))
const VoiceVideoPage = lazy(() => import('./pages/VoiceVideoPage'))
const ResumesPage = lazy(() => import('./pages/ResumesPage'))
const SmallBizPage = lazy(() => import('./pages/SmallBizPage'))
const CostsPage = lazy(() => import('./pages/CostsPage'))
const SafetyPage = lazy(() => import('./pages/SafetyPage'))
const ApisPage = lazy(() => import('./pages/ApisPage'))
const LearningDSAPage = lazy(() => import('./pages/LearningDSAPage'))
const QuickselectPage = lazy(() => import('./pages/QuickselectPage'))

// Dynamic tool component loader
function ToolRoute() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\//, '').replace(/\/$/, '')
  const [Component, setComponent] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug || slug === 'games' || slug === 'hncker' || slug === 'hackolution' || slug === 'hackolution/apps' || slug === 'aimakerich' || slug === 'aiforrich' || slug === 'learning' || slug.startsWith('learning/')) {
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
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
      {/* Rail slots keep STATIC keys (no pathname): remounting 600px rails on
          every SPA navigation collapses/re-expands the layout = desktop CLS.
          Slots persist across navigations; the ad simply stays. */}
      <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
        <GameAdSlot key="rail-left" slot={AD_SLOTS.railLeft} format="vertical" width={160} height={600} className="mt-2" />
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <div className="hidden lg:block w-[160px] shrink-0 sticky top-24 self-start">
        <GameAdSlot key="rail-right" slot={AD_SLOTS.railRight} format="vertical" width={160} height={600} className="mt-2" />
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
        <ScrollToTop />
        <main className="max-w-6xl xl:max-w-7xl 2xl:max-w-screen-2xl mx-auto px-5 py-8">
          <Suspense fallback={<Loading />}>
            <SidebarLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/hncker" element={<HnckerPage />} />
                <Route path="/hackolution" element={<HackolutionPage />} />
                <Route path="/hackolution/apps" element={<HackolutionApps />} />
                <Route path="/aimakerich" element={<AimakerichPage />} />
                <Route path="/aiforrich" element={<AiforrichPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:slug" element={<BlogPostPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="/learning/ai" element={<LearningAIPage />} />
                <Route path="/learning/ai/how-ai-works" element={<HowAIWorksPage />} />
                <Route path="/learning/ai/prompting-that-gets-results" element={<PromptingPage />} />
                <Route path="/learning/ai/context-and-memory" element={<ContextMemoryPage />} />
                <Route path="/learning/ai/hallucinations-and-verifying" element={<HallucinationsPage />} />
                <Route path="/learning/ai/embeddings-and-search" element={<EmbeddingsPage />} />
                <Route path="/learning/ai/rag-chat-with-documents" element={<RagPage />} />
                <Route path="/learning/ai/ai-agents-that-do-tasks" element={<AgentsPage />} />
                <Route path="/learning/ai/image-generation-basics" element={<ImageGenPage />} />
                <Route path="/learning/ai/voice-and-video-ai" element={<VoiceVideoPage />} />
                <Route path="/learning/ai/ai-for-resumes-interviews" element={<ResumesPage />} />
                <Route path="/learning/ai/ai-for-small-business" element={<SmallBizPage />} />
                <Route path="/learning/ai/ai-costs-and-tokens" element={<CostsPage />} />
                <Route path="/learning/ai/privacy-and-safety" element={<SafetyPage />} />
                <Route path="/learning/ai/building-with-apis" element={<ApisPage />} />
                <Route path="/learning/dsa" element={<LearningDSAPage />} />
                <Route path="/learning/dsa/quickselect" element={<QuickselectPage />} />
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
