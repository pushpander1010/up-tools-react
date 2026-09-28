import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '–'
const fmtDec = (n) => isFinite(n) ? Number(n).toFixed(2) : '–'

export default function mileage_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('full-tank')
  const [distance, setDistance] = useState('')
  const [fuelLitres, setFuelLitres] = useState('')
  const [startOdo, setStartOdo] = useState('')
  const [endOdo, setEndOdo] = useState('')
  const [fuelFilled, setFuelFilled] = useState('')
  const [fuelPrice, setFuelPrice] = useState('105')
  const [dailyKm, setDailyKm] = useState('')
  const [daysPerMonth, setDaysPerMonth] = useState('30')

  const calculate = useCallback(() => {
    const price = parseFloat(fuelPrice) || 105
    let dist = 0, fuel = 0

    if (mode === 'full-tank') {
      dist = parseFloat(distance) || 0
      fuel = parseFloat(fuelLitres) || 0
    } else {
      const start = parseFloat(startOdo) || 0
      const end = parseFloat(endOdo) || 0
      dist = Math.max(0, end - start)
      fuel = parseFloat(fuelFilled) || 0
    }

    if (dist <= 0 || fuel <= 0) return null

    const kmPerLitre = dist / fuel
    const costPerKm = fuel > 0 ? (fuel * price) / dist : 0
    const daily = parseFloat(dailyKm) || 0
    const days = parseFloat(daysPerMonth) || 30
    const monthlyFuelLitres = daily > 0 ? (daily * days) / kmPerLitre : 0
    const monthlyCost = monthlyFuelLitres * price

    return { kmPerLitre, costPerKm, monthlyFuelLitres, monthlyCost, dist, fuel, price }
  }, [mode, distance, fuelLitres, startOdo, endOdo, fuelFilled, fuelPrice, dailyKm, daysPerMonth])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-amber-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Mileage Calculator — KM/L & Fuel Cost"
      desc="Calculate bike or car mileage using full-tank method or odometer reading. Find km per litre, cost per km, and monthly fuel cost instantly."
      icon="⛽" iconBg="rgba(245,158,11,0.08)"
      category="tools" slug="mileage-calculator"
      faq={[
        { q: "What is the full-tank method for mileage?", a: "Fill the tank completely, note the odometer or reset the trip meter, drive normally until the tank is low, then refill completely. The litres needed to refill divided into the distance driven gives your km/litre." },
        { q: "What is a good mileage for a car in India?", a: "Petrol cars typically deliver 12–18 km/l, diesel cars 18–25 km/l, and bikes 40–70 km/l depending on engine size, driving conditions, and maintenance." },
        { q: "How do I use this Mileage Calculator online free?", a: "Choose full-tank or odometer mode, enter your distance and fuel data, set the fuel price, and click Calculate. Free with no login, works on mobile and desktop." },
        { q: "How is cost per km calculated?", a: "Cost per km = (litres of fuel × price per litre) ÷ distance in km. This gives you the exact fuel cost for every kilometre driven." },
      ]}
      howItWorks={[
        "Select calculation mode: Full-Tank Method or Odometer Reading.",
        "Enter distance driven (km) and fuel consumed (litres), or start/end odometer with fuel filled.",
        "Set fuel price per litre (default ₹105) and optional daily km for monthly cost.",
        "Click Calculate to see mileage (km/l), cost per km, and monthly fuel cost.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Mileage Calculator", "applicationCategory": "UtilityApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Calculation Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className={selectClass}>
              <option value="full-tank">Full-Tank Method</option>
              <option value="odometer">Odometer Reading</option>
            </select>
          </div>

          {mode === 'full-tank' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Distance Driven (km)</label>
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 450" min="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Fuel Filled (litres)</label>
                <input type="number" value={fuelLitres} onChange={(e) => setFuelLitres(e.target.value)}
                  placeholder="e.g. 35" min="0" step="0.1" className={inputClass} />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Start Odometer (km)</label>
                  <input type="number" value={startOdo} onChange={(e) => setStartOdo(e.target.value)}
                    placeholder="e.g. 10000" min="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">End Odometer (km)</label>
                  <input type="number" value={endOdo} onChange={(e) => setEndOdo(e.target.value)}
                    placeholder="e.g. 10450" min="0" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Fuel Filled (litres)</label>
                <input type="number" value={fuelFilled} onChange={(e) => setFuelFilled(e.target.value)}
                  placeholder="e.g. 35" min="0" step="0.1" className={inputClass} />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Fuel Price per Litre (₹)</label>
            <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="105" min="0" step="0.5" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Daily Distance (km)</label>
              <input type="number" value={dailyKm} onChange={(e) => setDailyKm(e.target.value)}
                placeholder="e.g. 40" min="0" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Days / Month</label>
              <input type="number" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)}
                placeholder="30" min="1" max="31" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-center mb-5">
              <div className="text-5xl font-extrabold text-amber-400">{fmtDec(result.kmPerLitre)}</div>
              <div className="text-sm text-slate-400 mt-1">km per litre</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Cost per km', value: fmtINR(result.costPerKm), color: 'text-white' },
                { label: 'Distance', value: result.dist.toLocaleString('en-IN') + ' km', color: 'text-white' },
                { label: 'Fuel Used', value: result.fuel.toFixed(1) + ' L', color: 'text-white' },
                { label: 'Fuel Price', value: fmtINR(result.price) + '/L', color: 'text-slate-300' },
                ...(result.monthlyCost > 0 ? [
                  { label: 'Monthly Fuel', value: result.monthlyFuelLitres.toFixed(1) + ' L', color: 'text-white' },
                  { label: 'Monthly Cost', value: fmtINR(result.monthlyCost), color: 'text-green-400' },
                ] : []),
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⛽</div>
            <p className="text-sm text-slate-600 font-medium">Enter fuel details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
