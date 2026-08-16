import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmtNum = (n, d = 2) => n == null || !Number.isFinite(n) ? '—' : Number(n).toLocaleString('en-IN', { maximumFractionDigits: d })
const fmtSigned = (n) => (n == null ? '—' : (n > 0 ? '+' : '') + fmtNum(n))

function NavChart({ data, height = 160 }) {
  if (!data || data.length < 2) return <div className="text-xs text-slate-600 py-10 text-center">No NAV history available</div>
  const width = 600
  const values = data.map(d => d.v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const n = data.length
  const up = values.at(-1) >= values[0]
  const color = up ? '#34d399' : '#f87171'
  const pts = data.map((d, i) => `${((i / (n - 1)) * width).toFixed(1)},${(height - ((d.v - min) / range) * height + 5).toFixed(1)}`).join(' ')
  const area = `${width},${height + 10} 0,${height + 10} ` + pts
  const first = data[0]
  const last = data[n - 1]
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-auto" preserveAspectRatio="none" style={{ maxHeight: 220 }} aria-hidden="true">
        <defs>
          <linearGradient id="navfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#navfill)" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>{first.d} · NAV {fmtNum(first.v)}</span>
        <span>{last.d} · NAV {fmtNum(last.v)}</span>
      </div>
    </div>
  )
}

