import { useState, useCallback, useEffect, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STATES = ['Maharashtra', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh', 'Karnataka']

export default function mandi_prices() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [state, setState] = useState('Maharashtra')
  const [commodities, setCommodities] = useState([])
  const [commodity, setCommodity] = useState('')
  const [commodityInput, setCommodityInput] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadedAt, setLoadedAt] = useState(null)

  // Load commodities for selected state
  useEffect(() => {
    let mounted = true
    setCommodities([])
    setCommodity('')
    fetch(`https://mandi-api.onrender.com/v1/commodities?state=${encodeURIComponent(state)}`)
      .then(r => r.json())
      .then(d => { if (mounted && d.data) setCommodities(d.data) })
      .catch(() => {})
    return () => { mounted = false }
  }, [state])

  const fetchPrices = useCallback(async () => {
    const c = commodity || commodityInput.trim()
    if (!c) return
    setLoading(true)
    setError('')
    setData(null)
    jumpTo()
    try {
      const r = await fetch(`https://mandi-api.onrender.com/v1/prices?state=${encodeURIComponent(state)}&commodity=${encodeURIComponent(c)}&limit=30`)
      const d = await r.json()
      if (!d.data || d.data.length === 0) {
        setError('No price data found for that commodity in this state.')
      } else {
        setData(d.data)
        setLoadedAt(new Date().toLocaleString())
      }
    } catch {
      setError('Could not load mandi prices. Please try again.')
    }
    setLoading(false)
  }, [state, commodity, commodityInput, jumpTo])

  const avgModal = useMemo(() => {
    if (!data || !data.length) return 0
    return Math.round(data.reduce((a, p) => a + (p.modal_price || 0), 0) / data.length)
  }, [data])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Mandi Prices India"
      desc="Today's wholesale mandi (APMC) prices for Indian states. Check live onion, tomato, wheat, soybean & more commodity rates per quintal."
      icon="🌾" iconBg="rgba(16,185,129,0.08)"
      category="india" slug="mandi-prices"
      faq={[
        { q: 'What is a mandi price?', a: 'A mandi (APMC) price is the wholesale rate at which agricultural commodities are traded at regulated Agricultural Produce Market Committees across India.' },
        { q: 'Which states are covered?', a: 'Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, and Karnataka — synced daily from data.gov.in.' },
        { q: 'How is the modal price defined?', a: 'The modal price is the most commonly traded price for that commodity in a market on a given day. Min and max show the price range across the day.' },
      ]}
      howItWorks={[
        'Pick a state (defaults to Maharashtra).',
        'Select or type a commodity (e.g. Onion, Tomato, Wheat).',
        'View daily wholesale prices per quintal across APMC markets.',
        'The average modal price summarizes the state-wide rate.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Mandi Prices India", "applicationCategory": "FinanceApplication",
        url: "https://www.uptools.in/mandi-prices/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">State</label>
            <select value={state} onChange={e => setState(e.target.value)} className={inputClass}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Commodity</label>
            <input
              type="text"
              list="commodity-list"
              value={commodity || commodityInput}
              onChange={e => { setCommodity(''); setCommodityInput(e.target.value) }}
              onKeyDown={e => e.key === 'Enter' && fetchPrices()}
              placeholder="e.g. Onion, Tomato, Wheat"
              className={inputClass}
            />
            <datalist id="commodity-list">
              {commodities.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <button onClick={fetchPrices} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50">
          {loading ? '⏳ Fetching mandi prices...' : '🌾 Get Mandi Prices'}
        </button>

        {error && <p className="text-center text-sm text-rose-400">{error}</p>}

        {data && (
          <div ref={resultRef} className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Summary */}
            <div className="rounded-3xl border-2 border-white/8 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Modal Price / quintal</div>
                <div className="text-3xl font-extrabold text-white">₹{avgModal.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500 mt-1">{data[0].commodity} in {state} · {loadedAt}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Markets</div>
                <div className="text-3xl font-extrabold text-emerald-400">{data.length}</div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] overflow-hidden">
              <div className="grid grid-cols-4 px-4 py-3 border-b border-white/8 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-2">Market</div>
                <div className="text-right">Modal</div>
                <div className="text-right hidden sm:block">Range</div>
              </div>
              {data.map((p, i) => (
                <div key={i} className="grid grid-cols-4 items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-all">
                  <div className="col-span-2 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{p.market}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.district} · {p.variety}</div>
                  </div>
                  <div className="text-right text-sm font-extrabold text-emerald-400">₹{p.modal_price?.toLocaleString('en-IN')}</div>
                  <div className="text-right text-[11px] text-slate-400 hidden sm:block font-mono">
                    ₹{p.min_price?.toLocaleString('en-IN')}–{p.max_price?.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-600 text-center">
              Prices in ₹ per quintal · synced daily from data.gov.in via the open Mandi Price API.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
