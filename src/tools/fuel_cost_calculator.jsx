import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const CURRENCIES = [
  ['₹', 'INR', '₹'],
  ['$', 'USD', '$'],
  ['€', 'EUR', '€'],
]

const UNITS = [
  ['km', 'km', 'Kilometres'],
  ['miles', 'mi', 'Miles'],
]

const EFFICIENCY_RATINGS = [
  { min: 25, label: 'Excellent', color: 'emerald', emoji: '🏆' },
  { min: 18, label: 'Good', color: 'green', emoji: '👍' },
  { min: 12, label: 'Average', color: 'yellow', emoji: '👌' },
  { min: 8, label: 'Below Average', color: 'orange', emoji: '⚠️' },
  { min: 0, label: 'Poor', color: 'red', emoji: '❌' },
]

function getEfficiencyRating(kmPerLitre) {
  for (const r of EFFICIENCY_RATINGS) {
    if (kmPerLitre >= r.min) return r
  }
  return EFFICIENCY_RATINGS[EFFICIENCY_RATINGS.length - 1]
}

function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (value === undefined || value === null) { return }
    const start = display
    const diff = value - start
    const duration = 300
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{prefix}{typeof value === 'number' ? (Number.isInteger(value) ? Math.round(display) : display.toFixed(1)) : display}</span>
}

