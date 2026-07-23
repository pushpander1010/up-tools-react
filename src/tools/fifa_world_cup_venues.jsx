import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const VENUES = [
  { name: "Estadio Azteca", fifaName: "Mexico City Stadium", city: "Mexico City", country: "Mexico", countryCode: "MX", capacity: 80824, region: "Central", indoor: false, role: "Opening match" },
  { name: "MetLife Stadium", fifaName: "New York New Jersey Stadium", city: "East Rutherford, NJ", country: "USA", countryCode: "US", capacity: 80663, region: "Eastern", indoor: false, role: "FINAL" },
  { name: "AT&T Stadium", fifaName: "Dallas Stadium", city: "Arlington, TX", country: "USA", countryCode: "US", capacity: 70649, region: "Central", indoor: true, role: "Most matches (9)" },
  { name: "SoFi Stadium", fifaName: "Los Angeles Stadium", city: "Inglewood, CA", country: "USA", countryCode: "US", capacity: 70492, region: "Western", indoor: true, role: null },
  { name: "Arrowhead Stadium", fifaName: "Kansas City Stadium", city: "Kansas City, MO", country: "USA", countryCode: "US", capacity: 69045, region: "Central", indoor: false, role: null },
  { name: "Levi's Stadium", fifaName: "San Francisco Bay Area Stadium", city: "Santa Clara, CA", country: "USA", countryCode: "US", capacity: 68827, region: "Western", indoor: false, role: null },
  { name: "NRG Stadium", fifaName: "Houston Stadium", city: "Houston, TX", country: "USA", countryCode: "US", capacity: 68777, region: "Central", indoor: true, role: null },
  { name: "Lincoln Financial Field", fifaName: "Philadelphia Stadium", city: "Philadelphia, PA", country: "USA", countryCode: "US", capacity: 68324, region: "Eastern", indoor: false, role: null },
  { name: "Mercedes-Benz Stadium", fifaName: "Atlanta Stadium", city: "Atlanta, GA", country: "USA", countryCode: "US", capacity: 68239, region: "Eastern", indoor: true, role: null },
  { name: "Lumen Field", fifaName: "Seattle Stadium", city: "Seattle, WA", country: "USA", countryCode: "US", capacity: 66925, region: "Western", indoor: false, role: null },
  { name: "Hard Rock Stadium", fifaName: "Miami Stadium", city: "Miami Gardens, FL", country: "USA", countryCode: "US", capacity: 64478, region: "Eastern", indoor: false, role: null },
  { name: "Gillette Stadium", fifaName: "Boston Stadium", city: "Foxborough, MA", country: "USA", countryCode: "US", capacity: 64146, region: "Eastern", indoor: false, role: null },
  { name: "BC Place", fifaName: "BC Place Vancouver", city: "Vancouver, BC", country: "Canada", countryCode: "CA", capacity: 52497, region: "Western", indoor: true, role: null },
  { name: "Estadio BBVA", fifaName: "Estadio Monterrey", city: "Guadalupe", country: "Mexico", countryCode: "MX", capacity: 51243, region: "Central", indoor: false, role: null },
  { name: "Estadio Akron", fifaName: "Estadio Guadalajara", city: "Zapopan", country: "Mexico", countryCode: "MX", capacity: 45664, region: "Central", indoor: false, role: null },
  { name: "BMO Field", fifaName: "Toronto Stadium", city: "Toronto, ON", country: "Canada", countryCode: "CA", capacity: 43036, region: "Eastern", indoor: false, role: null },
]

const FLAGS = { US: '🇺🇸', MX: '🇲🇽', CA: '🇨🇦' }
const MAX_CAPACITY = Math.max(...VENUES.map(v => v.capacity))
const REGION_ORDER = { Western: 0, Central: 1, Eastern: 2 }
const REGION_LABELS = { Western: '🌵 Western Region', Central: '🏙️ Central Region', Eastern: '🗽 Eastern Region' }

