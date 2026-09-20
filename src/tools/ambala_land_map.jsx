import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const VILLAGE_META = {
  tundla: { name: 'Tundla', gis: '0100602871R', tehsil: 'Ambala Cantt' },
  kalarheri: { name: 'Kalarheri', gis: '0100602869R', tehsil: 'Ambala' },
}

const SAMPLE_LISTINGS = [
  { village: 'tundla', khasra: '12//4', owner: 'Ram Singh s/o Mohan Lal', area: '4 kanal 0 marla', price: 'Rs 68 lakh', phone: '98120XXXXX' },
  { village: 'tundla', khasra: '18//2', owner: 'Geeta Devi w/o Ram Singh', area: '2 kanal 5 marla', price: 'Rs 36 lakh', phone: '99960XXXXX' },
  { village: 'kalarheri', khasra: '7//3', owner: 'Satpal s/o Dharam Singh', area: '3 kanal 0 marla', price: 'Rs 52 lakh', phone: '98130XXXXX' },
  { village: 'kalarheri', khasra: '14//1', owner: 'Kamla Devi w/o Satpal', area: '1 kanal 15 marla', price: 'Rs 30 lakh', phone: '97290XXXXX' },
]

function loadLeaflet() {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function ambala_land_map() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const mapRef = useRef(null)
  const mapObj = useRef(null)
  const layersRef = useRef({ overlays: {}, markers: [], base: null, sat: null })
  const [ready, setReady] = useState(false)
  const [geo, setGeo] = useState(null)
  const [village, setVillage] = useState('both')
  const [sat, setSat] = useState(false)
  const [listings, setListings] = useState(SAMPLE_LISTINGS)
  const [mine, setMine] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ambala-land-mine') || '[]') } catch { return [] }
  })
  const [sel, setSel] = useState(null)
  const [plotNo, setPlotNo] = useState('')
  const [form, setForm] = useState({ village: 'tundla', khasra: '', owner: '', area: '', price: '', phone: '' })
  const [pickMode, setPickMode] = useState(false)

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]'

  useEffect(() => {
    fetch('/ambala-land/villages.json').then(r => r.json()).then(setGeo).catch(() => {})
  }, [])

  useEffect(() => {
    if (!geo || mapObj.current) return
    let dead = false
    loadLeaflet().then(L => {
      if (dead || !mapRef.current) return
      const map = L.map(mapRef.current).setView([30.39, 76.866], 12)
      const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'OpenStreetMap' }).addTo(map)
      const satL = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Esri' })
      const overlays = {}
      Object.keys(VILLAGE_META).forEach(k => {
        const g = geo[k]
        if (!g) return
        overlays[k] = L.imageOverlay(`/ambala-land/${k}.png`, g.bounds, { opacity: 0.85, interactive: false }).addTo(map)
        L.marker(g.center).addTo(map).bindPopup(`<b>${VILLAGE_META[k].name}</b><br>Tehsil ${VILLAGE_META[k].tehsil}, Ambala<br>GIS ${VILLAGE_META[k].gis}`)
      })
      mapObj.current = map
      layersRef.current = { overlays, markers: [], base, sat: satL }
      map.on('click', e => {
        if (pickModeRef.current) {
          pickCbRef.current && pickCbRef.current(e.latlng)
        }
      })
      setReady(true)
    }).catch(() => {})
    return () => { dead = true }
  }, [geo])

  const pickModeRef = useRef(pickMode)
  pickModeRef.current = pickMode
  const pickCbRef = useRef(null)

  useEffect(() => {
    const map = mapObj.current
    if (!map || !window.L) return
    const { overlays, base, sat } = layersRef.current
    Object.keys(overlays).forEach(k => {
      if (village === 'both' || village === k) { if (!map.hasLayer(overlays[k])) overlays[k].addTo(map) }
      else if (map.hasLayer(overlays[k])) map.removeLayer(overlays[k])
    })
    if (sat && !map.hasLayer(sat)) { map.removeLayer(base); sat.addTo(map) }
    if (!sat && map.hasLayer(sat)) { map.removeLayer(sat); base.addTo(map) }
    if (village !== 'both' && geo && geo[village]) map.flyTo(geo[village].center, 14, { duration: 0.8 })
  }, [village, sat, geo])

  // listing markers
  useEffect(() => {
    const map = mapObj.current
    if (!map || !window.L || !geo) return
    layersRef.current.markers.forEach(m => map.removeLayer(m))
    const L = window.L
    const all = [...listings.map(l => ({ ...l, sample: true })), ...mine]
    const shown = village === 'both' ? all : all.filter(l => l.village === village)
    const marks = shown.map(l => {
      const g = geo[l.village]
      if (!g) return null
      const c = l.lat && l.lon ? [l.lat, l.lon] : g.center
      const m = L.marker(c).addTo(map)
      m.bindTooltip(`${VILLAGE_META[l.village].name} ${l.khasra}`)
      m.on('click', () => { setSel(l); jumpTo() })
      return m
    }).filter(Boolean)
    layersRef.current.markers = marks
  }, [listings, mine, village, geo])

  const saveMine = (arr) => {
    setMine(arr)
    try { localStorage.setItem('ambala-land-mine', JSON.stringify(arr)) } catch {}
  }

  const addListing = () => {
    if (!form.khasra.trim()) return
    const done = (lat, lon) => {
      saveMine([...mine, { ...form, lat, lon, sample: false }])
      setSel({ ...form, lat, lon })
      setForm({ village: 'tundla', khasra: '', owner: '', area: '', price: '', phone: '' })
      setPickMode(false)
      jumpTo()
    }
    // ask user to click map for pin, fallback to village center
    pickCbRef.current = (ll) => { pickCbRef.current = null; done(ll.lat, ll.lng) }
    setPickMode(true)
  }

  const jamabandiUrl = 'https://jamabandi.nic.in/'
  const bhunakshaUrl = 'https://maps.revenueharyana.gov.in/home'
  const collectorUrl = 'https://ambala.gov.in/document-category/collector-rate/'

  return (
    <ToolLayout
      title="Ambala Land Map - Tundla & Kalarheri"
      desc="Ambala land map: real Haryana govt cadastral (Bhunaksha) village maps of Tundla and Kalarheri near Defence Colony, with owner, price and fraud-check links. Free, no sign-up."
      icon="🗺️" iconBg="rgba(16,185,129,0.08)"
      category="india" slug="ambala-land-map"
      faq={[
        { q: 'Is this official Haryana land record data?', a: 'The village boundary maps are real Bhunaksha (Haryana Revenue Dept) cadastral rasters. Owner names, prices and phone numbers shown are samples or user listings - always verify on jamabandi.nic.in before any deal.' },
        { q: 'How do I verify a plot before buying?', a: 'Note the khasra number, check owner name and area on Jamabandi (jamabandi.nic.in), match the plot shape on Bhunaksha, match seller Aadhaar name with Jamabandi owner, and check pending mutations with the patwari.' },
        { q: 'Where do phone numbers and prices come from?', a: 'Govt records do not publish phone numbers or market prices. Those come only from seller listings on this page. Collector rate (govt minimum registry price) is on ambala.gov.in.' },
        { q: 'Which villages are covered?', a: 'Tundla (02871, Ambala Cantt) and Kalarheri (02869, Ambala Cantt) near Defence Colony, Ambala. More villages can be added on request.' },
        { q: 'How do I list my land here?', a: 'Fill the Add your land form, click Add, then click on the map to drop your pin. Your listing is saved in your own browser only in this demo version.' },
      ]}
      howItWorks={[
        'Pick a village (Tundla / Kalarheri) or view both on the real Bhunaksha cadastral overlay.',
        'Click a pin to see khasra, owner, area, price and phone with verify links.',
        'Cross-check owner + area on Jamabandi and shape on Bhunaksha before token money.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Ambala Land Map - Tundla & Kalarheri', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/ambala-land-map/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {[['both', 'Both villages'], ['tundla', 'Tundla'], ['kalarheri', 'Kalarheri']].map(([k, label]) => (
            <button key={k} onClick={() => setVillage(k)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${village === k ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'}`}>{label}</button>
          ))}
          <button onClick={() => setSat(s => !s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${sat ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'}`}>🛰️ {sat ? 'Satellite on' : 'Satellite'}</button>
          <span className="text-xs text-slate-500 ml-auto">Cadastral overlay: Haryana Bhunaksha (Revenue Dept)</span>
        </div>

        <div ref={mapRef} className="w-full rounded-2xl border border-white/10 overflow-hidden" style={{ height: '520px', background: '#0f172a' }} />
        {!ready && <p className="text-xs text-slate-500">Loading map…</p>}
        {pickMode && <p className="text-xs font-bold text-amber-300">📍 Click anywhere on the map to drop your listing pin…</p>}

        <div ref={resultRef}>
          {sel ? (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sel.price ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{sel.sample ? 'Sample listing' : 'Your listing'}</span>
                <h3 className="text-base font-extrabold text-white m-0">Khasra {sel.khasra} — {VILLAGE_META[sel.village]?.name}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-1.5 text-sm">
                <div><span className="text-slate-400">Owner: </span><span className="font-semibold text-white">{sel.owner || '— check Jamabandi'}</span></div>
                <div><span className="text-slate-400">Area: </span><span className="font-semibold text-white">{sel.area || '—'}</span></div>
                <div><span className="text-slate-400">Asking price: </span><span className="font-semibold text-white">{sel.price || '—'}</span></div>
                <div><span className="text-slate-400">Phone: </span><span className="font-semibold text-white">{sel.phone || '—'}</span></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={jamabandiUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold no-underline">Verify on Jamabandi</a>
                <a href={bhunakshaUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold no-underline">Open Bhunaksha map</a>
                <a href={collectorUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold no-underline">Collector rate</a>
              </div>
              <div className="mt-3 text-xs text-slate-400 leading-relaxed">
                <b className="text-slate-200">Before token money:</b> Jamabandi owner = seller Aadhaar name? Area matches? All co-owners agreeing? Any pending mutation/intkal? Registry at/above collector rate.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 text-center">
              <p className="text-sm text-slate-400 font-medium">Click any 📍 pin on the map to see khasra, owner, price and fraud-check steps</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-extrabold text-white mb-1">➕ List your land (saved in your browser)</h3>
            <p className="text-[11px] text-slate-500 mb-3">After clicking Add, click the map to drop your pin.</p>
            <div className="space-y-2">
              <select value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} className={inputClass}>
                <option value="tundla">Tundla</option>
                <option value="kalarheri">Kalarheri</option>
              </select>
              <input value={form.khasra} onChange={e => setForm({ ...form, khasra: e.target.value })} placeholder="Khasra number, e.g. 45//12" className={inputClass} />
              <input value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="Owner name (as per Jamabandi)" className={inputClass} />
              <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Area, e.g. 2 kanal 5 marla" className={inputClass} />
              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Asking price, e.g. 45 lakh" className={inputClass} />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className={inputClass} />
              <button onClick={addListing} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all">Add + pick pin on map</button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-extrabold text-white mb-2">🔍 Look up a khasra number</h3>
            <div className="flex gap-2">
              <input value={plotNo} onChange={e => setPlotNo(e.target.value)} placeholder="Plot no, e.g. 12" className={inputClass} />
              <a href={bhunakshaUrl} target="_blank" rel="noreferrer" className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold no-underline">Search</a>
            </div>
            <ol className="text-xs text-slate-400 leading-relaxed mt-3 space-y-1.5 list-decimal list-inside">
              <li>Opens the official Bhunaksha map. Select District <b className="text-slate-200">01 Ambala</b> → Tehsil <b className="text-slate-200">006 Ambala Cantt</b> → Village <b className="text-slate-200">{village === 'kalarheri' ? '02869 Kalarheri' : '02871 Tundla'}</b>.</li>
              <li>Type plot no. <b className="text-slate-200">{plotNo || '…'}</b> in Plot Search to highlight the exact plot.</li>
              <li>Then check the same khasra on <a className="text-emerald-300" href={jamabandiUrl} target="_blank" rel="noreferrer">Jamabandi</a> for owner + area.</li>
            </ol>
            <p className="text-[11px] text-slate-500 mt-3">Village GIS codes — Tundla: 0100602871R · Kalarheri: 0100602869R. Plot boundaries on this page are the real govt raster; individual plot search needs the official portal (login-free).</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">Sources: Bhunaksha maps.revenueharyana.gov.in · Jamabandi jamabandi.nic.in · Collector rates ambala.gov.in. Phones + market prices are seller listings, not govt data.</p>
      </div>
    </ToolLayout>
  )
}
