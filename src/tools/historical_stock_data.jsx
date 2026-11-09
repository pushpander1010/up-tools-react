import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ToolLayout from '../components/ToolLayout'

function fmt(n, digits = 0) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—'
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function Card({ children, className = '' }) {
  return <section className={`bg-white border border-slate-200 rounded-xl p-5 text-slate-900 ${className}`}>{children}</section>
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-bold">{children}</h2>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function Badge({ children }) {
  return <span className="inline-block border border-slate-300 bg-gray-50 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-md">{children}</span>
}

function CrossLinks() {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Link to="/historical-stock-data/" className="text-xs font-semibold border border-slate-300 bg-gray-50 text-slate-800 px-3 py-2 rounded-lg no-underline">Historical stock data →</Link>
      <Link to="/historical-fno-data/" className="text-xs font-semibold border border-slate-300 bg-gray-50 text-slate-800 px-3 py-2 rounded-lg no-underline">Historical F&O →</Link>
      <Link to="/daily-stock-recommendation/" className="text-xs font-semibold border border-slate-300 bg-gray-50 text-slate-800 px-3 py-2 rounded-lg no-underline">Daily recommendation →</Link>
    </div>
  )
}

function Loading({ error }) {
  if (error) return <Card><p className="text-sm text-slate-700">{error}</p></Card>
  return <Card><p className="text-sm text-slate-500">Loading market data…</p></Card>
}

const faq = [
  { q: 'What historical stock data is available here?', a: 'Daily OHLCV for all 100 Nifty100 constituents, covering the last 504 trading sessions, refreshed every trading day after the 15:30 IST close.' },
  { q: 'How do I use this page?', a: 'Search or click a symbol to see its price chart and the most recent 30 daily OHLCV rows. Use the range buttons to switch between 1, 3, 12 and 24 months.' },
  { q: 'Is the data adjusted for splits and bonuses?', a: 'It is the raw daily close/volume series returned by the market data provider. It is not adjusted for corporate actions and is intended for charting, not accounting.' },
  { q: 'Is this investment advice?', a: 'No. This is historical market data for research only, not investment advice.' },
]