export default function fuel_cost_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [distance, setDistance] = useState('')
  const [efficiency, setEfficiency] = useState('')
  const [fuelPrice, setFuelPrice] = useState('')
  const [unit, setUnit] = useState('km')
  const [currency, setCurrency] = useState('₹')
  const [copied, setCopied] = useState(false)
  const [showMonthly, setShowMonthly] = useState(false)
  const [workingDays, setWorkingDays] = useState('22')
  const [roundTrip, setRoundTrip] = useState('')

  const dist = parseFloat(distance) || 0
  const eff = parseFloat(efficiency) || 0
  const price = parseFloat(fuelPrice) || 0
  const days = parseInt(workingDays, 10) || 22
  const rt = parseFloat(roundTrip) || 0

  const result = useMemo(() => {
    if (dist <= 0 || eff <= 0 || price <= 0) return null
    const litresNeeded = dist / eff
    const totalCost = litresNeeded * price
    const costPerKm = totalCost / dist
    const costPerMile = unit === 'miles' ? costPerKm : costPerKm * 1.60934
    const rating = getEfficiencyRating(eff)
    // Monthly estimate
    const monthlyDistance = days * rt
    const monthlyLitres = monthlyDistance / eff
    const monthlyCost = monthlyLitres * price
    // Savings comparison (improve efficiency by 3/6 km/l)
    const savings3 = monthlyDistance > 0 ? monthlyLitres - (monthlyDistance / (eff + 3)) : 0
    const savingsCost3 = savings3 * price
    const savings6 = monthlyDistance > 0 ? monthlyLitres - (monthlyDistance / (eff + 6)) : 0
    const savingsCost6 = savings6 * price
    return {
      litresNeeded, totalCost, costPerKm, costPerMile, rating,
      monthlyDistance, monthlyLitres, monthlyCost,
      savings3, savingsCost3, savings6, savingsCost6,
    }
  }, [dist, eff, price, unit, days, rt])

  const hasResult = result !== null
  const sym = CURRENCIES.find(c => c[0] === currency)?.[2] || currency

  const handleCopy = useCallback(() => {
    if (!result) return
    const lines = [
      `Fuel Cost Calculator`,
      `Distance: ${dist} ${unit}`,
      `Fuel Efficiency: ${eff} km/l`,
      `Fuel Price: ${sym}${price}/litre`,
      ``,
      `Fuel Needed: ${result.litresNeeded.toFixed(2)} litres`,
      `Total Cost: ${sym}${result.totalCost.toFixed(2)}`,
      `Cost per km: ${sym}${result.costPerKm.toFixed(2)}`,
      `Rating: ${result.rating.label}`,
    ]
    if (showMonthly && result.monthlyCost > 0) {
      lines.push(``, `Monthly Commute (22 days): ${sym}${result.monthlyCost.toFixed(2)}`)
    }
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result, dist, unit, eff, price, sym, showMonthly])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-orange-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const btnActive = "bg-orange-500/15 border-orange-500/30 text-orange-400 shadow-lg shadow-orange-500/10"
  const btnInactive = "bg-white/[0.04] border-white/6 text-slate-500 hover:border-white/12 hover:text-slate-300"

  return (
    <ToolLayout
      title="Fuel Cost Calculator"
      desc="Calculate exact fuel cost for your trip. Compare efficiency ratings, monthly commute costs, and savings with better mileage."
      icon="⛽" iconBg="rgba(249,115,22,0.08)"
      category="tools" slug="fuel-cost-calculator"
      faq={[
        { q: 'How do I calculate fuel cost for a trip?', a: 'Enter the distance, your vehicle\'s fuel efficiency (km/l), and current fuel price per litre. The calculator shows exact litres needed and total cost.' },
        { q: 'What is considered good fuel efficiency?', a: 'For cars: 18-25 km/l is excellent, 12-18 km/l is average, below 10 km/l is poor. For SUVs: 12-18 km/l is good. Ratings vary by vehicle type.' },
        { q: 'How can I reduce fuel costs?', a: 'Maintain steady speeds, keep tyres inflated, avoid heavy acceleration, reduce vehicle weight, and plan routes to avoid traffic.' },
      ]}
      howItWorks={[
        'Enter the trip distance in km or miles.',
        'Input your vehicle\'s fuel efficiency (km per litre).',
        'Enter the current fuel price per litre.',
        'Get instant results: litres needed, total cost, and efficiency rating.',
        'Toggle monthly commute mode to see recurring costs and savings.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Fuel Cost Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/fuel-cost-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Unit & Currency Toggles ─── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Distance Unit */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Distance Unit</label>
            <div className="grid grid-cols-2 gap-2">
              {UNITS.map(([u, abbr, label]) => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200
                    ${unit === u ? btnActive : btnInactive}`}>
                  {abbr}
                </button>
              ))}
            </div>
          </div>
          {/* Currency */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {CURRENCIES.map(([s, code]) => (
                <button key={code} onClick={() => setCurrency(s)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200
                    ${currency === s ? btnActive : btnInactive}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Inputs ─── */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Trip Distance ({unit})</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-500/30 group-focus-within:text-orange-400 transition-colors">
                {unit === 'km' ? '🛣️' : '🛤️'}
              </span>
              <input type="number" value={distance} onChange={e => setDistance(e.target.value)}
                placeholder={`Distance in ${unit}`} min="0"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-12 pr-16 py-4 text-2xl font-extrabold text-white outline-none
                  focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(249,115,22,0.06)]
                  transition-all duration-300 placeholder:text-slate-500 placeholder:text-base placeholder:font-semibold [color-scheme:dark]" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">{unit}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Fuel Efficiency (km/l)</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-500/30 group-focus-within:text-orange-400 transition-colors">⛽</span>
              <input type="number" value={efficiency} onChange={e => setEfficiency(e.target.value)}
                placeholder="e.g. 18" min="0" step="0.1"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-12 pr-16 py-4 text-2xl font-extrabold text-white outline-none
                  focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(249,115,22,0.06)]
                  transition-all duration-300 placeholder:text-slate-500 placeholder:text-base placeholder:font-semibold [color-scheme:dark]" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">km/l</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Fuel Price (per litre)</label>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-orange-500/30 group-focus-within:text-orange-400 transition-colors">{sym}</span>
              <input type="number" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)}
                placeholder="e.g. 105" min="0" step="0.01"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-14 pr-16 py-4 text-2xl font-extrabold text-white outline-none
                  focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(249,115,22,0.06)]
                  transition-all duration-300 placeholder:text-slate-500 placeholder:text-base placeholder:font-semibold [color-scheme:dark]" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">/L</span>
            </div>
          </div>
        </div>

        {/* ─── Monthly Commute Toggle ─── */}
        <button onClick={() => setShowMonthly(!showMonthly)}
          className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
            ${showMonthly
              ? 'bg-orange-500/8 border-orange-500/20 shadow-lg shadow-orange-500/10'
              : 'bg-white/[0.04] border-white/6 hover:border-white/12'
            }`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200
              ${showMonthly ? 'bg-orange-500 text-white' : 'bg-white/10 text-transparent'}`}>
              {showMonthly && '✓'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">Monthly Commute Estimator</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Calculate recurring fuel costs and savings</div>
            </div>
          </div>
        </button>

        {showMonthly && (
          <div className="grid grid-cols-2 gap-3" style={{ animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Working Days / Month</label>
              <input type="number" value={workingDays} onChange={e => setWorkingDays(e.target.value)}
                placeholder="22" min="1" max="31"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Round Trip Distance ({unit})</label>
              <input type="number" value={roundTrip} onChange={e => setRoundTrip(e.target.value)}
                placeholder={`Round trip ${unit}`} min="0"
                className={inputClass} />
            </div>
          </div>
        )}

        {/* ─── Result ─── */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-orange-500/15 bg-gradient-to-br from-orange-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Trip Cost</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Main Result */}
            <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-5">
              <div className="text-[11px] font-bold text-orange-500/60 uppercase tracking-wider mb-1">Total Fuel Cost</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-400 tracking-tight">
                <AnimatedNumber value={result.totalCost} prefix={sym} />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-xs text-slate-500">
                  {sym}{result.costPerKm.toFixed(2)} / {unit}
                </div>
                <div className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/8"
                  style={{ color: result.rating.color === 'emerald' ? '#34d399' : result.rating.color === 'green' ? '#22c55e' : result.rating.color === 'yellow' ? '#facc15' : result.rating.color === 'orange' ? '#fb923c' : '#f87171' }}>
                  {result.rating.emoji} {result.rating.label}
                </div>
              </div>
            </div>

            {/* Fuel Gauge */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-5">
              <div className="text-xs text-slate-500 font-semibold mb-3">Fuel Gauge</div>
              <div className="relative h-6 rounded-full bg-white/5 overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min((result.litresNeeded / (result.litresNeeded * 1.5)) * 100, 100)}%`,
                    background: `linear-gradient(90deg, rgba(249,115,22,0.5), rgba(249,115,22,0.9))`,
                  }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {result.litresNeeded.toFixed(1)} litres
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-600">0L</span>
                <span className="text-[10px] text-slate-600">Full Tank</span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Distance', value: `${dist} ${unit}`, icon: '🛣️' },
                { label: 'Efficiency', value: `${eff} km/l`, icon: '⛽' },
                { label: 'Litres Needed', value: result.litresNeeded.toFixed(2), icon: '💧' },
                { label: 'Cost per km', value: `${sym}${result.costPerKm.toFixed(2)}`, icon: '💰' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/6">
                  <div className="text-sm mb-0.5">{item.icon}</div>
                  <div className="text-sm font-bold text-white">{item.value}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Monthly Commute */}
            {showMonthly && result.monthlyCost > 0 && (
              <div className="mt-5 p-5 rounded-2xl bg-white/[0.04] border border-white/6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📅</span>
                  <h4 className="text-sm font-bold text-white">Monthly Commute Estimate</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-slate-400">Monthly Distance</span>
                    <span className="text-sm font-bold text-white">{result.monthlyDistance} {unit}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-slate-400">Monthly Fuel</span>
                    <span className="text-sm font-bold text-white">{result.monthlyLitres.toFixed(1)} litres</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-xs text-slate-400">Monthly Cost</span>
                    <span className="text-lg font-extrabold text-orange-400 truncate">{sym}{result.monthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-400">Annual Cost</span>
                    <span className="text-lg font-extrabold text-orange-400 truncate">{sym}{(result.monthlyCost * 12).toFixed(2)}</span>
                  </div>
                </div>

                {/* Savings Comparison */}
                {result.savingsCost3 > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <div className="text-xs font-bold text-emerald-400 mb-2">💡 Savings with Better Efficiency</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">+3 km/l → {(eff + 3).toFixed(0)} km/l</span>
                        <span className="text-sm font-bold text-emerald-400">Save {sym}{result.savingsCost3.toFixed(2)}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">+6 km/l → {(eff + 6).toFixed(0)} km/l</span>
                        <span className="text-sm font-bold text-emerald-400">Save {sym}{result.savingsCost6.toFixed(2)}/mo</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!hasResult && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⛽</div>
            <p className="text-sm text-slate-600 font-medium">Enter distance, efficiency, and fuel price to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