export default function mutual_fund_nav() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const [nav, setNav] = useState(null)
  const [navLoading, setNavLoading] = useState(false)
  const [error, setError] = useState('')
  const [investAmount, setInvestAmount] = useState('10000')
  const debounce = useRef(null)

  const search = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    setError('')
    try {
      const res = await fetch('/api/mf?q=' + encodeURIComponent(q.trim()), { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('Search failed')
      const payload = await res.json()
      setResults(payload.results || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed')
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => search(query), 400)
    return () => clearTimeout(debounce.current)
  }, [query, search])

  const pick = useCallback(async (code) => {
    setNavLoading(true)
    setError('')
    setResults([])
    setQuery('')
    try {
      const res = await fetch('/api/mf?code=' + encodeURIComponent(code), { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('NAV fetch failed')
      const payload = await res.json()
      if (payload.error) throw new Error(payload.error)
      setNav(payload)
      setSelected(payload)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'NAV fetch failed')
      setNav(null)
      setSelected(null)
    } finally {
      setNavLoading(false)
    }
  }, [])

  const projection = useMemo(() => {
    if (!nav?.returns1y || nav.returns1y == null) return null
    const amt = parseFloat(investAmount) || 0
    if (!amt) return null
    return {
      amt,
      value: amt * (1 + nav.returns1y / 100),
      days: (nav.chart || []).length,
    }
  }, [nav, investAmount])

  const up = (nav?.dayChangePct ?? 0) >= 0

  return (
    <ToolLayout
      title="Mutual Fund NAV & Returns Calculator India"
      desc="Check the latest mutual fund NAV (net asset value) for any Indian fund, day change, 1-year returns and NAV history chart. Free NAV lookup across equity, debt, tax-saving ELSS and hybrid funds — no signup."
      icon="💼" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="mutual-fund-nav"
      faq={[
        { q: 'What is NAV in mutual funds?', a: 'NAV (Net Asset Value) is the price of one unit of a mutual fund — the total value of the fund\'s assets minus liabilities, divided by outstanding units. It is published once per day for open-ended funds.' },
        { q: 'How do I check a mutual fund NAV?', a: 'Type the fund name or scheme code in the search box, select it and you\'ll instantly see the latest NAV, day change, 1-year return and a 12-month NAV chart — powered by AMFI data through the UpTools backend.' },
        { q: 'What is a good 1-year mutual fund return?', a: 'It depends on the category: large-cap equity funds have historically returned 10–15% per year, while debt funds return 6–8% and liquid funds 5–7%. Compare a fund against its category average, not against other categories.' },
        { q: 'Is NAV a good indicator of fund performance?', a: 'Only with context. A low NAV does not mean cheap — a ₹10 NAV fund and a ₹500 NAV fund can perform identically. Use returns over 1/3/5 years and the expense ratio instead of NAV alone.' },
        { q: 'What is the difference between SIP and lumpsum?', a: 'SIP invests a fixed amount monthly (rupee-cost averaging, ideal for volatile equity funds). Lumpsum puts the entire amount in at once — a one-year projection in this tool shows simple growth for a lumpsum at the fund\'s 1-year return rate.' },
      ]}
      howItWorks={[
        'Search any Indian mutual fund by name or AMFI scheme code.',
        'The UpTools backend fetches the latest NAV and 12-month history from the AMFI data feed (mfapi.in).',
        'View the latest NAV, day change, 1-year return and NAV chart instantly.',
        'Use the projection box to see how a lumpsum investment of ₹X would have grown over the last year at this fund\'s return rate.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Mutual Fund NAV Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/mutual-fund-nav/",
        "description": "Latest mutual fund NAV for any Indian fund with day change, 1-year returns and NAV history chart.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Search Mutual Fund (name or scheme code)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. HDFC Mid Cap, 119598, Nifty 50…"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white font-semibold outline-none focus:border-brand/40 placeholder:text-slate-600" />
            {searching && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 animate-pulse">searching…</span>}
          </div>
          {results.length > 0 && (
            <div className="absolute z-20 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1326] shadow-2xl">
              {results.map(r => (
                <button key={r.code} onClick={() => pick(r.code)} className="w-full text-left px-4 py-3 hover:bg-white/[0.06] transition-all border-b border-white/5 last:border-0">
                  <div className="text-xs font-bold text-white">{r.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Scheme code {r.code}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 text-amber-400 text-sm">{error}</div>}

        {/* NAV card */}
        {navLoading && <div className="text-center text-sm text-slate-500 py-8 animate-pulse">Fetching NAV…</div>}

        {!navLoading && nav && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="p-5 rounded-2xl border-2 border-brand/20 bg-brand/[0.04]">
              <div className="text-xs text-slate-400 mb-1">{nav.category || 'Mutual Fund'}</div>
              <h3 className="text-base font-extrabold text-white mb-3">{nav.schemeName}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                  <div className="text-slate-500 mb-1">Latest NAV</div>
                  <div className="text-lg font-extrabold text-white">{fmtNum(nav.latestNav)}</div>
                  <div className="text-[10px] text-slate-500">as of {nav.navDate}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                  <div className="text-slate-500 mb-1">Day change</div>
                  <div className={`text-lg font-extrabold ${up ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(nav.dayChange)}</div>
                  <div className={`text-[10px] font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(nav.dayChangePct)}%</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                  <div className="text-slate-500 mb-1">1-Year Return</div>
                  <div className={`text-lg font-extrabold ${(nav.returns1y ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(nav.returns1y)}%</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                  <div className="text-slate-500 mb-1">Scheme code</div>
                  <div className="text-lg font-extrabold text-white font-mono">{nav.code}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">NAV History — Last 12 Months</h4>
              <NavChart data={nav.chart} />
            </div>

            {/* Projection */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📈 Lumpsum Projection (1 year, at {fmtNum(nav.returns1y)}% return)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Invested amount (₹)</label>
                  <input type="number" value={investAmount} onChange={e => setInvestAmount(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40" />
                </div>
                {projection && (
                  <div className="p-3 rounded-xl bg-brand/10 border border-brand/25 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Value after 1 year</div>
                    <div className="text-xl font-extrabold gradient-text">₹{fmtNum(Math.round(projection.value), 0)}</div>
                    <div className="text-[11px] text-emerald-400 font-bold">+₹{fmtNum(Math.round(projection.value - projection.amt), 0)} gain</div>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-3">Illustrative only — past returns don't guarantee future performance. Mutual fund investments are subject to market risks.</p>
            </div>
          </div>
        )}

        {!nav && !navLoading && !results.length && !error && (
          <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.04] text-xs text-slate-400 text-center">
            Search a fund above — data comes from the official AMFI feed (via mfapi.in) through the UpTools backend.
          </div>
        )}
      </div>
    </ToolLayout>
  )
}