import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const RASHI = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHI_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const PLANET_SYM = { Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋' }

// North Indian chart geometry (400x400 diamond)
const O=[200,200]
const N=[200,30], E=[370,200], S=[200,370], W=[30,200]
const mNW=[115,115], mNE=[285,115], mSE=[285,285], mSW=[115,285]
const HOUSE_POLY = {
  1:[N,mNW,mNE], 2:[E,mNE,O], 3:[N,mNE,O], 4:[E,mNE,mSE],
  5:[S,mSE,O], 6:[E,mSE,O], 7:[S,mSE,mSW], 8:[W,mSW,O],
  9:[S,mSW,O], 10:[W,mSW,mNW], 11:[N,mNW,O], 12:[W,mNW,O],
}
function centroid(pts){ const x=pts.reduce((a,p)=>a+p[0],0)/pts.length; const y=pts.reduce((a,p)=>a+p[1],0)/pts.length; return [x,y] }
const HOUSE_CENTER = {}
for (const k in HOUSE_POLY) HOUSE_CENTER[k] = centroid(HOUSE_POLY[k])
function poly(pts){ return pts.map(p=>p.join(',')).join(' ') }

function inputClass(){ return "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]" }

export default function kundli() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [place, setPlace] = useState('')
  const [coords, setCoords] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoMsg, setGeoMsg] = useState('')

  const geocodePlace = useCallback(async () => {
    if (!place.trim()) { setError('Enter a birth place (city) or use your location.'); return null }
    setGeoMsg('Looking up place…'); setError('')
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`)
      const j = await r.json()
      if (j && j[0]) {
        const c = { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon) }
        setCoords(c); setGeoMsg(`Located: ${j[0].display_name.split(',')[0]}`); return c
      }
      setGeoMsg(''); setError('Could not find that place. Use "Use my location" or enter coordinates.'); return null
    } catch { setGeoMsg(''); setError('Place lookup failed. Use "Use my location" or enter coordinates.'); return null }
  }, [place])

  const useMyLocation = useCallback(() => {
    setError('')
    if (!navigator.geolocation) { setError('Geolocation not supported in this browser.'); return }
    navigator.geolocation.getCurrentPosition(
      pos => { const c={lat:+pos.coords.latitude.toFixed(5), lon:+pos.coords.longitude.toFixed(5)}; setCoords(c); setPlace('My location'); setGeoMsg(`Coordinates: ${c.lat}, ${c.lon}`) },
      () => setError('Could not get your location. Enter a birth place instead.')
    )
  }, [])

  const generate = useCallback(async () => {
    if (!date) { setError('Enter the date of birth.'); return }
    if (!time) { setError('Enter the time of birth.'); return }
    let c = coords
    if (!c) c = await geocodePlace()
    if (!c) return
    setLoading(true); setError(''); setData(null)
    try {
      const t = time.length === 5 ? time : time.slice(0,5)
      const res = await fetch(`https://backend.uptools.in/api/kundli?date=${encodeURIComponent(date)}&time=${encodeURIComponent(t)}&lat=${c.lat}&lon=${c.lon}`)
      const j = await res.json()
      if (j.error || j.detail) throw new Error(j.detail || 'Error')
      setData(j); jumpTo()
    } catch (e) { setError('Could not generate kundli. Check details and try again.') }
    setLoading(false)
  }, [date, time, coords, geocodePlace, jumpTo])

  // Chart: rashi of each house = (lagna_rashi + house - 1) % 12
  const chartHouses = useCallback(() => {
    if (!data) return []
    const lagnaIdx = data.lagna.rashi.index
    const byHouse = {}
    for (const p of data.planets) { (byHouse[p.house] = byHouse[p.house] || []).push(p.name) }
    return Array.from({length:12}, (_,i) => {
      const h = i+1
      return { house: h, rashi: (lagnaIdx + h - 1) % 12, planets: byHouse[h] || [] }
    })
  }, [data])

  const houses = chartHouses()

  return (
    <ToolLayout
      title="Kundli – Create Free Online Kundli by Date of Birth and Time"
      desc="Make a free online kundli (janam kundli) by date of birth, time, and place. Accurate Vedic birth chart with Lagna, all 9 planet positions, houses, and Mangal Dosha — computed with Swiss Ephemeris."
      icon="🪔" iconBg="rgba(99,102,241,0.08)"
      category="india" slug="kundli"
      faq={[
        { q: "What is a kundli?", a: "A kundli (janam kundli) is a Vedic birth chart that maps the position of the planets at your exact date, time, and place of birth into 12 houses and 12 zodiac signs (rashis). It is the foundation of Indian astrology." },
        { q: "How is a kundli made?", a: "Enter your date of birth, time of birth, and birth place. We compute the sidereal (Lahiri) position of all 9 planets using the Swiss Ephemeris, find your Lagna (ascendant), and place the planets into 12 houses." },
        { q: "What is Lagna in a kundli?", a: "Lagna (the ascendant) is the zodiac sign rising on the eastern horizon at your birth moment. It is the most important reference point in a kundli and sets the first house." },
        { q: "What is Mangal Dosha?", a: "Mangal Dosha occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from the Lagna. Our kundli automatically checks and reports whether Mangal Dosha is present." },
        { q: "Is the kundli accurate?", a: "Yes. Positions are computed with the Swiss Ephemeris in the Lahiri sidereal system — the same engine used by professional astrology software. Accuracy depends on entering your exact birth time and place." },
        { q: "Do I need an exact birth time?", a: "An exact birth time is needed for a precise Lagna and house positions. If you are unsure of the time, the chart will be approximate." },
        { q: "What are the 9 planets (Grahas) in a kundli?", a: "Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu. Rahu and Ketu are the lunar nodes — Rahu is the north node and Ketu is always exactly opposite it." },
        { q: "Is the kundli maker free?", a: "Yes, it is completely free with no sign-up. Generate unlimited kundli charts for yourself, family, or friends." },
      ]}
      howItWorks={[
        "Enter the date of birth and exact time of birth.",
        "Enter the birth place (or use your location) to get coordinates.",
        "Click Generate to create your Vedic kundli chart.",
        "View Lagna, all 9 planet positions, houses, and Mangal Dosha.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Kundli Maker", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/kundli/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Date of Birth</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inputClass()} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Time of Birth</label>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inputClass()} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Place of Birth</label>
            <div className="flex gap-2">
              <input type="text" value={place} onChange={e=>{setPlace(e.target.value); setCoords(null)}} placeholder="e.g. New Delhi, India"
                className={inputClass() + ' flex-1'} />
              <button onClick={useMyLocation} className="shrink-0 px-3 py-3 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                📍 My Location
              </button>
            </div>
            {geoMsg && <p className="text-xs text-slate-500 mt-1.5">{geoMsg}</p>}
          </div>
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
          <button onClick={generate} disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {loading ? '⏳ Generating Kundli…' : '🪔 Generate Kundli'}
          </button>
        </div>

        {!data && !loading && !error && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🪔</div>
            <p className="text-sm text-slate-600 font-medium">Enter birth details to create a Vedic kundli</p>
          </div>
        )}

        {data && (
          <div ref={resultRef} className="space-y-5">
            {/* Summary */}
            <div className="bg-gradient-to-br from-indigo-500/[0.08] via-white/[0.01] to-transparent rounded-3xl border-2 border-indigo-500/15 p-5">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div><span className="text-slate-500 font-semibold">Lagna: </span><span className="text-white font-bold">{data.lagna.rashi.symbol} {data.lagna.rashi.name}</span></div>
                <div><span className="text-slate-500 font-semibold">Moon Sign: </span><span className="text-white font-bold">{data.moon_sign}</span></div>
                <div><span className="text-slate-500 font-semibold">Sun Sign: </span><span className="text-white font-bold">{data.sun_sign}</span></div>
                <div><span className="text-slate-500 font-semibold">Mangal Dosha: </span>
                  <span className={data.mangal_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.mangal_dosha ? 'Present' : 'Not Present'}</span></div>
              </div>
            </div>

            {/* North Indian chart */}
            <div className="bg-white/[0.03] rounded-2xl p-4 flex justify-center">
              <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto">
                {/* house polygons */}
                {houses.map(({house, rashi, planets}) => (
                  <g key={house}>
                    <polygon points={poly(HOUSE_POLY[house])} fill={house%2? 'rgba(99,102,241,0.06)':'rgba(255,255,255,0.02)'} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                    <text x={HOUSE_CENTER[house][0]} y={HOUSE_CENTER[house][1]-6} textAnchor="middle" fontSize="10" fill="#94a3b8">{house}. {RASHI[rashi]}</text>
                    <text x={HOUSE_CENTER[house][0]} y={HOUSE_CENTER[house][1]+10} textAnchor="middle" fontSize="11" fill="#e2e8f0">
                      {planets.map(p=>PLANET_SYM[p]).join(' ')}
                    </text>
                  </g>
                ))}
                <line x1={N[0]} y1={N[1]} x2={S[0]} y2={S[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={E[0]} y1={E[1]} x2={W[0]} y2={W[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={N[0]} y1={N[1]} x2={E[0]} y2={E[1]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1={E[0]} y1={E[1]} x2={S[0]} y2={S[1]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1={S[0]} y1={S[1]} x2={W[0]} y2={W[1]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1={W[0]} y1={W[1]} x2={N[0]} y2={N[1]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>

            {/* Planet positions table */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">Planet Positions (Lahiri Sidereal)</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">Planet</th><th className="text-left py-2 px-4">Sign</th>
                  <th className="text-left py-2 px-4">Degree</th><th className="text-left py-2 px-4">House</th>
                </tr></thead>
                <tbody>
                  {data.planets.map(p => (
                    <tr key={p.name} className="border-b border-white/[0.04]">
                      <td className="py-2 px-4 text-white font-semibold">{PLANET_SYM[p.name]} {p.name}</td>
                      <td className="py-2 px-4 text-slate-300">{p.rashi.symbol} {p.rashi.name}</td>
                      <td className="py-2 px-4 text-slate-300">{p.rashi.degree}°</td>
                      <td className="py-2 px-4 text-slate-300">{p.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SEO content section */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Free Online Kundli by Date of Birth and Time</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Make a free kundli (janam kundli) online by entering the date of birth, time of birth,
              and place of birth. This Vedic kundli calculator generates an accurate birth chart with
              your Lagna (ascendant), all 9 planet positions, their signs (rashis) and houses, your
              Moon sign and Sun sign, and whether Mangal Dosha is present — all in the traditional
              North Indian chart style.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">How to make a kundli online</h3>
            <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Enter your date of birth and the exact time of birth.</li>
              <li>Enter your birth place — the chart needs your city or coordinates to find the Lagna.</li>
              <li>Click <strong className="text-slate-200">Generate Kundli</strong>.</li>
              <li>View your Lagna, planet positions, houses, and Mangal Dosha in seconds.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">What you get in your kundli</h3>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Lagna (ascendant) and its rashi — the foundation of your chart</li>
              <li>Positions of Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu</li>
              <li>Each planet's zodiac sign, degree, and house</li>
              <li>Moon sign and Sun sign</li>
              <li>Mangal Dosha check</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Why our kundli maker is accurate</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We compute planetary positions with the Swiss Ephemeris in the Lahiri sidereal system —
              the same engine used by professional astrology software. Your chart is generated from
              real astronomical calculations, not generic readings, so the Lagna, planet signs, and
              houses reflect your exact birth moment and place.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
