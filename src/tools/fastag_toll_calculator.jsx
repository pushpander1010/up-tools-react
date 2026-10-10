import { useState, useCallback } from "react"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const fmtINR = (n) => isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–"

const ROUTES = [
  { id: "delhi-jaipur", label: "Delhi to Jaipur (270 km)", toll: 225, km: 270 },
  { id: "delhi-chandigarh", label: "Delhi to Chandigarh (250 km)", toll: 240, km: 250 },
  { id: "delhi-lucknow", label: "Delhi to Lucknow via Agra Expressway (555 km)", toll: 570, km: 555 },
  { id: "delhi-dehradun", label: "Delhi to Dehradun (255 km)", toll: 200, km: 255 },
  { id: "mumbai-pune", label: "Mumbai to Pune Expressway (95 km)", toll: 320, km: 95 },
  { id: "mumbai-nashik", label: "Mumbai to Nashik (165 km)", toll: 215, km: 165 },
  { id: "bengaluru-chennai", label: "Bengaluru to Chennai (350 km)", toll: 390, km: 350 },
  { id: "bengaluru-hyderabad", label: "Bengaluru to Hyderabad (570 km)", toll: 620, km: 570 },
  { id: "ahmedabad-vadodara", label: "Ahmedabad to Vadodara Expressway (110 km)", toll: 135, km: 110 },
  { id: "chennai-trichy", label: "Chennai to Trichy (330 km)", toll: 340, km: 330 },
  { id: "kolkata-durgapur", label: "Kolkata to Durgapur Expressway (170 km)", toll: 180, km: 170 },
  { id: "hyderabad-vijayawada", label: "Hyderabad to Vijayawada (270 km)", toll: 300, km: 270 },
  { id: "pune-bengaluru", label: "Pune to Bengaluru (840 km)", toll: 850, km: 840 },
  { id: "delhi-amritsar", label: "Delhi to Amritsar (450 km)", toll: 430, km: 450 },
  { id: "jaipur-udaipur", label: "Jaipur to Udaipur (395 km)", toll: 380, km: 395 },
]

const VEHICLES = [
  { id: "car", label: "Car / LMV (1x)", mult: 1 },
  { id: "lcv", label: "LCV / Minibus (1.6x)", mult: 1.6 },
  { id: "bus", label: "Bus / Truck (3x)", mult: 3 },
  { id: "multi", label: "Multi-axle / HCM (4.5x)", mult: 4.5 },
]

export default function fastag_toll_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [route, setRoute] = useState("delhi-jaipur")
  const [vehicle, setVehicle] = useState("car")
  const [trip, setTrip] = useState("single")

  const calculate = useCallback(() => {
    const r = ROUTES.find((x) => x.id === route) || ROUTES[0]
    const v = VEHICLES.find((x) => x.id === vehicle) || VEHICLES[0]
    const single = Math.round(r.toll * v.mult)
    const total = trip === "return" ? Math.round(single * 1.5) : single
    const monthly = total * 40
    const perKm = r.km > 0 ? total / (trip === "return" ? r.km * 2 : r.km) : 0
    return { r, v, single, total, monthly, perKm }
  }, [route, vehicle, trip])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="FASTag Toll Calculator"
      desc="FASTag Toll Calculator - check toll charges between Indian cities by route and vehicle, online free. Instant results, no sign-up, works on mobile."
      icon="🛣️" iconBg="rgba(59,130,246,0.08)"
      category="travel" slug="fastag-toll-calculator"
      faq={[
        { q: "How is toll calculated on Indian highways?", a: "Toll depends on the plazas on your route and vehicle type. Cars pay the base rate, while buses and multi-axle trucks pay 3x to 4.5x. Return trips within 24 hours cost about 1.5x a single trip with FASTag." },
        { q: "How do I use this FASTag Toll Calculator online free?", a: "Select your route, vehicle type and single or return trip above. Toll updates live with no login, on mobile and desktop." },
        { q: "Is FASTag mandatory in India?", a: "Yes, FASTag is mandatory for all vehicles on national highways. Cash lanes charge double the FASTag rate, so keep your tag recharged before travel." },
        { q: "What is the monthly pass rule?", a: "Frequent travellers get a monthly pass for about 50 single trips on one plaza route. This calculator estimates 20 working days of return trips for daily commuters." },
        { q: "Is this FASTag Toll Calculator accurate?", a: "Yes for planning using 2026 plaza rates on popular routes. Rates revise yearly, so confirm on the NHAI or FASTag site before long trips." },
        { q: "Is this FASTag Toll Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Select your highway route from the list.",
        "Pick vehicle type and single or return trip.",
        "Click Calculate to see toll, per-km cost and monthly estimate.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "FASTag Toll Calculator", "applicationCategory": "TravelApplication",
        "url": "https://www.uptools.in/fastag-toll-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Route</label>
            <select value={route} onChange={(e) => setRoute(e.target.value)} className={inputClass}>
              {ROUTES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle</label>
              <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputClass}>
                {VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Trip</label>
              <select value={trip} onChange={(e) => setTrip(e.target.value)} className={inputClass}>
                <option value="single">Single</option>
                <option value="return">Return (1.5x)</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-blue-500/15 bg-gradient-to-br from-blue-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Trip Toll (" + result.v.label.split(" (")[0] + ")", value: fmtINR(result.total), color: "text-blue-400" },
                { label: "Cost per km", value: "₹" + result.perKm.toFixed(2), color: "text-white" },
                { label: "Monthly estimate (20 work days)", value: fmtINR(result.monthly), color: "text-green-400" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium">{result.r.label}. Pay with FASTag to avoid double cash rates.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🛣️</div>
            <p className="text-sm text-slate-600 font-medium">Select a route to check toll charges</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
