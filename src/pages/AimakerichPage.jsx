import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import InfiniteCarousel from '../components/InfiniteCarousel'

// Finance guides — one entry per Instagram reel. Add a new object here for each new
// reel page under /aimakerich/<slug>/. Keep name/slug/desc in sync with tools.json.
const guides = [
  { slug: 'algo-trading-strategies', name: 'Algo Trading Strategies', icon: '🤖', desc: 'Momentum, mean reversion, trend following & arbitrage — with copy-paste Python, Java and C++ starters.', tag: 'Trading bots', accent: 'linear-gradient(135deg, rgba(251,191,36,0.16), rgba(52,211,153,0.07))' },
  { slug: 'rsi-macd-divergence', name: 'RSI + MACD Divergence', icon: '📉', desc: 'Spot bullish & bearish divergences between price and RSI/MACD to catch reversals early — with Python, Java and C++ code.', tag: 'Reversal signals', accent: 'linear-gradient(135deg, rgba(0,200,180,0.16), rgba(251,191,36,0.07))' },
  { slug: 'golden-cross', name: 'Golden Cross', icon: '📈', desc: 'The MA50 × MA200 crossover strategy — spot the start of an uptrend and code the detector in Python, Java and C++.', tag: 'Trend following', accent: 'linear-gradient(135deg, rgba(255,183,77,0.16), rgba(100,181,246,0.07))' },
]

// Daily market bulletins — one entry per day. The current/latest day uses slug 'markets-today';
// every older day is PRESERVED as a dated archive page (slug 'markets-today-YYYY-MM-DD') — never deleted.
// Keep slug/date in sync with tools.json.
const bulletins = [
  { slug: 'markets-today', date: '13 August 2026', icon: '📰', mood: 'Banks firm · crude caps', desc: 'Nifty 24,436 · Bank Nifty 57,885 firm · crude past $88 on Hormuz · Grasim Q1 +51% · 5 stocks to watch.', accent: 'linear-gradient(135deg, rgba(0,200,180,0.16), rgba(251,191,36,0.07))' },
  { slug: 'markets-today-2026-08-12', date: '12 August 2026', icon: '📰', mood: 'Crude-capped · FIIs buying', desc: 'Nifty 24,472 · Bank Nifty 57,446 · crude past $85 on Hormuz worry · FIIs net buyers 3rd day · 5 stocks to watch.', accent: 'linear-gradient(135deg, rgba(0,200,180,0.16), rgba(251,191,36,0.07))' },
  { slug: 'markets-today-2026-08-11', date: '11 August 2026', icon: '📰', mood: 'Cautious · crude spike', desc: 'Crude +4% past $85 on Hormuz worry · Nifty 24,575 · Bank Nifty 57,687 · 5 stocks to watch with buy-target-stop.', accent: 'linear-gradient(135deg, rgba(0,200,180,0.16), rgba(251,191,36,0.07))' },
  { slug: 'markets-today-2026-08-10', date: '10 August 2026', icon: '📰', mood: 'Mixed · stock-specific', desc: 'Flat-to-mixed session · Nifty 24,584 · stock-specific moves · earnings + IPO names in focus.', accent: 'linear-gradient(135deg, rgba(0,200,180,0.16), rgba(251,191,36,0.07))' },
]

export default function AimakerichPage() {
  return (
    <>
      <Helmet>
        <title>AIMakeRich - Finance, Investing & Trading Guides</title>
        <meta name="description" content="AIMakeRich: practical money guides that match our Instagram reels. Learn investing, trading strategies and finance — with real code, step-by-step processes, FAQs and how-tos." />
        <link rel="canonical" href="https://www.uptools.in/aimakerich/" />
        <meta property="og:title" content="AIMakeRich - Finance, Investing & Trading Guides | UpTools" />
        <meta property="og:description" content="Practical money guides that match our Instagram reels. Investing, trading strategies and finance with real code." />
        <meta property="og:url" content="https://www.uptools.in/aimakerich/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="AIMakeRich - Finance, Investing & Trading Guides | UpTools" />
        <meta name="twitter:description" content="Practical money guides that match our Instagram reels." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">AIMakeRich</span>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-neon-border p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.07), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.14), transparent 70%)' }} />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399)', color: '#080d1a', boxShadow: '0 8px 32px rgba(251,191,36,0.3)' }}>₹</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AIMakeRich</h1>
            <p className="text-slate-400 text-sm mt-1">Smart money, explained simply — with real code.</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-amber-400/30 text-amber-300">💹 {guides.length} money guides</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📈 Investing</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🤖 Trading</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">📸 Instagram</span>
        </div>
      </div>

      {/* Instagram CTA */}
      <div className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(253,186,116,0.04), rgba(214,41,118,0.04), rgba(150,47,191,0.04))', borderColor: 'rgba(214,41,118,0.12)' }}>
        <div>
          <h2 className="text-xl font-bold m-0">Follow us on Instagram</h2>
          <div className="text-xl font-extrabold my-1"
            style={{ background: 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>@aimakerich</div>
          <div className="flex gap-6 mt-2">
            <div className="text-center"><b className="block text-white text-lg">Money</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">niche</span></div>
            <div className="text-center"><b className="block text-white text-lg">Reels + guides</b><span className="text-[11px] text-slate-400 uppercase tracking-wider">every reel → a page</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/aimakerich" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>Instagram ↗</a>
          <a href="https://www.uptools.in" target="_blank" rel="noopener" className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline bg-white/5 border border-white/10 text-slate-200">More tools ↗</a>
        </div>
      </div>

      {/* Guides — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(251,191,36,0.12)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">💹 Money Guides</h2><p className="text-xs text-slate-400 mt-1">One full guide per reel — drag or swipe to browse.</p></div>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {guides.map(g => (
              <div key={g.slug} className="flex-none w-[340px] p-5 rounded-2xl flex flex-col"
                style={{ background: g.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-black/30 p-1 border border-white/10" style={{ background: 'rgba(0,0,0,0.35)' }}>{g.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold m-0">{g.name}</h3>
                    <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">{g.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex-1">{g.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/aimakerich/${g.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399)', color: '#080d1a' }}>📖 Read Guide</Link>
                  <a href="https://www.instagram.com/aimakerich" target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">▶ Reel</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Markets Today — Infinite Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(0,200,180,0.14)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div><h2 className="text-xl font-bold m-0">📰 Markets Today</h2><p className="text-xs text-slate-400 mt-1">Daily market bulletins — global cues, news, levels & picks. New each morning.</p></div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">{bulletins.length} bulletin{bulletins.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {bulletins.map(b => (
              <div key={b.slug} className="flex-none w-[360px] p-5 rounded-2xl flex flex-col"
                style={{ background: b.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-white/10" style={{ background: 'rgba(0,0,0,0.35)' }}>{b.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold m-0">{b.date}</h3>
                    <span className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">{b.mood}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex-1">{b.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link to={`/aimakerich/${b.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                    style={{ background: 'linear-gradient(135deg, #34d399, #22d3ee)', color: '#080d1a' }}>📖 Read Bulletin</Link>
                  <a href="https://www.instagram.com/aimakerich" target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-emerald-400/40 transition-all">▶ Reel</a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>
    </>
  )
}