export default function fifa_world_cup_venues() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('capacity-desc')

  const filteredVenues = useMemo(() => {
    let result = VENUES.filter(v => filter === 'all' || v.countryCode.toLowerCase() === filter)

    if (sort === 'capacity-desc') result.sort((a, b) => b.capacity - a.capacity)
    else if (sort === 'capacity-asc') result.sort((a, b) => a.capacity - b.capacity)
    else if (sort === 'city-asc') result.sort((a, b) => a.city.localeCompare(b.city))
    else if (sort === 'city-desc') result.sort((a, b) => b.city.localeCompare(a.city))

    return result
  }, [filter, sort])

  const grouped = useMemo(() => {
    const groups = {}
    filteredVenues.forEach(v => {
      if (!groups[v.region]) groups[v.region] = []
      groups[v.region].push(v)
    })
    // Sort Western venues by capacity desc
    if (groups.Western) groups.Western.sort((a, b) => b.capacity - a.capacity)
    return groups
  }, [filteredVenues])

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'us', label: '🇺🇸 USA' },
    { key: 'mx', label: '🇲🇽 Mexico' },
    { key: 'ca', label: '🇨🇦 Canada' },
  ]

  const VenueCard = ({ v }) => {
    const pct = ((v.capacity / MAX_CAPACITY) * 100).toFixed(0)
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition-all">
        <div className="text-lg mb-1">🏟️</div>
        <h3 className="text-sm font-bold text-white">{v.name}</h3>
        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{v.fifaName}</div>
        <div className="text-xs text-slate-400 mt-1">{FLAGS[v.countryCode]} {v.city}, {v.country}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {v.role && (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
              v.role === 'FINAL' ? 'bg-amber-500/20 text-amber-400' :
              v.role === 'Opening match' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-indigo-500/20 text-indigo-400'
            }`}>
              {v.role === 'FINAL' ? '🏆 Final' : v.role === 'Opening match' ? '🎬 Opening' : v.role}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/[0.06] text-slate-400">
            {v.indoor ? '🏢 Indoor' : '☀️ Outdoor'}
          </span>
        </div>

        {/* Capacity */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium"><strong className="text-white">{v.capacity.toLocaleString()}</strong> seats</span>
            <span className="text-slate-500">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Venues & Stadiums Guide"
      desc="Complete guide to all 16 FIFA World Cup 2026 venues. Stadium names, capacities, host cities across USA, Mexico, and Canada."
      icon="🏟️" iconBg="rgba(59,130,246,0.08)"
      category="fifa" slug="fifa-world-cup-venues"
      faq={[
        { q: 'How many venues hosted FIFA World Cup 2026 matches?', a: '16 venues across 3 countries: 11 in the United States, 3 in Mexico, and 2 in Canada.' },
        { q: 'Where is the FIFA World Cup 2026 final being held?', a: 'MetLife Stadium in East Rutherford, New Jersey on July 19, 2026. Spain won 1–0 against Argentina.' },
        { q: 'Which stadium hosted the opening match?', a: 'Estadio Azteca in Mexico City — the first stadium to host three World Cup opening matches (1970, 1986, 2026).' },
      ]}
      howItWorks={[
        "Browse all 16 stadiums with detailed info on capacity, location, and match roles.",
        "Use country filters and sort options to find venues by region or size.",
        "Plan travel, accommodation, and match-day logistics.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "FIFA World Cup 2026 Venues Guide", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/fifa-world-cup-venues/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { n: '16', l: 'Total Venues' },
            { n: '3', l: 'Host Countries' },
            { n: '11', l: 'US Cities' },
            { n: '3', l: 'Mexican Cities' },
            { n: '2', l: 'Canadian Cities' },
            { n: '🏆', l: 'Final at MetLife' },
          ].map(s => (
            <div key={s.l} className="p-3 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
              <div className={`font-extrabold ${s.n === '🏆' ? 'text-xl' : 'text-lg'} text-indigo-400`}>{s.n}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f.key ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] border border-white/8 text-slate-400 hover:text-white'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2 text-xs text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]">
            <option value="capacity-desc">Capacity (High-Low)</option>
            <option value="capacity-asc">Capacity (Low-High)</option>
            <option value="city-asc">City (A-Z)</option>
            <option value="city-desc">City (Z-A)</option>
          </select>
        </div>

        {/* Venues by Region */}
        {Object.keys(REGION_ORDER).map(region => {
          const venues = grouped[region]
          if (!venues || venues.length === 0) return null
          return (
            <div key={region}>
              <h3 className="text-sm font-bold text-slate-300 mb-3">{REGION_LABELS[region]}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {venues.map(v => <VenueCard key={v.name} v={v} />)}
              </div>
            </div>
          )
        })}
      </div>
    </ToolLayout>
  )
}
