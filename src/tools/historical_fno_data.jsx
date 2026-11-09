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
  { q: 'What is historical F&O data here?', a: 'A daily snapshot of current-expiry open interest for Nifty100 F&O stocks: put-call ratio, total call OI, total put OI, ATM strike, lot size and spot price.' },
  { q: 'Why is there so little history?', a: 'Collection started on 9 November 2026. One snapshot is added per trading day, so the series grows daily. A rule based on F&O data cannot be backtested until enough snapshots exist.' },
  { q: 'What is PCR?', a: 'Put-Call Ratio = total put open interest divided by total call open interest. It is a descriptive positioning measure, not a prediction.' },
  { q: 'Is this investment advice?', a: 'No. It is descriptive derivatives data for research only, not investment advice.' },
]

function PcrChart({ dates, values, width = 860, height = 180 }) {
  if (!dates.length) return <p className="text-sm text-slate-500">No snapshots yet.</p>
  const min = Math.min(...values), max = Math.max(...values), rng = max - min || 1
  const pts = values.map((v, i) => {
    const px = dates.length === 1 ? width / 2 : (i / (dates.length - 1)) * width
    const py = height - 24 - ((v - min) / rng) * (height - 40)
    return `${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')
  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 'auto' }}>
        <line x1="0" y1={height - 24} x2={width} y2={height - 24} stroke="#cbd5e1" strokeWidth="1" />
        {values.map((v, i) => {
          const px = dates.length === 1 ? width / 2 : (i / (dates.length - 1)) * width
          const py = height - 24 - ((v - min) / rng) * (height - 40)
          return <circle key={i} cx={px} cy={py} r="4" fill="#0f172a" />
        })}
        {dates.length > 1 && <polyline points={pts} fill="none" stroke="#0f172a" strokeWidth="2" />}
      </svg>
      <div className="flex justify-between text-xs text-slate-500 mt-1"><span>{dates[0]}</span><span>PCR {min.toFixed(2)} – {max.toFixed(2)}</span><span>{dates[dates.length - 1]}</span></div>
    </div>
  )
}

export default function historical_fno_data() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [date, setDate] = useState(null)
  const [sym, setSym] = useState(null)

  useEffect(() => {
    let alive = true
    fetch('/data/stocks/fno-history.json')
      .then(r => { if (!r.ok) throw new Error('F&O history not available'); return r.json() })
      .then(j => {
        if (!alive) return
        setData(j)
        const d = (j.days || [])[j.days.length - 1] || null
        setDate(d)
        setSym((j.rows || []).find(r => r.date === d)?.symbol || null)
      })
      .catch(e => { if (alive) setError('Could not load F&O history: ' + e.message) })
    return () => { alive = false }
  }, [])

  const rows = data ? data.rows.filter(r => r.date === date) : []
  const symDates = data && sym ? data.days.filter(d => data.rows.some(r => r.date === d && r.symbol === sym)) : []
  const symPcr = symDates.map(d => data.rows.find(r => r.date === d && r.symbol === sym)?.pcr).filter(v => v !== undefined)

  return (
    <ToolLayout
      title="Historical F&O Data — Nifty100 Open Interest"
      desc="Daily current-expiry open-interest snapshots for Nifty100 F&O stocks: put-call ratio, call and put OI, ATM strike and lot size. History grows one trading day at a time."
      icon="🧮" iconBg="rgba(15,23,42,0.06)" category="finance" slug="historical-fno-data"
      faq={faq}
      howItWorks={[
        'A live OI snapshot is captured after each close.',
        'PCR, call OI, put OI and ATM strike are stored per symbol.',
        'One row per symbol per day is appended to the history.',
        'Pick a date or a symbol to explore the series.',
      ]}
      schema={{ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Nifty100 F&O Open Interest History' }}
    >
      <div className="max-w-6xl mx-auto px-4 pb-10 space-y-4">
        {!data ? <Loading error={error} /> : (
          <>
            <Card>
              <SectionTitle sub="Live snapshots only — no historical backtest is possible yet">F&O history</SectionTitle>
              <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-600">
                <span>started <b className="text-slate-900">{data.started || '—'}</b></span>
                <span><b className="text-slate-900">{data.days.length}</b> days collected</span>
                <span><b className="text-slate-900">{data.rows.length}</b> rows</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Collection began on 9 Nov 2026. Each trading day adds a new snapshot; allow 6–12 months before using this series to validate a rule.</p>
              <CrossLinks />
            </Card>

            <Card>
              <SectionTitle sub="Select a snapshot date">Dates</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {data.days.map(d => (
                  <button key={d} onClick={() => setDate(d)}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg border ${date === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-slate-800 border-slate-300'}`}>{d}</button>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle sub={`${date || '—'} · click a symbol to chart its PCR`}>Open interest snapshot</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-3">Symbol</th><th className="pr-3">PCR</th><th className="pr-3">Call OI</th><th className="pr-3">Put OI</th><th className="pr-3">ATM</th><th className="pr-3">Lot</th><th className="pr-3">Spot</th>
                  </tr></thead>
                  <tbody>{rows.map(r => (
                    <tr key={r.symbol} onClick={() => setSym(r.symbol)}
                      className={`border-b border-slate-100 cursor-pointer ${sym === r.symbol ? 'bg-gray-50' : ''}`}>
                      <td className="py-2 pr-3 font-semibold">{r.symbol}{r.top_traded ? ' ★' : ''}</td>
                      <td className="pr-3">{fmt(r.pcr, 2)}</td>
                      <td className="pr-3">{fmt(r.call_oi)}</td>
                      <td className="pr-3">{fmt(r.put_oi)}</td>
                      <td className="pr-3">{fmt(r.atm)}</td>
                      <td className="pr-3">{fmt(r.lot_size)}</td>
                      <td className="pr-3">{fmt(r.spot, 2)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">★ = most-traded F&O that day.</p>
            </Card>

            <Card>
              <SectionTitle sub={sym || 'Select a symbol'}>PCR history · {sym}</SectionTitle>
              <PcrChart dates={symDates} values={symPcr} />
              <p className="text-xs text-slate-500 mt-2">{symDates.length} snapshot{symDates.length === 1 ? '' : 's'} so far.</p>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
