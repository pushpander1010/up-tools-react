import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function HackolutionPage() {
  return (
    <>
      <Helmet>
        <title>HACKOLUTION - Hacking Tools, Apps, Instagram & Videos</title>
        <meta name="description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
        <link rel="canonical" href="https://www.uptools.in/hackolution/" />
        <meta property="og:title" content="HACKOLUTION - Hacking Tools, Apps, Instagram & Videos | UpTools" />
        <meta property="og:description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
        <meta property="og:url" content="https://www.uptools.in/hackolution/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HACKOLUTION - Hacking Tools, Apps, Instagram & Videos | UpTools" />
        <meta name="twitter:description" content="Follow HACKOLUTION on Instagram for hacking, tools and tech videos. New content coming soon." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">HACKOLUTION</span>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-neon-border p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(27,255,110,0.06), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(27,255,110,0.12), transparent 70%)' }} />
        <div className="relative flex items-center gap-5">
          <img src="/assets/logo/hackolution.png" alt="hackolution hooded hacker logo" width="64" height="64"
            className="w-16 h-16 rounded-2xl shrink-0 object-cover"
            style={{ boxShadow: '0 8px 32px rgba(27,255,110,0.35)', border: '1px solid rgba(27,255,110,0.4)' }} />
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0 lowercase"><span className="text-white">hack</span><span style={{ color: '#1bff6e' }}>olution</span></h1>
            <p className="text-slate-400 text-sm mt-1">New content coming soon.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <a href="https://www.instagram.com/hackolution" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-neon/30 text-neon hover:bg-neon/10 hover:border-neon/50 transition-all no-underline">📸 @hackolution</a>
        </div>
      </div>
    </>
  )
}
