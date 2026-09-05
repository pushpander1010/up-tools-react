import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import InfiniteCarousel from '../components/InfiniteCarousel'

// Quantitative algo trading guides — one entry per Instagram reel under @aiforrich.
// Keep name/slug/desc in sync with tools.json.
const guides = [
  {
    slug: 'algos-beat-buy-hold',
    name: '3 Algos That Beat Buy & Hold',
    icon: '⚡',
    desc: 'Mean reversion (-2σ Bollinger), volume explosion breakout, and multi-timeframe momentum backtested over 3 years on stocks & crypto.',
    tag: 'Quantitative Algos',
    accent: 'linear-gradient(135deg, rgba(251,191,36,0.16), rgba(52,211,153,0.07))',
  },
  {
    slug: 'automate-trades-while-you-sleep',
    name: 'Automate Trades While You Sleep',
    icon: '🌙',
    desc: '3-step 24/7 automation workflow: TradingView alert signal generation, Python webhook bridge validation, and broker API bracket execution.',
    tag: '24/7 Bot Workflow',
    accent: 'linear-gradient(135deg, rgba(52,211,153,0.16), rgba(6,182,212,0.07))',
  },
  {
    slug: 'pine-script-in-30-seconds',
    name: 'Pine Script in 30 Seconds',
    icon: '🌲',
    desc: 'Build, backtest, and automate quantitative bots in 30 seconds with 5 lines of Pine Script v5 on TradingView — zero complex setup.',
    tag: 'Pine Script v5',
    accent: 'linear-gradient(135deg, rgba(245,158,11,0.16), rgba(16,185,129,0.07))',
  },
  {
    slug: 'crypto-algo-vs-stock-algo',
    name: 'Crypto Algo vs Stock Algo',
    icon: '⚔️',
    desc: 'Backtested 3 years: crypto +412% vs stocks +184% — head-to-head on raw profit vs Sharpe consistency and max drawdown with runnable code.',
    tag: 'Crypto vs Stocks',
    accent: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(251,191,36,0.12))',
  },
  {
    slug: 'call-options',
    name: 'Call Options Explained',
    icon: '📈',
    desc: 'Profit from rising stocks without owning them: strike, premium, expiry, breakeven math plus a Python call scanner.',
    tag: 'Options Basics',
    accent: 'linear-gradient(135deg, rgba(52,211,153,0.16), rgba(6,182,212,0.07))',
  },
  {
    slug: 'put-options',
    name: 'Put Options Explained',
    icon: '🛡️',
    desc: 'Profit from crashes and hedge your holdings: protective-put math plus a Python put scanner with fear filters.',
    tag: 'Options Basics',
    accent: 'linear-gradient(135deg, rgba(239,68,68,0.16), rgba(99,102,241,0.07))',
  },
  {
    slug: 'options-chain',
    name: 'Read Options Chain Like a Pro',
    icon: '⛓️',
    desc: 'Calls left, puts right, strikes middle: the 5 numbers, OI support walls and PCR fear gauge in 60 seconds.',
    tag: 'Options Chain',
    accent: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(6,182,212,0.07))',
  },
  {
    slug: 'python-libs-traders',
    name: '3 Python Libraries for Traders',
    icon: '🐍',
    desc: 'yfinance free data, TA-Lib 150+ indicators, vectorbt + Backtrader backtests — the exact pro stack with starter code.',
    tag: 'Python Stack',
    accent: 'linear-gradient(135deg, rgba(52,211,153,0.16), rgba(251,191,36,0.07))',
  },
]

const features = [
  {
    icon: '🤖',
    title: 'Systematic Execution',
    desc: 'Eliminate emotional bias, fear, and greed with algorithmic entry, stop loss, and profit target rules.',
  },
  {
    icon: '🧪',
    title: '3-Year Backtesting',
    desc: 'Rigorous historical simulation measuring Sharpe ratio, maximum drawdown, profit factor, and expectancy.',
  },
  {
    icon: '🌐',
    title: 'Global Markets & Crypto',
    desc: 'Strategies engineered for 24/7 crypto liquidity (BTC, ETH, SOL) and international equity & index futures.',
  },
  {
    icon: '⚡',
    title: 'Webhook Automation',
    desc: 'Connect TradingView charts directly to broker APIs (Binance, Bybit, Alpaca, IBKR) via secure cloud webhooks.',
  },
]

