import { useMemo, useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

function idvFactor(ageYears) {
  if (ageYears < 0.5) return 0.95
  if (ageYears < 1) return 0.85
  if (ageYears < 2) return 0.80
  if (ageYears < 3) return 0.70
  if (ageYears < 4) return 0.60
  if (ageYears < 5) return 0.50
  return 0.40
}

// Third-party annual premiums, two-wheelers (approved rates, ~2024-25)
const TP_BIKE = { upTo75: 533, upTo150: 750, upTo350: 1044, above350: 2373 }
const NCB = { 0: 0, 1: 20, 2: 25, 3: 35, 4: 45, 5: 50 }

const ADDONS = {
  zeroDep: { label: 'Zero Depreciation', calc: (od) => od * 0.15 },
  engine: { label: 'Engine Protect', calc: () => 1500 },
  roadside: { label: 'Roadside Assistance', calc: () => 500 },
}

export default function bike_insurance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [price, setPrice] = useState('120000')
  const [age, setAge] = useState('2')
  const [cc, setCc] = useState('upTo150')
  const [ncb, setNcb] = useState('0')
  const [addons, setAddons] = useState(['zeroDep'])

  const result = useMemo(() => {
    const p = parseFloat(price) || 0
    const a = parseFloat(age) || 0
    const idv = p * idvFactor(a)
    const tp = TP_BIKE[cc] || TP_BIKE.upTo150
    const odRaw = idv * 0.025
    const ncbPct = NCB[Math.min(5, Math.max(0, parseInt(ncb) || 0))] || 0
    const od = odRaw * (1 - ncbPct / 100)
    const addonList = addons.map(k => ({ key: k, label: ADDONS[k].label, amt: Math.round(ADDONS[k].calc(odRaw)) }))
    const addonTotal = addonList.reduce((s, x) => s + x.amt, 0)
    const subtotal = tp + od + addonTotal
    const gst = subtotal * 0.18
    const total = subtotal + gst
    return { idv, tp, odRaw, od, ncbPct, addonList, addonTotal, subtotal, gst, total }
  }, [price, age, cc, ncb, addons])

  const toggleAddon = (k) => {
    setAddons(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
    jumpTo()
  }

  return (
    <ToolLayout
      title="Bike / Two-Wheeler Insurance Premium Calculator India"
      desc="Calculate bike insurance premium in India: IDV by bike age, third-party and comprehensive cover with NCB discount, add-ons and 18% GST. Free instant estimate for scooters and motorcycles."
      icon="🛵" iconBg="rgba(129,140,248,0.08)"
      category="insurance" slug="bike-insurance-calculator"
      faq={[
        { q: 'What is the third-party bike insurance premium in India?', a: 'IRDAI-approved annual rates: up to 75cc ₹533, 75-150cc ₹750, 150-350cc ₹1,044, above 350cc ₹2,373 (2024-25). Electric two-wheelers and bikes above 350cc pay the highest fixed TP.' },
        { q: 'Is third-party bike insurance mandatory?', a: 'Yes. Riding without at least third-party cover is illegal under the Motor Vehicles Act — police can impound your vehicle and levy fines up to ₹4,000 + imprisonment on repeat offence. Comprehensive adds theft, accident and fire cover for your own bike.' },
        { q: 'How does NCB work for bike insurance?', a: 'Each claim-free year discounts your own damage premium by 20-50% (max after 5 years). NCB carries over between insurers, so renew on time or port — never let the policy lapse.' },
        { q: 'What is IDV for bikes?', a: "Insured Declared Value = ex-showroom price minus depreciation (95% under 6 months, ~50% at 5 years). It is what you get back if your bike is stolen or beyond repair — don't undervalue it to save premium." },
        { q: 'How much does comprehensive bike insurance cost?', a: 'Roughly 2.5-3% of IDV for own damage, plus the fixed third-party premium and any add-ons, plus 18% GST. For a ₹1.2L bike that works out to about ₹4,500-6,000 a year with zero-dep.' },
        { q: 'Do electric scooters need insurance?', a: 'Yes — EVs get long-term package policies (5 years for new EVs at ~15-25% lower own damage premium) and many states offer lower registration, but third-party insurance is still mandatory.' },
      ]}
      howItWorks={[
        'Enter your bike\'s ex-showroom price and age to compute IDV with standard depreciation.',
        'Pick engine capacity for the regulator-fixed third-party premium.',
        'Select claim-free years for up to 50% off own damage.',
        'Toggle add-ons and see the full breakdown with 18% GST instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Bike Insurance Premium Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/bike-insurance-calculator/",
        "description": "Bike and two-wheeler insurance premium calculator for India with IDV, third-party and comprehensive cover, NCB and GST.",
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
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bike Age</label>
              <div className="flex flex-wrap gap-1">
                {[0.5, 1, 2, 3, 4, 5].map(y => (
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
                <option value="upTo75" className="bg-slate-900">Up to 75cc</option>
                <option value="upTo150" className="bg-slate-900">75–150cc</option>
                <option value="upTo350" className="bg-slate-900">150–350cc</option>
                <option value="above350" className="bg-slate-900">Above 350cc</option>
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Add-ons</label>
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

        <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
          <div className="p-6 rounded-2xl border-2 border-indigo-500/20 bg-indigo-500/[0.04] text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Estimated Annual Premium (comprehensive)</div>
            <div className="text-3xl font-extrabold gradient-text">{fmt(result.total)}</div>
            <div className="text-xs text-slate-400 mt-2">incl. <b className="text-white">{fmt(result.gst)}</b> GST · IDV <b className="text-white">{fmt(result.idv)}</b></div>
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
              <div className="text-[11px] text-slate-500">{result.addonList.length ? result.addonList.map(a => a.label).join(', ') : 'none'}</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">💡 Smart renewal tips</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• <b className="text-slate-200">Renew before expiry</b> — lapsed two-wheeler policies lose NCB and can require re-inspection.</li>
              <li>• Small repairs (₹300-800 scratches) are usually cheaper than losing your 20-50% NCB on the next claim-free year.</li>
              <li>• For old bikes (5+ years), compare third-party-only — comprehensive may cost more than the bike is worth.</li>
              <li>• Long-term package policies on new EVs and 5+ year two-wheelers lock in rates and skip annual renewal friction.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}