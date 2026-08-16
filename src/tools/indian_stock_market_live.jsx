import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmtINR = (n) => {
  if (n == null || !Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr'
  if (Math.abs(n) >= 100000) return '₹' + (n / 100000).toFixed(2) + ' Lakh'
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })
}
const fmtNum = (n, d = 2) => n == null || !Number.isFinite(n) ? '—' : Number(n).toLocaleString('en-IN', { maximumFractionDigits: d })
const fmtSigned = (n) => (n == null ? '—' : (n > 0 ? '+' : '') + fmtNum(n))

function Sparkline({ data, width = 140, height = 36, up }) {
  if (!data || data.length < 2) return <div className="text-[10px] text-slate-600">—</div>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * width).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(' ')
  const color = up ? '#34d399' : '#f87171'
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  )
}

function IndexCard({ idx }) {
  const up = (idx.changePct ?? 0) >= 0
  return (
    <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-300">{idx.name}</div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
          {up ? '▲' : '▼'} {Math.abs(idx.changePct ?? 0).toFixed(2)}%
        </span>
      </div>
      <div className="text-xl font-extrabold text-white">{fmtNum(idx.price)}</div>
      <div className={`text-xs font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(idx.change)}</div>
      <div className="flex items-end justify-between gap-2">
        <Sparkline data={idx.sparkline} width={110} height={28} up={up} />
      </div>
    </div>
  )
}

export default function indian_stock_market_live() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('changePct') // changePct | price | name
  const [selected, setSelected] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const mounted = useRef(true)

  const load = useCallback(async (force = false) => {
    setLoading(true)
    try {
      const url = '/api/india-market' + (force ? '?nocache=1&ts=' + Date.now() : '')
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('Market API ' + res.status)
      const payload = await res.json()
      if (!mounted.current) return
      setData(payload)
      setError('')
      setLastUpdated(new Date())
    } catch (e) {
      if (!mounted.current) return
      setError(e instanceof Error ? e.message : 'Failed to load market data')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    const t = setInterval(() => load(), 60000)
    return () => { mounted.current = false; clearInterval(t) }
  }, [load])

  const stocks = useMemo(() => {
    if (!data) return []
    let list = [...data.stocks]
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().replace('nse','').includes(q))
    }
    if (sort === 'changePct') list.sort((a, b) => (b.changePct ?? -Infinity) - (a.changePct ?? -Infinity))
    else if (sort === 'price') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    else list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [data, query, sort])

  const indices = data?.indices || []
  const topGainers = useMemo(() => [...(data?.stocks || [])].sort((a, b) => (b.changePct ?? -Infinity) - (a.changePct ?? -Infinity)).slice(0, 5), [data])
  const topLosers = useMemo(() => [...(data?.stocks || [])].sort((a, b) => (a.changePct ?? Infinity) - (b.changePct ?? Infinity)).slice(0, 5), [data])
  const adv = (data?.stocks || []).filter(s => (s.changePct ?? 0) > 0).length
  const dec = (data?.stocks || []).filter(s => (s.changePct ?? 0) < 0).length

  return (
    <ToolLayout
      title="Indian Stock Market Live: Nifty 50 & Sensex Today"
      desc="Live Nifty 50, Sensex, Bank Nifty and top Indian stock prices with real-time change, 52-week range and 6-month charts. Track today's gainers and losers on the NSE — free, no signup."
      icon="📈" iconBg="rgba(52,211,153,0.08)"
      category="finance" slug="indian-stock-market-live"
      faq={[
        { q: 'What is Nifty 50 today?', a: 'This page shows the live Nifty 50 index value (^NSEI), daily change and percentage move, plus the 50-stock breakdown for large-cap Indian stocks on the NSE. Data updates every minute.' },
        { q: 'What is Sensex today?', a: 'The Sensex (^BSESN) is the BSE benchmark index of 30 large companies. Both Nifty and Sensex move together most days — this page shows both, along with Bank Nifty, Fin Nifty, Nifty Midcap and Nifty IT.' },
        { q: 'Which Indian stocks are gaining today?', a: 'Use the gainers/losers section and sort the stock table by % change to see today\'s top movers across the Nifty 50 universe — free, with 6-month sparklines for every stock.' },
        { q: 'Is the data delayed?', a: 'Yes. Prices come from Yahoo Finance public quotes, which are delayed about 15 minutes on Indian exchanges. It is perfect for tracking, not for placing live intraday trades.' },
        { q: 'What are NSE trading hours?', a: 'The NSE and BSE trade Monday to Friday, 9:15 AM to 3:30 PM IST. Outside these hours the values shown are the last closing levels.' },
      ]}
      howItWorks={[
        'This tool calls a free market-data API through the UpTools backend on page load.',
        'It refreshes automatically every 60 seconds while you keep the page open, or click Refresh now.',
        'Search any stock in the Nifty 50 list, or tap a stock to see its 6-month chart and 52-week range.',
        'The gainers and losers panel shows today\'s best and worst performing large-caps at a glance.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Indian Stock Market Live — Nifty 50 & Sensex", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/indian-stock-market-live/",
        "description": "Live Nifty 50, Sensex, Bank Nifty and top Indian stock prices with daily change and 6-month charts.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {lastUpdated ? <>Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST · auto-refresh 60s</> : 'Loading…'}
            <span className="ml-2 text-slate-600">{data?.marketNote}</span>
          </div>
          <button onClick={() => load(true)} disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand/15 border border-brand/30 text-brand-light hover:bg-brand/25 transition-all disabled:opacity-50">
            {loading ? 'Refreshing…' : '⟳ Refresh now'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 text-amber-400 text-sm">
            {error} — check your connection and hit Refresh.
          </div>
        )}

        {/* Indices */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {indices.map(idx => <IndexCard key={idx.symbol} idx={idx} />)}
        </div>

        {/* Advance/decline summary */}
        {data && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">▲ {adv} advancing</span>
            <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">▼ {dec} declining</span>
            <span className="px-3 py-1.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/8 font-semibold">{data.totalStocks} Nifty 50 stocks tracked</span>
          </div>
        )}

        {/* Gainers / Losers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
            <h3 className="text-sm font-bold text-green-400 mb-3">🚀 Top Gainers Today</h3>
            <div className="space-y-2">
              {topGainers.map(s => (
                <button key={s.symbol} onClick={() => setSelected(s)} className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-all">
                  <span className="text-slate-300 font-semibold">{s.name}</span>
                  <span className="text-green-400 font-bold">+{fmtNum(s.changePct)}%</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
            <h3 className="text-sm font-bold text-red-400 mb-3">📉 Top Losers Today</h3>
            <div className="space-y-2">
              {topLosers.map(s => (
                <button key={s.symbol} onClick={() => setSelected(s)} className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/[0.06] transition-all">
                  <span className="text-slate-300 font-semibold">{s.name}</span>
                  <span className="text-red-400 font-bold">{fmtNum(s.changePct)}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected stock detail */}
        {selected && (() => {
          const up = (selected.changePct ?? 0) >= 0
          return (
            <div className="p-5 rounded-2xl border border-brand/25 bg-brand/[0.04]">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{selected.name}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{selected.symbol.replace('.NS', '')}</span>
                  </div>
                  <div className="text-2xl font-extrabold mt-1">{fmtNum(selected.price)} <span className={`text-sm font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>({fmtSigned(selected.changePct)}%)</span></div>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-300">✕ close</button>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Change: <b className={up ? 'text-green-400' : 'text-red-400'}>{fmtSigned(selected.change)}</b></div>
                  {selected.low52 != null && <div>52-week: <b className="text-slate-300">{fmtNum(selected.low52)} – {fmtNum(selected.high52)}</b></div>}
                  {selected.lastVolume != null && <div>Volume: <b className="text-slate-300">{fmtINR(selected.lastVolume)}</b></div>}
                  <div className="text-slate-600 text-[10px] pt-1">6-month daily closes (delayed quotes)</div>
                </div>
                <Sparkline data={selected.sparkline} width={220} height={56} up={up} />
              </div>
            </div>
          )
        })()}

        {/* Stock table */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-slate-300">🏢 Nifty 50 Stocks</h3>
            <div className="flex items-center gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stock…"
                className="w-44 bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand/40 placeholder:text-slate-600" />
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="bg-white/[0.06] border-2 border-white/8 rounded-xl px-2 py-2 text-xs text-white outline-none focus:border-brand/40">
                <option value="changePct" className="bg-slate-900">% Change</option>
                <option value="price" className="bg-slate-900">Price</option>
                <option value="name" className="bg-slate-900">Name</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="text-slate-500 text-left bg-[#0b1120]">
                  <th className="py-2 pr-3 font-semibold">Stock</th>
                  <th className="py-2 pr-3 font-semibold text-right">Price (₹)</th>
                  <th className="py-2 pr-3 font-semibold text-right">Change</th>
                  <th className="py-2 pr-3 font-semibold text-right">% Change</th>
                  <th className="py-2 font-semibold">6-Month Trend</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map(s => {
                  const up = (s.changePct ?? 0) >= 0
                  return (
                    <tr key={s.symbol} onClick={() => setSelected(s)}
                      className="border-t border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all">
                      <td className="py-2.5 pr-3 text-slate-200 font-semibold">{s.name}</td>
                      <td className="py-2.5 pr-3 text-white font-medium text-right">{fmtNum(s.price)}</td>
                      <td className={`py-2.5 pr-3 text-right font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(s.change)}</td>
                      <td className={`py-2.5 pr-3 text-right font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>{fmtSigned(s.changePct)}%</td>
                      <td className="py-2.5"><Sparkline data={s.sparkline} width={110} height={26} up={up} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!stocks.length && !loading && <div className="py-8 text-center text-slate-500 text-xs">No stocks match “{query}”.</div>}
          </div>
        </div>

        {loading && !data && (
          <div className="text-center text-sm text-slate-500 py-8 animate-pulse">Loading live market data…</div>
        )}
      </div>
    </ToolLayout>
  )
}