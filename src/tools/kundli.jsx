import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const RASHI = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHI_SYM = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const RASHI_HI = ['मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुंभ','मीन']
const PLANET_HI = { Sun:'सूर्य', Moon:'चंद्र', Mars:'मंगल', Mercury:'बुध', Jupiter:'गुरु', Venus:'शुक्र', Saturn:'शनि', Rahu:'राहु', Ketu:'केतु' }
const NAK_HI = ['अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिरा','आर्द्रा','पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्व फाल्गुनी','उत्तर फाल्गुनी','हस्त','चित्रा','स्वाति','विशाखा','अनुराधा','ज्येष्ठा','मूल','पूर्वाषाढ़ा','उत्तराषाढ़ा','श्रवण','धनिष्ठा','शतभिषा','पूर्व भाद्रपद','उत्तर भाद्रपद','रेवती']
const PLANET_SYM = { Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋' }
const HOUSE_MEANING = {
  1:'Self, personality & health', 2:'Wealth, family & speech', 3:'Courage, siblings & communication',
  4:'Home, mother & happiness', 5:'Intelligence, children & creativity', 6:'Health, enemies & service',
  7:'Marriage & partnerships', 8:'Longevity, transformation & in-laws', 9:'Fortune & higher learning',
  10:'Career, status & karma', 11:'Gains, income & friendships', 12:'Losses, expenditure & foreign',
}
const HOUSE_HI = {
  1:'स्वयं, व्यक्तित्व व स्वास्थ्य', 2:'धन, परिवार व वाणी', 3:'साहस, भाई-बहन व संवाद',
  4:'घर, माता व सुख', 5:'बुद्धि, संतान व सृजन', 6:'स्वास्थ्य, शत्रु व सेवा',
  7:'विवाह व साझेदारी', 8:'आयु, परिवर्तन व ससुराल', 9:'भाग्य व उच्च शिक्षा',
  10:'करियर, प्रतिष्ठा व कर्म', 11:'लाभ, आय व मित्र', 12:'हानि, व्यय व विदेश',
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

// ---- Layman helpers: what each planet rules, in plain words ----
const PLANET_MEANING = {
  Sun:'ego, confidence, father, authority & self-image',
  Moon:'mind, emotions, mother, instincts & inner peace',
  Mars:'energy, courage, ambition, siblings & action',
  Mercury:'communication, intellect, business & analysis',
  Jupiter:'wisdom, fortune, education, wealth & growth',
  Venus:'love, marriage, comfort, beauty & luxury',
  Saturn:'discipline, hard work, karma, delay & longevity',
  Rahu:'ambition, obsession, foreign, technology & sudden change',
  Ketu:'spirituality, detachment, intuition & past karma',
}

// ---- Nakshatra (Moon constellation) data ----
const NAK_NAMES = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
const NAK_LORD = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']
function moonNakshatra(d) {
  const moon = d.planets.find(p => p.name === 'Moon')
  if (!moon) return null
  const idx = Math.floor(moon.longitude / (360/27))
  const frac = (moon.longitude % (360/27)) / (360/27)
  return { idx, name: NAK_NAMES[idx], lord: NAK_LORD[idx], pada: Math.min(4, Math.floor(frac*4)+1) }
}

// ---- North Indian chart — authentic layout. Houses 1,4,7,10 are RHOMBI (diamonds)
// at top/right/bottom/left meeting at the center; houses 2,3 / 5,6 / 8,9 / 11,12
// are the triangles filling the 4 corners. House 1 is the top diamond. Clockwise 1→12.
// Square boundary [20,380]x[20,380], center O(200,200).
const O=[200,200]
const HOUSE_POLY = {
  1:[[200,20],[280,110],[200,200],[120,110]],   // top rhombus
  2:[[200,20],[280,110],[380,20]],              // top-right upper
  3:[[280,110],[380,200],[380,20]],             // top-right lower
  4:[[380,200],[280,110],[200,200],[280,290]],  // right rhombus
  5:[[380,200],[280,290],[380,380]],            // bottom-right upper
  6:[[280,290],[200,380],[380,380]],            // bottom-right lower
  7:[[200,380],[280,290],[200,200],[120,290]],  // bottom rhombus
  8:[[200,380],[120,290],[20,380]],             // bottom-left upper
  9:[[120,290],[20,200],[20,380]],              // bottom-left lower
  10:[[20,200],[120,110],[200,200],[120,290]],  // left rhombus
  11:[[20,200],[120,110],[20,20]],              // top-left upper
  12:[[120,110],[200,20],[20,20]],              // top-left lower
}
function centroid(pts){ const x=pts.reduce((a,p)=>a+p[0],0)/pts.length; const y=pts.reduce((a,p)=>a+p[1],0)/pts.length; return [x,y] }
const HOUSE_CENTER = {}
for (const k in HOUSE_POLY) HOUSE_CENTER[k] = centroid(HOUSE_POLY[k])
function poly(pts){ return pts.map(p=>p.join(',')).join(' ') }
const FRAME = { TLc:[20,20], TRc:[380,20], BRc:[380,380], BLc:[20,380] }

const HOUSE_AREA = {
  1:'your personal identity and health', 2:'wealth, family and speech', 3:'courage, siblings and communication',
  4:'home, mother and emotional peace', 5:'creativity, children and romance', 6:'daily work, routine and health',
  7:'marriage and partnerships', 8:'transformation, shared resources and longevity', 9:'fortune, higher learning and long travel',
  10:'career and public status', 11:'gains, income and networks', 12:'expenses, foreign lands and spirituality',
}

const DASHA_TONE = {
  Sun:'A period of visibility, authority and recognition — a good time to lead, build reputation and step into a bigger role. Health and father-figure matters deserve attention.',
  Moon:'An emotional and mental period focused on home, family and inner peace. Relationships and mood matter more than aggressive action. Good for settling, buying a home, and caring for mother.',
  Mars:'A high-energy period of action, courage and competition. Strong for starting new ventures, sports and bold deals — but watch for arguments, aggression and impulsive moves.',
  Mercury:'A sharp, clever period favouring communication, business, writing, analysis and trade. Great for learning, deals, short travels and networking.',
  Jupiter:'One of the most fortunate periods — growth in wealth, education, wisdom and status. Favourable for marriage, children, teaching, and expanding finances or property.',
  Venus:'A comfortable, loving period favouring marriage, relationships, luxury, vehicles and the arts. Strong for romance, family happiness and material comforts.',
  Saturn:'A demanding but rewarding period of hard work, discipline and patience. Progress is steady and slow — effort pays off later. Good for long-term career and property, but delay, stress and health need care.',
  Rahu:'An intense, ambitious period of sudden change, foreign connections and unconventional paths. Big gains are possible in technology, media or foreign fields, but there can be ups and downs, confusion and obsession.',
  Ketu:'A spiritual, introspective period of detachment and letting go. Material ambitions slow down; you may feel drawn to solitude, spirituality or research. Good for inner growth rather than flashy gains.',
}

function currentDashaIdx(d) {
  const dashas = d.dasha || []
  const today = new Date()
  for (let i=0;i<dashas.length;i++){
    const s = new Date(dashas[i].start), e = new Date(dashas[i].end)
    if (today >= s && today <= e) return i
  }
  return 0
}

function futurePredictions(d) {
  const dashas = d.dasha || []
  if (!dashas.length) return []
  const cur = currentDashaIdx(d)
  const curP = dashas[cur] || dashas[0]
  const next = dashas[cur+1]
  const nextP = next ? next.planet : null
  const curHouse = (d.planets.find(p => p.name === curP.planet) || {}).house
  const houseArea = curHouse ? HOUSE_AREA[curHouse] : 'your overall life'
  const out = [{
    t:'Right now — ' + curP.planet + ' Maha Dasha',
    body:'You are currently in the ' + curP.planet + ' Maha Dasha (from ' + curP.start + ' to ' + curP.end + '). ' + (DASHA_TONE[curP.planet] || '') + ' In your chart, ' + curP.planet + ' sits in the ' + (curHouse ? curHouse + 'th house' : 'house of your birth') + ', which points to ' + houseArea + '. This phase shapes those parts of your life the most.',
  }]
  if (nextP) {
    const nHouse = (d.planets.find(p => p.name === nextP) || {}).house
    out.push({
      t:'Coming up — ' + nextP + ' Maha Dasha',
      body:'From ' + next.start + ', the ' + nextP + ' Maha Dasha begins. ' + (DASHA_TONE[nextP] || '') + (nHouse ? ' In your chart ' + nextP + ' sits in the ' + nHouse + 'th house, so this phase will most affect ' + HOUSE_AREA[nHouse] + '.' : '') + ' Plan for it while it is still ahead of you.',
    })
  }
  return out
}

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
  const [lang, setLang] = useState('hi')

  const rr = (i) => lang === 'hi' ? RASHI_HI[i] : RASHI[i]            // rashi by index
  const rrN = (name) => lang === 'hi' ? (RASHI_HI[RASHI.indexOf(name)] || name) : name  // rashi by english name
  const pn = (name) => lang === 'hi' ? (PLANET_HI[name] || name) : name               // planet name
  const hh = (n) => lang === 'hi' ? HOUSE_HI[n] : HOUSE_MEANING[n]                     // house meaning
  const L = { hi: { lagna:'लग्न', moon:'चंद्र राशि', sun:'सूर्य राशि', chart:'उत्तर भारतीय कुंडली', planet:'ग्रह', sign:'राशि', house:'भाव', analysis:'कुंडली विश्लेषण', dasha:'विम्शोत्तरी महादशा', dosha:'दोष विश्लेषण', present:'विद्यमान', absent:'अनुपस्थित', houseWise:'भाव विश्लेषण', represents:'प्रतिनिधित्व', from:'से', to:'तक', years:'वर्ष', current:'वर्तमान' }, en: {} }[lang]

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
  const nak = data ? moonNakshatra(data) : null

  // Download the chart as a PNG (render the SVG to canvas)
  const dlChart = () => {
    const svg = document.getElementById('kundli-chart-svg')
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }))
    const img = new Image()
    img.onload = () => {
      const s = 2, cv = document.createElement('canvas')
      cv.width = 400*s; cv.height = 400*s
      const ctx = cv.getContext('2d')
      ctx.fillStyle = '#fffbe6'; ctx.fillRect(0,0,cv.width,cv.height)
      ctx.drawImage(img,0,0,cv.width,cv.height)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.download = 'kundli-' + (data.birth.date || '') + '.png'
      a.href = cv.toDataURL('image/png'); a.click()
    }
    img.src = url
  }

  // Build + download the full text report
  const dlReport = () => {
    const nak = moonNakshatra(data)
    const L = []
    const P = (k,v) => L.push(k + ': ' + v)
    const SEC = (t) => L.push('', '======== ' + t + ' ========')
    const B = (s) => L.push(s)
    SEC('KUNDLI REPORT')
    P('Date of birth', data.birth.date); P('Time of birth', data.birth.time)
    P('Latitude / Longitude', data.birth.lat + ', ' + data.birth.lon)
    P('Lagna (ascendant)', data.lagna.rashi.symbol + ' ' + data.lagna.rashi.name + ' ' + data.lagna.rashi.degree + '\u00b0')
    P('Moon sign', data.moon_sign); P('Sun sign', data.sun_sign)
    if (nak) P('Moon nakshatra', nak.name + ' pada ' + nak.pada + ' (lord ' + nak.lord + ')')
    P('Mangal Dosha', data.mangal_dosha ? 'Present' : 'Not present')
    P('Kaal Sarp Dosha', data.kaal_sarp_dosha ? 'Present' : 'Not present')
    SEC('PLANETS (Lahiri sidereal)')
    for (const p of data.planets) B(p.name + ' - ' + p.rashi.symbol + ' ' + p.rashi.name + ', ' + p.rashi.degree + '\u00b0, ' + p.house + 'th house. It rules ' + PLANET_MEANING[p.name] + '.')
    SEC('HOUSE-WISE')
    for (const h of data.houses_detail) B(h.house + '. ' + h.rashi + ' - ' + HOUSE_MEANING[h.house] + (h.planets.length ? ' | planets: ' + h.planets.join(', ') : ''))
    SEC('KUNDLI ANALYSIS')
    for (const a of analyze(data)) { B(a.t + ':'); B(a.body); B('') }
    SEC('DASHA PREDICTIONS')
    for (const f of futurePredictions(data)) { B(f.t + ':'); B(f.body); B('') }
    SEC('VIMSHOTTARI MAHA DASHA')
    for (const dp of data.dasha) B(dp.planet + ': ' + dp.start + ' to ' + dp.end + ' (' + dp.years + ' yrs)')
    L.push('', 'Computed with Swiss Ephemeris (Lahiri sidereal). Astrological interpretation is for guidance and reflection, not a certainty of future events.')
    const blob = new Blob([L.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.download = 'kundli-report-' + (data.birth.date || '') + '.txt'
    a.href = URL.createObjectURL(blob); a.click()
  }

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
          <div className="flex items-center justify-end">
            <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-all">
              {lang === 'hi' ? '🌐 English' : '🌐 हिंदी'}
            </button>
          </div>

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
            <div className="bg-gradient-to-br from-indigo-500/[0.08] via-white/[0.01] to-transparent rounded-3xl border-2 border-indigo-500/15 p-5 space-y-3">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div><span className="text-slate-500 font-semibold">{L.lagna}: </span><span className="text-white font-bold">{data.lagna.rashi.symbol} {rrN(data.lagna.rashi.name)}</span></div>
                <div><span className="text-slate-500 font-semibold">{L.moon}: </span><span className="text-white font-bold">{rrN(data.moon_sign)}</span></div>
                <div><span className="text-slate-500 font-semibold">{L.sun}: </span><span className="text-white font-bold">{rrN(data.sun_sign)}</span></div>
                {nak && <div><span className="text-slate-500 font-semibold">नक्षत्र / Nakshatra: </span><span className="text-white font-bold">{nak.name} pada {nak.pada} ({nak.lord})</span></div>}
                <div><span className="text-slate-500 font-semibold">मांगलिक दोष: </span>
                  <span className={data.mangal_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.mangal_dosha ? (lang==='hi'?'विद्यमान':'Present') : (lang==='hi'?'अनुपस्थित':'Not Present')}</span></div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={dlChart} className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
                  style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>⬇️ Download Kundli Chart</button>
                <button onClick={dlReport} className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.98]"
                  style={{ background:'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>📄 Download Report</button>
              </div>
            </div>

            {/* North Indian chart — traditional Indian style (yellow-white + red) */}
            <div className="rounded-2xl p-4 flex flex-col items-center gap-3" style={{ background:'#fdf6e3' }}>
              <div className="text-center">
                <div className="text-base font-bold text-[#b91c1c]">उत्तर भारतीय कुंडली</div>
                <div className="text-xs text-[#b91c1c]/70 font-medium">North Indian Chart · {data.lagna.rashi.name} Lagna</div>
              </div>
              <svg id="kundli-chart-svg" viewBox="0 0 400 400" className="w-full max-w-[440px] h-auto block mx-auto">
                <rect x="6" y="6" width="388" height="388" fill="#fffbe6" stroke="#b91c1c" strokeWidth="2" />
                {/* house polygons */}
                {houses.map(({house, rashi, planets}) => (
                  <g key={house}>
                    <polygon points={poly(HOUSE_POLY[house])}
                      fill={house%2 ? '#fff3c4' : '#fffdf5'}
                      stroke="#b91c1c" strokeWidth="1.2" />
                    <text x={HOUSE_CENTER[house][0]} y={HOUSE_CENTER[house][1]-7} textAnchor="middle" fontSize="9.5" fill="#b91c1c" fontWeight="600">
                      {house}. {rr(rashi)}
                    </text>
                    <text x={HOUSE_CENTER[house][0]} y={HOUSE_CENTER[house][1]+9} textAnchor="middle" fontSize="12" fill="#1a1a1a" fontWeight="bold">
                      {planets.map(p=>PLANET_SYM[p]).join(' ')}
                    </text>
                  </g>
                ))}
                {/* red outer frame */}
                <line x1={FRAME.TLc[0]} y1={FRAME.TLc[1]} x2={FRAME.TRc[0]} y2={FRAME.TRc[1]} stroke="#b91c1c" strokeWidth="2" />
                <line x1={FRAME.TRc[0]} y1={FRAME.TRc[1]} x2={FRAME.BRc[0]} y2={FRAME.BRc[1]} stroke="#b91c1c" strokeWidth="2" />
                <line x1={FRAME.BRc[0]} y1={FRAME.BRc[1]} x2={FRAME.BLc[0]} y2={FRAME.BLc[1]} stroke="#b91c1c" strokeWidth="2" />
                <line x1={FRAME.BLc[0]} y1={FRAME.BLc[1]} x2={FRAME.TLc[0]} y2={FRAME.TLc[1]} stroke="#b91c1c" strokeWidth="2" />
              </svg>
            </div>

            {/* Planet positions table */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">{lang==='hi'?'ग्रह स्थिति (लाहिरी निरयण)':'Planet Positions (Lahiri Sidereal)'}</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">{lang==='hi'?'ग्रह':'Planet'}</th><th className="text-left py-2 px-4">{lang==='hi'?'राशि':'Sign'}</th>
                  <th className="text-left py-2 px-4">{lang==='hi'?'अंश':'Degree'}</th><th className="text-left py-2 px-4">{lang==='hi'?'भाव':'House'}</th>
                </tr></thead>
                <tbody>
                  {data.planets.map(p => (
                    <tr key={p.name} className="border-b border-white/[0.04]">
                      <td className="py-2 px-4 text-white font-semibold">{PLANET_SYM[p.name]} {pn(p.name)}</td>
                      <td className="py-2 px-4 text-slate-300">{p.rashi.symbol} {rrN(p.rashi.name)}</td>
                      <td className="py-2 px-4 text-slate-300">{p.rashi.degree}°</td>
                      <td className="py-2 px-4 text-slate-300">{p.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Layman explainer */}
            <div className="bg-white/[0.03] rounded-2xl p-4 space-y-3">
              <div className="text-sm font-bold text-slate-300">How to read this kundli — plain words</div>
              <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <div><span className="text-indigo-300 font-semibold">Lagna / Ascendant ({data.lagna.rashi.name}) — </span>Your Lagna is the zodiac sign rising on the eastern horizon at your birth moment. It is the starting point of your chart and represents your personality, body and life direction. It sets your 1st house.</div>
                <div><span className="text-indigo-300 font-semibold">Moon sign ({data.moon_sign}) — </span>Your Moon sign reflects your mind, emotions and instincts. It shows how you feel and react, and is used for emotional compatibility and Dasha timing.</div>
                <div><span className="text-indigo-300 font-semibold">Sun sign ({data.sun_sign}) — </span>Your Sun sign reflects your ego, confidence and core identity — the part of you that wants to be recognised.</div>
                {nak && <div><span className="text-indigo-300 font-semibold">Nakshatra ({nak.name}, pada {nak.pada}, lord {nak.lord}) — </span>Your nakshatra is the exact Moon constellation at birth, like a finer star-sign. Its lord, {nak.lord}, rules the Maha Dasha period you were born in.</div>}
                <div><span className="text-indigo-300 font-semibold">Mangal Dosha — </span>{data.mangal_dosha ? 'Mars is placed in one of the dosha houses (1st, 4th, 7th, 8th or 12th). Traditionally it is considered in marriage matching — it is not a curse, and matching and remedies balance it.' : 'Mars is not in a dosha house, so Mangal Dosha is not present — considered favourable for marriage compatibility.'}</div>
              </div>
            </div>

            {/* Planet significators */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">What each planet means in your chart</div>
              <div className="divide-y divide-white/[0.04]">
                {data.planets.map(p => (
                  <div key={p.name} className="px-4 py-3">
                    <div className="text-sm font-semibold text-white">{PLANET_SYM[p.name]} {pn(p.name)} <span className="text-slate-500 font-normal">· {p.rashi.symbol} {rrN(p.rashi.name)} · {p.house}th house</span></div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.name} rules {PLANET_MEANING[p.name]}. Sitting in your {p.house}th house, it brings that energy to {HOUSE_AREA[p.house]}.</p>
                  </div>
                ))}
              </div>
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
              <div className="text-sm font-bold text-slate-300 mb-2">{lang==='hi'?'दोष विश्लेषण':'Dosha Analysis'}</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-slate-400">{lang==='hi'?'मांगलिक दोष':'Mangal Dosha (Manglik)'}</span>
                  <span className={data.mangal_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.mangal_dosha ? (lang==='hi'?'विद्यमान':'Present') : (lang==='hi'?'अनुपस्थित':'Not Present')}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                  <span className="text-slate-400">{lang==='hi'?'काल सर्प दोष':'Kaal Sarp Dosha'}</span>
                  <span className={data.kaal_sarp_dosha ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{data.kaal_sarp_dosha ? (lang==='hi'?'विद्यमान':'Present') : (lang==='hi'?'अनुपस्थित':'Not Present')}</span>
                </div>
              </div>
            </div>

            {/* Future predictions */}
            <div className="bg-white/[0.03] rounded-2xl p-4 space-y-3">
              <div className="text-sm font-bold text-slate-300">Future Predictions (Vimshottari Dasha)</div>
              <div className="text-[11px] text-slate-500">Based on the Maha Dasha planetary period you are in now and the one coming next.</div>
              <div className="space-y-3">
                {futurePredictions(data).map(f => (
                  <div key={f.t} className="rounded-xl border border-indigo-500/15 bg-indigo-500/[0.04] p-3">
                    <div className="text-xs font-bold text-indigo-300 mb-1">{f.t}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* House-wise analysis */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">{lang==='hi'?'भाव विश्लेषण':'House-wise Analysis'}</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">{lang==='hi'?'भाव':'House'}</th><th className="text-left py-2 px-4">{lang==='hi'?'राशि':'Sign'}</th>
                  <th className="text-left py-2 px-4">{lang==='hi'?'ग्रह':'Planets'}</th><th className="text-left py-2 px-4 hidden sm:table-cell">{lang==='hi'?'प्रतिनिधित्व':'Represents'}</th>
                </tr></thead>
                <tbody>
                  {data.houses_detail.map(h => (
                    <tr key={h.house} className="border-b border-white/[0.04]">
                      <td className="py-2 px-4 text-white font-semibold">{h.house}</td>
                      <td className="py-2 px-4 text-slate-300">{RASHI_SYM[h.rashi_index]} {rrN(h.rashi)}</td>
                      <td className="py-2 px-4 text-slate-300">{h.planets.length ? h.planets.map(p=>PLANET_SYM[p]+' '+pn(p)).join(', ') : '—'}</td>
                      <td className="py-2 px-4 text-slate-500 hidden sm:table-cell">{hh(h.house)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vimshottari Dasha */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">{lang==='hi'?'विम्शोत्तरी महादशा':'Vimshottari Maha Dasha'}</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">{lang==='hi'?'काल':'Period'}</th><th className="text-left py-2 px-4">{lang==='hi'?'से':'From'}</th>
                  <th className="text-left py-2 px-4">{lang==='hi'?'तक':'To'}</th><th className="text-left py-2 px-4">{lang==='hi'?'वर्ष':'Years'}</th>
                </tr></thead>
                <tbody>
                  {data.dasha.map((dp, i) => (
                    <tr key={i} className={i===currentDashaIdx(data) ? 'border-b border-indigo-500/20 bg-indigo-500/[0.06]' : 'border-b border-white/[0.04]'}>
                      <td className="py-2 px-4 text-white font-semibold">{PLANET_SYM[dp.planet]} {pn(dp.planet)}{i===currentDashaIdx(data) ? (lang==='hi'?' (वर्तमान)':' (current)') : ''}</td>
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
