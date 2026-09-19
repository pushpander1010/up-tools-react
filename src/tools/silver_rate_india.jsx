import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmt = (n) => n == null || isNaN(n) ? '—' : '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

// Silver spot (XAG USD/oz) -> INR/gram via /proxy Yahoo SI=F + /api/rates USD/INR
export default function silver_rate_india() {
  const [spot, setSpot] = useState(null)
  const [usdInr, setUsdInr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [weight, setWeight] = useState('100')
  const [making, setMaking] = useState('12')
  const mounted = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const siUrl = 'https://query2.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=2d'
      const [siRes, fxRes] = await Promise.all([
        fetch('/proxy/?u=' + encodeURIComponent(siUrl), { headers: { Accept: 'application/json' } }),
        fetch('/api/rates', { headers: { Accept: 'application/json' } }),
      ])
      if (!siRes.ok) throw new Error('Silver feed ' + siRes.status)
      if (!fxRes.ok) throw new Error('FX feed ' + fxRes.status)
      const si = await siRes.json()
      const fx = await fxRes.json()
      const closes = si?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || []
      const valid = closes.filter(v => v != null)
      const last = valid[valid.length - 1]
      const prev = valid.length > 1 ? valid[valid.length - 2] : null
      if (last == null) throw new Error('Silver spot unavailable')
      const inr = fx?.rates?.INR
      if (!inr) throw new Error('USD/INR unavailable')
      if (!mounted.current) return
      setSpot({ usd: last, chgPct: prev ? ((last - prev) / prev) * 100 : 0 })
      setUsdInr(inr)
      setError('')
    } catch (e) {
      if (!mounted.current) return
      setError(e instanceof Error ? e.message : 'Failed to load silver rates')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    const t = setInterval(() => load(), 120000)
    return () => { mounted.current = false; clearInterval(t) }
  }, [load])

  const perGram = useMemo(() => {
    if (!spot || !usdInr) return null
    return (spot.usd * usdInr) / 31.1035
  }, [spot, usdInr])

  const value = useMemo(() => {
    const w = parseFloat(weight) || 0
    const m = parseFloat(making) || 0
    if (!w || !perGram) return null
    const metal = w * perGram
    const makingCost = metal * m / 100
    const subtotal = metal + makingCost
    const gst = subtotal * 0.03
    return { metal, makingCost, subtotal, gst, total: subtotal + gst }
  }, [weight, making, perGram])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold text-sm outline-none focus:border-slate-300/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Silver Rate Today in India — Live Price per Gram, 10g, 1kg"
      desc="Live silver rate in India today: price per gram, per 10g and per kg from international spot × USD/INR, plus a silver jewellery/coin cost calculator with making charges and 3% GST."
      icon="🥈" iconBg="rgba(148,163,184,0.08)"
      category="finance" slug="silver-rate-india"
      faq={[
        { q: 'What is the silver rate today in India?', a: 'This page derives a live indicative silver price per gram from international XAG spot (Yahoo SI=F) × live USD/INR, refreshed every 2 minutes, and shows per-10g and per-kg figures plus a jewellery cost calculator.' },
        { q: 'How is the silver price calculated?', a: 'Spot silver is quoted in USD per troy ounce. Divide by 31.1035 for USD/gram, multiply by live USD/INR for INR/gram. Making charges and 3% GST are added in the calculator for finished items.' },
        { q: 'What tax applies on silver in India?', a: '3% GST on the total (metal + making), same as gold. Silver ETFs and digital silver may carry different expense ratios but physical retail bills show 3% GST.' },
        { q: 'What purity is retail silver?', a: 'Most Indian retail silver (coins, utensils, jewellery) is 999 fine (99.9% pure). Antique or tribal jewellery may be lower — always check the BIS hallmark stamp.' },
        { q: 'Why does the jeweller rate differ?', a: 'Local rates add dealer premiums, transport and demand spreads over spot, plus their own making structure. This page is indicative — confirm the final bill with your jeweller.' },
        { q: 'Is my data kept private?', a: 'Yes. Everything runs in your browser. Nothing you enter is uploaded or stored.' },
      ]}
      howItWorks={[
        'The page fetches live silver spot (SI=F) and live USD/INR through free endpoints.',
        'It converts USD/oz to INR/gram and builds per-10g and per-kg figures.',
        'Enter weight + making % to estimate finished cost with 3% GST.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Silver Rate Today India — Live per Gram 10g 1kg", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/silver-rate-india/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">{spot ? <>Spot ${Number(spot.usd).toFixed(2)}/oz · ₹{usdInr}/$ · auto-refresh 2 min</> : 'Loading…'}</div>
          <button onClick={load} disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/10 text-slate-200 hover:bg-white/10 transition-all disabled:opacity-50">
            {loading ? 'Refreshing…' : '⟳ Refresh now'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 text-amber-400 text-sm">{error} — showing calculator with last/manual context only.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['Per gram', perGram],
            ['Per 10g', perGram != null ? perGram * 10 : null],
            ['Per 1kg', perGram != null ? perGram * 1000 : null],
          ].map(([label, v]) => (
            <div key={label} className="p-5 rounded-2xl border-2 border-white/8 bg-white/[0.05] text-center">
              <div className="text-xs font-bold text-slate-400 mb-1">{label} (999 fine)</div>
              <div className="text-2xl font-extrabold text-white">{fmt(v)}</div>
              {spot && <div className={`text-[11px] font-bold mt-1 ${spot.chgPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>{spot.chgPct >= 0 ? '▲' : '▼'} {Math.abs(spot.chgPct).toFixed(2)}% spot</div>}
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
          <h3 className="text-sm font-bold text-slate-300 mb-4">🧮 Silver Cost Calculator (incl. 3% GST)</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Weight (grams)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Making charges (%)</label>
              <input type="number" value={making} onChange={e => setMaking(e.target.value)} className={inputClass} />
            </div>
          </div>
          {value ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Metal value</span><span className="text-slate-200 font-semibold">{fmt(value.metal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Making ({making || 0}%)</span><span className="text-slate-200 font-semibold">{fmt(value.makingCost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">GST (3%)</span><span className="text-slate-200 font-semibold">{fmt(value.gst)}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/8"><span className="text-white font-bold">Total payable</span><span className="text-white font-extrabold text-base">{fmt(value.total)}</span></div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Live rate still loading — enter weight anyway; totals appear once the feed connects.</p>
          )}
          <p className="text-[11px] text-slate-600 mt-3">Indicative only: jeweller premiums and exact making structure vary. Confirm before buying.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
