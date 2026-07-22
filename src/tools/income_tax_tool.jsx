import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

// ─── Tax Logic ───
const NEW_SLABS = [{ upTo: 300000, rate: 0 }, { upTo: 700000, rate: 5 }, { upTo: 1000000, rate: 10 }, { upTo: 1200000, rate: 15 }, { upTo: 1500000, rate: 20 }, { upTo: Infinity, rate: 30 }]
const OLD_SLABS = [{ upTo: 250000, rate: 0 }, { upTo: 500000, rate: 5 }, { upTo: 1000000, rate: 20 }, { upTo: Infinity, rate: 30 }]
const STD = 50000

function slabTax(inc, slabs) {
  let tax = 0, prev = 0, rem = inc
  for (const s of slabs) { const w = Math.min(rem, s.upTo - prev); if (w > 0) tax += w * (s.rate / 100); rem -= w; prev = s.upTo; if (rem <= 0) break }
  return tax
}

function surcharge(tax, inc) {
  if (inc > 5000000) return tax * 0.37
  if (inc > 2000000) return tax * 0.25
  if (inc > 1000000) return tax * 0.15
  if (inc > 500000) return tax * 0.10
  return 0
}

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || '0'}
        className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-sm text-white font-semibold outline-none focus:border-brand/40 transition-all duration-200 placeholder:text-slate-600" />
    </div>
  )
}

