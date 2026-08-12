import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const RASHI = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHI_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const PLANET_SYM = { Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋' }
const HOUSE_MEANING = {
  1:'Self, personality & health', 2:'Wealth, family & speech', 3:'Courage, siblings & communication',
  4:'Home, mother & happiness', 5:'Intelligence, children & creativity', 6:'Health, enemies & service',
  7:'Marriage & partnerships', 8:'Longevity, transformation & in-laws', 9:'Fortune & higher learning',
  10:'Career, status & karma', 11:'Gains, income & friendships', 12:'Losses, expenditure & foreign',
}
const RASHI_TRAIT = { Aries:'energetic and pioneering', Taurus:'steady and practical', Gemini:'adaptable and communicative',
  Cancer:'nurturing and emotional', Leo:'confident and expressive', Virgo:'analytical and detail-oriented',
  Libra:'balanced and diplomatic', Scorpio:'intense and transformative', Sagittarius:'optimistic and adventurous',
  Capricorn:'ambitious and disciplined', Aquarius:'independent and innovative', Pisces:'intuitive and compassionate' }
const RASHI_LORD = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']

function analyze(d) {
  const lagnaIdx = d.lagna.rashi.index, lagnaName = d.lagna.rashi.name
  const lord = RASHI_LORD[lagnaIdx]
  const lordP = d.planets.find(p => p.name === lord)
  const lordHouse = lordP ? lordP.house : null
  const h2 = d.houses_detail[1], h6 = d.houses_detail[5], h7 = d.houses_detail[6], h10 = d.houses_detail[9], h11 = d.houses_detail[10]
  const inHouse = (h) => h.planets.length ? `with ${h.planets.join(', ')} placed here` : 'with no planets placed here'
  return [
    { t: 'Personality & Mind', body: `Your Lagna (ascendant) is ${lagnaName}, making you ${RASHI_TRAIT[lagnaName]}. The lord of your ascendant, ${lord}, is placed in the ${lordHouse}th house, which shapes how you express yourself and pursue your goals. Your Moon sign is ${d.moon_sign}, governing your emotional nature.` },
    { t: 'Career & Profession', body: `Your 10th house (career) falls in ${h10.rashi} ${inHouse(h10)}. The 10th house rules your profession, status, and public reputation.` },
    { t: 'Wealth & Finances', body: `Your 2nd house (wealth) is in ${h2.rashi} and your 11th house (gains) is in ${h11.rashi} ${inHouse(h11)} — together these influence your income and financial gains.` },
    { t: 'Marriage & Relationships', body: `Your 7th house (marriage) falls in ${h7.rashi} ${inHouse(h7)}. This house reflects your approach to partnerships and marriage.${d.mangal_dosha ? ' Note: Mangal Dosha is present, which is traditionally considered in marriage matching.' : ''}` },
    { t: 'Health', body: `Your 6th house (health) is in ${h6.rashi} ${inHouse(h6)}. Along with your Lagna in ${lagnaName}, this indicates your general constitution and health tendencies.` },
  ]
}

// North Indian chart — authentic SQUARE layout (house 1 top triangle, houses 1-12 clockwise)
// Square 0-400. Center O(200,200). T/R/B/L = edge centers (apexes of houses 1/4/7/10).
// innerTL/innerTR/innerBR/innerBL = junctions where the 4 central triangles meet.
const O=[200,200]
const T=[200,30], R=[370,200], B=[200,370], L=[30,200]
const iTL=[140,130], iTR=[260,130], iBR=[260,270], iBL=[140,270]
const TRc=[370,30], BRc=[370,370], BLc=[30,370], TLc=[30,30]
const HOUSE_POLY = {
  1:[T,iTR,iTL],
  2:[TRc,T,iTR],
  3:[TRc,iTR,R],
  4:[R,iTR,iBR],
  5:[BRc,R,iBR],
  6:[BRc,iBR,B],
  7:[B,iBR,iBL],
  8:[BLc,B,iBL],
  9:[BLc,iBL,L],
  10:[L,iBL,iTL],
  11:[TLc,L,iTL],
  12:[TLc,iTL,T],
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
      desc="Make a free online kundli (janam kundli) by date of birth, time, and place. Get your Lagna, all 9 planet positions, houses, Vimshottari Dasha, Mangal Dosha & Kaal Sarp Dosha, and a full kundli analysis — computed with Swiss Ephemeris."
      icon="🪔" iconBg="rgba(99,102,241,0.08)"
      category="india" slug="kundli"
      faq={[
        { q: "What is a kundli?", a: "A kundli (janam kundli) is a Vedic birth chart that maps the position of the planets at your exact date, time, and place of birth into 12 houses and 12 zodiac signs (rashis). It is the foundation of Indian astrology." },
        { q: "How is a kundli made?", a: "Enter your date of birth, time of birth, and birth place. We compute the sidereal (Lahiri) position of all 9 planets using the Swiss Ephemeris, find your Lagna (ascendant), and place the planets into 12 houses." },
        { q: "What is Lagna in a kundli?", a: "Lagna (the ascendant) is the zodiac sign rising on the eastern horizon at your birth moment. It is the most important reference point in a kundli and sets the first house." },
        { q: "What is Mangal Dosha?", a: "Mangal Dosha occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house from the Lagna. Our kundli automatically checks and reports whether Mangal Dosha is present." },
        { q: "What is Kaal Sarp Dosha?", a: "Kaal Sarp Dosha is present when all seven planets fall on one side of the Rahu–Ketu axis. Our kundli automatically detects and reports it along with Mangal Dosha." },
        { q: "What is Vimshottari Dasha?", a: "Vimshottari Dasha is a 120-year planetary period system used in Vedic astrology. Based on the Moon's nakshatra at birth, it divides life into Maha Dasha periods of each planet. Your kundli shows your current and upcoming periods." },
        { q: "Is the kundli accurate?", a: "Yes. Positions are computed with the Swiss Ephemeris in the Lahiri sidereal system — the same engine used by professional astrology software. Accuracy depends on entering your exact birth time and place." },
        { q: "What analysis does the kundli include?", a: "Besides the chart, you get a house-wise analysis (what each of the 12 houses represents and which planets sit there), a personality/career/wealth/marriage/health reading, Mangal Dosha and Kaal Sarp Dosha checks, and your Vimshottari Dasha periods." },
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
                <line x1={TLc[0]} y1={TLc[1]} x2={TRc[0]} y2={TRc[1]} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <line x1={TRc[0]} y1={TRc[1]} x2={BRc[0]} y2={BRc[1]} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <line x1={BRc[0]} y1={BRc[1]} x2={BLc[0]} y2={BLc[1]} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                <line x1={BLc[0]} y1={BLc[1]} x2={TLc[0]} y2={TLc[1]} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                {/* spokes from edge centers to center */}
                <line x1={T[0]} y1={T[1]} x2={O[0]} y2={O[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={R[0]} y1={R[1]} x2={O[0]} y2={O[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={B[0]} y1={B[1]} x2={O[0]} y2={O[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={L[0]} y1={L[1]} x2={O[0]} y2={O[1]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
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

            {/* Kundli Analysis */}
            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-300 pt-1">Kundli Analysis</div>
              {analyze(data).map(a => (
                <div key={a.t} className="bg-white/[0.03] rounded-2xl p-4">
                  <div className="text-xs font-bold text-indigo-300 mb-1">{a.t}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>

            {/* Doshas */}
            <div className="bg-white/[0.03] rounded-2xl p-4">
              <div className="text-sm font-bold text-slate-300 mb-2">Dosha Analysis</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-slate-400">Mangal Dosha (Manglik)</span>
                  <span className={data.mangal_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.mangal_dosha ? 'Present' : 'Not Present'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-slate-400">Kaal Sarp Dosha</span>
                  <span className={data.kaal_sarp_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.kaal_sarp_dosha ? 'Present' : 'Not Present'}</span>
                </div>
              </div>
            </div>

            {/* House-wise analysis */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">House-wise Analysis</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">House</th><th className="text-left py-2 px-4">Sign</th>
                  <th className="text-left py-2 px-4">Planets</th><th className="text-left py-2 px-4 hidden sm:table-cell">Represents</th>
                </tr></thead>
                <tbody>
                  {data.houses_detail.map(h => (
                    <tr key={h.house} className="border-b border-white/[0.04]">
                      <td className="py-2 px-4 text-white font-semibold">{h.house}</td>
                      <td className="py-2 px-4 text-slate-300">{RASHI_SYM[h.rashi_index]} {h.rashi}</td>
                      <td className="py-2 px-4 text-slate-300">{h.planets.length ? h.planets.map(p=>PLANET_SYM[p]+' '+p).join(', ') : '—'}</td>
                      <td className="py-2 px-4 text-slate-500 hidden sm:table-cell">{HOUSE_MEANING[h.house]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vimshottari Dasha */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">Vimshottari Maha Dasha</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">Period</th><th className="text-left py-2 px-4">From</th>
                  <th className="text-left py-2 px-4">To</th><th className="text-left py-2 px-4">Years</th>
                </tr></thead>
                <tbody>
                  {data.dasha.map((dp, i) => (
                    <tr key={i} className={i===0 ? 'border-b border-indigo-500/20 bg-indigo-500/[0.06]' : 'border-b border-white/[0.04]'}>
                      <td className="py-2 px-4 text-white font-semibold">{PLANET_SYM[dp.planet]} {dp.planet}{i===0 ? ' (current)' : ''}</td>
                      <td className="py-2 px-4 text-slate-300">{dp.start}</td>
                      <td className="py-2 px-4 text-slate-300">{dp.end}</td>
                      <td className="py-2 px-4 text-slate-300">{dp.years}</td>
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
