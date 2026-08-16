import { useMemo, useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

// Annual premium per ₹1 lakh sum insured by age band (indicative Indian retail, ~2026, before GST)
const RATE_BY_AGE = [
  { max: 25, rate: 900 },
  { max: 30, rate: 1100 },
  { max: 35, rate: 1300 },
  { max: 40, rate: 1600 },
  { max: 45, rate: 2000 },
  { max: 50, rate: 2600 },
  { max: 55, rate: 3400 },
  { max: 60, rate: 4500 },
  { max: 65, rate: 6000 },
  { max: 70, rate: 8000 },
  { max: 120, rate: 10500 },
]
const CHILD_RATE_PER_L = 500
const CITY_FACTOR = { metro: 1.2, tier2: 1.0, tier3: 0.85 }

function memberRate(age) {
  const a = Math.max(0, Math.round(age || 30))
  return RATE_BY_AGE.find(r => a <= r.max)?.rate ?? RATE_BY_AGE.at(-1).rate
}

export default function health_insurance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState('30')
  const [spouseAge, setSpouseAge] = useState('');
  const [childrenCount, setChildrenCount] = useState('1')
  const [parentAge, setParentAge] = useState('')
  const [sumInsured, setSumInsured] = useState('500000')
  const [city, setCity] = useState('metro')
  const [planType, setPlanType] = useState('floater') // floater | individual

  const result = useMemo(() => {
    const si = parseFloat(sumInsured) || 500000
    const L = si / 100000
    const cf = CITY_FACTOR[city] || 1
    const selfA = Math.max(0, Math.round(age || 30))

    // Members to cover
    const members = []
    members.push({ label: 'Self', age: selfA, rate: memberRate(selfA) })
    if (spouseAge !== '' ) {
      const sa = Math.max(0, Math.round(parseFloat(spouseAge) || 30))
      members.push({ label: 'Spouse', age: sa, rate: memberRate(sa) })
    }
    const kids = Math.min(4, Math.max(0, parseInt(childrenCount) || 0))
    for (let i = 0; i < kids; i++) members.push({ label: 'Child', age: 10, rate: CHILD_RATE_PER_L, child: true })
    if (parentAge !== '') {
      const pa = Math.max(0, Math.round(parseFloat(parentAge) || 65))
      members.push({ label: 'Parent', age: pa, rate: memberRate(pa) })
    }

    // Floater: premium built on the highest-risk member + children + small loading per adult
    let annual = 0
    const detail = members.map(m => {
      const base = L * m.rate * cf
      let amt = base
      if (planType === 'floater' && !m.child) amt = base * (members.filter(x => !x.child && x !== m).length > 0 ? 0.9 : 1)
      if (m.child) amt = base * 0.8
      return { ...m, amt }
    })
    annual = detail.reduce((s, m) => s + m.amt, 0)
    if (planType === 'floater' && detail.length > 1) annual *= 0.92 // family floater discount
    const gst = annual * 0.18
    const total = annual + gst

    // 80D tax deduction (old regime)
    const seniorSelf = selfA >= 60
    const seniorParent = parentAge !== '' ? (parseFloat(parentAge) || 65) >= 60 : false
    const selfLimit = seniorSelf ? 50000 : 25000
    const parentLimit = parentAge !== '' ? (seniorParent ? 50000 : 25000) : 0
    const ded80D = Math.min(annual * (parentAge !== '' ? 1 : 1), selfLimit + parentLimit)
    const cats = { selfLimit, parentLimit, totalLimit: selfLimit + parentLimit }

    return { si, L, annual, gst, total, detail, ded80D, cats, members }
  }, [age, spouseAge, childrenCount, parentAge, sumInsured, city, planType])

  const sliderOpts = [300000, 500000, 1000000, 1500000, 2500000, 5000000, 10000000]
  const senior = Math.max(0, Math.round(age || 30)) >= 60

  return (
    <ToolLayout
      title="Health Insurance Premium Calculator India"
      desc="Estimate health insurance premium in India for individual or family floater plans — by age, sum insured, city and 80D tax saving. Compare ₹3L to ₹1Cr covers before you buy."
      icon="🏥" iconBg="rgba(56,189,248,0.08)"
      category="insurance" slug="health-insurance-calculator"
      faq={[
        { q: 'How much health insurance cover do I need in India?', a: 'A ₹5L base cover per family is the IRDAI-backed minimum to consider, but with hospital inflation around 10-15% a year, ₹10-25L cover is safer for a metro family. Keep the base policy plus a super top-up of ₹25-50L — it costs a fraction of the base premium.' },
        { q: 'What is a family floater health plan?', a: 'One sum insured shared by the whole family — premium is driven by the oldest member, but it is usually cheaper than individual policies. A ₹10L floater for a couple with a child costs roughly 60-70% more than a single ₹10L policy — not per-member.' },
        { q: 'How is health insurance premium calculated?', a: 'Insurers price on the age of the oldest member, sum insured, city of residence, and number of members. Premiums roughly double every 10-12 years of age — a 60-year-old pays 4-5× what a 30-year-old pays for the same ₹5L cover.' },
        { q: 'What is 80D tax benefit on health insurance?', a: 'Under the old regime, 80D lets you deduct up to ₹25,000 for self + family premiums (₹50,000 if you are 60+), plus ₹25,000 for parents (₹50,000 if parents are senior). Total can reach ₹1.25 lakh with all seniors. The new regime allows no deduction.' },
        { q: 'Do I need separate cover for my parents?', a: 'If parents are 60+, their own policy is usually better — senior premiums are high and their claims will exhaust a shared floater fast. A separate ₹5-10L senior policy plus your own ₹10L floater is a common structure.' },
        { q: 'What are waiting periods in health insurance?', a: 'Pre-existing diseases have a typical 3-year waiting period (IRDAI cut it to 3 years; some insurers offer 1-2 years). New conditions have 30 days. Since IRDAI 2024 reforms, chronic diseases like diabetes and BP are covered after just 6 months regardless of pre-existing status.' },
        { q: 'What else should I compare beyond premium?', a: 'Network hospitals near you, room rent limit, co-pay percentage, no-claim bonus (sum insured grows 5-50% claim-free), AYUSH cover, maternity cover, daycare procedures list, cashless claims at known hospitals, and claim settlement ratio (should be 90%+).' },
      ]}
      howItWorks={[
        'Enter your age, family members and sum insured — the premium is estimated from age-band rates and city factor.',
        'Choose individual or family floater to see the cost difference.',
        'The breakdown shows the premium contribution of each member.',
        '18% GST is added, and the 80D old-regime tax saving is shown for self+family and parents.',
        'Premiums are indicative — actual quotes vary by insurer, health history and discounts. Always compare 3+ insurers.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Health Insurance Premium Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/health-insurance-calculator/",
        "description": "Estimate health insurance premium in India for individual and family floater plans with 80D tax saving.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] space-y-4" ref={resultRef}>
          {/* Sum insured */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400">Sum Insured</label>
              <span className="text-xs font-bold text-white">{fmt(result.si)}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sliderOpts.map(s => (
                <button key={s} onClick={() => { setSumInsured(String(s)); jumpTo() }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${result.si === s ? 'bg-brand/15 border-brand/40 text-brand-light' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
                  {s >= 10000000 ? '₹1 Cr' : s >= 100000 ? '₹' + (s / 100000).toLocaleString('en-IN') + 'L' : '₹' + (s / 100000).toLocaleString('en-IN') + 'L'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Spouse Age (optional)</label>
              <input type="number" value={spouseAge} onChange={e => setSpouseAge(e.target.value)} placeholder="—" className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Children</label>
              <select value={childrenCount} onChange={e => setChildrenCount(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40">
                <option className="bg-slate-900">0</option>
                <option className="bg-slate-900">1</option>
                <option className="bg-slate-900">2</option>
                <option className="bg-slate-900">3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Parent Age (optional)</label>
              <input type="number" value={parentAge} onChange={e => setParentAge(e.target.value)} placeholder="—" className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 placeholder:text-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">City Class</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40">
                <option value="metro" className="bg-slate-900">Metro (Delhi/Mumbai/BLR/HYD…)</option>
                <option value="tier2" className="bg-slate-900">Tier-2 city</option>
                <option value="tier3" className="bg-slate-900">Tier-3 / small town</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plan Type</label>
              <select value={planType} onChange={e => setPlanType(e.target.value)} className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-3 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40">
                <option value="floater" className="bg-slate-900">Family Floater (shared cover)</option>
                <option value="individual" className="bg-slate-900">Individual policies</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
          <div className="p-6 rounded-2xl border-2 border-sky-500/20 bg-sky-500/[0.04] text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Estimated Annual Premium</div>
            <div className="text-3xl font-extrabold gradient-text">{fmt(result.annual)}</div>
            <div className="text-xs text-slate-400 mt-2">+ 18% GST = <b className="text-white">{fmt(result.total)}</b> · ~<b className="text-white">{fmt(result.total / 12)}</b>/month</div>
          </div>

          {/* 80D tax saving */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">80D Tax Saving (old regime)</div>
              <div className="text-lg font-extrabold text-emerald-400">up to {fmt(result.cats.totalLimit)}</div>
              <div className="text-[11px] text-slate-500 mt-1">Self+family {fmt(result.cats.selfLimit)}{senior && ' (senior)'} · Parents {fmt(result.cats.parentLimit)}</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-slate-500 mb-1">Members covered</div>
              <div className="text-lg font-extrabold text-white">{result.members.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">{planType === 'floater' ? 'Shared ' : 'Individual '} {fmt(result.si)} sum insured</div>
            </div>
          </div>

          {/* Per-member breakdown */}
          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">👥 Premium breakdown by member</h4>
            <div className="space-y-2">
              {result.detail.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-300 font-semibold">{m.label}{m.child ? ` ×${result.members.filter(x => x.child).length}` : ''} <span className="text-slate-600">(age {m.age})</span></span>
                  <span className="text-white font-bold">{fmt(m.amt)} /yr</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 mt-3">Indicative estimates built from age-band base rates × {fmt(result.L)}L × city factor. Actual quotes depend on insurer, health history, and coverage features.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}