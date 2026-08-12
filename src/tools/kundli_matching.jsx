import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const KOOTA = [
  ['Varna', 1, 'Compatibility of the couple\'s varna (nature/class) based on Moon sign'],
  ['Vashya', 2, 'Control and compatibility of the Moon signs'],
  ['Tara', 3, 'Nakshatra compatibility counted from the girl\'s Moon to the boy\'s'],
  ['Yoni', 4, 'Physical and instinctual compatibility of the nakshatra animals'],
  ['Graha Maitri', 5, 'Friendship between the lords of the two Moon signs'],
  ['Gana', 6, 'Temperament compatibility (Deva / Manushya / Rakshasa)'],
  ['Bhakoot', 7, 'Moon sign relationship (avoid 2-12 and 5-9 positions)'],
  ['Nadi', 8, 'Health and genetic compatibility based on nakshatra Nadi'],
]

function Field({ label, children }) {
  const cls = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>
      {children(cls)}
    </div>
  )
}

function PersonCard({ title, color, p, setP, onLocate }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3" style={{ borderColor: color + '33', background: color + '0a' }}>
      <div className="text-sm font-bold" style={{ color }}>{title}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Field label="Date of Birth">{c => <input type="date" value={p.date} onChange={e=>setP({...p, date:e.target.value})} className={c} />}</Field>
        <Field label="Time of Birth">{c => <input type="time" value={p.time} onChange={e=>setP({...p, time:e.target.value})} className={c} />}</Field>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">Place of Birth</label>
        <div className="flex gap-2">
          <input type="text" value={p.place} onChange={e=>setP({...p, place:e.target.value, coords:null})} placeholder="e.g. Mumbai, India"
            className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 flex-1" />
          <button onClick={()=>onLocate(p,setP)} className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">📍</button>
        </div>
        {p.geoMsg && <p className="text-xs text-slate-500 mt-1">{p.geoMsg}</p>}
      </div>
    </div>
  )
}

const emptyPerson = { date:'', time:'', place:'', coords:null, geoMsg:'' }

