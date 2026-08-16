import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// ─── FY 2026-27 (AY 2027-28) Income Tax Logic — Budget 2025 slabs, unchanged by Budget 2026 ───
// New Regime (default): 0-4L 0%, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, >24L 30%
// Std deduction ₹75,000 (salaried/pensioner). 87A rebate ₹60,000 → zero tax up to ₹12L taxable.
// Old Regime: 2.5L/3L/5L nil slabs by age, 5% 2.5-5L, 20% 5-10L, 30% >10L. Std deduction ₹50,000.
// 87A rebate ₹12,500 up to ₹5L taxable (old regime). Cess 4%. Surcharge >₹50L income.

const NEW_SLABS = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
]
// nil slab depends on age: under60=250000, senior=300000, super senior=500000 (no 5% band)
const OLD_SLABS_BY_AGE = {
  under60: [{ upTo: 250000, rate: 0 }, { upTo: 500000, rate: 5 }, { upTo: 1000000, rate: 20 }, { upTo: Infinity, rate: 30 }],
  senior:  [{ upTo: 300000, rate: 0 }, { upTo: 500000, rate: 5 }, { upTo: 1000000, rate: 20 }, { upTo: Infinity, rate: 30 }],
  super:   [{ upTo: 500000, rate: 0 }, { upTo: 1000000, rate: 20 }, { upTo: Infinity, rate: 30 }],
}
const NEW_REBATE_LIMIT = 1200000
const NEW_REBATE_MAX = 60000
const OLD_REBATE_LIMIT = 500000
const OLD_REBATE_MAX = 12500
const NEW_STD = 75000
const OLD_STD = 50000

function slabTax(inc, slabs) {
  let tax = 0, prev = 0, rem = inc
  for (const s of slabs) {
    const w = Math.min(rem, s.upTo - prev)
    if (w > 0) tax += w * (s.rate / 100)
    rem -= w; prev = s.upTo
    if (rem <= 0) break
  }
  return tax
}

function slabRows(inc, slabs) {
  const rows = []
  let prev = 0, rem = inc
  for (const s of slabs) {
    const w = Math.min(rem, s.upTo - prev)
    if (s.upTo === Infinity) {
      rows.push({ band: `Above ₹${(prev / 100000).toLocaleString('en-IN')}L`, rate: s.rate, amt: w })
    } else if (w >= 0) {
      rows.push({ band: `₹${(prev / 100000).toLocaleString('en-IN')}L – ₹${(s.upTo / 100000).toLocaleString('en-IN')}L`, rate: s.rate, amt: w })
    }
    prev = s.upTo
    if (rem - w <= 0) break
    rem -= w
    if (rem <= 0) break
  }
  return rows.filter(r => r.amt > 0)
}

// 87A marginal relief: tax never exceeds the income over the rebate threshold
function applyRebateRelief(slab, taxable, limit, maxRebate) {
  if (taxable <= limit) return { tax: 0, rebate: Math.min(slab, maxRebate), relief: 0 }
  const cap = taxable - limit
  const tax = Math.min(slab, Math.max(0, cap))
  return { tax, rebate: 0, relief: slab - tax }
}

function surcharge(tax, inc, regime) {
  if (inc > 50000000) return tax * (regime === 'new' ? 0.25 : 0.37)
  if (inc > 20000000) return tax * 0.25
  if (inc > 10000000) return tax * 0.15
  if (inc > 5000000) return tax * 0.10
  return 0
}

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')
const fmtL = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

function Field({ label, value, onChange, placeholder, sub }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}{sub && <span className="text-slate-600 font-normal"> {sub}</span>}</label>
      <input type="number" inputMode="numeric" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || '0'}
        className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 transition-all duration-200 placeholder:text-slate-600" />
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${active ? 'bg-brand/15 border-brand/40 text-brand-light' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
      {children}
    </button>
  )
}

