import { useState, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const MARKETS = ['NSE', 'BSE', 'NASDAQ', 'NYSE']

const fmt = (v, o = {}) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, ...o }).format(v ?? 0)
const fmtCur = (v, c) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: c || 'INR', maximumFractionDigits: 2 }).format(v ?? 0)
const fmtCompact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 })
const fmtVol = v => (v == null || !Number.isFinite(v)) ? '--' : fmtCompact.format(v)
const fmtShock = v => (v == null || !Number.isFinite(v)) ? '--' : fmt(v, { maximumFractionDigits: 2 }) + 'x'
const fmtPrice = (v, c) => v == null ? '--' : (c ? fmtCur(v, c) : fmt(v))
const fmtScore = s => s == null ? '0' : (s >= 0 ? '+' + s : '' + s)
const fmtDt = iso => { if (!iso) return '--'; const d = new Date(iso); return isNaN(d) ? '--' : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) }

const scoreClass = s => s > 0 ? 'text-emerald-400 bg-emerald-500/15' : s < 0 ? 'text-red-400 bg-red-500/15' : 'text-slate-400 bg-white/[0.06]'
const verdictInfo = total => {
  if (total >= 2) return { cls: 'text-emerald-400 bg-emerald-500/15', label: 'BUY', icon: '🟢' }
  if (total <= -2) return { cls: 'text-red-400 bg-red-500/15', label: 'SELL', icon: '🔴' }
  return { cls: 'text-amber-400 bg-amber-500/15', label: 'HOLD', icon: '🟡' }
}
const rankClass = i => i === 0 ? 'ring-2 ring-amber-400/40' : i === 1 ? 'ring-2 ring-slate-400/30' : i === 2 ? 'ring-2 ring-amber-600/30' : ''

