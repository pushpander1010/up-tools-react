import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'

export default function gratuity_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [salary, setSalary] = useState('')
  const [years, setYears] = useState('10')

  const calculate = useCallback(() => {
    const sal = parseFloat(salary) || 0
    const yrs = parseInt(years) || 0
    if (sal <= 0 || yrs < 5) return null

    const gratuity = (15 * sal * yrs) / 26
    const exemptLimit = 2000000
    const exempt = Math.min(gratuity, exemptLimit)
    const taxable = Math.max(0, gratuity - exemptLimit)

    return { sal, yrs, gratuity, exempt, taxable }
  }, [salary, years])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Gratuity Calculator"
      desc="Calculate gratuity amount for Indian employees. Free online tool by UpTools."
      icon="💰" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="gratuity-calculator"
      faq={[
        { q: "What is Gratuity?", a: "Gratuity is a lump sum payment given by an employer to an employee who has rendered continuous service for 5 or more years. It is calculated as (15 × Last Drawn Salary × Years of Service) / 26." },
        { q: "Is Gratuity tax-exempt?", a: "Yes, up to ₹20,00,000 (₹20 lakhs) under Section 10(10) of the Income Tax Act. Any amount above this limit is taxable." },
      ]}
      howItWorks={[
        "Enter your last drawn monthly salary.",
        "Enter your total years of service (minimum 5 years required).",
        "Click Calculate to see gratuity amount, tax-exempt limit, and taxable portion.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Gratuity Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gratuity-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Last Drawn Monthly Salary (₹)</label>
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter monthly salary" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Years of Service</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
              placeholder="Minimum 5 years" min="5" max="50" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Monthly Salary', value: fmtINR(result.sal), color: 'text-white' },
                { label: 'Years of Service', value: result.yrs + ' years', color: 'text-white' },
                { label: 'Gratuity Amount', value: fmtINR(result.gratuity), color: 'text-amber-400' },
                { label: 'Tax Exempt', value: fmtINR(result.exempt), color: 'text-green-400' },
                { label: 'Taxable Amount', value: fmtINR(result.taxable), color: 'text-rose-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter salary and years (min 5) to calculate gratuity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
