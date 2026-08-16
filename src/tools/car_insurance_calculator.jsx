import { useMemo, useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

// IDV depreciation factor by age (IRDAI IDV guidelines)
function idvFactor(ageYears) {
  if (ageYears < 0.5) return 0.95
  if (ageYears < 1) return 0.85
  if (ageYears < 2) return 0.80
  if (ageYears < 3) return 0.70
  if (ageYears < 4) return 0.60
  if (ageYears < 5) return 0.50
  return 0.40 // 5+ years: negotiated
}

// Third-party annual premium (approved rates, cars, ~2024-25)
const TP_CAR = { below1000: 2074, c1000_1500: 3097, above1500: 7908 }
// NCB discount % on own damage by claim-free years
const NCB = { 0: 0, 1: 20, 2: 25, 3: 35, 4: 45, 5: 50 }

const ADDONS = {
  zeroDep: { label: 'Zero Depreciation', calc: (od) => od * 0.15 },
  engine: { label: 'Engine Protect', calc: () => 2000 },
  rti: { label: 'Return to Invoice', calc: (od, idv) => idv * 0.004 },
  roadside: { label: 'Roadside Assistance', calc: () => 1000 },
  passenger: { label: 'Passenger Cover', calc: () => 500 },
}

export default function car_insurance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [price, setPrice] = useState('1000000')
  const [age, setAge] = useState('2') // years owned
  const [cc, setCc] = useState('c1000_1500')
  const [ncb, setNcb] = useState('0')
  const [addons, setAddons] = useState(['zeroDep'])

  const result = useMemo(() => {
    const p = parseFloat(price) || 0
    const a = parseFloat(age) || 0
    const factor = idvFactor(a)
    const idv = p * factor
    const tp = TP_CAR[cc] || TP_CAR.c1000_1500
    const odRaw = idv * 0.03 // own damage ≈ 3% of IDV before NCB
    const ncbPct = NCB[Math.min(5, Math.max(0, parseInt(ncb) || 0))] || 0
    const od = odRaw * (1 - ncbPct / 100)
    const addonList = addons.map(k => ({ key: k, label: ADDONS[k].label, amt: Math.round(ADDONS[k].calc(odRaw, idv)) }))
    const addonTotal = addonList.reduce((s, x) => s + x.amt, 0)
    const subtotal = tp + od + addonTotal
    const gst = subtotal * 0.18
    const total = subtotal + gst
    const withoutNcb = (tp + odRaw + addonTotal) * 1.18
    return { idv, tp, odRaw, od, ncbPct, addonList, addonTotal, subtotal, gst, total, withoutNcb }
  }, [price, age, cc, ncb, addons])

  const toggleAddon = (k) => {
    setAddons(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
    jumpTo()
  }

  return (
    <ToolLayout
      title="Car Insurance Premium & IDV Calculator India"
      desc="Calculate car insurance premium in India: IDV from ex-showroom price and age, third-party vs comprehensive, own damage with NCB discount, add-ons and 18% GST. Free estimate before renewal."
      icon="🚗" iconBg="rgba(251,146,60,0.08)"
      category="insurance" slug="car-insurance-calculator"
      faq={[
        { q: 'What is IDV in car insurance?', a: 'IDV (Insured Declared Value) is the maximum amount the insurer pays if your car is totalled or stolen. It is the ex-showroom price minus age-based depreciation — roughly 95% in year 1, falling to ~40-50% after 5 years. Higher IDV = higher own damage premium but better claim payout.' },
        { q: 'What is the difference between third-party and comprehensive car insurance?', a: 'Third-party (TP) covers damage you cause to others — legally mandatory in India with fixed premiums. Comprehensive adds own damage cover for your car (accidents, theft, fire, natural calamities) plus add-ons. Comprehensive costs roughly 3-4% of IDV plus the TP premium.' },
        { q: 'How does No Claim Bonus (NCB) work?', a: 'For every claim-free year your own damage premium drops: 20% after 1 year, 25% after 2, 35% after 3, 45% after 4, up to 50% after 5 years. NCB transfers when you switch insurers and is lost if you file a claim — sometimes it is cheaper to pay small repairs yourself.' },
        { q: 'Is zero depreciation add-on worth it?', a: 'Yes for new cars (0-3 years). Instead of deducting depreciation on replaced plastic/rubber parts, the insurer pays full cost. It adds ~15% to the own damage premium. After the car is 4-5 years old the value drops and the add-on is less worth it.' },
        { q: 'What is the third-party car insurance premium in India?', a: 'IRDAI-approved annual rates are roughly: cars up to 1000cc ₹2,074, 1000-1500cc ₹3,097, above 1500cc ₹7,908 (2024-25). These are fixed by the regulator and do not vary by insurer or NCB.' },
        { q: 'Can I buy car insurance without a policy?', a: 'No. Driving without third-party insurance is illegal in India (Motor Vehicles Act 1988) with penalties up to ₹4,000 and 3 months imprisonment for first offence. Renew before expiry — lapsed policies lose NCB and long-term discounts.' },
        { q: 'What is GST on car insurance?', a: '18% GST applies on the total premium (third-party + own damage + add-ons). Electric vehicles get a long-term package policy option with 15-25% lower own damage premiums.' },
      ]}
      howItWorks={[
        'Enter your car\'s ex-showroom price and age — IDV is computed with standard depreciation factors.',
        'Pick the engine capacity for the fixed third-party premium (regulator-set).',
        'Select claim-free years for the NCB discount on own damage (up to 50%).',
        'Toggle add-ons: zero depreciation, engine protect, return-to-invoice and more.',
        'The breakdown shows IDV, TP, OD, add-ons, GST 18% and the annual total — indicative; insurers may quote ±20%.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Car Insurance Premium & IDV Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/car-insurance-calculator/",
        "description": "Car insurance premium calculator for India: IDV, third-party and comprehensive cover, NCB discount, add-ons and GST.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] space-y-4" ref={resultRef}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ex-Showroom Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Car Age (years)</label>
              <div className="flex flex-wrap gap-1">
                {[0.5, 1, 2, 3, 4, 5, 7].map(y => (
                  <button key={y} onClick={() => { setAge(String(y)); jumpTo() }}
                    className={`px-2.5 py-2 rounded-lg text-[11px] font-semibold border transition-all ${parseFloat(age) === y ? 'bg-brand/15 border-brand/40 text-brand-light' : 'bg-white/[0.06] border-white/8 text-slate-400'}`}>
                    {y === 0.5 ? '6m' : y + 'y'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Engine Capacity</label>
              <select value={cc} onChange={e => setCc(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40">
                <option value="below1000" className="bg-slate-900">Below 1000cc</option>
                <option value="c1000_1500" className="bg-slate-900">1000–1500cc</option>
                <option value="above1500" className="bg-slate-900">Above 1500cc</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Claim-Free Years (NCB)</label>
              <select value={ncb} onChange={e => setNcb(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40">
                {[0, 1, 2, 3, 4, 5].map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y === 0 ? 'None' : `${y} yr${y > 1 ? 's' : ''} (${NCB[y]}%)`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Add-ons (comprehensive only)</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(ADDONS).map(k => {
                const on = addons.includes(k)
                return (
                  <button key={k} onClick={() => toggleAddon(k)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${on ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
                    {on ? '✓ ' : ''}{ADDONS[k].label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
          <div className="p-6 rounded-2xl border-2 border-amber-500/20 bg-amber-500/[0.04] text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Estimated Annual Premium (comprehensive)</div>
            <div className="text-3xl font-extrabold gradient-text">{fmt(result.total)}</div>
            <div className="text-xs text-slate-400 mt-2">incl. <b className="text-white">{fmt(result.gst)}</b> GST · IDV <b className="text-white">{fmt(result.idv)}</b> · without NCB it would be {fmt(result.withoutNcb)}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Third-Party (fixed)</div>
              <div className="text-lg font-extrabold text-white">{fmt(result.tp)}</div>
              <div className="text-[11px] text-slate-500">IRDAI approved rate</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Own Damage (OD)</div>
              <div className="text-lg font-extrabold text-white">{fmt(result.od)}</div>
              <div className="text-[11px] text-slate-500">was {fmt(result.odRaw)} − {result.ncbPct}% NCB</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Add-ons</div>
              <div className="text-lg font-extrabold text-white">{fmt(result.addonTotal)}</div>
              <div className="text-[11px] text-slate-500">{result.addonList.length ? result.addonList.map(a => a.label).join(', ') : 'none selected'}</div>
            </div>
          </div>

          {/* IDV table */}
          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📉 IDV by car age — {fmt(price)} ex-showroom</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[[0.5, 95], [1, 85], [2, 80], [3, 70], [4, 60], [5, 50]].map(([y, pct]) => (
                <div key={y} className={`p-3 rounded-xl border ${parseFloat(age) === y ? 'bg-brand/[0.08] border-brand/25' : 'bg-white/[0.05] border-white/8'}`}>
                  <div className="text-slate-500 mb-1">{y === 0.5 ? '6 months' : `${y} year${y > 1 ? 's' : ''}`}</div>
                  <div className="text-white font-bold">{fmt(price * pct / 100)}</div>
                  <div className="text-[10px] text-slate-600">{pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">💡 Smart renewal tips</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Renew before expiry — a lapsed policy <b className="text-slate-200">loses your NCB</b> and may require fresh inspection.</li>
              <li>• Don't claim small repairs (under ₹5-10k) — one claim resets your NCB to 0 and raises next-year premium.</li>
              <li>• NCB transfers to a new insurer; mention it when you port for the discount.</li>
              <li>• If your car is 5+ years old, compare pure third-party + a small OD — full comprehensive may not be worth it.</li>
              <li>• Cashless garages and claim settlement ratio (90%+) matter more than a ₹500 cheaper premium.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}