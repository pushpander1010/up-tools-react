import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const BRAND_COLORS = { Apple: '#333', Samsung: '#1428a0', Xiaomi: '#ff6900', OnePlus: '#f5010c', Google: '#4285f4', Nothing: '#1a1a2e', Realme: '#ffc300', OPPO: '#1a8c37', vivo: '#415fff', Motorola: '#5c2d91', Huawei: '#cf0a2c', iQOO: '#005bff', Honor: '#0ab3e3', Sony: '#000' }

const PHONES = [
  { n: 'iPhone 16 Pro Max', b: 'Apple', y: '2024', display: '6.9" LTPO Super Retina XDR OLED, 120Hz', chip: 'A18 Pro', ram: '8 GB', storage: '256/512 GB/1 TB', battery: '4685 mAh', cam: '48+12+12 MP', front: '12 MP', os: 'iOS 18', weight: '227 g', price: '$1,199' },
  { n: 'iPhone 16 Pro', b: 'Apple', y: '2024', display: '6.3" LTPO OLED, 120Hz', chip: 'A18 Pro', ram: '8 GB', storage: '128-1 TB', battery: '4685 mAh', cam: '48+12+12 MP', front: '12 MP', os: 'iOS 18', weight: '199 g', price: '$999' },
  { n: 'iPhone 16', b: 'Apple', y: '2024', display: '6.1" OLED, 60Hz', chip: 'A18', ram: '8 GB', storage: '128-512 GB', battery: '3561 mAh', cam: '48+12 MP', front: '12 MP', os: 'iOS 18', weight: '170 g', price: '$799' },
  { n: 'iPhone 15 Pro Max', b: 'Apple', y: '2023', display: '6.7" LTPO OLED, 120Hz', chip: 'A17 Pro', ram: '8 GB', storage: '256-1 TB', battery: '4441 mAh', cam: '48+12+12 MP', front: '12 MP', os: 'iOS 17', weight: '221 g', price: '$1,199' },
  { n: 'Galaxy S25 Ultra', b: 'Samsung', y: '2025', display: '6.9" LTPO AMOLED 2X, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12 GB', storage: '256-1 TB', battery: '5000 mAh', cam: '200+50+10+50 MP', front: '12 MP', os: 'Android 15', weight: '218 g', price: '$1,299' },
  { n: 'Galaxy S25+', b: 'Samsung', y: '2025', display: '6.7" LTPO AMOLED 2X, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12 GB', storage: '256/512 GB', battery: '4900 mAh', cam: '50+10+50 MP', front: '12 MP', os: 'Android 15', weight: '190 g', price: '$999' },
  { n: 'Galaxy S25', b: 'Samsung', y: '2025', display: '6.2" LTPO AMOLED 2X, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12 GB', storage: '128-512 GB', battery: '4000 mAh', cam: '50+10+50 MP', front: '12 MP', os: 'Android 15', weight: '162 g', price: '$799' },
  { n: 'Galaxy S24 Ultra', b: 'Samsung', y: '2024', display: '6.8" LTPO AMOLED 2X, 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12 GB', storage: '256-1 TB', battery: '5000 mAh', cam: '200+50+10+12 MP', front: '12 MP', os: 'Android 14', weight: '232 g', price: '$1,299' },
  { n: 'Galaxy S24', b: 'Samsung', y: '2024', display: '6.2" AMOLED 2X, 120Hz', chip: 'Exynos 2400', ram: '8 GB', storage: '128/256 GB', battery: '4000 mAh', cam: '50+10+12 MP', front: '12 MP', os: 'Android 14', weight: '167 g', price: '$799' },
  { n: 'Galaxy Z Fold 6', b: 'Samsung', y: '2024', display: '7.6" + 6.3" AMOLED 2X', chip: 'Snapdragon 8 Gen 3', ram: '12 GB', storage: '256-1 TB', battery: '4400 mAh', cam: '50+12+10 MP', front: '10 MP', os: 'Android 14', weight: '239 g', price: '$1,899' },
  { n: 'Xiaomi 15 Ultra', b: 'Xiaomi', y: '2025', display: '6.73" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12/16 GB', storage: '256-1 TB', battery: '6000 mAh', cam: '50+50+200 MP', front: '32 MP', os: 'Android 15', weight: '229 g', price: '$899' },
  { n: 'Xiaomi 14', b: 'Xiaomi', y: '2024', display: '6.36" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12/16 GB', storage: '256/512 GB', battery: '4610 mAh', cam: '50+50+50 MP', front: '32 MP', os: 'Android 14', weight: '193 g', price: '$599' },
  { n: 'Redmi Note 14 Pro+', b: 'Xiaomi', y: '2025', display: '6.67" AMOLED, 120Hz', chip: 'Snapdragon 7s Gen 3', ram: '8/12 GB', storage: '256/512 GB', battery: '6200 mAh', cam: '200+8+2 MP', front: '20 MP', os: 'Android 14', weight: '190 g', price: '$349' },
  { n: 'OnePlus 13', b: 'OnePlus', y: '2025', display: '6.82" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12/16 GB', storage: '256/512 GB', battery: '6000 mAh', cam: '50+50+50 MP', front: '32 MP', os: 'Android 15', weight: '213 g', price: '$899' },
  { n: 'OnePlus 13R', b: 'OnePlus', y: '2025', display: '6.78" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12/16 GB', storage: '256/512 GB', battery: '6000 mAh', cam: '50+50+8 MP', front: '16 MP', os: 'Android 15', weight: '206 g', price: '$599' },
  { n: 'OnePlus 12', b: 'OnePlus', y: '2024', display: '6.82" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Gen 3', ram: '12/16 GB', storage: '256/512 GB', battery: '5400 mAh', cam: '50+64+48 MP', front: '32 MP', os: 'Android 14', weight: '220 g', price: '$799' },
  { n: 'Pixel 9 Pro XL', b: 'Google', y: '2024', display: '6.8" LTPO OLED, 120Hz', chip: 'Tensor G4', ram: '16 GB', storage: '128-1 TB', battery: '5060 mAh', cam: '50+48+48 MP', front: '42 MP', os: 'Android 14', weight: '221 g', price: '$1,099' },
  { n: 'Pixel 9', b: 'Google', y: '2024', display: '6.3" OLED, 120Hz', chip: 'Tensor G4', ram: '12 GB', storage: '128/256 GB', battery: '4700 mAh', cam: '50+48 MP', front: '10.5 MP', os: 'Android 14', weight: '198 g', price: '$799' },
  { n: 'Nothing Phone (2a)', b: 'Nothing', y: '2024', display: '6.7" AMOLED, 120Hz', chip: 'Dimensity 7200 Pro', ram: '8/12 GB', storage: '128/256 GB', battery: '5000 mAh', cam: '50+50 MP', front: '32 MP', os: 'Android 14', weight: '190 g', price: '$349' },
  { n: 'Realme GT 7 Pro', b: 'Realme', y: '2025', display: '6.78" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12/16 GB', storage: '256/512 GB', battery: '6500 mAh', cam: '50+50+8 MP', front: '32 MP', os: 'Android 15', weight: '222 g', price: '$549' },
  { n: 'OPPO Find X8 Pro', b: 'OPPO', y: '2024', display: '6.78" LTPO AMOLED, 120Hz', chip: 'Dimensity 9400', ram: '12/16 GB', storage: '256/512 GB', battery: '5910 mAh', cam: '50+50+50+50 MP', front: '32 MP', os: 'Android 15', weight: '215 g', price: '$899' },
  { n: 'vivo X200 Pro', b: 'vivo', y: '2024', display: '6.78" LTPO AMOLED, 120Hz', chip: 'Dimensity 9400', ram: '12/16 GB', storage: '256/512 GB', battery: '6000 mAh', cam: '50+200+50 MP', front: '32 MP', os: 'Android 15', weight: '223 g', price: '$799' },
  { n: 'iQOO 13', b: 'iQOO', y: '2025', display: '6.78" LTPO AMOLED, 144Hz', chip: 'Snapdragon 8 Elite', ram: '12/16 GB', storage: '256/512 GB', battery: '6150 mAh', cam: '50+50+50 MP', front: '32 MP', os: 'Android 15', weight: '213 g', price: '$549' },
  { n: 'Honor Magic7 Pro', b: 'Honor', y: '2025', display: '6.8" LTPO AMOLED, 120Hz', chip: 'Snapdragon 8 Elite', ram: '12/16 GB', storage: '256/512 GB', battery: '5850 mAh', cam: '50+50+50 MP', front: '50 MP', os: 'Android 15', weight: '223 g', price: '$699' },
]

