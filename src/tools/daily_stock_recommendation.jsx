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
  { q: 'What is the daily stock recommendation?', a: 'A mechanical Nifty100 plan published after each market close: a 20-tranche model book plus a short list of illustrative ideas with chart and F&O context.' },
  { q: 'Is this investment advice?', a: 'No. It is a personal research model, not investment advice. The edge is survivorship-biased and has never been tested through a crash. Cash only, no leverage, no F&O trading.' },
  { q: 'How often is it updated?', a: 'Every trading day after the 15:30 IST close. Past plans are available in the archive below.' },
  { q: 'What does chart A / B / C mean?', a: 'A is a healthy uptrend, B is mixed, C is a damaged or falling-knife chart. Grade-C names are excluded from the illustrative idea list.' },
  { q: 'What is the F&O section?', a: 'A live current-expiry open-interest snapshot (PCR, call/put OI). It is descriptive only, with no historical backtest.' },
]

export default function daily_stock_recommendation() {
  const [data, setData] = useState(null)
  const [dates, setDates] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadPlan = useCallback(async (date) => {
    setLoading(true); setError('')
    try {
      const url = date ? `/data/stocks/recommendations/${date}.json` : '/data/stocks/recommendation.json'
      const r = await fetch(url)
      if (!r.ok) throw new Error('plan not available')
      setData(await r.json())
    } catch (e) {
      setError('Could not load the daily plan: ' + e.message)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetch('/data/stocks/recommendations/index.json')
        const j = r.ok ? await r.json() : { dates: [] }
        if (alive) setDates(j.dates || [])
      } catch (_) { if (alive) setDates([]) }
      await loadPlan(null)
    })()
    return () => { alive = false }
  }, [loadPlan])

  const m = data?.market || {}
  const fno = data?.fno || {}

  return (
    <ToolLayout
      title="Daily Stock Recommendation — Nifty100 Plan"
      desc="A brief, daily-updated Nifty100 model plan: the 20-tranche book, short illustrative ideas with one-line reasons, chart grades and live F&O positioning."
      icon="📈" iconBg="rgba(15,23,42,0.06)" category="finance" slug="daily-stock-recommendation"
      faq={faq}
      howItWorks={[
        'Prices refresh after the 15:30 IST close.',
        'The validated rule ranks the Nifty100 universe.',
        'Chart health and live F&O shape the illustrative idea list.',
        'The plan is published here and sent as a short daily brief.',
      ]}
      schema={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Daily Stock Recommendation', applicationCategory: 'FinanceApplication' }}
    >
      <div className="max-w-5xl mx-auto px-4 pb-10 space-y-4">
        {loading || !data ? <Loading error={error} /> : (
          <>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan for {data.date} close</div>
                  <div className="text-2xl font-bold mt-1">{m.gear || '—'}</div>
                  <div className="text-sm text-slate-600 mt-1">Nifty {fmt(m.nifty, 1)} · {fmt(m.dist200, 1)}% vs 200DMA</div>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>{fmt(m.breadth50)}% above 50DMA</div>
                  <div>{fmt(m.breadth200)}% above 200DMA</div>
                  <div>median ADX {fmt(m.median_adx)}</div>
                </div>
              </div>
              <CrossLinks />
            </Card>

            <Card>
              <SectionTitle sub="Backtested 20 overlapping daily tranches — do not replace all names in one day">Model book · top 10</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-3">#</th><th className="pr-3">Symbol</th><th className="pr-3">Weight</th>
                    <th className="pr-3">Chart</th><th className="pr-3">RSI</th><th className="pr-3">ADX</th><th className="pr-3">To 52wH</th>
                  </tr></thead>
                  <tbody>{(data.model_book || []).map(x => (
                    <tr key={x.symbol} className="border-b border-slate-100">
                      <td className="py-2 pr-3 text-slate-500">{x.rank}</td>
                      <td className="pr-3 font-semibold">{x.symbol}</td>
                      <td className="pr-3">{fmt(x.weight, 1)}%</td>
                      <td className="pr-3"><Badge>{x.chart}</Badge></td>
                      <td className="pr-3">{fmt(x.rsi)}</td>
                      <td className="pr-3">{fmt(x.adx)}</td>
                      <td className="pr-3">{x.dist_hi === null ? 'n/a' : fmt(x.dist_hi, 1) + '%'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>

            <Card>
              <SectionTitle sub="Illustrative levels — NOT backtested. Chart C names are excluded.">Today's ideas</SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {(data.actionable || []).map(x => (
                  <div key={x.symbol} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold">{x.symbol}</span>
                      <span className="text-sm text-slate-600">₹{fmt(x.close, 2)}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">{x.reason}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      trigger {fmt(x.trigger)} · stop {fmt(x.stop)} · target {fmt(x.target)} · risk {fmt(x.risk_pct, 1)}%
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2"><Badge>chart {x.chart}</Badge><Badge>{x.fno}</Badge></div>
                  </div>
                ))}
              </div>
              {!data.actionable?.length && <p className="text-sm text-slate-500">No ideas passed the filters today.</p>}
            </Card>

            {!!data.skipped?.length && (
              <Card>
                <SectionTitle sub="Excluded from the illustrative list because their charts are damaged">Skipped</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {data.skipped.map(x => <span key={x.symbol} className="border border-slate-300 bg-gray-50 rounded-lg px-3 py-2 text-sm"><b>{x.symbol}</b> · {x.reason}</span>)}
                </div>
              </Card>
            )}

            <Card>
              <SectionTitle sub={`Live current-expiry snapshot · ${fno.expiry || 'n/a'} · NOT backtested`}>F&O positioning</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                    <th className="py-2 pr-3">Symbol</th><th className="pr-3">PCR</th><th className="pr-3">Call OI</th><th className="pr-3">Put OI</th><th className="pr-3">ATM</th>
                  </tr></thead>
                  <tbody>{(fno.rows || []).slice(0, 12).map(x => (
                    <tr key={x.symbol} className="border-b border-slate-100">
                      <td className="py-2 pr-3 font-semibold">{x.symbol}{x.top_traded ? ' ★' : ''}</td>
                      <td className="pr-3">{fmt(x.pcr, 2)}</td>
                      <td className="pr-3">{fmt(x.call_oi)}</td>
                      <td className="pr-3">{fmt(x.put_oi)}</td>
                      <td className="pr-3">{fmt(x.atm)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">★ = most-traded F&O. Full history on the Historical F&O page.</p>
            </Card>

            <Card>
              <SectionTitle sub="Earlier plans are kept as structured JSON">Archive</SectionTitle>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => loadPlan(null)} className="text-xs font-semibold bg-slate-900 text-white px-3 py-2 rounded-lg">Latest</button>
                {dates.map(d => <button key={d} onClick={() => loadPlan(d)} className="text-xs font-semibold border border-slate-300 bg-gray-50 text-slate-800 px-3 py-2 rounded-lg">{d}</button>)}
              </div>
            </Card>

            <Card className="bg-gray-50">
              <p className="text-xs text-slate-600">{data.disclaimer}</p>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
