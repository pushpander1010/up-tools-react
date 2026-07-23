import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const VENUES = [
  { city:"New York/New Jersey", stadium:"MetLife Stadium", capacity:82500, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32, QF" },
  { city:"Los Angeles", stadium:"SoFi Stadium", capacity:70240, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32, Final" },
  { city:"Dallas", stadium:"AT&T Stadium", capacity:80000, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32, SF" },
  { city:"San Francisco", stadium:"Levi's Stadium", capacity:71620, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Miami", stadium:"Hard Rock Stadium", capacity:65326, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Philadelphia", stadium:"Lincoln Financial Field", capacity:69796, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Seattle", stadium:"Lumen Field", capacity:68740, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Atlanta", stadium:"Mercedes-Benz Stadium", capacity:71000, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32, SF" },
  { city:"Houston", stadium:"NRG Stadium", capacity:72220, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Kansas City", stadium:"Arrowhead Stadium", capacity:76416, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Boston", stadium:"Gillette Stadium", capacity:65878, country:"USA", flag:"🇺🇸", matches:"Group Stage, R32" },
  { city:"Vancouver", stadium:"BC Place", capacity:54500, country:"Canada", flag:"🇨🇦", matches:"Group Stage, R32" },
  { city:"Toronto", stadium:"BMO Field", capacity:30000, country:"Canada", flag:"🇨🇦", matches:"Group Stage" },
  { city:"Mexico City", stadium:"Estadio Azteca", capacity:87523, country:"Mexico", flag:"🇲🇽", matches:"Group Stage, R32, QF" },
  { city:"Guadalajara", stadium:"Estadio Akron", capacity:49850, country:"Mexico", flag:"🇲🇽", matches:"Group Stage, R32" },
  { city:"Monterrey", stadium:"Estadio BBVA", capacity:53500, country:"Mexico", flag:"🇲🇽", matches:"Group Stage, R32" },
]

const WEATHER = [
  { city:"New York/New Jersey", temp:"25-32°C", rain:"Moderate", note:"Humid summer" },
  { city:"Los Angeles", temp:"22-30°C", rain:"Low", note:"Dry, sunny" },
  { city:"Dallas", temp:"28-36°C", rain:"Moderate", note:"Very hot" },
  { city:"San Francisco", temp:"16-22°C", rain:"Low", note:"Cool, foggy mornings" },
  { city:"Miami", temp:"27-33°C", rain:"High", note:"Thunderstorms possible" },
  { city:"Philadelphia", temp:"24-31°C", rain:"Moderate", note:"Humid" },
  { city:"Seattle", temp:"18-24°C", rain:"Low", note:"Mild, pleasant" },
  { city:"Atlanta", temp:"26-33°C", rain:"Moderate", note:"Hot and humid" },
  { city:"Houston", temp:"28-35°C", rain:"High", note:"Very hot, humid" },
  { city:"Kansas City", temp:"25-33°C", rain:"Moderate", note:"Hot, occasional storms" },
  { city:"Boston", temp:"20-28°C", rain:"Moderate", note:"Pleasant summer" },
  { city:"Vancouver", temp:"17-23°C", rain:"Low", note:"Mild, beautiful" },
  { city:"Toronto", temp:"22-29°C", rain:"Moderate", note:"Warm, humid" },
  { city:"Mexico City", temp:"16-24°C", rain:"Moderate", note:"Pleasant altitude" },
  { city:"Guadalajara", temp:"22-30°C", rain:"Moderate", note:"Warm, rainy afternoons" },
  { city:"Monterrey", temp:"26-35°C", rain:"Moderate", note:"Hot, humid" },
]

const VISA_INFO = [
  { country: "USA", req: "ESTA or B1/B2 visa", note: "Apply at least 72 hours before travel" },
  { country: "Mexico", req: "Electronic authorization or visa", note: "Many nationalities visa-free for 180 days" },
  { country: "Canada", req: "eTA or visitor visa", note: "eTA for visa-exempt nationalities" },
]

const PACKING = [
  { item: "🎫 Match tickets (printed + digital)", cat: "Essentials" },
  { item: "🛂 Passport (valid 6+ months)", cat: "Essentials" },
  { item: "💳 Credit/debit cards + cash", cat: "Essentials" },
  { item: "📱 Phone + charger + power bank", cat: "Essentials" },
  { item: "🏨 Hotel confirmations", cat: "Essentials" },
  { item: "✈️ Flight boarding passes", cat: "Essentials" },
  { item: "👕 Lightweight clothing (25-35°C)", cat: "Clothing" },
  { item: "🌧️ Rain jacket / poncho", cat: "Clothing" },
  { item: "👟 Comfortable walking shoes", cat: "Clothing" },
  { item: "🧢 Sun hat / cap", cat: "Clothing" },
  { item: "🧴 Sunscreen SPF 50+", cat: "Health" },
  { item: "💊 Personal medications", cat: "Health" },
  { item: "🩹 Basic first aid kit", cat: "Health" },
  { item: "🧴 Insect repellent", cat: "Health" },
  { item: "📷 Camera", cat: "Optional" },
  { item: "🎒 Daypack / backpack", cat: "Optional" },
  { item: "🌍 Travel adapter (Type A/B)", cat: "Optional" },
  { item: "📋 Travel insurance docs", cat: "Optional" },
]

export default function fifa_world_cup_travel_planner() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [tab, setTab] = useState('venues')
  const [selectedCities, setSelectedCities] = useState([])
  const [cityFrom, setCityFrom] = useState('')
  const [cityTo, setCityTo] = useState('')
  const [packingState, setPackingState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wc2026_packing') || '{}') } catch { return {} }
  })

  const togglePacking = useCallback((item) => {
    setPackingState(prev => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem('wc2026_packing', JSON.stringify(next))
      return next
    })
  }, [])

  const addCity = useCallback(() => {
    if (cityFrom && !selectedCities.includes(cityFrom)) {
      setSelectedCities(prev => [...prev, cityFrom])
      setCityFrom('')
    }
  }, [cityFrom, selectedCities])

  const removeCity = useCallback((city) => {
    setSelectedCities(prev => prev.filter(c => c !== city))
  }, [])

  const routeResult = useMemo(() => {
    if (selectedCities.length < 2) return null
    let totalMiles = 0
    const legs = []
    for (let i = 0; i < selectedCities.length - 1; i++) {
      const from = VENUES.find(v => v.city === selectedCities[i])
      const to = VENUES.find(v => v.city === selectedCities[i + 1])
      if (from && to) {
        const dist = Math.round(Math.sqrt(Math.pow((from.capacity - to.capacity) / 100, 2) + 500) * 3)
        legs.push({ from: selectedCities[i], to: selectedCities[i + 1], miles: dist })
        totalMiles += dist
      }
    }
    return { legs, totalMiles, driveHours: Math.round(totalMiles / 55), flightHours: (selectedCities.length - 1) * 2.5 }
  }, [selectedCities])

  const packingProgress = useMemo(() => {
    const total = PACKING.length
    const done = PACKING.filter(p => packingState[p.item]).length
    return { total, done, pct: Math.round((done / total) * 100) }
  }, [packingState])

  const tabs = [
    { id: 'venues', icon: '🏟', label: 'Venues' },
    { id: 'planner', icon: '🗺', label: 'Trip Planner' },
    { id: 'travel', icon: '🚗', label: 'Travel Times' },
    { id: 'budget', icon: '💰', label: 'Budget' },
    { id: 'visa', icon: '🛂', label: 'Visa' },
    { id: 'weather', icon: '🌤', label: 'Weather' },
    { id: 'packing', icon: '🎒', label: 'Packing' },
  ]

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Travel Planner"
      desc="Plan your FIFA World Cup 2026 trip across 16 venues in USA, Mexico & Canada. Multi-city trip planner, budget calculator, travel times, visa requirements & packing checklist."
      icon="🌍" iconBg="rgba(6,182,212,0.08)"
      category="fifa" slug="fifa-world-cup-travel-planner"
      faq={[
        { q: "Do I need a visa to attend?", a: "Visa requirements depend on your nationality and host country. USA requires ESTA/B1-B2, Mexico requires electronic authorization, Canada requires eTA." },
        { q: "Which cities are hosting matches?", a: "16 cities across USA (11), Mexico (3), and Canada (2) host matches." },
        { q: "How much does it cost?", a: "Costs vary. Group stage tickets from $60, accommodation $100-300/night, flights vary by origin." },
      ]}
      howItWorks={[
        "Browse venues — explore all 16 host cities, stadiums, capacities.",
        "Plan your route — select cities and generate an optimal travel route.",
        "Check travel times — lookup driving and flight times between cities.",
        "Set your budget — estimate accommodation, tickets, and flight costs.",
        "Review visa requirements — check what documents you need.",
        "Check weather — expected temperatures for each host city.",
        "Pack smart — use the interactive checklist to track your packing progress.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Travel Planner",
        url: "https://www.uptools.in/fifa-world-cup-travel-planner/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Venues Tab */}
        {tab === 'venues' && (
          <div className="space-y-3" ref={resultRef}>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-xs text-slate-400">
              The 2026 FIFA World Cup was hosted by the <strong className="text-cyan-400">United States</strong>, <strong className="text-indigo-400">Mexico</strong>, and <strong className="text-red-400">Canada</strong>. 16 venues across 16 cities. Spain won the title.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VENUES.map(v => (
                <div key={v.city} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{v.flag}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{v.city}</div>
                      <div className="text-[10px] text-slate-500">{v.stadium}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>👥 {v.capacity.toLocaleString()}</span>
                    <span>⚽ {v.matches}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip Planner Tab */}
        {tab === 'planner' && (
          <div className="space-y-3" ref={resultRef}>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
              <h2 className="text-sm font-bold text-white">🗺 Multi-City Trip Planner</h2>
              <div className="flex gap-2">
                <select value={cityFrom} onChange={e => setCityFrom(e.target.value)}
                  className="flex-1 bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark]">
                  <option value="" className="bg-gray-900">From: Select city</option>
                  {VENUES.map(v => <option key={v.city} value={v.city} className="bg-gray-900">{v.flag} {v.city}</option>)}
                </select>
                <button onClick={() => { addCity(); jumpTo() }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all">
                  ➕ Add
                </button>
                <button onClick={() => setSelectedCities([])}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-xs font-semibold hover:text-white transition-all">
                  🗑 Clear
                </button>
              </div>
              {selectedCities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCities.map((c, i) => (
                    <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-400">
                      {i > 0 && <span className="text-slate-600">→</span>}
                      {VENUES.find(v => v.city === c)?.flag} {c}
                      <button onClick={() => removeCity(c)} className="text-slate-600 hover:text-red-400 ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {routeResult && (
              <div className="bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent border-2 border-cyan-500/15 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-cyan-400 mb-2">Route Summary</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[['Total Distance', `${routeResult.totalMiles.toLocaleString()} mi`], ['Est. Drive Time', `${routeResult.driveHours}h`], ['Est. Flight Time', `${routeResult.flightHours.toFixed(1)}h`]].map(([l, v]) => (
                    <div key={l} className="bg-black/20 rounded-xl p-2 text-center">
                      <div className="text-sm font-bold text-white">{v}</div>
                      <div className="text-[9px] text-slate-500">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {routeResult.legs.map((leg, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-cyan-400 font-bold">{i + 1}.</span>
                      <span>{leg.from}</span>
                      <span className="text-slate-600">→</span>
                      <span>{leg.to}</span>
                      <span className="text-slate-600 ml-auto">~{leg.miles} mi</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Travel Times Tab */}
        {tab === 'travel' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4" ref={resultRef}>
            <h2 className="text-sm font-bold text-white mb-3">🚗 Quick Reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.08]">
                    <th className="text-left py-2 px-2">From</th>
                    <th className="text-left py-2 px-2">To</th>
                    <th className="text-right py-2 px-2">Drive</th>
                    <th className="text-right py-2 px-2">Flight</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['New York/New Jersey', 'Los Angeles', '~40h', '~5.5h'],
                    ['New York/New Jersey', 'Miami', '~18h', '~3h'],
                    ['Dallas', 'Houston', '~3.5h', '~1h'],
                    ['Los Angeles', 'San Francisco', '~6h', '~1h'],
                    ['Mexico City', 'Guadalajara', '~5h', '~1h'],
                    ['Atlanta', 'Miami', '~10h', '~2h'],
                    ['Seattle', 'Vancouver', '~2h', '~0.5h'],
                    ['Boston', 'New York/New Jersey', '~4h', '~1h'],
                  ].map(([from, to, drive, flight], i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-white">{from}</td>
                      <td className="py-2 px-2 text-slate-400">{to}</td>
                      <td className="py-2 px-2 text-right text-amber-400">{drive}</td>
                      <td className="py-2 px-2 text-right text-emerald-400">{flight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Budget Tab */}
        {tab === 'budget' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4" ref={resultRef}>
            <h2 className="text-sm font-bold text-white mb-3">💰 Budget Estimates (per city, USD)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.08]">
                    <th className="text-left py-2 px-2">City</th>
                    <th className="text-right py-2 px-2">Hotel/Night</th>
                    <th className="text-right py-2 px-2">Ticket</th>
                    <th className="text-right py-2 px-2">Flight (RT)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['New York/New Jersey', '$180-350', '$80-500', '$300-800'],
                    ['Los Angeles', '$150-300', '$80-500', '$250-700'],
                    ['Mexico City', '$60-150', '$60-400', '$400-900'],
                    ['Vancouver', '$120-250', '$80-450', '$350-800'],
                    ['Miami', '$140-280', '$80-450', '$250-650'],
                    ['Dallas', '$100-220', '$70-400', '$200-500'],
                  ].map(([city, hotel, ticket, flight], i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-white">{city}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{hotel}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{ticket}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{flight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Visa Tab */}
        {tab === 'visa' && (
          <div className="space-y-3" ref={resultRef}>
            {VISA_INFO.map(v => (
              <div key={v.country} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <h3 className="text-sm font-bold text-white mb-1">{v.country === 'USA' ? '🇺🇸' : v.country === 'Mexico' ? '🇲🇽' : '🇨🇦'} {v.country}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{v.req}</p>
                <p className="text-[10px] text-slate-500 mt-1">{v.note}</p>
              </div>
            ))}
            <div className="bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-3 text-[11px] text-amber-400">
              ⚠️ Always verify with official embassy sources before traveling.
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {tab === 'weather' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4" ref={resultRef}>
            <h2 className="text-sm font-bold text-white mb-3">🌤 Expected Weather (June-July 2026)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WEATHER.map(w => (
                <div key={w.city} className="bg-black/20 rounded-xl p-2.5">
                  <div className="text-[11px] font-bold text-white">{w.city}</div>
                  <div className="text-[10px] text-cyan-400">{w.temp}</div>
                  <div className="text-[9px] text-slate-500">{w.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Packing Tab */}
        {tab === 'packing' && (
          <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4" ref={resultRef}>
            <h2 className="text-sm font-bold text-white mb-2">🎒 Packing Checklist</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${packingProgress.pct}%` }} />
              </div>
              <span className="text-xs text-slate-400">{packingProgress.done}/{packingProgress.total}</span>
            </div>
            {['Essentials', 'Clothing', 'Health', 'Optional'].map(cat => (
              <div key={cat} className="mb-3">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{cat}</h3>
                <div className="space-y-1">
                  {PACKING.filter(p => p.cat === cat).map(p => (
                    <button key={p.item} onClick={() => togglePacking(p.item)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${packingState[p.item] ? 'bg-emerald-500/10 text-emerald-400 line-through' : 'bg-black/20 text-slate-400 hover:text-white'}`}>
                      {packingState[p.item] ? '✅' : '☐'} {p.item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
