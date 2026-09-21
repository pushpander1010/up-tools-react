import { useState, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const VILLAGE_META = {
  tundla: { name: 'Tundla', gis: '0100602871R', tehsil: 'Ambala Cantt', code: '02871' },
  kalarheri: { name: 'Kalarheri', gis: '0100602869R', tehsil: 'Ambala', code: '02869' },
}

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
  const layersRef = useRef({ overlays: {}, plotLayer: null, base: null, sat: null, plots: {} })
  const [ready, setReady] = useState(false)
  const [geo, setGeo] = useState(null)
  const [plotData, setPlotData] = useState(null)
  const [village, setVillage] = useState('tundla')
  const [sat, setSat] = useState(false)
  const [raster, setRaster] = useState(true)
  const [sel, setSel] = useState(null)
  const [q, setQ] = useState('')
  const [mine, setMine] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ambala-land-mine') || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ khasra: '', price: '', phone: '' })
  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-2.5 text-white text-sm font-medium outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]'

  useEffect(() => {
    fetch('/ambala-land/villages.json').then(r => r.json()).then(setGeo).catch(() => {})
    fetch('/ambala-land/tundla_plots.json').then(r => r.json()).then(setPlotData).catch(() => {})
  }, [])

  useEffect(() => {
    if (!geo || mapObj.current) return
    let dead = false
    loadLeaflet().then(L => {
      if (dead || !mapRef.current) return
      const map = L.map(mapRef.current).setView([30.3835, 76.8555], 16)
      const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: 'OpenStreetMap' }).addTo(map)
      const satL = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Esri' })
      const overlays = {}
      Object.keys(VILLAGE_META).forEach(k => {
        const g = geo[k]
        if (!g) return
        overlays[k] = L.imageOverlay(`/ambala-land/${k}.png`, g.bounds, { opacity: 0.8, interactive: false }).addTo(map)
      })
      const plotLayer = L.layerGroup().addTo(map)
      mapObj.current = map
      layersRef.current = { overlays, plotLayer, base, sat: satL, plots: {} }
      setReady(true)
    }).catch(() => {})
    return () => { dead = true }
  }, [geo])

  // draw clickable vectors (retry until map + data both ready)
  useEffect(() => {
    if (!plotData || !window.L) return
    let tries = 0
    const t = setInterval(() => {
      const map = mapObj.current
      tries++
      if (map) {
        clearInterval(t)
        const L = window.L
        const { plotLayer } = layersRef.current
        plotLayer.clearLayers()
        layersRef.current.plots = {}
        plotData.plots.forEach(p => {
          const poly = L.polygon(p.b, {
            color: p.g ? '#60a5fa' : '#34d399', weight: 2, fillOpacity: 0.4,
            fillColor: p.g ? '#3b82f6' : '#10b981',
          })
          poly.bindTooltip(`Khasra ${p.k}`)
          poly.on('click', () => {
            const listing = JSON.parse(localStorage.getItem('ambala-land-mine') || '[]').find(m => m.khasra === p.k)
            setSel({ ...p, listing })
            jumpTo()
          })
          layersRef.current.plots[p.k] = poly
          plotLayer.addLayer(poly)
        })
      } else if (tries > 50) clearInterval(t)
    }, 200)
    return () => clearInterval(t)
  }, [plotData])

  useEffect(() => {
    const map = mapObj.current
    if (!map || !window.L) return
    const { overlays, base, sat } = layersRef.current
    Object.keys(overlays).forEach(k => {
      const show = raster && (village === 'both' || village === k)
      if (show && !map.hasLayer(overlays[k])) overlays[k].addTo(map)
      if (!show && map.hasLayer(overlays[k])) map.removeLayer(overlays[k])
    })
    if (sat && !map.hasLayer(sat)) { map.removeLayer(base); sat.addTo(map) }
    if (!sat && map.hasLayer(sat)) { map.removeLayer(sat); base.addTo(map) }
    if (geo && geo[village]) map.flyTo(geo[village].center, village === 'both' ? 13 : 16, { duration: 0.8 })
  }, [village, sat, raster, geo])

  const findPlot = () => {
    const poly = layersRef.current.plots[q.trim()]
    const map = mapObj.current
    if (poly && map) {
      map.fitBounds(poly.getBounds().pad(0.6))
      poly.fire('click')
    }
  }

  const addListing = () => {
    if (!form.khasra.trim() || !plotData) return
    const match = plotData.plots.find(p => p.k === form.khasra.trim())
    if (!match) { alert(`Khasra ${form.khasra} not in the ${plotData.count}-plot dataset yet. Full village sweep still running - check spelling like 12//15.`); return }
    const arr = [...mine.filter(m => m.khasra !== match.k), { khasra: match.k, price: form.price, phone: form.phone }]
    setMine(arr)
    try { localStorage.setItem('ambala-land-mine', JSON.stringify(arr)) } catch {}
    setSel({ ...match, listing: arr.find(m => m.khasra === match.k) })
    setForm({ khasra: '', price: '', phone: '' })
    jumpTo()
  }

  const jamabandiUrl = 'https://jamabandi.nic.in/'
  const bhunakshaUrl = 'https://maps.revenueharyana.gov.in/home'
  const collectorUrl = 'https://ambala.gov.in/document-category/collector-rate/'
  const nPriv = plotData ? plotData.plots.filter(p => !p.g).length : 0

  return (
    <ToolLayout
      title="Ambala Land Map - Tundla & Kalarheri"
      desc={`Ambala land map: ${plotData ? plotData.count : ''} real Bhunaksha plots of Tundla (02871) with govt-record owners - click any plot for khasra, owner, area. Kalarheri raster overlay live, clickable plots next. Free, no sign-up.`}
      icon="🗺️" iconBg="rgba(16,185,129,0.08)"
      category="india" slug="ambala-land-map"
      faq={[
        { q: 'Are plot owners real govt data?', a: 'Yes. Plot boundaries come from Bhunaksha (Haryana Revenue Dept) and owner names + areas come from the same govt record. 385 of 453 Tundla plots have owner data live; the rest fill in when the portal is back. Always re-verify on jamabandi.nic.in before any deal - records update with mutations.' },
        { q: 'Why do plots look like boxes, not exact shapes?', a: 'This POC uses plot bounding boxes from the govt point-lookup API. Exact polygon shapes come next from the full village sweep. Position and khasra numbers are exact.' },
        { q: 'Where do phone numbers and prices come from?', a: 'Govt records never publish phone numbers or market prices. Those appear only when a seller lists them on a khasra via the form below. Collector rate (minimum registry price) is on ambala.gov.in.' },
        { q: 'How do I verify a plot before buying?', a: 'Click the plot, note khasra + owner, check the same khasra on Jamabandi (jamabandi.nic.in), match seller Aadhaar name with the owner, confirm all co-owners agree, and check pending mutations with the patwari.' },
        { q: 'Which villages are covered?', a: `Tundla (02871, Ambala Cantt) has ${plotData ? plotData.count : ''} clickable plots live with owners on most. Kalarheri (02869) raster overlay is live; its ~1000 clickable plots resume when the govt portal is back.` },
      ]}
      howItWorks={[
        'Zoom into Tundla - every plot is a clickable vector with its khasra number.',
        'Click any plot to see the govt-record owner, area, plus any seller price/phone.',
        'Cross-check owner on Jamabandi and shape on Bhunaksha before token money.',
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
          {[['tundla', `Tundla (${plotData ? plotData.count : '…'} plots)`], ['kalarheri', 'Kalarheri (raster)'], ['both', 'Both']].map(([k, label]) => (
            <button key={k} onClick={() => setVillage(k)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${village === k ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'}`}>{label}</button>
          ))}
          <button onClick={() => setSat(s => !s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${sat ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'}`}>🛰️ Satellite</button>
          <button onClick={() => setRaster(r => !r)}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]">🗺️ Raster {raster ? 'on' : 'off'}</button>
          <span className="text-xs text-slate-500 ml-auto">
            <span className="text-emerald-300">■</span> private ({nPriv}) · <span className="text-blue-300">■</span> govt · <span className="text-slate-400">■</span> owner pending
          </span>
        </div>

        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-2.5 text-xs text-amber-200/90 leading-relaxed">
          Live: 453 Tundla plots, owners on 385. 68 plots show grey until the govt portal is back. Kalarheri raster live, ~1000 clickable plots next.
        </div>

        <div className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && findPlot()}
            placeholder="Jump to khasra, e.g. 12//15" className={inputClass} />
          <button onClick={findPlot} className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold">Find</button>
        </div>

        <div ref={mapRef} className="w-full rounded-2xl border border-white/10 overflow-hidden" style={{ height: '560px', background: '#0f172a' }} />
        {!ready && <p className="text-xs text-slate-500">Loading map…</p>}

        <div ref={resultRef}>
          {sel ? (
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sel.g ? 'bg-blue-500/15 text-blue-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                  {sel.g ? 'Govt / common land' : 'Private owner (govt record)'}
                </span>
                {sel.listing?.price && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">For sale: {sel.listing.price}</span>}
                <h3 className="text-base font-extrabold text-white m-0">Khasra {sel.k} — Tundla</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mt-1">{sel.o && !/FETCH_ERROR/.test(sel.o) ? sel.o : 'Owner record pending — govt portal was down during fetch. Verify this khasra on Jamabandi directly.'}</p>
              {sel.listing && (
                <div className="grid sm:grid-cols-2 gap-1.5 text-sm mt-2">
                  <div><span className="text-slate-400">Asking price: </span><span className="font-semibold text-white">{sel.listing.price || '—'}</span></div>
                  <div><span className="text-slate-400">Seller phone: </span><span className="font-semibold text-white">{sel.listing.phone || '—'}</span></div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={jamabandiUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold no-underline">Verify on Jamabandi</a>
                <a href={bhunakshaUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold no-underline">Open Bhunaksha map</a>
                <a href={collectorUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold no-underline">Collector rate</a>
              </div>
              <div className="mt-3 text-xs text-slate-400 leading-relaxed">
                <b className="text-slate-200">Before token money:</b> Jamabandi owner = seller Aadhaar name? All co-owners agreeing? Any pending mutation/intkal? Registry at/above collector rate.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 text-center">
              <p className="text-sm text-slate-400 font-medium">Click any plot on the map — khasra + govt owner appears here. Zoom in fully, vectors stay sharp.</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-extrabold text-white mb-1">➕ Sell your land (attach price + phone to your khasra)</h3>
            <p className="text-[11px] text-slate-500 mb-3">Saved in your browser. Only khasras in the dataset are accepted.</p>
            <div className="space-y-2">
              <input value={form.khasra} onChange={e => setForm({ ...form, khasra: e.target.value })} placeholder="Your khasra, e.g. 12//15" className={inputClass} />
              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Asking price, e.g. 45 lakh" className={inputClass} />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className={inputClass} />
              <button onClick={addListing} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all">Attach to my khasra</button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-extrabold text-white mb-2">🔍 Full khasra lookup (official portal)</h3>
            <ol className="text-xs text-slate-400 leading-relaxed mt-1 space-y-1.5 list-decimal list-inside">
              <li>Open <a className="text-emerald-300" href={bhunakshaUrl} target="_blank" rel="noreferrer">Bhunaksha</a>: District <b className="text-slate-200">01 Ambala</b> → Tehsil <b className="text-slate-200">006 Ambala Cantt</b> → Village <b className="text-slate-200">02871 Tundla / 02869 Kalarheri</b>.</li>
              <li>Type any plot no. in Plot Search for the exact shape + ROR owner.</li>
              <li>Match the same khasra on <a className="text-emerald-300" href={jamabandiUrl} target="_blank" rel="noreferrer">Jamabandi</a>.</li>
            </ol>
            <p className="text-[11px] text-slate-500 mt-3">GIS codes — Tundla: 0100602871R · Kalarheri: 0100602869R. Full-village plot sweep in progress; this page auto-updates with more plots.</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">Sources: Bhunaksha maps.revenueharyana.gov.in · Jamabandi jamabandi.nic.in · Collector rates ambala.gov.in. Phones + market prices are seller listings, not govt data.</p>
      </div>
    </ToolLayout>
  )
}
