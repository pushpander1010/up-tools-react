import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const API_BASE = 'https://api.coingecko.com/api/v3'
const CURRENCIES = { inr: '₹', usd: '$', eur: '€' }
const LS_KEY = 'ertools_crypto_watchlist'

function fmt(n, cur) {
  if (!n && n !== 0) return '—'
  const s = CURRENCIES[cur] || '$'
  if (Math.abs(n) >= 1e12) return s + (n / 1e12).toFixed(2) + 'T'
  if (Math.abs(n) >= 1e9) return s + (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return s + (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1000) return s + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  if (Math.abs(n) >= 1) return s + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return s + n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

function drawSpark(canvas, arr) {
  if (!canvas || !arr || arr.length === 0) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width = canvas.offsetWidth * 2
  const h = canvas.height = canvas.offsetHeight * 2
  ctx.clearRect(0, 0, w, h)
  const min = Math.min(...arr), max = Math.max(...arr)
  const range = max - min || 1
  const color = arr[arr.length - 1] >= arr[0] ? '#10b981' : '#ef4444'
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  arr.forEach((v, i) => {
    const x = (i / (arr.length - 1)) * w
    const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()
}

function Sparkline({ data }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) drawSpark(ref.current, data) }, [data])
  return <canvas ref={ref} className="w-20 h-8" />
}

function Skeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-white/5 animate-pulse">
      <div className="w-8 h-4 bg-white/5 rounded" />
      <div className="w-5 h-5 bg-white/10 rounded-full" />
      <div className="flex-1 h-4 bg-white/5 rounded" />
      <div className="w-20 h-4 bg-white/5 rounded" />
      <div className="w-16 h-4 bg-white/5 rounded" />
    </div>
  ))
}

