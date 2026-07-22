import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function fifa_world_cup_timezone() {
  return (
    <>
      <Helmet>
        <title>FIFA World Cup 2026 Time Zone Converter | UpTools</title>
        <meta name="description" content="Convert World Cup 2026 match times to your local timezone. Never miss a game." />
        <link rel="canonical" href="https://www.uptools.in/fifa-world-cup-timezone/" />
        <meta property="og:title" content="FIFA World Cup 2026 Time Zone Converter | UpTools" />
        <meta property="og:description" content="Convert World Cup 2026 match times to your local timezone. Never miss a game." />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">FIFA World Cup 2026 Time Zone Converter</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>🌍</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">FIFA World Cup 2026 Time Zone Converter</h1>
            <p className="text-sm text-slate-400 mt-1">Convert World Cup 2026 match times to your local timezone. Never miss a game.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span key="fifa" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">fifa</span>
          <span key="worldcup" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">worldcup</span>
          <span key="timezone" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">timezone</span>
          <span key="match-times" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">match-times</span>
          <span key="sports" className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/4 border border-white/8 text-slate-400">sports</span>
        </div>
      </section>

      <iframe
        src="/fifa-world-cup-timezone/index.html"
        className="w-full border-0 rounded-2xl overflow-hidden"
        style={{ minHeight: '700px', background: '#0f172a' }}
        title="FIFA World Cup 2026 Time Zone Converter"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  )
}