function Spark({ values, width = 90, height = 26 }) {
  if (!values || values.length < 2) return null
  const v = values.filter(x => x !== null && x !== undefined)
  if (v.length < 2) return null
  const min = Math.min(...v), max = Math.max(...v), rng = max - min || 1
  const pts = values.map((x, i) => {
    const px = (i / (values.length - 1)) * width
    const py = height - ((x - min) / rng) * height
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')
  return <svg width={width} height={height} className="inline-block align-middle"><polyline points={pts} fill="none" stroke="#0f172a" strokeWidth="1.5" /></svg>
}

function LineChart({ dates, values, width = 860, height = 240 }) {
  const clean = values.map((v, i) => [i, v === null || v === undefined ? null : v / 100])
  const nums = clean.filter(x => x[1] !== null).map(x => x[1])
  if (nums.length < 2) return <p className="text-sm text-slate-500">Not enough history for this range.</p>
  const min = Math.min(...nums), max = Math.max(...nums), rng = max - min || 1
  const pts = clean.filter(x => x[1] !== null).map(([i, v]) => {
    const px = (i / (clean.length - 1)) * width
    const py = height - 24 - ((v - min) / rng) * (height - 40)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 'auto' }}>
        <line x1="0" y1={height - 24} x2={width} y2={height - 24} stroke="#cbd5e1" strokeWidth="1" />
        <polyline points={pts} fill="none" stroke="#0f172a" strokeWidth="2" />
      </svg>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{dates[0]}</span><span>₹{min.toFixed(2)} – ₹{max.toFixed(2)}</span><span>{dates[dates.length - 1]}</span>
      </div>
    </div>
  )
}

export default function historical_stock_data() {
  const [hist, setHist] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [range, setRange] = useState(252)

  useEffect(() => {
    let alive = true
    fetch('/data/stocks/history.json')
      .then(r => { if (!r.ok) throw new Error('history not available'); return r.json() })
      .then(j => { if (alive) { setHist(j); setSelected(j.symbols?.[0] || null) } })
      .catch(e => { if (alive) setError('Could not load history: ' + e.message) })
    return () => { alive = false }
  }, [])

  const list = hist ? hist.symbols.filter(s =>
    !query || s.toLowerCase().includes(query.toLowerCase()) ||
    (hist.names?.[s] || '').toLowerCase().includes(query.toLowerCase())) : []

  const idx = hist && selected ? hist.symbols.indexOf(selected) : -1
  const vals = idx >= 0 ? (hist.closes[idx] || []).slice(-range) : []
  const dts = hist ? hist.dates.slice(-range) : []
  const recent = idx >= 0 ? [...(hist.recent?.[selected] || [])].reverse() : []

  return (
    <ToolLayout
      title="Historical Stock Data — Nifty100 Daily OHLCV"
      desc="Browse 2 years of daily open, high, low, close and volume for all 100 Nifty100 stocks. Search a symbol, view its price chart and inspect the latest daily bars."
      icon="🗂️" iconBg="rgba(15,23,42,0.06)" category="finance" slug="historical-stock-data"
      faq={faq}
      howItWorks={[
        'Daily candles are collected after each market close.',
        'The last 504 sessions for all Nifty100 names are exported.',
        'Pick a symbol and a range to chart the close price.',
        'The latest 30 OHLCV bars are shown in the table.',
      ]}
      schema={{ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Nifty100 Historical Daily OHLCV' }}
    >
      <div className="max-w-6xl mx-auto px-4 pb-10 space-y-4">
        {!hist ? <Loading error={error} /> : (
          <>
            <Card>
              <SectionTitle sub="Raw daily bars from the market data provider — research use only">Nifty100 daily history</SectionTitle>
              <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-600">
                <span><b className="text-slate-900">{hist.symbols.length}</b> symbols</span>
                <span><b className="text-slate-900">{hist.dates.length}</b> sessions</span>
                <span><b className="text-slate-900">{hist.dates[0]}</b> → <b className="text-slate-900">{hist.as_of}</b></span>
              </div>
              <CrossLinks />
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
              <Card>
                <SectionTitle sub="Click a row to chart it">Symbols</SectionTitle>
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search symbol or company…"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm mb-3 outline-none"
                />
                <div className="max-h-[520px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-200 sticky top-0 bg-white">
                      <th className="py-2 pr-2">Symbol</th><th className="pr-2">Last</th><th className="pr-2">1D</th><th className="pr-2">60d</th>
                    </tr></thead>
                    <tbody>{list.map(s => {
                      const i = hist.symbols.indexOf(s)
                      const cl = (hist.closes[i] || []).slice(-60)
                      const last = cl[cl.length - 1], prev = cl[cl.length - 2]
                      const chg = last && prev ? ((last / prev) - 1) * 100 : 0
                      return (
                        <tr key={s} onClick={() => setSelected(s)}
                          className={`border-b border-slate-100 cursor-pointer ${selected === s ? 'bg-gray-50' : ''}`}>
                          <td className="py-2 pr-2 font-semibold">{s}</td>
                          <td className="pr-2">₹{last ? (last / 100).toFixed(2) : '—'}</td>
                          <td className={`pr-2 ${chg >= 0 ? 'text-slate-900' : 'text-slate-500'}`}>{chg.toFixed(2)}%</td>
                          <td className="pr-2"><Spark values={cl} /></td>
                        </tr>
                      )
                    })}</tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionTitle sub={hist.names?.[selected] || selected}>{selected} · close price</SectionTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[30, 90, 252, 504].map(r => (
                    <button key={r} onClick={() => setRange(r)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${range === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-slate-800 border-slate-300'}`}>
                      {r === 30 ? '1M' : r === 90 ? '3M' : r === 252 ? '1Y' : '2Y'}
                    </button>
                  ))}
                </div>
                <LineChart dates={dts} values={vals} />
                <SectionTitle sub="Most recent daily bars">OHLCV table</SectionTitle>
                <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left text-slate-500 border-b border-slate-200 sticky top-0 bg-white">
                      <th className="py-2 pr-2">Date</th><th className="pr-2">Open</th><th className="pr-2">High</th><th className="pr-2">Low</th><th className="pr-2">Close</th><th className="pr-2">Volume</th>
                    </tr></thead>
                    <tbody>{recent.map((r, k) => (
                      <tr key={k} className="border-b border-slate-100">
                        <td className="py-1.5 pr-2">{r[0]}</td><td className="pr-2">{r[1]}</td><td className="pr-2">{r[2]}</td>
                        <td className="pr-2">{r[3]}</td><td className="pr-2 font-semibold">{r[4]}</td><td className="pr-2">{fmt(r[5])}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