export default function ai_top10_stocks() {
  const [picks, setPicks] = useState([])
  const [market, setMarket] = useState('NSE')
  const [count, setCount] = useState(10)
  const [view, setView] = useState('cards')
  const [status, setStatus] = useState('Loading picks…')
  const [statusOk, setStatusOk] = useState(true)
  const [loading, setLoading] = useState(true)
  const [lastGen, setLastGen] = useState('')
  const [nextUpd, setNextUpd] = useState('')
  const [scanned, setScanned] = useState(0)

  const loadDaily = useCallback(async (force = false) => {
    setLoading(true)
    setStatus('Loading picks…')
    setStatusOk(true)
    try {
      const url = force ? '/top10/daily.json?ts=' + Date.now() : '/top10/daily.json'
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      const marketData = data.markets?.[market]
      setLastGen(fmtDt(data.generatedAt))
      setNextUpd(fmtDt(data.nextUpdateAt))
      if (marketData?.picks?.length) {
        const limit = count === 'ALL' ? marketData.picks.length : Math.min(parseInt(count) || 10, marketData.picks.length)
        setPicks(marketData.picks.slice(0, limit))
        setScanned(marketData.scanned || 0)
        setStatus(market + ' picks ready')
        setStatusOk(true)
      } else {
        setPicks([])
        setScanned(0)
        setStatus('No picks for ' + market + ' yet.')
        setStatusOk(false)
      }
    } catch (e) {
      console.error(e)
      setPicks([])
      setStatus('Failed to load picks. Try Refresh.')
      setStatusOk(false)
    } finally {
      setLoading(false)
    }
  }, [market, count])

  useEffect(() => { loadDaily() }, [loadDaily])

  const exportCsv = () => {
    if (!picks.length) return
    const headers = ['rank','symbol','name','price','currency','entry','t1','t2','stop','ta','fa','news','volume','total','why']
    const rows = picks.map((p, i) => [
      i + 1, p.symbol, p.name || '', p.price || '', p.currency || '',
      p.plan?.entry || '', p.plan?.t1 || '', p.plan?.t2 || '', p.plan?.stop || '',
      p.scores?.ta || '', p.scores?.fa || '', p.scores?.news || '', p.scores?.volume || '', p.scores?.total || '',
      (p.why || '').replace(/,/g, ' ')
    ])
    const csv = [headers, ...rows].map(r => r.map(v => {
      const s = (v || '').toString().replace(/"/g, '""')
      return /[",\n]/.test(s) ? '"' + s + '"' : s
    }).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'top10-' + market + '-' + new Date().toISOString().slice(0, 10) + '.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const avgScore = picks.length ? (picks.reduce((s, p) => s + ((p.scores?.total) || 0), 0) / picks.length).toFixed(1) : '--'
  const bullish = picks.filter(p => (p.scores?.total || 0) >= 2).length

  return (
    <ToolLayout
      title="AI Top 10 Stocks for Tomorrow"
      desc="AI-scored stock picks with entry, targets, stop-loss, technical & fundamental analysis. Updated daily for NSE, BSE, NASDAQ, and NYSE."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="ai" slug="ai-top10-stocks"
      faq={[
        { q: "How are picks generated?", a: "AI combines technical analysis (RSI, SMA crossovers), fundamental data (PE, market cap, earnings), and news sentiment to score each stock." },
        { q: "How often are picks updated?", a: "Picks are generated daily. Check the 'Next Update' timestamp for the next refresh." },
        { q: "Is this financial advice?", a: "No. These are AI-generated scores for educational purposes. Always do your own research before investing." },
      ]}
      howItWorks={[
        "Select a market (NSE, BSE, NASDAQ, NYSE).",
        "Browse AI-scored picks with entry, targets, and stop-loss.",
        "Export to CSV for your watchlist.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "AI Top 10 Stocks", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ai-top10-stocks/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Controls */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Market Tabs */}
            <div className="flex gap-1 bg-black/20 rounded-xl p-1">
              {MARKETS.map(m => (
                <button key={m} onClick={() => setMarket(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    market === m ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
            {/* Count */}
            <select value={count} onChange={e => setCount(e.target.value)}
              className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none [color-scheme:dark]">
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>Top {n}</option>)}
              <option value="ALL">All</option>
            </select>
            {/* View Toggle */}
            <div className="flex gap-1 bg-black/20 rounded-xl p-1">
              <button onClick={() => setView('cards')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${view === 'cards' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Cards</button>
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${view === 'table' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>Table</button>
            </div>
            {/* Actions */}
            <button onClick={() => loadDaily(true)} disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
              🔄 Refresh
            </button>
            <button onClick={exportCsv} disabled={!picks.length}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-40">
              ⬇ CSV
            </button>
          </div>
          {/* Meta */}
          <div className="flex gap-4 text-[10px] text-slate-600">
            {lastGen && <span>Last: {lastGen}</span>}
            {nextUpd && <span>Next: {nextUpd}</span>}
            {scanned > 0 && <span>Scanned: {scanned}</span>}
          </div>
        </div>

        {/* Summary */}
        {picks.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Picks', value: picks.length, color: 'text-blue-400' },
              { label: 'Avg Score', value: avgScore, color: 'text-emerald-400' },
              { label: 'Bullish (≥+2)', value: bullish, color: 'text-amber-400' },
              { label: 'Scanned', value: scanned || '--', color: 'text-slate-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
                <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status */}
        {status && (
          <div className={`p-3 rounded-xl text-sm ${statusOk ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
            {status}
          </div>
        )}

        {/* Cards View */}
        {view === 'cards' && picks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {picks.map((p, i) => {
              const plan = p.plan || {}
              const scores = p.scores || {}
              const metrics = p.metrics || {}
              const v = verdictInfo(scores.total || 0)
              return (
                <div key={i} className={`bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3 ${rankClass(i)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-amber-700/20 text-amber-600' : 'bg-white/[0.06] text-slate-500'}`}>
                        #{i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-white">{p.symbol}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={p.name}>{p.name || '--'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{fmtPrice(p.price, p.currency)}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.cls}`}>{v.icon} {v.label}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: 'TA', val: scores.ta },
                      { label: 'FA', val: scores.fa },
                      { label: 'N', val: scores.news },
                      { label: 'V', val: scores.volume },
                    ].map(s => (
                      <span key={s.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreClass(s.val)}`}>
                        {s.label} {fmtScore(s.val)}
                      </span>
                    ))}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreClass(scores.total)}`}>
                      Σ {fmtScore(scores.total)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-[10px] text-slate-500">Entry</div><div className="text-xs font-bold text-blue-400">{fmt(plan.entry)}</div></div>
                    <div><div className="text-[10px] text-slate-500">T1 / T2</div><div className="text-xs font-bold text-emerald-400">{fmt(plan.t1)} / {fmt(plan.t2)}</div></div>
                    <div><div className="text-[10px] text-slate-500">Stop</div><div className="text-xs font-bold text-red-400">{fmt(plan.stop)}</div></div>
                  </div>
                  {metrics.volumeShock > 0 && (
                    <div className="text-[10px] text-slate-500">
                      Vol {fmtShock(metrics.volumeShock)} — {fmtVol(metrics.lastVolume)} / avg {fmtVol(metrics.averageVolume)}
                    </div>
                  )}
                  {p.why && <div className="text-[10px] text-slate-500 leading-relaxed">{p.why}</div>}
                </div>
              )
            })}
          </div>
        )}

        {/* Table View */}
        {view === 'table' && picks.length > 0 && (
          <div className="overflow-x-auto bg-white/[0.06] border border-white/[0.08] rounded-2xl">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.08]">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Symbol</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Entry</th>
                  <th className="px-3 py-2 text-right">T1</th>
                  <th className="px-3 py-2 text-right">T2</th>
                  <th className="px-3 py-2 text-right">Stop</th>
                  <th className="px-3 py-2 text-center">TA</th>
                  <th className="px-3 py-2 text-center">FA</th>
                  <th className="px-3 py-2 text-center">Σ</th>
                  <th className="px-3 py-2 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {picks.map((p, i) => {
                  const plan = p.plan || {}
                  const scores = p.scores || {}
                  const v = verdictInfo(scores.total || 0)
                  return (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                      <td className="px-3 py-2 font-bold text-white">{p.symbol}</td>
                      <td className="px-3 py-2 text-slate-400 truncate max-w-[120px]" title={p.name}>{p.name || '--'}</td>
                      <td className="px-3 py-2 text-right text-white">{fmtPrice(p.price, p.currency)}</td>
                      <td className="px-3 py-2 text-right text-blue-400">{fmt(plan.entry)}</td>
                      <td className="px-3 py-2 text-right text-emerald-400">{fmt(plan.t1)}</td>
                      <td className="px-3 py-2 text-right text-emerald-400">{fmt(plan.t2)}</td>
                      <td className="px-3 py-2 text-right text-red-400">{fmt(plan.stop)}</td>
                      <td className={`px-3 py-2 text-center ${scoreClass(scores.ta)}`}>{fmtScore(scores.ta)}</td>
                      <td className={`px-3 py-2 text-center ${scoreClass(scores.fa)}`}>{fmtScore(scores.fa)}</td>
                      <td className={`px-3 py-2 text-center font-bold ${scoreClass(scores.total)}`}>{fmtScore(scores.total)}</td>
                      <td className="px-3 py-2 text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.cls}`}>{v.icon} {v.label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && picks.length === 0 && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">No picks for {market} yet.</p>
            <p className="text-xs text-slate-600 mt-1">Check back after the daily run or click Refresh.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
          ⚠️ This is AI-generated analysis for educational purposes only. Not financial advice. Always do your own research before investing.
        </div>
      </div>
    </ToolLayout>
  )
}