export default function crypto_prices() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currency, setCurrency] = useState('inr')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('market_cap_rank')
  const [sortDir, setSortDir] = useState('asc')
  const [tab, setTab] = useState('all')
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] } catch { return [] }
  })
  const [btcDom, setBtcDom] = useState(null)
  const [prevPrices, setPrevPrices] = useState({})
  const [flashes, setFlashes] = useState({})

  const fetchCoins = useCallback(async () => {
    try {
      setError(null)
      const url = `${API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()

      // Detect price changes for flash animation
      setPrevPrices(prev => {
        const newFlashes = {}
        data.forEach(c => {
          if (prev[c.id]) {
            const diff = c.current_price - prev[c.id]
            if (Math.abs(diff) > 0.0001) newFlashes[c.id] = diff > 0 ? 'up' : 'down'
          }
        })
        if (Object.keys(newFlashes).length) {
          setFlashes(f => ({ ...f, ...newFlashes }))
          setTimeout(() => setFlashes(f => { const n = { ...f }; Object.keys(newFlashes).forEach(k => delete n[k]); return n }), 800)
        }
        return Object.fromEntries(data.map(c => [c.id, c.current_price]))
      })

      // BTC dominance
      try {
        const gl = await fetch(`${API_BASE}/global`)
        if (gl.ok) { const gd = await gl.json(); setBtcDom(gd.data?.market_cap_percentage?.btc) }
      } catch {}

      setCoins(data)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }, [currency])

  useEffect(() => { setLoading(true); fetchCoins() }, [fetchCoins])

  // Auto-refresh every 30s
  useEffect(() => { const iv = setInterval(fetchCoins, 30000); return () => clearInterval(iv) }, [fetchCoins])

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(watchlist)) }, [watchlist])

  const toggleWatch = useCallback((id) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  const filtered = useMemo(() => {
    let list = [...coins]
    if (search) { const q = search.toLowerCase(); list = list.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)) }
    if (tab === 'gainers') list = list.filter(c => (c.price_change_percentage_24h || 0) > 0)
    if (tab === 'losers') list = list.filter(c => (c.price_change_percentage_24h || 0) < 0)
    if (tab === 'watchlist') list = list.filter(c => watchlist.includes(c.id))
    list.sort((a, b) => {
      let va = a[sortKey] ?? 0, vb = b[sortKey] ?? 0
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [coins, search, tab, sortKey, sortDir, watchlist])

  const handleSort = useCallback((key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(key === 'market_cap_rank' ? 'asc' : 'desc') }
  }, [sortKey])

  const totalMcap = coins.reduce((a, c) => a + (c.market_cap || 0), 0)
  const totalVol = coins.reduce((a, c) => a + (c.total_volume || 0), 0)
  const ethPrice = coins.find(c => c.symbol === 'eth')?.current_price

  const SortBtn = ({ k, children }) => (
    <button onClick={() => handleSort(k)} className="flex items-center gap-1 hover:text-white transition-colors">
      {children} <span className="text-[10px] opacity-40">{sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>
    </button>
  )

  return (
    <ToolLayout
      title="Crypto Prices Live"
      desc="Real-time cryptocurrency prices for 100 coins. Live market cap, volume, sparkline charts with 30s auto-refresh."
      icon="🪙" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="crypto-prices"
      faq={[
        { q: 'What is cryptocurrency?', a: 'Cryptocurrency is a digital or virtual currency secured by cryptography, operating on decentralized blockchain networks without central authority.' },
        { q: 'How do crypto prices work?', a: 'Crypto prices are determined by supply and demand on exchanges. They change in real-time as buyers and sellers trade.' },
        { q: 'What is market cap?', a: 'Market cap = Current Price × Total Circulating Supply. It measures the total value of a cryptocurrency.' },
      ]}
      howItWorks={[
        'Prices load automatically from CoinGecko API (100 coins by market cap).',
        'Toggle currency between INR, USD, and EUR.',
        'Search coins by name or symbol.',
        'Click column headers to sort by price, change, market cap, or volume.',
        'Star coins to add them to your watchlist. Data auto-refreshes every 30 seconds.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Crypto Prices Live", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/crypto-prices/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-5">

        {/* KPI Cards */}
        {!loading && coins.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Market Cap', value: fmt(totalMcap, currency), color: 'text-amber-400' },
              { label: '24h Volume', value: fmt(totalVol, currency), color: 'text-blue-400' },
              { label: 'BTC Dominance', value: btcDom ? btcDom.toFixed(1) + '%' : '—', color: 'text-orange-400' },
              { label: 'ETH Price', value: ethPrice ? fmt(ethPrice, currency) : '—', color: 'text-cyan-400' },
            ].map((k, i) => (
              <div key={i} className="rounded-2xl border-2 border-white/8 bg-white/[0.04] p-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{k.label}</div>
                <div className={`text-sm font-extrabold ${k.color}`}>{k.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coins..."
            className="flex-1 bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-500" />
          <div className="flex gap-2">
            {Object.keys(CURRENCIES).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all
                  ${currency === c ? 'bg-amber-500 text-white' : 'bg-white/[0.06] text-slate-400 border border-white/8 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[['all', 'All'], ['gainers', '🚀 Gainers'], ['losers', '📉 Losers'], ['watchlist', '⭐ Watchlist']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${tab === val ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-white/[0.04] text-slate-500 border border-white/5 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-white/8 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-8">#</div>
            <div className="w-5"></div>
            <div className="flex-1"><SortBtn k="name">Coin</SortBtn></div>
            <div className="w-24 text-right"><SortBtn k="current_price">Price</SortBtn></div>
            <div className="w-16 text-right hidden sm:block">1h</div>
            <div className="w-16 text-right"><SortBtn k="price_change_percentage_24h_in_currency">24h</SortBtn></div>
            <div className="w-16 text-right hidden sm:block">7d</div>
            <div className="w-24 text-right hidden md:block"><SortBtn k="market_cap">Mkt Cap</SortBtn></div>
            <div className="w-20 hidden lg:block"><SortBtn k="id">Chart</SortBtn></div>
          </div>

          {loading ? <Skeleton /> : error ? (
            <div className="text-center py-10">
              <p className="text-red-400 text-sm mb-3">{error}</p>
              <button onClick={fetchCoins} className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">↻ Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-sm">No coins found</div>
          ) : (
            filtered.map((c, i) => {
              const ch1 = c.price_change_percentage_1h_in_currency || 0
              const ch24 = c.price_change_percentage_24h || 0
              const ch7 = c.price_change_percentage_7d_in_currency || 0
              const flash = flashes[c.id]
              return (
                <div key={c.id}
                  className={`flex items-center gap-4 px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-all duration-200
                    ${flash === 'up' ? 'bg-emerald-500/8' : flash === 'down' ? 'bg-red-500/8' : ''}`}>
                  <div className="w-8 text-xs text-slate-500 font-medium">{c.market_cap_rank}</div>
                  <button onClick={() => toggleWatch(c.id)} className="w-5 text-center">
                    {watchlist.includes(c.id) ? '⭐' : <span className="text-white/10 hover:text-white/30 transition-colors">☆</span>}
                  </button>
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <img src={c.image} alt="" className="w-6 h-6 rounded-full object-cover border border-white/10" loading="lazy" />
                    <span className="text-sm font-bold text-white truncate">{c.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">{c.symbol}</span>
                  </div>
                  <div className="w-24 text-right text-sm font-bold text-white">{fmt(c.current_price, currency)}</div>
                  <div className={`w-16 text-right text-xs font-bold hidden sm:block ${ch1 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ch1 >= 0 ? '+' : ''}{ch1.toFixed(1)}%
                  </div>
                  <div className={`w-16 text-right text-xs font-bold ${ch24 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ch24 >= 0 ? '+' : ''}{ch24.toFixed(1)}%
                  </div>
                  <div className={`w-16 text-right text-xs font-bold hidden sm:block ${ch7 >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ch7 >= 0 ? '+' : ''}{ch7.toFixed(1)}%
                  </div>
                  <div className="w-24 text-right text-xs font-semibold text-slate-400 hidden md:block">{fmt(c.market_cap, currency)}</div>
                  <div className="w-20 hidden lg:block">
                    {c.sparkline_in_7d?.price && <Sparkline data={c.sparkline_in_7d.price} />}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