export default function AiforrichPage() {
  return (
    <>
      <Helmet>
        <title>AIFORRICH - Algo Trading, Pine Script & Crypto Trading Guides</title>
        <meta name="description" content="AIFORRICH: Algo trading for international markets and crypto — reels + code guides. Practical quantitative trading strategies, Pine Script indicators, and automated execution bots with copy-paste code." />
        <link rel="canonical" href="https://www.uptools.in/aiforrich/" />
        <meta property="og:title" content="AIFORRICH - Algo Trading, Pine Script & Crypto Trading Guides | UpTools" />
        <meta property="og:description" content="Algo trading for international markets and crypto — reels + code guides. Quantitative strategies, Pine Script bots, and webhook automation." />
        <meta property="og:url" content="https://www.uptools.in/aiforrich/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="AIFORRICH - Algo Trading, Pine Script & Crypto Trading Guides | UpTools" />
        <meta name="twitter:description" content="Algo trading for international markets and crypto — reels + code guides." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">AIFORRICH</span>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-amber-500/20 p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(6,78,59,0.25), rgba(15,23,42,0.6))' }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.2), rgba(52,211,153,0.1), transparent 70%)' }} />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399)', color: '#080d1a', boxShadow: '0 8px 32px rgba(251,191,36,0.35)' }}>
            AFR
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight m-0"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AIFORRICH
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1 font-medium">
              Algo trading for international markets and crypto — reels + code guides.
            </p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
            ⚡ {guides.length} algo guides
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">
            🌲 Pine Script v5
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
            📊 TradingView
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
            🪙 Crypto & International
          </span>
          <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-pink-500/30 text-pink-300 hover:bg-pink-500/10 transition-all no-underline">
            📸 Instagram @aiforrich
          </a>
        </div>
      </div>

      {/* Instagram CTA Card */}
      <div className="glass rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(214,41,118,0.04), rgba(52,211,153,0.06))', borderColor: 'rgba(251,191,36,0.2)' }}>
        <div>
          <h2 className="text-xl font-bold m-0 text-white">Follow AIFORRICH on Instagram</h2>
          <div className="text-xl font-extrabold my-1"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            @aiforrich
          </div>
          <div className="flex gap-6 mt-2">
            <div className="text-center">
              <b className="block text-white text-lg font-bold">Algo & Crypto</b>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">niche</span>
            </div>
            <div className="text-center">
              <b className="block text-white text-lg font-bold">Reels + Code</b>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">every reel → runnable code</span>
            </div>
            <div className="text-center">
              <b className="block text-white text-lg font-bold">Pine + Python</b>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">stack</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
            className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline"
            style={{ background: 'linear-gradient(92deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)' }}>
            Follow on Instagram ↗
          </a>
          <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer"
            className="glow-btn text-sm px-5 py-2.5 rounded-xl no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
            TradingView ↗
          </a>
        </div>
      </div>

      {/* Guides / Reels Carousel */}
      <div className="glass rounded-3xl mb-6 overflow-hidden" style={{ borderColor: 'rgba(251,191,36,0.15)' }}>
        <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold m-0 text-white">⚡ Quantitative Algo Guides & Reel Companions</h2>
            <p className="text-xs text-slate-400 mt-1">Full companion guides with copy-paste Python, Pine Script, and webhook starters — swipe to browse.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
            {guides.length} guide{guides.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="px-6 pb-6">
          <InfiniteCarousel gap={16}>
            {guides.map(g => (
              <div key={g.slug} className="flex-none w-[340px] p-5 rounded-2xl flex flex-col justify-between"
                style={{ background: g.accent, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                      style={{ background: 'rgba(0,0,0,0.4)' }}>
                      {g.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold m-0 text-white leading-tight">{g.name}</h3>
                      <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider">{g.tag}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">{g.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap pt-2">
                  <Link to={`/aiforrich/${g.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline transition-transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #fbbf24, #34d399)', color: '#080d1a' }}>
                    📖 Read Guide
                  </Link>
                  <a href="https://www.instagram.com/aiforrich" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold no-underline bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:border-amber-400/40 transition-all">
                    ▶ Reel
                  </a>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      </div>

      {/* Quantitative Trading Pillars */}
      <div className="glass rounded-3xl mb-6 p-6 sm:p-8" style={{ borderColor: 'rgba(52,211,153,0.15)' }}>
        <div className="mb-6">
          <h2 className="text-xl font-bold m-0 text-white">🧠 The AIFORRICH Quantitative Framework</h2>
          <p className="text-xs text-slate-400 mt-1">Why modern traders replace discretionary guessing with mathematical edge and automated execution.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl p-5 border border-white/8 flex flex-col justify-start"
              style={{ background: 'rgba(15,23,42,0.5)' }}>
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed m-0">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
