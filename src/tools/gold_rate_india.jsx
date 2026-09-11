import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmt = (n) => n == null ? '—' : '₹' + Number(n).toLocaleString('en-IN')

const STATE_NOTE = 'State figures = live national rate + typical city spread (indicative, not jeweller-fixed).'

export default function gold_rate_india() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [weight, setWeight] = useState('10')
  const [purity, setPurity] = useState('24K')
  const [making, setMaking] = useState('10')
  const [stateIdx, setStateIdx] = useState(0)
  const [unit, setUnit] = useState('10g')
  const mounted = useRef(true)

  const load = useCallback(async (force = false) => {
    setLoading(true)
    try {
      const url = '/api/gold-rate' + (force ? '?nocache=1&ts=' + Date.now() : '')
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error('Gold API ' + res.status)
      const payload = await res.json()
      if (!mounted.current) return
      setData(payload)
      setError('')
    } catch (e) {
      if (!mounted.current) return
      setError(e instanceof Error ? e.message : 'Failed to load gold rates')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    const t = setInterval(() => load(), 90000)
    return () => { mounted.current = false; clearInterval(t) }
  }, [load])

  const states = data?.rates?.states || []
  const selState = states[stateIdx] || null

  // per-gram rate after state spread (spread is quoted per-10g, so /10)
  const statePerGram = useMemo(() => {
    const base = data?.rates?.perGram?.[purity]
    if (base == null) return null
    const d = selState ? (selState.delta || 0) / 10 : 0
    return Math.round(base + d * (purity === '24K' ? 1 : purity === '22K' ? 22 / 24 : 18 / 24))
  }, [data, purity, selState])

  const value = useMemo(() => {
    const w = parseFloat(weight) || 0
    const m = parseFloat(making) || 0
    if (!w || !statePerGram) return null
    const goldCost = w * statePerGram
    const makingCost = goldCost * m / 100
    const subtotal = goldCost + makingCost
    const gst = subtotal * 0.03
    return { goldCost, makingCost, subtotal, gst, cgst: gst / 2, sgst: gst / 2, total: subtotal + gst }
  }, [weight, making, statePerGram])

  const unitMultiplier = unit === '1g' ? 1 : unit === '8g' ? 8 : unit === '10g' ? 10 : unit === 'tola' ? 11.6638 : 100
  const unitLabel = unit === '1g' ? 'per gram' : unit === '8g' ? 'per 8g (sovereign)' : unit === '10g' ? 'per 10 grams' : unit === 'tola' ? 'per tola (11.66g)' : 'per 100g'
  const unitPrice = (k) => {
    const pg = data?.rates?.perGram?.[k]
    if (pg == null) return null
    return Math.round(pg * unitMultiplier)
  }

  const up = (data?.usdPerOunceChangePct ?? 0) >= 0

  return (
    <ToolLayout
      title="Gold Rate Today in India — 24K, 22K, 18K Live (All States)"
      desc="Live gold rate in India today: 24K, 22K and 18K gold price per gram, per 10g, per tola and per 100g with state-wise table (Mumbai, Delhi, Chennai, Kolkata, Kerala + more). Includes jewellery cost calculator with making charges and 3% GST."
      icon="🥇" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="gold-rate-india"
      faq={[
        { q: 'What is the gold rate today in India?', a: 'This page shows live indicative 24K, 22K and 18K gold prices per gram, per 10g, per tola and per 100g, computed from live international XAU spot × live USD/INR. It refreshes every 90 seconds.' },
        { q: 'Do gold rates differ by state in India?', a: 'Yes, slightly. Local jeweller rates in Mumbai, Delhi, Chennai, Kolkata, Kerala and other cities differ by a few hundred rupees per 10g due to transport, demand and local premiums. This page shows a live national rate plus a state-wise table using typical city spreads — indicative, not jeweller-fixed.' },
        { q: 'Why is 22K gold cheaper than 24K?', a: '24K is 99.9% pure gold. 22K is 91.6% gold alloyed for strength and is the standard for jewellery — its price is 22/24 of the 24K rate. 18K is 75% gold, used for diamond settings.' },
        { q: 'What tax applies on gold jewellery in India?', a: '3% GST applies on the total value (gold + making charges), split as 1.625% CGST + 1.625% SGST roughly (shown as 1.5% + 1.5% on bills). Import duty and TCS rules affect the base price but are already inside the spot-derived rate.' },
        { q: 'How much are making charges on gold jewellery?', a: 'Typically 6–15% of the gold value for machine-made items and 15–25%+ for handmade/antique designs. Some jewellers charge flat per-gram rates instead of %. The calculator lets you model any %.' },
        { q: 'What is one tola of gold in grams?', a: 'One tola = 11.6638 grams, still quoted by many jewellers in North India and for sovereign coins. This page shows per-tola prices for all three purities.' },
        { q: 'Is this the exact jeweller rate?', a: 'No — indicative rates from live spot gold and USD/INR, before making charges and GST. Actual hallmark-certified retail rates vary by jeweller and city. Confirm with your local jeweller before buying.' },
        { q: 'Which API powers the live rate?', a: 'Primary: gold-api.com free XAU spot + open.er-api.com free USD/INR, with Yahoo Finance GC=F × INR=X as fallback for day-change %. No API key or signup needed; your worker caches for 90 seconds.' },
      ]}
      howItWorks={[
        'The UpTools backend fetches live XAU gold spot (USD/oz) and live USD/INR from free no-key APIs, with Yahoo Finance as fallback.',
        'It converts to per-gram INR, derives 22K (×22/24) and 18K (×18/24), and builds per-10g, per-tola and per-100g figures.',
        'A state-wise table adds typical city spreads to the live national rate for 15 major markets.',
        'Pick a state + purity in the calculator to estimate jewellery cost with making charges and 3% GST (CGST+SGST).',
        'Rates auto-refresh every 90 seconds — or hit Refresh now.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Gold Rate Today India — 24K 22K 18K Live All States", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gold-rate-india/",
        "description": "Live gold rate in India: 24K, 22K and 18K per gram, per 10g, per tola with state-wise table, plus jewellery calculator with making charges and GST.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {data ? <>Updated {new Date(data.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST · auto-refresh 90s</> : 'Loading…'}
          </div>
          <button onClick={() => load(true)} disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand/15 border border-brand/30 text-brand-light hover:bg-brand/25 transition-all disabled:opacity-50">
            {loading ? 'Refreshing…' : '⟳ Refresh now'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/8 text-amber-400 text-sm">{error}</div>
        )}

        {/* Unit selector + purity rate cards */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider m-0">Gold Rate — {unitLabel}</h3>
            <div className="flex gap-1.5">
              {[['1g', '1g'], ['8g', '8g'], ['10g', '10g'], ['tola', 'Tola'], ['100g', '100g']].map(([v, l]) => (
                <button key={v} onClick={() => setUnit(v)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${unit === v ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-white/[0.06] text-slate-400 border-white/10 hover:border-white/20'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['24K', '22K', '18K'].map(k => (
              <div key={k} className={`p-5 rounded-2xl border-2 text-center transition-all ${purity === k ? 'bg-amber-500/8 border-amber-500/30' : 'bg-white/[0.05] border-white/8'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">{k} Gold ({(k === '24K' ? '99.9%' : k === '22K' ? '91.6%' : '75%')})</div>
                <div className="text-2xl font-extrabold gradient-text">{fmt(unitPrice(k))}</div>
                <div className="text-[11px] text-slate-500 mt-1">{unitLabel} · {fmt(data?.rates?.perGram?.[k])}/g</div>
                <button onClick={() => setPurity(k)} className={`mt-3 text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${purity === k ? 'bg-amber-500 text-slate-900 border-amber-500' : 'bg-white/[0.06] text-slate-400 border-white/10 hover:border-white/20'}`}>
                  Select for calculator
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Market snapshot */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">Spot Gold (oz, USD)</div>
              <div className="text-base font-extrabold text-white">${Number(data.usdPerOunce).toLocaleString('en-US')}</div>
              <div className={`text-[11px] font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>{up ? '▲' : '▼'} {Math.abs(data.usdPerOunceChangePct ?? 0)}%</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">USD / INR</div>
              <div className="text-base font-extrabold text-white">₹{data.usdInr}</div>
              <div className="text-[11px] text-slate-500">{(data.usdInrChangePct ?? 0)}% today</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">24K per tola</div>
              <div className="text-base font-extrabold text-white">{fmt(data.rates?.perTola?.['24K'])}</div>
              <div className="text-[11px] text-slate-500">11.66g</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">22K per tola</div>
              <div className="text-base font-extrabold text-white">{fmt(data.rates?.perTola?.['22K'])}</div>
              <div className="text-[11px] text-slate-500">11.66g</div>
            </div>
          </div>
        )}

        {data && <p className="text-[11px] text-slate-600 leading-relaxed">{data.source}{(data.providers?.length ? ' Sources: ' + data.providers.join(' + ') + '.' : '')}</p>}

        {/* State-wise table */}
        {states.length > 0 && (
          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
            <h3 className="text-sm font-bold text-slate-300 mb-1">🗺️ State-wise Gold Rate — per 10g (live indicative)</h3>
            <p className="text-[11px] text-slate-500 mb-4">{STATE_NOTE}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 text-left">
                    <th className="py-2 pr-3 font-semibold">State / City</th>
                    <th className="py-2 pr-3 font-semibold text-right">24K / 10g</th>
                    <th className="py-2 pr-3 font-semibold text-right">22K / 10g</th>
                    <th className="py-2 font-semibold text-right">18K / 10g</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((s, i) => (
                    <tr key={s.state} className={`border-t border-white/5 ${i === stateIdx ? 'bg-amber-500/5' : ''}`}>
                      <td className="py-2 pr-3 text-slate-300">
                        <button onClick={() => setStateIdx(i)} className="hover:text-white transition-colors text-left">
                          {i === stateIdx ? '📍 ' : ''}{s.state}
                        </button>
                      </td>
                      <td className="py-2 pr-3 text-right font-bold text-white">{fmt(s.per10g?.['24K'])}</td>
                      <td className="py-2 pr-3 text-right text-slate-300">{fmt(s.per10g?.['22K'])}</td>
                      <td className="py-2 text-right text-slate-300">{fmt(s.per10g?.['18K'])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-600 mt-3">Tap a state to use it in the calculator below.</p>
          </div>
        )}

        {/* Gold value calculator with state + tax */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
          <h3 className="text-sm font-bold text-slate-300 mb-4">🧮 Jewellery Cost Calculator (incl. GST)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Weight (grams)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-amber-500/40 placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Purity</label>
              <select value={purity} onChange={e => setPurity(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-amber-500/40">
                <option className="bg-slate-900">24K</option>
                <option className="bg-slate-900">22K</option>
                <option className="bg-slate-900">18K</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Making charge %</label>
              <input type="number" value={making} onChange={e => setMaking(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-amber-500/40 placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">State</label>
              <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-amber-500/40">
                {states.map((s, i) => <option key={s.state} value={i} className="bg-slate-900">{s.state}</option>)}
              </select>
            </div>
          </div>
          <input type="range" min="0" max="30" step="0.5" value={making} onChange={e => setMaking(e.target.value)} className="w-full mt-4 accent-amber-500" aria-label="Making charge percent" />
          {statePerGram && <p className="text-[11px] text-slate-500 mt-2">Rate used: {fmt(statePerGram)}/g ({purity}{selState ? ' · ' + selState.state : ''})</p>}
          {value && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-slate-500 mb-1">Gold value</div>
                  <div className="font-bold text-white text-sm">{fmt(Math.round(value.goldCost))}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-slate-500 mb-1">Making ({making}%)</div>
                  <div className="font-bold text-white text-sm">{fmt(Math.round(value.makingCost))}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                  <div className="text-slate-500 mb-1">GST 3% (CGST+SGST)</div>
                  <div className="font-bold text-white text-sm">{fmt(Math.round(value.gst))}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                  <div className="text-[10px] text-amber-500/80 font-semibold uppercase tracking-wide mb-0.5">Total payable</div>
                  <div className="text-xl font-extrabold text-white">{fmt(Math.round(value.total))}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600">CGST ≈ {fmt(Math.round(value.cgst))} + SGST ≈ {fmt(Math.round(value.sgst))} (3% on gold + making). Hallmark/BIS charges, if any, are extra per jeweller.</p>
            </div>
          )}
        </div>

        {/* Tax explainer */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] text-xs text-slate-400 leading-relaxed space-y-2">
          <h3 className="text-sm font-bold text-slate-300 m-0">🧾 Tax + Making Charges — how the bill works</h3>
          <p className="m-0">Jeweller bill = (gold weight × {purity} rate{selState ? ' for ' + selState.state : ''}) + making charges (6–25% typically) + 3% GST on the subtotal. Making is negotiable — always ask for per-gram vs % breakup in writing.</p>
          <p className="m-0">24K is rarely used for jewellery (too soft); 22K is the jewellery standard and 18K is common for diamond studs. Buy BIS-hallmarked gold and keep the GST invoice for resale/buyback.</p>
        </div>

        {loading && !data && <div className="text-center text-sm text-slate-500 py-8 animate-pulse">Loading live gold rates…</div>}
      </div>
    </ToolLayout>
  )
}
