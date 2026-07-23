import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'

export default function hra_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [basicSalary, setBasicSalary] = useState('')
  const [hraReceived, setHraReceived] = useState('')
  const [rentPaid, setRentPaid] = useState('')
  const [cityType, setCityType] = useState('metro')

  const calculate = useCallback(() => {
    const basic = parseFloat(basicSalary) || 0
    const hra = parseFloat(hraReceived) || 0
    const rent = parseFloat(rentPaid) || 0
    const metro = cityType === 'metro'

    if (basic <= 0) return null

    const pctOfBasic = metro ? basic * 0.5 : basic * 0.4
    const rentMinus10 = Math.max(0, rent - basic * 0.1)
    const exempt = Math.min(hra, pctOfBasic, rentMinus10)
    const taxable = Math.max(0, hra - exempt)

    return { hra, pctOfBasic, rentMinus10, exempt, taxable }
  }, [basicSalary, hraReceived, rentPaid, cityType])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="HRA Calculator"
      desc="Calculate House Rent Allowance (HRA) exemption for Indian salaried employees. Free online tool by UpTools."
      icon="🏠" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="hra-calculator"
      faq={[
        { q: "What is HRA?", a: "House Rent Allowance (HRA) is a component of salary provided by employers to cover rent expenses. A portion of HRA is exempt from tax under Section 10(13A) of the Income Tax Act." },
        { q: "How is HRA exemption calculated?", a: "HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of basic salary (metro) or 40% (non-metro), (3) Rent paid minus 10% of basic salary." },
      ]}
      howItWorks={[
        "Enter your basic salary, HRA received, and rent paid.",
        "Select metro or non-metro city.",
        "Click Calculate to see HRA exemption and taxable HRA amount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "HRA Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/hra-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Basic Salary (₹)</label>
            <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="Enter basic salary" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">HRA Received (₹)</label>
            <input type="number" value={hraReceived} onChange={(e) => setHraReceived(e.target.value)}
              placeholder="Enter HRA amount" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Rent Paid (₹)</label>
            <input type="number" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)}
              placeholder="Enter rent paid" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">City Type</label>
            <select value={cityType} onChange={(e) => setCityType(e.target.value)} className={selectClass}>
              <option value="metro">Metro City (50% of Basic)</option>
              <option value="nonmetro">Non-Metro City (40% of Basic)</option>
            </select>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Actual HRA', value: fmtINR(result.hra), color: 'text-white' },
                { label: `${cityType === 'metro' ? '50%' : '40%'} of Basic`, value: fmtINR(result.pctOfBasic), color: 'text-white' },
                { label: 'Rent - 10% Basic', value: fmtINR(result.rentMinus10), color: 'text-white' },
                { label: 'HRA Exempt', value: fmtINR(result.exempt), color: 'text-green-400' },
                { label: 'Taxable HRA', value: fmtINR(result.taxable), color: 'text-rose-400' },
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
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter salary details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