export default function income_tax_tool() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('')
  const [age, setAge] = useState('under60') // under60 | senior | super
  const [salaried, setSalaried] = useState(true)
  const [equityGains, setEquityGains] = useState(false)
  const [tds, setTds] = useState('')
  const [ded, setDed] = useState({ c80c: '', c80d: '', nps: '', homeLoan: '', other: '' })
  const [hra, setHra] = useState({ basic: '', received: '', rent: '', metro: false })
  const [ttb, setTtb] = useState('') // senior savings interest deduction 80TTB

  const inc = parseFloat(income) || 0
  const tdsAmt = parseFloat(tds) || 0

  const result = useMemo(() => {
    if (inc <= 0) return null

    // ── New Regime ──
    const newStd = salaried ? NEW_STD : 0
    const newTaxable = Math.max(0, inc - newStd)
    const newSlab = slabTax(newTaxable, NEW_SLABS)
    const { tax: newBase, rebate: newRebate, relief: newRelief } = applyRebateRelief(newSlab, newTaxable, NEW_REBATE_LIMIT, NEW_REBATE_MAX)
    // equity gains disqualify the rebate entirely — full slab tax, no relief
    const newTaxAfter = equityGains ? newSlab : newBase
    const newSurcharge = surcharge(newTaxAfter, inc, 'new')
    const newCess = (newTaxAfter + newSurcharge) * 0.04
    const newTotal = newTaxAfter + newSurcharge + newCess

    // ── Old Regime ──
    const oldStd = salaried ? OLD_STD : 0
    const hraExempt = Math.min(
      parseFloat(hra.received) || 0,
      Math.max(0, (parseFloat(hra.rent) || 0) - 0.1 * (parseFloat(hra.basic) || 0)),
      (hra.metro ? 0.5 : 0.4) * (parseFloat(hra.basic) || 0)
    )
    const ttbDed = age !== 'under60' ? Math.min(parseFloat(ttb) || 0, 100000) : 0
    const totalDeductions = Math.min(parseFloat(ded.c80c) || 0, 150000)
      + (parseFloat(ded.c80d) || 0)
      + Math.min(parseFloat(ded.nps) || 0, 50000)
      + hraExempt
      + Math.min(parseFloat(ded.homeLoan) || 0, 200000)
      + ttbDed
      + Math.min(parseFloat(ded.other) || 0, 1000000)
    const oldTaxable = Math.max(0, inc - totalDeductions - oldStd)
    const oldSlab = slabTax(oldTaxable, OLD_SLABS_BY_AGE[age])
    const { tax: oldBase, rebate: oldRebate, relief: oldRelief } = applyRebateRelief(oldSlab, oldTaxable, OLD_REBATE_LIMIT, OLD_REBATE_MAX)
    const oldTaxAfter = equityGains ? oldSlab : oldBase
    const oldSurcharge = surcharge(oldTaxAfter, inc, 'old')
    const oldCess = (oldTaxAfter + oldSurcharge) * 0.04
    const oldTotal = oldTaxAfter + oldSurcharge + oldCess

    const better = newTotal <= oldTotal ? 'new' : 'old'
    const saving = Math.abs(newTotal - oldTotal)
    const effectiveRate = ((Math.min(newTotal, oldTotal)) / inc) * 100
    const newBalance = tdsAmt > 0 ? newTotal - tdsAmt : null
    const oldBalance = tdsAmt > 0 ? oldTotal - tdsAmt : null

    return {
      newTotal, oldTotal, newTaxable, oldTaxable, totalDeductions, better, saving, effectiveRate,
      newBreakdown: { slab: newSlab, tax: newTaxAfter, rebate: equityGains ? 0 : newRebate, relief: equityGains ? 0 : newRelief, surcharge: newSurcharge, cess: newCess },
      oldBreakdown: { slab: oldSlab, tax: oldTaxAfter, rebate: oldRebate, relief: oldRelief, surcharge: oldSurcharge, cess: oldCess },
      newRows: slabRows(newTaxable, NEW_SLABS),
      oldRows: slabRows(oldTaxable, OLD_SLABS_BY_AGE[age]),
      newStd, oldStd, hraExempt,
      balance: { new: newBalance, old: oldBalance },
    }
  }, [inc, age, salaried, equityGains, tds, ded, hra, ttb])

  const effectiveIncome = inc > 0 ? (result ? Math.min(result.newTotal, result.oldTotal) : 0) : 0

  return (
    <ToolLayout
      title="Income Tax Calculator India FY 2026-27 (New vs Old Regime)"
      desc="Compare new vs old income tax regime for FY 2026-27 (AY 2027-28). Calculate tax with ₹75,000 standard deduction, ₹60,000 Section 87A rebate, ₹12 lakh zero-tax limit, HRA, 80C, 80D and NPS deductions. See which regime saves you more instantly."
      icon="🧾" iconBg="rgba(34,197,94,0.08)"
      category="tax" slug="income-tax-tool"
      faq={[
        { q: 'How much tax on ₹12 lakh salary in FY 2026-27?', a: 'Zero, under the new regime. The ₹75,000 standard deduction takes taxable income to ₹11.25 lakh, and the Section 87A rebate of up to ₹60,000 wipes out the slab tax. Even ₹12.75 lakh gross salary can still be tax-free. This holds for FY 2025-26 and FY 2026-27 — Budget 2026 kept the slabs unchanged.' },
        { q: 'What are the new regime tax slabs for FY 2026-27?', a: '0–₹4L: 0%, ₹4–8L: 5%, ₹8–12L: 10%, ₹12–16L: 15%, ₹16–20L: 20%, ₹20–24L: 25%, above ₹24L: 30%. Salaried taxpayers get a flat ₹75,000 standard deduction.' },
        { q: 'Which regime should I choose in FY 2026-27?', a: 'New regime wins for most people — especially incomes below ₹15–16 lakh — unless your old-regime deductions (80C ₹1.5L, HRA, home loan ₹2L, NPS, 80D) exceed roughly ₹6–8 lakh. This calculator compares both and shows the exact saving.' },
        { q: 'What is the Section 87A rebate and marginal relief?', a: 'The 87A rebate (up to ₹60,000 in the new regime) makes taxable income up to ₹12 lakh tax-free. Marginal relief ensures that if your taxable income is just above ₹12 lakh (up to ~₹12.75L), your tax never exceeds the amount above ₹12 lakh.' },
        { q: 'Do equity gains affect the 87A rebate?', a: 'Yes. If you have any taxable equity STCG (20%) or LTCG (12.5%) in the year, the 87A rebate is not available at all — your salary income is taxed from the first slab. Tick the equity gains option in the calculator to see the impact.' },
        { q: 'What deductions still work in the new regime?', a: 'Very few: only the employer NPS contribution under 80CCD(2) (up to 14% of basic) and the ₹75,000 standard deduction. 80C, HRA, home loan interest and 80D only reduce tax in the old regime.' },
        { q: 'What is the old regime standard deduction?', a: '₹50,000 for salaried employees and pensioners. The old regime 87A rebate is ₹12,500, making taxable income up to ₹5 lakh tax-free. Senior citizens get higher nil slabs (₹3L for 60-79, ₹5L for 80+).' },
        { q: 'How is surcharge and cess calculated?', a: 'Surcharge applies on tax for income above ₹50 lakh (10%), ₹1 crore (15%), ₹2 crore (25%) and ₹5 crore (37% old regime / 25% capped new regime). A 4% Health & Education cess is added on tax plus surcharge.' },
      ]}
      howItWorks={[
        'Enter your annual gross income (before any deductions).',
        'Select your age group — it only affects the old regime nil slab (₹2.5L / ₹3L / ₹5L).',
        'Mark salaried to apply the ₹75,000 (new) / ₹50,000 (old) standard deduction automatically.',
        'Fill in old regime deductions: 80C, 80D, NPS, HRA, home loan interest, senior savings interest.',
        'Tick equity gains if you sold equity shares/profit from equity MFs this year (removes the 87A rebate).',
        'Compare both regimes side by side with slab-by-slab breakdown — the calculator shows the winner, the saving, and your effective tax rate.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Income Tax Calculator India FY 2026-27", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/income-tax-tool/",
        "description": "Free income tax calculator for FY 2026-27 (AY 2027-28) comparing new vs old regime with ₹75,000 standard deduction, ₹60,000 87A rebate and ₹12 lakh zero-tax limit.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* FY badge */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-full">FY 2026-27 (AY 2027-28)</span>
          <span className="text-[11px] font-semibold bg-white/[0.06] text-slate-400 border border-white/8 px-3 py-1.5 rounded-full">Slabs unchanged from FY 2025-26 · Income Tax Act 2025</span>
        </div>

        {/* Income Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual Gross Income</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-green-500/30">₹</span>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-12 pr-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-green-500/40 transition-all duration-300 placeholder:text-white/8" />
          </div>
        </div>

        {/* Profile chips */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age Group</label>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={age === 'under60'} onClick={() => { setAge('under60'); jumpTo() }}>Under 60</Chip>
              <Chip active={age === 'senior'} onClick={() => { setAge('senior'); jumpTo() }}>60–79</Chip>
              <Chip active={age === 'super'} onClick={() => { setAge('super'); jumpTo() }}>80+</Chip>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Employment</label>
            <div className="flex flex-wrap gap-1.5">
              <Chip active={salaried} onClick={() => { setSalaried(true); jumpTo() }}>Salaried</Chip>
              <Chip active={!salaried} onClick={() => { setSalaried(false); jumpTo() }}>Self-employed</Chip>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => setEquityGains(!equityGains)}
            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${equityGains ? 'bg-amber-500/8 border-amber-500/25' : 'bg-white/[0.05] border-white/8 hover:border-white/12'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${equityGains ? 'bg-amber-500 text-white' : 'bg-white/10 text-transparent'}`}>{equityGains && '✓'}</div>
              <div>
                <div className="text-sm font-bold text-white">Equity gains (STCG/LTCG)</div>
                <div className="text-[11px] text-slate-400">Removes the ₹60,000 87A rebate entirely</div>
              </div>
            </div>
          </button>
          <Field label="TDS Already Paid (Form 26AS)" value={tds} onChange={setTds} sub="shows refund or balance due" />
        </div>

        {/* Old Regime Deductions */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
          <h3 className="text-sm font-bold text-slate-300 mb-1">📊 Old Regime Deductions</h3>
          <p className="text-[11px] text-slate-500 mb-4">These only reduce tax in the old regime. The new regime ignores them (except standard deduction).</p>
          <div ref={resultRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="80C (max ₹1.5L)" value={ded.c80c} onChange={v => setDed(d => ({ ...d, c80c: v }))} />
            <Field label="80D (Health)" value={ded.c80d} onChange={v => setDed(d => ({ ...d, c80d: v }))} />
            <Field label="NPS 80CCD(1B) (₹50K)" value={ded.nps} onChange={v => setDed(d => ({ ...d, nps: v }))} />
            <Field label="Home Loan Int 24(b)" value={ded.homeLoan} onChange={v => setDed(d => ({ ...d, homeLoan: v }))} />
            <Field label="80E/80G/80TTA (other)" value={ded.other} onChange={v => setDed(d => ({ ...d, other: v }))} />
            {age !== 'under60' && <Field label="80TTB Interest (₹1L)" value={ttb} onChange={setTtb} />}
          </div>

          {/* HRA Section */}
          <div className="mt-5 pt-4 border-t border-white/8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">HRA Exemption</h4>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Basic Salary" value={hra.basic} onChange={v => setHra(h => ({ ...h, basic: v }))} />
              <Field label="HRA Received" value={hra.received} onChange={v => setHra(h => ({ ...h, received: v }))} />
              <Field label="Rent Paid" value={hra.rent} onChange={v => setHra(h => ({ ...h, rent: v }))} />
            </div>
            <button onClick={() => setHra(h => ({ ...h, metro: !h.metro }))}
              className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${hra.metro ? 'bg-purple-500/10 border-purple-500/25 text-purple-400' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
              <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold ${hra.metro ? 'bg-purple-500 text-white' : 'bg-white/10 text-transparent'}`}>{hra.metro && '✓'}</div>
              Metro city (Delhi, Mumbai, Kolkata, Chennai — 50% of basic)
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Winner Banner */}
            <div className={`p-5 rounded-2xl border-2 text-center ${result.better === 'new' ? 'bg-brand/5 border-brand/20' : 'bg-green-500/5 border-green-500/20'}`}>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Better Regime for You</div>
              <div className="text-2xl font-extrabold gradient-text">{result.better === 'new' ? 'New Regime' : 'Old Regime'}</div>
              {result.saving > 0
                ? <div className="text-green-400 font-bold mt-1">You save {fmt(result.saving)} a year</div>
                : <div className="text-slate-400 font-bold mt-1">Both regimes give the same result</div>}
              <div className="text-[11px] text-slate-500 mt-1">Effective tax rate: {result.effectiveRate.toFixed(1)}% of gross income</div>
            </div>

            {/* Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'New Regime', data: result.newBreakdown, taxable: result.newTaxable, std: result.newStd, total: result.newTotal, color: 'brand', better: result.better === 'new', balance: result.balance.new },
                { label: 'Old Regime', data: result.oldBreakdown, taxable: result.oldTaxable, std: result.oldStd, total: result.oldTotal, color: 'emerald', better: result.better === 'old', balance: result.balance.old },
              ].map(regime => (
                <div key={regime.label} className={`p-5 rounded-2xl border transition-all ${regime.better ? 'border-brand/25 bg-brand/[0.04]' : 'bg-white/[0.05] border-white/8'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-bold ${regime.better ? 'text-brand-light' : 'text-slate-400'}`}>{regime.label}</h3>
                    {regime.better && <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">BETTER</span>}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-400">Gross income</span><span className="text-white font-medium">{fmt(inc)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Standard deduction</span><span className="text-white font-medium">− {fmt(regime.std)}</span></div>
                    {regime.label === 'Old Regime' && result.totalDeductions > 0 &&
                      <div className="flex justify-between"><span className="text-slate-400">Other deductions</span><span className="text-white font-medium">− {fmt(result.totalDeductions)}</span></div>}
                    <div className="flex justify-between border-t border-white/8 pt-2"><span className="text-slate-400">Taxable income</span><span className="text-white font-medium">{fmt(regime.taxable)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Slab tax</span><span className="text-white font-medium">{fmt(regime.data.slab)}</span></div>
                    {regime.data.rebate > 0 && <div className="flex justify-between text-emerald-400"><span>87A rebate</span><span>− {fmt(regime.data.rebate)}</span></div>}
                    {regime.data.relief > 0 && <div className="flex justify-between text-emerald-400"><span>Marginal relief</span><span>− {fmt(regime.data.relief)}</span></div>}
                    {regime.data.surcharge > 0 && <div className="flex justify-between"><span className="text-slate-400">Surcharge</span><span className="text-white font-medium">{fmt(regime.data.surcharge)}</span></div>}
                    <div className="flex justify-between"><span className="text-slate-400">Cess (4%)</span><span className="text-white font-medium">{fmt(regime.data.cess)}</span></div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/8">
                      <span className="text-white">Total Tax</span>
                      <span className={regime.better ? 'text-brand-light' : 'text-slate-300'}>{fmt(regime.total)}</span>
                    </div>
                    {regime.balance !== null && (
                      <div className={`flex justify-between pt-1 ${regime.balance <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <span>{regime.balance <= 0 ? 'Refund due' : 'Balance payable'}</span>
                        <span className="font-bold">{fmt(Math.abs(regime.balance))}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Slab breakdown for better regime */}
            {(result.better === 'new' ? result.newRows : result.oldRows).length > 0 && (
              <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
                <h3 className="text-sm font-bold text-slate-300 mb-3">📋 Slab-by-Slab Breakdown — {result.better === 'new' ? 'New Regime' : 'Old Regime'}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 text-left">
                        <th className="py-2 pr-3 font-semibold">Income Slab</th>
                        <th className="py-2 pr-3 font-semibold">Rate</th>
                        <th className="py-2 font-semibold text-right">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(result.better === 'new' ? result.newRows : result.oldRows).map((r, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="py-2 pr-3 text-slate-300">{r.band}</td>
                          <td className="py-2 pr-3 text-slate-300">{r.rate}%</td>
                          <td className="py-2 text-white font-medium text-right">{fmt(r.amt * r.rate / 100)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FY 2026-27 quick reference */}
            <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
              <h3 className="text-sm font-bold text-slate-300 mb-3">⚡ Quick Reference — FY 2026-27, salaried, under 60, no deductions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 text-left">
                      <th className="py-2 pr-3 font-semibold">Annual Salary</th>
                      <th className="py-2 pr-3 font-semibold">New Regime</th>
                      <th className="py-2 font-semibold">Old Regime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[[500000, '₹0 · tax-free', '₹0 · tax-free'], [750000, '₹0 · tax-free', '₹54,600'], [1000000, '₹0 · tax-free', '₹1,06,600'], [1200000, '₹0 · tax-free', '₹1,63,800'], [1500000, '₹97,500', '₹2,57,400'], [2000000, '₹1,92,400', '₹4,13,400'], [2500000, '₹3,19,800', '₹5,69,400'], [3000000, '₹4,75,800', '₹7,25,400']].map(([sal, n, o]) => (
                      <tr key={`${sal}`} className="border-t border-white/5">
                        <td className="py-2 pr-3 text-slate-300">{fmt(sal)}</td>
                        <td className="py-2 pr-3 text-emerald-400 font-medium">{n}</td>
                        <td className="py-2 text-slate-300">{o}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">Includes 4% cess. New regime includes ₹75,000 standard deduction; old regime ₹50,000. No surcharge below ₹50 lakh.</p>
            </div>
          </div>
        )}

        {/* Zero income hint */}
        {inc <= 0 && (
          <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.04] text-xs text-slate-400 text-center">
            Enter your annual income to see both regimes, the winner, and your slab-by-slab tax — live, no page reload.
          </div>
        )}
      </div>
    </ToolLayout>
  )
}