export default function kundli_matching() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [boy, setBoy] = useState(emptyPerson)
  const [girl, setGirl] = useState(emptyPerson)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const locate = useCallback(async (p, setP) => {
    setP({...p, error:''})
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return }
    navigator.geolocation.getCurrentPosition(
      pos => setP({...p, coords:{lat:+pos.coords.latitude.toFixed(5), lon:+pos.coords.longitude.toFixed(5)}, place:p.place||'My location', geoMsg:`Coords: ${(+pos.coords.latitude.toFixed(5))}, ${(+pos.coords.longitude.toFixed(5))}`}),
      () => setError('Could not get location. Enter a place instead.')
    )
  }, [])

  const geocode = useCallback(async (p) => {
    if (p.coords) return p.coords
    if (!p.place.trim()) { setError('Enter a birth place (or use 📍) for both partners.'); return null }
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(p.place)}`)
      const j = await r.json()
      if (j && j[0]) return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon) }
      setError(`Could not find "${p.place}". Try a city name or use 📍.`); return null
    } catch { setError('Place lookup failed. Use 📍 or enter a city.'); return null }
  }, [])

  const generate = useCallback(async () => {
    if (!boy.date || !boy.time || !girl.date || !girl.time) { setError('Enter date and time for both partners.'); return }
    setLoading(true); setError(''); setData(null)
    const cb = await geocode(boy)
    if (!cb) { setLoading(false); return }
    const cg = await geocode(girl)
    if (!cg) { setLoading(false); return }
    try {
      const q = new URLSearchParams({
        date1: boy.date, time1: boy.time.slice(0,5), lat1: cb.lat, lon1: cb.lon,
        date2: girl.date, time2: girl.time.slice(0,5), lat2: cg.lat, lon2: cg.lon
      })
      const res = await fetch(`https://backend.uptools.in/api/match?${q}`)
      const j = await res.json()
      if (j.detail) throw new Error(j.detail)
      setData(j); jumpTo()
    } catch (e) { setError('Could not generate the match report. Check details and try again.') }
    setLoading(false)
  }, [boy, girl, geocode, jumpTo])

  const verdictColor = { bad:'#f87171', ok:'#fbbf24', good:'#34d399', excellent:'#38bdf8' }

  return (
    <ToolLayout
      title="Kundli Matching – Free Gun Milan by Date of Birth (36 Guna)"
      desc="Free kundli matching (Gun Milan / Ashtakoot) for marriage by date of birth. Check 36 Guna compatibility, all 8 kootas, Mangal Dosha, and get a marriage match report."
      icon="💍" iconBg="rgba(236,72,153,0.08)"
      category="india" slug="kundli-matching"
      faq={[
        { q: "What is kundli matching (Gun Milan)?", a: "Kundli matching, also called Gun Milan or Ashtakoot Milan, is the Vedic method of checking marriage compatibility by comparing the birth charts (Moon signs and nakshatras) of the bride and groom. It scores 8 kootas for a maximum of 36 gunas (points)." },
        { q: "How many gunas are there in kundli matching?", a: "There are 8 kootas (categories) scored out of 36 gunas: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), and Nadi (8)." },
        { q: "What is a good Gun Milan score?", a: "A score of 18–24 is average, 25–32 is good, and 33–36 is a very good match. A score below 18 is generally not recommended, though astrologers consider other factors too." },
        { q: "What is Mangal Dosha (Manglik) matching?", a: "Mangal Dosha is present when Mars is in the 1st, 4th, 7th, 8th, or 12th house from the Lagna. The ideal situation is when both partners have the same Mangal Dosha status; if only one is Manglik, remedies are usually needed." },
        { q: "Does kundli matching need the time of birth?", a: "For an accurate Gun Milan report, both the time and place of birth are recommended, because they determine the exact Moon sign, nakshatra, and Mangal Dosha." },
        { q: "Is kundli matching by date of birth alone accurate?", a: "Moon sign and nakshatra can be computed from the date alone, but the exact time and place give a precise nakshatra and correct Mangal Dosha, so they improve accuracy." },
        { q: "Is the kundli matching tool free?", a: "Yes, it is completely free with no sign-up. Enter both birth details and get an instant 36 Guna and Mangal Dosha report." },
        { q: "What does Nadi matching mean?", a: "Nadi (8 gunas) checks the nakshatra nadi (Adi, Madhya, Antya) of both partners. If both have the same nadi, it scores 0 and may indicate health/genetic considerations. Nadi is considered the most important koota." },
      ]}
      howItWorks={[
        "Enter the date, time, and place of birth for the boy and the girl.",
        "Click Generate to compute both birth charts.",
        "View the 36 Guna (Ashtakoot) score, all 8 kootas, and Mangal Dosha compatibility.",
        "Read the overall match verdict.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Kundli Matching", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/kundli-matching/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PersonCard title="👨 Boy / Groom" color="#38bdf8" p={boy} setP={setBoy} onLocate={locate} />
          <PersonCard title="👩 Girl / Bride" color="#f472b6" p={girl} setP={setGirl} onLocate={locate} />
        </div>
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
        <button onClick={generate} disabled={loading}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
          {loading ? '⏳ Matching Kundlis…' : '💍 Match Kundlis (36 Guna)'}
        </button>

        {!data && !loading && !error && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💍</div>
            <p className="text-sm text-slate-600 font-medium">Enter both birth details to check marriage compatibility</p>
          </div>
        )}

        {data && (
          <div ref={resultRef} className="space-y-4">
            {/* Verdict + mangal */}
            <div className="rounded-3xl border-2 p-5 text-center" style={{ borderColor: verdictColor[data.verdict_color]+'44', background: verdictColor[data.verdict_color]+'0d' }}>
              <div className="text-3xl font-extrabold" style={{ color: verdictColor[data.verdict_color] }}>{data.total} <span className="text-lg text-slate-400 font-semibold">/ {data.max} Gunas</span></div>
              <div className="text-sm font-semibold mt-1" style={{ color: verdictColor[data.verdict_color] }}>{data.verdict}</div>
              <div className="text-xs text-slate-500 mt-3">
                {data.boy.rashi} ({data.boy.nakshatra}) &nbsp;🜨&nbsp; {data.girl.rashi} ({data.girl.nakshatra})
              </div>
            </div>

            {/* Mangal dosha */}
            <div className="bg-white/[0.03] rounded-2xl p-4">
              <div className="text-sm font-bold text-slate-300 mb-2">Mangal Dosha Compatibility</div>
              <div className="flex gap-4 text-xs mb-2">
                <span className="text-slate-400">Boy: <b className={data.mangal.boy ? 'text-red-400' : 'text-emerald-400'}>{data.mangal.boy ? 'Manglik' : 'Not Manglik'}</b></span>
                <span className="text-slate-400">Girl: <b className={data.mangal.girl ? 'text-red-400' : 'text-emerald-400'}>{data.mangal.girl ? 'Manglik' : 'Not Manglik'}</b></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{data.mangal.verdict}</p>
            </div>

            {/* Guna table */}
            <div className="bg-white/[0.03] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 text-sm font-bold text-slate-300 border-b border-white/[0.06]">36 Guna (Ashtakoot) Report</div>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-500 text-xs border-b border-white/[0.06]">
                  <th className="text-left py-2 px-4">Koota</th><th className="text-left py-2 px-4">Max</th>
                  <th className="text-left py-2 px-4">Score</th><th className="text-left py-2 px-4 hidden sm:table-cell">Meaning</th>
                </tr></thead>
                <tbody>
                  {KOOTA.map(([name, max, desc]) => (
                    <tr key={name} className="border-b border-white/[0.04]">
                      <td className="py-2 px-4 text-white font-semibold">{name}</td>
                      <td className="py-2 px-4 text-slate-500">{max}</td>
                      <td className="py-2 px-4 font-bold" style={{ color: (data.guna[name]===max) ? '#34d399' : '#f87171' }}>{data.guna[name]}</td>
                      <td className="py-2 px-4 text-slate-500 hidden sm:table-cell">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto pt-2">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Free Kundli Matching by Date of Birth – 36 Guna Milan</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Match kundli online free for marriage with our 36 Guna Milan calculator. Enter the
              date of birth, time, and place for both partners to get an accurate Ashtakoot
              compatibility score, a detailed breakdown of all 8 kootas, and a Mangal Dosha check.
              The report is computed from real Vedic astronomy (Swiss Ephemeris), so your Gun Milan
              score reflects the true positions of the Moon in both birth charts.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">The 8 Kootas of Gun Milan</h3>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 leading-relaxed">
              <li>Varna (1) – nature and class compatibility</li>
              <li>Vashya (2) – control and compatibility of Moon signs</li>
              <li>Tara (3) – nakshatra compatibility</li>
              <li>Yoni (4) – physical and instinctual compatibility</li>
              <li>Graha Maitri (5) – friendship of the Moon sign lords</li>
              <li>Gana (6) – temperament compatibility</li>
              <li>Bhakoot (7) – Moon sign relationship</li>
              <li>Nadi (8) – health and genetic compatibility</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">What is a good Gun Milan score?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A total of 18–24 out of 36 is considered average, 25–32 is a good match, and 33–36 is a
              very good match. A score below 18 is generally not recommended. Remember that Gun Milan
              is one factor — astrologers also weigh Mangal Dosha, Lagna compatibility, and the 7th
              house before a final decision.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
