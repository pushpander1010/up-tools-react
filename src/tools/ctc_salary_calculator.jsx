import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

function calcIncomeTax(annualIncome, regime) {
  if (regime === 'new') {
    const slabs = [[300000, 0], [300000, 0.05], [300000, 0.10], [300000, 0.15], [300000, 0.20], [Infinity, 0.30]]
    let tax = 0, prev = 0
    for (const [limit, rate] of slabs) {
      const taxable = Math.min(annualIncome, limit) - prev
      if (taxable > 0) tax += taxable * rate
      prev = limit; if (annualIncome <= limit) break
    }
    return tax
  }
  const slabs = [[250000, 0], [250000, 0.05], [500000, 0.20], [Infinity, 0.30]]
  const deduction80C = 150000
  const taxableIncome = Math.max(0, annualIncome - deduction80C)
  let tax = 0, prev = 0
  for (const [limit, rate] of slabs) {
    const taxable = Math.min(taxableIncome, limit) - prev
    if (taxable > 0) tax += taxable * rate
    prev = limit; if (taxableIncome <= limit) break
  }
  return tax
}

export default function ctc_salary_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [ctc, setCtc] = useState('')
  const [basicPct, setBasicPct] = useState('40')
  const [hraPct, setHraPct] = useState('50')
  const [taxRegime, setTaxRegime] = useState('new')
  const [pfPct, setPfPct] = useState('12')
  const [ptAmount, setPtAmount] = useState('200')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const calculate = useCallback(() => {
    const c = parseFloat(ctc) || 0
    if (c <= 0) return
    const bp = parseFloat(basicPct) / 100, hp = parseFloat(hraPct) / 100
    const pp = parseFloat(pfPct) / 100, pt = parseFloat(ptAmount)
    const basicAnnual = c * bp, hraAnnual = basicAnnual * hp
    const pfAnnual = basicAnnual * pp, ptAnnual = pt * 12
    const grossTaxable = c - pfAnnual
    const incomeTax = calcIncomeTax(grossTaxable, taxRegime)
    const inHandAnnual = c - pfAnnual - ptAnnual - incomeTax
    const inHandMonthly = inHandAnnual / 12
    setResult({ ctc: c, basic: basicAnnual, hra: hraAnnual, pf: pfAnnual, pt: ptAnnual, tax: incomeTax, annual: inHandAnnual, monthly: inHandMonthly })
    setTimeout(() => jumpTo(), 50)
  }, [ctc, basicPct, hraPct, taxRegime, pfPct, ptAmount, jumpTo])

  const copyShare = useCallback(async () => {
    const q = new URLSearchParams()
    if (ctc) q.set('ctc', ctc); if (basicPct !== '40') q.set('basic', basicPct)
    if (hraPct !== '50') q.set('hra', hraPct); if (taxRegime !== 'new') q.set('regime', taxRegime)
    const url = window.location.origin + window.location.pathname + '?' + q.toString()
    try { await navigator.clipboard.writeText(url) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [ctc, basicPct, hraPct, taxRegime])

  const toCSV = useCallback(() => {
    if (!result) return
    const csv = 'Component,Amount\nAnnual CTC,' + result.ctc + '\nBasic,' + fmt(result.basic) + '\nHRA,' + fmt(result.hra) + '\nPF,' + fmt(result.pf) + '\nProfessional Tax,' + fmt(result.pt) + '\nIncome Tax,' + fmt(result.tax) + '\nAnnual In-Hand,' + fmt(result.annual) + '\nMonthly In-Hand,' + fmt(result.monthly)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'ctc_salary_breakdown.csv'; a.click()
    URL.revokeObjectURL(url)
  }, [result])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="CTC to In-Hand Salary Calculator"
      desc="Convert CTC to in-hand salary with PF, tax deductions, and old/new regime comparison."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="ctc-salary-calculator"
      faq={[
        { q: "What is CTC?", a: "CTC (Cost to Company) is the total salary package offered by an employer, including all benefits and deductions." },
        { q: "What is the difference between old and new tax regime?", a: "New regime has lower tax rates but no deductions. Old regime allows deductions like 80C, HRA, etc." },
      ]}
      howItWorks={[
        "Enter your annual CTC and basic salary percentage.",
        "Set HRA, PF rate, and professional tax.",
        "Choose between old and new tax regime.",
        "View complete salary breakdown.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CTC to In-Hand Salary Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ctc-salary-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Annual CTC (₹)', value: ctc, set: setCtc, ph: '800000' },
              { label: 'Basic Salary (% of CTC)', value: basicPct, set: setBasicPct, ph: '40' },
              { label: 'HRA (% of Basic)', value: hraPct, set: setHraPct, ph: '50' },
              { label: 'PF Rate (% of Basic)', value: pfPct, set: setPfPct, ph: '12' },
              { label: 'Professional Tax (₹/month)', value: ptAmount, set: setPtAmount, ph: '200' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.ph} className={inputClass} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tax Regime</label>
              <select value={taxRegime} onChange={e => setTaxRegime(e.target.value)} className={inputClass}>
                <option value="new">New Regime (Default)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { calculate(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
              Calculate
            </button>
            <button onClick={toCSV}
              className="px-4 py-3 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
              📥 CSV
            </button>
            <button onClick={copyShare}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied!' : '🔗 Share'}
            </button>
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Salary Breakdown</h3>
            <div className="space-y-0">
              {[
                { label: 'Annual CTC', value: fmt(result.ctc), color: 'text-white' },
                { label: 'Basic Salary', value: fmt(result.basic), color: 'text-slate-300' },
                { label: 'HRA', value: fmt(result.hra), color: 'text-slate-300' },
                { label: 'PF Deduction', value: fmt(result.pf), color: 'text-red-400' },
                { label: 'Professional Tax', value: fmt(result.pt), color: 'text-red-400' },
                { label: 'Income Tax', value: fmt(result.tax), color: 'text-red-400' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-slate-300">Annual In-Hand</span>
                <span className="text-lg font-bold text-emerald-400">{fmt(result.annual)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-slate-300">Monthly In-Hand</span>
                <span className="text-xl font-bold text-emerald-400">{fmt(result.monthly)}</span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter CTC and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