export default function income_tax_tool() {
  const [income, setIncome] = useState('')
  const [sd, setSd] = useState(true)
  const [ded, setDed] = useState({ c80c: '', c80d: '', nps: '', homeLoan: '' })
  const [hra, setHra] = useState({ basic: '', received: '', rent: '', metro: false })

  const inc = parseFloat(income) || 0

  const result = useMemo(() => {
    if (inc <= 0) return null

    // New Regime
    const newTaxable = Math.max(0, inc - (sd ? STD : 0))
    const newTaxBase = slabTax(newTaxable, NEW_SLABS)
    const newRebate = newTaxable <= 700000 ? newTaxBase : 0
    const newTaxAfterRebate = newTaxBase - newRebate
    const newSurcharge = surcharge(newTaxAfterRebate, inc)
    const newCess = (newTaxAfterRebate + newSurcharge) * 0.04
    const newTotal = newTaxAfterRebate + newSurcharge + newCess

    // Old Regime
    const hraExempt = Math.min(
      parseFloat(hra.received) || 0,
      Math.max(0, (parseFloat(hra.rent) || 0) - 0.1 * (parseFloat(hra.basic) || 0)),
      (hra.metro ? 0.5 : 0.4) * (parseFloat(hra.basic) || 0)
    )
    const totalDeductions = Math.min(parseFloat(ded.c80c) || 0, 150000)
      + (parseFloat(ded.c80d) || 0)
      + Math.min(parseFloat(ded.nps) || 0, 50000)
      + hraExempt
      + Math.min(parseFloat(ded.homeLoan) || 0, 200000)

    const oldTaxable = Math.max(0, inc - totalDeductions - (sd ? STD : 0))
    const oldTaxBase = slabTax(oldTaxable, OLD_SLABS)
    const oldRebate = oldTaxable <= 500000 ? oldTaxBase : 0
    const oldTaxAfterRebate = oldTaxBase - oldRebate
    const oldSurcharge = surcharge(oldTaxAfterRebate, inc)
    const oldCess = (oldTaxAfterRebate + oldSurcharge) * 0.04
    const oldTotal = oldTaxAfterRebate + oldSurcharge + oldCess

    const better = newTotal <= oldTotal ? 'new' : 'old'
    const saving = Math.abs(newTotal - oldTotal)

    return { newTotal, oldTotal, newTaxable, oldTaxable, totalDeductions, better, saving,
      newBreakdown: { tax: newTaxAfterRebate, surcharge: newSurcharge, cess: newCess },
      oldBreakdown: { tax: oldTaxAfterRebate, surcharge: oldSurcharge, cess: oldCess }
    }
  }, [inc, sd, ded, hra])

  return (
    <ToolLayout
      title="Income Tax Calculator India FY 2024-25"
      desc="Compare old vs new income tax regime. Calculate tax with deductions, HRA, 80C, 80D. See which regime saves you more."
      icon="🧾" iconBg="rgba(34,197,94,0.08)"
      category="tax" slug="income-tax-tool"
      faq={[
        { q: 'Which regime should I choose?', a: 'Enter your income and deductions — the calculator shows which regime saves you more automatically.' },
        { q: 'What is the new regime rebate?', a: 'Under new regime, income up to ₹7L gets full rebate — you pay zero tax.' },
        { q: 'What deductions are allowed in old regime?', a: '80C (₹1.5L), 80D (health insurance), NPS 1B (₹50K), HRA exemption, home loan interest (₹2L), and standard deduction (₹50K).' },
        { q: 'What is cess?', a: '4% Health & Education cess is charged on total tax plus surcharge.' },
      ]}
      howItWorks={[
        'Enter your annual gross income.',
        'Toggle standard deduction (₹50,000 — available in both regimes).',
        'Fill in old regime deductions: 80C, 80D, NPS, HRA, home loan interest.',
        'Compare both regimes side by side.',
        'The calculator shows which regime saves you more and by how much.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Income Tax Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/income-tax-tool/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Income Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual Income</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-green-500/30">₹</span>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-12 pr-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-green-500/40 transition-all duration-300 placeholder:text-white/8" />
          </div>
        </div>

        {/* Standard Deduction */}
        <button onClick={() => setSd(!sd)}
          className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${sd ? 'bg-green-500/8 border-green-500/25' : 'bg-white/[0.05] border-white/8 hover:border-white/12'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${sd ? 'bg-green-500 text-white' : 'bg-white/10 text-transparent'}`}>
              {sd && '✓'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">Standard Deduction — ₹50,000</div>
              <div className="text-[11px] text-slate-500">Available in both old and new regimes</div>
            </div>
          </div>
        </button>

        {/* Old Regime Deductions */}
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05]">
          <h3 className="text-sm font-bold text-slate-300 mb-4">📊 Old Regime Deductions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="80C (max ₹1.5L)" value={ded.c80c} onChange={v => setDed(d => ({ ...d, c80c: v }))} />
            <Field label="80D (Health)" value={ded.c80d} onChange={v => setDed(d => ({ ...d, c80d: v }))} />
            <Field label="NPS 1B (₹50K)" value={ded.nps} onChange={v => setDed(d => ({ ...d, nps: v }))} />
            <Field label="Home Loan Int" value={ded.homeLoan} onChange={v => setDed(d => ({ ...d, homeLoan: v }))} />
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
              className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border
                ${hra.metro ? 'bg-purple-500/10 border-purple-500/25 text-purple-400' : 'bg-white/[0.06] border-white/8 text-slate-500 hover:border-white/12'}`}>
              <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-bold ${hra.metro ? 'bg-purple-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {hra.metro && '✓'}
              </div>
              Metro city (50% of basic)
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {/* Winner Banner */}
            <div className={`p-5 rounded-2xl border-2 text-center ${result.better === 'new' ? 'bg-brand/5 border-brand/20' : 'bg-green-500/5 border-green-500/20'}`}>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Better Regime</div>
              <div className="text-2xl font-extrabold gradient-text">{result.better === 'new' ? 'New Regime' : 'Old Regime'}</div>
              <div className="text-green-400 font-bold mt-1">You save {fmt(result.saving)}</div>
            </div>

            {/* Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'New Regime', data: result.newBreakdown, taxable: result.newTaxable, total: result.newTotal, color: 'brand', better: result.better === 'new' },
                { label: 'Old Regime', data: result.oldBreakdown, taxable: result.oldTaxable, total: result.oldTotal, color: 'emerald', better: result.better === 'old' },
              ].map(regime => (
                <div key={regime.label} className={`p-5 rounded-2xl border transition-all ${regime.better ? `bg-${regime.color === 'brand' ? 'brand' : 'emerald-500'}/5 border-${regime.color === 'brand' ? 'brand' : 'emerald-500'}/20` : 'bg-white/[0.05] border-white/8'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-bold ${regime.better ? (regime.color === 'brand' ? 'text-brand-light' : 'text-emerald-400') : 'text-slate-400'}`}>{regime.label}</h3>
                    {regime.better && <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">BETTER</span>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-500">Taxable Income</span><span className="text-white font-medium">{fmt(regime.taxable)}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-500">Tax</span><span className="text-white font-medium">{fmt(regime.data.tax)}</span></div>
                    {regime.data.surcharge > 0 && <div className="flex justify-between text-xs"><span className="text-slate-500">Surcharge</span><span className="text-white font-medium">{fmt(regime.data.surcharge)}</span></div>}
                    <div className="flex justify-between text-xs"><span className="text-slate-500">Cess (4%)</span><span className="text-white font-medium">{fmt(regime.data.cess)}</span></div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/8">
                      <span className="text-white">Total Tax</span>
                      <span className={regime.better ? (regime.color === 'brand' ? 'text-brand-light' : 'text-emerald-400') : 'text-slate-300'}>{fmt(regime.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
