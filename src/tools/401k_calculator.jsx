import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
const fmt = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })

export default function tool_401k_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [age, setAge] = useState(30)
  const [retireAge, setRetireAge] = useState(65)
  const [salary, setSalary] = useState(75000)
  const [contribution, setContribution] = useState(6)
  const [employerMatch, setEmployerMatch] = useState(50)
  const [matchLimit, setMatchLimit] = useState(6)
  const [currentBalance, setCurrentBalance] = useState(25000)
  const [returnRate, setReturnRate] = useState(7)
  const [salaryIncrease, setSalaryIncrease] = useState(3)
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const years = Math.max(0, (parseInt(retireAge) || 65) - (parseInt(age) || 30))
    let balance = parseFloat(currentBalance) || 0
    let totalYourContrib = 0, totalEmployerContrib = 0
    let currentSalary = parseFloat(salary) || 75000
    const cPct = parseFloat(contribution) || 6
    const eMatchPct = parseFloat(employerMatch) || 50
    const mLimitPct = parseFloat(matchLimit) || 6
    const rRate = parseFloat(returnRate) || 7
    const sIncrease = parseFloat(salaryIncrease) || 3

    for (let i = 0; i < years; i++) {
      const yourContrib = currentSalary * (cPct / 100)
      const matchable = Math.min(yourContrib, currentSalary * (mLimitPct / 100))
      const employerContrib = matchable * (eMatchPct / 100)
      totalYourContrib += yourContrib
      totalEmployerContrib += employerContrib
      balance += yourContrib + employerContrib
      balance *= (1 + rRate / 100)
      currentSalary *= (1 + sIncrease / 100)
    }
    const growth = balance - (parseFloat(currentBalance) || 0) - totalYourContrib - totalEmployerContrib
    const tip = cPct < mLimitPct
      ? `You're leaving free money on the table! Increase to ${mLimitPct}% to get the full match.`
      : null
    setResult({ years, totalYourContrib, totalEmployerContrib, growth, balance, tip })
  }, [age, retireAge, salary, contribution, employerMatch, matchLimit, currentBalance, returnRate, salaryIncrease])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  const fields = [
    { label: 'Current Age', value: age, set: setAge, min: 18, max: 100, step: 1 },
    { label: 'Retirement Age', value: retireAge, set: setRetireAge, min: 50, max: 80, step: 1 },
    { label: 'Annual Salary ($)', value: salary, set: setSalary, step: 1000, min: 0 },
    { label: 'Your Contribution (%)', value: contribution, set: setContribution, step: 0.5, min: 0, max: 100 },
    { label: 'Employer Match (%)', value: employerMatch, set: setEmployerMatch, step: 1, min: 0, max: 100, help: '% of your contribution' },
    { label: 'Match Limit (% of salary)', value: matchLimit, set: setMatchLimit, step: 0.5, min: 0, max: 20 },
    { label: 'Current 401k Balance ($)', value: currentBalance, set: setCurrentBalance, step: 1000, min: 0 },
    { label: 'Expected Annual Return (%)', value: returnRate, set: setReturnRate, step: 0.1, min: 0, max: 20, help: 'Historical average: 7-10%' },
    { label: 'Annual Salary Increase (%)', value: salaryIncrease, set: setSalaryIncrease, step: 0.5, min: 0, max: 10 },
  ]

  return (
    <ToolLayout
      title="401k Calculator"
      desc="Calculate your 401k retirement savings with employer match, tax benefits, and investment growth projections."
      icon="💰" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="401k-calculator"
      faq={[
        { q: "How much should I contribute to my 401k?", a: "Financial experts recommend contributing at least enough to get your full employer match (typically 3-6% of salary). Ideally, aim for 10-15% of your gross income." },
        { q: "What is employer 401k matching?", a: "Employer matching is when your company contributes money to your 401k based on your contributions. Common matches are 50% or 100% of your contribution up to 3-6% of your salary." },
      ]}
      howItWorks={[
        "Enter your current age, retirement age, salary, and contribution details.",
        "Set employer match percentage and match limit.",
        "Click Calculate to see projected 401k balance at retirement.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "401k Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/401k-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                min={f.min} max={f.max} step={f.step || 1} className={inputClass} />
              {f.help && <p className="text-[11px] text-slate-500 mt-1">{f.help}</p>}
            </div>
          ))}
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate 401k Savings
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">401k Results</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Years Until Retirement', value: result.years, color: 'text-white' },
                { label: 'Your Total Contributions', value: fmt(result.totalYourContrib), color: 'text-white' },
                { label: 'Employer Match Contributions', value: fmt(result.totalEmployerContrib), color: 'text-emerald-400' },
                { label: 'Investment Growth', value: fmt(result.growth), color: 'text-amber-400' },
                { label: 'Total 401k Balance', value: fmt(result.balance), color: 'text-indigo-300 text-2xl font-extrabold' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            {result.tip && (
              <div className="mt-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/20 p-4">
                <p className="text-sm text-amber-300 font-medium">💡 {result.tip}</p>
              </div>
            )}
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter your details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
