import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmt = (n) => n == null ? '—' : '₹' + Number(n).toLocaleString('en-IN')

export default function gold_rate_india() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [weight, setWeight] = useState('10')
  const [purity, setPurity] = useState('24K')
  const [making, setMaking] = useState('8')
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

  const value = useMemo(() => {
    const w = parseFloat(weight) || 0
    const m = parseFloat(making) || 0
    const perGram = data?.rates?.perGram?.[purity]
    if (!w || !perGram) return null
    const goldCost = w * perGram
    const makingCost = goldCost * m / 100
    const gst = (goldCost + makingCost) * 0.03
    return { goldCost, makingCost, gst, total: goldCost + makingCost + gst }
  }, [data, weight, purity, making])

  const up = (data?.usdPerOunceChangePct ?? 0) >= 0

  return (
    <ToolLayout
      title="Gold Rate Today in India — 24K, 22K, 18K (Live)"
      desc="Live gold rate in India today: 24K, 22K and 18K gold price per gram and per 10 grams, updated every minute from international spot gold and USD/INR. Includes a gold value calculator with making charges and GST."
      icon="🥇" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="gold-rate-india"
      faq={[
        { q: 'What is the gold rate today in India?', a: 'This page shows live indicative 24K, 22K and 18K gold prices per gram and per 10 grams, updated from international spot gold (COMEX) converted to rupees. It refreshes every 90 seconds.' },
        { q: 'Why is 22K gold cheaper than 24K?', a: '24K is 99.9% pure gold. 22K is 91.6% gold alloyed with copper/silver for strength and is the standard for jewellery — its price is simply 22/24 of the 24K rate. 18K is 75% gold.' },
        { q: 'How much is making charge on gold jewellery?', a: 'Making charges (wastage) typically run 6–15% of the gold value and vary by city and jeweller. A 3% GST applies on the total (gold + making). The calculator lets you model both.' },
        { q: 'Is this the exact jeweller rate?', a: 'No — these are indicative rates derived from international spot gold and the USD/INR rate. Actual retail rates in Delhi, Mumbai, Chennai and other cities differ slightly by jeweller and include making charges and GST. For hallmark-certified prices check your local jeweller.' },
        { q: 'Does gold price affect gold loans or SGB?', a: 'Yes. Gold loan eligibility and the value of Sovereign Gold Bonds move with the same spot price. SGBs are issued by RBI at a fixed price per gram announced before each tranche.' },
        { q: 'How often does gold price change?', a: 'Gold trades nearly 24×5 globally, so the rupee price changes throughout the day as COMEX spot and the dollar-rupee rate move. During Indian market hours it is most liquid.' },
      ]}
      howItWorks={[
        'The tool calls a live rates API through the UpTools backend, pulling international spot gold and the USD/INR exchange rate.',
        'It converts the per-ounce USD price into per-gram and per-10-gram rates in INR for 24K, 22K and 18K purity.',
        'Enter a weight and purity in the gold value calculator to estimate cost including making charges and 3% GST.',
        'Rates refresh every 90 seconds automatically — or hit Refresh now.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Gold Rate Today India — 24K 22K 18K", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gold-rate-india/",
        "description": "Live gold rate in India: 24K, 22K and 18K per gram and per 10g, plus gold value calculator with making charges and GST.",
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

        {/* Purity rate cards — per 10g */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Gold Rate — per 10 grams</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['24K', '22K', '18K'].map(k => (
              <div key={k} className={`p-5 rounded-2xl border-2 text-center transition-all ${purity === k ? 'bg-amber-500/8 border-amber-500/30' : 'bg-white/[0.05] border-white/8'}`}>
                <div className="text-xs font-bold text-slate-400 mb-1">{k} Gold ({(k === '24K' ? '99.9%' : k === '22K' ? '91.6%' : '75%')})</div>
                <div className="text-2xl font-extrabold gradient-text">{fmt(data?.rates?.per10g?.[k])}</div>
                <div className="text-[11px] text-slate-500 mt-1">per 10g · {fmt(data?.rates?.perGram?.[k])}/g</div>
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
              <div className="text-base font-extrabold text-white">${fmt(data.usdPerOunce)}</div>
              <div className={`text-[11px] font-bold ${up ? 'text-green-400' : 'text-red-400'}`}>{up ? '▲' : '▼'} {Math.abs(data.usdPerOunceChangePct ?? 0)}%</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">USD / INR</div>
              <div className="text-base font-extrabold text-white">{fmt(data.usdInr)}</div>
              <div className="text-[11px] text-slate-500">{(data.usdInrChangePct ?? 0)}% today</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">24K per gram</div>
              <div className="text-base font-extrabold text-white">{fmt(data.rates?.perGram?.['24K'])}</div>
              <div className="text-[11px] text-slate-500">₹{fmt(data.rates?.per10g?.['24K'])} / 10g</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">22K per gram</div>
              <div className="text-base font-extrabold text-white">{fmt(data.rates?.perGram?.['22K'])}</div>
              <div className="text-[11px] text-slate-500">₹{fmt(data.rates?.per10g?.['22K'])} / 10g</div>
            </div>
          </div>
        )}

        {data && <p className="text-[11px] text-slate-600 leading-relaxed">{data.source}</p>}

        {/* Gold value calculator */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
          <h3 className="text-sm font-bold text-slate-300 mb-4">🧮 Gold Value Calculator</h3>
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
            <div className="flex items-end">
              <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <div className="text-[10px] text-amber-500/80 font-semibold uppercase tracking-wide mb-0.5">Est. total (incl. GST)</div>
                <div className="text-xl font-extrabold text-white">{value ? fmt(Math.round(value.total)) : '—'}</div>
              </div>
            </div>
          </div>
          {value && (
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                <div className="text-slate-500 mb-1">Gold value</div>
                <div className="font-bold text-white">{fmt(Math.round(value.goldCost))}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                <div className="text-slate-500 mb-1">Making charges</div>
                <div className="font-bold text-white">{fmt(Math.round(value.makingCost))}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8">
                <div className="text-slate-500 mb-1">GST (3%)</div>
                <div className="font-bold text-white">{fmt(Math.round(value.gst))}</div>
              </div>
            </div>
          )}
        </div>

        {loading && !data && <div className="text-center text-sm text-slate-500 py-8 animate-pulse">Loading live gold rates…</div>}
      </div>
    </ToolLayout>
  )
}