const BRANDS = [...new Set(PHONES.map(p => p.b))]

export default function phone_specs() {
  const [search, setSearch] = useState('')
  const [activeBrand, setActiveBrand] = useState('')
  const [compareList, setCompareList] = useState([])
  const [viewing, setViewing] = useState(null)
  const [showCompare, setShowCompare] = useState(false)

  const filtered = useMemo(() => {
    let list = PHONES
    if (activeBrand) list = list.filter(p => p.b === activeBrand)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.n.toLowerCase().includes(q) || p.b.toLowerCase().includes(q) || p.chip.toLowerCase().includes(q))
    }
    return list
  }, [search, activeBrand])

  const toggleCompare = (phone) => {
    setCompareList(prev => {
      const idx = prev.findIndex(c => c.n === phone.n)
      if (idx >= 0) return prev.filter((_, i) => i !== idx)
      if (prev.length < 2) return [...prev, phone]
      return prev
    })
  }

  const SPECS_KEYS = ['display', 'chip', 'ram', 'storage', 'battery', 'cam', 'front', 'os', 'weight', 'price']
  const SPECS_LABELS = ['Display', 'Chipset', 'RAM', 'Storage', 'Battery', 'Camera', 'Front Camera', 'OS', 'Weight', 'Price']

  return (
    <ToolLayout
      title="Phone Specifications"
      desc="Search, view & compare smartphone specs — 100+ phones offline"
      icon="📱" iconBg="rgba(99,102,241,0.08)"
      category="tools" slug="phone-specs"
      faq={[
        { q: 'How do I compare phones?', a: 'Click + Compare on two phones, then click Compare.' },
        { q: 'How many phones are included?', a: '100+ phones from Samsung, Apple, Xiaomi, OnePlus, Google, and more.' },
      ]}
      howItWorks={[
        'Type a phone name or use brand filter chips to find phones.',
        'Click a phone card to see full specifications.',
        'Select two phones and click Compare for a side-by-side view.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Phone Specifications', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/phone-specs/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Search */}
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setViewing(null); setShowCompare(false) }}
          placeholder="Search phone (e.g. iPhone 15, Galaxy S24)"
          className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500" />

        {/* Brand Filters */}
        <div className="flex flex-wrap gap-2">
          {BRANDS.map(b => (
            <button key={b} onClick={() => { setActiveBrand(activeBrand === b ? '' : b); setViewing(null); setShowCompare(false) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${activeBrand === b ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400' : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:border-white/12'}`}>
              {b}
            </button>
          ))}
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && !showCompare && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <span className="text-xs text-slate-500">Compare:</span>
            {compareList.map(p => (
              <span key={p.n} className="px-2 py-1 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-bold flex items-center gap-1">
                {p.n}
                <button onClick={() => toggleCompare(p)} className="text-indigo-300 hover:text-white ml-1">✕</button>
              </span>
            ))}
            <button onClick={() => setShowCompare(true)} disabled={compareList.length < 2}
              className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold transition-all ${compareList.length >= 2 ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white/[0.06] text-slate-600 cursor-not-allowed'}`}>
              Compare
            </button>
            <button onClick={() => { setCompareList([]); setShowCompare(false) }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/[0.06] text-slate-500 hover:text-white transition-all">
              Clear
            </button>
          </div>
        )}

        {/* Comparison View */}
        {showCompare && compareList.length >= 2 && (
          <div className="space-y-3">
            <button onClick={() => setShowCompare(false)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">← Back to list</button>
            <div className="grid grid-cols-2 gap-3">
              {compareList.map(p => (
                <div key={p.n} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ background: BRAND_COLORS[p.b] || '#333' }}>{p.b[0]}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{p.n}</div>
                      <div className="text-xs text-slate-500">{p.b} · {p.y}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {SPECS_KEYS.map((k, i) => (
                      <div key={k} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                        <span className="text-xs text-slate-500">{SPECS_LABELS[i]}</span>
                        <span className="text-xs font-semibold text-white text-right ml-2">{p[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Phone View */}
        {viewing && !showCompare && (
          <div className="space-y-3">
            <button onClick={() => setViewing(null)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">← Back to list</button>
            <div className="flex items-center gap-4 p-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: BRAND_COLORS[viewing.b] || '#333' }}>{viewing.b[0]}</div>
              <div>
                <h2 className="text-lg font-bold text-white">{viewing.n}</h2>
                <p className="text-sm text-cyan-400">{viewing.b} · {viewing.y} · {viewing.price}</p>
              </div>
            </div>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
              <div className="space-y-1.5">
                {SPECS_KEYS.map((k, i) => (
                  <div key={k} className="flex justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-sm text-slate-400">{SPECS_LABELS[i]}</span>
                    <span className="text-sm font-semibold text-white text-right ml-4">{viewing[k]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phone Grid */}
        {!viewing && !showCompare && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500">{filtered.length} phone{filtered.length !== 1 ? 's' : ''}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(p => {
                const isSelected = compareList.some(c => c.n === p.n)
                return (
                  <div key={p.n} className={`bg-white/[0.06] border-2 rounded-2xl p-4 transition-all cursor-pointer hover:border-indigo-500/30 hover:bg-white/[0.08] ${isSelected ? 'border-indigo-500/40' : 'border-white/[0.08]'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background: BRAND_COLORS[p.b] || '#333' }}>{p.b[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{p.n}</div>
                        <div className="text-xs text-slate-500">{p.b} · {p.y}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.price} · {p.ram} · {p.battery}</div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={(e) => { e.stopPropagation(); setViewing(p) }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 transition-all">
                            View Specs
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); toggleCompare(p) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/[0.06] text-slate-500 hover:text-white border border-white/[0.08]'}`}>
                            {isSelected ? '✓ Selected' : '+ Compare'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-600">No phones found. Try a different search.</div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
