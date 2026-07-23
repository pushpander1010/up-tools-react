import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function epf_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [basicSalary, setBasicSalary] = useState('')
  const [empRate, setEmpRate] = useState('12')
  const [erRate, setErRate] = useState('12')
  const [interestRate, setInterestRate] = useState('8.25')
  const [years, setYears] = useState('30')
  const [annualInc, setAnnualInc] = useState('5')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const calculate = useCallback(() => {
    const basic = parseFloat(basicSalary) || 0
    const er = parseFloat(empRate) / 100, err = parseFloat(erRate) / 100
    const rate = parseFloat(interestRate) / 100
    const y = parseInt(years) || 30, ai = parseFloat(annualInc) / 100

    if (basic <= 0 || y <= 0) return

    let totalBalance = 0, totalEmp = 0, totalEr = 0, currentBasic = basic
    for (let i = 0; i < y; i++) {
      const empC = currentBasic * er * 12, erC = currentBasic * err * 12
      totalBalance = (totalBalance + empC + erC) * (1 + rate)
      totalEmp += empC; totalEr += erC
      currentBasic *= (1 + ai)
    }

    const totalContrib = totalEmp + totalEr
    const interestEarned = totalBalance - totalContrib
    setResult({ totalEmp, totalEr, total: totalContrib, interest: interestEarned, maturity: totalBalance })
    setTimeout(() => jumpTo(), 50)
  }, [basicSalary, empRate, erRate, interestRate, years, annualInc, jumpTo])

  const toCSV = useCallback(() => {
    if (!result) return
    const csv = 'Component,Amount\nEmployee Total,' + fmt(result.totalEmp) + '\nEmployer Total,' + fmt(result.totalEr) + '\nTotal Contribution,' + fmt(result.total) + '\nInterest Earned,' + fmt(result.interest) + '\nMaturity Amount,' + fmt(result.maturity)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'epf_maturity.csv'; a.click()
    URL.revokeObjectURL(url)
  }, [result])

  const copyShare = useCallback(async () => {
    const q = new URLSearchParams()
    ;['basicSalary', 'empRate', 'erRate', 'interestRate', 'years', 'annualInc'].forEach((k, i) => {
      const v = [basicSalary, empRate, erRate, interestRate, years, annualInc][i]
      if (v) q.set(k, v)
    })
    const url = window.location.origin + window.location.pathname + '?' + q.toString()
    try { await navigator.clipboard.writeText(url) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [basicSalary, empRate, erRate, interestRate, years, annualInc])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="EPF Calculator"
      desc="Calculate EPF maturity amount with employee & employer contributions. See compound interest growth."
      icon="🏦" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="epf-calculator"
      faq={[
        { q: "What is the current EPF interest rate?", a: "The EPF interest rate for FY 2023-24 is 8.25% per annum. Rates may change annually as declared by EPFO." },
        { q: "Is EPF contribution mandatory?", a: "Yes, for organizations with 20+ employees. Both employee and employer must contribute 12% of basic salary + DA." },
      ]}
      howItWorks={[
        "Enter your monthly basic salary.",
        "Set employee and employer contribution rates.",
        "Enter the EPF interest rate and years of service.",
        "View employee, employer, and total contributions with maturity amount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "EPF Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/epf-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Monthly Basic Salary (₹)', value: basicSalary, set: setBasicSalary, ph: '30000' },
              { label: 'Employee Contribution (%)', value: empRate, set: setEmpRate, ph: '12' },
              { label: 'Employer Contribution (%)', value: erRate, set: setErRate, ph: '12' },
              { label: 'EPF Interest Rate (% p.a.)', value: interestRate, set: setInterestRate, ph: '8.25' },
              { label: 'Years of Service', value: years, set: setYears, ph: '30' },
              { label: 'Annual Salary Increase (%)', value: annualInc, set: setAnnualInc, ph: '5' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.ph} className={inputClass} />
              </div>
            ))}
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
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">EPF Maturity Summary</h3>
            <div className="space-y-0">
              {[
                { label: 'Employee Contribution (Total)', value: fmt(result.totalEmp), color: 'text-slate-300' },
                { label: 'Employer Contribution (Total)', value: fmt(result.totalEr), color: 'text-slate-300' },
                { label: 'Total Contribution', value: fmt(result.total), color: 'text-slate-300' },
                { label: 'Interest Earned', value: fmt(result.interest), color: 'text-purple-400' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-slate-300">EPF Maturity Amount</span>
                <span className="text-xl font-bold text-emerald-400">{fmt(result.maturity)}</span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter basic salary and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
